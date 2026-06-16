# 공기업 성과급 비교 2026 설계 문서

> 작성일: 2026-06-16  
> 구현 대상: `/reports/public-enterprise-bonus-comparison-2026/`  
> 콘텐츠 유형: 리포트형 비교 콘텐츠 + 간이 시뮬레이션  
> 선행 기획: `docs/plan/202606/public-enterprise-bonus-comparison-2026-plan.md`

---

## 1. 설계 요약

이 페이지는 `공기업 성과급`, `공기업 성과급 비교`, `한전 성과급`, `코레일 성과급`, `LH 성과급` 검색 의도를 받는 신규 리포트다. 기존 비교계산소의 성과급 클러스터는 민간 대기업 중심이고, 직업별 연봉 클러스터는 교사·경찰·공무원·군인 중심이다. 이 페이지는 두 클러스터를 연결하는 **공공기관 보상 비교 허브** 역할을 한다.

사용자가 기대하는 첫 답은 다음 3가지다.

1. 한전·코레일·LH 등 주요 공기업/공공기관 성과급은 어느 정도 차이가 나는가
2. 내 기준 연봉으로 환산하면 성과급 세전/세후 추정액이 얼마인가
3. 공기업 성과급은 민간 대기업 성과급과 무엇이 다른가

단, 공기업 성과급은 경영평가, 기관 내부 규정, 직급, 직군, 근속, 연도별 공시 기준에 따라 달라진다. 따라서 페이지 전체에서 `공시 평균`, `입력 연봉 기준 추정`, `확인 필요` 표현을 강제한다. 실제 개인 지급액처럼 보이는 문구는 금지한다.

---

## 2. 최종 페이지 방향

### 2.1 URL

```text
/reports/public-enterprise-bonus-comparison-2026/
```

### 2.2 최종 제목

```text
공기업 성과급 비교 2026｜한전·코레일·LH는 얼마나 받을까
```

### 2.3 콘텐츠 포맷

- 리포트형 페이지
- 기준 연봉 입력 시뮬레이션 포함
- 표/막대 차트/기관 카드/FAQ 구성
- 계산기는 아니지만, `public/scripts/`에서 클라이언트 사이드 결과 갱신

### 2.4 핵심 고지

상단 InfoNotice와 결과 표 주변에 아래 성격의 문구가 반복 노출되어야 한다.

```text
이 페이지의 금액은 공시 평균 또는 입력 연봉 기준 추정값입니다.
개인별 실제 성과급은 경영평가 결과, 기관 내부 지급률, 직급, 직군, 근속에 따라 달라질 수 있습니다.
```

---

## 3. 구현 파일 구조

```text
src/
  data/
    publicEnterpriseBonusComparison2026.ts
      - 페이지 메타
      - 기관별 비교 데이터
      - 기관 유형/업종 라벨
      - FAQ
      - SEO 본문
      - 관련 링크

  pages/
    reports/
      public-enterprise-bonus-comparison-2026.astro
      - BaseLayout 기반 리포트 페이지
      - Hero, InfoNotice, 입력 패널, KPI, 차트, 표, 기관 카드, SeoContent

public/
  scripts/
    public-enterprise-bonus-comparison-2026.js
      - 기준 연봉 입력 상태
      - 세전/세후 토글
      - 기관 유형/업종 필터
      - 정렬
      - URL state
      - DOM 렌더링

src/styles/scss/pages/
  _public-enterprise-bonus-comparison-2026.scss
      - prefix: pebc-

등록 파일:
  src/data/reports.ts
  src/styles/app.scss
  public/sitemap.xml
```

---

## 4. 라우팅 및 등록 설계

### 4.1 `reports.ts` 등록

```ts
{
  slug: "public-enterprise-bonus-comparison-2026",
  title: "공기업 성과급 비교 2026",
  description: "한전, 코레일, LH, 건보공단 등 주요 공공기관의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다.",
  category: "salary",
  tags: ["공기업", "성과급", "공공기관", "연봉", "2026"],
  publishedAt: "2026-06-16",
  updatedAt: "2026-06-16",
  featured: false,
}
```

실제 `reports.ts` 필드 구조가 다르면 기존 리포트 등록 패턴을 우선한다.

### 4.2 `app.scss` 등록

```scss
@use 'scss/pages/public-enterprise-bonus-comparison-2026';
```

성과급/연봉 관련 import 주변에 배치한다.

