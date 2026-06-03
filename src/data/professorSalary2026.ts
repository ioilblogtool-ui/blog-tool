// ============================================================
// 대학교수 연봉 완전 정리 2026
// 출처: 교육부 사립대학 재정정보공시, 국립대 공무원보수규정,
//       대학알리미 공개 자료 참고 추정치
// 세후 추정: 미혼·부양가족 없음 기준
// ============================================================

export type ProfessorType = {
  id: "national" | "private_top" | "private_mid" | "private_local" | "adjunct";
  name: string;
  badge: string;
  description: string;
  annualMin: number;
  annualMax: number;
  pros: string[];
  cons: string[];
  colorVar: string;
};

export type RankRow = {
  rank: string;
  rankEn: string;
  yearsRange: string;
  nationalMin: number;
  nationalMax: number;
  privateTopMin: number;
  privateTopMax: number;
  note: string;
};

export type ResearchIncomeRow = {
  source: string;
  amount: string;
  condition: string;
  frequency: string;
};

export type UniversityRow = {
  group: string;
  universities: string;
  avgAnnual: number;
  note: string;
};

export type ProfessorFAQ = {
  q: string;
  a: string;
};

// ─── Meta ─────────────────────────────────────────────────
export const PF_META = {
  title: "대학교수 연봉 2026 — 국립·사립·직급별 완전 비교 | 비교계산소",
  description:
    "2026년 대학교수 연봉이 궁금하신가요? 조교수·부교수·교수 직급별 연봉, 국립대·사립대 차이, 연구비 수입까지 한눈에 비교합니다.",
} as const;

export const PF_HERO_STATS = {
  assistantProfAnnual: 65_000_000,
  associateProfAnnual: 85_000_000,
  fullProfAnnual: 110_000_000,
  adjunctPerCredit: 650_000,
} as const;

// ─── 대학 유형별 비교 ──────────────────────────────────────
export const PROFESSOR_TYPES: ProfessorType[] = [
  {
    id: "national",
    name: "국립대 교수",
    badge: "공무원",
    description: "서울대·부산대·경북대 등 국립대 소속. 공무원 신분으로 공무원연금 적용. 안정성 최상.",
    annualMin: 60_000_000,
    annualMax: 130_000_000,
    pros: ["공무원연금 적용", "정년 65세 보장", "국가 연구비 수주 용이"],
    cons: ["사립 상위권 대비 낮은 기본급", "승진 속도 느림", "지방 근무 비중 높음"],
    colorVar: "--pf-color-national",
  },
  {
    id: "private_top",
    name: "사립 상위권",
    badge: "SKY·주요사립",
    description: "연세대·고려대·성균관대·한양대 등 주요 사립대. 국립대보다 기본급 높고 연구 환경 우수.",
    annualMin: 75_000_000,
    annualMax: 160_000_000,
    pros: ["높은 기본급", "연구비 규모 큼", "서울 중심 위치"],
    cons: ["국민연금 적용 (공무원연금 미적용)", "대학별 재정 차이", "강의·행정 부담"],
    colorVar: "--pf-color-private-top",
  },
  {
    id: "private_mid",
    name: "사립 중위권",
    badge: "수도권 사립",
    description: "수도권 일반 사립대. 연봉 편차가 크고 대학 재정 상태에 따라 처우 차이 큼.",
    annualMin: 55_000_000,
    annualMax: 110_000_000,
    pros: ["수도권 위치", "직급 상승 기회"],
    cons: ["대학 재정 불안 가능", "연구비 규모 제한", "강의 부담 큼"],
    colorVar: "--pf-color-private-mid",
  },
  {
    id: "private_local",
    name: "지방 사립",
    badge: "지방 사립",
    description: "지방 소재 사립대. 학령인구 감소로 재정 압박 심화. 처우 하락 추세.",
    annualMin: 45_000_000,
    annualMax: 90_000_000,
    pros: ["상대적으로 낮은 경쟁", "지역 네트워크 구축"],
    cons: ["학생 감소로 재정 불안", "상대적으로 낮은 연봉", "연구 인프라 부족"],
    colorVar: "--pf-color-private-local",
  },
  {
    id: "adjunct",
    name: "시간강사",
    badge: "비전임",
    description: "전임교원이 아닌 시간강사·겸임교수. 강의료 기반. 처우 열악 이슈 지속.",
    annualMin: 10_000_000,
    annualMax: 35_000_000,
    pros: ["유연한 스케줄", "다수 대학 동시 강의 가능"],
    cons: ["고용 불안정", "4대보험 미보장(일부)", "연구 환경 없음"],
    colorVar: "--pf-color-adjunct",
  },
];

// ─── 직급별 연봉 비교 ──────────────────────────────────────
export const RANK_ROWS: RankRow[] = [
  {
    rank: "조교수",
    rankEn: "Assistant Professor",
    yearsRange: "임용 후 1~6년",
    nationalMin: 58_000_000,
    nationalMax: 75_000_000,
    privateTopMin: 65_000_000,
    privateTopMax: 90_000_000,
    note: "임용 심사 통과 후 시작. 연구 실적 압박 큼",
  },
  {
    rank: "부교수",
    rankEn: "Associate Professor",
    yearsRange: "6~12년차",
    nationalMin: 75_000_000,
    nationalMax: 95_000_000,
    privateTopMin: 85_000_000,
    privateTopMax: 115_000_000,
    note: "정년 심사(tenure) 통과 후 부교수 승진",
  },
  {
    rank: "교수",
    rankEn: "Full Professor",
    yearsRange: "12년차+",
    nationalMin: 90_000_000,
    nationalMax: 130_000_000,
    privateTopMin: 105_000_000,
    privateTopMax: 160_000_000,
    note: "정교수. 학과장·처장 등 보직 수당 추가 가능",
  },
  {
    rank: "석좌교수",
    rankEn: "Distinguished/Chair Professor",
    yearsRange: "최고 권위자",
    nationalMin: 120_000_000,
    nationalMax: 200_000_000,
    privateTopMin: 150_000_000,
    privateTopMax: 300_000_000,
    note: "별도 계약. 연구비·외부 강연료 별도. 소수 선발",
  },
];

