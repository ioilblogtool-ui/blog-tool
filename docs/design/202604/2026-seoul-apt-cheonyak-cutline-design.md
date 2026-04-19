# 2026 서울 아파트 청약 당첨 가점 커트라인 설계 문서

> 기획 원문: `docs/plan/202604/2026-seoul-apt-cheonyak-cutline.md`
> 작성일: 2026-04-19
> 구현 기준: Codex가 이 문서를 보고 바로 `/reports/` 페이지 구현에 착수할 수 있는 수준
> 참고 페이지: `seoul-jeonwolse-ratio-2026`, `seoul-apartment-jeonse-report`, `seoul-housing-2016-vs-2026`

---

## 1. 문서 개요

### 1-1. 대상

- 기획 문서: `docs/plan/202604/2026-seoul-apt-cheonyak-cutline.md`
- 구현 대상: `2026 서울 아파트 청약 당첨 가점 커트라인 완전 분석`
- 권장 slug: `2026-seoul-apt-cheonyak-cutline`
- 권장 URL: `/reports/2026-seoul-apt-cheonyak-cutline/`

### 1-2. 페이지 성격

- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름:
  - `청약 가점 구조 요약 -> 실제 당첨 사례 -> 지역/면적/유형별 커트라인 비교 -> 내 점수대 전략 -> 특공/추첨제 우회 전략 -> 계산기 CTA`
- 톤은 `희망고문`이나 `당첨 단정`이 아니라 `공개 데이터 기반 현실 판단 + 선택지 제시`
- 모든 예상 커트라인은 반드시 `예상`, `참고`, `시뮬레이션` 라벨을 붙인다.

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
- 핵심 UX는 `자치구 + 면적 + 공급유형 + 가점대` 조합 필터다.
- 지도형 시각화는 MVP에서 필수로 두지 않는다. 1차는 `지역 그룹 카드 + 히트맵형 그리드 + 랭킹 표`로 구현한다.
- 실제 단지 사례와 예측 구간은 데이터 성격이 다르므로 타입과 UI를 분리한다.

### 2-3. 권장 파일 구조

```text
src/
  data/
    seoulAptCheonyakCutline2026.ts
  pages/
    reports/
      2026-seoul-apt-cheonyak-cutline.astro

public/
  scripts/
    2026-seoul-apt-cheonyak-cutline.js
  og/
    reports/
      2026-seoul-apt-cheonyak-cutline.png

src/styles/scss/pages/
  _2026-seoul-apt-cheonyak-cutline.scss
```

추가 반영 파일:

- `src/data/reports.ts`
- `src/styles/app.scss`
- `public/sitemap.xml`

---

## 3. 구현 범위

### 3-1. MVP 범위

- 청약 가점제 84점 구조 요약
- 최근 서울·수도권 실제 당첨 가점 사례 표
- 서울 지역 그룹별 커트라인 구간 비교
  - 강남3구
  - 마용성
  - 서남권/강서·영등포
  - 동북권/노도강
  - 외곽권
- 면적별 커트라인 비교
  - 59㎡ 이하
  - 84㎡
  - 대형 평형
- 공급유형별 전략 비교
  - 일반공급 가점제
  - 추첨제
  - 신혼부부 특별공급
  - 생애최초 특별공급
  - 다자녀 특별공급
- 가점대별 추천 전략
  - 40점대
  - 50점대
  - 60점대
  - 70점대 이상
- 내 점수 입력 기반 가벼운 전략 안내
- 2026 주요 분양 예정 단지 예상 커트라인 보드
- FAQ / 출처 / 내부 CTA

### 3-2. MVP 제외 범위

- 청약홈 실시간 API 연동
- 전체 단지 전수 크롤링
- 사용자 자격 검증 자동화
- 특별공급 당첨 확률 계산
- 모집공고문별 세부 요건 판정
- 청약통장 해지/유지 손익 정밀 계산
- 회원 저장 기능

### 3-3. 확장 후보

- 서울 자치구 SVG 히트맵
- 청약 가점 계산기 query string 연동
- 특별공급 자격 체크리스트 계산기 분리
- 분양 예정 단지별 추정 모델 고도화
- 면적/분양가/브랜드/생활권 가중치 조정 UI

