export const PTX_META = {
  slug: "property-tax-payment-2026",
  title: "2026 재산세 납부기간 총정리",
  description:
    "아파트·주택·토지·건축물별 2026년 재산세 납부기간과 6월 1일 과세기준일을 정리합니다.",
  seoTitle: "2026 재산세 납부기간 총정리 | 아파트·주택·토지 언제 내야 할까?",
  seoDescription:
    "2026년 재산세 납부기간을 아파트·주택·토지·건축물별로 정리했습니다. 7월·9월 납부 일정, 6월 1일 과세기준일, 분납 기준과 위택스 납부방법까지 확인하세요.",
  updatedAt: "2026-07-02",
  dataNote:
    "이 리포트는 행정안전부 지방세 안내, 위택스, 지방세법상 재산세 납부 구조를 바탕으로 정리한 참고 자료입니다. 실제 고지세액과 납부 가능 방식은 지자체 고지서와 위택스 조회 결과가 우선합니다.",
};

export type PaymentSchedule = {
  id: "july" | "september";
  month: string;
  period: string;
  weekday: string;
  target: string;
  note: string;
  highlight: string;
};

export const PTX_SCHEDULE: PaymentSchedule[] = [
  {
    id: "july",
    month: "7월",
    period: "2026년 7월 16일 ~ 7월 31일",
    weekday: "목요일 ~ 금요일",
    target: "주택 1기분, 건축물, 선박, 항공기",
    note: "주택분 재산세의 절반과 건축물분 재산세가 고지됩니다.",
    highlight: "7월 31일 금요일까지",
  },
  {
    id: "september",
    month: "9월",
    period: "2026년 9월 16일 ~ 9월 30일",
    weekday: "수요일 ~ 수요일",
    target: "주택 2기분, 토지",
    note: "주택분 나머지 절반과 토지분 재산세가 고지됩니다.",
    highlight: "9월 30일 수요일까지",
  },
];

export type OverviewItem = {
  label: string;
  value: string;
  note: string;
};

export const PTX_OVERVIEW: OverviewItem[] = [
  {
    label: "과세기준일",
    value: "6월 1일",
    note: "이날 현재 소유자가 해당 연도 재산세 납세의무자가 됩니다.",
  },
  {
    label: "7월 납부",
    value: "7월 16일~31일",
    note: "주택 1기분, 건축물, 선박, 항공기 재산세를 확인합니다.",
  },
  {
    label: "9월 납부",
    value: "9월 16일~30일",
    note: "주택 2기분과 토지분 재산세를 확인합니다.",
  },
];

export type AssetScheduleRow = {
  assetType: string;
  july: string;
  september: string;
  summary: string;
  badge?: string;
};

export const PTX_ASSET_SCHEDULE: AssetScheduleRow[] = [
  {
    assetType: "아파트·주택",
    july: "1기분",
    september: "2기분",
    summary: "주택분 재산세는 7월과 9월에 나누어 고지됩니다.",
    badge: "가장 많음",
  },
  {
    assetType: "토지",
    july: "-",
    september: "납부",
    summary: "토지분 재산세는 9월에 납부합니다.",
  },
  {
    assetType: "건축물",
    july: "납부",
    september: "-",
    summary: "상가·일반 건축물분은 7월 납부 대상입니다.",
  },
  {
    assetType: "선박·항공기",
    july: "납부",
    september: "-",
    summary: "해당 자산 보유자에게만 부과됩니다.",
  },
];

export type OwnershipCase = {
  title: string;
  dateLabel: string;
  payer: string;
  explanation: string;
  caution?: string;
};

export const PTX_OWNERSHIP_CASES: OwnershipCase[] = [
  {
    title: "5월 31일 잔금·등기 완료",
    dateLabel: "6월 1일 전",
    payer: "새 소유자 부담 가능성 높음",
    explanation: "6월 1일 현재 소유자가 새 매수자라면 해당 연도 재산세 납세의무자가 됩니다.",
  },
  {
    title: "6월 1일 현재 보유",
    dateLabel: "과세기준일",
    payer: "그날 소유자가 납세의무자",
    explanation: "재산세는 매년 6월 1일 현재 소유자를 기준으로 부과됩니다.",
  },
  {
    title: "6월 2일 매수",
    dateLabel: "6월 1일 후",
    payer: "기존 소유자 부담 가능성 높음",
    explanation: "매수일이 6월 1일 이후라면 법정 납세의무는 기존 소유자에게 남을 수 있습니다.",
    caution: "단, 거래 당사자 간 정산 특약은 별도로 확인해야 합니다.",
  },
];

