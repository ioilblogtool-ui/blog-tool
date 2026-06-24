// 우리 회사 성과급 체력 점수 계산기 데이터
// 설계 문서: docs/design/202606/company-bonus-capacity-score-calculator-design.md
//
// 회사별 매출·영업이익은 2026년 1~2월 발표된 2025년 연간 실적(공시·IR 보도자료)
// 기준 실제 수치다(출처는 각 항목 dataNote 참고). 직원 수와 전년도 성과급률은
// 공개 자료에서 명확히 확인되지 않는 경우가 많아 일반적으로 알려진 수치를
// 참고한 근사값이며, dataConfidence로 신뢰도를 구분한다.
// - "공개자료": 매출·영업이익이 2025년 연간 실적 발표 기준 실제 수치
// - "컨센서스"/"추정": 직원 수, 전년도 성과급률 등 일부 항목이 근사값
//
// 영업이익률·직원 1인당 영업이익 점수는 업종 평균 대비 상대값으로 계산한다
// (절대 기준으로 채점하면 금융·플랫폼업은 항상 고득점, 조선·방산은 항상
// 저득점이 되는 업종 왜곡이 발생하기 때문 — 기획 문서 18-1-1 참고).
//
// 금융업(은행·보험·증권)은 수익 구조가 매출/영업이익 체계와 달라(이자이익·
// 비이자이익·순이익 중심) 이 계산기의 프리셋에서는 제외했다. 직접 입력 모드에서
// 업종 "금융"을 선택해 자체 추정값으로 계산할 수 있다.

export type BonusIndustry =
  | "semiconductor"
  | "auto"
  | "defense"
  | "shipbuilding"
  | "power-equipment"
  | "battery"
  | "chemical"
  | "it-platform"
  | "finance"
  | "telecom"
  | "steel-materials"
  | "custom";

export type BusinessOutlook = "strong-up" | "up" | "flat" | "down" | "weak";
export type DataConfidence = "공개자료" | "컨센서스" | "추정";
export type BonusRateBasis = "base" | "monthly" | "annual";

export interface CompanyBonusPreset {
  id: string;
  name: string;
  industry: BonusIndustry;
  revenueEok: number;
  operatingProfitEok: number;
  previousOperatingProfitEok: number;
  employeeCount: number;
  previousBonusRate: number;
  bonusRateBasis: BonusRateBasis;
  baseSalaryRatio: number;
  outlook: BusinessOutlook;
  dataConfidence: DataConfidence;
  dataAsOf: string;
  dataNote: string;
}

export interface BonusIndustryDefault {
  industry: BonusIndustry;
  label: string;
  defaultBonusRate: number;
  defaultOutlook: BusinessOutlook;
  description: string;
  averageOperatingMargin: number;
  averageProfitPerEmployeeEok: number;
}

export interface BonusScoreBreakdown {
  profitGrowth: number;
  margin: number;
  profitPerEmployee: number;
  previousBonus: number;
  outlook: number;
  total: number;
}

export interface BonusCalculationInput {
  companyName: string;
  industry: BonusIndustry;
  revenueEok: number;
  operatingProfitEok: number;
  previousOperatingProfitEok: number;
  employeeCount: number;
  previousBonusRate: number;
  annualSalaryManwon: number;
  baseSalaryRatio: number;
  outlook: BusinessOutlook;
}

export interface BonusCalculationResult {
  score: number;
  scoreLabel: string;
  scoreMessage: string;
  expectedBonusRate: number;
  grossBonusManwon: number;
  netBonusManwon: number;
  monthlyEquivalentManwon: number;
  operatingMargin: number;
  operatingProfitGrowthRate: number;
  operatingProfitPerEmployeeEok: number;
  marginVsIndustry: number;
  profitPerEmployeeVsIndustry: number;
  breakdown: BonusScoreBreakdown;
  warnings: string[];
  insights: string[];
  invalid: boolean;
}

export interface BonusFaq {
  question: string;
  answer: string;
}

export const CBC_META = {
  slug: "company-bonus-capacity-score-calculator",
  title: "우리 회사 성과급 체력 점수 계산기",
  seoTitle: "2026 우리 회사 성과급 체력 점수 계산기｜영업이익·이익률·직원 1인당 이익 비교",
  seoDescription:
    "회사의 매출, 영업이익, 영업이익률, 직원 수, 전년 성과급률을 입력하면 올해 성과급 체력 점수와 예상 성과급 기대 구간을 계산합니다. 삼성전자, SK하이닉스, 현대차 등 주요 회사 프리셋을 제공합니다.",
  updatedAt: "2026-06-23",
  dataNote:
    "이 계산기의 회사 프리셋 수치는 공개 자료를 참고한 추정 예시이며, 실제 최신 실적과 다를 수 있습니다. 영업이익률과 직원 1인당 영업이익은 업종 평균 대비 상대값으로 점수를 매겨, 업종 간 구조적 차이로 인한 왜곡을 줄였습니다.",
};

