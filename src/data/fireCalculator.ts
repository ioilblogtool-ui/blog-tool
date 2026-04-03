export type FireMode = "SINGLE" | "COUPLE";
export type WithdrawalRate = 0.04 | 0.035 | 0.03;
export type FireType = "LEAN" | "REGULAR" | "FAT" | "COAST" | "BARISTA";

export interface FireInput {
  currentAge: number;
  targetRetireAge: number;
  currentNetWorth: number;
  monthlyExpense: number;
  monthlyInvestment: number;
  annualReturnRate: number;
  inflationRate: number;
  withdrawalRate: WithdrawalRate;
  monthlyPassiveIncome?: number;
  monthlyPension?: number;
  fireMode: FireMode;
}

export interface ExpensePreset {
  code:
    | "AVG_SINGLE"
    | "AVG_HOUSEHOLD"
    | "LEAN_FIRE"
    | "SINGLE_BASIC"
    | "COUPLE_BASIC"
    | "FAMILY_BASIC"
    | "COMFORT";
  label: string;
  monthlyExpense: number;
  description: string;
  sourceType: "OFFICIAL" | "SERVICE";
}

export interface CagrBenchmark {
  assetCode: string;
  label: string;
  cagr3y: number;
  cagr5y: number;
  cagr10y: number;
  category: "INDEX" | "STOCK";
  region: "US" | "KR";
  description: string;
}

export interface LegendInvestor {
  id: string;
  label: string;
  careerCagr: number;
  careerPeriod: string;
  fund: string;
  description: string;
  difficulty: "EXTREME" | "VERY_HIGH" | "HIGH";
}

export const FIRE_DEFAULT_INPUT: FireInput = {
  currentAge: 35,
  targetRetireAge: 50,
  currentNetWorth: 180000000,
  monthlyExpense: 3000000,
  monthlyInvestment: 1500000,
  annualReturnRate: 0.07,
  inflationRate: 0.025,
  withdrawalRate: 0.04,
  monthlyPassiveIncome: 0,
  monthlyPension: 0,
  fireMode: "SINGLE",
};

export const FIRE_EXPENSE_PRESETS: ExpensePreset[] = [
  {
    code: "AVG_SINGLE",
    label: "1인 평균",
    monthlyExpense: 1689000,
    description: "혼자 사는 가구 평균 소비를 기준으로 빠르게 시작합니다.",
    sourceType: "OFFICIAL",
  },
  {
    code: "AVG_HOUSEHOLD",
    label: "가구 평균",
    monthlyExpense: 2939000,
    description: "전체 가구 평균 지출 수준을 기준으로 잡습니다.",
    sourceType: "OFFICIAL",
  },
  {
    code: "LEAN_FIRE",
    label: "Lean FIRE",
    monthlyExpense: 1800000,
    description: "주거와 소비를 단단히 줄인 절제형 시나리오입니다.",
    sourceType: "SERVICE",
  },
  {
    code: "SINGLE_BASIC",
    label: "1인 기본형",
    monthlyExpense: 2200000,
    description: "1인 가구가 무리 없이 유지하는 기본형 예시입니다.",
    sourceType: "SERVICE",
  },
  {
    code: "COUPLE_BASIC",
    label: "2인 기본형",
    monthlyExpense: 3000000,
    description: "부부 기준으로 가장 무난한 시작점에 가깝습니다.",
    sourceType: "SERVICE",
  },
  {
    code: "FAMILY_BASIC",
    label: "3~4인 기본형",
    monthlyExpense: 4000000,
    description: "자녀가 있거나 가계 지출이 더 큰 가족형 기준입니다.",
    sourceType: "SERVICE",
  },
  {
    code: "COMFORT",
    label: "여유형",
    monthlyExpense: 5000000,
    description: "여행, 취미, 외식 비중이 더 있는 여유형 소비입니다.",
    sourceType: "SERVICE",
  },
];

export const FIRE_CAGR_BENCHMARKS: CagrBenchmark[] = [
  {
    assetCode: "SP500",
    label: "S&P500",
    cagr3y: 0.112,
    cagr5y: 0.143,
    cagr10y: 0.119,
    category: "INDEX",
    region: "US",
    description: "미국 대표 대형주 인덱스 기준입니다.",
  },
  {
    assetCode: "NASDAQ100",
    label: "NASDAQ100",
    cagr3y: 0.158,
    cagr5y: 0.182,
    cagr10y: 0.171,
    category: "INDEX",
    region: "US",
    description: "기술주 비중이 높은 성장형 인덱스입니다.",
  },
  {
    assetCode: "AAPL",
    label: "AAPL",
    cagr3y: 0.196,
    cagr5y: 0.221,
    cagr10y: 0.247,
    category: "STOCK",
    region: "US",
    description: "대표 개별 성장주 예시입니다.",
  },
  {
    assetCode: "SEC",
    label: "삼성전자",
    cagr3y: 0.024,
    cagr5y: 0.081,
    cagr10y: 0.091,
    category: "STOCK",
    region: "KR",
    description: "국내 대표 대형주 흐름을 참고할 때 봅니다.",
  },
];

