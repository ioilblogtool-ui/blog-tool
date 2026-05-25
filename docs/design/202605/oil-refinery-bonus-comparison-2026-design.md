# 정유 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/oil-refinery-bonus-comparison-2026.md`  
> 작성일: 2026-05-25  
> 구현 대상: `/tools/oil-refinery-bonus-comparison/`  
> 구현 기준: SK이노베이션·GS칼텍스·S-OIL·HD현대오일뱅크·롯데케미칼 성과급을 사용자 입력값 기준으로 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `정유 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `oil-refinery-bonus-comparison`
- URL: `/tools/oil-refinery-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- SK이노베이션(SK에너지), GS칼텍스, S-OIL(에쓰오일), HD현대오일뱅크, 롯데케미칼 성과급을 같은 입력 기준으로 비교한다.
- `연봉 대비 %`, `월급 n개월`, `고정 금액` 방식을 모두 지원한다.
- 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 즉시 계산한다.
- 공식 지급액처럼 보이지 않도록 모든 결과에 `추정`, `시뮬레이션`, `사용자 입력 기준` 배지를 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    oilRefineryBonusComparison.ts
  pages/
    tools/
      oil-refinery-bonus-comparison.astro

public/
  scripts/
    oil-refinery-bonus-comparison.js

src/styles/scss/pages/
  _oil-refinery-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/oil-refinery-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/bonus-simulator.astro` 하단 내부 링크
- `src/pages/tools/bonus-after-tax-calculator.astro` 하단 내부 링크
- `public/og/tools/oil-refinery-bonus-comparison.png` 또는 OG 이미지 생성 대상

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "SK이노베이션·GS칼텍스·S-OIL·현대오일뱅크 성과급 비교 계산기 2026"
description: "SK이노베이션, GS칼텍스, S-OIL(에쓰오일), HD현대오일뱅크 등 정유·석유화학 기업의 성과급을 연봉·월급·성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 번에 시뮬레이션합니다."
canonical: "/tools/oil-refinery-bonus-comparison/"
ogImage: "/og/tools/oil-refinery-bonus-comparison.png"
```

### 3-2. 페이지 텍스트

H1:

```text
정유 성과급 비교 계산기 2026
```

Hero sub:

```text
SK이노베이션, GS칼텍스, S-OIL(에쓰오일), HD현대오일뱅크 등 정유·석유화학 기업의 성과급을 같은 연봉과 성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 화면에서 확인할 수 있습니다.
```

주요 배지:

- `추정`
- `시뮬레이션`
- `사용자 입력 기준`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 정유 성과급 비교 | title, H1, hero, FAQ |
| SK이노베이션 GS칼텍스 성과급 비교 | title, 회사 카드, FAQ |
| 정유사 성과급 계산기 | description, 계산기 섹션 |
| 에쓰오일 S-OIL 성과급 | 회사 카드, FAQ |
| 현대오일뱅크 성과급 | 회사 카드, FAQ |
| 정유 성과급 세후 | 결과 카드, 세후 안내 |

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `orbc-` (oil refinery bonus comparison)
- pageClass: `orbc-page`
- 결과는 입력 아래 즉시 노출한다.
- SK이노베이션은 PS/PI 명칭 선택을 제공하고, 나머지 회사는 직접 입력 방식을 기본으로 한다.
- 모바일에서는 회사별 비교 표를 카드형으로 전환한다.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="oil-refinery-bonus-comparison"
  pageClass="orbc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero
2. 추정·시뮬레이션 안내
3. 기준 연봉·월 기본급 입력
4. 비교 회사 선택
5. 회사별 성과급 조건 입력
6. 결과 KPI
7. 회사별 비교 표
8. 회사별 해설 카드
9. 정유 성과급 용어 정리
10. 비교 주의사항 (정제마진·유가 민감도 포함)
11. 관련 계산기 CTA
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/oilRefineryBonusComparison.ts`

```ts
export type OilRefineryCompanyId =
  | "skInnovation"
  | "gsCaltex"
  | "soil"
  | "hdHyundaiOilbank"
  | "lotteChemical";

export type OilRefineryCompanyGroup =
  | "domestic"
  | "foreignAffiliate"
  | "petrochemical";

