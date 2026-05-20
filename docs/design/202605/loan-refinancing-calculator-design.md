# 대출 갈아타기 계산기 — 설계 문서

> 기획 원문: `docs/plan/202605/loan-refinancing-calculator.md`  
> 작성일: 2026-05-19  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 기존 대출과 신규 대출 조건 비교 → 월 납입금 절감액·총 이자 절감액·중도상환수수료 회수 기간 산출

---

## 1. 문서 개요

- 구현 대상: `대출 갈아타기 계산기`
- slug: `loan-refinancing-calculator`
- URL: `/tools/loan-refinancing-calculator/`
- 카테고리: 금융/대출
- 핵심 검색 의도: "대출 갈아타기 계산기", "대환대출 계산기", "주담대 갈아타기 계산", "중도상환수수료 회수 기간"
- 핵심 출력: 월 납입금 절감액, 총 이자 절감액, 갈아타기 순절감액, 수수료 회수 기간, 판단 라벨
- 안전 원칙: 실제 승인 가능 여부, 실제 적용 금리, 최저금리, 절감 보장을 단정하지 않는다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    loanRefinancingCalculator.ts   ← 타입, 프리셋, FAQ, 관련 링크, 고지 문구
  pages/
    tools/
      loan-refinancing-calculator.astro

public/
  scripts/
    loan-refinancing-calculator.js

src/styles/scss/pages/
  _loan-refinancing-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss` — `@use 'scss/pages/loan-refinancing-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 홈 노출 대상이면 금융/대출 토픽에 추가
- `public/og/loan-refinancing-calculator.png` 또는 OG 생성 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반.
- 입력은 3단계로 분리한다.
  - Step 1: 기존 대출
  - Step 2: 신규 대출
  - Step 3: 수수료·부대비용
- 결과는 `월 절감액 → 순절감액 → 회수 기간` 순서로 읽히게 한다.
- SCSS prefix: `lrc-`
- pageClass: `lrc-page`
- 모바일은 입력 먼저, 결과는 입력 직후 노출.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="loan-refinancing-calculator"
  pageClass="lrc-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 금융상품 예상 계산 고지 `InfoNotice`
3. 계산기 입력 영역
4. 결과 KPI 카드
5. 비용 분해표
6. 손익분기 타임라인
7. 고정금리 vs 변동금리 시나리오
8. 대출 종류별 체크포인트
9. 대환 전 서류·조건 체크리스트
10. 관련 계산기/리포트 CTA
11. `SeoContent` FAQ

---

## 5. 데이터 모델

파일: `src/data/loanRefinancingCalculator.ts`

