import {
  WBE_2026_THRESHOLDS,
  WBE_ASSET_DEDUCTION_BY_REGION,
  WBE_MONTHLY_CONVERSION_RATE,
  WBE_WORK_INCOME_DEDUCTION,
} from "./welfareBenefitEligibility";

export const LBIRC_META = {
  slug: "livelihood-benefit-income-recognition",
  title: "생계급여 소득인정액 계산기 2026",
  seoTitle: "생계급여 소득인정액 계산기 2026 | 선정기준·예상 지급액 확인",
  seoDescription:
    "가구원 수, 월소득, 재산을 입력해 2026년 생계급여 선정기준 대비 소득인정액과 예상 생계급여액을 자가 점검용으로 계산합니다.",
  dataNote:
    "2026년 기준 중위소득과 생계급여 선정기준을 바탕으로 한 자가 점검용 추정입니다. 실제 수급 여부와 지급액은 주민센터 조사와 공적자료 확인 결과에 따라 달라질 수 있습니다.",
  updatedAt: "2026-06-15",
};

export const LBIRC_REGION_LABELS = {
  metro: "대도시",
  city: "중소도시",
  rural: "농어촌",
};

export const LBIRC_HOUSING_LABELS = {
  rent: "월세",
  jeonse: "전세",
  own: "자가",
  free: "무상거주",
};

export const LBIRC_PRESETS = [
  {
    id: "single-low-income",
    label: "1인 저소득 가구",
    summary: "월소득 70만 원 · 금융재산 300만 원",
    input: { householdSize: 1, region: "metro", earnedIncome: 700000, financialAsset: 3000000 },
  },
  {
    id: "single-parent-two",
    label: "2인 한부모 가구",
    summary: "월소득 150만 원 · 전세보증금 5,000만 원",
    input: { householdSize: 2, region: "city", housingType: "jeonse", earnedIncome: 1500000, housingAsset: 50000000 },
  },
  {
    id: "family-four-borderline",
    label: "4인 경계 가구",
    summary: "월소득 250만 원 · 금융재산 500만 원",
    input: { householdSize: 4, region: "metro", earnedIncome: 2500000, financialAsset: 5000000 },
  },
  {
    id: "senior-alone",
    label: "노인 단독 가구",
    summary: "공적 이전소득 70만 원 · 농어촌 자가",
    input: { householdSize: 1, region: "rural", housingType: "own", publicTransferIncome: 700000, housingAsset: 40000000 },
  },
];

export const LBIRC_FAQ = [
  {
    question: "생계급여 소득인정액이 무엇인가요?",
    answer:
      "소득인정액은 실제 월소득에 재산을 월 소득처럼 환산한 금액을 더한 값입니다. 월급이 낮아도 전세보증금, 예금, 자동차 같은 항목 때문에 결과가 달라질 수 있습니다.",
  },
  {
    question: "생계급여 예상액은 정확한 금액인가요?",
    answer:
      "아닙니다. 이 계산기는 생계급여 선정기준에서 소득인정액을 뺀 간이 추정액을 보여줍니다. 실제 지급액은 주민센터 조사와 다른 급여 반영 여부에 따라 달라질 수 있습니다.",
  },
  {
    question: "재산이 있으면 생계급여를 받을 수 없나요?",
    answer:
      "재산이 있다고 무조건 제외되는 것은 아닙니다. 지역별 기본재산액, 재산 종류, 부채 인정 여부, 자동차 용도 등을 함께 봅니다.",
  },
  {
    question: "자동차가 있으면 어떻게 표시되나요?",
    answer:
      "자동차는 제도상 예외와 확인 항목이 많아 이 계산기에서는 확인 필요 플래그로 분리합니다. 차량 용도와 가액은 주민센터에서 별도로 확인하는 것이 좋습니다.",
  },
  {
    question: "생계급여 기준을 넘으면 다른 지원은 없나요?",
    answer:
      "생계급여 기준을 넘더라도 주거급여, 교육급여, 긴급복지, 차상위계층 지원 등은 별도로 확인할 수 있습니다.",
  },
];

