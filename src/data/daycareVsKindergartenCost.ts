export type CareRegion = "seoul" | "metro" | "city" | "rural";
export type HouseholdType = "dual" | "single";
export type DaycareType = "public" | "private" | "workplace";
export type KindergartenType = "public" | "private";

export type Option<T extends string> = {
  id: T;
  label: string;
  note?: string;
};

export type AgeSupport = {
  age: number;
  label: string;
  daycareVoucher: number;
  kindergartenEducation: number;
  kindergartenAfterschool: {
    public: number;
    private: number;
  };
  eligible: boolean;
  note: string;
};

export type DaycareCostProfile = {
  type: DaycareType;
  label: string;
  baseByAge: Record<number, number>;
  specialActivity: Record<CareRegion, number>;
  mealSnack: Record<CareRegion, number>;
  vehicle: Record<CareRegion, number>;
  extendedCare: Record<HouseholdType, number>;
  discountRate: number;
  note: string;
};

export type KindergartenCostProfile = {
  type: KindergartenType;
  label: string;
  baseTuition: Record<CareRegion, number>;
  afterschool: Record<CareRegion, number>;
  mealSnack: Record<CareRegion, number>;
  vehicle: Record<CareRegion, number>;
  materials: Record<CareRegion, number>;
  discountRate: number;
  note: string;
};

export const CARE_REGION_OPTIONS: Option<CareRegion>[] = [
  { id: "seoul", label: "서울", note: "특별활동·차량비가 높은 편" },
  { id: "metro", label: "수도권", note: "서울 외 경기·인천 기준" },
  { id: "city", label: "광역시", note: "부산·대구·광주 등 대도시" },
  { id: "rural", label: "지방", note: "중소도시·군 지역 평균 추정" },
];

export const HOUSEHOLD_OPTIONS: Option<HouseholdType>[] = [
  { id: "dual", label: "맞벌이", note: "연장보육·방과후 이용 가능성이 높은 가정" },
  { id: "single", label: "외벌이", note: "기본 시간 이용 중심 가정" },
];

export const DAYCARE_TYPE_OPTIONS: Option<DaycareType>[] = [
  { id: "public", label: "국공립 어린이집" },
  { id: "private", label: "민간·가정 어린이집" },
  { id: "workplace", label: "직장 어린이집" },
];

export const KINDERGARTEN_TYPE_OPTIONS: Option<KindergartenType>[] = [
  { id: "public", label: "국공립 유치원" },
  { id: "private", label: "사립 유치원" },
];

// 2026년 공개 단가 기준. 어린이집 0~2세 보육료는 2026년 보육사업안내 개정사항,
// 유치원 유아학비는 3~5세 누리과정 지원 단가를 기준으로 둔다.
export const AGE_SUPPORT_TABLE: AgeSupport[] = [
  {
    age: 0,
    label: "만 0세",
    daycareVoucher: 584000,
    kindergartenEducation: 0,
    kindergartenAfterschool: { public: 0, private: 0 },
    eligible: true,
    note: "어린이집 보육료 지원 대상입니다. 유치원은 보통 입학 대상이 아닙니다.",
  },
  {
    age: 1,
    label: "만 1세",
    daycareVoucher: 515000,
    kindergartenEducation: 0,
    kindergartenAfterschool: { public: 0, private: 0 },
    eligible: true,
    note: "어린이집 보육료 지원 대상입니다. 유치원은 보통 입학 대상이 아닙니다.",
  },
  {
    age: 2,
    label: "만 2세",
    daycareVoucher: 426000,
    kindergartenEducation: 0,
    kindergartenAfterschool: { public: 0, private: 0 },
    eligible: true,
    note: "어린이집 보육료 지원 대상입니다. 유치원은 보통 입학 대상이 아닙니다.",
  },
  {
    age: 3,
    label: "만 3세",
    daycareVoucher: 280000,
    kindergartenEducation: 280000,
    kindergartenAfterschool: { public: 50000, private: 70000 },
    eligible: true,
    note: "어린이집 보육료와 유치원 유아학비 중 실제 이용 기관에 맞는 지원을 받습니다.",
  },
  {
    age: 4,
    label: "만 4세",
    daycareVoucher: 280000,
    kindergartenEducation: 280000,
    kindergartenAfterschool: { public: 50000, private: 70000 },
    eligible: true,
    note: "누리과정 지원 대상입니다. 사립유치원은 추가 학부모 부담금이 생길 수 있습니다.",
  },
  {
    age: 5,
    label: "만 5세",
    daycareVoucher: 280000,
    kindergartenEducation: 280000,
    kindergartenAfterschool: { public: 50000, private: 70000 },
    eligible: true,
    note: "누리과정 지원 대상입니다. 지원 기간과 취학 시점은 기관에 확인하세요.",
  },
  {
    age: 6,
    label: "만 6세",
    daycareVoucher: 0,
    kindergartenEducation: 0,
    kindergartenAfterschool: { public: 0, private: 0 },
    eligible: false,
    note: "초등 취학 또는 취학유예 여부에 따라 지원이 달라져 기관 확인이 필요합니다.",
  },
  {
    age: 7,
    label: "만 7세",
    daycareVoucher: 0,
    kindergartenEducation: 0,
    kindergartenAfterschool: { public: 0, private: 0 },
    eligible: false,
    note: "일반적인 영유아 보육료·유아학비 계산 범위를 벗어나므로 참고 추정으로만 보세요.",
  },
];

