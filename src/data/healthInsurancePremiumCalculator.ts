export type HealthInsuranceMode = "employee" | "regional" | "transition";
export type EmployeeIncomeMode = "monthlyWage" | "annualSalary";
export type RegionalInputMode = "simple" | "points";

export const HEALTH_INSURANCE_RULES_2026 = {
  year: 2026,
  healthRate: 0.0719,
  employeeShareRate: 0.03595,
  employerShareRate: 0.03595,
  longTermCareRateOnHealthPremium: 0.1314,
  longTermCareRateByIncome: 0.009448,
  otherIncomeThreshold: 20_000_000,
  regionalPointUnitPrice: 211.5,
  previousYear: {
    year: 2025,
    healthRate: 0.0709,
    employeeShareRate: 0.03545,
    employerShareRate: 0.03545,
    longTermCareRateOnHealthPremium: 0.1295,
  },
  sources: [
    {
      label: "보건복지부 2026년 건강보험료율 7.19%로 결정",
      url: "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1487279&mid=a10503010000",
    },
    {
      label: "보건복지부 2026년도 장기요양보험료율 0.9448%",
      url: "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1487817&mid=a10503010000",
    },
    {
      label: "국민건강보험공단 보험료율 안내",
      url: "https://www.nhis.or.kr/english/wbheaa02500m01.do",
    },
  ],
};

export const HEALTH_INSURANCE_DEFAULT_INPUT = {
  mode: "employee" as HealthInsuranceMode,
  employee: {
    incomeMode: "monthlyWage" as EmployeeIncomeMode,
    monthlyWage: 3_000_000,
    annualSalary: 36_000_000,
    otherAnnualIncome: 0,
    showEmployerShare: true,
  },
  regional: {
    inputMode: "simple" as RegionalInputMode,
    annualIncome: 30_000_000,
    propertyTaxBase: 0,
    rentDeposit: 0,
    carValue: 0,
    directPoints: 0,
  },
  transition: {
    beforeMonthlyWage: 4_000_000,
    afterAnnualIncome: 12_000_000,
    afterPropertyTaxBase: 200_000_000,
    afterRentDeposit: 0,
    directRegionalPoints: 0,
    useContinuationScenario: true,
  },
};

export const HEALTH_INSURANCE_PRESETS = [
  {
    id: "new-worker",
    label: "신입 월급 250만",
    description: "첫 월급 공제액 확인",
    input: {
      mode: "employee",
      employee: { incomeMode: "monthlyWage", monthlyWage: 2_500_000, annualSalary: 30_000_000, otherAnnualIncome: 0 },
    },
  },
  {
    id: "average-worker",
    label: "연봉 4,800만",
    description: "평균 직장인 실부담",
    input: {
      mode: "employee",
      employee: { incomeMode: "annualSalary", monthlyWage: 4_000_000, annualSalary: 48_000_000, otherAnnualIncome: 0 },
    },
  },
  {
    id: "high-income",
    label: "연봉 9,000만",
    description: "고연봉 구간 부담",
    input: {
      mode: "employee",
      employee: { incomeMode: "annualSalary", monthlyWage: 7_500_000, annualSalary: 90_000_000, otherAnnualIncome: 0 },
    },
  },
  {
    id: "freelancer",
    label: "프리랜서",
    description: "지역가입자 간이 추정",
    input: {
      mode: "regional",
      regional: { inputMode: "simple", annualIncome: 50_000_000, propertyTaxBase: 0, rentDeposit: 0, carValue: 0, directPoints: 0 },
    },
  },
  {
    id: "retiree",
    label: "퇴직 예정자",
    description: "퇴직 전후 비교",
    input: {
      mode: "transition",
      transition: {
        beforeMonthlyWage: 5_000_000,
        afterAnnualIncome: 0,
        afterPropertyTaxBase: 300_000_000,
        afterRentDeposit: 0,
        directRegionalPoints: 0,
        useContinuationScenario: true,
      },
    },
  },
];

