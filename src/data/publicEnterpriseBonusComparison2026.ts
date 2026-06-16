export type PublicEnterpriseType =
  | "marketPublic"
  | "quasiMarketPublic"
  | "quasiGovernment"
  | "otherPublic";

export type PublicEnterpriseIndustry =
  | "energy"
  | "transport"
  | "housing"
  | "welfare"
  | "pension"
  | "airport"
  | "soc"
  | "water";

export type PublicEnterpriseDataConfidence = "officialAverage" | "simulated" | "needsReview";
export type PublicEnterpriseEvaluationSensitivity = "high" | "medium" | "check";

export interface PublicEnterpriseBonusEntry {
  id: string;
  name: string;
  shortName: string;
  type: PublicEnterpriseType;
  industry: PublicEnterpriseIndustry;
  defaultSalaryPercent: number;
  defaultBaseSalary: number;
  dataConfidence: PublicEnterpriseDataConfidence;
  evaluationSensitivity: PublicEnterpriseEvaluationSensitivity;
  rankNote: string;
  summary: string;
  caution: string;
  sourceNote: string;
  relatedKeywords: string[];
}

export interface PublicEnterpriseBonusFaq {
  question: string;
  answer: string;
}

export interface PublicEnterpriseRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface PublicEnterpriseSeoContent {
  introTitle: string;
  intro: string[];
  inputPoints: string[];
  criteria: string[];
}

export const PEBC_BASE_SALARY = 60_000_000;
export const PEBC_SIMPLE_TAX_RATE = 0.22;
export const PEBC_MIN_SALARY = 20_000_000;
export const PEBC_MAX_SALARY = 200_000_000;

export const PEBC_META = {
  slug: "public-enterprise-bonus-comparison-2026",
  title: "공기업 성과급 비교 2026",
  seoTitle: "공기업 성과급 비교 2026｜한전·코레일·LH는 얼마나 받을까",
  seoDescription:
    "한전, 코레일, LH, 건보공단 등 주요 공공기관의 성과급 구조와 입력 연봉 기준 추정 성과급을 비교합니다. 경영평가 등급과 기관 유형별 차이도 함께 확인하세요.",
  updatedAt: "2026-06-16",
  dataNote:
    "공시 평균과 입력 연봉 기준 추정값을 함께 사용하는 자가 점검용 콘텐츠입니다. 개인별 실제 지급액은 기관 내부 기준에 따라 달라질 수 있습니다.",
} as const;

export const PEBC_TYPE_LABELS: Record<PublicEnterpriseType, string> = {
  marketPublic: "시장형 공기업",
  quasiMarketPublic: "준시장형 공기업",
  quasiGovernment: "준정부기관",
  otherPublic: "기타공공기관",
};

export const PEBC_INDUSTRY_LABELS: Record<PublicEnterpriseIndustry, string> = {
  energy: "에너지",
  transport: "철도·운송",
  housing: "주택·토지",
  welfare: "복지·행정",
  pension: "연금",
  airport: "공항",
  soc: "SOC",
  water: "수자원",
};

export const PEBC_CONFIDENCE_LABELS: Record<PublicEnterpriseDataConfidence, string> = {
  officialAverage: "공시 평균",
  simulated: "입력 연봉 기준 추정",
  needsReview: "공시 확인 필요",
};

export const PEBC_EVALUATION_LABELS: Record<PublicEnterpriseEvaluationSensitivity, string> = {
  high: "경영평가 영향 큼",
  medium: "경영평가 영향 보통",
  check: "기관 기준 확인",
};

