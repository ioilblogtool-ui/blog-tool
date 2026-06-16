export type BigtechCompanyId = "kakao" | "naver" | "toss" | "line" | "coupang";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface BigtechCompanyConfig {
  id: BigtechCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  stockNote: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const BIGTECH_COMPANIES: BigtechCompanyConfig[] = [
  {
    id: "kakao",
    name: "카카오",
    shortName: "카카오",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 1.5,
    defaultFixedAmount: 0,
    structureSummary: "사업부·계열사별 성과에 따른 현금 성과급(PS) 구조로 알려져 있습니다.",
    stockNote: "직군·연차에 따라 스톡옵션이 부여되는 경우가 있으나 대상·규모는 개별 계약에 따라 다릅니다.",
    caution: "카카오뱅크·카카오페이 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "naver",
    name: "네이버",
    shortName: "네이버",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 15,
    defaultMonthlyMultiple: 1.5,
    defaultFixedAmount: 0,
    structureSummary: "사업 성과 및 개인 평가에 따른 현금 성과급(인센티브) 구조로 알려져 있습니다.",
    stockNote: "스톡그랜트(주식 보상) 프로그램을 운영한 사례가 있으며 대상·규모는 시기별로 다릅니다.",
    caution: "네이버웹툰·네이버클라우드 등 계열사별로 보상 구조가 다를 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "toss",
    name: "토스(비바리퍼블리카)",
    shortName: "토스",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2.0,
    defaultFixedAmount: 0,
    structureSummary: "연봉 자체가 업계 상위 수준이며 성과 기반 현금 보너스 구조로 알려져 있습니다.",
    stockNote: "초기 입사자 중심으로 스톡옵션이 부여된 사례가 많으며, 최근에는 RSU 방식도 병행하는 것으로 알려져 있습니다.",
    caution: "비상장사로 스톡옵션 행사 가능 시기·가치는 불확실하며, 직군·연차별 편차가 큽니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "line",
    name: "라인플러스",
    shortName: "라인",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 12,
    defaultMonthlyMultiple: 1.2,
    defaultFixedAmount: 0,
    structureSummary: "일본 본사(LY Corporation) 실적 연동 구조이며, 국내법인(라인플러스) 기준 현금 성과급이 지급됩니다.",
    stockNote: "일본 본사 주식 기반 보상(RSU)이 부여되는 경우가 있으며 환율 변동에 따라 원화 환산 실수령액이 달라질 수 있습니다.",
    caution: "본사 실적과 환율 영향을 받으므로 연도별 편차가 클 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "coupang",
    name: "쿠팡",
    shortName: "쿠팡",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "미국 상장사(NYSE: CPNG)로 현금 성과급보다 RSU(양도제한조건부주식) 비중이 높은 구조입니다.",
    stockNote: "입사 시 RSU 부여가 일반적이며 Vesting 스케줄(보통 4년)에 따라 주식이 지급됩니다. 주가 변동에 따라 실수령 가치가 달라집니다.",
    caution: "직군(개발/물류/운영)별 보상 구조 차이가 크며, 현금 성과급만으로 비교하면 실질 보상을 과소평가할 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const BIGTECH_SIMPLE_TAX_RATE = 0.22;

export interface BigtechCompanyProfile {
  id: BigtechCompanyId;
  averageSalary: string;
  employeeCount: string;
  stockType: string;
  recentBonus: string;
}

export const BIGTECH_COMPANY_PROFILES: BigtechCompanyProfile[] = [
  { id: "kakao",   averageSalary: "약 1억 1,000만 원",  employeeCount: "약 3,800명",        stockType: "스톡옵션",       recentBonus: "비공개" },
  { id: "naver",   averageSalary: "약 1억 3,000만 원",  employeeCount: "약 4,500명",        stockType: "스톡그랜트",     recentBonus: "비공개" },
  { id: "toss",    averageSalary: "약 1억 5,000만 원+", employeeCount: "약 2,000명",        stockType: "스톡옵션/RSU",   recentBonus: "비공개" },
  { id: "line",    averageSalary: "약 1억 원",           employeeCount: "약 1,000명",        stockType: "본사 RSU(엔화)", recentBonus: "비공개" },
  { id: "coupang", averageSalary: "약 1억 원+",          employeeCount: "약 5,000명(본사)", stockType: "RSU(USD)",       recentBonus: "비공개" },
];

export const BIGTECH_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 성과급 지급률은 각 사가 공식적으로 공개한 경우에만 표기했으며, 비공개 항목은 '비공개'로 표시했습니다.";

export interface FaqItem {
  question: string;
  answer: string;
}

export const BIGTECH_BONUS_FAQ: FaqItem[] = [
  {
    question: "카카오와 네이버 중 성과급이 더 많은 곳은 어디인가요?",
    answer: "연도와 사업부 실적에 따라 다르며, 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 실제 수령액은 개인 평가와 소속 계열사에 따라 크게 달라집니다.",
  },
  {
    question: "토스 성과급은 왜 기본값이 20%로 높게 설정되어 있나요?",
    answer: "토스(비바리퍼블리카)는 연봉 자체가 업계 상위 수준이며, 성과 기반 현금 보너스가 상대적으로 높다는 업계 추정을 반영한 시뮬레이션 기본값입니다. 실제 지급률은 회사 및 개인 성과에 따라 다릅니다.",
  },
  {
    question: "쿠팡은 왜 현금 성과급 기본값이 낮게 설정되어 있나요?",
    answer: "쿠팡은 현금 성과급보다 RSU(양도제한조건부주식) 비중이 높은 보상 구조로 알려져 있습니다. 이 계산기는 현금 성과급만 시뮬레이션하므로, RSU를 포함한 실질 총보상은 훨씬 높을 수 있습니다.",
  },
  {
    question: "라인플러스 성과급에 환율이 영향을 미치나요?",
    answer: "라인플러스는 일본 본사(LY Corporation) 실적과 연동된 구조이며, 일본 본사 주식 기반 RSU가 부여되는 경우 엔화 환율에 따라 원화 환산 실수령액이 달라질 수 있습니다.",
  },
  {
    question: "스톡옵션·RSU는 왜 계산기에 포함되지 않나요?",
    answer: "스톡옵션과 RSU는 주가·환율·Vesting 스케줄·행사 시점에 따라 가치가 크게 달라지므로, 단순 수치 비교가 오히려 오해를 유발할 수 있어 정성 설명 섹션으로만 안내하고 있습니다.",
  },
  {
    question: "이 계산기의 기본 지급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
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

export const BIGTECH_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교", description: "배달·이커머스 포함 IT 업계 비교" },
  { href: "/reports/it-salary-top10/", label: "국내 IT 연봉 TOP10", description: "IT 업계 직군별 연봉 순위" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 등 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급 한 번에 비교" },
];
