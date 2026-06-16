export type RetailFoodIndustry =
  | "commerce"
  | "offlineRetail"
  | "foodManufacturing"
  | "hnb"
  | "logisticsRetail";

export type RetailFoodJobType = "office" | "tech" | "logistics" | "storeSales" | "production";

export type RetailFoodDataConfidence = "publicReference" | "reviewBased" | "simulated" | "needsReview";

export interface RetailFoodBonusEntry {
  id: string;
  name: string;
  shortName: string;
  industry: RetailFoodIndustry;
  defaultSalaryPercent: number;
  representativeJobTypes: RetailFoodJobType[];
  jobTypeAdjustments: Partial<Record<RetailFoodJobType, number>>;
  dataConfidence: RetailFoodDataConfidence;
  rankNote: string;
  summary: string;
  caution: string;
  structureNote: string;
  relatedKeywords: string[];
}

export interface RetailFoodBonusFaq {
  question: string;
  answer: string;
}

export interface RetailFoodRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface RetailFoodSeoContent {
  introTitle: string;
  intro: string[];
  inputPoints: string[];
  criteria: string[];
}

export const RFBC_BASE_SALARY = 50_000_000;
export const RFBC_SIMPLE_TAX_RATE = 0.22;
export const RFBC_MIN_SALARY = 20_000_000;
export const RFBC_MAX_SALARY = 200_000_000;

export const RFBC_META = {
  slug: "retail-food-bonus-comparison-2026",
  title: "유통·식품 성과급 비교 2026｜쿠팡·이마트·CJ는 얼마나 받을까",
  seoTitle: "유통·식품 성과급 비교 2026｜쿠팡·이마트·CJ 성과급 구조와 세후 추정",
  seoDescription:
    "쿠팡, 이마트, CJ제일제당, CJ올리브영, 롯데쇼핑, 동원F&B의 성과급 구조를 입력 연봉 기준으로 비교합니다. 공개자료와 후기 기반 참고값을 구분해 세전·세후 추정액을 확인할 수 있습니다.",
  updatedAt: "2026-06-16",
  dataNote:
    "이 페이지의 성과급률은 공식 확정 지급액이 아니라 공개자료, 채용 정보, 후기성 정보를 함께 해석한 참고용 추정값입니다. 회사·직군·평가·재직 기간에 따라 실제 지급액은 달라질 수 있습니다.",
} as const;

export const RFBC_INDUSTRY_LABELS: Record<RetailFoodIndustry, string> = {
  commerce: "커머스",
  offlineRetail: "오프라인 유통",
  foodManufacturing: "식품 제조",
  hnb: "헬스앤뷰티",
  logisticsRetail: "물류·리테일",
};

export const RFBC_JOB_TYPE_LABELS: Record<RetailFoodJobType, string> = {
  office: "본사 사무직",
  tech: "개발·테크",
  logistics: "물류·현장",
  storeSales: "매장·영업",
  production: "생산·공장",
};

export const RFBC_CONFIDENCE_LABELS: Record<RetailFoodDataConfidence, string> = {
  publicReference: "공개자료 참고",
  reviewBased: "후기 기반 참고",
  simulated: "입력 연봉 기준 추정",
  needsReview: "확인 필요",
};

export const RFBC_JOB_TYPES = [
  {
    value: "office",
    label: RFBC_JOB_TYPE_LABELS.office,
    description: "본사 관리, 재무, MD, 전략, 인사 등 성과급 제도 설명이 비교적 많이 언급되는 직군입니다.",
  },
  {
    value: "tech",
    label: RFBC_JOB_TYPE_LABELS.tech,
    description: "커머스 플랫폼과 데이터 조직은 별도 보상 구조나 인센티브 체감이 다를 수 있어 보정값을 둡니다.",
  },
  {
    value: "logistics",
    label: RFBC_JOB_TYPE_LABELS.logistics,
    description: "물류센터, 배송, 현장 운영은 고정급·수당 비중이 커서 본사 기준 성과급률과 다르게 봐야 합니다.",
  },
  {
    value: "storeSales",
    label: RFBC_JOB_TYPE_LABELS.storeSales,
    description: "매장과 영업 직군은 점포·채널 실적, 개인 실적, 월별 인센티브가 함께 작동할 수 있습니다.",
  },
  {
    value: "production",
    label: RFBC_JOB_TYPE_LABELS.production,
    description: "식품 제조와 공장 직군은 교대, 수당, 생산 장려금이 섞일 수 있어 성과급만 단독 비교하면 왜곡됩니다.",
  },
] as const;

