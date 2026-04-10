# IT SI/SM 연봉 비교 리포트 2026 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202603/it-si-sm-salary-comparison-2026.md`
- 구현 레퍼런스: `src/pages/reports/new-employee-salary-2026.astro`
- 구현 대상: 국내 IT SI/SM 대기업 평균 연봉·초봉·성과급 비교 리포트

### 1-2. 문서 역할
- 기획 문서를 비교계산소 기준으로 실제 구현 직전 수준까지 구체화한 설계 문서다.
- 리포트형 화면 구조, 데이터 스키마, 인터랙션, 계산 규칙, 구현 순서를 고정한다.
- Claude/Codex가 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `시장 요약 -> 기업군 비교 -> 내 연봉 벤치마크 -> 기업 상세 탐색`
- `new-employee-salary-2026`의 리포트형 흐름을 참고하되, 초봉보다 `평균 연봉/성과급/회사 규모` 해석 비중을 더 높인다.
- 연봉 계산기처럼 보이지 않게 하고, 읽고 비교하는 리포트 성격을 우선한다.

### 1-4. 권장 slug
- `it-si-sm-salary-comparison-2026`
- URL: `/reports/it-si-sm-salary-comparison-2026/`

### 1-5. 권장 파일 구조
- `src/data/itSiSmSalaryComparison2026.ts`
- `src/pages/reports/it-si-sm-salary-comparison-2026.astro`
- `public/scripts/it-si-sm-salary-comparison-2026.js`
- `src/styles/scss/pages/_it-si-sm-salary-comparison-2026.scss`
- `public/og/reports/it-si-sm-salary-comparison-2026.png`

---

## 2. 구현 범위

### 2-1. MVP 범위
- 비교 대상 기업 9개를 고정 데이터로 제공한다.
  - 삼성SDS
  - LG CNS
  - 현대오토에버
  - 한화시스템 ICT
  - 신세계I&C
  - CJ올리브네트웍스
  - 롯데이노베이트
  - KT ds
  - 미라콤아이앤씨
- 핵심 비교 항목 5종을 제공한다.
  - 평균 연봉
  - 신입 초봉 구간
  - 성과급/인센티브 체감
  - 매출 규모
  - 직원 수
- 필터 4종을 제공한다.
  - 비교 기준: 평균 연봉 / 초봉 / 회사 규모
  - 기업군: 전체 / 상위권 / 안정형 / 운영형
  - 정렬: 높은순 / 낮은순 / 가나다순
  - 기업 선택: 상세 카드용 select
- `내 연봉` 벤치마크 입력을 제공한다.
  - 전체 평균 연봉 분포에서 내 위치 확인
  - 유사 구간 기업 표시
- 대표 기업 비교 차트 2종을 제공한다.
  - 평균 연봉 비교
  - 매출 또는 직원 수 비교
- 기업 상세 카드 1종을 제공한다.
  - 선택 기업의 보상 구조, 규모, 특징, 추천 대상 표시
- SEO용 FAQ, 외부 참고 링크, 선택형 제휴 상품 블록을 포함한다.

### 2-2. MVP 제외 범위
- 실시간 외부 API 연동
- 직급별 연봉 시뮬레이터
- 연차별 연봉 progression 계산
- 복수 기업 체크 후 동시 상세 비교 카드
- 연도별 시계열 차트
- 중견 SI/SM 대량 확장

---

## 3. 페이지 목적

- 국내 SI/SM 계열 대기업의 보상 체계를 한 화면에서 비교해 `어느 회사가 연봉 상단인지`, `어디가 안정형인지`, `어디가 성장형인지`를 빠르게 읽게 한다.
- 평균 연봉 숫자만 보여주지 않고 `초봉`, `성과급 변동성`, `회사 규모`, `업무 성격`을 함께 제시해 이직 판단용 참고 리포트로 만든다.
- 비교계산소의 강점인 `내 위치 비교`를 보조 기능으로 붙여 사용자가 자기 연봉 구간과 가까운 회사를 바로 찾게 한다.

---

## 4. 핵심 사용자 시나리오

### 4-1. 이직 검토 중인 5~10년차 개발자
- SI/SM 계열 대기업 중 평균 연봉 상단이 어디인지 본다.
- 평균 연봉이 높더라도 성과급 변동성이 큰지 확인한다.
- 내 현재 연봉을 넣어 어느 기업군과 가까운지 확인한다.

