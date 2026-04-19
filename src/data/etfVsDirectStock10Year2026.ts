export type AssetBucket = "domestic-etf" | "domestic-stock" | "global-etf";
export type ComparisonMode = "gross" | "afterTax" | "dividend";
export type MixProfile = "etf-core" | "balanced" | "stock-heavy";

export interface AssetPerformanceRow {
  id: string;
  name: string;
  ticker: string;
  bucket: AssetBucket;
  startDate: string;
  endDate: string;
  listedAt?: string;
  feeNote?: string;
  taxNote?: string;
  cumulativeReturn: number;
  cagr: number;
  mdd: number;
  volatility: number;
  dividendAdjustedReturn?: number;
  afterTaxReturn?: number;
  summary: string;
  tags: string[];
}

export interface YearlyHeatmapRow {
  assetId: string;
  years: Record<number, number>;
}

export interface StrategyCard {
  id: MixProfile;
  title: string;
  fit: string;
  composition: string;
  summary: string;
  caution: string;
}

export interface CostTaxRow {
  assetType: string;
  capitalGainTax: string;
  transactionTax: string;
  dividendTax: string;
  feeCost: string;
  note: string;
}

export interface InvestorFitRow {
  type: string;
  strategy: string;
  reason: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

export const bucketLabel: Record<AssetBucket, string> = {
  "domestic-etf": "국내 ETF",
  "domestic-stock": "국내 개별주",
  "global-etf": "국내상장 미국 ETF",
};

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const etfVsDirectStock10Year2026 = {
  meta: {
    slug: "etf-vs-direct-stock-10year-2026",
    title: "ETF vs 직접투자 10년 비교 2026",
    subtitle:
      "KODEX200, TIGER200 같은 국내 ETF와 삼성전자·SK하이닉스 등 개별주를 10년 수익률, MDD, 세후 순수익 기준으로 비교합니다.",
    updatedAt: "2026-04-19",
    period: "2016-01 ~ 2026-04",
    methodology:
      "2016년 초를 100으로 두는 스냅샷형 장기 비교입니다. 국내 상장 미국 ETF는 상장 이후 구간만 별도 비교합니다.",
    caution:
      "수익률과 세후 수익은 설명용 단순화 추정입니다. 실제 계좌, 보유 규모, 매매 방식, 세법 적용에 따라 달라질 수 있습니다.",
  },
  heroSummary:
    "수익률 1등은 개별주에서 나올 수 있지만, 장기 유지 가능성과 하락장에서 버티는 난이도는 ETF가 더 나을 수 있습니다. 이 리포트는 단순 수익률보다 MDD, 변동성, 세후 순수익, 재현 가능성을 같이 봅니다.",
  kpis: [
    { label: "10년 전체 비교군", value: "6개", sub: "국내 ETF 2개 + 국내 개별주 4개" },
    { label: "상장 이후 비교군", value: "3개", sub: "국내상장 미국 ETF 별도 분리" },
    { label: "최고 누적수익률", value: "SK하이닉스", sub: "개별주 집중 투자 사례" },
    { label: "현실적 결론", value: "코어+위성", sub: "ETF 기반에 개별주를 일부 더하는 방식" },
  ],
  briefCards: [
    {
      title: "수익률 최고치는 개별주일 수 있습니다",
      body: "10년 동안 특정 산업과 종목이 크게 성장하면 ETF보다 높은 누적수익률을 만들 수 있습니다.",
    },
    {
      title: "유지 가능성은 ETF가 더 높을 수 있습니다",
      body: "개별주 고점과 저점을 버티는 난이도, 종목 교체 판단, 실적 확인 부담까지 감안해야 합니다.",
    },
    {
      title: "현실적 최적해는 코어+위성일 수 있습니다",
      body: "ETF를 핵심 자산으로 두고 확신이 있는 개별주를 일부 더하면 분산과 초과수익 기회를 함께 노릴 수 있습니다.",
    },
  ],
  tenYearRows: [
    {
      id: "kodex200",
      name: "KODEX 200",
      ticker: "069500",
      bucket: "domestic-etf",
      startDate: "2016-01",
      endDate: "2026-04",
      feeNote: "국내 대표 KOSPI200 ETF",
      taxNote: "국내주식형 ETF 매매차익 비과세 구조 참고",
      cumulativeReturn: 78.4,
      cagr: 5.8,
      mdd: -35.2,
      volatility: 18.4,
      dividendAdjustedReturn: 101.5,
      afterTaxReturn: 94.8,
      summary: "시장 전체를 따라가며 개별주보다 낮은 변동성과 높은 유지 가능성을 제공합니다.",
      tags: ["ETF", "분산", "10년비교"],
    },
    {
      id: "tiger200",
      name: "TIGER 200",
      ticker: "102110",
      bucket: "domestic-etf",
      startDate: "2016-01",
      endDate: "2026-04",
      feeNote: "KOSPI200 추종",
      taxNote: "국내주식형 ETF 매매차익 비과세 구조 참고",
      cumulativeReturn: 77.1,
      cagr: 5.7,
      mdd: -35.0,
      volatility: 18.2,
      dividendAdjustedReturn: 100.2,
      afterTaxReturn: 93.7,
      summary: "KODEX 200과 유사한 성격으로 장기 분산 투자 비교 기준점이 됩니다.",
      tags: ["ETF", "KOSPI200", "분산"],
    },
    {
      id: "samsung",
      name: "삼성전자",
      ticker: "005930",
      bucket: "domestic-stock",
      startDate: "2016-01",
      endDate: "2026-04",
      taxNote: "일반 소액주주 장내매도 기준 단순화",
      cumulativeReturn: 132.6,
      cagr: 8.6,
      mdd: -44.5,
      volatility: 25.1,
      dividendAdjustedReturn: 167.8,
      afterTaxReturn: 153.2,
      summary: "장기 성과는 ETF보다 높았지만 반도체 사이클과 개별 종목 변동성을 함께 감수해야 합니다.",
      tags: ["개별주", "반도체", "배당"],
    },
    {
      id: "skhynix",
      name: "SK하이닉스",
      ticker: "000660",
      bucket: "domestic-stock",
      startDate: "2016-01",
      endDate: "2026-04",
      taxNote: "일반 소액주주 장내매도 기준 단순화",
      cumulativeReturn: 315.4,
      cagr: 14.8,
      mdd: -55.8,
      volatility: 33.7,
      dividendAdjustedReturn: 338.6,
      afterTaxReturn: 326.4,
      summary: "10년 수익률은 가장 강했지만 최대 낙폭과 변동성도 가장 큰 축에 속합니다.",
      tags: ["개별주", "고수익", "고변동"],
    },
    {
      id: "naver",
      name: "NAVER",
      ticker: "035420",
      bucket: "domestic-stock",
      startDate: "2016-01",
      endDate: "2026-04",
      taxNote: "일반 소액주주 장내매도 기준 단순화",
      cumulativeReturn: 64.2,
      cagr: 5.0,
      mdd: -62.4,
      volatility: 31.2,
      dividendAdjustedReturn: 67.5,
      afterTaxReturn: 61.8,
      summary: "성장주 고점 이후 하락을 버티기 어려웠던 사례로, 수익률보다 경로가 중요합니다.",
      tags: ["개별주", "플랫폼", "고변동"],
    },
    {
      id: "hyundai",
      name: "현대차",
      ticker: "005380",
      bucket: "domestic-stock",
      startDate: "2016-01",
      endDate: "2026-04",
      taxNote: "일반 소액주주 장내매도 기준 단순화",
      cumulativeReturn: 96.8,
      cagr: 6.8,
      mdd: -48.6,
      volatility: 27.5,
      dividendAdjustedReturn: 132.4,
      afterTaxReturn: 118.9,
      summary: "주가 상승과 배당 기여가 함께 작동했지만 경기 민감주 특유의 사이클이 큽니다.",
      tags: ["개별주", "배당", "경기민감"],
    },
  ] satisfies AssetPerformanceRow[],
  globalEtfRows: [
    {
      id: "tiger-sp500",
      name: "TIGER 미국S&P500",
      ticker: "360750",
      bucket: "global-etf",
      startDate: "2020-08",
      endDate: "2026-04",
      listedAt: "2020-08",
      feeNote: "S&P500 추종",
      taxNote: "국내 상장 해외형 ETF 과세 구조 참고",
      cumulativeReturn: 112.5,
      cagr: 14.1,
      mdd: -24.8,
      volatility: 18.9,
      dividendAdjustedReturn: 119.4,
      afterTaxReturn: 95.2,
      summary: "상장 이후 미국 대형주 강세를 반영했지만 10년 전체 비교군은 아닙니다.",
      tags: ["미국ETF", "상장이후", "S&P500"],
    },
    {
      id: "ace-sp500",
      name: "ACE 미국S&P500",
      ticker: "360200",
      bucket: "global-etf",
      startDate: "2020-08",
      endDate: "2026-04",
      listedAt: "2020-08",
      feeNote: "S&P500 추종",
      taxNote: "국내 상장 해외형 ETF 과세 구조 참고",
      cumulativeReturn: 111.2,
      cagr: 14.0,
      mdd: -25.0,
      volatility: 19.0,
      dividendAdjustedReturn: 118.0,
      afterTaxReturn: 94.1,
      summary: "동일 지수형 ETF끼리는 장기적으로 보수와 추적오차 차이를 확인해야 합니다.",
      tags: ["미국ETF", "상장이후", "S&P500"],
    },
    {
      id: "kodex-sp500tr",
      name: "KODEX 미국S&P500TR",
      ticker: "379800",
      bucket: "global-etf",
      startDate: "2021-04",
      endDate: "2026-04",
      listedAt: "2021-04",
      feeNote: "TR 지수형",
      taxNote: "국내 상장 해외형 ETF 과세 구조 참고",
      cumulativeReturn: 92.4,
      cagr: 13.9,
      mdd: -24.2,
      volatility: 18.7,
      dividendAdjustedReturn: 96.3,
      afterTaxReturn: 78.5,
      summary: "상장 시점이 더 늦어 10년 비교가 아니라 2021년 이후 흐름으로만 봐야 합니다.",
      tags: ["미국ETF", "TR", "상장이후"],
    },
  ] satisfies AssetPerformanceRow[],
  yearlyIndex: [
    { assetId: "kodex200", years: { 2016: 100, 2017: 122, 2018: 101, 2019: 112, 2020: 145, 2021: 156, 2022: 121, 2023: 146, 2024: 162, 2025: 171, 2026: 178 } },
    { assetId: "tiger200", years: { 2016: 100, 2017: 121, 2018: 101, 2019: 111, 2020: 144, 2021: 155, 2022: 120, 2023: 145, 2024: 161, 2025: 170, 2026: 177 } },
    { assetId: "samsung", years: { 2016: 100, 2017: 142, 2018: 121, 2019: 138, 2020: 191, 2021: 210, 2022: 161, 2023: 190, 2024: 222, 2025: 229, 2026: 233 } },
    { assetId: "skhynix", years: { 2016: 100, 2017: 205, 2018: 154, 2019: 186, 2020: 242, 2021: 264, 2022: 168, 2023: 255, 2024: 390, 2025: 405, 2026: 415 } },
    { assetId: "naver", years: { 2016: 100, 2017: 116, 2018: 98, 2019: 128, 2020: 221, 2021: 248, 2022: 112, 2023: 139, 2024: 151, 2025: 158, 2026: 164 } },
    { assetId: "hyundai", years: { 2016: 100, 2017: 103, 2018: 82, 2019: 96, 2020: 131, 2021: 172, 2022: 141, 2023: 162, 2024: 192, 2025: 188, 2026: 197 } },
  ] satisfies YearlyHeatmapRow[],
  strategyCards: [
    {
      id: "etf-core",
      title: "ETF 코어형",
      fit: "초보 투자자, 관리 시간이 부족한 직장인",
      composition: "ETF 80~100% + 개별주 0~20%",
      summary: "시장 수익률을 놓치지 않고 종목 선택 실패 위험을 줄이는 방식입니다.",
      caution: "단기 초과수익 욕심보다 꾸준한 적립과 낮은 비용 관리가 중요합니다.",
    },
    {
      id: "balanced",
      title: "ETF + 직접투자 균형형",
      fit: "시장 수익률을 기본으로 두고 관심 산업을 더 보고 싶은 투자자",
      composition: "ETF 60~70% + 개별주 30~40%",
      summary: "ETF로 분산을 확보하고 확신이 있는 종목을 위성으로 붙이는 현실적 조합입니다.",
      caution: "개별주 비중이 커질수록 리밸런싱 규칙을 먼저 정해야 합니다.",
    },
    {
      id: "stock-heavy",
      title: "직접투자 고비중형",
      fit: "사업 분석과 변동성 감내가 가능한 투자자",
      composition: "ETF 20~40% + 개별주 60~80%",
      summary: "초과수익 가능성은 높지만 종목 선택 실패와 장기 보유 난이도도 함께 커집니다.",
      caution: "수익률이 높은 구간만 보지 말고 MDD와 회복 기간을 반드시 확인해야 합니다.",
    },
  ] satisfies StrategyCard[],
  costTaxRows: [
    {
      assetType: "국내주식형 ETF",
      capitalGainTax: "일반적으로 매매차익 비과세 구조",
      transactionTax: "거래세 면제",
      dividendTax: "분배금 과세 가능",
      feeCost: "총보수와 추적오차 확인",
      note: "장기 분산 투자와 비용 관리 측면에서 접근성이 좋습니다.",
    },
    {
      assetType: "국내 개별주",
      capitalGainTax: "일반 소액주주 장내매도는 통상 과세 제한적",
      transactionTax: "거래세 존재",
      dividendTax: "배당소득 과세",
      feeCost: "매매 수수료와 잦은 거래 비용",
      note: "종목 선택과 보유 판단 책임이 투자자에게 크게 남습니다.",
    },
    {
      assetType: "국내 상장 해외형 ETF",
      capitalGainTax: "과세 구조가 국내주식형 ETF와 다를 수 있음",
      transactionTax: "거래세 구조 확인 필요",
      dividendTax: "분배금 과세 가능",
      feeCost: "총보수, 환헤지, 환율 영향 확인",
      note: "미국 지수 접근성이 좋지만 세후 수익을 따로 봐야 합니다.",
    },
  ] satisfies CostTaxRow[],
  investorFits: [
    { type: "초보", strategy: "ETF 중심", reason: "종목 선택보다 적립 습관과 분산이 먼저입니다." },
    { type: "직장인 장기 적립식", strategy: "국내/미국 ETF 혼합", reason: "자동화된 적립과 낮은 관리 부담이 강점입니다." },
    { type: "종목 분석 가능", strategy: "ETF 코어 + 개별주 위성", reason: "기본 수익률을 지키면서 초과수익 기회를 일부 열어둡니다." },
    { type: "고위험 선호", strategy: "개별주 비중 확대", reason: "수익률 기회는 커지지만 MDD와 회복 기간을 감당해야 합니다." },
    { type: "변동성 민감", strategy: "ETF 위주", reason: "분산과 리밸런싱으로 보유 지속 가능성을 높이는 편이 낫습니다." },
  ] satisfies InvestorFitRow[],
  faq: [
    {
      q: "ETF가 개별주보다 항상 안전한가요?",
      a: "항상 안전하다는 뜻은 아닙니다. ETF도 시장 하락을 그대로 겪지만, 개별 종목 리스크가 분산되어 유지 가능성이 상대적으로 높을 수 있습니다.",
    },
    {
      q: "수익률만 보면 SK하이닉스 같은 개별주가 더 좋은 것 아닌가요?",
      a: "결과적으로 높은 종목은 있을 수 있습니다. 다만 그 종목을 10년 전에 고르고 큰 낙폭을 버텼는지까지 봐야 재현 가능성을 판단할 수 있습니다.",
    },
    {
      q: "국내 상장 미국 ETF는 왜 10년 표에 넣지 않았나요?",
      a: "상장 시점이 2020년 이후인 상품이 많아 2016~2026 전체 구간 비교가 어렵습니다. 그래서 상장 이후 성과 섹션으로 분리했습니다.",
    },
    {
      q: "세후 순수익은 정확한 세금 계산인가요?",
      a: "아닙니다. 일반 투자자 기준의 단순화 추정입니다. 실제 세금은 계좌 종류, 보유 규모, 거래 방식, 세법 변경에 따라 달라질 수 있습니다.",
    },
    {
      q: "현실적으로 어떤 전략이 가장 무난한가요?",
      a: "대부분의 장기 투자자에게는 ETF를 코어로 두고, 분석 가능한 개별주를 위성으로 일부 더하는 방식이 현실적입니다.",
    },
  ] satisfies FaqItem[],
  relatedLinks: [
    { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기", description: "매월 같은 금액을 넣었을 때 장기 결과를 비교합니다." },
    { href: "/tools/domestic-stock-capital-gains-tax/", label: "국내주식 양도세 계산기", description: "국내주식 매도 차익과 세금 영향을 간단히 확인합니다." },
    { href: "/reports/semiconductor-etf-2026/", label: "반도체 ETF 비교 2026", description: "한국·미국 반도체 ETF 구성과 성격을 비교합니다." },
    { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인·금·S&P500 10년 비교", description: "대표 자산군의 10년 수익률과 MDD를 함께 봅니다." },
  ] satisfies RelatedLink[],
  sourceLinks: [
    { label: "KRX 정보데이터시스템", href: "https://data.krx.co.kr/" },
    { label: "금융투자협회 전자공시서비스", href: "https://dis.kofia.or.kr/" },
    { label: "KODEX ETF", href: "https://www.kodex.com/" },
    { label: "미래에셋 TIGER ETF", href: "https://www.tigeretf.com/" },
  ] satisfies SourceLink[],
} as const;

