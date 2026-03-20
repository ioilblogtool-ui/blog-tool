export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  eyebrow?: string;
  category?: string;
  iframeReady?: boolean;
  badges?: string[];
};

export const tools: ToolMeta[] = [
  {
    slug: "salary",
    title: "연봉 인상 계산기",
    description: "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지",
    order: 1,
    eyebrow: "Salary Tool",
    category: "calculator",
    iframeReady: true,
    badges: ["추천"]
  },
  {
    slug: "retirement",
    title: "퇴직금 계산기",
    description: "평균임금 기준 퇴직금과 세후 추정액을 계산하는 페이지",
    order: 2,
    eyebrow: "Retirement Tool",
    category: "calculator",
    iframeReady: true
  },
  {
    slug: "negotiation",
    title: "이직 계산기",
    description: "현재 연봉과 목표 연봉의 세전 실수령 차이를 비교하는 페이지",
    order: 3,
    eyebrow: "Negotiation Tool",
    category: "calculator",
    iframeReady: true,
    badges: ["추천"]
  },
  {
    slug: "parental-leave",
    title: "육아휴직 계산기",
    description: "육아휴직 급여와 복직 후 수입을 비교해 버퍼를 계산하는 페이지",
    order: 4,
    eyebrow: "Parental Leave Tool",
    category: "calculator",
    iframeReady: true
  },
  {
    slug: "bonus-simulator",
    title: "대기업 성과급 시뮬레이터",
    description: "삼성전자, SK하이닉스, 현대자동차의 직급별 성과급과 2026~2028 총보상 시나리오를 비교하는 페이지",
    order: 5,
    eyebrow: "Bonus Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"]
  }
];
