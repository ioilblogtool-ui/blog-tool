export type AssetId = "BTC" | "GOLD" | "SP500" | "NASDAQ100" | "KOSPI";

export type CompareMode = "growth" | "drawdown" | "recovery" | "real";

export interface AssetSnapshot {
  id: AssetId;
  label: string;
  shortLabel: string;
  displayStart: string;
  displayEnd: string;
  startValue: number;
  endValue: number;
  totalReturnRate: number;
  cagr: number;
  mdd: number;
  mddPeriodLabel: string;
  recoveryMonths: number | null;
  volatilityAnnual: number;
  inflationAdjustedReturnRate: number;
  afterTaxReturnRate: number;
  accessSummary: string;
  roleSummary: string;
  color: string;
}

export interface GrowthPoint {
  year: number;
  BTC: number;
  GOLD: number;
  SP500: number;
  NASDAQ100: number;
  KOSPI: number;
}

export interface CorrelationRow {
  label: string;
  BTC: number;
  GOLD: number;
  SP500: number;
  NASDAQ100: number;
  KOSPI: number;
}

export interface AllocationPreset {
  id: "aggressive" | "balanced" | "defensive";
  label: string;
  note: string;
  weights: Array<{ assetId: AssetId; weight: number }>;
}

export interface AssetFaqItem {
  q: string;
  a: string;
}

const snapshots: AssetSnapshot[] = [
  {
    id: "BTC",
    label: "비트코인",
    shortLabel: "BTC",
    displayStart: "52만원",
    displayEnd: "1억 300만원",
    startValue: 520000,
    endValue: 103000000,
    totalReturnRate: 19708,
    cagr: 70.0,
    mdd: -78,
    mddPeriodLabel: "2017 고점 이후",
    recoveryMonths: 38,
    volatilityAnnual: 74,
    inflationAdjustedReturnRate: 14820,
    afterTaxReturnRate: 19500,
    accessSummary: "원화 거래소 / 해외 거래소",
    roleSummary: "압도적 성과 가능성이 있지만 경로 리스크가 가장 큰 자산",
    color: "#f97316",
  },
  {
    id: "GOLD",
    label: "금",
    shortLabel: "금",
    displayStart: "4.5만원/g",
    displayEnd: "14.8만원/g",
    startValue: 45000,
    endValue: 148000,
    totalReturnRate: 229,
    cagr: 12.6,
    mdd: -18,
    mddPeriodLabel: "2018~2019 조정",
    recoveryMonths: 11,
    volatilityAnnual: 15,
    inflationAdjustedReturnRate: 151,
    afterTaxReturnRate: 187,
    accessSummary: "KRX 금 / 금 ETF / 금통장",
    roleSummary: "수익률보다 방어력과 분산 역할이 강한 자산",
    color: "#ca8a04",
  },
  {
    id: "SP500",
    label: "S&P500",
    shortLabel: "S&P500",
    displayStart: "2,043pt",
    displayEnd: "6,639pt",
    startValue: 2043,
    endValue: 6639,
    totalReturnRate: 225,
    cagr: 12.4,
    mdd: -24,
    mddPeriodLabel: "2022 금리 급등기",
    recoveryMonths: 17,
    volatilityAnnual: 18,
    inflationAdjustedReturnRate: 148,
    afterTaxReturnRate: 188,
    accessSummary: "미국 ETF / 국내 상장 미국지수 ETF",
    roleSummary: "장기 우상향과 심리적 버티기 균형이 가장 좋은 대표 자산",
    color: "#2563eb",
  },
  {
    id: "NASDAQ100",
    label: "나스닥100",
    shortLabel: "나스닥100",
    displayStart: "4,290pt",
    displayEnd: "25,116pt",
    startValue: 4290,
    endValue: 25116,
    totalReturnRate: 485,
    cagr: 19.4,
    mdd: -32,
    mddPeriodLabel: "2022 성장주 조정",
    recoveryMonths: 22,
    volatilityAnnual: 24,
    inflationAdjustedReturnRate: 356,
    afterTaxReturnRate: 402,
    accessSummary: "미국 ETF / 국내 상장 미국지수 ETF",
    roleSummary: "기술주 집중 성장 덕분에 강했지만 변동성도 높은 자산",
    color: "#7c3aed",
  },
  {
    id: "KOSPI",
    label: "코스피",
    shortLabel: "코스피",
    displayStart: "1,949pt",
    displayEnd: "2,578pt",
    startValue: 1949,
    endValue: 2578,
    totalReturnRate: 32,
    cagr: 2.8,
    mdd: -36,
    mddPeriodLabel: "2022~2023 박스권",
    recoveryMonths: 31,
    volatilityAnnual: 19,
    inflationAdjustedReturnRate: 6,
    afterTaxReturnRate: 28,
    accessSummary: "국내 지수 ETF / 대형주 ETF",
    roleSummary: "환율과 업황 영향을 많이 받아 체감 성과가 약했던 자산",
    color: "#dc2626",
  },
];

