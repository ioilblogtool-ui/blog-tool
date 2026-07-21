export const BCC_META = {
  slug: "beolcho-cost-calculator",
  title: "벌초 대행비용 계산기",
  description: "봉분 수, 묘역 면적, 경사도와 접근성을 입력하면 벌초 대행 예상 비용 범위를 계산합니다.",
  seoTitle: "벌초 대행비용 계산기 | 묘지 1기·가족묘 예상 가격",
  seoDescription:
    "봉분 수, 묘역 면적, 경사도와 접근성을 입력해 벌초 대행 예상 비용을 계산하세요. 묘지 1기 가격, 추가 봉분, 잡목 제거, 출장비와 추석 성수기 비용까지 확인할 수 있습니다.",
  updatedAt: "2026-07",
  dataNote:
    "벌초 대행은 전국 공통 표준단가가 없습니다. 같은 봉분 1기라도 작업 면적, 이동거리, 풀·잡목 상태, 예초물 반출 여부와 작업 시기에 따라 견적이 달라질 수 있습니다. 이 계산기는 공개된 업체 가격을 참고해 구성한 계산기용 추정 범위이며, 업체의 확정 견적이 아닙니다.",
};

export type Terrain = "flat" | "gentleSlope" | "steepSlope";
export type Access = "nearParking" | "walkNeeded" | "hardAccess";
export type AreaBand = "under10" | "size11to20" | "size21to30" | "size31to50" | "over50" | "unsure";
export type SiteGrouping = "same" | "separate" | "unsure";
export type DistanceBand = "sameArea" | "adjacentArea" | "longDistance" | "unsure";
export type Timing = "offPeak" | "fourWeeksPlus" | "twoToFourWeeks" | "withinTwoWeeks";
export type DebrisHandling = "onSiteTidy" | "pileUp" | "haulAway";

export interface AddonItem {
  id: string;
  label: string;
  minAmount: number;
  maxAmount: number;
}

export interface BeolchoInput {
  graveCount: number;
  siteGrouping: SiteGrouping;
  terrain: Terrain;
  access: Access;
  areaBand: AreaBand;
  distanceBand: DistanceBand;
  timing: Timing;
  debrisHandling: DebrisHandling;
  addonIds: string[];
}

export interface BeolchoResult {
  graveSubtotalMin: number;
  graveSubtotalMax: number;
  areaSurchargeMin: number;
  areaSurchargeMax: number;
  distanceMin: number;
  distanceMax: number;
  debrisMin: number;
  debrisMax: number;
  addonMin: number;
  addonMax: number;
  timingSurchargeMin: number;
  timingSurchargeMax: number;
  totalMin: number;
  totalMax: number;
  representative: number;
  perGraveAvgMin: number;
  perGraveAvgMax: number;
  requiresAreaQuote: boolean;
}

export const BCC_DEFAULT_INPUT: BeolchoInput = {
  graveCount: 1,
  siteGrouping: "same",
  terrain: "flat",
  access: "nearParking",
  areaBand: "size11to20",
  distanceBand: "sameArea",
  timing: "twoToFourWeeks",
  debrisHandling: "onSiteTidy",
  addonIds: [],
};

// 1기·20평 이하 기준값은 공개된 업체 견적(1기 10만원대) 참고. 전국 표준단가 아님.
export const BCC_BASE_UNIT_PRICE = { min: 80_000, max: 120_000 };

export const BCC_TERRAIN_OPTIONS: Record<Terrain, { multiplier: number; label: string; desc: string }> = {
  flat: { multiplier: 1.0, label: "평지", desc: "작업 공간이 평탄함" },
  gentleSlope: { multiplier: 1.15, label: "완만한 경사", desc: "일반 작업 가능" },
  steepSlope: { multiplier: 1.35, label: "급경사", desc: "안전장비·추가 인력이 필요할 수 있음" },
};

export const BCC_ACCESS_OPTIONS: Record<Access, { multiplier: number; label: string; desc: string }> = {
  nearParking: { multiplier: 1.0, label: "묘소 인근 주차 가능", desc: "도보 5분 이내" },
  walkNeeded: { multiplier: 1.15, label: "도보 이동 필요", desc: "도보 5~20분" },
  hardAccess: { multiplier: 1.35, label: "접근 곤란", desc: "도보 20분 이상 또는 진입로 없음" },
};

export interface AreaAdjust {
  label: string;
  surchargeMin: number;
  surchargeMax: number;
  requiresQuote?: boolean;
}

