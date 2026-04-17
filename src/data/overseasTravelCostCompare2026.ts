// 일본·동남아·유럽 여행 실비용 비교 2026
// 2026년 4월 기준 추정 데이터 (공개 시세 참고)
// 모든 금액 KRW(원화), isEstimate: true

export type RegionId = "japan" | "southeast-asia" | "europe";
export type CityId =
  | "tokyo"
  | "osaka"
  | "bangkok"
  | "hanoi"
  | "manila"
  | "paris"
  | "rome"
  | "barcelona";
export type TravelStyle = "budget" | "standard" | "premium";
export type DurationKey = "2n3d" | "4n5d" | "7n8d";

export interface FlightData {
  offseason: { min: number; max: number }; // 2인 합산 KRW
  regular: { min: number; max: number };
  peak: { min: number; max: number };
  luggageNote: string;
  luggageExtra: number; // 배낭형 LCC 추가 수하물 2인 추정, KRW
}

export interface AccommodationData {
  hostel: number; // 1박 2인 1실 중앙값, KRW
  standard: number;
  premium: number;
  taxNote: string;
  taxPerNightPer: number; // 1인 1박 기준 KRW (0이면 없음)
}

export interface FoodData {
  cheapMealPer: number; // 저가 식당 1끼 1인, KRW
  midMeal2p: number; // 중급 2인 식사 합산, KRW
  coffeePer: number; // 커피/음료 1인, KRW
}

export interface TransportData {
  dailyPerPerson: number; // 시내 대중교통 1일 평균 1인, KRW
  airportTransferPer: number; // 공항 이동 편도 1인, KRW
}

export interface AttractionItem {
  name: string;
  pricePer: number; // 1인, KRW
  official: boolean;
}

export interface SimData {
  threeDayPer: number; // eSIM/유심 3일 패키지 1인, KRW
  fiveDayPer: number;
  eightDayPer: number;
}

export interface CityData {
  id: CityId;
  region: RegionId;
  label: string;
  country: string;
  currency: string;
  exchangeRate: number; // 1 현지통화 = nKRW
  exchangeRateLabel: string;
  flightHours: number;
  flight: FlightData;
  accommodation: AccommodationData;
  food: FoodData;
  transport: TransportData;
  attractions: AttractionItem[];
  sim: SimData;
  insuranceAvg2p: number; // 여행자보험 2인 합산 전기간 추정 (4박5일 기준), KRW
  summary: string;
  isEstimate: true;
}

export interface TotalBudgetRow {
  cityId: CityId;
  flight: number;
  luggage: number;
  accommodation: number;
  food: number;
  transport: number;
  attractions: number;
  sim: number;
  insurance: number;
  misc: number;
  total: number;
}

export type BudgetMatrix = {
  [S in TravelStyle]: {
    [D in DurationKey]: TotalBudgetRow[];
  };
};

// ─────────────────────────────────────────────────────────────────────
// 메타
// ─────────────────────────────────────────────────────────────────────
export const TRAVEL_REPORT_META = {
  slug: "overseas-travel-cost-compare-2026",
  title: "일본·동남아·유럽 여행 실비용 비교 2026",
  updatedAt: "2026-04",
  baseCurrency: "KRW",
  exchangeBaseDate: "2026-04",
  persons: 2,
  rateNote:
    "JPY 100=890원, THB 1=39원, VND 10000=55원, PHP 1=24원, EUR 1=1460원 기준 (추정)",
} as const;

