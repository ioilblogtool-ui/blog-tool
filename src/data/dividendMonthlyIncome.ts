export type DividendCalculationMode = 'principal' | 'targetIncome';
export type DividendFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual';
export type RiskTone = 'good' | 'neutral' | 'caution' | 'danger';

export interface DividendMonthlyIncomeInput {
  mode: DividendCalculationMode;
  principal: number;
  targetMonthlyIncome: number;
  annualDividendYield: number;
  taxRate: number;
  frequency: DividendFrequency;
  reinvestEnabled: boolean;
  monthlyContribution: number;
  dividendGrowthRate: number;
  priceGrowthRate: number;
  simulationYears: number;
}

export const DEFAULT_DIVIDEND_INPUT: DividendMonthlyIncomeInput = {
  mode: 'principal',
  principal: 50_000_000,
  targetMonthlyIncome: 500_000,
  annualDividendYield: 5,
  taxRate: 15.4,
  frequency: 'monthly',
  reinvestEnabled: true,
  monthlyContribution: 0,
  dividendGrowthRate: 0,
  priceGrowthRate: 0,
  simulationYears: 20,
};

export interface DividendPreset {
  id: string;
  label: string;
  summary: string;
  input: Partial<DividendMonthlyIncomeInput>;
}

export const DMI_PRESETS: DividendPreset[] = [
  {
    id: 'starter',
    label: '처음 시작하는 배당 투자자',
    summary: '원금 1,000만 원 · 수익률 4%',
    input: { mode: 'principal', principal: 10_000_000, annualDividendYield: 4 },
  },
  {
    id: 'target-100k',
    label: '월 10만 원 만들기',
    summary: '목표 월 10만 원 · 수익률 5%',
    input: { mode: 'targetIncome', targetMonthlyIncome: 100_000, annualDividendYield: 5 },
  },
  {
    id: 'target-500k',
    label: '월 50만 원 만들기',
    summary: '목표 월 50만 원 · 수익률 5%',
    input: { mode: 'targetIncome', targetMonthlyIncome: 500_000, annualDividendYield: 5 },
  },
  {
    id: 'high-yield',
    label: '고배당 ETF 시나리오',
    summary: '원금 5,000만 원 · 수익률 7%',
    input: { mode: 'principal', principal: 50_000_000, annualDividendYield: 7 },
  },
  {
    id: 'retirement',
    label: '은퇴 현금흐름 시나리오',
    summary: '원금 3억 원 · 수익률 4.5%',
    input: { mode: 'principal', principal: 300_000_000, annualDividendYield: 4.5 },
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const DMI_FAQ: FaqItem[] = [
  {
    question: '배당주로 월 50만 원을 받으려면 얼마가 필요한가요?',
    answer: '배당수익률 5%, 세율 15.4% 기준으로 약 1억 4,200만 원이 필요합니다. 실제 배당수익률과 세율은 종목·계좌 유형에 따라 달라지므로 이 계산기에서 수익률을 바꿔가며 확인해보세요.',
  },
  {
    question: '배당소득세 15.4%는 자동으로 반영되나요?',
    answer: '기본값으로 15.4%가 설정되어 있습니다. 금융소득 종합과세 대상(연 2,000만 원 초과)이거나 ISA·연금계좌 등 비과세·분리과세 계좌를 사용하는 경우 세율을 직접 수정하세요.',
  },
  {
    question: '월배당 ETF가 분기배당 주식보다 유리한가요?',
    answer: '지급 주기가 짧을수록 배당 재투자 효과가 커질 수 있습니다. 다만 분배율과 총수익률이 동일하다면 지급 주기 차이보다 운용보수와 ETF 구조가 더 중요합니다.',
  },
  {
    question: '배당 재투자 결과는 실제 수익을 보장하나요?',
    answer: '보장하지 않습니다. 배당수익률, 주가 성장률, 배당 성장률은 모두 추정값이며 실제 값은 종목과 시장 상황에 따라 크게 달라질 수 있습니다. 결과는 참고용 추정치로만 활용하세요.',
  },
  {
    question: '미국 배당주는 어떻게 계산하나요?',
    answer: '미국 주식 배당소득의 원천징수세율은 기본 15%이며, 국내 종합과세 대상이면 추가 세금이 발생할 수 있습니다. 미국 배당주 투자 시 세율을 15%로 설정해 참고하세요. 환율 변동도 실수령액에 영향을 줍니다.',
  },
];

export const DMI_RELATED_LINKS = [
  { label: '월배당 ETF 실수익 완전 비교 2026', href: '/reports/monthly-dividend-etf-2026/' },
  { label: '주식 손익분기점 계산기', href: '/tools/stock-breakeven-calculator/' },
  { label: '미국 주식 환차익 계산기', href: '/tools/us-stock-exchange-profit-calculator/' },
  { label: 'DCA 투자 계산기', href: '/tools/dca-investment-calculator/' },
];
