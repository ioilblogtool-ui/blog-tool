export type FoodOptionType = "homemade" | "brand";
export type FoodGrade = "standard" | "organic" | "premium" | null;
export type FoodStageKey = "initial" | "middle" | "late" | "complete";

export interface BabyFoodStage {
  stage: FoodStageKey;
  stageLabel: string;
  ageRange: string;
  servingG: number;
  listPrice: number | null;
  subscriptionPrice: number | null;
  pricePerHundredG: number;
  coupaUrl: string;
}

export interface BabyFoodOption {
  id: string;
  name: string;
  type: FoodOptionType;
  grade: FoodGrade;
  stages: BabyFoodStage[];
  pros: string[];
  cons: string[];
  bestFor: string;
  note: string;
}

export interface FoodMonthlyRow {
  stage: FoodStageKey;
  ageRangeLabel: string;
  dailyServings: number;
  dailyGrams: number;
  monthlyGrams: number;
}

export interface CumulativeCostRow {
  option: string;
  pricePerHundredG: number;
  totalCost: number;
  isLowest?: boolean;
}

export interface CookingToolItem {
  name: string;
  price: number;
  necessity: "essential" | "optional";
  affiliateUrl: string;
}

export interface TimeCostRow {
  scenario: string;
  weeklyMinutes: number;
  monthlyMinutes: number;
  monthlyTimeCostKrw: number;
}

export interface SubscriptionBenefit {
  brand: string;
  discountRate: string;
  condition: string;
  monthlySaving: number;
  affiliateUrl: string;
}

export interface BfdFaq {
  question: string;
  answer: string;
}

export interface BfdLink {
  href: string;
  label: string;
}

export interface FoodDecisionCard {
  title: string;
  headline: string;
  body: string;
  linksTo: string;
}

export interface FoodBuyingChecklist {
  title: string;
  body: string;
  risk: string;
}

