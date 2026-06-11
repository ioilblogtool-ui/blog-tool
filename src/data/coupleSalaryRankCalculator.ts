// coupleSalaryRankCalculator.ts
// 맞벌이 부부 가구소득 계산기 — 데이터

import { SALARY_TIER_DATA, OVERALL_AVG, CAT_LABEL, TIER_META, type TierCompany, type TierKey, type CatKey } from "./salaryTierData";
import { averageHouseholdIncome, householdSizeOptions } from "./householdIncome";

export type LivingCostScenarioCode = "SAVING" | "AVERAGE" | "COMFORTABLE";

export interface CoupleLivingCostScenario {
  code: LivingCostScenarioCode;
  label: string;
  monthlyTotal: number; // 원 단위
  description: string;
}

export interface IncomePercentileRow {
  topPct: number; // 상위 %
  annualM: number; // 가구소득 연 기준, 만원 단위
  label: string;
}

export interface PopularCombo {
  id: string;
  label: string;
  meName: string;
  spouseName: string | null; // null이면 외벌이 조합
  tagline: string;
}

export const CSR_META = {
  slug: "couple-salary-rank-calculator",
  title: "맞벌이 부부 가구소득 계산기 | 대기업 연봉으로 보는 우리집 순위 2026",
  subtitle:
    "본인과 배우자가 다니는 대기업을 고르면 합산 연봉, 가구소득 전국 순위, 생활비 차감 후 잉여자금을 바로 보여줍니다.",
  methodology:
    "인기 조합에 자주 등장하는 주요 대기업은 각 사 사업보고서(2024년 기준, DART 공시) 1인당 평균급여액을 사용하며, 그 외 기업은 연봉 티어 계산기(salary-tier)의 현직자 커뮤니티 기반 추정치를 재사용합니다. 가구소득 상위 %는 통계청 가계금융복지조사를 참고한 추정 구간입니다.",
  caution:
    "실제 가구소득, 세금, 생활비는 개인 상황에 따라 달라질 수 있는 참고용 추정입니다.",
  updatedAt: "2026년 6월 기준",
};

// 인기 조합에 등장하는 주요 기업의 DART 공시 평균연봉(2024년 기준 1인당 평균급여액, 만원)
// 출처: 각 사 2024년 사업보고서. salary-tier의 "영끌 연봉" 추정치 대신 적용.
const CSR_DART_AVG_SALARY: Record<string, number> = {
  "SK텔레콤": 16100,
  "현대자동차": 12400,
  "SK하이닉스": 11700,
  "삼성전자 DS": 12800,
  "삼성전자 DX(MX)": 12800,
  "네이버": 12900,
  "카카오": 10200,
  "KB국민은행": 11900,
  "LG에너지솔루션": 11800,
  "LG화학": 10600,
  "삼성SDS": 13400,
  "포스코": 14700,
  "포스코인터내셔널": 13700,
  "현대모비스": 12300,
  "기아": 12700,
  "LG유플러스": 10900,
  "KT": 11000,
  "삼성바이오로직스": 10700,
  "셀트리온": 10300,
  "현대건설": 10900,
  "GS건설": 9300,
};

const CSR_COMPANY_OPTIONS_RAW = SALARY_TIER_DATA.map((c) =>
  CSR_DART_AVG_SALARY[c.name] !== undefined
    ? { ...c, sal: CSR_DART_AVG_SALARY[c.name] }
    : c
);

// 2인 가구 생활비 시나리오 (참고: single-household-living-cost-2026의 1인 가구 시나리오를 2인 가구 비율로 환산한 추정값)
export const COUPLE_LIVING_COST_SCENARIOS: CoupleLivingCostScenario[] = [
  {
    code: "SAVING",
    label: "절약형",
    monthlyTotal: 2_300_000,
    description: "월세·외식·구독을 줄인 2인 가구 절약 예산입니다.",
  },
  {
    code: "AVERAGE",
    label: "평균형",
    monthlyTotal: 2_950_000,
    description: "주거비, 식비, 보험, 통신비를 포함한 2인 가구 평균 예산입니다.",
  },
  {
    code: "COMFORTABLE",
    label: "여유형",
    monthlyTotal: 3_900_000,
    description: "넓은 주거지, 외식·여가 빈도가 높은 2인 가구 여유 예산입니다.",
  },
];

// 가구소득 상위 % 추정 테이블 (통계청 가계금융복지조사 기반 참고용, 연 기준 만원, annualM 내림차순)
export const INCOME_PERCENTILE_TABLE: IncomePercentileRow[] = [
  { topPct: 1, annualM: 23000, label: "상위 1%" },
  { topPct: 5, annualM: 15000, label: "상위 5%" },
  { topPct: 10, annualM: 12000, label: "상위 10%" },
  { topPct: 20, annualM: 9500, label: "상위 20%" },
  { topPct: 30, annualM: 8200, label: "상위 30%" },
  { topPct: 40, annualM: 7200, label: "상위 40%" },
  { topPct: 50, annualM: 6300, label: "상위 50%(중위)" },
  { topPct: 60, annualM: 5500, label: "상위 60%" },
  { topPct: 70, annualM: 4700, label: "상위 70%" },
  { topPct: 80, annualM: 3900, label: "상위 80%" },
  { topPct: 90, annualM: 3000, label: "상위 90%" },
];

