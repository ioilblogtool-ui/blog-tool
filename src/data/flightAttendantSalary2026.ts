// ============================================================
// 항공사 승무원 연봉·수당 완전 정리 2026
// 출처: 각 항공사 공시 급여, 채용 공고, 업계 공개 자료 참고 추정치
// 세후 추정: 미혼·부양가족 없음 기준
// ============================================================

export type AirlineRow = {
  id: string;
  name: string;
  type: "FSC" | "LCC";
  badge: string;
  entryAnnualMin: number;
  entryAnnualMax: number;
  seniorAnnualMin: number;
  seniorAnnualMax: number;
  flightAllowanceNote: string;
  layoverNote: string;
  pros: string[];
  cons: string[];
  colorVar: string;
};

export type RankRow = {
  rank: string;
  years: string;
  monthlyBase: number;
  monthlyFlightMin: number;
  monthlyFlightMax: number;
  monthlyLayover: number;
  monthlyTotal: number;
  annualEstimate: number;
  note: string;
};

export type AllowanceRow = {
  name: string;
  amount: string;
  condition: string;
  type: "fixed" | "flight" | "benefit";
};

export type CareerRow = {
  stage: string;
  label: string;
  annualMin: number;
  annualMax: number;
  note: string;
};

export type FAFAQ = {
  q: string;
  a: string;
};

// ─── Meta ─────────────────────────────────────────────────
export const FA_META = {
  title: "항공사 승무원 연봉 2026 — 대한항공·아시아나·LCC 완전 비교 | 비교계산소",
  description:
    "2026년 항공사 승무원 연봉이 궁금하신가요? 대한항공·아시아나·제주항공 등 국내 항공사별 초봉, 직급별 연봉, 비행수당·체재비 구조까지 한눈에 비교합니다.",
} as const;

export const FA_HERO_STATS = {
  kal_entry_annual: 38_000_000,
  kal_senior_annual: 80_000_000,
  lcc_entry_annual: 28_000_000,
  flight_allowance_avg: 1_500_000,
} as const;

// ─── 항공사별 비교 ────────────────────────────────────────
export const AIRLINE_ROWS: AirlineRow[] = [
  {
    id: "kal",
    name: "대한항공",
    type: "FSC",
    badge: "국적 FSC",
    entryAnnualMin: 35_000_000,
    entryAnnualMax: 42_000_000,
    seniorAnnualMin: 70_000_000,
    seniorAnnualMax: 100_000_000,
    flightAllowanceNote: "시간당 국내선 약 5,000~8,000원 / 국제선 약 $5~8",
    layoverNote: "국제선 체재비 $80~150/일 (지역별 상이)",
    pros: ["업계 최고 브랜드", "국제선 비중 높아 체재비 ↑", "복리후생 우수"],
    cons: ["높은 입사 경쟁률", "엄격한 외모 기준", "국제선 불규칙 스케줄"],
    colorVar: "--fa-color-kal",
  },
  {
    id: "aak",
    name: "아시아나항공",
    type: "FSC",
    badge: "국적 FSC",
    entryAnnualMin: 32_000_000,
    entryAnnualMax: 40_000_000,
    seniorAnnualMin: 60_000_000,
    seniorAnnualMax: 90_000_000,
    flightAllowanceNote: "대한항공과 유사한 구조",
    layoverNote: "국제선 체재비 $70~130/일",
    pros: ["FSC급 처우", "국제선 다수", "대한항공 합병 후 안정화"],
    cons: ["합병 과도기 불안", "대한항공보다 낮은 브랜드 인지도"],
    colorVar: "--fa-color-aak",
  },
  {
    id: "7c",
    name: "제주항공",
    type: "LCC",
    badge: "LCC",
    entryAnnualMin: 26_000_000,
    entryAnnualMax: 33_000_000,
    seniorAnnualMin: 40_000_000,
    seniorAnnualMax: 60_000_000,
    flightAllowanceNote: "국내선·단거리 국제선 중심",
    layoverNote: "체재비 구조 FSC 대비 낮음",
    pros: ["상대적으로 낮은 경쟁률", "빠른 직급 상승", "국내선 경험 풍부"],
    cons: ["FSC 대비 낮은 연봉", "단거리 노선 반복 피로", "체재비 적음"],
    colorVar: "--fa-color-7c",
  },
  {
    id: "tw",
    name: "티웨이항공",
    type: "LCC",
    badge: "LCC",
    entryAnnualMin: 25_000_000,
    entryAnnualMax: 32_000_000,
    seniorAnnualMin: 38_000_000,
    seniorAnnualMax: 55_000_000,
    flightAllowanceNote: "LCC 표준 구조",
    layoverNote: "단거리 위주, 체재비 제한적",
    pros: ["유연한 채용 기준", "중장거리 확대 중"],
    cons: ["가장 낮은 연봉대", "재무 안정성 변동"],
    colorVar: "--fa-color-tw",
  },
  {
    id: "rs",
    name: "에어서울 / 에어부산",
    type: "LCC",
    badge: "LCC",
    entryAnnualMin: 25_000_000,
    entryAnnualMax: 31_000_000,
    seniorAnnualMin: 37_000_000,
    seniorAnnualMax: 52_000_000,
    flightAllowanceNote: "LCC 표준 구조",
    layoverNote: "일본·동남아 단거리 중심",
    pros: ["모회사(아시아나) 안정성", "일본·동남아 노선 특화"],
    cons: ["모회사 합병 영향 변수", "소규모 항공사 처우"],
    colorVar: "--fa-color-rs",
  },
];

