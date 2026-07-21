export const FCI_META = {
  slug: "flood-car-insurance-calculator",
  title: "침수차 보험처리 계산기",
  description: "차량가액과 예상 인정 손해액을 입력해 전손·분손 가능성, 자기부담금과 예상 보험금을 계산합니다.",
  seoTitle: "침수차 보험처리 계산기 | 전손 기준·자기부담금·예상 보험금",
  seoDescription:
    "침수차의 차량가액과 예상 수리비를 입력해 전손·분손 가능성, 자기부담금과 예상 보험금을 계산하세요. 자차보험 보상 조건, 보험료 할증, 보상 제외 사유와 사고처리 절차도 확인할 수 있습니다.",
  updatedAt: "2026-07",
  dataNote:
    "이 계산기는 자기차량손해담보와 차량단독사고(또는 침수) 보장 특약에 모두 가입된 경우를 기준으로 한 참고용 추정 도구입니다. 최종 전손·분손 판정과 보험금은 보험사 손해사정 결과와 가입 약관이 우선합니다.",
};

export type CoverageStatus = "yes" | "no" | "unsure";
export type DeductibleWaiverStatus = "waived" | "notWaived" | "unsure";
export type FloodScenario = "normal" | "windowOpen" | "restrictedArea";
export type LossTier = "partial-likely" | "high-cost-repair" | "total-loss-borderline" | "presumed-total-loss";

export interface FloodCarInput {
  collisionCoverage: CoverageStatus;
  singleAccidentCoverage: CoverageStatus;
  floodScenario: FloodScenario;
  vehicleValue: number;
  repairCost: number;
  towingCost: number;
  cleaningCost: number;
  additionalDamageEstimate: number;
  isFunctionUnrecoverable: boolean;
  deductibleRate: number;
  deductibleMin: number;
  deductibleMax: number;
  deductibleWaiverOnTotalLoss: DeductibleWaiverStatus;
}

export interface FloodCarResult {
  eligibility: "eligible" | "blocked-collision" | "blocked-single-accident" | "needs-check";
  estimatedDamage: number;
  lossRatio: number;
  tier: LossTier;
  isTotalLoss: boolean;
  deductibleAmount: number;
  expectedPayout: number;
}

export const FCI_DEFAULT_INPUT: FloodCarInput = {
  collisionCoverage: "yes",
  singleAccidentCoverage: "yes",
  floodScenario: "normal",
  vehicleValue: 15_000_000,
  repairCost: 8_000_000,
  towingCost: 150_000,
  cleaningCost: 300_000,
  additionalDamageEstimate: 0,
  isFunctionUnrecoverable: false,
  deductibleRate: 20,
  deductibleMin: 200_000,
  deductibleMax: 500_000,
  deductibleWaiverOnTotalLoss: "notWaived",
};

export function getEligibility(input: FloodCarInput): FloodCarResult["eligibility"] {
  if (input.collisionCoverage === "no") return "blocked-collision";
  if (input.singleAccidentCoverage === "no") return "blocked-single-accident";
  if (input.collisionCoverage === "unsure" || input.singleAccidentCoverage === "unsure") return "needs-check";
  return "eligible";
}

/**
 * 70/90/100%는 법정 판정 기준이 아니라 계산기 표시용 구간입니다.
 * 실제 전손·분손 판정은 수리 가능성, 주요 부품 손상 정도, 잔존물 가치를 반영한
 * 보험사 손해사정 결과로 결정됩니다.
 */
export function getLossTier(lossRatio: number): LossTier {
  if (lossRatio >= 100) return "presumed-total-loss";
  if (lossRatio >= 90) return "total-loss-borderline";
  if (lossRatio >= 70) return "high-cost-repair";
  return "partial-likely";
}

export const FCI_TIER_LABEL: Record<LossTier, string> = {
  "partial-likely": "분손 가능성 높음",
  "high-cost-repair": "고액 수리 구간",
  "total-loss-borderline": "전손 검토 가능성이 높은 경계 구간",
  "presumed-total-loss": "추정전손 가능성 높음",
};

