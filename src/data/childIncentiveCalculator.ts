import {
  APPLICATION_TIMING_LABELS,
  APPLICATION_TIMING_REDUCTION,
  APPLICATION_TIMING_SCHEDULE,
  INCENTIVE_ASSET_THRESHOLDS,
} from "./incentiveCalculatorShared";

export const CIC_META = {
  slug: "child-incentive-calculator",
  title: "자녀장려금 계산기 2026",
  seoTitle: "자녀장려금 계산기 2026 - 자녀 1명·2명 예상 지급액",
  seoDescription:
    "2026년 기준 자녀장려금 계산기로 부부합산 소득, 자녀 수, 재산을 입력해 자녀별 예상 지급액과 감액 여부를 확인하세요.",
  dataNote:
    "이 계산기는 국세청 자녀장려금 산정 공식을 단순화한 모의계산입니다. 산정 공식 계수는 매년 조정되며, 실제 지급액은 국세청 홈택스 심사 결과에 따라 달라질 수 있습니다.",
  updatedAt: "2026-06-22",
};

// ⚠️ 감소구간 공식 계수는 홑벌이가구 기준 보도자료를 인용한 추정치입니다.
// 가구유형별 차이는 검증되지 않았으므로 실제 신청 전 국세청 홈택스 모의계산으로 재확인하세요.
export const CHILD_INCENTIVE_2026 = {
  incomeLimit: 70_000_000,
  fullAmountIncomeCeiling: 21_000_000,
  maxPerChild: 1_000_000,
  minPerChild: 500_000,
  decreaseNumerator: 80,
  decreaseDenominator: 4_900,
};

export const CIC_PRESETS = [
  {
    id: "one-child",
    label: "자녀 1명·소득 3,000만 원",
    summary: "기본 케이스",
    input: { childCount: 1, totalIncome: 30_000_000, applicationTiming: "regular" },
  },
  {
    id: "two-children",
    label: "자녀 2명·소득 4,000만 원",
    summary: "다자녀 가구 예시",
    input: { childCount: 2, totalIncome: 40_000_000, applicationTiming: "regular" },
  },
  {
    id: "three-children-late",
    label: "자녀 3명·기한 후 신청",
    summary: "다자녀 + 기한 후 신청 감액 예시",
    input: { childCount: 3, totalIncome: 35_000_000, applicationTiming: "late" },
  },
];

export const CIC_FAQ = [
  {
    question: "자녀장려금은 자녀 1명당 얼마인가요?",
    answer: "소득에 따라 자녀 1인당 최소 50만 원에서 최대 100만 원까지 지급됩니다. 소득이 낮을수록 최대 금액에 가깝습니다.",
  },
  {
    question: "자녀 3명이면 최대 얼마까지 받나요?",
    answer: "자녀 1인당 최대 100만 원이므로, 자녀 3명이면 이론상 최대 300만 원까지 받을 수 있습니다.",
  },
  {
    question: "집이 있으면 자녀장려금을 못 받나요?",
    answer:
      "재산 합계가 2.4억 원 미만이면 신청할 수 있습니다. 다만 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다.",
  },
  {
    question: "근로장려금과 같이 받을 수 있나요?",
    answer: "네. 자녀장려금과 근로장려금은 별도로 산정되어 동시에 신청할 수 있습니다.",
  },
  {
    question: "자녀가 만 18세가 넘으면 어떻게 되나요?",
    answer: "자녀장려금은 만 18세 미만 부양자녀를 기준으로 하므로, 18세가 넘으면 해당 자녀는 산정 대상에서 제외됩니다.",
  },
  {
    question: "기한 후 신청하면 얼마나 깎이나요?",
    answer: "기한 후 신청(6월 2일~12월 1일)은 산정액의 95%만 지급되어 5% 감액이 적용됩니다.",
  },
];

