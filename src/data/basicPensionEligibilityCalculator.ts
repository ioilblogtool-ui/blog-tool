export type HouseholdType = "single" | "couple";
export type HouseholdRegion = "metro" | "city" | "rural";

export interface BpecPreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const BPEC_META = {
  slug: "basic-pension-eligibility-calculator",
  title: "기초연금 수급 가능성 계산기 2026",
  seoTitle: "기초연금 수급 가능성 계산기 2026 | 부모님 받을 수 있을까?",
  seoDescription:
    "가구 형태, 소득, 재산을 입력해 2026년 기초연금 선정기준 대비 소득인정액과 수급 가능성, 예상 기초연금액을 자가 점검용으로 계산합니다.",
  dataNote:
    "2026년 기초연금 선정기준액과 소득인정액 산정 방식을 바탕으로 한 자가 점검용 추정입니다. 국민연금 연계 감액·소득역전방지 감액은 반영하지 않았으며, 실제 수급 여부와 지급액은 국민연금공단·복지로 모의계산 또는 주민센터 확인 결과에 따라 달라질 수 있습니다.",
  updatedAt: "2026-06-24",
};

export const BPEC_HOUSEHOLD_LABELS: Record<HouseholdType, string> = {
  single: "단독가구",
  couple: "부부가구",
};

export const BPEC_REGION_LABELS: Record<HouseholdRegion, string> = {
  metro: "대도시·특례시",
  city: "중소도시",
  rural: "농어촌",
};

// 2026년 기초연금 선정기준액 (보건복지부·정책브리핑 2026-01 보도 기준)
export const BPEC_SELECTION_THRESHOLD: Record<HouseholdType, number> = {
  single: 2_470_000,
  couple: 3_952_000,
};

// 2026년 월 최대 지급액 — 단독 확인값, 부부 1인당은 단순 추정(⚠️ 복지로 모의계산 재확인 권장)
export const BPEC_MAX_BENEFIT: Record<HouseholdType, number> = {
  single: 349_700,
  couple: 279_760,
};

// 기본재산공제액 (생활법령정보 기준) — 생계급여(welfareBenefitEligibility.ts)와 절대 혼용 금지
export const BPEC_BASIC_ASSET_DEDUCTION: Record<HouseholdRegion, number> = {
  metro: 135_000_000,
  city: 85_000_000,
  rural: 72_500_000,
};

export const BPEC_FINANCIAL_ASSET_DEDUCTION = 20_000_000;
export const BPEC_ASSET_CONVERSION_RATE_ANNUAL = 0.04;
export const BPEC_WORK_INCOME_DEDUCTION = 1_160_000;
export const BPEC_WORK_INCOME_RATE = 0.7;
export const BPEC_COUPLE_REDUCTION_RATE = 0.2;

export const BPEC_PRESETS: BpecPreset[] = [
  {
    id: "single-pension-only",
    label: "단독, 국민연금만 있음",
    summary: "국민연금 월 30만원 · 대도시 자가",
    input: { householdType: "single", region: "metro", publicPensionIncome: 300000, earnedIncome: 0, generalAsset: 200000000, financialAsset: 10000000, debt: 0 },
  },
  {
    id: "couple-rural",
    label: "부부, 농어촌 자가",
    summary: "농어촌 거주 · 금융재산 1,000만원",
    input: { householdType: "couple", region: "rural", publicPensionIncome: 400000, earnedIncome: 0, generalAsset: 90000000, financialAsset: 10000000, debt: 0 },
  },
  {
    id: "single-borderline",
    label: "단독, 경계 사례",
    summary: "도시 거주 · 금융재산 3,000만원",
    input: { householdType: "single", region: "city", publicPensionIncome: 500000, earnedIncome: 800000, generalAsset: 100000000, financialAsset: 30000000, debt: 0 },
  },
  {
    id: "couple-working",
    label: "부부, 배우자 근로소득 있음",
    summary: "한쪽 근로소득 150만원 · 중소도시",
    input: { householdType: "couple", region: "city", publicPensionIncome: 200000, earnedIncome: 1500000, generalAsset: 60000000, financialAsset: 5000000, debt: 0 },
  },
];

