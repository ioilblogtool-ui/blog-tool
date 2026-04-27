# 노후 자금 고갈 계산기 — 설계 문서

> 기획 원문: `docs/plan/202604/retirement-fund-depletion.md`
> 작성일: 2026-04-21
> 구현 기준: Codex/Claude가 이 문서만 보고 Astro 계산기 페이지 구현을 시작할 수 있는 수준
> 참고 계산기: `irp-pension-calculator`, `national-pension-calculator`, `dca-investment-calculator`, `fire-calculator`

---

## 1. 문서 개요

### 1-1. 대상

- 슬러그: `retirement-fund-depletion`
- URL: `/tools/retirement-fund-depletion/`
- 콘텐츠 유형: 계산기 (`/tools/`)
- 카테고리: 투자·재테크
- 핵심 검색 의도: `노후자금 얼마나 필요 계산`, `자산 고갈 시점 계산`, `은퇴 준비 자금 계산기`

### 1-2. 페이지 정의

> 현재 나이, 은퇴 나이, 월 생활비, 현재 자산, 국민연금, 물가상승률, 운용수익률을 입력하면 은퇴 시점 필요 자산, 부족 금액, 월 추가 적립액, 자산 고갈 예상 나이를 추정하는 계산기

### 1-3. 구현 원칙

- 모든 결과는 공식 확정값이 아니라 `시뮬레이션` 또는 `추정`으로 표시한다.
- 세금, 건강보험료, 의료비, 간병비, 주거비 급변은 v1 계산 범위에서 제외하고 안내 문구로 분리한다.
- 계산 로직은 연도별 시뮬레이션 방식을 기본으로 한다.
- 입력 기본값만으로 첫 진입 즉시 결과가 보이게 한다.
- 모바일에서는 결과 요약을 먼저 확인하고 입력으로 내려가는 구조를 우선한다.

### 1-4. 권장 파일 구조

```text
src/
  data/
    retirementFundDepletion.ts
    tools.ts
  pages/
    tools/
      retirement-fund-depletion.astro

public/
  scripts/
    retirement-fund-depletion.js
  og/
    tools/
      retirement-fund-depletion.png

src/styles/scss/pages/
  _retirement-fund-depletion.scss
```

### 1-5. 추가 반영 파일

- `src/data/tools.ts`
  - slug, title, description, category, badges 등록
- `src/pages/tools/index.astro`
  - 필요 시 카테고리 분류 확인
- `src/pages/index.astro`
  - 홈 노출 대상이면 `topicBySlug`, `isNew` 반영
- `src/styles/app.scss`
  - `@use "./scss/pages/retirement-fund-depletion";`
- `public/sitemap.xml`
  - `/tools/retirement-fund-depletion/` 추가

---

## 2. 레이아웃 구조

### 2-1. 기본 틀

- `BaseLayout`
- `SiteHeader`
- `SimpleToolShell`
- `CalculatorHero`
- `ToolActionBar`
- `InfoNotice`
- `SeoContent`

### 2-2. 권장 설정

- `pageClass="rfd-page"`
- `calculatorId="retirement-fund-depletion"`
- `resultFirst={true}`

이 계산기는 입력값을 바꿔가며 결과 카드와 차트를 반복 확인하는 성격이 강하다. 모바일에서는 결과 요약을 상단에 두고, 입력 패널은 접히거나 뒤따라오는 구조가 적합하다.

### 2-3. 페이지 톤

- 불안을 자극하는 표현보다 `현재 계획을 점검한다`는 톤을 유지한다.
- `위험`, `부족` 같은 상태 표시는 쓰되 해결 행동을 함께 제시한다.
- 사용자 facing 텍스트는 한국어만 사용한다.

---

## 3. 데이터 파일 설계 (`retirementFundDepletion.ts`)

### 3-1. 타입 정의

