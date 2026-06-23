# 동탄 20억 시대 검증 리포트 설계 문서

## 1. 개요

- **슬러그**: `reports/dongtan-20-billion-apartment-affordability-2026`
- **페이지 경로**: `/reports/dongtan-20-billion-apartment-affordability-2026/`
- **유형**: 리포트 + 계산형 시뮬레이션
- **prefix**: `dt20-`
- **데이터 파일**: `src/data/dongtan20BillionApartmentAffordability2026.ts`
- **페이지 파일**: `src/pages/reports/dongtan-20-billion-apartment-affordability-2026.astro`
- **스타일 파일**: `src/styles/scss/pages/_dongtan-20-billion-apartment-affordability-2026.scss`
- **기획 문서**: `docs/plan/202606/dongtan-20-billion-apartment-affordability-report-plan.md`

### 핵심 목표

1. `동탄 20억`, `동탄 아파트 20억`, `동탄 84㎡ 20억` 검색 유입 확보
2. 뉴스성 부동산 이슈를 “월급·대출·현금흐름 검증”으로 변환
3. 주택 구매 가능 소득 계산기, 대출 계산기, 아파트 보유세 계산기로 내부 이동 유도
4. 광교·영통·분당 비교까지 포함해 체류시간 확보
5. 모든 계산값은 `추정`, `시뮬레이션`, `보도 기반` 배지로 명확히 구분

---

## 2. 구현 파일 구조

```text
src/data/dongtan20BillionApartmentAffordability2026.ts
src/pages/reports/dongtan-20-billion-apartment-affordability-2026.astro
src/styles/scss/pages/_dongtan-20-billion-apartment-affordability-2026.scss
```

등록 필요 파일:

```text
src/data/reports.ts
src/styles/app.scss
public/sitemap.xml
src/pages/index.astro
```

선택 등록:

```text
src/data/compareHub.ts
```

비교허브에는 바로 넣어도 되지만, 리포트 성격상 `/compare/`보다 부동산 관련 리포트 내부 CTA가 더 우선이다.

---

## 3. 페이지 레이아웃

### 3-1. 전체 구조

```text
[BaseLayout]
  SiteHeader
  main.report-page.dt20-page
    CalculatorHero
    InfoNotice

    section.dt20-summary
      - 핵심 숫자 KPI 4개
      - 기준 가격, 고가 실거래, 상승률, 매물 감소율

    section.dt20-verdict
      - "실거주 가능 가격 vs 투자 과열 가격" 판정 카드
      - 기준 시나리오 설명

    section.dt20-flow
      - 동탄 집값 최근 흐름
      - 보도 수치와 공식 확인 필요 수치 구분

    section.dt20-meaning
      - 84㎡ 20억 실거래 의미
      - 평균가격이 아니라 상단 가격이라는 안내

    section.dt20-cash
      - 20억 매수 시 필요 현금 표

    section.dt20-loan
      - 대출 10억·12억·15억 월 원리금 표

    section.dt20-income
      - 부부 실수령 800만·1,000만·1,200만 가능성 매트릭스

    section.dt20-drivers
      - 동탄 상승 이유 5가지

    section.dt20-region-compare
      - 광교·영통·분당 비교

    section.dt20-risk
      - 단기 과열 리스크 체크리스트

    section.dt20-conclusion
      - 조건별 결론

    section.dt20-cta
      - 관련 계산기 CTA

    SeoContent
```

### 3-2. 공통 컴포넌트

사용 추천:

```astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
```

리포트 페이지이므로 `SimpleToolShell`은 사용하지 않는다. `BaseLayout` 내부에서 직접 `main.dt20-page`를 구성한다.

---

## 4. 데이터 모델

### 4-1. 타입 정의

