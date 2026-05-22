export type EvidenceBadge =
  | "공식 통계"
  | "공식 가격"
  | "연구"
  | "후기"
  | "시뮬레이션"
  | "가격 확인 필요"
  | "정책 변경 가능";

export type PlatformType = "generalAi" | "educationAi" | "lecture" | "problemSolving" | "academy";
export type SubjectId = "math" | "english" | "korean" | "science" | "coding";
export type GradeBand = "elementaryLow" | "elementaryHigh" | "middle" | "high";
export type SuitabilityLevel = "high" | "medium" | "low";
export type ScenarioType = "fullAi" | "hybrid" | "academy";
export type Tone = "positive" | "neutral" | "caution";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url?: string;
  badge: EvidenceBadge;
  asOf: string;
  note?: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  badge: EvidenceBadge;
  tone: Tone;
}

export interface AiLearningPlatform {
  id: string;
  name: string;
  type: PlatformType;
  monthlyPrice: number;
  priceText: string;
  priceBadge: EvidenceBadge;
  bestFor: string;
  strengths: string[];
  cautions: string[];
  sourceId?: string;
}

export interface SubjectSuitability {
  subject: SubjectId;
  label: string;
  level: SuitabilityLevel;
  score: number;
  aiUseCases: string[];
  academyUseCases: string[];
  caution: string;
}

export interface GradeRoadmap {
  gradeBand: GradeBand;
  label: string;
  recommendedStrategy: string;
  aiUse: string;
  academyUse: string;
  caution: string;
}

export interface CostScenario {
  type: ScenarioType;
  label: string;
  monthlyAcademyCost: number;
  monthlyAiCost: number;
  monthlyHybridCost: number;
  academyIncreaseRate: number;
  aiIncreaseRate: number;
  description: string;
  caution: string;
}

export interface ResearchInsight {
  title: string;
  badge: EvidenceBadge;
  finding: string;
  limitation: string;
  implication: string;
  sourceId?: string;
}

export interface ReviewSignal {
  sentiment: "positive" | "neutral" | "negative";
  label: string;
  summary: string;
  badge: EvidenceBadge;
}

export interface ParentChecklistItem {
  id: string;
  label: string;
  description: string;
  riskIfMissing: string;
}

export interface ScenarioCard {
  type: ScenarioType;
  label: string;
  monthlyCost: number;
  fiveYearCost: number;
  bestFor: string;
  risk: string;
  badge: EvidenceBadge;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export const AI_LEARNING_VS_ACADEMY_META = {
  slug: "ai-learning-vs-academy-2026",
  title: "AI 학습 도구 vs 학원 2026 비용·효과 완전 비교",
  description:
    "2026년 기준 AI 학습 도구와 전통 학원의 월 비용, 과목별 대체 가능성, 5년 누적 비용, 학습 효과 연구, 하이브리드 전략을 비교합니다.",
  category: "AI/생산성/자동화",
  updatedAt: "2026년 5월 기준",
} as const;

export const ALVA_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "참여학생 월평균 사교육비",
    value: "60.4만원",
    description: "2025년 초중고 사교육비조사 기준 참여학생 1인당 월평균 사교육비입니다.",
    badge: "공식 통계",
    tone: "neutral",
  },
  {
    label: "기본 결론",
    value: "하이브리드 우선",
    description: "AI는 반복 질문과 복습에 강하지만, 오답 관리와 시험 전략은 사람의 점검이 여전히 중요합니다.",
    badge: "시뮬레이션",
    tone: "positive",
  },
  {
    label: "AI 적합 과목",
    value: "영어·코딩",
    description: "작문 첨삭, 회화 연습, 예제 생성, 오류 설명처럼 반복 피드백이 필요한 영역에서 효율이 높습니다.",
    badge: "연구",
    tone: "positive",
  },
  {
    label: "주의 과목",
    value: "수학·입시",
    description: "풀이 과정, 오답 원인, 시험 시간 배분은 AI 답변만으로 판단하기 어렵습니다.",
    badge: "연구",
    tone: "caution",
  },
];