### 4.3 `sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/public-enterprise-bonus-comparison-2026/</loc>
  <lastmod>2026-06-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.85</priority>
</url>
```

---

## 5. 데이터 설계

### 5.1 타입

파일: `src/data/publicEnterpriseBonusComparison2026.ts`

```ts
export type PublicEnterpriseType =
  | "marketPublic"
  | "quasiMarketPublic"
  | "quasiGovernment"
  | "otherPublic";

export type PublicEnterpriseIndustry =
  | "energy"
  | "transport"
  | "housing"
  | "welfare"
  | "pension"
  | "airport"
  | "soc"
  | "water";

export type PublicEnterpriseDataConfidence =
  | "officialAverage"
  | "simulated"
  | "needsReview";

export type PublicEnterpriseEvaluationSensitivity =
  | "high"
  | "medium"
  | "check";

export interface PublicEnterpriseBonusEntry {
  id: string;
  name: string;
  shortName: string;
  type: PublicEnterpriseType;
  industry: PublicEnterpriseIndustry;
  defaultSalaryPercent: number;
  defaultBaseSalary: number;
  dataConfidence: PublicEnterpriseDataConfidence;
  evaluationSensitivity: PublicEnterpriseEvaluationSensitivity;
  rankNote: string;
  summary: string;
  caution: string;
  sourceNote: string;
  relatedKeywords: string[];
}

export interface PublicEnterpriseBonusFaq {
  question: string;
  answer: string;
}

export interface PublicEnterpriseRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface PublicEnterpriseSeoContent {
  introTitle: string;
  intro: string[];
  inputPoints: string[];
  criteria: string[];
}
```

### 5.2 메타 상수

```ts
export const PEBC_META = {
  slug: "public-enterprise-bonus-comparison-2026",
  title: "공기업 성과급 비교 2026",
  seoTitle: "공기업 성과급 비교 2026｜한전·코레일·LH는 얼마나 받을까",
  seoDescription:
    "한전, 코레일, LH, 건보공단 등 주요 공공기관의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다. 경영평가 등급과 기관 유형별 차이도 함께 확인하세요.",
  updatedAt: "2026-06-16",
  dataNote:
    "공시 평균과 입력 연봉 기준 추정값을 함께 사용하는 자가 점검용 콘텐츠입니다. 개인별 실제 지급액은 기관 내부 기준에 따라 달라질 수 있습니다.",
};
```

### 5.3 기준 상수

```ts
export const PEBC_BASE_SALARY = 60_000_000;
export const PEBC_SIMPLE_TAX_RATE = 0.22;
export const PEBC_MIN_SALARY = 20_000_000;
export const PEBC_MAX_SALARY = 200_000_000;
```

### 5.4 라벨

```ts
export const PEBC_TYPE_LABELS: Record<PublicEnterpriseType, string> = {
  marketPublic: "시장형 공기업",
  quasiMarketPublic: "준시장형 공기업",
  quasiGovernment: "준정부기관",
  otherPublic: "기타공공기관",
};

export const PEBC_INDUSTRY_LABELS: Record<PublicEnterpriseIndustry, string> = {
  energy: "에너지",
  transport: "철도·운송",
  housing: "주택·토지",
  welfare: "복지·행정",
  pension: "연금",
  airport: "공항",
  soc: "SOC",
  water: "수자원",
};

export const PEBC_CONFIDENCE_LABELS: Record<PublicEnterpriseDataConfidence, string> = {
  officialAverage: "공시 평균",
  simulated: "입력 연봉 기준 추정",
  needsReview: "확인 필요",
};

