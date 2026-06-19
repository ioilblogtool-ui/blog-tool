export type MovingType = "full" | "semi" | "basic";
export type LadderOption = "none" | "from" | "to" | "both";
export type FloorRange = "1-5" | "6-10" | "11-15" | "16+";
export type VolumeLevel = "low" | "normal" | "high";
export type RegionType = "metro" | "city" | "local";

export interface RangeAmount {
  min: number;
  max: number;
}

export interface MovingBaseBand {
  id: string;
  label: string;
  minPyeong: number;
  maxPyeong: number;
  full: RangeAmount;
  semiRate: number;
  basicRate: number;
  note: string;
}

export const MCC_BASE_BANDS: MovingBaseBand[] = [
  {
    id: "studio",
    label: "원룸·5평 이하",
    minPyeong: 0,
    maxPyeong: 5,
    full: { min: 250_000, max: 450_000 },
    semiRate: 0.8,
    basicRate: 0.65,
    note: "짐 양이 적고 엘리베이터 작업이면 하단 가능",
  },
  {
    id: "ten",
    label: "10평 전후",
    minPyeong: 6,
    maxPyeong: 13,
    full: { min: 450_000, max: 750_000 },
    semiRate: 0.82,
    basicRate: 0.68,
    note: "투룸·소형 오피스텔 기준",
  },
  {
    id: "eighteen",
    label: "18평 전후",
    minPyeong: 14,
    maxPyeong: 21,
    full: { min: 750_000, max: 1_150_000 },
    semiRate: 0.85,
    basicRate: 0.7,
    note: "소형 아파트·신혼 가구 기준",
  },
  {
    id: "twenty-four",
    label: "24평 전후",
    minPyeong: 22,
    maxPyeong: 29,
    full: { min: 1_000_000, max: 1_500_000 },
    semiRate: 0.85,
    basicRate: 0.72,
    note: "2~4인 가구에서 가장 많이 찾는 구간",
  },
  {
    id: "thirty-four",
    label: "34평 전후",
    minPyeong: 30,
    maxPyeong: 39,
    full: { min: 1_500_000, max: 2_300_000 },
    semiRate: 0.88,
    basicRate: 0.75,
    note: "작업 인원·차량 톤수 증가 구간",
  },
  {
    id: "large",
    label: "40평 이상",
    minPyeong: 40,
    maxPyeong: 99,
    full: { min: 2_200_000, max: 3_500_000 },
    semiRate: 0.9,
    basicRate: 0.78,
    note: "방문 견적 권장",
  },
];

export const MCC_TYPE_OPTIONS = [
  { value: "full", label: "포장이사", description: "포장·운반·정리까지 맡기는 방식" },
  { value: "semi", label: "반포장이사", description: "큰 짐 중심, 잔짐 일부 직접 정리" },
  { value: "basic", label: "일반이사", description: "직접 포장하고 운반 중심으로 맡김" },
] as const;

export const MCC_LADDER_OPTIONS = [
  { value: "none", label: "없음", min: 0, max: 0 },
  { value: "from", label: "출발지만", min: 100_000, max: 200_000 },
  { value: "to", label: "도착지만", min: 100_000, max: 200_000 },
  { value: "both", label: "양쪽 모두", min: 200_000, max: 400_000 },
] as const;

export const MCC_FLOOR_OPTIONS = [
  { value: "1-5", label: "1~5층", ladderFactor: 0.85 },
  { value: "6-10", label: "6~10층", ladderFactor: 1 },
  { value: "11-15", label: "11~15층", ladderFactor: 1.15 },
  { value: "16+", label: "16층 이상", ladderFactor: 1.3 },
] as const;

export const MCC_VOLUME_OPTIONS = [
  { value: "low", label: "적음", factor: 0.9 },
  { value: "normal", label: "보통", factor: 1 },
  { value: "high", label: "많음", factor: 1.15 },
] as const;

export const MCC_REGION_OPTIONS = [
  { value: "metro", label: "수도권", minFactor: 1, maxFactor: 1 },
  { value: "city", label: "광역시", minFactor: 0.95, maxFactor: 1.05 },
  { value: "local", label: "지방", minFactor: 0.9, maxFactor: 1 },
] as const;

export const MCC_DISTANCE_PRESETS = [
  { value: 5, label: "근거리" },
  { value: 20, label: "같은 시·군" },
  { value: 50, label: "인접 시·군" },
  { value: 100, label: "장거리" },
] as const;

export const MCC_PYEONG_PRESETS = [
  { value: 5, label: "원룸" },
  { value: 10, label: "10평" },
  { value: 18, label: "18평" },
  { value: 24, label: "24평" },
  { value: 34, label: "34평" },
] as const;