```ts
export type LoanType = 'mortgage' | 'jeonse' | 'credit' | 'other';
export type RepaymentType = 'annuity' | 'equalPrincipal' | 'bullet';
export type RateType = 'fixed' | 'variable' | 'mixed';
export type DecisionLabel = '지금 유리' | '조건부 유리' | '보류' | '불리';
export type DecisionTone = 'positive' | 'neutral' | 'caution' | 'danger';

export interface LoanTypePreset {
  id: LoanType;
  label: string;
  defaultBalance: number;
  defaultCurrentRate: number;
  defaultNewRate: number;
  defaultRemainingMonths: number;
  defaultRepaymentType: RepaymentType;
  defaultPenaltyRate: number;
  defaultPenaltyTotalMonths: number;
  note: string;
}

export interface LoanRefinancingInput {
  loanType: LoanType;
  currentBalance: number;
  currentAnnualRate: number;
  remainingMonths: number;
  currentRepaymentType: RepaymentType;
  currentMonthlyPaymentOverride: number | null;
  currentRateType: RateType;

  newAnnualRate: number;
  newTermMonths: number;
  newRepaymentType: RepaymentType;
  newMonthlyPaymentOverride: number | null;
  newRateType: RateType;

  prepaymentPenaltyRate: number;
  penaltyRemainingMonths: number;
  penaltyTotalMonths: number;
  penaltyExemptAmount: number;
  newLoanCosts: number;

  rateScenarioDelta: number;
}

export interface LoanCostSummary {
  monthlyPayment: number;
  firstMonthPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface RateScenarioResult {
  id: 'base' | 'rateDown' | 'rateUp';
  label: string;
  annualRate: number;
  monthlyPayment: number;
  totalInterest: number;
  netSaving: number;
  decisionLabel: DecisionLabel;
}

export interface LoanRefinancingResult {
  currentCost: LoanCostSummary;
  newCost: LoanCostSummary;
  monthlySaving: number;
  totalInterestSaving: number;
  prepaymentPenalty: number;
  totalSwitchingCost: number;
  netSaving: number;
  breakEvenMonths: number | null;
  decisionLabel: DecisionLabel;
  decisionTone: DecisionTone;
  decisionMessage: string;
  scenarioResults: RateScenarioResult[];
  warnings: string[];
}

export interface LoanRefinancingPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<LoanRefinancingInput>;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 핵심 데이터 상수

### 6-1. 메타

```ts
export const LRC_META = {
  title: '대출 갈아타기 계산기',
  subtitle:
    '현재 대출과 신규 대출 조건을 비교해 월 납입금 절감액, 총 이자 절감액, 수수료 회수 기간을 계산합니다.',
  methodology:
    '입력한 대출 잔액, 금리, 기간, 상환 방식, 수수료율을 바탕으로 예상 손익을 계산합니다.',
  caution:
    '실제 대환 가능 여부, 금리, 한도, 수수료, 부대비용은 금융회사 심사와 약정 조건에 따라 달라질 수 있습니다.',
  updatedAt: '2026년 5월 기준',
};
```

### 6-2. 대출 유형 프리셋

```ts
export const LRC_LOAN_TYPE_PRESETS: LoanTypePreset[] = [
  {
    id: 'mortgage',
    label: '주택담보대출',
    defaultBalance: 300000000,
    defaultCurrentRate: 0.048,
    defaultNewRate: 0.041,
    defaultRemainingMonths: 240,
    defaultRepaymentType: 'annuity',
    defaultPenaltyRate: 0.012,
    defaultPenaltyTotalMonths: 36,
    note: '주담대는 중도상환수수료, 근저당 설정 관련 비용, DSR/LTV를 함께 확인해야 합니다.',
  },
  {
    id: 'jeonse',
    label: '전세자금대출',
    defaultBalance: 150000000,
    defaultCurrentRate: 0.045,
    defaultNewRate: 0.038,
    defaultRemainingMonths: 24,
    defaultRepaymentType: 'bullet',
    defaultPenaltyRate: 0.007,
    defaultPenaltyTotalMonths: 24,
    note: '전세대출은 보증기관, 보증료, 전세계약 만기와 대출 만기를 함께 확인해야 합니다.',
  },
  {
    id: 'credit',
    label: '신용대출',
    defaultBalance: 30000000,
    defaultCurrentRate: 0.075,
    defaultNewRate: 0.059,
    defaultRemainingMonths: 60,
    defaultRepaymentType: 'annuity',
    defaultPenaltyRate: 0.005,
    defaultPenaltyTotalMonths: 12,
    note: '신용대출은 한도, 신용점수 영향, 마이너스통장 여부를 함께 확인하세요.',
  },
  {
    id: 'other',
    label: '직접 입력',
    defaultBalance: 100000000,
    defaultCurrentRate: 0.05,
    defaultNewRate: 0.042,
    defaultRemainingMonths: 120,
    defaultRepaymentType: 'annuity',
    defaultPenaltyRate: 0.01,
    defaultPenaltyTotalMonths: 36,
    note: '약정서 기준으로 직접 입력하세요.',
  },
];
```

---

## 7. 계산 로직

### 7-1. 월 납입금

```ts
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
  repaymentType: RepaymentType
) {
  const monthlyRate = annualRate / 12;

  if (months <= 0 || principal <= 0) return 0;

  if (repaymentType === 'bullet') {
    return principal * monthlyRate;
  }

  if (repaymentType === 'annuity') {
    if (monthlyRate === 0) return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  }

  // 원금균등은 첫 달 납입액을 대표 월 납입금으로 표시
  return principal / months + principal * monthlyRate;
}
```

### 7-2. 총이자

```ts
function calculateTotalInterest(
  principal: number,
  annualRate: number,
  months: number,
  repaymentType: RepaymentType
) {
  const monthlyRate = annualRate / 12;

  if (months <= 0 || principal <= 0) return 0;

  if (repaymentType === 'bullet') {
    return principal * monthlyRate * months;
  }

  if (repaymentType === 'annuity') {
    const monthlyPayment = calculateMonthlyPayment(
      principal,
      annualRate,
      months,
      repaymentType
    );
    return monthlyPayment * months - principal;
  }

  let remainingPrincipal = principal;
  const monthlyPrincipal = principal / months;
  let totalInterest = 0;

  for (let month = 0; month < months; month += 1) {
    totalInterest += remainingPrincipal * monthlyRate;
    remainingPrincipal = Math.max(remainingPrincipal - monthlyPrincipal, 0);
  }

  return totalInterest;
}
```

### 7-3. 중도상환수수료

```ts
function calculatePrepaymentPenalty(input: LoanRefinancingInput) {
  const penaltyBase = Math.max(
    input.currentBalance - input.penaltyExemptAmount,
    0
  );

  const remainingRatio =
    input.penaltyTotalMonths > 0
      ? Math.min(
          Math.max(input.penaltyRemainingMonths, 0) /
            input.penaltyTotalMonths,
          1
        )
      : 0;

  return penaltyBase * input.prepaymentPenaltyRate * remainingRatio;
}
```

### 7-4. 전체 결과

```ts
function calculateLoanRefinancing(
  input: LoanRefinancingInput
): LoanRefinancingResult {
  const currentMonthlyPayment =
    input.currentMonthlyPaymentOverride ??
    calculateMonthlyPayment(
      input.currentBalance,
      input.currentAnnualRate,
      input.remainingMonths,
      input.currentRepaymentType
    );

  const newMonthlyPayment =
    input.newMonthlyPaymentOverride ??
    calculateMonthlyPayment(
      input.currentBalance,
      input.newAnnualRate,
      input.newTermMonths,
      input.newRepaymentType
    );

  const currentTotalInterest = calculateTotalInterest(
    input.currentBalance,
    input.currentAnnualRate,
    input.remainingMonths,
    input.currentRepaymentType
  );

  const newTotalInterest = calculateTotalInterest(
    input.currentBalance,
    input.newAnnualRate,
    input.newTermMonths,
    input.newRepaymentType
  );

  const prepaymentPenalty = calculatePrepaymentPenalty(input);
  const totalSwitchingCost = prepaymentPenalty + input.newLoanCosts;
  const monthlySaving = currentMonthlyPayment - newMonthlyPayment;
  const totalInterestSaving = currentTotalInterest - newTotalInterest;
  const netSaving = totalInterestSaving - totalSwitchingCost;
  const breakEvenMonths =
    monthlySaving > 0 ? Math.ceil(totalSwitchingCost / monthlySaving) : null;

  const decision = getDecision(netSaving, breakEvenMonths);

  return {
    currentCost: {
      monthlyPayment: currentMonthlyPayment,
      firstMonthPayment: currentMonthlyPayment,
      totalInterest: currentTotalInterest,
      totalPayment: input.currentBalance + currentTotalInterest,
    },
    newCost: {
      monthlyPayment: newMonthlyPayment,
      firstMonthPayment: newMonthlyPayment,
      totalInterest: newTotalInterest,
      totalPayment: input.currentBalance + newTotalInterest,
    },
    monthlySaving,
    totalInterestSaving,
    prepaymentPenalty,
    totalSwitchingCost,
    netSaving,
    breakEvenMonths,
    decisionLabel: decision.label,
    decisionTone: decision.tone,
    decisionMessage: decision.message,
    scenarioResults: calculateRateScenarios(input, totalSwitchingCost),
    warnings: getWarnings(input, monthlySaving, netSaving),
  };
}
```

### 7-5. 판단 라벨

```ts
function getDecision(
  netSaving: number,
  breakEvenMonths: number | null
): { label: DecisionLabel; tone: DecisionTone; message: string } {
  if (netSaving <= 0 || breakEvenMonths === null) {
    return {
      label: '불리',
      tone: 'danger',
      message: '수수료와 부대비용을 반영하면 현재 조건 유지가 나을 수 있습니다.',
    };
  }

  if (breakEvenMonths <= 12) {
    return {
      label: '지금 유리',
      tone: 'positive',
      message: '갈아타기 비용을 1년 안에 회수할 수 있는 구간입니다.',
    };
  }

  if (breakEvenMonths <= 36) {
    return {
      label: '조건부 유리',
      tone: 'neutral',
      message: '장기 유지할 계획이라면 갈아타기를 검토할 수 있습니다.',
    };
  }

  return {
    label: '보류',
    tone: 'caution',
    message: '회수 기간이 길어 이사·상환 계획과 금리 변동을 먼저 확인해야 합니다.',
  };
}
```

---

## 8. 금리 시나리오

### 8-1. 구조

```ts
function calculateRateScenarios(
  input: LoanRefinancingInput,
  totalSwitchingCost: number
): RateScenarioResult[] {
  const scenarios = [
    { id: 'base', label: '기준', rate: input.newAnnualRate },
    {
      id: 'rateDown',
      label: '금리 하락',
      rate: Math.max(input.newAnnualRate - input.rateScenarioDelta, 0),
    },
    {
      id: 'rateUp',
      label: '금리 상승',
      rate: input.newAnnualRate + input.rateScenarioDelta,
    },
  ] as const;

  return scenarios.map((scenario) => {
    const monthlyPayment = calculateMonthlyPayment(
      input.currentBalance,
      scenario.rate,
      input.newTermMonths,
      input.newRepaymentType
    );
    const totalInterest = calculateTotalInterest(
      input.currentBalance,
      scenario.rate,
      input.newTermMonths,
      input.newRepaymentType
    );
    const currentTotalInterest = calculateTotalInterest(
      input.currentBalance,
      input.currentAnnualRate,
      input.remainingMonths,
      input.currentRepaymentType
    );
    const netSaving = currentTotalInterest - totalInterest - totalSwitchingCost;
    const decision = getDecision(netSaving, null);

    return {
      id: scenario.id,
      label: scenario.label,
      annualRate: scenario.rate,
      monthlyPayment,
      totalInterest,
      netSaving,
      decisionLabel: decision.label,
    };
  });
}
```

### 8-2. 표시

| 시나리오 | 신규 금리 | 월 납입금 | 총이자 | 순절감액 | 판단 |
| --- | ---: | ---: | ---: | ---: | --- |
| 기준 | 입력 금리 | 계산값 | 계산값 | 계산값 | 라벨 |
| 금리 하락 | 입력 금리 - delta | 계산값 | 계산값 | 계산값 | 라벨 |
| 금리 상승 | 입력 금리 + delta | 계산값 | 계산값 | 계산값 | 라벨 |

---

## 9. 클라이언트 스크립트 구조

파일: `public/scripts/loan-refinancing-calculator.js`

```js
(function () {
  const root = document.querySelector('[data-calculator="loan-refinancing-calculator"]');
  if (!root) return;

  const state = {
    loanType: 'mortgage',
    currentBalance: 300000000,
    currentAnnualRate: 0.048,
    remainingMonths: 240,
    currentRepaymentType: 'annuity',
    currentMonthlyPaymentOverride: null,
    currentRateType: 'variable',
    newAnnualRate: 0.041,
    newTermMonths: 240,
    newRepaymentType: 'annuity',
    newMonthlyPaymentOverride: null,
    newRateType: 'fixed',
    prepaymentPenaltyRate: 0.012,
    penaltyRemainingMonths: 12,
    penaltyTotalMonths: 36,
    penaltyExemptAmount: 0,
    newLoanCosts: 0,
    rateScenarioDelta: 0.005,
  };

  function calculate(input) {}
  function render(result) {}
  function syncFromForm() {}
  function syncToUrl() {}
  function restoreFromUrl() {}
  function applyPreset(id) {}
  function applyLoanTypePreset(id) {}

  restoreFromUrl();
  render(calculate(state));
})();
```

필수 인터랙션:

- 입력 변경 시 즉시 계산
- 대출 종류 변경 시 기본값 자동 반영
- 기존 잔여 기간과 신규 기간을 `같게 맞추기` 버튼 제공
- `현재 월 납입금 직접 입력` 체크 시 자동 계산값 대신 사용
- `신규 월 납입금 직접 입력` 체크 시 자동 계산값 대신 사용
- 상환 방식 변경 시 안내 문구 갱신
- URL 파라미터 저장/복원
- 프리셋 적용

---

## 10. Astro 마크업 설계

### 10-1. Frontmatter

```astro
---
import BaseLayout from '../../components/BaseLayout.astro';
import SimpleToolShell from '../../components/SimpleToolShell.astro';
import CalculatorHero from '../../components/CalculatorHero.astro';
import InfoNotice from '../../components/InfoNotice.astro';
import SeoContent from '../../components/SeoContent.astro';
import {
  LRC_META,
  LRC_LOAN_TYPE_PRESETS,
  LRC_PRESETS,
  LRC_FAQ,
  LRC_RELATED,
} from '../../data/loanRefinancingCalculator';
---
```

### 10-2. 주요 DOM ID

| DOM | 용도 |
| --- | --- |
| `#lrc-loan-type` | 대출 종류 |
| `#lrc-current-balance` | 현재 대출 잔액 |
| `#lrc-current-rate` | 현재 금리 |
| `#lrc-remaining-months` | 남은 기간 |
| `#lrc-current-repayment` | 기존 상환 방식 |
| `#lrc-new-rate` | 신규 대출 금리 |
| `#lrc-new-term-months` | 신규 대출 기간 |
| `#lrc-new-repayment` | 신규 상환 방식 |
| `#lrc-penalty-rate` | 중도상환수수료율 |
| `#lrc-penalty-remaining-months` | 수수료 남은 기간 |
| `#lrc-new-loan-costs` | 신규 부대비용 |
| `#lrc-monthly-saving` | 월 절감액 |
| `#lrc-interest-saving` | 총 이자 절감액 |
| `#lrc-net-saving` | 순절감액 |
| `#lrc-break-even` | 손익분기 개월 |
| `#lrc-breakdown-body` | 비용 분해표 tbody |
| `#lrc-scenario-body` | 금리 시나리오 tbody |

