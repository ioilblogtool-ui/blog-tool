export type PensionGapRow = {
  label: string;
  monthlyPension: number;
  monthlyGap: number;
  annualGap: number;
  gap20Years: number;
};

export type PersonalPensionSimRow = {
  monthlyContribution: number;
  rate4: number;
  rate6: number;
  rate8: number;
};

export type PersonalPensionPayoutRow = {
  totalAsset: number;
  monthlyGross: number;
  monthlyNet: number;
};

export type GenerationComparisonRow = {
  ageGroup: string;
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  expectedReturn: number;
  nationalPensionRangeLabel: string;
  personalPensionRangeLabel: string;
  combinedRangeLabel: string;
  gapNote: string;
};

export type PensionTaxRow = {
  ageRange: string;
  taxRate: number;
};

export type TaxCreditRow = {
  annualContribution: number;
  creditLowIncome: number;
  creditHighIncome: number;
};

export type WithdrawalStrategyRow = {
  method: string;
  pros: string;
  cons: string;
  bestFor: string;
};

export type RiskRow = {
  scenario: string;
  probability: string;
  response: string;
};

export type IncomeMixRow = {
  monthlyIncome: string;
  nationalPension: string;
  retirementPension: string;
  personalPension: string;
  strategy: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  description: string;
};

export const PVNP_META = {
  title: "개인연금 vs 국민연금 2026 수령액 완전 비교 | 노후 소득 갭·세액공제 정리",
  description:
    "2026년 국민연금 평균 수령액과 개인연금 연금저축·IRP 수령액을 비교합니다. 세대별 예상 수령액, 세금, 수령 개시 나이, 노후 소득 갭까지 정리했습니다.",
  eyebrow: "연금 비교 리포트",
  heroTitle: "개인연금 vs 국민연금 2026 수령액 완전 비교",
  heroDescription:
    "국민연금 평균 수령액, 개인연금 시뮬레이션, 노후 소득 갭, 세액공제, 수령 전략까지 한 번에 정리합니다.",
} as const;

// 기준 메모:
// KB Think 국민연금 안내, 국민연금 온에어 보험료율 안내, 삼성증권 세액공제 안내,
// Reuters 2025-03-20 연금개혁 보도, OECD Pensions at a Glance 2025를 참고한 설명용 추정 데이터입니다.
export const PVNP_NATIONAL_PENSION_2026 = {
  estimatedAverageMonthlyPayout: 698000,
  increaseRate: 2.1,
  contributionRate2026: 9.5,
  futureContributionRateTarget: 13,
  minContributionYears: 10,
  incomeReplacementRate2026: 43,
  fundDepletionYearEstimate: 2071,
  note: "실제 수령액은 가입기간·소득·수령개시연령에 따라 달라짐. 추정치.",
} as const;

export const PVNP_TAX_CREDIT_2026 = {
  pensionSavingsLimit: 6000000,
  combinedIrpLimit: 9000000,
  taxCreditRateLowIncome: 16.5,
  taxCreditRateHighIncome: 13.2,
  maxCreditLowIncome: 1485000,
  maxCreditHighIncome: 1188000,
  incomeThreshold: 55000000,
  eligibleAgeFrom: 55,
} as const;

export const PVNP_GAP_ROWS: PensionGapRow[] = [
  { label: "국민연금 단독(평균)", monthlyPension: 700000, monthlyGap: 2300000, annualGap: 27600000, gap20Years: 552000000 },
  { label: "국민연금 + 개인연금 100만 원", monthlyPension: 1700000, monthlyGap: 1300000, annualGap: 15600000, gap20Years: 312000000 },
  { label: "국민연금 + 개인연금 150만 원", monthlyPension: 2200000, monthlyGap: 800000, annualGap: 9600000, gap20Years: 192000000 },
  { label: "국민연금 + 개인연금 230만 원", monthlyPension: 3000000, monthlyGap: 0, annualGap: 0, gap20Years: 0 },
];

