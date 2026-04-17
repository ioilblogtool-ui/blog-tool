export type Stage =
  | "planning"
  | "analysis"
  | "development"
  | "design"
  | "deployment"
  | "operation";

export type UsageLevel = "light" | "normal" | "heavy";
export type BudgetTier = "under30" | "30to60" | "60to100" | "over100";
export type BundleType = "budget" | "balanced" | "full";
export type ToolCategory = "general" | "dev" | "research" | "design" | "docs";

export interface AiTool {
  id: string;
  name: string;
  monthlyUsd: number;
  yearlyUsd?: number;
  category: ToolCategory;
  stages: Stage[];
  primaryStage: Stage;
  tagline: string;
  officialUrl: string;
  badge?: string;
}

export interface PresetBundle {
  id: string;
  name: string;
  toolIds: string[];
  targetStages: Stage[];
  monthlyCostUsd: number;
  type: BundleType;
  description: string;
  forWhom: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export interface SourceLink {
  href: string;
  source: string;
  title: string;
  desc: string;
}

export const STAGE_LABELS: Record<Stage, string> = {
  planning: "기획",
  analysis: "분석",
  development: "개발",
  design: "디자인",
  deployment: "배포",
  operation: "운영",
};

export const STAGE_ICONS: Record<Stage, string> = {
  planning: "📋",
  analysis: "🔍",
  development: "💻",
  design: "🎨",
  deployment: "🚀",
  operation: "📊",
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  general: "범용",
  dev: "개발",
  research: "리서치",
  design: "디자인",
  docs: "문서",
};

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  under30: "$30 이하",
  "30to60": "$30~$60",
  "60to100": "$60~$100",
  over100: "$100 이상",
};

export const AI_TOOLS: AiTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    monthlyUsd: 20,
    category: "general",
    stages: ["planning", "analysis", "deployment", "operation"],
    primaryStage: "planning",
    tagline: "범용 문서, 아이디어, 분석, 배포 문서까지 넓게 커버하는 기본 축",
    officialUrl: "https://openai.com/chatgpt/pricing/",
    badge: "무료플랜 있음",
  },
  {
    id: "claude",
    name: "Claude Pro",
    monthlyUsd: 20,
    category: "general",
    stages: ["planning", "analysis", "operation"],
    primaryStage: "planning",
    tagline: "긴 문서 정리, 자연스러운 글쓰기, 코드 리뷰에 강점",
    officialUrl: "https://claude.ai/upgrade",
    badge: "무료플랜 있음",
  },
  {
    id: "cursor",
    name: "Cursor Pro",
    monthlyUsd: 20,
    category: "dev",
    stages: ["development"],
    primaryStage: "development",
    tagline: "개발 집중형 AI 코드 에디터. 사이드프로젝트 런치 조합의 핵심",
    officialUrl: "https://www.cursor.com/pricing",
    badge: "무료플랜 있음",
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    monthlyUsd: 20,
    category: "research",
    stages: ["analysis", "planning"],
    primaryStage: "analysis",
    tagline: "출처 기반 리서치와 빠른 조사에 강한 검색형 AI",
    officialUrl: "https://www.perplexity.ai/pro",
    badge: "무료플랜 있음",
  },
  {
    id: "canva",
    name: "Canva Pro",
    monthlyUsd: 15,
    category: "design",
    stages: ["design"],
    primaryStage: "design",
    tagline: "배너, 썸네일, SNS 콘텐츠 제작처럼 시각화 비중이 큰 작업용",
    officialUrl: "https://www.canva.com/pricing/",
    badge: "무료플랜 있음",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    monthlyUsd: 10,
    category: "docs",
    stages: ["planning", "operation"],
    primaryStage: "operation",
    tagline: "문서 요약과 운영 메모 자동화에 적합한 워크스페이스형 AI",
    officialUrl: "https://www.notion.com/pricing",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    monthlyUsd: 10,
    category: "dev",
    stages: ["development"],
    primaryStage: "development",
    tagline: "IDE 안에서 가볍게 보조받는 개발 중심 AI. 저예산 개발 대안",
    officialUrl: "https://github.com/features/copilot",
    badge: "무료플랜 있음",
  },
  {
    id: "gamma",
    name: "Gamma",
    monthlyUsd: 10,
    category: "docs",
    stages: ["planning", "design"],
    primaryStage: "planning",
    tagline: "기획 문서와 발표자료 초안을 빠르게 만드는 슬라이드형 AI",
    officialUrl: "https://gamma.app/pricing",
    badge: "무료플랜 있음",
  },
];

