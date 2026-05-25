# 자동차 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/auto-bonus-comparison-2026.md`  
> 작성일: 2026-05-25  
> 구현 대상: `/tools/auto-bonus-comparison/`  
> 구현 기준: 현대차·기아·현대모비스·한국GM·르노코리아 성과급을 사용자 입력값 기준으로 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `자동차 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `auto-bonus-comparison`
- URL: `/tools/auto-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- 현대차, 기아, 현대모비스, 한국GM, 르노코리아의 성과급을 같은 입력 기준으로 비교한다.
- 자동차 업계 특성인 `월급 n개월`, `자사주`, `정액 현금(격려금)` 혼합 구조를 지원한다.
- 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 즉시 계산한다.
- 임단협 요구안·잠정합의안·확정값을 공식 지급액처럼 보이지 않도록 `추정`, `시뮬레이션`, `사용자 입력 기준` 배지를 반복 노출한다.
- 현대차 상세 계산기(`/tools/hyundai-bonus/`)로 내부 링크를 연결한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    autoBonusComparison.ts
  pages/
    tools/
      auto-bonus-comparison.astro

public/
  scripts/
    auto-bonus-comparison.js

src/styles/scss/pages/
  _auto-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/auto-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/hyundai-bonus.astro` 하단 내부 링크
- `src/pages/tools/bonus-simulator.astro` 하단 내부 링크
- `src/pages/tools/bonus-after-tax-calculator.astro` 하단 내부 링크
- `public/og/tools/auto-bonus-comparison.png` 또는 OG 이미지 생성 대상

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "현대차·기아·현대모비스·한국GM·르노코리아 성과급 비교 계산기 2026"
description: "현대차, 기아, 현대모비스, 한국GM, 르노코리아 등 자동차 기업의 성과급을 연봉·월급·성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 번에 시뮬레이션합니다."
canonical: "/tools/auto-bonus-comparison/"
ogImage: "/og/tools/auto-bonus-comparison.png"
```

### 3-2. 페이지 텍스트

H1:

```text
자동차 성과급 비교 계산기 2026
```

Hero sub:

```text
현대차, 기아, 현대모비스, 한국GM, 르노코리아 등 자동차 기업의 성과급을 같은 연봉과 월급 기준으로 비교해보세요. 월급 n개월, 자사주, 정액 격려금을 포함한 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 화면에서 확인할 수 있습니다.
```

주요 배지:

- `추정`
- `시뮬레이션`
- `사용자 입력 기준`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 자동차 성과급 비교 | title, H1, hero, FAQ |
| 현대차 기아 성과급 비교 | title, 회사 카드, FAQ |
| 자동차 성과급 계산기 | description, 계산기 섹션 |
| 현대모비스 성과급 | 회사 카드, FAQ |
| 임단협 격려금 자사주 | 용어 정리, 안전 안내 |
| 한국GM 르노코리아 성과급 | 회사 카드, FAQ |

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `abc-` (auto bonus comparison)
- pageClass: `abc-page`
- 결과는 입력 아래 즉시 노출한다.
- 현대차·기아는 자사주·정액 현금 입력 패널을 추가 제공한다.
- 모바일에서는 회사별 비교 표를 카드형으로 전환한다.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="auto-bonus-comparison"
  pageClass="abc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero
2. 추정·시뮬레이션 안내
3. 기준 연봉·월 기본급 입력
4. 비교 회사 선택
5. 회사별 성과급 조건 입력 (자사주·정액 현금 포함)
6. 결과 KPI
7. 회사별 비교 표
8. 회사별 해설 카드
9. 자동차 성과급 용어 정리
10. 임단협·자사주 주의사항
11. 관련 계산기 CTA
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/autoBonusComparison.ts`

```ts
export type AutoCompanyId =
  | "hyundai"
  | "kia"
  | "hyundaiMobis"
  | "gmKorea"
  | "renaultKorea";

export type AutoCompanyGroup =
  | "domesticCompleted"
  | "groupAffiliate"
  | "foreignAffiliate";

export type BonusInputMode = "monthlyMultiple" | "salaryPercent" | "fixedAmount" | "mixed";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "요구안" | "확인 필요";

