# 서울 25개 구 전월세 전환 지도 2026 — 설계 문서

> 기획 원문: `docs/plan/202604/seoul-jeonwolse-ratio-2026.md`
> 작성일: 2026-04-14
> 구현 기준: Claude/Codex가 이 문서를 보고 바로 `/reports/` 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `seoul-apartment-jeonse-report`, `seoul-housing-2016-vs-2026`, `salary-asset-2016-vs-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/seoul-jeonwolse-ratio-2026.md`
- 구현 대상: `서울 25개 구 전월세 전환 지도: 전세는 어디서 사라지고 있나 [2026 데이터 리포트]`
- 권장 slug: `seoul-jeonwolse-ratio-2026`
- 권장 URL: `/reports/seoul-jeonwolse-ratio-2026/`

### 1-2. 페이지 성격

- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름:
  - `서울 전체 구조 요약 -> 25개 구 비교 -> 전환 속도 확인 -> 반전세/보증금 구간 해석 -> 세입자 실부담 시뮬레이션 -> 계산기 CTA`
- 톤은 `공포 조장`이 아니라 `공식 데이터 재가공 + 체감형 해석 + 다음 액션 제시`

### 1-3. 이 문서의 역할

- 현재 비교계산소 `/reports/` 구현 패턴에 맞게 기획 문서를 실제 구현 직전 수준으로 고정한다.
- 데이터 스키마, 섹션 목적, 차트 종류, 인터랙션, CTA, QA 기준을 확정한다.
- 구현자는 이 문서 기준으로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/`, `src/data/reports.ts` 작업을 진행한다.

---

## 2. 현재 프로젝트 기준 정리

### 2-1. 리포트 공통 구조

현재 `/reports/` 콘텐츠는 대체로 아래 흐름을 따른다.

1. `BaseLayout`
2. `SiteHeader`
3. `CalculatorHero`
4. `InfoNotice`
5. 상단 브리프 보드 / KPI 카드
6. 차트 / 비교표 / 카드 보드
7. 가벼운 탐색 인터랙션
8. 인사이트 카드 / FAQ / 출처
9. 관련 계산기 / 리포트 CTA
10. `SeoContent`

### 2-2. 이번 리포트의 구현 원칙

- `SimpleToolShell`은 사용하지 않는다.
- `Astro + data seed + vanilla JS + Chart.js UMD CDN` 패턴을 따른다.
- 지도형 인터랙션은 외부 맵 라이브러리 없이 구현한다.
- MVP에서는 `25개 자치구 카드/그리드 보드 + 순위표 + 차트`를 기본으로 한다.
- 확장 버전에서만 `SVG 기반 서울 25구 지도`를 고려한다.

### 2-3. 권장 파일 구조

```text
src/
  data/
    seoulJeonwolseRatio2026.ts
  pages/
    reports/
      seoul-jeonwolse-ratio-2026.astro

public/
  scripts/
    seoul-jeonwolse-ratio-2026.js
  og/
    reports/
      seoul-jeonwolse-ratio-2026.png

src/styles/scss/pages/
  _seoul-jeonwolse-ratio-2026.scss
```

추가 반영 파일:

- `src/data/reports.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 범위

- 서울 전체 전월세 구조 요약
- 25개 구 전세 비중 / 월세 비중 / 반전세 비중 비교
- 2021 대비 2026 최신 공개 기준 변화폭 비교
- `전세 잔존율 TOP5 / BOTTOM5`
- `월세 전환 속도 TOP5`
- 강남3구 vs 노도강 비교 보드
- 보증금 규모별 전환율 해석 보드
- 세입자 실부담 시뮬레이션 카드
- FAQ / 출처 / 내부 CTA

### 3-2. MVP 제외 범위

- 실시간 OpenAPI 호출
- 대화형 지리 지도 라이브러리
- 구별 개별 매물 탐색
- 월별 시계열 drill-down
- 사용자 맞춤 저장 기능

### 3-3. 확장 후보

- SVG 서울 25구 map overlay
- 구별 hover tooltip
- 연도 슬라이더
- `전세 vs 월세 계산기`와 query string 연동

---

## 4. 페이지 목적

