# 청년 적금 만기 수령액 계산기 설계 문서

> 기획 원문: `docs/plan/202605/youth-savings-maturity-calculator.md`  
> 작성일: 2026-05-31  
> 콘텐츠 유형: `/tools/` 계산기  
> 구현 기준: 청년미래적금, 청년도약계좌, 일반 적금의 원금·이자·정부기여금·세후 만기 수령액을 비교하고, 정책 조건은 공식값·공시값·추정값으로 구분한다.

---

## 1. 문서 개요

- 구현 대상: `청년 적금 만기 수령액 계산기`
- slug: `youth-savings-maturity-calculator`
- URL: `/tools/youth-savings-maturity-calculator/`
- 카테고리: 복지·지원금 / 재테크
- 핵심 검색 의도: `청년 적금 만기 수령액 계산기`, `청년미래적금 계산기`, `청년도약계좌 계산기`, `청년미래적금 만기 수령액`, `청년도약계좌 만기 수령액`
- 핵심 출력: 상품별 예상 만기 수령액, 본인 납입 원금, 예상 이자, 정부기여금, 비과세 효과, 일반 적금 대비 차액
- 안전 장치: 정책 적금 가입 자격, 우대금리, 정부기여금, 중도해지 조건은 실제 신청 시점의 공식 공고와 은행 상품설명서가 우선하므로 결과에는 `추정` 배지를 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    youthSavingsMaturityCalculator.ts
  pages/
    tools/
      youth-savings-maturity-calculator.astro

public/
  scripts/
    youth-savings-maturity-calculator.js

src/styles/scss/pages/
  _youth-savings-maturity-calculator.scss
```

추가 등록 필수:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/youth-savings-maturity-calculator';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 복지·지원금 또는 투자·재테크 토픽 노출
- `src/pages/tools/index.astro` 재테크 계산기 목록 노출
- 청년미래적금 리포트 결과 CTA 추가
  - `src/pages/reports/youth-future-savings-2026.astro`
- `public/og/tools/youth-savings-maturity-calculator.png` 또는 OG 이미지 생성 대상 추가

---

## 3. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `ysm-`
- pageClass: `ysm-page`
- resultFirst: `false`
- 첫 화면에서는 월 납입액과 비교 상품만 빠르게 입력하게 하고, 금리·비과세·소득구간은 접힘 영역에 둔다.
- 결과에서는 “추천 상품”처럼 단정하기보다 **예상 만기 수령액이 가장 큰 상품**과 **조건 확인 필요 이유**를 함께 보여준다.

권장 설정:

```astro
<SimpleToolShell
  calculatorId="youth-savings-maturity-calculator"
  pageClass="ysm-page"
  resultFirst={false}
>
```

---

## 4. 페이지 IA

1. Hero
2. 정책금융 계산 고지 `InfoNotice`
3. 월 납입액 프리셋
4. 기본 입력 폼
5. 상품별 고급 설정 접힘 영역
6. 핵심 결과 KPI
7. 상품별 비교표
8. 일반 적금 대비 차이 분해
9. 청년도약계좌 유지·전환 판단 카드
10. 관련 리포트·계산기 CTA
11. 계산 기준 해설 본문
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/youthSavingsMaturityCalculator.ts`

