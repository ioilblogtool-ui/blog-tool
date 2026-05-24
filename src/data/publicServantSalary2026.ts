// ============================================================
// 2026 공무원 9급 연봉·실수령액 완전 가이드
// 기본급: 인사혁신처 공무원보수규정 별표 3 (2026.1.2 개정)
// 세후 추정: 미혼·부양가족 없음 기준 (공무원연금 9% + 건강보험 3.545% + 장기요양 + 소득세)
// ============================================================

export interface HobongRow {
  no: number;
  monthlyBase: number;       // 원 단위 기본급
  isOfficial: boolean;       // 인사혁신처 공식 확인 여부
  monthlyNetEstimate: number; // 세후 추정 (미혼·부양가족 없음, 직급보조비+급식비 포함)
}

export interface GradeData {
  id: "9" | "8" | "7";
  name: string;
  jobGradeSupport: number;  // 직급보조비 (원)
  maxHobong: number;
  hobong: HobongRow[];
}

export interface Allowance {
  name: string;
  amountLabel: string;
  note: string;
  basis: string;
  type: "fixed" | "variable" | "annual";
}

export interface RaiseHistoryItem {
  year: number;
  ratePercent: number;
  noteLabel?: string;
}

export interface CareerMilestone {
  label: string;
  grade: string;
  hobong: number;
  monthlyBase: number;
  estimatedNetMonth: number;
  basis: "추정";
}

