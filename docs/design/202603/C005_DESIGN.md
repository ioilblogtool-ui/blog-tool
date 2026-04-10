# C005 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202603/C005_PLAN.md`
- 구현 대상: 국내 TOP 보험사 평균 연봉·성과급 비교 리포트
- 참고 리포트: `new-employee-salary-2026`, `it-si-sm-salary-comparison-2026`, `seoul-84-apartment-prices`

### 1-2. 문서 역할
- C005 기획 문서를 비교계산소 기준의 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 계산 규칙, 구현 순서, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `시장 요약 -> 보험사 비교 -> 랭킹 해석 -> 내 조건 총보상 계산 -> 회사별 상세 탐색`
- SEO 유입형이지만 비교계산소답게 `데이터 + 가벼운 계산 + 해설` 구조를 유지한다.
- 블로그 글처럼 길게 읽는 형식보다 카드, 차트, 표, 계산 결과가 빠르게 읽히는 구조를 우선한다.

### 1-4. 권장 slug
- `insurance-salary-bonus-comparison-2026`
- URL: `/reports/insurance-salary-bonus-comparison-2026/`

### 1-5. 권장 파일 구조
- `src/data/insuranceSalaryBonusComparison2026.ts`
- `src/pages/reports/insurance-salary-bonus-comparison-2026.astro`
- `public/scripts/insurance-salary-bonus-comparison-2026.js`
- `src/styles/scss/pages/_insurance-salary-bonus-comparison-2026.scss`
- `public/og/reports/insurance-salary-bonus-comparison-2026.png`

---

## 2. 현재 프로젝트 비교 컨텐츠 구조 정리

### 2-1. 현재 리포트 공통 구조
현재 `/reports/` 비교 컨텐츠는 아래 공통 구조를 따른다.
1. `CalculatorHero`
2. `InfoNotice`
3. 상단 요약 보드 또는 KPI 카드
4. 비교 차트 / 표 / 랭킹 보드
5. 선택형 탐색 영역
6. 패턴 요약 / 인사이트 카드
7. 외부 참고 링크
8. 선택형 제휴 블록
9. `SeoContent`

### 2-2. 현재 구현 패턴
- 메타 등록: `src/data/reports.ts`
- 허브 노출: `src/pages/reports/index.astro`
- 페이지 데이터: `src/data/<report>.ts`
- 페이지 마크업: `src/pages/reports/<slug>.astro`
- 클라이언트 인터랙션: `public/scripts/<slug>.js`
- 페이지 전용 스타일: `src/styles/scss/pages/_<slug>.scss`
- 사이트맵: `public/sitemap.xml`

### 2-3. 이번 C005가 따라야 할 방향
- `new-employee-salary-2026`에서 가져올 것
  - 리포트형 상단 보드
  - KPI 카드와 포디움형 랭킹 카드
  - 하단 선택 기업 상세 카드 흐름
- `it-si-sm-salary-comparison-2026`에서 가져올 것
  - 평균 연봉 + 성과급 + 회사 규모를 함께 보는 구조
  - 내 연봉 벤치마크를 메인 기능이 아닌 보조 탐색 기능으로 두는 방식
  - 외부 참고 링크 / 패턴 요약 / 태그 카드 정리 방식
- C005에서 새롭게 강조할 것
  - 보험업 특성상 `연봉`과 `성과급`, `총보상`의 차이를 쉽게 이해시키는 것
  - `생보 / 손보` 구분이 바로 읽히는 비교 구조
  - 회사 선택 후 총보상 계산까지 자연스럽게 이어지는 흐름

---

## 3. 구현 범위

### 3-1. MVP 범위
- 비교 대상 보험사 6~8개를 고정 데이터로 제공한다.
  - 삼성화재
  - 삼성생명
  - 메리츠화재
  - 현대해상
  - DB손해보험
  - KB손해보험
  - 필요 시 한화생명 또는 교보생명 추가
