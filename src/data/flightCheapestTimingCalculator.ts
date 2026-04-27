export type FlightOrigin = "icn" | "gmp" | "pus" | "tae" | "cju" | "regional";

export type FlightRegion =
  | "japan"
  | "southeast-asia"
  | "china-hk-tw"
  | "europe"
  | "americas"
  | "oceania";

export type DepartureDayPreference = "any" | "weekday" | "friday" | "saturday" | "sunday";
export type FlightTimePreference = "any" | "early" | "late-night" | "regular";
export type AirlinePreference = "lowest" | "lcc-ok" | "fsc";

export type FlightTimingInput = {
  origin: FlightOrigin;
  region: FlightRegion;
  destinationLabel: string;
  departureMonth: number;
  persons: number;
  nights: number;
  dayPreference: DepartureDayPreference;
  timePreference: FlightTimePreference;
  baggageIncluded: boolean;
  airlinePreference: AirlinePreference;
  weeksBeforeDeparture: number;
};

export type FlightTimingPreset = FlightTimingInput & {
  id: string;
  label: string;
  description: string;
};

export type FlightBaseFare = {
  origin: FlightOrigin;
  region: FlightRegion;
  label: string;
  baseFare: number;
  fareRangeLabel: string;
};

export type BookingWindowRule = {
  region: FlightRegion;
  minWeeks: number;
  maxWeeks: number;
  factor: number;
  label: string;
};

export type RegionBookingGuide = {
  region: FlightRegion;
  label: string;
  recommendedWeeksLabel: string;
  recommendedMinWeeks: number;
  recommendedMaxWeeks: number;
  shortTip: string;
  caution: string;
};

export const FLIGHT_TIMING_DEFAULT_INPUT: FlightTimingInput = {
  origin: "icn",
  region: "japan",
  destinationLabel: "오사카/도쿄",
  departureMonth: 7,
  persons: 2,
  nights: 4,
  dayPreference: "friday",
  timePreference: "regular",
  baggageIncluded: true,
  airlinePreference: "lcc-ok",
  weeksBeforeDeparture: 10,
};

export const FLIGHT_TIMING_PRESETS: FlightTimingPreset[] = [
  {
    id: "japan-weekend",
    label: "일본 주말 여행",
    origin: "icn",
    region: "japan",
    destinationLabel: "오사카/도쿄",
    departureMonth: 7,
    persons: 2,
    nights: 4,
    dayPreference: "friday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "lcc-ok",
    weeksBeforeDeparture: 10,
    description: "여름 휴가철 일본 단거리 노선 기준",
  },
  {
    id: "sea-vacation",
    label: "동남아 휴양 여행",
    origin: "icn",
    region: "southeast-asia",
    destinationLabel: "방콕/다낭",
    departureMonth: 8,
    persons: 2,
    nights: 5,
    dayPreference: "saturday",
    timePreference: "late-night",
    baggageIncluded: true,
    airlinePreference: "lcc-ok",
    weeksBeforeDeparture: 12,
    description: "성수기 휴양지 왕복 항공권 기준",
  },
  {
    id: "europe-free-travel",
    label: "유럽 자유여행",
    origin: "icn",
    region: "europe",
    destinationLabel: "파리/런던",
    departureMonth: 10,
    persons: 2,
    nights: 7,
    dayPreference: "weekday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "fsc",
    weeksBeforeDeparture: 18,
    description: "장거리 이코노미 왕복 항공권 기준",
  },
  {
    id: "americas-long-haul",
    label: "미주 장거리 여행",
    origin: "icn",
    region: "americas",
    destinationLabel: "뉴욕/LA",
    departureMonth: 12,
    persons: 2,
    nights: 7,
    dayPreference: "weekday",
    timePreference: "regular",
    baggageIncluded: true,
    airlinePreference: "fsc",
    weeksBeforeDeparture: 20,
    description: "연말 미주 장거리 노선 기준",
  },
];

