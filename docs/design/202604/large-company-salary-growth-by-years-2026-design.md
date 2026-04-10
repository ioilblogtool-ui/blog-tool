# 2026 대기업 연차별 연봉 성장 비교 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/large-company-salary-growth-by-years-2026.md`
- 구현 대상: 주요 대기업 15개사의 연차별 연봉 성장 흐름을 비교하는 인터랙티브 리포트
- 참고 페이지:
  - `new-employee-salary-2026`
  - `it-si-sm-salary-comparison-2026`
  - `insurance-salary-bonus-comparison-2026`
  - `construction-salary-bonus-comparison-2026`
  - `salary-tier`

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 표준화 성장곡선 계산 규칙, 구현 파일, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `시장 요약 -> 연차별 성장곡선 비교 -> 성장 유형 해석 -> 내 연봉 벤치마크 -> 회사별 비교표 -> 관련 계산기 연결`
- `new-employee-salary-2026`의 상단 요약 구조와 `it-si-sm-salary-comparison-2026`의 비교 탐색 UX를 참고하되, 이번 페이지는 `초봉 순위`보다 `5년차/10년차/15년차 성장 패턴` 해석 비중이 더 높다.
- 실제 공시 연차별 연봉 페이지처럼 보이게 하면 안 되고, `공개 평균연봉 + 초봉 + 근속연수 기반 표준화 모델 리포트`라는 성격을 분명히 드러내야 한다.

### 1-4. 권장 slug
- `large-company-salary-growth-by-years-2026`
- URL: `/reports/large-company-salary-growth-by-years-2026/`

### 1-5. 권장 파일 구조
- `src/data/largeCompanySalaryGrowthByYears2026.ts`
- `src/pages/reports/large-company-salary-growth-by-years-2026.astro`
- `public/scripts/large-company-salary-growth-by-years-2026.js`
- `src/styles/scss/pages/_large-company-salary-growth-by-years-2026.scss`
- `public/og/reports/large-company-salary-growth-by-years-2026.png`

---

## 2. 현재 프로젝트 비교 컨텐츠 구조 정리

### 2-1. 현재 리포트 공통 구조
현재 `/reports/` 비교 콘텐츠는 아래 공통 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 브리프 보드 또는 KPI 카드
4. 비교 차트 / 비교 표 / 포디움 카드
5. 선택형 탐색 또는 보조 계산 영역
6. 패턴 요약 / 인사이트 카드
7. 외부 참고 링크
8. 관련 계산기 / 리포트 CTA
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
- `new-employee-salary-2026`에서 가져올 것
  - 초입 KPI와 시장 요약 카드
  - 연봉/실수령처럼 다른 관점의 보조 비교 보드 구성 방식
  - 시리즈 허브로 이어지는 CTA 흐름
- `it-si-sm-salary-comparison-2026`에서 가져올 것
  - 필터/정렬/회사 선택 중심 탐색 보드
  - 내 연봉 입력 후 유사 구간 기업을 보여주는 UX
  - 상세 카드와 차트 동기화 구조
- `insurance-salary-bonus-comparison-2026`, `construction-salary-bonus-comparison-2026`에서 가져올 것
  - 업종/유형 필터
  - 포디움 카드 + 비교표 + 해석 카드 조합
  - 실측값과 추정값을 분리해서 다루는 방식
- 이번 페이지에서 새롭게 강조할 것
  - `연차별 성장곡선`을 메인 시각 요소로 삼는 것
  - `초봉형 / 안정형 / 장기근속형 / 성과급형` 성장 유형을 별도 해설 보드로 제공하는 것
  - `연봉 순위표`가 아니라 `시간축 성장 패턴 비교 리포트`라는 점

---

## 3. 구현 범위

### 3-1. MVP 범위
- 비교 대상 기업 15개를 고정 데이터로 제공한다.
  - 삼성전자
  - SK하이닉스
  - 현대자동차
  - 기아
  - 현대모비스
  - 네이버
  - 카카오
  - SK텔레콤
  - 삼성SDS
  - LG CNS
  - 현대오토에버
  - LG전자
  - 포스코홀딩스
  - 현대건설
  - 대한항공
