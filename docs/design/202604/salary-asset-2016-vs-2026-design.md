# 한국인 평균 연봉·자산 2016→2026 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/salary-asset-2016-vs-2026-webplan (1).md`
- 구현 대상: 한국인 평균 연봉·자산 2016→2026, 따라잡을 수 있나 비교 리포트
- 참고 페이지:
  - `wedding-cost-2016-vs-2026`
  - `seoul-housing-2016-vs-2026`
  - `salary-tier`
  - `household-income`

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 계산 규칙, 구현 파일, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `10년 변화 요약 -> 연봉/자산 추이 -> 연봉 vs 자산 vs 서울 집값 지수 비교 -> 2016 vs 2026 직접 비교 -> 자산 격차 해설 -> 내 연봉 기준 체감 -> 다음 계산기 연결`
- SEO 유입형이지만 비교계산소답게 `숫자 비교 + 체감 해석 + 가벼운 계산` 구조를 유지한다.
- 블로그 글처럼 긴 문단 중심이 아니라 카드, 차트, 표, 입력 박스로 빠르게 읽히는 구조를 우선한다.

### 1-4. 권장 slug
- `salary-asset-2016-vs-2026`
- URL: `/reports/salary-asset-2016-vs-2026/`

### 1-5. 권장 파일 구조
- `src/data/salaryAsset2016Vs2026.ts`
- `src/pages/reports/salary-asset-2016-vs-2026.astro`
- `public/scripts/salary-asset-2016-vs-2026.js`
- `src/styles/scss/pages/_salary-asset-2016-vs-2026.scss`
- `public/og/reports/salary-asset-2016-vs-2026.png`

---

## 2. 현재 프로젝트 비교 컨텐츠 구조 정리

### 2-1. 현재 리포트 공통 구조
현재 `/reports/` 비교 콘텐츠는 아래 공통 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 브리프 보드 또는 KPI 카드
4. 비교 차트 / 비교 표 / 랭킹 카드
5. 선택형 탐색 또는 체감 계산 영역
6. 패턴 요약 / 인사이트 카드
7. 외부 참고 링크
8. 선택형 CTA 또는 제휴 블록
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 리포트가 따라야 할 방향
- `wedding-cost-2016-vs-2026`에서 가져올 것
  - `2016 vs 2026` 10년 비교 리포트 형식
  - 상단 브리프 + KPI + 비교 보드 + 체감 계산 박스 구조
  - 생활비/부담 변화라는 해석 중심 UX
- `seoul-housing-2016-vs-2026`에서 가져올 것
  - `평균값 + 지수 비교 + 구조 해설` 흐름
  - 차트 중심의 시계열 비교와 체감 문구
  - 서울 집값과 연결되는 CTA 흐름
- 이번 페이지에서 새롭게 강조할 것
  - `연봉`, `자산`, `서울 집값`의 3축 비교
  - `부동산 보유자 vs 미보유자` 자산 격차를 별도 섹션으로 보여주는 구조
  - 단순 평균 연봉 리포트가 아니라 `자산 형성 가능성`까지 읽게 하는 구조

---

## 3. 구현 범위

### 3-1. MVP 범위
- 2016~2026 비교 핵심 지표를 고정 데이터로 제공한다.
  - 중위 연봉
  - 평균 연봉
  - 중위 자산
  - 평균 자산
  - 서울 평균 집값
  - 서울 평균 전세가
  - 부동산 보유자 자산
  - 부동산 미보유자 자산
  - 자산 격차
  - 서울 집값 / 중위 연봉 배수
- 핵심 시계열 3종을 제공한다.
  - 평균 연봉 + 평균 자산 추이 차트
  - 2016=100 지수 비교 차트
  - 연령대별 자산 변화 차트 또는 카드 보드
- 직접 비교 UI 3종을 제공한다.
  - 2016 vs 2026 비교 보드
  - 연봉 구간별 비교 테이블
  - 부동산 보유 여부별 자산 비교 카드
