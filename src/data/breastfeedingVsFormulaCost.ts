export type FeedingMethod = "breast" | "mixed" | "formula";
export type FormulaGrade = "standard" | "organic" | "premium";
export type PumpOption = "none" | "buy-electric" | "buy-manual" | "rental";

export interface BvfPreset {
  id: string;
  label: string;
  method: FeedingMethod;
  currentAge: number;
  formulaGrade: FormulaGrade;
  pumpOption: PumpOption;
  includeSupplies: boolean;
}

export interface BvfTipCard {
  title: string;
  body: string[];
}

export interface BvfRelatedLink {
  href: string;
  label: string;
}

export const BVF_META = {
  title: "모유수유 vs 분유 비용 계산기",
  seoTitle: "모유수유 vs 분유 비용 계산기 | 12개월 총비용·유축기 손익분기점",
  seoDescription:
    "완모·혼합·완분 수유 방식별 월별 비용과 12개월 누적 비용을 비교하세요. 유축기 구매·렌탈 손익분기점, 분유 등급별 총비용, 예상 절감액을 계산합니다.",
  updatedAt: "2026년 5월 기준",
  dataNote:
    "분유 단가, 유축기 비용, 수유 소모품 비용은 2026년 5월 기준 온라인 판매가와 일반적인 사용 패턴을 단순화한 추정값입니다.",
};

export const DAILY_FORMULA_GRAMS: Record<number, number> = {
  0: 48,
  1: 48,
  2: 60,
  3: 60,
  4: 72,
  5: 72,
  6: 60,
  7: 60,
  8: 48,
  9: 48,
  10: 36,
  11: 36,
};

export const FORMULA_PRICE: Record<FormulaGrade, number> = {
  standard: 27000,
  organic: 41000,
  premium: 62000,
};

export const FORMULA_GRADE_LABEL: Record<FormulaGrade, string> = {
  standard: "일반 분유",
  organic: "유기농 분유",
  premium: "프리미엄 분유",
};

export const PUMP_COST: Record<PumpOption, { initial: number; monthly: number; label: string }> = {
  none: { initial: 0, monthly: 0, label: "없음" },
  "buy-electric": { initial: 220000, monthly: 0, label: "전동 유축기 구매" },
  "buy-manual": { initial: 45000, monthly: 0, label: "수동 유축기 구매" },
  rental: { initial: 0, monthly: 20000, label: "유축기 렌탈" },
};

export const SUPPLIES_MONTHLY = 18000;
export const MIXED_FORMULA_RATIO = 0.5;
export const CAN_GRAMS = 800;

export const BVF_PRESETS: BvfPreset[] = [
  {
    id: "preset-breast-electric",
    label: "완모 · 전동 유축기 구매",
    method: "breast",
    currentAge: 0,
    formulaGrade: "standard",
    pumpOption: "buy-electric",
    includeSupplies: true,
  },
  {
    id: "preset-breast-rental",
    label: "완모 · 유축기 렌탈",
    method: "breast",
    currentAge: 0,
    formulaGrade: "standard",
    pumpOption: "rental",
    includeSupplies: true,
  },
  {
    id: "preset-mixed",
    label: "혼합 수유 · 일반 분유",
    method: "mixed",
    currentAge: 0,
    formulaGrade: "standard",
    pumpOption: "buy-manual",
    includeSupplies: true,
  },
  {
    id: "preset-formula-standard",
    label: "완분 · 일반 분유",
    method: "formula",
    currentAge: 0,
    formulaGrade: "standard",
    pumpOption: "none",
    includeSupplies: false,
  },
  {
    id: "preset-formula-premium",
    label: "완분 · 프리미엄 분유",
    method: "formula",
    currentAge: 0,
    formulaGrade: "premium",
    pumpOption: "none",
    includeSupplies: false,
  },
];