- 핵심 비교 항목 7종을 제공한다.
  - 평균 연봉
  - 신입 초봉
  - 과장급 추정 연봉
  - 성과급률 범위
  - 기준 총보상 추정
  - 임직원 수
  - 보험사 유형(생보/손보)
- 비교 인터랙션 4종을 제공한다.
  - 비교 기준 탭: 평균 연봉 / 성과급 / 신입 초봉 / 총보상
  - 보험사 유형 필터: 전체 / 생보 / 손보
  - 정렬: 높은순 / 낮은순 / 가나다순
  - 회사 선택: 상세 카드 및 계산기 연동용 select
- 총보상 계산기 1종을 제공한다.
  - 회사 선택
  - 기본 연봉 입력
  - 성과급 시나리오 선택
  - 기타 보너스 포함 여부
- 해설 영역 3종을 제공한다.
  - 보험사별 한 줄 특징
  - 패턴 요약 카드
  - 공식/채용/IR 참고 링크

### 3-2. MVP 제외 범위
- 세후 실수령 계산
- 직급별 연봉 그래프
- 연도별 추이 차트
- 사용자 비교 목록 저장 기능
- 리뷰/평판 집계 기능
- 외부 API 기반 실시간 데이터 동기화

---

## 4. 페이지 목적

- 국내 주요 보험사의 평균 연봉, 성과급, 총보상을 한 페이지에서 비교해 사용자가 업계 보상 판도를 빠르게 읽게 한다.
- 보험사 취업 준비생에게는 `초봉 + 브랜드 + 유형 차이`, 이직 준비자에게는 `평균 연봉 + 성과급 + 총보상`을 같이 해석할 수 있게 한다.
- 비교계산소다운 차별점으로 `내 연봉 기준 총보상 추정`을 붙여 체류시간과 참여도를 함께 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 보험사 취업 준비생
- 손보/생보 중 어디가 더 높은 초봉과 성장성을 주는지 본다.
- 신입 초봉 순위와 회사별 특징을 빠르게 확인한다.
- 관심 기업 채용 링크로 이동한다.

### 5-2. 금융권 이직 준비자
- 평균 연봉보다 실제 총보상 경쟁력이 높은 회사를 찾는다.
- 성과급 변동성이 큰 회사와 안정형 회사를 비교한다.
- 현재 연봉을 넣고 이직 시 체감 가능한 총보상 차이를 확인한다.

### 5-3. 현직 보험업 종사자
- 경쟁사 평균 연봉과 성과급 수준을 본다.
- 생보와 손보 사이의 보상 구조 차이를 읽는다.
- 과장급 기준으로 어느 회사가 유리한지 본다.

### 5-4. 일반 검색 유입 사용자
- `보험사 연봉 순위`, `보험사 성과급`, `손해보험사 연봉 비교` 검색 후 들어와 상위 보험사를 직관적으로 이해한다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `compareMode`
  - `avgSalary`: 평균 연봉
  - `bonus`: 성과급 기준
  - `newHire`: 신입 초봉
  - `totalComp`: 기준 총보상
- `insuranceFilter`
  - `all`
  - `life`
  - `nonlife`
- `sort`
  - `desc`
  - `asc`
  - `name`
- `selectedCompany`
  - 상세 카드용 보험사 slug

#### 계산기 입력
- `myBaseSalary`
  - 단위: 만원
  - 설명: 사용자가 현재 또는 가정하는 기본 연봉
- `scenario`
  - `conservative`
  - `base`
  - `aggressive`
- `includeExtraBonus`
  - `true` / `false`
  - 설명: 일시금/기타 보너스 포함 여부

### 6-2. 출력값

#### 메인 리포트 출력
- 평균 연봉 상위권 보험사
- 성과급 강세 보험사
- 신입 초봉 상위 보험사
- 비교 대상 보험사 수

#### 랭킹 / 탐색 출력
- 필터링된 보험사 bar chart 또는 ranking rows
- 선택 보험사 상세 카드
- 생보/손보별 요약 카드

