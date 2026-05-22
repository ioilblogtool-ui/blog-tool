export type HouseholdSize = 1 | 2 | 3 | 4;
export type DecisionLabel = "직접요리 유리" | "조건부 유리" | "배달도 합리적";
export type DecisionTone = "positive" | "neutral" | "caution";

export interface DeliveryVsCookingInput {
  householdSize: HouseholdSize;
  weeklyDeliveryOrders: number;
  mealsPerOrder: number;
  weeksPerMonth: number;
  monthlyBudget: number;
  deliveryFoodCost: number;
  deliveryFee: number;
  riderTip: number;
  serviceFee: number;
  couponDiscount: number;
  cookingIngredientCost: number;
  energyCost: number;
  consumableCost: number;
  ingredientWasteRate: number;
  groceryDeliveryFeePerMeal: number;
  includeTimeCost: boolean;
  hourlyWage: number;
  groceryMinutes: number;
  cookingMinutes: number;
  cleanupMinutes: number;
  includeDeliveryWaitTime: boolean;
  deliveryWaitMinutes: number;
}

export interface DeliveryVsCookingPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<DeliveryVsCookingInput>;
}

export interface DeliveryVsCookingScenario {
  title: string;
  target: string;
  summary: string;
  monthlySavingHint: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const DVCC_META = {
  title: "배달 vs 직접 요리 비용 계산기",
  subtitle: "배달 음식값, 배달비, 식재료비, 조리 시간까지 반영해 월간·연간 절약액을 계산합니다.",
  updatedAt: "2026년 5월 기준",
  caution: "결과는 사용자가 입력한 비용과 시간 가정을 바탕으로 한 생활비 시뮬레이션입니다.",
};

export const DVCC_DEFAULT_INPUT: DeliveryVsCookingInput = {
  householdSize: 1,
  weeklyDeliveryOrders: 3,
  mealsPerOrder: 1,
  weeksPerMonth: 4.345,
  monthlyBudget: 300000,
  deliveryFoodCost: 18000,
  deliveryFee: 3000,
  riderTip: 0,
  serviceFee: 0,
  couponDiscount: 2000,
  cookingIngredientCost: 9000,
  energyCost: 500,
  consumableCost: 500,
  ingredientWasteRate: 0.1,
  groceryDeliveryFeePerMeal: 0,
  includeTimeCost: false,
  hourlyWage: 15000,
  groceryMinutes: 10,
  cookingMinutes: 25,
  cleanupMinutes: 10,
  includeDeliveryWaitTime: false,
  deliveryWaitMinutes: 35,
};

export const DVCC_PRESETS: DeliveryVsCookingPreset[] = [
  {
    id: "solo-heavy-delivery",
    label: "자취생 배달형",
    description: "1인 가구가 주 4회 배달을 시켜 먹는 경우입니다.",
    input: {
      householdSize: 1,
      weeklyDeliveryOrders: 4,
      deliveryFoodCost: 18000,
      deliveryFee: 3000,
      couponDiscount: 1500,
      cookingIngredientCost: 9000,
      ingredientWasteRate: 0.12,
    },
  },
  {
    id: "dual-income-couple",
    label: "맞벌이 부부",
    description: "2인 가구가 시간 비용까지 반영해 비교합니다.",
    input: {
      householdSize: 2,
      weeklyDeliveryOrders: 3,
      deliveryFoodCost: 28000,
      deliveryFee: 3500,
      cookingIngredientCost: 15000,
      includeTimeCost: true,
      hourlyWage: 20000,
      cookingMinutes: 30,
      cleanupMinutes: 10,
    },
  },
  {
    id: "family-three",
    label: "3인 가족",
    description: "가족 단위 배달 주문과 직접요리 비용을 비교합니다.",
    input: {
      householdSize: 3,
      weeklyDeliveryOrders: 2,
      deliveryFoodCost: 38000,
      deliveryFee: 4000,
      cookingIngredientCost: 18000,
      ingredientWasteRate: 0.07,
    },
  },
  {
    id: "family-four",
    label: "4인 가족",
    description: "4인 가족의 배달 음식값과 장보기 비용을 비교합니다.",
    input: {
      householdSize: 4,
      weeklyDeliveryOrders: 2,
      deliveryFoodCost: 45000,
      deliveryFee: 4000,
      cookingIngredientCost: 24000,
      ingredientWasteRate: 0.05,
    },
  },
  {
    id: "meal-kit",
    label: "밀키트 대체",
    description: "식재료비는 높지만 조리 시간이 짧은 밀키트형 시나리오입니다.",
    input: {
      householdSize: 2,
      weeklyDeliveryOrders: 3,
      deliveryFoodCost: 28000,
      deliveryFee: 3000,
      cookingIngredientCost: 19000,
      ingredientWasteRate: 0.03,
      includeTimeCost: true,
      cookingMinutes: 15,
      cleanupMinutes: 5,
    },
  },
];

export const DVCC_SCENARIOS: DeliveryVsCookingScenario[] = [
  {
    title: "1인 가구",
    target: "배달 횟수가 많고 남는 재료가 부담인 경우",
    summary: "식재료 폐기율을 현실적으로 넣어야 집밥 절약액을 과대평가하지 않습니다.",
    monthlySavingHint: "주 1회만 줄여도 월 7만~10만원대 차이가 날 수 있습니다.",
  },
  {
    title: "맞벌이 가구",
    target: "평일 저녁 시간이 부족한 경우",
    summary: "시간 비용을 켜면 현금 지출 절약과 체감 피로도를 함께 비교할 수 있습니다.",
    monthlySavingHint: "조리 시간이 길수록 배달이 합리적인 구간이 생깁니다.",
  },
  {
    title: "3~4인 가족",
    target: "한 번 주문 금액이 큰 가족 배달",
    summary: "가족은 식재료를 묶음으로 쓰기 쉬워 직접 요리의 1인당 비용이 낮아질 가능성이 큽니다.",
    monthlySavingHint: "주 2회 배달만 직접 요리로 바꿔도 연간 절약액이 크게 보입니다.",
  },
  {
    title: "밀키트 활용",
    target: "배달과 집밥 사이의 중간 선택지",
    summary: "재료 낭비와 조리 시간을 줄이는 대신 식재료비는 직접 장보기보다 높게 잡는 편이 현실적입니다.",
    monthlySavingHint: "시간 비용을 포함하면 밀키트가 직접 요리보다 유리하게 보일 수 있습니다.",
  },
];

export const DVCC_CHECKLIST = [
  "배달비, 포장비, 서비스 수수료를 음식값과 따로 적는다.",
  "쿠폰 할인은 한 번 받은 최대 금액이 아니라 평균 할인액으로 입력한다.",
  "1인 가구는 남는 식재료 비용을 10~20% 범위에서 테스트한다.",
  "시간 비용을 켠 결과와 끈 결과를 둘 다 보고 현금 절약액과 체감 부담을 분리한다.",
  "손익분기 주문금액보다 비싼 메뉴를 자주 주문한다면 배달비 절약 효과가 커진다.",
];

export const DVCC_FAQ: FaqItem[] = [
  {
    question: "직접 요리가 항상 배달보다 저렴한가요?",
    answer: "아닙니다. 1인 가구에서 식재료 폐기율이 높거나 조리 시간의 기회비용이 크면 직접 요리의 절약액이 줄어들 수 있습니다. 그래서 이 계산기는 현금 지출 기준과 시간 포함 기준을 나누어 보게 설계했습니다.",
  },
  {
    question: "시간 비용은 꼭 넣어야 하나요?",
    answer: "필수는 아닙니다. 생활비 절약 관점에서는 현금 지출 기준이 직관적이고, 맞벌이나 야근이 많은 직장인은 시간 비용까지 포함해 보는 것이 더 현실적일 수 있습니다.",
  },
  {
    question: "배달 쿠폰은 어떻게 반영하나요?",
    answer: "1회 평균 할인액으로 입력하는 것이 좋습니다. 특정 이벤트의 최대 할인보다 한 달 동안 실제로 자주 받는 평균 할인액을 넣어야 결과가 현실적입니다.",
  },
  {
    question: "밀키트는 직접 요리 비용에 넣나요?",
    answer: "이 계산기에서는 직접 요리 프리셋 중 하나로 처리합니다. 밀키트는 식재료비가 높지만 조리 시간과 폐기율이 낮기 때문에 시간 비용 포함 결과에서 유리해질 수 있습니다.",
  },
  {
    question: "손익분기 주문금액은 무엇인가요?",
    answer: "직접 요리 비용과 배달 비용이 같아지는 1회 음식값입니다. 이 금액보다 비싸게 주문하면 직접 요리가 비용상 유리하고, 낮게 주문하면 배달도 합리적일 수 있습니다.",
  },
  {
    question: "가족 수가 많으면 직접 요리가 더 유리한가요?",
    answer: "대체로 유리해지는 경향이 있습니다. 배달은 인원수만큼 음식값이 커지지만 직접 요리는 식재료를 묶음으로 쓰면서 1인당 비용이 낮아지는 경우가 많습니다.",
  },
];

export const DVCC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/single-household-living-cost-2026/", label: "2026 1인 가구 생활비 분석" },
  { href: "/tools/household-income/", label: "가구소득 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/travel-savings-goal-calculator/", label: "여행 저축 목표 계산기" },
  { href: "/tools/ai-work-roi-calculator/", label: "AI 업무 ROI 계산기" },
];
