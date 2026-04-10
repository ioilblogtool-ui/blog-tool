# 아이 키우는 비용 2016 vs 2026 설계 문서

## 1. 문서 개요

### 1-1. 대상
- 기획 문서: `docs/plan/202604/baby-cost-2016-vs-2026.md`
- 구현 대상: 아이 키우는 비용 2016 vs 2026, 분유·기저귀·어린이집 얼마나 올랐나 비교 리포트
- 참고 페이지:
  - `wedding-cost-2016-vs-2026`
  - `salary-asset-2016-vs-2026`
  - `baby-cost-guide-first-year`
  - `parental-leave-short-work-calculator`

### 1-2. 문서 역할
- 기획 문서를 현재 비교계산소 `/reports/` 구조에 맞게 실제 구현 직전 수준으로 재구성한 설계 문서다.
- 화면 구조, 데이터 스키마, 인터랙션, 계산 규칙, 구현 파일, QA 기준을 고정한다.
- Claude/Codex가 이 문서를 기준으로 바로 `src/data/`, `src/pages/reports/`, `public/scripts/`, `src/styles/` 작업으로 이어갈 수 있게 한다.

### 1-3. 페이지 성격
- 계산기보다 `리포트형 인터랙티브 비교 페이지`
- 핵심 흐름: `10년 변화 요약 -> 출산/양육 환경 브리프 -> 분유/기저귀/어린이집 비교 -> 왜 더 무겁게 느껴지는가 -> 지원금 반영 체감 -> 다음 계산기 연결`
- SEO 유입형이지만 비교계산소답게 `숫자 비교 + 체감 해석 + 가벼운 계산` 구조를 유지한다.
- 블로그 글처럼 긴 문단 중심이 아니라 카드, 비교표, 범위형 체감 UI, 입력 박스로 빠르게 읽는 구조를 우선한다.

### 1-4. 권장 slug
- `baby-cost-2016-vs-2026`
- URL: `/reports/baby-cost-2016-vs-2026/`

### 1-5. 권장 파일 구조
- `src/data/babyCost2016Vs2026.ts`
- `src/pages/reports/baby-cost-2016-vs-2026.astro`
- `public/scripts/baby-cost-2016-vs-2026.js`
- `src/styles/scss/pages/_baby-cost-2016-vs-2026.scss`
- `public/og/reports/baby-cost-2016-vs-2026.png`

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
  - 생활비 부담 변화라는 해석 중심 UX
- `baby-cost-guide-first-year`에서 가져올 것
  - 육아 카테고리 톤앤매너
  - 품목별 비교표와 단계별 체감 설명 방식
  - 지원금 반영 전후를 분리하는 실전형 정보 구조
- 이번 페이지에서 새롭게 강조할 것
  - `분유`, `기저귀`, `어린이집` 3축 비교
  - `가격이 얼마나 올랐나`보다 `무엇이 더 부담되고 무엇은 구조가 달라졌나`를 구분해서 보여주는 흐름
  - 결혼·주거·고정비 부담이 이미 큰 상태에서 육아비가 더해지는 체감 구조 설명

---

## 3. 구현 범위

### 3-1. MVP 범위
- 2016년과 2026년 비교 핵심 지표를 고정 데이터로 제공한다.
  - 분유 월 평균 비용
  - 기저귀 월 평균 비용
  - 어린이집 보육료
  - 부모급여
  - 체감 순부담 범위
  - 출산 관련 보조 지표
    - 합계출산율
    - 출생아 수
    - 평균 초혼 연령
- 비교 보드 3종을 제공한다.
  - 2016 vs 2026 핵심 비교 보드
  - 품목별 상세 비교 표
  - 지원금 반영 체감 테이블
- 체감 인터랙션 1종을 제공한다.
  - 육아 단계 선택
  - 분유 사용 여부
  - 어린이집 이용 여부
  - 월 체감 부담 범위 즉시 계산
- 해설 영역 4종을 제공한다.
  - 왜 더 무겁게 느껴지는가 구조 해설
  - 패턴 요약 카드
  - 외부 참고 링크
  - 관련 계산기 CTA

