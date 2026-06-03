export interface InsuranceRateItem {
  id: string;
  name: string;
  base: string;
  employeeRate: number | null;
  employerRate: number | null;
  displayEmployee: string;
  displayEmployer: string;
  note: string;
}

export interface SalaryExample {
  monthlySalary: number;
  taxFreeAmount: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  estimatedIncomeTax: number;
  estimatedLocalTax: number;
  totalDeduction: number;
  estimatedNetPay: number;
}

export interface PayrollFaq {
  question: string;
  answer: string;
}

export const EMPLOYEE_TAX_INSURANCE_META = {
  title: "2026 직장인 세금·4대보험 요율표",
  subtitle:
    "국민연금, 건강보험, 장기요양보험, 고용보험, 근로소득세, 지방소득세가 월급에서 어떻게 빠지는지 급여명세서 기준으로 정리했습니다.",
  updatedAt: "최근 업데이트: 2026.06.03",
};

export const INSURANCE_RATES_2026 = {
  nationalPensionTotal: 0.095,
  nationalPensionEmployee: 0.0475,
  nationalPensionEmployer: 0.0475,
  nationalPensionMinMonthlyBase: 410_000,
  nationalPensionMaxMonthlyBase: 6_590_000,
  healthInsuranceTotal: 0.0719,
  healthInsuranceEmployee: 0.03595,
  healthInsuranceEmployer: 0.03595,
  longTermCareRateOnHealth: 0.1314,
  employmentInsuranceEmployee: 0.009,
  employmentInsuranceEmployerBase: 0.009,
  localIncomeTaxRate: 0.1,
};

export const INSURANCE_RATE_ITEMS: InsuranceRateItem[] = [
  {
    id: "national-pension",
    name: "국민연금",
    base: "기준소득월액",
    employeeRate: INSURANCE_RATES_2026.nationalPensionEmployee,
    employerRate: INSURANCE_RATES_2026.nationalPensionEmployer,
    displayEmployee: "4.75%",
    displayEmployer: "4.75%",
    note: "2026년부터 단계 인상된 보험료율을 적용합니다. 기준소득월액 상한·하한이 있어 월급 전체에 무제한으로 곱하지 않습니다.",
  },
  {
    id: "health-insurance",
    name: "건강보험",
    base: "보수월액",
    employeeRate: INSURANCE_RATES_2026.healthInsuranceEmployee,
    employerRate: INSURANCE_RATES_2026.healthInsuranceEmployer,
    displayEmployee: "3.595%",
    displayEmployer: "3.595%",
    note: "직장가입자는 건강보험료율을 근로자와 사용자가 절반씩 부담합니다.",
  },
  {
    id: "long-term-care",
    name: "장기요양보험",
    base: "건강보험료",
    employeeRate: INSURANCE_RATES_2026.longTermCareRateOnHealth,
    employerRate: INSURANCE_RATES_2026.longTermCareRateOnHealth,
    displayEmployee: "건강보험료의 13.14%",
    displayEmployer: "건강보험료의 13.14%",
    note: "월급에 직접 곱하는 항목이 아니라 산출된 건강보험료에 붙는 보험료입니다.",
  },
  {
    id: "employment-insurance",
    name: "고용보험",
    base: "보수월액",
    employeeRate: INSURANCE_RATES_2026.employmentInsuranceEmployee,
    employerRate: INSURANCE_RATES_2026.employmentInsuranceEmployerBase,
    displayEmployee: "0.9%",
    displayEmployer: "0.9%+",
    note: "근로자 부담은 실업급여 보험료 중심입니다. 회사 부담은 고용안정·직업능력개발사업 요율이 사업장 규모에 따라 더해질 수 있습니다.",
  },
  {
    id: "workers-compensation",
    name: "산재보험",
    base: "업종별 보수총액",
    employeeRate: null,
    employerRate: null,
    displayEmployee: "부담 없음",
    displayEmployer: "업종별 상이",
    note: "산재보험은 근로자 월급에서 공제되는 항목이 아니라 회사가 부담하는 보험료입니다.",
  },
];

