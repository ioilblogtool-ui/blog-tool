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

export const FWS_META = {
  slug: "france-worldcup-squad-salary-2026",
  title: "2026 프랑스 월드컵 대표팀 연봉 순위",
  seoTitle: "2026 프랑스 월드컵 대표팀 연봉 순위 | 음바페·뎀벨레 추정 연봉 비교",
  seoDescription:
    "2026 프랑스 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산해 비교합니다.",
  description:
    "킬리안 음바페, 우스만 뎀벨레, 그리즈만 등 프랑스 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화와 체감 단위로 비교합니다.",
  updatedAt: "2026-06-21",
  dataNote:
    "이 리포트의 선수 연봉은 구단 공식 계약서가 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 실제 실수령액, 보너스, 초상권, 광고 수입, 세금은 반영하지 않습니다.",
};

export const FWS_EXCHANGE_RATES: ExchangeRatePreset[] = [
  { code: "USD", label: "달러", krwRate: 1375 },
  { code: "EUR", label: "유로", krwRate: 1485 },
  { code: "GBP", label: "파운드", krwRate: 1740 },
  { code: "KRW", label: "원", krwRate: 1 },
];

export const FWS_PLAYERS: SquadSalaryPlayer[] = [
  {
    id: "kylian-mbappe",
    nameKo: "킬리안 음바페",
    nameEn: "Kylian Mbappe",
    position: "FW",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 25000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "스페인 축구 매체 보도 기준",
    note: "PSG에서 레알 마드리드로 이적하며 유럽 최고 연봉 그룹에 합류한 것으로 보도됩니다.",
    isFeatured: true,
  },
  {
    id: "ousmane-dembele",
    nameKo: "우스만 뎀벨레",
    nameEn: "Ousmane Dembele",
    position: "FW",
    club: "파리 생제르맹",
    league: "리그1",
    salaryAmount: 12000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "PSG 공격진의 핵심 자원으로 대표팀에서도 주요 역할을 맡습니다.",
    isFeatured: true,
  },
  {
    id: "antoine-griezmann",
    nameKo: "앙투안 그리즈만",
    nameEn: "Antoine Griezmann",
    position: "FW",
    club: "아틀레티코 마드리드",
    league: "라리가",
    salaryAmount: 10000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "스페인 축구 매체 보도 기준",
    note: "대표팀 공격을 오랜 기간 이끌어온 베테랑 선수입니다.",
    isFeatured: true,
  },
  {
    id: "aurelien-tchouameni",
    nameKo: "오렐리앙 추아메니",
    nameEn: "Aurelien Tchouameni",
    position: "MF",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 8000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "레알 마드리드 중원의 핵심으로 대표팀 수비형 미드필더를 맡습니다.",
    isFeatured: true,
  },
  {
    id: "mike-maignan",
    nameKo: "마이크 마냥",
    nameEn: "Mike Maignan",
    position: "GK",
    club: "AC 밀란",
    league: "세리에A",
    salaryAmount: 5000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "이탈리아 축구 매체 추정치",
    note: "대표팀 주전 골키퍼로 활약하고 있습니다.",
    isFeatured: true,
  },
  {
    id: "william-saliba",
    nameKo: "윌리암 살리바",
    nameEn: "William Saliba",
    position: "DF",
    club: "아스널",
    league: "프리미어리그",
    salaryAmount: 7000000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "영국 축구 매체 추정치",
    note: "아스널 중앙 수비의 핵심이자 대표팀 차세대 주장 후보입니다.",
    isFeatured: true,
  },
  {
    id: "eduardo-camavinga",
    nameKo: "에두아르두 카마빙가",
    nameEn: "Eduardo Camavinga",
    position: "MF",
    club: "레알 마드리드",
    league: "라리가",
    salaryAmount: 7000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB 추정치",
    note: "어린 나이부터 레알 마드리드 주전으로 자리매김한 미드필더입니다.",
  },
  {
    id: "theo-hernandez",
    nameKo: "테오 에르난데스",
    nameEn: "Theo Hernandez",
    position: "DF",
    club: "AC 밀란",
    league: "세리에A",
    salaryAmount: 6500000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "이탈리아 축구 매체 추정치",
    note: "공격적인 측면 수비수로 대표팀에서도 중요한 역할을 맡습니다.",
  },
  {
    id: "bradley-barcola",
    nameKo: "브래들리 바르콜라",
    nameEn: "Bradley Barcola",
    position: "FW",
    club: "파리 생제르맹",
    league: "리그1",
    salaryAmount: 6000000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "PSG에서 빠르게 성장한 젊은 공격수입니다.",
  },
  {
    id: "adrien-rabiot",
    nameKo: "아드리앵 라비오",
    nameEn: "Adrien Rabiot",
    position: "MF",
    club: "마르세유",
    league: "리그1",
    salaryAmount: 5000000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "중원 로테이션 자원으로 대표팀에 합류하는 선수입니다.",
  },
];

export const FWS_FAQ: PageFaqItem[] = [
  {
    question: "프랑스 월드컵 대표팀 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 이 페이지의 연봉은 구단 공식 계약서나 선수 실수령액이 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 모든 금액에 보도 기준, 추정, 확인 필요 배지를 붙였습니다.",
  },
  {
    question: "음바페 연봉이 가장 높은 이유는 무엇인가요?",
    answer:
      "PSG에서 레알 마드리드로 이적하며 유럽 최상위권 연봉 계약을 맺은 것으로 보도되었기 때문입니다. 다만 정확한 계약 조건은 공식적으로 공개되지 않았습니다.",
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

export const FWS_RELATED_LINKS = [
  { href: "/reports/brazil-worldcup-squad-salary-2026/", label: "브라질 대표팀 연봉 순위 2026" },
  { href: "/reports/argentina-worldcup-squad-salary-2026/", label: "아르헨티나 대표팀 연봉 순위 2026" },
  { href: "/reports/worldcup-squad-salary-total-comparison-2026/", label: "월드컵 대표팀 연봉 총액 순위 비교" },
  { href: "/reports/korea-worldcup-squad-salary-2026/", label: "대한민국 월드컵 대표팀 연봉 순위" },
  { href: "/reports/korea-football-legends-salary-comparison-2026/", label: "손흥민·김민재·이강인 vs 역대 레전드 연봉" },
  { href: "/tools/worldcup-prize-money-calculator/", label: "월드컵 상금 계산기" },
];