// ─────────────────────────────────────────────────────────────────────
// 도시 데이터 (8개)
// ─────────────────────────────────────────────────────────────────────
export const CITIES: CityData[] = [
  {
    id: "tokyo",
    region: "japan",
    label: "도쿄",
    country: "일본",
    currency: "JPY",
    exchangeRate: 8.9, // 1JPY = 8.9KRW
    exchangeRateLabel: "JPY 100 = 약 890원",
    flightHours: 2.5,
    flight: {
      offseason: { min: 600_000, max: 1_000_000 },
      regular: { min: 800_000, max: 1_400_000 },
      peak: { min: 1_400_000, max: 2_200_000 },
      luggageNote: "LCC 수하물 추가 시 2인 약 4만원 별도",
      luggageExtra: 40_000,
    },
    accommodation: {
      hostel: 70_000,
      standard: 175_000,
      premium: 390_000,
      taxNote: "숙박세 별도 부과 지역 있음",
      taxPerNightPer: 0,
    },
    food: {
      cheapMealPer: 11_000,
      midMeal2p: 60_000,
      coffeePer: 6_000,
    },
    transport: {
      dailyPerPerson: 8_000,
      airportTransferPer: 15_000,
    },
    attractions: [
      { name: "스카이트리 콤보", pricePer: 27_000, official: true },
      { name: "팀랩 보더리스", pricePer: 36_000, official: true },
      { name: "우에노동물원", pricePer: 6_000, official: true },
    ],
    sim: { threeDayPer: 9_000, fiveDayPer: 12_000, eightDayPer: 16_000 },
    insuranceAvg2p: 40_000,
    summary: "근거리·압도적 인프라. 엔화 약세로 가성비 상승 중",
    isEstimate: true,
  },
  {
    id: "osaka",
    region: "japan",
    label: "오사카",
    country: "일본",
    currency: "JPY",
    exchangeRate: 8.9,
    exchangeRateLabel: "JPY 100 = 약 890원",
    flightHours: 2.0,
    flight: {
      offseason: { min: 560_000, max: 1_000_000 },
      regular: { min: 760_000, max: 1_300_000 },
      peak: { min: 1_300_000, max: 2_100_000 },
      luggageNote: "LCC 수하물 추가 시 2인 약 4만원 별도",
      luggageExtra: 40_000,
    },
    accommodation: {
      hostel: 60_000,
      standard: 140_000,
      premium: 320_000,
      taxNote: "없음",
      taxPerNightPer: 0,
    },
    food: {
      cheapMealPer: 10_000,
      midMeal2p: 55_000,
      coffeePer: 6_000,
    },
    transport: {
      dailyPerPerson: 7_000,
      airportTransferPer: 10_000,
    },
    attractions: [
      { name: "오사카 어메이징패스 1일권", pricePer: 31_000, official: true },
      { name: "유니버설스튜디오 재팬", pricePer: 85_000, official: true },
      { name: "오사카성", pricePer: 7_000, official: true },
    ],
    sim: { threeDayPer: 9_000, fiveDayPer: 12_000, eightDayPer: 16_000 },
    insuranceAvg2p: 40_000,
    summary: "도쿄보다 저렴하고 먹거리 강세. 간사이공항 LCC 취항 많음",
    isEstimate: true,
  },
  {
    id: "bangkok",
    region: "southeast-asia",
    label: "방콕",
    country: "태국",
    currency: "THB",
    exchangeRate: 39,
    exchangeRateLabel: "THB 1 = 약 39원",
    flightHours: 5.5,
    flight: {
      offseason: { min: 700_000, max: 1_200_000 },
      regular: { min: 900_000, max: 1_600_000 },
      peak: { min: 1_600_000, max: 2_400_000 },
      luggageNote: "LCC 수하물 추가 시 2인 약 6만원 별도",
      luggageExtra: 60_000,
    },
    accommodation: {
      hostel: 30_000,
      standard: 95_000,
      premium: 240_000,
      taxNote: "없음",
      taxPerNightPer: 0,
    },
    food: {
      cheapMealPer: 5_000,
      midMeal2p: 30_000,
      coffeePer: 3_000,
    },
    transport: {
      dailyPerPerson: 3_000,
      airportTransferPer: 5_000,
    },
    attractions: [
      { name: "왕궁·왓프라깨우", pricePer: 6_000, official: true },
      { name: "짐톰슨 하우스", pricePer: 2_000, official: true },
      { name: "아유타야 당일투어", pricePer: 13_000, official: false },
    ],
    sim: { threeDayPer: 6_000, fiveDayPer: 8_000, eightDayPer: 12_000 },
    insuranceAvg2p: 30_000,
    summary: "현지 물가 최강. 항공권이 총비용 가장 큰 비중 차지",
    isEstimate: true,
  },
  {
    id: "hanoi",
    region: "southeast-asia",
    label: "하노이",
    country: "베트남",
    currency: "VND",
    exchangeRate: 0.055, // 1VND = 0.055KRW (10000VND = 550KRW)
    exchangeRateLabel: "VND 10,000 = 약 550원",
    flightHours: 5.0,
    flight: {
      offseason: { min: 600_000, max: 1_100_000 },
      regular: { min: 800_000, max: 1_500_000 },
      peak: { min: 1_500_000, max: 2_300_000 },
      luggageNote: "LCC 수하물 추가 시 2인 약 6만원 별도",
      luggageExtra: 60_000,
    },
    accommodation: {
      hostel: 30_000,
      standard: 75_000,
      premium: 195_000,
      taxNote: "없음",
      taxPerNightPer: 0,
    },
    food: {
      cheapMealPer: 4_000,
      midMeal2p: 25_000,
      coffeePer: 2_500,
    },
    transport: {
      dailyPerPerson: 3_000,
      airportTransferPer: 4_000,
    },
    attractions: [
      { name: "하롱베이 1일투어", pricePer: 12_000, official: false },
      { name: "호아로수용소", pricePer: 1_500, official: true },
      { name: "호치민묘", pricePer: 0, official: true },
    ],
    sim: { threeDayPer: 6_000, fiveDayPer: 8_000, eightDayPer: 12_000 },
    insuranceAvg2p: 30_000,
    summary: "동남아 최저 물가. 하롱베이 투어 포함 시 일정 비용 추가",
    isEstimate: true,
  },
  {
    id: "manila",
    region: "southeast-asia",
    label: "마닐라",
    country: "필리핀",
    currency: "PHP",
    exchangeRate: 24,
    exchangeRateLabel: "PHP 1 = 약 24원",
    flightHours: 4.0,
    flight: {
      offseason: { min: 600_000, max: 1_100_000 },
      regular: { min: 800_000, max: 1_400_000 },
      peak: { min: 1_400_000, max: 2_200_000 },
      luggageNote: "LCC 수하물 추가 시 2인 약 6만원 별도",
      luggageExtra: 60_000,
    },
    accommodation: {
      hostel: 30_000,
      standard: 80_000,
      premium: 230_000,
      taxNote: "없음",
      taxPerNightPer: 0,
    },
    food: {
      cheapMealPer: 5_000,
      midMeal2p: 28_000,
      coffeePer: 3_000,
    },
    transport: {
      dailyPerPerson: 3_000,
      airportTransferPer: 5_000,
    },
    attractions: [
      { name: "이날무롤 섬투어", pricePer: 8_000, official: false },
      { name: "인트라무로스", pricePer: 1_000, official: true },
      { name: "마닐라동물원", pricePer: 500, official: true },
    ],
    sim: { threeDayPer: 6_000, fiveDayPer: 8_000, eightDayPer: 12_000 },
    insuranceAvg2p: 30_000,
    summary: "영어권+근거리 이점. 공항 혼잡·교통 정체 주의",
    isEstimate: true,
  },
  {
    id: "paris",
    region: "europe",
    label: "파리",
    country: "프랑스",
    currency: "EUR",
    exchangeRate: 1460,
    exchangeRateLabel: "EUR 1 = 약 1,460원",
    flightHours: 12.0,
    flight: {
      offseason: { min: 1_600_000, max: 2_600_000 },
      regular: { min: 2_000_000, max: 3_400_000 },
      peak: { min: 3_400_000, max: 5_000_000 },
      luggageNote: "FSC 기준 수하물 포함",
      luggageExtra: 0,
    },
    accommodation: {
      hostel: 120_000,
      standard: 290_000,
      premium: 675_000,
      taxNote: "도시세(taxe de séjour) 1인 1박 약 0.6~3.3유로",
      taxPerNightPer: 3_000, // 약 2유로 × 1460
    },
    food: {
      cheapMealPer: 16_000,
      midMeal2p: 100_000,
      coffeePer: 7_000,
    },
    transport: {
      dailyPerPerson: 15_000,
      airportTransferPer: 20_000,
    },
    attractions: [
      { name: "에펠탑 최상층", pricePer: 54_000, official: true },
      { name: "루브르박물관", pricePer: 29_000, official: true },
      { name: "오르세미술관", pricePer: 29_000, official: true },
    ],
    sim: { threeDayPer: 10_000, fiveDayPer: 15_000, eightDayPer: 20_000 },
    insuranceAvg2p: 60_000,
    summary: "유럽 3개 도시 중 항공·숙박·식비 모두 최고 수준",
    isEstimate: true,
  },
  {
    id: "rome",
    region: "europe",
    label: "로마",
    country: "이탈리아",
    currency: "EUR",
    exchangeRate: 1460,
    exchangeRateLabel: "EUR 1 = 약 1,460원",
    flightHours: 12.5,
    flight: {
      offseason: { min: 1_700_000, max: 2_700_000 },
      regular: { min: 2_100_000, max: 3_500_000 },
      peak: { min: 3_500_000, max: 5_200_000 },
      luggageNote: "FSC 기준 수하물 포함",
      luggageExtra: 0,
    },
    accommodation: {
      hostel: 105_000,
      standard: 255_000,
      premium: 565_000,
      taxNote: "도시세(tassa di soggiorno) 1인 1박 약 3.5~7유로",
      taxPerNightPer: 7_300, // 약 5유로 × 1460
    },
    food: {
      cheapMealPer: 14_000,
      midMeal2p: 85_000,
      coffeePer: 5_000,
    },
    transport: {
      dailyPerPerson: 13_000,
      airportTransferPer: 18_000,
    },
    attractions: [
      { name: "바티칸박물관+시스티나", pricePer: 36_000, official: true },
      { name: "콜로세움", pricePer: 29_000, official: true },
      { name: "보르게세갤러리", pricePer: 29_000, official: true },
    ],
    sim: { threeDayPer: 10_000, fiveDayPer: 15_000, eightDayPer: 20_000 },
    insuranceAvg2p: 60_000,
    summary: "문화유산 밀집. 도시세+예약 필수 관광지 주의",
    isEstimate: true,
  },
  {
    id: "barcelona",
    region: "europe",
    label: "바르셀로나",
    country: "스페인",
    currency: "EUR",
    exchangeRate: 1460,
    exchangeRateLabel: "EUR 1 = 약 1,460원",
    flightHours: 13.0,
    flight: {
      offseason: { min: 1_700_000, max: 2_800_000 },
      regular: { min: 2_200_000, max: 3_600_000 },
      peak: { min: 3_600_000, max: 5_400_000 },
      luggageNote: "FSC 기준 수하물 포함",
      luggageExtra: 0,
    },
    accommodation: {
      hostel: 100_000,
      standard: 230_000,
      premium: 510_000,
      taxNote: "도시세(taxa turística) 1인 1박 약 1~4유로",
      taxPerNightPer: 4_380, // 약 3유로 × 1460
    },
    food: {
      cheapMealPer: 13_000,
      midMeal2p: 80_000,
      coffeePer: 5_000,
    },
    transport: {
      dailyPerPerson: 12_000,
      airportTransferPer: 15_000,
    },
    attractions: [
      { name: "사그라다파밀리아", pricePer: 36_000, official: true },
      { name: "구엘공원", pricePer: 15_000, official: true },
      { name: "피카소미술관", pricePer: 16_000, official: true },
    ],
    sim: { threeDayPer: 10_000, fiveDayPer: 15_000, eightDayPer: 20_000 },
    insuranceAvg2p: 60_000,
    summary: "유럽 3개 도시 중 상대적 저렴. 소매치기 주의",
    isEstimate: true,
  },
];

