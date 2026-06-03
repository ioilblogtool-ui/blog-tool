# 건강보험료 계산기 2026 — 설계 문서

> 기획 원문: `docs/plan/202606/health-insurance-premium-calculator.md`  
> 작성일: 2026-06-03  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 2026년 건강보험료율 7.19%, 장기요양보험료율 건강보험료 대비 13.14%를 반영해 직장가입자·지역가입자·퇴직 전환 시나리오를 비교한다.

---

## 1. 문서 개요

- 구현 대상: `건강보험료 계산기 2026`
- slug: `health-insurance-premium-calculator`
- URL: `/tools/health-insurance-premium-calculator/`
- 카테고리: 연봉·이직 / 세금·보험
- 핵심 검색 의도: `건강보험료 계산기`, `직장가입자 건강보험료`, `지역가입자 건강보험료`, `2026 건강보험료율`, `퇴직 후 건강보험료`
- 핵심 출력: 월 건강보험료, 장기요양보험료, 월 총 납부액, 연간 납부액, 회사 부담분, 2025년 대비 증가액, 퇴직 전후 부담 차이
- 안전 장치: 직장가입자 보수월액 보험료는 공식 요율 기반으로 계산하되, 연봉 환산·지역가입자·퇴직 전환 결과에는 `추정` 또는 `시뮬레이션` 배지를 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    healthInsurancePremiumCalculator.ts
  pages/
    tools/
      health-insurance-premium-calculator.astro

public/
  scripts/
    health-insurance-premium-calculator.js

src/styles/scss/pages/
  _health-insurance-premium-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/pages/tools/index.astro` 카테고리 문구 필요 시 추가
- `src/pages/index.astro` 홈 노출 필요 시 topic 매핑 추가
- `src/styles/app.scss`에 `@use 'scss/pages/health-insurance-premium-calculator';`
- `public/sitemap.xml`
- `public/og/tools/health-insurance-premium-calculator.png` 또는 OG 생성 대상 등록

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- 모바일은 입력 먼저, 결과는 입력 아래에 표시한다.
- SCSS prefix: `hip-`
- pageClass: `hip-page`
- 결과 첫 카드는 사용자가 가장 궁금해하는 `월 총 납부액`으로 둔다.
- 직장가입자 결과는 `공식`, 지역가입자와 퇴직 전환 비교는 `추정`으로 시각적으로 구분한다.
- 차트는 필수가 아니며, MVP에서는 `직장/지역/임의계속` 비교 막대형 카드 또는 CSS bar만으로 충분하다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="health-insurance-premium-calculator"
  pageClass="hip-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 공식 기준·추정 범위 안내 `InfoNotice`
3. 가입자 유형 세그먼트: 직장가입자 / 지역가입자 / 퇴직 전환 비교
4. 프리셋 버튼
5. 입력 패널
6. 핵심 결과 KPI
7. 직장가입자 근로자·회사 분담표
8. 지역가입자 간이 추정 안내 또는 퇴직 전환 비교표
9. 2025년 대비 증가액 카드
10. 보수 외 소득·피부양자·임의계속가입 체크 안내
11. 공식 확인 CTA
12. SeoContent

---

## 5. 공식 기준 데이터

파일: `src/data/healthInsurancePremiumCalculator.ts`

```ts
export const HEALTH_INSURANCE_RULES_2026 = {
  year: 2026,
  healthRate: 0.0719,
  employeeShareRate: 0.03595,
  employerShareRate: 0.03595,
  longTermCareRateOnHealthPremium: 0.1314,
  longTermCareRateByIncome: 0.009448,
  otherIncomeThreshold: 20_000_000,
  previousYear: {
    year: 2025,
    healthRate: 0.0709,
    employeeShareRate: 0.03545,
    employerShareRate: 0.03545,
    longTermCareRateOnHealthPremium: 0.1295,
  },
  sources: [
    {
      label: "보건복지부 2026년 건강보험료율 7.19%로 결정",
      url: "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1487279&mid=a10503010000",
    },
    {
      label: "보건복지부 2026년도 장기요양보험료율 0.9448%",
      url: "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1487817&mid=a10503010000",
    },
    {
      label: "국민건강보험공단 Contribution Rate",
      url: "https://www.nhis.or.kr/english/wbheaa02500m01.do",
    },
  ],
};
```

구현 전 확인 필요:

- 2026년 지역가입자 부과점수당 금액
- 2026년 월별 건강보험료 상·하한액
- 10원 미만 절사 규칙의 실제 적용 순서

MVP에서는 위 3개를 `공식 확인 필요` 항목으로 남기고, 직장가입자 보수월액 일반 구간 계산부터 구현한다.

---

## 6. 데이터 모델

```ts
export type HealthInsuranceMode = "employee" | "regional" | "transition";
export type EmployeeIncomeMode = "monthlyWage" | "annualSalary";
export type RegionalInputMode = "simple" | "points";
export type ResultBadge = "official" | "estimate" | "simulation" | "notice";

export interface EmployeeHealthInput {
  incomeMode: EmployeeIncomeMode;
  monthlyWage: number;
  annualSalary: number;
  otherAnnualIncome: number;
  showEmployerShare: boolean;
}

