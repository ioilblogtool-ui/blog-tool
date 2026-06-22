export const CMC_META = {
  slug: "couple-monthly-cashflow-calculator",
  title: "부부 월 현금흐름 계산기",
  seoTitle: "부부 월 현금흐름 계산기 | 연봉, 대출, 육아비, 생활비 넣으면 한 달에 얼마 남을까?",
  seoDescription:
    "남편 연봉, 아내 연봉, 성과급, 대출이자, 월세, 육아비, 생활비, 보험료, 투자금을 입력하면 부부 월 실수령 합계와 잉여현금, 저축률, 10억 도달 예상 기간을 계산합니다.",
  updatedAt: "2026-06-22",
  dataNote:
    "이 계산기는 입력값과 단순화한 세후소득 추정식을 바탕으로 월 현금흐름을 계산합니다. 실제 급여명세서, 세액공제, 보험료, 대출 원리금, 투자 성과와는 차이가 날 수 있습니다.",
};

export type HousingType = "mortgage" | "jeonseLoan" | "monthlyRent" | "none";

export interface CashflowPreset {
  id: string;
  label: string;
  summary: string;
  input: {
    husbandSalary: number;
    wifeSalary: number;
    husbandBonus: number;
    wifeBonus: number;
    otherMonthlyIncome: number;
    housingType: HousingType;
    loanBalance: number;
    loanRate: number;
    manualMonthlyPayment: number;
    rent: number;
    maintenanceFee: number;
    children: number;
    daycare: number;
    formulaFood: number;
    diaper: number;
    childMedical: number;
    childInsurance: number;
    careEducation: number;
    food: number;
    transport: number;
    telecomSubscription: number;
    coupleInsurance: number;
    medicalBeautyClothing: number;
    familyEvents: number;
    otherCard: number;
    depositSavings: number;
    isa: number;
    pension: number;
    stockEtf: number;
    crypto: number;
    currentAssets: number;
    targetAssets: number;
    expectedReturn: number;
  };
}

export const CMC_HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  mortgage: "자가 대출",
  jeonseLoan: "전세대출",
  monthlyRent: "월세",
  none: "주거비 낮음",
};

export const CMC_DEFAULT_INPUT = {
  husbandSalary: 60_000_000,
  wifeSalary: 50_000_000,
  husbandBonus: 0,
  wifeBonus: 0,
  otherMonthlyIncome: 0,
  housingType: "jeonseLoan" as HousingType,
  loanBalance: 200_000_000,
  loanRate: 4,
  manualMonthlyPayment: 0,
  rent: 0,
  maintenanceFee: 300_000,
  children: 1,
  daycare: 200_000,
  formulaFood: 200_000,
  diaper: 100_000,
  childMedical: 50_000,
  childInsurance: 100_000,
  careEducation: 0,
  food: 1_200_000,
  transport: 500_000,
  telecomSubscription: 250_000,
  coupleInsurance: 400_000,
  medicalBeautyClothing: 300_000,
  familyEvents: 300_000,
  otherCard: 500_000,
  depositSavings: 500_000,
  isa: 500_000,
  pension: 500_000,
  stockEtf: 500_000,
  crypto: 0,
  currentAssets: 50_000_000,
  targetAssets: 1_000_000_000,
  expectedReturn: 5,
};

