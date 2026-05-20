export type HouseholdRegion = "metro" | "city" | "rural";
export type HousingType = "rent" | "jeonse" | "own" | "free";
export type CarType = "none" | "general" | "business" | "disabled";
export type SupportType = "livelihood" | "medical" | "housing" | "education";
export type ObligorLevel = "none" | "low" | "high" | "unknown";

export interface BenefitThreshold {
  householdSize: number;
  medianIncome: number;
  livelihood: number;
  medical: number;
  housing: number;
  education: number;
}

export interface WbePreset {
  id: string;
  label: string;
  summary: string;
  input: Record<string, string | number | boolean>;
}

export const WBE_META = {
  title: "복지급여 수급 자격 계산기",
  seoTitle: "기초생활수급자 자격 계산기 - 2026 생계·의료·주거·교육급여 기준 확인",
  seoDescription:
    "가구원 수, 소득, 재산, 자동차 정보를 입력하면 2026년 기준 중위소득 대비 소득인정액과 생계·의료·주거·교육급여 수급 가능성을 자가 점검용으로 계산합니다.",
  dataNote:
    "2026년 기준 중위소득과 급여별 선정기준을 바탕으로 한 자가 점검용 추정입니다. 실제 수급 여부는 주민센터 조사와 공적자료 확인으로 결정됩니다.",
  updatedAt: "2026년 기준",
};

export const WBE_REGION_LABELS: Record<HouseholdRegion, string> = {
  metro: "대도시",
  city: "중소도시",
  rural: "농어촌",
};

export const WBE_HOUSING_LABELS: Record<HousingType, string> = {
  rent: "월세",
  jeonse: "전세",
  own: "자가",
  free: "무상거주",
};

export const WBE_CAR_LABELS: Record<CarType, string> = {
  none: "없음",
  general: "일반 차량",
  business: "생업용 차량",
  disabled: "장애·보훈 차량",
};

export const WBE_OBLIGOR_LABELS: Record<ObligorLevel, string> = {
  none: "없음",
  low: "낮음",
  high: "높음",
  unknown: "모름",
};

export const WBE_BENEFIT_LABELS: Record<SupportType, string> = {
  livelihood: "생계급여",
  medical: "의료급여",
  housing: "주거급여",
  education: "교육급여",
};

export const WBE_2026_THRESHOLDS: BenefitThreshold[] = [
  { householdSize: 1, medianIncome: 2564238, livelihood: 820556, medical: 1025695, housing: 1230834, education: 1282119 },
  { householdSize: 2, medianIncome: 4199292, livelihood: 1343773, medical: 1679717, housing: 2015660, education: 2099646 },
  { householdSize: 3, medianIncome: 5359036, livelihood: 1714892, medical: 2143614, housing: 2572337, education: 2679518 },
  { householdSize: 4, medianIncome: 6494738, livelihood: 2078316, medical: 2597895, housing: 3117474, education: 3247369 },
  { householdSize: 5, medianIncome: 7556719, livelihood: 2418150, medical: 3022688, housing: 3627225, education: 3778360 },
  { householdSize: 6, medianIncome: 8555952, livelihood: 2737905, medical: 3422381, housing: 4106857, education: 4277976 },
];

export const WBE_ASSET_DEDUCTION_BY_REGION: Record<HouseholdRegion, number> = {
  metro: 99000000,
  city: 77000000,
  rural: 53000000,
};

export const WBE_MONTHLY_CONVERSION_RATE = {
  housingAsset: 0.0104,
  generalAsset: 0.0104,
  financialAsset: 0.0626,
  carWarningOnly: true,
};

export const WBE_WORK_INCOME_DEDUCTION = {
  basic: 0.3,
  max: 600000,
};

