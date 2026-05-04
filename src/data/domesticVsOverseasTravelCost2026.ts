export type TravelDestinationType = "domestic" | "overseas";

export type CostRange = {
  min: number;
  max: number;
  note?: string;
};

export type TravelCostCategory =
  | "transport"
  | "lodging"
  | "food"
  | "localMove"
  | "activity"
  | "insuranceAndComms"
  | "hidden";

export type TravelDestinationCost = {
  id: string;
  name: string;
  type: TravelDestinationType;
  regionLabel: string;
  summary: string;
  recommendedFor: string[];
  caution: string;
  costs: Record<TravelCostCategory, CostRange>;
  total: CostRange;
  valueScore: number;
  costRank: number;
  satisfactionRank: number;
  keyVariables: string[];
};

export type SeasonCostInsight = {
  season: string;
  domestic: string;
  overseas: string;
  strategy: string;
};

export type TravelRecommendation = {
  id: string;
  title: string;
  budgetLabel: string;
  destinations: string[];
  reason: string;
};

export const reportMeta = {
  slug: "domestic-vs-overseas-travel-cost-2026",
  title: "2026 국내 여행 vs 해외 여행 총비용 비교",
  description:
    "제주, 부산, 강원과 일본, 베트남, 괌의 2박 3일 2인 기준 여행 총비용을 교통, 숙박, 식비, 액티비티, 통신·보험까지 같은 기준으로 비교합니다.",
  baseLabel: "2026년 4월 기준, 성인 2인 2박 3일 추정 범위",
} as const;

export const categoryLabels: Record<TravelCostCategory, string> = {
  transport: "교통/항공",
  lodging: "숙박",
  food: "식비/카페",
  localMove: "현지 이동",
  activity: "액티비티",
  insuranceAndComms: "보험/통신/환전",
  hidden: "기타 숨은 비용",
};

export const categoryOrder: TravelCostCategory[] = [
  "transport",
  "lodging",
  "food",
  "localMove",
  "activity",
  "insuranceAndComms",
  "hidden",
];