export const BPEC_FAQ = [
  {
    question: "기초연금은 국민연금을 받으면 못 받나요?",
    answer:
      "아닙니다. 국민연금을 받고 있어도 기초연금을 함께 받을 수 있습니다. 다만 국민연금 가입기간이 길거나 수령액이 일정 수준(기초연금액의 150%)을 넘으면 기초연금이 단계적으로 감액될 수 있습니다. 이 계산기는 해당 감액을 반영하지 않은 단순 추정이므로, 국민연금 수령액이 많은 경우 실제 지급액은 이 결과보다 낮을 수 있습니다.",
  },
  {
    question: "재산이 있으면 기초연금을 못 받나요?",
    answer:
      "재산이 있다고 무조건 탈락하는 것은 아닙니다. 거주 지역별 기본재산공제액(대도시 1억 3,500만원, 중소도시 8,500만원, 농어촌 7,250만원)과 금융재산 공제 2,000만원을 먼저 뺀 나머지에만 연 4%의 소득환산율이 적용됩니다. 공제액 이하의 재산은 소득인정액에 영향을 주지 않습니다.",
  },
  {
    question: "부부가 같이 받으면 왜 감액되나요?",
    answer:
      "부부가 모두 기초연금을 받는 경우 가구 단위로 생활비가 절감되는 점을 고려해 각자 20%씩 감액한 금액을 지급하는 제도입니다. 그래서 부부가구의 1인당 지급액은 단독가구보다 낮게 계산됩니다.",
  },
  {
    question: "이 계산기의 결과는 정확한 수급액인가요?",
    answer:
      "아닙니다. 이 계산기는 선정기준액과 소득인정액 산정 방식을 단순화한 자가 점검용 추정입니다. 국민연금 연계 감액, 소득역전방지 감액, 고급자동차·회원권 반영은 포함하지 않았습니다. 정확한 수급 여부와 금액은 복지로 모의계산 또는 국민연금공단, 주민센터에서 확인해야 합니다.",
  },
  {
    question: "소득평가액의 116만원 공제는 누구에게 적용되나요?",
    answer:
      "근로소득이 있는 신청자(또는 배우자)에게 적용되는 공제입니다. 월 근로소득이 116만원 이하라면 소득평가액에 반영되는 근로소득은 0원으로 계산되고, 116만원을 초과한 부분의 70%만 소득평가액에 더해집니다.",
  },
  {
    question: "공적연금(국민연금)은 어디에 입력하나요?",
    answer:
      "국민연금, 공무원연금 등 공적연금 수령액은 근로소득과 별도로 '공적연금 등 기타소득' 항목에 그대로 입력합니다. 근로소득과 달리 별도 공제 없이 소득평가액에 전액 포함됩니다.",
  },
];

export const BPEC_RELATED_LINKS = [
  { href: "/tools/national-pension-calculator/", label: "국민연금 수령액 계산기" },
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/basic-livelihood-recipient-asset-standard/", label: "기초생활수급자 재산 기준 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
];

