# 60대 이상 일자리 콘텐츠 클러스터 2026 — 설계 문서

> 기획 원본: [`docs/plan/202607/senior-job-content-cluster-2026-plan.md`](../../plan/202607/senior-job-content-cluster-2026-plan.md)
> 작성일: 2026-07-06
> 유형: 계산기 4개(`/tools/`, `SimpleToolShell`) + 비교 리포트 1개(`/reports/`, 정적)

---

## 0. 공통 설계 원칙

### 0-1. 컴포넌트 재사용 (실제 코드 확인 완료)

계산기 4개는 전부 `SimpleToolShell`(`src/components/SimpleToolShell.astro`) 패턴을 따른다. 실제 구현체(`basic-pension-eligibility-calculator.astro`)를 그대로 참고 기준으로 삼는다.

| 컴포넌트 | 역할 | 슬롯/Props |
|---|---|---|
| `BaseLayout.astro` | `<head>`, SEO, JSON-LD | `title`, `description`, `ogImage`, `jsonLd` |
| `SiteHeader.astro` | 전역 헤더 | — |
| `SimpleToolShell.astro` | 계산기 전체 레이아웃 | `calculatorId`, `pageClass`, `resultFirst` / 슬롯: `hero`, `actions`, `aside`, 기본(결과) |
| `CalculatorHero.astro` | Hero | `eyebrow`, `title`, `description`, `badges` |
| `InfoNotice.astro` | 면책 배너 | `title`, `lines: string[]` |
| `ToolActionBar.astro` | 초기화·링크복사 버튼 | `resetId`, `copyId` |
| `SeoContent.astro` | SEO 텍스트+FAQ+관련링크 | `introTitle`, `intro`, `inputPoints`, `criteria`, `faq`, `related` |

리포트 1개(`senior-job-comparison-2026`)는 계산기가 아니므로 `SimpleToolShell` 대신 기존 리포트 패턴(`report-page` + `<main>` 직접 구성, 예: `samsung-vs-skhynix-earnings-bonus-2026.astro`)을 따른다.

### 0-2. 전역 공유 UI 키트 (재사용, 재정의 금지)

`src/styles/scss/_legacy.scss`에 이미 정의된 `.panel`, `.panel-heading`, `.panel-heading__eyebrow`, `.form-grid`, `.field`, `.checkbox-option`, `.section-header`, `.action-bar`, `.button` 클래스를 그대로 쓴다. 각 페이지 SCSS 파일(`_<slug>.scss`)에는 페이지 고유 요소(KPI 그리드, 프리셋 버튼, 게이지, 카드 등)만 추가한다 — `_basic-pension-eligibility-calculator.scss`가 정확히 이 패턴.

### 0-3. 데이터·계산 로직 재사용 원칙

- **최저임금**: `src/data/minimumWage2026.ts`의 `MINIMUM_WAGE_2026`(10,320), `minimumWageMonthly`(2,156,880) — 5개 페이지 전부 import, 재정의 금지.
- **직업 마스터 데이터(`SeniorJobProfile[]`)**: `senior-job-salary-calculator-2026`의 데이터 파일에서 정의하고, `senior-job-comparison-2026`이 import해서 재사용. 두 곳에서 각각 만들지 않는다.
- **주휴수당 판정 로직**(주 15시간 기준, 근로기준법 제55조): 메인 계산기·경비 계산기·미화 계산기 3곳이 공통으로 쓴다 → `public/scripts/senior-job-shared.js`에 공용 함수로 분리해 3개 스크립트가 import.
- **TS(데이터 파일) ↔ JS(클라이언트 스크립트) 이중 구현 원칙**: 이 사이트 기존 패턴(`samsungVsSkhynixEarningsBonus2026.ts`의 `estimateHynixBonus`처럼)대로, 같은 계산 로직을 데이터 파일(TS, Astro SSR 초기값 렌더용)과 `public/scripts/*.js`(클라이언트 실시간 재계산용) 양쪽에 각각 구현한다. `public/scripts`는 빌드 없는 순수 JS라 TS 파일을 직접 import할 수 없기 때문 — 이는 버그가 아니라 기존 관례이며, 두 구현이 수치상 어긋나지 않도록 QA에서 반드시 교차 확인한다.

### 0-4. 입력 UX 패턴 (CODE_SKILL.md 기준 적용)

- 금액 입력에는 슬라이더 동기화 패턴 적용 (교육비, 희망 월급 등)
- 프리셋 선택은 `mode-chip` 라디오칩 패턴 적용 (직업 선택, 근무 형태 선택 등 — select보다 터치 친화적)
- 격일제/감시적 근로 승인 여부처럼 조건부 비활성화가 필요한 곳은 `mode-chip` 비활성화 패턴(`disable`, `opacity`, `pointerEvents`) 적용

### 0-5. URL 상태 저장

`public/scripts/url-state.js`의 `readParam`, `readBool`, `writeParams` 재사용 — 계산기 4개 모두 입력값을 URL 파라미터로 공유 가능하게 한다 (기존 계산기 컨벤션).

### 0-6. SEO 공통 규칙 (GOOGLE_SEO_RULES.md 기준, 필수 준수)

- `SeoContent`의 `intro` **5문단 이상, 800자 이상** — 5개 페이지 전부 발행 전 실측 확인 (이전 세션에서 site-wide 91% 미달 확인된 바 있으므로 이번 신규 페이지는 처음부터 기준 충족시켜 만든다)
- `faq` **5개 이상**
- `<Fragment slot="seo">` 안에 `SeoContent` 배치 필수
- URL 트레일링 슬래시 필수
- `changefreq`는 유효값만 (`monthly` 등, `quarterly` 금지)

---