```ts
export type RetirementStatus = "stable" | "caution" | "risk";
export type ScenarioId = "optimistic" | "base" | "conservative";

export type RetirementFundInput = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyLivingCost: number;
  currentAssets: number;
  monthlyContribution: number;
  monthlyPension: number;
  otherRetirementIncome: number;
  inflationRate: number;
  annualReturnRate: number;
};

export type RetirementProjectionPoint = {
  age: number;
  yearOffset: number;
  startBalance: number;
  annualExpense: number;
  annualIncome: number;
  investmentReturn: number;
  endBalance: number;
};

export type RetirementFundResult = {
  yearsToRetirement: number;
  retirementYears: number;
  monthlyCostAtRetirement: number;
  annualNetExpenseAtRetirement: number;
  projectedAssetsAtRetirement: number;
  requiredAssetsAtRetirement: number;
  shortfallAmount: number;
  requiredAdditionalMonthlyContribution: number;
  depletionAge: number | null;
  depletionYearOffset: number | null;
  status: RetirementStatus;
  statusLabel: string;
  summaryMessage: string;
  projection: RetirementProjectionPoint[];
};
```

### 3-2. 기본 입력값

```ts
export const RFD_DEFAULT_INPUT: RetirementFundInput = {
  currentAge: 35,
  retirementAge: 60,
  lifeExpectancy: 90,
  monthlyLivingCost: 2500000,
  currentAssets: 100000000,
  monthlyContribution: 500000,
  monthlyPension: 800000,
  otherRetirementIncome: 0,
  inflationRate: 0.025,
  annualReturnRate: 0.04,
};
```

### 3-3. 프리셋

```ts
export const RFD_PRESETS = [
  {
    id: "thirties",
    label: "30대 점검형",
    currentAge: 35,
    retirementAge: 60,
    monthlyLivingCost: 2500000,
    currentAssets: 100000000,
    monthlyContribution: 500000,
    monthlyPension: 800000,
  },
  {
    id: "forties",
    label: "40대 추격형",
    currentAge: 45,
    retirementAge: 62,
    monthlyLivingCost: 3000000,
    currentAssets: 250000000,
    monthlyContribution: 1000000,
    monthlyPension: 1000000,
  },
  {
    id: "early-retire",
    label: "조기은퇴 점검형",
    currentAge: 40,
    retirementAge: 55,
    monthlyLivingCost: 3000000,
    currentAssets: 400000000,
    monthlyContribution: 1500000,
    monthlyPension: 700000,
  },
];

export const RFD_SCENARIOS = [
  {
    id: "optimistic",
    label: "낙관",
    inflationDelta: -0.005,
    returnDelta: 0.01,
    livingCostMultiplier: 0.95,
  },
  {
    id: "base",
    label: "기본",
    inflationDelta: 0,
    returnDelta: 0,
    livingCostMultiplier: 1,
  },
  {
    id: "conservative",
    label: "보수",
    inflationDelta: 0.005,
    returnDelta: -0.01,
    livingCostMultiplier: 1.05,
  },
];
```

### 3-4. 가이드 데이터

```ts
export const RFD_GUIDE_POINTS = [
  {
    title: "필요 자산은 현재가치 생활비를 은퇴 시점 가치로 바꿔 계산합니다.",
    description: "월 생활비 250만 원도 물가상승률 2.5%를 25년 반영하면 은퇴 시점에는 더 큰 금액으로 환산됩니다.",
  },
  {
    title: "국민연금과 기타 소득은 은퇴 후 순지출에서 차감합니다.",
    description: "연금 수령액은 입력값 기준이며, 실제 수령액은 공단 조회 결과와 다를 수 있습니다.",
  },
  {
    title: "자산 고갈 시점은 매년 잔액을 굴려보는 시뮬레이션입니다.",
    description: "수익률과 물가상승률이 조금만 바뀌어도 결과가 크게 달라질 수 있습니다.",
  },
];

export const RFD_RELATED_LINKS = [
  { label: "국민연금 수령액 계산기", href: "/tools/national-pension-calculator/" },
  { label: "IRP 연금 계산기", href: "/tools/irp-pension-calculator/" },
  { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
  { label: "연금저축·IRP 비교 리포트", href: "/reports/pension-irp-comparison-2026/" },
];
```

### 3-5. FAQ

