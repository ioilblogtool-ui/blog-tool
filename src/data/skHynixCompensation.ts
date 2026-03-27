export type HouseholdMode = "SINGLE" | "COUPLE";
export type RankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type TargetYear = "2026" | "2027" | "2028";
export type PayoutMode = "ACTUAL" | "SCENARIO";
export type ScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";

export interface RankPreset {
  code: RankCode;
  label: string;
  defaultSalary: number;
}

export interface ScenarioOption {
  code: ScenarioCode;
  label: string;
  piRatio: number;
}

export interface YearScenario {
  conservative: number;
  base: number;
  aggressive: number;
}

export interface YearSummaryRow {
  payoutLabel: string;
  conservativePsRange: string;
  conservativeTotalRange: string;
}

export const rankPresets: RankPreset[] = [
  { code: "STAFF", label: "사원", defaultSalary: 80000000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultSalary: 100000000 },
  { code: "MANAGER", label: "과장", defaultSalary: 120000000 },
  { code: "DEPUTY_GM", label: "차장", defaultSalary: 150000000 },
  { code: "GM", label: "부장", defaultSalary: 180000000 }
];

export const yearOptions: Array<{ code: TargetYear; label: string }> = [
  { code: "2026", label: "2026" },
  { code: "2027", label: "2027" },
  { code: "2028", label: "2028" }
];

export const payoutModes: Array<{ code: PayoutMode; label: string; description: string }> = [
  { code: "ACTUAL", label: "2026 실제값", description: "PS 2,964% 지급 사례를 기준으로 계산" },
  { code: "SCENARIO", label: "시나리오값", description: "미래 업황 가정 기반 가변 계산" }
];

export const scenarioOptions: ScenarioOption[] = [
  { code: "CONSERVATIVE", label: "보수적", piRatio: 0.5 },
  { code: "BASE", label: "기준", piRatio: 1.5 },
  { code: "AGGRESSIVE", label: "공격적", piRatio: 3 }
];

export const psMultipliersByYear: Record<TargetYear, YearScenario> = {
  "2026": { conservative: 24, base: 29.64, aggressive: 33 },
  "2027": { conservative: 53.38, base: 58.09, aggressive: 62.8 },
  "2028": { conservative: 50.24, base: 54.95, aggressive: 59.66 }
};

export const futurePiRatioByYear: Partial<Record<TargetYear, number>> = {
  "2027": 1.5,
  "2028": 1.5
};

export const factAnchors = [
  {
    label: "2025 매출",
    value: "97.1467조 원",
    note: "FY2025 공개 실적"
  },
  {
    label: "2025 영업이익",
    value: "47.2063조 원",
    note: "FY2025 공개 실적"
  },
  {
    label: "2026 초 실제 PS",
    value: "기준급 2,964%",
    note: "기준급의 29.64배"
  },
  {
    label: "평균 직원 보수",
    value: "약 1.85억 원",
    note: "2025 사업보고서 보도 기준"
  }
];

export const comparisonBenchmarks = [
  {
    code: "AUTO",
    label: "자동차 고성과자",
    annualTotal: 140000000,
    note: "안정형 성과급 가정 기준"
  },
  {
    code: "EMPLOYED_DOCTOR",
    label: "봉직의",
    annualTotal: 200000000,
    note: "세전 총보상 가정 기준"
  },
  {
    code: "CLINIC_OWNER",
    label: "개원의",
    annualTotal: 300000000,
    note: "세전 총보상 가정 기준"
  },
  {
    code: "HIGH_SINGLE",
    label: "외벌이 고소득 직군",
    annualTotal: 370000000,
    note: "하이닉스 부부 평균 화제선 비교용"
  }
];

export const yearSummaryRows: YearSummaryRow[] = [
  {
    payoutLabel: "2027년 지급분",
    conservativePsRange: "5338% ~ 6280%",
    conservativeTotalRange: "5488% ~ 6430%"
  },
  {
    payoutLabel: "2028년 지급분",
    conservativePsRange: "5024% ~ 5966%",
    conservativeTotalRange: "5174% ~ 6116%"
  }
];

export const welfareDefault = 12000000;
export const actualPsMultiplier = 29.64;
export const immediatePsRatio = 0.8;
export const deferredPsRatio = 0.2;
export const averageCompensation = 185000000;


