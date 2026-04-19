export type SalaryMode = "gross" | "net";
export type RoiMode = "personal" | "team";
export type ProductivityMultiplier = 1 | 1.2 | 1.5;

export interface RoiPreset {
  id: string;
  label: string;
  description: string;
  monthlySalary: number;
  monthlyWorkHours: number;
  weeklyRepeatHours: number;
  weeklySavedHours: number;
  monthlyToolCost: number;
  users: number;
  multiplier: ProductivityMultiplier;
  annualWorkingMonths: number;
  mode: RoiMode;
}

export interface RoiFaqItem {
  question: string;
  answer: string;
}

export interface RoiRelatedLink {
  href: string;
  label: string;
}

export const AI_HOURLY_ROI_META = {
  slug: "ai-automation-hourly-roi",
  title: "AI 업무 자동화 시급 계산기",
  subtitle:
    "월급, 반복 업무 시간, AI 도구 비용, 절감 시간을 입력하면 AI 도입 이후 실질 시급 상승과 투자 회수 기간을 바로 계산합니다.",
  updatedAt: "2026-04-18",
  caution:
    "결과는 입력한 절감 시간과 생산성 배수를 기반으로 한 추정치입니다. 실제 효과는 업무 성격과 팀 도입 방식에 따라 달라질 수 있습니다.",
  defaultMonthlyWorkHours: 209,
  defaultAnnualWorkingMonths: 12,
  weeksPerMonth: 4.345,
};

export const AI_HOURLY_ROI_DEFAULT_STATE = {
  salaryMode: "gross" as SalaryMode,
  mode: "personal" as RoiMode,
  monthlySalary: 4_000_000,
  monthlyWorkHours: 209,
  weeklyRepeatHours: 10,
  weeklySavedHours: 4,
  monthlyToolCost: 50_000,
  users: 1,
  multiplier: 1.2 as ProductivityMultiplier,
  annualWorkingMonths: 12,
};

export const AI_HOURLY_ROI_PRESETS: RoiPreset[] = [
  {
    id: "office-chatgpt",
    label: "직장인 + ChatGPT",
    description: "문서 초안, 회의 요약, 메일 작성 자동화 중심",
    monthlySalary: 4_000_000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 8,
    weeklySavedHours: 3,
    monthlyToolCost: 29_000,
    users: 1,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "personal",
  },
  {
    id: "freelancer-stack",
    label: "프리랜서 AI 스택",
    description: "제안서, 리서치, 반복 커뮤니케이션 자동화",
    monthlySalary: 5_500_000,
    monthlyWorkHours: 180,
    weeklyRepeatHours: 12,
    weeklySavedHours: 5,
    monthlyToolCost: 80_000,
    users: 1,
    multiplier: 1.5,
    annualWorkingMonths: 12,
    mode: "personal",
  },
  {
    id: "team-lead",
    label: "팀장 시나리오",
    description: "팀 단위 AI 구독 도입 효과 검토",
    monthlySalary: 4_500_000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 6,
    weeklySavedHours: 2,
    monthlyToolCost: 300_000,
    users: 5,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "team",
  },
  {
    id: "ops-zapier",
    label: "운영 자동화 조합",
    description: "Zapier, Notion AI, ChatGPT 조합 검토",
    monthlySalary: 3_800_000,
    monthlyWorkHours: 209,
    weeklyRepeatHours: 14,
    weeklySavedHours: 6,
    monthlyToolCost: 120_000,
    users: 2,
    multiplier: 1.2,
    annualWorkingMonths: 12,
    mode: "team",
  },
];

export const AI_HOURLY_ROI_MULTIPLIERS: Array<{
  value: ProductivityMultiplier;
  label: string;
  description: string;
}> = [
  { value: 1, label: "1.0배", description: "절감 시간만 반영" },
  { value: 1.2, label: "1.2배", description: "기본 추천값" },
  { value: 1.5, label: "1.5배", description: "고숙련 활용 가정" },
];

export const AI_HOURLY_ROI_GUIDE_POINTS = [
  "주간 반복 업무 시간에는 매주 비슷하게 반복되는 문서 작성, 보고서 정리, 회의록 작성, 고객 응답 시간을 합산합니다.",
  "주간 절감 시간은 AI를 써서 줄일 수 있는 시간만 보수적으로 입력하는 편이 현실에 가깝습니다.",
  "팀 모드에서는 1인 기준 월급과 팀 인원 수를 함께 적용해 팀 전체 투자 대비 효과를 계산합니다.",
];

export const AI_HOURLY_ROI_FAQ: RoiFaqItem[] = [
  {
    question: "AI 도구 비용이 여러 개일 때 어떻게 입력하나요?",
    answer:
      "매달 고정적으로 나가는 AI 구독료와 자동화 툴 비용을 모두 합산해서 월 도구 비용에 입력하면 됩니다.",
  },
  {
    question: "세전 월급과 실수령 월급 중 무엇을 써야 하나요?",
    answer:
      "회사 비용 기준 ROI를 보려면 세전 월급, 개인 체감 효율 기준이면 실수령 월급을 입력하는 방식이 더 직관적입니다.",
  },
  {
    question: "생산성 배수는 어떻게 고르나요?",
    answer:
      "AI가 단순히 시간을 줄이는 수준이면 1.0배, 결과물 품질과 처리량까지 개선된다면 1.2배 또는 1.5배를 사용할 수 있습니다.",
  },
  {
    question: "투자 회수 기간이 1개월 미만이면 어떻게 해석하나요?",
    answer:
      "월 절감 가치가 월 도구 비용보다 충분히 크다는 뜻입니다. 보통 다음 결제 주기 전에 비용을 회수하는 구조로 볼 수 있습니다.",
  },
];

export const AI_HOURLY_ROI_RELATED_LINKS: RoiRelatedLink[] = [
  { href: "/tools/ai-stack-cost-calculator/", label: "AI 스택 비용 계산기" },
  { href: "/tools/fire-calculator/", label: "파이어 계산기" },
  { href: "/tools/retirement/", label: "은퇴 자금 계산기" },
];