### 3-2. MVP 제외 범위
- 실시간 물가 API 연동
- 브랜드별 상세 가격 비교 엔진
- 지역별 어린이집 비용 비교
- 출산부터 초등 입학까지 전기간 시뮬레이터
- 장바구니 저장 기능
- 제휴 상품 자동 추천 로직

---

## 4. 페이지 목적

- 분유, 기저귀, 어린이집을 기준으로 2016년 대비 2026년 육아 체감 비용이 어떻게 달라졌는지 한 페이지에서 비교한다.
- 사용자가 `모든 항목이 똑같이 많이 오른 것은 아니지만 반복지출과 구조 변화 때문에 더 무겁게 느껴진다`는 메시지를 빠르게 이해하게 한다.
- 리포트에서 끝나지 않고 `출산~2세 지원금`, `육아휴직/단축근무`, `첫 1년 육아비용` 관련 계산기와 리포트로 자연스럽게 이어지게 만든다.

---

## 5. 핵심 사용자 시나리오

### 5-1. 예비 부모
- `아이 키우는 비용`, `분유 기저귀 어린이집 비용`, `10년 전보다 육아비 얼마나 올랐나` 검색 후 유입한다.
- 첫 화면에서 가장 많이 달라진 항목과 덜 달라진 항목을 빠르게 본다.
- 지원금 반영 후 실제 체감이 어느 정도인지 확인한다.

### 5-2. 0~2세 자녀 부모
- 지금 느끼는 부담이 단순 물가 상승 때문인지 구조 변화 때문인지 알고 싶다.
- 분유/기저귀/어린이집을 자기 상황에 맞게 선택해 월 체감 부담을 본다.
- 이어서 부모급여, 출산지원금, 육아휴직 급여 계산기로 이동한다.

### 5-3. 일반 검색 유입 사용자
- `출산율`, `출생아 수`, `초혼 연령` 같은 사회 맥락을 짧게 읽고 전체 그림을 이해한다.
- 긴 기사보다 빠르게 수치와 해석을 같이 확인하고 싶어 한다.

### 5-4. 육아비 리포트 탐색 사용자
- 첫 1년 육아비용 가이드와 비교해, 이번 페이지는 `10년 비교` 관점이라는 점을 확인한다.
- 이후 더 상세한 가이드형 페이지나 계산기로 이어진다.

---

## 6. 입력값 / 출력값 정의

### 6-1. 입력값

#### 리포트 탐색 입력
- `stageMode`
  - `newborn`: 신생아~6개월
  - `infant`: 7~24개월
- `feedingMode`
  - `formula`: 분유 사용
  - `mixed`: 혼합 수유 기준
  - `breast`: 모유수유 중심
- `childcareMode`
  - `home`: 가정보육 중심
  - `daycare`: 어린이집 이용

#### 확장 대비 URL 파라미터
- `stage`
- `feeding`
- `care`

### 6-2. 출력값

#### 메인 리포트 출력
- 분유 비용 상승률
- 기저귀 비용 상승률
- 어린이집 공식 비용 및 체감 비용 차이
- 부모급여 반영 후 순부담 범위
- 출산/양육 환경 보조 지표 요약

#### 비교 표 출력
- 2016 기준 비용
- 2026 기준 비용
- 상승률 또는 체감 변화
- 해석 라벨

#### 체감 계산 출력
- 선택 상황 기준 월 추정 양육비 범위
- 가장 부담이 큰 항목
- 지원금 반영 후 체감 라벨
- 추천 다음 계산기

---

## 7. 섹션 구조

### 7-1. 전체 IA
1. `CalculatorHero`
2. `InfoNotice`
3. 육아비 브리프 보드
4. KPI 요약 카드
5. 출산/양육 환경 브리프 섹션
6. 2016 vs 2026 직접 비교 보드
7. 품목별 상세 비교 표
8. 왜 더 무겁게 느껴지는가 해설 섹션
9. 지원금 반영 체감 테이블
10. 내 상황 기준 체감 계산 박스
11. 패턴 요약 카드
12. 외부 참고 링크
13. 관련 계산기 / 리포트 CTA
14. `SeoContent`

