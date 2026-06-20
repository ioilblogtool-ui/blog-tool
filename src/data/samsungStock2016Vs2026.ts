export interface SamsungStockYearPoint {
  year: number;
  priceKrw: number;
  note: string;
}

export interface SamsungStockFaqItem {
  question: string;
  answer: string;
}

export const samsungStock2016Vs2026 = {
  meta: {
    slug: "samsung-electronics-stock-2016-vs-2026",
    title: "삼성전자 2016년에 샀다면? 2026년까지 10년 수익률 비교",
    description:
      "삼성전자 주식을 2016년 6월에 샀다면 2026년 6월 현재 얼마가 됐는지 액면분할 보정 주가, 투자금, 배당, 연도별 수익률 기준으로 비교합니다.",
    updatedAt: "2026-06-20",
    methodology:
      "삼성전자 보통주 005930의 2016년 6월 가격은 2018년 50:1 액면분할을 반영해 현재 주식 수 기준으로 환산했습니다. 2026년 6월 가격은 2026년 6월 중순 공개 보도 기준 종가를 대표값으로 사용했습니다.",
    caution:
      "이 리포트는 투자 권유가 아니라 과거 수익률 비교 콘텐츠입니다. 배당, 세금, 거래 수수료, 매수·매도 시점, 재투자 여부에 따라 실제 수익률은 달라집니다.",
  },
  sourceLinks: [
    {
      label: "Samsung Electronics Investor Relations",
      href: "https://www.samsung.com/global/ir/",
      description: "삼성전자 공식 IR 사이트입니다. 실적, 배당, 공시, 주주환원 관련 자료를 확인할 수 있습니다.",
    },
    {
      label: "MarketWatch / Dow Jones Market Data",
      href: "https://www.marketwatch.com/story/samsung-one-of-the-worlds-hottest-stocks-is-hit-by-insider-trading-probe-026a6227",
      description: "2026년 6월 중순 삼성전자 보통주 종가와 2026년 주가 상승 흐름을 확인한 보도 자료입니다.",
    },
    {
      label: "Samsung Electronics profile",
      href: "https://en.wikipedia.org/wiki/Samsung_Electronics",
      description: "2016~2025년 매출과 순이익 흐름, 반도체 사업 배경을 교차 확인한 공개 프로필입니다.",
    },
  ],
  baseCompare: {
    startLabel: "2016년 6월",
    endLabel: "2026년 6월",
    startPriceKrw: 28600,
    endPriceKrw: 299000,
    stockSplit: "2018년 50:1 액면분할 보정",
    estimatedDividendPerShare: 12900,
  },
  yearPoints: [
    { year: 2016, priceKrw: 28600, note: "갤럭시 노트7 리스크 전후, 액면분할 보정 기준" },
    { year: 2017, priceKrw: 47800, note: "메모리 반도체 슈퍼사이클과 실적 급증" },
    { year: 2018, priceKrw: 46650, note: "50:1 액면분할 이후 거래 단위가 낮아짐" },
    { year: 2019, priceKrw: 47000, note: "반도체 다운사이클로 박스권 흐름" },
    { year: 2020, priceKrw: 52900, note: "팬데믹 이후 유동성과 비대면 수요 기대" },
    { year: 2021, priceKrw: 81000, note: "동학개미 대표 종목, 개인 매수세 집중" },
    { year: 2022, priceKrw: 57000, note: "금리 인상, 메모리 업황 둔화, 성장주 조정" },
    { year: 2023, priceKrw: 71200, note: "감산 기대와 반도체 회복 사이클 선반영" },
    { year: 2024, priceKrw: 81600, note: "AI 반도체 기대와 메모리 업황 개선" },
    { year: 2025, priceKrw: 120000, note: "HBM·AI 메모리 기대가 주가 재평가로 연결" },
    { year: 2026, priceKrw: 299000, note: "AI 메모리 랠리 이후 6월 중순 보도 기준 종가" },
  ] satisfies SamsungStockYearPoint[],
  investmentCases: [
    { label: "100만원", amount: 1_000_000 },
    { label: "500만원", amount: 5_000_000 },
    { label: "1000만원", amount: 10_000_000 },
    { label: "1억원", amount: 100_000_000 },
  ],
  ctaLinks: [
    {
      href: "/reports/etf-vs-direct-stock-10year-2026/",
      label: "ETF vs 직접투자 10년 비교",
      description: "삼성전자 같은 개별주와 KODEX200·TIGER200 같은 ETF를 장기 수익률과 변동성 기준으로 비교합니다.",
    },
    {
      href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
      label: "비트코인·금·S&P500 10년 수익률 비교",
      description: "삼성전자만이 아니라 글로벌 주식, 금, 비트코인까지 10년 투자 성과를 한 번에 비교합니다.",
    },
    {
      href: "/tools/dca-investment-calculator/",
      label: "적립식 투자 계산기",
      description: "삼성전자를 한 번에 산 경우와 매달 나눠 산 경우의 차이를 직접 시뮬레이션할 수 있습니다.",
    },
    {
      href: "/reports/gold-price-2016-vs-2026/",
      label: "금값 2016년 6월 vs 2026년 6월 비교",
      description: "같은 10년 동안 한국인이 좋아하는 금은 얼마나 올랐는지 삼성전자와 비교해 볼 수 있습니다.",
    },
    {
      href: "/reports/salary-asset-2016-vs-2026/",
      label: "평균 연봉·자산 2016 vs 2026",
      description: "삼성전자 주가가 오른 동안 월급과 평균 자산은 얼마나 따라왔는지 함께 확인합니다.",
    },
  ],
  faq: [
    {
      question: "2016년에 삼성전자 주식을 샀다면 2026년에는 몇 배가 됐나요?",
      answer:
        "액면분할 보정 주가 기준으로 2016년 6월 약 2만 8,600원에서 2026년 6월 약 29만 9,000원으로 올라 주가만 약 10.5배가 됐습니다. 배당까지 단순 합산하면 체감 수익률은 더 높아집니다.",
    },
    {
      question: "2016년 삼성전자 주가를 왜 액면분할 보정으로 봐야 하나요?",
      answer:
        "삼성전자는 2018년에 50:1 액면분할을 했습니다. 과거 주가를 현재 주식 수 기준으로 나누어 보정해야 2016년 1주와 2026년 1주를 같은 단위로 비교할 수 있습니다.",
    },
    {
      question: "이 계산은 배당을 포함한 수익률인가요?",
      answer:
        "핵심 수익률은 주가 상승률 기준입니다. 별도로 2016년 매수 후 보유한 경우의 현금 배당 추정치를 더한 표를 제공하지만, 배당 재투자와 세금은 반영하지 않았습니다.",
    },
    {
      question: "삼성전자는 매년 꾸준히 올랐나요?",
      answer:
        "아닙니다. 2017년 급등, 2021년 개인 매수세, 2022년 조정, 2025~2026년 AI 메모리 랠리처럼 상승과 하락 구간이 뚜렷했습니다. 장기 수익률은 크지만 중간 변동성도 컸습니다.",
    },
    {
      question: "삼성전자와 ETF 중 무엇이 더 나은가요?",
      answer:
        "삼성전자는 특정 기업의 실적과 반도체 사이클에 크게 노출됩니다. ETF는 수익률이 낮을 수 있지만 종목 분산 효과가 있습니다. 장기 투자라면 개별주 집중 위험과 ETF 분산 효과를 함께 비교해야 합니다.",
    },
    {
      question: "지금 삼성전자를 사도 될까요?",
      answer:
        "이 리포트만으로 매수 여부를 결정하면 안 됩니다. 2026년 주가가 크게 오른 뒤에는 실적 기대, 밸류에이션, 반도체 사이클, 환율, 금리, 개인의 투자 기간을 함께 봐야 합니다.",
    },
  ] satisfies SamsungStockFaqItem[],
};

export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function formatManwon(value: number): string {
  const rounded = Math.round(value / 10000);
  if (rounded >= 10000) {
    const eok = Math.floor(rounded / 10000);
    const man = rounded % 10000;
    return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만원` : `${eok}억원`;
  }
  return `${rounded.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function calcCagr(start: number, end: number, years: number): number {
  return (end / start) ** (1 / years) - 1;
}

export function calcChangeRate(start: number, end: number): number {
  return (end / start - 1) * 100;
}
