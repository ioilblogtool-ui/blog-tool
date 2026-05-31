# 경기도지사 후보 재산·부동산 비교 2026 설계 문서

> 기획 원문: `docs/plan/202605/gyeonggi-governor-candidate-assets-2026.md`  
> 작성일: 2026-05-31  
> 콘텐츠 유형: `/reports/` 선거 후보 비교 리포트  
> 구현 기준: 추미애·양향자 후보 재산 신고액을 총재산, 부동산, 금융자산, 채무, 순자산 추정으로 분해하고 경기도 공약과 후보자 공개자료 조회 가이드까지 제공

---

## 1. 문서 개요

- 구현 대상: `경기도지사 후보 재산·부동산 비교 2026`
- slug: `gyeonggi-governor-candidate-assets-2026`
- URL: `/reports/gyeonggi-governor-candidate-assets-2026/`
- 카테고리: 선거 데이터·후보 재산 비교
- 핵심 검색 의도: `경기도지사 후보 재산`, `추미애 양향자 재산`, `추미애 재산`, `양향자 재산`, `경기도지사 후보 부동산`
- 페이지 성격: 공식 후보자 공개자료를 기반으로 경기도지사 후보의 자산 구조를 비교하는 데이터 리포트. 후보 지지·반대가 아니라 공개 신고액의 기준과 한계를 설명한다.

## 2. 구현 파일 구조

```text
src/
  data/
    gyeonggiGovernorCandidateAssets2026.ts
    reports.ts
  pages/
    reports/
      gyeonggi-governor-candidate-assets-2026.astro

public/
  scripts/
    gyeonggi-governor-candidate-assets-2026.js
  og/
    reports/
      gyeonggi-governor-candidate-assets-2026.png

src/styles/scss/pages/
  _gyeonggi-governor-candidate-assets-2026.scss
```

추가 반영:

- `src/data/reports.ts`
- `src/pages/reports/index.astro` 노출 확인
- `src/styles/app.scss`
- `public/sitemap.xml`
- 필요 시 `public/og/reports/` OG 이미지 생성

## 3. 레이아웃 방향

- 최상위 클래스: `report-page ggca-page`
- SCSS prefix: `ggca-`
- 추미애·양향자 2명 비교가 핵심이지만, 조응천 등 기타 등록 후보가 있으면 `전체 후보 보기`로 확장한다.
- 정치 기사 느낌보다 후보자 공개자료 비교 대시보드 느낌으로 구성한다.
- 정당색을 메인 컬러로 쓰지 않는다. 정당명은 텍스트 배지로만 표시한다.
- 경기도 핵심 의제인 주택·교통·산업 공약은 후보 개인 재산과 별도 섹션으로 분리한다.
- 첫 화면에서 `선관위 공개자료 기준`, `신고액 기준`, `시세 아님`, `자료 정정 가능`을 명확히 보여준다.

권장 페이지 흐름:

```astro
<main class="report-page ggca-page" data-report="gyeonggi-governor-candidate-assets-2026">
  <Hero />
  <InfoNotice />
  <CandidateSnapshot />
  <ComparisonTable />
  <AssetComposition />
  <RealEstateSection />
  <FinancialAssetSection />
  <DebtNetAssetSection />
  <PolicySeparationSection />
  <ExtraCandidates />
  <HowToCheckSection />
  <RelatedReports />
  <SeoContent />
</main>
```

## 4. 데이터 모델

파일: `src/data/gyeonggiGovernorCandidateAssets2026.ts`

