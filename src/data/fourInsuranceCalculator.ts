// 4대보험 계산기 2027 갱신 — 화면 문구·기본값·FAQ
// 요율·상하한은 socialInsuranceRules.ts(기간별 규칙)에서만 가져온다.
// 2026 요율표 리포트(employeeTaxInsuranceRates2026.ts)는 이 파일이 덮어쓰지 않는다.
import { SOCIAL_INSURANCE_RULES } from "./socialInsuranceRules";

export interface FourInsurancePreset {
  label: string;
  monthlySalary: number;
  taxFreeAmount: number;
}

export const FIC_META = {
  slug: "four-insurance-calculator",
  h1: "4대보험 계산기 2027: 2026년과 월 공제액 비교",
  seoTitle: "4대보험 계산기 2027 | 국민연금·건강보험·고용보험 공제액 비교",
  seoDescription:
    "월급과 보험별 산정 기준을 입력해 2026·2027 근로자 보험료 공제액을 비교하세요. 국민연금, 건강보험·장기요양, 고용보험을 항목별로 확인합니다.",
  description:
    "같은 월급에서 2027년 보험료 공제액이 2026년보다 얼마나 달라지는지 항목별로 보여줍니다. 아직 확정되지 않은 요율은 합계에 몰래 넣지 않고 따로 표시합니다.",
  updatedAt: "2026-11-10",
};

export const FIC_DEFAULT_INPUT = {
  comparisonMode: "same_basis",
  beforeMonth: "2026-11",
  afterMonth: "2027-01",
  monthlySalary: 4_000_000,
  taxFreeAmount: 200_000,
  beforeMonthlySalary: 4_000_000,
  beforeTaxFreeAmount: 200_000,
  basisMode: "simple_estimate",
  applicability: { pension: "applies", health: "applies", employment: "applies" },
  employmentScenario: false,
  taxMode: "excluded",
  dependents: 1,
  children: 0,
  showEmployerShare: false,
};

export const FIC_PRESETS: FourInsurancePreset[] = [
  { label: "월 300만원", monthlySalary: 3_000_000, taxFreeAmount: 200_000 },
  { label: "월 400만원", monthlySalary: 4_000_000, taxFreeAmount: 200_000 },
  { label: "월 500만원", monthlySalary: 5_000_000, taxFreeAmount: 200_000 },
  { label: "월 700만원", monthlySalary: 7_000_000, taxFreeAmount: 200_000 },
];

/** 화면 상단 요율 상태 안내 — 규칙 데이터의 status와 같은 내용 */
export const FIC_RULE_STATUS = [
  { kind: "국민연금", value: "4.75% → 5%", status: "verified", text: "2027년 요율 확정(연금개혁 단계 인상). 기준소득월액 상·하한은 2027년 6월분까지 확인" },
  { kind: "건강보험", value: "3.595% 유지", status: "announced", text: "2027년 7.19% 동결 의결. 2027년 보험료 상·하한은 고시 전" },
  { kind: "장기요양", value: "13.14% → 13.90%", status: "announced", text: "건강보험료 대비 비율. 2026년 10월 장기요양위원회 의결" },
  { kind: "고용보험", value: "0.9% → 1.0%(정부안)", status: "scenario", text: "법령 개정 전이라 기본 합계에서 빼고, 원하면 가정으로만 계산" },
];

export const FIC_STATUS_LABELS: Record<string, string> = {
  verified: "시행 기준 확인",
  announced: "의결·발표",
  scenario: "가정 적용",
  unknown: "확인 필요",
};