---

## 4. 페이지 목적

- 사용자가 `내 가점이 서울 청약에서 어느 정도 위치인지` 빠르게 판단하게 한다.
- 서울 청약 커트라인이 하나의 평균값이 아니라 `지역`, `면적`, `공급유형`, `단지 성격`에 따라 달라진다는 점을 보여준다.
- 낮은 가점 사용자가 바로 이탈하지 않도록 `추첨제`, `특별공급`, `비선호 평형`, `수도권 인접지` 같은 현실 대안을 제시한다.
- 하단에서 `아파트 청약 가점 계산기`, `내집마련 자금 계산기`, `서울 주거 리포트`로 자연스럽게 이어지게 한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 30대 무주택 실수요자

- `서울 청약 가점 50점`, `청약 가점 몇 점이면 당첨` 검색으로 유입한다.
- 상단에서 84점 구조와 실제 커트라인 사례를 확인한다.
- 내 점수를 입력하고 `비강남 59㎡`, `추첨제`, `특별공급` 중심 전략을 본다.

### 5-2. 40대 3~4인 가족

- 부양가족이 있어 가점은 높지만 어느 지역까지 가능한지 알고 싶어한다.
- 자치구 그룹별 커트라인과 84㎡ 경쟁 강도를 확인한다.
- 강남권/비강남 핵심지/수도권 대안의 차이를 비교한다.

### 5-3. 신혼부부

- 일반공급보다 신혼부부 특별공급이나 생애최초가 유리한지 판단하고 싶어한다.
- 공급유형 비교 섹션에서 일반공급과 특공의 판단 기준을 본다.
- 관련 체크리스트 또는 계산기 CTA로 이동한다.

### 5-4. 장기 무주택자

- 청약통장을 계속 유지할 가치가 있는지 고민한다.
- 가입기간 점수와 가점 상승 로드맵을 확인한다.
- 청약통장 유지/해지 손익 계산기 제작 시 후속 CTA로 연결한다.

---

## 6. 데이터 설계 (`src/data/seoulAptCheonyakCutline2026.ts`)

### 6-1. 타입 정의

```ts
export type AreaBand = "under60" | "eightyFour" | "large";
export type RegionGroupKey = "gangnam3" | "mayongseong" | "southwest" | "northeast" | "outer";
export type SupplyType = "generalScore" | "lottery" | "newlywed" | "firstHome" | "multiChild";
export type ScoreBandKey = "forties" | "fifties" | "sixties" | "seventiesPlus";
export type DataBadge = "공식" | "기사인용" | "참고" | "예상" | "시뮬레이션";

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  methodology: string;
  caution: string;
}

export interface SummaryKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "warn";
}

export interface ScoreRuleRow {
  category: "무주택기간" | "부양가족 수" | "청약통장 가입기간";
  maxScore: number;
  fullScoreCondition: string;
  note: string;
}

export interface ActualCaseRow {
  complexName: string;
  district: string;
  announcedAt: string;
  areaLabel: string;
  areaBand: AreaBand;
  supplyType: SupplyType;
  minScore: number;
  avgScore?: number;
  maxScore?: number;
  sourceLabel: string;
  sourceHref: string;
  badge: DataBadge;
  interpretation: string;
}

export interface RegionCutlineRow {
  key: RegionGroupKey;
  label: string;
  districts: string[];
  minGuide: number;
  maxGuide: number;
  representativeScore: number;
  difficulty: "낮음" | "보통" | "높음" | "매우 높음";
  summary: string;
  caveat: string;
  badge: DataBadge;
}

export interface AreaCutlineCard {
  key: AreaBand;
  label: string;
  scoreGuide: string;
  lotterySignal: string;
  competitionPattern: string;
  recommendedFor: string;
}

export interface SupplyStrategyCard {
  key: SupplyType;
  label: string;
  fitUser: string;
  advantage: string;
  caution: string;
  nextAction: string;
}

export interface ScoreBandStrategy {
  key: ScoreBandKey;
  label: string;
  scoreMin: number;
  scoreMax?: number;
  possibleZone: string;
  mainStrategy: string;
  avoid: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FutureComplexEstimate {
  complexName: string;
  district: string;
  expectedMonth?: string;
  areaHint: string;
  expectedScoreRange: string;
  basis: string;
  badge: "예상";
}

export interface SimulationInputDefaults {
  score: number;
  areaBand: AreaBand;
  supplyType: SupplyType;
  regionGroup: RegionGroupKey;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface SourceLink {
  label: string;
  href: string;
  type: "official" | "news" | "reference";
}
```

