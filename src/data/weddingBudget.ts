export const PAGE_META = {
  title: "결혼 준비 예산 계산기 | 웨딩홀 비용·스드메 비용·신혼여행 비용 한 번에",
  subtitle:
    "결혼 준비 예산 계산기에서 서울·수도권·지방 기준값과 가성비·평균·고급 티어를 바탕으로 웨딩홀 비용, 스드메 비용, 신혼여행 비용, 예식 준비 비용을 한 번에 계산합니다.",
  methodology:
    "지역 기준값은 2025~2026 공개 웨딩 비용 자료를 참고해 결혼 비용 비교에 맞는 중간값으로 재구성했습니다.",
  caution:
    "모든 결혼 비용 수치는 계획용 추정치이며 실제 계약가, 옵션 추가, 시즌, 지역에 따라 차이가 날 수 있습니다.",
  updatedAt: "2026년 3월 31일 반영",
};

export const REGION_LABELS = {
  seoul: "서울",
  metro: "수도권",
  local: "지방",
} as const;

export const TIER_LABELS = {
  budget: "가성비",
  average: "평균",
  premium: "고급",
} as const;

export const SHARE_MODE_LABELS = {
  half: "반반",
  ratio: "비율 입력",
  category: "카테고리별 분담",
} as const;

export type WeddingRegion = keyof typeof REGION_LABELS;
export type WeddingTier = keyof typeof TIER_LABELS;
export type ShareMode = keyof typeof SHARE_MODE_LABELS;

export type RegionPreset = {
  hallRentalBase: number;
  mealPriceBase: number;
  sdmBase: number;
  honeymoonBase: number;
  note: string;
};

export const REGION_PRESETS: Record<WeddingRegion, RegionPreset> = {
  seoul: {
    hallRentalBase: 700,
    mealPriceBase: 7.2,
    sdmBase: 365,
    honeymoonBase: 700,
    note: "서울은 강남권 포함 평균보다 약간 보수적인 중간값 기준입니다.",
  },
  metro: {
    hallRentalBase: 410,
    mealPriceBase: 5.8,
    sdmBase: 300,
    honeymoonBase: 600,
    note: "수도권은 경기권 체감가 기준으로 웨딩홀과 식대를 낮춰 잡았습니다.",
  },
  local: {
    hallRentalBase: 280,
    mealPriceBase: 5,
    sdmBase: 260,
    honeymoonBase: 500,
    note: "지방은 비수도권 평균 계약금액을 기준으로 구성했습니다.",
  },
};

export type TierPreset = {
  hallMultiplier: number;
  sdmMultiplier: number;
  honeymoonMultiplier: number;
  extraOptionLevel: "low" | "medium" | "high";
};

export const TIER_PRESETS: Record<WeddingTier, TierPreset> = {
  budget: { hallMultiplier: 0.82, sdmMultiplier: 0.82, honeymoonMultiplier: 0.8, extraOptionLevel: "low" },
  average: { hallMultiplier: 1, sdmMultiplier: 1, honeymoonMultiplier: 1, extraOptionLevel: "medium" },
  premium: { hallMultiplier: 1.25, sdmMultiplier: 1.35, honeymoonMultiplier: 1.4, extraOptionLevel: "high" },
};

export const HONEYMOON_PRESETS = {
  southeast_asia: { label: "동남아", baseCost: 500, days: 5, travelerCount: 2 },
  japan: { label: "일본", baseCost: 350, days: 4, travelerCount: 2 },
  hawaii: { label: "하와이", baseCost: 700, days: 6, travelerCount: 2 },
  europe: { label: "유럽", baseCost: 900, days: 8, travelerCount: 2 },
  maldives: { label: "몰디브", baseCost: 1000, days: 6, travelerCount: 2 },
} as const;

export type HoneymoonPresetCode = keyof typeof HONEYMOON_PRESETS;

export type BudgetItem = {
  key: string;
  label: string;
  defaultCost?: number;
  optional?: boolean;
  defaultVisible?: boolean;
  group?: string;
  auto?: boolean;
};

export type BudgetCategory = {
  key: string;
  label: string;
  description: string;
  accent: string;
  items: BudgetItem[];
};

