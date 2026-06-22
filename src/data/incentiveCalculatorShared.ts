// 근로장려금·자녀장려금 계산기 공유 타입/상수
// docs/design/202606/work-incentive-calculator-2026-design.md 참고

export type IncentiveHouseholdType = "single" | "single-earner" | "dual-earner";
export type ApplicationTimingId = "regular" | "late";
export type AssetTierId = "under-170m" | "170m-240m" | "over-240m";

export const INCENTIVE_HOUSEHOLD_TYPE_LABELS: Record<IncentiveHouseholdType, string> = {
  single: "단독가구",
  "single-earner": "홑벌이가구",
  "dual-earner": "맞벌이가구",
};

export const INCENTIVE_HOUSEHOLD_TYPE_DESCRIPTIONS: Record<IncentiveHouseholdType, string> = {
  single: "배우자, 18세 미만 부양자녀, 70세 이상 직계존속이 모두 없는 가구",
  "single-earner": "배우자(총급여 300만 원 미만) 또는 부양자녀 또는 70세 이상 직계존속이 있는 가구",
  "dual-earner": "신청인과 배우자 각각의 총급여가 300만 원 이상인 가구",
};

// 1.7억 이상이면 50% 감액, 2.4억 이상이면 신청 불가
export const INCENTIVE_ASSET_THRESHOLDS = {
  reductionStart: 170_000_000,
  eligibilityLimit: 240_000_000,
};

// 기한 후 신청(6/2~12/1)은 산정액의 95%만 지급 → 5% 감액
// ※ 재산 1.7억~2.4억 구간의 50% 감액과는 별도로 적용된다 (혼동 주의)
export const APPLICATION_TIMING_LABELS: Record<ApplicationTimingId, string> = {
  regular: "정기 신청",
  late: "기한 후 신청",
};

export const APPLICATION_TIMING_REDUCTION: Record<ApplicationTimingId, number> = {
  regular: 0,
  late: 0.05,
};

export const APPLICATION_TIMING_SCHEDULE = [
  { label: "반기 신청 (2025년 하반기분)", period: "2026.03.01 ~ 03.16" },
  { label: "정기 신청 (전액 지급)", period: "2026.05.01 ~ 06.01" },
  { label: "기한 후 신청 (95% 지급)", period: "2026.06.02 ~ 12.01" },
];