### 4-2. 대기업 IT 서비스 계열 진입을 보는 신입/주니어
- 초봉 기준으로 어느 회사가 상단인지 본다.
- SI보다 운영/그룹 IT 성격이 강한 회사와 비교한다.
- 기업별 복리후생, 브랜드, 성장성을 간단히 본다.

### 4-3. 업계 비교 리포트를 읽는 일반 사용자
- 삼성SDS, LG CNS, 현대오토에버 같은 대형사 차이를 한 번에 이해한다.
- 회사 규모와 평균 연봉이 비례하는지 확인한다.
- 관련 연봉/이직 계산기로 이어진다.

---

## 5. 입력값 / 출력값 정의

### 5-1. 입력값

#### 필수 입력
- `compareMode`
  - `salary`: 평균 연봉 기준
  - `starter`: 신입 초봉 기준
  - `companySize`: 회사 규모 기준
- `filterGroup`
  - `all`: 전체
  - `top`: 평균 연봉 상단권
  - `stable`: 대기업 안정형 그룹 IT
  - `ops`: 운영/SM 비중이 높은 그룹
- `sort`
  - `desc`
  - `asc`
  - `name`
- `selectedCompany`
  - 상세 카드에 표시할 기업 slug

#### 선택 입력
- `mySalary`
  - 단위: 만원
  - 용도: 전체 평균 연봉 분포상 내 위치 비교

### 5-2. 출력값

#### 메인 출력
- 최고 평균 연봉 기업
- 평균 연봉 상단권 구간
- 평균 초봉 구간
- 비교 대상 기업 수

#### 탐색 출력
- 필터링된 비교 막대 차트
- 선택 기업 상세 카드
- 내 연봉 입력 시
  - 전체 상위 퍼센트
  - 평균 대비 차이
  - 유사 구간 기업 2~4개

#### 해석 출력
- 상단권 기업 Top 3 카드
- 기업군별 패턴 요약 카드
- 외부 참고 링크
- 관련 계산기/리포트 링크

---

## 6. 섹션 구조

### 6-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 리포트 브리프 보드
4. KPI 요약 카드
5. 상위권 포디움 카드
6. 평균 연봉 / 회사 규모 차트 보드
7. 리포트 탐색 보드
   - 내 연봉 벤치마크 패널
   - 시장 맵 필터 패널
   - 기업 상세 카드
8. 티어 보드
9. 패턴 요약 / 기업군 설명
10. 외부 참고 링크 섹션
11. 제휴 상품 섹션
12. `SeoContent`

### 6-2. 모바일 우선 화면 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 상위권 카드
- 차트 보드
- 내 연봉 벤치마크
- 시장 맵 필터 차트
- 기업 상세 카드
- 티어 보드
- 패턴 요약
- 외부 참고 링크
- 제휴 상품
- SEO

### 6-3. PC 레이아웃
- 상단 브리프 보드는 `좌: 해설`, `우: 하이라이트 카드` 2열
- 차트 보드는 `평균 연봉 차트`와 `회사 규모 차트` 2열
- 탐색 보드는 `좌: 벤치마크 + 시장맵`, `우: 기업 상세 카드` 2열
- 티어 보드는 표형 2컬럼 구조
- 모바일에서는 모든 섹션이 1열로 자연스럽게 내려와야 한다.

### 6-4. 섹션별 역할

#### Hero
- eyebrow: `Interactive Report`
- H1 예시: `IT SI/SM 대기업 연봉 비교 2026 — 삼성SDS·LG CNS·현대오토에버 어디가 높을까?`
- 설명:
  - 평균 연봉, 초봉, 성과급 체감, 회사 규모를 함께 비교한다.
  - 이직·커리어 판단용 참고 리포트라는 점을 명확히 한다.

#### InfoNotice
- 필수 문구
  - 평균 연봉은 공시 기준 / 채용 플랫폼 추정 / 보도자료가 섞일 수 있음
  - 성과급은 회사별 변동성이 커서 `체감`, `범위`, `추정`으로 표기
  - 최신 기준일과 출처를 함께 명시
  - 공식 처우 협상의 근거가 아니라 참고 리포트임을 고지

#### 리포트 브리프 보드
- 리포트 첫 인상용 섹션
- 구성
  - 리드 문단 1개
  - 하이라이트 카드 3개
    - 가장 높은 평균 연봉
    - 1위와 2위 격차
    - 비교 대상 기업 수
- 목적: `salary-tier`와 차별화되는 리포트 첫 화면 구성