```ts
export type CandidateAssetSourceBadge =
  | "선관위"
  | "재산공개"
  | "보도확인"
  | "계산"
  | "확인필요";

export type CandidateStatus =
  | "등록"
  | "사퇴"
  | "등록무효"
  | "정정확인";

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
  badge: CandidateAssetSourceBadge;
  note?: string;
}

export interface GyeonggiGovernorCandidateAsset {
  id: string;
  candidateName: string;
  partyName: string;
  currentRole: string;
  birthYear?: number;
  status: CandidateStatus;
  isPrimaryComparison: boolean;
  totalAssetsManwon: number;
  realEstateManwon?: number;
  landManwon?: number;
  buildingManwon?: number;
  jeonseRightManwon?: number;
  depositsManwon?: number;
  securitiesManwon?: number;
  debtsManwon?: number;
  netAssetsManwon?: number;
  realEstateRatio?: number;
  financialAssetRatio?: number;
  assetTags: string[];
  sourceBadge: CandidateAssetSourceBadge;
  sourceIds: string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  summary: string;
  caution?: string;
}

export interface CandidateMetricCard {
  label: string;
  candidateId?: string;
  value: string;
  description: string;
  tone: AssetTone;
  badge?: CandidateAssetSourceBadge;
}

export interface AssetCompositionSegment {
  key: "realEstate" | "deposit" | "securities" | "other" | "debt";
  label: string;
  valueManwon: number;
  ratio: number;
  tone: AssetTone;
}

export interface GyeonggiGovernorPolicySummary {
  candidateId: string;
  candidateName: string;
  housingSummary: string;
  transportSummary: string;
  industrySummary: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface CandidateGuideStep {
  title: string;
  body: string;
  href?: string;
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface GyeonggiGovernorCandidateAssetsData {
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
  candidates: GyeonggiGovernorCandidateAsset[];
  metricCards: CandidateMetricCard[];
  policySummaries: GyeonggiGovernorPolicySummary[];
  guideSteps: CandidateGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}
```

## 5. 데이터 가공 로직

데이터 파일에서 공통 포맷터와 계산 함수를 함께 export한다.

```ts
export function calcNetAssets(candidate: GyeonggiGovernorCandidateAsset) {
  return candidate.totalAssetsManwon - (candidate.debtsManwon ?? 0);
}

export function calcRealEstateRatio(candidate: GyeonggiGovernorCandidateAsset) {
  if (!candidate.totalAssetsManwon || !candidate.realEstateManwon) return null;
  return (candidate.realEstateManwon / candidate.totalAssetsManwon) * 100;
}

export function calcFinancialAssetRatio(candidate: GyeonggiGovernorCandidateAsset) {
  if (!candidate.totalAssetsManwon) return null;
  const financial = (candidate.depositsManwon ?? 0) + (candidate.securitiesManwon ?? 0);
  return (financial / candidate.totalAssetsManwon) * 100;
}

export function calcOtherAssets(candidate: GyeonggiGovernorCandidateAsset) {
  return Math.max(
    candidate.totalAssetsManwon -
      (candidate.realEstateManwon ?? 0) -
      (candidate.depositsManwon ?? 0) -
      (candidate.securitiesManwon ?? 0),
    0
  );
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

- 보도 참고값은 `확인필요` 또는 `보도확인` 배지로만 다룬다.
- 구현 직전 선관위 원문 수치를 우선하며, 보도값과 다르면 공식자료 기준으로 덮어쓴다.
- `netAssetsManwon`, `realEstateRatio`, `financialAssetRatio`는 공식 원문값이 아니라 계산값이므로 `계산` 배지를 표시한다.
- 기타 후보는 `isPrimaryComparison: false`로 두고 기본 비교 카드에서는 제외한다.

## 6. 페이지 IA

1. Hero
2. 공식자료 기준 안내 `InfoNotice`
3. 후보 2명 스냅샷 카드
4. 총재산·부동산·금융자산·채무 핵심 KPI
5. 추미애 vs 양향자 재산 상세 비교표
6. 자산 구성 누적 막대
7. 부동산 신고액 비교
8. 예금·증권·금융자산 비교
9. 채무와 순자산 추정
10. 경기도 공약과 후보 개인 재산 분리 안내
11. 기타 등록 후보 접기/펼치기
12. 경기도지사 후보 공개자료 보는 법
13. 관련 리포트 CTA
14. FAQ
15. `SeoContent`

## 7. 섹션 상세 설계

### 7-1. Hero

사용 컴포넌트:

```astro
<CalculatorHero
  eyebrow="선거 데이터 리포트"
  title="경기도지사 후보 재산·부동산 비교 2026"
  description="추미애·양향자 경기도지사 후보의 재산 신고액을 총재산, 부동산, 예금, 증권, 채무 기준으로 나눠 비교합니다."