```ts
export type YouthSavingsProductId = "future" | "leap" | "regular";
export type YouthFutureType = "general" | "preferred";
export type DataBadge = "공식" | "공시" | "추정" | "확인 필요";

export interface YouthSavingsInput {
  monthlyContribution: number;
  selectedProducts: YouthSavingsProductId[];
  youthFutureType: YouthFutureType;
  leapIncomeTierId: string;
  regularAnnualRate: number;
  regularMonths: number;
  includeTax: boolean;
  futureBaseRate: number;
  futureBonusRate: number;
  leapAnnualRate: number;
  policyTaxFree: boolean;
  applyContributionCap: boolean;
}

export interface YouthSavingsProductConfig {
  id: YouthSavingsProductId;
  name: string;
  shortName: string;
  months: number;
  monthlyLimit: number | null;
  defaultAnnualRate: number;
  isPolicyProduct: boolean;
  taxFreeDefault: boolean;
  badge: DataBadge;
  caution: string;
}

export interface YouthLeapIncomeTier {
  id: string;
  label: string;
  grossSalaryMax: number;
  contributionBaseAmount: number;
  contributionRate: number;
  monthlyContributionMax: number;
  note: string;
}

export interface YouthSavingsPreset {
  id: string;
  label: string;
  amount: number;
  description: string;
}

export interface YouthSavingsProductResult {
  productId: YouthSavingsProductId;
  productName: string;
  months: number;
  inputMonthlyContribution: number;
  appliedMonthlyContribution: number;
  cappedAmount: number;
  principal: number;
  annualRate: number;
  grossInterest: number;
  taxAmount: number;
  netInterest: number;
  governmentContribution: number;
  taxSaving: number;
  maturityAmount: number;
  gainAmount: number;
  effectiveGainRate: number;
  badges: DataBadge[];
  warnings: string[];
}

export interface YouthSavingsComparisonResult {
  input: YouthSavingsInput;
  results: YouthSavingsProductResult[];
  bestProductId: YouthSavingsProductId | null;
  bestProductName: string;
  bestMaturityAmount: number;
  regularBaselineAmount: number;
  additionalVsRegular: number;
  totalGovernmentContribution: number;
  totalTaxSaving: number;
  interpretation: string;
  warnings: string[];
}

export interface DecisionCard {
  title: string;
  fit: string;
  checks: string[];
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
```

---

## 6. 기준 데이터

### 6-1. 기본 입력값

```ts
export const DEFAULT_YOUTH_SAVINGS_INPUT: YouthSavingsInput = {
  monthlyContribution: 500_000,
  selectedProducts: ["future", "leap", "regular"],
  youthFutureType: "general",
  leapIncomeTierId: "salary-3600",
  regularAnnualRate: 3.5,
  regularMonths: 36,
  includeTax: true,
  futureBaseRate: 5.0,
  futureBonusRate: 2.0,
  leapAnnualRate: 6.0,
  policyTaxFree: true,
  applyContributionCap: true,
};
```

### 6-2. 상품 설정

```ts
export const PRODUCT_CONFIGS: YouthSavingsProductConfig[] = [
  {
    id: "future",
    name: "청년미래적금",
    shortName: "미래적금",
    months: 36,
    monthlyLimit: 500_000,
    defaultAnnualRate: 7.0,
    isPolicyProduct: true,
    taxFreeDefault: true,
    badge: "공식",
    caution: "가입 자격, 우대금리, 일반형·우대형 여부는 신청 시점 기준으로 확인해야 합니다.",
  },
  {
    id: "leap",
    name: "청년도약계좌",
    shortName: "도약계좌",
    months: 60,
    monthlyLimit: 700_000,
    defaultAnnualRate: 6.0,
    isPolicyProduct: true,
    taxFreeDefault: true,
    badge: "공식",
    caution: "기존 가입자 유지·전환 판단은 가입 기간과 공식 전환 절차를 함께 확인해야 합니다.",
  },
  {
    id: "regular",
    name: "일반 적금",
    shortName: "일반적금",
    months: 36,
    monthlyLimit: null,
    defaultAnnualRate: 3.5,
    isPolicyProduct: false,
    taxFreeDefault: false,
    badge: "추정",
    caution: "은행별 금리와 세금, 우대조건에 따라 실제 수령액이 달라질 수 있습니다.",
  },
];
```

### 6-3. 청년도약계좌 소득구간