export const FLIGHT_BASE_FARES: FlightBaseFare[] = [
  { origin: "icn", region: "japan", label: "인천 -> 일본", baseFare: 220000, fareRangeLabel: "20만~45만원" },
  {
    origin: "icn",
    region: "southeast-asia",
    label: "인천 -> 동남아",
    baseFare: 390000,
    fareRangeLabel: "30만~70만원",
  },
  {
    origin: "icn",
    region: "china-hk-tw",
    label: "인천 -> 중국·홍콩·대만",
    baseFare: 300000,
    fareRangeLabel: "25만~60만원",
  },
  { origin: "icn", region: "europe", label: "인천 -> 유럽", baseFare: 980000, fareRangeLabel: "90만~180만원" },
  {
    origin: "icn",
    region: "americas",
    label: "인천 -> 미주",
    baseFare: 1150000,
    fareRangeLabel: "110만~220만원",
  },
  { origin: "icn", region: "oceania", label: "인천 -> 대양주", baseFare: 850000, fareRangeLabel: "75만~160만원" },
];

export const ORIGIN_FACTORS: Record<FlightOrigin, { label: string; factor: number }> = {
  icn: { label: "인천", factor: 1 },
  gmp: { label: "김포", factor: 1.03 },
  pus: { label: "부산", factor: 1.08 },
  tae: { label: "대구", factor: 1.12 },
  cju: { label: "제주", factor: 1.15 },
  regional: { label: "기타 지방", factor: 1.18 },
};

export const MONTH_SEASON_FACTORS: Record<
  number,
  { label: string; factor: number; tone: "low" | "normal" | "high" | "peak" }
> = {
  1: { label: "겨울 성수기/설 연휴 영향", factor: 1.2, tone: "high" },
  2: { label: "겨울 여행 수요", factor: 1.08, tone: "normal" },
  3: { label: "비수기", factor: 0.95, tone: "low" },
  4: { label: "봄 여행 수요", factor: 1.03, tone: "normal" },
  5: { label: "연휴 수요", factor: 1.1, tone: "high" },
  6: { label: "비수기", factor: 0.96, tone: "low" },
  7: { label: "여름 성수기", factor: 1.22, tone: "high" },
  8: { label: "여름 극성수기", factor: 1.32, tone: "peak" },
  9: { label: "추석 변수", factor: 1.12, tone: "high" },
  10: { label: "가을 여행 수요", factor: 1.06, tone: "normal" },
  11: { label: "비수기", factor: 0.93, tone: "low" },
  12: { label: "연말 성수기", factor: 1.25, tone: "peak" },
};

