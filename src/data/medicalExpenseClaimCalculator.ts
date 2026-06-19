export type VisitType = "outpatient" | "inpatient";
export type Generation = "gen1" | "gen2" | "gen3" | "gen4";

export interface GenerationConfig {
  id: Generation;
  label: string;
  coveredCoPayRate: number;
  nonCoveredCoPayRate: number;
  outpatientDeductible: number;
  medicineDeductible: number;
  note: string;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const MECC_GENERATIONS: GenerationConfig[] = [
  {
    id: "gen1",
    label: "1세대 (~2009년)",
    coveredCoPayRate: 0.1,
    nonCoveredCoPayRate: 0,
    outpatientDeductible: 5000,
    medicineDeductible: 5000,
    note: "비급여 전액 지급 (자기부담 없음). 상품별 급여 자부담 10~20% 차이 있음.",
  },
  {
    id: "gen2",
    label: "2세대 (2009~2017년)",
    coveredCoPayRate: 0.1,
    nonCoveredCoPayRate: 0.1,
    outpatientDeductible: 10000,
    medicineDeductible: 5000,
    note: "급여 10%, 비급여 10% 자기부담. 현재 가입자 수가 가장 많은 세대.",
  },
  {
    id: "gen3",
    label: "3세대 (2017~2021년)",
    coveredCoPayRate: 0.2,
    nonCoveredCoPayRate: 0.3,
    outpatientDeductible: 10000,
    medicineDeductible: 5000,
    note: "급여 20%, 비급여 30% 자기부담. 보험료는 낮지만 본인 부담이 증가.",
  },
  {
    id: "gen4",
    label: "4세대 (2021년~)",
    coveredCoPayRate: 0.2,
    nonCoveredCoPayRate: 0.3,
    outpatientDeductible: 20000,
    medicineDeductible: 8000,
    note: "통원 공제 2만원, 약제비 공제 8천원으로 상향. 비급여 일부 특별약관 별도 적용.",
  },
];

export const NHI_COVERED_RATE: Record<VisitType, number> = {
  outpatient: 0.7,
  inpatient: 0.8,
};

export const MECC_DEFAULT = {
  visitType: "outpatient" as VisitType,
  coveredFee: 30000,
  nonCoveredFee: 0,
  medicineFee: 5000,
  generation: "gen3" as Generation,
  hasNonClaimDiscount: false,
  monthlyPremium: 60000,
  nonClaimDiscountRate: 0.1,
  nonClaimMonthsElapsed: 0,
};

export const NON_CLAIM_DISCOUNT_PERIOD_MONTHS = 36;

export const MECC_EXCLUDED_ITEMS: string[] = [
  "치과 치료 (충치·발치·임플란트·교정·보철)",
  "미용·성형 목적 시술 (쌍꺼풀·지방흡입 등)",
  "한방 치료 (일부 예외적 입원 제외)",
  "라식·라섹·드림렌즈 등 시력교정술",
  "예방접종·건강검진·종합검진",
  "임신·출산 관련 (제왕절개 일부 제외)",
  "보조기구 (안경·보청기·틀니 등)",
];

export const MECC_CLAIM_STEPS: string[] = [
  "진료비 영수증 및 세부내역서 발급 (병원 원무과)",
  "진단서는 입원 또는 특정 상병 시 요구됨",
  "보험사 앱 / 팩스 / 방문 창구로 청구",
  "소액(통상 3만원 미만)은 간소화 서류로 처리 가능한 경우 많음",
  "지급 소요 기간: 평균 3~7 영업일 이내",
];

export const MECC_FAQ: PageFaqItem[] = [
  {
    question: "소액 실손 청구하면 보험료가 오르나요?",
    answer: "갱신 시 보험료 인상은 청구 여부가 아닌 나이·업계 손해율 등으로 결정됩니다. 다만 무청구 할인 특약이 있는 경우 청구하면 3년 할인 조건이 리셋됩니다. 계산기에서 월 보험료와 무청구 경과 기간을 입력하면 청구 실익을 비교할 수 있습니다.",
  },
  {
    question: "치과 치료비도 실손으로 청구할 수 있나요?",
    answer: "대부분의 치과 치료는 실손보험 지급 대상 외입니다. 충치·임플란트·교정·보철은 제외되며, 악관절 질환 등 구강외과 수술 일부만 예외적으로 인정될 수 있습니다. 개별 약관을 확인하거나 보험사에 사전 문의하세요.",
  },
  {
    question: "3세대와 4세대 실손의 차이는 무엇인가요?",
    answer: "3세대는 급여 20%, 비급여 30% 자기부담이며 통원 공제 1만원, 약제비 공제 5천원입니다. 4세대는 자기부담률은 동일하나 통원 공제 2만원, 약제비 공제 8천원으로 소액 청구 시 본인 부담이 높습니다. 비급여 항목 일부는 특별약관으로 별도 관리됩니다.",
  },
  {
    question: "비급여 MRI는 실손 청구가 가능한가요?",
    answer: "1~3세대 실손 가입자는 의사 지시에 따른 비급여 MRI를 대부분 청구할 수 있습니다. 4세대는 MRI·CT 등이 비급여 특별약관으로 분리되어 있어 해당 특약 가입 여부를 먼저 확인해야 합니다.",
  },
  {
    question: "통원과 입원의 청구 방식이 다른가요?",
    answer: "네. 통원은 공단부담률 70%, 통원 공제금액(세대별 1~2만원) 공제 후 청구합니다. 입원은 공단부담률 80%, 별도 공제금 없이 입원 기간 합산 청구가 일반적입니다. 입원의 경우 환급 금액이 커서 청구 실익이 분명한 경우가 대부분입니다.",
  },
];

export const MECC_RELATED_LINKS = [
  {
    label: "실손보험 환급액 계산기 (세대별)",
    href: "/tools/silson-insurance-refund-calculator/",
    external: false,
  },
  {
    label: "건강보험 보장 범위 안내 — 국민건강보험",
    href: "https://www.nhis.or.kr/",
    external: true,
  },
  {
    label: "실손의료보험 표준약관 — 금융감독원",
    href: "https://www.fss.or.kr/",
    external: true,
  },
];

export const MECC_META = {
  slug: "medical-expense-claim-worth-calculator",
  title: "병원비 실손 청구하면 얼마 돌려받을까? 실비 청구 계산기 2026",
  description:
    "진료비·비급여·약제비 입력하면 실손보험 예상 환급액과 무청구 할인 손실을 비교해 청구 실익을 바로 계산합니다. 세대별 자기부담률 자동 반영.",
  updatedAt: "2026-06-19",
  caution:
    "본 계산기는 참고용이며 실제 지급액은 약관·가입 조건·상품별 특약에 따라 다를 수 있습니다. 정확한 금액은 해당 보험사에 문의하세요.",
};
