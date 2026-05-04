export type RefinanceRiskLevel = "low" | "medium" | "high";

export interface SeoulRefinancingDistrict {
  district: string;
  loanCountLabel: string;
  totalLoanBalanceLabel: string;
  estimatedAverageBalance: number;
  currentRatePercent: number;
  refinanceRatePercent: number;
  rateGapPercentPoint: number;
  annualInterestSaving: number;
  threeYearGrossSaving: number;
  estimatedFeeAndCost: number;
  estimatedNetBenefit: number;
  riskLevel: RefinanceRiskLevel;
  note: string;
}

export interface RefinanceTimingRow {
  elapsedLabel: string;
  feeLevel: string;
  judgment: string;
  note: string;
}

export interface RateSwitchScenario {
  type: string;
  favorableWhen: string;
  unfavorableWhen: string;
  keyCheck: string;
}

export interface RefinanceCaseStudy {
  id: string;
  title: string;
  district: string;
  loanBalance: number;
  currentRatePercent: number;
  newRatePercent: number;
  penaltyCost: number;
  extraCost: number;
  annualSaving: number;
  judgment: string;
}

export interface ChecklistItem {
  title: string;
  body: string;
}

export interface PolicyLoanRow {
  product: string;
  checkPoint: string;
  caution: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const reportMeta = {
  slug: "seoul-mortgage-refinancing-2026",
  title: "서울 구별 대환대출 갈아타기 손익 비교 2026 | 강남·마포·노원 주담대 절감액",
  description:
    "2026년 서울 주요 구별 추정 평균 주담대 잔액과 금리 차이를 기준으로 대환대출 갈아타기 시 이자 절감액, 중도상환수수료, 신규 부대비용, DSR 리스크를 비교합니다.",
  baseLabel: "2026년 4월 기준, 공개 통계·보도 기반 참고 시뮬레이션",
  updatedAt: "2026년 4월 기준 정리",
};

const currentRatePercent = 4.8;
const refinanceRatePercent = 3.9;
const rateGapPercentPoint = 0.9;

function makeDistrictRow(
  district: string,
  loanCountLabel: string,
  totalLoanBalanceLabel: string,
  estimatedAverageBalance: number,
  riskLevel: RefinanceRiskLevel,
  note: string,
): SeoulRefinancingDistrict {
  const annualInterestSaving = Math.round(estimatedAverageBalance * (rateGapPercentPoint / 100));
  const threeYearGrossSaving = annualInterestSaving * 3;
  const estimatedFeeAndCost = Math.round(estimatedAverageBalance * 0.004 + 500000);
  const estimatedNetBenefit = threeYearGrossSaving - estimatedFeeAndCost;

  return {
    district,
    loanCountLabel,
    totalLoanBalanceLabel,
    estimatedAverageBalance,
    currentRatePercent,
    refinanceRatePercent,
    rateGapPercentPoint,
    annualInterestSaving,
    threeYearGrossSaving,
    estimatedFeeAndCost,
    estimatedNetBenefit,
    riskLevel,
    note,
  };
}

export const districtRows: SeoulRefinancingDistrict[] = [
  makeDistrictRow("강남구", "0.5만 건", "1.7조 원", 340000000, "high", "잔액 규모가 커 절감액은 크지만 DSR·고액 주담대 심사 변수도 함께 봐야 합니다."),
  makeDistrictRow("강동구", "0.6만 건", "1.9조 원", 320000000, "medium", "대출 규모가 큰 편이라 0.5%p 이상 금리 차이부터 비용 회수 기간을 비교할 만합니다."),
  makeDistrictRow("서초구", "0.4만 건", "1.3조 원", 325000000, "high", "고액 잔액 구간은 보증·부대비용과 은행별 한도 관리 영향을 같이 확인해야 합니다."),
  makeDistrictRow("성동구", "0.4만 건", "1.3조 원", 325000000, "medium", "추정 잔액이 높아 금리 차이가 작아도 절감액이 크게 보일 수 있습니다."),
  makeDistrictRow("송파구", "0.5만 건", "1.1조 원", 220000000, "medium", "중간 이상 잔액 구간으로 수수료 잔여 기간에 따라 손익이 갈립니다."),
  makeDistrictRow("양천구", "0.5만 건", "1.2조 원", 240000000, "medium", "학군·실거주 수요가 많은 구간이라 보유 기간과 금리 유형을 같이 봐야 합니다."),
  makeDistrictRow("마포구", "0.4만 건", "0.9조 원", 225000000, "medium", "잔액 2억 원대에서는 금리 차이 1%p 안팎이면 1년 안팎 회수 가능성이 생깁니다."),
  makeDistrictRow("노원구", "0.5만 건", "0.8조 원", 160000000, "low", "잔액이 상대적으로 낮아 금리 차이가 작으면 부대비용 회수 기간이 길어질 수 있습니다."),
  makeDistrictRow("영등포구", "0.3만 건", "0.9조 원", 300000000, "medium", "건당 잔액 추정치가 높아 신규 금리 확정 전 예비 계산이 특히 중요합니다."),
  makeDistrictRow("동작구", "0.4만 건", "1.0조 원", 250000000, "medium", "중간 잔액 구간으로 2년 이상 유지 계획이 있을 때 손익 계산 의미가 커집니다."),
];

export const summaryCards = [
  { label: "손익 공식", value: "절감 이자 - 수수료 - 부대비용", note: "금리 차이만 보면 실제 이득을 놓칠 수 있습니다." },
  { label: "기본 금리 차이", value: "0.9%p", note: "기존 4.8%, 대환 3.9% 예시 시뮬레이션입니다." },
  { label: "잔액 효과", value: "잔액이 클수록 민감", note: "같은 금리 차이도 1.6억과 3.4억의 절감액은 다릅니다." },
  { label: "승인 리스크", value: "DSR·LTV 재심사", note: "소득, 신용대출, 은행 총량관리 변수 확인이 필요합니다." },
];

export const timingRows: RefinanceTimingRow[] = [
  { elapsedLabel: "실행 6개월 후", feeLevel: "높음", judgment: "조건부 검토", note: "금리 차이가 1%p 이상이거나 잔액이 큰 경우에만 비용 회수 가능성을 봅니다." },
  { elapsedLabel: "실행 1년 후", feeLevel: "중간~높음", judgment: "대체로 검토 가능", note: "잔액이 클수록 유리하지만 약정상 수수료율 확인이 먼저입니다." },
  { elapsedLabel: "실행 2년 후", feeLevel: "낮음", judgment: "유리 가능성 증가", note: "수수료 부담이 줄어 금리 차이 0.5%p 안팎도 비교할 수 있습니다." },
  { elapsedLabel: "실행 2년 9개월 후", feeLevel: "매우 낮음", judgment: "대기 비교", note: "3년 면제일까지 기다리는 선택과 즉시 대환을 함께 계산합니다." },
  { elapsedLabel: "실행 3년 후", feeLevel: "0원 가능", judgment: "가장 단순", note: "수수료가 면제되면 신규 부대비용과 금리 유형 리스크가 핵심입니다." },
];

export const rateSwitchScenarios: RateSwitchScenario[] = [
  { type: "고정 → 변동", favorableWhen: "금리 하락기가 이어지고 2~3년 안에 매도·상환 계획이 있을 때", unfavorableWhen: "금리가 다시 오를 가능성을 감당하기 어려울 때", keyCheck: "변동주기, 기준금리 방향, 재대환 가능 시점" },
  { type: "변동 → 고정", favorableWhen: "월 상환액 안정성이 더 중요하고 장기 보유 계획이 있을 때", unfavorableWhen: "초기 고정금리가 높아 절감액이 작아질 때", keyCheck: "고정기간, 중도상환수수료, 총이자" },
  { type: "변동 → 혼합형", favorableWhen: "초기 안정성과 일정 수준의 금리 절감을 함께 보고 싶을 때", unfavorableWhen: "3년·5년 뒤 변동 조건을 이해하기 어려울 때", keyCheck: "고정 종료 후 가산금리와 변동 기준" },
  { type: "고정 → 고정", favorableWhen: "기존 고정금리가 높고 새 고정금리가 충분히 낮을 때", unfavorableWhen: "금리 차이가 작고 수수료가 많이 남아 있을 때", keyCheck: "수수료 회수 기간과 새 약정 기간" },
];

export const preferenceChecks: ChecklistItem[] = [
  { title: "급여이체", body: "실제 급여 입금 인정 기준과 유지 기간을 확인합니다." },
  { title: "카드 사용", body: "월 사용액 조건, 연회비, 실사용 가능성을 함께 봅니다." },
  { title: "자동이체", body: "공과금·관리비 자동이체 건수 조건이 있는지 확인합니다." },
  { title: "예적금·청약", body: "강제 가입처럼 느껴지는 조건이면 실질 금리 절감액에서 차감해 봅니다." },
  { title: "비대면 신청", body: "앱 신청 우대와 영업점 상담 조건이 다른지 비교합니다." },
  { title: "비교 플랫폼", body: "플랫폼 경유 금리와 주거래은행 직접 신청 금리를 모두 확인합니다." },
];

export const dsrChecks: ChecklistItem[] = [
  { title: "최근 연소득", body: "기존 대출 당시보다 소득이 줄었다면 대환 한도가 부족할 수 있습니다." },
  { title: "신용대출", body: "마이너스통장, 카드론, 자동차 할부도 DSR에 함께 들어갈 수 있습니다." },
  { title: "공동소득", body: "배우자 소득 인정과 공동명의 가능 여부를 사전에 확인합니다." },
  { title: "월 상환액", body: "금리 인하보다 만기 연장 효과가 큰 경우 총이자가 늘 수 있습니다." },
  { title: "은행 총량관리", body: "개인 조건이 좋아도 은행별 한도 관리로 승인 조건이 달라질 수 있습니다." },
  { title: "고액 주담대", body: "대출금액이 클수록 보증·부대비용과 심사 기준을 더 보수적으로 봅니다." },
];

export const caseStudies: RefinanceCaseStudy[] = [
  {
    id: "success",
    title: "비용 회수가 빠른 예시 시나리오",
    district: "마포구",
    loanBalance: 250000000,
    currentRatePercent: 5.1,
    newRatePercent: 3.9,
    penaltyCost: 600000,
    extraCost: 400000,
    annualSaving: 3000000,
    judgment: "금리 차이가 1.2%p이고 잔액이 2억 원 이상이라 1년 안팎 비용 회수가 가능한 예시입니다.",
  },
  {
    id: "caution",
    title: "비용 회수가 늦어지는 예시 시나리오",
    district: "노원구",
    loanBalance: 120000000,
    currentRatePercent: 4.4,
    newRatePercent: 4.0,
    penaltyCost: 700000,
    extraCost: 400000,
    annualSaving: 480000,
    judgment: "금리 차이가 0.4%p이고 잔액이 낮아 수수료 면제 이후 재검토가 더 나을 수 있는 예시입니다.",
  },
];

export const timingChecklist: ChecklistItem[] = [
  { title: "금리 차이", body: "기존 금리와 신규 적용금리 차이가 최소 0.5%p 이상인지 봅니다." },
  { title: "대출잔액", body: "잔액 1억 원 미만이면 부대비용 회수 기간이 길어질 수 있습니다." },
  { title: "수수료 면제일", body: "면제일까지 몇 개월 남았는지 즉시 대환과 비교합니다." },
  { title: "보유 기간", body: "새 대출을 최소 2년 이상 유지할 계획인지 확인합니다." },
  { title: "우대금리 유지", body: "급여이체, 카드 사용 등 조건을 실제로 지킬 수 있어야 합니다." },
  { title: "금리 유형", body: "고정·변동·혼합형 전환의 월 상환액 변동 위험을 이해해야 합니다." },
];

export const policyLoanRows: PolicyLoanRow[] = [
  { product: "디딤돌대출", checkPoint: "소득, 주택가격, 무주택 요건", caution: "기존 주담대 대환 가능 여부와 한도 조건을 별도로 확인해야 합니다." },
  { product: "보금자리론", checkPoint: "주택가격, 소득, 대출한도", caution: "금리만 낮아 보여도 만기와 상환 방식에 따라 총이자가 달라집니다." },
  { product: "신생아 특례대출", checkPoint: "출산 시점, 소득, 주택가격", caution: "2026년 실제 요건과 접수 가능 여부를 최신 공지로 확인해야 합니다." },
  { product: "전세대출 대환", checkPoint: "보증기관, 임대차계약 기간", caution: "HUG, HF, SGI 보증 조건과 만기 일치 여부가 중요합니다." },
];

export const processSteps = [
  "은행 앱에서 기존 대출잔액, 금리, 만기, 상환방식, 중도상환수수료를 확인합니다.",
  "은행 앱, 비교 플랫폼, 주거래은행 상담으로 신규 대환 가능 금리를 확인합니다.",
  "소득과 전체 부채를 기준으로 DSR 한도에 여유가 있는지 확인합니다.",
  "기존 대출 실행일과 상환 예정일 기준으로 중도상환수수료를 계산합니다.",
  "이자 절감액에서 중도상환수수료와 신규 부대비용을 차감합니다.",
  "신규 대출 실행일과 기존 대출 상환일이 어긋나지 않게 신청 일정을 맞춥니다.",
];

export const references = [
  { label: "금융위원회 가계부채 관리방안", href: "https://www.fsc.go.kr/no010101/86606" },
  { label: "금융위원회 새해부터 달라지는 금융제도", href: "https://www.fsc.go.kr/no010101/85970" },
  { label: "경향신문 서울 다주택자 주담대 잔액 보도", href: "https://www.khan.co.kr/article/202603051502001" },
];

export const relatedLinks = [
  { label: "중도상환수수료 계산기", href: "/tools/mortgage-prepayment-penalty/" },
  { label: "내집마련 자금 계산기", href: "/tools/home-purchase-fund/" },
  { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/" },
];

export const faqItems: FaqItem[] = [
  { q: "대환대출은 금리 차이가 몇 %p 이상이어야 이득인가요?", a: "잔액이 크고 중도상환수수료가 낮다면 0.5%p 차이도 검토할 수 있습니다. 반대로 잔액이 작거나 수수료가 많이 남아 있으면 1.0%p 이상 차이가 나야 실익이 커질 수 있습니다." },
  { q: "중도상환수수료가 남아 있어도 갈아타는 게 좋을 수 있나요?", a: "앞으로 줄어드는 이자가 중도상환수수료와 신규 대출 부대비용보다 크다면 갈아타기가 유리할 수 있습니다. 다만 실제 수수료율과 면제일은 기존 약정서 기준으로 확인해야 합니다." },
  { q: "대환대출도 DSR 심사를 다시 받나요?", a: "대환대출은 새 대출을 실행해 기존 대출을 갚는 구조라 DSR, LTV, 소득, 신용점수, 기존 부채가 다시 영향을 줄 수 있습니다." },
  { q: "고정금리에서 변동금리로 갈아타도 괜찮나요?", a: "금리 하락기에는 유리할 수 있지만, 향후 금리가 다시 오르면 월 상환액이 늘 수 있습니다. 최소 유지기간과 금리 변동 위험을 함께 봐야 합니다." },
  { q: "대출 갈아타기 전에 가장 먼저 확인할 것은 무엇인가요?", a: "기존 대출의 중도상환수수료와 신규 대출의 실제 적용금리입니다. 광고 금리가 아니라 우대조건 반영 후 본인에게 적용될 금리를 기준으로 계산해야 합니다." },
  { q: "서울 구별 대출잔액 비교는 공식 평균값인가요?", a: "아닙니다. 공개 통계와 보도에 나온 구별 대출 규모를 바탕으로 대출잔액을 대출건수로 나눈 참고용 추정 평균입니다. 개인별 평균 주담대 잔액을 보장하지 않습니다." },
  { q: "2025년 1월 13일 이후 대출은 중도상환수수료가 어떻게 달라지나요?", a: "금융당국은 2025년 1월 13일 이후 신규 대출부터 중도상환수수료를 실제 발생 비용 범위 안에서 부과하도록 개편했습니다. 다만 기존 대출과 개별 약정 조건은 금융기관 확인이 필요합니다." },
];

export function formatWon(value: number) {
  const abs = Math.abs(Math.round(value));
  if (abs >= 100000000) return `${(value / 100000000).toFixed(2).replace(/\.00$/, "")}억 원`;
  if (abs >= 10000) return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}
