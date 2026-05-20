export type HouseholdMode = "SINGLE" | "COUPLE";
export type RankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type TargetYear = "2026" | "2027" | "2028";
export type ScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type PackageMode = "ACTUAL" | "SCENARIO";

export interface RankPreset {
  code: RankCode;
  label: string;
  defaultSalary: number;
  defaultMonthlyBase: number;
}

export interface ScenarioPreset {
  code: ScenarioCode;
  label: string;
  bonusMultiplier: number;
  fixedCash: number;
  stockShares: number;
}

export interface OperatingProfitConsensus {
  year: TargetYear;
  label: string;
  operatingProfit: number;
  source: string;
  note: string;
}

export const rankPresets: RankPreset[] = [
  { code: "STAFF", label: "사원", defaultSalary: 65000000, defaultMonthlyBase: 4200000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultSalary: 82000000, defaultMonthlyBase: 5100000 },
  { code: "MANAGER", label: "과장", defaultSalary: 98000000, defaultMonthlyBase: 6200000 },
  { code: "DEPUTY_GM", label: "차장", defaultSalary: 118000000, defaultMonthlyBase: 7400000 },
  { code: "GM", label: "부장", defaultSalary: 142000000, defaultMonthlyBase: 8600000 }
];

export const yearOptions: Array<{ code: TargetYear; label: string }> = [
  { code: "2026", label: "2026" },
  { code: "2027", label: "2027" },
  { code: "2028", label: "2028" }
];

export const packageModes: Array<{ code: PackageMode; label: string; description: string }> = [
  { code: "ACTUAL", label: "2026 실제 기준", description: "2025 임단협 패키지 공개값을 반영합니다." },
  { code: "SCENARIO", label: "시나리오 기준", description: "2027·2028 또는 가정값 비교용 시뮬레이션입니다." }
];

export const scenarioPresets: ScenarioPreset[] = [
  { code: "CONSERVATIVE", label: "보수적", bonusMultiplier: 3.0, fixedCash: 10000000, stockShares: 10 },
  { code: "BASE", label: "기준", bonusMultiplier: 4.5, fixedCash: 15800000, stockShares: 30 },
  { code: "AGGRESSIVE", label: "공격적", bonusMultiplier: 5.0, fixedCash: 20000000, stockShares: 40 }
];

export const factAnchors = [
  { label: "기존 합의 성과급", value: "월급 450%", note: "2025 임단협 패키지 기준" },
  { label: "기존 합의 정액 현금", value: "1,580만 원", note: "2025 임단협 패키지 기준" },
  { label: "기존 합의 자사주", value: "30주", note: "2025 임단협 패키지 기준" },
  { label: "상품권", value: "20만 원", note: "전통시장 상품권" },
  { label: "2026 노조 요구", value: "순이익 30%", note: "확정안이 아닌 임협 요구안" }
];

export const unionDemandHighlights = [
  {
    label: "성과급 요구",
    value: "2025년 순이익의 30%",
    note: "현대차 노조 2026년 임금협상 요구안 기준"
  },
  {
    label: "기본급 요구",
    value: "월 14만 9,600원 인상",
    note: "호봉승급분 제외"
  },
  {
    label: "임금 구조 요구",
    value: "완전 월급제·상여금 800%",
    note: "AI·로봇 도입에 따른 고용·소득 안정 의제 포함"
  }
];

export const demandVerificationSteps = [
  "현대차 노조 또는 금속노조 현대차지부 공지에서 임시 대의원대회 요구안 원문을 먼저 확인합니다.",
  "교섭 시작·상견례 이후에는 회사 측 제시안, 노조 수정안, 잠정합의안을 구분해서 봅니다.",
  "언론 기사 수치는 요구안인지 합의안인지 표기를 확인하고, 계산기에는 요구안·추정·확정값 배지를 분리합니다.",
  "성과급 산식은 순이익 기준인지 영업이익 기준인지 반드시 구분합니다."
];

export const operatingProfitConsensus: OperatingProfitConsensus[] = [
  {
    year: "2026",
    label: "2026E",
    operatingProfit: 12766000000000,
    source: "FnGuide 컨센서스, KB증권 2026년 4월 리포트 인용",
    note: "KB증권 추정치 11.63조 원 대비 컨센서스는 약 12.77조 원"
  },
  {
    year: "2027",
    label: "2027E",
    operatingProfit: 13897000000000,
    source: "FnGuide 컨센서스, KB증권 2026년 4월 리포트 인용",
    note: "KB증권 추정치 11.90조 원 대비 컨센서스는 약 13.90조 원"
  }
];

export const operatingProfitSensitivityRates = [
  { label: "보수 참고", rate: 0.1, note: "영업이익 10% 가정" },
  { label: "중간 참고", rate: 0.15, note: "영업이익 15% 가정" },
  { label: "요구안 비교선", rate: 0.3, note: "노조 요구안은 순이익 30%라 직접 비교 시 주의" }
];

export const defaultEmployeeCount = 72000;

export const comparisonCards = [
  { code: "SAMSUNG", label: "현대자동차 vs 삼성전자", annualTotal: 158000000, note: "평균 보수 기사 기준 비교선" },
  { code: "SKHYNIX", label: "현대자동차 vs SK하이닉스", annualTotal: 185000000, note: "평균 보수 기사 기준 비교선" },
  { code: "DOCTOR", label: "현대차 차장 vs 개원의 의사", annualTotal: 300000000, note: "세전 총보상 가정" },
  { code: "COUPLE", label: "현대차 사내 부부 vs 고소득 외벌이 직군", annualTotal: 320000000, note: "참고용 비교선" }
];

export const defaultBenefits = 8000000;
export const defaultStockPrice = 210000;
export const actualBonusMultiplier = 4.5;
export const actualFixedCash = 15800000;
export const actualStockShares = 30;
export const actualGiftValue = 200000;
