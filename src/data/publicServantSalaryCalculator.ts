// ============================================================
// 공무원 호봉 실수령액 계산기 (9급/8급/7급)
// 기본급·세후 추정: publicServantSalary2026.ts 데이터 재사용
// ============================================================

import {
  GRADE_7_HOBONG,
  GRADE_8_HOBONG,
  GRADE_9_HOBONG,
  type HobongRow,
} from "./publicServantSalary2026";

export interface PscStepRow {
  step: number;
  monthlyBase: number;
  monthlyNetEstimate: number;
}

export interface PscGrade {
  id: "9" | "8" | "7";
  label: string;
  jobGradeSupport: number;
  maxStep: number;
  steps: PscStepRow[];
}

export interface PscInput {
  grade: "9" | "8" | "7";
  step: number;
  hasSpouse: boolean;
  childCount: number;
}

export interface PscPreset {
  id: string;
  label: string;
  description: string;
  input: PscInput;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

const toSteps = (rows: HobongRow[]): PscStepRow[] =>
  rows.map((row) => ({
    step: row.no,
    monthlyBase: row.monthlyBase,
    monthlyNetEstimate: row.monthlyNetEstimate,
  }));

// ── Meta ──────────────────────────────────────────────────────
export const PSC_META = {
  title: "공무원 호봉 실수령액 계산기",
  seoTitle: "공무원 호봉 계산기 - 9급·8급·7급 월급·실수령액 2026",
  seoDescription:
    "9급·8급·7급 호봉과 가족수당, 근속연수를 입력하면 2026년 공무원보수규정 기준 월급과 세후 실수령액, 연봉을 계산하는 페이지",
  dataNote:
    "기본급은 인사혁신처 공무원보수규정 별표 3(2026.1.2 개정) 기준이며, 세후 실수령액은 미혼·부양가족 없음 가정에 가족수당 등을 더한 추정치입니다.",
} as const;

// ── 공통 수당 상수 ────────────────────────────────────────────
export const PSC_ALLOWANCES = {
  mealAllowance: 160_000,
  spouseAllowance: 40_000,
  childAllowance: 20_000,
  holidayBonusRate: 0.6,
  longevityBonusTiers: [
    { minStep: 16, amount: 150_000 },
    { minStep: 11, amount: 100_000 },
    { minStep: 6, amount: 50_000 },
  ],
} as const;

// ── 직급별 호봉표 ────────────────────────────────────────────
export const PSC_GRADES: PscGrade[] = [
  { id: "9", label: "9급", jobGradeSupport: 135_000, maxStep: 30, steps: toSteps(GRADE_9_HOBONG) },
  { id: "8", label: "8급", jobGradeSupport: 155_000, maxStep: 30, steps: toSteps(GRADE_8_HOBONG) },
  { id: "7", label: "7급", jobGradeSupport: 175_000, maxStep: 30, steps: toSteps(GRADE_7_HOBONG) },
];

// ── 기본 입력값 ──────────────────────────────────────────────
export const PSC_DEFAULT_INPUT: PscInput = {
  grade: "9",
  step: 1,
  hasSpouse: false,
  childCount: 0,
};

// ── 프리셋 ──────────────────────────────────────────────────
export const PSC_PRESETS: PscPreset[] = [
  {
    id: "new-9",
    label: "9급 신규 임용",
    description: "9급 1호봉, 미혼",
    input: { grade: "9", step: 1, hasSpouse: false, childCount: 0 },
  },
  {
    id: "9-5year",
    label: "9급 5년차",
    description: "9급 6호봉, 정근수당가산금 적용",
    input: { grade: "9", step: 6, hasSpouse: false, childCount: 0 },
  },
  {
    id: "8-10year",
    label: "8급 10년차",
    description: "8급 11호봉, 배우자 + 자녀 1명",
    input: { grade: "8", step: 11, hasSpouse: true, childCount: 1 },
  },
  {
    id: "7-15year",
    label: "7급 15년차",
    description: "7급 16호봉, 배우자 + 자녀 2명",
    input: { grade: "7", step: 16, hasSpouse: true, childCount: 2 },
  },
  {
    id: "7-30step",
    label: "7급 30호봉 (정년)",
    description: "7급 30호봉, 배우자 + 자녀 1명",
    input: { grade: "7", step: 30, hasSpouse: true, childCount: 1 },
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const PSC_FAQ: FaqItem[] = [
  {
    question: "9급 1호봉 실수령액은 얼마인가요?",
    answer:
      "2026년 기준 9급 1호봉 기본급은 2,133,000원입니다. 직급보조비(13.5만원)·정액급식비(16만원)를 더한 세후 실수령액은 미혼·부양가족 없음 기준 약 206만 원입니다. 가족수당이 추가되면 더 늘어납니다.",
  },
  {
    question: "8급·7급 봉급표는 9급과 다른가요?",
    answer:
      "네. 직급별로 별도의 봉급표가 적용되며, 직급보조비도 9급 13.5만원, 8급 15.5만원, 7급 17.5만원으로 다릅니다. 이 계산기의 8급·7급 봉급표는 공무원보수규정을 참고한 추정치입니다.",
  },
  {
    question: "가족수당은 어떻게 계산되나요?",
    answer:
      "배우자수당은 월 4만원, 자녀수당은 자녀 1인당 월 2만원입니다. 부양가족 등록이 되어 있어야 지급되며, 이 계산기에서는 배우자 유무와 자녀 수를 입력하면 자동으로 합산됩니다.",
  },
  {
    question: "정근수당가산금은 누가 받나요?",
    answer:
      "근속 5년 이상부터 매월 5만원, 10년 이상 10만원, 15년 이상 15만원이 고정 지급됩니다. 이 계산기는 호봉을 근속연수의 근사치로 사용해 자동 적용합니다.",
  },
  {
    question: "연봉에 포함된 명절휴가비와 정근수당은 무엇인가요?",
    answer:
      "명절휴가비는 설·추석 연 2회 각각 기본급의 60%가 지급됩니다. 정근수당은 근속연수에 따라 기본급의 5~50%를 연 2회(1월·7월) 지급하는 수당으로, 두 항목 모두 연봉 계산에 포함되어 있습니다.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────────
export const PSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/public-servant-salary-2026/", label: "공무원 9급 연봉·실수령액 가이드 2026" },
  { href: "/tools/teacher-salary-calculator/", label: "교사 호봉 실수령액 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/reports/police-salary-2026/", label: "경찰관 계급별 연봉 2026" },
  { href: "/reports/firefighter-salary-2026/", label: "소방관 계급별 연봉 2026" },
];
