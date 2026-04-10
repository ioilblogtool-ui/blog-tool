# 서울 집값 2016→2026 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/seoul-housing-2016-vs-2026-webplan (1).md`
- 구현 대상: 서울 집값 2016→2026, 매매·전세·월세 10년 비교 리포트
- 참고 페이지:
  - `wedding-cost-2016-vs-2026`
  - `seoul-84-apartment-prices`
  - `home-purchase-fund`

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 계산 규칙, 구현 파일, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `10년 변화 요약 -> 가격/PIR 추이 -> 2016 vs 2026 직접 비교 -> 지역 체감 -> 내 연봉 기준 체감 계산 -> 다음 액션`
- SEO 유입형이지만 비교계산소답게 `숫자 비교 + 체감 해석 + 가벼운 계산` 구조를 유지한다.
- 블로그 글처럼 긴 문단 중심이 아니라 카드, 차트, 표, 입력 박스로 빠르게 읽히는 구조를 우선한다.

### 1-4. 권장 slug
- `seoul-housing-2016-vs-2026`
- URL: `/reports/seoul-housing-2016-vs-2026/`

### 1-5. 권장 파일 구조
- `src/data/seoulHousing2016Vs2026.ts`
- `src/pages/reports/seoul-housing-2016-vs-2026.astro`
- `public/scripts/seoul-housing-2016-vs-2026.js`
- `src/styles/scss/pages/_seoul-housing-2016-vs-2026.scss`
- `public/og/reports/seoul-housing-2016-vs-2026.png`

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
  - 상단 브리프 + KPI + 타임라인 + 체감 계산 박스 구조
  - 생활비/부담 변화라는 해석 중심 UX
- `seoul-84-apartment-prices`에서 가져올 것
  - 부동산 카테고리 톤앤매너
  - 지역 비교 카드 / 비교표 / 다음 계산기로 이어지는 흐름
  - 비교계산소다운 필터형 탐색 UX 감각
- 이번 페이지에서 새롭게 강조할 것
  - `매매 / 전세 / 월세 / PIR`을 한 페이지에서 함께 읽는 구조
  - `서울 평균`과 `구별 체감`을 분리해서 보여주는 구조
  - `내 연봉 기준 체감 계산`을 붙여 단순 기사형이 아닌 비교계산소형 리포트로 만드는 것

---

## 3. 구현 범위

### 3-1. MVP 범위
- 서울 주거비 10년 비교 핵심 지표를 고정 데이터로 제공한다.
  - 서울 평균 매매가
  - 서울 평균 전세가
  - 서울 평균 월세 보증금
  - 서울 평균 월세
  - PIR
  - 월세 전환 비중
  - 연봉 대비 전세 배수
- 핵심 시계열 2종을 제공한다.
  - 평균 매매가 + PIR 복합 차트
  - 전세가 / 월세 / 월세보증금 보조 차트
- 직접 비교 UI 3종을 제공한다.
  - 2016 vs 2026 비교 보드
  - 지역 카드 비교
  - 핵심 수치 비교표
- 체감 인터랙션 1종을 제공한다.
  - 연봉 입력
  - 2016 서울 평균 매매가 기준 체감
  - 2026 서울 평균 매매가 기준 체감
  - 2026 서울 평균 전세가 기준 체감
  - 2026 서울 평균 월세 부담 체감
- 해설 영역 3종을 제공한다.
  - 패턴 요약 카드
  - 전세→월세 전환 설명 박스
  - 외부 참고 링크 및 다음 계산기 CTA

### 3-2. MVP 제외 범위
- 실거래가 API 연동
- 구별 상세 필터링 인터랙션
- 매수 자금, 대출, DSR 통합 계산
- 자산/부채 포함 종합 시뮬레이터
- 지도 기반 시각화
- 저장 기능, 사용자 비교 히스토리

---

## 4. 페이지 목적

- 서울 집값이 2016년 대비 2026년에 얼마나 변했는지 매매, 전세, 월세, PIR 기준으로 한 화면에서 비교한다.
- 사용자가 단순히 `집값이 올랐다`는 수준이 아니라 `연봉 대비 체감 부담`이 얼마나 커졌는지 이해하게 한다.
- 리포트에서 끝나지 않고 `부동산 매매 자금 계산기`, 향후 `전세 vs 월세 비교 계산기`로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 서울 또는 수도권 직장인
- `서울 집값 10년 비교`, `서울 전세 2016 2026 비교` 검색 후 유입한다.
- 서울 평균 매매가와 PIR이 얼마나 달라졌는지 먼저 본다.
- 내 연봉을 입력해 2016과 2026의 체감 차이를 확인한다.