### 6-2. 권장 export 구조

```ts
export const seoulAptCheonyakCutline2026 = {
  meta,
  heroSummary,
  kpis,
  scoreRules,
  actualCases,
  regionCutlines,
  areaCutlines,
  supplyStrategies,
  scoreBandStrategies,
  futureComplexEstimates,
  simulationDefaults,
  faq,
  relatedLinks,
  sourceLinks,
} as const;
```

### 6-3. 데이터 설계 원칙

- `actualCases`는 실제 단지 사례만 담는다.
- `regionCutlines`, `futureComplexEstimates`, `scoreBandStrategies`는 예상/해석 데이터이므로 UI에 `예상`, `시뮬레이션`, `참고` 라벨을 붙인다.
- 기사 인용 수치는 원문 링크와 `announcedAt` 기준을 함께 둔다.
- 평균값이 아닌 `최저`, `평균`, `최고` 가점은 같은 의미가 아니므로 컬럼을 분리한다.
- 연령별 실제 당첨 분포는 공식 데이터 확보가 어렵기 때문에 `연령대별 실제 분포` 대신 `현실적 가점 시뮬레이션`으로만 표현한다.

### 6-4. 필수 유틸

```ts
export function getCasesByArea(areaBand: AreaBand) {}
export function getCasesBySupplyType(supplyType: SupplyType) {}
export function getRegionCutline(regionGroup: RegionGroupKey) {}
export function getScoreBandStrategy(score: number) {}
export function getRecommendedStrategy(input: SimulationInputDefaults) {}
```

---

## 7. 페이지 구조 (`src/pages/reports/2026-seoul-apt-cheonyak-cutline.astro`)

### 7-1. 전체 IA

1. `CalculatorHero`
2. `InfoNotice`
3. Editor's Brief 보드
4. KPI 카드 4개
5. 청약 가점 84점 구조 표
6. 최근 실제 당첨 가점 사례 표
7. 지역 그룹별 커트라인 히트맵 보드
8. 면적별 59㎡/84㎡/대형 비교 카드
9. 가점대별 전략 선택 보드
10. 내 점수 입력 전략 도우미
11. 일반공급 vs 특공/추첨제 비교 보드
12. 2026 주요 분양 예정 단지 예상 커트라인
13. 가점 상승 로드맵
14. FAQ
15. 출처 링크
16. 관련 계산기 CTA
17. `SeoContent`

### 7-2. 기본 레이아웃 예시

```astro
<BaseLayout title={report.meta.title} description={report.meta.subtitle}>
  <SiteHeader />

  <main class="container page-shell report-page sac-page">
    <CalculatorHero ... />
    <InfoNotice ... />

    <section class="content-section sac-brief-section">...</section>
    <section class="content-section sac-kpi-section">...</section>
    <section class="content-section sac-score-rule-section">...</section>
    <section class="content-section sac-case-section">...</section>
    <section class="content-section sac-region-section">...</section>
    <section class="content-section sac-area-section">...</section>
    <section class="content-section sac-score-band-section">...</section>
    <section class="content-section sac-simulator-section">...</section>
    <section class="content-section sac-supply-section">...</section>
    <section class="content-section sac-future-section">...</section>
    <section class="content-section sac-roadmap-section">...</section>
    <section class="content-section sac-links-section">...</section>
    <SeoContent ... />
  </main>
</BaseLayout>
```

### 7-3. 데이터 seed 주입

```astro
<script id="seoulAptCheonyakCutline2026Data" type="application/json">
  {JSON.stringify(report)}
</script>
```

---

## 8. 섹션별 구현 상세

### 8-1. Hero

