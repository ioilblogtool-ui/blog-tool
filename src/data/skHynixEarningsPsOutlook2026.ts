import { rankPresets } from "./skHynixCompensation";

export { rankPresets };

// ── 타입 ──────────────────────────────────────────

export type QuarterResult = {
  revenue: number;
  operatingProfit: number;
  operatingMargin: number;
};

export type ScenarioCode = "conservative" | "base" | "bull";

export type PsScenarioRow = {
  id: ScenarioCode;
  label: string;
  h2ToH1Ratio: number;
  description: string;
  directionNote: string;
};

export type PayoutStructureVariable = {
  variable: string;
  current: string;
  impact: string;
};

export type CheckpointItem = { order: number; text: string };
export type FaqItem = { question: string; answer: string };
export type UpdateLogItem = { date: string; note: string; status: "완료" | "예정" };

// ── 메타 ──────────────────────────────────────────

export const SHEP_META = {
  slug: "sk-hynix-earnings-ps-outlook-2026",
  title: "SK하이닉스 2026년 2분기 실적과 2027년 PS 전망",
  seoTitle: "SK하이닉스 2분기 실적·PS 전망 2026 | 2027 성과급 얼마나 될까",
  seoDescription:
    "SK하이닉스 2026년 2분기 매출 79.3조 원, 영업이익 60.5조 원을 분석하고 2026년 실적 기준 2027년 초 지급될 PS 성과급을 시나리오별로 추정합니다.",
  description:
    "상반기 영업이익이 작년 연간의 2배를 넘어선 가운데, 2027년 초 지급될 PS를 시나리오별로 추정합니다.",
  updatedAt: "2026-07-29",
  dataNote:
    "이 페이지의 PS(성과급) 전망은 단순 비례 추정 모델 기준이며 공식 확정 발표가 아닙니다. 2026년 실적 기준 PS는 연간 실적 확정 후 노사 협의를 거쳐 2027년 초 지급률이 결정되며, 지급방식(현금·자사주 비율)도 협의 중인 변수입니다.",
};

// ── 실적 데이터 (출처: SK hynix Newsroom 공식 발표) ──

export const SHEP_Q1: QuarterResult = {
  revenue: 52.576,
  operatingProfit: 37.6103,
  operatingMargin: 72,
};

export const SHEP_Q2: QuarterResult = {
  revenue: 79.3187,
  operatingProfit: 60.5426,
  operatingMargin: 76,
};

export const SHEP_Q2_GROWTH = {
  qoqRevenue: 51,
  qoqOperatingProfit: 61,
  qoqMarginPointDiff: 4,
  yoyRevenue: 257,
  yoyOperatingProfit: 557,
  yoyMarginPointDiff: 35,
};

export const SHEP_NET_PROFIT_NOTE = {
  value: 93.9226,
  label: "2분기 순이익 93조 9,226억원(순이익률 118%)",
  caption:
    "비영업손익 포함 추정 수치로, 영업이익과 별개 지표입니다. 성과급 산정과 직접 연결되는 지표는 영업이익입니다.",
};

export const SHEP_H1 = {
  operatingProfit: SHEP_Q1.operatingProfit + SHEP_Q2.operatingProfit,
};

export const SHEP_FY2025_OPERATING_PROFIT = 47.2063;

export const SHEP_H1_VS_FY2025_MULTIPLE =
  SHEP_H1.operatingProfit / SHEP_FY2025_OPERATING_PROFIT;

export const SHEP_CONSENSUS = {
  asOf: "2026-05-20",
  annualOperatingProfit: 77.1,
  source: "FnGuide",
};

export const SHEP_CONSENSUS_GAP = {
  q2ToConsensusRatio: SHEP_Q2.operatingProfit / SHEP_CONSENSUS.annualOperatingProfit,
  h1ExcessAmount: SHEP_H1.operatingProfit - SHEP_CONSENSUS.annualOperatingProfit,
  h1ExcessRatio: SHEP_H1.operatingProfit / SHEP_CONSENSUS.annualOperatingProfit - 1,
};

// ── PS 산정 구조 (기준점: 2025년 실적 → 2026년 초 실제 지급) ──

