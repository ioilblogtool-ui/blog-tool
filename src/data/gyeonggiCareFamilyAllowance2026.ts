// ============================================================
// 2026 경기도 가족돌봄수당
// 출처: 경기민원24 공식 안내 (https://gg24.gg.go.kr)
// 데이터 기준일: 2026-07-01
// ============================================================

export type AllowanceBadge = "공식" | "참고";

export interface GfcaMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  applyPeriodLabel: string;
  applyPeriodStart: string;
  applyPeriodEnd: string;
  applyUrl: string;
  updatedAt: string;
  notice: string;
}

export interface GfcaCondition {
  id: string;
  label: string;
  value: string;
  detail: string;
  badge: AllowanceBadge;
  icon: string;
}

export interface GfcaAmountCard {
  childCount: number;
  label: string;
  monthlyAmountWon: number;
  annualEstimateWon: number;
  note: string;
  isHighlight: boolean;
}

export interface GfcaAgeRow {
  id: string;
  birthMonthRange: string;
  applyMonth: string;
  applyMonthIndex: number;
  careStartMonth: string;
  isCurrent: boolean;
  birthYearStart: number;
  birthMonthStart: number;
  birthYearEnd: number;
  birthMonthEnd: number;
}

export interface GfcaDisabledCity {
  name: string;
  reason: "미참여" | "신규접수중단";
}

export interface GfcaDocument {
  id: string;
  category: "행정공동이용" | "돌봄조력자" | "양육공백" | "기타";
  label: string;
  required: boolean;
  note?: string;
}

export interface GfcaHelperCard {
  type: "친인척형" | "이웃형";
  condition: string;
  examples: string;
  caution?: string;
}

export interface GfcaFaqItem {
  q: string;
  a: string;
}

export interface GfcaRelatedLink {
  href: string;
  label: string;
  description: string;
}

// ============================================================
// META
// ============================================================

export const GFCA_META: GfcaMeta = {
  slug: "gyeonggi-family-care-allowance-2026",
  title: "2026 경기도 가족돌봄수당",
  seoTitle: "경기도 가족돌봄수당 2026 | 24~36개월 맞벌이 가정 월 30만원 신청 조건",
  seoDescription:
    "2026 경기도 가족돌봄수당 신청 대상, 지원 금액, 신청 월 조견표, 미참여 시군을 정리했습니다. 아동 1명 월 30만원, 출생월별 신청 가능 시기와 필요서류까지 한눈에 확인하세요.",
  applyPeriodLabel: "2026.07.01(수) 10:00 ~ 2026.07.15(수) 18:00",
  applyPeriodStart: "2026-07-01T10:00:00+09:00",
  applyPeriodEnd: "2026-07-15T18:00:00+09:00",
  applyUrl: "https://gg24.gg.go.kr",
  updatedAt: "2026-07-01",
  notice:
    "이 페이지는 경기민원24 공식 안내를 정리한 참고용 콘텐츠입니다. 소득 기준 충족 여부와 최종 자격 판정은 담당 시·군에서 확인합니다. 예산 소진 시 조기 종료될 수 있습니다.",
};

// ============================================================
// 지원 조건
// ============================================================

export const GFCA_CONDITIONS: GfcaCondition[] = [
  {
    id: "age",
    label: "연령",
    value: "생후 24~36개월",
    detail: "돌봄활동 해당 월 기준 아동 연령 (신청일 기준 아님)",
    badge: "공식",
    icon: "👶",
  },
  {
    id: "income",
    label: "소득",
    value: "중위소득 150% 이하",
    detail: "가구 소득 기준 — 최종 판정은 담당 시·군에서 확인",
    badge: "공식",
    icon: "💰",
  },
  {
    id: "address",
    label: "주소",
    value: "사업 참여 시·군 거주",
    detail: "신청일 기준 양육자(부 또는 모)와 아동이 동일 시·군 주소 거주",
    badge: "공식",
    icon: "📍",
  },
  {
    id: "caretime",
    label: "돌봄시간",
    value: "월 40시간 이상",
    detail: "일 최대 4시간까지 인정 / 맞벌이·다자녀 등 양육공백 가정",
    badge: "공식",
    icon: "⏰",
  },
];

// ============================================================
// 지원 금액
// ============================================================