export const ALVA_PLATFORMS: AiLearningPlatform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    type: "generalAi",
    monthlyPrice: 0,
    priceText: "무료~유료 요금제, 환율·플랜 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "개념 질문, 작문·첨삭, 영어 대화, 코딩 보조",
    strengths: ["범용성이 높음", "질문을 반복하기 쉬움", "영어·코딩 보조에 강함"],
    cautions: ["답변 검증 필요", "요금제·환율 변동 가능", "학생 안전 설정은 별도 확인 필요"],
    sourceId: "openai-pricing",
  },
  {
    id: "wrtn",
    name: "뤼튼",
    type: "generalAi",
    monthlyPrice: 0,
    priceText: "무료·유료 정책 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "한국어 질문, 문장 생성, 자료 정리",
    strengths: ["한국어 접근성이 높음", "학습 자료 정리에 활용 가능"],
    cautions: ["기능·요금 정책 변동 가능", "교육 특화 커리큘럼 여부 확인 필요"],
  },
  {
    id: "khanmigo",
    name: "Khanmigo",
    type: "educationAi",
    monthlyPrice: 0,
    priceText: "공식 안내 기준 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "수학·코딩·인문 질문형 학습",
    strengths: ["교육 특화 AI 튜터 성격", "힌트 중심 학습 설계"],
    cautions: ["국내 이용 가능성 확인 필요", "국내 입시 커리큘럼과 직접 대응은 제한적일 수 있음"],
    sourceId: "khanmigo",
  },
  {
    id: "class101",
    name: "클래스101 AI·온라인 강의형",
    type: "lecture",
    monthlyPrice: 0,
    priceText: "구독·프로모션 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "커리큘럼형 강의와 자기주도 학습",
    strengths: ["강의형 커리큘럼", "관심사 기반 학습에 적합"],
    cautions: ["AI 튜터형과 강의형을 구분해야 함", "입시 과목 직접 대체 여부는 확인 필요"],
  },
  {
    id: "problem-solving",
    name: "문제풀이·오답 보조 앱",
    type: "problemSolving",
    monthlyPrice: 0,
    priceText: "앱별 구독료 확인 필요",
    priceBadge: "가격 확인 필요",
    bestFor: "오답 힌트, 유사 문제, 풀이 흐름 확인",
    strengths: ["문제 단위 피드백", "짧은 복습 루틴에 적합"],
    cautions: ["정답 복사 습관 주의", "풀이 과정 설명을 학생이 재현해야 함"],
  },
];

export const ALVA_SUBJECT_MATRIX: SubjectSuitability[] = [
  {
    subject: "english",
    label: "영어",
    level: "high",
    score: 82,
    aiUseCases: ["회화 연습", "작문 첨삭", "단어 반복", "문장 변환"],
    academyUseCases: ["발음 교정", "시험 전략", "학습 지속성 관리"],
    caution: "시험 대비와 발음 교정은 사람 피드백을 병행하는 편이 안전합니다.",
  },
  {
    subject: "coding",
    label: "코딩",
    level: "high",
    score: 85,
    aiUseCases: ["예제 생성", "오류 설명", "프로젝트 힌트", "개념 질문"],
    academyUseCases: ["프로젝트 리뷰", "코드 습관 피드백", "학습 로드맵"],
    caution: "정답 코드를 그대로 복사하지 않도록 과정 설명을 함께 요구해야 합니다.",
  },
  {
    subject: "math",
    label: "수학",
    level: "medium",
    score: 68,
    aiUseCases: ["개념 설명", "유사 문제", "단계별 힌트"],
    academyUseCases: ["오답 관리", "풀이 과정 점검", "시험 시간 전략"],
    caution: "풀이 과정과 오답 원인을 학생이 직접 설명할 수 있는지 확인해야 합니다.",
  },
  {
    subject: "science",
    label: "과학",
    level: "medium",
    score: 65,
    aiUseCases: ["개념 설명", "퀴즈 생성", "실험 원리 정리"],
    academyUseCases: ["탐구 설계", "서술형 답안", "심화 문제"],
    caution: "탐구·보고서형 문제는 검증된 교재와 사람 점검이 필요합니다.",
  },
  {
    subject: "korean",
    label: "국어",
    level: "low",
    score: 58,
    aiUseCases: ["요약", "독해 질문", "글쓰기 초안"],
    academyUseCases: ["서술형 채점", "문학 해석", "평가 기준 적용"],
    caution: "학교·입시 채점 기준과 AI 피드백이 다를 수 있습니다.",
  },
];

