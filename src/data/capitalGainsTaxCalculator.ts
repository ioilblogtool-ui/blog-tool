// ─── 양도소득세 계산기 데이터 ────────────────────────────────────
// slug: capital-gains-tax-calculator
// 2026년 기준 | 주택·토지·상가 양도세 추정 계산기

export const CGT_META = {
  slug: "capital-gains-tax-calculator",
  title: "양도소득세 계산기",
  seoTitle: "양도소득세 계산기 — 1주택 비과세·다주택 중과·장기보유특별공제 자동 계산 2026",
  seoDescription:
    "아파트·토지·상가 양도 시 납부세액을 자동 계산합니다. 1가구 1주택 비과세 12억 기준, 장기보유특별공제 최대 80%, 다주택 중과 여부까지 한 번에 확인하세요.",
  description:
    "1가구 1주택 비과세, 장기보유특별공제(최대 80%), 다주택 중과세율, 단기양도세율까지 모두 반영한 양도소득세 추정 계산기입니다.",
  updatedAt: "2026-06",
  caution:
    "이 계산기는 일반적인 양도소득세 추정용입니다. 실제 신고 시 취득가액 증빙, 감가상각, 일시적 2주택 특례, 비사업용 토지, 미등기 양도 등은 별도 세무사 검토가 필요합니다.",
  dataNote: "2026년 소득세법 기준. 다주택 중과세 한시 배제(2022.5~)는 계속 연장 중이나, 정책 변경 가능성 있음.",
};

// ─── 기본값 ────────────────────────────────────────────────────
export const CGT_DEFAULTS = {
  propertyType: "house",        // house | land | commercial
  houseCount: "one",            // one | two | three_plus
  adjustedZone: false,          // 조정대상지역 여부
  residenceYears: 2,            // 거주 년수 (1주택 장특공제용)
  acquirePrice: 300_000_000,    // 취득가액
  sellPrice: 600_000_000,       // 양도가액
  expenses: 10_000_000,         // 필요경비
  holdingYears: 5,              // 보유 년수
  holdMonths: 0,                // 보유 개월 수 (추가)
  heavyTaxApply: false,         // 다주택 중과 적용 여부 (기본: 배제)
};

// ─── 부동산 유형 ─────────────────────────────────────────────
export const CGT_PROPERTY_TYPES = [
  { value: "house",      label: "주택 (아파트·다세대·단독)" },
  { value: "land",       label: "토지·일반 건물" },
  { value: "commercial", label: "상가·오피스텔·업무용" },
];

// ─── 주택 수 옵션 ─────────────────────────────────────────────
export const CGT_HOUSE_COUNTS = [
  { value: "one",         label: "1주택 (비과세 검토)", desc: "2년 보유 시 12억 이하 비과세" },
  { value: "two",         label: "2주택", desc: "기본세율 (조정지역 중과 선택)" },
  { value: "three_plus",  label: "3주택 이상", desc: "기본세율 (조정지역 중과 선택)" },
];

// ─── 기본 누진세율 (8구간) ────────────────────────────────────
// 소득세법 §55
export const CGT_TAX_BRACKETS = [
  { limit: 14_000_000,  rate: 0.06, cumDed: 0,          label: "1,400만 이하 6%" },
  { limit: 50_000_000,  rate: 0.15, cumDed: 1_260_000,  label: "5,000만 이하 15%" },
  { limit: 88_000_000,  rate: 0.24, cumDed: 5_760_000,  label: "8,800만 이하 24%" },
  { limit: 150_000_000, rate: 0.35, cumDed: 15_440_000, label: "1.5억 이하 35%" },
  { limit: 300_000_000, rate: 0.38, cumDed: 19_940_000, label: "3억 이하 38%" },
  { limit: 500_000_000, rate: 0.40, cumDed: 25_940_000, label: "5억 이하 40%" },
  { limit: 1_000_000_000, rate: 0.42, cumDed: 35_940_000, label: "10억 이하 42%" },
  { limit: Infinity,    rate: 0.45, cumDed: 65_940_000, label: "10억 초과 45%" },
];