export const FIRE_LEGEND_INVESTORS: LegendInvestor[] = [
  {
    id: "DALIO",
    label: "레이 달리오",
    careerCagr: 0.075,
    careerPeriod: "All Weather 참고",
    fund: "Bridgewater All Weather",
    description: "전천후 포트폴리오 · 분산과 안정 중심",
    difficulty: "HIGH",
  },
  {
    id: "BUFFETT",
    label: "워런 버핏",
    careerCagr: 0.198,
    careerPeriod: "1965~2023 (58년)",
    fund: "Berkshire Hathaway",
    description: "가치투자 집중 운용 · 역사상 가장 긴 트랙레코드",
    difficulty: "VERY_HIGH",
  },
  {
    id: "LYNCH",
    label: "피터 린치",
    careerPeriod: "1977~1990 (13년)",
    careerCagr: 0.292,
    fund: "Fidelity Magellan",
    description: "13년 연속 S&P500 초과 수익 · 운용 종료 후 미공개",
    difficulty: "EXTREME",
  },
  {
    id: "SIMONS",
    label: "짐 사이먼스",
    careerCagr: 0.391,
    careerPeriod: "1988~2018 (30년)",
    fund: "Renaissance Medallion",
    description: "퀀트 투자 역사상 최고 수익 · 외부 투자자 불가",
    difficulty: "EXTREME",
  },
];

export const FIRE_RATE_PRESETS = [
  { label: "채권 수준", rate: 0.04, note: "BND 장기 참고", isLegend: false },
  { label: "S&P500", rate: 0.10, note: "미국 대형주 장기 평균", isLegend: false },
  { label: "나스닥", rate: 0.12, note: "기술주 장기 평균", isLegend: false },
  { label: "버핏 수준", rate: 0.20, note: "58년 커리어 평균 ~19.8%", isLegend: true },
  { label: "린치 수준", rate: 0.292, note: "13년 커리어 평균 ~29.2%", isLegend: true },
];

export const FIRE_FAQ = [
  {
    question: "파이어족은 자산이 얼마 있어야 가능한가요?",
    answer:
      "보통은 은퇴 후 순 생활비를 안전인출률로 나눈 값을 FIRE 목표 자산으로 봅니다. 이 계산기는 월 생활비, 부수입, 연금, 인출률을 함께 넣어 필요한 목표 자산을 바로 계산합니다.",
  },
  {
    question: "월 생활비 300만원이면 목표 자산은 얼마인가요?",
    answer:
      "다른 수입이 없고 안전인출률을 4%로 두면 연 3,600만원 생활비를 기준으로 약 9억원이 필요합니다. 다만 부수입이나 연금이 있으면 목표 자산은 그만큼 낮아질 수 있습니다.",
  },
  {
    question: "생활비는 얼마로 넣어야 하나요?",
    answer:
      "지금 지출이 아니라 은퇴 후에도 유지될 소비 구조를 기준으로 넣는 것이 좋습니다. 주거비, 교육비, 차량비처럼 시점에 따라 크게 달라지는 항목은 따로 점검해보는 편이 안전합니다.",
  },
  {
    question: "기대수익률은 몇 %로 넣는 게 현실적인가요?",
    answer:
      "장기 복리 계산에서는 과도한 기대수익률이 결과를 크게 왜곡할 수 있습니다. 보수적으로 5%, 기본 7%, 공격적으로 9% 정도를 비교하면서 범위를 보는 방식이 현실적입니다.",
  },
  {
    question: "애플이나 나스닥 수익률로 계산해도 되나요?",
    answer:
      "가능하지만 개별 성장주나 기술주 지수는 변동성이 훨씬 큽니다. 이 페이지의 CAGR 비교는 기대수익률 감을 잡기 위한 참고용이며, 그대로 미래 수익률을 가정하는 용도로 쓰면 위험합니다.",
  },
  {
    question: "부부 합산으로 계산해도 되나요?",
    answer:
      "가능합니다. 부부 합산 모드로 두면 월 생활비와 목표 자산을 부부 기준으로 해석하기 좋습니다. 다만 실제로는 배우자 소득 지속 여부와 연금 수급 시점까지 함께 따져야 합니다.",
  },
  {
    question: "집이 있으면 목표 자산이 줄어드나요?",
    answer:
      "거주 주택이 있고 은퇴 후 주거비 부담이 낮아진다면 월 생활비 자체가 줄어들 수 있습니다. 다만 집값을 바로 인출할 수 있는 현금흐름으로 보기 어렵기 때문에 생활비 입력을 먼저 조정하는 방식이 더 현실적입니다.",
  },
  {
    question: "국민연금이나 배당소득도 포함해야 하나요?",
    answer:
      "네. 은퇴 후 반복적으로 들어오는 현금흐름이라면 월 부수입이나 월 연금 항목에 반영하는 것이 좋습니다. 그만큼 필요한 순 생활비가 줄어들어 FIRE 목표 자산도 낮아집니다.",
  },
];

