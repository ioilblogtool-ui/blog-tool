export type LoanType = 'equal-payment' | 'equal-principal' | 'bullet';

export interface NrbPreset {
  id: string;
  label: string;
  jeonseDeposit: number;
  jeonseLoan: number;
  jeonseLoanRate: number;
  buyPrice: number;
  buyLoan: number;
  buyLoanRate: number;
  loanType: LoanType;
  livingYears: number;
  housePriceGrowthRate: number;
  depositReturnRate: number;
  isSpecialLoan: boolean;
  specialLoanRate: number;
  includeAcquisitionTax: boolean;
}

export const ACQUISITION_TAX_RATE = {
  under6: 0.011,   // 6억 이하: 취득세 1% + 지방교육세 0.1%
  over9: 0.033,    // 9억 초과: 3% + 0.3%
};
export const REGISTRATION_FEE_RATE = 0.004; // 등기비 추정 0.4%
export const DEFAULT_SPECIAL_LOAN_RATE = 0.027; // 신혼부부 특례 기본 2.7%

export const NRB_PRESETS: NrbPreset[] = [
  {
    id: '수도권-신혼',
    label: '수도권 신혼 표준',
    jeonseDeposit: 300000000,
    jeonseLoan: 150000000,
    jeonseLoanRate: 0.03,
    buyPrice: 500000000,
    buyLoan: 300000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 5,
    housePriceGrowthRate: 0.02,
    depositReturnRate: 0.04,
    isSpecialLoan: false,
    specialLoanRate: 0.027,
    includeAcquisitionTax: true,
  },
  {
    id: '서울-장기',
    label: '서울 내집마련 장기',
    jeonseDeposit: 300000000,
    jeonseLoan: 150000000,
    jeonseLoanRate: 0.03,
    buyPrice: 800000000,
    buyLoan: 500000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 10,
    housePriceGrowthRate: 0.03,
    depositReturnRate: 0.04,
    isSpecialLoan: false,
    specialLoanRate: 0.027,
    includeAcquisitionTax: true,
  },
  {
    id: '지방-소형',
    label: '지방 소형 실속',
    jeonseDeposit: 150000000,
    jeonseLoan: 70000000,
    jeonseLoanRate: 0.03,
    buyPrice: 250000000,
    buyLoan: 150000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 5,
    housePriceGrowthRate: 0.01,
    depositReturnRate: 0.04,
    isSpecialLoan: false,
    specialLoanRate: 0.027,
    includeAcquisitionTax: true,
  },
  {
    id: '특례대출',
    label: '특례대출 최대 활용',
    jeonseDeposit: 200000000,
    jeonseLoan: 100000000,
    jeonseLoanRate: 0.025,
    buyPrice: 500000000,
    buyLoan: 300000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 7,
    housePriceGrowthRate: 0.02,
    depositReturnRate: 0.04,
    isSpecialLoan: true,
    specialLoanRate: 0.027,
    includeAcquisitionTax: true,
  },
];

export const NRB_FAQ = [
  {
    question: '전세 기회비용은 어떻게 계산하나요?',
    answer: '전세 자기자본(보증금 – 대출금)을 보증금 운용 수익률로 곱한 값입니다. 예를 들어 자기자본 1억 5천만 원에 수익률 4%를 적용하면 연 600만 원이 기회비용으로 발생합니다. 이 기회비용은 전세 대출이자와 합산해 전세의 실질 연간 비용을 구성합니다.',
  },
  {
    question: '집값 상승률은 어떻게 입력해야 하나요?',
    answer: '최근 5년(2021~2026) 수도권 아파트 평균 상승률은 연 3~4% 수준이었으나, 이는 과거 데이터이며 미래를 보장하지 않습니다. 보수적 시나리오(1%), 중립(2~3%), 낙관(4~5%) 세 가지를 각각 입력해 결과를 비교해 보는 것을 권장합니다.',
  },
  {
    question: "손익분기 전환 시점이 '전환 없음'으로 나오는 경우는 언제인가요?",
    answer: '집값 상승률이 낮거나 매매 대출 금리가 높아 입력한 거주 기간 안에 매매가 전세보다 유리해지는 시점이 없을 때 표시됩니다. 이 경우 집값 상승률 슬라이더를 올리거나 거주 기간을 늘려 전환 시점을 탐색해 보세요.',
  },
  {
    question: '신혼부부 특례대출이란 무엇인가요?',
    answer: '결혼 7년 이내 신혼부부 또는 예비 신혼부부가 이용할 수 있는 정부 지원 주택담보대출입니다. 2026년 기준 연 1.85~3.3% 금리로, 최대 5억 원(아파트 9억 이하)까지 이용 가능합니다. 자세한 조건은 주택금융공사 홈페이지를 확인하세요.',
  },
  {
    question: '원리금균등과 원금균등 중 어떤 방식이 유리한가요?',
    answer: '원금균등상환은 초기 납입액이 크지만 총이자가 적습니다. 원리금균등상환은 매달 동일한 금액을 납부해 예측 가능성이 높지만 총이자가 다소 많습니다. 초기 여유 자금이 있다면 원금균등이 장기적으로 유리하고, 안정적 월 지출 관리가 우선이라면 원리금균등이 편리합니다.',
  },
  {
    question: '취득세·등기비를 포함해야 더 정확한 계산이 되나요?',
    answer: '매매 초기에 1회성으로 발생하는 비용이므로 포함하면 더 현실적인 비교가 가능합니다. 특히 거주 기간이 짧을수록 1회성 비용의 영향이 크게 나타납니다. 생애최초 취득세 감면을 받는 경우 실제 부담이 줄어드므로, 감면액만큼 입력값을 조정해도 됩니다.',
  },
  {
    question: '전세 사기 리스크는 이 계산기에 반영되나요?',
    answer: '이 계산기는 순수 비용·자산 측면의 시뮬레이션이며, 전세 사기 리스크나 보증 사고 가능성은 반영되지 않습니다. 전세 계약 시 전세보증보험 가입, 선순위 채권 확인, 등기부 열람 등 별도 리스크 관리가 필요합니다.',
  },
  {
    question: '이 계산기 결과만으로 전세·매매를 결정해도 되나요?',
    answer: '이 계산기는 재무적 비용·손익 측면의 참고 시뮬레이션입니다. 실제 결정에는 직장 이동 가능성, 자녀 계획, 가족 상황, 지역 선호, 대출 가능 여부 등 비재무적 요소도 중요합니다. 큰 결정 전에는 부동산 중개사·재무설계사와 상담을 권장합니다.',
  },
];

export const NRB_RELATED_LINKS = [
  { href: '/reports/newlywed-cost-2026/', label: '2026 신혼부부 결혼·신혼집 비용 완전 분석' },
  { href: '/tools/home-purchase-fund/', label: '내집마련 자금 계산기' },
  { href: '/tools/jeonwolse-conversion/', label: '전월세 전환율 계산기' },
  { href: '/tools/mortgage-prepayment-penalty/', label: '중도상환 수수료 계산기' },
  { href: '/tools/apt-cheonyak-gajum-calculator/', label: '아파트 청약 가점 계산기' },
];
