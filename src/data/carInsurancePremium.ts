export const CIP_BASE_PREMIUM = 850000;

export const CIP_AGE_FACTOR: Record<string, number> = {
  "20-24": 2.20,
  "25-29": 1.55,
  "30-34": 1.20,
  "35-39": 1.00,
  "40-49": 0.92,
  "50-59": 0.95,
  "60+":   1.10,
};

export const CIP_CAREER_FACTOR: Record<string, number> = {
  "0-1":  1.40,
  "2-3":  1.20,
  "4-5":  1.10,
  "6-9":  1.00,
  "10+":  0.93,
};

export const CIP_ACCIDENT_FACTOR: Record<string, number> = {
  none: 1.00,
  one:  1.30,
  two:  1.65,
};

export const CIP_PRICE_FACTOR: Record<string, number> = {
  "1000": 0.72,
  "2000": 0.88,
  "3000": 1.00,
  "4000": 1.14,
  "5000": 1.28,
  "6000": 1.42,
  "8000": 1.60,
};

export const CIP_AGE_CAR_FACTOR: Record<string, number> = {
  "new":  1.15,
  "1-3":  1.00,
  "4-6":  0.87,
  "7-10": 0.72,
  "11+":  0.60,
};

export const CIP_DRIVER_FACTOR: Record<string, number> = {
  self:   0.88,
  couple: 1.00,
  family: 1.15,
  anyone: 1.35,
};

export const CIP_COVERAGE_FACTOR: Record<string, number> = {
  basic: 0.55,
  full:  1.00,
};

export const CIP_DISCOUNTS = [
  {
    id: "child_infant",
    label: "영유아 자녀 있음 (만 6세 이하)",
    icon: "👶",
    rate: 0.06,
    desc: "삼성화재·DB손보·KB손보 등 주요 보험사 5~7% 할인",
    category: "family",
    highlight: true,
  },
  {
    id: "child_multi",
    label: "자녀 2명 이상 (다자녀)",
    icon: "👨‍👩‍👧‍👦",
    rate: 0.08,
    desc: "다자녀 가구 할인 — 대부분 보험사 7~10%",
    category: "family",
    highlight: true,
  },
  {
    id: "birth",
    label: "당해연도 출산",
    icon: "🍼",
    rate: 0.05,
    desc: "출산 축하 할인 (일부 보험사, 증빙 필요)",
    category: "family",
    highlight: true,
  },
  {
    id: "pregnant",
    label: "임산부",
    icon: "🤰",
    rate: 0.04,
    desc: "임신 중 가입 시 할인 (일부 보험사)",
    category: "family",
    highlight: true,
  },
  {
    id: "blackbox",
    label: "블랙박스 장착",
    icon: "📷",
    rate: 0.05,
    desc: "전·후방 블랙박스 장착 시 3~5% 할인",
    category: "device",
    highlight: false,
  },
  {
    id: "safety_device",
    label: "첨단 안전장치 (AEB·차선이탈경고 등)",
    icon: "🛡️",
    rate: 0.03,
    desc: "자동긴급제동·차선이탈경고 등 장착 차량",
    category: "device",
    highlight: false,
  },
  {
    id: "mileage_low",
    label: "연간 주행거리 5,000km 이하",
    icon: "🚗",
    rate: 0.30,
    desc: "마일리지 특약 — 연 5,000km 이하 최대 30% 할인",
    category: "mileage",
    highlight: false,
  },
  {
    id: "mileage_mid",
    label: "연간 주행거리 10,000km 이하",
    icon: "🚘",
    rate: 0.15,
    desc: "마일리지 특약 — 연 10,000km 이하 약 15% 할인",
    category: "mileage",
    highlight: false,
  },
  {
    id: "night_limit",
    label: "심야 운전 제한 특약",
    icon: "🌙",
    rate: 0.05,
    desc: "자정~새벽 5시 미운전 서약 시 (일부 보험사)",
    category: "habit",
    highlight: false,
  },
  {
    id: "public_transit",
    label: "대중교통 이용자",
    icon: "🚇",
    rate: 0.07,
    desc: "대중교통 정기권 소지자 할인 (일부 보험사)",
    category: "habit",
    highlight: false,
  },
  {
    id: "direct",
    label: "다이렉트(인터넷) 가입",
    icon: "💻",
    rate: 0.15,
    desc: "설계사 수수료 절감 — 동일 조건 10~20% 저렴",
    category: "contract",
    highlight: false,
  },
  {
    id: "long_term",
    label: "동일 보험사 3년 이상 유지",
    icon: "⭐",
    rate: 0.04,
    desc: "우수 회원 할인 (일부 보험사 3~5%)",
    category: "contract",
    highlight: false,
  },
] as const;

export type CipDiscountId = typeof CIP_DISCOUNTS[number]["id"];

