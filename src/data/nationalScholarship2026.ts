import { TUITION_PRIVATE_2026 } from "./universityTuition2026";

export type MultiChildStatus = "NONE" | "SECOND" | "THIRD_OR_MORE";

export interface IncomeBracket {
  bracket: number; // 1~10
  monthlyIncomeCap: number | null; // 10구간은 상한 없음(초과)
  medianIncomeRatio: string; // "30%" 등, 표시용
}

// 2026년 학자금 지원구간 경곗값 — 한국장학재단 공식 확인
// ⚠️ 가구원수별 세분화 없이 확인된 대표값. 가구원 수 입력은 결과 요약에 컨텍스트로만 표시하며
//    구간 산정 계산에는 반영하지 않는다(design doc 0-7 참고). 정확한 가구원수별 경곗값은
//    실제 서비스 확대 시 kosaf.go.kr에서 재확인 필요.
export const NS_INCOME_BRACKETS: IncomeBracket[] = [
  { bracket: 1, monthlyIncomeCap: 1_948_421, medianIncomeRatio: "30%" },
  { bracket: 2, monthlyIncomeCap: 3_247_369, medianIncomeRatio: "50%" },
  { bracket: 3, monthlyIncomeCap: 4_546_317, medianIncomeRatio: "70%" },
  { bracket: 4, monthlyIncomeCap: 5_845_264, medianIncomeRatio: "90%" },
  { bracket: 5, monthlyIncomeCap: 6_494_738, medianIncomeRatio: "100%" },
  { bracket: 6, monthlyIncomeCap: 8_443_159, medianIncomeRatio: "130%" },
  { bracket: 7, monthlyIncomeCap: 9_742_107, medianIncomeRatio: "150%" },
  { bracket: 8, monthlyIncomeCap: 12_989_476, medianIncomeRatio: "200%" },
  { bracket: 9, monthlyIncomeCap: 19_484_214, medianIncomeRatio: "300%" },
  { bracket: 10, monthlyIncomeCap: null, medianIncomeRatio: "300% 초과" },
];

export interface ScholarshipAmountRow {
  minBracket: number;
  maxBracket: number;
  annualAmount: number; // 원 단위, 0이면 미지원
  label: string;
}

// 국가장학금 I유형 구간별 연간 지원금액 — 다수 소스 교차 확인(공공데이터포털·정부24·대학 공지 종합)
export const NS_SCHOLARSHIP_AMOUNTS: ScholarshipAmountRow[] = [
  { minBracket: 1, maxBracket: 3, annualAmount: 6_000_000, label: "1~3구간" },
  { minBracket: 4, maxBracket: 6, annualAmount: 4_400_000, label: "4~6구간" },
  { minBracket: 7, maxBracket: 8, annualAmount: 3_600_000, label: "7~8구간" },
  { minBracket: 9, maxBracket: 9, annualAmount: 1_000_000, label: "9구간" },
  { minBracket: 10, maxBracket: 10, annualAmount: 0, label: "10구간(미지원)" },
];

// 다자녀 가구 특례 (2026년부터 확대 적용)
export const NS_MULTI_CHILD = {
  SECOND: { upToBracket3: 6_100_000, bracket4to8: 5_050_000 },
  THIRD_OR_MORE: { fullTuitionUpToBracket: 8 }, // 8구간까지 등록금 전액
};

export function findIncomeBracket(monthlyIncome: number): number {
  const found = NS_INCOME_BRACKETS.find(
    (b) => b.monthlyIncomeCap !== null && monthlyIncome <= b.monthlyIncomeCap
  );
  return found ? found.bracket : 10;
}

export interface NsInput {
  householdSize: number; // 표시·컨텍스트용, 구간 산정에는 미반영
  householdMonthlyIncome: number;
  multiChildStatus: MultiChildStatus;
  annualTuition: number;
}

export interface NsResult {
  bracket: number;
  annualAmount: number;
  tuitionCoverageRatio: number; // 0~100(%)
}

