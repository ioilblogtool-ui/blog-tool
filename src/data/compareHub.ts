export type CompareItemType = "calculator" | "report" | "compare" | "planned";
export type CompareCategoryId = "bonus" | "welfare" | "realEstate" | "investment" | "salary";
export type CompareBadgeTone = "default" | "new" | "popular" | "estimate" | "official";

export interface CompareBadge {
  label: string;
  tone: CompareBadgeTone;
}

export interface CompareStat {
  label: string;
  value: string;
  context?: string;
}

export interface CompareItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: CompareItemType;
  categoryId: CompareCategoryId;
  criteria: string[];
  badges: CompareBadge[];
  stats: CompareStat[];
  ctaLabel: string;
  priority: number;
}

export interface CompareCategory {
  id: CompareCategoryId;
  title: string;
  description: string;
  criteria: string[];
  featuredItemIds: string[];
}

export interface ComparePrinciple {
  categoryId: CompareCategoryId;
  title: string;
  criteria: string[];
  caution: string;
}

export interface PlannedCompareItem {
  title: string;
  description: string;
  reason: string;
  categoryId: CompareCategoryId;
}

export const COMPARE_CATEGORIES: CompareCategory[] = [
  {
    id: "bonus",
    title: "성과급 비교",
    description: "회사·업종별 성과급을 연봉, 지급률, 세후 실수령액 기준으로 비교합니다.",
    criteria: ["연봉", "성과급률", "세후 추정", "지급 구조"],
    featuredItemIds: ["semiconductor-bonus", "auto-bonus", "shipbuilding-bonus", "finance-bonus"],
  },
  {
    id: "welfare",
    title: "지원금 비교",
    description: "청년, 출산, 복지, 주거 지원 제도를 가입 대상과 지원금 기준으로 비교합니다.",
    criteria: ["가입 대상", "소득 기준", "지원금", "신청기간"],
    featuredItemIds: ["youth-savings-maturity", "youth-savings-comparison", "welfare-benefit", "birth-support-total"],
  },
  {
    id: "realEstate",
    title: "부동산·대출 비교",
    description: "전월세, 매매, 대출, 청약, 세금을 초기자금과 월 부담 기준으로 비교합니다.",
    criteria: ["초기자금", "월 부담", "대출금리", "세금"],
    featuredItemIds: ["jeonse-vs-wolse", "loan-refinancing", "home-purchase-fund", "apt-cheonyak"],
  },
  {
    id: "investment",
    title: "투자·ETF 비교",
    description: "적금, ETF, 배당, 수수료를 수익률과 세금, 투자기간 기준으로 비교합니다.",
    criteria: ["수익률", "세금", "수수료", "투자기간"],
    featuredItemIds: ["savings-vs-etf", "stock-fee", "monthly-dividend-etf", "dca-investment"],
  },
  {
    id: "salary",
    title: "연봉·초봉 비교",
    description: "기업, 업종, 직군별 연봉과 초봉을 총보상 관점에서 비교합니다.",
    criteria: ["초봉", "평균연봉", "성과급", "복지"],
    featuredItemIds: ["new-employee-salary", "it-salary-top10", "it-si-sm", "insurance-salary"],
  },
];

export const FEATURED_COMPARE_ITEM_IDS = [
  "semiconductor-bonus",
  "youth-savings-comparison",
  "youth-savings-maturity",
  "jeonse-vs-wolse",
  "savings-vs-etf",
  "new-employee-salary",
];

