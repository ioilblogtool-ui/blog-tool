export const BSH_META = {
  slug: "bitcoin-supply-holders-2026",
  title: "비트코인은 누가 갖고 있나 — 채굴량·국가·기업·사토시 보유 현황 2026",
  seoTitle: "비트코인 보유 현황 2026 | 국가·기업·사토시·채굴량 완전 분석",
  seoDescription:
    "비트코인 2,100만 개 중 지금까지 1,974만 개 채굴. 미국·중국·엘살바도르 국가 보유, Strategy 85만 BTC·테슬라·메타플래닛 기업 트레저리, 사토시 나카모토 잠든 110만 BTC까지 2026년 기준 완전 정리.",
  description:
    "비트코인 총 발행 한도 2,100만 개의 분포를 채굴 현황, 국가, 기업, 개인 보유 기준으로 분석합니다.",
  updatedAt: "2026-07",
  dataNote:
    "이 리포트의 보유 수량은 Bitcoin Treasuries, CoinGecko, 각국 공식 발표 자료를 기준으로 정리한 추정치입니다. 실제 보유량은 공개 범위에 따라 다를 수 있습니다.",
};

// ─── 공급 현황 ────────────────────────────────────────────────────────────────

export const BSH_SUPPLY = {
  maxSupply: 21_000_000,
  mined: 19_740_000,
  minedPct: 94.0,
  remaining: 1_260_000,
  remainingPct: 6.0,
  lastBtcYear: 2140,
  currentBlockReward: 3.125,
  nextHalvingYear: 2028,
  nextHalvingReward: 1.5625,
  lostEstimate: 3_700_000,
  lostPct: 17.6,
  circulatingEstimate: 16_040_000,
  circulatingPct: 76.4,
};

// ─── 보유 주체별 분포 ──────────────────────────────────────────────────────────

export type HolderCategory = {
  id: string;
  label: string;
  estimatedBtc: number;
  pctOfTotal: number;       // 전체 2,100만 기준
  pctOfMined: number;       // 채굴량 기준
  color: string;
  description: string;
};

export const BSH_CATEGORIES: HolderCategory[] = [
  {
    id: "retail",
    label: "개인 투자자 (소액·중형)",
    estimatedBtc: 7_500_000,
    pctOfTotal: 35.7,
    pctOfMined: 38.0,
    color: "#3b82f6",
    description: "거래소 계정 및 개인 지갑 보유자. 정확한 집계 불가, 온체인 분석 추정치.",
  },
  {
    id: "lost",
    label: "분실·접근 불가 추정",
    estimatedBtc: 3_700_000,
    pctOfTotal: 17.6,
    pctOfMined: 18.7,
    color: "#9ca3af",
    description: "비밀번호 분실, 사망, 하드웨어 파기 등으로 영구 접근 불가 추정. Chainalysis 분석 기준.",
  },
  {
    id: "satoshi",
    label: "사토시 나카모토 추정 (잠든 지갑)",
    estimatedBtc: 1_100_000,
    pctOfTotal: 5.2,
    pctOfMined: 5.6,
    color: "#f59e0b",
    description: "2009~2010년 채굴된 블록 중 단 한 번도 이동하지 않은 지갑. Sergio Lerner 연구 기준.",
  },
  {
    id: "exchange",
    label: "거래소 보관 (커스터디)",
    estimatedBtc: 2_800_000,
    pctOfTotal: 13.3,
    pctOfMined: 14.2,
    color: "#8b5cf6",
    description: "Coinbase, Binance, Kraken 등 주요 거래소 콜드·핫월렛 보유 추정치.",
  },
  {
    id: "corporate",
    label: "기업 트레저리",
    estimatedBtc: 850_000,
    pctOfTotal: 4.0,
    pctOfMined: 4.3,
    color: "#f7931a",
    description: "Strategy, 테슬라, 메타플래닛 등 상장·비상장 기업 공시 기준 합산.",
  },
  {
    id: "government",
    label: "국가·정부 보유",
    estimatedBtc: 560_000,
    pctOfTotal: 2.7,
    pctOfMined: 2.8,
    color: "#10b981",
    description: "미국 전략 비축, 중국 몰수분, 엘살바도르 국가 보유 등 공식 확인 기준.",
  },
  {
    id: "etf",
    label: "ETF·펀드 (운용 자산)",
    estimatedBtc: 1_200_000,
    pctOfTotal: 5.7,
    pctOfMined: 6.1,
    color: "#06b6d4",
    description: "미국 현물 ETF(BlackRock IBIT 등), Grayscale GBTC 등 금융상품 합산 추정치.",
  },
  {
    id: "miner",
    label: "채굴사 보유",
    estimatedBtc: 540_000,
    pctOfTotal: 2.6,
    pctOfMined: 2.7,
    color: "#ef4444",
    description: "Marathon Digital, Riot Platforms 등 주요 상장 채굴사 공시 기준.",
  },
];