#### 계산기 출력
- 예상 성과급
- 예상 총보상
- 업계 평균 대비 수준
- 짧은 해석 코멘트

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 보험업 보상 브리프 보드
4. KPI 요약 카드
5. 상위권 포디움 또는 랭킹 카드
6. 보험사 비교 차트 보드
7. 메인 비교 테이블
8. 총보상 계산기 + 선택 보험사 상세 카드
9. 보험사별 한 줄 특징 / 패턴 요약
10. 채용 / 공식 / IR 외부 링크
11. 제휴 상품 섹션
12. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 포디움 카드
- 차트 보드
- 비교 테이블
- 총보상 계산기
- 선택 보험사 상세 카드
- 패턴 요약
- 외부 참고 링크
- 제휴 블록
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- 차트 보드는 `좌: 연봉/총보상 / 우: 초봉/성과급` 2열
- 계산기/상세 카드는 `좌: 총보상 계산기 / 우: 선택 보험사 카드` 2열
- 비교 테이블은 전체폭 + 가로 스크롤 대응

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `Interactive Report`
- H1 예시: `국내 TOP 보험사 평균 연봉·성과급 비교 2026`
- 설명 예시:
  - 삼성화재, 삼성생명, 메리츠화재, 현대해상, DB손해보험, KB손해보험 등 주요 보험사의 평균 연봉과 성과급 흐름을 한 페이지에서 비교한다.
  - 연봉뿐 아니라 총보상 기준으로 읽어야 한다는 메시지를 초반에 준다.

#### InfoNotice
- 필수 문구
  - 평균 연봉은 공시, 기사, 채용 정보, 플랫폼 집계를 종합한 참고 데이터임
  - 성과급은 매년 실적과 평가에 따라 크게 달라질 수 있음
  - 총보상 계산 결과는 추정치이며 실제 지급액과 다를 수 있음
  - 기준 시점과 업데이트일 명시

#### 보험업 보상 브리프 보드
- 리드 문단 1개
- 하이라이트 카드 3개
  - 평균 연봉 상위권
  - 성과급 강세 기업
  - 생보/손보 차이 포인트
- 목적: 검색 유입 사용자가 첫 화면에서 보험업 보상 구조를 이해하게 한다.

#### KPI 요약 카드
- 카드 4개 권장
  - 평균 연봉 1위
  - 성과급 강세 1위
  - 신입 초봉 상위권
  - 비교 대상 보험사 수

#### 포디움 / 랭킹 카드
- 탭 없이 고정 Top 3 포디움으로 시작하는 것이 우선
- 카드 노출값
  - 보험사명
  - 보험사 유형
  - 평균 연봉 또는 총보상
  - 한 줄 이유
- 단순 숫자보다 `왜 높은지`를 같이 보여준다.

#### 비교 차트 보드
- 차트 2종 권장
  - 평균 연봉 / 총보상 비교
  - 신입 초봉 / 성과급 강도 비교
- 1차는 Chart.js 가로 바 차트 또는 DOM bar row 중 하나를 선택
- 막대 클릭 시 상세 카드와 선택 보험사 select가 동기화되면 좋다.

#### 메인 비교 테이블
- 페이지의 핵심 데이터 영역
- 컬럼
  - 회사명
  - 보험사 유형
  - 평균 연봉
  - 신입 초봉
  - 과장급 추정 연봉
  - 성과급 수준
  - 기준 총보상
  - 임직원 수
  - 특징
- 모바일에서는 `overflow-x: auto` 우선
- sticky first column은 선택 사항

#### 총보상 계산기
- 비교계산소다운 참여 요소
- 입력
  - 보험사 선택
  - 기본 연봉
  - 시나리오 선택
  - 기타 보너스 포함 여부
- 출력
  - 예상 성과급
  - 예상 총보상
  - 업계 평균 대비 수준
  - 코멘트
