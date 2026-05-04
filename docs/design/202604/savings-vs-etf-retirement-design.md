# 월 적금 vs ETF 노후 계산기 — 설계 문서

> 기획 원문: `docs/plan-docs/202604/savings-vs-etf-retirement.md`  
> 작성일: 2026-04-27  
> 구현 기준: Codex/Claude가 이 문서를 보고 바로 Astro 계산기 페이지 구현을 시작할 수 있는 수준  
> 참고 계산기: `retirement-fund-depletion`, `dca-investment-calculator`, `irp-pension-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `월 적금 vs ETF 노후 계산기`
- 슬러그: `savings-vs-etf-retirement`
- URL: `/tools/savings-vs-etf-retirement/`
- 콘텐츠 유형: 인터랙티브 계산기 (`/tools/`)
- 카테고리: `투자·연금·노후`
- 핵심 검색 의도: `노후 준비 적금 ETF 비교 계산기`, `ETF 장기투자 계산기`, `은퇴자금 계산기`

### 1-2. 페이지 정의

> 현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면
> 은퇴 시점의 적금/ETF 예상 자산, 현재가치 환산 금액, 월 생활비 커버 기간,
> 은퇴 후 자산 고갈 예상 나이를 비교하는 노후 준비 계산기

### 1-3. 구현 원칙

- ETF 결과는 확정 수익이 아니라 `기대수익률 기반 시뮬레이션`으로 표시한다.
- 적금과 ETF를 단순 총액만 비교하지 않고 `실질 구매력`, `생활비 커버 기간`, `자산 고갈 시점`까지 보여준다.
- 사용자 facing 텍스트는 한국어만 사용한다.
- 세금, 배당소득세, ETF 보수율, 연금계좌 세액공제는 v1에서 단순화하되, 입력 옵션과 안내 문구를 제공한다.
- 기본값만으로 첫 진입 즉시 결과가 보여야 한다.
- 모바일에서는 결과 요약을 먼저 보고 입력값을 조정하는 흐름을 우선한다.

---

## 2. 파일 구조

```text
src/
  data/
    savingsVsEtfRetirement.ts
  pages/
    tools/
      savings-vs-etf-retirement.astro

public/
  scripts/
    savings-vs-etf-retirement.js
  og/
    tools/
      savings-vs-etf-retirement.png

src/styles/scss/pages/
  _savings-vs-etf-retirement.scss
```

### 2-1. 추가 반영 파일

- `src/data/tools.ts`
- `src/pages/index.astro`
- `src/pages/tools/index.astro`가 별도 카테고리 매핑을 요구하면 함께 확인
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 레이아웃 및 쉘

### 3-1. 공통 컴포넌트

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`

### 3-2. 권장 설정

```astro
<SimpleToolShell
  calculatorId="savings-vs-etf-retirement"
  pageClass="sver-page"
  resultFirst={true}
>
```

### 3-3. 페이지 톤

- `ETF가 무조건 유리하다`는 식의 단정 표현을 피한다.
- 장기 기대수익률과 원금 손실 가능성을 함께 보여준다.
- 적금은 `안정성`, ETF는 `장기 성장 가능성`으로 균형 있게 설명한다.
- 노후 준비 계산기이므로 결과가 부족하게 나와도 불안을 과도하게 자극하지 않고 조정 가능한 입력값을 안내한다.

---

## 4. 데이터 파일 설계 (`src/data/savingsVsEtfRetirement.ts`)

### 4-1. 타입 정의

