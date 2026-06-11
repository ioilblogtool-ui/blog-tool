// 스페이스X 상장(IPO) 전망 정리 리포트 데이터
// slug: spacex-ipo-outlook-2026

export const SPX_META = {
  slug: "spacex-ipo-outlook-2026",
  title: "스페이스X 상장(IPO) 전망 정리 리포트",
  seoTitle: "스페이스X 상장(IPO) 전망 | 시가총액·주주구성·투자방법 정리 2026",
  seoDescription:
    "비상장 기업 스페이스X의 추정 기업가치 추이, 주주 구성, IPO 일정 전망과 한국 투자자가 실제로 접근 가능한 간접 투자 방법(ETF·펀드·관련주)을 한 번에 정리합니다.",
  description:
    "세계에서 가장 가치 높은 비상장 기업, 스페이스X. 기업가치 추이와 주주 구성, 상장설을 둘러싼 루머, 그리고 한국 투자자의 현실적인 접근 방법까지 정리한 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-10",
  dataNote:
    "스페이스X는 비상장 기업으로 재무 정보가 공식 공개되지 않습니다. 기업가치·지분율·매출 구조는 직원 주식 매각(텐더오퍼)과 언론 보도를 기반으로 한 추정치이며, 실제 수치와 다를 수 있습니다. IPO 관련 일정은 공식 발표가 아닌 전망·루머이므로 투자 판단의 근거로 사용하지 마세요.",
};

// ─── KPI ────────────────────────────────────────────────────
export const SPX_KPI = {
  foundedYear: 2002,
  latestValuationUsd: 400_000_000_000, // 2025년 텐더오퍼 보도 기준 추정
  founderStakePct: 42, // 추정
  estRevenue2024Usd: 13_100_000_000, // 추정 (Starlink + 발사서비스)
  starlinkSubscribers: 5_000_000, // 추정 (2025년 기준)
  employeeCount: 13000, // 추정
};

// ─── 회사 프로필 ─────────────────────────────────────────────
export const SPX_PROFILE = {
  fullName: "Space Exploration Technologies Corp. (SpaceX)",
  founder: "일론 머스크 (Elon Musk)",
  founded: "2002년 3월, 미국 캘리포니아",
  headquarters: "텍사스주 스타베이스(Starbase) — 2024년 호손에서 본사 이전",
  ceo: "일론 머스크 (CEO 겸 CTO), 그윈 숏웰(COO·사장)",
  status: "비상장 (Private) — 직원·초기 투자자 대상 정기 텐더오퍼로만 주식 거래",
  businessUnits: [
    { name: "Falcon 9 / Falcon Heavy", detail: "재사용 발사체. 글로벌 상업·정부 발사 시장 점유율 1위" },
    { name: "Starship", detail: "차세대 완전 재사용 초대형 발사체. 달·화성 탐사용으로 개발 중" },
    { name: "Dragon", detail: "유인·화물 우주선. NASA ISS 수송 계약 수행" },
    { name: "Starlink", detail: "저궤도 위성 인터넷. 매출 비중이 가장 빠르게 성장 중인 사업부" },
  ],
};

// ─── 밸류에이션(기업가치) 추이 ────────────────────────────────
export type ValuationPoint = {
  year: string;
  valuationUsd: number; // USD
  label: string;
  note: string;
  estimate: boolean;
};

