// KBO 선수 연봉 계산기 데이터
// slug: kbo-salary-calculator

export const KSC_META = {
  slug: "kbo-salary-calculator",
  title: "KBO 선수 연봉 계산기",
  seoTitle: "KBO 선수 연봉 계산기 — 세후 실수령·리그 분포·포지션 비교",
  description:
    "KBO 선수 연봉을 입력하면 세후 월 실수령, 4대보험·소득세 내역, 리그 내 상위 몇%, 포지션 평균 대비를 한 번에 확인합니다.",
  updatedAt: "2026-06",
  caution:
    "이 계산기는 일반 근로소득 기준 추정치입니다. 실제 선수 계약은 사업소득·원천징수 구조가 다를 수 있습니다. 계약 전 세무 전문가 확인을 권장합니다.",
};

export const KSC_DEFAULTS = {
  salary: 140_000_000, // 리그 평균 수준
};

// 빠른 선택 버튼 (유명 선수 연봉 기준)
export const KSC_QUICK_SALARIES = [
  { label: "최저연봉", value: 36_000_000, note: "2026 KBO 최저" },
  { label: "리그 평균", value: 140_000_000, note: "약 1.4억" },
  { label: "1억", value: 100_000_000, note: "상위 45% 수준" },
  { label: "3억", value: 300_000_000, note: "상위 10% 수준" },
  { label: "원태인 수준", value: 1_000_000_000, note: "10억" },
  { label: "류현진 수준", value: 2_500_000_000, note: "25억" },
];

// 리그 연봉 구간 분포 (추정, 공시 선수 약 600명 기준)
export const KSC_DISTRIBUTION = [
  { label: "최저~5,000만", min: 0, max: 50_000_000, count: 148, pct: 24.7 },
  { label: "5,000만~1억", min: 50_000_000, max: 100_000_000, count: 192, pct: 32.0 },
  { label: "1억~3억", min: 100_000_000, max: 300_000_000, count: 162, pct: 27.0 },
  { label: "3억~5억", min: 300_000_000, max: 500_000_000, count: 48, pct: 8.0 },
  { label: "5억~10억", min: 500_000_000, max: 1_000_000_000, count: 30, pct: 5.0 },
  { label: "10억 초과", min: 1_000_000_000, max: Infinity, count: 20, pct: 3.3 },
];

// 포지션별 리그 평균
export const KSC_POSITION_AVG = [
  { position: "선발투수", icon: "⚾", avgMillion: 155000, topSalary: 2_500_000_000 },
  { position: "마무리·중간계투", icon: "💪", avgMillion: 110000, topSalary: 900_000_000 },
  { position: "포수", icon: "🧤", avgMillion: 90000, topSalary: 700_000_000 },
  { position: "내야수", icon: "🏃", avgMillion: 108000, topSalary: 1_500_000_000 },
  { position: "외야수", icon: "🎯", avgMillion: 116000, topSalary: 1_200_000_000 },
];

// 대표 연봉 레퍼런스
export const KSC_BENCHMARKS = [
  { name: "류현진", team: "한화", position: "선발투수", salary: 2_500_000_000 },
  { name: "최정", team: "SSG", position: "3루수", salary: 1_500_000_000 },
  { name: "김광현", team: "SSG", position: "선발투수", salary: 1_200_000_000 },
  { name: "오지환", team: "LG", position: "유격수", salary: 1_300_000_000 },
  { name: "양현종", team: "KIA", position: "선발투수", salary: 1_500_000_000 },
  { name: "나성범", team: "KIA", position: "외야수", salary: 1_100_000_000 },
  { name: "구자욱", team: "삼성", position: "외야수", salary: 1_200_000_000 },
  { name: "원태인", team: "삼성", position: "선발투수", salary: 1_000_000_000 },
  { name: "강백호", team: "KT", position: "1루수", salary: 1_000_000_000 },
  { name: "김도영", team: "KIA", position: "3루수", salary: 1_000_000_000 },
];

// FAQ
export const KSC_FAQ = [
  {
    question: "KBO 선수 연봉은 어떻게 과세되나요?",
    answer:
      "KBO 선수는 대부분 프리랜서(사업소득자)로 계약하며, 이 경우 원천징수세율 3.3%가 적용됩니다. 일부 구단과 직접 근로계약을 체결한 경우에는 일반 근로소득세(4대보험 포함)를 납부합니다. 이 계산기는 근로소득 기준 추정이므로 실제와 다를 수 있습니다.",
  },
  {
    question: "KBO 최저 연봉은 얼마인가요?",
    answer:
      "2026년 KBO 최저 연봉은 3,600만 원입니다. 신인 선수나 최저 연봉 계약 선수가 해당됩니다. 2군 선수는 별도 기준이 적용될 수 있습니다.",
  },
  {
    question: "KBO 리그 평균 연봉은 얼마인가요?",
    answer:
      "2026년 KBO 리그 전체 공시 선수 평균 연봉은 약 1억 4,000만 원입니다. 다만 상위 소수 선수가 평균을 크게 끌어올리므로, 중앙값은 약 8,000만~9,000만 원 수준으로 추정됩니다.",
  },
  {
    question: "KBO 연봉 1억은 리그 내 어느 수준인가요?",
    answer:
      "연봉 1억 원은 KBO 리그 내 상위 약 35~40% 수준입니다. 전체 공시 선수 600여 명 중 약 240~250명이 1억 원 이상을 받는 것으로 추정됩니다.",
  },
  {
    question: "FA 계약은 연봉 계산에 어떤 영향을 주나요?",
    answer:
      "FA(자유계약선수) 계약은 보통 총액 기준으로 발표됩니다. 총액을 계약 연수로 나눈 연평균이 실질 연봉이며, 계약금(보너스)은 별도로 지급됩니다. 원태인 6년 60억 계약의 경우 연평균 10억 원이 기본 연봉에 해당합니다.",
  },
  {
    question: "외국인 선수 연봉은 KBO 공시에 포함되나요?",
    answer:
      "외국인 선수는 KBO 연봉 공시 대상에서 제외됩니다. 외국인 선수 계약은 달러 기준으로 체결되며, 상위권 외국인 선수는 연 100만~200만 달러(약 13억~26억 원) 수준으로 알려져 있습니다.",
  },
];

export const KSC_RELATED_LINKS = [
  { label: "KBO 10구단 연봉 비교 2026", href: "/reports/kbo-salary-comparison-2026/" },
  { label: "K리그1 구단별 연봉 비교 2026", href: "/reports/kleague-salary-comparison-2026/" },
  { label: "연봉 실수령액 계산기", href: "/tools/salary/" },
  { label: "세후 보너스 계산기", href: "/tools/bonus-after-tax-calculator/" },
];
