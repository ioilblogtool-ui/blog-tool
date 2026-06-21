// 메시 vs 호날두 통산 기록·연봉 비교 리포트 데이터
// 설계 문서: docs/design/202606/messi-ronaldo-career-comparison-2026-design.md
//
// ⚠️ 중요: 두 선수 모두 현역으로 활동 중이라 통산 골/도움/출전 기록이 계속 바뀝니다.
// 아래 수치는 학습 데이터 기준(2025년 중반 시점) 종합 추정치이며, 매체별 집계 기준
// (공식전만 포함 / 친선경기 포함, 클럽+국가대표 합산 방식 등)에 따라 실제 공개된 숫자와
// 다를 수 있습니다. **발행 전 Transfermarkt/ESPN/FIFA 등 1차 출처로 반드시 재확인**하세요.
// RECENT_FORM은 발행 시점의 실제 최신 경기 결과로 교체해야 하는 운영용 placeholder입니다.

export type SalarySourceBadge = "공식" | "보도 기준" | "추정" | "확인 필요";
export type RecordSourceBadge = "공식 통계" | "보도 기준" | "집계 시점 차이";
export type PlayerId = "messi" | "ronaldo";
export type RecordCategory = "scoring" | "awards" | "trophies" | "nationalTeam" | "income";

export interface PlayerProfile {
  id: PlayerId;
  nameKo: string;
  nameEn: string;
  flag: string;
  birthDate: string;
  currentClub: string;
  currentLeague: string;
  contractUntil?: string;
  position: string;
  careerClubs: string[];
  oneLineSummary: string;
}

export interface CareerRecordItem {
  id: string;
  category: RecordCategory;
  labelKo: string;
  messiValue: string;
  ronaldoValue: string;
  messiRaw?: number;
  ronaldoRaw?: number;
  leaderId?: PlayerId | "tie";
  sourceBadge: RecordSourceBadge | SalarySourceBadge;
  sourceLabel: string;
  sourceUrl?: string;
  note?: string;
}

export interface RecentFormEntry {
  id: string;
  playerId: PlayerId;
  date: string;
  competition: string;
  opponent: string;
  result: string;
  summary: string;
  sourceUrl?: string;
  isPlaceholder?: boolean;
}

export interface ComparisonFaqItem {
  question: string;
  answer: string;
}

export const MRCC_META = {
  slug: "messi-ronaldo-career-comparison-2026",
  title: "메시 vs 호날두 통산 기록·연봉 비교",
  seoTitle: "메시 호날두 비교 2026 | 통산 골·발롱도르·연봉 한눈에",
  seoDescription:
    "메시와 호날두의 통산 골, 발롱도르, 월드컵 성적, 현재 연봉을 항목별로 비교합니다. 최근 해트트릭 등 최신 경기 기록도 함께 확인하세요.",
  dataAsOf: "2025-08",
  updatedAt: "2026-06-21",
  dataNote:
    "통산 골·도움 등 누적 기록은 학습 데이터 기준 종합 추정치이며 집계 시점·매체별 기준에 따라 실제 수치와 차이가 있을 수 있습니다. 발행 전 1차 출처로 재확인이 필요합니다. 연봉과 수입은 공식 계약 공개가 아닌 보도 기준 추정입니다.",
};

export const MRCC_PLAYERS: PlayerProfile[] = [
  {
    id: "messi",
    nameKo: "리오넬 메시",
    nameEn: "Lionel Messi",
    flag: "🇦🇷",
    birthDate: "1987-06-24",
    currentClub: "인터 마이애미 CF",
    currentLeague: "MLS (미국)",
    contractUntil: "확인 필요 (구단 발표 기준 재확인 필요)",
    position: "FW / 공격형 미드필더",
    careerClubs: ["FC 바르셀로나", "파리 생제르맹", "인터 마이애미 CF"],
    oneLineSummary:
      "발롱도르 최다 수상(8회) 기록을 보유한 아르헨티나의 공격수로, 2022 카타르 월드컵 우승을 끝으로 국가대표 커리어의 정점을 찍었다.",
  },
  {
    id: "ronaldo",
    nameKo: "크리스티아누 호날두",
    nameEn: "Cristiano Ronaldo",
    flag: "🇵🇹",
    birthDate: "1985-02-05",
    currentClub: "알 나스르 FC",
    currentLeague: "사우디 프로리그",
    contractUntil: "확인 필요 (구단 발표 기준 재확인 필요)",
    position: "FW",
    careerClubs: [
      "스포르팅 CP",
      "맨체스터 유나이티드",
      "레알 마드리드",
      "유벤투스",
      "맨체스터 유나이티드(복귀)",
      "알 나스르 FC",
    ],
    oneLineSummary:
      "축구 역사상 공인 통산 최다골 기록 보유자로 알려진 포르투갈의 공격수. 월드컵 우승 경력은 없지만 유로 2016 우승과 압도적인 통산 득점량이 강점이다.",
  },
];

