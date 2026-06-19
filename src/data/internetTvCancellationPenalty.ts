export type InternetTvProductType = "internetOnly" | "internetTv" | "internetTvPhone";
export type GiftReturnMode = "fullBeforeThreshold" | "prorated" | "none";
export type PenaltyResultStatus = "goodToSwitch" | "checkAgain" | "likelyLoss" | "contractEnded";

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
}

export interface PenaltyInput {
  productType: InternetTvProductType;
  contractMonths: number;
  usedMonths: number;
  monthlyFee: number;
  monthlyDiscount: number;
  deviceDiscount: number;
  signupGift: number;
  giftReturnThresholdMonths: number;
  giftReturnMode: GiftReturnMode;
  installFeeReturn: number;
  deviceNonReturnFee: number;
  newMonthlyFee: number;
  newSignupGift: number;
  newInstallFee: number;
  bundleDiscountLossMonthly: number;
  forfeitedRetentionBenefit: number;
}

export interface PenaltyPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<PenaltyInput>;
}

export interface PenaltyBreakdown {
  id: string;
  label: string;
  amount: number;
  description: string;
}

export interface PenaltyResult {
  input: PenaltyInput;
  remainingMonths: number;
  returnRate: number;
  contractDiscountReturn: number;
  deviceDiscountReturn: number;
  giftReturn: number;
  installFeeReturn: number;
  deviceNonReturnFee: number;
  totalPenalty: number;
  breakdown: PenaltyBreakdown[];
}

export interface SwitchProfitResult {
  monthlySaving: number;
  remainingTermSaving: number;
  immediateNetProfit: number;
  totalSwitchProfit: number;
  breakEvenMonths: number | null;
  status: PenaltyResultStatus;
  headline: string;
  advice: string;
}

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const ITCP_META = {
  slug: "internet-tv-cancellation-penalty",
  title: "인터넷 TV 약정 해지 위약금 계산기",
  description:
    "인터넷·TV 약정기간, 사용개월, 월요금, 할인액, 사은품을 입력해 예상 해지 위약금과 통신사 갈아타기 손익분기점을 계산합니다.",
  updatedAt: "2026.06.19",
  caution:
    "통신사별 할인반환금 산식, 사은품 반환 조건, 장비 반납 비용은 다를 수 있어 실제 청구액은 고객센터 안내와 약관으로 최종 확인해야 합니다.",
};

export const ITCP_PRODUCT_OPTIONS: SelectOption<InternetTvProductType>[] = [
  { value: "internetOnly", label: "인터넷 단독", description: "인터넷만 사용 중인 경우" },
  { value: "internetTv", label: "인터넷 + TV", description: "가장 흔한 결합 상품" },
  { value: "internetTvPhone", label: "인터넷 + TV + 전화", description: "전화 결합까지 포함" },
];

export const ITCP_CONTRACT_MONTH_OPTIONS: SelectOption<number>[] = [
  { value: 12, label: "1년 약정" },
  { value: 24, label: "2년 약정" },
  { value: 36, label: "3년 약정" },
];

export const ITCP_GIFT_RETURN_MODE_OPTIONS: SelectOption<GiftReturnMode>[] = [
  { value: "fullBeforeThreshold", label: "기준개월 전 전액 반환" },
  { value: "prorated", label: "남은 기간 비례 반환" },
  { value: "none", label: "반환 없음" },
];

export const ITCP_DEFAULT_INPUT: PenaltyInput = {
  productType: "internetTv",
  contractMonths: 36,
  usedMonths: 18,
  monthlyFee: 44000,
  monthlyDiscount: 13200,
  deviceDiscount: 3300,
  signupGift: 450000,
  giftReturnThresholdMonths: 12,
  giftReturnMode: "fullBeforeThreshold",
  installFeeReturn: 27500,
  deviceNonReturnFee: 0,
  newMonthlyFee: 38500,
  newSignupGift: 470000,
  newInstallFee: 36000,
  bundleDiscountLossMonthly: 0,
  forfeitedRetentionBenefit: 0,
};

