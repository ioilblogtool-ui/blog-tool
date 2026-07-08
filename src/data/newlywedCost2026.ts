// ── 섹션 01: 신혼집 현황 ──
export interface HousingSnapshot {
  region: string;
  avgJeonseDeposit: number;
  avgMonthlyRent: number;
  avgMonthlyDeposit: number;
  selfEquityRate: number;
  housingTypeRatio: { jeonse: number; wolse: number; buy: number; parents: number };
  note: string;
}

export const HOUSING_SNAPSHOTS: HousingSnapshot[] = [
  {
    region: '수도권',
    avgJeonseDeposit: 280000000,
    avgMonthlyRent: 900000,
    avgMonthlyDeposit: 50000000,
    selfEquityRate: 0.45,
    housingTypeRatio: { jeonse: 0.52, wolse: 0.28, buy: 0.12, parents: 0.08 },
    note: '국토부 주거실태조사·KB부동산 2025 편집 추정',
  },
  {
    region: '5대광역시',
    avgJeonseDeposit: 155000000,
    avgMonthlyRent: 620000,
    avgMonthlyDeposit: 30000000,
    selfEquityRate: 0.5,
    housingTypeRatio: { jeonse: 0.48, wolse: 0.32, buy: 0.14, parents: 0.06 },
    note: '국토부 주거실태조사·KB부동산 2025 편집 추정',
  },
  {
    region: '기타 지방',
    avgJeonseDeposit: 95000000,
    avgMonthlyRent: 400000,
    avgMonthlyDeposit: 20000000,
    selfEquityRate: 0.55,
    housingTypeRatio: { jeonse: 0.42, wolse: 0.30, buy: 0.20, parents: 0.08 },
    note: '국토부 주거실태조사·KB부동산 2025 편집 추정',
  },
];

// ── 섹션 02: 지역별 전세 보증금 ──
export const REGION_JEONSE_DATA = [
  { region: '서울', avgDeposit: 380000000, color: '#1a56db' },
  { region: '경기', avgDeposit: 240000000, color: '#1a56db' },
  { region: '인천', avgDeposit: 200000000, color: '#1a56db' },
  { region: '부산', avgDeposit: 160000000, color: '#6b7280' },
  { region: '대구', avgDeposit: 130000000, color: '#6b7280' },
  { region: '광주', avgDeposit: 110000000, color: '#6b7280' },
  { region: '기타', avgDeposit: 95000000, color: '#6b7280' },
];

// ── 섹션 03: 혼수·가전·가구 ──
export interface HonsuItem {
  category: string;
  minCost: number;
  avgCost: number;
  premiumCost: number;
  channel: string;
}

export const HONSU_ITEMS: HonsuItem[] = [
  { category: '냉장고', minCost: 800000, avgCost: 1500000, premiumCost: 3000000, channel: '가전양판점 기준' },
  { category: '세탁기', minCost: 400000, avgCost: 900000, premiumCost: 2000000, channel: '가전양판점 기준' },
  { category: 'TV', minCost: 300000, avgCost: 700000, premiumCost: 2500000, channel: '가전양판점 기준' },
  { category: '에어컨 (벽걸이)', minCost: 400000, avgCost: 700000, premiumCost: 1500000, channel: '가전양판점 기준' },
  { category: '침대 (퀸)', minCost: 300000, avgCost: 600000, premiumCost: 2000000, channel: '가구 양판점 기준' },
  { category: '소파', minCost: 200000, avgCost: 500000, premiumCost: 1500000, channel: '가구 양판점 기준' },
  { category: '식탁 + 의자', minCost: 150000, avgCost: 350000, premiumCost: 1000000, channel: '가구 양판점 기준' },
  { category: '스탠드 에어컨', minCost: 700000, avgCost: 1200000, premiumCost: 3000000, channel: '가전양판점 기준' },
];

export const HONSU_TIERS = [
  { id: 'minimal',  label: '알뜰형', budget: 10000000, desc: '중고·렌탈 적극 활용, 필수품 위주' },
  { id: 'standard', label: '표준형', budget: 20000000, desc: '일반 가전양판점 기준 표준 구성' },
  { id: 'premium',  label: '프리미엄', budget: 40000000, desc: '브랜드 프리미엄·고급 가구 포함' },
];

