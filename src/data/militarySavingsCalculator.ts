export interface MscPreset {
  id: string;
  label: string;
  description: string;
  months: number;
  monthlyContribution: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const MSC_META = {
  slug: "military-savings-calculator",
  title: "장병내일준비적금 만기 계산기 2027",
  seoTitle: "장병내일준비적금 계산기 2027 | 전역 시 받는 목돈 바로 계산",
  seoDescription:
    "월 납입액과 복무 기간, 정부 매칭지원금 비율을 입력하면 장병내일준비적금 만기 시 받을 수 있는 본인 납입금, 이자, 매칭지원금, 총수령액을 바로 계산합니다.",
  dataNote:
    "장병내일준비적금은 병 복무 중 가입할 수 있는 정책형 적금으로, 본인 납입금에 은행 이자와 정부 매칭지원금이 더해져 만기 시 지급됩니다. 이 계산기의 금리와 매칭지원금 비율은 일반적으로 알려진 기준을 단순화한 추정치이며, 실제 가입 시점의 은행별 금리와 매칭 비율은 다를 수 있습니다.",
} as const;

export const MSC_DEFAULT_INPUT = {
  months: 18,
  monthlyContribution: 550000,
  annualRate: 5.0,
  matchingRate: 100,
  taxFree: true,
};

export const MSC_LIMITS = {
  maxMonths: 21,
  maxMonthlyContribution: 550000,
};

export const MSC_PRESETS: MscPreset[] = [
  {
    id: "standard-18",
    label: "표준 복무 18개월",
    description: "병 표준 복무기간, 월 최대 납입 기준",
    months: 18,
    monthlyContribution: 550000,
  },
  {
    id: "half-contribution",
    label: "절반만 납입",
    description: "여유 자금이 적을 때 월 절반만 납입",
    months: 18,
    monthlyContribution: 275000,
  },
  {
    id: "short-service",
    label: "단축 복무 6개월",
    description: "사회복무·대체복무 등 짧은 복무 기간",
    months: 6,
    monthlyContribution: 550000,
  },
  {
    id: "full-21",
    label: "최장 복무 21개월",
    description: "복무 기간이 긴 병과 기준",
    months: 21,
    monthlyContribution: 550000,
  },
];

export const MSC_FAQ: FaqItem[] = [
  {
    question: "장병내일준비적금은 누가 가입할 수 있나요?",
    answer:
      "병 복무 중인 현역병, 상근예비역, 의무경찰, 해양의무경찰, 의무소방원 등이 가입할 수 있습니다. 부사관·장교는 이 제도의 대상이 아닙니다.",
  },
  {
    question: "월 납입 한도는 얼마인가요?",
    answer:
      "이 계산기는 월 최대 55만 원을 기준으로 설계되어 있습니다. 다만 실제 한도와 취급 은행은 정책 변경에 따라 달라질 수 있으므로, 가입 전 최신 한도를 국방부나 취급 은행에서 확인해야 합니다.",
  },
  {
    question: "정부 매칭지원금은 정확히 얼마나 받나요?",
    answer:
      "매칭지원금 비율은 정책에 따라 달라질 수 있어 이 계산기에서는 슬라이더로 직접 조정할 수 있게 했습니다. 기본값은 본인 납입금의 100%를 가정한 수치이며, 실제 매칭 비율과 지급 조건은 가입 시점의 공식 안내를 확인해야 합니다.",
  },
  {
    question: "이자는 비과세인가요?",
    answer:
      "장병내일준비적금은 일정 조건을 충족하면 이자소득에 대해 비과세 혜택이 적용되는 것으로 알려져 있습니다. 이 계산기는 기본적으로 비과세를 가정하며, 과세 옵션으로 전환해 일반 적금과 비교해볼 수도 있습니다.",
  },
  {
    question: "복무 기간이 짧으면 만기 전에 해지해야 하나요?",
    answer:
      "전역 시점에 맞춰 만기가 설정되는 경우가 많아, 복무 기간을 입력하면 그 기간 동안 납입한 금액을 기준으로 계산됩니다. 실제 상품의 만기 조건과 중도해지 시 불이익은 가입한 은행의 약관을 확인해야 합니다.",
  },
  {
    question: "월급에서 적금을 빼고 나면 생활비가 부족하지 않을까요?",
    answer:
      "이 계산기에서 월 납입액을 줄여보면서 본인의 병사 월급(군인 월급 계산기에서 확인 가능) 대비 부담 가능한 수준을 가늠해보는 것을 권장합니다. 절반만 납입하는 시나리오도 함께 비교해볼 수 있습니다.",
  },
];

export const MSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/military-salary-calculator/", label: "군인 월급 계산기 2027" },
  { href: "/reports/military-salary-2026/", label: "군인 월급·연봉 2026 완전 정리" },
  { href: "/tools/youth-savings-maturity-calculator/", label: "청년적금 만기 비교 계산기" },
  { href: "/tools/youth-future-savings-2026/", label: "청년미래적금 시뮬레이터" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];