export const BOOKING_WINDOW_RULES: BookingWindowRule[] = [
  { region: "japan", minWeeks: 13, maxWeeks: 52, factor: 1.05, label: "너무 이른 예약" },
  { region: "japan", minWeeks: 8, maxWeeks: 12, factor: 0.96, label: "조기 예약 구간" },
  { region: "japan", minWeeks: 4, maxWeeks: 7, factor: 0.92, label: "최저가 가능 구간" },
  { region: "japan", minWeeks: 2, maxWeeks: 3, factor: 1, label: "보통 구간" },
  { region: "japan", minWeeks: 0, maxWeeks: 1, factor: 1.18, label: "임박 상승 구간" },
  { region: "southeast-asia", minWeeks: 14, maxWeeks: 52, factor: 1.04, label: "너무 이른 예약" },
  { region: "southeast-asia", minWeeks: 10, maxWeeks: 13, factor: 0.97, label: "조기 예약 구간" },
  { region: "southeast-asia", minWeeks: 6, maxWeeks: 9, factor: 0.91, label: "최저가 가능 구간" },
  { region: "southeast-asia", minWeeks: 3, maxWeeks: 5, factor: 1, label: "보통 구간" },
  { region: "southeast-asia", minWeeks: 0, maxWeeks: 2, factor: 1.17, label: "임박 상승 구간" },
  { region: "china-hk-tw", minWeeks: 12, maxWeeks: 52, factor: 1.04, label: "너무 이른 예약" },
  { region: "china-hk-tw", minWeeks: 8, maxWeeks: 11, factor: 0.97, label: "조기 예약 구간" },
  { region: "china-hk-tw", minWeeks: 5, maxWeeks: 7, factor: 0.93, label: "최저가 가능 구간" },
  { region: "china-hk-tw", minWeeks: 2, maxWeeks: 4, factor: 1, label: "보통 구간" },
  { region: "china-hk-tw", minWeeks: 0, maxWeeks: 1, factor: 1.16, label: "임박 상승 구간" },
  { region: "europe", minWeeks: 22, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "europe", minWeeks: 15, maxWeeks: 21, factor: 0.96, label: "조기 예약 구간" },
  { region: "europe", minWeeks: 10, maxWeeks: 14, factor: 0.92, label: "최저가 가능 구간" },
  { region: "europe", minWeeks: 5, maxWeeks: 9, factor: 1.03, label: "상승 전환 구간" },
  { region: "europe", minWeeks: 0, maxWeeks: 4, factor: 1.2, label: "임박 상승 구간" },
  { region: "americas", minWeeks: 24, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "americas", minWeeks: 16, maxWeeks: 23, factor: 0.96, label: "조기 예약 구간" },
  { region: "americas", minWeeks: 12, maxWeeks: 15, factor: 0.93, label: "최저가 가능 구간" },
  { region: "americas", minWeeks: 6, maxWeeks: 11, factor: 1.04, label: "상승 전환 구간" },
  { region: "americas", minWeeks: 0, maxWeeks: 5, factor: 1.22, label: "임박 상승 구간" },
  { region: "oceania", minWeeks: 22, maxWeeks: 52, factor: 1.03, label: "너무 이른 예약" },
  { region: "oceania", minWeeks: 14, maxWeeks: 21, factor: 0.96, label: "조기 예약 구간" },
  { region: "oceania", minWeeks: 9, maxWeeks: 13, factor: 0.93, label: "최저가 가능 구간" },
  { region: "oceania", minWeeks: 5, maxWeeks: 8, factor: 1.03, label: "상승 전환 구간" },
  { region: "oceania", minWeeks: 0, maxWeeks: 4, factor: 1.19, label: "임박 상승 구간" },
];

export const DAY_FACTORS: Record<DepartureDayPreference, { label: string; factor: number }> = {
  any: { label: "상관없음", factor: 1 },
  weekday: { label: "평일", factor: 0.97 },
  friday: { label: "금요일", factor: 1.08 },
  saturday: { label: "토요일", factor: 1.08 },
  sunday: { label: "일요일", factor: 1.04 },
};

export const TIME_FACTORS: Record<FlightTimePreference, { label: string; factor: number }> = {
  any: { label: "상관없음", factor: 0.98 },
  early: { label: "조조편", factor: 0.94 },
  "late-night": { label: "심야편", factor: 0.95 },
  regular: { label: "일반 시간대", factor: 1 },
};

export const AIRLINE_FACTORS: Record<AirlinePreference, { label: string; factor: number }> = {
  lowest: { label: "최저가 우선", factor: 0.94 },
  "lcc-ok": { label: "LCC 가능", factor: 0.97 },
  fsc: { label: "FSC 선호", factor: 1.08 },
};

export const BAGGAGE_INCLUDED_EXTRA = 35000;

