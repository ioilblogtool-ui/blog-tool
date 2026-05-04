export type SplitMode = "equal" | "ratio";
export type CurrencyCode = "KRW" | "JPY" | "USD" | "EUR";
export type RoundingUnit = 1 | 10 | 100 | 1000;

export type ExpenseCategory =
  | "flight"
  | "hotel"
  | "food"
  | "transport"
  | "ticket"
  | "shopping"
  | "insurance"
  | "etc";

export interface Participant {
  id: string;
  name: string;
  ratio: number;
}

export interface ExpenseItem {
  id: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  currency: CurrencyCode;
  exchangeRate: number;
  paidBy: string;
  includedParticipantIds: string[];
  splitMode?: SplitMode;
}

export interface TravelSplitPreset {
  id: string;
  label: string;
  description: string;
  splitMode: SplitMode;
  participants: Participant[];
  expenses: Omit<ExpenseItem, "id">[];
}

export interface TravelSplitFaqItem {
  question: string;
  answer: string;
}

export interface TravelSplitRelatedLink {
  label: string;
  href: string;
}

export const TES_META = {
  slug: "travel-expense-split",
  title: "여행 경비 분담 계산기",
  subtitle:
    "친구 여행, 커플 여행, 가족 여행 후 누가 누구에게 얼마 보내야 하는지 선결제자와 불참 항목까지 반영해 계산합니다.",
  updatedAt: "2026년 4월",
  defaultCurrency: "KRW" as CurrencyCode,
  defaultRoundingUnit: 100 as RoundingUnit,
  maxParticipants: 10,
  minParticipants: 2,
} as const;

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  flight: "항공권",
  hotel: "숙박",
  food: "식비",
  transport: "교통",
  ticket: "입장료",
  shopping: "쇼핑",
  insurance: "보험",
  etc: "기타",
};

export const CURRENCY_OPTIONS = [
  { code: "KRW", label: "원화", unit: "원", exchangeRate: 1 },
  { code: "JPY", label: "엔화", unit: "엔", exchangeRate: 9.5 },
  { code: "USD", label: "달러", unit: "달러", exchangeRate: 1400 },
  { code: "EUR", label: "유로", unit: "유로", exchangeRate: 1500 },
] as const;

export const TES_DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "p1", name: "승스", ratio: 25 },
  { id: "p2", name: "민수", ratio: 25 },
  { id: "p3", name: "지훈", ratio: 25 },
  { id: "p4", name: "현우", ratio: 25 },
];

export const TES_DEFAULT_EXPENSES: ExpenseItem[] = [
  {
    id: "e1",
    category: "hotel",
    title: "숙박",
    amount: 400000,
    currency: "KRW",
    exchangeRate: 1,
    paidBy: "p1",
    includedParticipantIds: ["p1", "p2", "p3", "p4"],
  },
  {
    id: "e2",
    category: "food",
    title: "식비",
    amount: 120000,
    currency: "KRW",
    exchangeRate: 1,
    paidBy: "p2",
    includedParticipantIds: ["p1", "p2", "p3", "p4"],
  },
];

