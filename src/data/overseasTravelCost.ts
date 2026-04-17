export type TravelRegion = "japan" | "southeast-asia" | "europe" | "americas" | "taiwan-hongkong";

export type FlightClass = "lcc" | "economy" | "premium" | "business";
export type HotelTier = "guesthouse" | "3star" | "4star" | "5star";
export type EmergencyRate = 0.05 | 0.1 | 0.15;

export type TravelPreset = {
  id: string;
  label: string;
  region: TravelRegion;
  nights: number;
  days: number;
  persons: number;
  flightPerPerson: number;
  hotelPerNight: number;
  mealPerPersonPerDay: number;
  transportPerPersonPerDay: number;
  activityPerPersonPerDay: number;
  insurancePerPerson: number;
  shopping: number;
  budget: number;
  flightClass: FlightClass;
  hotelTier: HotelTier;
  emergencyRate: EmergencyRate;
  description: string;
};

export type RegionalGuide = {
  region: TravelRegion;
  label: string;
  avgFlightKRW: string;
  avgHotelPerNightKRW: string;
  avgMealPerDayKRW: string;
  characteristics: string;
  note: string;
};

export type RegionBaseCost = {
  flightEconomy: number;
  hotel3Star: number;
  mealPerPersonPerDay: number;
  transportPerPersonPerDay: number;
  activityPerPersonPerDay: number;
  insurancePerPerson: number;
};

export const TRAVEL_DEFAULT_INPUT = {
  region: "japan" as TravelRegion,
  persons: 2,
  days: 4,
  nights: 3,
  rooms: 1,
  flightClass: "economy" as FlightClass,
  hotelTier: "3star" as HotelTier,
  flightPerPerson: 350_000,
  hotelPerNight: 120_000,
  mealPerPersonPerDay: 40_000,
  transportPerPersonPerDay: 15_000,
  activityPerPersonPerDay: 20_000,
  insuranceEnabled: true,
  insurancePerPerson: 12_000,
  shopping: 200_000,
  emergencyRate: 0.1 as EmergencyRate,
  budget: 3_000_000,
};

export const TRAVEL_REGION_BASE_COSTS: Record<TravelRegion, RegionBaseCost> = {
  japan: {
    flightEconomy: 350_000,
    hotel3Star: 120_000,
    mealPerPersonPerDay: 40_000,
    transportPerPersonPerDay: 15_000,
    activityPerPersonPerDay: 20_000,
    insurancePerPerson: 12_000,
  },
  "southeast-asia": {
    flightEconomy: 320_000,
    hotel3Star: 80_000,
    mealPerPersonPerDay: 20_000,
    transportPerPersonPerDay: 10_000,
    activityPerPersonPerDay: 15_000,
    insurancePerPerson: 15_000,
  },
  europe: {
    flightEconomy: 1_400_000,
    hotel3Star: 220_000,
    mealPerPersonPerDay: 70_000,
    transportPerPersonPerDay: 30_000,
    activityPerPersonPerDay: 40_000,
    insurancePerPerson: 35_000,
  },
  americas: {
    flightEconomy: 1_700_000,
    hotel3Star: 250_000,
    mealPerPersonPerDay: 80_000,
    transportPerPersonPerDay: 35_000,
    activityPerPersonPerDay: 50_000,
    insurancePerPerson: 40_000,
  },
  "taiwan-hongkong": {
    flightEconomy: 420_000,
    hotel3Star: 150_000,
    mealPerPersonPerDay: 45_000,
    transportPerPersonPerDay: 18_000,
    activityPerPersonPerDay: 25_000,
    insurancePerPerson: 15_000,
  },
};

