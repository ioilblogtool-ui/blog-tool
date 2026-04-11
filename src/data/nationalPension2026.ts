export type GenerationKey = "1960" | "1975" | "1990" | "2000";
export type ScenarioKey = "old" | "reform";

export type GenerationScenario = {
  birthYear: number;
  retirementAge: number;
  contributionYears: number;
  totalContribution: number;
  monthlyPension: number;
  breakevenAge: number;
  payoutRatio: number;
  badge: "시뮬레이션";
};

export const NP_META = {
  slug: "national-pension-generational-comparison-2026",
  title: "국민연금 세대별 손익 비교 2026",
  subtitle: "1960·1975·1990·2000년생 기준으로 낸 돈, 받을 돈, 손익분기점, 연금개혁 영향을 한 화면에서 비교합니다.",
  updatedAt: "업데이트: 2026년 4월",
  methodology:
    "보험료율·소득대체율·지급개시연령은 국민연금공단 및 보건복지부 공개 기준을 바탕으로 정리했습니다.",
  caution:
    "세대별 납입 총액, 월 수령액, 손익분기점, 수익비는 평균 소득과 가입기간을 단순화한 시뮬레이션입니다.",
  dataSource: "국민연금공단, 보건복지부, OECD",
};

export const PREMIUM_RATE_ROADMAP = [
  { year: 2025, rate: 9.0 },
  { year: 2026, rate: 9.5 },
  { year: 2027, rate: 10.0 },
  { year: 2028, rate: 10.5 },
  { year: 2029, rate: 11.0 },
  { year: 2030, rate: 11.5 },
  { year: 2031, rate: 12.0 },
  { year: 2032, rate: 12.5 },
  { year: 2033, rate: 13.0 },
];

export const NP_HERO_STATS = [
  { label: "2026 보험료율", value: "9.5%", note: "9%에서 인상 시작", badge: "공식" },
  { label: "2033 목표 보험료율", value: "13%", note: "매년 0.5%p 인상", badge: "공식" },
  { label: "2026 소득대체율", value: "43%", note: "개혁안 반영 기준", badge: "공식" },
  { label: "기금 전망", value: "2071년", note: "현행 추계 2055년과 구분", badge: "공식" },
];

export const SYSTEM_CONCEPTS = [
  {
    title: "보험료율",
    body: "월소득에서 국민연금으로 내는 비율입니다. 2026년부터 9.5%로 오르고 2033년 13%까지 단계 인상됩니다.",
  },
  {
    title: "소득대체율",
    body: "은퇴 전 소득 대비 연금액의 비율입니다. 2026년부터 43% 기준을 사용합니다.",
  },
  {
    title: "지급개시연령",
    body: "언제부터 받을 수 있는지 보여주는 기준입니다. 1969년 이후 출생자는 65세부터 정상 수령이 가능합니다.",
  },
  {
    title: "가입기간 10년",
    body: "노령연금을 받으려면 최소 가입기간 10년이 필요합니다. 납입 공백이 길면 수급 조건이 달라질 수 있습니다.",
  },
];

export const DEFERRAL_BONUS_PER_MONTH = 0.6;
export const INCOME_REPLACEMENT_RATE = 43;
export const PENSION_START_AGE_POST1969 = 65;
export const EARLY_PENSION_AGE = 60;

export const MONTHLY_EXTRA_BURDEN = {
  employee: 7700,
  selfEmployed: 15400,
};

export const GENERATION_SCENARIOS: Record<
  GenerationKey,
  Record<ScenarioKey, GenerationScenario>
> = {
  "1960": {
    old: { birthYear: 1960, retirementAge: 63, contributionYears: 37, totalContribution: 5200, monthlyPension: 72, breakevenAge: 69, payoutRatio: 3.32, badge: "시뮬레이션" },
    reform: { birthYear: 1960, retirementAge: 63, contributionYears: 37, totalContribution: 5200, monthlyPension: 75, breakevenAge: 69, payoutRatio: 3.46, badge: "시뮬레이션" },
  },
  "1975": {
    old: { birthYear: 1975, retirementAge: 65, contributionYears: 40, totalContribution: 6800, monthlyPension: 90, breakevenAge: 72, payoutRatio: 3.18, badge: "시뮬레이션" },
    reform: { birthYear: 1975, retirementAge: 65, contributionYears: 40, totalContribution: 7500, monthlyPension: 95, breakevenAge: 72, payoutRatio: 3.04, badge: "시뮬레이션" },
  },
  "1990": {
    old: { birthYear: 1990, retirementAge: 65, contributionYears: 40, totalContribution: 7000, monthlyPension: 93, breakevenAge: 73, payoutRatio: 3.19, badge: "시뮬레이션" },
    reform: { birthYear: 1990, retirementAge: 65, contributionYears: 40, totalContribution: 8600, monthlyPension: 100, breakevenAge: 73, payoutRatio: 2.79, badge: "시뮬레이션" },
  },
  "2000": {
    old: { birthYear: 2000, retirementAge: 65, contributionYears: 40, totalContribution: 7200, monthlyPension: 95, breakevenAge: 73, payoutRatio: 3.17, badge: "시뮬레이션" },
    reform: { birthYear: 2000, retirementAge: 65, contributionYears: 40, totalContribution: 9300, monthlyPension: 105, breakevenAge: 74, payoutRatio: 2.71, badge: "시뮬레이션" },
  },
};

