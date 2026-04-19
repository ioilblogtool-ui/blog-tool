export type ComparisonProduct = {
  id: "pension-saving" | "irp" | "annuity-insurance";
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

export type ComparisonRow = {
  label: string;
  pensionSaving: string;
  irp: string;
  annuityInsurance: string;
};

export type ScenarioCard = {
  id: string;
  title: string;
  target: string;
  recommendation: string;
  caution: string;
};

export const PIC26_META = {
  slug: "pension-irp-comparison-2026",
  title: "연금저축 vs IRP 비교 2026 | 세액공제·운용·수령 방식 한눈에",
  description:
    "연금저축, IRP, 연금보험의 차이를 2026 기준으로 비교합니다. 세액공제 한도, 운용 자유도, 중도 인출, 퇴직금 이전, 연금 수령 방식까지 표와 예시로 쉽게 정리했습니다.",
  eyebrow: "연금 비교 리포트",
  heroTitle: "연금저축 vs IRP 비교 2026",
  heroDescription: "세액공제, 운용, 퇴직금, 연금 수령까지 한눈에 비교합니다.",
};

export const PENSION_IRP_TOP_SUMMARY = [
  {
    title: "절세 중심이면",
    conclusion: "연금저축 우선 + IRP 보완이 이해하기 쉽습니다.",
    description: "운용 자유도와 세액공제 흐름을 같이 가져가기에 가장 무난한 구조입니다.",
  },
  {
    title: "퇴직금 관리까지 보면",
    conclusion: "IRP 비중이 커집니다.",
    description: "퇴직금 이전과 연금 수령 연결성은 IRP 쪽이 더 분명합니다.",
  },
  {
    title: "안정성과 구조를 따로 보면",
    conclusion: "연금보험은 같은 잣대로만 비교하면 안 됩니다.",
    description: "세액공제보다 보장 구조, 공시이율, 비과세 요건을 따로 봐야 합니다.",
  },
];

export const PENSION_IRP_PRODUCTS: ComparisonProduct[] = [
  {
    id: "pension-saving",
    name: "연금저축",
    summary: "세액공제와 운용 유연성 사이 균형이 좋은 기본 축",
    strengths: [
      "펀드, ETF 등 운용 선택 폭이 상대적으로 넓습니다.",
      "세액공제를 받으면서도 IRP보다 인출 제약 설명이 단순한 편입니다.",
      "직장인과 자영업자 모두 접근하기 쉬운 기본형 계좌입니다.",
    ],
    weaknesses: [
      "퇴직금을 직접 받을 수는 없습니다.",
      "절세만 보고 넣으면 실제 운용 전략이 비어 있을 수 있습니다.",
    ],
  },
  {
    id: "irp",
    name: "IRP",
    summary: "세액공제와 퇴직금 이전에 강하지만 제약도 함께 있는 축",
    strengths: [
      "퇴직금 수령과 연금화 설계에 바로 연결됩니다.",
      "연금저축과 조합하면 세액공제 한도 관리가 쉬워집니다.",
      "노후 자금 전용 계좌라는 점이 명확해 장기 계획에 맞추기 좋습니다.",
    ],
    weaknesses: [
      "중도 인출과 운용 제약을 먼저 이해해야 합니다.",
      "세액공제만 보고 IRP 비중을 과하게 높이면 유동성이 답답해질 수 있습니다.",
    ],
  },
  {
    id: "annuity-insurance",
    name: "연금보험",
    summary: "절세 계좌보다 보험형 구조와 비과세 요건을 따로 봐야 하는 축",
    strengths: [
      "안정성 선호 사용자에게는 구조가 단순하게 느껴질 수 있습니다.",
      "상품에 따라 확정형 느낌을 기대하는 수요와 맞을 수 있습니다.",
    ],
    weaknesses: [
      "연금저축·IRP와 같은 세액공제 계좌로 단순 비교하면 오해가 생깁니다.",
      "운용 자유도와 비용 구조는 상품별 차이가 큽니다.",
    ],
  },
];

export const PENSION_IRP_COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "세액공제",
    pensionSaving: "가능",
    irp: "가능",
    annuityInsurance: "일반적으로 없음",
  },
  {
    label: "퇴직금 수령",
    pensionSaving: "불가",
    irp: "가능",
    annuityInsurance: "불가",
  },
  {
    label: "운용 자유도",
    pensionSaving: "높음",
    irp: "중간",
    annuityInsurance: "낮음",
  },
  {
    label: "중도 인출",
    pensionSaving: "상대적으로 유연",
    irp: "제약 큼",
    annuityInsurance: "상품별 상이",
  },
  {
    label: "수령 방식",
    pensionSaving: "연금·해지 구조 이해 쉬움",
    irp: "연금화 설계에 유리",
    annuityInsurance: "보험 계약 구조 확인 필요",
  },
  {
    label: "추천 성향",
    pensionSaving: "연말정산 + 장기투자 기본형",
    irp: "퇴직금 + 절세 보완형",
    annuityInsurance: "안정성 선호형",
  },
];