export interface FoodCtaCard {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

// ── META ────────────────────────────────────────────────
export const BFD_META = {
  slug: "baby-food-cost-comparison-2026",
  title: "2026 이유식 비교표·직접 만들기 vs 시판 실비용 완전 비교",
  seoTitle: "이유식 비교 2026 | 직접 만들기 vs 베베쿡·잇마플 6개월 비용",
  description:
    "이유식을 직접 만들면 6개월에 얼마, 베베쿡·잇마플 등 시판 이유식을 쓰면 얼마인지 단계별로 비교했습니다. 시간 비용까지 반영한 진짜 비교, 정기배송 할인 정보까지 확인하세요.",
  updatedAt: "2026-06-27",
  dataNote:
    "이 리포트의 가격·시간 정보는 2026년 6월 기준 추정값입니다. 실제 가격은 판매처·시기·할인 조건에 따라 달라질 수 있으므로 구매 전 반드시 해당 판매처에서 최신 가격을 확인하세요.",
};

// ── 옵션 데이터 (홈메이드 1 + 브랜드 6) ────────────────────
export const OPTIONS: BabyFoodOption[] = [
  {
    id: "homemade",
    name: "홈메이드 이유식",
    type: "homemade",
    grade: null,
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: null, subscriptionPrice: null, pricePerHundredG: 1200, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: null, subscriptionPrice: null, pricePerHundredG: 1800, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: null, subscriptionPrice: null, pricePerHundredG: 2200, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: null, subscriptionPrice: null, pricePerHundredG: 2500, coupaUrl: "" },
    ],
    pros: ["재료 직접 선택 가능", "100g당 단가가 가장 저렴", "알레르기 유발 식품 도입 통제 용이"],
    cons: ["조리·소분·세척 시간 소요", "초기 도구 구매비 부담"],
    bestFor: "시간 여유가 있는 부모, 재료 선택을 직접 통제하고 싶은 경우",
    note: "배치 조리(주 1~2회 대량 조리 후 냉동 소분) 가정. 재료비는 마트 평균가 기준 추정.",
  },
  {
    id: "bebecook",
    name: "베베쿡",
    type: "brand",
    grade: "premium",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 3500, subscriptionPrice: 3000, pricePerHundredG: 7500, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 5800, subscriptionPrice: 5000, pricePerHundredG: 6250, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 6300, subscriptionPrice: 5500, pricePerHundredG: 6111, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 7200, subscriptionPrice: 6300, pricePerHundredG: 5727, coupaUrl: "" },
    ],
    pros: ["냉동 이유식 시장 1위 브랜드", "메뉴 다양성", "정기배송 편의성"],
    cons: ["100g당 단가가 직접 만들기 대비 4~5배 이상", "메뉴 변경 제약"],
    bestFor: "시간 부족한 맞벌이 부모, 메뉴 다양성을 원하는 경우",
    note: "정기배송 구조가 잘 갖춰진 프리미엄 라인.",
  },
  {
    id: "itmaple",
    name: "잇마플",
    type: "brand",
    grade: "standard",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 3000, subscriptionPrice: 2600, pricePerHundredG: 6500, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 5000, subscriptionPrice: 4400, pricePerHundredG: 5500, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 5500, subscriptionPrice: 4800, pricePerHundredG: 5333, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 6300, subscriptionPrice: 5500, pricePerHundredG: 5000, coupaUrl: "" },
    ],
    pros: ["베베쿡보다 저렴", "메뉴 구성 풍부", "정기배송 할인 적극적"],
    cons: ["원료 등급이 프리미엄 라인 대비 낮음"],
    bestFor: "시판 이유식 비용을 최대한 줄이고 싶은 부모",
    note: "가성비 냉동 이유식 브랜드.",
  },
  {
    id: "organicstart",
    name: "오가닉스타트",
    type: "brand",
    grade: "organic",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 4200, subscriptionPrice: 3700, pricePerHundredG: 9250, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 7200, subscriptionPrice: 6300, pricePerHundredG: 7875, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 8000, subscriptionPrice: 7000, pricePerHundredG: 7778, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 9200, subscriptionPrice: 8100, pricePerHundredG: 7364, coupaUrl: "" },
    ],
    pros: ["유기농 인증 원료", "첨가물 무첨가 마케팅"],
    cons: ["시판 옵션 중 가장 비쌈"],
    bestFor: "유기농 원료를 최우선으로 두는 부모",
    note: "유기농 인증을 받은 원료를 사용하는 프리미엄 라인.",
  },
  {
    id: "mylittlechef",
    name: "마이리틀쉐프",
    type: "brand",
    grade: "standard",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 2800, subscriptionPrice: 2400, pricePerHundredG: 6000, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 4600, subscriptionPrice: 4000, pricePerHundredG: 5000, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 5000, subscriptionPrice: 4400, pricePerHundredG: 4889, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 5700, subscriptionPrice: 5000, pricePerHundredG: 4545, coupaUrl: "" },
    ],
    pros: ["시판 옵션 중 가장 저렴한 편", "오프라인 구매 가능"],
    cons: ["브랜드 인지도 상대적으로 낮음"],
    bestFor: "시판 이유식 중 비용을 최우선으로 고려하는 부모",
    note: "중가형 브랜드, 마트 유통 병행.",
  },
  {
    id: "hellonature",
    name: "헬로네이처 이유식",
    type: "brand",
    grade: "premium",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 3800, subscriptionPrice: 3300, pricePerHundredG: 8250, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 6500, subscriptionPrice: 5700, pricePerHundredG: 7125, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 7200, subscriptionPrice: 6300, pricePerHundredG: 7000, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 8300, subscriptionPrice: 7300, pricePerHundredG: 6636, coupaUrl: "" },
    ],
    pros: ["신선도 마케팅", "새벽배송 연계"],
    cons: ["배송 지역 제한", "단가 높은 편"],
    bestFor: "신선도를 중시하고 새벽배송권에 거주하는 부모",
    note: "신선 배송을 강조하는 프리미엄 라인.",
  },
  {
    id: "babybon",
    name: "베이비본",
    type: "brand",
    grade: "standard",
    stages: [
      { stage: "initial", stageLabel: "초기", ageRange: "4~6개월", servingG: 40, listPrice: 2900, subscriptionPrice: 2500, pricePerHundredG: 6250, coupaUrl: "" },
      { stage: "middle", stageLabel: "중기", ageRange: "7~9개월", servingG: 80, listPrice: 4800, subscriptionPrice: 4200, pricePerHundredG: 5250, coupaUrl: "" },
      { stage: "late", stageLabel: "후기", ageRange: "10~12개월", servingG: 90, listPrice: 5200, subscriptionPrice: 4600, pricePerHundredG: 5111, coupaUrl: "" },
      { stage: "complete", stageLabel: "완료기", ageRange: "12개월~", servingG: 110, listPrice: 6000, subscriptionPrice: 5300, pricePerHundredG: 4818, coupaUrl: "" },
    ],
    pros: ["합리적인 가격", "정기배송 할인 적극적"],
    cons: ["브랜드 인지도 낮음", "메뉴 구성 제한적"],
    bestFor: "합리적인 가격의 시판 이유식을 찾는 부모",
    note: "시장 진입 중소 브랜드, 가격 경쟁력 강조.",
  },
];