---

## 11. 결과 UI 설계

### 11-1. KPI 카드

| 카드 | 데이터 | 클래스 |
| --- | --- | --- |
| 월 납입금 절감액 | `monthlySaving` | `report-stat-card--primary` |
| 총 이자 절감액 | `totalInterestSaving` | 기본 |
| 갈아타기 순절감액 | `netSaving` | 톤 조건부 |
| 수수료 회수 기간 | `breakEvenMonths` | `report-stat-card--accent` |

`monthlySaving`이 음수이면 "월 납입금 증가"로 표시한다.

### 11-2. 판단 배지

| label | tone | UI |
| --- | --- | --- |
| 지금 유리 | positive | 초록 |
| 조건부 유리 | neutral | 기본 |
| 보류 | caution | 노랑 |
| 불리 | danger | 빨강 |

### 11-3. 비용 분해표

| 항목 | 기존 대출 | 신규 대출 | 차이 |
| --- | ---: | ---: | ---: |
| 월 납입금 | `currentCost.monthlyPayment` | `newCost.monthlyPayment` | `monthlySaving` |
| 총 이자 | `currentCost.totalInterest` | `newCost.totalInterest` | `totalInterestSaving` |
| 중도상환수수료 | - | `prepaymentPenalty` | 비용 |
| 신규 부대비용 | - | `newLoanCosts` | 비용 |
| 순절감액 | - | - | `netSaving` |