export const REGION_BOOKING_GUIDES: RegionBookingGuide[] = [
  {
    region: "japan",
    label: "일본",
    recommendedWeeksLabel: "출발 4~8주 전",
    recommendedMinWeeks: 4,
    recommendedMaxWeeks: 8,
    shortTip: "주말·연휴 단거리 노선은 좌석 소진이 빨라지는 편입니다.",
    caution: "벚꽃·여름휴가·연말에는 대기 전략보다 조기 확정이 유리할 수 있습니다.",
  },
  {
    region: "southeast-asia",
    label: "동남아",
    recommendedWeeksLabel: "출발 6~10주 전",
    recommendedMinWeeks: 6,
    recommendedMaxWeeks: 10,
    shortTip: "휴양지 노선은 심야편 선택 시 총액을 낮추기 쉽습니다.",
    caution: "8월·연말에는 숙박비까지 같이 오르므로 항공권만 따로 늦추기 어렵습니다.",
  },
  {
    region: "china-hk-tw",
    label: "중국·홍콩·대만",
    recommendedWeeksLabel: "출발 5~9주 전",
    recommendedMinWeeks: 5,
    recommendedMaxWeeks: 9,
    shortTip: "단거리 도시 여행은 평일 출발 선택지가 있으면 절약 폭이 커집니다.",
    caution: "연휴·박람회·콘서트 일정에 따라 도시별 편차가 큽니다.",
  },
  {
    region: "europe",
    label: "유럽",
    recommendedWeeksLabel: "출발 10~18주 전",
    recommendedMinWeeks: 10,
    recommendedMaxWeeks: 18,
    shortTip: "장거리 노선은 너무 늦으면 선택 가능한 항공사와 환승 조합이 줄어듭니다.",
    caution: "여름·연말은 항공권과 숙박 모두 빠르게 오르는 구간입니다.",
  },
  {
    region: "americas",
    label: "미주",
    recommendedWeeksLabel: "출발 12~20주 전",
    recommendedMinWeeks: 12,
    recommendedMaxWeeks: 20,
    shortTip: "장거리 직항 선호 시 조기 예매 안정성이 높습니다.",
    caution: "출발 임박 시 1인당 수십만원 차이가 날 수 있습니다.",
  },
  {
    region: "oceania",
    label: "대양주",
    recommendedWeeksLabel: "출발 9~16주 전",
    recommendedMinWeeks: 9,
    recommendedMaxWeeks: 16,
    shortTip: "성수기 휴양·어학 수요가 겹치는 달은 조기 확정이 유리합니다.",
    caution: "크리스마스·연말 출발은 대기 전략 위험이 큽니다.",
  },
];

export const FLIGHT_TIMING_FAQ = [
  {
    question: "항공권은 보통 몇 주 전에 예매하는 것이 가장 싼가요?",
    answer:
      "권역과 시즌에 따라 다르지만 단거리 노선은 출발 4~10주 전, 장거리 노선은 출발 10~20주 전이 유리한 경우가 많습니다. 이 계산기는 입력 조건에 따라 권장 구간을 추정합니다.",
  },
  {
    question: "이 계산기의 항공권 가격은 실시간 최저가인가요?",
    answer:
      "아닙니다. 실시간 항공권 조회가 아니라 권역별 기준 운임과 시즌·요일·예매 시점 계수를 조합한 추정 시뮬레이션입니다. 실제 결제 전에는 항공권 비교 서비스에서 최종 금액을 확인해야 합니다.",
  },
  {
    question: "성수기에는 기다리면 더 싸질 수도 있나요?",
    answer:
      "성수기에는 좌석이 줄어들수록 가격이 빠르게 오를 수 있어 대기 전략이 불리할 수 있습니다. 특히 가족 여행처럼 여러 좌석이 필요한 경우 더 이른 예매가 안정적입니다.",
  },
  {
    question: "조조편이나 심야편은 정말 더 저렴한가요?",
    answer:
      "수요가 낮은 시간대는 일반 시간대보다 저렴한 경우가 많습니다. 다만 공항 이동 비용, 숙박 체크인 시간, 가족 동반 편의성까지 함께 고려해야 합니다.",
  },
  {
    question: "LCC가 항상 더 저렴한가요?",
    answer:
      "기본 운임만 보면 LCC가 저렴할 수 있지만 수하물, 좌석 지정, 기내식, 변경 수수료를 합치면 FSC와 총액 차이가 줄어들 수 있습니다.",
  },
  {
    question: "가족 여행은 언제 예매하는 것이 좋나요?",
    answer:
      "인원수가 많을수록 같은 가격대 좌석을 여러 장 확보하기 어렵습니다. 가족 여행은 단독 여행보다 권장 예매 구간의 앞쪽에서 확정하는 편이 안전합니다.",
  },
];

export const FLIGHT_TIMING_RELATED_LINKS = [
  { href: "/tools/overseas-travel-cost/", label: "해외여행 총비용 계산기" },
  { href: "/reports/overseas-travel-cost-compare-2026/", label: "해외여행 경비 비교 2026" },
];
