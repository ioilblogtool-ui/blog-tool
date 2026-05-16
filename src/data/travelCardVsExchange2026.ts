export interface TravelCardComparison {
  id: string;
  name: string;
  provider: string;
  structure: string;
  supportedCurrencies: string;
  exchangeFeeSummary: string;
  overseasPaymentFeeSummary: string;
  atmFeeSummary: string;
  pros: string[];
  cautions: string[];
  bestFor: string;
  sourceUrl: string;
  updatedAt: string;
}

export interface TravelPaymentMethod {
  method: string;
  label: string;
  exchangeFeeNote: string;
  pros: string[];
  cons: string[];
  bestCase: string;
}

export interface CountryTravelMatrix {
  country: string;
  currency: string;
  cardUsageLevel: "very_high" | "high" | "medium" | "low";
  cashNeedLevel: "high" | "medium" | "low";
  recommendedCombination: string;
  tips: string;
}

export interface SimulationRow {
  method: string;
  assumption: string;
  foreignAmount: number;   // 엔화
  costDiff: number;        // 손해액 (원화), 0이면 기준
  isBest: boolean;
  isWorst: boolean;
}

export interface TrendItem {
  trend: string;
  desc: string;
}

// ─── 트래블카드 5종 비교 ─────────────────────────────────────
export const TRAVEL_CARDS: TravelCardComparison[] = [
  {
    id: "travelwallet",
    name: "트래블월렛",
    provider: "트래블월렛",
    structure: "외화 충전형 카드",
    supportedCurrencies: "46개 통화",
    exchangeFeeSummary: "USD·JPY·EUR 등 주요 통화 환전 수수료 0% 안내",
    overseasPaymentFeeSummary: "해외 결제 수수료 없음 안내",
    atmFeeSummary: "통화·한도별 조건 확인 필요",
    pros: ["통화 다양성 최상", "간편 앱 충전·충전 즉시 사용", "주요 통화 환전 무료"],
    cautions: ["일부 통화·ATM 조건 별도 확인", "충전·출금 한도 사전 확인"],
    bestFor: "다양한 통화 국가 여행자, 트래블카드 입문자",
    sourceUrl: "https://www.travel-wallet.com",
    updatedAt: "2026-05",
  },
  {
    id: "travellog",
    name: "트래블로그",
    provider: "하나카드",
    structure: "외화 하나머니 기반",
    supportedCurrencies: "58종 통화",
    exchangeFeeSummary: "2026년 12월 31일까지 58종 통화 환전·충전 수수료 면제",
    overseasPaymentFeeSummary: "해외 가맹점 이용수수료 면제",
    atmFeeSummary: "해외 ATM 인출 수수료 면제 (현지 ATM 사업자 수수료 별도)",
    pros: ["지원 통화 수 업계 최다", "하나머니 생태계 연계", "프로모션 수수료 면제"],
    cautions: ["프로모션 종료일 확인 필수", "현지 ATM 사업자 수수료 별도 발생 가능"],
    bestFor: "하나은행 거래 고객, 다양한 통화 필요 여행자",
    sourceUrl: "https://app.hanamembership.com",
    updatedAt: "2026-05",
  },
  {
    id: "toss",
    name: "토스뱅크 외화체크카드",
    provider: "토스뱅크",
    structure: "외화통장 연동",
    supportedCurrencies: "17개 외화",
    exchangeFeeSummary: "살 때·팔 때 수수료 무료",
    overseasPaymentFeeSummary: "조건별 혜택 확인 필요",
    atmFeeSummary: "월 5회 또는 $700까지 면제 (현지 ATM 사업자 수수료 별도)",
    pros: ["외화통장 기반 재환전 편의", "환전 수수료 무료", "앱 UI 간편"],
    cautions: ["ATM 면제 한도 초과 시 수수료 발생", "지원 통화 수 상대적 적음"],
    bestFor: "토스뱅크 이용자, USD·EUR 중심 여행자",
    sourceUrl: "https://www.tossbank.com",
    updatedAt: "2026-05",
  },
  {
    id: "shinhan",
    name: "신한 SOL트래블 체크",
    provider: "신한카드",
    structure: "외화예금 연동 체크카드",
    supportedCurrencies: "30종 통화",
    exchangeFeeSummary: "환전 수수료 면제",
    overseasPaymentFeeSummary: "국제브랜드 수수료 1% + 해외서비스 수수료 0.2% 면제",
    atmFeeSummary: "건당 $3 및 국제브랜드 수수료 1% 면제 (현지 ATM 사업자 수수료 별도)",
    pros: ["공항 라운지 연 2회 무료", "교통 할인 등 부가 혜택", "해외 결제 수수료 면제"],
    cautions: ["전월 실적·상품 조건 사전 확인", "현지 ATM 사업자 수수료 별도"],
    bestFor: "부가 혜택 선호자, 신한은행 거래 고객",
    sourceUrl: "https://www.shinhancard.com",
    updatedAt: "2026-05",
  },
];

