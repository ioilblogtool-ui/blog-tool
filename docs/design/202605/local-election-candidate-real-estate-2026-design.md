# 2026 지방선거 후보 부동산 보유 현황 비교 설계 문서

> 기획 원문: `docs/plan/202605/local-election-candidate-real-estate-2026.md`
> 작성일: 2026-05-31
> 콘텐츠 유형: `/reports/` 선거 후보 부동산 특화 리포트
> 구현 기준: 후보자 공개자료 중 부동산 항목을 아파트·토지·건물 유형별로 분리하고, 부동산 신고액 TOP 랭킹·출마 지역 vs 소재지 교차·다주택 분석·담보채무 비교를 제공하는 데이터형 비교 리포트

---

## 1. 문서 개요

- 구현 대상: `2026 지방선거 후보 부동산 보유 현황 비교`
- slug: `local-election-candidate-real-estate-2026`
- URL: `/reports/local-election-candidate-real-estate-2026/`
- 카테고리: 선거 데이터·후보 부동산 비교
- 핵심 검색 의도: `후보 부동산`, `지방선거 후보 부동산`, `2026 지방선거 후보 아파트`, `후보 부동산 보유 현황`, `후보 부동산 소재지`
- 페이지 성격: 중앙선거관리위원회 후보자 재산 신고자료 중 부동산 항목을 특화해 구조화한 데이터 리포트. 총재산 랭킹 허브(`local-election-candidate-assets-ranking-2026`)의 부동산 특화 하위 리포트이며, 특정 후보·정당 평가가 아니라 공개 신고 부동산의 유형·소재지·채무 구조를 이해하기 쉽게 정리하는 것이 목적이다.
- 기존 허브와 차별점: 총재산 순위와 부동산 보유액 순위가 다른 후보를 발견하는 것, 아파트·토지·건물 유형 분리, 출마 지역과 소재지 교차 분석이 이 페이지만의 고유 가치다.

---

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionCandidateRealEstate2026.ts
    reports.ts
  pages/
    reports/
      local-election-candidate-real-estate-2026.astro

public/
  scripts/
    local-election-candidate-real-estate-2026.js
  og/
    reports/
      local-election-candidate-real-estate-2026.png  (선택)

src/styles/scss/pages/
  _local-election-candidate-real-estate-2026.scss
```

추가 반영:

- `src/data/reports.ts`
- `src/styles/app.scss` — `@use 'scss/pages/local-election-candidate-real-estate-2026';`
- `public/sitemap.xml`

---

## 3. 레이아웃 방향

- 최상위 클래스: `report-page lcre-page`
- SCSS prefix: `lcre-`
- 선거 콘텐츠이므로 정치 기사 톤을 완전히 제거하고, 숫자·기준일·출처가 첫 화면에서 읽힌다.
- Hero 직후 `InfoNotice`로 `공시가격 기준`, `신고액 기준`, `시세 아님`, `자료 정정 가능` 4개를 한 번에 고지한다.
- 핵심 테이블은 부동산 신고액 기준 정렬. 총재산 순위와 비교 기능은 별도 섹션으로 분리한다.
- 차트는 Chart.js 없이 CSS horizontal bar로 충분히 구현한다 (부동산 신고액 TOP 바 차트).
- 모바일에서는 테이블 대신 후보 카드 스택이 기본이며, 데스크톱에서는 전체 컬럼 테이블이 보인다.

권장 페이지 흐름:

```astro
<main class="report-page lcre-page" data-report="local-election-candidate-real-estate-2026">
  <Hero />
  <InfoNotice />
  <SummaryCards />
  <RealEstateRankingSection />    <!-- 부동산 신고액 TOP 랭킹 테이블 + 모바일 카드 -->
  <RankComparisonSection />       <!-- 총재산 순위 vs 부동산 순위 비교 -->
  <TypeBreakdownSection />        <!-- 아파트·토지·건물 유형별 TOP -->
  <RegionCrossSection />          <!-- 출마 지역 vs 부동산 소재지 -->
  <MultiUnitSection />            <!-- 다주택 보유 후보 -->
  <DebtSection />                 <!-- 부동산 신고액 vs 담보채무 -->
  <AssessmentVsMarketSection />   <!-- 공시가격 vs 실거래가 안내 -->
  <RelatedReports />
  <SeoContent />
</main>
```

---

## 4. 데이터 모델

파일: `src/data/localElectionCandidateRealEstate2026.ts`

```ts
// ─── 타입 정의 ────────────────────────────────────────────

export type CandidateRealEstateBadge =
  | "공식"
  | "보도확인"
  | "부분공개"
  | "공시가기준"
  | "계산"
  | "업데이트필요";

export type ElectionType =
  | "시도지사"
  | "구시군장"
  | "교육감"
  | "광역의원"
  | "기초의원"
  | "국회의원재보궐";

export type CandidateStatus =
  | "등록"
  | "사퇴"
  | "등록무효"
  | "정정확인";

export type RealEstateSortKey =
  | "realEstateManwon"
  | "apartmentManwon"
  | "landManwon"
  | "buildingManwon"
  | "netRealEstateManwon"
  | "realEstateRatio";

export type AssetTone =
  | "neutral"
  | "primary"
  | "asset"
  | "caution"
  | "muted";

// ─── 인터페이스 ──────────────────────────────────────────

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: CandidateRealEstateBadge;
  note?: string;
}

export interface CandidateRealEstateData {
  id: string;
  realEstateRank: number;           // 부동산 신고액 순위
  totalAssetsRank?: number;         // 총재산 순위 (교차 비교용)
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  sidoName: string;                 // 출마 시도
  districtName: string;             // 선거구
  realEstateManwon: number;         // 부동산 신고액 합계
  apartmentManwon?: number;         // 아파트·공동주택
  detachedHouseManwon?: number;     // 단독·다가구주택
  landManwon?: number;              // 토지 (대지·농지·임야 등)
  buildingManwon?: number;          // 건물·상가·근린생활시설
  otherRealEstateManwon?: number;   // 기타 부동산
  totalAssetsManwon?: number;       // 총재산 (교차 참조용)
  debtOnRealEstateManwon?: number;  // 부동산 담보 채무
  netRealEstateManwon?: number;     // 부동산 - 담보채무 (계산값)
  realEstateRatio?: number;         // 부동산 / 총재산 비중 (계산값)
  primaryRealEstateRegion?: string; // 주요 부동산 소재 시도
  matchRegion: boolean | null;      // 출마 지역 = 부동산 소재지 여부 (null = 확인불가)
  isMultiUnit?: boolean;            // 다주택 여부 (2채+)
  multiUnitCount?: number;          // 확인된 보유 유닛 수
  realEstateTags: string[];         // ["아파트중심", "토지중심", "다주택", "담보채무동반"]
  status: CandidateStatus;
  badge: CandidateRealEstateBadge;
  sourceIds: string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  note: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  tone: AssetTone;
  badge?: CandidateRealEstateBadge;
}