- 기준값 4종을 제공한다.
  - 초봉
  - 평균 연봉
  - 평균 근속연수
  - 업종
- 표준화 성장 밴드 4종을 제공한다.
  - 1년차
  - 5년차
  - 10년차
  - 15년차
- 필터 4종을 제공한다.
  - 업종: 전체 / 반도체 / 자동차 / 플랫폼·IT / IT서비스 / 전자·제조 / 건설 / 항공
  - 성장 유형: 전체 / 초봉형 / 안정형 / 장기근속형 / 성과급형
  - 보기 범위: 1~10년 / 1~15년
  - 정렬: 10년차 높은순 / 평균연봉 높은순 / 초봉 높은순 / 가나다순
- 메인 비교 UI 4종을 제공한다.
  - 연차별 성장곡선 라인차트
  - KPI 요약 카드
  - 성장 유형 보드
  - 회사별 비교 테이블
- 보조 탐색 UI 2종을 제공한다.
  - 내 연봉 벤치마크 입력
  - 선택 기업 상세 카드
- 해설 영역 4종을 제공한다.
  - 패턴 요약 카드
  - FAQ
  - 외부 참고 링크
  - 관련 계산기 / 관련 리포트 CTA

### 3-2. MVP 제외 범위
- 실시간 외부 API 연동
- 직무별 / 직군별 / 평가등급별 세부 성장 모델
- 실제 세후 실수령액 시뮬레이션
- 복수 기업 체크 후 커스텀 라인 5개 이상 동시 비교
- 개인 이직 시뮬레이터 수준의 연봉 제안 계산
- 회원 저장, 히스토리 저장

---

## 4. 페이지 목적

- 초봉만으로는 보이지 않는 `중간 연차 이후 보상 성장 패턴`을 한 화면에서 비교한다.
- 사용자가 특정 회사가 `초봉형인지`, `장기적으로 강한지`, `성과급 체감이 큰지`를 빠르게 이해하게 한다.
- 내 현재 연봉을 입력해 `시장 내 위치`, `유사 구간 회사`, `이직 체감`까지 자연스럽게 이어지게 한다.
- `연봉 계산기`, `연봉 인상 계산기`, `이직 계산기`, `신입 초봉 리포트`와 연결되는 허브 리포트 역할을 수행한다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 3~10년차 직장인
- `대기업 연차별 연봉`, `10년차 연봉 비교`, `삼성전자 10년차 연봉`, `네이버 5년차 연봉` 검색으로 유입한다.
- 초봉보다 5년차, 10년차, 15년차 밴드 차이를 먼저 본다.
- 내 현재 연봉과 비슷한 기업군이 어디인지 확인한다.

### 5-2. 대기업 이직 준비자
- 현재 회사보다 성장 속도가 빠른 회사가 있는지 본다.
- 평균연봉이 높아도 장기근속형인지, 성과급형인지 구분해서 읽는다.
- 이직 계산기나 연봉 인상 계산기로 이어진다.

### 5-3. 취준생·주니어
- 초봉만 보던 단계에서 한 단계 더 들어가 `장기 성장성`을 확인한다.
- 특정 업종이 중장기적으로 유리한지 살펴본다.
- `new-employee-salary-2026`, `it-salary-top10`로 다시 이어질 수 있다.

### 5-4. 일반 검색 유입 사용자
- 기사형 긴 글보다 빠르게 숫자와 패턴을 읽고 싶어 한다.
- 첫 화면에서 `초봉과 10년차는 다를 수 있다`는 메시지를 이해한다.
- 상세 표와 FAQ로 신뢰를 보완한다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `industryFilter`
  - `all`
  - `semiconductor`
  - `auto`
  - `platform`
  - `itService`
  - `electronics`
  - `construction`
  - `airline`
