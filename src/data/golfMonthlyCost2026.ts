export interface GolfCostDefaults {
  roundingCount: number;
  greenFee: number;
  caddyFee: number;
  cartFee: number;
  mealCost: number;
  practiceType: "monthly" | "session" | "none";
  practiceMonthly: number;
  practiceSessionCount: number;
  practiceSessionPrice: number;
  clubPrice: number;
  clubYears: number;
  consumables: number;
  shoesAnnual: number;
  apparelAnnual: number;
  insurance: number;
  screenCount: number;
  screenPrice: number;
  transportPerRound: number;
  hasCaddy: boolean;
  hasCart: boolean;
}

export const GMC_DEFAULTS: GolfCostDefaults = {
  roundingCount: 2,
  greenFee: 150_000,
  caddyFee: 30_000,
  cartFee: 15_000,
  mealCost: 30_000,
  practiceType: "monthly",
  practiceMonthly: 150_000,
  practiceSessionCount: 8,
  practiceSessionPrice: 10_000,
  clubPrice: 1_500_000,
  clubYears: 5,
  consumables: 30_000,
  shoesAnnual: 200_000,
  apparelAnnual: 300_000,
  insurance: 0,
  screenCount: 2,
  screenPrice: 20_000,
  transportPerRound: 20_000,
  hasCaddy: true,
  hasCart: true,
};

export interface FaqItem { question: string; answer: string; }

export const GMC_FAQ: FaqItem[] = [
  {
    question: "골프 월 유지비 평균이 얼마나 되나요?",
    answer: "라운딩 빈도와 골프장 수준에 따라 크게 다르지만, 월 2회 퍼블릭 기준 평균적으로 40~60만원 수준입니다. 연습장을 꾸준히 다니고 장비·의류 지출까지 포함하면 월 70~100만원에 달하는 경우도 많습니다.",
  },
  {
    question: "캐디피·카트비는 필수인가요?",
    answer: "대부분의 국내 골프장에서는 캐디 동반이 필수입니다. 카트는 선택 가능한 골프장도 있지만 퍼블릭의 경우 카트 이용이 거의 필수에 가깝습니다. 셀프 라운딩이 가능한 골프장을 이용하면 캐디피를 절감할 수 있습니다.",
  },
  {
    question: "클럽 세트는 얼마짜리를 사야 하나요?",
    answer: "입문자는 30~70만원의 중고 세트 또는 입문용 세트로 시작해도 충분합니다. 클럽보다 레슨과 연습에 투자하는 것이 실력 향상에 더 효과적입니다. 브랜드 신품 세트는 150만~수백만 원에 달합니다.",
  },
  {
    question: "스크린골프 비용도 포함해야 하나요?",
    answer: "스크린골프는 연습 효과와 저비용 라운딩 대안으로 활용하는 골퍼가 많습니다. 1회 1~3만원으로 필드 대비 저렴하므로 월 이용 횟수와 단가를 직접 입력해 포함 여부를 선택하세요.",
  },
  {
    question: "골프웨어 비용을 절감하는 방법이 있나요?",
    answer: "골프웨어는 드레스코드가 있는 골프장이 많아 필수 지출이지만, 아웃렛·시즌오프 세일을 활용하거나 일반 기능성 의류를 대체 사용하면 연간 10~20만원 수준으로도 유지할 수 있습니다.",
  },
  {
    question: "골프 보험이란 무엇인가요?",
    answer: "골프 중 홀인원·이글 달성 시 동반자 대접 비용과 골프장 내 사고(인신·물적)를 보장하는 보험입니다. 월 5,000~20,000원 수준이며 자주 라운딩하는 골퍼에게 유용합니다.",
  },
];

export const GMC_META = {
  slug: "golf-monthly-cost-calculator",
  title: "골프 월 유지비 계산기 2026",
  description: "라운딩·연습장·장비·의류 비용을 모두 합산해 실제 골프 월 유지비를 계산하고 항목별 비중을 확인하세요.",
};
