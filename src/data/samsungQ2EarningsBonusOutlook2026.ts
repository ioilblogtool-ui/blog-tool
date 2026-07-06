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
  title: "삼성전자 2분기 실적 vs 성과급 전망 2026",
  seoTitle: "삼성전자 2분기 실적 성과급 전망 2026 | 하반기 OPI 얼마나 늘까",
  seoDescription:
    "삼성전자 2026년 2분기 잠정실적(7/8)·확정실적(7/31) 발표 일정과 DS부문 영업이익 전망을 바탕으로 하반기 OPI 변화를 분석합니다. 성과급 계산기 연동.",
  description: "7월 실적 발표 일정부터 하반기 OPI 전망까지 한눈에 정리하는 리포트입니다.",
  updatedAt: "2026-07-06",
  dataNote:
    "이 페이지의 하반기 성과급 전망은 컨센서스·시나리오 기준 추정이며 공식 확정 발표가 아닙니다. 확정실적(7/31) 발표 이후 실제 DS부문 수치로 업데이트됩니다. 실적 전망 수치는 기존 '삼성전자 DS 성과급 계산기' 데이터와 동일 출처를 그대로 인용하며, 서로 다른 시점 자료를 곱해 새 숫자를 만들지 않습니다.",
};

export const SQE_EARNINGS_CALENDAR: EarningsCalendarItem[] = [
  {
    date: "2026-07-08",
    dateLabel: "2026년 7월 8일",
    event: "2분기 잠정실적 발표",
    scope: "연결 매출·영업이익만 공개 (사업부문별 미공개)",
    status: "예정",
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

// ⚠️ 구현 시점에 1Q26 확정치·2Q26 잠정치가 실제 공시되면 아래 placeholder를 교체할 것.
export const SQE_PROGRESS_CARDS: ProgressCard[] = [
  {
    label: "2026 연간 컨센서스 영업이익",
    value: "약 297.5조원",
    note: "에프앤가이드 컨센서스 보도 기준 (operatingProfitScenarios.FY2026_CONSENSUS 재사용)",
    isPlaceholder: false,
  },
  {
    label: "1분기 확정실적",
    value: "발표 대기",
    note: "구현 시 1Q26 확정 공시 수치로 교체 필요",
    isPlaceholder: true,
  },
  {
    label: "상반기 누적 진행률",
    value: "발표 대기",
    note: "1Q 확정치 + 2Q 잠정치 합산 후 연간 컨센서스 대비 진행률 계산 (구현 시 채움)",
    isPlaceholder: true,
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
  { order: 1, text: "7/8 잠정실적 연결 영업이익이 컨센서스(297.5조 페이스) 상회 여부" },
  { order: 2, text: "7/31 확정실적에서 DS부문 영업이익 실제 비중" },
  { order: 3, text: "HBM3E 인증·공급 진행 상황 (파운드리 적자 축소 여부)" },
  { order: 4, text: "하반기 TAI 지급 기준일 공지 시점" },
  { order: 5, text: "노사협의체 성과급 관련 논의 일정" },
];

export const SQE_PRECEDENT_NOTE =
  "2026년 5월 잠정합의안(OPI 1.5% + DS 특별경영성과급 10.5% = 최대 12%)은 2025년 실적을 기준으로 도출된 전례입니다. 하반기도 '실적 확정 → 노사 협의 → 지급률 확정' 흐름을 따를 가능성이 높지만, 지금은 방향성만 가늠할 수 있는 단계입니다.";

export const SQE_FAQ: FaqItem[] = [
  { question: "2분기 실적은 언제 발표되나요?", answer: "잠정실적은 7월 8일, 사업부문별 확정실적은 7월 31일 발표 예정입니다." },
  { question: "잠정실적과 확정실적은 뭐가 다른가요?", answer: "잠정실적은 연결 매출·영업이익만 공개하고, 확정실적에서 DS·MX 등 사업부문별 영업이익이 공개됩니다." },
  { question: "실적이 좋으면 성과급이 바로 오르나요?", answer: "아닙니다. 연간 실적 확정 후 익년 초에 확정 지급되는 것이 원칙이며, 반기 TAI는 상대적으로 빠르게 반영됩니다." },
  { question: "DS부문 실적이 왜 중요한가요?", answer: "DS(반도체)부문 영업이익이 삼성전자 전체 성과급 재원의 핵심 변수이기 때문입니다." },
  { question: "하반기 확정 성과급은 언제 알 수 있나요?", answer: "통상 다음 해 1월경 공식 지급률이 공지됩니다." },
];

export const SQE_SEO_INTRO = [
  "삼성전자는 2026년 7월 8일 2분기 잠정실적을, 7월 31일 사업부문별 확정실적을 발표합니다. DS(반도체)부문 영업이익은 OPI 산정의 핵심 변수라, 실적 발표 시즌마다 재직자의 '성과급이 오를까' 관심이 집중됩니다.",
];

export const SQE_SEO_CRITERIA = [
  "2분기 잠정실적: 7월 8일, 연결 매출·영업이익만 공개",
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
