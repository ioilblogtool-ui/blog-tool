import { INSURANCE_RATES_2026 } from "./employeeTaxInsuranceRates2026";

export interface FourInsurancePreset {
  label: string;
  monthlySalary: number;
  taxFreeAmount: number;
}

export interface FourInsuranceGuide {
  title: string;
  body: string;
}

export const FOUR_INSURANCE_DEFAULT_INPUT = {
  monthlySalary: 4_000_000,
  taxFreeAmount: 200_000,
  dependents: 1,
  childrenUnder20: 0,
  applyNationalPension: true,
  applyEmploymentInsurance: true,
  showEmployerShare: true,
};

export const FOUR_INSURANCE_PRESETS: FourInsurancePreset[] = [
  { label: "월 300만원", monthlySalary: 3_000_000, taxFreeAmount: 200_000 },
  { label: "월 400만원", monthlySalary: 4_000_000, taxFreeAmount: 200_000 },
  { label: "월 500만원", monthlySalary: 5_000_000, taxFreeAmount: 200_000 },
  { label: "월 700만원", monthlySalary: 7_000_000, taxFreeAmount: 200_000 },
];

export const FOUR_INSURANCE_GUIDES: FourInsuranceGuide[] = [
  {
    title: "국민연금",
    body: "2026년 사업장가입자는 기준소득월액의 4.75%를 근로자가 부담합니다. 상한액과 하한액이 있어 고소득자는 일정 금액에서 공제액이 멈춥니다.",
  },
  {
    title: "건강보험·장기요양",
    body: "건강보험은 보수월액의 3.595%를 근로자가 부담하고, 장기요양보험은 산출된 건강보험료에 13.14%를 곱해 계산합니다.",
  },
  {
    title: "고용보험",
    body: "근로자 부담분은 보수월액의 0.9%로 계산합니다. 회사 부담분은 사업장 규모와 업종에 따라 추가 요율이 붙을 수 있습니다.",
  },
  {
    title: "소득세",
    body: "이 계산기의 소득세는 급여명세서 이해를 돕기 위한 간이 추정입니다. 실제 원천징수액은 국세청 간이세액표와 회사 선택률에 따라 달라집니다.",
  },
];

export const FOUR_INSURANCE_RELATED = [
  { href: "/reports/employee-tax-insurance-rates-2026/", label: "2026 직장인 세금·4대보험 요율표" },
  { href: "/tools/salary/", label: "연봉 인상 계산기" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급 계산기" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상수령액 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
];

export const FOUR_INSURANCE_FAQ = [
  {
    question: "4대보험 계산기는 실제 급여명세서와 완전히 같나요?",
    answer:
      "아닙니다. 2026년 공개 요율을 기준으로 한 모의 계산입니다. 실제 공제액은 회사의 급여 기준, 비과세 처리, 보수월액 정산, 간이세액표 선택률에 따라 달라질 수 있습니다.",
  },
  {
    question: "산재보험은 왜 결과에 근로자 부담으로 안 나오나요?",
    answer:
      "산재보험은 근로자가 아니라 회사가 부담하는 보험료입니다. 그래서 실수령액에서 빠지는 항목으로 계산하지 않습니다.",
  },
  {
    question: "비과세 금액은 왜 입력하나요?",
    answer:
      "식대 등 비과세 항목은 소득세와 일부 보험료 계산 기준에서 제외될 수 있어 실수령액 추정에 영향을 줍니다.",
  },
];

export const FOUR_INSURANCE_CONFIG = {
  rates: INSURANCE_RATES_2026,
  defaults: FOUR_INSURANCE_DEFAULT_INPUT,
  presets: FOUR_INSURANCE_PRESETS,
};