export const LBIRC_RELATED_LINKS = [
  { href: "/tools/housing-benefit-income-recognition/", label: "주거급여 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "기초생활수급자 자격 계산기" },
  { href: "/tools/basic-livelihood-recipient-asset-standard/", label: "기초생활수급자 재산 기준 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지지원금 정리" },
  { href: "/tools/high-oil-support-payment-calculator/", label: "고유가 지원금 계산기" },
];

export const LBIRC_SEO_CONTENT = {
  introTitle: "생계급여는 월급만이 아니라 소득인정액으로 봅니다",
  intro: [
    "생계급여를 신청하기 전에 가장 먼저 막막한 부분은 \"내가 받을 수 있는지조차 모르겠다\"는 점입니다. 월급이 적어도 전세보증금이나 예금이 있으면 탈락할 수도 있다는 이야기를 듣고 나면, 주민센터에 가기 전에 미리 가늠해보고 싶은 게 당연합니다. 이 계산기는 가구원 수, 월소득, 재산을 입력해 신청 전에 스스로 점검할 수 있도록 만든 도구입니다.",
    "생계급여는 단순히 월급이 얼마인지로만 판단하지 않습니다. 실제 월소득에 일하면서 받는 근로소득 공제를 적용한 값과, 보유한 재산을 매달 일정 비율로 환산한 '재산의 소득환산액'을 더한 소득인정액을 기준으로 봅니다. 2026년 생계급여 선정기준은 기준 중위소득의 32%이며, 예를 들어 4인 가구는 월 2,078,316원이 선정기준입니다. 이 기준선보다 소득인정액이 낮아야 생계급여를 신청할 수 있는 구간으로 봅니다.",
    "결과를 볼 때는 소득인정액이 선정기준보다 낮은지부터 확인한 뒤, 두 값의 차이가 얼마나 나는지를 함께 보는 것이 중요합니다. 차이가 클수록 신청 가능성이 높다고 볼 수 있는 여유 구간이고, 차이가 거의 없는 경계 구간이라면 실제 조사에서 결과가 뒤바뀔 수 있다는 뜻으로 받아들여야 합니다. 재산 항목 중 어떤 것이 소득인정액을 많이 끌어올렸는지 분해 결과로 확인하면 어떤 자료를 더 챙겨야 하는지도 가늠할 수 있습니다.",
    "다만 이 계산기는 실제 제도를 단순화한 자가 점검용 추정이라는 한계가 분명합니다. 자동차의 용도와 가액, 부채의 인정 범위, 부양의무자 관련 예외 규정 등은 실제 조사 과정에서 별도로 확인되며 이 계산기의 간이 모델과 다르게 반영될 수 있습니다. 정확한 수급 여부와 지급액은 반드시 복지로 또는 주소지 읍면동 주민센터에서 최종 확인해야 하며, 이 결과만으로 신청 여부를 단정하지 않는 것이 좋습니다.",
  ],
  inputPoints: [
    "가구원 수별 2026년 생계급여 선정기준을 확인할 수 있습니다.",
    "월소득과 재산을 반영한 소득인정액을 간이 추정할 수 있습니다.",
    "예상 생계급여액과 기준선까지 남은 금액을 볼 수 있습니다.",
  ],
  criteria: [
    "기준 중위소득과 생계급여 선정기준은 저장소의 2026년 기준값을 사용합니다.",
    "소득인정액 계산은 실제 제도를 단순화한 자가 점검용 추정입니다.",
    "자동차, 부채, 재산 특례는 실제 조사에서 달라질 수 있어 확인 필요로 표시합니다.",
    "최종 수급 여부는 복지로 또는 주민센터에서 확인해야 합니다.",
  ],
};

export const LBIRC_CONFIG = {
  thresholds: WBE_2026_THRESHOLDS,
  assetDeductions: WBE_ASSET_DEDUCTION_BY_REGION,
  rates: WBE_MONTHLY_CONVERSION_RATE,
  workDeduction: WBE_WORK_INCOME_DEDUCTION,
  presets: LBIRC_PRESETS,
  labels: {
    regions: LBIRC_REGION_LABELS,
    housing: LBIRC_HOUSING_LABELS,
  },
};
