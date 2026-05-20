export type LoanType = "mortgage" | "jeonse" | "credit" | "other";
export type RepaymentType = "annuity" | "equalPrincipal" | "bullet";
export type RateType = "fixed" | "variable" | "mixed";

export interface LoanTypePreset {
  id: LoanType;
  label: string;
  defaultBalance: number;
  defaultCurrentRate: number;
  defaultNewRate: number;
  defaultRemainingMonths: number;
  defaultRepaymentType: RepaymentType;
  defaultPenaltyRate: number;
  defaultPenaltyTotalMonths: number;
  note: string;
}

export interface LoanRefinancingInput {
  loanType: LoanType;
  currentBalance: number;
  currentAnnualRate: number;
  remainingMonths: number;
  currentRepaymentType: RepaymentType;
  currentRateType: RateType;
  newAnnualRate: number;
  newTermMonths: number;
  newRepaymentType: RepaymentType;
  newRateType: RateType;
  prepaymentPenaltyRate: number;
  penaltyRemainingMonths: number;
  penaltyTotalMonths: number;
  penaltyExemptAmount: number;
  newLoanCosts: number;
  rateScenarioDelta: number;
}

export interface LoanRefinancingPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<LoanRefinancingInput>;
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

export const LRC_META = {
  title: "대출 갈아타기 계산기 | 월 납입금·이자 절감액·손익분기 계산",
  description:
    "현재 대출 잔액·금리·남은 기간과 신규 대출 금리, 중도상환수수료를 입력하면 대출 갈아타기 시 월 납입금 절감액, 총 이자 절감액, 손익분기 시점을 계산합니다.",
  updatedAt: "2026년 5월 기준",
} as const;

export const LRC_LOAN_TYPE_PRESETS: LoanTypePreset[] = [
  {
    id: "mortgage",
    label: "주택담보대출",
    defaultBalance: 300_000_000,
    defaultCurrentRate: 0.048,
    defaultNewRate: 0.041,
    defaultRemainingMonths: 240,
    defaultRepaymentType: "annuity",
    defaultPenaltyRate: 0.012,
    defaultPenaltyTotalMonths: 36,
    note: "주담대는 중도상환수수료, 근저당 설정 관련 비용, DSR/LTV를 함께 확인해야 합니다.",
  },
  {
    id: "jeonse",
    label: "전세자금대출",
    defaultBalance: 150_000_000,
    defaultCurrentRate: 0.045,
    defaultNewRate: 0.038,
    defaultRemainingMonths: 24,
    defaultRepaymentType: "bullet",
    defaultPenaltyRate: 0.007,
    defaultPenaltyTotalMonths: 24,
    note: "전세대출은 보증기관, 보증료, 전세계약 만기와 대출 만기를 함께 확인해야 합니다.",
  },
  {
    id: "credit",
    label: "신용대출",
    defaultBalance: 30_000_000,
    defaultCurrentRate: 0.075,
    defaultNewRate: 0.059,
    defaultRemainingMonths: 60,
    defaultRepaymentType: "annuity",
    defaultPenaltyRate: 0.005,
    defaultPenaltyTotalMonths: 12,
    note: "신용대출은 한도, 신용점수 영향, 마이너스통장 여부를 함께 확인하세요.",
  },
  {
    id: "other",
    label: "직접 입력",
    defaultBalance: 100_000_000,
    defaultCurrentRate: 0.05,
    defaultNewRate: 0.042,
    defaultRemainingMonths: 120,
    defaultRepaymentType: "annuity",
    defaultPenaltyRate: 0.01,
    defaultPenaltyTotalMonths: 36,
    note: "대출 약정서 기준으로 금리, 수수료율, 남은 기간을 직접 입력하세요.",
  },
];

export const LRC_DEFAULT_INPUT: LoanRefinancingInput = {
  loanType: "mortgage",
  currentBalance: 300_000_000,
  currentAnnualRate: 0.048,
  remainingMonths: 240,
  currentRepaymentType: "annuity",
  currentRateType: "variable",
  newAnnualRate: 0.041,
  newTermMonths: 240,
  newRepaymentType: "annuity",
  newRateType: "fixed",
  prepaymentPenaltyRate: 0.012,
  penaltyRemainingMonths: 12,
  penaltyTotalMonths: 36,
  penaltyExemptAmount: 0,
  newLoanCosts: 0,
  rateScenarioDelta: 0.005,
};

