// 소득 대비 집값 부담 계산기 — 데이터 파일
// LTV·취득세·중개보수·월상환 계산 로직은 home-purchase-fund.ts를 그대로 재사용합니다.

import {
  LTV_RATES,
  getPolicyLoanLimit,
  calcAcquisitionTax,
  calcBrokerageFee,
  calcMonthlyPayment,
  REGION_LABELS,
  OWNERSHIP_LABELS,
  type RegionType,
  type OwnershipType,
} from "./homePurchaseFund";

export {
  LTV_RATES,
  getPolicyLoanLimit,
  calcAcquisitionTax,
  calcBrokerageFee,
  calcMonthlyPayment,
  REGION_LABELS,
  OWNERSHIP_LABELS,
  type RegionType,
  type OwnershipType,
};

export const PAGE_META = {
  title: "소득 대비 집값 부담 계산기 — 연봉으로 살 수 있는 적정 매매가",
  subtitle:
    "연봉과 보유 현금을 입력하면 DSR·LTV 기준 최대 대출 가능액과 적정 매매가, 연봉 대비 집값 배수(PIR)를 계산합니다.",
  methodology:
    "DSR·LTV·취득세·중개보수 기준은 2026년 3월 기준 정책 참고값이며, 내집마련 자금 계산기와 동일한 기준을 사용합니다.",
  caution:
    "이 계산기는 참고용 추정값을 제공합니다. 실제 대출 가능액은 신용평가, 기존 부채, 소득 증빙, 금융기관 정책에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 3월 기준",
};

export const DSR_DEFAULT = 0.4;
export const STRESS_DSR_ADD_RATE = 1.5; // %p

export const DSR_OPTIONS = [
  { value: 0.35, label: "35%" },
  { value: 0.4, label: "40% (기본)" },
  { value: 0.5, label: "50%" },
];

export const PIR_BANDS = [
  { max: 5, label: "낮음", tone: "positive" },
  { max: 8, label: "보통", tone: "neutral" },
  { max: 12, label: "높음", tone: "warning" },
  { max: Infinity, label: "매우 높음", tone: "negative" },
];

export interface IncomeAffordabilityPreset {
  id: string;
  label: string;
  income: number;
  cash: number;
  existingDebtAnnual: number;
  regionType: RegionType;
  ownershipType: OwnershipType;
  rate: number;
  term: number;
  dsr: number;
}

export const PRESETS: IncomeAffordabilityPreset[] = [
  {
    id: "single_6000",
    label: "🟢 연봉 6천·1인 가구",
    income: 60000000,
    cash: 150000000,
    existingDebtAnnual: 0,
    regionType: "regulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.4,
  },
  {
    id: "couple_9000",
    label: "🟡 부부합산 9천",
    income: 90000000,
    cash: 300000000,
    existingDebtAnnual: 0,
    regionType: "regulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.4,
  },
  {
    id: "couple_12000_seoul",
    label: "🔴 부부합산 1.2억·서울 토허제",
    income: 120000000,
    cash: 600000000,
    existingDebtAnnual: 0,
    regionType: "overheated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.4,
  },
  {
    id: "regional_5000",
    label: "🔵 연봉 5천·비규제지역",
    income: 50000000,
    cash: 100000000,
    existingDebtAnnual: 0,
    regionType: "unregulated",
    ownershipType: "none",
    rate: 4.0,
    term: 30,
    dsr: 0.4,
  },
];

export const PAGE_FAQ = [
  {
    question: "적정 매매가는 어떻게 계산되나요?",
    answer:
      "DSR 한도 내 최대 대출 가능액과 보유 현금에서 취득세·중개보수를 뺀 자기자본을 더해, 그 범위 안에서 살 수 있는 가장 높은 매매가를 역산한 추정값입니다.",
  },
  {
    question: "DSR 40%는 모든 은행에 동일하게 적용되나요?",
    answer:
      "차주 단위 DSR 규제 비율이며 은행, 상품, 소득 구간, 정책에 따라 35~50% 등으로 달라질 수 있습니다. 이 계산기에서는 DSR 한도를 직접 선택할 수 있습니다.",
  },
  {
    question: "PIR(소득 대비 집값 배수)이 높으면 무조건 무리한 건가요?",
    answer:
      "PIR이 높을수록 소득 대비 집값 부담이 크다는 의미이지만, 자산·소득 증가 가능성이나 거주 목적에 따라 판단 기준은 달라질 수 있어 참고 지표로 활용하는 것이 좋습니다.",
  },
  {
    question: "토허제 지역은 왜 적정 매매가가 낮게 나오나요?",
    answer:
      "투기과열지구+토허제는 LTV가 50%(2주택 이상은 0%)로 낮아 대출 한도가 줄고, 그만큼 자기자본 부담이 커지기 때문입니다.",
  },
  {
    question: "기존 대출이 있으면 결과가 어떻게 달라지나요?",
    answer:
      "기존 대출의 연간 원리금 상환액만큼 DSR 한도에서 차감되어 신규 대출 가능액과 적정 매매가가 함께 줄어듭니다.",
  },
  {
    question: "계산 결과와 실제 대출 한도가 다른 이유는 무엇인가요?",
    answer:
      "신용점수, 기존 대출 종류, 소득 증빙 방식, 스트레스 DSR 단계 적용 여부 등에 따라 실제 한도는 이 계산기 결과와 다를 수 있습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/salary/", label: "연봉 실수령액 계산기" },
  { href: "/tools/retirement/", label: "퇴직금 계산기" },
];