export const PVNP_SIM_ROWS: PersonalPensionSimRow[] = [
  { monthlyContribution: 300000, rate4: 150000000, rate6: 210000000, rate8: 290000000 },
  { monthlyContribution: 500000, rate4: 250000000, rate6: 350000000, rate8: 480000000 },
  { monthlyContribution: 750000, rate4: 380000000, rate6: 520000000, rate8: 720000000 },
  { monthlyContribution: 1000000, rate4: 500000000, rate6: 690000000, rate8: 960000000 },
];

export const PVNP_PAYOUT_ROWS: PersonalPensionPayoutRow[] = [
  { totalAsset: 200000000, monthlyGross: 830000, monthlyNet: 780000 },
  { totalAsset: 300000000, monthlyGross: 1250000, monthlyNet: 1180000 },
  { totalAsset: 500000000, monthlyGross: 2080000, monthlyNet: 1970000 },
  { totalAsset: 700000000, monthlyGross: 2920000, monthlyNet: 2760000 },
];

export const PVNP_GENERATION_ROWS: GenerationComparisonRow[] = [
  {
    ageGroup: "30대",
    currentAge: 35,
    retirementAge: 60,
    monthlyContribution: 500000,
    expectedReturn: 6,
    nationalPensionRangeLabel: "70만~120만 원",
    personalPensionRangeLabel: "130만~160만 원",
    combinedRangeLabel: "200만~280만 원",
    gapNote: "일부 부족 가능",
  },
  {
    ageGroup: "40대",
    currentAge: 45,
    retirementAge: 60,
    monthlyContribution: 700000,
    expectedReturn: 5,
    nationalPensionRangeLabel: "80만~130만 원",
    personalPensionRangeLabel: "70만~100만 원",
    combinedRangeLabel: "150만~230만 원",
    gapNote: "부족 가능성 높음",
  },
  {
    ageGroup: "50대",
    currentAge: 52,
    retirementAge: 60,
    monthlyContribution: 1000000,
    expectedReturn: 4,
    nationalPensionRangeLabel: "90만~150만 원",
    personalPensionRangeLabel: "35만~60만 원",
    combinedRangeLabel: "125만~210만 원",
    gapNote: "추가 자금 필요",
  },
];

export const PVNP_PENSION_TAX_ROWS: PensionTaxRow[] = [
  { ageRange: "55~69세", taxRate: 5.5 },
  { ageRange: "70~79세", taxRate: 4.4 },
  { ageRange: "80세 이상", taxRate: 3.3 },
];

export const PVNP_TAX_CREDIT_ROWS: TaxCreditRow[] = [
  { annualContribution: 3000000, creditLowIncome: 495000, creditHighIncome: 396000 },
  { annualContribution: 6000000, creditLowIncome: 990000, creditHighIncome: 792000 },
  { annualContribution: 9000000, creditLowIncome: 1485000, creditHighIncome: 1188000 },
];

export const PVNP_WITHDRAWAL_ROWS: WithdrawalStrategyRow[] = [
  { method: "일시금", pros: "목돈 확보", cons: "세금·소진 리스크", bestFor: "대출 상환·주택자금 등 명확한 목적" },
  { method: "10년 분할", pros: "비교적 빠른 회수", cons: "장수 리스크", bestFor: "은퇴 초반 지출이 큰 경우" },
  { method: "20년 분할", pros: "생활비 안정", cons: "월수령액이 낮아짐", bestFor: "일반 은퇴자 기본 전략" },
  { method: "종신형", pros: "장수 리스크 방어", cons: "초기 수령액이 낮을 수 있음", bestFor: "오래 받을 안정성을 중시하는 경우" },
];

export const PVNP_RISK_ROWS: RiskRow[] = [
  { scenario: "보험료율 추가 인상", probability: "중간~높음", response: "개인연금·퇴직연금 병행" },
  { scenario: "수급개시연령 조정", probability: "중간", response: "은퇴 전 현금흐름 확보" },
  { scenario: "소득대체율 조정", probability: "중간", response: "목표 노후 생활비 재계산" },
  { scenario: "기금운용 수익률 변동", probability: "상시", response: "국민연금 단독 의존도 낮추기" },
  { scenario: "세대 간 부담 논쟁 지속", probability: "높음", response: "개인 자산 포트폴리오 구축" },
];

