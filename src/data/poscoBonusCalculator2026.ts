export type PoscoCompanyCode = "POSCO" | "FUTUREM" | "INTL" | "ENC";
export type PoscoRankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type PoscoScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type PoscoRateMode = "ESTIMATE" | "CUSTOM";
export type EvidenceBadge = "추정" | "시뮬레이션";

export interface CompanyFact {
  label: string;
  value: string;
}

export interface CompanySourceRef {
  label: string;
  href?: string;
}

export interface PoscoHistoricalPreset {
  label: string;
  description: string;
  rate: number;
  source: CompanySourceRef;
  sourceDate: string;
}

export interface PoscoCompanyConfig {
  code: PoscoCompanyCode;
  label: string;
  fullName: string;
  description: string;
  rateRange: { min: number; max: number };
  baseScenario: Record<PoscoScenarioCode, number>;
  trend: string;
  badge: EvidenceBadge;
  companyFacts: CompanyFact[];
  factsAsOf: string;
  factsSource: CompanySourceRef;
  historicalPresets: PoscoHistoricalPreset[];
}

export interface PoscoRankPreset {
  code: PoscoRankCode;
  label: string;
  defaultMonthlyBase: number;
  defaultAnnualSalary: number;
}

export interface PoscoScenarioOption {
  code: PoscoScenarioCode;
  label: string;
}

export interface PoscoComparisonItem {
  code: string;
  label: string;
  href: string;
  monthlyMultiplier: number;
  note: string;
  color: string;
}

export interface PoscoBonusTermGuide {
  term: string;
  meaning: string;
  payoutPeriod: string;
  caution: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}

export const poscoCompanies: PoscoCompanyConfig[] = [
  {
    code: "POSCO",
    label: "포스코",
    fullName: "포스코 (철강)",
    description: "열연·냉연·후판 등 철강 본원 사업",
    rateRange: { min: 0, max: 200 },
    baseScenario: { CONSERVATIVE: 50, BASE: 100, AGGRESSIVE: 160 },
    trend: "글로벌 철강 공급과잉·중국 경기에 따라 연도별 변동성이 큰 편으로 알려져 있습니다.",
    badge: "추정",
    companyFacts: [
      { label: "평균연봉", value: "8,669만원" },
      { label: "임직원수", value: "17,812명" },
      { label: "매출 (2024, 연결)", value: "72조 6,880억원" },
      { label: "영업이익 (2024, 연결)", value: "2조 1,740억원" },
    ],
    factsAsOf: "2024년 연결 기준",
    factsSource: {
      label: "포스코홀딩스 2024년 실적 발표",
      href: "https://newsroom.posco.com/kr/포스코홀딩스-2024년-실적-발표사업-경쟁력-강화와-구조-개편으로-위기-극복-및-미래-준비/",
    },
    historicalPresets: [
      {
        label: "2022년 지급 (2021년 실적 기준)",
        description: "2012년 임금제도 개선 이후 처음으로 경영성과급 160% 지급",
        rate: 160,
        source: { label: "뉴시스 2022.01.03", href: "https://www.newsis.com/view/NISX20220103_0001710671" },
        sourceDate: "2022-01-03",
      },
    ],
  },
  {
    code: "FUTUREM",
    label: "포스코퓨처엠",
    fullName: "포스코퓨처엠 (이차전지소재)",
    description: "양극재·음극재 등 배터리 소재 사업",
    rateRange: { min: 0, max: 40 },
    baseScenario: { CONSERVATIVE: 5, BASE: 15, AGGRESSIVE: 30 },
    trend: "전기차·배터리 수요 사이클에 따라 변동성이 큰 편으로 알려져 있습니다.",
    badge: "추정",
    companyFacts: [
      { label: "평균연봉", value: "7,157만원" },
      { label: "임직원수", value: "2,760명" },
      { label: "매출 (2024)", value: "3조 6,999억원" },
      { label: "영업이익 (2024)", value: "7억원" },
    ],
    factsAsOf: "2024년 기준",
    factsSource: { label: "포스코퓨처엠 2024년 경영실적 발표" },
    historicalPresets: [],
  },
  {
    code: "INTL",
    label: "포스코인터내셔널",
    fullName: "포스코인터내셔널 (에너지·식량)",
    description: "LNG·에너지, 식량 트레이딩 사업",
    rateRange: { min: 50, max: 700 },
    baseScenario: { CONSERVATIVE: 50, BASE: 150, AGGRESSIVE: 700 },
    trend: "에너지 가격·트레이딩 실적에 따라 연도별 차이가 있는 것으로 알려져 있습니다.",
    badge: "추정",
    companyFacts: [
      { label: "평균연봉", value: "약 1억 3,008만원" },
      { label: "임직원수", value: "1,758명" },
      { label: "매출 (2024, 연결)", value: "32조 3,408억원" },
      { label: "매출 (2024, 별도)", value: "27조 3,887억원" },
    ],
    factsAsOf: "2024년 기준",
    factsSource: { label: "포스코인터내셔널 2024년 사업보고서 기준" },
    historicalPresets: [
      {
        label: "2023년 지급 (2022년 실적 기준)",
        description: "영업이익 1조원 돌파에 따라 전 직원에게 최대 700% 성과급 지급",
        rate: 700,
        source: { label: "파이낸셜뉴스 2023.02.22", href: "https://www.fnnews.com/news/202302221044408877" },
        sourceDate: "2023-02-22",
      },
    ],
  },
  {
    code: "ENC",
    label: "포스코이앤씨",
    fullName: "포스코이앤씨 (건설)",
    description: "건축·인프라·플랜트 건설 사업",
    rateRange: { min: 0, max: 30 },
    baseScenario: { CONSERVATIVE: 0, BASE: 10, AGGRESSIVE: 20 },
    trend: "건설 업황과 수주 실적에 따라 지급 여부가 달라질 수 있는 것으로 알려져 있습니다.",
    badge: "추정",
    companyFacts: [
      { label: "평균연봉", value: "8,012만원" },
      { label: "임직원수", value: "5,927명" },
      { label: "매출 (2024)", value: "9조 4,687억원" },
      { label: "영업이익 (2024)", value: "618억원" },
    ],
    factsAsOf: "2024년 기준",
    factsSource: { label: "포스코이앤씨 2024년 기준 보도 자료" },
    historicalPresets: [],
  },
];