```ts
export const RFD_FAQ = [
  {
    q: "노후자금은 얼마가 있어야 충분한가요?",
    a: "정답은 없습니다. 은퇴 시점, 월 생활비, 국민연금, 기대수명, 물가상승률, 운용수익률에 따라 필요한 자산이 크게 달라집니다. 이 계산기는 입력값 기준으로 필요한 자산을 추정합니다.",
  },
  {
    q: "국민연금만으로 노후 생활이 가능한가요?",
    a: "생활비 수준에 따라 다릅니다. 국민연금 예상액을 입력하면 은퇴 후 순지출에서 차감해 부족 금액과 자산 고갈 시점을 계산합니다.",
  },
  {
    q: "물가상승률은 몇 퍼센트로 넣어야 하나요?",
    a: "기본값은 2.5%로 두되, 보수적으로 보고 싶다면 3% 이상도 비교해볼 수 있습니다. 장기 시뮬레이션에서는 물가상승률 차이가 결과에 크게 반영됩니다.",
  },
  {
    q: "운용수익률은 몇 퍼센트가 현실적인가요?",
    a: "자산 배분에 따라 다릅니다. 예금·채권 중심이면 낮게, 주식·ETF 비중이 높으면 높게 가정할 수 있습니다. 이 계산기에서는 3~5% 구간 비교를 기본으로 안내합니다.",
  },
  {
    q: "자산 고갈 시점이 기대수명보다 빠르면 어떻게 해야 하나요?",
    a: "월 적립액을 늘리거나, 은퇴 시점을 늦추거나, 은퇴 후 생활비를 조정하거나, 연금성 현금흐름을 늘리는 방식으로 다시 시뮬레이션해보는 것이 좋습니다.",
  },
  {
    q: "계산 결과를 실제 은퇴 설계 금액으로 써도 되나요?",
    a: "아니요. 이 계산기는 참고용 시뮬레이션입니다. 세금, 의료비, 간병비, 주거비, 투자 손실 가능성은 별도로 검토해야 합니다.",
  },
];
```

---

## 4. 화면 구조

### 4-1. Hero

- eyebrow: `은퇴·노후 계산기`
- title: `노후 자금 고갈 계산기`
- subtitle: `내 자산은 몇 살까지 버틸까?`
- description: `현재 자산, 생활비, 국민연금, 수익률을 입력하면 은퇴 시점 필요 자산과 부족 금액, 월 추가 적립액, 자산 고갈 예상 나이를 추정합니다.`

Hero 하단에는 작은 신뢰 문구를 둔다.

- `물가상승률 반영`
- `운용수익률 반영`
- `국민연금 입력 가능`
- `결과는 시뮬레이션`

### 4-2. 상단 안내 `InfoNotice`

반드시 포함할 내용:

- 본 계산기는 입력값 기반 참고용 시뮬레이션이다.
- 국민연금 수령액은 사용자가 입력한 예상치다.
- 세금, 건강보험료, 의료비, 간병비, 주거비 급변은 별도 반영하지 않는다.
- 투자수익률과 물가상승률은 미래를 보장하지 않는다.

### 4-3. 입력 패널

#### 블록 A. 나이·기간

- 현재 나이
- 목표 은퇴 나이
- 기대수명
- 빠른 선택: `80세`, `85세`, `90세`, `95세`

#### 블록 B. 생활비·자산

- 월 생활비
- 현재 보유 자산
- 현재 월 적립액
- 빠른 선택:
  - 월 생활비: `200만`, `250만`, `300만`, `400만`
  - 현재 자산: `5천만`, `1억`, `3억`, `5억`

#### 블록 C. 은퇴 후 현금흐름

- 국민연금 예상 월 수령액
- 기타 은퇴 후 월 소득
- 빠른 선택:
  - 국민연금: `50만`, `80만`, `100만`, `150만`
  - 기타 소득: `0원`, `50만`, `100만`

#### 블록 D. 가정값

- 예상 물가상승률
- 예상 운용수익률
- 버튼형 프리셋:
  - 물가상승률: `2.0%`, `2.5%`, `3.0%`, `3.5%`
  - 운용수익률: `2.0%`, `4.0%`, `5.0%`, `7.0%`