/>
```

Hero 하단 메타 strip:

- `최근 업데이트: 2026.05.31`
- `선거일: 2026.06.03`
- `기준: 후보자 등록 공개자료`
- `단위: 만원·억원 병행 표기`

CTA:

- `후보 재산 비교하기`
- `선관위 공개자료 보는 법`

### 7-2. InfoNotice

필수 문구:

```text
이 페이지는 경기도지사 후보자 공개자료를 비교하기 쉽게 정리한 참고 리포트입니다. 재산 신고액은 실제 현재 시세와 다를 수 있고, 후보자 본인 외 신고 대상 가족 재산이 포함될 수 있습니다. 후보 등록 이후 정정, 사퇴, 등록무효가 발생하면 비교표가 바뀔 수 있습니다.
```

### 7-3. Candidate Snapshot

기본 비교 후보 2명 카드를 나란히 배치한다.

카드 구성:

- 후보명
- 정당명 배지
- 현직·전직 정보
- 총재산 큰 숫자
- 핵심 태그 2~4개
- 출처 배지와 기준일
- 한줄 요약

클래스:

- `.ggca-candidate-grid`
- `.ggca-candidate-card`
- `.ggca-candidate-card__name`
- `.ggca-party-badge`
- `.ggca-source-badge`

모바일:

- 1열 카드 스택
- 후보 카드는 동일 위계로 처리한다.

### 7-4. Metric Cards

4개 KPI:

| 카드 | 설명 |
| --- | --- |
| 총재산 상단 후보 | 두 후보 중 총재산이 큰 후보와 금액 |
| 후보별 신고액 차이 | 총재산 차이 또는 배수 |
| 부동산 비중 비교 | 후보별 부동산 비중 |
| 채무 반영 순자산 | 총재산-채무 단순 계산값 |

클래스:

- `.ggca-metric-grid`
- `.ggca-metric-card`
- `.ggca-metric-card--primary`
- `.ggca-metric-card--caution`

### 7-5. Comparison Table

후보 2명 기본 비교표.

행 중심 표를 권장한다. 후보 수가 적기 때문에 컬럼에 후보를 놓고, 행에 항목을 놓으면 모바일에서 읽기 쉽다.

| 항목 | 추미애 | 양향자 |
| --- | ---: | ---: |
| 총재산 | 금액 | 금액 |
| 부동산 | 금액 | 금액 |
| 예금 | 금액 | 금액 |
| 증권 | 금액 | 금액 |
| 채무 | 금액 | 금액 |
| 순자산 추정 | 금액 | 금액 |
| 부동산 비중 | % | % |
| 금융자산 비중 | % | % |

표 구현:

- `.ggca-table-wrap { overflow-x: auto; }`
- 금액 셀 우측 정렬
- 계산값 행에는 `계산` 배지
- 확인되지 않은 값은 `확인 필요`

### 7-6. Asset Composition

후보별 누적 막대 2개.

구간:

- 부동산
- 예금
- 증권
- 기타
- 채무는 누적 막대에 섞지 않고 별도 debt row로 표시

구현:

```astro
<div class="ggca-composition-row">
  <div class="ggca-composition-label">추미애</div>
  <div class="ggca-stacked-bar">
    <span class="ggca-stacked-bar__segment ggca-stacked-bar__segment--real-estate" style={`width:${ratio}%`} />
  </div>
