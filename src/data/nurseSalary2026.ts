// ============================================================
// 간호사 연차별 연봉 + 병원 규모별 비교 2026
// 채용공고·병원 공시·협회 자료·현직자 제보를 종합한 범위형 데이터
// 모든 금액은 범위형/추정치이며 병원·부서·교대 여부에 따라 달라질 수 있음
// ============================================================

export type SalaryBand = {
  annualGross: [number, number];
  monthlyNetEstimate: [number, number];
  note?: string;
};

export type NurseYearPoint = {
  year: number;
  label: string;
  gradeLabel: string;
  salary: SalaryBand;
  highlight?: boolean;
};

export type NurseHospitalType = {
  id: string;
  name: string;
  shortName: string;
  category: "hospital" | "public";
  badge: string;
  examples: string[];
  description: string;
  entryRange: [number, number];
  year20Range: [number, number];
  yearlyProgression: NurseYearPoint[];
  allowanceNotes: string[];
  workLifeBalanceScore: number;
  growthScore: number;
  turnoverRiskLabel: string;
  tags: string[];
  isEstimated: true;
};

export type NurseAllowanceItem = {
  name: string;
  amount: string;
  basis: string;
  note?: string;
};

export type NurseAllowanceGroup = {
  id: "fixed" | "special" | "annual";
  name: string;
  items: NurseAllowanceItem[];
};

export type NurseCareerStage = {
  stage: string;
  typicalYears: string;
  titleExamples: string[];
  note: string;
};

export type NurseBalanceMetric = {
  id: string;
  label: string;
  score: number;
};

export type NurseFAQ = {
  q: string;
  a: string;
};

function makeYearPoint(
  year: number,
  label: string,
  annualGross: [number, number],
  monthlyNetEstimate: [number, number],
  gradeLabel: string,
  note?: string,
  highlight = false,
): NurseYearPoint {
  return {
    year,
    label,
    gradeLabel,
    salary: { annualGross, monthlyNetEstimate, note },
    highlight,
  };
}

