# 대학생 등록금·생활비 콘텐츠 클러스터 2026 — 설계 문서 (2차: 3페이지)

> 기획 원본: [`docs/plan/202607/university-student-content-cluster-2026-plan.md`](../../plan/202607/university-student-content-cluster-2026-plan.md)
> 1차 설계·구현 완료: [`university-student-content-cluster-2026-design.md`](./university-student-content-cluster-2026-design.md) — `university-cost-calculator-2026`, `national-scholarship-calculator-2026` (배포됨)
> 작성일: 2026-07-15
> 범위: 2차 우선순위 3개 — `dorm-vs-commute-cost-comparison-2026`(`/tools/`), `university-tuition-ranking-2026`(`/reports/`), `work-study-vs-part-time-comparison-2026`(`/reports/`)

---

## 0. 공통 설계 원칙

### 0-1. 1차 자산 재사용 (실제 코드 확인 완료)

2차 3페이지는 신규 데이터를 거의 만들지 않고 1차에서 이미 구축한 자산을 최대한 재사용한다.

| 1차 자산 | 재사용하는 2차 페이지 |
|---|---|
| `src/data/universityHousingCost2026.ts`의 `RESIDENCE_PRESETS` | `dorm-vs-commute-cost-comparison-2026` |
| `src/data/universityTuition2026.ts`의 `TUITION_PRESETS`, `TUITION_TREND_2022_2026` | `university-tuition-ranking-2026` |
| `src/data/minimumWage2026.ts`의 `MINIMUM_WAGE_2026`, `WEEKLY_HOLIDAY_MIN_HOURS`, `MONTHLY_WEEKS` | `work-study-vs-part-time-comparison-2026` |

새로 만드는 데이터는 등록금 상위 대학 예시(`university-tuition-ranking-2026` 전용)와 국가근로장학금 조건(`work-study-vs-part-time-comparison-2026` 전용) 두 가지뿐이다.

### 0-2. 페이지 유형 구분

- `dorm-vs-commute-cost-comparison-2026`은 계산기(`/tools/`, `SimpleToolShell`) — 사용자가 3개 거주형태 비용을 동시에 입력·비교하는 인터랙티브 도구라 계산기 유형이 맞다.
- `university-tuition-ranking-2026`, `work-study-vs-part-time-comparison-2026`은 리포트(`/reports/`) — `senior-job-comparison-2026.astro`(실제 코드 확인 완료) 패턴을 그대로 따른다: `SimpleToolShell` 대신 `<main class="container page-shell report-page op-page <slug>-page">` + `op-section` 구조, 클라이언트 스크립트 없이 정적 렌더.

### 0-3. SEO 공통 규칙 (`docs/GOOGLE_SEO_RULES.md`, `CONTENT_GUIDE.md` 기준)

1차와 동일 — `SeoContent` intro 4단락 이상·800자 이상, FAQ 5개 이상(이 클러스터는 7~8개), related 3~5개, `<Fragment slot="seo">`(계산기) 또는 페이지 하단(`report-page`, 실제로는 컴포넌트 슬롯 없이 `<main>` 안에 직접 배치, `senior-job-comparison-2026.astro` 참고) 배치, 트레일링 슬래시, `sitemap.xml` `changefreq: monthly` 등록.

### 0-4. 신규 확인 데이터 — 국가근로장학금 조건 (2026-07-15 웹검색, ⚠️ 출처 간 표기 상이)

| 항목 | 확인값 |
|---|---|
| 교내 일반(봉사유형 포함) 시급 | 10,320원 (2026 최저임금과 동일) |
| 교외 일반(장애대학생 봉사유형 포함) 시급 | 12,790원 |
| 교내 근로 재학 중 이용 가능 횟수 | 최대 4학기(24개월) |

**⚠️ 월 근로시간 상한은 검색된 출처마다 표기가 엇갈린다** (예: "학기 중 월 최대 35시간" vs "학기 중 월당 최대 80시간"이 같은 요약 안에서 상충 표기됨). 이 페이지는 정적 리포트이고 사용자가 직접 시간을 조정할 수 없으므로, **정확한 시간 상한 없이 "학기 중 참고 시나리오(월 40시간)"·"방학 중 참고 시나리오(월 80시간)"라는 라벨을 붙여 계산 예시로만 제시**하고, InfoNotice에 "정확한 근로시간 상한은 소속 대학 근로장학 안내를 따른다"를 명시한다. 확정 수치를 단정하지 않는 원칙(시니어 일자리 클러스터에서 적용한 것과 동일)을 그대로 따른다.

