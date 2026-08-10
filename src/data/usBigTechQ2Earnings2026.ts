export type BeatMiss = "beat" | "miss" | "mixed" | "pending";

export type EarningsMetric = {
  id: string;
  ticker: string;
  name: string;
  nameKr: string;
  rank: number;
  reported: boolean;
  reportDateDisplay: string;
  fiscalLabel: string;
  revenueUsdB: number | null;
  revenueYoyPct: number | null;
  revenueVsConsensus: BeatMiss;
  epsDisplay: string | null;
  epsVsConsensus: BeatMiss;
  epsCaveat?: string;
  stockReactionPct: number | null;
  stockReactionNote: string;
  capexNote: string;
  summary: string;
  highlights: string[];
  tags: string[];
  sourceName: string;
  sourceUrl: string;
};

export type EarningsPattern = {
  title: string;
  body: string;
};

export type EarningsFaq = {
  question: string;
  answer: string;
};

export const reportMeta = {
  slug: "us-bigtech-q2-2026-earnings",
  title: "미국 빅테크 2분기 실적 2026 완전 정리 | 누가 오르고 누가 내렸나",
  description:
    "애플·MS·구글·아마존·메타·테슬라·넷플릭스·AMD·팔란티어 2026년 2분기 실적을 매출·EPS·주가 반응·AI 투자로 비교. 실적은 좋은데 주가가 떨어진 이유까지 정리했습니다."
};

export const dataMeta = {
  asOfDate: "2026-08-07",
  asOfDateDisplay: "2026년 8월 7일",
  periodLabel: "2026년 2분기(4~6월, 각 사 회계분기 기준)",
  sourceNote: "각 사 공식 IR·SEC 공시, Reuters·CNBC·Bloomberg 등 보도 종합"
};

export const cautionNotes = [
  "이 리포트는 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있습니다.",
  "아마존·알파벳의 EPS는 지분 투자 평가이익 등 일회성 요인이 크게 반영되어 있어 카드 내 주의문을 함께 확인하세요.",
  "엔비디아는 2026년 8월 7일 기준 미발표이며, 실적 발표(2026년 8월 26일 예정) 후 갱신됩니다.",
  "컨센서스 대비 beat·miss는 조사 시점 기준 보도 수치이며 이후 소급 수정될 수 있습니다."
];