- `growthTypeFilter`
  - `all`
  - `starterFast`
  - `stable`
  - `longTenure`
  - `performanceHeavy`
- `rangeMode`
  - `tenYears`
  - `fifteenYears`
- `sort`
  - `year10Desc`
  - `avgDesc`
  - `starterDesc`
  - `name`
- `selectedCompany`
  - 상세 카드용 회사 slug
- `mySalary`
  - 사용자 현재 연봉 입력값
  - 단위 `만원`

#### 확장 대비 URL 파라미터
- `industry`
- `type`
- `range`
- `sort`
- `company`
- `salary`

### 6-2. 출력값

#### 메인 리포트 출력
- 비교 대상 기업 수
- 최고 평균 연봉 기업
- 최고 10년차 밴드 상단 기업
- 최고 근속연수 기업
- 업종별 대표 패턴 요약

#### 차트 / 보드 출력
- 선택 필터 기준 성장곡선 라인차트
- 성장 유형별 대표 기업 카드
- 1년차 / 5년차 / 10년차 / 15년차 비교표
- 선택 기업 상세 카드

#### 벤치마크 출력
- 내 현재 연봉의 대략적 시장 위치
- 현재 연봉과 가까운 기업 2~4개
- 현재 연봉 기준 5년차 / 10년차 비교 문구

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 리포트 브리프 보드
4. KPI 요약 카드
5. 상위 성장 기업 포디움 카드
6. 연차별 성장곡선 차트 보드
7. 성장 유형 보드
8. 리포트 탐색 보드
   - 필터 바
   - 내 연봉 벤치마크 패널
   - 선택 기업 상세 카드
9. 회사별 비교 테이블
10. 패턴 요약 / 인사이트 카드
11. 외부 참고 링크
12. 관련 계산기 / 관련 리포트 CTA
13. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 포디움 카드
- 성장곡선 차트
- 성장 유형 보드
- 필터 바
- 내 연봉 벤치마크
- 선택 기업 상세 카드
- 비교 테이블
- 패턴 요약
- 외부 참고 링크
- CTA
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- 포디움 카드와 KPI는 2~3열 카드 그리드
- 차트 보드는 전체폭을 사용해 시각 우선 순위를 높인다.
- 탐색 보드는 `좌: 필터 + 벤치마크 / 우: 상세 카드` 2열 구조
- 비교 테이블은 전체폭 + 모바일 가로 스크롤 대응

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `연봉 성장 비교 리포트`
- H1 예시: `2026 대기업 연차별 연봉 성장 비교`
- 설명 예시:
  - 초봉보다 중요한 건 5년차, 10년차, 15년차에 얼마나 벌어지는지다.
  - 주요 대기업의 공개 평균연봉, 초봉, 근속연수를 바탕으로 표준화한 성장 흐름을 비교한다.

#### InfoNotice
- 필수 문구
  - 연차별 수치는 회사 공시 원문 그대로가 아니라 공개 평균연봉, 초봉, 근속연수 기준을 활용한 참고용 표준화 추정치임
  - 직무, 직군, 평가, 성과급, 사업부에 따라 개인별 차이가 큼
  - 실측값과 추정값을 분리해서 보여준다는 점을 명시
  - 기준 시점과 업데이트일 명시

#### 리포트 브리프 보드
- 구성
  - 리드 문단 1개
  - 하이라이트 카드 3개
    - 초봉형 vs 장기성장형 차이
    - 최고 평균 연봉 기업
    - 최고 근속연수 기업
- 목적: 첫 화면에서 `초봉만 보면 안 된다`는 메시지를 바로 전달한다.

#### KPI 요약 카드
- 카드 4~5개 권장
  - 비교 대상 기업 수
  - 평균 연봉 1위
  - 10년차 밴드 상단 1위
  - 평균 근속연수 최상위
  - 가장 많은 기업이 속한 성장 유형