export const PEBC_ENTRIES: PublicEnterpriseBonusEntry[] = [
  {
    id: "khnp",
    name: "한국수력원자력",
    shortName: "한수원",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 9,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "발전·원전 공기업",
    summary: "한수원은 에너지 공기업 중 보상 관심도가 높은 기관입니다.",
    caution: "한국전력공사와 별도 기관이므로 성과급 기준도 별도로 확인해야 합니다.",
    sourceNote: "알리오 공시와 경영평가 결과 확인 필요",
    relatedKeywords: ["한수원 성과급", "한국수력원자력 성과급"],
  },
  {
    id: "incheonAirport",
    name: "인천국제공항공사",
    shortName: "인국공",
    type: "marketPublic",
    industry: "airport",
    defaultSalaryPercent: 9,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "공항 공기업",
    summary: "인천국제공항공사는 고연봉 공기업 이미지가 있어 성과급 비교 클릭 수요가 큽니다.",
    caution: "항공 수요, 경영평가 결과, 내부 지급 기준에 따라 지급 규모가 달라질 수 있습니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["인천국제공항공사 성과급", "인국공 성과급"],
  },
  {
    id: "kepco",
    name: "한국전력공사",
    shortName: "한전",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 8,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "에너지 대표 공기업",
    summary: "한전 성과급은 경영평가와 재무 상황에 따라 체감 차이가 클 수 있습니다.",
    caution: "연도별 경영평가와 내부 지급 기준에 따라 실제 지급률이 달라집니다.",
    sourceNote: "알리오 공시와 경영평가 결과 확인 필요",
    relatedKeywords: ["한전 성과급", "한국전력 성과급", "한국전력공사 성과급"],
  },
  {
    id: "kogas",
    name: "한국가스공사",
    shortName: "가스공사",
    type: "marketPublic",
    industry: "energy",
    defaultSalaryPercent: 8,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "에너지 공기업",
    summary: "한국가스공사는 에너지 공기업 비교군에서 함께 확인할 기관입니다.",
    caution: "재무 상황과 평가 결과에 따라 성과급 체감액이 달라질 수 있습니다.",
    sourceNote: "알리오 공시와 경영평가 결과 확인 필요",
    relatedKeywords: ["한국가스공사 성과급", "가스공사 성과급"],
  },
  {
    id: "korail",
    name: "한국철도공사",
    shortName: "코레일",
    type: "quasiMarketPublic",
    industry: "transport",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "철도·운송 대표 공기업",
    summary: "코레일은 직군과 근속에 따른 보상 체감 차이가 큰 기관입니다.",
    caution: "운전·시설·사무 등 직군별 지급 체감액이 달라질 수 있습니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["코레일 성과급", "한국철도공사 성과급"],
  },
  {
    id: "lh",
    name: "한국토지주택공사",
    shortName: "LH",
    type: "quasiMarketPublic",
    industry: "housing",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "high",
    rankNote: "주택·토지 공공기관",
    summary: "LH 성과급은 공공기관 평가와 내부 지급 기준을 함께 확인해야 합니다.",
    caution: "성과급 관련 논란성 표현은 피하고 공시 기준으로만 해석해야 합니다.",
    sourceNote: "알리오 공시와 경영평가 결과 확인 필요",
    relatedKeywords: ["LH 성과급", "한국토지주택공사 성과급"],
  },
  {
    id: "ex",
    name: "한국도로공사",
    shortName: "도로공사",
    type: "quasiMarketPublic",
    industry: "soc",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "SOC 공기업",
    summary: "한국도로공사는 SOC 공기업 비교군에서 함께 볼 수 있습니다.",
    caution: "직무와 근속에 따른 성과급 체감 차이가 있을 수 있습니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["한국도로공사 성과급", "도로공사 성과급"],
  },
  {
    id: "kwater",
    name: "한국수자원공사",
    shortName: "수자원공사",
    type: "quasiMarketPublic",
    industry: "water",
    defaultSalaryPercent: 7,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "수자원 공기업",
    summary: "한국수자원공사는 SOC·공공서비스 성격의 비교군으로 적합합니다.",
    caution: "기관 내부 기준과 연도별 평가에 따라 지급률이 달라질 수 있습니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["한국수자원공사 성과급", "수자원공사 성과급"],
  },
  {
    id: "nhis",
    name: "국민건강보험공단",
    shortName: "건보공단",
    type: "quasiGovernment",
    industry: "welfare",
    defaultSalaryPercent: 6,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "복지·행정 대표 공공기관",
    summary: "건보공단은 공기업이라기보다 준정부기관 성격으로 보는 것이 정확합니다.",
    caution: "공기업과 동일한 방식으로 단순 비교하지 않도록 기관 유형을 함께 확인해야 합니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["건보공단 성과급", "국민건강보험공단 성과급"],
  },
  {
    id: "nps",
    name: "국민연금공단",
    shortName: "국민연금",
    type: "quasiGovernment",
    industry: "pension",
    defaultSalaryPercent: 6,
    defaultBaseSalary: PEBC_BASE_SALARY,
    dataConfidence: "needsReview",
    evaluationSensitivity: "medium",
    rankNote: "연금 공공기관",
    summary: "국민연금공단은 연봉·성과급을 함께 보는 취업 검색 수요가 있습니다.",
    caution: "직급과 근속에 따른 실제 지급 차이를 별도로 확인해야 합니다.",
    sourceNote: "알리오 공시와 기관 기준 확인 필요",
    relatedKeywords: ["국민연금공단 성과급", "국민연금 성과급"],
  },
];

