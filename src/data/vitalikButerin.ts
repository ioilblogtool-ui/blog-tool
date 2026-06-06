// Vitalik Buterin Ethereum Creator Report Data
// slug: vitalik-buterin-ethereum-creator

export const VB_META = {
  slug: "vitalik-buterin-ethereum-creator",
  title: "비탈릭 부테린 — 이더리움 창시자의 모든 것",
  seoTitle: "비탈릭 부테린 이더리움 창시자 | 재산·행적·기술 유산 완전 정리 2026",
  seoDescription:
    "10대에 비트코인을 발견하고 19세에 이더리움 백서를 쓴 천재. 비탈릭 부테린의 성장 스토리, 추정 재산, ETH 보유량, 더 머지, 사토시와의 비교까지 2026년 기준 완전 정리.",
  description:
    "러시아 태생 캐나다 이민자. 10대에 비트코인을 발견하고 19세에 이더리움 백서를 썼습니다. 스마트 컨트랙트·DeFi·NFT·DAO를 세상에 가져온 비탈릭 부테린의 모든 것.",
  updatedAt: "2026-06-06",
  dataNote:
    "비탈릭 부테린의 ETH 보유량 및 순자산은 온체인 데이터·공개 인터뷰·추정치를 기반으로 합니다. 실제 보유량은 다를 수 있으며, 참고용으로만 활용하세요.",
};

// ─── KPI ────────────────────────────────────────────────────
export const VB_KPI = {
  birthYear: 1994,
  birthPlace: "러시아 콜롬나",
  nationality: "캐나다",
  currentAge: 31,
  iqEstimate: "~170 (추정)",
  ethereumFoundedYear: 2015,
  whitepaperAge: 19,
  ethHeld: 240000, // approx public known wallets
  ethPriceUsd: 3200,
  estimatedNetWorthUsd: 1_400_000_000,
  donatedUsd: 1_500_000_000, // ~$1.5B including SHIB donation
  theMergeYear: 2022,
  energyReduction: 99.95,
};

// ─── 타임라인 ────────────────────────────────────────────────
export type VBEvent = {
  date: string;
  year: number;
  title: string;
  detail: string;
  type: "birth" | "bitcoin" | "ethereum" | "tech" | "social" | "milestone" | "controversy";
};

