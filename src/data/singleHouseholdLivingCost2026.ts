export type SourceType = "official" | "private" | "estimate" | "simulation";
export type LivingCostCategory =
  | "housing"
  | "food"
  | "telecom"
  | "transport"
  | "subscription"
  | "insuranceMedical"
  | "leisure"
  | "householdGoods"
  | "savingBuffer";

export type AgeGroup = "20s" | "30s" | "40s";
export type RegionCode = "seoul" | "capital" | "metro" | "local";
export type BudgetType = "saving" | "average" | "comfortable";

export interface SourceInfo {
  label: string;
  organization: string;
  url?: string;
  sourceType: SourceType;
  asOf: string;
  note?: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  sourceType: SourceType;
}

export interface CostItem {
  category: LivingCostCategory;
  label: string;
  monthlyAmount: number;
  share: number;
  rangeText: string;
  sourceType: SourceType;
  note: string;
}

export interface BudgetScenario {
  type: BudgetType;
  label: string;
  monthlyTotal: number;
  housing: number;
  food: number;
  telecomSubscription: number;
  transport: number;
  insuranceMedical: number;
  leisure: number;
  buffer: number;
  description: string;
}

export interface AgeMatrixRow {
  ageGroup: AgeGroup;
  label: string;
  mainPressure: string;
  typicalMonthlyRange: string;
  savingFocus: string;
  riskNote: string;
}

export interface RegionHousingCost {
  region: RegionCode;
  label: string;
  rentRange: string;
  managementFeeRange: string;
  totalHousingRange: string;
  note: string;
}

export interface SavingAction {
  id: string;
  label: string;
  category: LivingCostCategory;
  monthlySaving: number;
  difficulty: "easy" | "normal" | "hard";
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export const SHLC_META = {
  slug: "single-household-living-cost-2026",
  title: "2026 1인 가구 생활비 완전 해부",
  description: "2026년 1인 가구 월 생활비를 주거비·식비·통신비·구독료·보험료까지 항목별로 분석합니다.",
  category: "생활비절약",
  keyword: "1인 가구 월 생활비 평균 2026",
  updatedAt: "2026-05-22",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official: "공식 통계",
  private: "민간 리포트",
  estimate: "추정",
  simulation: "시뮬레이션",
};

export const SHLC_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "월 생활비 기준선",
    value: "145만~255만원",
    description: "월세 포함 1인 가구 예산을 절약형·평균형·여유형으로 나눈 범위",
    sourceType: "simulation",
  },
  {
    label: "가장 큰 지출",
    value: "주거비 41%",
    description: "월세·관리비·공과금 성격의 비용이 생활비 구조를 좌우",
    sourceType: "estimate",
  },
  {
    label: "다음 큰 축",
    value: "식비 27%",
    description: "장보기, 외식, 배달 빈도에 따라 월 36만~72만원까지 벌어짐",
    sourceType: "estimate",
  },
  {
    label: "TOP 3 절약 여지",
    value: "월 11만원",
    description: "배달 1회 줄이기, 알뜰폰 전환, 구독 정리 합산 예시",
    sourceType: "simulation",
  },
];

export const SHLC_COST_ITEMS: CostItem[] = [
  {
    category: "housing",
    label: "주거비",
    monthlyAmount: 780000,
    share: 41,
    rangeText: "62만~105만원",
    sourceType: "estimate",
    note: "월세, 관리비, 공과금 일부 포함",
  },
  {
    category: "food",
    label: "식비",
    monthlyAmount: 520000,
    share: 27,
    rangeText: "36만~72만원",
    sourceType: "estimate",
    note: "장보기, 외식, 배달을 합친 생활 식비",
  },
  {
    category: "telecom",
    label: "통신비·구독료",
    monthlyAmount: 130000,
    share: 7,
    rangeText: "9만~18만원",
    sourceType: "estimate",
    note: "휴대폰, 인터넷, OTT, 음악, 클라우드",
  },
  {
    category: "transport",
    label: "교통비",
    monthlyAmount: 130000,
    share: 7,
    rangeText: "9만~19만원",
    sourceType: "estimate",
    note: "대중교통 중심, 택시·공유 이동 일부 포함",
  },
  {
    category: "insuranceMedical",
    label: "보험·의료",
    monthlyAmount: 150000,
    share: 8,
    rangeText: "11만~19만원",
    sourceType: "estimate",
    note: "실손보험, 약값, 비정기 의료비 예비비",
  },
  {
    category: "leisure",
    label: "여가·자기계발",
    monthlyAmount: 140000,
    share: 7,
    rangeText: "9만~22만원",
    sourceType: "simulation",
    note: "운동, 모임, 강의, 취미비",
  },
  {
    category: "savingBuffer",
    label: "비상비·완충",
    monthlyAmount: 50000,
    share: 3,
    rangeText: "0~9만원",
    sourceType: "simulation",
    note: "월별 변동비를 흡수하는 완충 예산",
  },
];

