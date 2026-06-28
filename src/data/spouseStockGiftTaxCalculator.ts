export type StockGiftKind = "foreign_stock" | "domestic_stock" | "etf";
export type GiftDonor = "husband" | "wife";
export type HoldingPeriod = "under_1y" | "over_1y";

export interface GiftTaxBracket {
  limit: number | null;
  rate: number;
  deduction: number;
  label: string;
}

export const SSG_META = {
  slug: "spouse-stock-gift-tax-calculator",
  title: "부부간 주식 증여세 계산기",
  seoTitle: "부부간 주식 증여세 계산기: 배우자 6억원 공제와 해외주식 양도세 절세",
  description:
    "배우자에게 국내주식·해외주식·ETF를 증여할 때 10년 합산 6억원 공제, 예상 증여세, 해외주식 양도세 절세 효과와 1년 보유 규정을 함께 계산합니다.",
  updatedAt: "2026-06-28",
  caution:
    "이 계산기는 일반적인 부부간 주식 증여와 해외주식 양도세 비교를 위한 추정 도구입니다. 실제 증여재산 평가액, 취득가액, 환율, 수수료, 손익통산, 대주주 여부에 따라 결과가 달라질 수 있으므로 신고 전 세무 전문가와 확인하세요.",
};

export const SSG_SPOUSE_DEDUCTION_LIMIT = 600_000_000;
export const SSG_FOREIGN_STOCK_BASIC_DEDUCTION = 2_500_000;
export const SSG_FOREIGN_STOCK_TAX_RATE = 0.22;
export const SSG_SELF_REPORT_CREDIT_RATE = 0.03;

export const SSG_DEFAULTS = {
  stockKind: "foreign_stock" as StockGiftKind,
  donor: "husband" as GiftDonor,
  giftValue: 300_000_000,
  priorSpouseGiftAmount: 0,
  donorOriginalCost: 100_000_000,
  expectedSalePrice: 320_000_000,
  holdingPeriod: "over_1y" as HoldingPeriod,
  foreignStockBasicDeduction: SSG_FOREIGN_STOCK_BASIC_DEDUCTION,
  capitalGainTaxRate: SSG_FOREIGN_STOCK_TAX_RATE,
  applySelfReportCredit: true,
};

export const SSG_STOCK_KINDS = [
  { value: "foreign_stock", label: "해외주식", note: "연 250만원 공제 후 22% 가정" },
  { value: "domestic_stock", label: "국내주식", note: "대주주·장외거래 등 별도 확인" },
  { value: "etf", label: "ETF", note: "상장 지역과 과세 유형별 차이 주의" },
];

export const SSG_DONORS = [
  { value: "husband", label: "남편 → 아내" },
  { value: "wife", label: "아내 → 남편" },
];

export const SSG_HOLDING_PERIODS = [
  { value: "under_1y", label: "1년 이내 매도", note: "취득가액 이월 경고" },
  { value: "over_1y", label: "1년 이후 매도", note: "증여 당시 평가액 활용 가능성" },
];

export const SSG_QUICK_AMOUNTS = [
  { label: "1억", value: 100_000_000 },
  { label: "3억", value: 300_000_000 },
  { label: "5억", value: 500_000_000 },
  { label: "6억", value: 600_000_000 },
  { label: "8억", value: 800_000_000 },
];

export const SSG_GIFT_TAX_BRACKETS: GiftTaxBracket[] = [
  { limit: 100_000_000, rate: 0.1, deduction: 0, label: "1억 원 이하" },
  { limit: 500_000_000, rate: 0.2, deduction: 10_000_000, label: "1억 초과~5억 이하" },
  { limit: 1_000_000_000, rate: 0.3, deduction: 60_000_000, label: "5억 초과~10억 이하" },
  { limit: 3_000_000_000, rate: 0.4, deduction: 160_000_000, label: "10억 초과~30억 이하" },
  { limit: null, rate: 0.5, deduction: 460_000_000, label: "30억 초과" },
];

export const SSG_SCENARIOS = [
  {
    id: "foreign_gain_300m",
    label: "해외주식 3억 증여",
    description: "취득가 1억, 평가액 3억, 1년 후 3.2억 매도",
    input: {
      stockKind: "foreign_stock",
      giftValue: 300_000_000,
      priorSpouseGiftAmount: 0,
      donorOriginalCost: 100_000_000,
      expectedSalePrice: 320_000_000,
      holdingPeriod: "over_1y",
    },
  },
  {
    id: "under_one_year",
    label: "바로 매도 주의",
    description: "1년 이내 매도 시 취득가액 이슈 확인",
    input: {
      stockKind: "foreign_stock",
      giftValue: 300_000_000,
      priorSpouseGiftAmount: 0,
      donorOriginalCost: 100_000_000,
      expectedSalePrice: 320_000_000,
      holdingPeriod: "under_1y",
    },
  },
  {
    id: "deduction_over",
    label: "6억 초과 증여",
    description: "기증여 2억, 이번 5억으로 공제 초과",
    input: {
      stockKind: "foreign_stock",
      giftValue: 500_000_000,
      priorSpouseGiftAmount: 200_000_000,
      donorOriginalCost: 250_000_000,
      expectedSalePrice: 540_000_000,
      holdingPeriod: "over_1y",
    },
  },
];