// ── 단계별 소비량 ───────────────────────────────────────────
// 대한소아과학회 권고 참고, 추정값
export const MONTHLY_CONSUMPTION: FoodMonthlyRow[] = [
  { stage: "initial", ageRangeLabel: "4~6개월", dailyServings: 1, dailyGrams: 40, monthlyGrams: 1200 },
  { stage: "middle", ageRangeLabel: "7~9개월", dailyServings: 2, dailyGrams: 160, monthlyGrams: 4800 },
  { stage: "late", ageRangeLabel: "10~12개월", dailyServings: 3, dailyGrams: 270, monthlyGrams: 8100 },
  { stage: "complete", ageRangeLabel: "12~15개월", dailyServings: 3, dailyGrams: 330, monthlyGrams: 9900 },
];
// 6개월(초기~완료기 진입) 총 소비량 시뮬레이션 기준에 사용

// ── 6개월 누적 비용 ────────────────────────────────────────
export const CUMULATIVE_COST_ROWS: CumulativeCostRow[] = [
  { option: "홈메이드 이유식", pricePerHundredG: 1900, totalCost: 350000, isLowest: true },
  { option: "마이리틀쉐프", pricePerHundredG: 5160, totalCost: 1105000 },
  { option: "베이비본", pricePerHundredG: 5360, totalCost: 1151000 },
  { option: "잇마플", pricePerHundredG: 5590, totalCost: 1197000 },
  { option: "베베쿡", pricePerHundredG: 6440, totalCost: 1381000 },
  { option: "헬로네이처 이유식", pricePerHundredG: 7080, totalCost: 1519000 },
  { option: "오가닉스타트", pricePerHundredG: 7940, totalCost: 1703000 },
];

// ── 시간 비용 (섹션 ⑦) ──────────────────────────────────────
export const TIME_COST_SCENARIOS: TimeCostRow[] = [
  { scenario: "배치 조리 (주 1회, 3~4시간)", weeklyMinutes: 210, monthlyMinutes: 900, monthlyTimeCostKrw: 108000 },
  { scenario: "배치 조리 (주 2회, 각 2시간)", weeklyMinutes: 240, monthlyMinutes: 1030, monthlyTimeCostKrw: 123600 },
  { scenario: "매일 소량 조리 (1일 30분)", weeklyMinutes: 210, monthlyMinutes: 900, monthlyTimeCostKrw: 108000 },
];
// 2026년 최저시급(약 12,000원/시간 가정) 기준 추정. 6개월 기준 약 64.8만~74.2만 원.
export const HOMEMADE_TIME_COST_6M = 648000; // monthlyTimeCostKrw(108000) x 6, 추정
export const HOMEMADE_TOTAL_WITH_TIME_6M = 350000 + HOMEMADE_TIME_COST_6M; // 약 998,000원

// ── 조리도구 ────────────────────────────────────────────────
export const COOKING_TOOLS: CookingToolItem[] = [
  { name: "이유식 찜기/조리기", price: 89000, necessity: "essential", affiliateUrl: "" },
  { name: "핸드블렌더", price: 39000, necessity: "essential", affiliateUrl: "" },
  { name: "소분 용기/큐브 트레이 세트", price: 15000, necessity: "essential", affiliateUrl: "" },
  { name: "이유식 전자레인지 찜기", price: 25000, necessity: "optional", affiliateUrl: "" },
];
// 필수 항목 합계: 약 143,000원 (추정)

// ── 정기배송 혜택 ───────────────────────────────────────────
export const SUBSCRIPTION_BENEFITS: SubscriptionBenefit[] = [
  { brand: "베베쿡", discountRate: "최대 10%", condition: "정기배송 설정 시 자동 적용", monthlySaving: 13800, affiliateUrl: "" },
  { brand: "잇마플", discountRate: "최대 8%", condition: "정기배송 4주 이상 유지 시", monthlySaving: 9300, affiliateUrl: "" },
  { brand: "오가닉스타트", discountRate: "최대 12%", condition: "정기배송 설정 시 자동 적용", monthlySaving: 20400, affiliateUrl: "" },
];