- eyebrow: `서울 부동산 리포트`
- title: `2026 서울 아파트 청약 당첨 가점 커트라인`
- description: `서울 청약 커트라인을 자치구, 면적, 공급유형, 실제 단지 사례 기준으로 나눠 비교합니다. 내 점수대에서 일반공급, 추첨제, 특별공급 중 어디를 봐야 하는지도 함께 정리합니다.`

### 8-2. InfoNotice

필수 안내 문구:

- `청약 가점 구조는 공개 제도 기준을 바탕으로 정리한 참고 정보`
- `단지별 당첨 가점은 모집공고, 공급유형, 주택형, 특별공급 여부에 따라 달라짐`
- `예상 커트라인은 최근 인근 사례와 면적/입지/분양가 조건을 바탕으로 한 시뮬레이션`
- `최종 청약 판단은 반드시 해당 단지 모집공고문과 청약홈 기준으로 확인`

### 8-3. Editor's Brief 보드

목적:

- 첫 화면에서 `서울 청약은 평균값 하나로 판단하면 안 된다`는 메시지를 전달한다.

구성:

- 리드 문단 1개
- 핵심 칩 3개
  - `가점제 84점 만점`
  - `면적별 커트라인 편차 큼`
  - `낮은 가점은 추첨제/특공 병행`

### 8-4. KPI 카드

권장 4개:

- `가점제 총점`
- `강남권 고점 사례`
- `비강남/대형 저점 사례`
- `가점 50점대 전략 포인트`

주의:

- 실제 사례 기반 수치와 예상 수치를 같은 카드 안에 섞지 않는다.
- 만점 또는 40점대 사례를 보여줄 때는 단지명, 면적, 기준 시점을 함께 표시한다.

### 8-5. 청약 가점 84점 구조 표

컬럼:

- 항목
- 최대점수
- 만점 조건
- 주의할 점

행:

- 무주택기간 32점
- 부양가족 수 35점
- 청약통장 가입기간 17점

목적:

- 리포트 중간의 판단 기준을 먼저 고정한다.
- 청약 가점 계산기 CTA의 맥락을 만든다.

### 8-6. 최근 실제 당첨 가점 사례 표

컬럼:

- 단지
- 자치구
- 기준 시점
- 주택형
- 공급유형
- 최저점
- 평균점
- 최고점
- 해석

구현:

- 모바일에서는 카드형 리스트로 전환하거나 표 가로 스크롤을 허용한다.
- `공식`, `기사인용` 배지를 노출한다.
- 빈 평균/최고점은 `공개값 없음`으로 표기한다.

### 8-7. 지역 그룹별 커트라인 히트맵 보드

표현:

- 카드형 히트맵 또는 compact grid

지역 그룹:

- 강남3구
- 마용성
- 서남권/강서·영등포
- 동북권/노도강
- 외곽권

각 카드 표시 요소:

- 지역 그룹명
- 대표 가점 구간
- 난이도 라벨
- 짧은 해석
- `예상/참고` 배지

목적:

- 사용자가 자신의 점수대와 지역 범위를 빠르게 매칭하게 한다.

### 8-8. 면적별 비교 카드

카드 3개:

- `59㎡ 이하`
- `84㎡`
- `대형 평형`

각 카드 구성:

- 예상 점수 구간
- 추첨제 신호
- 경쟁 패턴
- 추천 사용자

핵심 메시지:

- 84㎡는 실수요 핵심 경쟁 구간이다.
- 59㎡ 이하와 대형 평형은 단지별로 추첨제/비선호 조건에 따른 기회가 생길 수 있다.
- 면적만으로 당첨 가능성을 단정하지 않는다.

### 8-9. 가점대별 전략 선택 보드

탭 또는 버튼:

- `40점대`
- `50점대`
- `60점대`
- `70점대 이상`

출력:

- 가능한 지역/면적
- 우선 전략
- 피해야 할 접근
- 다음 액션 CTA

예시 CTA:

- `내 청약 가점 계산하기`
- `내집마련 자금 계산하기`
- `서울 주거비 리포트 보기`

### 8-10. 내 점수 입력 전략 도우미

입력:

- 청약 가점
- 희망 면적
- 선호 지역 그룹
- 일반공급/추첨제/특공 관심 여부

