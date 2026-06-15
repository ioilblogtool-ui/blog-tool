export type BonusInputMode = "salaryPercent" | "monthlyMultiple" | "fixedAmount";
export type TaxMode = "simple" | "manual";

export interface CompanyFact {
  label: string;
  value: string;
}

export interface CompanySourceRef {
  label: string;
  href?: string;
}

export interface HistoricalBonusPreset {
  label: string;
  description: string;
  mode: BonusInputMode;
  value: number;
  source: CompanySourceRef;
  sourceDate: string;
}

export const DOOSAN_BONUS_DEFAULTS = {
  defaultMode: "salaryPercent" as BonusInputMode,
  defaultSalaryPercent: 15,
  defaultMonthlyMultiple: 1.5,
  defaultFixedAmount: 0,
  defaultAnnualSalary: 65000000,
  structureSummary:
    "사업 부문(원전·에너지·건설 등) 실적과 그룹 평가 기준에 연동되는 성과급 구조로 알려져 있습니다.",
  caution:
    "사업부, 직급, 평가 결과, 노사 협의에 따라 실제 금액이 달라질 수 있습니다.",
  industryNote:
    "최근 원전(SMR) 관련 수주 확대가 보도되고 있으나, 이는 일반 동향 참고 정보이며 성과급 지급률을 보장하지 않습니다.",
};

export const DOOSAN_SIMPLE_TAX_RATE = 0.22;

export interface DoosanScenarioRow {
  rate: number;
  label: string;
}

export const DOOSAN_SCENARIO_RATES: DoosanScenarioRow[] = [
  { rate: 10, label: "10%" },
  { rate: 15, label: "15% (기준)" },
  { rate: 20, label: "20%" },
  { rate: 25, label: "25%" },
  { rate: 30, label: "30%" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const DOOSAN_BONUS_FAQ: FaqItem[] = [
  { question: "두산에너빌리티 성과급(PS)은 어떻게 산정되나요?", answer: "사업 부문(원전·에너지·건설 등) 실적과 그룹 평가 기준에 연동되는 이익배분제(PS) 구조로 알려져 있습니다. 정확한 산정 기준은 회사 공식 발표를 참고하세요." },
  { question: "이 계산기의 성과급률 15%는 확정된 수치인가요?", answer: "아니요. 보도·업계 추정 기반 시뮬레이션 기본값이며, 실제 지급률은 사업 실적과 노사 협의에 따라 달라질 수 있습니다. 직접 입력 모드로 원하는 수치를 적용해 보세요." },
  { question: "원전(SMR) 수주 확대가 성과급에 영향을 주나요?", answer: "관련 동향이 보도되고 있으나, 이 계산기는 해당 정보를 성과급 수치 산정에 직접 반영하지 않습니다. 일반 참고 정보로만 안내합니다." },
  { question: "세후로 얼마나 받게 되나요?", answer: "성과급은 근로소득으로 합산 과세됩니다. 이 계산기의 세후 값은 간이 세율(22%) 또는 직접 입력한 세율을 적용한 참고값이며, 정확한 금액은 성과급 세후 계산기를 이용하세요." },
  { question: "월급 배수로도 계산할 수 있나요?", answer: "네. 입력 방식에서 '월급 × 배수'를 선택하면 월급에 배수를 곱한 금액으로 성과급을 계산할 수 있습니다." },
  { question: "다른 대기업과 비교하려면 어떻게 하나요?", answer: "대기업 성과급 시뮬레이터 또는 대기업 성과급 비교 리포트를 통해 여러 기업의 성과급을 동일 기준으로 비교해 볼 수 있습니다." },
  { question: "사업 부문별로 성과급이 다른가요?", answer: "두산에너빌리티는 원전·발전·에너지 설비, 건설 등 여러 사업 부문으로 구성되어 있어 부문별 실적에 따라 성과급 규모가 달라질 수 있는 것으로 알려져 있습니다." },
];

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const DOOSAN_COMPANY_FACTS: CompanyFact[] = [
  { label: "평균연봉", value: "약 8,200만원" },
  { label: "임직원수", value: "약 5,200명" },
  { label: "매출 (2024)", value: "6조 3,203억원" },
  { label: "영업이익 (2024)", value: "3,934억원" },
];

export const DOOSAN_FACTS_AS_OF = "2024년 실적 발표 기준";

export const DOOSAN_FACTS_SOURCE: CompanySourceRef = {
  label: "두산에너빌리티 2024년 실적 발표 · 고용보험 가입자 통계 기준 추정",
};

export const DOOSAN_HISTORICAL_PRESETS: HistoricalBonusPreset[] = [];

export const DOOSAN_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/corporate-bonus-comparison-2026/", label: "대기업 성과급 비교 리포트", description: "주요 대기업 성과급 발표 동향을 한눈에 확인" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에 대한 세금을 정확히 계산" },
  { href: "/tools/semiconductor-bonus-comparison/", label: "반도체 성과급 비교", description: "삼성전자·SK하이닉스 성과급 비교" },
  { href: "/tools/hanwha-bonus-calculator/", label: "한화오션·한화에어로스페이스 성과급 계산기", description: "조선·방산 업종 성과급 계산" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터", description: "여러 대기업 성과급을 한 번에 비교" },
];
