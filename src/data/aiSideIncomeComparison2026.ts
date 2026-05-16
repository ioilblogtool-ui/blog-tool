export type AiImpactLevel = "high" | "medium" | "low";
export type BarrierLevel = "low" | "medium" | "high";
export type GrowthLevel = "low" | "medium" | "high";

export interface AiSideJobCategory {
  id: string;
  name: string;
  aiImpact: AiImpactLevel;
  monthlyHoursRange: [number, number];
  incomeRange: { min: number; max: number };
  aiBoostRange: { min: number; max: number };
  hourlyRateRange: [number, number];
  requiredTools: string[];
  entryBarrier: BarrierLevel;
  growthPotential: GrowthLevel;
  pros: string[];
  cons: string[];
  bestFor: string;
  note: string;
}

export interface AiSideIncomeInsight {
  title: string;
  body: string;
}

export interface HoursSimulationRow {
  name: string;
  baseHourlyRate: number;   // 원/시간
  baseIncome: number;       // 월 20시간 기준 수입 (원)
  aiIncome: number;         // AI 50% 향상 시 수입 (원)
  netIncome: number;        // 도구비 3만 원 차감 후 (원)
}

export interface GuideItem {
  situation: string;
  recommend: string;
  reason: string;
}

// ─── 업종 비교 데이터 ───────────────────────────────────────
export const ASICR_JOBS: AiSideJobCategory[] = [
  {
    id: "dev",
    name: "개발 외주·코딩 대행",
    aiImpact: "high",
    monthlyHoursRange: [20, 40],
    incomeRange: { min: 800000, max: 4000000 },
    aiBoostRange: { min: 50, max: 100 },
    hourlyRateRange: [40000, 100000],
    requiredTools: ["Claude Code", "Cursor", "GitHub Copilot"],
    entryBarrier: "high",
    growthPotential: "high",
    pros: ["시급 최상", "AI 임팩트 최대", "납품 속도 2~3배"],
    cons: ["개발 역량 전제 필요", "결과물 품질 책임"],
    bestFor: "개발 경력자, 사이드 프로젝트 경험자",
    note:
      "AI 코드 생성으로 MVP·자동화 스크립트 납품 속도가 크게 빨라졌습니다. 단, AI 산출물을 검수할 수 있는 역량이 반드시 필요합니다.",
  },
  {
    id: "writing",
    name: "프리랜서 글쓰기·번역",
    aiImpact: "high",
    monthlyHoursRange: [15, 30],
    incomeRange: { min: 300000, max: 1500000 },
    aiBoostRange: { min: 40, max: 80 },
    hourlyRateRange: [20000, 50000],
    requiredTools: ["ChatGPT", "Claude", "DeepL Pro"],
    entryBarrier: "low",
    growthPotential: "medium",
    pros: ["진입 장벽 낮음", "AI 초안 활용 생산성 향상", "재택 100% 가능"],
    cons: ["단가 경쟁 심함", "수입 천장 낮음"],
    bestFor: "글쓰기·외국어 역량 보유자, 특정 도메인 전문가",
    note:
      "ChatGPT·Claude로 초안을 5~10분 안에 완성하고 수정에 집중하는 방식이 일반적입니다. 법률·의학·기술 도메인으로 특화하면 시급 5만 원 이상도 가능합니다.",
  },
  {
    id: "design",
    name: "디자인·영상 편집 외주",
    aiImpact: "medium",
    monthlyHoursRange: [20, 40],
    incomeRange: { min: 500000, max: 2000000 },
    aiBoostRange: { min: 30, max: 60 },
    hourlyRateRange: [25000, 50000],
    requiredTools: ["Midjourney", "Adobe Firefly", "Runway", "CapCut AI"],
    entryBarrier: "medium",
    growthPotential: "medium",
    pros: ["AI 시안 생성으로 시간 단축", "포트폴리오 자산 축적"],
    cons: ["디자인 기본 역량 필요", "AI 결과물 편집 실력 필요"],
    bestFor: "디자인·영상 편집 기술 보유자",
    note:
      "Midjourney·Adobe Firefly로 초안 시안을 빠르게 만들고 수정하면 납품 속도가 2배 이상 향상됩니다.",
  },
  {
    id: "lecture",
    name: "온라인 강의·튜터링",
    aiImpact: "medium",
    monthlyHoursRange: [10, 20],
    incomeRange: { min: 500000, max: 3000000 },
    aiBoostRange: { min: 20, max: 40 },
    hourlyRateRange: [50000, 150000],
    requiredTools: ["ChatGPT", "Gamma", "Notion AI"],
    entryBarrier: "medium",
    growthPotential: "high",
    pros: ["시급 최고 수준", "콘텐츠 자산 반복 수익", "AI로 자료 제작 효율화"],
    cons: ["초기 수강생 모집 어려움", "신뢰 구축 시간 필요"],
    bestFor: "전문 지식·강의 경험 보유자",
    note:
      "강의 커리큘럼 구성, 슬라이드, 예제 문제에 AI를 활용하면 준비 시간이 줄어듭니다. 한 번 만든 콘텐츠가 반복 수익을 내는 구조입니다.",
  },
  {
    id: "content",
    name: "유튜브·블로그 콘텐츠",
    aiImpact: "high",
    monthlyHoursRange: [20, 40],
    incomeRange: { min: 100000, max: 1000000 },
    aiBoostRange: { min: 40, max: 70 },
    hourlyRateRange: [5000, 25000],
    requiredTools: ["ChatGPT", "Suno", "Canva AI", "Perplexity"],
    entryBarrier: "low",
    growthPotential: "high",
    pros: ["진입 장벽 낮음", "장기 자산 축적", "AI로 콘텐츠 생산량 증가"],
    cons: ["수익화까지 6개월~1년 이상", "AI 생성만으로는 차별화 어려움"],
    bestFor: "장기적으로 채널을 키우고 싶은 사람",
    note:
      "AI로 스크립트·썸네일·SEO 키워드를 빠르게 처리할 수 있어 콘텐츠 생산량 증가에 유리합니다. 하지만 차별화된 관점과 스토리가 함께 필요합니다.",
  },
  {
    id: "labeling",
    name: "데이터 라벨링·AI 검수",
    aiImpact: "high",
    monthlyHoursRange: [30, 60],
    incomeRange: { min: 300000, max: 800000 },
    aiBoostRange: { min: 60, max: 90 },
    hourlyRateRange: [10000, 15000],
    requiredTools: ["자동화 스크립트", "GPT API"],
    entryBarrier: "low",
    growthPotential: "low",
    pros: ["즉시 시작 가능", "별도 장비 불필요", "AI 활용 작업 속도 향상"],
    cons: ["시급 낮음", "단순 라벨링 수요 줄어드는 추세"],
    bestFor: "당장 부업을 시작해야 하는 분",
    note:
      "단순 라벨링 수요는 줄지만 의료·법률·금융 도메인 전문 검수, RLHF 데이터 작업 수요는 지속됩니다. 전문 도메인으로 이동하는 것이 유리합니다.",
  },
  {
    id: "sns",
    name: "SNS 운영 대행",
    aiImpact: "medium",
    monthlyHoursRange: [15, 30],
    incomeRange: { min: 300000, max: 1500000 },
    aiBoostRange: { min: 30, max: 60 },
    hourlyRateRange: [20000, 50000],
    requiredTools: ["ChatGPT", "Canva AI", "Buffer AI"],
    entryBarrier: "low",
    growthPotential: "medium",
    pros: ["진입 장벽 낮음", "AI 콘텐츠 초안 자동화", "클라이언트 반복 계약"],
    cons: ["클라이언트 관리 부담", "플랫폼 알고리즘 변화 영향"],
    bestFor: "SNS 마케팅 경험자, 디지털 마케팅 관심자",
    note:
      "ChatGPT로 포스팅 초안·해시태그·캡션을 자동화하면 동시에 여러 클라이언트를 관리할 수 있습니다.",
  },
];

