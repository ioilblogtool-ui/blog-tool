import {
  WBE_2026_THRESHOLDS,
  WBE_ASSET_DEDUCTION_BY_REGION,
  WBE_MONTHLY_CONVERSION_RATE,
  WBE_WORK_INCOME_DEDUCTION,
} from "./welfareBenefitEligibility";

export const HBIRC_META = {
  slug: "housing-benefit-income-recognition",
  title: "주거급여 계산기 2026",
  seoTitle: "주거급여 계산기 2026 | 기준임대료 바로 계산",
  seoDescription:
    "가구원 수, 월소득, 재산, 거주 형태를 입력하면 주거급여 선정기준 통과 여부와 예상 기준임대료·수선비용을 바로 계산합니다.",
  dataNote:
    "2026년 기준 중위소득, 주거급여 선정기준, 기준임대료 고시값을 단순화한 자가 점검용 추정입니다. 실제 수급 여부와 지급액은 주민센터 조사와 국토교통부 고시로 결정됩니다.",
  updatedAt: "2026-06-19",
};

export const HBIRC_REGION_LABELS = {
  metro: "대도시",
  city: "중소도시",
  rural: "농어촌",
};

export const HBIRC_HOUSING_LABELS = {
  rent: "월세",
  jeonse: "전세",
  own: "자가",
  free: "무상거주",
};

export const HBIRC_ZONE_LABELS = {
  zone1: "1급지 (서울)",
  zone2: "2급지 (경기·인천)",
  zone3: "3급지 (광역시·세종·수도권 외 시)",
  zone4: "4급지 (그 외 지역)",
};

export const HBIRC_REPAIR_GRADE_LABELS = {
  minor: "경보수",
  medium: "중보수",
  major: "대보수",
};

// 2026년 국토교통부 주거급여 기준임대료 고시 단순화.
// 실제 신청 전 LH 주거급여 콜센터(1600-0777) 또는 복지로 최신 고시값 확인 필요.
export const HBIRC_STANDARD_RENT: Record<string, Record<number, number>> = {
  zone1: { 1: 352000, 2: 395000, 3: 470000, 4: 545000, 5: 564000, 6: 666000 },
  zone2: { 1: 273000, 2: 304000, 3: 365000, 4: 422000, 5: 437000, 6: 516000 },
  zone3: { 1: 217000, 2: 240000, 3: 287000, 4: 333000, 5: 344000, 6: 406000 },
  zone4: { 1: 188000, 2: 208000, 3: 250000, 4: 289000, 5: 298000, 6: 353000 },
};

export const HBIRC_SELF_BURDEN_RATE = 0.3;

// 전월세 전환율(연), 전세보증금을 월세로 환산할 때 사용
export const HBIRC_JEONSE_CONVERSION_RATE = 0.055;

export const HBIRC_REPAIR_TABLE: Record<
  string,
  { label: string; cycleYears: number; baseAmount: number; description: string }
> = {
  minor: { label: "경보수", cycleYears: 3, baseAmount: 5930000, description: "도배, 장판 등 마감재 개선" },
  medium: { label: "중보수", cycleYears: 5, baseAmount: 9790000, description: "창문, 단열, 보일러 등 기능 개선" },
  major: { label: "대보수", cycleYears: 7, baseAmount: 13910000, description: "지붕, 욕실, 주방 등 구조 개선" },
};

export const HBIRC_REPAIR_SUPPORT_RATIO = {
  livelihoodRecipient: 1.0,
  housingOnly: 0.9,
};

export const HBIRC_PRESETS = [
  {
    id: "single-rent-zone2",
    label: "1인 임차(경기·인천)",
    summary: "월소득 80만 원 · 월세 35만 원",
    input: {
      householdSize: 1,
      region: "metro",
      housingType: "rent",
      zone: "zone2",
      earnedIncome: 800000,
      monthlyRent: 350000,
    },
  },
  {
    id: "family-four-rent-zone1",
    label: "4인 임차(서울)",
    summary: "월소득 250만 원 · 월세 55만 원",
    input: {
      householdSize: 4,
      region: "metro",
      housingType: "rent",
      zone: "zone1",
      earnedIncome: 2500000,
      monthlyRent: 550000,
    },
  },
  {
    id: "elderly-own-rural",
    label: "노인 자가(농어촌)",
    summary: "공적이전 70만 원 · 주택 22년차",
    input: {
      householdSize: 1,
      region: "rural",
      housingType: "own",
      publicTransferIncome: 700000,
      houseAge: 22,
      repairGrade: "major",
    },
  },
  {
    id: "jeonse-two",
    label: "2인 전세",
    summary: "전세보증금 1.2억 · 월소득 150만 원",
    input: {
      householdSize: 2,
      region: "city",
      housingType: "jeonse",
      zone: "zone2",
      earnedIncome: 1500000,
      jeonseDeposit: 120000000,
    },
  },
];

