export interface PensionBackPaymentInput {
  monthlyIncome: number;
  missingMonths: number;
  birthYear: number;
  existingEnrolledMonths: number;
  expectedMonthlyPensionIncrease: number;
  installmentMonths: number;
  installmentAnnualRate: number;
  lifeExpectancy: number;
  discountRate: number;
}

export interface PensionBackPaymentResult {
  monthlyPremium: number;
  totalBackPayment: number;
  recognizedYears: number;
  currentAge: number;
  pensionStartAge: number;
  breakEvenMonths: number;
  breakEvenYears: number;
  ageAtBreakEven: number;
  installmentMonthlyPayment: number;
  installmentTotalInterest: number;
  installmentTotalWithInterest: number;
  totalEnrolledMonthsAfter: number;
  minEnrollmentMet: boolean;
  overLimitWarning: boolean;
  yearsReceivingAtLifeExpectancy: number;
  totalPensionAtLifeExpectancy: number;
  netProfitAtLifeExpectancy: number;
  simpleReturnRatePercent: number;
  presentValueOfPension: number;
  netProfitPresentValue: number;
}

export const PENSION_BACKPAY_META = {
  slug: "national-pension-back-payment-calculator-2026",
  title: "국민연금 추납 손익 계산기",
  seoTitle: "국민연금 추납 손익 계산기 2026 | 추후납부 회수기간 계산",
  seoDescription:
    "월 기준소득·추납 개월수 입력하면 추납 보험료 총액과 회수기간, 기대수명 기준 순이익 바로 계산. 분할납부 이자·현재가치 시뮬레이션 포함.",
  updatedAt: "2026-07-23",
  dataNote:
    "2026년 7월~2027년 6월 기준소득월액 하한 41만원·상한 659만원, 2026년 국민연금 보험료율 9.5%(2033년까지 매년 0.5%p씩 13%까지 단계 인상)를 기준으로 추납 보험료를 참고 계산합니다. 실제 추납 가능 기간과 연금 증가액은 국민연금공단 상담 결과가 우선입니다.",
};

const CURRENT_YEAR = 2026;
export const MIN_ENROLLMENT_MONTHS = 120;
export const MAX_BACKPAY_MONTHS = 119;
export const MAX_INSTALLMENT_MONTHS = 60;

export const PENSION_BACKPAY_DEFAULT_INPUT: PensionBackPaymentInput = {
  monthlyIncome: 2_700_000,
  missingMonths: 36,
  birthYear: 1981,
  existingEnrolledMonths: 96,
  expectedMonthlyPensionIncrease: 90_000,
  installmentMonths: 24,
  installmentAnnualRate: 2.5,
  lifeExpectancy: 85,
  discountRate: 2.5,
};

export const PENSION_BACKPAY_LIMITS = {
  minMonthlyIncome: 410_000,
  maxMonthlyIncome: 6_590_000,
  premiumRate: 0.095,
};

export const PENSION_BACKPAY_PRESETS = [
  {
    id: "careerBreak",
    label: "경력공백 3년",
    summary: "월소득 270만·36개월",
    input: {
      monthlyIncome: 2_700_000,
      missingMonths: 36,
      birthYear: 1981,
      existingEnrolledMonths: 96,
      expectedMonthlyPensionIncrease: 90_000,
      installmentMonths: 24,
      installmentAnnualRate: 2.5,
      lifeExpectancy: 85,
      discountRate: 2.5,
    },
  },
  {
    id: "shortGap",
    label: "실직 공백 1년",
    summary: "월소득 220만·12개월",
    input: {
      monthlyIncome: 2_200_000,
      missingMonths: 12,
      birthYear: 1987,
      existingEnrolledMonths: 60,
      expectedMonthlyPensionIncrease: 28_000,
      installmentMonths: 12,
      installmentAnnualRate: 2.5,
      lifeExpectancy: 85,
      discountRate: 2.5,
    },
  },
  {
    id: "longGap",
    label: "장기 공백 8년",
    summary: "월소득 350만·96개월",
    input: {
      monthlyIncome: 3_500_000,
      missingMonths: 96,
      birthYear: 1974,
      existingEnrolledMonths: 60,
      expectedMonthlyPensionIncrease: 210_000,
      installmentMonths: 60,
      installmentAnnualRate: 2.5,
      lifeExpectancy: 85,
      discountRate: 2.5,
    },
  },
];

export function getPensionStartAge(birthYear: number): number {
  if (birthYear <= 1952) return 60;
  if (birthYear <= 1956) return 61;
  if (birthYear <= 1960) return 62;
  if (birthYear <= 1964) return 63;
  if (birthYear <= 1968) return 64;
  return 65;
}

