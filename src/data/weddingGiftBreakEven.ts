// ── 타입 ────────────────────────────────────────────────────────
export type RiskLevel = 'SAFE' | 'NORMAL' | 'CAUTION' | 'DANGER';

export interface WeddingGiftPreset {
  label: string;
  mealCostPerPerson: number;
  guaranteedGuests: number;
  expectedGuests: number;
  avgGiftAmount: number;
  venueFee: number;
  decorationFee: number;
  otherFixedCost: number;
}

export interface AffiliateProduct {
  tag: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

export interface ExternalLink {
  title: string;
  desc: string;
  source: string;
  href: string;
}

export interface NextToolCta {
  href: string;
  eyebrow: string;
  title: string;
  desc: string;
  badges: string[];
  cta: string;
  sub: Array<{ href: string; title: string; desc: string; badges: string[] }>;
}

// ── 메타 ────────────────────────────────────────────────────────
export const PAGE_META = {
  title: '결혼 축의금 손익분기점 계산기 | 예식홀 식대·보증인원·하객 수 계산',
  description: '예식홀 식대, 보증인원, 실제 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산해보세요. 하객 200명·300명 예시와 손익분기점도 함께 제공합니다.',
  subtitle: '예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산합니다.',
  methodology: '1인 식대 × max(보증인원, 예상 하객 수) 기준 계산. 노쇼 및 식권 누수 반영 가능.',
  caution: '이 결과는 입력값 기반 모의계산입니다. 실제 예식 계약 조건과 다를 수 있습니다.',
  updatedAt: '2026년 4월 기준',
  ogImage: '/og/tools/wedding-gift-break-even-calculator.png',
};

// ── 기본값 ──────────────────────────────────────────────────────
export const DEFAULT_INPUTS = {
  mealCostPerPerson: 55000,
  guaranteedGuests: 300,
  expectedGuests: 280,
  avgGiftAmount: 70000,
  venueFee: 1000000,
  decorationFee: 1500000,
  otherFixedCost: 500000,
};

export const DEFAULT_DETAIL_INPUTS = {
  friendCount: 60,
  friendAvgGift: 50000,
  coworkerCount: 70,
  coworkerAvgGift: 60000,
  relativeCount: 80,
  relativeAvgGift: 100000,
  parentsGuestCount: 70,
  parentsGuestAvgGift: 100000,
  noShowCount: 0,
  mealTicketLossRate: 0,
};

// ── 리스크 레벨 ─────────────────────────────────────────────────
export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  SAFE: '안정',
  NORMAL: '보통',
  CAUTION: '주의',
  DANGER: '위험',
};