export const CBC_INDUSTRY_DEFAULTS: BonusIndustryDefault[] = [
  { industry: "semiconductor", label: "반도체", defaultBonusRate: 30, defaultOutlook: "up", description: "사이클 민감, 이익률 변동 큼", averageOperatingMargin: 15, averageProfitPerEmployeeEok: 2 },
  { industry: "auto", label: "자동차", defaultBonusRate: 25, defaultOutlook: "flat", description: "안정적 현금흐름, 노조 영향 큼", averageOperatingMargin: 8, averageProfitPerEmployeeEok: 1.5 },
  { industry: "defense", label: "방산", defaultBonusRate: 20, defaultOutlook: "up", description: "수주잔고와 수출 계약 영향", averageOperatingMargin: 8, averageProfitPerEmployeeEok: 0.8 },
  { industry: "shipbuilding", label: "조선", defaultBonusRate: 15, defaultOutlook: "up", description: "수주 사이클과 환율 영향", averageOperatingMargin: 6, averageProfitPerEmployeeEok: 0.5 },
  { industry: "power-equipment", label: "전력기기", defaultBonusRate: 20, defaultOutlook: "up", description: "전력망 투자와 수출 영향", averageOperatingMargin: 10, averageProfitPerEmployeeEok: 1 },
  { industry: "battery", label: "배터리", defaultBonusRate: 10, defaultOutlook: "down", description: "투자비와 업황 변동 큼", averageOperatingMargin: 5, averageProfitPerEmployeeEok: 0.6 },
  { industry: "chemical", label: "정유·화학", defaultBonusRate: 15, defaultOutlook: "flat", description: "유가와 스프레드 영향", averageOperatingMargin: 6, averageProfitPerEmployeeEok: 1 },
  { industry: "it-platform", label: "IT·플랫폼", defaultBonusRate: 15, defaultOutlook: "flat", description: "비용 통제와 광고·커머스 영향", averageOperatingMargin: 18, averageProfitPerEmployeeEok: 3 },
  { industry: "finance", label: "금융", defaultBonusRate: 20, defaultOutlook: "flat", description: "이자이익과 규제 영향 — 업종 평균 자체가 높음", averageOperatingMargin: 25, averageProfitPerEmployeeEok: 2.5 },
  { industry: "telecom", label: "통신", defaultBonusRate: 15, defaultOutlook: "flat", description: "안정적이나 성장성 제한", averageOperatingMargin: 12, averageProfitPerEmployeeEok: 1.2 },
];

