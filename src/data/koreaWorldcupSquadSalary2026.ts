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

export const KWSS_META = {
  slug: "korea-worldcup-squad-salary-2026",
  title: "2026 대한민국 월드컵 대표팀 연봉 순위",
  seoTitle: "2026 대한민국 월드컵 대표팀 연봉 순위 | 손흥민·김민재·이강인 추정 연봉 비교",
  seoDescription:
    "2026 대한민국 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화, 월급, 일급, 경기 90분 기준으로 환산해 비교합니다.",
  description:
    "손흥민, 김민재, 이강인 등 대한민국 월드컵 대표팀 주요 선수의 보도 기준 추정 연봉을 원화와 체감 단위로 비교합니다.",
  updatedAt: "2026-06-12",
  dataNote:
    "이 리포트의 선수 연봉은 구단 공식 계약서가 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 실제 실수령액, 보너스, 초상권, 광고 수입, 세금은 반영하지 않습니다.",
};

export const KWSS_MATCH_CONTEXT = {
  baseDate: "2026-06-12",
  matchLabel: "2026 월드컵 조별리그 대한민국 2-1 체코",
  summary:
    "2026년 6월 12일 기준 주요 보도에 따르면 대한민국은 체코전에서 2-1 역전승을 거뒀습니다. 황인범의 동점골과 오현규의 결승골이 보도됐고, 이 페이지는 그 관심 흐름에서 대표팀 주요 선수의 추정 연봉을 숫자로 환산합니다.",
  sourceLabel: "AP·The Guardian 경기 보도 기준",
  sourceUrl: "https://apnews.com/article/496e7772dde95ca0af90b5074fdb13d9",
};

export const KWSS_EXCHANGE_RATES: ExchangeRatePreset[] = [
  { code: "USD", label: "달러", krwRate: 1375 },
  { code: "EUR", label: "유로", krwRate: 1485 },
  { code: "GBP", label: "파운드", krwRate: 1740 },
  { code: "KRW", label: "원", krwRate: 1 },
];

export const KWSS_PLAYERS: SquadSalaryPlayer[] = [
  {
    id: "son-heung-min",
    nameKo: "손흥민",
    nameEn: "Son Heung-min",
    position: "FW",
    club: "LAFC",
    league: "MLS",
    salaryAmount: 11200000,
    salaryCurrency: "USD",
    sourceBadge: "보도 기준",
    sourceLabel: "2026 MLS 보수 보도 기준",
    sourceUrl: "https://www.theguardian.com/football/2026/may/12/mls-2026-salary-release-takeaways",
    note: "MLS 공개 보수 보도를 원화로 단순 환산했습니다.",
    isFeatured: true,
  },
  {
    id: "kim-min-jae",
    nameKo: "김민재",
    nameEn: "Kim Min-jae",
    position: "DF",
    club: "바이에른 뮌헨",
    league: "분데스리가",
    salaryAmount: 15000000,
    salaryCurrency: "EUR",
    sourceBadge: "보도 기준",
    sourceLabel: "독일 축구 매체 보도 기준",
    sourceUrl: "https://www.bavarianfootballworks.com/transfer-rumors/212242/bayern-munich-brown-manchester-city-united-real-madrid-fc-barcelona-arsenal-psg-chelsea-liverpool-world-cup",
    note: "보도된 샐러리 패키지 금액을 세전 기준으로 단순 환산했습니다.",
    isFeatured: true,
  },
  {
    id: "lee-kang-in",
    nameKo: "이강인",
    nameEn: "Lee Kang-in",
    position: "MF",
    club: "파리 생제르맹",
    league: "리그1",
    salaryAmount: 4000000,
    salaryCurrency: "EUR",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB·언론 추정치",
    note: "구단 공식 공개값이 아니므로 추정값으로만 사용합니다.",
    isFeatured: true,
  },
  {
    id: "hwang-hee-chan",
    nameKo: "황희찬",
    nameEn: "Hwang Hee-chan",
    position: "FW",
    club: "울버햄프턴",
    league: "프리미어리그",
    salaryAmount: 3120000,
    salaryCurrency: "GBP",
    sourceBadge: "추정",
    sourceLabel: "비공식 샐러리 DB·영국 보도 추정치",
    note: "주급 기반 추정치를 연봉으로 환산한 값입니다.",
    isFeatured: true,
  },
  {
    id: "hwang-in-beom",
    nameKo: "황인범",
    nameEn: "Hwang In-beom",
    position: "MF",
    club: "페예노르트",
    league: "에레디비시",
    salaryAmount: 2000000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "체코전 핵심 선수지만 연봉 공개 신뢰도가 낮아 확인 필요로 분리합니다.",
    isFeatured: true,
  },
  {
    id: "lee-jae-sung",
    nameKo: "이재성",
    nameEn: "Lee Jae-sung",
    position: "MF",
    club: "마인츠",
    league: "분데스리가",
    salaryAmount: 1800000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "비공식 추정치라 실제 계약 구조와 다를 수 있습니다.",
  },
  {
    id: "oh-hyeon-gyu",
    nameKo: "오현규",
    nameEn: "Oh Hyeon-gyu",
    position: "FW",
    club: "헹크",
    league: "벨기에 프로리그",
    salaryAmount: 900000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "체코전 결승골 보도 이후 주목 선수가 됐지만 연봉은 확인 필요 추정값입니다.",
    isFeatured: true,
  },
  {
    id: "cho-gue-sung",
    nameKo: "조규성",
    nameEn: "Cho Gue-sung",
    position: "FW",
    club: "미트윌란",
    league: "덴마크 수페르리가",
    salaryAmount: 800000,
    salaryCurrency: "EUR",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "해외파 추정 연봉으로만 비교합니다.",
  },
  {
    id: "kim-seung-gyu",
    nameKo: "김승규",
    nameEn: "Kim Seung-gyu",
    position: "GK",
    club: "알샤바브",
    league: "사우디 프로리그",
    salaryAmount: 1200000,
    salaryCurrency: "USD",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "사우디 리그 보수는 공개 범위가 좁아 확인 필요로 표시합니다.",
  },
  {
    id: "kim-young-gwon",
    nameKo: "김영권",
    nameEn: "Kim Young-gwon",
    position: "DF",
    club: "울산 HD",
    league: "K리그1",
    salaryAmount: 900000000,
    salaryCurrency: "KRW",
    sourceBadge: "추정",
    sourceLabel: "K리그 보도·공개자료 기반 추정",
    note: "K리그 국내 선수 연봉 공개자료와 보도를 참고한 추정값입니다.",
  },
  {
    id: "jo-hyeon-woo",
    nameKo: "조현우",
    nameEn: "Jo Hyeon-woo",
    position: "GK",
    club: "울산 HD",
    league: "K리그1",
    salaryAmount: 800000000,
    salaryCurrency: "KRW",
    sourceBadge: "추정",
    sourceLabel: "K리그 보도·공개자료 기반 추정",
    note: "공식 계약서가 아닌 보도 기준 추정값입니다.",
  },
  {
    id: "baek-seung-ho",
    nameKo: "백승호",
    nameEn: "Paik Seung-ho",
    position: "MF",
    club: "버밍엄 시티",
    league: "잉글랜드 챔피언십",
    salaryAmount: 700000,
    salaryCurrency: "GBP",
    sourceBadge: "확인 필요",
    sourceLabel: "언론·샐러리 DB 교차 확인 필요",
    note: "잉글랜드 하부리그 보수 추정치는 출처별 차이가 커 확인 필요로 표시합니다.",
  },
];