- 체감 인터랙션 1종을 제공한다.
  - 현재 연봉 입력
  - 현재 연봉의 대략적 위치
  - 서울 평균 집값과의 격차 체감
  - 10년 저축 가정 기준 자산 형성 체감
  - 서울 평균 전세 보증금 마련 기간 체감
- 해설 영역 4종을 제공한다.
  - 패턴 요약 카드
  - 부동산 보유 여부별 자산 격차 해설
  - 외부 참고 링크
  - 관련 계산기 CTA

### 3-2. MVP 제외 범위
- 실시간 통계 API 연동
- 개인 자산 진단 풀 계산기
- 부채, 투자수익률, 세후 수익률 통합 시뮬레이션
- 지역별 집값 필터링
- 가구원 수, 맞벌이, 자녀 수 반영 모델
- 저장 기능 / 사용자 비교 히스토리

---

## 4. 페이지 목적

- 한국인의 평균·중위 연봉과 자산이 2016년 대비 2026년에 얼마나 달라졌는지 한 페이지에서 비교한다.
- 사용자가 `연봉은 올랐지만 왜 자산 격차는 더 커졌는가`를 서울 집값과 함께 이해하게 한다.
- 리포트에서 끝나지 않고 `연봉 티어`, `가구 소득`, `이직`, `서울 집값` 리포트나 계산기로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 20~40대 직장인
- `평균 연봉`, `중위 연봉`, `평균 자산`, `2016 2026 비교` 검색 후 유입한다.
- 중위 연봉과 중위 자산이 얼마나 변했는지 먼저 본다.
- 서울 집값이 연봉보다 얼마나 더 빨리 올라갔는지 확인한다.

### 5-2. 자산 형성 초입 사용자
- 연봉은 올랐는데 체감이 나아지지 않는 이유를 찾는다.
- 부동산 보유자와 미보유자의 자산 격차를 본다.
- 현재 연봉을 넣고 서울 평균 집값, 전세 보증금과의 격차를 체감한다.

### 5-3. 연봉/이직 관심 사용자
- 내 연봉이 어느 구간인지 대략 확인한다.
- 이후 연봉 티어 계산기나 이직 계산기로 이어진다.

### 5-4. 일반 검색 유입 사용자
- `한국인 평균 연봉`, `한국인 평균 자산`, `자산 격차`, `서울 집값 연봉 비교` 검색으로 들어와 핵심 수치를 빠르게 읽는다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `primaryChartMode`
  - `average`: 평균 연봉 + 평균 자산 추이
  - `index`: 2016=100 지수 비교
  - `ageAsset`: 연령대별 자산 변화
- `incomeLevel`
  - 사용자 현재 연봉 입력값, 단위 `만원`
- `savingRate`
  - 기본값 30%
  - 10년 저축 체감 계산용

#### 확장 대비 URL 파라미터
- `mode`
- `salary`
- `save`

### 6-2. 출력값

#### 메인 리포트 출력
- 중위 연봉 상승률
- 중위 자산 상승률
- 서울 집값 상승률
- 부동산 보유자 자산 증가폭
- 미보유자 자산 증가폭
- 자산 격차 확대 폭

#### 차트 / 표 출력
- 평균 연봉 추이
- 평균 자산 추이
- 2016=100 지수 비교
- 연봉 구간별 변화 테이블
- 연령대별 자산 카드 또는 차트

