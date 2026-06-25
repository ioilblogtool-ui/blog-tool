export type DataBadge = "공식" | "보도 기반" | "추정" | "시뮬레이션" | "확인 필요";
export type AffordabilityLevel = "stable" | "tight" | "risk" | "danger";
export type RegionId = "dongtan" | "gwanggyo" | "yeongtong" | "bundang";
export type LoanScenarioId = "loan10" | "loan12" | "loan15";
export type IncomeScenarioId = "income800" | "income1000" | "income1200";

export interface EvidenceMetric {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  badge: DataBadge;
  description: string;
}

export interface PurchaseCostInput {
  homePrice: number;
  loanAmount: number;
  acquisitionTaxRate: number;
  brokerageFeeRate: number;
  legalFee: number;
  movingReserve: number;
}

export interface PurchaseCostResult {
  id: LoanScenarioId;
  label: string;
  homePrice: number;
  loanAmount: number;
  equityRequired: number;
  acquisitionTax: number;
  brokerageFee: number;
  legalFee: number;
  movingReserve: number;
  totalCashRequired: number;
  note: string;
}

export interface LoanScenario {
  id: LoanScenarioId;
  label: string;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  annualPayment: number;
  description: string;
}

export interface IncomeScenario {
  id: IncomeScenarioId;
  label: string;
  monthlyNetIncome: number;
  livingCost: number;
  description: string;
}

export interface AffordabilityCell {
  incomeId: IncomeScenarioId;
  loanId: LoanScenarioId;
  monthlyPayment: number;
  housingRatio: number;
  remainingCash: number;
  level: AffordabilityLevel;
  label: string;
  comment: string;
}

export interface PriceDriver {
  id: string;
  title: string;
  summary: string;
  upside: string;
  caution: string;
}

export interface RegionCompareItem {
  id: RegionId;
  name: string;
  pricePosition: string;
  strengths: string[];
  risks: string[];
  note: string;
}

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
  tone: "primary" | "default";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const DT20_META = {
  slug: "dongtan-20-billion-apartment-affordability-2026",
  title: "동탄 20억 시대, 진짜 가능한 가격일까?",
  seoTitle: "동탄 20억 시대, 진짜 가능한 가격일까?｜84㎡ 실거래·대출·월급 기준 검증",
  description:
    "동탄 84㎡ 20억 실거래가를 기준으로 필요 현금, 대출 10억·12억·15억 월 원리금, 부부 실수령 800만·1,000만·1,200만 원의 실거주 가능성을 계산합니다.",
  updatedAt: "2026.06.23",
  caution:
    "보도 수치와 공개 실거래 자료를 바탕으로 한 참고용 검증 콘텐츠입니다. 대출 가능액, 세금, 월 상환액은 개인 조건과 금융기관 심사에 따라 달라질 수 있으며 투자 권유가 아닙니다.",
};

export const DT20_BASE_PRICE = 2_000_000_000;
export const DT20_INTEREST_RATE = 0.042;
export const DT20_TERM_YEARS = 40;

export const DT20_PURCHASE_COST_DEFAULTS = {
  acquisitionTaxRate: 0.033,
  brokerageFeeRate: 0.004,
  legalFee: 3_000_000,
  movingReserve: 20_000_000,
};

export const DT20_EVIDENCE_METRICS: EvidenceMetric[] = [
  {
    id: "base-price",
    label: "검증 기준 가격",
    value: "20억 원",
    numericValue: DT20_BASE_PRICE,
    unit: "원",
    badge: "시뮬레이션",
    description: "동탄 84㎡ 고가 거래를 검증하기 위한 기준 가격입니다.",
  },
  {
    id: "reported-high",
    label: "84㎡ 고가 실거래",
    value: "20억8000만 원",
    numericValue: 2_080_000_000,
    unit: "원",
    badge: "보도 기반",
    description: "사용자 제공 보도 수치 기준이며 구현 전 원문 확인이 필요합니다.",
  },
  {
    id: "ytd-growth",
    label: "올해 상승률",
    value: "5.11%",
    numericValue: 5.11,
    unit: "%",
    badge: "보도 기반",
    description: "동탄구 상승률로 보도된 수치입니다.",
  },
  {
    id: "listing-drop",
    label: "매물 감소율",
    value: "42.6%",
    numericValue: 42.6,
    unit: "%",
    badge: "보도 기반",
    description: "단기 수급 압력을 설명하는 보도 수치입니다.",
  },
];

