// 직종별 연금 비교 리포트 2026 — 공무원·군인·사학·국민연금
// 출처: 인사혁신처·국민연금공단·군인연금공단·사학연금공단 공개 자료
// ⚠️ 수령액은 단순 소득대체율 기반 추정값입니다. 실제 수령액은 재직기간·물가연동에 따라 다릅니다.

export type PensionId = 'civil' | 'military' | 'private-school' | 'national';
export type TermKey = 'y10' | 'y20' | 'y30';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  dataSourceLabel: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface PensionRecord {
  id: PensionId;
  name: string;
  nameShort: string;
  target: string;
  selfRatePct: number;
  employerRatePct: number;
  totalRatePct: number;
  paymentStartAge: string;
  replacementRate20y: string;
  currentStatus: string;
  note: string;
  color: string;
}

export interface ContributionRow {
  pensionId: PensionId;
  selfMonthlyMan: number;
  employerMonthlyMan: number;
  totalMonthlyMan: number;
  selfTotal20yMan: number;  // 20년 본인 납입 총액
}

export interface TermSimRow {
  pensionId: PensionId;
  monthlyReceiveMan: number;
  isEstimate: boolean;
}

export interface TermSimulation {
  termKey: TermKey;
  termLabel: string;
  termYears: number;
  rows: TermSimRow[];
}

export interface BreakevenCard {
  pensionId: PensionId;
  totalContribMan: number;
  monthlyReceiveMan: number;
  breakevenYears: number;
  breakevenAgeNote: string;
  note: string;
  isEstimate: boolean;
}