export const CATEGORY_DEFINITIONS: BudgetCategory[] = [
  {
    key: "weddingPrep",
    label: "예식 준비",
    description: "상견례, 부모님 선물, 웨딩밴드, 청첩장, 답례품, 피부관리",
    accent: "#f97316",
    items: [
      { key: "familyMeeting", label: "상견례 식사", defaultCost: 30 },
      { key: "parentGift", label: "부모님 선물", defaultCost: 50, optional: true },
      { key: "weddingBand", label: "웨딩밴드", defaultCost: 300, optional: true },
      { key: "invitationPrint", label: "종이 청첩장", defaultCost: 30 },
      { key: "invitationMobile", label: "모바일 청첩장", defaultCost: 5 },
      { key: "returnGift", label: "답례품", defaultCost: 40, optional: true },
      { key: "beautyCare", label: "피부관리", defaultCost: 80, optional: true },
    ],
  },
  {
    key: "hall",
    label: "웨딩홀",
    description: "대관, 기본 장식, 가족 한복, 촬영, 식대, 행사 옵션",
    accent: "#2563eb",
    items: [
      { key: "rental", label: "웨딩홀 대관료", defaultCost: 0 },
      { key: "basicDecor", label: "기본 장식", defaultCost: 100 },
      { key: "bouquet", label: "부케·부토니에", defaultCost: 30 },
      { key: "hanbok", label: "혼주 한복·메이크업", defaultCost: 120, optional: true },
      { key: "mainSnap", label: "본식 메인 스냅", defaultCost: 70, optional: true },
      { key: "subSnap", label: "서브·아이폰 스냅", defaultCost: 25, optional: true },
      { key: "videoPre", label: "식전 영상", defaultCost: 30, optional: true, defaultVisible: false },
      { key: "videoMain", label: "식중 영상", defaultCost: 30, optional: true, defaultVisible: false },
      { key: "helper", label: "헬퍼비", defaultCost: 25, optional: true },
      { key: "mcTip", label: "사회·축가 사례", defaultCost: 30, optional: true },
      { key: "photoTable", label: "포토테이블 장식", defaultCost: 15, optional: true, defaultVisible: false },
      { key: "flowerShower", label: "플라워샤워", defaultCost: 10, optional: true, defaultVisible: false },
      { key: "weddingCar", label: "웨딩카", defaultCost: 15, optional: true, defaultVisible: false },
      { key: "mealBrideSide", label: "신부 측 식대 합계", defaultCost: 0, auto: true },
      { key: "mealGroomSide", label: "신랑 측 식대 합계", defaultCost: 0, auto: true },
    ],
  },
  {
    key: "sdm",
    label: "스드메",
    description: "기본 패키지와 원본 구매, 드레스 업그레이드, 턱시도, 한복 옵션",
    accent: "#db2777",
    items: [
      { key: "package", label: "스드메 기본 패키지", defaultCost: 0 },
      { key: "originalFiles", label: "원본·수정본 구매", defaultCost: 30, optional: true },
      { key: "studioSnack", label: "스튜디오 간식", defaultCost: 10, optional: true, defaultVisible: false },
      { key: "retouch", label: "사진 보정 추가", defaultCost: 20, optional: true, defaultVisible: false },
      { key: "frame", label: "액자·프레임", defaultCost: 20, optional: true, defaultVisible: false },
      { key: "dressFitting", label: "드레스 피팅비", defaultCost: 10, optional: true },
      { key: "dressUpgrade", label: "드레스 업그레이드", defaultCost: 50, optional: true },
      { key: "casualDress", label: "캐주얼 드레스", defaultCost: 20, optional: true, defaultVisible: false },
      { key: "secondDress", label: "2부 드레스", defaultCost: 30, optional: true, defaultVisible: false },
      { key: "tuxedoRental", label: "턱시도 대여", defaultCost: 30, optional: true },
      { key: "earlyStart", label: "이른 시작 비용", defaultCost: 15, optional: true, defaultVisible: false },
      { key: "hanbokRental", label: "한복 대여", defaultCost: 30, optional: true, defaultVisible: false },
    ],
  },
  {
    key: "honeymoon",
    label: "신혼여행",
    description: "여행지와 티어에 따라 항공, 숙박, 현지비를 자동 계산",
    accent: "#0891b2",
    items: [
      { key: "flight", label: "항공", defaultCost: 0 },
      { key: "hotel", label: "숙박", defaultCost: 0 },
      { key: "localSpend", label: "현지 교통·식사", defaultCost: 0 },
      { key: "shopping", label: "쇼핑·선물", defaultCost: 0, optional: true },
      { key: "exchange", label: "환전 예산", defaultCost: 0, optional: true, defaultVisible: false },
      { key: "insurance", label: "여행자보험", defaultCost: 0 },
      { key: "etc", label: "기타 비용", defaultCost: 0, optional: true, defaultVisible: false },
    ],
  },
];