```ts
export type DataBadge = "공식" | "보도 기반" | "추정" | "시뮬레이션" | "확인 필요";
export type AffordabilityLevel = "stable" | "tight" | "risk" | "danger";
export type RegionId = "dongtan" | "gwanggyo" | "yeongtong" | "bundang";
export type LoanScenarioId = "loan10" | "loan12" | "loan15";
export type IncomeScenarioId = "income800" | "income1000" | "income1200";

export interface ReportMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface EvidenceMetric {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  badge: DataBadge;
  description: string;
}

export interface PurchaseCostInput {
  homePrice: number;
  loanAmount: number;
  acquisitionTaxRate: number;
  brokerageFeeRate: number;
  legalFee: number;
  movingReserve: number;
}

export interface PurchaseCostResult {
  homePrice: number;
  loanAmount: number;
  equityRequired: number;
  acquisitionTax: number;
  brokerageFee: number;
  legalFee: number;
  movingReserve: number;
  totalCashRequired: number;
}

export interface LoanScenario {
  id: LoanScenarioId;
  label: string;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  annualPayment: number;
  description: string;
}

export interface IncomeScenario {
  id: IncomeScenarioId;
  label: string;
  monthlyNetIncome: number;
  livingCost: number;
  description: string;
}

export interface AffordabilityCell {
  incomeId: IncomeScenarioId;
  loanId: LoanScenarioId;
  monthlyPayment: number;
  housingRatio: number;
  remainingCash: number;
  level: AffordabilityLevel;
  label: string;
  comment: string;
}

export interface PriceDriver {
  id: string;
  title: string;
  summary: string;
  upside: string;
  caution: string;
}

export interface RegionCompareItem {
  id: RegionId;
  name: string;
  pricePosition: string;
  strengths: string[];
  risks: string[];
  note: string;
}

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
  tone: "primary" | "default";
}

export interface FaqItem {
  question: string;
  answer: string;
}
```

---

## 5. 상수 설계

### 5-1. 메타

```ts
export const DT20_META: ReportMeta = {
  slug: "dongtan-20-billion-apartment-affordability-2026",
  title: "동탄 20억 시대, 진짜 가능한 가격일까?",
  seoTitle: "동탄 20억 시대, 진짜 가능한 가격일까?｜84㎡ 실거래·대출·월급 기준 검증",
  description:
    "동탄 84㎡ 20억 실거래가를 기준으로 필요 현금, 대출 10억·12억·15억 월 원리금, 부부 실수령 800만·1,000만·1,200만 원의 실거주 가능성을 계산합니다.",
  updatedAt: "2026.06.23",
  caution:
    "보도 수치와 공개 실거래 자료를 바탕으로 한 참고용 검증 콘텐츠입니다. 대출 가능액, 세금, 월 상환액은 개인 조건과 금융기관 심사에 따라 달라질 수 있으며 투자 권유가 아닙니다.",
};
```

### 5-2. 핵심 지표

기획서 기준값을 그대로 둔다. 구현 직전 기사 원문과 국토부 실거래 확인이 필요하다.

```ts
export const DT20_EVIDENCE_METRICS: EvidenceMetric[] = [
  {
    id: "base-price",
    label: "검증 기준 가격",
    value: "20억 원",
    numericValue: 2000000000,
    unit: "원",
    badge: "시뮬레이션",
    description: "동탄 84㎡ 고가 거래를 검증하기 위한 기준 가격입니다.",
  },
  {
    id: "reported-high",
    label: "84㎡ 고가 실거래",
    value: "20억8000만 원",
    numericValue: 2080000000,
    unit: "원",
    badge: "보도 기반",
    description: "사용자 제공 보도 수치 기준이며 구현 전 원문 확인이 필요합니다.",
  },
  {
    id: "ytd-growth",
    label: "올해 상승률",
    value: "5.11%",
    numericValue: 5.11,
    unit: "%",
    badge: "보도 기반",
    description: "동탄구 상승률로 보도된 수치입니다.",
  },
  {
    id: "listing-drop",
    label: "매물 감소율",
    value: "42.6%",
    numericValue: 42.6,
    unit: "%",
    badge: "보도 기반",
    description: "단기 수급 압력을 설명하는 보도 수치입니다.",
  },
];
```

### 5-3. 기본 계산값

