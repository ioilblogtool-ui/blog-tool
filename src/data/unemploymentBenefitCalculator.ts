export type EmploymentInsurancePeriodId =
  | "under-1y"
  | "1y-3y"
  | "3y-5y"
  | "5y-10y"
  | "over-10y";

export type LeaveReasonId =
  | "recommended-resignation"
  | "contract-expired"
  | "layoff"
  | "business-closure"
  | "voluntary"
  | "voluntary-with-just-cause"
  | "fired-for-cause"
  | "unknown";

export type EligibilityStatus = "ok" | "check" | "risk";

export interface UnemploymentBenefitPreset {
  id: string;
  label: string;
  summary: string;
  input: {
    age: number;
    insurancePeriodId: EmploymentInsurancePeriodId;
    leaveReasonId: LeaveReasonId;
    hasInsuredDays180: boolean;
    threeMonthWageTotal: number;
    threeMonthTotalDays: number;
    monthlyLivingCost: number;
    retirementPay: number;
    emergencyFund: number;
  };
}

export interface LeaveReasonOption {
  id: LeaveReasonId;
  label: string;
  status: EligibilityStatus;
  note: string;
}

export interface RelatedUnemploymentLink {
  href: string;
  label: string;
  description: string;
}

export interface UnemploymentBenefitFaq {
  question: string;
  answer: string;
}

export const UNEMPLOYMENT_BENEFIT_2026 = {
  dailyCap: 68100,
  dailyFloor: 66048,
  wageReplacementRate: 0.6,
  minimumWage: 10320,
  standardWorkHours: 8,
  applicationMonthsLimit: 12,
};

export const EMPLOYMENT_INSURANCE_PERIODS = [
  { id: "under-1y", label: "1년 미만", index: 0 },
  { id: "1y-3y", label: "1년 이상~3년 미만", index: 1 },
  { id: "3y-5y", label: "3년 이상~5년 미만", index: 2 },
  { id: "5y-10y", label: "5년 이상~10년 미만", index: 3 },
  { id: "over-10y", label: "10년 이상", index: 4 },
] as const;

export const BENEFIT_DAYS_TABLE = {
  under50: [120, 150, 180, 210, 240],
  over50OrDisabled: [120, 180, 210, 240, 270],
};

export const LEAVE_REASONS: LeaveReasonOption[] = [
  {
    id: "recommended-resignation",
    label: "권고사직",
    status: "ok",
    note: "비자발적 이직으로 인정될 가능성이 높은 유형입니다.",
  },
  {
    id: "contract-expired",
    label: "계약만료",
    status: "check",
    note: "계약 갱신 여부와 실제 이직 사유 확인이 필요합니다.",
  },
  {
    id: "layoff",
    label: "정리해고",
    status: "ok",
    note: "회사 사정에 따른 비자발적 이직으로 볼 수 있습니다.",
  },
  {
    id: "business-closure",
    label: "폐업·사업장 종료",
    status: "ok",
    note: "사업장 사정에 따른 이직으로 볼 수 있습니다.",
  },
  {
    id: "voluntary",
    label: "자발적 퇴사",
    status: "risk",
    note: "원칙적으로 수급이 어렵고 정당한 이직 사유 확인이 필요합니다.",
  },
  {
    id: "voluntary-with-just-cause",
    label: "자발적 퇴사이나 정당한 사유 있음",
    status: "check",
    note: "임금체불, 괴롭힘, 통근 곤란 등 사실관계 확인이 필요합니다.",
  },
  {
    id: "fired-for-cause",
    label: "중대한 귀책 해고",
    status: "risk",
    note: "수급자격 제한 사유에 해당할 수 있습니다.",
  },
  {
    id: "unknown",
    label: "아직 모름",
    status: "check",
    note: "이직확인서와 고용센터 상담으로 확인이 필요합니다.",
  },
];

