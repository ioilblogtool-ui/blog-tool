// ============================================================
// 학교 선생님 연봉·호봉 완전 정리 2026
// 기본급: 인사혁신처 2026년 「유치원·초등학교·중학교·고등학교 교원 등의 봉급표」
// 세후 추정: 미혼·부양가족 없음 기준 (국민연금 4.5% + 건강보험 3.545% + 장기요양 0.46% + 고용보험 0.9% + 소득세)
// ============================================================

export type TeacherStep = {
  step: number;
  monthlyBase: number;
  annualGross: number;
  monthlyNetEstimate: number;
  label?: string;
};

export type SchoolLevel = {
  id: "elementary" | "middle" | "high" | "special" | "fixed_term";
  name: string;
  entryStep: number;
  entryStepBasis: string;
  qualificationNote: string;
  classTeacherNote: string;
  overtimeNote: string;
  characteristics: string[];
  badge: string;
  estimatedEntryMonthly: [number, number];
  colorVar: string;
};

export type TeacherAllowance = {
  name: string;
  amount: string;
  condition: string;
  basis: string;
  type: "fixed" | "role" | "annual";
};

export type PublicPrivateItem = {
  category: string;
  public: string;
  private: string;
  note?: string;
};

export type WorkloadItem = {
  category: string;
  elementary: string;
  middle: string;
  high: string;
};

export type EntryPath = {
  id: string;
  name: string;
  qualification: string;
  entryStep: number;
  entryStepBasis: string;
  description: string;
};

export type TotalCompRow = {
  label: string;
  annualBase: number;
  estimatedMin: number;
  estimatedMax: number;
  note: string;
};

export type TeacherFAQ = {
  q: string;
  a: string;
};

// ─── Hero KPI ──────────────────────────────────────────────
export const TS_META = {
  title: "학교 선생님 연봉·호봉 완전 정리 2026 | 비교계산소",
  description:
    "2026년 교원 봉급표 기준으로 초등·중학교·고등학교 선생님 월급, 호봉표, 기간제교사 차이, 담임·보직 수당 구조까지 한눈에 비교합니다.",
} as const;

export const TS_HERO_STATS = {
  increaseRate2026: "3.5%",
  entryStep: 9,
  entryMonthlyBase: 2_495_600,
  step40MonthlyBase: 6_205_700,
  hobongCount: 40,
} as const;