export const SHLC_BUDGET_SCENARIOS: BudgetScenario[] = [
  {
    type: "saving",
    label: "절약형",
    monthlyTotal: 1450000,
    housing: 620000,
    food: 360000,
    telecomSubscription: 90000,
    transport: 90000,
    insuranceMedical: 110000,
    leisure: 90000,
    buffer: 90000,
    description: "고정비를 낮추고 배달·구독·여가 지출을 엄격히 관리하는 예산입니다.",
  },
  {
    type: "average",
    label: "평균형",
    monthlyTotal: 1900000,
    housing: 780000,
    food: 520000,
    telecomSubscription: 130000,
    transport: 130000,
    insuranceMedical: 150000,
    leisure: 140000,
    buffer: 50000,
    description: "월세와 식비가 전체 지출을 좌우하는 일반적인 1인 가구 예산입니다.",
  },
  {
    type: "comfortable",
    label: "여유형",
    monthlyTotal: 2550000,
    housing: 1050000,
    food: 720000,
    telecomSubscription: 180000,
    transport: 190000,
    insuranceMedical: 190000,
    leisure: 220000,
    buffer: 0,
    description: "입지·외식·구독·여가 선택지가 넓은 대신 저축 여력이 줄어드는 예산입니다.",
  },
];

export const SHLC_AGE_MATRIX: AgeMatrixRow[] = [
  {
    ageGroup: "20s",
    label: "20대",
    mainPressure: "월세·초기 정착비",
    typicalMonthlyRange: "130만~210만원",
    savingFocus: "배달비, 통신비, 구독료",
    riskNote: "소득 대비 고정비가 높으면 저축 시작이 늦어질 수 있습니다.",
  },
  {
    ageGroup: "30s",
    label: "30대",
    mainPressure: "주거비·보험·자기계발",
    typicalMonthlyRange: "160만~250만원",
    savingFocus: "보험료, 외식비, 차량·택시비",
    riskNote: "소득이 늘어도 생활수준이 같이 올라가면 여유자금이 남지 않습니다.",
  },
  {
    ageGroup: "40s",
    label: "40대",
    mainPressure: "건강·차량·부모 지원",
    typicalMonthlyRange: "180만~280만원",
    savingFocus: "보험 리밸런싱, 자가용 유지비, 비정기 지출",
    riskNote: "의료비와 가족 지원 지출은 변동성이 커 별도 완충 예산이 필요합니다.",
  },
];

export const SHLC_REGION_HOUSING: RegionHousingCost[] = [
  {
    region: "seoul",
    label: "서울",
    rentRange: "70만~100만원",
    managementFeeRange: "12만~20만원",
    totalHousingRange: "85만~125만원",
    note: "역세권·신축·보증금 조건에 따라 상단이 크게 열립니다.",
  },
  {
    region: "capital",
    label: "수도권",
    rentRange: "55만~80만원",
    managementFeeRange: "10만~17만원",
    totalHousingRange: "68만~100만원",
    note: "서울 접근성이 좋을수록 서울 하단과 겹칩니다.",
  },
  {
    region: "metro",
    label: "광역시",
    rentRange: "42만~65만원",
    managementFeeRange: "9만~15만원",
    totalHousingRange: "55만~82만원",
    note: "도심·대학가·산업단지 주변은 평균보다 높을 수 있습니다.",
  },
  {
    region: "local",
    label: "지방 중소도시",
    rentRange: "32만~50만원",
    managementFeeRange: "8만~13만원",
    totalHousingRange: "42만~65만원",
    note: "주거비는 낮지만 차량 의존도가 높으면 교통비가 늘 수 있습니다.",
  },
];

export const SHLC_SAVING_ACTIONS: SavingAction[] = [
  {
    id: "delivery-once",
    label: "배달 횟수 주 1회 줄이기",
    category: "food",
    monthlySaving: 60000,
    difficulty: "normal",
    description: "1회 1만5천원 절감, 월 4회 기준",
  },
  {
    id: "mvno",
    label: "알뜰폰 또는 저가 요금제로 전환",
    category: "telecom",
    monthlySaving: 30000,
    difficulty: "easy",
    description: "데이터 사용량에 맞춰 요금제를 낮추는 방식",
  },
  {
    id: "subscription",
    label: "OTT·멤버십 2개 정리",
    category: "subscription",
    monthlySaving: 25000,
    difficulty: "easy",
    description: "중복 구독과 거의 쓰지 않는 멤버십 점검",
  },
  {
    id: "taxi",
    label: "택시비 월 한도 설정",
    category: "transport",
    monthlySaving: 40000,
    difficulty: "normal",
    description: "심야·우천 택시를 별도 예산으로 관리",
  },
  {
    id: "meal-plan",
    label: "식재료 3일 단위 구매",
    category: "food",
    monthlySaving: 35000,
    difficulty: "normal",
    description: "폐기율을 낮춰 장보기 비용을 줄이는 방법",
  },
  {
    id: "insurance-check",
    label: "보험료 연 1회 점검",
    category: "insuranceMedical",
    monthlySaving: 30000,
    difficulty: "hard",
    description: "중복 보장과 과한 특약을 확인",
  },
  {
    id: "management-fee",
    label: "계약 전 관리비 항목 확인",
    category: "housing",
    monthlySaving: 50000,
    difficulty: "hard",
    description: "월세보다 빠르게 놓치는 고정비를 줄임",
  },
  {
    id: "bulk-buy",
    label: "생활용품 대량구매 전 월 사용량 확인",
    category: "householdGoods",
    monthlySaving: 20000,
    difficulty: "easy",
    description: "쌓아두는 소비를 줄이는 습관",
  },
  {
    id: "buffer",
    label: "비상비를 생활비 계좌와 분리",
    category: "savingBuffer",
    monthlySaving: 30000,
    difficulty: "normal",
    description: "남는 돈이 아니라 먼저 떼어두는 방식",
  },
  {
    id: "auto-saving",
    label: "절약액 자동이체",
    category: "savingBuffer",
    monthlySaving: 50000,
    difficulty: "easy",
    description: "아낀 금액을 목표 통장으로 바로 이동",
  },
];

