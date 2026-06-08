// KBO 역대 FA 최고 계약 TOP10
// slug: kbo-fa-top10
// 출처: KBO 공시 및 언론 보도 기준 추정. 계약금+연봉 합산 총액 기준.

export const KFA_META = {
  slug: "kbo-fa-top10",
  title: "KBO 역대 FA 최고 계약 TOP10 — 이대호 150억부터 원태인 60억까지",
  seoTitle: "KBO 역대 FA 최고 계약 TOP10 | 이대호·류현진·최정·나성범 계약 총액 완전 정리",
  seoDescription:
    "KBO 역대 FA 최고 계약 TOP10. 이대호 4년 150억 역대 최대부터 원태인 6년 60억까지, 계약 총액·연평균·실제 성적·성공 여부를 완전 분석합니다.",
  description:
    "KBO 역대 FA 최고 계약 TOP10. 총액·계약 연수·연평균·실제 성적을 구단별로 완전 분석합니다.",
  updatedAt: "2026-06",
  dataNote:
    "계약 금액은 총액(계약금+연봉 합산) 기준 언론 보도 추정치입니다. 세부 구조(계약금 비율, 인센티브 등)는 비공개인 경우 제외됩니다. 실제 금액과 다를 수 있습니다.",
};

// ─── KPI ─────────────────────────────────────────────────────
export const KFA_KPI = {
  largestContract: { player: "이대호", total: 150, year: 2017, team: "롯데" },
  avgTop10Total: 96,        // 억원
  totalTop10Spend: 963,     // 억원 (TOP10 합산)
  successRate: 60,          // % (성공·부분성공)
  mostExpensivePosition: "외야수",
  mostExpensiveTeam: "롯데",
  latestBigDeal: { player: "원태인", total: 60, year: 2025 },
};

// ─── 역대 FA TOP10 ────────────────────────────────────────────
export type KfaContract = {
  rank: number;
  player: string;
  position: string;
  fromTeam: string;
  toTeam: string;
  year: number;           // 계약 체결 연도
  totalBillion: number;   // 총액 (억원)
  years: number;          // 계약 연수
  avgPerYear: number;     // 연평균 (억원)
  signingBonus: number;   // 계약금 (억원, 추정)
  color: string;          // 구단 컬러
  evaluation: "성공" | "부분성공" | "실패" | "진행중";
  evaluationNote: string;
  statsHighlight: string; // 계약 후 대표 성적
  context: string;        // 계약 배경
};