### 11-4. 손익분기 타임라인

- 0개월: 갈아타기 비용 발생
- `breakEvenMonths / 2`: 절반 회수
- `breakEvenMonths`: 손익분기 도달
- 이후: 월 절감액 누적

`breakEvenMonths`가 null이면 "월 절감액이 없어 회수 기간을 계산할 수 없습니다." 표시.

---

## 12. 입력 UX 설계

### Step 1. 기존 대출

| 필드 | UI | 비고 |
| --- | --- | --- |
| 대출 종류 | select/pill | 프리셋 자동 적용 |
| 현재 대출 잔액 | money input | 빠른 버튼: 3천만/1억/2억/3억/5억 |
| 현재 금리 | percent input | 내부 decimal 변환 |
| 남은 기간 | number + unit | 년/개월 토글 가능하면 좋음 |
| 상환 방식 | select | 원리금균등/원금균등/만기일시 |
| 금리 유형 | segmented | 고정/변동/혼합 |

### Step 2. 신규 대출

| 필드 | UI | 비고 |
| --- | --- | --- |
| 신규 금리 | percent input | 은행 앱에서 받은 금리 입력 |
| 신규 기간 | number | 기본은 기존 잔여 기간과 동일 |
| 기간 맞추기 | icon/text button | 기존 잔여 기간으로 복사 |
| 신규 상환 방식 | select | 기본은 기존 방식 |
| 신규 금리 유형 | segmented | 고정/변동/혼합 |
| 신규 부대비용 | money input | 인지세, 보증료 등 |

