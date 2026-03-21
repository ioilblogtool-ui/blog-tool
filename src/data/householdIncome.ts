export type HouseholdSizeCode = "1" | "2" | "3" | "4" | "5_PLUS";
export type TargetYear = "2026";
export type DeductionPresetCode = "NONE" | "SIMPLE" | "FAMILY";

export interface HouseholdSizeOption {
  code: HouseholdSizeCode;
  label: string;
  medianMonthlyIncome: number;
  note: string;
}

export interface DeductionPreset {
  code: DeductionPresetCode;
  label: string;
  description: string;
  baseDeduction: number;
  dependentDeduction: number;
}

export const yearOptions: Array<{ code: TargetYear; label: string }> = [
  { code: "2026", label: "2026" }
];

export const householdSizeOptions: HouseholdSizeOption[] = [
  { code: "1", label: "1인", medianMonthlyIncome: 2564238, note: "2026 기준 중위소득 월 기준" },
  { code: "2", label: "2인", medianMonthlyIncome: 4199292, note: "2026 기준 중위소득 월 기준" },
  { code: "3", label: "3인", medianMonthlyIncome: 5359036, note: "2026 기준 중위소득 월 기준" },
  { code: "4", label: "4인", medianMonthlyIncome: 6494738, note: "2026 기준 중위소득 월 기준" },
  { code: "5_PLUS", label: "5인 이상", medianMonthlyIncome: 6494738, note: "5인 이상은 4인 기준 비교선으로 단순 표시" }
];

export const deductionPresets: DeductionPreset[] = [
  { code: "NONE", label: "단순", description: "공제 효과를 거의 반영하지 않는 단순 추정입니다.", baseDeduction: 0, dependentDeduction: 0 },
  { code: "SIMPLE", label: "기본", description: "기본공제와 부양가족 수를 단순 반영합니다.", baseDeduction: 1500000, dependentDeduction: 1000000 },
  { code: "FAMILY", label: "가족 고려", description: "가족 공제 효과를 조금 더 반영한 참고 추정입니다.", baseDeduction: 2500000, dependentDeduction: 1500000 }
];

export const factAnchors = [
  { label: "2024 평균 가구소득", value: "7,427만 원", note: "연간 명목 기준" },
  { label: "2024 평균 처분가능소득", value: "6,032만 원", note: "연간 기준" },
  { label: "2026 1인 기준 중위소득", value: "256만 원", note: "월 기준" },
  { label: "2026 4인 기준 중위소득", value: "649만 원", note: "월 기준" }
];

export const ratioCards = [
  { code: "AVERAGE", label: "평균 가구소득 대비", note: "세전 연 기준 비교선" },
  { code: "MEDIAN", label: "기준 중위소득 대비", note: "가구원 수별 월 기준 비교선" },
  { code: "DISPOSABLE", label: "평균 처분가능소득 대비", note: "추정 실수령 연 기준 비교선" }
];

export const incomeBands = [
  { label: "5천만 원 미만", min: 0, max: 50000000, note: "세전 총소득 기준" },
  { label: "5천만~8천만 원", min: 50000000, max: 80000000, note: "세전 총소득 기준" },
  { label: "8천만~1억 2천만 원", min: 80000000, max: 120000000, note: "세전 총소득 기준" },
  { label: "1억 2천만 원 이상", min: 120000000, max: Number.POSITIVE_INFINITY, note: "세전 총소득 기준" }
];

export const relatedLinks = [
  { href: "/tools/salary/", label: "연봉 인상 계산기" },
  { href: "/tools/negotiation/", label: "이직 계산기" },
  { href: "/tools/bonus-simulator/", label: "대기업 성과급 시뮬레이터" }
];

export const helperText = {
  spouse: "배우자 소득이 없으면 0으로 두고 계산하면 됩니다.",
  otherComp: "기타 연 보상에는 프리랜서 수입, 임대수입, 기타 보너스를 함께 넣을 수 있습니다.",
  estimate: "실수령 추정은 세금, 공제, 가족 구성, 비과세 항목에 따라 달라질 수 있습니다."
};

export const averageHouseholdIncome = 74270000;
export const averageDisposableIncome = 60320000;