export const HBIRC_FAQ = [
  {
    question: "주거급여 소득인정액 기준은 얼마인가요?",
    answer:
      "2026년 주거급여 선정기준은 기준 중위소득의 48%입니다. 4인 가구는 월 3,117,474원이 주거급여 선정기준입니다.",
  },
  {
    question: "기준임대료가 무엇인가요?",
    answer:
      "국토교통부가 지역(급지)과 가구원 수별로 고시하는 월 임대료 상한액입니다. 실제 임차료가 기준임대료보다 적으면 실제 금액을, 많으면 기준임대료까지만 인정합니다.",
  },
  {
    question: "월세가 기준임대료보다 비싸면 차액은 못 받나요?",
    answer:
      "네. 기준임대료는 상한선이라 초과분은 본인이 부담해야 합니다. 이 계산기는 실제 월세와 기준임대료 중 작은 값을 기준으로 계산합니다.",
  },
  {
    question: "전세는 어떻게 계산하나요?",
    answer:
      "전세보증금에 전월세 전환율을 적용해 월세로 환산한 뒤 월세와 동일한 방식으로 계산합니다. 실제 전환율은 지역과 계약 조건에 따라 달라질 수 있습니다.",
  },
  {
    question: "자가도 주거급여를 받을 수 있나요?",
    answer:
      "네. 자가가구는 임대료 대신 주택 노후도에 따라 경보수·중보수·대보수로 구분한 수선비용을 지원받을 수 있습니다.",
  },
  {
    question: "주거급여는 부양의무자 기준이 있나요?",
    answer:
      "주거급여는 2018년부터 부양의무자 기준이 폐지되어 소득·재산 기준(소득인정액)만으로 판단합니다.",
  },
  {
    question: "계산 결과와 실제 지급액이 다를 수 있나요?",
    answer:
      "그렇습니다. 이 계산기는 자가 점검용 추정이며, 실제 지급액은 주민센터 조사와 국토교통부 최신 고시값에 따라 달라질 수 있습니다.",
  },
];

export const HBIRC_RELATED_LINKS = [
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "기초생활수급자 자격 계산기" },
  { href: "/tools/basic-livelihood-recipient-asset-standard/", label: "기초생활수급자 재산 기준 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지지원금 정리" },
];

export const HBIRC_SEO_CONTENT = {
  introTitle: "주거급여는 소득인정액 통과 후 거주 형태에 따라 받는 금액이 달라집니다",
  intro: [
    "월세나 전세를 살면서 생활비 부담을 줄이고 싶을 때, 또는 오래된 자가 주택을 고칠 비용이 막막할 때 가장 먼저 떠오르는 제도가 주거급여입니다. 하지만 \"내가 받을 수 있는지\", \"받는다면 얼마나 받는지\"는 소득인정액과 거주 형태를 같이 따져봐야 알 수 있어 막연하게 느껴지기 쉽습니다. 이 계산기는 가구원 수, 월소득, 재산, 거주 형태를 입력해 그 답을 한 번에 확인하도록 만든 도구입니다.",
    "주거급여는 생계급여처럼 소득인정액이 기준선 아래인지부터 확인합니다. 2026년 주거급여 선정기준은 기준 중위소득의 48%로, 4인 가구는 월 3,117,474원입니다. 다만 주거급여는 기준을 통과한 뒤가 더 중요합니다. 임차가구(월세·전세)는 국토교통부가 지역(급지)과 가구원 수별로 고시하는 기준임대료까지 실제 임차료를 보전받고, 자가가구는 주택 노후도에 따라 경보수·중보수·대보수로 나눈 수선비용을 지원받는 방식이 서로 다르기 때문입니다.",
    "결과를 해석할 때는 두 단계를 차례로 봐야 합니다. 먼저 소득인정액이 선정기준보다 낮은지로 신청 가능성을 가늠하고, 그다음 임차가구라면 실제 월세와 기준임대료 중 더 작은 값이 지급 기준이 된다는 점을, 자가가구라면 수선 등급에 따라 지원금액이 달라진다는 점을 함께 확인해야 합니다. 실제 월세가 기준임대료보다 비싸면 초과분은 본인이 부담해야 한다는 점도 결과에서 따로 표시됩니다.",
    "다만 이 계산기는 실제 제도를 단순화한 자가 점검용 추정입니다. 기준임대료 표는 국토교통부 고시값을 단순화한 것이라 실제 신청 전 최신 고시값을 다시 확인해야 하고, 자동차나 재산 특례, 수선비 지원 비율도 실제 조사 과정에서 다르게 반영될 수 있습니다. 정확한 수급 여부와 지급액은 복지로 또는 주소지 읍면동 주민센터에서 최종 확인해야 합니다.",
  ],
  inputPoints: [
    "가구원 수와 거주 형태(월세·전세·자가)별 2026년 주거급여 선정기준을 확인할 수 있습니다.",
    "월소득과 재산을 반영한 소득인정액을 간이 추정할 수 있습니다.",
    "임차가구는 예상 기준임대료, 자가가구는 예상 수선비용까지 함께 볼 수 있습니다.",
  ],
  criteria: [
    "기준 중위소득과 주거급여 선정기준은 저장소의 2026년 기준값을 사용합니다.",
    "기준임대료는 국토교통부 고시값을 단순화한 추정이며 실제 신청 전 최신 고시값 확인이 필요합니다.",
    "소득인정액 계산은 실제 제도를 단순화한 자가 점검용 추정입니다.",
    "최종 수급 여부는 복지로 또는 주민센터에서 확인해야 합니다.",
  ],
};

export const HBIRC_CONFIG = {
  thresholds: WBE_2026_THRESHOLDS,
  assetDeductions: WBE_ASSET_DEDUCTION_BY_REGION,
  rates: WBE_MONTHLY_CONVERSION_RATE,
  workDeduction: WBE_WORK_INCOME_DEDUCTION,
  standardRent: HBIRC_STANDARD_RENT,
  selfBurdenRate: HBIRC_SELF_BURDEN_RATE,
  jeonseConversionRate: HBIRC_JEONSE_CONVERSION_RATE,
  repairTable: HBIRC_REPAIR_TABLE,
  repairSupportRatio: HBIRC_REPAIR_SUPPORT_RATIO,
  presets: HBIRC_PRESETS,
  labels: {
    regions: HBIRC_REGION_LABELS,
    housing: HBIRC_HOUSING_LABELS,
    zones: HBIRC_ZONE_LABELS,
    repairGrades: HBIRC_REPAIR_GRADE_LABELS,
  },
};
