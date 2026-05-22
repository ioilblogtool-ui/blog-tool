# 2026 1인 가구 생활비 완전 해부 — 설계 문서

- 기획 문서: `docs/plan/202605/single-household-living-cost-2026.md`
- 작성일: 2026-05-20
- 구현 경로: `/reports/single-household-living-cost-2026/`
- 콘텐츠 유형: 심층 리포트
- 카테고리: 생활비절약
- 핵심 키워드: `1인 가구 월 생활비 평균 2026`
- 핵심 CTA: `/tools/delivery-vs-cooking-cost/`

---

## 1. 구현 목표

2026년 기준 1인 가구 월 생활비를 주거비·식비·통신비·교통비·구독료·보험료 등 항목별로 분해하고, 연령대·지역·예산 성향별로 비교할 수 있는 고밀도 리포트 페이지를 구현한다.

이 페이지는 단순 정보형 글이 아니라 다음 역할을 동시에 수행해야 한다.

- 검색 유입: `1인 가구 월 생활비 평균`, `혼자 살기 생활비`, `자취 생활비` 계열 롱테일 대응
- 반복 방문: 예산 시나리오·절약 체크리스트·관련 계산기 CTA 제공
- 내부 연결: `배달 vs 직접 요리 비용 계산기`, 생활비 절약 리포트군으로 이동
- 제휴 수익화: 통신비·구독·보험·신용카드·배달/장보기 서비스 배너 삽입 여지 확보

---

## 2. 설계 원칙

### 데이터 표기

- 공식 통계, 민간 리포트, 추정값, 시뮬레이션값을 배지로 분리한다.
- 2026년 수치가 확정 통계가 아닌 경우 `추정`, `시뮬레이션`, `민간 리포트` 배지를 반드시 붙인다.
- 월 생활비 총액은 단일 정답처럼 제시하지 않고 `절약형`, `평균형`, `여유형` 범위로 제시한다.
- 지역별 주거비는 보증금·월세·관리비 조건 차이가 크므로 비교표 하단에 주의 문구를 둔다.

### 사용자 경험

- 첫 화면에서 월 생활비 총액, 가장 큰 지출 항목, 절약 가능 항목을 즉시 파악하게 한다.
- 차트는 보조 수단으로 사용하고, 모든 수치는 표와 카드로도 접근 가능해야 한다.
- 모바일에서는 차트보다 요약 카드와 표의 가독성을 우선한다.
- 관련 계산기 CTA는 본문 중간과 하단에 2회 배치한다.

---

## 3. 파일 구조

```text
src/
  data/
    reports.ts
    singleHouseholdLivingCost2026.ts
  pages/
    reports/
      single-household-living-cost-2026.astro
  styles/
    app.scss
    scss/
      pages/
        _single-household-living-cost-2026.scss
public/
  scripts/
    single-household-living-cost-2026.js
  sitemap.xml
```

### 등록 필요 파일

- `src/data/reports.ts`: 리포트 메타 등록
- `src/styles/app.scss`: 페이지 SCSS `@use` 추가
- `public/sitemap.xml`: 리포트 URL 추가
- 필요 시 `src/pages/reports/index.astro`: 리포트 목록 노출 확인
- 필요 시 `src/pages/index.astro`: 메인 최신 콘텐츠 노출 확인

---

## 4. 데이터 모델

`src/data/singleHouseholdLivingCost2026.ts`

