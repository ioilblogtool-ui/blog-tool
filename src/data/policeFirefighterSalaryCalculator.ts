// ============================================================
// 경찰·소방 계급 호봉 실수령액 계산기
// 기본급: 공무원보수규정 별표 10 (2026.1.2 개정) — 경찰·소방 공통
// 직급보조비: 계급 상당 직급(9~1급, 차관급) 기준 추정
// ============================================================

export interface PfRankStep {
  step: number;
  monthlyBase: number;
}

export interface PfRank {
  id: string;
  policeLabel: string;
  fireLabel: string;
  equiv: string;
  representativeStep: number;
  maxStep: number;
  steps: PfRankStep[];
}

export interface PfShiftPattern {
  id: string;
  label: string;
  description: string;
  monthlyExtra: number;
}

export interface PfInput {
  org: "police" | "fire";
  rankId: string;
  step: number;
  hasSpouse: boolean;
  childCount: number;
  shiftPatternId: string;
}

export interface PfPreset {
  id: string;
  label: string;
  description: string;
  input: PfInput;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

function buildSteps(base1: number, count: number, increment: number): PfRankStep[] {
  const steps: PfRankStep[] = [];
  for (let i = 1; i <= count; i++) {
    steps.push({ step: i, monthlyBase: base1 + increment * (i - 1) });
  }
  return steps;
}

// ── Meta ──────────────────────────────────────────────────────
export const PF_META = {
  title: "경찰·소방 호봉 실수령액 계산기",
  seoTitle: "경찰 소방 호봉 계산기 - 계급별 월급·실수령액 2026",
  seoDescription:
    "경찰·소방 계급과 호봉, 가족수당, 교대근무 여부를 입력하면 2026년 공무원보수규정 기준 월급과 세후 실수령액, 연봉을 계산하는 페이지",
  dataNote:
    "기본급은 경찰·소방 공통으로 공무원보수규정 별표 10(2026.1.2 개정) 기준이며, 직급보조비·세후 실수령액은 상당 직급 기준 추정치입니다.",
} as const;

// ── 공통 수당 상수 ────────────────────────────────────────────
export const PF_ALLOWANCES = {
  mealAllowance: 160_000,
  dangerAllowance: 80_000,
  spouseAllowance: 40_000,
  childAllowance: 20_000,
  holidayBonusRate: 0.6,
} as const;

// ── 계급 상당 직급별 직급보조비 (추정) ─────────────────────────
export const PF_JOB_GRADE_SUPPORT: Record<string, number> = {
  "9급": 135_000,
  "8급": 155_000,
  "7급": 175_000,
  "6급": 175_000,
  "5급": 200_000,
  "4급": 235_000,
  "3급": 270_000,
  "2급": 300_000,
  "1급": 330_000,
  차관급: 380_000,
};

// ── 계급 데이터 (경찰·소방 공통 봉급표) ─────────────────────────
export const PF_RANKS: PfRank[] = [
  {
    id: "rank-09",
    policeLabel: "순경",
    fireLabel: "소방사",
    equiv: "9급",
    representativeStep: 7,
    maxStep: 32,
    steps: buildSteps(2_133_000, 32, 27_000),
  },
  {
    id: "rank-08",
    policeLabel: "경장",
    fireLabel: "소방교",
    equiv: "8급",
    representativeStep: 7,
    maxStep: 28,
    steps: buildSteps(2_215_300, 28, 30_000),
  },
  {
    id: "rank-07",
    policeLabel: "경사",
    fireLabel: "소방장",
    equiv: "7급",
    representativeStep: 8,
    maxStep: 25,
    steps: buildSteps(2_472_100, 25, 34_000),
  },
  {
    id: "rank-06",
    policeLabel: "경위",
    fireLabel: "소방위",
    equiv: "6급",
    representativeStep: 8,
    maxStep: 22,
    steps: buildSteps(2_507_700, 22, 38_000),
  },
  {
    id: "rank-05",
    policeLabel: "경감",
    fireLabel: "소방경",
    equiv: "5급",
    representativeStep: 9,
    maxStep: 20,
    steps: buildSteps(2_698_600, 20, 45_000),
  },
  {
    id: "rank-04",
    policeLabel: "경정",
    fireLabel: "소방령",
    equiv: "4급",
    representativeStep: 8,
    maxStep: 17,
    steps: buildSteps(3_126_100, 17, 55_000),
  },
  {
    id: "rank-03",
    policeLabel: "총경",
    fireLabel: "소방정",
    equiv: "3급",
    representativeStep: 7,
    maxStep: 14,
    steps: buildSteps(3_619_000, 14, 65_000),
  },
  {
    id: "rank-02",
    policeLabel: "경무관",
    fireLabel: "소방준감",
    equiv: "2급",
    representativeStep: 5,
    maxStep: 10,
    steps: buildSteps(4_167_700, 10, 75_000),
  },
  {
    id: "rank-01",
    policeLabel: "치안감",
    fireLabel: "소방감",
    equiv: "1급",
    representativeStep: 4,
    maxStep: 8,
    steps: buildSteps(4_563_500, 8, 82_000),
  },
  {
    id: "rank-vm",
    policeLabel: "치안정감",
    fireLabel: "소방정감",
    equiv: "차관급",
    representativeStep: 3,
    maxStep: 6,
    steps: buildSteps(4_905_100, 6, 90_000),
  },
];

// ── 소방 교대근무 패턴 ───────────────────────────────────────
export const PF_SHIFT_PATTERNS: PfShiftPattern[] = [
  {
    id: "three-shift",
    label: "3교대 (24시간 근무/48시간 휴무)",
    description: "야간·시간외 수당 포함 추정 월 45만원 추가",
    monthlyExtra: 450_000,
  },
  {
    id: "two-shift",
    label: "2교대 (근무지·보직별 상이)",
    description: "야간·시간외 수당 포함 추정 월 32.5만원 추가",
    monthlyExtra: 325_000,
  },
  {
    id: "admin",
    label: "행정직 (주간 근무)",
    description: "교대수당 없음",
    monthlyExtra: 0,
  },
];

// ── 기본 입력값 ──────────────────────────────────────────────
export const PF_DEFAULT_INPUT: PfInput = {
  org: "police",
  rankId: "rank-09",
  step: 1,
  hasSpouse: false,
  childCount: 0,
  shiftPatternId: "three-shift",
};

// ── 프리셋 ──────────────────────────────────────────────────
export const PF_PRESETS: PfPreset[] = [
  {
    id: "police-new",
    label: "순경 신규 임용",
    description: "경찰 순경 1호봉, 미혼",
    input: { org: "police", rankId: "rank-09", step: 1, hasSpouse: false, childCount: 0, shiftPatternId: "three-shift" },
  },
  {
    id: "fire-3shift",
    label: "소방사 3교대 5년차",
    description: "소방 소방사 6호봉, 3교대",
    input: { org: "fire", rankId: "rank-09", step: 6, hasSpouse: false, childCount: 0, shiftPatternId: "three-shift" },
  },
  {
    id: "police-sergeant",
    label: "경사 대표 호봉",
    description: "경찰 경사 8호봉, 배우자 + 자녀 1명",
    input: { org: "police", rankId: "rank-07", step: 8, hasSpouse: true, childCount: 1, shiftPatternId: "three-shift" },
  },
  {
    id: "fire-inspector",
    label: "소방위 대표 호봉",
    description: "소방 소방위 8호봉, 2교대, 배우자 + 자녀 1명",
    input: { org: "fire", rankId: "rank-06", step: 8, hasSpouse: true, childCount: 1, shiftPatternId: "two-shift" },
  },
  {
    id: "police-chief-inspector",
    label: "경감 대표 호봉",
    description: "경찰 경감 9호봉, 배우자 + 자녀 2명",
    input: { org: "police", rankId: "rank-05", step: 9, hasSpouse: true, childCount: 2, shiftPatternId: "admin" },
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const PF_FAQ: FaqItem[] = [
  {
    question: "경찰과 소방의 기본급은 같나요?",
    answer:
      "네. 경찰과 소방 모두 공무원보수규정 별표 10을 동일하게 적용받습니다. 같은 계급 상당·호봉이라면 기본급은 완전히 같으며, 차이는 소방의 교대근무수당(야간·시간외 포함)에서 주로 발생합니다.",
  },
  {
    question: "순경/소방사 1호봉 실수령액은 얼마인가요?",
    answer:
      "2026년 기준 1호봉 기본급은 2,133,000원입니다. 직급보조비(13.5만원)·정액급식비(16만원)·위험근무수당(8만원)을 더한 후 공제(연금·건강보험·소득세 등)를 적용하면 세후 실수령액은 미혼·부양가족 없음 기준 약 240만원대로 추정됩니다. 소방 3교대라면 교대수당이 추가되어 더 높아집니다.",
  },
  {
    question: "소방 교대근무수당은 얼마나 되나요?",
    answer:
      "3교대(24시간 근무/48시간 휴무)는 야간·시간외 수당을 포함해 월 약 30~60만원, 2교대는 약 20~45만원이 추가되는 것으로 추정됩니다. 이 계산기에서는 각각 45만원, 32.5만원을 대표값으로 사용합니다. 행정직 보직은 교대수당이 없습니다.",
  },
  {
    question: "정근수당가산금·정근수당은 어떻게 반영되나요?",
    answer:
      "정근수당은 근속연수에 비례해 기본급의 5~50%를 연 2회(1월·7월) 지급합니다. 이 계산기는 호봉을 근속연수의 근사치로 사용해 자동 계산하며, 연봉(세전/실수령) 계산에 포함되어 있습니다.",
  },
  {
    question: "계급이 올라가면 실수령액은 얼마나 늘어나나요?",
    answer:
      "계급이 오르면 기본급뿐 아니라 직급보조비도 함께 상승합니다. 예를 들어 순경(9급 상당, 13.5만원)에서 경위(6급 상당, 17.5만원)로 승진하면 직급보조비가 4만원 늘고, 기본급도 호봉 구조상 더 높은 구간으로 이동해 실수령액이 크게 증가합니다.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────────
export const PF_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/police-salary-2026/", label: "경찰관 계급별 연봉 2026" },
  { href: "/reports/firefighter-salary-2026/", label: "소방관 계급별 연봉 2026" },
  { href: "/tools/public-servant-salary-calculator/", label: "공무원 호봉 실수령액 계산기" },
  { href: "/tools/teacher-salary-calculator/", label: "교사 호봉 실수령액 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
];
