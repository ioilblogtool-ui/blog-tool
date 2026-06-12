// ============================================================
// 교사 호봉 실수령액 계산기
// 기본급/세후 추정 데이터는 teacherSalary2026 리포트와 동일한
// 2026년 인사혁신처 교원 봉급표 기준을 재사용한다.
// ============================================================

export interface TeacherCalcStep {
  step: number;
  monthlyBase: number;
  annualGross: number;
  monthlyNetEstimate: number;
}

export interface TeacherCalcInput {
  step: number;
  classTeacher: boolean;
  position: boolean;
  specialEducation: boolean;
  careerUnder5: boolean;
}

export interface TeacherCalcPreset {
  id: string;
  label: string;
  description: string;
  input: Partial<TeacherCalcInput>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const TSC_META = {
  title: "교사 호봉 실수령액 계산기",
  seoTitle: "교사 호봉 계산기 - 초등·중등 교사 월급·실수령액 2026",
  seoDescription:
    "내 호봉, 담임·보직 여부를 입력하면 2026년 교원 봉급표 기준 월급과 세후 실수령액, 연봉을 바로 계산합니다. 초등·중학교·고등학교 교사 모두 같은 호봉표를 사용합니다.",
  dataNote:
    "기본급은 인사혁신처 2026년 「유치원·초등학교·중학교·고등학교 교원 등의 봉급표」 기준입니다. 세후 실수령액은 미혼·부양가족 없음 기준 추정치이며, 실제 공제 금액은 개인 조건에 따라 달라질 수 있습니다.",
};

// ─── 호봉표 (1~40호봉) — teacherSalary2026.ts TEACHER_STEPS와 동일 ───
export const TSC_STEPS: TeacherCalcStep[] = [
  { step: 1, monthlyBase: 2_041_500, annualGross: 24_498_000, monthlyNetEstimate: 1_830_000 },
  { step: 2, monthlyBase: 2_068_600, annualGross: 24_823_200, monthlyNetEstimate: 1_855_000 },
  { step: 3, monthlyBase: 2_096_400, annualGross: 25_156_800, monthlyNetEstimate: 1_880_000 },
  { step: 4, monthlyBase: 2_181_000, annualGross: 26_172_000, monthlyNetEstimate: 1_955_000 },
  { step: 5, monthlyBase: 2_291_500, annualGross: 27_498_000, monthlyNetEstimate: 2_055_000 },
  { step: 6, monthlyBase: 2_346_300, annualGross: 28_155_600, monthlyNetEstimate: 2_100_000 },
  { step: 7, monthlyBase: 2_401_900, annualGross: 28_822_800, monthlyNetEstimate: 2_150_000 },
  { step: 8, monthlyBase: 2_447_900, annualGross: 29_374_800, monthlyNetEstimate: 2_195_000 },
  { step: 9, monthlyBase: 2_495_600, annualGross: 29_947_200, monthlyNetEstimate: 2_235_000 },
  { step: 10, monthlyBase: 2_516_700, annualGross: 30_200_400, monthlyNetEstimate: 2_255_000 },
  { step: 11, monthlyBase: 2_580_000, annualGross: 30_960_000, monthlyNetEstimate: 2_310_000 },
  { step: 12, monthlyBase: 2_650_000, annualGross: 31_800_000, monthlyNetEstimate: 2_370_000 },
  { step: 13, monthlyBase: 2_720_000, annualGross: 32_640_000, monthlyNetEstimate: 2_435_000 },
  { step: 14, monthlyBase: 2_805_000, annualGross: 33_660_000, monthlyNetEstimate: 2_510_000 },
  { step: 15, monthlyBase: 2_889_700, annualGross: 34_676_400, monthlyNetEstimate: 2_585_000 },
  { step: 16, monthlyBase: 2_978_000, annualGross: 35_736_000, monthlyNetEstimate: 2_660_000 },
  { step: 17, monthlyBase: 3_068_000, annualGross: 36_816_000, monthlyNetEstimate: 2_740_000 },
  { step: 18, monthlyBase: 3_161_000, annualGross: 37_932_000, monthlyNetEstimate: 2_820_000 },
  { step: 19, monthlyBase: 3_257_000, annualGross: 39_084_000, monthlyNetEstimate: 2_905_000 },
  { step: 20, monthlyBase: 3_481_000, annualGross: 41_772_000, monthlyNetEstimate: 3_105_000 },
  { step: 21, monthlyBase: 3_600_700, annualGross: 43_208_400, monthlyNetEstimate: 3_205_000 },
  { step: 22, monthlyBase: 3_730_000, annualGross: 44_760_000, monthlyNetEstimate: 3_315_000 },
  { step: 23, monthlyBase: 3_860_000, annualGross: 46_320_000, monthlyNetEstimate: 3_425_000 },
  { step: 24, monthlyBase: 3_994_000, annualGross: 47_928_000, monthlyNetEstimate: 3_540_000 },
  { step: 25, monthlyBase: 4_129_400, annualGross: 49_552_800, monthlyNetEstimate: 3_655_000 },
  { step: 26, monthlyBase: 4_268_000, annualGross: 51_216_000, monthlyNetEstimate: 3_770_000 },
  { step: 27, monthlyBase: 4_410_000, annualGross: 52_920_000, monthlyNetEstimate: 3_890_000 },
  { step: 28, monthlyBase: 4_545_000, annualGross: 54_540_000, monthlyNetEstimate: 4_005_000 },
  { step: 29, monthlyBase: 4_682_100, annualGross: 56_185_200, monthlyNetEstimate: 4_120_000 },
  { step: 30, monthlyBase: 4_826_800, annualGross: 57_921_600, monthlyNetEstimate: 4_240_000 },
  { step: 31, monthlyBase: 4_974_000, annualGross: 59_688_000, monthlyNetEstimate: 4_365_000 },
  { step: 32, monthlyBase: 5_118_000, annualGross: 61_416_000, monthlyNetEstimate: 4_480_000 },
  { step: 33, monthlyBase: 5_265_000, annualGross: 63_180_000, monthlyNetEstimate: 4_600_000 },
  { step: 34, monthlyBase: 5_410_000, annualGross: 64_920_000, monthlyNetEstimate: 4_715_000 },
  { step: 35, monthlyBase: 5_553_600, annualGross: 66_643_200, monthlyNetEstimate: 4_830_000 },
  { step: 36, monthlyBase: 5_696_000, annualGross: 68_352_000, monthlyNetEstimate: 4_945_000 },
  { step: 37, monthlyBase: 5_839_000, annualGross: 70_068_000, monthlyNetEstimate: 5_060_000 },
  { step: 38, monthlyBase: 5_980_000, annualGross: 71_760_000, monthlyNetEstimate: 5_170_000 },
  { step: 39, monthlyBase: 6_093_000, annualGross: 73_116_000, monthlyNetEstimate: 5_265_000 },
  { step: 40, monthlyBase: 6_205_700, annualGross: 74_468_400, monthlyNetEstimate: 5_355_000 },
];

// ─── 수당 (공무원수당규정 기준, 월 금액) ───
export const TSC_ALLOWANCES = {
  dutyAllowance: 250_000, // 교직수당 (전 교사 공통)
  mealAllowance: 160_000, // 정액급식비
  researchAllowanceJunior: 70_000, // 교원연구비 (경력 5년 미만)
  researchAllowanceSenior: 60_000, // 교원연구비 (경력 5년 이상)
  classTeacherAllowance: 200_000, // 담임수당
  positionAllowance: 150_000, // 보직수당 (교무·연구·학생부장 등)
  specialEducationAllowance: 120_000, // 특수교사 수당
  holidayBonusRate: 0.6, // 명절휴가비 = 본봉 × 0.6 × 2회
};

export const TSC_DEFAULT_INPUT: TeacherCalcInput = {
  step: 9,
  classTeacher: true,
  position: false,
  specialEducation: false,
  careerUnder5: true,
};

export const TSC_PRESETS: TeacherCalcPreset[] = [
  {
    id: "new-elementary",
    label: "신입 초등교사 (9호봉)",
    description: "교대 졸업 후 첫 발령, 담임 배정 기준",
    input: { step: 9, classTeacher: true, position: false, specialEducation: false, careerUnder5: true },
  },
  {
    id: "new-secondary",
    label: "신입 중·고 교사 (9호봉)",
    description: "사범대 졸업 후 첫 발령, 비담임 기준",
    input: { step: 9, classTeacher: false, position: false, specialEducation: false, careerUnder5: true },
  },
  {
    id: "mid-career",
    label: "10년차 교사 (19호봉)",
    description: "매년 1호봉 승급 가정, 담임 포함",
    input: { step: 19, classTeacher: true, position: false, specialEducation: false, careerUnder5: false },
  },
  {
    id: "head-teacher",
    label: "부장교사 (21호봉)",
    description: "보직(부장) 수당 포함 기준",
    input: { step: 21, classTeacher: false, position: true, specialEducation: false, careerUnder5: false },
  },
  {
    id: "senior-teacher",
    label: "30호봉 교사",
    description: "20년 이상 재직, 담임 미포함 기준",
    input: { step: 30, classTeacher: false, position: false, specialEducation: false, careerUnder5: false },
  },
  {
    id: "fixed-term",
    label: "기간제교사 (8호봉)",
    description: "경력 인정 없이 시작하는 경우 기준",
    input: { step: 8, classTeacher: true, position: false, specialEducation: false, careerUnder5: true },
  },
];

export const TSC_FAQ: FaqItem[] = [
  {
    question: "초등교사와 고등학교 교사 호봉 계산 방식이 다른가요?",
    answer:
      "아닙니다. 인사혁신처 「교원 봉급표」는 초·중·고 구분 없이 단일 표를 적용합니다. 같은 호봉이면 기본급은 완전히 동일하며, 담임·보직 수당 차이만 실수령액에 반영됩니다.",
  },
  {
    question: "임용 첫 해 9호봉 기준 실수령액은 얼마인가요?",
    answer:
      "9호봉 기본급 2,495,600원에 교직수당 25만원, 정액급식비 16만원, 교원연구비 7만원(경력 5년 미만), 담임수당 20만원(담임 시)을 더하면 월 합계는 약 305만원 내외이며, 세후 실수령은 약 270~280만원 수준으로 추정됩니다.",
  },
  {
    question: "담임을 맡으면 1년에 얼마나 더 받나요?",
    answer:
      "담임수당은 월 200,000원으로, 연간 약 240만원이 추가됩니다. 초등교사는 대부분 담임을 맡기 때문에 비담임 교사보다 이 금액만큼 고정적으로 더 받게 됩니다.",
  },
  {
    question: "기간제교사도 같은 방식으로 계산되나요?",
    answer:
      "기본급 산정 방식은 동일하지만, 기간제교사는 공무원연금이 적용되지 않고 호봉 산정 후 고정급 원칙이 적용됩니다. 이 계산기의 실수령 추정치는 4대보험 공제를 기준으로 한 근사값입니다.",
  },
  {
    question: "명절휴가비는 왜 연봉에 포함되나요?",
    answer:
      "명절휴가비(설·추석 연 2회, 본봉의 60%씩)는 공무원수당규정상 정기적으로 지급되는 항목이라 연봉 계산에 포함했습니다. 실제 지급 시점은 명절 시기에 맞춰 별도로 지급됩니다.",
  },
];

export const TSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/teacher-salary-2026/", label: "교사 월급표 2026 리포트" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/reports/police-salary-2026/", label: "경찰 월급표 2026" },
  { href: "/reports/firefighter-salary-2026/", label: "소방관 월급표 2026" },
  { href: "/reports/nurse-salary-2026/", label: "간호사 연봉 2026" },
];
