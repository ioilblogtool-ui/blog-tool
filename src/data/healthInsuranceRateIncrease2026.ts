export type HiriIncomeMode = "monthlyWage" | "annualSalary";
export type HiriViewMode = "employeeOnly" | "employeeAndEmployer" | "total";

export type HiriYearRule = {
  year: number;
  healthRate: number;
  employeeShareRate: number;
  employerShareRate: number;
  longTermCareRateOnHealthPremium: number;
  longTermCareRateByIncome: number;
  regionalPointUnitPrice: number;
};

export const HIRI_RATES: Record<"previous" | "current", HiriYearRule> = {
  previous: {
    year: 2025,
    healthRate: 0.0709,
    employeeShareRate: 0.03545,
    employerShareRate: 0.03545,
    longTermCareRateOnHealthPremium: 0.1295,
    longTermCareRateByIncome: 0.009182,
    regionalPointUnitPrice: 208.4,
  },
  current: {
    year: 2026,
    healthRate: 0.0719,
    employeeShareRate: 0.03595,
    employerShareRate: 0.03595,
    longTermCareRateOnHealthPremium: 0.1314,
    longTermCareRateByIncome: 0.009448,
    regionalPointUnitPrice: 211.5,
  },
};

export const HIRI_DEFAULT_INPUT = {
  incomeMode: "monthlyWage" as HiriIncomeMode,
  monthlyWage: 3_000_000,
  annualSalary: 36_000_000,
  viewMode: "employeeAndEmployer" as HiriViewMode,
};

export const HIRI_PRESETS = [
  { label: "월 250만원", monthlyWage: 2_500_000 },
  { label: "월 300만원", monthlyWage: 3_000_000 },
  { label: "월 400만원", monthlyWage: 4_000_000 },
  { label: "월 500만원", monthlyWage: 5_000_000 },
  { label: "월 700만원", monthlyWage: 7_000_000 },
];

export const HIRI_EXAMPLE_WAGES = [2_500_000, 3_000_000, 4_000_000, 5_000_000, 7_000_000];

export const HIRI_META = {
  title: "건강보험료 인상 계산기 2026 | 월급별 2025년 대비 증가액",
  description:
    "2026년 건강보험료율 7.19%와 장기요양보험료율 13.14%를 기준으로 2025년 대비 월 건강보험료 증가액과 연간 부담 변화를 계산합니다.",
  canonical: "/tools/health-insurance-rate-increase-2026/",
};

export const HIRI_SOURCES = [
  {
    label: "보건복지부 2026년 건강보험료율 7.19% 결정",
    url: "https://www.mohw.go.kr/gallery.es?act=view&bid=0003&list_no=379625&mid=a10505000000",
  },
  {
    label: "국민건강보험공단 보험료율 안내",
    url: "https://www.nhis.or.kr/english/wbheaa02500m01.do",
  },
  {
    label: "국민건강보험 EDI 2026년도 보험료율 인상 안내",
    url: "https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html",
  },
];

export const HIRI_FAQ = [
  {
    question: "2026년 건강보험료율은 얼마인가요?",
    answer:
      "2026년 건강보험료율은 보수월액 기준 7.19%입니다. 직장가입자는 근로자와 사업주가 각각 3.595%씩 부담하는 구조로 계산합니다.",
  },
  {
    question: "장기요양보험료도 같이 오르나요?",
    answer:
      "계산기에서는 2026년 장기요양보험료율을 건강보험료의 13.14%로 적용합니다. 2025년은 12.95% 기준으로 비교합니다.",
  },
  {
    question: "월급을 넣으면 실제 급여명세서 금액과 완전히 같나요?",
    answer:
      "보수월액, 비과세 항목, 정산, 감면 여부에 따라 급여명세서와 달라질 수 있습니다. 이 계산기는 2025년과 2026년 같은 보수월액을 가정한 인상분 확인용입니다.",
  },
  {
    question: "연봉 입력은 어떻게 계산하나요?",
    answer:
      "세전 연봉을 12개월로 나눈 값을 보수월액으로 보고 계산합니다. 실제 보수월액은 회사의 신고 기준과 비과세 항목에 따라 달라질 수 있습니다.",
  },
  {
    question: "사업주 부담분도 확인할 수 있나요?",
    answer:
      "네. 보기 옵션에서 근로자 부담만, 근로자와 사업주 분리, 총 부담 기준을 선택할 수 있습니다.",
  },
  {
    question: "지역가입자 인상분도 계산하나요?",
    answer:
      "이 페이지는 직장가입자 보수월액 기준 인상분이 핵심입니다. 지역가입자는 부과점수와 감면 조건이 달라 별도의 건강보험료 계산기를 이용하는 편이 좋습니다.",
  },
  {
    question: "왜 10원 단위로 절사하나요?",
    answer:
      "보험료는 실제 고지 과정에서 원 단위 처리와 정산이 달라질 수 있습니다. 계산기는 급여명세서에서 체감하기 쉬운 10원 단위 절사 방식으로 표시합니다.",
  },
];