export function calcNationalPensionBackPayment(input: PensionBackPaymentInput): PensionBackPaymentResult {
  const baseIncome = Math.min(Math.max(input.monthlyIncome, PENSION_BACKPAY_LIMITS.minMonthlyIncome), PENSION_BACKPAY_LIMITS.maxMonthlyIncome);
  const monthlyPremium = Math.round(baseIncome * PENSION_BACKPAY_LIMITS.premiumRate);
  const totalBackPayment = monthlyPremium * input.missingMonths;
  const recognizedYears = input.missingMonths / 12;

  const currentAge = CURRENT_YEAR - input.birthYear;
  const pensionStartAge = getPensionStartAge(input.birthYear);

  const breakEvenMonths = input.expectedMonthlyPensionIncrease > 0
    ? Math.ceil(totalBackPayment / input.expectedMonthlyPensionIncrease)
    : 0;
  const breakEvenYears = breakEvenMonths / 12;
  const ageAtBreakEven = pensionStartAge + breakEvenYears;

  const principalPerMonth = input.installmentMonths > 0 ? totalBackPayment / input.installmentMonths : 0;
  const installmentMonthlyRate = input.installmentAnnualRate / 100 / 12;
  const installmentTotalInterest = input.installmentMonths > 0
    ? Math.round(principalPerMonth * installmentMonthlyRate * (input.installmentMonths * (input.installmentMonths + 1)) / 2)
    : 0;
  const installmentTotalWithInterest = totalBackPayment + installmentTotalInterest;
  const installmentMonthlyPayment = input.installmentMonths > 0
    ? Math.ceil(installmentTotalWithInterest / input.installmentMonths)
    : totalBackPayment;

  const totalEnrolledMonthsAfter = input.existingEnrolledMonths + input.missingMonths;
  const minEnrollmentMet = totalEnrolledMonthsAfter >= MIN_ENROLLMENT_MONTHS;
  const overLimitWarning = input.missingMonths > MAX_BACKPAY_MONTHS;

  const yearsReceivingAtLifeExpectancy = Math.max(input.lifeExpectancy - pensionStartAge, 0);
  const totalPensionAtLifeExpectancy = Math.round(input.expectedMonthlyPensionIncrease * 12 * yearsReceivingAtLifeExpectancy);
  const netProfitAtLifeExpectancy = totalPensionAtLifeExpectancy - totalBackPayment;
  const simpleReturnRatePercent = totalBackPayment > 0 ? (netProfitAtLifeExpectancy / totalBackPayment) * 100 : 0;

  const deferralYears = Math.max(pensionStartAge - currentAge, 0);
  const discountRateDecimal = input.discountRate / 100;
  const annualPayment = input.expectedMonthlyPensionIncrease * 12;
  let presentValueOfPension = 0;
  if (yearsReceivingAtLifeExpectancy > 0) {
    if (discountRateDecimal > 0) {
      const annuityFactor = (1 - Math.pow(1 + discountRateDecimal, -yearsReceivingAtLifeExpectancy)) / discountRateDecimal;
      presentValueOfPension = (annualPayment * annuityFactor) / Math.pow(1 + discountRateDecimal, deferralYears);
    } else {
      presentValueOfPension = annualPayment * yearsReceivingAtLifeExpectancy;
    }
  }
  presentValueOfPension = Math.round(presentValueOfPension);
  const netProfitPresentValue = presentValueOfPension - totalBackPayment;

  return {
    monthlyPremium,
    totalBackPayment,
    recognizedYears,
    currentAge,
    pensionStartAge,
    breakEvenMonths,
    breakEvenYears,
    ageAtBreakEven,
    installmentMonthlyPayment,
    installmentTotalInterest,
    installmentTotalWithInterest,
    totalEnrolledMonthsAfter,
    minEnrollmentMet,
    overLimitWarning,
    yearsReceivingAtLifeExpectancy,
    totalPensionAtLifeExpectancy,
    netProfitAtLifeExpectancy,
    simpleReturnRatePercent,
    presentValueOfPension,
    netProfitPresentValue,
  };
}

export const PENSION_BACKPAY_RATE_SCHEDULE = [
  { year: 2025, rate: 9.0 },
  { year: 2026, rate: 9.5 },
  { year: 2027, rate: 10.0 },
  { year: 2028, rate: 10.5 },
  { year: 2029, rate: 11.0 },
  { year: 2030, rate: 11.5 },
  { year: 2031, rate: 12.0 },
  { year: 2032, rate: 12.5 },
  { year: 2033, rate: 13.0 },
];