// ─── 직급별 연봉 (대한항공 기준 추정) ─────────────────────
export const RANK_ROWS: RankRow[] = [
  {
    rank: "신입 사원",
    years: "0~1년차",
    monthlyBase: 1_800_000,
    monthlyFlightMin: 800_000,
    monthlyFlightMax: 1_500_000,
    monthlyLayover: 500_000,
    monthlyTotal: 3_600_000,
    annualEstimate: 38_000_000,
    note: "수습 기간 포함. 비행 편수에 따라 차이",
  },
  {
    rank: "사원",
    years: "2~4년차",
    monthlyBase: 2_000_000,
    monthlyFlightMin: 1_000_000,
    monthlyFlightMax: 1_800_000,
    monthlyLayover: 700_000,
    monthlyTotal: 4_200_000,
    annualEstimate: 46_000_000,
    note: "국제선 편수 증가로 체재비 상승",
  },
  {
    rank: "선임",
    years: "5~8년차",
    monthlyBase: 2_400_000,
    monthlyFlightMin: 1_200_000,
    monthlyFlightMax: 2_200_000,
    monthlyLayover: 900_000,
    monthlyTotal: 5_200_000,
    annualEstimate: 57_000_000,
    note: "주임승무원 자격 취득 가능",
  },
  {
    rank: "주임",
    years: "9~13년차",
    monthlyBase: 2_900_000,
    monthlyFlightMin: 1_400_000,
    monthlyFlightMax: 2_500_000,
    monthlyLayover: 1_100_000,
    monthlyTotal: 6_200_000,
    annualEstimate: 68_000_000,
    note: "사무장 승진 심사 대상",
  },
  {
    rank: "사무장",
    years: "14년차+",
    monthlyBase: 3_800_000,
    monthlyFlightMin: 1_800_000,
    monthlyFlightMax: 3_000_000,
    monthlyLayover: 1_500_000,
    monthlyTotal: 7_800_000,
    annualEstimate: 85_000_000,
    note: "객실 최고 책임자. 수석 사무장은 더 높음",
  },
];

