// ─────────────────────────────────────────────
// IT 플랫폼 성과급 비교 2026
// URL: /tools/it-platform-bonus-comparison/
// ─────────────────────────────────────────────

export type ITPlatformCompanyId =
  | "naver"
  | "kakao"
  | "coupang"
  | "krafton"
  | "linePlus"
  | "toss";

export type ListingType = "kospi" | "nyse" | "unlisted";

export type CompensationType =
  | "cash_pi"
  | "rsu"
  | "stock_option"
  | "esop"
  | "signing_bonus";

export type EvidenceBadge = "확정" | "참고" | "추정" | "시뮬레이션";

export interface ITPlatformCompanyConfig {
  id: ITPlatformCompanyId;
  name: string;
  shortName: string;
  listing: ListingType;
  listingLabel: string;
  compensationTypes: CompensationType[];
  /** 연봉 대비 현금 PI % — 입력 편의용 예시값 (공식 지급률 아님) */
  defaultCashPiPercent: number;
  cashPiPercentRange: { min: number; max: number };
  cashPiBadge: EvidenceBadge;
  rsuNote: string;
  stockOptionNote: string;
  equityBadge: EvidenceBadge;
  keyRisks: string[];
  specialNote: string;
  structureSummary: string;
  caution: string;
}

export interface ITPlatformCompensationTypeInfo {
  type: CompensationType;
  label: string;
  taxNote: string;
  riskNote: string;
}

