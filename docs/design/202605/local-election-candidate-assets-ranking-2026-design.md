# 2026 지방선거 후보 재산 순위 TOP 50 설계 문서

> 기획 원문: `docs/plan/202605/local-election-candidate-assets-ranking-2026.md`  
> 작성일: 2026-05-31  
> 콘텐츠 유형: `/reports/` 선거 데이터 리포트  
> 구현 기준: 후보자 공개자료 기반 TOP 50 랭킹, 부동산·금융자산·채무 분해, 지역·선거종류 필터, 후보자 정보 조회 가이드

---

## 1. 문서 개요

- 구현 대상: `2026 지방선거 후보 재산 순위 TOP 50`
- slug: `local-election-candidate-assets-ranking-2026`
- URL: `/reports/local-election-candidate-assets-ranking-2026/`
- 카테고리: 선거 데이터·공개재산 비교
- 핵심 검색 의도: `지방선거 후보 재산`, `후보 재산 순위`, `후보자 재산 조회`, `지방선거 후보 부동산`
- 페이지 성격: 공식 후보자 공개자료를 정리한 데이터 리포트. 특정 후보·정당 평가가 아니라 신고 재산의 구조를 읽기 쉽게 보여주는 비교 페이지다.

## 2. 구현 파일 구조

```text
src/
  data/
    localElectionCandidateAssetsRanking2026.ts
    reports.ts
  pages/
    reports/
      local-election-candidate-assets-ranking-2026.astro

public/
  scripts/
    local-election-candidate-assets-ranking-2026.js
  og/
    reports/
      local-election-candidate-assets-ranking-2026.png

src/styles/scss/pages/
  _local-election-candidate-assets-ranking-2026.scss
```

추가 반영:

- `src/data/reports.ts`
- `src/pages/reports/index.astro` 노출 확인
- `src/styles/app.scss`
- `public/sitemap.xml`
- 필요 시 `public/og/reports/` OG 이미지 생성

## 3. 레이아웃 방향

- 최상위 클래스: `report-page lecar-page`
- SCSS prefix: `lecar-`
- 선거 콘텐츠이므로 과한 정치 기사 톤을 피하고, 숫자·출처·기준일을 먼저 보여준다.
- 첫 화면에서 `공식자료 기준`, `시세 아님`, `자료 정정 가능`을 바로 인지하게 한다.
- 표가 핵심이지만 모바일에서는 표보다 후보 카드가 먼저 읽히도록 설계한다.
- 차트 라이브러리 없이 CSS bar, 카드, sticky table header로 충분히 구현한다.

권장 페이지 흐름:

```astro
<main class="report-page lecar-page" data-report="local-election-candidate-assets-ranking-2026">
  <Hero />
  <InfoNotice />
  <SummaryCards />
  <FilterToolbar />
  <RankingTable />
  <RankingCards />
  <DistributionSection />
  <RealEstateTopSection />
  <FinancialTopSection />
  <DebtNetAssetSection />
  <BattlegroundSection />
  <HowToCheckSection />
  <RelatedReports />
  <SeoContent />
</main>
```

## 4. 데이터 모델

파일: `src/data/localElectionCandidateAssetsRanking2026.ts`