export interface AutoCompanyConfig {
  id: AutoCompanyId;
  name: string;
  shortName: string;
  group: AutoCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultPaymentLabel: string;
  defaultMonthlyMultiple: number;
  defaultSalaryPercent: number;
  defaultFixedAmount: number;
  supportsStock: boolean;
  defaultStockShares: number;
  defaultStockPrice: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
  detailHref?: string;
  detailCtaLabel?: string;
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface AutoBonusTermGuide {
  term: string;
  companies: string;
  meaning: string;
  caution: string;
}

export interface RelatedCalculator {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

---

## 6. 기준 데이터

### 6-1. 회사 데이터

```ts
export const AUTO_BONUS_COMPANIES: AutoCompanyConfig[] = [
  {
    id: "hyundai",
    name: "현대자동차",
    shortName: "현대차",
    group: "domesticCompleted",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금·자사주",
    defaultMonthlyMultiple: 4.5,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 15_800_000,
    supportsStock: true,
    defaultStockShares: 30,
    defaultStockPrice: 210_000,
    structureSummary: "2025 임단협 패키지: 월급 450%, 정액 1,580만 원, 자사주 30주, 상품권 20만 원 기준 예시값입니다.",
    caution: "2026 노조 요구안(순이익 30%)은 확정안이 아닙니다. 임단협 결과에 따라 실제 지급액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/hyundai-bonus/",
    detailCtaLabel: "현대차 상세 계산",
  },
  {
    id: "kia",
    name: "기아",
    shortName: "기아",
    group: "domesticCompleted",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금·자사주",
    defaultMonthlyMultiple: 4.0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 12_000_000,
    supportsStock: true,
    defaultStockShares: 20,
    defaultStockPrice: 120_000,
    structureSummary: "현대차그룹 계열이지만 별도 임단협으로 패키지 구성이 다를 수 있습니다. 예시값을 직접 수정해 비교하세요.",
    caution: "기아 임단협 결과와 지급 기준에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "추정"],
  },
  {
    id: "hyundaiMobis",
    name: "현대모비스",
    shortName: "현대모비스",
    group: "groupAffiliate",
    defaultSelected: false,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금",
    defaultMonthlyMultiple: 3.0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 8_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "현대차그룹 부품 계열사이며 완성차 대비 성과급 패키지 구성이 다를 수 있습니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "gmKorea",
    name: "한국GM",
    shortName: "한국GM",
    group: "foreignAffiliate",
    defaultSelected: false,
    defaultMode: "fixedAmount",
    defaultPaymentLabel: "성과급",
    defaultMonthlyMultiple: 0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 5_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "미국 GM 산하 법인으로 노사 협의 구조와 성과급 산식이 국내 대기업과 다를 수 있습니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "renaultKorea",
    name: "르노코리아",
    shortName: "르노코리아",
    group: "foreignAffiliate",
    defaultSelected: false,
    defaultMode: "fixedAmount",
    defaultPaymentLabel: "성과급",
    defaultMonthlyMultiple: 0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 4_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "프랑스 르노 산하 법인으로 보상 구조가 국내 완성차 대기업과 다릅니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];
```

기본값은 실제 지급액이 아니라 입력 편의를 위한 예시값이다. UI에는 `예시값` 또는 `사용자 입력 기준` 문구를 붙인다.

### 6-2. 세후 추정 구간

```ts
export const ABC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

### 6-3. 용어 데이터

```ts
export const ABC_TERMS: AutoBonusTermGuide[] = [
  {
    term: "격려금",
    companies: "현대차, 기아 등",
    meaning: "임단협 결과 지급하는 일시금으로 정액·자사주·상품권이 혼합될 수 있음",
    caution: "정액 부분과 자사주 부분을 현금으로 합산하지 않는 것이 안전합니다.",
  },
  {
    term: "자사주",
    companies: "현대차, 기아 등",
    meaning: "임단협 패키지에 포함된 자기 회사 주식 지급",
    caution: "주가 변동에 따라 가치가 달라지며 처분 조건·취득 세금이 현금 성과급과 다릅니다.",
  },
  {
    term: "임단협",
    companies: "자동차 업계 전반",
    meaning: "임금 및 단체협약 교섭 과정에서 합의되는 보상 패키지",
    caution: "요구안·제시안·잠정합의안·확정안을 반드시 구분해야 합니다.",
  },
  {
    term: "요구안",
    companies: "노조",
    meaning: "교섭 전 또는 교섭 중 노조 측이 요구하는 금액 또는 조건",
    caution: "확정된 지급액이 아니며 계산기에는 시나리오로만 사용해야 합니다.",
  },
];
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/auto-bonus-comparison.js`

### 7-1. DOM 계약

루트:

```html
<section data-abc-calculator>
```

입력:

```html
<input data-abc-annual-salary />
<input data-abc-monthly-salary />
<select data-abc-tax-mode />
<input data-abc-manual-tax-rate />
<input type="checkbox" data-abc-company-toggle="hyundai" />
<select data-abc-mode="hyundai" />
<input data-abc-monthly-multiple="hyundai" />
<input data-abc-salary-percent="hyundai" />
<input data-abc-fixed-amount="hyundai" />
<input data-abc-stock-shares="hyundai" />
<input data-abc-stock-price="hyundai" />
```

출력:

```html
<output data-abc-best-net></output>
<output data-abc-max-gap></output>
<output data-abc-monthly-gap></output>
<output data-abc-best-total></output>
<tbody data-abc-result-table></tbody>
<div data-abc-result-cards></div>
```

### 7-2. 입력 상태

```js
const state = {
  annualSalary: 80_000_000,
  monthlySalary: 6_666_667,
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    hyundai: {
      selected: true,
      mode: "mixed",
      monthlyMultiple: 4.5,
      salaryPercent: 0,
      fixedAmount: 15_800_000,
      stockShares: 30,
      stockPrice: 210_000,
    },
    kia: {
      selected: true,
      mode: "mixed",
      monthlyMultiple: 4.0,
      salaryPercent: 0,
      fixedAmount: 12_000_000,
      stockShares: 20,
      stockPrice: 120_000,
    },
  },
};
```

월 기본급 동작:

- 기준 연봉 변경 시 `monthlySalaryTouched === false`이면 `annualSalary / 12`로 자동 갱신한다.
- 사용자가 월 기본급을 직접 수정하면 `monthlySalaryTouched = true`로 둔다.
- "연봉 기준으로 다시 계산" 버튼을 제공하면 `monthlySalaryTouched = false`로 되돌린다.

### 7-3. 계산 함수

```js
function calculateCashBonus(companyInput, annualSalary, monthlySalary) {
  const monthlyBonus = monthlySalary * companyInput.monthlyMultiple;
  const percentBonus = annualSalary * (companyInput.salaryPercent / 100);
  const fixedBonus = companyInput.fixedAmount;

  if (companyInput.mode === "monthlyMultiple") return monthlyBonus;
  if (companyInput.mode === "salaryPercent") return percentBonus;
  if (companyInput.mode === "fixedAmount") return fixedBonus;

  // mixed: 월급 n개월 + 고정 금액 (정액 격려금)
  return monthlyBonus + fixedBonus;
}

function calculateStockValue(companyInput) {
  return companyInput.stockShares * companyInput.stockPrice;
}

function getEstimatedTaxRate(annualSalary, taxMode, manualTaxRate) {
  if (taxMode === "manual") return manualTaxRate;
  return findBracketRate(annualSalary);
}

function calculateCompanyResult(company, input, annualSalary, monthlySalary, taxRate) {
  const cashBonus = calculateCashBonus(input, annualSalary, monthlySalary);
  const stockValue = company.supportsStock ? calculateStockValue(input) : 0;
  const estimatedDeduction = cashBonus * taxRate;
  const netCashBonus = Math.max(cashBonus - estimatedDeduction, 0);

  return {
    companyId: company.id,
    companyName: company.name,
    cashBonus,
    stockValue,
    estimatedDeduction,
    netCashBonus,
    netRate: cashBonus > 0 ? netCashBonus / cashBonus : 0,
    monthlyNetEquivalent: netCashBonus / 12,
    totalCompensation: annualSalary + cashBonus,
    // 자사주는 참고용으로만 표시하고 현금 비교에서 제외
    stockNote: stockValue > 0 ? `자사주 ${input.stockShares}주 (주가 기준 환산 ${stockValue.toLocaleString()}원)` : null,
  };
}
```

**자사주 처리 주의**: 자사주는 현금 성과급과 단순 합산하지 않는다. 결과 표에서 별도 행 또는 별도 컬럼으로 표시하고 `참고` 배지를 붙인다.

### 7-4. 정렬과 하이라이트

- 기본 정렬: 예상 세후 현금 성과급 내림차순 (자사주 제외)
- 최고 결과 카드에는 `abc-result-card--best` 클래스 부여
- 회사가 1개만 선택된 경우 최대 차이와 월평균 차이는 `0원`으로 표시한다.
- 자사주가 있는 회사는 현금 비교 결과 아래 별도 자사주 환산액 참고 행을 추가한다.

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/auto-bonus-comparison.astro`

권장 import:

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import {
  AUTO_BONUS_COMPANIES,
  ABC_TAX_RATE_BRACKETS,
  ABC_TERMS,
  ABC_RELATED_CALCULATORS,
  ABC_FAQS,
} from '../../data/autoBonusComparison';
---
```

권장 마크업 구조:

```astro
<SimpleToolShell ...>
  <section class="abc-hero">...</section>
  <section class="abc-notice">...</section>
  <section class="abc-calculator" data-abc-calculator>
    <div class="abc-input-grid">...</div>
    <div class="abc-company-inputs">...</div>
    <div class="abc-results">...</div>
  </section>
  <section class="abc-company-guide">...</section>
  <section class="abc-terms">...</section>
  <section class="abc-caution">...</section>
  <section class="abc-related">...</section>
  <section class="abc-faq">...</section>
</SimpleToolShell>
```

스크립트:

```astro
<script src="/scripts/auto-bonus-comparison.js" defer></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_auto-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `abc-` prefix를 사용한다.

주요 클래스:

```text
abc-page
abc-hero
abc-badges
abc-notice
abc-calculator
abc-input-grid
abc-company-picker
abc-company-inputs
abc-company-panel
abc-stock-panel
abc-results
abc-kpi-grid
abc-result-table
abc-result-cards
abc-stock-note
abc-company-guide
abc-term-table
abc-related-grid
abc-faq
```

### 9-2. 반응형 기준

- Desktop: 입력 패널과 결과 패널을 2컬럼으로 배치
- Tablet: 입력과 결과를 1컬럼으로 전환하되 KPI 카드는 2컬럼 유지
- Mobile: 회사별 비교 표를 카드형 또는 가로 스크롤로 제공
- 자사주 입력 패널은 현대차·기아 선택 시에만 표시

권장 CSS 방향:

```scss
.abc-input-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 24px;
}

@media (max-width: 860px) {
  .abc-input-grid {
    grid-template-columns: 1fr;
  }
}

.abc-stock-panel {
  display: none;

  &--visible {
    display: block;
  }
}
```

### 9-3. 색상 방향

- 기존 사이트 토큰을 우선 사용한다.
- 회사 비교 색상은 결과 강조용으로만 제한한다.
- 자사주 참고 영역은 현금 비교 영역과 시각적으로 분리한다 (점선 구분선, 배경색 차이 등).
- `추정`·`시뮬레이션`·`요구안` 배지는 차분한 정보성 색상으로 처리한다.

---

## 10. 접근성·사용성 기준

- 모든 input은 label과 연결한다.
- 금액 입력 필드는 숫자 포맷을 보여주되 실제 계산 값은 숫자로 정규화한다.
- 회사 선택 checkbox는 키보드로 조작 가능해야 한다.
- 결과 갱신 시 포커스를 강제로 이동하지 않는다.
- 결과 표에는 `caption` 또는 상단 설명을 둔다.
- 자사주 입력 영역이 나타날 때 시각적 애니메이션 없이 즉시 표시한다.
- 배지는 색상만으로 의미를 전달하지 않고 텍스트를 포함한다.

---

## 11. 안전 문구

상단 안내:

```text
이 계산기는 사용자가 입력한 연봉, 월 기본급, 성과급 조건을 기준으로 한 비교용 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 임단협 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.
```

결과 표 하단:

```text
예상 세후 금액은 간편 공제율을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.
```

자사주 안내:

```text
자사주는 현재 주가 기준 환산액으로 현금 성과급과 별도로 표시합니다. 처분 조건, 취득 세금, 주가 변동에 따라 실제 가치가 달라질 수 있습니다.
```

임단협 안내:

```text
노조 요구안, 회사 제시안, 잠정합의안, 최종 합의안은 서로 다릅니다. 확정되지 않은 금액은 실제 지급액이 아니라 비교용 입력값으로만 사용하세요.
```

---

## 12. FAQ 데이터

```ts
export const ABC_FAQS: FaqItem[] = [
  {
    question: "현대차와 기아 성과급은 어떻게 비교해야 하나요?",
    answer: "같은 현대차그룹 계열이지만 임단협은 별도로 진행됩니다. 격려금·자사주·정액 현금 패키지 구성이 다를 수 있으므로 같은 기준 연봉으로 세전·세후·월평균을 함께 비교해야 합니다.",
  },
  {
    question: "자사주는 어떻게 계산에 반영하나요?",
    answer: "주가 기준 환산액을 참고용으로 표시합니다. 처분 조건과 취득 세금이 현금 성과급과 다르므로 현금 비교와 분리해서 보여줍니다.",
  },
  {
    question: "한국GM이나 르노코리아 성과급도 계산할 수 있나요?",
    answer: "가능합니다. 외국계 자동차사는 국내 대기업과 노사 구조가 달라 직접 비교가 어려우므로 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "임단협 요구안 금액을 그대로 넣어도 되나요?",
    answer: "계산은 가능하지만 요구안은 확정 지급액이 아닙니다. 요구안·제시안·잠정합의안·최종 합의안을 구분해서 입력해야 합니다.",
  },
  {
    question: "자동차 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer: "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 임단협 합의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
];
```

---

## 13. 내부 링크 설계

### 13-1. 페이지 내부 CTA

| 위치 | CTA |
| --- | --- |
| 현대차 결과 카드 | `/tools/hyundai-bonus/` — 현대차 격려금·자사주 포함 상세 계산 |
| 결과 하단 | `/tools/bonus-simulator/` — 일반 성과급 계산기로 다시 계산하기 |
| 세후 안내 | `/tools/bonus-after-tax-calculator/` — 성과급 세후 실수령액 계산하기 |
| 관련 업종 | `/tools/semiconductor-bonus-comparison/` — 반도체 성과급 비교 |
| 관련 업종 | `/tools/shipbuilding-bonus-comparison/` — 조선업 성과급 비교 |
| 리포트 링크 | `/reports/corporate-bonus-comparison-2026/` — 대기업 성과급 비교 리포트 |

### 13-2. 기존 페이지 역링크 문구

현대자동차 성과급 계산기:

```text
현대차와 기아, 현대모비스, 한국GM 성과급을 같은 기준으로 비교해보세요.
```

일반 성과급 계산기:

```text
자동차 업계 성과급을 회사별로 비교하려면 자동차 성과급 비교 계산기를 이용해보세요.
```

---

## 14. QA 체크리스트

- [ ] 회사 1개 선택 시 결과가 깨지지 않는다.
- [ ] 5개 회사 전체 선택 시 모바일에서 표 또는 카드가 겹치지 않는다.
- [ ] 연봉 변경 시 월 기본급이 자동 계산된다.
- [ ] 월 기본급 직접 수정 후 연봉 변경 시 사용자 수정값이 유지된다.
- [ ] 월급 n개월, 연봉 대비 %, 고정 금액, 혼합 모드가 각각 정상 계산된다.
- [ ] 혼합 모드에서 월급 n개월 + 고정 금액이 합산된다.
- [ ] 현대차·기아 선택 시 자사주 입력 패널이 표시된다.
- [ ] 자사주 환산액이 현금 성과급과 분리되어 표시된다.
- [ ] 간편 추정 세율과 직접 세율 입력이 정상 전환된다.
- [ ] 모든 추정 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다.
- [ ] 임단협 요구안과 확정 지급액을 구분하는 안내가 노출된다.
- [ ] 현대차 상세 계산기 링크가 정상 이동한다.
- [ ] FAQ와 본문에 사용자 facing 영어가 없다.
- [ ] `npm run build`가 성공한다.

---

## 15. 구현 순서

1. `src/data/autoBonusComparison.ts` 데이터와 타입 생성
2. `src/pages/tools/auto-bonus-comparison.astro` 정적 구조 구현
3. `public/scripts/auto-bonus-comparison.js` 계산 로직 구현 (자사주 분리 처리 포함)
4. `src/styles/scss/pages/_auto-bonus-comparison.scss` 스타일 구현
5. `tools.ts`, `app.scss`, `sitemap.xml` 등록
6. 현대차 성과급 계산기 역링크 추가
7. 일반 성과급 계산기 역링크 추가
8. 모바일 UI 확인 (자사주 패널 표시/숨김 포함)
9. `npm run build`