### 4-4. 결과 패널

#### KPI 카드

1. `은퇴 시점 필요 자산`
2. `은퇴 시점 예상 자산`
3. `현재 계획 기준 부족 금액`
4. `월 추가 적립 필요액`
5. `자산 고갈 예상 나이`

각 결과 카드에는 `시뮬레이션` 배지를 붙인다.

#### 상태 배지

| 상태 | 조건 | 표시 문구 |
| --- | --- | --- |
| `stable` | 기대수명까지 잔액이 0원 초과 | `안정` |
| `caution` | 기대수명 전 5년 이내 고갈 | `주의` |
| `risk` | 기대수명보다 5년 이상 빠르게 고갈 | `위험` |

`depletionAge`가 `null`이면 `기대수명까지 자산 유지 가능`으로 표시한다.

### 4-5. 차트·시뮬레이션 영역

#### 차트 1. 은퇴 후 자산 잔액 추이

- Chart.js 라인 차트
- x축: 나이
- y축: 남은 자산
- 자산이 0 이하가 되는 지점은 별도 포인트 색상으로 강조
- 차트 하단에 `입력값 기준 시뮬레이션` 문구 표시

#### 차트 2. 시나리오 비교

- 낙관 / 기본 / 보수 3개 라인 또는 막대 비교
- 비교 항목:
  - 자산 고갈 나이
  - 은퇴 시점 부족 금액
  - 월 추가 적립 필요액

#### 차트 3. 민감도 카드

MVP에서는 차트 대신 카드형 비교로 구현 가능하다.

- 월 적립액 `+10만`, `+30만`, `+50만`
- 은퇴 나이 `+1년`, `+3년`, `+5년`
- 생활비 `-10%`, `-20%`

각 카드에는 `고갈 시점이 얼마나 늦춰지는지`를 보여준다.

### 4-6. 해설 영역

`SeoContent` 안에 아래 흐름으로 배치한다.

1. 노후자금이 단순 합계로 계산되지 않는 이유
2. 물가상승률이 은퇴 필요 자산을 키우는 방식
3. 국민연금과 기타 소득이 부족 금액을 줄이는 방식
4. 자산 고갈 시점이 빠르게 나올 때 조정할 수 있는 입력값
5. 계산 결과를 볼 때 주의할 점

### 4-7. 관련 콘텐츠 CTA

결과 하단과 SEO 영역 중간에 2회 배치한다.

- `국민연금 수령액을 먼저 추정해보세요`
- `IRP 적립금이 은퇴 후 월 얼마가 되는지 확인해보세요`
- `월 추가 적립액을 ETF 적립식 투자로 시뮬레이션해보세요`

---

## 5. 계산 로직

### 5-1. 입력 검증

```js
function normalizeInput(raw) {
  const currentAge = clamp(toNumber(raw.currentAge), 20, 80);
  const retirementAge = clamp(toNumber(raw.retirementAge), currentAge + 1, 80);
  const lifeExpectancy = clamp(toNumber(raw.lifeExpectancy), retirementAge + 1, 110);

  return {
    currentAge,
    retirementAge,
    lifeExpectancy,
    monthlyLivingCost: Math.max(0, toNumber(raw.monthlyLivingCost)),
    currentAssets: Math.max(0, toNumber(raw.currentAssets)),
    monthlyContribution: Math.max(0, toNumber(raw.monthlyContribution)),
    monthlyPension: Math.max(0, toNumber(raw.monthlyPension)),
    otherRetirementIncome: Math.max(0, toNumber(raw.otherRetirementIncome)),
    inflationRate: clamp(toRate(raw.inflationRate), 0, 0.10),
    annualReturnRate: clamp(toRate(raw.annualReturnRate), -0.10, 0.15),
  };
}
```

### 5-2. 은퇴 전 자산 적립

