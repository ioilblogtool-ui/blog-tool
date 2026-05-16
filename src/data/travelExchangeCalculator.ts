export type CurrencyCode = "JPY" | "USD" | "EUR" | "THB" | "VND" | "SGD" | "TWD" | "PHP";
export type ExchangeMethod = "TRAVEL_CARD" | "BANK_APP" | "BANK_BRANCH" | "AIRPORT" | "LOCAL_ATM";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  unit: 1 | 100;
  defaultRate: number;
}

export interface CountryPreset {
  country: string;
  flag: string;
  currency: CurrencyCode;
  unit: 1 | 100;
  defaultRate: number;
  tip: string;
}

export interface MethodConfig {
  method: ExchangeMethod;
  label: string;
  spreadRate: number;
  preferentialRate: number;
  fixedFee: number;
  cardFeeRate: number;
  description: string;
}

// ─── 통화 목록 ─────────────────────────────────────────────
export const CURRENCIES: CurrencyInfo[] = [
  { code: "JPY", label: "일본 엔화 (JPY)",        unit: 100, defaultRate: 900  },
  { code: "USD", label: "미국 달러 (USD)",         unit: 1,   defaultRate: 1380 },
  { code: "EUR", label: "유로 (EUR)",              unit: 1,   defaultRate: 1500 },
  { code: "THB", label: "태국 바트 (THB)",         unit: 1,   defaultRate: 38   },
  { code: "VND", label: "베트남 동 (VND, 100동)",  unit: 100, defaultRate: 5.5  },
  { code: "SGD", label: "싱가포르 달러 (SGD)",     unit: 1,   defaultRate: 1030 },
  { code: "TWD", label: "대만 달러 (TWD)",         unit: 1,   defaultRate: 43   },
  { code: "PHP", label: "필리핀 페소 (PHP)",       unit: 1,   defaultRate: 24   },
];

// ─── 국가 프리셋 ────────────────────────────────────────────
export const COUNTRY_PRESETS: CountryPreset[] = [
  {
    country: "일본", flag: "🇯🇵", currency: "JPY", unit: 100, defaultRate: 900,
    tip: "대부분의 대형 매장·교통·편의점은 카드 가능. 소규모 식당·전통 시장은 현금 선호. 트래블카드 70% + 엔화 현금 30% 조합 추천.",
  },
  {
    country: "미국", flag: "🇺🇸", currency: "USD", unit: 1, defaultRate: 1380,
    tip: "카드 결제 환경 최상. 트래블카드·신용카드 중심으로 쓰고 팁 문화 대비 소액 현금만 준비. ATM surcharge 주의.",
  },
  {
    country: "유럽", flag: "🇪🇺", currency: "EUR", unit: 1, defaultRate: 1500,
    tip: "카드 결제 인프라 잘 갖춰짐. DCC 원화결제 거절 필수. 소도시·재래시장은 현금 일부 필요. 트래블카드 80% + 현금 20% 추천.",
  },
  {
    country: "태국", flag: "🇹🇭", currency: "THB", unit: 1, defaultRate: 38,
    tip: "현금 사용 비중 높음. ATM 고정 수수료(약 220밧) 발생 가능. 현금 50% + ATM 30% + 카드 20% 조합 현실적.",
  },
  {
    country: "베트남", flag: "🇻🇳", currency: "VND", unit: 100, defaultRate: 5.5,
    tip: "VND 국내 환전 어렵고 단위가 큼. USD 환전 후 현지에서 VND로 교환하는 방식이 일반적. ATM 한도와 수수료 사전 확인 필요.",
  },
  {
    country: "싱가포르", flag: "🇸🇬", currency: "SGD", unit: 1, defaultRate: 1030,
    tip: "카드·트래블카드 결제 환경 최상. 현금 필요성 낮음. 트래블카드 중심으로 결제하고 소액 현금만 보조로 준비.",
  },
];

// ─── 환전 방법별 기본 설정 ──────────────────────────────────
export const METHOD_CONFIGS: MethodConfig[] = [
  {
    method: "TRAVEL_CARD",
    label: "트래블카드",
    spreadRate: 1.75, preferentialRate: 100, fixedFee: 0, cardFeeRate: 0,
    description: "주요 통화 환전 수수료 0%, 해외 결제 수수료 없음 (상품별 조건 확인)",
  },
  {
    method: "BANK_APP",
    label: "은행 앱 환전",
    spreadRate: 1.75, preferentialRate: 90, fixedFee: 0, cardFeeRate: 0,
    description: "우대율 90% 적용 시 실효 스프레드 약 0.175%",
  },
  {
    method: "BANK_BRANCH",
    label: "은행 창구 환전",
    spreadRate: 1.75, preferentialRate: 50, fixedFee: 0, cardFeeRate: 0,
    description: "우대율 50% 적용 시 실효 스프레드 약 0.875%",
  },
  {
    method: "AIRPORT",
    label: "공항 환전",
    spreadRate: 1.75, preferentialRate: 0, fixedFee: 0, cardFeeRate: 0,
    description: "우대율 없음. 실효 스프레드 1.75% (가장 불리한 조건)",
  },
  {
    method: "LOCAL_ATM",
    label: "현지 ATM 인출",
    spreadRate: 1.75, preferentialRate: 90, fixedFee: 3000, cardFeeRate: 0,
    description: "트래블카드 기준 + 현지 ATM 사업자 수수료 약 3,000원 추정",
  },
];