export const VB_TIMELINE: VBEvent[] = [
  {
    date: "1994년 1월 31일",
    year: 1994,
    title: "러시아 콜롬나 출생",
    detail:
      "러시아 모스크바 근교 콜롬나에서 컴퓨터 과학자 아버지 드미트리 부테린과 어머니 사이에서 태어납니다. 6세에 Excel로 자동 계산 스프레드시트를 만들며 수학·프로그래밍 천재성을 드러냅니다.",
    type: "birth",
  },
  {
    date: "2000년 (6세)",
    year: 2000,
    title: "캐나다 토론토 이민",
    detail:
      "가족과 함께 캐나다 토론토로 이민. 영재 프로그램에 입학해 수학·경제학·컴퓨터 과학을 동시에 심화 학습. 이 시기에 이미 3학년 수준을 넘는 암산 능력을 보여 영재 판정을 받습니다.",
    type: "birth",
  },
  {
    date: "2011년 (17세)",
    year: 2011,
    title: "비트코인 첫 발견 — 아버지로부터",
    detail:
      "아버지 드미트리에게 비트코인을 처음 소개받습니다. 처음에는 회의적이었지만 깊이 파고들수록 잠재력에 매료됩니다. 비트코인 포럼에서 활동 시작. 글 1편당 비트코인 5개를 받으며 Bitcoin Magazine 기고를 시작합니다.",
    type: "bitcoin",
  },
  {
    date: "2011년 말",
    year: 2011,
    title: "Bitcoin Magazine 공동 창간",
    detail:
      "미할 알리시(Mihai Alisie)와 함께 Bitcoin Magazine 공동 창간. 17세 나이에 암호화폐 전문 미디어의 핵심 필자로 활동하며 기술적·경제적 인사이트로 커뮤니티 주목을 받습니다.",
    type: "bitcoin",
  },
  {
    date: "2012~2013년",
    year: 2012,
    title: "워털루 대학교 입학 후 전 세계 암호화폐 프로젝트 탐방",
    detail:
      "캐나다 워털루 대학교(컴퓨터 과학) 입학. 동시에 전 세계 암호화폐 프로젝트를 직접 방문·참여합니다. Mastercoin, Colored Coins, Ripple 등을 분석하며 '비트코인의 한계'를 직감합니다.",
    type: "bitcoin",
  },
  {
    date: "2013년 11월",
    year: 2013,
    title: "이더리움 백서 발표 — 19세",
    detail:
      "비트코인 커뮤니티에 이더리움 백서 초안 배포. 핵심 아이디어: 비트코인은 화폐만 처리하지만, 이더리움은 **임의의 프로그램(스마트 컨트랙트)** 을 블록체인 위에서 실행할 수 있는 범용 플랫폼. '블록체인 위의 프로그래밍 언어'를 제안합니다.",
    type: "ethereum",
  },
  {
    date: "2014년 초",
    year: 2014,
    title: "틸 펠로우십 수상 — 대학 중퇴",
    detail:
      "페이팔 창업자 피터 틸의 Thiel Fellowship(20세 이하 창업자에게 $100,000 지원, 대학 중퇴 조건) 수상. 워털루 대학교를 중퇴하고 이더리움 개발에 전념합니다. 같은 해 세계 기술 혁신상(World Technology Award) 수상.",
    type: "ethereum",
  },
  {
    date: "2014년 7~8월",
    year: 2014,
    title: "이더리움 ICO — $18.3M 모금",
    detail:
      "42일간의 ICO(Initial Coin Offering)로 BTC 기부를 받아 약 1,840만 달러 모금. 당시 역대 최대 규모 크라우드펀딩 중 하나. 전 세계 개발자·투자자의 관심 집중.",
    type: "ethereum",
  },
  {
    date: "2015년 7월 30일",
    year: 2015,
    title: "이더리움 메인넷 론칭 — Frontier",
    detail:
      "이더리움 최초 메인넷 'Frontier' 가동. 스마트 컨트랙트 실행 가능한 최초의 범용 블록체인 플랫폼 탄생. 출시 당시 ETH 가격 약 $1~3. 개발자들이 탈중앙화 애플리케이션(dApp) 구축 시작.",
    type: "ethereum",
  },
  {
    date: "2016년 (The DAO 해킹)",
    year: 2016,
    title: "DAO 해킹 사태와 이더리움 하드포크",
    detail:
      "분산 자율 조직(DAO)이 해킹으로 약 360만 ETH(당시 약 $5,000만) 탈취. 비탈릭은 커뮤니티 투표를 통해 블록체인 롤백을 결정(하드포크). 이로 인해 이더리움(ETH)과 이더리움 클래식(ETC)으로 분리. 탈중앙화 철학 vs 실용주의 논쟁 발생.",
    type: "controversy",
  },
  {
    date: "2017~2018년",
    year: 2017,
    title: "ICO 붐 — ETH $1,400 역대 최고가 (당시)",
    detail:
      "ERC-20 토큰 표준 기반 ICO 폭발적 증가. 이더리움 플랫폼 위에서 수천 개 프로젝트 토큰 발행. ETH 가격 2018년 1월 $1,400 돌파(당시 역대 최고). 이후 암호화폐 겨울(크립토 윈터)로 90% 이상 폭락.",
    type: "milestone",
  },
  {
    date: "2021년 5월",
    year: 2021,
    title: "시바이누(SHIB) 1조 원 기부",
    detail:
      "SHIB 커뮤니티가 비탈릭에게 전체 공급량의 50%를 보냈지만, 비탈릭은 이를 즉시 인도 코로나19 구호 기금에 기부. 약 10억 달러 이상 가치. 나머지는 소각. '원치 않는 토큰 처리'의 역사적 사례.",
    type: "social",
  },
  {
    date: "2022년 9월 15일",
    year: 2022,
    title: "더 머지 (The Merge) — PoW → PoS 전환",
    detail:
      "이더리움 역사상 최대 업그레이드. 작업증명(PoW) 채굴 방식을 지분증명(PoS)으로 전환. 에너지 소비 99.95% 감소. 수년간 준비한 기술적 과제를 무결하게 완수. '역대 가장 어려운 소프트웨어 업그레이드 중 하나'로 평가.",
    type: "tech",
  },
  {
    date: "2023~2024년",
    year: 2023,
    title: "이더리움 레이어2 확장 — Dencun 업그레이드",
    detail:
      "Arbitrum, Optimism, Base 등 레이어2 네트워크 거래량이 이더리움 메인넷을 초과. 2024년 3월 Dencun 업그레이드(EIP-4844, Proto-Danksharding)로 레이어2 가스비 90% 이상 절감. 이더리움 확장성 문제 해결 본격화.",
    type: "tech",
  },
  {
    date: "2024년",
    year: 2024,
    title: "미국 현물 ETH ETF 승인",
    detail:
      "SEC가 미국 현물 이더리움 ETF를 승인. 블랙록, 피델리티 등 운용사의 ETF 출시로 기관 자금 유입. ETH의 '증권 여부' 논란은 지속되나, 현물 ETF 승인으로 합법적 투자 수단으로 인정.",
    type: "milestone",
  },
  {
    date: "2026년 현재 (31세)",
    year: 2026,
    title: "이더리움 로드맵 Purge·Splurge 단계 진행",
    detail:
      "Verkle Trees, 계정 추상화(ERC-4337), Danksharding 완성 등 이더리움 장기 로드맵 지속 추진. 비탈릭은 암호화폐를 넘어 AI 안전성, 민주주의, 롱기비티(수명 연장) 등 기술·사회 문제에 관심 확장. 여전히 이더리움 재단 최전선에서 활동.",
    type: "milestone",
  },
];