#### 상위 성장 기업 포디움 카드
- Top 3 기업을 카드형으로 보여준다.
- 기준
  - 기본은 `10년차 밴드 중앙값` 기준
  - 보조 문구로 평균 연봉 / 성장 유형 표시
- 카드 노출값
  - 기업명
  - 업종
  - 10년차 밴드
  - 성장 유형
  - 한 줄 해설

#### 연차별 성장곡선 차트 보드
- 페이지의 핵심 시각 요소
- x축
  - `1년차`, `3년차`, `5년차`, `7년차`, `10년차`, `12년차`, `15년차`
- y축
  - 연봉(만원)
- 상호작용
  - 필터 적용
  - 기업 선택 시 강조
  - 모바일에서는 기본 3개 기업만 강조하고 나머지는 리스트 토글
- 목적: 동일한 초봉이라도 중간 연차에서 벌어지는 차이를 보여준다.

#### 성장 유형 보드
- 유형 4종 카드
  - `초봉형`
  - `안정형`
  - `장기근속형`
  - `성과급형`
- 각 카드 구성
  - 유형명
  - 정의
  - 대표 기업 2~3개
  - 해석 포인트 1문장

#### 리포트 탐색 보드
- 필터 바 + 벤치마크 + 선택 기업 상세 카드 조합
- 계산기처럼 무겁지 않게 `보조 탐색 패널` 톤으로 설계한다.

#### 내 연봉 벤치마크 패널
- 입력 1개: 현재 연봉
- 결과
  - 내 연봉과 가까운 대표 기업
  - 해당 연봉이 어떤 연차 밴드와 겹치는지
  - 시장 체감 문구
    - 예: `현재 연봉 8,200만원은 안정형 대기업의 5~7년차 구간과 겹치는 편입니다.`

#### 선택 기업 상세 카드
- 노출값
  - 기업명
  - 업종
  - 초봉
  - 평균 연봉
  - 근속연수
  - 1/5/10/15년차 밴드
  - 성장 유형
  - 해석 코멘트
- 차트와 표에서 선택 시 동기화한다.

#### 회사별 비교 테이블
- 권장 컬럼
  - 기업
  - 업종
  - 초봉
  - 평균 연봉
  - 근속연수
  - 5년차 밴드
  - 10년차 밴드
  - 15년차 밴드
  - 성장 유형
  - 특징
- 모바일은 카드형 전환 없이 가로 스크롤 우선

#### 패턴 요약 / 인사이트 카드
- 카드 3개 권장
  - 초봉 순위와 10년차 순위는 다를 수 있다
  - 평균연봉이 높아도 장기 체감은 근속구조에 좌우된다
  - 내 연봉 비교는 계산기로 이어져야 의미가 완성된다

#### 외부 참고 링크
- 채용 / 기업 정보 / 공식 IR / 기사 참고를 2~3열로 묶는다.

#### CTA
- 관련 계산기
  - `연봉 티어 계산기`
  - `연봉 인상 계산기`
  - `이직 계산기`
- 관련 리포트
  - `2026 신입사원 초봉 비교`
  - `IT SI·SM 대기업 연봉 비교`
  - `대형 건설사 연봉 비교`

---

## 8. 컴포넌트 구조

### 8-1. 기존 공통 컴포넌트 활용
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`

### 8-2. 페이지 내부 섹션 클래스 권장
- `growth-brief`
- `growth-kpi-grid`
- `growth-podium`
- `growth-chart-board`
- `growth-type-board`
- `growth-controls`
- `growth-benchmark-panel`
- `growth-company-card`
- `growth-compare-table`
- `growth-pattern-grid`
- `growth-reference-panel`
- `growth-cta-grid`

설명:
- prefix `growth-` = large company salary growth report

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, 기본 선택 기업, FAQ, 대표 유형 카드를 계산한다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/large-company-salary-growth-by-years-2026.js`에서
  - 필터/정렬
  - 차트 렌더
  - 비교표 렌더
  - 선택 기업 카드 갱신
  - 내 연봉 벤치마크 결과 갱신