## 1. 페이지 1 — `senior-job-salary-calculator-2026` (메인 계산기) ★ 클러스터 진입점

### 1-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/seniorJobSalaryCalculator2026.ts` |
| 도구 등록 | `src/data/tools.ts` |
| 페이지 | `src/pages/tools/senior-job-salary-calculator-2026.astro` |
| 스크립트 | `public/scripts/senior-job-salary-calculator-2026.js` |
| 공용 스크립트 | `public/scripts/senior-job-shared.js` (신규, 주휴수당 판정 로직) |
| 스타일 | `src/styles/scss/pages/_senior-job-salary-calculator-2026.scss` |

### 1-2. URL 및 메타

```
슬러그: /tools/senior-job-salary-calculator-2026/
타이틀(seoTitle): 60대 일자리 월급 계산기 2026 | 경비·미화·요양보호사 바로 계산
디스크립션: 나이·체력·희망 월수입 입력하면 맞는 일자리와 예상 월급 바로 계산. 경비·미화·요양보호사·주차관리 비교 포함.
```

### 1-3. 데이터 파일 설계

```ts
import { MINIMUM_WAGE_2026, minimumWageMonthly } from "./minimumWage2026";

// ── 타입 ──────────────────────────────────────────
export type PhysicalLoad = "LOW" | "MEDIUM" | "MEDIUM_HIGH" | "HIGH";
export type AgeBand = "60-64" | "65-69" | "70+";
export type PayBasis = "CALCULATED" | "GOVERNMENT_FIXED";

// 클러스터 공용 — senior-job-comparison-2026이 그대로 import해서 재사용
export interface SeniorJobProfile {
  jobCode: string;
  jobName: string;
  payBasis: PayBasis;
  hourlyWageDefault: number;          // 기본값 = MINIMUM_WAGE_2026
  dailyHoursPreset: number[];         // 예: [3, 4, 5, 8]
  weeklyDaysPreset: number[];         // 예: [3, 5, 6]
  prepPeriodDays: number;
  requiresCertificate: boolean;
  educationHours?: number;
  physicalLoad: PhysicalLoad;
  emotionalLoad: PhysicalLoad;
  nightShift: boolean;
  partTimeAvailable: boolean;
  recommendedAge: AgeBand[];
  tags: string[];
  sourceNote: string;                 // "2026 최저임금 기준 계산" | "정부24 공고 기준" 등
  detailHref?: string;                // 전용 계산기가 있으면 해당 슬러그 연결 (경비/미화)
}

export interface UserJobInput {
  ageBand: AgeBand;
  gender: "male" | "female" | "any";
  physicalCondition: "LOW" | "MEDIUM" | "HIGH";
  targetMonthlyPay: number;
  hasCertificate: boolean;
  dailyHours: number;
  canNightShift: boolean;
  okWithPeopleContact: boolean;
  canCareWork: boolean;
}

// ── META ──────────────────────────────────────────
export const SJSC_META = {
  slug: "senior-job-salary-calculator-2026",
  title: "60대 일자리 월급 계산기 2026",
  seoTitle: "60대 일자리 월급 계산기 2026 | 경비·미화·요양보호사 바로 계산",
  seoDescription:
    "나이·체력·희망 월수입 입력하면 맞는 일자리와 예상 월급 바로 계산. 경비·미화·요양보호사·주차관리 비교 포함.",
  updatedAt: "2026-07-06",
  dataNote:
    "이 계산 결과는 2026년 최저임금(시급 10,320원) 기준이며, 실제 채용 공고의 급여는 사업장·지역·경력에 따라 이 계산 결과보다 높거나 낮을 수 있습니다.",
};

// ── 직업 마스터 데이터 (클러스터 공용) ──────────────
export const SJSC_JOB_PROFILES: SeniorJobProfile[] = [
  {
    jobCode: "SECURITY_GUARD", jobName: "아파트 경비",
    payBasis: "CALCULATED", hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [24], weeklyDaysPreset: [15], // 격일제 특성상 전용 계산기로 연결
    prepPeriodDays: 7, requiresCertificate: false,
    physicalLoad: "MEDIUM", emotionalLoad: "HIGH",
    nightShift: true, partTimeAvailable: false,
    recommendedAge: ["60-64", "65-69"],
    tags: ["남성추천", "야간가능", "격일제"],
    sourceNote: "2026 최저임금 기준 계산 (격일제 상세는 전용 계산기 참고)",
    detailHref: "/tools/security-guard-salary-calculator-2026/",
  },
  {
    jobCode: "CLEANING", jobName: "건물 미화",
    payBasis: "CALCULATED", hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [3, 4, 5], weeklyDaysPreset: [5, 6],
    prepPeriodDays: 0, requiresCertificate: false,
    physicalLoad: "MEDIUM_HIGH", emotionalLoad: "LOW",
    nightShift: false, partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["여성추천", "오전근무", "즉시가능"],
    sourceNote: "2026 최저임금 기준 계산 (상세는 전용 계산기 참고)",
    detailHref: "/tools/cleaning-job-salary-calculator-2026/",
  },
  {
    jobCode: "CARE_WORKER", jobName: "요양보호사",
    payBasis: "CALCULATED", hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [4, 8], weeklyDaysPreset: [5, 6],
    prepPeriodDays: 60, requiresCertificate: true, educationHours: 320,
    physicalLoad: "HIGH", emotionalLoad: "HIGH",
    nightShift: true, partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69"],
    tags: ["자격증", "장기직업", "돌봄"],
    sourceNote: "2026 최저임금 기준 계산, 교육시간은 노인복지법 시행규칙 제29조의2 기준",
    detailHref: "/tools/caregiver-certificate-roi-calculator-2026/",
  },
  {
    jobCode: "PARKING", jobName: "주차관리",
    payBasis: "CALCULATED", hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [8, 12], weeklyDaysPreset: [5, 6],
    prepPeriodDays: 0, requiresCertificate: false,
    physicalLoad: "MEDIUM", emotionalLoad: "MEDIUM",
    nightShift: false, partTimeAvailable: false,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["즉시가능", "자격증불필요"],
    sourceNote: "2026 최저임금 기준 계산",
  },
  {
    jobCode: "SCHOOL_GUARD", jobName: "학교지킴이",
    payBasis: "CALCULATED", hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [4, 6], weeklyDaysPreset: [5],
    prepPeriodDays: 14, requiresCertificate: false,
    physicalLoad: "LOW", emotionalLoad: "MEDIUM",
    nightShift: false, partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["모집시기한정"],
    sourceNote: "2026 최저임금 기준 계산, 지자체 모집 공고 기준 시기 상이",
  },
];

// ── 정부 지원형 노인일자리 (별도 표, 계산기 입력값과 혼용 금지) ──
export const SJSC_GOVERNMENT_JOBS = [
  { typeName: "공공형", target: "만 65세 이상(기초연금 수급자 우선)", monthlyPay: 290_000, hoursNote: "일 3시간·월 30시간", sourceNote: "정부24 지자체 공고 기준" },
  { typeName: "사회서비스형", target: "만 60세 이상", monthlyPay: null, monthlyPayLabel: "월 59만~76만원대(지자체·유형별 차이)", hoursNote: "월 60시간 내외", sourceNote: "2026년 보도 종합, 정확한 금액은 노인일자리 여기(seniorro.or.kr) 확인" },
];

// ── 추천 스코어링 로직 ────────────────────────────
export function calculateJobScore(user: UserJobInput, job: SeniorJobProfile): number {
  let score = 0;
  if (job.hourlyWageDefault * 8 * 22 >= user.targetMonthlyPay) score += 30; else score -= 20;
  if (user.physicalCondition === "LOW" && (job.physicalLoad === "HIGH" || job.physicalLoad === "MEDIUM_HIGH")) score -= 30; else score += 20;
  if (job.requiresCertificate && !user.hasCertificate) score -= 15; else score += 10;
  if (job.nightShift && !user.canNightShift) score -= 20;
  if (job.partTimeAvailable && user.dailyHours <= 5) score += 15;
  if (job.jobCode === "CARE_WORKER" && user.canCareWork) score += 20;
  if (!job.recommendedAge.includes(user.ageBand)) score -= 10;
  return score;
}

// ── 월급 계산 (시급 × 시간 + 주휴수당, senior-job-shared.js 로직과 1:1 대응) ──
export function calcMonthlyPay(hourlyWage: number, dailyHours: number, weeklyDays: number) {
  const weeklyHours = dailyHours * weeklyDays;
  const monthlyHours = weeklyHours * 4.345; // 월 평균 주수
  const weeklyHolidayPay = weeklyHours >= 15 ? (weeklyHours / 40) * 8 * hourlyWage * 4.345 : 0;
  const basePay = hourlyWage * monthlyHours;
  return { monthlyHours, basePay, weeklyHolidayPay, total: basePay + weeklyHolidayPay };
}

export const SJSC_FAQ = [
  { question: "60대에 할 수 있는 일자리는 어떤 게 있나요?", answer: "경비, 건물 미화, 요양보호사, 주차관리, 학교지킴이 등이 대표적입니다. 체력과 자격증 여부에 따라 맞는 일자리가 달라집니다." },
  { question: "예상 월급은 어떻게 계산되나요?", answer: "2026년 최저임금(시급 10,320원)을 기준으로 입력한 근무시간·일수를 곱해 계산합니다. 실제 채용 공고의 급여와는 사업장별로 차이가 날 수 있습니다." },
  { question: "야간근무가 가능해야 하는 일자리는 뭔가요?", answer: "아파트 경비, 일부 요양보호사(방문요양 야간 포함) 등이 야간근무가 있을 수 있습니다." },
  { question: "자격증 없이 바로 시작할 수 있는 일자리는?", answer: "건물 미화, 주차관리는 별도 자격증 없이 시작할 수 있습니다. 경비는 일반경비원 신임교육이 필요할 수 있습니다." },
  { question: "65세 이상도 지원 가능한가요?", answer: "대부분의 민간 일자리는 연령 상한이 없지만, 노인일자리 공공형은 만 65세 이상, 사회서비스형은 만 60세 이상부터 신청 가능합니다." },
];

export const SJSC_RELATED_LINKS = [
  { href: "/reports/senior-job-comparison-2026/", label: "경비 vs 미화 vs 요양보호사 비교 리포트", description: "직업별 월급·준비기간·체력부담을 한 화면에서 비교합니다." },
  { href: "/tools/security-guard-salary-calculator-2026/", label: "아파트 경비 월급 계산기", description: "격일제·야간수당까지 반영한 상세 계산." },
  { href: "/tools/cleaning-job-salary-calculator-2026/", label: "건물 미화 월급 계산기", description: "오전 파트타임 근무 기준 상세 계산." },
  { href: "/tools/caregiver-certificate-roi-calculator-2026/", label: "요양보호사 자격증 투자비 회수 계산기", description: "자격증 교육비를 몇 개월 만에 회수하는지 계산." },
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기", description: "일자리와 함께 받을 수 있는 기초연금도 확인." },
  { href: "/tools/minimum-wage-2026/", label: "2026 최저임금 계산기", description: "이 계산기의 기준이 되는 최저임금 상세 확인." },
  { href: "/tools/unemployment-benefit-calculator/", label: "실업급여 계산기", description: "퇴직 후 재취업 준비 기간의 실업급여 확인." },
];
```