export const ITCP_PRESETS: PenaltyPreset[] = [
  {
    id: "mid-contract",
    label: "3년 약정 18개월 사용",
    description: "인터넷+TV를 중간에 갈아탈 때",
    input: ITCP_DEFAULT_INPUT,
  },
  {
    id: "early-cancel",
    label: "가입 8개월 조기해지",
    description: "사은품 반환 가능성이 큰 구간",
    input: {
      productType: "internetTv",
      contractMonths: 36,
      usedMonths: 8,
      monthlyFee: 46200,
      monthlyDiscount: 15400,
      deviceDiscount: 4400,
      signupGift: 500000,
      giftReturnThresholdMonths: 12,
      giftReturnMode: "fullBeforeThreshold",
      newMonthlyFee: 39600,
      newSignupGift: 520000,
      newInstallFee: 36000,
    },
  },
  {
    id: "near-end",
    label: "약정 4개월 남음",
    description: "기다릴지 갈아탈지 비교",
    input: {
      productType: "internetOnly",
      contractMonths: 36,
      usedMonths: 32,
      monthlyFee: 33000,
      monthlyDiscount: 8800,
      deviceDiscount: 0,
      signupGift: 250000,
      giftReturnThresholdMonths: 12,
      giftReturnMode: "none",
      newMonthlyFee: 27500,
      newSignupGift: 300000,
      newInstallFee: 27500,
    },
  },
];

export const ITCP_RELATED_LINKS: RelatedLink[] = [
  {
    title: "알뜰폰 요금제 비교",
    description: "인터넷 결합 해제 후 휴대폰 요금까지 같이 줄일 때 확인하세요.",
    href: "/tools/mobile-plan-comparison/",
  },
  {
    title: "AI 구독료 계산기",
    description: "매달 고정비를 줄이는 구독료 점검용 계산기입니다.",
    href: "/tools/ai-subscription-calculator/",
  },
  {
    title: "4대보험 계산기",
    description: "월 고정 지출을 볼 때 실수령액 기준도 함께 확인할 수 있습니다.",
    href: "/tools/four-insurance/",
  },
];

export const ITCP_FAQ: FaqItem[] = [
  {
    question: "인터넷 해지 위약금은 왜 가입할 때 받은 할인보다 더 크게 느껴지나요?",
    answer:
      "약정할인 반환금, 장비 임대료 할인 반환금, 설치비, 사은품 반환 조건이 함께 묶일 수 있기 때문입니다. 특히 가입 초기에는 사은품 반환 조건까지 겹쳐 체감 위약금이 커질 수 있습니다.",
  },
  {
    question: "사은품은 무조건 반환해야 하나요?",
    answer:
      "아닙니다. 대리점·통신사·가입 조건에 따라 6개월, 9개월, 12개월 등 유지 조건이 다릅니다. 계산기에서는 기준개월과 반환 방식을 직접 바꿔 예상액을 볼 수 있게 했습니다.",
  },
  {
    question: "갈아타기 손익분기점은 어떻게 봐야 하나요?",
    answer:
      "신규 사은품에서 위약금, 설치비, 포기하는 재약정 혜택을 뺀 뒤 매월 요금 차이를 더해 몇 개월 뒤 이득이 되는지 계산합니다. 월요금이 오르는 경우에는 손익분기점이 나오지 않을 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 청구액이 다를 수 있나요?",
    answer:
      "그렇습니다. 통신사 내부 할인반환금 산식, 셋톱박스·공유기 반납 상태, 프로모션 약관에 따라 달라질 수 있어 이 계산기는 갈아타기 전 사전 점검용 추정값으로 봐야 합니다.",
  },
];

export const ITCP_SEO_INTRO = [
  "인터넷과 TV 약정을 중간에 해지할 때는 단순히 남은 월요금만 보면 안 됩니다. 약정할인 반환금, 장비 할인 반환금, 설치비, 사은품 반환 조건이 함께 붙을 수 있어 실제 손익이 달라집니다.",
  "이 계산기는 기존 상품 조건과 새 상품 조건을 함께 넣어 예상 위약금, 신규 사은품 반영 후 순손익, 남은 약정기간 기준 손익분기점을 한 번에 비교하도록 설계했습니다.",
];