export const DT20_INCOME_SCENARIOS: IncomeScenario[] = [
  {
    id: "income800",
    label: "부부 실수령 800만 원",
    monthlyNetIncome: 8_000_000,
    livingCost: 3_500_000,
    description: "맞벌이 중상위 가구의 보수적 현금흐름입니다.",
  },
  {
    id: "income1000",
    label: "부부 실수령 1,000만 원",
    monthlyNetIncome: 10_000_000,
    livingCost: 3_800_000,
    description: "고소득 맞벌이의 중간 시나리오입니다.",
  },
  {
    id: "income1200",
    label: "부부 실수령 1,200만 원",
    monthlyNetIncome: 12_000_000,
    livingCost: 4_200_000,
    description: "20억 주택 검토권에 가까운 고소득 시나리오입니다.",
  },
];

export function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 12;
  const months = termYears * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculatePurchaseCost(id: LoanScenarioId, label: string, loanAmount: number, note: string): PurchaseCostResult {
  const equityRequired = Math.max(0, DT20_BASE_PRICE - loanAmount);
  const acquisitionTax = Math.round(DT20_BASE_PRICE * DT20_PURCHASE_COST_DEFAULTS.acquisitionTaxRate);
  const brokerageFee = Math.round(DT20_BASE_PRICE * DT20_PURCHASE_COST_DEFAULTS.brokerageFeeRate);
  const legalFee = DT20_PURCHASE_COST_DEFAULTS.legalFee;
  const movingReserve = DT20_PURCHASE_COST_DEFAULTS.movingReserve;

  return {
    id,
    label,
    homePrice: DT20_BASE_PRICE,
    loanAmount,
    equityRequired,
    acquisitionTax,
    brokerageFee,
    legalFee,
    movingReserve,
    totalCashRequired: equityRequired + acquisitionTax + brokerageFee + legalFee + movingReserve,
    note,
  };
}

export const DT20_LOAN_SCENARIOS: LoanScenario[] = [
  {
    id: "loan10",
    label: "대출 10억",
    loanAmount: 1_000_000_000,
    interestRate: DT20_INTEREST_RATE,
    termYears: DT20_TERM_YEARS,
    monthlyPayment: calculateMonthlyPayment(1_000_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS),
    annualPayment: calculateMonthlyPayment(1_000_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS) * 12,
    description: "현금 10억 이상이 필요하지만 월 부담은 세 시나리오 중 가장 낮습니다.",
  },
  {
    id: "loan12",
    label: "대출 12억",
    loanAmount: 1_200_000_000,
    interestRate: DT20_INTEREST_RATE,
    termYears: DT20_TERM_YEARS,
    monthlyPayment: calculateMonthlyPayment(1_200_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS),
    annualPayment: calculateMonthlyPayment(1_200_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS) * 12,
    description: "고소득 맞벌이도 생활비를 함께 보면 빠듯한 구간입니다.",
  },
  {
    id: "loan15",
    label: "대출 15억",
    loanAmount: 1_500_000_000,
    interestRate: DT20_INTEREST_RATE,
    termYears: DT20_TERM_YEARS,
    monthlyPayment: calculateMonthlyPayment(1_500_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS),
    annualPayment: calculateMonthlyPayment(1_500_000_000, DT20_INTEREST_RATE, DT20_TERM_YEARS) * 12,
    description: "실수령 1,200만 원 이상도 금리 변화에 민감한 공격적 구간입니다.",
  },
];

