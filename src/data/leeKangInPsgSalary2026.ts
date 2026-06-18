export type SalaryEvidenceBadge = "추정" | "공식 프로필" | "보도 기준" | "세후 시뮬레이션";
export type PlayerCompareBadge = "보도 기준" | "추정" | "확인 필요";

export interface SalaryExchangeRate {
  code: "EUR";
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

export interface PlayerSalaryProfile {
  id: "lee-kang-in";
  nameKo: string;
  nameEn: string;
  club: string;
  league: string;
  position: string;
  contractPeriodLabel: string;
  annualSalaryEur: number;
  sourceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
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

export const LKIS_META = {
  slug: "lee-kang-in-psg-salary-2026",
  title: "이강인 연봉 2026｜PSG 주급·세후 실수령액은 얼마일까",
  seoTitle: "이강인 연봉 2026 | PSG 주급·월급·세후 실수령액 추정",
  seoDescription:
    "이강인의 2026년 PSG 추정 연봉을 유로와 원화 기준으로 환산하고, 주급·월급·일급·세후 실수령액을 계산합니다. 손흥민·김민재 연봉과도 비교합니다.",
  description:
    "이강인의 PSG 추정 연봉을 원화, 월급, 주급, 일급, 세후 실수령액으로 환산해 보는 스포츠 연봉 리포트입니다.",
  updatedAt: "2026-06-18",
  dataNote:
    "이강인 연봉은 PSG 공식 계약서가 아닌 비공식 샐러리 DB와 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 보너스, 초상권, 광고 수입, 에이전트 수수료, 실제 세무 구조는 반영하지 않습니다.",
};

export const LKIS_EXCHANGE_RATE: SalaryExchangeRate = {
  code: "EUR",
  label: "유로",
  krwRate: 1485,
  updatedAt: "2026-06-18",
};

export const LKIS_PLAYER: PlayerSalaryProfile = {
  id: "lee-kang-in",
  nameKo: "이강인",
  nameEn: "Lee Kang-in",
  club: "파리 생제르맹(PSG)",
  league: "리그1",
  position: "MF",
  contractPeriodLabel: "2023년 합류, 2028년까지 계약으로 알려짐",
  annualSalaryEur: 4000000,
  sourceBadge: "추정",
  sourceLabel: "비공식 샐러리 DB·언론 추정치",
  dataNote: "구단 공식 공개값이 아니므로 추정값으로만 사용합니다.",
};

export const LKIS_NET_RATE_RANGE: NetRateRange = {
  low: 0.55,
  high: 0.6,
  label: "세후 55~60% 단순 시뮬레이션",
  description:
    "프랑스 고소득자 세금과 사회부담금을 단순화한 참고 범위입니다. 실제 실수령액은 계약 구조와 세무 처리에 따라 달라집니다.",
};

export const LKIS_RELATED_PLAYER_SALARIES: RelatedPlayerSalary[] = [
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

export const LKIS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/son-heung-min-lafc-salary-net-worth-2026/",
    label: "손흥민 연봉 2026｜LAFC 주급·세후 실수령액·재산 추정",
    description: "손흥민의 LAFC 보도 기준 연봉과 재산 추정 범위를 정리합니다.",
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

export const LKIS_SEO_INTRO = [
  "이강인 연봉은 PSG가 공식 계약서로 공개한 금액이 아니라 비공식 샐러리 DB와 언론 추정치를 바탕으로 확인할 수 있습니다. 따라서 이 페이지에서는 숫자를 확정값으로 쓰지 않고 추정 연봉, 세전 환산, 세후 시뮬레이션으로 구분해 표시합니다.",
  "기본 계산은 2026년 6월 기준 이강인의 PSG 추정 연봉 400만 유로와 1유로 1,485원 환율을 적용합니다. 이 기준이면 원화 연봉은 약 59.4억 원, 월급은 약 4.95억 원, 주급은 약 1.14억 원으로 환산됩니다.",
  "세후 실수령액은 프랑스 고소득자 세금과 사회부담금, 계약 구조에 따라 달라집니다. 이 페이지는 단정값 대신 세전 금액의 55~60%를 세후 범위로 보는 단순 시뮬레이션을 제공합니다.",
  "손흥민, 김민재와의 연봉 비교도 함께 제공합니다. 다만 선수 연봉은 리그, 포지션, 계약 시점, 나이, 구단 내 역할, 보너스 구조가 모두 다르기 때문에 선수 가치 순위처럼 해석하면 안 됩니다.",
  "PSG 보너스, 출전 수당, 우승 수당, 초상권, 광고 수입은 별도 계약일 수 있으며 이 페이지의 계산에는 포함하지 않습니다. 실제 총수입은 공개 연봉 추정치보다 높거나 낮을 수 있습니다.",
];

export const LKIS_SEO_CRITERIA = [
  "이강인 연봉은 비공식 추정값이므로 공식 확정값처럼 보지 않습니다.",
  "주급·월급·일급은 추정 연봉을 기간 단위로 나눈 단순 환산입니다.",
  "세후 실수령액은 프랑스 세제와 계약 구조를 단순화한 55~60% 범위로 봅니다.",
  "손흥민·김민재와의 비교는 대표팀 연봉 클러스터 내부 연결을 위한 참고 비교입니다.",
];

export const LKIS_FAQ: FaqItem[] = [
  {
    question: "이강인 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. PSG 공식 계약서가 아니라 비공식 샐러리 DB와 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 페이지 전체에서 추정값으로 표시합니다.",
  },
  {
    question: "이강인 주급은 얼마인가요?",
    answer:
      "기본값인 연봉 400만 유로와 1유로 1,485원 환율을 적용하면 세전 주급은 약 1.14억 원입니다. 환율과 추정 연봉 기준이 달라지면 값도 달라집니다.",
  },
  {
    question: "이강인 세후 실수령액은 얼마인가요?",
    answer:
      "프랑스 고소득자 세금과 사회부담금을 단순화해 세전 금액의 55~60%를 세후 범위로 표시합니다. 실제 실수령액은 계약 구조, 보너스, 초상권, 세무 처리에 따라 달라질 수 있습니다.",
  },
  {
    question: "PSG 보너스와 광고 수입도 포함됐나요?",
    answer:
      "아니요. 이 페이지는 추정 기본 연봉을 기준으로 계산합니다. 우승 보너스, 출전 수당, 초상권, 광고 수입, 에이전트 수수료는 반영하지 않습니다.",
  },
  {
    question: "손흥민·김민재보다 연봉이 낮은 이유는 무엇인가요?",
    answer:
      "연봉은 선수 실력만이 아니라 계약 시점, 리그, 포지션, 나이, 이적료, 구단 내 역할, 시장 상황이 함께 반영됩니다. 단순 연봉 차이를 선수 가치 순위처럼 해석하면 안 됩니다.",
  },
  {
    question: "이강인이 이적하면 이 페이지는 어떻게 업데이트되나요?",
    answer:
      "공식 이적 발표와 새 계약 조건이 확인되면 소속팀, 환율 기준, 추정 연봉 범위를 업데이트합니다. 공식 발표 전 이적설은 확정 정보로 다루지 않습니다.",
  },
  {
    question: "프랑스 세금은 정확히 얼마인가요?",
    answer:
      "선수 계약은 일반 급여와 다르게 보너스, 초상권, 거주자 판정, 세무 구조가 얽힐 수 있습니다. 그래서 이 페이지는 특정 세율을 단정하지 않고 세후 55~60% 범위로만 참고 표시합니다.",
  },
  {
    question: "90분 환산 금액은 실제 경기 수당인가요?",
    answer:
      "아닙니다. 연봉을 시간 단위로 나눈 뒤 90분에 해당하는 금액을 계산한 체감용 지표입니다. 실제 경기 수당이나 승리 수당과는 다릅니다.",
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
  annualSalaryEur: number,
  eurRate: number,
  netLowRate: number,
  netHighRate: number,
): SalaryBreakdownItem[] => {
  const annual = annualSalaryEur * eurRate;
  const items = [
    { id: "annual", label: "연봉", value: annual, description: "추정 세전 연봉을 원화로 환산" },
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