export interface RegionalHealthInput {
  inputMode: RegionalInputMode;
  annualIncome: number;
  propertyTaxBase: number;
  rentDeposit: number;
  carValue: number;
  directPoints: number;
}

export interface TransitionHealthInput {
  beforeMonthlyWage: number;
  afterAnnualIncome: number;
  afterPropertyTaxBase: number;
  afterRentDeposit: number;
  directRegionalPoints: number;
  useContinuationScenario: boolean;
}

export interface HealthInsuranceInput {
  mode: HealthInsuranceMode;
  employee: EmployeeHealthInput;
  regional: RegionalHealthInput;
  transition: TransitionHealthInput;
}

export interface PremiumBreakdown {
  healthPremium: number;
  longTermCarePremium: number;
  totalPremium: number;
  annualTotalPremium: number;
  badge: ResultBadge;
}

export interface EmployeePremiumResult {
  employee: PremiumBreakdown;
  employer: PremiumBreakdown;
  combined: PremiumBreakdown;
  previousEmployee: PremiumBreakdown;
  monthlyIncreaseFrom2025: number;
  otherIncomeWarning: boolean;
  monthlyWageBasisLabel: string;
}

export interface RegionalPremiumResult {
  regional: PremiumBreakdown;
  estimatedPoints: number | null;
  usedDirectPoints: boolean;
  cautionMessages: string[];
}

export interface TransitionPremiumResult {
  beforeEmployee: PremiumBreakdown;
  afterRegional: PremiumBreakdown;
  continuation: PremiumBreakdown | null;
  monthlyDifference: number;
  recommendedLabel: string;
  cautionMessages: string[];
}

export interface HealthInsuranceResult {
  mode: HealthInsuranceMode;
  employee: EmployeePremiumResult;
  regional: RegionalPremiumResult;
  transition: TransitionPremiumResult;
  interpretation: string;
  warnings: string[];
}
```

---

## 7. 기본값 및 프리셋

```ts
export const DEFAULT_HEALTH_INSURANCE_INPUT: HealthInsuranceInput = {
  mode: "employee",
  employee: {
    incomeMode: "monthlyWage",
    monthlyWage: 3_000_000,
    annualSalary: 36_000_000,
    otherAnnualIncome: 0,
    showEmployerShare: true,
  },
  regional: {
    inputMode: "simple",
    annualIncome: 30_000_000,
    propertyTaxBase: 0,
    rentDeposit: 0,
    carValue: 0,
    directPoints: 0,
  },
  transition: {
    beforeMonthlyWage: 4_000_000,
    afterAnnualIncome: 12_000_000,
    afterPropertyTaxBase: 200_000_000,
    afterRentDeposit: 0,
    directRegionalPoints: 0,
    useContinuationScenario: true,
  },
};
```

프리셋:

| id | 라벨 | 모드 | 핵심 입력 |
| --- | --- | --- | --- |
| `new-worker` | 신입 월급 250만 원 | 직장 | 월 보수 250만 원 |
| `average-worker` | 연봉 4,800만 원 | 직장 | 연봉 4,800만 원 |
| `high-income` | 연봉 9,000만 원 | 직장 | 연봉 9,000만 원, 보수 외 소득 0원 |
| `freelancer` | 프리랜서 연소득 5천 | 지역 | 연소득 5,000만 원 |
| `retiree` | 퇴직 예정자 | 전환 | 퇴직 전 월 500만 원, 퇴직 후 소득 0원, 재산 3억 원 |

---

## 8. 계산 로직

### 8-1. 공통 유틸

```js
function roundWon(value) {
  return Math.round(value);
}

function floorToTenWon(value) {
  return Math.floor(value / 10) * 10;
}

function getLongTermCarePremium(healthPremium, rules) {
  return floorToTenWon(healthPremium * rules.longTermCareRateOnHealthPremium);
}

function getPremiumBreakdown(healthPremium, rules, badge) {
  const safeHealthPremium = floorToTenWon(Math.max(0, healthPremium));
  const longTermCarePremium = getLongTermCarePremium(safeHealthPremium, rules);
  const totalPremium = safeHealthPremium + longTermCarePremium;
  return {
    healthPremium: safeHealthPremium,
    longTermCarePremium,
    totalPremium,
    annualTotalPremium: totalPremium * 12,
    badge,
  };
}
```

절사 규칙은 구현 직전 공식 기준을 재확인한다. 확인 전까지는 `floorToTenWon`을 적용하되 데이터 파일 주석에 "검증 필요"를 남긴다.

### 8-2. 직장가입자 계산

```js
function getMonthlyWage(employeeInput) {
  if (employeeInput.incomeMode === "annualSalary") {
    return employeeInput.annualSalary / 12;
  }
  return employeeInput.monthlyWage;
}