export const POPULAR_COMBOS: PopularCombo[] = [
  { id: "sktelecom-hyundai", label: "SK텔레콤 + 현대자동차", meName: "SK텔레콤", spouseName: "현대자동차", tagline: "통신·완성차 대표 조합" },
  { id: "skhynix-skhynix", label: "SK하이닉스 + SK하이닉스", meName: "SK하이닉스", spouseName: "SK하이닉스", tagline: "반도체 사내 커플 S티어" },
  { id: "samsungds-naver", label: "삼성전자 DS + 네이버", meName: "삼성전자 DS", spouseName: "네이버", tagline: "반도체 + IT 플랫폼" },
  { id: "hyundai-kbbank", label: "현대자동차 + KB국민은행", meName: "현대자동차", spouseName: "KB국민은행", tagline: "완성차 + 금융 안정형" },
  { id: "lges-lgchem", label: "LG에너지솔루션 + LG화학", meName: "LG에너지솔루션", spouseName: "LG화학", tagline: "배터리·화학 계열사 커플" },
  { id: "kakao-naver", label: "카카오 + 네이버", meName: "카카오", spouseName: "네이버", tagline: "IT 플랫폼 맞벌이" },
  { id: "samsungdxmx-samsungsds", label: "삼성전자 DX(MX) + 삼성SDS", meName: "삼성전자 DX(MX)", spouseName: "삼성SDS", tagline: "삼성 계열사 맞벌이" },
  { id: "posco-poscointl", label: "포스코 + 포스코인터내셔널", meName: "포스코", spouseName: "포스코인터내셔널", tagline: "포스코 그룹 커플" },
  { id: "hyundaimobis-kia", label: "현대모비스 + 기아", meName: "현대모비스", spouseName: "기아", tagline: "완성차·부품 계열 커플" },
  { id: "lguplus-ktt", label: "LG유플러스 + KT", meName: "LG유플러스", spouseName: "KT", tagline: "통신사 맞벌이" },
  { id: "samsungbio-celltrion", label: "삼성바이오로직스 + 셀트리온", meName: "삼성바이오로직스", spouseName: "셀트리온", tagline: "바이오 업계 커플" },
  { id: "hyundaiconst-gsconst", label: "현대건설 + GS건설", meName: "현대건설", spouseName: "GS건설", tagline: "건설업계 맞벌이" },
  { id: "samsungdxmx-single", label: "삼성전자 DX(MX) 외벌이", meName: "삼성전자 DX(MX)", spouseName: null, tagline: "외벌이 비교 기준" },
  { id: "sktelecom-single", label: "SK텔레콤 외벌이", meName: "SK텔레콤", spouseName: null, tagline: "외벌이 비교 기준" },
];

export const CSR_FAQ = [
  {
    question: "이 계산기에서 사용하는 기업 평균 연봉은 어디서 가져온 데이터인가요?",
    answer: "인기 조합에 자주 등장하는 주요 대기업(SK텔레콤, 삼성전자, 현대자동차, 네이버 등)은 각 사 2024년 사업보고서에 공시된 1인당 평균급여액(DART 전자공시)을 사용합니다. 그 외 기업은 연봉 티어 계산기(salary-tier)의 현직자 커뮤니티·블라인드·잡플래닛 기반 추정치를 그대로 사용합니다.",
  },
  {
    question: "가구소득 상위 %는 어떻게 계산하나요?",
    answer: "통계청 가계금융복지조사를 참고한 가구소득 구간별 상위 % 추정 테이블에서, 입력한 부부 합산 연소득이 어느 구간에 속하는지 선형 보간으로 계산합니다. 실제 통계 분위와 차이가 있을 수 있는 참고용 수치입니다.",
  },
  {
    question: "실수령액은 왜 단순 추정인가요?",
    answer: "4대보험과 소득세를 단순화한 공식으로 계산하기 때문입니다. 비과세 항목, 부양가족 공제, 회사별 급여 체계에 따라 실제 실수령액과 차이가 날 수 있습니다.",
  },
  {
    question: "생활비 시나리오는 어떤 기준으로 만들어졌나요?",
    answer: "1인 가구 생활비 가이드의 절약형·평균형·여유형 시나리오를 2인 가구 기준으로 환산한 추정값입니다. 지역, 자녀 유무, 주거 형태에 따라 실제 생활비는 달라질 수 있습니다.",
  },
  {
    question: "외벌이와 맞벌이를 비교하면 항상 맞벌이가 유리한가요?",
    answer: "합산 가구소득과 가구소득 순위만 보면 맞벌이가 높게 나오는 경우가 많지만, 두 사람 모두의 근로 시간과 생활비 증가분(예: 외식, 출퇴근 비용)은 이 계산기에 반영되지 않습니다. 잉여자금과 함께 참고용으로만 활용하세요.",
  },
];

export const CSR_RELATED_LINKS = [
  { href: "/tools/household-income/", label: "가구 소득 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/reports/single-household-living-cost-2026/", label: "1인 가구 생활비 리포트" },
  { href: "/tools/fire-calculator/", label: "FIRE 은퇴 계산기" },
];

export const CSR_COMPANY_OPTIONS = CSR_COMPANY_OPTIONS_RAW;

export {
  OVERALL_AVG,
  CAT_LABEL,
  TIER_META,
  averageHouseholdIncome,
  householdSizeOptions,
};

export type { TierCompany, TierKey, CatKey };
