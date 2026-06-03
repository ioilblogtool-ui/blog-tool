// ============================================================
// 의사 연봉·수입 완전 정리 2026
// 출처: 보건복지부 의료인력 실태조사, 전공의 수련 규정,
//       각 병원 공시 급여, 개원의 실태조사 참고 추정치
// 세후 추정: 미혼·부양가족 없음 기준
// ============================================================

export type DoctorType = {
  id: "trainee" | "fellow" | "employee" | "professor" | "self_employed";
  name: string;
  badge: string;
  description: string;
  annualMin: number;
  annualMax: number;
  monthlyNetMin: number;
  monthlyNetMax: number;
  pros: string[];
  cons: string[];
  colorVar: string;
};

export type ResidentStep = {
  stage: string;
  label: string;
  monthlyBase: number;
  monthlyAllowance: number;
  monthlyTotal: number;
  annualEstimate: number;
  note: string;
};

export type SpecialtyRow = {
  specialty: string;
  category: "surgical" | "internal" | "support" | "other";
  employeeAnnualMin: number;
  employeeAnnualMax: number;
  selfEmployedMin: number;
  selfEmployedMax: number;
  demandLevel: "매우 높음" | "높음" | "중간" | "낮음";
  note: string;
};

export type HospitalTypeRow = {
  type: string;
  employeeRange: string;
  characteristics: string;
  workload: string;
  stability: string;
};

export type DoctorAllowance = {
  name: string;
  amount: string;
  condition: string;
  type: "fixed" | "performance" | "special";
};

export type TotalCompRow = {
  label: string;
  stage: string;
  annualMin: number;
  annualMax: number;
  note: string;
};

export type DoctorFAQ = {
  q: string;
  a: string;
};

// ─── Meta ─────────────────────────────────────────────────
export const DR_META = {
  title: "의사 연봉 실수령액 2026 — 전공별·근무형태별 완전 비교 | 비교계산소",
  description:
    "2026년 의사 연봉이 궁금하신가요? 전공의·봉직의·개원의·교수별 실수령액, 전공과별 연봉 격차, 수련 단계별 급여까지 한눈에 비교합니다.",
} as const;

export const DR_HERO_STATS = {
  residentY1Monthly: 3_800_000,
  employeeAvgAnnual: 180_000_000,
  selfEmployedAvgAnnual: 300_000_000,
  professorAvgAnnual: 130_000_000,
} as const;

// ─── 근무 형태별 비교 ──────────────────────────────────────
export const DOCTOR_TYPES: DoctorType[] = [
  {
    id: "trainee",
    name: "전공의 (레지던트)",
    badge: "수련 중",
    description: "인턴 1년 + 레지던트 3~4년 수련 과정. 기본급은 낮지만 수련 후 전문의 취득.",
    annualMin: 40_000_000,
    annualMax: 70_000_000,
    monthlyNetMin: 3_200_000,
    monthlyNetMax: 5_500_000,
    pros: ["전문의 자격 취득", "수련병원 복리후생", "의료 경험 축적"],
    cons: ["장시간 근무", "낮은 급여", "수련 기간 4~5년"],
    colorVar: "--dr-color-trainee",
  },
  {
    id: "fellow",
    name: "전임의 (펠로우)",
    badge: "세부 수련",
    description: "전문의 취득 후 세부 전공 수련. 1~2년 과정으로 급여가 전공의보다 높음.",
    annualMin: 80_000_000,
    annualMax: 120_000_000,
    monthlyNetMin: 5_500_000,
    monthlyNetMax: 8_500_000,
    pros: ["세부 전공 취득", "대학병원 잔류 기회", "기술 전문화"],
    cons: ["추가 수련 기간", "정규직 아님", "병원 의존도 높음"],
    colorVar: "--dr-color-fellow",
  },
  {
    id: "employee",
    name: "봉직의",
    badge: "병원 고용",
    description: "병원에 고용되어 근무하는 전문의. 병원 규모와 전공에 따라 연봉 편차 큼.",
    annualMin: 120_000_000,
    annualMax: 300_000_000,
    monthlyNetMin: 7_000_000,
    monthlyNetMax: 18_000_000,
    pros: ["안정적 급여", "개원 리스크 없음", "근무 조건 협상 가능"],
    cons: ["연봉 상한선 존재", "병원 정책 종속", "성과 압박"],
    colorVar: "--dr-color-employee",
  },
  {
    id: "professor",
    name: "대학병원 교수",
    badge: "교수직",
    description: "의과대학 교수직 겸임. 연구·교육·진료 병행. 안정적이나 봉직의보다 급여 낮은 편.",
    annualMin: 100_000_000,
    annualMax: 200_000_000,
    monthlyNetMin: 6_000_000,
    monthlyNetMax: 13_000_000,
    pros: ["사회적 지위", "연구 활동 가능", "정년 보장"],
    cons: ["봉직의보다 낮은 급여", "연구 압박", "행정 업무 부담"],
    colorVar: "--dr-color-professor",
  },
  {
    id: "self_employed",
    name: "개원의",
    badge: "자영업",
    description: "직접 의원·병원 운영. 수익 상한 없으나 운영 비용·리스크 부담.",
    annualMin: 100_000_000,
    annualMax: 1_000_000_000,
    monthlyNetMin: 5_000_000,
    monthlyNetMax: 50_000_000,
    pros: ["수입 상한 없음", "자율적 운영", "성과에 따른 보상"],
    cons: ["초기 개원 비용 큼", "경영 리스크", "수입 불안정"],
    colorVar: "--dr-color-self",
  },
];

