export type SourceLabel = "공식" | "확인 필요" | "추정" | "참고";
export type LoanCategory = "credit" | "minus" | "mortgage" | "jeonse" | "saitdol" | "sunshine";
export type JobType = "large" | "sme" | "public" | "freelance" | "low-credit";
export type CreditTier = "900+" | "800" | "700" | "600";

export interface LoanTypeComparison {
  id: LoanCategory;
  name: string;
  purpose: string;
  rateRangeLabel: string;
  rateMin: number;
  rateMax: number;
  limitLabel: string;
  eligibility: string;
  repayment: string;
  dsrImpact: "큼" | "매우 큼" | "일부 예외" | "정책금융" | "확인 필요";
  sourceLabel: SourceLabel;
  sourceUrl?: string;
  updatedAt: string;
  caution: string;
}

export interface SalaryLimitScenario {
  salary: number;
  salaryLabel: string;
  conservativeCreditLimit: number;
  aggressiveCreditLimit: number;
  mortgageLimitLabel: string;
  comment: string;
}

export interface CreditScoreRecommendation {
  tier: CreditTier;
  scoreLabel: string;
  firstChoice: string;
  secondChoice: string;
  caution: string;
}

export interface JobTypeRecommendation {
  id: JobType;
  label: string;
  firstCheck: string[];
  reason: string;
  caution: string;
}

export interface RefinanceScenario {
  rateGap: number;
  loanBalance: number;
  yearlySaving: number;
  estimatedCost: number;
  breakEvenMonths: number;
}

export interface HighCostDebtScenario {
  amount: number;
  cardLoanRate: number;
  revolvingRate: number;
  creditLoanRate: number;
  months: number;
}

export interface RejectionReason {
  rank: number;
  title: string;
  solution: string;
}

export interface PreferentialRateCondition {
  condition: string;
  desc: string;
  risk: string;
}

export interface SlcFaq {
  question: string;
  answer: string;
}

export interface SlcRelatedLink {
  href: string;
  label: string;
  desc?: string;
}

export interface ExternalSourceLink {
  source: string;
  title: string;
  href: string;
  desc: string;
}

export const SLC_META = {
  slug: "2026-salaried-loan-comparison",
  title: "직장인 대출 종류 비교 2026 - 신용대출·마이너스통장·주담대·햇살론 금리 한도 총정리",
  h1: "2026 직장인 대출 완전 비교",
  description:
    "2026년 직장인이 이용하는 신용대출, 마이너스통장, 주택담보대출, 전세자금대출, 사잇돌대출, 햇살론을 금리·한도·조건·DSR 기준으로 비교합니다. 연봉별 한도와 갈아타기 전략까지 확인하세요.",
  updatedAt: "2026년 5월 기준",
} as const;