export const SSG_GUIDE_CARDS = [
  {
    label: "증여세",
    title: "배우자 공제는 10년 합산 6억 원",
    description: "최근 10년간 배우자에게 받은 현금·부동산·주식 증여액을 합산해 공제 잔액을 계산합니다. 공제를 초과하는 금액에만 누진세율이 적용됩니다.",
  },
  {
    label: "양도세",
    title: "해외주식은 기본공제 250만 원 후 22% 가정",
    description: "증여 없이 직접 매도한 경우와 배우자가 증여받은 뒤 매도한 경우의 예상 양도세를 비교해 절세 효과를 가늠해볼 수 있습니다.",
  },
  {
    label: "주의",
    title: "2025년 이후 증여분은 1년 이내 매도 주의",
    description: "배우자에게 증여받은 주식을 1년 이내 양도하면 증여자의 원래 취득가액이 적용될 수 있어, 절세 효과가 사라지고 오히려 세부담이 늘 수 있습니다.",
  },
  {
    label: "평가액",
    title: "증여일 평가액 산정 기준을 미리 확인하세요",
    description: "상장주식은 증여일 전후 2개월(총 4개월) 종가 평균으로 평가합니다. 해외주식은 평가 기준일의 환율도 함께 반영해야 합니다.",
  },
  {
    label: "신고",
    title: "세액이 0원이어도 신고를 검토하세요",
    description: "공제 한도 이내라 납부할 증여세가 없더라도, 증여 사실과 평가액·취득가액 증빙을 남겨두면 추후 매도 시 자금출처 소명과 양도세 계산에 유리합니다.",
  },
  {
    label: "구조",
    title: "국내주식·ETF는 과세 구조가 다릅니다",
    description: "해외주식은 양도세가 분리과세되지만, 국내 상장주식은 대주주 여부에 따라 과세 여부가 달라집니다. 종목 유형별로 별도 확인이 필요합니다.",
  },
];

export const SSG_FAQ = [
  {
    question: "부부간 주식 증여는 6억원까지 세금이 없나요?",
    answer:
      "배우자 간 증여는 10년 합산 6억원까지 증여재산공제를 적용할 수 있습니다. 다만 최근 10년간 현금, 부동산, 주식 등 배우자에게 받은 다른 증여가 있다면 함께 합산해야 합니다.",
  },
  {
    question: "해외주식도 배우자에게 증여할 수 있나요?",
    answer:
      "가능합니다. 다만 증여일 기준 평가액 산정, 환율, 증여세 신고, 이후 매도 시 양도소득세 계산이 함께 필요합니다.",
  },
  {
    question: "배우자에게 증여받은 주식을 바로 팔아도 되나요?",
    answer:
      "2025년 이후 증여분은 배우자 또는 직계존비속에게 증여받은 주식을 1년 이내 양도할 때 증여자의 원래 취득가액을 기준으로 양도차익이 계산될 수 있어 주의가 필요합니다.",
  },
  {
    question: "증여세가 0원이어도 신고해야 하나요?",
    answer:
      "세액이 없더라도 증여 사실, 취득가액, 자금 출처를 남기기 위해 신고를 검토하는 것이 좋습니다. 특히 이후 매도할 주식이라면 증여 당시 평가액 증빙이 중요합니다.",
  },
  {
    question: "국내주식과 해외주식 증여 계산은 다른가요?",
    answer:
      "증여세 공제 구조는 동일하지만, 매도 시 양도소득세 과세 구조가 다릅니다. 이 계산기는 해외주식 비교를 중심으로 설계했고 국내주식·ETF는 별도 확인 안내를 제공합니다.",
  },
  {
    question: "증여받은 주식의 취득가액은 얼마인가요?",
    answer:
      "원칙적으로 증여 당시 평가액을 취득가액으로 볼 수 있지만, 2025년 이후 증여분을 1년 이내 양도하면 증여자의 원래 취득가액이 적용될 수 있습니다.",
  },
];

export const SSG_RELATED_LINKS = [
  { label: "증여세 계산기", href: "/tools/gift-tax-calculator/" },
  { label: "해외주식 원화 수익률 계산기", href: "/tools/us-stock-exchange-profit-calculator/" },
  { label: "국내 주식 양도소득세 계산기", href: "/tools/domestic-stock-capital-gains-tax/" },
  { label: "ISA 계좌 절세 시뮬레이터", href: "/tools/isa-tax-calculator/" },
  { label: "증권사 수수료 계산기", href: "/tools/stock-brokerage-fee-calculator/" },
];

export const SSG_SOURCE_LINKS = [
  {
    label: "상속세 및 증여세법 제53조",
    href: "https://www.law.go.kr/법령/상속세및증여세법/제53조",
  },
  {
    label: "소득세법 제97조의2",
    href: "https://www.law.go.kr/법령/소득세법/제97조의2",
  },
  {
    label: "국세청 양도소득세 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7711&mi=2312",
  },
];