// 1기 기본 면적 약 20평 기준(공개 업체 견적 참고). 초과분은 가산, 미만은 소폭 할인.
export const BCC_AREA_OPTIONS: Record<AreaBand, AreaAdjust> = {
  under10: { label: "10평 이하", surchargeMin: -15_000, surchargeMax: -10_000 },
  size11to20: { label: "11~20평 (기본)", surchargeMin: 0, surchargeMax: 0 },
  size21to30: { label: "21~30평", surchargeMin: 30_000, surchargeMax: 50_000 },
  size31to50: { label: "31~50평", surchargeMin: 60_000, surchargeMax: 100_000 },
  over50: { label: "50평 초과", surchargeMin: 0, surchargeMax: 0, requiresQuote: true },
  unsure: { label: "면적을 잘 모름", surchargeMin: 0, surchargeMax: 0, requiresQuote: true },
};

// 같은 묘역 안의 추가 봉분은 이동·장비 준비가 중복되지 않아 기당 단가가 낮아지는 경향 (공개 견적: 2기 17만·3기 23만 등 체감 단가)
export const BCC_ADDITIONAL_GRAVE_SAME = { min: 40_000, max: 70_000 };

export const BCC_DISTANCE_OPTIONS: Record<DistanceBand, { label: string; min: number; max: number }> = {
  sameArea: { label: "같은 시·군", min: 0, max: 0 },
  adjacentArea: { label: "인접 시·군", min: 10_000, max: 20_000 },
  longDistance: { label: "장거리 이동", min: 20_000, max: 50_000 },
  unsure: { label: "잘 모름", min: 0, max: 0 },
};

// 공개 업체 사례(명절 2주 전 +10%, 1주 전 +20%)를 참고한 계산기용 추정 가산율. 업체 공통 기준 아님.
export const BCC_TIMING_OPTIONS: Record<Timing, { label: string; rateMin: number; rateMax: number }> = {
  offPeak: { label: "비성수기", rateMin: 0, rateMax: 0 },
  fourWeeksPlus: { label: "명절 4주 이상 전", rateMin: 0, rateMax: 5 },
  twoToFourWeeks: { label: "명절 2~4주 전", rateMin: 10, rateMax: 15 },
  withinTwoWeeks: { label: "명절 2주 이내", rateMin: 15, rateMax: 25 },
};

export const BCC_DEBRIS_OPTIONS: Record<DebrisHandling, { label: string; min: number; max: number }> = {
  onSiteTidy: { label: "현장에 가지런히 정리 (기본)", min: 0, max: 0 },
  pileUp: { label: "한곳에 모아 적치", min: 0, max: 10_000 },
  haulAway: { label: "포대 수거·반출", min: 20_000, max: 80_000 },
};

export const BCC_ADDON_ITEMS: AddonItem[] = [
  { id: "access-road", label: "진입로 정비", minAmount: 30_000, maxAmount: 80_000 },
  { id: "tree-removal", label: "잡목·넝쿨 제거", minAmount: 30_000, maxAmount: 100_000 },
  { id: "photo-report", label: "작업 전후 사진 보고서 (유료 옵션인 경우)", minAmount: 0, maxAmount: 10_000 },
];

export function calcBeolchoCost(input: BeolchoInput): BeolchoResult {
  const terrain = BCC_TERRAIN_OPTIONS[input.terrain];
  const access = BCC_ACCESS_OPTIONS[input.access];
  const firstGraveMin = Math.round(BCC_BASE_UNIT_PRICE.min * terrain.multiplier * access.multiplier);
  const firstGraveMax = Math.round(BCC_BASE_UNIT_PRICE.max * terrain.multiplier * access.multiplier);

  let graveSubtotalMin: number;
  let graveSubtotalMax: number;
  if (input.siteGrouping === "separate") {
    graveSubtotalMin = firstGraveMin * input.graveCount;
    graveSubtotalMax = firstGraveMax * input.graveCount;
  } else {
    const additionalCount = Math.max(input.graveCount - 1, 0);
    graveSubtotalMin = firstGraveMin + additionalCount * BCC_ADDITIONAL_GRAVE_SAME.min;
    graveSubtotalMax = firstGraveMax + additionalCount * BCC_ADDITIONAL_GRAVE_SAME.max;
  }

  const area = BCC_AREA_OPTIONS[input.areaBand];
  const distance = BCC_DISTANCE_OPTIONS[input.distanceBand];
  const debris = BCC_DEBRIS_OPTIONS[input.debrisHandling];

  const selectedAddons = BCC_ADDON_ITEMS.filter((a) => input.addonIds.includes(a.id));
  const addonMin = selectedAddons.reduce((s, a) => s + a.minAmount, 0);
  const addonMax = selectedAddons.reduce((s, a) => s + a.maxAmount, 0);

  const subtotalMin = Math.max(graveSubtotalMin + area.surchargeMin + distance.min + debris.min + addonMin, 0);
  const subtotalMax = graveSubtotalMax + area.surchargeMax + distance.max + debris.max + addonMax;

  const timing = BCC_TIMING_OPTIONS[input.timing];
  const timingSurchargeMin = Math.round((subtotalMin * timing.rateMin) / 100);
  const timingSurchargeMax = Math.round((subtotalMax * timing.rateMax) / 100);

  const totalMin = subtotalMin + timingSurchargeMin;
  const totalMax = subtotalMax + timingSurchargeMax;
  const representative = Math.round((totalMin + totalMax) / 2 / 10_000) * 10_000;

  return {
    graveSubtotalMin,
    graveSubtotalMax,
    areaSurchargeMin: area.surchargeMin,
    areaSurchargeMax: area.surchargeMax,
    distanceMin: distance.min,
    distanceMax: distance.max,
    debrisMin: debris.min,
    debrisMax: debris.max,
    addonMin,
    addonMax,
    timingSurchargeMin,
    timingSurchargeMax,
    totalMin,
    totalMax,
    representative,
    perGraveAvgMin: Math.round(totalMin / input.graveCount),
    perGraveAvgMax: Math.round(totalMax / input.graveCount),
    requiresAreaQuote: Boolean(area.requiresQuote),
  };
}

