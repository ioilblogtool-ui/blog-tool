// ============================================================
// 약사 근무처별 연봉·실수령 계산기
// 기반 데이터: pharmacistSalary2026.ts (근무형태별·경력별·지역별 연봉 데이터)
// ============================================================

import {
  PHARMACIST_TYPES,
  CAREER_ROWS,
  REGION_ROWS,
  PHARMACIST_ALLOWANCES,
  PHARMACIST_FAQ,
  type PharmacistType,
  type CareerRow,
  type RegionRow,
  type PharmacistAllowance,
} from "./pharmacistSalary2026";

export interface PscInput {
  workTypeId: PharmacistType["id"];
  career: string;
  region: string;
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

// ── Meta ──────────────────────────────────────────────────────
export const PSC_META = {
  title: "약사 연봉·실수령 계산기",
  seoTitle: "약사 연봉 계산기 - 병원·약국·제약사·개국 실수령 2026",
  seoDescription:
    "근무 형태(병원약사·약국약사·제약사·공공기관·개국약사)와 경력, 지역을 선택하면 2026년 기준 연봉과 월 실수령액 범위를 추정하는 페이지",
  dataNote:
    "이 계산기는 대한약사회 실태조사, 병원약사회, 제약업계 공시 자료를 종합한 추정 데이터를 사용합니다. 실제 금액은 근무처·지역·성과급 구조에 따라 크게 달라질 수 있습니다.",
} as const;

// ── 근무 형태 데이터 (리포트와 동일 데이터 재사용) ────────────────
export const PSC_WORK_TYPES: PharmacistType[] = PHARMACIST_TYPES;

// ── 경력별 연봉 흐름 데이터 (병원·약국 봉직약사용) ────────────────
export const PSC_CAREER_ROWS: CareerRow[] = CAREER_ROWS;

// ── 지역별 데이터 (개국약사용) ───────────────────────────────
export const PSC_REGION_ROWS: RegionRow[] = REGION_ROWS;

// ── 수당·복리후생 ────────────────────────────────────────────
export const PSC_ALLOWANCES: PharmacistAllowance[] = PHARMACIST_ALLOWANCES;

// ── 기본 입력값 ──────────────────────────────────────────────
export const PSC_DEFAULT_INPUT: PscInput = {
  workTypeId: "community",
  career: "신입",
  region: "서울 기타",
};

// ── 프리셋 ──────────────────────────────────────────────────
export const PSC_PRESETS: PscPreset[] = [
  {
    id: "hospital-new",
    label: "병원약사 신입",
    description: "면허 취득 직후, 종합병원 약제부",
    input: { workTypeId: "hospital", career: "신입", region: "서울 기타" },
  },
  {
    id: "community-5year",
    label: "약국약사 5년차",
    description: "봉직약사, 경력 5년, 전문약사 자격 고려",
    input: { workTypeId: "community", career: "5년차", region: "서울 기타" },
  },
  {
    id: "pharma",
    label: "제약·바이오 약사",
    description: "제약사 영업·마케팅·연구·RA 등",
    input: { workTypeId: "pharma", career: "신입", region: "서울 기타" },
  },
  {
    id: "public",
    label: "공공기관·공무원 약사",
    description: "식약처·건강보험공단·보건소 등",
    input: { workTypeId: "public", career: "신입", region: "서울 기타" },
  },
  {
    id: "owner-gangnam",
    label: "강남 개국약사",
    description: "서울 강남·서초 개국, 처방전 수 많음",
    input: { workTypeId: "owner", career: "신입", region: "서울 강남·서초" },
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const PSC_FAQ: FaqItem[] = PHARMACIST_FAQ.map((item) => ({
  question: item.q,
  answer: item.a,
}));

// ── 관련 링크 ────────────────────────────────────────────────
export const PSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/pharmacist-salary-2026/", label: "약사 연봉·수입 완전 정리 2026" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/tools/doctor-salary-calculator/", label: "의사 연봉·실수령 계산기" },
  { href: "/tools/nurse-salary-calculator/", label: "간호사 연차별 연봉·실수령 계산기" },
  { href: "/reports/doctor-salary-2026/", label: "의사 연봉 2026" },
];
