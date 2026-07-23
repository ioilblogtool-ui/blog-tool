export type WorkScholarshipType = "campus" | "offcampus" | "custom";

export interface WorkScholarshipInput {
  workType: WorkScholarshipType;
  hourlyWage: number;
  weeklyHours: number;
  monthlyWeeks: number;
  semesterMonths: number;
  includeVacation: boolean;
  vacationWeeklyHours: number;
  vacationMonths: number;
  monthlyLivingCost: number;
  monthlyDeduction: number;
}

export interface WorkScholarshipResult {
  monthlyGrossPay: number;
  monthlyNetPay: number;
  semesterGrossPay: number;
  semesterNetPay: number;
  vacationMonthlyGrossPay: number;
  vacationMonthlyNetPay: number;
  vacationGrossPay: number;
  vacationNetPay: number;
  totalGrossPay: number;
  totalNetPay: number;
  livingCoverageRate: number;
  monthlyShortageOrSurplus: number;
  campusMonthlyPay: number;
  offCampusMonthlyPay: number;
  typeGapMonthly: number;
  typeGapSemester: number;
  insight: string;
}

export const NATIONAL_WORK_SCHOLARSHIP_META = {
  slug: "national-work-scholarship-pay-calculator-2026",
  title: "국가근로장학금 월수령액 계산기 2026",
  seoTitle: "국가근로장학금 월수령액 계산기 2026 | 교내·교외 시급과 근로시간 계산",
  seoDescription:
    "2026년 국가근로장학금 교내·교외 시급과 주당 근로시간을 입력해 월 예상 수령액, 학기 총액, 방학 집중근로 포함 금액, 생활비 충당률을 계산합니다.",
  updatedAt: "2026-07-23",
  dataNote:
    "2026년 1학기 한국장학재단 FAQ 기준 교내근로 시급은 10,320원, 교외근로 시급은 12,790원입니다. 2학기 실제 단가와 근로 가능 시간은 한국장학재단 및 소속 대학 공지가 우선합니다.",
};

export const NATIONAL_WORK_SCHOLARSHIP_WAGES = {
  campus: 10_320,
  offcampus: 12_790,
};

export const NATIONAL_WORK_SCHOLARSHIP_DEFAULT_INPUT: WorkScholarshipInput = {
  workType: "offcampus",
  hourlyWage: NATIONAL_WORK_SCHOLARSHIP_WAGES.offcampus,
  weeklyHours: 10,
  monthlyWeeks: 4.345,
  semesterMonths: 4,
  includeVacation: false,
  vacationWeeklyHours: 20,
  vacationMonths: 0,
  monthlyLivingCost: 600_000,
  monthlyDeduction: 0,
};

export const NATIONAL_WORK_SCHOLARSHIP_SCHEDULE = [
  { label: "2학기 사업기간", value: "2026. 9. 1. ~ 2027. 2. 28." },
  { label: "2학기 1차 신청", value: "2026. 5. 22. 9시 ~ 2026. 6. 22. 18시" },
  { label: "1차 서류·가구원 동의", value: "2026. 5. 22. 9시 ~ 2026. 6. 29. 18시" },
  { label: "2학기 2차 신청", value: "2026. 8. 12. 9시 ~ 2026. 9. 9. 18시" },
  { label: "2차 서류·가구원 동의", value: "2026. 8. 12. 9시 ~ 2026. 9. 16. 18시" },
];

export const NATIONAL_WORK_SCHOLARSHIP_PRESETS = [
  {
    id: "campus8",
    label: "교내 주 8시간",
    summary: "수업 사이 짧게 근로",
    input: { workType: "campus", hourlyWage: NATIONAL_WORK_SCHOLARSHIP_WAGES.campus, weeklyHours: 8, semesterMonths: 4, includeVacation: false, vacationMonths: 0 },
  },
  {
    id: "campus12",
    label: "교내 주 12시간",
    summary: "학기 중 생활비 보전",
    input: { workType: "campus", hourlyWage: NATIONAL_WORK_SCHOLARSHIP_WAGES.campus, weeklyHours: 12, semesterMonths: 4, includeVacation: false, vacationMonths: 0 },
  },
  {
    id: "offcampus10",
    label: "교외 주 10시간",
    summary: "교외 시급 기준 기본값",
    input: { workType: "offcampus", hourlyWage: NATIONAL_WORK_SCHOLARSHIP_WAGES.offcampus, weeklyHours: 10, semesterMonths: 4, includeVacation: false, vacationMonths: 0 },
  },
  {
    id: "vacation",
    label: "방학 집중근로형",
    summary: "학기 주 10h + 방학 주 20h",
    input: { workType: "offcampus", hourlyWage: NATIONAL_WORK_SCHOLARSHIP_WAGES.offcampus, weeklyHours: 10, semesterMonths: 4, includeVacation: true, vacationWeeklyHours: 20, vacationMonths: 2 },
  },
];

export const NATIONAL_WORK_SCHOLARSHIP_HOUR_SCENARIOS = [5, 8, 10, 12, 15, 20];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);
}