### 7-2. 모바일 우선 순서
- Hero
- 기준 안내
- 브리프 보드
- KPI
- 출산/양육 환경 브리프
- 2016 vs 2026 비교
- 품목별 비교표
- 구조 해설
- 지원금 반영 테이블
- 체감 계산기
- 패턴 요약
- 외부 링크
- CTA
- SEO

### 7-3. PC 레이아웃
- 브리프 보드는 `좌: 리드 해설 / 우: 하이라이트 카드` 2열
- KPI는 4~6개 카드 그리드
- 직접 비교 보드는 `2016 / 2026` 2열 카드 구조
- 품목별 비교표는 전체폭 + 모바일 가로 스크롤 대응
- 구조 해설과 지원금 반영 블록은 2열 보드로 묶을 수 있다

### 7-4. 섹션별 역할

#### Hero
- eyebrow: `육아비 10년 비교 리포트`
- H1 예시: `아이 키우는 비용 2016 vs 2026`
- 설명 예시:
  - 분유, 기저귀, 어린이집을 기준으로 10년 전과 지금의 육아 체감 비용을 비교합니다.
  - 단순 가격표가 아니라 지원금, 반복지출, 생활 구조 변화를 함께 읽는 리포트라는 메시지를 준다.

#### InfoNotice
- 필수 문구
  - 본 페이지는 비교용 참고 데이터이며 실제 지출은 브랜드, 지역, 수유 방식, 보육 방식에 따라 달라질 수 있음
  - 어린이집은 공식 보육료와 부모 체감 비용이 다를 수 있음
  - 부모급여 및 지원금은 제도 기준 시점에 따라 달라질 수 있으며 추정 체감은 단순화된 비교값임
  - 기준 시점과 업데이트일 명시

#### 육아비 브리프 보드
- 리드 문단 1개
- 하이라이트 카드 3개
  - 가장 많이 체감되는 반복지출
  - 지원금이 있어도 체감이 남는 항목
  - 구조 변화로 해석이 필요한 항목
- 목적: 검색 유입 사용자가 첫 화면에서 `무엇이 많이 올랐나`, `무엇은 구조가 달라졌나`, `왜 더 무겁게 느껴지나`를 동시에 이해하게 한다.

#### KPI 요약 카드
- 카드 5~6개 권장
  - 분유 상승률
  - 기저귀 상승률
  - 어린이집 구조 변화
  - 부모급여 2026 기준
  - 출생아 수 2025 기준
  - 평균 초혼 연령

#### 출산/양육 환경 브리프 섹션
- 짧은 리드 문단
- 보조 지표 카드 또는 표
  - 합계출산율
  - 출생아 수
  - 평균 초혼 연령
- 목적: 이번 리포트가 단순 가격표 모음이 아니라 현재 부모 세대의 시작 조건을 함께 설명하는 페이지라는 점을 분명히 한다.

#### 2016 vs 2026 직접 비교 보드
- 좌: 2016
- 우: 2026
- 비교 항목
  - 분유 월 비용
  - 기저귀 월 비용
  - 어린이집 체감
  - 부모 지원 제도
  - 순부담 해석

#### 품목별 상세 비교 표
- 행
  - 분유
  - 기저귀
  - 어린이집
- 열
  - 2016 체감
  - 2026 체감
  - 변화 포인트
  - 해석
- 목적: `많이 오른 항목`과 `공식 수치보다 해석이 중요한 항목`을 분리해서 보여준다.

#### 왜 더 무겁게 느껴지는가 해설 섹션
- 핵심 문단 1~2개
- 보조 포인트 카드 4~5개
  - 결혼 시점 지연
  - 주거비 부담
  - 고정비 증가
  - 반복지출 누적
  - 육아 시작 시점의 자금 압박
- 목적: 출산율 하락 원인을 단정하지 않으면서도 현재 부모 세대가 느끼는 체감 구조를 설명한다.

#### 지원금 반영 체감 테이블
- 열 예시
  - 시나리오
  - 분유
  - 기저귀
  - 어린이집
  - 지원금 반영
  - 월 체감 총평
- 행 예시
  - 최소형
  - 평균형
  - 부담형
- 숫자보다는 범위형 UI 사용 권장
  - `월 10만~20만원`
  - `월 20만~40만원`
  - `월 40만원 이상`

#### 내 상황 기준 체감 계산 박스
- 입력
  - 육아 단계
  - 수유 방식
  - 어린이집 이용 여부