function calculateEmployeePremium(employeeInput, rules) {
  const monthlyWage = getMonthlyWage(employeeInput);
  const employeeHealth = monthlyWage * rules.employeeShareRate;
  const employerHealth = monthlyWage * rules.employerShareRate;
  const previousHealth = monthlyWage * rules.previousYear.employeeShareRate;

  const employee = getPremiumBreakdown(employeeHealth, rules, "official");
  const employer = getPremiumBreakdown(employerHealth, rules, "official");
  const combined = {
    healthPremium: employee.healthPremium + employer.healthPremium,
    longTermCarePremium: employee.longTermCarePremium + employer.longTermCarePremium,
    totalPremium: employee.totalPremium + employer.totalPremium,
    annualTotalPremium: (employee.totalPremium + employer.totalPremium) * 12,
    badge: "official",
  };
  const previousEmployee = getPremiumBreakdown(previousHealth, rules.previousYear, "notice");

  return {
    employee,
    employer,
    combined,
    previousEmployee,
    monthlyIncreaseFrom2025: employee.totalPremium - previousEmployee.totalPremium,
    otherIncomeWarning: employeeInput.otherAnnualIncome > rules.otherIncomeThreshold,
    monthlyWageBasisLabel:
      employeeInput.incomeMode === "annualSalary" ? "연봉 12분의 1 환산" : "보수월액 입력",
  };
}
```

### 8-3. 지역가입자 간이 계산

지역가입자는 MVP에서 두 모드를 지원한다.

#### 직접 부과점수 모드

```js
function calculateRegionalByPoints(regionalInput, rules, pointUnitPrice) {
  const healthPremium = regionalInput.directPoints * pointUnitPrice;
  return {
    regional: getPremiumBreakdown(healthPremium, rules, "estimate"),
    estimatedPoints: regionalInput.directPoints,
    usedDirectPoints: true,
    cautionMessages: [
      "부과점수 직접 입력 결과도 실제 감면·정산 여부에 따라 달라질 수 있습니다.",
    ],
  };
}
```

#### 간이 추정 모드

```js
function estimateRegionalPoints(regionalInput) {
  const incomeMonthly = regionalInput.annualIncome / 12;
  const incomePremiumProxy = incomeMonthly * 0.0719;

  const propertyBase = Math.max(0, regionalInput.propertyTaxBase + regionalInput.rentDeposit * 0.3);
  const propertyPremiumProxy = propertyBase > 0 ? propertyBase * 0.0000015 : 0;
  const carPremiumProxy = regionalInput.carValue >= 40_000_000 ? 25_000 : 0;

  return {
    healthPremiumProxy: incomePremiumProxy + propertyPremiumProxy + carPremiumProxy,
    cautionMessages: [
      "지역가입자 보험료는 소득·재산·자동차·세대 구성에 따라 달라지는 간이 추정값입니다.",
      "정확한 금액은 국민건강보험공단 보험료 조회 또는 고지서를 기준으로 확인해야 합니다.",
    ],
  };
}

function calculateRegionalSimple(regionalInput, rules) {
  const estimated = estimateRegionalPoints(regionalInput);
  return {
    regional: getPremiumBreakdown(estimated.healthPremiumProxy, rules, "estimate"),
    estimatedPoints: null,
    usedDirectPoints: false,
    cautionMessages: estimated.cautionMessages,
  };
}
```

주의:

- 위 간이 모델은 검색 유입용 감각 계산에만 사용한다.
- 실제 지역가입자 점수 산식 전체 구현 전까지 `지역가입자 간이 추정` 배지를 반드시 표시한다.
- 2차 구현에서 공식 점수표를 데이터화하면 `estimateRegionalPoints`를 교체한다.

### 8-4. 퇴직 전환 비교

```js
function calculateTransitionPremium(transitionInput, rules, pointUnitPrice) {
  const beforeEmployee = getPremiumBreakdown(
    transitionInput.beforeMonthlyWage * rules.employeeShareRate,
    rules,
    "official"
  );

  const regionalInput = {
    inputMode: transitionInput.directRegionalPoints > 0 ? "points" : "simple",
    annualIncome: transitionInput.afterAnnualIncome,
    propertyTaxBase: transitionInput.afterPropertyTaxBase,
    rentDeposit: transitionInput.afterRentDeposit,
    carValue: 0,
    directPoints: transitionInput.directRegionalPoints,
  };

  const afterRegionalResult =
    regionalInput.inputMode === "points"
      ? calculateRegionalByPoints(regionalInput, rules, pointUnitPrice)
      : calculateRegionalSimple(regionalInput, rules);

  const continuation = transitionInput.useContinuationScenario
    ? getPremiumBreakdown(transitionInput.beforeMonthlyWage * rules.employeeShareRate, rules, "simulation")
    : null;

  const afterRegional = afterRegionalResult.regional;
  const monthlyDifference = afterRegional.totalPremium - beforeEmployee.totalPremium;

  return {
    beforeEmployee,
    afterRegional,
    continuation,
    monthlyDifference,
    recommendedLabel:
      continuation && continuation.totalPremium < afterRegional.totalPremium
        ? "임의계속가입 검토"
        : "피부양자·지역가입자 조건 확인",
    cautionMessages: [
      "퇴직 후 실제 자격은 피부양자 요건, 임의계속가입 신청 가능 여부, 세대 소득·재산에 따라 달라집니다.",
      ...afterRegionalResult.cautionMessages,
    ],
  };
}
```

### 8-5. 통합 계산

```js
function calculateHealthInsurance(input, rules, pointUnitPrice) {
  const employee = calculateEmployeePremium(input.employee, rules);
  const regional =
    input.regional.inputMode === "points"
      ? calculateRegionalByPoints(input.regional, rules, pointUnitPrice)
      : calculateRegionalSimple(input.regional, rules);
  const transition = calculateTransitionPremium(input.transition, rules, pointUnitPrice);

  const warnings = [];
  if (employee.otherIncomeWarning) {
    warnings.push("보수 외 소득이 연 2,000만 원을 초과해 소득월액보험료 확인이 필요합니다.");
  }
  if (input.mode === "regional") {
    warnings.push("지역가입자 결과는 간이 추정값입니다.");
  }

  return {
    mode: input.mode,
    employee,
    regional,
    transition,
    interpretation: buildInterpretation(input, { employee, regional, transition }),
    warnings,
  };
}
```

---

## 9. 입력 UI 설계

### 가입자 유형 세그먼트

```html
<div class="hip-mode-tabs" role="tablist" aria-label="가입자 유형 선택">
  <button type="button" class="hip-mode-tab is-active" data-hip-mode="employee">직장가입자</button>
  <button type="button" class="hip-mode-tab" data-hip-mode="regional">지역가입자</button>
  <button type="button" class="hip-mode-tab" data-hip-mode="transition">퇴직 전환 비교</button>