export const ALVA_GRADE_ROADMAP: GradeRoadmap[] = [
  {
    gradeBand: "elementaryLow",
    label: "초등 저학년",
    recommendedStrategy: "부모 동반 보조",
    aiUse: "읽기, 단어, 대화형 질문",
    academyUse: "학습 습관 형성, 안전한 루틴",
    caution: "화면 시간과 개인정보 입력을 엄격히 제한해야 합니다.",
  },
  {
    gradeBand: "elementaryHigh",
    label: "초등 고학년",
    recommendedStrategy: "복습 보조",
    aiUse: "영어·코딩·개념 질문",
    academyUse: "학습 지속성, 기본기 점검",
    caution: "AI 답변을 그대로 베끼지 않는 훈련이 필요합니다.",
  },
  {
    gradeBand: "middle",
    label: "중학생",
    recommendedStrategy: "하이브리드",
    aiUse: "수학 개념, 영어 작문, 코딩 실습",
    academyUse: "오답 루틴, 내신 전략",
    caution: "주간 목표와 오답 관리가 없으면 비용 절감 효과가 학습 효과로 이어지기 어렵습니다.",
  },
  {
    gradeBand: "high",
    label: "고등학생",
    recommendedStrategy: "학원 유지 + AI 보조",
    aiUse: "요약, 질문, 첨삭 초안, 복습",
    academyUse: "입시 전략, 서술형, 고난도 풀이",
    caution: "수능·내신 구간은 검증된 교재와 교사 피드백을 우선해야 합니다.",
  },
];

export const ALVA_COST_SCENARIO: CostScenario = {
  type: "hybrid",
  label: "중학생 수학·영어 2과목 기준",
  monthlyAcademyCost: 620000,
  monthlyAiCost: 69000,
  monthlyHybridCost: 349000,
  academyIncreaseRate: 0.03,
  aiIncreaseRate: 0.03,
  description: "학원 2과목 유지, AI 전환, 1과목 학원 유지 하이브리드를 같은 조건으로 비교합니다.",
  caution: "교육비 비교용 추정값이며, 학습 효과와 성적 변화를 보장하지 않습니다.",
};

const fiveYear = (monthlyCost: number, annualRate: number) => {
  let monthly = monthlyCost;
  let total = 0;
  for (let year = 1; year <= 5; year += 1) {
    total += monthly * 12;
    monthly *= 1 + annualRate;
  }
  return Math.round(total);
};

export const ALVA_SCENARIO_CARDS: ScenarioCard[] = [
  {
    type: "fullAi",
    label: "AI 중심 전환",
    monthlyCost: ALVA_COST_SCENARIO.monthlyAiCost,
    fiveYearCost: fiveYear(ALVA_COST_SCENARIO.monthlyAiCost, ALVA_COST_SCENARIO.aiIncreaseRate),
    bestFor: "자기주도 학습이 강하고 영어·코딩처럼 반복 피드백이 중요한 경우",
    risk: "오답 관리와 학습 지속성이 무너지면 절감액만 남고 효과가 떨어질 수 있습니다.",
    badge: "시뮬레이션",
  },
  {
    type: "hybrid",
    label: "학원 1과목 + AI 보조",
    monthlyCost: ALVA_COST_SCENARIO.monthlyHybridCost,
    fiveYearCost: fiveYear(ALVA_COST_SCENARIO.monthlyHybridCost, 0.02),
    bestFor: "대부분의 초중고 가정에서 먼저 테스트하기 좋은 절충안",
    risk: "남기는 과목과 줄이는 과목의 기준을 명확히 정해야 합니다.",
    badge: "시뮬레이션",
  },
  {
    type: "academy",
    label: "학원 유지",
    monthlyCost: ALVA_COST_SCENARIO.monthlyAcademyCost,
    fiveYearCost: fiveYear(ALVA_COST_SCENARIO.monthlyAcademyCost, ALVA_COST_SCENARIO.academyIncreaseRate),
    bestFor: "입시, 내신, 오답 관리, 학습 루틴이 흔들리는 학생",
    risk: "비용 부담이 커질 수 있어 과목별 효율 점검이 필요합니다.",
    badge: "공식 통계",
  },
];

export const ALVA_RESEARCH_INSIGHTS: ResearchInsight[] = [
  {
    title: "AI 튜터는 반복 피드백과 힌트 제공에서 강점이 큽니다",
    badge: "연구",
    finding: "문제 풀이 과정에서 즉시 힌트를 주고 질문을 반복해도 부담이 적다는 점은 학습 몰입에 도움이 됩니다.",
    limitation: "단기 과제 성과와 장기 시험 성적을 동일하게 해석하면 안 됩니다.",
    implication: "AI는 숙제·복습·개념 확인에 먼저 붙이고, 성적 관리에는 사람 피드백을 남기는 방식이 안전합니다.",
  },
  {
    title: "학부모 관리는 비용 절감보다 중요한 변수입니다",
    badge: "후기",
    finding: "AI를 잘 쓰는 학생은 질문을 다시 만들고 답변을 검증하는 루틴이 있습니다.",
    limitation: "후기는 표본 편향이 크고 정량 통계로 보기 어렵습니다.",
    implication: "주 1회 결과 확인, 오답노트, 화면 시간 관리가 없으면 AI 전환 효과가 줄어듭니다.",
  },
  {
    title: "입시 구간은 완전 대체보다 보조 도구 접근이 현실적입니다",
    badge: "연구",
    finding: "고등·입시 영역은 평가 기준, 기출 분석, 시간 배분 전략이 중요합니다.",
    limitation: "AI 답변은 교재·학교·시험 출제 경향과 어긋날 수 있습니다.",
    implication: "고등학생은 AI를 요약, 첨삭 초안, 질문 정리에 쓰고 최종 점검은 검증된 교재와 교사 피드백을 우선해야 합니다.",
  },
];

