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
  conditionSummary: string;
  bestFor: string;
  difficulty: "쉬움" | "보통" | "까다로움";
}

export interface BankSelectionGuide {
  title: string;
  bestBanks: string;
  body: string;
  caution: string;
}

export interface BankRateSummary {
  label: string;
  value: string;
  note: string;
  tone: "top" | "steady" | "easy" | "caution";
}

export const YOUTH_FUTURE_META = {
  slug: "youth-future-savings-2026",
  title: "청년미래적금 금리 비교 2026",
  description:
    "2026년 6월 22일 은행연합회 비교공시 기준 청년미래적금 은행별 기본금리, 최고금리, 우대조건, 나에게 유리한 은행 선택 기준을 정리했습니다.",
  updatedAt: "2026.06.22",
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
    value: "약 2,050만~2,140만 원",
    note: "월 50만 원, 5~8% 금리, 정부기여금 가정에 따른 추정",
    badge: "추정",
  },
  {
    label: "최고금리 은행",
    value: "8.00%",
    note: "IBK·KB·NH·우리·신한·우체국·하나은행 최고금리",
    badge: "공시",
  },
];

export const MATURITY_SCENARIOS: MaturityScenario[] = [
  {
    label: "일반형 6%",
    monthlyDeposit: 500000,
    months: 36,
    governmentContributionRate: 0.06,
    estimatedRate: 0.08,
    note: "최고금리 8% 달성, 정부기여금 108만 원에 세전 이자를 더한 추정",
  },
  {
    label: "우대형 12%",
    monthlyDeposit: 500000,
    months: 36,
    governmentContributionRate: 0.12,
    estimatedRate: 0.08,
    note: "최고금리 8%와 우대형 기여금 12%를 모두 충족한 추정",
  },
  {
    label: "월 30만 원 납입",
    monthlyDeposit: 300000,
    months: 36,
    governmentContributionRate: 0.06,
    estimatedRate: 0.07,
    note: "최고금리 7% 은행에 월 30만 원을 넣는 현실 납입 시나리오",
  },
];

