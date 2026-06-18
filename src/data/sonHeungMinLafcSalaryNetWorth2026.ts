export type SalaryEvidenceBadge = "보도 기준" | "추정" | "세후 시뮬레이션" | "재산 추정";
export type PlayerCompareBadge = "보도 기준" | "추정" | "확인 필요";
export type NetWorthScenarioId = "conservative" | "base" | "optimistic";

export interface SalaryExchangeRate {
  code: "USD";
  label: string;
  krwRate: number;
  updatedAt: string;
}

export interface NetRateRange {
  low: number;
  high: number;
  label: string;
  description: string;
}

export interface SonSalaryProfile {
  id: "son-heung-min";
  nameKo: string;
  nameEn: string;
  club: string;
  league: string;
  position: string;
  contractPeriodLabel: string;
  annualSalaryUsd: number;
  sourceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
  sourceUrl: string;
  dataNote: string;
}

export interface SalaryBreakdownItem {
  id: string;
  label: string;
  grossKrw: number;
  netLowKrw: number;
  netHighKrw: number;
  description: string;
}

export interface CareerEarningPeriod {
  id: string;
  label: string;
  years: string;
  club: string;
  grossKrwLow: number;
  grossKrwHigh: number;
  note: string;
}

export interface NetWorthScenario {
  id: NetWorthScenarioId;
  label: string;
  rangeLowKrw: number;
  rangeHighKrw: number;
  tone: "safe" | "base" | "high";
  assumptions: string[];
}

