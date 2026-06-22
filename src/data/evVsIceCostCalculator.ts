// ─────────────────────────────────────────────────────────────────────────────
// 전기차 vs 내연기관 총비용 비교 계산기
// URL: /tools/ev-vs-ice-cost-calculator/
// ─────────────────────────────────────────────────────────────────────────────

export type FuelType = "gasoline" | "diesel" | "lpg";
export type ComparisonYears = 1 | 3 | 5 | 7 | 10 | 15;
export type ResultTone = "ev_better" | "neutral" | "ice_better";
export type EvidenceBadge = "공식" | "참고" | "추정" | "시뮬레이션";

// ─── 입력 인터페이스 ──────────────────────────────────────────────────────────

export interface EvInput {
  vehiclePrice: number;
  nationalSubsidy: number;
  localSubsidy: number;
  energyEfficiency: number;   // km/kWh
  slowChargingRatio: number;  // 0~1
  annualInsurance: number;
  annualMaintenanceCost: number;
}

export interface IceInput {
  vehiclePrice: number;
  fuelType: FuelType;
  fuelEfficiency: number;     // km/L
  annualInsurance: number;
  annualMaintenanceCost: number;
  engineDisplacementCC: number;
}

export interface CommonInput {
  annualMileageKm: number;
  comparisonYears: ComparisonYears;
  slowChargingRatePerKwh: number;
  fastChargingRatePerKwh: number;
  fuelPricePerLiter: number;
}

// ─── 결과 인터페이스 ──────────────────────────────────────────────────────────

export interface CostBreakdown {
  effectiveVehiclePrice: number;
  acquisitionTax: number;
  totalVehicleTax: number;
  totalFuelCost: number;
  totalMaintenance: number;
  totalInsurance: number;
  tco: number;
  monthlyAvgCost: number;
  annualFuelCost: number;
}

export interface BreakevenResult {
  years: number | null;
  months: number | null;
  label: string;
  tone: ResultTone;
}

export interface YearlyCost {
  year: number;
  evCumulative: number;
  iceCumulative: number;
}

export interface EvcResult {
  ev: CostBreakdown;
  ice: CostBreakdown;
  tcoDiff: number;
  monthlyFuelDiff: number;
  breakeven: BreakevenResult;
  yearly: YearlyCost[];
  tone: ResultTone;
}

// ─── 보조 인터페이스 ──────────────────────────────────────────────────────────

export interface FuelPrice {
  type: FuelType;
  label: string;
  pricePerLiter: number;
  badge: EvidenceBadge;
}

export interface CarPreset {
  id: string;
  label: string;
  description: string;
  ev: Partial<EvInput>;
  ice: Partial<IceInput>;
}