// ─── 단기 보유 세율 ─────────────────────────────────────────
export const CGT_SHORT_TERM_RATES = {
  house: [
    { maxMonths: 12,  rate: 0.70, label: "주택 1년 미만 보유 70%" },
    { maxMonths: 24,  rate: 0.60, label: "주택 2년 미만 보유 60%" },
  ],
  other: [
    { maxMonths: 12,  rate: 0.50, label: "1년 미만 보유 50%" },
    { maxMonths: 24,  rate: 0.40, label: "2년 미만 보유 40%" },
  ],
};

// ─── 다주택 중과 가산세율 ────────────────────────────────────
// 조정대상지역 한정 (현재 한시 배제 중)
export const CGT_HEAVY_TAX_ADD = {
  two: 0.20,        // 2주택 +20%p
  three_plus: 0.30, // 3주택+ +30%p
};

// ─── 장기보유특별공제 ────────────────────────────────────────
// 1가구 1주택 (2년 거주 충족): 보유 연4% + 거주 연4% = 최대 80%
// 일반 (미거주·비주택): 보유 연2%, 최대 30%
// 중과 적용 시 or 2년 미만 보유 시: 0%
export const CGT_LONGTERM_TABLE = {
  // 1주택 거주 충족 (보유 3년~10년 이상)
  oneHouseWithResidence: [
    { minYears: 3,  holdRate: 0.12, residRate: 0.08 },  // 보유 3년: 12%, 거주 2년: 8%
    { minYears: 4,  holdRate: 0.16, residRate: 0.12 },
    { minYears: 5,  holdRate: 0.20, residRate: 0.16 },
    { minYears: 6,  holdRate: 0.24, residRate: 0.20 },
    { minYears: 7,  holdRate: 0.28, residRate: 0.24 },
    { minYears: 8,  holdRate: 0.32, residRate: 0.28 },
    { minYears: 9,  holdRate: 0.36, residRate: 0.32 },
    { minYears: 10, holdRate: 0.40, residRate: 0.40 }, // 최대 80%
  ],
  // 일반 (비거주 1주택 / 비주택) — 3년~15년, 연2% 최대 30%
  general: [
    { minYears: 3,  rate: 0.06 },
    { minYears: 4,  rate: 0.08 },
    { minYears: 5,  rate: 0.10 },
    { minYears: 6,  rate: 0.12 },
    { minYears: 7,  rate: 0.14 },
    { minYears: 8,  rate: 0.16 },
    { minYears: 9,  rate: 0.18 },
    { minYears: 10, rate: 0.20 },
    { minYears: 11, rate: 0.22 },
    { minYears: 12, rate: 0.24 },
    { minYears: 13, rate: 0.26 },
    { minYears: 14, rate: 0.28 },
    { minYears: 15, rate: 0.30 },
  ],
};

// ─── 빠른 선택 금액 ──────────────────────────────────────────
export const CGT_QUICK_SELL = [
  { label: "3억", value: 300_000_000 },
  { label: "5억", value: 500_000_000 },
  { label: "7억", value: 700_000_000 },
  { label: "10억", value: 1_000_000_000 },
  { label: "15억", value: 1_500_000_000 },
  { label: "20억", value: 2_000_000_000 },
];

export const CGT_QUICK_ACQUIRE = [
  { label: "1억", value: 100_000_000 },
  { label: "2억", value: 200_000_000 },
  { label: "3억", value: 300_000_000 },
  { label: "5억", value: 500_000_000 },
  { label: "8억", value: 800_000_000 },
  { label: "10억", value: 1_000_000_000 },
];

