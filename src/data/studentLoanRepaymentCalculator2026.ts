export type CourseType = "UNDERGRAD" | "GRAD";

// 2026년 확정값 — 취업 후 상환 학자금대출(ICL)
export const LOAN_INTEREST_RATE_2026 = 1.7; // 연 %
export const REPAYMENT_THRESHOLD_INCOME_2026 = 30_370_000; // 연 상환기준소득
export const REPAYMENT_RATE: Record<CourseType, number> = { UNDERGRAD: 0.2, GRAD: 0.25 };
export const MAX_GRACE_PLUS_REPAY_YEARS = 20;

export interface LoanInput {
  principal: number; // 등록금대출+생활비대출 합산
  interestRate: number; // 기본 1.7, 수정 가능
  graceYears: number; // 거치기간(0~10)
  repayYears: number; // 상환기간(1~10) — 균등분할 참고치 계산에만 사용
  expectedAnnualIncome: number; // 졸업 후 예상 연소득
  courseType: CourseType;
}

export interface LoanResult {
  graceInterest: number;
  balanceAfterGrace: number;
  annualMandatoryRepay: number; // 소득연계 의무상환액(연)
  monthlyMandatoryRepay: number;
  mandatoryPayoffYears: number | null; // 단순 잔액÷연 의무상환액(참고 근사치)
  monthlyEqualPayment: number; // 균등분할 참고치(월)
  totalEqualPaid: number;
  totalEqualInterest: number;
}

// public/scripts/student-loan-repayment-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcLoanRepayment(input: LoanInput): LoanResult {
  const graceInterest = input.principal * (input.interestRate / 100) * input.graceYears;
  const balanceAfterGrace = input.principal + graceInterest;

  const rate = REPAYMENT_RATE[input.courseType];
  const annualMandatoryRepay = Math.max((input.expectedAnnualIncome - REPAYMENT_THRESHOLD_INCOME_2026) * rate, 0);
  const monthlyMandatoryRepay = annualMandatoryRepay / 12;
  const mandatoryPayoffYears = annualMandatoryRepay > 0 ? balanceAfterGrace / annualMandatoryRepay : null;

  const monthlyRate = input.interestRate / 100 / 12;
  const n = input.repayYears * 12;
  const monthlyEqualPayment =
    monthlyRate > 0
      ? (balanceAfterGrace * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : balanceAfterGrace / n;
  const totalEqualPaid = monthlyEqualPayment * n;
  const totalEqualInterest = totalEqualPaid - balanceAfterGrace;

  return {
    graceInterest,
    balanceAfterGrace,
    annualMandatoryRepay,
    monthlyMandatoryRepay,
    mandatoryPayoffYears,
    monthlyEqualPayment,
    totalEqualPaid,
    totalEqualInterest,
  };
}

export const SLR_DEFAULT_INPUT: LoanInput = {
  principal: 20_000_000,
  interestRate: LOAN_INTEREST_RATE_2026,
  graceYears: 4,
  repayYears: 10,
  expectedAnnualIncome: 36_000_000,
  courseType: "UNDERGRAD",
};

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SLR_META = {
  slug: "student-loan-repayment-calculator-2026",
  title: "학자금대출 계산기 2026",
  seoTitle: "학자금대출 계산기 2026 | 졸업 후 월 상환액 바로 계산",
  seoDescription:
    "대출 원금·거치기간·졸업 후 예상 연봉을 입력하면 취업 후 상환 학자금대출의 소득연계 의무상환액과 균등분할 참고액을 함께 계산합니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "실제 취업 후 상환 학자금대출은 연소득이 상환기준소득(2026년 3,037만 원)을 초과할 때만 초과분의 20%(대학원 25%)를 원천공제하는 소득연계 방식입니다. '균등분할 상환 참고치'는 일반 대출처럼 매달 동일 금액을 갚는다고 가정한 비교값이며 실제 제도 방식이 아닙니다. 거치기간 중 이자 처리 방식은 정책에 따라 달라질 수 있어 이 계산은 단순화된 모델입니다.",
};