export const GFCA_AMOUNTS: GfcaAmountCard[] = [
  {
    childCount: 1,
    label: "아동 1명",
    monthlyAmountWon: 300_000,
    annualEstimateWon: 3_600_000,
    note: "월 40시간 이상 돌봄 수행 시",
    isHighlight: false,
  },
  {
    childCount: 2,
    label: "아동 2명",
    monthlyAmountWon: 450_000,
    annualEstimateWon: 5_400_000,
    note: "월 40시간 이상 돌봄 수행 시",
    isHighlight: true,
  },
  {
    childCount: 3,
    label: "아동 3명",
    monthlyAmountWon: 600_000,
    annualEstimateWon: 7_200_000,
    note: "월 40시간 이상 돌봄 수행 시",
    isHighlight: false,
  },
];

// ============================================================
// 신청 연령 조견표
// ============================================================

export const GFCA_AGE_TABLE: GfcaAgeRow[] = [
  {
    id: "row-01",
    birthMonthRange: "2023년 1월생 ~ 2024년 1월생",
    applyMonth: "2025년 12월",
    applyMonthIndex: 202512,
    careStartMonth: "2026년 1월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 1,
    birthYearEnd: 2024, birthMonthEnd: 1,
  },
  {
    id: "row-02",
    birthMonthRange: "2023년 2월생 ~ 2024년 2월생",
    applyMonth: "2026년 1월",
    applyMonthIndex: 202601,
    careStartMonth: "2026년 2월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 2,
    birthYearEnd: 2024, birthMonthEnd: 2,
  },
  {
    id: "row-03",
    birthMonthRange: "2023년 3월생 ~ 2024년 3월생",
    applyMonth: "2026년 2월",
    applyMonthIndex: 202602,
    careStartMonth: "2026년 3월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 3,
    birthYearEnd: 2024, birthMonthEnd: 3,
  },
  {
    id: "row-04",
    birthMonthRange: "2023년 4월생 ~ 2024년 4월생",
    applyMonth: "2026년 3월",
    applyMonthIndex: 202603,
    careStartMonth: "2026년 4월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 4,
    birthYearEnd: 2024, birthMonthEnd: 4,
  },
  {
    id: "row-05",
    birthMonthRange: "2023년 5월생 ~ 2024년 5월생",
    applyMonth: "2026년 4월",
    applyMonthIndex: 202604,
    careStartMonth: "2026년 5월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 5,
    birthYearEnd: 2024, birthMonthEnd: 5,
  },
  {
    id: "row-06",
    birthMonthRange: "2023년 6월생 ~ 2024년 6월생",
    applyMonth: "2026년 5월",
    applyMonthIndex: 202605,
    careStartMonth: "2026년 6월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 6,
    birthYearEnd: 2024, birthMonthEnd: 6,
  },
  {
    id: "row-07",
    birthMonthRange: "2023년 7월생 ~ 2024년 7월생",
    applyMonth: "2026년 6월",
    applyMonthIndex: 202606,
    careStartMonth: "2026년 7월~",
    isCurrent: true,
    birthYearStart: 2023, birthMonthStart: 7,
    birthYearEnd: 2024, birthMonthEnd: 7,
  },
  {
    id: "row-08",
    birthMonthRange: "2023년 8월생 ~ 2024년 8월생",
    applyMonth: "2026년 7월",
    applyMonthIndex: 202607,
    careStartMonth: "2026년 8월~",
    isCurrent: true,
    birthYearStart: 2023, birthMonthStart: 8,
    birthYearEnd: 2024, birthMonthEnd: 8,
  },
  {
    id: "row-09",
    birthMonthRange: "2023년 9월생 ~ 2024년 9월생",
    applyMonth: "2026년 8월",
    applyMonthIndex: 202608,
    careStartMonth: "2026년 9월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 9,
    birthYearEnd: 2024, birthMonthEnd: 9,
  },
  {
    id: "row-10",
    birthMonthRange: "2023년 10월생 ~ 2024년 10월생",
    applyMonth: "2026년 9월",
    applyMonthIndex: 202609,
    careStartMonth: "2026년 10월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 10,
    birthYearEnd: 2024, birthMonthEnd: 10,
  },
  {
    id: "row-11",
    birthMonthRange: "2023년 11월생 ~ 2024년 11월생",
    applyMonth: "2026년 10월",
    applyMonthIndex: 202610,
    careStartMonth: "2026년 11월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 11,
    birthYearEnd: 2024, birthMonthEnd: 11,
  },
  {
    id: "row-12",
    birthMonthRange: "2023년 12월생 ~ 2024년 12월생",
    applyMonth: "2026년 11월",
    applyMonthIndex: 202611,
    careStartMonth: "2026년 12월~",
    isCurrent: false,
    birthYearStart: 2023, birthMonthStart: 12,
    birthYearEnd: 2024, birthMonthEnd: 12,
  },
];