export interface CompareItem {
  category: string;
  publicServant: string;
  bigCorp: string;
  smeCorp: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ── Meta ──────────────────────────────────────────────────────
export const PSS_META = {
  title: "2026 공무원 9급 연봉·실수령액 완전 가이드 — 호봉별 월급 계산기 | 비교계산소",
  description:
    "2026년 공무원 9급 1호봉 초봉부터 30호봉까지 호봉별 기본급, 수당, 실수령액을 한눈에 확인하세요. 직급보조비·급식비·연금 공제까지 반영한 실수령액 계산기 제공.",
} as const;

// ── Hero 핵심 수치 ────────────────────────────────────────────
export const PSS_HERO_STATS = {
  raiseRateAll: "3.5%",
  raiseRateLow: "6.6%",
  entry1HobongBase: 2_133_000,
  hobong30Base: 3_480_000,
  mealAllowance: 160_000,
  jobGradeSupport9: 135_000,
} as const;

// ── 공제 요율 (공식) ─────────────────────────────────────────
export const PSS_DEDUCTION_RATES = {
  pension: 0.09,
  healthInsurance: 0.03545,
  longTermCare: 0.1295,
} as const;

// ── 정액급식비 ───────────────────────────────────────────────
export const MEAL_ALLOWANCE = 160_000;

// ── 9급 전체 호봉표 ──────────────────────────────────────────
// 1·2·3·10·15·20·30호봉: 공식 (인사혁신처 2026.1.2 기준)
// 나머지: 공식 앵커값 사이 선형 보간 추정
export const GRADE_9_HOBONG: HobongRow[] = [
  { no: 1,  monthlyBase: 2_133_000, isOfficial: true,  monthlyNetEstimate: 2_060_000 },
  { no: 2,  monthlyBase: 2_193_000, isOfficial: true,  monthlyNetEstimate: 2_096_000 },
  { no: 3,  monthlyBase: 2_258_000, isOfficial: true,  monthlyNetEstimate: 2_135_000 },
  { no: 4,  monthlyBase: 2_301_000, isOfficial: false, monthlyNetEstimate: 2_161_000 },
  { no: 5,  monthlyBase: 2_344_000, isOfficial: false, monthlyNetEstimate: 2_214_000 },
  { no: 6,  monthlyBase: 2_387_000, isOfficial: false, monthlyNetEstimate: 2_240_000 },
  { no: 7,  monthlyBase: 2_430_000, isOfficial: false, monthlyNetEstimate: 2_267_000 },
  { no: 8,  monthlyBase: 2_473_000, isOfficial: false, monthlyNetEstimate: 2_293_000 },
  { no: 9,  monthlyBase: 2_516_000, isOfficial: false, monthlyNetEstimate: 2_319_000 },
  { no: 10, monthlyBase: 2_558_000, isOfficial: true,  monthlyNetEstimate: 2_370_000 },
  { no: 11, monthlyBase: 2_607_000, isOfficial: false, monthlyNetEstimate: 2_400_000 },
  { no: 12, monthlyBase: 2_656_000, isOfficial: false, monthlyNetEstimate: 2_430_000 },
  { no: 13, monthlyBase: 2_706_000, isOfficial: false, monthlyNetEstimate: 2_460_000 },
  { no: 14, monthlyBase: 2_756_000, isOfficial: false, monthlyNetEstimate: 2_490_000 },
  { no: 15, monthlyBase: 2_805_000, isOfficial: true,  monthlyNetEstimate: 2_550_000 },
  { no: 16, monthlyBase: 2_864_000, isOfficial: false, monthlyNetEstimate: 2_585_000 },
  { no: 17, monthlyBase: 2_923_000, isOfficial: false, monthlyNetEstimate: 2_620_000 },
  { no: 18, monthlyBase: 2_982_000, isOfficial: false, monthlyNetEstimate: 2_655_000 },
  { no: 19, monthlyBase: 3_041_000, isOfficial: false, monthlyNetEstimate: 2_700_000 },
  { no: 20, monthlyBase: 3_100_000, isOfficial: true,  monthlyNetEstimate: 2_765_000 },
  { no: 21, monthlyBase: 3_138_000, isOfficial: false, monthlyNetEstimate: 2_788_000 },
  { no: 22, monthlyBase: 3_176_000, isOfficial: false, monthlyNetEstimate: 2_811_000 },
  { no: 23, monthlyBase: 3_214_000, isOfficial: false, monthlyNetEstimate: 2_834_000 },
  { no: 24, monthlyBase: 3_252_000, isOfficial: false, monthlyNetEstimate: 2_857_000 },
  { no: 25, monthlyBase: 3_290_000, isOfficial: false, monthlyNetEstimate: 2_880_000 },
  { no: 26, monthlyBase: 3_328_000, isOfficial: false, monthlyNetEstimate: 2_903_000 },
  { no: 27, monthlyBase: 3_366_000, isOfficial: false, monthlyNetEstimate: 2_926_000 },
  { no: 28, monthlyBase: 3_404_000, isOfficial: false, monthlyNetEstimate: 2_949_000 },
  { no: 29, monthlyBase: 3_442_000, isOfficial: false, monthlyNetEstimate: 2_972_000 },
  { no: 30, monthlyBase: 3_480_000, isOfficial: true,  monthlyNetEstimate: 3_043_000 },
];

// ── 8급 봉급표 (추정) ────────────────────────────────────────
export const GRADE_8_HOBONG: HobongRow[] = Array.from({ length: 30 }, (_, i) => ({
  no: i + 1,
  monthlyBase: 2_209_000 + 44_000 * i,
  isOfficial: false,
  monthlyNetEstimate: Math.round((2_209_000 + 44_000 * i) * 0.935 + 170_000),
}));

// ── 7급 봉급표 (추정) ────────────────────────────────────────
export const GRADE_7_HOBONG: HobongRow[] = Array.from({ length: 30 }, (_, i) => ({
  no: i + 1,
  monthlyBase: 2_320_000 + 50_000 * i,
  isOfficial: false,
  monthlyNetEstimate: Math.round((2_320_000 + 50_000 * i) * 0.925 + 170_000),
}));

// ── 직급별 통합 데이터 ────────────────────────────────────────
export const PSS_GRADES: GradeData[] = [
  {
    id: "9",
    name: "9급",
    jobGradeSupport: 135_000,
    maxHobong: 30,
    hobong: GRADE_9_HOBONG,
  },
  {
    id: "8",
    name: "8급",
    jobGradeSupport: 155_000,
    maxHobong: 30,
    hobong: GRADE_8_HOBONG,
  },
  {
    id: "7",
    name: "7급",
    jobGradeSupport: 175_000,
    maxHobong: 30,
    hobong: GRADE_7_HOBONG,
  },
];

// ── 대표 구간 (요약 테이블용) ─────────────────────────────────
export const PSS_SUMMARY_HOBONG = [1, 5, 10, 15, 20, 30].map(
  (n) => GRADE_9_HOBONG.find((h) => h.no === n)!,
);

// ── 수당 구조 ────────────────────────────────────────────────
export const PSS_ALLOWANCES: Allowance[] = [
  // 고정 수당
  {
    name: "직급보조비",
    amountLabel: "9급 13.5만 원 · 8급 15.5만 원 · 7급 17.5만 원",
    note: "매월 고정 지급",
    basis: "공무원수당 등에 관한 규정 제14조의2",
    type: "fixed",
  },
  {
    name: "정액급식비",
    amountLabel: "월 16만 원",
    note: "2026년 2만 원 인상 (기존 14만 원 → 16만 원)",
    basis: "공무원수당 등에 관한 규정 제19조",
    type: "fixed",
  },
  {
    name: "가족수당",
    amountLabel: "배우자 4만 원 + 자녀 1인당 2만 원",
    note: "부양 가족 존재 시 지급",
    basis: "공무원수당 등에 관한 규정 제10조",
    type: "fixed",
  },
  {
    name: "민원업무수당",
    amountLabel: "월 3만 원",
    note: "2026년 신설. 민원 창구 담당 직원 한정",
    basis: "공무원수당 등에 관한 규정 제14조의6 (2026 신설)",
    type: "fixed",
  },
  // 변동 수당
  {
    name: "시간외근무수당",
    amountLabel: "시간당 기본급 × 1.5배 (월 최대 57시간 인정)",
    note: "실제 초과근무 시간 기준. 기관·업무별 편차 큼",
    basis: "공무원수당 등에 관한 규정 제15조",
    type: "variable",
  },
  {
    name: "정근수당",
    amountLabel: "1년 이상: 기본급 × 5~50% (근속 비례)",
    note: "연 2회 지급 (1월·7월). 근무연수 5년 초과 시 최대 50%",
    basis: "공무원수당 등에 관한 규정 제7조",
    type: "variable",
  },
  {
    name: "정근수당가산금",
    amountLabel: "5년~: 월 5만 원 / 10년~: 10만 원 / 15년~: 15만 원",
    note: "매월 고정 지급. 근속연수 도달 시 자동 적용",
    basis: "공무원수당 등에 관한 규정 제7조의2",
    type: "variable",
  },
  {
    name: "특수업무수당",
    amountLabel: "직무·기관별 상이 (월 수만 원~수십만 원)",
    note: "교정직·방호직·세무직 등 직무 특성에 따라 지급",
    basis: "공무원수당 등에 관한 규정 별표 12~14",
    type: "variable",
  },
  // 연간 특별 지급
  {
    name: "명절휴가비",
    amountLabel: "설·추석 각 기본급 × 60%",
    note: "연 2회 지급. 기준일 재직자 대상",
    basis: "공무원수당 등에 관한 규정 제18조의2",
    type: "annual",
  },
  {
    name: "연가보상비",
    amountLabel: "1일당 기본급 ÷ 30",
    note: "미사용 연가 일수에 따라 지급. 연 최대 20일",
    basis: "공무원수당 등에 관한 규정 제18조의3",
    type: "annual",
  },
  {
    name: "성과상여금",
    amountLabel: "기본급 × 0%~172.5% (등급별 상이)",
    note: "S·A·B·C등급 구분. 기관·직급별로 기준 상이",
    basis: "공무원수당 등에 관한 규정 제7조의2",
    type: "annual",
  },
];

// ── 봉급 인상률 추이 ─────────────────────────────────────────
export const PSS_RAISE_HISTORY: RaiseHistoryItem[] = [
  { year: 2017, ratePercent: 3.5 },
  { year: 2018, ratePercent: 2.6 },
  { year: 2019, ratePercent: 1.8 },
  { year: 2020, ratePercent: 2.8 },
  { year: 2021, ratePercent: 0.9, noteLabel: "코로나" },
  { year: 2022, ratePercent: 1.4 },
  { year: 2023, ratePercent: 1.7 },
  { year: 2024, ratePercent: 2.5 },
  { year: 2025, ratePercent: 3.3, noteLabel: "저직급 6.0%" },
  { year: 2026, ratePercent: 3.5, noteLabel: "저직급 6.6%" },
];

// ── 20년 커리어 시뮬레이션 ───────────────────────────────────
// 기준: 미혼, 부양가족 없음, 매년 1호봉 승급, 5년차 8급·10년차 7급 자동 추정
export const PSS_CAREER_MILESTONES: CareerMilestone[] = [
  { label: "신규 임용",  grade: "9급",  hobong: 1,  monthlyBase: 2_133_000, estimatedNetMonth: 2_060_000, basis: "추정" },
  { label: "3년차",     grade: "9급",  hobong: 3,  monthlyBase: 2_258_000, estimatedNetMonth: 2_135_000, basis: "추정" },
  { label: "5년차",     grade: "9급",  hobong: 5,  monthlyBase: 2_344_000, estimatedNetMonth: 2_214_000, basis: "추정" },
  { label: "8년차",     grade: "8급",  hobong: 3,  monthlyBase: 2_297_000, estimatedNetMonth: 2_220_000, basis: "추정" },
  { label: "12년차",    grade: "7급",  hobong: 3,  monthlyBase: 2_420_000, estimatedNetMonth: 2_320_000, basis: "추정" },
  { label: "20년차",    grade: "6급",  hobong: 10, monthlyBase: 2_900_000, estimatedNetMonth: 2_680_000, basis: "추정" },
];

// ── 민간 vs 공무원 비교 ──────────────────────────────────────
export const PSS_COMPARE: CompareItem[] = [
  { category: "신규 초봉",     publicServant: "213만 원/월 (9급 1호봉)", bigCorp: "300~400만 원/월",    smeCorp: "180~250만 원/월" },
  { category: "정년",          publicServant: "60세 법정 정년 보장",     bigCorp: "사실상 50대 초반",   smeCorp: "실질 정년 불확실" },
  { category: "연금",          publicServant: "공무원연금 (유리한 구조)", bigCorp: "국민연금",           smeCorp: "국민연금" },
  { category: "고용 안정성",   publicServant: "매우 높음",               bigCorp: "중간~높음",          smeCorp: "낮음~중간" },
  { category: "육아휴직",      publicServant: "1~3년 (유연한 사용)",     bigCorp: "사용 가능 (편차)",   smeCorp: "사용 어려운 경우 多" },
  { category: "성과급·보너스", publicServant: "성과상여금 제한적",        bigCorp: "PS·PI 등 고액 가능", smeCorp: "명절 상여 수준" },
  { category: "워라밸",        publicServant: "높음 (기관별 편차)",       bigCorp: "중간 (직무별)",      smeCorp: "낮음~중간" },
];

// ── FAQ ──────────────────────────────────────────────────────
export const PSS_FAQ: FaqItem[] = [
  {
    q: "9급 공무원 첫 달 월급(세후)은 얼마인가요?",
    a: "2026년 기준 9급 1호봉 기본급은 2,133,000원입니다. 직급보조비(13.5만원)·정액급식비(16만원)를 더한 총지급액은 약 242만 원이며, 공무원연금·건강보험·소득세 등 공제 후 세후 실수령액은 미혼·부양가족 없음 기준으로 약 206만 원 수준입니다. 가족수당·초과근무수당이 추가되면 더 높아집니다.",
  },
  {
    q: "호봉은 어떻게 올라가나요?",
    a: "공무원은 원칙적으로 1년에 1호봉씩 자동 승급합니다. 다만 징계·병가·육아휴직 기간은 호봉 산정에서 일부 제외될 수 있습니다. 군 복무 경력·민간 경력 등 인정 경력에 따라 초임 호봉이 1호봉 이상 시작할 수 있습니다.",
  },
  {
    q: "공무원 연금은 얼마나 공제되나요?",
    a: "2026년 기준 공무원연금 기여금은 기본급(본봉)의 9%입니다. 9급 1호봉 기준 월 191,970원이 공제됩니다. 국민연금(4.5%)보다 공제율이 높지만, 퇴직 후 수령액도 국민연금보다 유리한 구조입니다.",
  },
  {
    q: "지방직과 국가직 급여 차이가 있나요?",
    a: "기본급(봉급)은 동일한 공무원보수규정이 적용되어 차이가 없습니다. 다만 지역수당·특수지 근무수당은 근무 지역에 따라 다르며, 일부 지방자치단체는 자체 복리후생비를 추가 지급하는 경우가 있습니다.",
  },
  {
    q: "수습 기간 월급은 어떻게 되나요?",
    a: "공무원 수습 기간(통상 6개월~1년) 중에는 봉급의 80%만 지급됩니다. 수습 완료 후 정규 임용되면 100% 지급됩니다. 정근수당 등 일부 수당도 수습 기간은 산정 제외 또는 축소 지급될 수 있습니다.",
  },
  {
    q: "성과상여금은 얼마나 받나요?",
    a: "성과상여금은 개인 평가 등급(S·A·B·C)에 따라 기본급의 0%~172.5% 범위에서 지급됩니다. 9급 1호봉 기준 S등급이면 연 약 367만 원, C등급이면 미지급입니다. 기관별·직렬별 지급 기준이 다르며, 매년 1~2회 지급됩니다.",
  },
  {
    q: "공무원 연봉은 매년 오르나요?",
    a: "호봉 승급(연 1회)과 봉급 인상률(정부 고시) 두 가지로 오릅니다. 2026년 전체 인상률은 3.5%, 7~9급 저연차는 6.6% 인상되었습니다. 호봉 승급으로 평균 약 1~2만 원/월 추가 상승합니다.",
  },
];
