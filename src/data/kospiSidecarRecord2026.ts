// ── 타입 ──────────────────────────────────────────

export type KsrBadge = "공식" | "참고" | "시뮬레이션" | "추정";

export type KsrSource = {
  id: string;
  org: string;
  title: string;
  url: string;
  publishedAt: string;
};

// 언론이 인용한 한국거래소 집계를 시점별로 모은 누적 스냅샷.
// status "잠정" = 보도의 "올해 N번째"로 재구성한 값. 한국거래소 공지와 대조하면 "확정"으로 바꾼다.
export type KsrSnapshot = {
  asOf: string;
  market: "코스피" | "코스닥";
  total: number | null;
  sell: number | null;
  buy: number | null;
  status: "확정" | "잠정";
  badge: KsrBadge;
  sourceId: string;
  note?: string;
};

export type KsrEvent = {
  date: string;
  time: string | null;
  market: "코스피" | "코스닥";
  kind: "매도 사이드카" | "매수 사이드카" | "서킷브레이커 1단계";
  ordinalNote: string | null;
  context: string | null;
  // "확인 필요" 이벤트는 데이터에만 두고 화면에는 표시하지 않는다.
  status: "확정" | "확인 필요";
  sourceId: string;
};

export type MarketConditionRow = {
  market: string;
  futuresCondition: string;
  spotCondition: string;
  duration: string;
  action: string;
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
  title: "코스피 사이드카 2026, 폭락·반등 때 왜 발동되나",
  seoTitle: "코스피 사이드카 2026 | 폭락·반등 때 왜 발동되나",
  seoDescription:
    "2026년 코스피 사이드카 발동 횟수를 매수·매도별로 정리하고 10월 급락·반등 기록을 추가했습니다. 발동 조건, 서킷브레이커와 차이, 2008년 비교까지 확인하세요.",
  description: "2026년 코스피·코스닥 사이드카 누적 발동 추이와 10월 급락·반등 기록, 발동 조건, 서킷브레이커와의 차이, 2008년 금융위기 비교를 정리한 리포트입니다.",
  updatedAt: "2026-10-27",
  dataNote:
    "누적 횟수는 2026년 10월 27일까지 언론이 인용한 한국거래소 집계(\"올해 N번째\")를 시점별로 모아 재구성한 값입니다. 한국거래소 시장조치 공지와 대조해 확정하기 전까지 '잠정'으로 표시합니다.",
};

export const KSR_SOURCES: KsrSource[] = [
  { id: "newsspace-0627", org: "뉴스스페이스", title: "[The Numbers] 2026년 코스피 사이드카 발동 29회·공포지수 97, 2008년 금융위기 기록 돌파", url: "https://www.newsspace.kr/news/article.html?no=14512", publishedAt: "2026-06-27" },
  { id: "mtn-0724", org: "MTN", title: "유가 급등·美 기술주 급락에 코스피 6700선 붕괴…21번째 매도 사이드카", url: "https://news.mtn.co.kr/news-detail/2026072416170492634", publishedAt: "2026-07-24" },
  { id: "khan-0728", org: "경향신문", title: "7월 28일 코스피 서킷브레이커 발동 보도(한국거래소 공시 인용)", url: "https://www.khan.co.kr/article/202607281019001", publishedAt: "2026-07-28" },
  { id: "mt-1013", org: "머니투데이", title: "[속보] 코스피 매도 사이드카 발동…지수 6100 하회", url: "https://www.mt.co.kr/stock/2026/10/13/2026101309193659450", publishedAt: "2026-10-13" },
  { id: "genews-1015", org: "글로벌이코노믹", title: "코스피·코스닥 동반 '매도 사이드카'…6%대 급락세", url: "https://www.g-enews.com/article/Securities/2026/10/20261015093329460923c501012_1", publishedAt: "2026-10-15" },
  { id: "etnews-1015", org: "전자신문", title: "코스피·코스닥 사이드카 이어 동반 서킷브레이커 발동", url: "https://www.etnews.com/20261015000282", publishedAt: "2026-10-15" },
  { id: "mt-1027", org: "머니투데이", title: "[속보] 코스피, 매수 사이드카 발동…올해 26번째", url: "https://www.mt.co.kr/stock/2026/10/27/2026102709105017127", publishedAt: "2026-10-27" },
  { id: "fnnews-1027", org: "파이낸셜뉴스", title: "[속보] 코스피 4%대 급등…매수 사이드카 발동", url: "https://www.fnnews.com/news/202610271016231524", publishedAt: "2026-10-27" },
];

