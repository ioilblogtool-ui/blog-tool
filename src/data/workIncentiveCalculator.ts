import {
  APPLICATION_TIMING_LABELS,
  APPLICATION_TIMING_REDUCTION,
  APPLICATION_TIMING_SCHEDULE,
  INCENTIVE_ASSET_THRESHOLDS,
  INCENTIVE_HOUSEHOLD_TYPE_DESCRIPTIONS,
  INCENTIVE_HOUSEHOLD_TYPE_LABELS,
  type IncentiveHouseholdType,
} from "./incentiveCalculatorShared";

export const WIC_META = {
  slug: "work-incentive-calculator",
  title: "근로장려금 계산기 2026",
  seoTitle: "근로장려금 계산기 2026 - 기한 후 신청 가능 여부·예상 지급액",
  seoDescription:
    "2026년 기준 근로장려금 계산기로 가구유형, 총소득, 재산을 입력해 예상 지급액과 기한 후 신청 시 감액 여부를 확인하세요.",
  dataNote:
    "이 계산기는 국세청 근로장려금 산정표를 단순화한 모의계산입니다. 산정 구간과 금액은 매년 조정되며, 실제 지급액은 국세청 홈택스 심사 결과에 따라 달라질 수 있습니다.",
  updatedAt: "2026-06-22",
};

// ⚠️ 점증/평탄/점감 구간 경계값은 2026년 보도자료 종합 추정치입니다.
// 실제 신청 전 반드시 국세청 홈택스 "근로·자녀장려금 모의계산"으로 재확인하세요.
export interface WorkIncentiveBand {
  householdType: IncentiveHouseholdType;
  incomeLimit: number;
  increasingEnd: number;
  flatEnd: number;
  maxAmount: number;
}

export const WORK_INCENTIVE_BANDS_2026: WorkIncentiveBand[] = [
  { householdType: "single", incomeLimit: 22_000_000, increasingEnd: 4_000_000, flatEnd: 9_000_000, maxAmount: 1_650_000 },
  { householdType: "single-earner", incomeLimit: 32_000_000, increasingEnd: 7_000_000, flatEnd: 14_000_000, maxAmount: 2_850_000 },
  { householdType: "dual-earner", incomeLimit: 44_000_000, increasingEnd: 8_000_000, flatEnd: 17_000_000, maxAmount: 3_300_000 },
];

export const WIC_PRESETS = [
  {
    id: "single-low",
    label: "단독가구·연 1,200만 원",
    summary: "1인 가구 평탄구간 예시",
    input: { householdType: "single", applicantIncome: 12_000_000, spouseIncome: 0, applicationTiming: "regular" },
  },
  {
    id: "single-earner-mid",
    label: "홑벌이가구·연 2,400만 원",
    summary: "외벌이 가구 점감구간 예시",
    input: { householdType: "single-earner", applicantIncome: 24_000_000, spouseIncome: 0, applicationTiming: "regular" },
  },
  {
    id: "dual-earner-late",
    label: "맞벌이가구·기한 후 신청",
    summary: "맞벌이 + 기한 후 신청 감액 예시",
    input: { householdType: "dual-earner", applicantIncome: 18_000_000, spouseIncome: 12_000_000, applicationTiming: "late" },
  },
];

export const WIC_FAQ = [
  {
    question: "근로장려금 신청 기한을 놓쳤어요, 지금도 신청 가능한가요?",
    answer:
      "네. 정기 신청 기간(5/1~6/1)이 지났어도 6월 2일부터 12월 1일까지 기한 후 신청이 가능합니다. 다만 산정액의 95%만 지급되어 5% 감액이 적용됩니다.",
  },
  {
    question: "집이 있으면 근로장려금을 못 받나요?",
    answer:
      "재산 합계가 2.4억 원 미만이면 신청할 수 있습니다. 다만 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다.",
  },
  {
    question: "전세금도 재산에 포함되나요?",
    answer: "네. 재산 합계에는 주택, 전세금·임차보증금, 예금, 주식·증권, 자동차 등이 포함됩니다.",
  },
  {
    question: "맞벌이 부부는 둘 다 신청할 수 있나요?",
    answer:
      "근로장려금은 가구 단위로 1건만 신청할 수 있습니다. 맞벌이가구는 신청인과 배우자 각각의 총급여가 300만 원 이상인 경우를 말하며, 소득 상한이 더 높게 적용됩니다.",
  },
  {
    question: "근로장려금과 자녀장려금을 같이 받을 수 있나요?",
    answer: "네. 두 장려금은 별도로 산정되어 동시에 신청할 수 있습니다. 자녀장려금 계산기에서 추가로 확인해보세요.",
  },
  {
    question: "계산 결과와 실제 지급액이 다른 이유는 무엇인가요?",
    answer:
      "산정표의 소득 구간과 최대 지급액은 매년 조정될 수 있고, 실제 소득·재산 심사 결과나 가구원 구성에 따라 달라질 수 있습니다. 정확한 금액은 국세청 홈택스에서 확인하세요.",
  },
];