```ts
export type ContributionTiming = "end" | "begin";
export type RiskScenarioId = "conservative" | "balanced" | "growth";
export type WithdrawalMode = "fixed" | "inflationAdjusted";
export type ResultStatus = "savingsBetter" | "etfBetter" | "similar";

export interface RetirementCompareInput {
  currentAge: number;
  retirementAge: number;
  monthlyAmount: number;
  savingsAnnualRate: number;
  etfAnnualReturn: number;
  etfFeeRate: number;
  inflationRate: number;
  monthlyLivingCost: number;
  postRetirementReturn: number;
  contributionTiming: ContributionTiming;
  withdrawalMode: WithdrawalMode;
  includeTax: boolean;
  expectedMonthlyPension: number;
}

export interface RetirementComparePreset {
  id: RiskScenarioId;
  label: string;
  description: string;
  savingsAnnualRate: number;
  etfAnnualReturn: number;
  etfFeeRate: number;
  inflationRate: number;
  postRetirementReturn: number;
}

export interface RetirementCompareResult {
  yearsToRetirement: number;
  monthsToRetirement: number;
  savingsFutureValue: number;
  etfFutureValue: number;
  savingsRealValue: number;
  etfRealValue: number;
  nominalGap: number;
  realGap: number;
  savingsCoverYears: number;
  etfCoverYears: number;
  savingsDepletionAge: number | null;
  etfDepletionAge: number | null;
  savingsShortfallTo90: number;
  etfShortfallTo90: number;
  breakEvenMonthlyAmountSavings: number;
  breakEvenMonthlyAmountEtf: number;
  status: ResultStatus;
  statusMessage: string;
}

export interface RetirementCompareFaqItem {
  q: string;
  a: string;
}

export interface RetirementCompareRelatedLink {
  href: string;
  label: string;
}
```

### 4-2. 메타 상수

```ts
export const SVER_META = {
  slug: "savings-vs-etf-retirement",
  title: "월 적금 vs ETF 노후 계산기",
  subtitle:
    "현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점 자산과 실질 구매력을 비교합니다.",
  updatedAt: "2026년 4월",
  caution:
    "ETF 수익률은 확정 수익이 아니라 사용자가 입력한 기대수익률 기반 시뮬레이션입니다. 실제 투자 결과는 시장 상황, 세금, 보수, 환율에 따라 달라질 수 있습니다.",
} as const;
```

### 4-3. 기본 입력값

```ts
export const SVER_DEFAULT_INPUT: RetirementCompareInput = {
  currentAge: 35,
  retirementAge: 60,
  monthlyAmount: 500000,
  savingsAnnualRate: 3.5,
  etfAnnualReturn: 7.0,
  etfFeeRate: 0.2,
  inflationRate: 2.5,
  monthlyLivingCost: 2500000,
  postRetirementReturn: 3.0,
  contributionTiming: "end",
  withdrawalMode: "fixed",
  includeTax: false,
  expectedMonthlyPension: 0,
};
```

### 4-4. 시나리오 프리셋

```ts
export const SVER_PRESETS: RetirementComparePreset[] = [
  {
    id: "conservative",
    label: "보수형",
    description: "원금 안정성과 낮은 변동성을 더 중요하게 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 4.5,
    etfFeeRate: 0.2,
    inflationRate: 2.5,
    postRetirementReturn: 2.0,
  },
  {
    id: "balanced",
    label: "중립형",
    description: "적금 안정성과 ETF 장기 수익 가능성을 함께 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 7.0,
    etfFeeRate: 0.2,
    inflationRate: 2.5,
    postRetirementReturn: 3.0,
  },
  {
    id: "growth",
    label: "성장형",
    description: "장기 ETF 투자 비중을 높게 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 9.0,
    etfFeeRate: 0.25,
    inflationRate: 2.5,
    postRetirementReturn: 4.0,
  },
];
```

### 4-5. 가이드/관련 링크/FAQ

