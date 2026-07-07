import {
  divisions as samsungDivisions,
  scenarioPresets,
  operatingProfitScenarios,
  unionDemandScenarios,
} from "./samsungCompensation";

export { samsungDivisions, scenarioPresets, operatingProfitScenarios, unionDemandScenarios };

// ── 타입 ──────────────────────────────────────────

export type EarningsCalendarStatus = "완료" | "예정" | "미정";

export type EarningsCalendarItem = {
  date: string;
  dateLabel: string;
  event: string;
  scope: string;
  status: EarningsCalendarStatus;
};

export type ProgressCard = {
  label: string;
  value: string;
  note: string;
  isPlaceholder: boolean;
};

export type OpiStructureRow = {
  item: string;
  basis: string;
  capLabel: string;
  sourceNote: string;
};

export type ScenarioOutlookRow = {
  scenarioCode: "CONSERVATIVE" | "BASE" | "AGGRESSIVE";
  scenarioLabel: string;
  assumption: string;
  dsOpiRange: string;
};

export type CheckpointItem = {
  order: number;
  text: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const SQE_META = {
  slug: "samsung-q2-earnings-bonus-outlook-2026",
  title: "삼성전자 2분기 영업이익 89.4조 — 역대 최대, 하반기 성과급 전망",
  seoTitle: "삼성전자 2분기 영업이익 89조 2026 | 역대최대, 하반기 성과급은",
  seoDescription:
    "삼성전자 2026년 2분기 잠정실적 매출 171조·영업이익 89.4조(역대 최대) 발표. 확정실적(7/31) 전 DS부문 전망과 하반기 OPI 성과급 변화를 분석합니다.",
  description: "매출 171조·영업이익 89.4조원, 7월 7일 발표된 2분기 잠정실적부터 7월 31일 확정실적까지 하반기 OPI 전망을 한눈에 정리합니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "2분기 잠정실적(매출 171조·영업이익 89.4조원)은 2026년 7월 7일 삼성전자 공식 발표 기준입니다. 다만 이 수치는 연결 기준이며 DS(반도체)부문 등 사업부문별 영업이익은 7월 31일 확정실적에서 공개됩니다. 하반기 성과급 전망은 그 전까지 컨센서스·시나리오 기준 추정이며 공식 확정 발표가 아닙니다. 실적 전망 수치는 기존 '삼성전자 DS 성과급 계산기' 데이터와 동일 출처를 그대로 인용하며, 서로 다른 시점 자료를 곱해 새 숫자를 만들지 않습니다.",
};

export const SQE_EARNINGS_CALENDAR: EarningsCalendarItem[] = [
  {
    date: "2026-07-07",
    dateLabel: "2026년 7월 7일",
    event: "2분기 잠정실적 발표 (완료)",
    scope: "매출 171조원·영업이익 89.4조원 — 역대 최대 (사업부문별 실적 미공개)",
    status: "완료",
  },
  {
    date: "2026-07-31",
    dateLabel: "2026년 7월 31일",
    event: "2분기 확정실적 발표",
    scope: "DS·MX·CSS 등 사업부문별 영업이익 공개 — OPI 추정 근거 확정",
    status: "예정",
  },
  {
    date: "2026-10-08",
    dateLabel: "2026년 10월 8일(참고)",
    event: "3분기 잠정실적 발표",
    scope: "연결 기준 (참고용, 확정 일정 아님)",
    status: "미정",
  },
];

// 2026-07-07 삼성전자 공식 발표 기준 (2분기 잠정실적), 1분기는 기존 확정 공시 기준
export const SQE_PROGRESS_CARDS: ProgressCard[] = [
  {
    label: "2026 연간 컨센서스 영업이익",
    value: "약 297.5조원",
    note: "에프앤가이드 컨센서스 보도 기준 (operatingProfitScenarios.FY2026_CONSENSUS 재사용)",
    isPlaceholder: false,
  },
  {
    label: "1분기 확정실적",
    value: "매출 133.9조 · 영업이익 57.2조원",
    note: "2026년 1분기 확정 공시 기준",
    isPlaceholder: false,
  },
  {
    label: "2분기 잠정실적",
    value: "매출 171조 · 영업이익 89.4조원",
    note: "역대 최대, 전분기 대비 영업이익 +56.2%, 전년 동기 대비 약 19배 (2026-07-07 발표)",
    isPlaceholder: false,
  },
  {
    label: "상반기 누적 진행률",
    value: "영업이익 146.6조원 (컨센서스의 약 49%)",
    note: "연간 컨센서스 297.5조원 대비 상반기에 이미 49% 도달 — 2분기만 유지돼도 연간 컨센서스 상회 가능",
    isPlaceholder: false,
  },
];

export const SQE_OPI_STRUCTURE: OpiStructureRow[] = [
  {
    item: "OPI (초과이익분배금)",
    basis: "사업부문별 연간 영업이익이 목표를 초과할 때 기준급 대비 지급",
    capLabel: "최대 50% 한도 (DS 2026 실제 참고 47%)",
    sourceNote: "samsungCompensation.ts > divisions 재사용",
  },
  {
    item: "TAI (목표달성장려금)",
    basis: "반기별 매출·영업이익 목표 초과 달성 시 지급",
    capLabel: "최대 100% (상하반기 별도 산정)",
    sourceNote: "samsungCompensation.ts > scenarioPresets 재사용",
  },
];

// scenarioRates.DS 값을 그대로 라벨링해서 보여준다 (새 숫자 생성 금지)
export const SQE_SCENARIO_OUTLOOK: ScenarioOutlookRow[] = [
  { scenarioCode: "CONSERVATIVE", scenarioLabel: "보수적", assumption: "반도체 업황 정체", dsOpiRange: "30% 내외" },
  { scenarioCode: "BASE", scenarioLabel: "기준", assumption: "컨센서스 수준 실적", dsOpiRange: "40~47%" },
  { scenarioCode: "AGGRESSIVE", scenarioLabel: "공격적", assumption: "HBM·파운드리 동반 개선", dsOpiRange: "50% 근접" },
];

export const SQE_CHECKPOINTS: CheckpointItem[] = [
  { order: 1, text: "(완료) 7/7 잠정실적 영업이익 89.4조원으로 컨센서스 페이스 크게 상회 — 상반기 누적만 컨센서스의 약 49%" },
  { order: 2, text: "7/31 확정실적에서 DS부문 영업이익 실제 비중과 규모" },
  { order: 3, text: "HBM3E 인증·공급 진행 상황 (파운드리 적자 축소 여부)" },
  { order: 4, text: "하반기 TAI 지급 기준일 공지 시점" },
  { order: 5, text: "노사협의체 성과급 관련 논의 일정" },
];

export const SQE_PRECEDENT_NOTE =
  "2026년 5월 잠정합의안(OPI 1.5% + DS 특별경영성과급 10.5% = 최대 12%)은 2025년 실적을 기준으로 도출된 전례입니다. 하반기도 '실적 확정 → 노사 협의 → 지급률 확정' 흐름을 따를 가능성이 높지만, 지금은 방향성만 가늠할 수 있는 단계입니다.";

export const SQE_FAQ: FaqItem[] = [
  { question: "2분기 실적은 언제 발표되나요?", answer: "잠정실적은 7월 7일 발표됐습니다(매출 171조·영업이익 89.4조원, 역대 최대). 사업부문별 확정실적은 7월 31일 발표 예정입니다." },
  { question: "2분기 영업이익 89.4조원은 어느 정도 수준인가요?", answer: "역대 최대 분기 실적이며, 직전분기(57.2조원) 대비 56.2% 증가, 전년 동기(4.68조원) 대비 약 19배에 달합니다. 상반기 누적 영업이익만으로 이미 2026년 연간 컨센서스(297.5조원)의 약 49%에 도달했습니다." },
  { question: "잠정실적과 확정실적은 뭐가 다른가요?", answer: "잠정실적은 연결 매출·영업이익만 공개하고, 확정실적에서 DS·MX 등 사업부문별 영업이익이 공개됩니다. 2분기 잠정실적에는 아직 DS부문 세부 수치가 없습니다." },
  { question: "실적이 좋으면 성과급이 바로 오르나요?", answer: "아닙니다. 연간 실적 확정 후 익년 초에 확정 지급되는 것이 원칙이며, 반기 TAI는 상대적으로 빠르게 반영됩니다. 다만 상반기 실적이 컨센서스를 크게 상회하고 있어 하반기 OPI 전망에 긍정적 신호로 해석됩니다." },
  { question: "DS부문 실적이 왜 중요한가요?", answer: "DS(반도체)부문 영업이익이 삼성전자 전체 성과급 재원의 핵심 변수이기 때문입니다. 2분기 실적 개선이 반도체 업황 회복과 관련이 깊다는 분석이 나오는 만큼, 7/31 확정실적에서 DS부문 비중을 확인하는 것이 중요합니다." },
  { question: "하반기 확정 성과급은 언제 알 수 있나요?", answer: "통상 다음 해 1월경 공식 지급률이 공지됩니다." },
];

export const SQE_SEO_INTRO = [
  "삼성전자가 2026년 7월 7일 2분기 잠정실적을 발표했습니다. 매출 171조원, 영업이익 89조4000억원으로 분기 기준 역대 최대 실적입니다. 직전분기(57조2300억원) 대비 56.2% 늘었고, 전년 동기(4조6800억원)와 비교하면 약 19배에 달하는 규모입니다. DS(반도체)부문 영업이익은 OPI 산정의 핵심 변수라, 이 정도 실적 개선이면 재직자들의 '성과급이 얼마나 늘까' 관심이 자연스럽게 커집니다.",
  "다만 잠정실적과 확정실적은 공개 범위가 다릅니다. 이번 2분기 잠정실적은 연결 매출·영업이익만 공개했고, DS·MX·CSS 등 사업부문별 영업이익은 7월 31일 확정실적에서만 확인할 수 있습니다. 성과급의 실질적 근거가 되는 숫자는 확정실적이 나와야 알 수 있다는 뜻이라, 지금 시점에서 성과급 규모를 단정하는 것은 이릅니다.",
  "2026년 삼성전자 연간 영업이익 컨센서스는 에프앤가이드 기준 약 297.5조원이었습니다. 그런데 상반기 누적 영업이익만 벌써 146조6300억원으로, 연간 컨센서스의 약 49%에 도달했습니다. 2분기 페이스(89.4조원)가 하반기에도 유지된다면 연간 실적이 컨센서스를 상당폭 넘어설 가능성이 있습니다. DS부문은 2026년 실제 참고 지급률이 47%로 사업부 중 두 번째로 높은 수준이라, 반도체 업황 회복 속도가 재직자 체감에 직접 연결됩니다.",
  "OPI(초과이익분배금)는 사업부문 영업이익이 목표치를 초과할 때 기준급 대비 최대 50% 한도로 지급되고, TAI(목표달성장려금)는 반기 매출·영업이익 목표 달성 여부에 따라 상하반기 별도로 산정됩니다. 두 제도 모두 사업부문 실적이 확정돼야 정확한 지급률을 계산할 수 있어, 지금 시점의 하반기 전망은 보수적·기준·공격적 세 시나리오로 나눠 방향성만 제시합니다.",
  "2026년 5월에는 OPI 1.5%와 DS 특별경영성과급 10.5%를 합산한 최대 12% 규모의 잠정합의안이 나온 전례가 있습니다. 이 합의는 2025년 실적을 기준으로 도출된 결과라, 하반기에도 '실적 확정 → 노사 협의 → 지급률 확정' 순서를 따를 가능성이 있습니다. 2분기 실적이 워낙 좋게 나온 만큼 기대감은 커졌지만, DS부문 세부 수치가 확인되는 7/31 전까지는 체크포인트 중심으로 상황을 지켜보는 것이 현실적입니다.",
];

export const SQE_SEO_CRITERIA = [
  "2분기 잠정실적(7월 7일 발표): 매출 171조원·영업이익 89.4조원, 분기 기준 역대 최대",
  "상반기 누적 영업이익 146.6조원 — 2026년 연간 컨센서스(297.5조원)의 약 49%",
  "2분기 확정실적: 7월 31일, DS부문 등 사업부문별 영업이익 공개",
  "OPI는 사업부문 초과이익 발생 시 기준급 대비 최대 50% 한도 지급 (DS 2026 실제 참고 47%)",
  "모든 하반기 전망 수치는 컨센서스·시나리오 기준 추정이며 공식 발표가 아님",
];

export const SQE_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/samsung-bonus/", label: "삼성전자 DS 성과급 계산기", description: "내 직급·사업부 기준 예상 성과급을 바로 계산합니다." },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 실수령액 계산기", description: "성과급에서 세금을 제외한 실수령액을 확인합니다." },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026", description: "2026~2028년 연간 실적·성과급 시나리오를 두 회사로 비교합니다." },
  { href: "/reports/samsung-ds-bonus-calculation-guide/", label: "삼성전자 DS 성과급 완전 가이드", description: "OPI·TAI 산정 구조를 처음부터 자세히 설명합니다." },
  { href: "/reports/samsung-skhynix-800t-investment-comparison-2026/", label: "삼성전자·SK하이닉스 800조 투자 비교", description: "반도체 메가 투자가 장기 실적·성과급에 미칠 영향을 다룹니다." },
];
