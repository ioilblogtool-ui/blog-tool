export const DEFAULT_YOUTH_SAVINGS_INPUT = {
  monthlyContribution: 500000,
  selectedProducts: ["future", "leap", "regular"],
  youthFutureType: "general",
  leapIncomeTierId: "tier-2",
  futureBaseRate: 5,
  futureBonusRate: 3,
  leapAnnualRate: 5,
  regularAnnualRate: 3.5,
  regularMonths: 36,
  includeTax: true,
  policyTaxFree: true,
};

export const PRODUCT_CONFIGS = [
  {
    id: "future",
    name: "청년미래적금",
    label: "청년미래적금",
    maxMonthlyDeposit: 500000,
    months: 36,
    contributionRate: 0.06,
    contributionLabel: "정부기여금 6%",
    description: "월 50만 원 한도, 3년 만기 기준의 기본 시나리오입니다.",
  },
  {
    id: "leap",
    name: "청년도약계좌",
    label: "청년도약계좌",
    maxMonthlyDeposit: 700000,
    months: 60,
    contributionRate: 0,
    contributionLabel: "소득구간별 기여금",
    description: "기존 5년 만기 정책계좌와 비교할 때 사용합니다.",
  },
  {
    id: "regular",
    name: "일반 적금",
    label: "일반 적금",
    maxMonthlyDeposit: 1000000,
    months: 36,
    contributionRate: 0,
    contributionLabel: "정부기여금 없음",
    description: "정책 지원이 없는 일반 은행 적금과 비교합니다.",
  },
  {
    id: "future-preferred-reference",
    name: "청년미래적금 우대형",
    label: "청년미래적금 우대형",
    maxMonthlyDeposit: 500000,
    months: 36,
    contributionRate: 0.12,
    contributionLabel: "정부기여금 12%",
    description: "저소득·취약청년 우대 조건을 충족할 때 적용하는 시나리오입니다.",
  },
];

export const LEAP_INCOME_TIERS = [
  {
    id: "tier-1",
    label: "총급여 2,400만 원 이하",
    contributionBaseAmount: 400000,
    contributionRate: 0.06,
    monthlyContributionMax: 24000,
  },
  {
    id: "tier-2",
    label: "총급여 3,600만 원 이하",
    contributionBaseAmount: 500000,
    contributionRate: 0.046,
    monthlyContributionMax: 23000,
  },
  {
    id: "tier-3",
    label: "총급여 4,800만 원 이하",
    contributionBaseAmount: 600000,
    contributionRate: 0.037,
    monthlyContributionMax: 22000,
  },
  {
    id: "tier-4",
    label: "총급여 6,000만 원 이하",
    contributionBaseAmount: 700000,
    contributionRate: 0.03,
    monthlyContributionMax: 21000,
  },
  {
    id: "tier-5",
    label: "총급여 7,500만 원 이하",
    contributionBaseAmount: 0,
    contributionRate: 0,
    monthlyContributionMax: 0,
  },
];

export const YOUTH_SAVINGS_PRESETS = [
  {
    id: "future-max",
    label: "미래적금 50만 원",
    description: "3년 만기 최대 납입",
    amount: 500000,
    productType: "future-general",
    monthlyDeposit: 500000,
    months: 36,
    bankRate: 5,
    extraBonusRate: 0,
    leapIncomeTier: "tier-2",
  },
  {
    id: "future-preferred-max",
    label: "우대형 50만 원",
    description: "정부기여금 12% 가정",
    amount: 500000,
    productType: "future-preferred",
    monthlyDeposit: 500000,
    months: 36,
    bankRate: 5,
    extraBonusRate: 0,
    leapIncomeTier: "tier-2",
  },
  {
    id: "leap-70",
    label: "도약계좌 70만 원",
    description: "5년 만기 최대 납입",
    amount: 700000,
    productType: "leap",
    monthlyDeposit: 700000,
    months: 60,
    bankRate: 5,
    extraBonusRate: 0,
    leapIncomeTier: "tier-2",
  },
];

export const DECISION_CARDS = [
  {
    fit: "단기 목표",
    title: "3년 안에 목돈이 필요하다",
    body: "청년미래적금은 36개월 만기라 주거비, 결혼, 이직 준비금처럼 가까운 목표에 맞추기 쉽습니다.",
    checks: ["3년 만기 선호", "월 50만 원 이하 납입", "중도해지 가능성 낮음"],
  },
  {
    fit: "장기 목돈",
    title: "월 70만 원 장기 납입이 가능하다",
    body: "청년도약계좌는 기간이 길지만 납입 한도가 커서 장기 목돈 형성에는 여전히 의미가 있습니다.",
    checks: ["5년 유지 가능", "월 70만 원 납입 가능", "기존 계좌 해지 손실 확인"],
  },
  {
    fit: "우대 조건",
    title: "우대형 조건을 충족한다",
    body: "청년미래적금 우대형은 정부기여금이 12%로 올라가므로 가입 전 증빙 가능성을 먼저 확인하세요.",
    checks: ["소득 증빙 가능", "우대형 심사 기준 확인", "은행별 공시 확인"],
  },
];

