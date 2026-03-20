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
  },
  {
    slug: "sk-hynix-bonus",
    title: "SK하이닉스 성과급 계산기",
    description: "개인·부부 모드로 SK하이닉스의 PS, PI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",
    order: 6,
    eyebrow: "SK Hynix Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"]
  },
  {
    slug: "birth-support-total",
    title: "출산~2세 총지원금 계산기",
    description: "첫만남이용권, 부모급여, 아동수당을 합쳐 아이 두 돌 전까지 받을 수 있는 총액을 계산하는 페이지",
    order: 7,
    eyebrow: "Birth Support Tool",
    category: "support",
    iframeReady: true,
    badges: ["추천"]
  },
  {
    slug: "single-parental-leave-total",
    title: "한 명만 육아휴직 총수령액 계산기",
    description: "육아휴직 급여, 부모급여, 아동수당, 첫만남이용권을 합쳐 아이 두 돌까지 가구 총수령액을 계산하는 페이지",
    order: 8,
    eyebrow: "Household Cashflow Tool",
    category: "support",
    iframeReady: true,
    badges: ["대표", "추천"]
  },
  {
    slug: "parental-leave-pay",
    title: "육아휴직 급여 계산기",
    description: "월 통상임금 기준으로 일반 육아휴직 사용 시 월별 급여와 총액을 계산하는 페이지",
    order: 9,
    eyebrow: "Parental Leave Pay Tool",
    category: "support",
    iframeReady: true
  },
  {
    slug: "six-plus-six",
    title: "6+6 부모육아휴직제 계산기",
    description: "부모 모두 육아휴직을 쓸 때 특례 적용 여부와 일반 육아휴직 대비 차액을 비교하는 페이지",
    order: 10,
    eyebrow: "6+6 Tool",
    category: "support",
    iframeReady: true,
    badges: ["신규"]
  }
];