// ─── 국가별 보유 ───────────────────────────────────────────────────────────────

export type CountryHolder = {
  rank: number;
  country: string;
  flag: string;
  estimatedBtc: number;
  source: string;
  status: "confirmed" | "estimated" | "seized";
  note: string;
};

export const BSH_COUNTRIES: CountryHolder[] = [
  {
    rank: 1,
    country: "미국",
    flag: "🇺🇸",
    estimatedBtc: 207_189,
    source: "재무부·DOJ 공시",
    status: "confirmed",
    note: "Silk Road·비트파이넥스 해킹 몰수분 + 트럼프 행정부 전략 비축 자산 지정(2025.03). 연방정부 보유 기준.",
  },
  {
    rank: 2,
    country: "중국",
    flag: "🇨🇳",
    estimatedBtc: 194_000,
    source: "PlusToken 등 몰수",
    status: "seized",
    note: "PlusToken 사기(2020), 각종 거래소 단속 등 몰수분 추정. 정부가 매각하지 않고 보유 중인 것으로 알려짐.",
  },
  {
    rank: 3,
    country: "영국",
    flag: "🇬🇧",
    estimatedBtc: 61_000,
    source: "HMRC·NCA",
    status: "seized",
    note: "각종 범죄 수익 몰수분. 일부 경매 매각 진행 중.",
  },
  {
    rank: 4,
    country: "엘살바도르",
    flag: "🇸🇻",
    estimatedBtc: 6_135,
    source: "엘살바도르 정부 공식",
    status: "confirmed",
    note: "2021년 세계 최초 비트코인 법정화폐 채택. 부켈레 대통령이 직접 매수 발표. DIP 매수 전략 공개.",
  },
  {
    rank: 5,
    country: "독일",
    flag: "🇩🇪",
    estimatedBtc: 49_858,
    source: "BKA 공시 후 매각",
    status: "seized",
    note: "2024년 약 5만 BTC 몰수 후 전량 매각. 현재 잔여 보유분은 소량.",
  },
  {
    rank: 6,
    country: "우크라이나",
    flag: "🇺🇦",
    estimatedBtc: 46_351,
    source: "추정",
    status: "estimated",
    note: "전쟁 기간 암호화폐 기부 수령 + 공공 기관 보유 추정치.",
  },
  {
    rank: 7,
    country: "부탄",
    flag: "🇧🇹",
    estimatedBtc: 13_029,
    source: "온체인 분석",
    status: "estimated",
    note: "국가 주도 채굴 프로그램. 수력발전 잉여전력 활용. 온체인 지갑 분석 기준.",
  },
];

// ─── 기업 트레저리 ─────────────────────────────────────────────────────────────

export type CorporateHolder = {
  rank: number;
  company: string;
  country: string;
  flag: string;
  ticker?: string;
  btcHeld: number;
  avgCostUsd?: number;
  currentValueUsd: number;   // $60,000 기준
  strategy: string;
  note: string;
  type: "listed" | "private";
};