export const DT20_PURCHASE_COSTS: PurchaseCostResult[] = [
  calculatePurchaseCost("loan10", "대출 10억", 1_000_000_000, "자기자금 부담은 크지만 월 상환 리스크는 낮아집니다."),
  calculatePurchaseCost("loan12", "대출 12억", 1_200_000_000, "20억 주택 검토 시 가장 현실적으로 비교해볼 중간 시나리오입니다."),
  calculatePurchaseCost("loan15", "대출 15억", 1_500_000_000, "실제 가능 여부와 별개로 월 현금흐름 압박을 보기 위한 공격적 시나리오입니다."),
];

export function getAffordabilityLevel(housingRatio: number): AffordabilityLevel {
  if (housingRatio <= 0.35) return "stable";
  if (housingRatio <= 0.5) return "tight";
  if (housingRatio <= 0.65) return "risk";
  return "danger";
}

export function getAffordabilityLabel(level: AffordabilityLevel): string {
  const labels: Record<AffordabilityLevel, string> = {
    stable: "상대적으로 안정",
    tight: "빠듯",
    risk: "위험",
    danger: "매우 위험",
  };
  return labels[level];
}

export function buildAffordabilityComment(level: AffordabilityLevel, remainingCash: number): string {
  if (level === "stable") return "생활비와 저축 여력이 일부 남는 구간입니다.";
  if (level === "tight") return "자녀·차량·교육비가 있으면 체감 부담이 커집니다.";
  if (level === "risk") return "금리 상승이나 소득 감소에 취약한 구간입니다.";
  return remainingCash < 0 ? "생활비 차감 후 현금흐름이 마이너스가 될 수 있습니다." : "주거비 비중이 과도해 방어적 판단이 필요합니다.";
}

export function buildAffordabilityMatrix(): AffordabilityCell[] {
  return DT20_INCOME_SCENARIOS.flatMap((income) =>
    DT20_LOAN_SCENARIOS.map((loan) => {
      const housingRatio = loan.monthlyPayment / income.monthlyNetIncome;
      const remainingCash = income.monthlyNetIncome - loan.monthlyPayment - income.livingCost;
      const level = getAffordabilityLevel(housingRatio);

      return {
        incomeId: income.id,
        loanId: loan.id,
        monthlyPayment: loan.monthlyPayment,
        housingRatio,
        remainingCash,
        level,
        label: getAffordabilityLabel(level),
        comment: buildAffordabilityComment(level, remainingCash),
      };
    }),
  );
}

export const DT20_AFFORDABILITY_MATRIX = buildAffordabilityMatrix();

export const DT20_PRICE_DRIVERS: PriceDriver[] = [
  {
    id: "gtx-a",
    title: "GTX-A 효과",
    summary: "서울 접근성 개선 기대가 역세권 단지 선호를 키웁니다.",
    upside: "출퇴근 시간이 줄어드는 지역은 실거주 수요가 붙기 쉽습니다.",
    caution: "개통 기대가 이미 가격에 선반영됐을 가능성은 확인해야 합니다.",
  },
  {
    id: "samsung-semiconductor",
    title: "삼성전자·반도체 배후 수요",
    summary: "고소득 직장인과 반도체 산업 배후 수요가 가격을 지지합니다.",
    upside: "직주근접 수요가 꾸준하면 하방을 일부 방어할 수 있습니다.",
    caution: "반도체 경기와 고용 기대가 과하게 반영될 수 있습니다.",
  },
  {
    id: "new-town-product",
    title: "신축·대단지 상품성",
    summary: "커뮤니티, 주차, 학군, 생활 인프라가 구축 지역과 차별화됩니다.",
    upside: "같은 가격대에서도 신축 선호가 강하게 작동할 수 있습니다.",
    caution: "동탄 내에서도 단지별 격차가 커 평균으로 보면 안 됩니다.",
  },
  {
    id: "listing-drop",
    title: "매물 감소",
    summary: "매물이 줄면 단기적으로 호가가 빠르게 올라갈 수 있습니다.",
    upside: "수요가 유지되는 동안에는 가격 상승 압력이 생깁니다.",
    caution: "거래량이 줄면 호가와 실거래가 괴리가 커질 수 있습니다.",
  },
  {
    id: "price-catch-up",
    title: "광교·분당과의 가격 키 맞추기 기대",
    summary: "동탄이 저평가였다는 심리가 가격 상승을 자극할 수 있습니다.",
    upside: "비슷한 생활권 수요가 비교 매수로 들어올 수 있습니다.",
    caution: "가격 차가 줄수록 안전마진은 낮아집니다.",
  },
];

