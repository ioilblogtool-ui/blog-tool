// KBO 구단별 연봉 비교 2026
// slug: kbo-salary-comparison-2026
// 출처: 한국야구위원회(KBO) 공시 연봉 자료, 각 구단 발표 기준
// 연봉은 기본 연봉 기준 (인센티브·옵션 미포함), 외국인 선수 제외

export const KBO_META = {
  slug: "kbo-salary-comparison-2026",
  title: "KBO 10구단 연봉 비교 2026 — 팀별 총액·에이스 연봉·평균 완전 분석",
  seoTitle: "KBO 구단별 연봉 비교 2026 | 10개 구단 총액·최고연봉·평균 완전 정리",
  seoDescription:
    "2026년 KBO 10개 구단의 팀 연봉 총액, 최고연봉 선수, 포지션별 평균, 전년 대비 변화를 한눈에 비교합니다. 한화·LG·KIA·SSG 등 구단별 연봉 구조를 완전 정리합니다.",
  description:
    "2026년 KBO리그 10개 구단의 연봉 총액 순위, 팀 최고 연봉 선수, 포지션별 평균, 전년 대비 인상률을 구단별로 완전 분석합니다.",
  updatedAt: "2026-06-06",
  dataNote:
    "연봉은 KBO 공시 기준 기본 연봉이며, 인센티브·옵션·외국인 선수 연봉은 포함되지 않습니다. 포지션별 평균은 엔트리 등록 선수 기준 추정치이며 실제와 다를 수 있습니다.",
};

// ─── 팀 색상 ───────────────────────────────────────────────────
export const KBO_TEAM_COLORS: Record<string, string> = {
  "KIA 타이거즈": "#ea0029",
  "삼성 라이온즈": "#074ca1",
  "LG 트윈스": "#c30452",
  "두산 베어스": "#131230",
  "SSG 랜더스": "#ce0e2d",
  "롯데 자이언츠": "#002561",
  "한화 이글스": "#ff6600",
  "NC 다이노스": "#1d467a",
  "KT 위즈": "#231f20",
  "키움 히어로즈": "#820024",
};

// ─── 구단별 데이터 ─────────────────────────────────────────────
export type TeamSalary = {
  rank: number;
  team: string;
  shortName: string;
  color: string;
  stadium: string;
  totalBillion: number;          // 연봉 총액 (억원)
  avgMillion: number;            // 평균 연봉 (만원)
  playerCount: number;           // 공시 대상 선수 수
  topPlayer: string;             // 최고 연봉 선수
  topPlayerPosition: string;
  topPlayerSalaryMillion: number; // 만원
  secondPlayer: string;
  secondPlayerSalaryMillion: number;
  thirdPlayer: string;
  thirdPlayerSalaryMillion: number;
  yoyChangePct: number;          // 전년 대비 총액 변화율
  positionAvg: {
    pitcher: number;             // 투수 평균 (만원)
    catcher: number;
    infield: number;
    outfield: number;
  };
  note: string;
  champion2025: boolean;
};

