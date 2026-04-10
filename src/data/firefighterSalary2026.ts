// ============================================================
// 소방관 계급별 봉급·수당·입직 데이터 2026
// 기본급 1호봉: 공무원보수규정 별표 10 (2026.1.2 개정) 기준
// 이후 호봉 및 예상 연봉은 표준 공무원 호봉 증가 패턴 기반 추정치
// ============================================================

export type FireStep = {
  step: number;
  monthlyBase: number; // 원
};

export type FireRank = {
  id: string;
  name: string;
  nameEn: string;
  equiv: string;
  description: string;
  officialBase1: number;
  representativeStep: number;
  steps: FireStep[];
  isShiftWork: boolean;
  shiftNote: string;
  estimatedMonthlyRange: [number, number]; // 추정 (기본)
  estimatedMonthlyShiftRange: [number, number]; // 추정 (교대 포함)
  estimatedAnnual: number; // 추정
  colorHex: string;
};

export type FireAllowance = {
  name: string;
  amount: string;
  basis: string;
  type: "fixed" | "variable" | "annual";
  firefighterOnly: boolean;
};

export type ShiftPattern = {
  id: string;
  name: string;
  cycle: string;
  monthlyShiftExtra: string;
  note: string;
};

export type FireEntryMethod = {
  id: string;
  name: string;
  startRank: string;
  salaryNote: string;
  description: string;
};

export type FireCareerStep = {
  rank: string;
  typicalYears: string;
  note: string;
};

export type FireLifetimePath = {
  id: string;
  label: string;
  yearlyIncome: number[];
};

export type ComparePoint = {
  label: string;
  police: string;
  fire: string;
};

// ── 호봉 생성 유틸 ───────────────────────────────────────────
function buildSteps(base1: number, count: number, increment: number): FireStep[] {
  const steps: FireStep[] = [];
  for (let i = 1; i <= count; i++) {
    steps.push({ step: i, monthlyBase: base1 + increment * (i - 1) });
  }
  return steps;
}

function buildYearlyIncome(startM: number, midM: number, lateM: number): number[] {
  const arr: number[] = [];
  for (let y = 1; y <= 30; y++) {
    let val: number;
    if (y <= 10) val = startM + ((midM - startM) / 10) * (y - 1);
    else if (y <= 20) val = midM + ((lateM - midM) / 10) * (y - 10);
    else val = lateM + 20 * (y - 20);
    arr.push(Math.round(val / 10) * 10);
  }
  return arr;
}

