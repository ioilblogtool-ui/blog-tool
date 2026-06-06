export interface EthereumReturnRow {
  year: number;
  startPrice: number | null;
  endPrice: number;
  returnRate: number | null;
  highPrice?: number;
  lowPrice?: number;
  marketPhase: string;
  mainEvent: string;
  interpretation: string;
}

export interface EthereumMilestone {
  year: string;
  title: string;
  body: string;
  tag: string;
}

export interface EthereumTheme {
  title: string;
  summary: string;
  bullets: string[];
}

export interface EthereumSource {
  label: string;
  organization: string;
  href: string;
  note: string;
}

export interface EthereumFaq {
  q: string;
  a: string;
}

export const ETHEREUM_HISTORICAL_RETURNS_SLUG = "ethereum-historical-returns-2015-2026";

export const ethereumReturnRows: EthereumReturnRow[] = [
  {
    year: 2015,
    startPrice: 2.83,
    endPrice: 0.9335,
    returnRate: null,
    highPrice: 3.54,
    lowPrice: 0.4209,
    marketPhase: "출시 초기",
    mainEvent: "메인넷 출시, 첫 거래 데이터 형성",
    interpretation:
      "거래소별 초기 가격 차이가 커서 연간 수익률보다 출시 가격, ICO 가격, 첫 종가를 구분해 보는 해입니다.",
  },
  {
    year: 2016,
    startPrice: 0.9337,
    endPrice: 7.97,
    returnRate: 753.58,
    highPrice: 21.52,
    lowPrice: 0.9298,
    marketPhase: "스마트컨트랙트 실험기",
    mainEvent: "The DAO 해킹, Ethereum/Ethereum Classic 분기",
    interpretation:
      "가격은 크게 올랐지만 DAO 사태로 스마트컨트랙트 리스크와 거버넌스 논쟁이 동시에 드러났습니다.",
  },
  {
    year: 2017,
    startPrice: 7.98,
    endPrice: 756.73,
    returnRate: 9383,
    highPrice: 881.94,
    lowPrice: 7.98,
    marketPhase: "ICO 폭발",
    mainEvent: "ERC-20 토큰 발행과 ICO 열풍",
    interpretation:
      "이더리움이 단순 코인이 아니라 토큰 발행 플랫폼으로 인식되며 역사상 가장 큰 연간 상승률을 기록한 구간입니다.",
  },
  {
    year: 2018,
    startPrice: 755.76,
    endPrice: 133.37,
    returnRate: -82.35,
    highPrice: 1433,
    lowPrice: 82.83,
    marketPhase: "버블 붕괴",
    mainEvent: "ICO 프로젝트 부실화, 크립토 겨울",
    interpretation:
      "전년의 과열이 꺼지며 -80%대 하락을 겪었습니다. ETH는 네트워크의 가능성과 가격 변동성이 동시에 각인됐습니다.",
  },
  {
    year: 2019,
    startPrice: 133.42,
    endPrice: 130.2,
    returnRate: -2.41,
    highPrice: 365.07,
    lowPrice: 102.39,
    marketPhase: "정체와 구축",
    mainEvent: "DeFi 기초 프로토콜 성장",
    interpretation:
      "가격은 거의 제자리였지만 MakerDAO, Uniswap, Compound 같은 DeFi 기반이 쌓인 해로 볼 수 있습니다.",
  },
  {
    year: 2020,
    startPrice: 130.79,
    endPrice: 737.11,
    returnRate: 463.56,
    highPrice: 753.89,
    lowPrice: 89.35,
    marketPhase: "DeFi Summer",
    mainEvent: "유동성 채굴, DEX, 대출 프로토콜 급성장",
    interpretation:
      "ETH가 DeFi의 담보자산과 수수료 자산으로 쓰이면서 네트워크 사용량과 가격이 함께 반응했습니다.",
  },
  {
    year: 2021,
    startPrice: 728.75,
    endPrice: 3679,
    returnRate: 404.84,
    highPrice: 4858,
    lowPrice: 717.53,
    marketPhase: "NFT와 L1 경쟁",
    mainEvent: "NFT 대중화, EIP-1559, 가스비 급등",
    interpretation:
      "NFT와 DeFi가 폭발하며 수요가 커졌고, 동시에 높은 가스비가 L2와 대체 L1 논쟁을 키웠습니다.",
  },
  {
    year: 2022,
    startPrice: 3765,
    endPrice: 1196,
    returnRate: -68.23,
    highPrice: 3883,
    lowPrice: 1008,
    marketPhase: "Merge와 하락장",
    mainEvent: "Proof of Work에서 Proof of Stake로 전환",
    interpretation:
      "가격은 약세였지만 The Merge로 에너지 사용량을 크게 줄이고 스테이킹 중심의 네트워크로 바뀌었습니다.",
  },
  {
    year: 2023,
    startPrice: 1200,
    endPrice: 2281,
    returnRate: 89.98,
    highPrice: 2441,
    lowPrice: 1194,
    marketPhase: "회복과 스테이킹",
    mainEvent: "Shanghai/Capella 업그레이드, 출금 가능한 스테이킹",
    interpretation:
      "스테이킹 출금 불확실성이 줄며 ETH가 수익을 낳는 네트워크 자산이라는 관점이 강화됐습니다.",
  },
  {
    year: 2024,
    startPrice: 2351,
    endPrice: 3340,
    returnRate: 42.07,
    highPrice: 4094,
    lowPrice: 2155,
    marketPhase: "ETF와 L2 확장",
    mainEvent: "미국 현물 ETH ETF 승인, Dencun 업그레이드",
    interpretation:
      "기관 접근성이 좋아졌고 L2 비용을 낮추는 방향의 업그레이드가 진행되며 Ethereum이 정산층으로 재해석됐습니다.",
  },
  {
    year: 2025,
    startPrice: 3360,
    endPrice: 2971,
    returnRate: -11.59,
    highPrice: 4952,
    lowPrice: 1396,
    marketPhase: "트레저리와 스테이블코인",
    mainEvent: "기업 ETH 보유, 스테이블코인·RWA 논의 확대",
    interpretation:
      "가격은 약세였지만 기업 트레저리와 온체인 달러 결제, RWA, L2 사용량이 투자 서사의 중심으로 올라왔습니다.",
  },
  {
    year: 2026,
    startPrice: 3000,
    endPrice: 1581,
    returnRate: -47.3,
    highPrice: 3394,
    lowPrice: 1546,
    marketPhase: "YTD 조정",
    mainEvent: "AI 에이전트 결제, 스테이블코인 레일 경쟁",
    interpretation:
      "2026년 수익률은 연중 값입니다. 가격은 조정 중이지만 AI 에이전트 결제와 스테이블코인 정산 레이어 논의가 계속됩니다.",
  },
];