// ─── 핵심 인사이트 카드 ─────────────────────────────────────
export const ASICR_INSIGHTS: AiSideIncomeInsight[] = [
  {
    title: "시급 효율 최고",
    body: "개발 외주: AI 활용 시 실효 시급 최대 10만 원+. 기술 역량이 높을수록 AI 임팩트가 더 크게 나타납니다.",
  },
  {
    title: "빠른 시작 가능",
    body: "프리랜서 글쓰기·데이터 라벨링은 별도 장비 없이 내일부터 시작할 수 있는 진입 장벽 최저 업종입니다.",
  },
  {
    title: "AI 임팩트 최대",
    body: "개발 외주·데이터 라벨링: AI 활용 시 생산성 50~100% 향상 추정. 같은 시간에 더 많은 결과물을 만들 수 있습니다.",
  },
  {
    title: "장기 자산 축적",
    body: "온라인 강의·유튜브: 한 번 만든 콘텐츠가 반복 수익으로 연결되는 복리 구조. 초기 투자 후 장기 성장성 높음.",
  },
];

// ─── 월 20시간 투자 시 수입 시뮬레이션 ─────────────────────
export const ASICR_SIMULATION: HoursSimulationRow[] = [
  { name: "개발 외주", baseHourlyRate: 60000, baseIncome: 1200000, aiIncome: 1800000, netIncome: 1770000 },
  { name: "강의·튜터링", baseHourlyRate: 40000, baseIncome: 800000, aiIncome: 1120000, netIncome: 1090000 },
  { name: "디자인 외주", baseHourlyRate: 45000, baseIncome: 900000, aiIncome: 1170000, netIncome: 1140000 },
  { name: "프리랜서 글쓰기", baseHourlyRate: 25000, baseIncome: 500000, aiIncome: 725000, netIncome: 695000 },
  { name: "SNS 운영 대행", baseHourlyRate: 25000, baseIncome: 500000, aiIncome: 700000, netIncome: 670000 },
  { name: "콘텐츠 제작", baseHourlyRate: 20000, baseIncome: 400000, aiIncome: 560000, netIncome: 530000 },
  { name: "데이터 라벨링", baseHourlyRate: 15000, baseIncome: 300000, aiIncome: 540000, netIncome: 510000 },
];

