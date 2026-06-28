export type GiftPlanBadge = "공식" | "참고" | "주의";

export type GiftPlanMeta = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt: string;
  caution: string;
};

export type GiftSummaryCard = {
  label: string;
  value: string;
  note: string;
  badge: GiftPlanBadge;
};

export type GiftTimelineItem = {
  ageLabel: string;
  event: string;
  deductionLabel: string;
  amountLabel: string;
  badge: GiftPlanBadge;
  note: string;
};

export type GiftRuleCard = {
  title: string;
  body: string;
  example: string;
  badge: GiftPlanBadge;
};

export type MarriageBirthRule = {
  label: string;
  value: string;
  note: string;
};

export type HousingMyth = {
  myth: string;
  fact: string;
  risk: string;
};

export type GiftPlanScenario = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  strength: string;
  caution: string;
};

export type GiftChecklistItem = {
  text: string;
  reason: string;
  level?: "normal" | "warn";
};

export type GiftRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export type GiftFaq = {
  question: string;
  answer: string;
};

export type GiftSource = {
  label: string;
  href: string;
  note: string;
};

export type ChildLifetimeGiftPlanReport = {
  meta: GiftPlanMeta;
  summaryCards: GiftSummaryCard[];
  timeline: GiftTimelineItem[];
  rules: GiftRuleCard[];
  marriageBirthRules: MarriageBirthRule[];
  housingMyths: HousingMyth[];
  scenarios: GiftPlanScenario[];
  checklist: GiftChecklistItem[];
  relatedLinks: GiftRelatedLink[];
  faq: GiftFaq[];
  sources: GiftSource[];
};

