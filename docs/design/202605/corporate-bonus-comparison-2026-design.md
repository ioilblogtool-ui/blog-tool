# 2026 대기업 성과급 완전 비교 — 설계 문서

> 기획 원문: `docs/plan/202605/corporate-bonus-comparison-2026.md`  
> 작성일: 2026-05-21  
> 콘텐츠 유형: `/reports/` 허브 리포트  
> 구현 기준: 대기업 성과급 산식, 확정/요구안/잠정합의 상태, 연봉별 체감액, 세후 주의, 회사별 계산기 CTA를 한 페이지에서 비교

---

## 1. 문서 개요

- 구현 대상: `2026 대기업 성과급 완전 비교`
- slug: `corporate-bonus-comparison-2026`
- URL: `/reports/corporate-bonus-comparison-2026/`
- 카테고리: 성과급 비교
- 핵심 검색 의도: "대기업 성과급 순위 2026", "삼성전자 SK하이닉스 성과급 비교", "현대차 성과급 요구안", "성과급 세후 실수령"
- 핵심 CTA:
  - `/tools/bonus-simulator/`
  - `/tools/samsung-bonus/`
  - `/tools/sk-hynix-bonus/`
  - `/tools/hyundai-bonus/`
- 안전 원칙: 노조 요구안, 회사 제시안, 잠정합의안, 확정 지급안, 컨센서스, 자체 시뮬레이션을 반드시 배지로 구분한다. 요구안 숫자를 확정 지급액처럼 표현하지 않는다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    corporateBonusComparison2026.ts   ← 회사별 성과급 구조, 배지, 시나리오, FAQ, 관련 링크
    reports.ts
  pages/
    reports/
      corporate-bonus-comparison-2026.astro

public/
  scripts/
    corporate-bonus-comparison-2026.js ← 연봉별 비교, 세후 워터폴, 회사 필터

src/styles/scss/pages/
  _corporate-bonus-comparison-2026.scss
```

추가 등록 필수:

- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/corporate-bonus-comparison-2026';`
- `public/sitemap.xml`

선택 등록:

- `src/pages/index.astro` 성과급 비교 추천 영역
- `src/pages/reports/index.astro` 최신 리포트 노출 확인
- `public/og/reports/corporate-bonus-comparison-2026.png` 또는 OG 생성 대상 추가

---

## 3. 레이아웃 방향

- 정적 리포트 페이지.
- 최상위 클래스: `report-page cbc-page`
- SCSS prefix: `cbc-`
- 허브 페이지이므로 회사별 상세 설명보다 `비교표 → 해석 → 개별 계산기 CTA` 전환을 우선한다.
- 결과성 숫자에는 항상 기준 라벨을 붙인다.
- Chart.js 사용 가능:
  - 연봉별 성과급 비교 막대 차트
  - 세전→세후 체감 워터폴 차트
  - 산업별 변동성 매트릭스
- Chart.js가 없어도 표와 카드로 핵심 정보가 전달되어야 한다.

권장 페이지 흐름:

```astro
<main class="report-page cbc-page">
  <Hero />
  <BadgeGuide />
  <SummaryCards />
  <CompanyComparison />
  <TermGuide />
  <CompanySections />
  <SalaryScenario />
  <TaxNotice />
  <CalculatorHub />
  <SeoContent />
</main>
```

---

## 4. 데이터 모델

파일: `src/data/corporateBonusComparison2026.ts`