export const HEALTH_INSURANCE_FAQ = [
  {
    question: "2026년 건강보험료율은 얼마인가요?",
    answer: "2026년 건강보험료율은 보건복지부 발표 기준 7.19%입니다. 직장가입자는 근로자와 사용자가 절반씩 부담하므로 근로자 본인 부담은 보수월액의 3.595%입니다.",
  },
  {
    question: "장기요양보험료는 따로 계산해야 하나요?",
    answer: "네. 장기요양보험료는 건강보험료에 2026년 장기요양보험료율 13.14%를 곱해 계산합니다. 실제 월 납부액을 볼 때는 건강보험료와 장기요양보험료를 합쳐서 확인해야 합니다.",
  },
  {
    question: "연봉을 입력하면 정확한 건강보험료가 나오나요?",
    answer: "연봉 입력 결과는 보수월액을 연봉의 12분의 1로 단순 환산한 추정값입니다. 실제 건강보험료는 비과세 수당, 상여, 보수월액 신고, 정산 방식에 따라 달라질 수 있습니다.",
  },
  {
    question: "지역가입자 건강보험료는 왜 추정으로 표시하나요?",
    answer: "지역가입자는 소득뿐 아니라 재산, 전월세, 자동차, 세대 구성, 감면 여부가 함께 반영됩니다. 같은 연소득이라도 재산과 세대 조건에 따라 보험료가 달라질 수 있어 계산기 결과는 간이 추정으로 안내해야 합니다.",
  },
  {
    question: "퇴직하면 건강보험료가 바로 지역가입자로 바뀌나요?",
    answer: "퇴직 후에는 피부양자 등재, 임의계속가입, 지역가입자 전환 가능성을 확인해야 합니다. 어떤 방식이 유리한지는 퇴직 전 직장가입자 보험료와 퇴직 후 소득·재산 조건에 따라 달라집니다.",
  },
  {
    question: "월급 외 금융소득이나 임대소득이 있으면 건강보험료가 늘어나나요?",
    answer: "직장가입자도 보수 외 소득이 일정 기준을 넘으면 소득월액보험료가 추가될 수 있습니다. 계산기에서는 연 2,000만 원 초과 입력 시 별도 확인 경고를 표시하고, 정확한 금액은 공단 조회를 안내합니다.",
  },
  {
    question: "건강보험료는 국민연금과 같이 계산되나요?",
    answer: "아니요. 건강보험료와 국민연금은 별도 제도이며 요율과 상한 기준도 다릅니다. 월급 실수령액을 볼 때는 국민연금, 건강보험, 장기요양, 고용보험을 함께 차감하므로 연봉 계산기와 같이 보는 것이 좋습니다.",
  },
];

export const HEALTH_INSURANCE_SEO = {
  title: "건강보험료 계산기 2026 | 직장가입자·지역가입자 월 보험료 계산",
  description:
    "2026년 건강보험료율 7.19%와 장기요양보험료율 13.14%를 반영해 직장가입자 건강보험료, 회사 부담분, 지역가입자 간이 보험료를 계산합니다.",
  intro: [
    "건강보험료는 월급 실수령액을 볼 때 가장 먼저 빠지는 고정 공제 항목 중 하나입니다. 연봉이 오르거나 이직 제안을 받았을 때 세전 금액만 비교하면 실제 통장에 남는 금액을 놓치기 쉽습니다. 특히 2026년에는 건강보험료율과 장기요양보험료율이 함께 바뀌었기 때문에, 월급 기준으로 얼마가 빠지는지 다시 계산해볼 필요가 있습니다.",
    "직장가입자의 건강보험료는 보수월액에 건강보험료율을 곱해 계산하고, 근로자와 회사가 절반씩 부담합니다. 이 계산기는 2026년 건강보험료율 7.19%, 근로자 부담 3.595%, 장기요양보험료율 건강보험료 대비 13.14%를 적용해 월 건강보험료와 장기요양보험료를 분리해서 보여줍니다. 회사가 별도로 부담하는 금액도 함께 보면 총 인건비 구조를 이해하기 쉽습니다.",
    "지역가입자는 직장가입자보다 계산 구조가 복잡합니다. 사업소득, 금융소득, 연금소득 같은 소득뿐 아니라 재산, 전월세, 자동차, 세대 구성, 감면 여부가 함께 반영될 수 있습니다. 그래서 이 페이지의 지역가입자 결과는 정확한 고지액이 아니라 퇴직이나 프리랜서 전환 전에 월 고정비를 가늠하기 위한 간이 추정값으로 읽어야 합니다.",
    "퇴직을 앞두고 있다면 건강보험료는 은퇴 생활비에서 생각보다 큰 변수입니다. 퇴직 후에는 피부양자 등재, 임의계속가입, 지역가입자 전환 가능성을 확인해야 하며, 같은 소득이라도 재산 조건에 따라 부담이 달라질 수 있습니다. 계산 결과가 높게 나온다면 국민건강보험공단 공식 조회와 상담을 통해 실제 자격과 고지액을 반드시 확인하는 것이 좋습니다.",
  ],
  inputPoints: [
    "월 보수월액 또는 연봉을 입력해 직장가입자 건강보험료와 장기요양보험료를 확인할 수 있습니다.",
    "지역가입자 소득·재산 조건을 넣어 퇴직 후 또는 프리랜서 전환 후 월 부담을 간이 추정할 수 있습니다.",
    "퇴직 전 직장가입자 부담과 퇴직 후 지역가입자 부담, 임의계속가입 시나리오를 한 번에 비교할 수 있습니다.",
  ],
  criteria: [
    "직장가입자 계산은 2026년 건강보험료율 7.19%, 근로자 부담 3.595%를 기준으로 합니다.",
    "장기요양보험료는 건강보험료에 2026년 장기요양보험료율 13.14%를 곱해 계산합니다.",
    "연봉 입력값은 12개월로 나눈 보수월액 추정이므로 실제 신고 보수월액과 다를 수 있습니다.",
    "지역가입자와 퇴직 전환 결과는 실제 고지액이 아니라 입력값 기반 간이 추정입니다.",
  ],
  related: [
    { href: "/tools/salary/", label: "연봉 인상 계산기" },
    { href: "/tools/retirement/", label: "퇴직금 계산기" },
    { href: "/tools/national-pension-calculator/", label: "국민연금 예상 수령액 계산기" },
    { href: "/tools/early-retirement-age/", label: "조기 은퇴 가능 나이 계산기" },
    { href: "/reports/worker-retirement-reality-2026/", label: "직장인 은퇴 준비 실태 분석" },
  ],
};
