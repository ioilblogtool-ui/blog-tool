export type AreaBand = "under60" | "eightyFour" | "large";
export type RegionGroupKey = "gangnam3" | "mayongseong" | "southwest" | "northeast" | "outer";
export type SupplyType = "generalScore" | "lottery" | "newlywed" | "firstHome" | "multiChild";
export type ScoreBandKey = "forties" | "fifties" | "sixties" | "seventiesPlus";
export type DataBadge = "공식" | "기사인용" | "참고" | "예상" | "시뮬레이션";

export interface ReportMeta {
  slug: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  methodology: string;
  caution: string;
}

export interface SummaryKpi {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "accent" | "warn";
}

export interface ScoreRuleRow {
  category: "무주택기간" | "부양가족 수" | "청약통장 가입기간";
  maxScore: number;
  fullScoreCondition: string;
  note: string;
}

export interface ActualCaseRow {
  complexName: string;
  district: string;
  announcedAt: string;
  areaLabel: string;
  areaBand: AreaBand;
  supplyType: SupplyType;
  minScore: number;
  avgScore?: number;
  maxScore?: number;
  sourceLabel: string;
  sourceHref: string;
  badge: DataBadge;
  interpretation: string;
}

export interface RegionCutlineRow {
  key: RegionGroupKey;
  label: string;
  districts: string[];
  minGuide: number;
  maxGuide: number;
  representativeScore: number;
  difficulty: "낮음" | "보통" | "높음" | "매우 높음";
  summary: string;
  caveat: string;
  badge: DataBadge;
}

export interface AreaCutlineCard {
  key: AreaBand;
  label: string;
  scoreGuide: string;
  lotterySignal: string;
  competitionPattern: string;
  recommendedFor: string;
}

export interface SupplyStrategyCard {
  key: SupplyType;
  label: string;
  fitUser: string;
  advantage: string;
  caution: string;
  nextAction: string;
}