export const RFBC_ENTRIES: RetailFoodBonusEntry[] = [
  {
    id: "coupang",
    name: "쿠팡",
    shortName: "쿠팡",
    industry: "commerce",
    defaultSalaryPercent: 8,
    representativeJobTypes: ["office", "tech", "logistics"],
    jobTypeAdjustments: { office: 1, tech: 1.1, logistics: 0.75, storeSales: 0.8 },
    dataConfidence: "needsReview",
    rankNote: "커머스·물류 플랫폼",
    summary: "쿠팡은 커머스, 테크, 물류 조직이 함께 있어 직군별 체감 보상이 크게 갈릴 수 있는 기업입니다.",
    caution:
      "스톡, 인센티브, 직무별 보상 체계가 함께 언급되는 경우가 많아 단순 성과급률만으로 전체 보상을 판단하면 안 됩니다.",
    structureNote: "테크와 본사 직군은 성과 보상 기대감이 크지만 물류·현장은 수당과 근무 형태를 함께 봐야 합니다.",
    relatedKeywords: ["쿠팡 성과급", "쿠팡 연봉", "쿠팡 개발자 성과급", "쿠팡 물류 성과급"],
  },
  {
    id: "emart",
    name: "이마트",
    shortName: "이마트",
    industry: "offlineRetail",
    defaultSalaryPercent: 6,
    representativeJobTypes: ["office", "storeSales"],
    jobTypeAdjustments: { office: 1, storeSales: 0.85, logistics: 0.8 },
    dataConfidence: "reviewBased",
    rankNote: "대형마트·오프라인 유통",
    summary: "이마트는 본사와 점포 직군의 보상 체감이 다를 수 있어 매장·영업 기준 보정이 중요합니다.",
    caution: "점포 실적, 직무, 근무 형태에 따라 성과급보다 수당과 복지 체감이 더 크게 느껴질 수 있습니다.",
    structureNote: "오프라인 유통은 매출 환경과 비용 구조의 영향을 많이 받으므로 연도별 변동성을 같이 봐야 합니다.",
    relatedKeywords: ["이마트 성과급", "이마트 연봉", "이마트 점포 성과급", "신세계 성과급"],
  },
  {
    id: "cjCheiljedang",
    name: "CJ제일제당",
    shortName: "CJ제일제당",
    industry: "foodManufacturing",
    defaultSalaryPercent: 7,
    representativeJobTypes: ["office", "production"],
    jobTypeAdjustments: { office: 1, production: 0.9, storeSales: 0.9 },
    dataConfidence: "reviewBased",
    rankNote: "식품 제조·바이오",
    summary: "CJ제일제당은 식품 제조 대기업 성격이 강해 본사, 영업, 생산 직군을 나누어 보는 편이 좋습니다.",
    caution: "사업부 실적과 직군별 평가가 다르게 작동할 수 있어 평균 성과급률을 개인 지급액으로 해석하면 안 됩니다.",
    structureNote: "식품 제조사는 공장·생산직의 수당과 본사 성과급 체감이 분리될 수 있습니다.",
    relatedKeywords: ["CJ제일제당 성과급", "CJ제일제당 연봉", "CJ 성과급", "식품회사 성과급"],
  },
  {
    id: "cjOliveyoung",
    name: "CJ올리브영",
    shortName: "올리브영",
    industry: "hnb",
    defaultSalaryPercent: 7,
    representativeJobTypes: ["office", "storeSales"],
    jobTypeAdjustments: { office: 1, storeSales: 0.85, logistics: 0.8 },
    dataConfidence: "needsReview",
    rankNote: "헬스앤뷰티 리테일",
    summary: "올리브영은 고성장 리테일 기업으로 검색 관심도가 높지만 본사와 매장 직군을 구분해야 합니다.",
    caution: "매장 직군은 점포 실적, 근무 형태, 인센티브 항목에 따라 본사 기준 추정액과 차이가 날 수 있습니다.",
    structureNote: "성장성 기대와 실제 성과급 지급 체계는 별개이므로 후기 기반 참고값으로만 봐야 합니다.",
    relatedKeywords: ["올리브영 성과급", "CJ올리브영 연봉", "올리브영 매장 성과급", "CJ올리브영 성과급"],
  },
  {
    id: "lotteShopping",
    name: "롯데쇼핑",
    shortName: "롯데쇼핑",
    industry: "offlineRetail",
    defaultSalaryPercent: 6,
    representativeJobTypes: ["office", "storeSales"],
    jobTypeAdjustments: { office: 1, storeSales: 0.85, logistics: 0.82 },
    dataConfidence: "reviewBased",
    rankNote: "백화점·마트·리테일",
    summary: "롯데쇼핑은 백화점, 마트, 이커머스 성격이 섞여 있어 세부 계열과 직무를 같이 봐야 합니다.",
    caution: "롯데그룹 전체 성과급과 롯데쇼핑 내부 보상은 다를 수 있어 계열사명을 정확히 확인해야 합니다.",
    structureNote: "리테일 기업은 채널별 실적 편차가 커서 평균값보다 본인이 속한 조직 기준이 중요합니다.",
    relatedKeywords: ["롯데쇼핑 성과급", "롯데백화점 성과급", "롯데마트 성과급", "롯데 연봉"],
  },
  {
    id: "dongwonFnb",
    name: "동원F&B",
    shortName: "동원F&B",
    industry: "foodManufacturing",
    defaultSalaryPercent: 5,
    representativeJobTypes: ["office", "production", "storeSales"],
    jobTypeAdjustments: { office: 1, production: 0.9, storeSales: 0.9, logistics: 0.82 },
    dataConfidence: "needsReview",
    rankNote: "식품 제조·영업",
    summary: "동원F&B는 식품 제조와 영업 조직을 함께 봐야 하는 중대형 식품 기업 비교군입니다.",
    caution: "생산, 영업, 본사 직군의 수당과 인센티브 구조가 다를 수 있어 성과급만으로 총보상을 판단하기 어렵습니다.",
    structureNote: "식품 제조 중견·대기업 확장 콘텐츠로 이어가기 좋은 기준점입니다.",
    relatedKeywords: ["동원F&B 성과급", "동원에프앤비 연봉", "동원 성과급", "식품 영업 성과급"],
  },
];