export const BANK_RATE_INFOS: BankRateInfo[] = [
  {
    bank: "IBK기업은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "급여이체, 카드, 청약, 중소기업 재직, 연계가입 또는 최초고객 조건을 폭넓게 제공합니다.",
    badge: "공시",
    conditionSummary: "급여 1.0%p, 카드 0.5%p, 청약 0.5%p, 소득 0.5%p, 재무상담 0.2%p, 중소기업 0.3%p",
    bestFor: "중소기업 재직자이거나 IBK를 급여통장으로 만들 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "KB국민은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "급여이체와 출금실적, 거래감사, 소득플러스, 재무상담을 조합하는 구조입니다.",
    badge: "공시",
    conditionSummary: "급여 1.0%p, 출금실적 0.8%p, 거래감사 0.5%p, 소득플러스 0.5%p, 재무상담 0.2%p",
    bestFor: "KB를 이미 주거래로 쓰거나 급여·출금 거래를 한 곳으로 모을 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "Sh수협은행",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "급여이체와 카드결제 실적, 마케팅 동의 조건 중심입니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 마케팅 0.2%p, 급여 0.5%p, 카드 0.6%p",
    bestFor: "수협 계좌와 카드 사용을 같이 묶을 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "NH농협은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "급여·카드·마이데이터·연계가입·재무상담·소득 조건을 장기간 유지해야 합니다.",
    badge: "공시",
    conditionSummary: "급여 18개월, 카드 월평균 20만 원, 마이데이터 18개월, 신규 또는 연계가입, 재무상담, 소득",
    bestFor: "농협을 이미 생활계좌로 쓰고 카드·마이데이터 유지가 가능한 청년",
    difficulty: "까다로움",
  },
  {
    bank: "우리은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "소득입금 우대가 크고, 예적금 미보유 또는 연계가입, 카드·공과금 자동이체 조건이 붙습니다.",
    badge: "공시",
    conditionSummary: "소득입금 1.5%p, 미보유 또는 연계 0.5%p, 카드·공과금 0.5%p, 소득플러스 0.5%p, 재무상담 0.2%p, 출시기념 0.3%p",
    bestFor: "급여·소득 입금을 우리은행으로 받을 수 있고 자동이체를 옮길 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "신한은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "연계가입 특별우대와 증권거래 우대가 있어 신한금융권 이용자에게 유리합니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 소득이체 0.3%p, 카드 0.2%p, 증권 0.5%p, 첫거래·연계 0.3%p, 연계 특별 1.0%p",
    bestFor: "신한카드·신한투자증권·기존 청년도약계좌 연계가 가능한 청년",
    difficulty: "까다로움",
  },
  {
    bank: "iM뱅크",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "최초거래, 자동이체, 급여, 카드, 마케팅 동의 조건을 잘게 쌓는 구조입니다.",
    badge: "공시",
    conditionSummary: "최초 0.3%p, 마케팅 0.1%p, 자동이체 0.3%p, 급여 0.3%p, 카드 0.3%p, 소득 0.5%p, 재무상담 0.2%p",
    bestFor: "iM뱅크 첫거래이면서 자동이체·카드 실적을 만들 수 있는 청년",
    difficulty: "쉬움",
  },
  {
    bank: "BNK부산은행",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "급여, 카드, 청약, 소득, 재무상담 조건으로 구성됩니다.",
    badge: "공시",
    conditionSummary: "급여 0.5%p, 카드 0.5%p, 청약 0.3%p, 소득 0.5%p, 재무상담 0.2%p",
    bestFor: "부산은행을 지역 주거래로 쓰고 청약·카드 조건을 맞출 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "광주은행",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "첫거래 또는 청년도약계좌 연계와 급여·자동이체·정기예금 조건을 조합합니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 첫거래 또는 연계 0.5%p, 급여 0.3%p, 자동이체 0.2%p, 정기예금 0.3%p",
    bestFor: "광주은행 첫거래 또는 연계가입이 가능하고 예금 추가 가입도 고려하는 청년",
    difficulty: "보통",
  },
  {
    bank: "전북은행",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "급여·카드·자동이체·마케팅 동의 조건을 균형 있게 쌓는 구조입니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 급여·가맹점 0.5%p, 카드 0.3%p, 자동이체 0.3%p, 마케팅 0.2%p",
    bestFor: "전북은행 생활거래를 만들 수 있고 조건을 여러 개 나눠 채울 수 있는 청년",
    difficulty: "쉬움",
  },
  {
    bank: "BNK경남은행",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "모든 고객 청년미래응원금리 0.3%p가 있고 급여입금 비중이 큽니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 응원 0.3%p, 마케팅 0.1%p, 급여 0.7%p, 카드 0.2%p, 신규 0.2%p",
    bestFor: "경남은행 급여입금이 가능하고 신규고객 우대까지 받을 수 있는 청년",
    difficulty: "쉬움",
  },
  {
    bank: "우체국",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "이벤트 금리 1.0%p가 크고 체크카드·자동이체·첫거래 또는 급여 조건을 조합합니다.",
    badge: "공시",
    conditionSummary: "이벤트 1.0%p, 첫거래 또는 급여 0.5%p, 체크카드 0.4%p, 자동이체 0.4%p, 소득 0.5%p, 재무상담 0.2%p",
    bestFor: "우체국 접근성이 좋고 카드·자동이체 조건을 단순하게 맞추고 싶은 청년",
    difficulty: "쉬움",
  },
  {
    bank: "하나은행",
    baseRate: 5.0,
    bonusRate: 3.0,
    totalRate: 8.0,
    note: "급여 또는 가맹점대금 이체 우대가 1.2%p로 크고 카드결제 조건이 붙습니다.",
    badge: "공시",
    conditionSummary: "급여·가맹점 1.2%p, 카드 0.6%p, 목돈마련 0.5%p, 소득플러스 0.5%p, 재무상담 0.2%p",
    bestFor: "하나은행 급여통장 또는 사업소득 입금 계좌로 활용할 수 있는 청년",
    difficulty: "보통",
  },
  {
    bank: "카카오뱅크",
    baseRate: 5.0,
    bonusRate: 2.0,
    totalRate: 7.0,
    note: "비대면 접근성이 좋고 최초신규고객 우대가 0.7%p로 큽니다.",
    badge: "공시",
    conditionSummary: "소득 0.5%p, 재무상담 0.2%p, 최초신규 0.7%p, 카드실적 최대 0.6%p",
    bestFor: "복잡한 오프라인 거래보다 비대면 가입과 첫거래 우대를 선호하는 청년",
    difficulty: "쉬움",
  },
];

