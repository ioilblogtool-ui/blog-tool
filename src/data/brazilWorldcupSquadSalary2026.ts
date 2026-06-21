export type CurrencyCode = "USD" | "EUR" | "GBP" | "KRW";
export type PlayerPosition = "GK" | "DF" | "MF" | "FW";
export type SalarySourceBadge = "보도 기준" | "추정" | "확인 필요";

export interface ExchangeRatePreset {
  code: CurrencyCode;
  label: string;
  krwRate: number;
}

export interface SquadSalaryPlayer {
  id: string;
  nameKo: string;
  nameEn: string;
  position: PlayerPosition;
  club: string;
  league: string;
  salaryAmount: number;
  salaryCurrency: CurrencyCode;
  sourceBadge: SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note: string;
  isFeatured?: boolean;
}

export interface PageFaqItem {
  question: string;
  answer: string;
}

export const BWS_META = {
  slug: "brazil-worldcup-squad-salary-2026",
  title: "2026 브라질 월드컵 대표팀 연봉 순위",
  seoTitle: "2026 브라질 월드컵 대표팀 연봉 순위 | 비니시우스·호드리고 추정 연봉 비교",
  seoDescription:
    "2026 브라질 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산해 비교합니다.",
  description:
    "비니시우스 주니오르, 호드리고, 카제미루 등 브라질 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화와 체감 단위로 비교합니다.",
  updatedAt: "2026-06-21",
  dataNote:
    "이 리포트의 선수 연봉은 구단 공식 계약서가 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 실제 실수령액, 보너스, 초상권, 광고 수입, 세금은 반영하지 않습니다.",
};

export const BWS_EXCHANGE_RATES: ExchangeRatePreset[] = [
  { code: "USD", label: "달러", krwRate: 1375 },
  { code: "EUR", label: "유로", krwRate: 1485 },
  { code: "GBP", label: "파운드", krwRate: 1740 },
  { code: "KRW", label: "원", krwRate: 1 },
];

export const BWS_PLAYERS: SquadSalaryPlayer[] = [
  {
    id: "vinicius-junior",
    nameKo: "비니시우스 주니오르",
    nameEn: "Vinicius Junior",
    position: "FW",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 20000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "스페인 축구 매체 보도 기준",
    note: "레알 마드리드 핵심 공격수로 브라질 대표팀 내 최고 연봉 선수로 보도됩니다.",
    isFeatured: true,
  },
  {
    id: "rodrygo",
    nameKo: "호드리고",
    nameEn: "Rodrygo",
    position: "FW",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 9000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "비니시우스와 함께 레알 마드리드 공격진을 이루는 선수입니다.",
    isFeatured: true,
  },
  {
    id: "casemiro",
    nameKo: "카제미루",
    nameEn: "Casemiro",
    position: "MF",
    club: "맨체스터 유나이티드",
    league: "프리미어리그",
    salaryAmount: 12000000,
    salaryCurrency: "GBP",
    sourceBadge: "보도 기준",
    sourceLabel: "영국 축구 매체 보도 기준",
    note: "수비형 미드필더로 대표팀 중원의 핵심 선수입니다.",
    isFeatured: true,
  },
  {
    id: "alisson",
    nameKo: "알리송 베케르",
    nameEn: "Alisson Becker",
    position: "GK",
    club: "리버풀",
    league: "프리미어리그",
    salaryAmount: 9500000,
    salaryCurrency: "GBP",
    sourceBadge: "보도 기준",
    sourceLabel: "영국 축구 매체 보도 기준",
    note: "브라질 대표팀 주전 골키퍼로 활약하고 있습니다.",
    isFeatured: true,
  },
  {
    id: "marquinhos",
    nameKo: "마르키뉴스",
    nameEn: "Marquinhos",
    position: "DF",
    club: "파리 생제르맹",
    league: "리그1",
    salaryAmount: 9000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "PSG 주장이자 대표팀 중앙 수비를 이끄는 선수입니다.",
    isFeatured: true,
  },
  {
    id: "bruno-guimaraes",
    nameKo: "브루누 기마랑이스",
    nameEn: "Bruno Guimaraes",
    position: "MF",
    club: "뉴캐슬",
    league: "프리미어리그",
    salaryAmount: 8500000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "뉴캐슬 중원의 핵심으로 대표팀 차세대 주장 후보로 꼽힙니다.",
    isFeatured: true,
  },
  {
    id: "raphinha",
    nameKo: "라피냐",
    nameEn: "Raphinha",
    position: "FW",
    club: "바르셀로나",
    league: "라리가",
    salaryAmount: 12000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "스페인 축구 매체 보도 기준",
    note: "바르셀로나에서 핵심 공격 자원으로 활약 중입니다.",
    isFeatured: true,
  },
  {
    id: "endrick",
    nameKo: "엔드리크",
    nameEn: "Endrick",
    position: "FW",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 3500000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "어린 나이에 레알 마드리드로 이적해 향후 연봉 변동이 클 수 있습니다.",
    isFeatured: true,
  },
  {
    id: "lucas-paqueta",
    nameKo: "루카스 파케타",
    nameEn: "Lucas Paqueta",
    position: "MF",
    club: "웨스트햄",
    league: "프리미어리그",
    salaryAmount: 6500000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "공격형 미드필더로 대표팀 중원에서 다재다능한 역할을 맡습니다.",
  },
  {
    id: "gabriel-martinelli",
    nameKo: "가브리엘 마르티넬리",
    nameEn: "Gabriel Martinelli",
    position: "FW",
    club: "아스널",
    league: "프리미어리그",
    salaryAmount: 6000000,
    salaryCurrency: "GBP",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "아스널 공격 자원으로 대표팀 측면을 책임지는 선수입니다.",
  },
];

