export const EVI_SUBSIDIES: Record<string, { national: number; local: number }> = {
  seoul:    { national: 650, local: 200 },
  gyeonggi: { national: 650, local: 300 },
  busan:    { national: 650, local: 350 },
  daegu:    { national: 650, local: 400 },
  incheon:  { national: 650, local: 300 },
  gwangju:  { national: 650, local: 500 },
};

export const EVI_REGION_LABELS: Record<string, string> = {
  seoul: "서울", gyeonggi: "경기", busan: "부산",
  daegu: "대구", incheon: "인천", gwangju: "광주",
};

export const EVI_DEFAULTS = {
  annualKm: 15000,
  holdYears: 10,
  region: "seoul",
  evPrice: 5500,
  evBattery: 77,
  homeChargePct: 70,
  homeChargeRate: 120,
  publicChargeRate: 300,
  includeBatteryReplace: false,
  evInsuranceAnnual: 130,
  icePrice: 3500,
  iceFuelEff: 12,
  iceFuelPrice: 1700,
  iceMaintenanceAnnual: 50,
  iceInsuranceAnnual: 110,
};

export const EVI_META = {
  slug: "ev-vs-ice-10year-cost",
  title: "전기차 vs 내연기관 10년 유지비 계산기 2026 | 언제 본전 뽑나?",
  description: "차량가격·보조금·충전비·연료비 입력하면 10년 총비용 비교와 손익분기점 바로 계산. 배터리 교체 시나리오 포함.",
  updatedAt: "2026-06-17",
  caution: "전비·연비·보험료는 차종 및 운전 습관에 따라 다릅니다. 보조금은 예산 소진 시 변경될 수 있습니다.",
};

export const EVI_FAQ = [
  {
    question: "전기차가 내연기관보다 10년 기준 정말 저렴한가요?",
    answer: "보조금을 받고 가정충전 위주로 사용한다면 대부분의 경우 5~7년 내에 손익분기점을 넘어 전기차가 유리해집니다. 단, 공공충전만 사용하거나 배터리 교체가 필요한 경우 비용 이점이 줄어들 수 있습니다.",
  },
  {
    question: "전기차 배터리 교체 비용은 얼마인가요?",
    answer: "국산 전기차 기준 배터리 교체 비용은 약 800~1,200만원 수준입니다. 대부분의 제조사가 배터리에 8년/16만km 보증을 제공하므로 보증 기간 내에는 무상 교체가 가능합니다. 10년 이상 보유 시 교체 가능성을 고려해야 합니다.",
  },
  {
    question: "2026년 전기차 보조금은 얼마인가요?",
    answer: "2026년 기준 국가 보조금은 차종에 따라 최대 650만원이며, 지자체 보조금은 지역에 따라 200~500만원 수준입니다. 서울은 약 200만원, 광주는 약 500만원으로 지역 차이가 큽니다. 보조금은 예산 소진 시 조기 마감될 수 있습니다.",
  },
  {
    question: "아파트 거주자는 공공충전만 써야 하나요?",
    answer: "최근 아파트 단지 내 전기차 충전기 설치가 의무화되어 가정충전에 준하는 단가로 충전할 수 있는 환경이 늘고 있습니다. 공동주택 완속충전기 단가는 kWh당 100~180원 수준으로, 공공 급속충전기(250~350원)보다 저렴합니다.",
  },
  {
    question: "하이브리드 vs 전기차 비교는 어떻게 되나요?",
    answer: "하이브리드는 전기차보다 구매가가 낮고 보조금이 없지만, 연비가 내연기관 대비 40~60% 높아 연료비 절감 효과가 있습니다. 충전 인프라 걱정이 없고 장거리 주행에 유리합니다. 10년 총비용은 하이브리드가 전기차(보조금 받은 경우)와 비슷하거나 약간 높은 수준입니다.",
  },
];
