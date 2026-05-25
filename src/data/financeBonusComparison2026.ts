// ─────────────────────────────────────────────
// 금융권 성과급 비교 2026
// URL: /tools/finance-bonus-comparison/
// ─────────────────────────────────────────────

export type FinanceCompanyId =
  | "kb"
  | "shinhan"
  | "hana"
  | "woori"
  | "nh"
  | "mirae"
  | "koreainv"
  | "samsung_sec";

export type FinanceSector = "bank" | "securities" | "insurance";

export type BonusCalculationBasis =
  | "annualSalaryPercent" // 연봉 n%
  | "basicSalaryPercent" // 기본급 n%
  | "monthlyMultiple"; // 월급 n개월

export type EvidenceBadge = "확정" | "잠정합의" | "참고" | "추정" | "시뮬레이션";

export interface FinanceCompanyConfig {
  id: FinanceCompanyId;
  name: string;
  shortName: string;
  sector: FinanceSector;
  sectorLabel: string;
  parentGroup: string;

  /** 시뮬레이션 기본값 — 공식 지급률 아님 */
  defaultBasis: BonusCalculationBasis;
  defaultPercent: number; // 연봉 대비 % (예시)
  bonusPercentRange: { min: number; max: number };
  badge: EvidenceBadge;

  bonusTypes: string[]; // ["임협 상여", "경영성과급"]
  structureSummary: string;
  keyRisks: string[];
  specialNote: string;
  caution: string;
}

