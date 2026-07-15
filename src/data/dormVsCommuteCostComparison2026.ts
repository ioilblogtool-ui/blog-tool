import { RESIDENCE_PRESETS, type ResidenceType } from "./universityHousingCost2026";

export { RESIDENCE_PRESETS };

export type EnrollmentYears = 4 | 6;

export const DVC_META = {
  slug: "dorm-vs-commute-cost-comparison-2026",
  title: "기숙사 vs 자취 vs 통학 2026",
  seoTitle: "기숙사 vs 자취 vs 통학 2026 | 4년 총비용 한눈에 비교",
  seoDescription:
    "기숙사·자취·통학(부모님 집) 월 주거비·생활비를 입력하면 대학 4년 총비용과 통학 시간까지 한 번에 비교합니다. 거주 형태 선택 전 확인하세요.",
  updatedAt: "2026-07-15",
  dataNote:
    "거주 형태별 기본값은 2026년 서울 대학가 원룸 시세·전국 기숙사비 평균 기준이며, 실제 비용은 지역·학교별로 다를 수 있습니다. 등록금은 포함하지 않은 주거·생활비 전용 비교입니다.",
};

export interface DvcResidenceInput {
  type: ResidenceType;
  monthlyHousing: number;
  monthlyLiving: number;
}

export interface DvcResidenceResult extends DvcResidenceInput {
  monthlyTotal: number;
  total4y: number;
}

// public/scripts/dorm-vs-commute-cost-comparison-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcResidenceCost(input: DvcResidenceInput, years: EnrollmentYears): DvcResidenceResult {
  const monthlyTotal = input.monthlyHousing + input.monthlyLiving;
  const total4y = monthlyTotal * 12 * years;
  return { ...input, monthlyTotal, total4y };
}

export interface DvcCommuteInput {
  oneWayMinutes: number;
  schoolDaysPerYear: number;
}

export interface DvcCommuteResult {
  annualHours: number;
  totalHours: number;
}

export function calcCommuteTime(input: DvcCommuteInput, years: EnrollmentYears): DvcCommuteResult {
  const dailyMinutes = input.oneWayMinutes * 2;
  const annualMinutes = dailyMinutes * input.schoolDaysPerYear;
  const annualHours = annualMinutes / 60;
  return { annualHours, totalHours: annualHours * years };
}

export const DVC_DEFAULT_INPUT = {
  yearsEnrolled: 4 as EnrollmentYears,
  oneWayMinutes: 40,
  schoolDaysPerYear: 180, // 방학 제외 등교일 참고값(추정), 자유 조정 가능
  residences: RESIDENCE_PRESETS.map((p) => ({
    type: p.type,
    monthlyHousing: p.monthlyHousingDefault,
    monthlyLiving: p.monthlyLivingDefault,
  })),
};

export const DVC_FAQ = [
  {
    question: "기숙사가 자취보다 얼마나 저렴한가요?",
    answer:
      "2인실 기준 평균 기숙사비는 월 32만 5천 원으로 자취(월세+관리비 70만 4천 원)의 절반 이하입니다. 4년 기준으로는 수백만 원 이상 차이가 날 수 있습니다.",
  },
  {
    question: "통학이 항상 가장 저렴한가요?",
    answer:
      "주거비 자체는 통학이 가장 적게 듭니다. 다만 편도 통학시간이 길면 4년 동안 수백~1천 시간 이상을 통학에 쓰게 되므로, 비용만이 아니라 시간도 함께 고려해야 합니다.",
  },
  {
    question: "기숙사는 아무나 들어갈 수 있나요?",
    answer:
      "전국 기숙사 수용률은 22.6%(수도권은 18.2%)에 불과해 신청 경쟁이 있습니다. 성적·거주지 기준 등 학교별 선발 기준을 확인해야 합니다.",
  },
  {
    question: "통학시간은 어떻게 계산되나요?",
    answer:
      "편도 통학시간(분)에 왕복 2회, 연간 등교일수를 곱해 계산합니다. 방학 기간은 등교일수에서 제외한 참고값을 기본으로 제공하며 직접 조정할 수 있습니다.",
  },
  {
    question: "등록금도 이 계산에 포함되나요?",
    answer:
      "아닙니다. 이 페이지는 주거·생활비만 비교합니다. 등록금까지 포함한 4년 총비용은 대학 등록금 계산기에서 확인할 수 있습니다.",
  },
  {
    question: "자취 생활비는 왜 기숙사보다 높게 잡았나요?",
    answer:
      "기숙사는 학식·공동시설 이용으로 생활비가 상대적으로 낮게 형성되는 경향이 있어 참고값에 차이를 뒀습니다. 실제 지출은 개인차가 큽니다.",
  },
];

