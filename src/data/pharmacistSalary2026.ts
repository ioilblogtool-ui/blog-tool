// ============================================================
// 약사 연봉·수입 완전 정리 2026
// 출처: 대한약사회 실태조사, 병원약사회, 제약업계 공시 자료 참고 추정치
// 세후 추정: 미혼·부양가족 없음 기준
// ============================================================

export type PharmacistType = {
  id: "hospital" | "community" | "pharma" | "public" | "owner";
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

export type CareerRow = {
  years: string;
  label: string;
  hospitalMin: number;
  hospitalMax: number;
  communityMin: number;
  communityMax: number;
  note: string;
};

export type RegionRow = {
  region: string;
  avgAnnual: number;
  openingCost: string;
  demandLevel: "매우 높음" | "높음" | "중간" | "낮음";
  note: string;
};

export type PharmacistAllowance = {
  name: string;
  amount: string;
  condition: string;
  type: "fixed" | "performance" | "benefit";
};

export type TotalCompRow = {
  label: string;
  stage: string;
  annualMin: number;
  annualMax: number;
  note: string;
};

export type PharmacistFAQ = {
  q: string;
  a: string;
};

// ─── Meta ─────────────────────────────────────────────────
export const PH_META = {
  title: "약사 연봉 실수령액 2026 — 근무처별·경력별 완전 비교 | 비교계산소",
  description:
    "2026년 약사 연봉이 궁금하신가요? 병원약사·약국약사·제약사·개국 약사 연봉 비교, 경력별 연봉 흐름, 지역별 수입 격차까지 한눈에 정리했습니다.",
} as const;

export const PH_HERO_STATS = {
  hospitalEntryAnnual: 45_000_000,
  communityAvgAnnual: 70_000_000,
  ownerAvgAnnual: 150_000_000,
  pharmaAvgAnnual: 65_000_000,
} as const;

// ─── 근무 형태별 비교 ──────────────────────────────────────
export const PHARMACIST_TYPES: PharmacistType[] = [
  {
    id: "hospital",
    name: "병원 약사",
    badge: "병원 고용",
    description: "종합병원·대학병원 약제부 근무. 조제·복약지도·임상 업무 담당. 급여는 낮지만 경력 인정도 높음.",
    annualMin: 40_000_000,
    annualMax: 80_000_000,
    monthlyNetMin: 2_800_000,
    monthlyNetMax: 5_500_000,
    pros: ["체계적 임상 경험", "공무원연금 유사 복지", "정규직 안정성"],
    cons: ["상대적으로 낮은 급여", "야간·교대 근무 가능", "연봉 상한선 낮음"],
    colorVar: "--ph-color-hospital",
  },
  {
    id: "community",
    name: "약국 약사 (봉직)",
    badge: "약국 고용",
    description: "개인약국·체인약국에 고용된 약사. 시급제 또는 연봉제. 지역·약국 규모에 따라 편차 큼.",
    annualMin: 50_000_000,
    annualMax: 100_000_000,
    monthlyNetMin: 3_500_000,
    monthlyNetMax: 7_000_000,
    pros: ["병원보다 높은 급여", "비교적 규칙적 근무", "이직 유연성"],
    cons: ["약국별 처우 편차 큼", "정년·복지 미보장", "주말 근무 가능"],
    colorVar: "--ph-color-community",
  },
  {
    id: "pharma",
    name: "제약·바이오회사",
    badge: "기업 근무",
    description: "제약사 영업·마케팅·연구·임상·RA 등 다양한 직무. 직무·회사 규모에 따라 연봉 차이 큼.",
    annualMin: 45_000_000,
    annualMax: 120_000_000,
    monthlyNetMin: 3_200_000,
    monthlyNetMax: 8_000_000,
    pros: ["다양한 직무 선택", "대기업급 복지", "성과급·스톡옵션 가능"],
    cons: ["조제 실무와 거리 생김", "영업직 업무 강도 높음", "이직 잦음"],
    colorVar: "--ph-color-pharma",
  },
  {
    id: "public",
    name: "공공기관·공무원",
    badge: "공직",
    description: "식약처·건강보험공단·보건소 등 공공기관 근무 약사. 안정성 최상이나 급여는 낮은 편.",
    annualMin: 38_000_000,
    annualMax: 75_000_000,
    monthlyNetMin: 2_600_000,
    monthlyNetMax: 5_200_000,
    pros: ["정년 보장", "공무원연금", "워라밸 우수"],
    cons: ["가장 낮은 급여", "진급 속도 느림", "업무 자율성 제한"],
    colorVar: "--ph-color-public",
  },
  {
    id: "owner",
    name: "개국 약사",
    badge: "자영업",
    description: "직접 약국 운영. 입지·처방전 수에 따라 수입이 크게 달라짐. 초기 개국 비용 부담.",
    annualMin: 60_000_000,
    annualMax: 500_000_000,
    monthlyNetMin: 4_000_000,
    monthlyNetMax: 30_000_000,
    pros: ["수입 상한 없음", "자율적 운영", "처방전 확보 시 고수익"],
    cons: ["초기 개국 비용 3~8억", "입지 선정 리스크", "수입 불안정"],
    colorVar: "--ph-color-owner",
  },
];

// ─── 경력별 연봉 흐름 ──────────────────────────────────────
export const CAREER_ROWS: CareerRow[] = [
  {
    years: "신입",
    label: "면허 취득 직후",
    hospitalMin: 38_000_000,
    hospitalMax: 45_000_000,
    communityMin: 45_000_000,
    communityMax: 60_000_000,
    note: "병원은 수련·레지던트 과정 가능",
  },
  {
    years: "3년차",
    label: "경력 3년",
    hospitalMin: 45_000_000,
    hospitalMax: 55_000_000,
    communityMin: 55_000_000,
    communityMax: 75_000_000,
    note: "약국은 시급 협상력 높아짐",
  },
  {
    years: "5년차",
    label: "경력 5년",
    hospitalMin: 50_000_000,
    hospitalMax: 65_000_000,
    communityMin: 60_000_000,
    communityMax: 85_000_000,
    note: "전문약사 자격 취득 가능",
  },
  {
    years: "10년차",
    label: "경력 10년",
    hospitalMin: 60_000_000,
    hospitalMax: 80_000_000,
    communityMin: 65_000_000,
    communityMax: 100_000_000,
    note: "관리약사·파트장 직함 가능",
  },
  {
    years: "15년차+",
    label: "경력 15년 이상",
    hospitalMin: 65_000_000,
    hospitalMax: 90_000_000,
    communityMin: 70_000_000,
    communityMax: 120_000_000,
    note: "약국장·수석약사 직급",
  },
];

// ─── 지역별 약국 약사 연봉 ─────────────────────────────────
export const REGION_ROWS: RegionRow[] = [
  {
    region: "서울 강남·서초",
    avgAnnual: 90_000_000,
    openingCost: "5억~15억",
    demandLevel: "높음",
    note: "처방전 수 많고 권리금 높음",
  },
  {
    region: "서울 기타",
    avgAnnual: 75_000_000,
    openingCost: "3억~10억",
    demandLevel: "높음",
    note: "지역별 처방전 편차 큼",
  },
  {
    region: "수도권 (경기·인천)",
    avgAnnual: 70_000_000,
    openingCost: "2억~7억",
    demandLevel: "높음",
    note: "신도시 약국은 초반 처방 확보 어려움",
  },
  {
    region: "지방 광역시",
    avgAnnual: 65_000_000,
    openingCost: "1억~5억",
    demandLevel: "중간",
    note: "개국 비용 낮고 경쟁도 낮음",
  },
  {
    region: "지방 중소도시",
    avgAnnual: 55_000_000,
    openingCost: "5천~2억",
    demandLevel: "낮음",
    note: "의원 의존도 높고 처방전 수 제한적",
  },
];

// ─── 수당·복리후생 ────────────────────────────────────────
export const PHARMACIST_ALLOWANCES: PharmacistAllowance[] = [
  { name: "야간·휴일 수당",  amount: "통상임금의 50~100%", condition: "야간·휴일 조제 근무",        type: "fixed" },
  { name: "관리약사 수당",   amount: "월 20~50만 원",      condition: "약국 관리약사 지정 시",      type: "fixed" },
  { name: "성과급",          amount: "연봉의 5~20%",       condition: "제약사·대형병원 성과 기준",  type: "performance" },
  { name: "연구개발비",      amount: "연 100~300만 원",    condition: "제약·바이오 연구직",         type: "benefit" },
  { name: "처방전 인센티브", amount: "처방전당 500~2,000원", condition: "개국·약국 체인 인센티브",  type: "performance" },
  { name: "복지포인트",      amount: "연 50~200만 원",     condition: "대형병원·제약사 재직",       type: "benefit" },
];

// ─── 총보상 커리어 흐름 ───────────────────────────────────
export const TOTAL_COMP: TotalCompRow[] = [
  {
    label: "신입 병원 약사",
    stage: "면허 후 1~2년",
    annualMin: 38_000_000,
    annualMax: 48_000_000,
    note: "대학병원 레지던트 과정 시 더 낮을 수 있음",
  },
  {
    label: "신입 약국 약사",
    stage: "면허 후 1~2년",
    annualMin: 45_000_000,
    annualMax: 65_000_000,
    note: "시급제 약국은 연 5천만 이상 가능",
  },
  {
    label: "경력 5년 봉직",
    stage: "병원·약국 경력",
    annualMin: 55_000_000,
    annualMax: 85_000_000,
    note: "전문약사 자격 보유 시 우대",
  },
  {
    label: "개국 초기",
    stage: "개국 1~3년차",
    annualMin: 50_000_000,
    annualMax: 150_000_000,
    note: "입지·처방전 확보 여부에 따라 편차 극대",
  },
  {
    label: "개국 안정기",
    stage: "개국 5년+ 이후",
    annualMin: 80_000_000,
    annualMax: 500_000_000,
    note: "병원 인근 약국은 수억 수입도 가능",
  },
];

// ─── FAQ ──────────────────────────────────────────────────
export const PHARMACIST_FAQ: PharmacistFAQ[] = [
  {
    q: "약사 평균 연봉은 얼마인가요?",
    a: "근무 형태에 따라 크게 다릅니다. 병원 약사는 4천~8천만 원, 약국 봉직약사는 5천~1억, 개국 약사는 입지에 따라 6천만~수억까지 차이납니다. '약사 평균'이라는 단일 수치는 실제 체감과 다를 수 있습니다.",
  },
  {
    q: "병원 약사와 약국 약사 중 어느 쪽이 유리한가요?",
    a: "안정성과 커리어를 원하면 병원 약사, 급여를 원하면 약국 봉직약사가 유리합니다. 장기적으로는 개국을 목표로 한다면 지역 인맥과 약국 운영 경험을 쌓는 것이 중요합니다.",
  },
  {
    q: "약국 개국 비용은 얼마나 드나요?",
    a: "지역과 입지에 따라 천차만별입니다. 지방 중소도시는 5천만~2억 원, 서울 강남권은 권리금 포함 5억~15억 원까지도 소요됩니다. 병원 근처 약국 입지를 확보하는 것이 개국 성공의 핵심입니다.",
  },
  {
    q: "제약회사 약사는 어떤 일을 하나요?",
    a: "크게 영업(MR)·마케팅·연구개발(R&D)·임상시험관리(CRA)·인허가(RA) 업무로 나뉩니다. 연봉은 직무·회사 규모에 따라 다르며 대형 제약사 영업직은 성과급 포함 1억 이상도 가능합니다.",
  },
  {
    q: "약사 면허 취득까지 얼마나 걸리나요?",
    a: "약학대학 6년 과정(2+4년제 통합 운영 중)을 이수하고 국가면허시험에 합격하면 됩니다. 의대(10~11년)보다 짧고 진입 장벽이 비교적 명확해 커리어 설계가 상대적으로 예측 가능합니다.",
  },
  {
    q: "전문약사 자격이 연봉에 도움이 되나요?",
    a: "병원 약사 승진과 대형병원 취업 시 유리합니다. 종양·정신·노인·소아 등 전문 분야 자격 취득 후 대학병원 수석약사나 임상약사로 전환하면 연봉이 10~20% 이상 상승할 수 있습니다.",
  },
];