### Step 3. 수수료·시나리오

| 필드 | UI | 비고 |
| --- | --- | --- |
| 중도상환수수료율 | percent input | 약정서 확인 안내 |
| 수수료 남은 기간 | number | 개월 |
| 전체 수수료 부과 기간 | number | 보통 36개월 |
| 수수료 면제 금액 | money input | 일부 면제 한도 |
| 금리 시나리오 폭 | percent input | 기본 0.5%p |

---

## 13. 프리셋 시나리오

```ts
export const LRC_PRESETS: LoanRefinancingPreset[] = [
  {
    id: 'mortgage-rate-cut',
    label: '주담대 0.7%p 인하',
    description: '잔액 3억 원, 20년 남은 주담대를 더 낮은 금리로 비교합니다.',
    input: {
      loanType: 'mortgage',
      currentBalance: 300000000,
      currentAnnualRate: 0.048,
      newAnnualRate: 0.041,
      remainingMonths: 240,
      newTermMonths: 240,
      currentRepaymentType: 'annuity',
      newRepaymentType: 'annuity',
    },
  },
  {
    id: 'jeonse-bullet',
    label: '전세대출 갈아타기',
    description: '만기일시 전세대출의 월 이자 절감액을 비교합니다.',
    input: {
      loanType: 'jeonse',
      currentBalance: 150000000,
      currentAnnualRate: 0.045,
      newAnnualRate: 0.038,
      remainingMonths: 24,
      newTermMonths: 24,
      currentRepaymentType: 'bullet',
      newRepaymentType: 'bullet',
    },
  },
  {
    id: 'credit-refinance',
    label: '신용대출 대환',
    description: '고금리 신용대출을 낮은 금리로 바꾸는 경우입니다.',
    input: {
      loanType: 'credit',
      currentBalance: 30000000,
      currentAnnualRate: 0.075,
      newAnnualRate: 0.059,
      remainingMonths: 60,
      newTermMonths: 60,
    },
  },
  {
    id: 'term-extension',
    label: '기간 연장 대환',
    description: '월 납입금은 줄지만 총이자가 늘 수 있는 시나리오입니다.',
    input: {
      loanType: 'mortgage',
      currentBalance: 200000000,
      currentAnnualRate: 0.045,
      newAnnualRate: 0.04,
      remainingMonths: 120,
      newTermMonths: 240,
    },
  },
];
```