#### 체감 계산 출력
- 현재 연봉의 대략적 구간 위치
- 10년 저축 추정 금액
- 서울 평균 집값 대비 격차
- 서울 평균 전세 보증금 마련 기간

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 연봉·자산 브리프 보드
4. KPI 요약 카드
5. 평균 연봉 + 평균 자산 추이 차트
6. 2016=100 지수 비교 차트
7. 2016 vs 2026 직접 비교 보드
8. 연봉 구간별 비교 테이블
9. 부동산 보유자 vs 미보유자 자산 비교 카드
10. 연령대별 자산 변화 보드
11. 내 연봉 기준 체감 계산 박스
12. 패턴 요약 카드
13. 외부 참고 링크
14. 관련 계산기 / 리포트 CTA
15. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 평균 연봉/자산 차트
- 지수 비교 차트
- 2016 vs 2026 비교
- 연봉 구간 표
- 보유/미보유 자산 비교
- 연령대 자산 변화
- 체감 계산기
- 패턴 요약
- 외부 링크
- CTA
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- 상단 차트는 `연봉·자산 추이`와 `지수 비교`를 세로로 배치하거나 2열 보드로 구성
- 비교 보드와 보유/미보유 자산 보드는 2열 카드 구조
- 연봉 구간 테이블은 전체폭 + 가로 스크롤 대응

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `연봉·자산 비교 리포트`
- H1 예시: `한국인 평균 연봉·자산 2016 vs 2026`
- 설명 예시:
  - 중위 연봉, 중위 자산, 서울 집값을 같은 기준축에서 비교합니다.
  - 연봉 상승보다 자산 격차가 더 빨리 벌어진 구조를 읽는 리포트라는 메시지를 준다.

#### InfoNotice
- 필수 문구
  - 연봉·자산 수치는 공개 통계와 기사 정리값 기준의 비교용 참고 데이터임
  - 평균값과 중위값은 같은 의미가 아니므로 섞어서 읽지 않아야 함
  - 체감 계산은 추정치이며 실제 자산, 부채, 맞벌이 여부에 따라 달라질 수 있음
  - 기준 시점과 업데이트일 명시

#### 연봉·자산 브리프 보드
- 리드 문단 1개
- 하이라이트 카드 3개
  - 중위 연봉 변화
  - 중위 자산 변화
  - 서울 집값과의 속도 차이
- 목적: 검색 유입 사용자가 첫 화면에서 `소득 상승`, `자산 상승`, `주거비 압박`을 동시에 이해하게 한다.

#### KPI 요약 카드
- 카드 5~6개 권장
  - 중위 연봉 상승률
  - 중위 자산 상승률
  - 서울 집값 상승률
  - 부동산 보유자 자산
  - 미보유자 자산
  - 자산 격차 확대

#### 평균 연봉 + 평균 자산 추이 차트
- 2016~2026 연도별 라인 차트
- 좌측 y축: 평균 연봉(만원)
- 우측 y축: 평균 자산(억원)
- 목적: 평균 기준으로 보면 소득보다 자산이 더 빠르게 늘어난 흐름을 보여준다.

#### 2016=100 지수 비교 차트
- 3개 라인 또는 bar+line 혼합
  - 중위 연봉 지수
  - 중위 자산 지수
  - 서울 집값 지수
- 목적: `집값 > 자산 > 연봉` 속도 차이를 직관적으로 보여준다.

#### 2016 vs 2026 직접 비교 보드
- 좌: 2016
- 우: 2026
- 비교 항목
  - 중위 연봉
  - 중위 자산
  - 서울 평균 집값
  - 서울 평균 전세가
  - 집값 / 중위 연봉 배수
  - 부동산 보유자 자산
  - 부동산 미보유자 자산
  - 자산 격차

#### 연봉 구간별 비교 테이블
- 컬럼
  - 구간
  - 2016 연봉
  - 2026 연봉
  - 상승률
  - 서울 집값 따라잡기 체감
- 목적: 평균값보다 내 위치를 더 쉽게 읽게 한다.

#### 부동산 보유자 vs 미보유자 자산 비교 카드
- 카드 2개
  - 부동산 보유자 자산
  - 부동산 미보유자 자산
- 중간에 자산 격차 확대 설명 박스를 둔다.
- 목적: 이번 리포트의 핵심 메시지인 자산 격차 확대를 분명하게 전달한다.

#### 연령대별 자산 변화 보드
- 20대, 30대, 40대, 50대, 60대+
- 카드 또는 가로 bar chart
- 목적: 같은 10년이라도 연령대별 자산 형성 속도가 어떻게 달랐는지 보여준다.