export const NURSE_HOSPITAL_TYPES: NurseHospitalType[] = [
  {
    id: "big5",
    name: "빅5 상급종합병원",
    shortName: "빅5",
    category: "hospital",
    badge: "초봉 강세",
    examples: ["서울아산", "세브란스", "삼성서울", "서울성모", "서울대병원"],
    description: "신규 간호사 초봉과 브랜드 경쟁력이 가장 강한 구간입니다. 대신 업무강도와 경쟁 압박도 높은 편입니다.",
    entryRange: [48_000_000, 65_000_000],
    year20Range: [85_000_000, 120_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [48_000_000, 65_000_000], [3_300_000, 4_400_000], "신규간호사", "나이트·성과급 포함 범위"),
      makeYearPoint(1, "1년차", [50_000_000, 68_000_000], [3_450_000, 4_600_000], "일반간호사"),
      makeYearPoint(3, "3년차", [56_000_000, 75_000_000], [3_850_000, 5_100_000], "일반간호사"),
      makeYearPoint(5, "5년차", [62_000_000, 85_000_000], [4_200_000, 5_800_000], "주임간호사 예시", "이직/전과 분기점", true),
      makeYearPoint(7, "7년차", [68_000_000, 92_000_000], [4_550_000, 6_250_000], "책임간호사 예시"),
      makeYearPoint(10, "10년차", [74_000_000, 102_000_000], [4_900_000, 6_900_000], "책임간호사 예시"),
      makeYearPoint(15, "15년차", [80_000_000, 112_000_000], [5_200_000, 7_500_000], "수간호사 예시"),
      makeYearPoint(20, "20년차", [85_000_000, 120_000_000], [5_500_000, 8_100_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "성과급 비중이 크고 병원별 편차가 큼",
      "나이트·특수파트 수당이 실수령에 크게 반영됨",
      "교육·브랜드 강점이 있지만 업무강도 높음",
    ],
    workLifeBalanceScore: 2,
    growthScore: 5,
    turnoverRiskLabel: "보통",
    tags: ["초봉 강세", "브랜드 강점", "업무강도 높음"],
    isEstimated: true,
  },
  {
    id: "capital-univ",
    name: "수도권 대학병원",
    shortName: "수도권 대학",
    category: "hospital",
    badge: "안정적 성장",
    examples: ["한양대병원", "이대목동", "경희의료원", "건국대병원"],
    description: "빅5보다는 낮지만 초봉과 성장성의 균형이 좋은 편입니다. 교육 체계가 비교적 안정적입니다.",
    entryRange: [43_000_000, 58_000_000],
    year20Range: [75_000_000, 100_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [43_000_000, 58_000_000], [3_000_000, 4_000_000], "신규간호사"),
      makeYearPoint(1, "1년차", [45_000_000, 60_000_000], [3_150_000, 4_150_000], "일반간호사"),
      makeYearPoint(3, "3년차", [50_000_000, 67_000_000], [3_500_000, 4_650_000], "일반간호사"),
      makeYearPoint(5, "5년차", [55_000_000, 74_000_000], [3_850_000, 5_100_000], "주임간호사 예시", "중간연차 이직 구간", true),
      makeYearPoint(7, "7년차", [60_000_000, 80_000_000], [4_100_000, 5_500_000], "책임간호사 예시"),
      makeYearPoint(10, "10년차", [65_000_000, 87_000_000], [4_400_000, 5_950_000], "책임간호사 예시"),
      makeYearPoint(15, "15년차", [70_000_000, 95_000_000], [4_700_000, 6_500_000], "수간호사 예시"),
      makeYearPoint(20, "20년차", [75_000_000, 100_000_000], [5_000_000, 6_900_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "교육 체계가 비교적 안정적",
      "성과급·복지포인트는 병원별 차이",
      "빅5 대비 초봉은 낮지만 장기 성장성은 준수",
    ],
    workLifeBalanceScore: 3,
    growthScore: 4,
    turnoverRiskLabel: "보통",
    tags: ["안정적 성장", "교육 체계", "균형형"],
    isEstimated: true,
  },
  {
    id: "general",
    name: "종합병원",
    shortName: "종합병원",
    category: "hospital",
    badge: "균형형",
    examples: ["지역 거점 종합병원", "민간 중견 종합병원"],
    description: "초봉과 성장폭이 중간 수준인 대표 구간입니다. 병원 규모에 따라 체감 편차가 큽니다.",
    entryRange: [38_000_000, 52_000_000],
    year20Range: [62_000_000, 85_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [38_000_000, 52_000_000], [2_700_000, 3_650_000], "신규간호사"),
      makeYearPoint(1, "1년차", [40_000_000, 54_000_000], [2_850_000, 3_800_000], "일반간호사"),
      makeYearPoint(3, "3년차", [44_000_000, 60_000_000], [3_100_000, 4_200_000], "일반간호사"),
      makeYearPoint(5, "5년차", [48_000_000, 66_000_000], [3_350_000, 4_650_000], "주임간호사 예시", "성과급 포함 여부 차이", true),
      makeYearPoint(7, "7년차", [52_000_000, 71_000_000], [3_600_000, 5_000_000], "책임간호사 예시"),
      makeYearPoint(10, "10년차", [56_000_000, 76_000_000], [3_850_000, 5_350_000], "책임간호사 예시"),
      makeYearPoint(15, "15년차", [60_000_000, 82_000_000], [4_100_000, 5_850_000], "수간호사 예시"),
      makeYearPoint(20, "20년차", [62_000_000, 85_000_000], [4_250_000, 6_100_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "병원 규모에 따라 성과급 편차 큼",
      "특수파트 이동 시 실수령 차이 확대",
      "장기 성장성은 빅5·대학병원보다 낮을 수 있음",
    ],
    workLifeBalanceScore: 3,
    growthScore: 3,
    turnoverRiskLabel: "보통",
    tags: ["균형형", "병원별 편차", "중간 성장"],
    isEstimated: true,
  },
  {
    id: "local-small",
    name: "중소·일반병원",
    shortName: "중소병원",
    category: "hospital",
    badge: "진입 장벽 낮음",
    examples: ["지역 일반병원", "중소 병원급 의료기관"],
    description: "초봉과 성장폭 모두 하향 안정화되는 경우가 많습니다. 대신 입직 문턱은 상대적으로 낮습니다.",
    entryRange: [30_000_000, 42_000_000],
    year20Range: [45_000_000, 62_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [30_000_000, 42_000_000], [2_200_000, 3_050_000], "신규간호사"),
      makeYearPoint(1, "1년차", [31_000_000, 43_500_000], [2_250_000, 3_150_000], "일반간호사"),
      makeYearPoint(3, "3년차", [34_000_000, 47_000_000], [2_450_000, 3_400_000], "일반간호사"),
      makeYearPoint(5, "5년차", [37_000_000, 50_000_000], [2_650_000, 3_650_000], "주임간호사 예시", "상승 제한 가능성", true),
      makeYearPoint(7, "7년차", [39_000_000, 53_000_000], [2_800_000, 3_850_000], "책임간호사 예시"),
      makeYearPoint(10, "10년차", [41_000_000, 56_000_000], [2_950_000, 4_100_000], "책임간호사 예시"),
      makeYearPoint(15, "15년차", [43_000_000, 60_000_000], [3_050_000, 4_350_000], "수간호사 예시"),
      makeYearPoint(20, "20년차", [45_000_000, 62_000_000], [3_150_000, 4_550_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "초봉·성과급이 병원별로 크게 다름",
      "장기근속 상승폭이 제한될 수 있음",
      "병원 규모가 작을수록 이직률이 높아질 수 있음",
    ],
    workLifeBalanceScore: 2,
    growthScore: 2,
    turnoverRiskLabel: "높음",
    tags: ["진입 장벽 낮음", "상승 제한", "이직률 높음"],
    isEstimated: true,
  },
  {
    id: "public-health",
    name: "보건소·공공기관",
    shortName: "공공기관형",
    category: "public",
    badge: "워라밸 강점",
    examples: ["보건소", "지방의료원 일부", "공공기관형 간호직"],
    description: "병원형과 다르게 워라밸·안정성이 핵심 강점입니다. 초봉은 낮을 수 있지만 야간근무 부담이 적습니다.",
    entryRange: [33_000_000, 46_000_000],
    year20Range: [55_000_000, 78_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [33_000_000, 46_000_000], [2_350_000, 3_300_000], "간호직 예시"),
      makeYearPoint(1, "1년차", [34_500_000, 47_500_000], [2_450_000, 3_400_000], "간호직 예시"),
      makeYearPoint(3, "3년차", [38_000_000, 52_000_000], [2_700_000, 3_700_000], "간호직 예시"),
      makeYearPoint(5, "5년차", [42_000_000, 56_000_000], [2_950_000, 4_000_000], "주임급 예시", "야간 부담 적음", true),
      makeYearPoint(7, "7년차", [45_000_000, 60_000_000], [3_100_000, 4_250_000], "주임급 예시"),
      makeYearPoint(10, "10년차", [49_000_000, 66_000_000], [3_350_000, 4_650_000], "관리급 예시"),
      makeYearPoint(15, "15년차", [52_000_000, 72_000_000], [3_600_000, 5_050_000], "관리급 예시"),
      makeYearPoint(20, "20년차", [55_000_000, 78_000_000], [3_800_000, 5_450_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "야간·교대 부담이 낮은 편",
      "연봉보다 워라밸·안정성 강점",
      "기관 유형별 호봉/수당 구조 차이 존재",
    ],
    workLifeBalanceScore: 5,
    growthScore: 3,
    turnoverRiskLabel: "낮음",
    tags: ["워라밸 강점", "안정성", "공공형"],
    isEstimated: true,
  },
  {
    id: "rehab-care",
    name: "요양·재활병원",
    shortName: "요양·재활",
    category: "hospital",
    badge: "근무강도 편차",
    examples: ["재활병원", "요양병원", "회복기 병원"],
    description: "병원별 근무강도와 야간 구조 차이가 큽니다. 일반 급여는 중소병원과 비슷하거나 조금 높은 수준에서 형성됩니다.",
    entryRange: [32_000_000, 45_000_000],
    year20Range: [48_000_000, 68_000_000],
    yearlyProgression: [
      makeYearPoint(0, "신입", [32_000_000, 45_000_000], [2_300_000, 3_250_000], "신규간호사"),
      makeYearPoint(1, "1년차", [33_500_000, 46_500_000], [2_400_000, 3_350_000], "일반간호사"),
      makeYearPoint(3, "3년차", [36_500_000, 50_000_000], [2_600_000, 3_650_000], "일반간호사"),
      makeYearPoint(5, "5년차", [40_000_000, 55_000_000], [2_850_000, 4_000_000], "주임간호사 예시", "병동 운영 구조 차이", true),
      makeYearPoint(7, "7년차", [43_000_000, 58_000_000], [3_050_000, 4_250_000], "책임간호사 예시"),
      makeYearPoint(10, "10년차", [45_000_000, 62_000_000], [3_250_000, 4_600_000], "책임간호사 예시"),
      makeYearPoint(15, "15년차", [47_000_000, 66_000_000], [3_400_000, 4_900_000], "수간호사 예시"),
      makeYearPoint(20, "20년차", [48_000_000, 68_000_000], [3_500_000, 5_100_000], "관리자급 예시"),
    ],
    allowanceNotes: [
      "근무강도와 워라밸이 병원별로 크게 다름",
      "재활·회복기 중심 병원은 업무강도 차이 큼",
      "성과급 구조는 상대적으로 단순한 경우가 많음",
    ],
    workLifeBalanceScore: 3,
    growthScore: 2,
    turnoverRiskLabel: "보통",
    tags: ["근무강도 편차", "부서 차이", "중간형"],
    isEstimated: true,
  },
];

export const NURSE_ALLOWANCE_GROUPS: NurseAllowanceGroup[] = [
  {
    id: "fixed",
    name: "고정 수당",
    items: [
      {
        name: "나이트수당",
        amount: "월 10~40만 원",
        basis: "채용공고·현직자 제보 기반",
        note: "월 나이트 횟수에 따라 차이",
      },
      {
        name: "식대 / 복지포인트",
        amount: "병원별 차등",
        basis: "병원 공시·복지안내 기반",
      },
      {
        name: "교대근무수당",
        amount: "병원별 상이",
        basis: "현직자 제보·채용공고 기반",
      },
    ],
  },
  {
    id: "special",
    name: "특수 파트 수당",
    items: [
      {
        name: "ICU / ER / OR 수당",
        amount: "월 10~30만 원",
        basis: "현직자 제보 기반",
        note: "병원별 지급 여부 차이",
      },
      {
        name: "중환자·응급실 야간 가산",
        amount: "추가 지급 가능",
        basis: "부서 운영 기준 상이",
      },
      {
        name: "프리셉터 / 교육 수당",
        amount: "병원별 상이",
        basis: "병원 내부 제도 기준",
      },
    ],
  },
  {
    id: "annual",
    name: "연간 특별 지급",
    items: [
      {
        name: "성과급 / 상여금",
        amount: "연 0~3,000만 원+",
        basis: "병원 공시·현직자 제보 기반",
        note: "병원 성격·실적에 따라 편차 큼",
      },
      {
        name: "의료비 감면",
        amount: "복지 혜택 차등",
        basis: "복지 안내 기준",
      },
      {
        name: "명절 / 격려금",
        amount: "병원별 차등",
        basis: "병원 내부 복지 기준",
      },
    ],
  },
];

export const NURSE_CAREER_STAGES: NurseCareerStage[] = [
  {
    stage: "신규간호사",
    typicalYears: "0~2년",
    titleExamples: ["일반간호사"],
    note: "프리셉터 적응기, 이직 고민이 가장 큰 구간",
  },
  {
    stage: "중간연차 간호사",
    typicalYears: "3~5년",
    titleExamples: ["일반간호사", "주임간호사 예시"],
    note: "이직·전과·전문파트 이동 분기점",
  },
  {
    stage: "책임 역할 진입",
    typicalYears: "6~10년",
    titleExamples: ["책임간호사 예시"],
    note: "병원별 승진 명칭과 속도 차이 큼",
  },
  {
    stage: "관리자급",
    typicalYears: "10년+",
    titleExamples: ["수간호사 예시", "파트장 예시"],
    note: "학위·평가·공석·조직 구조에 따라 차이",
  },
];

export const NURSE_WORK_LIFE_TABLE: Array<{
  id: string;
  name: string;
  metrics: NurseBalanceMetric[];
}> = [
  {
    id: "big5",
    name: "빅5",
    metrics: [
      { id: "balance", label: "워라밸", score: 2 },
      { id: "growth", label: "성장성", score: 5 },
      { id: "intensity", label: "업무강도", score: 5 },
      { id: "mobility", label: "이직유연성", score: 4 },
    ],
  },
  {
    id: "capital-univ",
    name: "수도권 대학",
    metrics: [
      { id: "balance", label: "워라밸", score: 3 },
      { id: "growth", label: "성장성", score: 4 },
      { id: "intensity", label: "업무강도", score: 4 },
      { id: "mobility", label: "이직유연성", score: 4 },
    ],
  },
  {
    id: "general",
    name: "종합병원",
    metrics: [
      { id: "balance", label: "워라밸", score: 3 },
      { id: "growth", label: "성장성", score: 3 },
      { id: "intensity", label: "업무강도", score: 4 },
      { id: "mobility", label: "이직유연성", score: 3 },
    ],
  },
  {
    id: "local-small",
    name: "중소병원",
    metrics: [
      { id: "balance", label: "워라밸", score: 2 },
      { id: "growth", label: "성장성", score: 2 },
      { id: "intensity", label: "업무강도", score: 3 },
      { id: "mobility", label: "이직유연성", score: 4 },
    ],
  },
  {
    id: "public-health",
    name: "공공기관형",
    metrics: [
      { id: "balance", label: "워라밸", score: 5 },
      { id: "growth", label: "성장성", score: 3 },
      { id: "intensity", label: "업무강도", score: 2 },
      { id: "mobility", label: "이직유연성", score: 2 },
    ],
  },
  {
    id: "rehab-care",
    name: "요양·재활",
    metrics: [
      { id: "balance", label: "워라밸", score: 3 },
      { id: "growth", label: "성장성", score: 2 },
      { id: "intensity", label: "업무강도", score: 3 },
      { id: "mobility", label: "이직유연성", score: 3 },
    ],
  },
];

export const NURSE_HERO_STATS = {
  categories: 6,
  yearRange: "신입~20년차",
  maxGapLabel: "최대 2배 이상 차이 가능",
  turnoverInsight: "병원 규모별 이직률 차이 존재",
} as const;

export const NURSE_FAQ: NurseFAQ[] = [
  {
    q: "신규간호사 연봉은 어느 정도인가요?",
    a: "병원 유형에 따라 차이가 큽니다. 2026년 기준 비교계산소 범위형 데이터에서는 중소병원은 연 3,000만~4,200만 원, 수도권 대학병원은 연 4,300만~5,800만 원, 빅5 상급종합병원은 연 4,800만~6,500만 원 수준으로 추정했습니다.",
  },
  {
    q: "빅5 간호사 연봉이 정말 가장 높은가요?",
    a: "초봉과 브랜드 경쟁력에서는 대체로 가장 강한 편입니다. 다만 장기적으로는 병원별 성과급, 부서, 직급, 이직 여부에 따라 체감 연봉이 달라질 수 있어 무조건 절대 우위로 보기는 어렵습니다.",
  },
  {
    q: "대학병원과 종합병원 간호사 연봉 차이는 얼마나 나나요?",
    a: "신입 기준으로는 연 500만~1,000만 원 이상 차이가 날 수 있고, 5년차 이후에는 성과급과 나이트 구조 차이까지 겹치면서 격차가 더 커질 수 있습니다. 정확한 차이는 병원별 보상 구조에 따라 다릅니다.",
  },
  {
    q: "나이트수당이 실수령에 얼마나 영향을 주나요?",
    a: "간호사 월 실수령에서 가장 체감이 큰 변수 중 하나입니다. 월 나이트 횟수와 병원별 교대수당 구조에 따라 수십만 원 이상 차이가 날 수 있어, 연봉 총액만 보는 것보다 실수령 월급을 함께 확인해야 합니다.",
  },
  {
    q: "보건소 간호사는 연봉보다 워라밸이 좋은 편인가요?",
    a: "대체로 그렇습니다. 공공기관형 간호직은 병원형 대비 야간·교대 부담이 낮아 워라밸과 안정성이 강점으로 평가됩니다. 대신 초봉이나 성과급 구조는 병원형보다 약할 수 있습니다.",
  },
];

export const NS_META = {
  title: "간호사 연차별 연봉 + 병원 규모별 비교 2026 | 비교계산소",
  description:
    "2026년 간호사 연차별 연봉, 병원 유형별 연봉 차이, 나이트수당과 특수파트 수당까지 한눈에 비교합니다. 신입부터 20년차까지 범위형 데이터로 정리했습니다.",
  updatedAt: "2026-04-10",
} as const;