---

## 14. URL 파라미터

공유 가능한 링크를 위해 핵심 값만 저장한다.

| 파라미터 | 필드 |
| --- | --- |
| `type` | loanType |
| `balance` | currentBalance |
| `cr` | currentAnnualRate |
| `nr` | newAnnualRate |
| `months` | remainingMonths |
| `newMonths` | newTermMonths |
| `repay` | currentRepaymentType |
| `newRepay` | newRepaymentType |
| `penalty` | prepaymentPenaltyRate |
| `costs` | newLoanCosts |

예시:

```text
/tools/loan-refinancing-calculator/?type=mortgage&balance=300000000&cr=0.048&nr=0.041&months=240
```

---

## 15. SEO 콘텐츠 설계

```astro
<SeoContent
  introTitle="대출 갈아타기 계산기 — 결과 읽는 법"
  intro={[
    '대출 갈아타기는 신규 금리가 낮다고 항상 유리한 것은 아닙니다. 중도상환수수료, 신규 대출 부대비용, 대출 기간 변화까지 함께 비교해야 실제 손익을 알 수 있습니다.',
    '이 계산기는 기존 대출과 신규 대출 조건을 입력해 월 납입금 절감액, 총 이자 절감액, 수수료 회수 기간을 계산합니다.',
  ]}
  inputPoints={[
    '현재 대출 잔액, 금리, 남은 기간을 입력합니다.',
    '신규 대출 금리와 상환 기간을 입력해 월 납입금을 비교합니다.',
    '중도상환수수료와 부대비용을 차감해 손익분기 시점을 확인합니다.',
  ]}
  criteria={[
    '입력값을 바탕으로 한 참고용 예상 계산입니다.',
    '실제 대환 가능 여부와 금리는 금융회사 심사, DSR, LTV, 신용점수, 소득에 따라 달라질 수 있습니다.',
    '신규 대출 기간을 늘리면 월 납입금은 줄어도 총이자가 증가할 수 있습니다.',
    '제휴 링크가 포함되는 경우 별도 고지를 표시합니다.',
  ]}
  faq={LRC_FAQ}
  related={LRC_RELATED}
/>
```

---

## 16. FAQ

