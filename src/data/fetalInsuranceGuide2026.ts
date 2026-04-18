export type GuideStageTone = "safe" | "warn" | "danger";

export type HeroStat = {
  label: string;
  value: string;
  note: string;
};

export type WeekStage = {
  id: string;
  label: string;
  weekRange: string;
  tone: GuideStageTone;
  summary: string;
  action: string;
};

export type CoverageCheckItem = {
  category: string;
  item: string;
  why: string;
  priority: "high" | "medium" | "low";
};

export type DuplicateCoverageTip = {
  title: string;
  body: string;
};

export type PaymentTermCompareRow = {
  term: string;
  monthly: string;
  total: string;
  suitableFor: string;
};

export type FAQItem = {
  q: string;
  a: string;
};

export const FIG_META = {
  title: "태아보험 언제 가입해야 할까? 2026 완전 가이드",
  description:
    "태아보험을 언제부터 비교해야 하는지, 12주·16주·20주·22주 이후 체크포인트와 특약 구조를 2026 기준으로 정리한 가이드 리포트입니다.",
};

export const FIG_HERO_STATS: HeroStat[] = [
  { label: "체크 시작 권장", value: "12주 이후", note: "구조 비교 시작" },
  { label: "조건 확인 집중", value: "17~21주", note: "특약 범위 재점검" },
  { label: "제한 가능 구간", value: "22주 이후", note: "일부 특약 제한 가능" },
  { label: "핵심 판단축", value: "특약 구조", note: "보험료보다 중요" },
];

export const FIG_WEEK_STAGES: WeekStage[] = [
  {
    id: "early",
    label: "비교 시작 구간",
    weekRange: "4~11주",
    tone: "safe",
    summary: "보험료보다 어떤 특약 구조를 볼지 먼저 정리하기 좋은 구간입니다.",
    action: "기본 보장 범위와 예산 범위를 먼저 정리합니다.",
  },
  {
    id: "best",
    label: "적정 검토 구간",
    weekRange: "12~16주",
    tone: "safe",
    summary: "기형아 검사 전후로 비교를 본격적으로 시작하기 좋은 구간입니다.",
    action: "태아 특약과 출생 직후 보장 항목을 빠르게 점검합니다.",
  },
  {
    id: "focus",
    label: "조건 확인 집중 구간",
    weekRange: "17~21주",
    tone: "warn",
    summary: "비교를 미루지 말고 실제 가입 가능 조건을 빠르게 확인해야 하는 구간입니다.",
    action: "주요 특약 제한 여부와 고지 사항을 다시 점검합니다.",
  },
  {
    id: "late",
    label: "제한 가능 구간",
    weekRange: "22주 이후",
    tone: "danger",
    summary: "일부 특약은 제한되거나 가입 가능한 상품 범위가 줄어들 수 있는 구간입니다.",
    action: "가입 가능한 상품 범위를 먼저 확인하고 핵심 특약부터 우선순위를 정리합니다.",
  },
];

export const FIG_COVERAGE_CHECKLIST: CoverageCheckItem[] = [
  {
    category: "우선 확인",
    item: "선천 이상 관련 특약",
    why: "가입 시기와 조건에 따라 제한 가능성이 있는 대표 항목입니다.",
    priority: "high",
  },
  {
    category: "우선 확인",
    item: "출생 직후 입원 보장",
    why: "출산 직후 체감도가 높은 보장이라 먼저 체크할 가치가 큽니다.",
    priority: "high",
  },
  {
    category: "우선 확인",
    item: "NICU·인큐베이터 관련 보장",
    why: "조산·저체중 출생과 연결될 수 있어 실제 체감도가 높습니다.",
    priority: "high",
  },
  {
    category: "구조 확인",
    item: "수술·입원 보장",
    why: "기존 실손·어린이보험과 겹치는지 먼저 봐야 합니다.",
    priority: "medium",
  },
  {
    category: "구조 확인",
    item: "질환 진단비 구조",
    why: "정액 보장인지, 조건부 보장인지 구분해서 봐야 합니다.",
    priority: "medium",
  },
];

export const FIG_DUPLICATE_TIPS: DuplicateCoverageTip[] = [
  {
    title: "비슷한 이름의 특약이 여러 개 있어도 실제 체감되는 보장은 일부만 겹칠 수 있습니다.",
    body: "진단비, 입원비, 수술비를 각각 별도로 보고 중복인지 보완인지 구분해서 확인해야 합니다.",
  },
  {
    title: "기존 실손이나 어린이보험 설계를 모르면 불필요한 것을 많이 넣기 쉽습니다.",
    body: "배우자 보험, 기존 자녀 보험, 출생 후 전환 예정 상품까지 같이 보는 흐름이 안전합니다.",
  },
];

export const FIG_PAYMENT_TERM_ROWS: PaymentTermCompareRow[] = [
  {
    term: "10년납",
    monthly: "높음",
    total: "낮음",
    suitableFor: "초기 월 부담이 가능하고 총납입액을 줄이고 싶은 경우",
  },
  {
    term: "20년납",
    monthly: "중간",
    total: "중간",
    suitableFor: "월 부담과 총납입액의 균형을 원할 때",
  },
  {
    term: "30년납",
    monthly: "낮음",
    total: "높음",
    suitableFor: "초기 부담을 낮추는 것이 더 중요한 경우",
  },
];

export const FIG_SECTION_NOTES = [
  "보험사명 최저가 경쟁보다 태아 특약 구조와 중복 보장 정리가 더 중요합니다.",
  "22주 이후는 무조건 불가가 아니라 일부 특약의 제한 가능성이 높아지는 구간으로 보는 편이 정확합니다.",
  "2026 기준으로도 가입 시기 판단의 핵심은 숫자 하나보다 주차별 체크 사인을 놓치지 않는 것입니다.",
];

export const FIG_FAQ: FAQItem[] = [
  {
    q: "태아보험은 꼭 12주 이전에 가입해야 하나요?",
    a: "꼭 그렇지는 않습니다. 다만 12주 이후부터 비교를 본격적으로 시작하기 좋고, 22주 이후에는 일부 특약 제한 가능성을 더 신경 써야 합니다.",
  },
  {
    q: "보험료 비교를 바로 하지 않는 이유는 무엇인가요?",
    a: "이 페이지는 특정 보험사의 가격 비교보다 가입 시기 판단과 특약 구조 이해에 초점을 둔 가이드 리포트이기 때문입니다.",
  },
  {
    q: "기존 보험이 있으면 무엇부터 봐야 하나요?",
    a: "실손, 입원, 수술, 진단비처럼 겹치기 쉬운 항목을 먼저 분리해서 보고, 출생 직후 체감되는 보장부터 우선순위를 정하는 것이 좋습니다.",
  },
  {
    q: "22주가 지나면 가입이 불가능한가요?",
    a: "항상 그런 것은 아닙니다. 다만 일부 특약은 가입 가능 범위가 줄어들어 선택지가 좁아질 수 있습니다.",
  },
  {
    q: "10년납, 20년납, 30년납 중 무엇이 좋은가요?",
    a: "정답은 없습니다. 총납입액을 줄이고 싶으면 짧은 납입기간, 월 부담을 낮추고 싶으면 긴 납입기간이 더 맞을 수 있습니다.",
  },
];

export const FIG_RELATED_LINKS = [
  { href: "/tools/pregnancy-birth-cost/", label: "임신·출산 비용 계산기" },
  { href: "/tools/birth-support-total/", label: "출산 지원금 총액 계산기" },
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 비용 비교 2026" },
];