export const FIRE_EXTERNAL_LINKS = [
  {
    title: "국민연금 예상연금 조회 안내",
    desc: "은퇴 후 월 연금 항목을 넣기 전에 공식 기준을 확인할 때 참고합니다.",
    source: "국민연금공단",
    href: "https://www.nps.or.kr/",
  },
  {
    title: "가계동향조사",
    desc: "평균 생활비 프리셋의 감을 잡을 때 참고할 수 있는 공식 통계입니다.",
    source: "통계청",
    href: "https://kostat.go.kr/",
  },
  {
    title: "금융소비자 정보포털",
    desc: "장기 투자와 현금흐름 계획을 세울 때 기본 금융정보를 함께 확인합니다.",
    source: "금융감독원",
    href: "https://fine.fss.or.kr/",
  },
  {
    title: "투자자 교육 자료",
    desc: "장기 수익률과 분산 투자 기본 개념을 같이 확인할 수 있습니다.",
    source: "금융투자협회",
    href: "https://www.kofia.or.kr/",
  },
];

export const FIRE_AFFILIATE_PRODUCTS = [
  {
    tag: "FIRE 실전",
    title: "나는 파이어족이다",
    desc: "월급 없이도 현금이 따박따박 들어오는 파이어족 5인의 투자법 실전 사례집",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/ehdoM8",
  },
  {
    tag: "FIRE 시나리오",
    title: "대한민국 파이어족 시나리오",
    desc: "파이어족을 이룬 숨은 강자들에게서 찾은 부의 공식. 국내 실전 사례 중심",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/ehdqwf",
  },
  {
    tag: "연금 전략",
    title: "박곰희 연금 부자 수업",
    desc: "국민연금·퇴직연금·개인연금을 조합해 은퇴 현금흐름을 설계하는 방법",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/ehdrWG",
  },
  {
    tag: "조기 은퇴",
    title: "마흔 살 경제적 자유 프로젝트",
    desc: "3년 만에 월 2천만 원의 파이프라인을 만든 비밀. 현금흐름 구축 전략 집중",
    cta: "쿠팡에서 보기 →",
    href: "https://link.coupang.com/a/ehdtIC",
  },
];

export const FIRE_NEXT_CONTENT = {
  href: "/tools/dca-investment-calculator/",
  eyebrow: "같이 보면 좋은 계산기",
  title: "적립식 투자 수익 비교 계산기",
  desc: "FIRE 목표까지 몇 년이 걸리는지 봤다면, 실제 투자자산 시나리오 차이도 바로 이어서 확인할 수 있습니다.",
  badges: ["장기 투자", "수익률 비교"],
  cta: "적립식 투자 수익 비교 보기",
  sub: [
    {
      href: "/tools/salary-tier/",
      title: "연봉 티어 계산기",
      desc: "현재 소득 수준이 어느 구간인지 먼저 확인할 수 있습니다.",
      badges: ["연봉", "시장 비교"],
    },
    {
      href: "/tools/household-income/",
      title: "가구 소득 계산기",
      desc: "부부 합산 현금흐름을 계산해 FIRE 입력값을 다듬을 때 좋습니다.",
      badges: ["가구", "현금흐름"],
    },
    {
      href: "/tools/home-purchase-fund/",
      title: "내집마련 자금 계산기",
      desc: "주거비 계획과 FIRE 준비를 같이 볼 때 연결하기 좋습니다.",
      badges: ["주거비", "목돈 계획"],
    },
  ],
};
