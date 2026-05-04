export type ContributionTiming = "end" | "begin";
export type RiskScenarioId = "conservative" | "balanced" | "growth";
export type WithdrawalMode = "fixed" | "inflationAdjusted";
export type ResultStatus = "savingsBetter" | "etfBetter" | "similar";

export interface RetirementCompareInput {
  currentAge: number;
  retirementAge: number;
  monthlyAmount: number;
  savingsAnnualRate: number;
  etfAnnualReturn: number;
  etfFeeRate: number;
  inflationRate: number;
  monthlyLivingCost: number;
  postRetirementReturn: number;
  contributionTiming: ContributionTiming;
  withdrawalMode: WithdrawalMode;
  includeTax: boolean;
  expectedMonthlyPension: number;
}

export interface RetirementComparePreset {
  id: RiskScenarioId;
  label: string;
  description: string;
  savingsAnnualRate: number;
  etfAnnualReturn: number;
  etfFeeRate: number;
  inflationRate: number;
  postRetirementReturn: number;
}

export interface RetirementCompareFaqItem {
  question: string;
  answer: string;
}

export interface RetirementCompareRelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SVER_META = {
  slug: "savings-vs-etf-retirement",
  title: "월 적금 vs ETF 노후 계산기",
  subtitle:
    "현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점 자산과 실질 구매력을 비교합니다.",
  updatedAt: "2026년 4월",
  caution:
    "ETF 수익률은 확정 수익이 아니라 사용자가 입력한 기대수익률 기반 시뮬레이션입니다. 실제 투자 결과는 시장 상황, 세금, 보수, 환율에 따라 달라질 수 있습니다.",
} as const;

export const SVER_DEFAULT_INPUT: RetirementCompareInput = {
  currentAge: 35,
  retirementAge: 60,
  monthlyAmount: 500_000,
  savingsAnnualRate: 3.5,
  etfAnnualReturn: 7.0,
  etfFeeRate: 0.2,
  inflationRate: 2.5,
  monthlyLivingCost: 2_500_000,
  postRetirementReturn: 3.0,
  contributionTiming: "end",
  withdrawalMode: "fixed",
  includeTax: false,
  expectedMonthlyPension: 0,
};

export const SVER_PRESETS: RetirementComparePreset[] = [
  {
    id: "conservative",
    label: "보수형",
    description: "원금 안정성과 낮은 변동성을 더 크게 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 4.5,
    etfFeeRate: 0.2,
    inflationRate: 2.5,
    postRetirementReturn: 2.0,
  },
  {
    id: "balanced",
    label: "중립형",
    description: "적금 안정성과 ETF 장기 성장 가능성을 함께 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 7.0,
    etfFeeRate: 0.2,
    inflationRate: 2.5,
    postRetirementReturn: 3.0,
  },
  {
    id: "growth",
    label: "성장형",
    description: "긴 투자 기간과 ETF 기대수익률을 더 높게 보는 조건",
    savingsAnnualRate: 3.5,
    etfAnnualReturn: 9.0,
    etfFeeRate: 0.25,
    inflationRate: 2.5,
    postRetirementReturn: 4.0,
  },
];

export const SVER_MONTHLY_PRESETS = [
  { label: "30만", value: 300_000 },
  { label: "50만", value: 500_000 },
  { label: "100만", value: 1_000_000 },
  { label: "150만", value: 1_500_000 },
] as const;

export const SVER_GUIDE_POINTS = [
  "명목 금액이 커 보여도 물가상승률을 반영한 실질 구매력을 함께 확인하세요.",
  "ETF 기대수익률은 장기 평균 가정일 뿐이며 특정 기간에는 손실 가능성이 있습니다.",
  "은퇴 후 생활비에서 국민연금, 퇴직연금, 기타 현금흐름을 뺀 순지출을 기준으로 해석하세요.",
] as const;