export interface ScoreBandStrategy {
  key: ScoreBandKey;
  label: string;
  scoreMin: number;
  scoreMax?: number;
  possibleZone: string;
  mainStrategy: string;
  avoid: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FutureComplexEstimate {
  complexName: string;
  district: string;
  expectedMonth?: string;
  areaHint: string;
  expectedScoreRange: string;
  basis: string;
  badge: "예상";
}

export interface SimulationInputDefaults {
  score: number;
  areaBand: AreaBand;
  supplyType: SupplyType;
  regionGroup: RegionGroupKey;
}

export interface RoadmapItem {
  label: string;
  scoreSignal: string;
  action: string;
  caution: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface SourceLink {
  label: string;
  href: string;
  type: "official" | "news" | "reference";
}

const meta: ReportMeta = {
  slug: "2026-seoul-apt-cheonyak-cutline",
  title: "2026 서울 아파트 청약 당첨 가점 커트라인 | 자치구·면적·유형별 분석",
  subtitle:
    "서울·수도권 주요 아파트 청약 당첨 가점 사례를 바탕으로 지역, 면적, 공급유형별 커트라인과 점수대별 전략을 비교하는 데이터 리포트입니다.",
  updatedAt: "기준일: 2026년 4월 19일 설계 데이터",
  methodology:
    "청약 가점제 공식 구조와 2025~2026년 주요 단지 당첨 가점 보도 사례를 분리해 정리했습니다. 지역·면적별 커트라인은 실제 사례와 단지 성격을 바탕으로 한 참고용 구간입니다.",
  caution:
    "예상 커트라인은 당첨 가능성을 보장하지 않습니다. 실제 청약 자격, 공급유형, 가점 인정 여부, 추첨제 비중은 반드시 해당 단지 모집공고문과 청약홈 기준으로 확인해야 합니다.",
};

const heroSummary =
  "서울 청약 커트라인은 하나의 평균값으로 설명하기 어렵습니다. 같은 서울이어도 강남권 59㎡와 비강남 대형 평형의 경쟁 강도는 크게 다르고, 일반공급 가점제만 볼 때와 추첨제·특별공급까지 같이 볼 때 전략도 달라집니다.";

const kpis: SummaryKpi[] = [
  { label: "가점제 총점", value: "84점", sub: "무주택 32점 + 부양가족 35점 + 통장 17점", tone: "neutral" },
  { label: "고점 사례", value: "84점", sub: "강남권 인기 주택형은 만점 사례도 확인", tone: "warn" },
  { label: "저점 사례", value: "42점", sub: "비강남 대형 평형은 40점대 당첨 사례도 존재", tone: "accent" },
  { label: "핵심 판단", value: "조건별 편차", sub: "지역·면적·공급유형을 나눠 봐야 함", tone: "neutral" },
];

const scoreRules: ScoreRuleRow[] = [
  {
    category: "무주택기간",
    maxScore: 32,
    fullScoreCondition: "15년 이상",
    note: "원칙적으로 만 30세 또는 혼인 시점부터 계산하므로 시작 기준 확인이 중요합니다.",
  },
  {
    category: "부양가족 수",
    maxScore: 35,
    fullScoreCondition: "6명 이상",
    note: "배우자, 직계존속, 직계비속 인정 요건이 다르므로 모집공고와 주민등록 기준을 함께 봐야 합니다.",
  },
  {
    category: "청약통장 가입기간",
    maxScore: 17,
    fullScoreCondition: "15년 이상",
    note: "가입기간 점수는 천천히 오르므로 통장 해지 전 기회비용을 먼저 계산해야 합니다.",
  },
];

const actualCases: ActualCaseRow[] = [
  {
    complexName: "아크로 드 서초",
    district: "서초구",
    announcedAt: "2026.04",
    areaLabel: "59㎡C",
    areaBand: "under60",
    supplyType: "generalScore",
    minScore: 84,
    avgScore: 84,
    maxScore: 84,
    sourceLabel: "주요 언론 청약 가점 보도",
    sourceHref: "https://www.mk.co.kr/news/economy/11925430",
    badge: "기사인용",
    interpretation: "강남권 상한제·희소 입지·소형 인기 주택형이 겹치면 만점 경쟁까지 열립니다.",
  },
  {
    complexName: "래미안 엘라비네",
    district: "강서구",
    announcedAt: "2026.03",
    areaLabel: "115㎡",
    areaBand: "large",
    supplyType: "generalScore",
    minScore: 42,
    avgScore: 51.2,
    maxScore: 64,
    sourceLabel: "연합뉴스 청약 가점 보도",
    sourceHref: "https://www.yna.co.kr/view/AKR20260326067600003",
    badge: "기사인용",
    interpretation: "같은 서울이어도 대형 평형과 비강남 생활권에서는 40~50점대 사례가 나올 수 있습니다.",
  },
  {
    complexName: "공덕역자이르네",
    district: "마포구",
    announcedAt: "2026.04",
    areaLabel: "소형 주택형",
    areaBand: "under60",
    supplyType: "lottery",
    minScore: 55,
    sourceLabel: "청약 일정 참고 기사",
    sourceHref: "https://homedubu.com/9417/",
    badge: "참고",
    interpretation: "도심 접근성과 소형 선호가 겹치면 가점이 낮아도 추첨제 비중과 공급조건을 함께 봐야 합니다.",
  },
  {
    complexName: "서울 주요 신축 일반분양",
    district: "강남3구",
    announcedAt: "2025~2026",
    areaLabel: "84㎡",
    areaBand: "eightyFour",
    supplyType: "generalScore",
    minScore: 70,
    avgScore: 76,
    maxScore: 84,
    sourceLabel: "최근 강남권 당첨선 보도 종합",
    sourceHref: "https://www.mk.co.kr/news/economy/11925430",
    badge: "참고",
    interpretation: "84㎡ 핵심 주택형은 실수요 선호가 높아 70점대 이상 경쟁을 기본 시나리오로 봐야 합니다.",
  },
];

const regionCutlines: RegionCutlineRow[] = [
  {
    key: "gangnam3",
    label: "강남3구",
    districts: ["강남", "서초", "송파"],
    minGuide: 70,
    maxGuide: 84,
    representativeScore: 76,
    difficulty: "매우 높음",
    summary: "상한제 기대, 학군, 희소 입지가 겹치는 구간입니다. 인기 주택형은 만점권 경쟁까지 열립니다.",
    caveat: "대형·비선호 주택형은 예외가 있지만 일반공급 핵심 주택형은 보수적으로 봐야 합니다.",
    badge: "예상",
  },
  {
    key: "mayongseong",
    label: "마용성",
    districts: ["마포", "용산", "성동"],
    minGuide: 62,
    maxGuide: 78,
    representativeScore: 69,
    difficulty: "높음",
    summary: "도심 접근성과 신축 선호가 강한 생활권입니다. 강남권 다음 수준의 경쟁을 예상해야 합니다.",
    caveat: "소형과 대형의 편차가 커서 평균값 하나로 판단하기 어렵습니다.",
    badge: "예상",
  },
  {
    key: "southwest",
    label: "서남권·강서/영등포",
    districts: ["강서", "영등포", "구로", "금천", "양천"],
    minGuide: 50,
    maxGuide: 68,
    representativeScore: 59,
    difficulty: "보통",
    summary: "비강남 실수요가 많이 보는 구간입니다. 50점대는 면적과 추첨제 비중을 같이 확인해야 합니다.",
    caveat: "역세권·브랜드·분양가에 따라 강남권 못지않게 과열될 수 있습니다.",
    badge: "예상",
  },
  {
    key: "northeast",
    label: "동북권·노도강",
    districts: ["노원", "도봉", "강북", "중랑", "성북"],
    minGuide: 48,
    maxGuide: 64,
    representativeScore: 56,
    difficulty: "보통",
    summary: "서울 안 예산 방어 수요가 보는 구간입니다. 50점대 중후반은 단지별로 검토 여지가 있습니다.",
    caveat: "대단지 신축이나 역세권은 같은 권역 안에서도 커트라인이 높게 형성될 수 있습니다.",
    badge: "예상",
  },
  {
    key: "outer",
    label: "외곽·대형 평형",
    districts: ["외곽권", "대형 주택형", "비선호 타입"],
    minGuide: 40,
    maxGuide: 58,
    representativeScore: 50,
    difficulty: "낮음",
    summary: "낮은 가점 사용자가 가장 먼저 확인할 조합입니다. 대형 평형과 비선호 타입에서 사례가 생깁니다.",
    caveat: "분양가 부담, 자금 계획, 추첨제 비중을 같이 봐야 합니다.",
    badge: "시뮬레이션",
  },
];

const areaCutlines: AreaCutlineCard[] = [
  {
    key: "under60",
    label: "59㎡ 이하",
    scoreGuide: "55~84점",
    lotterySignal: "일부 구간은 추첨제 병행 확인",
    competitionPattern: "소형 선호와 가격 진입 장벽이 낮아 인기 입지는 점수가 높아질 수 있습니다.",
    recommendedFor: "가점은 낮지만 초기 자금 부담을 줄이고 싶은 1~2인 가구",
  },
  {
    key: "eightyFour",
    label: "84㎡",
    scoreGuide: "60~84점",
    lotterySignal: "일반공급 가점제 영향이 큼",
    competitionPattern: "3~4인 가족 실수요가 몰리는 핵심 주택형이라 가장 보수적으로 봐야 합니다.",
    recommendedFor: "부양가족 가점이 있거나 장기 무주택 기간을 확보한 실수요자",
  },
  {
    key: "large",
    label: "대형 평형",
    scoreGuide: "40~65점",
    lotterySignal: "분양가 부담 때문에 경쟁 강도가 낮아지는 사례 존재",
    competitionPattern: "자금 부담이 커서 일부 단지는 40~50점대 사례가 생길 수 있습니다.",
    recommendedFor: "가점은 낮지만 현금 동원력과 대출 계획을 갖춘 사용자",
  },
];

const supplyStrategies: SupplyStrategyCard[] = [
  {
    key: "generalScore",
    label: "일반공급 가점제",
    fitUser: "장기 무주택, 부양가족, 청약통장 기간 점수가 높은 사용자",
    advantage: "84점 체계 안에서 점수 경쟁 구조가 명확합니다.",
    caution: "인기 단지에서는 70점대도 안심할 수 없습니다.",
    nextAction: "내 총점과 항목별 부족 점수를 먼저 확인합니다.",
  },
  {
    key: "lottery",
    label: "추첨제",
    fitUser: "가점은 낮지만 무주택 요건과 자금 계획이 준비된 사용자",
    advantage: "가점이 낮아도 공급조건에 따라 진입 여지가 생깁니다.",
    caution: "추첨제 비중과 대상 요건은 주택형·지역·공고별로 다릅니다.",
    nextAction: "희망 단지 모집공고에서 추첨제 배정 비율을 확인합니다.",
  },
  {
    key: "newlywed",
    label: "신혼부부 특별공급",
    fitUser: "혼인 기간, 소득, 자녀 요건을 검토해야 하는 신혼부부",
    advantage: "일반공급 고가점 경쟁과 다른 트랙으로 접근할 수 있습니다.",
    caution: "소득·자산·자녀·혼인기간 요건이 함께 작동합니다.",
    nextAction: "특공 자격을 먼저 체크하고 일반공급과 병행 여부를 정합니다.",
  },
  {
    key: "firstHome",
    label: "생애최초 특별공급",
    fitUser: "주택 구입 이력이 없고 소득·혼인·자녀 요건을 확인해야 하는 사용자",
    advantage: "생애최초 조건에 맞으면 일반공급과 다른 경쟁군을 볼 수 있습니다.",
    caution: "세대 구성과 과거 주택 소유 이력 확인이 중요합니다.",
    nextAction: "생애최초 인정 여부를 모집공고 기준으로 검토합니다.",
  },
  {
    key: "multiChild",
    label: "다자녀 특별공급",
    fitUser: "자녀 수 요건을 충족하는 가구",
    advantage: "부양가족 점수와 별개로 특공 트랙을 검토할 수 있습니다.",
    caution: "지역 우선, 자녀 수, 무주택 요건이 함께 반영됩니다.",
    nextAction: "자녀 수와 거주지역 우선 조건을 먼저 확인합니다.",
  },
];

const scoreBandStrategies: ScoreBandStrategy[] = [
  {
    key: "forties",
    label: "40점대",
    scoreMin: 40,
    scoreMax: 49,
    possibleZone: "외곽권, 대형 평형, 추첨제 병행 구간",
    mainStrategy: "일반공급 핵심 타입보다 추첨제, 비선호 타입, 특별공급 자격을 우선 확인합니다.",
    avoid: "강남권 84㎡ 일반공급만 반복해서 넣는 전략은 비효율적입니다.",
    ctaLabel: "내집마련 자금부터 확인",
    ctaHref: "/tools/home-purchase-fund/",
  },
  {
    key: "fifties",
    label: "50점대",
    scoreMin: 50,
    scoreMax: 59,
    possibleZone: "비강남 일부, 동북권, 서남권, 대형 평형",
    mainStrategy: "희망 지역을 넓히고 59㎡·대형·추첨제 조합을 같이 봅니다.",
    avoid: "서울 평균 커트라인만 보고 모든 단지를 포기하는 것도, 인기 단지만 보는 것도 피해야 합니다.",
    ctaLabel: "서울 주거 리포트 보기",
    ctaHref: "/reports/seoul-housing-2016-vs-2026/",
  },
  {
    key: "sixties",
    label: "60점대",
    scoreMin: 60,
    scoreMax: 69,
    possibleZone: "비강남 핵심지, 일부 인기 생활권, 조건부 마용성",
    mainStrategy: "자치구와 주택형을 나눠 우선순위를 정하고 자금 계획을 동시에 검토합니다.",
    avoid: "60점대라고 모든 서울 단지에서 안정권이라고 해석하면 위험합니다.",
    ctaLabel: "전월세 대안도 비교",
    ctaHref: "/tools/jeonwolse-conversion/",
  },
  {
    key: "seventiesPlus",
    label: "70점대 이상",
    scoreMin: 70,
    possibleZone: "강남권, 마용성, 상한제 기대 단지 도전권",
    mainStrategy: "입지와 분양가, 실거주 계획을 중심으로 선별 청약합니다.",
    avoid: "만점 사례가 있는 단지에서는 70점대도 결과를 단정하면 안 됩니다.",
    ctaLabel: "자금 계획 계산",
    ctaHref: "/tools/home-purchase-fund/",
  },
];

const futureComplexEstimates: FutureComplexEstimate[] = [
  {
    complexName: "장위푸르지오마크원",
    district: "성북구",
    expectedMonth: "2026년 예정",
    areaHint: "59㎡·84㎡ 중심",
    expectedScoreRange: "55~68점",
    basis: "동북권 신축 수요와 서울 예산 방어 수요를 반영한 참고 구간입니다.",
    badge: "예상",
  },
  {
    complexName: "더샵신길센트럴시티",
    district: "영등포구",
    expectedMonth: "2026년 예정",
    areaHint: "실수요 핵심 주택형",
    expectedScoreRange: "58~72점",
    basis: "서남권 직주근접 수요와 신축 선호를 반영한 참고 구간입니다.",
    badge: "예상",
  },
  {
    complexName: "라클라체자이드파인",
    district: "서울 주요 생활권",
    expectedMonth: "2026년 예정",
    areaHint: "주택형별 편차 큼",
    expectedScoreRange: "55~75점",
    basis: "브랜드, 분양가, 생활권 조건에 따라 편차가 큰 예상 구간입니다.",
    badge: "예상",
  },
  {
    complexName: "오티에르반포",
    district: "서초구",
    expectedMonth: "2026년 예정",
    areaHint: "강남권 핵심 입지",
    expectedScoreRange: "72~84점",
    basis: "강남권 희소 입지와 고가점 수요를 반영한 보수적 참고 구간입니다.",
    badge: "예상",
  },
];

const roadmaps: RoadmapItem[] = [
  {
    label: "1년 후",
    scoreSignal: "통장 가입기간과 무주택기간 점수가 소폭 변할 수 있음",
    action: "희망 단지보다 주택형과 공급유형을 먼저 넓혀 봅니다.",
    caution: "1년 상승분만으로 지역 난이도가 크게 바뀌지는 않습니다.",
  },
  {
    label: "3년 후",
    scoreSignal: "무주택기간 구간 이동이 생기면 체감 점수가 달라질 수 있음",
    action: "자금 계획과 지역 우선순위를 함께 재점검합니다.",
    caution: "분양가와 대출 규제가 바뀌면 같은 점수의 의미도 달라집니다.",
  },
  {
    label: "5년 후",
    scoreSignal: "가족 구성 변화와 장기 무주택 점수가 전략을 바꿀 수 있음",
    action: "일반공급과 특공 가능성을 모두 다시 계산합니다.",
    caution: "점수 상승이 당첨 가능성을 자동으로 보장하지 않습니다.",
  },
];

const simulationDefaults: SimulationInputDefaults = {
  score: 52,
  areaBand: "eightyFour",
  supplyType: "generalScore",
  regionGroup: "southwest",
};

const faq: FaqItem[] = [
  {
    q: "서울 청약은 몇 점이면 당첨 가능한가요?",
    a: "하나의 기준점으로 말하기 어렵습니다. 강남권 인기 주택형은 70점대 이상이나 만점 사례도 있고, 비강남 대형 평형에서는 40~50점대 사례도 있습니다.",
  },
  {
    q: "59㎡와 84㎡ 커트라인은 왜 다른가요?",
    a: "84㎡는 3~4인 가족 실수요가 몰리는 핵심 주택형이고, 59㎡ 이하는 가격 진입 장벽과 추첨제 비중, 단지 선호도에 따라 편차가 커집니다.",
  },
  {
    q: "가점 50점대도 서울 청약을 넣어볼 수 있나요?",
    a: "서울 전체를 포기할 점수는 아니지만 인기 핵심 단지만 보면 어렵습니다. 비강남, 대형 평형, 추첨제, 특별공급 자격을 함께 봐야 합니다.",
  },
  {
    q: "추첨제는 가점이 낮아도 가능한가요?",
    a: "추첨제는 가점 경쟁과 다른 구조지만, 대상 요건과 배정 비율이 주택형·지역·모집공고별로 다릅니다. 공고문 확인이 필수입니다.",
  },
  {
    q: "특별공급이 일반공급보다 항상 유리한가요?",
    a: "항상 그렇지는 않습니다. 신혼부부, 생애최초, 다자녀 등은 자격 요건과 경쟁군이 다르므로 본인의 조건이 맞을 때만 대안이 됩니다.",
  },
  {
    q: "청약통장은 계속 유지해야 하나요?",
    a: "가입기간 점수는 오래 쌓아야 하므로 해지 전 기회비용을 봐야 합니다. 다만 자금 계획, 거주 계획, 청약 가능성이 함께 맞아야 유지 효과가 있습니다.",
  },
];

const relatedLinks: RelatedLink[] = [
  { label: "아파트 청약 가점 계산기", href: "/tools/apt-cheonyak-gajum-calculator/", description: "무주택기간, 부양가족, 청약통장 가입기간으로 내 총점을 먼저 확인합니다." },
  { label: "내집마련 자금 계산기", href: "/tools/home-purchase-fund/", description: "분양가와 대출 가능액, 필요 현금을 먼저 계산합니다." },
  { label: "전월세 전환율 계산기", href: "/tools/jeonwolse-conversion/", description: "청약 대기 중 전세·월세 대안을 같은 기준으로 비교합니다." },
  { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/", description: "서울 주거비 흐름과 청약 대안의 큰 맥락을 봅니다." },
  { label: "서울 25개 구 전월세 전환 지도", href: "/reports/seoul-jeonwolse-ratio-2026/", description: "청약 대기 중 임차 선택지 변화를 지역별로 확인합니다." },
];

const sourceLinks: SourceLink[] = [
  { label: "청약홈", href: "https://www.applyhome.co.kr/", type: "official" },
  { label: "마이홈 - 신혼부부 특별공급 안내", href: "https://www.myhome.go.kr/", type: "official" },
  { label: "인천도시공사 일반공급 가점제 안내", href: "https://www.ih.co.kr/main/sale_lease/lttot_guide/subscription/private.jsp", type: "official" },
  { label: "연합뉴스 - 서울 강서구 청약 가점 사례", href: "https://www.yna.co.kr/view/AKR20260326067600003", type: "news" },
  { label: "매일경제 - 2026 서울 분양 예정 단지 보도", href: "https://www.mk.co.kr/news/economy/11925430", type: "news" },
  { label: "뉴시스 - 분양캘린더 참고", href: "https://www.newsis.com/", type: "reference" },
];

export const seoulAptCheonyakCutline2026 = {
  meta,
  heroSummary,
  kpis,
  scoreRules,
  actualCases,
  regionCutlines,
  areaCutlines,
  supplyStrategies,
  scoreBandStrategies,
  futureComplexEstimates,
  roadmaps,
  simulationDefaults,
  faq,
  relatedLinks,
  sourceLinks,
} as const;

export function getCasesByArea(areaBand: AreaBand) {
  return actualCases.filter((item) => item.areaBand === areaBand);
}

export function getCasesBySupplyType(supplyType: SupplyType) {
  return actualCases.filter((item) => item.supplyType === supplyType);
}

export function getRegionCutline(regionGroup: RegionGroupKey) {
  return regionCutlines.find((item) => item.key === regionGroup) ?? regionCutlines[0];
}

export function getScoreBandStrategy(score: number) {
  if (score >= 70) return scoreBandStrategies.find((item) => item.key === "seventiesPlus") ?? scoreBandStrategies[3];
  if (score >= 60) return scoreBandStrategies.find((item) => item.key === "sixties") ?? scoreBandStrategies[2];
  if (score >= 50) return scoreBandStrategies.find((item) => item.key === "fifties") ?? scoreBandStrategies[1];
  return scoreBandStrategies.find((item) => item.key === "forties") ?? scoreBandStrategies[0];
}

export function getRecommendedStrategy(input: SimulationInputDefaults) {
  const region = getRegionCutline(input.regionGroup);
  const scoreBand = getScoreBandStrategy(input.score);
  const area = areaCutlines.find((item) => item.key === input.areaBand) ?? areaCutlines[1];
  const supply = supplyStrategies.find((item) => item.key === input.supplyType) ?? supplyStrategies[0];
  const gapToRegion = input.score - region.representativeScore;
  const signal =
    gapToRegion >= 5
      ? "도전권"
      : gapToRegion >= -4
        ? "공고별 확인 구간"
        : gapToRegion >= -12
          ? "추첨제·특공 병행 필요"
          : "매우 어려움";

  return {
    region,
    scoreBand,
    area,
    supply,
    signal,
    gapToRegion,
    summary: `${input.score}점은 ${scoreBand.label} 전략에 해당합니다. ${region.label} ${area.label} 조합은 ${signal}으로 보고, ${supply.label} 조건을 모집공고 기준으로 다시 확인하는 것이 좋습니다.`,
  };
}