export const BPEC_SEO_CONTENT = {
  introTitle: "기초연금, 부모님이 받을 수 있는지 미리 확인하는 방법",
  intro: [
    "부모님 세대가 기초연금을 받을 수 있는지 궁금할 때 가장 먼저 막막한 부분은 '소득인정액'이라는 낯선 개념입니다. 국민연금을 받고 있으면 기초연금은 못 받는 게 아닌지, 집이나 예금이 있으면 무조건 탈락하는 건 아닌지 헷갈리기 쉽습니다. 이 계산기는 가구 형태, 소득, 재산을 입력해 신청 전에 자녀나 본인이 미리 가늠해볼 수 있도록 만든 자가 점검용 도구입니다.",
    "기초연금은 단순히 월소득만으로 판단하지 않습니다. 실제로는 근로소득에서 116만원을 공제한 뒤 70%만 반영한 '소득평가액'과, 보유 재산을 지역별 기본재산공제액과 금융재산공제 2,000만원을 뺀 뒤 연 4%로 환산한 '재산의 소득환산액'을 더한 소득인정액을 기준으로 봅니다. 2026년 기초연금 선정기준액은 단독가구 247만원, 부부가구 395만 2,000원이며, 소득인정액이 이 기준선보다 낮아야 수급 가능 구간으로 봅니다.",
    "결과를 확인할 때는 소득인정액이 선정기준액보다 낮은지부터 보고, 두 값의 차이가 얼마나 나는지를 함께 살펴보는 것이 중요합니다. 차이가 클수록 안정적으로 수급 가능한 구간이고, 차이가 거의 없는 경계 구간이라면 실제 조사에서 결과가 달라질 수 있습니다. 재산 항목 중 어떤 것이 소득인정액을 많이 끌어올렸는지 분해 결과로 확인하면 어떤 자료를 더 챙겨야 하는지도 가늠할 수 있습니다.",
    "특히 국민연금을 받고 있는 경우는 주의가 필요합니다. 국민연금 수령액 자체는 소득인정액에 그대로 포함되지만, 그것과 별개로 국민연금 가입기간이 길거나 수령액이 기초연금액의 150%를 넘으면 기초연금이 최대 50%까지 단계적으로 감액되는 별도 규정이 있습니다. 이 계산기는 계산이 복잡하고 과대·과소 추정 위험이 커서 이 감액을 반영하지 않았으므로, 국민연금을 오래 받아온 경우 실제 지급액은 이 결과보다 낮게 나올 수 있습니다.",
    "이 계산기는 실제 제도를 단순화한 자가 점검용 추정이라는 한계가 분명합니다. 부부 감액 후 정확한 1인당 지급액, 고급자동차·회원권 처리, 소득역전방지 감액 등은 실제 심사에서 별도로 반영됩니다. 정확한 수급 여부와 지급액은 반드시 복지로 모의계산 또는 국민연금공단, 주소지 읍면동 주민센터에서 최종 확인해야 하며, 이 결과만으로 신청 여부를 단정하지 않는 것이 좋습니다.",
  ],
  inputPoints: [
    "단독·부부가구별 2026년 기초연금 선정기준액을 바로 확인할 수 있습니다.",
    "소득과 재산을 반영한 소득인정액을 간이 추정할 수 있습니다.",
    "예상 기초연금액과 선정기준까지 남은 금액을 볼 수 있습니다.",
  ],
  criteria: [
    "2026년 선정기준액과 소득인정액 산정 방식은 보건복지부 발표 기준을 사용합니다.",
    "재산의 소득환산율은 연 4%, 금융재산 공제 2,000만원을 적용합니다.",
    "국민연금 연계 감액과 소득역전방지 감액은 반영하지 않은 단순 추정입니다.",
    "최종 수급 여부와 금액은 복지로 모의계산 또는 국민연금공단·주민센터에서 확인해야 합니다.",
  ],
};

export const BPEC_CONFIG = {
  selectionThreshold: BPEC_SELECTION_THRESHOLD,
  maxBenefit: BPEC_MAX_BENEFIT,
  basicAssetDeduction: BPEC_BASIC_ASSET_DEDUCTION,
  financialAssetDeduction: BPEC_FINANCIAL_ASSET_DEDUCTION,
  assetConversionRateAnnual: BPEC_ASSET_CONVERSION_RATE_ANNUAL,
  workIncomeDeduction: BPEC_WORK_INCOME_DEDUCTION,
  workIncomeRate: BPEC_WORK_INCOME_RATE,
  coupleReductionRate: BPEC_COUPLE_REDUCTION_RATE,
  presets: BPEC_PRESETS,
  labels: {
    household: BPEC_HOUSEHOLD_LABELS,
    region: BPEC_REGION_LABELS,
  },
};