// ─── 환전 방법별 비교 ────────────────────────────────────────
export const PAYMENT_METHODS: TravelPaymentMethod[] = [
  {
    method: "TRAVEL_CARD",
    label: "트래블카드",
    exchangeFeeNote: "주요 통화 0% (상품별 조건 확인)",
    pros: ["낮은 환전 수수료", "앱에서 즉시 충전", "분실 시 앱 잠금"],
    cons: ["충전 한도 확인 필요", "현지 ATM 사업자 수수료 별도"],
    bestCase: "카드 결제 비중이 높은 일본·미국·유럽·싱가포르",
  },
  {
    method: "BANK_APP",
    label: "은행 앱 환전",
    exchangeFeeNote: "우대율 90% 수준 (실효 스프레드 약 0.175%)",
    pros: ["높은 환율 우대율", "사전 준비 가능", "예측 가능한 수수료"],
    cons: ["수령 지점·시간 제한", "현금 보관·분실 위험"],
    bestCase: "큰 금액 환전, 고령자 동반 여행",
  },
  {
    method: "BANK_BRANCH",
    label: "은행 창구 환전",
    exchangeFeeNote: "우대율 50% 수준 (실효 스프레드 약 0.875%)",
    pros: ["상담 가능", "현금 바로 수령", "특수 통화 환전 가능"],
    cons: ["앱보다 우대율 낮음", "영업시간 제한"],
    bestCase: "상담이 필요한 경우, 특수·소형 통화 환전",
  },
  {
    method: "AIRPORT",
    label: "공항 환전",
    exchangeFeeNote: "우대율 0~30% (실효 스프레드 1.4~1.75%)",
    pros: ["출국 직전 가능", "즉시 현금 수령"],
    cons: ["수수료 가장 불리", "혼잡 시 대기"],
    bestCase: "소액 긴급 환전만 권장",
  },
  {
    method: "LOCAL_ATM",
    label: "현지 ATM 인출",
    exchangeFeeNote: "카드사 수수료 + 현지 ATM 사업자 수수료 별도",
    pros: ["필요할 때 인출 가능", "현금 분산 관리"],
    cons: ["ATM 사업자 수수료 발생 가능", "1회 인출 한도 제한"],
    bestCase: "장기 여행, 현금 사용 많은 동남아",
  },
];

// ─── 국가별 환전 매트릭스 ────────────────────────────────────
export const COUNTRY_MATRIX: CountryTravelMatrix[] = [
  {
    country: "일본", currency: "JPY",
    cardUsageLevel: "high", cashNeedLevel: "medium",
    recommendedCombination: "트래블카드 70% + 엔화 현금 30%",
    tips: "편의점·소규모 식당에서 현금 필요. 스이카·IC카드 연동 트래블카드 확인",
  },
  {
    country: "미국", currency: "USD",
    cardUsageLevel: "very_high", cashNeedLevel: "low",
    recommendedCombination: "신용카드·트래블카드 90% + 현금 10%",
    tips: "ATM surcharge 주의. 팁 문화로 소액 현금 일부 필요",
  },
  {
    country: "유럽", currency: "EUR",
    cardUsageLevel: "high", cashNeedLevel: "low",
    recommendedCombination: "트래블카드 80% + 현금 20%",
    tips: "DCC 원화결제 거절 필수. 소도시·재래시장은 현금 선호",
  },
  {
    country: "태국", currency: "THB",
    cardUsageLevel: "medium", cashNeedLevel: "high",
    recommendedCombination: "현금 50% + ATM 30% + 카드 20%",
    tips: "ATM 고정 수수료(약 220밧) 발생 가능. 방콕 대형몰은 카드 가능",
  },
  {
    country: "베트남", currency: "VND",
    cardUsageLevel: "medium", cashNeedLevel: "high",
    recommendedCombination: "달러 환전 후 현지 환전 + ATM 보조",
    tips: "VND 국내 환전 어렵고 단위 큼. ATM 한도 및 수수료 사전 확인 필수",
  },
  {
    country: "싱가포르", currency: "SGD",
    cardUsageLevel: "very_high", cashNeedLevel: "low",
    recommendedCombination: "카드·트래블카드 중심",
    tips: "카드 인프라 매우 잘 갖춰짐. 현금 필요성 낮음",
  },
];

