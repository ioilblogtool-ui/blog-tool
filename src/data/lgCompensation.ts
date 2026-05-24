export type LgDivisionCode = "HA" | "HE" | "VS" | "BS";
export type LgRankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type LgScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";

export interface LgDivisionConfig {
  code: LgDivisionCode;
  label: string;
  fullName: string;
  description: string;
  piRangeH1: { min: number; max: number };
  piRangeH2: { min: number; max: number };
  baseScenario: Record<LgScenarioCode, { h1: number; h2: number }>;
  trend: string;
  badge: "추정" | "시뮬레이션";
}

export interface LgRankPreset {
  code: LgRankCode;
  label: string;
  defaultMonthlyBase: number;
  defaultAnnualSalary: number;
}

export interface LgComparisonItem {
  code: string;
  label: string;
  href: string;
  monthlyMultiplier: number;
  note: string;
  color: string;
}

export interface LgRelatedLink {
  href: string;
  label: string;
  desc: string;
}

export interface LgAffiliateProduct {
  url: string;
  tag: string;
  title: string;
  desc: string;
}

export const lgDivisions: LgDivisionConfig[] = [
  {
    code: "HA",
    label: "H&A",
    fullName: "Home Appliance & Air Solution",
    description: "냉장고·세탁기·에어컨",
    piRangeH1: { min: 50, max: 150 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 50,  h2: 50  },
      BASE:         { h1: 100, h2: 100 },
      AGGRESSIVE:   { h1: 150, h2: 150 },
    },
    trend: "프리미엄 가전 실적 양호, PI 비교적 안정적",
    badge: "추정",
  },
  {
    code: "HE",
    label: "HE",
    fullName: "Home Entertainment",
    description: "TV·모니터·사이니지",
    piRangeH1: { min: 0, max: 100 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 0,  h2: 50  },
      BASE:         { h1: 50, h2: 100 },
      AGGRESSIVE:   { h1: 100, h2: 150 },
    },
    trend: "TV 시장 수요 둔화, 연도별 변동 폭 큼",
    badge: "추정",
  },
  {
    code: "VS",
    label: "VS",
    fullName: "Vehicle component Solutions",
    description: "전기차 부품·인포테인먼트",
    piRangeH1: { min: 0, max: 100 },
    piRangeH2: { min: 0, max: 100 },
    baseScenario: {
      CONSERVATIVE: { h1: 0,  h2: 0  },
      BASE:         { h1: 50, h2: 50 },
      AGGRESSIVE:   { h1: 100, h2: 100 },
    },
    trend: "흑자 전환 과도기, PI 불확실",
    badge: "추정",
  },
  {
    code: "BS",
    label: "BS",
    fullName: "Business Solutions",
    description: "B2B·상업용 디스플레이",
    piRangeH1: { min: 50, max: 125 },
    piRangeH2: { min: 50, max: 150 },
    baseScenario: {
      CONSERVATIVE: { h1: 50, h2: 50  },
      BASE:         { h1: 75, h2: 100 },
      AGGRESSIVE:   { h1: 125, h2: 150 },
    },
    trend: "B2B 사업 안정적, PI 중간 수준 꾸준",
    badge: "추정",
  },
];

export const lgRankPresets: LgRankPreset[] = [
  { code: "STAFF",             label: "사원", defaultMonthlyBase: 3200000,  defaultAnnualSalary: 55000000  },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultMonthlyBase: 4000000,  defaultAnnualSalary: 70000000  },
  { code: "MANAGER",           label: "과장", defaultMonthlyBase: 4900000,  defaultAnnualSalary: 85000000  },
  { code: "DEPUTY_GM",         label: "차장", defaultMonthlyBase: 5900000,  defaultAnnualSalary: 100000000 },
  { code: "GM",                label: "부장", defaultMonthlyBase: 7000000,  defaultAnnualSalary: 120000000 },
];

export const lgScenarioOptions: Array<{ code: LgScenarioCode; label: string }> = [
  { code: "CONSERVATIVE", label: "보수적" },
  { code: "BASE",         label: "기준"   },
  { code: "AGGRESSIVE",   label: "낙관적" },
];

// 동일 월 기본급 기준 연간 성과급 배율 (추정, 시뮬레이션)
export const lgComparisonItems: LgComparisonItem[] = [
  {
    code: "SAMSUNG_DS",
    label: "삼성전자 DS",
    href: "/tools/samsung-bonus/",
    monthlyMultiplier: 7.14,
    note: "OPI 47%+TAI 추정 기준",
    color: "#1E429F",
  },
  {
    code: "SK_HYNIX",
    label: "SK하이닉스",
    href: "/tools/sk-hynix-bonus/",
    monthlyMultiplier: 18.68,
    note: "PS 2,964%+PI 기준",
    color: "#0F6E56",
  },
  {
    code: "HYUNDAI",
    label: "현대자동차",
    href: "/tools/hyundai-bonus/",
    monthlyMultiplier: 3.3,
    note: "성과급 3.3배 추정 기준",
    color: "#B45309",
  },
];

export const LG_NEXT_CALCULATOR: LgRelatedLink = {
  href: "/tools/bonus-after-tax-calculator/",
  label: "성과급 세후 실수령",
  desc: "LG전자 PI 세전 금액을 넣으면 세후 실수령액을 바로 계산합니다.",
};

export const LG_RELATED_CALCULATORS: LgRelatedLink[] = [
  { href: "/tools/bonus-simulator/",                   label: "대기업 성과급 시뮬레이터",  desc: "삼성·SK하이닉스·현대차 4개사 비교" },
  { href: "/tools/samsung-bonus/",                     label: "삼성전자 성과급 계산기",     desc: "OPI·TAI·잠정합의안 계산" },
  { href: "/tools/sk-hynix-bonus/",                    label: "SK하이닉스 성과급 계산기",   desc: "PS·PI 실수령 계산" },
  { href: "/tools/hyundai-bonus/",                     label: "현대차 성과급 계산기",       desc: "임단협 패키지 계산" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 비교",    desc: "리포트 보기" },
];

export const LG_EXTERNAL_REFERENCE_LINKS = [
  {
    url: "https://dart.fss.or.kr/",
    title: "금융감독원 전자공시시스템 (DART)",
    desc: "LG전자 사업보고서·분기보고서에서 사업부별 영업이익을 확인할 수 있습니다.",
  },
  {
    url: "https://www.nts.go.kr/",
    title: "국세청 홈택스",
    desc: "근로소득세 원천징수 안내를 통해 세후 금액 추정의 기준을 확인하세요.",
  },
];

export const LG_AFFILIATE_PRODUCTS: LgAffiliateProduct[] = [
  {
    tag: "재테크",
    title: "세이노의 가르침",
    desc: "성과급을 자산으로 키우는 전략을 다루는 국내 대표 재테크 베스트셀러",
    url: "https://link.coupang.com/a/efD3Lx",
  },
  {
    tag: "커리어",
    title: "퇴사 준비생의 도쿄 / 커리어 가이드",
    desc: "대기업 커리어 전략과 이직·연봉 협상을 정리한 직장인 필독 커리어 도서",
    url: "https://link.coupang.com/a/efD7x0",
  },
  {
    tag: "투자 입문",
    title: "존 리의 금융문맹 탈출",
    desc: "연봉·성과급을 어떻게 운용할지 고민하는 직장인에게 추천하는 투자 입문서",
    url: "https://link.coupang.com/a/efD6PQ",
  },
];