export interface BeolchoPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<BeolchoInput>;
}

export const BCC_PRESETS: BeolchoPreset[] = [
  {
    id: "single-easy",
    label: "1기 · 평지·근접",
    summary: "20평 이하, 비수기 예약",
    input: { graveCount: 1, terrain: "flat", access: "nearParking", areaBand: "size11to20", siteGrouping: "same", distanceBand: "sameArea", timing: "fourWeeksPlus", debrisHandling: "onSiteTidy", addonIds: [] },
  },
  {
    id: "family-3",
    label: "가족묘 3기 · 같은 묘역·경사지",
    summary: "추석 2~4주 전, 21~30평",
    input: { graveCount: 3, terrain: "gentleSlope", access: "walkNeeded", areaBand: "size21to30", siteGrouping: "same", distanceBand: "sameArea", timing: "twoToFourWeeks", debrisHandling: "pileUp", addonIds: [] },
  },
  {
    id: "hard-access",
    label: "접근 곤란 1기 · 진입로 정비",
    summary: "급경사, 추석 임박, 인접 시·군",
    input: { graveCount: 1, terrain: "steepSlope", access: "hardAccess", areaBand: "size11to20", siteGrouping: "same", distanceBand: "adjacentArea", timing: "withinTwoWeeks", debrisHandling: "haulAway", addonIds: ["access-road", "tree-removal"] },
  },
];

export interface CompareRow {
  aspect: string;
  self: string;
  agency: string;
  private_: string;
}

export const BCC_COMPARE_TABLE: CompareRow[] = [
  { aspect: "비용", self: "장비·교통비 발생", agency: "지역별 상이", private_: "업체별 상이" },
  { aspect: "예약", self: "불필요", agency: "조기 마감 가능", private_: "온라인 예약 가능" },
  { aspect: "작업 범위", self: "직접 결정", agency: "기본 벌초 중심", private_: "옵션 선택 가능" },
  { aspect: "사진 보고", self: "직접 확인", agency: "지역별 상이", private_: "제공 업체 많음" },
  { aspect: "장점", self: "비용 절감 가능", agency: "지역 접근성", private_: "편리한 신청·보고" },
  { aspect: "단점", self: "안전사고 위험", agency: "지역 제한 가능", private_: "가격 편차" },
];