export const RELATED_LINKS = [
  {
    label: "청년미래적금 2026 출시판 업데이트",
    title: "청년미래적금 2026 출시판 업데이트",
    description: "출시 기준과 기존 상품 비교를 리포트로 확인합니다.",
    href: "/reports/youth-future-savings-2026/",
  },
  {
    label: "청년 적금 비교 2026",
    title: "청년 적금 비교 2026",
    description: "청년도약계좌와 청년미래적금을 표로 비교합니다.",
    href: "/reports/youth-savings-comparison-2026/",
  },
  {
    label: "고유가 피해지원금 계산기",
    title: "고유가 피해지원금 계산기",
    description: "6월 한정 지원금 신청 전 예상 수령액을 계산합니다.",
    href: "/tools/high-oil-support-payment-calculator/",
  },
];

export const FAQ_ITEMS = [
  {
    q: "청년미래적금 만기액은 확정 금액인가요?",
    question: "청년미래적금 만기액은 확정 금액인가요?",
    a:
      "아닙니다. 정부기여금 구조는 공개 기준을 반영하지만 은행 금리, 우대금리, 세제 적용 여부에 따라 실제 만기액은 달라집니다.",
    answer:
      "아닙니다. 정부기여금 구조는 공개 기준을 반영하지만 은행 금리, 우대금리, 세제 적용 여부에 따라 실제 만기액은 달라집니다.",
  },
  {
    q: "월 50만 원보다 적게 납입해도 되나요?",
    question: "월 50만 원보다 적게 납입해도 되나요?",
    a:
      "가능한 구조로 보는 것이 합리적입니다. 다만 납입액이 줄면 원금, 정부기여금, 이자가 모두 줄어듭니다.",
    answer:
      "가능한 구조로 보는 것이 합리적입니다. 다만 납입액이 줄면 원금, 정부기여금, 이자가 모두 줄어듭니다.",
  },
  {
    q: "청년도약계좌와 동시에 비교해야 하나요?",
    question: "청년도약계좌와 동시에 비교해야 하나요?",
    a:
      "기존 계좌가 있다면 반드시 비교해야 합니다. 중도해지 불이익이 새 상품의 장점보다 클 수 있습니다.",
    answer:
      "기존 계좌가 있다면 반드시 비교해야 합니다. 중도해지 불이익이 새 상품의 장점보다 클 수 있습니다.",
  },
];

export const SEO_INTRO = [
  "청년 정책형 적금은 매년 새 이름과 조건으로 등장해 어떤 상품이 나에게 유리한지 헷갈리기 쉽습니다. 사회초년생이 첫 적금을 고를 때, 기존 청년도약계좌 만기를 앞두고 갈아탈지 고민할 때, 또는 새로 출시된 청년미래적금 가입 여부를 결정할 때 가장 먼저 필요한 것이 만기 예상액 비교입니다.",
  "이 계산기는 월 납입액, 정부기여금 유형(일반형 6%·우대형 12%), 은행 금리를 입력받아 원금과 세전 이자, 정부기여금을 따로 계산한 뒤 합산합니다. 청년도약계좌는 소득구간별로 월 최대 기여금 한도가 달라 같은 납입액이라도 실제 받는 기여금이 다르므로, 두 상품을 같은 기준으로 환산해 비교할 수 있도록 설계했습니다.",
  "결과를 볼 때는 만기 총액 자체보다 \"정부기여금이 전체 수익에서 차지하는 비중\"을 함께 확인하는 것이 중요합니다. 기여금 비중이 높을수록 시중 적금보다 유리한 상품이라는 뜻이고, 비중이 낮다면 금리 자체가 더 중요한 변수가 됩니다. 청년도약계좌와 청년미래적금 5년 시나리오를 함께 비교하면 어느 쪽이 내 소득 구간에서 더 유리한지 가늠할 수 있습니다.",
  "다만 기존 계좌가 있는 상태에서 새 상품으로 옮기는 경우에는 이 계산기만으로 판단하면 안 됩니다. 중도해지 시 정부기여금을 일부 또는 전부 반환해야 하는 경우가 많아, 해지 손실이 새 상품의 기여금 혜택보다 클 수 있습니다. 갈아타기를 고민한다면 반드시 현재 가입 상품의 중도해지 조건을 먼저 확인한 뒤 비교하세요.",
];

export const SEO_CRITERIA = [
  "원금: 월 납입액과 납입 개월 수를 곱해 총 납입 원금을 계산합니다.",
  "정부기여금: 청년미래적금은 일반형 6%, 우대형 12%를 적용하고 청년도약계좌는 소득구간별 월 최대 기여금을 적용합니다.",
  "이자: 입력한 은행 금리와 우대금리를 합산해 세전 예상 이자를 계산합니다.",
];