export const BSH_CORPORATES: CorporateHolder[] = [
  {
    rank: 1,
    company: "Strategy (구 MicroStrategy)",
    country: "미국",
    flag: "🇺🇸",
    ticker: "MSTR",
    btcHeld: 847_363,
    avgCostUsd: 75_651,
    currentValueUsd: 50_841_780_000,
    strategy: "BTC 표준 전략 — 회사채·전환사채 발행해 BTC 매수. '비트코인 재무부' 모델",
    note: "마이클 세일러 공동창업자. 2020년 8월 최초 매수 시작. 현재 세계 최대 기업 BTC 보유자. (2026-06 말 기준)",
    type: "listed",
  },
  {
    rank: 2,
    company: "MARA Holdings (Marathon Digital)",
    country: "미국",
    flag: "🇺🇸",
    ticker: "MARA",
    btcHeld: 46_374,
    avgCostUsd: 32_000,
    currentValueUsd: 2_782_440_000,
    strategy: "채굴 + 보유 전략. 채굴한 BTC를 매각하지 않고 보유.",
    note: "나스닥 상장 채굴사. 채굴량 전량 보유 기조.",
    type: "listed",
  },
  {
    rank: 3,
    company: "Riot Platforms",
    country: "미국",
    flag: "🇺🇸",
    ticker: "RIOT",
    btcHeld: 18_692,
    avgCostUsd: 28_000,
    currentValueUsd: 1_121_520_000,
    strategy: "채굴 + 일부 매각. 운영비 조달 목적으로 일부 매각.",
    note: "텍사스 기반 대형 채굴사.",
    type: "listed",
  },
  {
    rank: 4,
    company: "테슬라",
    country: "미국",
    flag: "🇺🇸",
    ticker: "TSLA",
    btcHeld: 11_509,
    avgCostUsd: 32_000,
    currentValueUsd: 690_540_000,
    strategy: "2021년 15억 달러 매수 후 75% 매각. 현재 잔여분 유지.",
    note: "일론 머스크가 결제 수단으로 도입했다가 철회. 환경 문제 언급 후 매각.",
    type: "listed",
  },
  {
    rank: 5,
    company: "메타플래닛 (Metaplanet)",
    country: "일본",
    flag: "🇯🇵",
    ticker: "3350.T",
    btcHeld: 7_800,
    avgCostUsd: 65_000,
    currentValueUsd: 468_000_000,
    strategy: "일본판 Strategy 전략. 엔화 약세 헤지 + BTC 적립 목적",
    note: "도쿄증권거래소 상장. 2024년부터 BTC 적극 매수. '아시아 Strategy'로 불림.",
    type: "listed",
  },
  {
    rank: 6,
    company: "Galaxy Digital",
    country: "미국",
    flag: "🇺🇸",
    ticker: "BRPHF",
    btcHeld: 8_100,
    avgCostUsd: 40_000,
    currentValueUsd: 486_000_000,
    strategy: "암호화폐 금융서비스 회사. 운용 자산 일부를 BTC로 보유.",
    note: "마이크 노보그라츠 CEO. 기관 투자자 대상 BTC 서비스 제공.",
    type: "listed",
  },
  {
    rank: 7,
    company: "Coinbase",
    country: "미국",
    flag: "🇺🇸",
    ticker: "COIN",
    btcHeld: 9_000,
    avgCostUsd: 20_000,
    currentValueUsd: 540_000_000,
    strategy: "거래소 운영 준비금 + 자체 보유.",
    note: "나스닥 상장 최대 미국 거래소. 커스터디 서비스 별도.",
    type: "listed",
  },
  {
    rank: 8,
    company: "Block (구 Square)",
    country: "미국",
    flag: "🇺🇸",
    ticker: "SQ",
    btcHeld: 8_027,
    avgCostUsd: 27_000,
    currentValueUsd: 481_620_000,
    strategy: "잭 도시 CEO. 재무부 자산 5% BTC 편입 결정(2020).",
    note: "Cash App 비트코인 거래 서비스 운영.",
    type: "listed",
  },
];

// ─── 사토시 나카모토 ───────────────────────────────────────────────────────────

export const BSH_SATOSHI = {
  estimatedBtc: 1_100_000,
  pctOfMined: 5.57,
  valueAtCurrentUsd: 66_000_000_000,
  firstBlockDate: "2009년 1월 3일",
  lastKnownActivity: "2010년 12월",
  walletCount: 22_000,
  researchSource: "Sergio Lerner (2013) — 패턴 분석 기준",
  keyFacts: [
    "2009년 1월 3일 제네시스 블록 채굴 (50 BTC)",
    "2009~2010년 초기 채굴 지갑 약 2.2만 개 — 단 한 번도 이동 없음",
    "마지막 공개 메시지: 2010년 12월 비트코인 포럼",
    "실제 신원 미확인 — 개인 또는 그룹으로 추정",
    "$6만 기준 시총 약 66조 원 — 세계 최대 잠든 자산",
    "사토시 지갑이 움직이면 BTC 시장에 역대급 충격 예상",
  ],
  identityClaimants: [
    { name: "Craig Wright", country: "호주", verdict: "법원에서 사토시 아님 판결 (2024년 UK 고등법원)" },
    { name: "Nick Szabo", country: "미국", verdict: "본인 부인. '비트 골드' 개념 선구자" },
    { name: "Hal Finney", country: "미국", verdict: "2009년 첫 BTC 수신자. 2014년 사망" },
    { name: "Len Sassaman", country: "미국", verdict: "암호학자. 사망 후 추정론 제기" },
  ],
};

