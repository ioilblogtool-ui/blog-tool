import { WBE_2026_THRESHOLDS } from "./welfareBenefitEligibility";

export type ExcludedReason = "none" | "owns_house" | "relative_landlord" | "public_housing" | "sublease" | "local_duplicate";

export interface YrscPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const YRSC_META = {
  slug: "youth-rent-support-calculator",
  title: "청년월세지원 계산기 2026",
  seoTitle: "청년월세지원 계산기 2026 | 신청 가능 여부·예상 지원금 한 번에",
  seoDescription:
    "만 나이, 본인·부모님 소득과 재산, 월세를 입력해 청년월세지원 신청 가능 여부와 예상 지원금을 계산합니다. 월 최대 20만원, 최대 24개월(480만원) 기준을 확인하세요.",
  dataNote:
    "청년월세지원은 국토교통부가 운영하는 중앙정부 통일 제도로, 2026년부터 상시 사업으로 전환되어 연중 신청할 수 있습니다. 서울 등 일부 지자체가 운영하는 자체 청년 월세지원 사업과는 별도이며, 두 사업은 중복 수급할 수 없습니다. 이 계산기의 결과는 확정 수급 여부가 아닌 자가 점검용 추정입니다.",
  updatedAt: "2026-06-25",
};

export const YRSC_EXCLUDED_LABELS: Record<ExcludedReason, string> = {
  none: "해당 없음",
  owns_house: "주택 소유자(분양권·입주권 포함)",
  relative_landlord: "2촌 이내 혈족 주택 임차",
  public_housing: "공공임대주택(공무원임대주택 포함) 거주",
  sublease: "한 방 다수 거주 전대차",
  local_duplicate: "지자체 자체 월세지원 중복 수급 중",
};

export const YRSC_MEDIAN_INCOME_1PERSON = 2_564_238;
export const YRSC_YOUTH_INCOME_RATE = 0.6;
export const YRSC_ORIGIN_INCOME_RATE = 1.0;

// 원가구는 가구원수에 따라 기준 중위소득(100%)이 달라짐 — 다른 복지 계산기와 동일한
// 국가 통계 기준 중위소득표(WBE_2026_THRESHOLDS)를 그대로 재사용한다. 이건 생계급여 등
// 특정 급여의 파생 기준이 아니라 전 국민 공통 기준값이라 재사용해도 안전하다.
export const YRSC_ORIGIN_MEDIAN_INCOME_BY_SIZE: Record<number, number> = WBE_2026_THRESHOLDS.reduce(
  (acc, row) => ({ ...acc, [row.householdSize]: row.medianIncome }),
  {} as Record<number, number>,
);

export const YRSC_YOUTH_ASSET_LIMIT = 122_000_000;
export const YRSC_ORIGIN_ASSET_LIMIT = 470_000_000;

export const YRSC_MONTHLY_CAP = 200_000;
export const YRSC_MAX_MONTHS = 24;

export const YRSC_MIN_AGE = 19;
export const YRSC_MAX_AGE = 34;

export const YRSC_PRESETS: YrscPreset[] = [
  {
    id: "typical-eligible",
    label: "일반적인 자취 청년",
    summary: "26세 · 본인소득 130만원 · 월세 35만원",
    input: { age: 26, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1300000, originHouseholdSize: 4, originMonthlyIncome: 4000000, youthAsset: 30000000, originAsset: 200000000, monthlyRent: 350000, excludedReason: "none" },
  },
  {
    id: "low-rent",
    label: "월세가 20만원보다 적은 경우",
    summary: "월세 15만원 — 실제 월세만큼만 지원",
    input: { age: 24, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 900000, originHouseholdSize: 3, originMonthlyIncome: 3000000, youthAsset: 15000000, originAsset: 150000000, monthlyRent: 150000, excludedReason: "none" },
  },
  {
    id: "origin-income-too-high",
    label: "부모님 소득이 기준 초과",
    summary: "본인 소득은 낮지만 원가구 소득 초과 우려",
    input: { age: 28, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1200000, originHouseholdSize: 2, originMonthlyIncome: 9000000, youthAsset: 20000000, originAsset: 200000000, monthlyRent: 400000, excludedReason: "none" },
  },
  {
    id: "public-housing-excluded",
    label: "공공임대주택 거주 (제외 대상)",
    summary: "조건은 충족하지만 공공임대주택이라 제외",
    input: { age: 27, isHomeless: true, livesSeparately: true, hasLeaseContract: true, monthlyIncome: 1100000, originHouseholdSize: 3, originMonthlyIncome: 3500000, youthAsset: 20000000, originAsset: 180000000, monthlyRent: 300000, excludedReason: "public_housing" },
  },
];