export const CBC_COMPANY_PRESETS: CompanyBonusPreset[] = [
  {
    id: "samsung-electronics", name: "삼성전자", industry: "semiconductor",
    revenueEok: 3_336_059, operatingProfitEok: 436_011, previousOperatingProfitEok: 327_300,
    employeeCount: 125_000, previousBonusRate: 47, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 333.6조·영업이익 43.6조(전년比 +33.2%, 역대 최대 매출). 성과급률은 2025년 DS부문 OPI 47%(2024년 14%→3배 증가) 기준. MX부문은 50%로 별도 지급. 직원 수는 일반적으로 알려진 근사값.",
  },
  {
    id: "sk-hynix", name: "SK하이닉스", industry: "semiconductor",
    revenueEok: 971_467, operatingProfitEok: 472_063, previousOperatingProfitEok: 236_031,
    employeeCount: 35_000, previousBonusRate: 150, bonusRateBasis: "base", baseSalaryRatio: 65,
    outlook: "strong-up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 97.1조·영업이익 47.2조로 역대 최대(전년 대비 약 2배 성장). 2025.9 노사합의로 영업이익 10%를 PS 재원으로 배분하고 상한선 폐지, 연봉 1억 기준 약 1.482억 지급 보도. 직원 수는 근사값.",
  },
  {
    id: "hyundai-motor", name: "현대차", industry: "auto",
    revenueEok: 1_862_545, operatingProfitEok: 114_679, previousOperatingProfitEok: 142_500,
    employeeCount: 75_000, previousBonusRate: 25, bonusRateBasis: "base", baseSalaryRatio: 60,
    outlook: "down", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 186.3조(역대 최대)·영업이익 11.5조로 미국 관세·인센티브 증가 영향으로 전년 대비 19.5% 감소. 성과급률은 일반적으로 알려진 근사값.",
  },
  {
    id: "kia", name: "기아", industry: "auto",
    revenueEok: 1_141_409, operatingProfitEok: 90_781, previousOperatingProfitEok: 126_671,
    employeeCount: 36_000, previousBonusRate: 25, bonusRateBasis: "base", baseSalaryRatio: 60,
    outlook: "down", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 114.1조(역대 최대)·영업이익 9.08조로 인센티브 증가·관세 영향으로 전년(12.67조) 대비 28% 감소. 성과급률은 일반적으로 알려진 근사값.",
  },
  {
    id: "hanwha-aerospace", name: "한화에어로스페이스", industry: "defense",
    revenueEok: 267_029, operatingProfitEok: 30_893, previousOperatingProfitEok: 17_320,
    employeeCount: 7_000, previousBonusRate: 13, bonusRateBasis: "base", baseSalaryRatio: 65,
    outlook: "strong-up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 매출 26.7조·영업이익 3.09조로 전년 대비 매출 137.6%·영업이익 78.4% 증가, 3년 연속 최대 실적. 2025.9 노사합의로 영업이익 달성 시 500만+생산목표 달성 시 750만원(최대 1,250만원), 연봉 1억 기준 약 12~13% 지급 보도.",
  },
  {
    id: "hd-hyundai-heavy", name: "HD현대중공업", industry: "shipbuilding",
    revenueEok: 160_000, operatingProfitEok: 20_427, previousOperatingProfitEok: 7_025,
    employeeCount: 14_000, previousBonusRate: 15, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "strong-up", dataConfidence: "컨센서스", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 영업이익 2.04조로 2024년 0.70조 대비 190.8% 증가(수주 호황 사이클). 매출은 3분기 누적 기준 전년 대비 +18.2% 보도를 토대로 한 근사값.",
  },
  {
    id: "hanwha-ocean", name: "한화오션", industry: "shipbuilding",
    revenueEok: 126_884, operatingProfitEok: 11_091, previousOperatingProfitEok: 6_000,
    employeeCount: 10_000, previousBonusRate: 10, bonusRateBasis: "base", baseSalaryRatio: 75,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표, 한화에어로스페이스 자회사 실적)",
    dataNote: "2025년 매출 12.69조·영업이익 1.11조. 전년도 성과급률은 흑자전환 초기 단계를 반영한 근사값.",
  },
  {
    id: "samsung-heavy", name: "삼성중공업", industry: "shipbuilding",
    revenueEok: 106_500, operatingProfitEok: 8_622, previousOperatingProfitEok: 5_013,
    employeeCount: 9_000, previousBonusRate: 8, bonusRateBasis: "base", baseSalaryRatio: 75,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 매출 10.65조(9년 만에 연매출 10조 회복)·영업이익 8,622억으로 전년 대비 72% 증가.",
  },
  {
    id: "hd-hyundai-electric", name: "HD현대일렉트릭", industry: "power-equipment",
    revenueEok: 40_794, operatingProfitEok: 9_953, previousOperatingProfitEok: 8_106,
    employeeCount: 3_000, previousBonusRate: 25, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "strong-up", dataConfidence: "공개자료", dataAsOf: "2025년 12월 기준 최근 실적",
    dataNote: "매출 4.08조(전년 대비 +22.79%)·영업이익 9,953억. 전력망 투자 슈퍼사이클 수혜 업종.",
  },
  {
    id: "lg-energy-solution", name: "LG에너지솔루션", industry: "battery",
    revenueEok: 236_718, operatingProfitEok: 13_461, previousOperatingProfitEok: 5_758,
    employeeCount: 25_000, previousBonusRate: 10, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 23.67조(전년 대비 -7.6%)·영업이익 1.35조(전년 대비 +133.9%, 고수익 제품·북미 ESS 생산 본격화). 매출은 줄었지만 이익은 크게 늘어난 사례.",
  },
  {
    id: "samsung-sdi", name: "삼성SDI", industry: "battery",
    revenueEok: 132_667, operatingProfitEok: -17_224, previousOperatingProfitEok: -25_000,
    employeeCount: 28_000, previousBonusRate: 0, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.2 발표)",
    dataNote: "2025년 매출 13.27조·영업손실 1.72조(적자 지속이나 4분기 적자폭은 전분기의 절반 수준으로 축소). 전년 영업손실 규모는 근사값. 전기차 수요 둔화 업종의 대표적 적자 사례.",
  },
  {
    id: "s-oil", name: "S-Oil", industry: "chemical",
    revenueEok: 342_470, operatingProfitEok: 2_882, previousOperatingProfitEok: 5_165,
    employeeCount: 3_500, previousBonusRate: 15, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "down", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "2025년 매출 34.25조(전년 대비 -6.5%, 유가 하락)·영업이익 2,882억(전년 대비 -44.2%, 석유화학 부문 적자 전환 영향).",
  },
  {
    id: "lg-chem", name: "LG화학", industry: "chemical",
    revenueEok: 459_322, operatingProfitEok: 11_809, previousOperatingProfitEok: 8_740,
    employeeCount: 18_000, previousBonusRate: 15, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "up", dataConfidence: "컨센서스", dataAsOf: "2025년 연간 실적(2026.1 발표)",
    dataNote: "연결 기준 2025년 매출 45.93조(전년 대비 -5.7%)·영업이익 1.18조(전년 대비 +35%). 연결 매출에는 자회사 LG에너지솔루션 실적이 포함되어 있어(LGES 제외 시 매출 약 23.8조), 실제 화학 부문만의 수익성과는 차이가 있을 수 있다.",
  },
  {
    id: "naver", name: "네이버", industry: "it-platform",
    revenueEok: 120_350, operatingProfitEok: 22_081, previousOperatingProfitEok: 19_790,
    employeeCount: 5_000, previousBonusRate: 15, bonusRateBasis: "annual", baseSalaryRatio: 80,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026.2 발표)",
    dataNote: "2025년 매출 12.04조(전년 대비 +12.1%)·영업이익 2.21조(전년 대비 +11.6%)로 역대 최대. 성과급 기준이 연봉 기준 보도가 많은 회사.",
  },
  {
    id: "kakao", name: "카카오", industry: "it-platform",
    revenueEok: 80_991, operatingProfitEok: 7_320, previousOperatingProfitEok: 4_946,
    employeeCount: 4_500, previousBonusRate: 10, bonusRateBasis: "annual", baseSalaryRatio: 80,
    outlook: "up", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 매출 8.10조(전년 대비 +3%)·영업이익 7,320억(전년 대비 +48%)으로 창사 이래 역대 최대 실적.",
  },
  {
    id: "sk-telecom", name: "SK텔레콤", industry: "telecom",
    revenueEok: 171_000, operatingProfitEok: 10_732, previousOperatingProfitEok: 10_000,
    employeeCount: 5_500, previousBonusRate: 17, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "flat", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 매출 17.10조·영업이익 1.073조. 통신3사 중 최상위 실적으로 평가됨. 전년도 영업이익·성과급률은 근사값.",
  },
  {
    id: "posco-holdings", name: "POSCO홀딩스", industry: "steel-materials",
    revenueEok: 691_000, operatingProfitEok: 18_000, previousOperatingProfitEok: 21_400,
    employeeCount: 28_000, previousBonusRate: 10, bonusRateBasis: "base", baseSalaryRatio: 70,
    outlook: "down", dataConfidence: "공개자료", dataAsOf: "2025년 연간 실적(2026 발표)",
    dataNote: "2025년 매출 69.1조(전년 대비 -5%)·영업이익 1.8조(전년 대비 -16%, 영업이익률 3.9→5.1%). 포스코E&C 안전사고 공사 중단, 리튬·전구체 공장 램프업 비용 영향.",
  },
];