export const MRCC_RECORDS: CareerRecordItem[] = [
  // ── 득점·도움 ───────────────────────────────────────────
  {
    id: "club-goals",
    category: "scoring",
    labelKo: "클럽 통산 골 (공식전 기준)",
    messiValue: "약 720골 이상 (추정)",
    ronaldoValue: "약 780골 이상 (추정)",
    messiRaw: 720,
    ronaldoRaw: 780,
    leaderId: "ronaldo",
    sourceBadge: "집계 시점 차이",
    sourceLabel: "Transfermarkt 등 종합 추정 (2025년 중반 기준, 재확인 필요)",
    note: "바르셀로나·PSG·인터 마이애미(메시), 스포르팅·맨유·레알·유벤투스·알 나스르(호날두) 전 소속 클럽 공식전 합산 추정치. 발행 전 최신 수치로 갱신 필요.",
  },
  {
    id: "national-goals",
    category: "scoring",
    labelKo: "국가대표 통산 골",
    messiValue: "약 110골 이상 (추정)",
    ronaldoValue: "약 130골 이상 (추정)",
    messiRaw: 110,
    ronaldoRaw: 130,
    leaderId: "ronaldo",
    sourceBadge: "집계 시점 차이",
    sourceLabel: "FIFA, 아르헨티나·포르투갈 축구협회 발표 종합 추정",
    note: "호날두는 A매치 통산 최다골 보유자로 알려져 있다. 두 선수 모두 현역이라 매 경기 갱신될 수 있다.",
  },
  {
    id: "combined-goals",
    category: "scoring",
    labelKo: "클럽+국가대표 합산 통산 골",
    messiValue: "약 830골 이상 (추정)",
    ronaldoValue: "약 910골 이상 (추정)",
    messiRaw: 830,
    ronaldoRaw: 910,
    leaderId: "ronaldo",
    sourceBadge: "집계 시점 차이",
    sourceLabel: "복수 매체 종합 추정 (2025년 중반 기준)",
    note: "호날두는 친선경기 포함 여부에 따라 '축구 역사상 공인 최다골 기록 보유자'로 보도된 바 있다. 친선경기 포함/제외 기준에 따라 수치 차이가 크므로 페이지에 두 기준을 함께 안내해야 한다.",
  },
  {
    id: "club-assists",
    category: "scoring",
    labelKo: "클럽 통산 도움 (공식전 기준)",
    messiValue: "약 360개 이상 (추정)",
    ronaldoValue: "약 230개 이상 (추정)",
    messiRaw: 360,
    ronaldoRaw: 230,
    leaderId: "messi",
    sourceBadge: "집계 시점 차이",
    sourceLabel: "Transfermarkt 등 종합 추정",
    note: "메시는 다수 리그·대회에서 통산 도움 부문 역대 최상위권으로 평가된다.",
  },
  // ── 개인 수상 ───────────────────────────────────────────
  {
    id: "ballon-dor",
    category: "awards",
    labelKo: "발롱도르 수상 횟수",
    messiValue: "8회 (역대 최다)",
    ronaldoValue: "5회",
    messiRaw: 8,
    ronaldoRaw: 5,
    leaderId: "messi",
    sourceBadge: "공식 통계",
    sourceLabel: "France Football(발롱도르 공식 주관)",
    note: "메시 수상 연도: 2009·2010·2011·2012·2015·2019·2021·2023(시상 연도 기준, 재확인 필요). 호날두 수상 연도: 2008·2013·2014·2016·2017.",
  },
  {
    id: "fifa-best",
    category: "awards",
    labelKo: "FIFA 올해의 선수 / The Best 수상",
    messiValue: "다수 수상 (추정, 재확인 필요)",
    ronaldoValue: "다수 수상 (추정, 재확인 필요)",
    sourceBadge: "확인 필요",
    sourceLabel: "FIFA 공식 발표",
    note: "FIFA 올해의 선수와 발롱도르가 한시적으로 통합/분리되었던 시기가 있어 집계 기준 정리가 필요하다. 발행 전 FIFA 공식 자료로 정확한 횟수를 확정해야 한다.",
  },
  // ── 팀 트로피 ───────────────────────────────────────────
  {
    id: "ucl-titles",
    category: "trophies",
    labelKo: "UEFA 챔피언스리그 우승",
    messiValue: "4회 (FC 바르셀로나)",
    ronaldoValue: "5회 (맨체스터 유나이티드 1회, 레알 마드리드 4회)",
    messiRaw: 4,
    ronaldoRaw: 5,
    leaderId: "ronaldo",
    sourceBadge: "공식 통계",
    sourceLabel: "UEFA 공식 기록",
  },
  {
    id: "league-titles",
    category: "trophies",
    labelKo: "리그 우승 횟수 (통산)",
    messiValue: "라리가 10회 + 리그1 2회 (추정, 재확인 필요)",
    ronaldoValue: "프리미어리그 3회 + 라리가 2회 + 세리에A 2회 (추정, 재확인 필요)",
    sourceBadge: "확인 필요",
    sourceLabel: "각 리그 공식 기록 종합",
    note: "인터 마이애미·알 나스르에서의 추가 우승 여부는 시즌별로 갱신 필요.",
  },
  // ── 국가대표 ───────────────────────────────────────────
  {
    id: "worldcup",
    category: "nationalTeam",
    labelKo: "FIFA 월드컵 성적",
    messiValue: "우승 1회 (2022 카타르), 준우승 1회 (2014)",
    ronaldoValue: "무관 (최고 성적: 4강, 2006 독일)",
    leaderId: "messi",
    sourceBadge: "공식 통계",
    sourceLabel: "FIFA 공식 기록",
    note: "두 선수 비교에서 검색 수요가 가장 큰 항목. 다만 월드컵 성적은 팀 단위 성과라 개인 기량 평가와는 별도로 안내해야 한다.",
  },
  {
    id: "continental-cup",
    category: "nationalTeam",
    labelKo: "대륙별 국가대표 메이저 대회 우승",
    messiValue: "코파 아메리카 2회 (2021, 2024)",
    ronaldoValue: "UEFA 유로 2016 우승, UEFA 네이션스리그 2019 우승",
    sourceBadge: "공식 통계",
    sourceLabel: "CONMEBOL / UEFA 공식 기록",
  },
  {
    id: "caps",
    category: "nationalTeam",
    labelKo: "A매치 통산 출전 수",
    messiValue: "약 190경기 이상 (추정)",
    ronaldoValue: "약 215경기 이상 (추정, A매치 최다 출전 기록 보유로 알려짐)",
    messiRaw: 190,
    ronaldoRaw: 215,
    leaderId: "ronaldo",
    sourceBadge: "집계 시점 차이",
    sourceLabel: "아르헨티나·포르투갈 축구협회 발표 종합 추정",
  },
  // ── 연봉·수입 ───────────────────────────────────────────
  {
    id: "club-salary",
    category: "income",
    labelKo: "현재 소속 클럽 기준 연봉 (클럽 보수만)",
    messiValue: "약 2,000만~6,000만 달러 수준으로 보도 (지분·수익분배 조건 포함 여부에 따라 추정치 편차 큼)",
    ronaldoValue: "약 2억 달러 이상으로 보도 (역대 최고 수준 연봉으로 보도됨)",
    sourceBadge: "보도 기준",
    sourceLabel: "Forbes, Capology, 현지 언론 종합 보도",
    note: "메시의 인터 마이애미 계약은 기본급보다 애플(중계 플랫폼) 수익 분배, 아디다스 지분 등 비전형적 보상 구조가 커서 '클럽 연봉'만으로 단순 비교하기 어렵다.",
  },
  {
    id: "total-income",
    category: "income",
    labelKo: "연간 추정 총수입 (클럽 보수+광고·스폰서 등 합산)",
    messiValue: "약 1억 3,000만 달러 수준으로 보도 (연도별 편차 큼)",
    ronaldoValue: "약 2억 6,000만 달러 수준으로 보도 (연도별 편차 큼, 일부 연도 스포츠 스타 수입 1위로 보도)",
    sourceBadge: "보도 기준",
    sourceLabel: "Forbes 연간 스포츠 스타 수입 순위 추정",
    note: "광고·스폰서 수입은 공개 계약서가 없어 매체 추정치 간 편차가 크다. 발행 전 최신 연도 Forbes 랭킹으로 갱신 필요.",
  },
];

