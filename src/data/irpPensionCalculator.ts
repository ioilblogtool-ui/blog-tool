export type PensionPayoutMode = "annuity" | "lump-sum";
export type PensionPeriod = 10 | 15 | 20 | 25 | 30;

export type IrpInput = {
  currentAge: number;
  retireAge: number;
  currentIrpBalance: number;
  currentDcBalance: number;
  monthlyContribution: number;
  annualReturnRate: number;
  payoutMode: PensionPayoutMode;
  annuityStartAge: number;
  annuityPeriod: PensionPeriod;
  applyPostRetirementReturn: boolean;
  postRetirementReturnRate: number;
};

export const IRP_RULES = {
  minCurrentAge: 20,
  maxCurrentAge: 64,
  minRetireAge: 45,
  maxRetireAge: 75,
  minAnnuityStartAge: 55,
  maxAnnuityStartAge: 80,
  minMonthlyContribution: 0,
  maxMonthlyContribution: 3000000,
  minReturnRate: 0,
  maxReturnRate: 0.12,
  defaultCurrencyStep: 10000,
};

export const IRP_DEFAULT_INPUT: IrpInput = {
  currentAge: 35,
  retireAge: 60,
  currentIrpBalance: 10000000,
  currentDcBalance: 20000000,
  monthlyContribution: 300000,
  annualReturnRate: 0.04,
  payoutMode: "annuity",
  annuityStartAge: 60,
  annuityPeriod: 20,
  applyPostRetirementReturn: false,
  postRetirementReturnRate: 0.02,
};

export const IRP_PRESETS = [
  {
    id: "starter",
    label: "직장인 기본형",
    values: {
      currentAge: 35,
      retireAge: 60,
      currentIrpBalance: 10000000,
      currentDcBalance: 20000000,
      monthlyContribution: 300000,
      annualReturnRate: 0.04,
      payoutMode: "annuity" as PensionPayoutMode,
      annuityStartAge: 60,
      annuityPeriod: 20 as PensionPeriod,
      applyPostRetirementReturn: false,
      postRetirementReturnRate: 0.02,
    },
  },
  {
    id: "catch-up",
    label: "40대 추격형",
    values: {
      currentAge: 45,
      retireAge: 60,
      currentIrpBalance: 30000000,
      currentDcBalance: 50000000,
      monthlyContribution: 500000,
      annualReturnRate: 0.04,
      payoutMode: "annuity" as PensionPayoutMode,
      annuityStartAge: 60,
      annuityPeriod: 15 as PensionPeriod,
      applyPostRetirementReturn: false,
      postRetirementReturnRate: 0.02,
    },
  },
  {
    id: "stable",
    label: "보수적 운용형",
    values: {
      currentAge: 40,
      retireAge: 60,
      currentIrpBalance: 20000000,
      currentDcBalance: 30000000,
      monthlyContribution: 300000,
      annualReturnRate: 0.03,
      payoutMode: "annuity" as PensionPayoutMode,
      annuityStartAge: 60,
      annuityPeriod: 25 as PensionPeriod,
      applyPostRetirementReturn: true,
      postRetirementReturnRate: 0.02,
    },
  },
];

export const IRP_RETURN_PRESETS = [
  { label: "3%", value: 0.03 },
  { label: "4%", value: 0.04 },
  { label: "5%", value: 0.05 },
  { label: "7%", value: 0.07 },
];

export const IRP_GUIDE_POINTS = [
  "IRP와 퇴직연금 DC 적립금은 합산해 보되, 실제 상품별 수익률과 수수료 차이는 별도로 확인해야 합니다.",
  "연금 수령 방식은 월 현금흐름 안정성에, 일시금은 목돈 활용성에 강점이 있습니다.",
  "월 추가 납입액보다 은퇴까지 남은 기간과 수익률 가정이 최종 적립금에 더 크게 작용할 수 있습니다.",
  "이 계산기는 추정 도구이며 실제 세제, 수수료, 상품별 운용 성과를 반영한 공식 금액이 아닙니다.",
];

export const IRP_FAQ = [
  {
    question: "IRP와 DC 적립금을 같이 넣어도 되나요?",
    answer:
      "가능합니다. 다만 실제 계좌가 분리되어 있다면 상품 구성, 수익률, 수수료가 다를 수 있어 결과는 참고용 추정치로만 봐야 합니다.",
  },
  {
    question: "연금 수령과 일시금 중 무엇이 더 유리한가요?",
    answer:
      "연금 수령은 월 현금흐름이 안정적이고, 일시금은 큰 지출이나 재투자에 유리합니다. 어떤 선택이 더 맞는지는 생활비 구조와 다른 연금·자산 여부에 따라 달라집니다.",
  },
  {
    question: "은퇴 후 수익률 반영은 언제 쓰면 되나요?",
    answer:
      "은퇴 후에도 일부 자산을 채권형·배당형 등으로 계속 운용할 계획이라면 참고용으로 볼 수 있습니다. 반대로 안전 자산 위주로 바로 현금화할 계획이면 끄는 편이 보수적입니다.",
  },
  {
    question: "세액공제 효과나 세금은 반영되나요?",
    answer:
      "아닙니다. 이 계산기는 미래 적립금과 월 수령 추정에 집중한 도구라서 세액공제, 연금소득세, 수수료, 인출 순서 같은 세부 항목은 단순화했습니다.",
  },
];

export const IRP_RELATED_LINKS = [
  { href: "/reports/pension-irp-comparison-2026/", label: "국민연금 vs IRP 비교 리포트" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
  { href: "/tools/fire-calculator/", label: "은퇴 생활비 계산기" },
];
