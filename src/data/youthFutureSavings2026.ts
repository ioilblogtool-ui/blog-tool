export type YouthFutureBadge = "공식" | "공시" | "추정" | "확인 필요";

export interface YouthFutureMeta {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  sourceLabel: string;
}

export interface SummaryMetric {
  label: string;
  value: string;
  note: string;
  badge: YouthFutureBadge;
}

export interface EligibilityCheck {
  id: string;
  label: string;
  value: string;
  detail: string;
  badge: YouthFutureBadge;
}

export interface AccountTypeComparison {
  id: "general" | "preferred";
  name: string;
  contributionRate: number;
  target: string;
  checks: string[];
  caution: string;
}

export interface MaturityScenario {
  monthlyContribution: number;
  principal: number;
  generalContribution: number;
  preferredContribution: number;
  estimatedInterestMin: number;
  estimatedInterestMax: number;
  generalMaturityMin: number;
  generalMaturityMax: number;
  preferredMaturityMin: number;
  preferredMaturityMax: number;
  badge: YouthFutureBadge;
}

export interface BankRateInfo {
  id: string;
  name: string;
  baseRate: number;
  maxBonusRate: number;
  maxRate: number;
  tags: string[];
  note: string;
  badge: YouthFutureBadge;
}

export interface LeapComparisonRow {
  label: string;
  youthFuture: string;
  youthLeap: string;
  interpretation: string;
}

export interface DecisionCard {
  title: string;
  fit: string;
  checks: string[];
}

export interface ApplicationCheck {
  label: string;
  detail: string;
}

export interface YouthFutureFaq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

const MONTHS = 36;
const GENERAL_CONTRIBUTION_RATE = 0.06;
const PREFERRED_CONTRIBUTION_RATE = 0.12;

export const YOUTH_FUTURE_META: YouthFutureMeta = {
  slug: "youth-future-savings-2026",
  title: "청년미래적금 조건·만기 수령액 정리 2026",
  metaTitle: "청년미래적금 조건·만기 수령액 2026｜가입 대상·정부기여금·청년도약계좌 비교",
  description:
    "2026년 청년미래적금 가입 조건, 신청기간, 정부기여금, 우대금리, 비과세 혜택, 청년도약계좌 갈아타기 여부를 정리합니다. 월 납입액별 만기 수령액과 일반형·우대형 차이도 비교하세요.",
  ogTitle: "청년미래적금 조건·만기 수령액 2026",
  ogDescription:
    "가입 대상부터 정부기여금, 우대금리, 청년도약계좌 갈아타기까지 한 화면에서 확인하세요.",
  updatedAt: "2026.05.31",
  sourceLabel: "금융위원회 공개자료 및 은행연합회 공시 안내 기준",
};

export const SUMMARY_METRICS: SummaryMetric[] = [
  {
    label: "출시 예정일",
    value: "2026년 6월 22일",
    note: "최초 신청기간은 출시일부터 2주 운영 안내",
    badge: "공식",
  },
  {
    label: "월 납입 한도",
    value: "최대 50만 원",
    note: "3년 만기 자유적립식 구조",
    badge: "공식",
  },
  {
    label: "정부기여금",
    value: "6% / 12%",
    note: "일반형 6%, 우대형 12% 기준",
    badge: "공식",
  },
  {
    label: "최고 금리",
    value: "연 7~8%",
    note: "기본금리와 기관별 우대금리 합산",
    badge: "공시",
  },
];

export const ELIGIBILITY_CHECKS: EligibilityCheck[] = [
  {
    id: "age",
    label: "나이",
    value: "만 19~34세",
    detail: "병역 이행자는 병역기간을 제외할 수 있습니다. 실제 판단은 신청 시점의 가입 가능 연령 안내를 확인해야 합니다.",
    badge: "공식",
  },
  {
    id: "income",
    label: "개인소득",
    value: "총급여·종합소득 기준 확인",
    detail: "일반형과 우대형의 소득 기준이 다르므로 직전 과세기간 소득 자료를 확인해야 합니다.",
    badge: "공식",
  },
  {
    id: "household",
    label: "가구소득",
    value: "기준 중위소득 조건",
    detail: "가구원 수와 소득 산정 방식에 따라 판단이 달라질 수 있어 신청 전 공식 안내와 은행 심사를 확인해야 합니다.",
    badge: "확인 필요",
  },
  {
    id: "work",
    label: "직장·사업 유형",
    value: "직장인·중소기업·소상공인",
    detail: "우대형은 재직기간, 신규 취업 여부, 소상공인 매출 기준 등 추가 조건 확인이 필요합니다.",
    badge: "확인 필요",
  },
  {
    id: "exclusion",
    label: "제외 가능성",
    value: "금융소득 종합과세 등",
    detail: "최근 금융소득 종합과세 대상 여부나 일부 업종 제한은 신청 전 개별 확인이 필요합니다.",
    badge: "확인 필요",
  },
];

