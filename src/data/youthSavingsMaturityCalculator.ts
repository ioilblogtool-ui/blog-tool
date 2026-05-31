export type YouthSavingsProductId = "future" | "leap" | "regular";
export type YouthFutureType = "general" | "preferred";
export type DataBadge = "공식" | "공시" | "추정" | "확인 필요";

export interface YouthSavingsInput {
  monthlyContribution: number;
  selectedProducts: YouthSavingsProductId[];
  youthFutureType: YouthFutureType;
  leapIncomeTierId: string;
  regularAnnualRate: number;
  regularMonths: number;
  includeTax: boolean;
  futureBaseRate: number;
  futureBonusRate: number;
  leapAnnualRate: number;
  policyTaxFree: boolean;
  applyContributionCap: boolean;
}

export interface YouthSavingsProductConfig {
  id: YouthSavingsProductId;
  name: string;
  shortName: string;
  months: number;
  monthlyLimit: number | null;
  defaultAnnualRate: number;
  isPolicyProduct: boolean;
  taxFreeDefault: boolean;
  badge: DataBadge;
  caution: string;
}

export interface YouthLeapIncomeTier {
  id: string;
  label: string;
  grossSalaryMax: number;
  contributionBaseAmount: number;
  contributionRate: number;
  monthlyContributionMax: number;
  note: string;
}

export interface YouthSavingsPreset {
  id: string;
  label: string;
  amount: number;
  description: string;
}

