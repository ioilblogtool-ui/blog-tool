export type BonusCompareItemType = "calculator" | "comparison" | "report" | "anchor";
export type BonusCompareBadgeTone = "default" | "popular" | "new" | "tax" | "industry" | "company";

export interface BonusCompareBadge {
  label: string;
  tone: BonusCompareBadgeTone;
}

export interface BonusCompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: BonusCompareItemType;
  criteria: string[];
  badges: BonusCompareBadge[];
  ctaLabel: string;
  priority: number;
}

export interface BonusCompareGuide {
  title: string;
  description: string;
}

export interface BonusCompareFlowStep {
  title: string;
  description: string;
}

export interface BonusCompareFaq {
  question: string;
  answer: string;
}

export const BONUS_COMPARE_QUICK_LINKS: BonusCompareItem[] = [
  {
    id: "quick-simulator",
    title: "내 성과급 먼저 계산",
    description: "연봉과 성과급률을 넣어 대기업 성과급을 빠르게 추정합니다.",
    href: "/tools/bonus-simulator/",
    type: "calculator",
    criteria: ["연봉", "성과급률", "세전 금액"],
    badges: [{ label: "빠른 계산", tone: "popular" }],
    ctaLabel: "계산하기",
    priority: 1,
  },
  {
    id: "quick-after-tax",
    title: "세후 금액 확인",
    description: "성과급에서 세금과 4대보험을 뺀 통장 입금액을 추정합니다.",
    href: "/tools/bonus-after-tax-calculator/",
    type: "calculator",
    criteria: ["소득세", "지방소득세", "4대보험"],
    badges: [{ label: "세후", tone: "tax" }],
    ctaLabel: "실수령액 보기",
    priority: 2,
  },
  {
    id: "quick-company",
    title: "회사별 계산기",
    description: "삼성전자, SK하이닉스, 현대차, LG전자 계산기로 바로 이동합니다.",
    href: "#company",
    type: "anchor",
    criteria: ["삼성전자", "SK하이닉스", "현대차", "LG전자"],
    badges: [{ label: "회사별", tone: "company" }],
    ctaLabel: "회사 선택",
    priority: 3,
  },
  {
    id: "quick-industry",
    title: "업종별 비교",
    description: "반도체, 자동차, 정유사, 금융권, 조선업, 빅테크, 항공, 통신 성과급을 비교합니다.",
    href: "#industry",
    type: "anchor",
    criteria: ["반도체", "자동차", "빅테크", "항공"],
    badges: [{ label: "업종별", tone: "industry" }],
    ctaLabel: "업종 선택",
    priority: 4,
  },
];