export const PRESET_BUNDLES: PresetBundle[] = [
  {
    id: "starter",
    name: "절약형 스타터",
    toolIds: ["chatgpt"],
    targetStages: ["planning", "analysis", "operation"],
    monthlyCostUsd: 20,
    type: "budget",
    description: "하나의 범용 툴로 기획, 분석, 운영을 먼저 커버하는 가장 무난한 시작점",
    forWhom: "AI를 처음 도입하거나 예산을 최소화하고 싶은 1인 사용자",
  },
  {
    id: "mvp",
    name: "MVP 런치 스택",
    toolIds: ["chatgpt", "cursor", "claude"],
    targetStages: ["planning", "development", "deployment"],
    monthlyCostUsd: 60,
    type: "balanced",
    description: "기획, 개발, 배포 문서까지 연결되는 1인 빌더 기본 조합",
    forWhom: "사이드프로젝트 개발자, 1인 SaaS 빌더",
  },
  {
    id: "planner",
    name: "기획자 솔로 스택",
    toolIds: ["chatgpt", "claude", "perplexity"],
    targetStages: ["planning", "analysis"],
    monthlyCostUsd: 60,
    type: "balanced",
    description: "조사, 요약, 문서 작성까지 리서치 강도가 높은 업무용 조합",
    forWhom: "기획자, PM, 리서처, 콘텐츠 전략가",
  },
  {
    id: "content",
    name: "콘텐츠 운영 스택",
    toolIds: ["chatgpt", "canva", "notion-ai"],
    targetStages: ["planning", "design", "operation"],
    monthlyCostUsd: 45,
    type: "balanced",
    description: "콘텐츠 기획과 시각화, 운영 문서 정리를 함께 가져가는 조합",
    forWhom: "크리에이터, 마케팅 운영자, SNS 담당자",
  },
  {
    id: "full",
    name: "풀 자동화 스택",
    toolIds: ["chatgpt", "claude", "cursor", "canva"],
    targetStages: ["planning", "analysis", "development", "design", "operation"],
    monthlyCostUsd: 75,
    type: "full",
    description: "기획부터 개발, 디자인, 운영까지 여러 단계를 혼자 커버하는 풀 구성",
    forWhom: "프리랜서, 1인 에이전시, 다기능 빌더",
  },
];

export const AI_CALC_META = {
  slug: "ai-stack-cost-calculator",
  title: "AI 스택 비용 계산기",
  subtitle:
    "ChatGPT, Claude, Cursor, Perplexity, Canva, Notion AI 같은 툴을 조합했을 때 월간·연간 비용과 예산별 추천 스택을 바로 확인하는 계산기입니다.",
  updatedAt: "2026년 4월",
  defaultExchangeRate: 1380,
  priceNote:
    "가격 정보는 각 서비스 공식 페이지의 개인 플랜 기준 정가를 참고해 수동 정리한 값입니다. 실제 청구액은 환율, VAT, 카드 수수료, 연간 결제 할인 여부에 따라 달라질 수 있습니다.",
};

export const AI_DEFAULT_STATE = {
  selectedStages: ["planning", "development"] as Stage[],
  intensity: "normal" as UsageLevel,
  budget: "30to60" as BudgetTier,
  currentTools: [] as string[],
  exchangeRate: AI_CALC_META.defaultExchangeRate,
  vatIncluded: false,
};