export const ethereumMilestones: EthereumMilestone[] = [
  {
    year: "2013-2014",
    title: "비탈릭 부테린의 백서와 ICO",
    tag: "창업",
    body:
      "비탈릭은 비트코인이 돈의 장부라면, 더 일반적인 프로그램을 실행하는 블록체인도 가능하다고 봤습니다. 2014년 크라우드세일은 ETH를 네트워크 사용료이자 초기 자금 조달 수단으로 만들었습니다.",
  },
  {
    year: "2015",
    title: "Ethereum 메인넷 출시",
    tag: "출시",
    body:
      "2015년 7월 메인넷이 열리며 스마트컨트랙트와 분산 애플리케이션을 실제로 배포할 수 있는 범용 블록체인이 등장했습니다.",
  },
  {
    year: "2016",
    title: "The DAO와 체인 분기",
    tag: "위기",
    body:
      "DAO 해킹은 코드 취약점, 불변성, 커뮤니티 거버넌스를 한꺼번에 드러낸 사건입니다. 이후 Ethereum과 Ethereum Classic으로 갈라졌습니다.",
  },
  {
    year: "2017",
    title: "ICO와 ERC-20 표준",
    tag: "토큰",
    body:
      "ERC-20은 토큰 발행을 표준화했고, 수많은 프로젝트가 Ethereum 위에서 자금을 조달했습니다. 2017년 가격 급등의 핵심 배경입니다.",
  },
  {
    year: "2020",
    title: "DeFi Summer",
    tag: "금융",
    body:
      "Uniswap, Aave, Compound, MakerDAO 같은 프로토콜이 사용자를 모으며 Ethereum은 탈중앙 금융의 기본 결제·담보 레이어가 됐습니다.",
  },
  {
    year: "2021",
    title: "NFT와 EIP-1559",
    tag: "NFT",
    body:
      "NFT 거래가 대중화되며 블록공간 수요가 폭증했고, EIP-1559는 수수료 구조와 ETH 소각 메커니즘을 도입했습니다.",
  },
  {
    year: "2022",
    title: "The Merge",
    tag: "PoS",
    body:
      "Ethereum은 작업증명에서 지분증명으로 전환했습니다. 가격과 별개로 네트워크 경제 구조와 에너지 사용 구조가 바뀐 가장 큰 업그레이드입니다.",
  },
  {
    year: "2024-2026",
    title: "L2, 스테이블코인, AI 에이전트 결제",
    tag: "인프라",
    body:
      "Ethereum은 모든 사용자가 직접 L1에서 거래하는 체인보다, L2와 스테이블코인이 연결되는 정산층으로 해석되는 비중이 커졌습니다.",
  },
];