</div>
```

### 프리셋

```html
<div class="hip-preset-grid" aria-label="빠른 입력">
  <button type="button" data-hip-preset="new-worker">신입 월급 250만</button>
  <button type="button" data-hip-preset="average-worker">연봉 4,800만</button>
  <button type="button" data-hip-preset="high-income">연봉 9,000만</button>
  <button type="button" data-hip-preset="freelancer">프리랜서</button>
  <button type="button" data-hip-preset="retiree">퇴직 예정자</button>
</div>
```

### 직장가입자 패널

| 필드 | UI | 기본값 | 유효성 |
| --- | --- | ---: | --- |
| 입력 방식 | 세그먼트 | 월 보수월액 | 월 보수월액 / 연봉 |
| 월 보수월액 | number | 3,000,000 | 0 이상 |
| 연봉 | number | 36,000,000 | 0 이상 |
| 보수 외 소득 | number | 0 | 0 이상 |
| 회사 부담분 표시 | toggle | true | boolean |

보조 문구:

- 월 보수월액: "비과세 수당을 제외한 건강보험 보수월액 기준입니다."
- 연봉: "연봉 입력 시 12개월로 나눈 추정 보수월액을 사용합니다."
- 보수 외 소득: "연 2,000만 원 초과 시 소득월액보험료 확인이 필요할 수 있습니다."

### 지역가입자 패널

| 필드 | UI | 기본값 | 유효성 |
| --- | --- | ---: | --- |
| 계산 방식 | 세그먼트 | 간이 추정 | 간이 추정 / 부과점수 직접 |
| 연간 소득 | number | 30,000,000 | 0 이상 |
| 재산 과세표준 | number | 0 | 0 이상 |
| 전월세 보증금 | number | 0 | 0 이상 |
| 자동차 가액 | number | 0 | 0 이상 |
| 부과점수 | number | 0 | 0 이상 |

직접 부과점수 모드에서는 연간 소득·재산 입력을 숨기지 말고 비활성 또는 접힘 처리한다. 사용자가 공식 고지서의 점수를 아는 경우 더 정확한 흐름으로 이동하게 한다.

### 퇴직 전환 비교 패널

| 필드 | UI | 기본값 | 유효성 |
| --- | --- | ---: | --- |
| 퇴직 전 월 보수월액 | number | 4,000,000 | 0 이상 |
| 퇴직 후 예상 연소득 | number | 12,000,000 | 0 이상 |
| 퇴직 후 재산 과세표준 | number | 200,000,000 | 0 이상 |
| 퇴직 후 전월세 보증금 | number | 0 | 0 이상 |
| 지역 부과점수 직접 입력 | number | 0 | 0 이상 |
| 임의계속가입 시나리오 | toggle | true | boolean |

---

## 10. 결과 UI 설계

### KPI 카드

| 카드 | 레이블 | 값 | 배지 |
| --- | --- | --- | --- |
| Main | 월 총 납부액 | active totalPremium | 공식/추정 |
| 일반 | 건강보험료 | active healthPremium | 공식/추정 |
| 일반 | 장기요양보험료 | active longTermCarePremium | 공식 |
| 일반 | 연간 총 납부액 | active annualTotalPremium | 공식/추정 |
| Accent | 2025년 대비 월 증가액 | employee monthlyIncreaseFrom2025 | 참고 |

### 직장가입자 분담표

| 구분 | 건강보험료 | 장기요양보험료 | 월 합계 |
| --- | ---: | ---: | ---: |
| 근로자 부담 | 계산값 | 계산값 | 계산값 |
| 회사 부담 | 계산값 | 계산값 | 계산값 |
| 전체 보험료 | 계산값 | 계산값 | 계산값 |

회사 부담분 표시 토글이 꺼져도 "회사는 동일한 구조로 별도 부담" 안내 문구는 남긴다.

### 지역가입자 안내 카드

```text
지역가입자 결과는 간이 추정입니다.
소득·재산·전월세·자동차·세대 구성과 감면 여부에 따라 실제 고지액이 달라질 수 있습니다.
정확한 금액은 국민건강보험공단 조회 또는 고지서 기준으로 확인하세요.
```

### 퇴직 전환 비교표

| 시나리오 | 월 건강보험료 | 장기요양보험료 | 월 합계 | 상태 |
| --- | ---: | ---: | ---: | --- |
| 퇴직 전 직장가입자 | 계산값 | 계산값 | 계산값 | 공식 |
| 퇴직 후 지역가입자 | 계산값 | 계산값 | 계산값 | 추정 |
| 임의계속가입 | 계산값 | 계산값 | 계산값 | 시뮬레이션 |

차액 메시지:

```text
퇴직 후 지역가입자 간이 추정액은 퇴직 전보다 월 00,000원 높습니다.
피부양자 등재 또는 임의계속가입 가능성을 먼저 확인하세요.
```

### 경고/안내 배너

| 조건 | 문구 |
| --- | --- |
| 보수 외 소득 > 2,000만 원 | 보수 외 소득이 기준을 초과해 소득월액보험료 확인이 필요합니다. |
| 지역가입자 모드 | 지역가입자 결과는 실제 고지액과 다를 수 있는 간이 추정값입니다. |
| 퇴직 전환 모드 | 퇴직 후 자격은 피부양자 요건, 임의계속가입 신청 가능 여부에 따라 달라집니다. |
| 연봉 입력 모드 | 연봉 12분의 1 환산 기준이라 실제 보수월액과 다를 수 있습니다. |

---

## 11. Astro 마크업 구조

```astro
---
import BaseLayout from "../../components/BaseLayout.astro";
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  HEALTH_INSURANCE_RULES_2026,
  HEALTH_INSURANCE_PRESETS,
  HEALTH_INSURANCE_FAQ,
  HEALTH_INSURANCE_SEO,
} from "../../data/healthInsurancePremiumCalculator";
---