export const PEBC_EVALUATION_LABELS: Record<PublicEnterpriseEvaluationSensitivity, string> = {
  high: "경영평가 영향 큼",
  medium: "경영평가 영향 보통",
  check: "기관 기준 확인",
};
```

### 5.5 1차 데이터 초안

`defaultSalaryPercent`는 구현 전 공식 자료 검토 후 조정한다. 초기 MVP에서는 모든 기관에 `simulated` 또는 `needsReview`를 붙이고, 실제 공시 평균을 확보한 기관만 `officialAverage`로 바꾼다.

```ts
export const PEBC_ENTRIES: PublicEnterpriseBonusEntry[] = [
  {
    id: "kepco",
    name: "한국전력공사",
    shortName: "한전",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 8,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "에너지 대표 공기업",
    summary: "한전 성과급은 경영평가와 재무 상황에 따라 체감 차이가 클 수 있습니다.",
    caution: "연도별 경영평가와 내부 지급 기준에 따라 실제 지급률이 달라집니다.",
    sourceNote: "공시/경영평가 확인 필요",
    relatedKeywords: ["한전 성과급", "한국전력 성과급"],
  },
  {
    id: "korail",
    name: "한국철도공사",
    shortName: "코레일",
    type: "quasiMarketPublic",
    industry: "transport",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "철도·운송 대표 공기업",
    summary: "코레일은 직군과 근속에 따른 보상 체감 차이가 큰 기관입니다.",
    caution: "운전·시설·사무 등 직군별 지급 체감액이 달라질 수 있습니다.",
    sourceNote: "공시/기관 기준 확인 필요",
    relatedKeywords: ["코레일 성과급", "한국철도공사 성과급"],
  },
  {
    id: "lh",
    name: "한국토지주택공사",
    shortName: "LH",
    type: "quasiMarketPublic",
    industry: "housing",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "주택·토지 공공기관",
    summary: "LH 성과급은 공공기관 평가와 내부 지급 기준을 함께 확인해야 합니다.",
    caution: "성과급 관련 논란성 표현은 피하고 공시 기준으로만 설명합니다.",
    sourceNote: "공시/경영평가 확인 필요",
    relatedKeywords: ["LH 성과급", "한국토지주택공사 성과급"],
  },
  {
    id: "nhis",
    name: "국민건강보험공단",
    shortName: "건보공단",
    type: "quasiGovernment",
    industry: "welfare",
    defaultSalaryPercent: 6,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "복지·행정 대표 공공기관",
    summary: "건보공단은 공기업이라기보다 준정부기관 성격으로 보는 것이 정확합니다.",
    caution: "공기업과 동일한 방식으로 단순 비교하지 않도록 기관 유형을 함께 표시합니다.",
    sourceNote: "공시/기관 기준 확인 필요",
    relatedKeywords: ["건보공단 성과급", "국민건강보험공단 성과급"],
  },
  {
    id: "nps",
    name: "국민연금공단",
    shortName: "국민연금",
    type: "quasiGovernment",
    industry: "pension",
    defaultSalaryPercent: 6,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "연금 공공기관",
    summary: "국민연금공단은 연봉·성과급을 함께 보는 취업 검색 수요가 있습니다.",
    caution: "직급과 근속에 따른 실제 지급 차이를 별도 고지합니다.",
    sourceNote: "공시/기관 기준 확인 필요",
    relatedKeywords: ["국민연금공단 성과급", "국민연금 성과급"],
  },
  {
    id: "khnp",
    name: "한국수력원자력",
    shortName: "한수원",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 9,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "발전·원전 공기업",
    summary: "한수원은 에너지 공기업 중 보상 관심도가 높은 기관입니다.",
    caution: "한국전력공사와 별도 기관이므로 별도 기준으로 표시합니다.",
    sourceNote: "공시/경영평가 확인 필요",
    relatedKeywords: ["한수원 성과급", "한국수력원자력 성과급"],
  },
  {
    id: "kogas",
    name: "한국가스공사",
    shortName: "가스공사",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 8,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "에너지 공기업",
    summary: "한국가스공사는 에너지 공기업 비교군에서 함께 확인할 기관입니다.",
    caution: "재무 상황과 평가 결과에 따라 성과급 체감액이 달라질 수 있습니다.",
    sourceNote: "공시/경영평가 확인 필요",
    relatedKeywords: ["한국가스공사 성과급", "가스공사 성과급"],
  },
  {
    id: "incheonAirport",
    name: "인천국제공항공사",
    shortName: "인국공",
    type: "marketPublic",
    industry: "airport",
    defaultSalaryPercent: 9,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "공항 공기업",
    summary: "인천국제공항공사는 고연봉 공기업 이미지가 있어 비교 클릭 수요가 큽니다.",
    caution: "성과급 규모는 항공 수요와 경영평가 결과에 따라 달라질 수 있습니다.",
    sourceNote: "공시/경영평가 확인 필요",
    relatedKeywords: ["인천국제공항공사 성과급", "인국공 성과급"],
  },
  {
    id: "ex",
    name: "한국도로공사",
    shortName: "도로공사",
    type: "quasiMarketPublic",
    industry: "soc",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "SOC 공기업",
    summary: "한국도로공사는 SOC 공기업 비교군에서 함께 볼 수 있습니다.",
    caution: "직무와 근속에 따른 성과급 체감 차이가 있을 수 있습니다.",
    sourceNote: "공시/기관 기준 확인 필요",
    relatedKeywords: ["한국도로공사 성과급", "도로공사 성과급"],
  },
  {
    id: "kwater",
    name: "한국수자원공사",
    shortName: "수자원공사",
    type: "quasiMarketPublic",
    industry: "water",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "수자원 공기업",
    summary: "한국수자원공사는 SOC·공공서비스 성격의 비교군으로 적합합니다.",
    caution: "기관 내부 기준과 연도별 평가에 따라 지급률이 달라질 수 있습니다.",
    sourceNote: "공시/기관 기준 확인 필요",
    relatedKeywords: ["한국수자원공사 성과급", "수자원공사 성과급"],
  },
];
```

---

## 6. 계산 설계

### 6.1 입력 상태

```ts
export interface PebcInputState {
  salary: number;
  viewMode: "gross" | "net";
  typeFilter: "all" | PublicEnterpriseType;
  industryFilter: "all" | PublicEnterpriseIndustry;
  sortBy: "grossBonus" | "netBonus" | "salaryPercent" | "name";
}
```

### 6.2 결과 계산

```ts
grossBonus = salary * (defaultSalaryPercent / 100)
netBonus = grossBonus * (1 - simpleTaxRate)
monthlyEquivalent = grossBonus / 12
```

### 6.3 KPI 계산

```ts
visibleEntries = entries filtered by type + industry
averagePercent = average(visibleEntries.defaultSalaryPercent)
topEntry = maxBy(visibleEntries, grossBonus)
bottomEntry = minBy(visibleEntries, grossBonus)
gap = topEntry.grossBonus - bottomEntry.grossBonus
```

### 6.4 결과 문구

예시:

```text
기준 연봉 6,000만 원으로 단순 환산하면, 비교 대상 10개 기관의 성과급 추정 평균은 세전 약 000만 원입니다. 이 값은 개인별 실제 지급액이 아니라 입력 연봉과 기본 성과급률을 곱한 시뮬레이션입니다.
```

### 6.5 숫자 표시 규칙

- 금액: `000만 원`
- 큰 금액: `0.0억 원`
- 비율: 소수점 1자리
- 표 내부는 세전/세후 둘 다 노출
- KPI는 현재 viewMode에 맞춰 세전 또는 세후 강조

---

## 7. 페이지 컴포넌트 설계

### 7.1 Astro frontmatter

```ts
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  PEBC_META,
  PEBC_ENTRIES,
  PEBC_FAQ,
  PEBC_RELATED_LINKS,
  PEBC_SEO_CONTENT,
  PEBC_CONFIG,
} from "../../data/publicEnterpriseBonusComparison2026";
```

### 7.2 BaseLayout

```astro
<BaseLayout
  title={PEBC_META.seoTitle}
  description={PEBC_META.seoDescription}
  ogImage="/og/og-home.png"
  jsonLd={[webApplicationJsonLd, faqJsonLd, breadcrumbJsonLd]}