// ─────────────────────────────────────────────────────────────────────
// 총예산 매트릭스 계산 헬퍼
// 스탠다드 4박5일 기준 → 나머지 파생
// ─────────────────────────────────────────────────────────────────────

function buildRow(
  city: CityData,
  style: TravelStyle,
  nights: number,
  days: number,
  simKey: "threeDayPer" | "fiveDayPer" | "eightDayPer",
  insuranceScale: number
): TotalBudgetRow {
  // 항공: 스탠다드=일반 중앙값, 배낭=비수기 중앙값×0.75, 프리미엄=일반 상단×1.05
  const flightStd = Math.round((city.flight.regular.min + city.flight.regular.max) / 2);
  const flightBudget = Math.round(
    (city.flight.offseason.min + city.flight.offseason.max) / 2 * 0.9
  );
  const flightPremium = Math.round(city.flight.regular.max * 1.05);

  const flightMap: Record<TravelStyle, number> = {
    budget: flightBudget,
    standard: flightStd,
    premium: flightPremium,
  };
  const flight = flightMap[style];

  // 수하물
  const luggageMap: Record<TravelStyle, number> = {
    budget: city.flight.luggageExtra,
    standard: 0,
    premium: 0,
  };
  const luggage = luggageMap[style];

  // 숙박 (2인 1실 × nights)
  const accomMap: Record<TravelStyle, number> = {
    budget: city.accommodation.hostel,
    standard: city.accommodation.standard,
    premium: city.accommodation.premium,
  };
  const accommodation = Math.round(accomMap[style] * nights);

  // 도시세 (1인 1박 × 2인 × nights)
  const misc = Math.round(city.accommodation.taxPerNightPer * 2 * nights);

  // 식비: 1일 2인 합산
  // 배낭: 저가 3끼×2인 + 커피2인 / 스탠다드: 저가 2끼×2인 + 중급1회 + 커피2인 / 프리미엄: 저가1끼×2인 + 중급2회 + 커피2인
  const foodDailyMap: Record<TravelStyle, number> = {
    budget: city.food.cheapMealPer * 3 * 2 + city.food.coffeePer * 2,
    standard:
      city.food.cheapMealPer * 2 * 2 + city.food.midMeal2p + city.food.coffeePer * 2,
    premium:
      city.food.cheapMealPer * 1 * 2 + city.food.midMeal2p * 2 + city.food.coffeePer * 2,
  };
  const food = Math.round(foodDailyMap[style] * days);

  // 교통: 시내 1일×2인×days + 공항 편도×2(왕복)×2인
  const transport = Math.round(
    city.transport.dailyPerPerson * 2 * days +
      city.transport.airportTransferPer * 2 * 2
  );

  // 관광: 배낭=명소1개×2인, 스탠다드=2개×2인, 프리미엄=3개×2인
  const attrCountMap: Record<TravelStyle, number> = {
    budget: 1,
    standard: 2,
    premium: 3,
  };
  const attrCount = attrCountMap[style];
  const attractions = Math.round(
    city.attractions
      .slice(0, attrCount)
      .reduce((sum, a) => sum + a.pricePer, 0) * 2
  );

  // 통신: eSIM × 2인
  const sim = Math.round(city.sim[simKey] * 2);

  // 보험: 4박5일 기준 × 스케일
  const insurance = Math.round(city.insuranceAvg2p * insuranceScale);

  const total =
    flight + luggage + accommodation + food + transport + attractions + sim + insurance + misc;

  return {
    cityId: city.id,
    flight,
    luggage,
    accommodation,
    food,
    transport,
    attractions,
    sim,
    insurance,
    misc,
    total,
  };
}