#### KPI 요약 카드
- 카드 4개 권장
  - 최고 평균 연봉 기업
  - 평균 연봉 상단 구간
  - 초봉 평균 구간
  - 리포트 커버 기업 수

#### 상위권 포디움 카드
- Top 3 기업을 카드형으로 보여준다.
- 카드 노출값
  - 기업명
  - 평균 연봉
  - 회사 성격
  - 한 줄 요약
- 숫자 순위만 나열하지 말고 `왜 상단인지`를 같이 보여준다.

#### 차트 보드
- 차트 2종
  - 평균 연봉 비교 가로 바 차트
  - 회사 규모 비교 차트
    - 1차는 매출 기준, 보조 토글 없이 고정
- 바 클릭 시 상세 카드 기업 선택 동기화
- 차트 하단에 범례와 참고 문구 배치

#### 리포트 탐색 보드
- 좌측 또는 상단
  - `내 연봉 벤치마크` 패널
  - `시장 맵` 필터 패널
- 우측 또는 하단
  - 기업 상세 카드
- 계산기처럼 보이지 않도록 `보조 탐색 기능`으로 배치한다.

#### 내 연봉 벤치마크 패널
- 입력 1개: 내 연봉(만원)
- 결과
  - 전체 평균 연봉 분포 상위 %
  - 평균 대비 차이
  - 유사 구간 기업
- 이 결과는 리포트 보조 정보이며 메인 KPI보다 위에 두지 않는다.

#### 시장 맵 필터 패널
- 필터 컨트롤
  - 비교 기준 탭
  - 기업군 필터 칩
  - 정렬 select
- 렌더
  - tier label + bar row 형태의 가벼운 HTML 차트
- 차트 업데이트는 Chart.js 대신 DOM 렌더로 처리 가능하다.

#### 기업 상세 카드
- 선택 기업 기준으로 아래 정보 노출
  - 평균 연봉
  - 초봉 구간
  - 성과급 체감 설명
  - 매출 규모
  - 직원 수
  - 대표 태그
  - 추천 대상
  - 한 줄 요약
- `new-employee-salary-2026`의 프로필 카드 구조를 참고하되 연봉/성과급/규모 중심으로 재배치한다.

#### 티어 보드
- 평균 연봉 기준 티어별 기업 목록
- 예시 티어
  - `1억 이상`
  - `8천~1억`
  - `7천~8천`
  - `6천~7천`
  - `6천 미만`
- 태그 예시
  - `상단권`
  - `그룹IT`
  - `운영형`
  - `성장형`

#### 패턴 요약 섹션
- 카드 3~4개
- 예시 주제
  - 삼성SDS/LG CNS가 왜 상단권인지
  - 현대오토에버의 성장형 포지션
  - 한화시스템 ICT의 방산/ICT 결합 특성
  - KT ds·신세계I&C·롯데이노베이트의 안정형 특성

#### 외부 참고 링크 섹션
- 링크 카테고리
  - 공시/재무 확인
  - 채용/연봉 참고
  - 회사 소개 / 커리어 페이지
- 공식 링크 우선
- 새 탭 열기

#### 제휴 상품 섹션
- 선택형 1개 박스만 허용
- 주제: `개발자 업무 환경`, `이직 준비`, `생산성 장비`
- 3~4개 카드 이내
- 리포트 흐름 방해하지 않도록 SEO 위에 배치

---

## 7. 컴포넌트 구조

### 7-1. 공용 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `report-stat-card`, `panel`, `content-section`, `section-header` 스타일

### 7-2. 페이지 전용 블록
- `si-report-hero-board`
- `si-highlight-card`
- `si-podium-grid`
- `si-chart-board`
- `si-benchmark-panel`
- `si-market-panel`
- `si-profile-card`
- `si-tier-board`
- `si-reference-links`
- `si-affiliate-box`

설명:
- prefix `si-` = `si sm salary report`

### 7-3. Astro 페이지 구성 방식
- `.astro`에서 초기 KPI와 기본 선택 기업 계산
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/it-si-sm-salary-comparison-2026.js`에서
  - 시장 맵 렌더
  - 필터/정렬
  - 내 연봉 벤치마크
  - 상세 카드 교체
- 1차는 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작

---

## 8. 상태 관리 포인트

### 8-1. 클라이언트 상태
```ts
type CompareMode = "salary" | "starter" | "companySize";
type FilterGroup = "all" | "top" | "stable" | "ops";