export const DAYCARE_COST_PROFILES: DaycareCostProfile[] = [
  {
    type: "public",
    label: "국공립 어린이집",
    baseByAge: {
      0: 584000,
      1: 515000,
      2: 426000,
      3: 280000,
      4: 280000,
      5: 280000,
      6: 300000,
      7: 300000,
    },
    specialActivity: { seoul: 55000, metro: 50000, city: 42000, rural: 35000 },
    mealSnack: { seoul: 20000, metro: 18000, city: 15000, rural: 12000 },
    vehicle: { seoul: 0, metro: 15000, city: 15000, rural: 20000 },
    extendedCare: { dual: 20000, single: 5000 },
    discountRate: 0,
    note: "기본 보육료는 지원 단가 안에서 대부분 차감되는 구조로 가정했습니다.",
  },
  {
    type: "private",
    label: "민간·가정 어린이집",
    baseByAge: {
      0: 584000,
      1: 515000,
      2: 426000,
      3: 380000,
      4: 370000,
      5: 370000,
      6: 360000,
      7: 360000,
    },
    specialActivity: { seoul: 85000, metro: 75000, city: 65000, rural: 55000 },
    mealSnack: { seoul: 25000, metro: 22000, city: 18000, rural: 15000 },
    vehicle: { seoul: 25000, metro: 30000, city: 28000, rural: 25000 },
    extendedCare: { dual: 30000, single: 8000 },
    discountRate: 0,
    note: "3~5세 민간·가정 어린이집은 정부지원 보육료와 수납액 차액이 생길 수 있습니다.",
  },
  {
    type: "workplace",
    label: "직장 어린이집",
    baseByAge: {
      0: 584000,
      1: 515000,
      2: 426000,
      3: 300000,
      4: 300000,
      5: 300000,
      6: 320000,
      7: 320000,
    },
    specialActivity: { seoul: 45000, metro: 42000, city: 38000, rural: 35000 },
    mealSnack: { seoul: 18000, metro: 16000, city: 14000, rural: 12000 },
    vehicle: { seoul: 0, metro: 0, city: 0, rural: 0 },
    extendedCare: { dual: 10000, single: 5000 },
    discountRate: 0.12,
    note: "회사 복지로 일부 필요경비가 낮아지는 경우를 12% 절감 시나리오로 반영했습니다.",
  },
];