// 기간별 보험 스케일 (4박5일=1.0 기준)
const INSURANCE_SCALE: Record<DurationKey, number> = {
  "2n3d": 0.7,
  "4n5d": 1.0,
  "7n8d": 1.5,
};

// 기간별 nights/days/simKey
const DURATION_PARAMS: Record<
  DurationKey,
  { nights: number; days: number; simKey: "threeDayPer" | "fiveDayPer" | "eightDayPer" }
> = {
  "2n3d": { nights: 2, days: 3, simKey: "threeDayPer" },
  "4n5d": { nights: 4, days: 5, simKey: "fiveDayPer" },
  "7n8d": { nights: 7, days: 8, simKey: "eightDayPer" },
};

function buildStyleDuration(
  style: TravelStyle,
  duration: DurationKey
): TotalBudgetRow[] {
  const { nights, days, simKey } = DURATION_PARAMS[duration];
  const scale = INSURANCE_SCALE[duration];
  return CITIES.map((city) => buildRow(city, style, nights, days, simKey, scale));
}

export const BUDGET_MATRIX: BudgetMatrix = {
  budget: {
    "2n3d": buildStyleDuration("budget", "2n3d"),
    "4n5d": buildStyleDuration("budget", "4n5d"),
    "7n8d": buildStyleDuration("budget", "7n8d"),
  },
  standard: {
    "2n3d": buildStyleDuration("standard", "2n3d"),
    "4n5d": buildStyleDuration("standard", "4n5d"),
    "7n8d": buildStyleDuration("standard", "7n8d"),
  },
  premium: {
    "2n3d": buildStyleDuration("premium", "2n3d"),
    "4n5d": buildStyleDuration("premium", "4n5d"),
    "7n8d": buildStyleDuration("premium", "7n8d"),
  },
};

