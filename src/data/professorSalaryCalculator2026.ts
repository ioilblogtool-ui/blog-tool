// ============================================================
// 대학교수 연봉 계산기 2026
// 기반 데이터: professorSalary2026.ts (직급·대학유형별 연봉, 연구비 수입)
// 국립대·사립상위권은 리포트 실측값 그대로, 사립중위권·지방사립은
// 국립대 직급 간 상대 비중을 적용한 보간 추정값 — dataNote에 명시
// ============================================================

import {
  PROFESSOR_TYPES,
  RANK_ROWS,
  RESEARCH_INCOME,
  PF_HERO_STATS,
  type ProfessorType,
  type RankRow,
} from "./professorSalary2026";

export { PROFESSOR_TYPES, RANK_ROWS, RESEARCH_INCOME };

// ── 타입 ──────────────────────────────────────────
export type UniversityTypeId = "national" | "private_top" | "private_mid" | "private_local";
export type RankName = "조교수" | "부교수" | "교수" | "석좌교수";
export type CalculatorMode = "fulltime" | "adjunct";
export type SourceKind = "공시 기반" | "추정 보간";

export interface UniversityTypeOption {
  id: UniversityTypeId;
  label: string;
  sourceKind: SourceKind;
}

export interface RankBand {
  min: number;
  max: number;
  sourceKind: SourceKind;
}

export interface PscPreset {
  id: string;
  label: string;
  summary: string;
  input: {
    mode: CalculatorMode;
    typeId?: UniversityTypeId;
    rank?: RankName;
    years?: number;
  };
}

export interface PscFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

// ── 메타 ──────────────────────────────────────────
export const PSC_META = {
  slug: "professor-salary-calculator-2026",
  title: "대학교수 연봉 계산기 2026",
  seoTitle: "대학교수 연봉 계산기 2026 | 직급·대학유형별 예상 연봉 바로 계산",
  seoDescription:
    "대학 유형(국립·사립상위·사립중위·지방사립)과 직급·연차 입력하면 2026년 예상 연봉 범위를 바로 계산합니다. 시간강사 강의료 계산, 연구비 수입 참고자료도 함께 제공합니다.",
  dataNote:
    "국립대·사립 상위권 직급별 수치는 「대학교수 연봉 완전 정리 2026」 리포트의 교육부 재정정보공시·공무원보수규정 기준 실측 추정치를 그대로 사용합니다. 사립 중위권·지방 사립은 직급별 공시 자료가 없어, 국립대 직급 간 상대적 비중을 해당 대학유형의 전체 연봉 범위에 적용한 추정 보간값이며 표에 '추정 보간' 배지로 구분 표시합니다. 연구비 등 추가 수입은 개인별 편차가 너무 커서 계산에 합산하지 않고 참고자료로만 제공합니다.",
  updatedAt: "2026-07-16",
};

// ── 대학 유형 옵션 (adjunct 제외 — 시간강사는 별도 모드) ──
export const PSC_UNIVERSITY_TYPES: UniversityTypeOption[] = [
  { id: "national", label: "국립대", sourceKind: "공시 기반" },
  { id: "private_top", label: "사립 상위권", sourceKind: "공시 기반" },
  { id: "private_mid", label: "사립 중위권", sourceKind: "추정 보간" },
  { id: "private_local", label: "지방 사립", sourceKind: "추정 보간" },
];

export const PSC_RANKS: RankName[] = ["조교수", "부교수", "교수", "석좌교수"];

// 직급별 연차 슬라이더 범위 (석좌교수는 연차 개념 없음 → null)
export const PSC_RANK_YEARS: Record<RankName, { min: number; max: number } | null> = {
  조교수: { min: 1, max: 6 },
  부교수: { min: 6, max: 12 },
  교수: { min: 12, max: 30 },
  석좌교수: null,
};

function findRankRow(rank: RankName): RankRow {
  const row = RANK_ROWS.find((r) => r.rank === rank);
  if (!row) throw new Error(`RANK_ROWS에 ${rank} 없음`);
  return row;
}

function findProfessorType(id: UniversityTypeId): ProfessorType {
  const type = PROFESSOR_TYPES.find((t) => t.id === id);
  if (!type) throw new Error(`PROFESSOR_TYPES에 ${id} 없음`);
  return type;
}