export const YRSC_FAQ = [
  {
    question: "본인 소득은 적은데 부모님 소득이 많으면 못 받나요?",
    answer:
      "그럴 수 있습니다. 청년월세지원은 본인(청년가구) 소득뿐 아니라 부모님 등 원가구 소득도 함께 봅니다. 청년가구는 기준 중위소득 60% 이하, 원가구는 기준 중위소득 100% 이하를 모두 충족해야 하므로, 본인 소득이 낮아도 부모님 소득이 기준을 넘으면 신청이 어려울 수 있습니다.",
  },
  {
    question: "월세가 20만원보다 적으면 어떻게 되나요?",
    answer:
      "실제로 낸 월세 금액만큼만 지원됩니다. 예를 들어 월세가 15만원이면 매달 15만원을 지원받고, 월세가 25만원이면 한도인 20만원까지만 지원됩니다. 임차보증금이나 관리비는 지원 대상에서 제외됩니다.",
  },
  {
    question: "서울에 사는데 서울형 청년월세지원도 같이 받을 수 있나요?",
    answer:
      "아닙니다. 이 계산기가 다루는 청년월세지원은 국토교통부가 운영하는 중앙정부 통일 제도이며, 서울시 등 일부 지자체가 운영하는 자체 청년 월세지원 사업과는 별도입니다. 두 사업은 중복 수급할 수 없으므로 본인에게 더 유리한 쪽을 선택해서 신청해야 합니다.",
  },
  {
    question: "2026년에 뭐가 바뀌었나요?",
    answer:
      "2026년부터 한시 사업이 상시 사업으로 전환되어, 정해진 모집 기간이 아니라 연중 언제든 신청할 수 있게 됐습니다.",
  },
  {
    question: "재산기준 1.22억원과 4.7억원은 각각 무엇인가요?",
    answer:
      "1.22억원은 청년가구(본인) 재산기준이고, 4.7억원은 원가구(부모 등) 재산기준입니다. 두 기준을 모두 충족해야 하며, 어느 한쪽이라도 초과하면 신청이 어려울 수 있습니다.",
  },
  {
    question: "부모님과 같은 동네 다른 집에 살면 별거로 인정되나요?",
    answer:
      "주민등록상 주소지와 실제 거주지가 모두 부모님과 분리되어 있어야 인정됩니다. 같은 동네라도 주민등록과 실거주가 분리되어 있다면 원칙적으로 인정되지만, 정확한 판단은 신청 기관(주민센터·복지로)의 확인이 필요합니다.",
  },
];

export const YRSC_RELATED_LINKS = [
  { href: "/tools/family-care-allowance-calculator/", label: "가족돌봄수당 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/housing-benefit-income-recognition/", label: "주거급여 계산기" },
  { href: "/reports/single-household-living-cost-2026/", label: "2026 1인 가구 생활비 완전 해부" },
];