```ts
export const SVER_GUIDE_POINTS = [
  {
    title: "명목 금액보다 실질 구매력이 중요합니다.",
    description: "은퇴 시점의 5억 원은 현재의 5억 원과 구매력이 다릅니다. 물가상승률을 반영해 현재가치로 함께 보여줍니다.",
  },
  {
    title: "ETF는 장기 기대수익률과 손실 가능성을 함께 봐야 합니다.",
    description: "장기 투자에서는 복리 효과가 커질 수 있지만, 단기 하락 구간과 원금 손실 가능성도 존재합니다.",
  },
  {
    title: "은퇴 후에는 총액보다 현금흐름이 중요합니다.",
    description: "은퇴 시점 자산이 월 생활비를 몇 년 커버하는지, 몇 세에 고갈되는지까지 함께 계산합니다.",
  },
];

export const SVER_RELATED_LINKS: RetirementCompareRelatedLink[] = [
  { label: "노후 자금 고갈 계산기", href: "/tools/retirement-fund-depletion/" },
  { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
  { label: "IRP 연금 계산기", href: "/tools/irp-pension-calculator/" },
  { label: "퇴직연금 DC·DB·IRP 비교 2026", href: "/reports/retirement-pension-dc-db-irp-2026/" },
  { label: "연금저축·IRP 비교 리포트", href: "/reports/pension-irp-comparison-2026/" },
];

export const SVER_FAQ: RetirementCompareFaqItem[] = [
  {
    q: "노후 준비는 적금과 ETF 중 무엇이 더 좋나요?",
    a: "정답은 투자 기간과 위험 성향에 따라 다릅니다. 1~3년 안에 써야 할 돈은 적금이 적합하고, 10년 이상 장기 노후자금은 ETF를 함께 검토할 수 있습니다.",
  },
  {
    q: "ETF 기대수익률은 몇 %로 넣어야 하나요?",
    a: "보수적으로는 4~5%, 중립적으로는 6~7%, 공격적으로는 8% 이상을 가정할 수 있습니다. 다만 실제 수익률은 시장 상황에 따라 크게 달라질 수 있습니다.",
  },
  {
    q: "물가상승률은 왜 입력해야 하나요?",
    a: "은퇴 시점의 돈은 현재와 구매력이 다릅니다. 물가상승률을 반영해야 실제 생활비 기준으로 얼마나 가치가 있는지 볼 수 있습니다.",
  },
  {
    q: "월 생활비 커버 기간은 어떻게 계산하나요?",
    a: "기본적으로 은퇴 시점 예상 자산을 은퇴 후 월 생활비로 나누어 계산합니다. 고급 결과에서는 은퇴 후 운용수익률을 반영한 자산 고갈 시점도 함께 계산합니다.",
  },
  {
    q: "연금저축이나 IRP도 계산에 포함해야 하나요?",
    a: "노후 목적의 장기자금이라면 함께 검토하는 것이 좋습니다. 연금저축과 IRP는 세액공제 혜택이 있어 일반 ETF 투자와 별도로 비교할 가치가 있습니다.",
  },
  {
    q: "ETF는 원금 손실 가능성이 있나요?",
    a: "네. ETF는 시장 가격이 변동되므로 손실이 발생할 수 있습니다. 은퇴 시점이 가까울수록 안전자산 비중을 높이는 전략이 필요할 수 있습니다.",
  },
];
```

---

## 5. 계산 로직

### 5-1. 입력 검증

```js
function normalizeInput(raw) {
  const currentAge = clamp(toNumber(raw.currentAge), 18, 75);
  const retirementAge = clamp(toNumber(raw.retirementAge), currentAge + 1, 85);

  return {
    currentAge,
    retirementAge,
    monthlyAmount: clamp(toNumber(raw.monthlyAmount), 0, 10000000),
    savingsAnnualRate: clamp(toNumber(raw.savingsAnnualRate), 0, 15),
    etfAnnualReturn: clamp(toNumber(raw.etfAnnualReturn), -20, 20),
    etfFeeRate: clamp(toNumber(raw.etfFeeRate), 0, 3),
    inflationRate: clamp(toNumber(raw.inflationRate), 0, 10),
    monthlyLivingCost: clamp(toNumber(raw.monthlyLivingCost), 0, 20000000),
    postRetirementReturn: clamp(toNumber(raw.postRetirementReturn), -10, 15),
    contributionTiming: raw.contributionTiming === "begin" ? "begin" : "end",
    withdrawalMode: raw.withdrawalMode === "inflationAdjusted" ? "inflationAdjusted" : "fixed",
    includeTax: Boolean(raw.includeTax),
    expectedMonthlyPension: clamp(toNumber(raw.expectedMonthlyPension), 0, 10000000),
  };
}
```

### 5-2. 월 적립식 미래가치

```js
function getMonthlyRate(annualRatePercent) {
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

function futureValueOfMonthlyContribution(monthlyAmount, annualRatePercent, months, timing) {
  const monthlyRate = getMonthlyRate(annualRatePercent);
  if (months <= 0 || monthlyAmount <= 0) return 0;
  if (monthlyRate === 0) return monthlyAmount * months;

  const endValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return timing === "begin" ? endValue * (1 + monthlyRate) : endValue;
}
```

### 5-3. 적금/ETF 적용 수익률