export const FOOD_DECISION_CARDS: FoodDecisionCard[] = [
  {
    title: "시간 여유형",
    headline: "배치 조리 + 직접 만들기",
    body: "주 1~2회 배치 조리가 가능하다면 재료비만으로 6개월 약 35만 원선에서 방어할 수 있습니다. 시간 비용까지 더해도 시판 저가 옵션과 큰 차이가 없는 경우가 많습니다.",
    linksTo: "조리도구 초기 구매비(약 14만 원)는 장기적으로 재료비 절감으로 회수됩니다.",
  },
  {
    title: "맞벌이형",
    headline: "시판 + 정기배송 할인",
    body: "조리 시간을 내기 어렵다면 마이리틀쉐프·베이비본 같은 가성비 시판 브랜드를 정기배송으로 받는 것이 효율적입니다.",
    linksTo: "정기배송 할인(최대 12%)을 적용하면 6개월 약 6~12만 원 추가 절감이 가능합니다.",
  },
  {
    title: "혼합형",
    headline: "평일 시판 + 주말 직접 만들기",
    body: "평일은 시판 이유식, 주말은 직접 만들기로 병행하면 비용과 시간 부담을 모두 줄일 수 있습니다.",
    linksTo: "가장 합리적인 조합으로, 많은 부모가 실제로 선택하는 방식입니다.",
  },
  {
    title: "유기농 선호형",
    headline: "원료 등급과 총액을 분리해서 보기",
    body: "유기농 인증, 무첨가 같은 문구는 비교 포인트가 될 수 있지만, 6개월 총액은 일반 시판보다 50만 원 이상 커질 수 있습니다.",
    linksTo: "비용 대비 효과를 가족의 예산과 함께 판단하는 것이 중요합니다.",
  },
];

export const FOOD_BUYING_CHECKLIST: FoodBuyingChecklist[] = [
  {
    title: "100g 단가로 비교했는가",
    body: "1회분 용량이 브랜드마다 다르므로 100g당 가격으로 환산해 비교해야 합니다.",
    risk: "1회분 가격만 보고 고르면 실제 비용을 과소평가하기 쉽습니다.",
  },
  {
    title: "시간 비용까지 포함했는가",
    body: "직접 만들기는 재료비만 보면 저렴하지만, 조리·소분·세척 시간을 포함하면 차이가 줄어듭니다.",
    risk: "시간 비용을 무시하면 맞벌이 가정에서 의사결정이 어긋날 수 있습니다.",
  },
  {
    title: "정기배송 수량이 적절한가",
    body: "단계가 진행될수록 소비량이 늘어나므로 정기배송 수량을 단계별로 조정해야 합니다.",
    risk: "초기 수량 그대로 유지하면 후기·완료기에 부족해질 수 있습니다.",
  },
  {
    title: "알레르기 유발 식품 도입 순서를 지켰는가",
    body: "새로운 재료는 한 가지씩, 소량부터 시작해 아기 반응을 확인해야 합니다.",
    risk: "여러 재료를 한 번에 도입하면 알레르기 원인 파악이 어려워집니다.",
  },
  {
    title: "조리도구 구매가 실제로 필요한가",
    body: "6개월 이상 직접 만들기를 지속할 계획이라면 도구 구매비를 회수할 수 있습니다.",
    risk: "단기간만 직접 만들 계획이라면 도구 구매가 비효율적일 수 있습니다.",
  },
];