### 1-4. 페이지 IA

```
Hero (eyebrow: "60대 일자리 추천", title: SJSC_META.title)
InfoNotice (dataNote + "브라우저에서만 계산, 서버 전송 없음")
ToolActionBar (초기화/링크복사)

[aside] 프리셋 카드 5개 (직업 빠른 선택, mode-chip)
[aside] 입력 폼
  - 기본 정보: 나이대, 성별, 체력 상태
  - 근무 조건: 희망 월수입(슬라이더), 희망 근무시간, 야간근무 가능 여부
  - 특성: 자격증 여부, 사람 응대, 돌봄 업무 가능 여부

[본문] 결과 섹션 1: 추천 직업 TOP 3 카드 (KPI 그리드, 스코어 순 정렬)
[본문] 결과 섹션 2: 선택 직업 상세 계산 (기본급/주휴수당/합계 분해)
[본문] 결과 섹션 3: 정부 지원형 노인일자리 안내 (SJSC_GOVERNMENT_JOBS, "민간 계산값과는 별개" 명시)
[본문] 관련 계산기 CTA 그리드 (SJSC_RELATED_LINKS)

SeoContent (intro 5문단+, FAQ 5개+, related)
```

### 1-5. 스크립트 구조 (`senior-job-salary-calculator-2026.js`)