- 사용자가 서울 전월세 시장이 `전세 중심 -> 월세/반전세 혼합 구조`로 이동 중이라는 점을 빠르게 이해하게 한다.
- 단순 기사형 설명이 아니라 `어느 구에서`, `얼마나`, `어떤 방식으로` 전환이 진행됐는지 보여준다.
- 세입자 관점에서 `전세가 줄어든다`는 말이 실제로 어떤 비용 압박으로 이어지는지 설명한다.
- 하단에서 관련 계산기로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 서울 세입자 / 예비 세입자

- `서울 전세 월세 비율`, `서울 구별 전세 비중`, `서울 월세 전환 빠른 지역` 검색으로 유입
- 서울 전체 흐름을 먼저 보고, 자신이 보는 구가 어느 위치인지 확인
- 이후 전환 비용 시뮬레이션과 계산기로 이동

### 5-2. 신혼부부 / 1인가구 실수요자

- 전세가 줄었다는 체감을 지역 단위로 확인하고 싶어함
- 전세만 볼지 반전세까지 볼지 판단 기준이 필요함

### 5-3. 콘텐츠형 검색 유입 사용자

- 전세 잔존율 TOP/BOTTOM 구만 빠르게 보고 이탈할 수 있음
- 따라서 상단 요약과 랭킹 섹션의 가독성이 중요함

---

## 6. 데이터 설계 (`src/data/seoulJeonwolseRatio2026.ts`)

### 6-1. 타입 정의

```ts
export type DistrictGroup = "gangnam3" | "nodo강" | "west" | "north" | "center" | "etc";
export type RankingMode = "leaseRatio" | "monthlyGrowth" | "semiMonthlyRatio";
export type SecondaryMetric = "leaseRatio" | "monthlyRatio" | "semiMonthlyRatio" | "conversionRate";
export type DepositBandKey = "under1" | "1to3" | "3to5" | "over5";

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  methodology: string;
  caution: string;
  updatedAt: string;
}

export interface SummaryKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "warn";
}

export interface SeoulRatioPoint {
  year: number;
  leaseRatio: number;
  monthlyRatio: number;
  semiMonthlyRatio: number;
  conversionRate: number;
}

export interface DistrictRatioRow {
  district: string;
  group: DistrictGroup;
  leaseRatio2021: number;
  leaseRatio2026: number;
  monthlyRatio2021: number;
  monthlyRatio2026: number;
  semiMonthlyRatio2026: number;
  conversionRate2026: number;
  avgDepositEok?: number;
  avgMonthlyManwon?: number;
  interpretation: string;
  tags: string[];
}

export interface DistrictHighlightCard {
  district: string;
  title: string;
  summary: string;
  why: string;
  signal: string;
}

export interface GroupCompareCard {
  key: "gangnam3" | "nodo강";
  title: string;
  leaseRatio2026: number;
  monthlyRatio2026: number;
  semiMonthlyRatio2026: number;
  avgDepositEok: number;
  avgMonthlyManwon: number;
  summary: string;
}

export interface DepositBandRow {
  key: DepositBandKey;
  label: string;
  conversionRate: number;
  summary: string;
}

export interface TenantScenario {
  id: string;
  title: string;
  beforeDepositEok: number;
  afterDepositEok: number;
  monthlyManwon: number;
  annualBurdenManwon: number;
  summary: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface SourceLink {
  label: string;
  href: string;
}
```

### 6-2. 데이터 구성

권장 export 구조:

```ts
export const seoulJeonwolseRatio2026 = {
  meta,
  heroSummary,
  kpis,
  citySeries,
  districtRows,
  districtHighlights,
  groupCompare,
  depositBands,
  tenantScenarios,
  faq,
  relatedLinks,
  sourceLinks,
} as const;
```

### 6-3. 데이터 설계 원칙

- 모든 수치는 고정 데이터로 보관한다.
- 차트/표/KPI가 서로 다른 원본을 보지 않게 `citySeries`, `districtRows`를 단일 소스로 쓴다.
- `2026`은 반드시 `2026-04-14 기준 최신 공개 데이터(YTD)` 같은 문구와 함께 사용한다.
- 해석 문구는 데이터 바로 옆에 두되, 인과 단정은 피한다.

### 6-4. 필수 유틸

```ts
export function getTopDistricts(mode: RankingMode, limit = 5) {}
export function getBottomDistricts(mode: RankingMode, limit = 5) {}
export function getDistrictRow(district: string) {}
```

---

## 7. 페이지 구조 (`src/pages/reports/seoul-jeonwolse-ratio-2026.astro`)