```js
function futureValueOfAssets(currentAssets, annualReturnRate, years) {
  return currentAssets * Math.pow(1 + annualReturnRate, years);
}

function futureValueOfMonthlyContribution(monthlyContribution, annualReturnRate, years) {
  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;

  if (months <= 0 || monthlyContribution <= 0) return 0;
  if (monthlyRate === 0) return monthlyContribution * months;

  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function calcProjectedAssetsAtRetirement(input) {
  const years = input.retirementAge - input.currentAge;
  return (
    futureValueOfAssets(input.currentAssets, input.annualReturnRate, years) +
    futureValueOfMonthlyContribution(input.monthlyContribution, input.annualReturnRate, years)
  );
}
```

### 5-3. 은퇴 시점 생활비 환산

```js
function calcMonthlyCostAtRetirement(input) {
  const years = input.retirementAge - input.currentAge;
  return input.monthlyLivingCost * Math.pow(1 + input.inflationRate, years);
}

function calcAnnualNetExpenseAtRetirement(input) {
  const monthlyCost = calcMonthlyCostAtRetirement(input);
  const monthlyIncome = input.monthlyPension + input.otherRetirementIncome;
  return Math.max(0, (monthlyCost - monthlyIncome) * 12);
}
```

### 5-4. 은퇴 후 연도별 시뮬레이션

```js
function simulateRetirementYears(input, startingAssets) {
  const projection = [];
  const retirementYears = input.lifeExpectancy - input.retirementAge;
  let balance = startingAssets;
  let annualExpense = calcMonthlyCostAtRetirement(input) * 12;
  const annualIncome = (input.monthlyPension + input.otherRetirementIncome) * 12;
  let depletionAge = null;
  let depletionYearOffset = null;

  for (let i = 0; i <= retirementYears; i += 1) {
    const age = input.retirementAge + i;
    const startBalance = balance;
    const netExpense = Math.max(0, annualExpense - annualIncome);
    const investmentReturn = startBalance * input.annualReturnRate;
    const endBalance = startBalance + investmentReturn - netExpense;

    projection.push({
      age,
      yearOffset: i,
      startBalance,
      annualExpense,
      annualIncome,
      investmentReturn,
      endBalance,
    });

    if (depletionAge === null && endBalance <= 0) {
      depletionAge = age;
      depletionYearOffset = i;
    }

    balance = endBalance;
    annualExpense *= 1 + input.inflationRate;
  }

  return { projection, depletionAge, depletionYearOffset };
}
```

### 5-5. 필요 자산 역산

필요 자산은 `은퇴 시점 예상 자산으로 기대수명까지 버티는지`와 별도로, 은퇴 후 순지출을 감당하기 위해 은퇴 시점에 필요한 자산을 이분 탐색으로 찾는다.

```js
function calcRequiredAssetsAtRetirement(input) {
  let low = 0;
  let high = 10000000000; // 100억

  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    const simulated = simulateRetirementYears(input, mid);
    const last = simulated.projection[simulated.projection.length - 1];

    if (last.endBalance >= 0 && simulated.depletionAge === null) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(high);
}
```

### 5-6. 월 추가 적립 필요액

```js
function calcRequiredAdditionalMonthlyContribution(shortfallAmount, input) {
  if (shortfallAmount <= 0) return 0;

  const years = input.retirementAge - input.currentAge;
  const months = years * 12;
  const monthlyRate = Math.pow(1 + input.annualReturnRate, 1 / 12) - 1;

  if (months <= 0) return shortfallAmount;
  if (monthlyRate === 0) return shortfallAmount / months;

  return shortfallAmount / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
```

### 5-7. 상태 판정

```js
function getRetirementStatus(depletionAge, lifeExpectancy) {
  if (depletionAge === null) {
    return {
      status: "stable",
      label: "안정",
      message: "입력값 기준 기대수명까지 자산이 유지되는 것으로 추정됩니다.",
    };
  }

  if (depletionAge >= lifeExpectancy - 5) {
    return {
      status: "caution",
      label: "주의",
      message: `입력값 기준 ${depletionAge}세 전후 자산 고갈 가능성이 있습니다.`,
    };
  }

  return {
    status: "risk",
    label: "위험",
    message: `기대수명보다 이른 ${depletionAge}세 전후 자산 고갈 가능성이 있습니다.`,
  };
}
```

