export type NationalPensionIncomeMode = "income" | "premium";
export type NationalPensionSubscriberType = "employee" | "regional";
export type NationalPensionClaimType = "early" | "normal" | "deferred";

export interface NationalPensionInput {
  currentAge: number;
  startYear: number;
  incomeMode: NationalPensionIncomeMode;
  monthlyIncome: number;
  monthlyPremium: number;
  endAge: number;
  subscriberType: NationalPensionSubscriberType;
  claimType: NationalPensionClaimType;
  deferYears: number;
  lifeExpectancy: number;
  targetMonthlyExpense: number;
  inflationRate: number;
  contributionGapYears: number;
}

export const NPC_RULES = {
  minContributionYears: 10,
  normalStartAge: 65,
  earlyStartAge: 60,
  maxDeferYears: 5,
  deferBonusPerMonth: 0.006,
  earlyDeductPerMonth: 0.005,
  incomeReplacementRate: 0.43,
  premiumRate2026: 0.095,
  aValue2026: 319.4,
  baseContributionYears: 40,
  maxEndAge: 60,
};

export const NPC_DEFAULT_INPUT: NationalPensionInput = {
  currentAge: 40,
  startYear: 2010,
  incomeMode: "income",
  monthlyIncome: 300,
  monthlyPremium: 14,
  endAge: 60,
  subscriberType: "employee",
  claimType: "normal",
  deferYears: 3,
  lifeExpectancy: 85,
  targetMonthlyExpense: 300,
  inflationRate: 2.5,
  contributionGapYears: 0,
};

export const NPC_INCOME_PRESETS = [
  { label: "200만원", value: 200 },
  { label: "300만원", value: 300 },
  { label: "400만원", value: 400 },
  { label: "500만원", value: 500 },
  { label: "600만원+", value: 600 },
];

export const NPC_LIFE_EXPECTANCY_PRESETS = [
  { label: "80세", value: 80 },
  { label: "85세", value: 85 },
  { label: "90세", value: 90 },
  { label: "95세", value: 95 },
];

export const NPC_FAQ = [
  {
    question: "국민연금은 몇 년 이상 내야 받을 수 있나요?",
    answer:
      "최소 가입기간 10년 이상이어야 노령연금 수급이 가능합니다. 10년 미만이면 노령연금 대신 반환일시금 대상이 될 수 있습니다.",
  },
  {
    question: "1969년 이후 출생자는 몇 세부터 받을 수 있나요?",
    answer:
      "1969년 이후 출생자는 정상 노령연금 개시 연령이 만 65세입니다. 조기노령연금은 만 60세부터, 연기연금은 최대 5년까지 늦출 수 있는 구조를 기준으로 계산합니다.",
  },
  {
    question: "조기노령연금과 연기연금 차이는 얼마나 나나요?",
    answer:
      "이 계산기는 조기 수령 시 매월 0.5% 감액, 연기 수령 시 매월 0.6% 증액 규칙을 반영합니다. 최대 5년 조기면 약 30% 감소, 최대 5년 연기면 약 36% 증가 구조입니다.",
  },
  {
    question: "계산기 결과가 실제 수령액과 다른 이유는 뭔가요?",
    answer:
      "실제 연금액은 개인별 가입 이력, 소득 재평가, A값 변동, 수급 시점 제도 변화에 따라 달라집니다. 이 도구는 빠른 비교용 추정 계산기이며 국민연금공단 공식 조회를 대체하지 않습니다.",
  },
  {
    question: "국민연금만으로 노후 생활비가 충분한가요?",
    answer:
      "대부분의 경우 국민연금은 기본 생활비 일부를 보완하는 성격에 가깝습니다. 목표 생활비와 비교해 부족분이 보인다면 퇴직연금, 개인연금, 추가 투자도 함께 계획하는 편이 현실적입니다.",
  },
];

export const NPC_GUIDE_POINTS = [
  "가입기간이 길수록 예상 연금액이 커지므로 중간 공백 기간을 줄이는 것이 중요합니다.",
  "조기노령연금은 현금흐름이 급할 때 유용하지만 월 수령액은 줄어듭니다.",
  "연기연금은 오래 받을 가능성이 높고 다른 소득원이 있을 때 유리할 수 있습니다.",
  "이 계산기는 2026년 기준 보험료율 9.5%, 소득대체율 43%, A값 319.4만원을 사용하는 추정 모델입니다.",
];

export const NPC_RELATED_LINKS = [
  { href: "/reports/national-pension-generational-comparison-2026/", label: "국민연금 세대별 수익 비교 2026" },
  { href: "/tools/retirement/", label: "은퇴금 계산기" },
  { href: "/tools/fire-calculator/", label: "FIRE 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
];

export const NPC_SOURCE_LINKS = [
  { href: "https://www.nps.or.kr/", label: "국민연금공단 공식 사이트" },
  { href: "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0056M0.do", label: "노령연금 종류 안내" },
  { href: "https://www.nps.or.kr/elctcvlcpt/comm/getOHAC0000M5.do?menuId=MN24001075", label: "연기연금 안내" },
];

export const NPC_NEXT_CONTENT = {
  eyebrow: "계산기 이어보기",
  title: "국민연금 이후의 노후 자금 계획까지 이어서 보기",
  desc: "예상 연금액만 보면 부족한 경우가 많아서, 은퇴 생활비와 추가 투자 흐름까지 같이 보는 편이 현실적입니다.",
  href: "/tools/fire-calculator/",
  cta: "FIRE 계산기 보기",
  badges: ["노후 준비", "생활비", "추가 자산"],
  sub: [
    {
      href: "/tools/retirement/",
      title: "은퇴금 계산기",
      desc: "퇴직 시점 자금과 월 생활비 기준을 연결해서 볼 수 있습니다.",
      badges: ["은퇴 자금"],
    },
    {
      href: "/tools/dca-investment-calculator/",
      title: "적립식 투자 수익 비교 계산기",
      desc: "국민연금 부족분을 장기 투자로 메운다면 어느 정도 속도가 필요한지 비교하기 좋습니다.",
      badges: ["장기 투자"],
    },
    {
      href: "/reports/national-pension-generational-comparison-2026/",
      title: "국민연금 세대 비교 리포트",
      desc: "세대별 기대 수익 구조와 제도 차이를 큰 그림으로 함께 볼 수 있습니다.",
      badges: ["리포트"],
    },
  ],
};

export const NPC_REFERENCE_CARDS = [
  {
    href: "https://www.nps.or.kr/",
    source: "국민연금공단",
    title: "국민연금공단 공식 사이트",
    desc: "가장 정확한 개인 가입 이력과 예상 연금 조회는 공단 공식 서비스에서 확인해야 합니다.",
  },
  {
    href: "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0056M0.do",
    source: "국민연금공단",
    title: "노령연금 종류 안내",
    desc: "조기·정상·연기 노령연금 차이를 공식 설명으로 다시 확인할 수 있습니다.",
  },
  {
    href: "https://www.nps.or.kr/elctcvlcpt/comm/getOHAC0000M5.do?menuId=MN24001075",
    source: "국민연금공단",
    title: "연기연금 안내",
    desc: "연기 수급 시 가산 구조와 신청 기준을 확인할 때 유용합니다.",
  },
];