export const TES_PRESETS: TravelSplitPreset[] = [
  {
    id: "friends",
    label: "친구 4인 여행",
    description: "숙박, 식비, 교통, 입장료를 더치페이로 정산",
    splitMode: "equal",
    participants: [
      { id: "p1", name: "승스", ratio: 25 },
      { id: "p2", name: "민수", ratio: 25 },
      { id: "p3", name: "지훈", ratio: 25 },
      { id: "p4", name: "현우", ratio: 25 },
    ],
    expenses: [
      { category: "hotel", title: "숙박", amount: 600000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "food", title: "식비", amount: 240000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "ticket", title: "입장료", amount: 90000, currency: "KRW", exchangeRate: 1, paidBy: "p3", includedParticipantIds: ["p1", "p2", "p4"] },
    ],
  },
  {
    id: "couple",
    label: "커플 2인 여행",
    description: "5:5 또는 6:4 분담으로 숙소와 식비 정산",
    splitMode: "ratio",
    participants: [
      { id: "p1", name: "A", ratio: 50 },
      { id: "p2", name: "B", ratio: 50 },
    ],
    expenses: [
      { category: "hotel", title: "숙박·렌터카", amount: 600000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2"] },
      { category: "food", title: "식비·카페", amount: 220000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2"] },
    ],
  },
  {
    id: "family",
    label: "가족 여행",
    description: "부모와 자녀의 분담 비율이 다른 가족 여행 정산",
    splitMode: "ratio",
    participants: [
      { id: "p1", name: "아빠", ratio: 50 },
      { id: "p2", name: "엄마", ratio: 30 },
      { id: "p3", name: "자녀1", ratio: 10 },
      { id: "p4", name: "자녀2", ratio: 10 },
    ],
    expenses: [
      { category: "hotel", title: "숙박", amount: 700000, currency: "KRW", exchangeRate: 1, paidBy: "p1", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
      { category: "transport", title: "교통·렌터카", amount: 250000, currency: "KRW", exchangeRate: 1, paidBy: "p2", includedParticipantIds: ["p1", "p2", "p3", "p4"] },
    ],
  },
];

export const TES_FAQ: TravelSplitFaqItem[] = [
  {
    question: "여행 경비는 총액을 인원수로 나누면 되나요?",
    answer:
      "가장 단순한 방식은 총액을 인원수로 나누는 것입니다. 다만 일부 인원만 참여한 액티비티, 선결제자, 항공권 개별 결제, 가족 분담률 등이 있으면 항목별로 따로 계산하는 것이 정확합니다.",
  },
  {
    question: "선결제자가 여러 명이면 어떻게 계산하나요?",
    answer:
      "각 비용 항목마다 선결제자를 지정하면 됩니다. 계산기는 각 사람이 먼저 낸 금액과 실제 부담해야 할 금액을 비교해 최종 송금 내역을 생성합니다.",
  },
  {
    question: "특정 사람이 어떤 일정에 참여하지 않았으면 어떻게 하나요?",
    answer:
      "해당 비용 항목에서 그 사람을 제외하면 됩니다. 예를 들어 4명 여행 중 3명만 놀이공원에 갔다면 입장료는 3명에게만 나눠 계산합니다.",
  },
  {
    question: "커플 여행은 무조건 5:5로 나누는 게 좋나요?",
    answer:
      "정답은 없습니다. 둘이 합의했다면 5:5, 6:4, 7:3처럼 비율 분담도 가능합니다. 계산기에서는 더치페이와 비율 분담을 모두 지원합니다.",
  },
  {
    question: "해외여행 경비도 계산할 수 있나요?",
    answer:
      "원화 입력을 기본으로 하되 엔화, 달러, 유로 입력과 환율 변환을 지원하므로 해외여행 정산에도 사용할 수 있습니다.",
  },
  {
    question: "정산 금액이 100원 단위로 딱 맞지 않으면 어떻게 하나요?",
    answer:
      "반올림 단위를 선택하면 계산기가 송금액을 해당 단위로 맞춥니다. 1원 단위가 불편하면 100원 또는 1,000원 단위 정산을 권장합니다.",
  },
];

export const TES_RELATED_LINKS: TravelSplitRelatedLink[] = [
  { label: "해외여행 총비용 계산기로 여행 예산 먼저 계산하기", href: "/tools/overseas-travel-cost/" },
  { label: "항공권 최저가 시기 계산하기", href: "/tools/flight-cheapest-timing-calculator/" },
  { label: "2026 한국인 해외여행 항공권 가격 비교", href: "/reports/korea-flight-price-comparison-2026/" },
  { label: "일본·동남아·유럽 여행 실비용 비교", href: "/reports/overseas-travel-cost-compare-2026/" },
];