### 7-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. Editor's Brief 보드
4. KPI 카드 4개
5. 서울 전체 구조 차트
6. 25개 구 랭킹 + 그리드 보드
7. TOP5 / BOTTOM5 표
8. 강남3구 vs 노도강 비교 보드
9. 보증금 구간별 전환율 보드
10. 세입자 실부담 시뮬레이션
11. FAQ
12. 출처 링크
13. 관련 계산기 CTA
14. `SeoContent`

### 7-2. 기본 레이아웃 예시

```astro
<BaseLayout title={report.meta.title} description={report.meta.subtitle}>
  <SiteHeader />

  <main class="container page-shell report-page sjr-page">
    <CalculatorHero ... />
    <InfoNotice ... />

    <section class="content-section sjr-hero-board">...</section>
    <section class="content-section sjr-kpi-section">...</section>
    <section class="content-section sjr-city-chart-section">...</section>
    <section class="content-section sjr-district-board-section">...</section>
    <section class="content-section sjr-ranking-section">...</section>
    <section class="content-section sjr-group-section">...</section>
    <section class="content-section sjr-band-section">...</section>
    <section class="content-section sjr-scenario-section">...</section>
    <section class="content-section sjr-links-section">...</section>
    <SeoContent ... />
  </main>
</BaseLayout>
```

### 7-3. 데이터 seed 주입

기존 리포트 패턴에 맞춰 JSON seed를 inline으로 넣는다.

```astro
<script id="seoulJeonwolseRatio2026Data" type="application/json">
  {JSON.stringify(report)}
</script>
```

---

## 8. 섹션별 구현 상세

### 8-1. Hero

- eyebrow: `서울 부동산 리포트`
- title: `서울 25개 구 전월세 전환 지도`
- description: `전세는 어디서 사라지고 있고, 월세와 반전세는 어디서 더 빨리 늘고 있는지 2026 최신 공개 기준으로 비교합니다.`

### 8-2. InfoNotice

필수 안내 문구:

- `2026년 전체 확정치가 아니라 2026-04-14 기준 최신 공개 데이터(YTD) 재가공`
- `서울시 공개 전월세 실거래 및 전월세 전환율 통계 기반`
- `구별 비교는 동일 기준·동일 기간으로 맞춘 참고용 비교`

### 8-3. Editor's Brief 보드

목적:

- 첫 화면에서 `전세 감소 + 월세화 + 반전세 증가`를 동시에 이해시키는 섹션

구성:

- 리드 문단 1개
- 핵심 칩 3개
  - `서울 전체 전세 비중 xx%`
  - `월세형 계약 비중 xx%`
  - `전세 잔존율 1위 / 월세 전환 fastest 구`

### 8-4. KPI 카드

권장 4개:

- `서울 전체 전세 비중`
- `서울 전체 월세 비중`
- `전세 잔존율 1위 구`
- `월세 전환 속도 fastest 구`

### 8-5. 서울 전체 구조 차트

차트 1: `2021 vs 2026 구조 비교`

- 타입: stacked bar 또는 grouped bar
- 데이터: `leaseRatio`, `monthlyRatio`, `semiMonthlyRatio`
- 목적: 서울 전체 구조 변화 한눈 요약

차트 2: `2021 -> 2026 전환 추이`

- 타입: line
- 데이터: `citySeries`
- 토글: `전세 비중 / 월세 비중 / 반전세 비중 / 전환율`

### 8-6. 25개 구 그리드 보드

이 섹션이 이번 페이지의 핵심 인터랙션이다.

구성:

- 25개 구를 카드형 또는 compact grid로 배치
- 각 카드 표시 요소:
  - 구 이름
  - 전세 비중 2026
  - 2021 대비 변화폭
  - 월세 비중 2026
  - 짧은 해석 라벨

상태:

- `data-district`
- 활성 카드 선택 시 우측 또는 하단 detail panel 업데이트

MVP 결정:

- 외부 지도 라이브러리 대신 `district grid board`로 구현
- 확장 시 SVG 서울 지도 추가 가능

### 8-7. TOP5 / BOTTOM5 랭킹 섹션

토글 3종:

- `전세 잔존율 순`
- `월세 증가폭 순`
- `반전세 비중 순`

구현:

- 버튼 토글
- 같은 데이터셋을 재정렬해서 표와 카드 둘 다 갱신

### 8-8. 강남3구 vs 노도강 비교 보드