```ts
export type CandidateAssetBadge =
  | "공식"
  | "보도확인"
  | "부분공개"
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

export type AssetSortKey =
  | "totalAssetsManwon"
  | "realEstateManwon"
  | "depositsManwon"
  | "securitiesManwon"
  | "debtsManwon"
  | "netAssetsManwon";

export type AssetTone =
  | "neutral"
  | "primary"
  | "asset"
  | "caution"
  | "muted";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: CandidateAssetBadge;
  note?: string;
}

export interface LocalElectionCandidateAsset {
  id: string;
  rank: number;
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  sidoName: string;
  districtName: string;
  totalAssetsManwon: number;
  realEstateManwon?: number;
  landManwon?: number;
  buildingManwon?: number;
  depositsManwon?: number;
  securitiesManwon?: number;
  debtsManwon?: number;
  netAssetsManwon?: number;
  realEstateRatio?: number;
  financialAssetRatio?: number;
  assetTags: string[];
  status: CandidateStatus;
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
  badge?: CandidateAssetBadge;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage?: number;
  tone?: AssetTone;
}

export interface BattlegroundLink {
  label: string;
  href: string;
  description: string;
  status: "준비중" | "게시됨";
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface ElectionGuideStep {
  title: string;
  body: string;
  href?: string;
}

export interface LocalElectionCandidateAssetsRankingData {
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
  candidates: LocalElectionCandidateAsset[];
  sidoDistribution: DistributionItem[];
  electionTypeDistribution: DistributionItem[];
  partyDistribution: DistributionItem[];
  battlegroundLinks: BattlegroundLink[];
  guideSteps: ElectionGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}
```

## 5. 데이터 가공 로직

데이터 파일 안에서 계산 가능한 파생값은 함수로 제공한다.

```ts
export function calcNetAssets(candidate: LocalElectionCandidateAsset) {
  return candidate.totalAssetsManwon - (candidate.debtsManwon ?? 0);
}

export function calcRealEstateRatio(candidate: LocalElectionCandidateAsset) {
  if (!candidate.totalAssetsManwon || !candidate.realEstateManwon) return null;
  return (candidate.realEstateManwon / candidate.totalAssetsManwon) * 100;
}

export function calcFinancialAssetRatio(candidate: LocalElectionCandidateAsset) {
  if (!candidate.totalAssetsManwon) return null;
  const financial = (candidate.depositsManwon ?? 0) + (candidate.securitiesManwon ?? 0);
  return (financial / candidate.totalAssetsManwon) * 100;
}

export function formatManwon(value?: number) {
  if (value === undefined || value === null) return "확인 필요";
  if (Math.abs(value) >= 10000) return `${(value / 10000).toFixed(1)}억`;
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}
```

주의:

- `netAssetsManwon`, `realEstateRatio`, `financialAssetRatio`는 `계산` 배지를 붙인다.
- 음수 재산 또는 채무 초과 케이스가 있을 수 있으므로 UI가 음수값을 깨지지 않게 처리한다.
- 공식 공개자료가 없거나 세부 항목이 없는 경우 `0`이 아니라 `undefined`를 사용한다.

## 6. 페이지 IA

1. Hero
2. 공식자료 기준 안내 `InfoNotice`
3. 핵심 KPI 카드 4개
4. 필터·정렬 툴바
5. 후보 재산 TOP 50 랭킹 테이블
6. 모바일 후보 카드 리스트
7. 시도·선거종류·정당별 TOP 50 분포
8. 부동산 신고액 TOP 20
9. 예금·증권·금융자산 TOP 20
10. 채무와 순자산 해석
11. 핫한 격전지 후보 재산 비교 CTA
12. 후보자 공개자료 보는 법
13. 관련 리포트 CTA
14. FAQ
15. `SeoContent`

## 7. 섹션 상세 설계

### 7-1. Hero

사용 컴포넌트:

```astro
<CalculatorHero
  eyebrow="선거 데이터 리포트"
  title="2026 지방선거 후보 재산 순위 TOP 50"
  description="중앙선거관리위원회 공개자료 기준으로 후보자의 총재산, 부동산, 예금, 증권, 채무를 한 화면에서 비교합니다."
/>
```

Hero 하단 보조 메타:

- `최근 업데이트: 2026.05.31`
- `선거일: 2026.06.03`
- `기준: 후보자 등록 신고자료`
- `단위: 만원·억원 병행 표기`

CTA:

- `재산 순위 보기`
- `후보자 공개자료 확인법`

### 7-2. InfoNotice

필수 문구:

```text
이 페이지는 후보자 공개자료를 비교하기 쉽게 정리한 참고 리포트입니다. 재산 신고액은 실제 현재 시세와 다를 수 있고, 후보자 본인 외 신고 대상 가족 재산이 포함될 수 있습니다. 후보 사퇴, 등록무효, 자료 정정이 있으면 순위가 달라질 수 있습니다.
```

### 7-3. Summary Cards

카드 4개:

| 카드 | 값 | 설명 |
| --- | --- | --- |
| 재산 1위 후보 | 후보명 + 총재산 | TOP 50 기준 |
| TOP 50 평균 재산 | 평균 총재산 | 채무 차감 전 신고액 |
| 부동산 신고액 1위 | 후보명 + 부동산 | 시세 아님 |
| 채무 신고액 1위 | 후보명 + 채무 | 순자산 해석 필요 |

클래스:

- `.lecar-summary-grid`
- `.lecar-summary-card`
- `.lecar-summary-card--primary`
- `.lecar-summary-card--caution`

### 7-4. Filter Toolbar

데스크톱:

- 검색 input: 후보자명·선거구 검색
- select: 시도
- select: 선거 종류
- select: 정당
- segmented buttons: 총재산순 / 부동산순 / 예금순 / 증권순 / 채무순 / 순자산순

모바일:

- 검색 input 1줄
- select 3개는 2열 그리드
- 정렬 버튼은 가로 스크롤 segmented control

접근성:

- 모든 필터에 `label` 또는 `aria-label` 제공
- 활성 정렬 버튼에 `aria-pressed="true"`
- 필터 결과 수를 `aria-live="polite"` 영역에 표시

### 7-5. Ranking Table

데스크톱 전용 핵심 표.

컬럼:

| 컬럼 | 표시 |
| --- | --- |
| 순위 | `#1` |
| 후보 | 이름, 정당, 상태 배지 |
| 선거 | 선거종류, 시도, 선거구 |
| 총재산 | 큰 숫자 |
| 부동산 | 금액 + 비중 |
| 예금·증권 | 금액 합산 또는 분리 |
| 채무 | 금액, 있으면 caution tone |
| 순자산 추정 | 계산 배지 |
| 특징 | assetTags |
| 출처 | 공식자료 링크 |

표 구현:

- `.lecar-table-wrap { overflow-x: auto; }`
- 최소 너비 1040px
- header sticky 가능
- 금액 셀은 우측 정렬
- 출처 링크는 새 탭

상태 배지:

- `등록`
- `사퇴`
- `등록무효`
- `정정확인`

사퇴/등록무효 후보는 기본 노출하되 opacity를 낮추고 상태 설명을 붙인다. 다만 순위 산정에서 제외할지 포함할지는 데이터 기준 문구에 명시한다.

### 7-6. Mobile Candidate Cards

모바일에서는 표 대신 카드가 기본이다.

카드 구성:

- 상단: 순위, 후보명, 정당, 상태
- 중간: 총재산 큰 숫자
- 자산 grid: 부동산 / 금융자산 / 채무 / 순자산
- 하단: 선거구, 태그, 출처 링크

클래스:

- `.lecar-candidate-list`
- `.lecar-candidate-card`
- `.lecar-candidate-card__metric-grid`

### 7-7. Distribution Section

3개 분포 카드:

- 시도별 TOP 50 분포
- 선거 종류별 분포
- 정당별 분포

UI:

- CSS horizontal bar rows
- 최댓값 대비 width 계산
- 카운트와 비율 동시 표시

문구 원칙:

- “특정 정당이 더 좋다/나쁘다” 표현 금지
- `TOP 50 표본 기준`임을 카드 상단에 표시

### 7-8. Real Estate Top 20

목적:

- `후보 부동산`, `후보 아파트`, `후보 재산 부동산` 검색 의도 대응

UI:

- 상위 5명은 compact card
- 나머지 15명은 slim ranking list
- 부동산 비중을 bar로 표시