export const CATEGORY_OWNER_OPTIONS = [
  { value: "groom", label: "신랑 측" },
  { value: "bride", label: "신부 측" },
  { value: "split", label: "반반" },
] as const;

export type CategoryOwner = (typeof CATEGORY_OWNER_OPTIONS)[number]["value"];

export const DEFAULT_CATEGORY_OWNERS: Record<string, CategoryOwner> = {
  weddingPrep: "split",
  hall: "split",
  sdm: "bride",
  honeymoon: "split",
};

export type WeddingPreset = {
  region: WeddingRegion;
  tier: WeddingTier;
  honeymoonPreset: HoneymoonPresetCode;
  guestCountGroom: number;
  guestCountBride: number;
  mealPriceGroom: number;
  mealPriceBride: number;
  categories: Record<string, Record<string, number>>;
};

export const HERO_METRICS = [
  { label: "현실 카테고리", value: "4개" },
  { label: "지역 기준", value: "3종" },
  { label: "신혼여행 지역", value: "5종" },
];

export const PAGE_FAQ = [
  {
    question: "이전보다 왜 총예산이 낮아졌나요?",
    answer:
      "이번 개편에서는 임의 합산 항목을 줄이고, 공개 자료에서 반복적으로 확인되는 기본 항목과 중간값만 남겨 초기 총액이 과하게 부풀지 않도록 조정했습니다.",
  },
  {
    question: "웨딩홀 비용에서 식대는 어떻게 계산하나요?",
    answer:
      "신랑 측 하객 수와 신부 측 하객 수를 따로 입력하면 각 식대 단가와 곱해 자동 합산합니다. 실제 분담을 반영하기 쉽도록 양가 식대를 분리했습니다.",
  },
  {
    question: "스드메와 신혼여행은 왜 기본값이 자동으로 들어가나요?",
    answer:
      "지역 기준값과 티어 배수, 신혼여행 지역 기준을 합쳐 먼저 현실적인 초안을 만들고, 이후 실제 견적에 맞춰 각 옵션을 조정할 수 있게 하기 위한 구조입니다.",
  },
  {
    question: "실제 계약 전에 무엇을 확인해야 하나요?",
    answer:
      "웨딩홀은 대관료와 식대 조건, 스드메는 원본·보정·드레스 업그레이드 비용, 신혼여행은 항공·리조트·세금 포함 여부를 각각 다시 확인해야 합니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/household-income/", label: "가구 소득 계산기" },
  { href: "/tools/salary-tier/", label: "내 연봉은 몇 티어?" },
];

export const DEFAULT_REGION: WeddingRegion = "seoul";
export const DEFAULT_TIER: WeddingTier = "average";
export const DEFAULT_HONEYMOON_PRESET: HoneymoonPresetCode = "southeast_asia";

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

function buildHoneymoonItems(honeymoonPreset: HoneymoonPresetCode, honeymoonMultiplier: number) {
  const base = HONEYMOON_PRESETS[honeymoonPreset].baseCost * honeymoonMultiplier;
  const ratios = honeymoonPreset === "japan"
    ? { flight: 0.28, hotel: 0.34, localSpend: 0.18, shopping: 0.1, exchange: 0.04, insurance: 0.03, etc: 0.03 }
    : honeymoonPreset === "hawaii"
      ? { flight: 0.37, hotel: 0.4, localSpend: 0.11, shopping: 0.05, exchange: 0.03, insurance: 0.02, etc: 0.02 }
      : honeymoonPreset === "europe"
        ? { flight: 0.36, hotel: 0.4, localSpend: 0.14, shopping: 0.04, exchange: 0.03, insurance: 0.015, etc: 0.015 }
        : honeymoonPreset === "maldives"
          ? { flight: 0.33, hotel: 0.45, localSpend: 0.12, shopping: 0.04, exchange: 0.02, insurance: 0.02, etc: 0.02 }
          : { flight: 0.36, hotel: 0.38, localSpend: 0.14, shopping: 0.05, exchange: 0.03, insurance: 0.02, etc: 0.02 };

  return Object.fromEntries(
    Object.entries(ratios).map(([key, ratio]) => [key, roundOne(base * ratio)]),
  ) as Record<string, number>;
}