export const MRCC_RECENT_FORM: RecentFormEntry[] = [
  {
    id: "messi-2026wc-algeria-hattrick",
    playerId: "messi",
    date: "2026-06-16",
    competition: "2026 FIFA 월드컵 조별리그 J조 1차전",
    opponent: "알제리",
    result: "해트트릭 (3골) — 아르헨티나 3-0 승",
    summary:
      "캔자스시티 스타디움에서 열린 월드컵 조별리그 1차전에서 해트트릭을 기록했다. 이 골들로 메시는 월드컵 통산 16골로 미로슬라프 클로제와 함께 월드컵 최다골 공동 1위에 올랐고, 38세 357일의 나이로 월드컵 역대 최고령 해트트릭 기록을 세웠다.",
    sourceUrl: "https://www.intermiamicf.com/news/match-recap-messi-stars-with-hat-trick-as-argentina-opens-fifa-world-cup-2026-campaign-defeating-algeria",
  },
  {
    id: "ronaldo-2026wc-congo-draw",
    playerId: "ronaldo",
    date: "2026-06-17",
    competition: "2026 FIFA 월드컵 조별리그 K조 1차전",
    opponent: "콩고민주공화국",
    result: "1-1 무승부 (득점 없음)",
    summary:
      "휴스턴 NRG 스타디움에서 열린 월드컵 조별리그 1차전에 풀타임 출전했으나 슈팅 3회가 모두 골문을 벗어나며 득점에 실패했다. 포르투갈은 전반 5분 선제골을 넣었지만 전반 막판 콩고에 동점골을 허용해 1-1로 비겼다.",
    sourceUrl: "https://www.espn.com/soccer/story/_/id/49096146/portugal-dr-congo-live-world-cup-2026-latest-updates-commentary-score-result",
  },
];