export const PENSION_IRP_TAX_GUIDE = [
  {
    title: "연금저축만 넣는 경우",
    point: "기본 구조를 단순하게 가져가고 싶은 사용자에게 설명이 쉽습니다.",
    example: "연말정산 환급을 먼저 챙기고 운용 자유도도 포기하지 않는 흐름입니다.",
  },
  {
    title: "연금저축 + IRP 조합",
    point: "세액공제 한도를 더 넓게 활용하려는 직장인에게 자주 보이는 조합입니다.",
    example: "연금저축을 기본 축으로 두고, 부족분을 IRP로 보완하는 식으로 이해하면 쉽습니다.",
  },
  {
    title: "소득 구간별 체감",
    point: "같은 납입액이라도 환급 체감은 소득 구간과 연말정산 구조에 따라 다릅니다.",
    example: "절세만 보지 말고 이후의 운용 전략과 유동성까지 같이 보는 편이 안전합니다.",
  },
];

export const PENSION_IRP_SCENARIOS: ScenarioCard[] = [
  {
    id: "office-worker-basic",
    title: "직장인 초보형",
    target: "연말정산과 장기 적립을 함께 챙기고 싶은 사용자",
    recommendation: "연금저축 우선, 이후 IRP 보완",
    caution: "IRP만 과하게 넣으면 유동성 제약이 커질 수 있습니다.",
  },
  {
    id: "refund-focused",
    title: "연말정산 환급 중심형",
    target: "올해 환급 체감을 우선순위로 두는 사용자",
    recommendation: "세액공제 한도를 먼저 이해하고 연금저축 + IRP 조합 검토",
    caution: "환급만 보고 가입하면 이후 운용이 방치될 수 있습니다.",
  },
  {
    id: "retirement-transfer",
    title: "퇴직금 관리형",
    target: "퇴직금 이전과 연금 수령까지 함께 고려하는 사용자",
    recommendation: "IRP 중심 설계",
    caution: "인출 제약과 상품 선택 폭을 같이 확인해야 합니다.",
  },
  {
    id: "self-employed",
    title: "자영업자형",
    target: "퇴직금은 없지만 세액공제와 장기 노후자금을 함께 보고 싶은 사용자",
    recommendation: "연금저축 중심 접근",
    caution: "현금흐름 변동이 크면 납입 지속 가능성을 먼저 봐야 합니다.",
  },
  {
    id: "stability-first",
    title: "안정성 선호형",
    target: "투자형 변동성이 부담스럽고 구조적 안정감을 중요하게 보는 사용자",
    recommendation: "연금보험은 별도 축으로 비교",
    caution: "연금저축·IRP와 같은 상품처럼 비교하면 오해가 생길 수 있습니다.",
  },
];

export const PENSION_IRP_MISTAKES = [
  "연금저축과 IRP 한도를 각각 따로 착각해 납입 계획을 잘못 세우는 경우",
  "IRP의 인출 제약을 모르고 가입해서 유동성 부족을 겪는 경우",
  "세액공제만 보고 선택하고 실제 운용 전략은 비워두는 경우",
  "연금보험을 연금저축·IRP와 같은 절세 계좌처럼 이해하는 경우",
  "퇴직금 수령 구조를 몰라 IRP 연결 시점을 놓치는 경우",
];

export const PENSION_IRP_FAQ = [
  {
    question: "연금저축과 IRP는 둘 다 가입해야 하나요?",
    answer:
      "반드시 둘 다 가입해야 하는 것은 아닙니다. 다만 많은 직장인에게는 연금저축을 기본 축으로 두고 필요하면 IRP를 보완하는 설명이 가장 이해하기 쉽습니다.",
  },
  {
    question: "연금저축만으로도 세액공제를 받을 수 있나요?",
    answer:
      "일반적으로는 가능합니다. 이 페이지는 세액공제 가능 여부와 구조 차이를 비교해 보여주고, 실제 한도와 환급 체감은 연말정산 상황에 따라 달라질 수 있다는 점을 함께 안내합니다.",
  },
  {
    question: "IRP는 왜 퇴직금 계좌로 많이 쓰나요?",
    answer:
      "IRP는 퇴직금 수령과 연금화 설계 연결성이 크기 때문입니다. 그래서 단순 절세 계좌가 아니라 퇴직 이후 수령 구조까지 같이 보는 축으로 이해하는 편이 좋습니다.",
  },
  {
    question: "연금보험은 IRP와 같은 상품인가요?",
    answer:
      "같은 상품으로 보면 안 됩니다. 연금보험은 보험형 구조와 비과세 요건, 상품별 조건을 따로 봐야 하고, 연금저축·IRP는 세액공제 계좌라는 점에서 성격이 다릅니다.",
  },
  {
    question: "중도 인출은 어느 쪽이 더 유연한가요?",
    answer:
      "일반적인 설명 기준으로는 연금저축이 IRP보다 상대적으로 유연하게 느껴질 수 있습니다. 반면 IRP는 인출 제약이 크기 때문에 가입 전에 유동성 계획을 먼저 보는 편이 안전합니다.",
  },
  {
    question: "결국 어떤 계좌를 먼저 봐야 하나요?",
    answer:
      "직장인 초보라면 연금저축과 IRP의 차이를 먼저 이해하고, 퇴직금 이전 대상자라면 IRP 구조를 우선 보는 편이 자연스럽습니다. 그다음 실제 적립금 기준 월 수령액은 계산기로 이어서 확인하면 됩니다.",
  },
];

export const PENSION_IRP_RELATED_LINKS = [
  { href: "/tools/irp-pension-calculator/", label: "내 IRP 예상 수령액 계산하기" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 수령액도 함께 보기" },
  { href: "/tools/retirement/", label: "은퇴 후 필요한 생활비 계산하기" },
  { href: "/reports/national-pension-generational-comparison-2026/", label: "국민연금 세대 비교 리포트" },
];