export function buildPreset(
  region: WeddingRegion,
  tier: WeddingTier,
  honeymoonPreset: HoneymoonPresetCode = DEFAULT_HONEYMOON_PRESET,
): WeddingPreset {
  const regionBase = REGION_PRESETS[region];
  const tierBase = TIER_PRESETS[tier];

  return {
    region,
    tier,
    honeymoonPreset,
    guestCountGroom: region === "seoul" ? 110 : region === "metro" ? 95 : 85,
    guestCountBride: region === "seoul" ? 105 : region === "metro" ? 90 : 80,
    mealPriceGroom: regionBase.mealPriceBase,
    mealPriceBride: regionBase.mealPriceBase,
    categories: {
      weddingPrep: {
        familyMeeting: 30,
        parentGift: 50,
        weddingBand: tier === "budget" ? 180 : tier === "premium" ? 450 : 300,
        invitationPrint: 30,
        invitationMobile: 5,
        returnGift: tier === "budget" ? 20 : tier === "premium" ? 60 : 40,
        beautyCare: tier === "budget" ? 40 : tier === "premium" ? 120 : 80,
      },
      hall: {
        rental: roundOne(regionBase.hallRentalBase * tierBase.hallMultiplier),
        basicDecor: roundOne(100 * tierBase.hallMultiplier),
        bouquet: 30,
        hanbok: tier === "budget" ? 60 : tier === "premium" ? 160 : 120,
        mainSnap: 70,
        subSnap: tier === "budget" ? 0 : tier === "premium" ? 40 : 25,
        videoPre: tier === "premium" ? 35 : 30,
        videoMain: tier === "budget" ? 0 : 30,
        helper: 25,
        mcTip: 30,
        photoTable: tier === "premium" ? 20 : 15,
        flowerShower: tier === "budget" ? 0 : 10,
        weddingCar: tier === "premium" ? 20 : 15,
        mealBrideSide: 0,
        mealGroomSide: 0,
      },
      sdm: {
        package: roundOne(regionBase.sdmBase * tierBase.sdmMultiplier),
        originalFiles: 30,
        studioSnack: tier === "premium" ? 15 : 10,
        retouch: tier === "premium" ? 30 : 20,
        frame: tier === "premium" ? 30 : 20,
        dressFitting: 10,
        dressUpgrade: tier === "budget" ? 20 : tier === "premium" ? 90 : 50,
        casualDress: tier === "premium" ? 30 : 20,
        secondDress: tier === "premium" ? 50 : 30,
        tuxedoRental: 30,
        earlyStart: tier === "premium" ? 20 : 15,
        hanbokRental: tier === "premium" ? 40 : 30,
      },
      honeymoon: buildHoneymoonItems(honeymoonPreset, tierBase.honeymoonMultiplier),
    },
  };
}

export function calcPresetTotal(preset: WeddingPreset) {
  const mealTotal =
    preset.guestCountGroom * preset.mealPriceGroom +
    preset.guestCountBride * preset.mealPriceBride;

  return CATEGORY_DEFINITIONS.reduce((sum, category) => {
    const categoryItems = preset.categories[category.key] ?? {};
    const categoryTotal = Object.values(categoryItems).reduce((acc, value) => acc + value, 0);
    return sum + categoryTotal;
  }, mealTotal);
}

export function formatManwon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

export function formatKoreanLarge(value: number) {
  if (value >= 10000) {
    const eok = value / 10000;
    return `${eok.toFixed(eok >= 10 ? 0 : 1)}억원`;
  }
  return `${roundOne(value).toLocaleString("ko-KR")}만원`;
}


