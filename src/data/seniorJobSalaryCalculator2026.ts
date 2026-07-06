import { MINIMUM_WAGE_2026 } from "./minimumWage2026";

// ── 타입 ──────────────────────────────────────────

export type PhysicalLoad = "LOW" | "MEDIUM" | "MEDIUM_HIGH" | "HIGH";
export type AgeBand = "60-64" | "65-69" | "70+";
export type PayBasis = "CALCULATED" | "GOVERNMENT_FIXED";

// 클러스터 공용 — senior-job-comparison-2026이 그대로 import해서 재사용
export interface SeniorJobProfile {
  jobCode: string;
  jobName: string;
  payBasis: PayBasis;
  hourlyWageDefault: number;
  dailyHoursPreset: number[];
  weeklyDaysPreset: number[];
  fixedMonthlyHours?: number; // 격일제처럼 "일 시간×주 일수×4.345주" 공식이 안 맞는 경우 직접 지정
  prepPeriodDays: number;
  requiresCertificate: boolean;
  educationHours?: number;
  physicalLoad: PhysicalLoad;
  emotionalLoad: PhysicalLoad;
  nightShift: boolean;
  partTimeAvailable: boolean;
  recommendedAge: AgeBand[];
  tags: string[];
  sourceNote: string;
  detailHref?: string;
  pros: string[];
  cautions: string[];
}

export interface UserJobInput {
  ageBand: AgeBand;
  physicalCondition: "LOW" | "MEDIUM" | "HIGH";
  targetMonthlyPay: number;
  hasCertificate: boolean;
  dailyHours: number;
  canNightShift: boolean;
  canCareWork: boolean;
}