export const DVC_SEO_CONTENT = {
  introTitle: "기숙사·자취·통학, 돈과 시간을 같이 봐야 합니다",
  intro: [
    "대학 거주 형태를 정할 때 가장 먼저 보는 게 비용이지만, 통학을 선택하면 시간이라는 숨은 비용이 함께 따라옵니다. 2026년 서울 대학가 원룸 평균 월세는 62만 2,000원, 관리비 8만 2,000원으로 자취를 선택하면 월 70만 원이 주거비로만 나갑니다. 반면 부모님 집에서 통학하면 주거비는 0원이지만 편도 통학시간이 길어질수록 4년 동안 쓰는 시간이 수백~1천 시간 단위로 쌓입니다.",
    "이 계산기는 기숙사·자취·통학 세 가지 거주 형태를 동시에 놓고 월 주거비와 생활비를 더한 4년 총비용을 나란히 비교합니다. 기숙사는 2인실 기준 평균 월 32만 5,000원으로 자취의 절반 이하지만, 전국 수용률이 22.6%(수도권은 18.2%)에 불과해 원한다고 바로 들어갈 수 있는 선택지가 아닙니다. 통학의 경우 편도 통학시간과 방학을 제외한 연간 등교일수를 곱해 4년 누적 통학시간을 별도로 계산합니다.",
    "결과를 볼 때는 4년 총비용이 가장 낮은 카드만 보지 말고, 통학이라면 누적 통학시간이 얼마나 되는지 함께 확인하는 것이 중요합니다. 편도 1시간 통학을 4년간 매일 반복하면 왕복 2시간씩 연간 300시간 이상, 4년이면 1,000시간을 훌쩍 넘습니다. 비용은 아끼지만 그만큼의 시간을 학업이나 다른 활동에 쓰지 못한다는 뜻이므로, 단순 비용 비교보다 한 단계 더 들어간 판단이 필요합니다.",
    "이 계산기의 기본값은 2026년 서울 대학가 시세와 전국 기숙사 통계를 참고한 값이며, 실제 지역·학교·개인 소비 습관에 따라 크게 달라질 수 있습니다. 등록금은 포함하지 않은 주거·생활비 전용 비교이므로, 등록금까지 합산한 전체 4년 실부담금은 대학 등록금 계산기에서 별도로 확인해야 합니다.",
  ],
  inputPoints: [
    "기숙사·자취·통학 세 카드의 월 주거비·생활비를 동시에 입력해 4년 총비용을 나란히 비교할 수 있습니다.",
    "편도 통학시간과 연간 등교일수를 입력하면 통학 선택 시 4년 누적 통학시간을 확인할 수 있습니다.",
    "가장 저렴한 거주 형태 카드에 자동으로 '최저 비용' 배지가 표시됩니다.",
  ],
  criteria: [
    "거주 형태별 기본값은 2026년 서울 대학가 원룸 시세·전국 기숙사비 평균 기준입니다.",
    "등록금은 포함하지 않으며 주거·생활비만 비교합니다.",
    "연간 등교일수(기본 180일)는 방학을 제외한 참고값으로 자유롭게 조정할 수 있습니다.",
    "통학시간은 이동시간만 반영하며 교통비는 별도로 고려해야 합니다.",
  ],
};

export const DVC_RELATED_LINKS = [
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "등록금까지 포함한 대학 4년 실부담금을 계산합니다.",
  },
  {
    href: "/reports/university-tuition-ranking-2026/",
    label: "대학 등록금 순위 2026",
    description: "설립유형·계열별 등록금과 상위 대학 예시를 비교합니다.",
  },
  {
    href: "/reports/single-household-living-cost-2026/",
    label: "1인 가구 생활비 리포트",
    description: "자취 생활비 항목별 평균을 더 자세히 확인합니다.",
  },
];

export const DVC_CONFIG = {
  residencePresets: RESIDENCE_PRESETS,
  defaultInput: DVC_DEFAULT_INPUT,
};