export const SLC_LOAN_TYPES: LoanTypeComparison[] = [
  {
    id: "credit",
    name: "신용대출",
    purpose: "생활비·대환·단기 자금",
    rateRangeLabel: "신용점수·은행별 차등",
    rateMin: 0.04,
    rateMax: 0.11,
    limitLabel: "연소득 기반",
    eligibility: "재직·소득·신용점수 심사",
    repayment: "만기일시 또는 원리금균등",
    dsrImpact: "큼",
    sourceLabel: "확인 필요",
    sourceUrl: "https://portal.kfb.or.kr",
    updatedAt: "2026년 기준, 실시간 확인 필요",
    caution: "기존 대출과 카드론 사용 여부에 따라 한도가 크게 달라집니다.",
  },
  {
    id: "minus",
    name: "마이너스통장",
    purpose: "비상자금·단기 유동성",
    rateRangeLabel: "신용대출보다 높을 수 있음",
    rateMin: 0.045,
    rateMax: 0.12,
    limitLabel: "약정 한도",
    eligibility: "재직·소득·신용점수 심사",
    repayment: "수시상환",
    dsrImpact: "큼",
    sourceLabel: "확인 필요",
    sourceUrl: "https://portal.kfb.or.kr",
    updatedAt: "2026년 기준, 실시간 확인 필요",
    caution: "실제 사용액이 적어도 약정 한도 전체가 심사에 반영될 수 있습니다.",
  },
  {
    id: "mortgage",
    name: "주택담보대출",
    purpose: "주택 구입·대환",
    rateRangeLabel: "담보·금리형태별 차등",
    rateMin: 0.035,
    rateMax: 0.07,
    limitLabel: "LTV·DSR 기반",
    eligibility: "담보주택·소득·DSR·LTV 심사",
    repayment: "원리금균등·원금균등",
    dsrImpact: "매우 큼",
    sourceLabel: "확인 필요",
    sourceUrl: "https://finlife.fss.or.kr",
    updatedAt: "2026년 기준, 실시간 확인 필요",
    caution: "스트레스 DSR 적용으로 체감 한도가 줄 수 있습니다.",
  },
  {
    id: "jeonse",
    name: "전세자금대출",
    purpose: "전세보증금 마련",
    rateRangeLabel: "보증기관·은행별 차등",
    rateMin: 0.035,
    rateMax: 0.075,
    limitLabel: "보증금·보증기관 기준",
    eligibility: "임대차계약·보증심사·소득 심사",
    repayment: "만기일시 중심",
    dsrImpact: "일부 예외",
    sourceLabel: "확인 필요",
    sourceUrl: "https://finlife.fss.or.kr",
    updatedAt: "2026년 기준, 실시간 확인 필요",
    caution: "보증 조건과 전세사기 리스크를 함께 확인해야 합니다.",
  },
  {
    id: "saitdol",
    name: "사잇돌대출",
    purpose: "중신용자 중금리 대출",
    rateRangeLabel: "중금리",
    rateMin: 0.06,
    rateMax: 0.14,
    limitLabel: "보증한도 기반",
    eligibility: "중신용·소득·SGI서울보증 심사",
    repayment: "원리금균등",
    dsrImpact: "확인 필요",
    sourceLabel: "확인 필요",
    updatedAt: "2026년 취급기관 확인 필요",
    caution: "취급기관과 보증심사에 따라 승인 여부가 달라집니다.",
  },
  {
    id: "sunshine",
    name: "근로자햇살론",
    purpose: "저소득·저신용 근로자 생활안정자금",
    rateRangeLabel: "상한금리 이내",
    rateMin: 0.08,
    rateMax: 0.115,
    limitLabel: "최대 2,000만 원, 2026년 적용 여부 확인",
    eligibility: "3개월 이상 재직, 저소득 또는 저신용 요건",
    repayment: "원금균등분할상환",
    dsrImpact: "정책금융",
    sourceLabel: "공식",
    sourceUrl: "https://www.kinfa.or.kr/financialProduct/employeeHessalLoan.do",
    updatedAt: "서민금융진흥원 공고 확인 필요",
    caution: "한도와 보증 조건은 서민금융진흥원 공식 안내와 보증심사 결과를 확인해야 합니다.",
  },
];

export const SLC_SUMMARY_CARDS = [
  { label: "비교 대상", value: "6종", desc: "신용대출·마통·주담대·전세·사잇돌·햇살론", tone: "primary" },
  { label: "한도 핵심", value: "DSR", desc: "연봉보다 기존 부채와 월 상환액이 더 중요할 수 있음", tone: "default" },
  { label: "대환 판단", value: "회수 기간", desc: "금리차보다 수수료 포함 총비용을 먼저 계산", tone: "default" },
  { label: "정책금융", value: "공식 확인", desc: "근로자햇살론·사잇돌은 자격과 보증심사 확인", tone: "official" },
] as const;

export const SLC_TRUST_PANELS = [
  { label: "공식", title: "DSR·정책금융 자격", desc: "금융위원회와 서민금융진흥원 공식 기준을 우선 확인합니다." },
  { label: "확인 필요", title: "은행별 금리·한도", desc: "은행별 금리는 기준일과 심사 조건에 따라 달라집니다." },
  { label: "추정", title: "연봉별 한도·총비용", desc: "시뮬레이션은 구조 이해용이며 승인 한도를 보장하지 않습니다." },
];

export const SLC_SALARY_LIMIT_SCENARIOS: SalaryLimitScenario[] = [
  {
    salary: 30000000,
    salaryLabel: "연봉 3천만 원",
    conservativeCreditLimit: 15000000,
    aggressiveCreditLimit: 30000000,
    mortgageLimitLabel: "DSR·기존 부채 확인 필요",
    comment: "기존 대출이 있으면 한도가 빠르게 줄어드는 구간입니다.",
  },
  {
    salary: 50000000,
    salaryLabel: "연봉 5천만 원",
    conservativeCreditLimit: 25000000,
    aggressiveCreditLimit: 75000000,
    mortgageLimitLabel: "DSR 40% 기준 별도 계산 필요",
    comment: "신용점수와 직장 안정성에 따라 차이가 큽니다.",
  },
  {
    salary: 80000000,
    salaryLabel: "연봉 8천만 원",
    conservativeCreditLimit: 40000000,
    aggressiveCreditLimit: 120000000,
    mortgageLimitLabel: "담보·DSR·스트레스 DSR 영향 큼",
    comment: "DSR 여유와 담보 가치가 실제 한도를 좌우합니다.",
  },
];