export const KINDERGARTEN_COST_PROFILES: KindergartenCostProfile[] = [
  {
    type: "public",
    label: "국공립 유치원",
    baseTuition: { seoul: 100000, metro: 100000, city: 100000, rural: 100000 },
    afterschool: { seoul: 50000, metro: 50000, city: 50000, rural: 50000 },
    mealSnack: { seoul: 25000, metro: 22000, city: 18000, rural: 15000 },
    vehicle: { seoul: 0, metro: 10000, city: 12000, rural: 15000 },
    materials: { seoul: 25000, metro: 22000, city: 18000, rural: 15000 },
    discountRate: 0,
    note: "교육과정비와 방과후 과정비는 지원금으로 대부분 차감되는 구조로 가정했습니다.",
  },
  {
    type: "private",
    label: "사립 유치원",
    baseTuition: { seoul: 430000, metro: 390000, city: 350000, rural: 320000 },
    afterschool: { seoul: 140000, metro: 125000, city: 110000, rural: 95000 },
    mealSnack: { seoul: 60000, metro: 52000, city: 45000, rural: 38000 },
    vehicle: { seoul: 35000, metro: 35000, city: 30000, rural: 25000 },
    materials: { seoul: 60000, metro: 52000, city: 45000, rural: 38000 },
    discountRate: 0,
    note: "사립유치원은 원비·급식비·교재비·특성화비 편차가 커 기본값은 추정값입니다.",
  },
];

export const DAYCARE_KINDERGARTEN_FAQ = [
  {
    question: "어린이집과 유치원 지원금은 동시에 받을 수 있나요?",
    answer:
      "아니요. 실제 이용 중인 기관에 맞춰 어린이집 보육료 또는 유치원 유아학비 중 하나를 지원받는 구조입니다. 기관을 옮길 때는 보육료·유아학비 자격 전환 신청이 필요할 수 있습니다.",
  },
  {
    question: "만 0~2세도 유치원 비용 비교가 가능한가요?",
    answer:
      "만 0~2세는 일반적으로 유치원 입학 대상이 아니어서 이 계산기에서는 유치원 비용을 참고값으로만 표시합니다. 실질 비교는 만 3~5세 구간에서 보는 것이 적절합니다.",
  },
  {
    question: "계산 결과가 실제 고지서 금액과 다른 이유는 무엇인가요?",
    answer:
      "특별활동비, 급식비, 차량비, 현장학습비, 교재비, 방과후 과정비는 기관과 지역별 차이가 큽니다. 이 계산기는 공개 지원 단가와 추정 숨은 비용을 조합한 참고용 결과입니다.",
  },
  {
    question: "맞벌이면 지원금이 더 늘어나나요?",
    answer:
      "기본 보육료·유아학비 자체가 맞벌이라는 이유만으로 자동 증액되는 것은 아닙니다. 다만 연장보육, 방과후 과정, 아이돌봄서비스 등 이용 가능성과 실제 비용 구조가 달라질 수 있어 맞벌이 시나리오를 따로 계산합니다.",
  },
  {
    question: "국공립이 항상 더 저렴한가요?",
    answer:
      "대체로 학부모 부담금은 낮은 편이지만 차량 이용, 방과후 프로그램, 특별활동 여부에 따라 달라질 수 있습니다. 통학 거리와 운영 시간까지 함께 비교하는 것이 좋습니다.",
  },
  {
    question: "만 6~7세는 어떻게 해석해야 하나요?",
    answer:
      "만 6~7세는 초등 취학, 취학유예, 방과후 돌봄 이용 여부에 따라 지원 기준이 달라집니다. 이 계산기의 만 6~7세 결과는 참고 추정이며 실제 지원 가능 여부는 기관과 주민센터에서 확인해야 합니다.",
  },
];

export const DAYCARE_KINDERGARTEN_RELATED_TOOLS = [
  { slug: "postnatal-care-cost", label: "산후도우미 비용 계산기" },
  { slug: "pregnancy-birth-cost", label: "임신 출산 비용 계산기" },
  { slug: "child-tutoring-cost-calculator", label: "아이 사교육비 계산기" },
  { slug: "birth-support-total", label: "출산~2세 총지원금 계산기" },
];