export interface GovernmentJob {
  typeName: string;
  target: string;
  monthlyPayLabel: string;
  hoursNote: string;
  sourceNote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
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
    jobCode: "SECURITY_GUARD",
    jobName: "아파트 경비",
    payBasis: "CALCULATED",
    hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [24],
    weeklyDaysPreset: [2], // 격일제(2일 주기) 표기용 — 계산에는 fixedMonthlyHours 사용
    fixedMonthlyHours: 360, // 24시간 × 월 15회 (security-guard-salary-calculator-2026과 동일 기준)
    prepPeriodDays: 7,
    requiresCertificate: false,
    physicalLoad: "MEDIUM",
    emotionalLoad: "HIGH",
    nightShift: true,
    partTimeAvailable: false,
    recommendedAge: ["60-64", "65-69"],
    tags: ["야간가능", "격일제"],
    sourceNote: "2026 최저임금 기준 계산 (격일제 상세는 전용 계산기 참고)",
    detailHref: "/tools/security-guard-salary-calculator-2026/",
    pros: ["아파트·상가 채용 수요 많음", "자격증 부담 낮음(신임교육 정도)", "격일제라 쉬는 날이 확보됨"],
    cautions: ["24시간 격일제 근무 피로도", "입주민 민원 대응", "감시적 근로 승인 여부에 따라 야간수당이 달라짐"],
  },
  {
    jobCode: "CLEANING",
    jobName: "건물 미화",
    payBasis: "CALCULATED",
    hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [3, 4, 5],
    weeklyDaysPreset: [5, 6],
    prepPeriodDays: 0,
    requiresCertificate: false,
    physicalLoad: "MEDIUM_HIGH",
    emotionalLoad: "LOW",
    nightShift: false,
    partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["오전근무", "즉시가능"],
    sourceNote: "2026 최저임금 기준 계산 (상세는 전용 계산기 참고)",
    detailHref: "/tools/cleaning-job-salary-calculator-2026/",
    pros: ["자격증 없이 바로 시작 가능", "오전 3~5시간 파트타임 많음", "집 근처에서 구하기 좋음"],
    cautions: ["화장실·계단 청소 범위 확인 필요", "용역업체 4대보험 가입 여부 확인", "체력 부담이 상대적으로 큼"],
  },
  {
    jobCode: "CARE_WORKER",
    jobName: "요양보호사",
    payBasis: "CALCULATED",
    hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [4, 8],
    weeklyDaysPreset: [5, 6],
    prepPeriodDays: 60,
    requiresCertificate: true,
    educationHours: 320,
    physicalLoad: "HIGH",
    emotionalLoad: "HIGH",
    nightShift: true,
    partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69"],
    tags: ["자격증", "장기직업", "돌봄"],
    sourceNote: "2026 최저임금 기준 계산, 교육시간은 노인복지법 시행규칙 제29조의2 기준",
    detailHref: "/tools/caregiver-certificate-roi-calculator-2026/",
    pros: ["고령화로 수요 안정적", "시간제·상근직 선택 가능", "장기 직업화 가능"],
    cautions: ["허리·무릎 등 체력 부담", "감정노동", "대상자·보호자 민원 대응"],
  },
  {
    jobCode: "PARKING",
    jobName: "주차관리",
    payBasis: "CALCULATED",
    hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [8, 12],
    weeklyDaysPreset: [5, 6],
    prepPeriodDays: 0,
    requiresCertificate: false,
    physicalLoad: "MEDIUM",
    emotionalLoad: "MEDIUM",
    nightShift: false,
    partTimeAvailable: false,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["즉시가능", "자격증불필요"],
    sourceNote: "2026 최저임금 기준 계산",
    pros: ["자격증 없이 바로 시작", "상대적으로 안정적인 근무 패턴"],
    cautions: ["장시간 서 있거나 앉아있는 근무", "차량 응대 스트레스"],
  },
  {
    jobCode: "SCHOOL_GUARD",
    jobName: "학교지킴이",
    payBasis: "CALCULATED",
    hourlyWageDefault: MINIMUM_WAGE_2026,
    dailyHoursPreset: [4, 6],
    weeklyDaysPreset: [5],
    prepPeriodDays: 14,
    requiresCertificate: false,
    physicalLoad: "LOW",
    emotionalLoad: "MEDIUM",
    nightShift: false,
    partTimeAvailable: true,
    recommendedAge: ["60-64", "65-69", "70+"],
    tags: ["모집시기한정"],
    sourceNote: "2026 최저임금 기준 계산, 지자체 모집 공고 기준 시기 상이",
    pros: ["체력 부담이 적은 편", "등하교 시간 위주 근무"],
    cautions: ["지자체·학교별 모집 시기가 정해져 있음", "상시 채용이 아님"],
  },
];

// ── 정부 지원형 노인일자리 (별도 표, 계산기 입력값과 혼용 금지) ──

export const SJSC_GOVERNMENT_JOBS: GovernmentJob[] = [
  {
    typeName: "공공형",
    target: "만 65세 이상 (기초연금 수급자 우선)",
    monthlyPayLabel: "월 29만원",
    hoursNote: "일 3시간·월 30시간",
    sourceNote: "정부24 지자체 공고 기준",
  },
  {
    typeName: "사회서비스형",
    target: "만 60세 이상 (생계급여 수급자·직장가입자·장기요양 1~5등급 제외)",
    monthlyPayLabel: "월 59만~76만원대 (지자체·유형별 차이)",
    hoursNote: "월 60시간 내외",
    sourceNote: "2026년 보도 종합, 정확한 금액은 노인일자리 여기(seniorro.or.kr) 확인",
  },
];

// ── 추천 스코어링 로직 ────────────────────────────

export function calculateJobScore(user: UserJobInput, job: SeniorJobProfile): number {
  let score = 0;
  if (job.hourlyWageDefault * 8 * 22 >= user.targetMonthlyPay) score += 30;
  else score -= 20;

  if (user.physicalCondition === "LOW" && (job.physicalLoad === "HIGH" || job.physicalLoad === "MEDIUM_HIGH")) {
    score -= 30;
  } else {
    score += 20;
  }

  if (job.requiresCertificate && !user.hasCertificate) score -= 15;
  else score += 10;

  if (job.nightShift && !user.canNightShift) score -= 20;
  if (job.partTimeAvailable && user.dailyHours <= 5) score += 15;
  if (job.jobCode === "CARE_WORKER" && user.canCareWork) score += 20;
  if (!job.recommendedAge.includes(user.ageBand)) score -= 10;

  return score;
}

