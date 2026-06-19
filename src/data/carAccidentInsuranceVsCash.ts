export const CACC_META = {
  slug: "car-accident-insurance-vs-cash-calculator",
  title: "자동차 사고 보험처리 vs 현금처리 계산기",
  seoTitle: "자동차 사고 보험처리 vs 현금처리 계산기 2026 | 수리비 얼마부터 보험처리할까",
  description:
    "수리비·자기부담금·할증률을 입력하면 보험처리와 현금처리 중 어느 쪽이 유리한지 3년 총비용 기준으로 즉시 계산합니다. 손익분기 수리비와 절약 금액 자동 산출.",
} as const;

export interface CaccPreset {
  id: string;
  label: string;
  repairCost: number;    // 만원
  deductible: number;   // 만원
  surchargeRate: number; // %
}

export const CACC_PRESETS: CaccPreset[] = [
  { id: "minor",  label: "경미한 접촉",  repairCost: 80,  deductible: 20, surchargeRate: 7  },
  { id: "bumper", label: "범퍼 교체",    repairCost: 150, deductible: 20, surchargeRate: 12 },
  { id: "medium", label: "중간 사고",    repairCost: 350, deductible: 20, surchargeRate: 20 },
  { id: "major",  label: "대형 사고",    repairCost: 700, deductible: 30, surchargeRate: 35 },
];

export interface CaccSurchargeGuide {
  range: string;
  rate: string;
  note: string;
}

export const CACC_SURCHARGE_GUIDE: CaccSurchargeGuide[] = [
  { range: "50만원 미만",  rate: "0~5%",   note: "소손해 처리 적용 가능, 보험사별 상이" },
  { range: "50~150만원",  rate: "5~15%",  note: "가장 많이 고민하는 구간" },
  { range: "150~500만원", rate: "15~30%", note: "보험처리 유리 가능성 높음" },
  { range: "500만원 이상", rate: "30~60%", note: "보험처리 유리, 등급 영향 큼" },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const CACC_FAQS: FaqItem[] = [
  {
    question: "보험처리하면 보험료가 얼마나 오르나요?",
    answer:
      "보험사·사고 유형·현재 등급에 따라 다르지만, 일반적으로 경미한 사고는 5~15%, 중간 사고는 15~30%, 대형 사고는 30~60% 수준으로 할증됩니다. 할증은 보통 3년간 유지됩니다. 이 계산기에서 예상 할증률을 직접 입력해 3년 총비용을 비교해보세요.",
  },
  {
    question: "현금처리 제안받았는데 어떻게 판단해야 하나요?",
    answer:
      "수리비 견적과 예상 할증률을 기준으로 3년 총비용을 비교하면 됩니다. 수리비가 '자기부담금 + 3년 추가 보험료 합산'보다 낮으면 현금처리가 유리합니다. 이 계산기에서 수리비를 입력하면 손익분기 금액이 바로 나옵니다.",
  },
  {
    question: "소손해 처리(할증 없는 보험처리)란 무엇인가요?",
    answer:
      "일부 보험사에서는 사고 손해액이 일정 금액 미만인 경우 보험처리를 해도 할증이 없는 소손해 처리 제도를 운용합니다. 보험사마다 기준이 다르므로 가입 보험사에 직접 확인하는 것이 좋습니다. 소손해 처리 적용이 가능하다면 보험처리가 훨씬 유리할 수 있습니다.",
  },
  {
    question: "무사고 할인이 사라지면 손해가 얼마나 되나요?",
    answer:
      "무사고 연수가 길수록 할인 폭이 크기 때문에 보험처리 시 손해도 커집니다. 무사고 10년 이상으로 최대 60% 할인을 받고 있다면 보험처리 한 번으로 할인이 줄어드는 손실까지 고려해야 합니다. 이 계산기는 할증률 기준으로 단순 계산하므로 무사고 등급 변화가 큰 경우 보험사에 별도 문의를 권장합니다.",
  },
  {
    question: "상대방 과실이 있으면 계산이 달라지나요?",
    answer:
      "상대방 과실이 있다면 상대방 보험사에서 수리비 일부 또는 전액을 청구할 수 있어 내 보험을 사용하지 않아도 됩니다. 이 경우 내 보험 할증 없이 처리가 가능하므로 반드시 과실 비율을 먼저 확인하세요. 이 계산기는 내 과실로 인한 단독 보험처리 상황을 기준으로 합니다.",
  },
  {
    question: "보험등급보호 특약이 있으면 보험처리가 무조건 유리한가요?",
    answer:
      "보험등급보호 특약은 1회 사고 시 등급 하락을 막아주므로 특약이 있다면 보험처리 부담이 크게 줄어듭니다. 다만 특약 사용 후 다음 해부터 특약이 소멸되거나 보험료가 오를 수 있어 약관을 확인해야 합니다.",
  },
  {
    question: "3년 이후에는 할증이 완전히 없어지나요?",
    answer:
      "대부분의 보험사는 사고 이력 할증을 3년간 적용합니다. 3년이 지나면 해당 사고의 할증은 사라지지만, 무사고 등급을 처음부터 회복하는 데는 추가 시간이 걸릴 수 있습니다. 보험사별로 등급 회복 기준이 다르므로 정확한 내용은 가입 보험사에 확인하세요.",
  },
];

export const CACC_DEFAULTS = {
  repairCost: 150,       // 만원
  deductible: 20,        // 만원
  annualPremium: 80,     // 만원
  surchargeRate: 12,     // %
  surchargePeriod: 3,    // 년
};
