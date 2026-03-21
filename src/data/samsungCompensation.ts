export type HouseholdMode = "SINGLE" | "COUPLE";
export type RankCode = "STAFF" | "ASSISTANT_MANAGER" | "MANAGER" | "DEPUTY_GM" | "GM";
export type DivisionCode = "DS" | "MX" | "CSS" | "DEVICE" | "SUPPORT";
export type TargetYear = "2026" | "2027" | "2028";
export type ScenarioCode = "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
export type OpiMode = "ACTUAL" | "SCENARIO";

export interface RankPreset {
  code: RankCode;
  label: string;
  defaultSalary: number;
}

export interface DivisionConfig {
  code: DivisionCode;
  label: string;
  actual2026Rate: number;
  actualLabel: string;
  scenarioRates: Record<ScenarioCode, number>;
}

export interface ScenarioPreset {
  code: ScenarioCode;
  label: string;
  opiAdjustmentLabel: string;
  taiFirstHalf: number;
  taiSecondHalf: number;
}

export const rankPresets: RankPreset[] = [
  { code: "STAFF", label: "사원", defaultSalary: 70000000 },
  { code: "ASSISTANT_MANAGER", label: "대리", defaultSalary: 90000000 },
  { code: "MANAGER", label: "과장", defaultSalary: 110000000 },
  { code: "DEPUTY_GM", label: "차장", defaultSalary: 135000000 },
  { code: "GM", label: "부장", defaultSalary: 160000000 }
];

export const yearOptions: Array<{ code: TargetYear; label: string }> = [
  { code: "2026", label: "2026" },
  { code: "2027", label: "2027" },
  { code: "2028", label: "2028" }
];

export const opiModes: Array<{ code: OpiMode; label: string; description: string }> = [
  { code: "ACTUAL", label: "2026 실제 기준", description: "2025 실적 기준 사업부 공개 지급률을 반영합니다." },
  { code: "SCENARIO", label: "시나리오 기준", description: "2027·2028 또는 가정값 비교용 시뮬레이션입니다." }
];

export const divisions: DivisionConfig[] = [
  {
    code: "DS",
    label: "DS 반도체",
    actual2026Rate: 0.47,
    actualLabel: "2026 실제 참고 47%",
    scenarioRates: { CONSERVATIVE: 0.3, BASE: 0.4, AGGRESSIVE: 0.5 }
  },
  {
    code: "MX",
    label: "MX",
    actual2026Rate: 0.5,
    actualLabel: "2026 실제 참고 50%",
    scenarioRates: { CONSERVATIVE: 0.38, BASE: 0.45, AGGRESSIVE: 0.5 }
  },
  {
    code: "CSS",
    label: "CSS",
    actual2026Rate: 0.11,
    actualLabel: "2026 실제 참고 11%",
    scenarioRates: { CONSERVATIVE: 0.08, BASE: 0.12, AGGRESSIVE: 0.18 }
  },
  {
    code: "DEVICE",
    label: "VD/DA/네트워크/의료기기",
    actual2026Rate: 0.12,
    actualLabel: "2026 실제 참고 12%",
    scenarioRates: { CONSERVATIVE: 0.1, BASE: 0.14, AGGRESSIVE: 0.18 }
  },
  {
    code: "SUPPORT",
    label: "공통/지원조직",
    actual2026Rate: 0.36,
    actualLabel: "2026 실제 참고 34~39% 구간",
    scenarioRates: { CONSERVATIVE: 0.28, BASE: 0.36, AGGRESSIVE: 0.42 }
  }
];

export const scenarioPresets: ScenarioPreset[] = [
  { code: "CONSERVATIVE", label: "보수적", opiAdjustmentLabel: "낮은 업황 가정", taiFirstHalf: 0.25, taiSecondHalf: 0.25 },
  { code: "BASE", label: "기준", opiAdjustmentLabel: "평균적 업황 가정", taiFirstHalf: 0.5, taiSecondHalf: 0.5 },
  { code: "AGGRESSIVE", label: "공격적", opiAdjustmentLabel: "강한 업황 가정", taiFirstHalf: 1, taiSecondHalf: 1 }
];

export const factAnchors = [
  { label: "OPI 구조", value: "연봉 최대 50%", note: "공개 설명 기준 상한" },
  { label: "2026 MX OPI", value: "50%", note: "2025 실적 기준 보도" },
  { label: "2026 DS OPI", value: "47%", note: "2025 실적 기준 보도" },
  { label: "평균 직원 보수", value: "약 1.58억 원", note: "2025 사업보고서 보도 기준" }
];

export const comparisonCards = [
  { code: "SKHYNIX", label: "삼성전자 vs SK하이닉스", annualTotal: 185000000, note: "평균 보수 기사 기준 비교선" },
  { code: "HYUNDAI", label: "삼성전자 vs 현대차", annualTotal: 140000000, note: "안정형 성과급 가정" },
  { code: "DOCTOR", label: "삼성전자 차장 vs 개원의 의사", annualTotal: 300000000, note: "세전 총보상 가정" },
  { code: "COUPLE", label: "삼성전자 사내 부부 vs 외벌이 고소득 직군", annualTotal: 320000000, note: "참고용 비교선" }
];

export const averageCompensation = 158000000;
export const defaultBenefits = 10000000;
