export interface PensionStartAgeRow {
  startAge: number;
  type: "early" | "normal" | "delayed";
  ratePercent: number;
  monthlyAmount: number;   // 정상수령 120만 원 기준 월수령액 (원)
}

export interface PensionCumulativeRow {
  startAge: number;
  type: "early" | "normal" | "delayed";
  monthlyAmount: number;
  cumulativeAt70: number;
  cumulativeAt75: number;
  cumulativeAt80: number;
  cumulativeAt85: number;
  cumulativeAt90: number;
}

export interface BirthYearPensionAge {
  birthYearRange: string;
  normalAge: number;
  earlyAge: number;
}

export interface PensionCase {
  type: "early" | "normal" | "delayed";
  title: string;
  profile: string;
  reason: string;
  pros: string;
  cons: string;
  bestFor: string;
}

export interface PensionPolicyChange {
  item: string;
  before: string;
  after: string;
}

// ─── 출생연도별 수급개시연령 ──────────────────────────────────
export const BIRTH_YEAR_PENSION_AGES: BirthYearPensionAge[] = [
  { birthYearRange: "1953~1956년생", normalAge: 61, earlyAge: 56 },
  { birthYearRange: "1957~1960년생", normalAge: 62, earlyAge: 57 },
  { birthYearRange: "1961~1964년생", normalAge: 63, earlyAge: 58 },
  { birthYearRange: "1965~1968년생", normalAge: 64, earlyAge: 59 },
  { birthYearRange: "1969년생 이후",  normalAge: 65, earlyAge: 60 },
];

// ─── 수령 나이별 지급률 (정상수령 65세, 기준 120만 원) ─────────
export const PENSION_RATE_TABLE: PensionStartAgeRow[] = [
  { startAge: 60, type: "early",   ratePercent: 70,    monthlyAmount: 840000  },
  { startAge: 61, type: "early",   ratePercent: 76,    monthlyAmount: 912000  },
  { startAge: 62, type: "early",   ratePercent: 82,    monthlyAmount: 984000  },
  { startAge: 63, type: "early",   ratePercent: 88,    monthlyAmount: 1056000 },
  { startAge: 64, type: "early",   ratePercent: 94,    monthlyAmount: 1128000 },
  { startAge: 65, type: "normal",  ratePercent: 100,   monthlyAmount: 1200000 },
  { startAge: 66, type: "delayed", ratePercent: 107.2, monthlyAmount: 1286400 },
  { startAge: 67, type: "delayed", ratePercent: 114.4, monthlyAmount: 1372800 },
  { startAge: 68, type: "delayed", ratePercent: 121.6, monthlyAmount: 1459200 },
  { startAge: 69, type: "delayed", ratePercent: 128.8, monthlyAmount: 1545600 },
  { startAge: 70, type: "delayed", ratePercent: 136.0, monthlyAmount: 1632000 },
];

// ─── 누적 수령액 비교 (주요 3개 시나리오) ──────────────────────
// 계산식: 월수령액 × 12 × max(종점나이 - 시작나이, 0)
export const PENSION_CUMULATIVE: PensionCumulativeRow[] = [
  {
    startAge: 60, type: "early", monthlyAmount: 840000,
    cumulativeAt70: 840000 * 12 * 10,   // 1억 80만
    cumulativeAt75: 840000 * 12 * 15,   // 1억 5,120만
    cumulativeAt80: 840000 * 12 * 20,   // 2억 160만
    cumulativeAt85: 840000 * 12 * 25,   // 2억 5,200만
    cumulativeAt90: 840000 * 12 * 30,   // 3억 240만
  },
  {
    startAge: 65, type: "normal", monthlyAmount: 1200000,
    cumulativeAt70: 1200000 * 12 * 5,   // 7,200만
    cumulativeAt75: 1200000 * 12 * 10,  // 1억 4,400만
    cumulativeAt80: 1200000 * 12 * 15,  // 2억 1,600만
    cumulativeAt85: 1200000 * 12 * 20,  // 2억 8,800만
    cumulativeAt90: 1200000 * 12 * 25,  // 3억 6,000만
  },
  {
    startAge: 70, type: "delayed", monthlyAmount: 1632000,
    cumulativeAt70: 0,
    cumulativeAt75: 1632000 * 12 * 5,   // 9,792만
    cumulativeAt80: 1632000 * 12 * 10,  // 1억 9,584만
    cumulativeAt85: 1632000 * 12 * 15,  // 2억 9,376만
    cumulativeAt90: 1632000 * 12 * 20,  // 3억 9,168만
  },
];