export const UNEMPLOYMENT_BENEFIT_PRESETS: UnemploymentBenefitPreset[] = [
  {
    id: "salary-250-1y",
    label: "월급 250만 원·1년 근무",
    summary: "첫 이직 공백기 예상",
    input: {
      threeMonthWageTotal: 7500000,
      threeMonthTotalDays: 92,
      age: 32,
      insurancePeriodId: "1y-3y",
      leaveReasonId: "contract-expired",
      hasInsuredDays180: true,
      monthlyLivingCost: 2000000,
      retirementPay: 0,
      emergencyFund: 3000000,
    },
  },
  {
    id: "salary-350-3y",
    label: "월급 350만 원·3년 근무",
    summary: "일반 직장인 권고사직",
    input: {
      threeMonthWageTotal: 10500000,
      threeMonthTotalDays: 92,
      age: 38,
      insurancePeriodId: "3y-5y",
      leaveReasonId: "recommended-resignation",
      hasInsuredDays180: true,
      monthlyLivingCost: 2300000,
      retirementPay: 0,
      emergencyFund: 5000000,
    },
  },
  {
    id: "over-50-10y",
    label: "50세 이상·10년 근무",
    summary: "장기근속 퇴직자",
    input: {
      threeMonthWageTotal: 12000000,
      threeMonthTotalDays: 92,
      age: 52,
      insurancePeriodId: "over-10y",
      leaveReasonId: "layoff",
      hasInsuredDays180: true,
      monthlyLivingCost: 2800000,
      retirementPay: 0,
      emergencyFund: 8000000,
    },
  },
];

export const UNEMPLOYMENT_RELATED_LINKS: RelatedUnemploymentLink[] = [
  {
    href: "/tools/retirement/",
    label: "퇴직금 계산기",
    description: "퇴직금까지 합쳐 퇴사 후 생활비를 계산하세요.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령액 계산기",
    description: "퇴사 전 월급과 연봉 기준을 다시 확인하세요.",
  },
  {
    href: "/tools/negotiation/",
    label: "이직 계산기",
    description: "재취업 시 희망 연봉과 이직 손익을 계산하세요.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급액 계산기",
    description: "중도퇴사 후 세금 환급 가능성을 함께 확인하세요.",
  },
  {
    href: "/tools/welfare-benefit-eligibility/",
    label: "복지급여 수급 자격 계산기",
    description: "소득이 줄었다면 복지급여 가능성도 점검하세요.",
  },
];

export const UNEMPLOYMENT_FAQ: UnemploymentBenefitFaq[] = [
  {
    question: "실업급여는 월급의 몇 퍼센트를 받나요?",
    answer:
      "기본적으로 이직 전 평균임금의 60%를 기준으로 계산합니다. 다만 1일 상한액과 하한액이 있어 실제 구직급여일액은 그 범위 안에서 결정됩니다.",
  },
  {
    question: "2026년 실업급여 상한액과 하한액은 얼마인가요?",
    answer:
      "2026년 기준 구직급여일액은 1일 상한 68,100원, 하한 66,048원을 기준으로 계산합니다.",
  },
  {
    question: "실업급여 수급기간은 어떻게 정해지나요?",
    answer:
      "퇴사 당시 나이, 장애인 여부, 고용보험 가입기간에 따라 120일에서 270일까지 달라집니다.",
  },
  {
    question: "자진퇴사도 실업급여를 받을 수 있나요?",
    answer:
      "원칙적으로 자발적 퇴사는 수급이 어렵습니다. 다만 임금체불, 직장 내 괴롭힘, 통근 곤란 등 정당한 이직 사유가 있는 경우에는 고용센터 확인이 필요합니다.",
  },
  {
    question: "계약만료는 실업급여 대상인가요?",
    answer:
      "계약만료는 상황에 따라 실업급여 대상이 될 수 있습니다. 계약 갱신 여부, 회사와 근로자의 의사, 이직확인서 내용에 따라 달라질 수 있어 고용센터 확인이 필요합니다.",
  },
  {
    question: "실업급여 신청은 언제까지 해야 하나요?",
    answer:
      "구직급여는 이직일 다음 날부터 12개월 안에 수급해야 합니다. 소정급여일수가 남아 있어도 수급기간이 지나면 남은 일수를 받을 수 없으므로 빠르게 신청하는 것이 좋습니다.",
  },
  {
    question: "아르바이트를 하면 실업급여가 줄어드나요?",
    answer:
      "실업인정 기간 중 근로 제공이나 소득이 있으면 신고해야 합니다. 실제 지급 여부와 금액은 근로일수, 소득, 실업인정 결과에 따라 달라질 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 지급액이 다른 이유는 무엇인가요?",
    answer:
      "평균임금 산정 방식, 피보험단위기간, 퇴사 사유, 실업인정일수, 구직활동 인정 여부에 따라 실제 지급액이 달라질 수 있습니다.",
  },
];