// ─── 전체 호봉표 (1~40호봉) ──────────────────────────────────
export const TEACHER_STEPS: TeacherStep[] = [
  { step: 1,  monthlyBase: 2_041_500, annualGross: 24_498_000, monthlyNetEstimate: 1_830_000 },
  { step: 2,  monthlyBase: 2_068_600, annualGross: 24_823_200, monthlyNetEstimate: 1_855_000 },
  { step: 3,  monthlyBase: 2_096_400, annualGross: 25_156_800, monthlyNetEstimate: 1_880_000 },
  { step: 4,  monthlyBase: 2_181_000, annualGross: 26_172_000, monthlyNetEstimate: 1_955_000 },
  { step: 5,  monthlyBase: 2_291_500, annualGross: 27_498_000, monthlyNetEstimate: 2_055_000, label: "5호봉" },
  { step: 6,  monthlyBase: 2_346_300, annualGross: 28_155_600, monthlyNetEstimate: 2_100_000 },
  { step: 7,  monthlyBase: 2_401_900, annualGross: 28_822_800, monthlyNetEstimate: 2_150_000 },
  { step: 8,  monthlyBase: 2_447_900, annualGross: 29_374_800, monthlyNetEstimate: 2_195_000 },
  { step: 9,  monthlyBase: 2_495_600, annualGross: 29_947_200, monthlyNetEstimate: 2_235_000, label: "신입(교대·사범대)" },
  { step: 10, monthlyBase: 2_516_700, annualGross: 30_200_400, monthlyNetEstimate: 2_255_000, label: "10호봉" },
  { step: 11, monthlyBase: 2_580_000, annualGross: 30_960_000, monthlyNetEstimate: 2_310_000 },
  { step: 12, monthlyBase: 2_650_000, annualGross: 31_800_000, monthlyNetEstimate: 2_370_000 },
  { step: 13, monthlyBase: 2_720_000, annualGross: 32_640_000, monthlyNetEstimate: 2_435_000 },
  { step: 14, monthlyBase: 2_805_000, annualGross: 33_660_000, monthlyNetEstimate: 2_510_000, label: "14호봉" },
  { step: 15, monthlyBase: 2_889_700, annualGross: 34_676_400, monthlyNetEstimate: 2_585_000 },
  { step: 16, monthlyBase: 2_978_000, annualGross: 35_736_000, monthlyNetEstimate: 2_660_000 },
  { step: 17, monthlyBase: 3_068_000, annualGross: 36_816_000, monthlyNetEstimate: 2_740_000 },
  { step: 18, monthlyBase: 3_161_000, annualGross: 37_932_000, monthlyNetEstimate: 2_820_000 },
  { step: 19, monthlyBase: 3_257_000, annualGross: 39_084_000, monthlyNetEstimate: 2_905_000 },
  { step: 20, monthlyBase: 3_481_000, annualGross: 41_772_000, monthlyNetEstimate: 3_105_000 },
  { step: 21, monthlyBase: 3_600_700, annualGross: 43_208_400, monthlyNetEstimate: 3_205_000, label: "21호봉" },
  { step: 22, monthlyBase: 3_730_000, annualGross: 44_760_000, monthlyNetEstimate: 3_315_000 },
  { step: 23, monthlyBase: 3_860_000, annualGross: 46_320_000, monthlyNetEstimate: 3_425_000 },
  { step: 24, monthlyBase: 3_994_000, annualGross: 47_928_000, monthlyNetEstimate: 3_540_000 },
  { step: 25, monthlyBase: 4_129_400, annualGross: 49_552_800, monthlyNetEstimate: 3_655_000 },
  { step: 26, monthlyBase: 4_268_000, annualGross: 51_216_000, monthlyNetEstimate: 3_770_000 },
  { step: 27, monthlyBase: 4_410_000, annualGross: 52_920_000, monthlyNetEstimate: 3_890_000 },
  { step: 28, monthlyBase: 4_545_000, annualGross: 54_540_000, monthlyNetEstimate: 4_005_000 },
  { step: 29, monthlyBase: 4_682_100, annualGross: 56_185_200, monthlyNetEstimate: 4_120_000 },
  { step: 30, monthlyBase: 4_826_800, annualGross: 57_921_600, monthlyNetEstimate: 4_240_000, label: "30호봉" },
  { step: 31, monthlyBase: 4_974_000, annualGross: 59_688_000, monthlyNetEstimate: 4_365_000 },
  { step: 32, monthlyBase: 5_118_000, annualGross: 61_416_000, monthlyNetEstimate: 4_480_000 },
  { step: 33, monthlyBase: 5_265_000, annualGross: 63_180_000, monthlyNetEstimate: 4_600_000 },
  { step: 34, monthlyBase: 5_410_000, annualGross: 64_920_000, monthlyNetEstimate: 4_715_000 },
  { step: 35, monthlyBase: 5_553_600, annualGross: 66_643_200, monthlyNetEstimate: 4_830_000 },
  { step: 36, monthlyBase: 5_696_000, annualGross: 68_352_000, monthlyNetEstimate: 4_945_000 },
  { step: 37, monthlyBase: 5_839_000, annualGross: 70_068_000, monthlyNetEstimate: 5_060_000 },
  { step: 38, monthlyBase: 5_980_000, annualGross: 71_760_000, monthlyNetEstimate: 5_170_000 },
  { step: 39, monthlyBase: 6_093_000, annualGross: 73_116_000, monthlyNetEstimate: 5_265_000 },
  { step: 40, monthlyBase: 6_205_700, annualGross: 74_468_400, monthlyNetEstimate: 5_355_000, label: "40호봉" },
];