<BaseLayout
  title={HEALTH_INSURANCE_SEO.title}
  description={HEALTH_INSURANCE_SEO.description}
  ogImage="/og/tools/health-insurance-premium-calculator.png"
>
  <SimpleToolShell calculatorId="health-insurance-premium-calculator" pageClass="hip-page" resultFirst={false}>
    <Fragment slot="hero">
      <CalculatorHero
        eyebrow="4대보험 계산"
        title="건강보험료 계산기 2026"
        description="월급·연봉·프리랜서 소득을 입력하면 2026년 건강보험료와 장기요양보험료를 계산합니다."
      />
      <InfoNotice
        text="직장가입자 보수월액 보험료는 2026년 공식 요율을 적용합니다. 지역가입자와 퇴직 전환 결과는 입력값 기반 간이 추정이며 실제 고지액과 다를 수 있습니다."
      />
    </Fragment>

    <Fragment slot="input">
      <!-- mode tabs, presets, input panels -->
    </Fragment>

    <Fragment slot="result">
      <!-- KPI, breakdown, transition comparison, warnings -->
    </Fragment>

    <Fragment slot="seo">
      <SeoContent
        introTitle="건강보험료 계산기 2026 — 직장가입자와 지역가입자 보험료를 함께 보는 법"
        intro={HEALTH_INSURANCE_SEO.intro}
        inputPoints={HEALTH_INSURANCE_SEO.inputPoints}
        criteria={HEALTH_INSURANCE_SEO.criteria}
        faq={HEALTH_INSURANCE_FAQ}
        related={HEALTH_INSURANCE_SEO.related}
      />
    </Fragment>
  </SimpleToolShell>
  <script id="hip-data" type="application/json" set:html={JSON.stringify({
    rules: HEALTH_INSURANCE_RULES_2026,
    presets: HEALTH_INSURANCE_PRESETS,
  })}></script>
  <script type="module" src="/scripts/health-insurance-premium-calculator.js"></script>
