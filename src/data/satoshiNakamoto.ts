// Satoshi Nakamoto Bitcoin Creator Report Data
// slug: satoshi-nakamoto-bitcoin-creator

export const SNK_META = {
  slug: "satoshi-nakamoto-bitcoin-creator",
  title: "사토시 나카모토 — 비트코인 창시자의 모든 것",
  seoTitle: "사토시 나카모토 정체 | 비트코인 창시자 미스터리 완전 정리 2026",
  seoDescription:
    "비트코인 백서 발표부터 2011년 돌연 사라질 때까지 — 사토시 나카모토의 정체, 110만 BTC 보유 추정, Craig Wright 법원 판결, 신원 주장 인물 5인을 완전 정리합니다.",
  description:
    "2008년 백서 발표부터 2011년 돌연 사라질 때까지. 비트코인을 만든 사토시 나카모토의 정체, 행적, 110만 BTC 보유 추정, 신원 주장 인물, Craig Wright 2024년 법원 판결을 완전 정리합니다.",
  updatedAt: "2026-06-06",
  dataNote:
    "사토시 나카모토의 신원은 공식적으로 밝혀지지 않았습니다. 이 리포트는 공개된 연구·법원 판결·온체인 데이터를 바탕으로 정리한 것으로, 신원 주장·추정 인물에 대한 내용은 확정이 아닙니다.",
};

// ─── 타임라인 ───────────────────────────────────────────────
export type TimelineEvent = {
  date: string;
  year: number;
  title: string;
  detail: string;
  type: "whitepaper" | "genesis" | "activity" | "disappear" | "discovery" | "legal" | "milestone";
};

