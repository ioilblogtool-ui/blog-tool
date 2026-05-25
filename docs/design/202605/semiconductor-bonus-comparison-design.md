# 반도체 성과급 비교 계산기 설계 문서

> 기획 원문: `docs/plan/202605/semiconductor-bonus-comparison.md`  
> 작성일: 2026-05-25  
> 구현 대상: `/tools/semiconductor-bonus-comparison/`  
> 구현 기준: 삼성전자·SK하이닉스·DB하이텍 등 반도체 기업 성과급을 사용자 입력값 기준으로 비교하는 계산기형 도구

---

## 1. 문서 개요

### 1-1. 대상

- 구현 대상: `반도체 성과급 비교 계산기 2026`
- 콘텐츠 유형: 계산기형 도구
- slug: `semiconductor-bonus-comparison`
- URL: `/tools/semiconductor-bonus-comparison/`
- 카테고리: 성과급 비교

### 1-2. 문서 역할

이 문서는 기획 문서를 실제 구현 단위로 고정한다. 구현자는 이 문서를 기준으로 페이지, 데이터, 스크립트, 스타일, 등록 파일을 추가한다.

핵심 구현 목표:

- 삼성전자, SK하이닉스, DB하이텍 등 반도체 기업의 성과급을 같은 입력 기준으로 비교한다.
- 사용자가 연봉, 월 기본급, 회사별 성과급 방식을 입력하면 세전·세후·월평균·총보상 결과를 즉시 보여준다.
- 공식 지급액처럼 보이지 않도록 모든 결과에 `추정`, `시뮬레이션`, `사용자 입력 기준` 맥락을 반복 노출한다.
- 삼성전자·SK하이닉스 상세 계산기로 내부 링크를 연결한다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    semiconductorBonusComparison.ts
  pages/
    tools/
      semiconductor-bonus-comparison.astro

public/
  scripts/
    semiconductor-bonus-comparison.js

src/styles/scss/pages/
  _semiconductor-bonus-comparison.scss
```

필수 등록:

- `src/data/tools.ts`
- `src/styles/app.scss`에 `@use 'scss/pages/semiconductor-bonus-comparison';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/tools/samsung-bonus.astro` 하단 내부 링크
- `src/pages/tools/sk-hynix-bonus.astro` 하단 내부 링크
- `src/pages/tools/bonus-simulator.astro` 하단 내부 링크
- `public/og/tools/semiconductor-bonus-comparison.png` 또는 OG 이미지 생성 대상

---

## 3. SEO 설계

### 3-1. 메타

```ts
title: "삼성전자·SK하이닉스·DB하이텍 성과급 비교 계산기 2026"
description: "삼성전자, SK하이닉스, DB하이텍 등 주요 반도체 기업의 성과급을 연봉·월급·성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 번에 시뮬레이션합니다."
canonical: "/tools/semiconductor-bonus-comparison/"
ogImage: "/og/tools/semiconductor-bonus-comparison.png"
```

### 3-2. 페이지 텍스트

H1:

```text
반도체 성과급 비교 계산기 2026
```

Hero sub:

```text
삼성전자, SK하이닉스, DB하이텍 등 주요 반도체 기업의 성과급을 같은 연봉과 성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 화면에서 확인할 수 있습니다.
```

주요 배지:

- `추정`
- `시뮬레이션`
- `사용자 입력 기준`

### 3-3. 키워드 매핑

| 키워드 | 반영 위치 |
| --- | --- |
| 삼성전자 SK하이닉스 성과급 비교 | title, hero, FAQ, 결과 표 |
| 반도체 성과급 비교 | H1, 본문 H2, FAQ |
| DB하이텍 성과급 | 회사 카드, FAQ |
| 반도체 성과급 계산기 | title, description, hero |
| 삼성전자 OPI TAI | 용어 정리, 삼성전자 카드 |
| SK하이닉스 PS PI | 용어 정리, SK하이닉스 카드 |

---

## 4. 레이아웃 방향

- `SimpleToolShell` 기반 계산기 페이지로 구현한다.
- SCSS prefix: `sbc-`
- pageClass: `sbc-page`
- 결과는 입력 아래 즉시 노출한다.
- 모바일에서는 회사별 결과 표를 카드형으로 전환한다.
- 차트는 필수 의존성으로 두지 않고, JS 없이도 비교 표와 KPI 카드가 핵심 정보를 전달해야 한다.

권장 페이지 셸:

```astro
<SimpleToolShell
  calculatorId="semiconductor-bonus-comparison"
  pageClass="sbc-page"
  resultFirst={false}