```ts
export const DT20_BASE_PRICE = 2_000_000_000;

export const DT20_PURCHASE_COST_DEFAULTS = {
  acquisitionTaxRate: 0.033,
  brokerageFeeRate: 0.004,
  legalFee: 3_000_000,
  movingReserve: 20_000_000,
};

export const DT20_INTEREST_RATE = 0.042;
export const DT20_TERM_YEARS = 40;
```

취득세율은 단순 시뮬레이션용이다. 실제 취득세는 보유주택 수, 조정대상지역, 취득가액, 생애최초 여부 등에 따라 달라진다는 안내를 붙인다.

### 5-4. 대출 시나리오

```ts
export const DT20_LOAN_INPUTS = [
  { id: "loan10", label: "대출 10억", loanAmount: 1_000_000_000 },
  { id: "loan12", label: "대출 12억", loanAmount: 1_200_000_000 },
  { id: "loan15", label: "대출 15억", loanAmount: 1_500_000_000 },
] as const;
```

### 5-5. 소득 시나리오

```ts
export const DT20_INCOME_SCENARIOS: IncomeScenario[] = [
  {
    id: "income800",
    label: "부부 실수령 800만 원",
    monthlyNetIncome: 8_000_000,
    livingCost: 3_500_000,
    description: "맞벌이 중상위 가구의 보수적 현금흐름입니다.",
  },
  {
    id: "income1000",
    label: "부부 실수령 1,000만 원",
    monthlyNetIncome: 10_000_000,
    livingCost: 3_800_000,
    description: "고소득 맞벌이의 중간 시나리오입니다.",
  },
  {
    id: "income1200",
    label: "부부 실수령 1,200만 원",
    monthlyNetIncome: 12_000_000,
    livingCost: 4_200_000,
    description: "20억 주택 검토권에 가까운 고소득 시나리오입니다.",
  },
];
```

---

## 6. 계산 헬퍼

### 6-1. 원화 포맷

```ts
export function formatKrw(value: number): string {
  if (value >= 100000000) {
    const eok = value / 100000000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억 원`;
  }
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
}
```

KPI에는 `20억 원`, 표에는 `1,200,000,000원`보다 `12억 원`처럼 읽히는 표현을 우선한다.

### 6-2. 월 원리금

```ts
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  const monthlyRate = annualRate / 12;
  const months = termYears * 12;
  if (monthlyRate === 0) return principal / months;

  return (
    principal *
    monthlyRate *
    Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}
```

표시는 `월 약 520만 원`처럼 반올림한다.

### 6-3. 필요 현금

```ts
export function calculatePurchaseCost(input: PurchaseCostInput): PurchaseCostResult {
  const equityRequired = Math.max(0, input.homePrice - input.loanAmount);
  const acquisitionTax = Math.round(input.homePrice * input.acquisitionTaxRate);
  const brokerageFee = Math.round(input.homePrice * input.brokerageFeeRate);

  return {
    homePrice: input.homePrice,
    loanAmount: input.loanAmount,
    equityRequired,
    acquisitionTax,
    brokerageFee,
    legalFee: input.legalFee,
    movingReserve: input.movingReserve,
    totalCashRequired:
      equityRequired + acquisitionTax + brokerageFee + input.legalFee + input.movingReserve,
  };
}
```

주의:

- 중개보수는 실제 상한요율·협의에 따라 달라질 수 있다.
- 취득세는 다주택·규제지역·생애최초 조건에 따라 달라진다.
- 리포트에서는 정밀 세금 계산기가 아니라 감당 가능성 검증용으로 사용한다.

### 6-4. 부담률 판정

```ts
export function getAffordabilityLevel(housingRatio: number): AffordabilityLevel {
  if (housingRatio <= 0.35) return "stable";
  if (housingRatio <= 0.5) return "tight";
  if (housingRatio <= 0.65) return "risk";
  return "danger";
}

