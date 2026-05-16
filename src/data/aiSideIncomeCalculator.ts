export type SideJobType =
  | "freelance-writing"
  | "content-creation"
  | "online-course"
  | "dev-outsourcing"
  | "design-outsourcing"
  | "data-labeling";

export type SideJobPreset = {
  id: SideJobType;
  label: string;
  description: string;
  defaultHourlyRate: number;
  defaultProductivityBoost: number;
  representativeTools: string[];
  incomeTip: string;
};

export type AiSideIncomeNextStep = {
  href: string;
  eyebrow: string;
  label: string;
  description: string;
};

export const ASIC_META = {
  slug: "ai-side-income-calculator",
  title: "AI 부업 수입 계산기",
  description:
    "프리랜서 글쓰기, 개발 외주, 콘텐츠 제작 등 부업 유형별로 AI 도구 사용 전후 예상 수입과 도구 구독료 차감 후 순수입을 계산합니다.",
  updatedAt: "2026-05-10",
  caution:
    "수입은 시장 단가, 클라이언트 조건, 실제 AI 사용 숙련도에 따라 달라지는 개인별 추정값입니다. 세금, 사업자 신고, 소득 신고 판단의 공식 자료로 사용하지 마세요.",
};

export const ASIC_DEFAULT_INPUT = {
  jobType: "dev-outsourcing" as SideJobType,
  hoursPerMonth: 20,
  baseHourlyRate: 60000,
  aiProductivityBoost: 70,
  aiToolMonthlyCost: 30000,
};

export const ASIC_JOB_PRESETS: SideJobPreset[] = [
  {
    id: "freelance-writing",
    label: "프리랜서 글쓰기·번역",
    description: "초안 작성, 번역, 카피라이팅처럼 문장 생산이 많은 부업",
    defaultHourlyRate: 25000,
    defaultProductivityBoost: 60,
    representativeTools: ["ChatGPT", "Claude", "DeepL"],
    incomeTip: "AI 초안을 그대로 납품하기보다 검수와 톤 보정 시간을 반드시 남겨두는 편이 안전합니다.",
  },
  {
    id: "content-creation",
    label: "유튜브·블로그·SNS 콘텐츠",
    description: "기획, 대본, 썸네일, 쇼츠 아이디어를 반복 생산하는 부업",
    defaultHourlyRate: 20000,
    defaultProductivityBoost: 50,
    representativeTools: ["ChatGPT", "Suno", "Canva AI"],
    incomeTip: "조회수형 수입은 변동성이 크므로 초기에는 시간당 단가를 보수적으로 잡는 것이 좋습니다.",
  },
  {
    id: "online-course",
    label: "온라인 강의·전자책",
    description: "강의 자료, 커리큘럼, 전자책 초안을 만드는 지식 상품 부업",
    defaultHourlyRate: 40000,
    defaultProductivityBoost: 30,
    representativeTools: ["ChatGPT", "Gamma", "Notion AI"],
    incomeTip: "AI는 제작 시간을 줄여주지만 판매 전환율은 주제, 신뢰도, 유입 채널의 영향을 크게 받습니다.",
  },
  {
    id: "dev-outsourcing",
    label: "개발 외주·코딩 자동화",
    description: "간단한 MVP, 업무 자동화, 코드 리팩터링을 맡는 기술 부업",
    defaultHourlyRate: 60000,
    defaultProductivityBoost: 70,
    representativeTools: ["Claude Code", "Cursor", "Copilot"],
    incomeTip: "요구사항 정리와 테스트 책임은 여전히 본인에게 있으므로 검수 시간을 단가에 반영하세요.",
  },
  {
    id: "design-outsourcing",
    label: "디자인·영상·편집 외주",
    description: "시안 제작, 이미지 보정, 숏폼 편집처럼 산출물 변형이 많은 부업",
    defaultHourlyRate: 45000,
    defaultProductivityBoost: 40,
    representativeTools: ["Midjourney", "Runway", "Adobe AI"],
    incomeTip: "상업 이용 권리와 원본 파일 제공 범위를 사전에 정하면 재작업 비용을 줄일 수 있습니다.",
  },
  {
    id: "data-labeling",
    label: "데이터 라벨링·AI 검수",
    description: "반복 라벨링, 분류, 모델 응답 검수처럼 기준 적용이 중요한 부업",
    defaultHourlyRate: 15000,
    defaultProductivityBoost: 80,
    representativeTools: ["자동화 스크립트", "GPT API", "스프레드시트"],
    incomeTip: "자동화가 가능한 반복 작업은 단가가 빠르게 낮아질 수 있어 전문 도메인 검수로 확장하는 편이 낫습니다.",
  },
];

