export type RegionType = "seoul" | "gyeonggi" | "etc";
export type CareGapReason = "dual_income" | "single_parent" | "multi_child" | "disabled_parent" | "none";
export type JudgementLevel = "likely" | "partial" | "needs_check";

export interface FcacPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const FCAC_META = {
  slug: "family-care-allowance-calculator",
  title: "가족돌봄수당 계산기 2026",
  seoTitle: "가족돌봄수당 계산기 | 조부모 돌봄수당 신청 가능 여부·예상 지원금",
  seoDescription:
    "아이 생년월, 소득, 돌봄시간을 입력해 가족돌봄수당(조부모 돌봄수당) 신청 가능성과 예상 지원금을 자가 점검합니다. 24~36개월, 월 30만~60만원 기준을 한 번에 확인하세요.",
  dataNote:
    "가족돌봄수당은 전국 통일 제도가 아니라 시·도 및 시군구별 자체 사업입니다. 나이·소득·돌봄시간은 일반적인 기준으로 1차 점검하지만, 거주 지역의 사업 참여 여부는 반드시 별도로 확인해야 합니다. 이 계산기의 결과는 확정 수급 여부가 아닌 자가 점검용 추정입니다.",
  updatedAt: "2026-06-25",
};

export const FCAC_REGION_LABELS: Record<RegionType, string> = {
  seoul: "서울",
  gyeonggi: "경기도",
  etc: "기타 지역",
};

export const FCAC_CARE_GAP_LABELS: Record<CareGapReason, string> = {
  dual_income: "맞벌이",
  single_parent: "한부모",
  multi_child: "다자녀",
  disabled_parent: "장애 부모",
  none: "해당 없음",
};

// 2026년 중위소득 150% 건강보험료 본인부담금 기준 (직장가입자, 장기요양보험료 제외)
export const FCAC_INCOME_THRESHOLD: Record<number, { value: number; badge: "확인됨" | "추정" }> = {
  1: { value: 138_780, badge: "확인됨" },
  2: { value: 229_357, badge: "확인됨" },
  3: { value: 290_169, badge: "확인됨" },
  4: { value: 360_410, badge: "확인됨" },
  5: { value: 410_000, badge: "추정" },
  6: { value: 490_000, badge: "추정" },
};

export const FCAC_MONTHLY_AMOUNT_BY_CHILD: Record<number, number> = {
  1: 300_000,
  2: 450_000,
  3: 600_000,
};

// 지역별 최대 지원개월 (서울 13개월 확인, 그 외 12개월 운영 사례 — 전체 지자체 일반화 아님)
export const FCAC_MAX_MONTHS_BY_REGION: Record<RegionType, number> = {
  seoul: 13,
  gyeonggi: 12,
  etc: 12,
};

export const FCAC_MIN_AGE_MONTHS = 24;
export const FCAC_MAX_AGE_MONTHS = 36;
export const FCAC_MIN_CARE_HOURS = 40;

export const FCAC_PRESETS: FcacPreset[] = [
  {
    id: "seoul-dual-income",
    label: "서울, 맞벌이",
    summary: "아이 24개월 진입 · 가구 3인 · 건강보험료 27만원",
    input: { region: "seoul", childBirthYear: 2025, childBirthMonth: 3, applyYear: 2027, applyMonth: 3, childCount: 1, householdSize: 3, healthInsuranceFee: 270000, careGapReason: "dual_income", monthlyCareHours: 40 },
  },
  {
    id: "gyeonggi-multi-child",
    label: "경기도, 다자녀",
    summary: "자녀 2명 돌봄 · 가구 4인 · 건강보험료 33만원",
    input: { region: "gyeonggi", childBirthYear: 2025, childBirthMonth: 1, applyYear: 2027, applyMonth: 6, childCount: 2, householdSize: 4, healthInsuranceFee: 330000, careGapReason: "multi_child", monthlyCareHours: 45 },
  },
  {
    id: "etc-borderline",
    label: "기타 지역, 경계 사례",
    summary: "건강보험료 기준 근접 · 돌봄시간 부족 가능성",
    input: { region: "etc", childBirthYear: 2025, childBirthMonth: 6, applyYear: 2027, applyMonth: 7, childCount: 1, householdSize: 3, healthInsuranceFee: 295000, careGapReason: "single_parent", monthlyCareHours: 35 },
  },
  {
    id: "seoul-not-eligible-age",
    label: "서울, 아직 24개월 미만",
    summary: "신청 시점이 너무 빠른 케이스",
    input: { region: "seoul", childBirthYear: 2026, childBirthMonth: 1, applyYear: 2027, applyMonth: 6, childCount: 1, householdSize: 3, healthInsuranceFee: 200000, careGapReason: "dual_income", monthlyCareHours: 40 },
  },
];

