export const travelSavingsPresets = [
  {
    id: "osaka",
    label: "오사카 3박 4일",
    destination: "일본 오사카",
    monthsLeft: 6,
    people: 1,
    saved: 100000,
    budget: { flight: 300000, lodging: 300000, food: 180000, transport: 60000, activity: 80000, shopping: 100000 },
  },
  {
    id: "danang",
    label: "다낭 4박 5일 2인",
    destination: "베트남 다낭",
    monthsLeft: 8,
    people: 2,
    saved: 300000,
    budget: { flight: 900000, lodging: 600000, food: 350000, transport: 120000, activity: 250000, shopping: 200000 },
  },
  {
    id: "jeju",
    label: "제주 2박 3일",
    destination: "제주도",
    monthsLeft: 4,
    people: 2,
    saved: 200000,
    budget: { flight: 240000, lodging: 320000, food: 220000, transport: 180000, activity: 120000, shopping: 100000 },
  },
  {
    id: "bangkok",
    label: "방콕 5박 6일",
    destination: "태국 방콕",
    monthsLeft: 9,
    people: 1,
    saved: 0,
    budget: { flight: 500000, lodging: 420000, food: 200000, transport: 80000, activity: 180000, shopping: 200000 },
  },
  {
    id: "tokyo",
    label: "도쿄 4박 5일 2인",
    destination: "일본 도쿄",
    monthsLeft: 10,
    people: 2,
    saved: 400000,
    budget: { flight: 800000, lodging: 800000, food: 480000, transport: 160000, activity: 200000, shopping: 400000 },
  },
];

export const travelSavingsFaq = [
  {
    question: "여행 적금은 몇 개월 전부터 준비하면 좋나요?",
    answer: "일본, 제주처럼 가까운 여행은 3~6개월, 유럽이나 미주처럼 항공권 비중이 큰 여행은 12개월 이상 나누어 준비하면 월 부담이 줄어듭니다.",
  },
  {
    question: "적금 이자를 꼭 반영해야 하나요?",
    answer: "6개월 이내 단기 여행은 이자보다 월 저축 습관이 더 중요합니다. 1년 이상 준비한다면 2~4% 시나리오를 참고값으로 볼 수 있습니다.",
  },
  {
    question: "2인 여행도 계산할 수 있나요?",
    answer: "가능합니다. 총 여행 예산을 입력하고 동행 인원을 넣으면 1인당 예산도 함께 확인할 수 있습니다.",
  },
  {
    question: "항공권과 숙박비는 보통 예산의 몇 %를 차지하나요?",
    answer: "단거리 여행(일본, 동남아)은 항공·숙박 합산 비중이 50~60% 수준입니다. 유럽·미주처럼 항공권이 비싼 장거리 여행은 항공비만 40~50%에 달하기도 합니다. 항목별로 나누어 입력하면 어디에 예산이 집중되는지 파악하기 쉽습니다.",
  },
  {
    question: "여행 예비비는 얼마나 잡아야 하나요?",
    answer: "통상 총 여행 예산의 10~15%를 예비비로 두는 것을 권장합니다. 환율 변동, 현지 결제 수수료, 예상치 못한 식비·교통비, 소소한 기념품 비용 등이 실제로 발생하는 경우가 많습니다. 이 계산기에서 쇼핑/기타 항목에 예비비를 포함해 입력해 두는 것이 좋습니다.",
  },
  {
    question: "환율이 오르면 여행 예산이 얼마나 달라지나요?",
    answer: "환율이 10% 오르면 현지에서 쓰는 비용(숙박·식비·교통·쇼핑)이 동일 비율로 올라갑니다. 예를 들어 100엔=900원에서 100엔=1,000원으로 오르면 일본 여행 예산이 약 10% 증가합니다. 출발이 6개월 이상 남았다면 환율 변동 여유분을 예비비에 포함해 두는 것이 좋습니다.",
  },
  {
    question: "카드 포인트나 항공사 마일리지를 쓰면 얼마나 절약할 수 있나요?",
    answer: "항공사 마일리지로 항공권을 발권하면 편도 기준 5~15만 마일 수준이며, 카드 포인트·캐시백으로 숙박비 일부를 충당할 수 있습니다. 포인트 사용이 확정된 경우에는 해당 항목 예산을 줄여 입력하면 실제 필요한 적립액을 정확히 파악할 수 있습니다.",
  },
  {
    question: "적금 없이 그냥 모아도 되나요?",
    answer: "자유 적금이나 파킹통장을 활용하면 여행 자금을 쉽게 분리해 관리할 수 있습니다. 정기 적금은 중도 해지 시 이자 손실이 있으므로 출발 시기가 확정되지 않은 여행이라면 자유 적금이나 파킹통장이 더 유리할 수 있습니다.",
  },
];