export const SNK_TIMELINE: TimelineEvent[] = [
  {
    date: "2008년 8월 18일",
    year: 2008,
    title: "bitcoin.org 도메인 등록",
    detail:
      "bitcoin.org 도메인이 익명으로 등록됩니다. 사토시는 이미 이 시점에 비트코인 프로토타입을 완성한 상태였던 것으로 추정됩니다.",
    type: "milestone",
  },
  {
    date: "2008년 10월 31일",
    year: 2008,
    title: "비트코인 백서 발표",
    detail:
      '사토시 나카모토 명의로 암호학 메일링 리스트(metzdowd.com)에 "Bitcoin: A Peer-to-Peer Electronic Cash System" 9페이지 백서를 게재합니다. 중앙기관 없이 신뢰를 구현하는 분산 전자화폐 시스템을 최초로 제안합니다.',
    type: "whitepaper",
  },
  {
    date: "2009년 1월 3일",
    year: 2009,
    title: "제네시스 블록 채굴 — 비트코인 탄생",
    detail:
      '오전 18:15:05(UTC) 블록 #0 생성. 코인베이스에 "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks" 문구 삽입. 50 BTC 보상. 기존 금융 시스템에 대한 선언으로 해석됩니다.',
    type: "genesis",
  },
  {
    date: "2009년 1월 9일",
    year: 2009,
    title: "비트코인 0.1 소프트웨어 공개",
    detail:
      "GitHub 이전 SourceForge에 비트코인 최초 클라이언트(v0.1) 오픈소스 공개. Hal Finney가 최초 수신자가 되어 사토시로부터 10 BTC를 받습니다.",
    type: "activity",
  },
  {
    date: "2009년 1월 12일",
    year: 2009,
    title: "최초 비트코인 거래",
    detail:
      "사토시 → Hal Finney 10 BTC 전송. 블록 #170에 기록된 세계 최초의 비트코인 P2P 거래. Hal Finney는 당시 이 거래를 Twitter에 언급했습니다.",
    type: "activity",
  },
  {
    date: "2010년 5월 22일",
    year: 2010,
    title: "비트코인 피자 거래 — 첫 실물 거래",
    detail:
      "Laszlo Hanyecz가 10,000 BTC로 피자 2판을 구매. 당시 가치 약 41달러. 2026년 기준 약 6억 달러(약 8,280억 원). 매년 5월 22일은 '비트코인 피자 데이'.",
    type: "milestone",
  },
  {
    date: "2010년 12월 12일",
    year: 2010,
    title: "사토시 마지막 포럼 게시글",
    detail:
      "비트코인토크 포럼에 서비스 거부(DoS) 취약점 관련 기술 업데이트를 마지막으로 게시. 이후 포럼 활동 중단. 개발 주도권을 Gavin Andresen에게 이양하기 시작합니다.",
    type: "disappear",
  },
  {
    date: "2011년 4월 23일",
    year: 2011,
    title: "사토시 마지막 이메일",
    detail:
      'Gavin Andresen에게 보낸 이메일: "다른 일들로 넘어갔습니다(I\'ve moved on to other things)." 이후 완전히 연락 두절. 약 110만 BTC는 단 한 번도 이동하지 않습니다.',
    type: "disappear",
  },
  {
    date: "2013년",
    year: 2013,
    title: "Sergio Lerner, 사토시 보유량 첫 분석",
    detail:
      "블록체인 연구자 Sergio Demian Lerner가 초기 채굴 패턴의 nonce 값 분석을 통해 사토시가 약 100만 BTC를 보유한 것으로 추정. 이후 Patoshi 패턴으로 불리게 됩니다.",
    type: "discovery",
  },
  {
    date: "2014년 3월",
    year: 2014,
    title: "도리안 나카모토 오보 사건",
    detail:
      "Newsweek이 캘리포니아의 도리안 프렌티스 나카모토(Dorian Satoshi Nakamoto)를 창시자로 지목하는 기사 게재. 도리안은 강하게 부인. 사토시 명의 계정이 11+년 만에 활성화되어 '나는 도리안 나카모토가 아니다'라고 부인.",
    type: "discovery",
  },
  {
    date: "2016년 5월",
    year: 2016,
    title: "Craig Wright 최초 자칭 선언",
    detail:
      "호주 기업인 Craig Wright가 BBC·이코노미스트·GQ에 자신이 사토시라고 주장. 디지털 서명 증명에 실패하고 비판을 받자 돌연 블로그를 삭제하고 침묵.",
    type: "legal",
  },
  {
    date: "2024년 3월 14일",
    year: 2024,
    title: "영국 법원 판결: Craig Wright는 사토시가 아니다",
    detail:
      "영국 고등법원 James Mellor 판사: \"Craig Wright는 비트코인 백서를 작성하지 않았고, 사토시 나카모토가 아니다.\" 증거 위조 정황도 확인. COPA(암호화폐 오픈 특허 연합) 제기 소송에서 완전 패소.",
    type: "legal",
  },
  {
    date: "2026년 현재",
    year: 2026,
    title: "정체 여전히 미상 — 110만 BTC 17년째 미이동",
    detail:
      "Patoshi 패턴으로 추정되는 약 110만 BTC는 2009~2010년 채굴 이후 단 한 번도 이동하지 않습니다. $60,000 기준 약 660억 달러(약 91조 원). 비트코인 역사상 가장 큰 미스터리로 남아 있습니다.",
    type: "milestone",
  },
];

