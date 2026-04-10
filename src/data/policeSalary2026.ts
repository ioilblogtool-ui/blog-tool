// ============================================================
// 경찰관 계급별 봉급·수당·입직 데이터 2026
// 기본급 1호봉: 공무원보수규정 별표 10 (2026.1.2 개정) 기준
// 이후 호봉 및 예상 연봉은 표준 공무원 호봉 증가 패턴 기반 추정치
// ============================================================

export type PoliceStep = {
  step: number;
  monthlyBase: number; // 원
};

export type PoliceRank = {
  id: string;
  name: string;
  nameEn: string;
  equiv: string;
  description: string;
  officialBase1: number; // 1호봉 기본급 (공식)
  representativeStep: number;
  steps: PoliceStep[];
  estimatedMonthlyRange: [number, number]; // 추정
  estimatedAnnual: number; // 추정
  colorHex: string;
};

export type Allowance = {
  name: string;
  amount: string;
  basis: string;
  type: "fixed" | "variable" | "annual";
};

export type EntryMethod = {
  id: string;
  name: string;
  startRank: string;
  salaryNote: string;
  description: string;
};

export type CareerStep = {
  rank: string;
  typicalYears: string;
  note: string;
};

export type LifetimePath = {
  id: string;
  label: string;
  startRankId: string;
  yearlyIncome: number[]; // 30년치 추정 연봉 (만원)
};

// ── 호봉 생성 유틸 ───────────────────────────────────────────
function buildSteps(base1: number, count: number, increment: number): PoliceStep[] {
  const steps: PoliceStep[] = [];
  for (let i = 1; i <= count; i++) {
    steps.push({ step: i, monthlyBase: base1 + increment * (i - 1) });
  }
  return steps;
}

// ── 계급 데이터 ──────────────────────────────────────────────
export const POLICE_RANKS: PoliceRank[] = [
  {
    id: "soon-gyeong",
    name: "순경",
    nameEn: "Constable",
    equiv: "9급 상당",
    description: "현장 치안 최일선 실무자. 순찰, 교통, 112 신고 대응 등 담당.",
    officialBase1: 2_133_000,
    representativeStep: 7,
    steps: buildSteps(2_133_000, 32, 27_000),
    estimatedMonthlyRange: [2_900_000, 3_300_000],
    estimatedAnnual: 36_000_000,
    colorHex: "#4a90d9",
  },
  {
    id: "gyeong-jang",
    name: "경장",
    nameEn: "Senior Constable",
    equiv: "8급 상당",
    description: "순경 승진 후 현장 실무. 팀 내 중간 역할 수행.",
    officialBase1: 2_215_300,
    representativeStep: 7,
    steps: buildSteps(2_215_300, 28, 30_000),
    estimatedMonthlyRange: [3_000_000, 3_500_000],
    estimatedAnnual: 38_500_000,
    colorHex: "#4a90d9",
  },
  {
    id: "gyeong-sa",
    name: "경사",
    nameEn: "Sergeant",
    equiv: "7급 상당",
    description: "현장 팀장 역할. 순경·경장 지도 및 사건 처리 주도.",
    officialBase1: 2_472_100,
    representativeStep: 8,
    steps: buildSteps(2_472_100, 25, 34_000),
    estimatedMonthlyRange: [3_300_000, 3_900_000],
    estimatedAnnual: 43_500_000,
    colorHex: "#5b8dd9",
  },
  {
    id: "gyeong-wi",
    name: "경위",
    nameEn: "Inspector",
    equiv: "6급 상당",
    description: "지구대·파출소 팀장 또는 경찰서 계장급. 간부 최하위 계급.",
    officialBase1: 2_507_700,
    representativeStep: 8,
    steps: buildSteps(2_507_700, 22, 38_000),
    estimatedMonthlyRange: [3_500_000, 4_200_000],
    estimatedAnnual: 47_000_000,
    colorHex: "#2c5f9e",
  },
  {
    id: "gyeong-gam",
    name: "경감",
    nameEn: "Chief Inspector",
    equiv: "5급 상당",
    description: "경찰서 팀장·계장급. 현장과 행정을 연결하는 핵심 간부.",
    officialBase1: 2_698_600,
    representativeStep: 9,
    steps: buildSteps(2_698_600, 20, 45_000),
    estimatedMonthlyRange: [4_000_000, 5_000_000],
    estimatedAnnual: 55_000_000,
    colorHex: "#2c5f9e",
  },
  {
    id: "gyeong-jeong",
    name: "경정",
    nameEn: "Superintendent",
    equiv: "4급 상당",
    description: "경찰서 과장급. 부서 실질 운영 책임자.",
    officialBase1: 3_126_100,
    representativeStep: 8,
    steps: buildSteps(3_126_100, 17, 55_000),
    estimatedMonthlyRange: [5_000_000, 6_200_000],
    estimatedAnnual: 67_000_000,
    colorHex: "#1a3f72",
  },
  {
    id: "chong-gyeong",
    name: "총경",
    nameEn: "Senior Superintendent",
    equiv: "3급 상당",
    description: "경찰서장(일부) 또는 지방청 과장급. 중간 관리직.",
    officialBase1: 3_619_000,
    representativeStep: 7,
    steps: buildSteps(3_619_000, 14, 65_000),
    estimatedMonthlyRange: [6_000_000, 7_500_000],
    estimatedAnnual: 80_000_000,
    colorHex: "#1a3f72",
  },
  {
    id: "gyeong-mu-gwan",
    name: "경무관",
    nameEn: "Assistant Commissioner",
    equiv: "2급 상당",
    description: "경찰서장(대형), 지방청 부장급. 고위 간부 진입.",
    officialBase1: 4_167_700,
    representativeStep: 5,
    steps: buildSteps(4_167_700, 10, 75_000),
    estimatedMonthlyRange: [7_200_000, 9_000_000],
    estimatedAnnual: 96_000_000,
    colorHex: "#0d1f3c",
  },
  {
    id: "chi-an-gam",
    name: "치안감",
    nameEn: "Deputy Commissioner General",
    equiv: "1급 상당",
    description: "지방경찰청장, 경찰청 국장급. 고위직 핵심.",
    officialBase1: 4_563_500,
    representativeStep: 4,
    steps: buildSteps(4_563_500, 8, 82_000),
    estimatedMonthlyRange: [8_200_000, 10_500_000],
    estimatedAnnual: 108_000_000,
    colorHex: "#0d1f3c",
  },
  {
    id: "chi-an-jeong-gam",
    name: "치안정감",
    nameEn: "Commissioner General",
    equiv: "차관급",
    description: "경찰청 차장, 지방청장(서울·경기). 경찰 최상위에 근접.",
    officialBase1: 4_905_100,
    representativeStep: 3,
    steps: buildSteps(4_905_100, 6, 90_000),
    estimatedMonthlyRange: [9_500_000, 12_000_000],
    estimatedAnnual: 118_000_000,
    colorHex: "#0d1f3c",
  },
];