export const earningsList: EarningsMetric[] = [
  {
    id: "apple",
    ticker: "AAPL",
    name: "Apple",
    nameKr: "애플",
    rank: 1,
    reported: true,
    reportDateDisplay: "2026년 7월 30일",
    fiscalLabel: "FY2026 3분기(4~6월)",
    revenueUsdB: 109.4,
    revenueYoyPct: 16,
    revenueVsConsensus: "beat",
    epsDisplay: "$2.02",
    epsVsConsensus: "beat",
    stockReactionPct: -6.65,
    stockReactionNote: "실적 발표 후 시간외 -6.65%, 16개월래 최대 낙폭",
    capexNote: "AI·Private Cloud Compute 투자를 \"대폭\" 확대하겠다고 시사했지만 구체적 금액은 공개하지 않았습니다.",
    summary:
      "매출과 EPS 모두 컨센서스를 넘겼지만, 다음 분기 매출 성장률 가이던스가 시장 기대(12%)보다 낮은 9~11%로 제시되고 D램·낸드 가격 급등 우려가 겹치며 주가가 급락했습니다.",
    highlights: [
      "매출 $109.4B(+16% YoY), EPS $2.02로 컨센서스 상회",
      "Q4 매출 성장률 가이던스 9~11%로 컨센서스(12%) 하회",
      "메모리 가격 급등(D램·낸드) 우려와 서비스 매출 부진 겹침",
      "팀 쿡의 CEO로서 마지막 실적 발표"
    ],
    tags: ["실적beat", "주가하락", "가이던스미달"],
    sourceName: "Apple Newsroom",
    sourceUrl: "https://www.apple.com/newsroom/2026/07/apple-reports-third-quarter-results/"
  },
  {
    id: "microsoft",
    ticker: "MSFT",
    name: "Microsoft",
    nameKr: "마이크로소프트",
    rank: 2,
    reported: true,
    reportDateDisplay: "2026년 7월 29일",
    fiscalLabel: "FY2026 4분기(4~6월)",
    revenueUsdB: 90.01,
    revenueYoyPct: 18,
    revenueVsConsensus: "beat",
    epsDisplay: "$4.74(non-GAAP)",
    epsVsConsensus: "beat",
    stockReactionPct: 8.5,
    stockReactionNote: "실적 발표 후 시간외 최대 +8~9%, 하루 만에 시가총액 약 2,600억 달러 증가",
    capexNote: "FY2027 capex 가이던스 $255~260B(전년 대비 +35%)을 그대로 재확인했습니다.",
    summary:
      "Azure가 컨센서스를 웃도는 43% 성장(고정환율 기준)을 기록하며 연매출 100B달러를 처음 돌파했고, 기존 capex 가이던스를 상향이 아닌 재확인만 하면서 시장이 안도해 주가가 급등했습니다.",
    highlights: [
      "Azure +43%(고정환율), 연매출 최초 $100B 돌파",
      "매출 $90.01B(+18%), non-GAAP EPS $4.74 컨센서스 상회",
      "FY2027 capex $255~260B, 기존 가이던스 유지",
      "Copilot 유료 좌석 3,000만 개 돌파(전분기 2,000만)"
    ],
    tags: ["실적beat", "주가상승", "가이던스재확인"],
    sourceName: "Microsoft IR",
    sourceUrl: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q4/press-release-webcast"
  },
  {
    id: "alphabet",
    ticker: "GOOGL",
    name: "Alphabet",
    nameKr: "알파벳(구글)",
    rank: 3,
    reported: true,
    reportDateDisplay: "2026년 7월 22일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 119.8,
    revenueYoyPct: 24,
    revenueVsConsensus: "beat",
    epsDisplay: "GAAP $9.11 / 조정 $2.85",
    epsVsConsensus: "mixed",
    epsCaveat:
      "GAAP EPS $9.11에는 지분증권 평가이익 약 $990억(주당 +$6.26 효과)이 포함되어 있습니다. 영업 실적과 더 가까운 조정 EPS는 $2.85로 컨센서스에 소폭 못 미쳤습니다.",
    stockReactionPct: -6,
    stockReactionNote: "매출·영업이익 beat에도 시간외 -6%대 하락",
    capexNote: "2026년 capex 가이던스를 기존 $180~190B에서 $195~205B로 상향했습니다.",
    summary:
      "구글 클라우드가 82% 급성장하며 매출은 컨센서스를 크게 웃돌았지만, capex 가이던스를 시장 예상보다 더 큰 폭으로 상향하면서 AI 투자 부담 우려로 주가가 하락했습니다.",
    highlights: [
      "매출 $119.8B(+24%), 구글 클라우드 +82%로 $24.8B",
      "GAAP EPS는 일회성 지분평가이익으로 급증, 조정 EPS는 컨센서스 소폭 미달",
      "2026년 capex 가이던스 $195~205B로 상향(기존 $180~190B)",
      "검색 매출 +17%, 유튜브 광고 +13%"
    ],
    tags: ["실적beat", "주가하락", "capex상향", "일회성이익"],
    sourceName: "Alphabet Q2 2026 Earnings Release",
    sourceUrl: "https://s206.q4cdn.com/479360582/files/doc_financials/2026/q2/2026q2-alphabet-earnings-release.pdf"
  },
  {
    id: "amazon",
    ticker: "AMZN",
    name: "Amazon",
    nameKr: "아마존",
    rank: 4,
    reported: true,
    reportDateDisplay: "2026년 7월 30일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 200.6,
    revenueYoyPct: 20,
    revenueVsConsensus: "beat",
    epsDisplay: "$5.75",
    epsVsConsensus: "beat",
    epsCaveat:
      "순이익에는 Anthropic 지분 투자에서 발생한 비영업·평가성 이익 약 $534억이 포함되어 있습니다. 이를 제외하면 영업 실적만으로 본 서프라이즈는 헤드라인보다 훨씬 작습니다.",
    stockReactionPct: 9,
    stockReactionNote: "실적 발표 후 시간외 +9%",
    capexNote: "2026년 capex 가이던스를 기존 약 $200B에서 약 $220B로 상향했습니다.",
    summary:
      "AWS가 18분기 만에 가장 빠른 37% 성장을 기록하며 실적 자체도 견조했지만, 헤드라인 EPS 급증은 대부분 Anthropic 지분 평가이익에서 나온 것이라 실제 영업 개선폭은 더 냉정하게 볼 필요가 있습니다.",
    highlights: [
      "매출 $200.6B(+20%), 첫 분기 매출 $200B 돌파",
      "AWS +37%로 $42.2B, 영업이익률 39.4%",
      "순이익 $62.6B 중 상당 부분이 Anthropic 지분평가이익",
      "2026년 capex 가이던스 ~$220B로 상향"
    ],
    tags: ["실적beat", "주가상승", "일회성이익", "capex상향"],
    sourceName: "Amazon SEC 8-K",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/1018724/000101872426000024/amzn-20260630xex991.htm"
  },
  {
    id: "meta",
    ticker: "META",
    name: "Meta",
    nameKr: "메타",
    rank: 5,
    reported: true,
    reportDateDisplay: "2026년 7월 29일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 60.8,
    revenueYoyPct: 28,
    revenueVsConsensus: "beat",
    epsDisplay: "$6.18",
    epsVsConsensus: "miss",
    epsCaveat: "소송충당금 $24억과 구조조정비용 $11.8억이 반영되며 EPS가 컨센서스(약 $7.22)를 크게 밑돌았습니다.",
    stockReactionPct: -9.64,
    stockReactionNote: "실적 발표 후 시간외 -9.64%",
    capexNote: "2026년 capex 가이던스를 $130~145B로 상향했고, 잉여현금흐름은 $7.8억으로 급감했습니다.",
    summary:
      "광고 매출은 컨센서스를 넘어섰지만 일회성 비용으로 EPS가 크게 미달했고, capex 가이던스까지 상향되며 잉여현금흐름이 사실상 소진되자 주가가 급락했습니다.",
    highlights: [
      "매출 $60.8B(+28%), 광고 매출 $59.4B(+27%)",
      "EPS $6.18로 컨센서스 미달(소송충당금·구조조정비용 반영)",
      "2026년 capex 가이던스 $130~145B로 상향",
      "잉여현금흐름 $7.8억으로 전년($85.5억) 대비 급감"
    ],
    tags: ["EPSmiss", "주가하락", "capex상향"],
    sourceName: "Meta Q2 2026 실적 보도",
    sourceUrl: "https://www.tradingkey.com/analysis/stocks/us-stocks/262063667-meta-stock-crashing-after-q2-2026-earnings-eps-miss-capex-tradingkey"
  },
  {
    id: "nvidia",
    ticker: "NVDA",
    name: "Nvidia",
    nameKr: "엔비디아",
    rank: 6,
    reported: false,
    reportDateDisplay: "2026년 8월 26일 예정",
    fiscalLabel: "FY2027 2분기(5~7월)",
    revenueUsdB: null,
    revenueYoyPct: null,
    revenueVsConsensus: "pending",
    epsDisplay: null,
    epsVsConsensus: "pending",
    stockReactionPct: null,
    stockReactionNote: "실적 미발표",
    capexNote: "실적 미발표 상태로 capex 관련 공시 없음.",
    summary:
      "엔비디아는 2026년 8월 7일 기준 아직 해당 분기 실적을 발표하지 않았습니다. 실적 발표는 2026년 8월 26일로 예정되어 있으며, 발표 후 이 리포트에 수치가 추가됩니다.",
    highlights: [
      "실적 발표 예정일: 2026년 8월 26일",
      "다른 8개사와 달리 아직 매출·EPS 수치 없음",
      "발표 후 데이터 갱신 예정"
    ],
    tags: ["미발표"],
    sourceName: "StreetInsider",
    sourceUrl: "https://www.streetinsider.com/Corporate+News/Nvidia+schedules+Q2+fiscal+2027+earnings+call+for+August+26/26836264.html"
  },
  {
    id: "tesla",
    ticker: "TSLA",
    name: "Tesla",
    nameKr: "테슬라",
    rank: 7,
    reported: true,
    reportDateDisplay: "2026년 7월 22일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 28.24,
    revenueYoyPct: 26,
    revenueVsConsensus: "beat",
    epsDisplay: "$0.33(조정)",
    epsVsConsensus: "miss",
    stockReactionPct: -3.92,
    stockReactionNote: "정규장 -1.29%에 이어 시간외 추가 -3.92%",
    capexNote: "분기 capex 약 $25B. 로보택시·옵티머스·반도체 팹·xAI 투자 등으로 향후 2~3년 지속 증가 예고.",
    summary:
      "매출은 기록적인 배터리 저장장치 출하와 함께 컨센서스를 크게 웃돌았지만, 조정 EPS가 컨센서스에 크게 못 미쳤고 잉여현금흐름이 마이너스로 전환하며 주가가 하락했습니다.",
    highlights: [
      "매출 $28.24B(+26%), 컨센서스 대비 $26.9억 상회",
      "조정 EPS $0.33으로 컨센서스($0.49) 대비 약 33% 미달",
      "잉여현금흐름 -$11억으로 전년(+$1.46억) 대비 적자 전환",
      "xAI에 $20억 투자 공개, 로보택시 누적 주행거리 38만 마일 돌파"
    ],
    tags: ["매출beat", "EPSmiss", "주가하락"],
    sourceName: "Electrek",
    sourceUrl: "https://electrek.co/2026/07/22/tesla-tsla-q2-2026-financial-results/"
  },
  {
    id: "netflix",
    ticker: "NFLX",
    name: "Netflix",
    nameKr: "넷플릭스",
    rank: 8,
    reported: true,
    reportDateDisplay: "2026년 7월 16일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 12.56,
    revenueYoyPct: 13,
    revenueVsConsensus: "mixed",
    epsDisplay: "$0.80",
    epsVsConsensus: "beat",
    stockReactionPct: -9,
    stockReactionNote: "실적 발표 후 시간외 약 -9%, 다음날 52주 신저가 경신",
    capexNote: "빅테크와 달리 별도 AI 인프라 capex 수치를 공시하지 않습니다.",
    summary:
      "매출은 예상치에 근소하게 못 미쳤고 EPS는 근소하게 상회하는 등 실적 자체는 무난했지만, 3분기 가이던스가 약하고 연간 매출 전망 범위를 좁히면서 주가가 크게 하락했습니다.",
    highlights: [
      "매출 $12.56B(+13%), 예상치($12.58B)에 근소하게 미달",
      "EPS $0.80으로 컨센서스($0.79) 근소 상회",
      "3분기 가이던스 약세, 연간 매출 전망 범위 축소",
      "실적 발표 다음날 52주 신저가 경신"
    ],
    tags: ["가이던스약세", "주가하락"],
    sourceName: "Netflix Q2 2026 Shareholder Letter",
    sourceUrl: "https://s22.q4cdn.com/959853165/files/doc_financials/2026/q2/FINAL-Q2-26-Shareholder-Letter.pdf"
  },
  {
    id: "amd",
    ticker: "AMD",
    name: "AMD",
    nameKr: "AMD",
    rank: 9,
    reported: true,
    reportDateDisplay: "2026년 8월 4일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 11.5,
    revenueYoyPct: 50,
    revenueVsConsensus: "beat",
    epsDisplay: "$1.66(non-GAAP)",
    epsVsConsensus: "beat",
    stockReactionPct: -8.94,
    stockReactionNote: "정규장 +7%로 마감했으나 시간외 -8.94%(뉴스에 팔기)",
    capexNote: "별도 capex 가이던스 공시는 없으나 데이터센터 매출이 전년 대비 107% 급증했습니다.",
    summary:
      "매출·EPS 모두 역대 최고치를 경신하며 컨센서스를 넘겼고 3분기 가이던스도 시장 예상을 웃돌았지만, 정규장에서 이미 크게 오른 상태였던 만큼 시간외에는 차익 실현 매물이 쏟아졌습니다.",
    highlights: [
      "매출 $11.5B(+50%, 역대 최고), 데이터센터 매출 +107%로 $6.7B",
      "non-GAAP EPS $1.66로 컨센서스($1.62) 상회",
      "3분기 가이던스 $12.7~13.3B, 컨센서스($12.5B) 상회",
      "정규장 +7% → 시간외 -8.94%로 반전"
    ],
    tags: ["실적beat", "가이던스beat", "시간외하락"],
    sourceName: "Yahoo Finance",
    sourceUrl: "https://finance.yahoo.com/markets/stocks/articles/amd-q2-2026-earnings-record-202927876.html"
  },
  {
    id: "palantir",
    ticker: "PLTR",
    name: "Palantir Technologies",
    nameKr: "팔란티어",
    rank: 10,
    reported: true,
    reportDateDisplay: "2026년 8월 3일",
    fiscalLabel: "2026년 2분기(4~6월)",
    revenueUsdB: 1.94,
    revenueYoyPct: 93,
    revenueVsConsensus: "beat",
    epsDisplay: "$0.41(조정)",
    epsVsConsensus: "beat",
    stockReactionPct: 29.7,
    stockReactionNote: "발표 당일 시간외 +11.36%에 이어 다음 거래일 정규장에서 +29.7% 급등, 2년래 최대 하루 상승폭",
    capexNote: "빅테크 인프라 기업과 달리 대규모 AI 데이터센터 capex 가이던스를 공시하지 않는 소프트웨어 기업입니다.",
    summary:
      "미국 상업 부문 매출이 149% 급증하며 전체 매출 성장률이 93%로 역대 최고치를 기록했고, 연간 매출 가이던스를 큰 폭으로 상향하자 주가가 실적 발표 다음 날 2년래 최대 하루 상승폭을 기록하며 급등했습니다.",
    highlights: [
      "매출 $1.94B(+93% YoY, 역대 최고 성장률), 컨센서스($1.81B) 상회",
      "미국 상업 부문 매출 $764M(+149%), 미국 정부 부문 $809M(+90%)",
      "조정 EPS $0.41로 컨센서스($0.34) 상회, GAAP 순이익률 55%",
      "2026년 매출 가이던스 82% 성장(약 $81.5억)으로 상향, 순매출유지율 157%"
    ],
    tags: ["실적beat", "가이던스beat", "주가급등"],
    sourceName: "Palantir Technologies SEC 8-K",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0001321655/000132165526000039/pltr-20260803.htm"
  }
];