- 1차는 별도 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type IndustryFilter =
  | "all"
  | "semiconductor"
  | "auto"
  | "platform"
  | "itService"
  | "electronics"
  | "construction"
  | "airline";

type GrowthTypeFilter =
  | "all"
  | "starterFast"
  | "stable"
  | "longTenure"
  | "performanceHeavy";

type RangeMode = "tenYears" | "fifteenYears";
type SortMode = "year10Desc" | "avgDesc" | "starterDesc" | "name";

type ViewState = {
  industryFilter: IndustryFilter;
  growthTypeFilter: GrowthTypeFilter;
  rangeMode: RangeMode;
  sort: SortMode;
  selectedCompany: string;
  mySalary: number;
};
```

### 9-2. 초기값
- `industryFilter = "all"`
- `growthTypeFilter = "all"`
- `rangeMode = "fifteenYears"`
- `sort = "year10Desc"`
- `selectedCompany = year10 top company`
- `mySalary = 7000`

### 9-3. 동작 규칙
- 업종 필터 변경 시
  - 차트 / 포디움 / 비교표 / 선택 기업 후보를 함께 갱신
- 성장 유형 필터 변경 시
  - 차트 표시 대상과 유형 보드 강조를 함께 갱신
- 정렬 변경 시
  - 비교표, select 옵션 순서, 포디움 카드 순서를 함께 갱신
- 회사 선택 변경 시
  - 차트 강조 / 상세 카드 / 벤치마크 비교 문구 동기화
- 내 연봉 입력 변경 시
  - 유사 구간 기업과 체감 문구 즉시 갱신
- URL 파라미터 동기화 권장
  - `industry`
  - `type`
  - `range`
  - `sort`
  - `company`
  - `salary`

예시:
```txt
/reports/large-company-salary-growth-by-years-2026/?industry=itService&type=stable&range=fifteenYears&sort=year10Desc&company=samsung-sds&salary=8200
```

---

## 10. 계산 로직

### 10-1. 실측값과 추정값 분리 원칙
- 실측값
  - `starterSalaryManwon`
  - `avgSalaryManwon`
  - `tenureYears`
- 추정값
  - `salaryBands.year1`
  - `salaryBands.year3`
  - `salaryBands.year5`
  - `salaryBands.year7`
  - `salaryBands.year10`
  - `salaryBands.year12`
  - `salaryBands.year15`
- 페이지 문구와 표기에서 추정값임을 명확히 노출한다.

### 10-2. 성장곡선 모델링 원칙
- 기획 문서의 표준화 모델을 따른다.
- 연차별 고정 단일값보다 `min/max 밴드` 또는 `mid + band` 구조를 우선한다.
- 1차 구현은 각 연차에 대해 아래 구조를 저장한다.
```ts
type SalaryBandPoint = {
  year: 1 | 3 | 5 | 7 | 10 | 12 | 15;
  min: number;
  mid: number;
  max: number;
};
```

### 10-3. 기본 모델 규칙
- 1년차
  - 초봉 실측값 또는 초봉 추정값
- 3년차
  - 초봉 대비 약 10~18% 상승
- 5년차
  - 초봉 대비 약 20~35% 상승
- 7년차
  - 평균 연봉의 70~85% 구간
- 10년차
  - 평균 연봉 근접 또는 일부 상회
- 12년차
  - 업종별 구조 반영
- 15년차
  - 장기근속형은 상대적으로 강하게, 플랫폼형은 완만하게

### 10-4. 성장 유형별 보정 방향
```ts
if (growthType === "starterFast") {
  // 초반 상승이 빠르고 후반 완만
}

if (growthType === "stable") {
  // 전 구간 고르게 상승
}

if (growthType === "longTenure") {
  // 중후반부 상승 강도 확대
}