export const WBE_PRESETS: WbePreset[] = [
  {
    id: "youth-part-time",
    label: "1인 청년 아르바이트",
    summary: "월소득 80만 원, 금융재산 300만 원",
    input: {
      householdSize: 1,
      region: "metro",
      housingType: "rent",
      earnedIncome: 800000,
      financialAsset: 3000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: "single-parent",
    label: "2인 한부모 가구",
    summary: "월소득 160만 원, 전세 5천만 원",
    input: {
      householdSize: 2,
      region: "city",
      housingType: "jeonse",
      minorChildren: 1,
      isSingleParent: true,
      earnedIncome: 1600000,
      housingAsset: 50000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: "family-four",
    label: "4인 맞벌이 가구",
    summary: "월소득 250만 원, 금융재산 500만 원",
    input: {
      householdSize: 4,
      region: "metro",
      housingType: "rent",
      minorChildren: 2,
      earnedIncome: 2500000,
      financialAsset: 5000000,
      applyWorkDeduction: true,
    },
  },
  {
    id: "senior-alone",
    label: "노인 단독 가구",
    summary: "이전소득 70만 원, 자가 소액",
    input: {
      householdSize: 1,
      region: "rural",
      housingType: "own",
      publicTransferIncome: 700000,
      housingAsset: 40000000,
      hasDisabilityOrElderly: true,
    },
  },
  {
    id: "car-risk",
    label: "자동차 보유 가구",
    summary: "3인, 월소득 170만 원, 차량 1,200만 원",
    input: {
      householdSize: 3,
      region: "city",
      earnedIncome: 1700000,
      carValue: 12000000,
      carType: "general",
      applyWorkDeduction: true,
    },
  },
];

export const WBE_CHECKLIST = [
  "신분증과 통장 사본",
  "임대차계약서 또는 주거 형태 확인 자료",
  "가족관계증명서와 주민등록등본",
  "최근 소득 확인 자료와 사업소득 자료",
  "예금·보험·주식 등 금융재산 확인 자료",
  "부채 증빙 서류와 자동차 관련 서류",
  "실직·질병·폐업 등 위기 사유 증빙",
];

export const WBE_FAQ = [
  {
    question: "이 계산기로 실제 수급 여부를 확정할 수 있나요?",
    answer:
      "아니요. 이 계산기는 신청 전 자가 점검용 간이 계산기입니다. 실제 수급 여부는 주민센터 신청 후 소득·재산 공적자료 조사와 가구 특성 확인을 거쳐 결정됩니다.",
  },
  {
    question: "소득인정액이 무엇인가요?",
    answer:
      "소득인정액은 실제 월 소득에 재산을 월 소득처럼 환산한 금액을 더한 값입니다. 그래서 월소득이 낮아도 재산이나 자동차가 있으면 결과가 달라질 수 있습니다.",
  },
  {
    question: "생계급여와 주거급여 기준은 다른가요?",
    answer:
      "네. 2026년 기준으로 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다.",
  },
  {
    question: "예상 생계급여액은 어떻게 계산하나요?",
    answer:
      "간단히 생계급여 선정기준에서 소득인정액을 뺀 금액으로 추정합니다. 실제 지급액은 조사 결과와 다른 급여 반영 여부에 따라 달라질 수 있습니다.",
  },
  {
    question: "자동차가 있으면 무조건 탈락하나요?",
    answer:
      "무조건은 아닙니다. 자동차의 용도, 가액, 배기량, 장애·생업용 여부 등에 따라 다르게 판단될 수 있습니다. 이 계산기는 자동차 보유 시 확인 필요 메시지를 별도로 표시합니다.",
  },
  {
    question: "부양의무자 기준은 아직 있나요?",
    answer:
      "급여 종류에 따라 다릅니다. 생계급여는 크게 완화되었지만 의료급여 등에서는 부양의무자 확인이 중요할 수 있어 결과에서 확인 필요 여부를 분리해 안내합니다.",
  },
  {
    question: "기초생활수급자가 아니어도 받을 수 있는 지원이 있나요?",
    answer:
      "가능합니다. 소득인정액이 기준 중위소득 50% 안팎이면 차상위계층, 한부모가족, 긴급복지, 교육급여, 에너지·문화 바우처 같은 대체 지원을 함께 확인할 수 있습니다.",
  },
  {
    question: "어디에서 신청하나요?",
    answer:
      "온라인은 복지로에서 확인할 수 있고, 오프라인은 주소지 읍면동 주민센터에서 상담·신청할 수 있습니다. 정확한 서류는 가구 상황에 따라 달라집니다.",
  },
];

export const WBE_RELATED_LINKS = [
  { href: "/tools/daycare-vs-kindergarten-cost/", label: "어린이집 vs 유치원 비용 계산기" },
  { href: "/tools/year-end-tax-refund-calculator/", label: "연말정산 환급금 계산기" },
  { href: "/reports/daycare-kindergarten-cost-2026/", label: "2026 어린이집·유치원 비용 리포트" },
  { href: "/reports/newlywed-cost-2026/", label: "2026 신혼부부 생활비 리포트" },
  { href: "/tools/newlywed-rent-vs-buy/", label: "신혼부부 전월세 vs 매매 계산기" },
];

export const WBE_SEO_CONTENT = {
  introTitle: "복지급여 수급 자격 계산기는 2026년 기준 중위소득으로 신청 가능성을 먼저 확인하는 도구입니다",
  intro: [
    "기초생활보장 급여는 단순 월급이 아니라 소득인정액을 기준으로 판단합니다. 소득인정액은 실제 월 소득에 재산을 월 소득처럼 환산한 금액을 더한 값입니다. 이 계산기는 2026년 기준 중위소득과 급여별 선정기준을 바탕으로 우리 집이 어느 기준선에 가까운지 간이 확인할 수 있도록 설계했습니다.",
    "2026년 기준으로 생계급여는 기준 중위소득 32%, 의료급여는 40%, 주거급여는 48%, 교육급여는 50% 이하 기준을 사용합니다. 예를 들어 4인 가구 기준 중위소득은 월 6,494,738원이며 생계급여 선정기준은 월 2,078,316원입니다.",
    "이 계산기는 월 소득, 근로·사업소득 간이 공제, 주거·일반·금융재산의 소득환산액을 나누어 보여줍니다. 전세보증금, 예금, 주식, 자동차 때문에 결과가 달라지는 경우를 확인할 수 있도록 주의 플래그를 별도로 표시합니다.",
    "생계급여 예상액은 생계급여 선정기준에서 소득인정액을 뺀 값으로 단순 추정합니다. 실제 지급액은 공적자료 조사, 가구 특성, 다른 급여 반영, 부양의무자 기준 등에 따라 달라질 수 있으므로 신청 전 참고용으로만 사용하세요.",
    "수급 기준을 조금 넘는다고 모든 지원이 끝나는 것은 아닙니다. 차상위계층, 한부모가족 지원, 긴급복지, 주거급여 단독 신청, 교육급여, 에너지·문화 바우처처럼 별도 기준으로 확인할 수 있는 제도도 함께 살펴보는 것이 좋습니다.",
  ],
  inputPoints: [
    "가구원 수와 거주 지역을 입력해 2026년 기준 중위소득에 따른 급여별 기준선을 확인할 수 있습니다.",
    "월 소득과 재산을 입력해 소득인정액을 간이 추정할 수 있습니다.",
    "생계·의료·주거·교육급여 가능성과 대체 지원 후보를 함께 볼 수 있습니다.",
  ],
  criteria: [
    "기준 중위소득과 급여별 선정기준은 2026년 기준값을 사용합니다.",
    "소득인정액 계산은 실제 제도를 단순화한 자가 점검용 추정입니다.",
    "자동차, 부양의무자, 재산 특례는 실제 조사에서 달라질 수 있어 확인 필요로 표시합니다.",
    "최종 수급 여부는 복지로 또는 주소지 읍면동 주민센터에서 확인해야 합니다.",
  ],
};
