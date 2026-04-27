export type PncRegion = "seoul" | "gyeonggi" | "incheon" | "busan" | "daegu" | "daejeon" | "gwangju" | "local";
export type PncBirthType = "single" | "twin" | "triplet_plus";
export type PncChildOrder = "first" | "second" | "third_plus";
export type PncIncomeType = "ga" | "tonghap" | "ra" | "unknown";
export type PncServicePeriod = "short" | "standard" | "extended";
export type PncCareTimeType = "day" | "night" | "live_in" | "full_time_24h";
export type PncSourceBadge = "공식" | "참고" | "추정";

export interface PostnatalCareRate {
  year: number;
  birthType: PncBirthType;
  childOrder: PncChildOrder;
  incomeType: PncIncomeType;
  servicePeriod: PncServicePeriod;
  serviceDays: number;
  totalPrice: number;
  governmentSubsidy: number;
  userPayment: number;
  sourceBadge: PncSourceBadge;
  sourceLabel: string;
}

export interface PostnatalCareOption {
  key: string;
  label: string;
  description: string;
}

export interface PostnatalCareExtraCost {
  careTimeType: PncCareTimeType;
  label: string;
  extraCost: number;
  sourceBadge: PncSourceBadge;
  note: string;
}

export interface PostnatalCareDefaultInput {
  region: PncRegion;
  birthType: PncBirthType;
  childOrder: PncChildOrder;
  incomeType: PncIncomeType;
  servicePeriod: PncServicePeriod;
  useVoucher: boolean;
  careTimeType: PncCareTimeType;
  localSubsidy: number;
  privateExtraCost: number;
}

export const POSTNATAL_CARE_DEFAULT_INPUT: PostnatalCareDefaultInput = {
  region: "seoul",
  birthType: "single",
  childOrder: "first",
  incomeType: "tonghap",
  servicePeriod: "standard",
  useVoucher: true,
  careTimeType: "day",
  localSubsidy: 0,
  privateExtraCost: 0,
};

export const POSTNATAL_REGION_OPTIONS: PostnatalCareOption[] = [
  { key: "seoul", label: "서울", description: "서울 거주 기준. 지자체 추가 지원은 별도 확인 필요" },
  { key: "gyeonggi", label: "경기", description: "시군별 추가 지원금 차이가 큰 지역" },
  { key: "incheon", label: "인천", description: "구별 추가 지원 여부 확인 필요" },
  { key: "busan", label: "부산", description: "광역시 기준 참고" },
  { key: "daegu", label: "대구", description: "광역시 기준 참고" },
  { key: "daejeon", label: "대전", description: "공개표 확인이 비교적 쉬운 지역" },
  { key: "gwangju", label: "광주", description: "광역시 기준 참고" },
  { key: "local", label: "그 외 지역", description: "보건소 기준 직접 확인 권장" },
];

export const POSTNATAL_BIRTH_TYPE_OPTIONS: PostnatalCareOption[] = [
  { key: "single", label: "단태아", description: "아이 1명 출산 기준" },
  { key: "twin", label: "쌍태아", description: "쌍둥이 출산 기준" },
  { key: "triplet_plus", label: "삼태아 이상", description: "세쌍둥이 이상 또는 중증+쌍태아 이상 기준" },
];

export const POSTNATAL_CHILD_ORDER_OPTIONS: PostnatalCareOption[] = [
  { key: "first", label: "첫째아", description: "첫 출산 기준" },
  { key: "second", label: "둘째아", description: "둘째 출산 기준" },
  { key: "third_plus", label: "셋째아 이상", description: "셋째 이상 출산 기준" },
];

export const POSTNATAL_INCOME_OPTIONS: PostnatalCareOption[] = [
  { key: "ga", label: "자격확인", description: "기초생활수급자·차상위 등 자격확인 유형" },
  { key: "tonghap", label: "150% 이하", description: "기준중위소득 150% 이하 통합 유형" },
  { key: "ra", label: "150% 초과·예외지원", description: "예외지원 대상 또는 150% 초과 유형" },
  { key: "unknown", label: "잘 모르겠음", description: "우선 150% 이하 기준으로 임시 계산" },
];

export const POSTNATAL_SERVICE_PERIOD_OPTIONS: PostnatalCareOption[] = [
  { key: "short", label: "단축", description: "단태아 첫째아 기준 5일" },
  { key: "standard", label: "표준", description: "단태아 첫째아 기준 10일" },
  { key: "extended", label: "연장", description: "단태아 첫째아 기준 15일" },
];

export const POSTNATAL_CARE_TIME_OPTIONS: PostnatalCareExtraCost[] = [
  {
    careTimeType: "day",
    label: "주간형",
    extraCost: 0,
    sourceBadge: "추정",
    note: "정부지원 방문형 기본 시간대 기준",
  },
  {
    careTimeType: "night",
    label: "야간형",
    extraCost: 150000,
    sourceBadge: "추정",
    note: "야간 연장 또는 별도 야간 돌봄을 가정한 편집부 추정값",
  },
  {
    careTimeType: "live_in",
    label: "입주형",
    extraCost: 300000,
    sourceBadge: "추정",
    note: "입주형 또는 고강도 돌봄 옵션을 가정한 편집부 추정값",
  },
  {
    careTimeType: "full_time_24h",
    label: "24시간형",
    extraCost: 500000,
    sourceBadge: "추정",
    note: "24시간 돌봄 또는 프리미엄 관리사를 가정한 편집부 추정값",
  },
];