>
```

JSON-LD는 `Article` 또는 `WebPage` + `FAQPage` 조합이 적합하다. 계산 UI가 있지만 리포트 성격이 강하므로 `Article`을 기본으로 둔다.

### 7.3 Hero

```astro
<CalculatorHero
  eyebrow="공기업 성과급 비교"
  title="공기업 성과급 비교 2026"
  description="한전·코레일·LH·건보공단 등 주요 공공기관의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다."
  badges={["공기업", "성과급", "경영평가", "2026"]}
/>
```

### 7.4 InfoNotice

```astro
<InfoNotice
  title="비교 전 확인"
  lines={[
    PEBC_META.dataNote,
    "공기업 성과급은 경영평가 결과, 기관 내부 지급률, 직급, 근속, 직군에 따라 달라집니다.",
    "공기업·준정부기관·기타공공기관이 함께 포함될 수 있으므로 기관 유형을 함께 확인하세요.",
  ]}
/>
```

### 7.5 입력 패널

클래스 prefix: `pebc-control`

구성:

- 기준 연봉 input
- 세전/세후 segmented radio
- 기관 유형 select
- 업종 select
- 정렬 기준 select
- 초기화 버튼
- 링크 복사 버튼

마크업 예시:

```astro
<section class="pebc-control-panel">
  <label class="pebc-field">
    <span>기준 연봉</span>
    <input data-pebc="salary" type="text" inputmode="numeric" value="60,000,000" />
  </label>

  <fieldset class="pebc-segment">
    <legend>보기 기준</legend>
    <label><input type="radio" name="pebcViewMode" value="gross" checked data-pebc="viewMode" /><span>세전</span></label>
    <label><input type="radio" name="pebcViewMode" value="net" data-pebc="viewMode" /><span>세후 추정</span></label>
  </fieldset>

  <label class="pebc-field">
    <span>기관 유형</span>
    <select data-pebc="typeFilter">...</select>
  </label>

  <label class="pebc-field">
    <span>업종</span>
    <select data-pebc="industryFilter">...</select>
  </label>

  <label class="pebc-field">
    <span>정렬</span>
    <select data-pebc="sortBy">...</select>
  </label>