// 대표 구간 (호봉표 요약 패널용)
export const TEACHER_SUMMARY_STEPS = [5, 9, 10, 14, 21, 30, 40].map(
  (s) => TEACHER_STEPS.find((t) => t.step === s)!,
);

// ─── 학교급 비교 ───────────────────────────────────────────
export const SCHOOL_LEVELS: SchoolLevel[] = [
  {
    id: "elementary",
    name: "초등교사",
    entryStep: 9,
    entryStepBasis: "교육대학교 4년 졸업 기준",
    qualificationNote: "초등 정교사 2급 → 시도교육청 임용고시",
    classTeacherNote: "거의 전원 담임 배정",
    overtimeNote: "시간외수당 상대적으로 적음",
    characteristics: ["전 과목 담당", "학부모 소통 비중 높음", "생활지도 중심"],
    badge: "담임 체감 큼",
    estimatedEntryMonthly: [2_800_000, 3_100_000],
    colorVar: "--ts-color-elementary",
  },
  {
    id: "middle",
    name: "중학교 교사",
    entryStep: 9,
    entryStepBasis: "사범대 4년 기준 (비사범계 교직이수는 8호봉)",
    qualificationNote: "중등 정교사 2급(표시과목) → 임용고시",
    classTeacherNote: "담임 여부 학교별 배정",
    overtimeNote: "방과후·자율학습 등 발생 가능",
    characteristics: ["표시과목 전담", "시험·평가 비중 높음", "진학지도 시작"],
    badge: "과목 차이 큼",
    estimatedEntryMonthly: [2_650_000, 3_100_000],
    colorVar: "--ts-color-middle",
  },
  {
    id: "high",
    name: "고등학교 교사",
    entryStep: 9,
    entryStepBasis: "사범대 4년 기준",
    qualificationNote: "중등 정교사 2급(표시과목) → 임용고시",
    classTeacherNote: "담임 여부 학교별 배정",
    overtimeNote: "야자 지도·입시 상담 등 시간외수당 증가 가능",
    characteristics: ["내신·수능 연계 높음", "입시 진학 부담 큼", "과목별 편차 큼"],
    badge: "입시 부담 큼",
    estimatedEntryMonthly: [2_650_000, 3_300_000],
    colorVar: "--ts-color-high",
  },
  {
    id: "special",
    name: "특수교사",
    entryStep: 10,
    entryStepBasis: "특수교육 관련학과 졸업 (+1호봉 가산)",
    qualificationNote: "특수 정교사 2급 → 임용고시",
    classTeacherNote: "소규모 학급 담임",
    overtimeNote: "특수교사 수당 월 12만원 추가",
    characteristics: ["특수학교·특수학급 배치", "+1호봉 가산 적용", "수당 추가 지급"],
    badge: "+1호봉 가산",
    estimatedEntryMonthly: [2_900_000, 3_200_000],
    colorVar: "--ts-color-special",
  },
  {
    id: "fixed_term",
    name: "기간제교사",
    entryStep: 8,
    entryStepBasis: "경력 없음 기준 (경력 인정 시 호봉 조정)",
    qualificationNote: "정교사 자격증(2급 이상) 보유",
    classTeacherNote: "담임 배정 학교별 상이",
    overtimeNote: "시간제는 근무시간 비례 지급",
    characteristics: ["호봉 산정 후 고정급 원칙", "공무원연금 미적용", "계약 만료·갱신 구조"],
    badge: "고정급 원칙",
    estimatedEntryMonthly: [2_400_000, 2_700_000],
    colorVar: "--ts-color-fixed",
  },
];