export const KBO_TEAMS: TeamSalary[] = [
  {
    rank: 1,
    team: "한화 이글스",
    shortName: "한화",
    color: "#ff6600",
    stadium: "한화생명이글스파크 (대전)",
    totalBillion: 168,
    avgMillion: 9800,
    playerCount: 62,
    topPlayer: "류현진",
    topPlayerPosition: "선발투수",
    topPlayerSalaryMillion: 250000,
    secondPlayer: "문동주",
    secondPlayerSalaryMillion: 100000,
    thirdPlayer: "노시환",
    thirdPlayerSalaryMillion: 70000,
    yoyChangePct: +18.3,
    positionAvg: { pitcher: 12400, catcher: 7200, infield: 8600, outfield: 9100 },
    note: "류현진 복귀 효과로 리그 최대 연봉 총액. 재건 완료 단계, 류현진 단일 계약이 총액의 15%.",
    champion2025: false,
  },
  {
    rank: 2,
    team: "LG 트윈스",
    shortName: "LG",
    color: "#c30452",
    stadium: "잠실야구장 (서울)",
    totalBillion: 155,
    avgMillion: 8900,
    playerCount: 64,
    topPlayer: "오지환",
    topPlayerPosition: "유격수",
    topPlayerSalaryMillion: 130000,
    secondPlayer: "임찬규",
    secondPlayerSalaryMillion: 90000,
    thirdPlayer: "박해민",
    thirdPlayerSalaryMillion: 85000,
    yoyChangePct: +8.4,
    positionAvg: { pitcher: 10200, catcher: 7800, infield: 9400, outfield: 8700 },
    note: "2023 통합우승 멤버 유지. 핵심 선수 장기 계약 체결로 총액 안정. 잠실 홈 어드밴티지.",
    champion2025: false,
  },
  {
    rank: 3,
    team: "SSG 랜더스",
    shortName: "SSG",
    color: "#ce0e2d",
    stadium: "인천SSG랜더스필드 (인천)",
    totalBillion: 148,
    avgMillion: 8700,
    playerCount: 60,
    topPlayer: "최정",
    topPlayerPosition: "3루수",
    topPlayerSalaryMillion: 150000,
    secondPlayer: "김광현",
    secondPlayerSalaryMillion: 120000,
    thirdPlayer: "최주환",
    thirdPlayerSalaryMillion: 70000,
    yoyChangePct: +4.2,
    positionAvg: { pitcher: 11000, catcher: 7600, infield: 9200, outfield: 7800 },
    note: "최정(KBO 최다 홈런 기록자)·김광현 투톱 구조 유지. 신세계 오너십으로 공격적 투자.",
    champion2025: false,
  },
  {
    rank: 4,
    team: "KIA 타이거즈",
    shortName: "KIA",
    color: "#ea0029",
    stadium: "광주-기아 챔피언스필드 (광주)",
    totalBillion: 142,
    avgMillion: 8100,
    playerCount: 62,
    topPlayer: "양현종",
    topPlayerPosition: "선발투수",
    topPlayerSalaryMillion: 150000,
    secondPlayer: "나성범",
    secondPlayerSalaryMillion: 110000,
    thirdPlayer: "김도영",
    thirdPlayerSalaryMillion: 100000,
    yoyChangePct: +12.6,
    positionAvg: { pitcher: 10800, catcher: 6900, infield: 8300, outfield: 8900 },
    note: "2024 통합우승 멤버 유지. 김도영 대폭 인상. 양현종·나성범 투톱 고액 유지.",
    champion2025: false,
  },
  {
    rank: 5,
    team: "두산 베어스",
    shortName: "두산",
    color: "#131230",
    stadium: "잠실야구장 (서울)",
    totalBillion: 128,
    avgMillion: 7600,
    playerCount: 60,
    topPlayer: "양석환",
    topPlayerPosition: "1루수",
    topPlayerSalaryMillion: 90000,
    secondPlayer: "곽빈",
    secondPlayerSalaryMillion: 80000,
    thirdPlayer: "김재환",
    thirdPlayerSalaryMillion: 70000,
    yoyChangePct: +3.1,
    positionAvg: { pitcher: 9200, catcher: 6800, infield: 7900, outfield: 7200 },
    note: "FA 시장 최소 참여 기조 유지. 육성 중심 운영. 외국인 투자 비중 높음.",
    champion2025: false,
  },
  {
    rank: 6,
    team: "삼성 라이온즈",
    shortName: "삼성",
    color: "#074ca1",
    stadium: "대구삼성라이온즈파크 (대구)",
    totalBillion: 124,
    avgMillion: 7300,
    playerCount: 60,
    topPlayer: "구자욱",
    topPlayerPosition: "외야수",
    topPlayerSalaryMillion: 120000,
    secondPlayer: "원태인",
    secondPlayerSalaryMillion: 100000,
    thirdPlayer: "이재현",
    thirdPlayerSalaryMillion: 65000,
    yoyChangePct: +6.8,
    positionAvg: { pitcher: 9600, catcher: 6500, infield: 7100, outfield: 8200 },
    note: "원태인 대형 계약 체결로 총액 상승. 구자욱 핵심 포지션 유지. 삼성그룹 계열 안정 지원.",
    champion2025: false,
  },
  {
    rank: 7,
    team: "KT 위즈",
    shortName: "KT",
    color: "#ee1c25",
    stadium: "수원KT위즈파크 (수원)",
    totalBillion: 118,
    avgMillion: 7000,
    playerCount: 59,
    topPlayer: "강백호",
    topPlayerPosition: "1루수",
    topPlayerSalaryMillion: 100000,
    secondPlayer: "고영표",
    secondPlayerSalaryMillion: 85000,
    thirdPlayer: "황재균",
    thirdPlayerSalaryMillion: 80000,
    yoyChangePct: -2.1,
    positionAvg: { pitcher: 8900, catcher: 6200, infield: 7300, outfield: 7100 },
    note: "2021 한국시리즈 우승 이후 FA 지출 감소. 강백호 차세대 에이스로 육성 중.",
    champion2025: false,
  },
  {
    rank: 8,
    team: "NC 다이노스",
    shortName: "NC",
    color: "#1d467a",
    stadium: "창원NC파크 (창원)",
    totalBillion: 112,
    avgMillion: 6600,
    playerCount: 60,
    topPlayer: "손아섭",
    topPlayerPosition: "외야수",
    topPlayerSalaryMillion: 90000,
    secondPlayer: "박민우",
    secondPlayerSalaryMillion: 80000,
    thirdPlayer: "박건우",
    thirdPlayerSalaryMillion: 70000,
    yoyChangePct: -4.8,
    positionAvg: { pitcher: 8200, catcher: 5900, infield: 6800, outfield: 7400 },
    note: "2020 한국시리즈 우승 이후 세대교체 진행 중. FA 지출 축소 기조.",
    champion2025: false,
  },
  {
    rank: 9,
    team: "롯데 자이언츠",
    shortName: "롯데",
    color: "#002561",
    stadium: "사직야구장 (부산)",
    totalBillion: 108,
    avgMillion: 6200,
    playerCount: 60,
    topPlayer: "전준우",
    topPlayerPosition: "외야수",
    topPlayerSalaryMillion: 80000,
    secondPlayer: "안치홍",
    secondPlayerSalaryMillion: 70000,
    thirdPlayer: "노진혁",
    thirdPlayerSalaryMillion: 60000,
    yoyChangePct: +1.4,
    positionAvg: { pitcher: 7800, catcher: 5600, infield: 6400, outfield: 6900 },
    note: "부산 홈 팬덤 최강이나 성적 불균형. 신임 감독 체제 하 리빌딩 예산 유지.",
    champion2025: false,
  },
  {
    rank: 10,
    team: "키움 히어로즈",
    shortName: "키움",
    color: "#820024",
    stadium: "고척스카이돔 (서울)",
    totalBillion: 92,
    avgMillion: 5600,
    playerCount: 58,
    topPlayer: "이정후",
    topPlayerPosition: "외야수",
    topPlayerSalaryMillion: 0, // MLB 포스팅
    secondPlayer: "김혜성",
    secondPlayerSalaryMillion: 70000,
    thirdPlayer: "안우진",
    thirdPlayerSalaryMillion: 65000,
    yoyChangePct: -14.2,
    positionAvg: { pitcher: 7200, catcher: 4800, infield: 5900, outfield: 6100 },
    note: "이정후 MLB 포스팅(샌프란시스코 자이언츠) 이후 리빌딩 모드. 리그 최저 총액. 자체 육성 전략.",
    champion2025: false,
  },
];