export const BVF_TIP_CARDS: BvfTipCard[] = [
  {
    title: "완전 모유수유",
    body: [
      "초기 유축기·소모품 비용이 있지만 분유 구매 비용이 없어 장기적으로 가장 저렴한 편입니다.",
      "직장 복귀나 외출이 잦다면 냉동 모유, 유축 일정, 보관팩 비용까지 같이 봐야 합니다.",
      "수유 상담비, 유선염 치료비, 수유 쿠션 등 개인차가 큰 간접 비용은 계산에서 제외했습니다.",
    ],
  },
  {
    title: "혼합 수유",
    body: [
      "모유와 분유를 병행해 수유 부담을 나누는 방식입니다.",
      "이 계산기에서는 분유 사용량 50%와 수유 소모품 비용을 함께 반영합니다.",
      "실제 혼합 비율에 따라 비용은 달라질 수 있어 완모와 완분 사이의 기준값으로 읽는 것이 좋습니다.",
    ],
  },
  {
    title: "완전 분유",
    body: [
      "유축기·수유 소모품 초기 부담은 적지만 매달 분유 구매 비용이 꾸준히 발생합니다.",
      "브랜드 등급을 바꾸면 12개월 누적 비용 차이가 수십만 원까지 벌어질 수 있습니다.",
      "6개월 이후 이유식이 시작되면 분유 소비량이 자연스럽게 줄어드는 흐름을 반영했습니다.",
    ],
  },
];

export const BVF_FAQ = [
  {
    question: "모유수유는 무조건 분유보다 저렴한가요?",
    answer:
      "항상 그렇지는 않습니다. 전동 유축기, 수유패드, 모유 저장팩 같은 초기 비용을 포함하면 초반에는 분유보다 비쌀 수 있습니다. 다만 일반 분유 기준으로는 보통 몇 개월 이후부터 누적 비용이 역전되는 경우가 많습니다.",
  },
  {
    question: "유축기는 구매와 렌탈 중 무엇이 유리한가요?",
    answer:
      "12개월 가까이 완모를 계획한다면 구매가 유리한 경우가 많고, 수유 기간이 짧거나 유지 가능성이 불확실하다면 렌탈이 초기 부담을 줄이는 데 유리합니다. 계산기에서 손익분기점을 함께 확인하세요.",
  },
  {
    question: "혼합 수유 비용은 정확히 절반으로 줄어드나요?",
    answer:
      "분유 비용은 절반으로 줄어드는 구조로 계산하지만, 수유패드와 보관팩 같은 소모품 비용은 계속 발생합니다. 실제 혼합 비율이 30:70 또는 70:30이면 결과가 달라질 수 있습니다.",
  },
  {
    question: "이유식을 시작하면 분유 소비량이 줄어드나요?",
    answer:
      "일반적으로 생후 6개월 이후 이유식을 시작하면서 분유 섭취량이 점차 줄어듭니다. 이 계산기는 월령별 분유 사용량을 낮춰 6개월 이후 비용 감소를 반영합니다.",
  },
  {
    question: "프리미엄 분유와 일반 분유 차이는 얼마나 큰가요?",
    answer:
      "800g 기준 일반 분유는 약 2.7만 원, 프리미엄 분유는 약 6.2만 원으로 가정했습니다. 12개월 누적 기준으로는 수십만 원 차이가 날 수 있습니다.",
  },
  {
    question: "소모품 비용에는 무엇이 포함되나요?",
    answer:
      "수유패드, 모유 저장팩, 젖병 세척 관련 소모품 일부를 월 1.8만 원으로 단순화했습니다. 수유 상담비, 치료비, 수유 쿠션, 수유 브라 등 개인차가 큰 비용은 포함하지 않았습니다.",
  },
  {
    question: "직장 복귀 후에도 모유수유 비용 절감이 가능한가요?",
    answer:
      "가능합니다. 다만 유축 시간 확보, 냉동 모유 보관, 이동 중 보냉 관리 같은 추가 노력이 필요합니다. 직장 내 유축 공간과 보관 환경도 함께 확인해야 합니다.",
  },
  {
    question: "이 계산기의 분유 가격은 어떤 기준인가요?",
    answer:
      "2026년 5월 기준 국내 온라인 유통가를 단순화한 추정값입니다. 정기배송, 대량 구매, 멤버십 할인, 행사 여부에 따라 실제 구매 가격은 달라질 수 있습니다.",
  },
];

export const BVF_RELATED_LINKS: BvfRelatedLink[] = [
  { href: "/tools/formula-cost/", label: "아기 분유 값 계산기" },
  { href: "/tools/diaper-cost/", label: "아기 기저귀 값 계산기" },
  { href: "/reports/baby-cost-guide-first-year/", label: "신생아부터 돌까지 육아 비용 총정리" },
  { href: "/reports/baby-cost-2016-vs-2026/", label: "아이 키우는 비용 2016 vs 2026" },
  { href: "/tools/parental-leave-short-work-calculator/", label: "육아휴직+단축근무 계산기" },
];