```ts
export type SourceType = "official" | "private" | "estimate" | "simulation";
export type LivingCostCategory =
  | "housing"
  | "food"
  | "telecom"
  | "transport"
  | "subscription"
  | "insuranceMedical"
  | "leisure"
  | "householdGoods"
  | "savingBuffer";

export type AgeGroup = "20s" | "30s" | "40s";
export type RegionCode = "seoul" | "capital" | "metro" | "local";
export type BudgetType = "saving" | "average" | "comfortable";

export interface SourceInfo {
  label: string;
  organization: string;
  url?: string;
  sourceType: SourceType;
  asOf: string;
  note?: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  sourceType: SourceType;
}

export interface CostItem {
  category: LivingCostCategory;
  label: string;
  monthlyAmount: number;
  share: number;
  rangeText: string;
  sourceType: SourceType;
  note: string;
}

export interface BudgetScenario {
  type: BudgetType;
  label: string;
  monthlyTotal: number;
  housing: number;
  food: number;
  telecomSubscription: number;
  transport: number;
  insuranceMedical: number;
  leisure: number;
  buffer: number;
  description: string;
}

export interface AgeMatrixRow {
  ageGroup: AgeGroup;
  label: string;
  mainPressure: string;
  typicalMonthlyRange: string;
  savingFocus: string;
  riskNote: string;
}

export interface RegionHousingCost {
  region: RegionCode;
  label: string;
  rentRange: string;
  managementFeeRange: string;
  totalHousingRange: string;
  note: string;
}

export interface SavingAction {
  id: string;
  label: string;
  category: LivingCostCategory;
  monthlySaving: number;
  difficulty: "easy" | "normal" | "hard";
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}
```

---

## 5. 상수 설계

### 메타

```ts
export const SHLC_META = {
  slug: "single-household-living-cost-2026",
  title: "2026 1인 가구 생활비 완전 해부",
  description:
    "2026년 1인 가구 월 생활비를 주거비·식비·통신비·구독료·보험료까지 항목별로 분석합니다.",
  category: "생활비절약",
  keyword: "1인 가구 월 생활비 평균 2026",
  updatedAt: "2026-05-20",
};
```

### 주요 데이터 세트

- `SHLC_SUMMARY_CARDS`: 월 평균 생활비, 최대 지출 항목, 절약 가능 항목, 예산 점검 포인트
- `SHLC_COST_ITEMS`: 항목별 월 지출액과 비중
- `SHLC_BUDGET_SCENARIOS`: 절약형·평균형·여유형 예산
- `SHLC_AGE_MATRIX`: 20대·30대·40대 유불리 매트릭스
- `SHLC_REGION_HOUSING`: 서울·수도권·광역시·지방 주거비 범위
- `SHLC_SAVING_ACTIONS`: 생활비 줄이는 TOP 10
- `SHLC_FAQ`: FAQ
- `SHLC_RELATED_LINKS`: 내부 링크
- `SHLC_SOURCE_LINKS`: 출처 후보

### 예산 시나리오 예시

```ts
export const SHLC_BUDGET_SCENARIOS: BudgetScenario[] = [
  {
    type: "saving",
    label: "절약형",
    monthlyTotal: 1450000,
    housing: 620000,
    food: 360000,
    telecomSubscription: 90000,
    transport: 90000,
    insuranceMedical: 110000,
    leisure: 90000,
    buffer: 90000,
    description: "고정비를 낮추고 배달·구독·여가 지출을 엄격히 관리하는 예산입니다.",
  },
  {
    type: "average",
    label: "평균형",
    monthlyTotal: 1900000,
    housing: 780000,
    food: 520000,
    telecomSubscription: 130000,
    transport: 130000,
    insuranceMedical: 150000,
    leisure: 140000,
    buffer: 50000,
    description: "월세와 식비가 전체 지출을 좌우하는 일반적인 1인 가구 예산입니다.",
  },
  {
    type: "comfortable",
    label: "여유형",
    monthlyTotal: 2550000,
    housing: 1050000,
    food: 720000,
    telecomSubscription: 180000,
    transport: 190000,
    insuranceMedical: 190000,
    leisure: 220000,
    buffer: 0,
    description: "입지·외식·구독·여가 선택지가 넓은 대신 저축 여력이 줄어드는 예산입니다.",
  },
];
```

위 수치는 설계용 예시다. 구현 전 최신 통계·민간 리포트 기준으로 교체하고, 확정 통계가 아닌 값에는 `추정` 또는 `시뮬레이션` 배지를 붙인다.

---

## 6. 페이지 정보 구조

`src/pages/reports/single-household-living-cost-2026.astro`

### 1. 히어로

- H1: `2026 1인 가구 생활비 완전 해부`
- 서브카피: 주거비·식비·통신비·구독료·보험료까지 월 생활비를 항목별로 분해한다.
- 핵심 요약 카드 4개
- 데이터 기준일, 출처 배지, 추정값 안내