export interface SubsidyInfo {
  region: string;
  nationalMax: number;
  localMin: number;
  localMax: number;
  note: string;
  badge: EvidenceBadge;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

// ─── 메타 ────────────────────────────────────────────────────────────────────

export const EVC_META = {
  title: "전기차 vs 내연기관 총비용 비교 계산기",
  seoTitle: "전기차 vs 휘발유차 총비용 비교 계산기 2026｜5년·10년 손익분기점",
  seoDescription:
    "전기차와 휘발유·디젤·LPG차의 차량 가격, 보조금, 충전비, 유지비, 보험료까지 합산해 5년·10년 총보유비용(TCO)을 비교합니다. 손익분기점 연도를 즉시 확인하세요.",
  heroDescription:
    "보조금·취득세·충전비·유지비·보험료를 전부 합산한 총보유비용(TCO)으로 전기차와 내연기관차를 비교합니다. 프리셋 차종을 선택하거나 직접 입력하세요.",
  caution:
    "이 계산기는 참고용 시뮬레이션입니다. 실제 보조금은 지자체·차종·소득 기준에 따라 다르며, 전기요금·유가는 시기에 따라 변동됩니다. 정비비·보험료는 추정값입니다.",
  updatedAt: "2026년 5월 기준",
};

// ─── 기본값 ──────────────────────────────────────────────────────────────────

export const EVC_DEFAULT_EV: EvInput = {
  vehiclePrice: 55_000_000,
  nationalSubsidy: 4_000_000,
  localSubsidy: 1_000_000,
  energyEfficiency: 6.0,
  slowChargingRatio: 0.7,
  annualInsurance: 1_000_000,
  annualMaintenanceCost: 550_000,
};

export const EVC_DEFAULT_ICE: IceInput = {
  vehiclePrice: 45_000_000,
  fuelType: "gasoline",
  fuelEfficiency: 13.0,
  annualInsurance: 850_000,
  annualMaintenanceCost: 1_000_000,
  engineDisplacementCC: 2_500,
};

export const EVC_DEFAULT_COMMON: CommonInput = {
  annualMileageKm: 15_000,
  comparisonYears: 5,
  slowChargingRatePerKwh: 324,
  fastChargingRatePerKwh: 430,
  fuelPricePerLiter: 1_750,
};

// ─── 연료 단가 ───────────────────────────────────────────────────────────────

export const EVC_FUEL_PRICES: FuelPrice[] = [
  { type: "gasoline", label: "휘발유", pricePerLiter: 1_750, badge: "참고" },
  { type: "diesel",   label: "경유",   pricePerLiter: 1_630, badge: "참고" },
  { type: "lpg",      label: "LPG",   pricePerLiter: 1_010, badge: "참고" },
];

// ─── 취득세 기준 ─────────────────────────────────────────────────────────────

export const EVC_ACQUISITION_TAX = {
  evReductionMax: 1_400_000,  // EV 취득세 감면 최대 140만원
  iceRatePercent: 7,
  basis: "조세특례제한법 제109조 (2026년 기준)",
  badge: "공식" as EvidenceBadge,
};

// ─── 자동차세 기준 ───────────────────────────────────────────────────────────
// 지방세법 제127조 기준 (배기량 1600cc 이하: 18원/cc, 초과: 19원/cc)
// 지방교육세 30% 가산

export const EVC_VEHICLE_TAX = {
  evFixedAmountWon: 130_000,
  iceRatePerCC_below1600: 18,
  iceRatePerCC_above1600: 19,
  educationTaxRate: 0.3,
  basis: "지방세법 제127조 (2026년 기준)",
  badge: "공식" as EvidenceBadge,
};

// ─── 프리셋 ──────────────────────────────────────────────────────────────────

export const EVC_PRESETS: CarPreset[] = [
  {
    id: "ioniq6-vs-k8",
    label: "아이오닉6 vs K8",
    description: "중형 세단 비교 — 아이오닉6 (EV) vs K8 2.5 가솔린",
    ev: {
      vehiclePrice: 55_000_000,
      nationalSubsidy: 4_000_000,
      localSubsidy: 1_000_000,
      energyEfficiency: 6.3,
      slowChargingRatio: 0.7,
    },
    ice: {
      vehiclePrice: 46_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 11.8,
      engineDisplacementCC: 2_497,
    },
  },
  {
    id: "tesla3-vs-grandeur",
    label: "테슬라3 vs 그랜저",
    description: "프리미엄 비교 — 테슬라 모델3 (EV) vs 그랜저 HEV",
    ev: {
      vehiclePrice: 57_000_000,
      nationalSubsidy: 3_500_000,
      localSubsidy: 800_000,
      energyEfficiency: 6.1,
      slowChargingRatio: 0.6,
    },
    ice: {
      vehiclePrice: 48_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 16.5,
      engineDisplacementCC: 1_999,
    },
  },
  {
    id: "ev3-vs-ray",
    label: "EV3 vs 레이",
    description: "소형 비교 — 기아 EV3 (EV) vs 레이 가솔린",
    ev: {
      vehiclePrice: 33_000_000,
      nationalSubsidy: 5_000_000,
      localSubsidy: 1_500_000,
      energyEfficiency: 6.8,
      slowChargingRatio: 0.8,
    },
    ice: {
      vehiclePrice: 19_000_000,
      fuelType: "gasoline",
      fuelEfficiency: 14.5,
      engineDisplacementCC: 998,
    },
  },
];

// ─── 보조금 참고표 ────────────────────────────────────────────────────────────

export const EVC_SUBSIDY_REFERENCE: SubsidyInfo[] = [
  { region: "서울",   nationalMax: 4_000_000, localMin: 800_000,  localMax: 1_200_000, note: "차종별 상이", badge: "참고" },
  { region: "경기",   nationalMax: 4_000_000, localMin: 500_000,  localMax: 2_000_000, note: "시·군별 상이", badge: "참고" },
  { region: "부산",   nationalMax: 4_000_000, localMin: 1_000_000, localMax: 1_500_000, note: "", badge: "참고" },
  { region: "대구",   nationalMax: 4_000_000, localMin: 1_200_000, localMax: 1_500_000, note: "", badge: "참고" },
  { region: "인천",   nationalMax: 4_000_000, localMin: 800_000,  localMax: 1_200_000, note: "", badge: "참고" },
  { region: "제주",   nationalMax: 4_000_000, localMin: 3_000_000, localMax: 4_000_000, note: "최상위 지원", badge: "참고" },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const EVC_FAQ: FaqItem[] = [
  {
    question: "전기차 보조금은 얼마인가요?",
    answer:
      "2026년 기준 국고 보조금 최대 400만원 내외이며, 차량 가격·성능·충전 속도 조건에 따라 달라집니다. 지자체 보조금은 서울 80~120만원, 제주 최대 400만원 등 지역별로 차이가 큽니다. 이 계산기에서 직접 입력해 시뮬레이션하세요.",
  },
  {
    question: "전기요금이 오르면 계산 결과가 달라지나요?",
    answer:
      "네. 완속·급속 충전 단가 항목을 직접 수정해 시나리오를 바꿀 수 있습니다. 2026년 기준 완속 공용 약 324원/kWh, 급속 공용 약 430원/kWh를 기본값으로 사용합니다.",
  },
  {
    question: "아파트 거주자는 자가 충전이 어렵지 않나요?",
    answer:
      "자가 완속 충전기를 설치할 수 없는 경우 공용 급속·완속 충전소를 이용해야 합니다. 이 계산기에서 완속·급속 비율을 조정해 실제 상황에 맞게 시뮬레이션할 수 있습니다. 완속 비율을 낮추면 충전 비용이 올라갑니다.",
  },
  {
    question: "배터리 교체 비용은 반영되나요?",
    answer:
      "주요 제조사는 배터리 보증을 10년·20만km 이상으로 제공합니다. 보증 기간 이후 교체 비용은 300~700만원 수준으로 예상되며, 이 계산기의 기본 비교 기간(5~10년) 내에는 포함하지 않습니다.",
  },
  {
    question: "하이브리드 차량은 비교할 수 있나요?",
    answer:
      "이 계산기는 순수 EV vs 내연기관 비교가 목적입니다. 하이브리드는 ICE 측 연비를 실제 하이브리드 공인 연비(예: 그랜저 HEV 16.5km/L)로 입력해 근사 비교할 수 있습니다.",
  },
  {
    question: "중고 전기차 구매 시에도 사용할 수 있나요?",
    answer:
      "네. 차량가를 중고 매입가로, 국고·지자체 보조금을 0으로 입력하면 중고 전기차 기준으로 시뮬레이션됩니다.",
  },
  {
    question: "전기차 보험료가 더 비싸다는데 사실인가요?",
    answer:
      "2026년 기준 EV 보험료가 동급 내연기관 대비 10~20% 높은 경우가 많습니다. 배터리 수리비·부품 조달 특성 때문입니다. 이 계산기에서 실제 보험 견적으로 직접 입력해 정확히 비교하세요.",
  },
  {
    question: "디젤·LPG차도 비교 가능한가요?",
    answer:
      "가능합니다. ICE 측 연료 종류를 경유 또는 LPG로 선택하면 해당 유가가 자동 적용됩니다. LPG는 1,010원/L, 경유는 1,630원/L를 기본값으로 사용합니다.",
  },
];

// ─── 관련 링크 ───────────────────────────────────────────────────────────────

export const EVC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/real-estate-acquisition-tax/",
    label: "취득세 계산기",
    description: "자동차·부동산 취득세 계산",
  },
  {
    href: "/tools/apartment-holding-tax/",
    label: "아파트 보유세 계산기",
    description: "공시가격 기준 재산세·종부세 계산",
  },
  {
    href: "/tools/fire-calculator/",
    label: "FIRE 은퇴 자산 계산기",
    description: "차량 구매가 은퇴 일정에 미치는 영향",
  },
  {
    href: "/tools/dca-investment-calculator/",
    label: "DCA 적립식 투자 계산기",
    description: "차량 구매 대신 투자 시 수익 비교",
  },
];