export function getAffordabilityLabel(level: AffordabilityLevel): string {
  const labels = {
    stable: "상대적으로 안정",
    tight: "빠듯",
    risk: "위험",
    danger: "매우 위험",
  };
  return labels[level];
}
```

### 6-5. 소득 매트릭스 생성

```ts
export function buildAffordabilityMatrix(
  incomeScenarios: IncomeScenario[],
  loanScenarios: LoanScenario[],
): AffordabilityCell[] {
  return incomeScenarios.flatMap((income) =>
    loanScenarios.map((loan) => {
      const housingRatio = loan.monthlyPayment / income.monthlyNetIncome;
      const remainingCash = income.monthlyNetIncome - loan.monthlyPayment - income.livingCost;
      const level = getAffordabilityLevel(housingRatio);

      return {
        incomeId: income.id,
        loanId: loan.id,
        monthlyPayment: loan.monthlyPayment,
        housingRatio,
        remainingCash,
        level,
        label: getAffordabilityLabel(level),
        comment: buildAffordabilityComment(level, remainingCash),
      };
    }),
  );
}
```

---

## 7. 데이터 상수 상세

### 7-1. 상승 이유

```ts
export const DT20_PRICE_DRIVERS: PriceDriver[] = [
  {
    id: "gtx-a",
    title: "GTX-A 효과",
    summary: "서울 접근성 개선 기대가 역세권 단지 선호를 키웁니다.",
    upside: "출퇴근 시간이 줄어드는 지역은 실거주 수요가 붙기 쉽습니다.",
    caution: "개통 기대가 이미 가격에 선반영됐을 가능성은 확인해야 합니다.",
  },
  {
    id: "samsung-semiconductor",
    title: "삼성전자·반도체 배후 수요",
    summary: "고소득 직장인과 반도체 산업 배후 수요가 가격을 지지합니다.",
    upside: "직주근접 수요가 꾸준하면 하방을 일부 방어할 수 있습니다.",
    caution: "반도체 경기와 고용 기대가 과하게 반영될 수 있습니다.",
  },
  {
    id: "new-town-product",
    title: "신축·대단지 상품성",
    summary: "커뮤니티, 주차, 학군, 생활 인프라가 구축 지역과 차별화됩니다.",
    upside: "같은 가격대에서도 신축 선호가 강하게 작동할 수 있습니다.",
    caution: "동탄 내에서도 단지별 격차가 커 평균으로 보면 안 됩니다.",
  },
  {
    id: "listing-drop",
    title: "매물 감소",
    summary: "매물이 줄면 단기적으로 호가가 빠르게 올라갈 수 있습니다.",
    upside: "수요가 유지되는 동안에는 가격 상승 압력이 생깁니다.",
    caution: "거래량이 줄면 호가와 실거래가 괴리가 커질 수 있습니다.",
  },
  {
    id: "price-catch-up",
    title: "광교·분당과의 가격 키 맞추기 기대",
    summary: "동탄이 저평가였다는 심리가 가격 상승을 자극할 수 있습니다.",
    upside: "비슷한 생활권 수요가 비교 매수로 들어올 수 있습니다.",
    caution: "가격 차가 줄수록 안전마진은 낮아집니다.",
  },
];
```

### 7-2. 지역 비교

```ts
export const DT20_REGION_COMPARE: RegionCompareItem[] = [
  {
    id: "dongtan",
    name: "동탄",
    pricePosition: "84㎡ 20억 상단 진입",
    strengths: ["GTX-A", "반도체 배후 수요", "신축 대단지"],
    risks: ["단기 급등", "서울 핵심지 대비 거리", "단지별 격차"],
    note: "실거주 효용이 큰 가구와 투자 기대만 보는 가구의 판단이 갈립니다.",
  },
  {
    id: "gwanggyo",
    name: "광교",
    pricePosition: "기존 수도권 고가 주거지",
    strengths: ["업무·상권", "호수공원", "수원 고소득 수요"],
    risks: ["이미 높은 가격", "상급지 단지 쏠림"],
    note: "동탄 가격이 광교와 가까워질수록 입지 비교가 중요해집니다.",
  },
  {
    id: "yeongtong",
    name: "영통",
    pricePosition: "삼성전자 배후 구축·준신축 혼재",
    strengths: ["직주근접", "생활 인프라", "수원 접근성"],
    risks: ["구축 비중", "단지별 노후도 차이"],
    note: "직장 접근성은 강하지만 상품성은 단지별로 크게 갈립니다.",
  },
  {
    id: "bundang",
    name: "분당",
    pricePosition: "1기 신도시 대표 고가 지역",
    strengths: ["서울 접근성", "학군", "재건축 기대"],
    risks: ["노후도", "재건축 변수", "초기 투자금 부담"],
    note: "동탄 신축과 분당 재건축 기대는 성격이 다른 비교 대상입니다.",
  },
];
```

### 7-3. 관련 링크

```ts
export const DT20_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/income-home-affordability/",
    title: "우리 소득으로 집 살 수 있을까?",
    description: "연소득과 대출 조건을 넣어 구매 가능한 주택 가격을 계산합니다.",
    tone: "primary",
  },
  {
    href: "/tools/loan-refinancing-calculator/",
    title: "주담대 월 상환액 계산하기",
    description: "대출금, 금리, 상환기간별 월 원리금을 직접 비교합니다.",
    tone: "default",
  },
  {
    href: "/tools/apartment-holding-tax/",
    title: "20억 아파트 보유세 확인",
    description: "재산세와 종부세 부담을 시뮬레이션합니다.",
    tone: "default",
  },
];
```

---

## 8. Astro 페이지 설계

### 8-1. frontmatter

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import {
  DT20_META,
  DT20_EVIDENCE_METRICS,
  DT20_LOAN_SCENARIOS,
  DT20_INCOME_SCENARIOS,
  DT20_AFFORDABILITY_MATRIX,
  DT20_PURCHASE_COSTS,
  DT20_PRICE_DRIVERS,
  DT20_REGION_COMPARE,
  DT20_RELATED_LINKS,
  DT20_FAQ,
  DT20_SEO_INTRO,
  DT20_SEO_BULLETS,
  formatKrw,
  formatMonthlyKrw,
  formatPercent,
} from "../../data/dongtan20BillionApartmentAffordability2026";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: DT20_META.title,
    description: DT20_META.description,
    dateModified: "2026-06-23",
    author: {
      "@type": "Organization",
      name: "비교계산소",
    },
    mainEntityOfPage: `https://bigyocalc.com/reports/${DT20_META.slug}/`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DT20_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];