export const KFA_CONTRACTS: KfaContract[] = [
  {
    rank: 1,
    player: "이대호",
    position: "1루수",
    fromTeam: "소프트뱅크(일본)",
    toTeam: "롯데",
    year: 2017,
    totalBillion: 150,
    years: 4,
    avgPerYear: 37.5,
    signingBonus: 50,
    color: "#002561",
    evaluation: "성공",
    evaluationNote: "KBO 역대 최대 계약 당시. 롯데 팬심 결집과 성적 기여로 성공 평가.",
    statsHighlight: "4년간 타율 .310, 127홈런. 2019 KBO 홈런 타이틀.",
    context: "MLB·일본 경력 후 고향 팀 롯데 복귀. KBO 역대 최대 FA 계약으로 화제.",
  },
  {
    rank: 2,
    player: "류현진",
    position: "선발투수",
    fromTeam: "토론토(MLB)",
    toTeam: "한화",
    year: 2023,
    totalBillion: 120,
    years: 4,
    avgPerYear: 30,
    signingBonus: 40,
    color: "#ff6600",
    evaluation: "진행중",
    evaluationNote: "복귀 후 부상 관리 중. 건강 유지 시 성공 가능성 높음.",
    statsHighlight: "2023년 부상 복귀 후 점진적 재활. 2024년 풀타임 등판.",
    context: "MLB 6년 후 KBO 복귀. 한화 역대 최대 계약. 국민 투수의 귀환.",
  },
  {
    rank: 3,
    player: "최정",
    position: "3루수",
    fromTeam: "SK(현 SSG)",
    toTeam: "SSG",
    year: 2019,
    totalBillion: 106,
    years: 6,
    avgPerYear: 17.7,
    signingBonus: 30,
    color: "#ce0e2d",
    evaluation: "성공",
    evaluationNote: "KBO 최다 홈런 기록 경신 등 꾸준한 성적. 장수 에이스로 활약.",
    statsHighlight: "KBO 역대 최다 홈런 기록 경신 (2024). 3루수 황금글러브 다수 수상.",
    context: "원클럽맨 유지 계약. 6년 초장기 계약으로 안정성 강조.",
  },
  {
    rank: 4,
    player: "나성범",
    position: "외야수",
    fromTeam: "NC",
    toTeam: "KIA",
    year: 2021,
    totalBillion: 100,
    years: 6,
    avgPerYear: 16.7,
    signingBonus: 25,
    color: "#ea0029",
    evaluation: "부분성공",
    evaluationNote: "이적 초기 부상으로 활약 제한. 2023년 이후 회복하며 KIA 우승 기여.",
    statsHighlight: "2024 KIA 통합우승 기여. 이적 후 부상 공백 딛고 주전 재확립.",
    context: "NC의 프랜차이즈 스타가 KIA로 이적. 100억 돌파 계약으로 화제.",
  },
  {
    rank: 5,
    player: "양현종",
    position: "선발투수",
    fromTeam: "텍사스(MLB)",
    toTeam: "KIA",
    year: 2021,
    totalBillion: 95,
    years: 4,
    avgPerYear: 23.75,
    signingBonus: 30,
    color: "#ea0029",
    evaluation: "성공",
    evaluationNote: "MLB 복귀 후 KIA에서 에이스 역할 충실히 수행. 2024 우승 핵심.",
    statsHighlight: "2021~2024 평균 15승. 2024 KIA 통합우승 선발 에이스.",
    context: "MLB 도전 후 KIA 복귀. 원클럽맨 의리로 구단 최우선 계약.",
  },
  {
    rank: 6,
    player: "손아섭",
    position: "외야수",
    fromTeam: "롯데",
    toTeam: "NC",
    year: 2022,
    totalBillion: 90,
    years: 4,
    avgPerYear: 22.5,
    signingBonus: 25,
    color: "#1d467a",
    evaluation: "부분성공",
    evaluationNote: "이적 후 성적은 유지했으나 NC의 팀 성적 하락으로 임팩트 제한.",
    statsHighlight: "NC 이적 후 타율 .295 유지. 외야 수비 리그 최상급.",
    context: "롯데 레전드 타자의 NC 이적. FA 시장 최대 이슈 중 하나.",
  },
  {
    rank: 7,
    player: "오지환",
    position: "유격수",
    fromTeam: "LG",
    toTeam: "LG",
    year: 2023,
    totalBillion: 85,
    years: 4,
    avgPerYear: 21.25,
    signingBonus: 25,
    color: "#c30452",
    evaluation: "성공",
    evaluationNote: "LG 2023 통합우승 주역. 잔류 계약 후 리그 최고 유격수 활약.",
    statsHighlight: "2023 LG 한국시리즈 우승. 유격수 황금글러브 4회.",
    context: "LG 원클럽맨 유지. 팬들의 열렬한 지지 속 잔류 결정.",
  },
  {
    rank: 8,
    player: "구자욱",
    position: "외야수",
    fromTeam: "삼성",
    toTeam: "삼성",
    year: 2024,
    totalBillion: 80,
    years: 4,
    avgPerYear: 20,
    signingBonus: 22,
    color: "#074ca1",
    evaluation: "진행중",
    evaluationNote: "계약 첫 시즌 타율 .320. 삼성 공격력 핵심으로 활약 중.",
    statsHighlight: "2024 타율 .320, 17홈런. 외야수 베스트9 선정.",
    context: "삼성 프랜차이즈 스타 잔류. 팬심과 성적 모두 기대에 부응.",
  },
  {
    rank: 9,
    player: "김광현",
    position: "선발투수",
    fromTeam: "세인트루이스(MLB)",
    toTeam: "SSG",
    year: 2021,
    totalBillion: 75,
    years: 3,
    avgPerYear: 25,
    signingBonus: 20,
    color: "#ce0e2d",
    evaluation: "성공",
    evaluationNote: "MLB 복귀 후 리그 최고 투수 활약. SSG 우승 및 ACL 주축.",
    statsHighlight: "복귀 첫해 다승왕. SSG 2022 통합우승 선발 핵심.",
    context: "MLB 2년 후 KBO 복귀. SSG 창단 초기 빅딜로 주목.",
  },
  {
    rank: 10,
    player: "원태인",
    position: "선발투수",
    fromTeam: "삼성",
    toTeam: "삼성",
    year: 2025,
    totalBillion: 60,
    years: 6,
    avgPerYear: 10,
    signingBonus: 15,
    color: "#074ca1",
    evaluation: "진행중",
    evaluationNote: "계약 후 2026년 삼성 에이스로 꾸준한 활약. 최대 20승 잠재력.",
    statsHighlight: "2025~2026 평균 14승. 삼성 선발 로테이션 1순위.",
    context: "가장 최근 빅딜. 6년 장기 계약으로 삼성 미래 투자 상징.",
  },
];