type ViewState = {
  compareMode: CompareMode;
  filterGroup: FilterGroup;
  sort: "desc" | "asc" | "name";
  selectedCompany: string;
  mySalary: number | null;
};
```

### 8-2. 초기값
- `compareMode = "salary"`
- `filterGroup = "all"`
- `sort = "desc"`
- `selectedCompany = top average salary company`
- `mySalary = null`

### 8-3. 동작 규칙
- 비교 기준 변경 시
  - 시장 맵 재렌더
  - 상단 요약 바 재계산
- 바 클릭 시
  - `selectedCompany` 동기화
  - 기업 상세 카드 갱신
- 내 연봉 입력 시
  - 벤치마크 카드 노출
  - 시장 맵에 기준선 표시
- URL 파라미터 동기화 권장
  - `mode`
  - `group`
  - `sort`
  - `company`
  - `salary`

예시:
```txt
/reports/it-si-sm-salary-comparison-2026/?mode=salary&group=top&company=samsung-sds&salary=8200
```

---

## 9. 계산 로직

### 9-1. 평균 연봉 정렬값
```ts
sortValue = entry.avgSalaryM;
```

### 9-2. 초봉 정렬값
- 범위 데이터가 있는 경우 중앙값 기준 사용
```ts
starterMidM = Math.round((entry.starterSalaryMinM + entry.starterSalaryMaxM) / 2);
```

### 9-3. 회사 규모 정렬값
- 1차는 매출 기준 고정
```ts
sortValue = entry.revenueEok;
```

### 9-4. 내 연봉 상위 퍼센트
- 평균 연봉 배열 기준
```ts
const sorted = entries.map((e) => e.avgSalaryM).sort((a, b) => a - b);
const rank = sorted.filter((s) => s <= mySalary).length;
const pct = Math.round((rank / sorted.length) * 100);
```

### 9-5. 평균 대비 차이
```ts
diffFromAvgM = mySalary - overallAvgSalaryM;
```

### 9-6. 유사 구간 기업
- `±500만원` 또는 `±700만원` 범위 내 기업 2~4개 추천
```ts
similarCompanies = entries.filter((e) => Math.abs(e.avgSalaryM - mySalary) <= 500);
```

### 9-7. 티어 산정
- 평균 연봉 기준 고정 티어
```ts
if (avgSalaryM >= 10000) tier = "1억 이상";
else if (avgSalaryM >= 8000) tier = "8천~1억";
else if (avgSalaryM >= 7000) tier = "7천~8천";
else if (avgSalaryM >= 6000) tier = "6천~7천";
else tier = "6천 미만";
```

### 9-8. KPI 계산
- 최고 평균 연봉 기업: `avgSalaryM` max
- 초봉 평균: `starterMidM` 평균
- 평균 연봉 범위: min ~ max
- 상단권 수: `avgSalaryM >= 8000` count

---

## 10. 데이터 파일 구조

### 10-1. 메인 데이터 파일 구조
```ts
export type CompareMode = "salary" | "starter" | "companySize";
export type FilterGroup = "all" | "top" | "stable" | "ops";

export type CompanyEntry = {
  slug: string;
  rankByAvgSalary: number;
  name: string;
  nameEn?: string;
  groupType: FilterGroup | "growth";
  avgSalaryM: number | null;
  starterSalaryMinM: number | null;
  starterSalaryMaxM: number | null;
  starterSalaryNote?: string;
  bonusLabel: "높음" | "중간" | "변동 큼" | "보수적" | "추정";
  bonusSummary: string;
  revenueEok: number | null;
  headcount: number | null;
  businessFocus: string[];
  tags: string[];
  summary: string;
  recommendedFor: string[];
  referenceLinks?: { label: string; href: string }[];
};

export type TierBucket = {
  key: string;
  label: string;
  minM: number;
  maxM?: number;
  companies: { slug: string; name: string; note?: string }[];
};

export type ItSiSmSalaryComparison2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  companies: CompanyEntry[];
  tierBuckets: TierBucket[];
  patternPoints: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    salary: { label: string; href: string }[];
  };
  affiliateProducts?: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};