export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface OilRefineryCompanyConfig {
  id: OilRefineryCompanyId;
  name: string;
  shortName: string;
  group: OilRefineryCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultBonusTerm: string;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface OilRefineryTermGuide {
  term: string;
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
export const OIL_REFINERY_BONUS_COMPANIES: OilRefineryCompanyConfig[] = [
  {
    id: "skInnovation",
    name: "SK이노베이션 / SK에너지",
    shortName: "SK이노베이션",
    group: "domestic",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "PS·PI",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "SK그룹 공통 PS·PI 구조를 참고하며, 실제 지급률은 사용자가 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "gsCaltex",
    name: "GS칼텍스",
    shortName: "GS칼텍스",
    group: "domestic",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "GS그룹·쉐브론 합작 법인으로 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "soil",
    name: "S-OIL (에쓰오일)",
    shortName: "S-OIL",
    group: "foreignAffiliate",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "사우디아람코 산하 법인으로 보상 구조가 다를 수 있습니다. 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "hdHyundaiOilbank",
    name: "HD현대오일뱅크",
    shortName: "현대오일뱅크",
    group: "domestic",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "HD현대그룹 계열 정유사로 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "lotteChemical",
    name: "롯데케미칼",
    shortName: "롯데케미칼",
    group: "petrochemical",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "정유 인접 석유화학 대표군으로 포함. 성과급률을 직접 입력해 비교합니다.",
    caution: "석유화학 업종으로 정유사와 실적 구조가 다릅니다. 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];
```

기본 성과급률은 실제 지급률이 아니라 입력 편의를 위한 예시값이다. UI에는 `예시값` 또는 `사용자 입력 기준` 문구를 붙인다.

### 6-2. 세후 추정 구간

```ts
export const ORBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

### 6-3. 용어 데이터

```ts
export const ORBC_TERMS: OilRefineryTermGuide[] = [
  {
    term: "PS (Profit Sharing)",
    meaning: "SK 계열에서 사용하는 초과이익분배 성격의 성과급으로 실적·영업이익과 연동될 수 있음",
    caution: "법인별·연도별 지급 기준이 다를 수 있으므로 반드시 확인해야 합니다.",
  },
  {
    term: "PI (Productivity Incentive)",
    meaning: "생산성·목표 달성에 연동되는 인센티브로 반기 또는 연간 지급",
    caution: "지급 구조와 기준급 산식을 회사별로 확인해야 합니다.",
  },
  {
    term: "특별성과급",
    meaning: "특정 실적·협의 결과에 따른 일시적 성과 보상",
    caution: "일회성일 수 있어 매년 반복된다고 보기 어렵습니다.",
  },
  {
    term: "정제마진",
    meaning: "원유를 정제해 석유제품을 판매할 때 발생하는 마진으로 정유사 실적의 핵심 변수",
    caution: "정제마진 변동에 따라 정유사 성과급이 달라질 수 있으나 회사별 산식이 다릅니다.",
  },
];
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/oil-refinery-bonus-comparison.js`

### 7-1. DOM 계약

루트:

```html
<section data-orbc-calculator>
```

입력:

```html
<input data-orbc-annual-salary />
<input data-orbc-monthly-salary />
<select data-orbc-tax-mode />
<input data-orbc-manual-tax-rate />
<input type="checkbox" data-orbc-company-toggle="skInnovation" />
<select data-orbc-mode="skInnovation" />
<input data-orbc-salary-percent="skInnovation" />
<input data-orbc-monthly-multiple="skInnovation" />
<input data-orbc-fixed-amount="skInnovation" />
```

출력:

```html
<output data-orbc-best-net></output>
<output data-orbc-max-gap></output>
<output data-orbc-monthly-gap></output>
<output data-orbc-best-total></output>
<tbody data-orbc-result-table></tbody>
<div data-orbc-result-cards></div>
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
    skInnovation: {
      selected: true,
      mode: "salaryPercent",
      salaryPercent: 15,
      monthlyMultiple: 0,
      fixedAmount: 0,
    },
    gsCaltex: {
      selected: true,
      mode: "salaryPercent",
      salaryPercent: 12,
      monthlyMultiple: 0,
      fixedAmount: 0,
    },
    soil: {
      selected: true,
      mode: "salaryPercent",
      salaryPercent: 12,
      monthlyMultiple: 0,
      fixedAmount: 0,
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
function calculateGrossBonus(companyInput, annualSalary, monthlySalary) {
  if (companyInput.mode === "salaryPercent") {
    return annualSalary * (companyInput.salaryPercent / 100);
  }

  if (companyInput.mode === "monthlyMultiple") {
    return monthlySalary * companyInput.monthlyMultiple;
  }

  return companyInput.fixedAmount;
}

function getEstimatedTaxRate(annualSalary, taxMode, manualTaxRate) {
  if (taxMode === "manual") return manualTaxRate;
  return findBracketRate(annualSalary);
}

function calculateCompanyResult(company, input, annualSalary, monthlySalary, taxRate) {
  const grossBonus = calculateGrossBonus(input, annualSalary, monthlySalary);
  const estimatedDeduction = grossBonus * taxRate;
  const netBonus = Math.max(grossBonus - estimatedDeduction, 0);

  return {
    companyId: company.id,
    companyName: company.name,
    grossBonus,
    estimatedDeduction,
    netBonus,
    netRate: grossBonus > 0 ? netBonus / grossBonus : 0,
    monthlyNetEquivalent: netBonus / 12,
    totalCompensation: annualSalary + grossBonus,
  };
}
```

### 7-4. 정렬과 하이라이트

- 기본 정렬: 예상 세후 성과급 내림차순
- 최고 결과 카드에는 `orbc-result-card--best` 클래스 부여
- 회사가 1개만 선택된 경우 최대 차이와 월평균 차이는 `0원`으로 표시한다.
- 모든 금액은 원 단위 입력을 허용하되, 표시에서는 `만원` 또는 `억원` 단위를 상황에 맞게 사용한다.

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/oil-refinery-bonus-comparison.astro`

권장 import:

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import {
  OIL_REFINERY_BONUS_COMPANIES,
  ORBC_TAX_RATE_BRACKETS,
  ORBC_TERMS,
  ORBC_RELATED_CALCULATORS,
  ORBC_FAQS,
} from '../../data/oilRefineryBonusComparison';
---
```

권장 마크업 구조:

```astro
<SimpleToolShell ...>
  <section class="orbc-hero">...</section>
  <section class="orbc-notice">...</section>
  <section class="orbc-calculator" data-orbc-calculator>
    <div class="orbc-input-grid">...</div>
    <div class="orbc-company-inputs">...</div>
    <div class="orbc-results">...</div>
  </section>
  <section class="orbc-company-guide">...</section>
  <section class="orbc-terms">...</section>
  <section class="orbc-caution">...</section>
  <section class="orbc-related">...</section>
  <section class="orbc-faq">...</section>
</SimpleToolShell>
```

스크립트:

```astro
<script src="/scripts/oil-refinery-bonus-comparison.js" defer></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_oil-refinery-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `orbc-` prefix를 사용한다.

주요 클래스:

```text
orbc-page
orbc-hero
orbc-badges
orbc-notice
orbc-calculator
orbc-input-grid
orbc-company-picker
orbc-company-inputs
orbc-company-panel
orbc-results
orbc-kpi-grid
orbc-result-table
orbc-result-cards
orbc-company-guide
orbc-term-table
orbc-related-grid
orbc-faq
```

### 9-2. 반응형 기준

- Desktop: 입력 패널과 결과 패널을 2컬럼으로 배치
- Tablet: 입력과 결과를 1컬럼으로 전환하되 KPI 카드는 2컬럼 유지
- Mobile: 회사별 비교 표를 카드형 또는 가로 스크롤로 제공

권장 CSS 방향:

```scss
.orbc-input-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 24px;
}

@media (max-width: 860px) {
  .orbc-input-grid {
    grid-template-columns: 1fr;
  }
}
```

### 9-3. 색상 방향

- 기존 사이트 토큰을 우선 사용한다.
- 정유·에너지 업종 색상(주황·다크레드)을 강하게 쓰지 않고 보조적으로만 활용한다.
- 회사 비교 색상은 결과 강조용으로만 제한한다.
- `추정`·`시뮬레이션` 배지는 차분한 정보성 색상으로 처리한다.

---

## 10. 접근성·사용성 기준

- 모든 input은 label과 연결한다.
- 금액 입력 필드는 숫자 포맷을 보여주되 실제 계산 값은 숫자로 정규화한다.
- 회사 선택 checkbox는 키보드로 조작 가능해야 한다.
- 결과 갱신 시 포커스를 강제로 이동하지 않는다.
- 결과 표에는 `caption` 또는 상단 설명을 둔다.
- 배지는 색상만으로 의미를 전달하지 않고 텍스트를 포함한다.

---

## 11. 안전 문구

상단 안내:

```text
이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.
```

결과 표 하단:

```text
예상 세후 금액은 간편 공제율을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.
```

회사별 기본값 안내:

```text
기본 성과급률은 입력 편의를 위한 예시값이며 공식 지급률이 아닙니다. 실제 비교가 필요하면 회사별 지급 기준에 맞게 직접 수정해 주세요.
```

---

## 12. FAQ 데이터

```ts
export const ORBC_FAQS: FaqItem[] = [
  {
    question: "SK이노베이션과 GS칼텍스 성과급은 어떻게 비교해야 하나요?",
    answer: "같은 연봉 기준으로 성과급률·월급 개월 수를 맞춰 세전·세후·월평균을 함께 비교하는 것이 좋습니다. 성과급 명칭보다 기준 금액과 세후 실수령액이 중요합니다.",
  },
  {
    question: "S-OIL(에쓰오일) 성과급도 계산할 수 있나요?",
    answer: "가능합니다. 다만 회사별 실제 지급률을 단정하지 않고 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "정유 성과급은 유가 상승 시 더 많이 받나요?",
    answer: "정유사 실적은 정제마진·유가·판매량에 영향을 받으며 성과급과 연동될 수 있습니다. 다만 지급 구조는 회사마다 다르므로 일반화하기 어렵고, 실제 지급액은 확정 시점에 확인해야 합니다.",
  },
  {
    question: "롯데케미칼도 정유 성과급 비교에 넣어도 되나요?",
    answer: "가능합니다. 롯데케미칼은 석유화학 계열이지만 정유 인접 직군에서 함께 비교하는 수요가 있습니다. 본문에서는 석유화학 인접 산업으로 구분해 표현합니다.",
  },
  {
    question: "정유 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer: "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
];
```

---

## 13. 내부 링크 설계

### 13-1. 페이지 내부 CTA

| 위치 | CTA |
| --- | --- |
| 결과 하단 | `/tools/bonus-simulator/` — 일반 성과급 계산기로 다시 계산하기 |
| 세후 안내 | `/tools/bonus-after-tax-calculator/` — 성과급 세후 실수령액 계산하기 |
| 관련 업종 | `/tools/semiconductor-bonus-comparison/` — 반도체 성과급 비교 |
| 관련 업종 | `/tools/auto-bonus-comparison/` — 자동차 성과급 비교 |
| 관련 업종 | `/tools/shipbuilding-bonus-comparison/` — 조선업 성과급 비교 |
| 리포트 링크 | `/reports/corporate-bonus-comparison-2026/` — 대기업 성과급 비교 리포트 |

### 13-2. 기존 페이지 역링크 문구

일반 성과급 계산기:

```text
정유·석유화학 업계 성과급을 회사별로 비교하려면 정유 성과급 비교 계산기를 이용해보세요.
```

대기업 성과급 비교 리포트:

```text
SK이노베이션·GS칼텍스·S-OIL·현대오일뱅크 성과급을 같은 기준으로 비교하기
```

---

## 14. QA 체크리스트

- [ ] 회사 1개 선택 시 결과가 깨지지 않는다.
- [ ] 5개 회사 전체 선택 시 모바일에서 표 또는 카드가 겹치지 않는다.
- [ ] 연봉 변경 시 월 기본급이 자동 계산된다.
- [ ] 월 기본급 직접 수정 후 연봉 변경 시 사용자 수정값이 유지된다.
- [ ] 연봉 대비 %, 월급 n개월, 고정 금액 모드가 각각 정상 계산된다.
- [ ] 간편 추정 세율과 직접 세율 입력이 정상 전환된다.
- [ ] 결과 표의 최고 세후 금액 카드가 정상 하이라이트된다.
- [ ] 모든 추정 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다.
- [ ] FAQ와 용어 정리 섹션에 사용자 facing 영어가 없다.
- [ ] `npm run build`가 성공한다.

---

## 15. 구현 순서

1. `src/data/oilRefineryBonusComparison.ts` 데이터와 타입 생성
2. `src/pages/tools/oil-refinery-bonus-comparison.astro` 정적 구조 구현
3. `public/scripts/oil-refinery-bonus-comparison.js` 계산 로직 구현
4. `src/styles/scss/pages/_oil-refinery-bonus-comparison.scss` 스타일 구현
5. `tools.ts`, `app.scss`, `sitemap.xml` 등록
6. 일반 성과급 계산기 역링크 추가
7. 모바일 UI 확인
8. `npm run build`
