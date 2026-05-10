export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
};

export type UsStockExchangePreset = {
  id: string;
  label: string;
  summary: string;
  buyExchangeRate: number;
  sellExchangeRate: number;
  buyPriceUsd: number;
  sellPriceUsd: number;
  quantity: number;
  includeFee: boolean;
  feeRate: number;
};

export const USEP_META = {
  slug: "us-stock-exchange-profit-calculator",
  title: "미국주식 환차손익 계산기",
  description:
    "미국주식 매수 환율과 매도 환율, 주가, 수량을 입력하면 달러 기준 수익률과 실제 원화 기준 수익률, 환차손익을 계산합니다.",
  updatedAt: "2026-05",
  caution:
    "계산 결과는 입력값 기준 참고용 추정치입니다. 실제 세금, 수수료, 환전 스프레드는 증권사와 신고 기준에 따라 달라질 수 있습니다.",
};

export const USEP_DEFAULT_INPUT = {
  buyExchangeRate: 1400,
  sellExchangeRate: 1200,
  buyPriceUsd: 200,
  sellPriceUsd: 260,
  quantity: 10,
  includeFee: false,
  feeRate: 0.07,
};

export const USEP_PRESETS: UsStockExchangePreset[] = [
  {
    id: "fx-loss",
    label: "주가는 올랐지만 환율 하락",
    summary: "주가 +30%, 환율 1,400원 → 1,200원",
    buyExchangeRate: 1400,
    sellExchangeRate: 1200,
    buyPriceUsd: 200,
    sellPriceUsd: 260,
    quantity: 10,
    includeFee: false,
    feeRate: 0.07,
  },
  {
    id: "fx-profit",
    label: "주가는 그대로, 환율 상승",
    summary: "주가 0%, 환율 1,200원 → 1,400원",
    buyExchangeRate: 1200,
    sellExchangeRate: 1400,
    buyPriceUsd: 100,
    sellPriceUsd: 100,
    quantity: 50,
    includeFee: false,
    feeRate: 0.07,
  },
  {
    id: "loss-cushion",
    label: "주가 하락을 환율이 완충",
    summary: "주가 -10%, 환율 1,200원 → 1,400원",
    buyExchangeRate: 1200,
    sellExchangeRate: 1400,
    buyPriceUsd: 100,
    sellPriceUsd: 90,
    quantity: 50,
    includeFee: true,
    feeRate: 0.07,
  },
];

export const USEP_FAQ: FaqItem[] = [
  {
    question: "미국주식 수익률은 달러 기준으로 봐야 하나요, 원화 기준으로 봐야 하나요?",
    answer:
      "둘 다 봐야 합니다. 주식 자체 성과는 달러 기준 수익률이고, 한국 투자자의 실제 체감 수익은 환율을 반영한 원화 기준 수익률입니다. 이 계산기는 두 수익률을 동시에 보여주고 환율이 얼마나 영향을 미쳤는지 분리해 계산합니다.",
  },
  {
    question: "주가는 올랐는데 원화 수익률이 낮아질 수 있나요?",
    answer:
      "네. 매수할 때 환율이 높고(예: 1,400원) 매도할 때 환율이 낮으면(예: 1,200원) 달러 수익을 원화로 바꾸는 과정에서 환차손이 발생해 원화 수익률이 크게 줄어들 수 있습니다. 반대로 주가가 제자리여도 환율이 오르면 원화 수익이 생깁니다.",
  },
  {
    question: "환차익에도 세금이 붙나요?",
    answer:
      "해외주식 양도차익 계산 과정에서 매수·매도 금액을 원화로 환산하므로 환율 영향이 세금 산정에 자동 반영됩니다. 연간 250만 원 공제 후 초과분에 22%가 부과됩니다. 정확한 신고 기준은 세무 전문가나 국세청 안내를 확인해야 합니다.",
  },
  {
    question: "배당금도 환율 영향을 받나요?",
    answer:
      "네. 미국주식 배당금은 달러로 지급되며 원화로 환산할 때 지급 시점 환율이 적용됩니다. 배당 시점 환율이 낮으면 원화 수령액이 줄어드는 환차손이 발생합니다. 이 계산기는 주식 매수·매도 손익만 다루며 배당금 계산은 별도입니다.",
  },
  {
    question: "수수료는 꼭 입력해야 하나요?",
    answer:
      "정확도를 높이려면 입력하는 편이 좋습니다. 증권사마다 해외주식 매매수수료(0.07~0.25% 수준)와 환전 스프레드가 다릅니다. 환율 영향만 빠르게 확인하고 싶다면 수수료 미포함으로 계산해도 됩니다.",
  },
  {
    question: "환전 스프레드는 어떻게 반영하나요?",
    answer:
      "증권사에서 환전할 때는 고시 환율에 스프레드(0.5~1% 수준)가 붙어 실제 적용 환율이 달라집니다. 이 계산기는 사용자가 입력한 환율을 그대로 적용하므로, 스프레드를 감안하려면 실제 체결 환율을 직접 입력하는 것이 정확합니다.",
  },
  {
    question: "달러 예수금 상태에서 매도하면 환산이 다른가요?",
    answer:
      "달러 예수금으로 보유 중이라면 원화 환전 시점의 환율이 적용됩니다. 이 계산기는 매도 시점에 원화로 환전하는 것을 기준으로 계산하므로, 달러 예수금 유지 후 별도 환전하는 경우 실제 환전 환율을 매도 환율란에 입력하면 됩니다.",
  },
  {
    question: "장기 보유하면 환율 리스크가 줄어드나요?",
    answer:
      "단기적으로는 환율이 크게 흔들리지만, 장기 보유(5~10년)에서는 주가 상승이 환율 변동을 상쇄하는 경향이 있습니다. 다만 이는 과거 패턴으로 미래를 보장하지 않습니다. '환율 시뮬레이션' 기능으로 매도 환율별 수익률 변화를 확인해 보세요.",
  },
];

export const USEP_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/us-stock-korean-real-return-2026/", label: "미국주식 실수익률 리포트" },
  { href: "/reports/stock-brokerage-fee-comparison-2026/", label: "증권사 수수료·환전 비교" },
  { href: "/tools/stock-breakeven-calculator/", label: "주식 손익분기점 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
];