export const FCAC_FAQ = [
  {
    question: "가족돌봄수당은 전국 어디서나 받을 수 있나요?",
    answer:
      "아닙니다. 가족돌봄수당은 전국 통일 제도가 아니라 시·도 및 시군구별 자체 사업입니다. 같은 경기도 안에서도 시군마다 참여 여부가 다르고, 참여하지 않는 지자체도 있습니다. 이 계산기는 나이·소득·돌봄시간 조건만 일반 기준으로 점검하며, 거주 지역의 실제 참여 여부는 반드시 주민센터나 해당 지자체 공고로 별도 확인해야 합니다.",
  },
  {
    question: "소득 기준은 신청일 기준 소득인가요?",
    answer:
      "아닙니다. 대부분 지자체는 신청일이 아니라 해당 연도의 특정 기준일(보통 3월 말경)의 건강보험료 납부 기록을 기준으로 소득을 판정합니다. 신청 시점에 소득이 바뀌었더라도 기준일 당시 자료로 판정되니, 정확한 기준일은 신청 지자체 공고에서 확인해야 합니다.",
  },
  {
    question: "16일에 신청하면 어떻게 되나요?",
    answer:
      "대부분 지자체는 매월 1일~15일 신청 시 해당 월부터 지급하고, 16일 이후 신청하면 다음 달부터 지급합니다. 신청을 미루면 한 달치 지원금을 못 받을 수 있으니 신청 시점을 꼭 챙겨야 합니다.",
  },
  {
    question: "조부모가 아니어도 가족돌봄수당을 받을 수 있나요?",
    answer:
      "네, 일부 지자체는 조부모뿐 아니라 4촌 이내 친인척(이모, 삼촌 등)도 돌봄 제공자로 인정합니다. 다만 인정 범위는 지자체마다 다르므로 신청 전 확인이 필요합니다.",
  },
  {
    question: "어린이집을 같이 이용하면 못 받나요?",
    answer:
      "대부분 지자체는 어린이집 등 보육시설을 이용하는 시간과 가족돌봄 시간이 중복되지 않아야 한다는 조건을 둡니다. 어린이집을 일부 이용하면서 나머지 시간에 가족돌봄을 받는 경우 인정 여부가 지자체마다 다를 수 있어 별도 확인이 필요합니다.",
  },
  {
    question: "최대 지원개월은 지역마다 다른가요?",
    answer:
      "네, 다릅니다. 서울은 최대 13개월(자녀 1명 기준 최대 390만원), 다른 일부 지역은 12개월(최대 360만원)로 운영되는 사례가 확인됩니다. 이 계산기는 선택한 지역에 따라 다른 최대 개월을 보여주지만, 정확한 개월 수는 신청하는 지자체 공고로 다시 확인해야 합니다.",
  },
];

export const FCAC_RELATED_LINKS = [
  { href: "/tools/basic-pension-eligibility-calculator/", label: "기초연금 수급 가능성 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직급여 계산기" },
  { href: "/tools/daycare-vs-kindergarten-cost/", label: "어린이집 vs 유치원 비용 비교" },
];