구성:

- 카드 2개
  - `강남3구`
  - `노도강`
- 비교 항목:
  - 전세 비중
  - 월세 비중
  - 반전세 비중
  - 평균 보증금
  - 평균 월세

목적:

- 대중 관심도가 높은 비교축 제공
- 기사형이 아닌 `비교계산소다운 압축 비교` 구현

### 8-9. 보증금 규모별 전환율 보드

표현 방식:

- 카드 4개 또는 heatmap 스타일 bar

구간:

- `1억 미만`
- `1억~3억`
- `3억~5억`
- `5억 이상`

목적:

- 어떤 보증금 구간에서 월세화 압력이 큰지 직관적으로 보여주기

### 8-10. 세입자 실부담 시뮬레이션

구성:

- 시나리오 카드 3개 고정
- 예:
  - `전세 4억 -> 보증금 2억 + 월세 70`
  - `전세 6억 -> 보증금 4억 + 월세 90`
  - `1인가구 지역 평균 반전세 전환`

출력:

- 월 현금 유출
- 연간 추가 부담
- 한 줄 해석

주의:

- 여기서는 정밀 계산기처럼 입력받지 않고, `시나리오 기반 설명 카드`로 간다.
- 하단 CTA로 계산기를 연결한다.

### 8-11. FAQ

권장 5개:

- 서울 전세는 왜 줄어드는 것처럼 느껴지나
- 반전세가 늘었다는 말은 무슨 뜻인가
- 월세 전환이 빠른 구는 어떤 특징이 있나
- 1인가구 많은 지역은 왜 월세 비중이 높게 보이나
- 내 계약이 불리한지 어떻게 판단하나

### 8-12. 출처 링크

필수:

- 서울 열린데이터광장 관련 출처
- 한국은행 기준금리
- 한국주택금융공사 또는 법령 관련 참고 링크

구현:

- 링크 카드 또는 단순 목록

### 8-13. 관련 계산기 CTA

1차 CTA:

- `/tools/jeonwolse-conversion/` 또는 실제 구현 slug
- `/tools/home-purchase-fund/`

2차 CTA:

- `/reports/seoul-housing-2016-vs-2026/`

---

## 9. 인터랙션 설계 (`public/scripts/seoul-jeonwolse-ratio-2026.js`)

### 9-1. 스크립트 책임 범위

- JSON seed 파싱
- 랭킹 토글
- 25구 grid active 상태 관리
- secondary chart metric 전환
- detail panel 업데이트

### 9-2. 상태 객체

```js
const state = {
  rankingMode: "leaseRatio",
  secondaryMetric: "leaseRatio",
  activeDistrict: "강남구",
};
```

### 9-3. 권장 함수 목록

| 함수 | 역할 |
|---|---|
| `renderDistrictBoard()` | 25구 카드 보드 렌더 |
| `renderDistrictDetail()` | 선택 구 detail panel 갱신 |
| `renderRankingTable()` | 랭킹 모드별 정렬 결과 렌더 |
| `makeCityChart()` | 서울 전체 구조 차트 생성 |
| `makeSecondaryChart()` | metric 토글 차트 생성 |
| `updateSecondaryChart()` | 토글 변경 반영 |
| `bindRankingTabs()` | 랭킹 토글 |
| `bindDistrictButtons()` | district active 상태 |

### 9-4. Chart.js 사용 규칙

하단 스크립트 로드:

```astro
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/seoul-jeonwolse-ratio-2026.js")}></script>
```

공용 헬퍼 재사용:

```js
import { buildDefaultOptions } from "./chart-config.js";
```

### 9-5. 인터랙션 우선순위

1. 초기 렌더만으로 핵심 내용이 보여야 함
2. JS는 탐색 편의성을 올리는 수준
3. JS 미동작 시에도 표와 기본 카드로 읽을 수 있어야 함

---

## 10. 스타일 가이드 (`_seoul-jeonwolse-ratio-2026.scss`)

### 10-1. prefix

- `sjr-`
  - Seoul Jeonwolse Ratio

### 10-2. 컬러 톤

- 전세/중립: 딥 블루, 틸
- 월세/경고: 오렌지, 레드 계열
- 반전세/혼합: 스카이 또는 바이올렛 포인트

### 10-3. 핵심 UI 블록