- 출력 카드 4개
  - 월 예상 부담 범위
  - 가장 부담 큰 항목
  - 지원금 반영 후 체감
  - 연결 추천 계산기
- 별도 제출 버튼 없이 즉시 반영

#### 패턴 요약 카드
- 카드 3~4개
- 예시 주제
  - 반복지출은 체감이 강하다
  - 모든 항목이 똑같이 많이 오른 것은 아니다
  - 어린이집은 공식 비용보다 구조 해석이 중요하다
  - 육아비는 주거비와 겹칠 때 더 무겁다

#### 외부 참고 링크 섹션
- 3개 그룹으로 분리
  - 공식 통계
  - 보육/지원 제도
  - 육아 비용 참고 자료
- 공식 링크 우선

#### 관련 계산기 / 리포트 CTA
- 내부 링크 우선
  - `parental-leave-short-work-calculator`
  - 출산~2세 지원금 계산기 관련 페이지
  - `baby-cost-guide-first-year`
- 목적: 육아비 리포트에서 실제 계산 도구로 자연스럽게 이어지게 만든다.

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
- `baby-cost-report-hero-board`
- `baby-cost-highlight-card`
- `baby-cost-kpi-grid`
- `baby-cost-context-board`
- `baby-cost-compare-grid`
- `baby-cost-item-table`
- `baby-cost-structure-grid`
- `baby-cost-support-table`
- `baby-cost-feel-box`
- `baby-cost-pattern-grid`
- `baby-cost-reference-panel`
- `baby-cost-cta-panel`

### 8-3. Astro 페이지 구성 방식
- `.astro`에서 KPI, FAQ, 초기 계산값을 만든다.
- `script[type="application/json"]`로 전체 데이터 전달
- `public/scripts/baby-cost-2016-vs-2026.js`에서
  - 체감 계산
  - 시나리오 선택 토글
  - URL 파라미터 동기화
- 1차는 별도 Astro 하위 컴포넌트 분리 없이 페이지 내부 마크업으로 시작한다.

---

## 9. 상태 관리 포인트

### 9-1. 클라이언트 상태
```ts
type StageMode = "newborn" | "infant";
type FeedingMode = "formula" | "mixed" | "breast";
type ChildcareMode = "home" | "daycare";

type ViewState = {
  stageMode: StageMode;
  feedingMode: FeedingMode;
  childcareMode: ChildcareMode;
};
```

### 9-2. 초기값
- `stageMode = "newborn"`
- `feedingMode = "formula"`
- `childcareMode = "home"`

### 9-3. 동작 규칙
- 육아 단계 변경 시
  - 월 부담 범위 갱신
  - 해석 문구 갱신
- 수유 방식 변경 시
  - 분유 비용 관련 카드 갱신
- 어린이집 이용 여부 변경 시
  - 어린이집 체감 및 지원금 반영 결과 갱신
- URL 파라미터 동기화 권장
  - `stage`
  - `feeding`
  - `care`

예시:
```txt
/reports/baby-cost-2016-vs-2026/?stage=infant&feeding=mixed&care=daycare
```

---

## 10. 계산 로직

### 10-1. 핵심 KPI 계산
```ts
formulaGrowthRate = Math.round(((formula2026 - formula2016) / formula2016) * 100);
diaperGrowthRate = Math.round(((diaper2026 - diaper2016) / diaper2016) * 100);
```

### 10-2. 지원금 반영 순부담
```ts
netBurden = Math.max(baseMonthlyCost - monthlySupport, 0);
```

### 10-3. 범위형 체감 라벨 계산
```ts
if (netBurden < 100000) feelBand = "월 10만원 미만";
else if (netBurden < 200000) feelBand = "월 10만~20만원";
else if (netBurden < 400000) feelBand = "월 20만~40만원";
else feelBand = "월 40만원 이상";
```

### 10-4. 단계별 기본 비용 계산
```ts
monthlyCost =
  feedingCostByMode[feedingMode] +
  diaperCostByStage[stageMode] +
  childcareCostByMode[childcareMode];
```

