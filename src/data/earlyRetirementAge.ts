export const earlyRetirementDefaults = {
  currentAge: 35,
  monthlyIncome: 4500000,
  monthlyExpense: 2500000,
  currentAssets: 80000000,
  annualReturnRate: 5,
  retirementMonthlyExpense: 2500000,
  withdrawalRate: 4,
  monthlyPension: 0,
  passiveIncome: 0,
  safetyMargin: 10,
};

export const earlyRetirementFaq = [
  {
    question: "4% 룰만 믿고 은퇴해도 되나요?",
    answer: "4% 룰은 참고 기준입니다. 조기 은퇴처럼 은퇴 기간이 길면 3.0~3.5% 인출률도 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "투자수익률은 몇 %로 입력하면 좋나요?",
    answer: "보수적으로 보려면 물가상승률을 제외한 실질수익률 3~5% 범위를 참고할 수 있습니다. 수익률은 보장되지 않습니다.",
  },
  {
    question: "부동산 자산도 포함해야 하나요?",
    answer: "실거주 주택처럼 바로 생활비로 쓰기 어려운 자산은 별도로 보고, 금융자산 중심으로 계산하면 더 보수적입니다.",
  },
  {
    question: "국민연금도 반영해야 하나요?",
    answer: "고급 옵션에서 은퇴 후 월 연금 현금흐름으로 반영할 수 있습니다. 다만 조기 은퇴 시점과 국민연금 수령 시점 사이에는 소득 공백이 생길 수 있으므로 별도 현금흐름표가 필요합니다.",
  },
  {
    question: "월 배당이나 부업 수입도 넣어도 되나요?",
    answer: "은퇴 후에도 유지 가능성이 높은 현금흐름이라면 부수입에 넣을 수 있습니다. 다만 변동성이 큰 배당, 임대 공실, 프리랜서 수입은 보수적으로 입력하는 편이 좋습니다.",
  },
  {
    question: "현재 자산이 목표자산보다 크면 바로 은퇴 가능한가요?",
    answer: "계산상으로는 목표자산에 도달한 상태이지만, 실제로는 세금, 건강보험료, 주거비, 의료비, 가족 부양비, 시장 하락 구간을 먼저 점검해야 합니다.",
  },
  {
    question: "저축률이 몇 %면 조기 은퇴가 현실적인가요?",
    answer: "정답은 없지만 30% 미만은 일반 은퇴 준비 구간, 30~50%는 조기 은퇴 가능성이 생기는 구간, 50% 이상은 FIRE 속도가 빨라지는 구간으로 볼 수 있습니다.",
  },
];

export const earlyRetirementWithdrawalRows = [
  { monthlyExpense: "150만 원", annualExpense: "1,800만 원", rate4: "4.5억", rate35: "5.14억", rate3: "6.0억" },
  { monthlyExpense: "200만 원", annualExpense: "2,400만 원", rate4: "6.0억", rate35: "6.86억", rate3: "8.0억" },
  { monthlyExpense: "250만 원", annualExpense: "3,000만 원", rate4: "7.5억", rate35: "8.57억", rate3: "10.0억" },
  { monthlyExpense: "300만 원", annualExpense: "3,600만 원", rate4: "9.0억", rate35: "10.29억", rate3: "12.0억" },
  { monthlyExpense: "400만 원", annualExpense: "4,800만 원", rate4: "12.0억", rate35: "13.71억", rate3: "16.0억" },
  { monthlyExpense: "500만 원", annualExpense: "6,000만 원", rate4: "15.0억", rate35: "17.14억", rate3: "20.0억" },
];

export const earlyRetirementSavingRateGuide = [
  { range: "10% 미만", label: "재무 안정화 우선", description: "조기 은퇴보다 비상금, 부채, 고정비 구조를 먼저 점검해야 하는 구간입니다." },
  { range: "10~30%", label: "일반 은퇴 준비", description: "장기 저축은 가능하지만 조기 은퇴까지는 소득 증가나 지출 절감이 더 필요합니다." },
  { range: "30~50%", label: "조기 은퇴 가능권", description: "현재 자산과 투자수익률에 따라 은퇴 시점이 의미 있게 앞당겨질 수 있습니다." },
  { range: "50~70%", label: "FIRE 가속 구간", description: "저축률이 높아 자산 성장 속도가 빠르지만 생활 만족도와 지속 가능성도 함께 봐야 합니다." },
  { range: "70% 이상", label: "극단적 절약 구간", description: "Lean FIRE에 가까워질 수 있으나 주거, 건강, 가족 지출 변수를 과소평가하지 않아야 합니다." },
];

