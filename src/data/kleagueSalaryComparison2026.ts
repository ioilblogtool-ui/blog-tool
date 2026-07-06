// K리그1 구단별 연봉 비교 2026
// slug: kleague-salary-comparison-2026
// 출처: 한국프로축구연맹(K리그) 공시 및 각 구단 발표 기준
// 연봉은 기본 연봉 기준 추정치. 외국인 선수 별도 표기.

export const KLE_META = {
  slug: "kleague-salary-comparison-2026",
  title: "K리그1 구단순위·연봉순위 2026 — 12구단 총액·최고연봉 비교",
  seoTitle: "K리그1 구단순위·연봉순위 2026 | 12구단 총액 비교",
  seoDescription:
    "2026년 K리그1 구단순위와 연봉순위를 함께 확인하세요. 12개 구단 연봉 총액, 최고 연봉 선수, 외국인 선수 계약, KBO 비교까지 정리했습니다.",
  description:
    "2026년 K리그1 구단순위 흐름과 12개 구단의 연봉 총액 순위, 팀 최고 연봉 선수, 포지션별 평균, 주요 외국인 선수 계약액을 구단별로 분석합니다.",
  updatedAt: "2026-06-08",
  dataNote:
    "연봉은 K리그 공시 및 언론 보도 기준 추정치이며, 옵션·인센티브·이적료는 포함되지 않습니다. 외국인 선수 연봉은 공개 계약 기준 추정이며 실제와 다를 수 있습니다.",
};

// ─── 팀 색상 ────────────────────────────────────────────────────
export const KLE_TEAM_COLORS: Record<string, string> = {
  "전북 현대 모터스": "#1a3a6b",
  "울산 HD FC": "#004a9f",
  "FC 서울": "#c1272d",
  "수원 삼성 블루윙즈": "#00469b",
  "포항 스틸러스": "#001f5b",
  "인천 유나이티드": "#0047a0",
  "제주 유나이티드": "#f26522",
  "강원 FC": "#2b5ba8",
  "대전 하나 시티즌": "#ff6600",
  "광주 FC": "#f7941d",
  "대구 FC": "#00a3e0",
  "수원 FC": "#005bac",
};

// ─── 구단 데이터 타입 ─────────────────────────────────────────
export type KleTeamSalary = {
  rank: number;
  team: string;
  shortName: string;
  color: string;
  stadium: string;
  totalBillion: number;          // 연봉 총액 (억원)
  avgMillion: number;            // 평균 연봉 (만원)
  playerCount: number;           // 공시 대상 선수 수
  topPlayer: string;
  topPlayerPosition: string;
  topPlayerSalaryMillion: number; // 만원
  secondPlayer: string;
  secondPlayerSalaryMillion: number;
  thirdPlayer: string;
  thirdPlayerSalaryMillion: number;
  yoyChangePct: number;
  positionAvg: {
    fw: number;   // 공격수 (만원)
    mf: number;   // 미드필더
    df: number;   // 수비수
    gk: number;   // 골키퍼
  };
  foreignPlayers: number;        // 등록 외국인 수
  topForeignPlayer: string;
  topForeignNation: string;
  topForeignSalaryMillion: number;
  note: string;
  champion2025: boolean;
};