// ─── 수당 ──────────────────────────────────────────────────
export const TEACHER_ALLOWANCES: TeacherAllowance[] = [
  // 고정
  { name: "교직수당",    amount: "월 250,000원",    condition: "전 교사 공통",             basis: "공무원수당규정",             type: "fixed" },
  { name: "정액급식비",  amount: "월 160,000원",    condition: "전 공무원 공통",            basis: "공무원수당규정 제18조",       type: "fixed" },
  { name: "교원연구비",  amount: "월 60,000~70,000원", condition: "경력 5년 미만 7만원, 이상 6만원", basis: "공무원수당규정",         type: "fixed" },
  // 역할
  { name: "담임수당",    amount: "월 200,000원",    condition: "담임교사 배정 시",          basis: "공무원수당규정",             type: "role" },
  { name: "보직수당",    amount: "월 150,000원",    condition: "교무·연구·학생부장 등",      basis: "공무원수당규정",             type: "role" },
  { name: "특수교사 수당", amount: "월 120,000원",  condition: "특수학교·특수학급 배치 시",  basis: "공무원수당규정",             type: "role" },
  // 연간
  { name: "명절휴가비",  amount: "본봉의 60% (연 2회)", condition: "설·추석",            basis: "공무원수당규정",             type: "annual" },
  { name: "성과상여금",  amount: "S·A·B 등급제 차등",  condition: "연 1회",             basis: "공무원성과급규정",           type: "annual" },
  { name: "정근수당",    amount: "연 2회 (1월·7월)",  condition: "근속 연수 기준 차등",     basis: "공무원수당규정",             type: "annual" },
  { name: "연가보상비",  amount: "미사용 연가 기준",    condition: "해당 연도 미사용 연가 발생 시", basis: "공무원수당규정",         type: "annual" },
];

// ─── 공립 vs 사립 ───────────────────────────────────────────
export const PUBLIC_PRIVATE: PublicPrivateItem[] = [
  { category: "봉급표",     public: "국가 교원 봉급표 (단일)",       private: "동일 봉급표 적용 (원칙)" },
  { category: "연금",       public: "공무원연금",                   private: "사학연금 (수준 유사)" },
  { category: "정년",       public: "62세 보장",                   private: "학교법인 규정에 따라 상이", note: "참고" },
  { category: "복지·수당",  public: "전국 균일",                   private: "학교별 편차 큼",            note: "참고" },
  { category: "안정성",     public: "높음",                       private: "학교 재정에 따라 리스크",    note: "참고" },
  { category: "인사·전보",  public: "5년 단위 순환전보 (교육청)",    private: "동일 학교 장기 근무 가능" },
];

// ─── 업무 강도 비교 ─────────────────────────────────────────
export const WORKLOAD_COMPARISON: WorkloadItem[] = [
  { category: "생활지도",    elementary: "높음",    middle: "중간~높음", high: "중간" },
  { category: "학부모 소통",  elementary: "높음",    middle: "중간",     high: "중간" },
  { category: "시험·평가",   elementary: "중간",    middle: "높음",     high: "매우 높음" },
  { category: "진학상담",    elementary: "낮음",    middle: "중간",     high: "매우 높음" },
  { category: "입시 부담",   elementary: "낮음",    middle: "중간",     high: "높음" },
  { category: "행정 업무",   elementary: "중간~높음", middle: "중간",    high: "중간" },
];

// ─── 진입 경로 ─────────────────────────────────────────────
export const ENTRY_PATHS: EntryPath[] = [
  {
    id: "elementary",
    name: "초등 임용고시",
    qualification: "초등 정교사 2급",
    entryStep: 9,
    entryStepBasis: "교대 4년 졸업",
    description: "전국 17개 시도교육청 별도 시험. 교대 졸업 후 해당 시도교육청 응시.",
  },
  {
    id: "secondary-major",
    name: "중등 임용고시 (사범대)",
    qualification: "중등 정교사 2급 (표시과목)",
    entryStep: 9,
    entryStepBasis: "사범계 4년 졸업",
    description: "표시과목별 인원 선발. 국어·수학·영어·과학 등 과목별 경쟁률 상이.",
  },
  {
    id: "secondary-education",
    name: "중등 임용고시 (교직이수)",
    qualification: "중등 정교사 2급 (비사범계)",
    entryStep: 8,
    entryStepBasis: "비사범계 4년 + 교직과목 이수",
    description: "사범대보다 1호봉 낮게 시작. 교직이수 학점 충족 필요.",
  },
  {
    id: "special",
    name: "특수교사 임용고시",
    qualification: "특수 정교사 2급",
    entryStep: 10,
    entryStepBasis: "특수교육 관련학과 졸업 (+1호봉)",
    description: "특수학교 또는 일반학교 특수학급 배치. 별도 가산 호봉 적용.",
  },
  {
    id: "fixed-term",
    name: "기간제교사",
    qualification: "정교사 자격증 (2급 이상)",
    entryStep: 8,
    entryStepBasis: "경력 없음 기준",
    description: "학교 단위 계약 채용. 공무원연금 미적용, 호봉 산정 후 고정급 원칙.",
  },
];

