export const MINIMUM_WAGE_2026 = 10_320;
export const MINIMUM_WAGE_2025 = 10_030;
export const MONTHLY_WEEKS = 365 / 7 / 12;
export const WEEKLY_HOLIDAY_MIN_HOURS = 15;
export const NONTAX_MEAL = 200_000;

export const INSURANCE_RATES = {
  nationalPension: 0.0475,
  healthInsurance: 0.03595,
  longTermCareRatio: 0.1295,
  employmentInsurance: 0.009,
} as const;

export interface IncomeTaxBracket {
  minIncome: number;
  maxIncome: number;
  monthlyTax: number;
}

export const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { minIncome: 0, maxIncome: 1_060_000, monthlyTax: 0 },
  { minIncome: 1_060_000, maxIncome: 1_500_000, monthlyTax: 19_520 },
  { minIncome: 1_500_000, maxIncome: 3_000_000, monthlyTax: 62_010 },
  { minIncome: 3_000_000, maxIncome: 4_500_000, monthlyTax: 152_960 },
  { minIncome: 4_500_000, maxIncome: Number.POSITIVE_INFINITY, monthlyTax: 298_010 },
];

export type HourlyMode = "auto" | "manual";
export type DeductionMode = "estimated" | "none" | "custom";

export interface MwcPreset {
  id: string;
  label: string;
  weeklyHours: number;
  dailyHours: number;
  weeklyDays: number;
  hourlyMode: HourlyMode;
  hourlyWage: number;
  includeWeeklyHoliday: boolean;
}

export interface RelatedCalculator {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const MWC_PRESETS: MwcPreset[] = [
  {
    id: "fulltime",
    label: "전일제 주 40시간",
    weeklyHours: 40,
    dailyHours: 8,
    weeklyDays: 5,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "parttime25",
    label: "평일 알바 주 25시간",
    weeklyHours: 25,
    dailyHours: 5,
    weeklyDays: 5,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "weekend16",
    label: "주말 알바 주 16시간",
    weeklyHours: 16,
    dailyHours: 8,
    weeklyDays: 2,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: true,
  },
  {
    id: "shorttime10",
    label: "단기 알바 주 10시간",
    weeklyHours: 10,
    dailyHours: 5,
    weeklyDays: 2,
    hourlyMode: "auto",
    hourlyWage: MINIMUM_WAGE_2026,
    includeWeeklyHoliday: false,
  },
  {
    id: "wage2027",
    label: "2027 확정 최저임금 (시급 10,700원)",
    weeklyHours: 40,
    dailyHours: 8,
    weeklyDays: 5,
    hourlyMode: "manual",
    hourlyWage: 10700,
    includeWeeklyHoliday: true,
  },
];

export const MWC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/overtime-pay-calculator/",
    label: "야근수당 계산기",
    description: "연장·야간·휴일근로 수당을 통상임금 기준으로 자동 계산합니다.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 인상 계산기",
    description: "연봉과 월 실수령 변화를 비교합니다.",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령액 계산기",
    description: "성과급에서 세금과 4대보험을 뺀 실수령 금액을 추정합니다.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 계산기",
    description: "연말정산 환급·추가납부 금액을 미리 계산합니다.",
  },
];

