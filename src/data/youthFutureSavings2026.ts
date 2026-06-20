export type YouthFutureBadge = "공식" | "공시" | "추정" | "확인 필요";

export interface SummaryMetric {
  label: string;
  value: string;
  note: string;
  badge: YouthFutureBadge;
}

export interface MaturityScenario {
  label: string;
  monthlyDeposit: number;
  months: number;
  governmentContributionRate: number;
  estimatedRate: number;
  note: string;
}

export interface BankRateInfo {
  bank: string;
  baseRate: number;
  bonusRate: number;
  totalRate: number;
  note: string;
  badge: YouthFutureBadge;
}

export const YOUTH_FUTURE_META = {
  slug: "youth-future-savings-2026",
  title: "청년미래적금 2026 출시판 업데이트",
  description:
    "2026년 6월 출시판 기준 청년미래적금의 납입 한도, 정부기여금, 만기 예상액, 기존 청년도약계좌와의 선택 기준을 정리했습니다.",
  updatedAt: "2026.06.04",
};

export const SUMMARY_METRICS: SummaryMetric[] = [
  {
    label: "월 납입 한도",
    value: "50만 원",
    note: "36개월 기준으로 총 원금 1,800만 원까지 납입",
    badge: "공식",
  },
  {
    label: "정부기여금",
    value: "6~12%",
    note: "일반형 6%, 우대형 12% 기준으로 비교",
    badge: "공식",
  },
  {
    label: "만기 예상액",
    value: "약 1,980만~2,090만 원",
    note: "월 50만 원 납입, 세전 이자 추정 포함",
    badge: "추정",
  },
  {
    label: "운영 은행",
    value: "최종 공시 확인",
    note: "은행별 우대금리와 가입 절차는 출시 공시 우선",
    badge: "확인 필요",
  },
];

export const MATURITY_SCENARIOS: MaturityScenario[] = [
  {
    label: "일반형 6%",
    monthlyDeposit: 500000,
    months: 36,
    governmentContributionRate: 0.06,
    estimatedRate: 0.05,
    note: "정부기여금 108만 원에 세전 이자를 더한 보수적 추정",
  },
  {
    label: "우대형 12%",
    monthlyDeposit: 500000,
    months: 36,
    governmentContributionRate: 0.12,
    estimatedRate: 0.05,
    note: "저소득·취약청년 우대 조건 충족 시 기여금 확대",
  },
  {
    label: "월 30만 원 납입",
    monthlyDeposit: 300000,
    months: 36,
    governmentContributionRate: 0.06,
    estimatedRate: 0.05,
    note: "현금흐름 부담을 낮춘 현실 납입 시나리오",
  },
];

export const BANK_RATE_INFOS: BankRateInfo[] = [
  {
    bank: "시중은행",
    baseRate: 0,
    bonusRate: 0,
    totalRate: 0,
    note: "출시 공시 후 기본금리와 우대금리 조건을 업데이트해야 합니다.",
    badge: "확인 필요",
  },
  {
    bank: "인터넷은행",
    baseRate: 0,
    bonusRate: 0,
    totalRate: 0,
    note: "비대면 가입 가능 여부와 우대 조건을 함께 확인하세요.",
    badge: "확인 필요",
  },
  {
    bank: "정책금융 연계",
    baseRate: 0,
    bonusRate: 0,
    totalRate: 0,
    note: "정부기여금은 상품 공통 기준, 금리는 은행별 공시 기준입니다.",
    badge: "공식",
  },
];

export const ELIGIBILITY_CHECKS = [
  {
    title: "나이",
    body: "청년 대상 정책상품이므로 가입일 기준 연령 요건을 먼저 확인해야 합니다.",
  },
  {
    title: "소득",
    body: "개인소득과 가구소득 구간에 따라 일반형 또는 우대형 적용 가능성이 달라집니다.",
  },
  {
    title: "중복 가입",
    body: "청년도약계좌 등 기존 정책적금 보유자는 전환·만기·해지 조건을 반드시 확인해야 합니다.",
  },
];

export const APPLICATION_CHECKS = [
  "신분증, 소득 확인 자료, 기존 정책계좌 보유 여부를 미리 정리합니다.",
  "은행별 우대금리 조건은 출시 공시 후 비교합니다.",
  "월 50만 원 납입이 부담되면 30만 원·40만 원 시나리오로 먼저 계산합니다.",
  "중도해지 가능성이 있다면 기여금 환수와 비과세 유지 조건을 확인합니다.",
];

export const ACCOUNT_TYPE_COMPARISONS = [
  {
    type: "일반형",
    contribution: "납입액의 6%",
    bestFor: "소득 요건은 충족하지만 우대형 조건이 애매한 청년",
    caution: "은행 금리와 우대 조건에 따라 실수령액 차이가 납니다.",
  },
  {
    type: "우대형",
    contribution: "납입액의 12%",
    bestFor: "저소득·취약청년 등 우대 조건을 충족하는 청년",
    caution: "증빙 서류와 소득 판정 기준을 가입 전 확인해야 합니다.",
  },
];

export const LEAP_COMPARISON_ROWS = [
  {
    label: "상품 기간",
    youthFuture: "3년",
    youthLeap: "5년",
    decision: "짧은 만기를 원하면 청년미래적금이 유리합니다.",
  },
  {
    label: "월 납입 한도",
    youthFuture: "50만 원",
    youthLeap: "70만 원",
    decision: "더 큰 원금을 오래 묶을 수 있으면 청년도약계좌도 검토합니다.",
  },
  {
    label: "정부 지원 방식",
    youthFuture: "정률 기여금 6~12%",
    youthLeap: "소득구간별 기여금",
    decision: "소득구간과 납입 여력에 따라 총 지원액이 달라집니다.",
  },
  {
    label: "전략 포인트",
    youthFuture: "출시 직후 단기 자산형성",
    youthLeap: "장기 목돈 형성",
    decision: "이미 보유한 계좌의 해지 손실을 먼저 계산해야 합니다.",
  },
];