#### 내 연봉 기준 체감 계산 박스
- 입력
  - 현재 연봉(만원)
  - 저축률(기본 30%)
- 출력 카드 4개
  - 대략적 연봉 구간 위치
  - 10년 저축 추정 금액
  - 서울 평균 집값 대비 격차
  - 서울 평균 전세 보증금 마련 기간
- 별도 제출 버튼 없이 즉시 반영

#### 패턴 요약 카드
- 카드 3~4개
- 예시 주제
  - 연봉보다 자산이 더 빨리 늘어난 이유
  - 자산보다 서울 집값이 더 빨리 오른 이유
  - 보유/미보유 격차가 커진 구조
  - 30~40대 체감이 특히 큰 이유

#### 외부 참고 링크 섹션
- 3개 그룹으로 분리
  - 공식 통계
  - 부동산 참고
  - 금융/절세/자산관리 참고
- 공식 링크 우선

#### 관련 계산기 / 리포트 CTA
- 내부 링크 우선
  - `salary-tier`
  - `salary`
  - `negotiation`
  - `household-income`
  - `seoul-housing-2016-vs-2026`
- 목적: 연봉·자산·주거비 흐름을 비교계산소 안에서 이어서 보게 한다.

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `content-section`, `section-header`, `report-stat-card`, `panel`

### 8-2. 페이지 전용 블록
- `income-asset-hero-board`
- `income-asset-highlight-card`
- `income-asset-kpi-grid`
- `income-asset-main-chart-panel`
- `income-asset-index-chart-panel`
- `income-asset-compare-grid`
- `income-band-table`
- `asset-gap-grid`
- `age-asset-grid`
- `income-asset-feel-box`
- `income-asset-pattern-grid`
- `income-asset-reference-panel`
- `income-asset-cta-panel`

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, FAQ, 초기 계산값을 만든다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/salary-asset-2016-vs-2026.js`에서
  - 차트 렌더
  - 체감 계산
  - URL 파라미터 동기화
- 1차는 별도 Astro 하위 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type PrimaryChartMode = "average" | "index" | "ageAsset";

type ViewState = {
  primaryChartMode: PrimaryChartMode;
  incomeLevel: number;
  savingRate: number;
};
```

### 9-2. 초기값
- `primaryChartMode = "average"`
- `incomeLevel = 4000`
- `savingRate = 30`

### 9-3. 동작 규칙
- 차트 모드 변경 시
  - 표시 패널 강조 상태 갱신
  - 필요하면 설명 문구와 범례 갱신
- 연봉 입력 변경 시
  - 체감 카드 4개 즉시 갱신
- 저축률 변경 시
  - 10년 저축 추정 금액 즉시 갱신
- URL 파라미터 동기화 권장
  - `mode`
  - `salary`
  - `save`

예시:
```txt
/reports/salary-asset-2016-vs-2026/?mode=index&salary=4200&save=30
```

---

## 10. 계산 로직

### 10-1. 핵심 KPI 계산
```ts
medianSalaryGrowthRate = Math.round(((medianSalary2026 - medianSalary2016) / medianSalary2016) * 100);
medianAssetGrowthRate = Math.round(((medianAsset2026 - medianAsset2016) / medianAsset2016) * 100);
seoulHouseGrowthRate = Math.round(((seoulHouse2026 - seoulHouse2016) / seoulHouse2016) * 100);
assetGapDiff = assetGap2026 - assetGap2016;
```

### 10-2. 2016=100 지수 계산
```ts
salaryIndex = Math.round((medianSalaryYear / medianSalary2016) * 100);
assetIndex = Math.round((medianAssetYear / medianAsset2016) * 100);
houseIndex = Math.round((seoulHouseYear / seoulHouse2016) * 100);
```

### 10-3. 연봉 기준 집값 배수
```ts
houseYears = +(seoulHouse2026Manwon / incomeLevel).toFixed(1);
```

