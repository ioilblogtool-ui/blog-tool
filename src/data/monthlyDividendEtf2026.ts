export type EtfCategory = 'dividend-growth' | 'covered-call' | 'bond-income' | 'reit-income' | 'mixed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface MonthlyDividendEtf {
  id: string;
  name: string;
  ticker: string;
  manager: string;
  category: EtfCategory;
  underlyingIndex: string;
  annualDistributionRate: number;
  totalExpenseRatio: number;
  oneYearReturn: number | null;
  threeYearReturn: number | null;
  latestPrice: number | null;
  distributionBaseDate: string;
  dataSourceLabel: string;
  riskLevel: RiskLevel;
  riskBadges: string[];
  summary: string;
}

export interface EtfPortfolioExample {
  id: string;
  label: string;
  investorType: string;
  allocationNote: string;
  description: string;
  caution: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ── 기준 설정 ─────────────────────────────────────────────────────────────────
export const MONTHLY_DIVIDEND_ETF_DATA_UPDATED_AT = '2026-05-22';
export const DEFAULT_INVESTMENT_AMOUNT = 10_000_000;
export const DEFAULT_DIVIDEND_TAX_RATE = 15.4;

export const CATEGORY_LABELS: Record<EtfCategory, string> = {
  'dividend-growth': '배당성장형',
  'covered-call': '커버드콜형',
  'bond-income': '채권형',
  'reit-income': '리츠/인컴형',
  'mixed': '혼합형',
};

// ── ETF 데이터 ────────────────────────────────────────────────────────────────
// 분배율·수익률은 공시 기준 추정치이며 기준일에 따라 달라집니다.
// 구현 직전 최신 공시 데이터로 교체 후 배포 권장.
export const monthlyDividendEtfs: MonthlyDividendEtf[] = [
  {
    id: 'tiger-us-dividend-dowjones',
    name: 'TIGER 미국배당다우존스',
    ticker: '458730',
    manager: '미래에셋자산운용',
    category: 'dividend-growth',
    underlyingIndex: 'Dow Jones U.S. Dividend 100',
    annualDistributionRate: 2.5,
    totalExpenseRatio: 0.05,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '미래에셋자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['배당성장형', '환율 영향'],
    summary: '미국 배당성장주 100종목에 분산 투자. 낮은 보수와 안정적 배당 성장을 동시에 추구합니다.',
  },
  {
    id: 'ace-us-dividend-dowjones',
    name: 'ACE 미국배당다우존스',
    ticker: '394660',
    manager: 'KB자산운용',
    category: 'dividend-growth',
    underlyingIndex: 'Dow Jones U.S. Dividend 100',
    annualDistributionRate: 2.5,
    totalExpenseRatio: 0.05,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: 'KB자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['배당성장형', '환율 영향'],
    summary: 'TIGER와 같은 지수를 추종하는 KB자산운용의 월배당 ETF. 운용사 분산 효과가 있습니다.',
  },
  {
    id: 'sol-us-dividend-dowjones',
    name: 'SOL 미국배당다우존스',
    ticker: '446720',
    manager: '신한자산운용',
    category: 'dividend-growth',
    underlyingIndex: 'Dow Jones U.S. Dividend 100',
    annualDistributionRate: 2.5,
    totalExpenseRatio: 0.09,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '신한자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['배당성장형', '환율 영향'],
    summary: '신한자산운용의 동일 지수 추종 상품. 보수가 TIGER·ACE 대비 소폭 높습니다.',
  },
  {
    id: 'tiger-us-dividend-7pct-premium',
    name: 'TIGER 미국배당+7%프리미엄다우존스',
    ticker: '483100',
    manager: '미래에셋자산운용',
    category: 'covered-call',
    underlyingIndex: 'Dow Jones U.S. Dividend 100 + 커버드콜',
    annualDistributionRate: 9.0,
    totalExpenseRatio: 0.38,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '미래에셋자산운용 공시 확인 필요',
    riskLevel: 'high',
    riskBadges: ['커버드콜', '고분배', '상승 제한'],
    summary: '배당성장 포트폴리오에 커버드콜 옵션 프리미엄을 더해 연 7%+ 분배를 목표합니다. 상승장에서 수익 일부가 제한될 수 있습니다.',
  },
  {
    id: 'kodex-us-dividend-premium',
    name: 'KODEX 미국배당프리미엄액티브',
    ticker: '460560',
    manager: '삼성자산운용',
    category: 'covered-call',
    underlyingIndex: '미국 고배당주 + 커버드콜 액티브',
    annualDistributionRate: 8.0,
    totalExpenseRatio: 0.36,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '삼성자산운용 공시 확인 필요',
    riskLevel: 'high',
    riskBadges: ['커버드콜', '액티브', '고분배'],
    summary: '삼성자산운용의 액티브 운용 커버드콜 ETF. 운용역이 옵션 비율을 유연하게 조정합니다.',
  },
  {
    id: 'rise-us-dividend-coveredcall',
    name: 'RISE 미국배당커버드콜',
    ticker: '476700',
    manager: 'KB자산운용',
    category: 'covered-call',
    underlyingIndex: '미국 배당주 + 커버드콜',
    annualDistributionRate: 7.5,
    totalExpenseRatio: 0.35,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: 'KB자산운용 공시 확인 필요',
    riskLevel: 'high',
    riskBadges: ['커버드콜', '고분배'],
    summary: 'KB의 월배당 커버드콜 ETF. 상승장 수익 일부를 제한하는 대신 안정적 분배를 지향합니다.',
  },
  {
    id: 'tiger-us-bond30-coveredcall',
    name: 'TIGER 미국30년국채커버드콜(합성H)',
    ticker: '476550',
    manager: '미래에셋자산운용',
    category: 'bond-income',
    underlyingIndex: '미국 30년 국채 + 커버드콜 (환헤지)',
    annualDistributionRate: 6.0,
    totalExpenseRatio: 0.25,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '미래에셋자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['채권', '커버드콜', '환헤지'],
    summary: '미국 장기 국채에 커버드콜을 결합한 환헤지 상품. 금리 변동 리스크가 있습니다.',
  },
  {
    id: 'ace-us-bond30-active',
    name: 'ACE 미국채30년액티브(H)',
    ticker: '453850',
    manager: 'KB자산운용',
    category: 'bond-income',
    underlyingIndex: '미국 30년 국채 액티브 (환헤지)',
    annualDistributionRate: 4.0,
    totalExpenseRatio: 0.19,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: 'KB자산운용 공시 확인 필요',
    riskLevel: 'low',
    riskBadges: ['채권', '환헤지', '안정형'],
    summary: '미국 장기국채 액티브 펀드. 분배율은 낮지만 상대적으로 안정적인 채권 인컴을 추구합니다.',
  },
  {
    id: 'tiger-reits-infra',
    name: 'TIGER 리츠부동산인프라',
    ticker: '329200',
    manager: '미래에셋자산운용',
    category: 'reit-income',
    underlyingIndex: '국내 리츠 및 인프라',
    annualDistributionRate: 4.5,
    totalExpenseRatio: 0.29,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '미래에셋자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['리츠', '인프라', '부동산'],
    summary: '국내 상장 리츠와 인프라에 투자하는 월배당 ETF. 부동산 경기에 영향을 받습니다.',
  },
  {
    id: 'kodex-us-dividend-dowjones',
    name: 'KODEX 미국배당다우존스',
    ticker: '487230',
    manager: '삼성자산운용',
    category: 'dividend-growth',
    underlyingIndex: 'Dow Jones U.S. Dividend 100',
    annualDistributionRate: 2.3,
    totalExpenseRatio: 0.09,
    oneYearReturn: null,
    threeYearReturn: null,
    latestPrice: null,
    distributionBaseDate: '2026년 기준 최신 확인 필요',
    dataSourceLabel: '삼성자산운용 공시 확인 필요',
    riskLevel: 'medium',
    riskBadges: ['배당성장형', '환율 영향'],
    summary: '삼성자산운용의 동일 지수 추종 상품. 상장 시기가 비교적 늦어 3년 수익률 데이터가 제한적입니다.',
  },
];

// ── 요약 KPI ──────────────────────────────────────────────────────────────────
export const MDE_SUMMARY_CARDS = [
  { label: '비교 ETF', value: '10종', sub: '국내 상장 월배당 ETF' },
  { label: '기준 투자금', value: '1,000만 원', sub: '변경 가능' },
  { label: '기본 세율', value: '15.4%', sub: '배당소득세 기준' },
  { label: '핵심 지표', value: '세후 월 수령액', sub: '분배금 감소 시나리오 포함' },
];

// ── 포트폴리오 예시 ───────────────────────────────────────────────────────────
export const MDE_PORTFOLIO_EXAMPLES: EtfPortfolioExample[] = [
  {
    id: 'stable',
    label: '안정형',
    investorType: '장기 배당성장 투자자',
    allocationNote: '배당성장형 70% + 채권형 30%',
    description: '분배율보다 배당 성장과 원금 보전을 우선합니다. 분배율이 낮은 대신 장기 재투자 복리 효과를 기대합니다.',
    caution: '단기 현금흐름이 낮아 은퇴 직후보다는 10년 이상 축적 단계에 적합합니다.',
  },
  {
    id: 'balanced',
    label: '균형형',
    investorType: '소득과 성장을 함께 원하는 투자자',
    allocationNote: '배당성장형 50% + 커버드콜형 30% + 채권형 20%',
    description: '적절한 현금흐름과 자산 성장을 동시에 추구합니다. 분배율 5~7% 수준을 기대할 수 있습니다.',
    caution: '커버드콜 비중이 있어 상승장에서 수익 일부가 제한될 수 있습니다.',
  },
  {
    id: 'high-income',
    label: '고분배형',
    investorType: '매달 높은 현금흐름이 필요한 투자자',
    allocationNote: '커버드콜형 70% + 배당성장형 20% + 리츠/채권 10%',
    description: '분배율 8~10% 수준의 높은 현금흐름을 추구합니다. 분배금 삭감 또는 원금 손실 위험을 함께 고려해야 합니다.',
    caution: '고분배율은 ETF 가격 하락 또는 배당 삭감으로 이어질 수 있습니다. 분배금 감소 시나리오를 반드시 확인하세요.',
  },
  {
    id: 'retirement',
    label: '은퇴 현금흐름형',
    investorType: '은퇴 후 생활비 충당이 목적인 투자자',
    allocationNote: '채권형 40% + 리츠/인컴형 30% + 배당성장형 30%',
    description: '월 고정 수입 대체를 목표로 변동성 낮은 채권·리츠 비중을 높입니다. 안정성 우선 구성입니다.',
    caution: '금리·부동산 경기 변동에 따라 분배금이 줄어들 수 있습니다. 6개월치 생활비 현금 여유를 확보하는 것이 좋습니다.',
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
export const MDE_FAQ: FaqItem[] = [
  {
    q: '월배당 ETF는 매달 확정된 금액을 주나요?',
    a: '아닙니다. 분배금은 ETF 운용 성과와 보유 종목의 배당에 따라 매월 달라집니다. 특히 커버드콜형은 옵션 프리미엄 수입에 따라 변동폭이 클 수 있습니다.',
  },
  {
    q: '분배율이 높은 ETF가 가장 좋은 ETF인가요?',
    a: '그렇지 않습니다. 높은 분배율은 ETF 가격 하락이나 원금 소진을 의미할 수 있습니다. 총수익률(가격 변동 + 분배금)과 운용보수를 함께 확인해야 합니다.',
  },
  {
    q: '국내 상장 월배당 ETF와 미국 ETF 직접 투자는 무엇이 다른가요?',
    a: '국내 상장 ETF는 배당소득세 15.4%가 원천징수됩니다. 미국 직접 투자 시 현지 원천징수(15%) 외 금융소득 종합과세 대상이면 추가 세금이 발생할 수 있습니다. 계좌 유형(일반·ISA·연금계좌)에 따라 세후 수령액이 크게 달라집니다.',
  },
  {
    q: '커버드콜 ETF는 왜 분배율이 높나요?',
    a: '보유 주식에 대해 콜옵션을 매도해 받는 프리미엄을 분배 재원으로 활용하기 때문입니다. 주가가 크게 오르면 옵션 행사로 인해 수익의 일부가 제한됩니다. 하락장에서는 프리미엄 수입이 쿠션이 될 수 있지만 원금 손실을 막아주지는 않습니다.',
  },
  {
    q: '월배당 ETF로 은퇴 생활비를 만들 수 있나요?',
    a: '이론적으로는 가능합니다. 그러나 분배금은 보장되지 않으며, 분배금 수령 중에도 ETF 가격이 하락하면 실질 자산이 줄어들 수 있습니다. 생활비 전액을 월배당에 의존하기보다 분산 설계와 일정 수준의 현금 여유를 함께 유지하는 것을 권장합니다.',
  },
];

// ── 관련 링크 ─────────────────────────────────────────────────────────────────
export const MDE_RELATED_LINKS = [
  { label: '배당주 월급 계산기', href: '/tools/dividend-monthly-income/' },
  { label: '주식 손익분기점 계산기', href: '/tools/stock-breakeven-calculator/' },
  { label: '미국 주식 환차익 계산기', href: '/tools/us-stock-exchange-profit-calculator/' },
  { label: 'DCA 투자 계산기', href: '/tools/dca-investment-calculator/' },
];