// ─── 연구비·외부 수입 ──────────────────────────────────────
export const RESEARCH_INCOME: ResearchIncomeRow[] = [
  {
    source: "정부 연구과제 (NRF·IITP 등)",
    amount: "연 3,000만~2억+",
    condition: "과제 수주 성공 시",
    frequency: "과제당 1~5년",
  },
  {
    source: "산학협력 프로젝트",
    amount: "연 1,000만~5,000만",
    condition: "기업·기관과 계약 시",
    frequency: "프로젝트별",
  },
  {
    source: "외부 강연·자문료",
    amount: "회당 30만~500만+",
    condition: "인지도 높은 교수",
    frequency: "비정기",
  },
  {
    source: "저서·교재 인세",
    amount: "연 수백만~수천만",
    condition: "교재 채택 확산 시",
    frequency: "매년 정산",
  },
  {
    source: "학술상·포상금",
    amount: "건당 100만~1,000만",
    condition: "수상 시",
    frequency: "비정기",
  },
];

// ─── 대학별 연봉 그룹 ──────────────────────────────────────
export const UNIVERSITY_GROUPS: UniversityRow[] = [
  {
    group: "서울대·KAIST·POSTECH",
    universities: "서울대, KAIST, 포스텍",
    avgAnnual: 120_000_000,
    note: "국립이지만 연구중심대학 특성상 처우 우수",
  },
  {
    group: "SKY (연세·고려·성균관)",
    universities: "연세대, 고려대, 성균관대",
    avgAnnual: 115_000_000,
    note: "사립 최상위권. 기본급 높고 연구비 규모 큼",
  },
  {
    group: "주요 사립 (한양·중앙·경희 등)",
    universities: "한양, 중앙, 경희, 이화, 서강 등",
    avgAnnual: 95_000_000,
    note: "수도권 주요 사립. 연봉 편차 있음",
  },
  {
    group: "수도권 일반 사립",
    universities: "수도권 소재 일반 사립대",
    avgAnnual: 75_000_000,
    note: "대학 재정·순위에 따라 차이 큼",
  },
  {
    group: "지방 국립",
    universities: "부산대, 경북대, 전남대 등",
    avgAnnual: 85_000_000,
    note: "공무원 봉급표 기준. 안정적",
  },
  {
    group: "지방 사립",
    universities: "지방 소재 사립대",
    avgAnnual: 60_000_000,
    note: "학령인구 감소로 재정 압박. 편차 큼",
  },
];

// ─── FAQ ──────────────────────────────────────────────────
export const PROFESSOR_FAQ: ProfessorFAQ[] = [
  {
    q: "대학교수 평균 연봉은 얼마인가요?",
    a: "직급·대학별 편차가 매우 큽니다. 주요 사립대 정교수 기준 연 1억~1.5억, 조교수는 6,500만~9,000만 원 수준입니다. 지방 사립 조교수는 5,000만 원 초반도 있습니다.",
  },
  {
    q: "국립대 교수가 사립대보다 낮은 이유가 있나요?",
    a: "국립대는 공무원 봉급표를 따르기 때문에 기본급 자체가 사립 상위권보다 낮습니다. 그러나 공무원연금(사학연금보다 유리), 정년 65세 보장, 안정적인 연구 환경 등 비금전적 보상이 큽니다.",
  },
  {
    q: "연구비가 연봉에 포함되나요?",
    a: "직접적으로는 포함되지 않습니다. 연구과제비 중 인건비 항목으로 교수 본인에게 일부가 지급되는 구조입니다. 대형 과제를 여러 개 수주하는 교수는 기본급 외 수천만 원의 연구 인건비를 추가로 받을 수 있습니다.",
  },
  {
    q: "교수가 되기까지 얼마나 걸리나요?",
    a: "일반적으로 학사 4년 + 석사 2년 + 박사 3~5년 + 박사후연구원(포닥) 1~3년 = 최소 10~14년이 소요됩니다. 이후 공개채용 경쟁을 통해 임용되며 경쟁이 매우 치열합니다.",
  },
  {
    q: "정년 보장(테뉴어)은 어떻게 받나요?",
    a: "임용 후 보통 6~7년 안에 재임용·승진 심사를 받습니다. 연구 실적(논문·피인용수), 강의 평가, 봉사 활동이 심사 기준입니다. 탈락 시 대학을 떠나야 합니다.",
  },
  {
    q: "시간강사 처우는 어떤가요?",
    a: "강사법 시행(2019년) 이후 시간강사도 일정 수준의 고용 보장과 방학 중 급여를 받게 됐지만 여전히 열악합니다. 학점당 40만~70만 원 수준으로, 주 2~3강의로는 생계 유지가 어려운 경우가 많습니다.",
  },
];
