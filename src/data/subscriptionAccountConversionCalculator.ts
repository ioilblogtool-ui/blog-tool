export type AccountType = "savings" | "deposit" | "installment";
export type TargetHousing = "national" | "private" | "both";

export interface SaccHousingRule {
  existingHousing: string; // 기존 통장으로 원래 가능했던 주택 유형
  existingRecognition: string; // 기존 실적 인정 방식
  newHousing: string; // 전환으로 새롭게 가능해진 주택 유형
  newRecognition: string; // 신규 확대 유형의 실적 인정 방식(전환 후부터)
}

export interface SaccTimingRule {
  label: string; // "특정 청약을 위한 전환 시점"
}

export interface SaccPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export interface SaccFaqItem {
  question: string;
  answer: string;
}

export interface SaccTaxBracket {
  value: number; // 한계세율(지방소득세 포함, %)
  label: string;
}

export const SACC_META = {
  slug: "subscription-account-conversion-calculator",
  title: "청약통장 전환 금리·자격 비교 계산기",
  seoTitle: "2026 청약통장 전환 계산기 | 9월 30일 마감, 전환 전 꼭 확인할 것",
  seoDescription:
    "청약예금·청약부금·청약저축을 주택청약종합저축으로 전환할 때 금리 차이, 실적 인정 범위, 소득공제 효과를 함께 비교합니다. 전환 마감 2026년 9월 30일, 전환 후 원상복구는 불가능합니다.",
  dataNote:
    "청약예금·부금·저축을 주택청약종합저축으로 전환하는 제도를 기준으로 한 참고용 추정입니다. 전환 마감은 2026년 9월 30일까지이며, 실제 적용 금리와 실적 인정 방식은 은행별 약관과 청약 시점에 따라 달라질 수 있습니다.",
  updatedAt: "2026-07-22",
};

export const SACC_POLICY_META = {
  conversionDeadline: "2026-09-30",
  newProductName: "주택청약종합저축",
  maxNewRatePercent: 3.1,
  sourceNote: "KB의 생각(2026-06), 토스피드 안내 참고",
};

export const SACC_DEFAULT_RATE_BY_TYPE: Record<AccountType, number> = {
  savings: 2.1,
  deposit: 2.1,
  installment: 2.0,
};

export const SACC_ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  savings: "청약저축",
  deposit: "청약예금",
  installment: "청약부금",
};

// 통장 종류별 실적 인정 방식 — "기존에 가능했던 주택"과 "전환으로 새롭게 가능해진 주택"의 인정 기준이 다르다는 점을 명확히 표시
export const SACC_HOUSING_RULES: Record<AccountType, SaccHousingRule> = {
  deposit: {
    existingHousing: "민영주택",
    existingRecognition: "기존 가입기간과 예치금 그대로 인정",
    newHousing: "국민주택",
    newRecognition: "전환일 이후의 납입기간·납입금액·납입회차만 인정",
  },
  installment: {
    existingHousing: "민영주택(전용 85㎡ 이하)",
    existingRecognition: "기존 가입기간과 전환금액 인정",
    newHousing: "국민주택 및 확대된 면적",
    newRecognition: "전환일 이후 실적 중심으로 인정",
  },
  savings: {
    existingHousing: "국민주택",
    existingRecognition: "기존 가입기간·납입인정금액·납입회차 인정",
    newHousing: "민영주택",
    newRecognition: "기존 납입금액은 예치금으로 인정되나, 민영주택 청약을 위한 가입기간은 전환일 기준으로 판단될 수 있음",
  },
};

// 특정 분양에 전환 통장으로 청약하려면 9/30 마감보다 더 일찍 전환해야 할 수 있음
export const SACC_APPLICATION_TIMING: Record<AccountType, SaccTimingRule> = {
  savings: { label: "입주자모집공고일 전일까지 전환 완료 필요" },
  deposit: { label: "최초 청약접수일(특별공급 포함) 전일까지 전환 완료 필요" },
  installment: { label: "최초 청약접수일(특별공급 포함) 전일까지 전환 완료 필요" },
};