// ─── 비트코인 백서 ────────────────────────────────────────────
export const SNK_WHITEPAPER = {
  title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
  publishedDate: "2008년 10월 31일",
  pages: 9,
  words: 3200,
  mailingList: "Cryptography Mailing List (metzdowd.com)",
  coreIdea:
    "제3자 신뢰 기관(은행) 없이 두 당사자가 직접 전자화폐를 주고받을 수 있는 시스템. 이중 지불 문제를 '작업 증명(Proof of Work)' 기반 분산 타임스탬프 서버로 해결.",
  keyInnovations: [
    {
      title: "이중 지불 해결",
      detail:
        "동일한 디지털 화폐를 두 번 사용하는 문제를 블록체인 공개 원장으로 해결. 모든 참여자가 거래 이력을 검증.",
    },
    {
      title: "작업 증명 (Proof of Work)",
      detail:
        "SHA-256 해시 퍼즐을 풀어야 블록을 추가할 수 있도록 설계. 51% 이상의 컴퓨팅 파워 없이는 조작 불가능.",
    },
    {
      title: "탈중앙화 합의",
      detail: "어떤 단일 주체도 통제하지 않는 P2P 네트워크. 노드가 많을수록 네트워크는 더 강해짐.",
    },
    {
      title: "고정 공급량",
      detail: "2,100만 개로 발행량 상한 고정. 반감기마다 신규 발행량 절반 감소로 인플레이션 방지.",
    },
    {
      title: "익명성과 투명성 동시 구현",
      detail: "공개 주소로 모든 거래 투명 공개, 주소와 실제 신원은 연결되지 않아 프라이버시 보호.",
    },
  ],
  famousQuote:
    "We define an electronic coin as a chain of digital signatures. — Bitcoin Whitepaper, Section 2",
};

// ─── 제네시스 블록 ─────────────────────────────────────────────
export const SNK_GENESIS = {
  blockNumber: 0,
  timestamp: "2009-01-03 18:15:05 UTC",
  reward: 50,
  hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
  message: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
  messageSource: "영국 더 타임즈 신문 헤드라인",
  interpretations: [
    "기존 중앙은행·금융 시스템에 대한 불신 표명",
    "비트코인 탄생 시점을 역사적으로 증명하는 타임스탬프",
    "국가 통제 없는 화폐 시스템에 대한 정치적 선언",
    "2008년 금융위기에 대한 직접적 응답",
  ],
  genesisCoins:
    "50 BTC는 기술적으로 사용 불가 (coinbase maturity 규칙 예외). 상징적 가치만 존재.",
  significance:
    "이 블록 이전의 비트코인은 존재하지 않습니다. 모든 비트코인 거래는 이 블록에서 시작되는 체인으로 연결됩니다.",
};

// ─── 신원 추정 인물 ────────────────────────────────────────────
export type IdentityCandidate = {
  name: string;
  nameKo: string;
  nationality: string;
  flag: string;
  background: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
  verdict: string;
  verdictColor: "green" | "yellow" | "red";
  currentStatus: string;
};