export const childLifetimeGiftPlan: ChildLifetimeGiftPlanReport = {
  meta: {
    slug: "child-lifetime-gift-plan",
    title: "자녀 생애 증여 플랜",
    seoTitle: "자녀 생애 증여 플랜 | 0세부터 결혼·주택자금까지 증여세 한도 정리",
    description:
      "자녀에게 태어날 때부터 성년, 결혼, 출산, 주택자금 시점까지 얼마를 증여하면 증여세가 없을 수 있는지 10년 단위 공제와 혼인·출산 추가공제 기준으로 정리했습니다.",
    ogTitle: "자녀 생애 증여 플랜",
    ogDescription:
      "0세 2,000만 원, 성년 5,000만 원, 결혼·출산 추가공제까지 한눈에 보는 자녀 증여 로드맵.",
    updatedAt: "2026년 6월 기준",
    caution:
      "이 리포트는 일반적인 증여재산공제 기준을 설명하는 참고용 콘텐츠입니다. 실제 세액은 증여자, 수증자, 최근 10년 증여 이력, 재산 종류, 신고 여부에 따라 달라질 수 있습니다.",
  },
  summaryCards: [
    {
      label: "미성년 자녀",
      value: "10년 2,000만 원",
      note: "만 19세 미만 자녀 기준",
      badge: "공식",
    },
    {
      label: "성년 자녀",
      value: "10년 5,000만 원",
      note: "만 19세 이상 자녀 기준",
      badge: "공식",
    },
    {
      label: "혼인·출산",
      value: "추가 1억 원",
      note: "요건 충족 시, 합산 한도 확인",
      badge: "공식",
    },
    {
      label: "주택자금",
      value: "자금출처 관리",
      note: "별도 비과세 한도로 단정 금지",
      badge: "주의",
    },
  ],
  timeline: [
    {
      ageLabel: "0~9세",
      event: "자녀 명의 계좌·펀드 시작",
      deductionLabel: "미성년 공제",
      amountLabel: "2,000만 원",
      badge: "공식",
      note: "첫 10년 공제 구간으로 설명합니다.",
    },
    {
      ageLabel: "10~18세",
      event: "교육비 외 자산 형성",
      deductionLabel: "미성년 공제",
      amountLabel: "2,000만 원",
      badge: "공식",
      note: "이전 증여일로부터 10년 경과 여부를 확인해야 합니다.",
    },
    {
      ageLabel: "19~28세",
      event: "대학·취업·독립 준비",
      deductionLabel: "성년 공제",
      amountLabel: "5,000만 원",
      badge: "공식",
      note: "성년이 되면 공제 한도가 달라집니다.",
    },
    {
      ageLabel: "결혼 전후",
      event: "결혼자금 지원",
      deductionLabel: "성년 공제 + 혼인공제",
      amountLabel: "최대 1억 5,000만 원 검토",
      badge: "참고",
      note: "요건 충족과 최근 10년 증여 이력을 함께 확인합니다.",
    },
    {
      ageLabel: "출산 후",
      event: "출산 관련 지원",
      deductionLabel: "혼인·출산 합산 한도",
      amountLabel: "1억 원 한도 내",
      badge: "공식",
      note: "혼인공제 사용액이 있으면 남은 한도를 확인합니다.",
    },
    {
      ageLabel: "주택 구입",
      event: "전세·매매 자금 지원",
      deductionLabel: "남은 공제·차용·증빙",
      amountLabel: "상황별 확인",
      badge: "주의",
      note: "주택자금은 자금출처 소명 가능성이 중요합니다.",
    },
  ],
  rules: [
    {
      title: "공제 한도는 매년이 아니라 10년 단위입니다",
      body: "증여재산공제는 같은 증여자 그룹으로부터 받은 10년 이내 증여액을 합산해서 판단합니다.",
      example:
        "0세에 2,000만 원을 받고 5세에 다시 2,000만 원을 받으면 최근 10년 합산액을 봐야 합니다.",
      badge: "공식",
    },
    {
      title: "성년이 되면 공제 한도가 달라집니다",
      body: "미성년 자녀는 10년간 2,000만 원, 성년 자녀는 10년간 5,000만 원 공제를 검토할 수 있습니다.",
      example: "20세 이후 증여는 성년 자녀 공제 구간으로 봅니다.",
      badge: "공식",
    },
    {
      title: "증여세 0원도 기록은 남기는 편이 좋습니다",
      body: "공제 한도 이내라 세액이 없더라도, 나중에 주택 취득 자금출처 확인에서 증여 사실을 설명해야 할 수 있습니다.",
      example: "계좌이체 내역, 신고 내역, 가족 간 차용증과 상환 내역을 분리해 관리합니다.",
      badge: "주의",
    },
  ],
  marriageBirthRules: [
    {
      label: "적용 대상",
      value: "직계존속 → 직계비속",
      note: "부모·조부모가 자녀 등에게 증여하는 경우",
    },
    {
      label: "추가공제 한도",
      value: "1억 원",
      note: "혼인·출산 공제 합산 한도",
    },
    {
      label: "기본공제와 관계",
      value: "별도 검토",
      note: "성년 자녀 기본공제 5,000만 원과 함께 설명",
    },
    {
      label: "주의사항",
      value: "요건 확인",
      note: "혼인신고일·출산일 기준 기간 요건 재확인 필요",
    },
  ],
  housingMyths: [
    {
      myth: "자녀 주택자금 1억은 무조건 비과세다",
      fact: "주택자금 자체가 별도 비과세 한도라고 단정하면 위험합니다.",
      risk: "증여공제, 혼인·출산 공제, 차용 여부, 자금출처 증빙을 함께 봐야 합니다.",
    },
    {
      myth: "차용증만 쓰면 증여가 아니다",
      fact: "실제 이자 지급과 원금 상환 내역이 중요합니다.",
      risk: "상환 능력이나 이자 지급 내역이 없으면 증여로 볼 여지가 있습니다.",
    },
    {
      myth: "부모가 대신 계약금을 내도 괜찮다",
      fact: "자녀 명의 취득자금이면 자금출처 확인 대상이 될 수 있습니다.",
      risk: "계약금·중도금·잔금 흐름을 설명할 자료가 필요합니다.",
    },
  ],
  scenarios: [
    {
      id: "simple",
      title: "보수형",
      summary: "성년 이후 5,000만 원 공제를 중심으로 단순하게 관리하는 플랜",
      steps: ["미성년 시기에는 증여하지 않음", "성년 이후 5,000만 원 증여", "결혼·주택자금은 별도 계산"],
      strength: "관리하기 쉽고 신고 이력이 단순합니다.",
      caution: "어릴 때부터 자산을 불리는 효과는 작습니다.",
    },
    {
      id: "standard",
      title: "표준형",
      summary: "미성년 2,000만 원과 성년 5,000만 원을 나눠 쓰는 플랜",
      steps: ["출생 직후 또는 유년기에 2,000만 원", "10년 경과 후 추가 구간 확인", "성년 이후 5,000만 원 검토"],
      strength: "생애 초반 자산 형성과 세금 관리의 균형이 좋습니다.",
      caution: "증여일과 계좌 기록을 꾸준히 남겨야 합니다.",
    },
    {
      id: "marriage",
      title: "결혼지원형",
      summary: "성년 공제와 혼인·출산 추가공제를 결혼 시점에 집중 활용하는 플랜",
      steps: ["최근 10년 증여 이력 확인", "성년 자녀 기본공제 확인", "혼인·출산 추가공제 요건 확인"],
      strength: "결혼자금 마련에 직접적으로 연결됩니다.",
      caution: "요건을 충족하지 못하면 예상보다 과세표준이 커질 수 있습니다.",
    },
    {
      id: "housing",
      title: "주택준비형",
      summary: "증여공제, 혼인공제, 차용 설계, 자금출처 증빙을 함께 보는 플랜",
      steps: ["증여와 차용을 구분", "계약금·잔금 출처 정리", "상환 계획과 이자 지급 기록 관리"],
      strength: "내 집 마련 자금출처 설명에 유리합니다.",
      caution: "세무 검토 필요성이 가장 큽니다.",
    },
  ],
  checklist: [
    { text: "증여일, 금액, 증여자를 기록했는가", reason: "10년 합산 판단의 기준입니다." },
    { text: "자녀 명의 계좌로 실제 이체했는가", reason: "증여 사실을 설명하기 쉬워집니다." },
    { text: "증여세 신고 여부를 검토했는가", reason: "세액이 없어도 자금출처 증빙에 도움이 될 수 있습니다." },
    { text: "최근 10년 증여 이력을 정리했는가", reason: "기본공제 잔여 한도를 확인해야 합니다." },
    { text: "주택자금 목적이라면 자금출처 자료를 남겼는가", reason: "취득자금 소명에 필요할 수 있습니다.", level: "warn" },
    { text: "차용이라면 상환 내역을 남길 수 있는가", reason: "차용과 증여를 구분하는 핵심 자료입니다.", level: "warn" },
  ],
  relatedLinks: [
    {
      label: "증여세 계산기",
      href: "/tools/gift-tax-calculator/",
      description: "이번 증여금액으로 예상 증여세를 계산합니다.",
    },
    {
      label: "자녀 생애 증여세 계산기",
      href: "/tools/gift-tax-child-calculator/",
      description: "자녀 나이와 혼인·출산 여부로 남은 한도를 계산합니다.",
    },
    {
      label: "결혼비용 계산기",
      href: "/tools/wedding-budget-calculator/",
      description: "결혼자금 규모를 먼저 잡아봅니다.",
    },
    {
      label: "부동산 취득세 계산기",
      href: "/tools/real-estate-acquisition-tax/",
      description: "주택 취득 시 세금까지 함께 확인합니다.",
    },
  ],
  faq: [
    {
      question: "태어나자마자 자녀에게 2,000만 원을 증여하면 세금이 없나요?",
      answer:
        "미성년 자녀는 10년간 2,000만 원까지 증여재산공제를 적용받을 수 있습니다. 다만 같은 증여자 그룹으로부터 받은 10년 이내 증여액을 합산하므로, 이미 증여한 금액이 있으면 남은 한도를 확인해야 합니다.",
    },
    {
      question: "성년 자녀는 10년마다 5,000만 원씩 받을 수 있나요?",
      answer:
        "성년 자녀는 10년간 5,000만 원 공제를 검토할 수 있습니다. 다만 10년 기간 계산, 동일인 합산, 이전 증여 이력에 따라 실제 한도는 달라질 수 있습니다.",
    },
    {
      question: "결혼할 때 부모가 1억 5,000만 원까지 줘도 세금이 없나요?",
      answer:
        "성년 자녀 기본공제 5,000만 원과 혼인·출산 추가공제 1억 원을 함께 검토하면 1억 5,000만 원 구간이 나올 수 있습니다. 다만 혼인 요건, 최근 10년 증여 이력, 혼인·출산 공제 기사용액을 확인해야 합니다.",
    },
    {
      question: "혼인공제와 출산공제를 각각 1억 원씩 받을 수 있나요?",
      answer:
        "혼인·출산 증여재산공제는 합산 한도 1억 원으로 보는 것이 핵심입니다. 이미 혼인공제를 사용했다면 출산 시 남은 한도를 확인해야 합니다.",
    },
    {
      question: "자녀 주택자금은 따로 비과세 한도가 있나요?",
      answer:
        "주택자금이라는 이유만으로 별도 비과세 한도가 자동 적용된다고 단정하면 안 됩니다. 일반 증여공제, 혼인·출산 추가공제, 차용 관계, 자금출처 증빙을 함께 봐야 합니다.",
    },
    {
      question: "증여세가 0원이어도 신고하는 게 좋나요?",
      answer:
        "항상 의무라고 단정할 수는 없지만, 큰 금액이거나 향후 주택 취득 자금출처를 소명해야 할 가능성이 있다면 신고와 증빙을 남기는 것이 유리할 수 있습니다.",
    },
    {
      question: "조부모가 손주에게 주는 돈도 부모와 별도로 공제되나요?",
      answer:
        "직계존속 증여는 동일인 합산 규정이 중요합니다. 가족 구성과 증여자 관계에 따라 판단이 달라질 수 있으므로, 조부모 증여는 특히 10년 합산 기준을 확인해야 합니다.",
    },
  ],
  sources: [
    {
      label: "국가법령정보센터 — 상속세 및 증여세법",
      href: "https://www.law.go.kr/법령/상속세및증여세법",
      note: "증여재산공제와 혼인·출산 증여재산공제 기준 확인",
    },
    {
      label: "국세청",
      href: "https://www.nts.go.kr",
      note: "증여세 신고와 자금출처 안내 확인",
    },
    {
      label: "홈택스",
      href: "https://www.hometax.go.kr",
      note: "증여세 신고 실무 확인",
    },
  ],
};