export const KLE_TEAMS: KleTeamSalary[] = [
  {
    rank: 1,
    team: "전북 현대 모터스",
    shortName: "전북",
    color: "#1a3a6b",
    stadium: "전주월드컵경기장 (전주)",
    totalBillion: 112,
    avgMillion: 12200,
    playerCount: 31,
    topPlayer: "한교원",
    topPlayerPosition: "공격형 미드필더",
    topPlayerSalaryMillion: 38000,
    secondPlayer: "이동준",
    secondPlayerSalaryMillion: 30000,
    thirdPlayer: "박진섭",
    thirdPlayerSalaryMillion: 22000,
    yoyChangePct: +9.8,
    positionAvg: { fw: 16400, mf: 13200, df: 10800, gk: 8600 },
    foreignPlayers: 4,
    topForeignPlayer: "구스타보",
    topForeignNation: "브라질",
    topForeignSalaryMillion: 48000,
    note: "K리그 최다 우승 구단. 현대자동차그룹 지원 구조 안정. 외국인 에이스 구스타보 중심의 공격력.",
    champion2025: false,
  },
  {
    rank: 2,
    team: "울산 HD FC",
    shortName: "울산",
    color: "#004a9f",
    stadium: "울산문수축구경기장 (울산)",
    totalBillion: 102,
    avgMillion: 11400,
    playerCount: 30,
    topPlayer: "엄원상",
    topPlayerPosition: "윙어",
    topPlayerSalaryMillion: 36000,
    secondPlayer: "설영우",
    secondPlayerSalaryMillion: 28000,
    thirdPlayer: "이동경",
    thirdPlayerSalaryMillion: 22000,
    yoyChangePct: +6.3,
    positionAvg: { fw: 15600, mf: 12400, df: 10200, gk: 7800 },
    foreignPlayers: 4,
    topForeignPlayer: "레오나르도",
    topForeignNation: "브라질",
    topForeignSalaryMillion: 42000,
    note: "2023·2024 ACL 우승 경력. 엄원상·설영우 국가대표 라인 유지. HD현대 모그룹 투자 지속.",
    champion2025: true,
  },
  {
    rank: 3,
    team: "FC 서울",
    shortName: "서울",
    color: "#c1272d",
    stadium: "서울월드컵경기장 (서울)",
    totalBillion: 97,
    avgMillion: 10800,
    playerCount: 30,
    topPlayer: "나상호",
    topPlayerPosition: "윙어",
    topPlayerSalaryMillion: 34000,
    secondPlayer: "황현수",
    secondPlayerSalaryMillion: 24000,
    thirdPlayer: "오스마르",
    thirdPlayerSalaryMillion: 20000,
    yoyChangePct: +4.1,
    positionAvg: { fw: 14800, mf: 11600, df: 9800, gk: 7400 },
    foreignPlayers: 4,
    topForeignPlayer: "팔로세비치",
    topForeignNation: "세르비아",
    topForeignSalaryMillion: 40000,
    note: "서울 홈 마케팅 최고. 나상호 핵심 유지. GS그룹 오너십. 관중 동원 1위 구단.",
    champion2025: false,
  },
  {
    rank: 4,
    team: "수원 삼성 블루윙즈",
    shortName: "수원삼성",
    color: "#00469b",
    stadium: "수원월드컵경기장 (수원)",
    totalBillion: 84,
    avgMillion: 9600,
    playerCount: 29,
    topPlayer: "안병준",
    topPlayerPosition: "공격수",
    topPlayerSalaryMillion: 28000,
    secondPlayer: "이기제",
    secondPlayerSalaryMillion: 22000,
    thirdPlayer: "박형진",
    thirdPlayerSalaryMillion: 18000,
    yoyChangePct: +3.6,
    positionAvg: { fw: 13200, mf: 10400, df: 8600, gk: 6800 },
    foreignPlayers: 3,
    topForeignPlayer: "뮬러",
    topForeignNation: "독일",
    topForeignSalaryMillion: 36000,
    note: "삼성전자 지원. 안병준·이기제 국가대표 라인. 수원 홈 팬덤 강세. K2 강등 후 재건 완료.",
    champion2025: false,
  },
  {
    rank: 5,
    team: "포항 스틸러스",
    shortName: "포항",
    color: "#001f5b",
    stadium: "포항스틸야드 (포항)",
    totalBillion: 75,
    avgMillion: 8800,
    playerCount: 28,
    topPlayer: "이승모",
    topPlayerPosition: "중앙 미드필더",
    topPlayerSalaryMillion: 24000,
    secondPlayer: "김인성",
    secondPlayerSalaryMillion: 20000,
    thirdPlayer: "박승욱",
    thirdPlayerSalaryMillion: 16000,
    yoyChangePct: +5.2,
    positionAvg: { fw: 12600, mf: 9800, df: 7800, gk: 6400 },
    foreignPlayers: 4,
    topForeignPlayer: "무사",
    topForeignNation: "나이지리아",
    topForeignSalaryMillion: 32000,
    note: "POSCO 그룹 지원. 아카데미 육성 강점. 이승모 국가대표 핵심. ACL 단골 출전팀.",
    champion2025: false,
  },
  {
    rank: 6,
    team: "인천 유나이티드",
    shortName: "인천",
    color: "#0047a0",
    stadium: "인천축구전용경기장 (인천)",
    totalBillion: 66,
    avgMillion: 8000,
    playerCount: 27,
    topPlayer: "이명주",
    topPlayerPosition: "중앙 미드필더",
    topPlayerSalaryMillion: 22000,
    secondPlayer: "김도혁",
    secondPlayerSalaryMillion: 18000,
    thirdPlayer: "정승현",
    thirdPlayerSalaryMillion: 15000,
    yoyChangePct: +7.8,
    positionAvg: { fw: 11400, mf: 8800, df: 7200, gk: 5800 },
    foreignPlayers: 4,
    topForeignPlayer: "무고사",
    topForeignNation: "나이지리아",
    topForeignSalaryMillion: 34000,
    note: "무고사 계속 활약. 이명주 MF 핵심. 인천시 지원 구조 안정화. 리그 중위권 꾸준 유지.",
    champion2025: false,
  },
  {
    rank: 7,
    team: "제주 유나이티드",
    shortName: "제주",
    color: "#f26522",
    stadium: "제주월드컵경기장 (제주)",
    totalBillion: 62,
    avgMillion: 7600,
    playerCount: 27,
    topPlayer: "주민규",
    topPlayerPosition: "공격수",
    topPlayerSalaryMillion: 28000,
    secondPlayer: "이창민",
    secondPlayerSalaryMillion: 18000,
    thirdPlayer: "최영준",
    thirdPlayerSalaryMillion: 14000,
    yoyChangePct: +2.4,
    positionAvg: { fw: 12800, mf: 8200, df: 6800, gk: 5600 },
    foreignPlayers: 3,
    topForeignPlayer: "아길라르",
    topForeignNation: "에콰도르",
    topForeignSalaryMillion: 30000,
    note: "주민규 K리그 최다득점 경쟁. 특급 외국인 의존도 높은 구조. 도민 구단 특성상 마케팅 제한적.",
    champion2025: false,
  },
  {
    rank: 8,
    team: "강원 FC",
    shortName: "강원",
    color: "#2b5ba8",
    stadium: "춘천송암스포츠타운 (춘천)",
    totalBillion: 54,
    avgMillion: 7000,
    playerCount: 26,
    topPlayer: "양현준",
    topPlayerPosition: "윙어",
    topPlayerSalaryMillion: 24000,
    secondPlayer: "김대원",
    secondPlayerSalaryMillion: 18000,
    thirdPlayer: "한국영",
    thirdPlayerSalaryMillion: 14000,
    yoyChangePct: +8.6,
    positionAvg: { fw: 11200, mf: 7600, df: 6200, gk: 5200 },
    foreignPlayers: 3,
    topForeignPlayer: "발로군",
    topForeignNation: "나이지리아",
    topForeignSalaryMillion: 26000,
    note: "양현준·김대원 국가대표 배출 구단. 육성 중심 운영. 강원도청 지원. 중소 시장 한계 내 효율 극대화.",
    champion2025: false,
  },
  {
    rank: 9,
    team: "대전 하나 시티즌",
    shortName: "대전",
    color: "#ff6600",
    stadium: "DGB대전월드컵경기장 (대전)",
    totalBillion: 49,
    avgMillion: 6600,
    playerCount: 25,
    topPlayer: "이진용",
    topPlayerPosition: "공격수",
    topPlayerSalaryMillion: 20000,
    secondPlayer: "박수일",
    secondPlayerSalaryMillion: 15000,
    thirdPlayer: "조유민",
    thirdPlayerSalaryMillion: 12000,
    yoyChangePct: +11.4,
    positionAvg: { fw: 10400, mf: 7000, df: 5800, gk: 4800 },
    foreignPlayers: 3,
    topForeignPlayer: "아마두",
    topForeignNation: "세네갈",
    topForeignSalaryMillion: 24000,
    note: "하나금융그룹 지원. K1 복귀 후 안정화 단계. 이진용 중심 공격력. 외국인 자원 활발 활용.",
    champion2025: false,
  },
  {
    rank: 10,
    team: "광주 FC",
    shortName: "광주",
    color: "#f7941d",
    stadium: "광주축구전용경기장 (광주)",
    totalBillion: 46,
    avgMillion: 6200,
    playerCount: 25,
    topPlayer: "엄지성",
    topPlayerPosition: "윙어",
    topPlayerSalaryMillion: 18000,
    secondPlayer: "이순민",
    secondPlayerSalaryMillion: 14000,
    thirdPlayer: "두현석",
    thirdPlayerSalaryMillion: 11000,
    yoyChangePct: +4.5,
    positionAvg: { fw: 9800, mf: 6800, df: 5600, gk: 4600 },
    foreignPlayers: 3,
    topForeignPlayer: "펠리페",
    topForeignNation: "브라질",
    topForeignSalaryMillion: 22000,
    note: "광주광역시 지원 구단. 엄지성 핵심 유지. 유망주 육성 집중. 예산 대비 효율 높은 구단으로 평가.",
    champion2025: false,
  },
  {
    rank: 11,
    team: "대구 FC",
    shortName: "대구",
    color: "#00a3e0",
    stadium: "DGB파크 (대구)",
    totalBillion: 43,
    avgMillion: 5800,
    playerCount: 25,
    topPlayer: "세징야",
    topPlayerPosition: "공격형 미드필더",
    topPlayerSalaryMillion: 32000,
    secondPlayer: "박병현",
    secondPlayerSalaryMillion: 14000,
    thirdPlayer: "황순민",
    thirdPlayerSalaryMillion: 11000,
    yoyChangePct: -2.1,
    positionAvg: { fw: 10200, mf: 6800, df: 5400, gk: 4400 },
    foreignPlayers: 3,
    topForeignPlayer: "세징야",
    topForeignNation: "브라질",
    topForeignSalaryMillion: 32000,
    note: "세징야 한 명에 의존하는 외국인 구조. 대구시 지원. 재정 압박으로 총액 소폭 감소. 육성 강화 시도.",
    champion2025: false,
  },
  {
    rank: 12,
    team: "수원 FC",
    shortName: "수원FC",
    color: "#005bac",
    stadium: "수원종합운동장 (수원)",
    totalBillion: 38,
    avgMillion: 5400,
    playerCount: 24,
    topPlayer: "이현일",
    topPlayerPosition: "중앙 미드필더",
    topPlayerSalaryMillion: 16000,
    secondPlayer: "양동현",
    secondPlayerSalaryMillion: 14000,
    thirdPlayer: "김건웅",
    thirdPlayerSalaryMillion: 10000,
    yoyChangePct: +6.2,
    positionAvg: { fw: 9200, mf: 6200, df: 5000, gk: 4000 },
    foreignPlayers: 3,
    topForeignPlayer: "로빈",
    topForeignNation: "코트디부아르",
    topForeignSalaryMillion: 18000,
    note: "수원삼성과 도시 공유 경쟁 구도. 시민 구단 특성. 총액 최하위지만 효율 운영 모델. 강등권 탈출 목표.",
    champion2025: false,
  },
];