// ─── 수련 단계별 급여 ──────────────────────────────────────
export const RESIDENT_STEPS: ResidentStep[] = [
  {
    stage: "인턴",
    label: "인턴 (1년)",
    monthlyBase: 3_200_000,
    monthlyAllowance: 800_000,
    monthlyTotal: 4_000_000,
    annualEstimate: 48_000_000,
    note: "전공 선택 전 수련. 당직수당 포함 시 상향 가능",
  },
  {
    stage: "R1",
    label: "레지던트 1년차",
    monthlyBase: 3_500_000,
    monthlyAllowance: 1_000_000,
    monthlyTotal: 4_500_000,
    annualEstimate: 54_000_000,
    note: "전공 확정. 당직·휴일수당 반영 추정",
  },
  {
    stage: "R2",
    label: "레지던트 2년차",
    monthlyBase: 3_700_000,
    monthlyAllowance: 1_100_000,
    monthlyTotal: 4_800_000,
    annualEstimate: 57_600_000,
    note: "전공별 수술·시술 참여 증가",
  },
  {
    stage: "R3",
    label: "레지던트 3년차",
    monthlyBase: 3_900_000,
    monthlyAllowance: 1_200_000,
    monthlyTotal: 5_100_000,
    annualEstimate: 61_200_000,
    note: "책임 수술 시작. 일부 외과계 수당 증가",
  },
  {
    stage: "R4",
    label: "레지던트 4년차",
    monthlyBase: 4_100_000,
    monthlyAllowance: 1_300_000,
    monthlyTotal: 5_400_000,
    annualEstimate: 64_800_000,
    note: "전문의 시험 준비. 3년제 전공은 R3 종료",
  },
  {
    stage: "fellow",
    label: "전임의 (펠로우)",
    monthlyBase: 6_500_000,
    monthlyAllowance: 1_500_000,
    monthlyTotal: 8_000_000,
    annualEstimate: 96_000_000,
    note: "세부 전공 1~2년 수련. 병원별 편차 큼",
  },
];