const growthSeries: GrowthPoint[] = [
  { year: 2016, BTC: 100, GOLD: 100, SP500: 100, NASDAQ100: 100, KOSPI: 100 },
  { year: 2017, BTC: 620, GOLD: 112, SP500: 118, NASDAQ100: 130, KOSPI: 121 },
  { year: 2018, BTC: 190, GOLD: 116, SP500: 111, NASDAQ100: 126, KOSPI: 104 },
  { year: 2019, BTC: 330, GOLD: 138, SP500: 146, NASDAQ100: 168, KOSPI: 112 },
  { year: 2020, BTC: 840, GOLD: 162, SP500: 173, NASDAQ100: 229, KOSPI: 146 },
  { year: 2021, BTC: 1320, GOLD: 170, SP500: 223, NASDAQ100: 279, KOSPI: 162 },
  { year: 2022, BTC: 610, GOLD: 184, SP500: 177, NASDAQ100: 188, KOSPI: 122 },
  { year: 2023, BTC: 1190, GOLD: 204, SP500: 229, NASDAQ100: 292, KOSPI: 145 },
  { year: 2024, BTC: 2130, GOLD: 218, SP500: 292, NASDAQ100: 407, KOSPI: 153 },
  { year: 2025, BTC: 1760, GOLD: 242, SP500: 314, NASDAQ100: 503, KOSPI: 161 },
  { year: 2026, BTC: 19808, GOLD: 329, SP500: 325, NASDAQ100: 585, KOSPI: 132 },
];

const correlationMatrix: CorrelationRow[] = [
  { label: "비트코인", BTC: 1.0, GOLD: 0.08, SP500: 0.32, NASDAQ100: 0.38, KOSPI: 0.24 },
  { label: "금", BTC: 0.08, GOLD: 1.0, SP500: -0.11, NASDAQ100: -0.15, KOSPI: -0.06 },
  { label: "S&P500", BTC: 0.32, GOLD: -0.11, SP500: 1.0, NASDAQ100: 0.92, KOSPI: 0.58 },
  { label: "나스닥100", BTC: 0.38, GOLD: -0.15, SP500: 0.92, NASDAQ100: 1.0, KOSPI: 0.51 },
  { label: "코스피", BTC: 0.24, GOLD: -0.06, SP500: 0.58, NASDAQ100: 0.51, KOSPI: 1.0 },
];

const allocationPresets: AllocationPreset[] = [
  {
    id: "aggressive",
    label: "공격형",
    note: "상승 탄력 우선. BTC와 나스닥 비중이 높아 하락 스트레스도 큽니다.",
    weights: [
      { assetId: "BTC", weight: 40 },
      { assetId: "NASDAQ100", weight: 30 },
      { assetId: "SP500", weight: 20 },
      { assetId: "GOLD", weight: 10 },
    ],
  },
  {
    id: "balanced",
    label: "균형형",
    note: "장기 성장과 방어를 같이 보려는 사용자에게 가장 무난한 예시입니다.",
    weights: [
      { assetId: "BTC", weight: 20 },
      { assetId: "GOLD", weight: 20 },
      { assetId: "SP500", weight: 40 },
      { assetId: "NASDAQ100", weight: 20 },
    ],
  },
  {
    id: "defensive",
    label: "안정형",
    note: "수익률보다 하락 스트레스를 낮추는 쪽에 초점을 둔 배분 예시입니다.",
    weights: [
      { assetId: "GOLD", weight: 25 },
      { assetId: "SP500", weight: 45 },
      { assetId: "NASDAQ100", weight: 20 },
      { assetId: "BTC", weight: 10 },
    ],
  },
];

