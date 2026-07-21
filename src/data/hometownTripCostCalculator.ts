export const HTC_META = {
  slug: "hometown-trip-cost-calculator",
  title: "추석 귀성길 교통수단 비교 계산기",
  description:
    "KTX·SRT·고속버스·자가용의 왕복 총비용과 문전 이동시간을 인원수 기준으로 비교합니다.",
  seoTitle: "추석 귀성길 교통수단 비교 | KTX·SRT·버스·자가용 비용 계산기",
  seoDescription:
    "인원수와 귀성 구간을 입력해 KTX, SRT, 고속버스와 자가용의 왕복 총비용과 문전 이동시간을 비교하세요. 유류비, 통행료, 역 이동비, 주차비와 명절 정체시간까지 반영합니다.",
  updatedAt: "2026-07-21",
  dataNote:
    "승차권 요금과 순수 주행시간만으로는 실제 귀성 비용을 정확히 비교하기 어렵습니다. 이 계산기는 역·터미널 이동비, 주차비, 명절 정체 시나리오를 함께 반영한 참고용 추정치이며, 실제 요금과 소요시간은 예매 시점과 교통 상황에 따라 달라질 수 있습니다. 2026년 추석(9월 25일) 특별 예매 일정은 아직 공식 발표되지 않았습니다.",
};

export type CarType = "compact" | "midsize" | "suv";
export type BusTier = "general" | "premium";
export type TrafficScenario = "normal" | "moderate" | "heavy";

export interface TrainOption {
  label: string;
  station: string;
  fareOneWay: number;
  childFareOneWay: number;
  durationMin: number;
}

export interface RoutePreset {
  id: string;
  label: string;
  distanceKm: number;
  ktx: TrainOption | null;
  srt: TrainOption | null;
  busGeneralFareOneWay: number;
  busPremiumFareOneWay: number;
  busDurationMin: number;
  tollOneWay: number;
  carDurationMin: number;
  sourceNote: string;
}

// 서울-부산: KTX(서울역 정상운임)·SRT(수서역)·고속버스 요금 확인 완료(2026-07).
// 서울-대구: KTX(서울역) 요금 확인 완료. SRT 수서-동대구 요금은 확인된 자료가 없어 이 구간은 KTX만 제공합니다.
// KTX 요금 10% 인하(2026-04)는 시범 중련운행 열차·수서역 출발/도착 KTX에 한정되며, 서울역·용산역 출발 KTX 전체에 적용되는 것은 아닙니다.
export const HTC_ROUTES: RoutePreset[] = [
  {
    id: "seoul-busan",
    label: "서울 → 부산",
    distanceKm: 325,
    ktx: { label: "KTX (서울역·용산역)", station: "서울역", fareOneWay: 59_800, childFareOneWay: 29_900, durationMin: 150 },
    srt: { label: "SRT (수서역)", station: "수서역", fareOneWay: 48_800, childFareOneWay: 24_400, durationMin: 160 },
    busGeneralFareOneWay: 23_000,
    busPremiumFareOneWay: 40_000,
    busDurationMin: 270,
    tollOneWay: 20_400,
    carDurationMin: 240,
    sourceNote: "KTX 요금은 서울역 정상운임(2026-07 확인). SRT는 수서역 출발 요금(2026-04 조정 이후 수준). 어린이 요금은 성인 요금의 약 50%.",
  },
  {
    id: "seoul-daegu",
    label: "서울 → 대구",
    distanceKm: 244,
    ktx: { label: "KTX (서울역·용산역)", station: "서울역", fareOneWay: 43_500, childFareOneWay: 21_750, durationMin: 96 },
    srt: null,
    busGeneralFareOneWay: 20_300,
    busPremiumFareOneWay: 33_200,
    busDurationMin: 210,
    tollOneWay: 16_000,
    carDurationMin: 195,
    sourceNote: "KTX 서울-동대구 일반실 요금(2026-04 기준). 이 구간은 SRT 요금 확인 자료가 없어 KTX만 제공합니다.",
  },
];

export const HTC_CAR_DEFAULTS: Record<CarType, { fuelEfficiencyKmPerLiter: number; label: string }> = {
  compact: { fuelEfficiencyKmPerLiter: 14, label: "경차·소형" },
  midsize: { fuelEfficiencyKmPerLiter: 11, label: "중형" },
  suv: { fuelEfficiencyKmPerLiter: 9, label: "SUV·RV" },
};

