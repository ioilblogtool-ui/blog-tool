export type BonusPaymentMethod = "single" | "twoInstallments" | "fourInstallments";
export type IncomeTaxMode = "simple" | "conservative" | "manual";

export interface BonusAfterTaxInput {
  taxYear: number;
  bonusGrossAmount: number;
  annualSalary: number;
  monthlySalaryOverride: number | null;
  paymentMethod: BonusPaymentMethod;
  paymentMonth: number;
  dependentCount: number;
  childUnder20Count: number;
  includeLocalIncomeTax: boolean;
  includeSocialInsurance: boolean;
  includeNationalPension: boolean;
  includeHealthInsurance: boolean;
  includeLongTermCare: boolean;
  includeEmploymentInsurance: boolean;
  assumePensionCapReached: boolean;
  incomeTaxMode: IncomeTaxMode;
  manualWithholdingRate: number;
  nonTaxableAmount: number;
}

export interface SocialInsuranceYearConfig {
  year: number;
  nationalPensionEmployeeRate: number;
  nationalPensionMonthlyIncomeMin: number;
  nationalPensionMonthlyIncomeMax: number;
  healthInsuranceEmployeeRate: number;
  longTermCareRateOnHealthInsurance: number;
  employmentInsuranceEmployeeRate: number;
  sourceLabel: string;
  sourceUpdatedAt: string;
  notes: string[];
}

export interface SimpleIncomeTaxBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  baseWithholdingRate: number;
  conservativeRate: number;
  label: string;
}

export interface BonusAfterTaxPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<BonusAfterTaxInput>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const BAT_META = {
  title: "성과급 세후 실수령액 계산기",
  seoTitle: "성과급 세금 계산기 - 세후 실수령액과 공제액 계산",
  seoDescription:
    "성과급 총액과 연봉을 입력해 소득세, 지방소득세, 4대보험을 차감한 세후 실수령액을 계산하세요. 성과급 3천만 원을 받으면 실제 통장에 얼마가 들어오는지 간이 추정할 수 있습니다.",
  dataNote:
    "이 계산기는 근로소득 간이세액표 전체를 대체하지 않는 간이 추정 도구입니다. 실제 원천징수액과 연말정산 결과는 회사 급여 시스템, 부양가족, 지급월, 보험료 상한에 따라 달라질 수 있습니다.",
};

export const BAT_DEFAULT_INPUT: BonusAfterTaxInput = {
  taxYear: 2026,
  bonusGrossAmount: 30_000_000,
  annualSalary: 90_000_000,
  monthlySalaryOverride: null,
  paymentMethod: "single",
  paymentMonth: 2,
  dependentCount: 1,
  childUnder20Count: 0,
  includeLocalIncomeTax: true,
  includeSocialInsurance: true,
  includeNationalPension: true,
  includeHealthInsurance: true,
  includeLongTermCare: true,
  includeEmploymentInsurance: true,
  assumePensionCapReached: false,
  incomeTaxMode: "simple",
  manualWithholdingRate: 20,
  nonTaxableAmount: 0,
};

export const BAT_INSURANCE_CONFIGS: SocialInsuranceYearConfig[] = [
  {
    year: 2026,
    nationalPensionEmployeeRate: 4.75,
    nationalPensionMonthlyIncomeMin: 400_000,
    nationalPensionMonthlyIncomeMax: 6_370_000,
    healthInsuranceEmployeeRate: 3.595,
    longTermCareRateOnHealthInsurance: 13.14,
    employmentInsuranceEmployeeRate: 0.9,
    sourceLabel: "2026년 공개 요율 기준 간이 반영",
    sourceUpdatedAt: "2026-05-21",
    notes: [
      "국민연금 기준소득월액 상한은 적용 시점에 따라 달라질 수 있어 기본값은 보수적으로 둡니다.",
      "건강보험과 장기요양보험은 보수총액 신고와 정산 방식에 따라 실제 공제 시점이 달라질 수 있습니다.",
      "성과급의 4대보험 반영 여부는 회사 급여 처리 방식에 따라 다를 수 있습니다.",
    ],
  },
];

