export type ResidenceType = "PARENTS" | "DORM" | "OFFCAMPUS";

export interface ResidencePreset {
  type: ResidenceType;
  label: string;
  monthlyHousingDefault: number; // 월세+관리비 또는 기숙사비
  monthlyLivingDefault: number; // 월세 제외 생활비 참고값
  note: string;
}

// 2026년 기준 — 서울 대학가 원룸 시세·기숙사 수용률/비용 조사 종합
// 2차 dorm-vs-commute-cost-comparison-2026도 재사용 예정
export const RESIDENCE_PRESETS: ResidencePreset[] = [
  {
    type: "PARENTS",
    label: "부모님 집",
    monthlyHousingDefault: 0,
    monthlyLivingDefault: 400_000,
    note: "주거비 없음, 식비·용돈 등 생활비만 발생(참고값)",
  },
  {
    type: "DORM",
    label: "기숙사",
    monthlyHousingDefault: 325_000,
    monthlyLivingDefault: 500_000,
    note: "2인실 기준 평균 기숙사비 월 32만 5천원. 전국 수용률 22.6%(수도권 18.2%)로 신청 경쟁 있음",
  },
  {
    type: "OFFCAMPUS",
    label: "자취",
    monthlyHousingDefault: 704_000,
    monthlyLivingDefault: 1_150_000,
    note: "서울 대학가 원룸 평균 월세 62만 2천원+관리비 8만 2천원 기준(2026-01). 생활비는 월 100만~130만원대 참고치",
  },
];

export const HOUSING_META = {
  updatedAt: "2026년 1월 기준",
  sourceNote: "대학가 원룸 시세 보도, 4년제 대학 기숙사 수용 현황 조사 종합",
};