export const KWSS_FAQ: PageFaqItem[] = [
  {
    question: "대한민국 월드컵 대표팀 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 이 페이지의 연봉은 구단 공식 계약서나 선수 실수령액이 아니라 공개 보도, 샐러리 DB, 언론 추정치를 바탕으로 한 세전 단순 환산입니다. 그래서 모든 금액에 보도 기준, 추정, 확인 필요 배지를 붙였습니다.",
  },
  {
    question: "손흥민 연봉은 왜 달러로 계산하나요?",
    answer:
      "소속 리그인 MLS의 보수 보도가 달러 기준으로 제공되기 때문입니다. 페이지에서 달러 환율을 바꾸면 손흥민의 원화 환산 연봉, 월급, 일급, 90분 기준 금액도 함께 바뀝니다.",
  },
  {
    question: "김민재 연봉은 세전인가요?",
    answer:
      "네. 이 페이지는 보도된 샐러리 패키지를 세전 총액처럼 단순 환산합니다. 독일 세금, 보너스, 초상권, 에이전트 수수료, 계약 옵션은 반영하지 않습니다.",
  },
  {
    question: "경기 90분 기준 금액은 실제 출전 수당인가요?",
    answer:
      "아닙니다. 연봉을 365일과 24시간, 60분으로 나눈 뒤 90분을 곱한 체감용 계산입니다. 실제 경기 수당, 승리 수당, 포상금과는 다른 값입니다.",
  },
  {
    question: "환율을 바꾸면 순위도 바뀌나요?",
    answer:
      "네. 선수별 기준 통화가 달러, 유로, 파운드, 원화로 다르기 때문에 환율 입력값에 따라 원화 환산 순위가 일부 바뀔 수 있습니다.",
  },
  {
    question: "K리그 선수도 같은 기준으로 비교해도 되나요?",
    answer:
      "원화 연봉은 환율 영향이 없지만, 공개 범위와 계약 구조가 해외 리그와 다릅니다. 따라서 K리그 선수 금액도 공식 확정값처럼 읽기보다 국내 보도 기준 추정값으로 보는 것이 안전합니다.",
  },
  {
    question: "왜 전체 최종 명단 26명을 모두 넣지 않았나요?",
    answer:
      "발행 시점에 연봉 출처가 약한 선수는 무리하게 숫자를 채우지 않는 편이 안전합니다. 이 리포트는 검색 수요가 큰 주요 선수부터 시작하고, FIFA·KFA 명단과 연봉 출처가 확인되는 선수는 추후 업데이트하는 구조입니다.",
  },
];

export const KWSS_RELATED_LINKS = [
  { href: "/reports/korea-football-legends-salary-comparison-2026/", label: "손흥민·김민재·이강인 연봉 vs 역대 레전드 연봉 비교" },
  { href: "/reports/kbo-salary-comparison-2026/", label: "KBO 10구단 연봉 비교 2026" },
  { href: "/reports/kleague-salary-comparison-2026/", label: "K리그1 구단 연봉 비교 2026" },
  { href: "/reports/large-company-salary-growth-by-years-2026/", label: "대기업 연차별 연봉 성장 비교" },
  { href: "/tools/bonus-after-tax-calculator/", label: "성과급 세후 계산기" },
];
