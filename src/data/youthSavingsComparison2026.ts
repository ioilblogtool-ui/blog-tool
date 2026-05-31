// 청년미래적금 vs 청년도약계좌 vs 청년희망적금 비교 리포트 2026
// 출처: 금융위원회·서민금융진흥원·각 은행 공식 자료
// ⚠️ 금리·기여금·가입 조건은 정책 변경에 따라 달라질 수 있습니다.
//    구현 후 반드시 공식 자료로 수치를 재확인하세요.

export type ProductId = 'future' | 'leap' | 'hope';

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

export interface ProductRecord {
  id: ProductId;
  name: string;
  nameShort: string;
  available: boolean;
  unavailableReason?: string;
  launchYear: number;
  ageMin: number;
  ageMax: number;
  incomeLimitLabel: string;
  householdIncomeNote: string;
  monthlyLimitMan: number;
  baseRateLabel: string;
  maxContributionLabel: string;
  taxFree: boolean;
  termMonths: number;
  termLabel: string;
  highlight: string;
  color: string;
}

export interface IncomeContributionRow {
  incomeLabel: string;
  incomeMax: number;
  leapContributionMan: number;  // 청년도약계좌 월 기여금 (만 원)
  futureContributionLabel: string; // 청년미래적금 기여 구조 설명
}

export interface SimulationRow {
  productId: ProductId;
  monthlyInputMan: number;       // 기준 납입액 (만 원)
  termMonths: number;
  totalInputMan: number;
  totalContributionMan: number;
  totalInterestMan: number;
  totalReceiveMan: number;
  isEstimate: boolean;
  unavailable?: boolean;
}

export interface IncomeRecommendCard {
  incomeGroup: string;           // 탭 data-key
  incomeLabel: string;
  incomeMax: number;
  recommendedProductId: ProductId;
  recommendedName: string;
  reason: string;
  tip?: string;
}

export interface DuplicateRow {
  combination: string;
  possible: boolean;
  note: string;
}

export interface CautionCard {
  title: string;
  description: string;
  icon: string;
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

export interface YouthSavingsReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  products: ProductRecord[];
  incomeContributions: IncomeContributionRow[];
  simulations: SimulationRow[];
  incomeRecommendCards: IncomeRecommendCard[];
  duplicateRows: DuplicateRow[];
  cautionCards: CautionCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}

// ── 상품 데이터 ───────────────────────────────────────────────────────────────
export const products: ProductRecord[] = [
  {
    id: 'future',
    name: '청년미래적금',
    nameShort: '미래적금',
    available: true,
    launchYear: 2026,
    ageMin: 19,
    ageMax: 34,
    incomeLimitLabel: '연 7,500만 원 이하',
    householdIncomeNote: '중위소득 250% 이하',
    monthlyLimitMan: 50,
    baseRateLabel: '연 4.5% 내외',
    maxContributionLabel: '월 최대 3.3만 원',
    taxFree: true,
    termMonths: 36,
    termLabel: '3년',
    highlight: '단기 3년 + 비과세 + 정부 기여금',
    color: '#6366f1',
  },
  {
    id: 'leap',
    name: '청년도약계좌',
    nameShort: '도약계좌',
    available: true,
    launchYear: 2023,
    ageMin: 19,
    ageMax: 34,
    incomeLimitLabel: '연 7,500만 원 이하',
    householdIncomeNote: '중위소득 250% 이하',
    monthlyLimitMan: 70,
    baseRateLabel: '연 4.5% 내외',
    maxContributionLabel: '월 최대 2.4만 원',
    taxFree: true,
    termMonths: 60,
    termLabel: '5년',
    highlight: '장기 5년 + 비과세 + 소득별 기여금',
    color: '#0891b2',
  },
  {
    id: 'hope',
    name: '청년희망적금',
    nameShort: '희망적금',
    available: false,
    unavailableReason: '2024년 2월 신규 가입 종료',
    launchYear: 2022,
    ageMin: 19,
    ageMax: 34,
    incomeLimitLabel: '연 3,600만 원 이하',
    householdIncomeNote: '가구소득 요건 없음',
    monthlyLimitMan: 50,
    baseRateLabel: '연 5.0%',
    maxContributionLabel: '저축장려금 (만기 지급)',
    taxFree: true,
    termMonths: 24,
    termLabel: '2년',
    highlight: '단기 2년 (신규 가입 종료)',
    color: '#9ca3af',
  },
];