`basic-pension-eligibility-calculator.js`와 동일한 패턴:
```js
import { calcMonthlyPay, getWeeklyHolidayEligible } from "./senior-job-shared.js";

const root = document.querySelector(".sjsc-page");
const dataEl = document.getElementById("sjsc-data"); // SJSC_JOB_PROFILES JSON 주입
const state = { ageBand: "60-64", physicalCondition: "MEDIUM", targetMonthlyPay: 800000, /* ... */ };

function render() {
  const scored = jobs.map(j => ({ job: j, score: calculateJobScore(state, j) })).sort((a,b) => b.score - a.score);
  // TOP3 렌더, 선택 직업 상세 계산 렌더
}
```

### 1-6. `senior-job-shared.js` (신규 공용 모듈)

```js
export function getWeeklyHolidayEligible(weeklyHours) {
  return weeklyHours >= 15; // 근로기준법 제55조 기준
}

export function calcMonthlyPay(hourlyWage, dailyHours, weeklyDays) {
  const weeklyHours = dailyHours * weeklyDays;
  const monthlyHours = weeklyHours * 4.345;
  const weeklyHolidayPay = getWeeklyHolidayEligible(weeklyHours) ? (weeklyHours / 40) * 8 * hourlyWage * 4.345 : 0;
  const basePay = hourlyWage * monthlyHours;
  return { monthlyHours, basePay, weeklyHolidayPay, total: basePay + weeklyHolidayPay };
}
```
경비·미화 계산기(4, 5순위)가 이 모듈을 그대로 import — 로직 중복 금지.

---

## 2. 페이지 2 — `senior-job-comparison-2026` (비교 리포트)

### 2-1. 파일 목록

| 역할 | 경로 |
|---|---|
| 데이터 | `src/data/seniorJobComparison2026.ts` (`SJSC_JOB_PROFILES`, `SJSC_GOVERNMENT_JOBS` import) |
| 리포트 등록 | `src/data/reports.ts` |
| 페이지 | `src/pages/reports/senior-job-comparison-2026.astro` |
| 스크립트 | 없음 (정적 리포트) |
| 스타일 | `src/styles/scss/pages/_senior-job-comparison-2026.scss` |

### 2-2. URL 및 메타

```
슬러그: /reports/senior-job-comparison-2026/
타이틀: 경비 vs 미화 vs 요양보호사 2026 | 60대 일자리 월급 한눈에 비교
디스크립션: 경비·미화·요양보호사·주차관리·노인일자리 월급, 준비기간, 체력부담을 한 화면에서 비교합니다. 노인일자리 공공형·사회서비스형 지원금 비교 포함.
```

### 2-3. 데이터 파일 설계

```ts
import { SJSC_JOB_PROFILES, SJSC_GOVERNMENT_JOBS, calcMonthlyPay } from "./seniorJobSalaryCalculator2026";
export { SJSC_JOB_PROFILES, SJSC_GOVERNMENT_JOBS };

export const SJC_META = {
  slug: "senior-job-comparison-2026",
  title: "경비 vs 미화 vs 요양보호사 2026",
  seoTitle: "경비 vs 미화 vs 요양보호사 2026 | 60대 일자리 월급 한눈에 비교",
  seoDescription:
    "경비·미화·요양보호사·주차관리·노인일자리 월급, 준비기간, 체력부담을 한 화면에서 비교합니다. 노인일자리 공공형·사회서비스형 지원금 비교 포함.",
  updatedAt: "2026-07-06",
  dataNote:
    "민간 일자리(경비·미화·요양보호사·주차관리) 월급은 2026년 최저임금 기준 계산값이며 실제 채용 공고와 다를 수 있습니다. 노인일자리(공공형·사회서비스형)는 보건복지부·정부24 공고 기준 고정 지원금입니다. 두 성격의 숫자를 같은 기준으로 비교하지 않도록 표를 분리했습니다.",
};

// 계산 예시 프리셋 (하루 4시간·주 5일 공통 기준으로 계산해 표 비교 가능하게)
export const SJC_CALC_EXAMPLE = SJSC_JOB_PROFILES.map((job) => ({
  ...job,
  exampleCalc: calcMonthlyPay(job.hourlyWageDefault, job.dailyHoursPreset[0], job.weeklyDaysPreset[0] ?? 5),
}));

export const SJC_FAQ = [
  { question: "노인일자리 공공형과 사회서비스형은 뭐가 다른가요?", answer: "공공형은 만 65세 이상 기초연금 수급자 대상 봉사활동 성격(월 29만원), 사회서비스형은 만 60세 이상이 전문성을 활용하는 근로 성격(월 59만~76만원대)입니다." },
  { question: "노인일자리와 일반 알바 중 뭐가 나은가요?", answer: "소득 목적이면 민간 알바나 경비·미화가 유리하고, 소일거리·사회활동 목적이면 노인일자리 공공형이 부담이 적습니다." },
  { question: "경비·미화·요양보호사 중 준비 기간이 가장 짧은 건?", answer: "건물 미화가 자격증 없이 즉시 시작 가능해 가장 짧습니다. 경비는 며칠~1주, 요양보호사는 자격증 취득에 1~2개월 이상 걸립니다." },
  { question: "요양보호사가 다른 직업보다 월급이 높은 이유는?", answer: "자격증 취득 장벽이 있고 돌봄 노동의 강도가 높기 때문입니다. 장기 근무 시 안정적인 수요가 있다는 것도 특징입니다." },
  { question: "이 페이지 월급은 실제 채용 공고와 다를 수 있나요?", answer: "네. 민간 일자리 월급은 2026년 최저임금 기준 계산값이며, 실제 사업장은 지역·경력·수당에 따라 이보다 높거나 낮을 수 있습니다." },
];
```

