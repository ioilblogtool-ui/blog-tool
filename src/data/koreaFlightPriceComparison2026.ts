// 2026 한국인 해외여행 항공권 가격 완전 비교
// 2026년 4월 기준 비교 목적 추정 데이터
// 금액은 KRW, RoutePrice는 성인 1인 왕복 일반석 기준

export type RegionId =
  | "japan"
  | "southeastAsia"
  | "chinaTaiwan"
  | "europe"
  | "americas"
  | "oceania";

export type PriceSeason = "offseason" | "regular" | "peak" | "superPeak";
export type CarrierType = "fsc" | "lcc" | "foreignTransfer";
export type BookingWindow = "d90" | "d60" | "d45" | "d30" | "d14" | "d7" | "d3" | "d0";

export interface PriceRange {
  min: number;
  max: number;
  isEstimate: true;
}

export interface RoutePrice {
  id: string;
  region: RegionId;
  origin: "ICN" | "GMP" | "PUS" | "TAE" | "CJJ";
  destination: string;
  destinationKo: string;
  countryKo: string;
  flightHours: number;
  prices: Record<PriceSeason, PriceRange>;
  priceFeel: "낮음" | "중간" | "높음" | "매우 높음";
  note: string;
}

export interface CarrierComparison {
  routeId: string;
  carrierType: CarrierType;
  label: string;
  baseFare: number;
  baggage: number;
  seatSelection: number;
  meal: number;
  total: number;
  verdict: string;
}

export interface BookingIndexPoint {
  window: BookingWindow;
  label: string;
  shortHaulIndex: number;
  midHaulIndex: number;
  longHaulIndex: number;
  comment: string;
}

export interface MonthlyHeatmapRow {
  region: RegionId;
  label: string;
  monthlyIndex: number[];
  summary: string;
}

export interface OptionScenario {
  id: string;
  title: string;
  routeId: string;
  partyLabel: string;
  baseFare: number;
  baggage: number;
  seatSelection: number;
  meal: number;
  airportTransfer: number;
  insurance: number;
  total: number;
  message: string;
}

export interface AirportComparison {
  airport: string;
  airportKo: string;
  bestFor: string;
  flightPriceNote: string;
  accessCost: string;
  risk: string;
}

export const KFP_META = {
  slug: "korea-flight-price-comparison-2026",
  title: "2026 한국인 해외여행 항공권 가격 완전 비교",
  description:
    "한국 출발 주요 해외 항공권을 노선별·항공사별·예약 시점별·옵션 포함 총비용 기준으로 비교합니다.",
  updatedAt: "2026-04",
  baseCurrency: "KRW",
  baseCondition: "성인 1인, 왕복, 일반석, 한국 출발 기준",
  estimateNote: "실시간 견적이 아닌 비교 목적 추정 범위값입니다.",
} as const;

export const REGION_LABELS: Record<RegionId, string> = {
  japan: "일본",
  southeastAsia: "동남아",
  chinaTaiwan: "중국·중화권",
  europe: "유럽",
  americas: "미주",
  oceania: "오세아니아",
};

const range = (min: number, max: number): PriceRange => ({ min, max, isEstimate: true });