// ─── 100만 원 환전 시뮬레이션 ───────────────────────────────
export const SIMULATION_ROWS: SimulationRow[] = [
  { method: "트래블카드",   assumption: "수수료 0%",                   foreignAmount: 111111, costDiff: 0,     isBest: true,  isWorst: false },
  { method: "은행 앱 환전", assumption: "스프레드 1.75%, 우대 90%",   foreignAmount: 110916, costDiff: 1755,  isBest: false, isWorst: false },
  { method: "현지 ATM",    assumption: "카드사 수수료 면제 + ATM 3,000원", foreignAmount: 110778, costDiff: 3000, isBest: false, isWorst: false },
  { method: "은행 창구",   assumption: "스프레드 1.75%, 우대 50%",   foreignAmount: 110147, costDiff: 8675,  isBest: false, isWorst: false },
  { method: "공항 환전",   assumption: "스프레드 1.75%, 우대 0%",    foreignAmount: 109199, costDiff: 17206, isBest: false, isWorst: true  },
];

// ─── 출국 전 체크리스트 ─────────────────────────────────────
export const CHECKLIST = [
  "여행 국가의 카드 결제 가능 비중 확인",
  "현금이 꼭 필요한 장소(소규모 식당·재래시장·교통) 확인",
  "트래블카드 지원 통화 확인",
  "환전 수수료 무료 통화인지 확인",
  "ATM 수수료 면제 한도 확인 (카드사 면제 ≠ 현지 사업자 면제)",
  "카드 분실 시 앱 잠금 가능 여부 확인",
  "DCC 원화결제 거절 방법 숙지",
  "신용카드 백업 1장 준비",
  "소액 현금 준비",
  "출국 당일 환율과 기준 환율 차이 확인",
];

// ─── 2026 트렌드 ────────────────────────────────────────────
export const TRENDS_2026: TrendItem[] = [
  { trend: "무료 환전 경쟁 확대", desc: "주요 통화뿐 아니라 지원 통화 수 확대 경쟁" },
  { trend: "ATM 수수료 면제 경쟁", desc: "카드사 수수료 면제 + 조건부 한도 운영 일반화" },
  { trend: "외화통장 연동 강화", desc: "카드가 외화 입출금 계좌와 직접 연결되는 구조" },
  { trend: "부가 혜택 경쟁", desc: "공항 라운지, 교통 할인, 편의점 할인 확대" },
  { trend: "조건부 혜택 증가", desc: "월 한도·횟수 제한·프로모션 기간 확인 중요도 증가" },
  { trend: "현지 ATM 수수료 주의", desc: "카드사 면제에도 현지 운영사 수수료 별도 가능" },
];

// ─── 핵심 요약 카드 ─────────────────────────────────────────
export const SUMMARY_CARDS = [
  { title: "수수료 가장 낮은 방법", body: "트래블카드 — 주요 통화 환전 수수료 0%, 해외 결제 수수료 없음" },
  { title: "수수료 가장 높을 수 있는 방법", body: "공항 환전 + DCC 원화결제 조합 — 우대 없음 + 가맹점 환율 불리" },
  { title: "초보자 추천 조합", body: "트래블카드(주) + 소액 현금 + 신용카드(백업)" },
  { title: "주의할 숨은 비용", body: "현지 ATM 사업자 수수료 · DCC 원화결제 수수료 · 재환전 수수료" },
];