export const SPX_VALUATION_TIMELINE: ValuationPoint[] = [
  {
    year: "2002",
    valuationUsd: 100_000_000,
    label: "설립",
    note: "일론 머스크가 약 1억 달러를 투자해 설립",
    estimate: true,
  },
  {
    year: "2008",
    valuationUsd: 1_000_000_000,
    label: "NASA 계약 체결",
    note: "Falcon 1 궤도 진입 성공, NASA와 16억 달러 규모 화물 수송(CRS) 계약",
    estimate: true,
  },
  {
    year: "2015",
    valuationUsd: 12_000_000_000,
    label: "구글·피델리티 투자",
    note: "Google·Fidelity가 약 10억 달러 투자, Starlink 사업 구상 본격화",
    estimate: true,
  },
  {
    year: "2020",
    valuationUsd: 46_000_000_000,
    label: "Starlink 베타 출시",
    note: "코로나19 시기 다수 라운드 진행, Starlink 서비스 시작",
    estimate: true,
  },
  {
    year: "2022",
    valuationUsd: 127_000_000_000,
    label: "직원 텐더오퍼",
    note: "직원 주식 매각 기준 약 1,270억 달러 평가",
    estimate: true,
  },
  {
    year: "2023",
    valuationUsd: 180_000_000_000,
    label: "Starship 첫 통합 비행",
    note: "Starship 시험 비행 본격화, 평가액 1,800억 달러대 보도",
    estimate: true,
  },
  {
    year: "2024.12",
    valuationUsd: 350_000_000_000,
    label: "텐더오퍼 3,500억 달러",
    note: "직원·초기 투자자 대상 텐더오퍼에서 약 3,500억 달러 평가, 비상장 기업 세계 최고가 등극",
    estimate: true,
  },
  {
    year: "2025",
    valuationUsd: 400_000_000_000,
    label: "4,000억 달러 추정",
    note: "2025년 추가 텐더오퍼 협상 과정에서 약 4,000억 달러 안팎 거론 (보도 기준 추정)",
    estimate: true,
  },
];

// ─── 주주 구성 ─────────────────────────────────────────────────
export type ShareholderItem = {
  name: string;
  sharePct: number;
  type: "founder" | "institution" | "employee";
  note: string;
};

export const SPX_SHAREHOLDERS: ShareholderItem[] = [
  {
    name: "일론 머스크",
    sharePct: 42,
    type: "founder",
    note: "지분율은 약 42% 추정이나, 차등의결권 구조로 실제 의결권 비중은 이보다 훨씬 높은 것으로 알려짐",
  },
  {
    name: "기관·벤처 투자자",
    sharePct: 48,
    type: "institution",
    note: "Founders Fund, Sequoia Capital, Fidelity, Alphabet(Google), Baillie Gifford, T. Rowe Price 등 다수 기관 합산 추정",
  },
  {
    name: "임직원(ESOP)",
    sharePct: 10,
    type: "employee",
    note: "스톡옵션·RSU 형태로 임직원에게 배분, 정기 텐더오퍼를 통해 현금화",
  },
];

// ─── 매출 구조 ─────────────────────────────────────────────────
export type RevenueItem = {
  segment: string;
  pct: number;
  amountLabel: string;
  note: string;
};

export const SPX_REVENUE_MIX: RevenueItem[] = [
  {
    segment: "Starlink (위성 인터넷)",
    pct: 60,
    amountLabel: "약 78억 달러",
    note: "2024년 처음으로 발사 서비스 매출을 추월한 것으로 추정. 가입자 증가가 핵심 성장 동력",
  },
  {
    segment: "발사 서비스 (Falcon 9·Heavy)",
    pct: 38,
    amountLabel: "약 50억 달러",
    note: "상업 위성, NASA·국방부 계약 등. 연간 발사 횟수 기준 세계 1위 유지",
  },
  {
    segment: "기타 (Dragon 등)",
    pct: 2,
    amountLabel: "약 3억 달러",
    note: "유인·화물 우주선 운용 계약 등",
  },
];

// ─── IPO 전망 (루머/추정) ────────────────────────────────────
export type IpoOutlookItem = {
  date: string;
  title: string;
  detail: string;
  confidence: "낮음" | "중간" | "참고";
};