export const ROUTE_PRICES: RoutePrice[] = [
  {
    id: "icn-osaka",
    region: "japan",
    origin: "ICN",
    destination: "KIX",
    destinationKo: "오사카",
    countryKo: "일본",
    flightHours: 2.0,
    prices: {
      offseason: range(200_000, 350_000),
      regular: range(350_000, 550_000),
      peak: range(500_000, 750_000),
      superPeak: range(750_000, 1_050_000),
    },
    priceFeel: "낮음",
    note: "LCC 취항이 많아 평일·비수기 가격 경쟁이 강합니다.",
  },
  {
    id: "icn-tokyo",
    region: "japan",
    origin: "ICN",
    destination: "NRT/HND",
    destinationKo: "도쿄",
    countryKo: "일본",
    flightHours: 2.5,
    prices: {
      offseason: range(250_000, 400_000),
      regular: range(400_000, 650_000),
      peak: range(600_000, 900_000),
      superPeak: range(900_000, 1_250_000),
    },
    priceFeel: "중간",
    note: "벚꽃철, 여름방학, 연말연시에는 같은 단거리라도 급등합니다.",
  },
  {
    id: "icn-fukuoka",
    region: "japan",
    origin: "ICN",
    destination: "FUK",
    destinationKo: "후쿠오카",
    countryKo: "일본",
    flightHours: 1.3,
    prices: {
      offseason: range(180_000, 320_000),
      regular: range(300_000, 500_000),
      peak: range(450_000, 700_000),
      superPeak: range(700_000, 950_000),
    },
    priceFeel: "낮음",
    note: "비행 시간이 짧아 주말 수요가 많고 금·일 출발 가격이 튀기 쉽습니다.",
  },
  {
    id: "icn-bangkok",
    region: "southeastAsia",
    origin: "ICN",
    destination: "BKK/DMK",
    destinationKo: "방콕",
    countryKo: "태국",
    flightHours: 5.5,
    prices: {
      offseason: range(280_000, 450_000),
      regular: range(450_000, 700_000),
      peak: range(700_000, 1_000_000),
      superPeak: range(1_000_000, 1_350_000),
    },
    priceFeel: "중간",
    note: "현지 물가는 낮지만 연말·설·휴가철 항공권 비중이 커집니다.",
  },
  {
    id: "icn-danang",
    region: "southeastAsia",
    origin: "ICN",
    destination: "DAD",
    destinationKo: "다낭",
    countryKo: "베트남",
    flightHours: 4.8,
    prices: {
      offseason: range(240_000, 420_000),
      regular: range(400_000, 650_000),
      peak: range(650_000, 950_000),
      superPeak: range(950_000, 1_250_000),
    },
    priceFeel: "중간",
    note: "가족 휴양 수요가 강해 방학 구간 가격 방어력이 높습니다.",
  },
  {
    id: "icn-cebu",
    region: "southeastAsia",
    origin: "ICN",
    destination: "CEB",
    destinationKo: "세부",
    countryKo: "필리핀",
    flightHours: 4.5,
    prices: {
      offseason: range(250_000, 450_000),
      regular: range(420_000, 700_000),
      peak: range(700_000, 1_000_000),
      superPeak: range(1_000_000, 1_300_000),
    },
    priceFeel: "중간",
    note: "리조트 패키지 수요와 항공권 단품 가격을 분리해서 봐야 합니다.",
  },
  {
    id: "icn-singapore",
    region: "southeastAsia",
    origin: "ICN",
    destination: "SIN",
    destinationKo: "싱가포르",
    countryKo: "싱가포르",
    flightHours: 6.3,
    prices: {
      offseason: range(350_000, 600_000),
      regular: range(550_000, 900_000),
      peak: range(850_000, 1_300_000),
      superPeak: range(1_300_000, 1_700_000),
    },
    priceFeel: "높음",
    note: "동남아 안에서도 운임과 현지 물가가 모두 높은 편입니다.",
  },
  {
    id: "icn-shanghai",
    region: "chinaTaiwan",
    origin: "ICN",
    destination: "PVG/SHA",
    destinationKo: "상하이",
    countryKo: "중국",
    flightHours: 2.2,
    prices: {
      offseason: range(250_000, 450_000),
      regular: range(400_000, 650_000),
      peak: range(600_000, 900_000),
      superPeak: range(900_000, 1_200_000),
    },
    priceFeel: "중간",
    note: "비즈니스 수요와 연휴 수요가 겹치면 단거리 대비 높아집니다.",
  },
  {
    id: "icn-taipei",
    region: "chinaTaiwan",
    origin: "ICN",
    destination: "TPE",
    destinationKo: "타이베이",
    countryKo: "대만",
    flightHours: 2.8,
    prices: {
      offseason: range(220_000, 380_000),
      regular: range(350_000, 600_000),
      peak: range(550_000, 850_000),
      superPeak: range(850_000, 1_150_000),
    },
    priceFeel: "중간",
    note: "주말 단기 여행 수요가 강해 금·토 출발 가격을 따로 봐야 합니다.",
  },
  {
    id: "icn-hongkong",
    region: "chinaTaiwan",
    origin: "ICN",
    destination: "HKG",
    destinationKo: "홍콩",
    countryKo: "홍콩",
    flightHours: 3.8,
    prices: {
      offseason: range(280_000, 500_000),
      regular: range(450_000, 750_000),
      peak: range(700_000, 1_050_000),
      superPeak: range(1_050_000, 1_400_000),
    },
    priceFeel: "높음",
    note: "항공권보다 숙박비와 함께 봐야 총여행비 판단이 정확합니다.",
  },
  {
    id: "icn-paris",
    region: "europe",
    origin: "ICN",
    destination: "CDG",
    destinationKo: "파리",
    countryKo: "프랑스",
    flightHours: 14.0,
    prices: {
      offseason: range(800_000, 1_300_000),
      regular: range(1_200_000, 1_800_000),
      peak: range(1_800_000, 2_500_000),
      superPeak: range(2_500_000, 3_200_000),
    },
    priceFeel: "높음",
    note: "성수기 직항과 경유 가격 차이가 커 조기 비교가 중요합니다.",
  },
  {
    id: "icn-london",
    region: "europe",
    origin: "ICN",
    destination: "LHR/LGW",
    destinationKo: "런던",
    countryKo: "영국",
    flightHours: 14.5,
    prices: {
      offseason: range(850_000, 1_400_000),
      regular: range(1_300_000, 1_900_000),
      peak: range(1_900_000, 2_700_000),
      superPeak: range(2_700_000, 3_400_000),
    },
    priceFeel: "매우 높음",
    note: "항공권과 현지 숙박비가 동시에 높아 총비용 부담이 큽니다.",
  },
  {
    id: "icn-rome",
    region: "europe",
    origin: "ICN",
    destination: "FCO",
    destinationKo: "로마",
    countryKo: "이탈리아",
    flightHours: 13.5,
    prices: {
      offseason: range(800_000, 1_350_000),
      regular: range(1_250_000, 1_850_000),
      peak: range(1_850_000, 2_600_000),
      superPeak: range(2_600_000, 3_300_000),
    },
    priceFeel: "높음",
    note: "유럽 내 환승 조합에 따라 직항 대비 절감 여지가 있습니다.",
  },
  {
    id: "icn-barcelona",
    region: "europe",
    origin: "ICN",
    destination: "BCN",
    destinationKo: "바르셀로나",
    countryKo: "스페인",
    flightHours: 14.2,
    prices: {
      offseason: range(850_000, 1_400_000),
      regular: range(1_300_000, 1_950_000),
      peak: range(1_900_000, 2_700_000),
      superPeak: range(2_700_000, 3_400_000),
    },
    priceFeel: "매우 높음",
    note: "여름 휴가철 수요가 강해 6~8월 변동폭이 큽니다.",
  },
  {
    id: "icn-la",
    region: "americas",
    origin: "ICN",
    destination: "LAX",
    destinationKo: "LA",
    countryKo: "미국",
    flightHours: 11.2,
    prices: {
      offseason: range(900_000, 1_400_000),
      regular: range(1_300_000, 2_000_000),
      peak: range(1_900_000, 2_800_000),
      superPeak: range(2_800_000, 3_600_000),
    },
    priceFeel: "높음",
    note: "여름·연말 수요가 모두 강한 대표 장거리 노선입니다.",
  },
  {
    id: "icn-newyork",
    region: "americas",
    origin: "ICN",
    destination: "JFK/EWR",
    destinationKo: "뉴욕",
    countryKo: "미국",
    flightHours: 14.0,
    prices: {
      offseason: range(1_000_000, 1_600_000),
      regular: range(1_500_000, 2_300_000),
      peak: range(2_200_000, 3_200_000),
      superPeak: range(3_200_000, 4_000_000),
    },
    priceFeel: "매우 높음",
    note: "직항 프리미엄이 커서 경유 옵션 비교가 필수입니다.",
  },
  {
    id: "icn-vancouver",
    region: "americas",
    origin: "ICN",
    destination: "YVR",
    destinationKo: "밴쿠버",
    countryKo: "캐나다",
    flightHours: 10.0,
    prices: {
      offseason: range(850_000, 1_350_000),
      regular: range(1_250_000, 1_900_000),
      peak: range(1_800_000, 2_600_000),
      superPeak: range(2_600_000, 3_300_000),
    },
    priceFeel: "높음",
    note: "미주 노선 중에서는 비교적 접근성이 좋지만 성수기 변동은 큽니다.",
  },
  {
    id: "icn-sydney",
    region: "oceania",
    origin: "ICN",
    destination: "SYD",
    destinationKo: "시드니",
    countryKo: "호주",
    flightHours: 10.5,
    prices: {
      offseason: range(850_000, 1_400_000),
      regular: range(1_300_000, 2_000_000),
      peak: range(1_900_000, 2_800_000),
      superPeak: range(2_800_000, 3_600_000),
    },
    priceFeel: "높음",
    note: "한국 겨울이 현지 성수기라 12~2월 가격이 높습니다.",
  },
  {
    id: "icn-melbourne",
    region: "oceania",
    origin: "ICN",
    destination: "MEL",
    destinationKo: "멜버른",
    countryKo: "호주",
    flightHours: 11.0,
    prices: {
      offseason: range(900_000, 1_500_000),
      regular: range(1_400_000, 2_100_000),
      peak: range(2_000_000, 3_000_000),
      superPeak: range(3_000_000, 3_800_000),
    },
    priceFeel: "매우 높음",
    note: "직항·경유 선택에 따라 가격과 총 이동시간 차이가 큽니다.",
  },
  {
    id: "icn-auckland",
    region: "oceania",
    origin: "ICN",
    destination: "AKL",
    destinationKo: "오클랜드",
    countryKo: "뉴질랜드",
    flightHours: 12.0,
    prices: {
      offseason: range(950_000, 1_600_000),
      regular: range(1_500_000, 2_300_000),
      peak: range(2_200_000, 3_200_000),
      superPeak: range(3_200_000, 4_000_000),
    },
    priceFeel: "매우 높음",
    note: "운항편 선택지가 제한적이라 조기 예약 영향이 큰 편입니다.",
  },
];