// ─── SEO 인트로 ──────────────────────────────────────────────────────────────

export const EVC_SEO_INTRO: string[] = [
  "전기차가 내연기관보다 유지비가 저렴하다는 말은 반쪽이다. 새 차를 알아볼 때 연료비만 보면 전기차가 확실히 유리하지만, 취득가, 보조금 조건, 자동차세, 정비비, 보험료를 전부 합산한 총보유비용(TCO)으로 봐야 실제로 어느 쪽이 더 경제적인지 제대로 비교할 수 있다. 단순 연료비 비교만 보고 결정하면 실제 보유 기간 전체의 비용 차이를 놓치기 쉽다.",
  "2026년 국고 보조금 기준 전기차 실구매가는 동급 내연기관보다 1천만원 내외 비쌀 수 있다. 이 가격 차이를 연료비와 유지비 절감으로 회수하는 데 걸리는 기간이 바로 손익분기점이며, 연간 주행거리가 길수록, 완속 충전 비율이 높을수록 손익분기점은 더 빨리 찾아온다는 점을 함께 봐야 한다.",
  "이 계산기는 차량 가격·보조금·취득세·자동차세·연료비·정비비·보험료를 항목별로 분리해 5년·10년 TCO를 비교한다. 충전비는 완속·급속 비율을 직접 입력할 수 있어, 아파트 거주자와 자가 충전이 가능한 단독주택 거주자 각각의 상황에 맞게 따로 시뮬레이션해볼 수 있다.",
  "다만 정비비와 보험료는 추정값이며 차종·운전 이력·보험사별로 실제값이 다를 수 있고, 유가와 전기요금도 정책·계절·사업자에 따라 수시로 달라진다. 이 계산기는 참고용 시뮬레이션이므로 실제 구매 전에는 해당 차종의 견적서와 보험 다이렉트 비교를 함께 확인하길 권장한다. 중고차 매각 시 잔존가치 차이도 실제 TCO에 영향을 줄 수 있다.",
];

export const EVC_INPUT_POINTS: string[] = [
  "차량 가격과 보조금을 입력하면 전기차 실구매가를 즉시 계산합니다",
  "완속·급속 충전 비율을 조정해 아파트 거주자·자가 충전 상황에 맞게 시뮬레이션하세요",
  "비교 기간(1~15년)을 바꾸면 손익분기점 연도가 즉시 재계산됩니다",
];

export const EVC_CRITERIA: string[] = [
  "취득세: 조세특례제한법 제109조 (2026년 EV 최대 140만원 감면)",
  "자동차세: 지방세법 제127조 기준 (1600cc 초과 19원/cc + 지방교육세 30%)",
  "충전 단가·유가: 2026년 5월 평균 기준 참고값 (변동 가능)",
  "정비비·보험료: 업계 평균 범위 추정값 (직접 수정 가능)",
];