// ── 월급 계산 (시급 × 시간 + 주휴수당) ──────────────
// public/scripts/senior-job-shared.js의 calcMonthlyPay와 동일 로직 (SSR 초기값용 TS 구현)

export function calcMonthlyPay(hourlyWage: number, dailyHours: number, weeklyDays: number) {
  const weeklyHours = dailyHours * weeklyDays;
  const monthlyHours = weeklyHours * 4.345;
  const weeklyHolidayPay = weeklyHours >= 15 ? (weeklyHours / 40) * 8 * hourlyWage * 4.345 : 0;
  const basePay = hourlyWage * monthlyHours;
  return { weeklyHours, monthlyHours, basePay, weeklyHolidayPay, total: basePay + weeklyHolidayPay };
}

// 직업 마스터 데이터로 대표 계산 예시를 뽑을 때 쓰는 헬퍼.
// fixedMonthlyHours가 있으면(격일제 등 일반 공식이 안 맞는 경우) 그 값을 그대로 쓰고,
// 없으면 dailyHoursPreset × weeklyDaysPreset × 4.345주 공식을 그대로 쓴다.
export function calcJobExample(job: SeniorJobProfile) {
  if (job.fixedMonthlyHours) {
    const basePay = job.hourlyWageDefault * job.fixedMonthlyHours;
    return { weeklyHours: job.fixedMonthlyHours / 4.345, monthlyHours: job.fixedMonthlyHours, basePay, weeklyHolidayPay: 0, total: basePay };
  }
  return calcMonthlyPay(job.hourlyWageDefault, job.dailyHoursPreset[0], job.weeklyDaysPreset[0] ?? 5);
}

// ── FAQ ───────────────────────────────────────────

export const SJSC_FAQ: FaqItem[] = [
  {
    question: "60대에 할 수 있는 일자리는 어떤 게 있나요?",
    answer: "경비, 건물 미화, 요양보호사, 주차관리, 학교지킴이 등이 대표적입니다. 체력과 자격증 여부에 따라 맞는 일자리가 달라집니다.",
  },
  {
    question: "예상 월급은 어떻게 계산되나요?",
    answer: "2026년 최저임금(시급 10,320원)을 기준으로 입력한 근무시간·일수를 곱해 계산합니다. 실제 채용 공고의 급여와는 사업장별로 차이가 날 수 있습니다.",
  },
  {
    question: "야간근무가 가능해야 하는 일자리는 뭔가요?",
    answer: "아파트 경비, 일부 요양보호사(방문요양 야간 포함) 등이 야간근무가 있을 수 있습니다.",
  },
  {
    question: "자격증 없이 바로 시작할 수 있는 일자리는?",
    answer: "건물 미화, 주차관리는 별도 자격증 없이 시작할 수 있습니다. 경비는 일반경비원 신임교육이 필요할 수 있습니다.",
  },
  {
    question: "65세 이상도 지원 가능한가요?",
    answer: "대부분의 민간 일자리는 연령 상한이 없지만, 노인일자리 공공형은 만 65세 이상, 사회서비스형은 만 60세 이상부터 신청 가능합니다.",
  },
];

// ── SEO ───────────────────────────────────────────