export type TaxRateRow = {
  range: string;
  rate: string;
  deduction: string;
  example: string;
};

export const PTX_RATES: TaxRateRow[] = [
  {
    range: "6천만 원 이하",
    rate: "0.1%",
    deduction: "-",
    example: "공시가 6천만 → 재산세 6만 원",
  },
  {
    range: "6천만 원 초과 ~ 1.5억 이하",
    rate: "0.15%",
    deduction: "3만 원",
    example: "공시가 1억 → 재산세 12만 원",
  },
  {
    range: "1.5억 초과 ~ 3억 이하",
    rate: "0.25%",
    deduction: "18만 원",
    example: "공시가 2억 → 재산세 32만 원",
  },
  {
    range: "3억 초과",
    rate: "0.4%",
    deduction: "63만 원",
    example: "공시가 5억 → 재산세 137만 원",
  },
];

export type ExampleCase = {
  label: string;
  officialPrice: string;
  taxBase: string;
  propertyTax: string;
  localEducation: string;
  total: string;
  highlight: boolean;
};

export const PTX_EXAMPLES: ExampleCase[] = [
  {
    label: "공시가 3억",
    officialPrice: "3억 원",
    taxBase: "2.1억 원 (공정시장가액비율 70%)",
    propertyTax: "약 34만 원",
    localEducation: "약 6.8만 원",
    total: "약 41만 원",
    highlight: false,
  },
  {
    label: "공시가 6억",
    officialPrice: "6억 원",
    taxBase: "4.2억 원",
    propertyTax: "약 105만 원",
    localEducation: "약 21만 원",
    total: "약 126만 원",
    highlight: true,
  },
  {
    label: "공시가 9억",
    officialPrice: "9억 원",
    taxBase: "6.3억 원",
    propertyTax: "약 189만 원",
    localEducation: "약 37.8만 원",
    total: "약 227만 원",
    highlight: false,
  },
  {
    label: "공시가 12억",
    officialPrice: "12억 원",
    taxBase: "8.4억 원",
    propertyTax: "약 273만 원",
    localEducation: "약 54.6만 원",
    total: "약 328만 원",
    highlight: false,
  },
];

export type ReductionItem = {
  title: string;
  condition: string;
  effect: string;
  badge: string;
};

export const PTX_REDUCTIONS: ReductionItem[] = [
  {
    title: "1세대 1주택 특례세율",
    condition: "1세대 1주택자",
    effect: "과세표준 구간별 0.05%p 인하 (0.05%~0.35%)",
    badge: "필수 확인",
  },
  {
    title: "고령자 세액공제",
    condition: "만 60세 이상 1세대 1주택자",
    effect: "세액의 10~30% 공제 (연령별 차등)",
    badge: "해당 시",
  },
  {
    title: "장기보유 세액공제",
    condition: "5년 이상 보유 1세대 1주택자",
    effect: "세액의 20~50% 공제 (보유기간별 차등)",
    badge: "해당 시",
  },
  {
    title: "세부담 상한",
    condition: "전년도 대비 세액 급증 시",
    effect: "전년 재산세의 105%~130% 한도로 제한",
    badge: "자동 적용",
  },
];

export type InstallmentInfo = {
  threshold: string;
  rule: string;
  deadline: string;
};

export const PTX_INSTALLMENT: InstallmentInfo = {
  threshold: "납부세액 250만 원 초과",
  rule: "초과분을 납부기한 후 2개월 내 분납 가능",
  deadline: "7월 납부분: 9월 30일까지 / 9월 납부분: 11월 30일까지",
};

export type PaymentMethod = {
  method: string;
  channel: string;
  note: string;
  priority: "primary" | "secondary";
  url?: string;
};

export const PTX_PAYMENT_METHODS: PaymentMethod[] = [
  {
    method: "위택스(WeTax)",
    channel: "www.wetax.go.kr",
    note: "PC·모바일 모두 가능. 카드·계좌이체",
    priority: "primary",
    url: "https://www.wetax.go.kr",
  },
  {
    method: "스마트위택스 앱",
    channel: "모바일 앱",
    note: "간편인증 로그인 후 납부",
    priority: "primary",
  },
  {
    method: "ARS 전화",
    channel: "1588-2460",
    note: "카드 납부 가능",
    priority: "secondary",
  },
  {
    method: "금융기관 CD/ATM",
    channel: "전국 은행 ATM",
    note: "고지서 지참 시 납부",
    priority: "secondary",
  },
  {
    method: "편의점",
    channel: "CU·GS25 등",
    note: "납부 고지서 바코드 스캔",
    priority: "secondary",
  },
];

export type LatePaymentNote = {
  title: string;
  body: string;
};