export const PEBC_SUMMARY_CARDS = [
  {
    label: "비교 대상",
    value: `${PEBC_ENTRIES.length}개 기관`,
    description: "한전·코레일·LH·건보공단 등 검색 인지도가 높은 주요 공공기관을 우선 비교합니다.",
    badge: "입력 연봉 기준 추정",
  },
  {
    label: "기본 연봉",
    value: "6,000만 원",
    description: "기준 연봉을 바꾸면 기관별 세전·세후 추정액과 차이가 즉시 다시 계산됩니다.",
    badge: "시뮬레이션",
  },
  {
    label: "주의할 변수",
    value: "경영평가",
    description: "공기업 성과급은 회사 실적뿐 아니라 경영평가와 내부 지급률의 영향을 받습니다.",
    badge: "확인 필요",
  },
  {
    label: "해석 기준",
    value: "개인 지급액 아님",
    description: "표의 금액은 개인별 실제 지급액이 아니라 구조 이해용 추정값입니다.",
    badge: "주의",
  },
] as const;

export const PEBC_STRUCTURE_POINTS = [
  {
    title: "경영평가가 먼저입니다",
    description:
      "민간 기업 성과급은 회사 실적과 사업부 성과가 중심인 경우가 많지만, 공기업은 경영평가 결과와 정부 지침, 내부 보수 규정이 함께 작동합니다.",
  },
  {
    title: "기관 유형을 나눠 봐야 합니다",
    description:
      "시장형 공기업, 준시장형 공기업, 준정부기관은 같은 공공기관이라도 보상 체계와 평가 방식이 다를 수 있습니다.",
  },
  {
    title: "연봉 포함 여부를 확인해야 합니다",
    description:
      "채용 공고나 공시의 총보수에는 성과급, 수당, 복지성 항목이 다르게 반영될 수 있어 고정급과 변동급을 나눠 보는 것이 좋습니다.",
  },
] as const;

export const PEBC_PRIVATE_COMPARISON = [
  {
    label: "민간 대기업",
    points: ["회사·사업부 실적 영향", "노사협의와 개인 평가 영향", "OPI·PS·격려금 등 회사별 용어 차이"],
  },
  {
    label: "공기업·공공기관",
    points: ["경영평가 결과 영향", "기관 유형과 내부 규정 영향", "공시 평균과 개인 지급액 차이"],
  },
] as const;

export const PEBC_FAQ: PublicEnterpriseBonusFaq[] = [
  {
    question: "공기업 성과급은 매년 나오나요?",
    answer:
      "공기업과 공공기관 성과급은 경영평가 결과와 내부 기준에 따라 달라집니다. 매년 동일하게 지급된다고 보기는 어렵고, 기관별 재무 상황과 평가 결과도 함께 봐야 합니다.",
  },
  {
    question: "한전, 코레일, LH 중 어디 성과급이 가장 많나요?",
    answer:
      "개인별 실제 지급액은 직급, 직군, 근속, 평가, 지급 기준에 따라 달라집니다. 이 페이지의 순위는 입력 연봉과 기본 성과급률을 곱한 시뮬레이션 기준입니다.",
  },
  {
    question: "공기업 성과급은 연봉에 포함되나요?",
    answer:
      "채용 공고나 공시에서 보수 항목을 표시하는 방식에 따라 다릅니다. 기본급, 수당, 성과급, 복지포인트가 분리될 수 있으므로 총보수와 고정급을 나눠 확인하는 것이 좋습니다.",
  },
  {
    question: "공기업 성과급도 세금을 떼나요?",
    answer:
      "성과급도 근로소득으로 과세될 수 있습니다. 실제 세율은 연봉, 공제, 지급월의 원천징수 방식에 따라 달라지므로 이 페이지의 세후 금액은 간이 추정입니다.",
  },
  {
    question: "공기업과 준정부기관 성과급은 같은 기준인가요?",
    answer:
      "완전히 같다고 보기 어렵습니다. 기관 유형, 경영평가 체계, 내부 보수 규정이 다를 수 있어 페이지에서는 기관 유형을 별도로 표시합니다.",
  },
  {
    question: "신입사원도 성과급을 받을 수 있나요?",
    answer:
      "기관과 입사 시점, 지급 기준에 따라 달라질 수 있습니다. 일부 기관은 재직 기간에 따라 일할 계산하거나 지급 대상에서 제외할 수 있으므로 채용 공고와 내부 기준을 확인해야 합니다.",
  },
  {
    question: "성과급이 높은 공기업이 무조건 좋은 회사인가요?",
    answer:
      "성과급만으로 판단하기는 어렵습니다. 기본급, 근속 상승, 수당, 근무지, 직무 안정성, 복지, 조직문화까지 함께 비교해야 실제 체감 보상이 보입니다.",
  },
];