export const LRC_PRESETS: LoanRefinancingPreset[] = [
  {
    id: "mortgage-rate-cut",
    label: "주담대 0.7%p 인하",
    description: "잔액 3억 원, 20년 남은 주담대를 더 낮은 금리로 비교합니다.",
    input: {
      loanType: "mortgage",
      currentBalance: 300_000_000,
      currentAnnualRate: 0.048,
      newAnnualRate: 0.041,
      remainingMonths: 240,
      newTermMonths: 240,
      currentRepaymentType: "annuity",
      newRepaymentType: "annuity",
      prepaymentPenaltyRate: 0.012,
      penaltyRemainingMonths: 12,
      penaltyTotalMonths: 36,
    },
  },
  {
    id: "jeonse-bullet",
    label: "전세대출 갈아타기",
    description: "만기일시 전세대출의 월 이자 절감액을 비교합니다.",
    input: {
      loanType: "jeonse",
      currentBalance: 150_000_000,
      currentAnnualRate: 0.045,
      newAnnualRate: 0.038,
      remainingMonths: 24,
      newTermMonths: 24,
      currentRepaymentType: "bullet",
      newRepaymentType: "bullet",
      prepaymentPenaltyRate: 0.007,
      penaltyRemainingMonths: 8,
      penaltyTotalMonths: 24,
    },
  },
  {
    id: "credit-refinance",
    label: "신용대출 대환",
    description: "고금리 신용대출을 낮은 금리로 바꾸는 경우입니다.",
    input: {
      loanType: "credit",
      currentBalance: 30_000_000,
      currentAnnualRate: 0.075,
      newAnnualRate: 0.059,
      remainingMonths: 60,
      newTermMonths: 60,
      currentRepaymentType: "annuity",
      newRepaymentType: "annuity",
      prepaymentPenaltyRate: 0.005,
      penaltyRemainingMonths: 6,
      penaltyTotalMonths: 12,
    },
  },
  {
    id: "term-extension",
    label: "기간 연장 대환",
    description: "월 납입금은 줄지만 총이자가 늘 수 있는 시나리오입니다.",
    input: {
      loanType: "mortgage",
      currentBalance: 200_000_000,
      currentAnnualRate: 0.045,
      newAnnualRate: 0.04,
      remainingMonths: 120,
      newTermMonths: 240,
      currentRepaymentType: "annuity",
      newRepaymentType: "annuity",
    },
  },
];

export const LRC_INFO_LINES = [
  "이 계산기는 입력한 대출 조건을 바탕으로 한 예상 손익 계산입니다. 실제 대환 가능 여부, 금리, 한도, 수수료, 부대비용은 금융회사 심사와 약정 조건에 따라 달라질 수 있습니다.",
  "신규 대출 기간을 기존 잔여 기간보다 길게 설정하면 월 납입금은 줄어도 총이자가 증가할 수 있습니다. 월 부담과 총비용을 함께 확인하세요.",
  "변동금리는 향후 금리 변동에 따라 월 납입금이 달라질 수 있습니다. 금리 상승 시나리오에서도 손익분기점이 유지되는지 확인하세요.",
  "일부 대출 비교 링크에는 제휴 링크가 포함될 수 있으며, 특정 금융회사 승인이나 최저금리를 보장하지 않습니다.",
];

export const LRC_FAQ: FaqItem[] = [
  {
    question: "금리가 얼마나 낮아져야 갈아타는 게 유리한가요?",
    answer:
      "대출 잔액, 남은 기간, 중도상환수수료, 신규 대출 부대비용에 따라 달라집니다. 대출 잔액이 크고 남은 기간이 길수록 작은 금리 차이도 절감액이 커질 수 있습니다.",
  },
  {
    question: "월 납입금이 줄면 무조건 이득인가요?",
    answer:
      "아닙니다. 신규 대출 기간을 길게 늘리면 월 납입금은 줄어도 총이자는 오히려 늘어날 수 있습니다. 월 납입금과 총이자를 함께 비교해야 합니다.",
  },
  {
    question: "중도상환수수료가 있으면 갈아타지 않는 게 낫나요?",
    answer:
      "꼭 그렇지는 않습니다. 월 납입금 절감액이나 총 이자 절감액이 수수료보다 크고, 수수료 회수 기간 이후에도 대출을 유지할 계획이라면 갈아타기가 유리할 수 있습니다.",
  },
  {
    question: "고정금리에서 변동금리로 갈아타도 괜찮을까요?",
    answer:
      "변동금리는 초기 금리가 낮을 수 있지만 향후 금리 상승 위험이 있습니다. 기준 시나리오뿐 아니라 금리 상승 시나리오에서도 순절감액이 남는지 확인해야 합니다.",
  },
  {
    question: "대출 갈아타기 계산 결과가 실제 은행 승인 결과와 같나요?",
    answer:
      "아니요. 이 계산기는 비용과 이자 절감액을 추정하는 도구입니다. 실제 승인 여부, 금리, 한도는 DSR, LTV, 신용점수, 소득, 담보가치, 은행 심사 기준에 따라 달라질 수 있습니다.",
  },
  {
    question: "전세대출도 이 계산기로 비교할 수 있나요?",
    answer:
      "가능합니다. 전세대출은 만기일시 상환 구조가 많으므로 상환 방식을 만기일시로 선택하면 월 이자 절감액 중심으로 비교할 수 있습니다. 보증료와 보증기관 조건도 함께 확인하세요.",
  },
];

export const LRC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/mortgage-prepayment-penalty/",
    label: "중도상환수수료 계산기",
    description: "수수료 자체를 더 자세히 계산하고 면제 시점을 확인합니다.",
  },
  {
    href: "/reports/seoul-mortgage-refinancing-2026/",
    label: "서울 주요 구별 대환대출 손익 비교 2026",
    description: "지역별 주담대 대환 손익 시뮬레이션을 함께 봅니다.",
  },
  {
    href: "/tools/real-estate-acquisition-tax/",
    label: "부동산 취득세 계산기",
    description: "주택 매수와 대출 계획을 함께 점검합니다.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급액 계산기",
    description: "현금흐름과 세금 환급액을 함께 확인합니다.",
  },
];