// 국립대 전체 스팬 (조교수 최솟값 ~ 석좌교수 최댓값) — 보간 기준선
const NATIONAL_SPAN_MIN = findRankRow("조교수").nationalMin; // 58,000,000
const NATIONAL_SPAN_MAX = findRankRow("석좌교수").nationalMax; // 200,000,000
const NATIONAL_SPAN = NATIONAL_SPAN_MAX - NATIONAL_SPAN_MIN; // 142,000,000

// ── 직급×대학유형 밴드 조회 (핵심 함수) ──────────────
// national/private_top: RANK_ROWS 실측값 그대로
// private_mid/private_local: 국립대 직급 간 상대 비중을 유형 전체 범위(PROFESSOR_TYPES)에 적용해 보간
export function getRankBand(typeId: UniversityTypeId, rank: RankName): RankBand {
  const rankRow = findRankRow(rank);

  if (typeId === "national") {
    return { min: rankRow.nationalMin, max: rankRow.nationalMax, sourceKind: "공시 기반" };
  }
  if (typeId === "private_top") {
    return { min: rankRow.privateTopMin, max: rankRow.privateTopMax, sourceKind: "공시 기반" };
  }

  const type = findProfessorType(typeId);
  const typeSpan = type.annualMax - type.annualMin;
  const fracMin = (rankRow.nationalMin - NATIONAL_SPAN_MIN) / NATIONAL_SPAN;
  const fracMax = (rankRow.nationalMax - NATIONAL_SPAN_MIN) / NATIONAL_SPAN;

  return {
    min: Math.round(type.annualMin + fracMin * typeSpan),
    max: Math.round(type.annualMin + fracMax * typeSpan),
    sourceKind: "추정 보간",
  };
}

// ── 연차 → 밴드 내 위치 보간 ─────────────────────────
export interface SalaryEstimate {
  point: number;
  band: RankBand;
  ratio: number; // 0~1, 밴드 내 상대 위치 (게이지용)
  hasYearsInput: boolean;
}

export function estimateFulltimeSalary(typeId: UniversityTypeId, rank: RankName, years: number): SalaryEstimate {
  const band = getRankBand(typeId, rank);
  const range = PSC_RANK_YEARS[rank];

  if (!range) {
    // 석좌교수: 연차 미적용, 밴드 중간값
    return { point: Math.round((band.min + band.max) / 2), band, ratio: 0.5, hasYearsInput: false };
  }

  const ratio = Math.min(Math.max((years - range.min) / (range.max - range.min), 0), 1);
  const point = Math.round(band.min + ratio * (band.max - band.min));
  return { point, band, ratio, hasYearsInput: true };
}

// ── 시간강사(비전임) 계산 ─────────────────────────────
export function calcAdjunctPay(input: { perCredit: number; creditsPerSemester: number; semestersPerYear: number }) {
  const annual = input.perCredit * input.creditsPerSemester * input.semestersPerYear;
  return { annual, monthly: annual / 12 };
}

// ── 기본 입력값 ──────────────────────────────────────
export const PSC_DEFAULT_INPUT = {
  mode: "fulltime" as CalculatorMode,
  typeId: "national" as UniversityTypeId,
  rank: "조교수" as RankName,
  years: 3,
  perCredit: PF_HERO_STATS.adjunctPerCredit, // 650,000
  creditsPerSemester: 6,
  semestersPerYear: 2,
};

// ── 프리셋 ────────────────────────────────────────────
export const PSC_PRESETS: PscPreset[] = [
  {
    id: "national-assistant",
    label: "국립대 조교수 3년차",
    summary: "임용 초기 국립대 조교수",
    input: { mode: "fulltime", typeId: "national", rank: "조교수", years: 3 },
  },
  {
    id: "private-top-associate",
    label: "사립 상위권 부교수 9년차",
    summary: "테뉴어 취득 후 SKY·주요사립",
    input: { mode: "fulltime", typeId: "private_top", rank: "부교수", years: 9 },
  },
  {
    id: "private-mid-full",
    label: "사립 중위권 정교수 18년차",
    summary: "수도권 일반 사립대 정교수",
    input: { mode: "fulltime", typeId: "private_mid", rank: "교수", years: 18 },
  },
  {
    id: "local-full",
    label: "지방 사립 정교수 20년차",
    summary: "지방 사립대 정교수",
    input: { mode: "fulltime", typeId: "private_local", rank: "교수", years: 20 },
  },
  {
    id: "distinguished",
    label: "석좌교수",
    summary: "최고 권위자, 협상형 별도 계약",
    input: { mode: "fulltime", typeId: "private_top", rank: "석좌교수" },
  },
  {
    id: "adjunct-typical",
    label: "시간강사 (주 6학점·2학기)",
    summary: "일반적인 비전임 시간강사",
    input: { mode: "adjunct" },
  },
];