// ── 섹션 04: 신혼부부 특례대출 ──
export const SPECIAL_LOANS = [
  {
    name: '신혼부부 구입자금 특례대출',
    target: '결혼 7년 이내 신혼부부·예비부부',
    maxAmount: 500000000,
    rateMin: 0.0185,
    rateMax: 0.033,
    priceLimit: 900000000,
    conditions: ['부부합산 연소득 1.3억 이하', '순자산 5.06억 이하', '무주택자 또는 1주택 처분 조건'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026.01',
  },
  {
    name: '버팀목 전세자금대출 (신혼부부 우대)',
    target: '결혼 7년 이내 신혼부부',
    maxAmount: 300000000,
    rateMin: 0.02,
    rateMax: 0.035,
    priceLimit: 500000000,
    conditions: ['부부합산 연소득 7,500만 이하', '순자산 3.61억 이하', '무주택 세대주'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026.01',
  },
  {
    name: '생애최초 주택담보대출',
    target: '생애 최초 주택 구입자',
    maxAmount: 500000000,
    rateMin: 0.023,
    rateMax: 0.035,
    priceLimit: 900000000,
    conditions: ['부부합산 연소득 2억 이하', '주택 보유 이력 없음', 'LTV 최대 80%'],
    sourceUrl: 'https://www.hf.go.kr',
    asOf: '2026.01',
  },
];

// ── 섹션 05: 가계부 시뮬레이션 ──
export const HOUSEHOLD_BUDGETS = [
  {
    id: 'dual-7000',
    label: '맞벌이 합산 7천만',
    monthlyIncome: 4583333,
    loanPayment: 1200000,
    insurance: 300000,
    communication: 120000,
    managementFee: 150000,
    food: 400000,
    transport: 200000,
    dining: 300000,
    leisure: 200000,
    get monthlySavings() {
      return this.monthlyIncome - this.loanPayment - this.insurance - this.communication
        - this.managementFee - this.food - this.transport - this.dining - this.leisure;
    },
  },
  {
    id: 'dual-10000',
    label: '맞벌이 합산 1억',
    monthlyIncome: 6666667,
    loanPayment: 1500000,
    insurance: 400000,
    communication: 130000,
    managementFee: 180000,
    food: 500000,
    transport: 250000,
    dining: 400000,
    leisure: 300000,
    get monthlySavings() {
      return this.monthlyIncome - this.loanPayment - this.insurance - this.communication
        - this.managementFee - this.food - this.transport - this.dining - this.leisure;
    },
  },
  {
    id: 'single-4000',
    label: '외벌이 연봉 4천만',
    monthlyIncome: 2916667,
    loanPayment: 900000,
    insurance: 250000,
    communication: 100000,
    managementFee: 130000,
    food: 350000,
    transport: 150000,
    dining: 200000,
    leisure: 150000,
    get monthlySavings() {
      return this.monthlyIncome - this.loanPayment - this.insurance - this.communication
        - this.managementFee - this.food - this.transport - this.dining - this.leisure;
    },
  },
];

// ── 섹션 06: 전세 보증금 마련 기간 ──
export const SAVINGS_SCENARIOS = [
  { label: '월 저축 100만', monthly: 1000000 },
  { label: '월 저축 150만', monthly: 1500000 },
  { label: '월 저축 200만', monthly: 2000000 },
  { label: '월 저축 250만', monthly: 2500000 },
];
export const DEPOSIT_TARGETS = [100000000, 150000000, 200000000, 300000000];

// ── 섹션 07: 지역별 전세가율 ──
export const JEONSE_RATE_DATA = [
  { region: '서울 강남', jeonseRate: 0.52, trend: '하락', note: 'KB부동산 2025.12 편집 추정' },
  { region: '서울 노원', jeonseRate: 0.68, trend: '보합', note: 'KB부동산 2025.12 편집 추정' },
  { region: '경기 성남', jeonseRate: 0.65, trend: '보합', note: 'KB부동산 2025.12 편집 추정' },
  { region: '경기 평택', jeonseRate: 0.72, trend: '상승', note: 'KB부동산 2025.12 편집 추정' },
  { region: '부산 해운대', jeonseRate: 0.69, trend: '보합', note: 'KB부동산 2025.12 편집 추정' },
  { region: '대구 수성', jeonseRate: 0.66, trend: '하락', note: 'KB부동산 2025.12 편집 추정' },
];

// ── 섹션 09: 자산 수준별 전략 ──
export const ASSET_STRATEGIES = [
  {
    id: 'under1',
    label: '자기자본 1억 미만',
    strategy: '전세 대출 최대 활용 + 청약 납입 병행',
    tips: ['버팀목 전세대출 신혼부부 우대 활용', '월 저축 목표 설정 (소득 20~30%)', '청약통장 가점 점검 및 납입 유지'],
    borderColor: '#6b7280',
  },
  {
    id: 'mid',
    label: '자기자본 1~3억',
    strategy: '전세 vs 소형 매매 손익 비교 후 결정',
    tips: ['신혼부부 특례대출 활용 시뮬레이션', '지방·외곽 소형 매매 검토', '전세가율 높은 지역 리스크 점검'],
    borderColor: '#1a56db',
  },
  {
    id: 'over3',
    label: '자기자본 3억 이상',
    strategy: '매매 진입 적극 검토 + 대출 최적 구조 설계',
    tips: ['생애최초 취득세 감면 확인', '특례대출 vs 일반 주담대 금리 비교', '재무설계사 상담으로 대출 구조 최적화'],
    borderColor: '#0f6e56',
  },
];

// ── 섹션 10: 중고 활용 가이드 ──
export const SECOND_HAND_GUIDE = [
  { item: '소파', recommend: true,  reason: '외관 상태 직접 확인 가능, 절약 폭 큼' },
  { item: '식탁·의자', recommend: true,  reason: '당근마켓 시세 풍부, 절약 폭 큼' },
  { item: 'TV', recommend: true,  reason: '모델·연식 확인 쉬움, 절약 폭 중간' },
  { item: '냉장고', recommend: false, reason: '위생 우려, AS 보장 없음' },
  { item: '세탁기', recommend: false, reason: '내부 세척 불명확, 고장 리스크' },
  { item: '에어컨', recommend: false, reason: '냉매·필터 상태 확인 어려움' },
];

// ── 섹션 11: 정부 지원금 ──
export const GOV_SUPPORTS = [
  {
    name: '결혼 세액공제',
    target: '2024.1.1~2026.12.31 혼인신고',
    amount: '1인당 50만원 (부부 합산 최대 100만원, 생애 1회)',
    timing: '연말정산',
    category: 'national',
    sourceUrl: 'https://www.nts.go.kr',
  },
  {
    name: '신혼부부 생애최초 취득세 감면',
    target: '생애최초 주택 구입 신혼부부',
    amount: '최대 200만원',
    timing: '취득일 60일 이내 신청',
    category: 'national',
    sourceUrl: 'https://www.mois.go.kr',
  },
  {
    name: '부모급여',
    target: '0~1세 아동 부모',
    amount: '월 100만원 (0세) / 50만원 (1세)',
    timing: '출생 후 신청',
    category: 'national',
    sourceUrl: 'https://www.bokjiro.go.kr',
  },
  {
    name: '첫만남이용권',
    target: '신생아 출생',
    amount: '첫째 200만원 / 둘째 이상 300만원 (바우처)',
    timing: '출생신고 후',
    category: 'national',
    sourceUrl: 'https://www.bokjiro.go.kr',
  },
  {
    name: '아동수당',
    target: '만 8세 미만 아동',
    amount: '월 10만원',
    timing: '출생 후 신청',
    category: 'national',
    sourceUrl: 'https://www.bokjiro.go.kr',
  },
];

// ── 섹션 12: 2016 vs 2026 비교 ──
export const COST_COMPARISON_2016_2026 = [
  {
    item: '수도권 평균 전세 보증금',
    val2016: 170000000,
    val2026: 280000000,
    unit: '억원',
    sourceNote: '국토부 실거래가 편집 추정',
  },
  {
    item: '혼수·가전 평균',
    val2016: 12000000,
    val2026: 18000000,
    unit: '만원',
    sourceNote: '소비자물가지수·업계 자료 편집 추정',
  },
  {
    item: '신혼 1년차 월 고정비',
    val2016: 1500000,
    val2026: 2300000,
    unit: '만원',
    sourceNote: '가계동향조사 편집 추정',
  },
  {
    item: '부부 합산 평균 연봉',
    val2016: 60000000,
    val2026: 82000000,
    unit: '만원',
    sourceNote: '고용노동부 임금실태조사 편집 추정',
  },
];

// ── 섹션 13: 전문가 코멘트 ──
export const EXPERT_TIPS = [
  {
    role: '재무설계사 관점',
    tip: '신혼 초 가장 중요한 것은 비상 예비자금 3~6개월치 확보입니다. 내집마련보다 먼저 안전망을 만드세요.',
    badge: '참고',
  },
  {
    role: '부동산 전문가 관점',
    tip: '전세가율 70% 이상 지역은 보증 사고 리스크가 높습니다. 전세보증보험(HUG) 가입 여부를 반드시 확인하세요.',
    badge: '참고',
  },
  {
    role: '세무·법률 관점',
    tip: '부모님 지원을 받을 경우 10년간 5천만원(직계존속) 증여세 비과세 한도를 활용하면 절세가 가능합니다.',
    badge: '참고',
  },
];

// ── FAQ ──
export const NWC_FAQ = [
  {
    question: '2026년 수도권 신혼집 평균 전세 보증금은 얼마인가요?',
    answer: '국토부 실거래가·KB부동산 데이터 편집 기준으로 수도권 신혼 평균 전세 보증금은 약 2.5~3억 원 수준으로 추정됩니다. 서울은 3.5~4억 원, 경기·인천은 2~2.5억 원대로 격차가 큽니다. 실제 시세는 지역·면적·시기에 따라 달라지므로 KB부동산이나 국토부 실거래가를 함께 확인하세요.',
  },
  {
    question: '신혼부부 특례대출과 일반 주담대는 금리가 얼마나 차이 나나요?',
    answer: '2026년 기준 신혼부부 구입자금 특례대출은 연 1.85~3.3%, 시중 일반 주담대는 연 3.5~5% 수준입니다. 대출 금액 4억 원 기준 금리 차이 1%p만으로도 연 400만 원, 5년 누적 2,000만 원 이상 절감 효과가 날 수 있습니다. 조건은 자주 바뀌므로 신청 전 주택금융공사 공식 사이트를 확인하세요.',
  },
  {
    question: '혼수·가전 비용은 평균 얼마인가요?',
    answer: '결혼정보업체·소비자 설문 기준으로 신혼 혼수·가전·가구 평균 지출은 약 1,500~2,500만 원 수준으로 추정됩니다. 가전 브랜드와 가구 품질에 따라 500만 원대부터 5,000만 원 이상까지 편차가 큽니다.',
  },
  {
    question: '신혼부부가 받을 수 있는 정부 지원금을 모두 합치면 얼마인가요?',
    answer: '결혼 세액공제(부부 합산 최대 100만원), 취득세 감면(최대 200만원), 출산 후 첫만남이용권(첫째 200만원)+부모급여(0세 기준 연 1,200만원)를 합산하면 첫 2년간 약 1,700만원 이상 지원을 받을 수 있습니다. 둘째 이상이면 첫만남이용권이 300만원으로 늘어나 지원액이 더 커집니다.',
  },
  {
    question: '전세 보증금 마련까지 보통 몇 년 걸리나요?',
    answer: '부부 합산 월 저축액 150만 원 기준으로 3억 원 마련에 약 17년이 걸립니다. 200만 원이면 12년, 250만 원이면 10년 수준입니다. 전세대출을 활용해 자기자본 목표를 낮추면 기간을 단축할 수 있습니다.',
  },
  {
    question: '전세가율이 높은 지역은 왜 위험한가요?',
    answer: '전세가율이 80% 이상인 지역은 집값이 조금만 하락해도 전세 보증금이 집값보다 커지는 역전세 상황이 발생할 수 있습니다. 전세보증보험(HUG) 가입과 선순위 채권 확인이 필수입니다.',
  },
  {
    question: '부모님 지원을 받을 때 증여세가 걱정됩니다',
    answer: '직계존속(부모)에게 받는 증여는 10년간 5,000만 원까지 비과세입니다. 부부가 각자 부모에게 받으면 합산 최대 1억 원까지 비과세 한도가 생깁니다. 혼인 공제로 1억 원 추가 비과세(2023년 개정)도 적용됩니다.',
  },
  {
    question: '10년 전(2016)보다 신혼 비용이 얼마나 올랐나요?',
    answer: '수도권 평균 전세 보증금은 2016년 약 1.7억 원에서 2026년 약 2.8억 원으로 약 65% 상승 추정됩니다. 같은 기간 부부 합산 평균 연봉은 6천만 원에서 8,200만 원으로 약 37% 오르는 데 그쳐, 주거 비용 부담이 커졌습니다.',
  },
];

export const NWC_RELATED_LINKS = [
  { href: '/tools/newlywed-rent-vs-buy/', label: '신혼집 전세 vs 매매 손익 계산기' },
  { href: '/tools/home-purchase-fund/', label: '내집마련 자금 계산기' },
  { href: '/tools/wedding-budget-calculator/', label: '결혼 예산 계산기' },
  { href: '/tools/apt-cheonyak-gajum-calculator/', label: '아파트 청약 가점 계산기' },
  { href: '/reports/wedding-cost-2016-vs-2026/', label: '웨딩 비용 10년 변화 리포트' },
];

export const NWC_SOURCE_LINKS = [
  {
    source: '주택금융공사',
    title: '신혼부부 구입자금 특례대출 안내',
    href: 'https://www.hf.go.kr',
    desc: '대출 금리·한도·자격 조건 공식 안내',
  },
  {
    source: '국토교통부',
    title: '실거래가 공개 시스템',
    href: 'https://rt.molit.go.kr',
    desc: '아파트·빌라·오피스텔 실거래 시세 확인',
  },
  {
    source: '복지로',
    title: '신혼부부 정부 지원금 통합 안내',
    href: 'https://www.bokjiro.go.kr',
    desc: '부모급여·첫만남이용권·아동수당 신청',
  },
];

// ── 포맷 유틸 ──
export function fmtManwon(n: number): string {
  if (Math.abs(n) >= 100000000) return (n / 100000000).toFixed(1) + '억원';
  return Math.round(n / 10000).toLocaleString('ko-KR') + '만원';
}

export function fmtPct(n: number): string {
  return (n * 100).toFixed(0) + '%';
}
