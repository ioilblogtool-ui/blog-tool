export interface PetInsurancePreset {
  id: string;
  label: string;
  monthlyPremium: number;
  coverageLimit: number;
  coverageRate: number;
  deductibleRate: number;
}

export const PIC_PRESETS: PetInsurancePreset[] = [
  {
    id: "small-dog-basic",
    label: "소형견 기본형",
    monthlyPremium: 25_000,
    coverageLimit: 2_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "small-dog-premium",
    label: "소형견 프리미엄",
    monthlyPremium: 45_000,
    coverageLimit: 5_000_000,
    coverageRate: 0.8,
    deductibleRate: 0.1,
  },
  {
    id: "large-dog-basic",
    label: "대형견 기본형",
    monthlyPremium: 50_000,
    coverageLimit: 3_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "cat-basic",
    label: "고양이 기본형",
    monthlyPremium: 20_000,
    coverageLimit: 2_000_000,
    coverageRate: 0.7,
    deductibleRate: 0.2,
  },
  {
    id: "cat-premium",
    label: "고양이 프리미엄",
    monthlyPremium: 35_000,
    coverageLimit: 4_000_000,
    coverageRate: 0.8,
    deductibleRate: 0.1,
  },
];

export const PIC_DEFAULTS = {
  monthlyPremium: 30_000,
  coverageLimit: 3_000_000,
  coverageRate: 0.8,
  deductibleRate: 0.2,
  annualRoutine: 300_000,
  emergencyProb: 0.15,
  emergencyCost: 1_500_000,
  analysisYears: 10,
};

export interface FaqItem { question: string; answer: string; }
export const PIC_FAQ: FaqItem[] = [
  {
    question: "펫보험, 가입하는 게 유리한가요?",
    answer: "반려동물이 건강하고 병원을 거의 안 가는 경우 단기적으로는 비보험이 유리합니다. 그러나 큰 수술(십자인대·종양·디스크 등) 한 번이면 200~500만원이 발생하며, 이 경우 보험 수년치 보험료보다 훨씬 큽니다. 응급 발생 확률을 현실적으로 설정해 직접 비교해보세요.",
  },
  {
    question: "보험 가입 시기는 언제가 좋은가요?",
    answer: "어릴수록 유리합니다. 생후 2~3개월부터 가입 가능하며 이때 보험료가 가장 낮습니다. 나이가 들수록 보험료가 올라가고 일부 질환은 가입 자체가 거절되는 경우도 있습니다. 또한 기존 질환(선천성 등)은 보장에서 제외되는 경우가 많으므로 건강할 때 가입하는 것이 중요합니다.",
  },
  {
    question: "자기부담금이 뭔가요?",
    answer: "병원비 중 보험이 내 주지 않는 본인 부담 비율입니다. 예를 들어 자기부담금 20%, 보장률 80%이면 100만원 병원비 발생 시 보험이 80만원을 내주고 내가 20만원을 냅니다. 단, 보장 한도 초과 금액은 전액 본인 부담입니다.",
  },
  {
    question: "응급 발생 확률 15%는 어디서 나온 건가요?",
    answer: "농림축산식품부 반려동물 보고서 등의 연간 응급 처치 비율 데이터를 참고한 기본값입니다. 노령 반려동물, 유전질환 품종(스코티시폴드·골든리트리버 등)은 더 높게 설정하는 것이 현실적입니다. 슬라이더로 0~50% 사이에서 직접 조정해보세요.",
  },
  {
    question: "연간 보장 한도가 소진되면 어떻게 되나요?",
    answer: "연간 보장 한도 초과분은 전액 본인 부담입니다. 예를 들어 연간 보장 한도가 200만원인데 300만원짜리 수술이 발생하면, 초과 100만원은 보험 적용 없이 내가 부담합니다. 큰 수술 위험이 높은 품종은 보장 한도가 높은 상품을 선택하는 것이 좋습니다.",
  },
  {
    question: "이 계산기가 추천하는 특정 보험 상품이 있나요?",
    answer: "이 계산기는 특정 보험 상품을 추천하지 않습니다. 국내에서 판매 중인 펫보험 상품(메리츠화재·현대해상·삼성화재·DB손해보험 등)은 조건이 다르므로 실제 가입 전 각 보험사의 약관과 실제 보험료를 확인하시기 바랍니다.",
  },
  {
    question: "계산기에서 보험이 유리하다고 나왔는데, 실제로도 그런가요?",
    answer: "계산기 결과는 입력값(월 보험료, 응급 발생 확률, 병원비 등)에 따른 기대값 시뮬레이션입니다. 실제로는 응급이 전혀 없을 수도, 한 번에 큰 수술이 생길 수도 있습니다. 기대값 기준으로 보험 유·불리를 판단하되, 고액 수술에 대비한 '안전망' 역할도 고려하세요.",
  },
];

export const PIC_META = {
  slug: "pet-insurance-calculator",
  title: "펫보험 vs 비보험 손익 계산기 2026",
  description: "월 보험료, 보장 범위, 예상 병원비를 입력하면 펫보험 가입 시 손익분기점과 N년 후 절감액을 계산해드립니다.",
};