```ts
export const LEAP_INCOME_TIERS: YouthLeapIncomeTier[] = [
  {
    id: "salary-2400",
    label: "총급여 2,400만 원 이하",
    grossSalaryMax: 24_000_000,
    contributionBaseAmount: 400_000,
    contributionRate: 0.06,
    monthlyContributionMax: 24_000,
    note: "월 납입액과 40만 원 중 작은 금액 기준",
  },
  {
    id: "salary-3600",
    label: "총급여 3,600만 원 이하",
    grossSalaryMax: 36_000_000,
    contributionBaseAmount: 500_000,
    contributionRate: 0.046,
    monthlyContributionMax: 23_000,
    note: "월 납입액과 50만 원 중 작은 금액 기준",
  },
  {
    id: "salary-4800",
    label: "총급여 4,800만 원 이하",
    grossSalaryMax: 48_000_000,
    contributionBaseAmount: 600_000,
    contributionRate: 0.037,
    monthlyContributionMax: 22_000,
    note: "월 납입액과 60만 원 중 작은 금액 기준",
  },
  {
    id: "salary-6000",
    label: "총급여 6,000만 원 이하",
    grossSalaryMax: 60_000_000,
    contributionBaseAmount: 700_000,
    contributionRate: 0.03,
    monthlyContributionMax: 21_000,
    note: "월 납입액과 70만 원 중 작은 금액 기준",
  },
  {
    id: "salary-7500",
    label: "총급여 7,500만 원 이하",
    grossSalaryMax: 75_000_000,
    contributionBaseAmount: 0,
    contributionRate: 0,
    monthlyContributionMax: 0,
    note: "정부기여금 없이 비과세 혜택 중심",
  },
];
```

### 6-4. 프리셋

```ts
export const YOUTH_SAVINGS_PRESETS: YouthSavingsPreset[] = [
  { id: "amount-100k", label: "월 10만 원", amount: 100_000, description: "소액 시작" },
  { id: "amount-300k", label: "월 30만 원", amount: 300_000, description: "현실적 저축" },
  { id: "amount-500k", label: "월 50만 원", amount: 500_000, description: "청년미래적금 최대" },
  { id: "amount-700k", label: "월 70만 원", amount: 700_000, description: "청년도약계좌 최대" },
];
```

### 6-5. 판단 카드

```ts
export const DECISION_CARDS: DecisionCard[] = [
  {
    title: "청년미래적금 우대형 가능성이 높다면",
    fit: "3년 만기 중심으로 전환 검토",
    checks: ["중소기업 재직 또는 신규 취업 조건", "소득·가구소득 기준", "월 50만 원 납입 유지"],
  },
  {
    title: "청년도약계좌를 오래 납입했다면",
    fit: "유지와 전환을 함께 비교",
    checks: ["현재 납입 기간", "기존 혜택 유지 여부", "전환 신청 가능 기간"],
  },
  {
    title: "월 납입액이 부담된다면",
    fit: "최대 납입보다 지속 가능성 우선",
    checks: ["비상금", "월 고정지출", "중도해지 가능성"],
  },
];
```

### 6-6. 관련 링크

```ts
export const RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/youth-future-savings-2026/",
    label: "청년미래적금 조건·만기 수령액 정리",
    description: "청년미래적금 가입 대상과 일반형·우대형 차이를 확인합니다.",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "청년 지원금과 다른 복지 제도를 함께 비교합니다.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "가구소득 기준으로 지원 가능성을 점검합니다.",
  },
  {
    href: "/tools/savings-vs-etf-retirement/",
    label: "월 적금 vs ETF 노후 계산기",
    description: "적금 안정성과 장기 투자 수익률을 비교합니다.",
  },
];
```

### 6-7. FAQ

```ts
export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "계산 결과가 실제 만기 수령액과 같나요?",
    a: "아닙니다. 금리, 우대조건, 납입일, 중도해지 여부, 정부기여금 지급 방식에 따라 달라지는 추정값입니다.",
  },
  {
    q: "청년미래적금 우대형은 누구나 선택해도 되나요?",
    a: "아닙니다. 중소기업 재직, 신규 취업, 소상공인 매출, 소득 기준 등 세부 조건을 충족해야 합니다.",
  },
  {
    q: "청년도약계좌는 2026년에도 계산해야 하나요?",
    a: "기존 가입자나 전환을 고민하는 사용자는 유지했을 때의 예상 만기 수령액을 비교할 필요가 있습니다.",
  },
  {
    q: "일반 적금 금리는 세전으로 입력하나요?",
    a: "기본 입력은 세전 연 금리입니다. 세금 반영을 켜면 이자소득세 15.4%를 단순 차감합니다.",
  },
  {
    q: "월 납입액이 한도를 넘으면 어떻게 계산하나요?",
    a: "정책 적금은 상품별 월 납입 한도까지만 반영하고, 초과분은 계산에서 제외했다는 안내를 표시합니다.",
  },
];
```