export const HTC_DEFAULT_FUEL_PRICE = 1_650;
export const HTC_DEFAULT_MAINTENANCE_COST_PER_KM = 100;

// 명절 정체는 확정 수치가 아니라 참고용 배율 범위입니다.
export const HTC_TRAFFIC_SCENARIOS: Record<TrafficScenario, { label: string; multiplierMin: number; multiplierMax: number }> = {
  normal: { label: "평시", multiplierMin: 1.0, multiplierMax: 1.0 },
  moderate: { label: "연휴 보통 정체", multiplierMin: 1.3, multiplierMax: 1.6 },
  heavy: { label: "연휴 극심한 정체", multiplierMin: 1.6, multiplierMax: 2.2 },
};

export interface TripInput {
  routeId: string;
  adultCount: number;
  childCount: number;
  busTier: BusTier;
  carType: CarType;
  fuelPricePerLiter: number;
  fuelEfficiencyKmPerLiter: number;
  homeToStationMinutes: number;
  homeToStationCost: number;
  stationToDestMinutes: number;
  stationToDestCost: number;
  parkingCost: number;
  includeVehicleMaintenance: boolean;
  maintenanceCostPerKm: number;
  tollFreeAssumption: boolean;
  trafficScenario: TrafficScenario;
}

export interface ModeResult {
  available: boolean;
  fareCost: number;
  localTransitCost: number;
  totalCost: number;
  perPersonCost: number;
  rideDurationMin: number;
  totalDurationMin: number;
}

export interface CarResult {
  cashCost: number;
  totalCost: number;
  perPersonCost: number;
  durationMinLow: number;
  durationMinHigh: number;
}

export interface TripResult {
  ktx: ModeResult | null;
  srt: ModeResult | null;
  bus: ModeResult;
  car: CarResult;
  cheapestLabel: string;
  fastestLabel: string;
  breakevenPassengers: number | null;
}

export const HTC_DEFAULT_INPUT: TripInput = {
  routeId: "seoul-busan",
  adultCount: 2,
  childCount: 0,
  busTier: "general",
  carType: "midsize",
  fuelPricePerLiter: HTC_DEFAULT_FUEL_PRICE,
  fuelEfficiencyKmPerLiter: HTC_CAR_DEFAULTS.midsize.fuelEfficiencyKmPerLiter,
  homeToStationMinutes: 30,
  homeToStationCost: 5_000,
  stationToDestMinutes: 20,
  stationToDestCost: 4_000,
  parkingCost: 10_000,
  includeVehicleMaintenance: false,
  maintenanceCostPerKm: HTC_DEFAULT_MAINTENANCE_COST_PER_KM,
  tollFreeAssumption: false,
  trafficScenario: "moderate",
};

function calcLocalTransit(input: TripInput) {
  const oneWayMinutes = input.homeToStationMinutes + input.stationToDestMinutes;
  const oneWayCost = input.homeToStationCost + input.stationToDestCost;
  return {
    roundTripMinutes: oneWayMinutes * 2,
    roundTripCostPerPerson: oneWayCost * 2,
  };
}

function calcTrainMode(train: TrainOption | null, input: TripInput): ModeResult | null {
  if (!train) return null;
  const local = calcLocalTransit(input);
  const fareCost = train.fareOneWay * 2 * input.adultCount + train.childFareOneWay * 2 * input.childCount;
  const totalPassengers = input.adultCount + input.childCount;
  const localTransitCost = local.roundTripCostPerPerson * totalPassengers;
  const totalCost = fareCost + localTransitCost;
  return {
    available: true,
    fareCost,
    localTransitCost,
    totalCost,
    perPersonCost: totalPassengers > 0 ? Math.round(totalCost / totalPassengers) : 0,
    rideDurationMin: train.durationMin,
    totalDurationMin: train.durationMin + local.roundTripMinutes,
  };
}

function calcBusMode(route: RoutePreset, input: TripInput): ModeResult {
  const fareOneWay = input.busTier === "premium" ? route.busPremiumFareOneWay : route.busGeneralFareOneWay;
  const local = calcLocalTransit(input);
  const totalPassengers = input.adultCount + input.childCount;
  const fareCost = fareOneWay * 2 * totalPassengers;
  const localTransitCost = local.roundTripCostPerPerson * totalPassengers;
  const totalCost = fareCost + localTransitCost;
  return {
    available: true,
    fareCost,
    localTransitCost,
    totalCost,
    perPersonCost: totalPassengers > 0 ? Math.round(totalCost / totalPassengers) : 0,
    rideDurationMin: route.busDurationMin,
    totalDurationMin: route.busDurationMin + local.roundTripMinutes,
  };
}

