// ─── 퇴직금 중간정산 세금 계산기 ────────────────────────────────
// slug: retirement-lump-sum-interim-settlement-tax-calculator
// 소득세법 §55 연분연승법(근속연수공제·환산급여공제) 기반 퇴직소득세 계산기

import { CGT_TAX_BRACKETS } from "./capitalGainsTaxCalculator";

export const RIST_META = {
  slug: "retirement-lump-sum-interim-settlement-tax-calculator",
  title: "퇴직금 중간정산 세금 계산기",
  seoTitle: "퇴직금 중간정산 세금 계산기 2026 | 세금 얼마나 더 낼까 바로 계산",
  description:
    "중간정산 근속연수와 정산금액을 입력하면 퇴직소득세를 바로 계산합니다. 중간정산 없이 한 번에 받았을 때와 총세금을 비교하고, 최종 퇴직 시 세액정산 적용 여부에 따른 차이까지 확인하세요.",
  caution:
    "이 계산기는 근속연수공제·환산급여공제·연분연승법을 적용한 퇴직소득세 추정 계산기입니다. 실제 원천징수·신고 세액은 퇴직급여 산정 방식, 근속연수 단수 처리, 최종 퇴직 시 세액정산 적용 여부, 회사 규정에 따라 달라질 수 있습니다.",
  sourceNote: "소득세법 §55(퇴직소득세 계산), 근로자퇴직급여보장법 시행령 제3조(중간정산 사유) 기준",
  updatedAt: "2026-08-05",
};

// ─── 법정 중간정산 사유 ───────────────────────────────────────
export type InterimSettlementReason =
  | "home-purchase"
  | "housing-deposit"
  | "medical-care"
  | "bankruptcy"
  | "individual-rehab"
  | "wage-peak"
  | "working-hours-cut"
  | "disaster"
  | "none";

export interface ReasonOption {
  id: InterimSettlementReason;
  label: string;
  detail: string;
  evidence: string;
}

export const RIST_REASONS: ReasonOption[] = [
  { id: "home-purchase", label: "무주택자 주택구입", detail: "근로자 본인 명의로 주택을 구입하는 경우", evidence: "매매계약서·무주택 확인 자료" },
  { id: "housing-deposit", label: "무주택자 전세금·임차보증금", detail: "하나의 사업장에서 근무하는 동안 1회로 한정", evidence: "임대차계약서" },
  { id: "medical-care", label: "본인·배우자·부양가족 요양", detail: "6개월 이상 요양이 필요하고 연간 임금총액의 12.5%를 초과해 부담하는 경우", evidence: "진단서·의료비 자료" },
  { id: "bankruptcy", label: "파산선고", detail: "중간정산 신청일로부터 5년 이내", evidence: "법원 결정문" },
  { id: "individual-rehab", label: "개인회생절차 개시", detail: "중간정산 신청일로부터 5년 이내", evidence: "법원 결정문" },
  { id: "wage-peak", label: "임금피크제 시행", detail: "사용자가 임금피크제를 도입해 임금이 감소하는 경우", evidence: "취업규칙·근로계약" },
  { id: "working-hours-cut", label: "근로시간 단축", detail: "소정근로시간 단축으로 퇴직급여가 감소하는 경우", evidence: "근로시간 변경 자료" },
  { id: "disaster", label: "천재지변 등", detail: "고용노동부장관이 정하는 재난 피해 등", evidence: "피해사실 확인서" },
  { id: "none", label: "해당 사유 없음", detail: "위 사유에 해당하지 않으면 중간정산이 제한될 수 있습니다", evidence: "-" },
];

// ─── 최종 퇴직 시 퇴직소득 세액정산 적용 여부 ───────────────────
// 국세청 안내: 원천징수의무자가 이전 퇴직소득 원천징수영수증을 제출받으면
// 이미 지급된 금액과 최종 퇴직금액을 합산해 세액을 다시 계산하고, 기존 납부세액을 차감한다.
// 이 경우 총세금은 "중간정산 없이 한 번에 받은 것"과 동일해진다.
export type TaxSettlementOption = "applied" | "not-applied" | "unknown";

export interface TaxSettlementOptionMeta {
  id: TaxSettlementOption;
  label: string;
  detail: string;
}