export const HIRI_SEO_CONTENT = {
  intro: [
    "건강보험료는 월급에서 매달 빠지는 고정 비용이라 보험료율이 조금만 바뀌어도 1년 누적으로는 체감 차이가 생깁니다. 2026년에는 건강보험료율이 7.19%로 적용되고, 직장가입자는 근로자와 사업주가 각각 절반씩 부담합니다.",
    "이 계산기는 기존 건강보험료 계산기처럼 전체 보험료를 넓게 추정하는 도구가 아니라, 2025년과 2026년을 같은 보수월액으로 놓고 인상분만 빠르게 확인하도록 설계했습니다. 월급이 그대로일 때 매달 본인 부담이 얼마 늘어나는지, 연간으로는 얼마가 더 빠져나가는지 바로 볼 수 있습니다.",
    "장기요양보험료는 건강보험료에 연동되므로 건강보험료 인상과 장기요양보험료율 변화가 함께 반영됩니다. 그래서 단순히 건강보험료율 차이만 보는 것보다 급여명세서에서 실제로 보이는 합계 증가액에 더 가까운 비교가 가능합니다.",
    "회사 입장에서는 근로자 부담분과 같은 수준의 사업주 부담분도 함께 증가합니다. 보기 옵션을 바꾸면 근로자 본인 부담, 사업주 부담, 양쪽 합산 부담을 나눠 확인할 수 있어 인건비 시뮬레이션에도 활용할 수 있습니다.",
    "다만 실제 보험료는 보수월액 신고, 비과세 급여, 정산, 감면, 피부양자·지역가입자 전환 여부에 따라 달라질 수 있습니다. 최종 고지 금액은 국민건강보험공단 고지서와 회사 급여명세서를 기준으로 확인해야 합니다.",
  ],
  inputPoints: [
    "월 보수월액을 알고 있으면 월급 기준으로 입력하세요.",
    "연봉만 알고 있으면 세전 연봉을 입력하면 12개월로 나눠 계산합니다.",
    "비과세 식대, 차량보조금, 성과급 정산분은 실제 보수월액과 다를 수 있습니다.",
    "근로자와 사업주 부담을 함께 보면 회사 총 인건비 증가분을 추정할 수 있습니다.",
  ],
  criteria: [
    "2025년 건강보험료율 7.09%, 근로자 부담 3.545% 기준",
    "2026년 건강보험료율 7.19%, 근로자 부담 3.595% 기준",
    "2025년 장기요양보험료율 건강보험료 대비 12.95% 기준",
    "2026년 장기요양보험료율 건강보험료 대비 13.14% 기준",
  ],
  related: [
    { label: "건강보험료 계산기 2026", href: "/tools/health-insurance-premium-calculator/" },
    { label: "4대보험 계산기", href: "/tools/four-insurance-calculator/" },
    { label: "연봉 실수령액 계산기", href: "/tools/salary/" },
  ],
};

export function floorToTenWon(value: number): number {
  return Math.floor(Math.max(0, value) / 10) * 10;
}

export function calculateHiriPremium(monthlyWage: number, rule: HiriYearRule) {
  const employeeHealth = floorToTenWon(monthlyWage * rule.employeeShareRate);
  const employerHealth = floorToTenWon(monthlyWage * rule.employerShareRate);
  const employeeCare = floorToTenWon(employeeHealth * rule.longTermCareRateOnHealthPremium);
  const employerCare = floorToTenWon(employerHealth * rule.longTermCareRateOnHealthPremium);

  return {
    employee: {
      health: employeeHealth,
      care: employeeCare,
      total: employeeHealth + employeeCare,
    },
    employer: {
      health: employerHealth,
      care: employerCare,
      total: employerHealth + employerCare,
    },
    combined: {
      health: employeeHealth + employerHealth,
      care: employeeCare + employerCare,
      total: employeeHealth + employeeCare + employerHealth + employerCare,
    },
  };
}

export function calculateHiriIncrease(monthlyWage: number) {
  const previous = calculateHiriPremium(monthlyWage, HIRI_RATES.previous);
  const current = calculateHiriPremium(monthlyWage, HIRI_RATES.current);

  return {
    monthlyWage,
    previous,
    current,
    increase: {
      employee: current.employee.total - previous.employee.total,
      employer: current.employer.total - previous.employer.total,
      combined: current.combined.total - previous.combined.total,
    },
  };
}
