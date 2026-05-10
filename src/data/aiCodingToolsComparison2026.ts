export type AiCodingTool = {
  id: string;
  name: string;
  position: string;
  personalPrice: string;
  teamPrice: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  scores: {
    autocomplete: number;
    multiFile: number;
    refactoring: number;
    docs: number;
    security: number;
  };
  officialUrl: string;
};

export const AIC_META = {
  slug: "ai-coding-tools-comparison-2026",
  title: "AI 코딩 도구 실사용 비교 2026",
  description:
    "GitHub Copilot, Cursor, Claude Code, Windsurf, Tabnine을 가격·기능·보안·직군 적합도 기준으로 비교합니다.",
  updatedAt: "2026-05",
};

export const AIC_TOOLS: AiCodingTool[] = [
  {
    id: "copilot",
    name: "GitHub Copilot",
    position: "범용 AI 페어 프로그래머",
    personalPrice: "Pro 월 $10, Pro+ 월 $39",
    teamPrice: "Business $19/user/mo, Enterprise $39/user/mo",
    strengths: ["GitHub·VS Code 통합", "PR·테스트 흐름에 강함"],
    weaknesses: ["고급 기능 사용량 과금 확인 필요"],
    bestFor: "일반 개발자, GitHub 조직",
    scores: { autocomplete: 4.5, multiFile: 4.0, refactoring: 4.0, docs: 4.0, security: 4.0 },
    officialUrl: "https://docs.github.com/en/copilot",
  },
  {
    id: "cursor",
    name: "Cursor",
    position: "AI 네이티브 IDE",
    personalPrice: "Pro 중심",
    teamPrice: "Teams $40/user/mo, Enterprise 별도",
    strengths: ["코드베이스 컨텍스트", "멀티파일 수정"],
    weaknesses: ["기존 IDE 이전 부담"],
    bestFor: "풀스택, 스타트업 개발자",
    scores: { autocomplete: 4.3, multiFile: 4.7, refactoring: 4.4, docs: 4.2, security: 3.7 },
    officialUrl: "https://cursor.com/pricing",
  },
  {
    id: "claude",
    name: "Claude Code",
    position: "CLI/에이전트형 코딩",
    personalPrice: "Claude Pro/Max 또는 사용량 기반",
    teamPrice: "Team/Enterprise 별도",
    strengths: ["긴 컨텍스트", "복잡한 분석·리팩터링"],
    weaknesses: ["사용량 비용 예측 필요"],
    bestFor: "시니어 개발자, 레거시 분석",
    scores: { autocomplete: 3.8, multiFile: 4.8, refactoring: 4.8, docs: 4.8, security: 3.8 },
    officialUrl: "https://claude.ai",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    position: "에이전트 IDE",
    personalPrice: "Free/Pro 구조",
    teamPrice: "Teams $40/user/mo, Enterprise 별도",
    strengths: ["무료 접근성", "Cascade 흐름"],
    weaknesses: ["제품 변화 추적 필요"],
    bestFor: "개인 개발자, 소규모 팀",
    scores: { autocomplete: 4.1, multiFile: 4.4, refactoring: 4.1, docs: 3.8, security: 3.6 },
    officialUrl: "https://windsurf.com",
  },
  {
    id: "tabnine",
    name: "Tabnine",
    position: "보안 중심 기업형 AI 코딩",
    personalPrice: "플랜별 상이",
    teamPrice: "Agentic Platform $59/user/mo, Enterprise 별도",
    strengths: ["온프레미스", "VPC·air-gapped 배포"],
    weaknesses: ["개인 사용자에겐 비용 부담"],
    bestFor: "금융, 공공, 대기업",
    scores: { autocomplete: 4.0, multiFile: 4.0, refactoring: 3.8, docs: 3.5, security: 4.8 },
    officialUrl: "https://www.tabnine.com/pricing/",
  },
];

export const AIC_ROLE_RECOMMENDATIONS = [
  { role: "프론트엔드", first: "Cursor", second: "GitHub Copilot", reason: "컴포넌트·상태관리·멀티파일 수정에 유리합니다." },
  { role: "백엔드", first: "GitHub Copilot", second: "Claude Code", reason: "API, 테스트, PR 흐름과 레거시 분석 조합이 좋습니다." },
  { role: "데이터 엔지니어", first: "Claude Code", second: "Cursor", reason: "SQL, 파이프라인, 원인 분석처럼 긴 맥락이 중요합니다." },
  { role: "대기업/금융/공공", first: "Tabnine", second: "Copilot Enterprise", reason: "보안, 감사로그, 데이터 통제가 우선입니다." },
];