// ── 소득별 기여금 구간 (청년도약계좌 기준) ────────────────────────────────────
export const incomeContributions: IncomeContributionRow[] = [
  {
    incomeLabel: '연 2,400만 원 이하',
    incomeMax: 2400,
    leapContributionMan: 2.4,
    futureContributionLabel: '월 최대 3.3만 원 (예정)',
  },
  {
    incomeLabel: '연 3,600만 원 이하',
    incomeMax: 3600,
    leapContributionMan: 2.3,
    futureContributionLabel: '월 최대 2.2만 원 (예정)',
  },
  {
    incomeLabel: '연 4,800만 원 이하',
    incomeMax: 4800,
    leapContributionMan: 2.2,
    futureContributionLabel: '월 최대 1.1만 원 (예정)',
  },
  {
    incomeLabel: '연 6,000만 원 이하',
    incomeMax: 6000,
    leapContributionMan: 0,
    futureContributionLabel: '비과세만 적용',
  },
  {
    incomeLabel: '연 7,500만 원 이하',
    incomeMax: 7500,
    leapContributionMan: 0,
    futureContributionLabel: '비과세만 적용',
  },
];

// ── 만기 수령액 시뮬레이션 (월 50만 원 기준) ─────────────────────────────────
// ⚠️ 단순 원리금 계산 기준 추정값. 실제 수령액과 차이 있을 수 있음.
export const simulations: SimulationRow[] = [
  {
    productId: 'future',
    monthlyInputMan: 50,
    termMonths: 36,
    totalInputMan: 1800,
    totalContributionMan: 119,    // 3.3만 × 36개월 (소득 최저 구간 기준)
    totalInterestMan: 127,        // 4.5% × 3년 단순 계산
    totalReceiveMan: 2046,
    isEstimate: true,
  },
  {
    productId: 'leap',
    monthlyInputMan: 50,
    termMonths: 60,
    totalInputMan: 3000,
    totalContributionMan: 144,    // 2.4만 × 60개월 (소득 최저 구간 기준)
    totalInterestMan: 352,        // 4.5% × 5년 단순 계산
    totalReceiveMan: 3496,
    isEstimate: true,
  },
  {
    productId: 'hope',
    monthlyInputMan: 50,
    termMonths: 24,
    totalInputMan: 1200,
    totalContributionMan: 36,     // 저축장려금 (1년차 2%, 2년차 4% 기준)
    totalInterestMan: 62,
    totalReceiveMan: 1298,
    isEstimate: true,
    unavailable: true,
  },
];

