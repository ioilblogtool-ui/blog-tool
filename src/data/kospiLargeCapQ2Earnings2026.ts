export type Sector = "반도체" | "자동차" | "2차전지" | "금융" | "IT플랫폼";
export type EarningsTag = "beat" | "miss";
export type ReactionTag = "급등" | "급락" | "강세" | "혼조";

export type CompanyEarning = {
  rank: number;
  name: string;
  ticker: string;
  sector: Sector;
  profitLabel: string;
  revenue: string;
  revenueYoy: number | null;
  revenueQoq: number | null;
  profit: string;
  profitYoy: number | null;
  profitQoq: number | null;
  consensus: string | null;
  earningsTag: EarningsTag;
  earningsNote: string;
  reactionTag: ReactionTag;
  reactionNote: string;
  note: string;
};

export const COMPANIES: CompanyEarning[] = [
  {
    rank: 1,
    name: "삼성전자",
    ticker: "005930",
    sector: "반도체",
    profitLabel: "영업이익",
    revenue: "171.5조원",
    revenueYoy: 129.3,
    revenueQoq: 28,
    profit: "89.5조원",
    profitYoy: 1810,
    profitQoq: 56,
    consensus: "약 85.5조원",
    earningsTag: "beat",
    earningsNote: "컨센서스(85~86조원대) 상회, 역대 최대 분기 영업이익",
    reactionTag: "급등",
    reactionNote: "발표 전 7월 한 달 -21% 급락 → 발표 다음 날 하루 만에 +27% 급등",
    note: "AI向 메모리 가격 강세와 HBM4 공급 재개가 서프라이즈 견인",
  },
  {
    rank: 2,
    name: "SK하이닉스",
    ticker: "000660",
    sector: "반도체",
    profitLabel: "영업이익",
    revenue: "79.3조원",
    revenueYoy: 257,
    revenueQoq: 51,
    profit: "60.5조원",
    profitYoy: 557,
    profitQoq: 61,
    consensus: "64.7조원",
    earningsTag: "miss",
    earningsNote: "컨센서스 대비 약 4.2조원(-6.4%) 하회, 사상 최대 실적에도 눈높이 못 맞춰",
    reactionTag: "급락",
    reactionNote: "발표 당일 -14.65% 급락, 7월 한 달 누적 -41.5%",
    note: "영업이익률 76%·순이익 93.9조원 사상 최대에도 컨센서스 미스로 급락",
  },
  {
    rank: 3,
    name: "현대차",
    ticker: "005380",
    sector: "자동차",
    profitLabel: "영업이익",
    revenue: "49.2조원",
    revenueYoy: null,
    revenueQoq: null,
    profit: "2.85조원",
    profitYoy: -20.8,
    profitQoq: null,
    consensus: "약 3.2조원",
    earningsTag: "miss",
    earningsNote: "시장 추정치 대비 약 -11% 하회, 영업이익률 5.8%",
    reactionTag: "급락",
    reactionNote: "7월 24일 종가 40.1만원, 연고점(6월 1일 78.3만원) 대비 -48.8%",
    note: "분기 사상 최대 매출에도 원자재가 상승·부품사 화재로 수익성 악화, 최근 한 달 리포트 20건 중 19건 목표가 하향",
  },
  {
    rank: 4,
    name: "기아",
    ticker: "000270",
    sector: "자동차",
    profitLabel: "영업이익",
    revenue: "분기 사상 최대",
    revenueYoy: null,
    revenueQoq: null,
    profit: "2.63조원",
    profitYoy: -4.9,
    profitQoq: null,
    consensus: null,
    earningsTag: "miss",
    earningsNote: "판매량 대비 아쉬운 수익성, 목표주가 하향 리포트 잇따름",
    reactionTag: "급락",
    reactionNote: "실적 발표 당일 -12.88% 급락",
    note: "영업이익률 8.0%로 3분기 연속 개선됐지만 매출 호조 대비 눈높이 미달",
  },
  {
    rank: 5,
    name: "LG에너지솔루션",
    ticker: "373220",
    sector: "2차전지",
    profitLabel: "영업이익",
    revenue: "7.6조원",
    revenueYoy: 24.8,
    revenueQoq: 15.3,
    profit: "1,133억원",
    profitYoy: -77,
    profitQoq: null,
    consensus: "ESS 부진으로 예상치 하회",
    earningsTag: "miss",
    earningsNote: "2개 분기 만에 흑자전환했지만 ESS 부문이 예상 대비 부진",
    reactionTag: "혼조",
    reactionNote: "배터리 3사 동반 흑자에 섹터 전반 재평가, 개별 반응은 제한적",
    note: "북미 생산세액공제(AMPC) 2,410억원 반영, ESS·AI데이터센터 수요가 실적 방어",
  },
  {
    rank: 6,
    name: "삼성SDI",
    ticker: "006400",
    sector: "2차전지",
    profitLabel: "영업이익",
    revenue: "3.8조원",
    revenueYoy: 18.5,
    revenueQoq: 5.4,
    profit: "2,038억원",
    profitYoy: null,
    profitQoq: null,
    consensus: "최고 전망치의 214%",
    earningsTag: "beat",
    earningsNote: "적자 전망 뒤엎고 어닝서프라이즈, 예상보다 2,064억원 높은 영업이익",
    reactionTag: "혼조",
    reactionNote: "7분기 만의 흑자 서프라이즈에도 발표일 주가는 하락",
    note: "배터리 부문 영업이익 1,593억원으로 흑자전환, AI 데이터센터向 ESS 수요 확대",
  },
  {
    rank: 7,
    name: "KB금융",
    ticker: "105560",
    sector: "금융",
    profitLabel: "순이익",
    revenue: "-",
    revenueYoy: null,
    revenueQoq: null,
    profit: "1조9922억원",
    profitYoy: 14.6,
    profitQoq: 5.3,
    consensus: "약 1.97조원(부합~소폭 상회)",
    earningsTag: "beat",
    earningsNote: "상반기 순이익 3조8846억원으로 반기 기준 사상 최대",
    reactionTag: "강세",
    reactionNote: "주가 18만원대 상회, 직전 고점 돌파하며 2026말 추정 BPS 1.0배 도달",
    note: "비은행 부문이 이자이익 둔화를 상쇄, 하반기 7천억원 자사주 매입·소각 발표",
  },
  {
    rank: 8,
    name: "신한지주",
    ticker: "055550",
    sector: "금융",
    profitLabel: "순이익",
    revenue: "-",
    revenueYoy: null,
    revenueQoq: null,
    profit: "1조8201억원",
    profitYoy: 17.5,
    profitQoq: 12.2,
    consensus: "시장 기대 상회",
    earningsTag: "beat",
    earningsNote: "분기·반기 기준 역대 최대 순이익, KB금융과 격차 1,721억원까지 축소",
    reactionTag: "강세",
    reactionNote: "전고점 상향 돌파 기대, 은행주 전반 투자심리 개선 견인",
    note: "상반기 순이익 3조4427억원, 자사주 7,000억원 취득·소각 계획 발표",
  },
  {
    rank: 9,
    name: "네이버",
    ticker: "035420",
    sector: "IT플랫폼",
    profitLabel: "영업이익",
    revenue: "3조3888억원",
    revenueYoy: 15.6,
    revenueQoq: null,
    profit: "5203억원",
    profitYoy: -0.2,
    profitQoq: null,
    consensus: "5674억원",
    earningsTag: "miss",
    earningsNote: "영업이익 컨센서스(5674억원) 대비 약 8.3% 하회, 매출은 컨센서스(3조3686억원)를 웃돌며 분기 기준 역대 최대",
    reactionTag: "급등",
    reactionNote: "실적 발표 당일 주가 +9.16% 급등, 영업이익은 정체됐지만 매출 서프라이즈와 AI 사업 기대감이 수익성 둔화 우려를 상쇄",
    note: "AI 인프라 투자와 N페이 커넥트 단말기 확대, 월드컵 중계권 등 전략 비용 영향으로 영업이익은 전년 수준에 머묾",
  },
  {
    rank: 10,
    name: "카카오",
    ticker: "035720",
    sector: "IT플랫폼",
    profitLabel: "영업이익",
    revenue: "2조985억원",
    revenueYoy: 9.4,
    revenueQoq: null,
    profit: "2770억원",
    profitYoy: 36,
    profitQoq: null,
    consensus: "시장 전망치 대비 약 22% 상회 추정",
    earningsTag: "beat",
    earningsNote: "영업이익이 시장 전망치를 약 22% 웃도는 어닝서프라이즈, 매출·영업이익 모두 분기 기준 역대 최대치 경신",
    reactionTag: "혼조",
    reactionNote: "실적 발표 당일 주가는 35,600원 +0.28% 소폭 상승에 그쳤고, 7개 증권사 평균 목표주가는 오히려 5.6만원으로 -13.1% 하향",
    note: "플랫폼 부문 매출 1조2303억원(+16.6%)이 실적 개선을 주도했지만, 콘텐츠 부문 부진과 AI 수익화 불확실성으로 목표주가는 줄하향",
  },
];