export const DT20_REGION_COMPARE: RegionCompareItem[] = [
  {
    id: "dongtan",
    name: "동탄",
    pricePosition: "84㎡ 20억 상단 진입",
    strengths: ["GTX-A", "반도체 배후 수요", "신축 대단지"],
    risks: ["단기 급등", "서울 핵심지 대비 거리", "단지별 격차"],
    note: "실거주 효용이 큰 가구와 투자 기대만 보는 가구의 판단이 갈립니다.",
  },
  {
    id: "gwanggyo",
    name: "광교",
    pricePosition: "기존 수도권 고가 주거지",
    strengths: ["업무·상권", "호수공원", "수원 고소득 수요"],
    risks: ["이미 높은 가격", "상급지 단지 쏠림"],
    note: "동탄 가격이 광교와 가까워질수록 입지 비교가 중요해집니다.",
  },
  {
    id: "yeongtong",
    name: "영통",
    pricePosition: "삼성전자 배후 구축·준신축 혼재",
    strengths: ["직주근접", "생활 인프라", "수원 접근성"],
    risks: ["구축 비중", "단지별 노후도 차이"],
    note: "직장 접근성은 강하지만 상품성은 단지별로 크게 갈립니다.",
  },
  {
    id: "bundang",
    name: "분당",
    pricePosition: "1기 신도시 대표 고가 지역",
    strengths: ["서울 접근성", "학군", "재건축 기대"],
    risks: ["노후도", "재건축 변수", "초기 투자금 부담"],
    note: "동탄 신축과 분당 재건축 기대는 성격이 다른 비교 대상입니다.",
  },
];

export const DT20_RISK_ITEMS = [
  "단기 급등 후 거래량이 줄면 가격 방어가 어려울 수 있습니다.",
  "매물 감소는 상승 요인이지만 호가와 실거래가 괴리를 키울 수 있습니다.",
  "GTX-A 효과가 이미 가격에 선반영됐을 수 있습니다.",
  "반도체 경기와 고소득 수요 기대가 과도하게 반영될 수 있습니다.",
  "금리 상승 또는 대출 규제 강화 시 실수요자의 매수 가능 금액이 줄어듭니다.",
  "20억 가격대는 취득세, 보유세, 이자비용 부담이 함께 커집니다.",
];

export const DT20_SOURCE_CHECKLIST = [
  {
    title: "국토부 실거래가로 단지와 층 확인",
    body: "20억대 거래가 실제로 어떤 단지, 어떤 층, 어떤 계약일에 찍혔는지 확인해야 합니다. 같은 84㎡라도 역 접근성, 동, 층, 조망, 연식에 따라 가격이 크게 갈립니다.",
  },
  {
    title: "호가와 실거래를 분리해서 보기",
    body: "매물이 줄어드는 구간에서는 호가가 먼저 뛰고 실거래가 뒤따라오는 경우가 있습니다. 검색자는 최신 호가보다 최근 3~6개월 실거래 분포를 먼저 봐야 합니다.",
  },
  {
    title: "거래량이 따라오는지 확인",
    body: "고가 한 건이 시장 전체 가격을 뜻하지는 않습니다. 20억 근처 거래가 반복되는지, 거래량이 유지되는지, 신고가 이후 같은 단지 후속 거래가 있는지가 중요합니다.",
  },
  {
    title: "대출 가능액보다 월 현금흐름 먼저 보기",
    body: "은행에서 대출이 가능하다는 것과 가계가 편하게 버틸 수 있다는 것은 다릅니다. 원리금, 관리비, 보유세, 교육비를 같이 넣어야 실거주 가능성이 보입니다.",
  },
];