export interface TypeTopItem {
  rank: number;
  candidateName: string;
  partyName: string;
  districtName: string;
  amountManwon: number;
  ratioInRealEstate?: number;  // 해당 유형 / 부동산 합계 비중
  badge: CandidateRealEstateBadge;
}

export interface RegionCrossItem {
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  runningInSido: string;        // 출마 시도
  realEstateRegion: string;     // 부동산 소재 시도
  matchRegion: boolean | null;
  realEstateManwon: number;
}

export interface MultiUnitCandidate {
  candidateName: string;
  partyName: string;
  districtName: string;
  unitCount: number;           // 보유 유닛 수 (확인 범위)
  apartmentManwon: number;
  debtOnRealEstateManwon?: number;
  badge: CandidateRealEstateBadge;
  note: string;
}

export interface DebtRatioItem {
  candidateName: string;
  partyName: string;
  districtName: string;
  realEstateManwon: number;
  debtOnRealEstateManwon: number;
  netRealEstateManwon: number;
  debtRatio: number;           // 담보채무 / 부동산 (%)
  badge: CandidateRealEstateBadge;
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface LcreData {
  meta: {
    slug: string;
    title: string;
    description: string;
    h1: string;
    eyebrow: string;
    updatedAt: string;
    electionDate: string;
    dataBasis: string;
    caution: string;
  };
  sources: SourceInfo[];
  summaryCards: SummaryCard[];
  candidates: CandidateRealEstateData[];
  typeTopApartment: TypeTopItem[];    // 아파트 TOP 10
  typeTopLand: TypeTopItem[];         // 토지 TOP 10
  typeTopBuilding: TypeTopItem[];     // 건물·상가 TOP 10
  regionCross: RegionCrossItem[];     // 출마 지역 vs 소재지
  multiUnitCandidates: MultiUnitCandidate[];
  debtRatioItems: DebtRatioItem[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}
```

---

## 5. 데이터 가공 함수

파일 내 유틸리티로 제공한다.

```ts
/** 부동산 - 담보채무 = 순 부동산 자산 추정 */
export function calcNetRealEstate(c: CandidateRealEstateData): number | null {
  if (c.realEstateManwon === undefined) return null;
  return c.realEstateManwon - (c.debtOnRealEstateManwon ?? 0);
}

/** 부동산 / 총재산 비중 (%) */
export function calcRealEstateRatio(c: CandidateRealEstateData): number | null {
  if (!c.totalAssetsManwon || !c.realEstateManwon) return null;
  return (c.realEstateManwon / c.totalAssetsManwon) * 100;
}

/** 담보채무 / 부동산 레버리지 비율 (%) */
export function calcDebtRatio(c: CandidateRealEstateData): number | null {
  if (!c.realEstateManwon || !c.debtOnRealEstateManwon) return null;
  return (c.debtOnRealEstateManwon / c.realEstateManwon) * 100;
}

/** 금액 포맷 (만원 → 억원 혼용) */
export function formatManwon(value?: number | null): string {
  if (value === undefined || value === null) return "확인 필요";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 10_000) return `${sign}${(abs / 10_000).toFixed(1)}억`;
  return `${sign}${abs.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value?: number | null): string {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}
```

주의:

- `netRealEstateManwon`, `realEstateRatio`, `debtRatio`는 데이터 파일에서 계산해 필드로 채우거나 Astro 빌드 타임에 계산해 넘긴다. 항상 `계산` 배지를 붙인다.
- 세부 항목이 없으면 `0`이 아니라 `undefined`로 처리한다.
- 음수 순자산(채무 > 부동산) 케이스가 있을 수 있으므로 포맷 함수에서 음수 처리를 보장한다.

---

## 6. 페이지 IA

1. Hero
2. InfoNotice (공시가기준·신고액기준·시세아님·자료정정가능)
3. Summary Cards 4개
4. 부동산 신고액 TOP 랭킹 (테이블 + 모바일 카드)
5. 총재산 순위 vs 부동산 순위 비교
6. 부동산 유형별 TOP (아파트·토지·건물 탭)
7. 출마 지역 vs 부동산 소재지 교차 분석
8. 다주택 보유 후보
9. 부동산 신고액 vs 담보채무
10. 공시가격 vs 실거래가 이해 안내
11. 관련 리포트 CTA
12. FAQ + SeoContent

---

## 7. 섹션 상세 설계

### 7-1. Hero

```astro
<CalculatorHero
  eyebrow="선거 데이터 리포트"
  title="2026 지방선거 후보 부동산 보유 현황 비교"
  description="중앙선거관리위원회 후보자 재산 신고자료를 기준으로 주요 후보의 부동산 신고액을 아파트·토지·건물로 분리해 비교합니다."
/>
```

Hero 하단 보조 메타 (`.lcre-meta-row`):

- `최근 업데이트: 2026.05.31`
- `선거일: 2026.06.03`
- `기준: 후보자 등록 재산 신고자료`
- `단위: 만원·억원 병행 표기`
- `공시가격 기준 · 시세와 다름`

---

### 7-2. InfoNotice

필수 4행:

```text
① 이 페이지는 후보자 공개자료 중 부동산 항목을 정리한 참고 리포트입니다.
② 부동산 신고액은 공시가격 기준이며 실거래가(시세)와 다를 수 있습니다.
③ 후보자 본인 외 배우자·직계존비속 명의 부동산이 포함될 수 있습니다.
④ 후보 사퇴, 등록무효, 자료 정정 발생 시 수치와 순위가 달라질 수 있습니다.
```

컴포넌트: `InfoNotice.astro`

---

### 7-3. Summary Cards

카드 4개 (`.lcre-summary-grid`):

| 카드 | 표시 내용 | 배지 |
| --- | --- | --- |
| 부동산 신고액 1위 | 후보명 + 부동산 합계 | 공식 / 공시가기준 |
| 아파트 보유액 1위 | 후보명 + 아파트 신고액 | 공식 / 공시가기준 |
| 토지 보유액 1위 | 후보명 + 토지 신고액 | 공식 / 공시가기준 |
| 다주택 후보 수 | `N명 확인` | 부분공개 |

```astro
<!-- Astro 빌드 타임에 data에서 계산해 주입 -->
<article class="lcre-summary-card lcre-summary-card--primary">
  <span class="lcre-summary-card__label">부동산 신고액 1위</span>
  <strong class="lcre-summary-card__value">{topRealEstate.realEstateManwon}억</strong>
  <span class="lcre-summary-card__sub">{topRealEstate.candidateName} · {topRealEstate.districtName}</span>
  <span class="lcre-badge lcre-badge--official">공식</span>
  <span class="lcre-badge lcre-badge--assessed">공시가기준</span>
</article>
```

---

### 7-4. 부동산 신고액 TOP 랭킹

#### 7-4-1. 필터 툴바

```html
<div class="lcre-filter-toolbar">
  <input type="search" id="lcreSearch" placeholder="후보자명·선거구 검색" />
  <select id="lcreFilterSido">시도 전체</select>
  <select id="lcreFilterType">선거종류 전체</select>
  <select id="lcreFilterParty">정당 전체</select>
  <div class="lcre-sort-btns" role="group">
    <button data-sort="realEstateManwon" aria-pressed="true">부동산합계순</button>
    <button data-sort="apartmentManwon">아파트순</button>
    <button data-sort="landManwon">토지순</button>
    <button data-sort="buildingManwon">건물순</button>
    <button data-sort="netRealEstateManwon">순부동산순</button>
    <button data-sort="realEstateRatio">비중순</button>
  </div>
</div>
```

접근성:
- 검색 input에 `aria-label="후보자명 또는 선거구로 검색"` 
- 정렬 버튼에 `aria-pressed` 상태 갱신
- 결과 수를 `<p aria-live="polite" id="lcreCount">` 영역에 표시

#### 7-4-2. 데스크톱 테이블

```html
<div class="lcre-table-wrap">
  <table class="lcre-table" id="lcreTable">
    <thead>
      <tr>
        <th>#</th>
        <th>후보</th>
        <th>선거구</th>
        <th>부동산 합계</th>
        <th>아파트</th>
        <th>토지</th>
        <th>건물·상가</th>
        <th>담보채무</th>
        <th>순부동산</th>
        <th>총재산 대비</th>
        <th>출처</th>
      </tr>
    </thead>
    <tbody id="lcreTableBody"><!-- JS 렌더 --></tbody>
  </table>
</div>
```

테이블 스펙:
- `.lcre-table-wrap { overflow-x: auto; }`
- 최소 너비 1080px
- 금액 셀 우측 정렬
- `undefined` 항목 → `-` 표시
- `계산` 배지가 붙는 컬럼: 순부동산, 총재산 대비
- 사퇴·등록무효 후보 행: `opacity: 0.5` + 상태 배지

상태 배지 클래스:
- `.lcre-status--registered` (기본, 숨김)
- `.lcre-status--withdrawn` (사퇴 — 주황)
- `.lcre-status--invalid` (등록무효 — 빨강)
- `.lcre-status--correction` (정정확인 — 노랑)

#### 7-4-3. 모바일 카드 리스트

```html
<ul class="lcre-candidate-list" id="lcreCardList">
  <li class="lcre-candidate-card" data-id="...">
    <div class="lcre-candidate-card__header">
      <span class="lcre-rank">#1</span>
      <strong class="lcre-candidate-card__name">홍길동</strong>
      <span class="lcre-party-badge">국민의힘</span>
      <span class="lcre-status-badge lcre-status--registered">등록</span>
    </div>
    <div class="lcre-candidate-card__main">
      <span class="lcre-candidate-card__re-total">12.3억</span>
      <span class="lcre-candidate-card__re-label">부동산 신고액</span>
    </div>
    <div class="lcre-candidate-card__grid">
      <div><span>아파트</span><strong>8.1억</strong></div>
      <div><span>토지</span><strong>4.2억</strong></div>
      <div><span>건물</span><strong>-</strong></div>
      <div><span>담보채무</span><strong>2.0억</strong></div>
      <div><span>순부동산</span><small class="lcre-calc-badge">계산</small><strong>10.3억</strong></div>
      <div><span>총재산비중</span><small class="lcre-calc-badge">계산</small><strong>72%</strong></div>
    </div>
    <div class="lcre-candidate-card__footer">
      <span>{electionType} · {districtName}</span>
      <a href="{sourceUrl}" target="_blank" rel="noopener noreferrer">원문 확인</a>
    </div>
  </li>
</ul>
```

반응형 분기:
- `max-width: 767px` → 카드 리스트 표시, 테이블 숨김
- `min-width: 768px` → 테이블 표시, 카드 리스트 숨김

---

### 7-5. 총재산 순위 vs 부동산 순위 비교

목적: "총재산 하위인데 부동산 상위" 또는 반대 패턴을 드러낸다.

UI:

```html
<section class="lcre-rank-comparison panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">순위 비교</p>
    <h2 class="panel__title">총재산 순위 vs 부동산 보유액 순위</h2>
    <p class="panel-heading__summary">두 순위가 다르면 자산 구성이 다른 후보입니다.</p>
  </div>

  <!-- 2열 나란히 표 -->
  <div class="lcre-dual-rank">
    <div class="lcre-dual-rank__col">
      <h3>총재산 기준 TOP 10</h3>
      <ol class="lcre-rank-list lcre-rank-list--total"><!-- 빌드 타임 렌더 --></ol>
    </div>
    <div class="lcre-dual-rank__col">
      <h3>부동산 신고액 기준 TOP 10</h3>
      <ol class="lcre-rank-list lcre-rank-list--realestate"><!-- 빌드 타임 렌더 --></ol>
    </div>
  </div>

  <!-- 부동산 비중 80%+ 후보 목록 -->
  <div class="lcre-high-ratio-list">
    <p class="lcre-high-ratio-list__title">부동산 비중 80% 이상 후보</p>
    <!-- compact badge rows -->
  </div>
</section>
```

해석 문구:

```text
총재산 순위와 부동산 순위가 일치하지 않는 후보는 예금·증권 중심이거나, 
부동산 보유는 많지만 채무도 함께 큰 구조일 수 있습니다.
```

---

### 7-6. 부동산 유형별 TOP

탭 3개: 아파트·공동주택 / 토지 / 건물·상가

```html
<section class="lcre-type-section panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">유형별 분석</p>
    <h2 class="panel__title">부동산 유형별 상위 후보</h2>
  </div>
  <div class="lcre-type-tabs" role="tablist">
    <button role="tab" aria-selected="true" data-tab="apt">아파트·공동주택</button>
    <button role="tab" data-tab="land">토지</button>
    <button role="tab" data-tab="building">건물·상가</button>
  </div>

  <div class="lcre-type-panel" id="tab-apt">
    <!-- 아파트 TOP 10: CSS bar rows -->
  </div>
  <div class="lcre-type-panel" id="tab-land" hidden>
    <!-- 토지 TOP 10 -->
  </div>
  <div class="lcre-type-panel" id="tab-building" hidden>
    <!-- 건물·상가 TOP 10 -->
  </div>
</section>
```

각 탭 내 유형 TOP 항목 구조:

```html
<div class="lcre-type-row">
  <span class="lcre-type-row__rank">#1</span>
  <span class="lcre-type-row__name">홍길동 <small>서울시장</small></span>
  <div class="lcre-bar-track">
    <div class="lcre-bar-fill" style="width: 100%;"></div>
  </div>
  <span class="lcre-type-row__amount">12.3억</span>
  <span class="lcre-type-row__ratio">아파트 78%</span>
</div>
```

필수 고지:

```text
※ 아파트·공동주택은 공시가격 기준 신고액이며 실거래가와 다를 수 있습니다.
```

---

### 7-7. 출마 지역 vs 부동산 소재지

목적: `후보 부동산 소재지` 검색 의도 + 지역 관심 유저 체류 유도

UI:

```html
<section class="lcre-region-cross panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">지역 교차 분석</p>
    <h2 class="panel__title">출마 지역 vs 부동산 소재 지역</h2>
    <p class="panel-heading__summary">광역단체장 후보 기준으로 확인된 범위 내에서만 제공합니다.</p>
  </div>

  <!-- 분류 필터 -->
  <div class="lcre-region-tabs">
    <button data-filter="all" aria-pressed="true">전체</button>
    <button data-filter="match">소재지 일치</button>
    <button data-filter="mismatch">소재지 불일치</button>
    <button data-filter="unknown">확인불가</button>
  </div>

  <table class="lcre-region-table">
    <thead>
      <tr>
        <th>후보</th>
        <th>출마 지역</th>
        <th>부동산 주요 소재</th>
        <th>일치 여부</th>
        <th>부동산 신고액</th>
      </tr>
    </thead>
    <tbody id="lcreRegionBody"><!-- JS 렌더 --></tbody>
  </table>
</section>
```

일치 여부 아이콘:
- `true` → `✓ 일치` (초록)
- `false` → `≠ 불일치` (주황)
- `null` → `확인불가` (회색)

중립 안내 문구:

```text
부동산 소재 지역과 출마 지역의 일치 여부는 후보 평가의 유일한 기준이 아닙니다.
이 정보는 공개된 재산 신고자료를 그대로 정리한 참고 자료입니다.
```

---

### 7-8. 다주택 보유 후보

목적: `2026 지방선거 후보 아파트 몇 채` 검색 의도 흡수

UI:

```html
<section class="lcre-multi-unit panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">다주택 현황</p>
    <h2 class="panel__title">아파트·공동주택 2채 이상 신고 후보</h2>
    <p class="panel-heading__summary">확인된 범위 내 집계. 배우자·직계존비속 명의 포함 가능.</p>
  </div>

  <div class="lcre-multi-grid">
    {multiUnitCandidates.map(c => (
      <article class="lcre-multi-card">
        <div class="lcre-multi-card__header">
          <strong>{c.candidateName}</strong>
          <span class="lcre-party-badge">{c.partyName}</span>
          <span class="lcre-multi-count">{c.unitCount}채 확인</span>
        </div>
        <div class="lcre-multi-card__amounts">
          <div><span>아파트 신고액</span><strong>{formatManwon(c.apartmentManwon)}</strong></div>
          <div><span>담보채무</span><strong>{formatManwon(c.debtOnRealEstateManwon)}</strong></div>
        </div>
        <p class="lcre-multi-card__badge">
          <span class="lcre-badge lcre-badge--partial">부분공개</span>
          {c.note}
        </p>
      </article>
    ))}
  </div>

  <p class="lcre-caution-note">
    ⚠ 다주택 보유 자체는 법적 문제가 아닙니다. 이 페이지는 재산 신고액 기준 사실 정보를 제공합니다.
    원문 자료는 중앙선거관리위원회 선거통계시스템에서 확인하세요.
  </p>
</section>
```

---

### 7-9. 부동산 신고액 vs 담보채무

목적: "부동산 많아도 대출이 많으면 달라진다"는 구조를 보여준다.

산식 카드:

```html
<div class="lcre-formula-card">
  <p class="lcre-formula">
    순 부동산 자산 추정 = 부동산 신고액 − 부동산 담보 채무
  </p>
  <span class="lcre-badge lcre-badge--calc">계산</span>
  <p class="lcre-formula-note">실제 법적 순자산과 다를 수 있습니다.</p>
</div>
```

순 부동산 자산 TOP 10 + 담보 레버리지 비율 표:

```html
<table class="lcre-debt-table">
  <thead>
    <tr>
      <th>후보</th>
      <th>선거구</th>
      <th>부동산 신고액</th>
      <th>담보채무</th>
      <th>순부동산 추정</th>
      <th>레버리지 비율</th>
    </tr>
  </thead>
  <tbody><!-- 빌드 타임 렌더 --></tbody>
</table>
```

레버리지 비율 컬러 기준:
- 0~30%: `.lcre-debt--low` (초록)
- 31~60%: `.lcre-debt--mid` (주황)
- 61%+: `.lcre-debt--high` (빨강)

---

### 7-10. 공시가격 vs 실거래가 이해 안내

검색 의도: `후보 아파트 시세`, `후보 부동산 공시가격`, `공시가격 실거래가 차이`

```html
<section class="lcre-assessment-guide panel">
  <div class="panel-heading">
    <p class="panel-heading__eyebrow">데이터 이해</p>
    <h2 class="panel__title">공시가격 vs 실거래가 — 신고액을 이해하는 법</h2>
  </div>
  <div class="lcre-guide-cards">
    <article class="lcre-guide-card">
      <h3>재산 신고 기준</h3>
      <p>공동주택(아파트)은 공시가격, 토지는 공시지가 기준 신고가 원칙입니다. 실거래가로 신고하지 않습니다.</p>
    </article>
    <article class="lcre-guide-card">
      <h3>공시가격 vs 시세 차이</h3>
      <p>서울 아파트의 경우 공시가격은 시세의 약 70~90% 수준으로 형성되는 경우가 많습니다. 후보 부동산 신고액은 실거래 시세보다 낮게 표시될 수 있습니다.</p>
    </article>
    <article class="lcre-guide-card">
      <h3>이 페이지의 한계</h3>
      <p>이 리포트는 공시가격 기준 신고액만 비교합니다. 시세 환산값은 제공하지 않으며, 시세 추정값을 공식 신고액으로 혼용하지 마세요.</p>
    </article>
  </div>
  <div class="lcre-related-tools">
    <a href="/tools/apartment-holding-tax/">아파트 보유세 계산기 →</a>
    <a href="/tools/real-estate-acquisition-tax/">취득세 계산기 →</a>
  </div>
</section>
```

---

### 7-11. 관련 리포트 CTA

```html
<section class="lcre-related panel">
  <div class="panel-heading">
    <h2 class="panel__title">함께 보면 좋은 리포트</h2>
  </div>
  <div class="lcre-related-grid">
    {relatedLinks.map(link => (
      <a href={withBase(link.href)} class="lcre-related-card">
        <strong>{link.label}</strong>
        <span>{link.description}</span>
      </a>
    ))}
  </div>
</section>
```

관련 링크 목록:

| 라벨 | href | 설명 |
| --- | --- | --- |
| 지방선거 후보 재산 순위 TOP 50 | `/reports/local-election-candidate-assets-ranking-2026/` | 총재산 기준 전체 후보 허브 |
| 광역단체장 후보 재산 비교 | `/reports/governor-mayor-candidate-assets-comparison-2026/` | 시도지사 후보 전체 재산 |
| 서울시장 후보 재산·부동산 비교 | `/reports/seoul-mayor-candidate-assets-2026/` | 오세훈·정원오 재산 구조 |
| 아파트 보유세 계산기 | `/tools/apartment-holding-tax/` | 공시가격 기준 보유세 계산 |
| 취득세 계산기 | `/tools/real-estate-acquisition-tax/` | 부동산 취득 세금 계산 |

---

## 8. 클라이언트 스크립트 설계

파일: `public/scripts/local-election-candidate-real-estate-2026.js`

### 8-1. 데이터 주입

```astro
<!-- Astro 페이지에서 JSON 직렬화해 주입 -->
<script id="lcreData" type="application/json" set:html={JSON.stringify(lcrePageData)} />
```

### 8-2. 역할

```js
const configNode = document.getElementById("lcreData");
const data = JSON.parse(configNode.textContent || "{}");
const { candidates, regionCross, multiUnitCandidates, debtRatioItems } = data;
```

| 기능 | 구현 방식 |
| --- | --- |
| 후보 검색 | input 이벤트 → candidateName / districtName substring 필터 |
| 시도 필터 | select change → sidoName 필터 |
| 선거종류 필터 | select change → electionType 필터 |
| 정당 필터 | select change → partyName 필터 |
| 정렬 전환 | button click → sortKey 변경 → 내림차순 재정렬 |
| 테이블 렌더 | `renderTable(filtered)` |
| 카드 렌더 | `renderCards(filtered)` |
| 결과 수 표시 | `aria-live` 영역 갱신 |
| 탭 전환 (유형별) | tab button click → panel 표시/숨김 |
| 지역 교차 필터 | filter button → match/mismatch/null 필터 |
| 반응형 분기 | `window.matchMedia('(min-width: 768px)')` |

### 8-3. 상태 관리

```js
const state = {
  query: "",
  sido: "",
  electionType: "",
  party: "",
  sortKey: "realEstateManwon",
  regionFilter: "all",   // "all" | "match" | "mismatch" | "unknown"
  activeTypeTab: "apt",  // "apt" | "land" | "building"
};
```

### 8-4. 주요 함수

```js
function filterCandidates() { /* query + sido + electionType + party 필터 */ }
function sortCandidates(list, key) { /* key 기준 내림차순 */ }
function renderTable(list) { /* 데스크톱 tbody 갱신 */ }
function renderCards(list) { /* 모바일 카드 리스트 갱신 */ }
function renderRegionTable(filter) { /* 지역 교차 표 갱신 */ }
function updateCount(n) { /* 결과 수 aria-live 갱신 */ }
function formatManwon(val) { /* 만원·억원 포맷 */ }
function formatPercent(val) { /* % 포맷 */ }
```

---

## 9. Astro 페이지 구조

파일: `src/pages/reports/local-election-candidate-real-estate-2026.astro`

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import SiteHeader from "../../components/SiteHeader.astro";
import CalculatorHero from "../../components/CalculatorHero.astro";
import InfoNotice from "../../components/InfoNotice.astro";
import SeoContent from "../../components/SeoContent.astro";
import TrustPanel from "../../components/TrustPanel.astro";
import {
  LCRE_DATA,
  calcNetRealEstate,
  calcRealEstateRatio,
  calcDebtRatio,
  formatManwon,
  formatPercent,
} from "../../data/localElectionCandidateRealEstate2026";

const normalizedBase = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const withBase = (path: string) => `${normalizedBase}${path.replace(/^\//, "")}`;

const { meta, summaryCards, candidates, typeTopApartment, typeTopLand,
        typeTopBuilding, regionCross, multiUnitCandidates, debtRatioItems,
        relatedLinks, faq, seoIntro, seoCriteria } = LCRE_DATA;

// 빌드 타임 파생값 계산
const topByRealEstate = [...candidates].sort((a, b) => b.realEstateManwon - a.realEstateManwon);
const top10ByTotal = [...candidates].sort((a, b) => (b.totalAssetsManwon ?? 0) - (a.totalAssetsManwon ?? 0)).slice(0, 10);
const top10ByRealEstate = topByRealEstate.slice(0, 10);
const highRatioList = candidates.filter(c => (c.realEstateRatio ?? 0) >= 80);

const faqSchema = faq.map(item => ({
  "@type": "Question",
  name: item.q,
  acceptedAnswer: { "@type": "Answer", text: item.a },
}));

// 클라이언트 JS에 넘길 직렬화 데이터
const lcrePageData = { candidates, regionCross, multiUnitCandidates, debtRatioItems };
---

<BaseLayout
  title={meta.seoTitle}
  description={meta.seoDescription}
  ogImage="/og/og-home.png"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: meta.title,
    description: meta.description,
    url: `...`,
    mainEntity: { "@type": "FAQPage", mainEntity: faqSchema },
  }}