export const SLC_CREDIT_RECOMMENDATIONS: CreditScoreRecommendation[] = [
  {
    tier: "900+",
    scoreLabel: "900점 이상",
    firstChoice: "1금융권 신용대출·마이너스통장",
    secondChoice: "주담대·전세대출 우대금리 비교",
    caution: "최저금리는 우대조건 충족 여부까지 확인해야 합니다.",
  },
  {
    tier: "800",
    scoreLabel: "800점대",
    firstChoice: "주거래은행 신용대출",
    secondChoice: "급여이체·카드실적 우대금리",
    caution: "단기간 다중 신청은 피하는 것이 좋습니다.",
  },
  {
    tier: "700",
    scoreLabel: "700점대",
    firstChoice: "사잇돌·새희망홀씨 후보",
    secondChoice: "대환대출 비교",
    caution: "카드론·리볼빙 보유 여부가 심사에 불리할 수 있습니다.",
  },
  {
    tier: "600",
    scoreLabel: "600점대 이하",
    firstChoice: "근로자햇살론·서민금융 맞춤대출",
    secondChoice: "신용부채관리 상담",
    caution: "고금리 추가 대출보다 채무조정·정책금융을 먼저 확인하세요.",
  },
];

export const SLC_JOB_RECOMMENDATIONS: JobTypeRecommendation[] = [
  {
    id: "large",
    label: "대기업·공기업",
    firstCheck: ["1금융권 신용대출", "마이너스통장", "주거래은행 우대금리"],
    reason: "재직 안정성과 소득 증빙이 유리하게 반영될 가능성이 큽니다.",
    caution: "마이너스통장은 한도 전체가 심사에 반영될 수 있습니다.",
  },
  {
    id: "sme",
    label: "중소기업",
    firstCheck: ["급여이체 은행 신용대출", "사잇돌", "새희망홀씨"],
    reason: "은행별 심사 차이가 커서 2~3개 금융회사를 비교해야 합니다.",
    caution: "재직기간과 건강보험 납부 이력이 중요합니다.",
  },
  {
    id: "public",
    label: "공무원·교직원",
    firstCheck: ["직군 전용 신용대출", "1금융권 마이너스통장"],
    reason: "안정 소득 직군으로 분류되어 우대상품이 있는 경우가 많습니다.",
    caution: "직군 전용 상품도 우대조건 충족 여부를 확인해야 합니다.",
  },
  {
    id: "freelance",
    label: "프리랜서·계약직",
    firstCheck: ["소득증빙 가능 신용대출", "사잇돌", "전세대출 보증상품"],
    reason: "재직증명보다 소득 흐름과 신고소득 증빙이 중요합니다.",
    caution: "소득 신고가 낮으면 한도가 줄 수 있습니다.",
  },
  {
    id: "low-credit",
    label: "저신용 근로자",
    firstCheck: ["근로자햇살론", "서민금융 맞춤대출", "신용부채관리 상담"],
    reason: "일반 신용대출보다 정책금융 접근성이 높을 수 있습니다.",
    caution: "고금리 카드론 추가 사용은 피하는 것이 좋습니다.",
  },
];

export const SLC_REFINANCE_SCENARIOS: RefinanceScenario[] = [
  { rateGap: 0.003, loanBalance: 100000000, yearlySaving: 300000, estimatedCost: 900000, breakEvenMonths: 36 },
  { rateGap: 0.005, loanBalance: 100000000, yearlySaving: 500000, estimatedCost: 900000, breakEvenMonths: 22 },
  { rateGap: 0.01, loanBalance: 100000000, yearlySaving: 1000000, estimatedCost: 900000, breakEvenMonths: 11 },
];

export const SLC_HIGH_COST_DEBT_SCENARIOS: HighCostDebtScenario[] = [
  { amount: 5000000, cardLoanRate: 0.16, revolvingRate: 0.18, creditLoanRate: 0.075, months: 12 },
  { amount: 10000000, cardLoanRate: 0.16, revolvingRate: 0.18, creditLoanRate: 0.075, months: 36 },
  { amount: 20000000, cardLoanRate: 0.16, revolvingRate: 0.18, creditLoanRate: 0.075, months: 36 },
];