// ─── FAQ ────────────────────────────────────────────────────
export const TEC_FAQ = [
  {
    question: "환전 방법별 수수료를 직접 수정할 수 있나요?",
    answer: "네. 입력 패널 하단 '상세 설정'에서 각 방법별 우대율과 고정 수수료를 직접 입력할 수 있습니다. 본인이 거래하는 은행의 실제 우대율이나 특정 트래블카드의 조건을 입력하면 더 정확한 비교가 가능합니다.",
  },
  {
    question: "기준 환율은 어떻게 확인하나요?",
    answer: "네이버에서 '엔화 환율'처럼 통화명을 검색하면 현재 환율이 나옵니다. 매매기준율(중간 환율)을 입력하면 됩니다. '현찰 살 때 환율'은 이미 스프레드가 반영된 환율이므로, 가능하면 매매기준율을 입력하고 수수료 설정으로 스프레드를 조정하는 것이 더 정확합니다.",
  },
  {
    question: "일본 엔화는 왜 100엔 단위로 계산하나요?",
    answer: "일본 엔화(JPY)는 국내 은행에서 100엔 단위로 고시하는 것이 관행입니다. 예를 들어 '100엔=900원'으로 표시되므로, 이 계산기도 JPY를 100엔 단위로 처리합니다. 계산기에 '900'을 입력하면 100엔=900원을 의미합니다.",
  },
  {
    question: "베트남 동(VND)은 어떻게 입력하나요?",
    answer: "VND는 단위가 매우 커서 국내 환전이 어렵습니다. 이 계산기에서 VND를 선택하면 100동 단위로 계산합니다. 베트남 여행에서는 USD를 국내에서 환전한 뒤 현지에서 VND로 바꾸는 방식이 일반적입니다.",
  },
  {
    question: "공항 환전은 항상 손해인가요?",
    answer: "소액 긴급 환전 외에는 불리한 경우가 많습니다. 다만 일부 공항 환전소에서 이벤트성 우대율을 제공하거나, 카드사 계열 환전소에서 제휴 우대가 있을 수 있습니다. 출국 전에 미리 환전하는 것이 더 유리하지만, 급하게 필요한 소액은 공항 환전도 선택지입니다.",
  },
  {
    question: "ATM 인출 시 '수수료 없음'을 선택하면 정말 0원인가요?",
    answer: "카드사·은행의 해외 이용 수수료가 면제된다는 의미이며, 현지 ATM 운영사가 부과하는 수수료는 별도로 발생할 수 있습니다. ATM 화면에서 수수료 안내가 나오면 확인 후 결정하세요. 이 계산기의 '현지 ATM' 항목에는 약 3,000원의 ATM 사업자 수수료가 기본 포함되어 있습니다.",
  },
  {
    question: "트래블카드와 신용카드를 함께 쓰는 게 좋은가요?",
    answer: "네. 트래블카드를 주 결제 수단으로 사용하고, 신용카드를 백업으로 준비하는 것이 안전합니다. 트래블카드 앱 장애, 충전 한도 초과, 분실 등 예상치 못한 상황에 대비할 수 있습니다. 또한 신용카드는 렌터카·호텔 보증금에 더 유리할 수 있습니다.",
  },
  {
    question: "여행 후 남은 외화는 어떻게 하나요?",
    answer: "트래블카드 외화 잔액은 원화로 재환전하거나 다음 여행에 사용할 수 있습니다. 재환전 시 '현찰 팔 때 환율'이 적용되어 수수료가 발생할 수 있습니다. 현금으로 남은 외화는 은행 창구에서 재환전하거나 다음 여행을 위해 보관하는 것이 일반적입니다.",
  },
];

// ─── 관련 링크 ──────────────────────────────────────────────
export const TEC_RELATED_LINKS = [
  { href: "/reports/travel-card-vs-exchange-2026/", label: "트래블카드 vs 환전 비교 리포트" },
  { href: "/tools/travel-savings-goal-calculator/", label: "여행 적금 목표 계산기" },
  { href: "/tools/travel-expense-split/", label: "여행 경비 분담 계산기" },
  { href: "/tools/flight-cheapest-timing-calculator/", label: "항공권 최저가 시기 계산기" },
  { href: "/reports/travel-peak-offpeak-cost-comparison-2026/", label: "성수기 vs 비수기 여행비 비교" },
];