---
```

### 8-2. BaseLayout

```astro
<BaseLayout title={DT20_META.seoTitle} description={DT20_META.description} jsonLd={jsonLd}>
  <SiteHeader />
  <main class="dt20-page">
    ...
  </main>
</BaseLayout>
```

---

## 9. UI 섹션 설계

### 9-1. Hero

```astro
<CalculatorHero
  eyebrow="동탄 집값 검증"
  title="동탄 20억 시대, 월급으로 감당 가능한 가격일까?"
  description="84㎡ 20억 실거래가를 기준으로 필요 현금, 대출 월 원리금, 부부 실수령별 가능성을 계산합니다."
/>
<InfoNotice
  title="보도 기반 추정 리포트"
  lines={[DT20_META.caution, `업데이트 기준: ${DT20_META.updatedAt}`]}
/>
```

### 9-2. 핵심 KPI

클래스:

```text
dt20-kpi-grid
dt20-kpi-card
dt20-kpi-card__badge
```

렌더링:

```astro
<section class="dt20-kpi-grid" aria-label="동탄 20억 검증 핵심 지표">
  {DT20_EVIDENCE_METRICS.map((metric) => (
    <article class="dt20-kpi-card">
      <span class="dt20-kpi-card__badge">{metric.badge}</span>
      <p>{metric.label}</p>
      <strong>{metric.value}</strong>
      <small>{metric.description}</small>
    </article>
  ))}
