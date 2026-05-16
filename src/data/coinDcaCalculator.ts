export interface CoinDcaPreset {
  id: string;
  label: string;
  summary: string;
  coinName: string;
  monthlyAmount: number;
  months: number;
  currentPrice: number;
  startPrice: number | null;
}

export interface CoinDcaStrategyCard {
  title: string;
  body: string[];
}

export interface CoinDcaLink {
  href: string;
  title: string;
  desc: string;
  badges: string[];
}

export interface CoinDcaFaq {
  question: string;
  answer: string;
}

export const CDCA_DEFAULT_INPUT = {
  coinName: "비트코인(BTC)",
  monthlyAmount: 100000,
  months: 24,
  currentPrice: 130000000,
  startPrice: 80000000,
};

export const CDCA_PRESETS: CoinDcaPreset[] = [
  {
    id: "btc-1y",
    label: "BTC 1년",
    summary: "월 10만원 · 12개월 · 9천만원→1.3억원",
    coinName: "비트코인(BTC)",
    monthlyAmount: 100000,
    months: 12,
    currentPrice: 130000000,
    startPrice: 90000000,
  },
  {
    id: "eth-2y",
    label: "ETH 2년",
    summary: "월 10만원 · 24개월 · 300만원→550만원",
    coinName: "이더리움(ETH)",
    monthlyAmount: 100000,
    months: 24,
    currentPrice: 5500000,
    startPrice: 3000000,
  },
  {
    id: "btc-5y",
    label: "BTC 5년 장기",
    summary: "월 20만원 · 60개월 · 5천만원→1.3억원",
    coinName: "비트코인(BTC)",
    monthlyAmount: 200000,
    months: 60,
    currentPrice: 130000000,
    startPrice: 50000000,
  },
];

export const CDCA_STRATEGY_CARDS: CoinDcaStrategyCard[] = [
  {
    title: "DCA란 무엇인가",
    body: [
      "정기적립식(Dollar Cost Averaging)은 가격과 무관하게 일정 금액을 정기적으로 투자하는 전략입니다.",
      "가격이 낮을 때 더 많이 사고 높을 때 적게 사서 장기적으로 평균 매수가를 낮추는 효과를 기대합니다.",
      "한 번에 큰 금액을 투자하는 일괄 매수와 달리 매수 시점 리스크를 분산합니다.",
    ],
  },
  {
    title: "장점과 한계",
    body: [
      "장점은 심리적 부담 감소, 타이밍 리스크 분산, 꾸준한 투자 습관 형성입니다.",
      "시장이 계속 오르는 구간에서는 일괄 매수보다 수익률이 낮을 수 있습니다.",
      "나눠 산다고 손실이 사라지는 것은 아니며, 가상자산 자체의 변동성은 그대로 남습니다.",
    ],
  },
  {
    title: "코인 DCA 활용 팁",
    body: [
      "월급날 직후 자동 적립처럼 규칙을 정하면 감정적 매매를 줄이는 데 도움이 됩니다.",
      "급락 구간 추가 적립은 평균 매수가를 낮출 수 있지만 손실 확대 리스크도 함께 커집니다.",
      "적립 기간이 길수록 DCA 효과를 확인하기 쉬워 최소 1~2년 이상의 시각이 필요합니다.",
    ],
  },
];

export const CDCA_NEXT_LINKS: CoinDcaLink[] = [
  {
    href: "/tools/coin-tax-calculator/",
    title: "코인 세금 계산기",
    desc: "수익이 났을 때 양도차익, 250만원 공제, 예상 세후 금액을 계산합니다.",
    badges: ["세금", "가상자산"],
  },
  {
    href: "/tools/dca-investment-calculator/",
    title: "적립식 투자 수익 비교 계산기",
    desc: "S&P500, 나스닥, 개별 주식과 코인 DCA 감각을 함께 비교해 볼 수 있습니다.",
    badges: ["주식", "DCA"],
  },
  {
    href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
    title: "비트코인·금·S&P500 10년 비교",
    desc: "장기 자산별 수익률과 변동성 차이를 리포트로 확인합니다.",
    badges: ["비트코인", "장기 비교"],
  },
];

