export type OilRefineryCompanyId =
  | "skInnovation"
  | "gsCaltex"
  | "soil"
  | "hdHyundaiOilbank"
  | "lotteChemical";

export type OilRefineryCompanyGroup =
  | "domestic"
  | "foreignAffiliate"
  | "petrochemical";

export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface OilRefineryCompanyConfig {
  id: OilRefineryCompanyId;
  name: string;
  shortName: string;
  group: OilRefineryCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultBonusTerm: string;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface OilRefineryTermGuide {
  term: string;
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

export const ORBC_META = {
  title: "정유 성과급 비교 계산기 2026",
  seoTitle: "SK이노베이션·GS칼텍스·S-OIL·현대오일뱅크 성과급 비교 계산기 2026",
  seoDescription:
    "SK이노베이션, GS칼텍스, S-OIL(에쓰오일), HD현대오일뱅크 등 정유·석유화학 기업의 성과급을 연봉·월급·성과급률 기준으로 비교해보세요. 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 한 번에 시뮬레이션합니다.",
  dataNote:
    "이 계산기는 사용자가 입력한 연봉과 성과급률을 기준으로 한 비교용 시뮬레이션입니다.",
};

export const OIL_REFINERY_BONUS_COMPANIES: OilRefineryCompanyConfig[] = [
  {
    id: "skInnovation",
    name: "SK이노베이션 / SK에너지",
    shortName: "SK이노베이션",
    group: "domestic",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "PS·PI",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "SK그룹 공통 PS·PI 구조를 참고하며, 실제 지급률은 사용자가 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "gsCaltex",
    name: "GS칼텍스",
    shortName: "GS칼텍스",
    group: "domestic",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "GS그룹·쉐브론 합작 법인으로 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "soil",
    name: "S-OIL (에쓰오일)",
    shortName: "S-OIL",
    group: "foreignAffiliate",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "사우디아람코 산하 법인으로 보상 구조가 다를 수 있습니다. 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "hdHyundaiOilbank",
    name: "HD현대오일뱅크",
    shortName: "현대오일뱅크",
    group: "domestic",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "HD현대그룹 계열 정유사로 성과급률을 직접 입력해 비교합니다.",
    caution: "공식 지급률을 단정하지 않으며 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "lotteChemical",
    name: "롯데케미칼",
    shortName: "롯데케미칼",
    group: "petrochemical",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "성과급",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 0,
    defaultFixedAmount: 0,
    structureSummary: "정유 인접 석유화학 대표군으로 포함. 성과급률을 직접 입력해 비교합니다.",
    caution: "석유화학 업종으로 정유사와 실적 구조가 다릅니다. 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];

export const ORBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];

export const ORBC_TERMS: OilRefineryTermGuide[] = [
  {
    term: "PS (Profit Sharing)",
    meaning: "SK 계열에서 사용하는 초과이익분배 성격의 성과급으로 실적·영업이익과 연동될 수 있음",
    caution: "법인별·연도별 지급 기준이 다를 수 있으므로 반드시 확인해야 합니다.",
  },
  {
    term: "PI (Productivity Incentive)",
    meaning: "생산성·목표 달성에 연동되는 인센티브로 반기 또는 연간 지급",
    caution: "지급 구조와 기준급 산식을 회사별로 확인해야 합니다.",
  },
  {
    term: "특별성과급",
    meaning: "특정 실적·협의 결과에 따른 일시적 성과 보상",
    caution: "일회성일 수 있어 매년 반복된다고 보기 어렵습니다.",
  },
  {
    term: "정제마진",
    meaning: "원유를 정제해 석유제품을 판매할 때 발생하는 마진으로 정유사 실적의 핵심 변수",
    caution: "정제마진 변동에 따라 정유사 성과급이 달라질 수 있으나 회사별 산식이 다릅니다.",
  },
];

export const ORBC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/auto-bonus-comparison/",
    label: "자동차 성과급 비교 계산기",
    description: "현대차·기아·현대모비스·한국GM·르노코리아 성과급을 비교합니다.",
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
];

export const ORBC_FAQS: FaqItem[] = [
  {
    question: "SK이노베이션과 GS칼텍스 성과급은 어떻게 비교해야 하나요?",
    answer:
      "같은 연봉 기준으로 성과급률·월급 개월 수를 맞춰 세전·세후·월평균을 함께 비교하는 것이 좋습니다. 성과급 명칭보다 기준 금액과 세후 실수령액이 중요합니다.",
  },
  {
    question: "S-OIL(에쓰오일) 성과급도 계산할 수 있나요?",
    answer:
      "가능합니다. 다만 회사별 실제 지급률을 단정하지 않고 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "정유 성과급은 유가 상승 시 더 많이 받나요?",
    answer:
      "정유사 실적은 정제마진·유가·판매량에 영향을 받으며 성과급과 연동될 수 있습니다. 다만 지급 구조는 회사마다 다르므로 일반화하기 어렵고, 실제 지급액은 확정 시점에 확인해야 합니다.",
  },
  {
    question: "롯데케미칼도 정유 성과급 비교에 넣어도 되나요?",
    answer:
      "가능합니다. 롯데케미칼은 석유화학 계열이지만 정유 인접 직군에서 함께 비교하는 수요가 있습니다. 본문에서는 석유화학 인접 산업으로 구분해 표현합니다.",
  },
  {
    question: "정유 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer:
      "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 직급, 평가, 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
  {
    question: "기본 성과급률은 실제 회사 지급률인가요?",
    answer:
      "아닙니다. 기본 성과급률은 입력 편의를 위한 예시값이며 공식 지급률이 아닙니다. 실제 비교가 필요하면 회사별 지급 기준에 맞게 직접 수정해 주세요.",
  },
];