export const CBC_FAQ: BonusFaq[] = [
  {
    question: "성과급 체력 점수는 실제 성과급 지급률과 같은가요?",
    answer:
      "아닙니다. 성과급 체력 점수는 회사가 성과급을 줄 여력이 있는지 보는 추정 지표입니다. 실제 성과급은 회사의 임금 정책, 노사 협상, 사업부별 기준, 개인 평가에 따라 달라집니다.",
  },
  {
    question: "매출이 큰 회사가 성과급도 많이 주나요?",
    answer:
      "반드시 그렇지는 않습니다. 성과급은 매출보다 영업이익, 영업이익률, 현금흐름, 전년도 지급 이력의 영향을 더 크게 받습니다. 매출이 커도 이익률이 낮으면 성과급 체력은 낮을 수 있습니다.",
  },
  {
    question: "영업이익률과 직원 1인당 영업이익은 왜 업종 평균과 비교하나요?",
    answer:
      "업종마다 사업 구조가 달라 절대 금액만으로 비교하면 왜곡이 생깁니다. 금융·플랫폼업은 구조적으로 직원당 이익이 높고, 조선·방산처럼 인력집약적 업종은 구조적으로 낮습니다. 같은 업종 평균과 비교해야 '이 회사가 업종 안에서 잘하고 있는지'를 더 정확히 볼 수 있습니다.",
  },
  {
    question: "삼성전자와 SK하이닉스는 같은 방식으로 계산해도 되나요?",
    answer:
      "큰 틀에서는 가능하지만 사업부 구조가 다릅니다. 삼성전자는 반도체 외에도 모바일, 가전, 디스플레이 등 사업부가 나뉘고, SK하이닉스는 메모리 반도체 집중도가 높습니다. 따라서 회사 전체 실적과 사업부 성과급은 다를 수 있습니다.",
  },
  {
    question: "적자 회사도 성과급이 나올 수 있나요?",
    answer:
      "가능은 합니다. 다만 적자 회사의 성과급은 실적 기반 성과급보다는 격려금, 특별 보상, 조직 유지 목적의 지급일 가능성이 큽니다. 계산기에서는 적자 회사의 성과급 기대치를 낮게 반영합니다.",
  },
  {
    question: "프리셋에 없는 회사도 계산할 수 있나요?",
    answer:
      "직접 입력 모드에서 업종, 매출, 영업이익, 전년 영업이익, 직원 수, 전년도 성과급률을 입력하면 계산할 수 있습니다. 업종을 선택해야 업종 평균 대비 상대 점수가 정확하게 계산됩니다.",
  },
  {
    question: "전년도 성과급률은 기본급 기준인가요, 연봉 기준인가요?",
    answer:
      "회사마다 보도 기준이 다릅니다. 이 계산기는 기본급 기준으로 통일해서 계산하며, 프리셋 회사의 원래 보도 기준(기본급·월급·연봉)이 다르면 안내 문구로 표시합니다. 직접 입력 시에는 기본급 비중을 조절해 환산할 수 있습니다.",
  },
];