// ── 프리셋 ──────────────────────────────────────────────────────
export const PRESETS: WeddingGiftPreset[] = [
  {
    label: '하객 200명 / 일반형',
    mealCostPerPerson: 50000,
    guaranteedGuests: 200,
    expectedGuests: 180,
    avgGiftAmount: 70000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
  {
    label: '하객 250명 / 일반형',
    mealCostPerPerson: 55000,
    guaranteedGuests: 250,
    expectedGuests: 230,
    avgGiftAmount: 70000,
    venueFee: 1000000,
    decorationFee: 1500000,
    otherFixedCost: 500000,
  },
  {
    label: '하객 300명 / 대형',
    mealCostPerPerson: 55000,
    guaranteedGuests: 300,
    expectedGuests: 280,
    avgGiftAmount: 70000,
    venueFee: 1200000,
    decorationFee: 1800000,
    otherFixedCost: 500000,
  },
  {
    label: '호텔형 / 300명',
    mealCostPerPerson: 110000,
    guaranteedGuests: 300,
    expectedGuests: 280,
    avgGiftAmount: 100000,
    venueFee: 2000000,
    decorationFee: 2000000,
    otherFixedCost: 1000000,
  },
  {
    label: '친구 비중 높은 예식',
    mealCostPerPerson: 50000,
    guaranteedGuests: 250,
    expectedGuests: 220,
    avgGiftAmount: 55000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
  {
    label: '친척 비중 높은 예식',
    mealCostPerPerson: 50000,
    guaranteedGuests: 250,
    expectedGuests: 240,
    avgGiftAmount: 90000,
    venueFee: 800000,
    decorationFee: 1200000,
    otherFixedCost: 500000,
  },
];

// ── 다음 도구 CTA ────────────────────────────────────────────────
export const WGBE_NEXT_TOOL: NextToolCta = {
  href: '/tools/wedding-budget-calculator/',
  eyebrow: '이어서 계산해보세요',
  title: '결혼 예산 계산기',
  desc: '예식비만이 아니라 혼수, 신혼집, 허니문까지 결혼 전체 예산을 항목별로 정리하고 감당 가능한 규모를 확인해보세요.',
  badges: ['결혼 전체 예산', '항목별 정리'],
  cta: '결혼 예산 계산기 바로가기',
  sub: [
    {
      href: '/tools/salary/',
      title: '연봉 실수령 계산기',
      desc: '결혼 예산이 우리 소득 기준으로 감당 가능한지 먼저 확인해보세요.',
      badges: ['연봉', '실수령'],
    },
    {
      href: '/tools/birth-support-total/',
      title: '출산~2세 지원금 계산기',
      desc: '결혼 이후 출산·육아 비용과 정부 지원금 흐름을 미리 파악해보세요.',
      badges: ['출산', '육아 지원'],
    },
    {
      href: '/tools/household-income/',
      title: '가구 소득 계산기',
      desc: '맞벌이 가구 소득 기준으로 결혼 준비 예산 규모를 설계할 수 있습니다.',
      badges: ['가구 소득', '맞벌이'],
    },
  ],
};

// ── 외부 참고 링크 ────────────────────────────────────────────────
export const WGBE_EXTERNAL_LINKS: ExternalLink[] = [
  {
    title: '한국소비자원 — 예식서비스 소비자 피해 주의보',
    desc: '보증인원·식대 계약 조건, 예식 취소 시 환불 기준 등 소비자 권리 공식 안내',
    source: '한국소비자원',
    href: 'https://www.kca.go.kr/',
  },
  {
    title: '공정거래위원회 — 예식서비스 표준약관',
    desc: '예식장 계약 시 적용되는 표준약관 원문 확인 (보증인원, 위약금 기준 포함)',
    source: '공정거래위원회',
    href: 'https://www.ftc.go.kr/',
  },
  {
    title: '한국소비자원 — 결혼 준비 비용 실태 조사',
    desc: '국내 평균 예식 비용, 식대 수준, 축의금 실태 참고 데이터',
    source: '한국소비자원',
    href: 'https://www.kca.go.kr/',
  },
];

// ── 제휴 상품 ────────────────────────────────────────────────────
export const WGBE_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    tag: '웨딩 소품',
    title: '파티앤온 프로포즈 풍선 세트',
    desc: '셀프 결혼 준비에 어울리는 프로포즈·파티 풍선 세트. 답례 소품으로도 활용 가능',
    cta: '쿠팡에서 보기 →',
    href: 'https://link.coupang.com/a/ekNiJ1',
  },
  {
    tag: '결혼 답례품',
    title: '감사모아 비타민 답례품',
    desc: '결혼식·돌잔치·조문 등 다목적 답례품. 감사카드·쇼핑백 포함, 10개입 오렌지 리본',
    cta: '쿠팡에서 보기 →',
    href: 'https://link.coupang.com/a/ekNlD8',
  },
  {
    tag: '결혼 필독서',
    title: '연애 결혼 준비 필독서',
    desc: '연인·부부 선물로 인기 있는 결혼 준비 도서. 싸움 해결·관계 개선에 도움이 되는 책',
    cta: '쿠팡에서 보기 →',
    href: 'https://link.coupang.com/a/ekNmFt',
  },
];

// ── FAQ ─────────────────────────────────────────────────────────
export const WGBE_FAQ = [
  {
    question: '축의금으로 결혼식 비용을 다 회수할 수 있나요?',
    answer: '하객 구성, 식대, 보증인원, 예식홀 타입에 따라 크게 달라집니다. 친척·부모님 지인 비중이 높을수록 평균 축의금이 높아지고 손익 방어가 유리합니다.',
  },
  {
    question: '보증인원이 실제 하객보다 더 중요할 수 있나요?',
    answer: '네. 식대 청구 기준이 보증인원일 경우, 실제 하객이 적어도 보증인원 기준으로 비용이 발생합니다. 계약 전 반드시 확인해야 합니다.',
  },
  {
    question: '평균 축의금은 얼마로 잡아야 하나요?',
    answer: '친구(3~5만원), 직장동료(5~7만원), 친척(7~15만원), 부모님 지인(10~20만원)으로 구성 비중에 따라 달라집니다. 상세 모드에서 그룹별로 나눠 입력하면 더 현실적인 계산이 가능합니다.',
  },
  {
    question: '노쇼(불참)는 얼마나 반영해야 하나요?',
    answer: '통상 예상 하객의 5~10%가 참석하지 않는 경우가 많습니다. 상세 모드에서 노쇼 인원을 직접 입력해 반영할 수 있습니다.',
  },
  {
    question: '결혼식 손익만으로 예식장을 결정해도 되나요?',
    answer: '손익은 예산 구조를 이해하는 데 도움이 되지만, 날짜·위치·분위기 등 다양한 조건을 함께 고려해야 합니다. 이 계산기는 비용 구조 파악을 위한 참고 도구입니다.',
  },
];