export const BAT_TAX_BRACKETS: SimpleIncomeTaxBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, baseWithholdingRate: 8, conservativeRate: 10, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_000, maxAnnualSalary: 80_000_000, baseWithholdingRate: 12, conservativeRate: 15, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_000, maxAnnualSalary: 120_000_000, baseWithholdingRate: 18, conservativeRate: 22, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_000, maxAnnualSalary: 200_000_000, baseWithholdingRate: 24, conservativeRate: 28, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_000, maxAnnualSalary: null, baseWithholdingRate: 30, conservativeRate: 35, label: "2억 원 초과" },
];

export const BAT_PRESETS: BonusAfterTaxPreset[] = [
  {
    id: "bonus-5m",
    label: "성과급 500만 원",
    description: "일반 직장인 보너스 실수령액을 빠르게 확인합니다.",
    input: { bonusGrossAmount: 5_000_000, annualSalary: 60_000_000 },
  },
  {
    id: "bonus-10m",
    label: "성과급 1,000만 원",
    description: "중간 규모 특별상여의 세후 금액을 추정합니다.",
    input: { bonusGrossAmount: 10_000_000, annualSalary: 70_000_000 },
  },
  {
    id: "bonus-30m",
    label: "성과급 3,000만 원",
    description: "대기업 성과급 검색 수요가 큰 대표 시나리오입니다.",
    input: { bonusGrossAmount: 30_000_000, annualSalary: 90_000_000 },
  },
  {
    id: "bonus-50m",
    label: "성과급 5,000만 원",
    description: "반도체·자동차 고성과급 구간을 보수적으로 봅니다.",
    input: { bonusGrossAmount: 50_000_000, annualSalary: 120_000_000, incomeTaxMode: "conservative" },
  },
  {
    id: "executive",
    label: "임원급 성과급",
    description: "고소득자 성과급의 공제 체감을 확인합니다.",
    input: { bonusGrossAmount: 100_000_000, annualSalary: 200_000_000, incomeTaxMode: "conservative" },
  },
];

export const BAT_FAQ: FaqItem[] = [
  {
    question: "성과급에도 세금이 붙나요?",
    answer:
      "일반적으로 성과급은 근로소득으로 보아 소득세와 지방소득세 원천징수 대상이 될 수 있습니다. 실제 원천징수액은 회사 급여 시스템, 지급월, 부양가족, 연봉 구간에 따라 달라집니다.",
  },
  {
    question: "성과급에도 4대보험이 공제되나요?",
    answer:
      "성과급 성격과 보수 반영 방식에 따라 국민연금, 건강보험, 장기요양보험, 고용보험이 반영될 수 있습니다. 다만 상한, 정산, 신고 방식 때문에 지급월 급여명세서와 계산 결과가 다를 수 있습니다.",
  },
  {
    question: "성과급 3천만 원이면 세후 얼마인가요?",
    answer:
      "연봉, 부양가족, 4대보험 반영 여부에 따라 달라집니다. 이 계산기에서 성과급 3천만 원 프리셋을 선택하면 소득세와 4대보험을 차감한 간이 실수령액을 확인할 수 있습니다.",
  },
  {
    question: "성과급 세금은 연말정산 때 다시 정산되나요?",
    answer:
      "가능합니다. 성과급 지급 시 원천징수된 세금은 최종 세액이 아니며, 연말정산에서 전체 소득과 공제를 반영해 환급 또는 추가 납부가 발생할 수 있습니다.",
  },
  {
    question: "회사별 성과급 계산기 결과와 왜 다를 수 있나요?",
    answer:
      "회사별 계산기는 주로 세전 성과급을 추정합니다. 이 계산기는 세전 성과급에서 세금과 보험료를 뺀 실수령액을 추정하므로 결과 기준이 다릅니다.",
  },
];

export const BAT_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" },
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/hyundai-bonus/", label: "현대자동차 성과급 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];