export const CBC_RELATED_LINKS = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "2026 대기업 성과급 완전 비교" },
  { href: "/tools/samsung-bonus/", label: "삼성전자 성과급 계산기" },
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/hyundai-bonus/", label: "현대차 성과급 계산기" },
  { href: "/tools/hanwha-bonus-calculator/", label: "한화 성과급 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
];

export const CBC_SEO_INTRO = [
  "회사 실적 발표 뉴스를 보면 \"영업이익이 늘었으니 올해 성과급도 늘겠지\"라고 기대하기 쉽지만, 실제로는 매출보다 영업이익률, 직원 1인당 이익, 전년도 지급 이력이 성과급 여력을 더 정확하게 보여줍니다. 우리 회사 성과급 체력 점수 계산기는 이런 지표를 종합해 올해 성과급을 줄 체력이 있는 회사인지 0~100점으로 계산합니다.",
  "이 계산기의 핵심은 영업이익률과 직원 1인당 영업이익을 업종 평균과 비교하는 것입니다. 금융·플랫폼업은 구조적으로 직원당 이익이 높고, 조선·방산처럼 인력집약적인 업종은 구조적으로 낮기 때문에, 절대 금액만 비교하면 항상 같은 업종이 유리하거나 불리하게 나옵니다. 업종 평균 대비 상대값으로 점수를 매기면 '내 회사가 같은 업종 안에서 얼마나 잘하고 있는가'를 더 정확하게 볼 수 있습니다.",
  "삼성전자, SK하이닉스, 현대차, 한화에어로스페이스 등 주요 회사를 선택하면 매출·영업이익·직원 수가 자동으로 입력되며, 기준 연봉과 기본급 비중을 조절해 본인 상황에 맞는 예상 성과급 세전·세후 금액까지 확인할 수 있습니다. 프리셋에 없는 회사는 직접 입력 모드로 업종과 실적을 넣어 계산할 수 있습니다.",
  "다만 이 계산기의 회사별 수치는 공개 자료를 참고한 추정 예시이며, 실제 최신 실적과 다를 수 있습니다. 성과급 체력 점수는 회사가 성과급을 줄 여력이 있는지 보는 참고 지표일 뿐, 실제 지급률을 보장하는 자료가 아닙니다. 정확한 성과급은 회사의 임금 정책과 노사 협상 결과에 따라 달라집니다.",
];

export const CBC_CRITERIA = [
  "영업이익 증가율과 업황 전망은 회사 자체의 절대적인 변화를 기준으로 채점합니다.",
  "영업이익률과 직원 1인당 영업이익은 업종 평균 대비 상대값을 기준으로 채점해 업종 간 구조적 차이로 인한 왜곡을 줄였습니다.",
  "전년도 성과급률은 기본급 기준으로 통일해서 계산하며, 원래 보도 기준이 다르면 별도 안내합니다.",
  "회사별 프리셋 수치는 공개 자료를 참고한 추정 예시이며 실제 최신 실적과 다를 수 있습니다.",
];
