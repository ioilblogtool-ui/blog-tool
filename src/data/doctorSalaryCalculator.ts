// ============================================================
// 의사 근무 형태별 연봉·실수령 계산기
// 기반 데이터: doctorSalary2026.ts (근무형태별·전공과별·수련단계별 연봉 데이터)
// ============================================================

import {
  DOCTOR_TYPES,
  RESIDENT_STEPS,
  SPECIALTY_ROWS,
  DOCTOR_ALLOWANCES,
  DOCTOR_FAQ,
  type DoctorType,
  type ResidentStep,
  type SpecialtyRow,
  type DoctorAllowance,
} from "./doctorSalary2026";

export interface DscInput {
  workTypeId: DoctorType["id"];
  specialtyId: string;
  residentStage: string;
}

export interface DscPreset {
  id: string;
  label: string;
  description: string;
  input: DscInput;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

// ── Meta ──────────────────────────────────────────────────────
export const DSC_META = {
  title: "의사 연봉·실수령 계산기",
  seoTitle: "의사 연봉 계산기 - 전공의·봉직의·개원의·교수 실수령 2026",
  seoDescription:
    "근무 형태(전공의·전임의·봉직의·교수·개원의)와 전공과를 선택하면 2026년 기준 연봉과 월 실수령액 범위를 추정하는 페이지",
  dataNote:
    "이 계산기는 보건복지부 의료인력 실태조사, 전공의 수련 규정, 병원 공시 급여, 개원의 실태조사를 종합한 추정 데이터를 사용합니다. 실제 금액은 병원·지역·성과급 구조에 따라 크게 달라질 수 있습니다.",
} as const;

// ── 근무 형태 데이터 (리포트와 동일 데이터 재사용) ────────────────
export const DSC_WORK_TYPES: DoctorType[] = DOCTOR_TYPES;

// ── 수련 단계 데이터 (전공의·전임의용) ─────────────────────────
export const DSC_RESIDENT_STEPS: ResidentStep[] = RESIDENT_STEPS;

// 전공의(trainee)가 선택 가능한 수련 단계 (펠로우 제외)
export const DSC_TRAINEE_STAGES: ResidentStep[] = RESIDENT_STEPS.filter((step) => step.stage !== "fellow");

// ── 전공과 데이터 (봉직의·개원의용) ─────────────────────────────
export const DSC_SPECIALTIES: SpecialtyRow[] = SPECIALTY_ROWS;

// ── 수당 구조 ────────────────────────────────────────────────
export const DSC_ALLOWANCES: DoctorAllowance[] = DOCTOR_ALLOWANCES;

// ── 기본 입력값 ──────────────────────────────────────────────
export const DSC_DEFAULT_INPUT: DscInput = {
  workTypeId: "employee",
  specialtyId: "내과",
  residentStage: "인턴",
};

// ── 프리셋 ──────────────────────────────────────────────────
export const DSC_PRESETS: DscPreset[] = [
  {
    id: "intern",
    label: "인턴 1년차",
    description: "수련 1년차, 당직수당 포함 추정",
    input: { workTypeId: "trainee", specialtyId: "내과", residentStage: "인턴" },
  },
  {
    id: "resident-r3",
    label: "레지던트 3년차 (R3)",
    description: "전문의 시험 준비 전 단계",
    input: { workTypeId: "trainee", specialtyId: "내과", residentStage: "R3" },
  },
  {
    id: "internal-employee",
    label: "내과 봉직의",
    description: "병원 고용 전문의, 내과 기준",
    input: { workTypeId: "employee", specialtyId: "내과", residentStage: "인턴" },
  },
  {
    id: "plastic-self",
    label: "성형외과 개원의",
    description: "직접 운영, 미용 시술 비중 높음",
    input: { workTypeId: "self_employed", specialtyId: "성형외과", residentStage: "인턴" },
  },
  {
    id: "professor",
    label: "대학병원 교수",
    description: "진료·연구·교육 병행",
    input: { workTypeId: "professor", specialtyId: "내과", residentStage: "인턴" },
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const DSC_FAQ: FaqItem[] = DOCTOR_FAQ.map((item) => ({
  question: item.q,
  answer: item.a,
}));

// ── 관련 링크 ────────────────────────────────────────────────
export const DSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/doctor-salary-2026/", label: "의사 연봉·수입 완전 정리 2026" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/nurse-salary-calculator/", label: "간호사 연차별 연봉·실수령 계산기" },
  { href: "/reports/pharmacist-salary-2026/", label: "약사 연봉 실수령 2026" },
  { href: "/reports/professor-salary-2026/", label: "교수 연봉 2026" },
];