export const FIC_GUIDES = [
  {
    title: "국민연금",
    body: "기준소득월액(천원 미만 버림)에 2026년 4.75%, 2027년 5%를 곱합니다. 상한 659만원·하한 41만원은 2027년 6월분까지 적용되고, 2027년 7월 이후 상·하한은 아직 고시 전이라 계산하지 않습니다.",
  },
  {
    title: "건강보험·장기요양",
    body: "건강보험은 보수월액의 3.595%를 근로자가 냅니다(2027년 동결 의결). 장기요양은 건강보험료에 연동 비율을 곱해 2026년 13.14%, 2027년 13.90%입니다. 소득 대비 요율(0.9994%)을 건강보험료에 바로 곱하지 않습니다.",
  },
  {
    title: "고용보험",
    body: "근로자 실업급여 부담은 2026년 0.9%입니다. 2027년 1.0% 인상은 정부안 단계라 기본 결과에서는 '확인 전'으로 두고, 가정 옵션을 켤 때만 별도 합계로 보여줍니다.",
  },
  {
    title: "세금과 실수령액",
    body: "기본 결과는 '보험료 공제 후 금액'입니다. 급여명세서의 소득세를 직접 넣으면 추정 수령액을, 간이 추정을 켜면 참고용 세금을 함께 보여줍니다. 국세청 간이세액표 계산은 아닙니다.",
  },
];

