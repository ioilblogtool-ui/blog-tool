export type PcBadge = "공식" | "참고" | "추정" | "에디터 기준";

export type PcHeroStat = {
  label: string;
  value: string;
  note: string;
  badge: PcBadge;
};

export type PcRegionRow = {
  region: string;
  standardAvg: number;
  suiteAvg?: number;
  note?: string;
  badge: PcBadge;
};

export type PcPublicPrivateRow = {
  type: string;
  avgCost2Weeks: number;
  reservationDifficulty: string;
  location: string;
  serviceRange: string;
  valueForMoney: string;
  badge: PcBadge;
};

export type PcTrendRow = {
  period: string;
  nationalAvg: number;
  badge: PcBadge;
};

export type PcAlternativeRow = {
  type: string;
  avgCost: number;
  costLevel: string;
  careIntensity: string;
  mobility: string;
  supportLink: string;
};

export type PcRoomType = {
  type: string;
  roomDesc: string;
  priceRange: string;
  features: string;
  badge: PcBadge;
};

export type PcSupportFund = {
  name: string;
  usableForCenter: string;
  note: string;
  badge: PcBadge;
  available: "yes" | "no" | "conditional";
};

export type PcFaq = {
  q: string;
  a: string;
};

export const PC_META = {
  title: "2026 산후조리원 비용 완전 비교",
  description:
    "전국 평균, 서울·경기·지방, 일반실·특실, 공공 vs 민간까지 2026 산후조리원 2주 비용을 한 번에 비교하는 리포트입니다.",
  slug: "postpartum-center-cost-2026",
};

export const PC_HERO_STATS: PcHeroStat[] = [
  { label: "전국 평균 지출", value: "286.5만원", note: "보건복지부 2024 조사", badge: "공식" },
  { label: "전국 일반실 평균", value: "372만원", note: "2025 하반기 시세 참고", badge: "참고" },
  { label: "서울 일반실 평균", value: "506만원", note: "수도권 상단 구간", badge: "참고" },
  { label: "서울 특실 평균", value: "810만원", note: "2026년 보도 종합", badge: "참고" },
];

export const PC_REGION_COMPARISON: PcRegionRow[] = [
  { region: "서울", standardAvg: 506, suiteAvg: 810, note: "민간 기준 상단", badge: "참고" },
  { region: "광주", standardAvg: 407, badge: "참고" },
  { region: "인천", standardAvg: 396, badge: "참고" },
  { region: "경기", standardAvg: 438, suiteAvg: 622, note: "서울 대체 수요권", badge: "추정" },
  { region: "부산", standardAvg: 368, suiteAvg: 520, badge: "추정" },
  { region: "전국 평균", standardAvg: 372, suiteAvg: 543, badge: "참고" },
];

export const PC_SEOUL_DISTRICTS = [
  { district: "강남권", standardAvg: 620, suiteMax: 1732, note: "특실 최고가 기준" },
  { district: "마포·용산", standardAvg: 560, suiteMax: 980, note: "상단 프리미엄 집중" },
  { district: "송파·강동", standardAvg: 515, suiteMax: 860, note: "신축 선호권" },
  { district: "서울 평균", standardAvg: 506, suiteMax: 810, note: "민간 평균권" },
  { district: "노도강·서남권", standardAvg: 420, suiteMax: 620, note: "상대적 중저가" },
];

export const PC_PUBLIC_PRIVATE_COMPARE: PcPublicPrivateRow[] = [
  {
    type: "공공 산후조리원",
    avgCost2Weeks: 229.5,
    reservationDifficulty: "높음",
    location: "지자체 지정 시설",
    serviceRange: "기본 케어 중심",
    valueForMoney: "높음",
    badge: "공식",
  },
  {
    type: "민간 일반실",
    avgCost2Weeks: 477.5,
    reservationDifficulty: "보통",
    location: "전국 다수",
    serviceRange: "기본~중급 케어",
    valueForMoney: "보통",
    badge: "참고",
  },
  {
    type: "민간 특실",
    avgCost2Weeks: 764.1,
    reservationDifficulty: "중간",
    location: "주요 지역 집중",
    serviceRange: "고급 케어·부가 서비스",
    valueForMoney: "낮음",
    badge: "참고",
  },
];

export const PC_PRICE_TREND: PcTrendRow[] = [
  { period: "2021", nationalAvg: 243.1, badge: "공식" },
  { period: "2024", nationalAvg: 286.5, badge: "공식" },
  { period: "2024H2 일반실", nationalAvg: 355, badge: "참고" },
  { period: "2025H2 일반실", nationalAvg: 372, badge: "참고" },
  { period: "2024H2 특실", nationalAvg: 520, badge: "참고" },
  { period: "2025H2 특실", nationalAvg: 543, badge: "참고" },
];