export const BONUS_COMPARE_POPULAR_ITEMS: BonusCompareItem[] = [
  {
    id: "samsung-bonus",
    title: "삼성전자 성과급 계산기",
    description: "OPI, TAI, 협의안 기준으로 삼성전자 성과급을 계산합니다.",
    href: "/tools/samsung-bonus/",
    type: "calculator",
    criteria: ["OPI", "TAI", "협의안"],
    badges: [{ label: "인기", tone: "popular" }, { label: "회사별", tone: "company" }],
    ctaLabel: "삼성전자 계산",
    priority: 1,
  },
  {
    id: "sk-hynix-bonus",
    title: "SK하이닉스 성과급 계산기",
    description: "PS, PI 구조를 기준으로 SK하이닉스 성과급을 계산합니다.",
    href: "/tools/sk-hynix-bonus/",
    type: "calculator",
    criteria: ["PS", "PI", "세후"],
    badges: [{ label: "인기", tone: "popular" }, { label: "반도체", tone: "industry" }],
    ctaLabel: "하이닉스 계산",
    priority: 2,
  },
  {
    id: "bonus-simulator",
    title: "대기업 성과급 시뮬레이터",
    description: "회사별 성과급률을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/bonus-simulator/",
    type: "calculator",
    criteria: ["회사 비교", "연봉", "세전"],
    badges: [{ label: "비교", tone: "default" }],
    ctaLabel: "시뮬레이션",
    priority: 3,
  },
  {
    id: "bonus-after-tax",
    title: "성과급 세후 실수령액 계산기",
    description: "세전 성과급이 실제 통장에 얼마 남는지 추정합니다.",
    href: "/tools/bonus-after-tax-calculator/",
    type: "calculator",
    criteria: ["세후", "원천징수", "실수령액"],
    badges: [{ label: "세후", tone: "tax" }],
    ctaLabel: "실수령액 계산",
    priority: 4,
  },
  {
    id: "hyundai-bonus",
    title: "현대차 성과급 계산기",
    description: "임단협 패키지와 성과급 체감액을 함께 계산합니다.",
    href: "/tools/hyundai-bonus/",
    type: "calculator",
    criteria: ["임단협", "격려금", "세후"],
    badges: [{ label: "자동차", tone: "industry" }],
    ctaLabel: "현대차 계산",
    priority: 5,
  },
  {
    id: "lg-bonus",
    title: "LG전자 성과급 계산기",
    description: "기본급과 성과급률을 기준으로 LG전자 성과급을 계산합니다.",
    href: "/tools/lg-bonus/",
    type: "calculator",
    criteria: ["기본급", "성과급률", "세후"],
    badges: [{ label: "회사별", tone: "company" }],
    ctaLabel: "LG전자 계산",
    priority: 6,
  },
  {
    id: "posco-bonus",
    title: "포스코 성과급 계산기",
    description: "포스코·포스코퓨처엠 등 포스코그룹 성과급을 계열사별로 계산합니다.",
    href: "/tools/posco-bonus-calculator/",
    type: "calculator",
    criteria: ["포스코", "계열사", "세후"],
    badges: [{ label: "제조", tone: "industry" }, { label: "신규", tone: "new" }],
    ctaLabel: "포스코 계산",
    priority: 7,
  },
  {
    id: "doosan-enerbility-bonus",
    title: "두산에너빌리티 성과급 계산기",
    description: "두산에너빌리티 연봉과 PS 지급률을 기준으로 성과급 시나리오를 계산합니다.",
    href: "/tools/doosan-enerbility-bonus-calculator/",
    type: "calculator",
    criteria: ["두산", "에너지", "PS"],
    badges: [{ label: "에너지", tone: "industry" }, { label: "추정", tone: "default" }],
    ctaLabel: "두산 계산",
    priority: 8,
  },
  {
    id: "hanwha-bonus",
    title: "한화오션·한화에어로 성과급 계산기",
    description: "조선·방산 계열 성과급을 연봉, 지급률, 월급 배수 기준으로 계산합니다.",
    href: "/tools/hanwha-bonus-calculator/",
    type: "calculator",
    criteria: ["한화오션", "한화에어로", "방산"],
    badges: [{ label: "조선·방산", tone: "industry" }, { label: "신규", tone: "new" }],
    ctaLabel: "한화 계산",
    priority: 9,
  },
];

