export type FetalCoveragePlan = "basic" | "standard" | "enhanced";
export type PaymentTerm = "10y" | "20y" | "30y";
export type MaturityAge = "30" | "80" | "100";
export type WeekBandKey = "early" | "golden" | "check" | "late" | "urgent";
export type WeekBandStatus = "safe" | "caution" | "late";
export type AgeBandKey = "20_29" | "30_34" | "35_39" | "40_45";

export interface WeekBand {
  key: WeekBandKey;
  minWeek: number;
  maxWeek: number;
  label: string;
  status: WeekBandStatus;
}

export interface PremiumRangeRule {
  maternalAgeBand: AgeBandKey;
  weekBand: WeekBandKey;
  plan: FetalCoveragePlan;
  paymentTerm: PaymentTerm;
  maturityAge: MaturityAge;
  monthlyMin: number;
  monthlyMax: number;
}

export interface SpecialContractOption {
  id: string;
  label: string;
  extraMonthly: number;
  defaultSelected: boolean;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const FI_META = {
  slug: "fetal-insurance-calculator",
  title: "태아보험 보험료 계산기",
  eyebrow: "임신·출산 보험",
  subtitle:
    "임신 주수, 산모 나이, 보장 구성, 특약 선택을 기준으로 월 보험료 범위와 총 납입 예상액을 계산합니다.",
  updatedAt: "2026-04",
  disclaimer:
    "실제 보험료는 고지 항목, 인수 조건, 특약 구성, 보험사 심사 결과에 따라 달라질 수 있습니다. 이 계산기는 범위 추정용입니다.",
};

export const FI_DEFAULT_STATE = {
  week: 13,
  maternalAge: 32,
  plan: "standard" as FetalCoveragePlan,
  paymentTerm: "20y" as PaymentTerm,
  maturityAge: "80" as MaturityAge,
  specialOptions: ["newborn-admission", "congenital-check", "nicu"],
  highRisk: false,
  underserved: false,
};

export const FI_WEEK_BANDS: WeekBand[] = [
  { key: "early", minWeek: 4, maxWeek: 11, label: "초기 검토 구간", status: "safe" },
  { key: "golden", minWeek: 12, maxWeek: 16, label: "비교 시작 적정 구간", status: "safe" },
  { key: "check", minWeek: 17, maxWeek: 21, label: "조건 점검 집중 구간", status: "caution" },
  { key: "late", minWeek: 22, maxWeek: 27, label: "일부 특약 제한 가능 구간", status: "late" },
  { key: "urgent", minWeek: 28, maxWeek: 32, label: "마감 전 빠른 확인 구간", status: "late" },
];

export const FI_PLAN_LABELS: Record<FetalCoveragePlan, string> = {
  basic: "기본형",
  standard: "표준형",
  enhanced: "강화형",
};

export const FI_PAYMENT_TERM_LABELS: Record<PaymentTerm, string> = {
  "10y": "10년 납",
  "20y": "20년 납",
  "30y": "30년 납",
};

export const FI_MATURITY_LABELS: Record<MaturityAge, string> = {
  "30": "30세 만기",
  "80": "80세 만기",
  "100": "100세 만기",
};

export const FI_SPECIAL_OPTIONS: SpecialContractOption[] = [
  {
    id: "newborn-admission",
    label: "신생아 입원",
    extraMonthly: 4000,
    defaultSelected: true,
    description: "출생 직후 입원·치료 상황을 대비하는 기본 특약",
  },
  {
    id: "congenital-check",
    label: "선천 이상 진단",
    extraMonthly: 6000,
    defaultSelected: true,
    description: "주요 선천성 질환 진단 보장을 강화하는 구성",
  },
  {
    id: "nicu",
    label: "NICU·인큐베이터",
    extraMonthly: 4500,
    defaultSelected: true,
    description: "신생아 집중치료실 입원 리스크를 반영하는 특약",
  },
  {
    id: "surgery",
    label: "수술·입원 강화",
    extraMonthly: 3500,
    defaultSelected: false,
    description: "수술비·입원일당 계열을 조금 더 두껍게 잡는 선택",
  },
  {
    id: "disease",
    label: "질병 진단 강화",
    extraMonthly: 5000,
    defaultSelected: false,
    description: "질병 진단형 보장을 넓게 붙이는 구성",
  },
];

const AGE_ADJUSTMENTS: Record<AgeBandKey, { min: number; max: number }> = {
  "20_29": { min: -4000, max: -2000 },
  "30_34": { min: 0, max: 0 },
  "35_39": { min: 7000, max: 9000 },
  "40_45": { min: 14000, max: 18000 },
};

const WEEK_ADJUSTMENTS: Record<WeekBandKey, { min: number; max: number }> = {
  early: { min: -1000, max: 1000 },
  golden: { min: 0, max: 0 },
  check: { min: 3000, max: 5000 },
  late: { min: 7000, max: 10000 },
  urgent: { min: 11000, max: 15000 },
};

const PLAN_BASES: Record<FetalCoveragePlan, { min: number; max: number }> = {
  basic: { min: 26000, max: 36000 },
  standard: { min: 42000, max: 56000 },
  enhanced: { min: 59000, max: 76000 },
};

const TERM_ADJUSTMENTS: Record<PaymentTerm, { min: number; max: number }> = {
  "10y": { min: 9000, max: 12000 },
  "20y": { min: 0, max: 0 },
  "30y": { min: -5000, max: -7000 },
};

const MATURITY_ADJUSTMENTS: Record<MaturityAge, { min: number; max: number }> = {
  "30": { min: -4000, max: -5000 },
  "80": { min: 0, max: 0 },
  "100": { min: 5000, max: 7000 },
};

export const FI_PREMIUM_RULES: PremiumRangeRule[] = (
  ["20_29", "30_34", "35_39", "40_45"] as AgeBandKey[]
).flatMap((maternalAgeBand) =>
  FI_WEEK_BANDS.flatMap((band) =>
    (["basic", "standard", "enhanced"] as FetalCoveragePlan[]).flatMap((plan) =>
      (["10y", "20y", "30y"] as PaymentTerm[]).flatMap((paymentTerm) =>
        (["30", "80", "100"] as MaturityAge[]).map((maturityAge) => {
          const base = PLAN_BASES[plan];
          const age = AGE_ADJUSTMENTS[maternalAgeBand];
          const week = WEEK_ADJUSTMENTS[band.key];
          const term = TERM_ADJUSTMENTS[paymentTerm];
          const maturity = MATURITY_ADJUSTMENTS[maturityAge];

          return {
            maternalAgeBand,
            weekBand: band.key,
            plan,
            paymentTerm,
            maturityAge,
            monthlyMin: base.min + age.min + week.min + term.min + maturity.min,
            monthlyMax: base.max + age.max + week.max + term.max + maturity.max,
          };
        })
      )
    )
  )
);

export const FI_GUIDE_TEXT = {
  status: {
    safe: {
      title: "지금은 비교 설계를 시작하기 좋은 구간입니다",
      body: "주요 특약 구성을 검토하고 불필요한 중복만 줄이면 안정적으로 범위를 잡기 좋습니다.",
      tone: "positive" as const,
    },
    caution: {
      title: "보장 구성 점검을 서두를 시점입니다",
      body: "주수가 올라가면 일부 특약 제한이나 조건 변경 가능성이 있어, 보장 우선순위를 먼저 정리하는 편이 안전합니다.",
      tone: "warn" as const,
    },
    late: {
      title: "조건 확인을 빠르게 끝내야 하는 구간입니다",
      body: "마감 임박 구간에서는 심사 결과와 특약 선택 폭이 좁아질 수 있어, 비교 범위를 넓히기보다 핵심 보장을 먼저 확정하는 편이 낫습니다.",
      tone: "warn" as const,
    },
  },
  factors: {
    standard: "기본 비교 기준으로 보기 좋은 구성입니다.",
    highRisk: "고위험 임신 여부가 있으면 실제 심사에서 가산 또는 제한이 붙을 수 있습니다.",
    underserved: "분만취약지 거주 여부는 보험료 자체보다 병원 접근성과 준비 일정 점검에 더 중요합니다.",
  },
};

export const FI_FAQ: FaqItem[] = [
  {
    question: "태아보험은 몇 주까지 비교 가능한가요?",
    answer:
      "보험사와 특약 구성에 따라 다르지만 보통 임신 22주 전후까지 비교를 마치는 편이 안전합니다. 이 계산기는 주차별 체크 상태를 먼저 확인하는 용도로 설계했습니다.",
  },
  {
    question: "성별 입력 없이도 계산할 수 있나요?",
    answer:
      "네. 이 페이지는 특정 보험사 상품 비교가 아니라 주차, 산모 연령, 보장 구성 기준의 범위 추정 계산기라서 성별 입력을 받지 않습니다.",
  },
  {
    question: "총 납입액은 어떻게 계산하나요?",
    answer:
      "월 보험료 범위에 납입 기간 개월 수를 곱해 최소값과 최대값 범위로 보여줍니다. 중도 해지 환급이나 실제 납입 중 특약 조정은 반영하지 않습니다.",
  },
  {
    question: "고위험 임신이면 무조건 가입이 안 되나요?",
    answer:
      "무조건 불가로 보는 것은 맞지 않습니다. 다만 심사 가산, 특약 제한, 병력 확인 범위가 달라질 수 있어 보험료 범위를 더 보수적으로 보는 편이 안전합니다.",
  },
];

export const FI_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 비용 비교 2026" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
];