```ts
export type BonusEvidenceBadge =
  | "확정"
  | "요구안"
  | "제시안"
  | "잠정합의"
  | "컨센서스"
  | "시뮬레이션"
  | "확인 필요";

export type BonusCompanyId = "integrated" | "samsung" | "skHynix" | "hyundai";
export type BonusIndustry = "semiconductor" | "auto" | "it" | "battery" | "finance" | "construction";
export type VolatilityLevel = "낮음" | "중간" | "높음" | "매우 높음";
export type Tone = "positive" | "neutral" | "caution";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url?: string;
  badge: BonusEvidenceBadge;
  asOf: string;
  note?: string;
}

export interface BonusSummaryCard {
  label: string;
  value: string;
  description: string;
  badge: BonusEvidenceBadge;
  tone: Tone;
}

export interface CorporateBonusCompany {
  id: BonusCompanyId;
  name: string;
  shortName: string;
  industry: BonusIndustry;
  primaryTerms: string[];
  latestStatus: BonusEvidenceBadge;
  headline: string;
  formulaSummary: string;
  key2026Point: string;
  volatility: VolatilityLevel;
  calculatorHref: string;
  ctaLabel: string;
  keyRisks: string[];
  sourceIds: string[];
}

export interface BonusTerm {
  term: string;
  companies: string;
  meaning: string;
  caution: string;
}

export interface SalaryBonusScenario {
  salary: number;
  salaryLabel: string;
  samsungBonus: number;
  skHynixBonus: number;
  hyundaiBonus: number;
  taxNote: string;
  badge: BonusEvidenceBadge;
}

export interface TaxWaterfallItem {
  label: string;
  amount: number;
  type: "gross" | "deduction" | "net";
  note: string;
}

export interface IndustryCycleItem {
  industry: BonusIndustry;
  label: string;
  mainVariable: string;
  volatility: VolatilityLevel;
  comment: string;
}

export interface CalculatorHubItem {
  label: string;
  href: string;
  description: string;
  badge: string;
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
export const CORPORATE_BONUS_META = {
  slug: "corporate-bonus-comparison-2026",
  title: "2026 대기업 성과급 완전 비교",
  description:
    "2026년 삼성전자, SK하이닉스, 현대자동차 등 주요 대기업 성과급 산식과 지급률, 노조 요구안, 확정 지급안, 세후 체감액을 비교합니다.",
  category: "성과급 비교",
  updatedAt: "2026-05-21",
};
```

### 5-2. 요약 카드

```ts
export const CBC_SUMMARY_CARDS: BonusSummaryCard[] = [
  {
    label: "비교 핵심",
    value: "기준급부터 확인",
    description: "성과급 지급률은 연봉 기준인지 기준급 기준인지에 따라 체감액이 크게 달라집니다.",
    badge: "확인 필요",
    tone: "neutral",
  },
  {
    label: "2026 검색 수요",
    value: "반도체 성과급",
    description: "SK하이닉스와 삼성전자 성과급 격차가 채용·이직 관심으로 이어지고 있습니다.",
    badge: "컨센서스",
    tone: "positive",
  },
  {
    label: "주의할 숫자",
    value: "노조 요구안",
    description: "요구안은 확정 지급안이 아니므로 별도 시나리오로만 다룹니다.",
    badge: "요구안",
    tone: "caution",
  },
  {
    label: "실수령 핵심",
    value: "세후 체감액",
    description: "고액 성과급은 근로소득 과세와 초과누진 구조 때문에 세전 금액과 차이가 큽니다.",
    badge: "시뮬레이션",
    tone: "caution",
  },
];
```

### 5-3. 회사 비교 데이터