</section>
```

### 9-3. 판정 카드

카드 문구:

```text
동탄 20억은 불가능한 숫자는 아니지만, 평균적인 맞벌이 가구가 편하게 감당할 수 있는 가격도 아닙니다.
```

구성:

- 왼쪽: 조건부 결론
- 오른쪽: 기준 시나리오
  - 매매가 20억
  - 대출 12억
  - 금리 4.2%
  - 40년 원리금 균등
  - 부부 실수령 1,000만 원

### 9-4. 필요 현금 표

표 컬럼:

| 대출 | 자기자금 | 취득세 추정 | 중개보수 추정 | 기타비용 | 총 필요 현금 |
| --- | --- | --- | --- | --- | --- |

클래스:

```text
dt20-table-wrap
dt20-data-table
dt20-data-table--cash
```

표 하단 안내:

```text
취득세와 중개보수는 단순 추정입니다. 실제 세금과 수수료는 보유주택 수, 규제지역 여부, 생애최초 여부, 협의 수수료에 따라 달라질 수 있습니다.
```

### 9-5. 대출 원리금 표

표 컬럼:

| 대출금 | 금리 | 기간 | 월 원리금 | 연 상환액 | 해석 |
| --- | --- | --- | --- | --- | --- |

행:

- 대출 10억
- 대출 12억
- 대출 15억

각 행 해석:

```ts
loan10: "현금 10억 이상이 필요하지만 월 부담은 가장 낮습니다."
loan12: "고소득 맞벌이도 생활비를 함께 보면 빠듯한 구간입니다."
loan15: "실수령 1,200만 원 이상도 금리 변화에 민감한 구간입니다."
```

### 9-6. 소득 가능성 매트릭스

데스크톱:

| 부부 실수령 | 대출 10억 | 대출 12억 | 대출 15억 |
| --- | --- | --- | --- |

각 셀:

```text
월 430만 원
주거비 43%
빠듯
생활비 후 잔액 190만 원
```

모바일:

- 행렬 테이블이 좁아질 수 있으므로 카드형으로 전환
- `incomeScenario`별 묶음 카드 3개
- 카드 안에 대출 10억·12억·15억 mini row

클래스:

```text
dt20-affordability
dt20-affordability-cell
dt20-affordability-cell--stable
dt20-affordability-cell--tight
dt20-affordability-cell--risk
dt20-affordability-cell--danger
```

### 9-7. 상승 이유 5가지

카드 그리드:

```text
dt20-driver-grid
dt20-driver-card
```

각 카드:

- 번호
- 제목
- 요약
- 상승 요인
- 주의점

디자인:

- 상승 요인은 파란색 왼쪽 라인
- 주의점은 주황색 또는 회색 박스
- 과한 낙관처럼 보이지 않게 `주의점`을 같은 비중으로 배치

### 9-8. 지역 비교

표 + 카드 혼합.

데스크톱:

| 지역 | 가격 포지션 | 강점 | 리스크 | 해석 |
| --- | --- | --- | --- | --- |

모바일:

- 지역별 카드 4개

중요:

- “동탄이 더 좋다” 같은 단정 금지
- “비교 기준이 다르다”, “실거주 효용이 다르다”를 강조

### 9-9. 리스크 체크리스트

체크 항목:

1. 단기 급등 후 거래량이 줄면 가격 방어가 어려울 수 있음
2. 매물 감소는 상승 요인이지만 호가·실거래 괴리를 키울 수 있음
3. GTX-A 효과가 이미 가격에 선반영됐을 수 있음
4. 반도체 경기와 고소득 수요 기대가 과도하게 반영될 수 있음
5. 금리 상승 또는 대출 규제 강화 시 실수요자의 매수 가능 금액 감소
6. 20억 가격대는 취득세, 보유세, 이자비용 부담이 커짐

클래스:

```text
dt20-risk-list
dt20-risk-item
```

### 9-10. 결론

3단 카드:

| 카드 | 제목 | 설명 |
| --- | --- | --- |
| 실거주 검토 가능 | 현금 8억 이상 + 실수령 1,200만 원 이상 | 대출 10억~12억 이내면 검토 가능 |
| 빠듯한 가격 | 실수령 1,000만 원 전후 + 대출 12억 이상 | 생활비·교육비까지 보면 압박 |
| 과열 주의 | 단기 상승만 보고 진입 | 월 현금흐름보다 시세차익 기대가 큰 경우 |

---

## 10. 스타일 설계

### 10-1. 기본 톤

부동산 검증 리포트이므로 과한 색상보다 신뢰감 있는 색을 사용한다.

```scss
.dt20-page {
  --dt20-ink: #172033;
  --dt20-muted: #667085;
  --dt20-line: #d7deea;
  --dt20-soft: #f6f8fb;
  --dt20-blue: #2563eb;
  --dt20-green: #138a5b;
  --dt20-amber: #b7791f;
  --dt20-red: #c2410c;
}
```

주의:

- 보라/남색 단색 테마로 가지 않는다.
- 부동산 리포트라 카드 과다 장식보다 표와 요약 카드 중심.
- 모든 카드 radius는 8px 이하.

### 10-2. 레이아웃

```scss
.dt20-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}
```

Hero 컴포넌트가 자체 폭을 갖는 경우, 본문 섹션만 `.dt20-section`으로 감싸도 된다.

### 10-3. 주요 컴포넌트 클래스

```text
dt20-kpi-grid
dt20-kpi-card
dt20-verdict
dt20-section
dt20-section-heading
dt20-table-wrap
dt20-data-table
dt20-affordability
dt20-affordability-cell
dt20-driver-grid
dt20-driver-card
dt20-region-grid
dt20-region-card
dt20-risk-list
dt20-conclusion-grid
dt20-related-grid
```

### 10-4. 반응형

```scss
@media (max-width: 920px) {
  .dt20-kpi-grid,
  .dt20-driver-grid,
  .dt20-conclusion-grid,
  .dt20-related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .dt20-kpi-grid,
  .dt20-driver-grid,
  .dt20-conclusion-grid,
  .dt20-related-grid {
    grid-template-columns: 1fr;
  }

  .dt20-table-wrap {
    overflow-x: auto;
  }

  .dt20-data-table {
    min-width: 720px;
  }
}
```

테이블은 모바일에서 가로 스크롤을 허용하되, 소득 매트릭스는 카드형 대체 UI를 제공하는 것이 좋다.

---

## 11. SEO 설계

### 11-1. title

```text
동탄 20억 시대, 진짜 가능한 가격일까?｜84㎡ 실거래·대출·월급 기준 검증
```

### 11-2. description

```text
동탄 84㎡ 20억 실거래가를 기준으로 필요 현금, 대출 10억·12억·15억 월 원리금, 부부 실수령 800만·1,000만·1,200만 원의 실거주 가능성을 계산합니다. 광교·영통·분당과도 비교합니다.
```

### 11-3. H2 구조

```text
동탄 집값 최근 흐름
동탄 84㎡ 20억 실거래는 무엇을 의미할까?
20억 아파트 매수 시 필요한 현금
대출 10억·12억·15억이면 월 원리금은 얼마일까?
부부 실수령 800만·1,000만·1,200만 원이면 가능할까?
동탄 집값 급등 이유 5가지
동탄은 광교·영통·분당보다 비싸질까?
단기 과열 리스크
결론: 실거주 가능 가격 vs 투자 과열 가격
```

### 11-4. FAQPage 구조

FAQ는 JSON-LD에 포함한다.

질문:

1. 동탄 84㎡ 20억은 동탄 전체 평균 가격인가요?
2. 20억 아파트를 사려면 현금이 얼마 필요할까요?
3. 부부 실수령 1,000만 원이면 동탄 20억 아파트가 가능한가요?
4. 동탄이 광교나 분당보다 비싸질 수 있나요?
5. 지금 동탄은 과열인가요?

---

## 12. 등록 설계

### 12-1. `src/data/reports.ts`

추가 항목:

```ts
{
  slug: "dongtan-20-billion-apartment-affordability-2026",
  title: "동탄 20억 시대, 진짜 가능한 가격일까?",
  description: "동탄 84㎡ 20억 실거래가를 기준으로 필요 현금, 대출 월 원리금, 부부 실수령별 감당 가능성을 검증합니다.",
  order: 0,
  category: "부동산·내집마련",
  tags: ["동탄", "20억", "아파트", "대출", "실거주"],
  isNew: true,
}
```

실제 `reports.ts` 타입에 맞춰 필드명을 조정한다.

### 12-2. `src/styles/app.scss`

```scss
@use 'scss/pages/dongtan-20-billion-apartment-affordability-2026';
```

### 12-3. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/dongtan-20-billion-apartment-affordability-2026/</loc>
  <lastmod>2026-06-23</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.88</priority>
</url>
```