### 10-5. 가장 부담 큰 항목 계산
```ts
largestCostLabel = Object.entries({
  formula: feedingCostByMode[feedingMode],
  diaper: diaperCostByStage[stageMode],
  daycare: childcareCostByMode[childcareMode],
}).sort((a, b) => b[1] - a[1])[0][0];
```

### 10-6. 해석 라벨 규칙
```ts
if (childcareMode === "daycare") summaryLabel = "공식 지원과 실제 준비비를 함께 봐야 하는 구간";
else if (feedingMode === "formula") summaryLabel = "반복구매 체감이 큰 구간";
else summaryLabel = "지원금 반영 시 버틸 만한 구간";
```

---

## 11. 데이터 파일 구조

### 11-1. 메인 데이터 파일 구조
```ts
export type BabyCostKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral" | "warning";
};

export type BabyCostContextRow = {
  label: string;
  value: string;
  sub: string;
};

export type BabyCostCompareRow = {
  label: string;
  value2016: string;
  value2026: string;
  changeLabel: string;
  note: string;
};

export type BabyCostItemRow = {
  item: string;
  cost2016: string;
  cost2026: string;
  changePoint: string;
  interpretation: string;
};

export type BabyCostSupportScenario = {
  label: string;
  formula: string;
  diaper: string;
  daycare: string;
  support: string;
  feelBand: string;
};

export type BabyCostFeelDefaults = {
  newborn: {
    formula: number;
    mixed: number;
    breast: number;
    diaper: number;
    daycareHome: number;
    daycareUse: number;
    support: number;
  };
  infant: {
    formula: number;
    mixed: number;
    breast: number;
    diaper: number;
    daycareHome: number;
    daycareUse: number;
    support: number;
  };
};

export type BabyCost2016Vs2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  reportLead: string;
  kpis: BabyCostKpi[];
  contextRows: BabyCostContextRow[];
  compareRows: BabyCostCompareRow[];
  itemRows: BabyCostItemRow[];
  structureNotes: { title: string; body: string }[];
  supportScenarios: BabyCostSupportScenario[];
  faq: { q: string; a: string }[];
  references: {
    official: { label: string; href: string }[];
    policy: { label: string; href: string }[];
    reading: { label: string; href: string }[];
  };
  relatedLinks: { label: string; href: string }[];
  feelDefaults: BabyCostFeelDefaults;
};
```

### 11-2. 데이터 운영 규칙
- 비용 단위는 내부 저장 시 `원` 또는 `만원` 중 하나로 통일하고 표시 함수로 분리한다.
- 공식 가격과 체감 비용은 같은 행 또는 카드에서 섞지 않는다.
- 어린이집은 `공식 보육료`, `지원 구조`, `부모 체감`을 구분해 적는다.
- 부모급여/지원금은 기준 연도와 적용 월령 범위를 함께 명시한다.
- 기사 정리값, 범위 추정값은 `추정`, `참고`, `체감 비교용` 문구를 `InfoNotice`에 포함한다.

### 11-3. 추천 초기 데이터 세트
- `kpis`
  - 분유 상승률
  - 기저귀 상승률
  - 부모급여
  - 출생아 수
  - 평균 초혼 연령
- `contextRows`
  - 합계출산율
  - 출생아 수
  - 평균 초혼 연령
- `compareRows`
  - 분유, 기저귀, 어린이집, 부모급여, 순부담 해석
- `itemRows`
  - 분유, 기저귀, 어린이집 상세 비교
- `supportScenarios`
  - 최소형, 평균형, 부담형

### 11-4. 등록 파일
- 메인 데이터: `src/data/babyCost2016Vs2026.ts`
- 리포트 목록 등록: `src/data/reports.ts`
- 리포트 허브 노출: `src/pages/reports/index.astro`
- 사이트맵 등록: `public/sitemap.xml`

---

## 12. 구현 순서

### 12-1. 1단계: 데이터 파일 작성
- `src/data/babyCost2016Vs2026.ts` 생성
- `meta`, `reportLead`, `kpis`, `contextRows`, `compareRows`, `itemRows`, `structureNotes`, `supportScenarios`, `faq`, `references`, `relatedLinks`, `feelDefaults` 작성
- 파생값
  - KPI 카드 값
  - 비교 보드용 change label
  - 체감 계산 기본값