export const SPX_IPO_OUTLOOK: IpoOutlookItem[] = [
  {
    date: "2020년 발언",
    title: "머스크: \"Starlink 현금흐름 안정화 후 분리 상장 검토\"",
    detail:
      "일론 머스크는 Starlink의 매출과 성장세가 예측 가능한 단계에 이르면 별도 기업으로 분리 상장할 가능성을 언급했습니다. 다만 구체적 시점은 제시하지 않았습니다.",
    confidence: "중간",
  },
  {
    date: "2022~2023년 발언",
    title: "머스크: \"스페이스X 본체는 상장 계획 없음\"",
    detail:
      "머스크는 여러 차례 스페이스X 본체(발사체·Starship 사업)는 가까운 시일 내 상장할 계획이 없다고 밝혔습니다. 화성 이주라는 장기 목표상 단기 실적 압박을 받는 상장사 구조가 부적합하다는 이유를 들었습니다.",
    confidence: "중간",
  },
  {
    date: "2024년 이후 보도",
    title: "Starlink 분리 상장 시점 — 2027년 이후 거론",
    detail:
      "일부 외신·애널리스트는 Starlink 가입자 수와 매출이 충분히 성장하면 2027년 이후 별도 IPO가 가능할 것으로 전망합니다. 그러나 이는 회사의 공식 입장이 아닌 외부 전망에 불과합니다.",
    confidence: "낮음",
  },
  {
    date: "지속적 추정",
    title: "스페이스X 본체 상장은 '화성 이주 이후'?",
    detail:
      "머스크는 과거 인터뷰에서 \"화성에 정기적으로 사람을 보낼 수 있게 된 이후에나 스페이스X 상장을 고려할 수 있다\"는 취지로 언급한 적이 있습니다. 이는 사실상 단기간 내 본체 상장 가능성이 낮다는 신호로 해석됩니다.",
    confidence: "참고",
  },
];

// ─── 국내 투자자 접근 방법 ───────────────────────────────────
export type KoreaAccessItem = {
  method: string;
  description: string;
  pros: string[];
  cons: string[];
};

export const SPX_KOREA_ACCESS: KoreaAccessItem[] = [
  {
    method: "해외 비상장주식 거래 플랫폼",
    description:
      "Forge Global, EquityZen 등 미국 비상장주식 유통 플랫폼에서 SpaceX 지분이 거래되기도 합니다.",
    pros: ["스페이스X 지분에 직접 노출 가능"],
    cons: [
      "대부분 '적격투자자(Accredited Investor)' 자격 요건 필요",
      "최소 투자금액이 매우 높고, 유동성이 극히 낮음",
      "국내 개인투자자가 직접 이용하기 사실상 어려움",
    ],
  },
  {
    method: "Pre-IPO 전문 펀드",
    description:
      "국내 일부 증권사·자산운용사가 SpaceX를 포함한 미국 비상장 기술기업에 투자하는 사모펀드를 출시한 사례가 있습니다.",
    pros: ["전문 운용사를 통한 간접 노출", "환전·세금 처리를 위탁 가능"],
    cons: [
      "최소 가입 금액이 수천만 원~수억 원 단위로 높음",
      "사모펀드 특성상 환매·유동성 제약이 큼",
      "운용보수·성과보수 부담",
    ],
  },
  {
    method: "간접 ETF·펀드 (미국 상장)",
    description:
      "Destiny Tech100(DXYZ), ARK Venture Fund(ARKVX) 등은 SpaceX 지분을 포트폴리오에 일부 편입한 미국 상장 펀드입니다. 국내 해외주식 계좌로 매수할 수 있습니다.",
    pros: [
      "국내 증권사 해외주식 계좌로 비교적 쉽게 매수 가능",
      "SpaceX 외에도 다수 비상장 기업에 분산 투자",
    ],
    cons: [
      "SpaceX 비중이 펀드 내 일부에 불과 (분산 투자 구조)",
      "운용보수가 일반 ETF 대비 높은 편",
      "비상장 자산 평가 방식에 따라 가격 변동성·괴리 발생 가능",
    ],
  },
  {
    method: "국내 우주산업 테마 관련주",
    description:
      "한화시스템, AP위성, 인텔리안테크 등은 위성·우주산업 밸류체인에 속한 국내 상장사입니다.",
    pros: ["국내 증권 계좌로 즉시 매매 가능", "원화 기준 투자, 환전 불필요"],
    cons: [
      "SpaceX와 지분·자본 관계가 없는 별개의 기업",
      "스페이스X 실적과 직접적인 연동성은 없으며 산업 테마상의 간접 연관일 뿐",
      "단순 테마성 변동성에 유의해야 함",
    ],
  },
];