출력:

- 지역 난이도
- 면적 난이도
- 공급유형 추천
- 다음 행동

주의:

- 이 영역은 당첨 확률 계산기가 아니라 `전략 방향 안내`다.
- 결과 문구에 `가능`, `불가능` 단정 표현을 피한다.
- 권장 표현은 `매우 어려움`, `도전 가능`, `특공/추첨제 병행 필요`, `공고별 확인 필요`다.

### 8-11. 일반공급 vs 특공/추첨제 비교 보드

카드 5개:

- 일반공급 가점제
- 추첨제
- 신혼부부 특별공급
- 생애최초 특별공급
- 다자녀 특별공급

각 카드 구성:

- 맞는 사용자
- 장점
- 주의점
- 다음 확인 항목

목적:

- 낮은 가점 사용자에게 일반공급만 보는 것이 유일한 선택지가 아니라는 점을 보여준다.

### 8-12. 2026 주요 분양 예정 단지 예상 커트라인

구성:

- 단지명
- 자치구
- 예상 시점
- 면적 힌트
- 예상 가점 구간
- 추정 근거

필수 라벨:

- `예상`
- `모집공고 전 참고`

금지:

- `당첨선 확정`, `이 점수면 당첨`, `무조건 가능` 같은 표현

### 8-13. 가점 상승 로드맵

구성:

- 1년 후
- 3년 후
- 5년 후

표현:

- 무주택기간 증가
- 청약통장 가입기간 증가
- 부양가족 변화 가능성
- 점수 상승이 곧 당첨 가능성 상승을 보장하지 않는다는 안내

### 8-14. FAQ

권장 6개:

- 서울 청약은 몇 점이면 당첨 가능한가
- 59㎡와 84㎡ 커트라인은 왜 다른가
- 가점 50점대도 서울 청약을 넣어볼 수 있나
- 추첨제는 가점이 낮아도 가능한가
- 특별공급이 일반공급보다 항상 유리한가
- 청약통장은 계속 유지해야 하나

### 8-15. 출처 링크

필수 그룹:

- 공식 제도 기준
  - 청약홈
  - 마이홈
  - 주택공급 관련 법령/공식 안내
- 실제 사례 참고
  - 단지별 당첨 가점 보도
  - 청약홈 발표 인용 기사
- 분양 예정 참고
  - 주요 언론/부동산 정보 서비스

### 8-16. 관련 계산기 CTA

1차 CTA:

- `/tools/apt-cheonyak-gajum-calculator/`

2차 CTA:

- `/tools/home-purchase-fund/`
- `/tools/jeonwolse-conversion/`

관련 리포트:

- `/reports/seoul-housing-2016-vs-2026/`
- `/reports/seoul-apartment-jeonse-report/`
- `/reports/seoul-jeonwolse-ratio-2026/`

---

## 9. 인터랙션 설계 (`public/scripts/2026-seoul-apt-cheonyak-cutline.js`)

### 9-1. 스크립트 책임 범위

- JSON seed 파싱
- 실제 사례 표 필터링
- 지역 그룹 카드 active 상태 관리
- 가점대 탭 전환
- 내 점수 입력 전략 결과 갱신
- URL 파라미터 동기화

### 9-2. 상태 객체

```js
const state = {
  score: 52,
  areaBand: "eightyFour",
  regionGroup: "southwest",
  supplyType: "generalScore",
  activeScoreBand: "fifties",
};
```

### 9-3. URL 파라미터

```text
/reports/2026-seoul-apt-cheonyak-cutline/?score=52&area=eightyFour&region=southwest&supply=generalScore
```

지원 파라미터:

- `score`
- `area`
- `region`
- `supply`

### 9-4. 권장 함수 목록

| 함수 | 역할 |
|---|---|
| `readSeed()` | JSON 데이터 파싱 |
| `parseInitialState()` | URL 파라미터 기반 초기 상태 생성 |
| `getScoreBand(score)` | 점수 기반 전략 구간 반환 |
| `renderCaseTable()` | 실제 사례 표 필터링/렌더 |
| `renderRegionDetail()` | 선택 지역 그룹 상세 갱신 |
| `renderScoreBandStrategy()` | 가점대 전략 탭 갱신 |
| `renderRecommendation()` | 내 점수 입력 결과 갱신 |
| `bindControls()` | 입력/버튼 이벤트 연결 |
| `syncUrl()` | 현재 상태 URL 반영 |