### 2-4. 페이지 IA

```
Hero + InfoNotice (2-3의 dataNote — CALCULATED vs GOVERNMENT_FIXED 구분 명시)
섹션 1 — 민간 일자리 비교표 (경비/미화/요양보호사/주차관리/학교지킴이, 계산 예시 기준)
섹션 2 — 노인일자리 정부 지원형 비교 (공공형/사회서비스형, SJSC_GOVERNMENT_JOBS)
섹션 3 — 직업별 상세 카드 (장점/주의사항, 최소 3개: 경비/미화/요양보호사)
섹션 4 — 내부 CTA 그리드 (메인 계산기 + 경비/미화/자격증 계산기)
SeoContent (intro 5문단+, FAQ 5개+, related)
```

---

## 3. 페이지 3 — `caregiver-certificate-roi-calculator-2026`

### 3-1. 파일 목록 및 메타

```
데이터: src/data/caregiverCertificateRoiCalculator2026.ts
페이지: src/pages/tools/caregiver-certificate-roi-calculator-2026.astro
스크립트: public/scripts/caregiver-certificate-roi-calculator-2026.js
스타일: src/styles/scss/pages/_caregiver-certificate-roi-calculator-2026.scss

슬러그: /tools/caregiver-certificate-roi-calculator-2026/
타이틀: 요양보호사 자격증 계산기 2026 | 투자비 회수기간 바로 계산
디스크립션: 교육비·취득기간 입력하면 자격증 취득 후 몇 개월 만에 투자비를 회수하는지 바로 계산. 320시간 표준교육과정 기준 안내 포함.
```

### 3-2. 데이터 파일 설계

```ts
export type EducationTrack = "STANDARD" | "NURSE" | "LICENSED_50H";

export interface EducationTrackInfo {
  code: EducationTrack;
  label: string;
  hours: number;
  breakdown: string; // 예: "이론126 · 실기114 · 실습80"
}

export const CCRC_META = {
  slug: "caregiver-certificate-roi-calculator-2026",
  seoTitle: "요양보호사 자격증 계산기 2026 | 투자비 회수기간 바로 계산",
  seoDescription: "교육비·취득기간 입력하면 자격증 취득 후 몇 개월 만에 투자비를 회수하는지 바로 계산. 320시간 표준교육과정 기준 안내 포함.",
  dataNote:
    "표준교육 320시간(이론126·실기114·실습80)은 노인복지법 시행규칙 제29조의2·별표10의2 기준입니다. 국가자격(간호사 등) 소지자는 40~50시간 단축과정이 적용됩니다. 교육비·실제 소요기간은 교육기관마다 다르므로 이 계산은 자가 점검용입니다.",
};

export const CCRC_EDUCATION_TRACKS: EducationTrackInfo[] = [
  { code: "STANDARD", label: "일반 (자격 없음)", hours: 320, breakdown: "이론126 · 실기114 · 실습80" },
  { code: "NURSE", label: "간호사 소지자", hours: 40, breakdown: "이론26 · 실기6 · 실습8" },
  { code: "LICENSED_50H", label: "간호조무사·사회복지사·물리치료사·작업치료사 소지자", hours: 50, breakdown: "단축과정 50시간" },
];

export function calcRoi(input: {
  educationCost: number;
  dailyStudyHours: number;
  track: EducationTrack;
  expectedMonthlyPay: number;
  currentMonthlyPay: number;
}) {
  const trackInfo = CCRC_EDUCATION_TRACKS.find((t) => t.code === input.track)!;
  const studyDays = Math.ceil(trackInfo.hours / Math.max(input.dailyStudyHours, 1));
  const additionalMonthlyIncome = Math.max(input.expectedMonthlyPay - input.currentMonthlyPay, 0);
  const roiMonths = additionalMonthlyIncome > 0 ? input.educationCost / additionalMonthlyIncome : null;
  return { studyDays, additionalMonthlyIncome, roiMonths };
}

export const CCRC_FAQ = [
  { question: "요양보호사 교육은 꼭 320시간 다 들어야 하나요?", answer: "일반 응시자는 320시간(이론126·실기114·실습80)을 이수해야 합니다. 간호사·간호조무사 등 관련 국가자격 소지자는 40~50시간 단축과정이 적용됩니다." },
  { question: "간호조무사 자격이 있으면 얼마나 단축되나요?", answer: "간호조무사, 사회복지사, 물리치료사, 작업치료사는 50시간 단축과정으로 자격 취득이 가능합니다." },
  { question: "교육비는 지역마다 다른가요?", answer: "네. 교육기관·지역에 따라 교육비가 다르므로 실제 등록 전 여러 기관을 비교하는 것이 좋습니다." },
  { question: "자격증 취득 후 바로 취업할 수 있나요?", answer: "고령화로 요양보호사 수요가 꾸준한 편이라 자격증 취득 후 비교적 빠르게 취업하는 경우가 많지만, 지역·시설별 채용 상황에 따라 다릅니다." },
  { question: "방문요양과 요양원 중 월급 차이가 있나요?", answer: "근무 형태(시간제·상근직)와 시설 종류에 따라 다릅니다. 방문요양은 시간제가 많고, 요양원·재가센터는 상근직 비중이 높은 편입니다." },
];
```

