export const BTC_META = {
  slug: "bitcoin-annual-return-history",
  title: "비트코인 연도별 수익률 역사 2011~2026",
  seoTitle: "비트코인 연도별 수익률 2011~2026 | 반감기·폭락·최고가 완전 정리",
  seoDescription:
    "비트코인 2011년부터 2026년까지 연도별 시작가·종가·수익률 전체 정리. 반감기 사이클별 수익 패턴, 역대 최대 낙폭, 100만 원 투자 시뮬레이터까지.",
  description:
    "비트코인 연도별 가격 변화와 수익률, 반감기 사이클, 폭락 구간을 한눈에 정리합니다.",
  updatedAt: "2026-06",
  dataNote:
    "이 리포트의 가격 데이터는 CoinGecko·CoinMarketCap 공개 기록을 기준으로 정리했습니다. 연도별 수익률은 매년 1월 1일 기준가 대비 12월 31일 종가로 산출한 참고 수치입니다. 2025년·2026년은 추정·참고값입니다.",
};

export type BtcYearRow = {
  year: number;
  startPrice: number;       // 연초 USD
  endPrice: number;         // 연말 USD (2025·2026은 추정)
  returnPct: number;        // 연간 수익률 %
  highlight: boolean;       // 반감기 해
  halvingNote?: string;
  keyEvent: string;
  isEstimate?: boolean;
};

export const BTC_YEARS: BtcYearRow[] = [
  {
    year: 2011,
    startPrice: 0.30,
    endPrice: 4.72,
    returnPct: 1473,
    highlight: false,
    keyEvent: "최초 거래소(Mt.Gox) 해킹·$31 최고가 후 폭락",
  },
  {
    year: 2012,
    startPrice: 4.72,
    endPrice: 13.45,
    returnPct: 185,
    highlight: true,
    halvingNote: "1차 반감기 (2012.11.28) 50→25 BTC",
    keyEvent: "1차 반감기 — 채굴 보상 절반으로 감소",
  },
  {
    year: 2013,
    startPrice: 13.45,
    endPrice: 732,
    returnPct: 5341,
    highlight: false,
    keyEvent: "사이프러스 금융위기·중국 수요 급증·$1,242 최고가",
  },
  {
    year: 2014,
    startPrice: 732,
    endPrice: 311,
    returnPct: -57,
    highlight: false,
    keyEvent: "Mt.Gox 85만 BTC 도난·거래소 파산",
  },
  {
    year: 2015,
    startPrice: 311,
    endPrice: 430,
    returnPct: 38,
    highlight: false,
    keyEvent: "저점 탈출, 기관 블록체인 연구 시작",
  },
  {
    year: 2016,
    startPrice: 430,
    endPrice: 963,
    returnPct: 124,
    highlight: true,
    halvingNote: "2차 반감기 (2016.07.09) 25→12.5 BTC",
    keyEvent: "2차 반감기·이더리움 DAO 해킹 사태",
  },
  {
    year: 2017,
    startPrice: 963,
    endPrice: 13880,
    returnPct: 1341,
    highlight: false,
    keyEvent: "CME 선물 상장·ICO 붐·$19,783 최고가",
  },
  {
    year: 2018,
    startPrice: 13880,
    endPrice: 3742,
    returnPct: -73,
    highlight: false,
    keyEvent: "ICO 버블 붕괴·SEC 규제 강화·크립토 겨울",
  },
  {
    year: 2019,
    startPrice: 3742,
    endPrice: 7195,
    returnPct: 92,
    highlight: false,
    keyEvent: "Bakkt 출범·페이스북 리브라 발표",
  },
  {
    year: 2020,
    startPrice: 7195,
    endPrice: 28990,
    returnPct: 303,
    highlight: true,
    halvingNote: "3차 반감기 (2020.05.11) 12.5→6.25 BTC",
    keyEvent: "3차 반감기·코로나 이후 유동성 급증·MicroStrategy 매수 시작",
  },
  {
    year: 2021,
    startPrice: 28990,
    endPrice: 46311,
    returnPct: 60,
    highlight: false,
    keyEvent: "코인베이스 나스닥 상장·엘살바도르 법정화폐 채택·$69,000 최고가",
  },
  {
    year: 2022,
    startPrice: 46311,
    endPrice: 16618,
    returnPct: -64,
    highlight: false,
    keyEvent: "루나·FTX 붕괴·금리 급등·크립토 겨울 2",
  },
  {
    year: 2023,
    startPrice: 16618,
    endPrice: 42208,
    returnPct: 154,
    highlight: false,
    keyEvent: "비트코인 ETF 승인 기대감·BRC-20 토큰 열풍",
  },
  {
    year: 2024,
    startPrice: 42208,
    endPrice: 93800,
    returnPct: 122,
    highlight: true,
    halvingNote: "4차 반감기 (2024.04.20) 6.25→3.125 BTC",
    keyEvent: "4차 반감기·미국 현물 ETF 승인(1월)·$108,353 최고가",
  },
  {
    year: 2025,
    startPrice: 93800,
    endPrice: 94200,
    returnPct: 0.4,
    highlight: false,
    keyEvent: "트럼프 국가 비축 자산 행정명령·$109,350 최고가(1월)·4월 $74k 급락 후 회복",
    isEstimate: true,
  },
  {
    year: 2026,
    startPrice: 94200,
    endPrice: 60000,
    returnPct: -36.3,
    highlight: false,
    keyEvent: "2026년 6월 기준 YTD — 연초 대비 하락 (연중 진행 중)",
    isEstimate: true,
  },
];

