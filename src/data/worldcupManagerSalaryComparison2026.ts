export type CurrencyCode = "KRW" | "USD" | "EUR" | "GBP";
export type Confederation = "AFC" | "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "OFC";
export type SalaryEvidenceBadge = "공식" | "보도 기준" | "보도 범위" | "추정" | "확인 필요" | "미공개";

export interface ExchangeRatePreset {
  code: CurrencyCode;
  label: string;
  krwRate: number;
  sourceLabel: string;
  updatedAt: string;
}

export interface ManagerSalaryRecord {
  id: string;
  countryKo: string;
  countryEn: string;
  managerNameKo: string;
  managerNameEn: string;
  confederation: Confederation;
  isKoreaManager: boolean;
  isCurrentCoach: boolean;
  periodLabel?: string;
  localSalaryLabel: string;
  annualSalaryLocal: number | null;
  annualSalaryLocalMin?: number;
  annualSalaryLocalMax?: number;
  currency: CurrencyCode;
  annualSalaryKrw: number | null;
  annualSalaryKrwMin?: number;
  annualSalaryKrwMax?: number;
  evidenceBadge: SalaryEvidenceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  sourceDate?: string;
  contractPeriodLabel?: string;
  fifaRank?: number;
  recentMatches?: number;
  recentWins?: number;
  recentDraws?: number;
  notes: string[];
  includeInDefaultRanking: boolean;
  isFeatured: boolean;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description?: string;
}

export const WMCS_META = {
  slug: "worldcup-manager-salary-comparison-2026",
  title: "월드컵 감독 연봉 비교 2026",
  seoTitle: "월드컵 감독 연봉 비교 2026 | 홍명보 감독 연봉은 몇 위권일까",
  seoDescription:
    "홍명보 감독을 포함해 2026 월드컵 주요 국가대표 감독 연봉을 원화 기준으로 비교합니다. 공식·보도·추정 배지를 나누고, 경기당 비용과 승점당 비용까지 함께 계산합니다.",
  description:
    "홍명보 체제와 한국 전임 감독, 주요 월드컵 국가대표 감독 연봉을 같은 원화 기준으로 비교하는 스포츠 연봉 리포트입니다.",
  updatedAt: "2026-07-01",
  dataNote:
    "감독 연봉은 국가협회가 공식 공개하지 않는 경우가 많습니다. 이 페이지는 공식 발표, 주요 언론 보도, 공개 데이터베이스를 구분해 표시하며 비공개 계약은 추정값 또는 확인 필요 값으로만 다룹니다.",
};

export const WMCS_MANAGER_CONTEXT = {
  koreaFocusManagerId: "hong-myung-bo",
  isCurrentCoach: false,
  currentStatusLabel: "최신 거취 확인 필요",
  statusNote:
    "홍명보 감독 거취는 구현·발행 직전 대한축구협회 공지와 주요 통신사 보도를 재확인해 현직/전임 표현을 결정해야 합니다.",
};

export const WMCS_EXCHANGE_RATES: ExchangeRatePreset[] = [
  { code: "USD", label: "달러", krwRate: 1380, sourceLabel: "설계 기준 환율", updatedAt: "2026-07-01" },
  { code: "EUR", label: "유로", krwRate: 1600, sourceLabel: "설계 기준 환율", updatedAt: "2026-07-01" },
  { code: "GBP", label: "파운드", krwRate: 1870, sourceLabel: "설계 기준 환율", updatedAt: "2026-07-01" },
  { code: "KRW", label: "원", krwRate: 1, sourceLabel: "원화", updatedAt: "2026-07-01" },
];