export const SVER_CRITERIA = [
  "월 납입액은 매월 말 납입을 기본으로 계산하며, 옵션에서 매월 초 납입으로 바꿀 수 있습니다.",
  "세금 반영을 켜면 적금 이자와 ETF 기대수익률에 15.4%를 단순 차감합니다. 실제 과세는 계좌와 상품에 따라 달라집니다.",
  "은퇴 후 자산 고갈 나이는 100세까지 월 단위로 시뮬레이션하며, 생활비 증가 방식은 고정 또는 물가연동 중 선택합니다.",
] as const;

export const SVER_FAQ: RetirementCompareFaqItem[] = [
  {
    question: "ETF가 항상 적금보다 유리한가요?",
    answer:
      "아닙니다. ETF는 기대수익률이 높을 수 있지만 손실과 변동성이 있습니다. 투자 기간이 짧거나 중간에 인출해야 한다면 적금처럼 원금 변동이 낮은 선택지가 더 맞을 수 있습니다.",
  },
  {
    question: "적금 금리는 세후로 입력해야 하나요?",
    answer:
      "기본은 세전 금리 입력입니다. 세금 반영을 켜면 이자소득세 15.4%를 단순 차감해 비교합니다. 비과세나 세제혜택 계좌는 별도로 고려해야 합니다.",
  },
  {
    question: "ETF 보수는 왜 따로 입력하나요?",
    answer:
      "장기 투자에서는 연 0.1~0.3%포인트 차이도 누적 자산에 영향을 줄 수 있습니다. 이 계산기는 기대수익률에서 ETF 보수를 뺀 값으로 월 복리 시뮬레이션합니다.",
  },
  {
    question: "물가상승률은 어떤 의미인가요?",
    answer:
      "은퇴 시점의 명목 자산을 현재 구매력으로 환산하는 데 사용합니다. 예를 들어 은퇴 시점 3억 원이라도 물가가 오래 오르면 지금의 3억 원보다 구매력이 낮습니다.",
  },
  {
    question: "은퇴 후 생활비 커버 기간은 어떻게 계산하나요?",
    answer:
      "은퇴 시점 자산을 월 생활비에서 예상 연금 수입을 뺀 순지출로 나눈 값입니다. 별도 시뮬레이션에서는 은퇴 후 운용수익률과 인출 방식을 반영해 고갈 나이를 추정합니다.",
  },
  {
    question: "이 결과만 보고 투자 비중을 정해도 되나요?",
    answer:
      "아니요. 이 계산기는 입력한 가정에 따른 참고용 비교 도구입니다. 실제 비중은 소득 안정성, 비상금, 부채, 연금 계좌, 위험 감수 성향을 함께 보고 정해야 합니다.",
  },
];

export const SVER_RELATED_LINKS: RetirementCompareRelatedLink[] = [
  {
    href: "/tools/retirement-fund-depletion/",
    label: "노후 자금 고갈 계산기",
    description: "현재 자산과 생활비 기준으로 은퇴 후 자산이 언제 줄어드는지 봅니다.",
  },
  {
    href: "/tools/dca-investment-calculator/",
    label: "적립식 투자 수익 비교 계산기",
    description: "여러 종목에 매월 투자했을 때 장기 수익률을 비교합니다.",
  },
  {
    href: "/tools/irp-pension-calculator/",
    label: "IRP 연금 계산기",
    description: "IRP 납입액과 연금 수령 방식을 기준으로 은퇴 자산을 추정합니다.",
  },
  {
    href: "/reports/retirement-pension-dc-db-irp-2026/",
    label: "DB·DC·IRP 퇴직연금 비교",
    description: "퇴직연금 제도별 차이와 선택 기준을 정리했습니다.",
  },
  {
    href: "/reports/pension-irp-comparison-2026/",
    label: "연금저축 vs IRP 비교",
    description: "세액공제와 인출 조건을 중심으로 연금 계좌를 비교합니다.",
  },
];