### 10-4. 10년 저축 추정
```ts
annualSaving = incomeLevel * (savingRate / 100);
tenYearSaving = annualSaving * 10;
```
- 단순 추정치로, 투자 수익률과 세후 차이는 반영하지 않는다.

### 10-5. 전세 보증금 마련 기간
```ts
jeonseYears = +(seoulJeonse2026Manwon / annualSaving).toFixed(1);
```
- `annualSaving`이 0 이하인 경우 예외 처리 필요

### 10-6. 연봉 구간 위치 추정
```ts
if (incomeLevel < q1Income2026) tier = "하위 25%권";
else if (incomeLevel < medianIncome2026) tier = "중위권 하단";
else if (incomeLevel < q3Income2026) tier = "중위권 상단";
else if (incomeLevel < top10Income2026) tier = "상위 25%권";
else tier = "상위 10%권";
```

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type IncomeAssetKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral" | "warning";
};

export type IncomeAssetAverageSeriesItem = {
  year: number;
  avgSalaryManwon: number;
  avgAssetEok: number;
};

export type IncomeAssetIndexSeriesItem = {
  year: number;
  salaryIndex: number;
  assetIndex: number;
  houseIndex: number;
};

export type IncomeBandRow = {
  label: string;
  salary2016Manwon: number;
  salary2026Manwon: number;
  growthRate: number;
  feelLabel: string;
};

export type AgeAssetRow = {
  ageLabel: string;
  asset2016Eok: number;
  asset2026Eok: number;
};

export type SalaryAsset2016Vs2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  reportLead: string;
  kpis: IncomeAssetKpi[];
  averageSeries: IncomeAssetAverageSeriesItem[];
  indexSeries: IncomeAssetIndexSeriesItem[];
  compareRows: { label: string; value2016: string; value2026: string; changeLabel: string }[];
  incomeBandRows: IncomeBandRow[];
  assetGapCards: {
    owner: { title: string; value2016: string; value2026: string; summary: string };
    nonOwner: { title: string; value2016: string; value2026: string; summary: string };
    gapNote: string;
  };
  ageAssetRows: AgeAssetRow[];
  patternNotes: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  references: {
    official: { label: string; href: string }[];
    housing: { label: string; href: string }[];
    finance: { label: string; href: string }[];
  };
  relatedLinks: { label: string; href: string }[];
  calculatorDefaults: {
    incomeLevelManwon: number;
    savingRate: number;
    seoulHouse2026Manwon: number;
    seoulJeonse2026Manwon: number;
    medianIncome2026Manwon: number;
    q1Income2026Manwon: number;
    q3Income2026Manwon: number;
    top10Income2026Manwon: number;
  };
};
```

### 11-2. 데이터 운영 규칙
- 연봉 관련 수치는 `만원` 기준으로 통일한다.
- 자산은 내부 저장 시 `억원` 또는 `만원` 중 하나로 통일하고 표시 함수로 분리한다.
- 평균값과 중위값을 같은 카드에 섞지 않는다.
- 서울 집값 및 전세가는 비교용 참고 수치이므로 기준 시점을 명시한다.
- 기사 정리값이나 추정 계산은 `추정`, `참고` 문구를 `InfoNotice`에 포함한다.

### 11-3. 추천 초기 데이터 세트
- `averageSeries`
  - 2016~2026 연도별 평균 연봉 / 평균 자산
- `indexSeries`
  - 2016=100 지수 비교
- `compareRows`
  - 중위 연봉, 중위 자산, 서울 집값, 서울 전세가, 집값/연봉 배수, 보유자 자산, 미보유자 자산, 자산 격차
- `incomeBandRows`
  - 하위 25%, 중위, 상위 25%, 상위 10%, 상위 5%
- `ageAssetRows`
  - 20대, 30대, 40대, 50대, 60대+

### 11-4. 등록 파일
- 메인 데이터: `src/data/salaryAsset2016Vs2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/salaryAsset2016Vs2026.ts` 생성
- `meta`, `reportLead`, `kpis`, `averageSeries`, `indexSeries`, `compareRows`, `incomeBandRows`, `assetGapCards`, `ageAssetRows`, `patternNotes`, `faq`, `references`, `relatedLinks`, `calculatorDefaults` 작성
- 파생값
  - KPI 카드 값
  - 비교 보드용 change label
  - 체감 계산 기본값

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/salary-asset-2016-vs-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 평균 연봉/자산 차트
  - 지수 비교 차트
  - 2016 vs 2026 비교 보드
  - 연봉 구간 표
  - 자산 격차 카드
  - 연령대 자산 변화
  - 체감 계산 박스
  - 패턴 요약
  - 외부 링크
  - 관련 CTA
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/salary-asset-2016-vs-2026.js`
- 담당 기능
  - Chart.js 렌더
  - 체감 계산
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_salary-asset-2016-vs-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - `wedding-cost-2016-vs-2026`처럼 읽기 쉬운 비교 리포트 밀도 유지
  - `seoul-housing-2016-vs-2026`처럼 차트와 구조 해설 흐름 유지
  - `연봉 리포트`처럼 보이지 않고 `연봉+자산 비교 리포트`로 읽히게 시각적 위계 정리

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 연봉·자산 비교 시리즈에 추가
- `public/sitemap.xml` 추가