export const BONUS_COMPARE_INDUSTRY_ITEMS: BonusCompareItem[] = [
  {
    id: "semiconductor-bonus",
    title: "반도체 성과급 비교 계산기",
    description: "삼성전자, SK하이닉스, DB하이텍 등 반도체 기업 성과급을 같은 기준으로 비교합니다.",
    href: "/tools/semiconductor-bonus-comparison/",
    type: "comparison",
    criteria: ["삼성전자", "SK하이닉스", "DB하이텍"],
    badges: [{ label: "인기", tone: "popular" }, { label: "업종별", tone: "industry" }],
    ctaLabel: "반도체 비교",
    priority: 1,
  },
  {
    id: "auto-bonus",
    title: "자동차 성과급 비교 계산기",
    description: "현대차, 기아, 현대모비스 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/auto-bonus-comparison/",
    type: "comparison",
    criteria: ["현대차", "기아", "현대모비스"],
    badges: [{ label: "업종별", tone: "industry" }],
    ctaLabel: "자동차 비교",
    priority: 2,
  },
  {
    id: "oil-refinery-bonus",
    title: "정유사 성과급 비교 계산기",
    description: "S-OIL, GS칼텍스, HD현대오일뱅크, SK이노베이션 성과급을 비교합니다.",
    href: "/tools/oil-refinery-bonus-comparison/",
    type: "comparison",
    criteria: ["S-OIL", "GS칼텍스", "HD현대오일뱅크"],
    badges: [{ label: "업종별", tone: "industry" }],
    ctaLabel: "정유사 비교",
    priority: 3,
  },
  {
    id: "finance-bonus",
    title: "금융권 성과급 비교 계산기",
    description: "은행, 증권, 보험 업권별 성과급 구조를 같은 기준으로 비교합니다.",
    href: "/tools/finance-bonus-comparison/",
    type: "comparison",
    criteria: ["은행", "증권", "보험"],
    badges: [{ label: "금융권", tone: "industry" }],
    ctaLabel: "금융권 비교",
    priority: 4,
  },
  {
    id: "shipbuilding-bonus",
    title: "조선업 성과급 비교 계산기",
    description: "HD현대중공업, 한화오션, 삼성중공업 성과급을 비교합니다.",
    href: "/tools/shipbuilding-bonus-comparison/",
    type: "comparison",
    criteria: ["HD현대중공업", "한화오션", "삼성중공업"],
    badges: [{ label: "신규", tone: "new" }, { label: "업종별", tone: "industry" }],
    ctaLabel: "조선업 비교",
    priority: 5,
  },
  {
    id: "it-platform-bonus",
    title: "IT 플랫폼 성과급 비교 계산기",
    description: "네이버, 카카오, 쿠팡 등 IT 플랫폼 기업 성과급 구조를 비교합니다.",
    href: "/tools/it-platform-bonus-comparison/",
    type: "comparison",
    criteria: ["네이버", "카카오", "쿠팡"],
    badges: [{ label: "IT", tone: "industry" }],
    ctaLabel: "IT 플랫폼 비교",
    priority: 6,
  },
  {
    id: "it-bigtech-bonus",
    title: "국내 빅테크 5사 성과급 비교 계산기",
    description: "카카오, 네이버, 토스, 라인플러스, 쿠팡 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/it-bigtech-bonus-comparison/",
    type: "comparison",
    criteria: ["카카오", "네이버", "토스", "쿠팡"],
    badges: [{ label: "신규", tone: "new" }, { label: "빅테크", tone: "industry" }],
    ctaLabel: "빅테크 비교",
    priority: 7,
  },
  {
    id: "game-industry-bonus",
    title: "게임업계 4사 성과급 비교 계산기",
    description: "넥슨, 넷마블, 엔씨소프트, 크래프톤 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/game-industry-bonus-comparison/",
    type: "comparison",
    criteria: ["넥슨", "넷마블", "엔씨소프트", "크래프톤"],
    badges: [{ label: "신규", tone: "new" }, { label: "게임", tone: "industry" }],
    ctaLabel: "게임업계 비교",
    priority: 8,
  },
  {
    id: "airline-bonus",
    title: "항공사 5사 성과급 비교 계산기",
    description: "대한항공, 아시아나, 제주항공, 티웨이, 진에어 성과급을 직군별로 비교합니다.",
    href: "/tools/airline-bonus-comparison/",
    type: "comparison",
    criteria: ["대한항공", "아시아나", "LCC"],
    badges: [{ label: "신규", tone: "new" }, { label: "항공", tone: "industry" }],
    ctaLabel: "항공사 비교",
    priority: 9,
  },
  {
    id: "telecom-bonus",
    title: "통신 3사 성과급 비교 계산기",
    description: "KT, SK텔레콤, LG유플러스 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/telecom-bonus-comparison/",
    type: "comparison",
    criteria: ["KT", "SKT", "LG유플러스"],
    badges: [{ label: "통신", tone: "industry" }],
    ctaLabel: "통신 3사 비교",
    priority: 10,
  },
];

export const BONUS_COMPARE_COMPANY_ITEMS: BonusCompareItem[] = [
  BONUS_COMPARE_POPULAR_ITEMS[0],
  BONUS_COMPARE_POPULAR_ITEMS[1],
  BONUS_COMPARE_POPULAR_ITEMS[4],
  BONUS_COMPARE_POPULAR_ITEMS[5],
  BONUS_COMPARE_POPULAR_ITEMS[6],
  BONUS_COMPARE_POPULAR_ITEMS[7],
  BONUS_COMPARE_POPULAR_ITEMS[8],
];

