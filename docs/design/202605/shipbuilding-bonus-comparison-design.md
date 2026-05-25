# 조선업 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/shipbuilding-bonus-comparison.md`  
> 작성일: 2026-05-25  
> 구현 대상: `/tools/shipbuilding-bonus-comparison/`  
> 구현 기준: HD현대중공업·한화오션·삼성중공업 성과급을 사용자 입력값 기준으로 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `조선업 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `shipbuilding-bonus-comparison`
- URL: `/tools/shipbuilding-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- HD현대중공업, 한화오션, 삼성중공업 성과급을 같은 입력 기준으로 비교한다.
- 조선업에서 자주 쓰이는 `월급 n개월`, `고정 격려금`, `연봉 대비 %`, `혼합` 방식을 모두 지원한다.
- 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 즉시 계산한다.
- 노조 요구안, 회사 제시안, 잠정 합의안, 최종 합의안을 확정 지급액처럼 보이지 않게 `추정`, `시뮬레이션`, `사용자 입력 기준` 문맥을 반복 노출한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    shipbuildingBonusComparison.ts
  pages/
    tools/
      shipbuilding-bonus-comparison.astro

public/
  scripts/
    shipbuilding-bonus-comparison.js

src/styles/scss/pages/
  _shipbuilding-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/shipbuilding-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/bonus-simulator.astro` 하단 내부 링크
- `src/pages/tools/bonus-after-tax-calculator.astro` 하단 내부 링크
- 향후 `src/pages/tools/company-bonus-comparison.astro` 업종별 허브 카드
- `public/og/tools/shipbuilding-bonus-comparison.png` 또는 OG 이미지 생성 대상

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "조선업 성과급 비교 계산기 2026 | HD현대중공업·한화오션·삼성중공업"
description: "HD현대중공업, 한화오션, 삼성중공업 등 주요 조선사의 성과급을 같은 연봉·월급 기준으로 비교해보세요. 월급 n개월, 고정 격려금, 성과급률을 입력하면 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 시뮬레이션합니다."
canonical: "/tools/shipbuilding-bonus-comparison/"
ogImage: "/og/tools/shipbuilding-bonus-comparison.png"
```

### 3-2. 페이지 텍스트

H1:

```text
조선업 성과급 비교 계산기 2026
```

Hero sub:

```text
HD현대중공업, 한화오션, 삼성중공업 등 주요 조선사의 성과급을 같은 연봉과 월급 기준으로 비교해보세요. 월급 n개월, 고정 격려금, 성과급률을 입력하면 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 확인할 수 있습니다.
```

주요 배지:

- `추정`
- `시뮬레이션`
- `사용자 입력 기준`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 조선업 성과급 비교 | title, H1, hero, FAQ |
| 조선소 성과급 계산기 | description, 계산기 섹션 |
| HD현대중공업 성과급 | title, 회사 카드, FAQ |
| 한화오션 성과급 | title, 회사 카드, FAQ |
| 삼성중공업 성과급 | title, 회사 카드, FAQ |
| 조선업 생산직 성과급 | 직군 주의사항, FAQ |
| 조선업 임단협 성과급 | 임단협 안내, 안전 문구 |

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `sbc-`는 반도체 문서와 충돌하므로 이 페이지는 `shbc-` prefix를 사용한다.
- pageClass: `shbc-page`
- 결과는 입력 아래 즉시 노출한다.
- 조선업 특성상 혼합 모드 입력이 중요하므로 회사별 패널에서 월급 n개월, 연봉 대비 %, 고정 금액 입력을 한 번에 볼 수 있게 한다.
- 모바일에서는 회사별 비교 표를 카드형으로 전환한다.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="shipbuilding-bonus-comparison"
  pageClass="shbc-page"
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
9. 조선업 성과급 구조 설명
10. 임단협·특별성과급 주의사항
11. 관련 계산기 CTA
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/shipbuildingBonusComparison.ts`

```ts
export type ShipbuildingCompanyId =
  | "hdHyundaiHeavy"
  | "hanwhaOcean"
  | "samsungHeavy";

