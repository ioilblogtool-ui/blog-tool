export interface StplTier {
  minMonth: number;
  maxMonth: number;
  ratio: number;
  cap: number;
}

export interface StplPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export interface StplFaqItem {
  question: string;
  answer: string;
}

export const STPL_META = {
  slug: "short-term-parental-leave-calculator",
  title: "단기 육아휴직 급여 계산기",
  seoTitle: "2026 단기 육아휴직 급여 계산기 | 1주·2주 쓰면 월급 얼마 줄어들까",
  seoDescription:
    "2026년 8월 20일 시행되는 1주·2주 단기 육아휴직 급여를 월 통상임금 기준으로 계산합니다. 정상 근무 대비 감소액과 남은 육아휴직 기간까지 한 번에 확인하세요.",
  dataNote:
    "2026년 8월 20일부터 시행되는 단기 육아휴직(1주·2주) 제도를 기준으로 한 참고용 추정입니다. 1주=7일, 2주=14일로 단순화했으며, 실제 지급액은 고용센터 심사와 사업장 규정에 따라 달라질 수 있습니다.",
  updatedAt: "2026-07-22",
};

// 시행 정책 메타(고용노동부 2026-06-29 보도자료 기준)
export const STPL_POLICY_META = {
  effectiveDate: "2026-08-20",
  targetChild: "만 8세 이하 또는 초등학교 2학년 이하",
  usageLimit: "연 1회, 1주 또는 2주 단위",
  sourceNote: "고용노동부 2026-06-29 보도자료 기준",
};

// 기존 parental-leave-pay.js(104번째 줄)와 동일한 급여율·상한액 — 이중 정의 금지, 값 변경 시 함께 갱신
export const STPL_GENERAL_LEAVE_TIERS: StplTier[] = [
  { minMonth: 1, maxMonth: 3, ratio: 1.0, cap: 2_500_000 },
  { minMonth: 4, maxMonth: 6, ratio: 1.0, cap: 2_000_000 },
  { minMonth: 7, maxMonth: 999, ratio: 0.8, cap: 1_600_000 },
];

// 기존 six-plus-six.js(67·73번째 줄)와 동일한 6+6 특례 상한액
export const STPL_SIX_PLUS_SIX_CAPS: number[] = [2_500_000, 2_500_000, 3_000_000, 3_500_000, 4_000_000, 4_500_000];

