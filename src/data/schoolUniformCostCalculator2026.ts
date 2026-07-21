export type SucSchoolLevel = "middle" | "high";
export type SucUniformType = "formal" | "casual" | "mixed";
export type SucScenario = "minimum" | "standard" | "comfortable";
export type SucItemGroup = "winter" | "summer" | "pe" | "extra";
export type SucEvidenceBadge = "공식" | "입력값" | "추정" | "확인 필요";

export interface SucUniformItem {
  id: string;
  group: SucItemGroup;
  label: string;
  defaultUnitPrice: number;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  badge: SucEvidenceBadge;
  note?: string;
}

export interface SucPreset {
  id: SucUniformType;
  label: string;
  description: string;
  averageBidPrice: number;
  badge: SucEvidenceBadge;
  quantityOverrides?: Partial<Record<string, number>>;
}

export interface SucInputItem {
  id: string;
  unitPrice: number;
  quantity: number;
}

export interface SucInput {
  schoolLevel: SucSchoolLevel;
  uniformType: SucUniformType;
  scenario: SucScenario;
  supportEnabled: boolean;
  supportAmount: number;
  extraRiskRatio: number;
  items: SucInputItem[];
}

export const SUC_META = {
  slug: "school-uniform-cost-calculator-2026",
  title: "중학교 교복비 계산기 2026",
  seoTitle: "중학교 교복비 계산기 2026 | 동복·하복·체육복 총액 바로 계산",
  seoDescription:
    "동복·하복·생활복·체육복 품목과 수량을 입력하면 중학교·고등학교 첫 교복 구매 총액과 지원금 차감 후 본인부담액을 계산합니다.",
  updatedAt: "2026-07-21",
  dataNote:
    "정장형·생활형 평균 낙찰가는 교육부 2025학년도 교복비 전수조사 공개자료 기준입니다. 품목별 기본 단가는 학교별 차이가 커서 참고값이며, 실제 계산은 학교 안내문 단가를 직접 입력하는 방식으로 설계했습니다.",
};

export const SUC_OFFICIAL_AVERAGES = {
  surveyYear: "2025학년도",
  publishedYear: 2026,
  surveyedSchools: 5_687,
  uniformSchools: 5_437,
  uniformSchoolRatio: 0.956,
  schoolPurchaseSchools: 5_236,
  schoolPurchaseRatio: 0.963,
  formalAverageBidPrice: 265_753,
  casualAverageBidPrice: 152_877,
  mixedSchoolRatio: 0.605,
  formalOnlyRatio: 0.26,
  casualOnlyRatio: 0.135,
  averageItemCount: 7,
  minItemCount: 1,
  maxItemCount: 16,
  formalWinterShirtMin: 10_000,
  formalWinterShirtMax: 178_000,
  formalWinterBottomMin: 20_000,
  formalWinterBottomMax: 99_000,
};

export const SUC_PRESETS: SucPreset[] = [
  {
    id: "formal",
    label: "정장형 교복",
    description: "동복 재킷·셔츠·하의 중심의 전통적인 교복 구성입니다.",
    averageBidPrice: 265_753,
    badge: "공식",
    quantityOverrides: {
      "casual-top": 0,
      "casual-bottom": 0,
    },
  },
  {
    id: "casual",
    label: "생활형 교복",
    description: "생활복 상의와 편한 하의를 중심으로 맞추는 구성입니다.",
    averageBidPrice: 152_877,
    badge: "공식",
    quantityOverrides: {
      "winter-jacket": 0,
      "winter-shirt": 0,
      "winter-bottom": 0,
      "knit-vest": 0,
      "summer-shirt": 0,
      "summer-bottom": 0,
      "casual-top": 2,
      "casual-bottom": 1,
    },
  },
  {
    id: "mixed",
    label: "정장+생활복 혼합",
    description: "동복 정장형에 생활복과 체육복을 함께 사는 일반적인 첫 구매 구성입니다.",
    averageBidPrice: 418_630,
    badge: "추정",
  },
];