export const BONUS_COMPARE_REPORT_ITEMS: BonusCompareItem[] = [
  {
    id: "corporate-bonus-ranking",
    title: "2026 대기업 성과급 순위 TOP 10",
    description: "성과급 많이 주는 회사를 순위형으로 확인하고, 회사별 계산기로 이어서 봅니다.",
    href: "/reports/corporate-bonus-ranking-top10-2026/",
    type: "report",
    criteria: ["성과급 순위", "TOP10", "대기업"],
    badges: [{ label: "인기", tone: "popular" }, { label: "순위", tone: "default" }],
    ctaLabel: "순위 보기",
    priority: 0.5,
  },
  {
    id: "corporate-bonus-report",
    title: "2026 대기업 성과급 비교",
    description: "대기업 성과급 흐름과 주요 회사별 보상 구조를 리포트로 정리합니다.",
    href: "/reports/corporate-bonus-comparison-2026/",
    type: "report",
    criteria: ["대기업", "2026", "비교"],
    badges: [{ label: "리포트", tone: "default" }],
    ctaLabel: "리포트 보기",
    priority: 1,
  },
  {
    id: "samsung-ds-guide",
    title: "삼성 DS 성과급 계산 가이드",
    description: "삼성전자 DS 부문 성과급 계산 구조와 확인 포인트를 설명합니다.",
    href: "/reports/samsung-ds-bonus-calculation-guide/",
    type: "report",
    criteria: ["삼성 DS", "OPI", "TAI"],
    badges: [{ label: "삼성전자", tone: "company" }],
    ctaLabel: "가이드 보기",
    priority: 2,
  },
  {
    id: "sk-hynix-2027",
    title: "SK하이닉스 성과급 2027",
    description: "SK하이닉스 성과급 전망과 계산 포인트를 후속 리포트로 확인합니다.",
    href: "/reports/sk-hynix-bonus-2027/",
    type: "report",
    criteria: ["SK하이닉스", "PS", "전망"],
    badges: [{ label: "하이닉스", tone: "company" }],
    ctaLabel: "전망 보기",
    priority: 3,
  },
  {
    id: "insurance-salary-bonus",
    title: "보험사 연봉·성과급 비교",
    description: "금융권 안에서도 보험사 연봉과 성과급 구조를 별도로 비교합니다.",
    href: "/reports/insurance-salary-bonus-comparison-2026/",
    type: "report",
    criteria: ["보험", "연봉", "성과급"],
    badges: [{ label: "금융권", tone: "industry" }],
    ctaLabel: "비교 보기",
    priority: 4,
  },
  {
    id: "public-enterprise-bonus",
    title: "공기업 성과급 비교 2026",
    description: "한전, 코레일, LH 등 공공기관 성과급 구조를 입력 연봉 기준으로 비교합니다.",
    href: "/reports/public-enterprise-bonus-comparison-2026/",
    type: "report",
    criteria: ["공기업", "한전", "코레일", "LH"],
    badges: [{ label: "공기업", tone: "industry" }, { label: "신규", tone: "new" }],
    ctaLabel: "공기업 비교",
    priority: 5,
  },
  {
    id: "retail-food-bonus",
    title: "유통·식품 성과급 비교 2026",
    description: "쿠팡, 이마트, CJ제일제당, CJ올리브영 성과급 구조를 직군별로 비교합니다.",
    href: "/reports/retail-food-bonus-comparison-2026/",
    type: "report",
    criteria: ["쿠팡", "이마트", "CJ", "직군"],
    badges: [{ label: "유통·식품", tone: "industry" }, { label: "신규", tone: "new" }],
    ctaLabel: "유통·식품 비교",
    priority: 6,
  },
];

export const BONUS_COMPARE_GUIDES: BonusCompareGuide[] = [
  {
    title: "같은 연봉으로 비교",
    description: "회사별 성과급률만 비교하면 착시가 생길 수 있습니다. 같은 연봉을 넣어야 체감 차이가 보입니다.",
  },
  {
    title: "세전과 세후를 분리",
    description: "성과급은 원천징수와 4대보험 영향이 큽니다. 세전 금액을 본 뒤 세후 실수령액까지 확인해야 합니다.",
  },
  {
    title: "고정 보상과 변동 보상 구분",
    description: "격려금, 협의금, 상품권, 주식 보상은 성과급과 성격이 다를 수 있어 따로 보는 것이 좋습니다.",
  },
  {
    title: "공식값과 추정값 구분",
    description: "회사 공지, 노조 합의안, 언론 보도, 계산 모델을 구분해야 실제 지급액과 혼동을 줄일 수 있습니다.",
  },
];

export const BONUS_COMPARE_FLOW: BonusCompareFlowStep[] = [
  {
    title: "회사별 또는 업종별 성과급 계산",
    description: "삼성전자, SK하이닉스 같은 회사별 계산기나 반도체·자동차 등 업종별 비교 계산기를 먼저 선택합니다.",
  },
  {
    title: "세전 성과급 확인",
    description: "연봉, 기본급, 성과급률, 협의금 등 입력값을 기준으로 세전 성과급을 확인합니다.",
  },
  {
    title: "세후 실수령액으로 재계산",
    description: "성과급 세후 실수령액 계산기에서 소득세와 4대보험을 반영한 통장 입금액을 추정합니다.",
  },
  {
    title: "같은 기준으로 최종 비교",
    description: "세전 금액보다 세후 실수령액과 지급 시점을 함께 봐야 실제 체감 차이를 비교할 수 있습니다.",
  },
];