### 2. 1인 가구 증가 트렌드와 2026 물가 환경

- 1인 가구 증가 추세
- 고정비 상승 압력
- 식비·구독료·교통비 체감 물가

### 3. 월 평균 생활비 총액 현황

- 전체 월 생활비 범위
- 절약형·평균형·여유형 비교
- 공식 통계와 체감 예산의 차이 설명

### 4. 항목별 지출 비중 파이차트

- 주거비
- 식비
- 통신비·구독료
- 교통비
- 의료·보험
- 여가·자기계발

### 5. 주거비 비교

- 월세·관리비·공과금 구분
- 서울·수도권·광역시·지방 비교
- 보증금 조건 차이 주의 문구

### 6. 식비 분석

- 장보기
- 배달
- 외식
- 혼밥·맞벌이·자취생 시나리오
- `배달 vs 직접 요리 비용 계산기` CTA

### 7. 통신비·구독료

- 통신요금
- OTT
- 음악·클라우드·멤버십
- 구독 다이어트 체크리스트

### 8. 교통비

- 대중교통
- 자가용
- 택시·공유 이동
- 지역별 이동 패턴 차이

### 9. 의료·보험

- 실손보험
- 건강관리비
- 비정기 의료비 예비비
- 실손보험 관련 리포트 내부 링크

### 10. 여가·자기계발

- 운동
- 취미
- 교육
- 인간관계 지출

### 11. 연령대별 생활비 매트릭스

- 20대: 주거비·초기 정착비 부담
- 30대: 보험·저축·자기계발 지출 확대
- 40대: 건강·부모 지원·차량 지출 가능성

### 12. 예산 시나리오

- 절약형
- 평균형
- 여유형
- 월 소득 대비 생활비 비율 안내

### 13. 생활비 줄이는 TOP 10

- 체크박스형 절약 액션
- 월 절약 예상액 합계
- 실행 난이도 표시

### 14. 관련 계산기 CTA

- 배달 vs 직접 요리 비용 계산기
- 실손보험 환급액 계산기
- 대출 갈아타기 계산기

### 15. 2026 생활물가 전망 및 전문가 조언

- 고정비 우선 관리
- 식비·구독비 월 단위 점검
- 연 1회 보험·통신·대출 리밸런싱

---

## 7. 마크업 설계

### 최상위 클래스

```astro
<main class="report-page shlc-page">
```

페이지 전용 클래스 접두사는 `shlc-`를 사용한다.

### 데이터 주입

```astro
<script
  id="shlcData"
  type="application/json"
  set:html={JSON.stringify({
    costItems: SHLC_COST_ITEMS,
    budgetScenarios: SHLC_BUDGET_SCENARIOS,
    regionHousing: SHLC_REGION_HOUSING,
    savingActions: SHLC_SAVING_ACTIONS,
  })}
/>
<script src="/scripts/single-household-living-cost-2026.js" defer></script>
```

### 요약 카드

```astro
<section class="shlc-summary" aria-labelledby="shlc-summary-title">
  <h2 id="shlc-summary-title">2026년 1인 가구 생활비 핵심 요약</h2>
  <div class="shlc-summary-grid">
    {SHLC_SUMMARY_CARDS.map((card) => (
      <article class="shlc-summary-card">
        <span class={`shlc-badge shlc-badge--${card.sourceType}`}>{card.sourceType}</span>
        <strong>{card.value}</strong>
        <p>{card.label}</p>
        <small>{card.description}</small>
      </article>
    ))}
  </div>
</section>
```

### 항목별 지출 표