export type HalvingCycle = {
  cycle: number;
  halvingDate: string;
  halvingBlock: number;
  rewardBefore: string;
  rewardAfter: string;
  priceAtHalving: number;
  price1YearBefore: number;
  price1YearAfter: number;
  peakPrice: number;
  peakDate: string;
  returnFrom1YearBefore: number;
  returnPeakFromHalving: number;
  note: string;
};

export const BTC_HALVINGS: HalvingCycle[] = [
  {
    cycle: 1,
    halvingDate: "2012년 11월 28일",
    halvingBlock: 210000,
    rewardBefore: "50 BTC",
    rewardAfter: "25 BTC",
    priceAtHalving: 12.35,
    price1YearBefore: 4.72,
    price1YearAfter: 1242,
    peakPrice: 1242,
    peakDate: "2013년 11월",
    returnFrom1YearBefore: 24194,
    returnPeakFromHalving: 9957,
    note: "반감기 1년 전~이후 최고가까지 약 100배. 사이프러스 금융위기 수혜.",
  },
  {
    cycle: 2,
    halvingDate: "2016년 7월 9일",
    halvingBlock: 420000,
    rewardBefore: "25 BTC",
    rewardAfter: "12.5 BTC",
    priceAtHalving: 650,
    price1YearBefore: 270,
    price1YearAfter: 2526,
    peakPrice: 19783,
    peakDate: "2017년 12월",
    returnFrom1YearBefore: 7227,
    returnPeakFromHalving: 2943,
    note: "반감기 후 18개월 만에 최고가 $19,783 달성. ICO 붐 겹침.",
  },
  {
    cycle: 3,
    halvingDate: "2020년 5월 11일",
    halvingBlock: 630000,
    rewardBefore: "12.5 BTC",
    rewardAfter: "6.25 BTC",
    priceAtHalving: 8740,
    price1YearBefore: 7440,
    price1YearAfter: 57750,
    peakPrice: 69000,
    peakDate: "2021년 11월",
    returnFrom1YearBefore: 828,
    returnPeakFromHalving: 689,
    note: "코로나 유동성·기관 매수(MicroStrategy, Tesla) 맞물려 폭발적 상승.",
  },
  {
    cycle: 4,
    halvingDate: "2024년 4월 20일",
    halvingBlock: 840000,
    rewardBefore: "6.25 BTC",
    rewardAfter: "3.125 BTC",
    priceAtHalving: 63800,
    price1YearBefore: 28800,
    price1YearAfter: 60000,
    peakPrice: 109350,
    peakDate: "2025년 1월",
    returnFrom1YearBefore: 108,
    returnPeakFromHalving: 71,
    note: "현물 ETF 승인(2024.01) 이미 선반영. 이전 사이클보다 상승폭 축소. 현재가 기준 반감기 전 1년 대비 +108% (참고).",
  },
];

export type MddEvent = {
  label: string;
  period: string;
  peakPrice: number;
  troughPrice: number;
  drawdownPct: number;
  recoveryMonths: number | null;
  recoveryDate: string | null;
  cause: string;
};

export const BTC_MDD_EVENTS: MddEvent[] = [
  {
    label: "Mt.Gox 폭락",
    period: "2011년 6월~11월",
    peakPrice: 31.91,
    troughPrice: 2.01,
    drawdownPct: -94,
    recoveryMonths: 24,
    recoveryDate: "2013년 3월",
    cause: "Mt.Gox 해킹·거래소 불신",
  },
  {
    label: "Mt.Gox 파산",
    period: "2013년 12월~2015년 1월",
    peakPrice: 1242,
    troughPrice: 177,
    drawdownPct: -86,
    recoveryMonths: 35,
    recoveryDate: "2017년 1월",
    cause: "Mt.Gox 파산·규제 불확실성",
  },
  {
    label: "크립토 겨울 1",
    period: "2017년 12월~2018년 12월",
    peakPrice: 19783,
    troughPrice: 3122,
    drawdownPct: -84,
    recoveryMonths: 37,
    recoveryDate: "2020년 12월",
    cause: "ICO 버블 붕괴·SEC 규제·기관 이탈",
  },
  {
    label: "코로나 급락",
    period: "2020년 3월",
    peakPrice: 10500,
    troughPrice: 4000,
    drawdownPct: -62,
    recoveryMonths: 2,
    recoveryDate: "2020년 5월",
    cause: "코로나 공포·전 자산 동반 급락",
  },
  {
    label: "크립토 겨울 2",
    period: "2021년 11월~2022년 11월",
    peakPrice: 69000,
    troughPrice: 15600,
    drawdownPct: -77,
    recoveryMonths: null,
    recoveryDate: null,
    cause: "루나 붕괴·셀시우스 청산·FTX 파산",
  },
  {
    label: "2025년 관세 폭락",
    period: "2025년 1월~4월",
    peakPrice: 109350,
    troughPrice: 74000,
    drawdownPct: -32,
    recoveryMonths: 2,
    recoveryDate: "2025년 6월",
    cause: "트럼프 관세 충격·글로벌 리스크 오프",
  },
];