// ─── 이더리움 백서 ────────────────────────────────────────────
export const VB_WHITEPAPER = {
  title: "Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform",
  publishedYear: 2013,
  authorAge: 19,
  coreIdea:
    "비트코인은 '전자화폐'만 처리할 수 있지만, 이더리움은 블록체인 위에서 튜링 완전(Turing-complete) 프로그래밍 언어를 실행해 **임의의 애플리케이션**을 구동할 수 있도록 설계합니다. 은행·거래소·투표·신원 인증 등 모든 신뢰 기반 시스템을 코드로 대체합니다.",
  whyBitcoinWasntEnough: [
    "비트코인 스크립트는 의도적으로 제한적 — 복잡한 로직 불가",
    "상태(State) 관리 불가 — 잔액 외 데이터 저장 어려움",
    "블록체인 맹목적 사용 — 애플리케이션마다 별도 체인 필요",
    "튜링 완전성 부재 — 반복문·조건문 등 범용 프로그래밍 불가",
  ],
  keyInnovations: [
    {
      title: "스마트 컨트랙트",
      detail: "코드로 작성된 자동 실행 계약. 중간자 없이 조건 충족 시 자동 이행. DeFi·NFT·DAO의 기반.",
    },
    {
      title: "이더리움 가상 머신 (EVM)",
      detail: "모든 이더리움 노드에서 동일하게 실행되는 가상 컴퓨터. 스마트 컨트랙트의 실행 환경.",
    },
    {
      title: "가스(Gas) 시스템",
      detail: "연산량에 비례한 수수료 부과. 무한 루프 등 악의적 코드 실행 방지. 네트워크 보안의 핵심.",
    },
    {
      title: "ERC-20 토큰 표준",
      detail: "누구나 이더리움 위에서 토큰 발행 가능. ICO·DeFi·NFT 폭발의 기술적 기반.",
    },
    {
      title: "탈중앙화 앱 (dApp)",
      detail: "백엔드 로직이 블록체인에 올라간 애플리케이션. 검열 불가, 다운타임 없음.",
    },
  ],
  famousQuote:
    "Ethereum is a programmable blockchain. Rather than give users a set of pre-defined operations, it allows users to create their own operations. — Ethereum Whitepaper",
};