// ── FAQ ──────────────────────────────────────────────
export const PSC_FAQ: PscFaqItem[] = [
  {
    question: "이 계산기의 연봉은 실제 계약 연봉과 같나요?",
    answer:
      "아닙니다. 국립대·사립 상위권은 교육부 재정정보공시·공무원보수규정 기준 추정치이고, 사립 중위권·지방 사립은 국립대 직급 간 상대 비중을 적용한 보간 추정값입니다. 대학별 재정 상태, 개인 성과급, 보직 수당에 따라 실제 연봉은 이 범위보다 높거나 낮을 수 있습니다.",
  },
  {
    question: "사립중위권·지방사립의 직급별 수치는 어떻게 계산되나요?",
    answer:
      "국립대는 조교수부터 석좌교수까지 직급별 공시 자료가 있지만, 사립 중위권·지방 사립은 대학 전체의 연봉 범위만 공개돼 있고 직급별 세부 자료가 없습니다. 그래서 국립대에서 관찰되는 '직급이 하나 오를 때마다 전체 밴드 안에서 차지하는 상대적 위치'를 그대로 사립 중위권·지방 사립의 전체 범위에 적용해 추정합니다. 실측 자료가 아니라 비율을 이용한 보간값이라는 점에 유의하세요.",
  },
  {
    question: "석좌교수는 왜 연차를 입력하지 않나요?",
    answer:
      "석좌교수는 정규 임용·승진 절차가 아니라 대학이 최고 권위자를 개별 협상으로 영입하는 별도 계약직입니다. 연차가 쌓여 자동으로 승진하는 자리가 아니라서, 이 계산기는 연차 슬라이더 대신 해당 대학유형의 석좌교수 밴드 중간값을 보여줍니다.",
  },
  {
    question: "시간강사 강의료는 왜 따로 계산하나요?",
    answer:
      "시간강사(비전임)는 연봉이 아니라 학점당 강의료로 급여가 산정되는 완전히 다른 구조입니다. 조교수~석좌교수처럼 연차에 따라 연봉이 오르는 개념이 없어, 학점당 단가 × 학기당 학점수 × 연간 학기 수로 별도 계산합니다.",
  },
  {
    question: "연구비 수입은 왜 계산에 포함되지 않나요?",
    answer:
      "정부 연구과제비는 수주 여부에 따라 연 3,000만 원에서 2억 원 이상까지 편차가 극단적으로 큽니다. 이를 예상 연봉 계산에 합산하면 실제보다 훨씬 부정확한 숫자가 나올 수 있어, 이 계산기는 연구비를 계산에 넣지 않고 참고용 표로만 별도 제공합니다.",
  },
  {
    question: "국립대와 사립대 중 어디가 더 유리한가요?",
    answer:
      "단순 기본급만 보면 사립 상위권이 국립대보다 높은 경우가 많습니다. 하지만 국립대는 공무원연금 적용, 정년 65세 보장 같은 비금전적 안정성이 있고, 사립대는 대학 재정 상태에 따라 처우가 크게 달라질 수 있습니다. 목적(안정성 vs 기본급)에 따라 유리한 쪽이 달라집니다.",
  },
];

// ── 내부 링크 ─────────────────────────────────────────
export const PSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/professor-salary-2026/", label: "대학교수 연봉 완전 정리 2026 (리포트)", description: "직급·대학유형별 상세 비교와 연구비 수입 구조를 확인합니다." },
  { href: "/tools/salary/", label: "연봉 실수령 계산기", description: "이 계산기의 예상 연봉을 넣고 세후 실수령을 확인합니다." },
  { href: "/reports/teacher-salary-2026/", label: "교사 연봉·호봉 완전 정리 2026", description: "교육직 연봉 시리즈 — 초중고 교사 편." },
  { href: "/reports/doctor-salary-2026/", label: "의사 연봉 완전 비교 2026", description: "전문직 연봉 비교." },
  { href: "/tools/doctor-salary-calculator/", label: "의사 연봉·실수령 계산기", description: "전문직 컴패니언 계산기 참고." },
  { href: "/reports/public-servant-salary-2026/", label: "공무원 9급 연봉 2026", description: "국립대 교수(공무원 신분)와 공무원 연봉 비교." },
];

