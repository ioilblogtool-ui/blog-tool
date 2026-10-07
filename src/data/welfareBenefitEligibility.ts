import { WELFARE_YEARS } from './welfareThresholds';

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
  title: "2027 기준 중위소득·복지급여 자격 계산기",
  seoTitle: "2027 기준 중위소득 계산기 - 생계·의료·주거·교육급여 기준 비교",
  seoDescription: "가구원 수와 월 소득인정액을 입력해 2027 기준 중위소득 대비 비율과 생계·의료·주거·교육급여 선정기준을 비교하세요. 2026년 비교와 월 소득 단순 비교도 제공합니다.",
  dataNote: "2027년 기준은 2027년 1월 1일부터 적용됩니다. 비교 결과는 시뮬레이션이며 실제 수급 결정이 아닙니다.",
  updatedAt: "2026-10-07",
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

// 기존 상세 계산기의 2026년 1~6인 값과 공개 형식을 유지한다.
export const WBE_2026_THRESHOLDS: BenefitThreshold[] = Array.from({length:6}, (_, i) => {
  const row = WELFARE_YEARS[2026].rows[i+1];
  return {householdSize:i+1,medianIncome:row.median.amount!,livelihood:row.livelihood.amount!,medical:row.medical.amount!,housing:row.housing.amount!,education:row.education.amount!};
});

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
  {question:"2027년 4인 가구 기준 중위소득은 얼마인가요?",answer:"월 6,929,885원입니다. 2026년 6,494,738원보다 6.70% 인상되었습니다. 2027년 기준은 2027년 1월 1일부터 적용됩니다."},
  {question:"기준 중위소득 32%·40%·48%·50%는 어떤 급여인가요?",answer:"생계급여 32%, 의료급여 40%, 주거급여 48%, 교육급여 50%의 선정기준입니다. 계산기는 공식표의 원 단위 금액과 입력 금액을 비교합니다. 소득기준 이외의 급여별 요건은 별도로 확인해야 합니다."},
  {question:"월급과 소득인정액은 같은 금액인가요?",answer:"같지 않습니다. 소득인정액은 소득평가액과 재산의 소득환산액을 합산하며 공제·자동차 등도 영향을 줍니다. 월 소득 모드는 이러한 법적 산정 전 금액을 단순 비교합니다."},
  {question:"기준과 같으면 기준 이하인가요?",answer:"원 단위 금액이 같으면 기준 이하로 표시합니다. 차액은 0원이고 ‘기준과 같음’을 함께 안내합니다. 화면의 반올림된 비율로 판정하지 않습니다."},
  {question:"기준까지 남은 금액이 실제 지원금인가요?",answer:"지원금이 아닙니다. 선정기준에서 입력 금액을 뺀 비교 차액입니다. 실제 지급액은 급여 종류와 조사 결과에 따라 별도로 산정됩니다."},
  {question:"8인 이상 가구도 계산할 수 있나요?",answer:"가구원 수는 20인까지 선택할 수 있습니다. 해당 연도의 공식 가산규칙과 기준금액이 확인된 항목만 계산합니다. 확인되지 않은 항목은 ‘공식 기준표 확인 후 안내 예정’으로 표시합니다."},
  {question:"의료급여와 교육급여는 소득기준만 충족하면 되나요?",answer:"소득기준 비교만으로 확정할 수 없습니다. 의료급여의 부양의무자 관련 기준과 교육급여의 학생 요건 등 추가 조건을 확인해야 합니다. 주소지 주민센터 또는 복지로에서 최종 상담을 받으세요."},
  {question:"공유 링크에 소득 금액이 들어가나요?",answer:"기본 링크에는 기준연도·가구원 수·입력 방식만 들어갑니다. 금액 포함을 직접 선택한 경우에만 주소의 fragment에 금액이 추가됩니다. 받는 사람이 열면 금액을 복원한 뒤 주소에서 제거하지만, 복사된 원본 링크에는 금액이 남으므로 공유 대상을 확인하세요."},
];
export const WBE_RELATED_LINKS = [
  {href:"/tools/livelihood-benefit-income-recognition/",label:"생계급여 소득인정액 계산기 · 현재 2026 기준"},
  {href:"/tools/housing-benefit-income-recognition/",label:"주거급여 소득인정액 계산기 · 현재 2026 기준"},
  {href:"/tools/education-benefit-eligibility-calculator-2026/",label:"교육급여 자격 계산기 · 현재 2026 기준"},
  {href:"/tools/basic-livelihood-recipient-asset-standard/",label:"기초생활수급자 재산 기준 · 현재 2026 기준"},
  {href:"/reports/2026-government-welfare-benefits/",label:"정부 복지지원금 안내 · 현재 2026 기준"},
];
export const WBE_SEO_CONTENT = {
  introTitle:"2027 기준 중위소득으로 우리 가구의 소득 위치와 복지급여 기준을 비교하세요",
  intro:[
    "2027 기준 중위소득 계산기는 우리 가구의 월 소득인정액이 생계·의료·주거·교육급여 선정기준과 얼마나 차이 나는지 확인하는 도구입니다. 기준 중위소득은 정부가 복지사업의 선정기준 등에 활용하는 정책 기준으로, 통계상의 개인 평균 연봉이나 세후 월급과는 다릅니다. 먼저 가구원 수와 기준연도를 고르고, 알고 있는 소득인정액을 원 단위로 입력하면 중위소득 대비 비율과 네 급여 기준을 함께 볼 수 있습니다.",
    "2027년 4인 가구 기준 중위소득은 월 6,929,885원으로 2026년보다 6.70% 인상되었습니다. 가구원이 다른 경우에는 해당 가구의 공식 기준표를 사용해야 합니다. 4인 가구 금액을 사람 수로 나누어 1인 기준을 만들거나 모든 가구에 같은 인상률을 곱하는 방식은 적용하지 않습니다. 2027년 기준은 2027년 1월 1일부터 적용되므로, 현재 적용되는 기준을 확인할 때에는 2026년을 선택하세요.",
    "네 급여의 소득 선정기준은 생계급여 32%, 의료급여 40%, 주거급여 48%, 교육급여 50%입니다. 2027년 4인 가구의 공식 기준은 각각 월 2,217,563원, 2,771,954원, 3,326,345원, 3,464,943원입니다. 한 급여의 기준을 넘더라도 다른 급여와의 비교 결과는 다를 수 있습니다. 이 계산기는 각 행에 기준 이하 또는 초과 여부를 표시하고, 기준까지 남은 금액이나 초과 금액을 원 단위로 안내합니다.",
    "통장에 들어오는 월급과 소득인정액은 같은 개념이 아닙니다. 소득인정액은 소득평가액과 재산의 소득환산액을 합산한 금액이며, 재산·자동차·금융재산·공제 등에 따라 단순 월 소득과 달라질 수 있습니다. 아직 소득인정액을 모른다면 월 소득 단순 비교 모드를 사용하되 결과를 수급 자격 판정으로 해석하지 마세요. 상세 계산기는 관련 링크에서 확인할 수 있으며, 해당 도구가 현재 2026 기준이라는 점도 함께 확인해야 합니다.",
    "표에 표시한 차액은 지원금이나 실제 지급액이 아닙니다. 의료급여에는 부양의무자 관련 기준, 교육급여에는 학생 요건 등 추가 확인사항이 있고 최종 결정은 신청 후 공적자료 조사로 이루어집니다. 2026년과 2027년 비교표는 같은 입력 금액을 고정해 기준 변화만 보여줍니다. 7인 원표 또는 8인 이상 산식이 확인되지 않은 급여는 임의 계산하지 않으며, 확인된 중위소득과 다른 급여 결과만 제공합니다. 신청 전 주민센터 또는 복지로에서 가구 상황을 확인하세요.",
  ],
  inputPoints:["소득인정액과 월 소득 단순 비교를 구분합니다.","2026·2027년 기준을 같은 금액으로 비교합니다.","비율은 반올림하고 판정은 원 단위로 계산합니다."],
  criteria:["공식 원표는 공식, 자체 비율·차액·가산 결과는 시뮬레이션으로 표시합니다.","8인 이상은 확인된 해당 항목의 가산규칙만 사용합니다.","확인되지 않은 기준은 0원이나 비율 곱셈으로 대체하지 않습니다.","금액 입력은 브라우저에서 계산하며 이 페이지의 세션 녹화는 사용하지 않습니다."],
};