export const STPL_PRESETS: StplPreset[] = [
  {
    id: "school-break",
    label: "신학기 방학 돌봄",
    summary: "월 300만 · 1주 사용",
    input: { monthlyWage: 3000000, leaveUnit: "1week", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
  {
    id: "daycare-closure",
    label: "어린이집 휴원 대응",
    summary: "월 250만 · 2주 사용",
    input: { monthlyWage: 2500000, leaveUnit: "2weeks", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
  {
    id: "six-plus-six-case",
    label: "생후 18개월 내 맞벌이",
    summary: "월 400만 · 1주 · 6+6 특례",
    input: { monthlyWage: 4000000, leaveUnit: "1week", isSixPlusSixEligible: true, sixPlusSixMonthNumber: 1 },
  },
  {
    id: "low-income",
    label: "저소득 구간",
    summary: "월 180만 · 2주 사용",
    input: { monthlyWage: 1800000, leaveUnit: "2weeks", isSixPlusSixEligible: false, generalLeaveMonthNumber: 1 },
  },
];

export const STPL_LEAVE_COMPARISON_TABLE = [
  { system: "단기 육아휴직", reason: "질병·방학·휴원", period: "1주·2주", isPaid: "휴직", payLabel: "육아휴직급여" },
  { system: "가족돌봄휴가", reason: "가족 돌봄", period: "연간 한도", isPaid: "원칙상 무급", payLabel: "별도 확인" },
  { system: "연차휴가", reason: "자유", period: "보유 일수", isPaid: "유급", payLabel: "회사 급여" },
  { system: "육아기 단축근무", reason: "지속적 육아", period: "장기간", isPaid: "근로급여+지원", payLabel: "단축급여" },
  { system: "일반 육아휴직", reason: "자녀 양육", period: "장기간", isPaid: "휴직", payLabel: "육아휴직급여" },
];

export const STPL_FAQ: StplFaqItem[] = [
  {
    question: "단기 육아휴직도 급여가 나오나요?",
    answer:
      "네. 기존에는 30일 이상 사용해야 급여가 지급됐지만, 2026년 8월 20일부터는 1주·2주 단기 사용에도 7일·14일 단위로 환산해 육아휴직급여가 지급됩니다.",
  },
  { question: "1년에 몇 번 쓸 수 있나요?", answer: "연 1회, 1주 또는 2주 단위로 사용할 수 있습니다." },
  {
    question: "아무 때나 쓸 수 있나요?",
    answer: "방학, 휴원·휴교, 자녀 질병 등 단기 돌봄이 필요한 경우에 사용할 수 있습니다.",
  },
  {
    question: "단기로 쓰면 원래 육아휴직 기간이 줄어드나요?",
    answer: "네. 단기 육아휴직 사용 기간은 전체 육아휴직 가능 기간에서 차감됩니다.",
  },
  {
    question: "이미 일반 육아휴직을 다 썼으면 단기 육아휴직도 못 쓰나요?",
    answer: "전체 육아휴직 기간을 모두 소진했다면 단기 육아휴직도 추가로 사용하기 어렵습니다. 남은 기간 안에서만 사용할 수 있습니다.",
  },
];

export const STPL_SEO_CONTENT = {
  introTitle: "단기 육아휴직 급여 계산기 — 1주·2주 써도 급여가 나옵니다",
  intro: [
    "2026년 8월 20일부터 만 8세 이하(초등학교 2학년 이하) 자녀를 둔 근로자는 방학, 휴원·휴교, 자녀 질병 등으로 급하게 며칠만 쉬어야 할 때 연 1회, 1주 또는 2주 단위로 육아휴직을 사용할 수 있습니다. 기존에는 30일 이상 사용해야만 육아휴직급여가 지급됐지만, 이제는 짧은 기간을 사용해도 7일·14일 단위로 환산된 급여를 받을 수 있습니다.",
    "이 계산기는 월 통상임금을 입력하면 1주 사용과 2주 사용 각각의 경우 회사에서 받는 근무일 급여와 고용보험 육아휴직급여를 합산해 이번 달 실수령액을 추정합니다. 생후 18개월 내 부모가 함께 사용하는 6+6 특례에 해당한다면 더 높은 지급률과 상한액이 적용됩니다.",
    "단기 육아휴직을 사용한 기간은 전체 육아휴직 가능 기간에서 차감됩니다. 이미 올해 일반 육아휴직을 사용한 이력이 있다면 남은 기간과 적용되는 지급률(월차에 따라 100% 또는 80%)이 달라질 수 있습니다.",
  ],
  inputPoints: [
    "월 통상임금만 입력하면 1주·2주 사용 시 실수령액이 동시에 계산됩니다.",
    "생후 18개월 내 부모 모두 사용하는 6+6 특례를 반영할 수 있습니다.",
    "이미 사용한 일반 육아휴직 개월 수를 반영해 지급률 변화를 확인할 수 있습니다.",
  ],
  criteria: [
    "시행일·대상·사용 단위는 고용노동부 발표(2026-06-29 보도자료) 기준입니다.",
    "급여율·상한액은 기존 육아휴직급여·6+6 특례 계산기와 동일한 기준을 재사용합니다.",
    "1주=7일, 2주=14일로 단순화했으며 실제 근무일 산정은 사업장마다 다를 수 있습니다.",
  ],
};

export const STPL_RELATED_LINKS = [
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
  { href: "/tools/six-plus-six/", label: "6+6 부모육아휴직제 계산기" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직 + 육아기 단축근무 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "한 명만 육아휴직 총수령액 계산기" },
];