### 9-5. Chart.js 사용 여부

MVP에서는 Chart.js가 필수는 아니다.

권장 우선순위:

1. 표와 카드 보드로 구현
2. 필요 시 가점 구간 분포를 bar chart로 추가
3. 실제 단지 사례가 8개 이상 확보되면 `면적별 최저/평균 가점` 차트 추가

Chart.js를 쓰는 경우:

```astro
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<script type="module" src={withBase("/scripts/2026-seoul-apt-cheonyak-cutline.js")}></script>
```

공용 헬퍼:

```js
import { buildDefaultOptions } from "./chart-config.js";
```

### 9-6. JS 미동작 대응

- 실제 사례 표, 가점 구조 표, 지역 그룹 카드, 가점대 전략 카드는 서버 렌더 결과로 기본 노출한다.
- JS는 필터링과 입력 결과 갱신만 담당한다.
- JS 오류가 나도 핵심 리포트 내용은 읽혀야 한다.

---

## 10. 스타일 가이드 (`_2026-seoul-apt-cheonyak-cutline.scss`)

### 10-1. prefix

- `sac-`
  - Seoul Apt Cheonyak

### 10-2. 컬러 톤

- 제도/기준: 딥 블루, 네이비
- 예상/주의: 앰버, 오렌지
- 가능 전략/대안: 틸, 그린
- 고난도/과열 신호: 레드 계열 포인트

### 10-3. 핵심 UI 블록

- `.sac-brief-section`
- `.sac-kpi-grid`
- `.sac-score-rule-table`
- `.sac-case-table`
- `.sac-region-grid`
- `.sac-region-card`
- `.sac-area-grid`
- `.sac-score-band-tabs`
- `.sac-simulator-panel`
- `.sac-supply-grid`
- `.sac-future-grid`
- `.sac-roadmap`

### 10-4. 반응형

- 모바일:
  - KPI 2열 또는 1열
  - 지역 그룹 카드 1열
  - 실제 사례 표는 가로 스크롤 또는 카드형
  - 입력 폼은 세로 배치
- 태블릿 이상:
  - 지역 그룹 카드 2~3열
  - 면적 카드 3열
  - 공급유형 카드 2~3열
- 데스크톱:
  - 전략 도우미는 `좌: 입력 / 우: 결과` 2열
  - 지역 보드는 `카드 그리드 + 상세 패널` 2열 가능

---

## 11. SEO 설계

### 11-1. 메인 키워드

- 서울 청약 가점 커트라인
- 청약 당첨 가점
- 2026 서울 청약
- 청약 가점 몇 점

### 11-2. 서브 키워드

- 강남 청약 커트라인
- 비강남 청약 가점
- 59㎡ 청약 가점
- 84㎡ 청약 커트라인
- 청약 가점 50점
- 청약 추첨제 전략
- 특별공급 전략

### 11-3. 롱테일 키워드

- 청약 가점 50점 서울 가능할까
- 서울 아파트 청약 몇 점이면 당첨
- 59제곱 청약 가점과 84제곱 청약 가점 차이
- 신혼부부 특별공급이 일반공급보다 유리한가
- 청약통장 계속 유지해야 하나

### 11-4. 메타 초안

- `title`: `2026 서울 아파트 청약 당첨 가점 커트라인 | 자치구·면적·유형별 분석`
- `description`: `2025~2026년 서울·수도권 주요 아파트 청약 당첨 가점 사례를 바탕으로 자치구별, 면적별, 공급유형별 커트라인을 비교합니다. 40점대·50점대·60점대·70점대 전략과 특공·추첨제 대안까지 정리했습니다.`

### 11-5. JSON-LD

- 페이지 성격상 `WebPage` + `Article` 조합 권장
- 계산기 페이지가 아니므로 `WebApplication`은 사용하지 않는다.
- FAQ를 실제 페이지에 넣는 경우 `FAQPage` 추가 가능

