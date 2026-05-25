export type AutoCompanyId =
  | "hyundai"
  | "kia"
  | "hyundaiMobis"
  | "gmKorea"
  | "renaultKorea";

export type AutoCompanyGroup =
  | "domesticCompleted"
  | "groupAffiliate"
  | "foreignAffiliate";

export type BonusInputMode = "monthlyMultiple" | "salaryPercent" | "fixedAmount" | "mixed";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "요구안" | "확인 필요";

export interface AutoCompanyConfig {
  id: AutoCompanyId;
  name: string;
  shortName: string;
  group: AutoCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultPaymentLabel: string;
  defaultMonthlyMultiple: number;
  defaultSalaryPercent: number;
  defaultFixedAmount: number;
  supportsStock: boolean;
  defaultStockShares: number;
  defaultStockPrice: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
  detailHref?: string;
  detailCtaLabel?: string;
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface AutoBonusTermGuide {
  term: string;
  companies: string;
  meaning: string;
  caution: string;
}

export interface RelatedCalculator {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const ABC_META = {
  title: "자동차 성과급 비교 계산기 2026",
  seoTitle: "현대차·기아·현대모비스·한국GM·르노코리아 성과급 비교 계산기 2026",
  seoDescription:
    "현대차, 기아, 현대모비스, 한국GM, 르노코리아 등 자동차 기업의 성과급을 연봉·월급·성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 번에 시뮬레이션합니다.",
  dataNote:
    "이 계산기는 사용자가 입력한 연봉, 월 기본급, 성과급 조건을 기준으로 한 비교용 시뮬레이션입니다.",
};

export const AUTO_BONUS_COMPANIES: AutoCompanyConfig[] = [
  {
    id: "hyundai",
    name: "현대자동차",
    shortName: "현대차",
    group: "domesticCompleted",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금·자사주",
    defaultMonthlyMultiple: 4.5,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 15_800_000,
    supportsStock: true,
    defaultStockShares: 30,
    defaultStockPrice: 210_000,
    structureSummary: "2025 임단협 패키지 예시: 월급 450%, 정액 1,580만 원, 자사주 30주, 상품권 20만 원 기준 입력값입니다.",
    caution: "2026 노조 요구안(순이익 30%)은 확정안이 아닙니다. 임단협 결과에 따라 실제 지급액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/hyundai-bonus/",
    detailCtaLabel: "현대차 상세 계산",
  },
  {
    id: "kia",
    name: "기아",
    shortName: "기아",
    group: "domesticCompleted",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금·자사주",
    defaultMonthlyMultiple: 4.0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 12_000_000,
    supportsStock: true,
    defaultStockShares: 20,
    defaultStockPrice: 120_000,
    structureSummary: "현대차그룹 계열이지만 별도 임단협으로 패키지 구성이 다를 수 있습니다. 예시값을 직접 수정해 비교하세요.",
    caution: "기아 임단협 결과와 지급 기준에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "hyundaiMobis",
    name: "현대모비스",
    shortName: "현대모비스",
    group: "groupAffiliate",
    defaultSelected: false,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금",
    defaultMonthlyMultiple: 3.0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 8_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "현대차그룹 부품 계열사이며 완성차 대비 성과급 패키지 구성이 다를 수 있습니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "gmKorea",
    name: "한국GM",
    shortName: "한국GM",
    group: "foreignAffiliate",
    defaultSelected: false,
    defaultMode: "fixedAmount",
    defaultPaymentLabel: "성과급",
    defaultMonthlyMultiple: 0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 5_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "미국 GM 산하 법인으로 노사 협의 구조와 성과급 산식이 국내 대기업과 다를 수 있습니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "renaultKorea",
    name: "르노코리아",
    shortName: "르노코리아",
    group: "foreignAffiliate",
    defaultSelected: false,
    defaultMode: "fixedAmount",
    defaultPaymentLabel: "성과급",
    defaultMonthlyMultiple: 0,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 4_000_000,
    supportsStock: false,
    defaultStockShares: 0,
    defaultStockPrice: 0,
    structureSummary: "프랑스 르노 산하 법인으로 보상 구조가 국내 완성차 대기업과 다릅니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];

export const ABC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];

export const ABC_TERMS: AutoBonusTermGuide[] = [
  {
    term: "격려금",
    companies: "현대차, 기아 등",
    meaning: "임단협 결과 지급하는 일시금으로 정액·자사주·상품권이 혼합될 수 있음",
    caution: "정액 부분과 자사주 부분을 현금으로 합산하지 않는 것이 안전합니다.",
  },
  {
    term: "자사주",
    companies: "현대차, 기아 등",
    meaning: "임단협 패키지에 포함된 자기 회사 주식 지급",
    caution: "주가 변동에 따라 가치가 달라지며 처분 조건·취득 세금이 현금 성과급과 다릅니다.",
  },
  {
    term: "임단협",
    companies: "자동차 업계 전반",
    meaning: "임금 및 단체협약 교섭 과정에서 합의되는 보상 패키지",
    caution: "요구안·제시안·잠정합의안·확정안을 반드시 구분해야 합니다.",
  },
  {
    term: "요구안",
    companies: "노조",
    meaning: "교섭 전 또는 교섭 중 노조 측이 요구하는 금액 또는 조건",
    caution: "확정된 지급액이 아니며 계산기에는 시나리오로만 사용해야 합니다.",
  },
];

export const ABC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/hyundai-bonus/",
    label: "현대차 성과급 계산기",
    description: "현대차 격려금·자사주 포함 총보상을 상세히 계산합니다.",
  },
  {
    href: "/tools/bonus-simulator/",
    label: "일반 성과급 계산기",
    description: "단일 성과급 금액을 빠르게 계산합니다.",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령액 계산기",
    description: "성과급에서 세금과 4대보험을 뺀 금액을 더 자세히 추정합니다.",
  },
  {
    href: "/tools/semiconductor-bonus-comparison/",
    label: "반도체 성과급 비교 계산기",
    description: "삼성전자·SK하이닉스 등 반도체 업종 성과급을 비교합니다.",
  },
  {
    href: "/tools/shipbuilding-bonus-comparison/",
    label: "조선업 성과급 비교 계산기",
    description: "HD현대중공업·한화오션 등 조선업 성과급을 비교합니다.",
  },
];

export const ABC_FAQS: FaqItem[] = [
  {
    question: "현대차와 기아 성과급은 어떻게 비교해야 하나요?",
    answer:
      "같은 현대차그룹 계열이지만 임단협은 별도로 진행됩니다. 격려금·자사주·정액 현금 패키지 구성이 다를 수 있으므로 같은 기준 연봉으로 세전·세후·월평균을 함께 비교해야 합니다.",
  },
  {
    question: "자사주는 어떻게 계산에 반영하나요?",
    answer:
      "주가 기준 환산액을 참고용으로 표시합니다. 처분 조건과 취득 세금이 현금 성과급과 다르므로 현금 비교와 분리해서 보여줍니다.",
  },
  {
    question: "한국GM이나 르노코리아 성과급도 계산할 수 있나요?",
    answer:
      "가능합니다. 외국계 자동차사는 국내 대기업과 노사 구조가 달라 직접 비교가 어려우므로 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "임단협 요구안 금액을 그대로 넣어도 되나요?",
    answer:
      "계산은 가능하지만 요구안은 확정 지급액이 아닙니다. 요구안·제시안·잠정합의안·최종 합의안을 구분해서 입력해야 합니다.",
  },
  {
    question: "자동차 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer:
      "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 임단협 합의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
  {
    question: "기본 입력값은 실제 회사 지급률인가요?",
    answer:
      "아닙니다. 기본 입력값은 계산 흐름을 보여주기 위한 예시값입니다. 실제 비교가 필요하면 회사 공지, 임단협 결과, 급여 기준에 맞게 직접 수정해야 합니다.",
  },
];
