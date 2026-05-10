export type AiWorkUserType = "employee" | "developer" | "freelancer" | "smallBusiness" | "team";

export type AiWorkRoiPreset = {
  id: string;
  label: string;
  userType: AiWorkUserType;
  monthlyIncome: number;
  weeklyWorkHours: number;
  weeklyRepetitiveHours: number;
  aiSavingRate: number;
  monthlyAiCost: number;
  initialSetupCost: number;
  memberCount: number;
  description: string;
};

export type AiToolCostPreset = {
  id: string;
  label: string;
  monthlyCostKrw: number;
  note: string;
};

export type AiWorkRoiNextStep = {
  href: string;
  label: string;
  eyebrow: string;
  description: string;
};

export type AiWorkRoiUseCase = {
  title: string;
  metric: string;
  description: string;
};

export const AWR_META = {
  slug: "ai-work-roi-calculator",
  title: "AI 업무 ROI 계산기",
  description:
    "월급, 반복업무 시간, AI 도구 월비용을 입력하면 AI 도입 전후 시간절감액, 연간 순이익, 투자회수 기간, ROI를 계산합니다.",
  updatedAt: "2026-05",
  caution:
    "절감 시간을 시급으로 환산한 참고용 추정입니다. 실제 급여 증가나 매출 증가를 보장하지 않습니다.",
};

export const AWR_DEFAULT_INPUT = {
  userType: "employee" as AiWorkUserType,
  monthlyIncome: 4000000,
  weeklyWorkHours: 40,
  weeklyRepetitiveHours: 8,
  aiSavingRate: 30,
  monthlyAiCost: 30000,
  initialSetupCost: 0,
  memberCount: 1,
};

export const AWR_JOB_PRESETS: AiWorkRoiPreset[] = [
  {
    id: "employee",
    label: "직장인 문서업무",
    userType: "employee",
    monthlyIncome: 4000000,
    weeklyWorkHours: 40,
    weeklyRepetitiveHours: 8,
    aiSavingRate: 30,
    monthlyAiCost: 30000,
    initialSetupCost: 0,
    memberCount: 1,
    description: "보고서, 회의록, 자료 정리를 AI로 줄이는 경우",
  },
  {
    id: "developer",
    label: "개발자 코딩 보조",
    userType: "developer",
    monthlyIncome: 6000000,
    weeklyWorkHours: 40,
    weeklyRepetitiveHours: 10,
    aiSavingRate: 35,
    monthlyAiCost: 70000,
    initialSetupCost: 0,
    memberCount: 1,
    description: "코드 작성, 테스트, 리팩터링 보조 도구를 쓰는 경우",
  },
  {
    id: "freelancer",
    label: "프리랜서 제안서",
    userType: "freelancer",
    monthlyIncome: 7000000,
    weeklyWorkHours: 45,
    weeklyRepetitiveHours: 10,
    aiSavingRate: 45,
    monthlyAiCost: 100000,
    initialSetupCost: 100000,
    memberCount: 1,
    description: "제안서, 견적서, 리서치 시간을 줄여 수주 시간을 확보하는 경우",
  },
  {
    id: "team",
    label: "5인 팀 도입",
    userType: "team",
    monthlyIncome: 5000000,
    weeklyWorkHours: 40,
    weeklyRepetitiveHours: 6,
    aiSavingRate: 25,
    monthlyAiCost: 50000,
    initialSetupCost: 300000,
    memberCount: 5,
    description: "팀원 5명이 반복 문서·코딩·리서치 업무에 AI를 쓰는 경우",
  },
];

export const AWR_TOOL_COST_PRESETS: AiToolCostPreset[] = [
  { id: "free", label: "무료 도구", monthlyCostKrw: 0, note: "입문자용" },
  { id: "personal", label: "개인 유료 AI", monthlyCostKrw: 30000, note: "ChatGPT Plus, Claude Pro 등" },
  { id: "coding", label: "코딩 특화 AI", monthlyCostKrw: 70000, note: "Cursor, Copilot 조합" },
  { id: "automation", label: "자동화 도구 포함", monthlyCostKrw: 120000, note: "AI + 자동화 SaaS" },
];

