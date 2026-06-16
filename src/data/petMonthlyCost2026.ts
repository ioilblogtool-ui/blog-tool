export type PetType = "dog" | "cat";

export interface PetCostItem {
  id: string;
  label: string;
  defaultDog: number;
  defaultCat: number;
  min: number;
  max: number;
  step: number;
  required: boolean;
  unit: "월" | "월평균";
  hint: string;
}

export const PET_COST_ITEMS: PetCostItem[] = [
  {
    id: "food",
    label: "사료비",
    defaultDog: 60_000,
    defaultCat: 50_000,
    min: 10_000, max: 300_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "사료 브랜드·체중에 따라 차이 큼",
  },
  {
    id: "snack",
    label: "간식비",
    defaultDog: 20_000,
    defaultCat: 15_000,
    min: 0, max: 100_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "트릿·캔·습식 포함",
  },
  {
    id: "litter",
    label: "모래·패드",
    defaultDog: 10_000,
    defaultCat: 25_000,
    min: 0, max: 80_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "강아지: 배변패드 / 고양이: 화장실 모래",
  },
  {
    id: "medical",
    label: "병원·예방접종",
    defaultDog: 30_000,
    defaultCat: 20_000,
    min: 0, max: 200_000, step: 5_000,
    required: true,
    unit: "월평균",
    hint: "연간 병원비를 12로 나눈 월 평균값",
  },
  {
    id: "grooming",
    label: "미용비",
    defaultDog: 50_000,
    defaultCat: 10_000,
    min: 0, max: 200_000, step: 5_000,
    required: true,
    unit: "월평균",
    hint: "강아지: 6~8주 주기 / 고양이: 장모종만 해당",
  },
  {
    id: "toys",
    label: "장난감·용품",
    defaultDog: 10_000,
    defaultCat: 10_000,
    min: 0, max: 100_000, step: 5_000,
    required: true,
    unit: "월",
    hint: "리드줄·옷·장난감·화장실용품 등",
  },
  {
    id: "insurance",
    label: "펫보험",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 100_000, step: 5_000,
    required: false,
    unit: "월",
    hint: "미가입이면 0원. 가입 시 30,000~60,000원 수준",
  },
  {
    id: "hotel",
    label: "호텔·돌봄비",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 200_000, step: 10_000,
    required: false,
    unit: "월평균",
    hint: "여행·출장 시 펫시터·호텔 비용",
  },
  {
    id: "training",
    label: "훈련·교육비",
    defaultDog: 0,
    defaultCat: 0,
    min: 0, max: 100_000, step: 10_000,
    required: false,
    unit: "월평균",
    hint: "강아지 훈련소·개인 교육 포함",
  },
];

export interface FaqItem { question: string; answer: string; }
export const PMC_FAQ: FaqItem[] = [
  {
    question: "강아지와 고양이 중 어느 쪽이 더 비싸게 드나요?",
    answer: "일반적으로 강아지가 더 많이 듭니다. 미용비가 큰 비중을 차지하며, 대형견은 사료비도 고양이보다 2~3배 높습니다. 고양이는 모래 비용이 추가되지만 미용비가 낮아 평균적으로 강아지보다 월 5~15만원 적게 지출됩니다.",
  },
  {
    question: "병원비 기본값이 월 2~3만원인데 너무 적지 않나요?",
    answer: "이 값은 연간 병원비(예방접종·정기검진 포함 평균 30~40만원)를 12개월로 나눈 월 평균값입니다. 실제로는 건강한 달에는 0원, 아픈 달에는 수십만원이 나오는 구조입니다. 만약 노령 반려동물이라면 2~3배 높게 설정하세요.",
  },
  {
    question: "펫보험에 가입하면 실제로 절약이 되나요?",
    answer: "건강한 반려동물은 단기적으로 비보험이 유리할 수 있습니다. 하지만 큰 수술(십자인대·디스크·종양 등) 한 번이면 보험 미가입 시 200~500만원이 한꺼번에 나갑니다. 펫보험 손익 계산기에서 자세히 비교해보세요.",
  },
  {
    question: "계산값이 실제와 많이 다를 수 있나요?",
    answer: "기본값은 소형견·성묘 기준 국내 평균 데이터를 바탕으로 합니다. 대형견·노령 반려동물·특수 식이요법이 필요한 경우 실제 비용이 2배 이상 차이날 수 있습니다. 각 항목을 본인 상황에 맞게 직접 조정하세요.",
  },
  {
    question: "10년 비용이 너무 많은 것 같아요. 정말 이만큼 드나요?",
    answer: "월 20만원 기준으로도 10년이면 2,400만원입니다. 여기에 분양비, 예상치 못한 수술비, 노령기 의료비 증가를 합산하면 3,000~5,000만원이 현실적인 수치입니다. 입양 전 장기 비용 계획이 중요한 이유입니다.",
  },
  {
    question: "고양이 모래 비용은 왜 월 2~3만원씩 드나요?",
    answer: "두부 모래·벤토나이트·실리카겔 등 종류에 따라 2~5만원 수준이며, 멀티캣 가정은 더 높습니다. 자동 화장실을 사용하면 초기 구입비가 높지만 모래 사용량을 줄일 수 있습니다.",
  },
];

export const PMC_RELATED_LINKS = [
  { href: "/reports/pet-breed-10year-cost-comparison/", label: "품종별 10년 총비용 비교", description: "말티즈·골든리트리버·렉돌 등 14종 비교" },
  { href: "/tools/pet-insurance-calculator/", label: "펫보험 손익 계산기", description: "보험 가입 vs 비가입 누적 비용 비교" },
];

export const PMC_META = {
  slug: "pet-monthly-cost-calculator",
  title: "강아지·고양이 월 양육비 계산기 2026",
  description: "강아지·고양이 사료, 병원비, 미용, 간식 등 항목별 월 양육비를 계산하고 연간·10년 누적 비용을 확인하세요.",
};