export const DECISION_CARDS = [
  {
    title: "월 50만 원을 3년간 유지할 수 있다",
    body: "청년미래적금의 기여금 효과를 온전히 받기 좋습니다. 비상자금은 별도로 남겨두세요.",
  },
  {
    title: "청년도약계좌를 이미 보유 중이다",
    body: "해지보다 만기 유지가 유리할 수 있습니다. 남은 기간, 기여금, 우대금리 상실을 비교하세요.",
  },
  {
    title: "소득 변동 가능성이 크다",
    body: "우대형 적용 여부가 바뀔 수 있으므로 가입 시점의 소득 판정과 사후 확인 기준을 확인합니다.",
  },
];

export const SEO_INTRO = [
  "청년 정책금융 상품이 여러 개 생기면서 어떤 상품을 선택해야 할지 헷갈리는 청년들이 많습니다. 청년미래적금은 2026년 6월 출시판 기준으로 3년 만기, 월 50만 원 한도, 정부기여금 6~12% 구조가 핵심입니다.",
  "기존 청년도약계좌와 비교할 때 가장 큰 차이는 기간입니다. 청년도약계좌는 5년 장기 상품이고, 청년미래적금은 상대적으로 짧은 3년 만기라 현금흐름 부담이 낮습니다. 단기간에 목돈을 마련하고 싶은 청년에게는 청년미래적금이 더 현실적인 선택일 수 있습니다.",
  "정부기여금 비율은 소득 구간에 따라 6~12% 사이에서 차등 적용되며, 소득이 낮을수록 기여금 비율이 높아지는 구조입니다. 본인의 소득 구간을 먼저 확인하면 실제 받을 수 있는 정부기여금 규모를 가늠할 수 있습니다.",
  "이 페이지의 상품 조건은 2026년 6월 출시 시점의 공시 기준을 정리한 것이며, 실제 가입 조건과 기여금 비율은 정책 변경에 따라 달라질 수 있습니다. 정확한 가입 조건은 취급 은행이나 정부 정책 공고를 통해 확인하는 것을 권장합니다.",
];

export const SEO_CRITERIA = [
  {
    title: "월 납입 여력",
    body: "월 50만 원을 안정적으로 납입할 수 있어야 만기 예상액이 의미 있습니다.",
  },
  {
    title: "정부기여금 구간",
    body: "일반형 6%, 우대형 12%의 차이가 만기액을 크게 좌우합니다.",
  },
  {
    title: "기존 계좌 손실",
    body: "청년도약계좌 보유자는 해지 시 우대금리와 기여금 손실을 먼저 확인해야 합니다.",
  },
];

export const SOURCE_LINKS = [
  {
    label: "서민금융진흥원 청년 자산형성 안내",
    href: "https://ylaccount.kinfa.or.kr/",
  },
  {
    label: "금융위원회 정책자료",
    href: "https://www.fsc.go.kr/",
  },
];

export const RELATED_LINKS = [
  {
    title: "청년미래적금 만기 계산기",
    description: "월 납입액과 기여금 유형을 바꿔 예상 만기액을 계산합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
  },
  {
    title: "청년도약계좌 vs 청년미래적금 비교",
    description: "기존 정책계좌와 새 상품의 선택 기준을 비교합니다.",
    href: "/reports/youth-savings-comparison-2026/",
  },
  {
    title: "고유가 피해지원금 계산기",
    description: "6월 한정 신청 수요가 큰 지원금 예상액을 확인합니다.",
    href: "/tools/high-oil-support-payment-calculator/",
  },
];

export const YOUTH_FUTURE_FAQS = [
  {
    question: "청년미래적금은 언제 기준으로 봐야 하나요?",
    answer:
      "이 문서는 2026년 6월 4일 출시판 기준으로 정리했습니다. 은행별 금리와 세부 신청 절차는 최종 공시를 우선해야 합니다.",
  },
  {
    question: "월 50만 원을 꼭 넣어야 하나요?",
    answer:
      "월 50만 원은 한도입니다. 납입액이 낮아지면 정부기여금과 이자도 함께 줄어들므로 본인 현금흐름에 맞춰 계산하는 것이 좋습니다.",
  },
  {
    question: "청년도약계좌를 해지하고 갈아타도 되나요?",
    answer:
      "무조건 갈아타기보다 남은 만기, 이미 쌓인 기여금, 우대금리 상실, 중도해지 불이익을 비교해야 합니다.",
  },
  {
    question: "만기액은 확정 금액인가요?",
    answer:
      "아닙니다. 정부기여금은 공개 기준을 반영했지만 은행 금리, 우대 조건, 세제 적용 여부에 따라 실제 만기액은 달라질 수 있습니다.",
  },
];

export function formatManwon(value: number): string {
  return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
}

export function formatMaturityRange(scenario: MaturityScenario): string {
  const principal = scenario.monthlyDeposit * scenario.months;
  const governmentContribution = principal * scenario.governmentContributionRate;
  const monthlyRate = scenario.estimatedRate / 12;
  const interest =
    scenario.monthlyDeposit *
    (((Math.pow(1 + monthlyRate, scenario.months) - 1) / monthlyRate) - scenario.months);
  return formatManwon(principal + governmentContribution + interest);
}