export const BTC_KPI = {
  currentPrice: 60000,
  currentPriceDate: "2026년 6월 기준",
  totalSupply: 21000000,
  minedSupply: 19740000,
  minedPct: 94,
  nextHalvingYear: 2028,
  bestYear: { year: 2013, returnPct: 5341 },
  worstYear: { year: 2018, returnPct: -73 },
  halvingAvgReturn1Y: 537,
  allTimeHigh: 109350,
  allTimeHighDate: "2025년 1월",
};

export const BTC_SIMULATOR_YEARS = BTC_YEARS.filter((y) => y.year <= 2024).map((y) => ({
  year: y.year,
  startPrice: y.startPrice,
}));

export const BTC_FAQ = [
  {
    question: "비트코인은 왜 4년마다 반감기가 있나요?",
    answer:
      "사토시 나카모토가 설계한 희소성 메커니즘입니다. 약 21만 블록(약 4년)마다 채굴 보상이 절반으로 줄어, 총 발행량이 2,100만 개를 넘지 않도록 설계됩니다. 공급이 줄면 수요가 유지될 때 가격 상승 압력이 생기는 구조입니다.",
  },
  {
    question: "역대 최고 연간 수익률은 언제였나요?",
    answer:
      "2013년으로, 연초 $13.45에서 연말 $732까지 약 5,341% 상승했습니다. 같은 해 11월에는 $1,242까지 치솟기도 했습니다. 1차 반감기(2012년 11월) 이후 공급 감소와 사이프러스 금융위기로 인한 대안 자산 수요가 겹친 결과입니다.",
  },
  {
    question: "비트코인에 투자할 때 가장 위험했던 시기는 언제인가요?",
    answer:
      "2018년이 가장 큰 연간 손실(-73%)이었지만, 최대 낙폭(MDD) 기준으로는 2011년 Mt.Gox 해킹 이후 -94%가 역대 최대입니다. 2013~2015년 Mt.Gox 파산 이후에도 $1,242에서 $177까지 -86% 하락한 바 있습니다.",
  },
  {
    question: "반감기 이후에는 항상 가격이 오르나요?",
    answer:
      "역사적으로 반감기 이후 12~18개월 내에 전고점을 경신하는 패턴이 반복됐습니다. 그러나 4차 반감기(2024년)는 현물 ETF 승인으로 이미 선반영된 부분이 있어 이전 사이클보다 상승폭이 작았습니다. 과거 패턴이 미래를 보장하지 않습니다.",
  },
  {
    question: "비트코인 가격은 달러로만 보나요?",
    answer:
      "이 리포트는 USD 기준 가격을 사용합니다. 원화(KRW) 투자자는 환율 변동을 추가로 고려해야 합니다. 원화 강세 시기에는 달러 기준 수익보다 실수령이 적을 수 있습니다.",
  },
  {
    question: "비트코인 총 발행량은 얼마인가요?",
    answer:
      "최대 발행량은 2,100만 BTC로 고정됩니다. 2026년 6월 기준 약 1,974만 개(94%)가 이미 채굴됐습니다. 나머지 약 126만 개는 앞으로 100년 이상에 걸쳐 점진적으로 채굴될 예정입니다(마지막 비트코인 채굴 예상 시점: 2140년경).",
  },
];

export const BTC_RELATED_LINKS = [
  {
    label: "이더리움 연도별 수익률 역사 2015~2026",
    href: "/reports/ethereum-historical-returns-2015-2026/",
    desc: "ETH 연도별 가격·수익률, 비탈릭·업그레이드 히스토리",
  },
  {
    label: "비트코인·금·S&P500 10년 수익 비교",
    href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
    desc: "세 자산 장기 수익률·MDD·변동성 비교",
  },
  {
    label: "미국주식 환차손익 계산기",
    href: "/tools/us-stock-exchange-profit-calculator/",
    desc: "달러 투자 원화 환산 수익 계산",
  },
];

export const BTC_SOURCE_LINKS = [
  { label: "CoinGecko 가격 데이터", url: "https://www.coingecko.com" },
  { label: "CoinMarketCap 역사 데이터", url: "https://coinmarketcap.com" },
  { label: "Bitcoin Halving History", url: "https://www.bitcoinblockhalf.com" },
];