</BaseLayout>
```

---

## 12. JavaScript 설계

파일: `public/scripts/health-insurance-premium-calculator.js`

### 주요 함수

```js
function q(selector)
function qa(selector)
function parseWon(value, fallback = 0)
function formatWon(value)
function formatManWon(value)
function formatSignedWon(value)
function floorToTenWon(value)
function readInputs()
function applyPreset(presetId)
function getActiveBreakdown(result)
function calculateEmployeePremium(employeeInput, rules)
function calculateRegionalSimple(regionalInput, rules)
function calculateRegionalByPoints(regionalInput, rules, pointUnitPrice)
function calculateTransitionPremium(transitionInput, rules, pointUnitPrice)
function calculateHealthInsurance(input, rules, pointUnitPrice)
function buildInterpretation(input, partialResult)
function renderKpis(activeBreakdown, result)
function renderEmployeeTable(employeeResult)
function renderRegionalPanel(regionalResult)
function renderTransitionTable(transitionResult)
function renderWarnings(result)
function renderModeVisibility(mode)
function syncUrlParams(state)
function restoreFromUrl()
function bindEvents()
function recalc()
```

### 상태 객체

```js
let state = {
  mode: "employee",
  employee: {
    incomeMode: "monthlyWage",
    monthlyWage: 3000000,
    annualSalary: 36000000,
    otherAnnualIncome: 0,
    showEmployerShare: true,
  },
  regional: {
    inputMode: "simple",
    annualIncome: 30000000,
    propertyTaxBase: 0,
    rentDeposit: 0,
    carValue: 0,
    directPoints: 0,
  },
  transition: {
    beforeMonthlyWage: 4000000,
    afterAnnualIncome: 12000000,
    afterPropertyTaxBase: 200000000,
    afterRentDeposit: 0,
    directRegionalPoints: 0,
    useContinuationScenario: true,
  },
};
```

### 이벤트

- 가입자 유형 탭 클릭 시 입력 패널과 결과 보조 섹션 전환
- 프리셋 클릭 시 해당 모드로 이동하고 입력값 일괄 반영
- 숫자 입력 `input` 이벤트마다 즉시 계산
- 연봉/월 보수월액 탭 전환 시 보수월액 기준 문구 갱신
- 지역가입자 계산 방식 전환 시 직접 점수 입력 패널 표시
- 회사 부담분 토글 변경 시 분담표 표시 범위 갱신
- 임의계속가입 토글 변경 시 퇴직 전환 비교표 세 번째 행 표시/숨김
- URL 파라미터 저장 및 복원

### URL 파라미터

| 파라미터 | 의미 |
| --- | --- |
| `mode` | `employee`, `regional`, `transition` |
| `wage` | 월 보수월액 |
| `salary` | 연봉 |
| `other` | 보수 외 소득 |
| `ri` | 지역 연소득 |
| `rp` | 지역 재산 과세표준 |
| `rent` | 전월세 보증금 |
| `points` | 지역 부과점수 |
| `twage` | 퇴직 전 월 보수월액 |
| `tai` | 퇴직 후 연소득 |
| `tap` | 퇴직 후 재산 과세표준 |

예시:

```text
/tools/health-insurance-premium-calculator/?mode=employee&wage=3000000
```

---

## 13. SCSS 설계

파일: `src/styles/scss/pages/_health-insurance-premium-calculator.scss`

주요 클래스:

```scss
.hip-page {}
.hip-mode-tabs {}
.hip-mode-tab {}
.hip-preset-grid {}
.hip-input-panel {}
.hip-input-panel.is-active {}
.hip-form-grid {}
.hip-field {}
.hip-toggle-row {}
.hip-kpi-grid {}
.hip-kpi-card {}
.hip-kpi-card--main {}
.hip-badge {}
.hip-badge--official {}
.hip-badge--estimate {}
.hip-badge--simulation {}
.hip-breakdown-table {}
.hip-transition-table {}
.hip-warning-list {}
.hip-notice-card {}
.hip-official-link {}
.hip-source-list {}
```

디자인 기준:

- 건강보험료는 공제·고정비 성격이므로 차분한 녹색/청록 계열을 주 보조색으로 사용한다.
- 단색 계열로 과도하게 몰리지 않도록 경고는 amber, 추정 배지는 blue-gray, 공식 배지는 green으로 분리한다.
- KPI는 모바일 1열, 640px 이상 2열, 1024px 이상 5열 또는 3+2 배치.
- 분담표와 퇴직 전환표는 모바일에서 가로 스크롤 래퍼를 적용한다.
- 버튼과 탭은 8px 이하 radius를 유지한다.
- 금액이 긴 경우 줄바꿈을 허용하고, 카드 높이가 입력값에 따라 흔들리지 않도록 min-height를 지정한다.

SCSS 초안:

```scss
.hip-page {
  .hip-mode-tabs,
  .hip-preset-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .hip-mode-tab,
  .hip-preset-grid button {
    border: 1px solid #d8e4df;
    border-radius: 8px;
    background: #fff;
    color: #243b35;
    padding: 8px 12px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
  }

  .hip-mode-tab.is-active {
    background: #0f6e56;
    border-color: #0f6e56;
    color: #fff;
  }

  .hip-input-panel {
    display: none;

    &.is-active {
      display: block;
    }
  }

  .hip-kpi-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }

  .hip-kpi-card {
    border: 1px solid #dfe8e4;
    border-radius: 8px;
    padding: 16px;
    min-height: 118px;
    background: #fff;

    &--main {
      border-color: #0f6e56;
      background: #f4fbf8;
    }
  }

  .hip-kpi-label {
    margin: 0 0 8px;
    color: #5d706a;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .hip-kpi-value {
    margin: 0;
    color: #14231f;
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .hip-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: 0.72rem;
    font-weight: 800;

    &--official {
      background: #e7f7ef;
      color: #0f6e56;
    }

    &--estimate {
      background: #edf3f8;
      color: #38556a;
    }

    &--simulation {
      background: #fff4df;
      color: #9a5b00;
    }
  }

  .hip-table-wrap {
    overflow-x: auto;
    margin-top: 18px;
  }

  .hip-breakdown-table,
  .hip-transition-table {
    width: 100%;
    min-width: 620px;
    border-collapse: collapse;

    th,
    td {
      border-bottom: 1px solid #e8eeeb;
      padding: 10px 12px;
      font-size: 0.88rem;
      text-align: right;
    }

    th:first-child,
    td:first-child {
      text-align: left;
    }

    th {
      background: #f7faf8;
      color: #324842;
      font-weight: 800;
    }
  }

  .hip-warning-list {
    display: grid;
    gap: 8px;
    margin-top: 16px;
  }

  .hip-warning {
    border-left: 4px solid #d98500;
    border-radius: 0 8px 8px 0;
    background: #fff8ec;
    color: #5f3d08;
    padding: 12px 14px;
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .hip-notice-card {
    border: 1px solid #dfe8e4;
    border-radius: 8px;
    background: #f8fbfa;
    padding: 14px 16px;
    margin-top: 16px;
    color: #41554f;
    font-size: 0.9rem;
    line-height: 1.7;
  }
}
```

---

## 14. 콘텐츠 및 SEO

### Hero

```text
건강보험료 계산기 2026
월급·연봉·프리랜서 소득을 입력하면 2026년 건강보험료와 장기요양보험료를 계산합니다.
```

### SEO 메타

```ts
export const HEALTH_INSURANCE_SEO = {
  title: "건강보험료 계산기 2026 | 직장가입자·지역가입자 월 보험료 계산",
  description:
    "2026년 건강보험료율 7.19%와 장기요양보험료율 13.14%를 반영해 직장가입자 건강보험료, 회사 부담분, 지역가입자 간이 보험료를 계산합니다.",
  canonical: "/tools/health-insurance-premium-calculator/",
};
```

### SeoContent intro

intro는 4단락 이상, 총 600자 이상으로 작성한다.

1. 건강보험료가 연봉 실수령액, 퇴직 후 생활비, 프리랜서 전환 비용에 영향을 주는 맥락
2. 직장가입자는 보수월액에 보험료율을 곱하고 근로자·회사가 나누어 부담한다는 계산 원리
3. 지역가입자는 소득·재산·자동차·세대 조건까지 반영되므로 결과를 "고정비 감 잡기"로 읽어야 한다는 해석 가이드
4. 연봉 환산, 지역가입자 간이 계산, 실제 고지액 차이에 대한 한계와 국민건강보험공단 확인 권고

### FAQ

```ts
export const HEALTH_INSURANCE_FAQ = [
  {
    q: "2026년 건강보험료율은 얼마인가요?",
    a: "2026년 건강보험료율은 보건복지부 발표 기준 7.19%입니다. 직장가입자는 근로자와 사용자가 절반씩 부담하므로 근로자 본인 부담은 보수월액의 3.595%입니다.",
  },
  {
    q: "장기요양보험료는 따로 계산해야 하나요?",
    a: "네. 장기요양보험료는 건강보험료에 2026년 장기요양보험료율 13.14%를 곱해 계산합니다. 실제 월 납부액을 볼 때는 건강보험료와 장기요양보험료를 합쳐서 확인해야 합니다.",
  },
  {
    q: "연봉을 입력하면 정확한 건강보험료가 나오나요?",
    a: "연봉 입력 결과는 보수월액을 연봉의 12분의 1로 단순 환산한 추정값입니다. 실제 건강보험료는 비과세 수당, 상여, 보수월액 신고, 정산 방식에 따라 달라질 수 있습니다.",
  },
  {
    q: "지역가입자 건강보험료는 왜 추정으로 표시하나요?",
    a: "지역가입자는 소득뿐 아니라 재산, 전월세, 자동차, 세대 구성, 감면 여부가 함께 반영됩니다. 같은 연소득이라도 재산과 세대 조건에 따라 보험료가 달라질 수 있어 계산기 결과는 간이 추정으로 안내해야 합니다.",
  },
  {
    q: "퇴직하면 건강보험료가 바로 지역가입자로 바뀌나요?",
    a: "퇴직 후에는 피부양자 등재, 임의계속가입, 지역가입자 전환 가능성을 확인해야 합니다. 어떤 방식이 유리한지는 퇴직 전 직장가입자 보험료와 퇴직 후 소득·재산 조건에 따라 달라집니다.",
  },
  {
    q: "월급 외 금융소득이나 임대소득이 있으면 건강보험료가 늘어나나요?",
    a: "직장가입자도 보수 외 소득이 일정 기준을 넘으면 소득월액보험료가 추가될 수 있습니다. 계산기에서는 연 2,000만 원 초과 입력 시 별도 확인 경고를 표시하고, 정확한 금액은 공단 조회를 안내합니다.",
  },
  {
    q: "건강보험료는 국민연금과 같이 계산되나요?",
    a: "아니요. 건강보험료와 국민연금은 별도 제도이며 요율과 상한 기준도 다릅니다. 월급 실수령액을 볼 때는 국민연금, 건강보험, 장기요양, 고용보험을 함께 차감하므로 연봉 계산기와 같이 보는 것이 좋습니다.",
  },
];
```

### 관련 링크

```ts
related: [
  { href: "/tools/salary/", label: "연봉 인상 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상 수령액 계산기" },
  { href: "/tools/early-retirement-age/", label: "조기 은퇴 가능 나이 계산기" },
  { href: "/reports/worker-retirement-reality-2026/", label: "직장인 은퇴 준비 실태 분석" },
]
```

---

## 15. 공식 확인 CTA

결과 하단에 공식 확인 링크를 둔다.

```text
정확한 고지액은 국민건강보험공단 보험료 조회에서 확인하세요.
이 계산기는 월 부담을 미리 가늠하기 위한 참고 도구입니다.
```

마크업:

```astro
<section class="hip-notice-card">
  <strong>공식 조회 안내</strong>
  <p>지역가입자 보험료와 퇴직 후 자격 전환은 실제 세대 조건에 따라 달라집니다. 정확한 금액은 국민건강보험공단에서 확인하세요.</p>
  <a class="button button--secondary" href="https://www.nhis.or.kr/" target="_blank" rel="noopener noreferrer">국민건강보험공단에서 확인하기</a>