// ─── FAQ ──────────────────────────────────────────────────────
export const SPX_FAQ = [
  {
    question: "스페이스X는 언제 상장(IPO)하나요?",
    answer:
      "공식적으로 정해진 상장 일정은 없습니다. 일론 머스크는 스페이스X 본체의 단기 상장 계획을 여러 차례 부인했으며, Starlink 분리 상장 가능성만 제한적으로 언급한 바 있습니다. 2027년 이후 Starlink 상장 가능성이 일부 외신에서 전망되지만, 이는 추정·루머 수준의 정보입니다.",
  },
  {
    question: "스페이스X의 현재 기업가치는 얼마인가요?",
    answer:
      "2024년 12월 직원 대상 텐더오퍼 기준 약 3,500억 달러로 평가되었고, 2025년에는 약 4,000억 달러 안팎이 거론되는 것으로 보도되었습니다. 비상장 기업이라 정확한 시가총액은 공개되지 않으며, 모두 텐더오퍼·언론 보도 기반 추정치입니다.",
  },
  {
    question: "한국에서 스페이스X 주식을 직접 살 수 있나요?",
    answer:
      "일반적인 국내 증권 계좌로는 직접 매수할 수 없습니다. Forge Global 같은 해외 비상장주식 플랫폼은 적격투자자 자격과 높은 최소 투자금액이 필요해 개인투자자의 접근이 사실상 제한적입니다.",
  },
  {
    question: "Destiny Tech100, ARK Venture Fund는 무엇인가요?",
    answer:
      "두 펀드 모두 미국에 상장되어 있으며, SpaceX를 포함한 여러 비상장 기술기업 지분을 포트폴리오에 담고 있습니다. 국내 해외주식 계좌로 매매할 수 있어 SpaceX에 대한 간접 노출 수단으로 언급되지만, SpaceX 비중은 펀드 일부에 불과합니다.",
  },
  {
    question: "Starlink이 따로 상장한다는 게 사실인가요?",
    answer:
      "일론 머스크가 과거 Starlink의 현금흐름이 안정화되면 분리 상장을 검토할 수 있다고 언급한 적은 있지만, 구체적인 일정이나 공식 계획은 발표되지 않았습니다. 2027년 이후라는 전망도 외부 애널리스트의 추정일 뿐입니다.",
  },
  {
    question: "한화시스템, AP위성 같은 종목은 SpaceX와 관련이 있나요?",
    answer:
      "아니요. 한화시스템, AP위성, 인텔리안테크 등은 위성·우주산업이라는 같은 산업군에 속한 국내 상장사일 뿐, SpaceX와 지분이나 자본 관계는 없습니다. '우주 테마' 연관주로 분류되는 것이며 SpaceX의 실적·상장 여부와 직접적인 연동은 없습니다.",
  },
];

// ─── 관련 리포트 링크 ────────────────────────────────────────
export const SPX_RELATED_LINKS = [
  {
    href: "/reports/etf-vs-direct-stock-10year-2026/",
    label: "ETF vs 직접투자 10년 비교",
    desc: "분산 투자와 개별 종목 투자, 10년 수익률·MDD 비교",
  },
  {
    href: "/reports/us-stock-korean-real-return-2026/",
    label: "국내 투자자 미국주식 실수익률 분석",
    desc: "환율·수수료·세금을 반영한 한국 투자자 기준 실수익률",
  },
  {
    href: "/reports/semiconductor-value-chain/",
    label: "반도체 산업 구조 한눈에 보기",
    desc: "밸류체인 단계별 기업 역할을 인터랙티브로 이해",
  },
];