// ─── 수당 구조 ────────────────────────────────────────────
export const FA_ALLOWANCES: AllowanceRow[] = [
  { name: "비행수당",    amount: "시간당 5,000~8,000원 (국내선) / $5~8 (국제선)", condition: "실제 비행 시간 기준",        type: "flight" },
  { name: "체재비",      amount: "$70~150/일 (지역별 상이)",                        condition: "국제선 체류 1박당",          type: "flight" },
  { name: "야간비행수당", amount: "시간당 추가 20~30%",                             condition: "22시~06시 비행",             type: "flight" },
  { name: "명절휴가비",  amount: "기본급의 50~60% (연 2회)",                        condition: "설·추석",                    type: "fixed"  },
  { name: "항공권 혜택", amount: "본인·가족 할인 항공권",                           condition: "재직 중 연간 일정 매수",     type: "benefit"},
  { name: "유니폼·화장품 지급", amount: "연간 일정 금액 지원",                      condition: "재직 중",                    type: "benefit"},
  { name: "교육훈련비",  amount: "어학·안전훈련 회사 부담",                         condition: "정기 훈련",                  type: "benefit"},
];

// ─── 커리어 단계별 수입 ───────────────────────────────────
export const FA_CAREER: CareerRow[] = [
  { stage: "입사 ~ 1년차", label: "수습·신입",      annualMin: 28_000_000, annualMax: 40_000_000, note: "항공사별 편차. LCC는 하단, 대한항공은 상단" },
  { stage: "2~4년차",      label: "사원",            annualMin: 35_000_000, annualMax: 50_000_000, note: "국제선 편수에 따라 체재비 영향 큼" },
  { stage: "5~8년차",      label: "선임",            annualMin: 45_000_000, annualMax: 65_000_000, note: "주임 자격 취득 여부에 따라 분기" },
  { stage: "9~13년차",     label: "주임",            annualMin: 55_000_000, annualMax: 80_000_000, note: "사무장 심사 통과 여부가 커리어 분기점" },
  { stage: "14년차+",      label: "사무장·수석",     annualMin: 75_000_000, annualMax: 120_000_000, note: "수석 사무장은 1억 이상도 가능" },
];

// ─── FAQ ──────────────────────────────────────────────────
export const FA_FAQ: FAFAQ[] = [
  {
    q: "승무원 초봉은 얼마인가요?",
    a: "대한항공·아시아나 FSC 기준 연 3,500만~4,200만 원, LCC(제주항공 등)는 2,500만~3,300만 원 수준입니다. 기본급은 낮지만 비행수당·체재비를 더하면 실수령이 크게 달라집니다.",
  },
  {
    q: "비행수당과 체재비가 연봉에 얼마나 영향을 주나요?",
    a: "상당히 큽니다. 국제선 비중이 높은 달에는 체재비만 월 100만~200만 원 추가될 수 있습니다. 장거리 노선(미주·유럽)은 체재비가 높고, 단거리(일본·동남아)는 낮습니다. 비행 편수와 노선에 따라 총수령액이 기본급의 2배가 되기도 합니다.",
  },
  {
    q: "대한항공과 LCC 어느 쪽이 더 유리한가요?",
    a: "장기적으로는 대한항공이 연봉·복리후생·브랜드 모두 유리합니다. 다만 경쟁률이 매우 높고 입사 기준이 엄격합니다. LCC는 상대적으로 입사가 쉽고 빠른 직급 상승이 가능하지만 연봉 상한선이 낮습니다.",
  },
  {
    q: "사무장까지 올라가면 연봉이 얼마인가요?",
    a: "대한항공 기준 사무장은 연 8,500만~1억 원 이상으로 추정됩니다. 수석 사무장은 1억 원을 초과하는 경우도 있습니다. 다만 사무장 승진은 경력 14년 이상 + 심사 통과가 필요합니다.",
  },
  {
    q: "승무원은 나이 제한이 있나요?",
    a: "공식적인 나이 제한은 없습니다. 그러나 현실적으로 대부분의 신입 채용은 20대 초~중반이 많습니다. 경력직 채용은 별도로 진행되며, 나이보다 체력·어학·서비스 경험이 중요합니다.",
  },
  {
    q: "항공권 혜택이 실제로 얼마나 되나요?",
    a: "재직 중 본인과 가족에게 연간 일정 매수의 할인 항공권이 제공됩니다. 대한항공 기준 본인 무료권, 가족 할인권 등이 있으며 좌석 여유가 있을 때 이용 가능한 스탠바이 티켓 형태입니다. 금전적 환산 가치는 연 수백만 원에 달할 수 있습니다.",
  },
];