// ─── 시뮬레이션 케이스 ──────────────────────────────────────
export const CGT_SIMULATION_CASES = [
  {
    label: "1주택 비과세 — 10억 매도",
    desc: "2년 보유·거주, 12억 이하 → 전액 비과세",
    acquirePrice: 400_000_000,
    sellPrice: 1_000_000_000,
    expenses: 15_000_000,
    holdingYears: 5,
    residenceYears: 5,
    propertyType: "house",
    houseCount: "one",
    adjustedZone: true,
    heavyTaxApply: false,
    taxNote: "전액 비과세",
    taxAmount: 0,
  },
  {
    label: "1주택 15억 매도 — 12억 초과",
    desc: "보유 8년·거주 4년, 15억 양도 → 12억 초과분 과세",
    acquirePrice: 500_000_000,
    sellPrice: 1_500_000_000,
    expenses: 20_000_000,
    holdingYears: 8,
    residenceYears: 4,
    propertyType: "house",
    houseCount: "one",
    adjustedZone: true,
    heavyTaxApply: false,
    taxNote: "약 5,300만 원 (추정)",
    taxAmount: 53_000_000,
  },
  {
    label: "2주택 — 조정외 지역 5억 매도",
    desc: "기본세율 적용, 보유 6년, 중과 배제",
    acquirePrice: 200_000_000,
    sellPrice: 500_000_000,
    expenses: 8_000_000,
    holdingYears: 6,
    residenceYears: 0,
    propertyType: "house",
    houseCount: "two",
    adjustedZone: false,
    heavyTaxApply: false,
    taxNote: "약 5,800만 원 (추정)",
    taxAmount: 58_000_000,
  },
  {
    label: "단기양도 — 1년 미만 주택",
    desc: "보유 11개월, 70% 단일세율 적용",
    acquirePrice: 300_000_000,
    sellPrice: 400_000_000,
    expenses: 5_000_000,
    holdingYears: 0,
    residenceYears: 0,
    propertyType: "house",
    houseCount: "two",
    adjustedZone: false,
    heavyTaxApply: false,
    taxNote: "약 6,600만 원 (추정)",
    taxAmount: 66_000_000,
  },
  {
    label: "토지 10년 보유 3억 양도",
    desc: "일반세율, 장기보유특별공제 20% 적용",
    acquirePrice: 100_000_000,
    sellPrice: 300_000_000,
    expenses: 5_000_000,
    holdingYears: 10,
    residenceYears: 0,
    propertyType: "land",
    houseCount: "one",
    adjustedZone: false,
    heavyTaxApply: false,
    taxNote: "약 3,400만 원 (추정)",
    taxAmount: 34_000_000,
  },
  {
    label: "상가 5년 보유 5억 양도",
    desc: "일반세율, 장기보유특별공제 10% 적용",
    acquirePrice: 200_000_000,
    sellPrice: 500_000_000,
    expenses: 10_000_000,
    holdingYears: 5,
    residenceYears: 0,
    propertyType: "commercial",
    houseCount: "one",
    adjustedZone: false,
    heavyTaxApply: false,
    taxNote: "약 6,200만 원 (추정)",
    taxAmount: 62_000_000,
  },
];

// ─── 절세 팁 ────────────────────────────────────────────────
export const CGT_TAX_TIPS = [
  {
    icon: "🏡",
    title: "1주택 비과세 최대 활용",
    body: "2년 이상 보유·거주(조정지역)하면 12억 이하 전액 비과세. 양도 전 반드시 요건 충족 여부를 확인하세요.",
  },
  {
    icon: "📅",
    title: "장기보유특별공제 80%",
    body: "1가구 1주택 10년 이상 보유·거주 시 최대 80% 공제. 양도 시점을 1~2년 늦추면 수천만 원 절세 가능합니다.",
  },
  {
    icon: "🧾",
    title: "필요경비 꼼꼼히 챙기기",
    body: "취득세, 법무사비, 중개수수료, 발코니 확장·인테리어(자본적 지출) 등 증빙 보관 시 비용 공제 가능합니다.",
  },
  {
    icon: "📋",
    title: "이월과세·부당행위 주의",
    body: "배우자·직계존비속에게 증여 후 5년 내 재양도 시 이월과세 적용 — 증여 없이 직접 양도한 것으로 간주합니다.",
  },
  {
    icon: "⏱️",
    title: "일시적 2주택 특례",
    body: "이사 목적 일시적 2주택은 신규 취득 후 3년 내 기존 주택 양도 시 1주택 비과세 적용 가능합니다.",
  },
  {
    icon: "📌",
    title: "다주택 중과 한시 배제 확인",
    body: "2022년 5월부터 다주택 중과세 한시 배제가 연장 중. 배제 종료 전 양도 여부를 반드시 확인하세요.",
  },
];