export const PVNP_INCOME_MIX_ROWS: IncomeMixRow[] = [
  { monthlyIncome: "300만 원 이하", nationalPension: "기본 납부", retirementPension: "회사 제도 활용", personalPension: "월 10~30만 원", strategy: "세액공제 우선" },
  { monthlyIncome: "300~500만 원", nationalPension: "기본 납부", retirementPension: "DC/IRP 점검", personalPension: "월 30~50만 원", strategy: "연금저축 600만 원 목표" },
  { monthlyIncome: "500~800만 원", nationalPension: "기본 납부", retirementPension: "DC 적극 운용", personalPension: "월 50~75만 원", strategy: "IRP 포함 900만 원 목표" },
  { monthlyIncome: "800만 원 이상", nationalPension: "기본 납부", retirementPension: "퇴직연금 최적화", personalPension: "월 75만 원 이상", strategy: "ISA·일반 ETF 병행" },
];

export const PVNP_FAQ: FaqItem[] = [
  {
    q: "국민연금만으로 노후 생활이 가능한가요?",
    a: "평균 수령액 기준으로는 충분하지 않을 가능성이 큽니다. 월 생활비 250만~300만 원을 기준으로 보면 개인연금, 퇴직연금, 기타 소득이 함께 필요합니다.",
  },
  {
    q: "개인연금은 월 얼마부터 시작하는 게 좋나요?",
    a: "처음에는 월 10만~30만 원도 괜찮습니다. 세액공제 효과를 충분히 활용하려면 연금저축 연 600만 원, IRP 포함 연 900만 원 한도를 목표로 잡을 수 있습니다.",
  },
  {
    q: "연금저축과 IRP 중 무엇을 먼저 해야 하나요?",
    a: "투자 자율성과 편의성은 연금저축이 좋고, 세액공제 한도를 900만 원까지 채우려면 IRP를 함께 활용합니다.",
  },
  {
    q: "국민연금은 고갈되면 못 받나요?",
    a: "고갈은 기금 적립금이 줄어든다는 의미이지 즉시 지급 중단을 뜻하지는 않습니다. 다만 보험료율·수급개시연령·소득대체율 등 제도 변화 가능성은 계속 봐야 합니다.",
  },
  {
    q: "개인연금은 일시금으로 받는 게 좋나요?",
    a: "노후 생활비 목적이라면 분할 수령이 유리한 경우가 많습니다. 일시금은 세금과 소진 리스크가 크므로 대출 상환 등 명확한 목적이 있을 때만 검토하는 것이 좋습니다.",
  },
  {
    q: "30대도 개인연금을 꼭 해야 하나요?",
    a: "30대는 투자기간이 길어 복리 효과가 가장 큽니다. 소액이라도 일찍 시작하면 40~50대에 시작하는 것보다 월 납입 부담이 크게 줄어듭니다.",
  },
];

export const PVNP_RELATED_LINKS: RelatedLink[] = [
  { label: "노후자금 고갈 계산기", href: "/tools/retirement-fund-depletion/", description: "자산 고갈 예상 나이와 월 추가 적립 필요액 확인" },
  { label: "연금저축 vs IRP 비교 2026", href: "/reports/pension-irp-comparison-2026/", description: "연금저축과 IRP 세액공제·운용·수령 방식 차이 비교" },
  { label: "퇴직연금 DC·DB·IRP 비교 2026", href: "/reports/retirement-pension-dc-db-irp-2026/", description: "퇴직연금 제도별 구조·수익률·수수료·수령 전략 비교" },
  { label: "국민연금 세대별 손익 비교 2026", href: "/reports/national-pension-generational-comparison-2026/", description: "세대별 납입 총액과 예상 수령액·수익비 비교" },
];