- 주의
  - 세후 계산은 넣지 않는다.
  - 결과는 `추정`, `참고` 라벨을 붙인다.

#### 선택 보험사 상세 카드
- 선택 보험사 기준으로 아래 정보 노출
  - 회사명 / 순위 / 유형
  - 평균 연봉
  - 신입 초봉
  - 과장급 추정 연봉
  - 성과급 설명
  - 기준 총보상
  - 임직원 수
  - 태그
  - 한 줄 요약
  - 채용 / 공식 / IR 링크
- `new-employee-salary-2026`와 `it-si-sm-salary-comparison-2026`의 프로필 카드 UX를 참고한다.

#### 패턴 요약 섹션
- 카드 3~4개
- 예시 주제
  - 손보 상위권이 강한 이유
  - 생보와 손보의 보상 구조 차이
  - 메리츠화재처럼 성과급 영향이 큰 회사 읽는 법
  - 평균 연봉과 총보상이 다르게 보일 수 있는 이유

#### 보험사별 한 줄 특징 섹션
- 회사별 특징을 짧게 보여주는 카드 또는 리스트
- 비교 테이블 하단 또는 패턴 요약과 통합 가능
- SEO용 긴 문단이 아니라 `회사명 + 한 줄 특징` 구조를 유지한다.

#### 외부 참고 링크 섹션
- 3개 그룹으로 분리
  - 공식 채용
  - 회사 소개 / 공식 사이트
  - IR / 사업보고서 / 공시
- 공식 링크 우선
- 새 창 열기

#### 제휴 상품 섹션
- 이직/커리어/업무 생산성 관련 상품으로 1개 박스만 허용
- 카드 3~4개 이내
- 과도한 광고 톤 금지
- `SeoContent` 바로 위 배치

---

## 8. 컴포넌트 구조

### 8-1. 공용 컴포넌트
- `BaseLayout`
- `SiteHeader`
- `CalculatorHero`
- `InfoNotice`
- `SeoContent`
- 기존 `panel`, `content-section`, `section-header`, `report-stat-card`

### 8-2. 페이지 전용 블록
- `ins-report-hero-board`
- `ins-highlight-card`
- `ins-podium-grid`
- `ins-chart-board`
- `ins-compare-table`
- `ins-calculator-panel`
- `ins-company-profile`
- `ins-pattern-grid`
- `ins-reference-panel`
- `ins-affiliate-box`

설명:
- prefix `ins-` = insurance salary report

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, 기본 선택 보험사, FAQ 데이터를 계산한다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/insurance-salary-bonus-comparison-2026.js`에서
  - 필터/정렬
  - 차트/row 렌더
  - 회사 선택 동기화
  - 총보상 계산기 결과 갱신
- 1차는 별도 Astro 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type CompareMode = "avgSalary" | "bonus" | "newHire" | "totalComp";
type InsuranceFilter = "all" | "life" | "nonlife";
type Scenario = "conservative" | "base" | "aggressive";

type ViewState = {
  compareMode: CompareMode;
  insuranceFilter: InsuranceFilter;
  sort: "desc" | "asc" | "name";
  selectedCompany: string;
  myBaseSalary: number;
  scenario: Scenario;
  includeExtraBonus: boolean;
};
```

### 9-2. 초기값
- `compareMode = "avgSalary"`
- `insuranceFilter = "all"`
- `sort = "desc"`
- `selectedCompany = average salary top company`
- `myBaseSalary = 7000`
- `scenario = "base"`
- `includeExtraBonus = true`

### 9-3. 동작 규칙
- 비교 기준 변경 시
  - 차트/row 재정렬
  - 비교 테이블 헤더 강조값 동기화
- 보험사 유형 필터 변경 시
  - 비교 차트 / 테이블 / select 후보를 함께 갱신
- 회사 선택 변경 시
  - 상세 카드와 계산기 기준 회사 동기화
- 계산기 입력 변경 시
  - 예상 성과급과 총보상 즉시 갱신