export interface RelatedPlayerSalary {
  id: string;
  nameKo: string;
  club: string;
  league: string;
  annualSalaryKrw: number;
  sourceBadge: PlayerCompareBadge;
  href: string;
  note: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const SHMS_META = {
  slug: "son-heung-min-lafc-salary-net-worth-2026",
  title: "손흥민 연봉 2026｜LAFC 주급·세후 실수령액·재산 추정",
  seoTitle: "손흥민 연봉 2026 | LAFC 주급·세후 실수령액·재산 추정",
  seoDescription:
    "손흥민의 2026년 LAFC 보도 기준 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산하고 토트넘 시절 누적 연봉과 광고 수입을 포함한 재산 추정 범위를 정리합니다.",
  description:
    "손흥민의 LAFC 보도 기준 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산하고 커리어 누적 연봉과 재산 추정 범위를 함께 정리합니다.",
  updatedAt: "2026-06-18",
  dataNote:
    "손흥민 연봉은 계약서 원문이 아니라 MLS 보수 보도 기준을 원화로 단순 환산한 값입니다. 세후 실수령액과 재산은 공식 공개값이 아니라 시뮬레이션 및 추정 범위입니다.",
};

export const SHMS_EXCHANGE_RATE: SalaryExchangeRate = {
  code: "USD",
  label: "달러",
  krwRate: 1375,
  updatedAt: "2026-06-18",
};

export const SHMS_PLAYER: SonSalaryProfile = {
  id: "son-heung-min",
  nameKo: "손흥민",
  nameEn: "Son Heung-min",
  club: "LAFC",
  league: "MLS",
  position: "FW",
  contractPeriodLabel: "2026년 MLS 보수 보도 기준 LAFC 소속",
  annualSalaryUsd: 11200000,
  sourceBadge: "보도 기준",
  sourceLabel: "MLS 2026 보수 보도",
  sourceUrl: "https://www.theguardian.com/football/2026/may/12/mls-2026-salary-release-takeaways",
  dataNote: "구단 계약서 원문이 아니므로 보도 기준값으로만 사용합니다.",
};

export const SHMS_NET_RATE_RANGE: NetRateRange = {
  low: 0.52,
  high: 0.6,
  label: "세후 52~60% 단순 시뮬레이션",
  description:
    "미국 연방세, 캘리포니아 주세, 고소득자 부담, 계약 구조를 단순화한 참고 범위입니다. 실제 실수령액은 세무 처리와 보너스 구조에 따라 달라질 수 있습니다.",
};

export const SHMS_CAREER_EARNING_PERIODS: CareerEarningPeriod[] = [
  {
    id: "hamburg",
    label: "함부르크",
    years: "2010~2013",
    club: "함부르크 SV",
    grossKrwLow: 1000000000,
    grossKrwHigh: 3000000000,
    note: "분데스리가 데뷔 초기 유망주 연봉 구간입니다.",
  },
  {
    id: "leverkusen",
    label: "레버쿠젠",
    years: "2013~2015",
    club: "바이어 레버쿠젠",
    grossKrwLow: 5000000000,
    grossKrwHigh: 10000000000,
    note: "분데스리가 주전급으로 성장한 구간입니다.",
  },
  {
    id: "tottenham-early",
    label: "토트넘 초기",
    years: "2015~2018",
    club: "토트넘 홋스퍼",
    grossKrwLow: 20000000000,
    grossKrwHigh: 35000000000,
    note: "EPL 적응과 주전 진입 시기의 추정 연봉 구간입니다.",
  },
  {
    id: "tottenham-prime",
    label: "토트넘 전성기",
    years: "2018~2025",
    club: "토트넘 홋스퍼",
    grossKrwLow: 75000000000,
    grossKrwHigh: 100000000000,
    note: "장기계약, 득점왕, 주장 역할이 반영된 고액 연봉 구간입니다.",
  },
  {
    id: "lafc",
    label: "LAFC",
    years: "2025~2026",
    club: "LAFC",
    grossKrwLow: 15000000000,
    grossKrwHigh: 25000000000,
    note: "MLS 보도 기준 고액 연봉 구간입니다.",
  },
];

export const SHMS_NET_WORTH_SCENARIOS: NetWorthScenario[] = [
  {
    id: "conservative",
    label: "보수적 추정",
    rangeLowKrw: 60000000000,
    rangeHighKrw: 80000000000,
    tone: "safe",
    assumptions: [
      "세후 연봉 잔존율을 낮게 봅니다.",
      "광고·스폰서 수입은 일부만 반영합니다.",
      "세금, 에이전트 비용, 생활비, 기부, 투자 손익을 보수적으로 차감합니다.",
    ],
  },
  {
    id: "base",
    label: "중간 추정",
    rangeLowKrw: 80000000000,
    rangeHighKrw: 110000000000,
    tone: "base",
    assumptions: [
      "토트넘 장기 고액 연봉과 LAFC 보도 기준 연봉을 함께 반영합니다.",
      "글로벌 광고 모델 활동의 일부 잔존액을 반영합니다.",
      "공개되지 않은 투자 손익은 중립적으로 봅니다.",
    ],
  },
  {
    id: "optimistic",
    label: "공격적 추정",
    rangeLowKrw: 110000000000,
    rangeHighKrw: 150000000000,
    tone: "high",
    assumptions: [
      "광고·스폰서·초상권 수입을 폭넓게 반영합니다.",
      "투자와 자산 운용 성과가 우호적이었다고 가정합니다.",
      "실제 비공개 비용과 세무 구조에 따라 크게 달라질 수 있습니다.",
    ],
  },
];

export const SHMS_RELATED_PLAYER_SALARIES: RelatedPlayerSalary[] = [
  {
    id: "kim-min-jae",
    nameKo: "김민재",
    club: "바이에른 뮌헨",
    league: "분데스리가",
    annualSalaryKrw: 22275000000,
    sourceBadge: "보도 기준",
    href: "/reports/korea-worldcup-squad-salary-2026/",
    note: "기존 대한민국 월드컵 대표팀 연봉 순위 리포트와 같은 기준입니다.",
  },
  {
    id: "son-heung-min",
    nameKo: "손흥민",
    club: "LAFC",
    league: "MLS",
    annualSalaryKrw: 15400000000,
    sourceBadge: "보도 기준",
    href: "/reports/son-heung-min-lafc-salary-net-worth-2026/",
    note: "MLS 보수 보도를 원화로 단순 환산한 값입니다.",
  },
  {
    id: "lee-kang-in",
    nameKo: "이강인",
    club: "파리 생제르맹",
    league: "리그1",
    annualSalaryKrw: 5940000000,
    sourceBadge: "추정",
    href: "/reports/lee-kang-in-psg-salary-2026/",
    note: "비공식 샐러리 DB·언론 추정치를 원화로 단순 환산한 값입니다.",
  },
];

export const SHMS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/lee-kang-in-psg-salary-2026/",
    label: "이강인 연봉 2026｜PSG 주급·세후 실수령액",
    description: "이강인의 PSG 추정 연봉을 주급, 월급, 세후 실수령액으로 환산합니다.",
  },
  {
    href: "/reports/korea-worldcup-squad-salary-2026/",
    label: "2026 대한민국 월드컵 대표팀 연봉 순위",
    description: "손흥민, 김민재, 이강인 등 대표팀 주요 선수 연봉 비교",
  },
  {
    href: "/reports/korea-football-legends-salary-comparison-2026/",
    label: "손흥민·김민재·이강인 vs 역대 레전드 연봉",
    description: "현재 대표팀 핵심 3인과 박지성·차범근 등 레전드 비교",
  },
  {
    href: "/reports/worldcup-squad-salary-total-comparison-2026/",
    label: "월드컵 대표팀 연봉 총액 비교",
    description: "한국 대표팀 스쿼드 연봉 총액과 주요 강팀 비교",
  },
  {
    href: "/tools/worldcup-prize-money-calculator/",
    label: "월드컵 상금 계산기",
    description: "성적별 상금과 선수 배분액을 시뮬레이션",
  },
];