### 12-4. `src/pages/index.astro`

`topicBySlug`에 추가:

```ts
"dongtan-20-billion-apartment-affordability-2026": "부동산·내집마련",
```

---

## 13. 접근성 및 사용성

- KPI 카드와 표에는 `aria-label`을 부여한다.
- 테이블 헤더는 `<th scope="col">`, 첫 열은 `<th scope="row">` 사용.
- 색상만으로 위험도를 구분하지 않고 `빠듯`, `위험`, `매우 위험` 텍스트를 함께 표시.
- 모바일에서 표가 잘릴 경우 `.dt20-table-wrap`에 가로 스크롤을 제공한다.
- 모든 금액은 원 단위 대신 `억`, `만 원` 단위로 읽기 쉽게 표시.
- 문단은 길게 쓰지 않고 2~3문장 단위로 나눈다.

---

## 14. 콘텐츠 표현 가이드

### 사용 금지

- “동탄은 앞으로 더 오른다”
- “지금 사야 한다”
- “광교보다 낫다”
- “20억은 확정 시세다”
- “대출 15억 가능”
- “무조건 과열이다”

### 사용 권장

- “보도 기준”
- “실거래 확인 필요”
- “시뮬레이션 기준”
- “추정 월 원리금”
- “가구별 대출 가능액은 달라질 수 있음”
- “실거주 가능성은 월 현금흐름으로 판단”
- “투자 판단은 별도 리스크 검토 필요”

