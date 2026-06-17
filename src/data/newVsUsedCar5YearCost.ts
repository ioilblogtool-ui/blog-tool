export const NUC_PRESETS = {
  small: {
    label: "소형차 (아반떼급)",
    newPrice: 2500, newInsurance: 100, newMonthly: 12, newResidual: 42,
    usedPrice: 1400, usedAge: 3, usedInsurance: 80, usedMonthly: 16, usedResidual: 28,
  },
  mid: {
    label: "준중형 (K5급)",
    newPrice: 3200, newInsurance: 120, newMonthly: 15, newResidual: 40,
    usedPrice: 1800, usedAge: 3, usedInsurance: 95, usedMonthly: 20, usedResidual: 25,
  },
  suv: {
    label: "SUV (투싼급)",
    newPrice: 3800, newInsurance: 140, newMonthly: 18, newResidual: 38,
    usedPrice: 2200, usedAge: 3, usedInsurance: 110, usedMonthly: 22, usedResidual: 23,
  },
} as const;

export const NUC_DEFAULTS = { ...NUC_PRESETS.mid };

export const NUC_META = {
  slug: "new-vs-used-car-5year-cost",
  title: "신차 vs 중고차 5년 총비용 계산기 2026 | 실제로 어떤 게 더 싸?",
  description: "신차·중고차 구매가격·보험·유지비·감가 입력하면 5년 총보유비용 바로 비교. 연도별 손익분기점 포함.",
  updatedAt: "2026-06-17",
  caution: "취득세·보험료·유지비는 차종·지역·운전 조건에 따라 다를 수 있습니다. 참고용 추정값입니다.",
};

export const NUC_FAQ = [
  {
    question: "신차 vs 중고차 5년 기준 어떤 게 더 저렴한가요?",
    answer: "차종과 중고차 연식에 따라 다르지만, 일반적으로 3년식 중고차는 구매가가 신차 대비 40~50% 낮아 초기 비용이 적습니다. 다만 유지비와 보험료가 신차보다 높고 잔존가치도 낮아, 5년 총비용은 조건에 따라 비슷하거나 중고차가 유리한 경우가 많습니다.",
  },
  {
    question: "취득세는 신차와 중고차가 다른가요?",
    answer: "승용차 기준 취득세율은 신차·중고차 모두 7%로 동일합니다. 단, 경차는 4%, 장애인·국가유공자 감면 혜택이 있을 수 있습니다. 본 계산기는 일반 승용차 7% 기준으로 계산합니다.",
  },
  {
    question: "감가(잔존가치)는 어떻게 계산하나요?",
    answer: "잔존가치는 5년 후 중고차 시세 기준으로 추정합니다. 신차는 보통 5년 후 원가의 35~45%, 3년 된 중고차는 5년 추가 보유 후 원가의 20~30% 수준으로 하락합니다. 인기 차종이나 희귀 모델은 잔존가치가 더 높을 수 있습니다.",
  },
  {
    question: "중고차 유지비가 신차보다 높은 이유는?",
    answer: "연식이 있는 중고차는 소모품 교체 주기가 짧아지고, 엔진오일·타이어·브레이크 패드 등의 교체 빈도가 높아집니다. 또한 예상치 못한 수리비가 발생할 확률도 신차보다 높습니다.",
  },
  {
    question: "5년 후 되팔 때 차액은 얼마나 차이 나나요?",
    answer: "신차 기준 5년 후 잔존가치는 구매가의 35~42% 수준이며, 3년 중고차를 5년 더 타면 최초 구매가의 20~28% 수준입니다. 절대 금액으로는 신차가 더 높은 금액을 받을 수 있지만, 초기 구매가 대비 감가율은 중고차가 더 큽니다.",
  },
];