export const BANK_RATE_SUMMARY: BankRateSummary[] = [
  {
    label: "기본금리",
    value: "전 은행 5.00%",
    note: "비교공시상 모든 취급은행 기본금리는 동일합니다.",
    tone: "steady",
  },
  {
    label: "최고금리",
    value: "7개 은행 8.00%",
    note: "IBK·KB·NH·우리·신한·우체국·하나은행이 최고 8.00%입니다.",
    tone: "top",
  },
  {
    label: "조건 쉬운 후보",
    value: "우체국·카카오·iM",
    note: "단순 조건을 선호하면 최고금리보다 달성 가능성을 먼저 봅니다.",
    tone: "easy",
  },
  {
    label: "주의할 점",
    value: "최고금리 ≠ 내 금리",
    note: "급여이체·카드·연계가입 조건을 못 채우면 실제 금리는 낮아집니다.",
    tone: "caution",
  },
];

export const BANK_SELECTION_GUIDES: BankSelectionGuide[] = [
  {
    title: "최고금리 8%를 노린다면",
    bestBanks: "IBK·KB·NH·우리·신한·우체국·하나",
    body: "기본금리 5%에 우대금리 3%p를 모두 채워야 합니다. 급여이체, 카드실적, 자동이체, 재무상담, 연계가입 중 2~4개를 꾸준히 유지할 수 있는지가 핵심입니다.",
    caution: "조건을 일부 놓치면 7% 은행보다 실질 금리가 낮아질 수 있습니다.",
  },
  {
    title: "주거래 은행을 바꾸기 어렵다면",
    bestBanks: "현재 급여통장 은행 우선",
    body: "청년미래적금은 전 은행 기본금리가 5%로 같습니다. 우대금리 때문에 급여통장·카드·자동이체를 무리하게 옮기는 비용이 더 크다면 기존 은행에서 조건 달성 가능성을 먼저 계산하세요.",
    caution: "단순 최고금리보다 실제 달성 가능한 우대금리 합계가 더 중요합니다.",
  },
  {
    title: "비대면·간편 가입을 원한다면",
    bestBanks: "카카오뱅크·iM뱅크·우체국",
    body: "최고금리는 7% 또는 8%로 갈리지만 조건이 비교적 단순합니다. 첫거래, 카드실적, 자동이체처럼 내가 바로 만들 수 있는 조건이 있는지 확인하세요.",
    caution: "카카오뱅크는 최고 7%라 8% 은행과 만기 이자 차이가 생깁니다.",
  },
  {
    title: "기존 청년도약계좌 연계라면",
    bestBanks: "신한·우리·농협·광주·IBK",
    body: "일부 은행은 청년도약계좌 연계가입 또는 최초고객 조건을 우대금리에 반영합니다. 기존 계좌를 보유했다면 해지보다 연계 우대가 가능한지 먼저 확인하세요.",
    caution: "연계가입 조건은 은행별 상세정보에서 실제 인정 범위를 확인해야 합니다.",
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
  "은행별 우대금리 조건은 2026년 6월 22일 비교공시와 각 은행 상품설명서를 함께 확인합니다.",
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
    body: "청년미래적금의 기여금 효과를 온전히 받기 좋습니다. 최고금리 8% 은행을 고르기 전 비상자금은 별도로 남겨두세요.",
  },
  {
    title: "급여통장과 카드 실적을 옮길 수 있다",
    body: "IBK·KB·우리·농협·하나처럼 급여·카드 조건 비중이 큰 은행에서 최고금리 달성 가능성이 높아집니다.",
  },
  {
    title: "청년도약계좌를 이미 보유 중이다",
    body: "해지보다 만기 유지가 유리할 수 있습니다. 연계가입 우대가 가능한 은행인지, 기존 계좌 기여금 손실이 있는지 먼저 비교하세요.",
  },
];