```js
function getSavingsRate(input) {
  if (!input.includeTax) return input.savingsAnnualRate;
  // 이자소득세 15.4%를 단순 반영한 근사값
  return input.savingsAnnualRate * (1 - 0.154);
}

function getEtfRate(input) {
  const gross = input.etfAnnualReturn - input.etfFeeRate;
  if (!input.includeTax) return gross;
  // ETF 과세는 계좌/상품/배당/매매차익에 따라 다르므로 v1은 보수적 단순 차감
  return gross * (1 - 0.154);
}
```

화면에는 반드시 아래 문구를 넣는다.

```text
세금 반영은 단순 추정입니다. 실제 세금은 계좌 유형, ETF 유형, 배당, 매매차익, 보유 기간에 따라 달라질 수 있습니다.
```

### 5-4. 실질 구매력

```js
function realValueAtToday(futureValue, inflationRatePercent, years) {
  return futureValue / Math.pow(1 + inflationRatePercent / 100, years);
}
```

### 5-5. 생활비 커버 기간

```js
function coverYears(asset, monthlyLivingCost, expectedMonthlyPension) {
  const netMonthlyCost = Math.max(0, monthlyLivingCost - expectedMonthlyPension);
  if (netMonthlyCost <= 0) return null;
  return asset / netMonthlyCost / 12;
}
```

`null`이면 `연금 입력값 기준으로 월 생활비 부족분이 없습니다`라고 표시한다.

### 5-6. 은퇴 후 자산 고갈 시점

```js
function calculateDepletionAge({
  initialAsset,
  retirementAge,
  monthlyLivingCost,
  expectedMonthlyPension,
  postRetirementReturn,
  inflationRate,
  withdrawalMode,
  maxAge = 100,
}) {
  let asset = initialAsset;
  let monthlyWithdrawal = Math.max(0, monthlyLivingCost - expectedMonthlyPension);
  const monthlyRate = getMonthlyRate(postRetirementReturn);
  const monthlyInflation = getMonthlyRate(inflationRate);
  const maxMonths = (maxAge - retirementAge) * 12;

  if (monthlyWithdrawal <= 0) return null;

  for (let month = 1; month <= maxMonths; month += 1) {
    asset = asset * (1 + monthlyRate) - monthlyWithdrawal;

    if (asset <= 0) {
      return retirementAge + Math.floor(month / 12);
    }

    if (withdrawalMode === "inflationAdjusted") {
      monthlyWithdrawal *= 1 + monthlyInflation;
    }
  }

  return null;
}
```

### 5-7. 90세까지 부족 금액

```js
function shortfallToTargetAge(initialAsset, input, targetAge = 90) {
  let asset = initialAsset;
  let monthlyWithdrawal = Math.max(0, input.monthlyLivingCost - input.expectedMonthlyPension);
  const monthlyReturn = getMonthlyRate(input.postRetirementReturn);
  const monthlyInflation = getMonthlyRate(input.inflationRate);
  const months = Math.max(0, (targetAge - input.retirementAge) * 12);

  for (let month = 1; month <= months; month += 1) {
    asset = asset * (1 + monthlyReturn) - monthlyWithdrawal;
    if (input.withdrawalMode === "inflationAdjusted") {
      monthlyWithdrawal *= 1 + monthlyInflation;
    }
  }

  return Math.max(0, -asset);
}
```

### 5-8. 전체 계산 함수