// ─── 개인 프로파일 ────────────────────────────────────────────
export const VB_PROFILE = {
  fullName: "Vitalik Dmitrievich Buterin",
  fullNameKo: "비탈리크 드미트리예비치 부테린",
  born: "1994년 1월 31일, 러시아 콜롬나",
  nationality: "캐나다 (러시아 출생)",
  education: "워털루 대학교 컴퓨터 과학 중퇴 (틸 펠로우십)",
  languages: ["영어", "러시아어", "중국어", "독일어", "프랑스어 (기초)"],
  role: "이더리움 재단 공동 창립자 / 핵심 연구자",
  coFounders: [
    "Gavin Wood (Solidity·Yellow Paper)",
    "Jeffrey Wilcke",
    "Charles Hoskinson (현 Cardano 창시자)",
    "Anthony Di Iorio",
    "Mihai Alisie",
    "Joseph Lubin (현 ConsenSys 대표)",
    "Amir Chetrit",
  ],
  knownFor: [
    "이더리움 창시",
    "스마트 컨트랙트 대중화",
    "더 머지 (PoS 전환) 설계·완성",
    "DeFi·NFT·DAO 기반 구축",
    "SHIB 기부 ($1B+)",
    "오픈소스 기고·연구 논문 다수",
  ],
  personality:
    "극단적으로 검소한 생활 스타일. 럭셔리 소비 없음. Airbnb나 친구 집에서 생활하는 것으로 유명. 가방 하나로 전 세계를 다니며 업무. 암호화폐 부자임에도 검소함으로 커뮤니티 존경을 받음.",
  interests: ["수학·암호학", "AI 안전성", "메커니즘 디자인", "롱기비티(수명 연장)", "민주주의 개혁", "철학"],
};

// ─── 재산 및 ETH 보유 ─────────────────────────────────────────
export const VB_WEALTH = {
  estimatedNetWorthUsd: 1_400_000_000,
  knownEthWallets: [
    {
      label: "주요 공개 지갑 (vitalik.eth)",
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      approxEth: 240000,
      note: "ENS(vitalik.eth)에 연결된 공개 지갑",
    },
  ],
  totalKnownEth: 240000,
  ethPriceUsd: 3200,
  estimatedEthValue: 768_000_000,
  totalDonatedUsd: 1_500_000_000,
  majorDonations: [
    {
      year: 2021,
      amount: "~$1B+",
      recipient: "인도 코로나19 구호 기금 (Crypto Relief)",
      note: "SHIB 토큰 시가 기준. 커뮤니티가 무단 증정한 물량 전액 기부",
    },
    {
      year: 2021,
      amount: "$100M",
      recipient: "GiveWell, MIRI, 기타 효과적 이타주의 단체",
      note: "SHIB 소각분 일부를 효과적 이타주의 기관에 배분",
    },
    {
      year: 2022,
      amount: "$300M",
      recipient: "우크라이나 전쟁 구호 관련 프로젝트",
      note: "러시아-우크라이나 전쟁 발발 직후 다양한 우크라이나 지원 채널에 기부",
    },
    {
      year: 2023,
      amount: "$100M",
      recipient: "롱기비티(수명 연장 연구) 재단",
      note: "SENS 연구재단 등 노화 역전 연구에 대규모 기부",
    },
  ],
  lifestyle:
    "추정 순자산 약 14억 달러에도 불구하고 극단적으로 검소한 생활. 고정 주소 없이 Airbnb·친구 집 거주. 옷 수십 벌 없음. 최근에도 SNS에 자신의 '전 재산'이 가방 1개라는 게시물 공유.",
};

// ─── 이더리움이 만든 것들 ─────────────────────────────────────
export const VB_LEGACY = [
  {
    title: "탈중앙화 금융 (DeFi)",
    icon: "💱",
    year: "2018~",
    tvl: "$100B+",
    detail:
      "Uniswap·Aave·Compound·MakerDAO 등 스마트 컨트랙트 기반 금융 프로토콜. 은행 계좌 없이도 대출·예치·거래 가능. 2021년 최고 TVL $2,500억 달성. 비탈릭의 EVM 설계 없이는 불가능했던 금융 혁명.",
  },
  {
    title: "NFT (Non-Fungible Token)",
    icon: "🎨",
    year: "2017~",
    tvl: "연간 수십억 달러",
    detail:
      "ERC-721 표준 기반 디지털 소유권 증명. CryptoPunks, Bored Ape Yacht Club 등. 2021년 NFT 시장 거래량 $250억 돌파. 예술·게임·스포츠·IP 산업 전반에 충격. 부작용(환경·투기)도 공존.",
  },
  {
    title: "탈중앙화 자율 조직 (DAO)",
    icon: "🏛️",
    year: "2016~",
    tvl: "수십억 달러 운용 중",
    detail:
      "토큰 기반 거버넌스. 코드가 곧 정관. MakerDAO, Uniswap DAO, ENS DAO 등 수백 개 DAO가 실제 자산·프로토콜 운영 중. 전통 기업 구조의 대안 실험.",
  },
  {
    title: "레이어2 생태계",
    icon: "⚡",
    year: "2020~",
    tvl: "$50B+",
    detail:
      "Arbitrum·Optimism·Base·zkSync 등 이더리움 위의 확장 레이어. 메인넷보다 100~1000배 낮은 수수료. 2024년 기준 일일 트랜잭션 수가 이더리움 메인넷을 초과.",
  },
  {
    title: "스테이블코인 인프라",
    icon: "💵",
    year: "2017~",
    tvl: "$180B+",
    detail:
      "USDC·USDT·DAI 등 이더리움 기반 스테이블코인이 글로벌 달러 결제 인프라로 성장. 개발도상국 달러화 대안 수단. AI 에이전트의 결제 인프라로도 채택 확대 중.",
  },
  {
    title: "AI 에이전트 결제 레이어",
    icon: "🤖",
    year: "2024~",
    tvl: "급성장 중",
    detail:
      "자율 AI 에이전트가 사람 개입 없이 이더리움·레이어2로 결제. Coinbase의 x402 프로토콜 등. 비탈릭이 직접 AI 에이전트와 블록체인 결합을 적극 지지하는 분야.",
  },
];

