export type LoanType = "mortgage" | "jeonse" | "credit" | "custom";

export interface LoanTypePreset {
  id: LoanType;
  label: string;
  defaultPenaltyRate: number;
  defaultLoanTermMonths: number;
  defaultRatePercent: number;
  note: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  summary: string;
  values: {
    loanType: LoanType;
    remainingPrincipal: number;
    penaltyRate: number;
    loanTermMonths: number;
    remainingMonths: number;
    annualRatePercent: number;
    prepaymentAmount: "full" | number;
  };
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

export const MPC_META = {
  title: "중도상환 수수료 계산기 | 지금 갚으면 얼마? 유불리 자동 계산",
  description:
    "대출 잔여 원금, 수수료율, 잔여 기간을 입력하면 중도상환 수수료와 이자 절감액을 비교해 유불리를 바로 확인합니다. 주담대·전세대출·신용대출 지원.",
} as const;

export const MPC_LOAN_TYPE_PRESETS: LoanTypePreset[] = [
  {
    id: "mortgage",
    label: "주택담보대출",
    defaultPenaltyRate: 0.014,
    defaultLoanTermMonths: 360,
    defaultRatePercent: 4.2,
    note: "기존 약정 기준 참고값입니다. 2025년 1월 13일 이후 신규 은행권 대출은 실비용 기준으로 인하된 수수료율이 적용될 수 있습니다.",
  },
  {
    id: "jeonse",
    label: "전세대출",
    defaultPenaltyRate: 0.012,
    defaultLoanTermMonths: 24,
    defaultRatePercent: 3.8,
    note: "만기 전 일정 기간에는 수수료가 면제되는 상품이 있습니다. 보증기관과 은행 약정 조건을 먼저 확인하세요.",
  },
  {
    id: "credit",
    label: "신용대출",
    defaultPenaltyRate: 0.007,
    defaultLoanTermMonths: 12,
    defaultRatePercent: 5.5,
    note: "신용대출은 상품별 편차가 큽니다. 일부 상품은 수수료가 없거나 1년 경과 후 면제될 수 있습니다.",
  },
  {
    id: "custom",
    label: "직접 입력",
    defaultPenaltyRate: 0.014,
    defaultLoanTermMonths: 120,
    defaultRatePercent: 4.0,
    note: "대출 약정서의 중도상환 수수료율, 약정 기간, 현재 금리를 직접 입력하세요.",
  },
];

export const MPC_DEFAULT_INPUT = {
  loanType: "mortgage" as LoanType,
  remainingPrincipal: 300_000_000,
  penaltyRate: 0.014,
  loanTermMonths: 360,
  remainingMonths: 24,
  annualRatePercent: 4.2,
  prepaymentMode: "full" as "full" | "partial",
  partialAmount: 100_000_000,
};

export const MPC_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "mortgage-early",
    label: "주담대 2년 내 조기상환",
    summary: "3억 주담대 · 잔여 24개월",
    values: {
      loanType: "mortgage",
      remainingPrincipal: 300_000_000,
      penaltyRate: 0.014,
      loanTermMonths: 360,
      remainingMonths: 24,
      annualRatePercent: 4.2,
      prepaymentAmount: "full",
    },
  },
  {
    id: "jeonse-expiry",
    label: "전세대출 만기 6개월 전",
    summary: "2억 전세대출 · 잔여 6개월",
    values: {
      loanType: "jeonse",
      remainingPrincipal: 200_000_000,
      penaltyRate: 0.012,
      loanTermMonths: 24,
      remainingMonths: 6,
      annualRatePercent: 3.8,
      prepaymentAmount: "full",
    },
  },
  {
    id: "credit-partial",
    label: "신용대출 부분 상환",
    summary: "5천만 신용대출 · 1천만 부분상환",
    values: {
      loanType: "credit",
      remainingPrincipal: 50_000_000,
      penaltyRate: 0.007,
      loanTermMonths: 12,
      remainingMonths: 8,
      annualRatePercent: 5.5,
      prepaymentAmount: 10_000_000,
    },
  },
];

