export const GTC_META = {
  slug: "gift-tax-calculator",
  title: "증여세 계산기",
  seoTitle: "증여세 계산기 — 자녀·배우자·부모 증여 한도·세금 자동 계산",
  description:
    "배우자·자녀·부모·기타 친족 증여 시 공제 한도, 과세표준, 세율, 신고세액공제까지 한 번에 계산합니다.",
  updatedAt: "2026-06",
  caution:
    "이 계산기는 일반적인 증여세 추정용입니다. 공익법인 증여, 창업자금, 영농증여, 가업승계 등 특례는 반영되지 않습니다. 신고·납부 전 반드시 세무 전문가에게 확인하세요.",
};

export const GTC_DEFAULTS = {
  giftAmount: 100_000_000,
  priorGiftAmount: 0,
  relation: "child_adult",
};

export const GTC_RELATIONS = [
  { value: "spouse", label: "배우자", deduction: 600_000_000, note: "10년간 6억 공제" },
  { value: "child_adult", label: "성인 자녀 (만 19세 이상)", deduction: 50_000_000, note: "10년간 5,000만 공제" },
  { value: "child_minor", label: "미성년 자녀 (만 19세 미만)", deduction: 20_000_000, note: "10년간 2,000만 공제" },
  { value: "parent", label: "부모 → 자녀 외 직계비속", deduction: 50_000_000, note: "10년간 5,000만 공제" },
  { value: "ascendant", label: "자녀 → 부모 (직계존속)", deduction: 50_000_000, note: "10년간 5,000만 공제" },
  { value: "other_kin", label: "기타 친족 (형제·사촌 등)", deduction: 10_000_000, note: "10년간 1,000만 공제" },
  { value: "none", label: "타인 (특수관계 없음)", deduction: 0, note: "공제 없음" },
];

export const GTC_TAX_BRACKETS = [
  { limit: 100_000_000, rate: 0.1, deduction: 0, label: "1억 이하" },
  { limit: 500_000_000, rate: 0.2, deduction: 10_000_000, label: "1억 초과 ~ 5억 이하" },
  { limit: 1_000_000_000, rate: 0.3, deduction: 60_000_000, label: "5억 초과 ~ 10억 이하" },
  { limit: 3_000_000_000, rate: 0.4, deduction: 160_000_000, label: "10억 초과 ~ 30억 이하" },
  { limit: Infinity, rate: 0.5, deduction: 460_000_000, label: "30억 초과" },
];

export const GTC_QUICK_AMOUNTS = [
  { label: "2,000만", value: 20_000_000 },
  { label: "5,000만", value: 50_000_000 },
  { label: "1억", value: 100_000_000 },
  { label: "3억", value: 300_000_000 },
  { label: "5억", value: 500_000_000 },
  { label: "10억", value: 1_000_000_000 },
];

export const GTC_SIMULATION_CASES = [
  {
    label: "성인 자녀 5,000만 증여",
    relation: "성인 자녀",
    giftAmount: 50_000_000,
    priorGift: 0,
    deduction: 50_000_000,
    taxBase: 0,
    tax: 0,
    totalNote: "비과세 — 공제 한도 이내",
  },
  {
    label: "성인 자녀 1억 증여",
    relation: "성인 자녀",
    giftAmount: 100_000_000,
    priorGift: 0,
    deduction: 50_000_000,
    taxBase: 50_000_000,
    tax: 4_850_000,
    totalNote: "신고세액공제 3% 적용",
  },
  {
    label: "성인 자녀 3억 증여",
    relation: "성인 자녀",
    giftAmount: 300_000_000,
    priorGift: 0,
    deduction: 50_000_000,
    taxBase: 250_000_000,
    tax: 38_350_000,
    totalNote: "신고세액공제 3% 적용",
  },
  {
    label: "배우자 6억 증여",
    relation: "배우자",
    giftAmount: 600_000_000,
    priorGift: 0,
    deduction: 600_000_000,
    taxBase: 0,
    tax: 0,
    totalNote: "비과세 — 배우자 공제 한도 이내",
  },
  {
    label: "배우자 10억 증여",
    relation: "배우자",
    giftAmount: 1_000_000_000,
    priorGift: 0,
    deduction: 600_000_000,
    taxBase: 400_000_000,
    tax: 67_000_000,
    totalNote: "신고세액공제 3% 적용",
  },
  {
    label: "미성년 자녀 5,000만 증여",
    relation: "미성년 자녀",
    giftAmount: 50_000_000,
    priorGift: 0,
    deduction: 20_000_000,
    taxBase: 30_000_000,
    tax: 2_910_000,
    totalNote: "신고세액공제 3% 적용",
  },
];