export const AWR_USE_CASES: AiWorkRoiUseCase[] = [
  {
    title: "개인 유료 AI를 유지할지 볼 때",
    metric: "월 1~2시간만 회수해도 개인 구독은 본전권",
    description:
      "문서 초안, 회의록, 메일 작성처럼 매주 반복되는 업무가 있다면 월비용보다 절감 시간의 금액 가치가 커지는지 먼저 확인합니다.",
  },
  {
    title: "개발·기획·리서치 도구를 묶어 쓸 때",
    metric: "도구 여러 개는 비용보다 역할 중복이 핵심",
    description:
      "ChatGPT, Claude, Cursor, Perplexity처럼 역할이 겹치는 구독은 ROI가 높아도 중복 비용이 생길 수 있어 스택 비용까지 같이 점검하는 편이 좋습니다.",
  },
  {
    title: "팀 도입을 설득해야 할 때",
    metric: "팀 전체 월간 순이익과 회수 기간을 같이 제시",
    description:
      "팀 단위 도입은 개인 만족도보다 반복 업무 병목이 줄었는지, 월간 절감 시간이 교육·운영 비용을 넘는지가 판단 기준이 됩니다.",
  },
];

export const AWR_NEXT_STEPS: AiWorkRoiNextStep[] = [
  {
    href: "/tools/ai-subscription-cost/",
    eyebrow: "구독료 점검",
    label: "AI 도구 월비용 계산기",
    description: "ChatGPT, Claude, Copilot, Perplexity, Notion AI 구독료를 합산하고 중복 구독을 줄일 수 있는지 봅니다.",
  },
  {
    href: "/tools/ai-stack-cost-calculator/",
    eyebrow: "스택 조합",
    label: "AI 스택 비용 계산기",
    description: "업무 유형별로 어떤 AI 도구 조합이 과한지, 월 예산 안에서 어떤 스택이 맞는지 비교합니다.",
  },
  {
    href: "/tools/ai-automation-hourly-roi/",
    eyebrow: "시간가치 비교",
    label: "AI 업무 자동화 시급 계산기",
    description: "절감 시간을 실질 시급 상승과 투자 회수 기간으로 바꿔 더 보수적인 자동화 ROI를 확인합니다.",
  },
  {
    href: "/reports/ai-job-salary-impact-2026/",
    eyebrow: "직군 영향",
    label: "직군별 AI 연봉 효과 리포트",
    description: "개발자, 마케터, PM, 회계, CS 등 직군별로 AI 활용 성과가 연봉 협상 포인트가 되는지 비교합니다.",
  },
];

export const AWR_FAQ = [
  {
    question: "AI 업무 ROI는 어떻게 계산하나요?",
    answer: "AI로 절감되는 시간을 시급으로 환산한 뒤 AI 도구 비용과 초기 세팅 비용을 차감해 계산합니다.",
  },
  {
    question: "회사원이 아낀 시간을 돈으로 환산해도 되나요?",
    answer: "실제 급여가 바로 늘어나는 것은 아니지만, 업무 효율과 도구 비용을 비교하기 위한 참고 지표로 쓸 수 있습니다.",
  },
  {
    question: "프리랜서는 어떻게 해석해야 하나요?",
    answer: "프리랜서는 절감된 시간을 추가 수주나 영업 시간으로 전환할 수 있어 직장인보다 ROI 체감이 클 수 있습니다.",
  },
  {
    question: "ROI가 낮게 나오면 AI 도구를 쓰면 안 되나요?",
    answer: "반드시 그렇지는 않습니다. 시간 절감 외에도 품질 개선, 아이디어 확장, 실수 감소 효과가 있을 수 있습니다.",
  },
  {
    question: "팀 단위 계산도 가능한가요?",
    answer: "네. 인원 수를 입력하면 팀 전체 월간 시간가치와 비용을 합산해 계산합니다.",
  },
];

export const AWR_RELATED_LINKS = [
  { href: "/reports/ai-coding-tools-comparison-2026/", label: "AI 코딩 도구 비교 2026" },
  { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기" },
  { href: "/tools/ai-subscription-cost/", label: "AI 도구 월비용 계산기" },
  { href: "/reports/ai-job-salary-impact-2026/", label: "직군별 AI 연봉 효과 리포트" },
];
