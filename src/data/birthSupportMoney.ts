export type BirthOrder = 1 | 2 | 3;
export type MultipleBirthType = "single" | "twins" | "triplets";
export type ChildcareType = "home" | "daycare";
export type CalculationPeriod = 12 | 24 | 95;
export type PolicyType = "national" | "local";
export type PaymentType = "cash" | "voucher" | "localCurrency";
export type AmountType = "once" | "monthly" | "yearly";
export type DataBadge = "공식" | "확인 필요" | "시뮬레이션" | "참고";

export interface BirthSupportPolicy {
  policyId: string;
  policyName: string;
  policyType: PolicyType;
  paymentType: PaymentType;
  amountType: AmountType;
  baseAmount: number;
  startMonth: number;
  endMonth?: number;
  sourceUrl: string;
  sourceName: string;
  lastCheckedAt: string;
  badge: DataBadge;
  note?: string;
}

export interface LocalBirthSupportRule {
  regionCode: string;
  sido: string;
  sigungu: string;
  birthOrder: BirthOrder;
  multipleBirthType?: MultipleBirthType;
  amount: number | null;
  paymentType: PaymentType;
  paymentSchedule: string;
  residenceMonthsRequired: number | null;
  applicationDeadlineDays: number | null;
  applicationChannel: string[];
  sourceUrl: string;
  sourceName: string;
  lastCheckedAt: string;
  badge: DataBadge;
  note?: string;
}

export const BSM_META = {
  slug: "birth-support-money",
  title: "출산지원금 총수령액 계산기",
  description:
    "출생일, 거주 지역, 출생순위를 입력하면 2026년 국가 공통 지원금과 일부 지자체 출산지원금을 합산해 예상 총수령액과 월별 수령 타임라인을 계산합니다.",
  updatedAt: "2026-05",
  caution:
    "계산 결과는 공개 제도 기준과 지자체 자료를 바탕으로 한 참고·추정치입니다. 실제 지급 여부와 신청 조건은 주소지 주민센터, 정부24, 복지로에서 최종 확인해야 합니다.",
};

export const BSM_NATIONAL_POLICIES: BirthSupportPolicy[] = [
  {
    policyId: "first-meeting-voucher-first",
    policyName: "첫만남이용권",
    policyType: "national",
    paymentType: "voucher",
    amountType: "once",
    baseAmount: 2000000,
    startMonth: 0,
    sourceUrl: "https://www.gov.kr/portal/service/serviceInfo/135200000129",
    sourceName: "정부24 첫만남이용권 안내",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
    note: "첫째아 기준 200만원, 둘째 이상은 300만원으로 계산합니다.",
  },
  {
    policyId: "parent-benefit-age-0",
    policyName: "부모급여",
    policyType: "national",
    paymentType: "cash",
    amountType: "monthly",
    baseAmount: 1000000,
    startMonth: 0,
    endMonth: 11,
    sourceUrl: "https://www.bokjiro.go.kr",
    sourceName: "복지로 부모급여 안내",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
    note: "어린이집 이용 시 실제 현금 수령 구조는 보육료 바우처와 연동될 수 있습니다.",
  },
  {
    policyId: "parent-benefit-age-1",
    policyName: "부모급여",
    policyType: "national",
    paymentType: "cash",
    amountType: "monthly",
    baseAmount: 500000,
    startMonth: 12,
    endMonth: 23,
    sourceUrl: "https://www.bokjiro.go.kr",
    sourceName: "복지로 부모급여 안내",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
  },
  {
    policyId: "child-allowance",
    policyName: "아동수당",
    policyType: "national",
    paymentType: "cash",
    amountType: "monthly",
    baseAmount: 100000,
    startMonth: 0,
    endMonth: 94,
    sourceUrl: "https://www.bokjiro.go.kr",
    sourceName: "복지로 아동수당 안내",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
    note: "95개월 계산은 장기 누적 참고용입니다.",
  },
];