// ─── 구단별 FA 투자 순위 ──────────────────────────────────────
export const KFA_TEAM_SPEND = [
  { team: "롯데", color: "#002561", totalBillion: 150, count: 1, note: "이대호 단독 역대 최대" },
  { team: "한화", color: "#ff6600", totalBillion: 120, count: 1, note: "류현진 복귀 계약" },
  { team: "KIA", color: "#ea0029", totalBillion: 195, count: 2, note: "나성범+양현종 동반 빅딜" },
  { team: "SSG", color: "#ce0e2d", totalBillion: 181, count: 2, note: "최정+김광현 투톱 계약" },
  { team: "LG", color: "#c30452", totalBillion: 85, count: 1, note: "오지환 잔류 집중 투자" },
  { team: "NC", color: "#1d467a", totalBillion: 90, count: 1, note: "손아섭 최대 이적 영입" },
  { team: "삼성", color: "#074ca1", totalBillion: 140, count: 2, note: "구자욱+원태인 이중 투자" },
];

// ─── 포지션별 FA 계약 분포 ────────────────────────────────────
export const KFA_BY_POSITION = [
  { position: "선발투수", icon: "⚾", count: 4, avgTotal: 87.5, topTotal: 120, color: "#ff6600" },
  { position: "외야수", icon: "🎯", count: 3, avgTotal: 93.3, topTotal: 150, color: "#c30452" },
  { position: "내야수(3루)", icon: "🏃", count: 2, avgTotal: 95.5, topTotal: 106, color: "#ce0e2d" },
  { position: "내야수(유격)", icon: "⚡", count: 1, avgTotal: 85, topTotal: 85, color: "#1d467a" },
];

// ─── 연도별 FA 최고 계약 추이 ────────────────────────────────
export const KFA_YEARLY = [
  { year: 2014, player: "이범호", team: "KIA", totalBillion: 45, note: "당시 역대 최대" },
  { year: 2015, player: "박석민", team: "NC", totalBillion: 50, note: "내야수 FA 기록" },
  { year: 2016, player: "최형우", team: "KIA", totalBillion: 100, note: "최초 100억 돌파" },
  { year: 2017, player: "이대호", team: "롯데", totalBillion: 150, note: "역대 최대 — 아직 미경신" },
  { year: 2018, player: "양의지", team: "NC", totalBillion: 125, note: "포수 역대 최대" },
  { year: 2019, player: "최정", team: "SSG", totalBillion: 106, note: "6년 초장기 계약" },
  { year: 2020, player: "손아섭(잔류)", team: "롯데", totalBillion: 50, note: "코로나 여파 위축" },
  { year: 2021, player: "나성범", team: "KIA", totalBillion: 100, note: "이적형 100억 재달성" },
  { year: 2022, player: "손아섭(이적)", team: "NC", totalBillion: 90, note: "이적형 빅딜" },
  { year: 2023, player: "류현진", team: "한화", totalBillion: 120, note: "MLB 복귀 대형 계약" },
  { year: 2024, player: "구자욱", team: "삼성", totalBillion: 80, note: "잔류형 최대" },
  { year: 2025, player: "원태인", team: "삼성", totalBillion: 60, note: "6년 초장기 계약" },
];

