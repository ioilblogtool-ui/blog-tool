// ============================================================
// 간호사 연차별 연봉·실수령 계산기
// 기반 데이터: nurseSalary2026.ts (병원 유형별 범위형 연봉·실수령 데이터)
// 나이트 횟수는 채용공고·현직자 제보 기반 추정 수당을 합산
// ============================================================

import { NURSE_HOSPITAL_TYPES, type NurseHospitalType } from "./nurseSalary2026";

export interface NscYearOption {
  value: number;
  label: string;
}

export interface NscNightShiftOption {
  id: string;
  label: string;
  monthlyExtraRange: [number, number];
}

export interface NscInput {
  hospitalTypeId: string;
  year: number;
  nightShiftId: string;
}

export interface NscPreset {
  id: string;
  label: string;
  description: string;
  input: NscInput;
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
export const NSC_META = {
  title: "간호사 연차별 연봉·실수령 계산기",
  seoTitle: "간호사 연봉 계산기 - 병원 유형·연차·나이트수당 실수령 2026",
  seoDescription:
    "병원 유형(빅5·대학병원·종합병원·중소병원·보건소·요양병원)과 연차, 나이트 근무 횟수를 입력하면 2026년 기준 연봉과 월 실수령액 범위를 추정하는 페이지",
  dataNote:
    "이 계산기는 채용공고·병원 공시·협회 자료·현직자 제보를 종합한 범위형 추정 데이터를 사용합니다. 실제 연봉·실수령액은 병원, 부서, 성과급 구조에 따라 달라질 수 있습니다.",
} as const;

// ── 연차 옵션 (병원 데이터의 yearlyProgression과 동일한 연차) ────
export const NSC_YEAR_OPTIONS: NscYearOption[] = [
  { value: 0, label: "신입" },
  { value: 1, label: "1년차" },
  { value: 3, label: "3년차" },
  { value: 5, label: "5년차" },
  { value: 7, label: "7년차" },
  { value: 10, label: "10년차" },
  { value: 15, label: "15년차" },
  { value: 20, label: "20년차" },
];

// ── 나이트 근무 횟수별 추정 추가 수당 ────────────────────────────
export const NSC_NIGHT_SHIFT_OPTIONS: NscNightShiftOption[] = [
  { id: "none", label: "나이트 없음 (데이·이브닝 위주)", monthlyExtraRange: [0, 0] },
  { id: "low", label: "월 4회 이하", monthlyExtraRange: [100_000, 200_000] },
  { id: "mid", label: "월 5~8회", monthlyExtraRange: [200_000, 300_000] },
  { id: "high", label: "월 9회 이상", monthlyExtraRange: [300_000, 400_000] },
];

// ── 병원 유형 데이터 (리포트와 동일 데이터 재사용) ────────────────
export const NSC_HOSPITAL_TYPES: NurseHospitalType[] = NURSE_HOSPITAL_TYPES;

// ── 기본 입력값 ──────────────────────────────────────────────
export const NSC_DEFAULT_INPUT: NscInput = {
  hospitalTypeId: "general",
  year: 0,
  nightShiftId: "mid",
};

// ── 프리셋 ──────────────────────────────────────────────────
export const NSC_PRESETS: NscPreset[] = [
  {
    id: "big5-new",
    label: "빅5 신규간호사",
    description: "빅5 상급종합병원, 신입, 월 5~8회 나이트",
    input: { hospitalTypeId: "big5", year: 0, nightShiftId: "mid" },
  },
  {
    id: "capital-5year",
    label: "수도권 대학병원 5년차",
    description: "수도권 대학병원, 5년차, 월 5~8회 나이트",
    input: { hospitalTypeId: "capital-univ", year: 5, nightShiftId: "mid" },
  },
  {
    id: "general-new",
    label: "종합병원 신규간호사",
    description: "종합병원, 신입, 월 5~8회 나이트",
    input: { hospitalTypeId: "general", year: 0, nightShiftId: "mid" },
  },
  {
    id: "public-7year",
    label: "보건소 7년차",
    description: "보건소·공공기관형, 7년차, 나이트 없음",
    input: { hospitalTypeId: "public-health", year: 7, nightShiftId: "none" },
  },
  {
    id: "local-small-3year",
    label: "중소병원 3년차",
    description: "중소·일반병원, 3년차, 월 9회 이상 나이트",
    input: { hospitalTypeId: "local-small", year: 3, nightShiftId: "high" },
  },
];

// ── FAQ ──────────────────────────────────────────────────────
export const NSC_FAQ: FaqItem[] = [
  {
    question: "간호사 연봉은 왜 범위로만 나오나요?",
    answer:
      "간호사 연봉은 공무원처럼 단일 봉급표가 없고, 병원 규모·지역·부서·성과급 구조에 따라 같은 연차에서도 차이가 큽니다. 이 계산기는 채용공고·병원 공시·현직자 제보를 종합한 범위형 추정치를 제공하며, 실제 금액은 병원별로 달라질 수 있습니다.",
  },
  {
    question: "나이트 횟수가 실수령에 얼마나 영향을 주나요?",
    answer:
      "월 나이트 근무 횟수에 따라 수당이 추가되며, 이 계산기에서는 월 4회 이하 10~20만원, 5~8회 20~30만원, 9회 이상 30~40만원을 추정 추가 수당으로 반영합니다. 실제 수당 기준은 병원별로 다릅니다.",
  },
  {
    question: "빅5 병원과 중소병원의 연봉 차이는 어느 정도인가요?",
    answer:
      "신입 기준으로도 연 1,000만원 이상 차이가 날 수 있고, 20년차 기준으로는 최대 2배 이상 차이가 날 수 있습니다. 다만 빅5는 업무강도가 높은 편이고 중소병원은 워라밸·진입장벽 측면에서 강점이 있을 수 있습니다.",
  },
  {
    question: "보건소·공공기관형 간호직도 이 계산기로 확인할 수 있나요?",
    answer:
      "네. 보건소·공공기관형은 병원형보다 초봉이 낮을 수 있지만 워라밸과 안정성이 강점입니다. 나이트 근무가 거의 없는 경우가 많아 '나이트 없음' 옵션을 선택하면 더 현실적인 추정치를 볼 수 있습니다.",
  },
  {
    question: "이 계산기의 결과를 실제 연봉 협상에 사용할 수 있나요?",
    answer:
      "참고용 추정치로만 활용하시길 권장합니다. 실제 연봉은 병원의 성과급 지급 기준, 직급 승진 속도, 부서 이동, 개인 평가 등에 따라 달라지므로 채용 시 병원에서 제공하는 정확한 급여 테이블을 함께 확인하는 것이 좋습니다.",
  },
];

// ── 관련 링크 ────────────────────────────────────────────────
export const NSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/nurse-salary-2026/", label: "간호사 연차별 연봉 + 병원 규모별 비교 2026" },
  { href: "/tools/salary/", label: "연봉 실수령 계산기" },
  { href: "/tools/salary-tier/", label: "연봉 티어 계산기" },
  { href: "/reports/police-salary-2026/", label: "경찰관 계급별 연봉 2026" },
  { href: "/reports/firefighter-salary-2026/", label: "소방관 계급별 연봉 2026" },
  { href: "/tools/police-firefighter-salary-calculator/", label: "경찰·소방 호봉 실수령액 계산기" },
];