>
```

권장 IA:

1. Hero
2. 추정·시뮬레이션 안내
3. 기준 연봉 입력
4. 비교 회사 선택
5. 회사별 성과급 입력
6. 결과 KPI
7. 회사별 비교 표
8. 회사별 해설 카드
9. 성과급 용어 정리
10. 비교 주의사항
11. 관련 계산기 CTA
12. FAQ

---

## 5. 데이터 모델

파일: `src/data/semiconductorBonusComparison.ts`

```ts
export type SemiconductorCompanyId =
  | "samsung"
  | "skHynix"
  | "dbHitek"
  | "samsungDisplay"
  | "lgDisplay"
  | "lxSemicon"
  | "wonikIps"
  | "hanmi";

export type SemiconductorCompanyGroup =
  | "integrated"
  | "memory"
  | "foundry"
  | "display"
  | "fabless"
  | "equipment"
  | "materials"
  | "global";

export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface SemiconductorCompanyConfig {
  id: SemiconductorCompanyId;
  name: string;
  shortName: string;
  group: SemiconductorCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultBonusTerm: string;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
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

export interface BonusTermGuide {
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
export const SEMICONDUCTOR_BONUS_COMPANIES: SemiconductorCompanyConfig[] = [
  {
    id: "samsung",
    name: "삼성전자",
    shortName: "삼성전자",
    group: "integrated",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "OPI·TAI",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2,
    defaultFixedAmount: 0,
    structureSummary: "OPI·TAI 등 사업부 성과와 지급 기준에 따라 달라질 수 있습니다.",
    caution: "DS·DX 등 사업부, 직급, 평가, 지급 기준에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/samsung-bonus/",
    detailCtaLabel: "삼성전자 상세 계산",
  },
  {
    id: "skHynix",
    name: "SK하이닉스",
    shortName: "SK하이닉스",
    group: "memory",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "PS·PI",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2,
    defaultFixedAmount: 0,
    structureSummary: "PS·PI 등 업황과 사업 성과에 연동되는 보상 구조로 볼 수 있습니다.",
    caution: "사업 실적, 지급 기준, 평가, 협의 결과에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/sk-hynix-bonus/",
    detailCtaLabel: "SK하이닉스 상세 계산",
  },
  {
    id: "dbHitek",
    name: "DB하이텍",
    shortName: "DB하이텍",
    group: "foundry",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "사용자가 성과급률을 직접 입력해 비교하는 방식입니다.",
    caution: "공식 지급률을 단정하지 않으며, 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];
```

나머지 1차 회사는 같은 구조로 추가한다.

| 회사 | id | group | 기본 선택 | 기본 성과급률 |
| --- | --- | --- | --- | ---: |
| 삼성디스플레이 | `samsungDisplay` | `display` | false | 10 |
| LG디스플레이 | `lgDisplay` | `display` | false | 8 |
| LX세미콘 | `lxSemicon` | `fabless` | false | 10 |
| 원익IPS | `wonikIps` | `equipment` | false | 8 |
| 한미반도체 | `hanmi` | `equipment` | false | 8 |

모든 기본 성과급률은 실제 지급률이 아니라 입력 편의를 위한 예시값으로 취급한다. UI에는 `예시값` 또는 `사용자 입력 기준` 문구를 붙인다.

### 6-2. 세후 추정 구간

```ts
export const SBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];
```

---

## 7. 클라이언트 스크립트 설계

파일: `public/scripts/semiconductor-bonus-comparison.js`

### 7-1. DOM 계약

루트:

```html
<section data-sbc-calculator>
```

입력:

```html
<input data-sbc-annual-salary />
<input data-sbc-monthly-salary />
<select data-sbc-tax-mode />
<input data-sbc-manual-tax-rate />
<input type="checkbox" data-sbc-company-toggle="samsung" />
<select data-sbc-mode="samsung" />
<input data-sbc-salary-percent="samsung" />
<input data-sbc-monthly-multiple="samsung" />
<input data-sbc-fixed-amount="samsung" />
```

출력:

```html
<output data-sbc-best-net></output>
<output data-sbc-max-gap></output>
<output data-sbc-monthly-gap></output>
<output data-sbc-best-total></output>
<tbody data-sbc-result-table></tbody>
<div data-sbc-result-cards></div>
```

### 7-2. 입력 상태

```js
const state = {
  annualSalary: 80000000,
  monthlySalary: 6666667,
  monthlySalaryTouched: false,
  taxMode: "simple",
  manualTaxRate: 0.22,
  companies: {
    samsung: {
      selected: true,
      mode: "salaryPercent",
      salaryPercent: 20,
      monthlyMultiple: 2,
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
- 최고 결과 카드에는 `sbc-result-card--best` 클래스 부여
- 기존 선택 회사가 1개뿐이면 최대 차이와 월평균 차이는 `0원`으로 표시하고 비교 안내 문구를 함께 보여준다.

---

## 8. Astro 페이지 구조

파일: `src/pages/tools/semiconductor-bonus-comparison.astro`

권장 import:

```astro
---
import SimpleToolShell from '../../layouts/SimpleToolShell.astro';
import {
  SEMICONDUCTOR_BONUS_COMPANIES,
  SBC_TAX_RATE_BRACKETS,
  SBC_TERMS,
  SBC_RELATED_CALCULATORS,
  SBC_FAQS,
} from '../../data/semiconductorBonusComparison';
---
```

권장 마크업 구조:

```astro
<SimpleToolShell ...>
  <section class="sbc-hero">...</section>
  <section class="sbc-notice">...</section>
  <section class="sbc-calculator" data-sbc-calculator>
    <div class="sbc-input-grid">...</div>
    <div class="sbc-company-inputs">...</div>
    <div class="sbc-results">...</div>
  </section>
  <section class="sbc-company-guide">...</section>
  <section class="sbc-terms">...</section>
  <section class="sbc-caution">...</section>
  <section class="sbc-related">...</section>
  <section class="sbc-faq">...</section>
</SimpleToolShell>
```

스크립트:

```astro
<script src="/scripts/semiconductor-bonus-comparison.js" defer></script>
```

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_semiconductor-bonus-comparison.scss`

### 9-1. 클래스 prefix

모든 전용 스타일은 `sbc-` prefix를 사용한다.

주요 클래스:

```text
sbc-page
sbc-hero
sbc-badges
sbc-notice
sbc-calculator
sbc-input-grid
sbc-company-picker
sbc-company-inputs
sbc-company-panel
sbc-results
sbc-kpi-grid
sbc-result-table
sbc-result-cards
sbc-company-guide
sbc-term-table
sbc-related-grid
sbc-faq
```

### 9-2. 반응형 기준

- Desktop: 입력 패널과 결과 패널을 2컬럼으로 배치
- Tablet: 입력과 결과를 1컬럼으로 전환하되 KPI 카드는 2컬럼 유지
- Mobile: 회사별 비교 표를 숨기지 말고 가로 스크롤 또는 카드형으로 제공

권장 CSS 방향:

```scss
.sbc-input-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
  gap: 24px;
}

@media (max-width: 860px) {
  .sbc-input-grid {
    grid-template-columns: 1fr;
  }
}
```

### 9-3. 색상 방향

- 한 가지 반도체 블루 계열로만 밀지 않는다.
- 기본은 기존 사이트 토큰을 사용한다.
- 회사 비교에는 색상을 보조적으로만 사용한다.
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
이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다. 실제 지급액은 회사, 사업부, 직급, 평가, 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.
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

파일 데이터에는 최소 아래 질문을 포함한다.

```ts
export const SBC_FAQS: FaqItem[] = [
  {
    question: "삼성전자와 SK하이닉스 성과급은 어떻게 비교해야 하나요?",
    answer: "성과급 명칭보다 기준 금액을 먼저 봐야 합니다. 삼성전자는 OPI·TAI, SK하이닉스는 PS·PI처럼 용어가 다르지만 실제 비교는 기준 연봉, 기본급, 지급률, 세후 실수령액을 같은 조건으로 맞춘 뒤 보는 것이 좋습니다.",
  },
  {
    question: "DB하이텍 성과급도 계산할 수 있나요?",
    answer: "가능합니다. 다만 회사별 실제 지급률을 단정하지 않고 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "반도체 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer: "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 사업부, 직급, 평가, 지급 기준, 노사 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
];
```

---

## 13. 내부 링크 설계

### 13-1. 페이지 내부 CTA

| 위치 | CTA |
| --- | --- |
| 삼성전자 결과 카드 | `/tools/samsung-bonus/` |
| SK하이닉스 결과 카드 | `/tools/sk-hynix-bonus/` |
| 결과 하단 | `/tools/bonus-simulator/` |
| 세후 안내 | `/tools/bonus-after-tax-calculator/` |
| 해설 본문 | `/reports/corporate-bonus-comparison-2026/` |

### 13-2. 기존 페이지 역링크 문구

삼성전자 성과급 계산기:

```text
삼성전자와 SK하이닉스, DB하이텍 성과급을 같은 기준으로 비교해보세요.
```

SK하이닉스 성과급 계산기:

```text
SK하이닉스 PS·PI와 삼성전자 OPI·TAI를 세후 기준으로 함께 비교해보세요.
```

---

## 14. QA 체크리스트

- [ ] 회사 1개 선택 시 결과가 깨지지 않는다.
- [ ] 회사 8개 선택 시 모바일에서 표 또는 카드가 겹치지 않는다.
- [ ] 연봉 변경 시 월 기본급이 자동 계산된다.
- [ ] 월 기본급 직접 수정 후 연봉 변경 시 사용자 수정값이 유지된다.
- [ ] 연봉 대비 %, 월급 n개월, 고정 금액 모드가 각각 정상 계산된다.
- [ ] 간편 추정 세율과 직접 세율 입력이 정상 전환된다.
- [ ] 결과 표의 최고 세후 금액 카드가 정상 하이라이트된다.
- [ ] 모든 추정 결과에 `추정` 또는 `시뮬레이션` 배지가 보인다.
- [ ] 삼성전자·SK하이닉스 상세 계산기 링크가 정상 이동한다.
- [ ] FAQ와 용어 정리 섹션에 사용자 facing 영어가 없다.
- [ ] `npm run build`가 성공한다.

---

## 15. 구현 순서

1. `src/data/semiconductorBonusComparison.ts` 데이터와 타입 생성
2. `src/pages/tools/semiconductor-bonus-comparison.astro` 정적 구조 구현
3. `public/scripts/semiconductor-bonus-comparison.js` 계산 로직 구현
4. `src/styles/scss/pages/_semiconductor-bonus-comparison.scss` 스타일 구현
5. `tools.ts`, `app.scss`, `sitemap.xml` 등록
6. 삼성전자·SK하이닉스 페이지 역링크 추가
7. 모바일 UI 확인
8. `npm run build`