export type ShipbuildingCompanyGroup =
  | "largeShipbuilder"
  | "midShipbuilder"
  | "marineEngine"
  | "equipment"
  | "defense";

export type BonusInputMode = "monthlyMultiple" | "salaryPercent" | "fixedAmount" | "mixed";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface ShipbuildingCompanyConfig {
  id: ShipbuildingCompanyId;
  name: string;
  shortName: string;
  group: ShipbuildingCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultPaymentLabel: string;
  defaultMonthlyMultiple: number;
  defaultSalaryPercent: number;
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

export interface ShipbuildingTermGuide {
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
export const SHIPBUILDING_BONUS_COMPANIES: ShipbuildingCompanyConfig[] = [
  {
    id: "hdHyundaiHeavy",
    name: "HD현대중공업",
    shortName: "HD현대중공업",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "월급 n개월, 고정 격려금, 임단협 지급액이 섞일 수 있어 혼합 입력이 적합합니다.",
    caution: "사업장, 직군, 직급, 임단협 결과에 따라 실제 지급액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
  {
    id: "hanwhaOcean",
    name: "한화오션",
    shortName: "한화오션",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·특별격려금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "인수 이후 보상 체계, 임단협, 특별격려금 이슈를 사용자가 직접 입력해 비교합니다.",
    caution: "요구안과 최종 합의안은 다르므로 입력값의 상태를 구분해야 합니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
  {
    id: "samsungHeavy",
    name: "삼성중공업",
    shortName: "삼성중공업",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·상여금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "성과급률, 월급 n개월, 고정 지급액을 직접 입력해 조선 3사 비교에 사용합니다.",
    caution: "회사의 실제 지급 기준, 직군, 평가, 지급월에 따라 실수령액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
];
```

기본값은 실제 지급액이 아니라 입력 편의를 위한 예시값이다. UI에는 `예시값` 또는 `사용자 입력 기준` 문구를 붙인다.

### 6-2. 세후 추정 구간

```ts
export const SHBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

### 6-3. 용어 데이터

```ts
export const SHBC_TERMS: ShipbuildingTermGuide[] = [
  {
    term: "월급 n개월",
    meaning: "월 기본급 또는 기준 월급에 지급 개월 수를 곱해 성과급을 계산하는 방식",
    caution: "기준이 통상임금인지 기본급인지 회사별로 확인해야 합니다.",
  },
  {
    term: "고정 격려금",
    meaning: "성과급률과 별도로 정액 지급되는 격려금 또는 특별 지급액",
    caution: "일회성 지급일 수 있어 매년 반복된다고 보기 어렵습니다.",
  },
  {
    term: "임단협 지급액",
    meaning: "임금·단체협약 과정에서 합의되는 지급액",
    caution: "요구안, 제시안, 잠정 합의안, 최종 합의안을 구분해야 합니다.",
  },
];
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/shipbuilding-bonus-comparison.js`

### 7-1. DOM 계약

루트:

```html
<section data-shbc-calculator>
```

입력:

```html
<input data-shbc-annual-salary />
<input data-shbc-monthly-salary />
<select data-shbc-tax-mode />
<input data-shbc-manual-tax-rate />
<input type="checkbox" data-shbc-company-toggle="hdHyundaiHeavy" />
<select data-shbc-mode="hdHyundaiHeavy" />
<input data-shbc-monthly-multiple="hdHyundaiHeavy" />
<input data-shbc-salary-percent="hdHyundaiHeavy" />
<input data-shbc-fixed-amount="hdHyundaiHeavy" />
```

출력:

```html
<output data-shbc-best-net></output>
<output data-shbc-max-gap></output>
<output data-shbc-monthly-gap></output>
<output data-shbc-best-total></output>
<tbody data-shbc-result-table></tbody>
<div data-shbc-result-cards></div>
```

### 7-2. 입력 상태

```js
const state = {
  annualSalary: 70000000,
  monthlySalary: 5833333,
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    hdHyundaiHeavy: {
      selected: true,
      mode: "mixed",
      monthlyMultiple: 1,
      salaryPercent: 0,
      fixedAmount: 3000000,
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
  const monthlyBonus = monthlySalary * companyInput.monthlyMultiple;
  const percentBonus = annualSalary * (companyInput.salaryPercent / 100);
  const fixedBonus = companyInput.fixedAmount;

  if (companyInput.mode === "monthlyMultiple") return monthlyBonus;
  if (companyInput.mode === "salaryPercent") return percentBonus;
  if (companyInput.mode === "fixedAmount") return fixedBonus;

  return monthlyBonus + percentBonus + fixedBonus;
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
- 최고 결과 카드에는 `shbc-result-card--best` 클래스 부여
- 회사가 1개만 선택된 경우 최대 차이와 월평균 차이는 `0원`으로 표시한다.
- 모든 금액은 원 단위 입력을 허용하되, 표시에서는 `만원` 또는 `억원` 단위를 상황에 맞게 사용한다.

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/shipbuilding-bonus-comparison.astro`

권장 import:

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import {
  SHIPBUILDING_BONUS_COMPANIES,
  SHBC_TAX_RATE_BRACKETS,
  SHBC_TERMS,
  SHBC_RELATED_CALCULATORS,
  SHBC_FAQS,
} from '../../data/shipbuildingBonusComparison';
---
```

권장 마크업 구조:

```astro
<SimpleToolShell ...>
  <section class="shbc-hero">...</section>
  <section class="shbc-notice">...</section>
  <section class="shbc-calculator" data-shbc-calculator>
    <div class="shbc-input-grid">...</div>
    <div class="shbc-company-inputs">...</div>
    <div class="shbc-results">...</div>
  </section>
  <section class="shbc-company-guide">...</section>
  <section class="shbc-terms">...</section>
  <section class="shbc-caution">...</section>
  <section class="shbc-related">...</section>
  <section class="shbc-faq">...</section>
</SimpleToolShell>
```

스크립트:

```astro
<script src="/scripts/shipbuilding-bonus-comparison.js" defer></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_shipbuilding-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `shbc-` prefix를 사용한다.

주요 클래스:

```text
shbc-page
shbc-hero
shbc-badges
shbc-notice
shbc-calculator
shbc-input-grid
shbc-company-picker
shbc-company-inputs
shbc-company-panel
shbc-results
shbc-kpi-grid
shbc-result-table
shbc-result-cards
shbc-company-guide
shbc-term-table
shbc-related-grid
shbc-faq
```

### 9-2. 반응형 기준

- Desktop: 입력 패널과 결과 패널을 2컬럼으로 배치
- Tablet: 입력과 결과를 1컬럼으로 전환하되 KPI 카드는 2컬럼 유지
- Mobile: 회사별 비교 표는 카드형으로 제공하거나 가로 스크롤을 제공
- 회사별 혼합 입력 행은 모바일에서 세로 스택으로 전환

권장 CSS 방향:

```scss
.shbc-input-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 24px;
}

@media (max-width: 860px) {
  .shbc-input-grid {
    grid-template-columns: 1fr;
  }
}
```

### 9-3. 색상 방향

- 조선업 이미지 때문에 짙은 남색만으로 단조롭게 만들지 않는다.
- 기존 사이트 토큰을 우선 사용한다.
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
- 혼합 모드에서는 비활성 입력을 숨기지 말고 0으로 둘 수 있게 해 사용자가 구조를 이해하게 한다.

---

## 11. 안전 문구

상단 안내:

```text
이 계산기는 사용자가 입력한 연봉, 월 기본급, 성과급 조건을 기준으로 한 비교용 시뮬레이션입니다. 실제 지급액은 회사, 사업장, 직군, 직급, 평가, 임단협 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.
```

결과 표 하단:

```text
예상 세후 금액은 간편 공제율을 적용한 추정값입니다. 실제 통장 입금액은 지급월 급여, 부양가족, 비과세 항목, 4대보험, 연말정산 결과에 따라 달라질 수 있습니다.
```

임단협 안내:

```text
노조 요구안, 회사 제시안, 잠정 합의안, 최종 합의안은 서로 다릅니다. 확정되지 않은 금액은 실제 지급액이 아니라 비교용 입력값으로만 사용하세요.
```

---

## 12. FAQ 데이터

파일 데이터에는 최소 아래 질문을 포함한다.

```ts
export const SHBC_FAQS: FaqItem[] = [
  {
    question: "조선업 성과급은 어떻게 계산하나요?",
    answer: "회사마다 다르지만 월급 n개월, 연봉 대비 %, 고정 격려금, 특별성과급 등이 섞일 수 있습니다. 이 계산기는 사용자가 입력한 조건을 기준으로 세전·세후·월평균 금액을 비교합니다.",
  },
  {
    question: "HD현대중공업, 한화오션, 삼성중공업 성과급을 직접 비교할 수 있나요?",
    answer: "가능합니다. 다만 실제 지급액을 단정하지 않고 같은 연봉과 월 기본급을 기준으로 사용자가 입력한 성과급 조건을 비교하는 방식입니다.",
  },
  {
    question: "임단협 요구안 금액을 그대로 넣어도 되나요?",
    answer: "계산은 가능하지만 요구안은 확정 지급액이 아닙니다. 요구안, 제시안, 잠정 합의안, 최종 합의안을 구분해서 입력해야 합니다.",
  },
];
```

---

## 13. 내부 링크 설계

### 13-1. 페이지 내부 CTA

| 위치 | CTA |
| --- | --- |
| 결과 하단 | `/tools/bonus-simulator/` |
| 세후 안내 | `/tools/bonus-after-tax-calculator/` |
| 관련 업종 | `/tools/semiconductor-bonus-comparison/` |
| 관련 업종 | `/tools/auto-bonus-comparison/` |
| 향후 허브 | `/tools/company-bonus-comparison/` |

### 13-2. 향후 역링크 문구

성과급 세후 계산기:

```text
조선업 성과급을 회사별로 비교하려면 HD현대중공업·한화오션·삼성중공업 비교 계산기를 이용해보세요.
```

대기업 성과급 비교 허브:

```text
조선업 성과급 비교: HD현대중공업·한화오션·삼성중공업을 월급 n개월, 고정 격려금, 세후 기준으로 비교합니다.
```

---

## 14. QA 체크리스트

- [ ] 회사 1개 선택 시 결과가 깨지지 않는다.
- [ ] 조선 3사 전체 선택 시 모바일에서 표 또는 카드가 겹치지 않는다.
- [ ] 연봉 변경 시 월 기본급이 자동 계산된다.
- [ ] 월 기본급 직접 수정 후 연봉 변경 시 사용자 수정값이 유지된다.
- [ ] 월급 n개월, 연봉 대비 %, 고정 금액, 혼합 모드가 각각 정상 계산된다.
- [ ] 혼합 모드에서 월급 n개월 + 연봉 대비 % + 고정 금액이 합산된다.
- [ ] 간편 추정 세율과 직접 세율 입력이 정상 전환된다.
- [ ] 모든 추정 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다.
- [ ] 임단협 요구안과 확정 지급액을 구분하는 안내가 노출된다.
- [ ] FAQ와 본문에 사용자 facing 영어가 없다.
- [ ] `npm run build`가 성공한다.

---

## 15. 구현 순서

1. `src/data/shipbuildingBonusComparison.ts` 데이터와 타입 생성
2. `src/pages/tools/shipbuilding-bonus-comparison.astro` 정적 구조 구현
3. `public/scripts/shipbuilding-bonus-comparison.js` 계산 로직 구현
4. `src/styles/scss/pages/_shipbuilding-bonus-comparison.scss` 스타일 구현
5. `tools.ts`, `app.scss`, `sitemap.xml` 등록
6. 성과급 세후 계산기 또는 일반 성과급 계산기에서 역링크 추가
7. 모바일 UI 확인
8. `npm run build`