function calcMonthlyPay(hourlyWage: number, weeklyHours: number, monthlyWeeks: number) {
  return hourlyWage * weeklyHours * monthlyWeeks;
}

function calcNetMonthlyPay(grossPay: number, monthlyDeduction: number) {
  return Math.max(0, grossPay - monthlyDeduction);
}

function buildInsight(result: Omit<WorkScholarshipResult, "insight">, input: WorkScholarshipInput) {
  if (input.hourlyWage <= 0 || input.weeklyHours <= 0) return "시급과 주당 근로시간을 입력하면 월 예상 수령액을 계산할 수 있습니다.";
  const coverage = result.livingCoverageRate;
  const base = `주 ${input.weeklyHours.toLocaleString("ko-KR")}시간 기준 월 예상 수령액은 약 ${Math.round(result.monthlyNetPay).toLocaleString("ko-KR")}원입니다.`;
  if (input.monthlyLivingCost <= 0) return `${base} 생활비 예산을 입력하면 충당률도 함께 볼 수 있습니다.`;
  if (coverage >= 100) return `${base} 입력한 월 생활비 예산을 대부분 충당할 수 있지만, 실제 근로시간은 선발과 근로지 배정에 따라 달라집니다.`;
  if (coverage >= 70) return `${base} 월 생활비 예산의 약 ${Math.round(coverage).toLocaleString("ko-KR")}%를 충당하는 수준입니다.`;
  if (coverage >= 40) return `${base} 생활비 일부를 보전할 수 있으나 주거비·등록금까지 포함하면 추가 예산이 필요할 수 있습니다.`;
  return `${base} 생활비 전체를 맡기기에는 부족한 편이므로 다른 지원금·아르바이트·대출 계획과 함께 봐야 합니다.`;
}

export function calcNationalWorkScholarship(input: WorkScholarshipInput): WorkScholarshipResult {
  const hourlyWage = clamp(input.hourlyWage, 0, 50_000);
  const weeklyHours = clamp(input.weeklyHours, 0, 40);
  const monthlyWeeks = clamp(input.monthlyWeeks, 4, 4.345);
  const semesterMonths = clamp(input.semesterMonths, 0, 6);
  const vacationWeeklyHours = clamp(input.vacationWeeklyHours, 0, 40);
  const vacationMonths = input.includeVacation ? clamp(input.vacationMonths, 0, 3) : 0;
  const monthlyDeduction = clamp(input.monthlyDeduction, 0, 5_000_000);

  const monthlyGrossPay = calcMonthlyPay(hourlyWage, weeklyHours, monthlyWeeks);
  const monthlyNetPay = calcNetMonthlyPay(monthlyGrossPay, monthlyDeduction);
  const semesterGrossPay = monthlyGrossPay * semesterMonths;
  const semesterNetPay = monthlyNetPay * semesterMonths;

  const vacationMonthlyGrossPay = input.includeVacation ? calcMonthlyPay(hourlyWage, vacationWeeklyHours, monthlyWeeks) : 0;
  const vacationMonthlyNetPay = input.includeVacation ? calcNetMonthlyPay(vacationMonthlyGrossPay, monthlyDeduction) : 0;
  const vacationGrossPay = vacationMonthlyGrossPay * vacationMonths;
  const vacationNetPay = vacationMonthlyNetPay * vacationMonths;

  const totalGrossPay = semesterGrossPay + vacationGrossPay;
  const totalNetPay = semesterNetPay + vacationNetPay;
  const monthlyLivingCost = clamp(input.monthlyLivingCost, 0, 5_000_000);
  const livingCoverageRate = monthlyLivingCost > 0 ? (monthlyNetPay / monthlyLivingCost) * 100 : 0;
  const monthlyShortageOrSurplus = monthlyNetPay - monthlyLivingCost;

  const campusMonthlyPay = calcMonthlyPay(NATIONAL_WORK_SCHOLARSHIP_WAGES.campus, weeklyHours, monthlyWeeks);
  const offCampusMonthlyPay = calcMonthlyPay(NATIONAL_WORK_SCHOLARSHIP_WAGES.offcampus, weeklyHours, monthlyWeeks);
  const typeGapMonthly = offCampusMonthlyPay - campusMonthlyPay;
  const typeGapSemester = typeGapMonthly * semesterMonths;

  const resultWithoutInsight = {
    monthlyGrossPay,
    monthlyNetPay,
    semesterGrossPay,
    semesterNetPay,
    vacationMonthlyGrossPay,
    vacationMonthlyNetPay,
    vacationGrossPay,
    vacationNetPay,
    totalGrossPay,
    totalNetPay,
    livingCoverageRate,
    monthlyShortageOrSurplus,
    campusMonthlyPay,
    offCampusMonthlyPay,
    typeGapMonthly,
    typeGapSemester,
  };

  return { ...resultWithoutInsight, insight: buildInsight(resultWithoutInsight, { ...input, hourlyWage, weeklyHours }) };
}