- URL 파라미터 동기화 권장
  - `mode`
  - `type`
  - `sort`
  - `company`
  - `salary`
  - `scenario`

예시:
```txt
/reports/insurance-salary-bonus-comparison-2026/?mode=totalComp&type=nonlife&company=samsung-fire&salary=7600&scenario=base
```

---

## 10. 계산 로직

### 10-1. 성과급 시나리오 계산
```ts
const scenarioRate =
  scenario === "conservative"
    ? entry.bonusRateMin
    : scenario === "aggressive"
      ? entry.bonusRateMax
      : entry.bonusRateBase;
```

### 10-2. 예상 성과급
```ts
expectedBonus = Math.round(myBaseSalary * scenarioRate);
```
- `myBaseSalary` 단위는 만원
- `scenarioRate`는 0.0 ~ 1.0 형태 비율로 저장

### 10-3. 예상 총보상
```ts
expectedTotalComp = myBaseSalary + expectedBonus + (includeExtraBonus ? entry.extraBonusM ?? 0 : 0);
```

### 10-4. 업계 평균 대비
```ts
diffFromAvg = expectedTotalComp - overallAvgTotalCompM;
```
- 노출 방식
  - `상위권`, `중상`, `중간`, `보수적` 같은 라벨로 변환 가능

### 10-5. 정렬값
```ts
if (compareMode === "avgSalary") sortValue = entry.avgSalaryManwon;
if (compareMode === "bonus") sortValue = entry.bonusRateBase;
if (compareMode === "newHire") sortValue = entry.newHireSalaryManwon;
if (compareMode === "totalComp") sortValue = entry.estTotalCompBase;
```

### 10-6. KPI 계산
- 평균 연봉 1위 보험사: `avgSalaryManwon` max
- 성과급 강세 보험사: `bonusRateBase` max
- 신입 초봉 상위 보험사: `newHireSalaryManwon` max
- 비교 대상 수: entries length

### 10-7. 보험사 유형별 평균
```ts
lifeAvg = average(entries.filter((e) => e.insuranceType === "life"));
nonlifeAvg = average(entries.filter((e) => e.insuranceType === "nonlife"));
```

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type InsuranceType = "life" | "nonlife";
export type Scenario = "conservative" | "base" | "aggressive";

export type InsuranceCompanyEntry = {
  slug: string;
  companyId: string;
  companyName: string;
  insuranceType: InsuranceType;
  avgSalaryManwon: number;
  newHireSalaryManwon: number;
  managerSalaryManwon: number;
  bonusRateMin: number;
  bonusRateBase: number;
  bonusRateMax: number;
  extraBonusM?: number;
  bonusComment: string;
  estTotalCompBase: number;
  employeeCount: number | null;
  revenueText?: string;
  companyTag: string;
  summary: string;
  tags: string[];
  hiringUrl?: string;
  officialUrl?: string;
  irUrl?: string;
  updatedAt: string;
};

export type InsuranceSalaryBonusComparison2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: InsuranceCompanyEntry[];
  patternPoints: { title: string; body: string }[];
  featureCards: { company: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    hiring: { label: string; href: string }[];
    official: { label: string; href: string }[];
    ir: { label: string; href: string }[];
  };
  affiliateProducts?: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};