필수 고지:

```text
부동산 신고액은 실제 현재 시세가 아니라 공개자료의 신고 기준 금액입니다.
```

### 7-9. Financial Top 20

탭 2개:

- 예금 TOP
- 증권 TOP

추가 카드:

- 금융자산 비중 높은 후보

주의:

- 증권은 신고 시점 평가액이며 현재 평가액이나 수익률이 아님을 표시한다.

### 7-10. Debt And Net Asset Section

구성:

- 채무 신고액 TOP 10
- 순자산 추정 TOP 10
- 총재산과 순자산 차이를 설명하는 산식 카드

산식 카드:

```text
순자산 추정 = 총재산 신고액 - 채무 신고액
```

주의:

- 공식 순자산이 아니라 이해를 돕기 위한 단순 계산값으로 표시한다.
- 채무 세부 항목이 공개되지 않거나 항목 분류가 제한적일 수 있음을 안내한다.

### 7-11. Battleground Links

카드 3개 우선:

- 서울시장 후보 재산·부동산 비교 2026
- 경기도지사 후보 재산·부동산 비교 2026
- 부산시장 후보 재산·부동산 비교 2026

카드 상태:

- 게시됨: 링크 활성
- 준비중: disabled 스타일, 클릭 불가 또는 허브로 연결

### 7-12. How To Check Section

검색 유입자를 잡는 설명 섹션.

단계:

1. 선거통계시스템 접속
2. 선거명과 지역 선택
3. 후보자명 클릭
4. 재산·병역·전과·납세·학력·경력 확인
5. 정책·공약마당에서 공약 확인

링크:

- 중앙선관위
- 선거통계시스템
- 정책·공약마당

## 8. 클라이언트 스크립트 설계

파일: `public/scripts/local-election-candidate-assets-ranking-2026.js`

역할:

- JSON 데이터 파싱
- 후보 검색
- 시도/선거종류/정당 필터
- 정렬 키 변경
- 데스크톱 표와 모바일 카드 동시 갱신
- 결과 수 표시

페이지 데이터 주입:

```astro
<script id="lecar-data" type="application/json" set:html={JSON.stringify(candidates)} />
<script type="module" src={withBase("/scripts/local-election-candidate-assets-ranking-2026.js")}></script>
```

DOM id/class:

```text
#lecar-data
#lecar-search
#lecar-sido-filter
#lecar-election-type-filter
#lecar-party-filter
#lecar-result-count
[data-lecar-sort]
#lecar-ranking-table-body
#lecar-candidate-list
```

정렬 로직:

```js
const sortCandidates = (items, key) =>
  [...items].sort((a, b) => (b[key] ?? -Infinity) - (a[key] ?? -Infinity));
```

필터 로직:

```js
const matchesSearch = (item, query) =>
  [item.candidateName, item.partyName, item.sidoName, item.districtName]
    .join(" ")
    .toLowerCase()
    .includes(query.toLowerCase());
```

프로그레시브 향상:

- JS 실패 시 서버 렌더링된 기본 TOP 50 표와 카드가 그대로 보인다.
- 필터는 JS가 로드된 뒤에만 동작한다.

## 9. 스타일 설계

파일: `src/styles/scss/pages/_local-election-candidate-assets-ranking-2026.scss`

### 9-1. 컬러 톤

- 정치적 진영색으로 오해될 수 있는 강한 빨강·파랑 단독 팔레트는 피한다.
- 기본은 사이트 공통 neutral + green/teal 계열의 데이터 톤.
- 경고/주의는 amber 계열을 소량 사용.
- 정당별 색상은 v1에서 사용하지 않는다. 정당명은 텍스트 배지만 표시한다.

### 9-2. 주요 클래스