export const PENSION_START_AGE_TABLE = [
  { birthYear: "1952년 이전", age: 60 },
  { birthYear: "1953~1956년", age: 61 },
  { birthYear: "1957~1960년", age: 62 },
  { birthYear: "1961~1964년", age: 63 },
  { birthYear: "1965~1968년", age: 64 },
  { birthYear: "1969년 이후", age: 65 },
];

export const PENSION_BACKPAY_RULES = [
  { label: "추납 대상", value: "납부예외·적용제외 등 보험료를 내지 못한 기간", note: "개별 가능 여부는 공단 확인" },
  { label: "보험료율", value: "2026년 9.5%", note: "2033년까지 매년 0.5%p씩 단계 인상되어 13%에 도달" },
  { label: "기준소득월액", value: "41만~659만원", note: "2026년 7월~2027년 6월 적용" },
  { label: "추납 가능 기간", value: "최대 119개월", note: "군복무기간 포함, 개인별 한도는 공단 조회 결과 우선" },
  { label: "분할납부", value: "최대 60회", note: "분할납부 시 정기예금 이자율 수준의 이자가 가산될 수 있음" },
  { label: "최소가입기간", value: "120개월(10년)", note: "노령연금 수급을 위한 최소 요건" },
  { label: "효과", value: "가입기간 인정", note: "노령연금 수급액 증가 가능" },
];

export const PENSION_BACKPAY_CHECKLIST_POSITIVE = [
  "국민연금 최소가입기간 10년이 부족한 경우",
  "추납으로 연금 수급권을 확보할 수 있는 경우",
  "은퇴 후 안정적인 평생 현금흐름이 필요한 경우",
  "당장 사용할 예정이 없는 여유자금이 있는 경우",
  "예상 회수기간이 본인의 기대수명보다 충분히 짧은 경우",
];

export const PENSION_BACKPAY_CHECKLIST_CAUTION = [
  "고금리 대출을 보유하고 있는 경우",
  "비상자금이 부족한 경우",
  "가까운 시기에 주택구입 등 큰 지출이 예정된 경우",
  "건강상태나 기대수명을 보수적으로 판단해야 하는 경우",
  "월 연금 증가액을 공단에서 확인하지 않은 경우",
  "분할납부 이자까지 고려하면 현금흐름 부담이 큰 경우",
];

export const PENSION_BACKPAY_PROCEDURE = [
  "국민연금공단 홈페이지 또는 모바일 앱에서 가입내역을 조회합니다.",
  "추납 신청 대상 기간이 있는지 확인합니다.",
  "예상연금액과 추납 전후 연금액을 비교합니다.",
  "일시납 또는 분할납 방식을 선택합니다.",
  "국민연금공단 심사 후 고지된 보험료를 납부합니다.",
  "납부 완료 후 가입기간 반영 여부를 확인합니다.",
];

export const PENSION_BACKPAY_FAQ = [
  {
    question: "국민연금 추납은 누구나 할 수 있나요?",
    answer:
      "아닙니다. 납부예외, 적용제외 등으로 보험료를 내지 못한 기간이 있고 국민연금공단에서 추후납부 가능 기간으로 인정해야 신청할 수 있습니다. 단순히 가입하지 않았던 모든 기간을 임의로 추납할 수 있는 것은 아닙니다.",
  },
  {
    question: "추납하면 무조건 이득인가요?",
    answer:
      "가입기간이 늘어 연금액이 증가할 수 있지만, 한 번에 내는 보험료와 실제 증가하는 월 연금액, 수급 기간, 현재 보유한 대출·비상자금 여력에 따라 손익이 달라집니다. 이 계산기는 회수기간과 기대수명 기준 순이익을 참고로 보여줍니다.",
  },
  {
    question: "추납보험료는 어떻게 계산하나요?",
    answer:
      "기본적으로 신청월 기준소득월액 × 납부기한이 속하는 달의 보험료율 × 추납 개월 수로 계산됩니다. 이 계산기는 2026년 보험료율 9.5%와 기준소득월액 상·하한을 적용해 단순 추정하며, 실제 고지액과는 차이가 있을 수 있습니다.",
  },
  {
    question: "추납 가능한 기간에 제한이 있나요?",
    answer:
      "군복무기간을 포함해 최대 119개월까지 신청할 수 있습니다. 개인별 실제 가능 기간은 국민연금공단 조회 결과에 따라 달라집니다.",
  },
  {
    question: "분할 납부도 가능한가요?",
    answer:
      "추납 가능 기간을 월 단위로 나누어 최대 60회 범위에서 분할납부할 수 있습니다. 분할납부 시에는 정기예금 이자율 수준의 이자가 가산되므로 총 납부액이 일시납보다 늘어날 수 있습니다.",
  },
  {
    question: "예상 월 연금 증가액은 어디서 확인하나요?",
    answer:
      "국민연금공단의 가입내역조회, 예상연금액 조회 또는 추납 신청 화면에서 확인할 수 있습니다. 계산기의 예상 연금 증가액에는 가능하면 공단에서 조회한 추납 전후 연금액 차이를 입력하세요.",
  },
  {
    question: "추납하면 납부한 금액을 전부 돌려받나요?",
    answer:
      "추납은 원금을 일정 기간 후 돌려주는 적금이나 예금이 아닙니다. 납부한 보험료는 가입기간으로 인정되어 향후 노령연금액을 높이는 방식으로 반영되며, 실제 수령 총액은 수급기간에 따라 달라집니다.",
  },
  {
    question: "연금 수급 개시 연령은 모두 65세인가요?",
    answer:
      "아닙니다. 출생연도에 따라 60세부터 65세까지 단계적으로 다르며, 1969년 이후 출생자는 65세부터 수급합니다. 이 계산기는 출생연도를 입력하면 해당 개시연령을 자동으로 적용합니다.",
  },
];