export const CIC_RELATED_LINKS = [
  { href: "/tools/work-incentive-calculator/", label: "근로장려금 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
  { href: "/tools/youth-savings-maturity-calculator/", label: "청년 적금 만기 수령액 계산기" },
];

export const CIC_SEO_CONTENT = {
  introTitle: "자녀장려금은 소득에 따라 자녀 1인당 지급액이 달라집니다",
  intro: [
    "자녀장려금은 18세 미만 부양자녀를 둔 가구의 양육 부담을 줄이기 위해 국세청이 지급하는 장려금입니다. 자녀를 키우면서 근로장려금만 신청하고 자녀장려금은 놓치는 경우가 많은데, 두 장려금은 산정 기준이 다르고 별도로 신청해야 합니다. 부부합산 총소득이 7,000만 원 미만이면 신청할 수 있고, 자녀 1인당 최소 50만 원에서 최대 100만 원까지 지급됩니다.",
    "지급액은 소득이 낮을수록 자녀 1인당 최대 100만 원에 가깝고, 소득이 7,000만 원에 가까워질수록 점차 줄어드는 구조입니다. 자녀가 2명, 3명이면 1인당 산정액에 자녀 수를 곱해 총액이 정해지므로, 자녀 수가 늘어날수록 가구 전체 지급액도 함께 늘어납니다. 같은 소득이라도 자녀가 많을수록 가구 단위 지급액 차이가 커지는 구조라는 점을 미리 이해하고 있으면 결과를 더 정확히 해석할 수 있습니다.",
    "재산 기준은 근로장려금과 동일합니다. 재산 합계가 2.4억 원 이상이면 신청이 어렵고, 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다. 신청 기한을 놓쳐 기한 후 신청(6/2~12/1)을 하면 산정액의 95%만 지급되어 5% 감액이 추가로 적용되며, 이 두 감액은 동시에 적용될 수 있어 재산이 많고 신청이 늦을수록 실제 받는 금액이 크게 줄어들 수 있습니다.",
    "자녀장려금은 근로장려금과 별도로 산정되지만 동시에 신청할 수 있습니다. 두 장려금을 모두 받을 수 있는지 궁금하다면 근로장려금 계산기에서 같은 조건으로 함께 확인해보세요. 다만 이 계산기의 감소구간 산정 공식은 보도자료를 인용한 추정치라 가구유형별로 정확한 차이가 검증되지 않았으므로, 실제 신청 전에는 국세청 홈택스 모의계산으로 다시 한번 확인하는 것이 안전합니다.",
  ],
  inputPoints: [
    "부부합산 소득과 자녀 수를 입력하면 자녀 1인당 산정액과 가구 전체 예상 지급액을 확인할 수 있습니다.",
    "자녀 1명·2명·3명일 때 지급액이 어떻게 달라지는지 비교 표로 한눈에 볼 수 있습니다.",
    "근로장려금 계산기로 바로 이동해 같은 조건으로 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "감소구간 산정 공식 계수는 보도자료 기준 추정치이며 매년 조정될 수 있습니다.",
    "재산 합계 2.4억 원 이상은 신청 불가, 1.7억 원 이상 2.4억 원 미만은 산정액 50% 감액입니다.",
    "기한 후 신청(6/2~12/1)은 산정액의 95%만 지급되며 재산 감액과 별도로 적용됩니다.",
    "정확한 최종 지급액은 국세청 홈택스 모의계산 또는 실제 심사 결과로 확인해야 합니다.",
  ],
};

export const CIC_CONFIG = {
  rule: CHILD_INCENTIVE_2026,
  assetThresholds: INCENTIVE_ASSET_THRESHOLDS,
  timingReduction: APPLICATION_TIMING_REDUCTION,
  timingSchedule: APPLICATION_TIMING_SCHEDULE,
  presets: CIC_PRESETS,
  labels: {
    timing: APPLICATION_TIMING_LABELS,
  },
};
