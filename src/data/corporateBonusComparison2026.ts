export type BonusEvidenceBadge =
  | "확정"
  | "요구안"
  | "제시안"
  | "잠정합의"
  | "컨센서스"
  | "시뮬레이션"
  | "확인 필요";

export type BonusCompanyId = "integrated" | "samsung" | "skHynix" | "hyundai";
export type BonusIndustry = "semiconductor" | "auto" | "it" | "battery" | "finance" | "construction";
export type VolatilityLevel = "낮음" | "중간" | "높음" | "매우 높음";
export type Tone = "positive" | "neutral" | "caution";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url?: string;
  badge: BonusEvidenceBadge;
  asOf: string;
  note?: string;
}

export interface BonusSummaryCard {
  label: string;
  value: string;
  description: string;
  badge: BonusEvidenceBadge;
  tone: Tone;
}

export interface CorporateBonusCompany {
  id: BonusCompanyId;
  name: string;
  shortName: string;
  industry: BonusIndustry;
  primaryTerms: string[];
  latestStatus: BonusEvidenceBadge;
  headline: string;
  formulaSummary: string;
  key2026Point: string;
  volatility: VolatilityLevel;
  calculatorHref: string;
  ctaLabel: string;
  keyRisks: string[];
  sourceIds: string[];
}

export interface BonusTerm {
  term: string;
  companies: string;
  meaning: string;
  caution: string;
}

export interface SalaryBonusScenario {
  salary: number;
  salaryLabel: string;
  samsungBonus: number;
  skHynixBonus: number;
  hyundaiBonus: number;
  taxNote: string;
  badge: BonusEvidenceBadge;
}

export interface TaxWaterfallItem {
  label: string;
  amount: number;
  type: "gross" | "deduction" | "net";
  note: string;
}

export interface IndustryCycleItem {
  industry: BonusIndustry;
  label: string;
  mainVariable: string;
  volatility: VolatilityLevel;
  comment: string;
}