// ── 계급 데이터 ──────────────────────────────────────────────
export const FIRE_RANKS: FireRank[] = [
  {
    id: "so-bang-sa",
    name: "소방사",
    nameEn: "Firefighter",
    equiv: "9급 상당",
    description: "현장 최일선 소방관. 화재진압, 구조, 구급 직접 출동 담당.",
    officialBase1: 2_133_000,
    representativeStep: 7,
    steps: buildSteps(2_133_000, 32, 27_000),
    isShiftWork: true,
    shiftNote: "3교대 근무 (24시간 근무 / 48시간 휴무)",
    estimatedMonthlyRange: [2_900_000, 3_300_000],
    estimatedMonthlyShiftRange: [3_200_000, 3_900_000],
    estimatedAnnual: 38_500_000,
    colorHex: "#e67e22",
  },
  {
    id: "so-bang-gyo",
    name: "소방교",
    nameEn: "Senior Firefighter",
    equiv: "8급 상당",
    description: "소방사 승진 후 현장 실무. 팀 내 중간 역할 수행.",
    officialBase1: 2_215_300,
    representativeStep: 7,
    steps: buildSteps(2_215_300, 28, 30_000),
    isShiftWork: true,
    shiftNote: "3교대 근무 (24시간 근무 / 48시간 휴무)",
    estimatedMonthlyRange: [3_000_000, 3_500_000],
    estimatedMonthlyShiftRange: [3_350_000, 4_050_000],
    estimatedAnnual: 40_500_000,
    colorHex: "#e67e22",
  },
  {
    id: "so-bang-jang",
    name: "소방장",
    nameEn: "Fire Sergeant",
    equiv: "7급 상당",
    description: "현장 팀장 역할. 소방사·소방교 지도 및 현장 지휘.",
    officialBase1: 2_472_100,
    representativeStep: 8,
    steps: buildSteps(2_472_100, 25, 34_000),
    isShiftWork: true,
    shiftNote: "3교대 근무 (24시간 근무 / 48시간 휴무)",
    estimatedMonthlyRange: [3_300_000, 3_900_000],
    estimatedMonthlyShiftRange: [3_700_000, 4_500_000],
    estimatedAnnual: 45_500_000,
    colorHex: "#d35400",
  },
  {
    id: "so-bang-wi",
    name: "소방위",
    nameEn: "Fire Inspector",
    equiv: "6급 상당",
    description: "119안전센터 팀장급. 간부 최하위 계급으로 현장·행정 연결.",
    officialBase1: 2_507_700,
    representativeStep: 8,
    steps: buildSteps(2_507_700, 22, 38_000),
    isShiftWork: true,
    shiftNote: "3교대 또는 2교대 근무 (보직에 따라 다름)",
    estimatedMonthlyRange: [3_500_000, 4_200_000],
    estimatedMonthlyShiftRange: [3_900_000, 4_800_000],
    estimatedAnnual: 50_000_000,
    colorHex: "#c0392b",
  },
  {
    id: "so-bang-gyeong",
    name: "소방경",
    nameEn: "Fire Lieutenant",
    equiv: "5급 상당",
    description: "소방서 팀장·계장급. 행정·현장 지휘 역할.",
    officialBase1: 2_698_600,
    representativeStep: 9,
    steps: buildSteps(2_698_600, 20, 45_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [4_100_000, 5_100_000],
    estimatedMonthlyShiftRange: [4_100_000, 5_100_000],
    estimatedAnnual: 57_500_000,
    colorHex: "#c0392b",
  },
  {
    id: "so-bang-ryeong",
    name: "소방령",
    nameEn: "Fire Captain",
    equiv: "4급 상당",
    description: "소방서 과장급. 부서 실질 운영 책임자.",
    officialBase1: 3_126_100,
    representativeStep: 8,
    steps: buildSteps(3_126_100, 17, 55_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [5_100_000, 6_300_000],
    estimatedMonthlyShiftRange: [5_100_000, 6_300_000],
    estimatedAnnual: 69_000_000,
    colorHex: "#a93226",
  },
  {
    id: "so-bang-jeong",
    name: "소방정",
    nameEn: "Fire Deputy Chief",
    equiv: "3급 상당",
    description: "소방서장(일부) 또는 소방본부 과장급. 중간 관리직.",
    officialBase1: 3_619_000,
    representativeStep: 7,
    steps: buildSteps(3_619_000, 14, 65_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [6_100_000, 7_700_000],
    estimatedMonthlyShiftRange: [6_100_000, 7_700_000],
    estimatedAnnual: 82_000_000,
    colorHex: "#922b21",
  },
  {
    id: "so-bang-jun-gam",
    name: "소방준감",
    nameEn: "Assistant Fire Commissioner",
    equiv: "2급 상당",
    description: "소방서장(대형), 소방본부 부장급. 고위 간부 진입.",
    officialBase1: 4_167_700,
    representativeStep: 5,
    steps: buildSteps(4_167_700, 10, 75_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [7_300_000, 9_200_000],
    estimatedMonthlyShiftRange: [7_300_000, 9_200_000],
    estimatedAnnual: 98_000_000,
    colorHex: "#7b241c",
  },
  {
    id: "so-bang-gam",
    name: "소방감",
    nameEn: "Deputy Fire Commissioner General",
    equiv: "1급 상당",
    description: "시·도 소방본부장, 소방청 국장급. 고위직 핵심.",
    officialBase1: 4_563_500,
    representativeStep: 4,
    steps: buildSteps(4_563_500, 8, 82_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [8_400_000, 10_800_000],
    estimatedMonthlyShiftRange: [8_400_000, 10_800_000],
    estimatedAnnual: 110_000_000,
    colorHex: "#641e16",
  },
  {
    id: "so-bang-jeong-gam",
    name: "소방정감",
    nameEn: "Fire Commissioner General",
    equiv: "차관급",
    description: "소방청 차장, 대형 시·도 소방본부장. 소방 최상위에 근접.",
    officialBase1: 4_905_100,
    representativeStep: 3,
    steps: buildSteps(4_905_100, 6, 90_000),
    isShiftWork: false,
    shiftNote: "",
    estimatedMonthlyRange: [9_700_000, 12_300_000],
    estimatedMonthlyShiftRange: [9_700_000, 12_300_000],
    estimatedAnnual: 120_000_000,
    colorHex: "#4a1408",
  },
];

// ── 수당 데이터 ──────────────────────────────────────────────
export const FIRE_ALLOWANCES: FireAllowance[] = [
  // 소방 전용 수당
  {
    name: "출동가산금 (화재·구조·구급)",
    amount: "1일 최대 40,000원",
    basis: "2026 처우개선 보도자료",
    type: "variable",
    firefighterOnly: true,
  },
  {
    name: "비상근무수당",
    amount: "1회 16,000원, 월 최대 180,000원",
    basis: "2026 처우개선 보도자료",
    type: "variable",
    firefighterOnly: true,
  },
  {
    name: "현장 직무 관련 수당",
    amount: "직무·보직별 별도 지급",
    basis: "공무원수당규정",
    type: "variable",
    firefighterOnly: true,
  },
  // 공통 고정 수당
  {
    name: "정액급식비",
    amount: "월 160,000원",
    basis: "공무원수당규정 제18조",
    type: "fixed",
    firefighterOnly: false,
  },
  {
    name: "위험근무수당",
    amount: "월 80,000원",
    basis: "2026 처우개선 (경찰·소방)",
    type: "fixed",
    firefighterOnly: false,
  },
  {
    name: "직급보조비",
    amount: "계급별 차등",
    basis: "공무원보수규정 별표 15",
    type: "fixed",
    firefighterOnly: false,
  },
  {
    name: "야간근무수당",
    amount: "근무시간 기준 산정",
    basis: "공무원수당규정",
    type: "variable",
    firefighterOnly: false,
  },
  {
    name: "시간외근무수당",
    amount: "근무시간 기준 산정",
    basis: "공무원수당규정",
    type: "variable",
    firefighterOnly: false,
  },
  {
    name: "가족수당",
    amount: "가족 구성에 따라 차등",
    basis: "공무원수당규정",
    type: "variable",
    firefighterOnly: false,
  },
  // 연간 특별 지급
  {
    name: "정근수당",
    amount: "연 2회 (1월·7월)",
    basis: "공무원수당규정",
    type: "annual",
    firefighterOnly: false,
  },
  {
    name: "명절휴가비",
    amount: "연 2회 (설·추석)",
    basis: "공무원수당규정",
    type: "annual",
    firefighterOnly: false,
  },
  {
    name: "연가보상비",
    amount: "미사용 연가 기준",
    basis: "공무원수당규정",
    type: "annual",
    firefighterOnly: false,
  },
  {
    name: "성과상여금",
    amount: "등급별 차등 (S/A/B)",
    basis: "공무원성과급규정",
    type: "annual",
    firefighterOnly: false,
  },
];

// ── 교대근무 구조 ─────────────────────────────────────────────
export const SHIFT_PATTERNS: ShiftPattern[] = [
  {
    id: "three-shift",
    name: "3교대",
    cycle: "24시간 근무 / 48시간 휴무 순환",
    monthlyShiftExtra: "야간·시간외 수당 포함 추정 월 30~60만 원",
    note: "현장 출동 빈도에 따라 출동가산금 추가 발생",
  },
  {
    id: "two-shift",
    name: "2교대",
    cycle: "근무지 및 보직에 따라 다름",
    monthlyShiftExtra: "야간·시간외 수당 포함 추정 월 20~45만 원",
    note: "지역·보직별 차이 있음",
  },
  {
    id: "admin",
    name: "행정직",
    cycle: "주간 근무 (08:00~18:00 내외)",
    monthlyShiftExtra: "교대수당 없음",
    note: "소방경 이상 행정·지휘 보직 중심",
  },
];

// ── 경찰 vs 소방 비교 포인트 ─────────────────────────────────
export const COMPARE_POINTS: ComparePoint[] = [
  { label: "봉급표 기준", police: "공무원보수규정 별표 10", fire: "동일 (별표 10)" },
  { label: "위험근무수당", police: "월 80,000원", fire: "월 80,000원" },
  { label: "현장 출동수당", police: "112 출동수당 1일 최대 4만 원", fire: "출동가산금 1일 최대 4만 원" },
  { label: "핵심 수당 변수", police: "야간·초과근무, 112 수당", fire: "교대근무, 출동가산금, 야간수당" },
  { label: "체감 연봉 차이", police: "교대 없는 내근직 기준", fire: "교대 현장직은 소폭 높게 추정" },
];

// ── 승진 경로 ─────────────────────────────────────────────────
export const FIRE_CAREER_PATH: FireCareerStep[] = [
  { rank: "소방사", typicalYears: "입직 ~ 4년", note: "시험·심사 기준 상이" },
  { rank: "소방교", typicalYears: "4 ~ 8년", note: "근무 성적 반영" },
  { rank: "소방장", typicalYears: "8 ~ 12년", note: "—" },
  { rank: "소방위", typicalYears: "12 ~ 18년", note: "승진 시험 또는 심사" },
  { rank: "소방경", typicalYears: "18 ~ 24년", note: "—" },
  { rank: "소방령 이상", typicalYears: "24년 이후", note: "심사 위주" },
];

// ── 입직 방법 ─────────────────────────────────────────────────
export const FIRE_ENTRY_METHODS: FireEntryMethod[] = [
  {
    id: "firefighter-exam",
    name: "소방사 공채",
    startRank: "소방사 1호봉",
    salaryNote: "공식 봉급표 기준",
    description: "일반 공개경쟁채용. 합격 후 소방학교 교육 수료 후 현장 배치.",
  },
  {
    id: "officer-candidate",
    name: "소방간부후보생",
    startRank: "교육 중 소방위 1호봉의 80%",
    salaryNote: "임용예정 계급 1호봉의 80%, 임용 후 소방위 봉급표 적용",
    description: "소방위 공채. 교육 기간 중 임용예정 계급 1호봉의 80% 지급.",
  },
  {
    id: "career-special",
    name: "경력경쟁채용",
    startRank: "직급별 상이",
    salaryNote: "채용 직급별 별도 안내",
    description: "의료·구조·화학 등 전문 분야 특채. 임용 직급과 급여는 채용 공고 기준.",
  },
  {
    id: "mandatory",
    name: "의무소방원",
    startRank: "별도 체계",
    salaryNote: "별표 10 비고 기준 별도 지급",
    description: "사회복무요원 유사 형태. 경력 후 소방공무원 임용 시 경력 인정 가능.",
  },
];

// ── 생애 소득 경로 ────────────────────────────────────────────
export const FIRE_LIFETIME_PATHS: FireLifetimePath[] = [
  {
    id: "firefighter-3shift-normal",
    label: "소방사 입직 · 3교대 · 보통 승진",
    yearlyIncome: buildYearlyIncome(3850, 6000, 8000),
  },
  {
    id: "firefighter-3shift-fast",
    label: "소방사 입직 · 3교대 · 빠른 승진",
    yearlyIncome: buildYearlyIncome(3850, 7000, 9500),
  },
  {
    id: "officer-normal",
    label: "소방위 입직 · 보통 승진",
    yearlyIncome: buildYearlyIncome(5000, 7500, 10000),
  },
];

// ── Hero KPI ─────────────────────────────────────────────────
export const FIRE_HERO_STATS = {
  rankCount: 11,
  salaryIncreaseRate: "3.5%",
  juniorIncreaseRate: "6.6%",
  firefighterBase1Str: "213.3만 원",
} as const;

// ── FAQ ──────────────────────────────────────────────────────
export const FIRE_FAQ: { q: string; a: string }[] = [
  {
    q: "소방사 초봉은 얼마인가요?",
    a: "2026년 기준 소방사 1호봉 기본급은 2,133,000원(공무원보수규정 별표 10)입니다. 정액급식비(월 16만 원), 위험근무수당(월 8만 원) 등 주요 고정 수당을 포함하면 체감 월 보수는 약 290~330만 원 수준입니다. 3교대 현장 근무 시 야간·시간외·출동가산금이 추가되어 실수령은 더 높아질 수 있습니다.",
  },
  {
    q: "소방관 월급은 기본급만 받나요?",
    a: "아닙니다. 기본급 외에 정액급식비(월 16만 원), 위험근무수당(월 8만 원), 출동가산금(1일 최대 4만 원), 야간·시간외근무수당 등 다수 수당이 지급됩니다. 3교대 현장 근무자는 교대 관련 수당 비중이 커서 기본급 대비 실수령 차이가 큽니다.",
  },
  {
    q: "소방관은 교대근무 수당이 얼마나 중요한가요?",
    a: "소방관 연봉에서 가장 큰 변수 중 하나입니다. 3교대(24시간 근무/48시간 휴무) 현장직은 야간근무수당, 시간외근무수당, 출동가산금이 기본급에 추가됩니다. 출동 빈도가 높은 센터 근무자는 동일 계급 행정직보다 연간 수십만~수백만 원 차이가 날 수 있습니다.",
  },
  {
    q: "소방간부후보생은 몇 계급으로 시작하나요?",
    a: "소방간부후보생은 교육 기간 중 임용예정 계급(소방위) 1호봉의 80% 상당 금액을 받으며, 임용 후에는 소방위 봉급표가 적용됩니다.",
  },
  {
    q: "경찰과 소방 중 어느 쪽이 더 많이 받나요?",
    a: "경찰과 소방은 같은 공무원보수규정 별표 10을 사용하므로 동일 계급·호봉이면 기본급은 같습니다. 다만 소방 3교대 현장직은 야간·시간외·출동가산금 비중이 높아 체감 연봉이 소폭 높게 추정됩니다. 경찰은 112 출동수당, 소방은 출동가산금이 각각 차별화 수당입니다.",
  },
];

// ── SEO 메타 ─────────────────────────────────────────────────
export const FF_META = {
  title: "소방관 계급별 연봉·수당 비교 2026 | 비교계산소",
  description:
    "2026년 소방공무원 계급별 기본급, 호봉표, 수당, 예상 실수령액을 한눈에 비교합니다. 소방사부터 소방정감까지 공식 봉급표 기준으로 정리했습니다.",
  updatedAt: "2026-04-10",
} as const;