// ─── 리그 KPI ─────────────────────────────────────────────────
export const KLE_KPI = {
  totalLeaguePayroll: 832,         // 12구단 합산 (억원)
  avgTeamPayroll: 69,
  yoyLeagueChange: 5.8,
  leagueAvgSalary: 83000,          // 만원 (선수 평균)
  highestPaidPlayer: { name: "구스타보", team: "전북", salary: 480000 }, // 만원
  highestPayrollTeam: "전북 현대",
  lowestPayrollTeam: "수원 FC",
  payrollGap: 74,
  totalForeignPlayers: 41,
};

// ─── 리그 연봉 TOP 10 ─────────────────────────────────────────
export const KLE_TOP_CONTRACTS = [
  { player: "구스타보", team: "전북", position: "공격수", salary: 480000, nation: "브라질", note: "K리그 최고연봉 외국인. 전북 공격 에이스" },
  { player: "레오나르도", team: "울산", position: "공격수", salary: 420000, nation: "브라질", note: "울산 최전방 핵심. ACL 경력" },
  { player: "팔로세비치", team: "서울", position: "공격형 미드필더", salary: 400000, nation: "세르비아", note: "서울 창의적 플레이메이커" },
  { player: "나상호", team: "서울", position: "윙어", salary: 340000, nation: "한국", note: "국가대표 핵심 윙어. 서울 최고 연봉 한국인" },
  { player: "한교원", team: "전북", position: "공격형 미드필더", salary: 380000, nation: "한국", note: "전북 레전드. K리그 최장수 에이스 중 한 명" },
  { player: "엄원상", team: "울산", position: "윙어", salary: 360000, nation: "한국", note: "국가대표 주전 윙어. 스피드형 공격수" },
  { player: "세징야", team: "대구", position: "공격형 미드필더", salary: 320000, nation: "브라질", note: "대구 원클럽맨. K리그 외국인 레전드" },
  { player: "주민규", team: "제주", position: "공격수", salary: 280000, nation: "한국", note: "K리그 득점왕 경험. 제주 최고 연봉" },
  { player: "안병준", team: "수원삼성", position: "공격수", salary: 280000, nation: "한국", note: "수원삼성 최전방 핵심. 국가대표 경험" },
  { player: "설영우", team: "울산", position: "측면 수비수", salary: 280000, nation: "한국", note: "국가대표 주전 레프트백. 공수 겸비" },
];

