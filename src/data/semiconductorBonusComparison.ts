export type SemiconductorCompanyId =
  | "samsung"
  | "skHynix"
  | "dbHitek"
  | "samsungDisplay"
  | "lgDisplay"
  | "lxSemicon"
  | "wonikIps"
  | "hanmi";

export type SemiconductorCompanyGroup =
  | "integrated"
  | "memory"
  | "foundry"
  | "display"
  | "fabless"
  | "equipment";

export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";
export type EvidenceBadge = "추정" | "시뮬레이션" | "사용자 입력 기준" | "확인 필요";

export interface SemiconductorCompanyConfig {
  id: SemiconductorCompanyId;
  name: string;
  shortName: string;
  group: SemiconductorCompanyGroup;
  defaultSelected: boolean;
  defaultMode: BonusInputMode;
  defaultBonusTerm: string;
  defaultSalaryPercent: number;
  defaultMonthlyMultiple: number;
  defaultFixedAmount: number;
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

export interface BonusTermGuide {
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

export const SEMICONDUCTOR_BONUS_COMPANIES: SemiconductorCompanyConfig[] = [
  {
    id: "samsung",
    name: "삼성전자",
    shortName: "삼성전자",
    group: "integrated",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "OPI·TAI",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2,
    defaultFixedAmount: 0,
    structureSummary: "OPI·TAI 등 사업부 성과와 지급 기준에 따라 달라질 수 있습니다.",
    caution: "DS·DX 등 사업부, 직급, 평가, 지급 기준에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/samsung-bonus/",
    detailCtaLabel: "삼성전자 상세 계산",
  },
  {
    id: "skHynix",
    name: "SK하이닉스",
    shortName: "SK하이닉스",
    group: "memory",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "PS·PI",
    defaultSalaryPercent: 20,
    defaultMonthlyMultiple: 2,
    defaultFixedAmount: 0,
    structureSummary: "PS·PI 등 업황과 사업 성과에 연동되는 보상 구조로 볼 수 있습니다.",
    caution: "사업 실적, 지급 기준, 평가, 협의 결과에 따라 실제 금액이 달라질 수 있습니다.",
    badges: ["사용자 입력 기준", "시뮬레이션"],
    detailHref: "/tools/sk-hynix-bonus/",
    detailCtaLabel: "SK하이닉스 상세 계산",
  },
  {
    id: "dbHitek",
    name: "DB하이텍",
    shortName: "DB하이텍",
    group: "foundry",
    defaultSelected: true,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "사용자가 성과급률을 직접 입력해 비교하는 방식입니다.",
    caution: "공식 지급률을 단정하지 않으며, 입력값 기준의 비교 결과만 제공합니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "samsungDisplay",
    name: "삼성디스플레이",
    shortName: "삼성디스플레이",
    group: "display",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "디스플레이 계열 보상은 조직과 평가 기준에 따라 차이가 커 직접 입력이 적합합니다.",
    caution: "반도체 인접 산업 비교용이며 공식 지급률이 아닙니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "lgDisplay",
    name: "LG디스플레이",
    shortName: "LG디스플레이",
    group: "display",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 8,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "성과급률 또는 월급 개월 수를 직접 넣어 비교합니다.",
    caution: "회사별 지급 기준을 확정값으로 제시하지 않습니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "lxSemicon",
    name: "LX세미콘",
    shortName: "LX세미콘",
    group: "fabless",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 10,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "팹리스 회사는 직무와 실적 반영 방식이 달라 직접 입력으로 비교합니다.",
    caution: "입력 편의를 위한 예시값이며 실제 지급률이 아닙니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "wonikIps",
    name: "원익IPS",
    shortName: "원익IPS",
    group: "equipment",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 8,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "반도체 장비사는 업황과 프로젝트 성과의 영향을 받을 수 있습니다.",
    caution: "기본값은 비교 시작용 예시입니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
  {
    id: "hanmi",
    name: "한미반도체",
    shortName: "한미반도체",
    group: "equipment",
    defaultSelected: false,
    defaultMode: "salaryPercent",
    defaultBonusTerm: "직접 입력",
    defaultSalaryPercent: 8,
    defaultMonthlyMultiple: 1,
    defaultFixedAmount: 0,
    structureSummary: "장비 수요와 회사 실적에 따른 성과급 가정을 직접 입력합니다.",
    caution: "공식 평균 지급률이 아니라 사용자 입력 기준 비교입니다.",
    badges: ["추정", "사용자 입력 기준"],
  },
];

export const SBC_TAX_RATE_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0, maxAnnualSalary: 50_000_000, estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001, maxAnnualSalary: 80_000_000, estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001, maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.3, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null, estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];

export const SBC_TERMS: BonusTermGuide[] = [
  {
    term: "OPI",
    companies: "삼성전자",
    meaning: "연간 사업 성과를 기준으로 지급되는 성과 인센티브입니다.",
    caution: "사업부와 지급 기준에 따라 체감 차이가 클 수 있습니다.",
  },
  {
    term: "TAI",
    companies: "삼성전자",
    meaning: "목표 달성과 조직 성과를 반영하는 인센티브로 이해할 수 있습니다.",
    caution: "지급 기준과 대상은 시기별로 달라질 수 있습니다.",
  },
  {
    term: "PS",
    companies: "SK하이닉스",
    meaning: "초과이익분배 성격의 성과급으로 업황과 영업이익 영향을 크게 받습니다.",
    caution: "미래 지급분은 확정값이 아니라 시나리오로 봐야 합니다.",
  },
  {
    term: "PI",
    companies: "SK하이닉스",
    meaning: "생산성이나 목표 달성 성과를 반영하는 보상 항목입니다.",
    caution: "반기·연간 지급 구조와 기준급 정의를 함께 확인해야 합니다.",
  },
  {
    term: "특별성과급",
    companies: "여러 회사",
    meaning: "특정 실적, 합의, 일회성 보상으로 별도 지급되는 금액입니다.",
    caution: "반복 지급을 전제로 총보상에 넣으면 과대평가될 수 있습니다.",
  },
];

export const SBC_RELATED_CALCULATORS: RelatedCalculator[] = [
  {
    href: "/tools/samsung-bonus/",
    label: "삼성전자 OPI·TAI 상세 계산하기",
    description: "삼성전자 DS 특별성과급과 OPI·TAI 구조를 더 자세히 계산합니다.",
  },
  {
    href: "/tools/sk-hynix-bonus/",
    label: "SK하이닉스 PS·PI 상세 계산하기",
    description: "SK하이닉스 PS·PI와 미래 시나리오를 별도로 확인합니다.",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령액 계산하기",
    description: "성과급 총액에서 세금과 공제 후 통장 입금액을 더 자세히 추정합니다.",
  },
  {
    href: "/reports/corporate-bonus-comparison-2026/",
    label: "대기업 성과급 비교 리포트 보기",
    description: "업종별 성과급 구조와 총보상 차이를 리포트로 읽습니다.",
  },
];

export const SBC_FAQS: FaqItem[] = [
  {
    question: "삼성전자와 SK하이닉스 성과급은 어떻게 비교해야 하나요?",
    answer: "성과급 명칭보다 기준 금액을 먼저 봐야 합니다. 삼성전자는 OPI·TAI, SK하이닉스는 PS·PI처럼 용어가 다르지만 실제 비교는 기준 연봉, 기본급, 지급률, 세후 실수령액을 같은 조건으로 맞춘 뒤 보는 것이 좋습니다.",
  },
  {
    question: "DB하이텍 성과급도 계산할 수 있나요?",
    answer: "가능합니다. 다만 회사별 실제 지급률을 단정하지 않고 사용자가 성과급률, 월급 개월 수, 고정 금액을 직접 입력해 비교하는 방식으로 제공합니다.",
  },
  {
    question: "반도체 성과급 계산 결과는 실제 지급액과 같은가요?",
    answer: "아닙니다. 결과는 사용자가 입력한 조건을 바탕으로 한 시뮬레이션입니다. 실제 지급액은 회사, 사업부, 직급, 평가, 지급 기준, 노사 협의 결과, 세금 및 공제 방식에 따라 달라질 수 있습니다.",
  },
  {
    question: "성과급은 세후로 얼마나 줄어드나요?",
    answer: "성과급은 근로소득으로 과세되며 원천징수와 4대보험, 연말정산 결과에 따라 실수령액이 달라집니다. 이 페이지는 비교용 간편 공제율로 예상 세후 금액을 보여줍니다.",
  },
  {
    question: "삼성디스플레이와 LG디스플레이도 비교에 넣어도 되나요?",
    answer: "검색 의도상 삼성전자·SK하이닉스와 함께 디스플레이 계열 보상 비교를 찾는 사용자가 있어 반도체 인접 산업으로 구분해 포함했습니다.",
  },
  {
    question: "장비사와 팹리스 회사는 어떻게 비교하나요?",
    answer: "원익IPS, 한미반도체, LX세미콘처럼 회사별 성과급 구조가 표준화되어 공개되지 않은 경우가 많아 사용자가 성과급률을 직접 입력하는 방식이 가장 안전합니다.",
  },
];
