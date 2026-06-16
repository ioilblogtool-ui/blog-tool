export type GameCompanyId = "nexon" | "netmarble" | "ncsoft" | "krafton";
export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준";

export interface GameCompanyConfig {
  id: GameCompanyId;
  name: string;
  shortName: string;
  defaultMode: BonusInputMode;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
  structureSummary: string;
  volatilityNote: string;
  caution: string;
  badges: EvidenceBadge[];
}

export const GAME_COMPANIES: GameCompanyConfig[] = [
  {
    id: "nexon",
    name: "넥슨",
    shortName: "넥슨",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2.0,
    defaultFixedAmount: 0,
    structureSummary: "던전앤파이터 등 주요 IP 실적에 연동된 성과급 구조로 알려져 있습니다.",
    volatilityNote: "기존 IP 매출 안정성이 상대적으로 높아 예측 가능성이 있는 편으로 평가되기도 합니다. 다만 신작 성과에 따라 변동이 생길 수 있습니다.",
    caution: "직군(개발/기획/아트), 스튜디오, 연도별 실적에 따라 성과급 규모가 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "netmarble",
    name: "넷마블",
    shortName: "넷마블",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "신작 출시 성과와 그룹 전체 실적에 따른 성과급 구조로 알려져 있습니다.",
    volatilityNote: "신작 흥행 여부에 따라 연도별 편차가 큰 편으로 알려져 있습니다. 성과급 지급 여부 자체가 연도마다 달라질 수 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "ncsoft",
    name: "엔씨소프트",
    shortName: "엔씨소프트",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1.0,
    defaultFixedAmount: 0,
    structureSummary: "리니지 시리즈 등 핵심 IP 실적과 신작 성과에 연동된 구조로 알려져 있습니다.",
    volatilityNote: "핵심 IP 매출 추세와 신작 흥행 여부에 따라 성과급 규모가 크게 달라질 수 있는 것으로 알려져 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있습니다.",
    badges: ["추정", "시뮬레이션"],
  },
  {
    id: "krafton",
    name: "크래프톤",
    shortName: "크래프톤",
    defaultMode: "salaryPercent",
    defaultSalaryPercent: 25,
    defaultMonthlyMultiple: 2.5,
    defaultFixedAmount: 0,
    structureSummary: "PUBG 등 글로벌 IP 실적에 연동된 성과급 구조로, 업계 내 상대적으로 높은 편으로 언급되기도 합니다.",
    volatilityNote: "글로벌 매출 비중이 높아 환율·해외 시장 상황에 따른 변동성이 있습니다. 글로벌 신작 성과가 성과급 규모에 큰 영향을 미치는 것으로 알려져 있습니다.",
    caution: "직군, 스튜디오, 연도별 실적에 따라 달라질 수 있으며, 글로벌 출시 일정·성과에 따른 변동이 큽니다.",
    badges: ["추정", "시뮬레이션"],
  },
];

export const GAME_SIMPLE_TAX_RATE = 0.22;

export interface GameCompanyProfile {
  id: GameCompanyId;
  averageSalary: string;
  employeeCount: string;
  revenue: string;
  recentBonus: string;
}

export const GAME_COMPANY_PROFILES: GameCompanyProfile[] = [
  { id: "nexon",     averageSalary: "약 1억 2,000만 원",  employeeCount: "약 5,000명 (국내)",  revenue: "약 4조 원 (2024)",           recentBonus: "비공개" },
  { id: "netmarble", averageSalary: "약 8,000만 원",       employeeCount: "약 6,000명",         revenue: "약 2조 5,000억 원 (2024)",   recentBonus: "비공개" },
  { id: "ncsoft",    averageSalary: "약 1억 원",            employeeCount: "약 4,500명",         revenue: "약 1조 7,000억 원 (2024)",   recentBonus: "비공개" },
  { id: "krafton",   averageSalary: "약 1억 5,000만 원+",  employeeCount: "약 4,000명",         revenue: "약 2조 2,000억 원 (2024)",   recentBonus: "비공개" },
];

export const GAME_PROFILE_NOTE =
  "평균연봉·직원수는 사업보고서 및 업계 추정 기반 참고 정보입니다. 매출은 2024년 연간 기준 추정값이며, 성과급은 각 사가 공식 공개한 경우에만 표기하고 비공개 항목은 '비공개'로 표시했습니다.";

export interface FaqItem {
  question: string;
  answer: string;
}

export const GAME_BONUS_FAQ: FaqItem[] = [
  {
    question: "게임회사 성과급은 왜 연도마다 차이가 크나요?",
    answer: "게임업계 성과급은 신작 출시 성과와 기존 IP 매출 추세에 크게 의존합니다. 신작이 흥행하면 수백% 성과급이 지급된 사례도 있지만, 실적이 부진하면 성과급이 지급되지 않을 수도 있어 다른 업종 대비 변동 폭이 큰 편입니다.",
  },
  {
    question: "크래프톤 성과급이 높다는 말이 사실인가요?",
    answer: "크래프톤은 PUBG 글로벌 매출에 연동된 성과급 구조로 알려져 있으며, 업계 내에서 상대적으로 높은 수준으로 언급되기도 합니다. 다만 이는 추정 기반 정보이며 공식 확인된 수치가 아닙니다. 글로벌 신작 성과와 환율에 따라 연도별 편차가 있을 수 있습니다.",
  },
  {
    question: "넥슨과 크래프톤 중 성과급이 더 높은 곳은 어디인가요?",
    answer: "연도와 신작 성과에 따라 달라집니다. 이 계산기는 동일한 연봉·지급률 가정 하에서의 비교용 시뮬레이션만 제공합니다. 실제 수령액은 개인 평가, 소속 스튜디오, 연도별 실적에 따라 크게 달라집니다.",
  },
  {
    question: "이 계산기의 기본 성과급률은 공식 수치인가요?",
    answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 각 회사의 공식 지급률이 아닙니다. 알고 계신 수치가 있다면 직접 입력 모드로 조정해 사용하세요.",
  },
  {
    question: "게임 개발자와 기획자 성과급은 차이가 있나요?",
    answer: "직군별 성과급 차이에 대한 공식 데이터가 없어 이 계산기에서는 직군 구분 없이 동일한 연봉 대비 지급률로 계산합니다. 실제로는 직군·직급·소속 스튜디오·기여도에 따라 차이가 있을 수 있습니다.",
  },
  {
    question: "엔씨소프트 성과급은 최근 어떤 추세인가요?",
    answer: "엔씨소프트의 성과급 규모는 리니지 시리즈 등 핵심 IP 매출 추세와 신작 성과에 따라 변동하는 것으로 알려져 있습니다. 이 계산기는 추정 기반 시뮬레이션이므로 최신 지급 실적과 다를 수 있습니다.",
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

export const GAME_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/it-bigtech-bonus-comparison/",  label: "국내 빅테크 성과급 비교",     description: "카카오·네이버·토스·라인·쿠팡" },
  { href: "/tools/it-platform-bonus-comparison/", label: "IT 플랫폼 성과급 비교",       description: "배달·이커머스 포함 IT 업계 비교" },
  { href: "/reports/it-salary-top10/",            label: "국내 IT 연봉 TOP10",          description: "IT 업계 직군별 연봉 순위" },
  { href: "/tools/bonus-after-tax-calculator/",   label: "성과급 세후 실수령액 계산기", description: "성과급 세금을 정확히 계산" },
  { href: "/tools/bonus-simulator/",              label: "대기업 성과급 시뮬레이터",    description: "여러 대기업 성과급 한 번에 비교" },
];