// ─── ETF 보유 현황 ─────────────────────────────────────────────────────────────

export type EtfHolder = {
  name: string;
  ticker: string;
  issuer: string;
  btcHeld: number;
  aum: string;
  launchDate: string;
  note: string;
};

export const BSH_ETFS: EtfHolder[] = [
  {
    name: "iShares Bitcoin Trust",
    ticker: "IBIT",
    issuer: "BlackRock",
    btcHeld: 570_000,
    aum: "약 $342억",
    launchDate: "2024년 1월",
    note: "세계 최대 자산운용사 운용. 출시 이후 역대급 자금 유입.",
  },
  {
    name: "Grayscale Bitcoin Trust",
    ticker: "GBTC",
    issuer: "Grayscale",
    btcHeld: 225_000,
    aum: "약 $135억",
    launchDate: "2013년 (신탁) / 2024년 ETF 전환",
    note: "2024년 1월 ETF 전환 후 대규모 자금 유출. 고비용 구조(운용보수 1.5%).",
  },
  {
    name: "Fidelity Wise Origin Bitcoin Fund",
    ticker: "FBTC",
    issuer: "Fidelity",
    btcHeld: 185_000,
    aum: "약 $111억",
    launchDate: "2024년 1월",
    note: "피델리티 자체 커스터디. 운용보수 0.25%.",
  },
  {
    name: "ARK 21Shares Bitcoin ETF",
    ticker: "ARKB",
    issuer: "ARK Invest + 21Shares",
    btcHeld: 55_000,
    aum: "약 $33억",
    launchDate: "2024년 1월",
    note: "캐시 우드 ARK Invest와 21Shares 공동 운용.",
  },
  {
    name: "Bitwise Bitcoin ETF",
    ticker: "BITB",
    issuer: "Bitwise",
    btcHeld: 40_000,
    aum: "약 $24억",
    launchDate: "2024년 1월",
    note: "운용보수 0.20%. 업계 최저 수준.",
  },
];

// ─── 채굴 현황 타임라인 ────────────────────────────────────────────────────────

export type MiningMilestone = {
  year: number;
  btcMined: number;
  pctMined: number;
  note: string;
};