// ── 소득별 추천 카드 ──────────────────────────────────────────────────────────
export const incomeRecommendCards: IncomeRecommendCard[] = [
  {
    incomeGroup: 'under2400',
    incomeLabel: '연 2,400만 원 이하',
    incomeMax: 2400,
    recommendedProductId: 'leap',
    recommendedName: '청년도약계좌 우선 추천',
    reason:
      '정부 기여금이 월 최대 2.4만 원으로 가장 높습니다. 5년 장기 납입 시 기여금 합산 효과가 크고 비과세 혜택도 동일하게 적용됩니다.',
    tip: '청년미래적금이 병행 가입 가능하다면 3년 단기 적금으로 함께 활용하는 조합도 검토해보세요.',
  },
  {
    incomeGroup: 'under3600',
    incomeLabel: '연 3,600만 원 이하',
    incomeMax: 3600,
    recommendedProductId: 'leap',
    recommendedName: '청년도약계좌 + 청년미래적금 병행 검토',
    reason:
      '청년도약계좌 기여금(월 2.3만 원)을 받으면서 청년미래적금으로 단기 자금도 함께 관리할 수 있습니다. 병행 가입이 가능한지 먼저 확인하세요.',
    tip: '월 납입 여유가 없다면 기여금이 높은 도약계좌를 우선 유지하세요.',
  },
  {
    incomeGroup: 'under5000',
    incomeLabel: '연 5,000만 원 이하',
    incomeMax: 5000,
    recommendedProductId: 'future',
    recommendedName: '청년미래적금 우선 추천',
    reason:
      '청년도약계좌 기여금이 없는 소득 구간(4,800만 원 초과)이라면 3년 단기 비과세 혜택을 받을 수 있는 청년미래적금이 실질적으로 유리합니다.',
    tip: '청년도약계좌도 비과세 혜택은 유지되므로 5년 장기 저축 여유가 있다면 병행 검토하세요.',
  },
  {
    incomeGroup: 'under7500',
    incomeLabel: '연 7,500만 원 이하',
    incomeMax: 7500,
    recommendedProductId: 'future',
    recommendedName: '청년미래적금 추천',
    reason:
      '두 상품 모두 정부 기여금 없이 비과세 혜택만 적용됩니다. 3년 단기인 청년미래적금이 자금 유동성 측면에서 유리합니다.',
    tip: '비과세 한도를 초과하는 이자소득이 발생할 가능성이 낮으므로 만기 기간 위주로 선택하세요.',
  },
];

// ── 중복 가입 가능 여부 ───────────────────────────────────────────────────────
export const duplicateRows: DuplicateRow[] = [
  {
    combination: '청년미래적금 + 청년도약계좌',
    possible: true,
    note: '두 상품 동시 가입 가능. 단, 각 상품의 월 납입 한도는 별도 적용됩니다. 최신 정책 확인 필수.',
  },
  {
    combination: '청년미래적금 + ISA',
    possible: true,
    note: 'ISA(개인종합자산관리계좌)와 중복 가입 가능. 절세 효과를 극대화할 수 있습니다.',
  },
  {
    combination: '청년도약계좌 + ISA',
    possible: true,
    note: '중복 가입 가능하나 자금 분산이 필요합니다. 월 납입 여유를 확인하세요.',
  },
  {
    combination: '청년미래적금 + IRP',
    possible: true,
    note: 'IRP(개인형 퇴직연금)과 중복 가입 가능. IRP는 연말정산 세액공제(최대 148.5만 원)와 연계됩니다.',
  },
];

