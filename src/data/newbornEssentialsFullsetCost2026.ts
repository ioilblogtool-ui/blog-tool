export type ItemId =
  | "carSeat"
  | "stroller"
  | "crib"
  | "bottleSterilizer"
  | "babyCarrier"
  | "bumperBed"
  | "mobile"
  | "changingTable"
  | "walkerBouncer"
  | "bathSet";

export type Grade = "frugal" | "mid" | "premium";

export interface ItemMeta {
  id: ItemId;
  label: string;
  isLargeItem: boolean;
  note?: string;
}

export const ITEM_LIST: ItemMeta[] = [
  { id: "carSeat", label: "카시트", isLargeItem: true, note: "가성비 등급도 기본 안전 인증(KC 인증) 기준 가격입니다." },
  { id: "stroller", label: "유모차", isLargeItem: true },
  { id: "crib", label: "아기침대", isLargeItem: true },
  { id: "bottleSterilizer", label: "젖병+소독기", isLargeItem: false },
  { id: "babyCarrier", label: "아기띠", isLargeItem: false },
  { id: "bumperBed", label: "범퍼침대/범퍼", isLargeItem: false },
  { id: "mobile", label: "모빌", isLargeItem: false },
  { id: "changingTable", label: "기저귀교환대", isLargeItem: false },
  { id: "walkerBouncer", label: "보행기/바운서", isLargeItem: false },
  { id: "bathSet", label: "목욕용품 세트", isLargeItem: false },
];

export const ITEM_IDS: ItemId[] = ITEM_LIST.map((item) => item.id);

// 쿠팡/네이버쇼핑 카테고리 평균가 샘플링 기준 추정값 (2026년 6월 기준)
export const ITEM_PRICE_TABLE: Record<ItemId, Record<Grade, number>> = {
  carSeat: { frugal: 150000, mid: 350000, premium: 700000 },
  stroller: { frugal: 120000, mid: 400000, premium: 900000 },
  crib: { frugal: 100000, mid: 300000, premium: 600000 },
  bottleSterilizer: { frugal: 30000, mid: 80000, premium: 180000 },
  babyCarrier: { frugal: 20000, mid: 60000, premium: 150000 },
  bumperBed: { frugal: 30000, mid: 70000, premium: 150000 },
  mobile: { frugal: 15000, mid: 40000, premium: 90000 },
  changingTable: { frugal: 20000, mid: 60000, premium: 130000 },
  walkerBouncer: { frugal: 30000, mid: 80000, premium: 180000 },
  bathSet: { frugal: 15000, mid: 35000, premium: 70000 },
};

export const SECOND_CHILD_RESET_ITEMS: ItemId[] = ["carSeat", "stroller", "crib"];

export const GRADE_OPTIONS: { id: Grade; label: string }[] = [
  { id: "frugal", label: "가성비" },
  { id: "mid", label: "중급" },
  { id: "premium", label: "프리미엄" },
];

export type DefaultInputState = {
  checkedItems: Record<ItemId, boolean>;
  itemGrades: Record<ItemId, Grade>;
  secondChildMode: boolean;
};

export const DEFAULT_INPUT: DefaultInputState = {
  checkedItems: ITEM_IDS.reduce((acc, id) => ({ ...acc, [id]: true }), {} as Record<ItemId, boolean>),
  itemGrades: ITEM_IDS.reduce((acc, id) => ({ ...acc, [id]: "mid" as Grade }), {} as Record<ItemId, Grade>),
  secondChildMode: false,
};

export const NEFC_META = {
  slug: "newborn-essentials-fullset-cost-2026",
  title: "신생아 용품 풀세트 비용 계산기 2026",
  seoTitle: "신생아 용품 풀세트 비용 계산기 2026 | 출산 준비물 총비용 바로 계산",
  description:
    "카시트·유모차·아기침대·젖병 세척기 등 출산 준비물을 가성비·중급·프리미엄 등급별로 선택하면 풀세트 총비용을 바로 계산합니다. 둘째 출산 시 보유 품목 제외 기능 포함.",
  updatedAt: "2026-06-27",
};

export const NEFC_FAQ = [
  {
    question: "모든 품목을 다 사야 하나요?",
    answer:
      "아니요. 보행기·바운서처럼 선택적인 품목도 있고, 가정 상황에 따라 생략 가능한 품목도 있습니다. 체크박스를 해제하면 합계에서 바로 제외됩니다.",
  },
  {
    question: "둘째를 출산하는데 다 새로 사야 하나요?",
    answer:
      "카시트·유모차·아기침대처럼 사용 기간이 긴 대형 용품은 첫째 때 쓰던 것을 재사용하는 경우가 많습니다. '둘째 출산 모드'를 켜면 대형 용품이 기본적으로 체크 해제된 상태로 시작합니다.",
  },
  {
    question: "가성비 등급도 안전한가요?",
    answer:
      "카시트처럼 안전 관련 제품은 가성비 등급도 기본 안전 인증(KC 인증)을 갖춘 제품 기준으로 가격을 책정했습니다. 고가일수록 편의 기능이 많아지는 차이입니다.",
  },
  {
    question: "이 계산기의 등급은 '첫 1년 육아비' 리포트와 같은 기준인가요?",
    answer:
      "네. 가성비·중급·프리미엄 3단계는 '신생아~돌까지 육아 비용 총정리' 리포트의 가성비·평균·프리미엄과 같은 단계를 의미합니다. 이 계산기는 그 리포트에서 품목당 1줄로만 보여준 비용을 품목별로 더 세부적으로 합산합니다.",
  },
  {
    question: "이 가격은 정확한 금액인가요?",
    answer:
      "아니요. 쿠팡·네이버쇼핑 카테고리 평균가를 샘플링한 추정값입니다. 실제 구매가는 브랜드, 옵션, 할인 시점에 따라 달라질 수 있습니다.",
  },
];

export const NEFC_RELATED_LINKS = [
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아~돌까지 육아 비용 총정리 리포트" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/pregnancy-birth-cost/", label: "임신 출산 비용 계산기" },
];

export type NefcCta = {
  id: string;
  label: string;
  href: string;
};

export const NEFC_REPORT_CTA: NefcCta = {
  id: "report-first-year",
  label: "용품 외 기저귀·분유·병원비까지 보기",
  href: "/reports/baby-cost-guide-first-year/",
};

export const NEFC_SUPPORT_CTA: NefcCta = {
  id: "birth-support",
  label: "준비물 비용, 지원금으로 메우기",
  href: "/tools/birth-support-total/",
};

// 품목 검색 키워드 — 결과 테이블의 "이 등급으로 둘러보기" 링크에 사용 (제휴 코드 없는 일반 검색 링크)
export const ITEM_SEARCH_KEYWORD: Record<ItemId, string> = {
  carSeat: "유아 카시트",
  stroller: "유아 유모차",
  crib: "아기 침대",
  bottleSterilizer: "젖병 소독기",
  babyCarrier: "아기띠",
  bumperBed: "범퍼침대",
  mobile: "아기 모빌",
  changingTable: "기저귀교환대",
  walkerBouncer: "보행기 바운서",
  bathSet: "신생아 목욕용품",
};
