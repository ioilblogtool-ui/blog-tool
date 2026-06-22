export type HighOilTargetType =
  | "basic-livelihood-recipient"
  | "near-poverty-class"
  | "single-parent-family"
  | "unknown";

export type HighOilResidenceArea = "capital-area" | "non-capital-area";

export interface HighOilPreset {
  id: string;
  label: string;
  description: string;
  targetType: HighOilTargetType;
  eligiblePeople: number;
  residenceArea: HighOilResidenceArea;
  isPopulationDeclineArea: boolean;
}

export const HIGH_OIL_META = {
  slug: "high-oil-support-payment-calculator",
  title: "고유가 피해지원금 계산기",
  description:
    "2026년 고유가 피해지원금 대상 유형, 가구 인원, 거주 지역을 입력해 1인당 지원액과 예상 수령액을 확인합니다.",
  updatedAt: "2026.06.04",
};

export const HIGH_OIL_SUPPORT_2026 = {
  year: 2026,
  firstRoundStart: "2026-04-27",
  secondRoundStart: "2026-05-18",
  secondRoundEnd: "2026-07-03",
  baseAmounts: {
    "basic-livelihood-recipient": 550000,
    "near-poverty-class": 450000,
    "single-parent-family": 450000,
    unknown: 0,
  } satisfies Record<HighOilTargetType, number>,
  regionalExtraAmount: 50000,
  maxPeople: 20,
  sources: [
    {
      label: "대한민국 정책브리핑 고유가 피해지원금 지급 개시",
      url: "https://www.korea.kr/news/policyFocusView.do?newsId=148963458&pWise=main&pWiseMain=F2&pkgId=49500834",
    },
    {
      label: "대한민국 정책브리핑 고유가 피해지원금 지급계획",
      url: "https://www.korea.kr/news/policyFocusView.do?newsId=148962496&pkgId=49500834",
    },
  ],
};

export const HIGH_OIL_TARGET_OPTIONS = [
  {
    value: "basic-livelihood-recipient",
    label: "기초생활수급자",
    amountLabel: "1인 55만 원",
    description: "생계·의료·주거·교육급여 수급자 기준으로 계산합니다.",
  },
  {
    value: "near-poverty-class",
    label: "차상위계층",
    amountLabel: "1인 45만 원",
    description: "차상위 확인서 등 지자체 인정 기준을 확인해야 합니다.",
  },
  {
    value: "single-parent-family",
    label: "한부모가족",
    amountLabel: "1인 45만 원",
    description: "한부모가족 증명 또는 지자체 확인 기준으로 계산합니다.",
  },
  {
    value: "unknown",
    label: "대상 여부 확인 필요",
    amountLabel: "계산 보류",
    description: "대상 유형이 확정되지 않았다면 주민센터 또는 복지로에서 먼저 확인하세요.",
  },
] satisfies Array<{
  value: HighOilTargetType;
  label: string;
  amountLabel: string;
  description: string;
}>;

export const HIGH_OIL_PRESETS: HighOilPreset[] = [
  {
    id: "basic-single",
    label: "기초수급 1인",
    description: "가장 기본적인 1인 수급자 계산",
    targetType: "basic-livelihood-recipient",
    eligiblePeople: 1,
    residenceArea: "capital-area",
    isPopulationDeclineArea: false,
  },
  {
    id: "near-poverty-two",
    label: "차상위 2인",
    description: "2인 가구 차상위계층 계산",
    targetType: "near-poverty-class",
    eligiblePeople: 2,
    residenceArea: "capital-area",
    isPopulationDeclineArea: false,
  },
  {
    id: "regional-four",
    label: "비수도권 4인",
    description: "인구감소지역 추가 5만 원 반영",
    targetType: "basic-livelihood-recipient",
    eligiblePeople: 4,
    residenceArea: "non-capital-area",
    isPopulationDeclineArea: true,
  },
];

export const HIGH_OIL_CHECKLIST = [
  "주민등록상 주소지와 실제 신청 지자체가 일치하는지 확인합니다.",
  "가구원별 대상 유형이 같은지, 일부만 대상인지 구분합니다.",
  "비수도권 인구감소지역 추가 지원은 지자체 공고로 최종 확인합니다.",
  "2차 신청은 2026년 7월 3일 마감 기준으로 역산해 서류를 준비합니다.",
];