// ─── 총보상 패키지 (추정) ─────────────────────────────────
export const TOTAL_COMP: TotalCompRow[] = [
  { label: "신규 (9호봉)",    annualBase: 29_947_200, estimatedMin: 35_000_000, estimatedMax: 38_000_000, note: "교직수당+담임+식대 포함 추정" },
  { label: "10년차 (19호봉)", annualBase: 39_084_000, estimatedMin: 48_000_000, estimatedMax: 52_000_000, note: "보직·성과 여부에 따라 상이" },
  { label: "20년차 (29호봉)", annualBase: 56_185_200, estimatedMin: 64_000_000, estimatedMax: 70_000_000, note: "명절휴가비 포함" },
  { label: "30년차 (39호봉)", annualBase: 73_116_000, estimatedMin: 80_000_000, estimatedMax: 85_000_000, note: "고경력 보전수당 포함 추정" },
];

// ─── FAQ ──────────────────────────────────────────────────
export const TEACHER_FAQ: TeacherFAQ[] = [
  {
    q: "초등교사와 고등학교 교사 본봉이 정말 같나요?",
    a: "네. 인사혁신처 「교원 봉급표」는 초·중·고 구분 없이 단일 표를 적용합니다. 같은 호봉이면 기본급은 완전히 동일합니다. 체감 차이는 수당 구조(담임·보직)와 업무 환경에서 발생합니다.",
  },
  {
    q: "임용고시 붙으면 첫 달 월급이 얼마예요?",
    a: "교대·사범대 졸업 → 9호봉 시작 기준, 기본급 2,495,600원에 교직수당 250,000원 + 정액급식비 160,000원 + 담임수당 200,000원(담임 시) 합산 시 세전 약 310만원 내외. 공제 후 실수령은 약 260~280만원 수준입니다.",
  },
  {
    q: "10년 버티면 교사 연봉은 얼마나 되나요?",
    a: "9호봉 시작 기준 매년 1호봉씩 상승하면 10년 후 19호봉. 기본급 월 3,257,000원, 세전 연봉 약 3,900만원. 수당 포함 실질 연봉은 4,800~5,200만원 수준으로 추정됩니다.",
  },
  {
    q: "기간제교사도 호봉표 적용받나요?",
    a: "원칙적으로 동일한 교원 봉급표를 적용합니다. 경력 없을 경우 통상 8~9호봉 시작. 단, 공무원연금이 적용되지 않고, 시간제 기간제는 정상근무 봉급월액 기준 근무시간 비례로 지급됩니다.",
  },
  {
    q: "담임을 맡으면 월급 차이가 큰가요?",
    a: "담임수당 월 200,000원이 추가됩니다. 연간으로 환산하면 약 240만원 차이. 초등교사는 대부분 담임을 맡기 때문에 중·고교 비담임 교사보다 이 금액만큼 고정적으로 많이 받습니다.",
  },
  {
    q: "사립학교 교사와 공립학교 교사 연봉은 많이 다른가요?",
    a: "봉급표 자체는 공립·사립 동일 기준을 원칙으로 합니다. 다만 일부 사립은 학교 자체 수당을 추가 지급하기도 하며, 연금은 공립(공무원연금)과 사립(사학연금)이 구분됩니다. 안정성은 공립이 일반적으로 높다고 봅니다.",
  },
];