export const bitcoinGoldSp5002026 = {
  meta: {
    slug: "bitcoin-gold-sp500-10year-comparison-2026",
    title: "비트코인 vs 금 vs S&P500 10년 수익 비교 2026 | 100만원이 얼마 됐을까?",
    subtitle:
      "2016~2026년 비트코인, 금, S&P500, 나스닥100, 코스피에 같은 돈을 투자했다면 현재 얼마가 됐을까? 누적수익률, 최대 낙폭(MDD), 회복 기간, 실질 수익, 세후 관점까지 함께 보는 인터랙티브 리포트입니다.",
    methodology:
      "비교 기준은 2016년 초와 2026년 4월 스냅샷을 연결한 원화 체감 기준 정적 데이터입니다. 미국 자산은 한국 투자자가 느끼는 원화 기준 결과를 읽기 쉽게 재구성했습니다.",
    caution:
      "세후 수익은 투자 수단별 실제 세금을 완벽히 반영한 값이 아니라 비교용 단순 추정입니다. 과거 수익률은 미래 수익을 보장하지 않으며, 이 페이지는 투자 권유가 아니라 비교 참고용 리포트입니다.",
    updatedAt: "2026년 4월 기준 정리",
  },
  reportLead:
    "지난 10년을 숫자로만 보면 비트코인이 압도적이지만, 최대 낙폭과 회복 기간까지 같이 보면 심리적으로 가장 버티기 쉬운 자산은 달랐습니다. 금은 방어력, S&P500은 균형, 나스닥100은 성장, 코스피는 체감 한계가 분명했던 흐름을 한 화면에서 비교합니다.",
  heroStats: [
    { label: "100만원 결과 1위", value: "1억 9,808만원", note: "비트코인 기준" },
    { label: "최대 낙폭 최악", value: "-78%", note: "비트코인 기준" },
    { label: "변동성 최저", value: "15%", note: "금 기준" },
    { label: "심리적 균형", value: "S&P500", note: "성과와 버티기의 중간점" },
  ],
  kpis: [
    { label: "수익률 1위", value: "비트코인", sub: "+19,708%" },
    { label: "실질 수익률 1위", value: "비트코인", sub: "+14,820%" },
    { label: "방어력 대표", value: "금", sub: "MDD -18%" },
    { label: "균형형 대표", value: "S&P500", sub: "수익·변동성 균형" },
    { label: "성장형 대표", value: "나스닥100", sub: "+485%" },
    { label: "체감 약세", value: "코스피", sub: "실질 수익 낮음" },
  ],
  snapshots,
  growthSeries,
  correlationMatrix,
  allocationPresets,
  patternNotes: [
    {
      title: "수익률 1등과 편한 투자 1등은 다릅니다",
      body: "비트코인은 10년 누적 성과가 압도적이지만 하락폭과 회복 스트레스도 가장 컸습니다. 숫자상 최고 성과와 실제 버티기 쉬운 자산은 다를 수 있습니다.",
    },
    {
      title: "금은 재미보다 방어력으로 읽어야 합니다",
      body: "금은 수익률만 보면 지루하지만, 위기 구간에서 낙폭이 작고 다른 위험자산과의 상관이 낮아 포트폴리오 방어 자산으로 해석하는 편이 맞습니다.",
    },
    {
      title: "S&P500은 긴 호흡에서 설득력이 큽니다",
      body: "S&P500은 비트코인만큼 화려하지 않아도 회복력과 변동성, 실질 수익의 균형이 좋아 장기 보유 관점에서 가장 무난한 대표 자산으로 보입니다.",
    },
    {
      title: "한국 투자자 체감은 환율과 수단에서 갈립니다",
      body: "같은 미국 자산이라도 직접 미국 ETF를 사는지, 국내 상장 ETF를 사는지, 환율을 어떻게 체감하는지에 따라 실제 투자 경험은 달라집니다.",
    },
  ],
  references: {
    official: [
      { label: "BLS CPI", href: "https://www.bls.gov/cpi/" },
      { label: "S&P Dow Jones Indices", href: "https://www.spglobal.com/spdji/" },
      { label: "Nasdaq Indexes", href: "https://indexes.nasdaqomx.com/" },
    ],
    market: [
      { label: "KRX 금시장", href: "http://gold.krx.co.kr/" },
      { label: "한국거래소 ETF 정보", href: "https://data.krx.co.kr/" },
      { label: "코스피 지수 정보", href: "https://data.krx.co.kr/" },
    ],
    next: [
      { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
      { label: "FIRE 계산기", href: "/tools/fire-calculator/" },
      { label: "반도체 ETF 비교 2026", href: "/reports/semiconductor-etf-2026/" },
    ],
  },
  relatedLinks: [
    { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
    { label: "FIRE 계산기", href: "/tools/fire-calculator/" },
    { label: "반도체 ETF 비교 2026", href: "/reports/semiconductor-etf-2026/" },
  ],
  faq: [
    {
      q: "지난 10년 수익률 1위는 무조건 비트코인인가요?",
      a: "이 페이지 기준으로는 그렇지만, 중요한 건 최종 수익률 하나만이 아닙니다. 비트코인은 중간 낙폭과 회복 기간이 매우 커서 실제 체감은 전혀 다를 수 있습니다.",
    },
    {
      q: "금은 왜 계속 비교 대상에 들어가나요?",
      a: "금은 수익률 경쟁보다 방어력과 분산 효과에서 의미가 큽니다. 위험자산이 흔들리는 구간에서 심리적 완충 역할을 하기 때문에 장기 비교에서 빠지지 않습니다.",
    },
    {
      q: "S&P500과 나스닥100 중 장기투자는 뭐가 더 좋나요?",
      a: "나스닥100은 성장 탄력이 더 강했지만 변동성도 컸습니다. S&P500은 성과와 버티기 난이도 균형이 좋아 더 넓은 사용자에게 무난한 축으로 읽을 수 있습니다.",
    },
    {
      q: "환율까지 반영한 수익률인가요?",
      a: "네. 이 리포트는 한국 투자자 체감을 위해 원화 기준 결과를 읽기 쉽게 정리했습니다. 다만 실제 투자 수단별 체결 환율과 비용은 다를 수 있습니다.",
    },
    {
      q: "세후 수익은 실제와 똑같나요?",
      a: "아닙니다. 코인, 금, 해외 ETF, 국내 ETF의 과세 구조가 모두 다르기 때문에 이 페이지에서는 비교를 위한 단순 추정치만 제공합니다.",
    },
    {
      q: "2026년 지금 들어가도 늦지 않았나요?",
      a: "이 페이지는 진입 타이밍을 단정하지 않습니다. 다만 현재 가격대에서 중요한 질문은 무엇을 살지보다 어떤 하락을 견딜 수 있는 비중으로 살지에 가깝습니다.",
    },
  ] satisfies AssetFaqItem[],
  calculatorDefaults: {
    compareMode: "growth" as CompareMode,
    investmentAmount: 1_000_000,
    allocationPreset: "balanced" as AllocationPreset["id"],
  },
};

export function formatKoreanWon(value: number) {
  const safe = Math.round(Number(value) || 0);
  if (safe >= 100_000_000) {
    return `${(safe / 100_000_000).toFixed(1)}억원`;
  }
  if (safe >= 10_000) {
    return `${Math.round(safe / 10_000).toLocaleString("ko-KR")}만원`;
  }
  return `${safe.toLocaleString("ko-KR")}원`;
}

export function formatSignedPercent(value: number) {
  const rounded = Number(value.toFixed(1));
  return `${rounded > 0 ? "+" : ""}${rounded.toLocaleString("ko-KR")}%`;
}

export function formatRecoveryLabel(months: number | null) {
  return months == null ? "미회복" : `${months}개월`;
}

export function calcInvestmentOutcome(amount: number, asset: AssetSnapshot) {
  const safeAmount = Math.max(Number(amount) || 0, 0);
  const multiple = asset.endValue / asset.startValue;
  const finalAmount = Math.round(safeAmount * multiple);
  const profitAmount = finalAmount - safeAmount;

  return {
    finalAmount,
    profitAmount,
    multiple,
    finalLabel: formatKoreanWon(finalAmount),
    profitLabel: formatKoreanWon(profitAmount),
  };
}
