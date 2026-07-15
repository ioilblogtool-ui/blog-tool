export type BenefitCategory = "TUITION" | "HOUSING" | "JOB_PREP";

export interface WelfareBenefit {
  category: BenefitCategory;
  name: string;
  target: string;
  amount: string;
  note: string;
  relatedHref?: string;
}

export const WSB_BENEFITS: WelfareBenefit[] = [
  {
    category: "TUITION",
    name: "국가장학금 I유형",
    target: "학자금 지원 1~9구간, 성적 기준 충족자",
    amount: "연 100만~600만원(구간별), 다자녀·기초수급자는 등록금 전액까지",
    note: "이 클러스터의 국가장학금 계산기에서 예상 구간·금액을 바로 계산할 수 있습니다.",
    relatedHref: "/tools/national-scholarship-calculator-2026/",
  },
  {
    category: "TUITION",
    name: "취업 후 상환 학자금대출(ICL)",
    target: "2026년부터 소득요건 제한 폐지, 전체 대학생·대학원생",
    amount: "금리 연 1.7%, 상환기준소득(3,037만원) 초과분의 20%(대학원 25%) 원천공제",
    note: "이 클러스터의 학자금대출 계산기에서 예상 월 상환액을 계산할 수 있습니다.",
    relatedHref: "/tools/student-loan-repayment-calculator-2026/",
  },
  {
    category: "HOUSING",
    name: "청년월세지원",
    target: "무주택 청년 만 19~34세, 소득·재산 기준 충족",
    amount: "월 최대 20만원 × 최대 24개월",
    note: "2026년부터 상시 신청제로 전환 — 연중 아무 때나 신청 가능합니다.",
  },
  {
    category: "HOUSING",
    name: "행복주택",
    target: "대학생·청년·신혼부부",
    amount: "소득기준 3인가구 기준중위소득 100%(약 816만원) 이하 — 1인가구 +20%p·2인가구 +10%p 가산",
    note: "학교·직장 인접 또는 대중교통 편리한 위치에 공급됩니다.",
  },
  {
    category: "HOUSING",
    name: "청년전세임대(LH)",
    target: "대학생·취업준비생(19~39세)",
    amount: "월평균소득 100% 이하 + 자산기준(2025년 기준 총자산 2억5,400만원·자동차 4,563만원 이하)",
    note: "자산기준은 매년 갱신되므로 신청 시점에 LH청약플러스에서 최신 기준을 확인해야 합니다.",
  },
  {
    category: "JOB_PREP",
    name: "국민취업지원제도 I유형",
    target: "기준중위소득 120% 이하, 재산 5억원 이하",
    amount: "구직촉진수당 월 60만원(2026년 인상) × 최대 6개월(총 360만원), 부양가족 1인당 월 10만원 추가(최대 월 40만원)",
    note: "취업 경험이 없어도 신청 가능합니다.",
  },
  {
    category: "JOB_PREP",
    name: "국민취업지원제도 II유형",
    target: "I유형 미해당자 등",
    amount: "취업활동비용 기본 15만원 + 프로그램별 3~10만원 추가(최대 25만원)",
    note: "",
  },
  {
    category: "JOB_PREP",
    name: "취업성공수당",
    target: "국민취업지원제도 참여 후 취업 성공자",
    amount: "최대 150만원(6개월 근속 50만원 + 12개월 근속 100만원)",
    note: "국민취업지원제도 I·II유형 공통으로 적용됩니다.",
  },
];

export const WSB_CATEGORY_LABELS: Record<BenefitCategory, string> = {
  TUITION: "등록금",
  HOUSING: "주거",
  JOB_PREP: "취업준비",
};

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const WSB_META = {
  slug: "university-student-welfare-benefits-2026",
  title: "대학생 지원금 총정리 2026",
  seoTitle: "대학생 지원금 총정리 2026 | 등록금·주거·취업 뭐 받을 수 있나",
  seoDescription:
    "등록금·주거·취업준비 카테고리별로 대학생이 받을 수 있는 2026년 지원제도를 대상·지원금액·신청 조건까지 한 번에 정리합니다.",
  description: "등록금·주거·취업준비 카테고리별 2026년 대학생 지원제도를 정리하는 리포트입니다.",
  updatedAt: "2026-07-15",
  dataNote:
    "지원금액·소득기준은 2026년 확인 시점 기준이며 제도 특성상 매년 갱신됩니다. 정확한 최신 조건과 신청 방법은 각 제도의 공식 사이트(한국장학재단, LH청약플러스, 고용24 등)에서 확인해야 합니다.",
};