export const destinations: TravelDestinationCost[] = [
  {
    id: "gangwon",
    name: "강원",
    type: "domestic",
    regionLabel: "국내",
    summary: "자가용 또는 KTX 접근성이 좋고 숙박 선택지가 넓어 최저 비용을 만들기 쉽습니다.",
    recommendedFor: ["비용 최소화", "부모님 동반", "짧은 휴식"],
    caution: "성수기 리조트와 렌터카를 붙이면 일본 저가 여행과 격차가 빠르게 줄어듭니다.",
    costs: {
      transport: { min: 160_000, max: 280_000, note: "자가용 유류·통행료 또는 KTX 2인 왕복" },
      lodging: { min: 180_000, max: 360_000, note: "펜션·호텔 2박" },
      food: { min: 150_000, max: 260_000, note: "2인 7~8끼 기준" },
      localMove: { min: 70_000, max: 160_000, note: "주차·택시·관광지 이동" },
      activity: { min: 80_000, max: 180_000, note: "케이블카·전망대·체험 1~2개" },
      insuranceAndComms: { min: 20_000, max: 40_000, note: "단기 여행자보험 선택 시" },
      hidden: { min: 30_000, max: 80_000, note: "주차·간식·비품" },
    },
    total: { min: 690_000, max: 1_360_000 },
    valueScore: 86,
    costRank: 1,
    satisfactionRank: 4,
    keyVariables: ["자가용 여부", "리조트 등급", "주말 숙박", "스키·워터파크 같은 유료 시설"],
  },
  {
    id: "busan",
    name: "부산",
    type: "domestic",
    regionLabel: "국내",
    summary: "교통과 먹거리가 안정적이고 도심 이동이 쉬워 커플·친구 여행에 무난합니다.",
    recommendedFor: ["커플 여행", "미식 여행", "기차 여행"],
    caution: "해운대·광안리 성수기 숙소를 고르면 국내 여행 중에서도 총액이 높은 편입니다.",
    costs: {
      transport: { min: 180_000, max: 360_000, note: "KTX·항공·자가용 선택에 따라 차이" },
      lodging: { min: 220_000, max: 440_000, note: "도심 호텔 2박" },
      food: { min: 170_000, max: 300_000, note: "식사·카페·야식 포함" },
      localMove: { min: 60_000, max: 140_000, note: "지하철·택시·주차" },
      activity: { min: 80_000, max: 190_000, note: "요트·전망대·스파 선택 시 상승" },
      insuranceAndComms: { min: 20_000, max: 40_000, note: "보험 선택 비용" },
      hidden: { min: 40_000, max: 90_000, note: "짐 보관·간식·현장 결제" },
    },
    total: { min: 770_000, max: 1_560_000 },
    valueScore: 83,
    costRank: 2,
    satisfactionRank: 3,
    keyVariables: ["해변 숙소 위치", "KTX 할인", "택시 이용 빈도", "유료 체험 선택"],
  },
  {
    id: "jeju",
    name: "제주",
    type: "domestic",
    regionLabel: "국내",
    summary: "항공·렌터카·숙박이 동시에 움직여 국내 여행 중 비용 변동성이 가장 큽니다.",
    recommendedFor: ["가족 여행", "자연 여행", "렌터카 여행"],
    caution: "렌터카와 해변권 숙소를 붙이면 2박 3일도 해외 근거리 여행과 비슷해질 수 있습니다.",
    costs: {
      transport: { min: 260_000, max: 520_000, note: "국내선 항공 2인 왕복" },
      lodging: { min: 240_000, max: 520_000, note: "호텔·펜션 2박" },
      food: { min: 180_000, max: 330_000, note: "관광지 식당 비중 반영" },
      localMove: { min: 160_000, max: 340_000, note: "렌터카·보험·유류·주차" },
      activity: { min: 100_000, max: 260_000, note: "카페·전시·체험" },
      insuranceAndComms: { min: 20_000, max: 50_000, note: "보험·렌터카 추가 보장" },
      hidden: { min: 50_000, max: 120_000, note: "수하물·간식·기상 변수" },
    },
    total: { min: 1_010_000, max: 2_140_000 },
    valueScore: 78,
    costRank: 3,
    satisfactionRank: 2,
    keyVariables: ["렌터카", "항공권 시점", "해변 숙소", "카페·액티비티 밀도"],
  },
  {
    id: "vietnam",
    name: "베트남",
    type: "overseas",
    regionLabel: "해외",
    summary: "항공권만 맞추면 숙박·식비·이동비가 낮아 2박 3일 해외 가성비가 좋습니다.",
    recommendedFor: ["가성비 해외", "미식 여행", "마사지·휴식"],
    caution: "짧은 일정에서는 항공 시간이 길어 체류 효율이 떨어질 수 있습니다.",
    costs: {
      transport: { min: 800_000, max: 1_500_000, note: "서울 출발 2인 왕복 항공권" },
      lodging: { min: 150_000, max: 390_000, note: "3~4성급 호텔 2박" },
      food: { min: 100_000, max: 240_000, note: "현지 식사·카페" },
      localMove: { min: 40_000, max: 110_000, note: "그랩·공항 이동" },
      activity: { min: 80_000, max: 240_000, note: "투어·마사지·입장료" },
      insuranceAndComms: { min: 60_000, max: 130_000, note: "여행자보험·eSIM·환전 수수료" },
      hidden: { min: 70_000, max: 170_000, note: "수하물·팁·카드 수수료" },
    },
    total: { min: 1_300_000, max: 2_780_000 },
    valueScore: 90,
    costRank: 4,
    satisfactionRank: 1,
    keyVariables: ["항공권 특가", "숙소 등급", "마사지·투어", "환율"],
  },
  {
    id: "japan",
    name: "일본",
    type: "overseas",
    regionLabel: "해외",
    summary: "비행 시간이 짧고 인프라가 좋아 국내 장거리 여행과 직접 비교되는 대표 선택지입니다.",
    recommendedFor: ["초보 해외", "쇼핑·미식", "커플 여행"],
    caution: "성수기 항공권과 도심 호텔 가격이 오르면 제주 고비용 시나리오보다 비싸집니다.",
    costs: {
      transport: { min: 760_000, max: 1_400_000, note: "일본 주요 도시 2인 왕복 항공권" },
      lodging: { min: 280_000, max: 560_000, note: "비즈니스호텔·도심 호텔 2박" },
      food: { min: 180_000, max: 340_000, note: "라멘·이자카야·카페" },
      localMove: { min: 80_000, max: 180_000, note: "공항 이동·지하철 패스" },
      activity: { min: 90_000, max: 240_000, note: "전망대·테마파크 일부" },
      insuranceAndComms: { min: 60_000, max: 120_000, note: "보험·eSIM·환전 수수료" },
      hidden: { min: 60_000, max: 160_000, note: "수하물·라커·쇼핑성 지출 제외" },
    },
    total: { min: 1_510_000, max: 3_000_000 },
    valueScore: 88,
    costRank: 5,
    satisfactionRank: 2,
    keyVariables: ["엔화", "LCC 수하물", "도심 호텔", "테마파크 포함 여부"],
  },
  {
    id: "guam",
    name: "괌",
    type: "overseas",
    regionLabel: "해외",
    summary: "휴양 만족도는 높지만 항공권·리조트·식비가 동시에 높아 총액 상단이 큽니다.",
    recommendedFor: ["휴양", "아이 동반", "리조트 여행"],
    caution: "리조트와 렌터카, 외식 비중이 높으면 2박 3일도 400만원대까지 열릴 수 있습니다.",
    costs: {
      transport: { min: 1_200_000, max: 2_300_000, note: "2인 왕복 항공권" },
      lodging: { min: 420_000, max: 900_000, note: "호텔·리조트 2박" },
      food: { min: 260_000, max: 560_000, note: "미국령 외식 단가 반영" },
      localMove: { min: 160_000, max: 380_000, note: "렌터카·택시·공항 이동" },
      activity: { min: 180_000, max: 500_000, note: "해양 액티비티·투어" },
      insuranceAndComms: { min: 80_000, max: 160_000, note: "보험·eSIM·카드 수수료" },
      hidden: { min: 100_000, max: 260_000, note: "리조트피·팁·수하물" },
    },
    total: { min: 2_400_000, max: 5_060_000 },
    valueScore: 76,
    costRank: 6,
    satisfactionRank: 3,
    keyVariables: ["리조트 등급", "렌터카", "가족 동반", "해양 액티비티"],
  },
];