### 12-6. 6단계: OG / 메타 / 링크 정리
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 계산기 / 관련 리포트 연결
- 외부 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 중위 연봉 / 평균 연봉 / 중위 자산 / 평균 자산 단위가 일치하는지 확인
- [ ] 평균값과 중위값이 같은 카드나 문장에 혼용되지 않는지 확인
- [ ] 서울 집값과 전세가 기준 시점 문구가 빠지지 않는지 확인
- [ ] 부동산 보유자 / 미보유자 자산 수치 출처 성격이 동일한지 확인
- [ ] `추정`, `참고`, `비교용` 라벨이 필요한 곳에 빠지지 않았는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `한국인 연봉·자산 10년 비교 리포트`라는 성격이 명확한지 확인
- [ ] 브리프 -> KPI -> 평균/지수 차트 흐름이 자연스러운지 확인
- [ ] 2016 vs 2026 비교 보드가 모바일에서 잘리지 않는지 확인
- [ ] 연봉 구간 테이블이 모바일에서 가로 스크롤로 깨지지 않는지 확인
- [ ] 연봉 입력 변경 시 체감 카드가 즉시 갱신되는지 확인
- [ ] 자산 격차 카드가 단순 텍스트가 아니라 비교 구조로 보이는지 확인

### 13-3. SEO / 운영
- [ ] `reports.ts` 등록
- [ ] `reports/index.astro` 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` intro / criteria / FAQ / related 구성 완료
- [ ] `InfoNotice` 기준 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] `npm run build` 통과

---

## 14. 구현 메모

### 14-1. 비교계산소 기준 포지션
- 이 페이지는 단순 연봉 기사 요약이 아니라 `연봉 상승 vs 자산 상승 vs 집값 상승`을 비교하는 10년 리포트다.
- 핵심은 `얼마 벌게 됐는가`보다 `얼마를 따라잡지 못했는가`를 숫자로 보여주는 것이다.

### 14-2. 기존 리포트와의 차이
- `seoul-housing-2016-vs-2026`보다 자산 형성과 계층 구조 해석 비중이 더 크다.
- `wedding-cost-2016-vs-2026`보다 생활비 부담이 아니라 소득·자산 격차 해석이 중심이다.
- `salary-tier`처럼 개인 위치 확인 계산기로 직접 이어질 수 있어야 한다.

### 14-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 차트 섹션 구성
3. 비교 보드 / 테이블 / 자산 격차 카드 구현
4. 체감 계산 박스 구현
5. 외부 링크 / CTA / 허브 연결
6. OG 및 마무리

### 14-4. 확장 방향
- `한국인 평균 소비 2016 vs 2026`
- `직장인 자산 형성 10년 비교`
- `서울 집값 vs 연봉 20년 비교`
- `자산 형성 계산기`