```astro
<section class="shlc-breakdown" aria-labelledby="shlc-breakdown-title">
  <div class="shlc-section-heading">
    <h2 id="shlc-breakdown-title">항목별 월 생활비 비중</h2>
    <p>주거비와 식비가 대부분의 1인 가구 예산을 좌우합니다.</p>
  </div>
  <div class="shlc-chart-table">
    <div class="shlc-chart-wrap">
      <canvas id="shlcCostDonut" aria-label="항목별 지출 비중 차트"></canvas>
    </div>
    <table>
      <thead>
        <tr>
          <th>항목</th>
          <th>월 지출</th>
          <th>비중</th>
          <th>메모</th>
        </tr>
      </thead>
      <tbody>
        {SHLC_COST_ITEMS.map((item) => (
          <tr>
            <th>{item.label}</th>
            <td>{item.monthlyAmount.toLocaleString("ko-KR")}원</td>
            <td>{item.share}%</td>
            <td>{item.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
```

### 예산 시나리오 탭

```astro
<section class="shlc-scenarios" aria-labelledby="shlc-scenarios-title">
  <h2 id="shlc-scenarios-title">절약형·평균형·여유형 월 예산</h2>
  <div class="shlc-segmented" role="tablist" aria-label="예산 시나리오">
    {SHLC_BUDGET_SCENARIOS.map((scenario, index) => (
      <button
        type="button"
        role="tab"
        aria-selected={index === 1 ? "true" : "false"}
        data-shlc-budget={scenario.type}
      >
        {scenario.label}
      </button>
    ))}
  </div>
  <div id="shlcBudgetPanel" class="shlc-budget-panel"></div>
  <canvas id="shlcBudgetChart" aria-label="예산 시나리오별 지출 구성 차트"></canvas>
</section>
```

### 절약 체크리스트

```astro
<section class="shlc-saving" aria-labelledby="shlc-saving-title">
  <h2 id="shlc-saving-title">생활비 줄이는 TOP 10</h2>
  <div class="shlc-saving-layout">
    <ul class="shlc-saving-list">
      {SHLC_SAVING_ACTIONS.map((action) => (
        <li>
          <label>
            <input type="checkbox" data-shlc-saving={action.id} />
            <span>{action.label}</span>
            <strong>월 {action.monthlySaving.toLocaleString("ko-KR")}원</strong>
          </label>
        </li>
      ))}
    </ul>
    <aside class="shlc-saving-result">
      <span>선택한 절약 예상액</span>
      <strong id="shlcSavingTotal">0원</strong>
    </aside>
  </div>
</section>
```

---

## 8. 차트 및 스크립트 설계

`public/scripts/single-household-living-cost-2026.js`

### 책임

- JSON 데이터 파싱
- 항목별 도넛 차트 렌더링
- 지역별 주거비 막대 차트 렌더링
- 예산 시나리오 탭 전환
- 절약 체크리스트 합계 계산
- Chart.js 미로드 시 정적 표만 유지

### 기본 구조

```js
(function () {
  const dataNode = document.getElementById("shlcData");
  if (!dataNode) return;

  const seed = JSON.parse(dataNode.textContent || "{}");
  const formatWon = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;

  function renderCostDonut() {}
  function renderRegionHousingChart() {}
  function renderBudgetScenario(type) {}
  function bindBudgetTabs() {}
  function bindSavingChecklist() {}

  renderCostDonut();
  renderRegionHousingChart();
  bindBudgetTabs();
  bindSavingChecklist();
})();
```

### 상호작용

- `[data-shlc-budget]`: 절약형·평균형·여유형 예산 패널 전환
- `[data-shlc-saving]`: 선택한 절약 액션의 월 절약액 합산
- `[data-shlc-region]`: 지역별 주거비 표 하이라이트가 필요할 경우 사용
- `[data-shlc-age]`: 연령대별 매트릭스 필터가 필요할 경우 사용

### 접근성

- 탭 버튼은 `role="tab"`과 `aria-selected`를 갱신한다.
- 차트 정보는 표로도 제공한다.
- 체크박스 결과는 `aria-live="polite"` 영역에 반영한다.

---

## 9. 스타일 설계

`src/styles/scss/pages/_single-household-living-cost-2026.scss`

### 주요 클래스

