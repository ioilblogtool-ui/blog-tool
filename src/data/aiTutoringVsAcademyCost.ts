export type AiTutoringGrade = "elementaryLow" | "elementaryHigh" | "middle" | "high";
export type AiTutoringSubject = "math" | "english" | "korean" | "science" | "coding" | "other";
export type AiTutoringTool = "chatgpt" | "khanmigo" | "wrtn" | "other";
export type AiTutoringScenario = "fullAi" | "hybrid" | "academy";
export type AiTutoringRisk = "low" | "medium" | "high";

export const AI_TUTORING_META = {
  slug: "ai-tutoring-vs-academy-cost",
  title: "AI 과외 vs 학원 비용 계산기",
  subtitle:
    "자녀 학년, 과목 수, 학원비와 AI 학습 도구 구독료를 입력하면 월 절감액, 연간 절약액, 과목별 AI 대체 가능성을 시뮬레이션합니다.",
  updatedAt: "2026-05-22",
  caution:
    "이 계산기는 교육비 절감 가능성을 보는 비용 시뮬레이션입니다. AI 학습 도구는 성적 향상이나 학습 결과를 보장하지 않습니다.",
};

export const AI_TUTORING_DEFAULTS = {
  gradeLevel: "middle" as AiTutoringGrade,
  childCount: 1,
  subjectCount: 2,
  subjects: ["math", "english"] as AiTutoringSubject[],
  weeklyClassCount: 4,
  minutesPerClass: 90,
  weeksPerMonth: 4.345,
  academyFeePerSubject: 250000,
  usePrivateTutoring: false,
  tutoringHourlyRate: 50000,
  weeklyTutoringHours: 0,
  monthlyMaterialCost: 30000,
  monthlyTransportCost: 20000,
  monthlySnackCost: 30000,
  selectedAiTools: ["chatgpt"] as AiTutoringTool[],
  chatgptPrice: 29000,
  khanmigoPrice: 0,
  wrtnPrice: 0,
  otherAiPrice: 20000,
  aiMaterialCost: 20000,
  parentWeeklyCareHours: 2,
  parentHourlyValue: 15000,
  includeParentTimeCost: false,
  scenarioType: "hybrid" as AiTutoringScenario,
  aiReplaceRate: 50,
  academySubjectsKept: 1,
  classReductionRate: 50,
  riskLevel: "medium" as AiTutoringRisk,
};

export const AI_TUTORING_GRADE_OPTIONS = [
  { id: "elementaryLow", label: "초등 저학년", note: "보호자 동행 필요도가 높음" },
  { id: "elementaryHigh", label: "초등 고학년", note: "영어·코딩 보조 학습에 적합" },
  { id: "middle", label: "중학생", note: "AI+학원 혼합 전환 기준값" },
  { id: "high", label: "고등학생", note: "내신·수능 리스크를 보수적으로 반영" },
] as const;

export const AI_TUTORING_SUBJECTS = [
  { id: "math", label: "수학", baseScore: 68, note: "풀이 피드백은 좋지만 오답 검증 필요" },
  { id: "english", label: "영어", baseScore: 82, note: "회화·첨삭·단어 반복 학습에 강함" },
  { id: "korean", label: "국어", baseScore: 62, note: "독해 전략은 보조 가능, 논술 첨삭은 확인 필요" },
  { id: "science", label: "과학", baseScore: 65, note: "개념 설명 보조에 적합" },
  { id: "coding", label: "코딩", baseScore: 85, note: "실습형 피드백과 예제 생성에 강함" },
  { id: "other", label: "기타", baseScore: 55, note: "과목 특성에 따라 편차 큼" },
] as const;

export const AI_TUTORING_TOOLS = [
  { id: "chatgpt", label: "ChatGPT", badge: "가격 확인 필요", defaultSelected: true },
  { id: "khanmigo", label: "Khan Academy AI", badge: "가격 확인 필요", defaultSelected: false },
  { id: "wrtn", label: "뤼튼", badge: "가격 확인 필요", defaultSelected: false },
  { id: "other", label: "기타 AI 도구", badge: "사용자 입력", defaultSelected: false },
] as const;