---

## 7. 계산 로직

스크립트 파일: `public/scripts/youth-savings-maturity-calculator.js`

### 7-1. 상수

```js
const TAX_RATE = 0.154;
const FUTURE_MONTHS = 36;
const FUTURE_LIMIT = 500000;
const LEAP_MONTHS = 60;
const LEAP_LIMIT = 700000;
const FUTURE_CONTRIBUTION_RATES = {
  general: 0.06,
  preferred: 0.12,
};
```

### 7-2. 공통 유틸

```js
const clampNumber = (value, min, max) => Math.min(Math.max(Number(value) || 0, min), max);
const roundWon = (value) => Math.round(value);

const calculateInstallmentInterest = ({ monthlyContribution, months, annualRate }) => {
  const monthlyRate = annualRate / 100 / 12;
  return roundWon(monthlyContribution * ((months * (months + 1)) / 2) * monthlyRate);
};

const calculateTax = ({ grossInterest, taxFree, includeTax }) => {
  if (taxFree || !includeTax) return 0;
  return roundWon(grossInterest * TAX_RATE);
};

const formatWon = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;
const formatManwon = (value) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
```

### 7-3. 청년미래적금 계산

```js
const calculateFutureSavings = (input) => {
  const appliedMonthly = Math.min(input.monthlyContribution, FUTURE_LIMIT);
  const cappedAmount = Math.max(input.monthlyContribution - FUTURE_LIMIT, 0);
  const principal = appliedMonthly * FUTURE_MONTHS;
  const contributionRate = FUTURE_CONTRIBUTION_RATES[input.youthFutureType] ?? FUTURE_CONTRIBUTION_RATES.general;
  const governmentContribution = roundWon(principal * contributionRate);
  const annualRate = input.futureBaseRate + input.futureBonusRate;
  const grossInterest = calculateInstallmentInterest({
    monthlyContribution: appliedMonthly,
    months: FUTURE_MONTHS,
    annualRate,
  });
  const taxAmount = calculateTax({
    grossInterest,
    taxFree: input.policyTaxFree,
    includeTax: input.includeTax,
  });
  const netInterest = grossInterest - taxAmount;
  const maturityAmount = principal + governmentContribution + netInterest;

  return {
    productId: "future",
    productName: input.youthFutureType === "preferred" ? "청년미래적금 우대형" : "청년미래적금 일반형",
    months: FUTURE_MONTHS,
    inputMonthlyContribution: input.monthlyContribution,
    appliedMonthlyContribution: appliedMonthly,
    cappedAmount,
    principal,
    annualRate,
    grossInterest,
    taxAmount,
    netInterest,
    governmentContribution,
    taxSaving: input.policyTaxFree ? roundWon(grossInterest * TAX_RATE) : 0,
    maturityAmount,
    gainAmount: maturityAmount - principal,
    effectiveGainRate: principal > 0 ? ((maturityAmount - principal) / principal) * 100 : 0,
    badges: ["공식", "공시", "추정"],
    warnings: [
      "청년미래적금 가입 자격과 우대형 여부는 실제 신청 시점에 확인해야 합니다.",
      cappedAmount > 0 ? "청년미래적금은 월 50만 원 한도까지만 반영했습니다." : "",
    ].filter(Boolean),
  };
};
```

### 7-4. 청년도약계좌 계산