// ─── 상황별 선택 가이드 ─────────────────────────────────────
export const ASICR_GUIDE: GuideItem[] = [
  { situation: "개발 역량이 있다", recommend: "개발 외주·코딩 대행", reason: "시급 최상, AI 임팩트 최대" },
  { situation: "글쓰기·외국어 역량이 있다", recommend: "프리랜서 글쓰기·번역", reason: "진입 쉽고 AI 활용도 높음" },
  { situation: "강의·지식 공유를 좋아한다", recommend: "온라인 강의·튜터링", reason: "시급 높고 콘텐츠 자산 장기 수익" },
  { situation: "당장 수입이 필요하다", recommend: "데이터 라벨링", reason: "진입 장벽 최저, 즉시 시작 가능" },
  { situation: "장기적으로 키우고 싶다", recommend: "유튜브·블로그", reason: "초기 느리지만 복리형 성장 구조" },
  { situation: "디자인·영상 역량이 있다", recommend: "디자인·영상 편집 외주", reason: "AI 도구로 납품 속도 2배+" },
];

// ─── FAQ ────────────────────────────────────────────────────
export const ASICR_FAQ = [
  {
    question: "AI 부업으로 월 100만 원 버는 게 현실적인가요?",
    answer:
      "업종에 따라 다릅니다. 개발 외주나 강의·튜터링처럼 시급이 높은 업종에서는 월 15~20시간 투자로도 100만 원 이상이 가능합니다. 반면 유튜브·블로그처럼 초기 수익화가 느린 업종은 수개월간 수입이 거의 없을 수 있습니다. 월 100만 원을 목표로 한다면 먼저 목표 시급을 정하고(목표 수입 ÷ 투입 가능 시간), 그 시급에 맞는 업종을 선택하세요.",
  },
  {
    question: "개발 경험이 없어도 AI로 개발 외주를 받을 수 있나요?",
    answer:
      "일부 단순한 랜딩페이지·자동화 스크립트 수준은 가능하지만, 일반적인 개발 외주를 AI만으로 처리하기는 어렵습니다. AI가 생성한 코드의 오류를 잡고 수정하려면 기본적인 프로그래밍 이해가 필요합니다. 비개발자라면 No-code/Low-code 도구(Bubble, Webflow 등)와 AI를 조합하는 방향이 현실적입니다.",
  },
  {
    question: "어떤 AI 도구가 부업에 가장 도움이 되나요?",
    answer:
      "업종에 따라 다릅니다. 글쓰기·번역은 ChatGPT 또는 Claude, 개발은 Claude Code·Cursor·GitHub Copilot, 디자인은 Midjourney·Adobe Firefly·Canva AI, 영상 편집은 Runway·CapCut AI가 대표적입니다. 처음에는 하나의 도구를 깊게 익히는 것이 여러 도구를 얕게 쓰는 것보다 생산성 향상에 유리합니다.",
  },
  {
    question: "AI 부업 수입은 세금 신고를 해야 하나요?",
    answer:
      "네. 개인이 부업으로 얻는 수입은 종합소득세 신고 대상입니다. 플랫폼(크몽·숨고·업워크 등)을 통한 수입은 기타소득 또는 사업소득으로 구분됩니다. 연간 수입이 300만 원을 초과하면 종합소득세 신고를 해야 하며, 개인사업자 등록을 하면 도구 구독료 등 경비 처리가 가능합니다.",
  },
  {
    question: "프리랜서 플랫폼에서 단가 경쟁이 심한데 어떻게 해야 하나요?",
    answer:
      "단가 경쟁을 피하는 핵심은 '전문 분야 특화'입니다. 법률·의학·IT 기술 분야 번역가는 일반 번역가보다 2~3배 높은 단가를 받습니다. AI로 생산성을 높이면서 특정 도메인에 집중하면 경쟁이 훨씬 줄어듭니다. 해외 플랫폼(Upwork, Fiverr)은 국내보다 단가 수준이 높은 경우가 많습니다.",
  },
  {
    question: "유튜브·블로그 수익화까지 얼마나 걸리나요?",
    answer:
      "유튜브 파트너십 기준(구독자 1,000명, 시청시간 4,000시간)까지 평균 6개월~2년이 걸립니다. 블로그 SEO 수익은 주제와 콘텐츠 품질에 따라 3개월~1년 이상 소요될 수 있습니다. AI로 콘텐츠 제작 속도를 높이면 더 빨리 도달할 수 있지만, 퀄리티 없는 대량 생산은 알고리즘 외면을 받을 수 있습니다.",
  },
  {
    question: "직장인이 부업을 하면 회사에서 알 수 있나요?",
    answer:
      "건강보험료가 올라가거나 연말정산 시 다른 소득원이 드러나는 경우 회사가 인지할 수 있습니다. 회사 취업규칙에 겸업 금지 조항이 있는 경우 문제가 될 수 있으므로 먼저 확인하세요. 부업 소득이 있는 경우 5월 종합소득세 신고 시 회사 급여와 합산 신고해야 합니다.",
  },
  {
    question: "데이터 라벨링은 AI 발전으로 없어지는 직종 아닌가요?",
    answer:
      "단순 이미지 분류·텍스트 태깅 같은 반복성 작업은 줄어들고 있지만, AI 모델 품질 검수(RLHF), 의료·법률·금융 도메인 라벨링, 한국어·문화 관련 AI 학습 데이터 작업 수요는 오히려 증가하고 있습니다. 전문 도메인으로 이동하는 것이 유리합니다.",
  },
];

// ─── 관련 링크 ──────────────────────────────────────────────
export const ASICR_RELATED_LINKS = [
  { href: "/tools/ai-side-income-calculator/", label: "AI 부업 수입 계산기" },
  { href: "/tools/ai-work-roi-calculator/", label: "AI 업무 ROI 계산기" },
  { href: "/tools/ai-automation-hourly-roi/", label: "AI 업무 자동화 시급 계산기" },
  { href: "/reports/ai-coding-tools-comparison-2026/", label: "AI 코딩 도구 비교" },
  { href: "/tools/ai-subscription-cost/", label: "AI 도구 월 비용 계산기" },
];

// ─── META ────────────────────────────────────────────────────
export const ASICR_META = {
  slug: "ai-side-income-comparison-2026",
  title: "AI 부업 수입 비교 2026",
  description:
    "개발 외주, 프리랜서, 강의, 콘텐츠 등 AI 활용 부업 7개 업종의 월 수입 범위, AI 생산성 향상률, 시간당 효율을 비교합니다.",
  updatedAt: "2026-05",
};