### 12-2. 2단계: 리포트 페이지 생성
- `src/pages/reports/baby-cost-2016-vs-2026.astro`
- 포함 섹션
  - Hero
  - InfoNotice
  - 브리프 보드
  - KPI
  - 출산/양육 환경 브리프
  - 2016 vs 2026 비교 보드
  - 품목별 비교표
  - 구조 해설
  - 지원금 반영 테이블
  - 체감 계산 박스
  - 패턴 요약
  - 외부 링크
  - 관련 CTA
  - SeoContent

### 12-3. 3단계: 스크립트 구현
- `public/scripts/baby-cost-2016-vs-2026.js`
- 담당 기능
  - 시나리오 토글
  - 체감 계산
  - URL 파라미터 동기화

### 12-4. 4단계: 스타일 작성
- `src/styles/scss/pages/_baby-cost-2016-vs-2026.scss`
- `src/styles/app.scss` import 추가
- 확인 포인트
  - `wedding-cost-2016-vs-2026`처럼 빠르게 읽히는 비교 리포트 밀도 유지
  - `baby-cost-guide-first-year`처럼 육아 카테고리 톤앤매너 유지
  - 표와 카드가 정보형 문서처럼 보이되 계산소 특유의 실전감이 살아 있게 정리

### 12-5. 5단계: 리포트 허브 연결
- `src/data/reports.ts` 등록
- `src/pages/reports/index.astro` 육아/출산 시리즈에 추가
- `public/sitemap.xml` 추가

### 12-6. 6단계: OG / 메타 / 링크 정리
- OG 이미지 생성
- 메타 타이틀 / 설명 반영
- 관련 계산기 / 관련 리포트 연결
- 외부 링크 rel 속성 점검

---

## 13. QA 체크포인트

### 13-1. 데이터
- [ ] 분유, 기저귀, 어린이집 비용 단위가 일치하는지 확인
- [ ] 공식 비용과 체감 비용이 같은 문장에 혼용되지 않는지 확인
- [ ] 부모급여 및 지원금 기준 시점 문구가 빠지지 않는지 확인
- [ ] 출생아 수, 합계출산율, 초혼 연령 등 보조 지표에 연도 표기가 있는지 확인
- [ ] 범위형 체감 라벨이 데이터와 모순되지 않는지 확인

### 13-2. UI
- [ ] 첫 화면에서 `육아비 10년 비교 리포트`라는 성격이 명확한지 확인
- [ ] 브리프 -> KPI -> 비교 보드 흐름이 자연스러운지 확인
- [ ] 품목별 비교표가 모바일에서 가로 스크롤로 깨지지 않는지 확인
- [ ] 단계/수유/어린이집 토글 변경 시 체감 카드가 즉시 갱신되는지 확인
- [ ] 구조 해설이 과도한 긴 문단이 아니라 카드/보드 중심으로 읽히는지 확인

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
- 이 페이지는 단순 육아 기사 요약이 아니라 `반복지출 + 제도 변화 + 체감 구조`를 같이 읽는 10년 비교 리포트다.
- 핵심은 `무조건 다 비싸졌다`보다 `무엇은 정말 많이 올랐고 무엇은 구조가 달라져 해석이 필요하다`를 구분해 주는 것이다.

### 14-2. 기존 리포트와의 차이
- `baby-cost-guide-first-year`보다 기간 비교와 체감 구조 해석 비중이 더 크다.
- `wedding-cost-2016-vs-2026`보다 육아 카테고리별 반복지출 해설이 더 중요하다.
- `parental-leave-short-work-calculator`처럼 개인 계산기로 직접 이어질 수 있어야 한다.

### 14-3. 구현 우선순위
1. 데이터 구조 확정
2. 브리프 + KPI + 비교 보드 섹션 구성
3. 품목별 비교표 / 구조 해설 / 지원금 테이블 구현
4. 체감 계산 박스 구현
5. 외부 링크 / CTA / 허브 연결
6. OG 및 마무리

### 14-4. 확장 방향
- `초등 입학 비용 2016 vs 2026`
- `육아용품 물가 10년 비교`
- `첫째 vs 둘째 육아비용 체감 비교`
- `출산~24개월 순부담 계산기`