export const BSM_LOCAL_RULES: LocalBirthSupportRule[] = [
  {
    regionCode: "seoul-gangnam",
    sido: "서울특별시",
    sigungu: "강남구",
    birthOrder: 1,
    amount: null,
    paymentType: "cash",
    paymentSchedule: "주소지 기준 별도 확인",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터", "구청"],
    sourceUrl: "https://www.gangnam.go.kr",
    sourceName: "강남구청",
    lastCheckedAt: "2026-05-05",
    badge: "확인 필요",
    note: "구 자체 출산장려금은 최신 공고 확인이 필요해 금액을 0원으로 반영합니다.",
  },
  {
    regionCode: "seoul-gangnam",
    sido: "서울특별시",
    sigungu: "강남구",
    birthOrder: 2,
    amount: null,
    paymentType: "cash",
    paymentSchedule: "주소지 기준 별도 확인",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터", "구청"],
    sourceUrl: "https://www.gangnam.go.kr",
    sourceName: "강남구청",
    lastCheckedAt: "2026-05-05",
    badge: "확인 필요",
    note: "둘째 이상 지원은 출생일과 거주요건을 확인해야 합니다.",
  },
  {
    regionCode: "seoul-gangdong",
    sido: "서울특별시",
    sigungu: "강동구",
    birthOrder: 1,
    amount: 2000000,
    paymentType: "voucher",
    paymentSchedule: "출생 초기 일시 지원",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터"],
    sourceUrl: "https://www.gangdong.go.kr",
    sourceName: "강동구청",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
    note: "공개 안내 기준 예시 금액입니다. 신청 전 구청 최신 안내를 확인하세요.",
  },
  {
    regionCode: "seoul-gangdong",
    sido: "서울특별시",
    sigungu: "강동구",
    birthOrder: 2,
    amount: 3000000,
    paymentType: "voucher",
    paymentSchedule: "출생 초기 일시 지원",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "주소지 주민센터"],
    sourceUrl: "https://www.gangdong.go.kr",
    sourceName: "강동구청",
    lastCheckedAt: "2026-05-05",
    badge: "공식",
    note: "둘째 이상 예시 금액입니다. 출생순위별 세부 조건은 최종 확인이 필요합니다.",
  },
  {
    regionCode: "gyeonggi-hwaseong",
    sido: "경기도",
    sigungu: "화성시",
    birthOrder: 1,
    amount: null,
    paymentType: "cash",
    paymentSchedule: "시 조례 및 공고 확인",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "읍면동 행정복지센터", "시청"],
    sourceUrl: "https://www.hscity.go.kr",
    sourceName: "화성시청",
    lastCheckedAt: "2026-05-05",
    badge: "확인 필요",
    note: "지자체 출산장려금은 최신 공고 확인 후 반영해야 합니다.",
  },
  {
    regionCode: "gyeonggi-paju",
    sido: "경기도",
    sigungu: "파주시",
    birthOrder: 1,
    amount: null,
    paymentType: "cash",
    paymentSchedule: "시 조례 및 공고 확인",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["정부24 행복출산 원스톱", "읍면동 행정복지센터", "시청"],
    sourceUrl: "https://www.paju.go.kr",
    sourceName: "파주시청",
    lastCheckedAt: "2026-05-05",
    badge: "확인 필요",
    note: "전입일, 출생일, 신청일 기준을 함께 확인해야 합니다.",
  },
  {
    regionCode: "local-example",
    sido: "지방",
    sigungu: "인구감소지역 예시",
    birthOrder: 1,
    amount: null,
    paymentType: "cash",
    paymentSchedule: "지자체별 상이",
    residenceMonthsRequired: null,
    applicationDeadlineDays: null,
    applicationChannel: ["주소지 주민센터", "지자체 홈페이지"],
    sourceUrl: "https://www.gov.kr",
    sourceName: "정부24",
    lastCheckedAt: "2026-05-05",
    badge: "참고",
    note: "인구감소지역은 별도 장려금이나 추가 수당 가능성이 있어 직접 확인해야 합니다.",
  },
];

export const BSM_REGION_OPTIONS = [
  { regionCode: "seoul-gangnam", sido: "서울특별시", sigungu: "강남구" },
  { regionCode: "seoul-gangdong", sido: "서울특별시", sigungu: "강동구" },
  { regionCode: "gyeonggi-hwaseong", sido: "경기도", sigungu: "화성시" },
  { regionCode: "gyeonggi-paju", sido: "경기도", sigungu: "파주시" },
  { regionCode: "local-example", sido: "지방", sigungu: "인구감소지역 예시" },
];

export const BSM_REFERENCE_LINKS = [
  {
    title: "정부24 행복출산 원스톱",
    source: "정부24",
    href: "https://www.gov.kr",
    desc: "출생신고와 주요 출산 지원 신청을 한 번에 확인하는 출발점입니다.",
  },
  {
    title: "복지로 부모급여·아동수당",
    source: "복지로",
    href: "https://www.bokjiro.go.kr",
    desc: "국가 공통 복지급여의 대상, 신청 방법, 최신 안내를 확인합니다.",
  },
  {
    title: "임신육아종합포털 아이사랑",
    source: "아이사랑",
    href: "https://www.childcare.go.kr",
    desc: "보육료, 어린이집 이용, 육아 지원 제도를 함께 확인합니다.",
  },
];

export const BSM_FAQ = [
  {
    question: "출산지원금 총수령액에는 무엇이 포함되나요?",
    answer:
      "이 계산기는 첫만남이용권, 부모급여, 아동수당, 선택한 지역의 입력된 지자체 출산지원금을 합산합니다. 금액이 확인되지 않은 지역 지원금은 0원으로 두고 확인 필요로 표시합니다.",
  },
  {
    question: "지자체 지원금이 0원으로 보이면 지원이 없다는 뜻인가요?",
    answer:
      "아닙니다. 공식 금액을 확정 입력하지 못한 지역은 계산에서 0원 처리하고 확인 필요로 구분합니다. 실제 신청 전에는 주소지 주민센터나 지자체 홈페이지를 확인해야 합니다.",
  },
  {
    question: "둘째 이상이면 어떤 항목이 달라지나요?",
    answer:
      "국가 공통 첫만남이용권은 둘째 이상을 300만원으로 계산합니다. 지자체 지원금도 출생순위별 차이가 있을 수 있어 지역별 조건을 함께 확인해야 합니다.",
  },
  {
    question: "어린이집을 이용하면 부모급여가 줄어드나요?",
    answer:
      "실제 수령 구조는 보육료 바우처와 연동될 수 있습니다. 이 계산기는 총 지원 규모를 보는 도구이므로 어린이집 이용 선택 시 결과 해석 안내를 함께 표시합니다.",
  },
  {
    question: "95개월 계산은 공식 총액인가요?",
    answer:
      "95개월 선택은 아동수당 장기 누적을 보는 참고 시뮬레이션입니다. 제도 변경 가능성이 커서 장기 구간은 공식 확정 총액처럼 보면 안 됩니다.",
  },
  {
    question: "어디에서 신청하나요?",
    answer:
      "정부24 행복출산 원스톱, 복지로, 주소지 주민센터, 지자체 홈페이지를 함께 확인하는 것이 안전합니다. 지자체 지원금은 거주요건과 신청기한이 특히 중요합니다.",
  },
];

export const BSM_RELATED_LINKS = [
  { href: "/reports/birth-support-by-region-2026/", label: "2026 지역별 출산지원금 비교" },
  { href: "/tools/postnatal-care-cost/", label: "산후도우미 비용 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
];