export const COMPARE_ITEMS: CompareItem[] = [
  {
    id: "semiconductor-bonus",
    title: "반도체 성과급 비교 계산기",
    description: "삼성전자, SK하이닉스, DB하이텍 등 반도체 기업 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/semiconductor-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["연봉", "성과급률", "세후 추정"],
    badges: [{ label: "인기", tone: "popular" }, { label: "계산기", tone: "default" }],
    stats: [{ label: "비교 회사", value: "8개" }, { label: "핵심 결과", value: "세후 추정" }],
    ctaLabel: "비교하기",
    priority: 1,
  },
  {
    id: "auto-bonus",
    title: "자동차 성과급 비교 계산기",
    description: "현대차, 기아, 현대모비스 성과급을 같은 기준으로 비교합니다.",
    href: "/tools/auto-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["연봉", "성과급률", "업종 비교"],
    badges: [{ label: "성과급", tone: "default" }],
    stats: [{ label: "업종", value: "자동차" }, { label: "비교", value: "세전·세후" }],
    ctaLabel: "계산하기",
    priority: 2,
  },
  {
    id: "shipbuilding-bonus",
    title: "조선업 성과급 비교 계산기",
    description: "HD현대중공업, 한화오션, 삼성중공업 성과급을 비교합니다.",
    href: "/tools/shipbuilding-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["업종", "성과급", "총보상"],
    badges: [{ label: "신규", tone: "new" }, { label: "계산기", tone: "default" }],
    stats: [{ label: "업종", value: "조선" }, { label: "핵심", value: "총보상" }],
    ctaLabel: "비교하기",
    priority: 3,
  },
  {
    id: "finance-bonus",
    title: "금융권 성과급 비교 계산기",
    description: "은행, 증권, 보험 성과급을 같은 연봉 기준으로 비교합니다.",
    href: "/tools/finance-bonus-comparison/",
    type: "calculator",
    categoryId: "bonus",
    criteria: ["은행", "증권", "보험"],
    badges: [{ label: "성과급", tone: "default" }],
    stats: [{ label: "업종", value: "금융" }, { label: "비교", value: "3개 축" }],
    ctaLabel: "계산하기",
    priority: 4,
  },
  {
    id: "youth-savings-comparison",
    title: "청년미래적금 vs 청년도약계좌 비교",
    description: "청년미래적금, 청년도약계좌, 청년희망적금의 조건과 수령액을 비교합니다.",
    href: "/reports/youth-savings-comparison-2026/",
    type: "report",
    categoryId: "welfare",
    criteria: ["가입조건", "정부기여금", "만기"],
    badges: [{ label: "청년지원", tone: "official" }, { label: "리포트", tone: "default" }],
    stats: [{ label: "비교", value: "정책적금" }, { label: "기준", value: "2026" }],
    ctaLabel: "리포트 보기",
    priority: 1,
  },
  {
    id: "youth-savings-maturity",
    title: "청년 적금 만기 수령액 계산기",
    description: "청년미래적금, 청년도약계좌, 일반 적금의 만기 수령액을 비교합니다.",
    href: "/tools/youth-savings-maturity-calculator/",
    type: "calculator",
    categoryId: "welfare",
    criteria: ["월 납입액", "정부기여금", "비과세"],
    badges: [{ label: "신규", tone: "new" }, { label: "계산기", tone: "default" }],
    stats: [{ label: "비교 상품", value: "3종" }, { label: "결과", value: "만기 수령액" }],
    ctaLabel: "계산하기",
    priority: 2,
  },
  {
    id: "welfare-benefit",
    title: "복지급여 수급 자격 계산기",
    description: "가구소득과 상황별 조건으로 복지급여 가능성을 점검합니다.",
    href: "/tools/welfare-benefit-eligibility/",
    type: "calculator",
    categoryId: "welfare",
    criteria: ["가구소득", "지원 가능성", "기준 중위소득"],
    badges: [{ label: "지원금", tone: "official" }],
    stats: [{ label: "비교 기준", value: "가구소득" }, { label: "결과", value: "가능성" }],
    ctaLabel: "확인하기",
    priority: 3,
  },
  {
    id: "birth-support-total",
    title: "출산~2세 지원금 계산기",
    description: "출산 직후부터 2세까지 받을 수 있는 지원금을 합산합니다.",
    href: "/tools/birth-support-total/",
    type: "calculator",
    categoryId: "welfare",
    criteria: ["출산지원", "아동수당", "부모급여"],
    badges: [{ label: "출산", tone: "official" }],
    stats: [{ label: "기간", value: "0~2세" }, { label: "결과", value: "총지원금" }],
    ctaLabel: "계산하기",
    priority: 4,
  },
  {
    id: "jeonse-vs-wolse",
    title: "전세 vs 월세 손익 계산기",
    description: "전세대출 이자, 월세, 보증금 기회비용을 같은 비용 기준으로 비교합니다.",
    href: "/tools/jeonse-vs-wolse-calculator/",
    type: "calculator",
    categoryId: "realEstate",
    criteria: ["대출이자", "월세", "기회비용"],
    badges: [{ label: "부동산", tone: "default" }],
    stats: [{ label: "비교", value: "전세·월세" }, { label: "결과", value: "손익 차이" }],
    ctaLabel: "계산하기",
    priority: 1,
  },
  {
    id: "loan-refinancing",
    title: "대출 갈아타기 계산기",
    description: "중도상환수수료와 금리 차이를 반영해 대출 갈아타기 손익을 비교합니다.",
    href: "/tools/loan-refinancing-calculator/",
    type: "calculator",
    categoryId: "realEstate",
    criteria: ["금리", "중도상환수수료", "월 상환액"],
    badges: [{ label: "대출", tone: "default" }],
    stats: [{ label: "핵심", value: "손익분기" }, { label: "비교", value: "기존·신규" }],
    ctaLabel: "계산하기",
    priority: 2,
  },
  {
    id: "home-purchase-fund",
    title: "집 마련 자금 계산기",
    description: "매매가, 대출, 초기비용을 기준으로 필요한 자기자본을 계산합니다.",
    href: "/tools/home-purchase-fund/",
    type: "calculator",
    categoryId: "realEstate",
    criteria: ["초기자금", "대출", "취득비용"],
    badges: [{ label: "내집마련", tone: "default" }],
    stats: [{ label: "결과", value: "필요 자금" }, { label: "기준", value: "매매가" }],
    ctaLabel: "계산하기",
    priority: 3,
  },
  {
    id: "apt-cheonyak",
    title: "아파트 청약 가점 계산기",
    description: "무주택기간, 부양가족, 청약통장 가입기간으로 청약 가점을 계산합니다.",
    href: "/tools/apt-cheonyak-gajum-calculator/",
    type: "calculator",
    categoryId: "realEstate",
    criteria: ["무주택기간", "부양가족", "청약통장"],
    badges: [{ label: "청약", tone: "default" }],
    stats: [{ label: "만점", value: "84점" }, { label: "결과", value: "가점" }],
    ctaLabel: "계산하기",
    priority: 4,
  },
  {
    id: "savings-vs-etf",
    title: "월 적금 vs ETF 노후 계산기",
    description: "월 적금과 ETF를 은퇴 시점 자산, 실질 구매력, 생활비 커버 기간으로 비교합니다.",
    href: "/tools/savings-vs-etf-retirement/",
    type: "calculator",
    categoryId: "investment",
    criteria: ["적금", "ETF", "투자기간"],
    badges: [{ label: "시뮬레이션", tone: "estimate" }],
    stats: [{ label: "비교", value: "적금 vs ETF" }, { label: "결과", value: "고갈 시점" }],
    ctaLabel: "비교하기",
    priority: 1,
  },
  {
    id: "stock-fee",
    title: "증권사 수수료 비교 리포트",
    description: "국내외 주식 거래 수수료와 장기 투자 비용 차이를 정리합니다.",
    href: "/reports/stock-brokerage-fee-comparison-2026/",
    type: "report",
    categoryId: "investment",
    criteria: ["수수료", "거래세", "장기 비용"],
    badges: [{ label: "리포트", tone: "default" }],
    stats: [{ label: "기준", value: "2026" }, { label: "비교", value: "증권사" }],
    ctaLabel: "리포트 보기",
    priority: 2,
  },
  {
    id: "monthly-dividend-etf",
    title: "월배당 ETF 비교 리포트",
    description: "월배당 ETF의 분배금, 세금, 투자 유의점을 비교합니다.",
    href: "/reports/monthly-dividend-etf-2026/",
    type: "report",
    categoryId: "investment",
    criteria: ["분배금", "세금", "변동성"],
    badges: [{ label: "배당", tone: "default" }],
    stats: [{ label: "주제", value: "월배당" }, { label: "기준", value: "ETF" }],
    ctaLabel: "리포트 보기",
    priority: 3,
  },
  {
    id: "dca-investment",
    title: "적립식 투자 수익 비교",
    description: "매달 같은 금액을 투자했을 때 평균 매수가와 수익률을 계산합니다.",
    href: "/tools/dca-investment-calculator/",
    type: "calculator",
    categoryId: "investment",
    criteria: ["적립식", "수익률", "기간"],
    badges: [{ label: "계산기", tone: "default" }],
    stats: [{ label: "핵심", value: "평균 매수가" }, { label: "방식", value: "DCA" }],
    ctaLabel: "계산하기",
    priority: 4,
  },
  {
    id: "new-employee-salary",
    title: "2026 신입사원 초봉 비교",
    description: "국내 주요 기업 신입 초봉과 총보상 구조를 비교합니다.",
    href: "/reports/new-employee-salary-2026/",
    type: "report",
    categoryId: "salary",
    criteria: ["초봉", "성과급", "복지"],
    badges: [{ label: "연봉", tone: "default" }],
    stats: [{ label: "비교", value: "기업" }, { label: "기준", value: "2026" }],
    ctaLabel: "리포트 보기",
    priority: 1,
  },
  {
    id: "it-salary-top10",
    title: "IT 업계 신입 초봉 TOP 10",
    description: "IT 기업 신입 초봉과 복지, 성장성을 비교합니다.",
    href: "/reports/it-salary-top10/",
    type: "report",
    categoryId: "salary",
    criteria: ["IT", "초봉", "TOP10"],
    badges: [{ label: "랭킹", tone: "popular" }],
    stats: [{ label: "순위", value: "TOP10" }, { label: "분야", value: "IT" }],
    ctaLabel: "리포트 보기",
    priority: 2,
  },
  {
    id: "it-si-sm",
    title: "IT SI·SM 대기업 연봉·성과급",
    description: "IT 서비스 기업의 연봉, 성과급, 총보상 구조를 비교합니다.",
    href: "/reports/it-si-sm-salary-comparison-2026/",
    type: "report",
    categoryId: "salary",
    criteria: ["IT서비스", "연봉", "성과급"],
    badges: [{ label: "신규", tone: "new" }],
    stats: [{ label: "업종", value: "SI·SM" }, { label: "기준", value: "총보상" }],
    ctaLabel: "리포트 보기",
    priority: 3,
  },
  {
    id: "insurance-salary",
    title: "보험사 연봉·성과급 비교",
    description: "국내 주요 보험사의 연봉과 성과급 구조를 비교합니다.",
    href: "/reports/insurance-salary-bonus-comparison-2026/",
    type: "report",
    categoryId: "salary",
    criteria: ["보험", "연봉", "성과급"],
    badges: [{ label: "금융", tone: "default" }],
    stats: [{ label: "업종", value: "보험" }, { label: "비교", value: "연봉·성과급" }],
    ctaLabel: "리포트 보기",
    priority: 4,
  },
];