export const MPC_INFO_LINES = [
  "이 계산기는 약정서 확인 전 빠르게 보는 참고용 추정값입니다. 실제 수수료는 금융기관 앱·영업점에서 최종 확인해야 합니다.",
  "2025년 1월 13일 이후 신규 은행·저축은행·보험사 등 대출은 실비용 기준 중도상환수수료율이 적용됩니다. 기존 약정 대출은 약정 조건이 유지될 수 있습니다.",
  "2026년 1월 1일부터 신규 취급 상호금융권 대출에도 같은 취지의 중도상환수수료 부과체계 개선이 적용될 예정입니다.",
  "절감 이자는 잔여 원금에 월 이자를 단순 적용한 근사값입니다. 원리금균등·원금균등·만기일시 방식별 실제값과 차이가 날 수 있습니다.",
];

export const MPC_FAQ: FaqItem[] = [
  {
    question: "중도상환 수수료 공식은 어떻게 되나요?",
    answer:
      "일반적으로 중도상환 원금에 수수료율을 곱하고, 다시 잔여 기간 비율을 곱합니다. 이 계산기는 일수 대신 개월 기준으로 단순화해 상환원금 × 수수료율 × 잔여개월/약정개월 방식으로 계산합니다.",
  },
  {
    question: "2026년에 주담대 중도상환 수수료가 폐지됐나요?",
    answer:
      "모든 주담대가 일괄 폐지된 것은 아닙니다. 2025년 1월 13일 이후 신규 대출은 실비용 기준으로 수수료율이 인하되는 흐름이지만, 기존 약정 대출은 기존 약정 수수료율이 적용될 수 있습니다.",
  },
  {
    question: "잔여 이자 절감액은 어떻게 계산하나요?",
    answer:
      "상환할 원금에 월 이율과 잔여 개월을 곱해 단순 추정합니다. 실제 원리금균등 상환에서는 남은 이자 구조가 다르므로 금융기관의 상환 스케줄과 다를 수 있습니다.",
  },
  {
    question: "중도상환이 항상 유리한가요?",
    answer:
      "절감 이자가 수수료보다 크면 금액상 유리하지만, 현금 유동성과 다른 투자 기회비용까지 함께 봐야 합니다. 특히 만기가 얼마 남지 않았거나 수수료 면제일이 가까우면 기다리는 편이 나을 수 있습니다.",
  },
  {
    question: "부분 상환 금액이 잔여 원금보다 크면 어떻게 되나요?",
    answer:
      "계산기에서는 최대 잔여 원금까지만 상환하는 것으로 자동 보정합니다. 실제 금융기관에서는 상환 가능 금액, 일부 상환 단위, 수수료 면제 한도가 따로 있을 수 있습니다.",
  },
  {
    question: "전세대출은 만기 전에 갚으면 수수료가 면제되나요?",
    answer:
      "일부 전세대출은 만기 직전 일정 기간에 수수료를 면제하지만 모든 상품에 해당하지 않습니다. 보증기관, 은행, 대출 실행일, 연장 이력에 따라 조건이 달라질 수 있습니다.",
  },
];

export const MPC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/home-purchase-fund/",
    label: "내집마련 자금 계산기",
    description: "집을 살 때 필요한 현금과 대출 가능액을 함께 봅니다.",
  },
  {
    href: "/tools/jeonwolse-conversion/",
    label: "전월세 전환율 계산기",
    description: "전세와 월세 조건을 총비용 기준으로 비교합니다.",
  },
  {
    href: "/reports/seoul-housing-2016-vs-2026/",
    label: "서울 집값 10년 비교 리포트",
    description: "서울 주거비 체감 변화를 장기 흐름으로 확인합니다.",
  },
  {
    href: "/tools/dca-investment-calculator/",
    label: "적립식 투자 수익 계산기",
    description: "여유자금을 상환 대신 투자할 때의 장기 결과를 비교합니다.",
  },
];