</div>
```

주의:

- `style width`는 데이터 기반 인라인 허용.
- 모든 segment에는 텍스트 legend를 별도로 제공해 색상 의존을 피한다.

### 7-7. Real Estate Section

목적:

- `경기도지사 후보 부동산`, `추미애 양향자 부동산` 검색 의도 대응

구성:

- 후보별 부동산 신고액 카드
- 부동산 비중 bar
- 토지·건물·전세권 세부값이 있으면 mini breakdown
- 1기 신도시, GTX, 주택공급 이슈와 정책 섹션으로 연결하는 안내 문구

필수 고지:

```text
부동산 신고액은 실제 현재 시세가 아니라 공개자료의 신고 기준 금액입니다.
```

### 7-8. Financial Asset Section

구성:

- 예금 신고액 비교
- 증권 신고액 비교
- 예금+증권 합산 금융자산 비중
- 후보별 한줄 요약

주의:

```text
증권 보유 내역은 신고 시점의 평가액 기준이며 현재 평가액이나 실제 수익률을 의미하지 않습니다.
```

### 7-9. Debt And Net Asset Section

구성:

- 후보별 채무 신고액
- 후보별 순자산 추정
- 산식 카드

산식 카드:

```text
순자산 추정 = 총재산 신고액 - 채무 신고액
```

주의:

- 순자산 추정은 공식 선관위 수치가 아니라 비교계산소의 단순 계산값이다.
- 채무 세부 항목은 주택담보대출, 임대보증금, 금융채무 등 성격이 다를 수 있다.

### 7-10. Policy Separation Section

정책 공약과 후보 개인 재산을 분리해서 읽게 만드는 안전 섹션.

구성:

- 후보별 주택·교통·산업 공약 요약 카드
- 정책·공약마당 링크
- 재산 신고액과 공약을 단정적으로 연결하지 말라는 안내

공약 카드 필드:

- 주택: 공공주택, 재개발·재건축, 1기 신도시 등
- 교통: GTX, 광역버스, 철도망, 출퇴근 시간 등
- 산업: 반도체벨트, 일자리, GRDP 성장, 첨단산업 등

문구:

```text
재산 신고액은 후보자의 개인 자산 공개자료이고, 공약은 경기도 정책 방향입니다. 두 정보는 함께 참고할 수 있지만 하나가 다른 하나의 옳고 그름을 자동으로 증명하지는 않습니다.
```

### 7-11. Extra Candidates

조응천 등 기타 등록 후보가 있을 경우 제공한다.

UI:

- `전체 후보 보기` 버튼
- 접힌 상태에서는 후보 수만 표시
- 펼친 상태에서 compact table 또는 mini card 표시

필드:

- 후보명
- 정당
- 총재산
- 부동산
- 채무
- 출처

주의:

- 최종 등록 후보 기준으로만 표시한다.
- 후보 사퇴·등록무효 상태가 있으면 상태 배지를 붙인다.

### 7-12. How To Check Section

단계:

1. 선거통계시스템 접속
2. 제9회 전국동시지방선거 선택
3. 경기도지사 후보 선택
4. 후보자명 클릭
5. 재산·전과·병역·납세·공약 확인

링크:

- 중앙선관위
- 선거통계시스템
- 정책·공약마당

### 7-13. Related Reports

카드 4개:

- 전국 후보 재산 순위 TOP 50
- 광역단체장 후보 평균 재산 비교
- 서울시장 후보 재산·부동산 비교
- 아파트 보유세 계산기

## 8. 클라이언트 스크립트 설계

파일: `public/scripts/gyeonggi-governor-candidate-assets-2026.js`

MVP 역할:

- 금액 단위 토글: `억원` / `만원`
- 기타 후보가 있을 경우 `전체 후보 보기` 접기/펼치기
- 후보 카드 클릭 시 해당 후보의 상세 영역 강조

페이지 데이터 주입:

```astro
<script id="ggca-data" type="application/json" set:html={JSON.stringify(candidates)} />
<script type="module" src={withBase("/scripts/gyeonggi-governor-candidate-assets-2026.js")}></script>
```

DOM id/class:

```text
#ggca-data
[data-ggca-unit-toggle]
[data-ggca-money]
[data-ggca-candidate-card]
[data-ggca-candidate-detail]
#ggca-extra-candidates
#ggca-extra-toggle
```

단위 토글 로직:

```js
const formatMoney = (value, unit) => {
  if (value == null) return "확인 필요";
  if (unit === "manwon") return `${value.toLocaleString("ko-KR")}만원`;
  return `${(value / 10000).toFixed(1)}억`;
};
```

프로그레시브 향상:

- JS 실패 시 기본 표와 카드가 보인다.
- 단위 토글 없이도 기본 `억원` 표기가 제공된다.

## 9. 스타일 설계

파일: `src/styles/scss/pages/_gyeonggi-governor-candidate-assets-2026.scss`

### 9-1. 컬러 톤

- 정당색 중심 팔레트 금지.
- 사이트 공통 neutral 기반 + teal/green 데이터 포인트 사용.
- 주의 문구와 채무는 amber 계열을 소량 사용.
- 후보 카드는 동일한 시각 위계로 처리한다.

### 9-2. 주요 클래스

```scss
.ggca-page {}
.ggca-meta-strip {}
.ggca-candidate-grid {}
.ggca-candidate-card {}
.ggca-party-badge {}
.ggca-source-badge {}
.ggca-metric-grid {}
.ggca-metric-card {}
.ggca-table-wrap {}
.ggca-comparison-table {}
.ggca-composition-grid {}
.ggca-stacked-bar {}
.ggca-stacked-bar__segment {}
.ggca-breakdown-grid {}
.ggca-formula-card {}
.ggca-policy-grid {}
.ggca-extra-candidates {}
.ggca-guide-steps {}
.ggca-related-grid {}
```

### 9-3. 반응형

모바일 기본:

- 후보 카드 1열
- KPI 1열
- 비교표는 행 중심 표로 가로 스크롤 최소화
- 자산 구성 막대는 후보별 세로 스택
- 기타 후보는 접힌 상태로 시작

태블릿 `min-width: 768px`:

- 후보 카드 2열
- KPI 2열
- 정책 카드 2열
- 관련 링크 2열

데스크톱 `min-width: 1024px`:

- 후보 카드 2열 유지
- KPI 4열
- 자산 구성과 표를 2단 섹션으로 배치 가능
- 관련 링크 4열

### 9-4. 숫자 안정성

- 금액 셀은 `font-variant-numeric: tabular-nums;`
- 긴 금액은 줄바꿈 가능하게 두되, 버튼 안에는 넣지 않는다.
- `확인 필요`는 숫자와 같은 색이 아니라 muted tone.

## 10. SEO Content 설계

`SeoContent` intro는 최소 4단락, 각 150자 이상.

intro 구조:

1. 경기도지사 후보 재산 공개자료를 보는 이유
2. 총재산·부동산·금융자산·채무를 나눠 봐야 하는 이유
3. 추미애·양향자 후보 비교표와 자산 구성 막대를 읽는 법
4. 신고액의 한계와 선관위 원문 확인 필요성

inputPoints:

- 추미애·양향자 후보의 총재산 신고액을 비교할 수 있습니다.
- 부동산·예금·증권·채무 기준으로 후보별 자산 구조를 확인할 수 있습니다.
- 경기도지사 후보자 공개자료와 공약을 어디서 확인하는지 알 수 있습니다.

criteria:

- 중앙선거관리위원회 후보자 공개자료를 우선 기준으로 사용합니다.
- 금액은 신고 기준 금액이며 실제 현재 시세와 다를 수 있습니다.
- 순자산과 비중은 이해를 돕기 위한 단순 계산값입니다.
- 후보 사퇴, 등록무효, 자료 정정이 있으면 비교표가 바뀔 수 있습니다.

related:

- `/reports/local-election-candidate-assets-ranking-2026/`
- `/reports/governor-mayor-candidate-assets-comparison-2026/`
- `/reports/seoul-mayor-candidate-assets-2026/`
- `/tools/apartment-holding-tax/`

## 11. FAQ 설계

필수 FAQ:

1. 경기도지사 후보 재산은 어디서 확인할 수 있나요?
2. 추미애·양향자 후보 재산은 어떤 기준인가요?
3. 부동산 신고액은 현재 아파트 시세인가요?
4. 후보 재산에는 배우자 재산도 포함되나요?
5. 채무가 있으면 총재산은 어떻게 봐야 하나요?
6. 후보 재산과 경기도 공약은 어떻게 연결해서 봐야 하나요?
7. 선거 후에도 이 페이지를 볼 수 있나요?

답변 톤:

- 공식자료 확인 경로를 안내한다.
- 후보 선택을 유도하지 않는다.
- 신고 기준과 한계를 명확히 말한다.

## 12. 접근성·사용성

- 후보 카드는 동일한 레이아웃과 위계로 제공한다.
- 비교표에는 `<caption>` 제공
- 단위 토글 버튼은 `aria-pressed`
- `전체 후보 보기` 버튼에는 `aria-expanded`
- 후보 카드 클릭 강조는 색상 외 outline 또는 shadow도 함께 사용
- 출처 링크 텍스트는 `선관위 후보자 공개자료 보기`처럼 목적을 직접 표시
- 정책 공약 링크는 재산 출처 링크와 분리한다.
- 색상만으로 배지 의미를 전달하지 않고 텍스트를 함께 표시한다.

## 13. 데이터 안전·표현 원칙

금지:

- 특정 후보 또는 정당 지지·반대 문구
- “부동산 투기”, “서민 후보”, “재산 은닉”, “불법 재산”
- 선거 결과 예측
- 신고액을 실제 시세처럼 표현
- 보도값을 공식값처럼 표현
- 후보 개인 재산과 정책 공약을 단정적으로 연결

필수:

- `선관위 공개자료 기준`
- `신고액 기준`
- `실제 시세와 다를 수 있음`
- `후보자 본인 외 신고 대상 가족 재산 포함 가능`
- `자료 정정·후보 사퇴에 따라 바뀔 수 있음`
- `재산과 공약은 함께 참고하되 별도 정보`

## 14. 테스트 체크리스트

### 빌드

- [ ] `npm run build` 성공
- [ ] TypeScript 데이터 import 오류 없음
- [ ] `public/sitemap.xml` XML 구조 유지

### UI

- [ ] 모바일 375px에서 후보 카드 텍스트와 금액이 넘치지 않는다.
- [ ] 후보 2명 카드가 동일한 위계로 보인다.
- [ ] 기타 후보 토글이 있으면 접기/펼치기가 동작한다.
- [ ] 비교표가 모바일에서 가로 스크롤 없이 읽히거나 자연스럽게 스크롤된다.
- [ ] 자산 구성 막대 segment가 0 또는 undefined 값에도 깨지지 않는다.
- [ ] 단위 토글이 동작하고 JS 실패 시 기본 금액이 보인다.

### 데이터

- [ ] 추미애·양향자 후보 수치를 선관위 원문 기준으로 재검증했다.
- [ ] 기타 경기도지사 등록 후보 포함 여부를 최종 확인했다.
- [ ] 모든 수치에 출처와 기준일이 있다.
- [ ] `undefined` 세부 항목은 `확인 필요`로 표시된다.
- [ ] 순자산·비중 값에는 `계산` 배지가 붙는다.
- [ ] 보도 확인값과 공식값이 섞이지 않는다.

### 정책·표현

- [ ] 후보·정당 평가성 문장이 없다.
- [ ] 의혹성 표현이 없다.
- [ ] 신고액이 시세가 아님을 상단과 FAQ에서 안내한다.
- [ ] 후보 개인 재산과 경기도 공약을 단정적으로 연결하지 않는다.

## 15. 구현 순서

1. `src/data/gyeonggiGovernorCandidateAssets2026.ts` 생성
2. 후보 데이터와 메타·FAQ·관련 링크 작성
3. `src/pages/reports/gyeonggi-governor-candidate-assets-2026.astro` 생성
4. 후보 스냅샷 카드와 비교표 서버 렌더링
5. 자산 구성 막대와 부동산/금융/채무 섹션 작성
6. 기타 후보 토글 섹션 작성
7. `public/scripts/gyeonggi-governor-candidate-assets-2026.js` 작성
8. SCSS 작성 및 `src/styles/app.scss` 등록
9. `src/data/reports.ts` 등록
10. `public/sitemap.xml` URL 추가
11. `npm run build`
12. 모바일/데스크톱 수동 확인

## 16. v2 확장 후보

- 후보자 전과·납세·병역 요약 카드
- 후보별 공약 상세 비교
- 1기 신도시·GTX·반도체벨트 공약 상세 카드
- 후보 공개재산 전년 대비 변화
- 당선자 재산 공개 아카이브 전환
- 경기도 주요 시군 주택 공약 연결 섹션

## 17. 최종 구현 방향

이 페이지는 `경기도지사 후보 재산`, `추미애 재산`, `양향자 재산`으로 들어오는 사용자를 받는 경기도지사 선거 특화 리포트다. 사용자는 후보별 재산 규모를 알고 싶어 들어오지만, 페이지는 단순 승패식 비교가 아니라 총재산·부동산·금융자산·채무를 분리해서 읽는 기준을 제공해야 한다.

가장 중요한 것은 후보 개인 재산과 경기도 정책 공약을 섞어 단정하지 않는 것이다. 경기도지사 선거는 주택, GTX, 산업벨트 같은 생활 의제가 크기 때문에 공약 섹션은 유용하지만, 후보 재산 신고액과 정책의 옳고 그름을 자동으로 연결하면 안 된다. 비교계산소의 역할은 판단을 대신하는 것이 아니라, 공개된 정보를 안전하고 읽기 쉬운 형태로 정리하는 것이다.