// public/scripts/national-scholarship-calculator-2026.js와 1:1 대응 로직 — 값 변경 시 양쪽 동기화 필수
export function calcNationalScholarship(input: NsInput): NsResult {
  const bracket = findIncomeBracket(input.householdMonthlyIncome);

  let annualAmount =
    NS_SCHOLARSHIP_AMOUNTS.find((r) => bracket >= r.minBracket && bracket <= r.maxBracket)?.annualAmount ?? 0;

  if (input.multiChildStatus === "THIRD_OR_MORE" && bracket <= NS_MULTI_CHILD.THIRD_OR_MORE.fullTuitionUpToBracket) {
    annualAmount = input.annualTuition; // 등록금 전액
  } else if (input.multiChildStatus === "SECOND") {
    if (bracket <= 3) annualAmount = NS_MULTI_CHILD.SECOND.upToBracket3;
    else if (bracket <= 8) annualAmount = NS_MULTI_CHILD.SECOND.bracket4to8;
  }

  // 지원금은 등록금을 초과하지 않음
  annualAmount = Math.min(annualAmount, input.annualTuition);

  const tuitionCoverageRatio =
    input.annualTuition > 0 ? Math.min(Math.round((annualAmount / input.annualTuition) * 100), 100) : 0;

  return { bracket, annualAmount, tuitionCoverageRatio };
}

export const NS_DEFAULT_INPUT: NsInput = {
  householdSize: 4,
  householdMonthlyIncome: 5_000_000,
  multiChildStatus: "NONE",
  annualTuition: TUITION_PRIVATE_2026, // 페이지 기본 선택된 "사립" 칩과 값 일치
};

export const NS_META = {
  slug: "national-scholarship-calculator-2026",
  title: "국가장학금 계산기 2026",
  seoTitle: "국가장학금 계산기 2026 | 소득분위별 예상 지원금 바로 계산",
  seoDescription:
    "가구원 수·소득·재산을 입력하면 2026년 학자금 지원구간(1~10구간)과 예상 국가장학금 지원금을 바로 계산합니다. 다자녀 가구 혜택 비교 포함.",
  updatedAt: "2026-07-15",
  dataNote:
    "실제 소득인정액은 금융재산·부채·형제자매 수 등을 반영해 한국장학재단이 산정합니다. 이 계산은 월 소득 기준의 단순 추정이며 실제 지원구간과 다를 수 있습니다. 정확한 구간은 한국장학재단 학자금 지원구간 산정 신청 후 확인하세요.",
};

export const NS_FAQ = [
  {
    question: "국가장학금 소득분위는 어떻게 계산되나요?",
    answer:
      "부모(가구)의 소득과 재산을 합산한 '소득인정액'을 기준중위소득과 비교해 1~10구간으로 나눕니다. 2026년 기준 1구간은 월 194만 8,421원 이하, 5구간은 649만 4,738원 이하입니다.",
  },
  {
    question: "신입생과 재학생 신청 방법이 다른가요?",
    answer:
      "신청 시기와 절차는 유사하지만 신입생은 입학 전 소득 자료가 확정되지 않아 가결정으로 우선 지원받고, 이후 재확정 절차를 거치는 경우가 많습니다. 정확한 절차는 한국장학재단 공지를 확인하세요.",
  },
  {
    question: "다자녀 가구는 얼마나 더 받나요?",
    answer:
      "2026년부터 다자녀 가구는 첫째·둘째 1~3구간 610만 원, 4~8구간 505만 원까지 지원되며 셋째 이상 자녀는 8구간까지 등록금 전액이 지원됩니다.",
  },
  {
    question: "국가장학금 I유형과 II유형은 뭐가 다른가요?",
    answer:
      "I유형은 소득구간에 따라 학생 개인에게 정액 지급되고, II유형은 대학이 등록금 인하·장학금 확충 노력과 연계해 추가로 지원하는 제도로 대학별 지급액이 다릅니다.",
  },
  {
    question: "9구간, 10구간도 받을 수 있는 지원이 있나요?",
    answer:
      "9구간은 연 100만 원(학기당 50만 원)이 지원되며, 다자녀 가구는 8구간까지 확대 지원됩니다. 10구간은 국가장학금 I유형 지원 대상에서 제외됩니다.",
  },
  {
    question: "2026년 국가장학금 규모는 얼마나 되나요?",
    answer:
      "2026년 전체 예산은 역대 최대인 약 5조 1,161억 원, 수혜 인원은 약 150만 명 규모로 확대됐습니다. 1학기에만 108만 명이 2조 2,267억 원을 지원받았습니다.",
  },
  {
    question: "소득인정액에 재산도 포함되나요?",
    answer:
      "네, 부동산·금융재산·자동차 등을 소득으로 환산한 금액이 소득인정액에 포함됩니다. 이 계산기는 월 소득 위주의 단순 추정이라 실제 구간과 차이가 날 수 있습니다.",
  },
  {
    question: "계산된 예상 지원금으로 등록금 실부담금도 알 수 있나요?",
    answer:
      "네, 이 페이지의 예상 지원금을 대학 등록금 계산기의 '연간 장학금' 입력값에 넣으면 4년 실부담금을 함께 확인할 수 있습니다.",
  },
];

