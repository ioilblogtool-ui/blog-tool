// 자녀 증여세 계산기 — 데이터 파일
// 모든 수치는 국세청 공시 기준 추정값·참고용입니다. 실제 신고는 홈택스·세무 전문가를 통해 확인하세요.

export const PAGE_META = {
  title: "자녀 증여세 계산기 — 미성년 2천·성년 5천·혼인 1억 한도",
  subtitle: "자녀 나이와 증여금액 입력하면 미성년 2,000만원·성년 5,000만원·혼인·출산 추가공제 1억원까지 반영한 예상 증여세 바로 계산. 생애 증여 플랜표 포함.",
  methodology: "증여재산공제·증여세율은 2026년 6월 기준 국세청 공시 자료를 따릅니다.",
  caution: "이 계산기는 참고용 추정값을 제공합니다. 실제 신고 여부와 세액은 홈택스 또는 세무 전문가를 통해 반드시 확인하세요.",
  updatedAt: "2026년 6월 기준",
};

export interface GiftTaxBracket {
  maxBase: number | null; // null = 무제한 (30억 초과)
  rate: number;
  deduction: number;
}

export const GIFT_TAX_BRACKETS: GiftTaxBracket[] = [
  { maxBase: 100_000_000, rate: 0.1, deduction: 0 },
  { maxBase: 500_000_000, rate: 0.2, deduction: 10_000_000 },
  { maxBase: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
  { maxBase: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { maxBase: null, rate: 0.5, deduction: 460_000_000 },
];

export const MINOR_BASIC_DEDUCTION = 20_000_000;
export const ADULT_BASIC_DEDUCTION = 50_000_000;
export const MARRIAGE_BIRTH_MAX_DEDUCTION = 100_000_000;
export const MINOR_AGE_THRESHOLD = 19;

export interface LifetimeGiftPlanStep {
  stage: string;
  strategy: string;
  taxFreeAmount: string;
}

export const LIFETIME_GIFT_PLAN: LifetimeGiftPlanStep[] = [
  { stage: "출생~미성년", strategy: "자녀 명의 계좌 증여", taxFreeAmount: "2,000만원" },
  { stage: "성년 이후", strategy: "대학·사회초년생 자금", taxFreeAmount: "5,000만원" },
  { stage: "결혼 시", strategy: "혼인 추가공제 활용", taxFreeAmount: "1억원" },
  { stage: "출산 시", strategy: "출산 추가공제 검토", taxFreeAmount: "혼인·출산 합산 1억원" },
  { stage: "주택 구입 시", strategy: "기존 증여 이력 합산 체크", taxFreeAmount: "초과분 과세" },
];

export const PAGE_FAQ = [
  {
    question: "아기 증여 2,000만원 신고해야 하나요?",
    answer: "미성년 자녀는 10년 합산 2,000만원까지 증여재산공제가 적용되어 과세표준이 0원이면 납부할 세금은 없습니다. 다만 법적 신고 의무와 별개로, 목돈 증여는 0원 신고를 해두면 향후 자금출처 소명에 유리할 수 있습니다.",
  },
  {
    question: "자녀 증여세 5,000만원은 몇 년마다 가능한가요?",
    answer: "성년 자녀 기본공제 5,000만원은 10년 단위로 합산해 적용됩니다. 즉 10년이 지나면 공제 한도가 다시 차감 없이 채워집니다.",
  },
  {
    question: "결혼할 때 부모가 1억 줘도 세금 없나요?",
    answer: "혼인신고일 전후 2년 이내라는 요건을 충족하면 기본공제(5,000만원)에 혼인 추가공제(최대 1억원)를 더해 최대 1억 5,000만원까지 증여세 없이 증여할 수 있습니다. 요건을 충족하지 못하면 추가공제는 적용되지 않습니다.",
  },
  {
    question: "자녀 결혼자금 1억 5,000만원까지 비과세인가요?",
    answer: "성년 자녀 기본공제 5,000만원과 혼인 추가공제 1억원을 모두 적용한 경우의 최대 한도입니다. 직전 10년 이내 이미 증여한 금액이 있다면 그만큼 한도에서 차감됩니다.",
  },
  {
    question: "조부모가 손주에게 증여하면 한도는 얼마인가요?",
    answer: "직계존속 증여 공제는 수증자(자녀) 기준으로 10년간 합산됩니다. 부모와 조부모가 각각 따로 공제를 받는 것이 아니라, 자녀가 받은 전체 증여액을 기준으로 동일한 공제 한도를 공유합니다.",
  },
  {
    question: "아기 주식계좌에 2,000만원 넣으면 신고해야 하나요?",
    answer: "주식·예금 등 자산 종류와 관계없이 증여로 간주되며, 미성년 기본공제 2,000만원 이내라면 세금은 없습니다. 다만 운용 후 발생한 수익이 추가 증여로 간주될 수 있어 장기 투자 목적이라면 0원 신고를 권장합니다.",
  },
  {
    question: "자녀 주택자금 증여세는 얼마인가요?",
    answer: "기본공제·혼인 추가공제를 초과하는 금액에 대해 5단계 누진세율(10~50%)이 적용됩니다. 주택자금은 금액이 크고 자금출처 소명 가능성이 높은 영역이므로 사전에 정확한 계산과 신고가 특히 중요합니다.",
  },
  {
    question: "부모가 매달 용돈 주는 것도 증여인가요?",
    answer: "사회통념상 인정되는 생활비·교육비는 원칙적으로 증여세 과세 대상이 아닙니다. 다만 금액이 크거나 자산 형성 목적으로 누적되면 증여로 판단될 수 있어 주의가 필요합니다.",
  },
  {
    question: "혼인공제와 출산공제 둘 다 받을 수 있나요?",
    answer: "혼인 추가공제와 출산 추가공제는 합산 한도 1억원으로 운영됩니다. 결혼 때 1억원을 모두 사용했다면 출산 시 별도로 추가 1억원을 더 받을 수 있는 구조가 아닙니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/wedding-gift-break-even-calculator/", label: "결혼 축의금 손익분기점 계산기" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "10년 적립식 투자 계산기" },
];