export const COMPARE_PRINCIPLES: ComparePrinciple[] = [
  {
    categoryId: "bonus",
    title: "성과급 비교 기준",
    criteria: ["연봉", "월급", "성과급률", "세후 추정", "지급 안정성"],
    caution: "성과급은 회사 공지, 사업부, 개인 평가, 지급월에 따라 달라질 수 있습니다.",
  },
  {
    categoryId: "welfare",
    title: "지원금 비교 기준",
    criteria: ["가입 대상", "소득 기준", "지원금", "신청기간", "중복 가능성"],
    caution: "지원금은 신청 시점의 공식 공고와 개인별 심사 결과가 우선합니다.",
  },
  {
    categoryId: "realEstate",
    title: "부동산·대출 비교 기준",
    criteria: ["초기자금", "월 부담", "세금", "대출금리", "거주기간"],
    caution: "금리, 세금, 매매·전월세 가격은 시점과 계약 조건에 따라 달라질 수 있습니다.",
  },
  {
    categoryId: "investment",
    title: "투자·ETF 비교 기준",
    criteria: ["수익률", "세금", "수수료", "변동성", "투자기간"],
    caution: "투자 결과는 보장되지 않으며, 계산 결과는 입력값 기반 추정입니다.",
  },
  {
    categoryId: "salary",
    title: "연봉·초봉 비교 기준",
    criteria: ["초봉", "평균연봉", "성과급", "복지", "성장성"],
    caution: "연봉은 계약 형태, 직군, 지역, 성과급 포함 여부에 따라 달라질 수 있습니다.",
  },
];

