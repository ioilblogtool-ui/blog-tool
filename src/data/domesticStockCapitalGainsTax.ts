export type AssetTradeType = "listed" | "otc" | "unlisted";
export type TaxMode = "effective" | "incomeTaxOnly";
export type HoldingPeriodType = "under1y" | "over1y";

export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  caution: string;
}

export interface TaxRules {
  taxYear: number;
  basicDeduction: number;
  generalRate: number;
  surchargeRate: number;
  shortTermRate: number;
  localTaxRate: number;
  majorShareholderThresholdWon: number;
  kficsRepealed: boolean;
}

export interface StockLotInput {
  id: string;
  assetName: string;
  tradeType: AssetTradeType;
  averageBuyPrice: number;
  sellPrice: number;
  quantity: number;
  buyFee: number;
  sellFee: number;
  extraCost: number;
  isMajorShareholder: boolean;
  holdingPeriod: HoldingPeriodType;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  lots: StockLotInput[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface SourceLink {
  href: string;
  label: string;
  source: string;
  title: string;
  desc: string;
}

export const DSCGT_META: CalculatorMeta = {
  slug: "domestic-stock-capital-gains-tax",
  title: "국내주식 양도소득세 계산기",
  description:
    "2026 기준 국내주식 양도소득세 체계로 대주주, 비상장주식, 장외거래의 예상 세액을 계산합니다.",
  updatedAt: "2026-04-18",
  caution:
    "금융투자소득세는 폐지되었고, 현재는 기존 주식 양도소득세 체계를 기준으로 계산하는 참고용 도구입니다.",
};

export const DSCGT_RULES: TaxRules = {
  taxYear: 2026,
  basicDeduction: 2_500_000,
  generalRate: 0.2,
  surchargeRate: 0.25,
  shortTermRate: 0.3,
  localTaxRate: 0.1,
  majorShareholderThresholdWon: 5_000_000_000,
  kficsRepealed: true,
};

export const DSCGT_DEFAULT_LOTS: StockLotInput[] = [
  {
    id: "lot-1",
    assetName: "삼성전자",
    tradeType: "listed",
    averageBuyPrice: 70_000,
    sellPrice: 82_000,
    quantity: 100,
    buyFee: 1_000,
    sellFee: 1_000,
    extraCost: 0,
    isMajorShareholder: false,
    holdingPeriod: "over1y",
  },
];

export const DSCGT_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "listed-small",
    label: "일반 상장주식",
    description: "국내 상장주식을 장내에서 거래하고 대주주가 아닌 기본 비과세 예시입니다.",
    lots: DSCGT_DEFAULT_LOTS,
  },
  {
    id: "major-shareholder",
    label: "대주주 상장주식",
    description: "대주주에 해당하는 상장주식 매도 예시로 양도차익과 세액 흐름을 봅니다.",
    lots: [
      {
        id: "lot-1",
        assetName: "보유종목 A",
        tradeType: "listed",
        averageBuyPrice: 30_000,
        sellPrice: 48_000,
        quantity: 25_000,
        buyFee: 150_000,
        sellFee: 150_000,
        extraCost: 0,
        isMajorShareholder: true,
        holdingPeriod: "over1y",
      },
    ],
  },
  {
    id: "loss-offset",
    label: "손익통산 예시",
    description: "비상장주식 이익과 손실을 함께 입력해 통산 후 과세표준을 확인합니다.",
    lots: [
      {
        id: "lot-1",
        assetName: "비상장 A",
        tradeType: "unlisted",
        averageBuyPrice: 10_000,
        sellPrice: 22_000,
        quantity: 2_000,
        buyFee: 30_000,
        sellFee: 30_000,
        extraCost: 0,
        isMajorShareholder: false,
        holdingPeriod: "over1y",
      },
      {
        id: "lot-2",
        assetName: "비상장 B",
        tradeType: "unlisted",
        averageBuyPrice: 18_000,
        sellPrice: 12_000,
        quantity: 1_500,
        buyFee: 20_000,
        sellFee: 20_000,
        extraCost: 0,
        isMajorShareholder: false,
        holdingPeriod: "over1y",
      },
    ],
  },
];