export const TRAVEL_PRESETS: TravelPreset[] = [
  {
    id: "japan-3n4d",
    label: "일본 3박 4일",
    region: "japan",
    nights: 3,
    days: 4,
    persons: 2,
    flightPerPerson: 350_000,
    hotelPerNight: 120_000,
    mealPerPersonPerDay: 40_000,
    transportPerPersonPerDay: 15_000,
    activityPerPersonPerDay: 20_000,
    insurancePerPerson: 12_000,
    shopping: 200_000,
    budget: 3_000_000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.1,
    description: "오사카·후쿠오카 기준의 가장 일반적인 2인 여행 예산입니다.",
  },
  {
    id: "sea-4n5d",
    label: "동남아 4박 5일",
    region: "southeast-asia",
    nights: 4,
    days: 5,
    persons: 2,
    flightPerPerson: 320_000,
    hotelPerNight: 80_000,
    mealPerPersonPerDay: 20_000,
    transportPerPersonPerDay: 10_000,
    activityPerPersonPerDay: 15_000,
    insurancePerPerson: 15_000,
    shopping: 150_000,
    budget: 2_600_000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.1,
    description: "방콕·다낭·세부 같은 가성비 노선에 맞춘 대표 예산입니다.",
  },
  {
    id: "europe-6n8d",
    label: "유럽 6박 8일",
    region: "europe",
    nights: 6,
    days: 8,
    persons: 2,
    flightPerPerson: 1_400_000,
    hotelPerNight: 220_000,
    mealPerPersonPerDay: 70_000,
    transportPerPersonPerDay: 30_000,
    activityPerPersonPerDay: 40_000,
    insurancePerPerson: 35_000,
    shopping: 300_000,
    budget: 7_500_000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.1,
    description: "파리·로마·바르셀로나처럼 항공과 숙박 비중이 높은 일정입니다.",
  },
  {
    id: "americas-5n7d",
    label: "미주 5박 7일",
    region: "americas",
    nights: 5,
    days: 7,
    persons: 2,
    flightPerPerson: 1_700_000,
    hotelPerNight: 250_000,
    mealPerPersonPerDay: 80_000,
    transportPerPersonPerDay: 35_000,
    activityPerPersonPerDay: 50_000,
    insurancePerPerson: 40_000,
    shopping: 400_000,
    budget: 8_500_000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.1,
    description: "미국 서부·뉴욕·캐나다처럼 항공과 현지 물가가 높은 구간입니다.",
  },
  {
    id: "tw-hk-3n4d",
    label: "대만·홍콩 3박 4일",
    region: "taiwan-hongkong",
    nights: 3,
    days: 4,
    persons: 2,
    flightPerPerson: 420_000,
    hotelPerNight: 150_000,
    mealPerPersonPerDay: 45_000,
    transportPerPersonPerDay: 18_000,
    activityPerPersonPerDay: 25_000,
    insurancePerPerson: 15_000,
    shopping: 250_000,
    budget: 3_400_000,
    flightClass: "economy",
    hotelTier: "3star",
    emergencyRate: 0.1,
    description: "도심 호텔 비중이 큰 타이베이·홍콩 일정에 맞춘 기본안입니다.",
  },
];

export const REGIONAL_GUIDES: RegionalGuide[] = [
  {
    region: "japan",
    label: "일본",
    avgFlightKRW: "30만~80만원",
    avgHotelPerNightKRW: "8만~20만원",
    avgMealPerDayKRW: "3만~6만원",
    characteristics: "가까운 단기 여행에 적합하고 항공 프로모션 체감 차이가 큽니다.",
    note: "벚꽃·연말 시즌에는 항공과 숙박이 평시 대비 2배 가까이 뛸 수 있습니다.",
  },
  {
    region: "southeast-asia",
    label: "동남아",
    avgFlightKRW: "25만~60만원",
    avgHotelPerNightKRW: "5만~15만원",
    avgMealPerDayKRW: "1만~3만원",
    characteristics: "식비와 교통비는 낮지만 리조트나 투어 선택에 따라 총액이 크게 달라집니다.",
    note: "리조트 업그레이드나 액티비티 추가가 붙으면 숙박·관광비 비중이 빠르게 커집니다.",
  },
  {
    region: "europe",
    label: "유럽",
    avgFlightKRW: "100만~200만원",
    avgHotelPerNightKRW: "15만~40만원",
    avgMealPerDayKRW: "5만~10만원",
    characteristics: "항공·숙박이 예산의 절반 이상을 차지하기 쉬워 장기 일정일수록 사전 예약이 중요합니다.",
    note: "유로 환율과 도시세, 수하물 추가요금에 따라 총액 차이가 크게 납니다.",
  },
  {
    region: "americas",
    label: "미주",
    avgFlightKRW: "130만~250만원",
    avgHotelPerNightKRW: "18만~45만원",
    avgMealPerDayKRW: "6만~12만원",
    characteristics: "항공 비중이 높고 팁 문화 때문에 현지 체감 지출이 커지기 쉽습니다.",
    note: "렌터카, 주차, 리조트피처럼 사후 청구되는 비용이 자주 붙습니다.",
  },
  {
    region: "taiwan-hongkong",
    label: "대만·홍콩",
    avgFlightKRW: "35만~90만원",
    avgHotelPerNightKRW: "10만~25만원",
    avgMealPerDayKRW: "3만~6만원",
    characteristics: "항공은 짧은 거리지만 도심 호텔 단가가 높아 숙박이 총액을 끌어올리기 쉽습니다.",
    note: "연휴·주말 집중 예약 시 객실 가격이 빠르게 올라갑니다.",
  },
];

