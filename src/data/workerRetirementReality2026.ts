export const workerRetirementStats = {
  preparedRate: 71.5,
  pensionDependence: 58.5,
  savingsDependence: 16.9,
  occupationalPensionDependence: 8.1,
  privatePensionDependence: 5.0,
  retirementBenefitDependence: 4.1,
  averageAssets: 566780000,
  averageDebt: 95340000,
  averageFinancialAssets: 136900000,
  averageRealAssets: 429880000,
  averageIncome: 74270000,
  disposableIncome: 60320000,
  retirementPensionAssets: 431700000000000,
  performanceLinkedRetirementPensionAssets: 75200000000000,
  nationalPensionAverageMonthly: 679924,
  nationalPensionLongTermAverageMonthly: 1120000,
};

export const workerRetirementGapScenarios = [
  {
    age: "30대",
    expense: 3000000,
    pension: 1000000,
    gap: 2000000,
    risk: "준비 기간은 길지만 시작 시점 격차가 큼",
    action: "월 자동이체와 장기 투자 원칙을 먼저 고정",
  },
  {
    age: "40대",
    expense: 3000000,
    pension: 1200000,
    gap: 1800000,
    risk: "교육비, 주택담보대출, 노후자금이 동시에 충돌",
    action: "퇴직연금 유형과 IRP 세액공제 한도 점검",
  },
  {
    age: "50대",
    expense: 2800000,
    pension: 1300000,
    gap: 1500000,
    risk: "은퇴까지 남은 기간이 짧아 현금흐름 오류가 치명적",
    action: "퇴직 후 5년 생활비와 국민연금 개시 전 공백 계산",
  },
];

export const workerRetirementPreparationMethods = [
  { method: "국민연금", rate: workerRetirementStats.pensionDependence, interpretation: "가장 큰 축이지만 생활비 전체를 대신하기는 어려움" },
  { method: "예금·적금", rate: workerRetirementStats.savingsDependence, interpretation: "안정성은 높지만 장기 물가상승률 대응이 약할 수 있음" },
  { method: "직역연금", rate: workerRetirementStats.occupationalPensionDependence, interpretation: "공무원·군인·사학연금 등 특정 직군 중심" },
  { method: "사적연금", rate: workerRetirementStats.privatePensionDependence, interpretation: "국민연금 부족분을 보완하는 3층 연금 영역" },
  { method: "퇴직급여", rate: workerRetirementStats.retirementBenefitDependence, interpretation: "일시금 소비보다 연금화 전략 확인 필요" },
];

export const workerRetirementLivingCostCases = [
  { type: "1인 은퇴자", monthlyCost: "180만~250만 원", note: "자가 여부와 건강보험료 부담에 따라 차이가 큼" },
  { type: "부부 은퇴자", monthlyCost: "280만~400만 원", note: "식비, 의료비, 경조사비, 여행비 변수가 함께 작동" },
  { type: "주택 보유 은퇴자", monthlyCost: "250만~350만 원", note: "대출이 없어도 관리비, 보유세, 수선비가 남음" },
  { type: "월세 거주 은퇴자", monthlyCost: "300만 원 이상", note: "주거비가 고정비로 남아 국민연금 단독 생활이 더 어려움" },
];

export const workerRetirementNationalPensionGapRows = [
  { monthlyExpense: 2000000, nationalPension: 700000 },
  { monthlyExpense: 2500000, nationalPension: 700000 },
  { monthlyExpense: 3000000, nationalPension: 700000 },
  { monthlyExpense: 4000000, nationalPension: 700000 },
].map((row) => ({
  ...row,
  monthlyGap: Math.max(row.monthlyExpense - row.nationalPension, 0),
  annualGap: Math.max(row.monthlyExpense - row.nationalPension, 0) * 12,
  gapFor25Years: Math.max(row.monthlyExpense - row.nationalPension, 0) * 12 * 25,
}));

export const workerRetirementPensionLayers = [
  { layer: "1층", asset: "국민연금", role: "기초 노후소득", check: "예상연금월액과 수령 개시 연령 확인" },
  { layer: "2층", asset: "퇴직연금 DB·DC·IRP", role: "직장인 핵심 보완자산", check: "DB/DC 유형, 수익률, 수수료, 연금 수령 가능성 확인" },
  { layer: "3층", asset: "연금저축·ISA·일반 금융자산", role: "부족 현금흐름 보완", check: "세액공제, 인출 순서, 생활비 계좌 분리 확인" },
];