export interface TaxRateBracket {
  minAnnualSalary: number;
  maxAnnualSalary: number | null;
  estimatedDeductionRate: number;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

// ── 회사 데이터 ──────────────────────────────
export const IT_PLATFORM_COMPANIES: ITPlatformCompanyConfig[] = [
  {
    id: "naver",
    name: "네이버",
    shortName: "NAVER",
    listing: "kospi",
    listingLabel: "KOSPI 상장",
    compensationTypes: ["cash_pi", "rsu"],
    defaultCashPiPercent: 15,
    cashPiPercentRange: { min: 5, max: 30 },
    cashPiBadge: "추정",
    rsuNote: "RSU 3~4년 베스팅 구조. 직급·평가에 따라 부여 수량 차이",
    stockOptionNote: "RSU 중심 전환, 스톡옵션 부여는 선택적",
    equityBadge: "참고",
    keyRisks: [
      "AI 투자 확대에 따른 비용 증가",
      "주가 연동 RSU 가치 변동",
      "계열사(파이낸셜·웹툰 등) 별도 보상 구조",
    ],
    specialNote: "네이버파이낸셜·웹툰·라인웍스 등 계열사별 보상 상이. 본사 기준 표기",
    structureSummary: "연봉 대비 현금 PI + RSU 병행. PI는 실적 기반 연 1회 지급이 일반적",
    caution: "계열사·직군·연도·평가 등급에 따라 실제 지급액이 달라질 수 있습니다.",
  },
  {
    id: "kakao",
    name: "카카오",
    shortName: "카카오",
    listing: "kospi",
    listingLabel: "KOSPI 상장",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 10,
    cashPiPercentRange: { min: 0, max: 25 },
    cashPiBadge: "추정",
    rsuNote: "계열사(카카오뱅크·카카오페이·카카오게임즈)에 따라 RSU 부여 여부·수량 차이 큼",
    stockOptionNote: "본사 및 일부 계열사에서 스톡옵션 부여 사례 있음",
    equityBadge: "참고",
    keyRisks: [
      "계열사별 실적 편차 큼",
      "2022~2023 실적 부진으로 PI 감소 이력",
      "카카오뱅크·카카오페이 별도 상장으로 보상 구조 분리",
    ],
    specialNote: "카카오 본사와 계열사 보상이 완전히 다름. 이 계산기는 카카오 본사 기준",
    structureSummary: "PI 중심 현금 보상 + 계열사별 RSU/스톡옵션 혼합. 실적 부진 시 PI 규모 크게 변동",
    caution: "카카오 계열사 재직 시 본사 기준값과 실제 지급액이 크게 다를 수 있습니다.",
  },
  {
    id: "coupang",
    name: "쿠팡",
    shortName: "쿠팡",
    listing: "nyse",
    listingLabel: "NYSE 상장",
    compensationTypes: ["cash_pi", "rsu", "signing_bonus"],
    defaultCashPiPercent: 8,
    cashPiPercentRange: { min: 0, max: 15 },
    cashPiBadge: "추정",
    rsuNote: "RSU가 총보상의 핵심. NYSE 주가 × 원/달러 환율 이중 연동",
    stockOptionNote: "RSU 방식 채택. 스톡옵션 방식 미채택",
    equityBadge: "추정",
    keyRisks: [
      "NYSE 상장으로 주가·환율 이중 리스크",
      "베스팅 전 이직 시 미수령분 전액 포기",
      "한국 세법상 RSU 베스팅 시점 근로소득 과세",
    ],
    specialNote: "미국 NYSE 상장사(CPNG). SEC Form 20-F 공시 기반. 쿠팡이츠·로켓그로스 사업부별 차이 가능",
    structureSummary: "현금 연봉 + RSU 중심 총보상 설계. RSU 가치는 주가·환율 연동",
    caution: "RSU는 주가·환율 변동으로 베스팅 시점 실수령 가치가 크게 달라질 수 있습니다.",
  },
  {
    id: "krafton",
    name: "크래프톤",
    shortName: "크래프톤",
    listing: "kospi",
    listingLabel: "KOSPI 상장",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 20,
    cashPiPercentRange: { min: 5, max: 50 },
    cashPiBadge: "추정",
    rsuNote: "RSU 부여 사례 있음. 직급·평가 연동",
    stockOptionNote: "핵심 개발 인재 중심 스톡옵션 부여 사례",
    equityBadge: "추정",
    keyRisks: [
      "배틀그라운드 IP 집중 리스크",
      "게임 글로벌 매출 변동성 큼",
      "신작 성공 여부에 따른 연도별 성과급 편차",
    ],
    specialNote: "게임 IP(배틀그라운드) 글로벌 실적 연동 PI 구조. 호황기와 불황기 성과급 편차 상대적으로 큼",
    structureSummary: "게임 실적 연동 PI + RSU/스톡옵션. 연도별 성과급 변동성이 다른 IT 플랫폼 대비 큰 편",
    caution: "게임 실적·신작 성과에 따라 지급액이 연도별로 크게 달라질 수 있습니다.",
  },
  {
    id: "linePlus",
    name: "라인플러스",
    shortName: "라인",
    listing: "unlisted",
    listingLabel: "비상장 (LY Corp 자회사)",
    compensationTypes: ["cash_pi", "rsu", "stock_option"],
    defaultCashPiPercent: 12,
    cashPiPercentRange: { min: 5, max: 20 },
    cashPiBadge: "추정",
    rsuNote: "일본 LY Corp(구 라인야후) 주식 기반 RSU. 엔/원 환율 연동",
    stockOptionNote: "LY Corp 스톡옵션 부여 사례",
    equityBadge: "추정",
    keyRisks: [
      "일본 LY Corp 실적·정책 변화에 따른 보상 구조 변동",
      "엔/원 환율 리스크",
      "일본·한국 법인 교차 인사 정책 불확실성",
    ],
    specialNote: "LY Corp(구 라인야후) 100% 자회사. 비상장이나 일본 모회사 주식 기반 보상. 재직자 후기 기반 추정",
    structureSummary: "일본 본사 정책 연동 PI + LY Corp 주식 보상. 글로벌 조직으로 한국 법인 기준 적용 범위 확인 필요",
    caution: "일본 본사 정책 변화·환율에 따라 실제 보상이 달라질 수 있습니다.",
  },
  {
    id: "toss",
    name: "토스",
    shortName: "토스",
    listing: "unlisted",
    listingLabel: "비상장",
    compensationTypes: ["cash_pi", "esop"],
    defaultCashPiPercent: 8,
    cashPiPercentRange: { min: 0, max: 15 },
    cashPiBadge: "추정",
    rsuNote: "RSU 미채택. ESOP(스톡옵션) 중심 보상",
    stockOptionNote: "ESOP이 총보상 핵심. IPO·M&A 전까지 현금화 창구 제한적",
    equityBadge: "추정",
    keyRisks: [
      "비상장 ESOP은 IPO·M&A 전까지 유동화 불가",
      "스톡옵션 행사 시 세금 구조 복잡",
      "상장 일정 불확실",
    ],
    specialNote: "비바리퍼블리카(토스) 비상장사. 현금 성과급보다 ESOP이 핵심. 상장 기대감이 보상 전략과 연결",
    structureSummary: "현금 보너스(소규모) + ESOP(스톡옵션) 중심 설계. IPO 기대감이 인재 보상의 핵심 변수",
    caution: "ESOP은 IPO 또는 M&A 전까지 현금화가 어렵고, 행사 조건·세금이 복잡합니다.",
  },
];

// ── 보상 유형별 세금·리스크 ────────────────────
export const COMPENSATION_TYPE_INFO: ITPlatformCompensationTypeInfo[] = [
  {
    type: "cash_pi",
    label: "현금 성과급 (PI/보너스)",
    taxNote: "지급 시점 근로소득 과세. 연봉과 합산되어 과세표준 상승 가능",
    riskNote: "즉시 수령. 실적 부진 시 지급 규모 감소",
  },
  {
    type: "rsu",
    label: "RSU (양도제한조건부주식)",
    taxNote: "베스팅 시점 시가 기준 근로소득 과세. 매도 시 양도소득세 별도",
    riskNote: "주가 하락 시 베스팅 시점 가치 감소. 베스팅 전 이직 시 미수령",
  },
  {
    type: "stock_option",
    label: "스톡옵션 (상장사)",
    taxNote: "행사 시 (시가 - 행사가) 차액 근로소득 과세. 이후 매도 시 양도소득세",
    riskNote: "시가 < 행사가이면 행사 의미 없음. 베스팅 기간 중 이직 시 미행사분 포기",
  },
  {
    type: "esop",
    label: "ESOP (스톡옵션, 비상장)",
    taxNote: "행사 시 (공정가치 - 행사가) 차액이 기타소득 또는 근로소득으로 과세. 비상장 공정가치 산정 복잡",
    riskNote: "IPO·M&A 전 현금화 불가. 상장 여부·시점 불확실",
  },
  {
    type: "signing_bonus",
    label: "사이닝 보너스",
    taxNote: "지급 시 근로소득 과세",
    riskNote: "중도 퇴사 시 반환 조건 계약 반드시 확인",
  },
];

// ── 세후 추정 구간 ────────────────────────────
export const ITPBC_TAX_BRACKETS: TaxRateBracket[] = [
  { minAnnualSalary: 0,           maxAnnualSalary: 50_000_000,  estimatedDeductionRate: 0.12, label: "5천만 원 이하" },
  { minAnnualSalary: 50_000_001,  maxAnnualSalary: 80_000_000,  estimatedDeductionRate: 0.18, label: "5천만~8천만 원" },
  { minAnnualSalary: 80_000_001,  maxAnnualSalary: 120_000_000, estimatedDeductionRate: 0.24, label: "8천만~1.2억 원" },
  { minAnnualSalary: 120_000_001, maxAnnualSalary: 200_000_000, estimatedDeductionRate: 0.30, label: "1.2억~2억 원" },
  { minAnnualSalary: 200_000_001, maxAnnualSalary: null,         estimatedDeductionRate: 0.36, label: "2억 원 초과" },
];

// ── FAQ ───────────────────────────────────────
export const ITPBC_FAQ: FaqItem[] = [
  {
    question: "IT 플랫폼 성과급은 반도체보다 적은가요?",
    answer:
      "현금 PI만 보면 반도체 대기업 대비 적을 수 있지만, RSU·스톡옵션을 포함한 총보상(Total Compensation)은 회사, 직군, 직급, 경력에 따라 크게 달라집니다. 단순 현금 비교만으로는 판단하기 어렵습니다.",
  },
  {
    question: "카카오와 네이버 중 성과급이 더 많은 곳은 어디인가요?",
    answer:
      "카카오는 계열사(카카오뱅크·카카오페이 등)에 따라 편차가 크고, 네이버는 본사 기준 RSU 비중이 높습니다. 연도별 실적 차이도 크므로 직군·계열사·RSU 포함 여부를 함께 봐야 합니다.",
  },
  {
    question: "쿠팡 RSU는 믿을 수 있는 보상인가요?",
    answer:
      "NYSE에 상장된 주식 기반이므로 주가와 원/달러 환율에 따라 베스팅 시점 가치가 달라집니다. 또한 베스팅 기간(보통 4년) 전 이직하면 미수령분은 포기하게 됩니다.",
  },
  {
    question: "토스 ESOP(스톡옵션)은 실제로 수령할 수 있나요?",
    answer:
      "토스(비바리퍼블리카)는 비상장사로, ESOP은 IPO 또는 M&A 등 유동성 창구가 열릴 때 행사 가능합니다. 상장 전에는 현금화가 어렵고, 행사 시 세금 구조도 복잡합니다.",
  },
  {
    question: "RSU를 받으면 세금은 어떻게 내나요?",
    answer:
      "RSU는 베스팅(권리 확정) 시점에 시가 기준으로 근로소득세가 부과됩니다. 이후 주식을 매도할 때는 추가로 양도소득세가 발생할 수 있습니다. 베스팅 시점 주가가 높을수록 세금 부담도 커집니다.",
  },
  {
    question: "이직할 때 RSU를 포기하면 얼마나 손해인가요?",
    answer:
      "미베스팅 RSU의 잔여 가치(잔여 수량 × 현재 주가)를 이직 패키지와 비교해야 합니다. 특히 클리프(최초 베스팅 시점, 보통 1년) 직전 이직은 전체를 포기하는 것이므로 타이밍에 주의가 필요합니다.",
  },
  {
    question: "크래프톤 성과급은 게임 성적에 따라 달라지나요?",
    answer:
      "배틀그라운드 등 주요 IP의 글로벌 매출 실적이 PI에 반영되는 구조로 알려져 있습니다. 신작 성과나 글로벌 운영 실적에 따라 연도별 지급 규모가 달라질 수 있습니다.",
  },
  {
    question: "이 계산기 결과를 실제 연봉 협상에 사용해도 되나요?",
    answer:
      "이 계산기의 결과는 추정·시뮬레이션 기준이며 공식 지급 데이터가 아닙니다. 실제 협상에는 회사별 공식 채용 안내, 재직자 커뮤니티 후기, 최근 공시 등을 함께 참고하시길 권장합니다.",
  },
];

// ── 관련 링크 ─────────────────────────────────
export const ITPBC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/bonus-simulator/",
    label: "대기업 성과급 시뮬레이터",
    description: "삼성전자·SK하이닉스·현대차와 함께 비교",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령액 계산기",
    description: "세전 성과급에서 실제 통장 입금액 추정",
  },
  {
    href: "/tools/samsung-bonus/",
    label: "삼성전자 성과급 계산기",
    description: "DS·DX 사업부별 OPI·TAI 계산",
  },
  {
    href: "/tools/sk-hynix-bonus/",
    label: "SK하이닉스 성과급 계산기",
    description: "PS·PI 세전·세후 계산",
  },
];