export const YRSC_SEO_CONTENT = {
  introTitle: "청년월세지원, 나도 받을 수 있을까?",
  intro: [
    "자취하는 청년이라면 한 번쯔음 들어봤을 '청년월세지원'은 매달 월세 부담을 줄여주는 국토교통부 운영 제도입니다. 2026년부터는 정해진 모집 기간 없이 연중 언제든 신청할 수 있는 상시 사업으로 바뀌었습니다. 다만 조건이 본인 소득만으로 끝나지 않고 부모님 소득과 재산까지 함께 보기 때문에, 신청 전에 내가 대상인지 가늠하기가 쉽지 않습니다. 이 계산기는 나이, 거주 형태, 본인·원가구 소득과 재산, 월세를 입력해 신청 전에 스스로 점검할 수 있도록 만든 자가 점검용 도구입니다.",
    "기본 대상은 만 19세부터 34세 이하 무주택 청년으로, 부모와 주민등록상·실제 거주상 모두 분리되어 임대차계약을 맺고 월세를 내며 살고 있어야 합니다. 소득 기준은 이중 구조입니다. 청년가구(본인)는 기준 중위소득 60% 이하(2026년 1인 가구 기준 약 153만 8,543원), 원가구(부모 등)는 기준 중위소득 100% 이하를 모두 충족해야 합니다. 재산 기준도 마찬가지로 청년가구는 1억 2,200만원 이하, 원가구는 4억 7,000만원 이하로 나뉩니다.",
    "지원금은 매달 최대 20만원이지만, 실제로는 '월세와 20만원 중 더 작은 금액'만 지원됩니다. 월세가 15만원이면 15만원만, 25만원이면 한도인 20만원까지만 지원되는 식입니다. 최대 24개월(회)까지 지원받을 수 있어, 월세 20만원 이상을 24개월 동안 받으면 최대 480만원까지 누적됩니다. 임차보증금이나 관리비는 지원 대상에 포함되지 않고 월세만 인정됩니다.",
    "신청이 안 되는 제외 대상도 명확합니다. 주택 소유자(분양권·입주권 포함), 부모나 형제자매 등 2촌 이내 혈족의 집에 세를 들어 사는 경우, 공공임대주택(공무원임대주택 포함) 거주자, 한 방에 여러 명이 함께 사는 전대차 형태는 제외됩니다. 특히 헷갈리기 쉬운 부분은 서울시 등 일부 지자체가 운영하는 자체 청년 월세지원 사업을 이미 받고 있다면, 이 중앙정부 사업과 중복 수급이 불가능하다는 점입니다.",
    "이 계산기는 신청 결과를 보장하지 않는 자가 점검용 추정입니다. 정확한 소득·재산 산정 방식, 거주 분리 인정 기준, 신청 절차는 복지로 모의계산이나 한국토지주택공사(LH), 주소지 주민센터에서 최종 확인해야 합니다. 본인에게 지자체 자체 사업과 이 중앙정부 사업 중 어느 쪽이 더 유리한지도 함께 비교해보는 것을 권장합니다.",
  ],
  inputPoints: [
    "나이와 거주 형태를 입력하면 기본 대상 조건을 바로 확인할 수 있습니다.",
    "본인과 원가구 소득·재산을 모두 입력해야 정확한 판정을 받을 수 있습니다.",
    "월세를 입력하면 실제 지원받을 수 있는 월 지원금과 최대 총액을 볼 수 있습니다.",
  ],
  criteria: [
    "대상 연령, 소득·재산 기준, 지원금액은 2026년 국토교통부 운영 기준을 참고했습니다.",
    "청년가구와 원가구의 소득·재산 기준은 서로 다르며 둘 다 충족해야 합니다.",
    "월 지원금은 실제 월세와 20만원 중 작은 금액으로 계산됩니다.",
    "지자체 자체 청년 월세지원 사업과는 중복 수급이 불가능합니다.",
    "이 계산기는 확정 수급 여부가 아닌 자가 점검용 추정이며, 최종 확인은 복지로·LH·주민센터에서 해야 합니다.",
  ],
};

export const YRSC_CONFIG = {
  medianIncome1Person: YRSC_MEDIAN_INCOME_1PERSON,
  originMedianIncomeBySize: YRSC_ORIGIN_MEDIAN_INCOME_BY_SIZE,
  youthIncomeRate: YRSC_YOUTH_INCOME_RATE,
  originIncomeRate: YRSC_ORIGIN_INCOME_RATE,
  youthAssetLimit: YRSC_YOUTH_ASSET_LIMIT,
  originAssetLimit: YRSC_ORIGIN_ASSET_LIMIT,
  monthlyCap: YRSC_MONTHLY_CAP,
  maxMonths: YRSC_MAX_MONTHS,
  minAge: YRSC_MIN_AGE,
  maxAge: YRSC_MAX_AGE,
  presets: YRSC_PRESETS,
  labels: {
    excluded: YRSC_EXCLUDED_LABELS,
  },
};