export const SHEP_PS_BASELINE = {
  fiscalYear: 2025,
  operatingProfit: SHEP_FY2025_OPERATING_PROFIT,
  paidYear: 2026,
  psRate: 2964,
  fundRatioOfOperatingProfit: 10,
  immediateRatio: 0.8,
  deferredRatioYear1: 0.1,
  deferredRatioYear2: 0.1,
};

export const SHEP_PS_SCENARIOS: PsScenarioRow[] = [
  {
    id: "conservative",
    label: "보수적",
    h2ToH1Ratio: 0.35,
    description: "하반기 메모리 가격·출하량이 상반기보다 크게 둔화",
    directionNote: "2026년 초 지급률을 크게 상회할 가능성",
  },
  {
    id: "base",
    label: "기준",
    h2ToH1Ratio: 0.55,
    description: "하반기에도 높은 수익성을 유지하되 성장률은 둔화",
    directionNote: "기존 지급률의 3배 안팎 가능성",
  },
  {
    id: "bull",
    label: "공격적",
    h2ToH1Ratio: 0.75,
    description: "HBM4 확대와 범용 메모리 가격 강세가 지속",
    directionNote: "지급 구조(현금·자사주 비율) 변경 여부가 핵심 변수",
  },
];

export const calculateAnnualOperatingProfit = (h2ToH1Ratio: number): number =>
  SHEP_H1.operatingProfit * (1 + h2ToH1Ratio);

export const estimatePsRate = (annualOperatingProfit: number): number =>
  Math.round(
    SHEP_PS_BASELINE.psRate * (annualOperatingProfit / SHEP_PS_BASELINE.operatingProfit)
  );

export type PsScenarioResult = PsScenarioRow & {
  annualOperatingProfit: number;
  estimatedPsRate: number;
};

export const SHEP_PS_SCENARIO_RESULTS: PsScenarioResult[] = SHEP_PS_SCENARIOS.map(
  (scenario) => {
    const annualOperatingProfit = calculateAnnualOperatingProfit(scenario.h2ToH1Ratio);
    return {
      ...scenario,
      annualOperatingProfit,
      estimatedPsRate: estimatePsRate(annualOperatingProfit),
    };
  }
);

// ── 지급방식 개편 리스크 (2026-07 기준 미확정) ──────

export const SHEP_PAYOUT_RISK = {
  status: "노사 교섭 진행 중, 미확정",
  asOf: "2026-07-29",
  currentStructure: "산정액 80% 당해 현금 지급 + 20% 2년(10%씩) 이연 지급",
  proposedChange:
    "PS 재원 기준(영업이익 10%)은 유지, 지급 수단 일부를 현금에서 자사주로 전환 검토",
  unionPosition: "세금 부담·현금화 문제로 반발",
};

export const SHEP_PAYOUT_VARIABLES: PayoutStructureVariable[] = [
  { variable: "PS 재원 기준", current: "영업이익의 10% (유지 논의)", impact: "실적 상승 시 재원 확대" },
  { variable: "지급 시점", current: "익년 초", impact: "2026년 실적분은 2027년 초" },
  { variable: "이연 지급", current: "20%를 2년(10%씩) 분할", impact: "당해 현금 수령액 감소" },
  {
    variable: "지급 수단 개편",
    current: "현금 일부 → 자사주 전환 검토 (미확정)",
    impact: "확정 시 실질 현금 수령액·세금 부담 달라질 수 있음",
  },
  { variable: "노사 합의", current: "진행 중, 결론 미확정", impact: "최종 지급률·지급방식 모두 변동 가능" },
];

export const SHEP_CHECKPOINTS: CheckpointItem[] = [
  { order: 1, text: "하반기 D램·낸드 가격 상승세 지속 여부 (고객 재고 조정 리스크)" },
  { order: 2, text: "HBM4 양산 확대 속도 및 수율" },
  { order: 3, text: "장기공급계약 체결 고객사(현재 약 10개사) 추가 여부" },
  { order: 4, text: "3분기 실적(10월 발표 예정) 컨센서스 상회 여부" },
  { order: 5, text: "PS 지급방식(현금·자사주) 노사 교섭 결론 시점" },
  { order: 6, text: "연간 실적 확정 후 PS 지급 기준일 공지" },
];