// ─────────────────────────────────────────────────────────────────────
// 권역별 총평
// ─────────────────────────────────────────────────────────────────────
export const REGION_SUMMARY = {
  japan: {
    title: "일본",
    emoji: "🗾",
    pros: "근거리·안전·편리한 교통. 엔화 약세로 체감 물가 개선. 도쿄·오사카 모두 LCC 직항 많아 항공권 선택지 풍부.",
    cons: "성수기(벚꽃·단풍·연휴) 항공·숙박 급등. 관광지 입장료 인상 추세. 짐 많으면 LCC 수하물 추가 비용 주의.",
    recommend: "스탠다드형 4박5일 이상. 비수기 조기 예약으로 항공 절약 가능.",
  },
  "southeast-asia": {
    title: "동남아",
    emoji: "🌴",
    pros: "현지 물가 압도적으로 저렴. 식비·숙박·교통 모두 일본·유럽 대비 1/3~1/2 수준. 배낭형 여행자에게 최적.",
    cons: "항공권이 총예산의 50~65%를 차지. 우기·건기 시즌 체크 필수. 여행자보험 청구 케이스(위장·열대 질환) 있음.",
    recommend: "배낭형부터 스탠다드형까지 폭넓게 적합. 4박5일 이상 체류 시 단가 효율 높아짐.",
  },
  europe: {
    title: "유럽",
    emoji: "🏛️",
    pros: "풍부한 역사·문화 밀집도. 도시 간 이동(기차·버스) 일정 조합 유연. 미식·쇼핑·예술 경험 집약.",
    cons: "3권역 중 총예산 2~3배 수준. 도시세·환전 수수료·관광지 예약 필수. 소매치기 등 치안 주의.",
    recommend: "프리미엄형 혹은 스탠다드형 7박 이상. 항공권 6개월 이상 조기 예약 필수.",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────
// 절약 팁
// ─────────────────────────────────────────────────────────────────────
export const SAVING_TIPS: string[] = [
  "항공권은 출발 2~3개월 전 화요일·수요일 새벽에 검색하면 시세보다 저렴한 경우가 많습니다. 일본·동남아 LCC는 비수기 기준 1인 왕복 30~50만원대도 가능합니다.",
  "숙박은 시내 중심부보다 지하철 1~2정거장 떨어진 지역을 선택하면 동급 대비 20~30% 저렴합니다. 도쿄·파리는 특히 차이가 큽니다.",
  "유럽 도시세·관광지 예약 수수료는 현지 공식 사이트에서 온라인 사전 예약 시 할인 또는 무료 입장 혜택을 받을 수 있습니다.",
  "해외 결제는 해외 이용 수수료 없는 트래블카드(트래블로그·하나 트래블리 등)를 사용하면 환전 수수료 1~2%를 절약할 수 있습니다. 동남아 ATM 출금 시 현지 수수료(약 150~300바트) 주의.",
  "eSIM은 한국 출발 전 국내 앱에서 구매하면 현지 통신사 유심보다 20~40% 저렴합니다. 일행이 2인 이상이면 핫스팟 공유로 1인분 절약도 가능합니다.",
];

// ─────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "2인 기준 일본과 동남아 여행비 차이는 얼마나 나나요?",
    a: "스탠다드형 4박5일 기준으로 도쿄 약 244만원, 오사카 약 220만원인 반면 방콕 약 194만원, 하노이 약 172만원, 마닐라 약 171만원입니다. 동남아가 일본 대비 약 70만~80만원 저렴하지만, 항공권이 비슷한 수준이라 현지 물가 차이만큼 총예산 차이가 크지 않을 수 있습니다.",
  },
  {
    q: "유럽 여행은 항공권만 비싼 건가요, 현지 물가도 높은가요?",
    a: "항공권과 현지 물가 모두 높습니다. 스탠다드형 4박5일 기준 파리 약 498만원 중 항공권이 약 270만원(54%), 숙박·식비·교통·관광이 나머지 약 228만원입니다. 유럽은 1끼 식사도 2만원 내외, 숙박도 1박 20만원 이상이라 현지 체류 비용도 일본·동남아의 2배 수준입니다.",
  },
  {
    q: "4박5일 스탠다드 여행 기준 가장 저렴한 도시는 어디인가요?",
    a: "마닐라(약 171만원)와 하노이(약 172만원)가 가장 저렴합니다. 단, 두 도시 모두 항공권이 약 80~115만원으로 총예산의 50~65%를 차지하므로 항공권 시세에 따라 순위가 바뀔 수 있습니다. (모든 금액은 2026년 4월 기준 추정값)",
  },
  {
    q: "LCC와 FSC(대형항공사) 중 어느 쪽이 실제로 더 저렴한가요?",
    a: "일본·동남아 단거리 노선은 LCC가 기본 운임 기준으로 저렴하지만, 수하물(위탁 1개당 2인 약 4~6만원)·좌석 지정·기내식을 추가하면 FSC와 가격 차이가 줄어듭니다. 유럽 장거리는 FSC가 수하물 포함이므로 실질 비교가 필요합니다. 2~3일 단기 여행·배낭만 있다면 LCC, 4박 이상 수하물 필요 시 FSC 비교를 권장합니다.",
  },
  {
    q: "환율 변동이 여행 예산에 얼마나 영향을 주나요?",
    a: "환율이 5% 상승하면 일본(엔화 기반) 여행 총예산은 약 7~15만원 증가합니다. 유럽(유로화)은 같은 5% 변동 시 숙박·식비만 해도 약 15~30만원 차이가 날 수 있습니다. 여행 출발 2~3개월 전 환율 체크 후 유리할 때 미리 환전해두는 전략이 유효합니다.",
  },
  {
    q: "현금 환전과 카드 결제 중 어느 쪽이 유리한가요?",
    a: "해외 수수료 없는 트래블카드(트래블로그, 하나 트래블리 등)는 은행 환전 수수료(1~1.8%)보다 유리한 경우가 많습니다. 동남아 현지 ATM 인출은 출금 수수료(약 150~300바트)가 발생합니다. 현금이 필요한 소규모 상점·시장에서는 소액 현금 준비, 대형 식당·호텔·관광지는 카드 병행을 권장합니다.",
  },
  {
    q: "유럽 도시세(관광세)는 얼마나 되나요?",
    a: "파리는 1인 1박 약 0.6~3.3유로(약 900~4,800원), 로마는 약 3.5~7유로(약 5,100~10,200원), 바르셀로나는 약 1~4유로(약 1,460~5,840원)입니다. 4박5일 기준 2인 합산 시 파리 약 0.6만원, 로마 약 5.8만원, 바르셀로나 약 3.5만원 수준입니다. 숙박 체크아웃 시 현금으로 납부하는 경우가 많습니다.",
  },
  {
    q: "여행 스타일(배낭형 vs 프리미엄형)에 따라 총예산이 얼마나 다른가요?",
    a: "4박5일 기준 도쿄의 경우 배낭형 약 170만원, 스탠다드형 약 244만원, 프리미엄형 약 370만원으로 약 2배 차이가 납니다. 유럽은 파리 기준 배낭형 약 300만원, 스탠다드 약 498만원, 프리미엄 약 780만원으로 차이가 더 큽니다. 숙박 단가 차이가 스타일별 예산 격차를 가장 크게 좌우합니다. (추정값)",
  },
  {
    q: "여행자보험은 꼭 필요한가요?",
    a: "동남아·유럽 여행 시 적극 권장합니다. 동남아는 열대 질환·위장 질환 발생률이 높고, 유럽은 소매치기·분실 보상 필요성이 큽니다. 2인 기준 4박5일 보험료는 동남아 약 3만원, 유럽 약 6만원 수준으로 비용 대비 리스크 헤지 효과가 큽니다.",
  },
];