export const SUMMARY = {
  totalCompanies: COMPANIES.length,
  beatCount: COMPANIES.filter((c) => c.earningsTag === "beat").length,
  missCount: COMPANIES.filter((c) => c.earningsTag === "miss").length,
  kospiJuneHigh: 9063.84,
  kospiJuneHighDate: "2026-06-18",
  kospiJulyBreakLine: "7,000선",
  dataDate: "2026-08-07",
};

export const KOSPI_TIMELINE = [
  { date: "2026-04-27", label: "6,600선 돌파", detail: "시가총액 6,000조원 달성, 미국-이란 휴전 기대감" },
  { date: "2026-05-15", label: "8,000선 첫 돌파", detail: "반도체 초호황·외국인 순매수 유입 (8,046.78)" },
  { date: "2026-06-18", label: "9,000선 돌파 (연중 최고점)", detail: "AI 랠리 정점, 9,063.84 기록" },
  { date: "2026-06-23", label: "-9.99% 역대 최대 하락폭", detail: "애플 메모리 가격 인상 불만, AI 수익성 의구심 확산" },
  { date: "2026-06-26", label: "서킷브레이커 발동 (6월 3회째)", detail: "단일종목 레버리지 ETF로 자금 쏠림·변동성 증폭" },
  { date: "2026-07-02", label: "-7.89%, 8,000선 붕괴", detail: "메타 네오클라우드 사업 발표가 AI 밸류에이션 우려 촉발" },
  { date: "2026-07-13", label: "-8.95%, 7,000선 붕괴", detail: "실적 시즌 개막과 겹친 투매, 6,806.93 마감" },
  { date: "2026-07-29", label: "서킷브레이커 이틀 연속", detail: "장중 -12.63%, SK하이닉스 실적 발표 전후 변동성 최고조" },
  { date: "2026-07-31", label: "+17.91% 역사적 반등", detail: "단일종목 레버리지 상품 규제 시행 이후 6,595.45로 급반등" },
];

