// ============================================================
// 군인 계급별 연봉·월급 완전 정리 2026
// 출처: 국방부 군인보수법, 2026년 군인 봉급표 (2026.1.1 기준)
// 병사 봉급: 2026년 인상분 반영
// 세후 추정: 미혼·부양가족 없음 기준
// ============================================================

export type SoldierPay = {
  rank: string;
  rankEn: string;
  monthlyBase: number;
  monthlyNet: number;
  serviceMonths: string;
  note: string;
};

export type NCOStep = {
  rank: string;
  step: number;
  monthlyBase: number;
  annualGross: number;
  monthlyNet: number;
  note?: string;
};

export type OfficerStep = {
  rank: string;
  rankGroup: "위관" | "영관" | "장성";
  step: number;
  monthlyBase: number;
  annualGross: number;
  monthlyNet: number;
  note?: string;
};

export type MilitaryAllowance = {
  name: string;
  amount: string;
  condition: string;
  type: "fixed" | "special" | "annual";
};

export type CivilianCompRow = {
  category: string;
  military: string;
  civilian: string;
  note: string;
};

export type MilitaryFAQ = {
  q: string;
  a: string;
};

// ─── Meta ─────────────────────────────────────────────────
export const ML_META = {
  title: "군인 월급·연봉 2026 — 병사·부사관·장교 계급별 완전 정리 | 비교계산소",
  description:
    "2026년 군인 월급이 궁금하신가요? 이병부터 대장까지 계급별 봉급, 병장 월급 인상분, 부사관·장교 연봉과 수당 구조까지 한눈에 비교합니다.",
} as const;

export const ML_HERO_STATS = {
  privateMonthly: 750_000,
  sergeantMonthly: 1_250_000,
  secondLtAnnual: 38_000_000,
  generalAnnual: 150_000_000,
} as const;

// ─── 병사 봉급표 ──────────────────────────────────────────
export const SOLDIER_PAY: SoldierPay[] = [
  {
    rank: "이병",
    rankEn: "Private",
    monthlyBase: 750_000,
    monthlyNet: 700_000,
    serviceMonths: "1~3개월",
    note: "2026년 기준. 2027년 100만 원 목표",
  },
  {
    rank: "일병",
    rankEn: "Private 1st Class",
    monthlyBase: 900_000,
    monthlyNet: 840_000,
    serviceMonths: "4~9개월",
    note: "식비·피복 현물 제공으로 실질 가치 더 높음",
  },
  {
    rank: "상병",
    rankEn: "Corporal",
    monthlyBase: 1_100_000,
    monthlyNet: 1_020_000,
    serviceMonths: "10~17개월",
    note: "저축 시 전역 시 목돈 마련 가능",
  },
  {
    rank: "병장",
    rankEn: "Sergeant",
    monthlyBase: 1_250_000,
    monthlyNet: 1_165_000,
    serviceMonths: "18개월~전역",
    note: "2024년 대비 큰 폭 인상. 추가 적금·자기계발 비용 지원 별도",
  },
];

// ─── 부사관 봉급표 (대표 호봉) ────────────────────────────
export const NCO_STEPS: NCOStep[] = [
  // 하사
  { rank: "하사", step: 1,  monthlyBase: 2_200_000, annualGross: 26_400_000, monthlyNet: 1_980_000, note: "신임 하사" },
  { rank: "하사", step: 5,  monthlyBase: 2_500_000, annualGross: 30_000_000, monthlyNet: 2_245_000 },
  { rank: "하사", step: 10, monthlyBase: 2_820_000, annualGross: 33_840_000, monthlyNet: 2_520_000 },
  // 중사
  { rank: "중사", step: 1,  monthlyBase: 2_600_000, annualGross: 31_200_000, monthlyNet: 2_330_000 },
  { rank: "중사", step: 5,  monthlyBase: 2_950_000, annualGross: 35_400_000, monthlyNet: 2_640_000 },
  { rank: "중사", step: 10, monthlyBase: 3_380_000, annualGross: 40_560_000, monthlyNet: 3_020_000 },
  // 상사
  { rank: "상사", step: 1,  monthlyBase: 3_100_000, annualGross: 37_200_000, monthlyNet: 2_770_000 },
  { rank: "상사", step: 5,  monthlyBase: 3_530_000, annualGross: 42_360_000, monthlyNet: 3_150_000 },
  { rank: "상사", step: 10, monthlyBase: 4_050_000, annualGross: 48_600_000, monthlyNet: 3_600_000 },
  // 원사
  { rank: "원사", step: 1,  monthlyBase: 3_800_000, annualGross: 45_600_000, monthlyNet: 3_380_000 },
  { rank: "원사", step: 5,  monthlyBase: 4_350_000, annualGross: 52_200_000, monthlyNet: 3_860_000 },
  { rank: "원사", step: 10, monthlyBase: 5_000_000, annualGross: 60_000_000, monthlyNet: 4_420_000, note: "정년 전후" },
];