// ─── 포지션별 리그 평균 ───────────────────────────────────────
export const KLE_POSITION_AVG = [
  { position: "공격수 (FW)", icon: "⚽", avgMillion: 13800, topSalary: 480000, playerCount: 72 },
  { position: "미드필더 (MF)", icon: "🎯", avgMillion: 9600, topSalary: 400000, playerCount: 108 },
  { position: "수비수 (DF)", icon: "🛡️", avgMillion: 7400, topSalary: 280000, playerCount: 120 },
  { position: "골키퍼 (GK)", icon: "🧤", avgMillion: 6000, topSalary: 140000, playerCount: 36 },
];

// ─── 주요 외국인 선수 ─────────────────────────────────────────
export type KleeForeignPlayer = {
  player: string;
  team: string;
  nation: string;
  position: string;
  salaryMillion: number;
  prevLeague: string;
  note: string;
};

export const KLE_FOREIGN_PLAYERS: KleeForeignPlayer[] = [
  {
    player: "구스타보",
    team: "전북",
    nation: "🇧🇷 브라질",
    position: "공격수",
    salaryMillion: 480000,
    prevLeague: "중국 슈퍼리그",
    note: "K리그 최고 연봉 외국인. 강력한 피지컬과 결정력.",
  },
  {
    player: "레오나르도",
    team: "울산",
    nation: "🇧🇷 브라질",
    position: "공격수",
    salaryMillion: 420000,
    prevLeague: "J리그",
    note: "J리그에서 K리그로 이적. 울산 최전방 핵심. ACL 경험 풍부.",
  },
  {
    player: "팔로세비치",
    team: "서울",
    nation: "🇷🇸 세르비아",
    position: "공격형 미드필더",
    salaryMillion: 400000,
    prevLeague: "세르비아 슈퍼리가",
    note: "창의적 플레이메이커. 서울 빌드업 핵심 역할.",
  },
  {
    player: "무고사",
    team: "인천",
    nation: "🇳🇬 나이지리아",
    position: "공격수",
    salaryMillion: 340000,
    prevLeague: "K리그 (잔류)",
    note: "인천 오랜 에이스. 강력한 헤더와 피지컬로 수비 파괴.",
  },
  {
    player: "세징야",
    team: "대구",
    nation: "🇧🇷 브라질",
    position: "공격형 미드필더",
    salaryMillion: 320000,
    prevLeague: "K리그 (잔류)",
    note: "대구 원클럽맨 레전드. K리그 최장수 외국인 중 한 명.",
  },
  {
    player: "아길라르",
    team: "제주",
    nation: "🇪🇨 에콰도르",
    position: "미드필더",
    salaryMillion: 300000,
    prevLeague: "MLS",
    note: "MLS 경험 보유. 기술력·체력 겸비한 박스투박스 미드필더.",
  },
];