export const PEBC_RELATED_LINKS: PublicEnterpriseRelatedLink[] = [
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 계산기",
    description: "성과급을 받았을 때 세후 실수령액을 계산합니다.",
  },
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "대기업 성과급 비교",
    description: "민간 대기업 성과급 구조와 지급 방식을 비교합니다.",
  },
  {
    href: "/compare/bonus/",
    label: "성과급 계산기 모아보기",
    description: "삼성, SK, 현대차, LG 등 성과급 계산기를 한 번에 봅니다.",
  },
  {
    href: "/reports/new-employee-salary-2026/",
    label: "신입사원 연봉 비교",
    description: "직군별·업종별 신입 연봉을 함께 비교합니다.",
  },
  {
    href: "/reports/public-servant-salary-2026/",
    label: "공무원 월급·연봉",
    description: "공공부문 보상 비교를 공무원 월급과 연결해 봅니다.",
  },
];

export const PEBC_SEO_CONTENT: PublicEnterpriseSeoContent = {
  introTitle: "공기업 성과급은 왜 기관마다 차이가 날까",
  intro: [
    "공기업 성과급은 민간 대기업처럼 회사 실적만으로 결정되지 않습니다. 경영평가 결과, 기관 내부 지급률, 직급과 직군, 근속 기간이 함께 반영될 수 있어 같은 기관 안에서도 개인별 체감액이 달라질 수 있습니다.",
    "한전, 코레일, LH, 건보공단처럼 이름은 익숙하지만 기관 유형과 평가 방식은 서로 다릅니다. 시장형 공기업과 준정부기관을 같은 기준으로만 보면 실제 보상 구조를 오해할 수 있습니다.",
    "이 페이지는 주요 공공기관의 성과급 구조를 같은 기준 연봉으로 환산해 비교합니다. 표와 차트의 금액은 개인별 실제 지급액이 아니라 입력 연봉 기준 추정값이므로, 기관 공시와 채용 공고를 함께 확인하는 보조 자료로 활용하는 것이 좋습니다.",
  ],
  inputPoints: [
    "기준 연봉을 입력하면 기관별 성과급률을 곱해 세전 추정액을 계산합니다.",
    "세후 보기에서는 간이 세율을 적용한 실수령 추정액을 표시합니다.",
    "기관 유형과 업종 필터로 에너지, SOC, 복지·행정 기관을 나눠 볼 수 있습니다.",
  ],
  criteria: [
    "모든 금액은 개인별 실제 지급액이 아니라 공시 평균 또는 입력 연봉 기준 추정값입니다.",
    "경영평가 결과와 내부 지급률에 따라 실제 성과급은 달라질 수 있습니다.",
    "공기업, 준정부기관, 기타공공기관을 단순 동일 기준으로 해석하지 않도록 기관 유형을 함께 표시합니다.",
  ],
};

export const PEBC_CONFIG = {
  baseSalary: PEBC_BASE_SALARY,
  taxRate: PEBC_SIMPLE_TAX_RATE,
  minSalary: PEBC_MIN_SALARY,
  maxSalary: PEBC_MAX_SALARY,
  entries: PEBC_ENTRIES,
  typeLabels: PEBC_TYPE_LABELS,
  industryLabels: PEBC_INDUSTRY_LABELS,
  confidenceLabels: PEBC_CONFIDENCE_LABELS,
  evaluationLabels: PEBC_EVALUATION_LABELS,
};

export function formatPebcWon(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100_000_000) {
    return `${(value / 100_000_000).toFixed(1)}억 원`;
  }
  return `${Math.round(value / 10_000).toLocaleString("ko-KR")}만 원`;
}
