export const PTX_META = {
  slug: "property-tax-payment-2026",
  title: "2026 재산세 납부 완전 가이드",
  description:
    "2026년 재산세 납부 일정, 계산 방법, 분납 기준, 절세 포인트를 한눈에 정리합니다.",
  seoTitle: "2026 재산세 납부 일정·계산 방법 | 7월·9월 기준 완전 가이드",
  seoDescription:
    "2026년 재산세 7월·9월 납부 일정, 공시가격별 예상 세액, 분납 기준 250만 원, 1세대1주택 감면까지 한눈에. 아파트 보유세 얼마 나오는지 미리 확인하세요.",
  updatedAt: "2026-06",
  dataNote:
    "이 리포트는 행정안전부 공개 자료와 지방세법 기준으로 작성한 참고 자료입니다. 실제 고지세액은 지자체 조례, 감면, 세부담상한에 따라 달라질 수 있습니다.",
};

export type PaymentSchedule = {
  month: string;
  period: string;
  target: string;
  note: string;
};

export const PTX_SCHEDULE: PaymentSchedule[] = [
  {
    month: "7월",
    period: "7월 16일 ~ 7월 31일",
    target: "주택 재산세 1기분 (세액의 1/2)",
    note: "건축물·선박·항공기도 7월 납부",
  },
  {
    month: "9월",
    period: "9월 16일 ~ 9월 30일",
    target: "주택 재산세 2기분 (세액의 1/2) + 토지",
    note: "20만 원 이하 소액은 7월에 전액 납부",
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
};

export const PTX_PAYMENT_METHODS: PaymentMethod[] = [
  {
    method: "위택스(WeTax)",
    channel: "www.wetax.go.kr",
    note: "PC·모바일 모두 가능. 카드·계좌이체",
  },
  {
    method: "스마트위택스 앱",
    channel: "모바일 앱",
    note: "간편인증 로그인 후 납부",
  },
  {
    method: "ARS 전화",
    channel: "1588-2460",
    note: "카드 납부 가능",
  },
  {
    method: "금융기관 CD/ATM",
    channel: "전국 은행 ATM",
    note: "고지서 지참 시 납부",
  },
  {
    method: "편의점",
    channel: "CU·GS25 등",
    note: "납부 고지서 바코드 스캔",
  },
];

export const PTX_FAQ = [
  {
    question: "재산세 납부 고지서는 언제 오나요?",
    answer:
      "7월 납부분은 6월 말~7월 초, 9월 납부분은 8월 말~9월 초에 우편 또는 전자 고지로 발송됩니다. 위택스에서도 조회 가능합니다.",
  },
  {
    question: "재산세 공시가격은 어디서 확인하나요?",
    answer:
      "국토교통부 부동산 공시가격 알리미(realtyprice.kr)에서 연도별 공동주택 공시가격을 조회할 수 있습니다. 매년 4월 말 확정 공시됩니다.",
  },
  {
    question: "20만 원 이하 소액은 어떻게 납부하나요?",
    answer:
      "주택 재산세 연간 합계가 20만 원 이하인 경우 7월에 전액 부과됩니다. 9월에 별도 고지서가 나오지 않습니다.",
  },
  {
    question: "분납 신청은 따로 해야 하나요?",
    answer:
      "별도 신청 없이 납부기한 내 일부만 납부하면 됩니다. 250만 원 초과분에 대해 2개월 이내 나머지를 내면 가산세 없이 분납 처리됩니다.",
  },
  {
    question: "종부세와 재산세는 어떻게 다른가요?",
    answer:
      "재산세는 모든 부동산 보유자에게 지방세로 부과됩니다. 종합부동산세(종부세)는 공시가격 합계가 1세대 1주택 기준 12억 원(다주택 9억 원)을 초과할 때 국세로 추가 부과됩니다. 12월에 납부합니다.",
  },
  {
    question: "재산세를 카드로 납부하면 포인트가 쌓이나요?",
    answer:
      "신용카드 납부 시 카드사 혜택에 따라 포인트 또는 캐시백이 적용됩니다. 단, 무이자 할부는 대부분 지방세 납부에 적용되지 않습니다. 납부 전 카드사 조건을 확인하세요.",
  },
];

export const PTX_RELATED_LINKS = [
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    desc: "재산세+종부세 실부담 즉시 계산",
  },
  {
    label: "2026 다주택자 세금 완전 분석",
    href: "/reports/multi-house-tax-2026/",
    desc: "취득세·종부세·양도세 총정리",
  },
];

export const PTX_SOURCE_LINKS = [
  { label: "행정안전부 지방세 안내", url: "https://www.mois.go.kr" },
  { label: "위택스 납부 포털", url: "https://www.wetax.go.kr" },
  { label: "부동산 공시가격 알리미", url: "https://www.realtyprice.kr" },
];