export const seasonInsights: SeasonCostInsight[] = [
  {
    season: "비수기 평일",
    domestic: "강원·부산은 숙박비가 크게 낮아지고 제주도 렌터카 부담이 줄어듭니다.",
    overseas: "일본·베트남은 항공권 특가가 나오면 국내 고비용 여행과 격차가 좁아집니다.",
    strategy: "날짜가 유연하면 항공권보다 숙소 취소 가능 요금을 먼저 잡고 가격을 추적하세요.",
  },
  {
    season: "주말·연휴",
    domestic: "국내는 숙소와 교통 혼잡이 동시에 올라 체감 비용이 빠르게 상승합니다.",
    overseas: "근거리 해외도 항공권이 오르지만 현지 체류비는 국내보다 안정적인 편입니다.",
    strategy: "2박 3일 연휴라면 제주·부산 성수기 숙소와 일본 LCC 총액을 같은 화면에서 비교해야 합니다.",
  },
  {
    season: "방학·휴가철",
    domestic: "제주·강원 리조트와 렌터카가 상단 구간으로 이동합니다.",
    overseas: "괌은 리조트와 항공권이 같이 올라 가족 여행 총액이 크게 뜁니다.",
    strategy: "휴가철에는 목적지보다 숙소 등급과 항공권 구매 시점이 예산을 더 크게 좌우합니다.",
  },
  {
    season: "환율 변동기",
    domestic: "국내 여행은 환율 영향이 작지만 유류비와 숙박 수요에 영향을 받습니다.",
    overseas: "엔화·달러·동남아 통화가 5%만 움직여도 현지 지출과 카드 수수료 체감이 달라집니다.",
    strategy: "해외는 항공권 결제 후 숙박·현지 투어 결제 통화까지 확인해야 실제 총액이 맞습니다.",
  },
];