export const UNEMPLOYMENT_SEO_CONTENT = {
  introTitle: "실업급여 계산기 2026 사용 기준",
  intro: [
    "실업급여는 고용보험에 가입한 근로자가 비자발적으로 실직한 뒤 재취업 활동을 하는 기간에 생활 안정을 돕기 위해 지급되는 급여입니다. 권고사직이나 계약만료, 정리해고를 앞두고 퇴사 후 생활비를 미리 가늠해보거나, 이미 퇴사한 뒤 신청 자격이 되는지 확인하려는 경우에 가장 먼저 찾는 제도입니다. 정식 명칭은 구직급여이며, 금액은 이직 전 평균임금의 60%를 기준으로 계산하되 1일 상한액과 하한액이 적용됩니다.",
    "2026년 기준 구직급여일액은 1일 상한 68,100원, 하한 66,048원을 기준으로 계산합니다. 평균임금이 낮으면 하한액이, 평균임금이 어느 정도 이상이면 상한액이 적용되어 실제 받는 금액이 평균임금의 60%와 정확히 일치하지 않는 경우가 많습니다. 수급기간(소정급여일수)은 퇴사 당시 나이와 고용보험 가입기간에 따라 120일에서 270일까지 달라집니다.",
    "이 계산기는 평균임금, 고용보험 가입기간, 나이, 퇴사 사유를 입력해 예상 구직급여액과 수급기간을 빠르게 확인하도록 만든 모의계산 도구입니다. 결과에서 상한·하한 중 어느 쪽이 적용됐는지를 함께 보면, 평균임금을 더 정확히 산정했을 때 결과가 얼마나 달라질 수 있는지 가늠하는 데 도움이 됩니다.",
    "다만 실제 수급 여부는 단순히 임금과 가입기간만으로 결정되지 않습니다. 비자발적 이직 여부, 피보험단위기간 180일 이상 충족, 근로 의사와 적극적인 재취업 활동까지 고용센터 심사와 실업인정 절차를 거쳐야 최종 확정됩니다. 이 계산기의 결과는 예상치이며, 정확한 수급 자격과 금액은 고용센터 상담 또는 고용보험 홈페이지에서 다시 확인해야 합니다.",
  ],
  inputPoints: [
    "최근 3개월 임금 총액과 총 일수를 입력하면 1일 평균임금을 자동 계산합니다.",
    "고용보험 가입기간과 나이, 장애인 여부를 바탕으로 소정급여일수를 추정합니다.",
    "퇴사 사유는 수급 가능성을 안내하기 위한 참고값이며 최종 판단은 고용센터 확인이 필요합니다.",
  ],
  criteria: [
    "실업급여는 평균임금 60%를 기준으로 하되 상한·하한액이 적용됩니다.",
    "2026년 기준 1일 상한액은 68,100원, 하한액은 66,048원입니다.",
    "소정급여일수는 50세 미만과 50세 이상 및 장애인, 고용보험 가입기간에 따라 달라집니다.",
    "피보험단위기간 180일 이상, 비자발적 이직, 재취업 활동은 주요 확인 조건입니다.",
  ],
};