export const NATIONAL_WORK_SCHOLARSHIP_CHECKLIST = [
  "한국장학재단 국가근로장학금 신청 완료 여부",
  "서류제출 및 가구원 동의 완료 여부",
  "소속 대학의 2차 신청 운영 여부",
  "학자금 지원구간 산정 완료 여부",
  "희망근로지 신청 기간과 선발 일정",
  "시간표와 실제 근로 가능 시간",
  "출근부 입력·승인 방식",
  "부정근로·중복참여 제한 사항",
];

export const NATIONAL_WORK_SCHOLARSHIP_FAQ = [
  {
    question: "국가근로장학금은 신청하면 바로 받을 수 있나요?",
    answer:
      "아닙니다. 신청 후 학자금 지원구간, 성적, 대학 자체 선발기준, 배정 예산, 근로지 수요에 따라 선발됩니다. 이 계산기는 선발 후 실제 근로시간을 채웠을 때의 예상 금액을 보여주는 도구입니다.",
  },
  {
    question: "교내와 교외는 무엇이 다른가요?",
    answer:
      "교내는 대학 안 근로지, 교외는 대학 밖 기관 근로지를 의미합니다. 2026년 1학기 FAQ 기준 시급은 교내 10,320원, 교외 12,790원이지만 2학기 실제 기준은 한국장학재단과 소속 대학 공지를 확인해야 합니다.",
  },
  {
    question: "근로시간은 마음대로 정할 수 있나요?",
    answer:
      "아닙니다. 실제 근로시간은 시간표, 근로지 배정, 대학 운영 기준, 예산에 따라 정해집니다. 계산기에는 본인이 예상하는 주당 시간을 입력합니다.",
  },
  {
    question: "방학 집중근로도 계산할 수 있나요?",
    answer:
      "가능합니다. 방학 근로 개월 수와 주당 근로시간을 별도 입력하면 학기 중 근로와 합산해 총액을 보여줍니다. 다만 방학 집중근로도 선발과 배정이 필요합니다.",
  },
  {
    question: "세금이나 공제가 빠지나요?",
    answer:
      "기본값은 0원으로 두었습니다. 학교별 지급 방식이나 개인 상황에 따라 차감액이 있다면 월 공제액에 직접 입력해 순수령액 기준으로 볼 수 있습니다.",
  },
];

export const NATIONAL_WORK_SCHOLARSHIP_SEO_CONTENT = {
  introTitle: "국가근로장학금은 시급보다 실제 배정 시간이 중요합니다",
  intro: [
    "국가근로장학금은 대학생이 교내 또는 교외 근로지에서 근로하고 시간당 장학금을 받는 제도입니다. 사용자가 실제로 궁금해하는 것은 선발 가능성보다 선발된 뒤 한 달에 얼마가 들어오는지, 학기 전체로 얼마를 생활비에 보탤 수 있는지입니다.",
    "이 계산기는 근로 유형, 시급, 주당 근로시간, 근로 개월 수, 방학 집중근로 여부를 입력해 월 예상 수령액과 학기 총액을 계산합니다. 월 생활비 예산을 함께 넣으면 국가근로장학금이 생활비의 몇 퍼센트를 충당하는지도 확인할 수 있습니다.",
    "계산 결과는 예상액입니다. 국가근로장학금은 신청만으로 선발이 보장되지 않으며, 실제 근로 가능 시간과 지급 일정은 한국장학재단 및 소속 대학 공지가 우선합니다.",
  ],
  inputPoints: [
    "교내·교외·직접입력 시급을 선택할 수 있습니다.",
    "주당 근로시간과 월 환산 주수를 조정해 현실적인 월수령액을 계산합니다.",
    "학기 중 근로와 방학 집중근로를 나눠 총액을 볼 수 있습니다.",
    "월 생활비 예산 대비 충당률과 부족액을 함께 확인합니다.",
    "동일 시간 기준 교내·교외 수령액 차이를 비교합니다.",
  ],
  criteria: [
    "월수령액은 시급 × 주당 근로시간 × 월 환산 주수로 계산합니다.",
    "기본 월 환산 주수는 4.345주이며 간편 계산용 4주로 바꿀 수 있습니다.",
    "학기 총액은 월 예상 수령액 × 근로 개월 수로 계산합니다.",
    "방학 집중근로 총액은 방학 주당 근로시간과 방학 개월 수를 별도로 계산해 더합니다.",
    "실제 선발 여부, 배정 시간, 지급일은 대학별 운영 기준에 따라 달라집니다.",
  ],
};

export const NATIONAL_WORK_SCHOLARSHIP_RELATED_LINKS = [
  { href: "/tools/national-scholarship-calculator-2026/", label: "국가장학금 계산기 2026", description: "국가장학금과 국가근로를 함께 신청하는 흐름에 맞춰 확인합니다." },
  { href: "/tools/student-loan-repayment-calculator-2026/", label: "학자금대출 상환 계산기", description: "부족한 등록금·생활비를 대출 상환액과 비교합니다." },
  { href: "/tools/university-cost-calculator-2026/", label: "대학 등록금·생활비 계산기", description: "2학기 전체 예산에서 국가근로 비중을 봅니다." },
];