// ── 구매처/링크 ──────────────────────────────────────────────
export const BFD_FAQ: BfdFaq[] = [
  {
    question: "이유식을 직접 만드는 게 항상 더 저렴한가요?",
    answer:
      "재료비만 보면 직접 만들기가 더 저렴한 경우가 많습니다. 다만 조리·소분·세척에 드는 시간을 시급으로 환산하면 실질 비용이 시판 저가 브랜드와 비슷해지는 경우도 있습니다. 시간 여유와 가정 상황에 따라 선택하는 것이 좋습니다.",
  },
  {
    question: "베베쿡과 잇마플 중 어느 쪽이 더 나은가요?",
    answer:
      "두 브랜드 모두 식약처 기준을 충족하는 냉동 이유식입니다. 베베쿡은 메뉴 다양성과 브랜드 신뢰도가 높고, 잇마플은 가격이 더 저렴한 편입니다. 아기의 식성과 가정의 예산에 따라 선택하는 것을 권장합니다.",
  },
  {
    question: "이유식 정기배송 할인이 실제로 더 저렴한가요?",
    answer:
      "정기배송 할인(6~12%)을 적용하면 단건 구매 대비 저렴한 경우가 많습니다. 다만 정기배송은 메뉴 구성이 고정되거나 변경이 제한될 수 있으므로, 아기 취향을 먼저 확인한 뒤 신청하는 것을 권장합니다.",
  },
  {
    question: "이유식 조리도구를 사는 게 본전이 되나요?",
    answer:
      "6개월 이상 직접 만들기를 지속할 계획이라면 찜기·블렌더 등 초기 구매비(약 14만 원, 추정)는 재료비 절감으로 충분히 회수 가능한 경우가 많습니다. 단기간만 직접 만들 계획이라면 시판 이유식과 병행하는 것이 효율적일 수 있습니다.",
  },
  {
    question: "직접 만들기와 시판을 섞어서 써도 괜찮은가요?",
    answer:
      "가능합니다. 평일은 시판, 주말은 직접 만들기 등으로 병행하면 비용과 시간 부담을 모두 줄일 수 있습니다. 다만 알레르기 유발 식품은 새로 도입할 때 한 가지씩, 소량부터 시작하는 것이 안전합니다.",
  },
  {
    question: "이유식 단계(초기·중기·후기·완료기)는 언제 바뀌나요?",
    answer:
      "일반적으로 초기는 4~6개월, 중기는 7~9개월, 후기는 10~12개월, 완료기는 12개월 이후를 기준으로 합니다. 다만 아기의 발달 속도(앉기, 씹기 등)에 따라 차이가 있으므로 소아과 상담을 통해 시작·전환 시점을 결정하는 것이 좋습니다.",
  },
  {
    question: "유기농 이유식은 일반 시판 이유식보다 얼마나 비싸나요?",
    answer:
      "오가닉스타트 기준으로 보면 일반 시판 옵션(마이리틀쉐프)보다 약 1.5배 비쌉니다. 6개월 기준으로 유기농 이유식을 선택하면 일반 시판 대비 약 55만 원 추가 지출이 예상됩니다. (추정) 유기농 인증은 원료 생산 과정의 농약·항생제 기준이 엄격하다는 의미이며, 완성된 이유식의 영양 성분 차이는 크지 않다는 견해도 있습니다.",
  },
  {
    question: "6개월 이유식 비용을 가장 효과적으로 줄이는 방법은 무엇인가요?",
    answer:
      "① 직접 만들기 시 배치 조리로 시간 효율화 ② 시판 이용 시 정기배송 할인(최대 12%) 적용 ③ 평일 시판 + 주말 직접 만들기 등 혼합 방식 활용 ④ 가성비 시판 브랜드(마이리틀쉐프 등) 선택. 가정의 시간 여유에 따라 가장 효율적인 조합이 달라집니다.",
  },
];

export const BFD_RELATED_LINKS: BfdLink[] = [
  { href: "/reports/baby-formula-brand-cost-comparison-2026/", label: "분유 가격 비교표 2026" },
  { href: "/tools/diaper-cost/", label: "기저귀 비용 계산기" },
  { href: "/tools/breastfeeding-vs-formula-cost/", label: "모유수유 vs 분유 비용 계산기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아부터 돌까지 육아비용 총정리" },
  { href: "/reports/baby-cost-2016-vs-2026/", label: "아이 키우는 비용 2016 vs 2026" },
];

export const BFD_CTA_CARDS: FoodCtaCard[] = [
  {
    href: "/reports/baby-formula-brand-cost-comparison-2026/",
    eyebrow: "이전 단계",
    title: "분유 가격 비교표 2026",
    description: "이유식 시작 전 분유 단계의 브랜드별 실비용을 먼저 확인하세요.",
    cta: "분유 비교표 보기",
  },
  {
    href: "/tools/diaper-cost/",
    eyebrow: "반복 지출",
    title: "기저귀 비용 계산기",
    description: "이유식과 함께 매달 나가는 기저귀 비용을 브랜드·월령 기준으로 이어서 확인합니다.",
    cta: "기저귀값 계산",
  },
  {
    href: "/reports/baby-cost-guide-first-year/",
    eyebrow: "1년 육아비",
    title: "신생아부터 돌까지 육아비용 총정리",
    description: "분유, 기저귀, 병원비, 이유식, 육아용품까지 첫해 총비용을 한 번에 봅니다.",
    cta: "첫해 비용 보기",
  },
];