```ts
export const CBC_COMPANIES: CorporateBonusCompany[] = [
  {
    id: "integrated",
    name: "대기업 성과급 시뮬레이터",
    shortName: "통합 비교",
    industry: "semiconductor",
    primaryTerms: ["총보상", "성과급", "시나리오"],
    latestStatus: "시뮬레이션",
    headline: "삼성전자·SK하이닉스·현대차 성과급을 한 화면에서 비교합니다.",
    formulaSummary: "회사별 계산기 기본값을 통합해 연봉·직급별 총보상 흐름을 비교합니다.",
    key2026Point: "개별 회사 계산기로 들어가기 전 비교 허브 역할",
    volatility: "높음",
    calculatorHref: "/tools/bonus-simulator/",
    ctaLabel: "4개 회사 성과급 한 번에 비교하기",
    keyRisks: ["회사별 기준급 차이", "세후 추정 차이", "시나리오 기본값 변동"],
    sourceIds: [],
  },
  {
    id: "samsung",
    name: "삼성전자",
    shortName: "삼성전자",
    industry: "semiconductor",
    primaryTerms: ["OPI", "TAI", "특별성과급"],
    latestStatus: "잠정합의",
    headline: "DS·DX 사업부별 성과급 체감 차이가 큽니다.",
    formulaSummary: "사업부 성과, 기준급, 특별성과급, 협의안 시나리오를 나눠 봅니다.",
    key2026Point: "영업이익 연동 요구안과 확정 지급안을 분리해야 합니다.",
    volatility: "매우 높음",
    calculatorHref: "/tools/samsung-bonus/",
    ctaLabel: "삼성전자 성과급 계산하기",
    keyRisks: ["사업부별 차이", "요구안과 확정안 혼재", "컨센서스 변동"],
    sourceIds: ["samsung-ir"],
  },
  {
    id: "skHynix",
    name: "SK하이닉스",
    shortName: "SK하이닉스",
    industry: "semiconductor",
    primaryTerms: ["PS", "PI"],
    latestStatus: "확정",
    headline: "PS·PI 구조와 영업이익 연동 재원이 핵심입니다.",
    formulaSummary: "기준급에 PS/PI 지급률을 적용하고 세후 체감액을 별도 확인합니다.",
    key2026Point: "고액 성과급은 세후 실수령 차이가 크게 발생할 수 있습니다.",
    volatility: "매우 높음",
    calculatorHref: "/tools/sk-hynix-bonus/",
    ctaLabel: "SK하이닉스 성과급 계산하기",
    keyRisks: ["기준급 산식", "고액 과세", "반도체 업황 민감도"],
    sourceIds: ["skhynix-ir"],
  },
  {
    id: "hyundai",
    name: "현대자동차",
    shortName: "현대차",
    industry: "auto",
    primaryTerms: ["성과급", "격려금", "자사주"],
    latestStatus: "요구안",
    headline: "임금협상 요구안과 확정 합의안을 구분해야 합니다.",
    formulaSummary: "기본급 인상, 성과급, 격려금, 자사주 패키지를 함께 봅니다.",
    key2026Point: "순이익 연동 성과급 요구안은 확정 지급안이 아닙니다.",
    volatility: "중간",
    calculatorHref: "/tools/hyundai-bonus/",
    ctaLabel: "현대차 성과급 계산하기",
    keyRisks: ["요구안 상태", "자사주 가치 변동", "노사 합의 변경"],
    sourceIds: ["hyundai-ir"],
  },
];
```

### 5-4. 용어 데이터

```ts
export const CBC_BONUS_TERMS: BonusTerm[] = [
  {
    term: "OPI",
    companies: "삼성전자",
    meaning: "사업부 성과 기반 연간 인센티브",
    caution: "사업부별 지급률 차이가 크고 매년 변동될 수 있습니다.",
  },
  {
    term: "TAI/PI",
    companies: "삼성전자",
    meaning: "목표 달성 또는 반기 성과 인센티브",
    caution: "연봉 기준이 아니라 월급·기준급 기준일 수 있습니다.",
  },
  {
    term: "PS",
    companies: "SK하이닉스",
    meaning: "초과이익분배금 성격의 성과급",
    caution: "기준급 산식과 지급률을 함께 확인해야 합니다.",
  },
  {
    term: "격려금",
    companies: "현대차 등",
    meaning: "실적·협상·특별 보상 성격의 지급액",
    caution: "정액, 주식, 상품권 등이 섞일 수 있습니다.",
  },
];
```

### 5-5. 연봉별 시나리오