export const DT20_BUYER_GUIDE_STEPS = [
  {
    step: "1",
    title: "내 현금으로 계약이 가능한지",
    body: "계약금, 중도금, 잔금, 취득세, 중개보수, 등기비, 이사비를 모두 더해도 비상금이 남는지 확인합니다.",
  },
  {
    step: "2",
    title: "대출 10억 이하로 통제되는지",
    body: "20억 주택에서 대출이 12억을 넘기면 실수령 1,000만 원대 가구도 주거비 부담률이 빠르게 높아집니다.",
  },
  {
    step: "3",
    title: "생활권 프리미엄이 실제로 필요한지",
    body: "직장, 학교, 돌봄, 부모님 거주지, 차량 이동 동선이 동탄에 고정돼 있다면 단순 투자자보다 실거주 효용이 큽니다.",
  },
  {
    step: "4",
    title: "신고가가 아니라 반복 거래인지",
    body: "단발성 신고가보다 비슷한 가격대의 반복 실거래가 더 중요합니다. 같은 단지와 인접 단지의 후속 거래를 같이 봐야 합니다.",
  },
];

export const DT20_LOAN_STRESS_SCENARIOS = [
  {
    label: "금리 3.8%",
    rate: 0.038,
    loan12Monthly: calculateMonthlyPayment(1_200_000_000, 0.038, DT20_TERM_YEARS),
    note: "금리가 내려간 낙관 시나리오입니다. 그래도 대출 12억은 월 원리금이 상당합니다.",
  },
  {
    label: "금리 4.2%",
    rate: 0.042,
    loan12Monthly: calculateMonthlyPayment(1_200_000_000, 0.042, DT20_TERM_YEARS),
    note: "본문의 기본 시나리오입니다. 실수령 1,000만 원 가구에는 빠듯한 기준입니다.",
  },
  {
    label: "금리 4.8%",
    rate: 0.048,
    loan12Monthly: calculateMonthlyPayment(1_200_000_000, 0.048, DT20_TERM_YEARS),
    note: "금리 스트레스 시나리오입니다. 생활비 후 남는 금액이 크게 줄어듭니다.",
  },
];

export const DT20_LONGTAIL_SECTIONS = [
  {
    title: "동탄 84㎡ 20억은 평균이 아니라 상단 가격입니다",
    body: "동탄 아파트 20억이라는 키워드는 강하지만, 실제 해석은 더 조심해야 합니다. 84㎡ 20억대 거래는 동탄 내에서도 역 접근성, 신축 상품성, 학군, 브랜드, 대단지 여부가 좋은 일부 단지의 상단 가격일 가능성이 큽니다. 따라서 검색자가 확인해야 할 것은 동탄 전체 평균이 아니라 같은 단지의 직전 거래, 인접 단지의 후속 거래, 그리고 호가와 실거래의 차이입니다.",
  },
  {
    title: "월급 기준으로는 대출금이 결론을 가릅니다",
    body: "20억 아파트를 살 수 있느냐는 연봉보다 대출금과 현금흐름이 좌우합니다. 현금 10억을 넣고 대출을 10억으로 줄이면 고소득 맞벌이는 검토할 수 있지만, 대출이 12억~15억으로 올라가면 실수령 1,000만 원대 가구도 생활비와 저축 여력이 빠르게 줄어듭니다.",
  },
  {
    title: "GTX-A와 반도체 호재는 장점이지만 가격 선반영도 봐야 합니다",
    body: "GTX-A, 삼성전자, 반도체 배후 수요는 동탄의 강한 수요 논리입니다. 다만 좋은 호재일수록 가격에 먼저 반영되는 경우가 많습니다. 실거주자는 호재보다 월 원리금과 생활권 효용을 먼저 보고, 투자자는 거래량과 매물 흐름이 뒤따르는지 확인해야 합니다.",
  },
];

export const DT20_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/dongtan-hot-apartment-ranking-2026/",
    title: "동탄 신고가 아파트 TOP8 추적",
    description: "한 달 만에 1억 4천 오른 단지부터 양극화 사례까지 신고가 순위로 확인합니다.",
    tone: "primary",
  },
  {
    href: "/tools/income-home-affordability/",
    title: "우리 소득으로 집 살 수 있을까?",
    description: "연소득과 대출 조건을 넣어 구매 가능한 주택 가격을 계산합니다.",
    tone: "default",
  },
  {
    href: "/tools/loan-refinancing-calculator/",
    title: "주담대 월 상환액 계산하기",
    description: "대출금, 금리, 상환기간별 월 원리금을 직접 비교합니다.",
    tone: "default",
  },
  {
    href: "/tools/apartment-holding-tax/",
    title: "20억 아파트 보유세 확인",
    description: "재산세와 종부세 부담을 시뮬레이션합니다.",
    tone: "default",
  },
];

