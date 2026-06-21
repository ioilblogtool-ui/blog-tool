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

export const AWS_META = {
  slug: "argentina-worldcup-squad-salary-2026",
  title: "2026 아르헨티나 월드컵 대표팀 연봉 순위",
  seoTitle: "2026 아르헨티나 월드컵 대표팀 연봉 순위 | 메시·알바레스 추정 연봉 비교",
  seoDescription:
    "2026 아르헨티나 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산해 비교합니다.",
  description:
    "리오넬 메시, 줄리안 알바레스, 라우타로 마르티네스 등 아르헨티나 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화와 체감 단위로 비교합니다.",
  updatedAt: "2026-06-21",
  dataNote:
    "이 리포트의 선수 연봉은 구단 공식 계약서가 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 실제 실수령액, 보너스, 초상권, 광고 수입, 세금은 반영하지 않습니다.",
};

export const AWS_EXCHANGE_RATES: ExchangeRatePreset[] = [
  { code: "USD", label: "달러", krwRate: 1375 },
  { code: "EUR", label: "유로", krwRate: 1485 },
  { code: "GBP", label: "파운드", krwRate: 1740 },
  { code: "KRW", label: "원", krwRate: 1 },
];

export const AWS_PLAYERS: SquadSalaryPlayer[] = [
  {
    id: "lionel-messi",
    nameKo: "리오넬 메시",
    nameEn: "Lionel Messi",
    position: "FW",
    club: "인터 마이애미",
    league: "MLS",
    salaryAmount: 20000000,
    salaryCurrency: "USD",
    sourceBadge: "보도 기준",
    sourceLabel: "MLS 공개 보수 보도 기준",
    note: "MLS 공개 보수 보도를 원화로 단순 환산했습니다. 광고·지분 관련 추가 수입은 제외했습니다.",
    isFeatured: true,
  },
  {
    id: "julian-alvarez",
    nameKo: "줄리안 알바레스",
    nameEn: "Julian Alvarez",
    position: "FW",
    club: "아틀레티코 마드리드",
    league: "라리가",
    salaryAmount: 8000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "맨체스터 시티 출신으로 이적 후 대표팀 핵심 공격수로 자리매김했습니다.",
    isFeatured: true,
  },
  {
    id: "lautaro-martinez",
    nameKo: "라우타로 마르티네스",
    nameEn: "Lautaro Martinez",
    position: "FW",
    club: "인터 밀란",
    league: "세리에A",
    salaryAmount: 6000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "이탈리아 축구 매체 보도 기준",
    note: "인터 밀란 주장이자 대표팀 주전 스트라이커입니다.",
    isFeatured: true,
  },
  {
    id: "enzo-fernandez",
    nameKo: "엔소 페르난데스",
    nameEn: "Enzo Fernandez",
    position: "MF",
    club: "첼시",
    league: "프리미어리그",
    salaryAmount: 8000000,
    salaryCurrency: "GBP",
    sourceBadge: "보도 기준",
    sourceLabel: "영국 축구 매체 보도 기준",
    note: "첼시 이적 당시 구단 역대 최고 이적료 중 하나로 보도된 선수입니다.",
    isFeatured: true,
  },
  {
    id: "emiliano-martinez",
    nameKo: "에밀리아노 마르티네스",
    nameEn: "Emiliano Martinez",
    position: "GK",
    club: "아스톤 빌라",
    league: "프리미어리그",
    salaryAmount: 5000000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "2022 카타르 월드컵 골든글러브 수상자로 대표팀 주전 골키퍼입니다.",
    isFeatured: true,
  },
  {
    id: "rodrigo-de-paul",
    nameKo: "로드리고 데 파울",
    nameEn: "Rodrigo De Paul",
    position: "MF",
    club: "아틀레티코 마드리드",
    league: "라리가",
    salaryAmount: 7000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "대표팀 중원의 핵심 연결고리 역할을 맡고 있습니다.",
    isFeatured: true,
  },
  {
    id: "cristian-romero",
    nameKo: "크리스티안 로메로",
    nameEn: "Cristian Romero",
    position: "DF",
    club: "토트넘",
    league: "프리미어리그",
    salaryAmount: 6500000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "대표팀 중앙 수비 라인을 이끄는 선수입니다.",
  },
  {
    id: "alexis-mac-allister",
    nameKo: "알렉시스 막알리스테르",
    nameEn: "Alexis Mac Allister",
    position: "MF",
    club: "리버풀",
    league: "프리미어리그",
    salaryAmount: 8000000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "리버풀 중원에서 핵심 역할을 맡고 있는 선수입니다.",
    isFeatured: true,
  },
  {
    id: "nahuel-molina",
    nameKo: "나우엘 몰리나",
    nameEn: "Nahuel Molina",
    position: "DF",
    club: "아틀레티코 마드리드",
    league: "라리가",
    salaryAmount: 4500000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "대표팀 측면 수비를 책임지는 선수입니다.",
  },
  {
    id: "giovani-lo-celso",
    nameKo: "지오바니 로 셀소",
    nameEn: "Giovani Lo Celso",
    position: "MF",
    club: "레알 베티스",
    league: "라리가",
    salaryAmount: 4000000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "중원 로테이션 자원으로 대표팀에 합류하는 선수입니다.",
  },
];

export const AWS_FAQ: PageFaqItem[] = [
  {
    question: "아르헨티나 월드컵 대표팀 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 이 페이지의 연봉은 구단 공식 계약서나 선수 실수령액이 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 모든 금액에 보도 기준, 추정, 확인 필요 배지를 붙였습니다.",
  },
  {
    question: "메시 연봉은 왜 달러로 계산하나요?",
    answer:
      "소속 리그인 MLS의 보수 보도가 달러 기준으로 제공되기 때문입니다. 페이지에서 달러 환율을 바꾸면 메시의 원화 환산 연봉, 월급, 일급, 90분 기준 금액도 함께 바뀝니다.",
  },
  {
    question: "메시는 광고 수입까지 포함된 금액인가요?",
    answer:
      "아닙니다. MLS 공개 보수 보도를 기준으로 한 세전 연봉만 반영했습니다. 광고, 지분 참여, 보너스 등 추가 수입은 포함하지 않았습니다.",
  },
  {
    question: "경기 90분 기준 금액은 실제 출전 수당인가요?",
    answer:
      "아닙니다. 연봉을 365일과 24시간, 60분으로 나눈 뒤 90분을 곱한 체감용 계산입니다. 실제 경기 수당, 승리 수당, 포상금과는 다른 값입니다.",
  },
  {
    question: "왜 전체 최종 명단 26명을 모두 넣지 않았나요?",
    answer:
      "발행 시점에 연봉 출처가 약한 선수는 무리하게 숫자를 채우지 않는 편이 안전합니다. 이 리포트는 검색 수요가 큰 주요 선수부터 시작하고, 최종 명단과 연봉 출처가 확인되는 선수는 추후 업데이트하는 구조입니다.",
  },
];

export const AWS_RELATED_LINKS = [
  { href: "/reports/brazil-worldcup-squad-salary-2026/", label: "브라질 대표팀 연봉 순위 2026" },
  { href: "/reports/france-worldcup-squad-salary-2026/", label: "프랑스 대표팀 연봉 순위 2026" },
  { href: "/reports/worldcup-squad-salary-total-comparison-2026/", label: "월드컵 대표팀 연봉 총액 순위 비교" },
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/reports/korea-football-legends-salary-comparison-2026/", label: "손흥민·김민재·이강인 vs 역대 레전드 연봉" },
  { href: "/tools/worldcup-prize-money-calculator/", label: "월드컵 상금 계산기" },
];