```ts
export const LRC_FAQ: FaqItem[] = [
  {
    q: '금리가 얼마나 낮아져야 갈아타는 게 유리한가요?',
    a: '대출 잔액, 남은 기간, 중도상환수수료, 신규 대출 부대비용에 따라 달라집니다. 대출 잔액이 크고 남은 기간이 길수록 작은 금리 차이도 절감액이 커질 수 있습니다.',
  },
  {
    q: '월 납입금이 줄면 무조건 이득인가요?',
    a: '아닙니다. 신규 대출 기간을 길게 늘리면 월 납입금은 줄어도 총이자는 오히려 늘어날 수 있습니다. 월 납입금과 총이자를 함께 비교해야 합니다.',
  },
  {
    q: '중도상환수수료가 있으면 갈아타지 않는 게 낫나요?',
    a: '꼭 그렇지는 않습니다. 월 납입금 절감액이나 총 이자 절감액이 수수료보다 크고, 수수료 회수 기간 이후에도 대출을 유지할 계획이라면 갈아타기가 유리할 수 있습니다.',
  },
  {
    q: '고정금리에서 변동금리로 갈아타도 괜찮을까요?',
    a: '변동금리는 초기 금리가 낮을 수 있지만 향후 금리 상승 위험이 있습니다. 기준 시나리오뿐 아니라 금리 상승 시나리오에서도 순절감액이 남는지 확인해야 합니다.',
  },
  {
    q: '대출 갈아타기 계산 결과가 실제 은행 승인 결과와 같나요?',
    a: '아니요. 이 계산기는 비용과 이자 절감액을 추정하는 도구입니다. 실제 승인 여부, 금리, 한도는 DSR, LTV, 신용점수, 소득, 담보가치, 은행 심사 기준에 따라 달라질 수 있습니다.',
  },
  {
    q: '전세대출도 이 계산기로 비교할 수 있나요?',
    a: '가능합니다. 전세대출은 만기일시 상환 구조가 많으므로 상환 방식을 만기일시로 선택하면 월 이자 절감액 중심으로 비교할 수 있습니다. 보증료와 보증기관 조건도 함께 확인하세요.',
  },
];
```

---

## 17. 관련 링크

```ts
export const LRC_RELATED = [
  {
    href: '/tools/mortgage-prepayment-penalty/',
    label: '중도상환수수료 계산기',
  },
  {
    href: '/reports/seoul-mortgage-refinancing-2026/',
    label: '서울 주요 구별 대환대출 손익 비교 2026',
  },
  {
    href: '/tools/real-estate-acquisition-tax/',
    label: '부동산 취득세 계산기',
  },
  {
    href: '/tools/year-end-tax-refund-calculator/',
    label: '연말정산 환급액 계산기',
  },
];
```

---

## 18. SCSS 설계

파일: `src/styles/scss/pages/_loan-refinancing-calculator.scss`

주요 클래스:

```scss
.lrc-page {}
.lrc-step {}
.lrc-field-grid {}
.lrc-segmented {}
.lrc-quick-values {}
.lrc-result-grid {}
.lrc-decision-badge {}
.lrc-breakdown {}
.lrc-break-even-timeline {}
.lrc-scenario-table {}
.lrc-warning-list {}
.lrc-checklist {}
.lrc-cta-band {}
```

스타일 원칙:

- 금융 계산기이므로 차분하고 업무형으로 구성한다.
- 초록/빨강은 판단 라벨에만 제한적으로 사용한다.
- 카드 안에 카드 중첩 금지.
- 표는 모바일 가로 스크롤.
- 금액 KPI는 숫자를 크게, 단위는 작게 표시한다.
- 입력 영역은 모바일 1열, 태블릿 2열, 데스크톱 2~3열.

---

## 19. 접근성 및 UX 체크

- 모든 입력에 `label` 연결.
- 금액 입력은 `inputmode="numeric"`.
- 금리 입력은 `%` 단위 보조 텍스트 표시.
- 결과 KPI 영역은 `aria-live="polite"`.
- 판단 라벨은 색상과 텍스트를 함께 사용.
- 손익분기 타임라인은 텍스트 설명을 함께 제공.
- 고급 입력 패널은 `aria-expanded` 적용.
- 프리셋 버튼은 `aria-pressed` 적용.

---

## 20. 고정 안내 문구

### InfoNotice

```text
이 계산기는 입력한 대출 조건을 바탕으로 한 예상 손익 계산입니다.
실제 대환 가능 여부, 금리, 한도, 수수료, 부대비용은 금융회사 심사와 약정 조건에 따라 달라질 수 있습니다.
```