export const recommendationReasons = [
  {
    title: "국내 여행이 예상보다 비싸지는 이유",
    body: "국내는 항공권 대신 숙소, 렌터카, 주차, 카페, 체험비가 작게 쪼개져 결제됩니다. 총액을 합산하면 해외 항공권 포함 비용과 직접 비교되는 구간이 생깁니다.",
  },
  {
    title: "해외 여행이 항상 더 비싸지 않은 이유",
    body: "일본·베트남은 항공권 특가와 현지 물가가 맞으면 제주 성수기 여행보다 낮은 총액이 가능합니다. 다만 여권, 통신, 보험, 환전 수수료를 빼면 안 됩니다.",
  },
  {
    title: "2박 3일에서는 이동 시간이 비용입니다",
    body: "베트남·괌은 체류비 대비 항공 시간이 길어 짧은 일정에서는 만족도 효율이 떨어질 수 있습니다. 가까운 일본이나 국내 여행은 시간 효율이 강점입니다.",
  },
  {
    title: "쇼핑비를 제외해야 비교가 선명합니다",
    body: "쇼핑비는 개인차가 커서 기본 총액에서 제외했습니다. 대신 수하물, 라커, 카드 수수료처럼 여행 자체에 따라오는 숨은 비용은 별도로 반영했습니다.",
  },
  {
    title: "가족 여행은 숙박과 이동비가 핵심입니다",
    body: "아이 동반은 숙소 등급, 렌터카, 식사 장소가 상향되기 쉽습니다. 같은 목적지도 커플 여행과 가족 여행의 비용 곡선이 다르게 움직입니다.",
  },
  {
    title: "만족도는 총액보다 기대치와 일정 밀도에 좌우됩니다",
    body: "비싼 여행이 항상 만족도가 높은 것은 아닙니다. 이동 시간이 짧고 하고 싶은 활동이 분명한 목적지가 예산 대비 만족도가 높습니다.",
  },
];

export const recommendations: TravelRecommendation[] = [
  {
    id: "lowest-cost",
    title: "비용 최소화형",
    budgetLabel: "70만~140만원대",
    destinations: ["강원", "부산"],
    reason: "자가용·철도 할인과 가성비 숙소를 조합하면 2인 2박 3일 총액을 가장 낮게 만들기 쉽습니다.",
  },
  {
    id: "overseas-value",
    title: "가성비 해외형",
    budgetLabel: "130만~280만원대",
    destinations: ["베트남", "일본"],
    reason: "항공권만 맞추면 현지 체류비가 낮거나 경험 밀도가 높아 국내 성수기 여행과 경쟁합니다.",
  },
  {
    id: "couple",
    title: "커플 여행형",
    budgetLabel: "80만~300만원대",
    destinations: ["부산", "일본", "제주"],
    reason: "이동 피로가 낮고 식사·카페·쇼핑 선택지가 많아 짧은 일정 만족도를 만들기 좋습니다.",
  },
  {
    id: "family",
    title: "아이 동반 가족형",
    budgetLabel: "100만~500만원대",
    destinations: ["제주", "괌", "강원"],
    reason: "렌터카와 숙소 컨디션, 동선 안정성이 중요해 총액보다 일정 스트레스가 핵심입니다.",
  },
  {
    id: "parents",
    title: "부모님 동반형",
    budgetLabel: "70만~220만원대",
    destinations: ["강원", "부산", "제주"],
    reason: "비행·입국 절차보다 숙소와 식사 품질이 더 중요해 국내 여행의 실전 만족도가 높습니다.",
  },
];