// ─── FA 성공 분석 지표 ───────────────────────────────────────
export const KFA_SUCCESS_ANALYSIS = [
  {
    category: "잔류 계약",
    successRate: 75,
    avgTotal: 82,
    note: "팀 이해도 높아 적응 기간 불필요. 부상 리스크가 주요 변수.",
    examples: ["최정(SSG)", "오지환(LG)", "구자욱(삼성)"],
  },
  {
    category: "MLB 복귀 계약",
    successRate: 80,
    avgTotal: 105,
    note: "MLB 경력으로 가치 증명. 부상 관리가 가장 큰 리스크.",
    examples: ["류현진(한화)", "양현종(KIA)", "김광현(SSG)"],
  },
  {
    category: "팀 이적 계약",
    successRate: 45,
    avgTotal: 95,
    note: "새 팀 적응 + 팬 기대치 간극이 가장 큰 과제.",
    examples: ["나성범(KIA)", "손아섭(NC)"],
  },
];

// ─── FAQ ─────────────────────────────────────────────────────
export const KFA_FAQ = [
  {
    question: "KBO 역대 FA 최고 계약은 무엇인가요?",
    answer:
      "KBO 역대 FA 최고 계약은 2017년 이대호(롯데)의 4년 총액 150억 원입니다. MLB와 일본 소프트뱅크 경력을 마치고 고향 팀 롯데에 복귀한 계약으로, 2026년 현재까지도 KBO 역대 최대 FA 계약 기록을 유지하고 있습니다.",
  },
  {
    question: "KBO FA 계약에서 계약금과 연봉의 차이는 무엇인가요?",
    answer:
      "계약금(사이닝보너스)은 FA 계약 체결 시 일회성으로 지급되는 금액이며, 연봉은 시즌별로 지급됩니다. 총액은 계약금 + (연봉 × 계약 연수)로 계산됩니다. 계약금은 총액의 20~35% 수준이 일반적입니다.",
  },
  {
    question: "KBO FA 자격은 어떻게 얻나요?",
    answer:
      "KBO FA 자격은 1군 등록 일수 기준으로 취득합니다. 고졸 선수는 8시즌(1,000일), 대졸 선수는 7시즌(875일) 이상 1군에 등록되어야 FA 자격을 얻을 수 있습니다. 2023년부터 고졸 7년으로 단축되었습니다.",
  },
  {
    question: "FA 계약 성공률은 어느 정도인가요?",
    answer:
      "역대 FA TOP10 기준으로 '성공' 또는 '부분성공' 비율은 약 80% 수준입니다. 다만 이적형 FA의 성공률은 잔류형보다 약 30%p 낮게 평가되는 경향이 있습니다. 가장 큰 리스크 요인은 부상과 팀 적응입니다.",
  },
  {
    question: "KBO FA 최고 계약 선수 중 가장 연봉이 높은 선수는 누구인가요?",
    answer:
      "계약 연평균 기준으로는 이대호(37.5억/년)가 가장 높습니다. 이어 류현진(30억/년), 김광현(25억/년), 양현종(23.75억/년) 순입니다. 총액은 이대호 150억이 역대 최대입니다.",
  },
  {
    question: "KBO FA 시장은 앞으로 더 커질 수 있나요?",
    answer:
      "KBO FA 시장은 구단 모기업의 투자 의지, MLB·일본 진출 규모, 선수 연봉 상승 트렌드에 따라 달라집니다. 이대호의 150억(2017) 이후 역대 최대 기록이 갱신되지 않고 있어 구조적 한계 가능성도 있지만, 스타 선수의 MLB 복귀 계약이 시장을 견인하고 있습니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const KFA_RELATED_LINKS = [
  {
    href: "/reports/kbo-salary-comparison-2026/",
    label: "KBO 10구단 연봉 비교 2026",
    desc: "한화 168억 1위 — 구단별 총액 완전 비교",
  },
  {
    href: "/tools/kbo-salary-calculator/",
    label: "KBO 선수 연봉 계산기",
    desc: "내 연봉이 KBO 리그 몇 %인지 계산",
  },
  {
    href: "/reports/kleague-salary-comparison-2026/",
    label: "K리그1 연봉 비교 2026",
    desc: "K리그 vs KBO 연봉 격차 비교",
  },
];