</section>
```

### 7.6 KPI 섹션

```astro
<section class="pebc-section pebc-kpi-section" aria-live="polite">
  <article class="pebc-kpi pebc-kpi--main">
    <span>추정 1위 기관</span>
    <strong data-pebc-result="topName">-</strong>
    <small data-pebc-result="topBonus">-</small>
  </article>
  <article class="pebc-kpi">
    <span>비교 기관</span>
    <strong data-pebc-result="count">-</strong>
    <small>필터 기준</small>
  </article>
  <article class="pebc-kpi">
    <span>평균 성과급률</span>
    <strong data-pebc-result="averagePercent">-</strong>
    <small>입력 연봉 기준</small>
  </article>
  <article class="pebc-kpi">
    <span>최고·최저 차이</span>
    <strong data-pebc-result="gap">-</strong>
    <small>세전 기준</small>
  </article>
</section>
```

### 7.7 차트 섹션

DOM 기반 막대 차트로 구현한다. SVG/Canvas는 필요 없다.

```html
<div class="pebc-chart" data-pebc-chart></div>
```

렌더링 row:

```html
<article class="pebc-chart-row">
  <div>
    <strong>한국수력원자력</strong>
    <span>에너지 · 시장형 공기업</span>
  </div>
  <span class="pebc-chart-row__bar"><i style="width: 92%"></i></span>
  <em>540만 원</em>
</article>
```

### 7.8 비교 테이블

모바일에서 가로 스크롤.

컬럼:

1. 순위
2. 기관
3. 유형
4. 업종
5. 성과급률
6. 세전 추정
7. 세후 추정
8. 경영평가 영향
9. 데이터 성격
10. 주의

```astro
<div class="pebc-table-wrap">
  <table class="pebc-table">
    <caption>공기업 성과급 비교 2026</caption>
    <thead>...</thead>
    <tbody data-pebc-table-body></tbody>
  </table>
</div>
```

### 7.9 기관별 카드

정적 렌더링을 기본으로 하고, 필터는 표/차트에만 적용해도 된다. 첫 구현에서 기관 카드까지 동적 필터링하면 복잡도가 늘어난다.

```astro
<section class="pebc-section">
  <div class="section-header">
    <p class="section-header__eyebrow">기관별 메모</p>
    <h2>한전·코레일·LH 성과급은 왜 단순 비교가 어렵나</h2>
  </div>
  <div class="pebc-card-grid">
    {PEBC_ENTRIES.map((entry) => (
      <article class="pebc-org-card">
        <span>{PEBC_TYPE_LABELS[entry.type]}</span>
        <h3>{entry.shortName}</h3>
        <p>{entry.summary}</p>
        <small>{entry.caution}</small>
      </article>
    ))}
  </div>
</section>
```

### 7.10 설명 섹션

3개 블록.

1. 공기업 성과급 산정 구조
2. 공기업과 준정부기관 차이
3. 민간 대기업 성과급과 차이

각 블록에는 과도한 설명 카드 남발 대신, 본문 + 비교 리스트 조합을 사용한다.

### 7.11 CTA 그리드

```astro
<div class="pebc-cta-grid">
  <a href="/tools/bonus-after-tax-calculator/">성과급 세후 계산기</a>
  <a href="/reports/corporate-bonus-comparison-2026/">대기업 성과급 비교</a>
  <a href="/compare/bonus/">성과급 계산기 모아보기</a>
  <a href="/reports/new-employee-salary-2026/">신입사원 연봉 비교</a>
