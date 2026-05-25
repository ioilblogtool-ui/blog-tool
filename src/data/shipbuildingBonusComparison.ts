export type ShipbuildingCompanyId =
  | "hdHyundaiHeavy"
  | "hanwhaOcean"
  | "samsungHeavy";

export type ShipbuildingCompanyGroup =
  | "largeShipbuilder"
  | "midShipbuilder"
  | "marineEngine"
  | "equipment"
  | "defense";

export type BonusInputMode = "monthlyMultiple" | "salaryPercent" | "fixedAmount" | "mixed";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface ShipbuildingCompanyConfig {
  id: ShipbuildingCompanyId;
  name: string;
  shortName: string;
  group: ShipbuildingCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultPaymentLabel: string;
  defaultMonthlyMultiple: number;
  defaultSalaryPercent: number;
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

export interface ShipbuildingTermGuide {
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

export const SHBC_META = {
  title: "조선업 성과급 비교 계산기 2026",
  seoTitle: "조선업 성과급 비교 계산기 2026 | HD현대중공업·한화오션·삼성중공업",
  seoDescription:
    "HD현대중공업, 한화오션, 삼성중공업 등 주요 조선사의 성과급을 같은 연봉·월급 기준으로 비교해보세요. 월급 n개월, 고정 격려금, 성과급률을 입력하면 세전 성과급, 예상 세후 실수령액, 월평균 환산액, 성과급 포함 총보상을 시뮬레이션합니다.",
  dataNote:
    "이 계산기는 사용자가 입력한 연봉, 월 기본급, 성과급 조건을 기준으로 한 비교용 시뮬레이션입니다.",
};

export const SHIPBUILDING_BONUS_COMPANIES: ShipbuildingCompanyConfig[] = [
  {
    id: "hdHyundaiHeavy",
    name: "HD현대중공업",
    shortName: "HD현대중공업",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·격려금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "월급 n개월, 고정 격려금, 임단협 지급액이 섞일 수 있어 혼합 입력이 적합합니다.",
    caution: "사업장, 직군, 직급, 임단협 결과에 따라 실제 지급액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
  {
    id: "hanwhaOcean",
    name: "한화오션",
    shortName: "한화오션",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·특별격려금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "인수 이후 보상 체계, 임단협, 특별격려금 이슈를 사용자가 직접 입력해 비교합니다.",
    caution: "요구안과 최종 합의안은 다르므로 입력값의 상태를 구분해야 합니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
  {
    id: "samsungHeavy",
    name: "삼성중공업",
    shortName: "삼성중공업",
    group: "largeShipbuilder",
    defaultSelected: true,
    defaultMode: "mixed",
    defaultPaymentLabel: "성과급·상여금",
    defaultMonthlyMultiple: 1,
    defaultSalaryPercent: 0,
    defaultFixedAmount: 3_000_000,
    structureSummary: "성과급률, 월급 n개월, 고정 지급액을 직접 입력해 조선 3사 비교에 사용합니다.",
    caution: "회사의 실제 지급 기준, 직군, 평가, 지급월에 따라 실수령액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
  },
];

export const SHBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];

export const SHBC_TERMS: ShipbuildingTermGuide[] = [
  {
    term: "월급 n개월",
    meaning: "월 기본급 또는 기준 월급에 지급 개월 수를 곱해 성과급을 계산하는 방식",
    caution: "기준이 통상임금인지 기본급인지 회사별로 확인해야 합니다.",
  },
  {
    term: "고정 격려금",
    meaning: "성과급률과 별도로 정액 지급되는 격려금 또는 특별 지급액",
    caution: "일회성 지급일 수 있어 매년 반복된다고 보기 어렵습니다.",
  },
  {
    term: "임단협 지급액",
    meaning: "임금·단체협약 과정에서 합의되는 지급액",
    caution: "요구안, 제시안, 잠정 합의안, 최종 합의안을 구분해야 합니다.",
  },
  {
    term: "혼합 지급",
    meaning: "월급 n개월, 연봉 대비 %, 고정 지급액이 함께 들어가는 방식",
    caution: "항목별 과세와 지급 시점은 회사 급여 처리에 따라 달라질 수 있습니다.",
  },
];

export const SHBC_RELATED_CALCULATORS: RelatedCalculator[] = [
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
    href: "/tools/hyundai-bonus/",
    label: "현대차 성과급 계산기",
    description: "자동차 업종 성과급 패키지를 확인합니다.",
  },
];

export const SHBC_FAQS: FaqItem[] = [
  {
    question: "조선업 성과급은 어떻게 계산하나요?",
    answer:
      "회사마다 다르지만 월급 n개월, 연봉 대비 %, 고정 격려금, 특별성과급 등이 섞일 수 있습니다. 이 계산기는 사용자가 입력한 조건을 기준으로 세전·세후·월평균 금액을 비교합니다.",
  },
  {
    question: "HD현대중공업, 한화오션, 삼성중공업 성과급을 직접 비교할 수 있나요?",
    answer:
      "가능합니다. 다만 실제 지급액을 단정하지 않고 같은 연봉과 월 기본급을 기준으로 사용자가 입력한 성과급 조건을 비교하는 방식입니다.",
  },
  {
    question: "조선업 생산직 성과급도 계산할 수 있나요?",
    answer:
      "가능합니다. 월 기본급과 지급 개월 수, 고정 지급액을 직접 입력하면 생산직 기준으로도 시뮬레이션할 수 있습니다. 실제 지급 기준은 회사와 사업장, 직군, 협의 결과에 따라 달라질 수 있습니다.",
  },
  {
    question: "임단협 요구안 금액을 그대로 넣어도 되나요?",
    answer:
      "계산은 가능하지만 요구안은 확정 지급액이 아닙니다. 요구안, 제시안, 잠정 합의안, 최종 합의안을 구분해서 입력해야 합니다.",
  },
  {
    question: "조선업 성과급은 세후로 얼마나 줄어드나요?",
    answer:
      "성과급은 근로소득으로 과세되며 지급월 급여, 부양가족, 4대보험, 연말정산 결과에 따라 실수령액이 달라질 수 있습니다. 이 페이지는 비교용 간편 공제율로 예상 세후 금액을 보여줍니다.",
  },
  {
    question: "기본 입력값은 실제 회사 지급률인가요?",
    answer:
      "아닙니다. 기본 입력값은 계산 흐름을 보여주기 위한 예시값입니다. 실제 비교가 필요하면 회사 공지, 임단협 결과, 급여 기준에 맞게 직접 수정해야 합니다.",
  },
];