export const RFBC_SUMMARY_CARDS = [
  {
    label: "비교 대상",
    value: `${RFBC_ENTRIES.length}개 기업`,
    description: "쿠팡, 이마트, CJ제일제당, CJ올리브영, 롯데쇼핑, 동원F&B를 한 화면에서 비교합니다.",
    badge: "유통·식품",
  },
  {
    label: "기준 연봉",
    value: "5,000만원",
    description: "기준 연봉을 바꾸면 직군 보정 성과급률을 적용해 세전·세후 추정액을 다시 계산합니다.",
    badge: "시뮬레이션",
  },
  {
    label: "핵심 변수",
    value: "직군 보정",
    description: "본사, 테크, 물류, 매장, 생산 직군은 성과급 체감이 달라 별도 보정값을 적용합니다.",
    badge: "직군별",
  },
  {
    label: "데이터 성격",
    value: "확인 필요",
    description: "공식 지급액이 아니라 공개자료와 후기성 정보를 해석한 참고용 추정 콘텐츠입니다.",
    badge: "주의",
  },
] as const;

export const RFBC_STRUCTURE_POINTS = [
  {
    title: "유통·식품은 직군 차이가 큽니다",
    description:
      "같은 회사라도 본사, 테크, 매장, 물류, 생산 직군의 보상 체감이 다릅니다. 그래서 이 페이지는 회사별 기본 성과급률에 직군 보정값을 곱해 참고액을 보여줍니다.",
  },
  {
    title: "성과급보다 수당이 더 크게 보일 수 있습니다",
    description:
      "매장, 물류, 생산 직군은 교대, 연장, 휴일, 현장 수당의 영향이 큽니다. 성과급 추정액은 총보상 중 일부로만 보는 편이 안전합니다.",
  },
  {
    title: "공식 지급액처럼 읽으면 안 됩니다",
    description:
      "기업별 공개 수준이 균일하지 않기 때문에 금액은 채용 검토와 검색 비교를 돕는 참고값입니다. 실제 입사·이직 판단은 회사 공지와 처우 조건을 확인해야 합니다.",
  },
] as const;

export const RFBC_MANUFACTURING_COMPARISON = [
  {
    label: "반도체·자동차 제조 대기업",
    points: ["OPI·PS·성과급 산식이 비교적 많이 검색됨", "사업부 실적에 따른 대규모 변동 가능", "직급별 실수령액 콘텐츠로 확장 쉬움"],
  },
  {
    label: "유통·식품·커머스",
    points: ["회사별 공개자료가 균일하지 않아 추정형 콘텐츠가 적합", "본사·매장·물류·생산 직군 차이가 큼", "연봉, 복지, 수당과 함께 봐야 클릭 만족도가 높음"],
  },
] as const;