export const SNK_CANDIDATES: IdentityCandidate[] = [
  {
    name: "Hal Finney",
    nameKo: "할 피니",
    nationality: "미국",
    flag: "🇺🇸",
    background: "PGP 암호학자, 최초 비트코인 수신자. 루게릭병(ALS)으로 2014년 사망.",
    evidenceFor: [
      "비트코인 최초 수신자 (10 BTC, 2009년 1월 12일)",
      "사토시와 동일한 수준의 암호학 전문성",
      "사토시 나카모토와 동일 지역(캘리포니아) 거주",
      "초기 코드 기여 다수",
      "도리안 나카모토와 같은 동네 거주 — 이름 차용 가능성",
    ],
    evidenceAgainst: [
      "생전 지속적으로 부인",
      "사망 전 인터뷰에서도 사토시와 별개 인물임을 강조",
      "ALS 발병 시점과 사토시 활동 기간 일치 — 혼자 개발 어려웠을 것",
    ],
    verdict: "가능성 높음 (사망으로 확인 불가)",
    verdictColor: "yellow",
    currentStatus: "2014년 8월 28일 사망. 디지털 유산 논쟁 중.",
  },
  {
    name: "Nick Szabo",
    nameKo: "닉 자보",
    nationality: "미국",
    flag: "🇺🇸",
    background:
      "컴퓨터 과학자·법학자. '비트 골드(Bit Gold)' 제안자(1998). 스마트 컨트랙트 개념 창시자.",
    evidenceFor: [
      "비트코인 직전 전신 개념 '비트 골드' 설계 (1998년)",
      "스마트 컨트랙트 개념 창시 — 이더리움의 기반",
      "글쓰기 스타일 분석(2013년 Skye Grey): 사토시 백서와 높은 유사도",
      "암호학·경제학·법학 복합 배경 — 백서 작성에 부합",
      "비트코인 탄생 직전 블로그를 소급 날짜 변경한 정황",
    ],
    evidenceAgainst: [
      "지속적으로 부인 (트위터 등)",
      "백서에 자신의 비트 골드를 인용하지 않음 — 본인이라면 인용했을 것",
      "언어 분석은 통계적 추정으로 확정 불가",
    ],
    verdict: "최유력 후보 (학계 다수 의견)",
    verdictColor: "green",
    currentStatus: "현재도 활동 중. 블록체인 연구·강연 활동.",
  },
  {
    name: "Craig Steven Wright",
    nameKo: "크레이그 라이트",
    nationality: "호주",
    flag: "🇦🇺",
    background:
      "호주 기업인·컴퓨터 과학자. 2016년 스스로 사토시라 주장. Bitcoin SV(BSV) 창설.",
    evidenceFor: [
      "2016년 디지털 서명 시연 시도 (실패로 끝남)",
      "일부 초기 비트코인 관계자들의 지지 (현재는 대부분 철회)",
    ],
    evidenceAgainst: [
      "2016년 암호학적 증명 시도 실패 — 제대로 된 서명 제시 불가",
      "2024년 영국 고등법원: 사토시 아님 확정 판결",
      "법원에서 증거 위조·문서 조작 정황 다수 확인",
      "COPA 소송에서 완전 패소",
      "비트코인 커뮤니티 전반의 거부",
    ],
    verdict: "법원 판결로 사토시 아님 확정",
    verdictColor: "red",
    currentStatus:
      "2024년 영국 법원 완전 패소. 법적 분쟁 지속 중. Bitcoin SV 개발 유지.",
  },
  {
    name: "Dorian Satoshi Nakamoto",
    nameKo: "도리안 나카모토",
    nationality: "미국 (일계)",
    flag: "🇺🇸",
    background: "캘리포니아 거주 일계 미국인 물리학자. 방위산업 관련 업무 경력.",
    evidenceFor: [
      "실명이 Satoshi Nakamoto",
      "방위 관련 비밀 프로젝트 경험 — 익명 유지 능력",
      "Hal Finney와 동일 지역 거주",
    ],
    evidenceAgainst: [
      "본인 강력 부인 (Newsweek 기사 오보로 결론)",
      "비트코인 발표 당시 Newsweek 기자 질문에 '더 이상 관여 안 한다'는 말은 다른 프로젝트에 대한 답변이었음 (오해)",
      "암호학 전문 배경 없음",
      "사토시 계정이 11년 만에 활성화되어 도리안이 아님을 직접 부인",
    ],
    verdict: "오보로 결론 — 사실상 제외",
    verdictColor: "red",
    currentStatus:
      "비트코인 커뮤니티의 도움으로 약 100 BTC 모금 받음. 이후 조용히 생활.",
  },
  {
    name: "Adam Back",
    nameKo: "아담 백",
    nationality: "영국",
    flag: "🇬🇧",
    background:
      "암호학자. Hashcash(1997) 발명가. 비트코인 작업증명의 기반 기술 제공. Blockstream CEO.",
    evidenceFor: [
      "비트코인 작업증명의 핵심 기술 Hashcash 발명",
      "백서에서 유일하게 이메일로 직접 연락받은 인물",
      "영국 거주 — 사토시 활동 시간대(GMT)와 일치",
      "암호학·분산 시스템 전문성 완벽 부합",
    ],
    evidenceAgainst: [
      "본인 부인",
      "백서에 Hashcash 인용 시 자기 인용 형태 — 본인이라면 다르게 썼을 것이라는 주장도 있음",
    ],
    verdict: "유력 후보 중 하나",
    verdictColor: "yellow",
    currentStatus: "Blockstream CEO로 비트코인 레이어2 개발 주도.",
  },
];