export const AI_TUTORING_PRESETS = [
  {
    id: "elementaryEnglishCoding",
    label: "초등 영어·코딩",
    description: "AI 대체 적합도가 높은 과목 중심",
    values: {
      gradeLevel: "elementaryHigh",
      subjectCount: 2,
      subjects: ["english", "coding"],
      weeklyClassCount: 3,
      academyFeePerSubject: 220000,
      aiReplaceRate: 70,
      academySubjectsKept: 0,
      classReductionRate: 70,
      riskLevel: "low",
    },
  },
  {
    id: "middleMathEnglish",
    label: "중등 수학·영어",
    description: "기본 하이브리드 전환 시나리오",
    values: {
      gradeLevel: "middle",
      subjectCount: 2,
      subjects: ["math", "english"],
      weeklyClassCount: 4,
      academyFeePerSubject: 250000,
      aiReplaceRate: 50,
      academySubjectsKept: 1,
      classReductionRate: 50,
      riskLevel: "medium",
    },
  },
  {
    id: "highExamStable",
    label: "고등 내신 안정형",
    description: "학원 유지 비중을 높인 보수적 계산",
    values: {
      gradeLevel: "high",
      subjectCount: 3,
      subjects: ["math", "english", "science"],
      weeklyClassCount: 6,
      academyFeePerSubject: 320000,
      aiReplaceRate: 25,
      academySubjectsKept: 2,
      classReductionRate: 25,
      riskLevel: "high",
    },
  },
] as const;

export const AI_TUTORING_SCENARIOS = [
  { id: "fullAi", label: "완전 대체", description: "학원 수업을 크게 줄이고 AI 학습과 보호자 관리로 전환" },
  { id: "hybrid", label: "하이브리드", description: "핵심 과목은 유지하고 반복 학습·첨삭을 AI로 대체" },
  { id: "academy", label: "학원 유지", description: "학원은 유지하고 AI를 보조 도구로만 사용" },
] as const;

export const AI_TUTORING_RISK_OPTIONS = [
  { id: "low", label: "낮음", description: "자기주도 학습이 가능하고 보호자 점검이 쉬움" },
  { id: "medium", label: "보통", description: "일부 과목은 학원 유지가 필요한 일반 상황" },
  { id: "high", label: "높음", description: "입시·내신 리스크가 크거나 학습 루틴이 불안정" },
] as const;

export const AI_TUTORING_RELATED_LINKS = [
  { href: "/reports/ai-learning-vs-academy-2026/", label: "AI 학습 도구 vs 학원 2026 리포트" },
  { href: "/tools/delivery-vs-cooking-cost/", label: "배달 vs 직접 요리 비용 계산기" },
  { href: "/tools/loan-refinancing-calculator/", label: "대출 갈아타기 계산기" },
  { href: "/reports/single-household-living-cost-2026/", label: "2026 1인 가구 생활비 리포트" },
];

export const AI_TUTORING_FAQ = [
  {
    question: "AI 학습 도구만으로 학원을 완전히 대체할 수 있나요?",
    answer:
      "과목, 학년, 자기주도 학습 능력에 따라 다릅니다. 영어·코딩처럼 반복 피드백이 중요한 과목은 대체 가능성이 높지만, 입시 수학이나 내신 관리 과목은 하이브리드 접근이 더 안전합니다.",
  },
  {
    question: "보호자 시간 비용은 꼭 넣어야 하나요?",
    answer:
      "AI 학습은 학습 계획 점검과 오답 확인 시간이 필요할 수 있습니다. 실제 체감 비용을 보려면 보호자 시간 비용을 켜서 비교하는 것이 좋습니다.",
  },
  {
    question: "계산 결과가 실제 성적 향상으로 이어지나요?",
    answer:
      "아닙니다. 이 도구는 비용 절감 시뮬레이션이며 성적 향상, 입시 결과, 학습 효과를 보장하지 않습니다.",
  },
];