export const CIP_INSURERS = [
  {
    name: "삼성화재",
    share: 27,
    strengths: ["긴급출동 전국망 1위", "브랜드 신뢰도 최고", "합리적 보상"],
    bestFor: ["장거리 운전자", "보상 안정성 우선"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "DB손해보험",
    share: 20,
    strengths: ["다이렉트 가격 경쟁력", "앱 편의성 우수", "보상 신속"],
    bestFor: ["보험료 절약 우선", "다이렉트 가입자"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "현대해상",
    share: 16,
    strengths: ["Hi-Car 마일리지 정확도 높음", "운전자 특화 분석"],
    bestFor: ["마일리지 할인 극대화", "운전 습관 분석"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "KB손해보험",
    share: 13,
    strengths: ["자녀·다자녀 할인 체계적", "KB금융그룹 연계"],
    bestFor: ["영유아·자녀 있는 가족", "다자녀 가구"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "메리츠화재",
    share: 11,
    strengths: ["보상 처리 속도 최상위", "다이렉트 저렴"],
    bestFor: ["빠른 보상 원하는 분", "보험료 절약"],
    childDiscount: true,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "한화손해보험",
    share: 7,
    strengths: ["보험료 저렴한 편", "중소형차 유리"],
    bestFor: ["중소형·경차 운전자", "보험료 최저 우선"],
    childDiscount: false,
    mileageDiscount: true,
    directDiscount: true,
  },
  {
    name: "롯데손해보험",
    share: 4,
    strengths: ["롯데포인트 적립", "롯데카드 할인 연계"],
    bestFor: ["롯데카드·포인트 활용자"],
    childDiscount: false,
    mileageDiscount: true,
    directDiscount: true,
  },
];

export const CIP_DEFAULTS = {
  carPrice: 3000,
  carAge: "1-3",
  driverAge: 35,
  career: "10+",
  accident: "none",
  driverScope: "couple",
  coverage: "full",
  discounts: [] as CipDiscountId[],
};

export const CIP_META = {
  slug: "car-insurance-premium",
  title: "자동차 보험료 계산기 2026 | 할인 항목 체크 + 보험사 비교",
  description: "차량·나이·사고이력 입력하면 예상 보험료 즉시 계산. 블랙박스·마일리지·영유아 자녀 할인까지 놓친 항목 자동 체크. 주요 보험사 특징 비교 포함.",
  updatedAt: "2026-06-18",
  caution: "실제 보험료는 차종·지역·보험사 심사 기준에 따라 크게 다를 수 있습니다. 정확한 견적은 보험사 다이렉트에서 확인하세요.",
};

export const CIP_FAQ = [
  {
    question: "자동차 보험료가 갱신 때마다 오르는 이유는?",
    answer: "무사고라도 물가 상승·보험사 손해율·보험료 기준 변경으로 인상될 수 있습니다. 반면 무사고 경력이 쌓이면 할인폭도 커집니다. 매년 다이렉트 비교 견적을 받아보는 것이 절약의 기본입니다.",
  },
  {
    question: "아기(영유아)가 있으면 자동차 보험이 정말 저렴해지나요?",
    answer: "삼성화재·DB손보·KB손보 등 주요 보험사에서 만 6세 이하 자녀 보유 시 5~7% 할인을 제공합니다. 다자녀(2명 이상)라면 추가 7~10% 할인까지 합산 최대 15% 이상 절약 가능합니다. 가입 시 자녀 정보를 반드시 입력하세요.",
  },
  {
    question: "마일리지 할인을 받으려면 어떻게 하나요?",
    answer: "가입 시 마일리지 특약을 선택하고, 보험사 앱에 OBD 단말기 또는 차량 계기판 사진으로 주행거리를 인증합니다. 연 5,000km 이하 시 최대 30%, 10,000km 이하 시 약 15% 할인됩니다. 현대해상 Hi-Car 앱의 마일리지 인증 정확도가 높다는 평이 많습니다.",
  },
  {
    question: "다이렉트와 설계사 가입의 보험료 차이는?",
    answer: "동일 조건 기준 다이렉트가 10~20% 저렴한 경우가 많습니다. 설계사 수수료가 보험료에 포함되기 때문입니다. 단, 사고 시 설계사가 보상 과정을 도와주는 장점도 있으므로 첫 가입자라면 고려해볼 수 있습니다.",
  },
  {
    question: "블랙박스 할인은 얼마나 되나요?",
    answer: "대부분 주요 보험사에서 전·후방 블랙박스 장착 시 3~5% 할인을 적용합니다. 5만~10만원짜리 블랙박스 하나로 매년 수만원을 절약할 수 있어 ROI가 매우 높은 할인 항목입니다. 가입 시 블랙박스 보유 여부를 반드시 체크하세요.",
  },
];
