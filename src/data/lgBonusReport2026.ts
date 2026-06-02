// LG전자 성과급 2026 리포트 전용 데이터

export const LG_BONUS_REPORT_META = {
  slug: "lg-bonus-2026",
  title: "LG전자 성과급 2026 — H&A·HE·VS·BS 사업부별 PI 비교",
  description:
    "2026년 LG전자 성과급(PI) 사업부별 추정 지급률, 직급별 예상 수령액, 삼성전자·SK하이닉스·현대차와 총보상 비교까지 한눈에 정리합니다.",
  dateModified: "2026-06-01",
  updatedAt: "2026년 6월",
  caution:
    "이 페이지의 PI 지급률·금액은 공식 확정값이 아닌 추정 시나리오입니다. 실제 지급액은 회사 확정안·개인 기준급·재직 조건에 따라 달라집니다.",
} as const;

export interface LgDivisionReportRow {
  code: string;
  name: string;
  product: string;
  piH1: { conservative: number; base: number; aggressive: number };
  piH2: { conservative: number; base: number; aggressive: number };
  trend: string;
  highlight: string;
  badge: "추정" | "시뮬레이션";
}

export const LG_DIVISION_ROWS: LgDivisionReportRow[] = [
  {
    code: "HA",
    name: "H&A",
    product: "냉장고·세탁기·에어컨",
    piH1: { conservative: 50, base: 100, aggressive: 150 },
    piH2: { conservative: 50, base: 100, aggressive: 150 },
    trend: "프리미엄 가전 실적 양호, PI 비교적 안정적",
    highlight: "사업부 중 가장 안정적인 PI 지급 이력",
    badge: "추정",
  },
  {
    code: "HE",
    name: "HE",
    product: "TV·모니터·사이니지",
    piH1: { conservative: 0, base: 50, aggressive: 100 },
    piH2: { conservative: 50, base: 100, aggressive: 150 },
    trend: "TV 시장 수요 둔화, 연도별 변동 폭 큼",
    highlight: "상반기보다 하반기 지급률이 높은 구조",
    badge: "추정",
  },
  {
    code: "VS",
    name: "VS",
    product: "전기차 부품·인포테인먼트",
    piH1: { conservative: 0, base: 50, aggressive: 100 },
    piH2: { conservative: 0, base: 50, aggressive: 100 },
    trend: "흑자 전환 과도기, PI 불확실성 높음",
    highlight: "성장 사업부이나 수익성 안착 여부 관건",
    badge: "추정",
  },
  {
    code: "BS",
    name: "BS",
    product: "B2B·상업용 디스플레이",
    piH1: { conservative: 50, base: 75, aggressive: 125 },
    piH2: { conservative: 50, base: 100, aggressive: 150 },
    trend: "B2B 사업 안정적, PI 중간 수준 꾸준",
    highlight: "안정적 수주 기반으로 변동 폭 작음",
    badge: "추정",
  },
];

export interface LgRankRow {
  rank: string;
  monthlyBase: number;
  annualSalary: number;
  piH1Base: number;
  piH2Base: number;
  piAnnualBase: number;
  totalCompBase: number;
}

// H&A 기준 시나리오 (PI 100%+100% 가정)
export const LG_RANK_ROWS: LgRankRow[] = [
  {
    rank: "사원",
    monthlyBase: 3_200_000,
    annualSalary: 55_000_000,
    piH1Base: 3_200_000,
    piH2Base: 3_200_000,
    piAnnualBase: 6_400_000,
    totalCompBase: 61_400_000,
  },
  {
    rank: "대리",
    monthlyBase: 4_000_000,
    annualSalary: 70_000_000,
    piH1Base: 4_000_000,
    piH2Base: 4_000_000,
    piAnnualBase: 8_000_000,
    totalCompBase: 78_000_000,
  },
  {
    rank: "과장",
    monthlyBase: 4_900_000,
    annualSalary: 85_000_000,
    piH1Base: 4_900_000,
    piH2Base: 4_900_000,
    piAnnualBase: 9_800_000,
    totalCompBase: 94_800_000,
  },
  {
    rank: "차장",
    monthlyBase: 5_900_000,
    annualSalary: 100_000_000,
    piH1Base: 5_900_000,
    piH2Base: 5_900_000,
    piAnnualBase: 11_800_000,
    totalCompBase: 111_800_000,
  },
  {
    rank: "부장",
    monthlyBase: 7_000_000,
    annualSalary: 120_000_000,
    piH1Base: 7_000_000,
    piH2Base: 7_000_000,
    piAnnualBase: 14_000_000,
    totalCompBase: 134_000_000,
  },
];

export interface LgCompanyCompareRow {
  company: string;
  bonusLabel: string;
  salaryCriteria: string;
  piMultiple: string;
  annualBonus: string;
  note: string;
  href: string;
  highlight: boolean;
}

