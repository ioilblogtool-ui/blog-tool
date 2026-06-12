export type PnceiInsuranceType = "employee" | "local" | "mixed";
export type PnceiJudgeMode = "premium" | "income";
export type PnceiBirthType = "single" | "twin" | "triplet_plus";
export type PnceiChildOrder = "first" | "second" | "third_plus";
export type PnceiRegion = "seoul" | "gyeonggi" | "incheon" | "busan" | "daegu" | "daejeon" | "gwangju" | "local";
export type PnceiSourceBadge = "공식" | "추정" | "확인 필요";

export interface PnceiThreshold {
  year: number;
  householdSize: number;
  medianIncome150: number;
  employeePremiumLimit: number;
  localPremiumLimit: number;
  mixedPremiumLimit: number | null;
  sourceBadge: PnceiSourceBadge;
  sourceLabel: string;
}

export interface PnceiOption {
  key: string;
  label: string;
  description: string;
}

export interface PnceiExceptionReason {
  key: string;
  label: string;
  description: string;
  resultMessage: string;
}

export interface PnceiDefaultInput {
  judgeMode: PnceiJudgeMode;
  region: PnceiRegion;
  householdSize: number;
  insuranceType: PnceiInsuranceType;
  motherPremium: number;
  spousePremium: number;
  monthlyIncome: number;
  dualIncome: boolean;
  birthType: PnceiBirthType;
  childOrder: PnceiChildOrder;
  exceptionReasonKeys: string[];
}

export const PNCEI_DEFAULT_INPUT: PnceiDefaultInput = {
  judgeMode: "premium",
  region: "seoul",
  householdSize: 3,
  insuranceType: "employee",
  motherPremium: 180000,
  spousePremium: 90000,
  monthlyIncome: 6500000,
  dualIncome: true,
  birthType: "single",
  childOrder: "first",
  exceptionReasonKeys: [],
};

