import {
  WBE_2026_THRESHOLDS,
  WBE_ASSET_DEDUCTION_BY_REGION,
  WBE_MONTHLY_CONVERSION_RATE,
  WBE_WORK_INCOME_DEDUCTION,
} from "./welfareBenefitEligibility";

export const BLAS_META = {
  slug: "basic-livelihood-recipient-asset-standard",
  title: "기초생활수급자 재산 기준 계산기 2026",
  seoTitle: "기초생활수급자 재산 기준 계산기 2026 | 전세보증금·예금·자동차 확인",
  seoDescription:
    "주거재산, 금융재산, 일반재산, 부채, 자동차 정보를 입력해 기초생활수급자 재산 기준에서 소득환산액과 확인 필요 항목을 자가 점검합니다.",
  dataNote:
    "재산 기준은 실제 조사에서 재산 종류, 지역, 자동차 용도, 부채 인정 여부에 따라 달라질 수 있습니다. 이 계산기는 신청 전 이해를 돕는 자가 점검용 추정입니다.",
  updatedAt: "2026-06-15",
};

export const BLAS_REGION_LABELS = {
  metro: "대도시",
  city: "중소도시",
  rural: "농어촌",
};

export const BLAS_HOUSING_LABELS = {
  rent: "월세",
  jeonse: "전세",
  own: "자가",
  free: "무상거주",
};

export const BLAS_CAR_TYPE_LABELS = {
  none: "없음",
  general: "일반 차량",
  business: "생업용 차량",
  disabled: "장애인용 차량",
  protected: "보호용 차량",
};

export const BLAS_PRESETS = [
  {
    id: "jeonse-small",
    label: "전세보증금 5천만 원",
    summary: "대도시 · 전세보증금 중심",
    input: { region: "metro", housingType: "jeonse", housingAsset: 50000000, financialAsset: 3000000 },
  },
  {
    id: "deposit-financial",
    label: "예금 2천만 원",
    summary: "금융재산 영향 확인",
    input: { region: "metro", housingAsset: 0, financialAsset: 20000000 },
  },
  {
    id: "car-risk",
    label: "자동차 보유",
    summary: "차량가액 1,200만 원",
    input: { region: "city", housingAsset: 30000000, financialAsset: 5000000, hasCar: true, carValue: 12000000, carType: "general" },
  },
  {
    id: "debt-offset",
    label: "부채 차감",
    summary: "재산 1억 원 · 부채 4천만 원",
    input: { region: "metro", housingAsset: 80000000, financialAsset: 20000000, debt: 40000000 },
  },
];

export const BLAS_FAQ = [
  {
    question: "기초생활수급자는 재산이 있으면 안 되나요?",
    answer:
      "재산이 있다고 무조건 제외되는 것은 아닙니다. 지역별 기본재산액, 재산 종류, 월소득, 가구 특성을 함께 봅니다.",
  },
  {
    question: "전세보증금도 재산인가요?",
    answer:
      "전세보증금은 주거재산으로 볼 수 있습니다. 다만 지역별 기본재산액 차감과 실제 조사 기준에 따라 반영 방식이 달라질 수 있습니다.",
  },
  {
    question: "예금은 얼마까지 괜찮나요?",
    answer:
      "단순히 예금 총액만으로 판단하지 않습니다. 가구원 수, 지역, 다른 재산, 월소득과 함께 소득인정액으로 계산합니다.",
  },
  {
    question: "자동차가 있으면 기초생활수급자가 될 수 없나요?",
    answer:
      "무조건 그렇지는 않습니다. 차량 용도, 가액, 장애인용 또는 생업용 여부 등에 따라 다르게 볼 수 있어 별도 확인이 필요합니다.",
  },
  {
    question: "부채는 모두 재산에서 빼주나요?",
    answer:
      "인정 가능한 부채인지가 중요합니다. 금융기관 부채 등 확인 가능한 자료가 필요할 수 있으며 실제 인정 여부는 조사에서 결정됩니다.",
  },
  {
    question: "생계급여는 어렵지만 주거급여는 가능할 수 있나요?",
    answer:
      "가능할 수 있습니다. 급여마다 선정기준이 다르기 때문에 통합 복지급여 계산기로 함께 확인하는 것이 좋습니다.",
  },
];