### 5-2. 전세/월세 전환을 고민하는 사용자
- 서울 평균 전세가와 월세 부담을 본다.
- 전세→월세 전환 비중이 왜 높아졌는지 설명 박스에서 구조를 읽는다.
- 대출이나 주거비 계산기로 다음 행동을 이어간다.

### 5-3. 부동산 비교 콘텐츠 탐색 사용자
- 서울 평균 수치만으로는 체감이 약해 구별 카드 비교를 본다.
- 서초, 강남, 송파, 마포, 성동, 강동 수준을 빠르게 훑는다.
- 관련 리포트나 계산기로 이동한다.

### 5-4. 일반 검색 유입 사용자
- `서울 PIR`, `서울 집값 연봉 대비`, `2016 서울 아파트 가격 vs 2026` 검색으로 들어와 핵심 수치를 빠르게 읽는다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `secondaryChartMode`
  - `jeonse`: 전세가
  - `rentDeposit`: 월세 보증금
  - `rentMonthly`: 월세
- `selectedDistrict`
  - `seocho`
  - `gangnam`
  - `songpa`
  - `mapo`
  - `seongdong`
  - `gangdong`
- `annualIncome`
  - 단위: 만원
  - 설명: 사용자 연봉 기준 체감 계산용

#### 확장 대비 URL 파라미터
- `tab`
- `district`
- `salary`

### 6-2. 출력값

#### 메인 리포트 출력
- 서울 평균 매매가 상승폭
- 서울 평균 전세가 상승폭
- PIR 변화
- 월세 전환 비중 변화
- 월세 부담 변화
- 강남권/비강남권 체감 차이

#### 차트 / 표 출력
- 연도별 평균 매매가
- 연도별 PIR
- 연도별 전세가
- 연도별 월세 보증금 / 월세
- 2016 vs 2026 핵심 수치 비교표
- 구별 평균가 카드

#### 체감 계산 출력
- 2016 서울 평균 매매가 기준 연봉 배수
- 2026 서울 평균 매매가 기준 연봉 배수
- 2026 서울 평균 전세가 기준 연봉 배수
- 2026 서울 평균 월세 연간 부담

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 서울 주거비 브리프 보드
4. KPI 요약 카드
5. 평균 매매가 + PIR 복합 차트
6. 보조 차트 탭 보드
7. 2016 vs 2026 직접 비교 보드
8. PIR 해설 보드
9. 구별 가격 카드 보드
10. 내 연봉 기준 체감 계산 박스
11. 패턴 요약 카드
12. 전세→월세 전환 설명 박스
13. 외부 참고 링크
14. 관련 계산기 / 리포트 CTA
15. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 메인 복합 차트
- 보조 차트
- 2016 vs 2026 비교
- PIR 해설
- 구별 카드
- 체감 계산기
- 패턴 요약
- 구조 설명 박스
- 외부 참고 링크
- CTA
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- 차트 보드는 `상단 메인 차트 1개 + 하단 보조 차트 1개` 구조
- 비교 보드와 PIR 해설은 카드형 2열 또는 상하 배치
- 체감 계산기와 구별 카드 보드는 2열로 나눌 수 있지만 모바일 우선 흐름을 유지한다.

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `부동산 비교 리포트`
- H1 예시: `서울 집값 2016 vs 2026`
- 설명 예시:
  - 서울 평균 매매가, 전세가, 월세, PIR을 기준으로 10년 변화를 한 화면에서 비교합니다.
  - 단순 가격 비교가 아니라 연봉 대비 체감 부담까지 같이 읽는 리포트라는 메시지를 준다.

#### InfoNotice
- 필수 문구
  - 평균값은 KB, 부동산원, 통계청, 국토교통부 공개자료와 기사 정리값을 바탕으로 한 비교용 참고 수치임
  - 평균값과 특정 구 대표 단지 가격은 같은 성격의 데이터가 아니므로 분리해서 봐야 함
  - 체감 계산은 추정치이며 실제 자금 계획과 다를 수 있음
  - 기준 시점과 업데이트일 명시

#### 서울 주거비 브리프 보드
- 리드 문단 1개
- 하이라이트 카드 3개
  - 서울 평균 매매가 변화
  - PIR 변화
  - 월세 전환 구조 변화
- 목적: 검색 유입 사용자가 첫 화면에서 `가격 상승 + 부담 증가 + 주거 방식 변화`를 동시에 이해하게 한다.