export const CMC_PRESETS: CashflowPreset[] = [
  {
    id: "newlywed-dual-income",
    label: "신혼 맞벌이",
    summary: "자녀 없이 주거비와 생활비 중심으로 보는 기본 시나리오",
    input: {
      ...CMC_DEFAULT_INPUT,
      children: 0,
      daycare: 0,
      formulaFood: 0,
      diaper: 0,
      childInsurance: 0,
      food: 1_000_000,
      transport: 400_000,
      coupleInsurance: 300_000,
    },
  },
  {
    id: "infant-one-child",
    label: "영유아 1명",
    summary: "분유, 기저귀, 어린이집, 자녀보험을 함께 반영",
    input: { ...CMC_DEFAULT_INPUT },
  },
  {
    id: "single-income-parenting",
    label: "외벌이 전환",
    summary: "배우자 소득을 0원으로 두고 육아기 현금흐름 확인",
    input: {
      ...CMC_DEFAULT_INPUT,
      husbandSalary: 70_000_000,
      wifeSalary: 0,
      loanBalance: 150_000_000,
      daycare: 100_000,
      food: 1_000_000,
      stockEtf: 200_000,
      isa: 0,
      pension: 300_000,
    },
  },
  {
    id: "high-mortgage",
    label: "대출 많은 부부",
    summary: "주담대 5억 원, 관리비 높은 집의 주거비 압박 확인",
    input: {
      ...CMC_DEFAULT_INPUT,
      husbandSalary: 70_000_000,
      wifeSalary: 50_000_000,
      housingType: "mortgage",
      loanBalance: 500_000_000,
      loanRate: 4.2,
      manualMonthlyPayment: 2_500_000,
      maintenanceFee: 450_000,
      currentAssets: 80_000_000,
    },
  },
  {
    id: "fire-focused",
    label: "FIRE 집중형",
    summary: "지출을 낮추고 월 투자액을 크게 잡은 장기 목표 시나리오",
    input: {
      ...CMC_DEFAULT_INPUT,
      husbandSalary: 80_000_000,
      wifeSalary: 60_000_000,
      children: 0,
      daycare: 0,
      formulaFood: 0,
      diaper: 0,
      childInsurance: 0,
      food: 900_000,
      transport: 300_000,
      otherCard: 300_000,
      depositSavings: 1_000_000,
      isa: 1_000_000,
      pension: 1_000_000,
      stockEtf: 1_000_000,
      currentAssets: 150_000_000,
      expectedReturn: 5.5,
    },
  },
];

export const CMC_SAVING_RATE_BANDS = [
  { min: -999, max: 0, label: "적자", tone: "danger", description: "지출 구조를 먼저 줄여야 하는 구간입니다." },
  { min: 0, max: 10, label: "위험", tone: "warning", description: "예상치 못한 지출에 취약할 수 있습니다." },
  { min: 10, max: 25, label: "보통", tone: "neutral", description: "기본 저축은 가능하지만 고정비 점검이 필요합니다." },
  { min: 25, max: 40, label: "양호", tone: "positive", description: "자산 형성 속도가 있는 편입니다." },
  { min: 40, max: 999, label: "강함", tone: "strong", description: "장기 목표와 FIRE 시뮬레이션을 해볼 만합니다." },
];