export function calcFloodCarInsurance(input: FloodCarInput): FloodCarResult {
  const eligibility = getEligibility(input);
  const estimatedDamage = input.repairCost + input.towingCost + input.cleaningCost + input.additionalDamageEstimate;
  const lossRatio = input.vehicleValue > 0 ? Math.round((estimatedDamage / input.vehicleValue) * 1000) / 10 : 0;
  const tier = getLossTier(lossRatio);
  const isTotalLoss = lossRatio >= 100 || input.isFunctionUnrecoverable;

  const rawDeductible = Math.round((estimatedDamage * input.deductibleRate) / 100);
  const deductibleAmount = Math.min(Math.max(rawDeductible, input.deductibleMin), input.deductibleMax);

  let expectedPayout: number;
  if (isTotalLoss) {
    expectedPayout = input.deductibleWaiverOnTotalLoss === "waived"
      ? input.vehicleValue
      : Math.max(input.vehicleValue - deductibleAmount, 0);
  } else {
    expectedPayout = Math.max(estimatedDamage - deductibleAmount, 0);
  }

  return { eligibility, estimatedDamage, lossRatio, tier, isTotalLoss, deductibleAmount, expectedPayout };
}

export interface SensitivityRow {
  extraCost: number;
  totalDamage: number;
  lossRatio: number;
  tier: LossTier;
}

export function calcSensitivity(input: FloodCarInput): SensitivityRow[] {
  const baseDamage = input.repairCost + input.towingCost + input.cleaningCost + input.additionalDamageEstimate;
  return [0, 3_000_000, 5_000_000, 7_000_000].map((extraCost) => {
    const totalDamage = baseDamage + extraCost;
    const lossRatio = input.vehicleValue > 0 ? Math.round((totalDamage / input.vehicleValue) * 1000) / 10 : 0;
    return { extraCost, totalDamage, lossRatio, tier: getLossTier(lossRatio) };
  });
}

export interface FloodCarPreset {
  id: string;
  label: string;
  summary: string;
  note?: string;
  input: Partial<FloodCarInput>;
}

export const FCI_PRESETS: FloodCarPreset[] = [
  {
    id: "floor-partial",
    label: "바닥 일부 침수",
    summary: "차량가액 1,500만원 · 손해액 300만원",
    input: { vehicleValue: 15_000_000, repairCost: 3_000_000, towingCost: 100_000, cleaningCost: 200_000 },
  },
  {
    id: "interior-electronics",
    label: "실내·전자장치 침수",
    summary: "차량가액 1,500만원 · 손해액 800만원",
    input: { vehicleValue: 15_000_000, repairCost: 8_000_000, towingCost: 150_000, cleaningCost: 300_000 },
  },
  {
    id: "engine-transmission",
    label: "엔진·변속기 침수",
    summary: "차량가액 1,500만원 · 손해액 1,300만원",
    input: { vehicleValue: 15_000_000, repairCost: 13_000_000, towingCost: 150_000, cleaningCost: 300_000 },
  },
  {
    id: "old-car-high-repair",
    label: "노후차 고액 수리",
    summary: "차량가액 500만원 · 손해액 600만원",
    input: { vehicleValue: 5_000_000, repairCost: 5_500_000, towingCost: 100_000, cleaningCost: 200_000 },
  },
  {
    id: "ev-battery",
    label: "전기차 배터리 침수",
    summary: "차량가액 4,000만원 · 손해액 3,500만원",
    note: "전기차는 배터리·고전압 계통 특성상 일반 내연기관 차량과 손해 구조가 달라, 이 계산기의 단순 비율 판정보다 정밀 손해사정이 필요합니다.",
    input: { vehicleValue: 40_000_000, repairCost: 35_000_000, towingCost: 200_000, cleaningCost: 300_000 },
  },
];

export const FCI_COVERAGE_CASES = [
  { situation: "정상 주차 중 갑자기 침수", judgment: "보상 가능성 있음" },
  { situation: "정상 운행 중 갑자기 물이 불어나 침수", judgment: "보상 가능성 있음" },
  { situation: "태풍·홍수로 차량이 파손", judgment: "자차·단독사고 특약 가입 시 가능" },
  { situation: "지하주차장에 정상 주차 중 침수", judgment: "보상 가능성 있음" },
  { situation: "차량 내부 개인 물품 손해", judgment: "보상 대상 아님" },
  { situation: "창문·선루프를 열어둔 상태에서 침수", judgment: "보상 제외 가능성 큼" },
  { situation: "경찰·지자체 통제구역에 고의 진입", judgment: "보상·할증 판단에 불리할 수 있음" },
  { situation: "대피 명령을 무시하고 운행", judgment: "과실 또는 보험료 불이익 가능" },
  { situation: "자차 또는 침수 보장 특약 미가입", judgment: "내 차량 보상 어려움" },
];