export const DSCGT_GUIDE_POINTS = [
  {
    title: "먼저 과세 대상 여부를 봅니다",
    desc: "국내 상장주식 장내거래는 대주주가 아니면 양도소득세를 0원으로 볼 수 있습니다. 50억원 미만이어도 지분율 기준 대주주라면 직접 체크가 필요합니다.",
  },
  {
    title: "손익통산은 과세대상 주식 기준입니다",
    desc: "장내 상장주식 소액주주 거래처럼 비과세로 보는 손익은 과세표준 계산에서 제외해 안내합니다.",
  },
  {
    title: "250만원 기본공제는 연간 한 번으로 봅니다",
    desc: "주식 양도소득 기본공제는 예정신고마다 반복 적용하는 값이 아니라 연간 기준으로 확인해야 합니다.",
  },
];

export const DSCGT_FAQ: FaqItem[] = [
  {
    question: "국내 상장주식을 팔면 항상 양도소득세가 나오나요?",
    answer:
      "아닙니다. 일반적으로 국내 상장주식을 증권시장 안에서 거래한 소액주주는 과세 대상이 아닐 수 있습니다. 다만 대주주에 해당하거나 증권시장 밖에서 거래하면 과세 대상이 될 수 있습니다.",
  },
  {
    question: "금융투자소득세가 폐지되면 국내주식 세금이 모두 없어졌나요?",
    answer:
      "그렇지 않습니다. 금융투자소득세는 폐지되었지만 대주주 상장주식, 장외거래, 비상장주식 등에 적용되는 기존 양도소득세 체계는 유지되는 흐름입니다.",
  },
  {
    question: "기본공제 250만원은 어떻게 반영하나요?",
    answer:
      "이 계산기는 과세대상 주식 손익을 통산한 뒤 양도소득 기본공제 250만원을 한 번 차감합니다. 실제 신고에서는 국내·국외 주식 합산 여부와 신고 구분을 함께 확인해야 합니다.",
  },
  {
    question: "대주주 기준은 얼마인가요?",
    answer:
      "국세청 안내 기준으로 2024년 1월 1일 이후 양도분은 코스피 1% 또는 50억원, 코스닥 2% 또는 50억원, 코넥스 4% 또는 50억원 등이 핵심 기준입니다. 비상장주식은 별도 기준이 있으므로 실제 보유 지분율과 시가총액을 확인해야 합니다.",
  },
  {
    question: "이 계산 결과를 신고 세액으로 그대로 써도 되나요?",
    answer:
      "아닙니다. 이 도구는 예상 세액을 빠르게 가늠하는 참고용 계산기입니다. 실제 신고 세액은 중소기업 여부, 대주주 판정일, 보유 기간, 필요경비 인정 범위, 국내·국외 주식 손익통산 등에 따라 달라질 수 있습니다.",
  },
];

export const DSCGT_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/coin-tax-calculator/", label: "코인 세금 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 계산기" },
  { href: "/tools/fire-calculator/", label: "파이어 계산기" },
  { href: "/reports/korea-rich-top10-assets/", label: "한국 부자 TOP10 자산 비교" },
];

export const DSCGT_SOURCE_LINKS: SourceLink[] = [
  {
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=8800&mi=12274",
    label: "국세청 주식등 양도소득세 세액계산요령",
    source: "국세청",
    title: "주식등 양도소득세 과세대상과 대주주 요건",
    desc: "상장주식 대주주, 소액주주 장외거래, 비상장주식 과세대상과 대주주 요건을 확인할 수 있습니다.",
  },
  {
    href: "https://mob.tbht.hometax.go.kr/jsonAction.do?actionId=UTBRNAAE10F001&rtnClCd=03&rtnClDetailCd=01",
    label: "홈택스 주식 양도소득세 신고 안내",
    source: "홈택스",
    title: "국내주식 양도소득 세율과 기본공제 안내",
    desc: "국내주식 세율, 과세대상 주식 손익통산, 연 250만원 기본공제 안내를 함께 확인할 수 있습니다.",
  },
  {
    href: "https://moleg.go.kr/lawinfo/makingInfo.mo?lawCd=0&lawSeq=81078&lawType=TYPE5&mid=a10104010000",
    label: "법제처 소득세법 시행령 입법예고",
    source: "법제처",
    title: "금융투자소득세 폐지와 현행 양도소득세 체계 유지",
    desc: "금융투자소득세 폐지와 주식 등에 대한 현행 양도소득세 체계 유지 취지를 확인할 수 있습니다.",
  },
];