```js
function calculateSavingsVsEtfRetirement(input) {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  const savingsRate = getSavingsRate(input);
  const etfRate = getEtfRate(input);

  const savingsFutureValue = futureValueOfMonthlyContribution(
    input.monthlyAmount,
    savingsRate,
    monthsToRetirement,
    input.contributionTiming
  );

  const etfFutureValue = futureValueOfMonthlyContribution(
    input.monthlyAmount,
    etfRate,
    monthsToRetirement,
    input.contributionTiming
  );

  const savingsRealValue = realValueAtToday(savingsFutureValue, input.inflationRate, yearsToRetirement);
  const etfRealValue = realValueAtToday(etfFutureValue, input.inflationRate, yearsToRetirement);
  const nominalGap = etfFutureValue - savingsFutureValue;
  const realGap = etfRealValue - savingsRealValue;

  const savingsDepletionAge = calculateDepletionAge({
    initialAsset: savingsFutureValue,
    retirementAge: input.retirementAge,
    monthlyLivingCost: input.monthlyLivingCost,
    expectedMonthlyPension: input.expectedMonthlyPension,
    postRetirementReturn: input.postRetirementReturn,
    inflationRate: input.inflationRate,
    withdrawalMode: input.withdrawalMode,
  });

  const etfDepletionAge = calculateDepletionAge({
    initialAsset: etfFutureValue,
    retirementAge: input.retirementAge,
    monthlyLivingCost: input.monthlyLivingCost,
    expectedMonthlyPension: input.expectedMonthlyPension,
    postRetirementReturn: input.postRetirementReturn,
    inflationRate: input.inflationRate,
    withdrawalMode: input.withdrawalMode,
  });

  return {
    yearsToRetirement,
    monthsToRetirement,
    savingsFutureValue: Math.round(savingsFutureValue),
    etfFutureValue: Math.round(etfFutureValue),
    savingsRealValue: Math.round(savingsRealValue),
    etfRealValue: Math.round(etfRealValue),
    nominalGap: Math.round(nominalGap),
    realGap: Math.round(realGap),
    savingsCoverYears: coverYears(savingsFutureValue, input.monthlyLivingCost, input.expectedMonthlyPension),
    etfCoverYears: coverYears(etfFutureValue, input.monthlyLivingCost, input.expectedMonthlyPension),
    savingsDepletionAge,
    etfDepletionAge,
    savingsShortfallTo90: shortfallToTargetAge(savingsFutureValue, input, 90),
    etfShortfallTo90: shortfallToTargetAge(etfFutureValue, input, 90),
    status: Math.abs(nominalGap) < input.monthlyAmount * 12 ? "similar" : nominalGap > 0 ? "etfBetter" : "savingsBetter",
  };
}
```

---

## 6. 페이지 구성 (`src/pages/tools/savings-vs-etf-retirement.astro`)

### 6-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. 핵심 결과 KPI
4. 입력 패널
5. 적금 vs ETF 비교표
6. 명목/실질 자산 차트
7. 은퇴 후 자산 고갈 시뮬레이션
8. 시나리오 프리셋
9. 적금이 유리한 경우 / ETF가 유리한 경우
10. 연금저축·IRP CTA
11. FAQ
12. `SeoContent`

### 6-2. Hero

- eyebrow: `노후 준비 계산기`
- title: `월 적금 vs ETF 노후 계산기`
- description: `매월 같은 금액을 적금에 넣는 경우와 ETF에 장기 투자하는 경우의 은퇴 시점 자산, 실질 구매력, 생활비 커버 기간을 비교합니다.`
- badges:
  - `적금`
  - `ETF`
  - `물가 반영`
  - `자산 고갈 시점`

### 6-3. InfoNotice

필수 안내:

- ETF 수익률은 입력값 기반 기대수익률이며 확정 수익이 아니다.
- 세금 반영은 단순 추정이며 실제 과세는 계좌와 상품에 따라 달라진다.
- 의료비, 간병비, 주거비 급변, 연금 수령 조건은 별도 검토가 필요하다.

### 6-4. `slot="actions"` 입력 구성

#### A. 기본 정보

- 현재 나이
- 은퇴 목표 나이
- 월 투자 가능 금액
- 프리셋 버튼:
  - `월 30만`
  - `월 50만`
  - `월 100만`
  - `월 150만`

#### B. 수익률 가정

- 적금 금리
- ETF 기대수익률
- ETF 보수율
- 물가상승률
- 프리셋:
  - `보수형`
  - `중립형`
  - `성장형`

#### C. 은퇴 후 생활비

- 은퇴 후 월 생활비
- 국민연금 예상 월 수령액
- 은퇴 후 운용수익률
- 인출 방식:
  - `정액 인출`
  - `물가연동 인출`

#### D. 고급 옵션

- 납입 시점:
  - `월말 납입`
  - `월초 납입`
- 세금 단순 반영 여부

### 6-5. `slot="results"` 결과 구성

#### KPI 카드