#### KPI 요약 카드
- 카드 5~6개 권장
  - 서울 평균 매매가 상승률
  - 서울 평균 전세가 상승률
  - PIR
  - 월세 전환 비중
  - 서울 평균 월세 상승률
  - 강남 3구 최고가 또는 상단 구 대표 수치

#### 평균 매매가 + PIR 복합 차트
- 이 페이지의 메인 메시지 차트
- x축: `2016, 2018, 2020, 2021, 2022, 2024, 2026`
- 좌측 y축: 서울 평균 매매가(억원)
- 우측 y축: PIR(배)
- 매매가는 line, PIR은 line 또는 bar+line 혼합
- 목적: 가격 상승과 연봉 대비 부담 악화를 같은 화면에서 보여준다.

#### 보조 차트 탭 보드
- 탭 또는 칩으로 `전세가 / 월세 보증금 / 월세`를 전환
- 같은 x축 연도 기준으로 추이를 확인
- 1차 구현은 Chart.js 1개를 탭으로 교체하는 방식 권장

#### 2016 vs 2026 직접 비교 보드
- 좌: 2016
- 우: 2026
- 비교 항목
  - 서울 평균 매매가
  - 서울 평균 전세가
  - 월세 보증금
  - 월세
  - PIR
  - 월세 전환 비중
  - 연봉 대비 전세 배수
- `wedding-cost-2016-vs-2026`의 양쪽 비교 카드 UX를 가져온다.

#### PIR 해설 보드
- 제목 예시: `PIR 추이로 보는 서울 집값 부담`
- 짧은 설명 1문단
- 연도별 PIR 미니 바 또는 비교 리스트
- 목적: 일반 사용자가 PIR을 숫자가 아니라 체감 지표로 이해하게 돕는다.

#### 구별 가격 카드 보드
- 2026 기준 구별 평균 또는 대표 단지 기준 카드 6개
  - 서초구
  - 강남구
  - 송파구
  - 마포구
  - 성동구
  - 강동구
- 카드 노출값
  - 구명
  - 가격값
  - 보조 설명
- 서울 평균과 구별 체감을 분리해서 읽게 한다.

#### 내 연봉 기준 체감 계산 박스
- 비교계산소다운 참여 요소
- 입력
  - 연봉(만원)
- 출력 카드 4개
  - 2016 서울 평균 매매가 기준 체감
  - 2026 서울 평균 매매가 기준 체감
  - 2026 서울 평균 전세가 기준 체감
  - 2026 서울 평균 월세 연간 부담
- 별도 제출 버튼 없이 즉시 반영

#### 패턴 요약 카드
- 카드 3~4개
- 예시 주제
  - 2021 전후 급등 구간
  - 월세 전환 비중 증가
  - 매매가보다 부담 지표가 더 빠르게 악화된 이유
  - 평균값과 실제 지역 체감이 다른 이유

#### 전세→월세 전환 설명 박스
- 제목 예시: `전세에서 월세로 이동한 시장 구조`
- 짧은 문단 + bullet 없이 핵심 요약 2~3개
- 숫자 비교 뒤에 구조 해석을 제공하는 역할

#### 외부 참고 링크 섹션
- 3개 그룹으로 분리
  - 통계/공식 자료
  - 시세 확인
  - 금융/대출 비교
- 공식 링크 우선

#### 관련 계산기 / 리포트 CTA
- 내부 링크 우선
  - `home-purchase-fund`
  - 향후 `전세 vs 월세 비교 계산기`
  - `seoul-84-apartment-prices`
  - `wedding-cost-2016-vs-2026`
- 목적: 생활비/주거비 비교 시리즈 흐름을 만든다.

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
- `housing-report-hero-board`
- `housing-highlight-card`
- `housing-kpi-grid`
- `housing-main-chart-panel`
- `housing-secondary-chart-panel`
- `housing-compare-grid`
- `housing-pir-board`
- `housing-district-grid`
- `housing-feel-box`
- `housing-pattern-grid`
- `housing-structure-box`
- `housing-reference-panel`
- `housing-cta-panel`

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, 기본 탭, FAQ 데이터, 초기 계산값을 만든다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/seoul-housing-2016-vs-2026.js`에서
  - 보조 차트 탭 전환
  - 구 카드 강조
  - 연봉 기준 체감 계산
  - URL 파라미터 동기화
- 1차는 별도 Astro 하위 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type SecondaryChartMode = "jeonse" | "rentDeposit" | "rentMonthly";

type ViewState = {
  secondaryChartMode: SecondaryChartMode;
  selectedDistrict: string;
  annualIncome: number;
};
```