export const PAYROLL_DEDUCTION_ITEMS = [
  {
    title: "4대보험",
    body: "국민연금, 건강보험, 장기요양보험, 고용보험이 월급에서 먼저 공제됩니다. 산재보험은 회사 부담으로 구분해서 봐야 합니다.",
  },
  {
    title: "근로소득세",
    body: "국세청 근로소득 간이세액표를 기준으로 매월 원천징수됩니다. 부양가족 수와 비과세 금액에 따라 달라집니다.",
  },
  {
    title: "지방소득세",
    body: "매월 원천징수되는 근로소득세의 10%를 지방소득세로 함께 공제합니다.",
  },
];

export const SALARY_EXAMPLES_2026: SalaryExample[] = [
  {
    monthlySalary: 3_000_000,
    taxFreeAmount: 200_000,
    nationalPension: 133_000,
    healthInsurance: 100_660,
    longTermCare: 13_230,
    employmentInsurance: 25_200,
    estimatedIncomeTax: 23_000,
    estimatedLocalTax: 2_300,
    totalDeduction: 297_390,
    estimatedNetPay: 2_702_610,
  },
  {
    monthlySalary: 4_000_000,
    taxFreeAmount: 200_000,
    nationalPension: 180_500,
    healthInsurance: 136_610,
    longTermCare: 17_950,
    employmentInsurance: 34_200,
    estimatedIncomeTax: 88_000,
    estimatedLocalTax: 8_800,
    totalDeduction: 466_060,
    estimatedNetPay: 3_533_940,
  },
  {
    monthlySalary: 5_000_000,
    taxFreeAmount: 200_000,
    nationalPension: 228_000,
    healthInsurance: 172_560,
    longTermCare: 22_670,
    employmentInsurance: 43_200,
    estimatedIncomeTax: 185_000,
    estimatedLocalTax: 18_500,
    totalDeduction: 669_930,
    estimatedNetPay: 4_330_070,
  },
];

export const PAYROLL_READING_STEPS = [
  "지급 항목에서 기본급, 식대, 성과급, 기타수당을 먼저 나눠 봅니다.",
  "비과세 식대처럼 4대보험·소득세 기준에서 제외되는 금액이 있는지 확인합니다.",
  "국민연금은 상한·하한 적용 여부를 확인합니다.",
  "건강보험과 장기요양보험은 따로 보이지만 장기요양보험은 건강보험료에 연동됩니다.",
  "소득세와 지방소득세는 4대보험이 아니라 세금 공제 항목입니다.",
];

export const EMPLOYEE_TAX_INSURANCE_FAQ: PayrollFaq[] = [
  {
    question: "4대보험은 세금인가요?",
    answer:
      "엄밀히는 세금이 아니라 사회보험료입니다. 국민연금, 건강보험, 장기요양보험, 고용보험은 보험료이고 근로소득세와 지방소득세는 세금입니다.",
  },
  {
    question: "산재보험도 월급에서 빠지나요?",
    answer:
      "아닙니다. 산재보험은 원칙적으로 회사가 전액 부담합니다. 급여명세서에서 근로자 공제 항목처럼 해석하면 안 됩니다.",
  },
  {
    question: "국민연금은 월급이 오르면 계속 늘어나나요?",
    answer:
      "기준소득월액 상한액이 있어 일정 월급 이상부터는 국민연금 공제액이 같은 금액으로 묶입니다. 반대로 하한액보다 낮은 소득은 하한액 기준이 적용됩니다.",
  },
  {
    question: "소득세가 같은 월급이어도 다른 이유는 무엇인가요?",
    answer:
      "부양가족 수, 자녀 수, 비과세 처리, 회사의 간이세액표 선택률 등에 따라 월 원천징수액이 달라질 수 있습니다.",
  },
];

export const EMPLOYEE_TAX_INSURANCE_RELATED = [
  { href: "/tools/four-insurance-calculator/", label: "4대보험 계산기 2026" },
  { href: "/tools/salary/", label: "연봉 인상 계산기" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급 계산기" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상수령액 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
];

export function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