```ts
export const CBC_SALARY_SCENARIOS: SalaryBonusScenario[] = [
  {
    salary: 70000000,
    salaryLabel: "연봉 7천만 원",
    samsungBonus: 0,
    skHynixBonus: 0,
    hyundaiBonus: 0,
    taxNote: "세후 금액은 개인 공제와 과세표준에 따라 달라집니다.",
    badge: "시뮬레이션",
  },
  {
    salary: 100000000,
    salaryLabel: "연봉 1억 원",
    samsungBonus: 0,
    skHynixBonus: 0,
    hyundaiBonus: 0,
    taxNote: "고액 성과급은 초과누진세율 영향이 커질 수 있습니다.",
    badge: "시뮬레이션",
  },
  {
    salary: 150000000,
    salaryLabel: "연봉 1.5억 원",
    samsungBonus: 0,
    skHynixBonus: 0,
    hyundaiBonus: 0,
    taxNote: "성과급이 총급여를 크게 끌어올려 연말정산 결과가 달라질 수 있습니다.",
    badge: "시뮬레이션",
  },
];
```

시나리오 금액은 구현 시 각 계산기 데이터와 연결해 산출한다. 고정값을 직접 박지 않는 편이 유지보수에 유리하다.

---

## 6. 페이지 IA

1. **Hero** — 제목, 서브카피, 통합 계산기 CTA
2. **배지 안내 패널** — 확정·요구안·잠정합의·컨센서스·시뮬레이션 의미
3. **핵심 요약 카드** — 기준급, 반도체 성과급, 요구안 주의, 세후 체감
4. **① 2026 대기업 성과급 이슈 한눈에 보기**
5. **② 회사별 성과급 요약 비교표**
6. **③ 성과급 용어 정리**
7. **④ 삼성전자 성과급 구조와 2026 체크포인트**
8. **⑤ SK하이닉스 성과급 구조와 2026 체크포인트**
9. **⑥ 현대자동차 성과급 구조와 2026 임협 체크포인트**
10. **⑦ 성과급 순위보다 중요한 총보상 비교법**
11. **⑧ 연봉 7천·1억·1.5억 기준 성과급 체감액**
12. **⑨ 세금 때문에 달라지는 실수령 체감**
13. **⑩ 반도체 vs 자동차 성과급 사이클**
14. **⑪ 취준생·이직자 관점의 성과급 해석법**
15. **⑫ 성과급 협의안 읽는 법**
16. **⑬ 관련 계산기 CTA 허브**
17. **⑭ 2027 전망 및 업데이트 전략**
18. **FAQ / SeoContent**

---

## 7. 주요 마크업 설계

### 7-1. 데이터 주입

```astro
<script
  id="cbcData"
  type="application/json"
  set:html={JSON.stringify({
    companies: CBC_COMPANIES,
    terms: CBC_BONUS_TERMS,
    salaryScenarios: CBC_SALARY_SCENARIOS,
    industryCycles: CBC_INDUSTRY_CYCLES,
    calculators: CBC_CALCULATOR_HUB,
  })}
/>
<script src="/scripts/corporate-bonus-comparison-2026.js" defer></script>
```

### 7-2. Hero

```astro
<section class="cbc-hero">
  <p class="cbc-eyebrow">2026 성과급 비교 허브</p>
  <h1>2026 대기업 성과급 완전 비교</h1>
  <p>
    삼성전자, SK하이닉스, 현대자동차 등 주요 대기업의 성과급 산식과 지급 기준,
    노조 요구안, 확정 지급률, 세후 체감액을 한 번에 비교합니다.
  </p>
  <a class="cbc-primary-cta" href="/tools/bonus-simulator/">
    내 연봉 기준 성과급 비교하기
  </a>
</section>
```

### 7-3. 배지 안내