export const SUC_SCENARIOS: Record<SucScenario, { label: string; description: string; extraTopQuantity: number; extraRiskRatio: number }> = {
  minimum: {
    label: "최소 구매",
    description: "필수 세트 위주로 사고 추가 상의는 거의 사지 않는 기준입니다.",
    extraTopQuantity: 0,
    extraRiskRatio: 0,
  },
  standard: {
    label: "표준 구매",
    description: "세탁 주기를 고려해 상의 1벌과 예비비 5%를 더합니다.",
    extraTopQuantity: 1,
    extraRiskRatio: 0.05,
  },
  comfortable: {
    label: "여유 구매",
    description: "자주 입는 상의와 생활복을 넉넉히 사고 예비비 10%를 둡니다.",
    extraTopQuantity: 2,
    extraRiskRatio: 0.1,
  },
};

export const SUC_DEFAULT_ITEMS: SucUniformItem[] = [
  {
    id: "winter-jacket",
    group: "winter",
    label: "동복 재킷",
    defaultUnitPrice: 90_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 3,
    badge: "확인 필요",
  },
  {
    id: "winter-shirt",
    group: "winter",
    label: "동복 셔츠·블라우스",
    defaultUnitPrice: 45_000,
    defaultQuantity: 2,
    minQuantity: 0,
    maxQuantity: 5,
    badge: "확인 필요",
    note: "교육부 조사에서 정장형 동복 셔츠는 학교별 1만원에서 17만 8천원까지 차이가 확인됐습니다.",
  },
  {
    id: "winter-bottom",
    group: "winter",
    label: "동복 바지·치마",
    defaultUnitPrice: 65_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 4,
    badge: "확인 필요",
    note: "교육부 조사에서 정장형 동복 바지 가격은 학교별 2만원에서 9만 9천원까지 차이가 확인됐습니다.",
  },
  {
    id: "knit-vest",
    group: "winter",
    label: "조끼·니트",
    defaultUnitPrice: 45_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 3,
    badge: "확인 필요",
  },
  {
    id: "summer-shirt",
    group: "summer",
    label: "하복 상의",
    defaultUnitPrice: 43_000,
    defaultQuantity: 2,
    minQuantity: 0,
    maxQuantity: 5,
    badge: "확인 필요",
  },
  {
    id: "summer-bottom",
    group: "summer",
    label: "하복 바지·치마",
    defaultUnitPrice: 50_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 4,
    badge: "확인 필요",
  },
  {
    id: "casual-top",
    group: "summer",
    label: "생활복 상의",
    defaultUnitPrice: 40_000,
    defaultQuantity: 2,
    minQuantity: 0,
    maxQuantity: 5,
    badge: "확인 필요",
  },
  {
    id: "casual-bottom",
    group: "summer",
    label: "생활복 하의",
    defaultUnitPrice: 45_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 4,
    badge: "확인 필요",
  },
  {
    id: "pe-winter",
    group: "pe",
    label: "동복 체육복 세트",
    defaultUnitPrice: 70_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 3,
    badge: "확인 필요",
  },
  {
    id: "pe-summer",
    group: "pe",
    label: "하복 체육복 세트",
    defaultUnitPrice: 50_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 3,
    badge: "확인 필요",
  },
  {
    id: "extra-shirt",
    group: "extra",
    label: "추가 셔츠·생활복 상의",
    defaultUnitPrice: 40_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 6,
    badge: "입력값",
  },
  {
    id: "name-tag",
    group: "extra",
    label: "명찰·마크·수선비",
    defaultUnitPrice: 10_000,
    defaultQuantity: 1,
    minQuantity: 0,
    maxQuantity: 5,
    badge: "입력값",
  },
];

export const SUC_DEFAULT_INPUT: SucInput = {
  schoolLevel: "middle",
  uniformType: "mixed",
  scenario: "standard",
  supportEnabled: true,
  supportAmount: 300_000,
  extraRiskRatio: SUC_SCENARIOS.standard.extraRiskRatio,
  items: SUC_DEFAULT_ITEMS.map((item) => ({
    id: item.id,
    unitPrice: item.defaultUnitPrice,
    quantity: item.defaultQuantity,
  })),
};

export const SUC_GROUP_LABELS: Record<SucItemGroup, string> = {
  winter: "동복",
  summer: "하복·생활복",
  pe: "체육복",
  extra: "추가 구매",
};

export const SUC_SOURCES = [
  {
    label: "대한민국 정책브리핑 교복비 전수조사 보도",
    url: "https://www.korea.kr/news/policyNewsView.do?newsId=148964847",
    badge: "공식" as SucEvidenceBadge,
  },
  {
    label: "교육부 카드뉴스",
    url: "https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=340&boardSeq=106111&lev=0&m=020201&opType=N&page=4&s=moe",
    badge: "공식" as SucEvidenceBadge,
  },
  {
    label: "교육부 초·중·고 교육 자료 목록",
    url: "https://www.moe.go.kr/boardCnts/listRenew.do?boardID=316&m=0302&page=-41&s=moe&type=default",
    badge: "공식" as SucEvidenceBadge,
  },
];