### 5-8. 최종 계산 함수

```js
function calculateRetirementFund(rawInput) {
  const input = normalizeInput(rawInput);
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const retirementYears = input.lifeExpectancy - input.retirementAge;
  const projectedAssetsAtRetirement = calcProjectedAssetsAtRetirement(input);
  const requiredAssetsAtRetirement = calcRequiredAssetsAtRetirement(input);
  const shortfallAmount = Math.max(0, requiredAssetsAtRetirement - projectedAssetsAtRetirement);
  const requiredAdditionalMonthlyContribution =
    calcRequiredAdditionalMonthlyContribution(shortfallAmount, input);

  const simulated = simulateRetirementYears(input, projectedAssetsAtRetirement);
  const status = getRetirementStatus(simulated.depletionAge, input.lifeExpectancy);

  return {
    yearsToRetirement,
    retirementYears,
    monthlyCostAtRetirement: calcMonthlyCostAtRetirement(input),
    annualNetExpenseAtRetirement: calcAnnualNetExpenseAtRetirement(input),
    projectedAssetsAtRetirement,
    requiredAssetsAtRetirement,
    shortfallAmount,
    requiredAdditionalMonthlyContribution,
    depletionAge: simulated.depletionAge,
    depletionYearOffset: simulated.depletionYearOffset,
    status: status.status,
    statusLabel: status.label,
    summaryMessage: status.message,
    projection: simulated.projection,
  };
}
```

---

## 6. 클라이언트 스크립트 설계

### 6-1. 파일

`public/scripts/retirement-fund-depletion.js`

### 6-2. 구조

- IIFE 패턴 사용
- 전역 오염 금지
- DOM은 `data-rfd-*` 속성으로 찾는다.
- 입력 변경 시 `requestAnimationFrame` 또는 짧은 debounce 후 재계산한다.
- URL 파라미터 저장/복원은 가능하면 `public/scripts/url-state.js` 패턴을 따른다.

```js
(() => {
  const root = document.querySelector("[data-rfd-root]");
  if (!root) return;

  const state = { chart: null };

  function readInput() {}
  function calculate(input) {}
  function renderResult(result) {}
  function renderChart(result) {}
  function bindEvents() {}
  function init() {}

  init();
})();
```

### 6-3. DOM 데이터 속성

```html
<section data-rfd-root>
  <input data-rfd-input="currentAge" />
  <input data-rfd-input="retirementAge" />
  <input data-rfd-input="lifeExpectancy" />
  <input data-rfd-input="monthlyLivingCost" />
  <input data-rfd-input="currentAssets" />
  <input data-rfd-input="monthlyContribution" />
  <input data-rfd-input="monthlyPension" />
  <input data-rfd-input="otherRetirementIncome" />
  <input data-rfd-input="inflationRate" />
  <input data-rfd-input="annualReturnRate" />

  <output data-rfd-output="requiredAssetsAtRetirement"></output>
  <output data-rfd-output="projectedAssetsAtRetirement"></output>
  <output data-rfd-output="shortfallAmount"></output>
  <output data-rfd-output="requiredAdditionalMonthlyContribution"></output>
  <output data-rfd-output="depletionAge"></output>

  <canvas data-rfd-chart="balance"></canvas>
</section>
```

### 6-4. 포맷터

```js
function formatWon(value) {
  if (!Number.isFinite(value)) return "-";
  if (Math.abs(value) >= 100000000) {
    return `${(value / 100000000).toFixed(1).replace(".0", "")}억 원`;
  }
  if (Math.abs(value) >= 10000) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function formatMonthlyWon(value) {
  return `${formatWon(value)}/월`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1).replace(".0", "")}%`;
}
```

---

## 7. Astro 페이지 설계

### 7-1. frontmatter

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  RFD_DEFAULT_INPUT,
  RFD_PRESETS,
  RFD_GUIDE_POINTS,
  RFD_RELATED_LINKS,
  RFD_FAQ,
} from "../../data/retirementFundDepletion";

const title = "노후 자금 고갈 계산기 | 은퇴 준비 자금·부족 금액·고갈 시점 계산";
const description =
  "현재 나이, 은퇴 나이, 생활비, 자산, 국민연금, 수익률을 입력하면 노후 필요 자산과 부족 금액, 월 추가 적립액, 자산 고갈 예상 시점을 계산해드립니다.";
---
```