// ─────────────────────────────────────────────────────────────────────
// 환율·결제 전략 카드
// ─────────────────────────────────────────────────────────────────────
export const FX_STRATEGY_CARDS = [
  {
    title: "현금 환전",
    icon: "💴",
    pros: ["소규모 상점·시장 필수", "시세 좋을 때 미리 준비 가능"],
    cons: ["분실·도난 위험", "남은 외화 재환전 시 손실"],
    tip: "일본·동남아는 현지 ATM보다 한국 은행 환전 우대율이 유리한 경우가 많습니다.",
  },
  {
    title: "트래블카드",
    icon: "💳",
    pros: ["해외 수수료 0% 상품 존재", "실시간 환율 적용"],
    cons: ["ATM 인출 한도 확인 필요", "일부 소규모 가맹점 미사용"],
    tip: "트래블로그·하나 트래블리 등 수수료 없는 카드로 대부분의 결제를 커버하세요.",
  },
  {
    title: "현지 ATM 인출",
    icon: "🏧",
    pros: ["소액 긴급 현금 확보에 유용", "24시간 이용 가능"],
    cons: ["현지 수수료 별도(동남아 150~300바트)", "환율 불리한 경우 있음"],
    tip: "동남아에서는 자국 통화 인출을 선택하고, 수수료가 낮은 은행 ATM을 이용하세요.",
  },
];

// ─────────────────────────────────────────────────────────────────────
// 관련 링크
// ─────────────────────────────────────────────────────────────────────
export const RELATED_LINKS = [
  { label: "해외 여행 계산기", href: "/tools/overseas-travel-cost/" },
];
