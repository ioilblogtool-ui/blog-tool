import { MINIMUM_WAGE_2026 } from "./minimumWage2026";
import { calcMonthlyPay } from "./seniorJobSalaryCalculator2026";

export { calcMonthlyPay };

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const CJSC_META = {
  slug: "cleaning-job-salary-calculator-2026",
  title: "건물 미화 월급 계산기 2026",
  seoTitle: "건물 미화 월급 계산기 2026 | 파트타임 실수령액 바로 계산",
  seoDescription:
    "하루 근무시간·주 근무일수 입력하면 건물 미화 파트타임 예상 월급 바로 계산. 주휴수당 적용 여부 포함.",
  updatedAt: "2026-07-06",
  dataNote:
    "이 계산은 2026년 최저임금(시급 10,320원) 기준이며, 주 15시간 이상 근무 시 주휴수당(근로기준법 제55조)이 자동 반영됩니다. 용역업체 소속인 경우 4대보험 적용 여부를 계약 시 확인하세요.",
};

export const CJSC_DEFAULT_HOURLY_WAGE = MINIMUM_WAGE_2026;
export const CJSC_PRESET_HOURS = [3, 4, 5];
export const CJSC_PRESET_DAYS = [3, 5, 6];

export const CJSC_FAQ: FaqItem[] = [
  {
    question: "하루 3시간만 일해도 주휴수당 받나요?",
    answer: "주 소정근로시간이 15시간 이상이면 주휴수당 대상입니다. 하루 3시간씩 주 5일이면 주 15시간이라 대상이 됩니다.",
  },
  {
    question: "오전 파트타임 미화 일자리는 시급이 다른가요?",
    answer: "이 계산기는 2026년 최저임금을 기본값으로 제공하며, 실제 사업장은 이보다 높은 시급을 책정하기도 합니다.",
  },
  {
    question: "용역업체 소속이면 4대보험은 어떻게 되나요?",
    answer: "용역업체 소속 근로자도 근로시간 요건을 충족하면 4대보험 가입 대상입니다. 계약서에서 확인이 필요합니다.",
  },
  {
    question: "아파트 미화와 오피스 미화는 다른가요?",
    answer: "근무 범위(계단·복도·화장실 포함 여부)와 시간대가 다를 수 있어 실제 채용 공고에서 업무 범위를 확인하는 것이 중요합니다.",
  },
  {
    question: "나이 제한이 있나요?",
    answer: "법적 상한은 없지만 사업장별로 체력을 고려한 채용 기준이 있을 수 있습니다.",
  },
];

export const CJSC_SEO_INTRO = [
  "건물 미화는 60대 이후 자격증 없이 바로 시작할 수 있는 대표적인 일자리입니다. 오전 3~5시간 정도의 파트타임 근무가 많아 체력 부담을 조절하면서 일할 수 있다는 점이 장점입니다. 이 계산기는 하루 근무시간과 주 근무일수를 입력하면 2026년 최저임금 기준으로 예상 세전 월급을 계산합니다.",
  "월급 계산에서 가장 중요한 변수는 주휴수당 적용 여부입니다. 근로기준법 제55조에 따라 주 소정근로시간이 15시간 이상이면 주휴수당이 발생하고, 15시간 미만이면 발생하지 않습니다. 이 계산기는 입력한 하루 근무시간과 주 근무일수를 곱해 주 15시간 기준을 자동으로 판정하고, 그 결과에 따라 주휴수당 포함 여부를 결과에 표시합니다.",
  "예를 들어 하루 3시간씩 주 5일을 근무하면 주 15시간이 되어 주휴수당 대상이 되지만, 하루 3시간씩 주 3일만 근무하면 주 9시간이라 주휴수당 대상이 아닙니다. 근무 일수를 하루 늘리거나 줄이는 것만으로 실제 받는 월급이 달라질 수 있으므로, 이 계산기로 여러 조건을 비교해보는 것이 좋습니다.",
  "건물 미화는 아파트, 오피스, 상가 등 근무처에 따라 업무 범위가 다릅니다. 계단·복도·화장실 청소가 포함되는지, 분리수거까지 담당하는지에 따라 체력 부담과 실제 시급 책정이 달라질 수 있습니다. 용역업체 소속으로 채용되는 경우가 많아 4대보험 가입 여부도 계약 시 확인이 필요합니다.",
  "이 계산기는 2026년 최저임금(시급 10,320원)을 기본값으로 제공하지만, 실제 채용 공고는 지역과 사업장에 따라 이보다 높은 시급을 책정하는 경우도 있습니다. 자신이 실제로 받을 시급을 알고 있다면 기본값을 수정해 더 정확한 예상 월급을 확인할 수 있습니다.",
];

export const CJSC_SEO_CRITERIA = [
  "이 계산은 2026년 최저임금(시급 10,320원) 기준이며 실제 채용 공고와 다를 수 있습니다",
  "주휴수당은 근로기준법 제55조에 따라 주 소정근로시간 15시간 이상일 때 자동 반영됩니다",
  "용역업체 소속도 근로시간 요건을 충족하면 4대보험 가입 대상입니다",
  "업무 범위(계단·복도·화장실 포함 여부)는 사업장마다 달라 체력 부담에 영향을 줍니다",
];

export const CJSC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/senior-job-salary-calculator-2026/", label: "60대 일자리 월급 계산기", description: "미화 외 다른 일자리와 비교해봅니다." },
  { href: "/tools/security-guard-salary-calculator-2026/", label: "아파트 경비 월급 계산기", description: "격일제·야간수당까지 반영한 상세 계산." },
  { href: "/reports/senior-job-comparison-2026/", label: "경비 vs 미화 vs 요양보호사 비교 리포트", description: "직업별 월급·준비기간·체력부담을 한 화면에서 비교합니다." },
];