```scss
.shlc-page {}
.shlc-hero {}
.shlc-summary {}
.shlc-summary-grid {}
.shlc-summary-card {}
.shlc-badge {}
.shlc-section-heading {}
.shlc-chart-table {}
.shlc-chart-wrap {}
.shlc-cost-table {}
.shlc-region-grid {}
.shlc-matrix {}
.shlc-scenarios {}
.shlc-segmented {}
.shlc-budget-panel {}
.shlc-saving {}
.shlc-saving-list {}
.shlc-saving-result {}
.shlc-cta-band {}
.shlc-source-list {}
```

### 디자인 방향

- 반경은 기존 시스템과 충돌하지 않는 범위에서 8px 이하를 기본으로 한다.
- 카드 안에 카드가 들어가는 구조는 피한다.
- 표는 모바일에서 가로 스크롤보다 핵심 컬럼 우선 노출을 검토한다.
- 차트 영역은 고정 높이와 `min-height`를 지정해 레이아웃 흔들림을 막는다.
- 배지 색상은 데이터 출처 유형별로 구분한다.

### 반응형

- 1024px 이상: 요약 카드 4열, 차트+표 2열
- 768px 이하: 요약 카드 2열, 차트와 표 세로 배치
- 560px 이하: 요약 카드 1열, CTA 버튼 전체 폭

---

## 10. SEO 설계

### 메타

- Title: `2026 1인 가구 생활비 완전 해부 | 월 평균 지출·항목별 예산 비교`
- Description: `2026년 1인 가구 월 생활비를 주거비, 식비, 통신비, 교통비, 구독료, 보험료까지 항목별로 분석하고 절약형·평균형·여유형 예산을 비교합니다.`
- Canonical: `/reports/single-household-living-cost-2026/`

### H 태그

- H1: `2026 1인 가구 생활비 완전 해부`
- H2: 14개 주요 섹션
- H3: 표·차트·시나리오 하위 설명

### 구조화 데이터

- `Article`
- `FAQPage`

FAQPage는 실제 화면 FAQ와 동일한 문구만 사용한다.

---

## 11. SeoContent 초안

```ts
const seoContent = {
  intro: [
    "1인 가구 생활비는 월세와 식비만으로 설명하기 어렵습니다. 통신비, 구독료, 보험료, 교통비처럼 매달 자동으로 빠져나가는 고정비가 누적되면 실제 체감 지출은 예상보다 커질 수 있습니다.",
    "이 리포트는 2026년 기준 1인 가구의 월 생활비를 항목별로 나누고, 절약형·평균형·여유형 예산을 비교해 자신의 지출 구조를 점검할 수 있도록 구성했습니다.",
  ],
  criteria: [
    "주거비는 월세, 관리비, 공과금 성격의 비용을 함께 봅니다.",
    "식비는 장보기, 배달, 외식을 분리해 비교합니다.",
    "구독료와 통신비는 소액 반복 지출로 별도 관리합니다.",
    "추정값은 공식 통계가 아니라 예산 점검용 참고값으로 표시합니다.",
  ],
};
```

---

## 12. FAQ 설계

```ts
export const SHLC_FAQ: FaqItem[] = [
  {
    question: "2026년 1인 가구 월 생활비는 얼마로 보면 되나요?",
    answer:
      "주거 형태와 지역에 따라 차이가 크지만, 월세를 포함하면 절약형·평균형·여유형 예산을 나눠 보는 것이 현실적입니다. 이 페이지의 시나리오 수치는 예산 점검용 추정값으로 표시합니다.",
  },
  {
    question: "1인 가구 생활비에서 가장 먼저 줄일 항목은 무엇인가요?",
    answer:
      "대부분은 주거비와 식비의 영향이 큽니다. 다만 단기간 조정은 배달비, 외식비, 구독료, 통신요금처럼 매달 반복되는 항목부터 확인하는 편이 쉽습니다.",
  },
  {
    question: "월세가 높으면 식비를 얼마나 줄여야 하나요?",
    answer:
      "월 소득 대비 주거비 비율이 높을수록 배달·외식 빈도와 구독료를 먼저 점검해야 합니다. 식비를 무리하게 낮추기보다 장보기와 배달의 균형을 조정하는 방식이 지속 가능성이 높습니다.",
  },
  {
    question: "자가용이 있는 1인 가구는 예산을 따로 봐야 하나요?",
    answer:
      "그렇습니다. 유류비, 보험료, 정비비, 주차비가 월별로 나뉘어 발생하므로 대중교통 중심 예산과 별도로 비교해야 합니다.",
  },
];
```