// ─── 연도별 리그 총액 추이 ────────────────────────────────────
export const KLE_YEARLY_TREND = [
  { year: 2020, totalBillion: 542, note: "코로나 영향 무관중 시즌" },
  { year: 2021, totalBillion: 578, note: "부분 관중 재개" },
  { year: 2022, totalBillion: 634, note: "완전 정상화" },
  { year: 2023, totalBillion: 692, note: "외국인 계약 증가" },
  { year: 2024, totalBillion: 748, note: "최초 700억 돌파" },
  { year: 2025, totalBillion: 786, note: "ACL 투자 확대" },
  { year: 2026, totalBillion: 832, note: "역대 최대 — 12구단 합산" },
];

// ─── 주요 이적 2025-2026 ─────────────────────────────────────
export const KLE_TRANSFERS_2026 = [
  { player: "엄원상", fromTeam: "울산", toTeam: "울산", type: "잔류", fee: "비공개", note: "국가대표 주전 윙어 잔류 계약" },
  { player: "이동경", fromTeam: "해외", toTeam: "울산", type: "복귀", fee: "비공개", note: "해외 진출 후 K리그 컴백" },
  { player: "나상호", fromTeam: "서울", toTeam: "서울", type: "잔류", fee: "비공개", note: "서울 핵심 유지 장기 계약" },
  { player: "주민규", fromTeam: "제주", toTeam: "제주", type: "잔류", fee: "비공개", note: "K리그 득점왕 후보 잔류" },
  { player: "양현준", fromTeam: "강원", toTeam: "강원", type: "잔류", fee: "비공개", note: "국가대표 발탁 후 잔류 결정" },
  { player: "안병준", fromTeam: "수원삼성", toTeam: "수원삼성", type: "잔류", fee: "비공개", note: "수원삼성 공격 핵심 연장" },
];