>
  <SiteHeader />

  <main class="report-page lcre-page" data-report="local-election-candidate-real-estate-2026">

    <!-- 1. Hero -->
    <CalculatorHero eyebrow={meta.eyebrow} title={meta.h1} description={meta.description} />

    <!-- 메타 행 -->
    <div class="lcre-meta-row">
      <span>최근 업데이트: {meta.updatedAt}</span>
      <span>선거일: {meta.electionDate}</span>
      <span>기준: {meta.dataBasis}</span>
      <span class="lcre-badge lcre-badge--assessed">공시가격 기준</span>
      <span class="lcre-badge lcre-badge--caution">시세와 다름</span>
    </div>

    <!-- 2. InfoNotice -->
    <InfoNotice lines={[...4개 고지 문장]} />

    <!-- 3. Summary Cards -->
    <section class="lcre-summary-section">
      <div class="lcre-summary-grid">
        {summaryCards.map(card => (
          <article class={`lcre-summary-card lcre-summary-card--${card.tone}`}>
            <span class="lcre-summary-card__label">{card.label}</span>
            <strong class="lcre-summary-card__value">{card.value}</strong>
            <span class="lcre-summary-card__desc">{card.description}</span>
          </article>
        ))}
      </div>
    </section>

    <!-- 4. 부동산 신고액 TOP 랭킹 -->
    <section class="lcre-ranking-section panel">
      <!-- 필터 툴바 -->
      <!-- 데스크톱 테이블 -->
      <!-- 모바일 카드 리스트 -->
      <!-- 결과 수 표시 -->
    </section>

    <!-- 5. 총재산 순위 vs 부동산 순위 -->
    <section class="lcre-rank-comparison panel">
      <!-- 빌드 타임 렌더: top10ByTotal + top10ByRealEstate -->
      <!-- 부동산 비중 80%+ 후보 목록 -->
    </section>

    <!-- 6. 부동산 유형별 TOP -->
    <section class="lcre-type-section panel">
      <!-- 탭: 아파트 / 토지 / 건물·상가 -->
      <!-- CSS bar rows -->
    </section>

    <!-- 7. 출마 지역 vs 소재지 -->
    <section class="lcre-region-cross panel">
      <!-- 지역 교차 필터 + 표 -->
    </section>

    <!-- 8. 다주택 보유 후보 -->
    <section class="lcre-multi-unit panel">
      <!-- 다주택 카드 그리드 -->
    </section>

    <!-- 9. 부동산 vs 담보채무 -->
    <section class="lcre-debt-section panel">
      <!-- 산식 카드 + 표 -->
    </section>

    <!-- 10. 공시가격 vs 실거래가 안내 -->
    <section class="lcre-assessment-guide panel">
      <!-- 3개 가이드 카드 -->
      <!-- 관련 계산기 링크 -->
    </section>

    <!-- 11. 관련 리포트 CTA -->
    <section class="lcre-related panel">...</section>

    <!-- 12. TrustPanel -->
    <TrustPanel
      sources={[
        { label: "중앙선거관리위원회 선거통계시스템", url: "https://info.nec.go.kr/" },
        { label: "중앙선거관리위원회", url: "https://www.nec.go.kr/" },
      ]}
    />

    <!-- 13. SeoContent + FAQ -->
    <SeoContent
      introTitle="후보 부동산, 신고액만 보면 반쪽이다"
      intro={seoIntro}
      criteria={seoCriteria}
      faq={faq.map(f => ({ question: f.q, answer: f.a }))}
      related={relatedLinks}
    />

  </main>

  <!-- 클라이언트 데이터 주입 -->
  <script id="lcreData" type="application/json" set:html={JSON.stringify(lcrePageData)} />
  <script type="module" src={withBase("/scripts/local-election-candidate-real-estate-2026.js")} />