export const SUC_FAQ = [
  {
    question: "중학교 교복비는 평균 얼마인가요?",
    answer:
      "교육부 전수조사 기준 정장형 교복 평균 낙찰가는 26만 5,753원, 생활형 교복 평균 낙찰가는 15만 2,877원입니다. 다만 학교별 품목 수와 단가 차이가 커서 실제 구매 총액은 달라질 수 있습니다.",
  },
  {
    question: "정장형 교복과 생활형 교복은 가격 차이가 큰가요?",
    answer:
      "공개된 평균 낙찰가 기준으로는 정장형이 생활형보다 약 11만원 높습니다. 다만 생활복, 체육복, 추가 셔츠를 함께 사면 총액은 품목 구성에 따라 달라집니다.",
  },
  {
    question: "체육복도 교복비에 포함해서 봐야 하나요?",
    answer:
      "입학 초기에 함께 구매하는 경우가 많아 예산을 잡을 때는 포함하는 편이 안전합니다. 학교마다 필수 여부와 구매처가 다르므로 안내문을 확인해야 합니다.",
  },
  {
    question: "교복 지원금은 자동으로 반영되나요?",
    answer:
      "아니요. 지역, 학교, 지급 방식에 따라 금액과 조건이 달라 사용자가 직접 입력합니다. 실제 지원 여부는 학교 안내문이나 교육청 공지를 확인해야 합니다.",
  },
  {
    question: "학교 안내문을 아직 못 받았는데 계산해도 되나요?",
    answer:
      "네. 정장형, 생활형, 혼합형 프리셋으로 대략적인 예산을 먼저 볼 수 있습니다. 안내문을 받은 뒤 품목별 단가와 수량을 수정하면 더 현실적인 결과가 나옵니다.",
  },
  {
    question: "교복 셔츠는 몇 벌 사는 게 좋나요?",
    answer:
      "세탁 주기와 아이 활동량에 따라 다르지만 상의는 2벌 이상 구매하는 경우가 많습니다. 계산기에서는 추가 셔츠·생활복 상의를 따로 조절할 수 있습니다.",
  },
  {
    question: "고등학교 교복비도 이 계산기로 볼 수 있나요?",
    answer:
      "네. 중학교와 고등학교 모두 동복, 하복, 생활복, 체육복 구조가 비슷하므로 학교급을 고등학교로 선택해 계산할 수 있습니다. 다만 정확한 금액은 학교 안내문 단가 입력이 가장 중요합니다.",
  },
  {
    question: "평균보다 높게 나오면 비싼 교복인가요?",
    answer:
      "반드시 그렇지는 않습니다. 품목 수가 많거나 체육복·생활복·추가 셔츠를 함께 사면 평균보다 높게 나올 수 있습니다. 평균 대비 판정은 참고용으로만 보세요.",
  },
];