```

### 10-2. 데이터 운영 규칙
- 평균 연봉, 초봉은 모두 `만원` 단위 숫자로 저장한다.
- 출처 불확실성 높은 값은 `null` 허용 후 UI에서 `추정`, `범위`, `참고` 라벨을 붙인다.
- 성과급은 정량 고정값 대신 `bonusLabel` + `bonusSummary` 조합으로 저장한다.
- 회사 규모는 `매출(억원)`과 `직원 수` 둘 다 저장하되, 차트는 1차에서 매출 기준으로 고정한다.

### 10-3. 등록 파일
- 메인 데이터: `src/data/itSiSmSalaryComparison2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`

---

## 11. 구현 순서

### 11-1. 1단계: 데이터 파일 작성
- `src/data/itSiSmSalaryComparison2026.ts` 생성
- 9개 기업 데이터 입력
- `meta`, `faq`, `patternPoints`, `referenceLinks`, `affiliateProducts` 포함
- 파생값
  - `starterMidM`
  - `tierBuckets`
  - `overallAvgSalaryM`
  - `topRankCompanies`

### 11-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/it-si-sm-salary-comparison-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 포디움
  - 차트 보드
  - 탐색 보드
  - 티어 보드
  - 패턴 요약
  - 외부 참고 링크
  - 제휴 상품
  - SeoContent

### 11-3. 3단계: 스크립트 구현
- `public/scripts/it-si-sm-salary-comparison-2026.js`
- 담당 기능
  - 시장 맵 렌더
  - 필터/정렬
  - 상세 카드 동기화
  - 내 연봉 벤치마크
  - URL 파라미터 동기화

### 11-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_it-si-sm-salary-comparison-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - 상단 브리프 보드가 리포트형으로 보이는지
  - 모바일 1열 흐름이 자연스러운지
  - 탐색 보드가 계산기처럼 과하게 튀지 않는지
  - 티어 보드 가독성이 좋은지

### 11-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 노출 확인
- `public/sitemap.xml` 추가

### 11-6. 6단계: 외부 링크 / 제휴 박스 반영
- 공식 IR / 회사소개 / 채용 링크 연결
- 연봉 참고 링크 분리
- 제휴 상품 3~4개 이내
- disclosure 문구 포함

### 11-7. 7단계: OG 및 메타 정리
- OG 이미지 생성
- `title`, `description` 최종 정리
- related 링크 연결

---

## 12. QA 체크포인트

### 12-1. 데이터
- [ ] 9개 기업 slug / 이름 / 회사규모 매칭 확인
- [ ] 평균 연봉 수치 단위 통일 확인
- [ ] 초봉 범위 min/max 입력 오류 확인
- [ ] 성과급 설명이 과도하게 단정적이지 않은지 확인
- [ ] `추정`, `참고` 라벨 누락 없는지 확인

### 12-2. UI
- [ ] 첫 화면에서 `리포트`처럼 보이고 계산기처럼 보이지 않는지 확인
- [ ] 모바일에서 브리프 -> KPI -> 차트 -> 탐색 흐름이 자연스러운지 확인
- [ ] 필터 조작 후 시장 맵이 즉시 갱신되는지 확인
- [ ] 차트 바 클릭 시 상세 카드가 바뀌는지 확인
- [ ] 내 연봉 입력 시 결과 카드와 기준선이 정상 동작하는지 확인
- [ ] 티어 보드가 가로 스크롤 없이 읽히는지 확인

### 12-3. SEO / 운영
- [ ] `reports.ts` 등록
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` 구성 완료
- [ ] `InfoNotice`에 기준/추정 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] 제휴 링크에 `nofollow` 및 disclosure 문구 적용
- [ ] `npm run build` 통과

---

## 13. 구현 메모

### 13-1. 페이지 포지션
- `salary-tier`처럼 개인 결과 중심 도구가 아니라 `시장 해설형 리포트`
- 숫자 비교 + 회사 성격 해석 + 내 연봉 보조 비교를 조합한다.

### 13-2. `new-employee-salary-2026`와의 관계
- 참고할 점
  - 리포트형 보드 구조
  - 차트 + 상세 카드 조합
  - 하단 탐색 영역 분리
- 다르게 가져갈 점
  - 초봉 중심이 아니라 평균 연봉 / 성과급 / 회사 규모 중심
  - `내 연봉 입력`은 메인 기능이 아니라 보조 비교
  - SI/SM 특성상 `업무 성격`, `그룹 IT`, `운영형` 해석을 더 강조

### 13-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 포디움 정적 섹션 구성
3. 차트 2종 구현
4. 상세 카드 + 시장 맵 필터 구현
5. 내 연봉 벤치마크 구현
6. 외부 링크 / 제휴 / SEO 정리

### 13-4. 확장 방향
- `대기업 그룹 IT 자회사 비교` 시리즈 확장
- `IT 서비스 계열 연봉 티어 계산기` 파생 툴 확장
- `SI vs 인하우스 IT` 비교 리포트 확장
- 직급별 / 연차별 보상 비교로 확장