- `.sjr-hero-board`
- `.sjr-kpi-grid`
- `.sjr-chart-panel`
- `.sjr-district-grid`
- `.sjr-district-card`
- `.sjr-ranking-table`
- `.sjr-group-grid`
- `.sjr-band-grid`
- `.sjr-scenario-grid`

### 10-4. 반응형

- 모바일:
  - KPI 2열
  - district grid 2열
  - 표 가로 스크롤
- 태블릿 이상:
  - district grid 3~5열
  - group compare 2열
- 데스크톱:
  - district board + detail panel 2열 가능

---

## 11. SEO 설계

### 11-1. 메인 키워드

- 서울 전월세 비율 전환 현황
- 서울 구별 전세 비중
- 서울 월세 전환 빠른 지역
- 서울 반전세 증가

### 11-2. 롱테일 키워드

- 강남구 전세 비중 줄었나
- 서울 구별 전세 월세 비율 비교
- 서울 반전세 많은 지역
- 서울 전세가 월세로 바뀌면 얼마나 부담되나

### 11-3. 메타 초안

- `title`: `서울 25개 구 전월세 전환 지도 | 전세는 어디서 사라지고 있나 [2026]`
- `description`: `서울 25개 자치구의 전세·월세·반전세 구조 변화를 2021~2026 최신 공개 기준으로 비교했습니다. 전세 잔존율 TOP5, 월세 전환 빠른 지역, 세입자 실부담 시나리오까지 한눈에 확인하세요.`

### 11-4. JSON-LD

- `Article` 또는 `Report`
- 페이지 성격상 `WebPage` + `Article` 조합도 가능
- 계산기가 아니므로 `WebApplication`은 사용하지 않는다

---

## 12. 등록 작업

### 12-1. `src/data/reports.ts`

```ts
{
  slug: "seoul-jeonwolse-ratio-2026",
  title: "서울 25개 구 전월세 전환 지도 | 전세는 어디서 사라지고 있나 [2026]",
  description: "서울 25개 자치구의 전세·월세·반전세 구조 변화를 2021~2026 최신 공개 기준으로 비교하는 인터랙티브 리포트입니다.",
  order: /* 현재 마지막 + 1 */,
  badges: ["서울", "전월세", "부동산", "2026"],
}
```

### 12-2. `src/styles/app.scss`

```scss
@use 'scss/pages/seoul-jeonwolse-ratio-2026';
```

### 12-3. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/seoul-jeonwolse-ratio-2026/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 13. 구현 순서

1. `src/data/seoulJeonwolseRatio2026.ts` 작성
2. `src/pages/reports/seoul-jeonwolse-ratio-2026.astro` 마크업 작성
3. `public/scripts/seoul-jeonwolse-ratio-2026.js` 인터랙션 작성
4. `src/styles/scss/pages/_seoul-jeonwolse-ratio-2026.scss` 작성
5. `src/styles/app.scss` import 추가
6. `src/data/reports.ts` 등록
7. `public/og/reports/seoul-jeonwolse-ratio-2026.png` 추가
8. `public/sitemap.xml` 등록
9. `npm run build` 확인

---

## 14. QA 포인트

- [ ] 상단 KPI와 차트 데이터가 서로 모순되지 않는가
- [ ] `2026 전체 확정치`처럼 오해될 표현이 없는가
- [ ] district ranking 토글 시 정렬/active 상태가 동시에 갱신되는가
- [ ] 25구 grid가 모바일에서도 읽을 수 있는가
- [ ] JS 없이도 핵심 랭킹과 표를 읽을 수 있는가
- [ ] 강남3구 vs 노도강 카드 요약이 과장 없이 균형 잡혀 있는가
- [ ] 반전세 정의가 문서 전체에서 일관적인가
- [ ] 출처 링크와 기준 날짜가 하단에 명확히 보이는가

---

## 15. 개발 메모

- 이 리포트의 핵심은 `지도` 자체가 아니라 `25개 구 비교 경험`이다.
- 따라서 MVP에서는 실제 지도가 없어도 된다.
- 차별화 포인트는 `전세 잔존율`, `월세 전환 속도`, `반전세 증가`, `세입자 실부담`을 한 페이지에 묶는 데 있다.
- 구현 난도를 낮추려면 1차는 `정적 데이터 + 차트 2개 + district grid + 랭킹 표`로 끝내고, 2차에 SVG 지도와 drill-down을 붙이는 방식이 가장 안전하다.