export const WMCS_MANAGERS: ManagerSalaryRecord[] = [
  {
    id: "hong-myung-bo",
    countryKo: "대한민국",
    countryEn: "Korea Republic",
    managerNameKo: "홍명보",
    managerNameEn: "Hong Myung-bo",
    confederation: "AFC",
    isKoreaManager: true,
    isCurrentCoach: false,
    periodLabel: "2024~2026 체제",
    localSalaryLabel: "약 20억원",
    annualSalaryLocal: 2000000000,
    currency: "KRW",
    annualSalaryKrw: 2000000000,
    evidenceBadge: "추정",
    sourceLabel: "언론 보도·업계 추정 기준, 공식 확인 필요",
    contractPeriodLabel: "대표팀 감독 계약 조건은 발행 직전 재확인 필요",
    fifaRank: 23,
    recentMatches: 16,
    recentWins: 9,
    recentDraws: 4,
    notes: [
      "홍명보 감독 연봉은 약 20억원 안팎으로 알려진 추정치를 사용하되, KFA 공식 공개값처럼 단정하지 않습니다.",
      "클린스만 약 29억원, 벤투 약 18억원 보도값과 함께 한국 대표팀 감독직의 시장 구간을 비교합니다.",
    ],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "jurgen-klinsmann",
    countryKo: "대한민국",
    countryEn: "Korea Republic",
    managerNameKo: "위르겐 클린스만",
    managerNameEn: "Jurgen Klinsmann",
    confederation: "AFC",
    isKoreaManager: true,
    isCurrentCoach: false,
    periodLabel: "2023~2024",
    localSalaryLabel: "약 29억원",
    annualSalaryLocal: 2900000000,
    currency: "KRW",
    annualSalaryKrw: 2900000000,
    evidenceBadge: "보도 기준",
    sourceLabel: "국내 언론 보도 기준",
    sourceDate: "2024",
    contractPeriodLabel: "대한민국 축구대표팀 전임 감독",
    recentMatches: 17,
    recentWins: 8,
    recentDraws: 6,
    notes: ["국내 보도에서 자주 인용된 추정 연봉 구간입니다.", "세전/세후와 보너스는 구분되지 않은 보도 기준입니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "paulo-bento",
    countryKo: "대한민국",
    countryEn: "Korea Republic",
    managerNameKo: "파울루 벤투",
    managerNameEn: "Paulo Bento",
    confederation: "AFC",
    isKoreaManager: true,
    isCurrentCoach: false,
    periodLabel: "2018~2022",
    localSalaryLabel: "약 18억원",
    annualSalaryLocal: 1800000000,
    currency: "KRW",
    annualSalaryKrw: 1800000000,
    evidenceBadge: "보도 기준",
    sourceLabel: "국내 언론 보도 기준",
    sourceDate: "2022",
    contractPeriodLabel: "카타르 월드컵 사이클 대표팀 감독",
    recentMatches: 20,
    recentWins: 12,
    recentDraws: 4,
    notes: ["한국 대표팀 전임 감독 시장 구간을 이해하기 위한 비교값입니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "carlo-ancelotti",
    countryKo: "브라질",
    countryEn: "Brazil",
    managerNameKo: "카를로 안첼로티",
    managerNameEn: "Carlo Ancelotti",
    confederation: "CONMEBOL",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 €10,000,000",
    annualSalaryLocal: 10000000,
    currency: "EUR",
    annualSalaryKrw: 16000000000,
    evidenceBadge: "보도 기준",
    sourceLabel: "해외 주요 매체 보도 기준",
    sourceDate: "2025~2026",
    contractPeriodLabel: "브라질 대표팀 감독 보도 기준",
    fifaRank: 5,
    recentMatches: 14,
    recentWins: 8,
    recentDraws: 3,
    notes: ["보도 기준으로 월드컵 대표팀 감독 중 최상위권 연봉 구간입니다.", "보너스와 세부 수당은 제외했습니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "julian-nagelsmann",
    countryKo: "독일",
    countryEn: "Germany",
    managerNameKo: "율리안 나겔스만",
    managerNameEn: "Julian Nagelsmann",
    confederation: "UEFA",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 €7,000,000",
    annualSalaryLocal: 7000000,
    currency: "EUR",
    annualSalaryKrw: 11200000000,
    evidenceBadge: "보도 기준",
    sourceLabel: "독일·해외 언론 보도 기준",
    sourceDate: "2024~2026",
    contractPeriodLabel: "독일 대표팀 감독 보도 기준",
    fifaRank: 10,
    recentMatches: 14,
    recentWins: 9,
    recentDraws: 2,
    notes: ["유럽 빅리그 클럽 커리어가 반영된 상위권 감독 연봉 구간입니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "thomas-tuchel",
    countryKo: "잉글랜드",
    countryEn: "England",
    managerNameKo: "토마스 투헬",
    managerNameEn: "Thomas Tuchel",
    confederation: "UEFA",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 £6,000,000~£7,000,000",
    annualSalaryLocal: null,
    annualSalaryLocalMin: 6000000,
    annualSalaryLocalMax: 7000000,
    currency: "GBP",
    annualSalaryKrw: null,
    annualSalaryKrwMin: 11220000000,
    annualSalaryKrwMax: 13090000000,
    evidenceBadge: "보도 범위",
    sourceLabel: "영국 언론 보도 범위",
    sourceDate: "2024~2026",
    contractPeriodLabel: "잉글랜드 대표팀 감독 보도 범위",
    fifaRank: 4,
    recentMatches: 14,
    recentWins: 9,
    recentDraws: 3,
    notes: ["매체별 보도 금액 차이가 있어 범위로 표시합니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "mauricio-pochettino",
    countryKo: "미국",
    countryEn: "United States",
    managerNameKo: "마우리시오 포체티노",
    managerNameEn: "Mauricio Pochettino",
    confederation: "CONCACAF",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 $4,000,000~$6,000,000",
    annualSalaryLocal: null,
    annualSalaryLocalMin: 4000000,
    annualSalaryLocalMax: 6000000,
    currency: "USD",
    annualSalaryKrw: null,
    annualSalaryKrwMin: 5520000000,
    annualSalaryKrwMax: 8280000000,
    evidenceBadge: "보도 범위",
    sourceLabel: "미국·해외 언론 보도 범위",
    sourceDate: "2024~2026",
    contractPeriodLabel: "미국 대표팀 감독 보도 범위",
    fifaRank: 16,
    recentMatches: 16,
    recentWins: 9,
    recentDraws: 2,
    notes: ["2026 북중미 월드컵 개최국 프리미엄과 감독 커리어가 함께 반영된 보도 구간입니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "didier-deschamps",
    countryKo: "프랑스",
    countryEn: "France",
    managerNameKo: "디디에 데샹",
    managerNameEn: "Didier Deschamps",
    confederation: "UEFA",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 €3,800,000",
    annualSalaryLocal: 3800000,
    currency: "EUR",
    annualSalaryKrw: 6080000000,
    evidenceBadge: "추정",
    sourceLabel: "과거 공개 리스트와 해외 보도 기반",
    sourceDate: "2022~2026 재확인 필요",
    contractPeriodLabel: "프랑스 대표팀 감독 추정 구간",
    fifaRank: 2,
    recentMatches: 14,
    recentWins: 9,
    recentDraws: 3,
    notes: ["최신 계약 조건 확인 전까지 추정 배지로 표시합니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "lionel-scaloni",
    countryKo: "아르헨티나",
    countryEn: "Argentina",
    managerNameKo: "리오넬 스칼로니",
    managerNameEn: "Lionel Scaloni",
    confederation: "CONMEBOL",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "약 €2,600,000",
    annualSalaryLocal: 2600000,
    currency: "EUR",
    annualSalaryKrw: 4160000000,
    evidenceBadge: "추정",
    sourceLabel: "과거 공개 리스트와 해외 보도 기반",
    sourceDate: "2022~2026 재확인 필요",
    contractPeriodLabel: "아르헨티나 대표팀 감독 추정 구간",
    fifaRank: 1,
    recentMatches: 14,
    recentWins: 10,
    recentDraws: 2,
    notes: ["월드컵 우승 이후 계약 조건 변화 가능성이 있어 최신 확인이 필요합니다."],
    includeInDefaultRanking: true,
    isFeatured: true,
  },
  {
    id: "hajime-moriyasu",
    countryKo: "일본",
    countryEn: "Japan",
    managerNameKo: "모리야스 하지메",
    managerNameEn: "Hajime Moriyasu",
    confederation: "AFC",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "확인 필요",
    annualSalaryLocal: null,
    currency: "KRW",
    annualSalaryKrw: null,
    evidenceBadge: "확인 필요",
    sourceLabel: "일본축구협회·일본 언론 최신 확인 필요",
    contractPeriodLabel: "AFC 비교 후보",
    fifaRank: 17,
    recentMatches: 16,
    recentWins: 12,
    recentDraws: 2,
    notes: ["한국과 직접 비교 수요가 커서 데이터 확보 우선순위가 높습니다."],
    includeInDefaultRanking: false,
    isFeatured: false,
  },
  {
    id: "roberto-martinez",
    countryKo: "포르투갈",
    countryEn: "Portugal",
    managerNameKo: "로베르토 마르티네스",
    managerNameEn: "Roberto Martinez",
    confederation: "UEFA",
    isKoreaManager: false,
    isCurrentCoach: true,
    localSalaryLabel: "확인 필요",
    annualSalaryLocal: null,
    currency: "EUR",
    annualSalaryKrw: null,
    evidenceBadge: "확인 필요",
    sourceLabel: "포르투갈 축구협회·해외 언론 최신 확인 필요",
    contractPeriodLabel: "포르투갈 대표팀 감독",
    fifaRank: 6,
    recentMatches: 14,
    recentWins: 10,
    recentDraws: 1,
    notes: ["호날두 세대 이후 대표팀 시장가를 보여주는 보완 데이터 후보입니다."],
    includeInDefaultRanking: false,
    isFeatured: false,
  },
];

export const getComparableSalaryKrw = (manager: ManagerSalaryRecord) => {
  if (manager.annualSalaryKrw !== null) return manager.annualSalaryKrw;
  if (manager.annualSalaryKrwMin && manager.annualSalaryKrwMax) {
    return (manager.annualSalaryKrwMin + manager.annualSalaryKrwMax) / 2;
  }
  return null;
};

export const formatKrw = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "미공개";
  if (value >= 100000000) {
    const eok = value / 100000000;
    return `약 ${eok >= 100 ? Math.round(eok).toLocaleString("ko-KR") : eok.toFixed(1)}억원`;
  }
  if (value >= 10000) return `약 ${Math.round(value / 10000).toLocaleString("ko-KR")}만원`;
  return `약 ${Math.round(value).toLocaleString("ko-KR")}원`;
};

export const formatKrwRange = (manager: ManagerSalaryRecord) => {
  if (manager.annualSalaryKrw !== null) return formatKrw(manager.annualSalaryKrw);
  if (manager.annualSalaryKrwMin && manager.annualSalaryKrwMax) {
    return `${formatKrw(manager.annualSalaryKrwMin)}~${formatKrw(manager.annualSalaryKrwMax).replace(/^약 /, "")}`;
  }
  return "미공개";
};

export const calcMonthlyKrw = (manager: ManagerSalaryRecord) => {
  const salary = getComparableSalaryKrw(manager);
  return salary === null ? null : salary / 12;
};

export const calcMatchCostKrw = (manager: ManagerSalaryRecord) => {
  const salary = getComparableSalaryKrw(manager);
  if (salary === null || !manager.recentMatches) return null;
  return salary / manager.recentMatches;
};

export const calcPointCostKrw = (manager: ManagerSalaryRecord) => {
  const salary = getComparableSalaryKrw(manager);
  if (salary === null || manager.recentWins === undefined || manager.recentDraws === undefined) return null;
  const points = manager.recentWins * 3 + manager.recentDraws;
  return points > 0 ? salary / points : null;
};

export const WMCS_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/korea-worldcup-squad-salary-2026/",
    label: "한국 월드컵 대표팀 선수 연봉 비교",
    description: "손흥민·김민재·이강인 등 대표팀 선수 연봉을 함께 비교합니다.",
  },
  {
    href: "/reports/worldcup-squad-salary-total-comparison-2026/",
    label: "월드컵 대표팀 선수단 연봉 총액 비교",
    description: "국가별 선수단 연봉 총액과 한국 대표팀 위치를 확인합니다.",
  },
  {
    href: "/tools/worldcup-prize-money-calculator/",
    label: "월드컵 상금 계산기",
    description: "성적별 월드컵 상금과 선수단 배분 시나리오를 계산합니다.",
  },
  {
    href: "/reports/korea-football-legends-salary-comparison-2026/",
    label: "한국 축구 레전드 연봉 비교",
    description: "손흥민·김민재·이강인과 과거 스타의 연봉을 비교합니다.",
  },
];

export const WMCS_SEO_INTRO = [
  "홍명보 감독 연봉은 약 20억원 안팎으로 알려져 있지만, 대표팀 감독 계약은 세부 금액이 공식 공개되지 않는 경우가 많습니다. 그래서 이 페이지는 20억원을 공식 확정값이 아니라 추정 기준으로 표시하고 데이터 배지를 함께 보여줍니다.",
  "월드컵 감독 연봉은 협회 예산, 감독 커리어, 월드컵 기대 성적, 계약 기간, 보너스 구조가 섞인 결과입니다. 단순히 비싸다거나 싸다고 단정하기보다 같은 환율 기준으로 환산한 구간을 보는 편이 안전합니다.",
  "안첼로티, 나겔스만, 투헬, 포체티노처럼 주요 보도 금액이 있는 감독은 상위권 기준축으로 삼고, 홍명보·클린스만·벤투는 한국 대표팀 감독직의 시장 구간을 이해하는 비교축으로 배치했습니다.",
  "경기당 비용과 승점당 비용은 체감용 보조 지표입니다. 상대 전력, 경기 중요도, 홈·원정 조건, 선수단 부상 같은 요소는 반영하지 않으므로 감독 능력을 평가하는 공식 지표처럼 읽으면 안 됩니다.",
];

export const WMCS_SEO_CRITERIA = [
  "연봉은 세전 기준 보도값으로 해석하고, 세후 실수령액·보너스·주거 지원·차량 지원은 확인되지 않으면 제외합니다.",
  "홍명보 감독 연봉은 약 20억원 추정값으로 표시하되, KFA 공식 공개값이 아닌 추정 배지로 구분합니다.",
  "보도 금액이 매체별로 다르면 단일 확정값이 아니라 보도 범위로 표시합니다.",
  "환율은 설계 기준값이며, 구현·발행 직전 최신 기준으로 갱신해야 합니다.",
  "경기당 비용과 승점당 비용은 단순 환산값이며 전술 성과나 선임 타당성을 단정하지 않습니다.",
];

export const WMCS_FAQ: PageFaqItem[] = [
  {
    question: "홍명보 감독 연봉은 공식 공개된 금액인가요?",
    answer:
      "약 20억원 안팎으로 알려진 추정값을 사용합니다. 다만 KFA 공식 공개값으로 확인된 숫자는 아니므로 공식 연봉처럼 단정하지 않고 추정 배지를 붙입니다.",
  },
  {
    question: "월드컵 감독 연봉 순위는 확정 순위인가요?",
    answer:
      "아닙니다. 국가대표 감독 계약은 비공개가 많아 공개 보도와 확인 가능한 추정값 기준의 비교 순위로 봐야 합니다.",
  },
  {
    question: "클린스만 감독과 벤투 감독 연봉은 어떻게 비교하나요?",
    answer:
      "국내 보도에서 자주 인용된 원화 기준 연봉을 같은 표에 넣고, 데이터 배지를 붙여 비교합니다. 계약 세부 조건과 보너스는 반영하지 않습니다.",
  },
  {
    question: "감독 연봉은 세전인가요, 세후인가요?",
    answer:
      "대부분 보도값은 세전 또는 계약 총액 기준으로 해석해야 합니다. 세후 실수령액, 보너스, 주거 지원, 차량 지원 등은 별도로 확인되지 않으면 제외합니다.",
  },
  {
    question: "안첼로티, 투헬, 나겔스만 연봉은 왜 보도 기준인가요?",
    answer:
      "대표팀 감독 계약은 공식 공시 자료가 드물고 매체별 보도 금액이 다를 수 있습니다. 그래서 공식값이 아닌 경우 보도 기준 또는 보도 범위 배지를 사용합니다.",
  },
  {
    question: "경기당 비용은 어떻게 계산하나요?",
    answer:
      "원화 연봉을 최근 1년 A매치 수로 나눈 단순 환산값입니다. 경기 중요도와 상대 수준은 반영하지 않는 참고 지표입니다.",
  },
  {
    question: "승점당 비용은 감독 능력 지표인가요?",
    answer:
      "아닙니다. 승점당 비용은 비용을 체감하기 위한 보조 지표이며, 감독 능력이나 전술 수준을 평가하는 공식 지표가 아닙니다.",
  },
  {
    question: "환율을 바꾸면 순위도 달라지나요?",
    answer:
      "달러, 유로, 파운드 연봉을 원화로 환산하기 때문에 환율 입력값에 따라 일부 순위와 금액이 달라질 수 있습니다.",
  },
];