export const LG_COMPANY_COMPARE: LgCompanyCompareRow[] = [
  {
    company: "LG전자",
    bonusLabel: "PI (상·하반기)",
    salaryCriteria: "기본급",
    piMultiple: "연 200%",
    annualBonus: "약 640~800만",
    note: "H&A 기준 추정, 사업부별 상이",
    href: "/tools/lg-bonus/",
    highlight: true,
  },
  {
    company: "삼성전자 DS",
    bonusLabel: "OPI + TAI",
    salaryCriteria: "연봉",
    piMultiple: "연 50%+",
    annualBonus: "약 2,500~4,000만",
    note: "DS부문 반도체 초호황 기준",
    href: "/tools/samsung-bonus/",
    highlight: false,
  },
  {
    company: "SK하이닉스",
    bonusLabel: "PS + PI",
    salaryCriteria: "기본급",
    piMultiple: "PS 2,900%+",
    annualBonus: "약 6,000만~1억",
    note: "2025년 역대급 실적 기준",
    href: "/tools/sk-hynix-bonus/",
    highlight: false,
  },
  {
    company: "현대자동차",
    bonusLabel: "성과급 + 격려금",
    salaryCriteria: "기본급",
    piMultiple: "연 3.3배",
    annualBonus: "약 1,000~1,500만",
    note: "2025년 임단협 기준 추정",
    href: "/tools/hyundai-bonus/",
    highlight: false,
  },
];

export const LG_BONUS_STRUCTURE = [
  {
    title: "PI (Performance Incentive)",
    body: "반기별(상반기 7월, 하반기 1월) 지급하는 성과급입니다. 사업부 영업이익 달성률에 따라 기본급 대비 지급률이 결정됩니다. 같은 직급이라도 소속 사업부에 따라 지급률이 크게 다릅니다.",
  },
  {
    title: "LG전자 vs 삼성·하이닉스 차이",
    body: "LG전자 PI는 기본급 기준 연 100~300% 수준으로, 반도체 기업(SK하이닉스 PS 2,900%+)과 직접 비교하기 어렵습니다. 다만 연봉 기본 수준이 높고, 복지·워라밸 등 비금전 보상을 합산한 총보상 기준으로 비교해야 합니다.",
  },
  {
    title: "세후 실수령 계산법",
    body: "PI는 근로소득으로 원천징수됩니다. 기타소득 분리과세(20%)가 아닌 종합소득세 합산 과세 방식이므로, 연봉이 높을수록 세율이 높아집니다. 세후 실수령은 성과급 세후 계산기에서 직접 확인하세요.",
  },
];

export const LG_BONUS_FAQ = [
  {
    question: "LG전자 성과급 PI는 언제 지급되나요?",
    answer:
      "PI는 반기별로 지급됩니다. 상반기(1~6월) 실적 기준은 보통 7~8월, 하반기(7~12월) 실적 기준은 이듬해 1~2월에 지급됩니다. 정확한 지급 일정은 매년 회사 공지를 통해 확인해야 합니다.",
  },
  {
    question: "LG전자 사업부마다 성과급이 다른 이유는 무엇인가요?",
    answer:
      "PI는 각 사업부의 영업이익 달성률에 연동됩니다. H&A(가전)는 프리미엄 제품 판매 호조로 안정적인 편이고, VS(전기차 부품)는 흑자 전환 과도기로 변동이 큽니다. HE(TV)는 글로벌 TV 수요에 따라 연도별 편차가 있습니다.",
  },
  {
    question: "LG전자 성과급 PI 100%는 얼마인가요?",
    answer:
      "PI 100%는 본인의 월 기본급 1개월 치를 의미합니다. 예를 들어 기본급이 월 400만 원인 대리라면 PI 100% = 400만 원입니다. 상·하반기 각 100%씩 받으면 연간 800만 원입니다.",
  },
  {
    question: "LG전자와 삼성전자 성과급 중 어느 쪽이 더 많나요?",
    answer:
      "삼성전자 DS부문은 반도체 초호황 시 OPI+TAI 합산으로 수천만 원 이상 받는 경우가 있어, 금액 기준으로는 삼성 DS·SK하이닉스가 압도적으로 높습니다. 다만 LG전자는 가전·B2B 사업 중심으로 연봉 기본값 자체가 높고 PI 변동성이 낮아 총보상 예측 가능성이 높은 편입니다.",
  },
  {
    question: "LG전자 성과급 세후 실수령액은 어떻게 계산하나요?",
    answer:
      "PI는 근로소득으로 합산 과세됩니다. 연봉 구간에 따라 세율이 달라지므로, 정확한 계산을 위해서는 성과급 세후 계산기에 기본급과 PI 금액을 입력해 확인하는 것이 정확합니다.",
  },
];

export const LG_BONUS_RELATED = [
  { href: "/tools/lg-bonus/", label: "LG전자 성과급 계산기", desc: "사업부별 PI 세전·세후 직접 계산" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기", desc: "세후 실수령액 즉시 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", desc: "삼성·SK하이닉스·현대차 비교" },
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", desc: "주요 기업 한눈에 비교" },
];

export const formatManwon = (n: number) => `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
export const formatOkman = (n: number) => {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억 원`;
  return formatManwon(n);
};
