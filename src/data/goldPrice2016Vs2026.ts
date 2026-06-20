export interface GoldYearPoint {
  year: number;
  priceUsdOz: number;
  usdKrw: number;
  note: string;
}

export interface GoldFaqItem {
  question: string;
  answer: string;
}

const TROY_OUNCE_GRAM = 31.1034768;
const DON_GRAM = 3.75;

export const goldPrice2016Vs2026 = {
  meta: {
    slug: "gold-price-2016-vs-2026",
    title: "금값 2016년 6월 vs 2026년 6월 비교｜10년 수익률·1돈 가격·연평균 상승률",
    description:
      "2016년 6월과 2026년 6월 금값을 달러, 원화, 1g, 1돈, 투자금 기준으로 비교하고 매년 몇 퍼센트씩 올랐는지 정리한 금값 10년 리포트입니다.",
    updatedAt: "2026-06-20",
    methodology:
      "국제 금값은 트로이온스당 달러 가격을 기준으로 하고, 원화 환산은 해당 시점의 대표 원달러 환율을 적용했습니다. 국내 실물 금 매입가는 부가세, 세공비, 매입·매도 스프레드가 붙을 수 있어 원재료 환산가와 다릅니다.",
    caution:
      "이 리포트는 투자 권유가 아니라 과거 가격 비교용 콘텐츠입니다. 2026년 6월 20일은 토요일이므로 최신 국제 금값은 2026년 6월 16~19일 공개 가격을 참고한 대표값으로 표시했습니다.",
  },
  constants: {
    troyOunceGram: TROY_OUNCE_GRAM,
    donGram: DON_GRAM,
  },
  sourceLinks: [
    {
      label: "World Gold Council 금 가격 데이터",
      href: "https://www.gold.org/goldhub/data/gold-prices",
      description: "1978년 이후 금 가격 평균과 주요 통화 기준 데이터를 제공하는 금 가격 데이터 페이지입니다.",
    },
    {
      label: "LBMA Precious Metal Prices",
      href: "https://www.lbma.org.uk/prices-and-data/precious-metal-prices",
      description: "금·은·백금·팔라듐 가격과 벤치마크 정보를 확인할 수 있는 LBMA 가격 데이터 페이지입니다.",
    },
    {
      label: "Dow Jones Market Data / WSJ 2026년 6월 금 선물 정산가",
      href: "https://www.wsj.com/finance/commodities-futures/gold-edges-higher-extending-gains-after-u-s-iran-ceasefire-79496232",
      description: "2026년 6월 중순 Comex 금 정산가와 52주 고점·저점 정보를 확인한 기사입니다.",
    },
  ],
  baseCompare: {
    startLabel: "2016년 6월",
    endLabel: "2026년 6월",
    startUsdOz: 1290,
    endUsdOz: 4330.9,
    startUsdKrw: 1168,
    endUsdKrw: 1368,
  },
  yearPoints: [
    { year: 2016, priceUsdOz: 1290, usdKrw: 1168, note: "브렉시트 투표 전후 안전자산 선호" },
    { year: 2017, priceUsdOz: 1244, usdKrw: 1144, note: "달러 약세와 완만한 금 반등" },
    { year: 2018, priceUsdOz: 1252, usdKrw: 1108, note: "미국 금리 인상 부담" },
    { year: 2019, priceUsdOz: 1409, usdKrw: 1176, note: "무역분쟁과 금리 인하 기대" },
    { year: 2020, priceUsdOz: 1771, usdKrw: 1203, note: "팬데믹 충격과 유동성 확대" },
    { year: 2021, priceUsdOz: 1770, usdKrw: 1144, note: "백신 이후 위험자산 선호 회복" },
    { year: 2022, priceUsdOz: 1817, usdKrw: 1292, note: "인플레이션, 전쟁, 강달러" },
    { year: 2023, priceUsdOz: 1919, usdKrw: 1305, note: "긴축 막바지와 중앙은행 매입" },
    { year: 2024, priceUsdOz: 2327, usdKrw: 1376, note: "금리 인하 기대와 사상 최고가 경신" },
    { year: 2025, priceUsdOz: 3274, usdKrw: 1365, note: "중앙은행 수요와 달러 대체 자산 논리" },
    { year: 2026, priceUsdOz: 4331, usdKrw: 1368, note: "1월 고점 이후 조정, 여전히 고가권" },
  ] satisfies GoldYearPoint[],
  investmentCases: [
    { label: "100만원", amount: 1_000_000 },
    { label: "500만원", amount: 5_000_000 },
    { label: "1000만원", amount: 10_000_000 },
    { label: "1억원", amount: 100_000_000 },
  ],
  ctaLinks: [
    {
      href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
      label: "비트코인·금·S&P500 10년 수익률 비교",
      description: "금만 보면 아쉬울 때, 같은 10년 동안 비트코인과 미국 주식은 얼마나 달랐는지 비교합니다.",
    },
    {
      href: "/reports/seoul-housing-2016-vs-2026/",
      label: "서울 집값 2016 vs 2026",
      description: "금값 상승을 서울 집값 변화와 함께 보면 한국인의 체감 자산 격차가 더 선명해집니다.",
    },
    {
      href: "/reports/salary-asset-2016-vs-2026/",
      label: "평균 연봉·자산 2016 vs 2026",
      description: "금값은 올랐는데 월급과 자산은 얼마나 따라왔는지 같이 확인할 수 있습니다.",
    },
    {
      href: "/reports/etf-vs-direct-stock-10year-2026/",
      label: "ETF vs 직접투자 10년 비교",
      description: "실물 금 대신 ETF형 자산을 고민한다면 10년 투자 방식 차이를 이어서 볼 수 있습니다.",
    },
    {
      href: "/tools/dca-investment-calculator/",
      label: "적립식 투자 계산기",
      description: "한 번에 금을 산 경우가 아니라 매달 나눠 샀다면 결과가 어떻게 달라지는지 계산합니다.",
    },
  ],
  faq: [
    {
      question: "2016년 6월 금값과 2026년 6월 금값은 몇 배 차이인가요?",
      answer:
        "국제 금값 대표값 기준으로는 트로이온스당 약 1,290달러에서 약 4,331달러로 올라 약 3.36배가 됐습니다. 원화 환산 기준으로는 원달러 환율 상승까지 겹쳐 약 3.9배 수준으로 체감됩니다.",
    },
    {
      question: "금값은 매년 꾸준히 올랐나요?",
      answer:
        "아닙니다. 2017~2018년처럼 정체되거나 약세였던 구간도 있었고, 2020년·2024년·2025년에 상승이 집중됐습니다. 10년 수익률은 좋지만 매년 같은 속도로 오른 자산은 아닙니다.",
    },
    {
      question: "한국에서 금값 상승이 더 크게 느껴지는 이유는 무엇인가요?",
      answer:
        "국제 금값이 달러 기준으로 올랐고, 같은 기간 원달러 환율도 높아졌기 때문입니다. 여기에 실물 금은 부가세, 세공비, 매입·매도 스프레드가 붙어 체감 가격이 더 높게 느껴질 수 있습니다.",
    },
    {
      question: "금 1돈 가격은 국제 금값만으로 계산하면 되나요?",
      answer:
        "순금 원재료 환산가는 국제 금값을 1g, 1돈으로 바꿔 계산할 수 있습니다. 다만 실제 금은방 매입 가격은 부가세, 세공비, 브랜드 마진, 거래 스프레드가 붙으므로 원재료 환산가와 다릅니다.",
    },
    {
      question: "지금 금을 사도 될까요?",
      answer:
        "이 리포트만으로 매수 여부를 결정하면 안 됩니다. 금은 배당이나 이자가 없는 자산이고, 고점권에서는 조정 위험도 큽니다. 포트폴리오 방어 자산으로 어느 정도 비중을 둘지 관점에서 접근하는 편이 안전합니다.",
    },
  ] satisfies GoldFaqItem[],
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

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
}

export function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function calcCagr(start: number, end: number, years: number): number {
  return (end / start) ** (1 / years) - 1;
}

export function calcGoldMetrics(priceUsdOz: number, usdKrw: number) {
  const krwPerOz = priceUsdOz * usdKrw;
  const krwPerGram = krwPerOz / TROY_OUNCE_GRAM;
  const krwPerDon = krwPerGram * DON_GRAM;
  return {
    krwPerOz,
    krwPerGram,
    krwPerDon,
  };
}

export function calcChangeRate(start: number, end: number): number {
  return ((end / start) - 1) * 100;
}
