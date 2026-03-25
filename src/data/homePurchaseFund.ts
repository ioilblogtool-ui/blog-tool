// 내집마련 자금 계산기 — 데이터 파일
// 모든 수치는 추정값·참고용입니다. 실제 대출 조건은 반드시 금융기관에서 확인하세요.

export const PAGE_META = {
  title: "내집마련 자금 계산기 — 규제지역·토허제별 LTV·취득세 총비용",
  subtitle: "매매가와 지역 유형을 입력하면 LTV 기반 최대 대출 가능액, 취득세·중개보수 포함 총 필요 현금, 월 상환액을 바로 계산합니다.",
  methodology: "LTV·취득세율·중개보수 요율은 2026년 3월 기준 정책 참고값입니다. 실제 대출 가능액은 DSR·소득 심사 결과에 따라 다를 수 있습니다.",
  caution: "이 계산기는 참고용 추정값을 제공합니다. 실제 대출·세금·비용은 금융기관 및 세무 전문가를 통해 반드시 확인하세요.",
  updatedAt: "2026년 3월 기준",
};

// 지역 유형
export type RegionType = "overheated" | "regulated" | "unregulated";
export type OwnershipType = "none" | "one" | "two_plus";

// LTV 비율 (%)
export const LTV_RATES: Record<RegionType, Record<OwnershipType, number>> = {
  overheated:   { none: 50, one: 40, two_plus: 0  },
  regulated:    { none: 70, one: 60, two_plus: 30 },
  unregulated:  { none: 70, one: 60, two_plus: 50 },
};

// 정책상 주담대 한도 (수도권·규제지역 기준, 원)
export function getPolicyLoanLimit(regionType: RegionType, price: number): number {
  if (regionType === "unregulated") return Infinity;
  if (price <= 1500000000) return 600000000;   // 15억 이하 → 6억
  if (price <= 2500000000) return 400000000;   // 25억 이하 → 4억
  return 200000000;                             // 25억 초과 → 2억
}

// 취득세 계산 (지방교육세 포함, 농특세 미반영)
export function calcAcquisitionTax(
  price: number,
  ownershipType: OwnershipType,
  regionType: RegionType
): number {
  // 다주택 중과
  if (ownershipType === "two_plus") {
    if (regionType !== "unregulated") {
      return price * 0.12 * 1.1; // 3주택 이상 조정: 12% × 1.1
    }
    return price * 0.08 * 1.1;  // 비규제 다주택: 8% × 1.1
  }
  if (ownershipType === "one" && regionType !== "unregulated") {
    return price * 0.08 * 1.1;  // 2주택 조정: 8% × 1.1
  }

  // 1주택(또는 1주택→비규제 추가): 일반세율
  let baseRate: number;
  const SIX_EOK  = 600000000;
  const NINE_EOK = 900000000;
  if (price <= SIX_EOK) {
    baseRate = 0.01;
  } else if (price <= NINE_EOK) {
    // 비례 구간: 1% + (price - 6억) / (3억) × 2%
    baseRate = 0.01 + ((price - SIX_EOK) / (NINE_EOK - SIX_EOK)) * 0.02;
  } else {
    baseRate = 0.03;
  }
  return price * baseRate * 1.1;
}

// 중개보수 (상한 요율 기준)
export function calcBrokerageFee(price: number): number {
  const LIMITS = [
    { max: 50000000,    rate: 0.006, cap: 250000   },
    { max: 200000000,   rate: 0.005, cap: 800000   },
    { max: 900000000,   rate: 0.004, cap: Infinity },
    { max: 1200000000,  rate: 0.005, cap: Infinity },
    { max: 1500000000,  rate: 0.006, cap: Infinity },
    { max: Infinity,    rate: 0.007, cap: Infinity },
  ];
  for (const bracket of LIMITS) {
    if (price <= bracket.max) {
      return Math.min(price * bracket.rate, bracket.cap);
    }
  }
  return price * 0.007;
}