export const HIGHLIGHTS = [
  {
    ticker: "005930",
    name: "삼성전자",
    tagLabel: "실적 beat · 주가 급등",
    body: "영업이익 89.5조원으로 컨센서스(85조원대)를 웃돌며 역대 최대 실적을 기록했습니다. 발표 전 한 달간 -21% 급락했던 주가는 발표 다음 날 하루 만에 +27% 뛰며 실적과 주가 흐름이 정확히 일치한 사례입니다.",
  },
  {
    ticker: "000660",
    name: "SK하이닉스",
    tagLabel: "실적 miss · 주가 급락",
    body: "영업이익 60.5조원으로 사상 최대치를 냈지만, 컨센서스 64.7조원에는 4.2조원 못 미쳤습니다. '최대 실적인데 미스'라는 평가 속에 발표 당일 -14.65%, 7월 한 달간 -41.5% 폭락했습니다.",
  },
  {
    ticker: "005380",
    name: "현대차",
    tagLabel: "실적 miss · 목표가 줄하향",
    body: "분기 사상 최대 매출(49.2조원)에도 영업이익은 전년 대비 20.8% 감소해 컨센서스를 밑돌았습니다. 연고점 대비 주가가 -48.8%까지 밀리며 최근 한 달 발간된 리포트 20건 중 19건이 목표주가를 낮췄습니다.",
  },
  {
    ticker: "006400",
    name: "삼성SDI",
    tagLabel: "어닝서프라이즈 · 주가는 하락",
    body: "적자가 유력하다던 시장 전망을 뒤엎고 영업이익 2,038억원으로 7분기 만에 흑자 전환했습니다. 최고 전망치의 214%에 달하는 서프라이즈였지만, 발표일 주가는 오히려 하락하며 실적과 주가의 괴리를 보여줬습니다.",
  },
  {
    ticker: "035420",
    name: "네이버",
    tagLabel: "실적 miss · 주가 급등",
    body: "영업이익 5203억원으로 컨센서스(5674억원)에 8.3% 못 미쳤지만, 매출은 3조3888억원으로 역대 최대치를 경신하며 컨센서스를 웃돌았습니다. 발표 당일 주가는 오히려 +9.16% 급등해, 실적 미스에도 주가가 오른 이번 시즌 유일한 사례입니다.",
  },
];