export const RIST_TAX_SETTLEMENT_OPTIONS: TaxSettlementOptionMeta[] = [
  { id: "applied", label: "적용", detail: "최종 퇴직 시 이전 퇴직소득을 합산해 재정산합니다 — 총세금은 계속근무 가정과 같아집니다" },
  { id: "not-applied", label: "적용하지 않음", detail: "중간정산분과 이후 퇴직분을 각각 따로 계산합니다" },
  { id: "unknown", label: "잘 모르겠음", detail: "두 경우를 모두 보여드립니다" },
];

// ─── 근속연수공제표 ───────────────────────────────────────────
export interface ServiceYearTier {
  maxYears: number;
  base: number;
  perYear: number;
  fromYear: number;
}

export const RIST_SERVICE_YEAR_DEDUCTION_TIERS: ServiceYearTier[] = [
  { maxYears: 5, base: 0, perYear: 1_000_000, fromYear: 0 },
  { maxYears: 10, base: 5_000_000, perYear: 2_000_000, fromYear: 5 },
  { maxYears: 20, base: 15_000_000, perYear: 2_500_000, fromYear: 10 },
  { maxYears: Infinity, base: 40_000_000, perYear: 3_000_000, fromYear: 20 },
];

// ─── 환산급여공제표 ───────────────────────────────────────────
export interface ConvertedIncomeTier {
  maxIncome: number;
  base: number;
  rate: number;
  fromIncome: number;
}

export const RIST_CONVERTED_INCOME_DEDUCTION_TIERS: ConvertedIncomeTier[] = [
  { maxIncome: 8_000_000, base: 0, rate: 1.0, fromIncome: 0 },
  { maxIncome: 70_000_000, base: 8_000_000, rate: 0.6, fromIncome: 8_000_000 },
  { maxIncome: 100_000_000, base: 45_200_000, rate: 0.55, fromIncome: 70_000_000 },
  { maxIncome: 300_000_000, base: 61_700_000, rate: 0.45, fromIncome: 100_000_000 },
  { maxIncome: Infinity, base: 151_700_000, rate: 0.35, fromIncome: 300_000_000 },
];

// 종합소득세 누진세율표는 신규 정의하지 않고 capitalGainsTaxCalculator.ts의
// CGT_TAX_BRACKETS(소득세법 §55, 8구간)를 그대로 재사용한다.
export const RIST_TAX_BRACKETS = CGT_TAX_BRACKETS;

// ─── 기본 입력값 ──────────────────────────────────────────────
export interface RistInput {
  reason: InterimSettlementReason;
  hireDate: string;
  settlementDate: string;
  settlementAmount: number;
  futureRetireDate: string;
  futureTotalPay: number;
  taxSettlementOption: TaxSettlementOption;
}

export const RIST_DEFAULT_INPUT: RistInput = {
  reason: "home-purchase",
  hireDate: "2018-08-05",
  settlementDate: "2026-08-05",
  settlementAmount: 50_000_000,
  futureRetireDate: "2038-08-05",
  futureTotalPay: 200_000_000,
  taxSettlementOption: "unknown",
};

// ─── 프리셋 ──────────────────────────────────────────────────
export interface RistPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<RistInput>;
}

export const RIST_PRESETS: RistPreset[] = [
  {
    id: "home-purchase-case",
    label: "무주택자 주택구입 자금",
    summary: "8년차 · 5,000만원",
    input: {
      reason: "home-purchase",
      hireDate: "2018-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 50_000_000,
      futureRetireDate: "2038-08-05",
      futureTotalPay: 200_000_000,
      taxSettlementOption: "unknown",
    },
  },
  {
    id: "wage-peak-case",
    label: "임금피크제 도입",
    summary: "25년차 · 2억원",
    input: {
      reason: "wage-peak",
      hireDate: "2001-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 200_000_000,
      futureRetireDate: "2028-08-05",
      futureTotalPay: 220_000_000,
      taxSettlementOption: "unknown",
    },
  },
  {
    id: "housing-deposit-case",
    label: "전세보증금 마련",
    summary: "4년차 · 2,000만원",
    input: {
      reason: "housing-deposit",
      hireDate: "2022-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 20_000_000,
      futureRetireDate: "2036-08-05",
      futureTotalPay: 150_000_000,
      taxSettlementOption: "unknown",
    },
  },
  {
    id: "medical-care-case",
    label: "6개월 요양비 부담",
    summary: "15년차 · 1억2,000만원",
    input: {
      reason: "medical-care",
      hireDate: "2011-08-05",
      settlementDate: "2026-08-05",
      settlementAmount: 120_000_000,
      futureRetireDate: "2031-08-05",
      futureTotalPay: 160_000_000,
      taxSettlementOption: "unknown",
    },
  },
];