export const CARRIER_LABELS: Record<CarrierType, string> = {
  fsc: "FSC",
  lcc: "LCC",
  foreignTransfer: "외항사/경유",
};

export const CARRIER_COMPARISONS: CarrierComparison[] = [
  {
    routeId: "icn-osaka",
    carrierType: "lcc",
    label: "LCC 기본 운임",
    baseFare: 290_000,
    baggage: 70_000,
    seatSelection: 15_000,
    meal: 10_000,
    total: 385_000,
    verdict: "기내용만이면 강하지만 위탁수하물 추가 시 격차가 줄어듭니다.",
  },
  {
    routeId: "icn-osaka",
    carrierType: "fsc",
    label: "FSC 일반 운임",
    baseFare: 420_000,
    baggage: 0,
    seatSelection: 0,
    meal: 0,
    total: 420_000,
    verdict: "수하물과 스케줄 안정성을 포함하면 차이가 작습니다.",
  },
  {
    routeId: "icn-bangkok",
    carrierType: "lcc",
    label: "LCC 기본 운임",
    baseFare: 410_000,
    baggage: 80_000,
    seatSelection: 20_000,
    meal: 15_000,
    total: 525_000,
    verdict: "4박 이상이면 위탁수하물 비용을 반드시 더해야 합니다.",
  },
  {
    routeId: "icn-bangkok",
    carrierType: "fsc",
    label: "FSC 일반 운임",
    baseFare: 580_000,
    baggage: 0,
    seatSelection: 0,
    meal: 0,
    total: 580_000,
    verdict: "총비용 기준으로는 LCC와의 차이가 5만원대까지 줄 수 있습니다.",
  },
  {
    routeId: "icn-paris",
    carrierType: "foreignTransfer",
    label: "외항사 경유",
    baseFare: 1_220_000,
    baggage: 0,
    seatSelection: 55_000,
    meal: 0,
    total: 1_275_000,
    verdict: "시간을 더 쓰면 직항 대비 절감 여지가 있습니다.",
  },
  {
    routeId: "icn-paris",
    carrierType: "fsc",
    label: "FSC 직항",
    baseFare: 1_360_000,
    baggage: 0,
    seatSelection: 30_000,
    meal: 0,
    total: 1_390_000,
    verdict: "직항 시간 가치와 수하물 포함 조건을 함께 봐야 합니다.",
  },
];