### 9-2. 초기값
- `secondaryChartMode = "jeonse"`
- `selectedDistrict = "seocho"`
- `annualIncome = 5000`

### 9-3. 동작 규칙
- 보조 차트 탭 변경 시
  - 차트 데이터와 캡션 동기화
- 구 카드 선택 시
  - 상세 강조 문구 또는 CTA 문구를 갱신할 수 있음
- 연봉 입력 변경 시
  - 체감 카드 4개 즉시 갱신
- URL 파라미터 동기화 권장
  - `tab`
  - `district`
  - `salary`

예시:
```txt
/reports/seoul-housing-2016-vs-2026/?tab=rentMonthly&district=gangnam&salary=6000
```

---

## 10. 계산 로직

### 10-1. 핵심 KPI 계산
```ts
saleGrowthRate = Math.round(((sale2026 - sale2016) / sale2016) * 100);
jeonseGrowthRate = Math.round(((jeonse2026 - jeonse2016) / jeonse2016) * 100);
rentGrowthRate = Math.round(((rent2026 - rent2016) / rent2016) * 100);
pirDiff = +(pir2026 - pir2016).toFixed(1);
monthlyShareDiff = monthlyRentShare2026 - monthlyRentShare2016;
```

### 10-2. 연봉 기준 매매 체감
```ts
saleYears2016 = +(avgSale2016 / annualIncome).toFixed(1);
saleYears2026 = +(avgSale2026 / annualIncome).toFixed(1);
```
- 단위: 연봉 몇 년치
- 데이터 단위는 만원 기준으로 통일한다.

### 10-3. 연봉 기준 전세 체감
```ts
jeonseYears2026 = +(avgJeonse2026 / annualIncome).toFixed(1);
```

### 10-4. 연간 월세 부담
```ts
annualRentBurden2026 = avgMonthlyRent2026 * 12;
annualRentShare2026 = Math.round((annualRentBurden2026 / annualIncome) * 100);
```

### 10-5. 월세 증가액
```ts
monthlyRentDiff = avgMonthlyRent2026 - avgMonthlyRent2016;
annualRentDiff = monthlyRentDiff * 12;
```

### 10-6. 비교 보드용 서브 텍스트
```ts
saleNarrative = sale2026 > sale2016 ? `10년 동안 ${saleGrowthRate}% 상승` : "";
```
- 실제 노출 문구는 데이터 파일에서 미리 조합해도 된다.

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type HousingKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral";
};

export type HousingCoreSeriesItem = {
  year: number;
  saleEok: number;
  pir: number;
  jeonseEok: number;
  rentDepositEok?: number;
  rentMonthlyManwon: number;
};

export type HousingCompareRow = {
  label: string;
  value2016: string;
  value2026: string;
  changeLabel: string;
};

export type HousingDistrictCard = {
  slug: string;
  districtName: string;
  priceEok: number;
  summary: string;
  note?: string;
};