export const ethereumThemes: EthereumTheme[] = [
  {
    title: "ICO: ETH는 토큰 발행 시장의 연료였다",
    summary:
      "2017년 상승의 핵심은 단순 투기만이 아니라 ERC-20 기반 토큰 발행이 쉬워졌다는 점입니다.",
    bullets: [
      "프로젝트는 자체 체인을 만들지 않고 Ethereum 위에서 토큰을 발행할 수 있었습니다.",
      "ETH는 ICO 참여와 네트워크 수수료에 쓰이며 수요가 커졌습니다.",
      "2018년 하락은 ICO 과열과 부실 프로젝트 정리의 반작용이었습니다.",
    ],
  },
  {
    title: "스마트컨트랙트: 가격보다 중요한 차별점",
    summary:
      "Ethereum의 핵심은 ETH라는 코인 자체보다, 조건에 따라 자동 실행되는 계약을 범용적으로 배포할 수 있다는 점입니다.",
    bullets: [
      "대출, 거래소, NFT, 스테이블코인, DAO가 같은 실행 환경을 공유합니다.",
      "프로그램 오류가 곧 돈의 손실로 이어질 수 있어 보안 리스크도 큽니다.",
      "가스비는 네트워크 사용량과 ETH 수요를 연결하는 지표입니다.",
    ],
  },
  {
    title: "DeFi와 NFT: 사용량이 가격 서사가 된 시기",
    summary:
      "2020년 DeFi, 2021년 NFT는 Ethereum이 실제 사용되는 네트워크라는 인식을 강화했습니다.",
    bullets: [
      "DEX, 대출, 스테이블코인 담보, 유동성 공급이 ETH 수요를 만들었습니다.",
      "NFT는 예술·게임·멤버십 등 비금융 사용 사례를 대중화했습니다.",
      "동시에 높은 가스비는 L2 확장의 필요성을 크게 키웠습니다.",
    ],
  },
  {
    title: "Merge와 스테이킹: 보유 자산에서 생산 자산으로",
    summary:
      "2022년 Merge 이후 ETH는 네트워크 보안에 예치하고 보상을 받을 수 있는 자산으로 바뀌었습니다.",
    bullets: [
      "검증자는 ETH를 예치하고 블록 검증 보상을 받습니다.",
      "스테이킹 수익률은 ETH를 주식 배당처럼 보이게 만들지만, 가격 변동성과 슬래싱 리스크가 있습니다.",
      "BitMine 같은 ETH 트레저리 기업은 보유 ETH를 스테이킹해 반복 수익을 기대하는 모델을 설명합니다.",
    ],
  },
  {
    title: "L2와 스테이블코인: Ethereum은 결제의 백엔드가 됐다",
    summary:
      "Base, Arbitrum, Optimism, Polygon 같은 확장 네트워크는 저렴한 거래를 처리하고 Ethereum을 정산층으로 활용합니다.",
    bullets: [
      "스테이블코인은 달러 표시 가치와 온체인 정산을 결합합니다.",
      "AI 에이전트는 API·데이터·툴 사용료를 작은 단위로 자주 결제해야 해 온체인 결제와 잘 맞습니다.",
      "Ethereum 생태계는 토큰 표준, 지갑, 스마트컨트랙트, L2가 이미 있어 결제 실험의 기본 인프라가 됩니다.",
    ],
  },
];

export const ethereumSources: EthereumSource[] = [
  {
    label: "Ethereum Returns by Year",
    organization: "SlickCharts",
    href: "https://www.slickcharts.com/currency/ETH/returns",
    note: "전년 종가 대비 당해 종가 기준 연간 수익률 보조 검증값입니다.",
  },
  {
    label: "ETH Historical Prices",
    organization: "CoinLore",
    href: "https://www.coinlore.com/coin/ethereum/historical-data",
    note: "2015년부터 2026년까지 연도별 시작가, 종가, 고가, 저가, 수익률 표의 기본 데이터입니다.",
  },
  {
    label: "What is Ethereum?",
    organization: "ethereum.org",
    href: "https://ethereum.org/en/what-is-ethereum/",
    note: "Ethereum의 스마트컨트랙트, dApp, 네트워크 목적을 설명하는 공식 문서입니다.",
  },
  {
    label: "The Merge",
    organization: "ethereum.org",
    href: "https://ethereum.org/en/roadmap/merge/",
    note: "작업증명에서 지분증명으로 전환된 Merge 설명 자료입니다.",
  },
  {
    label: "Stablecoins and AI agent payments",
    organization: "CoinDesk",
    href: "https://www.coindesk.com/business/2026/05/21/crypto-rails-are-becoming-the-default-payment-layer-for-ai-agents-report-says",
    note: "AI 에이전트 결제와 스테이블코인 레일 논의의 최신 맥락을 확인하는 보조 자료입니다.",
  },
];