export const ALVA_REVIEW_SIGNALS: ReviewSignal[] = [
  {
    sentiment: "positive",
    label: "긍정 후기",
    summary: "질문을 바로 할 수 있어 복습 시간이 줄었다는 반응이 많습니다.",
    badge: "후기",
  },
  {
    sentiment: "neutral",
    label: "중립 후기",
    summary: "부모가 옆에서 확인할 때는 도움이 되지만, 혼자 쓰면 산만해진다는 의견이 있습니다.",
    badge: "후기",
  },
  {
    sentiment: "negative",
    label: "주의 후기",
    summary: "정답만 복사하거나 틀린 설명을 그대로 믿는 문제가 반복될 수 있습니다.",
    badge: "후기",
  },
];

export const ALVA_PARENT_CHECKLIST: ParentChecklistItem[] = [
  {
    id: "explain-answer",
    label: "아이가 AI 답변을 자기 말로 다시 설명할 수 있다",
    description: "정답보다 사고 과정을 확인하는 항목입니다.",
    riskIfMissing: "정답 복사 습관이 생길 수 있습니다.",
  },
  {
    id: "wrong-note",
    label: "오답노트를 AI와 함께 다시 풀어본다",
    description: "틀린 이유를 재분류해야 학습 효과가 쌓입니다.",
    riskIfMissing: "비슷한 문제를 반복해서 틀릴 수 있습니다.",
  },
  {
    id: "weekly-goal",
    label: "주간 학습 목표와 확인 시간이 있다",
    description: "AI 사용 시간을 학습 목표와 연결합니다.",
    riskIfMissing: "검색·대화 시간이 학습 시간처럼 보일 수 있습니다.",
  },
  {
    id: "source-check",
    label: "시험 직전에는 교재와 기출로 검증한다",
    description: "AI 설명을 최종 정답지처럼 쓰지 않는 기준입니다.",
    riskIfMissing: "학교 평가 기준과 어긋날 수 있습니다.",
  },
  {
    id: "screen-time",
    label: "화면 시간과 비학습 사용을 분리한다",
    description: "AI 도구 사용이 게임·영상 시간으로 번지지 않게 합니다.",
    riskIfMissing: "학습 루틴이 흐려질 수 있습니다.",
  },
  {
    id: "paid-plan",
    label: "유료 구독료가 실제 사용량에 맞다",
    description: "무료 도구로 충분한지 먼저 테스트합니다.",
    riskIfMissing: "구독료만 늘고 사용률은 낮을 수 있습니다.",
  },
  {
    id: "human-feedback",
    label: "부모·교사·강사의 피드백 루프가 남아 있다",
    description: "학습 지속성과 방향을 사람 기준으로 점검합니다.",
    riskIfMissing: "잘못된 방식으로 오래 공부할 수 있습니다.",
  },
  {
    id: "privacy",
    label: "개인정보와 학교 과제 업로드 기준을 정했다",
    description: "학생 이름, 학교, 사진, 과제 원문 입력을 제한합니다.",
    riskIfMissing: "개인정보와 저작권 이슈가 생길 수 있습니다.",
  },
];