// ─── 더 머지 ─────────────────────────────────────────────────
export const VB_MERGE = {
  date: "2022년 9월 15일",
  blockNumber: 15537393,
  title: "The Merge — PoW에서 PoS로",
  subtitle: "이더리움 역사상 가장 중요한 업그레이드. 채굴(Mining) 시대의 종말.",
  before: {
    consensus: "작업증명 (Proof of Work)",
    energyPerYear: "약 112 TWh (네덜란드 수준)",
    validators: "채굴자 (GPU/ASIC)",
    entryBarrier: "고가 장비 필요",
  },
  after: {
    consensus: "지분증명 (Proof of Stake)",
    energyPerYear: "약 0.01 TWh (99.95% 절감)",
    validators: "검증자 (32 ETH 스테이킹)",
    entryBarrier: "32 ETH (약 $100,000) 스테이킹",
  },
  significance: [
    "에너지 소비 99.95% 감소 — ESG 투자 기관의 이더리움 투자 허들 제거",
    "채굴 산업 종식 — 수십억 달러 GPU 채굴 인프라 가치 제로화",
    "이더리움 인플레이션 대폭 감소 — 연간 신규 발행 ~90% 줄어듦",
    "지분증명으로 보안성 오히려 강화 (51% 공격 비용 증가)",
    "'Ultra Sound Money' 내러티브 강화 — EIP-1559와 결합 시 디플레이션 가능",
  ],
  vitalikQuote:
    "It's not just a technical upgrade. It's a statement about what Ethereum stands for: efficiency, sustainability, and the future. — Vitalik Buterin, The Merge 당일",
  techNote:
    "7년간 개발 준비. 비콘 체인(Beacon Chain)을 2020년 먼저 론칭하고, 검증자 수백만 명이 스테이킹한 후 메인넷과 합병. 실행 레이어와 합의 레이어의 '도킹' 방식으로 기존 잔액·스마트 컨트랙트 완전 보존.",
};