export const KSR_SNAPSHOTS: KsrSnapshot[] = [
  { asOf: "2026-06-27", market: "코스피", total: 29, sell: 14, buy: 15, status: "잠정", badge: "참고", sourceId: "newsspace-0627" },
  { asOf: "2026-07-24", market: "코스피", total: 41, sell: 21, buy: 20, status: "잠정", badge: "참고", sourceId: "mtn-0724" },
  { asOf: "2026-10-13", market: "코스피", total: 50, sell: 26, buy: 24, status: "잠정", badge: "참고", sourceId: "mt-1013", note: "매수 24회는 합계 50회 − 매도 26회로 계산" },
  { asOf: "2026-10-15", market: "코스피", total: 51, sell: 27, buy: 24, status: "잠정", badge: "참고", sourceId: "genews-1015" },
  { asOf: "2026-10-27", market: "코스피", total: 53, sell: 27, buy: 26, status: "잠정", badge: "추정", sourceId: "mt-1027", note: "10/27 매수 26번째 보도와 10/15 매도 27회를 합쳐 재구성. 10/16~10/26 사이 매수 25번째 발동일과 추가 매도 발동 여부는 확인 중" },
  { asOf: "2026-07-24", market: "코스닥", total: 25, sell: 11, buy: 14, status: "잠정", badge: "참고", sourceId: "mtn-0724" },
];

export const KSR_EVENTS_2026: KsrEvent[] = [
  { date: "2026-07-28", time: "10:13", market: "코스피", kind: "서킷브레이커 1단계", ordinalNote: "올해 8번째", context: "투매 속 코스피·코스닥 매도 사이드카에 이어 발동", status: "확정", sourceId: "khan-0728" },
  { date: "2026-10-13", time: "09:47", market: "코스피", kind: "매도 사이드카", ordinalNote: "올해 50번째(매도 26번째)", context: "시가 6,186.08(−3.10%) 출발 후 6,100선 하회", status: "확정", sourceId: "mt-1013" },
  { date: "2026-10-15", time: "09:07", market: "코스피", kind: "매도 사이드카", ordinalNote: "매도 27번째(올해 51번째)", context: "개장 직후 코스피·코스닥 동반 급락", status: "확정", sourceId: "etnews-1015" },
  { date: "2026-10-15", time: "09:12", market: "코스닥", kind: "매도 사이드카", ordinalNote: "매도 15번째", context: null, status: "확정", sourceId: "etnews-1015" },
  { date: "2026-10-15", time: "12:23", market: "코스닥", kind: "서킷브레이커 1단계", ordinalNote: "올해 5번째·역대 15번째", context: "823.88 → 757.88(−8.01%)", status: "확정", sourceId: "etnews-1015" },
  { date: "2026-10-15", time: "12:38", market: "코스피", kind: "서킷브레이커 1단계", ordinalNote: "올해 10번째·역대 16번째", context: "6,008.81 → 5,528.05(−8.00%), 종가 5,554.22(−7.57%)", status: "확정", sourceId: "etnews-1015" },
  { date: "2026-10-27", time: "10:13", market: "코스피", kind: "매수 사이드카", ordinalNote: "매수 26번째", context: "장중 4%대 급등", status: "확정", sourceId: "fnnews-1027" },
  { date: "2026-10-16~26", time: null, market: "코스피", kind: "매수 사이드카", ordinalNote: "매수 25번째", context: "발동일 확인 중", status: "확인 필요", sourceId: "mt-1027" },
];

export const KSR_2008 = { kospi: 26, kosdaq: 19, badge: "참고" as KsrBadge };