export const SEO_INTRO = [
  "청년미래적금 금리는 2026년 6월 22일 은행연합회 비교공시 기준으로 기본금리 5.00%가 공통입니다. 차이는 은행별 우대금리입니다. IBK기업은행, KB국민은행, NH농협은행, 우리은행, 신한은행, 우체국, 하나은행은 최고 8.00%까지 공시되어 있고, 수협·iM뱅크·부산은행·광주은행·전북은행·경남은행·카카오뱅크는 최고 7.00%입니다.",
  "하지만 최고금리 8%가 항상 나에게 가장 유리하다는 뜻은 아닙니다. 급여이체, 카드 이용, 자동이체, 첫거래, 청년도약계좌 연계가입, 재무상담 이수처럼 은행별 조건을 끝까지 충족해야 최고금리가 적용됩니다. 조건을 일부 놓치면 최고 7% 은행보다 실제 적용금리가 낮아질 수 있습니다.",
  "은행 선택은 먼저 현재 주거래 은행을 기준으로 보는 것이 현실적입니다. 급여통장과 카드 사용을 옮길 수 있으면 8% 은행을 적극 검토하고, 비대면·간편 조건을 원하면 카카오뱅크나 iM뱅크처럼 조건이 단순한 은행도 비교할 만합니다. 기존 청년도약계좌 보유자는 연계가입 우대가 있는 은행을 우선 확인해야 합니다.",
  "청년미래적금은 3년 만기, 월 50만 원 한도, 정부기여금 6~12% 구조가 핵심입니다. 금리만 보지 말고 월 납입 여력, 정부기여금 유형, 우대금리 달성 가능성, 기존 정책계좌 해지 손실을 함께 계산해야 실제 만기 수령액을 더 정확하게 판단할 수 있습니다.",
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
  {
    title: "은행 우대조건",
    body: "2026년 6월 22일 비교공시 기준 기본금리는 5.00%, 최고금리는 은행별 7.00~8.00%입니다.",
  },
];

export const SOURCE_LINKS = [
  {
    label: "은행연합회 청년미래적금 상품설명",
    href: "https://portal.kfb.or.kr/compare/receiving_youth_future.php",
  },
  {
    label: "은행연합회 청년미래적금 금리비교공시",
    href: "https://portal.kfb.or.kr/compare/receiving_youth_future_2.php",
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
    question: "청년미래적금 금리는 언제 기준인가요?",
    answer:
      "이 문서는 2026년 6월 22일 은행연합회 청년미래적금 비교공시 기준으로 정리했습니다. 실제 가입 전에는 해당 은행 상품설명서와 상세정보를 다시 확인해야 합니다.",
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
    question: "최고금리 8% 은행을 고르면 무조건 유리한가요?",
    answer:
      "아닙니다. 최고금리는 우대조건을 모두 충족했을 때 기준입니다. 급여이체, 카드실적, 자동이체, 연계가입 등 조건을 채우지 못하면 실제 적용금리는 낮아질 수 있으므로 내가 달성 가능한 조건을 기준으로 은행을 골라야 합니다.",
  },
  {
    question: "카카오뱅크는 최고금리가 7%인데 선택해도 되나요?",
    answer:
      "비대면 가입 편의성과 최초신규고객·카드실적 조건이 본인에게 맞는다면 검토할 수 있습니다. 다만 최고 8% 은행의 우대조건을 쉽게 채울 수 있다면 만기 이자 차이가 생길 수 있어 계산기로 비교해보는 것이 좋습니다.",
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