export const BWS_FAQ: PageFaqItem[] = [
  {
    question: "브라질 월드컵 대표팀 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 이 페이지의 연봉은 구단 공식 계약서나 선수 실수령액이 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 모든 금액에 보도 기준, 추정, 확인 필요 배지를 붙였습니다.",
  },
  {
    question: "비니시우스 주니오르 연봉이 가장 높은 이유는 무엇인가요?",
    answer:
      "레알 마드리드의 핵심 공격수로서 클럽 내 최상위 연봉 그룹에 속해 있는 것으로 보도되기 때문입니다. 다만 정확한 계약 조건은 공식적으로 공개되지 않았습니다.",
  },
  {
    question: "경기 90분 기준 금액은 실제 출전 수당인가요?",
    answer:
      "아닙니다. 연봉을 365일과 24시간, 60분으로 나눈 뒤 90분을 곱한 체감용 계산입니다. 실제 경기 수당, 승리 수당, 포상금과는 다른 값입니다.",
  },
  {
    question: "환율을 바꾸면 순위도 바뀌나요?",
    answer:
      "네. 선수별 기준 통화가 유로, 파운드로 다르기 때문에 환율 입력값에 따라 원화 환산 순위가 일부 바뀔 수 있습니다.",
  },
  {
    question: "왜 전체 최종 명단 26명을 모두 넣지 않았나요?",
    answer:
      "발행 시점에 연봉 출처가 약한 선수는 무리하게 숫자를 채우지 않는 편이 안전합니다. 이 리포트는 검색 수요가 큰 주요 선수부터 시작하고, 최종 명단과 연봉 출처가 확인되는 선수는 추후 업데이트하는 구조입니다.",
  },
];

export const BWS_RELATED_LINKS = [
  { href: "/reports/argentina-worldcup-squad-salary-2026/", label: "아르헨티나 대표팀 연봉 순위 2026" },
  { href: "/reports/france-worldcup-squad-salary-2026/", label: "프랑스 대표팀 연봉 순위 2026" },
  { href: "/reports/worldcup-squad-salary-total-comparison-2026/", label: "월드컵 대표팀 연봉 총액 순위 비교" },
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/reports/korea-football-legends-salary-comparison-2026/", label: "손흥민·김민재·이강인 vs 역대 레전드 연봉" },
  { href: "/tools/worldcup-prize-money-calculator/", label: "월드컵 상금 계산기" },
];