// ─── 전공별 연봉 ───────────────────────────────────────────
export const SPECIALTY_ROWS: SpecialtyRow[] = [
  {
    specialty: "성형외과",
    category: "surgical",
    employeeAnnualMin: 200_000_000,
    employeeAnnualMax: 400_000_000,
    selfEmployedMin: 300_000_000,
    selfEmployedMax: 1_500_000_000,
    demandLevel: "매우 높음",
    note: "미용 시술 수요로 개원 수익 최상위",
  },
  {
    specialty: "피부과",
    category: "support",
    employeeAnnualMin: 180_000_000,
    employeeAnnualMax: 350_000_000,
    selfEmployedMin: 250_000_000,
    selfEmployedMax: 1_000_000_000,
    demandLevel: "매우 높음",
    note: "미용 레이저·보톡스 등 비급여 수익 높음",
  },
  {
    specialty: "정형외과",
    category: "surgical",
    employeeAnnualMin: 180_000_000,
    employeeAnnualMax: 320_000_000,
    selfEmployedMin: 200_000_000,
    selfEmployedMax: 600_000_000,
    demandLevel: "높음",
    note: "고령화로 수요 지속 증가",
  },
  {
    specialty: "안과",
    category: "surgical",
    employeeAnnualMin: 160_000_000,
    employeeAnnualMax: 300_000_000,
    selfEmployedMin: 200_000_000,
    selfEmployedMax: 700_000_000,
    demandLevel: "높음",
    note: "라식·라섹 등 비급여 비중 높음",
  },
  {
    specialty: "내과",
    category: "internal",
    employeeAnnualMin: 130_000_000,
    employeeAnnualMax: 250_000_000,
    selfEmployedMin: 120_000_000,
    selfEmployedMax: 350_000_000,
    demandLevel: "높음",
    note: "내분비·소화기 등 세부 전공별 차이",
  },
  {
    specialty: "외과",
    category: "surgical",
    employeeAnnualMin: 150_000_000,
    employeeAnnualMax: 280_000_000,
    selfEmployedMin: 120_000_000,
    selfEmployedMax: 300_000_000,
    demandLevel: "높음",
    note: "대형병원 집중. 개원 시 수익성 제한적",
  },
  {
    specialty: "정신건강의학과",
    category: "other",
    employeeAnnualMin: 120_000_000,
    employeeAnnualMax: 220_000_000,
    selfEmployedMin: 150_000_000,
    selfEmployedMax: 400_000_000,
    demandLevel: "높음",
    note: "정신건강 수요 급증. 개원 비용 낮음",
  },
  {
    specialty: "소아청소년과",
    category: "internal",
    employeeAnnualMin: 100_000_000,
    employeeAnnualMax: 200_000_000,
    selfEmployedMin: 80_000_000,
    selfEmployedMax: 200_000_000,
    demandLevel: "낮음",
    note: "저출생으로 개원 수익성 하락 추세",
  },
  {
    specialty: "산부인과",
    category: "surgical",
    employeeAnnualMin: 130_000_000,
    employeeAnnualMax: 250_000_000,
    selfEmployedMin: 100_000_000,
    selfEmployedMax: 350_000_000,
    demandLevel: "중간",
    note: "분만 수가 낮아 개원 어려움. 미용부인과 전환 사례 증가",
  },
  {
    specialty: "응급의학과",
    category: "other",
    employeeAnnualMin: 150_000_000,
    employeeAnnualMax: 280_000_000,
    selfEmployedMin: 0,
    selfEmployedMax: 0,
    demandLevel: "높음",
    note: "개원 없음. 야간·당직수당 포함 시 연봉 상향",
  },
];

// ─── 병원 유형별 비교 ──────────────────────────────────────
export const HOSPITAL_TYPES: HospitalTypeRow[] = [
  {
    type: "상급종합병원 (빅5)",
    employeeRange: "1.2억~2.0억",
    characteristics: "최고 수준 의료장비, 연구 기회",
    workload: "매우 높음",
    stability: "매우 높음",
  },
  {
    type: "종합병원",
    employeeRange: "1.2억~2.5억",
    characteristics: "지역 거점 병원, 다양한 케이스",
    workload: "높음",
    stability: "높음",
  },
  {
    type: "중소병원",
    employeeRange: "1.5억~3.0억",
    characteristics: "협상 여지 큼, 의사 의존도 높음",
    workload: "중간~높음",
    stability: "중간",
  },
  {
    type: "의원·클리닉",
    employeeRange: "1.2억~2.0억",
    characteristics: "비교적 규칙적 근무",
    workload: "중간",
    stability: "중간",
  },
  {
    type: "개원의 (직접 운영)",
    employeeRange: "1.0억~10억+",
    characteristics: "수익 상한 없음, 경영 책임",
    workload: "높음",
    stability: "낮음~높음",
  },
];