export const ACCOUNT_TYPE_COMPARISONS: AccountTypeComparison[] = [
  {
    id: "general",
    name: "일반형",
    contributionRate: 6,
    target: "기본 가입 조건을 충족하는 청년",
    checks: ["개인소득", "가구소득", "금융소득 종합과세 여부"],
    caution: "대부분의 사용자가 먼저 확인해야 하는 기본 유형입니다. 은행별 신청 심사 결과가 우선합니다.",
  },
  {
    id: "preferred",
    name: "우대형",
    contributionRate: 12,
    target: "조건을 충족하는 중소기업 재직 청년 또는 소상공인 청년",
    checks: ["재직기간", "신규 취업 여부", "소상공인 매출", "가구소득"],
    caution: "중소기업 재직자라도 세부 요건에 따라 우대형이 아닐 수 있으므로 확인 필요 배지로 해석해야 합니다.",
  },
];

const makeScenario = (monthlyContribution: number): MaturityScenario => {
  const principal = monthlyContribution * MONTHS;
  const generalContribution = Math.round(principal * GENERAL_CONTRIBUTION_RATE);
  const preferredContribution = Math.round(principal * PREFERRED_CONTRIBUTION_RATE);
  const installmentBase = monthlyContribution * ((MONTHS * (MONTHS + 1)) / 2);
  const estimatedInterestMin = Math.round(installmentBase * (0.07 / 12));
  const estimatedInterestMax = Math.round(installmentBase * (0.08 / 12));

  return {
    monthlyContribution,
    principal,
    generalContribution,
    preferredContribution,
    estimatedInterestMin,
    estimatedInterestMax,
    generalMaturityMin: principal + generalContribution + estimatedInterestMin,
    generalMaturityMax: principal + generalContribution + estimatedInterestMax,
    preferredMaturityMin: principal + preferredContribution + estimatedInterestMin,
    preferredMaturityMax: principal + preferredContribution + estimatedInterestMax,
    badge: "추정",
  };
};

export const MATURITY_SCENARIOS: MaturityScenario[] = [
  makeScenario(100000),
  makeScenario(300000),
  makeScenario(500000),
];

export const BANK_RATE_INFOS: BankRateInfo[] = [
  {
    id: "major-special",
    name: "주요 시중은행·특화은행 그룹",
    baseRate: 5,
    maxBonusRate: 3,
    maxRate: 8,
    tags: ["급여이체", "카드", "자동이체", "상담·마케팅 동의"],
    note: "최고금리는 여러 우대조건을 모두 충족해야 적용될 수 있습니다.",
    badge: "공시",
  },
  {
    id: "regional-internet",
    name: "지방은행·인터넷은행 그룹",
    baseRate: 5,
    maxBonusRate: 2,
    maxRate: 7,
    tags: ["첫거래", "자동이체", "앱 가입", "상담·마케팅 동의"],
    note: "은행별 신청 채널, 우대조건, 최고금리 공시는 실제 상품설명서를 우선 확인해야 합니다.",
    badge: "공시",
  },
];

export const LEAP_COMPARISON_ROWS: LeapComparisonRow[] = [
  {
    label: "만기",
    youthFuture: "3년",
    youthLeap: "5년",
    interpretation: "청년미래적금은 자금 묶임 기간이 상대적으로 짧습니다.",
  },
  {
    label: "월 납입 한도",
    youthFuture: "50만 원",
    youthLeap: "70만 원",
    interpretation: "월 납입 여력이 큰 사용자는 총 납입 한도까지 함께 봐야 합니다.",
  },
  {
    label: "혜택 구조",
    youthFuture: "정부기여금 6% 또는 12% + 비과세",
    youthLeap: "소득 구간별 정부기여금 + 비과세",
    interpretation: "본인의 소득과 우대형 해당 여부가 혜택 판단의 핵심입니다.",
  },
  {
    label: "갈아타기",
    youthFuture: "최초 가입기간 전환 안내 확인",
    youthLeap: "기존 가입자는 유지·전환 판단 필요",
    interpretation: "전환이 항상 유리하다고 단정하기보다 남은 납입기간과 혜택을 비교해야 합니다.",
  },
];

export const DECISION_CARDS: DecisionCard[] = [
  {
    title: "청년미래적금 우대형 가능성이 높다면",
    fit: "전환 검토 우선",
    checks: ["중소기업 재직 또는 신규 취업 조건", "소득 기준", "3년 납입 유지 가능성"],
  },
  {
    title: "청년도약계좌 납입 기간이 많이 남았다면",
    fit: "유지와 전환 비교",
    checks: ["기존 납입기간", "해지 시 혜택 유지 여부", "전환 신청기간"],
  },
  {
    title: "월 50만 원 유지가 부담된다면",
    fit: "납입액 현실화",
    checks: ["비상금", "월 고정지출", "중도해지 가능성"],
  },
];

