export type BirthdayRegion = "seoul" | "metro" | "majorCity" | "local";
export type PartyType = "familyMeal" | "banquet" | "hotelPremium" | "selfPartyRoom";
export type OptionTier = "none" | "value" | "standard" | "premium";

export type BirthdayRegionOption = {
  id: BirthdayRegion;
  label: string;
  multiplier: number;
  note: string;
};

export type PartyTypePreset = {
  id: PartyType;
  label: string;
  description: string;
  defaultGuestCount: number;
  defaultGuaranteedCount: number;
  defaultMealPrice: number;
  defaultVenuePackageCost: number;
  defaultReplyGiftUnitPrice: number;
};

export type OptionCost = {
  value: number;
  label: string;
};

export type BirthdayPartyInput = {
  region: BirthdayRegion;
  partyType: PartyType;
  guestCount: number;
  guaranteedCount: number;
  mealPrice: number;
  venuePackageCost: number;
  studioTier: OptionTier;
  eventSnapEnabled: boolean;
  eventSnapCost: number;
  childHanbokTier: OptionTier;
  parentHanbokEnabled: boolean;
  parentHanbokCost: number;
  dolTableTier: OptionTier;
  replyGiftUnitPrice: number;
  replyGiftCount: number;
  hostEventEnabled: boolean;
  hostEventCost: number;
  growthVideoEnabled: boolean;
  growthVideoCost: number;
  hairMakeupEnabled: boolean;
  hairMakeupCost: number;
  reserveRate: number;
  expectedGiftMoney: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const PAGE_META = {
  title: "돌잔치 비용 비교 계산기 | 스튜디오·한복·연회장 식대 총예산",
  subtitle:
    "하객 수, 보증 인원, 1인 식대, 스튜디오 촬영, 한복 대여, 돌상, 답례품을 입력해 돌잔치 총비용과 순부담액을 계산합니다.",
  updatedAt: "2026년 6월 기준",
};

export const BIRTHDAY_REGION_OPTIONS: BirthdayRegionOption[] = [
  { id: "seoul", label: "서울", multiplier: 1.18, note: "식대와 장소 패키지가 높은 편" },
  { id: "metro", label: "수도권", multiplier: 1, note: "기본 기준값" },
  { id: "majorCity", label: "광역시", multiplier: 0.96, note: "업체별 차이가 큰 구간" },
  { id: "local", label: "지방", multiplier: 0.9, note: "장소비와 식대가 낮은 편" },
];

export const PARTY_TYPE_PRESETS: PartyTypePreset[] = [
  {
    id: "familyMeal",
    label: "가족 식사",
    description: "직계 가족 중심의 소규모 식사형",
    defaultGuestCount: 20,
    defaultGuaranteedCount: 20,
    defaultMealPrice: 60000,
    defaultVenuePackageCost: 100000,
    defaultReplyGiftUnitPrice: 0,
  },
  {
    id: "banquet",
    label: "일반 연회장",
    description: "뷔페·한정식·연회장 중심의 표준형",
    defaultGuestCount: 60,
    defaultGuaranteedCount: 50,
    defaultMealPrice: 65000,
    defaultVenuePackageCost: 600000,
    defaultReplyGiftUnitPrice: 4000,
  },
  {
    id: "hotelPremium",
    label: "호텔·프리미엄",
    description: "호텔·프리미엄 홀 중심의 고급형",
    defaultGuestCount: 80,
    defaultGuaranteedCount: 70,
    defaultMealPrice: 120000,
    defaultVenuePackageCost: 1800000,
    defaultReplyGiftUnitPrice: 8000,
  },
  {
    id: "selfPartyRoom",
    label: "셀프 파티룸",
    description: "파티룸 대관과 셀프 상차림 중심",
    defaultGuestCount: 25,
    defaultGuaranteedCount: 0,
    defaultMealPrice: 35000,
    defaultVenuePackageCost: 500000,
    defaultReplyGiftUnitPrice: 3000,
  },
];

export const OPTION_LABELS: Record<OptionTier, string> = {
  none: "미사용",
  value: "가성비",
  standard: "일반",
  premium: "프리미엄",
};

export const OPTION_COSTS: Record<string, Record<OptionTier, OptionCost>> = {
  studio: {
    none: { value: 0, label: "촬영 없음" },
    value: { value: 400000, label: "기본 촬영" },
    standard: { value: 800000, label: "앨범 포함" },
    premium: { value: 1500000, label: "프리미엄 촬영" },
  },
  childHanbok: {
    none: { value: 0, label: "미사용" },
    value: { value: 80000, label: "기본 대여" },
    standard: { value: 150000, label: "일반 대여" },
    premium: { value: 300000, label: "프리미엄 대여" },
  },
  dolTable: {
    none: { value: 0, label: "미사용" },
    value: { value: 300000, label: "셀프·기본" },
    standard: { value: 700000, label: "일반 돌상" },
    premium: { value: 1500000, label: "프리미엄 돌상" },
  },
};

export const DEFAULT_INPUT: BirthdayPartyInput = {
  region: "metro",
  partyType: "banquet",
  guestCount: 60,
  guaranteedCount: 50,
  mealPrice: 65000,
  venuePackageCost: 600000,
  studioTier: "standard",
  eventSnapEnabled: true,
  eventSnapCost: 600000,
  childHanbokTier: "standard",
  parentHanbokEnabled: false,
  parentHanbokCost: 500000,
  dolTableTier: "standard",
  replyGiftUnitPrice: 4000,
  replyGiftCount: 60,
  hostEventEnabled: false,
  hostEventCost: 300000,
  growthVideoEnabled: false,
  growthVideoCost: 150000,
  hairMakeupEnabled: false,
  hairMakeupCost: 250000,
  reserveRate: 5,
  expectedGiftMoney: 0,
};

export const CONTRACT_CHECKLIST = [
  "보증 인원보다 적게 참석해도 식대가 어떻게 청구되는지 확인",
  "1인 식대에 부가세와 봉사료가 포함되는지 확인",
  "돌상, 사회자, 성장 영상, 스냅이 패키지에 포함되는지 확인",
  "주차 지원 시간과 추가 주차비 조건 확인",
  "계약금 환불, 날짜 변경, 취소 위약금 기준 확인",
];

export const FIRST_BIRTHDAY_FAQ: FaqItem[] = [
  {
    question: "돌잔치 비용은 보통 얼마 정도 잡아야 하나요?",
    answer:
      "가족 식사형은 100만~300만원, 일반 연회장형은 300만~700만원, 호텔·프리미엄형은 700만원 이상으로 커질 수 있습니다. 다만 실제 비용은 하객 수와 보증 인원, 1인 식대, 촬영·돌상 옵션에 따라 크게 달라집니다.",
  },
  {
    question: "하객 수보다 보증 인원이 중요한 이유는 무엇인가요?",
    answer:
      "연회장 계약은 실제 참석 인원이 아니라 보증 인원 기준으로 최소 식대가 청구되는 경우가 많습니다. 예를 들어 하객이 45명이어도 보증 인원이 60명이면 60명분 식대를 내야 할 수 있으므로 계약 전 반드시 확인해야 합니다.",
  },
  {
    question: "스튜디오 촬영과 행사 스냅은 둘 다 해야 하나요?",
    answer:
      "스튜디오 촬영은 돌 전후 기념사진을 남기는 목적이고, 행사 스냅은 당일 가족과 하객 분위기를 기록하는 목적입니다. 예산을 줄이고 싶다면 둘 중 하나만 선택하거나, 가족 식사형에서는 행사 스냅을 생략하는 방식도 가능합니다.",
  },
  {
    question: "한복은 대여와 구매 중 무엇이 유리한가요?",
    answer:
      "1회 착용이라면 대여가 비용 부담이 적은 편입니다. 다만 형제 행사나 가족사진 촬영 등 재사용 계획이 있다면 구매도 검토할 수 있지만, 사이즈와 보관 문제를 함께 고려해야 합니다.",
  },
  {
    question: "돌잔치 답례품은 몇 개 준비해야 하나요?",
    answer:
      "일반적으로 하객 수와 비슷하게 잡거나 5~10개 정도 여유를 두는 방식이 많습니다. 가족 식사형처럼 참석자가 적은 행사라면 답례품을 생략하고 식사나 사진 중심으로 구성해도 무리가 없습니다.",
  },
  {
    question: "축의금까지 고려하면 순부담액은 어떻게 계산하나요?",
    answer:
      "순부담액은 총비용에서 예상 축의금을 뺀 금액입니다. 다만 축의금은 확정 수입이 아니므로, 축의금을 전제로 예산을 과도하게 키우기보다는 총비용 자체가 감당 가능한지 먼저 확인하는 것이 좋습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/baby-government-support/", label: "출산·육아 지원금 계산기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아~돌 육아비용 가이드" },
  { href: "/tools/formula-cost/", label: "분유값 계산기" },
  { href: "/tools/diaper-cost/", label: "기저귀값 계산기" },
  { href: "/tools/wedding-budget-calculator/", label: "결혼 준비 예산 계산기" },
];