// ============================================================
// 미참여·접수중단 시군
// ============================================================

export const GFCA_DISABLED_CITIES: GfcaDisabledCity[] = [
  { name: "수원", reason: "미참여" },
  { name: "고양", reason: "미참여" },
  { name: "부천", reason: "미참여" },
  { name: "시흥", reason: "미참여" },
  { name: "김포", reason: "미참여" },
  { name: "과천", reason: "신규접수중단" },
  { name: "의왕", reason: "신규접수중단" },
];

// ============================================================
// 돌봄조력자 유형
// ============================================================

export const GFCA_HELPER_CARDS: GfcaHelperCard[] = [
  {
    type: "친인척형",
    condition: "4촌 이내 친인척",
    examples: "조부모, 삼촌·이모, 형제자매 등 4촌 이내",
    caution: "친인척이 수당을 수령하는 경우 경기도 주민이어야 합니다",
  },
  {
    type: "이웃형",
    condition: "이웃주민",
    examples: "같은 아파트·동네 거주 이웃",
    caution: "이웃주민 증빙을 위해 주민등록초본 사본을 제출해야 합니다",
  },
];

// ============================================================
// 필요서류
// ============================================================

export const GFCA_DOCUMENTS: GfcaDocument[] = [
  // 행정정보공동이용
  {
    id: "doc-01",
    category: "행정공동이용",
    label: "주민등록등본 사본",
    required: true,
    note: "신청일로부터 1주일 이내 발급본, 실거주지 기재본",
  },
  {
    id: "doc-02",
    category: "행정공동이용",
    label: "건강보험자격득실확인서",
    required: true,
  },
  {
    id: "doc-03",
    category: "행정공동이용",
    label: "한부모자격정보",
    required: false,
    note: "해당자에 한함",
  },
  {
    id: "doc-04",
    category: "행정공동이용",
    label: "장애인자격정보",
    required: false,
    note: "해당자에 한함",
  },
  // 돌봄조력자
  {
    id: "doc-05",
    category: "돌봄조력자",
    label: "돌봄조력자 신분증 사본",
    required: true,
    note: "주민등록증, 운전면허증, 여권 등",
  },
  {
    id: "doc-06",
    category: "돌봄조력자",
    label: "가족관계증명서 사본",
    required: false,
    note: "친인척인 경우",
  },
  {
    id: "doc-07",
    category: "돌봄조력자",
    label: "주민등록초본 사본",
    required: false,
    note: "이웃주민인 경우 또는 친인척 수령자 경기도 거주 확인용",
  },
  {
    id: "doc-08",
    category: "돌봄조력자",
    label: "돌봄조력자 수령 통장사본",
    required: false,
    note: "돌봄조력자가 수당을 수령하는 경우에 한함",
  },
  // 양육공백
  {
    id: "doc-09",
    category: "양육공백",
    label: "양육공백 확인 서류",
    required: true,
    note: "맞벌이·다자녀 등 신청인의 양육공백 기준에 해당하는 서류",
  },
  // 기타 (최종 선정자)
  {
    id: "doc-10",
    category: "기타",
    label: "아동학대 교육 이수증",
    required: false,
    note: "최종 선정자에 한함",
  },
  {
    id: "doc-11",
    category: "기타",
    label: "슬기로운 안전생활 교육 이수증",
    required: false,
    note: "최종 선정자에 한함",
  },
];

// ============================================================
// FAQ
// ============================================================