export type SeoulHousing2016Vs2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  reportLead: string;
  kpis: HousingKpi[];
  coreSeries: HousingCoreSeriesItem[];
  secondarySeries: {
    jeonse: HousingCoreSeriesItem[];
    rentDeposit: HousingCoreSeriesItem[];
    rentMonthly: HousingCoreSeriesItem[];
  };
  compareRows: HousingCompareRow[];
  pirSeries: { year: number; pir: number }[];
  districtCards: HousingDistrictCard[];
  patternNotes: { title: string; body: string }[];
  structureBox: {
    title: string;
    body: string;
  };
  faq: { q: string; a: string }[];
  references: {
    official: { label: string; href: string }[];
    market: { label: string; href: string }[];
    finance: { label: string; href: string }[];
  };
  relatedLinks: { label: string; href: string }[];
  calculatorDefaults: {
    annualIncomeManwon: number;
    avgSale2016Manwon: number;
    avgSale2026Manwon: number;
    avgJeonse2026Manwon: number;
    avgMonthlyRent2026Manwon: number;
  };
};
```

### 11-2. 데이터 운영 규칙
- 금액 저장 단위는 가능하면 `만원`으로 통일한다.
- 차트에서 억원 단위 노출이 필요하면 표시 함수로 변환한다.
- `서울 평균값`과 `구 대표값/단지값`은 성격이 다른 데이터이므로 설명 문구를 분리한다.
- 2026 값은 기준 시점을 명시한다.
- 추정 또는 기사 정리값은 `추정`, `참고` 문구를 `InfoNotice`나 메모로 보강한다.

### 11-3. 추천 초기 데이터 세트
- `coreSeries`
  - 2016, 2018, 2020, 2021, 2022, 2024, 2026
- `secondarySeries`
  - `sale`, `jeonse`, `rentDeposit`, `rentMonthly`
- `compareRows`
  - 매매가, 전세가, 월세보증금, 월세, PIR, 월세 전환 비중, 연봉 대비 전세 배수
- `districtCards`
  - 서초, 강남, 송파, 마포, 성동, 강동

### 11-4. 등록 파일
- 메인 데이터: `src/data/seoulHousing2016Vs2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/seoulHousing2016Vs2026.ts` 생성
- `meta`, `reportLead`, `kpis`, `coreSeries`, `secondarySeries`, `compareRows`, `districtCards`, `patternNotes`, `structureBox`, `faq`, `references`, `relatedLinks`, `calculatorDefaults` 작성
- 파생값
  - KPI 카드 값
  - 비교 보드용 change label
  - 체감 계산 기본값

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/seoul-housing-2016-vs-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 메인 복합 차트
  - 보조 차트 탭
  - 2016 vs 2026 비교 보드
  - PIR 해설 보드
  - 구별 카드
  - 체감 계산 박스
  - 패턴 요약
  - 구조 설명 박스
  - 외부 링크
  - 관련 CTA
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/seoul-housing-2016-vs-2026.js`
- 담당 기능
  - Chart.js 렌더
  - 보조 차트 탭 전환
  - 연봉 입력 계산
  - 구 카드 선택/강조
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_seoul-housing-2016-vs-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - `wedding-cost-2016-vs-2026`처럼 읽기 쉬운 비교 리포트 밀도 유지
  - `seoul-84-apartment-prices`처럼 부동산 카테고리 톤 유지
  - 모바일에서 카드/차트/표 간격이 붙지 않도록 조정

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 생활·부동산 비교 시리즈에 추가
- `public/sitemap.xml` 추가

### 12-6. 6단계: OG / 메타 / 링크 정리
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 계산기 / 관련 리포트 연결
- 외부 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 서울 평균 매매가 / 전세가 / 월세 / PIR 단위가 일치하는지 확인
- [ ] `억원`, `만원`, `%`, `배` 단위가 화면에서 혼동 없이 노출되는지 확인
- [ ] 서울 평균값과 구별 대표값 설명이 섞이지 않는지 확인
- [ ] 2026 기준 시점 문구가 빠지지 않는지 확인
- [ ] 추정 / 참고 라벨이 필요한 곳에 빠지지 않았는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `서울 집값 10년 비교 리포트`라는 성격이 명확한지 확인
- [ ] Hero -> 브리프 -> KPI -> 메인 차트 흐름이 자연스러운지 확인
- [ ] `2016 vs 2026` 비교 보드가 모바일에서 잘리지 않는지 확인
- [ ] 보조 차트 탭 전환 시 라벨/캡션이 함께 바뀌는지 확인
- [ ] 연봉 입력 변경 시 체감 카드 4개가 즉시 갱신되는지 확인
- [ ] 구별 카드 영역이 문자 리스트처럼 보이지 않고 카드 위계가 잡히는지 확인

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
- 이 페이지는 부동산 기사 요약이 아니라 `서울 주거비 10년 비교 리포트`다.
- 핵심은 `가격이 얼마 올랐는가`보다 `사는 방식이 어떻게 더 부담스러워졌는가`를 숫자로 보여주는 것이다.

### 14-2. 기존 리포트와의 차이
- `wedding-cost-2016-vs-2026`보다 주거비 구조와 PIR 해석 비중이 더 크다.
- `seoul-84-apartment-prices`보다 필터 탐색보다 `10년 변화 메시지`가 메인이다.
- `home-purchase-fund`와 직접 경쟁하는 계산기가 아니라, 그 계산기로 이어지는 상위 리포트다.

### 14-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 메인 차트 정적 섹션 구성
3. 보조 차트 / 비교 보드 구현
4. 체감 계산 박스 구현
5. 구별 카드 / 외부 링크 / CTA 구현
6. 허브, 사이트맵, OG 연결

### 14-4. 확장 방향
- `서울 전세 2016 vs 2026`
- `서울 월세 2016 vs 2026`
- `수도권 집값 10년 비교`
- `전세 vs 월세 비교 계산기`