### 7-2. 레이아웃 스케치

```astro
<BaseLayout title={title} description={description} pageClass="rfd-page">
  <SiteHeader />

  <main>
    <CalculatorHero
      eyebrow="은퇴·노후 계산기"
      title="노후 자금 고갈 계산기"
      description="현재 자산, 생활비, 국민연금, 수익률을 입력하면 은퇴 시점 필요 자산과 자산 고갈 예상 나이를 추정합니다."
    />

    <InfoNotice>
      입력값을 바탕으로 한 참고용 시뮬레이션입니다. 실제 은퇴 후 지출과 수령액은 세금, 의료비, 주거비, 투자 성과에 따라 달라질 수 있습니다.
    </InfoNotice>

    <SimpleToolShell calculatorId="retirement-fund-depletion" resultFirst={true}>
      <!-- input slot -->
      <!-- result slot -->
    </SimpleToolShell>

    <SeoContent>
      <!-- 해설, FAQ, 관련 링크 -->
    </SeoContent>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/scripts/retirement-fund-depletion.js" defer></script>
</BaseLayout>
```

### 7-3. SEO 메타

- title: `노후 자금 고갈 계산기 | 은퇴 준비 자금·부족 금액·고갈 시점 계산`
- description: `현재 나이, 은퇴 나이, 생활비, 자산, 국민연금, 수익률을 입력하면 노후 필요 자산과 부족 금액, 월 추가 적립액, 자산 고갈 예상 시점을 계산해드립니다.`
- H1: `노후 자금 고갈 계산기`
- OG title: `내 자산은 몇 살까지 버틸까?`
- OG description: `노후 필요 자산·부족 금액·월 추가 적립액·자산 고갈 예상 시점 계산`

---

## 8. SCSS 설계

### 8-1. 파일

`src/styles/scss/pages/_retirement-fund-depletion.scss`

### 8-2. prefix

- 전체 prefix: `rfd-`
- 페이지 클래스: `.rfd-page`

### 8-3. 주요 클래스

```scss
.rfd-page {}
.rfd-form {}
.rfd-field {}
.rfd-preset-grid {}
.rfd-result-grid {}
.rfd-kpi-card {}
.rfd-status-badge {}
.rfd-chart-panel {}
.rfd-scenario-grid {}
.rfd-guide-list {}
.rfd-related-links {}
```

### 8-4. 디자인 방향

- 투자·연금 페이지와 연결되도록 차분한 금융 도구 톤을 유지한다.
- 메인 포인트 컬러는 녹색 계열 단일톤에 갇히지 않도록 청록, 짙은 남색, 경고색을 함께 사용한다.
- 상태 배지 색상:
  - 안정: 녹색
  - 주의: 노랑/호박색
  - 위험: 붉은색
- 카드 안 텍스트가 모바일에서 줄바꿈되어도 높이가 과도하게 흔들리지 않도록 min-height를 둔다.
- 입력 폼은 320px 폭에서도 가로 스크롤이 생기지 않아야 한다.

---

## 9. 접근성·UX 기준

- 모든 입력에는 `label`을 연결한다.
- 숫자 입력은 `inputmode="numeric"` 또는 `inputmode="decimal"`을 지정한다.
- 결과 변경 시 핵심 결과 영역에 `aria-live="polite"`를 적용한다.
- 버튼형 프리셋은 실제 `button` 요소로 만든다.
- 슬라이더를 쓸 경우 직접 입력 필드도 함께 제공한다.
- 차트만으로 정보를 전달하지 않고 핵심 수치는 카드와 표로도 제공한다.
- `초기화` 버튼을 제공하되, 실수 방지를 위해 기본값 복원 문구를 명확히 쓴다.

---