// ─── 사토시 vs 비탈릭 비교 ────────────────────────────────────
export const VB_VS_SATOSHI = [
  {
    category: "신원",
    satoshi: "완전 익명 — 미상",
    vitalik: "실명 공개 — 31세 캐나다인",
    winner: "vitalik",
    note: "비탈릭은 세상에서 가장 투명하게 활동하는 블록체인 창시자",
  },
  {
    category: "설계 철학",
    satoshi: "단순함 · 화폐에 집중 · 불변성",
    vitalik: "범용성 · 프로그래밍 가능 · 업그레이드 가능",
    winner: "both",
    note: "용도에 따라 다름. 비트코인=디지털 금, 이더리움=블록체인 컴퓨터",
  },
  {
    category: "공급 정책",
    satoshi: "2,100만 개 고정 — 절대 불변",
    vitalik: "초기 무제한 → EIP-1559·PoS로 실질 디플레이션 가능",
    winner: "satoshi",
    note: "희소성 측면에서 비트코인이 명확히 우위",
  },
  {
    category: "에너지",
    satoshi: "PoW — 연간 150TWh+ 소비",
    vitalik: "PoS — 연간 0.01TWh (머지 이후)",
    winner: "vitalik",
    note: "환경 측면에서 이더리움이 압도적 우위",
  },
  {
    category: "프로그래밍 능력",
    satoshi: "비트코인 프로토콜 직접 설계·구현",
    vitalik: "EVM·Solidity·PoS 설계 및 수십 편 연구 논문",
    winner: "both",
    note: "둘 다 세계 최고 수준. 방향성이 다름",
  },
  {
    category: "현재 영향력",
    satoshi: "완전 잠적 — 간접적 영향만",
    vitalik: "현재도 이더리움 로드맵 직접 주도",
    winner: "vitalik",
    note: "진행형 vs 과거형",
  },
  {
    category: "투명성·소통",
    satoshi: "포럼 글·이메일만 (2011년 이후 없음)",
    vitalik: "블로그·SNS·학회 적극 소통",
    winner: "vitalik",
    note: "커뮤니티와의 소통 빈도·품질 차이 압도적",
  },
  {
    category: "중앙화 리스크",
    satoshi: "110만 BTC 잠든 지갑 — 이동 시 시장 충격",
    vitalik: "비탈릭 발언이 ETH 가격에 영향 — 과도한 개인 의존성 비판",
    winner: "satoshi",
    note: "둘 다 중앙화 리스크 존재. 형태만 다름",
  },
];

// ─── 논란과 비판 ──────────────────────────────────────────────
export const VB_CONTROVERSIES = [
  {
    title: "2016년 DAO 하드포크 — 탈중앙화 철학 위반?",
    detail:
      "해킹 피해 복구를 위해 블록체인을 롤백한 결정. '코드가 법(Code is Law)'이라는 이더리움의 철학에 위배된다는 강한 비판. 이더리움 클래식(ETC)이 이 원칙을 지키기 위해 분리. 비탈릭은 '실용주의'를 택했지만, 커뮤니티 분열의 원인이 됨.",
    severity: "high",
  },
  {
    title: "이더리움 재단의 과도한 권한 집중",
    detail:
      "비탈릭·이더리움 재단이 프로토콜 방향에 과도한 영향력을 행사한다는 비판. 탈중앙화를 표방하면서 사실상 소수가 방향 결정. Ethereum Classic, Ethereum PoW 등 반발 그룹 등장. 비탈릭 본인도 이 문제를 인지하고 점진적 권한 이양 추진 중.",
    severity: "medium",
  },
  {
    title: "높은 가스비 문제",
    detail:
      "2021년 DeFi·NFT 붐 당시 트랜잭션 1건에 $100~200 수수료. 소액 거래는 사실상 불가능. '이더리움은 부자들의 블록체인'이라는 비판. 이후 레이어2 확산·Dencun 업그레이드로 개선 중이나, 여전히 비트코인·솔라나 등에 비해 높다는 지적.",
    severity: "medium",
  },
  {
    title: "ETH 증권 여부 논란",
    detail:
      "PoS 전환 이후 ETH가 미국 증권거래위원회(SEC) 기준 '증권'에 해당할 수 있다는 법적 리스크. 스테이킹 수익이 투자 계약의 특성을 가진다는 주장. 현물 ETF 승인으로 어느 정도 해소됐으나, 법적 불확실성은 지속.",
    severity: "medium",
  },
  {
    title: "이더리움 킬러들의 지속적 도전",
    detail:
      "Solana(초당 6만 TPS), Avalanche, Cardano, Sui, Aptos 등 이더리움보다 빠르고 저렴한 블록체인들의 지속적 시장 침식. 특히 Solana는 밈코인·DeFi 시장에서 이더리움을 앞지르기 시작. 비탈릭은 '레이어2 중심 확장' 전략으로 대응 중.",
    severity: "low",
  },
];