export const DT20_FAQ: FaqItem[] = [
  {
    question: "동탄 84㎡ 20억은 동탄 전체 평균 가격인가요?",
    answer:
      "아닙니다. 20억대 실거래는 동탄 내에서도 입지, 연식, 역 접근성, 브랜드, 단지 규모가 좋은 상단 가격으로 봐야 합니다. 전체 동탄 평균으로 일반화하면 위험합니다.",
  },
  {
    question: "20억 아파트를 사려면 현금이 얼마 필요할까요?",
    answer:
      "대출금에 따라 다릅니다. 대출 10억이면 순수 자기자금만 10억이 필요하고, 여기에 취득세, 중개보수, 등기비, 이사비가 더해집니다. 대출 12억이라도 부대비용을 포함하면 8억 원 이상 현금이 필요할 수 있습니다.",
  },
  {
    question: "부부 실수령 1,000만 원이면 동탄 20억 아파트가 가능한가요?",
    answer:
      "대출 규모에 따라 다릅니다. 대출 10억 이하라면 검토 가능성이 있지만, 대출 12억 이상이면 월 원리금 부담이 커져 생활비와 저축 여력이 크게 줄 수 있습니다.",
  },
  {
    question: "동탄이 광교나 분당보다 비싸질 수 있나요?",
    answer:
      "일부 단지는 광교·분당과 비교되는 가격대에 진입할 수 있습니다. 다만 서울 접근성, 학군, 신축 여부, 직주근접 수요가 다르기 때문에 단순히 가격만으로 우열을 판단하기는 어렵습니다.",
  },
  {
    question: "지금 동탄은 과열인가요?",
    answer:
      "단기 상승률, 매물 감소, 호재 기대가 동시에 겹친 구간이라 과열 리스크를 점검해야 합니다. 실거주자는 월 상환액을, 투자자는 거래량과 호가·실거래 괴리를 함께 봐야 합니다.",
  },
];

export const DT20_SEO_INTRO = [
  "동탄 20억 가격은 더 이상 뉴스에서만 보는 숫자가 아니지만, 실거주자가 감당할 수 있는 가격인지는 별개의 문제입니다. 매매가 20억 원을 기준으로 필요한 현금과 월 원리금을 나눠 보면 부담의 크기가 훨씬 선명해집니다.",
  "이 리포트는 보도 수치와 공개 실거래 확인이 필요한 값을 구분하고, 대출 10억·12억·15억 시나리오와 부부 실수령별 현금흐름을 함께 비교합니다.",
];

export const DT20_SEO_BULLETS = [
  "20억 아파트 매수에는 매매가와 대출 차액 외에도 취득세, 중개보수, 등기·이사 비용이 필요합니다.",
  "월 원리금은 대출금, 금리, 상환기간에 따라 달라지며 이 리포트는 연 4.2%, 40년 원리금 균등을 기본값으로 둡니다.",
  "부부 실수령 1,000만 원이라도 대출 12억 이상이면 생활비와 저축 여력이 크게 줄 수 있습니다.",
  "GTX-A, 삼성전자, 반도체, 매물 감소는 상승 요인이지만 단기 과열과 선반영 리스크도 함께 봐야 합니다.",
];

