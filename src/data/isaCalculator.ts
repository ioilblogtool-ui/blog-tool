export type IsaType = "general" | "seomin" | "farmer";
export type IsaProduct = "deposit" | "etf" | "stock";

export interface IsaTypeInfo {
  id: IsaType;
  label: string;
  taxFreeLimit: number;
  excessRate: number;
  eligibility: string;
  badge?: string;
}

export const ISA_TYPES: IsaTypeInfo[] = [
  {
    id: "general",
    label: "일반형",
    taxFreeLimit: 2_000_000,
    excessRate: 0.099,
    eligibility: "만 19세 이상 거주자 (직전 3년 금융소득종합과세자 제외)",
  },
  {
    id: "seomin",
    label: "서민형",
    taxFreeLimit: 4_000_000,
    excessRate: 0.099,
    eligibility: "총급여 5,000만원 이하 또는 종합소득 3,800만원 이하",
    badge: "추천",
  },
  {
    id: "farmer",
    label: "농어민형",
    taxFreeLimit: 4_000_000,
    excessRate: 0.099,
    eligibility: "농업인·어업인 (농어업경영체 등록 등 요건 충족)",
  },
];

export interface IsaProductInfo {
  id: IsaProduct;
  label: string;
  normalTaxRate: number;
  note: string;
}

export const ISA_PRODUCTS: IsaProductInfo[] = [
  {
    id: "deposit",
    label: "예금·채권",
    normalTaxRate: 0.154,
    note: "이자·배당소득세 15.4% (지방세 포함)",
  },
  {
    id: "etf",
    label: "ETF·펀드",
    normalTaxRate: 0.154,
    note: "배당소득세 15.4% 적용. 손익통산 효과 큼",
  },
  {
    id: "stock",
    label: "국내주식",
    normalTaxRate: 0.0,
    note: "국내주식 매매차익 비과세. 배당은 15.4%",
  },
];

export const ISA_META = {
  title: "ISA 계좌 절세 시뮬레이터 2026 — 일반형·서민형 비과세 혜택 계산 | 비교계산소",
  description:
    "ISA 계좌 절세 효과를 직접 계산해보세요. 투자 유형(일반형·서민형·농어민형), 연간 납입액, 수익률, 투자 기간을 입력하면 비과세 혜택·절세액·만기 수령액을 일반 계좌와 비교합니다.",
} as const;

export const ISA_LIMITS = {
  annualMax: 20_000_000,       // 연간 납입 한도
  totalMax: 100_000_000,       // 총 납입 한도 (미납이월 포함)
  minPeriod: 3,                // 의무 가입 기간
  maxPeriod: 10,               // 시뮬레이션 최대 기간
} as const;

export const ISA_FAQS = [
  {
    question: "ISA 계좌 비과세 한도 200만원(서민형 400만원)이란?",
    answer:
      "ISA 계좌에서 발생한 이자·배당·매매차익 등 수익을 모두 합산(손익통산)한 순이익에서 비과세 한도까지는 세금이 0원입니다. 한도 초과분은 9.9% 분리과세로 일반 15.4%보다 낮게 과세됩니다.",
  },
  {
    question: "손익통산이란 무엇인가요?",
    answer:
      "ISA 계좌 내 여러 상품의 수익과 손실을 합산해 순이익 기준으로 세금을 계산하는 방식입니다. 예를 들어 ETF에서 300만원 수익, 채권에서 100만원 손실이면 순이익 200만원에만 세금이 적용됩니다. 일반 계좌에서는 수익과 손실을 합산하지 않아 각각 과세됩니다.",
  },
  {
    question: "서민형 ISA 가입 자격은 어떻게 되나요?",
    answer:
      "직전 연도 총급여 5,000만원 이하 근로자 또는 종합소득금액 3,800만원 이하 사업자·기타소득자가 가입할 수 있습니다. 서민형은 비과세 한도가 400만원으로 일반형의 2배입니다.",
  },
  {
    question: "ISA 의무 가입 기간 3년이 지나면 어떻게 되나요?",
    answer:
      "3년이 지나면 언제든지 해지하고 비과세 혜택을 받을 수 있습니다. 3년 미만 해지 시 비과세·분리과세 혜택이 소멸되고 일반 세율이 적용됩니다. 만기 후 연금 계좌로 이전하면 추가 세액공제 혜택도 받을 수 있습니다.",
  },
  {
    question: "ISA 만기 후 연금계좌 전환하면 추가 혜택이 있나요?",
    answer:
      "ISA 만기 수령액을 연금저축·IRP로 이전하면 전환금액의 10%(최대 300만원)를 세액공제 받을 수 있습니다. 노후 대비와 절세를 동시에 노린다면 ISA → 연금계좌 전환 전략이 효과적입니다.",
  },
];

export const ISA_RELATED = [
  { href: "/tools/irp-pension-calculator/", label: "IRP 연금 계산기", desc: "ISA 만기 후 IRP 이전 시 추가 세액공제 계산" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급 계산기", desc: "ISA·IRP 공제 포함 연말정산 계산" },
  { href: "/tools/domestic-stock-capital-gains-tax/", label: "국내주식 양도세 계산기", desc: "ISA 외 계좌 주식 매매 세금 계산" },
  { href: "/tools/stock-brokerage-fee-calculator/", label: "증권사 수수료 계산기", desc: "ISA 개설할 증권사 수수료 비교" },
];