export const earningsPatterns: EarningsPattern[] = [
  {
    title: "beat해도 주가는 떨어졌다",
    body: "알파벳과 메타는 매출이 컨센서스를 웃돌았지만 주가는 각각 6%대, 9%대 넘게 하락했습니다. 공통점은 2026년 capex 가이던스를 시장 예상보다 더 크게 상향했다는 점입니다. 애플도 매출·EPS beat에도 불구하고 약한 가이던스와 메모리 가격 우려로 6%대 급락했습니다."
  },
  {
    title: "마이크로소프트만 반대로 급등한 이유",
    body: "마이크로소프트는 capex 가이던스를 상향하지 않고 기존 $255~260B 규모를 그대로 재확인만 했습니다. \"더 늘어나는지\"가 아니라 \"예상보다 더 늘어나는지\"에 시장이 반응한다는 점을 보여주는 사례로, Azure 43% 성장이라는 강한 실적이 뒷받침되며 시간외 8~9% 급등했습니다."
  },
  {
    title: "헤드라인 EPS를 그대로 믿으면 안 되는 이유",
    body: "아마존(EPS $5.75)과 알파벳(GAAP EPS $9.11)은 표면적으로 컨센서스를 크게 넘겼지만, 각각 Anthropic 지분 평가이익 약 $534억, 지분증권 평가이익 약 $990억이라는 일회성·비영업 요인이 크게 반영된 결과입니다. 영업 실적만 보려면 알파벳의 조정 EPS($2.85, 컨센서스 소폭 미달)처럼 별도로 확인해야 합니다."
  },
  {
    title: "매그니피센트7, 사실 S&P500보다 못 올랐다",
    body: "실적 시즌이 진행되는 동안 나스닥100 변동성 지수는 약 14개월래 최고치를 기록했습니다. 매그니피센트7은 2026년 들어 S&P500(+9%대)을 밑도는 약보합(-1%대) 흐름을 보였고, 실제로 이번 분기 S&P500 이익 성장 상위 5개 기업 중 4곳은 마이크론·셰브런·엑슨모빌·브로드컴 등 빅테크 밖의 기업이었습니다."
  },
  {
    title: "매그니피센트7 밖에서는 정반대 반응이 나왔다",
    body: "같은 기간 팔란티어는 미국 상업 부문 매출이 149% 급증하며 매출 성장률 93%로 역대 최고치를 찍었고, 연간 가이던스까지 큰 폭으로 상향하자 다음 거래일 주가가 29.7% 급등했습니다. capex 부담이 없는 소프트웨어형 AI 기업은 '가이던스 상향 = 주가 하락'이라는 빅테크 패턴과 반대로, 실적과 주가가 같은 방향으로 움직였습니다."
  }
];