export const FCI_AFTER_FLOOD_CHECKLIST = [
  "시동이 꺼졌다면 다시 시동을 걸지 않기",
  "전기장치와 차량 전원을 반복해서 조작하지 않기",
  "안전한 곳으로 대피하기",
  "차량 내외부와 침수 수위를 사진·영상으로 남기기",
  "보험회사에 사고 접수하기",
  "보험사 안내 후 견인하기",
  "정비 견적서와 견인비 영수증 보관하기",
  "경찰·지자체 통제 여부와 당시 상황 기록하기",
];

export const FCI_PREMIUM_IMPACT = {
  noFault:
    "운전자에게 책임이 없는 정상적인 주차·운행 중 자연재해 침수는 일반적으로 사고로 인한 직접 할증이 적용되지 않습니다. 다만 무사고 할인 적용이 1년 정도 유예될 수 있습니다.",
  atFault:
    "통제구역 진입이나 대피 명령 무시 등 운전자 과실이 인정되면 보험료에 불리하게 반영될 수 있습니다. 보험사별 요율 적용 방식은 다를 수 있습니다.",
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const FCI_FAQ: FaqItem[] = [
  {
    question: "침수차는 무조건 전손인가요?",
    answer:
      "아닙니다. 침수 깊이만으로 전손 여부를 결정하지 않습니다. 사고 당시 차량가액, 예상 수리비, 엔진·변속기·전자장치 손상 정도, 수리 후 정상 기능 회복 가능성을 종합해 전손 또는 분손으로 판단합니다.",
  },
  {
    question: "침수 높이가 어디까지 오면 전손인가요?",
    answer:
      "바닥·시트·대시보드 등 침수 높이는 손상 정도를 판단하는 중요한 자료지만, 특정 높이에 도달했다는 이유만으로 자동 전손 처리되지는 않습니다. 전자제어장치와 엔진 내부 침수 여부가 함께 평가됩니다.",
  },
  {
    question: "시동이 걸리면 운전해도 되나요?",
    answer:
      "권장하지 않습니다. 침수 후 외관상 시동이 걸려도 엔진오일, 변속기오일, 전기 배선과 제어장치 내부에 물이 들어갔을 수 있습니다. 보험사에 접수하고 견인해 정비점검을 받는 것이 안전합니다.",
  },
  {
    question: "차 안의 노트북과 휴대전화도 보상되나요?",
    answer:
      "일반적으로 자동차보험의 자기차량손해담보는 차량 자체의 손해를 대상으로 하므로 차량 안의 개인 소지품은 보상 대상이 아닙니다. 별도의 휴대품 보험이나 다른 보험의 보장 여부를 확인해야 합니다.",
  },
  {
    question: "창문을 열어둔 채 침수되면 보상되나요?",
    answer:
      "창문이나 선루프를 열어둔 상태에서 빗물이 들어온 경우에는 보상 대상에서 제외될 가능성이 큽니다. 다만 실제 판단은 사고 원인과 가입 약관에 따라 달라질 수 있습니다.",
  },
  {
    question: "침수차 보험처리하면 보험료가 오르나요?",
    answer:
      "운전자 책임이 없는 정상적인 주차·운행 중 자연재해 침수라면 일반적으로 직접 할증은 적용되지 않을 수 있습니다. 다만 무사고 할인 적용이 1년 정도 유예될 수 있으며, 통제구역 진입이나 대피 명령 무시 등 과실이 인정되면 보험료에 불리하게 반영될 수 있습니다.",
  },
  {
    question: "침수차 보험처리 후 폐차해야 하나요?",
    answer:
      "전손으로 처리된 경우 보험사와 잔존물 처리 절차를 협의해야 합니다. 분손으로 수리한 경우에는 반드시 폐차해야 하는 것은 아니지만, 수리 이후 전기장치·부식·악취 문제를 지속적으로 점검해야 합니다.",
  },
  {
    question: "자기부담금은 얼마나 되나요?",
    answer:
      "일반적으로 손해액의 20%(또는 30%)를 최소 20만 원, 최대 50만 원 범위 안에서 부담합니다. 정확한 비율과 한도, 전손 시 자기부담금 공제 여부는 계약마다 달라 본인 보험증권을 확인해야 합니다.",
  },
  {
    question: "보험사 계산과 이 계산기 결과가 다른 이유는 무엇인가요?",
    answer:
      "이 계산기는 사용자가 입력한 차량가액과 예상 손해액을 이용하지만, 보험사는 실제 차량가액, 손상 부위, 수리 가능성, 부품비, 공임, 잔존물 가치와 약관을 반영합니다. 따라서 계산 결과는 보험금 확정값이 아니라 상담 전 참고값입니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
}

export const FCI_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/car-accident-insurance-vs-cash-calculator/", label: "자동차 사고 보험처리 vs 현금처리 계산기" },
];

export const FCI_EXTERNAL_LINKS = {
  vehicleStandardValue: { label: "보험개발원 차량기준가액 확인", url: "https://www.carhistory.or.kr/information/carstandardamnt.page" },
  floodHistoryCheck: { label: "침수차 무료 조회하기 (카히스토리)", url: "https://www.carhistory.or.kr/search/carhistory/freeSearch.car" },
};

export interface SourceLink {
  label: string;
  url: string;
}

export const FCI_SOURCES: SourceLink[] = [
  { label: "삼성화재 — 자동차 침수 피해 예방·보상 안내", url: "https://www.samsungfire.com/v2/html/main/Z_005_010_008.html" },
  { label: "보험개발원 카히스토리 — 차량기준가액 조회", url: "https://www.carhistory.or.kr/information/carstandardamnt.page" },
  { label: "보험개발원 카히스토리 — 무료 침수사고 조회", url: "https://www.carhistory.or.kr/search/carhistory/freeSearch.car" },
  { label: "자차보험 자기부담금 20%·30% 기준", url: "https://normen.co.kr/5397/" },
];

export const FCI_SEO_CONTENT = {
  introTitle: "침수차 보험처리, 보장 범위와 전손 기준부터 확인하세요",
  intro: [
    "침수 피해를 보상받으려면 일반적으로 자기차량손해담보와 침수 또는 차량단독사고를 보장하는 특약에 모두 가입돼 있어야 합니다. 가입한 자동차보험의 보장 범위는 보험증권이나 보험사 앱에서 먼저 확인하는 것이 좋습니다.",
    "보상이 가능한 경우에도 예상 손해액이 차량가액에 비해 얼마나 되는지에 따라 분손 가능성이 높은 구간부터 추정전손 가능성이 높은 구간까지 달라집니다. 손해액이 차량가액보다 낮아도 수리 후 정상 기능 회복이 어려우면 절대전손으로 검토될 수 있습니다.",
    "이 계산기는 참고용 추정 도구이며, 최종 전손·분손 판정, 인정 손해액, 자기부담금과 지급보험금은 보험사 손해사정 결과와 가입 약관이 우선합니다.",
  ],
  inputPoints: [
    "자기차량손해담보와 차량단독사고(또는 침수) 특약 가입 여부를 먼저 확인하세요.",
    "수리비뿐 아니라 견인비·세척건조비·추가 손상 예상액을 더한 예상 인정 손해액을 계산합니다.",
    "추가 수리비가 늘어날 경우의 판정 변화를 민감도 표로 함께 확인할 수 있습니다.",
  ],
  criteria: [
    "전손 판정 참고 구간: 손해율 70% 미만 분손 가능성, 70~90% 고액 수리, 90~100% 전손 경계, 100% 이상 추정전손 가능성",
    "자기부담금: 손해액의 20%(또는 30%), 최소 20만 원~최대 50만 원",
    "창문·선루프 개방 상태 침수, 통제구역 진입은 보상 제외·불이익 가능성이 있습니다.",
  ],
};