| 카드 | 표시값 |
| --- | --- |
| 적금 은퇴자산 | `약 0원` |
| ETF 은퇴자산 | `약 0원` |
| ETF 추가 예상 자산 | `+0원` |
| ETF 실질가치 차이 | `+0원` |
| 적금 생활비 커버 | `0년` |
| ETF 생활비 커버 | `0년` |
| 적금 고갈 예상 | `00세` |
| ETF 고갈 예상 | `00세` |

각 카드에는 작은 배지로 `시뮬레이션` 또는 `현재가치`를 표시한다.

#### 결과 메시지

```text
현재 입력값 기준으로 ETF 예상 자산은 적금보다 약 0원 더 큽니다.
다만 ETF는 시장 변동에 따라 손실 구간이 발생할 수 있으므로 투자 기간과 위험 성향을 함께 고려해야 합니다.
```

#### 비교표

| 항목 | 적금 | ETF |
| --- | ---: | ---: |
| 은퇴 시점 명목 자산 | 0원 | 0원 |
| 현재가치 환산 | 0원 | 0원 |
| 월 생활비 커버 기간 | 0년 | 0년 |
| 자산 고갈 예상 나이 | 0세 | 0세 |
| 90세까지 부족 금액 | 0원 | 0원 |

---

## 7. 차트 설계

### 7-1. 명목/실질 자산 비교 차트

- Chart.js bar chart
- x축: `적금`, `ETF`
- y축: 금액
- dataset:
  - `은퇴 시점 명목 자산`
  - `현재가치 환산`

### 7-2. 은퇴 후 자산 잔액 차트

- Chart.js line chart
- x축: 나이
- y축: 잔액
- line:
  - 적금
  - ETF
- 자산이 0 이하가 되면 이후 구간은 0으로 고정해서 시각적으로 고갈 상태를 보여준다.

### 7-3. 차트 fallback

Chart.js 로드 실패 시 아래 리스트를 표시한다.

```html
<div class="sver-chart-fallback">
  <p>차트를 불러오지 못했습니다. 아래 비교표에서 계산 결과를 확인할 수 있습니다.</p>
</div>
```

---

## 8. JavaScript 설계 (`public/scripts/savings-vs-etf-retirement.js`)

### 8-1. 로드 규칙

```astro
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/savings-vs-etf-retirement.js")}></script>
```

데이터 전달:

```astro
<script
  id="savingsVsEtfRetirementData"
  type="application/json"
  set:html={JSON.stringify(seed)}
/>
```

### 8-2. 상태 객체

```js
const state = {
  currentAge: 35,
  retirementAge: 60,
  monthlyAmount: 500000,
  savingsAnnualRate: 3.5,
  etfAnnualReturn: 7.0,
  etfFeeRate: 0.2,
  inflationRate: 2.5,
  monthlyLivingCost: 2500000,
  postRetirementReturn: 3.0,
  contributionTiming: "end",
  withdrawalMode: "fixed",
  includeTax: false,
  expectedMonthlyPension: 0,
};
```

### 8-3. 함수 목록

| 함수 | 역할 |
| --- | --- |
| `loadSeed()` | JSON seed 파싱 |
| `restoreFromUrl()` | URL query 상태 복원 |
| `syncUrl()` | 현재 상태를 URL에 반영 |
| `bindInputs()` | number/select/toggle 이벤트 연결 |
| `bindQuickButtons()` | 월 투자금, 수익률 프리셋 버튼 연결 |
| `bindPresetButtons()` | 보수형/중립형/성장형 적용 |
| `calculate()` | 입력값 정규화 후 결과 계산 |
| `renderKpis()` | KPI 카드 갱신 |
| `renderComparisonTable()` | 적금/ETF 비교표 갱신 |
| `renderMessage()` | 결과 해석 문구 갱신 |
| `buildRetirementSeries()` | 은퇴 후 자산 잔액 차트용 데이터 생성 |
| `initCharts()` | Chart.js 차트 초기화 |
| `updateCharts()` | 계산 결과로 차트 갱신 |
| `resetState()` | 기본값 복원 |
| `copyShareUrl()` | 공유 URL 복사 |

### 8-4. URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `age` | 현재 나이 |
| `retire` | 은퇴 목표 나이 |
| `monthly` | 월 투자 가능 금액 |
| `sr` | 적금 금리 |
| `er` | ETF 기대수익률 |
| `fee` | ETF 보수율 |
| `inf` | 물가상승률 |
| `cost` | 은퇴 후 월 생활비 |
| `pr` | 은퇴 후 운용수익률 |
| `pension` | 국민연금 예상 월 수령액 |
| `tax` | 세금 단순 반영 여부 |