export const PC_ALTERNATIVES: PcAlternativeRow[] = [
  {
    type: "산후조리원",
    avgCost: 286.5,
    costLevel: "높음",
    careIntensity: "높음",
    mobility: "시설 이동 필요",
    supportLink: "부분 적용",
  },
  {
    type: "산후도우미·재가조리",
    avgCost: 125.5,
    costLevel: "중간",
    careIntensity: "가정 환경 따라 다름",
    mobility: "집에서 가능",
    supportLink: "정부지원 연계 가능",
  },
  {
    type: "가족 도움 중심",
    avgCost: 30,
    costLevel: "낮음",
    careIntensity: "개인차 큼",
    mobility: "집에서 가능",
    supportLink: "직접 지원 없음",
  },
];

export const PC_ROOM_TYPES: PcRoomType[] = [
  {
    type: "일반실",
    roomDesc: "기본 1인실 중심",
    priceRange: "전국 평균권",
    features: "기본 케어, 공용 프로그램 중심",
    badge: "공식",
  },
  {
    type: "특실",
    roomDesc: "넓은 1인실, 부가 옵션 포함",
    priceRange: "상위 구간",
    features: "프라이빗 공간, 추가 식단·상담",
    badge: "참고",
  },
  {
    type: "프리미엄",
    roomDesc: "브랜드형 고급 상품",
    priceRange: "최고가 구간",
    features: "개인화 케어, 연계 서비스 확대",
    badge: "에디터 기준",
  },
];

export const PC_SUPPORT_FUNDS: PcSupportFund[] = [
  {
    name: "국민행복카드",
    usableForCenter: "카드 결제처 확인 필요",
    note: "산모·신생아 서비스와 사용 범위가 다를 수 있어 결제 전 확인이 필요합니다.",
    badge: "참고",
    available: "conditional",
  },
  {
    name: "첫만남이용권",
    usableForCenter: "일부 차감 가능",
    note: "지자체·가맹점 계약에 따라 사용 가능 여부가 달라질 수 있습니다.",
    badge: "참고",
    available: "conditional",
  },
  {
    name: "서울시 산후조리경비",
    usableForCenter: "직접 결제형 아님",
    note: "후지급 또는 지정 항목 환급 구조가 많아 조리원 기본 이용료와는 분리해 봐야 합니다.",
    badge: "공식",
    available: "no",
  },
];

export const PC_SAVING_TIPS = [
  "공공 산후조리원 가능 여부를 가장 먼저 확인하기",
  "서울 대신 경기·인천 대체권 가격까지 함께 보기",
  "일반실과 특실 차이가 실제로 필요한 옵션인지 구분하기",
  "조리원 2주 비용과 산후도우미 총비용을 함께 비교하기",
  "첫만남이용권·국민행복카드 사용 범위를 계약 전에 확인하기",
  "계약금 환불 규정과 취소 시점을 반드시 체크하기",
];

export const PC_FAQ: PcFaq[] = [
  {
    q: "산후조리원 2주 평균 비용은 얼마인가요?",
    a: "보건복지부 2024 조사 기준 전국 평균 지출은 286.5만원입니다. 최신 시세 참고 기준으로는 전국 일반실 평균 372만원, 특실 평균 543만원 수준으로 보는 흐름이 많습니다.",
  },
  {
    q: "서울 산후조리원이 왜 더 비싼가요?",
    a: "수요가 많고 프리미엄 브랜드, 특실 비중, 입지 프리미엄이 겹치기 때문입니다. 같은 2주 기준이어도 전국 평균보다 서울 일반실·특실의 격차가 큽니다.",
  },
  {
    q: "공공 산후조리원이 가장 가성비가 좋은가요?",
    a: "대체로 그렇습니다. 다만 공급이 적고 예약 경쟁이 치열해서 실제 이용 가능성까지 같이 판단해야 합니다.",
  },
  {
    q: "조리원 대신 산후도우미가 더 저렴한가요?",
    a: "총비용만 보면 산후도우미·재가조리가 더 낮은 경우가 많습니다. 대신 케어 강도와 회복 환경, 가족 지원 가능성을 함께 봐야 합니다.",
  },
  {
    q: "첫만남이용권으로 산후조리원 결제가 되나요?",
    a: "일부 가맹·결제 구조에서는 가능할 수 있지만 모든 조리원에서 동일하게 적용되지는 않습니다. 계약 전 카드 사용 가능 여부를 확인하는 것이 안전합니다.",
  },
];