---

## 12. 등록 작업

### 12-1. `src/data/reports.ts`

```ts
{
  slug: "2026-seoul-apt-cheonyak-cutline",
  title: "2026 서울 아파트 청약 당첨 가점 커트라인 | 자치구·면적·유형별 분석",
  description: "서울·수도권 주요 아파트 청약 당첨 가점 사례를 바탕으로 지역, 면적, 공급유형별 커트라인과 점수대별 전략을 비교하는 데이터 리포트입니다.",
  order: /* 현재 마지막 + 1 */,
  badges: ["서울", "청약", "부동산", "2026"],
}
```

### 12-2. `src/styles/app.scss`

```scss
@use 'scss/pages/2026-seoul-apt-cheonyak-cutline';
```

### 12-3. `public/sitemap.xml`

```xml
<url>
  <loc>https://bigyocalc.com/reports/2026-seoul-apt-cheonyak-cutline/</loc>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 13. 구현 순서

1. `src/data/seoulAptCheonyakCutline2026.ts` 작성
2. `src/pages/reports/2026-seoul-apt-cheonyak-cutline.astro` 마크업 작성
3. `public/scripts/2026-seoul-apt-cheonyak-cutline.js` 인터랙션 작성
4. `src/styles/scss/pages/_2026-seoul-apt-cheonyak-cutline.scss` 작성
5. `src/styles/app.scss` import 추가
6. `src/data/reports.ts` 등록
7. `public/og/reports/2026-seoul-apt-cheonyak-cutline.png` 추가
8. `public/sitemap.xml` 등록
9. `npm run build` 확인

---

## 14. QA 포인트

### 14-1. 데이터 QA

- [ ] 청약 가점 구조 32/35/17/84점이 공식 기준과 일치하는가
- [ ] 실제 단지 사례의 기준 시점, 면적, 최저/평균/최고점이 분리되어 있는가
- [ ] 예상 커트라인에 `예상`, `시뮬레이션`, `참고` 라벨이 붙어 있는가
- [ ] 연령대별 실제 당첨 분포처럼 검증 어려운 표현을 쓰지 않았는가
- [ ] 특공/추첨제 설명이 모집공고문 확인 필요 문구와 함께 제공되는가

### 14-2. UI QA

- [ ] 첫 화면에서 `서울 청약 커트라인 데이터 리포트`라는 성격이 명확한가
- [ ] 실제 사례 표가 모바일에서 깨지지 않는가
- [ ] 지역 그룹 카드의 난이도 색상만으로 정보를 전달하지 않는가
- [ ] 가점대별 전략 탭이 키보드로도 조작 가능한가
- [ ] 내 점수 입력 결과가 단정형 표현을 피하는가

### 14-3. 인터랙션 QA

- [ ] `score=52` 같은 URL 파라미터로 초기 상태가 복원되는가
- [ ] 점수 입력값이 0~84 범위를 벗어날 때 예외 처리가 되는가
- [ ] 지역/면적/공급유형 변경 시 결과 문구가 함께 갱신되는가
- [ ] JS 없이도 핵심 표와 카드가 읽히는가

### 14-4. SEO / 운영 QA

- [ ] `reports.ts` 등록
- [ ] `reports/index.astro` 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` intro / criteria / FAQ / related 구성 완료
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] `npm run build` 통과

---

## 15. 개발 메모

- 이 리포트의 핵심은 `서울 평균 청약 가점`이 아니라 `세부 조건별 커트라인 편차`다.
- 가장 중요한 차별화 포인트는 실제 단지 사례와 점수대별 전략을 같은 화면에서 연결하는 것이다.
- 데이터가 충분하지 않은 구간은 과감하게 `예상`, `참고`, `시뮬레이션`으로 분리한다.
- 1차 구현은 `정적 데이터 + 사례 표 + 지역/면적 카드 + 점수 입력 전략 도우미`로 끝내고, 2차에 자치구 지도와 더 정교한 필터를 붙이는 방식이 안전하다.
- 청약 제도는 자주 바뀌므로 발행 직전에는 반드시 청약홈/마이홈/모집공고문 기준으로 최종 검수한다.
