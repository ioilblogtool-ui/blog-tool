export interface SilverYearPoint {
  year: number;
  priceUsdOz: number;
  usdKrw: number;
  note: string;
}

export interface SilverFaqItem {
  question: string;
  answer: string;
}

const TROY_OUNCE_GRAM = 31.1034768;
const DON_GRAM = 3.75;
const KILOGRAM_GRAM = 1000;

export const silverPrice2016Vs2026 = {
  meta: {
    slug: "silver-price-2016-vs-2026",
    title: "은값 2016년 6월 vs 2026년 6월 비교｜10년 수익률·1돈·1kg 가격",
    description:
      "2016년 6월과 2026년 6월 은값을 달러, 원화, 1g, 1돈, 1kg, 투자금 기준으로 비교하고 매년 몇 퍼센트씩 올랐는지 정리한 은값 10년 리포트입니다.",
    updatedAt: "2026-06-20",
    methodology:
      "국제 은값은 트로이온스당 달러 가격을 기준으로 하고, 원화 환산은 해당 시점의 대표 원달러 환율을 적용했습니다. 국내 실물 은 매입가는 부가세, 세공비, 프리미엄, 매입·매도 스프레드가 붙어 원재료 환산가와 다를 수 있습니다.",
    caution:
      "이 리포트는 투자 권유가 아니라 과거 가격 비교 콘텐츠입니다. 2026년 6월 20일은 토요일이므로 최신 은값은 2026년 6월 15~17일 공개 정산가를 대표값으로 참고했습니다.",
  },
  constants: {
    troyOunceGram: TROY_OUNCE_GRAM,
    donGram: DON_GRAM,
    kilogramGram: KILOGRAM_GRAM,
  },
  sourceLinks: [
    {
      label: "LBMA Precious Metal Prices",
      href: "https://www.lbma.org.uk/prices-and-data/precious-metal-prices",
      description: "금·은·백금·팔라듐 가격과 벤치마크 정보를 확인할 수 있는 LBMA 가격 데이터 페이지입니다.",
    },
    {
      label: "The Silver Institute 은 수급 자료",
      href: "https://silverinstitute.org/",
      description: "은의 산업 수요, 공급 부족, 태양광·전기차·전자 산업 수요 흐름을 확인할 수 있는 은 산업 협회 자료입니다.",
    },
    {
      label: "Dow Jones Market Data / WSJ 2026년 6월 은 정산가",
      href: "https://www.wsj.com/finance/commodities-futures/comex-gold-futures-likely-eyeing-resistance-at-4-400-ounce-daily-chart-shows-9a99eb24",
      description: "2026년 6월 중순 Comex 은 정산가, 52주 고점·저점, 전년 대비 상승률을 확인한 기사입니다.",
    },
  ],
  baseCompare: {
    startLabel: "2016년 6월",
    endLabel: "2026년 6월",
    startUsdOz: 17.7,
    endUsdOz: 70.696,
    startUsdKrw: 1168,
    endUsdKrw: 1368,
  },
  yearPoints: [
    { year: 2016, priceUsdOz: 17.7, usdKrw: 1168, note: "브렉시트 전후 안전자산 선호와 원자재 반등" },
    { year: 2017, priceUsdOz: 16.6, usdKrw: 1144, note: "달러 약세에도 은 가격은 박스권" },
    { year: 2018, priceUsdOz: 16.2, usdKrw: 1108, note: "미국 금리 인상과 산업 금속 둔화" },
    { year: 2019, priceUsdOz: 15.3, usdKrw: 1176, note: "무역분쟁 속 금보다 늦은 반응" },
    { year: 2020, priceUsdOz: 18.0, usdKrw: 1203, note: "팬데믹 이후 유동성 확대와 귀금속 강세" },
    { year: 2021, priceUsdOz: 27.7, usdKrw: 1144, note: "태양광·전기차 기대와 개인 투자 수요" },
    { year: 2022, priceUsdOz: 21.5, usdKrw: 1292, note: "긴축과 달러 강세로 조정, 환율은 방어" },
    { year: 2023, priceUsdOz: 23.6, usdKrw: 1305, note: "산업 수요와 공급 부족 기대 재부각" },
    { year: 2024, priceUsdOz: 29.5, usdKrw: 1376, note: "태양광 수요와 귀금속 랠리 동참" },
    { year: 2025, priceUsdOz: 35.7, usdKrw: 1365, note: "13년 고점권 돌파, 은 공급 부족 이슈 확대" },
    { year: 2026, priceUsdOz: 70.7, usdKrw: 1368, note: "1월 급등 후 조정, 6월에도 전년 대비 높은 가격대" },
  ] satisfies SilverYearPoint[],
  investmentCases: [
    { label: "100만원", amount: 1_000_000 },
    { label: "500만원", amount: 5_000_000 },
    { label: "1000만원", amount: 10_000_000 },
    { label: "1억원", amount: 100_000_000 },
  ],
  ctaLinks: [
    {
      href: "/reports/gold-price-2016-vs-2026/",
      label: "금값 2016년 6월 vs 2026년 6월 비교",
      description: "은값이 크게 오른 것처럼 금값도 10년 동안 얼마나 올랐는지 1돈 기준으로 비교합니다.",
    },
    {
      href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
      label: "비트코인·금·S&P500 10년 수익률 비교",
      description: "귀금속만 보는 대신 비트코인과 미국 주식까지 함께 놓고 10년 성과를 비교합니다.",
    },
    {
      href: "/reports/salary-asset-2016-vs-2026/",
      label: "평균 연봉·자산 2016 vs 2026",
      description: "은값과 금값은 크게 뛰었는데 월급과 자산은 얼마나 따라왔는지 확인할 수 있습니다.",
    },
    {
      href: "/reports/seoul-housing-2016-vs-2026/",
      label: "서울 집값 2016 vs 2026",
      description: "귀금속 상승률과 한국인이 가장 크게 체감하는 부동산 가격 변화를 함께 비교합니다.",
    },
    {
      href: "/tools/dca-investment-calculator/",
      label: "적립식 투자 계산기",
      description: "은을 한 번에 사는 대신 매달 나눠 샀을 때 결과가 어떻게 달라지는지 계산해 볼 수 있습니다.",
    },
  ],
  faq: [
    {
      question: "2016년 6월 은값과 2026년 6월 은값은 몇 배 차이인가요?",
      answer:
        "국제 은값 대표값 기준으로는 트로이온스당 약 17.7달러에서 약 70.7달러로 올라 약 4배가 됐습니다. 원화 1돈 환산 기준으로는 원달러 환율 상승까지 반영되어 약 4.7배 수준으로 계산됩니다.",
    },
    {
      question: "은값은 금값보다 더 많이 올랐나요?",
      answer:
        "2016년 6월부터 2026년 6월 대표값만 보면 은의 상승률이 금보다 더 큽니다. 다만 은은 금보다 변동성이 크고, 2026년 초 급등 뒤 조정도 컸기 때문에 단순히 더 안전한 자산이라고 보기는 어렵습니다.",
    },
    {
      question: "은값이 오른 이유는 무엇인가요?",
      answer:
        "귀금속 투자 수요뿐 아니라 태양광, 전기차, 전자부품, 전력망, AI 관련 설비 수요가 함께 작용했습니다. 은은 산업재 성격이 강해서 경기와 기술 투자 흐름에도 민감합니다.",
    },
    {
      question: "은 1kg 가격은 국제 은값만으로 계산하면 되나요?",
      answer:
        "순은 원재료 환산가는 국제 은값과 환율로 계산할 수 있습니다. 그러나 실제 실버바, 은괴, 은제품 가격에는 부가세, 제조비, 유통 마진, 매입·매도 스프레드가 붙기 때문에 원재료 환산가보다 높거나 낮게 거래될 수 있습니다.",
    },
    {
      question: "은 투자는 금 투자와 무엇이 다른가요?",
      answer:
        "금은 주로 안전자산과 중앙은행 수요의 영향을 크게 받지만, 은은 산업 수요 비중이 높습니다. 그래서 상승장에서는 더 크게 오를 수 있지만 하락장에서도 더 크게 흔들릴 수 있습니다.",
    },
    {
      question: "지금 은을 사도 될까요?",
      answer:
        "이 리포트만으로 매수 여부를 결정하면 안 됩니다. 은은 가격 변동성이 크고 실물 거래 비용도 높을 수 있습니다. 포트폴리오 일부로 접근하되 고점권 추격 매수와 실물 스프레드는 반드시 확인하는 편이 안전합니다.",
    },
  ] satisfies SilverFaqItem[],
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
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 3 })}`;
}

export function formatPercent(value: number, signed = false): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function calcCagr(start: number, end: number, years: number): number {
  return (end / start) ** (1 / years) - 1;
}

export function calcSilverMetrics(priceUsdOz: number, usdKrw: number) {
  const krwPerOz = priceUsdOz * usdKrw;
  const krwPerGram = krwPerOz / TROY_OUNCE_GRAM;
  const krwPerDon = krwPerGram * DON_GRAM;
  const krwPerKg = krwPerGram * KILOGRAM_GRAM;
  return {
    krwPerOz,
    krwPerGram,
    krwPerDon,
    krwPerKg,
  };
}

export function calcChangeRate(start: number, end: number): number {
  return (end / start - 1) * 100;
}