export const DT20_SEO_DETAIL_INTRO = [
  "동탄 20억 가격은 더 이상 뉴스에서만 보는 숫자가 아니지만, 실거주자가 감당할 수 있는 가격인지는 별개의 문제입니다. 같은 20억 원이라도 보유 현금, 대출 규모, 금리, 자녀 교육비, 차량 유지비, 기존 주택 보유 여부에 따라 체감 부담은 완전히 달라집니다.",
  "이 리포트는 84㎡ 고가 실거래 보도 수치를 출발점으로 삼되, 동탄 전체 평균처럼 단정하지 않습니다. 보도 기반 수치, 공개 실거래 확인이 필요한 값, 단순 시뮬레이션 값을 구분해 검색에서 바로 들어온 사용자도 숫자의 성격을 먼저 이해할 수 있게 구성했습니다.",
  "핵심은 매매가 20억 원 자체보다 대출을 얼마까지 줄일 수 있느냐입니다. 대출 10억 원이면 자기자금 부담은 커지지만 월 원리금은 상대적으로 관리 가능하고, 대출 12억 원부터는 부부 실수령 1,000만 원 가구도 생활비와 금리 변동을 함께 봐야 합니다.",
  "따라서 이 페이지는 단순히 '동탄이 비싼가'를 묻는 글이 아니라, 20억 아파트를 실제로 사려면 현금이 얼마나 필요하고 월급으로 버틸 수 있는지 확인하는 실거주 판단용 리포트입니다. 필요 현금, 월 원리금, 소득별 부담률, 지역 비교, 단기 과열 리스크를 한 흐름으로 읽으면 됩니다.",
  "검색 의도가 투자 판단에 가깝다면 GTX-A, 삼성전자·반도체 배후 수요, 매물 감소 같은 상승 요인을 먼저 보고, 실거주 판단에 가깝다면 대출 부담과 소득별 가능성 표를 먼저 보는 것이 좋습니다. 마지막에는 관련 계산기로 본인 조건을 다시 넣어 실제 감당 가능 가격을 확인할 수 있습니다.",
];

export const DT20_SEO_ACTION_POINTS = [
  "20억 원 매수가에서 대출을 10억·12억·15억으로 나눴을 때 필요한 현금과 월 원리금을 비교할 수 있습니다.",
  "부부 실수령 800만·1,000만·1,200만 원 기준으로 주거비 부담률과 생활비 차감 후 남는 금액을 확인할 수 있습니다.",
  "동탄 84㎡ 20억 실거래가 평균 가격인지, 특정 단지·층·브랜드 프리미엄이 반영된 상단 가격인지 구분해서 해석할 수 있습니다.",
  "GTX-A, 삼성전자·반도체 배후 수요, 매물 감소, 광교·영통·분당 비교처럼 가격 상승을 설명하는 요인과 리스크를 함께 볼 수 있습니다.",
];

export const DT20_SEO_CRITERIA = [
  "기본 매매가는 20억 원으로 두고, 보도에서 언급된 20억8,000만 원 수준의 고가 실거래는 별도 참고 수치로 구분했습니다.",
  "대출 원리금은 연 4.2%, 40년 원리금 균등 상환을 기본 시나리오로 계산했습니다. 실제 금리는 은행, DSR, 상환 방식, 우대 조건에 따라 달라질 수 있습니다.",
  "필요 현금에는 자기자금뿐 아니라 취득세, 중개보수, 등기·이사 예비비를 포함했습니다. 생애최초, 다주택 여부, 규제지역 여부에 따라 실제 세금은 달라질 수 있습니다.",
  "소득별 가능성은 월 원리금을 부부 월 실수령액으로 나눈 주거비 부담률을 기준으로 해석했습니다. 교육비, 차량비, 부모 부양, 기존 대출이 있으면 실제 여력은 더 낮아질 수 있습니다.",
  "지역 비교는 가격 서열을 단정하기보다 생활권, 직주근접, 신축성, 교통 개선 기대, 재건축 기대처럼 서로 다른 프리미엄 요인을 비교하는 용도입니다.",
];

export function formatKrw(value: number): string {
  const abs = Math.abs(Math.round(value));
  const sign = value < 0 ? "-" : "";
  if (abs >= 100000000) {
    const eok = abs / 100000000;
    return `${sign}${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억 원`;
  }
  return `${sign}${Math.round(abs / 10000).toLocaleString("ko-KR")}만 원`;
}

export function formatMonthlyKrw(value: number): string {
  return `월 약 ${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