export const BSH_MINING_TIMELINE: MiningMilestone[] = [
  { year: 2009, btcMined: 1_624_500, pctMined: 7.7, note: "제네시스 블록 — 블록 보상 50 BTC" },
  { year: 2012, btcMined: 10_500_000, pctMined: 50.0, note: "1차 반감기 (50→25 BTC)" },
  { year: 2016, btcMined: 15_750_000, pctMined: 75.0, note: "2차 반감기 (25→12.5 BTC)" },
  { year: 2020, btcMined: 18_375_000, pctMined: 87.5, note: "3차 반감기 (12.5→6.25 BTC)" },
  { year: 2024, btcMined: 19_687_500, pctMined: 93.75, note: "4차 반감기 (6.25→3.125 BTC)" },
  { year: 2026, btcMined: 19_740_000, pctMined: 94.0, note: "현재 (2026년 6월 기준 추정)" },
  { year: 2028, btcMined: 20_343_750, pctMined: 96.9, note: "5차 반감기 예정 (3.125→1.5625 BTC)" },
  { year: 2140, btcMined: 21_000_000, pctMined: 100.0, note: "마지막 비트코인 채굴 예상" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const BSH_FAQ = [
  {
    question: "비트코인 2,100만 개는 왜 이 숫자인가요?",
    answer:
      "사토시 나카모토가 설계 시 총 발행량을 코드에 직접 고정했습니다. 정확히는 20,999,999.9769 BTC가 최대 발행 가능량입니다. '2,100만'은 단순화한 표현입니다. 반감기 구조와 수학적 계산 결과가 이 숫자로 수렴합니다.",
  },
  {
    question: "분실된 비트코인은 얼마나 되나요?",
    answer:
      "체이널리시스는 약 370만 BTC(전체의 약 18%)가 영구 접근 불가 상태로 추정합니다. 비밀번호 분실, 하드 드라이브 폐기, 사망, 초기 채굴자 포기 등이 원인입니다. 제임스 하웰스의 웨일스 매립지 하드드라이브(8,000 BTC)가 유명 사례입니다.",
  },
  {
    question: "사토시 나카모토의 비트코인이 움직이면 어떻게 되나요?",
    answer:
      "약 110만 BTC가 갑자기 이동하면 시장에 대규모 매도 우려가 생겨 가격 충격이 발생할 수 있습니다. 반면 사토시가 여전히 살아있다는 증거가 되어 BTC 가치에 대한 신뢰를 높일 수도 있습니다. 지금까지 17년간 단 한 번도 이동하지 않았습니다.",
  },
  {
    question: "미국 정부가 비트코인을 전략 비축 자산으로 지정한 이유는 무엇인가요?",
    answer:
      "트럼프 대통령이 2025년 3월 행정명령으로 연방정부 보유 BTC를 '전략 비축 자산(Strategic Bitcoin Reserve)'으로 지정했습니다. 달러 패권 유지, 국가 부채 헤지, 디지털 자산 경쟁에서 우위 확보 등이 목적으로 제시됐습니다.",
  },
  {
    question: "Strategy(마이크로스트래티지)는 왜 이렇게 많이 샀나요?",
    answer:
      "마이클 세일러 공동창업자가 2020년 '달러 약세·인플레이션 헤지' 논리로 기업 재무부 자산을 BTC로 전환하는 전략을 채택했습니다. 이후 회사채·전환사채·주식 발행으로 자금을 조달해 BTC를 지속 매수하는 'BTC 표준 전략'을 실행 중입니다.",
  },
  {
    question: "비트코인 현물 ETF가 출시되면서 무엇이 달라졌나요?",
    answer:
      "2024년 1월 미국 SEC가 비트코인 현물 ETF를 승인하면서 기관 투자자가 직접 BTC를 보관하지 않고도 투자할 수 있게 됐습니다. 출시 첫 해 BlackRock IBIT 등에만 570만 BTC 이상이 유입됐고, 기관 수요가 BTC 공급의 상당 부분을 흡수하는 구조가 만들어졌습니다.",
  },
];

export const BSH_RELATED_LINKS = [
  {
    label: "비트코인 연도별 수익률 역사 2011~2026",
    href: "/reports/bitcoin-annual-return-history/",
    desc: "반감기 사이클·폭락 구간·투자 시뮬레이터",
  },
  {
    label: "비트코인·금·S&P500 10년 수익 비교",
    href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/",
    desc: "세 자산 장기 수익률·MDD·변동성 비교",
  },
  {
    label: "이더리움 연도별 수익률 역사 2015~2026",
    href: "/reports/ethereum-historical-returns-2015-2026/",
    desc: "ETH 연도별 가격·수익률·업그레이드 히스토리",
  },
];

export const BSH_SOURCE_LINKS = [
  { label: "Bitcoin Treasuries (기업·국가 보유 추적)", url: "https://bitcointreasuries.net" },
  { label: "Chainalysis 분실 BTC 분석", url: "https://www.chainalysis.com" },
  { label: "CoinGecko 공급 데이터", url: "https://www.coingecko.com" },
  { label: "SEC EDGAR (ETF 보유량 공시)", url: "https://www.sec.gov/cgi-bin/browse-edgar" },
];

// 포맷 헬퍼
export const formatBtc = (v: number) => {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M BTC";
  if (v >= 1_000) return v.toLocaleString("en-US") + " BTC";
  return v + " BTC";
};

export const formatUsdBillion = (v: number) => {
  if (v >= 1e12) return "$" + (v / 1e12).toFixed(1) + "조";
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(0) + "M";
  return "$" + v.toLocaleString();
};