export const AI_FAQ: FaqItem[] = [
  {
    question: "AI 툴 비용은 왜 실제 결제액과 다를 수 있나요?",
    answer:
      "환율, 부가세, 카드 해외결제 수수료, 연간 결제 할인 여부에 따라 실제 청구액은 달라질 수 있습니다. 이 계산기는 공식 월정가 기준으로 감을 잡기 위한 참고용 도구입니다.",
  },
  {
    question: "여러 AI 툴을 같이 쓰는 게 비효율인가요?",
    answer:
      "역할이 다르면 꼭 비효율은 아닙니다. 다만 기획과 운영 영역은 ChatGPT와 Claude가 많이 겹칠 수 있어, 두 개를 동시에 유지하기보다 목적에 맞게 하나를 고르는 경우가 많습니다.",
  },
  {
    question: "1인 개발자에게 가장 자주 보이는 조합은 무엇인가요?",
    answer:
      "기본적으로는 ChatGPT와 Cursor 조합이 가장 흔합니다. 긴 문서 정리나 코드 리뷰 비중이 높아지면 Claude를 추가하고, 콘텐츠 운영 비중이 생기면 Canva나 Notion AI가 붙는 패턴이 많습니다.",
  },
  {
    question: "예산이 $30 이하라면 어떤 툴부터 시작하는 게 좋나요?",
    answer:
      "범용성이 가장 넓은 ChatGPT Plus 하나로 먼저 시작하는 편이 가장 무난합니다. 개발 비중이 압도적으로 높다면 Copilot 같은 더 저렴한 개발 보조 툴이 더 효율적일 수도 있습니다.",
  },
  {
    question: "팀 단위 비용도 볼 수 있나요?",
    answer:
      "현재 버전은 개인 또는 1인 빌더 기준으로 설계했습니다. 다만 추천 카드와 총액 구조를 팀 인원 수 기준으로 확장하기 쉽게 데이터를 구성해 두었고, 이후 버전에서는 팀 플랜 손익 비교로 확장할 수 있습니다.",
  },
];

export const AI_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/fire-calculator/", label: "파이어 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
  { href: "/tools/", label: "전체 도구 라이브러리" },
];

export const AI_NEXT_CONTENT = {
  eyebrow: "같이 보면 좋은 계산기",
  title: "AI 구독료를 계산했다면 개인 재무와 운영 여력도 같이 보세요",
  desc:
    "AI 비용은 보통 단독 지출이 아니라 사이드프로젝트 운영비나 개인 생산성 지출의 일부로 쌓입니다. 그래서 월 구독료를 본 뒤에는 투자 여력이나 장기 현금흐름 계산기로 이어보는 흐름이 자연스럽습니다.",
  href: "/tools/fire-calculator/",
  cta: "파이어 계산기 보기",
  badges: ["운영비", "구독료", "현금흐름"],
  sub: [
    {
      href: "/tools/dca-investment-calculator/",
      title: "적립식 투자 수익 비교 계산기",
      desc: "구독료를 빼고 남는 금액을 장기 투자했을 때의 차이를 같이 비교해볼 수 있습니다.",
      badges: ["투자 비교"],
    },
    {
      href: "/tools/home-purchase-fund/",
      title: "내집마련 자금 계산기",
      desc: "고정비를 관리하는 맥락에서 월 구독료가 장기 자금 계획에 미치는 영향도 같이 볼 수 있습니다.",
      badges: ["자금 계획"],
    },
    {
      href: "/tools/",
      title: "도구 라이브러리",
      desc: "연봉, 자산, 주거비처럼 실제 의사결정에 필요한 다른 계산기들도 같이 확인할 수 있습니다.",
      badges: ["전체 보기"],
    },
  ],
};

export const AI_SOURCE_LINKS: SourceLink[] = AI_TOOLS.map((tool) => ({
  href: tool.officialUrl,
  source: tool.name,
  title: `${tool.name} 공식 가격 페이지`,
  desc: `${tool.name} 개인 요금과 플랜 구성을 공식 페이지에서 직접 확인할 수 있습니다.`,
}));