export const FAQ_ITEMS = [
  {
    q: "실적이 역대 최대인데 왜 SK하이닉스·현대차 주가는 급락했나요?",
    a: "두 회사 모두 절대 실적 수치는 사상 최대치를 경신했지만, 시장이 미리 반영한 컨센서스(증권사 추정치 평균)에는 못 미쳤기 때문입니다. SK하이닉스는 영업이익 60.5조원으로 최대 실적이었지만 컨센서스 64.7조원보다 4.2조원 낮았고, 현대차도 영업이익이 전년 대비 20.8% 줄며 시장 기대치를 하회했습니다. 주가는 '실적의 절대 수준'보다 '기대 대비 결과'에 더 민감하게 반응하는 경향이 있습니다.",
  },
  {
    q: "2026년 6월 코스피 9,000선 돌파 이후 왜 7월에 폭락했나요?",
    a: "6월 18일 9,063.84로 연중 최고치를 찍은 코스피는 애플의 메모리 가격 인상 불만, AI 반도체 수익성에 대한 의구심, 단일종목 레버리지 ETF의 자금 쏠림이 겹치며 6월 23일 -9.99%라는 역대 최대 하락폭을 기록했습니다. 이후 7월 초 메타의 대규모 클라우드 투자 발표가 AI 밸류에이션 부담을 다시 키우며 7월 13일 7,000선까지 붕괴됐습니다. 대형주 실적 발표가 몰린 7월 하순은 이런 변동성이 정점에 달했던 시기와 겹쳤습니다.",
  },
  {
    q: "삼성SDI처럼 어닝서프라이즈인데 주가가 오히려 떨어지는 이유는 뭔가요?",
    a: "실적 발표 시점의 전반적인 시장 분위기, 이미 주가에 선반영된 기대치, 향후 가이던스(전망치)에 대한 우려 등이 복합적으로 작용하기 때문입니다. 삼성SDI는 7분기 만의 흑자 전환과 최고 전망치의 214%에 달하는 서프라이즈에도 불구하고, 연초 이후 이미 큰 폭으로 상승했던 주가 부담과 배터리 업황 전반에 대한 신중론이 겹치며 발표일 주가가 하락했습니다.",
  },
  {
    q: "컨센서스(consensus)란 정확히 무엇인가요?",
    a: "컨센서스는 여러 증권사 애널리스트가 제시한 실적 추정치의 평균값으로, 금융정보업체(에프앤가이드 등)가 집계해 발표합니다. 실제 발표 실적이 컨센서스를 웃돌면 '어닝서프라이즈', 못 미치면 '어닝쇼크(미스)'라고 부릅니다. 다만 컨센서스는 절대적 기준이 아니라 시장 참여자들의 평균적 기대치일 뿐이므로, 컨센서스 부합 여부와 별개로 향후 가이던스나 업황 전망이 주가에 더 큰 영향을 주기도 합니다.",
  },
  {
    q: "KB금융·신한지주는 왜 실적도 좋고 주가도 강세였나요?",
    a: "두 금융지주는 순이익이 전년 동기 대비 각각 +14.6%, +17.5% 증가하며 반기 기준 사상 최대 실적을 기록했고, 시장 기대치에 부합하거나 이를 웃돌았습니다. 여기에 KB금융 7천억원, 신한지주 7천억원 규모의 자사주 매입·소각 계획 등 주주환원 정책이 더해지며 주가가 직전 고점을 돌파하는 강세를 보였습니다. 반도체·자동차와 달리 금융주는 실적과 주가 반응이 비교적 일치한 섹터였습니다.",
  },
  {
    q: "네이버는 실적이 미스인데 왜 주가가 급등했고, 카카오는 서프라이즈인데 왜 주가가 안 움직였나요?",
    a: "네이버는 영업이익이 컨센서스(5674억원)에 8.3% 못 미쳤지만, 매출이 역대 최대치(3조3888억원)를 기록하며 컨센서스를 넘어섰고 AI 사업 기대감이 겹치며 발표 당일 주가가 +9.16% 급등했습니다. 반대로 카카오는 영업이익이 시장 전망치를 약 22% 웃도는 어닝서프라이즈였음에도, 콘텐츠 부문 부진과 AI 수익화 불확실성에 대한 우려로 증권사들이 오히려 목표주가를 평균 -13.1% 낮췄고 주가는 발표 당일 +0.28% 상승에 그쳤습니다. IT플랫폼 업종은 절대 실적보다 'AI 수익화 가시성'이 주가를 더 크게 좌우한 사례입니다.",
  },
];

export const REPORT_META = {
  title: "코스피 대형주 2분기 실적 2026 | 역대급 실적인데 주가는 급락",
  description:
    "삼성전자·SK하이닉스·현대차·기아·네이버·카카오 등 코스피 대형주 10곳의 2026년 2분기 실적을 컨센서스와 비교하고, 발표 전후 주가 흐름까지 정리했습니다.",
  slug: "kospi-large-cap-2026-q2-earnings",
  updatedAt: "2026-08-07",
  caution: "본 리포트는 투자 권유가 아니며 과거 실적·주가 흐름이 미래 수익을 보장하지 않습니다.",
  source: "출처: 각 사 IR 발표자료·뉴스룸, 에프앤가이드 컨센서스, 언론 보도 종합 (2026-08-07 기준)",
  estimateNote: "(*) 컨센서스·목표주가는 집계 시점에 따라 증권사별 편차가 있을 수 있습니다.",
};