export const KSR_COUNT_NOTE = [
  "기사에 나오는 '올해 N번째'는 매체에 따라 전체 합계일 수도 있고, 매도·매수 방향별 횟수일 수도 있습니다.",
  "예를 들어 10월 27일 '올해 26번째'는 매수 사이드카만 센 숫자이고, 10월 13일 '올해 50번째'는 매도·매수를 합친 숫자입니다.",
  "이 리포트는 두 기준을 구분해 시점별로 다시 정리했으며, 한국거래소 공지와 대조하기 전까지 누적값을 '잠정'으로 표시합니다.",
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
    detail: "한국은행은 2026년 7월 기준금리를 2.50%에서 2.75%로, 8월 3.00%로 올린 뒤 10월 22일 동결했습니다. 금리 상승은 주식 할인율과 위험자산 선호도에 영향을 줄 수 있습니다.",
  },
  {
    title: "AI 투자 우려·중국 메모리 추격 (10월)",
    detail: "10월에는 미국 빅테크의 AI 투자 지속성 우려, 중국 메모리 업체의 서버용 D램 발표, 미국 물가 지표가 겹치며 반도체 대형주 중심의 급락이 나타났다는 분석이 나왔습니다. 원인 해석은 언론 보도를 종합한 것입니다.",
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
    answer: "반도체 대형주로의 수급 쏠림, 글로벌 반도체주 조정, AI 투자 지속성 우려, 레버리지 ETF 리밸런싱, 기준금리 인상, 지정학적 리스크 등이 배경으로 거론됩니다. 다만 이는 언론 보도를 종합한 분석이며, 한국거래소가 공식적으로 확정한 단일 원인은 아닙니다.",
  },
  {
    question: "하루에 여러 번 사이드카가 발동될 수 있나요?",
    answer: "같은 방향의 사이드카는 시장별로 하루 한 번만 적용되는 것이 일반적입니다. 다만 같은 날 급등과 급락이 반복되면 매수 사이드카와 매도 사이드카가 각각 발동될 수 있고, 코스피·코스닥 두 시장에서 같은 날 각각 발동되는 경우도 있습니다. 세부 적용 시간 제한은 한국거래소 업무규정을 확인하는 것이 정확합니다.",
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
    answer: "아닙니다. 이 리포트의 누적 횟수는 2026년 10월 27일까지 보도된 한국거래소 집계를 시점별로 모아 재구성한 값입니다. 이후에도 사이드카가 발동되면 실제 누적 횟수는 늘어나므로, 최신 수치는 한국거래소 공지에서 확인하는 것이 정확합니다.",
  },
  {
    question: "매수 사이드카가 발동되면 바닥인가요?",
    answer: "그렇게 단정할 수 없습니다. 매수 사이드카는 코스피200 선물이 하루 만에 5% 넘게 오를 만큼 단기 변동이 컸다는 뜻일 뿐, 하락 추세가 끝났다는 신호가 아닙니다. 2026년에도 급반등 뒤 다시 급락한 날이 여러 번 있었기 때문에 수급과 실적 흐름을 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "10월에 사이드카가 몇 번 발동됐나요?",
    answer: "보도로 확인된 코스피 사이드카는 10월 13일·15일 매도 사이드카 2회와 10월 27일 매수 사이드카 1회입니다. 10월 27일 발동이 '올해 매수 26번째'로 보도된 만큼 10월 16~26일 사이 매수 사이드카가 한 번 더 있었던 것으로 보이며, 발동일은 확인 중입니다. 10월 15일에는 코스피·코스닥 모두 서킷브레이커도 발동됐습니다.",
  },
];

export const KSR_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/kospi-leverage-etf-calculator/", label: "코스피 레버리지 ETF 손익 계산기", description: "급락·반등 경로에서 2배 레버리지 손익과 원금 회복 조건을 계산합니다." },
  { href: "/tools/stock-loss-recovery-calculator/", label: "주식 손실 복구율 계산기", description: "손실률별로 본전까지 필요한 상승률을 계산합니다." },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기", description: "정기적으로 나눠 투자했을 때의 예상 결과를 계산합니다." },
  { href: "/reports/semiconductor-stocks-h1-2026/", label: "반도체 대장주 상반기 리포트", description: "삼성전자·SK하이닉스 등 반도체 대형주 상반기 흐름을 정리합니다." },
];

// 신규 리포트가 배포된 뒤에만 노출한다(페이지 astro에서 import.meta.glob으로 확인).
export const KSR_CRASH_REPORT_LINK: RelatedLink = {
  href: "/reports/kospi-october-crash-2026/",
  label: "코스피 10월 급락 2026 리포트",
  description: "10월 급락의 날짜별 지수·외국인 수급·원인을 정리합니다.",
};