export const BOOKING_INDEX: BookingIndexPoint[] = [
  { window: "d90", label: "90일 전", shortHaulIndex: 96, midHaulIndex: 94, longHaulIndex: 92, comment: "장거리 조기 예약이 가장 유리한 구간입니다." },
  { window: "d60", label: "60일 전", shortHaulIndex: 100, midHaulIndex: 100, longHaulIndex: 100, comment: "비교 기준점입니다. 선택 가능한 운임이 아직 넓습니다." },
  { window: "d45", label: "45일 전", shortHaulIndex: 103, midHaulIndex: 105, longHaulIndex: 108, comment: "국제선 저가 좌석이 줄어들기 시작합니다." },
  { window: "d30", label: "30일 전", shortHaulIndex: 108, midHaulIndex: 112, longHaulIndex: 118, comment: "인기 출발일은 가격 상승이 눈에 띄는 구간입니다." },
  { window: "d14", label: "14일 전", shortHaulIndex: 118, midHaulIndex: 126, longHaulIndex: 135, comment: "막판 특가보다 남은 좌석 운임이 더 중요해집니다." },
  { window: "d7", label: "7일 전", shortHaulIndex: 130, midHaulIndex: 142, longHaulIndex: 155, comment: "일정이 고정된 여행자에게 불리한 시점입니다." },
  { window: "d3", label: "3일 전", shortHaulIndex: 145, midHaulIndex: 160, longHaulIndex: 175, comment: "단거리도 선택지가 급격히 줄어듭니다." },
  { window: "d0", label: "당일", shortHaulIndex: 160, midHaulIndex: 180, longHaulIndex: 200, comment: "긴급·업무 수요 운임 중심으로 보는 편이 안전합니다." },
];

