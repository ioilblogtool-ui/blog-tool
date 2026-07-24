// ── 타입 ──────────────────────────────────────────

export type CumulativeStat = {
  id: string;
  label: string;
  value: string;
  note: string;
  highlight?: boolean;
};

export type MarketConditionRow = {
  market: string;
  futuresCondition: string;
  spotCondition: string;
  duration: string;
  action: string;
};

export type HistoricalComparisonRow = {
  metric: string;
  year2008: string;
  year2026: string;
};

export type MechanismComparisonRow = {
  label: string;
  sidecar: string;
  circuitBreaker: string;
};

export type CircuitBreakerStageRow = {
  stage: string;
  condition: string;
  action: string;
};

export type CauseCard = {
  title: string;
  detail: string;
};

export type ChecklistItem = {
  title: string;
  detail: string;
};

export type RecentRecord = {
  date: string;
  market: string;
  type: string;
  time: string;
  ordinalNote: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const KSR_META = {
  slug: "kospi-sidecar-record-2026",
  title: "2026년 코스피 사이드카 41회 발동",
  seoTitle: "2026 코스피 사이드카 41회 | 2008 금융위기 26회 비교",
  seoDescription:
    "2026년 7월 24일 기준 코스피 사이드카는 41회 발동됐습니다. 매수·매도 발동 횟수, 2008년 금융위기와의 비교, 코스닥·서킷브레이커와의 차이를 정리합니다.",
  description: "2026년 코스피·코스닥 사이드카 누적 발동 현황과 2008년 금융위기 기록 비교, 발동 조건, 개인 투자자 체크리스트까지 정리한 리포트입니다.",
  updatedAt: "2026-07-24",
  dataNote:
    "이 리포트의 누적 발동 횟수는 2026년 7월 24일 보도 기준 스냅샷입니다. 사이드카는 지금도 계속 발동되고 있어 실제 누적 횟수는 더 늘었을 수 있으며, 최신 수치는 한국거래소 공시나 최근 기사에서 확인하는 것이 정확합니다.",
};

export const KSR_CUMULATIVE_STATS: CumulativeStat[] = [
  { id: "kospi", label: "코스피 누적", value: "41회", note: "매수 20회 · 매도 21회" },
  { id: "kosdaq", label: "코스닥 누적", value: "25회", note: "매수 14회 · 매도 11회" },
  { id: "total", label: "코스피+코스닥 합산", value: "66회", note: "두 시장 단순 합산", highlight: true },
  { id: "multiple", label: "2008년 코스피 대비", value: "약 1.58배", note: "41회 ÷ 26회 (같은 시장 기준)" },
];

export const KSR_HISTORICAL_COMPARISON: HistoricalComparisonRow[] = [
  { metric: "코스피 사이드카", year2008: "26회", year2026: "41회" },
  { metric: "코스닥 사이드카", year2008: "19회", year2026: "25회" },
  { metric: "코스피+코스닥 합계", year2008: "45회", year2026: "66회" },
];

export const KSR_MARKET_CONDITIONS: MarketConditionRow[] = [
  {
    market: "코스피",
    futuresCondition: "코스피200 선물이 기준가격 대비 5% 이상 상승 또는 하락",
    spotCondition: "별도 현물지수 조건 없음",
    duration: "1분 지속",
    action: "프로그램매매 호가 효력 5분 정지",
  },
  {
    market: "코스닥",
    futuresCondition: "코스닥150 선물이 기준가격 대비 6% 이상 상승 또는 하락",
    spotCondition: "코스닥150 지수가 직전 거래일 종가 대비 3% 이상 같은 방향으로 변동",
    duration: "동시 1분 지속",
    action: "프로그램매매 호가 효력 5분 정지",
  },
];

export const KSR_MECHANISM_COMPARISON: MechanismComparisonRow[] = [
  { label: "목적", sidecar: "프로그램매매 충격 완화", circuitBreaker: "시장 전체 급락 충격 완화" },
  { label: "기준", sidecar: "선물가격 급등·급락", circuitBreaker: "현물 주가지수 급락" },
  { label: "정지 대상", sidecar: "프로그램매매 호가만", circuitBreaker: "시장 전체 매매" },
  { label: "정지 시간", sidecar: "5분", circuitBreaker: "1·2단계 20분, 3단계는 당일 종료" },
  { label: "상승 시 발동", sidecar: "가능(매수 사이드카)", circuitBreaker: "불가능" },
  { label: "하락 시 발동", sidecar: "가능(매도 사이드카)", circuitBreaker: "가능" },
];

export const KSR_CB_STAGES: CircuitBreakerStageRow[] = [
  { stage: "1단계", condition: "지수가 전일 대비 8% 이상 하락한 상태로 1분 지속", action: "전 종목 매매 20분 정지 후 재개" },
  { stage: "2단계", condition: "지수가 전일 대비 15% 이상 하락 + 1단계 시점보다 1%p 이상 추가 하락, 1분 지속", action: "전 종목 매매 20분 정지 후 재개" },
  { stage: "3단계", condition: "지수가 전일 대비 20% 이상 하락 + 2단계 시점보다 1%p 이상 추가 하락, 1분 지속", action: "당일 매매 즉시 종료" },
];

export const KSR_CAUSE_CARDS: CauseCard[] = [
  {
    title: "반도체 대형주 집중도",
    detail: "삼성전자·SK하이닉스 등 반도체 대형주의 시가총액 비중이 커지면서, 이들 종목의 급등락이 코스피200 선물과 지수 전체에 빠르게 반영된다는 분석이 있습니다.",
  },
  {
    title: "글로벌 반도체주 변동성",
    detail: "미국 반도체 기업의 주가 조정, AI 인프라 투자 수익성 논쟁이 국내 반도체 대형주 투자심리에 영향을 줬다는 보도가 이어졌습니다.",
  },
  {
    title: "선물·ETF 연계 매매 확대",
    detail: "레버리지·인버스 ETF와 프로그램매매 규모가 커지면서 특정 시간대 리밸런싱 수요가 단기 변동성을 키운다는 지적이 있습니다. 다만 이것이 사이드카 발동의 직접적인 원인이라고 단정하기는 어렵습니다.",
  },
  {
    title: "기준금리 인상",
    detail: "한국은행이 2026년 7월 16일 기준금리를 2.50%에서 2.75%로 인상했습니다. 금리 상승은 주식 할인율과 위험자산 선호도에 영향을 줄 수 있습니다.",
  },
  {
    title: "지정학적 위험과 외국인 수급",
    detail: "중동 정세 등 지정학적 불확실성이 커지는 날에는 외국인의 선물·현물 동시 매도가 늘며 단기 변동성이 확대되는 경향이 보도됐습니다.",
  },
];

export const KSR_CHECKLIST: ChecklistItem[] = [
  { title: "매수·매도 구분", detail: "급등에 따른 매수 사이드카인지, 급락에 따른 매도 사이드카인지 먼저 확인합니다." },
  { title: "선물 움직임", detail: "코스피200·코스닥150 선물의 변동 방향과 낙폭(또는 상승폭)을 확인합니다." },
  { title: "외국인·기관 수급", detail: "현물과 선물을 동시에 매도(또는 매수)하고 있는지 확인합니다." },
  { title: "환율", detail: "원·달러 환율이 함께 급등락하는지 확인합니다." },
  { title: "종목 집중도", detail: "삼성전자·SK하이닉스 등 일부 대형주가 지수 움직임을 주도하는지 확인합니다." },
];

export const KSR_AVOID_LIST: string[] = [
  "사이드카 발동만 보고 무조건 저가매수하기",
  "레버리지·인버스 상품을 충동적으로 추격하기",
  "시장가 주문으로 한 번에 대량 매수·매도하기",
  "뉴스 제목만 보고 서킷브레이커와 혼동하기",
  "장중 수치와 장 마감 수치를 동일하게 해석하기",
];

export const KSR_RECENT_RECORDS: RecentRecord[] = [
  { date: "2026-07-24", market: "코스피", type: "매도 사이드카", time: "11:23", ordinalNote: "코스피 올해 41번째" },
  { date: "2026-07-24", market: "코스닥", type: "매도 사이드카", time: "11:47", ordinalNote: "코스닥 올해 11번째 매도(누적 25번째)" },
  { date: "2026-07-23", market: "코스닥", type: "매수 사이드카", time: "-", ordinalNote: "코스닥 올해 14번째 매수" },
];

export const KSR_FAQ: FaqItem[] = [
  {
    question: "사이드카가 발동되면 주식을 못 사고 파나요?",
    answer: "직접 매매가 정지되는 것은 아닙니다. 사이드카는 선물·현물 간 가격 차익을 노리는 프로그램 매매 호가의 효력만 5분간 정지시키는 제도입니다. 다만 사이드카가 발동될 정도로 변동성이 큰 상황에서는 호가 간격이 벌어지거나 체결 가격이 예상과 다르게 움직일 수 있습니다.",
  },
  {
    question: "사이드카와 서킷브레이커는 뭐가 다른가요?",
    answer: "사이드카는 프로그램 매매 호가만 5분간 일시 정지하는 상대적으로 약한 조치이고, 서킷브레이커는 지수가 8%·15%·20% 급락했을 때 시장 전체의 매매를 20분간(3단계는 당일 종료) 정지시키는 훨씬 강한 조치입니다.",
  },
  {
    question: "코스피와 코스닥 사이드카 발동 조건이 다른가요?",
    answer: "다릅니다. 코스피는 코스피200 선물이 5% 이상 변동한 상태가 1분 지속되면 발동되지만, 코스닥은 코스닥150 선물 6% 이상 변동과 코스닥150 지수 3% 이상 변동이 같은 방향으로 동시에 1분간 지속돼야 발동됩니다.",
  },
  {
    question: "2026년에 사이드카가 왜 이렇게 자주 발동되나요?",
    answer: "반도체 대형주로의 수급 쏠림, 글로벌 반도체주 조정, 레버리지 ETF 리밸런싱, 기준금리 인상, 지정학적 리스크 등이 배경으로 거론됩니다. 다만 이는 언론 보도를 종합한 분석이며, 한국거래소가 공식적으로 확정한 단일 원인은 아닙니다.",
  },
  {
    question: "하루에 여러 번 사이드카가 발동될 수 있나요?",
    answer: "동일한 방향의 사이드카는 시장별로 하루 한 번만 적용되는 것이 일반적입니다. 다만 같은 날 급등과 급락이 반복되면 매수 사이드카와 매도 사이드카가 각각 발동될 수 있고, 코스피·코스닥 두 시장에서 같은 날 각각 발동되는 경우도 있습니다.",
  },
  {
    question: "사이드카가 발동되면 주가가 반드시 반등하나요?",
    answer: "아닙니다. 사이드카는 프로그램매매 호가를 잠시 정지시키는 제도일 뿐, 주가 방향을 바꾸는 장치는 아닙니다. 효력 정지 후에도 시장 상황에 따라 상승이나 하락이 이어질 수 있습니다.",
  },
  {
    question: "매수 사이드카도 위험한 상황인가요?",
    answer: "매수 사이드카는 선물 가격이 급등할 때 발동됩니다. 주가 상승 자체는 긍정적으로 보일 수 있지만, 단시간에 가격이 과도하게 움직였다는 의미이므로 추격매수 위험이 커질 수 있습니다.",
  },
  {
    question: "2026년 사이드카 발동 횟수는 실시간 수치인가요?",
    answer: "아닙니다. 이 리포트의 수치는 2026년 7월 24일 보도 기준 스냅샷이며, 사이드카는 지금도 계속 발동되고 있어 실제 누적 횟수는 더 늘었을 수 있습니다. 최신 수치는 한국거래소 공시나 최근 기사에서 확인하는 것이 정확합니다.",
  },
];

export const KSR_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/semiconductor-stocks-h1-2026/", label: "반도체 대장주 상반기 리포트", description: "삼성전자·SK하이닉스 등 반도체 대형주 상반기 흐름을 정리합니다." },
  { href: "/reports/ai-stocks-h1-2026/", label: "AI 관련주 상반기 리포트", description: "글로벌 AI 관련주 상반기 조정 흐름을 정리합니다." },
  { href: "/reports/etf-vs-direct-stock-10year-2026/", label: "ETF vs 직접투자 10년 비교", description: "변동성 국면에서 투자 방식별 장단기 성과를 비교합니다." },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기", description: "정기적으로 나눠 투자했을 때의 예상 결과를 계산합니다." },
];