### 3-3. 페이지 IA
```
Hero + InfoNotice (교육시간 법적 근거 + 교육비 편차 안내)
[aside] 입력 폼: 교육비(슬라이더), 하루 학습시간, 교육 트랙 선택(mode-chip 3종), 취득 후 예상 월급, 현재 월급
[본문] 결과: 회수 예상 개월 수 KPI, 예상 학습 소요일수, 월 추가수입
[본문] 교육 트랙 비교표 (CCRC_EDUCATION_TRACKS)
[본문] CTA: 메인 계산기, 비교 리포트, 장기요양등급 계산기(같은 돌봄 생태계)
SeoContent
```

---

## 4. 페이지 4 — `security-guard-salary-calculator-2026`

### 4-1. 파일 목록 및 메타

```
데이터: src/data/securityGuardSalaryCalculator2026.ts
페이지: src/pages/tools/security-guard-salary-calculator-2026.astro
스크립트: public/scripts/security-guard-salary-calculator-2026.js (senior-job-shared.js import)
스타일: src/styles/scss/pages/_security-guard-salary-calculator-2026.scss

슬러그: /tools/security-guard-salary-calculator-2026/
타이틀: 아파트 경비 월급 계산기 2026 | 격일제 실수령액 바로 계산
디스크립션: 격일제·야간근무 조건 입력하면 아파트 경비 예상 월급과 실수령액 바로 계산. 2026 최저임금·4대보험 공제 반영.
```

### 4-2. 데이터 파일 설계

```ts
import { MINIMUM_WAGE_2026 } from "./minimumWage2026";

export type WorkPattern = "ALTERNATE_DAY" | "THREE_SHIFT" | "DAILY";

export const SGSC_META = {
  slug: "security-guard-salary-calculator-2026",
  seoTitle: "아파트 경비 월급 계산기 2026 | 격일제 실수령액 바로 계산",
  seoDescription: "격일제·야간근무 조건 입력하면 아파트 경비 예상 월급과 실수령액 바로 계산. 2026 최저임금·4대보험 공제 반영.",
  dataNote:
    "이 계산은 2026년 최저임금(시급 10,320원) 기준이며, 감시적 근로자로 승인된 사업장은 야간근로수당·연장근로수당이 면제될 수 있습니다. 실제 근로계약서·사업장 승인 여부를 확인하세요.",
};

export const SGSC_WORK_PATTERNS: Record<WorkPattern, { label: string; hoursPerCycle: number; cycleDays: number }> = {
  ALTERNATE_DAY: { label: "격일제 (24시간 근무-24시간 휴무)", hoursPerCycle: 24, cycleDays: 2 },
  THREE_SHIFT: { label: "3교대", hoursPerCycle: 8, cycleDays: 1 },
  DAILY: { label: "매일 근무 (주 5일)", hoursPerCycle: 8, cycleDays: 1 },
};

// 야간근로수당 가산율 (근로기준법 제56조 — 22시~06시 통상임금의 50% 가산)
export const NIGHT_SHIFT_PREMIUM_RATE = 0.5;
export const NIGHT_SHIFT_HOURS = 8; // 22시~06시

export function calcSecurityGuardPay(input: {
  pattern: WorkPattern;
  hourlyWage: number;
  includeNightShift: boolean;
  isMonitoringApproved: boolean; // 감시적 근로자 승인 여부
  applyInsurance: boolean;
}) {
  const p = SGSC_WORK_PATTERNS[input.pattern];
  const cyclesPerMonth = 30 / p.cycleDays;
  const monthlyHours = p.hoursPerCycle * cyclesPerMonth;
  const basePay = input.hourlyWage * monthlyHours;
  const nightPremium =
    input.includeNightShift && !input.isMonitoringApproved
      ? input.hourlyWage * NIGHT_SHIFT_PREMIUM_RATE * NIGHT_SHIFT_HOURS * cyclesPerMonth
      : 0;
  const grossPay = basePay + nightPremium;
  // 4대보험 근로자 부담분 근사치(국민연금4.5%+건강보험3.545%+장기요양+고용보험0.9% 등, 상세는 4대보험 계산기로 유도)
  const insuranceDeduction = input.applyInsurance ? grossPay * 0.093 : 0;
  return { monthlyHours, basePay, nightPremium, grossPay, netPay: grossPay - insuranceDeduction };
}

export const SGSC_FAQ = [
  { question: "경비원은 왜 격일제로 일하나요?", answer: "24시간 상주가 필요한 특성상 격일제(24시간 근무-24시간 휴무)가 일반적입니다. 3교대나 매일 근무 사업장도 있습니다." },
  { question: "감시적 근로자 승인이 뭔가요?", answer: "고용노동부 승인을 받은 감시적·단속적 근로자는 야간근로수당·연장근로수당 적용이 면제될 수 있습니다. 근로계약서에서 승인 여부를 확인해야 합니다." },
  { question: "경비원도 4대보험 가입하나요?", answer: "네, 일반적으로 4대보험 가입 대상입니다. 정확한 공제액은 4대보험 계산기에서 확인하세요." },
  { question: "경비원 자격증이 따로 있나요?", answer: "법적 자격증은 아니지만 일반경비원 신임교육(24시간)을 이수해야 하는 사업장이 많습니다." },
  { question: "아파트 경비와 상가 경비는 월급이 다른가요?", answer: "근무 강도·민원 빈도·계약 형태가 달라 사업장마다 차이가 있습니다. 이 계산기는 공통 최저임금 기준으로 예시를 제공합니다." },
];
```