export const MCC_CHECKLIST = [
  {
    id: "elevator",
    label: "엘리베이터 사용 예약",
    risk: "중간",
    description: "관리사무소 예약·보양 작업 여부를 확인하세요.",
  },
  {
    id: "ladder-space",
    label: "사다리차 진입 공간",
    risk: "높음",
    description: "도로 폭, 주차 공간, 전선 여부에 따라 작업 방식이 바뀔 수 있습니다.",
  },
  {
    id: "built-in",
    label: "붙박이장·시스템장 분해",
    risk: "중간",
    description: "분해·설치가 별도 비용으로 빠지는지 확인하세요.",
  },
  {
    id: "aircon",
    label: "에어컨 이전 설치",
    risk: "높음",
    description: "철거·배관·가스 충전은 별도 견적인 경우가 많습니다.",
  },
  {
    id: "heavy",
    label: "피아노·금고·대형 가전",
    risk: "높음",
    description: "특수 운반비가 붙을 수 있습니다.",
  },
  {
    id: "waste",
    label: "폐기물·입주청소",
    risk: "중간",
    description: "이사비 포함인지 별도 계약인지 구분하세요.",
  },
] as const;

export const MCC_RELATED_LINKS = [
  { href: "/tools/jeonwolse-conversion/", label: "전월세 전환 계산기", description: "보증금과 월세를 같은 기준으로 비교" },
  { href: "/tools/newlywed-rent-vs-buy/", label: "신혼집 전세 vs 매매 계산기", description: "입주 전 주거비 손익 비교" },
  { href: "/tools/single-household-living-cost-2026/", label: "1인가구 생활비 계산기", description: "독립 후 월 고정비 확인" },
];

export const MCC_META = {
  slug: "moving-cost-calculator",
  title: "포장이사 비용 계산기｜24평·34평 이사 견적 얼마가 적당할까?",
  description: "평수, 이동 거리, 사다리차, 손없는날, 포장 여부를 입력하면 포장이사 예상 견적 범위와 추가비 체크리스트를 추정합니다.",
  updatedAt: "2026-06-19",
  caution: "이 계산기는 참고용 추정 견적입니다. 실제 이사비용은 업체, 지역, 날짜, 짐 양, 작업 난이도에 따라 달라질 수 있습니다.",
};

export const MCC_DEFAULTS = {
  pyeong: 24,
  distanceKm: 20,
  type: "full" as MovingType,
  ladder: "both" as LadderOption,
  floor: "6-10" as FloorRange,
  peak: false,
  volume: "normal" as VolumeLevel,
  region: "metro" as RegionType,
};

export const MCC_FAQ = [
  {
    question: "24평 포장이사 비용은 보통 얼마인가요?",
    answer: "짐 양이 보통이고 같은 지역 이동이라면 대략 100만~150만원 수준을 기준으로 볼 수 있습니다. 사다리차 양쪽 사용, 손없는날, 장거리 이동이 겹치면 150만원 이상으로 올라갈 수 있습니다.",
  },
  {
    question: "34평 포장이사 견적은 어느 정도가 적당한가요?",
    answer: "34평은 작업 인원과 차량 톤수가 커져 24평보다 견적 상승 폭이 큽니다. 일반적으로 150만~230만원 범위를 참고하되, 짐이 많거나 특수 작업이 있으면 더 높아질 수 있습니다.",
  },
  {
    question: "손없는날 이사는 왜 더 비싼가요?",
    answer: "손없는날, 주말, 월말은 이사 수요가 몰리는 날짜라 작업팀과 차량 배정이 빠듯합니다. 같은 조건이라도 일반 평일보다 10~25% 높게 제시될 수 있습니다.",
  },
  {
    question: "사다리차 비용은 이사 견적에 포함되나요?",
    answer: "업체마다 다릅니다. 견적서에 사다리차가 포함인지, 출발지와 도착지 양쪽 모두 포함인지 반드시 확인해야 합니다.",
  },
  {
    question: "포장이사와 반포장이사는 얼마나 차이 나나요?",
    answer: "반포장이사는 잔짐 정리를 일부 직접 하는 대신 포장이사보다 대략 10~20% 낮게 제시되는 경우가 많습니다. 다만 짐 양과 업체 정책에 따라 차이가 줄어들 수 있습니다.",
  },
  {
    question: "이사비용을 줄이는 가장 현실적인 방법은 무엇인가요?",
    answer: "손없는날·주말·월말을 피하고, 잔짐과 폐기물을 미리 줄인 뒤, 사다리차·에어컨 이전 설치·폐기물 처리 포함 여부를 같은 기준으로 비교하는 것이 가장 현실적입니다.",
  },
];