// ─── 장교 봉급표 (대표 호봉) ──────────────────────────────
export const OFFICER_STEPS: OfficerStep[] = [
  // 위관
  { rank: "소위", rankGroup: "위관", step: 1,  monthlyBase: 2_450_000, annualGross: 29_400_000, monthlyNet: 2_195_000, note: "임관 첫 해" },
  { rank: "중위", rankGroup: "위관", step: 1,  monthlyBase: 2_650_000, annualGross: 31_800_000, monthlyNet: 2_375_000 },
  { rank: "중위", rankGroup: "위관", step: 3,  monthlyBase: 2_850_000, annualGross: 34_200_000, monthlyNet: 2_550_000 },
  { rank: "대위", rankGroup: "위관", step: 1,  monthlyBase: 3_050_000, annualGross: 36_600_000, monthlyNet: 2_725_000 },
  { rank: "대위", rankGroup: "위관", step: 5,  monthlyBase: 3_500_000, annualGross: 42_000_000, monthlyNet: 3_125_000 },
  // 영관
  { rank: "소령", rankGroup: "영관", step: 1,  monthlyBase: 3_800_000, annualGross: 45_600_000, monthlyNet: 3_380_000 },
  { rank: "소령", rankGroup: "영관", step: 5,  monthlyBase: 4_350_000, annualGross: 52_200_000, monthlyNet: 3_860_000 },
  { rank: "중령", rankGroup: "영관", step: 1,  monthlyBase: 4_600_000, annualGross: 55_200_000, monthlyNet: 4_070_000 },
  { rank: "중령", rankGroup: "영관", step: 5,  monthlyBase: 5_250_000, annualGross: 63_000_000, monthlyNet: 4_630_000 },
  { rank: "대령", rankGroup: "영관", step: 1,  monthlyBase: 5_500_000, annualGross: 66_000_000, monthlyNet: 4_840_000 },
  { rank: "대령", rankGroup: "영관", step: 5,  monthlyBase: 6_200_000, annualGross: 74_400_000, monthlyNet: 5_430_000 },
  // 장성
  { rank: "준장", rankGroup: "장성", step: 1,  monthlyBase: 7_200_000, annualGross: 86_400_000, monthlyNet: 6_250_000 },
  { rank: "소장", rankGroup: "장성", step: 1,  monthlyBase: 8_500_000, annualGross: 102_000_000, monthlyNet: 7_330_000 },
  { rank: "중장", rankGroup: "장성", step: 1,  monthlyBase: 10_000_000, annualGross: 120_000_000, monthlyNet: 8_580_000 },
  { rank: "대장", rankGroup: "장성", step: 1,  monthlyBase: 12_000_000, annualGross: 144_000_000, monthlyNet: 10_200_000, note: "합참의장급" },
];

// ─── 수당 구조 ────────────────────────────────────────────
export const MILITARY_ALLOWANCES: MilitaryAllowance[] = [
  { name: "직책수당",       amount: "월 5~50만 원",     condition: "지휘관·주요 보직",           type: "fixed" },
  { name: "특수직무수당",   amount: "월 5~30만 원",     condition: "특수전·항공·잠수함 등",      type: "special" },
  { name: "위험수당",       amount: "월 3~20만 원",     condition: "폭발물처리·고고도비행 등",   type: "special" },
  { name: "야간근무수당",   amount: "통상임금×0.5",     condition: "22시~06시 근무",             type: "fixed" },
  { name: "명절휴가비",     amount: "본봉의 60% (연2회)", condition: "설·추석",                  type: "annual" },
  { name: "정근수당",       amount: "본봉의 0~50%",     condition: "복무 기간별 지급",           type: "annual" },
  { name: "가족수당",       amount: "월 4~10만 원",     condition: "배우자·부양가족 수에 따라", type: "fixed" },
  { name: "주거수당",       amount: "월 8~14만 원",     condition: "관사 미입주 시",             type: "fixed" },
];