```astro
<section class="cbc-badge-guide" aria-labelledby="cbc-badge-title">
  <h2 id="cbc-badge-title">숫자 상태 먼저 확인하세요</h2>
  <div class="cbc-badge-grid">
    <span class="cbc-badge cbc-badge--confirmed">확정</span>
    <span class="cbc-badge cbc-badge--proposal">요구안</span>
    <span class="cbc-badge cbc-badge--tentative">잠정합의</span>
    <span class="cbc-badge cbc-badge--consensus">컨센서스</span>
    <span class="cbc-badge cbc-badge--simulation">시뮬레이션</span>
  </div>
  <p>요구안과 컨센서스는 확정 지급액이 아니며, 계산기에서는 별도 시나리오로만 다룹니다.</p>
</section>
```

### 7-4. 회사 비교표

```astro
<section class="cbc-section" aria-labelledby="cbc-company-title">
  <div class="cbc-section-heading">
    <p>② 회사별 비교</p>
    <h2 id="cbc-company-title">회사별 성과급 요약 비교표</h2>
  </div>
  <div class="cbc-table-wrap">
    <table class="cbc-company-table">
      <thead>
        <tr>
          <th>회사</th>
          <th>핵심 제도</th>
          <th>상태</th>
          <th>2026 체크포인트</th>
          <th>계산기</th>
        </tr>
      </thead>
      <tbody>
        {CBC_COMPANIES.map((company) => (
          <tr>
            <th>{company.shortName}</th>
            <td>{company.primaryTerms.join(", ")}</td>
            <td><span class={`cbc-badge cbc-badge--${company.latestStatus}`}>{company.latestStatus}</span></td>
            <td>{company.key2026Point}</td>
            <td><a href={company.calculatorHref}>{company.ctaLabel}</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 7-5. 회사별 상세 CTA

```astro
<article class="cbc-company-card">
  <div>
    <span class="cbc-badge">잠정합의</span>
    <h3>삼성전자 성과급 구조</h3>
    <p>DS·DX 사업부별 성과급 체감 차이와 협의안 시나리오를 분리해 봅니다.</p>
  </div>
  <a href="/tools/samsung-bonus/">삼성전자 성과급 계산하기</a>
</article>
```

### 7-6. 계산기 허브

```astro
<section class="cbc-calculator-hub" aria-labelledby="cbc-calculator-title">
  <h2 id="cbc-calculator-title">내 조건으로 직접 계산하기</h2>
  <div class="cbc-calculator-grid">
    {CBC_CALCULATOR_HUB.map((item) => (
      <a class="cbc-calculator-card" href={item.href}>
        <span>{item.badge}</span>
        <strong>{item.label}</strong>
        <p>{item.description}</p>
      </a>
    ))}
  </div>