export const SHMS_SEO_INTRO = [
  "손흥민 연봉은 LAFC와 MLS가 공개한 계약서 원문이 아니라 2026년 MLS 보수 보도를 바탕으로 확인할 수 있습니다. 따라서 이 페이지에서는 숫자를 확정값이 아니라 보도 기준 연봉, 세전 환산, 세후 시뮬레이션으로 구분해 표시합니다.",
  "기본 계산은 손흥민의 LAFC 보도 기준 연봉 1,120만 달러와 1달러 1,375원 환율을 적용합니다. 이 기준이면 원화 연봉은 약 154.0억 원, 월급은 약 12.83억 원, 주급은 약 2.96억 원으로 환산됩니다.",
  "세후 실수령액은 미국 연방세, 캘리포니아 주세, 계약 구조, 보너스, 초상권 배분에 따라 달라질 수 있습니다. 이 페이지는 단정값 대신 세전 금액의 52~60%를 세후 범위로 보는 단순 시뮬레이션을 제공합니다.",
  "손흥민이 그동안 벌었던 돈은 함부르크, 레버쿠젠, 토트넘, LAFC 구간별 연봉을 넓은 범위로 합산한 추정 모델입니다. 실제 계약 세부와 보너스 구조가 모두 공개되어 있지 않으므로 커리어 누적 연봉도 공식값처럼 보면 안 됩니다.",
  "손흥민 재산은 공식 공개 자료가 없기 때문에 정확한 숫자를 알 수 없습니다. 이 페이지는 누적 세후 연봉, 광고·스폰서 수입, 투자·부동산 가능성, 세금과 에이전트 비용을 고려한 시나리오별 추정 범위만 제공합니다.",
];

export const SHMS_SEO_CRITERIA = [
  "손흥민 연봉은 MLS 보수 보도 기준이며 계약서 원문이 아닙니다.",
  "주급·월급·일급은 보도 기준 연봉을 기간 단위로 나눈 단순 환산입니다.",
  "세후 실수령액은 미국·캘리포니아 세제와 계약 구조를 단순화한 52~60% 범위입니다.",
  "재산 추정은 공식 재산이 아니라 누적 연봉과 광고 수입을 반영한 시나리오입니다.",
  "김민재·이강인과의 비교는 계약 규모 비교이며 선수 가치 순위가 아닙니다.",
];