export const earlyRetirementAssetStrategy = [
  { range: "0~3,000만 원", strategy: "비상금 확보와 저축률 개선", description: "투자수익률보다 월 현금흐름을 플러스로 만드는 것이 우선입니다." },
  { range: "3,000만~1억 원", strategy: "월 적립 투자 루틴 만들기", description: "자동이체, 지출 분류, 리밸런싱 원칙을 고정해 복리의 출발점을 만듭니다." },
  { range: "1억~3억 원", strategy: "복리 효과 본격화", description: "수익률 1%p 차이와 지출 10% 차이가 은퇴 나이에 크게 반영되기 시작합니다." },
  { range: "3억~5억 원", strategy: "은퇴 후 생활비 현실화", description: "목표 생활비, 건강보험료, 세금, 주거비를 보수적으로 재계산해야 합니다." },
  { range: "5억 원 이상", strategy: "인출률과 세금 최적화", description: "은퇴 가능 여부보다 인출 순서, 현금 비중, 시장 하락 대응 계획이 중요합니다." },
];

export const earlyRetirementFireTypes = [
  { name: "Lean FIRE", condition: "은퇴 후 월 생활비 200만 원 이하", description: "최소 지출형 조기 은퇴입니다. 생활비 변동에 취약할 수 있습니다." },
  { name: "Standard FIRE", condition: "월 생활비 200만~400만 원", description: "일반적인 조기 은퇴 목표입니다. 주거비와 의료비 반영이 중요합니다." },
  { name: "Fat FIRE", condition: "월 생활비 400만 원 이상", description: "여유 생활형 FIRE입니다. 필요한 자산이 빠르게 커집니다." },
  { name: "Coast FIRE", condition: "현재 자산이 장기 복리로 목표에 접근", description: "추가 저축 부담은 낮추되 은퇴 전 근로소득은 유지하는 방식입니다." },
  { name: "Barista FIRE", condition: "일부 근로소득·부수입 병행", description: "완전 은퇴 전 단계로 건강보험료와 생활비 공백을 줄일 수 있습니다." },
];

export const earlyRetirementActionChecklist = [
  { title: "생활비", description: "월 지출을 고정비, 변동비, 주거비, 보험료, 가족 지원비로 나누어 은퇴 후에도 남을 비용을 분리합니다." },
  { title: "자산", description: "실거주 부동산과 퇴직연금처럼 바로 쓰기 어려운 자산은 금융자산과 따로 계산합니다." },
  { title: "수익률", description: "명목수익률과 실질수익률을 혼동하지 말고, 보수적 수익률로 한 번 더 계산합니다." },
  { title: "현금흐름", description: "국민연금 수령 전 공백 기간, 건강보험료, 의료비, 세금, 대출 상환액을 별도 표로 만듭니다." },
  { title: "안전마진", description: "목표자산에 10~20% 여유를 두면 시장 하락과 예상 밖 지출에 대응하기 쉽습니다." },
  { title: "실행", description: "은퇴 결정 전 6~12개월은 은퇴 후 생활비 수준으로 실제 생활해 보고 지속 가능성을 확인합니다." },
];

export const earlyRetirementSources = [
  {
    label: "Journal of Financial Planning, 4% 룰 논의",
    href: "https://www.financialplanningassociation.org/article/journal/AUG14-4-percent-rule-too-low-or-too-high",
    basis: "Bengen 연구와 지속가능 인출률 논의의 배경",
  },
  {
    label: "William Bengen의 4% Rule 설명",
    href: "https://www.bengenfs.com/the-4-percent-rule/",
    basis: "4% 룰의 전제와 한계",
  },
  {
    label: "비교계산소 직장인 은퇴 준비 리포트",
    href: "/reports/worker-retirement-reality-2026/",
    basis: "국민연금, 퇴직연금, 개인연금과 은퇴 부족액 해석",
  },
];