export const ITCP_SEO_CRITERIA = [
  "약정 할인반환금: 월 할인액에 남은 약정 비율을 곱해 추정합니다.",
  "장비 할인반환금: 셋톱박스·공유기 임대료 할인액을 별도로 계산합니다.",
  "사은품 반환: 기준개월 전 해지 시 전액 또는 비례 반환으로 설정할 수 있습니다.",
  "갈아타기 손익: 신규 사은품, 설치비, 월요금 차이, 포기하는 혜택을 함께 반영합니다.",
];

const KRW_FORMATTER = new Intl.NumberFormat("ko-KR");

export function formatKrw(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${KRW_FORMATTER.format(Math.abs(rounded))}원`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function normalizePenaltyInput(input: Partial<PenaltyInput>): PenaltyInput {
  const merged = { ...ITCP_DEFAULT_INPUT, ...input };
  const contractMonths = clampNumber(Math.round(merged.contractMonths), 1, 60);
  const usedMonths = clampNumber(Math.round(merged.usedMonths), 0, contractMonths);

  return {
    ...merged,
    contractMonths,
    usedMonths,
    monthlyFee: Math.max(0, Math.round(merged.monthlyFee)),
    monthlyDiscount: Math.max(0, Math.round(merged.monthlyDiscount)),
    deviceDiscount: Math.max(0, Math.round(merged.deviceDiscount)),
    signupGift: Math.max(0, Math.round(merged.signupGift)),
    giftReturnThresholdMonths: clampNumber(Math.round(merged.giftReturnThresholdMonths), 0, 60),
    installFeeReturn: Math.max(0, Math.round(merged.installFeeReturn)),
    deviceNonReturnFee: Math.max(0, Math.round(merged.deviceNonReturnFee)),
    newMonthlyFee: Math.max(0, Math.round(merged.newMonthlyFee)),
    newSignupGift: Math.max(0, Math.round(merged.newSignupGift)),
    newInstallFee: Math.max(0, Math.round(merged.newInstallFee)),
    bundleDiscountLossMonthly: Math.max(0, Math.round(merged.bundleDiscountLossMonthly)),
    forfeitedRetentionBenefit: Math.max(0, Math.round(merged.forfeitedRetentionBenefit)),
  };
}

export function getReturnRate(input: PenaltyInput): number {
  if (input.contractMonths <= 0) return 0;
  return clampNumber((input.contractMonths - input.usedMonths) / input.contractMonths, 0, 1);
}

export function calculateGiftReturn(input: PenaltyInput): number {
  if (input.giftReturnMode === "none" || input.signupGift <= 0) return 0;
  if (input.giftReturnMode === "fullBeforeThreshold") {
    return input.usedMonths < input.giftReturnThresholdMonths ? input.signupGift : 0;
  }
  return Math.round(input.signupGift * getReturnRate(input));
}

export function calculatePenalty(rawInput: Partial<PenaltyInput>): PenaltyResult {
  const input = normalizePenaltyInput(rawInput);
  const remainingMonths = Math.max(0, input.contractMonths - input.usedMonths);
  const returnRate = getReturnRate(input);
  const contractDiscountReturn = Math.round(input.monthlyDiscount * remainingMonths * returnRate);
  const deviceDiscountReturn = Math.round(input.deviceDiscount * remainingMonths * returnRate);
  const giftReturn = calculateGiftReturn(input);
  const totalPenalty =
    contractDiscountReturn +
    deviceDiscountReturn +
    giftReturn +
    input.installFeeReturn +
    input.deviceNonReturnFee;

  return {
    input,
    remainingMonths,
    returnRate,
    contractDiscountReturn,
    deviceDiscountReturn,
    giftReturn,
    installFeeReturn: input.installFeeReturn,
    deviceNonReturnFee: input.deviceNonReturnFee,
    totalPenalty,
    breakdown: [
      {
        id: "contractDiscountReturn",
        label: "약정 할인반환금",
        amount: contractDiscountReturn,
        description: "월 약정할인액과 남은 약정기간을 기준으로 추정했습니다.",
      },
      {
        id: "deviceDiscountReturn",
        label: "장비 할인반환금",
        amount: deviceDiscountReturn,
        description: "셋톱박스·공유기 임대료 할인 반환 가능분입니다.",
      },
      {
        id: "giftReturn",
        label: "사은품 반환",
        amount: giftReturn,
        description: "가입 사은품 유지 조건을 기준으로 계산했습니다.",
      },
      {
        id: "installFeeReturn",
        label: "설치비 반환",
        amount: input.installFeeReturn,
        description: "면제받은 설치비가 청구되는 경우를 반영합니다.",
      },
      {
        id: "deviceNonReturnFee",
        label: "장비 미반납 비용",
        amount: input.deviceNonReturnFee,
        description: "장비 분실·미반납 시 추가될 수 있는 비용입니다.",
      },
    ],
  };
}

export function getResultStatus(penalty: PenaltyResult, totalSwitchProfit: number): PenaltyResultStatus {
  if (penalty.remainingMonths === 0) return "contractEnded";
  if (totalSwitchProfit >= 100000) return "goodToSwitch";
  if (totalSwitchProfit < 0) return "likelyLoss";
  return "checkAgain";
}

export function getResultHeadline(status: PenaltyResultStatus, totalSwitchProfit: number): string {
  if (status === "contractEnded") return "약정기간을 채운 상태라 해지 부담이 낮습니다";
  if (status === "goodToSwitch") return `예상 순이익이 ${formatKrw(totalSwitchProfit)}입니다`;
  if (status === "likelyLoss") return `지금 갈아타면 ${formatKrw(Math.abs(totalSwitchProfit))} 손해 가능성이 있습니다`;
  return "사은품 조건과 재약정 혜택을 한 번 더 확인하세요";
}

export function getResultAdvice(status: PenaltyResultStatus, penalty: PenaltyResult): string {
  if (status === "contractEnded") {
    return "약정기간을 이미 채웠다면 약정 할인반환금은 낮게 잡힙니다. 장비 반납과 미납요금만 확인하세요.";
  }
  if (status === "goodToSwitch") {
    return "신규 사은품과 남은 기간 절감액이 위약금보다 큽니다. 단, 실제 해지 전 고객센터에서 최종 위약금을 확인하세요.";
  }
  if (status === "likelyLoss") {
    return "위약금과 포기하는 혜택이 더 큽니다. 약정 종료가 가까우면 만료 후 이동하거나 재약정 혜택을 비교하는 편이 낫습니다.";
  }
  if (penalty.giftReturn > 0) {
    return "사은품 반환 조건이 손익을 크게 바꾸는 구간입니다. 가입처의 유지 조건 개월 수를 먼저 확인하세요.";
  }
  return "차이가 크지 않습니다. 신규 설치비, 결합할인 손실, 재약정 상품권까지 넣어 다시 비교하세요.";
}

export function calculateSwitchProfit(rawInput: Partial<PenaltyInput>): SwitchProfitResult {
  const penalty = calculatePenalty(rawInput);
  const input = penalty.input;
  const monthlySaving = input.monthlyFee - input.newMonthlyFee - input.bundleDiscountLossMonthly;
  const remainingTermSaving = monthlySaving * penalty.remainingMonths;
  const immediateNetProfit =
    input.newSignupGift - penalty.totalPenalty - input.newInstallFee - input.forfeitedRetentionBenefit;
  const totalSwitchProfit = immediateNetProfit + remainingTermSaving;
  const breakEvenBase =
    penalty.totalPenalty + input.newInstallFee + input.forfeitedRetentionBenefit - input.newSignupGift;
  const breakEvenMonths = monthlySaving > 0 ? Math.max(0, Math.ceil(breakEvenBase / monthlySaving)) : null;
  const status = getResultStatus(penalty, totalSwitchProfit);

  return {
    monthlySaving,
    remainingTermSaving,
    immediateNetProfit,
    totalSwitchProfit,
    breakEvenMonths,
    status,
    headline: getResultHeadline(status, totalSwitchProfit),
    advice: getResultAdvice(status, penalty),
  };
}