// ── SeoContent 텍스트 ─────────────────────────
export const ITPBC_SEO_INTRO: string[] = [
  "IT 플랫폼 기업의 성과급은 반도체·자동차 대기업과 구조가 완전히 다르다. 카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스는 현금 성과급(PI) 외에 RSU(양도제한조건부주식), 스톡옵션, ESOP을 혼합해 총보상(Total Compensation)을 설계한다. 단순히 현금 성과급 숫자만 비교하면 회사 간 실제 보상 차이를 파악하기 어렵다.",
  "현금 PI는 지급 시점에 바로 수령하지만, RSU는 베스팅 일정에 따라 수년에 걸쳐 확정된다. 스톡옵션은 행사 시점의 주가가 행사가를 초과해야 가치가 생긴다. 쿠팡은 NYSE 상장사라 주가·환율 이중 리스크가 있고, 토스는 비상장이라 ESOP을 IPO 전까지 현금화할 수 없다. 이처럼 상장 여부가 보상 설계의 핵심 변수 중 하나다.",
  "이 도구는 사용자가 입력한 연봉을 기준으로 6개사 예상 현금 PI를 비교하는 시뮬레이션을 제공한다. 카카오 계열사 편차, 라인플러스 일본 본사 연동 등 특수 변수는 해설로 안내한다. 결과는 재직자 커뮤니티·채용공고·공시 기반 추정값이며, 회사·직군·연도에 따라 실제 지급액이 달라질 수 있다.",
  "IT 플랫폼 성과급을 판단할 때는 현금 PI 규모만이 아니라 RSU 베스팅 조건, 스톡옵션 행사 가능 시점, 이직 시 포기 비용을 함께 고려해야 한다. 이 도구의 계산 결과는 참고용 시뮬레이션이며 공식 지급 데이터가 아니다. 실제 연봉 협상 시에는 회사 채용 담당자에게 패키지 구성을 직접 확인하길 권장한다.",
];

