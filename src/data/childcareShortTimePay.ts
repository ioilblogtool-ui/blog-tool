export type CompanyPayMode = "AUTO" | "MANUAL";

export interface ChildcareShortTimePayPolicy {
  year: number;
  sourceCheckedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  firstTenHoursCapWage: number;
  extraHoursCapWage: number;
  minimumBaseWage: number;
  minWeeklyHoursAfter: number;
  maxWeeklyHoursAfter: number;
  defaultWeeklyHoursBefore: number;
  defaultWeeklyHoursAfter: number;
}

export interface ChildcareShortTimePayInput {
  monthlyOrdinaryWage: number;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  plannedMonths: number;
  companyPayMode: CompanyPayMode;
  manualCompanyPay: number | null;
}

export interface ChildcareShortTimePreset {
  label: string;
  weeklyHoursBefore: number;
  weeklyHoursAfter: number;
  description: string;
}

export interface ChildcareShortTimeRelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface ChildcareShortTimeReferenceLink {
  href: string;
  label: string;
  description: string;
}

export interface ChildcareShortTimeFaq {
  question: string;
  answer: string;
}

export const CHILDCARE_SHORT_TIME_PAY_META = {
  slug: "childcare-short-time-pay-calculator",
  title: "육아기 근로시간 단축 급여 계산기",
  seoTitle: "육아기 근로시간 단축 급여 계산기｜단축근무 월급·고용보험 급여 예상",
  description:
    "월 통상임금과 단축 전후 주 근로시간을 입력하면 회사 지급 임금, 고용보험 육아기 근로시간 단축 급여, 예상 월수령액과 기존 월급 대비 변화를 계산합니다.",
  updatedAt: "2026-06-20",
} as const;

export const CHILDCARE_SHORT_TIME_PAY_POLICY: ChildcareShortTimePayPolicy = {
  year: 2026,
  sourceCheckedAt: "2026-06-20",
  sourceLabel: "고용24 육아기 근로시간 단축 급여 신청 안내",
  sourceUrl: "https://www.work24.go.kr/",
  firstTenHoursCapWage: 2_500_000,
  extraHoursCapWage: 1_600_000,
  minimumBaseWage: 500_000,
  minWeeklyHoursAfter: 15,
  maxWeeklyHoursAfter: 35,
  defaultWeeklyHoursBefore: 40,
  defaultWeeklyHoursAfter: 30,
};

export const DEFAULT_CHILDCARE_SHORT_TIME_INPUT: ChildcareShortTimePayInput = {
  monthlyOrdinaryWage: 3_000_000,
  weeklyHoursBefore: 40,
  weeklyHoursAfter: 30,
  plannedMonths: 12,
  companyPayMode: "AUTO",
  manualCompanyPay: null,
};

export const CHILDCARE_SHORT_TIME_PRESETS: ChildcareShortTimePreset[] = [
  {
    label: "40→35",
    weeklyHoursBefore: 40,
    weeklyHoursAfter: 35,
    description: "하루 1시간 정도 줄이는 가벼운 단축",
  },
  {
    label: "40→30",
    weeklyHoursBefore: 40,
    weeklyHoursAfter: 30,
    description: "최초 10시간 보전 구간만 적용되는 대표 사례",
  },
  {
    label: "40→25",
    weeklyHoursBefore: 40,
    weeklyHoursAfter: 25,
    description: "최초 10시간과 추가 5시간을 함께 반영",
  },
  {
    label: "40→20",
    weeklyHoursBefore: 40,
    weeklyHoursAfter: 20,
    description: "반일 근무에 가까운 강한 단축",
  },
  {
    label: "40→15",
    weeklyHoursBefore: 40,
    weeklyHoursAfter: 15,
    description: "제도상 하한 근로시간에 가까운 단축",
  },
];

export const CHILDCARE_SHORT_TIME_WAGE_PRESETS = [
  { label: "250만원", value: 2_500_000 },
  { label: "300만원", value: 3_000_000 },
  { label: "400만원", value: 4_000_000 },
  { label: "500만원", value: 5_000_000 },
] as const;