export const NS_SEO_CONTENT = {
  introTitle: "국가장학금, 신청 전에 예상 구간부터 확인하세요",
  intro: [
    "국가장학금은 등록금 부담을 줄여주는 대표 제도지만, '내가 몇 구간에 해당하는지', '얼마를 받을 수 있는지'를 신청 전에 알기 어렵다는 게 가장 큰 불편함입니다. 2026년 1학기에만 108만 명이 2조 2,267억 원을 지원받았고, 2026년 전체로는 역대 최대인 약 150만 명, 5조 1,161억 원 규모로 확대됐습니다.",
    "학자금 지원구간은 가구원 수와 소득·재산을 반영한 '소득인정액'을 기준중위소득과 비교해 1~10구간으로 나뉩니다. 2026년 기준 월 소득인정액이 194만 8,421원 이하면 1구간(기준중위소득 30%), 649만 4,738원 이하면 5구간(기준중위소득 100%)입니다. 이 계산기는 입력한 가구 소득을 이 경곗값과 비교해 예상 구간을 산출하고, 구간별 지원금액표와 매칭해 연간 예상 지원금을 계산합니다.",
    "구간이 낮을수록(1~3구간) 지원금이 크다는 점이 핵심입니다. 1~3구간은 연 최대 600만 원, 4~6구간은 440만 원, 7~8구간은 360만 원, 9구간은 100만 원이 지원되며 10구간은 지원 대상에서 제외됩니다. 다자녀 가구는 셋째 이상 자녀부터 8구간까지 등록금 전액이 지원되므로, 형제자매 수가 많다면 예상보다 훨씬 많은 지원을 받을 수 있습니다.",
    "이 계산기는 월 소득만으로 구간을 추정하는 단순화된 계산이며, 실제 학자금 지원구간은 금융재산·부채·자동차 가액 등을 종합한 소득인정액으로 한국장학재단이 별도 산정합니다. 정확한 구간과 지원금은 한국장학재단 홈페이지에서 학자금 지원구간 산정 신청 후 확인해야 하며, 이 결과는 신청 전 대략적인 예상치로만 활용하세요.",
  ],
  inputPoints: [
    "가구 월 소득을 입력하면 2026년 학자금 지원구간 경곗값과 즉시 비교해 예상 구간을 보여줍니다.",
    "다자녀 여부를 선택하면 확대된 2026년 다자녀 특례(8구간까지 등록금 전액 등)가 자동 반영됩니다.",
    "예상 지원금을 대학 등록금 계산기의 '연간 장학금' 입력값에 그대로 이어서 넣을 수 있습니다.",
  ],
  criteria: [
    "소득인정액 경곗값은 2026년 한국장학재단 공식 발표 기준입니다.",
    "이 계산은 월 소득만 반영하며, 실제 산정에 포함되는 재산·부채·자동차 가액은 반영하지 않습니다.",
    "가구원 수는 결과 요약에 표시만 되며 구간 산정 계산 자체에는 반영하지 않습니다.",
    "구간별 지원금액표는 다수 소스 교차 확인 수치이며 실제 금액과 차이가 있을 수 있습니다.",
  ],
};

export const NS_RELATED_LINKS = [
  {
    href: "/tools/university-cost-calculator-2026/",
    label: "대학 등록금 계산기 2026",
    description: "예상 국가장학금을 반영한 대학 4년 실부담금을 계산합니다.",
  },
  {
    href: "/tools/student-loan-repayment-calculator-2026/",
    label: "학자금대출 계산기 2026",
    description: "국가장학금으로 못 채운 부분을 대출로 충당할 때 예상 월 상환액을 계산합니다.",
  },
  {
    href: "/reports/university-student-welfare-benefits-2026/",
    label: "대학생 지원금 총정리 2026",
    description: "등록금·주거·취업준비 카테고리별 지원제도를 한 번에 확인합니다.",
  },
];

export const NS_CONFIG = {
  incomeBrackets: NS_INCOME_BRACKETS,
  scholarshipAmounts: NS_SCHOLARSHIP_AMOUNTS,
  multiChild: NS_MULTI_CHILD,
  defaultInput: NS_DEFAULT_INPUT,
};