// ─── 이더리움 로드맵 ──────────────────────────────────────────
export const VB_ROADMAP = [
  { phase: "The Merge", status: "완료", year: "2022", detail: "PoS 전환 완료. 에너지 99.95% 절감." },
  { phase: "The Surge", status: "진행 중", year: "2023~", detail: "레이어2 확장. Dencun(EIP-4844) 완료. Danksharding 진행 중." },
  { phase: "The Scourge", status: "진행 중", year: "2024~", detail: "MEV(최대 추출 가능 가치) 문제 및 검증자 중앙화 해결." },
  { phase: "The Verge", status: "개발 중", year: "2025~", detail: "Verkle Trees 도입. 스테이트리스 클라이언트로 노드 가벼워짐." },
  { phase: "The Purge", status: "계획", year: "2026~", detail: "오래된 히스토리 데이터 정리. 프로토콜 단순화." },
  { phase: "The Splurge", status: "계획", year: "2027~", detail: "나머지 개선 사항. EVM 최적화, 계정 추상화 완성." },
];

// ─── FAQ ──────────────────────────────────────────────────────
export const VB_FAQ = [
  {
    question: "비탈릭 부테린은 몇 살에 이더리움을 만들었나요?",
    answer:
      "19세(2013년)에 이더리움 백서를 작성했고, 21세(2015년)에 이더리움 메인넷을 론칭했습니다. 워털루 대학교를 중퇴하고 100만 달러 규모의 틸 펠로우십을 받아 이더리움 개발에 전념했습니다.",
  },
  {
    question: "비탈릭 부테린의 재산은 얼마인가요?",
    answer:
      "2026년 기준 약 10~15억 달러(약 1.4~2조 원) 추정. 공개된 주요 지갑(vitalik.eth)에 약 24만 ETH 보유. 그러나 그는 개인 소비에는 극단적으로 검소하며, 지금까지 15억 달러 이상을 기부했습니다. 가방 1개로 세계를 다니는 것으로 유명합니다.",
  },
  {
    question: "이더리움과 비트코인의 가장 큰 차이는 무엇인가요?",
    answer:
      "비트코인은 '디지털 금'으로 가치 저장 수단에 집중합니다. 이더리움은 '블록체인 컴퓨터'로 스마트 컨트랙트를 통해 DeFi·NFT·DAO 등 임의의 애플리케이션 실행이 가능합니다. 공급 정책도 다릅니다 — 비트코인은 2,100만 개 고정, 이더리움은 PoS 전환 후 실질 디플레이션 구조.",
  },
  {
    question: "더 머지(The Merge)란 무엇인가요?",
    answer:
      "2022년 9월 15일 이더리움이 채굴(PoW) 방식을 스테이킹(PoS) 방식으로 전환한 업그레이드입니다. 에너지 소비가 99.95% 줄었고, 채굴자 대신 32 ETH 이상 보유자가 네트워크 검증에 참여합니다. 7년간 준비한 이더리움 역사상 가장 어려운 기술적 과제로 평가됩니다.",
  },
  {
    question: "비탈릭이 SHIB 코인을 기부한 이유는 무엇인가요?",
    answer:
      "2021년 SHIB 커뮤니티가 마케팅 목적으로 비탈릭에게 전체 공급량의 50%를 보냈습니다. 비탈릭은 이를 원치 않는 자산으로 판단, 인도 코로나19 구호 기금(Crypto Relief)에 약 10억 달러 상당을 즉시 기부하고 나머지는 소각했습니다. 개인 이익 극대화보다 공익을 택한 사례로 기록됩니다.",
  },
  {
    question: "이더리움이 AI와 어떤 관계가 있나요?",
    answer:
      "자율 AI 에이전트가 인간 개입 없이 거래·서비스 구독·자원 구매를 하려면 프로그래밍 가능한 결제 인프라가 필요합니다. 이더리움과 레이어2 네트워크가 AI 에이전트의 결제 레이어로 부상 중입니다. 비탈릭 본인도 AI 안전성과 블록체인 결합을 적극 연구하고 있습니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const VB_RELATED_LINKS = [
  {
    href: "/reports/ethereum-historical-returns-2015-2026/",
    label: "이더리움 연도별 수익률 역사",
    desc: "2015~2026년 ETH 연도별 성과 및 반감기 이벤트 정리",
  },
  {
    href: "/reports/satoshi-nakamoto-bitcoin-creator/",
    label: "사토시 나카모토 완전 정리",
    desc: "비트코인 창시자 신원 미스터리 · 110만 BTC · 2024 법원 판결",
  },
  {
    href: "/reports/bitcoin-annual-return-history/",
    label: "비트코인 연도별 수익률 역사",
    desc: "2011~2026년 BTC 연도별 수익률 및 반감기 사이클",
  },
];
