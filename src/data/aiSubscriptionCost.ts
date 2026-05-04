export type SubscriptionMode = "personal" | "team";

export type ToolCategory =
  | "chatbot"
  | "coding"
  | "research"
  | "document"
  | "image"
  | "workspace"
  | "custom";

export type PricingUnit = "account" | "seat" | "custom";
export type CurrencyCode = "USD" | "KRW";

export interface AiSubscriptionTool {
  id: string;
  name: string;
  category: ToolCategory;
  categoryLabel: string;
  defaultMonthlyUsd: number;
  defaultMonthlyKrw?: number;
  currency: CurrencyCode;
  pricingUnit: PricingUnit;
  isEditable: boolean;
  defaultSelected?: boolean;
  note: string;
  officialUrl?: string;
}

export interface DuplicateRule {
  id: string;
  categoryIds: ToolCategory[];
  toolIds?: string[];
  threshold: number;
  title: string;
  message: string;
  recommendation: string;
}

export interface SubscriptionPreset {
  id: string;
  label: string;
  description: string;
  mode: SubscriptionMode;
  headcount: number;
  selectedToolIds: string[];
  monthlySavedHours: number;
  hourlyValueKrw: number;
}

export interface SubscriptionFaqItem {
  question: string;
  answer: string;
}

export interface SubscriptionRelatedLink {
  href: string;
  label: string;
}

export const AI_SUBSCRIPTION_META = {
  slug: "ai-subscription-cost",
  title: "AI 도구 월비용 계산기",
  subtitle:
    "ChatGPT, Claude, Copilot, Perplexity, Notion AI 같은 AI 구독료를 한 달 기준으로 합산하고, 시간 절감 효과 대비 ROI를 추정합니다.",
  updatedAt: "2026년 5월",
  defaultExchangeRate: 1400,
  defaultMonthlyWorkHours: 160,
  defaultHourlyValueKrw: 30000,
  defaultMonthlySavedHours: 10,
  caution:
    "가격은 실시간 견적이 아니라 기본 추천값입니다. 실제 결제액은 요금제 변경, 환율, 부가세, 카드 수수료, 연간 결제 여부에 따라 달라질 수 있습니다.",
} as const;

export const AI_SUBSCRIPTION_TOOLS: AiSubscriptionTool[] = [
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "chatbot",
    categoryLabel: "범용 AI 챗봇",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    defaultSelected: true,
    note: "범용 글쓰기, 분석, 코딩 보조에 넓게 쓰이는 개인 구독 기준값",
    officialUrl: "https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus",
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    category: "chatbot",
    categoryLabel: "범용 AI 챗봇",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "긴 문서, 글쓰기, 코드 리뷰 목적의 개인 구독 기준값",
    officialUrl: "https://claude.com/pricing",
  },
  {
    id: "github-copilot-pro",
    name: "GitHub Copilot Pro",
    category: "coding",
    categoryLabel: "개발 보조",
    defaultMonthlyUsd: 10,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "개인 개발자용 기준값. 2026년 4월 이후 신규 가입 제한과 사용량 과금 전환 공지를 확인",
    officialUrl: "https://docs.github.com/en/copilot/get-started/plans",
  },
  {
    id: "perplexity-pro",
    name: "Perplexity Pro",
    category: "research",
    categoryLabel: "리서치",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "출처 기반 검색과 리서치 목적 구독 기준값",
    officialUrl: "https://www.perplexity.ai/enterprise/pricing",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "document",
    categoryLabel: "문서·업무",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "seat",
    isEditable: true,
    note: "Notion AI 포함 플랜 기준 참고값. 워크스페이스 요금제에 맞게 직접 수정",
    officialUrl: "https://www.notion.com/pricing",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "image",
    categoryLabel: "이미지 생성",
    defaultMonthlyUsd: 10,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "실제 사용 티어에 맞게 월 환산 금액을 수정해서 계산",
    officialUrl: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
  },
  {
    id: "google-ai-pro",
    name: "Google AI Pro",
    category: "workspace",
    categoryLabel: "구글 생태계",
    defaultMonthlyUsd: 19.99,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "Gemini와 Google 생태계 연동 목적 구독 기준값",
    officialUrl: "https://gemini.google/subscriptions/",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    categoryLabel: "개발 IDE",
    defaultMonthlyUsd: 20,
    currency: "USD",
    pricingUnit: "account",
    isEditable: true,
    note: "AI 코드 에디터 구독 기준값. 실제 요금제에 맞게 수정",
    officialUrl: "https://www.cursor.com/pricing",
  },
];

export const AI_SUBSCRIPTION_PRESETS: SubscriptionPreset[] = [
  {
    id: "office-worker",
    label: "직장인 문서·리서치형",
    description: "ChatGPT, Notion AI, Perplexity를 쓰는 사무직 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["chatgpt-plus", "notion-ai", "perplexity-pro"],
    monthlySavedHours: 8,
    hourlyValueKrw: 25000,
  },
  {
    id: "developer",
    label: "개발자 코딩 보조형",
    description: "Claude, Copilot, Cursor를 함께 쓰는 개발자 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["claude-pro", "github-copilot-pro", "cursor"],
    monthlySavedHours: 12,
    hourlyValueKrw: 35000,
  },
  {
    id: "creator",
    label: "콘텐츠 제작형",
    description: "ChatGPT, Perplexity, Midjourney를 쓰는 콘텐츠 제작자 기준",
    mode: "personal",
    headcount: 1,
    selectedToolIds: ["chatgpt-plus", "perplexity-pro", "midjourney"],
    monthlySavedHours: 8,
    hourlyValueKrw: 20000,
  },
  {
    id: "startup-team",
    label: "스타트업 5인 팀",
    description: "팀원 5명이 AI 구독을 함께 쓰는 운영 검토 기준",
    mode: "team",
    headcount: 5,
    selectedToolIds: ["chatgpt-plus", "github-copilot-pro", "notion-ai"],
    monthlySavedHours: 30,
    hourlyValueKrw: 30000,
  },
];