export const FIC_RELATED = [
  { href: "/reports/employee-tax-insurance-rates-2026/", label: "2026 직장인 세금·4대보험 요율표" },
  { href: "/tools/salary/", label: "연봉 인상 계산기" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급 계산기" },
  { href: "/reports/2026-year-end-tax-saving-guide/", label: "2026 연말정산 절세 가이드" },
  { href: "/tools/national-pension-calculator/", label: "국민연금 예상수령액 계산기" },
];

export const FIC_FAQ = [
  {
    question: "4대보험인데 왜 장기요양보험이 따로 보이나요?",
    answer:
      "장기요양보험은 건강보험료에 연동 비율을 곱해 따로 고지되는 보험료입니다. 2026년은 건강보험료의 13.14%, 2027년은 13.90%로 의결됐습니다. 그래서 급여명세서에도 건강보험과 별도 줄로 나옵니다.",
  },
  {
    question: "산재보험은 왜 월급에서 빠지지 않나요?",
    answer: "산재보험료는 전액 회사가 부담합니다. 근로자 공제 합계와 공제 후 금액에는 넣지 않습니다.",
  },
  {
    question: "비과세 식대는 무엇을 입력하나요?",
    answer:
      "월 급여에 포함된 법정 비과세 금액(예: 식대 월 20만원)을 넣습니다. 비과세는 보험료 산정 기준을 줄일 뿐, 실제로 받는 급여에서 한 번 더 빼지 않습니다.",
  },
  {
    question: "월급이 같은데 2027년 보험료가 다른 이유는 무엇인가요?",
    answer:
      "국민연금 요율이 4.75%에서 5%로, 장기요양 비율이 13.14%에서 13.90%로 오르기 때문입니다. 건강보험료율은 동결이라 같은 보수월액이면 금액이 같습니다. 고용보험은 정부안이 확정되면 함께 달라집니다.",
  },
  {
    question: "국민연금과 건강보험의 기준 금액은 같은가요?",
    answer:
      "같지 않을 수 있습니다. 국민연금은 신고한 기준소득월액(천원 단위, 상·하한 적용)을, 건강보험은 보수월액을 씁니다. 급여명세서 기준이 다르면 고급 입력에서 보험별 기준 금액을 따로 넣으세요.",
  },
  {
    question: "회사 부담은 얼마인가요?",
    answer:
      "회사 부담 참고액을 켜면 국민연금·건강보험·장기요양 회사분과 고용보험 실업급여 회사분을 보여줍니다. 고용안정·직업능력개발 사업분과 산재보험은 사업장 규모·업종에 따라 달라 포함하지 않았습니다.",
  },
  {
    question: "프리랜서나 지역가입자도 쓸 수 있나요?",
    answer:
      "이 계산기는 사업장에 고용된 일반 근로자의 월 보험료만 계산합니다. 지역가입자 건강보험료(소득·재산 점수)와 프리랜서 사회보험은 범위 밖입니다.",
  },
  {
    question: "급여명세서 금액과 왜 조금 다른가요?",
    answer:
      "회사가 신고한 기준소득월액·보수월액이 실제 월급과 다를 수 있고, 연말·보수총액 정산분이 더해지기도 합니다. 단수 처리도 통용 방식(국민연금 원 미만, 건강·장기요양·고용 10원 미만 버림)으로 계산해 몇십 원 차이가 날 수 있습니다.",
  },
  {
    question: "2027년 미확정 요율은 어떻게 처리하나요?",
    answer:
      "확정·의결된 항목만 계산하고, 고용보험처럼 정부안 단계인 요율은 기본 합계에서 뺍니다. '정부안 가정' 옵션을 켜면 가정 합계를 따로 보여주며, 확정 합계와 같은 배지로 표시하지 않습니다.",
  },
  {
    question: "월 차이에 12를 곱하면 연간 보험료 차이인가요?",
    answer:
      "12개월 내내 같은 조건이라고 가정한 값일 뿐입니다. 국민연금 상·하한이 7월에 바뀌고 정산분도 생기므로 실제 연간 합계와는 다를 수 있습니다.",
  },
];

export const FIC_SEO_INTRO = [
  "4대보험 계산기 2027은 같은 월급에서 2026년과 2027년 근로자 보험료 공제액이 얼마나 달라지는지 항목별로 비교합니다. 국민연금은 연금개혁에 따라 2027년 근로자 부담이 4.75%에서 5%로 오르고, 장기요양보험은 건강보험료 대비 13.14%에서 13.90%로 오릅니다. 건강보험료율은 7.19%로 동결이 의결돼 같은 보수월액이면 금액이 같습니다.",
  "고용보험은 2027년 실업급여 요율을 1.8%에서 2.0%로 올리는 정부안이 나왔지만 법령 개정과 시행일이 확정되지 않았습니다. 그래서 기본 결과에서는 고용보험을 '확인 전'으로 두고, 확정·의결된 항목만 더한 소계와 그 범위를 함께 보여줍니다. 정부안 가정을 켜면 가정 합계를 따로 계산하되 확정 합계와 섞지 않습니다.",
  "국민연금은 다른 보험과 기준이 다릅니다. 신고한 소득월액에서 천원 미만을 버리고, 2026년 7월부터 2027년 6월까지는 하한 41만원·상한 659만원 범위로 맞춥니다. 이 계산기의 국민연금은 국민연금 보험료 계산 공용 모듈을 그대로 써서, 같은 입력이면 어느 화면에서나 같은 결과와 규칙 버전을 냅니다. 2027년 7월 이후 상·하한은 고시 전이라 그 달은 계산하지 않습니다.",
  "결과의 기본 금액은 '보험료 공제 후 금액'입니다. 소득세는 회사가 고르는 원천징수 비율과 국세청 간이세액표에 따라 달라 자동 확정 계산을 하지 않습니다. 급여명세서의 소득세·지방소득세를 직접 넣으면 추정 수령액을, 간이 추정을 켜면 참고용 세금을 보여줍니다. 회사 부담 참고액은 지원 항목만 더한 값이며 산재보험은 포함하지 않습니다.",
];

export const FIC_INPUT_POINTS = [
  "세전 월 급여와 비과세 금액을 넣으면 급여에서 비과세를 뺀 값을 보험별 산정 기준 추정치로 씁니다.",
  "급여명세서에 보험별 기준 금액이 있으면 고급 입력에서 국민연금·건강보험·고용보험 기준을 따로 넣으세요.",
  "급여 변화 포함 비교를 고르면 2026년과 2027년 월급을 각각 넣을 수 있습니다.",
];

export const FIC_CRITERIA = [
  "국민연금: 기준소득월액(천원 미만 버림, 상·하한) × 2026년 4.75% / 2027년 5%",
  "건강보험: 보수월액 × 3.595%, 10원 미만 버림. 2026년 보험료 상한 월 9,183,480원·하한 20,160원(전체 기준)",
  "장기요양: 건강보험료 × 연동 비율(2026년 0.9448÷7.19, 2027년 0.9994÷7.19), 10원 미만 버림",
  "고용보험: 보수 × 0.9%(2026). 2027년 1.0%는 정부안 — 가정 옵션에서만 사용",
  `요율·상하한 확인일 ${SOCIAL_INSURANCE_RULES.checkedAt}. 단수 처리는 통용 방식 추정`,
];

export const FIC_CONFIG = {
  rules: SOCIAL_INSURANCE_RULES,
  defaults: FIC_DEFAULT_INPUT,
  presets: FIC_PRESETS,
  statusLabels: FIC_STATUS_LABELS,
};