export const SLR_FAQ: FaqItem[] = [
  {
    question: "2026년 학자금대출 금리는 얼마인가요?",
    answer: "연 1.7%로 6년 연속 동결됐습니다. 변동금리라 매 학기 교육부 발표에 따라 달라질 수 있습니다.",
  },
  {
    question: "상환기준소득이 뭔가요?",
    answer: "2026년 기준 연 3,037만 원입니다. 연소득이 이 금액을 넘으면 초과분의 20%(대학원 25%)를 원천공제합니다.",
  },
  {
    question: "거치기간과 상환기간은 최대 몇 년인가요?",
    answer: "합쳐서 최장 20년(거치 최대 10년+상환 최대 10년)이며, 학점은행제 학습자는 거치기간이 최대 8년입니다.",
  },
  {
    question: "2026년부터 달라진 점이 있나요?",
    answer: "취업 후 상환 등록금대출의 소득요건 제한이 폐지돼 모든 대학생·대학원생이 대상이 됐습니다.",
  },
  {
    question: "소득이 상환기준소득보다 낮으면 안 갚아도 되나요?",
    answer: "네, 초과분이 없으면 의무상환액은 0원이며 소득이 생길 때까지 상환이 유예됩니다.",
  },
  {
    question: "균등분할 상환과 실제 제도가 다른가요?",
    answer: "네, 실제 제도는 소득연계 방식이고 균등분할은 비교를 위한 참고치입니다.",
  },
  {
    question: "조기(자발적) 상환하면 유리한가요?",
    answer: "자발적 상환이 가능하며 원금을 미리 줄이면 총 이자 부담이 줄어듭니다.",
  },
  {
    question: "대학원생은 상환율이 다른가요?",
    answer: "네, 대학원은 25%, 학부는 20%가 적용됩니다.",
  },
];

export const SLR_SEO_CONTENT = {
  introTitle: "학자금대출, 매달 얼마씩 갚게 될지 미리 계산해보세요",
  intro: [
    "학자금대출을 받을 때 가장 궁금한 건 '졸업하고 나면 매달 얼마를 갚아야 하나'입니다. 취업 후 상환 학자금대출(ICL)은 2026년 기준 금리 연 1.7%로 6년 연속 동결됐고, 2026년부터는 소득요건 제한이 폐지돼 모든 대학생·대학원생이 이용할 수 있게 확대됐습니다. 이 계산기는 대출 원금과 거치기간, 졸업 후 예상 연봉을 입력해 실제로 얼마를 갚게 되는지 미리 가늠해볼 수 있게 합니다.",
    "이 제도의 핵심은 '소득이 생기기 전까지는 갚지 않아도 된다'는 점입니다. 연소득이 2026년 상환기준소득인 3,037만 원을 넘을 때만 초과분의 20%(대학원생은 25%)를 원천공제로 상환합니다. 예를 들어 연봉이 3,600만 원이면 기준소득을 넘은 563만 원의 20%인 약 113만 원만 1년 동안 상환하면 됩니다. 이 계산기는 이 소득연계 의무상환액을 그대로 계산해 보여줍니다.",
    "다만 소득연계 방식만으로는 '내가 매달 감당해야 할 부담이 어느 정도인지' 감이 잘 안 올 수 있어, 이 계산기는 '만약 일반 대출처럼 매달 똑같은 금액을 갚는다면'이라는 균등분할 참고치도 함께 보여줍니다. 두 숫자를 나란히 보면 소득연계 방식이 초기 소득이 낮을 때 부담을 얼마나 줄여주는지 체감할 수 있습니다.",
    "이 계산기는 거치기간 중 이자가 원금에 단순 가산된다고 가정한 단순화된 모델이며, 실제 이자 처리 방식은 정책·대출 종류에 따라 달라질 수 있습니다. 균등분할 상환 참고치는 실제 제도 방식이 아니라 비교용 수치이므로, 정확한 상환 계획은 반드시 한국장학재단 ICL 홈페이지에서 확인해야 합니다.",
  ],
  inputPoints: [
    "대출 원금·거치기간·졸업 후 예상 연봉을 입력하면 소득연계 의무상환액을 바로 계산합니다.",
    "학부(20%)·대학원(25%) 상환율을 선택해 과정별 차이를 확인할 수 있습니다.",
    "균등분할 상환 참고치를 함께 보여줘 소득연계 방식과의 차이를 비교할 수 있습니다.",
  ],
  criteria: [
    "2026년 대출금리 1.7%, 상환기준소득 3,037만 원, 의무상환율 학부 20%·대학원 25% 기준입니다.",
    "의무상환액 = (예상 연소득 − 상환기준소득) × 상환율이며, 초과분이 없으면 0원입니다.",
    "균등분할 상환 참고치는 일반 대출처럼 매달 동일 금액을 갚는다고 가정한 비교값이며 실제 제도 방식이 아닙니다.",
    "거치기간 중 이자는 원금에 단순 가산된다고 가정한 단순화된 모델입니다.",
  ],
};

export const SLR_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다.",
  },
  {
    href: "/tools/national-scholarship-calculator-2026/",
    label: "국가장학금 계산기 2026",
    description: "소득분위별 예상 국가장학금 지원금을 계산합니다.",
  },
  {
    href: "/reports/university-student-welfare-benefits-2026/",
    label: "대학생 지원금 총정리 2026",
    description: "등록금·주거·취업준비 카테고리별 지원제도를 한 번에 확인합니다.",
  },
];