## 10. 추적 이벤트 설계

추후 analytics 연결 시 아래 이벤트명을 사용한다.

| 이벤트 | 트리거 | 속성 |
| --- | --- | --- |
| `rfd_calculate` | 입력 변경 후 계산 완료 | `status`, `depletionAge`, `shortfallRange` |
| `rfd_apply_preset` | 프리셋 선택 | `presetId` |
| `rfd_change_scenario` | 시나리오 탭 변경 | `scenarioId` |
| `rfd_click_related` | 관련 링크 클릭 | `href`, `label` |

---

## 11. MVP 범위

### 11-1. v1 포함

- 기본 입력 폼
- 프리셋 3종
- 핵심 KPI 5개
- 상태 배지 3단계
- 은퇴 후 자산 잔액 라인 차트
- 낙관/기본/보수 시나리오 비교
- 해설 콘텐츠
- FAQ 6개 이상
- 관련 링크 3개 이상
- URL 파라미터 저장/복원

### 11-2. v1 제외

- 부부 합산 모드
- 세금·건강보험료 계산
- 의료비·간병비 별도 시나리오
- 국민연금공단 데이터 연동
- 사용자 계정 기반 저장
- 결과 이미지 다운로드

### 11-3. v2 후보

- 부부 합산 은퇴 설계
- 주거비·의료비·간병비 고급 입력
- 연금저축/IRP 납입 한도 추천
- FIRE 모드
- 결과 공유 이미지 생성

---

## 12. 품질 체크리스트

### 구현 체크

- [ ] `src/data/retirementFundDepletion.ts` 생성
- [ ] `src/pages/tools/retirement-fund-depletion.astro` 생성
- [ ] `public/scripts/retirement-fund-depletion.js` 생성
- [ ] `src/styles/scss/pages/_retirement-fund-depletion.scss` 생성
- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` `@use` 추가
- [ ] `public/sitemap.xml` 등록
- [ ] OG 이미지 생성 또는 placeholder 확인

### 계산 체크

- [ ] 현재 나이 < 은퇴 나이 < 기대수명 검증
- [ ] 월 생활비 현재가치 → 은퇴 시점 미래가치 환산
- [ ] 현재 자산 미래가치 계산
- [ ] 월 적립액 미래가치 계산
- [ ] 국민연금·기타 소득 차감
- [ ] 필요 자산 이분 탐색 계산
- [ ] 월 추가 적립 필요액 역산
- [ ] 자산 고갈 예상 나이 계산
- [ ] `depletionAge === null` 케이스 처리

### 콘텐츠 체크

- [ ] 모든 결과값에 `시뮬레이션` 또는 `추정` 배지 표시
- [ ] 공식 수치처럼 단정하지 않음
- [ ] 한국어 사용자 facing 텍스트만 사용
- [ ] 세금·의료비·간병비 미반영 안내
- [ ] FAQ 6개 이상
- [ ] 내부링크 3개 이상

### QA 체크

- [ ] `npm run build` 성공
- [ ] `/tools/retirement-fund-depletion/` 라우트 생성
- [ ] 320px, 390px, 768px, 1280px에서 가로 스크롤 없음
- [ ] 입력 변경 시 결과와 차트 즉시 갱신
- [ ] Chart.js 로딩 실패 시 핵심 결과는 정상 표시
- [ ] URL 파라미터 복원 시 같은 결과 표시

---

## 13. 최종 구현 메모

- 계산 결과는 사용자의 불안을 단정하지 말고 `현재 입력값 기준으로는`이라는 표현을 붙인다.
- `자산 고갈 예상 나이`는 페이지의 가장 강한 hook이므로 결과 카드에서 가장 눈에 띄게 배치한다.
- `월 추가 적립 필요액`은 IRP, 연금저축, ETF 적립식 계산기로 자연스럽게 이어지는 CTA와 붙인다.
- 시뮬레이션 입력값은 기본값만으로도 현실적인 예시가 되도록 유지한다.
- 금융 의사결정을 유도하는 문구에는 `보장`, `확정`, `반드시` 같은 표현을 쓰지 않는다.