</section>
```

---

## 16. 등록 작업

### `src/data/tools.ts`

```ts
{
  slug: "health-insurance-premium-calculator",
  title: "건강보험료 계산기 2026",
  description: "2026년 건강보험료율과 장기요양보험료율을 기준으로 직장가입자·지역가입자 월 보험료를 계산합니다.",
  order: 00,
  eyebrow: "4대보험",
  category: "calculator",
  iframeReady: false,
  badges: ["건강보험", "직장가입자", "지역가입자", "2026"],
  previewStats: [
    { label: "건강보험료율", value: "7.19%", context: "2026년 공식" },
    { label: "장기요양", value: "13.14%", context: "건강보험료 대비" },
  ],
}
```

`order`는 구현 시 기존 연봉·세금 계산기 위치를 보고 확정한다.

### `src/pages/tools/index.astro`

권장 카테고리:

```ts
"health-insurance-premium-calculator": "연봉·이직",
```

설명 문구:

```ts
"health-insurance-premium-calculator": "월급·연봉 기준 건강보험료와 장기요양보험료를 계산합니다.",
```

### `src/styles/app.scss`

```scss
@use 'scss/pages/health-insurance-premium-calculator';
```

### `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/tools/health-insurance-premium-calculator/</loc>
  <changefreq>yearly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 17. QA 체크리스트