```js
const calculateLeapSavings = (input, tier) => {
  const appliedMonthly = Math.min(input.monthlyContribution, LEAP_LIMIT);
  const cappedAmount = Math.max(input.monthlyContribution - LEAP_LIMIT, 0);
  const principal = appliedMonthly * LEAP_MONTHS;
  const monthlyContribution = Math.min(
    Math.min(appliedMonthly, tier.contributionBaseAmount),
    tier.contributionBaseAmount
  ) * tier.contributionRate;
  const monthlyGovernmentContribution = Math.min(monthlyContribution, tier.monthlyContributionMax);
  const governmentContribution = roundWon(monthlyGovernmentContribution * LEAP_MONTHS);
  const grossInterest = calculateInstallmentInterest({
    monthlyContribution: appliedMonthly,
    months: LEAP_MONTHS,
    annualRate: input.leapAnnualRate,
  });
  const taxAmount = calculateTax({
    grossInterest,
    taxFree: input.policyTaxFree,
    includeTax: input.includeTax,
  });
  const netInterest = grossInterest - taxAmount;
  const maturityAmount = principal + governmentContribution + netInterest;

  return {
    productId: "leap",
    productName: "청년도약계좌",
    months: LEAP_MONTHS,
    inputMonthlyContribution: input.monthlyContribution,
    appliedMonthlyContribution: appliedMonthly,
    cappedAmount,
    principal,
    annualRate: input.leapAnnualRate,
    grossInterest,
    taxAmount,
    netInterest,
    governmentContribution,
    taxSaving: input.policyTaxFree ? roundWon(grossInterest * TAX_RATE) : 0,
    maturityAmount,
    gainAmount: maturityAmount - principal,
    effectiveGainRate: principal > 0 ? ((maturityAmount - principal) / principal) * 100 : 0,
    badges: ["공식", "추정"],
    warnings: [
      "청년도약계좌 유지·전환 판단은 기존 납입 기간과 공식 전환 절차를 함께 확인해야 합니다.",
      cappedAmount > 0 ? "청년도약계좌는 월 70만 원 한도까지만 반영했습니다." : "",
    ].filter(Boolean),
  };
};
```

### 7-5. 일반 적금 계산

```js
const calculateRegularSavings = (input) => {
  const principal = input.monthlyContribution * input.regularMonths;
  const grossInterest = calculateInstallmentInterest({
    monthlyContribution: input.monthlyContribution,
    months: input.regularMonths,
    annualRate: input.regularAnnualRate,
  });
  const taxAmount = calculateTax({
    grossInterest,
    taxFree: false,
    includeTax: input.includeTax,
  });
  const netInterest = grossInterest - taxAmount;
  const maturityAmount = principal + netInterest;

  return {
    productId: "regular",
    productName: "일반 적금",
    months: input.regularMonths,
    inputMonthlyContribution: input.monthlyContribution,
    appliedMonthlyContribution: input.monthlyContribution,
    cappedAmount: 0,
    principal,
    annualRate: input.regularAnnualRate,
    grossInterest,
    taxAmount,
    netInterest,
    governmentContribution: 0,
    taxSaving: 0,
    maturityAmount,
    gainAmount: maturityAmount - principal,
    effectiveGainRate: principal > 0 ? ((maturityAmount - principal) / principal) * 100 : 0,
    badges: ["추정"],
    warnings: ["일반 적금 금리와 세금은 은행별 상품 조건에 따라 달라질 수 있습니다."],
  };
};
```

### 7-6. 비교 결과