export interface DecisionCard {
  title: string;
  fit: string;
  checks: string[];
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const DEFAULT_YOUTH_SAVINGS_INPUT: YouthSavingsInput = {
  monthlyContribution: 500000,
  selectedProducts: ["future", "leap", "regular"],
  youthFutureType: "general",
  leapIncomeTierId: "salary-3600",
  regularAnnualRate: 3.5,
  regularMonths: 36,
  includeTax: true,
  futureBaseRate: 5,
  futureBonusRate: 2,
  leapAnnualRate: 6,
  policyTaxFree: true,
  applyContributionCap: true,
};

export const PRODUCT_CONFIGS: YouthSavingsProductConfig[] = [
  {
    id: "future",
    name: "청년미래적금",
    shortName: "미래적금",
    months: 36,
    monthlyLimit: 500000,
    defaultAnnualRate: 7,
    isPolicyProduct: true,
    taxFreeDefault: true,
    badge: "공식",
    caution: "가입 자격, 우대금리, 일반형·우대형 여부는 신청 시점 기준으로 확인해야 합니다.",
  },
  {
    id: "leap",
    name: "청년도약계좌",
    shortName: "도약계좌",
    months: 60,
    monthlyLimit: 700000,
    defaultAnnualRate: 6,
    isPolicyProduct: true,
    taxFreeDefault: true,
    badge: "공식",
    caution: "기존 가입자 유지·전환 판단은 가입 기간과 공식 전환 절차를 함께 확인해야 합니다.",
  },
  {
    id: "regular",
    name: "일반 적금",
    shortName: "일반적금",
    months: 36,
    monthlyLimit: null,
    defaultAnnualRate: 3.5,
    isPolicyProduct: false,
    taxFreeDefault: false,
    badge: "추정",
    caution: "은행별 금리와 세금, 우대조건에 따라 실제 수령액이 달라질 수 있습니다.",
  },
];

export const LEAP_INCOME_TIERS: YouthLeapIncomeTier[] = [
  {
    id: "salary-2400",
    label: "총급여 2,400만 원 이하",
    grossSalaryMax: 24000000,
    contributionBaseAmount: 400000,
    contributionRate: 0.06,
    monthlyContributionMax: 24000,
    note: "월 납입액과 40만 원 중 작은 금액 기준",
  },
  {
    id: "salary-3600",
    label: "총급여 3,600만 원 이하",
    grossSalaryMax: 36000000,
    contributionBaseAmount: 500000,
    contributionRate: 0.046,
    monthlyContributionMax: 23000,
    note: "월 납입액과 50만 원 중 작은 금액 기준",
  },
  {
    id: "salary-4800",
    label: "총급여 4,800만 원 이하",
    grossSalaryMax: 48000000,
    contributionBaseAmount: 600000,
    contributionRate: 0.037,
    monthlyContributionMax: 22000,
    note: "월 납입액과 60만 원 중 작은 금액 기준",
  },
  {
    id: "salary-6000",
    label: "총급여 6,000만 원 이하",
    grossSalaryMax: 60000000,
    contributionBaseAmount: 700000,
    contributionRate: 0.03,
    monthlyContributionMax: 21000,
    note: "월 납입액과 70만 원 중 작은 금액 기준",
  },
  {
    id: "salary-7500",
    label: "총급여 7,500만 원 이하",
    grossSalaryMax: 75000000,
    contributionBaseAmount: 0,
    contributionRate: 0,
    monthlyContributionMax: 0,
    note: "정부기여금 없이 비과세 혜택 중심",
  },
];

export const YOUTH_SAVINGS_PRESETS: YouthSavingsPreset[] = [
  { id: "amount-100k", label: "월 10만 원", amount: 100000, description: "소액 시작" },
  { id: "amount-300k", label: "월 30만 원", amount: 300000, description: "현실적 저축" },
  { id: "amount-500k", label: "월 50만 원", amount: 500000, description: "청년미래적금 최대" },
  { id: "amount-700k", label: "월 70만 원", amount: 700000, description: "청년도약계좌 최대" },
];

export const DECISION_CARDS: DecisionCard[] = [
  {
    title: "청년미래적금 우대형 가능성이 높다면",
    fit: "3년 만기 중심으로 전환 검토",
    checks: ["중소기업 재직 또는 신규 취업 조건", "소득·가구소득 기준", "월 50만 원 납입 유지"],
  },
  {
    title: "청년도약계좌를 오래 납입했다면",
    fit: "유지와 전환을 함께 비교",
    checks: ["현재 납입 기간", "기존 혜택 유지 여부", "전환 신청 가능 기간"],
  },
  {
    title: "월 납입액이 부담된다면",
    fit: "최대 납입보다 지속 가능성 우선",
    checks: ["비상금", "월 고정지출", "중도해지 가능성"],
  },
];

export const RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/youth-future-savings-2026/",
    label: "청년미래적금 조건·만기 수령액 정리",
    description: "청년미래적금 가입 대상과 일반형·우대형 차이를 확인합니다.",
  },
  {
    href: "/reports/2026-government-welfare-benefits/",
    label: "2026 정부 복지지원금 완전 정복",
    description: "청년 지원금과 다른 복지 제도를 함께 비교합니다.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "가구소득 기준으로 지원 가능성을 점검합니다.",
  },
  {
    href: "/tools/savings-vs-etf-retirement/",
    label: "월 적금 vs ETF 노후 계산기",
    description: "적금 안정성과 장기 투자 수익률을 비교합니다.",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "계산 결과가 실제 만기 수령액과 같나요?",
    a: "아닙니다. 금리, 우대조건, 납입일, 중도해지 여부, 정부기여금 지급 방식에 따라 달라지는 추정값입니다.",
  },
  {
    q: "청년미래적금 우대형은 누구나 선택해도 되나요?",
    a: "아닙니다. 중소기업 재직, 신규 취업, 소상공인 매출, 소득 기준 등 세부 조건을 충족해야 합니다.",
  },
  {
    q: "청년도약계좌는 2026년에도 계산해야 하나요?",
    a: "기존 가입자나 전환을 고민하는 사용자는 유지했을 때의 예상 만기 수령액을 비교할 필요가 있습니다.",
  },
  {
    q: "일반 적금 금리는 세전으로 입력하나요?",
    a: "기본 입력은 세전 연 금리입니다. 세금 반영을 켜면 이자소득세 15.4%를 단순 차감합니다.",
  },
  {
    q: "월 납입액이 한도를 넘으면 어떻게 계산하나요?",
    a: "정책 적금은 상품별 월 납입 한도까지만 반영하고, 초과분은 계산에서 제외했다는 안내를 표시합니다.",
  },
];

export const SEO_INTRO = [
  "청년 적금 만기 수령액 계산기는 청년미래적금, 청년도약계좌, 일반 적금의 예상 수령액을 같은 월 납입액 기준으로 비교합니다.",
  "정책 적금은 일반 적금과 달리 정부기여금과 비과세 혜택이 붙을 수 있어 단순 금리만 보면 차이를 정확히 파악하기 어렵습니다.",
  "이 계산기는 매월 같은 금액을 납입한다고 가정한 단순 추정 도구입니다. 실제 가입 가능 여부와 금리, 정부기여금 적용 여부는 공식 공고와 은행 상품설명서가 우선합니다.",
];

export const SEO_CRITERIA = [
  "청년미래적금은 36개월, 월 50만 원 한도, 일반형 6%·우대형 12% 정부기여금 기준으로 계산합니다.",
  "청년도약계좌는 60개월, 월 70만 원 한도, 소득구간별 월 최대 정부기여금 기준으로 계산합니다.",
  "일반 적금은 입력한 만기와 금리를 기준으로 이자소득세 15.4% 차감 여부를 반영합니다.",
  "적금 이자는 월 납입액이 매월 동일하게 들어간다는 단순 적립식 공식으로 추정합니다.",
];