### 기간 연장 경고

```text
신규 대출 기간을 기존 잔여 기간보다 길게 설정하면 월 납입금은 줄어도 총이자는 증가할 수 있습니다.
월 부담과 총비용을 함께 확인하세요.
```

### 변동금리 경고

```text
변동금리는 향후 금리 변동에 따라 월 납입금이 달라질 수 있습니다.
금리 상승 시나리오에서도 손익분기점이 유지되는지 확인하세요.
```

### 제휴 링크 안내

```text
일부 대출 비교 링크에는 제휴 링크가 포함될 수 있습니다.
대출 조건은 금융회사 심사 결과에 따라 달라집니다.
```

---

## 21. 검증 시나리오

| 케이스 | 입력 | 기대 결과 |
| --- | --- | --- |
| 주담대 기본 | 잔액 3억, 4.8% → 4.1%, 20년 | 월 절감액 양수, 순절감액 양수 |
| 수수료 과다 | 잔액 4억, 금리차 0.2%p, 수수료 1.2% | 회수 기간 길거나 불리 |
| 기간 연장 | 기존 10년, 신규 20년 | 월 납입금 감소, 총이자 증가 경고 |
| 전세대출 | 만기일시, 4.5% → 3.8% | 월 이자 절감 중심 결과 |
| 월 절감 없음 | 신규 금리가 더 높음 | breakEvenMonths null, 불리 라벨 |
| 수수료 면제 | penaltyRemainingMonths 0 | 중도상환수수료 0원 |
| 금리 상승 시나리오 | delta 0.5%p | 상승 시나리오 순절감액 감소 |

---

## 22. 구현 체크리스트

### 데이터

- [ ] `LRC_META` 작성
- [ ] `LRC_LOAN_TYPE_PRESETS` 작성
- [ ] `LRC_PRESETS` 작성
- [ ] `LRC_FAQ` 작성
- [ ] `LRC_RELATED` 작성

### 페이지

- [ ] Hero/InfoNotice 구성
- [ ] SimpleToolShell 기반 입력/결과 영역 구성
- [ ] 기존 대출, 신규 대출, 수수료 입력 섹션 구성
- [ ] KPI 카드 4개 구성
- [ ] 비용 분해표 구성
- [ ] 손익분기 타임라인 구성
- [ ] 금리 시나리오 표 구성
- [ ] SeoContent 연결

### 스크립트

- [ ] 상환 방식별 월 납입금 계산
- [ ] 상환 방식별 총이자 계산
- [ ] 중도상환수수료 계산
- [ ] 판단 라벨 계산
- [ ] 금리 시나리오 계산
- [ ] URL 상태 저장/복원
- [ ] 프리셋 적용
- [ ] 금액/금리 포맷팅

### 등록

- [ ] `src/data/tools.ts` 등록
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` URL 추가
- [ ] `npm run build` 성공 확인

---

## 23. v1/v2 경계

### v1에 포함

- 주담대·전세대출·신용대출 프리셋
- 기존/신규 대출 조건 입력
- 원리금균등·원금균등·만기일시 계산
- 중도상환수수료와 신규 부대비용 차감
- 월 납입금 절감액, 총 이자 절감액, 순절감액 계산
- 수수료 회수 기간과 판단 라벨
- 금리 상승/하락 시나리오
- FAQ와 관련 링크

### v2로 미룸

- 은행별 대환 금리 수동 비교표
- DSR/LTV 간이 체크
- 중도상환수수료 면제일 자동 계산
- 대환 실행일 기준 월별 현금흐름 차트
- 대출 비교 서비스 제휴 API 연동
- 사용자 계산 내역 저장

---

## 24. 최종 구현 방향

이 계산기는 "가장 낮은 금리 찾기"가 아니라 "내 조건에서 갈아타면 실제로 남는 돈이 있는지"를 보여주는 도구다. 핵심 결과는 월 납입금 절감액이지만, 판단은 반드시 순절감액과 손익분기 시점을 함께 보도록 설계한다.

특히 신규 대출 기간을 늘리는 경우 월 납입금만 보면 좋아 보일 수 있으므로 총이자 증가 경고를 강하게 노출한다. 금융상품 페이지 특성상 제휴 CTA는 사용할 수 있지만, 승인 가능성이나 최저금리 보장처럼 오해될 수 있는 문구는 피한다.