export const savingTips: string[] = [
  "국내 여행은 숙소 취소 가능 요금을 먼저 잡고, KTX·항공·렌터카 특가를 따로 비교하세요.",
  "제주는 렌터카 보험과 유류비를 별도 항목으로 두면 일본 LCC 총액과 비교가 쉬워집니다.",
  "일본·베트남은 항공권 특가만 보지 말고 수하물, 좌석, eSIM, 보험까지 합산해야 합니다.",
  "괌은 리조트피, 팁, 렌터카, 외식 단가가 총액을 밀어 올리므로 상단 범위를 넉넉히 잡는 편이 안전합니다.",
  "쇼핑비는 목적지별 비교를 흐리게 하므로 기본 여행비와 따로 예산을 잡는 것이 좋습니다.",
  "2박 3일 해외는 이동 시간이 짧은 목적지를 고를수록 비용 대비 체류 시간이 좋아집니다.",
];

export const faqItems: { q: string; a: string }[] = [
  {
    q: "국내 여행이 해외 여행보다 정말 더 비쌀 수 있나요?",
    a: "가능합니다. 제주 성수기처럼 항공권, 렌터카, 숙소가 동시에 오르는 구간에서는 일본 비수기 LCC 여행과 총액이 비슷해질 수 있습니다. 다만 평균적으로는 강원·부산 같은 국내 여행이 최저 비용을 만들기 쉽습니다.",
  },
  {
    q: "제주와 일본 중 어디가 더 저렴한가요?",
    a: "하단 기준으로는 제주가 약 101만 원부터, 일본이 약 151만 원부터라 제주가 낮습니다. 하지만 제주 렌터카·숙소가 상단으로 가고 일본 항공권이 특가로 내려오면 차이가 줄어듭니다.",
  },
  {
    q: "베트남 여행은 왜 가성비가 좋다고 하나요?",
    a: "항공권 비중은 크지만 숙박, 식비, 택시, 마사지 같은 현지 체류비가 낮기 때문입니다. 2박 3일은 비행 시간이 부담이지만 4박 이상으로 늘리면 체류비 장점이 더 크게 보입니다.",
  },
  {
    q: "괌은 가성비 여행지인가요?",
    a: "괌은 가성비보다 휴양 만족도와 가족 동선 안정성이 강점인 여행지입니다. 항공권, 리조트, 외식, 렌터카, 액티비티가 모두 높은 편이라 비용 최소화 목적에는 맞지 않습니다.",
  },
  {
    q: "2박 3일 기준으로 해외 여행은 너무 짧지 않나요?",
    a: "일본은 이동 시간이 짧아 2박 3일도 현실적입니다. 베트남과 괌은 비행 시간이 길어 체류 효율이 낮을 수 있으므로 휴가를 하루 더 붙이는 편이 만족도에 유리합니다.",
  },
  {
    q: "국내 vs 해외 여행을 고를 때 가장 중요한 기준은 무엇인가요?",
    a: "총액만 보지 말고 이동 시간, 숙소 등급, 하고 싶은 활동, 환율·수수료, 동행자 피로도를 같이 봐야 합니다. 짧은 일정은 시간 효율, 긴 일정은 현지 체류비가 더 중요합니다.",
  },
  {
    q: "이 페이지의 금액은 공식 가격인가요?",
    a: "아닙니다. 2026년 4월 기준 공개 시세와 시장 범위를 바탕으로 정리한 추정 비교값입니다. 실제 예약 시점의 항공권, 숙박 등급, 환율, 성수기 여부에 따라 달라질 수 있습니다.",
  },
];

export const relatedLinks: { label: string; href: string; description: string }[] = [
  {
    label: "해외 여행 비용 계산기",
    href: "/tools/overseas-travel-cost/",
    description: "항공권, 숙박, 식비, 환율을 직접 넣어 내 일정 기준 총액을 계산합니다.",
  },
  {
    label: "항공권 최저가 시기 계산기",
    href: "/tools/flight-cheapest-timing-calculator/",
    description: "출발 시점과 예약 타이밍별 항공권 부담을 추정합니다.",
  },
  {
    label: "해외여행 비용 비교 리포트",
    href: "/reports/overseas-travel-cost-compare-2026/",
    description: "일본·동남아·유럽 주요 도시의 해외여행 비용 구조를 더 자세히 봅니다.",
  },
  {
    label: "한국 출발 항공권 가격 비교",
    href: "/reports/korea-flight-price-comparison-2026/",
    description: "노선별 항공권 범위와 예약 시점 변수를 비교합니다.",
  },
];