// ─── KBO vs K리그 비교 ────────────────────────────────────────
export const KLE_VS_KBO = {
  kleagueTotalPayroll: 832,    // 억원
  kboTotalPayroll: 1395,       // 억원
  kleagueAvgTeam: 69,          // 억원
  kboAvgTeam: 140,
  kleagueTopPlayer: { name: "구스타보", salary: 4.8 }, // 억원
  kboTopPlayer: { name: "류현진", salary: 25 },
  kleagueAvgPlayer: 0.83,      // 억원
  kboAvgPlayer: 1.4,
  note: "K리그는 KBO 대비 리그 총액이 약 60% 수준이지만, 외국인 선수 비중이 높고 리그 규모(12팀 vs 10팀) 차이를 고려해야 합니다.",
};

// ─── FAQ ─────────────────────────────────────────────────────
export const KLE_FAQ = [
  {
    question: "K리그1에서 가장 연봉이 높은 구단은 어디인가요?",
    answer:
      "2026년 기준 전북 현대 모터스가 약 112억 원으로 K리그1 최고 총액 구단입니다. 현대자동차그룹의 안정적인 지원과 외국인 에이스 구스타보 영입 등으로 K리그 최상위 투자를 유지하고 있습니다.",
  },
  {
    question: "K리그 외국인 선수와 한국인 선수의 연봉 차이는 어느 정도인가요?",
    answer:
      "K리그1에서 외국인 에이스 선수의 연봉은 한국인 최고 연봉 선수보다 1.2~1.5배 높은 경우가 많습니다. 구스타보(브라질, 약 4.8억)가 리그 최고 연봉이며, 한국인 최고 연봉은 한교원(전북, 약 3.8억) 수준입니다.",
  },
  {
    question: "K리그와 KBO 중 어느 리그가 선수 연봉이 더 높나요?",
    answer:
      "전체 리그 총액 기준으로 KBO(약 1,395억)가 K리그(약 832억)보다 약 1.7배 높습니다. 구단당 평균도 KBO 140억 vs K리그 69억으로 KBO가 2배 수준입니다. 최고 연봉 선수도 류현진(KBO, 25억) vs 구스타보(K리그, 4.8억)로 큰 차이가 있습니다.",
  },
  {
    question: "K리그 선수들이 해외 리그로 이적하면 연봉이 얼마나 오르나요?",
    answer:
      "K리그 상위 선수가 유럽 중하위 리그로 이적하면 연봉이 2~5배 증가하는 경우가 많습니다. 이강인(파리 생제르맹)처럼 빅클럽으로 이적 시 10배 이상 차이가 나기도 합니다. 반면 J리그·중국 슈퍼리그는 K리그와 비슷하거나 소폭 높은 수준입니다.",
  },
  {
    question: "K리그 포지션별로 연봉 차이가 있나요?",
    answer:
      "공격수(FW)가 평균 1억3,800만원으로 가장 높고, 미드필더(MF) 9,600만원, 수비수(DF) 7,400만원, 골키퍼(GK) 6,000만원 순입니다. 골을 직접 만들어내는 포지션일수록 연봉이 높은 경향이 있습니다.",
  },
  {
    question: "K리그1 승강 팀은 연봉에 어떤 영향을 받나요?",
    answer:
      "K리그1로 승격한 팀은 외국인 선수 영입과 주전 선수 연봉 인상으로 총액이 급격히 늘어납니다. 반대로 K리그2로 강등된 팀은 핵심 선수 유출과 계약 해지로 총액이 20~40% 감소하는 경향이 있습니다.",
  },
  {
    question: "K리그 외국인 선수 보유 한도는 어떻게 되나요?",
    answer:
      "K리그1 구단은 외국인 선수를 최대 5명(아시아 쿼터 1명 포함)까지 등록할 수 있으며, 동시에 3명까지 출전 가능합니다. 대부분의 구단은 3~4명의 외국인 선수를 보유하며 공격진에 집중 배치합니다.",
  },
];

// ─── 관련 링크 ────────────────────────────────────────────────
export const KLE_RELATED_LINKS = [
  {
    href: "/reports/kbo-salary-comparison-2026/",
    label: "KBO 10구단 연봉 비교 2026",
    desc: "한화 168억 1위 — KBO 10개 구단 연봉 총액 완전 비교",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령액 계산기",
    desc: "K리그 연봉으로 실제 받는 금액 계산",
  },
  {
    href: "/tools/bonus-after-tax-calculator/",
    label: "세후 보너스 계산기",
    desc: "성과급·사이닝보너스 세후 실수령액",
  },
];