export const ethereumFaq: EthereumFaq[] = [
  {
    q: "이더리움은 2015년부터 2026년까지 얼마나 올랐나요?",
    a: "2015년 말 약 0.9335달러에서 2026년 6월 초 약 1,581달러 수준으로 커졌습니다. 단, 2026년 값은 연중 값이며 거래소·데이터 제공사마다 시작가와 종가가 조금 다를 수 있습니다.",
  },
  {
    q: "이더리움 최고 수익률 연도는 언제인가요?",
    a: "CoinLore 연도별 시작가·종가 기준으로는 2017년 약 +9,383%가 가장 큽니다. ICO와 ERC-20 토큰 발행 열풍이 핵심 배경입니다.",
  },
  {
    q: "SlickCharts 수익률과 CoinLore 수익률이 왜 다른가요?",
    a: "데이터 제공사마다 거래소 기준, 첫 거래일, 종가 산정 시각, 연중 현재가 반영 방식이 다릅니다. 그래서 이 페이지는 전체 연도 표는 CoinLore를 기본으로, 2021~2026 주요 연도 해석은 SlickCharts 값도 함께 참고합니다.",
  },
  {
    q: "The Merge가 가격을 바로 올렸나요?",
    a: "2022년에는 Merge가 있었지만 ETH 가격은 -60%대 하락했습니다. 업그레이드는 네트워크 구조를 바꾼 사건이고, 단기 가격은 금리, 레버리지 청산, 시장 심리의 영향을 크게 받았습니다.",
  },
  {
    q: "왜 AI 에이전트와 스테이블코인 글에서 Ethereum이 나오나요?",
    a: "AI 에이전트는 API·데이터·툴 사용료를 작은 단위로 자동 결제해야 합니다. Ethereum 생태계는 스테이블코인, 스마트컨트랙트, 지갑, L2가 이미 연결돼 있어 이런 결제 실험의 기본 레일로 자주 언급됩니다.",
  },
];

export const ethereumRelatedLinks = [
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 계산기" },
  { href: "/tools/coin-tax-calculator/", label: "코인 세금 계산기" },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인·금·S&P500 10년 비교" },
  { href: "/reports/coin-exchange-comparison-2026/", label: "코인 거래소 수수료 비교" },
];

export const ethereumHistoricalReturns20152026 = {
  meta: {
    slug: ETHEREUM_HISTORICAL_RETURNS_SLUG,
    title: "이더리움 역사 수익률 2015-2026 | 매년 얼마 올랐나",
    description:
      "이더리움 2015~2026년 연도별 가격과 수익률을 ICO, 스마트컨트랙트, DeFi, NFT, Merge, 스테이킹, L2, 스테이블코인 흐름과 함께 정리합니다.",
    h1: "이더리움 역사 수익률 2015-2026: 매년 얼마 올랐나",
    eyebrow: "암호화폐 역사 수익률",
    updatedAt: "2026.06.06",
    dataBasis: "CoinLore 연도별 가격 데이터, SlickCharts 연간 수익률 보조 확인, ethereum.org 공식 설명",
    caution:
      "암호화폐 가격은 거래소와 데이터 제공사 기준에 따라 다를 수 있습니다. 2026년 수익률은 연중 값이며 투자 권유가 아닌 과거 데이터 해석 자료입니다.",
  },
  rows: ethereumReturnRows,
  milestones: ethereumMilestones,
  themes: ethereumThemes,
  sources: ethereumSources,
  faq: ethereumFaq,
  relatedLinks: ethereumRelatedLinks,
};

export function formatUsd(value: number | null) {
  if (value === null) return "초기 거래가 차이";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 10) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
}

export function formatReturn(value: number | null) {
  if (value === null) return "기준 차이";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%`;
}

export function getReturnTone(value: number | null) {
  if (value === null) return "neutral";
  if (value >= 100) return "strong";
  if (value >= 0) return "positive";
  if (value <= -50) return "danger";
  return "negative";
}

export function calcMultipleFromLaunch(endPrice: number) {
  const firstClose = 0.9335;
  return endPrice / firstClose;
}