export const SACC_TAX_BRACKETS: SaccTaxBracket[] = [
  { value: 6.6, label: "연소득 1,400만원 이하 (6.6%)" },
  { value: 16.5, label: "연소득 1,400만~5,000만원 (16.5%)" },
  { value: 26.4, label: "연소득 5,000만~8,800만원 (26.4%)" },
  { value: 38.5, label: "연소득 8,800만~1.5억원 (38.5%)" },
  { value: 41.8, label: "연소득 1.5억원 초과 (41.8%+)" },
];

export const SACC_INCOME_DEDUCTION_META = {
  annualLimit: 3_000_000, // 연 납입액 한도
  deductionRate: 0.4, // 공제율 40%
  eligibilityNote: "무주택 세대주이며 총급여 7,000만 원 이하 근로소득자에게 적용될 수 있습니다. 실제 대상 여부는 국세청 기준을 확인하세요.",
};

export const SACC_PRESETS: SaccPreset[] = [
  { id: "old-deposit", label: "오래된 청약예금", summary: "청약예금 2,000만 원 · 민영주택만 청약 예정", input: { accountType: "deposit", currentBalance: 20000000, currentRate: 2.1, yearsHeld: 10, yearsToHold: 3, targetHousing: "private", monthlyContribution: 0, taxRate: 16.5 } },
  { id: "small-installment", label: "청약부금 소액 가입자", summary: "청약부금 500만 원", input: { accountType: "installment", currentBalance: 5000000, currentRate: 2.0, yearsHeld: 5, yearsToHold: 3, targetHousing: "both", monthlyContribution: 100000, taxRate: 16.5 } },
  { id: "long-savings", label: "청약저축 장기 보유", summary: "청약저축 1,000만 원 · 국민+민영 모두 검토", input: { accountType: "savings", currentBalance: 10000000, currentRate: 2.1, yearsHeld: 15, yearsToHold: 3, targetHousing: "both", monthlyContribution: 100000, taxRate: 16.5 } },
];

export const SACC_FAQ: SaccFaqItem[] = [
  {
    question: "전환하면 기존 통장으로 되돌릴 수 있나요?",
    answer: "아니요. 주택청약종합저축으로 전환한 뒤에는 기존 청약예금·청약부금·청약저축으로 되돌릴 수 없습니다. 전환 후에는 기존 통장을 사용한 청약도 불가능하므로 예정된 청약 일정과 목표 주택 유형을 먼저 확인해야 합니다.",
  },
  {
    question: "기존 가입기간은 모두 인정되나요?",
    answer: "기존 통장으로 원래 청약할 수 있었던 주택 유형에는 기존 실적이 인정됩니다. 그러나 전환으로 새롭게 가능해진 주택 유형은 전환 이후의 가입기간·납입금액·회차만 인정될 수 있습니다. 예를 들어 청약예금에서 국민주택으로 확대되는 경우, 기존 가입기간이 국민주택 납입실적으로 그대로 인정되는 것은 아닙니다.",
  },
  {
    question: "전환하면 청약 당첨 가능성이 높아지나요?",
    answer: "자동으로 당첨 확률이 높아지는 것은 아닙니다. 신청 가능한 주택 유형이 확대될 뿐이며, 실제 당첨 가능성은 무주택기간, 부양가족, 가입기간, 납입회차, 납입인정금액과 공급 경쟁률 등에 따라 달라집니다.",
  },
  {
    question: "9월 30일까지 기다려도 되나요?",
    answer: "예정된 청약이 없다면 제도상 마감일 전에 전환하면 됩니다. 다만 청약저축은 입주자모집공고일 전일까지, 청약예금·부금은 최초 청약접수일 전일까지 전환해야 해당 전환 통장으로 신청할 수 있으므로, 가까운 청약 일정이 있다면 더 일찍 처리해야 합니다.",
  },
  {
    question: "전환하지 않고 기존 통장을 유지하면 불이익이 있나요?",
    answer: "전환하지 않아도 기존 통장은 유지되며, 기존 상품으로 신청할 수 있던 주택에는 계속 청약할 수 있습니다. 다만 현행 기준상 2026년 9월 30일 이후에는 종합저축으로 전환할 기회를 놓칠 수 있습니다.",
  },
  {
    question: "전환 후 금리는 무조건 3.1%인가요?",
    answer: "3.1%는 2년 이상 구간에 적용되는 최고 금리입니다. 가입기간별로 적용금리가 다르고 정부 고시에 따라 변경될 수 있으므로, 전환 시점의 은행 상품설명서를 확인해야 합니다.",
  },
  {
    question: "소득공제는 누구나 받을 수 있나요?",
    answer: "무주택 세대주이며 총급여 7,000만 원 이하 근로소득자 등 일정 요건을 충족해야 합니다. 연 납입액 300만 원 한도에서 40%(최대 120만 원)가 소득에서 공제되는 것이며, 이 금액을 그대로 환급받는 것은 아닙니다. 실제 절세액은 본인의 한계세율에 따라 달라집니다.",
  },
  {
    question: "예치금 전액이 새로운 주택 유형 실적으로 그대로 인정되나요?",
    answer: "전환금액은 새 종합저축 통장으로 이어지지만, 민영주택 예치금과 국민주택 납입인정금액의 인정 방식은 다릅니다. 전환금액 전체가 새로운 주택 유형의 납입회차 실적으로 소급 인정되는 것은 아닙니다.",
  },
];