export const CHILDCARE_SHORT_TIME_RELATED_LINKS: ChildcareShortTimeRelatedLink[] = [
  {
    href: "/tools/parental-leave-pay/",
    label: "육아휴직 급여 계산기",
    description: "휴직을 선택했을 때 월별 육아휴직 급여와 총액을 계산합니다.",
  },
  {
    href: "/tools/parental-leave-short-work-calculator/",
    label: "육아휴직 + 육아기 단축근무 계산기",
    description: "남은 육아휴직·단축근무 기간과 18개월 가능 여부를 함께 계산합니다.",
  },
  {
    href: "/tools/single-parental-leave-total/",
    label: "한 명만 육아휴직 총수령액 계산기",
    description: "부모급여, 아동수당, 첫만남이용권까지 합산한 가구 현금흐름을 봅니다.",
  },
  {
    href: "/tools/six-plus-six/",
    label: "6+6 육아휴직 급여 계산기",
    description: "부모가 함께 육아휴직할 때 적용되는 급여 구조를 월별로 계산합니다.",
  },
  {
    href: "/tools/birth-support-total/",
    label: "출산~육아 지원금 총액 계산기",
    description: "출산 이후 받을 수 있는 주요 지원금을 한 화면에서 합산합니다.",
  },
];

export const CHILDCARE_SHORT_TIME_REFERENCE_LINKS: ChildcareShortTimeReferenceLink[] = [
  {
    href: "https://www.work24.go.kr/",
    label: "고용24",
    description: "육아기 근로시간 단축 급여 신청, 고용보험 자격, 신청 서류를 확인합니다.",
  },
  {
    href: "https://www.moel.go.kr/",
    label: "고용노동부",
    description: "육아휴직·육아기 근로시간 단축 제도와 고용노동 정책 공지를 확인합니다.",
  },
];

export const CHILDCARE_SHORT_TIME_CHECKLIST = [
  {
    title: "통상임금 기준 확인",
    body: "계산기에는 단축 전 월 통상임금을 넣습니다. 기본급과 고정수당 포함 여부는 회사 급여 규정에 따라 달라질 수 있습니다.",
  },
  {
    title: "단축 후 주 근로시간 확인",
    body: "육아기 근로시간 단축은 일반적으로 단축 후 주 15시간 이상 35시간 이하 범위를 확인해야 합니다.",
  },
  {
    title: "회사 지급액과 고용보험 급여 구분",
    body: "단축 후 회사가 지급하는 임금과 고용보험에서 지급하는 급여는 서로 다른 기준으로 계산됩니다.",
  },
  {
    title: "신청 전 회사 안내 금액 반영",
    body: "회사에서 단축 후 월급을 별도로 안내받았다면 직접 입력 모드로 총 월수령 예상액을 다시 확인하세요.",
  },
] as const;

export const CHILDCARE_SHORT_TIME_FAQ: ChildcareShortTimeFaq[] = [
  {
    question: "육아기 근로시간 단축 급여는 누가 받을 수 있나요?",
    answer:
      "육아기 근로시간 단축을 사용하고 고용보험 급여 요건을 충족한 근로자가 신청할 수 있습니다. 실제 수급 여부는 고용보험 가입 이력, 사용 기간, 회사 확인, 신청 시점의 심사 결과에 따라 달라집니다.",
  },
  {
    question: "월 통상임금은 세전 월급을 넣으면 되나요?",
    answer:
      "계산기에는 단축 전 월 통상임금을 입력하는 것이 기본입니다. 통상임금은 기본급 전체와 항상 같지 않을 수 있고, 고정수당 포함 여부가 회사 규정에 따라 달라질 수 있습니다.",
  },
  {
    question: "단축 후 회사 월급은 어떻게 계산하나요?",
    answer:
      "자동 계산 모드에서는 통상임금에 단축 후 주 근로시간 비율을 곱합니다. 예를 들어 40시간에서 30시간으로 줄이면 회사 지급 예상액은 통상임금의 75%로 계산합니다.",
  },
  {
    question: "회사 지급액 직접 입력은 언제 쓰나요?",
    answer:
      "회사 인사팀에서 단축 후 월급을 별도로 안내했거나 수당 반영 방식이 단순 시간 비례와 다를 때 사용합니다. 직접 입력해도 고용보험 급여는 통상임금과 단축시간 기준으로 계산합니다.",
  },
  {
    question: "최초 10시간 단축분은 왜 따로 계산하나요?",
    answer:
      "육아기 근로시간 단축 급여는 줄어든 시간 중 최초 10시간과 그 이후 시간을 다른 보전율과 상한 기준으로 나누어 계산합니다. 그래서 40→30시간과 40→20시간은 급여 구조가 다르게 보입니다.",
  },
  {
    question: "주 40시간에서 30시간으로 줄이면 얼마를 받나요?",
    answer:
      "월 통상임금 300만원 예시에서는 회사 지급 예상액 225만원, 고용보험 급여 예상액 62.5만원을 더해 월수령 예상액이 약 287.5만원으로 계산됩니다.",
  },
  {
    question: "단축 후 주 15시간까지 줄일 수 있나요?",
    answer:
      "일반적으로 육아기 근로시간 단축은 단축 후 주 15시간 이상 35시간 이하 범위를 확인해야 합니다. 실제 근무표와 신청 가능 여부는 회사와 고용센터에서 확인하는 것이 안전합니다.",
  },
  {
    question: "육아휴직 급여와 동시에 받을 수 있나요?",
    answer:
      "같은 기간에 전일 육아휴직과 근로시간 단축을 동시에 적용해 각각 급여를 받는 구조는 아닙니다. 휴직 기간 급여와 단축근무 기간 급여는 사용 방식과 기간을 나누어 봐야 합니다.",
  },
  {
    question: "실제 지급액과 계산 결과가 다를 수 있나요?",
    answer:
      "네. 이 계산기는 사전 모의계산입니다. 고용보험 심사, 회사 통상임금 산정, 실제 근무시간, 신청 기간, 급여 지급월에 따라 실제 금액과 차이가 날 수 있습니다.",
  },
  {
    question: "단축근무가 육아휴직보다 현금흐름에 유리한가요?",
    answer:
      "통상임금과 단축 후 근로시간에 따라 달라집니다. 단축근무는 회사 임금이 일부 유지되므로 월 현금흐름 방어에 유리한 경우가 많지만, 돌봄 시간이 더 필요한 경우에는 육아휴직 급여도 함께 비교해야 합니다.",
  },
] as const;