export const FCAC_SEO_CONTENT = {
  introTitle: "가족돌봄수당, 우리 아이도 받을 수 있을까?",
  intro: [
    "조부모나 친척에게 아이를 맡기는 가정이 늘면서 '가족돌봄수당'(조부모 돌봄수당, 손주 돌봄수당)에 대한 관심도 함께 커지고 있습니다. 하지만 막상 알아보면 나이 기준, 소득 기준, 거주 지역 조건이 한꺼번에 얽혀 있어 내가 신청 대상인지조차 가늠하기 어렵습니다. 이 계산기는 아이 생년월, 가구 소득, 돌봄 시간을 입력해 신청 전에 스스로 점검할 수 있도록 만든 자가 점검용 도구입니다.",
    "가족돌봄수당은 보통 만 24개월부터 36개월 이하 아이를 대상으로 하며, 맞벌이·한부모·다문화·다자녀·장애 부모 가정이 우선 대상입니다. 소득 기준은 기준 중위소득 150% 이하로, 가구원 수별 건강보험료 본인부담금(장기요양보험료 제외) 합산액이 일정 기준 이하여야 합니다. 지원금은 돌봄대상 자녀 수에 따라 1명 월 30만원, 2명 월 45만원, 3명 이상 월 최대 60만원으로 차등 지급됩니다.",
    "가장 헷갈리기 쉬운 부분은 이 제도가 전국 통일 제도가 아니라는 점입니다. 가족돌봄수당은 시·도와 시군구별 자체 사업으로 운영되기 때문에, 같은 경기도 안에서도 참여하는 시군과 참여하지 않는 시군이 나뉩니다. 그래서 이 계산기는 나이·소득·돌봄시간은 일반 기준으로 점검하지만, 거주 지역의 실제 참여 여부는 항상 '확인 필요'로 별도 표시합니다.",
    "최대 지원 개월도 지역마다 다릅니다. 서울은 최대 13개월(자녀 1명 기준 최대 390만원)까지 지원하는 것으로 확인되고, 다른 일부 지역은 12개월(최대 360만원) 기준으로 운영되는 사례가 있습니다. 또한 소득 기준 판정은 신청일이 아니라 해당 연도의 특정 기준일(보통 3월 말경) 건강보험료 납부 기록을 사용하는 경우가 많아, 신청 시점과 기준일이 다르면 결과가 달라질 수 있습니다.",
    "이 계산기는 신청 결과를 보장하지 않는 자가 점검용 추정입니다. 돌봄시간은 월 40시간 이상이면서 하루 최대 4시간, 오전 6시부터 오후 10시 사이여야 인정되는 등 세부 규정이 있고, 돌봄일지 작성과 사전 교육 이수 같은 추가 의무도 있습니다. 정확한 신청 가능 여부와 지원금은 반드시 주소지 읍면동 주민센터나 해당 지자체 공고에서 최종 확인해야 합니다.",
  ],
  inputPoints: [
    "아이 생년월과 신청 예정월을 넣으면 24~36개월 대상 기간을 바로 확인할 수 있습니다.",
    "건강보험료를 넣으면 가구원 수 기준 소득 충족 여부를 점검할 수 있습니다.",
    "자녀 수와 지역을 선택하면 예상 월 지원금과 최대 총 지원금을 볼 수 있습니다.",
  ],
  criteria: [
    "대상 연령, 소득 기준, 지원금액은 2026년 기준 다수 지자체 공통 운영 기준을 참고했습니다.",
    "거주 지역의 사업 참여 여부는 일반 기준으로 판정할 수 없어 항상 '확인 필요'로 표시합니다.",
    "최대 지원개월은 지역별로 다르며(서울 13개월, 그 외 12개월 사례), 정확한 값은 지자체 공고로 재확인해야 합니다.",
    "이 계산기는 확정 수급 여부가 아닌 자가 점검용 추정이며, 최종 확인은 주민센터에서 해야 합니다.",
  ],
};

export const FCAC_CONFIG = {
  incomeThreshold: FCAC_INCOME_THRESHOLD,
  monthlyAmountByChild: FCAC_MONTHLY_AMOUNT_BY_CHILD,
  maxMonthsByRegion: FCAC_MAX_MONTHS_BY_REGION,
  minAgeMonths: FCAC_MIN_AGE_MONTHS,
  maxAgeMonths: FCAC_MAX_AGE_MONTHS,
  minCareHours: FCAC_MIN_CARE_HOURS,
  presets: FCAC_PRESETS,
  labels: {
    region: FCAC_REGION_LABELS,
    careGap: FCAC_CARE_GAP_LABELS,
  },
};