export const MONTHLY_HEATMAP: MonthlyHeatmapRow[] = [
  { region: "japan", label: "일본", monthlyIndex: [130, 115, 125, 140, 110, 95, 125, 135, 105, 120, 110, 145], summary: "벚꽃철과 연말연시가 가장 강합니다." },
  { region: "southeastAsia", label: "동남아", monthlyIndex: [135, 120, 100, 95, 90, 100, 125, 130, 95, 105, 115, 150], summary: "연말·설·여름방학 구간이 비쌉니다." },
  { region: "chinaTaiwan", label: "중국·중화권", monthlyIndex: [125, 120, 100, 105, 110, 95, 115, 125, 105, 120, 100, 135], summary: "단거리 주말 여행 수요와 연휴 영향이 큽니다." },
  { region: "europe", label: "유럽", monthlyIndex: [90, 85, 95, 110, 120, 140, 155, 150, 125, 110, 90, 130], summary: "6~8월 여름 성수기 변동폭이 가장 큽니다." },
  { region: "americas", label: "미주", monthlyIndex: [120, 95, 100, 110, 120, 145, 155, 145, 115, 105, 120, 150], summary: "여름과 연말 모두 강세입니다." },
  { region: "oceania", label: "오세아니아", monthlyIndex: [150, 135, 115, 105, 95, 90, 100, 105, 110, 120, 130, 155], summary: "한국 겨울이 현지 성수기라 12~2월이 높습니다." },
];

export const OPTION_SCENARIOS: OptionScenario[] = [
  {
    id: "osaka-short",
    title: "오사카 3박4일 단기",
    routeId: "icn-osaka",
    partyLabel: "2인 · LCC · 기내용만",
    baseFare: 700_000,
    baggage: 0,
    seatSelection: 30_000,
    meal: 0,
    airportTransfer: 60_000,
    insurance: 30_000,
    total: 820_000,
    message: "단기·가벼운 짐이면 LCC 우위가 유지됩니다.",
  },
  {
    id: "bangkok-standard",
    title: "방콕 4박5일 휴가",
    routeId: "icn-bangkok",
    partyLabel: "2인 · 위탁수하물 1개",
    baseFare: 1_100_000,
    baggage: 120_000,
    seatSelection: 40_000,
    meal: 30_000,
    airportTransfer: 50_000,
    insurance: 40_000,
    total: 1_380_000,
    message: "수하물과 좌석을 넣으면 FSC와의 격차가 크게 줄어듭니다.",
  },
  {
    id: "paris-long",
    title: "파리 7박9일 장거리",
    routeId: "icn-paris",
    partyLabel: "1인 · 23kg 수하물",
    baseFare: 1_500_000,
    baggage: 0,
    seatSelection: 50_000,
    meal: 0,
    airportTransfer: 50_000,
    insurance: 30_000,
    total: 1_630_000,
    message: "장거리는 직항 시간 가치와 경유 절감액을 같이 비교해야 합니다.",
  },
];