export const PENSION_BACKPAY_SEO_CONTENT = {
  introTitle: "국민연금 추납은 총액보다 회수기간과 기대수명 기준 순이익을 봐야 합니다",
  intro: [
    "국민연금 추후납부는 실직, 경력공백, 무소득 기간 등으로 보험료를 내지 못했던 기간을 나중에 채워 가입기간으로 인정받는 제도입니다. 가입기간이 늘면 노령연금 수급액이 증가할 수 있지만, 지금 내야 하는 보험료 총액도 커지기 때문에 단순히 '가능하면 무조건 한다'고 보기 어렵습니다.",
    "이 계산기는 월 기준소득, 추납 개월 수, 출생연도, 기존 가입기간, 예상 월 연금 증가액을 입력해 추납 총액과 회수기간, 기대수명 기준 총수령액과 순이익을 계산합니다. 예를 들어 3년치를 추납해 월 연금이 9만 원 늘어난다면, 총 납부액을 몇 년 만에 회수하고 기대수명까지 얼마나 더 받는지 확인할 수 있습니다.",
    "2026년 7월부터 2027년 6월까지 적용되는 기준소득월액은 41만 원부터 659만 원까지이고, 2026년 보험료율은 9.5%입니다. 국민연금 보험료율은 2025년 9%에서 시작해 매년 0.5%p씩 단계적으로 인상되어 2033년 13%에 도달할 예정이며, 추납보험료는 신청과 납부 시점의 보험료율을 적용받습니다.",
    "국민연금 추납 판단은 최소가입기간 충족 여부, 건강상태, 예상 수명, 현금흐름, 다른 연금 준비 상황까지 함께 봐야 합니다. 결과는 공단 상담 전 대략적인 예산과 회수기간을 가늠하는 참고 자료로 활용하세요.",
  ],
  criteria: [
    "월 기준소득은 2026년 7월 기준 하한 41만원, 상한 659만원으로 제한합니다.",
    "월 보험료는 기준소득월액 × 9.5%(2026년 보험료율)로 계산합니다.",
    "연금 개시연령은 출생연도별 지급개시연령 기준(1969년 이후 출생 65세)을 적용합니다.",
    "회수기간은 추납 총액 ÷ 예상 월 연금 증가액이며, 분할납부 총액에는 정기예금 이자율 수준의 이자를 가산합니다.",
    "기대수명 기준 총수령액과 현재가치는 입력한 기대수명·할인율을 적용한 단순 추정치입니다.",
    "실제 추납 가능 기간과 연금 증가액은 국민연금공단 조회 결과가 우선입니다.",
  ],
};

export const PENSION_BACKPAY_RELATED_LINKS = [
  { href: "/tools/national-pension-calculator/", label: "국민연금 수령액 계산기", description: "예상 노령연금 흐름을 확인합니다." },
  { href: "/reports/national-pension-generational-comparison-2026/", label: "국민연금 세대별 비교", description: "세대별 납부와 수령 구조를 정리합니다." },
  { href: "/tools/retirement-fund-depletion/", label: "은퇴자금 고갈 계산기", description: "연금 외 은퇴자금 지속 기간을 계산합니다." },
];