if (growthType === "performanceHeavy") {
  // 평균 연봉 상단과 밴드 폭 확대
}
```

### 10-5. 10년차 정렬값
```ts
sortValue =
  sort === "year10Desc"
    ? entry.salaryBands.find((p) => p.year === 10)?.mid ?? 0
    : sort === "avgDesc"
      ? entry.avgSalaryManwon
      : sort === "starterDesc"
        ? entry.starterSalaryManwon ?? 0
        : 0;
```

### 10-6. 벤치마크 계산
```ts
closestCompanies = entries
  .map((entry) => ({
    entry,
    diff: Math.abs((entry.salaryBands.find((p) => p.year === 5)?.mid ?? entry.avgSalaryManwon) - mySalary),
  }))
  .sort((a, b) => a.diff - b.diff)
  .slice(0, 4);
```
- 1차는 `5년차 mid` 중심으로 내 연봉 비교
- 추후 확장 시 `내 경력연차 입력`을 붙일 수 있다.

### 10-7. KPI 계산
- 최고 평균 연봉 기업: `avgSalaryManwon` max
- 최고 10년차 밴드 기업: `year10.mid` max
- 최고 근속연수 기업: `tenureYears` max
- 비교 대상 수: 필터 적용 전 전체 길이

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type Industry =
  | "semiconductor"
  | "auto"
  | "platform"
  | "itService"
  | "electronics"
  | "construction"
  | "airline";

export type GrowthType =
  | "starterFast"
  | "stable"
  | "longTenure"
  | "performanceHeavy";

export type SalaryBandPoint = {
  year: 1 | 3 | 5 | 7 | 10 | 12 | 15;
  min: number;
  mid: number;
  max: number;
};

export type LargeCompanySalaryGrowthEntry = {
  slug: string;
  companyId: string;
  companyName: string;
  industry: Industry;
  starterSalaryManwon: number | null;
  avgSalaryManwon: number;
  tenureYears: number;
  growthType: GrowthType;
  year10BandLabel: string;
  salaryBands: SalaryBandPoint[];
  summary: string;
  notes?: string;
  tags: string[];
  referenceLabel?: string;
  officialUrl?: string;
  hiringUrl?: string;
  infoUrl?: string;
  updatedAt: string;
};

export type LargeCompanySalaryGrowthByYears2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: LargeCompanySalaryGrowthEntry[];
  typeCards: {
    type: GrowthType;
    title: string;
    body: string;
    companies: string[];
  }[];
  patternPoints: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    hiring: { label: string; href: string }[];
    info: { label: string; href: string }[];
  };
  relatedLinks: {
    label: string;
    href: string;
    kind: "tool" | "report";
  }[];
};
```

### 11-2. 데이터 운영 규칙
- 숫자 단위는 모두 `만원` 기준으로 저장한다.
- `starterSalaryManwon`가 없을 수 있으므로 `null` 허용
- 밴드 데이터는 실측이 아니라 추정값이므로 `salaryBands`에만 저장
- 표에서는 `실측값`, `추정 밴드`를 라벨 또는 column group으로 분리
- `year10BandLabel`은 예: `1.2억~1.4억` 형태의 표시용 문자열
- 모든 엔트리에 `updatedAt`을 넣어 관리 기준을 명확히 한다.

### 11-3. 등록 파일
- 메인 데이터: `src/data/largeCompanySalaryGrowthByYears2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/largeCompanySalaryGrowthByYears2026.ts` 생성
- 15개 기업 엔트리 입력
- `meta`, `typeCards`, `patternPoints`, `faq`, `referenceLinks`, `relatedLinks` 포함
- 파생값
  - 10년차 mid 순위
  - 업종별 기업 수
  - 성장 유형별 기업 수

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/large-company-salary-growth-by-years-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 포디움 카드
  - 성장곡선 차트
  - 성장 유형 보드
  - 필터/벤치마크/상세 카드 보드
  - 비교 테이블
  - 패턴 요약
  - 외부 참고 링크
  - CTA
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/large-company-salary-growth-by-years-2026.js`
- 담당 기능
  - 업종 / 성장 유형 필터
  - 정렬
  - 선택 기업 동기화
  - 성장곡선 차트 렌더
  - 비교표 갱신
  - 내 연봉 벤치마크 결과 계산
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_large-company-salary-growth-by-years-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - 금융 계산기처럼 보이지 않고 리포트 톤이 유지되는지
  - 차트 가독성이 높은지
  - 모바일에서 표와 필터가 답답하지 않은지

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro`의 연봉 시리즈에 추가
- `public/sitemap.xml` 반영

