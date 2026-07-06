import { MINIMUM_WAGE_2026 } from "./minimumWage2026";

export type WorkPattern = "ALTERNATE_DAY" | "THREE_SHIFT" | "DAILY";

export interface WorkPatternInfo {
  label: string;
  monthlyHours: number; // 패턴별 월 근무시간 (격일제: 24h×월 15회 / 3교대·매일: 8h×주5일×4.345주)
  nightCyclesPerMonth: number; // 야간근무(22시~06시) 발생 횟수/월
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

export const SGSC_META = {
  slug: "security-guard-salary-calculator-2026",
  title: "아파트 경비 월급 계산기 2026",
  seoTitle: "아파트 경비 월급 계산기 2026 | 격일제 실수령액 바로 계산",
  seoDescription:
    "격일제·야간근무 조건 입력하면 아파트 경비 예상 월급과 실수령액 바로 계산. 2026 최저임금·4대보험 공제 반영.",
  updatedAt: "2026-07-06",
  dataNote:
    "이 계산은 2026년 최저임금(시급 10,320원) 기준이며, 감시적 근로자로 승인된 사업장은 야간근로수당·연장근로수당이 면제될 수 있습니다. 실제 근로계약서·사업장 승인 여부를 확인하세요.",
};

const WEEKS_PER_MONTH = 4.345;

export const SGSC_WORK_PATTERNS: Record<WorkPattern, WorkPatternInfo> = {
  ALTERNATE_DAY: { label: "격일제 (24시간 근무-24시간 휴무)", monthlyHours: 24 * 15, nightCyclesPerMonth: 15 },
  THREE_SHIFT: { label: "3교대 (8시간)", monthlyHours: 8 * 5 * WEEKS_PER_MONTH, nightCyclesPerMonth: 5 * WEEKS_PER_MONTH / 3 },
  DAILY: { label: "매일 근무 (주 5일)", monthlyHours: 8 * 5 * WEEKS_PER_MONTH, nightCyclesPerMonth: 0 },
};

// 야간근로수당 가산율 (근로기준법 제56조 — 22시~06시 통상임금의 50% 가산)
export const NIGHT_SHIFT_PREMIUM_RATE = 0.5;
export const NIGHT_SHIFT_HOURS = 8;
export const INSURANCE_DEDUCTION_RATE = 0.093; // 국민연금4.5%+건강보험3.545%+장기요양+고용보험0.9% 근사치

export function calcSecurityGuardPay(input: {
  pattern: WorkPattern;
  hourlyWage: number;
  includeNightShift: boolean;
  isMonitoringApproved: boolean;
  applyInsurance: boolean;
}) {
  const p = SGSC_WORK_PATTERNS[input.pattern];
  const basePay = input.hourlyWage * p.monthlyHours;
  const nightPremium =
    input.includeNightShift && !input.isMonitoringApproved
      ? input.hourlyWage * NIGHT_SHIFT_PREMIUM_RATE * NIGHT_SHIFT_HOURS * p.nightCyclesPerMonth
      : 0;
  const grossPay = basePay + nightPremium;
  const insuranceDeduction = input.applyInsurance ? grossPay * INSURANCE_DEDUCTION_RATE : 0;
  return { monthlyHours: p.monthlyHours, basePay, nightPremium, grossPay, netPay: grossPay - insuranceDeduction };
}

export const SGSC_FAQ: FaqItem[] = [
  {
    question: "경비원은 왜 격일제로 일하나요?",
    answer: "24시간 상주가 필요한 특성상 격일제(24시간 근무-24시간 휴무)가 일반적입니다. 3교대나 매일 근무 사업장도 있습니다.",
  },
  {
    question: "감시적 근로자 승인이 뭔가요?",
    answer: "고용노동부 승인을 받은 감시적·단속적 근로자는 야간근로수당·연장근로수당 적용이 면제될 수 있습니다. 근로계약서에서 승인 여부를 확인해야 합니다.",
  },
  {
    question: "경비원도 4대보험 가입하나요?",
    answer: "네, 일반적으로 4대보험 가입 대상입니다. 정확한 공제액은 4대보험 계산기에서 확인하세요.",
  },
  {
    question: "경비원 자격증이 따로 있나요?",
    answer: "법적 자격증은 아니지만 일반경비원 신임교육(24시간)을 이수해야 하는 사업장이 많습니다.",
  },
  {
    question: "아파트 경비와 상가 경비는 월급이 다른가요?",
    answer: "근무 강도·민원 빈도·계약 형태가 달라 사업장마다 차이가 있습니다. 이 계산기는 공통 최저임금 기준으로 예시를 제공합니다.",
  },
];

export const SGSC_SEO_INTRO = [
  "아파트 경비는 60대 이후 진입할 수 있는 대표적인 일자리 중 하나입니다. 다만 격일제(24시간 근무-24시간 휴무)라는 독특한 근무 형태 때문에 실제 월급을 가늠하기 어려운 경우가 많습니다. 이 계산기는 근무 형태, 시급, 야간근무 포함 여부, 4대보험 공제 여부를 입력하면 2026년 최저임금 기준으로 예상 월급과 실수령액을 계산합니다.",
  "격일제는 24시간 근무 후 24시간을 쉬는 구조로, 한 달에 약 15번의 근무 사이클이 발생해 월 근무시간이 약 360시간에 이릅니다. 3교대나 매일 근무(주 5일)는 하루 8시간 기준으로 계산하며, 실제 사업장은 휴게시간 처리 방식에 따라 이보다 근무시간이 줄어들 수 있습니다. 이 계산기는 근무 형태별 월 근무시간을 자동으로 산출해 기본급을 계산합니다.",
  "야간근로수당(22시~06시, 통상임금의 50% 가산)은 근로기준법 제56조에 따른 원칙이지만, 감시적·단속적 근로자로 고용노동부 승인을 받은 사업장은 야간·연장근로수당이 면제될 수 있습니다. 이 계산기는 감시적 근로 승인 여부를 토글로 선택해 두 경우를 모두 계산할 수 있게 했습니다. 실제 근로계약서에서 이 승인 여부를 확인하는 것이 중요합니다.",
  "4대보험을 적용하면 국민연금, 건강보험, 장기요양보험, 고용보험 근로자 부담분이 세전 급여에서 공제됩니다. 이 계산기는 근사치 비율로 공제액을 계산해 실수령액을 보여주며, 정확한 금액은 4대보험 계산기에서 별도로 확인할 수 있습니다.",
  "경비원은 법적 자격증이 필요한 직업은 아니지만, 사업장에 따라 일반경비원 신임교육(24시간) 이수를 요구하는 경우가 많습니다. 준비 기간이 며칠에서 1주 정도로 짧은 편이라 다른 일자리보다 비교적 빠르게 시작할 수 있습니다.",
];

export const SGSC_SEO_CRITERIA = [
  "이 계산은 2026년 최저임금(시급 10,320원) 기준이며 실제 채용 공고와 다를 수 있습니다",
  "야간근로수당은 근로기준법 제56조(22시~06시, 통상임금 50% 가산) 기준이며, 감시적 근로자 승인 시 면제될 수 있습니다",
  "4대보험 공제는 근사치 비율(약 9.3%)로 계산하며 정확한 금액은 4대보험 계산기에서 확인해야 합니다",
  "격일제는 24시간 근무-24시간 휴무 구조로 월 약 15회 근무 사이클이 발생합니다",
];

export const SGSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/senior-job-salary-calculator-2026/", label: "60대 일자리 월급 계산기", description: "경비 외 다른 일자리와 비교해봅니다." },
  { href: "/reports/senior-job-comparison-2026/", label: "경비 vs 미화 vs 요양보호사 비교 리포트", description: "직업별 월급·준비기간·체력부담을 한 화면에서 비교합니다." },
  { href: "/tools/four-insurance-calculator/", label: "4대보험 계산기", description: "국민연금·건강보험·고용보험 공제액을 정확히 계산합니다." },
  { href: "/tools/overtime-pay-calculator/", label: "야간·연장수당 계산기", description: "야간·연장근로수당을 상세하게 계산합니다." },
];