export const CMC_RELATED_LINKS = [
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/household-income/", label: "가구소득 순위 계산기" },
  { href: "/tools/formula-cost/", label: "분유비 계산기" },
  { href: "/tools/diaper-cost/", label: "기저귀 비용 계산기" },
  { href: "/tools/fire-calculator/", label: "FIRE 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
  { href: "/tools/newlywed-rent-vs-buy/", label: "신혼부부 전월세·매매 비교" },
];

export const CMC_FAQ = [
  {
    question: "부부 월 현금흐름은 어떻게 계산하나요?",
    answer:
      "부부 각각의 세전 연봉과 성과급을 세후 월소득으로 추정한 뒤, 주거비, 육아비, 생활비, 보험료를 차감해 월 잉여현금과 저축률을 계산합니다.",
  },
  {
    question: "연봉이 높아도 저축률이 낮을 수 있나요?",
    answer:
      "그럴 수 있습니다. 대출 원리금, 월세, 차량 유지비, 보험료, 육아비처럼 매달 빠지는 고정비가 크면 부부 합산 연봉이 높아도 실제 남는 돈은 적을 수 있습니다.",
  },
  {
    question: "투자금은 지출인가요, 저축인가요?",
    answer:
      "이 계산기에서는 소비성 지출과 구분해 저축·투자 항목으로 따로 보여줍니다. 월 잉여현금은 생활비를 뺀 뒤 남는 돈이고, 입력한 투자금은 목표자산 기간 계산에 함께 활용합니다.",
  },
  {
    question: "10억 도달 기간은 정확한가요?",
    answer:
      "현재 투자자산, 월 투자 가능액, 기대수익률을 넣은 추정값입니다. 실제 수익률은 시장 상황에 따라 달라지고 원금 손실도 가능하므로 장기 계획 참고용으로만 보세요.",
  },
  {
    question: "외벌이 전환이나 육아휴직도 계산할 수 있나요?",
    answer:
      "배우자 연봉을 0원으로 두거나 외벌이 전환 프리셋을 선택하면 됩니다. 육아휴직 급여까지 반영하려면 기타 월 소득에 예상 급여를 넣어 비교할 수 있습니다.",
  },
  {
    question: "육아비는 어느 항목까지 넣어야 하나요?",
    answer:
      "어린이집, 분유·이유식, 기저귀, 병원비, 자녀 보험, 돌봄·학원비를 나눠 넣는 것을 권장합니다. 항목을 나눠야 어떤 지출이 현금흐름을 가장 크게 누르는지 보입니다.",
  },
];

export const CMC_SEO_CONTENT = {
  introTitle: "연봉보다 중요한 것은 매달 실제로 남는 돈입니다",
  intro: [
    "부부 월 현금흐름 계산기는 남편 연봉과 아내 연봉을 단순히 더하는 계산기가 아닙니다. 세후 월소득에서 대출이자, 관리비, 월세, 육아비, 식비, 보험료, 통신비, 투자금을 나눠 빼면서 우리 집이 한 달에 실제로 얼마를 남기는지 보여줍니다.",
    "맞벌이 부부는 합산 연봉만 보면 여유가 있어 보이지만, 주거비와 차량비, 보험료, 아이 관련 비용이 붙으면 저축률이 생각보다 낮아질 수 있습니다. 반대로 연봉이 아주 높지 않아도 고정비가 낮으면 매달 투자 가능한 금액이 안정적으로 생깁니다.",
    "이 계산기의 핵심 결과는 월 실수령 합계, 고정비, 변동비, 투자 가능액, 저축률, 목표자산 도달 기간입니다. 특히 저축률은 가계 체력을 보는 간단한 지표입니다. 10% 미만이면 지출 구조를 점검해야 하고, 25%를 넘으면 자산 형성 속도가 붙기 시작합니다.",
    "육아비는 현금흐름을 크게 바꾸는 항목입니다. 분유, 기저귀, 병원비, 어린이집, 자녀 보험을 따로 넣으면 아이가 생긴 뒤에도 매달 얼마를 모을 수 있는지 현실적으로 확인할 수 있습니다. 육아휴직이나 외벌이 전환을 고민할 때도 배우자 소득을 0원으로 두고 비교하면 체감이 빠릅니다.",
    "목표자산 도달 기간은 현재 투자자산과 월 투자 가능액, 기대수익률을 바탕으로 추정합니다. 수익률은 보장되지 않으며, 시장 상황에 따라 원금 손실도 가능합니다. 따라서 이 결과는 투자 결정의 정답이 아니라 장기 계획을 세우기 위한 참고값으로 보는 것이 좋습니다.",
    "현금흐름을 개선할 때는 변동비보다 고정비를 먼저 봐야 합니다. 대출 원리금, 월세, 보험료, 차량 유지비, 통신비처럼 매달 반복되는 비용은 한 번 줄이면 효과가 오래갑니다. 그다음 식비, 외식, 구독, 기타 카드비를 조정하면 저축률이 더 안정됩니다.",
    "계산 결과에서 주거비 비중이 높다면 전세·월세·매매 비용 비교나 대출 갈아타기 계산기를 함께 보면 좋습니다. 육아비 비중이 높다면 분유비와 기저귀 비용을 따로 계산하고, 투자 가능액이 충분하다면 FIRE 계산기와 적립식 투자 계산기로 장기 목표를 이어서 확인할 수 있습니다.",
  ],
  inputPoints: [
    "부부 합산 월 실수령액과 고정비, 변동비를 한 화면에서 비교할 수 있습니다.",
    "육아비와 주거비를 함께 넣어 실제 남는 돈과 저축률을 확인할 수 있습니다.",
    "현재 투자자산과 월 투자 가능액 기준으로 목표자산 도달 예상 기간을 볼 수 있습니다.",
  ],
  criteria: [
    "세후 월소득은 4대보험과 소득세를 단순화한 추정값입니다. 실제 급여명세서와 다를 수 있습니다.",
    "대출 원리금은 직접 입력값이 있으면 직접 입력값을 우선 사용하고, 없으면 대출잔액과 금리 기준 월 이자를 계산합니다.",
    "저축률은 월 잉여현금을 월 실수령 합계로 나눈 값입니다. 투자 입력액과 실제 잉여현금은 다를 수 있어 결과표에서 함께 비교합니다.",
    "목표자산 도달 기간은 월 투자 가능액과 기대수익률을 반복 계산한 추정값이며, 투자 수익률은 보장되지 않습니다.",
  ],
};

export const CMC_CONFIG = {
  defaultInput: CMC_DEFAULT_INPUT,
  presets: CMC_PRESETS,
  housingLabels: CMC_HOUSING_TYPE_LABELS,
  savingRateBands: CMC_SAVING_RATE_BANDS,
};