// ─── 건강수명별 유리한 전략 ─────────────────────────────────────
export const HEALTH_LIFE_STRATEGY = [
  { range: "75세 이하",  strategy: "조기수령 검토 가능",          reason: "단기 생존 가정 시 누적액 우세" },
  { range: "76~82세",   strategy: "정상수령이 균형적",             reason: "손익분기 전후, 조기·정상 비슷" },
  { range: "83~84세",   strategy: "정상수령 우세",                 reason: "정상수령 누적액이 역전" },
  { range: "85세 이상", strategy: "연기수령 검토 가능",            reason: "85세부터 연기수령 누적액 최고" },
  { range: "90세 이상", strategy: "연기수령 유리성 증가",           reason: "장수할수록 136% 지급률 효과 커짐" },
];

// ─── 3층 연금 조합 전략 ─────────────────────────────────────────
export const PENSION_LAYER_STRATEGY = [
  { age: "60~65세",  source: "퇴직연금 분할 수령·금융자산", role: "소득 공백 대응" },
  { age: "65세~",    source: "국민연금 정상·일부 연기수령", role: "평생 기본 현금흐름" },
  { age: "55~65세",  source: "개인연금·연금저축",          role: "국민연금 전 소득 보완" },
  { age: "70세 이후", source: "국민연금·퇴직연금·주택연금",  role: "장기 안정 현금흐름" },
];

// ─── 실제 사례 3가지 ─────────────────────────────────────────────
export const PENSION_CASES: PensionCase[] = [
  {
    type: "early",
    title: "60세 조기수령 선택",
    profile: "60세 조기 은퇴, 즉각적인 생활비 필요",
    reason: "은퇴 직후 소득 공백이 커 당장 현금흐름이 필요한 경우",
    pros: "은퇴 초기 생활비 확보, 건강수명이 짧게 예상될 때 유리",
    cons: "월수령액 30% 감액이 평생 유지됨. 장수 시 누적액 불리",
    bestFor: "건강수명이 짧게 예상되거나 당장 현금흐름이 급한 사람",
  },
  {
    type: "normal",
    title: "65세 정상수령 선택",
    profile: "65세 정상 은퇴, 표준적인 노후 계획",
    reason: "감액도 무수령 기간도 없이 가장 균형적인 선택",
    pros: "가장 단순하고 예측 가능. 감액 없는 표준 수령",
    cons: "장수 시 연기수령보다 누적액이 적을 수 있음",
    bestFor: "평균 기대수명과 보통의 현금흐름을 가진 사람",
  },
  {
    type: "delayed",
    title: "70세 연기수령 선택",
    profile: "60대에도 소득·자산 여유 있음",
    reason: "월수령액을 최대화해 노후 후반 현금흐름을 강화하려는 경우",
    pros: "월수령액 36% 증가(136%). 장수 시 누적액 최고",
    cons: "65~70세 5년간 연금 미수령. 조기 사망 시 불리",
    bestFor: "건강하고 60대 생활비를 다른 자산으로 충당 가능한 사람",
  },
];

// ─── 2026 제도 변경 ───────────────────────────────────────────────
export const POLICY_CHANGES_2026: PensionPolicyChange[] = [
  { item: "소득대체율",   before: "41.5%",    after: "43% (2026년 이후 가입기간 적용)" },
  { item: "보험료율",     before: "9%",       after: "2026년부터 매년 0.5%p 인상, 2033년 13% 목표" },
  { item: "수급 나이",    before: "변경 없음", after: "1969년생 이후: 정상 65세, 조기 60세 유지" },
  { item: "기존 수급자",  before: "해당 없음", after: "이미 수령 중인 연금액에는 직접 적용 안 됨" },
];

// ─── 소득 공백기 체크리스트 ─────────────────────────────────────
export const INCOME_GAP_CHECKLIST = [
  "국민연금 전까지 월 생활비를 충당할 자산·소득이 있는가?",
  "퇴직연금을 일시금이 아니라 분할 수령으로 받을 수 있는가?",
  "개인연금(연금저축·IRP)의 수령 시기를 설계했는가?",
  "건강보험료 피부양자 자격이 연금수령액으로 영향받는지 확인했는가?",
  "배우자 연금과 합산한 가계 현금흐름을 파악했는가?",
  "80세 이후 현금흐름 부족에 대비한 계획이 있는가?",
];

// ─── 물가상승률별 현재가치 ─────────────────────────────────────
export const INFLATION_TABLE = [
  { inflationRate: 1, years: 20, presentValue: "약 82만 원" },
  { inflationRate: 2, years: 20, presentValue: "약 67만 원" },
  { inflationRate: 3, years: 20, presentValue: "약 55만 원" },
];