```

### 11-2. 데이터 운영 규칙
- 숫자 단위는 모두 `만원` 기준으로 저장한다.
- 성과급은 고정값이 아니라 시나리오 기반 비율로 저장한다.
- 실데이터 신뢰도가 낮은 항목은 범위 또는 설명 문구로 처리한다.
- 각 보험사별 공식 / 채용 / IR 링크를 같이 보관한다.

### 11-3. 등록 파일
- 메인 데이터: `src/data/insuranceSalaryBonusComparison2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/insuranceSalaryBonusComparison2026.ts` 생성
- 보험사 6~8개 데이터 입력
- `meta`, `faq`, `patternPoints`, `featureCards`, `referenceLinks`, `affiliateProducts` 포함
- 파생값
  - 평균 연봉 순위
  - 총보상 순위
  - 생보/손보 평균

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/insurance-salary-bonus-comparison-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 포디움 카드
  - 차트 보드
  - 비교 테이블
  - 총보상 계산기
  - 선택 보험사 카드
  - 패턴 요약
  - 외부 참고 링크
  - 제휴 상품
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/insurance-salary-bonus-comparison-2026.js`
- 담당 기능
  - 비교 기준 필터 / 정렬
  - 보험사 유형 필터
  - 선택 보험사 카드 갱신
  - 총보상 계산기 로직
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_insurance-salary-bonus-comparison-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - 금융권 리포트답게 과하게 장식적이지 않은지
  - 비교표와 계산기 영역이 서로 싸우지 않는지
  - 모바일에서 표와 카드 흐름이 답답하지 않은지

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro`의 salary series에 추가
- `public/sitemap.xml` 추가

### 12-6. 6단계: OG / 메타 / 링크 정리
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 계산기 / 리포트 연결
- 외부 참고 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 보험사명 / 유형 / 연봉 단위가 통일되어 있는지 확인
- [ ] 성과급률 min/base/max 입력 오류가 없는지 확인
- [ ] 총보상 계산 기준이 데이터 정의와 일치하는지 확인
- [ ] 공식 링크 / 채용 링크 / IR 링크가 정상인지 확인
- [ ] `추정`, `참고`, `약` 라벨이 필요한 곳에 빠지지 않았는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `보험사 비교 리포트`라는 성격이 명확한지 확인
- [ ] KPI -> 차트 -> 테이블 -> 계산기 흐름이 자연스러운지 확인
- [ ] 모바일에서 비교표 가로 스크롤이 깨지지 않는지 확인
- [ ] 계산기 입력 변경 시 결과가 즉시 갱신되는지 확인
- [ ] 선택 보험사 변경 시 상세 카드와 계산기 기준 회사가 함께 바뀌는지 확인
- [ ] 생보 / 손보 필터가 차트와 테이블 모두에 반영되는지 확인

### 13-3. SEO / 운영
- [ ] `reports.ts` 등록
- [ ] `reports/index.astro` 노출 확인
- [ ] `sitemap.xml` 반영
- [ ] `SeoContent` 구성 완료
- [ ] `InfoNotice` 기준 문구 포함
- [ ] OG 이미지 경로 설정
- [ ] 외부 링크에 `target="_blank" rel="noopener noreferrer"` 적용
- [ ] 제휴 링크에 `nofollow` 및 고지 문구 적용
- [ ] `npm run build` 통과

---

## 14. 구현 메모

### 14-1. 비교계산소 기준 포지션
- 이 페이지는 단순 금융권 기사 요약이 아니라 `보험사 보상 비교 리포트`다.
- 비교계산소의 강점인 `숫자 비교 + 직접 계산`을 유지하되, 계산기가 메인을 잡아먹지 않게 한다.

### 14-2. 기존 리포트와의 차이
- `new-employee-salary-2026`보다 연봉보다 `총보상 해석` 비중이 높다.
- `it-si-sm-salary-comparison-2026`보다 업종 해석보다 `보험사 유형 차이`와 `성과급 변동성`을 더 강조한다.
- `seoul-84-apartment-prices`처럼 비교표의 역할이 큰 페이지에 가깝다.

### 14-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 포디움 정적 섹션 구성
3. 비교 차트 / 비교 테이블 구현
4. 총보상 계산기 구현
5. 선택 보험사 상세 카드 구현
6. 외부 링크 / 제휴 / SEO 연결

### 14-4. 확장 방향
- 은행 / 카드 / 증권 금융권 시리즈로 확장
- 직급별 총보상 비교 파생 리포트 확장
- 보험사 복지 / 워라밸 / 브랜드 비교 콘텐츠 확장