---

## 15. QA 체크리스트

구현 후 확인:

- [ ] `/reports/dongtan-20-billion-apartment-affordability-2026/` 페이지 생성
- [ ] `src/data/reports.ts` 등록
- [ ] `src/styles/app.scss` SCSS import 등록
- [ ] `public/sitemap.xml` URL 등록
- [ ] `src/pages/index.astro` 카테고리 등록
- [ ] `npm run build` 성공
- [ ] JSON-LD Article + FAQPage 유효
- [ ] 모든 추정값에 `추정`, `시뮬레이션`, `보도 기반` 배지 표시
- [ ] 모바일 375px에서 KPI/테이블/카드 겹침 없음
- [ ] 대출 10억·12억·15억 월 원리금 계산값 확인
- [ ] 부부 실수령 매트릭스 판정 텍스트 확인
- [ ] 관련 계산기 CTA 3개 모두 정상 링크

---

## 16. 구현 순서

1. `src/data/dongtan20BillionApartmentAffordability2026.ts` 생성
2. 계산 헬퍼와 상수 작성
3. 리포트 Astro 페이지 생성
4. SCSS 생성
5. `reports.ts`, `app.scss`, `sitemap.xml`, `index.astro` 등록
6. `npm run build`
7. 필요 시 Playwright 또는 브라우저로 모바일 레이아웃 확인

---

## 17. 최종 구현 방향

이 페이지는 “동탄 집값 뉴스”가 아니라 “20억 가격을 살 수 있는지 검증하는 계산형 리포트”다. 따라서 최상단부터 가격 전망보다 현금흐름을 보여줘야 한다.

가장 중요한 화면은 세 가지다.

1. 20억 매수에 필요한 현금
2. 대출 10억·12억·15억 월 원리금
3. 실수령 800만·1,000만·1,200만 원 가능성 매트릭스

이 세 영역이 명확하면 검색 유입 사용자가 바로 답을 얻고, 이후 GTX-A·삼성전자·반도체·매물 감소 같은 상승 이유와 광교·영통·분당 비교를 읽게 된다.