export const BONUS_COMPARE_SEO_INTRO = [
  "성과급 비교표는 회사별 성과급 계산기와 업종별 성과급 비교 계산기를 한곳에 모은 허브입니다. 삼성전자, SK하이닉스, 현대차, LG전자처럼 검색 수요가 높은 회사별 계산기와 반도체, 자동차, 정유사, 금융권, 조선업, IT 플랫폼, 빅테크, 게임, 항공, 통신 성과급 비교 계산기를 빠르게 연결합니다.",
  "성과급은 회사마다 OPI, TAI, PS, PI, 격려금, 협의금처럼 이름과 지급 기준이 다릅니다. 삼성전자 DS사업부 OPI는 사업부 이익에 연동되고, SK하이닉스 PS는 영업이익 기준으로 산정되는 등 회사별로 구조가 달라 단순 퍼센트 비교가 어렵습니다.",
  "세전 성과급이 같아도 연봉 기준에 따라 세후 실수령액 차이가 수백만 원이 날 수 있습니다. 특히 성과급이 기본 연봉의 50% 이상이면 소득세 구간이 올라가 세후 체감 비율이 크게 낮아질 수 있어 세후 기준 비교가 중요합니다.",
  "업종별 성과급 비교에서는 반도체·자동차·정유사·금융권·조선업 같은 제조·금융 업종뿐 아니라 빅테크·게임·항공·통신처럼 검색 수요가 늘어난 서비스 업종까지 확인할 수 있습니다. 호황기와 불황기에 따라 업종별 성과급 격차가 크게 벌어질 수 있습니다.",
  "이 페이지의 비교표와 계산 결과는 공개자료와 계산 모델을 바탕으로 정리한 참고용 콘텐츠입니다. 실제 지급액은 회사 공지, 사업부, 직급, 평가, 근속, 지급 시점, 개인 과세 조건에 따라 달라질 수 있습니다.",
];

export const BONUS_COMPARE_SEO_CRITERIA = [
  "회사별 성과급 계산기는 삼성전자, SK하이닉스, 현대차, LG전자처럼 개별 회사의 성과급 구조를 먼저 확인할 때 적합합니다.",
  "업종별 성과급 비교 계산기는 반도체, 자동차, 정유사, 금융권, 조선업처럼 같은 업종 안에서 회사 간 차이를 볼 때 적합합니다.",
  "성과급 세후 실수령액 계산기는 세전 성과급을 확인한 뒤 실제 통장 입금액을 추정할 때 사용합니다.",
  "성과급 비교는 연봉, 기본급, 성과급률, 세전·세후 구분, 지급 시점, 공식값·추정값 구분을 함께 봐야 합니다.",
];

export const BONUS_COMPARE_FAQ: BonusCompareFaq[] = [
  {
    question: "성과급 비교표와 성과급 계산기는 무엇이 다른가요?",
    answer: "성과급 비교표는 여러 회사와 업종의 성과급 계산기를 같은 기준으로 모아 보여주는 허브입니다. 성과급 계산기는 사용자가 입력한 연봉, 기본급, 성과급률 등을 바탕으로 개별 결과를 추정하는 도구입니다.",
  },
  {
    question: "성과급은 세전 금액으로 비교해야 하나요?",
    answer: "처음에는 세전 금액으로 구조를 비교하고, 최종 판단은 세후 실수령액 기준으로 보는 것이 좋습니다. 성과급은 소득세, 지방소득세, 4대보험 영향으로 통장 입금액이 달라질 수 있습니다.",
  },
  {
    question: "삼성전자와 SK하이닉스 성과급은 같은 방식으로 계산되나요?",
    answer: "아닙니다. 회사별로 성과급 명칭, 지급 기준, 사업부 기준, 지급 시점이 다릅니다. 따라서 같은 연봉과 세후 실수령액 기준으로 환산해 비교해야 체감 차이를 보기 쉽습니다.",
  },
  {
    question: "업종별 성과급 비교는 정확한 지급액인가요?",
    answer: "공개자료와 계산 모델 기반의 참고값입니다. 실제 지급액은 회사 공지, 사업부, 직급, 평가, 근속, 개인 과세 조건에 따라 달라질 수 있습니다.",
  },
  {
    question: "없는 회사는 어떻게 비교하면 좋나요?",
    answer: "먼저 대기업 성과급 시뮬레이터에 연봉과 성과급률을 넣어 대략적인 세전 금액을 확인하고, 이후 성과급 세후 실수령액 계산기로 통장 입금액을 추정하는 흐름을 권장합니다.",
  },
];