export const WIC_RELATED_LINKS = [
  { href: "/tools/child-incentive-calculator/", label: "자녀장려금 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 수급 자격 계산기" },
  { href: "/tools/youth-savings-maturity-calculator/", label: "청년 적금 만기 수령액 계산기" },
];

export const WIC_SEO_CONTENT = {
  introTitle: "근로장려금은 가구유형·소득·재산을 함께 봐야 정확합니다",
  intro: [
    "근로장려금은 일은 하지만 소득이 낮은 가구의 생활을 지원하기 위해 국세청이 지급하는 장려금입니다. 가구유형(단독·홑벌이·맞벌이)에 따라 소득 기준과 최대 지급액이 다르고, 지급액은 소득 구간에 따라 점증→평탄→점감 구조로 계산되기 때문에 단순히 \"내 연봉이 얼마니까 얼마 받는다\"라고 한 줄로 말하기 어렵습니다.",
    "2026년 정기 신청은 5월 1일부터 6월 1일까지였습니다. 이 기간을 놓쳤더라도 6월 2일부터 12월 1일까지 기한 후 신청이 가능하지만, 이 경우 산정액의 95%만 지급되어 5%가 줄어듭니다. 이 감액은 재산 기준에 따른 감액과는 완전히 별개로 적용된다는 점을 헷갈리지 않아야 합니다.",
    "재산 기준도 함께 확인해야 합니다. 가구원 재산 합계가 2.4억 원 이상이면 신청 자체가 어렵고, 1.7억 원 이상 2.4억 원 미만이면 산정액의 50%만 지급됩니다. 즉 기한 후 신청과 재산 감액 구간이 동시에 적용되면 산정액의 47.5%(0.95 × 0.5)만 받게 되는 경우도 생길 수 있습니다.",
    "이 계산기는 가구유형, 소득, 재산, 신청유형을 입력해 두 가지 감액을 모두 반영한 예상 지급액을 계산합니다. 다만 산정표의 구간 경계값과 최대 지급액은 매년 조정될 수 있어, 정확한 최종 지급액은 국세청 홈택스 모의계산 또는 실제 심사 결과로 다시 확인해야 합니다.",
  ],
  inputPoints: [
    "가구유형별 소득 기준과 점증·평탄·점감 구간에 따른 예상 산정액을 확인할 수 있습니다.",
    "재산 1.7억~2.4억 구간 50% 감액과 기한 후 신청 5% 감액을 모두 반영한 최종 예상 지급액을 볼 수 있습니다.",
    "자녀장려금 계산기로 바로 이동해 같은 조건으로 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "산정 구간(점증·평탄·점감)과 최대 지급액은 2026년 보도자료 기준 추정치이며 매년 조정될 수 있습니다.",
    "재산 합계 2.4억 원 이상은 신청 불가, 1.7억 원 이상 2.4억 원 미만은 산정액 50% 감액입니다.",
    "기한 후 신청(6/2~12/1)은 산정액의 95%만 지급되며 재산 감액과 별도로 적용됩니다.",
    "정확한 최종 지급액은 국세청 홈택스 모의계산 또는 실제 심사 결과로 확인해야 합니다.",
  ],
};

export const WIC_HOUSEHOLD_TYPE_LABELS = INCENTIVE_HOUSEHOLD_TYPE_LABELS;
export const WIC_HOUSEHOLD_TYPE_DESCRIPTIONS = INCENTIVE_HOUSEHOLD_TYPE_DESCRIPTIONS;
export const WIC_APPLICATION_TIMING_LABELS = APPLICATION_TIMING_LABELS;

export const WIC_CONFIG = {
  bands: WORK_INCENTIVE_BANDS_2026,
  assetThresholds: INCENTIVE_ASSET_THRESHOLDS,
  timingReduction: APPLICATION_TIMING_REDUCTION,
  timingSchedule: APPLICATION_TIMING_SCHEDULE,
  presets: WIC_PRESETS,
  labels: {
    household: INCENTIVE_HOUSEHOLD_TYPE_LABELS,
    timing: APPLICATION_TIMING_LABELS,
  },
};