export const BLAS_RELATED_LINKS = [
  { href: "/tools/livelihood-benefit-income-recognition/", label: "생계급여 소득인정액 계산기" },
  { href: "/tools/welfare-benefit-eligibility/", label: "기초생활수급자 자격 계산기" },
  { href: "/compare/welfare/", label: "복지지원금 비교표" },
  { href: "/reports/2026-government-welfare-benefits/", label: "2026 정부 복지지원금 정리" },
  { href: "/tools/high-oil-support-payment-calculator/", label: "고유가 지원금 계산기" },
];

export const BLAS_SEO_CONTENT = {
  introTitle: "기초생활수급자 재산 기준은 단순 총액이 아닙니다",
  intro: [
    "기초생활수급자 신청을 고민할 때 가장 헷갈리는 부분이 재산 기준입니다. \"전세보증금이 있으면 무조건 탈락인가\", \"차가 있으면 안 되나\" 같은 질문이 많은데, 기초생활보장 재산 기준은 재산이 있다, 없다로만 판단하지 않고 주거재산, 일반재산, 금융재산, 자동차, 부채를 나누어 보고 지역별 기본재산액도 함께 고려하는 다단계 구조입니다.",
    "전세보증금이나 자가 주택은 주거재산으로, 예금과 주식은 금융재산으로 분류되며, 각 재산 유형마다 적용되는 월 소득환산율이 다릅니다. 자동차는 시가 전체가 그대로 재산으로 잡히는 경우가 많아 다른 재산보다 환산율이 높게 적용되는 경향이 있고, 용도와 가액에 따라 실제 조사에서 특히 중요하게 확인되는 항목입니다.",
    "이 계산기는 입력한 재산 항목들을 지역별 기본재산액으로 먼저 차감한 뒤, 남은 재산을 유형별 환산율로 월 소득처럼 바꿔 소득인정액에 얼마나 영향을 주는지 보여주는 자가 점검용 도구입니다. 환산된 재산 소득이 클수록 실제 소득이 적어도 소득인정액이 기준선을 넘어 수급 자격에서 멀어질 수 있다는 점을 결과에서 확인할 수 있습니다.",
    "다만 이 계산기는 실제 제도를 단순화한 간이 모델이며, 자동차나 부채, 고액 금융재산처럼 특례 규정이 적용될 수 있는 항목은 실제 조사 과정에서 다르게 반영될 수 있습니다. 최종 수급 여부는 공적자료 조회와 주민센터 현장 조사 결과에 따라 달라지므로, 이 계산기의 결과는 신청 전 가능성을 가늠하는 참고용으로만 활용해야 합니다.",
  ],
  inputPoints: [
    "지역별 기본재산액 차감 후 남는 재산을 확인할 수 있습니다.",
    "주거재산, 금융재산, 일반재산의 월 소득환산액을 분리해 볼 수 있습니다.",
    "자동차, 부채, 고액 금융재산처럼 주민센터 확인이 필요한 항목을 알 수 있습니다.",
  ],
  criteria: [
    "기본재산액과 환산율은 기존 복지급여 계산기의 2026년 기준값을 사용합니다.",
    "재산의 소득환산은 실제 제도를 단순화한 간이 모델입니다.",
    "자동차, 부채, 재산 특례는 실제 조사에서 달라질 수 있어 확인 필요로 표시합니다.",
    "수급 가능성 전체 판단은 기초생활수급자 자격 계산기에서 다시 확인하는 흐름을 권장합니다.",
  ],
};

export const BLAS_CONFIG = {
  thresholds: WBE_2026_THRESHOLDS,
  assetDeductions: WBE_ASSET_DEDUCTION_BY_REGION,
  rates: WBE_MONTHLY_CONVERSION_RATE,
  workDeduction: WBE_WORK_INCOME_DEDUCTION,
  presets: BLAS_PRESETS,
  labels: {
    regions: BLAS_REGION_LABELS,
    housing: BLAS_HOUSING_LABELS,
    cars: BLAS_CAR_TYPE_LABELS,
  },
};