export const AIC_FAQ = [
  {
    question: "가장 좋은 AI 코딩 도구 하나만 고르면 무엇인가요?",
    answer: "일반 개발자라면 GitHub Copilot 또는 Cursor가 무난합니다. 다만 복잡한 리팩터링은 Claude Code, 보안조직은 Tabnine처럼 상황별 선택이 다릅니다.",
  },
  {
    question: "Copilot과 Cursor는 같이 써도 되나요?",
    answer: "가능하지만 자동완성·채팅 기능이 겹칩니다. 비용 대비 효과를 보려면 한 도구를 주력으로 쓰고 보조 도구는 명확한 용도로 제한하는 편이 좋습니다.",
  },
  {
    question: "회사 코드에 AI 도구를 써도 안전한가요?",
    answer: "조직 정책, 데이터 보존 조건, SSO·감사로그·온프레미스 여부를 확인해야 합니다. 개인 계정으로 회사 코드를 넣는 것은 피해야 합니다.",
  },
  {
    question: "월 구독료는 어떻게 판단해야 하나요?",
    answer: "개발자 시간이 월 1~2시간만 절감되어도 개인 플랜은 회수 가능성이 큽니다. 실제 판단은 AI 업무 ROI 계산기로 확인하는 편이 좋습니다.",
  },
  {
    question: "Windsurf는 어떤 개발자에게 맞나요?",
    answer: "무료 플랜으로 AI 코딩 도구를 처음 경험하거나, 소규모 팀에서 에이전트 기반 흐름을 써보고 싶을 때 진입 장벽이 낮습니다. 다만 제품 정책 변화가 빠른 편이라 도입 전 최신 플랜을 확인해야 합니다.",
  },
  {
    question: "AI 코딩 도구를 처음 쓴다면 어디서 시작해야 하나요?",
    answer: "이미 GitHub을 사용 중이라면 GitHub Copilot Free 또는 Pro로 시작하는 것이 가장 자연스럽습니다. VS Code, JetBrains 등 기존 IDE에서 바로 활성화되고 별도 환경 설정이 거의 없습니다. 새 IDE에 도전해 볼 의향이 있다면 Cursor도 좋은 시작점입니다.",
  },
  {
    question: "무료로 사용할 수 있는 도구가 있나요?",
    answer: "GitHub Copilot은 학생 및 오픈소스 기여자에게 무료 플랜을 제공하고, Windsurf도 무료 플랜이 있습니다. 단, 무료 플랜은 요청 횟수·모델 품질·기능이 제한될 수 있으므로 업무 적용 전 실제 사용 한도를 확인해야 합니다.",
  },
  {
    question: "Claude Code는 자동완성이 약하다고 하는데, 왜 추천하나요?",
    answer: "Claude Code는 인라인 자동완성보다 에이전트 방식의 코드 분석과 수정에 특화되어 있습니다. 레거시 코드 파악, 대형 리팩터링, 복잡한 버그 추적처럼 긴 컨텍스트가 필요한 작업에서 다른 도구보다 유리합니다. 자동완성 위주의 작업이라면 Copilot이나 Cursor와 병행하는 방법도 있습니다.",
  },
  {
    question: "팀 도입 시 어떤 기준으로 선택해야 하나요?",
    answer: "보안·감사로그 요건이 있다면 Tabnine 또는 Copilot Enterprise를 우선 검토해야 합니다. 스타트업이나 소규모 팀이라면 Cursor Teams나 Windsurf Teams의 가격 효율이 좋습니다. 팀 규모가 클수록 사용량 기반 과금과 정액 플랜의 총비용 차이를 미리 계산해봐야 합니다.",
  },
  {
    question: "AI 코딩 도구가 코드 품질을 낮추지 않나요?",
    answer: "AI 제안을 리뷰 없이 그대로 수락하면 버그나 불필요한 코드가 늘 수 있습니다. AI 도구는 작성 속도를 높이는 것이지 코드 리뷰를 대체하지 않습니다. 테스트 커버리지와 코드 리뷰 프로세스를 유지하면서 사용하는 것이 가장 효과적입니다.",
  },
];

export const AIC_RELATED_LINKS = [
  { href: "/tools/ai-work-roi-calculator/", label: "AI 업무 ROI 계산기" },
  { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기" },
  { href: "/tools/ai-subscription-cost/", label: "AI 도구 월비용 계산기" },
  { href: "/reports/ai-job-salary-impact-2026/", label: "직군별 AI 연봉 효과 리포트" },
];