export const CDCA_RELATED_LINKS = [
  { href: "/tools/coin-tax-calculator/", label: "코인 세금 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인·금·S&P500 10년 비교" },
  { href: "/tools/stock-breakeven-calculator/", label: "주식·코인 손익분기점 계산기" },
  { href: "/tools/us-stock-exchange-profit-calculator/", label: "미국주식 환차손익 계산기" },
];

export const CDCA_FAQ: CoinDcaFaq[] = [
  {
    question: "DCA가 코인 투자에 효과적인 이유는 무엇인가요?",
    answer: "코인 시장은 단기 가격 변동성이 커서 저점과 고점을 맞추기 어렵습니다. DCA는 가격 예측 없이 꾸준히 매수해 타이밍 리스크를 분산합니다. 가격이 내릴 때 더 많은 수량을 매수하므로 장기적으로 평균 매수가가 낮아질 수 있습니다. 다만 가격이 장기간 하락하는 자산에서는 DCA로도 손실을 막을 수 없습니다.",
  },
  {
    question: "비트코인 DCA는 얼마를 얼마나 오래 해야 효과가 있나요?",
    answer: "적립 금액보다 기간과 지속성이 더 중요합니다. 최소 1년 이상, 가능하면 2~4년의 장기 시각을 가져야 DCA 효과를 보기 쉽습니다. 월 5만원이든 50만원이든 감당 가능한 금액으로 꾸준히 유지하는 것이 핵심입니다.",
  },
  {
    question: "코인 가격이 계속 오르면 DCA보다 한 번에 사는 게 낫지 않나요?",
    answer: "맞습니다. 가격이 꾸준히 오르는 구간에서는 처음에 한 번에 매수하는 일괄 매수가 수익률 측면에서 더 유리할 수 있습니다. DCA의 강점은 하락장이나 횡보장에서 매수 시점을 나눠 리스크를 줄이는 데 있습니다.",
  },
  {
    question: "평균 매수가가 현재가보다 높으면 어떻게 해석하나요?",
    answer: "현재 손실 구간이라는 뜻입니다. 추가 적립으로 평균 매수가를 낮추거나, 손실을 감수하고 매도하거나, 장기 회복을 기다리는 선택지가 있습니다. 어느 선택이 맞는지는 자산의 장기 전망과 본인의 투자 목적에 따라 달라지며, 이 계산기는 특정 선택을 권유하지 않습니다.",
  },
  {
    question: "거래 수수료는 계산에 포함되나요?",
    answer: "이 계산기는 수수료를 포함하지 않습니다. 거래소 수수료가 매달 적용되면 실제 매수 수량은 계산값보다 소폭 줄어듭니다. 장기 적립에서는 수수료 차이도 누적되므로 실제 투자 전 거래소 수수료를 함께 확인해야 합니다.",
  },
  {
    question: "코인 DCA 수익에 세금이 붙나요?",
    answer: "가상자산 과세는 적용 시점과 법령 개정에 따라 달라질 수 있습니다. 과세가 적용되는 경우 양도차익, 기본공제, 필요경비 인정 범위에 따라 세후 수익이 달라집니다. 이 계산기의 수익률은 세금 전 수치입니다.",
  },
  {
    question: "이더리움 같은 알트코인에도 DCA가 효과적인가요?",
    answer: "원칙은 동일하지만 알트코인은 비트코인보다 변동성과 프로젝트 리스크가 클 수 있습니다. 장기 DCA는 시가총액이 크고 오랜 기간 검증된 자산일수록 상대적으로 해석하기 쉽습니다.",
  },
  {
    question: "DCA를 시작하기에 좋은 시점이 따로 있나요?",
    answer: "DCA의 핵심은 매수 타이밍 예측을 줄이는 것입니다. 다만 급등 직후보다 횡보나 하락 국면에서 시작하면 초기 평균 매수가 형성에 유리할 수 있습니다. 가장 중요한 것은 감당 가능한 금액과 기간을 정하고 규칙을 유지하는 것입니다.",
  },
];