</div>
```

---

## 8. 스크립트 설계

파일: `public/scripts/public-enterprise-bonus-comparison-2026.js`

### 8.1 데이터 주입

Astro 페이지에서 JSON script로 주입.

```astro
<script id="pebc-data" type="application/json" set:html={JSON.stringify(PEBC_CONFIG)} />
<script type="module" src={withBase("/scripts/public-enterprise-bonus-comparison-2026.js")}></script>
```

`PEBC_CONFIG` 구성:

```ts
export const PEBC_CONFIG = {
  baseSalary: PEBC_BASE_SALARY,
  taxRate: PEBC_SIMPLE_TAX_RATE,
  minSalary: PEBC_MIN_SALARY,
  maxSalary: PEBC_MAX_SALARY,
  entries: PEBC_ENTRIES,
  typeLabels: PEBC_TYPE_LABELS,
  industryLabels: PEBC_INDUSTRY_LABELS,
  confidenceLabels: PEBC_CONFIDENCE_LABELS,
  evaluationLabels: PEBC_EVALUATION_LABELS,
};
```

### 8.2 상태

```js
const initialState = {
  salary: 60000000,
  viewMode: "gross",
  typeFilter: "all",
  industryFilter: "all",
  sortBy: "grossBonus",
};
```

### 8.3 주요 함수

```js
function num(value, fallback = 0) {}
function manwon(value) {}
function percent(value) {}
function readState() {}
function applyFilters(entries, state) {}
function calculateEntry(entry, state) {}
function sortEntries(entries, state) {}
function calculateSummary(rows) {}
function renderKpis(summary, state) {}
function renderChart(rows, state) {}
function renderTable(rows) {}
function updateUrl(state) {}
function restoreFromUrl() {}
function refresh() {}
```

### 8.4 URL state

파라미터:

| Param | 의미 |
|---|---|
| `salary` | 기준 연봉 |
| `view` | `gross`/`net` |
| `type` | 기관 유형 |
| `ind` | 업종 |
| `sort` | 정렬 기준 |

예시:

```text
/reports/public-enterprise-bonus-comparison-2026/?salary=70000000&view=net&type=marketPublic&ind=energy
```

### 8.5 복사 버튼

버튼 ID:

- `pebcResetBtn`
- `pebcCopyBtn`

복사 성공 시 1.6초 동안 `링크 복사 완료` 표시.

---

## 9. 스타일 설계

파일: `src/styles/scss/pages/_public-enterprise-bonus-comparison-2026.scss`

### 9.1 Prefix

모든 신규 클래스는 `pebc-` prefix 사용.

### 9.2 주요 클래스

```scss
.pebc-page
.pebc-section
.pebc-control-panel
.pebc-field
.pebc-segment
.pebc-kpi-grid
.pebc-kpi
.pebc-chart
.pebc-chart-row
.pebc-table-wrap
.pebc-table
.pebc-badge
.pebc-card-grid
.pebc-org-card
.pebc-explain-grid
.pebc-cta-grid
```

### 9.3 디자인 톤

- 공공기관/연봉 콘텐츠이므로 차분한 업무형 UI
- 주색: teal/blue 계열 혼합
- 단색 계열로 과하게 치우치지 않도록 회색/녹색/파랑을 함께 사용
- 카드 radius는 8px 이하
- 표는 고밀도지만 행간은 충분히
- 모바일에서 KPI는 1열, 표는 가로 스크롤

### 9.4 반응형

```scss
.pebc-kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 1020px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.pebc-control-panel {
  display: grid;
  gap: 12px;

  @media (min-width: 880px) {
    grid-template-columns: 1.2fr 1fr 1fr 1fr auto;
  }
}