function calcCarMode(route: RoutePreset, input: TripInput): CarResult {
  const fuelNeeded = (route.distanceKm * 2) / input.fuelEfficiencyKmPerLiter;
  const fuelCost = Math.round(fuelNeeded * input.fuelPricePerLiter);
  const tollCost = input.tollFreeAssumption ? 0 : route.tollOneWay * 2;
  const cashCost = fuelCost + tollCost + input.parkingCost;
  const maintenanceCost = input.includeVehicleMaintenance ? Math.round(route.distanceKm * 2 * input.maintenanceCostPerKm) : 0;
  const totalCost = cashCost + maintenanceCost;
  const totalPassengers = Math.max(input.adultCount + input.childCount, 1);
  const traffic = HTC_TRAFFIC_SCENARIOS[input.trafficScenario];

  return {
    cashCost,
    totalCost,
    perPersonCost: Math.round(totalCost / totalPassengers),
    durationMinLow: Math.round(route.carDurationMin * traffic.multiplierMin),
    durationMinHigh: Math.round(route.carDurationMin * traffic.multiplierMax),
  };
}

export function calcTripCost(route: RoutePreset, input: TripInput): TripResult {
  const ktx = calcTrainMode(route.ktx, input);
  const srt = calcTrainMode(route.srt, input);
  const bus = calcBusMode(route, input);
  const car = calcCarMode(route, input);

  const candidates: Array<{ label: string; cost: number; duration: number }> = [];
  if (ktx) candidates.push({ label: "KTX", cost: ktx.totalCost, duration: ktx.totalDurationMin });
  if (srt) candidates.push({ label: "SRT", cost: srt.totalCost, duration: srt.totalDurationMin });
  candidates.push({ label: "고속버스", cost: bus.totalCost, duration: bus.totalDurationMin });
  candidates.push({ label: "자가용", cost: car.totalCost, duration: (car.durationMinLow + car.durationMinHigh) / 2 });

  const cheapest = candidates.reduce((a, b) => (b.cost < a.cost ? b : a));
  const fastest = candidates.reduce((a, b) => (b.duration < a.duration ? b : a));

  const cheapestPublic = candidates
    .filter((c) => c.label !== "자가용")
    .reduce((a, b) => (b.cost < a.cost ? b : a), candidates[0]);

  let breakevenPassengers: number | null = null;
  for (let n = 1; n <= 8; n++) {
    const testInput = { ...input, adultCount: n, childCount: 0 };
    const testCar = calcCarMode(route, testInput);
    const testPublicFareOneWay = cheapestPublic.label === "KTX" ? route.ktx?.fareOneWay
      : cheapestPublic.label === "SRT" ? route.srt?.fareOneWay
      : (input.busTier === "premium" ? route.busPremiumFareOneWay : route.busGeneralFareOneWay);
    if (testPublicFareOneWay === undefined) break;
    const local = calcLocalTransit(input);
    const testPublicTotal = testPublicFareOneWay * 2 * n + local.roundTripCostPerPerson * n;
    if (testCar.totalCost <= testPublicTotal) {
      breakevenPassengers = n;
      break;
    }
  }

  return {
    ktx,
    srt,
    bus,
    car,
    cheapestLabel: cheapest.label,
    fastestLabel: fastest.label,
    breakevenPassengers,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const HTC_FAQ: FaqItem[] = [
  {
    question: "KTX와 SRT 중 무엇이 더 빠른가요?",
    answer:
      "열차 탑승시간만 보면 큰 차이가 없을 수 있지만, KTX는 서울역·용산역, SRT는 수서역에서 출발합니다. 집에서 출발역까지의 이동시간과 도착 후 이동시간을 포함해야 실제로 더 빠른 수단을 판단할 수 있습니다.",
  },
  {
    question: "2026년 4월 KTX 요금이 전체적으로 인하된 건가요?",
    answer:
      "아닙니다. 시범 중련운행하는 KTX와 수서역 출·도착 KTX 운임만 약 10% 인하됐습니다. 서울역·용산역에서 출발하는 일반 KTX 전체 노선에 적용되는 인하가 아니므로, 정상 운임과 혼동하지 않아야 합니다.",
  },
  {
    question: "가족 여러 명이면 자가용이 항상 더 저렴한가요?",
    answer:
      "반드시 그렇지는 않습니다. 인원이 늘면 자가용 1인당 비용은 낮아지지만, 통행료·유류비·주차비·차량 소모비와 명절 정체시간을 함께 고려해야 합니다. 어린이 철도 할인이 적용되거나 목적지에서 차량이 필요하지 않은 경우에는 대중교통이 더 유리할 수 있습니다.",
  },
  {
    question: "KTX 비용에 역까지 가는 비용도 포함되나요?",
    answer:
      "기본 승차권 요금과 역 이동비는 별도입니다. 이 계산기에서 출발지-역 이동시간·비용과 도착역 이후 이동시간·비용을 입력하면 문전 기준 총비용으로 비교할 수 있습니다.",
  },
  {
    question: "명절 기간 고속도로 통행료는 무료 아닌가요?",
    answer:
      "설·추석 연휴에 고속도로 통행료 면제가 시행된 사례가 있지만, 매년 대상 날짜와 범위는 정부 정책 발표를 확인해야 합니다. 2026년 추석 통행료 면제가 공식 확정되기 전에는 일반 통행료를 기본값으로 적용하고 있으며, '통행료 면제 가정' 옵션을 켜면 통행료 없이 계산할 수 있습니다.",
  },
  {
    question: "추석 기차표는 언제부터 예매할 수 있나요?",
    answer:
      "2026년 추석(9월 25일) 특별 예매 일정은 아직 공식 발표되지 않았습니다. 과거에는 명절 3~4주 전에 예매가 시작된 경우가 많았지만 매년 다를 수 있으므로, 코레일과 SR 공지사항을 직접 확인하는 것이 정확합니다.",
  },
  {
    question: "예약표가 없으면 어떤 수단이 유리한가요?",
    answer:
      "비용이 가장 저렴한 수단보다 실제 좌석을 확보할 수 있는 수단이 우선입니다. KTX·SRT·고속버스 모두 매진되면 자가용이 대체 수단이 될 수 있으니, 명절 임박 시에는 예매 가능 여부를 함께 확인하세요.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const HTC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/travel-expense-split/", label: "여행 경비 분담 계산기" },
  { href: "/tools/holiday-bonus-after-tax-calculator/", label: "명절 상여금 실수령 계산기" },
  { href: "/tools/beolcho-cost-calculator/", label: "벌초 대행비용 계산기" },
];

export const HTC_HIDDEN_COST_TABLE = [
  { item: "승차권", ktx: "O", bus: "O", car: "-" },
  { item: "역·터미널 이동비", ktx: "O", bus: "O", car: "-" },
  { item: "목적지 이동비", ktx: "O", bus: "O", car: "-" },
  { item: "통행료·유류비", ktx: "-", bus: "-", car: "O" },
  { item: "주차비", ktx: "경우에 따라", bus: "경우에 따라", car: "O" },
  { item: "차량 소모비", ktx: "-", bus: "-", car: "선택 반영" },
  { item: "좌석 미확보 위험", ktx: "O", bus: "O", car: "-" },
  { item: "운전자 피로", ktx: "-", bus: "-", car: "큼" },
];

export const HTC_SEO_CONTENT = {
  introTitle: "귀성길 비용, 승차권만 보면 왜곡될 수 있습니다",
  intro: [
    "KTX는 서울역·용산역, SRT는 수서역에서 출발합니다. 승차권 요금만 비교하면 실제로 더 저렴하거나 빠른 수단을 놓칠 수 있어, 이 계산기는 역까지 이동시간·비용과 도착 후 이동까지 포함한 문전 기준으로 비교합니다.",
    "자가용도 유류비와 통행료만이 아니라 주차비, 원한다면 차량 소모비까지 반영할 수 있고, 명절 정체를 감안한 시간 범위를 함께 보여줍니다.",
    "2026년 4월 KTX 요금 인하는 시범 중련운행 열차와 수서역 출·도착 KTX에 한정되며, 서울역 출발 KTX 전체에 적용되는 것은 아닙니다. 이 계산기는 이를 구분해 KTX와 SRT를 별도로 계산합니다.",
  ],
  criteria: [
    "KTX(서울역) 서울-부산 정상운임 59,800원, SRT(수서역) 48,800원 — 각각 다른 출발역·요금 체계입니다.",
    "역·터미널 이동시간·비용은 사용자 입력값이며, 거주지에 따라 달라질 수 있습니다.",
    "명절 정체 시간은 확정치가 아닌 시나리오 범위(평시/보통 정체/극심한 정체)로 제공합니다.",
  ],
};