// ─── FAQ ────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export const RIST_FAQ: FaqItem[] = [
  {
    question: "중간정산하면 세금이 무조건 늘어나나요?",
    answer:
      "아니요. 금액·근속기간과 최종 퇴직 시 퇴직소득 세액정산 적용 여부에 따라 달라집니다. 세액정산이 적용되면 총세금은 중간정산 없이 한 번에 받은 것과 같아지고, 적용되지 않으면 근속연수가 쪼개져 총세금이 늘어나는 경우가 많습니다.",
  },
  {
    question: "퇴직소득 세액정산이 뭔가요?",
    answer:
      "최종 퇴직 시 이전에 받은 중간정산 퇴직소득의 원천징수영수증을 회사에 제출하면, 두 소득을 합산하고 전체 근속연수를 기준으로 세금을 다시 계산한 뒤 이미 낸 세금을 차감하는 제도입니다. 국세청 안내에 따르면 이 경우 최종적으로 부담하는 총세금은 애초에 중간정산을 하지 않았을 때와 같아집니다. 자동으로 적용되지는 않으며 회사(원천징수의무자)의 처리 절차를 확인해야 합니다.",
  },
  {
    question: "아무 때나 중간정산을 받을 수 있나요?",
    answer:
      "아니요. 무주택자 주택구입, 전세보증금 부담, 6개월 이상 요양, 파산·개인회생, 임금피크제 도입, 근로시간 단축 등 법정 사유가 있어야 하며, 사유에 해당하더라도 회사가 반드시 승인해야 하는 것은 아닙니다.",
  },
  {
    question: "중간정산 후 근속연수는 0년이 되나요?",
    answer:
      "퇴직급여 산정을 위한 근속연수는 정산일 다음날부터 다시 0에서 시작됩니다. 다만 최종 퇴직 시 세액정산을 적용하면 세금 계산에서는 과거 근속기간이 다시 합산됩니다.",
  },
  {
    question: "전세보증금 때문에 중간정산을 받았는데 또 받을 수 있나요?",
    answer: "전세금·임차보증금 사유는 하나의 사업장에서 근무하는 동안 1회로 한정됩니다. 재신청 가능 여부와 증빙 요건은 회사에 확인해야 합니다.",
  },
  {
    question: "퇴직연금 DC형도 중간인출할 수 있나요?",
    answer:
      "일반 퇴직금 중간정산과 DC형 중도인출은 근거 법령과 절차가 다릅니다. DC형 가입자는 별도의 중도인출 사유·절차를 확인해야 합니다.",
  },
  {
    question: "이 계산기 결과가 실제 원천징수 금액과 같나요?",
    answer:
      "같지 않을 수 있습니다. 실제 세액은 회사의 원천징수 방식, 근속연수 단수 처리, 퇴직급여 산정 방식에 따라 달라질 수 있어 참고용으로만 사용해야 합니다.",
  },
];

// ─── 관련 링크 ───────────────────────────────────────────────
export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}

export const RIST_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/retirement/", label: "퇴직금 계산기", desc: "평균임금 기준 퇴직금 총액을 산정합니다." },
  { href: "/tools/retirement-dc-db-calculator/", label: "퇴직연금 DB형 DC형 전환 계산기", desc: "DB형 유지와 DC형 전환 유불리를 비교합니다." },
  { href: "/tools/peak-wage-retirement-calculator/", label: "임금피크제 퇴직금 계산기", desc: "임금피크제 사유 중간정산을 고려 중이라면 함께 확인하세요." },
  { href: "/tools/capital-gains-tax-calculator/", label: "양도소득세 계산기", desc: "같은 소득세법 누진세율표를 사용하는 양도세 계산기입니다." },
];
