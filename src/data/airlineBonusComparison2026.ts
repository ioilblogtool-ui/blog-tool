export type AirlineCompanyId = "koreanair" | "asianaair" | "jejuair" | "twayair" | "jinair";
export type AirlineJobType = "pilot" | "cabinCrew" | "ground";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface AirlineCompanyConfig {
  id: AirlineCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const AIRLINE_COMPANIES: AirlineCompanyConfig[] = [
  {
    id: "koreanair",
    name: "대한항공",
    shortName: "대한항공",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "그룹 실적과 평가 기준에 따른 격려금·성과급 구조로 알려져 있습니다.",
    caution: "직군(운항/객실/일반직), 직급, 아시아나항공 통합 진행 상황에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "asianaair",
    name: "아시아나항공",
    shortName: "아시아나",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 8,
    defaultMonthlyMultiple: 0.8,
    defaultFixedAmount: 0,
    structureSummary: "실적 회복 추세에 따른 성과급 지급 가능성이 있는 것으로 알려져 있습니다.",
    caution: "대한항공과의 통합 진행 상황에 따라 보상 체계가 변경될 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jejuair",
    name: "제주항공",
    shortName: "제주항공",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 5,
    defaultMonthlyMultiple: 0.5,
    defaultFixedAmount: 0,
    structureSummary: "국내 LCC 1위 사업자로 실적에 따라 성과급 지급 규모가 변동하는 구조로 알려져 있습니다.",
    caution: "연도별 실적 변동에 따라 성과급 지급 여부와 규모가 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "twayair",
    name: "티웨이항공",
    shortName: "티웨이",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 4,
    defaultMonthlyMultiple: 0.4,
    defaultFixedAmount: 0,
    structureSummary: "LCC 2위권으로 성과급 관련 공개 정보가 제한적이며 실적에 따라 변동합니다.",
    caution: "성과급 관련 공식 공개 정보가 적어 추정 불확실성이 높습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "jinair",
    name: "진에어",
    shortName: "진에어",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 5,
    defaultMonthlyMultiple: 0.5,
    defaultFixedAmount: 0,
    structureSummary: "한진그룹 계열 LCC로 대한항공 실적과 연동된 구조를 가진 것으로 알려져 있습니다.",
    caution: "그룹 공통 기준 및 LCC 사업 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export interface AirlineJobTypeConfig {
  id: AirlineJobType;
  label: string;
  salaryRangeNote: string;
  avgSalaryHint: string;
}

export const AIRLINE_JOB_TYPES: AirlineJobTypeConfig[] = [
  {
    id: "pilot",
    label: "조종사",
    salaryRangeNote: "직급·기종·항공사에 따라 차이가 매우 큽니다.",
    avgSalaryHint: "기장 기준 약 1억 5,000만~3억 원 이상 (직급·기종·항공사별 추정)",
  },
  {
    id: "cabinCrew",
    label: "객실승무원",
    salaryRangeNote: "연차·직급에 따라 차이가 있습니다.",
    avgSalaryHint: "약 4,000만~8,000만 원 (연차·직급별 추정)",
  },
  {
    id: "ground",
    label: "일반직(지상직)",
    salaryRangeNote: "사무직 평균 수준으로 참고하세요.",
    avgSalaryHint: "약 5,000만~1억 원 (직급별 추정)",
  },
];

export const AIRLINE_SIMPLE_TAX_RATE = 0.22;

export interface AirlineCompanyProfile {
  id: AirlineCompanyId;
  averageSalary: string;
  employeeCount: string;
  revenue: string;
  recentBonus: string;
}

export const AIRLINE_COMPANY_PROFILES: AirlineCompanyProfile[] = [
  { id: "koreanair", averageSalary: "약 1억 원",       employeeCount: "약 19,000명", revenue: "약 16조 원 (2024)",             recentBonus: "비공개" },
  { id: "asianaair", averageSalary: "약 8,000만 원",   employeeCount: "약 9,000명",  revenue: "약 7조 원 (2024)",              recentBonus: "비공개" },
  { id: "jejuair",   averageSalary: "약 6,000만 원",   employeeCount: "약 4,000명",  revenue: "약 1조 7,000억 원 (2024)",      recentBonus: "비공개" },
  { id: "twayair",   averageSalary: "약 5,500만 원",   employeeCount: "약 3,000명",  revenue: "약 1조 원 (2024)",              recentBonus: "비공개" },
  { id: "jinair",    averageSalary: "약 5,500만 원",   employeeCount: "약 2,800명",  revenue: "약 9,000억 원 (2024)",          recentBonus: "비공개" },
];

export const AIRLINE_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 매출은 2024년 연간 기준 추정값이며, 성과급은 각 사가 공식 공개한 경우에만 표기하고 비공개 항목은 '비공개'로 표시했습니다.";

export interface FaqItem {
  question: string;
  answer: string;
}

export const AIRLINE_BONUS_FAQ: FaqItem[] = [
  {
    question: "대한항공과 아시아나항공 통합 이후 성과급 구조는 어떻게 바뀌나요?",
    answer: "대한항공·아시아나 통합은 현재 진행 중이며, 통합 이후 보상 체계는 아직 확정되지 않았습니다. 이 계산기의 아시아나항공 기본값은 통합 이전 구조를 기준으로 한 추정 시뮬레이션입니다.",
  },
  {
    question: "조종사 성과급은 일반직과 어떻게 다른가요?",
    answer: "조종사는 기본급 외에 비행수당·노선수당 등 변동 보상이 별도로 지급되는 경우가 많아, 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다. 이 계산기는 현금 성과급 시뮬레이션만 제공합니다.",
  },
  {
    question: "이 계산기의 기본 성과급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
  },
  {
    question: "LCC(저비용항공사) 성과급은 대형 항공사와 얼마나 차이가 나나요?",
    answer: "일반적으로 대형 항공사(FSC)가 LCC보다 성과급 규모가 크고 안정적인 것으로 알려져 있습니다. 다만 실적 호조 시 LCC도 성과급을 지급하는 사례가 있으며, 회사별·연도별 편차가 큽니다.",
  },
  {
    question: "진에어는 대한항공 계열이라 성과급도 같은가요?",
    answer: "진에어는 한진그룹 계열 LCC로 대한항공 실적과 연동된 부분이 있지만, 독립 법인으로서 별도 보상 체계를 운영합니다. 대한항공과 동일한 수준의 성과급을 보장하지 않습니다.",
  },
  {
    question: "객실승무원 성과급은 어떤 방식으로 산정되나요?",
    answer: "객실승무원 성과급은 회사 실적, 개인 평가, 직급에 따라 결정되는 것으로 알려져 있습니다. 이 계산기는 정확한 산정 기준을 알 수 없어 사용자 입력 기준 시뮬레이션으로만 제공합니다.",
  },
  {
    question: "세후 금액은 어떻게 계산되나요?",
    answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 세후 금액은 성과급 세후 실수령액 계산기를 이용하세요.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const AIRLINE_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/shipbuilding-bonus-comparison/",  label: "조선사 성과급 비교",           description: "HD현대·삼성중공업·한화오션 비교" },
  { href: "/tools/telecom-bonus-comparison/",       label: "통신사 성과급 비교",           description: "KT·SKT·LG유플러스 비교" },
  { href: "/tools/auto-bonus-comparison/",          label: "자동차 성과급 비교",           description: "현대차·기아·GM코리아 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/",     label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/",                label: "대기업 성과급 시뮬레이터",    description: "여러 대기업 성과급 한 번에 비교" },
];