export const BCC_PREP_CHECKLIST: string[] = [
  "묘소 정확한 주소 또는 GPS 좌표",
  "묘소까지 가는 길 사진",
  "봉분 개수와 전체 작업 면적",
  "최근 묘소 사진",
  "차량 주차 위치와 도보 이동시간",
  "잡목·넝쿨 제거 필요 여부",
  "예초물 반출 여부",
  "작업 전후 사진 제공 여부와 추가비용 발생 조건",
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const BCC_FAQ: FaqItem[] = [
  {
    question: "벌초 대행은 언제 신청해야 하나요?",
    answer:
      "추석 직전에는 예약이 집중돼 원하는 날짜에 작업하기 어려울 수 있습니다. 지역농협에서도 추석 전 최소 2주 전 신청을 안내하지만, 위치 확인과 견적 비교를 고려하면 3~4주 전에 신청하는 것이 안전합니다.",
  },
  {
    question: "1기 비용은 봉분 하나만 기준인가요?",
    answer:
      "업체마다 기준이 다릅니다. 일부는 봉분 1기와 약 20평 이하 묘역을 하나의 기본 단위로 보고, 면적이나 봉분이 추가되면 별도 요금을 부과합니다. 견적을 받을 때 기본요금에 포함되는 면적과 봉분 수를 확인해야 합니다.",
  },
  {
    question: "여러 기를 함께 맡기면 할인되나요?",
    answer:
      "같은 묘역에 모여 있으면 이동과 장비 준비가 한 번만 필요해 추가 봉분의 단가가 낮아질 수 있습니다. 반대로 서로 다른 산이나 위치에 흩어져 있으면 각각 출장비나 기본요금이 적용될 수 있습니다.",
  },
  {
    question: "벌초한 풀도 모두 가져가나요?",
    answer:
      "기본 작업은 벤 풀을 묘역 주변에 정리하거나 한곳에 모으는 방식일 수 있습니다. 포대에 담아 외부로 반출하는 작업은 별도 비용이 발생할 수 있으므로 반드시 확인해야 합니다.",
  },
  {
    question: "작업 전후 사진은 기본 제공인가요?",
    answer:
      "업체마다 다릅니다. 사진 보고가 기본으로 포함된 곳도 있고 별도 옵션인 곳도 있습니다. 촬영 위치, 전체 묘역 사진 제공 여부와 재작업 기준까지 확인하는 것이 좋습니다.",
  },
  {
    question: "비가 오면 작업은 어떻게 되나요?",
    answer:
      "안전사고 위험이나 작업 품질 문제로 일정이 변경될 수 있습니다. 우천 시 연기 기준, 재예약 방식과 환불 규정을 계약 전에 확인해야 합니다.",
  },
  {
    question: "묘소를 찾지 못하면 출장비를 내야 하나요?",
    answer:
      "업체 정책에 따라 출장비 또는 위치 탐색 비용이 발생할 수 있습니다. GPS 좌표, 지도 표시, 진입로 사진과 현지 연락처를 미리 전달하는 것이 좋습니다.",
  },
  {
    question: "타인 소유 임야에 있는 묘소도 작업할 수 있나요?",
    answer:
      "묘소가 타인 소유 토지에 있다면 출입과 작업에 토지 소유자의 허가가 필요할 수 있습니다. 일부 업체도 타인 소유 토지의 묘소는 사전 허가가 필요하다고 안내합니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const BCC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/hometown-trip-cost-calculator/", label: "귀성길 교통수단 비교 계산기" },
  { href: "/tools/holiday-bonus-after-tax-calculator/", label: "명절 상여금 실수령 계산기" },
];

export const BCC_SOURCES = [
  { label: "고창 벌초대행 — 예상견적 안내", url: "https://pimtriger.co.kr/%EC%98%88%EC%83%81%EA%B2%AC%EC%A0%81%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/" },
  { label: "서상주농협 — 벌초대행 신청 안내", url: "https://seosangju.nonghyup.com/user/indexSub.do?codyMenuSeq=23976590&siteId=seosangju" },
  { label: "벌초닷컴 — 벌초대행 비용 안내", url: "https://beolchoman.com/?c=72/80" },
];

export const BCC_SEO_CONTENT = {
  introTitle: "벌초 대행, 봉분 수만이 아니라 면적·이동거리·시기가 함께 결정합니다",
  intro: [
    "벌초 대행은 전국 공통 표준단가가 없습니다. 같은 봉분 1기라도 작업 면적, 묘소까지의 이동거리, 풀과 잡목 상태, 예초물 반출 여부와 작업 시기에 따라 견적이 달라질 수 있습니다.",
    "이 계산기는 공개된 업체 가격과 서비스 조건을 참고해 기본 방문·벌초 비용, 추가 봉분과 면적 비용, 경사·접근 난이도, 출장비, 부가 작업, 성수기 예상 가산금액을 나눠 계산합니다.",
    "계산 결과는 업체의 확정 견적이 아니라 비교를 위한 참고 범위입니다. 현장 사진, 묘소 좌표와 도보 이동시간을 업체에 전달하면 더 정확한 견적을 받을 수 있습니다.",
  ],
  criteria: [
    "1기 기본 요금(20평 이하, 평지·접근 양호 기준): 8만~12만 원 — 공개 업체 견적 참고, 전국 표준단가 아님",
    "같은 묘역 추가 봉분: 기당 4만~7만 원 (서로 떨어진 묘소는 각각 기본요금 적용)",
    "성수기 가산: 명절 2~4주 전 10~15%, 2주 이내 15~25% — 업체 공통 기준 아닌 계산기용 추정",
  ],
};