export const PNCEI_THRESHOLDS_2026: PnceiThreshold[] = [
  {
    year: 2026,
    householdSize: 1,
    medianIncome150: 3847000,
    employeePremiumLimit: 138780,
    localPremiumLimit: 68641,
    mixedPremiumLimit: null,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 2,
    medianIncome150: 6299000,
    employeePremiumLimit: 229357,
    localPremiumLimit: 164508,
    mixedPremiumLimit: 232890,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 3,
    medianIncome150: 8039000,
    employeePremiumLimit: 290169,
    localPremiumLimit: 240352,
    mixedPremiumLimit: 296127,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 4,
    medianIncome150: 9743000,
    employeePremiumLimit: 360410,
    localPremiumLimit: 322443,
    mixedPremiumLimit: 374300,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 5,
    medianIncome150: 11336000,
    employeePremiumLimit: 410439,
    localPremiumLimit: 378691,
    mixedPremiumLimit: 432308,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 6,
    medianIncome150: 12834000,
    employeePremiumLimit: 490306,
    localPremiumLimit: 473662,
    mixedPremiumLimit: 535512,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 7,
    medianIncome150: 14273000,
    employeePremiumLimit: 535512,
    localPremiumLimit: 525833,
    mixedPremiumLimit: 584741,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 8,
    medianIncome150: 15712000,
    employeePremiumLimit: 584741,
    localPremiumLimit: 579249,
    mixedPremiumLimit: 634423,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 9,
    medianIncome150: 17151000,
    employeePremiumLimit: 634423,
    localPremiumLimit: 628429,
    mixedPremiumLimit: 712921,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
  {
    year: 2026,
    householdSize: 10,
    medianIncome150: 18590000,
    employeePremiumLimit: 712921,
    localPremiumLimit: 697282,
    mixedPremiumLimit: 838330,
    sourceBadge: "공식",
    sourceLabel: "송파구 보건소 2026년 건강보험료 본인부담금 기준중위소득 150% 판정기준",
  },
];

export const PNCEI_REGION_OPTIONS: PnceiOption[] = [
  { key: "seoul", label: "서울", description: "구별 보건소 기준 확인 필요" },
  { key: "gyeonggi", label: "경기", description: "시군별 확대지원 확인 필요" },
  { key: "incheon", label: "인천", description: "구별 보건소 기준 확인 필요" },
  { key: "busan", label: "부산", description: "광역시 기준 참고" },
  { key: "daegu", label: "대구", description: "광역시 기준 참고" },
  { key: "daejeon", label: "대전", description: "구별 기준 확인 필요" },
  { key: "gwangju", label: "광주", description: "광역시 기준 참고" },
  { key: "local", label: "그 외 지역", description: "거주지 보건소 기준 확인" },
];

export const PNCEI_INSURANCE_OPTIONS: PnceiOption[] = [
  { key: "employee", label: "직장가입자", description: "직장 건강보험료 기준" },
  { key: "local", label: "지역가입자", description: "지역 건강보험료 기준" },
  { key: "mixed", label: "혼합", description: "직장+지역 혼합 세대 기준" },
];

export const PNCEI_BIRTH_TYPE_OPTIONS: PnceiOption[] = [
  { key: "single", label: "단태아", description: "아이 1명 출산 기준" },
  { key: "twin", label: "쌍태아", description: "쌍둥이 출산 기준" },
  { key: "triplet_plus", label: "삼태아 이상", description: "세쌍둥이 이상 기준" },
];

export const PNCEI_CHILD_ORDER_OPTIONS: PnceiOption[] = [
  { key: "first", label: "첫째아", description: "첫 출산 기준" },
  { key: "second", label: "둘째아", description: "둘째 출산 기준" },
  { key: "third_plus", label: "셋째아 이상", description: "셋째 이상 출산 기준" },
];

export const PNCEI_EXCEPTION_REASONS: PnceiExceptionReason[] = [
  {
    key: "multiple_birth",
    label: "다태아",
    description: "쌍태아·삼태아 이상은 서비스 기간과 지원 기준이 달라질 수 있습니다.",
    resultMessage: "다태아는 서비스 기간과 제공 인력 기준이 달라질 수 있어 보건소 확인이 필요합니다.",
  },
  {
    key: "premature_or_congenital",
    label: "미숙아·선천성이상아",
    description: "입원·퇴원일 기준으로 신청 기간이 달라질 수 있습니다.",
    resultMessage: "미숙아·선천성이상아는 신청 기간과 지원 기준을 별도로 확인하세요.",
  },
  {
    key: "rare_disease",
    label: "희귀난치성질환 산모",
    description: "예외지원 대상 여부를 확인해야 합니다.",
    resultMessage: "희귀난치성질환 산모는 예외지원 대상 여부를 보건소에서 확인하세요.",
  },
  {
    key: "disabled",
    label: "장애 산모·신생아",
    description: "장애 산모 또는 장애 신생아는 예외지원 가능성이 있습니다.",
    resultMessage: "장애 산모·신생아는 예외지원 또는 추가지원 여부를 확인하세요.",
  },
  {
    key: "immigrant_or_single_mother",
    label: "결혼이민·미혼모",
    description: "지자체 기준에 따라 예외지원 확인이 필요할 수 있습니다.",
    resultMessage: "결혼이민·미혼모 가정은 지자체 예외지원 기준을 확인하세요.",
  },
];

export const PNCEI_REFERENCE_CARDS = [
  {
    href: "https://www.songpa.go.kr/ehealth/contents.do?key=4569",
    source: "송파구 보건소",
    title: "2026년 건강보험료 본인부담금 150% 판정기준",
    desc: "가구원 수별 소득기준과 직장·지역·혼합 건강보험료 기준표를 확인할 수 있습니다.",
  },
  {
    href: "https://www.guro.go.kr/health/contents.do?key=1329",
    source: "구로구 보건소",
    title: "산모·신생아 건강관리 지원 대상",
    desc: "가형, 통합형, 라형 구분과 모든 출산가정 지원 안내를 확인할 수 있습니다.",
  },
  {
    href: "https://www.bokjiro.go.kr/",
    source: "복지로",
    title: "복지서비스 신청 확인",
    desc: "실제 신청과 최종 자격 판정은 복지로와 거주지 보건소 안내를 기준으로 확인합니다.",
  },
];

export const PNCEI_RELATED_LINKS = [
  { href: "/tools/postnatal-care-cost/", label: "산후도우미 본인부담금 계산하기" },
  { href: "/reports/postnatal-care-comparison-2026/", label: "산후도우미 vs 산후조리원 비교" },
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 2주 비용 보기" },
  { href: "/tools/birth-support-money/", label: "지역별 출산지원금 계산하기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "복지급여 가능성 확인하기" },
];

export const PNCEI_FAQ = [
  {
    question: "산후도우미 지원금은 누구나 받을 수 있나요?",
    answer:
      "2026년 공개 기준에서는 모든 출산가정이 지원 대상이지만 소득기준별로 국가지원금이 차등 적용되고 본인부담금이 있습니다. 자격확인 가구는 가형, 기준중위소득 150% 이하는 통합형, 150% 초과는 라형으로 구분됩니다.",
  },
  {
    question: "산후도우미 소득기준은 월급으로 보나요, 건강보험료로 보나요?",
    answer:
      "실무에서는 건강보험료 본인부담금 기준표로 판단하는 경우가 많습니다. 월소득은 참고로 볼 수 있지만 실제 신청에서는 직장가입자, 지역가입자, 혼합 세대별 건강보험료 기준과 자격확인 여부가 중요합니다.",
  },
  {
    question: "맞벌이 부부는 건강보험료를 어떻게 합산하나요?",
    answer:
      "공개 안내 기준으로 맞벌이 부부는 건강보험료가 낮은 배우자의 보험료를 50%만 합산합니다. 다만 직장가입자-직장가입자, 지역가입자-지역가입자 기준 안내가 있어 혼합 세대는 보건소 확인이 필요합니다.",
  },
  {
    question: "건강보험료 기준에 장기요양보험료가 포함되나요?",
    answer:
      "송파구 보건소의 2026년 기준표는 노인장기요양보험료 미포함 금액이라고 안내합니다. 계산기에 입력할 때도 건강보험료 본인부담금 기준으로 입력하고, 장기요양보험료는 제외해 확인하는 편이 안전합니다.",
  },
  {
    question: "기준중위소득 150%를 넘으면 지원을 못 받나요?",
    answer:
      "150% 초과 가구도 라형으로 구분될 수 있고, 지원금은 소득 구간에 따라 달라질 수 있습니다. 둘째 이상, 다태아, 미숙아, 희귀난치성질환 산모, 장애 산모·신생아, 결혼이민 산모, 미혼모 등은 예외지원 여부를 확인해야 합니다.",
  },
  {
    question: "지원 가능하면 실제 본인부담금은 얼마인가요?",
    answer:
      "본인부담금은 소득 구간뿐 아니라 태아 유형, 출산 순위, 서비스 기간, 지자체 추가지원, 제공기관 추가비에 따라 달라집니다. 이 페이지에서는 소득기준을 먼저 판단하고 산후도우미 비용 계산기로 이어서 계산하도록 설계했습니다.",
  },
  {
    question: "건강보험료가 기준 근처이면 어떻게 해야 하나요?",
    answer:
      "기준의 95~105% 안팎이면 경계 구간으로 표시합니다. 보험료 산정월, 장기요양보험료 포함 여부, 맞벌이 합산, 세대 구성에 따라 달라질 수 있으므로 신청 전 보건소에서 최신 기준표로 확인해야 합니다.",
  },
  {
    question: "산후도우미 신청은 언제 해야 하나요?",
    answer:
      "일반적으로 출산 예정일 40일 전부터 출산 후 60일 이내 신청 안내가 많이 쓰입니다. 미숙아 또는 선천성 이상아 입원 등 특수한 경우에는 퇴원일 기준으로 달라질 수 있으므로 거주지 보건소 기준을 확인해야 합니다.",
  },
];

export const PNCEI_SEO = {
  title: "산후도우미 지원금 소득기준 계산기 2026 | 건강보험료·기준중위소득 150%",
  description:
    "가구원 수와 건강보험료를 입력해 2026년 산후도우미 정부지원 소득기준, 기준중위소득 150% 이하 여부, 예외지원 확인 포인트를 계산합니다.",
};