export const GTC_FAQ = [
  {
    question: "자녀에게 증여할 수 있는 비과세 한도는 얼마인가요?",
    answer:
      "성인 자녀(만 19세 이상)는 10년간 5,000만 원, 미성년 자녀(만 19세 미만)는 10년간 2,000만 원까지 공제됩니다. 이 한도를 초과하는 금액에 대해 증여세가 부과됩니다. 10년 단위로 한도가 리셋되므로, 장기 계획으로 분할 증여하는 전략이 활용됩니다.",
  },
  {
    question: "증여세 세율은 어떻게 되나요?",
    answer:
      "증여세는 과세표준(증여액 – 공제액)에 따라 누진 세율이 적용됩니다. 1억 이하 10%, 1억 초과~5억 이하 20%, 5억 초과~10억 이하 30%, 10억 초과~30억 이하 40%, 30억 초과 50%입니다. 기한 내 신고 시 산출세액의 3%를 공제(신고세액공제)받습니다.",
  },
  {
    question: "배우자 증여 공제 한도는 얼마인가요?",
    answer:
      "배우자 간 증여는 10년간 6억 원까지 증여세 없이 가능합니다. 6억 원을 초과하는 금액에 대해서만 증여세가 부과됩니다.",
  },
  {
    question: "10년 이내 증여한 금액이 있으면 어떻게 되나요?",
    answer:
      "동일인(직계존속은 부모 합산)으로부터 10년 이내에 증여받은 금액은 합산해서 공제 한도를 적용합니다. 예를 들어 5년 전에 성인 자녀에게 3,000만 원을 증여했다면, 현재 새로 증여 시 공제 잔액은 2,000만 원(5,000만 – 3,000만)입니다.",
  },
  {
    question: "증여세 신고 기한은 언제인가요?",
    answer:
      "증여를 받은 날이 속하는 달의 말일로부터 3개월 이내에 신고·납부해야 합니다. 기한 내 신고 시 산출세액의 3%(신고세액공제)를 절약할 수 있습니다.",
  },
  {
    question: "부동산 증여 시 증여재산 평가는 어떻게 하나요?",
    answer:
      "부동산은 시가(실거래가·감정평가액)를 원칙으로 하며, 시가 산정이 어려울 때는 기준시가(공시가격)를 사용합니다. 아파트의 경우 유사 매매 사례가 시가로 인정될 수 있습니다. 이 계산기에서는 입력한 금액을 증여재산 가액으로 사용합니다.",
  },
  {
    question: "자녀에게 분할 증여하면 절세가 되나요?",
    answer:
      "네, 증여세는 10년 단위로 공제 한도가 초기화되므로 자녀가 어릴 때부터 10년 주기로 나눠 증여하면 세 부담을 줄일 수 있습니다. 예를 들어 태어날 때 2,000만 원(미성년 공제), 성인이 된 후 5,000만 원(성인 공제)을 증여하면 각 구간에서 비과세가 가능합니다.",
  },
];

export const GTC_RELATED_LINKS = [
  { label: "부동산 취득세 계산기", href: "/tools/real-estate-acquisition-tax/" },
  { label: "아파트 보유세 계산기", href: "/tools/apartment-holding-tax/" },
  { label: "연말정산 세금 환급 계산기", href: "/tools/year-end-tax-refund-calculator/" },
  { label: "국내 주식 양도소득세 계산기", href: "/tools/domestic-stock-capital-gains-tax/" },
];

export const GTC_SOURCE_LINKS = [
  { label: "국세청 홈택스 — 증여세 신고", href: "https://www.hometax.go.kr" },
  { label: "상속세 및 증여세법", href: "https://www.law.go.kr/법령/상속세및증여세법" },
];