### 12-6. 6단계: 메타 / OG / 내부링크 연결
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 계산기 / 관련 리포트 CTA 연결
- 외부 참고 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 기업명, 업종, 성장 유형 값이 설계 문서와 일치하는지 확인
- [ ] 초봉 / 평균 연봉 / 근속연수 단위가 모두 `만원`, `년`으로 통일되어 있는지 확인
- [ ] `starterSalaryManwon` 누락 기업이 있으면 null 처리와 표시 문구가 맞는지 확인
- [ ] `salaryBands`의 연차 순서가 1, 3, 5, 7, 10, 12, 15로 고정되어 있는지 확인
- [ ] 10년차 밴드가 평균 연봉보다 비정상적으로 낮거나 높은 엔트리가 없는지 확인
- [ ] FAQ와 InfoNotice에 `추정치` 안내가 빠지지 않았는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `연차별 성장 비교 리포트`라는 성격이 명확한지 확인
- [ ] KPI -> 차트 -> 유형 보드 -> 벤치마크 -> 비교표 흐름이 자연스러운지 확인
- [ ] 모바일에서 차트 라벨이 과도하게 겹치지 않는지 확인
- [ ] 선택 기업 변경 시 차트 강조와 상세 카드가 함께 바뀌는지 확인
- [ ] 업종 필터와 성장 유형 필터가 차트/표/포디움 모두에 반영되는지 확인
- [ ] 내 연봉 입력값 변경 시 벤치마크 문구가 즉시 갱신되는지 확인
- [ ] 비교 테이블 가로 스크롤이 깨지지 않는지 확인