export const COST_LABELS: Record<string, string> = {
  flight: "항공권",
  hotel: "숙박",
  meal: "식비",
  transport: "현지 교통",
  activity: "관광·입장료",
  insurance: "여행자보험",
  shopping: "쇼핑",
  emergency: "비상금",
};

export const TRAVEL_COST_TIPS = [
  "비수기 평일 출발로 항공권 단가를 낮추면 총액이 가장 크게 줄어듭니다.",
  "도심 한복판보다 지하철 1~2정거장 떨어진 숙소가 체감 만족도 대비 가성비가 좋은 편입니다.",
  "식비는 하루 평균이 아니라 아침·점심·저녁 패턴 기준으로 잡아야 과소 추정을 줄일 수 있습니다.",
  "유럽·미주는 수하물, 도시세, 리조트피처럼 현장에서 추가되는 비용을 꼭 별도로 잡는 편이 안전합니다.",
  "일정표를 짠 뒤 비상금 10%를 마지막에 더하면 예산 초과 위험을 많이 줄일 수 있습니다.",
];

export const TRAVEL_COST_FAQ = [
  {
    question: "해외여행 총비용에는 어떤 항목까지 넣어야 하나요?",
    answer:
      "항공권, 숙박, 식비, 현지 교통, 관광·입장료, 여행자보험, 쇼핑, 비상금까지 넣어야 실제 여행에 가까운 예산이 됩니다. 항공권만 보고 잡은 예산은 현지 지출 때문에 거의 항상 부족해집니다.",
  },
  {
    question: "숙박일수와 여행일수를 왜 따로 입력하나요?",
    answer:
      "여행일수는 식비·교통비·관광비 계산 기준이고, 숙박일수는 호텔 비용 계산 기준입니다. 일반적으로 3박 4일 일정이면 여행일수 4일, 숙박일수 3박으로 입력합니다.",
  },
  {
    question: "2인 여행인데 객실 수는 어떻게 잡는 게 맞나요?",
    answer:
      "기본값은 2인 1실입니다. 3~4명부터는 2실 이상이 필요한 경우가 많아 자동 추천 객실 수를 같이 보여주고, 가족·친구 조합에 따라 직접 조정할 수 있게 했습니다.",
  },
  {
    question: "비상금 10%는 꼭 넣어야 하나요?",
    answer:
      "필수는 아니지만 추천합니다. 여행 중에는 교통 지연, 현장 구매, 추가 식비, 간단한 약값처럼 예기치 않은 지출이 자주 생겨서 총액의 5~15%를 비상금으로 보는 편이 현실적입니다.",
  },
  {
    question: "여행자보험도 예산에 포함하는 게 좋나요?",
    answer:
      "네. 금액 자체는 크지 않지만 응급실, 수하물 지연, 항공 결항 보장 여부가 예산 안정성에 큰 차이를 만듭니다. 특히 유럽·미주 일정은 보험 포함이 더 안전합니다.",
  },
  {
    question: "환율이 바뀌면 실제 비용 차이가 큰가요?",
    answer:
      "현지 통화 기준 가격이 같아도 원화 환율이 바뀌면 총액이 크게 달라집니다. 유럽·미주처럼 항공과 숙박 비중이 높은 지역은 환율 변화가 수십만원 단위 차이로 이어질 수 있습니다.",
  },
];

export const TRAVEL_COST_RELATED_LINKS = [
  { href: "/reports/overseas-travel-cost-compare-2026/", label: "해외여행 경비 비교 2026 리포트" },
  { href: "/tools/wedding-budget-calculator/", label: "큰 지출 항목을 쪼개보는 예산 계산기" },
  { href: "/tools/household-income/", label: "월 체감 여력과 함께 보는 가구 소득 계산기" },
];