export const GFCA_FAQ: GfcaFaqItem[] = [
  {
    q: "신청 대상 아동의 연령 기준은 언제 기준인가요?",
    a: "돌봄활동이 이루어지는 월 기준으로 아동 연령이 생후 24개월~36개월이어야 합니다. 신청일 기준이 아닌 실제 돌봄 활동 월 기준임에 주의하세요.",
  },
  {
    q: "조부모가 같은 집에 살지 않아도 되나요?",
    a: "돌봄조력자(조부모 등)는 신청자와 동일 주소일 필요가 없습니다. 다만 친인척이 수당을 수령하는 경우 돌봄조력자가 경기도 주민이어야 합니다.",
  },
  {
    q: "맞벌이가 아니면 신청할 수 없나요?",
    a: "맞벌이 외에도 다자녀 등 양육공백이 발생하는 가정이면 신청 가능합니다. 양육공백 확인 서류로 해당 기준을 증빙해야 합니다.",
  },
  {
    q: "수원·고양·부천·시흥·김포 주민도 신청할 수 있나요?",
    a: "아닙니다. 수원·고양·부천·시흥·김포는 사업 미참여 시군으로 신청이 불가능합니다. 과천·의왕은 신규 접수가 중단된 상태입니다.",
  },
  {
    q: "아동이 2명이면 수당이 두 배인가요?",
    a: "아닙니다. 아동 1명 월 30만원, 2명 45만원, 3명 60만원으로 아동 수에 따라 구간별로 지원됩니다.",
  },
  {
    q: "수당은 양육자 통장으로 지급되나요?",
    a: "기본적으로 양육자에게 지급됩니다. 돌봄조력자가 수당을 수령하려면 별도 통장 사본을 제출해야 하며, 이 경우 돌봄조력자가 경기도 주민이어야 합니다.",
  },
  {
    q: "교육 이수증은 신청 전에 완료해야 하나요?",
    a: "아동학대 교육 이수증과 슬기로운 안전생활 교육 이수증은 최종 선정자에 한해 제출합니다. 신청 단계에서 필수 서류가 아닙니다.",
  },
  {
    q: "예산이 소진되면 어떻게 되나요?",
    a: "사업은 예산 범위 내에서 운영되며 예산 소진 시 조기 종료될 수 있습니다. 신청 기간 내 접수했더라도 예산 초과 시 선정이 보장되지 않습니다.",
  },
  {
    q: "오프라인 신청은 불가능한가요?",
    a: "경기민원24 온라인 신청만 가능합니다. 크롬 또는 엣지 브라우저 사용이 권장됩니다.",
  },
];

// ============================================================
// 관련 링크
// ============================================================

export const GFCA_RELATED_LINKS: GfcaRelatedLink[] = [
  {
    href: "/tools/postnatal-care-income-eligibility/",
    label: "산후도우미 지원금 소득기준 계산기",
    description: "건강보험료로 산후도우미 정부지원 대상 여부 확인",
  },
  {
    href: "/tools/postnatal-care-cost/",
    label: "산후도우미 비용 계산기",
    description: "정부지원 유형별 산후도우미 본인부담금 계산",
  },
  {
    href: "/tools/birth-support-total/",
    label: "출산~2세 지원금 계산기",
    description: "출산 직후부터 2세까지 받을 수 있는 지원금 합산",
  },
  {
    href: "/reports/baby-formula-brand-cost-comparison-2026/",
    label: "분유 브랜드별 비용 비교 2026",
    description: "월령별 분유 1개월·12개월 비용 비교",
  },
  {
    href: "/compare/welfare/",
    label: "지원금 비교 허브",
    description: "청년·출산·복지 지원금 상황별 모음",
  },
];

// ============================================================
// SEO 콘텐츠
// ============================================================

export const GFCA_SEO_INTRO = [
  "경기도 가족돌봄수당은 맞벌이·다자녀 가정에서 조부모·친인척·이웃주민이 생후 24~36개월 아이를 돌볼 때 지원하는 수당입니다. 아동 1명 기준 월 30만원, 2명 45만원, 3명 60만원을 계좌이체로 받을 수 있습니다.",
  "2026년 신청은 출생월에 따라 신청 가능 월이 다릅니다. 2023년 7~8월생 아동 가정은 2026년 6~7월이 신청 적기입니다. 조견표를 확인해 내 아이의 신청 가능 월을 먼저 확인하는 것이 중요합니다.",
  "수원·고양·부천·시흥·김포는 사업 미참여 시군으로 신청이 불가능하며, 과천·의왕은 신규 접수가 중단된 상태입니다. 신청 전 반드시 거주 시군 참여 여부를 확인해야 합니다.",
  "돌봄조력자는 4촌 이내 친인척(조부모 포함)과 이웃주민이 가능합니다. 월 40시간 이상 돌봄을 수행해야 하며, 하루 최대 4시간까지 인정됩니다.",
  "신청은 양육자(부 또는 모)만 가능하며 경기민원24에서 온라인으로만 접수합니다. 크롬 또는 엣지 브라우저 사용이 권장됩니다.",
];

export const GFCA_SEO_CRITERIA = [
  "연령 기준은 돌봄활동 월 기준 생후 24~36개월입니다.",
  "소득 기준은 중위소득 150% 이하이며 담당 시군에서 최종 확인합니다.",
  "돌봄조력자는 4촌 이내 친인척 또는 이웃주민이어야 합니다.",
  "월 40시간 이상 돌봄 수행 시 수당이 지급되며 일 최대 4시간까지 인정됩니다.",
  "신청은 양육자(부 또는 모)만 가능하며 경기민원24에서 온라인으로만 접수합니다.",
];