// ── 수당 데이터 ──────────────────────────────────────────────
export const ALLOWANCES: Allowance[] = [
  // 고정 수당
  {
    name: "정액급식비",
    amount: "월 160,000원",
    basis: "공무원수당규정 제18조",
    type: "fixed",
  },
  {
    name: "위험근무수당",
    amount: "월 80,000원",
    basis: "2026 처우개선 (경찰·소방)",
    type: "fixed",
  },
  {
    name: "직급보조비",
    amount: "계급별 차등",
    basis: "공무원보수규정 별표 15",
    type: "fixed",
  },
  // 변동 수당
  {
    name: "112 출동수당",
    amount: "1일 최대 40,000원",
    basis: "2026 처우개선 보도자료",
    type: "variable",
  },
  {
    name: "비상근무수당",
    amount: "1회 16,000원, 월 최대 180,000원",
    basis: "2026 처우개선 보도자료",
    type: "variable",
  },
  {
    name: "시간외근무수당",
    amount: "근무시간 기준 산정",
    basis: "공무원수당규정",
    type: "variable",
  },
  {
    name: "가족수당",
    amount: "배우자·자녀 수 기준 차등",
    basis: "공무원수당규정",
    type: "variable",
  },
  // 연간 특별 지급
  {
    name: "정근수당",
    amount: "연 2회 (1월·7월)",
    basis: "공무원수당규정",
    type: "annual",
  },
  {
    name: "명절휴가비",
    amount: "연 2회 (설·추석)",
    basis: "공무원수당규정",
    type: "annual",
  },
  {
    name: "연가보상비",
    amount: "미사용 연가 기준",
    basis: "공무원수당규정",
    type: "annual",
  },
  {
    name: "성과상여금",
    amount: "등급별 차등 (S/A/B)",
    basis: "공무원성과급규정",
    type: "annual",
  },
];

// ── 입직 방법 ─────────────────────────────────────────────────
export const ENTRY_METHODS: EntryMethod[] = [
  {
    id: "constable-exam",
    name: "순경 공채",
    startRank: "순경 1호봉",
    salaryNote: "공식 봉급표 기준",
    description:
      "일반 공개경쟁채용시험 합격 후 순경으로 임용. 경찰교육원 기초교육 수료 후 현장 배치.",
  },
  {
    id: "police-university",
    name: "경찰대학",
    startRank: "졸업 후 경위 임용",
    salaryNote: "재학 중 별표 10 비고 기준 별도 지급, 졸업 후 경위 봉급표 적용",
    description:
      "4년제 경찰대학 졸업 후 경위로 임용. 재학 중 별표 10 비고에 따른 금액 지급.",
  },
  {
    id: "officer-candidate",
    name: "경위 공채 (간부후보생)",
    startRank: "임용예정 계급 1호봉의 80%",
    salaryNote: "교육 기간 중 경위 1호봉의 80%, 임용 후 경위 봉급표 적용",
    description:
      "경위 공개경쟁채용시험 합격. 교육 기간 중 임용예정 계급 1호봉의 80% 지급.",
  },
  {
    id: "special",
    name: "특별채용",
    startRank: "분야별 상이",
    salaryNote: "채용 분야·계급별 별도 안내",
    description:
      "법학·사이버·외국어 등 특기 분야 채용. 임용 계급과 급여 기준은 채용 공고 기준.",
  },
];