export const SLC_REJECTION_REASONS: RejectionReason[] = [
  { rank: 1, title: "DSR 초과", solution: "기존 대출 상환·대환·한도 축소 후 재검토" },
  { rank: 2, title: "재직기간 부족", solution: "3~6개월 이상 급여 수령 이력 확보" },
  { rank: 3, title: "신용점수 하락", solution: "카드론·리볼빙 정리, 연체 방지" },
  { rank: 4, title: "소득증빙 불충분", solution: "원천징수영수증·건강보험납부확인서 준비" },
  { rank: 5, title: "최근 대출 조회·실행 과다", solution: "단기간 다중 신청 자제" },
];

export const SLC_PREFERENTIAL_RATE_CONDITIONS: PreferentialRateCondition[] = [
  { condition: "급여이체", desc: "주거래은행 우대금리의 핵심 조건", risk: "급여 이체가 끊기면 우대가 사라질 수 있음" },
  { condition: "신용카드 실적", desc: "월 사용액 기준을 채우면 우대 가능", risk: "불필요한 소비 증가에 주의" },
  { condition: "자동이체·공과금", desc: "관리비·통신비 자동납부로 조건 충족", risk: "계좌 변경 시 우대 조건 재확인 필요" },
  { condition: "적금·청약·연금", desc: "금융상품 보유 실적 반영 가능", risk: "수수료와 묶인 자금까지 비교" },
  { condition: "비대면 신청", desc: "앱 신청 우대금리를 제공하는 경우", risk: "비대면 한도와 지점 한도가 다를 수 있음" },
];

export const SLC_REPAYMENT_ROWS = [
  { type: "만기일시상환", monthlyBurden: "낮음", totalInterest: "높아질 수 있음", fit: "단기 자금·만기 상환 계획이 분명할 때" },
  { type: "원리금균등", monthlyBurden: "일정", totalInterest: "예측 쉬움", fit: "월 예산을 고정하고 싶을 때" },
  { type: "원금균등", monthlyBurden: "초반 높음", totalInterest: "상대적으로 낮음", fit: "초기 상환 여력이 충분할 때" },
  { type: "마이너스통장", monthlyBurden: "사용액 기준", totalInterest: "사용 패턴에 따라 차이 큼", fit: "비상자금·짧은 유동성 확보" },
];

export const SLC_POLICY_CHECKS = [
  "근로자햇살론은 3개월 이상 재직 근로자가 기본 대상입니다.",
  "연소득 3,500만 원 이하 또는 개인신용평점 하위 20%이면서 연소득 4,500만 원 이하 요건을 확인합니다.",
  "사잇돌대출은 SGI서울보증 보증심사와 취급 금융회사 조건을 함께 봅니다.",
  "새희망홀씨, 햇살론뱅크, 햇살론15 등은 목적과 신용상태별로 별도 비교가 필요합니다.",
];

export const SLC_PLAN_CHECKLIST = [
  "목적을 생활비·대환·주거·비상자금으로 구분",
  "필요한 금액만 산정",
  "기존 대출 월 상환액 확인",
  "DSR 여유 확인",
  "3개 이상 금융회사 금리 비교",
  "중도상환수수료·보증료·인지세 확인",
  "카드론·리볼빙 사용 여부 점검",
  "금리인하요구권 가능성 확인",
  "연체 가능성이 있으면 금액 축소",
  "정책금융 자격 먼저 확인",
];