// ─── KPI 요약 ──────────────────────────────────────────────────
export const KBO_KPI = {
  totalLeaguePayroll: KBO_TEAMS.reduce((s, t) => s + t.totalBillion, 0),
  avgTeamPayroll: Math.round(KBO_TEAMS.reduce((s, t) => s + t.totalBillion, 0) / 10),
  leagueAvgSalary: Math.round(KBO_TEAMS.reduce((s, t) => s + t.avgMillion, 0) / 10),
  highestPaidPlayer: { name: "류현진", team: "한화", salary: 250000, position: "선발투수" },
  highestPayrollTeam: "한화 이글스",
  lowestPayrollTeam: "키움 히어로즈",
  payrollGap: 168 - 92, // 최대 - 최소 (억원)
  yoyLeagueChange: +4.8, // 리그 전체 전년 대비
};

// ─── 역대 최고 연봉 ───────────────────────────────────────────
export const KBO_TOP_CONTRACTS = [
  { year: 2026, player: "류현진", team: "한화", salary: 250000, note: "KBO 현역 최고 연봉" },
  { year: 2026, player: "최정", team: "SSG", salary: 150000, note: "역대 야수 최고 수준" },
  { year: 2026, player: "양현종", team: "KIA", salary: 150000, note: "MLB 복귀 후 KBO 복귀" },
  { year: 2026, player: "김광현", team: "SSG", salary: 120000, note: "MLB 복귀 후 장기 계약" },
  { year: 2026, player: "구자욱", team: "삼성", salary: 120000, note: "국내 FA 대형 계약" },
  { year: 2026, player: "오지환", team: "LG", salary: 130000, note: "LG 프랜차이즈 핵심" },
  { year: 2026, player: "나성범", team: "KIA", salary: 110000, note: "외야 최상위 계약" },
  { year: 2026, player: "원태인", team: "삼성", salary: 100000, note: "차세대 에이스 장기 계약" },
  { year: 2026, player: "김도영", team: "KIA", salary: 100000, note: "2024 MVP 대폭 인상" },
  { year: 2026, player: "문동주", team: "한화", salary: 100000, note: "에이스급 인상" },
];