export const AIRPORT_COMPARISONS: AirportComparison[] = [
  {
    airport: "ICN",
    airportKo: "인천",
    bestFor: "대부분의 국제선, 장거리, 선택지 최우선",
    flightPriceNote: "노선과 항공사 선택지가 가장 넓어 비교 기준 공항으로 적합",
    accessCost: "수도권 기준 공항철도·리무진·자가용 비용 추가",
    risk: "새벽 출발이면 전날 이동·숙박비가 붙을 수 있음",
  },
  {
    airport: "GMP",
    airportKo: "김포",
    bestFor: "일본 일부 노선, 도심 접근성 우선",
    flightPriceNote: "선택지는 적지만 접근비와 시간을 줄일 수 있음",
    accessCost: "서울 도심 접근 비용이 낮음",
    risk: "국제선 노선이 제한적이라 날짜 유연성이 떨어짐",
  },
  {
    airport: "PUS",
    airportKo: "부산",
    bestFor: "영남권 출발 일본·동남아",
    flightPriceNote: "인천 이동비를 줄이면 총비용이 더 낮을 수 있음",
    accessCost: "부산·경남권은 접근비 우위",
    risk: "직항 편수와 운항 요일 제한 확인 필요",
  },
  {
    airport: "TAE/CJJ",
    airportKo: "대구·청주",
    bestFor: "특정 LCC 특가, 지방 거주자",
    flightPriceNote: "항공권은 낮아도 노선·시간 선택지가 좁음",
    accessCost: "거주지와 맞으면 인천 대비 이동비 절감",
    risk: "결항·스케줄 변경 시 대체편 선택이 제한적",
  },
];

export const SAVING_TIPS = [
  "장거리 노선은 60~90일 전 가격 알림을 켜고 직항·경유를 같이 비교합니다.",
  "LCC는 기본가가 아니라 위탁수하물, 좌석 지정, 기내식 포함 총액으로 봅니다.",
  "단거리 주말 여행은 금요일 출발·일요일 귀국을 피하면 체감 차이가 큽니다.",
  "지방 거주자는 인천 이동비와 전날 숙박비까지 더해 출발 공항을 고릅니다.",
  "가족 여행은 좌석 지정과 수하물 개수가 늘어나므로 FSC가 더 합리적일 수 있습니다.",
];

export const RELATED_LINKS = [
  { label: "해외여행 총비용 계산기", href: "/tools/overseas-travel-cost/" },
  { label: "해외여행 비용 비교 리포트", href: "/reports/overseas-travel-cost-compare-2026/" },
];

export const FAQ_ITEMS = [
  {
    q: "2026년 항공권은 언제 사는 게 가장 저렴한가요?",
    a: "노선과 시즌에 따라 다르지만 장거리 국제선은 60~90일 전부터 비교하는 편이 유리합니다. 단거리 LCC는 특가가 나올 수 있지만 성수기와 주말은 조기 예약이 더 안정적입니다.",
  },
  {
    q: "일본 항공권은 몇 월이 가장 비싼가요?",
    a: "벚꽃철, 여름방학, 연말연시가 비싼 구간입니다. 특히 4월과 12월 말은 같은 노선이라도 비수기 대비 2배 이상 벌어질 수 있습니다.",
  },
  {
    q: "동남아 항공권은 LCC가 항상 더 싼가요?",
    a: "기본 운임만 보면 LCC가 유리한 경우가 많지만 위탁수하물, 좌석 지정, 기내식을 포함하면 FSC와의 차이가 크게 줄 수 있습니다.",
  },
  {
    q: "유럽 왕복 항공권은 얼마를 예산으로 잡아야 하나요?",
    a: "비수기는 80만~140만원대도 가능하지만 일반 시즌은 120만~200만원, 여름 성수기는 180만원 이상을 보는 편이 현실적입니다.",
  },
  {
    q: "위탁수하물을 추가하면 LCC와 FSC 차이가 얼마나 줄어드나요?",
    a: "단거리 1인 기준 5만~10만원, 중거리 8만~15만원 정도가 붙을 수 있어 2인 여행에서는 총액 차이가 빠르게 줄어듭니다.",
  },
  {
    q: "김포 출발과 인천 출발 중 어느 쪽이 유리한가요?",
    a: "김포는 접근성이 좋지만 국제선 선택지가 제한적입니다. 항공권이 조금 비싸도 이동비와 시간을 줄이면 총비용에서 유리할 수 있습니다.",
  },
  {
    q: "지방공항 출발은 항공권이 싸도 실제 총비용이 낮은가요?",
    a: "거주지와 가까우면 유리하지만 운항 요일, 대체편, 수하물 포함 여부를 함께 봐야 합니다. 인천까지 KTX·리무진·전날 숙박비가 붙는 경우 지방공항이 더 합리적일 수 있습니다.",
  },
  {
    q: "이 페이지의 가격은 실시간 최저가인가요?",
    a: "아닙니다. 이 페이지는 2026년 4월 기준 비교 목적 추정 범위값입니다. 실제 예약 전에는 항공사·여행사 검색 결과와 수하물 포함 조건을 반드시 확인해야 합니다.",
  },
];
