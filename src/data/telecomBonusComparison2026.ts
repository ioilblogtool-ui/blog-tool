export type TelecomCompanyId = "kt" | "skt" | "lguplus";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface TelecomCompanyConfig {
  id: TelecomCompanyId;
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

export const TELECOM_SIMPLE_TAX_RATE = 0.22;

export const TELECOM_COMPANIES: TelecomCompanyConfig[] = [
  {
    id: "kt",
    name: "KT",
    shortName: "KT",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 13,
    defaultMonthlyMultiple: 1.3,
    defaultFixedAmount: 0,
    structureSummary: "그룹 경영 실적과 평가 결과에 따른 PS(성과급) 구조로 알려져 있습니다.",
    caution: "직군(본사/계열사), 평가, 노사 합의에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "skt",
    name: "SK텔레콤",
    shortName: "SKT",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 1.5,
    defaultFixedAmount: 0,
    structureSummary: "SK그룹 평가 기준에 따른 PS·격려금 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "lguplus",
    name: "LG유플러스",
    shortName: "LG유플러스",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 1.2,
    defaultFixedAmount: 0,
    structureSummary: "LG그룹 공통 성과급 기준에 따른 구조로 알려져 있습니다.",
    caution: "그룹 공통 기준과 개인/조직 평가에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const TELECOM_BONUS_FAQ: FaqItem[] = [
  {
    question: "통신 3사 성과급(PS)은 어떻게 산정되나요?",
    answer: "KT·SK텔레콤·LG유플러스 모두 그룹 경영 실적과 개인/조직 평가 결과에 따른 이익배분제(PS) 구조로 알려져 있습니다. 정확한 산정 기준은 각 회사의 공식 발표를 참고하세요.",
  },
  {
    question: "이 계산기의 기본 지급률(13%, 15%, 12%)은 확정된 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 매년 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요.",
  },
  {
    question: "KT, SKT, LG유플러스 중 어디가 성과급이 더 많은가요?",
    answer: "연도와 실적에 따라 다르며, 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 특정 회사가 더 우수하다고 단정할 수 없습니다.",
  },
  {
    question: "세후로 얼마나 받게 되나요?",
    answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간편 공제율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 실수령액 계산기를 이용하세요.",
  },
  {
    question: "회사별로 성과급 입력 방식이 다른 이유는 무엇인가요?",
    answer: "통신사마다 성과급을 연봉 대비 비율, 월급의 개월 수, 또는 고정 금액으로 발표하는 경우가 있어, 사용자가 알고 있는 정보에 맞춰 입력 방식을 선택할 수 있도록 구성했습니다.",
  },
  {
    question: "다른 업종 성과급과 비교하려면 어떻게 하나요?",
    answer: "반도체 성과급 비교, 금융권 성과급 비교 등 다른 업종별 비교 계산기와 대기업 성과급 비교 리포트를 함께 확인할 수 있습니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface TelecomCompanyProfile {
  id: TelecomCompanyId;
  averageSalary: string;
  tenureYears: string;
  employeeCount: string;
  revenue: string;
  operatingProfit: string;
  recentBonus: string;
}

export const TELECOM_COMPANY_PROFILES: TelecomCompanyProfile[] = [
  {
    id: "kt",
    averageSalary: "1억 700만 원",
    tenureYears: "22.0년",
    employeeCount: "19,727명",
    revenue: "28조 2,442억 원",
    operatingProfit: "2조 4,691억 원",
    recentBonus: "비공개",
  },
  {
    id: "skt",
    averageSalary: "1억 6,100만 원",
    tenureYears: "13.7년",
    employeeCount: "약 5,500명",
    revenue: "17조 992억 원",
    operatingProfit: "1조 732억 원",
    recentBonus: "비공개",
  },
  {
    id: "lguplus",
    averageSalary: "1억 900만 원",
    tenureYears: "10.6년",
    employeeCount: "비공개",
    revenue: "15조 4,517억 원",
    operatingProfit: "8,921억 원",
    recentBonus: "405% (2024년, 전년 대비 +45%p)",
  },
];

export const TELECOM_PROFILE_NOTE =
  "평균연봉·근속연수·직원수는 2024년 사업보고서(금융감독원 전자공시) 기준이며, 매출·영업이익은 2025년 연간 실적 발표 기준 참고 정보입니다. 성과급 지급률은 각 사가 공식적으로 공개한 경우에만 표기했으며, 비공개 항목은 '비공개'로 표시했습니다.";

export const TELECOM_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향" },
  { href: "/tools/finance-bonus-comparison/", label: "금융권 성과급 비교", description: "은행·증권·보험 성과급 비교" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