```scss
.lecar-page {}
.lecar-meta-strip {}
.lecar-summary-grid {}
.lecar-summary-card {}
.lecar-filter-toolbar {}
.lecar-sort-scroll {}
.lecar-table-wrap {}
.lecar-ranking-table {}
.lecar-candidate-list {}
.lecar-candidate-card {}
.lecar-bar-list {}
.lecar-bar-row {}
.lecar-top-list {}
.lecar-formula-card {}
.lecar-battleground-grid {}
.lecar-guide-steps {}
.lecar-related-grid {}
```

### 9-3. 반응형

모바일 기본:

- 컨테이너 padding 16px
- KPI 1열
- 필터 1~2열
- 테이블 숨김, 후보 카드 표시
- 정렬 버튼 가로 스크롤

태블릿 `min-width: 768px`:

- KPI 2열
- 필터 3열
- 후보 카드 2열
- 분포 카드 2열

데스크톱 `min-width: 1024px`:

- KPI 4열
- 필터 toolbar 한 줄
- 테이블 표시
- 모바일 후보 카드 숨김 또는 보조 섹션으로 축소
- 분포 카드 3열

### 9-4. 표 안정성

- 금액 셀에는 `font-variant-numeric: tabular-nums;`
- `.lecar-table-wrap`에 `overflow-x: auto`
- sticky header 사용 시 배경색 지정
- 긴 후보명/선거구는 줄바꿈 허용
- 출처 링크는 버튼처럼 크게 만들지 않고 `공식자료` 텍스트 링크로 처리

## 10. SEO Content 설계

`SeoContent` intro는 최소 4단락, 각 150자 이상.

intro 구조:

1. 지방선거 후보 재산 공개자료를 왜 보는지
2. 총재산·부동산·금융자산·채무를 나눠 봐야 하는 이유
3. TOP 50 랭킹과 지역/선거종류 필터를 읽는 방법
4. 신고액의 한계와 공식자료 확인 필요성

inputPoints:

- 후보자 재산 신고액 상위 50명을 확인할 수 있습니다.
- 부동산·예금·증권·채무 기준으로 후보 자산 구조를 비교할 수 있습니다.
- 선관위 후보자 공개자료를 어디서 확인하는지 알 수 있습니다.

criteria:

- 중앙선거관리위원회 후보자 공개자료를 우선 기준으로 사용합니다.
- 금액은 신고 기준 금액이며 실제 시세와 다를 수 있습니다.
- 순자산과 비중은 이해를 돕기 위한 단순 계산값입니다.
- 후보 사퇴, 등록무효, 자료 정정이 있으면 순위가 바뀔 수 있습니다.

related:

- `/reports/seoul-mayor-candidate-assets-2026/`
- `/reports/gyeonggi-governor-candidate-assets-2026/`
- `/reports/lee-jaemyung-government-officials-assets-salary-2026/`
- `/tools/apartment-holding-tax/`

## 11. FAQ 설계

필수 FAQ:

1. 지방선거 후보 재산은 어디서 확인할 수 있나요?
2. 후보 재산 신고액에는 가족 재산도 포함되나요?
3. 부동산 신고액은 현재 시세인가요?
4. 총재산이 높으면 무조건 문제가 있나요?
5. 채무가 크면 재산 순위는 어떻게 봐야 하나요?
6. 후보자가 사퇴하면 순위도 바뀌나요?
7. 우리 동네 후보 재산도 볼 수 있나요?

답변 톤:

- 공식자료 확인 경로를 안내한다.
- 가치판단을 피한다.
- 신고 기준과 한계를 명확히 말한다.

## 12. 접근성·사용성

- 모든 필터에 명시적 label 또는 `aria-label`
- 정렬 버튼은 `button` 요소 사용
- 활성 정렬 버튼은 `aria-pressed`
- 결과 수 변화는 `aria-live="polite"`
- 표에는 `<caption>` 제공
- 링크 텍스트는 `여기` 금지, `선관위 후보자 공개자료 보기`처럼 목적을 직접 표시
- 모바일 카드에서도 출처 링크 제공
- 색상만으로 배지 의미를 전달하지 않고 텍스트를 함께 표시