export const HIGH_OIL_FAQ = [
  {
    question: "고유가 피해지원금은 누구에게 지급되나요?",
    answer:
      "2026년 기준 기초생활수급자, 차상위계층, 한부모가족 등 취약계층을 중심으로 지급됩니다. 실제 대상 여부는 주민등록지 지자체 확인이 필요합니다.",
  },
  {
    question: "비수도권이면 모두 5만 원이 추가되나요?",
    answer:
      "아닙니다. 비수도권이면서 인구감소지역 등 추가 지원 대상 지역에 해당해야 합니다. 계산기는 추가 가능성을 표시하지만 최종 금액은 지자체 공고를 확인해야 합니다.",
  },
  {
    question: "신청 마감일은 언제인가요?",
    answer:
      "2차 신청 마감 기준은 2026년 7월 3일입니다. 마감 직전에는 서류 보완 시간이 부족할 수 있으므로 주민센터 안내를 먼저 확인하는 편이 안전합니다.",
  },
  {
    question: "계산 결과가 실제 지급액과 다를 수 있나요?",
    answer:
      "네. 이 계산기는 공개된 지원 단가를 바탕으로 한 모의계산입니다. 가구원 인정, 중복 지원, 지역 추가금, 지급 방식은 지자체 심사 결과에 따라 달라질 수 있습니다.",
  },
];

export const HIGH_OIL_RELATED_LINKS = [
  {
    title: "복지급여 자격 체크 계산기",
    description: "소득·가구 기준으로 받을 수 있는 복지급여를 함께 점검합니다.",
    href: "/tools/welfare-benefit-eligibility/",
  },
  {
    title: "청년미래적금 2026 출시판",
    description: "6월 출시 기준의 청년 자산형성 상품을 비교합니다.",
    href: "/reports/youth-future-savings-2026/",
  },
  {
    title: "청년미래적금 만기 계산기",
    description: "월 납입액과 정부기여금에 따른 예상 만기액을 계산합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
  },
];

export const HIGH_OIL_SEO_CONTENT = {
  introTitle: "2026년 고유가 피해지원금 계산 기준",
  intro: [
    "고유가 피해지원금은 기름값과 난방비 부담이 특히 큰 취약계층을 대상으로 한 한시 지원 제도입니다. 기초생활수급자나 차상위계층, 한부모가족 가구가 \"내가 대상인지\", \"얼마나 받을 수 있는지\"를 신청 마감 전에 빠르게 확인하려는 수요가 많아, 2차 신청 마감(7월 3일)이 가까워질수록 검색이 늘어나는 시기성 지원금입니다.",
    "이 계산기는 가구 유형(기초생활수급자·차상위계층·한부모가족)과 대상 인원을 입력받아 1인당 지급 기준(기초생활수급자 55만 원, 차상위계층·한부모가족 45만 원)을 곱해 가구 전체 예상 지원금을 계산합니다. 여기에 비수도권 인구감소지역에 거주하는 경우 추가 지원 가능성도 별도로 표시해, 지역 조건까지 반영한 더 정확한 추정값을 보여줍니다.",
    "결과를 해석할 때는 가구원 수가 그대로 지급 인원으로 인정되는 것이 아니라는 점을 먼저 봐야 합니다. 실제로는 수급자격을 보유한 가구원만 대상 인원으로 잡히므로, 가구원 전체 수와 지원 대상 인원 수가 다를 수 있습니다. 이 계산기의 결과는 두 수치를 구분해 보여주므로, 내가 입력한 인원이 실제 지급 대상과 일치하는지 다시 확인하는 것이 좋습니다.",
    "다만 이 지원금은 지자체별 예산과 세부 기준에 따라 실제 지급액이나 대상 범위가 달라질 수 있는 한시적 사업입니다. 이 계산기는 중앙 정부 기준을 단순화한 추정치이므로, 정확한 신청 자격과 지급액은 거주지 행정복지센터 또는 복지로 공고문을 통해 신청 마감 전에 최종 확인하는 것이 좋습니다.",
  ],
  inputPoints: [
    "대상 유형: 기초생활수급자, 차상위계층, 한부모가족 중 해당 항목",
    "대상 인원: 실제 지급 대상자로 인정될 가능성이 있는 가구원 수",
    "지역 조건: 수도권 여부와 인구감소지역 추가 지원 가능성",
    "신청 일정: 2026년 7월 3일 2차 신청 마감 전 접수 여부",
  ],
  criteria: [
    {
      title: "기본 지원액",
      body: "기초생활수급자는 1인 55만 원, 차상위계층과 한부모가족은 1인 45만 원으로 계산합니다.",
    },
    {
      title: "지역 추가 지원",
      body: "비수도권 인구감소지역 등에 해당하면 1인 5만 원 추가 가능성을 반영합니다.",
    },
    {
      title: "최종 확인",
      body: "실제 지급액과 신청 가능 여부는 주민등록지 지자체 공고와 심사 결과를 우선합니다.",
    },
  ],
};