export interface CalculatorHubItem {
  label: string;
  href: string;
  description: string;
  badge: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const CORPORATE_BONUS_META = {
  slug: "corporate-bonus-comparison-2026",
  title: "2026 대기업 성과급 완전 비교",
  description:
    "2026년 삼성전자, SK하이닉스, 현대자동차 등 주요 대기업 성과급 산식과 지급률, 노조 요구안, 확정 지급안, 세후 체감액을 비교합니다.",
  category: "성과급 비교",
  updatedAt: "2026년 5월 기준",
} as const;

export const CBC_SUMMARY_CARDS: BonusSummaryCard[] = [
  {
    label: "비교 핵심",
    value: "기준급부터 확인",
    description: "성과급 지급률은 연봉 기준인지 기준급 기준인지에 따라 체감액이 크게 달라집니다.",
    badge: "확인 필요",
    tone: "neutral",
  },
  {
    label: "2026 검색 수요",
    value: "반도체 성과급",
    description: "SK하이닉스와 삼성전자 성과급 격차가 채용·이직 관심으로 이어지고 있습니다.",
    badge: "컨센서스",
    tone: "positive",
  },
  {
    label: "주의할 숫자",
    value: "노조 요구안",
    description: "요구안은 확정 지급안이 아니므로 별도 시나리오로만 다룹니다.",
    badge: "요구안",
    tone: "caution",
  },
  {
    label: "실수령 핵심",
    value: "세후 체감액",
    description: "고액 성과급은 근로소득 과세와 초과누진 구조 때문에 세전 금액과 차이가 큽니다.",
    badge: "시뮬레이션",
    tone: "caution",
  },
];

export const CBC_COMPANIES: CorporateBonusCompany[] = [
  {
    id: "integrated",
    name: "대기업 성과급 시뮬레이터",
    shortName: "통합 비교",
    industry: "semiconductor",
    primaryTerms: ["총보상", "성과급", "시나리오"],
    latestStatus: "시뮬레이션",
    headline: "삼성전자·SK하이닉스·현대차 성과급을 한 화면에서 비교합니다.",
    formulaSummary: "회사별 계산기 기본값을 통합해 연봉·직급별 총보상 흐름을 비교합니다.",
    key2026Point: "개별 회사 계산기로 들어가기 전 비교 허브 역할",
    volatility: "높음",
    calculatorHref: "/tools/bonus-simulator/",
    ctaLabel: "4개 회사 성과급 한 번에 비교하기",
    keyRisks: ["회사별 기준급 차이", "세후 추정 차이", "시나리오 기본값 변동"],
    sourceIds: [],
  },
  {
    id: "samsung",
    name: "삼성전자",
    shortName: "삼성전자",
    industry: "semiconductor",
    primaryTerms: ["OPI", "TAI", "특별성과급"],
    latestStatus: "잠정합의",
    headline: "DS·DX 사업부별 성과급 체감 차이가 큽니다.",
    formulaSummary: "사업부 성과, 기준급, 특별성과급, 협의안 시나리오를 나눠 봅니다.",
    key2026Point: "영업이익 연동 요구안과 확정 지급안을 분리해야 합니다.",
    volatility: "매우 높음",
    calculatorHref: "/tools/samsung-bonus/",
    ctaLabel: "삼성전자 성과급 계산하기",
    keyRisks: ["사업부별 차이", "요구안과 확정안 혼재", "컨센서스 변동"],
    sourceIds: ["samsung-ir"],
  },
  {
    id: "skHynix",
    name: "SK하이닉스",
    shortName: "SK하이닉스",
    industry: "semiconductor",
    primaryTerms: ["PS", "PI"],
    latestStatus: "확정",
    headline: "PS·PI 구조와 영업이익 연동 재원이 핵심입니다.",
    formulaSummary: "기준급에 PS/PI 지급률을 적용하고 세후 체감액을 별도 확인합니다.",
    key2026Point: "고액 성과급은 세후 실수령 차이가 크게 발생할 수 있습니다.",
    volatility: "매우 높음",
    calculatorHref: "/tools/sk-hynix-bonus/",
    ctaLabel: "SK하이닉스 성과급 계산하기",
    keyRisks: ["기준급 산식", "고액 과세", "반도체 업황 민감도"],
    sourceIds: ["skhynix-ir"],
  },
  {
    id: "hyundai",
    name: "현대자동차",
    shortName: "현대차",
    industry: "auto",
    primaryTerms: ["성과급", "격려금", "자사주"],
    latestStatus: "요구안",
    headline: "임금협상 요구안과 확정 합의안을 구분해야 합니다.",
    formulaSummary: "기본급 인상, 성과급, 격려금, 자사주 패키지를 함께 봅니다.",
    key2026Point: "순이익 연동 성과급 요구안은 확정 지급안이 아닙니다.",
    volatility: "중간",
    calculatorHref: "/tools/hyundai-bonus/",
    ctaLabel: "현대차 성과급 계산하기",
    keyRisks: ["요구안 상태", "자사주 가치 변동", "노사 합의 변경"],
    sourceIds: ["hyundai-ir"],
  },
];

export const CBC_BONUS_TERMS: BonusTerm[] = [
  {
    term: "OPI",
    companies: "삼성전자",
    meaning: "사업부 성과 기반 연간 인센티브",
    caution: "사업부별 지급률 차이가 크고 매년 변동될 수 있습니다.",
  },
  {
    term: "TAI/PI",
    companies: "삼성전자",
    meaning: "목표 달성 또는 반기 성과 인센티브",
    caution: "연봉 기준이 아니라 월급·기준급 기준일 수 있습니다.",
  },
  {
    term: "PS",
    companies: "SK하이닉스",
    meaning: "초과이익분배금 성격의 성과급",
    caution: "기준급 산식과 지급률을 함께 확인해야 합니다.",
  },
  {
    term: "PI",
    companies: "SK하이닉스",
    meaning: "상·하반기 생산성 또는 목표 달성 인센티브",
    caution: "PS와 합산하면 headline 금액이 커지므로 지급 시기와 기준을 나눠 봐야 합니다.",
  },
  {
    term: "격려금",
    companies: "현대차 등",
    meaning: "실적·협상·특별 보상 성격의 지급액",
    caution: "정액, 주식, 상품권 등이 섞일 수 있습니다.",
  },
];

export const CBC_SALARY_SCENARIOS: SalaryBonusScenario[] = [
  {
    salary: 70000000,
    salaryLabel: "연봉 7천만 원",
    samsungBonus: 21000000,
    skHynixBonus: 70000000,
    hyundaiBonus: 22000000,
    taxNote: "대리·과장 초반 체감 예시이며 기준급 산식에 따라 달라집니다.",
    badge: "시뮬레이션",
  },
  {
    salary: 100000000,
    salaryLabel: "연봉 1억 원",
    samsungBonus: 30000000,
    skHynixBonus: 100000000,
    hyundaiBonus: 28000000,
    taxNote: "고액 성과급은 초과누진세율 영향이 커질 수 있습니다.",
    badge: "시뮬레이션",
  },
  {
    salary: 150000000,
    salaryLabel: "연봉 1.5억 원",
    samsungBonus: 45000000,
    skHynixBonus: 150000000,
    hyundaiBonus: 42000000,
    taxNote: "총급여 상승으로 원천징수와 연말정산 결과가 크게 달라질 수 있습니다.",
    badge: "시뮬레이션",
  },
];

export const CBC_TAX_WATERFALL: TaxWaterfallItem[] = [
  { label: "세전 성과급", amount: 100000000, type: "gross", note: "연봉 1억 원 예시" },
  { label: "근로소득세 등 참고 공제", amount: -35000000, type: "deduction", note: "단순 참고율 35%" },
  { label: "세후 참고액", amount: 65000000, type: "net", note: "개인 공제와 총급여에 따라 달라짐" },
];

export const CBC_INDUSTRY_CYCLES: IndustryCycleItem[] = [
  {
    industry: "semiconductor",
    label: "반도체",
    mainVariable: "메모리 가격, HBM, 영업이익",
    volatility: "매우 높음",
    comment: "업황이 좋을 때 성과급 상단이 크게 열리지만 하락기에는 변동 폭도 큽니다.",
  },
  {
    industry: "auto",
    label: "자동차",
    mainVariable: "판매량, 환율, 순이익, 노사협상",
    volatility: "중간",
    comment: "성과급뿐 아니라 기본급, 상여금, 자사주, 정년 의제가 함께 묶이는 경향이 있습니다.",
  },
  {
    industry: "it",
    label: "IT·플랫폼",
    mainVariable: "영업이익, 주가, 비용 효율화",
    volatility: "높음",
    comment: "현금 성과급과 RSU·스톡옵션 같은 주식 보상이 함께 작동할 수 있습니다.",
  },
];

export const CBC_CALCULATOR_HUB: CalculatorHubItem[] = [
  {
    label: "대기업 성과급 시뮬레이터",
    href: "/tools/bonus-simulator/",
    description: "삼성전자·SK하이닉스·현대차 성과급을 한 화면에서 비교합니다.",
    badge: "통합 비교",
  },
  {
    label: "삼성전자 성과급 협의안 계산기",
    href: "/tools/samsung-bonus/",
    description: "DS·DX 사업부와 협의안 시나리오별 성과급을 계산합니다.",
    badge: "삼성전자",
  },
  {
    label: "SK하이닉스 성과급 계산기",
    href: "/tools/sk-hynix-bonus/",
    description: "PS·PI 기준 성과급과 총보상 체감액을 계산합니다.",
    badge: "SK하이닉스",
  },
  {
    label: "현대자동차 성과급 계산기",
    href: "/tools/hyundai-bonus/",
    description: "성과급, 격려금, 자사주 포함 총보상을 계산합니다.",
    badge: "현대차",
  },
];

export const CBC_FAQ: FaqItem[] = [
  {
    question: "2026년 대기업 성과급 순위는 어떻게 봐야 하나요?",
    answer:
      "확정 지급액, 노조 요구안, 증권사 컨센서스, 자체 시뮬레이션을 분리해서 봐야 합니다. 단순 순위보다 기준급과 세후 체감액이 중요합니다.",
  },
  {
    question: "삼성전자와 SK하이닉스 성과급은 왜 차이가 크나요?",
    answer:
      "사업 구조, 반도체 실적, 성과급 산식, 기준급 구조가 다르기 때문입니다. 삼성전자는 사업부별 차이가 크고, SK하이닉스는 PS·PI 구조와 영업이익 연동성이 핵심입니다.",
  },
  {
    question: "현대차 노조 성과급 30% 요구안은 확정인가요?",
    answer:
      "요구안은 확정 지급안이 아닙니다. 회사 제시안, 잠정합의안, 최종 확정안을 구분해서 봐야 합니다.",
  },
  {
    question: "성과급은 세금이 얼마나 빠지나요?",
    answer:
      "성과급은 근로소득으로 과세됩니다. 고액 성과급은 총급여와 과세표준을 끌어올려 체감 세율이 높아질 수 있으므로 세후 금액은 참고값으로만 봐야 합니다.",
  },
  {
    question: "평균연봉에 성과급이 포함되나요?",
    answer:
      "자료마다 다릅니다. 사업보고서 평균보수, 채용공고, 언론 기사, 커뮤니티 체감치는 포함 범위가 다를 수 있어 기준을 확인해야 합니다.",
  },
  {
    question: "이직할 때 성과급 많은 회사만 보면 되나요?",
    answer:
      "고정연봉, 성과급 변동성, 사업부 배치 가능성, 직무 전망, 세후 체감액을 함께 봐야 합니다.",
  },
];

export const CBC_SOURCES: SourceInfo[] = [
  {
    id: "samsung-ir",
    label: "삼성전자 IR",
    organization: "삼성전자",
    url: "https://www.samsung.com/sec/ir/",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "사업보고서와 실적 자료 확인용",
  },
  {
    id: "skhynix-ir",
    label: "SK하이닉스 IR",
    organization: "SK하이닉스",
    url: "https://www.skhynix.com/ir",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "실적과 사업보고서 확인용",
  },
  {
    id: "hyundai-ir",
    label: "현대자동차 IR",
    organization: "현대자동차",
    url: "https://www.hyundai.com/worldwide/ko/company/ir",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "실적과 사업보고서 확인용",
  },
  {
    id: "nts-earned-income",
    label: "근로소득 원천징수·연말정산",
    organization: "국세청",
    url: "https://www.nts.go.kr/",
    badge: "확인 필요",
    asOf: "2026-05-21",
    note: "성과급 과세 구조 확인용",
  },
];

export function formatWon(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100000000) {
    const eok = value / 100000000;
    return `${Number.isInteger(eok) ? eok.toLocaleString("ko-KR") : eok.toFixed(1)}억 원`;
  }
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
}

export function badgeClass(badge: BonusEvidenceBadge): string {
  const map: Record<BonusEvidenceBadge, string> = {
    확정: "confirmed",
    요구안: "proposal",
    제시안: "offer",
    잠정합의: "tentative",
    컨센서스: "consensus",
    시뮬레이션: "simulation",
    "확인 필요": "check",
  };
  return map[badge];
}