// ── 승진 경로 ─────────────────────────────────────────────────
export const CAREER_PATH: CareerStep[] = [
  { rank: "순경", typicalYears: "입직 ~ 4년", note: "시험·심사 기준 상이" },
  { rank: "경장", typicalYears: "4 ~ 8년", note: "근무 성적 반영" },
  { rank: "경사", typicalYears: "8 ~ 12년", note: "—" },
  { rank: "경위", typicalYears: "12 ~ 18년", note: "승진 시험 또는 심사" },
  { rank: "경감", typicalYears: "18 ~ 24년", note: "—" },
  { rank: "경정 이상", typicalYears: "24년 이후", note: "심사 위주" },
];

// ── 생애 소득 시뮬레이션 경로 ────────────────────────────────
// 연도별 추정 연봉 (만원), 1~30년
function genYearlyIncome(
  startM: number,
  midM: number,
  lateM: number,
): number[] {
  const arr: number[] = [];
  for (let y = 1; y <= 30; y++) {
    let val: number;
    if (y <= 10) val = startM + ((midM - startM) / 10) * (y - 1);
    else if (y <= 20) val = midM + ((lateM - midM) / 10) * (y - 10);
    else val = lateM + 20 * (y - 20); // 느린 성장
    arr.push(Math.round(val / 10) * 10);
  }
  return arr;
}

export const LIFETIME_PATHS: LifetimePath[] = [
  {
    id: "constable-normal",
    label: "순경 입직 · 보통 승진",
    startRankId: "soon-gyeong",
    yearlyIncome: genYearlyIncome(3600, 5500, 7500),
  },
  {
    id: "constable-fast",
    label: "순경 입직 · 빠른 승진",
    startRankId: "soon-gyeong",
    yearlyIncome: genYearlyIncome(3600, 6500, 9000),
  },
  {
    id: "inspector-normal",
    label: "경위 입직 · 보통 승진",
    startRankId: "gyeong-wi",
    yearlyIncome: genYearlyIncome(4700, 7000, 9500),
  },
];

// ── Hero KPI ─────────────────────────────────────────────────
export const HERO_STATS = {
  rankCount: 11,
  salaryIncreaseRate: "3.5%",
  constableBase1Str: "213.3만 원",
  grade9InitialMonthlyStr: "월 평균 286만 원",
} as const;

// ── FAQ ──────────────────────────────────────────────────────
export const POLICE_FAQ: { q: string; a: string }[] = [
  {
    q: "경찰 순경 초봉은 얼마인가요?",
    a: "2026년 기준 순경 1호봉 기본급은 2,133,000원(공무원보수규정 별표 10)입니다. 여기에 정액급식비(월 16만 원), 위험근무수당(월 8만 원) 등 주요 수당을 포함하면 체감 월 보수는 약 290~330만 원 수준으로 추정됩니다.",
  },
  {
    q: "경찰대 졸업하면 몇 계급으로 시작하나요?",
    a: "경찰대학 졸업 후 경위로 임용됩니다. 재학 중에는 공무원보수규정 별표 10 비고에 따른 별도 금액이 지급되며, 졸업 후 임용 시 경위 봉급표가 적용됩니다.",
  },
  {
    q: "경찰 월급은 기본급만 받나요?",
    a: "아닙니다. 기본급 외에 정액급식비(월 16만 원), 위험근무수당(월 8만 원), 직급보조비, 정근수당(연 2회), 명절휴가비(연 2회), 성과상여금 등 다수 수당이 지급됩니다. 이 때문에 실제 체감 보수는 기본급보다 높습니다.",
  },
  {
    q: "경찰과 소방 연봉은 어느 쪽이 더 높은가요?",
    a: "경찰과 소방 모두 공무원보수규정 별표 10을 동일하게 적용받습니다. 같은 계급·호봉이라면 기본급은 같습니다. 다만 근무지, 특수수당, 초과근무 여부에 따라 체감 연봉 차이가 날 수 있습니다.",
  },
  {
    q: "경찰 호봉은 몇 년마다 오르나요?",
    a: "공무원 호봉은 매년 1월 1일 기준으로 1호봉씩 자동 오릅니다(1년 = 1호봉 원칙). 단, 군복무·공무원 경력 등 경력 환산에 따라 초임 호봉이 높아질 수 있습니다.",
  },
];

// ── SEO 메타 ─────────────────────────────────────────────────
export const PS_META = {
  title: "경찰관 계급별 연봉·호봉 완전 정리 2026 | 비교계산소",
  description:
    "2026년 경찰공무원 계급별 기본급, 호봉표, 수당, 예상 실수령액을 한눈에 비교합니다. 순경부터 치안정감까지 공식 봉급표 기준으로 정리했습니다.",
  updatedAt: "2026-04-10",
} as const;