export const GENERATION_SUMMARIES = [
  { key: "1960" as GenerationKey, title: "1960년생", summary: "개혁 영향이 가장 제한적인 세대입니다. 이미 대부분의 가입 기간을 지나 제도 변경 부담은 작고, 소득대체율 상향 혜택이 상대적으로 큽니다." },
  { key: "1975" as GenerationKey, title: "1975년생", summary: "보험료율 인상 구간과 연금 수급 구간을 모두 경험하는 중간 세대입니다. 납입액은 늘지만 월 수령액도 같이 개선되는 구간입니다." },
  { key: "1990" as GenerationKey, title: "1990년생", summary: "보험료율 인상 구간의 영향을 더 길게 받습니다. 총납입액 증가 폭이 커지는 만큼 연금 외 추가 노후 준비가 중요해집니다." },
  { key: "2000" as GenerationKey, title: "2000년생", summary: "개혁 이후 구조를 거의 온전히 경험하는 세대입니다. 수익비는 낮아지지만 공적연금의 바닥 보장 역할은 여전히 중요합니다." },
];

export const PAYOUT_TIMING_COMPARE = [
  { type: "조기수령", startAge: 60, monthlyAmount: 61, breakevenVsNormal: 74, bestFor: "현금흐름이 급하고 일찍 수령이 필요한 경우", badge: "시뮬레이션" },
  { type: "정상수령", startAge: 65, monthlyAmount: 95, breakevenVsNormal: 65, bestFor: "기본 기준선으로 비교할 때", badge: "시뮬레이션" },
  { type: "연기수령", startAge: 70, monthlyAmount: 129, breakevenVsNormal: 84, bestFor: "다른 소득원이 있고 오래 받을 가능성이 높을 때", badge: "시뮬레이션" },
];

export const OECD_COMPARISON = [
  { country: "영국", rate: 101, badge: "참고" },
  { country: "덴마크", rate: 80, badge: "참고" },
  { country: "프랑스", rate: 74, badge: "참고" },
  { country: "OECD 평균", rate: 58, badge: "참고" },
  { country: "독일", rate: 58, badge: "참고" },
  { country: "이탈리아", rate: 52, badge: "참고" },
  { country: "미국", rate: 49, badge: "참고" },
  { country: "한국 목표", rate: 43, badge: "공식" },
  { country: "일본", rate: 38, badge: "참고" },
];

export const FUND_SCENARIOS = [
  { title: "현행 제도 유지 시", year: "2055년", note: "제5차 재정추계에서 제시된 기금 소진 전망입니다. 이 숫자는 연금 지급 중단과 같은 뜻이 아닙니다.", badge: "공식" },
  { title: "2025 개혁 반영 시", year: "2071년", note: "보험료율 인상과 소득대체율 조정 등을 반영한 정부 설명 기준입니다. 검색에서 많이 혼동하는 포인트라 같이 봐야 합니다.", badge: "공식" },
];

export const BURDEN_COMPARE = [
  { title: "직장가입자", monthlyExtra: "월 +7,700원", body: "월평균소득 309만원 기준 본인 부담 증가분입니다. 사업주가 절반을 분담해 체감 증가는 상대적으로 낮습니다.", badge: "공식" },
  { title: "지역가입자", monthlyExtra: "월 +15,400원", body: "같은 평균소득 기준 전액을 본인이 부담합니다. 같은 보험료율 인상이라도 체감 부담이 더 크게 다가옵니다.", badge: "공식" },
];

export const RETIREMENT_READINESS = {
  targetMonthlyExpense: 300,
  expectedPension: 95,
  shortfall: 205,
  coverageRate: 31.7,
};

export const THREE_LAYER_STRATEGY = [
  { title: "1층 국민연금", body: "기본 생활비의 일부를 받쳐주는 공적연금입니다. 물가연동과 종신형 구조가 강점입니다." },
  { title: "2층 IRP·퇴직연금", body: "세액공제와 장기 운용을 함께 가져갈 수 있는 보완축입니다. 직장인의 노후 현금흐름을 두껍게 만듭니다." },
  { title: "3층 개인연금·적립식 투자", body: "국민연금만으로 모자라는 생활비를 메우는 자율 영역입니다. 부족분을 숫자로 채우는 역할을 합니다." },
];

export const REFORM_CHECKLIST = [
  "2026년 보험료율 9.5% 적용 여부 확인",
  "내 지급개시연령 확인: 1969년 이후 출생자는 65세",
  "조기수령·정상수령·연기수령 손익분기점 비교",
  "IRP·연금저축 같은 추가 축을 병행할지 점검",
  "납입 공백 기간이 있으면 추후납부 가능 여부 확인",
  "지역가입자라면 월 추가 부담분을 따로 예산에 반영",
];