export const PTX_LATE_PAYMENT_NOTES: LatePaymentNote[] = [
  {
    title: "기한 말일 전에 미리 납부",
    body: "납부 마지막 날에는 위택스 접속이 몰릴 수 있으므로 가능하면 1~2일 전에 확인하는 편이 안전합니다.",
  },
  {
    title: "전자고지·자동이체 확인",
    body: "전자고지를 신청했다면 우편 고지서가 오지 않을 수 있습니다. 위택스 또는 지자체 앱에서 고지 내역을 확인하세요.",
  },
  {
    title: "지연 부담 가능성",
    body: "납부기한을 넘기면 납부지연 부담이 생길 수 있습니다. 실제 가산 여부와 금액은 고지서와 지자체 안내를 기준으로 확인해야 합니다.",
  },
];

export const PTX_FAQ = [
  {
    question: "2026년 재산세 납부기간은 언제인가요?",
    answer:
      "2026년 재산세는 7월 16일부터 7월 31일까지, 9월 16일부터 9월 30일까지 납부합니다. 주택은 보통 7월과 9월에 나누어 고지되고, 토지는 9월, 건축물은 7월 납부 대상입니다.",
  },
  {
    question: "아파트 재산세는 7월에 내나요, 9월에 내나요?",
    answer:
      "아파트와 주택 재산세는 원칙적으로 7월 1기분과 9월 2기분으로 나누어 납부합니다. 다만 주택분 세액이 소액이면 7월에 한 번에 고지될 수 있으므로 실제 고지서는 위택스나 지자체 안내를 확인해야 합니다.",
  },
  {
    question: "토지 재산세 납부기간은 언제인가요?",
    answer:
      "토지분 재산세는 9월 납부 대상입니다. 2026년에는 9월 16일부터 9월 30일까지가 납부기간입니다.",
  },
  {
    question: "건축물 재산세는 언제 내나요?",
    answer:
      "건축물분 재산세는 7월 납부 대상입니다. 상가, 일반 건축물 등은 주택분과 구분되어 고지될 수 있습니다.",
  },
  {
    question: "재산세는 누가 내나요?",
    answer:
      "재산세는 매년 6월 1일 현재 소유자를 기준으로 부과됩니다. 6월 1일 전후로 부동산을 사고팔았다면 잔금일, 등기일, 계약상 정산 특약을 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "재산세 고지서를 못 받으면 어떻게 하나요?",
    answer:
      "우편 고지서를 받지 못했더라도 위택스나 스마트위택스에서 조회할 수 있습니다. 전자고지를 신청했다면 우편 고지서가 오지 않을 수 있으므로 온라인 고지 내역을 먼저 확인하세요.",
  },
  {
    question: "재산세를 카드로 납부할 수 있나요?",
    answer:
      "위택스와 금융기관 납부 채널을 통해 카드 납부가 가능합니다. 카드사별 혜택, 무이자 할부, 납부 수수료 여부는 시점마다 다를 수 있어 납부 전 카드사 조건을 확인해야 합니다.",
  },
  {
    question: "재산세 분납은 언제 가능한가요?",
    answer:
      "고액 고지서의 경우 일정 기준을 넘으면 분납이 가능할 수 있습니다. 분납 가능 금액과 절차는 실제 고지서와 위택스 안내가 우선이므로, 납부기한 전에 조회해 확인하는 것이 안전합니다.",
  },
  {
    question: "재산세와 종합부동산세는 같은 세금인가요?",
    answer:
      "재산세는 지방세로 부동산 보유자에게 부과되고, 종합부동산세는 일정 공시가격 기준을 넘는 경우 별도로 부과되는 국세입니다. 납부 시기도 달라 재산세는 7월·9월, 종부세는 보통 12월에 확인합니다.",
  },
];

export const PTX_RELATED_LINKS = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "공시가격으로 재산세와 종부세를 추정합니다.",
  },
  {
    label: "부동산 취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    desc: "집을 살 때 내는 취득세를 함께 확인합니다.",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·보유세·양도세 구조를 함께 정리합니다.",
  },
  {
    label: "서울 구별 아파트 집값 순위 2026",
    href: "/reports/seoul-district-apartment-price-ranking-2026/",
    desc: "보유세 부담과 함께 볼 서울 아파트 가격 리포트입니다.",
  },
];

export const PTX_SOURCE_LINKS = [
  { label: "행정안전부 지방세 안내", url: "https://www.mois.go.kr" },
  { label: "위택스 납부 포털", url: "https://www.wetax.go.kr" },
  { label: "부동산 공시가격 알리미", url: "https://www.realtyprice.kr" },
];