export const earningsFaq: EarningsFaq[] = [
  {
    question: "엔비디아 실적은 언제 발표되나요?",
    answer:
      "엔비디아의 FY2027 2분기(2026년 5~7월) 실적은 2026년 8월 26일 발표 예정입니다. 이 리포트는 2026년 8월 7일 기준으로 작성되어 엔비디아 수치는 아직 포함되어 있지 않으며, 발표 후 업데이트될 예정입니다."
  },
  {
    question: "실적이 좋은데 왜 주가가 떨어지나요?",
    answer:
      "2026년 2분기 실적 시즌에서는 매출·EPS가 컨센서스를 넘겨도 AI 설비투자(capex) 가이던스를 시장 예상보다 더 크게 상향한 기업(알파벳, 메타, 아마존)의 주가가 하락하는 패턴이 반복됐습니다. 반대로 가이던스를 상향 없이 재확인만 한 마이크로소프트는 주가가 급등했습니다. 시장이 'AI 투자가 느는지'보다 '예상보다 더 느는지'에 더 민감하게 반응한 결과로 해석됩니다."
  },
  {
    question: "아마존·알파벳 EPS가 컨센서스를 크게 넘긴 이유는 무엇인가요?",
    answer:
      "아마존은 Anthropic 지분 투자에서 발생한 비영업 평가이익 약 $534억이, 알파벳은 지분증권 평가이익 약 $990억(주당 +$6.26 효과)이 순이익에 반영되며 헤드라인 EPS가 크게 부풀려졌습니다. 두 경우 모두 실제 영업 실적 개선분과는 구분해서 봐야 하는 일회성 요인입니다."
  },
  {
    question: "매그니피센트7 실적이 나스닥 전체 분위기에 어떤 영향을 줬나요?",
    answer:
      "실적 발표가 몰린 기간 동안 나스닥100 변동성 지수가 약 14개월래 최고치를 기록할 정도로 시장이 크게 출렁였습니다. 다만 매그니피센트7 자체는 2026년 들어 S&P500 대비 부진한 흐름을 보이고 있어, AI 투자 확대가 곧바로 주가 강세로 이어지지는 않는 모습입니다."
  },
  {
    question: "이 리포트의 컨센서스·주가 반응 수치는 얼마나 신뢰할 수 있나요?",
    answer:
      "각 사 공식 IR 자료, SEC 공시(8-K), Reuters·CNBC·Bloomberg 등 주요 매체 보도를 종합해 2026년 8월 7일 기준으로 정리했습니다. 컨센서스 추정치와 주가 반응률은 보도 시점 기준이며, 이후 실적 정정이나 컨센서스 소급 수정이 있을 수 있습니다. 투자 권유가 아니며 투자 판단과 책임은 본인에게 있습니다."
  }
];