export const AI_DUPLICATE_RULES: DuplicateRule[] = [
  {
    id: "multi-chatbot",
    categoryIds: ["chatbot"],
    threshold: 2,
    title: "범용 AI 챗봇 중복 가능",
    message: "ChatGPT와 Claude처럼 비슷한 역할의 범용 챗봇을 2개 이상 구독 중입니다.",
    recommendation: "글쓰기, 코딩, 문서 분석 중 실제 주력 용도와 사용 빈도를 기준으로 줄일 수 있는지 점검하세요.",
  },
  {
    id: "coding-tools",
    categoryIds: ["coding"],
    threshold: 2,
    title: "개발 보조 도구 중복 가능",
    message: "Copilot과 Cursor처럼 개발 보조 도구가 겹칠 수 있습니다.",
    recommendation: "IDE 자동완성, 코드 리뷰, 리팩터링 중 어떤 작업에 주로 쓰는지 나눠서 판단하세요.",
  },
  {
    id: "research-overlap",
    categoryIds: ["chatbot", "research"],
    toolIds: ["chatgpt-plus", "perplexity-pro"],
    threshold: 2,
    title: "검색·리서치 기능 중복 가능",
    message: "범용 챗봇의 검색 기능과 리서치 전용 도구가 일부 겹칠 수 있습니다.",
    recommendation: "출처 확인이 중요한 조사 업무가 많으면 유지하고, 단순 검색 위주라면 구독 축소를 검토하세요.",
  },
  {
    id: "document-overlap",
    categoryIds: ["chatbot", "document"],
    toolIds: ["chatgpt-plus", "notion-ai"],
    threshold: 2,
    title: "문서 작성 기능 중복 가능",
    message: "ChatGPT와 Notion AI 모두 문서 작성과 요약에 쓰일 수 있습니다.",
    recommendation: "Notion 내부 협업 문서 자동화가 많으면 Notion AI를 유지하고, 외부 문서 작성 중심이면 범용 챗봇 중심으로 통합하세요.",
  },
];

export const AI_SUBSCRIPTION_FAQ: SubscriptionFaqItem[] = [
  {
    question: "ChatGPT와 Claude를 둘 다 구독할 필요가 있나요?",
    answer:
      "둘 다 범용 AI 도구라 용도가 겹치는 부분이 많습니다. 글쓰기, 코딩, 문서 분석을 모두 자주 한다면 병행 가치가 있지만 사용 빈도가 낮다면 하나만 유지하거나 프로젝트 기간별로 번갈아 구독하는 방식이 효율적일 수 있습니다.",
  },
  {
    question: "AI 구독비는 비용인가요, 투자일까요?",
    answer:
      "업무 시간을 실제로 줄이고 있다면 투자에 가깝습니다. 이 계산기는 월 절감 시간과 시간당 가치를 입력해 구독료 대비 생산성 효과를 추정합니다.",
  },
  {
    question: "팀원 모두 같은 AI 도구를 써야 하나요?",
    answer:
      "반드시 그렇지는 않습니다. 개발자는 Copilot·Claude·Cursor, 기획자는 ChatGPT·Notion AI, 리서처는 Perplexity처럼 직무별로 나누는 편이 비용 효율적일 수 있습니다.",
  },
  {
    question: "달러 결제 AI 도구는 왜 원화 비용이 달라지나요?",
    answer:
      "대부분 글로벌 AI 도구는 달러 기준으로 과금됩니다. 환율, 부가세, 카드 해외결제 수수료에 따라 실제 청구액이 달라질 수 있어 환율 입력을 직접 수정할 수 있게 했습니다.",
  },
  {
    question: "계산 결과가 실제 카드 청구액과 다를 수 있나요?",
    answer:
      "다를 수 있습니다. 이 계산기는 사용자가 입력한 가격과 환율을 바탕으로 한 추정 계산기이며, 실제 결제 전에는 각 서비스의 공식 가격과 결제 통화를 확인해야 합니다.",
  },
  {
    question: "연간 결제 할인은 어떻게 반영하나요?",
    answer:
      "각 도구의 월 비용 입력칸에 연간 결제 월 환산액을 직접 입력하면 됩니다. 예를 들어 연 200달러라면 월 16.7달러로 수정해 계산합니다.",
  },
];

export const AI_SUBSCRIPTION_RELATED_LINKS: SubscriptionRelatedLink[] = [
  { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기로 시간 절감 효과 계산하기" },
  { href: "/tools/ai-stack-cost-calculator/", label: "업무 단계별 AI 스택 비용 계산하기" },
  { href: "/tools/salary/", label: "내 월급 기준 시간당 가치 확인하기" },
  { href: "/reports/ai-job-salary-impact-2026/", label: "AI 도입이 직군별 연봉에 미치는 영향 보기" },
  { href: "/tools/dca-investment-calculator/", label: "매달 구독비를 투자했다면 얼마가 될지 계산하기" },
];