export const SACC_SEO_CONTENT = {
  introTitle: "청약통장 전환, 금리보다 먼저 확인해야 할 것",
  intro: [
    "청약예금, 청약부금, 청약저축을 보유하고 있다면 2026년 9월 30일까지 주택청약종합저축으로 전환할 수 있습니다. 전환 후에는 국민주택과 민영주택 모두에 청약할 수 있고, 기존 통장보다 높은 금리와 소득공제 혜택을 받을 가능성이 있습니다.",
    "다만 기존 가입기간과 납입실적이 모든 주택 유형에 똑같이 인정되는 것은 아닙니다. 기존 통장으로 원래 청약할 수 있었던 주택 유형에는 기존 실적이 인정되지만, 전환으로 새롭게 청약할 수 있게 된 주택 유형은 전환일 이후의 가입기간, 납입금액 또는 납입회차만 인정될 수 있습니다.",
    "이 계산기는 현재 통장 종류, 잔액, 적용금리와 예상 보유기간을 입력하면 전환 전후의 단순 세전 이자와 청약 가능 주택 유형, 소득공제 가능성을 함께 비교합니다. 전환 후에는 기존 통장으로 되돌릴 수 없으므로, 가까운 청약 일정이 있거나 기존 통장의 우대금리가 높다면 금리 차이만 보지 말고 목표 주택과 실적 인정 범위를 함께 확인한 뒤 결정하는 것이 안전합니다.",
  ],
  inputPoints: [
    "통장 종류, 예치금, 금리, 목표 주택 유형을 입력하면 전환 전후 세전 단순 이자 차이가 계산됩니다.",
    "기존 실적이 인정되는 주택 유형과 전환 후에만 인정되는 주택 유형을 구분해 보여줍니다.",
    "월 추가 납입액과 소득 구간을 입력하면 예상 소득공제 효과도 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "전환 마감일은 2026년 9월 30일 기준이며, 특정 청약을 위한 전환은 모집공고일·접수일 이전에 완료해야 할 수 있습니다.",
    "이자 비교는 세전 단리 방식의 참고용 추정이며, 실제 정산 방식은 은행 약관에 따라 다를 수 있습니다.",
    "전환으로 새롭게 가능해진 주택 유형은 전환일 이후 실적만 인정되며, 전환 후에는 기존 통장으로 되돌릴 수 없습니다.",
  ],
};

export const SACC_RELATED_LINKS = [
  { href: "/tools/apt-cheonyak-gajum-calculator/", label: "아파트 청약 가점 계산기" },
  { href: "/reports/2026-seoul-apt-cheonyak-cutline/", label: "2026 서울 아파트 청약 당첨 가점 커트라인" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/income-home-affordability/", label: "소득 대비 집값 부담 계산기" },
];