export const RFBC_FAQ: RetailFoodBonusFaq[] = [
  {
    question: "쿠팡, 이마트, CJ 성과급은 정확히 얼마인가요?",
    answer:
      "개인별 실제 지급액은 회사, 직군, 평가, 재직 기간, 사업부 실적에 따라 달라집니다. 이 페이지의 금액은 공식 지급액이 아니라 입력 연봉에 참고 성과급률을 적용한 추정값입니다.",
  },
  {
    question: "왜 직군을 선택해야 하나요?",
    answer:
      "유통·식품 기업은 본사 사무직, 테크, 물류, 매장, 생산 직군의 보상 구조가 다릅니다. 같은 회사라도 성과급 체감이 달라질 수 있어 직군 보정값을 별도로 적용합니다.",
  },
  {
    question: "세후 금액은 실제 통장 입금액인가요?",
    answer:
      "아닙니다. 세후 금액은 간이 세율을 적용한 참고용 추정액입니다. 실제 원천징수와 공제는 개인의 연봉, 지급월, 공제 항목에 따라 달라질 수 있습니다.",
  },
  {
    question: "유통·식품 성과급은 제조 대기업보다 낮은가요?",
    answer:
      "일반적으로 반도체나 자동차처럼 성과급 산식이 크게 알려진 업종과 단순 비교하기는 어렵습니다. 유통·식품은 성과급뿐 아니라 수당, 복지, 근무 형태를 함께 봐야 합니다.",
  },
  {
    question: "신입사원도 성과급을 받을 수 있나요?",
    answer:
      "입사 시점, 평가 기간, 지급 기준에 따라 달라집니다. 일부 회사는 재직 기간에 따라 일할 계산하거나 지급 대상에서 제외할 수 있으므로 채용 공고와 회사 안내를 확인해야 합니다.",
  },
];

export const RFBC_RELATED_LINKS: RetailFoodRelatedLink[] = [
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 계산기",
    description: "성과급을 받았을 때 세후 실수령액을 간단히 계산합니다.",
  },
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "대기업 성과급 비교",
    description: "삼성, SK, 현대차, LG 등 주요 대기업 성과급 구조를 비교합니다.",
  },
  {
    href: "/reports/public-enterprise-bonus-comparison-2026/",
    label: "공기업 성과급 비교",
    description: "한전, 코레일, LH 등 공공기관 성과급 구조를 비교합니다.",
  },
  {
    href: "/compare/bonus/",
    label: "성과급 계산기 모아보기",
    description: "업종별 성과급 계산기와 비교 리포트를 한 번에 확인합니다.",
  },
];

export const RFBC_SEO_CONTENT: RetailFoodSeoContent = {
  introTitle: "유통·식품 성과급은 왜 검색해도 한눈에 비교하기 어려울까",
  intro: [
    "유통·식품 기업의 성과급은 반도체, 자동차처럼 산식이 널리 알려진 경우가 많지 않습니다. 쿠팡, 이마트, CJ제일제당, CJ올리브영처럼 대중 인지도가 높은 회사도 본사, 테크, 매장, 물류, 생산 직군에 따라 보상 체감이 달라질 수 있습니다.",
    "그래서 이 페이지는 정확한 공식 계산기보다 비교형 참고 콘텐츠에 가깝습니다. 기준 연봉을 입력하면 회사별 기본 성과급률과 직군 보정값을 적용해 세전·세후 추정액을 보여주고, 데이터 성격을 함께 표시합니다.",
    "검색 사용자는 보통 특정 회사의 성과급 금액만 궁금해하지만 실제 이직과 취업 판단에서는 성과급, 연봉, 수당, 복지, 근무 형태를 함께 봐야 합니다. 특히 매장·물류·생산 직군은 성과급보다 수당과 근무 패턴이 체감 보상에 더 크게 작동할 수 있습니다.",
  ],
  inputPoints: [
    "기준 연봉을 입력하면 회사별 기본 성과급률과 선택 직군 보정값을 곱해 세전 추정액을 계산합니다.",
    "세후 보기에서는 간이 세율을 적용해 실제 체감액에 가까운 참고값을 보여줍니다.",
    "업종 필터로 커머스, 오프라인 유통, 식품 제조, 헬스앤뷰티, 물류·리테일 기업을 나누어 볼 수 있습니다.",
  ],
  criteria: [
    "모든 금액은 공식 개인 지급액이 아니라 입력 연봉 기준 추정값입니다.",
    "데이터 성격 배지로 공개자료 참고, 후기 기반 참고, 입력 연봉 기준 추정, 확인 필요를 구분합니다.",
    "대표 직군이 아닌 경우 참고 직군으로 표시해 동일 회사 내에서도 해석 주의가 필요함을 보여줍니다.",
  ],
};

export const RFBC_CONFIG = {
  baseSalary: RFBC_BASE_SALARY,
  taxRate: RFBC_SIMPLE_TAX_RATE,
  minSalary: RFBC_MIN_SALARY,
  maxSalary: RFBC_MAX_SALARY,
  entries: RFBC_ENTRIES,
  industryLabels: RFBC_INDUSTRY_LABELS,
  jobTypeLabels: RFBC_JOB_TYPE_LABELS,
  confidenceLabels: RFBC_CONFIDENCE_LABELS,
};

export function formatRfbcWon(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100_000_000) {
    return `${(value / 100_000_000).toFixed(1)}억원`;
  }
  return `${Math.round(value / 10_000).toLocaleString("ko-KR")}만원`;
}