export const ASIC_NEXT_STEPS: AiSideIncomeNextStep[] = [
  {
    href: "/tools/ai-work-roi-calculator/",
    eyebrow: "업무 ROI",
    label: "AI 업무 ROI 계산기",
    description: "반복업무 절감 시간과 AI 구독료를 비교해 직장 업무 기준 ROI를 확인합니다.",
  },
  {
    href: "/tools/ai-automation-hourly-roi/",
    eyebrow: "시간 단가",
    label: "AI 업무 자동화 시급 계산기",
    description: "자동화로 줄인 시간을 시급 상승 효과와 회수 기간으로 바꿔 봅니다.",
  },
  {
    href: "/tools/ai-subscription-cost/",
    eyebrow: "구독료",
    label: "AI 도구 월비용 계산기",
    description: "ChatGPT, Claude, Copilot 등 AI 도구 구독료 합계와 중복 비용을 점검합니다.",
  },
  {
    href: "/reports/ai-coding-tools-comparison-2026/",
    eyebrow: "도구 비교",
    label: "AI 코딩 도구 비교 리포트",
    description: "개발 부업에 쓰기 좋은 AI 코딩 도구의 비용과 용도를 비교합니다.",
  },
];

export const ASIC_FAQ = [
  {
    question: "AI를 쓰면 실제로 부업 수입이 늘어나나요?",
    answer:
      "업종에 따라 다릅니다. 코딩, 번역, 글쓰기처럼 초안 생성과 반복 수정이 많은 부업은 생산성 향상이 비교적 크게 나타날 수 있습니다. 반면 클라이언트 설득, 영업, 전문 판단이 핵심인 일은 AI의 직접 기여가 제한적일 수 있습니다.",
  },
  {
    question: "생산성 향상률은 몇 퍼센트로 입력해야 현실적인가요?",
    answer:
      "처음 사용하는 단계라면 30~50%를 보수적인 시작값으로 두는 것이 좋습니다. 이미 Claude Code, Cursor, ChatGPT 같은 도구를 능숙하게 쓰는 개발·문서 작업자는 50~100%도 가능하지만, 실제 납품 품질 검수 시간을 빼고 생각해야 합니다.",
  },
  {
    question: "AI 도구 구독료는 어디까지 포함해야 하나요?",
    answer:
      "부업에 직접 쓰는 월 구독료를 합산하세요. ChatGPT Plus, Claude Pro, Cursor Pro, Midjourney처럼 매달 지출하는 비용을 넣고, 업무와 개인 용도를 함께 쓴다면 부업에 쓰는 비중만 반영하는 편이 합리적입니다.",
  },
  {
    question: "부업 수입의 세금은 이 계산기에 반영되나요?",
    answer:
      "아니요. 이 계산기는 AI 도구 비용 차감 전후의 수입 구조를 보는 추정 도구입니다. 실제 부업 수입은 기타소득 또는 사업소득 신고 대상이 될 수 있으므로 세금 판단은 국세청 안내나 세무 전문가에게 확인해야 합니다.",
  },
  {
    question: "프리랜서 시급은 어떻게 정하면 되나요?",
    answer:
      "숨고, 크몽, 프리랜서 플랫폼의 유사 서비스 단가를 먼저 확인하고 본인의 포트폴리오와 납품 난이도에 맞춰 조정하세요. 초보 단계에서는 시장 평균보다 낮게 시작하되, AI로 처리량과 품질이 안정되면 단가를 올릴 근거가 생깁니다.",
  },
  {
    question: "도구비 회수 기간이 즉시 회수로 나오면 무조건 유료 도구를 써도 되나요?",
    answer:
      "즉시 회수는 이번 달 예상 AI 추가 수입이 월 구독료보다 크다는 뜻입니다. 다만 실제 수주가 안정적인지, 도구가 납품 품질을 높이는지, 구독을 유지할 만큼 반복 사용이 있는지도 함께 봐야 합니다.",
  },
  {
    question: "데이터 라벨링은 AI 때문에 일자리가 줄지 않나요?",
    answer:
      "단순 반복 라벨링 수요는 줄어들 수 있지만, 모델 응답 검수, 전문 도메인 라벨링, 품질 평가처럼 판단이 필요한 업무는 남을 가능성이 큽니다. AI는 1차 분류를 빠르게 처리하고 사람이 검수하는 방식으로 쓰는 것이 현실적입니다.",
  },
  {
    question: "몇 시간 정도 투자해야 의미 있는 부업 수입이 나오나요?",
    answer:
      "업종과 단가에 따라 다르지만 월 10~20시간은 감각을 유지할 수 있는 최소 수준으로 볼 수 있습니다. 개발 외주처럼 시급이 높은 부업은 적은 시간으로도 의미 있는 수입이 가능하고, 콘텐츠형 부업은 더 긴 누적 시간이 필요할 수 있습니다.",
  },
];

export const ASIC_RELATED_LINKS = ASIC_NEXT_STEPS.map((item) => ({
  href: item.href,
  label: item.label,
}));