// 월 원리금균등상환
export function calcMonthlyPayment(loan: number, annualRate: number, termYears: number): number {
  if (loan <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// 프리셋 4종
export const PRESETS = [
  {
    id: "seoul_premium",
    label: "🔴 서울 고가",
    price: 3000000000,
    regionType: "overheated" as RegionType,
    ownershipType: "none" as OwnershipType,
    cash: 1000000000,
    rate: 4.0,
    term: 30,
  },
  {
    id: "seoul_general",
    label: "🟠 서울 규제",
    price: 1500000000,
    regionType: "regulated" as RegionType,
    ownershipType: "none" as OwnershipType,
    cash: 500000000,
    rate: 4.0,
    term: 30,
  },
  {
    id: "seoul_mid",
    label: "🟡 서울 중저가",
    price: 1000000000,
    regionType: "regulated" as RegionType,
    ownershipType: "none" as OwnershipType,
    cash: 300000000,
    rate: 4.0,
    term: 30,
  },
  {
    id: "unregulated",
    label: "🟢 비규제",
    price: 500000000,
    regionType: "unregulated" as RegionType,
    ownershipType: "none" as OwnershipType,
    cash: 150000000,
    rate: 4.0,
    term: 30,
  },
];

export const REGION_LABELS: Record<RegionType, string> = {
  overheated:   "투기과열지구 + 토허제",
  regulated:    "조정대상지역",
  unregulated:  "비규제지역",
};

export const OWNERSHIP_LABELS: Record<OwnershipType, string> = {
  none:      "무주택",
  one:       "1주택",
  two_plus:  "2주택 이상",
};

// 제휴 상품 (쿠팡파트너스 — 이사 준비 용품)
export const AFFILIATE_PRODUCTS = [
  {
    tag: "필수템",
    title: "파페피 대용량 접이식 이사봉투 방수",
    desc: "이사 준비 첫 구매 수요 · 묶음 실속",
    url: "https://link.coupang.com/a/ebbCjw",
  },
  {
    tag: "필수템",
    title: "에어캡 롤 (뽁뽁이 50m)",
    desc: "깨지기 쉬운 물건 포장 필수",
    url: "https://link.coupang.com/a/ebbE7Q",
  },
  {
    tag: "입주 추천",
    title: "입주 사전점검 준비물 세트 키트",
    desc: "체크리스트 하자보수 방수 스티커",
    url: "https://link.coupang.com/a/ebbH1D",
  },
  {
    tag: "교체 추천",
    title: "스마트 도어락",
    desc: "입주 시 교체 니즈 높음",
    url: "https://link.coupang.com/a/ebbGur",
  },
];

export const PAGE_FAQ = [
  {
    question: "토허제(토지거래허가구역)란 무엇인가요?",
    answer: "규제지역 중 토지 거래 시 구청 허가가 필요한 구역입니다. 매수 전 허가가 필요하고 실거주 의무가 붙을 수 있어 갭투자 목적 매수는 제한될 수 있습니다.",
  },
  {
    question: "토허제 구역에서 대출이 더 어렵나요?",
    answer: "LTV만이 아니라 허가·실거주 요건까지 함께 확인해야 합니다. 실제 잔금대출 심사에서 실거주 계획 확인이 중요할 수 있으며, 실무에서는 대출 조건이 더 까다로울 수 있습니다.",
  },
  {
    question: "스트레스 DSR이 뭔가요?",
    answer: "실제 금리 외에 추가 금리 스트레스를 반영해 대출 한도를 계산하는 제도입니다. 2026년 3월 현재 3단계가 시행 중이라 실제 대출 가능액이 LTV 기준보다 더 적을 수 있습니다.",
  },
  {
    question: "생애최초 주택 구입자는 LTV가 다른가요?",
    answer: "현재는 수도권·규제지역 기준으로 생애최초도 LTV 70%를 우선 반영하는 보수적 계산이 안전합니다. 실제 상품별 조건은 은행·정책대출에 따라 다시 확인해야 합니다.",
  },
  {
    question: "취득세 중과란 무엇인가요?",
    answer: "조정대상지역에서 다주택을 취득할 때 일반세율보다 높은 세율이 적용됩니다. 2주택은 8%, 3주택 이상은 12%입니다. 계산기에서는 주택 수와 지역 유형 기준으로 추정 반영합니다.",
  },
  {
    question: "부대비용은 얼마나 예상해야 하나요?",
    answer: "취득세, 중개보수, 등기비를 합치면 수천만 원 단위까지 커질 수 있습니다. 특히 고가 주택은 자기자본과 세금 비중이 매우 커집니다. 10억 기준으로 취득세+중개보수+등기비만 2,000만원 이상이 될 수 있습니다.",
  },
  {
    question: "중개보수 협의가 가능한가요?",
    answer: "법정 상한 요율 이하에서 협의 가능합니다. 이 계산기는 상한 요율 기준 추정값을 보여주며, 실제 계약 시 공인중개사와 협의를 통해 낮출 수 있습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/salary/",    label: "연봉 인상 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
  { href: "/tools/household-income/", label: "가구 소득 계산기" },
];