export const SLC_FAQ: SlcFaq[] = [
  {
    question: "신용대출과 마이너스통장은 무엇이 다른가요?",
    answer:
      "신용대출은 대출금을 한 번에 받아 정해진 방식으로 상환하는 상품이고, 마이너스통장은 약정 한도 안에서 필요한 만큼 꺼내 쓰는 한도대출입니다. 마이너스통장은 사용액에만 이자가 붙어 비상자금에 유리하지만, 금리가 더 높거나 한도 전체가 DSR·신용평가에 반영될 수 있습니다.",
  },
  {
    question: "연봉 5천만 원이면 신용대출 한도는 얼마인가요?",
    answer:
      "은행·신용점수·직장 유형·기존 대출에 따라 다르지만, 보수적으로는 연소득의 0.5배, 우량 조건에서는 1~1.5배 수준까지 검토될 수 있습니다. 다만 2026년에는 DSR과 기존 부채가 한도를 크게 좌우하므로 실제 한도는 금융회사 심사로 확인해야 합니다.",
  },
  {
    question: "햇살론은 직장인도 받을 수 있나요?",
    answer:
      "근로자햇살론은 3개월 이상 재직한 근로자를 대상으로 합니다. 연소득 3,500만 원 이하이거나, 개인신용평점 하위 20%에 해당하면서 연소득 4,500만 원 이하인 경우 신청 대상이 될 수 있습니다. 실제 승인 여부는 보증심사와 금융회사 심사를 거쳐 결정됩니다.",
  },
  {
    question: "카드론이나 리볼빙을 신용대출로 갈아타는 게 유리한가요?",
    answer:
      "금리 차이가 크고 중도상환수수료나 기타 비용이 낮다면 유리할 수 있습니다. 특히 리볼빙은 월 납입액이 작아 보여도 총이자가 커질 수 있으므로, 신용대출·정책금융·대환대출을 비교해 총비용을 줄일 수 있는지 확인하는 것이 좋습니다.",
  },
  {
    question: "DSR이 높으면 대출이 왜 거절되나요?",
    answer:
      "DSR은 연소득 대비 모든 대출의 연간 원리금 상환액 비율입니다. 은행권은 일반적으로 40% 규제비율을 기준으로 보기 때문에, 기존 대출 상환액이 많으면 새 대출 한도가 줄거나 거절될 수 있습니다.",
  },
  {
    question: "전세자금대출도 DSR에 들어가나요?",
    answer:
      "전세자금대출은 상품과 규제 기준에 따라 DSR 적용 예외 또는 별도 취급이 있을 수 있습니다. 전세보증금담보대출처럼 성격이 다른 상품은 다르게 볼 수 있으므로, 신청 전 금융회사와 보증기관 기준을 확인해야 합니다.",
  },
  {
    question: "금리 인하기에는 무조건 갈아타는 게 좋은가요?",
    answer:
      "아닙니다. 금리차가 있어도 중도상환수수료, 인지세, 보증료, 근저당 비용이 절감액보다 크면 손해일 수 있습니다. 금리차와 대출잔액으로 연간 절감액을 계산하고, 비용 회수 기간이 남은 대출기간보다 짧은지 확인해야 합니다.",
  },
  {
    question: "대출 비교 플랫폼을 이용해도 신용점수가 떨어지나요?",
    answer:
      "단순 한도·금리 조회는 신용점수에 직접 불이익이 없도록 운영되는 경우가 많지만, 실제 대출 실행과 단기간 다중 신청은 신용평가에 영향을 줄 수 있습니다. 플랫폼별 안내와 금융회사 심사 기준을 확인하세요.",
  },
];

export const SLC_RELATED_LINKS: SlcRelatedLink[] = [
  { href: "/tools/loan-refinancing-calculator/", label: "대출 갈아타기 계산기", desc: "금리차·수수료 기반 손익분기 확인" },
  { href: "/tools/mortgage-prepayment-penalty/", label: "중도상환 수수료 계산기", desc: "갈아타기 전 수수료와 순절감액 확인" },
  { href: "/tools/newlywed-rent-vs-buy/", label: "신혼집 전세 vs 매매 계산기", desc: "주거 대출 부담과 전세·매매 선택 비교" },
  { href: "/reports/newlywed-cost-2026/", label: "2026 신혼부부 생활비 리포트", desc: "신혼집 자금·대출 맥락 연결" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지지원금 완전 정복", desc: "정책금융·복지지원금 탐색 흐름 연결" },
];

export const SLC_SOURCE_LINKS: ExternalSourceLink[] = [
  { source: "금융위원회", title: "DSR·가계대출 관리 정책자료", href: "https://fsc.go.kr", desc: "DSR 규제와 가계대출 관리방안 공식 자료" },
  { source: "은행연합회", title: "은행연합회 소비자포털", href: "https://portal.kfb.or.kr", desc: "은행별 대출금리와 금융교육 자료" },
  { source: "금융감독원", title: "금융상품통합비교공시 금융상품한눈에", href: "https://finlife.fss.or.kr", desc: "주택담보대출·전세대출·신용대출 금리 비교" },
  { source: "서민금융진흥원", title: "근로자햇살론 공식 안내", href: "https://www.kinfa.or.kr/financialProduct/employeeHessalLoan.do", desc: "근로자햇살론 자격·한도·금리 공식 안내" },
  { source: "서민금융진흥원", title: "대출상품 한눈에", href: "https://www.kinfa.or.kr/financialProduct/loanProductGlance.do", desc: "정책서민금융 상품 탐색" },
];

export function formatWon(value: number): string {
  const rounded = Math.round(value);
  const eok = Math.floor(rounded / 100000000);
  const man = Math.round((rounded % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString("ko-KR")}만 원`;
  if (eok > 0) return `${eok}억 원`;
  if (man > 0) return `${man.toLocaleString("ko-KR")}만 원`;
  return `${rounded.toLocaleString("ko-KR")}원`;
}

export function estimateSimpleInterest(amount: number, annualRate: number, months: number): number {
  return amount * annualRate * (months / 12);
}