// ─── Craig Wright 법원 판결 ────────────────────────────────────
export const SNK_COURT_RULING = {
  date: "2024년 3월 14일",
  court: "영국 고등법원 (Chancery Division)",
  judge: "James Mellor 판사",
  plaintiff: "COPA (Crypto Open Patent Alliance)",
  defendant: "Craig Steven Wright",
  ruling: "Craig Wright는 비트코인 백서를 작성하지 않았고, 사토시 나카모토가 아니다",
  keyFindings: [
    "제출된 증거 다수에서 위조·조작 정황 확인",
    "디지털 문서 메타데이터 조작 포착",
    "서명 키 실제 소유를 증명하지 못함",
    "증인 신뢰성 심각하게 손상",
  ],
  significance: [
    "비트코인 역사상 사토시 신원을 법원에서 공식 다룬 첫 판결",
    "이후 Wright의 다수 특허 소송 기반 붕괴",
    "비트코인 커뮤니티의 '사토시 = Craig Wright 아님' 입장 법적 확인",
  ],
  aftermath:
    "판결 이후에도 Craig Wright는 항소 및 다른 소송 지속. Bitcoin SV 유지. 단, 주요 법적 근거 상실.",
};

// ─── 사라진 이유 가설 ─────────────────────────────────────────
export const SNK_DISAPPEAR_THEORIES = [
  {
    title: "탈중앙화 완성을 위한 의도적 이탈",
    probability: "높음",
    detail:
      "창시자가 계속 존재하면 비트코인이 중앙화될 수 있다는 우려. 사토시는 개발 주도권을 Gavin Andresen에게 넘기고 떠남으로써 비트코인이 진정한 탈중앙 시스템이 되도록 했다는 해석. 마지막 이메일에서도 이 의도가 읽힌다는 분석.",
    icon: "🏛️",
  },
  {
    title: "법적·정치적 리스크 회피",
    probability: "높음",
    detail:
      "익명의 전자화폐 시스템 창시는 자금 세탁 방지법, FinCEN 규제, 국가 화폐 발행 독점 침해 가능성 등 막대한 법적 리스크를 동반. 실리콥 밸리·와이오밍 거주 엔지니어라면 이 리스크를 정확히 알고 있었을 것.",
    icon: "⚖️",
  },
  {
    title: "사망 또는 건강 악화",
    probability: "중간",
    detail:
      "Hal Finney처럼 초기 커뮤니티 핵심 인물이 루게릭병으로 사망한 사례가 있음. 사토시가 중병에 걸렸거나 이미 사망했을 가능성. 단, 이 경우 유족이나 주변인이 언제가 공개할 가능성도 있음.",
    icon: "💀",
  },
  {
    title: "팀 프로젝트 — 단일 인물이 아님",
    probability: "중간",
    detail:
      "비트코인 코드베이스의 다양한 스타일, 백서의 높은 완성도를 근거로 복수의 인물이 '사토시'라는 필명으로 활동했다는 설. NSA·CIA 등 정보기관 관여설, 소규모 팀 설 등. 단, 단일 인물로 보기에 충분한 일관성도 존재.",
    icon: "👥",
  },
  {
    title: "평범한 삶으로 복귀",
    probability: "낮음~중간",
    detail:
      "세간의 주목 없이 조용히 살기 위해 완전히 잠적. 110만 BTC를 의도적으로 사용하지 않음으로써 자신의 존재를 드러내지 않기로 결정. 익명성이 충분히 보장된다고 판단해 일상으로 복귀.",
    icon: "🌅",
  },
];