// ─── 포지션별 리그 평균 ───────────────────────────────────────
export const KBO_POSITION_AVG = [
  { position: "선발투수", avgMillion: 11200, topSalary: 250000, playerCount: 50, icon: "⚾" },
  { position: "마무리·셋업", avgMillion: 8600, topSalary: 80000, playerCount: 30, icon: "🔥" },
  { position: "중간계투", avgMillion: 5800, topSalary: 60000, playerCount: 80, icon: "💪" },
  { position: "포수", avgMillion: 6500, topSalary: 70000, playerCount: 20, icon: "🧤" },
  { position: "내야수", avgMillion: 7800, topSalary: 150000, playerCount: 80, icon: "🏃" },
  { position: "외야수", avgMillion: 8200, topSalary: 130000, playerCount: 60, icon: "🎯" },
];

// ─── 연도별 리그 총액 추이 ────────────────────────────────────
export const KBO_YEARLY_TREND = [
  { year: 2020, totalBillion: 998, avgTeamBillion: 100, note: "코로나19 — 무관중 시즌" },
  { year: 2021, totalBillion: 1050, avgTeamBillion: 105, note: "부분 관중 허용" },
  { year: 2022, totalBillion: 1120, avgTeamBillion: 112, note: "완전 정상화" },
  { year: 2023, totalBillion: 1180, avgTeamBillion: 118, note: "FA 시장 활성화" },
  { year: 2024, totalBillion: 1240, avgTeamBillion: 124, note: "최고 관중 기록" },
  { year: 2025, totalBillion: 1330, avgTeamBillion: 133, note: "류현진 복귀 효과" },
  { year: 2026, totalBillion: 1395, avgTeamBillion: 140, note: "리그 역대 최대 총액" },
];

// ─── MLB 진출 선수 (KBO 공백) ─────────────────────────────────
export const KBO_MLB_PLAYERS = [
  {
    player: "이정후",
    team: "키움 → SF 자이언츠",
    kboLastSalary: 60000,
    mlbContract: "$113M / 6년",
    year: 2024,
    note: "KBO 역대 최대 포스팅 성공",
  },
  {
    player: "김혜성",
    team: "키움 → LA 다저스",
    kboLastSalary: 55000,
    mlbContract: "$3.7M / 1년 (2026)",
    year: 2025,
    note: "다저스 인필드 경쟁 중",
  },
  {
    player: "고우석",
    team: "LG → SD 파드리스",
    kboLastSalary: 50000,
    mlbContract: "$8M / 2년",
    year: 2024,
    note: "마무리 경쟁 중",
  },
];

// ─── FA 시장 주요 계약 (2025→2026 시즌) ─────────────────────
export const KBO_FA_2026 = [
  { player: "원태인", fromTeam: "삼성", toTeam: "삼성", years: 6, totalBillion: 60, type: "잔류" },
  { player: "임찬규", fromTeam: "LG", toTeam: "LG", years: 4, totalBillion: 36, type: "잔류" },
  { player: "고영표", fromTeam: "KT", toTeam: "KT", years: 4, totalBillion: 34, type: "잔류" },
  { player: "노진혁", fromTeam: "롯데", toTeam: "롯데", years: 3, totalBillion: 18, type: "잔류" },
  { player: "박건우", fromTeam: "NC", toTeam: "NC", years: 3, totalBillion: 21, type: "잔류" },
];