// ── SEO 텍스트 (800자 이상, 5단락 이상) ────────────────
export const PSC_SEO_CONTENT = {
  introTitle: "대학교수 연봉, 대학유형·직급·연차를 넣고 직접 계산해보세요",
  intro: [
    "대학교수 연봉은 직급과 대학유형에 따라 편차가 매우 큽니다. 「대학교수 연봉 완전 정리 2026」 리포트가 전체 구조를 보여준다면, 이 계산기는 내가 해당하는 대학유형·직급·연차를 직접 입력해 구체적인 예상 연봉 범위를 바로 확인할 수 있도록 만든 도구입니다.",
    "국립대와 사립 상위권은 조교수부터 석좌교수까지 직급별 공시 자료가 있어 비교적 신뢰도 높은 추정치를 제공합니다. 반면 사립 중위권·지방 사립대학은 대학 전체의 연봉 범위만 공개돼 있고 직급별 세부 자료가 없어, 이 계산기는 국립대에서 관찰되는 직급 간 상대적 비중을 적용해 추정 보간값을 계산합니다. 이 두 가지를 표에서 '공시 기반'과 '추정 보간'으로 명확히 구분해 보여줍니다.",
    "같은 직급이라도 연차에 따라 연봉이 달라집니다. 조교수는 임용 후 1~6년, 부교수는 6~12년, 교수는 12년차 이상 구간에서 각각 밴드 내 위치가 달라지며, 이 계산기는 입력한 연차를 밴드 안의 상대적 위치로 환산해 하나의 예상 금액(포인트 추정치)을 제시합니다. 다만 석좌교수는 연차에 따라 자동 승진하는 자리가 아니라 대학의 개별 협상으로 영입되는 별도 계약직이라 연차 입력 없이 밴드 중간값을 보여줍니다.",
    "시간강사(비전임)는 연봉이 아니라 학점당 강의료로 급여가 산정되는 다른 구조이기 때문에 별도 모드로 분리했습니다. 학점당 단가, 학기당 강의 학점수, 연간 학기 수를 입력하면 예상 연 강의료를 계산합니다. 방학 중에는 강의가 배정되지 않을 수 있어 실제 연간 수입은 이보다 불안정할 수 있습니다.",
    "정부 연구과제비, 산학협력비, 외부 강연료 같은 연구비 수입은 개인의 수주 실적에 따라 연 3,000만 원에서 2억 원 이상까지 편차가 매우 큽니다. 이 계산기는 이런 변동성이 큰 항목을 예상 연봉 계산에 합산하지 않고, 참고용 표로만 별도로 제공합니다. 실제 연봉과 이 계산기의 결과가 다르다면 연구비 수입, 보직 수당, 대학별 개별 조건 때문일 가능성이 큽니다.",
  ],
  inputPoints: [
    "대학유형(국립·사립상위·사립중위·지방사립)과 직급(조교수~석좌교수), 연차를 입력하면 예상 연봉 범위를 바로 계산합니다.",
    "같은 직급을 4개 대학유형에서 동시에 비교해 어느 유형이 얼마나 유리한지 확인할 수 있습니다.",
    "시간강사는 학점당 단가·강의 학점수·학기 수를 입력해 예상 연 강의료를 별도로 계산합니다.",
  ],
  criteria: [
    "국립대·사립 상위권 직급별 수치는 교육부 재정정보공시·공무원보수규정 기준 실측 추정치입니다.",
    "사립 중위권·지방 사립의 직급별 수치는 국립대 직급 간 상대 비중을 적용한 추정 보간값입니다(실측 아님, 표에 배지로 구분).",
    "연구비 등 추가 수입은 개인별 편차가 매우 커서 계산에 합산하지 않고 참고자료로만 제공합니다.",
    "이 계산기의 결과는 자가 점검용 추정치이며, 정확한 처우는 해당 대학을 통해 확인해야 합니다.",
  ],
};

// ── 클라이언트 스크립트에 주입할 설정 객체 ──────────────
export const PSC_CLIENT_CONFIG = {
  professorTypes: PROFESSOR_TYPES,
  rankRows: RANK_ROWS,
  rankYears: PSC_RANK_YEARS,
  universityTypes: PSC_UNIVERSITY_TYPES,
  ranks: PSC_RANKS,
  presets: PSC_PRESETS,
  defaultInput: PSC_DEFAULT_INPUT,
};