.pebc-table {
  min-width: 880px;
}
```

### 9.5 텍스트 오버플로 방지

- KPI `strong`: `overflow-wrap: anywhere`
- 표: `white-space: nowrap` 기본, 기관명 컬럼만 normal
- 카드 설명: line-height 1.55 이상
- 버튼/CTA: min-height 고정, text-align center

---

## 10. SEO 콘텐츠 설계

### 10.1 `SeoContent`

```ts
export const PEBC_SEO_CONTENT: PublicEnterpriseSeoContent = {
  introTitle: "공기업 성과급은 왜 기관마다 차이가 날까",
  intro: [
    "공기업 성과급은 민간 대기업처럼 회사 실적만으로 결정되지 않습니다...",
    "한전, 코레일, LH, 건보공단처럼 이름은 익숙하지만 기관 유형과 평가 방식은 서로 다릅니다...",
    "이 페이지는 주요 공공기관의 성과급 구조를 같은 기준 연봉으로 환산해 비교합니다...",
  ],
  inputPoints: [
    "기준 연봉을 입력하면 기관별 성과급률을 곱해 세전 추정액을 계산합니다.",
    "세후 보기에서는 간이 세율을 적용한 실수령 추정액을 표시합니다.",
    "기관 유형과 업종 필터로 에너지, SOC, 복지·행정 기관을 나눠 볼 수 있습니다.",
  ],
  criteria: [
    "모든 금액은 개인별 실제 지급액이 아니라 공시 평균 또는 입력 연봉 기준 추정값입니다.",
    "경영평가 결과와 내부 지급률에 따라 실제 성과급은 달라질 수 있습니다.",
    "공기업, 준정부기관, 기타공공기관을 단순 동일 기준으로 해석하지 않도록 기관 유형을 함께 표시합니다.",
  ],
};
```

### 10.2 FAQ

```ts
export const PEBC_FAQ: PublicEnterpriseBonusFaq[] = [
  {
    question: "공기업 성과급은 매년 나오나요?",
    answer: "공기업과 공공기관 성과급은 경영평가 결과와 내부 기준에 따라 달라집니다. 매년 동일하게 지급된다고 보기는 어렵고, 기관별 재무 상황과 평가 결과도 함께 봐야 합니다.",
  },
  {
    question: "한전, 코레일, LH 중 어디 성과급이 가장 많나요?",
    answer: "개인별 실제 지급액은 직급, 직군, 근속, 평가, 지급 기준에 따라 달라집니다. 이 페이지의 순위는 입력 연봉과 기본 성과급률을 곱한 시뮬레이션 기준입니다.",
  },
  {
    question: "공기업 성과급은 연봉에 포함되나요?",
    answer: "채용 공고나 공시에서 보수 항목을 표시하는 방식에 따라 다릅니다. 기본급, 수당, 성과급, 복지포인트가 분리될 수 있으므로 총보수와 고정급을 나눠 확인하는 것이 좋습니다.",
  },
  {
    question: "공기업 성과급도 세금을 떼나요?",
    answer: "성과급도 근로소득으로 과세될 수 있습니다. 실제 세율은 연봉, 공제, 지급월의 원천징수 방식에 따라 달라지므로 이 페이지의 세후 금액은 간이 추정입니다.",
  },
  {
    question: "공기업과 준정부기관 성과급은 같은 기준인가요?",
    answer: "완전히 같다고 보기 어렵습니다. 기관 유형, 경영평가 체계, 내부 보수 규정이 다를 수 있어 페이지에서는 기관 유형을 별도로 표시합니다.",
  },
  {
    question: "신입사원도 성과급을 받을 수 있나요?",
    answer: "기관과 입사 시점, 지급 기준에 따라 달라질 수 있습니다. 일부 기관은 재직 기간에 따라 일할 계산하거나 지급 대상에서 제외할 수 있으므로 채용 공고와 내부 기준을 확인해야 합니다.",
  },
  {
    question: "성과급이 높은 공기업이 무조건 좋은 회사인가요?",
    answer: "성과급만으로 판단하기는 어렵습니다. 기본급, 근속 상승, 수당, 근무지, 직무 안정성, 복지, 조직문화까지 함께 비교해야 실제 체감 보상이 보입니다.",
  },
];
```

### 10.3 관련 링크

```ts
export const PEBC_RELATED_LINKS = [
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 계산기",
    description: "성과급을 받았을 때 세후 실수령액을 계산합니다.",
  },
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "대기업 성과급 비교",
    description: "민간 대기업 성과급 구조와 지급 방식을 비교합니다.",
  },
  {
    href: "/compare/bonus/",
    label: "성과급 계산기 모아보기",
    description: "삼성, SK, 현대차, LG 등 성과급 계산기를 한 번에 봅니다.",
  },
  {
    href: "/reports/new-employee-salary-2026/",
    label: "신입사원 연봉 비교",
    description: "직군별·업종별 신입 연봉을 함께 비교합니다.",
  },
  {
    href: "/reports/public-servant-salary-2026/",
    label: "공무원 월급·연봉",
    description: "공공부문 보상 비교를 공무원 월급과 연결해 봅니다.",
  },
];
```

---

## 11. 접근성 및 UX

- 입력 변경 결과 영역은 `aria-live="polite"` 적용
- 차트는 시각 보조 요소이므로 동일 내용을 표로 반드시 제공
- 표 caption 포함
- 필터 select에는 명확한 label 필요
- 세전/세후 토글은 radio 기반 segmented control
- 색상만으로 `공시 평균`, `추정`, `확인 필요`를 구분하지 않고 텍스트 badge 포함
- 링크 복사 실패 시 `복사 실패` 텍스트 표시

---

## 12. 데이터 검증 및 콘텐츠 안전장치

### 12.1 구현 전 확인할 자료

최종 구현 전에는 최신 자료 확인이 필요하다.

- 알리오 공공기관 경영정보 공개시스템
- 기관별 보수/성과급 공시
- 공공기관 경영평가 결과
- 기관 공식 보도자료 또는 공시자료

### 12.2 표현 금지

아래 표현은 금지한다.

```text
한전 성과급은 000만 원입니다.
코레일은 무조건 LH보다 성과급이 많습니다.
신입사원도 000만 원을 받습니다.
공기업 성과급 순위 확정판
```

### 12.3 권장 표현

```text
입력 연봉 기준 추정
공시 평균 기준
경영평가와 내부 기준에 따라 변동
개인별 실제 지급액과 다를 수 있음
기관 유형을 함께 확인 필요
```

---

## 13. QA 체크리스트

### 13.1 빌드

- [ ] `npm run build` 통과
- [ ] 신규 리포트 HTML 생성 확인
- [ ] sitemap 등록 확인
- [ ] `reports.ts` 목록 노출 확인

### 13.2 계산

- [ ] 기준 연봉 6,000만 원에서 세전 추정액 계산 정확
- [ ] 세후 보기에서 간이 세율 적용
- [ ] 기관 유형 필터 정상
- [ ] 업종 필터 정상
- [ ] 정렬 기준 정상
- [ ] URL state 복원 정상
- [ ] 링크 복사 정상

### 13.3 콘텐츠

- [ ] 모든 금액에 `추정`, `공시 평균`, `입력 연봉 기준` 중 하나가 표시됨
- [ ] 개인별 실제 지급액처럼 보이는 문구 없음
- [ ] 공기업/준정부기관/기타공공기관 구분 설명 있음
- [ ] 경영평가 영향 설명 있음
- [ ] 민간 대기업 성과급과 차이 설명 있음
- [ ] FAQ 6개 이상

### 13.4 모바일

- [ ] KPI 카드 1열 전환
- [ ] 입력 패널 세로 배치
- [ ] 표 가로 스크롤
- [ ] 차트 row 텍스트 줄바꿈 안전
- [ ] CTA 버튼 텍스트 넘침 없음

---

## 14. 구현 순서

1. `publicEnterpriseBonusComparison2026.ts` 작성
2. `public-enterprise-bonus-comparison-2026.astro` 작성
3. JSON config script 주입
4. `public-enterprise-bonus-comparison-2026.js` 작성
5. `_public-enterprise-bonus-comparison-2026.scss` 작성
6. `reports.ts` 등록
7. `app.scss` 등록
8. `sitemap.xml` 등록
9. `npm run build`
10. preview 또는 dev 서버에서 두 viewport 확인

---

## 15. 출시 후 보완 계획

1. 네이버 서치어드바이저에서 `한전 성과급`, `코레일 성과급`, `LH 성과급` 노출 여부 확인
2. 노출은 있는데 CTR이 낮으면 title을 `공기업 성과급 순위 2026｜한전·코레일·LH 비교`로 A/B 후보 검토
3. 특정 기관 키워드가 뜨면 기관별 단독 리포트 확장
4. 공기업 신입 연봉 TOP10 페이지와 양방향 내부링크 추가
5. 공공기관 경영평가 결과 발표 시점에 데이터 업데이트

---

## 16. 최종 구현 판단

MVP는 공식 숫자를 과하게 확정하지 않고, `입력 연봉 기준 시뮬레이션 + 기관별 구조 설명`으로 출시하는 것이 안전하다. 이후 공시 평균값이 확인되는 기관부터 `dataConfidence`를 `officialAverage`로 올리고, 표의 `sourceNote`를 구체화한다.

이 구조라면 첫 버전에서도 검색 수요를 받을 수 있고, 나중에 데이터 정밀도를 높여도 페이지 구조를 크게 바꾸지 않아도 된다.