export const PLANNED_COMPARE_ITEMS: PlannedCompareItem[] = [
  {
    title: "대기업 복지포인트 비교",
    description: "성과급 이후 복리후생까지 비교하는 확장 콘텐츠",
    reason: "성과급 유입 이후 복지 검색 확장",
    categoryId: "bonus",
  },
  {
    title: "청년 주거지원 대출 비교",
    description: "청년 전월세 대출과 주거지원 정책 비교",
    reason: "지원금과 부동산 교차 수요",
    categoryId: "welfare",
  },
  {
    title: "월배당 ETF 비교표",
    description: "국내·해외 월배당 ETF 수익률과 분배금 비교",
    reason: "투자 카테고리 확장",
    categoryId: "investment",
  },
];

export const COMPARE_FAQ = [
  {
    question: "비교표와 계산기는 무엇이 다른가요?",
    answer: "비교표는 여러 선택지를 같은 기준으로 먼저 비교하는 페이지이고, 계산기는 사용자의 입력값을 기준으로 구체적인 결과를 추정하는 도구입니다.",
  },
  {
    question: "비교표의 금액은 확정값인가요?",
    answer: "아닙니다. 공식자료, 공시자료, 계산 모델을 바탕으로 정리한 참고값이며 실제 조건은 회사 공지, 정부 공고, 금융회사 상품설명서가 우선합니다.",
  },
  {
    question: "성과급과 지원금 비교표는 언제 분리되나요?",
    answer: "1차로 비교표 허브를 만든 뒤, 성과급과 지원금 섹션의 사용량을 보고 /compare/bonus/, /compare/welfare/ 하위 페이지로 확장합니다.",
  },
];

