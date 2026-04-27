export type RetirementStatus = "stable" | "caution" | "risk";
export type ScenarioId = "optimistic" | "base" | "conservative";

export type RetirementFundInput = {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyLivingCost: number;
  currentAssets: number;
  monthlyContribution: number;
  monthlyPension: number;
  otherRetirementIncome: number;
  inflationRate: number;
  annualReturnRate: number;
};

export const RFD_DEFAULT_INPUT: RetirementFundInput = {
  currentAge: 35,
  retirementAge: 60,
  lifeExpectancy: 90,
  monthlyLivingCost: 2500000,
  currentAssets: 100000000,
  monthlyContribution: 500000,
  monthlyPension: 800000,
  otherRetirementIncome: 0,
  inflationRate: 0.025,
  annualReturnRate: 0.04,
};

export const RFD_RULES = {
  minCurrentAge: 20,
  maxCurrentAge: 80,
  minRetirementAge: 35,
  maxRetirementAge: 80,
  minLifeExpectancy: 50,
  maxLifeExpectancy: 110,
  minInflationRate: 0,
  maxInflationRate: 0.1,
  minAnnualReturnRate: -0.1,
  maxAnnualReturnRate: 0.15,
};

export const RFD_PRESETS = [
  {
    id: "thirties",
    label: "30대 점검형",
    values: {
      currentAge: 35,
      retirementAge: 60,
      lifeExpectancy: 90,
      monthlyLivingCost: 2500000,
      currentAssets: 100000000,
      monthlyContribution: 500000,
      monthlyPension: 800000,
      otherRetirementIncome: 0,
      inflationRate: 0.025,
      annualReturnRate: 0.04,
    },
  },
  {
    id: "forties",
    label: "40대 추격형",
    values: {
      currentAge: 45,
      retirementAge: 62,
      lifeExpectancy: 90,
      monthlyLivingCost: 3000000,
      currentAssets: 250000000,
      monthlyContribution: 1000000,
      monthlyPension: 1000000,
      otherRetirementIncome: 0,
      inflationRate: 0.025,
      annualReturnRate: 0.04,
    },
  },
  {
    id: "early-retire",
    label: "조기은퇴 점검형",
    values: {
      currentAge: 40,
      retirementAge: 55,
      lifeExpectancy: 90,
      monthlyLivingCost: 3000000,
      currentAssets: 400000000,
      monthlyContribution: 1500000,
      monthlyPension: 700000,
      otherRetirementIncome: 0,
      inflationRate: 0.03,
      annualReturnRate: 0.04,
    },
  },
];

export const RFD_SCENARIOS = [
  {
    id: "optimistic" as ScenarioId,
    label: "낙관",
    description: "생활비 -5%, 물가 -0.5%p, 수익률 +1%p",
    inflationDelta: -0.005,
    returnDelta: 0.01,
    livingCostMultiplier: 0.95,
  },
  {
    id: "base" as ScenarioId,
    label: "기본",
    description: "현재 입력값 기준",
    inflationDelta: 0,
    returnDelta: 0,
    livingCostMultiplier: 1,
  },
  {
    id: "conservative" as ScenarioId,
    label: "보수",
    description: "생활비 +5%, 물가 +0.5%p, 수익률 -1%p",
    inflationDelta: 0.005,
    returnDelta: -0.01,
    livingCostMultiplier: 1.05,
  },
];

export const RFD_LIFE_EXPECTANCY_PRESETS = [
  { label: "80세", value: 80 },
  { label: "85세", value: 85 },
  { label: "90세", value: 90 },
  { label: "95세", value: 95 },
];

export const RFD_LIVING_COST_PRESETS = [
  { label: "200만", value: 2000000 },
  { label: "250만", value: 2500000 },
  { label: "300만", value: 3000000 },
  { label: "400만", value: 4000000 },
];

