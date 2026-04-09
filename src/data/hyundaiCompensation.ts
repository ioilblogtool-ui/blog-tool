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
  { label: "성과급", value: "월급 450%", note: "2025 임단협 패키지 기준" },
  { label: "정액 현금", value: "1,580만 원", note: "2025 임단협 패키지 기준" },
  { label: "자사주", value: "30주", note: "2025 임단협 패키지 기준" },
  { label: "상품권", value: "20만 원", note: "전통시장 상품권" },
  { label: "월 기본급 인상", value: "10만 원", note: "합의안 기준" }
];

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