export const SJSC_SEO_INTRO = [
  "부모님이나 본인이 60대 이후 다시 일을 시작하려고 하면 가장 먼저 궁금한 건 '어떤 일을 할 수 있고 월급은 얼마나 될까'입니다. 경비, 건물 미화, 요양보호사, 주차관리, 학교지킴이처럼 60대 이후 진입 장벽이 낮은 일자리들은 근무 형태와 체력 부담, 준비 기간이 저마다 다릅니다. 이 계산기는 나이·체력·희망 월수입·자격증 여부를 입력하면 맞는 일자리를 추천하고 예상 월급까지 함께 계산합니다.",
  "예상 월급은 2026년 최저임금(시급 10,320원)을 기준으로 계산합니다. 같은 직종이라도 실제 채용 공고는 시급 1만원대부터 지자체 정규직 월 300만원 이상까지 편차가 매우 커서, 이 계산기는 '평균 시세'를 주장하는 대신 확정된 최저임금 기준으로 근무시간을 입력해 직접 계산한 결과를 보여줍니다. 이렇게 하면 사용자가 자신의 조건으로 직접 검증할 수 있습니다.",
  "직업별로 준비 과정도 다릅니다. 건물 미화와 주차관리는 자격증 없이 즉시 시작할 수 있지만, 요양보호사는 노인복지법 시행규칙 제29조의2에 따른 표준교육과정 320시간(이론126·실기114·실습80)을 이수해야 합니다. 간호사·간호조무사 등 관련 국가자격 소지자는 40~50시간 단축과정이 적용됩니다. 경비는 격일제 근무가 일반적이고 일반경비원 신임교육이 필요한 경우가 많습니다.",
  "체력과 야간근무 가능 여부도 중요한 선택 기준입니다. 아파트 경비는 24시간 격일제 근무와 야간 대응이 필요하고, 요양보호사는 돌봄 노동 특성상 체력·감정노동 부담이 큰 편입니다. 반면 건물 미화나 학교지킴이는 오전 시간대 위주로 근무해 체력 부담이 상대적으로 적습니다. 이 계산기는 이런 조건을 종합해 우선순위를 매깁니다.",
  "민간 일자리 외에 정부가 운영하는 노인일자리 및 사회활동지원사업도 있습니다. 공공형(만 65세 이상, 월 29만원, 일 3시간·월 30시간)과 사회서비스형(만 60세 이상, 월 59만~76만원대, 월 60시간 내외)은 활동 성격과 지원 금액이 민간 일자리와 다르므로, 이 페이지에서는 계산값과 정부 고정 지원금을 서로 다른 성격으로 구분해서 보여줍니다.",
];

export const SJSC_SEO_CRITERIA = [
  "예상 월급은 2026년 최저임금(시급 10,320원) 기준 계산값이며 실제 채용 공고와 다를 수 있습니다",
  "요양보호사 표준교육 320시간은 노인복지법 시행규칙 제29조의2·별표10의2 기준입니다",
  "노인일자리 공공형(월 29만원)·사회서비스형(월 59만~76만원대)은 민간 계산값과 다른 정부 고정 지원금입니다",
  "주휴수당은 근로기준법 제55조에 따라 주 15시간 이상 근무 시 자동 반영됩니다",
];

export const SJSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/senior-job-comparison-2026/", label: "경비 vs 미화 vs 요양보호사 비교 리포트", description: "직업별 월급·준비기간·체력부담을 한 화면에서 비교합니다." },
  { href: "/tools/security-guard-salary-calculator-2026/", label: "아파트 경비 월급 계산기", description: "격일제·야간수당까지 반영한 상세 계산." },
  { href: "/tools/cleaning-job-salary-calculator-2026/", label: "건물 미화 월급 계산기", description: "오전 파트타임 근무 기준 상세 계산." },
  { href: "/tools/caregiver-certificate-roi-calculator-2026/", label: "요양보호사 자격증 투자비 회수 계산기", description: "자격증 교육비를 몇 개월 만에 회수하는지 계산." },
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기", description: "일자리와 함께 받을 수 있는 기초연금도 확인." },
  { href: "/tools/minimum-wage-2026/", label: "2026 최저임금 계산기", description: "이 계산기의 기준이 되는 최저임금 상세 확인." },
  { href: "/tools/unemployment-benefit-calculator/", label: "실업급여 계산기", description: "퇴직 후 재취업 준비 기간의 실업급여 확인." },
];