예시:

```text
/tools/savings-vs-etf-retirement/?age=35&retire=60&monthly=500000&sr=3.5&er=7&inf=2.5&cost=2500000
```

---

## 9. SCSS 설계 (`_savings-vs-etf-retirement.scss`)

### 9-1. 범위

- 페이지 루트: `.sver-page`
- 내부 prefix: `sver-`
- 전역 클래스 오염 금지
- 표, 차트, KPI는 기존 계산기 스타일과 호환되게 구성

### 9-2. 주요 블록

```scss
.sver-page {
  display: grid;
  gap: 24px;

  .sver-kpi-grid { ... }
  .sver-kpi-card { ... }
  .sver-input-panel { ... }
  .sver-input-grid { ... }
  .sver-quick-row { ... }
  .sver-compare-table { ... }
  .sver-chart-shell { ... }
  .sver-scenario-grid { ... }
  .sver-guide-grid { ... }
}
```

### 9-3. 색상 방향

- 적금: 안정감을 주는 blue 계열
- ETF: 성장성을 표현하는 green 계열
- 경고/주의: amber 계열
- 과한 단색 테마를 피하고 배경은 흰색/옅은 회색 중심

### 9-4. 반응형

- `900px` 이하: KPI 4열 → 2열
- `720px` 이하: 입력 grid 2열 → 1열
- `560px` 이하: KPI 1열, 차트 높이 260px
- 표는 모바일에서 `overflow-x: auto` 허용

---

## 10. 콘텐츠/SEO 구성

### 10-1. SEO 섹션 제목

1. 노후 준비에서 적금과 ETF를 같이 비교해야 하는 이유
2. 적금 예상 자산은 어떻게 계산하나요?
3. ETF 장기투자 예상 자산은 어떻게 계산하나요?
4. 물가상승률을 반영한 실질 구매력 계산
5. 월 생활비 기준 은퇴자산 커버 기간
6. 은퇴 후 자산 고갈 시점 계산
7. 적금이 유리한 경우
8. ETF가 유리한 경우
9. 연금저축·IRP와 함께 봐야 하는 이유
10. 계산 결과를 해석할 때 주의할 점

### 10-2. SeoContent 예시

```astro
<SeoContent
  introTitle="월 적금 vs ETF 노후 계산기 이용 안내"
  intro={[
    "매월 같은 금액을 넣어도 적금과 ETF는 은퇴 시점 결과가 크게 달라질 수 있습니다.",
    "이 계산기는 현재 나이, 은퇴 목표 나이, 월 투자 가능 금액, 적금 금리, ETF 기대수익률, 물가상승률을 입력해 은퇴 시점의 예상 자산과 실질 구매력을 비교합니다.",
    "또한 은퇴 후 매월 생활비를 인출하면 자산이 몇 세까지 버틸 수 있는지도 함께 계산할 수 있습니다.",
  ]}
  criteria={[
    "적금과 ETF 모두 월 적립식 미래가치 공식으로 계산",
    "ETF 수익률은 사용자가 입력한 기대수익률 기반 시뮬레이션",
    "실질 구매력은 물가상승률을 반영한 현재가치 기준",
  ]}
  faq={faq}
  related={SVER_RELATED_LINKS}
/>
```

### 10-3. 사용자 facing 표현 주의

금지:

- `ETF가 더 좋습니다`
- `ETF를 선택하면 반드시 더 많이 모입니다`
- `세금까지 정확히 계산합니다`
- `노후자금이 충분합니다`

권장:

- `현재 입력값 기준`
- `예상`
- `시뮬레이션`
- `기대수익률`
- `실제 결과는 달라질 수 있습니다`
- `위험 성향과 투자 기간을 함께 고려하세요`

---

## 11. 등록 체크리스트