export const WSB_FAQ: FaqItem[] = [
  {
    question: "대학생이 등록금 외에 받을 수 있는 지원은 뭐가 있나요?",
    answer:
      "등록금 지원(국가장학금, 학자금대출)뿐 아니라 주거 지원(청년월세지원, 행복주택, 청년전세임대), 취업준비 지원(국민취업지원제도)까지 카테고리별로 받을 수 있는 제도가 다양합니다.",
  },
  {
    question: "청년월세지원과 행복주택 중 뭐가 더 빠른가요?",
    answer:
      "청년월세지원은 2026년부터 상시 신청제라 신청 즉시 심사가 진행되지만, 행복주택은 공급 물량과 경쟁률에 따라 입주까지 시간이 걸릴 수 있습니다.",
  },
  {
    question: "국민취업지원제도는 재학생도 신청할 수 있나요?",
    answer:
      "국민취업지원제도는 원칙적으로 구직자를 대상으로 하므로 졸업(예정)자나 졸업유예 상태에서 신청하는 경우가 많습니다. 정확한 대상 요건은 고용24에서 확인해야 합니다.",
  },
  {
    question: "여러 제도를 동시에 받을 수 있나요?",
    answer:
      "등록금(국가장학금)과 주거 지원(청년월세지원 등), 취업준비 지원(국민취업지원제도)은 목적이 달라 동시에 받는 경우가 많습니다. 다만 중복 지원이 제한되는 조합도 있어 각 제도 공고를 확인해야 합니다.",
  },
  {
    question: "청년전세임대 자산기준은 왜 2025년 기준으로 나오나요?",
    answer:
      "2026년 갱신치가 이 리포트 작성 시점에 확인되지 않아 최신 확인된 2025년 기준을 표기했습니다. 신청 전 LH청약플러스에서 최신 기준을 반드시 확인하세요.",
  },
  {
    question: "학자금대출과 국가장학금을 같이 받을 수 있나요?",
    answer: "네, 국가장학금으로 등록금 일부를 지원받고 나머지를 학자금대출로 충당하는 방식이 일반적입니다.",
  },
];

export const WSB_SEO_INTRO = [
  "대학생이 받을 수 있는 지원제도는 등록금·주거·취업준비로 나뉘어 있지만 각각 다른 기관(한국장학재단, LH, 고용노동부)이 운영해 한눈에 파악하기 어렵습니다. 이 리포트는 2026년 기준 대표 제도 8가지를 카테고리별로 정리해 '나는 뭘 받을 수 있는지' 빠르게 확인할 수 있게 합니다.",
  "등록금은 국가장학금(소득분위별 최대 연 600만 원)과 학자금대출(2026년 금리 1.7%, 소득요건 제한 폐지)로 나뉘고, 주거는 청년월세지원(월 최대 20만 원, 2026년 상시 신청제)·행복주택·청년전세임대로, 취업준비는 국민취업지원제도(구직촉진수당 월 60만 원 등)로 구성됩니다.",
  "여러 제도를 동시에 받는 경우가 많지만 목적과 신청 시점이 다르므로, 등록금은 학기 시작 전, 주거는 입주 계획 시점, 취업준비는 졸업 전후로 각각 신청 타이밍을 따로 챙겨야 합니다.",
  "이 리포트의 지원금액·소득기준은 2026년 확인 시점 기준이며 매년 갱신됩니다. 정확한 최신 조건과 신청 방법은 반드시 각 제도의 공식 사이트에서 확인해야 합니다.",
];

export const WSB_SEO_CRITERIA = [
  "국가장학금·학자금대출 수치는 이 클러스터의 계산기와 동일한 2026년 확정 기준을 사용합니다.",
  "청년월세지원·행복주택·청년전세임대는 2026년 확인된 최신 조건이며, 자산기준처럼 갱신 전인 항목은 별도 표기했습니다.",
  "국민취업지원제도 지원금액은 2026년 인상분을 반영했습니다.",
  "모든 제도는 매년 조건이 바뀌므로 신청 전 공식 사이트에서 최신 공고를 확인해야 합니다.",
];

export const WSB_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "등록금·주거비·생활비를 반영한 4년 실부담금을 계산합니다.",
  },
  {
    href: "/tools/national-scholarship-calculator-2026/",
    label: "국가장학금 계산기 2026",
    description: "소득분위별 예상 국가장학금 지원금을 계산합니다.",
  },
  {
    href: "/tools/student-loan-repayment-calculator-2026/",
    label: "학자금대출 계산기 2026",
    description: "졸업 후 예상 월 상환액을 계산합니다.",
  },
];