// ─── FAQ ────────────────────────────────────────────────────
export const CGT_FAQ = [
  {
    question: "1가구 1주택 비과세 요건이 정확히 무엇인가요?",
    answer:
      "2년 이상 보유(조정대상지역은 2년 이상 거주 추가)하고 양도가액이 12억 원 이하이면 전액 비과세입니다. 양도가액이 12억을 초과하면 초과분에 해당하는 양도차익만 과세됩니다.",
  },
  {
    question: "장기보유특별공제는 어떻게 계산하나요?",
    answer:
      "1가구 1주택(2년 거주 충족)은 보유 연 4% + 거주 연 4%로 최대 80% 공제됩니다. 일반(비거주·비주택)은 보유 3년부터 연 2%, 최대 30%입니다. 2년 미만 단기양도 또는 중과세율 적용 시에는 장기보유특별공제가 배제됩니다.",
  },
  {
    question: "다주택자 중과세는 현재 적용되고 있나요?",
    answer:
      "2022년 5월부터 조정대상지역 다주택 중과세(2주택 +20%p, 3주택 이상 +30%p)가 한시 배제되어 기본세율이 적용됩니다. 배제 종료 시점은 정책에 따라 달라지므로 양도 전 최신 세법을 반드시 확인하세요.",
  },
  {
    question: "지방소득세는 얼마나 추가되나요?",
    answer:
      "산출세액의 10%가 지방소득세로 추가 납부됩니다. 예를 들어 양도소득세가 3,000만 원이면 지방소득세 300만 원을 더해 총 3,300만 원을 납부합니다.",
  },
  {
    question: "필요경비로 인정받을 수 있는 비용은 무엇인가요?",
    answer:
      "취득 시 납부한 취득세, 법무사 비용, 매수·매도 중개수수료, 자본적 지출(인테리어·발코니 확장 등 자산 가치를 증가시킨 비용)이 포함됩니다. 단순 수선비나 유지비는 인정되지 않습니다.",
  },
  {
    question: "양도소득세 신고 기한은 언제인가요?",
    answer:
      "양도일이 속한 달의 말일부터 2개월 이내에 예정신고를 해야 합니다. 예정신고를 하면 별도의 확정신고가 필요 없습니다. 신고·납부 기한을 놓치면 무신고 가산세(20%)와 납부지연 가산세가 부과됩니다.",
  },
  {
    question: "주택이 아닌 토지나 상가도 같은 방식으로 계산하나요?",
    answer:
      "기본 계산 구조는 같지만 세율이 다릅니다. 비주택(토지·건물·상가)의 단기양도세율은 1년 미만 50%, 2년 미만 40%이고 주택(70%/60%)보다 낮습니다. 비사업용 토지는 기본세율에 10%p 추가 중과가 적용될 수 있습니다.",
  },
];

// ─── 관련 링크 ───────────────────────────────────────────────
export const CGT_RELATED_LINKS = [
  {
    href: "/tools/gift-tax-calculator/",
    label: "증여세 계산기",
    desc: "자녀·배우자 증여 한도 및 절세 전략 계산",
  },
  {
    href: "/reports/multi-house-tax-2026/",
    label: "다주택자 세금 분석 2026",
    desc: "취득세·종부세·양도세·임대소득세 완전 정리",
  },
  {
    href: "/reports/seoul-84-apartment-prices/",
    label: "서울 아파트 84㎡ 시세 리포트",
    desc: "서울 주요 단지 실거래가 및 시세 분석",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령액 계산기",
    desc: "4대보험·소득세 공제 후 실수령액 계산",
  },
];