// ── 주의사항 카드 ─────────────────────────────────────────────────────────────
export const cautionCards: CautionCard[] = [
  {
    icon: '⚠️',
    title: '소득 요건을 착각하기 쉽습니다',
    description:
      '개인소득 요건과 가구소득(중위소득 250%) 요건이 모두 적용됩니다. 부모와 동거하거나 피부양자로 등재된 경우 가구소득 계산에 포함될 수 있으니 반드시 확인하세요.',
  },
  {
    icon: '🔒',
    title: '중도 해지 시 혜택이 사라집니다',
    description:
      '정부 기여금은 반환해야 하고 비과세 혜택도 소멸합니다. 납입 여유 자금이 충분할 때만 가입하고, 급전이 필요한 상황에 대비한 별도 비상금을 준비하세요.',
  },
  {
    icon: '📅',
    title: '가입 기간이 한정될 수 있습니다',
    description:
      '청년미래적금은 한시 운영 상품일 수 있습니다. 공식 가입 마감일을 반드시 확인하고, 조기 종료될 경우 청년도약계좌로 전환 여부를 검토하세요.',
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
export const faq: FaqItem[] = [
  {
    q: '청년미래적금과 청년도약계좌를 동시에 가입할 수 있나요?',
    a: '현재 두 상품의 중복 가입이 가능하도록 운영되고 있습니다. 단, 각 상품의 소득 요건과 월 납입 한도는 별도로 적용됩니다. 최신 정책 변경 여부를 서민금융진흥원에서 확인하세요.',
  },
  {
    q: '소득이 없는 대학생도 가입할 수 있나요?',
    a: '근로소득 또는 사업소득이 있어야 합니다. 소득이 없는 대학생은 가입이 어렵습니다. 아르바이트 등으로 발생한 소득이 있다면 국세청 소득 확인을 통해 가입 가능 여부를 확인하세요.',
  },
  {
    q: '청년희망적금은 지금도 가입할 수 있나요?',
    a: '2024년 2월에 신규 가입이 종료됐습니다. 기존 가입자는 만기까지 유지할 수 있지만, 새로 가입하는 것은 불가능합니다.',
  },
  {
    q: '정부 기여금은 언제 지급되나요?',
    a: '청년도약계좌의 경우 납입 월마다 정부 기여금이 적립됩니다. 청년미래적금의 기여금 지급 방식은 출시 시점 공식 안내를 확인하세요. 중도 해지 시 기여금은 반환됩니다.',
  },
  {
    q: '중도 해지하면 어떻게 되나요?',
    a: '정부 기여금 전액을 반환해야 하고, 비과세 혜택도 소멸합니다. 불가피한 사유(취업·결혼·전세 등)로 인한 특별 중도 해지는 혜택 일부를 인정받을 수 있습니다. 가입 은행에 사전 문의하세요.',
  },
];

// ── 관련 링크 ──────────────────────────────────────────────────────────────────
export const relatedLinks: RelatedLink[] = [
  {
    label: '연금저축 vs IRP 비교 2026',
    href: '/reports/pension-irp-comparison-2026/',
    description: '세액공제·운용·수령 방식까지 한눈에 비교합니다.',
  },
  {
    label: '2026 연말정산 절세 전략',
    href: '/reports/2026-year-end-tax-saving-guide/',
    description: '청년 적금과 연계해 세금을 줄이는 방법을 확인하세요.',
  },
  {
    label: '정부 복지지원금 완전 정복',
    href: '/reports/2026-government-welfare-benefits/',
    description: '청년 대상 정부 지원금 전체 목록을 정리했습니다.',
  },
];

// ── 메타 ──────────────────────────────────────────────────────────────────────
export const reportMeta: ReportMeta = {
  seoTitle: '청년미래적금 vs 청년도약계좌 완전 비교 2026 — 가입 조건·수령액·유불리 총정리 | 비교계산소',
  seoDescription:
    '청년미래적금, 청년도약계좌, 청년희망적금 가입 조건·정부 지원금·만기 수령액을 한 번에 비교합니다. 소득별 유불리 분석과 수령액 시뮬레이션 포함.',
  ogTitle: '청년미래적금 vs 청년도약계좌 비교 2026',
  ogDescription: '청년 저축 상품 3종의 가입 조건·수령액·소득별 유불리를 한눈에 비교합니다.',
  dataSourceLabel: '금융위원회·서민금융진흥원 공개 자료',
  updatedAt: '2026-05-31',
  caution:
    '본 리포트는 금융위원회·서민금융진흥원 공개 자료를 기준으로 정리한 참고용 비교 콘텐츠입니다. 금리·기여금·가입 조건은 정책 변경에 따라 달라질 수 있으므로 가입 전 반드시 공식 자료를 재확인하세요.',
};

// ── KPI 카드 ─────────────────────────────────────────────────────────────────
export const kpis: KpiCard[] = [
  {
    label: '청년미래적금 최대 기여금',
    value: '월 3.3만 원',
    sub: '소득 2,400만 원 이하 기준 (비과세 포함)',
    tone: 'accent',
  },
  {
    label: '청년도약계좌 5년 예상 수령액',
    value: '약 3,496만 원',
    sub: '월 50만 원 납입 기준 추정값',
    tone: 'neutral',
  },
  {
    label: '청년희망적금',
    value: '신규 가입 종료',
    sub: '2024년 2월 종료 — 기존 가입자만 유지',
    tone: 'warn',
  },
];

// ── 전체 익스포트 ─────────────────────────────────────────────────────────────
export const youthSavingsReport: YouthSavingsReportData = {
  meta: reportMeta,
  kpis,
  products,
  incomeContributions,
  simulations,
  incomeRecommendCards,
  duplicateRows,
  cautionCards,
  faq,
  relatedLinks,
};