### 13-3. SEO / 운영
- [ ] `reports.ts` 등록
- [ ] `reports/index.astro` 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` 구성 완료
- [ ] `InfoNotice` 기준 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] `npm run build` 통과

---

## 14. 구현 메모

### 14-1. 이 페이지의 포지션
- 이 페이지는 `신입 초봉 비교 다음 단계` 역할을 해야 한다.
- 단순 기사형 요약이 아니라 `연봉 성장 리포트`여야 한다.
- 계산기는 보조 역할이고, 메인은 `시간축 보상 구조 비교`다.

### 14-2. 기존 리포트와의 차이
- `new-employee-salary-2026`보다 초봉보다 이후 연차 해석 비중이 훨씬 높다.
- `it-si-sm-salary-comparison-2026`보다 회사 유형보다는 `성장 패턴`이 더 중요하다.
- `salary-tier`처럼 내 위치 비교를 돕지만, 티어 계산보다 `연차별 흐름 읽기`가 핵심이다.

### 14-3. 구현 우선순위
1. 데이터 구조와 성장 밴드 모델 확정
2. 브리프 + KPI + 포디움 정적 섹션 구성
3. 성장곡선 차트 구현
4. 필터 / 상세 카드 / 비교표 구현
5. 내 연봉 벤치마크 구현
6. FAQ / 외부 링크 / SEO 연결

---

## 15. Codex 구현 기준

### 15-1. 이 문서를 보고 구현할 때의 원칙
- 이 페이지는 `연차별 성장 리포트`이며 계산기 페이지처럼 보이면 안 된다.
- `실측값`과 `추정값`을 시각과 문구에서 분리해야 한다.
- 첫 화면에서 반드시 `초봉보다 5년차 이후 격차가 중요하다`는 메시지가 읽혀야 한다.
- 기존 `/reports/` 시리즈의 톤을 유지하되, 이번 페이지의 메인 차트는 `연차별 성장곡선`이어야 한다.
- 데이터가 불완전한 항목은 억지로 확정값처럼 표시하지 말고 `추정`, `범위`, `참고용` 라벨을 붙인다.

### 15-2. Codex가 반드시 생성해야 할 파일
- `src/data/largeCompanySalaryGrowthByYears2026.ts`
- `src/pages/reports/large-company-salary-growth-by-years-2026.astro`
- `public/scripts/large-company-salary-growth-by-years-2026.js`
- `src/styles/scss/pages/_large-company-salary-growth-by-years-2026.scss`

### 15-3. Codex가 함께 수정해야 할 연결 파일
- `src/data/reports.ts`
- `src/pages/reports/index.astro`
- `src/styles/app.scss`
- `public/sitemap.xml`

### 15-4. 구현 완료 조건
- `/reports/large-company-salary-growth-by-years-2026/` 페이지가 정상 렌더링된다.
- Hero, InfoNotice, KPI, 포디움, 성장곡선 차트, 성장 유형 보드, 벤치마크 패널, 비교 테이블, FAQ, CTA가 모두 들어간다.
- 업종 필터 / 성장 유형 필터 / 정렬 / 기업 선택이 동작한다.
- 내 연봉 입력값 변경 시 비교 문구와 유사 기업이 갱신된다.
- `추정치` 안내가 Hero 하단 또는 InfoNotice에 명확히 노출된다.
- 모바일에서 표 가로 스크롤과 차트 가독성이 유지된다.
- `npm run build`가 통과한다.

### 15-5. 구현 시 금지사항
- 연차별 밴드를 실제 공시 확정값처럼 단정해서 표시하지 않는다.
- 섹션을 블로그형 긴 문단 위주로 풀지 않는다.
- 차트 없이 표만 있는 페이지로 축소하지 않는다.
- 기존 리포트와 무관한 새로운 공통 컴포넌트를 과도하게 도입하지 않는다.
- 제휴 CTA를 메인 정보보다 먼저 노출하지 않는다.

### 15-6. Codex 작업 지시용 프롬프트
```text
docs/design/202604/large-company-salary-growth-by-years-2026-design.md 문서를 기준으로 페이지를 구현해줘.

작업 범위:
1. src/data/largeCompanySalaryGrowthByYears2026.ts 생성
2. src/pages/reports/large-company-salary-growth-by-years-2026.astro 생성
3. public/scripts/large-company-salary-growth-by-years-2026.js 생성
4. src/styles/scss/pages/_large-company-salary-growth-by-years-2026.scss 생성
5. src/data/reports.ts, src/pages/reports/index.astro, src/styles/app.scss, public/sitemap.xml 연결 반영

구현 원칙:
- 이 페이지는 계산기보다 리포트형 인터랙티브 비교 페이지다.
- 실측값(초봉, 평균 연봉, 근속연수)과 추정값(연차별 성장 밴드)을 분리해서 보여줘.
- 첫 화면에서 “초봉보다 5년차, 10년차가 더 중요하다”는 메시지가 드러나야 한다.
- 기존 reports 시리즈의 UI 톤을 유지하되, 메인 차트는 연차별 성장곡선으로 구현해줘.
- 데이터가 불완전한 항목은 null 허용 또는 범위/추정 라벨로 처리해줘.

반드시 포함할 섹션:
- Hero
- InfoNotice
- 브리프 보드
- KPI 카드
- Top 3 포디움 카드
- 연차별 성장곡선 차트
- 성장 유형 보드
- 필터 + 내 연봉 벤치마크 + 선택 기업 상세 카드
- 회사별 비교 테이블
- 패턴 요약 카드
- 외부 참고 링크
- 관련 계산기 / 관련 리포트 CTA
- SeoContent

완료 후 확인:
- 모바일 레이아웃 점검
- 추정치 안내 문구 포함 여부 점검
- npm run build 실행
```