- [ ] `src/data/savingsVsEtfRetirement.ts` 작성
- [ ] `src/pages/tools/savings-vs-etf-retirement.astro` 작성
- [ ] `public/scripts/savings-vs-etf-retirement.js` 작성
- [ ] `src/styles/scss/pages/_savings-vs-etf-retirement.scss` 작성
- [ ] `src/data/tools.ts`에 `savings-vs-etf-retirement` 등록
- [ ] `src/styles/app.scss`에 `@use 'scss/pages/savings-vs-etf-retirement';` 추가
- [ ] `public/sitemap.xml`에 `/tools/savings-vs-etf-retirement/` 추가
- [ ] OG 이미지 `public/og/tools/savings-vs-etf-retirement.png` 생성
- [ ] `npm run build` 성공 확인

---

## 12. QA 체크리스트

### 12-1. 계산 QA

- [ ] 현재 나이보다 은퇴 나이가 작거나 같으면 검증 처리
- [ ] ETF 기대수익률에서 ETF 보수율이 차감됨
- [ ] 물가상승률 변경 시 실질가치가 즉시 바뀜
- [ ] 세금 단순 반영 toggle이 적금/ETF 수익률에 적용됨
- [ ] 월 생활비 0원 입력 시 커버 기간/고갈 시점이 깨지지 않음
- [ ] 국민연금 예상액이 월 생활비보다 클 때 부족분 0원 상태 처리
- [ ] 은퇴 후 수익률이 음수여도 고갈 시점 계산이 동작
- [ ] 월초/월말 납입 차이가 결과에 반영됨

### 12-2. 인터랙션 QA

- [ ] 프리셋 클릭 시 수익률 가정이 함께 바뀜
- [ ] 빠른 금액 버튼 클릭 시 월 투자금 입력과 결과가 갱신됨
- [ ] reset 버튼이 기본값으로 복원됨
- [ ] copy link 버튼으로 현재 상태 URL이 복사됨
- [ ] URL 진입 시 입력값과 결과가 복원됨
- [ ] Chart.js 로드 실패 시 비교표로 결과 확인 가능

### 12-3. 콘텐츠 QA

- [ ] ETF 결과가 확정 수익처럼 표현되지 않음
- [ ] 모든 핵심 결과에 `예상`, `시뮬레이션`, `현재 입력값 기준` 표현이 있음
- [ ] 세금 계산을 정확한 세무 계산처럼 표현하지 않음
- [ ] FAQ 6개 이상 노출
- [ ] 관련 링크가 실제 존재하는 페이지 위주로 연결됨

### 12-4. 반응형 QA

- [ ] 320px에서 KPI 카드 숫자가 넘치지 않음
- [ ] 모바일에서 입력 라벨과 number input이 겹치지 않음
- [ ] 비교표는 가로 스크롤로 읽을 수 있음
- [ ] 차트 높이가 너무 작아지지 않음
- [ ] 프리셋 버튼이 줄바꿈되어도 레이아웃이 흔들리지 않음

---

## 13. 구현 순서

1. `src/data/savingsVsEtfRetirement.ts`에 타입, 기본값, 프리셋, FAQ, 관련 링크 작성
2. `src/pages/tools/savings-vs-etf-retirement.astro`에서 `SimpleToolShell` 기반 페이지 골격 작성
3. 입력 패널과 결과 KPI의 정적 마크업 완성
4. `public/scripts/savings-vs-etf-retirement.js`에서 계산 로직, URL 상태, 프리셋 적용 구현
5. 명목/실질 자산 차트와 은퇴 후 잔액 차트 구현
6. `_savings-vs-etf-retirement.scss` 작성 후 `app.scss`에 import
7. `tools.ts`, `sitemap.xml`, 홈/목록 노출 여부 확인
8. `npm run build`

---

## 14. 최종 요약

| 항목 | 설계 방향 |
| --- | --- |
| 핵심 목적 | 월 투자금을 적금과 ETF에 넣었을 때 은퇴 시점 결과 비교 |
| 차별화 | 명목 자산, 실질 구매력, 생활비 커버 기간, 고갈 시점까지 제공 |
| 데이터 기준 | 사용자 입력 기반 기대수익률 시뮬레이션 |
| 결과 핵심 | 적금 총액, ETF 총액, 현재가치, 자산 고갈 나이 |
| UX 방향 | 결과 우선, 프리셋 빠른 적용, URL 공유 |
| 안전장치 | ETF 원금 손실 가능성, 세금 단순 추정, 실제 결과 변동 안내 |