// ─── FAQ ─────────────────────────────────────────────────────
export const TCVE_FAQ = [
  {
    question: "트래블카드는 무조건 환전보다 이득인가요?",
    answer: "주요 통화(USD, JPY, EUR)에서는 환전 수수료 무료 조건이면 유리합니다. 하지만 ATM 인출 수수료, 재환전 수수료, 지원 통화 한도, 충전 한도 등을 함께 확인해야 합니다. 현금 사용이 많은 동남아 여행에서는 현지 ATM 사업자 수수료가 별도 발생할 수 있습니다.",
  },
  {
    question: "일본 여행에서 트래블카드만 들고 가도 되나요?",
    answer: "대형 마트, 편의점, 체인 식당, 교통에서는 대부분 카드 결제가 가능하지만, 소규모 식당, 재래시장, 일부 신사·관광지, 자동판매기는 현금만 받는 경우가 있습니다. 트래블카드 70~80% + 엔화 현금 20~30% 조합을 권장합니다.",
  },
  {
    question: "공항 환전이 비싼 이유는 무엇인가요?",
    answer: "공항 환전은 높은 임대료와 접근성 프리미엄이 환율 우대율 축소로 반영됩니다. 은행 앱 환전이 우대율 90% 수준인 것과 달리, 공항 환전소는 우대율이 0~30%에 그치는 경우가 많아 같은 금액을 환전해도 실수령 외화가 적습니다. 긴급 소액 환전 외에는 피하는 것이 좋습니다.",
  },
  {
    question: "해외 ATM 수수료 무료라고 했는데 왜 수수료가 나오나요?",
    answer: "카드사(또는 은행)가 부과하는 수수료는 면제되지만, 현지 ATM 운영사가 부과하는 수수료는 별도로 발생합니다. 예를 들어 태국은 현지 ATM 출금 시 약 220밧, 일본 우체국 ATM은 110엔 수준의 수수료가 붙을 수 있습니다. ATM 화면에서 수수료 안내가 나오면 확인 후 결정하세요.",
  },
  {
    question: "DCC 원화결제를 피하는 방법이 있나요?",
    answer: "결제 시 화면에 KRW와 현지 통화 선택지가 나오면 반드시 현지 통화를 선택하세요. 일부 단말기는 기본값이 원화결제로 설정되어 있어 확인 없이 승인하면 원화결제가 될 수 있습니다. 카드에 따라 DCC 자동 거절 기능을 앱에서 설정할 수 있습니다.",
  },
  {
    question: "환율 우대 90%는 무슨 뜻인가요?",
    answer: "은행이 붙이는 환전 수수료(스프레드) 중 90%를 할인해준다는 의미입니다. 기본 스프레드가 1.75%라면 우대 90% 적용 시 실제 수수료는 0.175%가 됩니다. 환율이 90% 싸진다는 의미가 아닙니다. 우대율이 100%인 트래블카드는 스프레드 자체가 없는 것에 가깝습니다.",
  },
  {
    question: "트래블카드를 분실하면 어떻게 하나요?",
    answer: "대부분의 트래블카드는 앱에서 즉시 카드 잠금이 가능합니다. 분실을 인지하는 즉시 앱에서 카드 사용을 정지하고 고객센터에 신고하세요. 해외에서 분실한 경우 현지 재발급은 어려우므로 신용카드 1장을 백업으로 함께 준비하는 것이 안전합니다.",
  },
  {
    question: "2026년에 달라진 트래블카드 혜택이 있나요?",
    answer: "지원 통화 수 확대, ATM 수수료 면제 조건 개선, 공항 라운지 혜택 경쟁 등이 2026년 트렌드입니다. 트래블로그는 58종 통화 수수료 면제를 2026년 말까지 운영 중이며, 각 카드사들이 해외 결제·환전 혜택을 강화하고 있습니다. 프로모션 기간과 조건이 수시로 변경되므로 발급 전 최신 공지를 확인하세요.",
  },
];

// ─── 관련 링크 ──────────────────────────────────────────────
export const TCVE_RELATED_LINKS = [
  { href: "/tools/travel-exchange-calculator/",              label: "여행 환전 손익 계산기" },
  { href: "/tools/travel-savings-goal-calculator/",          label: "여행 적금 목표 계산기" },
  { href: "/tools/travel-expense-split/",                    label: "여행 경비 분담 계산기" },
  { href: "/reports/travel-peak-offpeak-cost-comparison-2026/", label: "성수기 vs 비수기 여행비 비교" },
  { href: "/tools/flight-cheapest-timing-calculator/",       label: "항공권 최저가 시기 계산기" },
];

// ─── META ────────────────────────────────────────────────────
export const TCVE_META = {
  slug: "travel-card-vs-exchange-2026",
  title: "트래블카드 vs 환전 vs ATM 실비용 비교 2026",
  description:
    "트래블월렛, 트래블로그, 토스, 신한 SOL트래블 등 주요 트래블카드와 은행 환전, 공항 환전, 현지 ATM의 실제 비용을 비교합니다. 일본·미국·유럽·동남아 여행 전 최적 환전 방법을 확인하세요.",
  updatedAt: "2026-05",
};
