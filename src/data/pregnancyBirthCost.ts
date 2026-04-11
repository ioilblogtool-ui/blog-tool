export type DeliveryType = "vaginal" | "c_section";
export type HospitalTier = "clinic" | "general" | "tertiary";
export type PostpartumCareType = "center" | "helper" | "home";
export type PostpartumRegion = "seoul" | "gyeonggi" | "local";
export type PostpartumRoomType = "standard" | "suite" | "premium";

export interface PregnancyBirthCostInput {
  gestationalWeeks: number;
  deliveryType: DeliveryType;
  hospitalTier: HospitalTier;
  fetusCount: number;
  epidural: boolean;
  postpartumCareType: PostpartumCareType;
  postpartumRegion: PostpartumRegion;
  postpartumRoomType: PostpartumRoomType;
  underservedArea: boolean;
  birthOrder: "first" | "second_or_more";
  voucherEnabled: boolean;
  voucherUsedAmount: number;
}

export interface CostOption {
  key: string;
  label: string;
  description: string;
}

export const PREGNANCY_BIRTH_COST_DEFAULT_INPUT: PregnancyBirthCostInput = {
  gestationalWeeks: 38,
  deliveryType: "vaginal",
  hospitalTier: "general",
  fetusCount: 1,
  epidural: true,
  postpartumCareType: "center",
  postpartumRegion: "gyeonggi",
  postpartumRoomType: "standard",
  underservedArea: false,
  birthOrder: "first",
  voucherEnabled: true,
  voucherUsedAmount: 200000,
};

export const PREGNANCY_DELIVERY_OPTIONS: CostOption[] = [
  { key: "vaginal", label: "자연분만", description: "입원일수와 처치비가 상대적으로 낮은 편" },
  { key: "c_section", label: "제왕절개", description: "수술비·입원비 비중이 더 커지는 구조" },
];

export const PREGNANCY_HOSPITAL_OPTIONS: CostOption[] = [
  { key: "clinic", label: "동네 산부인과", description: "비용은 낮은 편, 고위험 대응 범위는 제한적일 수 있음" },
  { key: "general", label: "종합병원", description: "일반적인 비교 기준으로 보기 좋은 구간" },
  { key: "tertiary", label: "상급종합병원", description: "고위험 임신 대응력은 높지만 비용도 높아질 수 있음" },
];

export const PREGNANCY_POSTPARTUM_OPTIONS: CostOption[] = [
  { key: "center", label: "산후조리원", description: "2주 이용료 중심으로 별도 합산" },
  { key: "helper", label: "산후도우미", description: "재가 돌봄형, 조리원보다 비용이 낮은 편" },
  { key: "home", label: "집조리", description: "가족 도움 중심의 최소 비용 시나리오" },
];

export const PREGNANCY_POSTPARTUM_ROOM_OPTIONS: CostOption[] = [
  { key: "standard", label: "일반실", description: "가장 많이 비교하는 기준" },
  { key: "suite", label: "특실", description: "공간과 부가 서비스가 추가되는 구간" },
  { key: "premium", label: "프리미엄", description: "상위 서비스 패키지 기준" },
];

export const PREGNANCY_FAQ = [
  {
    question: "출산 비용은 보통 얼마 드나요?",
    answer:
      "병원 등급, 분만 방식, 다태아 여부, 조리 방식에 따라 차이가 큽니다. 이 계산기는 의료비와 조리비를 분리해서, 지원금 차감 전후를 함께 보도록 설계했습니다.",
  },
  {
    question: "자연분만과 제왕절개 차이는 얼마나 나나요?",
    answer:
      "보통 제왕절개는 분만비와 입원비 비중이 커집니다. 특히 종합병원 이상에서는 수술·처치비 차이까지 더해져 격차가 더 벌어질 수 있습니다.",
  },
  {
    question: "국민행복카드로 산후조리원 비용도 차감되나요?",
    answer:
      "이 계산기에서는 산후조리원 기본 이용료를 임신·출산 진료비 지원 차감 대상에서 제외합니다. 의료비와 조리비를 분리해서 보는 이유도 여기에 있습니다.",
  },
  {
    question: "다태아는 지원금이 더 늘어나나요?",
    answer:
      "네. 문서 기준으로 단태아 100만원, 다태아 140만원 기본 지급에 태아당 100만원이 되도록 추가 지원을 반영합니다. 분만취약지는 20만원을 더합니다.",
  },
];

export const PREGNANCY_TIPS = [
  "고위험 임신이 아니라면 병원 등급 차이부터 먼저 확인해도 총액 차이가 크게 납니다.",
  "산후조리원은 의료 바우처 자동 차감 대상으로 보지 않는 편이 예산 계획에 안전합니다.",
  "이미 사용한 바우처가 있다면 잔액을 직접 반영해 실제 부담액에 더 가깝게 맞출 수 있습니다.",
  "쌍둥이 이상은 검사비와 입원비가 함께 늘 수 있으므로 의료비와 조리비를 따로 봐야 합니다.",
];

export const PREGNANCY_RELATED_LINKS = [
  { href: "/reports/postpartum-center-cost-2026/", label: "2026 산후조리원 비용 완전 비교" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아~돌까지 육아비용 가이드" },
];

export const PREGNANCY_AFFILIATE_PRODUCTS = [
  {
    tag: "산전 필수",
    title: "임산부 엽산·철분제 세트",
    desc: "임신 초기부터 출산까지 챙기는 대표 영양제 패키지",
    url: "https://www.coupang.com/np/search?q=%EC%9E%84%EC%82%B0%EB%B6%80+%EC%97%BD%EC%82%B0+%EC%B2%A0%EB%B6%84",
  },
  {
    tag: "산전 준비",
    title: "임산부 복대·골반벨트",
    desc: "허리·골반 부담 줄이는 임산부 전용 보정 용품",
    url: "https://www.coupang.com/np/search?q=%EC%9E%84%EC%82%B0%EB%B6%80+%EB%B3%B5%EB%8C%80+%EA%B3%A8%EB%B0%98%EB%B2%A8%ED%8A%B8",
  },
  {
    tag: "산후 회복",
    title: "산모 패드·오로패드",
    desc: "출산 후 회복 기간에 사용하는 산모 전용 위생 용품",
    url: "https://www.coupang.com/np/search?q=%EC%82%B0%EB%AA%A8%ED%8C%A8%EB%93%9C+%EC%98%A4%EB%A1%9C%ED%8C%A8%EB%93%9C",
  },
  {
    tag: "모유수유",
    title: "유축기·수유패드 세트",
    desc: "병원 퇴원 전 준비하면 좋은 모유수유 기본 세트",
    url: "https://www.coupang.com/np/search?q=%EC%9C%A0%EC%B6%95%EA%B8%B0+%EC%88%98%EC%9C%A0%ED%8C%A8%EB%93%9C",
  },
];

export const PREGNANCY_SOURCE_LINKS = [
  {
    label: "보건복지부 임신·출산 진료비 지원사업",
    href: "https://www.mohw.go.kr/menu.es?mid=a10705020100",
  },
  {
    label: "보건복지부 국민행복카드 안내",
    href: "https://www.mohw.go.kr/board.es?act=view&bid=0027&list_no=1488450&mid=a10503010100&nPage=1&tag=",
  },
  {
    label: "첫만남이용권 안내",
    href: "https://www.voucher.go.kr/voucher/firstEncounter.do",
  },
];