export const SHEP_FAQ: FaqItem[] = [
  {
    question: "2분기 실적은 언제, 얼마로 발표됐나요?",
    answer: "2026년 7월 29일, 매출 79조 3,187억원·영업이익 60조 5,426억원(영업이익률 76%)으로 발표됐습니다.",
  },
  {
    question: "상반기 실적은 작년 연간과 비교하면 어느 정도인가요?",
    answer: "2026년 상반기 영업이익(98.2조원)은 2025년 연간 영업이익(47.2조원)의 약 2.08배입니다.",
  },
  {
    question: "2026년 실적에 대한 PS는 언제 지급되나요?",
    answer: "통상 연간 실적 확정 후 2027년 초 지급률이 결정되고 지급됩니다.",
  },
  {
    question: "2분기 영업이익만으로 PS를 계산할 수 있나요?",
    answer: "불가능합니다. 연간 영업이익, PS 재원 산정 방식, 대상 인원, 노사 합의가 모두 필요합니다.",
  },
  {
    question: "PS 2,964%는 연봉의 29.64배인가요?",
    answer: "아닙니다. 기준급의 2,964%이며, 기준급이 연봉의 약 1/20이라면 연봉 대비로는 약 1.48배 수준입니다.",
  },
  {
    question: "PS는 모두 한 번에 현금으로 받나요?",
    answer:
      "현재 알려진 구조는 산정액의 80%를 당해 현금 지급하고 20%를 2년(10%씩) 이연 지급합니다. 다만 이 방식이 바뀔 수 있습니다.",
  },
  {
    question: "현금 대신 주식으로 받을 수도 있나요?",
    answer:
      "2026년 7월 기준, 지급 방식 일부를 자사주로 전환하는 방안이 노사 교섭 쟁점으로 논의되고 있으나 확정되지 않았습니다.",
  },
  {
    question: "상반기 실적이 좋으면 최소 지급률이 보장되나요?",
    answer: "아닙니다. 분기·반기 실적만으로 최종 PS 지급률이 보장되지 않으며, 연간 실적 확정과 노사 협의를 거쳐야 합니다.",
  },
];

export const SHEP_SEO_INTRO = [
  "SK하이닉스는 2026년 7월 29일 2분기 실적을 발표했습니다. 매출 79조 3,187억원, 영업이익 60조 5,426억원(영업이익률 76%)으로 분기 사상 최대이며, 상반기 누적 영업이익(98조 1,529억원)은 2025년 연간 실적의 약 2.08배에 달합니다.",
  "다만 PS(초과이익분배금)는 영업이익만으로 결정되지 않습니다. 재원 산정 방식, 대상 인원과 기준급 총액, 노사 합의, 그리고 최근 쟁점이 된 현금·자사주 지급 비율 개편 여부까지 종합적으로 반영됩니다.",
];

export const SHEP_SEO_CRITERIA = [
  "2분기 실적: 매출 79.3조원, 영업이익 60.5조원(영업이익률 76%), 전년 동기 대비 +257%/+557%",
  "상반기 누적 영업이익 98.2조원은 2025년 연간 실적(47.2조원)의 약 2.08배",
  "PS는 연간 영업이익의 10%를 재원으로, 산정액의 80%는 당해 현금·20%는 2년 이연 지급 (2026년 초 실제 지급 기준급 2,964%)",
  "2026년 실적 기준 PS는 2027년 초 지급되며, 이 페이지의 시나리오는 단순 비례 추정치로 공식 발표가 아님",
  "PS 지급 수단(현금·자사주 비율) 개편이 2026년 7월 노사 교섭 쟁점으로 논의 중이며 미확정",
];

export const SHEP_RELATED_LINKS = [
  { href: "/tools/sk-hynix-bonus/", label: "SK하이닉스 성과급 계산기" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기" },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026" },
  { href: "/reports/sk-hynix-bonus-2027/", label: "SK하이닉스 2027 성과급 전망" },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교" },
];

export const SHEP_UPDATE_LOG: UpdateLogItem[] = [
  { date: "2026-07-29", note: "2분기 확정실적 반영, PS 지급방식 개편 이슈 추가", status: "완료" },
  { date: "2026-08", note: "증권사 연간 컨센서스 업데이트 예정", status: "예정" },
  { date: "2026-10", note: "3분기 실적 반영 예정", status: "예정" },
  { date: "2027-01", note: "연간 확정실적 반영 예정", status: "예정" },
  { date: "2027-02", note: "실제 PS 지급률·지급방식 확정 반영 예정", status: "예정" },
];