// ─── 유산과 영향 ──────────────────────────────────────────────
export const SNK_LEGACY = [
  {
    title: "이더리움 & 스마트 컨트랙트",
    year: "2015",
    detail:
      "비탈릭 부테린이 비트코인 블록체인에서 영감을 받아 이더리움 설계. 사토시가 백서에서 개념적으로 제안한 스크립트 시스템이 스마트 컨트랙트로 발전. DeFi·NFT·DAO의 기반.",
    icon: "⟠",
  },
  {
    title: "블록체인 기술 산업화",
    year: "2013~",
    detail:
      "비트코인 백서의 분산 원장 개념이 금융·공급망·의료·투표 등 산업 전반에 응용. IBM, 마이크로소프트, 삼성 등 대기업이 엔터프라이즈 블록체인 솔루션 개발.",
    icon: "🔗",
  },
  {
    title: "탈중앙화 금융(DeFi)",
    year: "2020~",
    detail:
      "사토시의 은행 없는 P2P 금융 비전이 DeFi로 현실화. Uniswap, Aave, Compound 등 프로토콜이 수천억 달러 TVL(총 예치 자산) 달성.",
    icon: "💱",
  },
  {
    title: "국가 전략 자산화",
    year: "2024~",
    detail:
      "미국 트럼프 행정부 비트코인 전략 비축 행정명령(2025). 엘살바도르 법정화폐 채택. 국가가 비트코인을 외환보유고에 편입하는 시대 개막.",
    icon: "🏛️",
  },
  {
    title: "암호화폐 자산군 탄생",
    year: "2009~",
    detail:
      "비트코인을 시작으로 수만 개의 암호화폐 탄생. 2026년 기준 전체 암호화폐 시가총액 2조 달러 이상. 전통 금융과 동등한 자산군으로 인정받기 시작.",
    icon: "📈",
  },
  {
    title: "작업증명 → 다양한 합의 알고리즘",
    year: "2011~",
    detail:
      "사토시의 PoW(작업증명) 개념이 PoS(지분증명), DPoS, PoH 등으로 발전. 에너지 효율 및 확장성 문제를 해결하려는 지속적 혁신의 출발점.",
    icon: "⚡",
  },
];

// ─── 110만 BTC 보유 분석 ──────────────────────────────────────
export const SNK_HOLDINGS = {
  estimatedBtc: 1_100_000,
  currentPriceUsd: 60_000,
  estimatedValueUsd: 66_000_000_000,
  estimatedValueKrw: 91_080_000_000_000, // 1380 KRW/USD
  walletCount: 22_000,
  miningPeriod: "2009년 1월 ~ 2010년 중반",
  researcherName: "Sergio Demian Lerner",
  researchYear: 2013,
  methodName: "Patoshi 패턴 분석",
  method:
    "초기 블록 채굴 시 사용된 nonce(임의값) 값의 패턴이 특이한 규칙성을 보임. 동일한 채굴 프로그램이 연속적으로 사용된 흔적 — 이를 'Patoshi 패턴'이라 명명. 이 패턴이 나타나는 블록들의 코인베이스 합산이 약 100~110만 BTC.",
  keyFacts: [
    "2009년 1월~2010년 중반 약 22,000개 지갑에 분산 저장",
    "이 중 어떤 지갑도 단 1 사토시도 이동한 기록 없음 (2026년 기준)",
    "$60,000 기준 약 66조 원 — 세계 최대 단일 개인 BTC 보유 추정",
    "전체 채굴량(1,974만)의 약 5.6% 차지",
    "이동 시 전 세계 BTC 시장에 즉각 충격 예상 — '고래 공포'의 상징",
    "일부 연구자는 실제 사토시 보유량을 70만~120만으로 추정 범위 제시",
  ],
  walletMonitoring:
    "일부 비트코인 개발자·연구자들은 Patoshi 패턴 지갑을 실시간 모니터링 중. 단 1 사토시라도 이동하면 즉각 전 세계 뉴스가 될 것으로 예상.",
};