```js
const calculateComparison = (input, tiers) => {
  const tier = tiers.find((item) => item.id === input.leapIncomeTierId) ?? tiers[1];
  const results = [];

  if (input.selectedProducts.includes("future")) {
    results.push(calculateFutureSavings(input));
  }
  if (input.selectedProducts.includes("leap")) {
    results.push(calculateLeapSavings(input, tier));
  }
  if (input.selectedProducts.includes("regular")) {
    results.push(calculateRegularSavings(input));
  }

  const sorted = [...results].sort((a, b) => b.maturityAmount - a.maturityAmount);
  const best = sorted[0] ?? null;
  const regular = results.find((item) => item.productId === "regular");
  const regularBaselineAmount = regular?.maturityAmount ?? 0;

  return {
    input,
    results,
    bestProductId: best?.productId ?? null,
    bestProductName: best?.productName ?? "비교 상품 없음",
    bestMaturityAmount: best?.maturityAmount ?? 0,
    regularBaselineAmount,
    additionalVsRegular: best && regular ? best.maturityAmount - regular.maturityAmount : 0,
    totalGovernmentContribution: results.reduce((sum, item) => sum + item.governmentContribution, 0),
    totalTaxSaving: results.reduce((sum, item) => sum + item.taxSaving, 0),
    interpretation: best
      ? `${best.productName}의 예상 만기 수령액이 가장 높습니다. 다만 정책 적금은 가입 자격과 우대조건 확인이 필요합니다.`
      : "비교할 상품을 선택해 주세요.",
    warnings: [...new Set(results.flatMap((item) => item.warnings))],
  };
};
```

---

## 8. Astro 페이지 구조

### 8-1. import

```astro
---
import SimpleToolShell from "../../components/SimpleToolShell.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  DEFAULT_YOUTH_SAVINGS_INPUT,
  PRODUCT_CONFIGS,
  LEAP_INCOME_TIERS,
  YOUTH_SAVINGS_PRESETS,
  DECISION_CARDS,
  RELATED_LINKS,
  FAQ_ITEMS,
} from "../../data/youthSavingsMaturityCalculator";
import { withBase } from "../../utils/base";

const pageTitle = "청년 적금 만기 수령액 계산기";
const pageDescription =
  "월 납입액과 금리를 입력해 청년미래적금, 청년도약계좌, 일반 적금의 만기 수령액을 비교합니다. 정부기여금, 비과세, 세후 이자, 우대금리까지 한 번에 계산하세요.";
---
```

### 8-2. Layout

```astro
<SimpleToolShell
  calculatorId="youth-savings-maturity-calculator"
  pageClass="ysm-page"
  title={pageTitle}
  description={pageDescription}
  resultFirst={false}
>
```

### 8-3. 데이터 주입

```astro
<script
  type="application/json"
  id="ysm-config"
  set:html={JSON.stringify({
    defaultInput: DEFAULT_YOUTH_SAVINGS_INPUT,
    products: PRODUCT_CONFIGS,
    leapIncomeTiers: LEAP_INCOME_TIERS,
  })}
/>
```

### 8-4. 외부 스크립트

```astro
<script type="module" src={withBase("/scripts/youth-savings-maturity-calculator.js")}></script>
```

---

## 9. DOM 설계

### 9-1. 입력 폼

```html
<section class="ysm-panel ysm-input-panel" aria-labelledby="ysm-input-title">
  <h2 id="ysm-input-title">계산 조건</h2>

  <div class="ysm-preset-row">
    <button type="button" data-ysm-preset="100000">월 10만 원</button>
    <button type="button" data-ysm-preset="300000">월 30만 원</button>
    <button type="button" data-ysm-preset="500000">월 50만 원</button>
    <button type="button" data-ysm-preset="700000">월 70만 원</button>
  </div>

  <label class="ysm-field">
    <span>월 납입액</span>
    <input id="ysm-monthly" type="number" min="10000" max="1000000" step="10000" value="500000" />
  </label>

  <div class="ysm-check-grid" aria-label="비교 상품 선택">
    <label><input type="checkbox" data-ysm-product="future" checked /> 청년미래적금</label>
    <label><input type="checkbox" data-ysm-product="leap" checked /> 청년도약계좌</label>
    <label><input type="checkbox" data-ysm-product="regular" checked /> 일반 적금</label>
  </div>
</section>
```

### 9-2. 고급 입력

