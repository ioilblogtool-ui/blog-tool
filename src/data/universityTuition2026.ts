export type UniversityType = "NATIONAL" | "PRIVATE";
export type MajorField = "HUMANITIES" | "SCIENCE" | "ENGINEERING" | "ARTS" | "MEDICINE";
export type TuitionPresetGroup = "OVERALL" | "TYPE" | "FIELD";

export interface TuitionPreset {
  id: string;
  label: string;
  annualTuition: number;
  group: TuitionPresetGroup;
}

// 2026학년도 4년제 대학 등록금 — 대학지성 In&Out·교수신문 교차 확인 (2026-07 기준)
export const TUITION_AVERAGE_2026 = 7_270_300; // 전체 평균
export const TUITION_NATIONAL_2026 = 4_250_000; // 국공립대 평균
export const TUITION_PRIVATE_2026 = 8_231_500; // 사립대 평균

export const TUITION_PRESETS: TuitionPreset[] = [
  { id: "overall", label: "전체 평균", annualTuition: TUITION_AVERAGE_2026, group: "OVERALL" },
  { id: "national", label: "국공립대 평균", annualTuition: TUITION_NATIONAL_2026, group: "TYPE" },
  { id: "private", label: "사립대 평균", annualTuition: TUITION_PRIVATE_2026, group: "TYPE" },
  { id: "humanities", label: "인문사회 계열", annualTuition: 6_433_700, group: "FIELD" },
  { id: "science", label: "자연과학 계열", annualTuition: 7_323_300, group: "FIELD" },
  { id: "engineering", label: "공학 계열", annualTuition: 7_677_400, group: "FIELD" },
  { id: "arts", label: "예체능 계열", annualTuition: 8_338_100, group: "FIELD" },
  { id: "medicine", label: "의학 계열", annualTuition: 10_325_900, group: "FIELD" },
];

// 등록금 인상·동결 추이 (최근 5년) — 2차 university-tuition-ranking-2026도 재사용 예정
export interface TuitionTrendRow {
  year: number;
  legalCapRate: number;
  raisedSchools: number;
}

export const TUITION_TREND_2022_2026: TuitionTrendRow[] = [
  { year: 2022, legalCapRate: 1.65, raisedSchools: 4 },
  { year: 2023, legalCapRate: 4.05, raisedSchools: 17 },
  { year: 2024, legalCapRate: 5.64, raisedSchools: 26 },
  { year: 2025, legalCapRate: 5.49, raisedSchools: 136 },
  { year: 2026, legalCapRate: 3.19, raisedSchools: 125 },
];

export const TUITION_META = {
  updatedAt: "2026학년도 기준 (2026-07 확인)",
  sourceNote: "대학지성 In&Out·교수신문 2026학년도 등록금 조사 결과",
};