// ─── FAQ ──────────────────────────────────────────────────────
export const SNK_FAQ = [
  {
    question: "사토시 나카모토는 일본인인가요?",
    answer:
      "이름은 일본식이지만, 실제 일본인인지는 확인되지 않았습니다. 연구자들은 주로 영미권 암호학자(닉 자보, 할 피니, 아담 백)를 유력 후보로 봅니다. 글쓰기 패턴과 시간대 분석에서는 영국 또는 미국 동부가 가능성 있다는 연구도 있습니다.",
  },
  {
    question: "사토시의 110만 BTC가 이동하면 어떻게 되나요?",
    answer:
      "비트코인 시장에 즉각적인 충격이 예상됩니다. 한꺼번에 매도하면 가격이 폭락할 수 있어 '고래 공포(whale fear)' 시나리오로 불립니다. 다만, 실제 이동이 반드시 매도를 의미하지는 않으며, 지갑 이전·테스트 거래일 수도 있습니다. 2026년까지 단 한 번도 이동하지 않았습니다.",
  },
  {
    question: "Craig Wright가 법원에서 진 이유는 무엇인가요?",
    answer:
      "2024년 영국 고등법원은 Craig Wright가 제출한 증거 다수가 위조되거나 조작된 것으로 판단했습니다. 특히 디지털 문서의 생성 날짜·메타데이터 조작, 사토시 개인 키를 실제로 소유하고 있다는 증명 실패가 결정적이었습니다.",
  },
  {
    question: "사토시 나카모토가 왜 익명을 유지했나요?",
    answer:
      "명확히 알 수 없지만, 가장 유력한 이유는 두 가지입니다. 첫째, 자신이 알려지면 비트코인이 중앙화될 위험(창시자 의존). 둘째, 국가 통제 없는 전자화폐 시스템 창시에 따른 법적 리스크(자금세탁방지법, 미국 금융 규제 등). 마지막 이메일에서 '다른 일로 넘어갔다'고 했지만, 이를 글자 그대로 해석할 수는 없습니다.",
  },
  {
    question: "제네시스 블록의 숨겨진 메시지는 무슨 의미인가요?",
    answer:
      "2009년 1월 3일 더 타임즈 신문 헤드라인 'Chancellor on brink of second bailout for banks(은행에 대한 2차 구제금융 초읽기)'을 그대로 삽입했습니다. 이는 ① 블록 생성 시점을 역사적으로 증명하고, ② 중앙은행 중심의 기존 금융 시스템에 대한 불신과 비판을 담은 정치적 선언으로 해석됩니다.",
  },
  {
    question: "비트코인 백서는 누구나 읽을 수 있나요?",
    answer:
      "네. bitcoin.org/bitcoin.pdf에서 원문을 무료로 읽을 수 있습니다. 9페이지, 약 3,200단어로 매우 간결합니다. 비트코인뿐 아니라 블록체인 기술 전반을 이해하는 핵심 문서로, 컴퓨터 과학·암호학 전공자 수준의 배경 지식이 있으면 직접 읽을 수 있습니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const SNK_RELATED_LINKS = [
  {
    href: "/reports/bitcoin-annual-return-history/",
    label: "비트코인 연도별 수익률 역사",
    desc: "2011~2026년 연도별 시작가·종가·수익률 및 반감기 사이클",
  },
  {
    href: "/reports/bitcoin-supply-holders-2026/",
    label: "비트코인 보유 현황 2026",
    desc: "국가·기업·ETF·사토시 추정 보유량 분포 완전 분석",
  },
  {
    href: "/reports/ethereum-historical-returns-2015-2026/",
    label: "이더리움 연도별 수익률 역사",
    desc: "2015~2026년 ETH 연도별 성과 및 비탈릭 부테린 스토리",
  },
];

export const SNK_SOURCE_LINKS = [
  { label: "비트코인 백서 원문", url: "https://bitcoin.org/bitcoin.pdf" },
  { label: "Sergio Lerner — Patoshi 패턴 분석", url: "https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/" },
  { label: "COPA v Craig Wright 판결 (2024)", url: "https://www.judiciary.gov.uk/judgments/copa-v-wright/" },
];