export const ALVA_SOURCES: SourceInfo[] = [
  {
    id: "kostat-private-education-2025",
    label: "2025년 초중고 사교육비조사",
    organization: "통계청·교육부",
    url: "https://www.kostat.go.kr",
    badge: "공식 통계",
    asOf: "2026-03-12",
    note: "참여학생 월평균 사교육비와 과목별 사교육비 해석의 기준입니다.",
  },
  {
    id: "openai-pricing",
    label: "ChatGPT 공식 가격 안내",
    organization: "OpenAI",
    url: "https://openai.com/chatgpt/pricing/",
    badge: "공식 가격",
    asOf: "2026-05-22",
    note: "지역, 환율, 플랜 정책에 따라 실제 원화 부담은 달라질 수 있습니다.",
  },
  {
    id: "khanmigo",
    label: "Khanmigo 공식 안내",
    organization: "Khan Academy",
    url: "https://www.khanmigo.ai/",
    badge: "공식 가격",
    asOf: "2026-05-22",
    note: "국내 이용 가능성과 교사·학부모용 정책은 별도 확인이 필요합니다.",
  },
  {
    id: "ai-policy",
    label: "AI 디지털교과서·AI 교육 정책 자료",
    organization: "교육부",
    url: "https://www.moe.go.kr",
    badge: "정책 변경 가능",
    asOf: "2026-05-22",
    note: "정책 일정과 적용 학년은 변경될 수 있습니다.",
  },
];

export const ALVA_RELATED_LINKS: RelatedLink[] = [
  {
    label: "AI 과외 vs 학원 비용 계산기",
    href: "/tools/ai-tutoring-vs-academy-cost/",
    description: "자녀 학년, 과목 수, 학원비와 AI 구독료를 입력해 월 절감액과 연간 절약액을 계산합니다.",
  },
  {
    label: "AI 부업 수입 비교 2026",
    href: "/reports/ai-side-income-comparison-2026/",
    description: "AI 도구의 생산성 효과를 수익 관점에서 비교합니다.",
  },
  {
    label: "2026 1인 가구 생활비 완전 해부",
    href: "/reports/single-household-living-cost-2026/",
    description: "교육비 외 고정비 절감 관점에서 생활비 구조를 함께 점검합니다.",
  },
  {
    label: "연말정산 환급 계산기",
    href: "/tools/year-end-tax-refund-calculator/",
    description: "교육비 공제와 가계 세후 부담을 함께 확인할 때 연결하기 좋습니다.",
  },
];

export const ALVA_FAQ: FaqItem[] = [
  {
    question: "AI 학습 도구가 학원을 완전히 대체할 수 있나요?",
    answer:
      "일부 과목과 자기주도 학습이 강한 학생에게는 가능성이 있지만, 대부분은 하이브리드 방식이 현실적입니다. 오답 관리, 시험 전략, 학습 지속성은 사람 피드백이 필요합니다.",
  },
  {
    question: "ChatGPT와 Khanmigo는 무엇이 다른가요?",
    answer:
      "ChatGPT는 범용 AI에 가깝고, Khanmigo는 교육 특화 AI 튜터 성격이 강합니다. 커리큘럼, 안전장치, 국내 이용 가능성은 별도로 확인해야 합니다.",
  },
  {
    question: "수학 학원은 AI로 줄여도 되나요?",
    answer:
      "개념 설명과 유사 문제 생성에는 AI가 도움이 될 수 있습니다. 다만 오답 원인, 풀이 과정, 시험 시간 전략은 사람 점검을 병행하는 편이 안전합니다.",
  },
  {
    question: "영어 학원은 AI 대체가 쉬운가요?",
    answer:
      "회화, 작문, 단어 반복, 문장 첨삭은 AI 활용도가 높은 편입니다. 발음 교정과 시험 대비는 학원이나 교사의 피드백이 유리할 수 있습니다.",
  },
  {
    question: "AI 학습 도구 비용은 어떻게 계산해야 하나요?",
    answer:
      "월 구독료만 보지 말고 교재비, 부모 관리 시간, 줄일 수 있는 학원비를 함께 계산해야 합니다. 유료 플랜 가격은 환율과 정책에 따라 달라질 수 있습니다.",
  },
  {
    question: "AI 학습 효과 연구는 긍정적인가요?",
    answer:
      "반복 문제와 즉시 피드백에서는 긍정적인 결과가 보고되지만, 실제 시험 성적과 장기 학습 습관은 별도 검증이 필요합니다.",
  },
];

export const badgeClass = (badge: EvidenceBadge) => {
  if (badge === "공식 통계" || badge === "공식 가격") return "official";
  if (badge === "연구") return "research";
  if (badge === "후기") return "review";
  if (badge === "시뮬레이션") return "simulation";
  if (badge === "가격 확인 필요" || badge === "정책 변경 가능") return "caution";
  return "neutral";
};

export const suitabilityLabel = (level: SuitabilityLevel) => {
  if (level === "high") return "AI 대체 가능성 높음";
  if (level === "medium") return "하이브리드 권장";
  return "학원 유지 권장";
};

export const formatWon = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;
export const formatManWon = (value: number) => `${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