## 13. 데이터 안전·표현 원칙

금지:

- 특정 후보 또는 정당 지지·반대 문구
- “부동산 투기 후보”, “서민 후보”, “재산 은닉”, “불법 재산”
- 선거 결과 예측
- 신고액을 실제 시세처럼 표현
- 보도값을 공식값처럼 표현

필수:

- `선관위 공개자료 기준`
- `신고액 기준`
- `실제 시세와 다를 수 있음`
- `후보자 본인 외 신고 대상 가족 재산 포함 가능`
- `자료 정정·후보 사퇴에 따라 바뀔 수 있음`

## 14. 테스트 체크리스트

### 빌드

- [ ] `npm run build` 성공
- [ ] TypeScript 데이터 import 오류 없음
- [ ] `public/sitemap.xml` XML 구조 유지

### UI

- [ ] 모바일 375px에서 후보 카드 텍스트가 넘치지 않는다.
- [ ] 데스크톱에서 TOP 50 표가 가로 스크롤 또는 충분한 폭으로 읽힌다.
- [ ] 필터·정렬 조작 시 결과 수가 갱신된다.
- [ ] JS 실패 시 기본 랭킹이 보인다.
- [ ] 후보명, 정당명, 선거구가 긴 경우 줄바꿈이 자연스럽다.

### 데이터

- [ ] 모든 후보에 출처와 기준일이 있다.
- [ ] `undefined` 세부 항목은 `확인 필요`로 표시된다.
- [ ] 순자산·비중 값에는 `계산` 배지가 붙는다.
- [ ] 사퇴·등록무효 후보 상태가 표시된다.
- [ ] 보도 확인값과 공식값이 섞이지 않는다.

### 정책·표현

- [ ] 후보·정당 평가성 문장이 없다.
- [ ] 의혹성 표현이 없다.
- [ ] 신고액이 시세가 아님을 상단과 FAQ에서 안내한다.
- [ ] 후보자 정보는 재산 외 공약·전과·납세·병역도 함께 확인해야 한다고 안내한다.

## 15. 구현 순서

1. `src/data/localElectionCandidateAssetsRanking2026.ts` 생성
2. 후보 샘플 데이터와 메타·FAQ·관련 링크 작성
3. `src/pages/reports/local-election-candidate-assets-ranking-2026.astro` 생성
4. 기본 서버 렌더링 표·카드 작성
5. `public/scripts/local-election-candidate-assets-ranking-2026.js` 작성
6. SCSS 작성 및 `src/styles/app.scss` 등록
7. `src/data/reports.ts` 등록
8. `public/sitemap.xml` URL 추가
9. `npm run build`
10. 모바일/데스크톱 수동 확인

## 16. v2 확장 후보

- 후보 2명 직접 비교 도구
- 광역단체장만 보기 모드
- 당선자 재산 순위 전환
- 후보 전과·납세·병역 요약 카드
- 지도형 시도별 분포
- 선거구별 후보 재산 비교 페이지 자동 생성

## 17. 최종 구현 방향

이 페이지는 선거 시즌 트래픽을 받는 단발성 콘텐츠가 아니라, 후보자 공개자료를 계속 연결하는 **선거 데이터 허브**로 구현한다. 가장 중요한 것은 랭킹보다 기준이다. 수치는 크게 보여주되, 선관위 공개자료 기준·신고액 한계·자료 정정 가능성을 반복해서 안내해야 한다.

사용자는 “누가 재산이 많나”로 들어오지만, 페이지를 나갈 때는 “총재산, 부동산, 금융자산, 채무를 나눠 봐야 한다”는 기준을 가져가야 한다. 비교계산소의 역할은 정치적 판단을 대신하는 것이 아니라, 공개된 숫자를 안전하고 읽기 쉬운 형태로 정리하는 것이다.