</BaseLayout>
```

---

## 10. 스타일 설계

파일: `src/styles/scss/pages/_local-election-candidate-real-estate-2026.scss`

### 10-1. 클래스 prefix 목록

```text
lcre-page
lcre-meta-row
lcre-badge / lcre-badge--official / lcre-badge--assessed / lcre-badge--partial / lcre-badge--calc / lcre-badge--caution / lcre-badge--update
lcre-summary-grid / lcre-summary-card / lcre-summary-card--primary / lcre-summary-card--asset / lcre-summary-card--caution / lcre-summary-card--muted
lcre-filter-toolbar
lcre-sort-btns
lcre-table-wrap / lcre-table
lcre-status--registered / lcre-status--withdrawn / lcre-status--invalid / lcre-status--correction
lcre-candidate-list / lcre-candidate-card / lcre-candidate-card__header / lcre-candidate-card__main / lcre-candidate-card__grid / lcre-candidate-card__footer
lcre-rank / lcre-party-badge
lcre-rank-comparison / lcre-dual-rank / lcre-dual-rank__col / lcre-rank-list
lcre-high-ratio-list
lcre-type-tabs / lcre-type-panel / lcre-type-row
lcre-bar-track / lcre-bar-fill
lcre-region-tabs / lcre-region-table
lcre-multi-grid / lcre-multi-card / lcre-multi-count
lcre-formula-card / lcre-formula / lcre-formula-note
lcre-debt-table / lcre-debt--low / lcre-debt--mid / lcre-debt--high
lcre-assessment-guide / lcre-guide-cards / lcre-guide-card
lcre-related-tools
lcre-related-grid / lcre-related-card
lcre-calc-badge
lcre-caution-note
```

### 10-2. 핵심 스타일 스펙

```scss
.lcre-page {

  // ── 배지 ────────────────────────────────────
  .lcre-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;

    &--official   { background: #eff6ff; color: #1557b0; }   // 공식 — 파랑
    &--assessed   { background: #f0fdf4; color: #166534; }   // 공시가기준 — 초록
    &--partial    { background: #fef3c7; color: #92400e; }   // 부분공개 — 주황
    &--calc       { background: #f3f4f6; color: #6b7280; }   // 계산 — 회색
    &--caution    { background: #fff1f2; color: #9f1239; }   // 시세아님 — 빨강
    &--update     { background: #fffbeb; color: #78350f; }   // 업데이트필요 — 노랑
  }

  .lcre-calc-badge {
    display: inline-flex;
    align-items: center;
    padding: 1px 5px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 10px;
    font-weight: 700;
    margin-right: 3px;
    vertical-align: middle;
  }

  // ── 메타 행 ──────────────────────────────────
  .lcre-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    padding: 10px 0;
    font-size: 12px;
    color: #6b7280;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 12px;
  }

  // ── 요약 카드 그리드 ─────────────────────────
  .lcre-summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 0 0 24px;

    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .lcre-summary-card {
    background: #f7f7f2;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &__label { font-size: 11px; color: #6b7280; font-weight: 600; }
    &__value { font-size: 22px; font-weight: 900; color: #111827; line-height: 1.2; }
    &__desc  { font-size: 11px; color: #9ca3af; }

    &--primary { background: #eff6ff; .lcre-summary-card__value { color: #1d4ed8; } }
    &--asset   { background: #f0fdf4; .lcre-summary-card__value { color: #166534; } }
    &--caution { background: #fffbeb; .lcre-summary-card__value { color: #b45309; } }
    &--muted   { background: #f9fafb; .lcre-summary-card__value { color: #374151; } }
  }

  // ── 필터 툴바 ────────────────────────────────
  .lcre-filter-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 14px;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (min-width: 960px) {
      grid-template-columns: 2fr 1fr 1fr 1fr;
    }
  }

  .lcre-sort-btns {
    grid-column: 1 / -1;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    button {
      flex-shrink: 0;
      padding: 6px 12px;
      border: 1.5px solid #e5e7eb;
      border-radius: 999px;
      background: #fff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;

      &[aria-pressed="true"] {
        background: #1d4ed8;
        border-color: #1d4ed8;
        color: #fff;
      }
    }
  }

  // ── 테이블 ───────────────────────────────────
  .lcre-table-wrap {
    overflow-x: auto;

    @media (min-width: 768px) {
      display: block;
    }

    @media (max-width: 767px) {
      display: none;
    }
  }

  .lcre-table {
    width: 100%;
    min-width: 1080px;
    border-collapse: collapse;
    font-size: 13px;

    th, td {
      padding: 9px 10px;
      border-bottom: 1px solid #f3f4f6;
      text-align: left;
      vertical-align: middle;
    }

    th {
      background: #f7f7f2;
      font-size: 12px;
      font-weight: 800;
      color: #374151;
      position: sticky;
      top: 0;
      z-index: 1;
      white-space: nowrap;
    }

    td:nth-child(n+4) { text-align: right; } // 금액 컬럼 우측 정렬

    tr.is-withdrawn, tr.is-invalid { opacity: 0.5; }
    tr:hover td { background: #fafaf7; }
  }

  // ── 모바일 카드 ──────────────────────────────
  .lcre-candidate-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .lcre-candidate-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__header {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    &__main {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;

      > div {
        display: flex;
        flex-direction: column;
        gap: 2px;

        span { font-size: 10px; color: #6b7280; }
        strong { font-size: 13px; font-weight: 800; color: #111827; }
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #9ca3af;

      a { color: #1d4ed8; text-decoration: none; }
    }
  }

  .lcre-rank {
    font-size: 12px;
    font-weight: 900;
    color: #6b7280;
    min-width: 24px;
  }

  .lcre-party-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 4px;
    background: #f3f4f6;
    color: #374151;
    font-size: 11px;
    font-weight: 700;
  }

  // ── 이중 랭킹 비교 ───────────────────────────
  .lcre-dual-rank {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }

    &__col h3 {
      font-size: 13px;
      font-weight: 800;
      color: #374151;
      margin: 0 0 8px;
    }
  }

  .lcre-rank-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      padding: 6px 8px;
      border-radius: 6px;
      background: #f7f7f2;
    }
  }

  .lcre-high-ratio-list {
    margin-top: 16px;
    padding: 12px 14px;
    background: #fffbeb;
    border-radius: 10px;

    &__title {
      font-size: 12px;
      font-weight: 800;
      color: #92400e;
      margin: 0 0 8px;
    }
  }

  // ── 유형별 탭 ────────────────────────────────
  .lcre-type-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    button {
      flex-shrink: 0;
      padding: 6px 14px;
      border: 1.5px solid #e5e7eb;
      border-radius: 999px;
      background: #fff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;

      &[aria-selected="true"] {
        background: #1d4ed8;
        border-color: #1d4ed8;
        color: #fff;
      }
    }
  }

  .lcre-type-row {
    display: grid;
    grid-template-columns: 28px 1fr auto;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    @media (min-width: 480px) {
      grid-template-columns: 28px 1fr 1fr 80px 56px;
    }

    &__rank { font-size: 12px; font-weight: 900; color: #9ca3af; }
    &__name { font-size: 13px; font-weight: 700; small { color: #6b7280; font-weight: 400; } }
    &__amount { font-size: 13px; font-weight: 800; color: #111827; text-align: right; }
    &__ratio { font-size: 11px; color: #6b7280; text-align: right; }
  }

  .lcre-bar-track {
    height: 20px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
    display: none;

    @media (min-width: 480px) { display: block; }
  }

  .lcre-bar-fill {
    height: 100%;
    background: #93c5fd;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  // ── 지역 교차 표 ─────────────────────────────
  .lcre-region-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    flex-wrap: wrap;

    button {
      padding: 5px 12px;
      border: 1.5px solid #e5e7eb;
      border-radius: 999px;
      background: #fff;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;

      &[aria-pressed="true"] { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
    }
  }

  .lcre-region-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th, td {
      padding: 9px 10px;
      border-bottom: 1px solid #f3f4f6;
      text-align: left;
    }

    th { background: #f7f7f2; font-size: 12px; font-weight: 800; color: #374151; }
  }

  // ── 다주택 카드 ──────────────────────────────
  .lcre-multi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;

    @media (min-width: 480px) { grid-template-columns: 1fr 1fr; }
    @media (min-width: 768px) { grid-template-columns: 1fr 1fr 1fr; }
  }

  .lcre-multi-card {
    background: #f7f7f2;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__header {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      strong { font-size: 14px; font-weight: 800; color: #111827; }
    }

    &__amounts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;

      > div {
        display: flex;
        flex-direction: column;
        gap: 2px;
        span { font-size: 10px; color: #6b7280; }
        strong { font-size: 14px; font-weight: 800; color: #111827; }
      }
    }
  }

  .lcre-multi-count {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 11px;
    font-weight: 800;
  }

  // ── 담보채무 산식 카드·표 ────────────────────
  .lcre-formula-card {
    background: #f7f7f2;
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .lcre-formula {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .lcre-debt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th, td {
      padding: 9px 10px;
      border-bottom: 1px solid #f3f4f6;
      text-align: left;
    }

    td:nth-child(n+3) { text-align: right; }

    th { background: #f7f7f2; font-size: 12px; font-weight: 800; color: #374151; }
  }

  .lcre-debt--low  td:last-child { color: #166534; font-weight: 800; }
  .lcre-debt--mid  td:last-child { color: #b45309; font-weight: 800; }
  .lcre-debt--high td:last-child { color: #9f1239; font-weight: 800; }

  // ── 공시가격 가이드 카드 ─────────────────────
  .lcre-guide-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;

    @media (min-width: 640px) { grid-template-columns: 1fr 1fr 1fr; }
  }

  .lcre-guide-card {
    background: #f7f7f2;
    border-radius: 10px;
    padding: 14px 16px;

    h3 { font-size: 13px; font-weight: 800; color: #111827; margin: 0 0 6px; }
    p  { font-size: 12px; color: #374151; line-height: 1.6; margin: 0; }
  }

  .lcre-related-tools {
    margin-top: 12px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    a {
      font-size: 13px;
      font-weight: 700;
      color: #1d4ed8;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }

  // ── 관련 리포트 CTA ──────────────────────────
  .lcre-related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;

    @media (min-width: 480px) { grid-template-columns: 1fr 1fr; }
    @media (min-width: 768px) { grid-template-columns: 1fr 1fr 1fr; }
  }

  .lcre-related-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px 16px;
    background: #f7f7f2;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;

    &:hover { border-color: #1d4ed8; background: #eff6ff; }

    strong { font-size: 13px; font-weight: 800; color: #111827; }
    span   { font-size: 12px; color: #6b7280; }
  }

  .lcre-caution-note {
    font-size: 12px;
    color: #92400e;
    background: #fffbeb;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 12px 0 0;
  }
}
```

---

## 11. reports.ts 등록

파일: `src/data/reports.ts`

```ts
{
  slug: "local-election-candidate-real-estate-2026",
  title: "2026 지방선거 후보 부동산 보유 현황 비교",
  description: "후보자 재산 신고자료 중 부동산 항목을 아파트·토지·건물로 분리해 비교합니다. 부동산 신고액 TOP 랭킹, 출마 지역 vs 소재지 교차, 다주택 분석을 제공합니다.",
  category: "선거 데이터",
  publishedAt: "2026-05-31",
  updatedAt: "2026-05-31",
  eyebrow: "선거 데이터 리포트",
  badges: ["선거", "부동산", "공식자료"],
  featured: false,
},
```

---

## 12. sitemap.xml 등록

```xml
<url>
  <loc>https://bigyocalc.com/reports/local-election-candidate-real-estate-2026/</loc>
  <lastmod>2026-05-31</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

`changefreq: weekly` — 후보 등록 기간 동안 자료 정정이 빈번할 수 있으므로 weekly 적용.

---

## 13. QA 체크리스트

- [ ] 모든 부동산 수치에 `공시가기준` 배지가 있다
- [ ] 신고액이 시세와 다를 수 있음을 InfoNotice와 FAQ에 모두 명시한다
- [ ] 가족 명의 포함 가능성을 InfoNotice에 고지한다
- [ ] 후보 사퇴·등록무효 후보가 사퇴 배지와 함께 처리된다
- [ ] 다주택 카드에 `부분공개` 배지와 원문 확인 안내가 있다
- [ ] 순부동산 자산 등 계산값에 `계산` 배지가 있다
- [ ] 특정 후보·정당에 대한 평가성 문장이 없다
- [ ] 부동산 보유를 `투기`·`문제`로 단정하는 문장이 없다
- [ ] 출마 지역 vs 소재지 섹션에 중립 안내 문구가 있다
- [ ] 모바일에서 테이블 대신 카드 리스트가 표시된다
- [ ] 데스크톱에서 테이블이 overflow-x auto로 가로 스크롤된다
- [ ] 유형별 TOP 탭이 정상 전환된다
- [ ] 지역 교차 필터(전체/일치/불일치/확인불가)가 동작한다
- [ ] 정렬 버튼 전환 시 테이블과 카드 모두 재정렬된다
- [ ] FAQ 8개가 모두 표시된다
- [ ] 관련 리포트 링크 5개가 정상 이동한다
- [ ] `TrustPanel`에 선관위 출처 링크가 있다
- [ ] `reports.ts`, `app.scss`, `sitemap.xml` 반영이 완료된다
- [ ] `npm run build` 성공 확인

---

## 14. 구현 순서

1. `src/data/localElectionCandidateRealEstate2026.ts` — 타입 정의 + 빈 배열로 데이터 stub 생성
2. `src/pages/reports/local-election-candidate-real-estate-2026.astro` — 정적 구조 구현 (빌드 검증 우선)
3. `src/styles/scss/pages/_local-election-candidate-real-estate-2026.scss` — `lcre-` 전체 스타일
4. `src/styles/app.scss` — `@use` 추가
5. `src/data/reports.ts` — 등록
6. `public/sitemap.xml` — URL 추가
7. `public/scripts/local-election-candidate-real-estate-2026.js` — 필터·정렬·탭·지역 교차 인터랙션
8. 선관위 공개자료 수집 후 `localElectionCandidateRealEstate2026.ts` 실제 데이터 채우기
9. 빌드 검증 + QA 체크리스트 확인
10. 역링크: `local-election-candidate-assets-ranking-2026` 하단에 이 페이지 CTA 추가