### 4-3. 페이지 IA
```
Hero + InfoNotice
[aside] 입력: 근무형태(mode-chip 3종), 시급(슬라이더, 기본 10,320원), 야간포함 여부(체크), 감시적근로 승인 여부(체크, 야간수당 토글에 영향), 4대보험 적용 여부(체크)
[본문] 결과 KPI: 월 근무시간, 기본급, 야간수당, 세전 합계, 4대보험 공제 후 실수령
[본문] 격일제 근무 이해 카드 (24시간 근무 구조 설명)
[본문] CTA: 메인 계산기, 4대보험 계산기, 야간·연장수당 계산기(overtime-pay-calculator)
SeoContent
```

---

## 5. 페이지 5 — `cleaning-job-salary-calculator-2026`

### 5-1. 파일 목록 및 메타

```
데이터: src/data/cleaningJobSalaryCalculator2026.ts
페이지: src/pages/tools/cleaning-job-salary-calculator-2026.astro
스크립트: public/scripts/cleaning-job-salary-calculator-2026.js (senior-job-shared.js import)
스타일: src/styles/scss/pages/_cleaning-job-salary-calculator-2026.scss

슬러그: /tools/cleaning-job-salary-calculator-2026/
타이틀: 건물 미화 월급 계산기 2026 | 파트타임 실수령액 바로 계산
디스크립션: 하루 근무시간·주 근무일수 입력하면 건물 미화 파트타임 예상 월급 바로 계산. 주휴수당 적용 여부 포함.
```

### 5-2. 데이터 파일 설계

```ts
import { MINIMUM_WAGE_2026 } from "./minimumWage2026";
import { calcMonthlyPay } from "./seniorJobSalaryCalculator2026"; // TS↔TS 재사용, SSR 초기값 계산용

export const CJSC_META = {
  slug: "cleaning-job-salary-calculator-2026",
  seoTitle: "건물 미화 월급 계산기 2026 | 파트타임 실수령액 바로 계산",
  seoDescription: "하루 근무시간·주 근무일수 입력하면 건물 미화 파트타임 예상 월급 바로 계산. 주휴수당 적용 여부 포함.",
  dataNote:
    "이 계산은 2026년 최저임금(시급 10,320원) 기준이며, 주 15시간 이상 근무 시 주휴수당(근로기준법 제55조)이 자동 반영됩니다. 용역업체 소속인 경우 4대보험 적용 여부를 계약 시 확인하세요.",
};

export const CJSC_PRESET_HOURS = [3, 4, 5]; // 오전 파트타임 흔한 패턴
export const CJSC_PRESET_DAYS = [3, 5, 6];

export const CJSC_FAQ = [
  { question: "하루 3시간만 일해도 주휴수당 받나요?", answer: "주 소정근로시간이 15시간 이상이면 주휴수당 대상입니다. 하루 3시간씩 주 5일이면 주 15시간이라 대상이 됩니다." },
  { question: "오전 파트타임 미화 일자리는 시급이 다른가요?", answer: "이 계산기는 2026년 최저임금을 기본값으로 제공하며, 실제 사업장은 이보다 높은 시급을 책정하기도 합니다." },
  { question: "용역업체 소속이면 4대보험은 어떻게 되나요?", answer: "용역업체 소속 근로자도 근로시간 요건을 충족하면 4대보험 가입 대상입니다. 계약서에서 확인이 필요합니다." },
  { question: "아파트 미화와 오피스 미화는 다른가요?", answer: "근무 범위(계단·복도·화장실 포함 여부)와 시간대가 다를 수 있어 실제 채용 공고에서 업무 범위를 확인하는 것이 중요합니다." },
  { question: "나이 제한이 있나요?", answer: "법적 상한은 없지만 사업장별로 체력을 고려한 채용 기준이 있을 수 있습니다." },
];
```

### 5-3. 페이지 IA
```
Hero + InfoNotice
[aside] 입력: 하루 근무시간(프리셋 3/4/5 + 자유입력), 주 근무일수(프리셋), 시급(기본 10,320원)
[본문] 결과 KPI: 주 근무시간, 주휴수당 적용 여부(자동 판정 배지), 월 예상 세전
[본문] "왜 주 15시간이 기준인가" 설명 카드 (근로기준법 제55조 인용)
[본문] CTA: 메인 계산기, 경비 계산기, 비교 리포트
SeoContent
```

---

## 6. 클러스터 전체 내부 링크 맵

### 6-1. 클러스터 내부 (5페이지 상호 연결)

```
senior-job-salary-calculator-2026 (허브)
 ├─→ senior-job-comparison-2026
 ├─→ security-guard-salary-calculator-2026
 ├─→ cleaning-job-salary-calculator-2026
 └─→ caregiver-certificate-roi-calculator-2026

senior-job-comparison-2026 (허브)
 └─→ 위 4개 계산기 전부

나머지 3개 계산기 → 메인 계산기 + 비교 리포트로 역링크
```