export const POSTNATAL_CARE_RATES_2026: PostnatalCareRate[] = [
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ga",
    servicePeriod: "short",
    serviceDays: 5,
    totalPrice: 732000,
    governmentSubsidy: 659000,
    userPayment: 73000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ga",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 1165000,
    userPayment: 299000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ga",
    servicePeriod: "extended",
    serviceDays: 15,
    totalPrice: 2196000,
    governmentSubsidy: 1525000,
    userPayment: 671000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "tonghap",
    servicePeriod: "short",
    serviceDays: 5,
    totalPrice: 732000,
    governmentSubsidy: 569000,
    userPayment: 163000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "tonghap",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 1002000,
    userPayment: 462000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "tonghap",
    servicePeriod: "extended",
    serviceDays: 15,
    totalPrice: 2196000,
    governmentSubsidy: 1303000,
    userPayment: 893000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ra",
    servicePeriod: "short",
    serviceDays: 5,
    totalPrice: 732000,
    governmentSubsidy: 456000,
    userPayment: 276000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ra",
    servicePeriod: "standard",
    serviceDays: 10,
    totalPrice: 1464000,
    governmentSubsidy: 764000,
    userPayment: 700000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
  {
    year: 2026,
    birthType: "single",
    childOrder: "first",
    incomeType: "ra",
    servicePeriod: "extended",
    serviceDays: 15,
    totalPrice: 2196000,
    governmentSubsidy: 1035000,
    userPayment: 1161000,
    sourceBadge: "공식",
    sourceLabel: "2026년 산모·신생아 건강관리 지원사업 공개표",
  },
];

export const POSTNATAL_COST_FAQ = [
  {
    question: "산후도우미 비용은 평균 얼마인가요?",
    answer:
      "정부지원 산모·신생아 건강관리 서비스는 태아 유형, 출산 순위, 소득 구간, 이용 기간에 따라 달라집니다. 2026년 단태아 첫째아 표준형 10일 기준 총 서비스 가격은 146만 4천원으로 공개되어 있으며, 정부지원금 차감 후 본인부담금은 소득 구간에 따라 달라집니다.",
  },
  {
    question: "정부지원 바우처를 받으면 실제로 얼마를 내나요?",
    answer:
      "총 서비스 가격에서 정부지원금을 뺀 금액이 기본 본인부담금입니다. 여기에 지자체 추가 지원금, 야간·입주형 추가금, 제공기관 추가 비용이 반영되면 최종 결제 금액이 달라질 수 있습니다.",
  },
  {
    question: "기준중위소득 150%를 넘으면 지원을 못 받나요?",
    answer:
      "기본 지원은 기준중위소득 150% 이하가 중심이지만, 둘째아 이상, 다태아, 미숙아, 희귀난치성질환 산모, 장애 산모 등은 예외 지원 대상이 될 수 있습니다. 거주지 보건소 기준을 반드시 확인해야 합니다.",
  },
  {
    question: "산후도우미 신청은 언제 해야 하나요?",
    answer:
      "지자체 안내 기준으로 보통 출산 예정일 40일 전부터 출산 후 60일 이내 신청할 수 있습니다. 미숙아 또는 선천성 이상아 입원 등 특수한 경우는 퇴원일 기준으로 별도 기한이 적용될 수 있습니다.",
  },
  {
    question: "산후조리원과 산후도우미 중 어느 쪽이 저렴한가요?",
    answer:
      "비용만 보면 정부지원 바우처를 적용한 산후도우미가 더 낮을 가능성이 큽니다. 다만 산후조리원은 숙박, 식사, 신생아실, 산모 회복 프로그램이 포함되므로 회복 환경과 가족 지원 여부까지 함께 비교해야 합니다.",
  },
  {
    question: "야간형이나 입주형도 정부지원 기준에 포함되나요?",
    answer:
      "정부지원 표준 서비스와 민간 추가 옵션은 구분해서 봐야 합니다. 야간형, 입주형, 주말 이용, 프리미엄 관리사 비용은 제공기관별로 달라질 수 있어 계산기에서는 추정값 또는 직접 입력값으로 처리합니다.",
  },
];

export const POSTNATAL_RELATED_LINKS = [
  { href: "/reports/postpartum-center-cost-2026/", label: "산후조리원 2주 비용과 비교하기" },
  { href: "/tools/pregnancy-birth-cost/", label: "임신·출산 전후 총비용 계산하기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아 첫해 육아비용 확인하기" },
  { href: "/reports/fetal-insurance-guide-2026/", label: "출산 전 보험 체크하기" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아기 근무·소득 흐름 계산하기" },
];

export const POSTNATAL_REFERENCE_CARDS = [
  {
    href: "https://www.songpa.go.kr/ehealth/contents.do?key=4569",
    source: "송파구 보건소",
    title: "2026년 산모·신생아 건강관리 지원사업 공개표",
    desc: "태아 유형, 출산 순위, 소득 구간별 서비스 가격과 정부지원금을 확인할 수 있습니다.",
  },
  {
    href: "https://www.guro.go.kr/health/contents.do?key=1329",
    source: "구로구 보건소",
    title: "2026년 바우처 지원 금액",
    desc: "2026년 서비스 개시일 기준 가격, 정부지원금, 본인부담금 표를 제공합니다.",
  },
  {
    href: "https://www.changwon.go.kr/cwportal/13763.web",
    source: "창원시",
    title: "신청 기간과 바우처 유효기간",
    desc: "출산 예정일 40일 전부터 출산 후 60일 이내 신청, 출산일로부터 90일 유효기간을 안내합니다.",
  },
];