export const poscoRankPresets: PoscoRankPreset[] = [
  { code: "STAFF",             label: "사원", defaultMonthlyBase: 3500000, defaultAnnualSalary: 58000000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultMonthlyBase: 4300000, defaultAnnualSalary: 72000000 },
  { code: "MANAGER",           label: "과장", defaultMonthlyBase: 5200000, defaultAnnualSalary: 88000000 },
  { code: "DEPUTY_GM",         label: "차장", defaultMonthlyBase: 6200000, defaultAnnualSalary: 105000000 },
  { code: "GM",                label: "부장", defaultMonthlyBase: 7300000, defaultAnnualSalary: 125000000 },
];

export const poscoScenarioOptions: PoscoScenarioOption[] = [
  { code: "CONSERVATIVE", label: "보수적" },
  { code: "BASE",         label: "기준" },
  { code: "AGGRESSIVE",   label: "낙관적" },
];

// 동일 월 기본급 기준 연간 성과급 배율 (추정, 시뮬레이션)
export const poscoComparisonItems: PoscoComparisonItem[] = [
  {
    code: "SAMSUNG_DS",
    label: "삼성전자",
    href: "/tools/samsung-bonus/",
    monthlyMultiplier: 0.2,
    note: "OPI·TAI 기준 시뮬레이션 (연봉 대비 약 20%)",
    color: "#1E429F",
  },
  {
    code: "SK_HYNIX",
    label: "SK하이닉스",
    href: "/tools/sk-hynix-bonus/",
    monthlyMultiplier: 0.2,
    note: "PS+PI 기준 시뮬레이션 (연봉 대비 약 20%)",
    color: "#7C3AED",
  },
  {
    code: "LG",
    label: "LG전자",
    href: "/tools/lg-bonus/",
    monthlyMultiplier: 2.0,
    note: "H&A 기준 PI 상+하반기 합계 200% 시뮬레이션",
    color: "#A50034",
  },
  {
    code: "HYUNDAI",
    label: "현대자동차",
    href: "/tools/hyundai-bonus/",
    monthlyMultiplier: 0.2,
    note: "임단협 성과급 기준 시뮬레이션 (연봉 대비 약 20%)",
    color: "#B45309",
  },
];