export const NP_FAQ = [
  { q: "국민연금은 2026년에 얼마나 오르나요?", a: "2026년 보험료율은 9%에서 9.5%로 올라갑니다. 월평균소득 309만원 기준으로 직장가입자 본인 부담은 약 7,700원, 지역가입자는 약 15,400원 늘어나는 구조입니다." },
  { q: "보험료율 13%는 언제 도달하나요?", a: "2026년 9.5%를 시작으로 매년 0.5%p씩 인상돼 2033년에 13%에 도달하는 로드맵입니다." },
  { q: "2055년 고갈이면 정말 못 받는 건가요?", a: "2055년은 현행 제도를 유지했을 때의 기금 소진 추계 시점입니다. 제도와 재정 방식은 계속 조정될 수 있고, 연금 지급 중단과 같은 뜻으로 단순 해석하면 안 됩니다." },
  { q: "조기수령과 연기수령 중 무엇이 유리한가요?", a: "조기수령은 더 빨리 받지만 월 수령액이 줄고, 연기수령은 늦게 받는 대신 더 많이 받습니다. 건강 상태, 다른 소득원, 기대수명에 따라 유불리가 달라집니다." },
  { q: "직장가입자와 지역가입자 부담 차이는 왜 큰가요?", a: "직장가입자는 보험료를 회사와 절반씩 부담하지만, 지역가입자는 전액을 본인이 부담합니다. 같은 보험료율 인상이어도 체감 부담이 다르게 느껴지는 이유입니다." },
  { q: "국민연금만으로 노후 준비가 충분한가요?", a: "소득대체율 43% 기준으로도 국민연금만으로는 은퇴 전 생활비를 온전히 대체하기 어렵습니다. IRP, 연금저축, 적립식 투자 같은 추가 축을 함께 보는 편이 현실적입니다." },
];

export const REFERENCES = {
  official: [
    { label: "국민연금공단 개혁 안내", href: "https://www.nps.or.kr/" },
    { label: "보건복지부 연금개혁 설명자료", href: "https://www.mohw.go.kr/" },
    { label: "OECD Pensions at a Glance", href: "https://www.oecd.org/" },
  ],
  related: [
    { label: "퇴직금 계산기", href: "/tools/retirement/" },
    { label: "적립식 투자 계산기", href: "/tools/dca-investment-calculator/" },
    { label: "FIRE 계산기", href: "/tools/fire-calculator/" },
    { label: "연봉·자산 2016 vs 2026", href: "/reports/salary-asset-2016-vs-2026/" },
  ],
};

export const SEO_SECTIONS = [
  { title: "국민연금 세대별 비교가 필요한 이유", body: "국민연금은 모두가 같은 숫자를 경험하는 제도가 아닙니다. 이미 납입을 거의 마친 세대와 앞으로 30~40년을 더 내야 하는 세대는 보험료율 인상 체감도, 월 수령액 기대치도 다릅니다. 그래서 2026년 이후에는 세대별 총납입액과 월 수령액, 손익분기점을 한 번에 비교하는 콘텐츠 수요가 커질 수밖에 없습니다." },
  { title: "2055년과 2071년을 같이 봐야 하는 이유", body: "검색에서는 여전히 2055년 고갈이라는 표현이 먼저 보이지만, 2025 개혁 반영 시나리오에서는 2071년 전망이 함께 언급됩니다. 사용자는 이 둘을 충돌하는 숫자로 받아들이기 쉽기 때문에, 같은 화면에서 전제 조건을 분리해서 설명하는 구성이 중요합니다." },
  { title: "국민연금만으로는 부족할 수 있다는 점", body: "공적연금의 역할은 기초 생활비 일부를 안정적으로 보완하는 데 있습니다. 목표 노후 생활비가 월 300만원 수준이라면 국민연금 예상액만으로는 큰 간극이 남을 수 있고, 그 차이를 IRP·연금저축·적립식 투자처럼 다른 축으로 메우는 전략이 자연스럽습니다." },
];

export const nationalPension2026 = {
  meta: NP_META,
  heroStats: NP_HERO_STATS,
  concepts: SYSTEM_CONCEPTS,
  roadmap: PREMIUM_RATE_ROADMAP,
  generations: GENERATION_SCENARIOS,
  generationSummaries: GENERATION_SUMMARIES,
  payoutTiming: PAYOUT_TIMING_COMPARE,
  oecdComparison: OECD_COMPARISON,
  fundScenarios: FUND_SCENARIOS,
  burdenCompare: BURDEN_COMPARE,
  readiness: RETIREMENT_READINESS,
  threeLayerStrategy: THREE_LAYER_STRATEGY,
  checklist: REFORM_CHECKLIST,
  faq: NP_FAQ,
  references: REFERENCES,
  seoSections: SEO_SECTIONS,
  constants: {
    deferralBonusPerMonth: DEFERRAL_BONUS_PER_MONTH,
    incomeReplacementRate: INCOME_REPLACEMENT_RATE,
    pensionStartAgePost1969: PENSION_START_AGE_POST1969,
    earlyPensionAge: EARLY_PENSION_AGE,
    monthlyExtraBurden: MONTHLY_EXTRA_BURDEN,
  },
};