export const SUC_SEO_CONTENT = {
  introTitle: "중학교 교복비는 평균보다 품목 구성이 더 중요합니다",
  intro: [
    "중학교 입학을 앞두면 책가방이나 학용품보다 먼저 큰 금액으로 느껴지는 비용이 교복비입니다. 교복은 한 번 사면 끝나는 것처럼 보이지만 실제로는 동복, 하복, 생활복, 체육복, 추가 셔츠, 명찰과 수선비까지 한꺼번에 청구되는 경우가 많습니다.",
    "교육부가 공개한 교복비 전수조사에 따르면 전국 중·고등학교 대부분이 교복을 착용하고 있고, 정장형과 생활형을 함께 사용하는 학교가 가장 많습니다. 평균 낙찰가는 정장형이 약 26.6만원, 생활형이 약 15.3만원이지만 품목 수는 학교별로 1개에서 16개까지 차이가 납니다.",
    "이 계산기는 학교 안내문에 적힌 품목별 단가와 수량을 직접 넣어 첫 교복 구매 총액을 계산하도록 만들었습니다. 아직 안내문을 받기 전이라면 정장형, 생활형, 혼합형 프리셋으로 대략적인 예산을 먼저 볼 수 있습니다.",
    "교복 지원금이 있는 지역이라면 지원금 금액을 직접 입력해 실제 본인부담액을 볼 수 있습니다. 다만 교복 지원은 교육청과 지자체, 학교에 따라 현금·현물·바우처 등 지급 방식이 다르므로 최종 판단은 안내문과 공지를 확인해야 합니다.",
    "교복비를 줄이려면 전체 총액만 보지 말고 추가 구매 가능성이 높은 품목을 따로 봐야 합니다. 셔츠, 생활복 상의, 바지처럼 자주 입거나 세탁 주기가 짧은 품목은 처음 구매 금액보다 1년차 추가 구매 예산이 더 중요할 수 있습니다.",
  ],
  inputPoints: [
    "학교 교복 유형이 정장형, 생활형, 혼합형 중 어디에 가까운지 먼저 선택하세요.",
    "학교 안내문을 받았다면 품목별 단가와 수량을 직접 수정하세요.",
    "교복 지원금이 있으면 금액을 입력해 지원금 차감 후 본인부담액을 확인하세요.",
    "세탁 주기까지 고려하려면 표준 구매 또는 여유 구매 시나리오를 선택하세요.",
  ],
  criteria: [
    "정장형 평균 낙찰가 265,753원과 생활형 평균 낙찰가 152,877원은 교육부 전수조사 공개자료 기준입니다.",
    "품목별 기본 단가는 학교별 차이가 커서 참고값이며, 실제 결제 금액은 학교 안내문 단가를 우선해야 합니다.",
    "지원금은 지역별로 달라 자동 판정하지 않고 사용자가 직접 입력합니다.",
    "계산 결과는 구매 예산 계획을 위한 추정값이며 실제 결제 금액과 다를 수 있습니다.",
  ],
};

export const SUC_RELATED_LINKS = [
  {
    href: "/reports/elementary-school-ready-cost-2026/",
    label: "초등학교 입학 준비 비용 2026",
    description: "책가방, 실내화, 문구, 체육복까지 초등 입학 전 준비물을 확인합니다.",
  },
  {
    href: "/tools/child-tutoring-cost-calculator/",
    label: "아이 사교육비 계산기",
    description: "월 학원비와 연간 교육비가 얼마나 쌓이는지 계산합니다.",
  },
  {
    href: "/tools/year-end-tax-refund-calculator/",
    label: "연말정산 환급금 계산기",
    description: "교육비 지출과 세액공제 항목을 함께 확인합니다.",
  },
  {
    href: "/reports/high-school-private-education-cost-2026/",
    label: "고등학교 사교육비 2026",
    description: "학교급별 사교육비 평균과 부담 흐름을 비교합니다.",
  },
];

export function calcSchoolUniformCost(input: SucInput) {
  const itemMap = new Map(SUC_DEFAULT_ITEMS.map((item) => [item.id, item]));
  const groupTotals = new Map<SucItemGroup, number>();
  let uniformSubtotal = 0;

  for (const item of input.items) {
    const meta = itemMap.get(item.id);
    if (!meta) continue;
    const lineTotal = Math.max(0, item.unitPrice) * Math.max(0, item.quantity);
    uniformSubtotal += lineTotal;
    groupTotals.set(meta.group, (groupTotals.get(meta.group) ?? 0) + lineTotal);
  }

  const supportApplied = input.supportEnabled ? Math.min(Math.max(0, input.supportAmount), uniformSubtotal) : 0;
  const outOfPocket = Math.max(uniformSubtotal - supportApplied, 0);
  const extraRiskBudget = Math.round(uniformSubtotal * Math.max(0, input.extraRiskRatio));
  const firstYearBudget = outOfPocket + extraRiskBudget;
  const preset = SUC_PRESETS.find((item) => item.id === input.uniformType) ?? SUC_PRESETS[2];
  const ratioToAverage = preset.averageBidPrice > 0 ? uniformSubtotal / preset.averageBidPrice : 0;

  return {
    uniformSubtotal,
    supportApplied,
    outOfPocket,
    extraRiskBudget,
    firstYearBudget,
    groupTotals: Object.fromEntries(groupTotals),
    ratioToAverage,
    averageLabel:
      ratioToAverage < 0.85
        ? "평균보다 낮음"
        : ratioToAverage <= 1.15
          ? "평균권"
          : ratioToAverage <= 1.5
            ? "높은 편"
            : "매우 높은 편",
  };
}