export const workerRetirementRealEstateRisks = [
  { risk: "현금흐름 부족", description: "집값은 높아도 매월 생활비로 바로 바꾸기 어렵습니다." },
  { risk: "유동성 부족", description: "의료비, 간병비, 자녀 지원비처럼 급한 지출에 대응이 늦어질 수 있습니다." },
  { risk: "보유 비용", description: "관리비, 보유세, 수선비가 은퇴 후 고정비로 남습니다." },
  { risk: "다운사이징 난이도", description: "생활권, 가족 관계, 주택시장 상황 때문에 계획대로 줄이기 어렵습니다." },
];

export const workerRetirementChecklist = [
  {
    age: "30대",
    items: ["국민연금 예상 수령액 조회", "연금저축 또는 IRP 월 자동이체 시작", "비상금 6개월치 확보", "장기 투자 비중과 리밸런싱 원칙 작성"],
  },
  {
    age: "40대",
    items: ["퇴직연금 DB/DC 유형 확인", "IRP 세액공제 한도 활용 여부 점검", "주택담보대출 잔액과 은퇴 시점 비교", "자녀 교육비와 노후자금 계좌 분리"],
  },
  {
    age: "50대",
    items: ["국민연금 수령 개시 연령 확인", "퇴직금 일시금과 연금 수령 비교", "건강보험료와 의료비 예산 반영", "은퇴 후 5년 월별 현금흐름표 작성"],
  },
];

export const workerRetirementSources = [
  {
    label: "국가데이터처 2025년 사회조사",
    href: "https://www.kostat.go.kr/board.es?act=view&bid=219&list_no=439196&mid=a10301060100&ref_bid=&tag=",
    basis: "노후 준비율, 준비 방법, 노후 소득지원 인식",
  },
  {
    label: "국가데이터처 2025년 가계금융복지조사",
    href: "https://www.kostat.go.kr/board.es?act=view&bid=215&list_no=439535&mid=a10301040300&ref_bid=&tag=",
    basis: "가구 평균 자산, 부채, 순자산, 금융자산·실물자산",
  },
  {
    label: "고용노동부·금융감독원 2024년 퇴직연금 투자 백서",
    href: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=17911",
    basis: "퇴직연금 적립금 431.7조 원, 실적배당형 상품 증가",
  },
];

export const workerRetirementFaq = [
  { question: "국민연금만으로 노후 생활이 가능한가요?", answer: "생활비 수준과 주거 형태에 따라 다르지만, 평균 수령액 기준으로는 월 생활비 전체를 감당하기 어려운 경우가 많습니다. 국민연금은 기초 소득으로 보고 퇴직연금, 개인연금, 금융자산을 함께 계산해야 합니다." },
  { question: "노후 부족액은 어떻게 계산하나요?", answer: "목표 월 생활비에서 국민연금, 퇴직연금, 개인연금 등 예상 월 현금흐름을 뺀 금액으로 봅니다. 이 리포트의 부족액은 개인별 확정값이 아니라 생활비와 연금 가정을 넣은 시뮬레이션입니다." },
  { question: "평균 순자산 4억 원대면 노후 준비가 충분한가요?", answer: "그렇지 않을 수 있습니다. 평균 순자산에는 실거주 부동산이 크게 포함되고, 평균값은 고자산층의 영향을 받습니다. 은퇴 준비에서는 전체 순자산보다 매월 쓸 수 있는 현금흐름과 금융자산 비중이 더 중요합니다." },
  { question: "30대도 은퇴자금 부족액을 계산해야 하나요?", answer: "30대는 부족액 자체보다 저축률과 시작 시점이 중요합니다. 월 10만~50만 원의 자동이체를 오래 유지할 수 있는 구조를 만드는 것이 뒤늦게 큰 금액을 넣는 것보다 현실적일 수 있습니다." },
  { question: "퇴직연금 DB형과 DC형 중 무엇이 유리한가요?", answer: "임금 상승률, 근속 기간, 운용 성향에 따라 다릅니다. DB형은 급여 공식에 따른 안정성이 장점이고, DC형은 직접 운용 성과가 중요합니다. 유형보다 먼저 현재 적립금, 수익률, 수수료, 연금 수령 가능 여부를 확인해야 합니다." },
  { question: "4% 룰 기준 필요자산을 그대로 믿어도 되나요?", answer: "4% 룰은 은퇴자산을 현금흐름으로 환산하는 참고 기준입니다. 한국의 세금, 건강보험료, 주거비, 물가상승률, 투자수익률 변동을 반영하면 3~4% 범위를 함께 보는 편이 안전합니다." },
];