```html
<details class="ysm-advanced">
  <summary>금리·소득구간 직접 조정</summary>
  <div class="ysm-advanced-grid">
    <label>
      청년미래적금 유형
      <select id="ysm-future-type">
        <option value="general">일반형</option>
        <option value="preferred">우대형</option>
      </select>
    </label>

    <label>
      청년도약계좌 소득구간
      <select id="ysm-leap-tier"></select>
    </label>

    <label>
      청년미래적금 기본금리
      <input id="ysm-future-base-rate" type="number" step="0.1" value="5.0" />
    </label>

    <label>
      청년미래적금 우대금리
      <input id="ysm-future-bonus-rate" type="number" step="0.1" value="2.0" />
    </label>

    <label>
      청년도약계좌 금리
      <input id="ysm-leap-rate" type="number" step="0.1" value="6.0" />
    </label>

    <label>
      일반 적금 금리
      <input id="ysm-regular-rate" type="number" step="0.1" value="3.5" />
    </label>

    <label>
      일반 적금 만기
      <select id="ysm-regular-months">
        <option value="12">12개월</option>
        <option value="24">24개월</option>
        <option value="36" selected>36개월</option>
        <option value="60">60개월</option>
      </select>
    </label>
  </div>
</details>
```

### 9-3. 결과 영역

```html
<section class="ysm-results" aria-live="polite">
  <div class="ysm-kpi-grid">
    <article class="ysm-kpi-card ysm-kpi-card--main">
      <span>가장 높은 예상 만기 수령액</span>
      <strong data-ysm-output="bestAmount">-</strong>
      <p data-ysm-output="bestProduct">-</p>
    </article>
    <article class="ysm-kpi-card">
      <span>일반 적금 대비 차액</span>
      <strong data-ysm-output="additionalVsRegular">-</strong>
    </article>
    <article class="ysm-kpi-card">
      <span>정부기여금 합계</span>
      <strong data-ysm-output="governmentContribution">-</strong>
    </article>
    <article class="ysm-kpi-card">
      <span>비과세 효과</span>
      <strong data-ysm-output="taxSaving">-</strong>
    </article>
  </div>

  <p class="ysm-result-note" data-ysm-output="interpretation"></p>
  <div class="ysm-warning-list" data-ysm-output="warnings"></div>
</section>
```

### 9-4. 비교표

```html
<div class="ysm-table-wrap">
  <table class="ysm-comparison-table">
    <thead>
      <tr>
        <th scope="col">상품</th>
        <th scope="col">만기</th>
        <th scope="col">반영 월 납입액</th>
        <th scope="col">원금</th>
        <th scope="col">예상 이자</th>
        <th scope="col">정부기여금</th>
        <th scope="col">예상 만기 수령액</th>
      </tr>
    </thead>
    <tbody data-ysm-output="comparisonRows"></tbody>
  </table>
</div>
```

---

## 10. UI/스타일 설계

### 10-1. 톤

- 정책금융 계산기이므로 신뢰감 있고 차분한 금융 대시보드 느낌을 준다.
- 단일 녹색 톤으로만 밀지 말고, 청록·남색·회색·노란 경고색을 역할별로 사용한다.
- 결과 KPI는 크고 선명하게, 입력 폼은 조밀하지만 답답하지 않게 만든다.

### 10-2. SCSS 변수

```scss
.ysm-page {
  --ysm-ink: #172033;
  --ysm-muted: #667085;
  --ysm-line: #d8e0ea;
  --ysm-soft: #f5f8fb;
  --ysm-green: #0f8a5f;
  --ysm-teal: #087f8c;
  --ysm-blue: #2f5acf;
  --ysm-warn: #9a5b00;
  --ysm-danger: #b42318;
}
```

### 10-3. 클래스 구조

```scss
.ysm-page {}
.ysm-panel {}
.ysm-input-panel {}
.ysm-preset-row {}
.ysm-field {}
.ysm-check-grid {}
.ysm-advanced {}
.ysm-advanced-grid {}
.ysm-results {}
.ysm-kpi-grid {}
.ysm-kpi-card {}
.ysm-table-wrap {}
.ysm-comparison-table {}
.ysm-badge {}
.ysm-warning-list {}
.ysm-delta-grid {}
.ysm-decision-grid {}
.ysm-related-grid {}
```

### 10-4. 배지 색상