</section>
```

---

## 8. 차트·스크립트 설계

파일: `public/scripts/corporate-bonus-comparison-2026.js`

### 8-1. 책임

- 연봉별 성과급 비교 차트 렌더링
- 세전→세후 참고 워터폴 렌더링
- 회사별 비교 카드 필터 또는 강조
- 모바일에서 표 보조 카드 생성이 필요하면 JS로 보강
- Chart.js 미로드 시 표만 유지

### 8-2. 기본 구조

```js
(function () {
  const dataNode = document.getElementById("cbcData");
  if (!dataNode) return;

  const seed = JSON.parse(dataNode.textContent || "{}");
  const formatWon = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;

  function renderSalaryScenarioChart() {}
  function renderTaxWaterfallChart() {}
  function bindCompanyHighlight() {}
  function bindSalaryScenarioTabs() {}

  renderSalaryScenarioChart();
  renderTaxWaterfallChart();
  bindCompanyHighlight();
  bindSalaryScenarioTabs();
})();
```

### 8-3. 세후 참고 계산

v1에서는 정교한 세금 계산기를 구현하지 않는다. 세후 워터폴은 `참고용`으로만 표시한다.

```js
function estimateBonusNet(grossBonus, effectiveTaxRate) {
  return Math.max(0, grossBonus * (1 - effectiveTaxRate));
}
```

권장 문구:

```text
세후 금액은 단순 참고값입니다. 실제 원천징수와 연말정산 결과는 총급여, 가족공제, 비과세, 4대보험 정산에 따라 달라집니다.
```

### 8-4. 인터랙션 셀렉터

```text
data-cbc-company
data-cbc-salary
data-cbc-scenario
data-cbc-badge
cbc-salary-chart
cbc-tax-waterfall-chart
```

---

## 9. SCSS 설계

파일: `src/styles/scss/pages/_corporate-bonus-comparison-2026.scss`

### 주요 클래스

```scss
.cbc-page {}
.cbc-hero {}
.cbc-eyebrow {}
.cbc-primary-cta {}
.cbc-badge-guide {}
.cbc-badge-grid {}
.cbc-badge {}
.cbc-summary-grid {}
.cbc-summary-card {}
.cbc-section {}
.cbc-section-heading {}
.cbc-table-wrap {}
.cbc-company-table {}
.cbc-term-grid {}
.cbc-term-card {}
.cbc-company-grid {}
.cbc-company-card {}
.cbc-scenario-tabs {}
.cbc-chart-wrap {}
.cbc-tax-notice {}
.cbc-cycle-matrix {}
.cbc-checklist {}
.cbc-calculator-hub {}
.cbc-calculator-grid {}
.cbc-calculator-card {}
.cbc-source-list {}
```

### 디자인 규칙

- 카드 반경은 8px 이하를 기본으로 한다.
- 배지는 색상뿐 아니라 텍스트로 상태를 명확히 표시한다.
- 요구안·시뮬레이션 배지는 확정 배지보다 시각적으로 차분하게 둔다.
- 표가 많은 리포트이므로 행간과 구분선을 충분히 확보한다.
- 회사별 CTA 카드는 같은 높이를 유지한다.
- 큰 숫자는 줄바꿈을 허용해 모바일에서 넘치지 않게 한다.
- 성과급 금액은 `세전`, `세후 참고`, `연봉 대비`를 한 카드 안에서 혼동하지 않게 분리한다.

### 반응형

- 1024px 이상: 요약 카드 4열, 계산기 CTA 4열
- 768px 이하: 요약 카드 2열, 회사 CTA 2열
- 560px 이하: 요약 카드 1열, 표는 카드형 또는 가로 스크롤

---

## 10. SEO 설계

### 메타

- title: `2026 대기업 성과급 완전 비교 | 삼성전자·SK하이닉스·현대차 성과급 순위`
- description: `2026년 삼성전자, SK하이닉스, 현대자동차 등 주요 대기업 성과급 산식과 지급률, 노조 요구안, 확정 지급안, 세후 체감액을 비교합니다.`
- canonical: `/reports/corporate-bonus-comparison-2026/`

### H 태그

- H1: `2026 대기업 성과급 완전 비교`
- H2: 14개 주요 섹션
- H3: 회사별 상세, 용어, 세후, CTA 하위 항목

### 구조화 데이터

- `Article`
- `FAQPage`
- `ItemList` — 관련 계산기 4개 목록

FAQPage는 화면 FAQ와 동일한 문구만 사용한다.

---

## 11. SeoContent / FAQ 설계

### SeoContent 구성

```ts
const seoContent = {
  intro: [
    "대기업 성과급은 회사별 headline만 보면 비교가 쉬워 보이지만 실제 체감액은 기준급, 사업부, 지급률, 세금, 확정 상태에 따라 크게 달라집니다.",
    "이 리포트는 삼성전자, SK하이닉스, 현대자동차 성과급 구조를 한 페이지에서 비교하고, 개별 계산기로 개인 조건별 예상액을 확인할 수 있도록 구성했습니다.",
  ],
  criteria: [
    "노조 요구안과 확정 지급안은 반드시 분리합니다.",
    "세후 금액은 참고값으로만 안내합니다.",
    "연봉과 기준급이 다른 회사는 지급률만으로 순위를 매기지 않습니다.",
    "개별 회사 계산기에서 사업부·직급·시나리오를 다시 확인하게 연결합니다.",
  ],
};
```

### FAQ

```ts
export const CBC_FAQ: FaqItem[] = [
  {
    question: "2026년 대기업 성과급 순위는 어떻게 봐야 하나요?",
    answer:
      "확정 지급액, 노조 요구안, 증권사 컨센서스, 자체 시뮬레이션을 분리해서 봐야 합니다. 단순 순위보다 기준급과 세후 체감액이 중요합니다.",
  },
  {
    question: "삼성전자와 SK하이닉스 성과급은 왜 차이가 크나요?",
    answer:
      "사업 구조, 반도체 실적, 성과급 산식, 기준급 구조가 다르기 때문입니다. 삼성전자는 사업부별 차이가 크고, SK하이닉스는 PS·PI 구조와 영업이익 연동성이 핵심입니다.",
  },
  {
    question: "현대차 노조 성과급 30% 요구안은 확정인가요?",
    answer:
      "요구안은 확정 지급안이 아닙니다. 회사 제시안, 잠정합의안, 최종 확정안을 구분해서 봐야 합니다.",
  },
  {
    question: "성과급은 세금이 얼마나 빠지나요?",
    answer:
      "성과급은 근로소득으로 과세됩니다. 고액 성과급은 총급여와 과세표준을 끌어올려 체감 세율이 높아질 수 있으므로 세후 금액은 참고값으로만 봐야 합니다.",
  },
  {
    question: "평균연봉에 성과급이 포함되나요?",
    answer:
      "자료마다 다릅니다. 사업보고서 평균보수, 채용공고, 언론 기사, 커뮤니티 체감치는 포함 범위가 다를 수 있어 기준을 확인해야 합니다.",
  },
  {
    question: "이직할 때 성과급 많은 회사만 보면 되나요?",
    answer:
      "고정연봉, 성과급 변동성, 사업부 배치 가능성, 직무 전망, 세후 체감액을 함께 봐야 합니다.",
  },
];
```

---

## 12. 계산기 허브 링크

```ts
export const CBC_CALCULATOR_HUB: CalculatorHubItem[] = [
  {
    label: "대기업 성과급 시뮬레이터",
    href: "/tools/bonus-simulator/",
    description: "삼성전자·SK하이닉스·현대차 성과급을 한 화면에서 비교합니다.",
    badge: "통합 비교",
  },
  {
    label: "삼성전자 성과급 협의안 계산기",
    href: "/tools/samsung-bonus/",
    description: "DS·DX 사업부와 협의안 시나리오별 성과급을 계산합니다.",
    badge: "삼성전자",
  },
  {
    label: "SK하이닉스 성과급 계산기",
    href: "/tools/sk-hynix-bonus/",
    description: "PS·PI 기준 성과급과 총보상 체감액을 계산합니다.",
    badge: "SK하이닉스",
  },
  {
    label: "현대자동차 성과급 계산기",
    href: "/tools/hyundai-bonus/",
    description: "성과급, 격려금, 자사주 포함 총보상을 계산합니다.",
    badge: "현대차",
  },
];
```

---

## 13. 출처 목록 설계

```ts
export const CBC_SOURCES: SourceInfo[] = [
  {
    id: "samsung-ir",
    label: "삼성전자 IR",
    organization: "삼성전자",
    url: "https://www.samsung.com/sec/ir/",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "사업보고서와 실적 자료 확인용",
  },
  {
    id: "skhynix-ir",
    label: "SK하이닉스 IR",
    organization: "SK하이닉스",
    url: "https://www.skhynix.com/ir",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "실적과 사업보고서 확인용",
  },
  {
    id: "hyundai-ir",
    label: "현대자동차 IR",
    organization: "현대자동차",
    url: "https://www.hyundai.com/worldwide/ko/company/ir",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "실적과 사업보고서 확인용",
  },
  {
    id: "nts-earned-income",
    label: "근로소득 원천징수·연말정산",
    organization: "국세청",
    url: "https://www.nts.go.kr/",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "성과급 과세 구조 확인용",
  },
];
```

언론 기사 출처는 구현 직전 최신 보도를 다시 확인해 회사별 데이터에 연결한다.

---

## 14. 리포트 등록 예시

`src/data/reports.ts`

```ts
{
  slug: "corporate-bonus-comparison-2026",
  title: "2026 대기업 성과급 완전 비교",
  description:
    "2026년 삼성전자, SK하이닉스, 현대자동차 등 주요 대기업 성과급 산식과 지급률, 노조 요구안, 확정 지급안, 세후 체감액을 비교합니다.",
  category: "성과급 비교",
  href: "/reports/corporate-bonus-comparison-2026/",
  badges: ["성과급", "삼성전자", "SK하이닉스", "현대차"],
}
```

`src/styles/app.scss`

```scss
@use 'scss/pages/corporate-bonus-comparison-2026';
```

`public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/corporate-bonus-comparison-2026/</loc>
</url>
```

---

## 15. QA 체크리스트

- [ ] `/reports/corporate-bonus-comparison-2026/` 페이지가 정상 렌더링된다.
- [ ] `src/data/reports.ts` 등록 후 `/reports/` 목록에 노출된다.
- [ ] `src/styles/app.scss`에 전용 SCSS가 연결되어 있다.
- [ ] `public/sitemap.xml`에 URL이 추가되어 있다.
- [ ] 14개 섹션이 모두 본문에 반영된다.
- [ ] `확정`, `요구안`, `잠정합의`, `컨센서스`, `시뮬레이션` 배지가 구분된다.
- [ ] 노조 요구안을 확정 지급액처럼 표현하지 않는다.
- [ ] 개별 회사 계산기 4개가 모두 연결되어 있다.
- [ ] 세후 금액은 참고값으로만 안내한다.
- [ ] 삼성전자 사업부별 편차를 단일값으로 뭉개지 않는다.
- [ ] SK하이닉스 성과급은 기준급 산식과 세금 주의를 함께 설명한다.
- [ ] 현대차 임협 요구안은 요구안·합의안 상태를 분리한다.
- [ ] Chart.js가 없어도 표와 카드로 핵심 정보가 전달된다.
- [ ] 모바일 360px 폭에서 표, CTA 카드, 숫자 텍스트가 겹치지 않는다.
- [ ] FAQ 구조화 데이터와 화면 FAQ 문구가 일치한다.
- [ ] `npm run build`가 성공한다.

---

## 16. v1 / v2 범위

### v1

- 정적 리포트 페이지
- 배지 기반 회사 비교표
- 성과급 용어 정리
- 회사별 상세 해설과 계산기 CTA
- 연봉별 시뮬레이션 표
- 세후 체감 주의 섹션
- 산업별 변동성 매트릭스
- FAQ와 SeoContent

### v2

- 개별 계산기 데이터와 연봉별 시나리오 자동 동기화
- 성과급 세후 실수령액 계산기 연동
- 회사별 뉴스 업데이트 타임라인
- 증권사 컨센서스 변화에 따른 성과급 민감도 차트
- 사용자 입력 연봉으로 리포트 내 미니 비교

---

## 17. 구현 메모

이 페이지는 성과급 계산기 4개를 묶는 허브이므로, 본문에서 너무 많은 계산을 직접 끝내려 하지 않는다. 사용자가 “내 조건이면 얼마지?”라고 느끼는 순간 바로 개별 계산기로 이동할 수 있어야 한다.

첫 화면에서는 큰 금액보다 `숫자 상태`를 먼저 보여주는 편이 안전하다. `확정`, `요구안`, `잠정합의`, `컨센서스`, `시뮬레이션` 배지를 이해시키면 이후 회사별 성과급 비교에서도 오해가 줄어든다.