// ─── FAQ ─────────────────────────────────────────────────────────
export const PAC_FAQ = [
  {
    question: "국민연금은 60세에 받을 수 있나요?",
    answer:
      "출생연도와 조기노령연금 조건에 따라 가능합니다. 1969년생 이후는 정상 노령연금 65세, 조기노령연금 60세부터 가능합니다. 단, 가입기간 10년 이상이고 소득 있는 업무에 종사하지 않는 조건을 충족해야 합니다. 정확한 신청 가능 여부는 국민연금공단(1355)에 문의하거나 내연금.kr에서 확인하세요.",
  },
  {
    question: "조기수령 시 얼마나 깎이나요?",
    answer:
      "정상수령보다 1년 일찍 받을 때마다 6%씩 감액됩니다. 5년 일찍 60세부터 받으면 정상 수령액의 70%만 받게 됩니다. 이 감액은 평생 유지되므로, 정상수령 월 120만 원이라면 조기수령 시 평생 84만 원을 받는 구조입니다.",
  },
  {
    question: "연기수령하면 얼마나 늘어나나요?",
    answer:
      "1년 늦출 때마다 7.2%(월 0.6%)씩 증액됩니다. 5년 연기해 70세부터 받으면 정상수령액의 136%를 평생 받을 수 있습니다. 정상수령 월 120만 원이라면 연기수령 시 163.2만 원이 됩니다.",
  },
  {
    question: "조기수령과 정상수령, 누적액 기준 손익분기점은 몇 살인가요?",
    answer:
      "정상수령 월 120만 원, 60세 조기수령 84만 원 기준으로 약 76~77세가 손익분기점입니다. 이 나이까지 생존하면 정상수령 누적액이 조기수령 누적액을 추월합니다. 건강수명을 75세로 예상한다면 조기수령이, 80세 이상으로 예상한다면 정상수령이 유리합니다.",
  },
  {
    question: "연기수령 시 건강보험료가 올라가나요?",
    answer:
      "연금 수령액이 늘어나면 건강보험 피부양자 자격 기준에 영향을 줄 수 있습니다. 지역가입자로 전환되거나 피부양자 자격을 잃는 경우 건보료 부담이 추가될 수 있습니다. 연기수령으로 증가하는 연금액과 추가 건보료를 함께 고려해 실질 수령액을 비교해야 합니다.",
  },
  {
    question: "2026년 국민연금 제도 변경이 수령액에 영향을 주나요?",
    answer:
      "2026년부터 소득대체율이 43%로 상향되고 보험료율이 인상됩니다. 다만 이는 2026년 이후 가입기간에 적용되므로, 이미 연금을 받고 있거나 가입기간이 완료된 경우 직접적인 수령액 변화는 없습니다. 아직 보험료를 납부 중인 경우 향후 예상 연금액이 소폭 높아질 수 있습니다.",
  },
  {
    question: "국민연금 연기는 전체가 아니라 일부만 할 수 있나요?",
    answer:
      "네. 국민연금액의 50%, 60%, 70%, 80%, 90% 중 하나를 선택해 일부 연기가 가능합니다. 나머지 금액은 정상 수급개시연령부터 받고, 연기한 비율만큼 연 7.2%가 가산됩니다. 소득 공백을 일부 보완하면서 연금액도 높이고 싶다면 유용한 전략입니다.",
  },
  {
    question: "연금 수령 최적 나이를 어떻게 판단하면 되나요?",
    answer:
      "정답은 없습니다. ① 건강수명 예상 ② 60~70세 소득 공백 충당 가능 여부 ③ 배우자 연금과 합산 현금흐름 ④ 건강보험료·세금 영향 ⑤ 퇴직연금·개인연금 수령 시기 조합까지 함께 고려해야 합니다. 연금 수령 최적 나이 계산기로 본인 조건을 직접 입력해 시나리오를 비교해 보세요.",
  },
];

// ─── 관련 링크 ──────────────────────────────────────────────────
export const PAC_RELATED_LINKS = [
  { href: "/tools/pension-optimal-age/",         label: "연금 수령 최적 나이 계산기" },
  { href: "/reports/worker-retirement-reality-2026/", label: "직장인 노후 준비 실태 리포트" },
  { href: "/tools/retirement-fund-depletion/",   label: "노후자금 고갈 시점 계산기" },
  { href: "/tools/irp-pension-calculator/",      label: "IRP 연금 계산기" },
  { href: "/tools/fire-calculator/",             label: "FIRE 조기 은퇴 계산기" },
];

// ─── META ────────────────────────────────────────────────────────
export const PAC_META = {
  slug: "pension-age-comparison-2026",
  title: "연금 수령 나이별 실수령액 완전 비교 2026",
  description:
    "국민연금 조기수령, 정상수령, 연기수령 시 월수령액과 생애 누적 수령액을 비교합니다. 60세·65세·70세 수령 시 손익분기점, 건강수명, 건강보험료까지 2026년 기준으로 정리했습니다.",
  updatedAt: "2026-05",
};