export const poscoBonusTerms: PoscoBonusTermGuide[] = [
  {
    term: "PI (생산성 격려금, Productivity Incentive)",
    meaning: "회사·사업부의 생산성·목표 달성도 평가에 따라 지급되는 성과급입니다.",
    payoutPeriod: "통상 익년 1~2월",
    caution: "사업 실적과 평가 결과에 따라 지급 여부·규모가 달라질 수 있습니다.",
  },
  {
    term: "PS (이익배분제, Profit Sharing)",
    meaning: "연간 이익 목표 달성 시 초과 이익의 일부를 배분하는 성과급입니다.",
    payoutPeriod: "통상 익년 1~2월",
    caution: "이익 목표 달성 여부에 따라 지급되지 않을 수도 있습니다.",
  },
];

export const POSCO_NEXT_CALCULATOR: RelatedLink = {
  href: "/tools/bonus-after-tax-calculator/",
  label: "성과급 세후 실수령",
  desc: "포스코 PI·PS 세전 금액을 넣으면 세후 실수령액을 바로 계산합니다.",
};

export const POSCO_RELATED_CALCULATORS: RelatedLink[] = [
  { href: "/tools/bonus-simulator/",                   label: "대기업 성과급 시뮬레이터",   desc: "삼성·SK하이닉스·현대차 등 한 번에 비교" },
  { href: "/tools/semiconductor-bonus-comparison/",    label: "반도체 성과급 비교",         desc: "삼성전자·SK하이닉스 성과급 비교" },
  { href: "/tools/samsung-bonus/",                     label: "삼성전자 성과급 계산기",     desc: "OPI·TAI·잠정합의안 계산" },
  { href: "/tools/sk-hynix-bonus/",                     label: "SK하이닉스 성과급 계산기",   desc: "PS·PI 실수령 계산" },
  { href: "/tools/lg-bonus/",                           label: "LG전자 성과급 계산기",       desc: "사업부별 PI 세전·세후 계산" },
  { href: "/tools/hyundai-bonus/",                      label: "현대차 성과급 계산기",       desc: "임단협 패키지 계산" },
  { href: "/reports/corporate-bonus-comparison-2026/",  label: "2026 대기업 성과급 비교",    desc: "리포트 보기" },
];

export const POSCO_BONUS_FAQ: FaqItem[] = [
  { question: "포스코 성과급 PI·PS가 뭔가요?", answer: "PI(생산성 격려금)는 생산성 평가, PS(이익배분제)는 연간 이익 목표 달성도에 따라 지급되는 성과급입니다. 두 항목을 합산해 연 1회 또는 연 2회 지급되는 것으로 알려져 있습니다." },
  { question: "포스코퓨처엠·포스코인터내셔널도 성과급이 다른가요?", answer: "네. 포스코그룹은 지주사 체제로 계열사별 독립 실적 평가를 받기 때문에 PI·PS 지급률이 계열사마다 다를 수 있습니다." },
  { question: "신입사원도 성과급을 받나요?", answer: "입사 시점에 따라 재직 기간을 비례 계산해 지급되는 경우가 일반적입니다. 정확한 기준은 계열사마다 다를 수 있습니다." },
  { question: "이 계산기의 지급률 수치는 정확한가요?", answer: "보도·업계 추정 기반 시뮬레이션 값으로 실제 지급률은 사업 실적과 노사 협의에 따라 달라집니다. 직접 입력 모드를 이용해 본인이 알고 있는 조건을 반영해 보세요." },
  { question: "삼성전자·SK하이닉스와 비교하면 어느 쪽이 더 많나요?", answer: "업종·연도·실적에 따라 다르며, 총보상(고정급+성과급+복지)을 함께 비교해야 합니다. 비교 차트를 참고하거나 대기업 성과급 시뮬레이터를 이용해 보세요." },
  { question: "세후로 얼마나 받나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 개인 과세표준에 따라 세율이 다르며, 이 계산기의 세후 값은 참고용입니다. 정확한 세후 금액은 성과급 세후 계산기를 이용하세요." },
  { question: "PI·PS는 언제 지급되나요?", answer: "통상 익년 1~2월경 지급되는 것으로 알려져 있으나, 정확한 지급 시기는 연도와 계열사에 따라 달라질 수 있습니다." },
];