---

## 13. 내부 링크

```ts
export const SHLC_RELATED_LINKS: RelatedLink[] = [
  {
    label: "배달 vs 직접 요리 비용 계산기",
    href: "/tools/delivery-vs-cooking-cost/",
    description: "배달과 직접 요리의 월간·연간 비용 차이를 계산합니다.",
  },
  {
    label: "실손보험 환급액 계산기",
    href: "/tools/silson-insurance-refund-calculator/",
    description: "병원비 영수증 기준 예상 환급액을 계산합니다.",
  },
  {
    label: "대출 갈아타기 계산기",
    href: "/tools/loan-refinancing-calculator/",
    description: "금리 변경 시 월 납입금과 총 이자 절감액을 비교합니다.",
  },
];
```

---

## 14. 출처 후보

구현 시 최신 수치를 다시 확인한다.

- 통계청 1인 가구·가계동향조사
- KOSIS 인구·가구 통계
- 한국소비자원 가격정보
- KB금융지주 1인 가구·가계 관련 리포트
- 한국부동산원 또는 민간 부동산 플랫폼의 월세·전월세 참고 데이터
- 통신비·구독료는 과기정통부, 방송통신위원회, 민간 리포트를 구분 표기

---

## 15. 리포트 등록 예시

`src/data/reports.ts`

```ts
{
  slug: "single-household-living-cost-2026",
  title: "2026 1인 가구 생활비 완전 해부",
  description:
    "2026년 1인 가구 월 생활비를 주거비·식비·통신비·구독료·보험료까지 항목별로 분석합니다.",
  category: "생활비절약",
  href: "/reports/single-household-living-cost-2026/",
  badges: ["1인 가구", "생활비", "2026", "절약"],
}
```

`public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/single-household-living-cost-2026/</loc>
</url>
```

---

## 16. QA 체크리스트

- [ ] `/reports/single-household-living-cost-2026/` 페이지가 정상 렌더링된다.
- [ ] `src/data/reports.ts` 등록 후 `/reports/` 목록에 노출된다.
- [ ] 메인 페이지 최신 콘텐츠 노출 정책에 맞게 반영된다.
- [ ] `src/styles/app.scss`에 전용 SCSS가 연결되어 있다.
- [ ] `public/sitemap.xml`에 URL이 추가되어 있다.
- [ ] 모든 사용자 facing 텍스트가 한국어다.
- [ ] 추정값·시뮬레이션값에 배지가 붙어 있다.
- [ ] Chart.js가 없어도 표와 본문으로 핵심 정보가 전달된다.
- [ ] 모바일 360px 폭에서 카드·표·CTA 텍스트가 겹치지 않는다.
- [ ] FAQ 구조화 데이터와 실제 FAQ 문구가 일치한다.
- [ ] `npm run build`가 성공한다.

---

## 17. v1 / v2 범위

### v1

- 정적 리포트 페이지
- 항목별 지출표
- 도넛·막대·시나리오 차트
- 절약 체크리스트
- 내부 계산기 CTA
- FAQ와 SeoContent

### v2

- 사용자가 월 소득·월세·식비를 입력해 개인 예산을 즉시 비교하는 미니 계산기
- 지역별 월세 필터 고도화
- 구독료 관리 체크리스트 저장 기능
- 생활비 리포트 연도별 아카이브

---

## 18. 구현 메모

리포트 본문은 정보 밀도가 높아야 하지만 첫 화면은 과하게 길어지지 않게 구성한다. 핵심 요약 카드와 예산 시나리오를 먼저 보여주고, 상세 근거는 아래 섹션에서 풀어내는 흐름이 적합하다.

`배달 vs 직접 요리 비용 계산기`는 식비 섹션과 하단 CTA에서 모두 연결한다. 사용자가 자신의 생활비를 직접 줄여볼 수 있는 행동으로 이어지기 때문에 이 리포트의 가장 중요한 내부 전환 지점이다.