### 계산

- [ ] 월 보수월액 3,000,000원 기준 본인 건강보험료가 3.595%로 계산되는가?
- [ ] 장기요양보험료가 건강보험료 × 13.14%로 계산되는가?
- [ ] 회사 부담분이 근로자 부담분과 같은 구조로 분리 표시되는가?
- [ ] 연봉 입력 모드에서 연봉 ÷ 12 보수월액 추정이 적용되는가?
- [ ] 2025년 대비 증가액이 2025년 3.545%, 2026년 3.595% 차이로 계산되는가?
- [ ] 보수 외 소득 2,000만 원 초과 시 경고가 표시되는가?
- [ ] 지역가입자 결과에 `간이 추정` 배지가 표시되는가?
- [ ] 퇴직 전환 비교에서 직장가입자·지역가입자·임의계속가입 행이 각각 표시되는가?
- [ ] 0원 입력 시 NaN 또는 Infinity가 노출되지 않는가?

### UI

- [ ] 가입자 유형 탭 전환 시 입력 패널과 결과 보조 섹션이 정상 전환되는가?
- [ ] 프리셋 버튼 클릭 시 모드와 입력값이 함께 바뀌는가?
- [ ] 지역가입자 계산 방식 전환 시 직접 점수 입력 패널이 표시되는가?
- [ ] 모바일 360px에서 KPI 카드 금액이 넘치지 않는가?
- [ ] 분담표와 전환 비교표가 모바일에서 가로 스크롤로 안전하게 표시되는가?
- [ ] 공식/추정/시뮬레이션 배지가 색상뿐 아니라 텍스트로 구분되는가?
- [ ] 공식 확인 CTA가 새 탭으로 열리고 `rel="noopener noreferrer"`가 적용되는가?

### SEO/콘텐츠

- [ ] title이 핵심 키워드와 2026년 기준을 포함하는가?
- [ ] meta description이 120~160자 범위에 가깝고 계산 의도를 설명하는가?
- [ ] SeoContent intro가 4단락 이상이고 총 600자 이상인가?
- [ ] FAQ가 6개 이상이고 실제 검색 질문을 반영하는가?
- [ ] 관련 링크가 연봉, 퇴직금, 국민연금, 은퇴 콘텐츠로 연결되는가?
- [ ] InfoNotice에 지역가입자 추정 한계와 공식 조회 안내가 포함되는가?

### 등록/빌드

- [ ] `src/data/tools.ts` 등록
- [ ] `src/pages/tools/index.astro` 매핑 필요 시 추가
- [ ] `src/styles/app.scss` import 추가
- [ ] `public/sitemap.xml` 등록
- [ ] OG 이미지 생성 또는 기본 OG 확인
- [ ] `npm run build` 성공

---

## 18. 구현 단계 제안

1. 데이터 파일과 FAQ/SEO 텍스트 생성
2. Astro 페이지 마크업 구현
3. 직장가입자 계산 JS 먼저 구현
4. 지역가입자 간이 추정과 퇴직 전환 비교 구현
5. SCSS 모바일 우선 정리
6. tools/index, tools.ts, sitemap, app.scss 등록
7. 빌드 검증
8. Playwright 또는 브라우저로 모바일/데스크톱 시각 확인

---

## 19. 최종 구현 메모

이 페이지의 핵심은 "건강보험료를 정확히 고지서처럼 재현"하는 것이 아니라, 사용자가 연봉·퇴직·프리랜서 전환 시 월 고정비가 어떻게 바뀌는지 빠르게 판단하게 하는 것이다.

따라서 1차 구현은 직장가입자 공식 요율 계산을 견고하게 만들고, 지역가입자는 추정 한계를 정직하게 표시하는 방향이 맞다. 지역가입자 공식 점수표 전체 반영은 2차 확장으로 두는 편이 품질과 출시 속도 모두에 유리하다.