// ─── 수당 구조 ────────────────────────────────────────────
export const DOCTOR_ALLOWANCES: DoctorAllowance[] = [
  { name: "당직수당",      amount: "1회당 10~30만 원",  condition: "야간·휴일 당직 시",       type: "fixed" },
  { name: "휴일근무수당",  amount: "통상임금의 150%",   condition: "휴일 근무 시",             type: "fixed" },
  { name: "성과급",        amount: "연봉의 10~50%",     condition: "진료 실적·수술 건수 기준", type: "performance" },
  { name: "학술연구비",    amount: "연 200~500만 원",   condition: "교수직·연구직",            type: "special" },
  { name: "위험수당",      amount: "월 5~20만 원",      condition: "응급·감염 고위험 진료",    type: "special" },
  { name: "야간수당",      amount: "시간당 통상임금×0.5", condition: "22시~06시 근무",         type: "fixed" },
];

// ─── 총보상 패키지 ────────────────────────────────────────
export const TOTAL_COMP: TotalCompRow[] = [
  {
    label: "인턴",
    stage: "수련 1년차",
    annualMin: 45_000_000,
    annualMax: 55_000_000,
    note: "당직수당 포함 추정",
  },
  {
    label: "레지던트 전체",
    stage: "수련 2~5년차",
    annualMin: 50_000_000,
    annualMax: 70_000_000,
    note: "전공·병원별 편차 포함",
  },
  {
    label: "전임의 (펠로우)",
    stage: "전문의 후 1~2년",
    annualMin: 80_000_000,
    annualMax: 120_000_000,
    note: "세부 전공 수련 과정",
  },
  {
    label: "봉직의 초기",
    stage: "전문의 취득 직후",
    annualMin: 120_000_000,
    annualMax: 200_000_000,
    note: "전공·병원 규모에 따라 큰 차이",
  },
  {
    label: "봉직의 경력 5년+",
    stage: "경력의",
    annualMin: 160_000_000,
    annualMax: 350_000_000,
    note: "전공·지역·병원별 편차 매우 큼",
  },
  {
    label: "개원의 안정기",
    stage: "개원 3년+ 이후",
    annualMin: 150_000_000,
    annualMax: 1_000_000_000,
    note: "전공·입지·규모에 따라 편차 극대화",
  },
];

// ─── FAQ ────────────────────────────────────────────────
export const DOCTOR_FAQ: DoctorFAQ[] = [
  {
    q: "의사 평균 연봉이 얼마인지 한 줄로 말해줘요?",
    a: "봉직의 기준 약 1.5억~2.5억, 개원의는 전공·입지에 따라 1억~수억까지 편차가 매우 큽니다. '의사 평균 연봉'이라는 단일 수치는 오해를 낳을 수 있어 근무 형태별로 구분해 보는 게 정확합니다.",
  },
  {
    q: "전공의(레지던트) 월급은 얼마인가요?",
    a: "2026년 기준 인턴은 월 400~450만 원, 레지던트 1~4년차는 월 450~550만 원 수준입니다. 당직 횟수와 수당에 따라 월 100~200만 원 추가될 수 있습니다.",
  },
  {
    q: "어떤 전공이 가장 연봉이 높나요?",
    a: "봉직의 기준으로는 성형외과·피부과·정형외과가 상위권입니다. 개원 시에는 성형·피부·안과가 비급여 비중이 높아 수입이 크게 올라갈 수 있습니다. 반면 소아청소년과·산부인과는 저출생 영향으로 개원 수익성이 하락 추세입니다.",
  },
  {
    q: "봉직의와 개원의 중 어느 쪽이 유리한가요?",
    a: "안정성을 원하면 봉직의, 수입 극대화를 원하면 개원의가 유리합니다. 개원 초기 비용(임대·장비·인건비)이 3~10억 원 이상 필요하고, 3~5년 안정화 기간이 있어 리스크가 큽니다.",
  },
  {
    q: "대학병원 교수는 왜 봉직의보다 연봉이 낮나요?",
    a: "교수직은 연구·교육 의무와 함께 진료를 하므로 순수 진료 시간이 적고, 병원 수익 기여도가 낮게 책정됩니다. 대신 정년 보장, 연구비, 사회적 지위 등 비금전적 보상이 큽니다.",
  },
  {
    q: "의대를 졸업하고 실제로 돈을 벌기까지 얼마나 걸리나요?",
    a: "의대 6년 + 인턴 1년 + 레지던트 3~4년 = 최소 10~11년 후 전문의가 됩니다. 펠로우까지 하면 12~13년. 이 기간 동안 연봉은 낮고 수련 강도는 높습니다.",
  },
];