| 배지 | 배경 | 글자 |
| --- | --- | --- |
| 공식 | `#e8f7ef` | `#0f6b47` |
| 공시 | `#eaf1ff` | `#2f5acf` |
| 추정 | `#fff4df` | `#9a5b00` |
| 확인 필요 | `#f2f4f7` | `#475467` |

### 10-5. 모바일

- 입력 패널은 1열
- 프리셋 버튼은 2열
- KPI 카드는 1열, 메인 카드만 상단 고정
- 비교표는 `overflow-x: auto` 사용
- 결과 금액은 줄바꿈되지 않게 `white-space: nowrap`
- 고급 입력은 기본 접힘 유지

---

## 11. 접근성

- 입력마다 `<label>` 연결
- 결과 영역에 `aria-live="polite"` 적용
- 프리셋 버튼 선택 상태는 `aria-pressed`로 표시
- 비교 상품 체크박스 그룹에는 `aria-label` 또는 `fieldset/legend` 사용
- 결과 표는 `<th scope="col">` 적용
- 색상 배지만으로 의미 전달 금지, 텍스트 배지 병행

---

## 12. SEO/본문 구성

### 12-1. 본문 해설

`SeoContent` 또는 페이지 하단 섹션으로 아래 내용을 제공한다.

- 청년 적금 만기 수령액 계산 기준
- 청년미래적금 일반형·우대형 차이
- 청년도약계좌 소득구간별 정부기여금
- 일반 적금 세후 이자 계산법
- 정책 적금과 일반 적금 비교 시 주의할 점

### 12-2. 필수 고지

```text
이 계산기는 금융상품 가입 권유가 아니라 정책금융 상품의 예상 만기 수령액을 비교하기 위한 보조 도구입니다. 실제 가입 가능 여부, 금리, 정부기여금, 비과세 적용 여부는 신청 시점의 공식 공고와 은행 상품설명서가 우선합니다.
```

### 12-3. 계산 고지

```text
월 납입액이 매월 동일하게 납입된다고 가정한 단순 추정입니다. 실제 이자는 납입일, 은행별 이자 계산 방식, 우대금리 충족 여부, 중도해지 여부에 따라 달라질 수 있습니다.
```

---

## 13. QA 체크리스트

- [ ] 사용자 facing 텍스트가 모두 한국어인가?
- [ ] 월 납입액 프리셋이 입력값과 결과를 동시에 업데이트하는가?
- [ ] 청년미래적금 월 50만 원 한도가 적용되는가?
- [ ] 청년도약계좌 월 70만 원 한도가 적용되는가?
- [ ] 청년도약계좌 소득구간별 월 최대 기여금이 적용되는가?
- [ ] 일반 적금 세금 반영 시 15.4%가 차감되는가?
- [ ] 정책 적금 비과세 적용 여부가 결과에 반영되는가?
- [ ] 계산 결과에 `추정` 배지와 고지가 표시되는가?
- [ ] 우대형 조건을 확정 혜택처럼 표현하지 않았는가?
- [ ] 청년도약계좌 전환을 단정적으로 추천하지 않았는가?
- [ ] 모바일에서 입력폼, KPI, 비교표가 넘치지 않는가?
- [ ] 내부 링크가 `withBase()`로 처리되었는가?
- [ ] `tools.ts`, `app.scss`, `sitemap.xml` 등록이 완료되었는가?
- [ ] `npm run build`가 성공하는가?

---

## 14. 참고 출처

- 금융위원회, 청년미래적금 취급기관 금리 공시 및 신청기간 안내: https://www.fsc.go.kr/po010103/87005
- 금융위원회, 청년미래적금 세부 조건 카드뉴스: https://www.fsc.go.kr/no040101?cnId=3187
- 금융위원회, 청년미래적금 취급기관·금리 수준 안내 보도자료: https://www.fsc.go.kr/no010101/86884
- 국회예산정책처 2026년도 예산안 분석, 청년도약계좌 정부기여금 표: https://www.nabo.go.kr/board/file/down.do?fid=33318880