export const COMPARE_SEO_INTRO = [
  "비교표는 계산기와 리포트 사이에서 여러 선택지를 빠르게 비교하는 허브입니다. 연봉, 성과급, 지원금, 부동산, 투자처럼 선택지가 많은 주제를 같은 기준으로 묶어 보여줍니다.",
  "각 비교표 카드는 계산기, 리포트, 준비 중 콘텐츠를 구분해 표시합니다. 먼저 큰 차이를 확인한 뒤 필요한 계산기나 상세 리포트로 이동하는 흐름을 목표로 합니다.",
  "비교 결과는 공개자료와 계산 모델을 바탕으로 정리한 참고 정보입니다. 실제 금액, 조건, 신청 가능 여부는 회사 공지, 정부 공고, 금융회사 상품설명서, 계약 조건을 확인해야 합니다.",
];

export const COMPARE_SEO_CRITERIA = [
  "성과급 비교는 연봉, 성과급률, 세후 추정, 지급 구조를 중심으로 봅니다.",
  "지원금 비교는 가입 대상, 소득 기준, 지원금, 신청기간, 중복 가능성을 중심으로 봅니다.",
  "부동산·대출 비교는 초기자금, 월 부담, 금리, 세금, 거주기간을 중심으로 봅니다.",
  "투자·ETF 비교는 수익률, 세금, 수수료, 변동성, 투자기간을 함께 봅니다.",
];