export const MWC_FAQS: FaqItem[] = [
  {
    question: "2026 최저임금은 얼마인가요?",
    answer: "2026년 적용 최저임금은 시간당 10,320원입니다. 주 40시간·유급주휴 8시간 포함 월 209시간 기준 월 환산액은 2,156,880원입니다.",
  },
  {
    question: "주휴수당은 무조건 받을 수 있나요?",
    answer: "주휴수당은 1주 소정근로시간이 15시간 이상인 근로자에게 발생합니다. 계약서에 적힌 소정근로시간이 기준이므로 실제 근무시간과 구분해야 합니다.",
  },
  {
    question: "알바 여러 군데 다니면 주휴수당이 합산되나요?",
    answer: "아닙니다. 주휴수당은 단일 사업장 기준으로 판단합니다. A사 주 10시간, B사 주 10시간처럼 각 사업장이 주 15시간 미만이면 주휴수당이 발생하지 않을 수 있습니다.",
  },
  {
    question: "수습 기간에도 최저임금을 다 받아야 하나요?",
    answer: "1년 이상 근로계약을 체결하고 3개월 이내 수습 중인 경우 최저임금의 90%까지 감액 적용이 가능한 예외가 있습니다. 단순노무 종사자 등 감액이 제한되는 경우도 있어 직종과 계약기간 확인이 필요합니다.",
  },
  {
    question: "최저임금보다 적게 받으면 어떻게 해야 하나요?",
    answer: "고용노동부 민원마당이나 고객상담센터 1350을 통해 임금체불 상담·신고를 진행할 수 있습니다. 최저임금 위반은 법적 제재 대상입니다.",
  },
  {
    question: "식대·교통비도 최저임금에 포함되나요?",
    answer: "매월 정기적으로 지급되는 상여금과 복리후생비는 일정 조건에서 최저임금 산입 범위에 포함될 수 있습니다. 이 계산기는 단순 시급 기준 도구이므로 복잡한 임금 구성은 노무 전문가 확인을 권장합니다.",
  },
  {
    question: "4대보험을 뺀 세후 금액으로 최저임금 충족 여부를 보나요?",
    answer: "아닙니다. 최저임금 충족 여부는 4대보험과 세금 공제 전의 세전 임금 기준으로 판단합니다.",
  },
  {
    question: "2027년 최저임금은 얼마인가요?",
    answer: "2027년 적용 최저임금은 시간당 10,700원으로 확정됐습니다. 2026년 시급 10,320원 대비 3.7% 인상된 금액이며, 주 40시간·월 209시간 기준 세전 월급은 2,236,300원입니다. 이 페이지 프리셋에서 '2027 확정 최저임금'을 선택하면 세후 실수령액까지 바로 확인할 수 있습니다.",
  },
  {
    question: "2027년 확정 최저임금 시급 10,700원이면 월급은 얼마인가요?",
    answer: "시급 10,700원 기준 주 40시간·월 209시간 적용 시 세전 월급은 2,236,300원입니다. 4대보험과 소득세를 공제하면 세후 실수령 추정액은 약 195만원 수준입니다. 정확한 금액은 이 페이지 프리셋에서 직접 확인하세요.",
  },
];

export const SEO_INTRO = [
  "아르바이트나 신입 직장인이라면 \"내 시급이 최저임금을 지키고 있는지\", \"이 시급이면 한 달에 얼마를 받는지\"가 가장 기본적이면서도 직접 계산하기는 번거로운 질문입니다. 2026년 적용 최저임금은 시간당 10,320원이며, 주 40시간 근무와 유급주휴 8시간을 포함한 월 209시간 기준 월 환산액은 2,156,880원입니다.",
  "이 계산기는 시급, 주 소정근로시간, 주휴수당 포함 여부를 바탕으로 일급·주급·월급·연봉을 환산합니다. 직접 시급을 입력하면 2026년 최저임금 충족 여부도 바로 확인할 수 있어, 본인이 받는 시급이 법정 기준에 미달하는지 아닌지를 별도 계산 없이 즉시 알 수 있습니다.",
  "2027년 최저임금은 시간당 10,700원으로 확정됐습니다. 2026년 대비 3.7% 인상된 금액으로, 월 2,236,300원(월 209시간 기준)에 해당합니다. 계산기 상단 프리셋에서 '2027 확정 최저임금'을 선택하면 시급 10,700원 기준 월급·세후 실수령액을 바로 확인할 수 있습니다.",
  "세후 실수령액은 4대보험과 간이세액을 단순 적용한 추정값입니다. 실제 원천징수액은 부양가족 수, 비과세 항목(식대 등), 회사의 급여 처리 방식에 따라 달라질 수 있으므로, 정확한 실수령액은 급여명세서나 회사 인사팀을 통해 다시 확인하는 것이 안전합니다. 특히 첫 급여를 받기 전이라면 이 차이를 미리 감안해두는 것이 좋습니다.",
];

export const SEO_CRITERIA = [
  "월 환산은 365일을 7일과 12개월로 나눈 월 평균 주 수를 사용합니다. 주 40시간 기준은 일반적으로 월 209시간으로 표시됩니다.",
  "주휴수당은 주 소정근로시간 15시간 이상일 때 발생하는 것으로 계산합니다. 주휴시간은 주 40시간 기준 최대 8시간입니다.",
  "최저임금 충족 여부는 세후 실수령액이 아니라 세전 시급 기준으로 판단합니다.",
  "2027년 최저임금은 시간당 10,700원(전년 대비 3.7% 인상)으로 확정·고시되었습니다.",
];

export const formatWon = (value: number): string => `${Math.round(value).toLocaleString("ko-KR")}원`;
export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

export const minimumWageMonthly = MINIMUM_WAGE_2026 * 209;
export const minimumWageAnnual = minimumWageMonthly * 12;
export const minimumWageIncreaseAmount = MINIMUM_WAGE_2026 - MINIMUM_WAGE_2025;
export const minimumWageIncreaseRate = (minimumWageIncreaseAmount / MINIMUM_WAGE_2025) * 100;