export interface ReformCard {
  title: string;
  description: string;
  affectedPensionIds: PensionId[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface PensionByJobReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  pensions: PensionRecord[];
  contributions: ContributionRow[];
  termSimulations: TermSimulation[];
  breakevenCards: BreakevenCard[];
  reformCards: ReformCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}

// ── 연금 레코드 ───────────────────────────────────────────────────────────────
export const pensions: PensionRecord[] = [
  {
    id: 'civil',
    name: '공무원연금',
    nameShort: '공무원',
    target: '국가·지방 공무원',
    selfRatePct: 9,
    employerRatePct: 9,
    totalRatePct: 18,
    paymentStartAge: '65세 (2033년 완전 전환)',
    replacementRate20y: '약 35~40%',
    currentStatus: '2015·2025년 개혁 반영',
    note: '2015년 개혁으로 소득대체율 하락. 신규 공무원은 개혁 이후 구조 적용.',
    color: '#6366f1',
  },
  {
    id: 'military',
    name: '군인연금',
    nameShort: '군인',
    target: '현역 군인',
    selfRatePct: 9,
    employerRatePct: 9,
    totalRatePct: 18,
    paymentStartAge: '20년 복무 충족 시 즉시 수령 가능',
    replacementRate20y: '약 40~50%',
    currentStatus: '기존 구조 유지',
    note: '20년 이상 복무 시 전역 즉시 수령. 타 연금 대비 조기 수급 가능.',
    color: '#0f766e',
  },
  {
    id: 'private-school',
    name: '사학연금',
    nameShort: '사학',
    target: '사립학교 교직원',
    selfRatePct: 9,
    employerRatePct: 9,
    totalRatePct: 18,
    paymentStartAge: '65세',
    replacementRate20y: '약 35~40%',
    currentStatus: '공무원연금 준용',
    note: '공무원연금과 거의 동일한 구조. 학교법인(고용주)이 9% 부담.',
    color: '#9333ea',
  },
  {
    id: 'national',
    name: '국민연금',
    nameShort: '국민',
    target: '만 18~60세 소득자 (민간 근로자 등)',
    selfRatePct: 4.5,
    employerRatePct: 4.5,
    totalRatePct: 9,
    paymentStartAge: '63세 → 65세 (출생연도별 단계 상향)',
    replacementRate20y: '약 25~30%',
    currentStatus: '2025년 개혁: 소득대체율 40%→42% 단계 인상',
    note: '본인 납입률이 4.5%로 타 직역연금의 절반. 납입 부담이 낮은 대신 수령액도 낮음.',
    color: '#0891b2',
  },
];

// ── 납입 부담 (월 기준소득 300만 원 기준) ────────────────────────────────────
export const contributions: ContributionRow[] = [
  { pensionId: 'civil',          selfMonthlyMan: 27,   employerMonthlyMan: 27,   totalMonthlyMan: 54,   selfTotal20yMan: 6480 },
  { pensionId: 'military',       selfMonthlyMan: 27,   employerMonthlyMan: 27,   totalMonthlyMan: 54,   selfTotal20yMan: 6480 },
  { pensionId: 'private-school', selfMonthlyMan: 27,   employerMonthlyMan: 27,   totalMonthlyMan: 54,   selfTotal20yMan: 6480 },
  { pensionId: 'national',       selfMonthlyMan: 13.5, employerMonthlyMan: 13.5, totalMonthlyMan: 27,   selfTotal20yMan: 3240 },
];

// ── 납입 기간별 예상 월 수령액 시뮬레이션 (월 300만 원 기준, 단순 추정) ────────
export const termSimulations: TermSimulation[] = [
  {
    termKey: 'y10',
    termLabel: '10년 납입',
    termYears: 10,
    rows: [
      { pensionId: 'civil',          monthlyReceiveMan: 53,  isEstimate: true },
      { pensionId: 'military',       monthlyReceiveMan: 60,  isEstimate: true },
      { pensionId: 'private-school', monthlyReceiveMan: 53,  isEstimate: true },
      { pensionId: 'national',       monthlyReceiveMan: 25,  isEstimate: true },
    ],
  },
  {
    termKey: 'y20',
    termLabel: '20년 납입',
    termYears: 20,
    rows: [
      { pensionId: 'civil',          monthlyReceiveMan: 105, isEstimate: true },
      { pensionId: 'military',       monthlyReceiveMan: 120, isEstimate: true },
      { pensionId: 'private-school', monthlyReceiveMan: 105, isEstimate: true },
      { pensionId: 'national',       monthlyReceiveMan: 50,  isEstimate: true },
    ],
  },
  {
    termKey: 'y30',
    termLabel: '30년 납입',
    termYears: 30,
    rows: [
      { pensionId: 'civil',          monthlyReceiveMan: 158, isEstimate: true },
      { pensionId: 'military',       monthlyReceiveMan: 180, isEstimate: true },
      { pensionId: 'private-school', monthlyReceiveMan: 158, isEstimate: true },
      { pensionId: 'national',       monthlyReceiveMan: 75,  isEstimate: true },
    ],
  },
];

// ── 손익분기점 (20년 납입, 본인 부담 기준) ────────────────────────────────────
export const breakevenCards: BreakevenCard[] = [
  {
    pensionId: 'civil',
    totalContribMan: 6480,
    monthlyReceiveMan: 105,
    breakevenYears: Math.round(6480 / 105 / 12 * 10) / 10,
    breakevenAgeNote: '65세 수급 기준 약 70세',
    note: '',
    isEstimate: true,
  },
  {
    pensionId: 'military',
    totalContribMan: 6480,
    monthlyReceiveMan: 120,
    breakevenYears: Math.round(6480 / 120 / 12 * 10) / 10,
    breakevenAgeNote: '20년 복무 후 즉시 수급 시 약 4.5년 후',
    note: '20년 복무 충족 시 전역 즉시 수령 가능. 수급 개시 나이가 타 연금보다 이를 수 있음.',
    isEstimate: true,
  },
  {
    pensionId: 'private-school',
    totalContribMan: 6480,
    monthlyReceiveMan: 105,
    breakevenYears: Math.round(6480 / 105 / 12 * 10) / 10,
    breakevenAgeNote: '65세 수급 기준 약 70세',
    note: '',
    isEstimate: true,
  },
  {
    pensionId: 'national',
    totalContribMan: 3240,
    monthlyReceiveMan: 50,
    breakevenYears: Math.round(3240 / 50 / 12 * 10) / 10,
    breakevenAgeNote: '63~65세 수급 기준 약 5.4년 후',
    note: '본인 납입 총액이 절반이어서 회수 기간은 비슷하지만 총 수령액은 적음.',
    isEstimate: true,
  },
];

// ── 연금개혁 요약 카드 ─────────────────────────────────────────────────────────
export const reformCards: ReformCard[] = [
  {
    title: '국민연금 개혁 (2025)',
    description:
      '소득대체율 40% → 42%로 단계 인상. 보험료율 9% → 13%로 2033년까지 단계 인상. 수령액은 소폭 개선되나 납입 부담도 증가합니다.',
    affectedPensionIds: ['national'],
  },
  {
    title: '공무원·사학연금 개혁 (2015·2025)',
    description:
      '2015년 개혁으로 소득대체율 하락 및 납입률 조정. 2025년 추가 조정. 신규 공무원은 국민연금과의 격차가 이전보다 줄어들었으나 여전히 우위.',
    affectedPensionIds: ['civil', 'private-school'],
  },
  {
    title: '개혁 후에도 직역연금 우위는 유지',
    description:
      '공무원·군인·사학연금은 납입률이 높은 만큼 수령액도 높습니다. 개혁으로 격차가 축소됐지만 20년 이상 납입 시 국민연금 대비 2~2.5배 수령액 차이는 유지됩니다.',
    affectedPensionIds: ['civil', 'military', 'private-school', 'national'],
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
export const faq: FaqItem[] = [
  {
    q: '공무원연금이 국민연금보다 얼마나 더 받나요?',
    a: '월 기준소득 300만 원, 20년 납입 기준 단순 추정 시 공무원연금 약 105만 원, 국민연금 약 50만 원으로 약 2배 차이입니다. 다만 공무원은 본인 납입률도 9%(국민연금 4.5%의 2배)로 납입 부담도 큽니다.',
  },
  {
    q: '군인연금은 왜 다른 연금보다 유리한가요?',
    a: '군인연금은 20년 이상 복무 시 전역 즉시 수령할 수 있어 수급 개시 나이가 빠릅니다. 같은 납입 기간 기준으로 소득대체율도 공무원연금보다 높습니다. 단, 군인이라는 직업적 특수성과 위험성이 반영된 구조입니다.',
  },
  {
    q: '사학연금은 공무원연금과 같은 수준인가요?',
    a: '거의 동일합니다. 납입률(본인 9%, 학교 9%), 지급 개시 나이(65세), 소득대체율 구조가 공무원연금을 준용합니다. 차이는 국가 대신 학교법인이 고용주 부담분을 납부한다는 점입니다.',
  },
  {
    q: '공무원이 되면 국민연금 대신 공무원연금을 가입하나요?',
    a: '네. 공무원·군인·사학 교직원은 국민연금 대신 각 직역연금에 의무 가입합니다. 민간 직장인은 국민연금에 가입합니다. 직역연금에서 탈퇴 후 민간으로 이직하면 국민연금으로 전환됩니다.',
  },
  {
    q: '연금개혁 이후 공무원연금도 불리해졌나요?',
    a: '2015년과 2025년 개혁으로 소득대체율이 낮아졌고 납입률도 조정됐습니다. 과거보다 수령액이 줄었으나 여전히 국민연금 대비 높은 수령액을 유지합니다. 신규 공무원일수록 개혁 영향을 더 크게 받습니다.',
  },
];

// ── 관련 링크 ─────────────────────────────────────────────────────────────────
export const relatedLinks: RelatedLink[] = [
  {
    label: '국민연금 세대별 손익 비교 2026',
    href: '/reports/national-pension-generational-comparison-2026/',
    description: '세대별 납입·수령 손익분기점을 비교합니다.',
  },
  {
    label: '연금 수령 나이별 실수령액 비교',
    href: '/reports/pension-age-comparison-2026/',
    description: '조기·정상·연기 수령 시 월 수령액과 생애 누적을 비교합니다.',
  },
  {
    label: '2026 공무원 9급 연봉 가이드',
    href: '/reports/public-servant-salary-2026/',
    description: '호봉별 기본급·수당·실수령액을 확인하세요.',
  },
];

// ── 메타 ──────────────────────────────────────────────────────────────────────
export const reportMeta: ReportMeta = {
  seoTitle: '직종별 연금 비교 2026 — 공무원·군인·사학·국민연금 수령액 얼마나 다를까 | 비교계산소',
  seoDescription:
    '공무원연금, 군인연금, 사학연금, 국민연금을 같은 월급·납입 기간 기준으로 비교합니다. 20년 납입 기준 예상 수령액 차이와 손익분기점을 확인하세요.',
  ogTitle: '직종별 연금 비교 2026 — 공무원·군인·사학·국민연금',
  ogDescription: '같은 월급, 20년 납입 기준 직종별 연금 수령액을 한눈에 비교합니다.',
  dataSourceLabel: '인사혁신처·국민연금공단·군인연금공단·사학연금공단 공개 자료',
  updatedAt: '2026-05-31',
  caution:
    '수령액은 월 기준소득 300만 원 기준 단순 소득대체율 추정값입니다. 실제 수령액은 재직기간·물가연동·개혁 시점에 따라 달라집니다. 가입 전 각 연금 공단에서 정확한 수령액을 확인하세요.',
};

// ── KPI ──────────────────────────────────────────────────────────────────────
export const kpis: KpiCard[] = [
  {
    label: '20년 납입 최고 수령액 (추정)',
    value: '군인연금 약 120만 원/월',
    sub: '월 300만 원 기준 단순 추정값',
    tone: 'accent',
  },
  {
    label: '20년 납입 최저 수령액 (추정)',
    value: '국민연금 약 50만 원/월',
    sub: '월 300만 원 기준 단순 추정값',
    tone: 'neutral',
  },
  {
    label: '직역연금 vs 국민연금 격차',
    value: '약 2~2.5배',
    sub: '20년 납입 기준 월 수령액 비교',
    tone: 'warn',
  },
  {
    label: '본인 납입 부담 차이',
    value: '월 27만 원 vs 13.5만 원',
    sub: '직역연금(9%) vs 국민연금(4.5%) 월 300만 원 기준',
    tone: 'neutral',
  },
];

// ── 전체 익스포트 ─────────────────────────────────────────────────────────────
export const pensionByJobReport: PensionByJobReportData = {
  meta: reportMeta,
  kpis,
  pensions,
  contributions,
  termSimulations,
  breakevenCards,
  reformCards,
  faq,
  relatedLinks,
};