### 6-2. 기존 사이트 콘텐츠와의 연결 (신규 확인된 관련 페이지)

| 클러스터 페이지 | 연결할 기존 페이지 | 연결 이유 |
|---|---|---|
| 메인 계산기 | `/tools/basic-pension-eligibility-calculator/` | 같은 60대+ 타겟, 일자리+연금 동시 고려 |
| 메인 계산기 | `/tools/minimum-wage-2026/`, `/tools/minimum-wage-2027/` | 계산 기준값 직접 연결 |
| 메인 계산기 | `/tools/unemployment-benefit-calculator/` | 퇴직 후 재취업 준비 동선 |
| 경비 계산기 | `/tools/four-insurance-calculator/` | 4대보험 공제액 상세 계산 유도 |
| 경비 계산기 | `/tools/overtime-pay-calculator/` | 야간·연장수당 상세 로직 참고 |
| 자격증 ROI 계산기 | `/tools/ltci-grade-benefit-calculator-2026/` | 돌봄 받는 쪽(장기요양등급) ↔ 돌봄 제공하는 쪽(요양보호사) 자연 연결 |
| 자격증 ROI 계산기 | `/reports/nursing-home-vs-home-care-cost-2026/` | 요양보호사 근무처(재가요양·요양원) 비교 리포트 연결 |
| 비교 리포트 | `/tools/work-incentive-calculator/` | 저소득 근로자 대상 근로장려금, 60대 파트타임과 겹치는 대상 |

---

## 7. 등록 체크리스트 (5페이지 전체)

### 7-1. `tools.ts` (4건 추가, order 71~71.3)

```ts
{ slug: "senior-job-salary-calculator-2026", title: "60대 일자리 월급 계산기 2026", order: 71, category: "support", ... },
{ slug: "caregiver-certificate-roi-calculator-2026", title: "요양보호사 자격증 계산기 2026", order: 71.1, category: "support", ... },
{ slug: "security-guard-salary-calculator-2026", title: "아파트 경비 월급 계산기 2026", order: 71.2, category: "salary", ... },
{ slug: "cleaning-job-salary-calculator-2026", title: "건물 미화 월급 계산기 2026", order: 71.3, category: "salary", ... },
```

### 7-2. `reports.ts` (1건 추가, order 67)

```ts
{ slug: "senior-job-comparison-2026", title: "경비 vs 미화 vs 요양보호사 2026 | 60대 일자리 월급 한눈에 비교", order: 67, badges: ["60대 일자리", "경비", "미화", "요양보호사", "2026"] },
```

### 7-3. `index.astro` `reportMetaBySlug` (리포트 1건만 해당, 필수 — 누락 시 "기타" 표시)

```ts
"senior-job-comparison-2026": { category: "support", isNew: true },
```

### 7-4. `app.scss` (5건 import)

```scss
@use 'scss/pages/senior-job-salary-calculator-2026';
@use 'scss/pages/senior-job-comparison-2026';
@use 'scss/pages/caregiver-certificate-roi-calculator-2026';
@use 'scss/pages/security-guard-salary-calculator-2026';
@use 'scss/pages/cleaning-job-salary-calculator-2026';
```

### 7-5. `sitemap.xml` (5건 추가)

```xml
<url><loc>https://bigyocalc.com/tools/senior-job-salary-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/reports/senior-job-comparison-2026/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://bigyocalc.com/tools/caregiver-certificate-roi-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>
<url><loc>https://bigyocalc.com/tools/security-guard-salary-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>
<url><loc>https://bigyocalc.com/tools/cleaning-job-salary-calculator-2026/</loc><changefreq>monthly</changefreq><priority>0.75</priority></url>
```

---

## 8. 개발 순서 및 QA 체크리스트

### 8-1. 개발 순서
1. `senior-job-shared.js` 공용 모듈 먼저 작성 (경비·미화·메인 계산기가 공유)
2. `senior-job-salary-calculator-2026` (메인, `SJSC_JOB_PROFILES` 마스터 데이터 포함)
3. `senior-job-comparison-2026` (메인의 마스터 데이터 재사용)
4. `caregiver-certificate-roi-calculator-2026`
5. `security-guard-salary-calculator-2026`
6. `cleaning-job-salary-calculator-2026`

### 8-2. 공통 QA
- [ ] 5개 페이지 전부 SeoContent intro 5문단·800자 이상, FAQ 5개 이상 (발행 전 실측)
- [ ] `MINIMUM_WAGE_2026`을 5개 페이지가 동일 참조 (하드코딩 금지)
- [ ] 민간 계산값(`CALCULATED`)과 정부 고정 지원금(`GOVERNMENT_FIXED`)을 표에서 섞어 비교하지 않기
- [ ] `senior-job-shared.js`의 주휴수당 로직을 메인/경비/미화 3곳이 동일하게 참조
- [ ] 감시적 근로자 승인 토글 시 야간수당 계산이 실제로 0으로 바뀌는지 (경비 계산기)
- [ ] 모바일에서 입력 폼이 첫 화면 가까이 오는지 (CODE_SKILL.md 반응형 기준)
- [ ] 클러스터 내부 링크 5페이지 상호 연결 전부 작동
- [ ] 기존 사이트 콘텐츠(기초연금·4대보험·실업급여·장기요양등급 등) CTA 링크 작동
- [ ] `npm run build` 통과, 5개 라우트 전부 존재 확인
- [ ] `reportMetaBySlug`에 `senior-job-comparison-2026` 등록 확인 (누락 시 "기타" 표시 사고 방지)