export const ITPBC_INPUT_POINTS: string[] = [
  "현재 연봉을 입력하면 6개사 예상 현금 PI를 즉시 비교합니다",
  "RSU·스톡옵션 구조와 리스크는 회사별 해설 카드에서 확인할 수 있습니다",
  "보상 유형별(현금·RSU·스톡옵션) 세금 구조와 이직 리스크를 함께 안내합니다",
];

export const ITPBC_CRITERIA: string[] = [
  "현금 PI 추정값: 재직자 커뮤니티·채용공고·공시 기반 추정 (시뮬레이션)",
  "RSU·스톡옵션 구조: 사업보고서·SEC Filing·언론 보도 기반 (참고)",
  "세후 추정: 연봉 구간별 간이 공제율 적용 (실제 세금과 다를 수 있음)",
];

// ── 이직자 체크리스트 ─────────────────────────
export const ITPBC_CHECKLIST: string[] = [
  "현금 연봉(Base)과 총보상(TC = Base + Bonus + Equity)을 구분해 확인했는가?",
  "RSU 클리프(최초 베스팅 시점, 보통 1년)와 전체 베스팅 일정을 확인했는가?",
  "현재 회사의 미베스팅 RSU 포기 금액을 이직 패키지와 비교했는가?",
  "비상장 스톡옵션(ESOP)이라면 유동화 창구(IPO·M&A) 조건을 확인했는가?",
  "쿠팡 RSU는 주가·환율 이중 리스크를 인지했는가?",
  "카카오라면 본사인지 계열사인지 구분해 보상 조건을 확인했는가?",
];

// ── 메타 ──────────────────────────────────────
export const ITPBC_META = {
  title: "IT 플랫폼 성과급 비교 2026: 카카오·네이버·쿠팡·크래프톤·라인·토스",
  seoTitle:
    "IT 플랫폼 성과급 비교 2026｜카카오·네이버·쿠팡·크래프톤·라인·토스 총보상",
  seoDescription:
    "2026년 카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스 성과급 구조와 RSU·스톡옵션 포함 총보상을 비교합니다. 내 연봉 기준 예상 현금 성과급을 즉시 계산해보세요.",
  dataNote:
    "현금 PI 추정값은 재직자 커뮤니티·채용공고·공시 기반 시뮬레이션입니다. 실제 지급액은 회사·계열사·직군·직급·평가 등에 따라 달라질 수 있습니다.",
};