export const APPLICATION_CHECKS: ApplicationCheck[] = [
  { label: "나이", detail: "만 19~34세와 병역기간 제외 적용 여부 확인" },
  { label: "소득", detail: "직전 과세기간 총급여·종합소득 확인" },
  { label: "가구소득", detail: "가구원 수와 기준 중위소득 구간 확인" },
  { label: "재직·사업", detail: "중소기업 재직, 신규 취업, 소상공인 요건 확인" },
  { label: "금융소득", detail: "종합과세 대상 여부와 제외 요건 확인" },
  { label: "우대금리", detail: "급여이체, 카드, 자동이체, 첫거래 조건 확인" },
  { label: "현금흐름", detail: "3년 동안 월 납입액을 유지할 수 있는지 점검" },
  { label: "기존 계좌", detail: "청년도약계좌 유지·해지·전환 가능 안내 확인" },
];

export const YOUTH_FUTURE_FAQS: YouthFutureFaq[] = [
  {
    question: "청년미래적금은 누구나 가입할 수 있나요?",
    answer:
      "아닙니다. 나이, 개인소득, 가구소득, 금융소득 종합과세 여부, 직장 또는 사업 유형 등 조건을 확인해야 합니다.",
  },
  {
    question: "월 50만 원을 꼭 넣어야 하나요?",
    answer:
      "월 최대 50만 원 한도 안에서 자유롭게 납입하는 구조입니다. 다만 만기 수령액을 크게 만들려면 납입액과 납입 유지 기간이 중요합니다.",
  },
  {
    question: "일반형과 우대형의 가장 큰 차이는 무엇인가요?",
    answer:
      "정부기여금 비율 차이가 핵심입니다. 일반형은 납입액의 6%, 우대형은 12% 기준으로 설명되지만 우대형은 별도 조건 확인이 필요합니다.",
  },
  {
    question: "청년도약계좌에서 갈아타는 것이 무조건 유리한가요?",
    answer:
      "무조건 유리하다고 볼 수 없습니다. 기존 납입 기간, 해지 시 받을 수 있는 혜택, 청년미래적금 유형, 남은 자금 계획을 함께 비교해야 합니다.",
  },
  {
    question: "만기 수령액 계산은 확정 금액인가요?",
    answer:
      "아닙니다. 월 납입액, 적용금리, 우대금리 충족 여부, 정부기여금 지급 방식, 비과세 적용 여부에 따라 달라지는 추정값입니다.",
  },
];

export const RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/youth-savings-comparison-2026/",
    label: "청년미래적금 vs 청년도약계좌 비교",
    description: "청년미래적금, 청년도약계좌, 청년희망적금의 조건과 수령액을 함께 비교합니다.",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "청년 자산형성 지원금과 다른 복지 제도를 함께 확인합니다.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "가구소득 기준으로 지원 가능성을 간단히 점검합니다.",
  },
  {
    href: "/tools/savings-vs-etf-retirement/",
    label: "예적금 vs ETF 은퇴 계산기",
    description: "예적금 안정성과 장기 투자 수익률을 비교합니다.",
  },
];

export const SOURCE_LINKS: SourceLink[] = [
  {
    label: "금융위원회 청년미래적금 안내",
    href: "https://www.fsc.go.kr/no040101?cnId=2983",
  },
  {
    label: "금융위원회 취급기관·금리 안내",
    href: "https://www.fsc.go.kr/no010101/86884",
  },
  {
    label: "금융위원회 신청기간·공시 안내",
    href: "https://www.fsc.go.kr/po010103/87005",
  },
];

export const SEO_INTRO = [
  "청년미래적금은 2026년 출시가 예고된 청년 자산형성 정책금융 상품입니다. 핵심은 월 납입액, 정부기여금, 비과세, 우대금리를 따로 보는 것입니다.",
  "이 페이지는 가입 권유가 아니라 조건 확인과 수령액 추정을 돕는 정보 정리입니다. 실제 가입 가능 여부와 적용 금리는 은행별 상품설명서, 신청 시점의 공식 공고, 심사 결과가 우선합니다.",
  "청년도약계좌를 이미 보유한 사용자는 단순히 최고금리만 비교하기보다 기존 납입기간, 해지 시 혜택, 청년미래적금 일반형·우대형 가능성을 함께 따져야 합니다.",
];

export const SEO_CRITERIA = [
  "만기 수령액은 매월 같은 금액을 36개월 동안 납입하고, 연 7~8% 범위의 금리를 단순 적립식으로 적용한 추정 시나리오입니다.",
  "정부기여금은 일반형 6%, 우대형 12% 구조를 기준으로 단순 계산했습니다. 실제 지급 방식과 지급 시점은 공식 안내를 확인해야 합니다.",
  "은행별 우대금리는 급여이체, 카드 이용, 자동이체, 첫거래 등 조건 충족 여부에 따라 달라질 수 있습니다.",
];

export const formatWon = (value: number): string => `${Math.round(value).toLocaleString("ko-KR")}원`;

export const formatManwon = (value: number): string => {
  const man = Math.round(value / 10000);
  if (man >= 10000) {
    const eok = Math.floor(man / 10000);
    const remainder = man % 10000;
    return remainder > 0 ? `${eok}억 ${remainder.toLocaleString("ko-KR")}만 원` : `${eok}억 원`;
  }
  return `${man.toLocaleString("ko-KR")}만 원`;
};

export const formatMaturityRange = (min: number, max: number): string =>
  `${formatManwon(min)}~${formatManwon(max)}`;