출처: [전북대 국가근로장학금 공지](https://www.jbnu.ac.kr/web/Board/213047/detailView.do), [서일대 국가근로장학금 근로기관 안내자료](https://www.seoil.ac.kr/bbs/global/114/155674/download.do), [한국장학재단 국가근로장학금 소개](https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_04_01)

---

## 1. 페이지 3 — `dorm-vs-commute-cost-comparison-2026` (2차 1순위, `/tools/`)

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/dormVsCommuteCostComparison2026.ts` (`RESIDENCE_PRESETS` import) |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/dorm-vs-commute-cost-comparison-2026.astro` |
| 스크립트 | `public/scripts/dorm-vs-commute-cost-comparison-2026.js` |
| 스타일 | `src/styles/scss/pages/_dorm-vs-commute-cost-comparison-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /tools/dorm-vs-commute-cost-comparison-2026/
타이틀: 기숙사 vs 자취 vs 통학 2026 | 4년 총비용 한눈에 비교
디스크립션: 기숙사·자취·통학(부모님 집) 월 주거비·생활비를 입력하면 대학 4년 총비용과 통학 시간까지 한 번에 비교합니다. 거주 형태 선택 전 확인하세요.
```

### 1-3. 1차 대비 설계 차이

`university-cost-calculator-2026`은 거주 형태를 **하나만** 골라 등록금까지 포함한 총비용을 계산했다. 이 페이지는 등록금은 빼고 **3개 거주 형태를 동시에** 놓고 주거·생활비만 비교하며, 통학(부모님 집) 옵션에는 **통학 시간 비용**이라는 새 축을 추가한다 — 두 페이지가 같은 계산을 반복하지 않도록 역할을 분리했다.

### 1-4. 데이터 파일 설계

```ts
import { RESIDENCE_PRESETS, type ResidenceType } from "./universityHousingCost2026";

export const DVC_META = {
  slug: "dorm-vs-commute-cost-comparison-2026",
  title: "기숙사 vs 자취 vs 통학 2026",
  seoTitle: "기숙사 vs 자취 vs 통학 2026 | 4년 총비용 한눈에 비교",
  seoDescription:
    "기숙사·자취·통학(부모님 집) 월 주거비·생활비를 입력하면 대학 4년 총비용과 통학 시간까지 한 번에 비교합니다. 거주 형태 선택 전 확인하세요.",
  updatedAt: "2026-07-15",
  dataNote:
    "거주 형태별 기본값은 2026년 서울 대학가 원룸 시세·전국 기숙사비 평균 기준이며, 실제 비용은 지역·학교별로 다를 수 있습니다. 등록금은 포함하지 않은 주거·생활비 전용 비교입니다.",
};

export interface DvcResidenceInput {
  type: ResidenceType;
  monthlyHousing: number;
  monthlyLiving: number;
}

export interface DvcResidenceResult extends DvcResidenceInput {
  monthlyTotal: number;
  total4y: number;
}

// public/scripts/dorm-vs-commute-cost-comparison-2026.js와 1:1 대응
export function calcResidenceCost(input: DvcResidenceInput, years: number): DvcResidenceResult {
  const monthlyTotal = input.monthlyHousing + input.monthlyLiving;
  const total4y = monthlyTotal * 12 * years;
  return { ...input, monthlyTotal, total4y };
}

export interface DvcCommuteInput {
  oneWayMinutes: number;
  schoolDaysPerYear: number; // 참고값, 사용자 조정 가능
}

export interface DvcCommuteResult {
  annualHours: number;
  totalHours: number; // 재학 기간 전체
}

export function calcCommuteTime(input: DvcCommuteInput, years: number): DvcCommuteResult {
  const dailyMinutes = input.oneWayMinutes * 2;
  const annualMinutes = dailyMinutes * input.schoolDaysPerYear;
  const annualHours = annualMinutes / 60;
  return { annualHours, totalHours: annualHours * years };
}

export const DVC_DEFAULT_INPUT = {
  yearsEnrolled: 4 as 4 | 6,
  oneWayMinutes: 40,
  schoolDaysPerYear: 180, // 방학 제외 등교일 참고값(추정), 자유 조정 가능
  residences: RESIDENCE_PRESETS.map((p) => ({
    type: p.type,
    monthlyHousing: p.monthlyHousingDefault,
    monthlyLiving: p.monthlyLivingDefault,
  })),
};

export const DVC_FAQ = [
  { question: "기숙사가 자취보다 얼마나 저렴한가요?", answer: "2인실 기준 평균 기숙사비는 월 32만 5천 원으로 자취(월세+관리비 70만 4천 원)의 절반 이하입니다. 4년 기준으로는 수백만 원 이상 차이가 날 수 있습니다." },
  { question: "통학이 항상 가장 저렴한가요?", answer: "주거비 자체는 통학이 가장 적게 듭니다. 다만 편도 통학시간이 길면 4년 동안 수백~1천 시간 이상을 통학에 쓰게 되므로, 비용만이 아니라 시간도 함께 고려해야 합니다." },
  { question: "기숙사는 아무나 들어갈 수 있나요?", answer: "전국 기숙사 수용률은 22.6%(수도권은 18.2%)에 불과해 신청 경쟁이 있습니다. 성적·거주지 기준 등 학교별 선발 기준을 확인해야 합니다." },
  { question: "통학시간은 어떻게 계산되나요?", answer: "편도 통학시간(분)에 왕복 2회, 연간 등교일수를 곱해 계산합니다. 방학 기간은 등교일수에서 제외한 참고값을 기본으로 제공하며 직접 조정할 수 있습니다." },
  { question: "등록금도 이 계산에 포함되나요?", answer: "아닙니다. 이 페이지는 주거·생활비만 비교합니다. 등록금까지 포함한 4년 총비용은 대학 등록금 계산기에서 확인할 수 있습니다." },
  { question: "자취 생활비는 왜 기숙사보다 높게 잡았나요?", answer: "기숙사는 학식·공동시설 이용으로 생활비가 상대적으로 낮게 형성되는 경향이 있어 참고값에 차이를 뒀습니다. 실제 지출은 개인차가 큽니다." },
];

export const DVC_RELATED_LINKS = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금까지 포함한 대학 4년 실부담금을 계산합니다." },
  { href: "/reports/university-tuition-ranking-2026/", label: "대학 등록금 순위 2026", description: "설립유형·계열별 등록금과 상위 대학 예시를 비교합니다." },
  { href: "/reports/single-household-living-cost-2026/", label: "1인 가구 생활비 리포트", description: "자취 생활비 항목별 평균을 더 자세히 확인합니다." },
];
```

### 1-5. 페이지 IA

```
Hero + InfoNotice (dataNote — 등록금 미포함 명시)
ToolActionBar

[aside] 재학 기간 mode-chip(4년/6년)
[aside] 통학(부모님 집) 전용 입력: 편도 통학시간(분), 연간 등교일수(참고값, 자유 조정)
[aside] 3개 거주형태 입력 카드(부모님 집/기숙사/자취) — 각각 월 주거비·월 생활비 숫자 입력, 기본값은 RESIDENCE_PRESETS

[본문] 결과: 3열 비교 카드 (거주형태별 월비용/4년 총비용, 최저비용 카드에 "최저 비용" 배지)
[본문] 통학 카드에는 추가로 "연간 통학시간 / 4년 누적 통학시간" 표시
[본문] 막대 비교(월비용 기준 가로 바, bpec-breakdown 패턴 재사용)
[본문] 관련 CTA (DVC_RELATED_LINKS)

SeoContent (intro 4단락/faq 6개/related 3개)
```

### 1-6. 스크립트 구조

`university-cost-calculator-2026.js`와 동일한 패턴(입력값 읽기 → 순수 계산 함수 → DOM 반영 → `url-state.js`로 상태 저장). 3개 거주형태 입력 카드가 각각 `data-dvc-type="PARENTS|DORM|OFFCAMPUS"`를 갖고, `calcResidenceCost`를 3번 호출해 결과를 렌더한다. 최저 `total4y` 값을 가진 카드에 `is-lowest` 클래스를 부여한다.

---

## 2. 페이지 4 — `university-tuition-ranking-2026` (2차 2순위, `/reports/`)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/universityTuitionRanking2026.ts` (`TUITION_PRESETS`, `TUITION_TREND_2022_2026` import) |
| 리포트 등록 | `src/data/reports.ts`, `src/pages/reports/index.astro`의 `reportMetaBySlug` |
| 페이지 | `src/pages/reports/university-tuition-ranking-2026.astro` |
| 스타일 | `src/styles/scss/pages/_university-tuition-ranking-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /reports/university-tuition-ranking-2026/
타이틀: 대학 등록금 순위 2026 | 국공립·사립 등록금 비교
디스크립션: 2026학년도 설립유형별·계열별 평균 등록금과 등록금 상위 대학 예시, 최근 5년 인상·동결 현황을 한 번에 비교합니다.
```

### 2-3. 데이터 파일 설계

```ts
import { TUITION_PRESETS, TUITION_TREND_2022_2026, TUITION_AVERAGE_2026 } from "./universityTuition2026";
export { TUITION_PRESETS, TUITION_TREND_2022_2026 };

export interface TopTuitionSchool {
  name: string;
  annualTuition: number;
  note: string;
}

// 등록금 상위 대학 예시 — 절대 순위 단정 아닌 "예시"로만 제시 (계열 구성이 다른 학교 간 단순 비교 주의)
export const TUITION_TOP_SCHOOLS: TopTuitionSchool[] = [
  { name: "을지대학교", annualTuition: 11_280_400, note: "의학·자연과학 계열 중심이라 상대적으로 높게 산정" },
  { name: "연세대학교", annualTuition: 9_957_800, note: "전 계열 등록금이 모두 공개된 대학 중 최고" },
  { name: "한국에너지공과대학교(KENTECH)", annualTuition: 9_000_000, note: "이공계 특성화 대학 중 최고" },
  { name: "대구경북과학기술원(DGIST)", annualTuition: 7_934_000, note: "이공계 특성화" },
  { name: "한국과학기술원(KAIST)", annualTuition: 6_866_000, note: "이공계 특성화" },
  { name: "울산과학기술원(UNIST)", annualTuition: 6_568_000, note: "이공계 특성화" },
  { name: "포항공과대학교(POSTECH)", annualTuition: 5_613_000, note: "이공계 특성화 중 최저" },
];

export const UTR_OVERVIEW_STATS = [
  { label: "4년제 전체 평균", value: "727만원", note: "전년 대비 +2.1%" },
  { label: "사립대 평균", value: "823만원" },
  { label: "국공립대 평균", value: "425만원" },
  { label: "2026학년도 인상 대학", value: "125개교", note: "동결 65개교(34.2%)" },
];

export const UTR_META = {
  slug: "university-tuition-ranking-2026",
  title: "대학 등록금 순위 2026",
  seoTitle: "대학 등록금 순위 2026 | 국공립·사립 등록금 비교",
  seoDescription:
    "2026학년도 설립유형별·계열별 평균 등록금과 등록금 상위 대학 예시, 최근 5년 인상·동결 현황을 한 번에 비교합니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "설립유형·계열별 평균은 2026학년도 대학알리미 공시 기반 언론 보도 종합이며, 상위 대학 예시는 절대 순위가 아니라 계열 구성이 다른 학교 간 참고 사례입니다.",
};

export const UTR_FAQ = [
  { question: "등록금이 가장 비싼 대학은 어디인가요?", answer: "을지대학교가 연 1,128만 400원으로 가장 높게 나타났지만 의학·자연과학 계열 중심 구성 때문입니다. 전 계열이 공개된 대학 중에서는 연세대학교(995만 7,800원)가 최고입니다." },
  { question: "국공립대와 사립대 등록금 차이는 얼마나 되나요?", answer: "2026학년도 기준 국공립대 평균은 425만 원, 사립대는 823만 1,500원으로 약 2배 차이입니다." },
  { question: "등록금은 계속 오르고 있나요?", answer: "2026학년도 법정 인상 상한은 3.19%로 최근 5년(2022~2026) 중 가장 낮은 수준입니다. 다만 실제 인상 대학 수는 125개교(65.8%)로 여전히 많습니다." },
  { question: "이공계 특성화 대학은 등록금이 저렴한가요?", answer: "POSTECH(561만 3,000원), UNIST(656만 8,000원), KAIST(686만 6,000원) 등은 국공립대 평균보다는 높지만 일반 사립대보다는 낮은 편입니다." },
  { question: "계열에 따라 등록금이 얼마나 차이 나나요?", answer: "2026학년도 기준 의학 계열 평균 1,032만 5,900원, 예체능 833만 8,100원, 공학 767만 7,400원, 자연과학 732만 3,300원, 인문사회 643만 3,700원 순입니다." },
  { question: "이 순위는 실질 등록금(장학금 차감 후) 기준인가요?", answer: "아닙니다. 이 리포트는 명목 등록금 기준입니다. 실질 부담액은 국가장학금 계산기로 예상 지원금을 계산해 별도로 확인하는 것이 정확합니다." },
];

export const UTR_RELATED_LINKS = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
  { href: "/tools/dorm-vs-commute-cost-comparison-2026/", label: "기숙사 vs 자취 vs 통학 비교", description: "거주 형태별 주거·생활비와 통학 시간을 비교합니다." },
];
```

### 2-4. 페이지 IA (`senior-job-comparison-2026.astro` 패턴 그대로)

```
Hero + InfoNotice
섹션 1 — 한눈에 보는 개요 (UTR_OVERVIEW_STATS, KPI 카드 4개)
섹션 2 — 설립유형·계열별 등록금 비교 (TUITION_PRESETS, 가로 바 비교 — sjc-bar-list 패턴 재사용)
섹션 3 — 등록금 상위 대학 예시 (TUITION_TOP_SCHOOLS 표, "절대 순위 아님" 명시)
섹션 4 — 최근 5년 인상·동결 추이 (TUITION_TREND_2022_2026 표 또는 막대)
섹션 5 — 관련 CTA 그리드 (UTR_RELATED_LINKS)
SeoContent (intro 4단락/faq 6개/related 3개)
```

---

## 3. 페이지 5 — `work-study-vs-part-time-comparison-2026` (2차 3순위, `/reports/`)

### 3-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/workStudyVsPartTime2026.ts` (`MINIMUM_WAGE_2026`, `WEEKLY_HOLIDAY_MIN_HOURS`, `MONTHLY_WEEKS` import) |
| 리포트 등록 | `src/data/reports.ts`, `reportMetaBySlug` |
| 페이지 | `src/pages/reports/work-study-vs-part-time-comparison-2026.astro` |
| 스타일 | `src/styles/scss/pages/_work-study-vs-part-time-comparison-2026.scss` |

### 3-2. URL 및 메타

```
슬러그: /reports/work-study-vs-part-time-comparison-2026/
타이틀: 국가근로 vs 알바 2026 | 월 수입 얼마 차이날까
디스크립션: 국가근로장학금과 편의점·카페 알바의 시급·월 근로 참고 시나리오·예상 월수입을 비교합니다. 교내근로 학기 중·방학 중 조건 차이 포함.
```

### 3-3. 데이터 파일 설계

```ts
import { MINIMUM_WAGE_2026, WEEKLY_HOLIDAY_MIN_HOURS, MONTHLY_WEEKS } from "./minimumWage2026";

export type WorkType = "CAMPUS_WORK_STUDY" | "OFFCAMPUS_WORK_STUDY" | "CONVENIENCE_STORE" | "CAFE";

export interface WorkProfile {
  type: WorkType;
  label: string;
  hourlyWage: number;
  monthlyHoursScenario: number; // 참고 시나리오, 절대 상한 아님
  scenarioNote: string;
  location: string;
  studyCompat: "좋음" | "보통";
  commuteCost: "낮음" | "있음";
  durationLimit: string;
}

// 주휴수당 판정(주 15시간 이상) — minimumWage2026.ts 상수 재사용, 재정의 금지
function calcWeeklyHolidayPay(hourlyWage: number, weeklyHours: number): number {
  return weeklyHours >= WEEKLY_HOLIDAY_MIN_HOURS ? (weeklyHours / 40) * 8 * hourlyWage : 0;
}

// public/scripts 없이 서버에서 고정 시나리오로 미리 계산해 정적 렌더(리포트 페이지 원칙)
export function calcMonthlyIncome(hourlyWage: number, monthlyHours: number): number {
  const weeklyHours = monthlyHours / MONTHLY_WEEKS;
  const weeklyHolidayPay = calcWeeklyHolidayPay(hourlyWage, weeklyHours) * MONTHLY_WEEKS;
  return hourlyWage * monthlyHours + weeklyHolidayPay;
}

export const WSC_WORK_PROFILES: WorkProfile[] = [
  {
    type: "CAMPUS_WORK_STUDY", label: "국가근로(교내 일반)",
    hourlyWage: MINIMUM_WAGE_2026, monthlyHoursScenario: 40,
    scenarioNote: "학기 중 참고 시나리오(월 40시간) — 정확한 상한은 학교별 공지 확인 필요",
    location: "교내", studyCompat: "좋음", commuteCost: "낮음",
    durationLimit: "재학 중 최대 4학기(24개월)",
  },
  {
    type: "OFFCAMPUS_WORK_STUDY", label: "국가근로(교외 일반)",
    hourlyWage: 12_790, monthlyHoursScenario: 40,
    scenarioNote: "학기 중 참고 시나리오(월 40시간) — 정확한 상한은 학교별 공지 확인 필요",
    location: "협약기관", studyCompat: "보통", commuteCost: "있음",
    durationLimit: "횟수 제한 없음(협약기관 사정에 따라 다름)",
  },
  {
    type: "CONVENIENCE_STORE", label: "편의점 알바",
    hourlyWage: MINIMUM_WAGE_2026, monthlyHoursScenario: 60,
    scenarioNote: "참고 시나리오(월 60시간, 주휴수당 포함)",
    location: "매장", studyCompat: "보통", commuteCost: "있음",
    durationLimit: "제한 없음",
  },
  {
    type: "CAFE", label: "카페 알바",
    hourlyWage: MINIMUM_WAGE_2026, monthlyHoursScenario: 60,
    scenarioNote: "참고 시나리오(월 60시간, 주휴수당 포함)",
    location: "매장", studyCompat: "보통", commuteCost: "있음",
    durationLimit: "제한 없음",
  },
];

export const WSC_CALC_EXAMPLES = WSC_WORK_PROFILES.map((p) => ({
  ...p,
  monthlyIncome: calcMonthlyIncome(p.hourlyWage, p.monthlyHoursScenario),
}));

export const WSC_META = {
  slug: "work-study-vs-part-time-comparison-2026",
  title: "국가근로 vs 알바 2026",
  seoTitle: "국가근로 vs 알바 2026 | 월 수입 얼마 차이날까",
  seoDescription:
    "국가근로장학금과 편의점·카페 알바의 시급·월 근로 참고 시나리오·예상 월수입을 비교합니다. 교내근로 학기 중·방학 중 조건 차이 포함.",
  updatedAt: "2026-07-15",
  dataNote:
    "월 근로시간은 확정 상한이 아니라 비교를 위한 참고 시나리오입니다. 국가근로장학금의 정확한 월 근로시간 상한은 소속 대학 근로장학 안내를 따르며, 이 표의 시급·시간은 참고용입니다.",
};

export const WSC_INSIGHTS = [
  { title: "시급만 보면 알바가 유리해 보일 수 있습니다", description: "교외 근로(12,790원)를 제외하면 국가근로 교내와 일반 알바 시급은 2026년 최저임금으로 같습니다. 차이는 통학 비용·시간, 학업 병행 편의성에서 갈립니다." },
  { title: "교내근로는 통학·생활 동선이 짧습니다", description: "학교 안에서 근무해 별도 교통비·이동시간이 거의 들지 않고, 수업 사이 시간을 활용하기 좋습니다." },
  { title: "재학 중 이용 가능 학기 수 제한이 있습니다", description: "교내 근로는 재학 중 최대 4학기(24개월)까지만 가능해, 4년 내내 활용하려면 학기별 계획이 필요합니다." },
];

export const WSC_FAQ = [
  { question: "국가근로장학금 시급은 얼마인가요?", answer: "교내 일반(봉사유형 포함)은 2026년 최저임금과 동일한 10,320원, 교외 일반(장애대학생 봉사유형 포함)은 12,790원입니다." },
  { question: "국가근로장학금은 한 달에 얼마나 벌 수 있나요?", answer: "학기 중 월 40시간 참고 시나리오 기준 교내 근로는 약 41만 원대, 교외 근로는 약 51만 원대입니다. 정확한 근로시간 상한은 학교 공지에 따라 다릅니다." },
  { question: "국가근로장학금과 일반 알바 중 뭐가 나은가요?", answer: "시급만 보면 비슷하거나 알바가 높을 수 있지만, 통학시간·교통비를 아낄 수 있고 학업과 병행하기 좋다는 점에서 교내 근로가 실질적으로 유리한 경우가 많습니다." },
  { question: "국가근로장학금은 몇 학기까지 할 수 있나요?", answer: "교내 근로는 재학 중 최대 4학기(24개월)까지 가능합니다. 교외 근로는 협약기관 사정에 따라 다릅니다." },
  { question: "방학 중에도 국가근로장학금을 할 수 있나요?", answer: "네, 방학 중 집중근로 프로그램이 별도로 운영됩니다. 학기 중보다 근로시간이 늘어나는 경우가 많으니 소속 대학 공지를 확인하세요." },
  { question: "알바 시급 계산에 주휴수당이 포함되나요?", answer: "네, 이 리포트의 알바 월수입 예시는 주 15시간 이상 근무를 가정해 주휴수당을 포함한 금액입니다." },
];

export const WSC_RELATED_LINKS = [
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금 계산기 2026", description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다." },
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "소득분위별 예상 국가장학금 지원금을 계산합니다." },
  { href: "/tools/minimum-wage-2026/", label: "2026 최저임금 계산기", description: "이 리포트의 기준이 되는 최저임금을 상세 확인합니다." },
];
```

### 3-4. 페이지 IA

```
Hero + InfoNotice (참고 시나리오 caveat 강하게 명시)
섹션 1 — 시급 비교 KPI (교내 10,320원 / 교외 12,790원 / 알바 10,320원)
섹션 2 — 계산 예시 표 (WSC_CALC_EXAMPLES: 유형/시급/시간 시나리오/월 예상수입)
섹션 3 — 조건 비교표 (근무장소/학업병행/통근비용/이용 가능 기간)
섹션 4 — 표로는 안 보이는 패턴 (WSC_INSIGHTS)
섹션 5 — 관련 CTA (WSC_RELATED_LINKS)
SeoContent (intro 4단락/faq 6개/related 3개)
```

---

## 4. 클러스터 내부 링크 맵 (1차+2차 5페이지 전체)

```
university-cost-calculator-2026 (허브, 1차)
 ├─→ national-scholarship-calculator-2026 (1차)
 ├─→ dorm-vs-commute-cost-comparison-2026 (2차)
 └─→ university-tuition-ranking-2026 (2차)

national-scholarship-calculator-2026 (1차)
 └─→ university-cost-calculator-2026

dorm-vs-commute-cost-comparison-2026 (2차)
 ├─→ university-cost-calculator-2026
 └─→ university-tuition-ranking-2026

university-tuition-ranking-2026 (2차)
 ├─→ university-cost-calculator-2026
 ├─→ national-scholarship-calculator-2026
 └─→ dorm-vs-commute-cost-comparison-2026

work-study-vs-part-time-comparison-2026 (2차)
 ├─→ university-cost-calculator-2026
 └─→ national-scholarship-calculator-2026
```

1차 완료 시점에는 `university-cost-calculator-2026`의 `UCC_RELATED_LINKS`, `national-scholarship-calculator-2026`의 `NS_RELATED_LINKS`에 2차 페이지 링크가 없었다. **2차 페이지 배포 후 두 파일의 related 배열에 위 3개 링크를 추가하는 작업이 필요하다** (5-3 QA 체크리스트 참고).

---

## 5. 등록 체크리스트 (2차 3페이지)

### 5-1. `tools.ts` (1건 추가)

```ts
{
  slug: "dorm-vs-commute-cost-comparison-2026",
  title: "기숙사 vs 자취 vs 통학 비교 2026",
  description: "거주 형태별 월 주거비·생활비 입력하면 대학 4년 총비용과 통학 시간까지 한 번에 비교.",
  order: 72.2,
  eyebrow: "거주 형태 비교",
  category: "support",
  badges: ["신규"],
  previewStats: [
    { label: "기숙사 평균", value: "월 32만" },
    { label: "자취 평균", value: "월 70만" },
  ],
},
```

### 5-2. `reports.ts` + `reports/index.astro`의 `reportMetaBySlug` (2건 추가, 후자 누락 시 "기타" 표시 사고)

```ts
// reports.ts
{
  slug: "university-tuition-ranking-2026",
  title: "대학 등록금 순위 2026 | 국공립·사립 등록금 비교",
  description: "2026학년도 설립유형별·계열별 평균 등록금과 등록금 상위 대학 예시, 최근 5년 인상·동결 현황을 한 번에 비교합니다.",
  order: 68,
  badges: ["대학 등록금", "2026"],
},
{
  slug: "work-study-vs-part-time-comparison-2026",
  title: "국가근로 vs 알바 2026 | 월 수입 얼마 차이날까",
  description: "국가근로장학금과 편의점·카페 알바의 시급·월 근로 참고 시나리오·예상 월수입을 비교합니다.",
  order: 69,
  badges: ["국가근로", "알바", "2026"],
},
```

```ts
// reports/index.astro의 reportMetaBySlug
"university-tuition-ranking-2026": { eyebrow: "대학 등록금 비교", category: "support", isNew: true },
"work-study-vs-part-time-comparison-2026": { eyebrow: "국가근로 vs 알바", category: "support", isNew: true },
```

### 5-3. `app.scss` (3건 import)

```scss
@use 'scss/pages/dorm-vs-commute-cost-comparison-2026';
@use 'scss/pages/university-tuition-ranking-2026';
@use 'scss/pages/work-study-vs-part-time-comparison-2026';
```

### 5-4. `sitemap.xml` (3건 추가)

```xml
<url><loc>https://bigyocalc.com/tools/dorm-vs-commute-cost-comparison-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/reports/university-tuition-ranking-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/reports/work-study-vs-part-time-comparison-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

---

## 6. 개발 순서 및 QA 체크리스트

### 6-1. 개발 순서

1. `dorm-vs-commute-cost-comparison-2026` — `RESIDENCE_PRESETS` 재사용, 계산기 유형
2. `university-tuition-ranking-2026` — `TUITION_PRESETS`·`TUITION_TREND_2022_2026` 재사용 + 신규 `TUITION_TOP_SCHOOLS`, 리포트 유형
3. `work-study-vs-part-time-comparison-2026` — `MINIMUM_WAGE_2026` 재사용 + 신규 국가근로 조건 데이터, 리포트 유형
4. **1차 두 페이지(`university-cost-calculator-2026`, `national-scholarship-calculator-2026`)의 related 링크에 2차 3페이지 추가** (4장 내부 링크 맵 반영)

### 6-2. 공통 QA

- [ ] 3페이지 전부 `SeoContent` intro 4단락·800자 이상, FAQ 6개 이상, related 3개 이상 (발행 전 실측)
- [ ] `RESIDENCE_PRESETS`/`TUITION_PRESETS`/`TUITION_TREND_2022_2026`/`MINIMUM_WAGE_2026`을 재정의하지 않고 import로만 사용하는지 확인
- [ ] `work-study-vs-part-time-comparison-2026`의 월 근로시간이 "확정 상한"이 아니라 "참고 시나리오"로 명확히 라벨링되어 있는지 (0-4 ⚠️ 반영)
- [ ] `university-tuition-ranking-2026`의 등록금 상위 대학 표에 "절대 순위 아님(계열 구성 차이)" 안내가 있는지
- [ ] `dorm-vs-commute-cost-comparison-2026`에서 3개 거주형태 입력을 동시에 바꿔도 각 카드가 독립적으로 재계산되는지
- [ ] 리포트 2페이지(`university-tuition-ranking-2026`, `work-study-vs-part-time-comparison-2026`)를 `reports.ts`뿐 아니라 `reports/index.astro`의 `reportMetaBySlug`에도 등록했는지 (누락 시 "기타" 카테고리로 표시되는 기존 버그 재발 방지)
- [ ] 1차 두 페이지의 related 링크에 2차 페이지가 추가됐는지
- [ ] `npm run build` 통과, 3개 라우트 전부 존재 확인

배포 전 `DEPLOY_CHECKLIST.md` 기준 최종 점검. 3차 페이지(`student-loan-repayment-calculator-2026`, `university-student-welfare-benefits-2026`)는 2차 완료 후 별도 설계 문서에서 다룬다.