// ─── 민간 비교 ────────────────────────────────────────────
export const CIVILIAN_COMP: CivilianCompRow[] = [
  {
    category: "초임 급여",
    military: "소위 1호봉 월 245만 원 + 수당",
    civilian: "대졸 신입 평균 월 250~320만 원",
    note: "관사·식비 현물 제공 시 군이 유리할 수 있음",
  },
  {
    category: "주거 비용",
    military: "관사 제공 (무료~저렴)",
    civilian: "자기 부담 (월세 40~100만 원+)",
    note: "관사 입주 시 실질 가처분소득 차이 큼",
  },
  {
    category: "식비",
    military: "급식 제공 (무료~저렴)",
    civilian: "자기 부담 (월 30~60만 원)",
    note: "부대 내 식당 이용 시 비용 절감",
  },
  {
    category: "연금",
    military: "군인연금 (20년 복무 후 즉시 수령)",
    civilian: "국민연금 (65세 수령)",
    note: "조기 연금 수령 가능 — 장기복무의 핵심 혜택",
  },
  {
    category: "정년",
    military: "계급별 정년 (대위 43세~대장 64세)",
    civilian: "법정 60세 (공무원·공기업 60세)",
    note: "위관급은 전역 후 제2커리어 필요",
  },
  {
    category: "의료",
    military: "군 의료시설 무료 이용",
    civilian: "건강보험 본인부담 (3.545%)",
    note: "가족 포함 군 병원 이용 가능",
  },
];

// ─── FAQ ──────────────────────────────────────────────────
export const MILITARY_FAQ: MilitaryFAQ[] = [
  {
    q: "2026년 병장 월급은 얼마인가요?",
    a: "2026년 병장 기본급은 125만 원입니다. 여기에 자기계발비·급식·피복 등 현물 지원을 포함하면 실질 가치는 더 높습니다. 정부는 2027년까지 병장 100만 원(현금) 이상 지급을 목표로 인상을 지속하고 있습니다.",
  },
  {
    q: "부사관 vs 장교, 어느 쪽이 연봉이 높나요?",
    a: "동일 복무 기간 기준으로는 장교가 더 높습니다. 그러나 부사관은 임관이 빠르고 전문 기술직 경로가 있어 중사~상사 구간에서 안정적인 수입을 얻을 수 있습니다. 장교는 소령 이상부터 연봉이 크게 올라갑니다.",
  },
  {
    q: "군인연금은 언제부터 받을 수 있나요?",
    a: "20년 이상 복무 후 전역하면 즉시 군인연금을 수령할 수 있습니다. 국민연금(65세 수령)보다 훨씬 빠른 것이 장기복무의 핵심 혜택입니다. 단, 20년 미만 전역 시 퇴직일시금만 지급됩니다.",
  },
  {
    q: "관사 입주 시 실질 급여가 얼마나 올라가나요?",
    a: "관사 제공, 급식 지원을 합산하면 월 50~100만 원 이상의 절감 효과가 있습니다. 서울·수도권 근무 시 월세 시장 대비 실질 가처분소득이 민간 직장인보다 유리할 수 있습니다.",
  },
  {
    q: "장교 임관 후 대위까지 얼마나 걸리나요?",
    a: "사관학교·학군(ROTC)·학사장교 기준 소위 임관 후 대위까지 보통 7~8년 소요됩니다. 대위에서 소령 진급은 경쟁 선발로 탈락 시 전역합니다.",
  },
  {
    q: "특수전·조종사 등 특기병 월급은 더 높나요?",
    a: "네, 특수직무수당과 위험수당이 추가됩니다. 조종사는 비행수당 포함 시 월 100만 원 이상 추가 수령이 가능하고, 특수전 부사관도 다양한 특수수당이 지급됩니다.",
  },
];