export const CHILDCARE_SHORT_TIME_SEO_INTRO = [
  "육아기 근로시간 단축은 고용보험 지원 제도이면서 동시에 실제 월급이 달라지는 생활비 문제입니다. 주 40시간에서 30시간으로 줄이면 회사 월급이 얼마나 줄고, 고용보험에서 보전하는 급여가 얼마인지 바로 계산할 수 있어야 실제 신청 여부를 판단하기 쉽습니다.",
  "이 계산기는 월 통상임금, 단축 전 주 근로시간, 단축 후 주 근로시간을 기준으로 회사 지급 예상 임금과 고용보험 육아기 근로시간 단축 급여를 분리해 보여줍니다. 단축한 시간 중 최초 10시간과 추가 단축시간을 나누어 계산하므로 단순히 월급을 비율로 줄인 값보다 구조를 더 정확하게 이해할 수 있습니다.",
  "단축 후 회사 지급액은 사업장 임금 규정, 통상임금 범위, 고정수당 처리 방식에 따라 달라질 수 있습니다. 그래서 자동 계산 외에 회사가 안내한 단축 후 월급을 직접 입력하는 모드도 함께 제공합니다. 직접 입력 모드를 쓰면 실제 회사 안내 금액에 더 가까운 월수령 예상액을 확인할 수 있습니다.",
  "고용보험 급여는 신청 후 심사를 거쳐 지급됩니다. 이 페이지의 결과는 사전 모의계산이며 확정 지급액은 아닙니다. 신청 전에는 고용24, 고용노동부 안내, 회사 인사팀의 통상임금 산정 기준을 함께 확인하는 것이 안전합니다.",
] as const;

export const CHILDCARE_SHORT_TIME_INPUT_POINTS = [
  "월 통상임금과 주 근로시간만으로 단축근무 월수령 예상액을 바로 계산합니다.",
  "회사 지급 예상 임금과 고용보험 급여를 분리해서 보여줍니다.",
  "최초 10시간 단축분과 추가 단축시간 급여를 따로 확인할 수 있습니다.",
  "주 35시간, 30시간, 25시간, 20시간, 15시간 시나리오를 같은 통상임금으로 비교합니다.",
] as const;

export const CHILDCARE_SHORT_TIME_CRITERIA = [
  "2026년 기준으로 공개된 상한 구조를 반영한 사전 모의계산입니다.",
  "월 통상임금과 단축 전후 주 근로시간을 기준으로 계산합니다.",
  "회사 지급 예상액은 기본적으로 단순 시간 비례 방식이며, 직접 입력 모드를 선택할 수 있습니다.",
  "고용보험 급여는 최초 10시간 단축분과 추가 단축시간을 나누어 계산합니다.",
  "상한과 하한 기준은 급여 기준액에 먼저 적용한 뒤 단축시간 비율을 반영합니다.",
  "실제 지급액은 고용보험 심사와 회사 임금 산정 방식에 따라 달라질 수 있습니다.",
] as const;