export const SHMS_FAQ: FaqItem[] = [
  {
    question: "손흥민 연봉은 공식 자료인가요?",
    answer:
      "계약서 원문이 아니라 MLS 2026 보수 보도를 바탕으로 한 보도 기준 금액입니다. 따라서 페이지 전체에서 공식 확정값이 아닌 보도 기준 연봉으로 표시합니다.",
  },
  {
    question: "손흥민 LAFC 주급은 얼마인가요?",
    answer:
      "연봉 1,120만 달러와 1달러 1,375원 환율을 적용하면 세전 주급은 약 2.96억 원입니다. 환율과 보도 기준이 달라지면 금액도 달라질 수 있습니다.",
  },
  {
    question: "손흥민 세후 실수령액은 얼마인가요?",
    answer:
      "미국·캘리포니아 고소득자 세금과 계약 구조를 단순화해 세전 금액의 52~60%를 세후 범위로 표시합니다. 이 기준이면 세후 연봉은 약 80.1억~92.4억 원입니다.",
  },
  {
    question: "손흥민 재산은 얼마로 추정되나요?",
    answer:
      "공식 공개 재산은 없습니다. 이 페이지는 누적 세후 연봉, 광고·스폰서 수입, 투자 가능성, 비용을 고려해 보수적 600억~800억 원, 중간 800억~1,100억 원, 공격적 1,100억~1,500억 원 시나리오로만 제시합니다.",
  },
  {
    question: "손흥민이 토트넘에서 번 돈은 얼마나 되나요?",
    answer:
      "토트넘 시절 전체 계약 세부가 모두 공개되어 있지 않기 때문에 정확한 합계는 알 수 없습니다. 이 페이지에서는 토트넘 초기와 전성기 구간을 나누어 커리어 누적 연봉 추정에 반영합니다.",
  },
  {
    question: "광고 수입도 포함됐나요?",
    answer:
      "연봉 환산표에는 광고 수입을 포함하지 않습니다. 광고 수입은 세부 계약이 비공개이므로 재산 추정 시나리오의 보정 항목으로만 반영합니다.",
  },
  {
    question: "손흥민과 김민재 중 누가 연봉이 더 높나요?",
    answer:
      "같은 내부 기준에서는 김민재의 보도 기준 연봉이 손흥민의 LAFC 보도 기준 연봉보다 높게 표시됩니다. 다만 리그, 계약 시점, 세금, 보너스 구조가 다르므로 단순 선수 가치 순위로 해석하면 안 됩니다.",
  },
  {
    question: "90분 환산 금액은 실제 경기 수당인가요?",
    answer:
      "아닙니다. 연봉을 시간 단위로 나눈 뒤 90분에 해당하는 금액을 계산한 체감용 지표입니다. 실제 경기 수당, 승리 수당, 보너스와는 다릅니다.",
  },
];

export const formatKrw = (value: number) => {
  if (value >= 100000000) {
    const eok = value / 100000000;
    return `약 ${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억 원`;
  }
  if (value >= 10000) {
    return `약 ${Math.round(value / 10000).toLocaleString()}만 원`;
  }
  return `약 ${Math.round(value).toLocaleString()}원`;
};

export const formatKrwRange = (low: number, high: number) =>
  `${formatKrw(low)}~${formatKrw(high).replace(/^약 /, "")}`;

export const calcSalaryBreakdown = (
  annualSalaryUsd: number,
  usdRate: number,
  netLowRate: number,
  netHighRate: number,
): SalaryBreakdownItem[] => {
  const annual = annualSalaryUsd * usdRate;
  const items = [
    { id: "annual", label: "연봉", value: annual, description: "보도 기준 세전 연봉을 원화로 환산" },
    { id: "monthly", label: "월급", value: annual / 12, description: "연봉을 12개월로 나눈 값" },
    { id: "weekly", label: "주급", value: annual / 52, description: "연봉을 52주로 나눈 값" },
    { id: "daily", label: "일급", value: annual / 365, description: "연봉을 365일로 나눈 값" },
    { id: "hourly", label: "시간급", value: annual / 365 / 24, description: "연봉을 시간 단위로 환산한 값" },
    { id: "ninety", label: "90분 환산", value: (annual / 365 / 24) * 1.5, description: "축구 경기 90분에 맞춘 체감용 환산" },
  ];

  return items.map((item) => ({
    id: item.id,
    label: item.label,
    grossKrw: item.value,
    netLowKrw: item.value * netLowRate,
    netHighKrw: item.value * netHighRate,
    description: item.description,
  }));
};