export const SHLC_FAQ: FaqItem[] = [
  {
    question: "2026년 1인 가구 월 생활비는 얼마로 보면 되나요?",
    answer: "주거 형태와 지역에 따라 차이가 크지만, 월세를 포함하면 절약형·평균형·여유형 예산을 나눠 보는 것이 현실적입니다. 이 페이지의 시나리오 수치는 예산 점검용 추정값으로 표시합니다.",
  },
  {
    question: "1인 가구 생활비에서 가장 먼저 줄일 항목은 무엇인가요?",
    answer: "대부분은 주거비와 식비의 영향이 큽니다. 다만 단기간 조정은 배달비, 외식비, 구독료, 통신요금처럼 매달 반복되는 항목부터 확인하는 편이 쉽습니다.",
  },
  {
    question: "월세가 높으면 식비를 얼마나 줄여야 하나요?",
    answer: "월 소득 대비 주거비 비율이 높을수록 배달·외식 빈도와 구독료를 먼저 점검해야 합니다. 식비를 무리하게 낮추기보다 장보기와 배달의 균형을 조정하는 방식이 지속 가능성이 높습니다.",
  },
  {
    question: "자가용이 있는 1인 가구는 예산을 따로 봐야 하나요?",
    answer: "그렇습니다. 유류비, 보험료, 정비비, 주차비가 월별로 나뉘어 발생하므로 대중교통 중심 예산과 별도로 비교해야 합니다.",
  },
  {
    question: "자취를 시작하기 전 최소 얼마를 준비해야 하나요?",
    answer: "월 생활비 외에도 보증금, 이사비, 가전·가구, 첫 달 관리비, 비상비가 필요합니다. 이 리포트는 매월 반복되는 생활비 중심이며 초기 독립 비용은 별도로 계산해야 합니다.",
  },
];

export const SHLC_RELATED_LINKS: RelatedLink[] = [
  {
    label: "배달 vs 직접 요리 비용 계산기",
    href: "/tools/delivery-vs-cooking-cost/",
    description: "배달과 직접 요리의 월간·연간 비용 차이를 계산합니다.",
  },
  {
    label: "가구소득 계산기",
    href: "/tools/household-income/",
    description: "월 소득 대비 생활비 비중을 확인합니다.",
  },
  {
    label: "연봉 실수령 계산기",
    href: "/tools/salary/",
    description: "실수령 기준으로 생활비 예산을 다시 설계합니다.",
  },
  {
    label: "실손보험 환급액 계산기",
    href: "/tools/silson-insurance-refund-calculator/",
    description: "병원비 영수증 기준 예상 환급액을 계산합니다.",
  },
  {
    label: "대출 갈아타기 계산기",
    href: "/tools/loan-refinancing-calculator/",
    description: "금리 변경 시 월 납입금과 총 이자 절감액을 비교합니다.",
  },
];

export const SHLC_SOURCE_LINKS: SourceInfo[] = [
  {
    label: "가계동향조사",
    organization: "통계청",
    url: "https://kostat.go.kr/",
    sourceType: "official",
    asOf: "최신 공개 자료",
    note: "가구 소비지출 구조와 품목별 지출 참고",
  },
  {
    label: "인구총조사·장래가구추계",
    organization: "KOSIS 국가통계포털",
    url: "https://kosis.kr/",
    sourceType: "official",
    asOf: "최신 공개 자료",
    note: "1인 가구 규모와 비중 확인",
  },
  {
    label: "1인 가구 금융·생활 리포트",
    organization: "KB금융지주 경영연구소",
    url: "https://www.kbfg.com/",
    sourceType: "private",
    asOf: "최신 공개 자료",
    note: "체감 생활비, 금융행태, 저축 성향 참고",
  },
  {
    label: "실거래가 공개시스템",
    organization: "국토교통부",
    url: "https://rt.molit.go.kr/",
    sourceType: "official",
    asOf: "최신 공개 자료",
    note: "지역별 임대차 시세 참고",
  },
];

export const formatWon = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;
export const formatManwon = (value: number) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