export interface FinanceBonusSectorInfo {
  sector: FinanceSector;
  label: string;
  basisDescription: string;
  variabilityNote: string;
  keyDifference: string;
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

// ─────────────────────────────────────────────
// 회사 데이터 (8개사)
// ─────────────────────────────────────────────

export const FINANCE_BONUS_COMPANIES: FinanceCompanyConfig[] = [
  // ── 은행 ──────────────────────────────────
  {
    id: "kb",
    name: "KB국민은행",
    shortName: "KB국민",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "KB금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 15,
    bonusPercentRange: { min: 10, max: 20 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급"],
    structureSummary:
      "KB금융지주 노사협약 기반 임협 상여 + 금융지주 실적 연동 경영성과급 구조. 기본급 기반 상여가 핵심",
    keyRisks: [
      "임협 결과에 따라 상여율 변동",
      "KB증권·KB손해보험 등 계열사별 상여 구조 상이",
      "경영성과급은 KB금융 연간 실적 연동",
    ],
    specialNote: "KB금융지주 본사 기준. KB증권·KB손해보험은 별도 성과급 체계 적용",
    caution: "직급·근속연수·지점 유형에 따라 실제 지급액이 달라질 수 있습니다.",
  },
  {
    id: "shinhan",
    name: "신한은행",
    shortName: "신한",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "신한금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 15,
    bonusPercentRange: { min: 10, max: 20 },
    badge: "추정",
    bonusTypes: ["임협 상여", "PS(이익분배금)", "특별격려금"],
    structureSummary:
      "신한금융지주 임협 상여 + PS(이익분배금) 구조. 특별격려금이 별도로 지급되는 해가 있음",
    keyRisks: [
      "PS 규모가 신한금융 연간 순이익에 연동",
      "신한투자증권·신한라이프 계열사 성과급 별도",
      "특별격려금은 비정기적",
    ],
    specialNote: "신한은행 본사 기준. 신한투자증권은 증권사 구조 별도 적용",
    caution: "PS 지급 여부와 규모는 연도별 실적에 따라 달라집니다.",
  },
  {
    id: "hana",
    name: "하나은행",
    shortName: "하나",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "하나금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 14,
    bonusPercentRange: { min: 8, max: 18 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급"],
    structureSummary:
      "하나금융지주 임협 기반 상여 + 경영성과급. 4대 은행 중 임협 타결 속도가 빠른 편",
    keyRisks: [
      "하나금융 연간 실적에 경영성과급 연동",
      "하나증권 계열사 별도 구조",
      "임협 타결 지연 시 성과급 지급 시기 변동",
    ],
    specialNote: "하나은행 본사 기준. 하나증권·하나생명은 별도 보상 구조 적용",
    caution: "직급·평가 등급에 따라 실제 지급액 차이가 있습니다.",
  },
  {
    id: "woori",
    name: "우리은행",
    shortName: "우리",
    sector: "bank",
    sectorLabel: "시중은행",
    parentGroup: "우리금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 12,
    bonusPercentRange: { min: 8, max: 16 },
    badge: "추정",
    bonusTypes: ["임협 상여", "경영성과급", "우리사주"],
    structureSummary:
      "우리금융지주 임협 기반 상여. 과거 국책은행 분위기가 남아 타 시중은행 대비 성과급 구조가 다소 보수적인 편",
    keyRisks: [
      "우리금융 민영화 이후에도 보수적 성과급 관행 잔존",
      "우리카드·우리종합금융 계열사 별도",
      "우리사주 연동 보상 규모 변동",
    ],
    specialNote: "우리은행 본사 기준. 재직자 커뮤니티 기반 추정값 포함",
    caution: "실제 성과급은 직급·평가·임협 결과에 따라 달라집니다.",
  },
  {
    id: "nh",
    name: "NH농협은행",
    shortName: "NH농협",
    sector: "bank",
    sectorLabel: "특수은행",
    parentGroup: "NH농협금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 10,
    bonusPercentRange: { min: 5, max: 14 },
    badge: "추정",
    bonusTypes: ["임협 상여", "복리후생 비중 높음"],
    structureSummary:
      "농협중앙회 연계 특수 구조. 현금 성과급보다 복리후생(주택·자녀 교육 등) 비중이 상대적으로 높음",
    keyRisks: [
      "농협중앙회 전체 실적 연동 구조",
      "지역 농축협 vs 농협은행 본사 성과급 체계 완전히 다름",
      "현금 성과급 규모는 시중은행 대비 낮을 수 있음",
    ],
    specialNote: "NH농협은행 본사 기준. 지역 농축협(단위농협)은 완전히 다른 구조",
    caution: "농협은행과 지역 농축협은 별개 법인으로 보상 구조가 다릅니다.",
  },
  // ── 증권사 ─────────────────────────────────
  {
    id: "mirae",
    name: "미래에셋증권",
    shortName: "미래에셋",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "미래에셋그룹",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 20,
    bonusPercentRange: { min: 0, max: 100 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "IB 딜 수수료 연동"],
    structureSummary:
      "IB·리테일·WM·트레이딩 부문별 성과 연동 인센티브. 부문별 편차가 매우 크며 IB 고성과자는 억대 인센티브 가능",
    keyRisks: [
      "부문별 편차 극단적 (IB vs 리테일 지원 부서)",
      "시장 상황(주식 거래량·IB 딜 수)에 따라 변동성 큼",
      "평균값으로 개인 성과급 추정 불가",
    ],
    specialNote:
      "IB·트레이딩·PB 등 고성과 부문과 일반 리테일·지원 부서의 성과급 차이가 수배~수십 배. 이 계산기는 일반 직원 기준 추정값 제공",
    caution:
      "증권사는 부문·직군·개인 성과에 따라 실제 지급액이 극단적으로 달라집니다. 이 계산기의 추정값은 일반 직원 참고용입니다.",
  },
  {
    id: "koreainv",
    name: "한국투자증권",
    shortName: "한투",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "한국금융지주",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 25,
    bonusPercentRange: { min: 0, max: 120 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "딜 수수료 연동"],
    structureSummary:
      "한국금융지주 비상장 자회사. 업계 상위권 성과급으로 알려져 있으며 IB 부문 인센티브가 특히 높은 편",
    keyRisks: [
      "비상장사로 공시 기반 데이터 제한",
      "IB 딜 실적에 따른 연도별 변동성 큼",
      "부문별 편차 극단적",
    ],
    specialNote:
      "비상장사(한국금융지주 자회사). 재직자 후기 및 언론 보도 기반 추정값. IB 부문은 업계 최고 수준으로 알려짐",
    caution: "비상장사로 공식 공시가 제한적입니다. 추정값의 신뢰도가 낮습니다.",
  },
  {
    id: "samsung_sec",
    name: "삼성증권",
    shortName: "삼성증권",
    sector: "securities",
    sectorLabel: "대형 증권사",
    parentGroup: "삼성그룹",
    defaultBasis: "annualSalaryPercent",
    defaultPercent: 18,
    bonusPercentRange: { min: 0, max: 80 },
    badge: "추정",
    bonusTypes: ["부문별 성과 인센티브", "삼성그룹 기준 일부 적용"],
    structureSummary:
      "삼성그룹 계열 증권사. 삼성전자 등 그룹사 기준이 일부 적용되지만 증권업 특성상 부문별 성과 연동 인센티브가 핵심",
    keyRisks: [
      "삼성그룹 계열이지만 증권업 특성으로 부문 편차 존재",
      "WM(자산관리) 강점으로 WM 부문 인센티브 상대적으로 높은 편",
      "시장 상황에 따른 변동성",
    ],
    specialNote: "삼성그룹 계열이나 성과급 구조는 삼성전자(반도체)와 상이. 증권업 특성 적용",
    caution:
      "삼성증권 성과급은 삼성전자와 다른 구조입니다. 부문별 실제 지급액과 다를 수 있습니다.",
  },
];

// ─────────────────────────────────────────────
// 업권별 구조 정보
// ─────────────────────────────────────────────

export const FINANCE_SECTOR_INFO: FinanceBonusSectorInfo[] = [
  {
    sector: "bank",
    label: "은행 (시중·특수)",
    basisDescription:
      "노동조합 임금협약으로 확정되는 기본급 기반 상여 + 금융지주 실적 연동 경영성과급",
    variabilityNote: "임협 타결 상여율은 비슷하나 경영성과급은 금융지주 연간 실적에 따라 변동",
    keyDifference:
      "임협으로 확정되는 구조 → 성과급 수준이 비교적 예측 가능. 직급·평가 편차보다 임협 결과가 우선",
  },
  {
    sector: "securities",
    label: "증권사",
    basisDescription:
      "부문별(IB·리테일·WM·트레이딩) 실적 연동 인센티브. 딜 수수료·거래량 직접 연동",
    variabilityNote: "부문·직군·개인 성과에 따라 0원에서 수억 원까지 편차 극단적",
    keyDifference:
      "같은 회사 내에서도 IB 딜러와 리테일 지원 부서 성과급이 수십 배 차이 날 수 있음",
  },
  {
    sector: "insurance",
    label: "보험사 (내근직 기준)",
    basisDescription:
      "내근직: 그룹사 기준 상여 + 경영성과급 / 설계사: 수수료 구조 (이 계산기 적용 제외)",
    variabilityNote: "내근직은 은행과 유사한 구조. 설계사는 수수료로 비교 불가",
    keyDifference:
      "설계사 성과급은 수수료 구조로 이 도구 적용 범위 제외. 내근직 기준만 비교 가능",
  },
];

// ─────────────────────────────────────────────
// 세후 추정 구간
// ─────────────────────────────────────────────

export const FBC_TAX_BRACKETS: TaxRateBracket[] = [
  {
    minAnnualSalary: 0,
    maxAnnualSalary: 50_000_000,
    estimatedDeductionRate: 0.12,
    label: "5천만 원 이하",
  },
  {
    minAnnualSalary: 50_000_001,
    maxAnnualSalary: 80_000_000,
    estimatedDeductionRate: 0.18,
    label: "5천만~8천만 원",
  },
  {
    minAnnualSalary: 80_000_001,
    maxAnnualSalary: 120_000_000,
    estimatedDeductionRate: 0.24,
    label: "8천만~1.2억 원",
  },
  {
    minAnnualSalary: 120_000_001,
    maxAnnualSalary: 200_000_000,
    estimatedDeductionRate: 0.3,
    label: "1.2억~2억 원",
  },
  {
    minAnnualSalary: 200_000_001,
    maxAnnualSalary: null,
    estimatedDeductionRate: 0.36,
    label: "2억 원 초과",
  },
];

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────

export const FBC_FAQ: FaqItem[] = [
  {
    question: "4대 은행 중 성과급이 가장 많은 곳은 어디인가요?",
    answer:
      "임협 기준 상여율은 4대 은행이 비슷한 수준입니다. 경영성과급이 금융지주 연간 실적에 따라 차이가 나며, 단순 순위보다 기준급·임협 상태·경영성과급 조건을 함께 확인해야 합니다.",
  },
  {
    question: "증권사 성과급이 수억이라는 게 사실인가요?",
    answer:
      "사실이지만 IB 딜러, PB 고성과자 등 특정 부문·직군에 해당하는 이야기입니다. 일반 리테일 영업이나 지원 부서와 같은 기준으로 볼 수 없으며, 부문·개인 실적에 따라 편차가 극단적입니다.",
  },
  {
    question: "은행 노조 상여금과 경영성과급은 어떻게 다른가요?",
    answer:
      "노조 상여금은 임금협약으로 확정되는 정기 보너스로 기준급 기반입니다. 경영성과급은 금융지주의 연간 영업이익·순이익 실적을 기반으로 별도 지급되는 변동 보상입니다.",
  },
  {
    question: "NH농협은행 성과급은 시중은행보다 적은가요?",
    answer:
      "현금 성과급만 보면 시중은행 대비 낮을 수 있습니다. 다만 농협은행은 주택 지원, 자녀 교육비 등 복리후생 비중이 상대적으로 높으므로 총보상 관점에서 함께 고려해야 합니다.",
  },
  {
    question: "보험사 설계사도 성과급이 있나요?",
    answer:
      "설계사는 수수료 구조로 운영되므로 이 계산기 적용 범위에서 제외합니다. 이 도구는 보험사 내근직(본사·지점 사무직) 기준만 다룹니다.",
  },
  {
    question: "은행에서 증권사로 이직하면 성과급이 늘어나나요?",
    answer:
      "이직 후 배치 부문(IB·리테일·WM 등)에 따라 크게 다릅니다. 증권사 고성과 부문은 은행 대비 높을 수 있지만 변동성이 커지는 구조임을 인지해야 합니다. 안정성 vs 성과 연동 중 어떤 가치를 우선하는지 고려하세요.",
  },
  {
    question: "금융권 성과급은 세금을 얼마나 내나요?",
    answer:
      "근로소득으로 과세됩니다. 고액 성과급은 누진세율 적용으로 세후 체감이 크게 줄 수 있습니다. 정확한 세액은 지급 시점 원천징수 후 연말정산에서 확정됩니다.",
  },
  {
    question: "이 계산기 결과로 실제 성과급을 예측할 수 있나요?",
    answer:
      "추정·시뮬레이션 기준이며 공식 지급 데이터가 아닙니다. 실제 지급액은 임협 결과, 경영성과급 규모, 부문, 직급, 개인 평가에 따라 달라집니다. 실제 연봉 협상 시에는 채용 담당자에게 직접 확인하세요.",
  },
];

// ─────────────────────────────────────────────
// 관련 링크
// ─────────────────────────────────────────────

export const FBC_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/tools/bonus-simulator/",
    label: "대기업 성과급 시뮬레이터",
    description: "삼성전자·SK하이닉스·현대차와 함께 비교",
  },
  {
    href: "/tools/it-platform-bonus-comparison/",
    label: "IT 플랫폼 성과급 비교",
    description: "카카오·네이버·쿠팡·크래프톤·라인·토스",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "성과급 세후 실수령 계산기",
    description: "성과급에서 세금·4대보험 빼면 실제 입금액은?",
  },
  {
    href: "/tools/semiconductor-bonus-comparison/",
    label: "반도체 성과급 비교",
    description: "삼성전자·SK하이닉스·DB하이텍 비교",
  },
];

// ─────────────────────────────────────────────
// SeoContent 텍스트
// ─────────────────────────────────────────────

export const FBC_SEO_INTRO: string[] = [
  "금융권 성과급은 업권(은행·증권·보험)에 따라 산식과 성격이 완전히 다르다. 은행은 노동조합 임금협약으로 확정되는 기본급 기반 상여가 핵심이고, 증권사는 IB·리테일·WM·트레이딩 부문별 실적 연동 인센티브로 같은 회사 내에서도 수십 배 편차가 날 수 있다. 이 차이를 구분하지 않고 '금융권 성과급 순위'를 나열하면 독자를 혼란에 빠뜨리는 결과가 된다.",
  "시중은행 4개사(KB국민·신한·하나·우리)와 NH농협은행은 노사 임협을 통해 매년 상여율이 확정된다. 여기에 금융지주 연간 실적 기반의 경영성과급이 더해지는 구조다. 반면 미래에셋증권·한국투자증권·삼성증권 같은 대형 증권사는 부문별 딜 수수료와 거래량에 직접 연동되는 인센티브 구조이므로, 동일 회사 내에서도 IB 딜러와 리테일 지원 직원의 성과급은 극단적으로 다를 수 있다.",
  "이 도구는 사용자가 입력한 연봉을 기준으로 시중은행 5개사 예상 성과급을 비교하는 시뮬레이션을 제공한다. 증권사는 부문별 편차가 극단적이므로 계산기 기본값은 일반 직원 기준 추정값임을 명시한다. 보험사는 내근직 기준으로만 제공하며, 설계사 수수료 구조는 이 계산기 적용 범위에서 제외한다.",
  "금융권 성과급을 판단할 때는 현금 상여 규모만이 아니라 임협 확정 상태, 경영성과급 지급 조건, 업권별 변동성을 함께 고려해야 한다. 이 도구의 결과는 참고용 시뮬레이션이며 공식 지급 데이터가 아니다. 실제 연봉 협상 시에는 임협 타결 내용이나 채용 담당자에게 직접 확인하길 권장한다.",
];

export const FBC_INPUT_POINTS: string[] = [
  "현재 연봉을 입력하면 시중은행 5개사 예상 성과급을 즉시 비교합니다",
  "증권사는 부문별 편차가 커서 별도 해설 카드로 안내합니다",
  "보험사 설계사 성과급은 수수료 구조로 이 계산기 적용 범위에서 제외합니다",
];

export const FBC_CRITERIA: string[] = [
  "은행 성과급 추정값: 재직자 후기·공시·임협 보도 기반 시뮬레이션",
  "증권사 성과급: 일반 직원 기준 추정값 (IB·트레이딩 고성과자와 다름)",
  "세후 추정: 연봉 구간별 간이 공제율 적용 (실제 세금과 다를 수 있음)",
];

export const FBC_META = {
  title: "금융권 성과급 비교 2026: 은행·증권·보험사 한눈에",
  seoTitle: "금융권 성과급 비교 2026｜은행·증권·보험사 성과급 구조와 산식",
  seoDescription:
    "2026년 KB국민은행, 신한은행, 하나은행, 우리은행, 미래에셋증권 등 금융권 주요 기업의 성과급 구조를 비교합니다. 업권별 산식 차이와 내 연봉 기준 예상 성과급을 확인하세요.",
  heroDescription:
    "KB국민은행, 신한은행, 하나은행, 우리은행, 미래에셋증권 등 금융권 주요 기업의 성과급 구조를 업권별로 비교합니다. 은행 임협 상여, 증권사 부문 인센티브, 보험사 내근직 보상의 차이를 이해하고 내 연봉 기준 예상 성과급을 계산해보세요.",
  dataNote:
    "성과급 추정값은 재직자 후기·임협 보도·공시 기반 시뮬레이션입니다. 실제 지급액은 임협 결과, 부문, 직급, 개인 평가에 따라 달라질 수 있습니다.",
};