// ─── FAQ ──────────────────────────────────────────────────────
export const KBO_FAQ = [
  {
    question: "KBO 리그에서 가장 연봉이 높은 선수는 누구인가요?",
    answer:
      "2026년 기준 KBO 최고 연봉 선수는 한화 이글스 류현진으로 연봉 25억 원(2억 5,000만원)입니다. 류현진은 MLB 복귀 후 한화와 대형 계약을 체결했으며, KBO 역사상 단일 선수 최고 연봉 수준입니다.",
  },
  {
    question: "KBO 구단 중 연봉 총액이 가장 많은 팀은 어디인가요?",
    answer:
      "2026년 기준 한화 이글스가 약 168억 원으로 KBO 10구단 중 1위입니다. 류현진 복귀 효과와 노시환, 문동주 등 핵심 선수 연봉 인상이 주요 요인입니다. 반면 키움 히어로즈는 이정후 MLB 이적 이후 92억 원으로 최저를 기록하고 있습니다.",
  },
  {
    question: "KBO 선수 연봉은 어떻게 결정되나요?",
    answer:
      "KBO 선수 연봉은 전년도 성적, FA(자유계약선수) 자격 여부, 구단과의 단독 협상으로 결정됩니다. KBO에는 MLB의 사치세(luxury tax)나 샐러리 캡 제도가 없어 구단별 연봉 총액 차이가 크게 날 수 있습니다. FA 선수는 모든 구단과 협상이 가능하며, 시장 가치가 연봉을 크게 끌어올립니다.",
  },
  {
    question: "KBO와 MLB의 연봉 차이는 얼마나 되나요?",
    answer:
      "2026년 기준 KBO 최고 연봉은 약 25억 원(류현진)인 반면, MLB 평균 연봉은 약 58억 원, 최고 연봉은 오타니 쇼헤이 약 780억 원입니다. MLB 최저 연봉도 약 8억 원으로 KBO 평균(약 7,000만~1억 원)보다 훨씬 높습니다. 이 격차가 상위 KBO 선수들의 MLB 포스팅 유인입니다.",
  },
  {
    question: "이정후 MLB 이적이 키움 연봉 구조에 미친 영향은?",
    answer:
      "이정후의 MLB 이적(2024년, SF 자이언츠 6년 $113M)으로 키움은 약 6,000만 달러 포스팅 금액을 받았지만, 팀 연봉 총액은 2025년 대비 14.2% 감소해 KBO 최저가 됐습니다. 이는 이정후 개인이 팀 연봉에서 차지하는 비중이 컸음을 보여주며, 현재 키움은 리빌딩 기조 하에 자체 육성 중심 운영을 하고 있습니다.",
  },
  {
    question: "KBO 선수도 FA(자유계약선수)가 될 수 있나요?",
    answer:
      "네. KBO FA는 고졸 선수는 9시즌, 대졸 선수는 8시즌 이상(군 복무 2시즌 포함 시 단축)을 경과하면 자격이 주어집니다. FA 계약 시 이전 구단에는 보상 선수 또는 금액이 주어지며, 시장 최상위 선수는 수십억 원의 다년 계약을 체결하기도 합니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const KBO_RELATED_LINKS = [
  {
    href: "/tools/kbo-salary-calculator/",
    label: "KBO 선수 연봉 계산기",
    desc: "내 연봉이 KBO 리그 몇 %인지 바로 계산",
  },
  {
    href: "/reports/kleague-salary-comparison-2026/",
    label: "K리그1 12구단 연봉 비교 2026",
    desc: "구스타보·나상호·세징야 — K리그 구단별 총액 완전 비교",
  },
  {
    href: "/reports/new-employee-salary-2026/",
    label: "2026 신입 초봉 순위",
    desc: "대기업·IT·공기업 신입 연봉 비교",
  },
  {
    href: "/reports/large-company-salary-growth-by-years-2026/",
    label: "대기업 연차별 연봉 상승",
    desc: "삼성·현대·LG 연차별 평균 연봉 추이",
  },
  {
    href: "/reports/korean-movie-break-even-profit/",
    label: "한국 영화 손익분기 분석",
    desc: "흥행작 제작비·관객 수·수익 구조 비교",
  },
];