export const MRCC_FAQ: ComparisonFaqItem[] = [
  {
    question: "이 리포트는 누가 GOAT인지 알려주나요?",
    answer:
      "아닙니다. 이 리포트는 통산 골, 수상, 연봉 등 항목별 숫자를 정리한 비교 자료이며, 'GOAT' 같은 종합 평가는 보는 사람의 기준에 따라 달라질 수 있어 결론을 내리지 않습니다.",
  },
  {
    question: "통산 골 수치가 다른 사이트와 다를 수 있나요?",
    answer:
      "네. 친선경기 포함 여부, 집계 시점, 클럽/국가대표 합산 방식이 매체마다 달라 수치가 소폭 다를 수 있습니다. 이 페이지는 기준 시점과 집계 방식을 함께 표기합니다.",
  },
  {
    question: "메시와 호날두의 연봉은 공식 자료인가요?",
    answer:
      "아닙니다. 두 선수의 클럽이 연봉을 공식 발표하지 않는 경우가 많아, Forbes·Capology 등 보도 기준 추정치를 사용했습니다.",
  },
  {
    question: "월드컵 성적은 왜 따로 다루나요?",
    answer:
      "메시는 2022 카타르 월드컵에서 우승했고 호날두는 우승 경력이 없어, 두 선수 비교에서 검색 수요와 관심이 가장 큰 항목이기 때문입니다. 다만 이는 국가대표 성적 중 하나일 뿐 선수 개인 기량의 전부를 의미하지는 않습니다.",
  },
  {
    question: "최근 경기 기록은 얼마나 자주 업데이트되나요?",
    answer:
      "두 선수 모두 현역으로 뛰고 있어 해트트릭 등 주요 경기 기록이 나올 때마다 '최근 업데이트' 영역을 갱신할 예정입니다. 통산 기록 전체는 기준 시점 단위로 정기 갱신합니다.",
  },
  {
    question: "왜 두 선수만 비교하나요?",
    answer:
      "메시와 호날두는 2000년대 후반부터 가장 오랜 기간 동시에 최상위권 기록을 유지해온 선수라 비교 검색 수요가 압도적으로 많습니다. 추후 다른 레전드 비교 리포트로 확장할 수 있습니다.",
  },
  {
    question: "클럽 통산 골과 클럽+국가대표 합산 골은 왜 따로 보여주나요?",
    answer:
      "클럽 기록만 비교하는 매체도 있고, 클럽과 국가대표를 합산해 '역대 최다골'을 발표하는 매체도 있어 기준이 다릅니다. 혼동을 막기 위해 두 기준을 분리해서 제공합니다.",
  },
];

export const MRCC_RELATED_LINKS = [
  {
    href: "/reports/korea-football-legends-salary-comparison-2026/",
    label: "손흥민·이강인과 역대 레전드 연봉 비교 보기",
  },
  {
    href: "/reports/son-heung-min-lafc-salary-net-worth-2026/",
    label: "손흥민 연봉 2026｜LAFC 주급·재산 추정",
  },
  {
    href: "/reports/lee-kang-in-psg-salary-2026/",
    label: "이강인 연봉 2026｜PSG 주급·실수령액",
  },
  {
    href: "/reports/worldcup-squad-salary-total-comparison-2026/",
    label: "월드컵 대표팀 연봉 총액 순위 보기",
  },
  {
    href: "/tools/worldcup-prize-money-calculator/",
    label: "월드컵 상금 계산기 보기",
  },
];
