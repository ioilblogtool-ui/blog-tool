// ─── childTutoringData.ts ────────────────────────────────────────────────────
// 아이 사교육비 계산기 데이터
// 출처: 통계청 「초중고 사교육비 조사」 2024년 기준 추정치.
// 미취학 아동은 육아정책연구소 참고. 실제 비용은 지역·과목·기관 유형에 따라 다를 수 있으므로 참고용으로 표기.
// ─────────────────────────────────────────────────────────────────────────────

export type SchoolLevel = "preschool" | "elementary" | "middle" | "high";
export type Region = "seoul" | "metro" | "city" | "rural";
export type SubjectType =
  | "english"
  | "math"
  | "korean"
  | "science"
  | "essay"
  | "arts"
  | "coding"
  | "other";
export type LearningType =
  | "academy"
  | "private"
  | "group"
  | "visit"
  | "online";

export type AverageByRegion = Record<Region, number>;

export type SchoolLevelMeta = {
  level: SchoolLevel;
  label: string;
  shortLabel: string;
  durationYears: number;
  grades: number[];
  avgMonthlyCost: AverageByRegion;
};

export type SubjectOption = {
  id: SubjectType;
  label: string;
};

export type LearningTypeOption = {
  id: LearningType;
  label: string;
};

export type OpportunityCostPreset = {
  years: number;
  label: string;
};

export type ReturnRatePreset = {
  rate: number;
  label: string;
};

export type TierInfo = {
  id: "saving" | "average" | "active" | "high";
  label: string;
  badge: string;
  minRatio: number;
  maxRatio: number;
  colorClass: string;
};

// ── 학교급별 평균 사교육비 ────────────────────────────────────────────────────
export const SCHOOL_LEVEL_DATA: SchoolLevelMeta[] = [
  {
    level: "preschool",
    label: "미취학",
    shortLabel: "유아",
    durationYears: 3,
    grades: [],
    avgMonthlyCost: {
      seoul: 450000,
      metro: 340000,
      city: 250000,
      rural: 180000,
    },
  },
  {
    level: "elementary",
    label: "초등학교",
    shortLabel: "초등",
    durationYears: 6,
    grades: [1, 2, 3, 4, 5, 6],
    avgMonthlyCost: {
      seoul: 640000,
      metro: 500000,
      city: 400000,
      rural: 300000,
    },
  },
  {
    level: "middle",
    label: "중학교",
    shortLabel: "중등",
    durationYears: 3,
    grades: [1, 2, 3],
    avgMonthlyCost: {
      seoul: 860000,
      metro: 680000,
      city: 520000,
      rural: 400000,
    },
  },
  {
    level: "high",
    label: "고등학교",
    shortLabel: "고등",
    durationYears: 3,
    grades: [1, 2, 3],
    avgMonthlyCost: {
      seoul: 1020000,
      metro: 820000,
      city: 630000,
      rural: 500000,
    },
  },
];

// ── 선택지 옵션 ───────────────────────────────────────────────────────────────
export const REGION_OPTIONS: { id: Region; label: string }[] = [
  { id: "seoul", label: "서울" },
  { id: "metro", label: "수도권" },
  { id: "city", label: "광역시" },
  { id: "rural", label: "지방" },
];

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: "english", label: "영어" },
  { id: "math", label: "수학" },
  { id: "korean", label: "국어" },
  { id: "science", label: "과학" },
  { id: "essay", label: "논술" },
  { id: "arts", label: "예체능" },
  { id: "coding", label: "코딩" },
  { id: "other", label: "기타" },
];

export const LEARNING_TYPE_OPTIONS: LearningTypeOption[] = [
  { id: "academy", label: "학원" },
  { id: "private", label: "개인과외" },
  { id: "group", label: "그룹과외" },
  { id: "visit", label: "방문학습" },
  { id: "online", label: "온라인" },
];

// ── 티어 정의 ─────────────────────────────────────────────────────────────────
export const COMPARISON_TIERS: TierInfo[] = [
  {
    id: "saving",
    label: "절약형",
    badge: "평균보다 낮은 수준",
    minRatio: 0,
    maxRatio: 0.7,
    colorClass: "tier--saving",
  },
  {
    id: "average",
    label: "평균권",
    badge: "또래 평균 수준",
    minRatio: 0.7,
    maxRatio: 1.1,
    colorClass: "tier--average",
  },
  {
    id: "active",
    label: "적극 투자형",
    badge: "평균보다 높은 수준",
    minRatio: 1.1,
    maxRatio: 1.5,
    colorClass: "tier--active",
  },
  {
    id: "high",
    label: "고지출형",
    badge: "높은 지출 구간",
    minRatio: 1.5,
    maxRatio: Infinity,
    colorClass: "tier--high",
  },
];

// ── 기회비용 파라미터 ──────────────────────────────────────────────────────────
export const OPPORTUNITY_YEAR_PRESETS: OpportunityCostPreset[] = [
  { years: 5, label: "5년" },
  { years: 10, label: "10년" },
  { years: 15, label: "15년" },
];

export const RETURN_RATE_PRESETS: ReturnRatePreset[] = [
  { rate: 0.03, label: "3%" },
  { rate: 0.05, label: "5%" },
  { rate: 0.07, label: "7%" },
];

// ── FAQ 데이터 ────────────────────────────────────────────────────────────────
export const TUTORING_FAQ = [
  {
    question: "초등학생 사교육비 평균은 어느 정도인가요?",
    answer:
      "통계청 2024년 사교육비 조사 기준 초등학생 전국 평균은 월 약 43만 원(참여 학생 기준)이며, 서울은 약 64만 원으로 지역 간 차이가 큽니다. 이 계산기의 평균값은 이를 기반으로 한 참고 추정치입니다.",
  },
  {
    question: "형제자매 교육비는 함께 계산할 수 있나요?",
    answer:
      "네, 자녀 수를 1~4명으로 설정하면 자녀별 교육비를 각각 입력하고 전체 합산액을 한눈에 볼 수 있습니다.",
  },
  {
    question: "월 교육비와 연간 교육비를 동시에 볼 수 있나요?",
    answer:
      "결과 카드에서 월 총액, 연간 총액, 현재 학교급 기준 누적 예상 금액을 한 번에 확인할 수 있습니다.",
  },
  {
    question: "사교육비 기회비용은 어떻게 계산하나요?",
    answer:
      "매월 동일 금액을 선택한 수익률로 적립 투자한다고 가정한 미래가치 공식(FV = PMT × ((1+r)^n − 1) / r)을 사용합니다. 실제 투자 수익을 보장하지 않으며 참고용 시뮬레이션입니다.",
  },
  {
    question: "지역별 차이도 반영되나요?",
    answer:
      "서울·수도권·광역시·지방 4개 지역 기준으로 또래 평균 비교값이 달라집니다. 각 자녀별로 지역을 개별 설정할 수 있습니다.",
  },
];

// ── 관련 도구 링크 ─────────────────────────────────────────────────────────────
export const TUTORING_RELATED_TOOLS = [
  {
    slug: "dca-investment-calculator",
    label: "적립식 투자 계산기",
    reason: "기회비용 확장",
  },
  {
    slug: "fire-calculator",
    label: "파이어족 계산기",
    reason: "장기 자산 비교",
  },
  {
    slug: "parental-leave-short-work",
    label: "육아휴직 급여 계산기",
    reason: "육아 가계 전체 맥락",
  },
];