export const RFD_ASSET_PRESETS = [
  { label: "5천만", value: 50000000 },
  { label: "1억", value: 100000000 },
  { label: "3억", value: 300000000 },
  { label: "5억", value: 500000000 },
];

export const RFD_PENSION_PRESETS = [
  { label: "50만", value: 500000 },
  { label: "80만", value: 800000 },
  { label: "100만", value: 1000000 },
  { label: "150만", value: 1500000 },
];

export const RFD_OTHER_INCOME_PRESETS = [
  { label: "0원", value: 0 },
  { label: "50만", value: 500000 },
  { label: "100만", value: 1000000 },
];

export const RFD_RATE_PRESETS = {
  inflation: [
    { label: "2.0%", value: 0.02 },
    { label: "2.5%", value: 0.025 },
    { label: "3.0%", value: 0.03 },
    { label: "3.5%", value: 0.035 },
  ],
  returns: [
    { label: "2.0%", value: 0.02 },
    { label: "4.0%", value: 0.04 },
    { label: "5.0%", value: 0.05 },
    { label: "7.0%", value: 0.07 },
  ],
};

export const RFD_GUIDE_POINTS = [
  "필요 자산은 현재가치 생활비를 은퇴 시점 가치로 바꾼 뒤 계산합니다.",
  "국민연금과 기타 소득은 은퇴 후 순지출에서 차감합니다.",
  "자산 고갈 시점은 매년 잔액, 지출, 수익률을 반영한 시뮬레이션입니다.",
  "세금, 건강보험료, 의료비, 간병비, 주거비 급변은 별도 검토가 필요합니다.",
];

export const RFD_RELATED_LINKS = [
  { label: "국민연금 수령액 계산기", href: "/tools/national-pension-calculator/" },
  { label: "IRP 연금 계산기", href: "/tools/irp-pension-calculator/" },
  { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
  { label: "연금저축·IRP 비교 리포트", href: "/reports/pension-irp-comparison-2026/" },
];

export const RFD_FAQ = [
  {
    question: "노후자금은 얼마가 있어야 충분한가요?",
    answer:
      "정답은 없습니다. 은퇴 시점, 월 생활비, 국민연금, 기대수명, 물가상승률, 운용수익률에 따라 필요한 자산이 크게 달라집니다. 이 계산기는 입력값 기준으로 필요한 자산을 추정합니다.",
  },
  {
    question: "국민연금만으로 노후 생활이 가능한가요?",
    answer:
      "생활비 수준에 따라 다릅니다. 국민연금 예상액을 입력하면 은퇴 후 순지출에서 차감해 부족 금액과 자산 고갈 시점을 계산합니다.",
  },
  {
    question: "물가상승률은 몇 퍼센트로 넣어야 하나요?",
    answer:
      "기본값은 2.5%로 두되, 보수적으로 보고 싶다면 3% 이상도 비교해볼 수 있습니다. 장기 시뮬레이션에서는 물가상승률 차이가 결과에 크게 반영됩니다.",
  },
  {
    question: "운용수익률은 몇 퍼센트가 현실적인가요?",
    answer:
      "자산 배분에 따라 다릅니다. 예금·채권 중심이면 낮게, 주식·ETF 비중이 높으면 높게 가정할 수 있습니다. 이 계산기에서는 3~5% 구간 비교를 기본으로 안내합니다.",
  },
  {
    question: "자산 고갈 시점이 기대수명보다 빠르면 어떻게 해야 하나요?",
    answer:
      "월 적립액을 늘리거나, 은퇴 시점을 늦추거나, 은퇴 후 생활비를 조정하거나, 연금성 현금흐름을 늘리는 방식으로 다시 시뮬레이션해보는 것이 좋습니다.",
  },
  {
    question: "계산 결과를 실제 은퇴 설계 금액으로 써도 되나요?",
    answer:
      "아니요. 이 계산기는 참고용 시뮬레이션입니다. 세금, 의료비, 간병비, 주거비, 투자 손실 가능성은 별도로 검토해야 합니다.",
  },
];
