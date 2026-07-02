export type BenefitEvidenceBadge = "공식" | "보도 기준" | "사용자 입력값" | "시뮬레이션" | "확인 필요";

export type RepaymentType = "simpleInterest" | "interestOnly" | "equalPrincipal" | "equalPayment";

export interface LoanBenefitMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface HousingLoanScenario {
  id: string;
  label: string;
  description: string;
  companyName: string;
  principalKrw: number;
  benefitRatePercent: number;
  marketRatePercent: number;
  years: number;
  taxRatePercent: number;
  repaymentType: RepaymentType;
  evidenceBadge: BenefitEvidenceBadge;
  sourceLabel: string;
  note: string;
}

export interface HousingLoanResult {
  benefitAnnualInterestKrw: number;
  marketAnnualInterestKrw: number;
  annualSavingKrw: number;
  monthlySavingKrw: number;
  totalSavingKrw: number;
  grossSalaryEquivalentKrw: number | null;
  rateGapPercentPoint: number;
}

export interface SensitivityRow {
  label: string;
  principalKrw: number;
  benefitRatePercent: number;
  marketRatePercent: number;
  annualSavingKrw: number;
  monthlySavingKrw: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuideSection {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  points?: string[];
}

export const SEHL_META: LoanBenefitMeta = {
  slug: "samsung-electronics-housing-loan-benefit-calculator",
  title: "삼성전자 주택대출 복지 계산기",
  seoTitle: "삼성전자 주택대출 복지 계산기 | 5억 1.5% 이자 이득 계산",
  description:
    "삼성전자 주택자금 대출 복지를 시중금리와 비교해 연간 이자 절감액, 월 절감액, 세전 연봉 환산액으로 계산합니다. 5억 원·연 1.5% 시나리오도 바로 확인할 수 있습니다.",
  updatedAt: "2026-07-01",
  dataAsOf: "2026년 7월 1일 대표 시뮬레이션 기준",
  notice:
    "실제 삼성전자 주택자금 대출 한도, 금리, 대상, 재직 조건, 과세 여부는 회사 내부 규정과 개인 상황에 따라 달라질 수 있습니다.",
};

export const SEHL_DEFAULT_SCENARIO: HousingLoanScenario = {
  id: "samsung-5eok-1-5-vs-4-0",
  label: "5억 원·연 1.5% 대표 시나리오",
  description: "대출 5억 원, 복지금리 1.5%, 시중금리 4.0%를 비교합니다.",
  companyName: "삼성전자",
  principalKrw: 500000000,
  benefitRatePercent: 1.5,
  marketRatePercent: 4.0,
  years: 10,
  taxRatePercent: 24,
  repaymentType: "simpleInterest",
  evidenceBadge: "시뮬레이션",
  sourceLabel: "사용자 제안 시나리오, 공식 확인 필요",
  note:
    "5억 원·연 1.5%는 계산 예시이며 실제 사내대출 조건은 삼성전자 내부 규정에 따라 달라질 수 있습니다.",
};

export const SEHL_MARKET_RATE_PRESETS = [3.5, 4.0, 4.5, 5.0];

export const SEHL_PRINCIPAL_PRESETS = [
  { label: "1억", value: 100000000 },
  { label: "3억", value: 300000000 },
  { label: "5억", value: 500000000 },
  { label: "7억", value: 700000000 },
];

export const SEHL_TAX_RATE_PRESETS = [15, 24, 35];

export function calculateSimpleInterestBenefit(
  principalKrw: number,
  benefitRatePercent: number,
  marketRatePercent: number,
  years: number,
  taxRatePercent: number
): HousingLoanResult {
  const benefitRate = benefitRatePercent / 100;
  const marketRate = marketRatePercent / 100;
  const taxRate = taxRatePercent / 100;
  const benefitAnnualInterestKrw = principalKrw * benefitRate;
  const marketAnnualInterestKrw = principalKrw * marketRate;
  const annualSavingKrw = marketAnnualInterestKrw - benefitAnnualInterestKrw;
  const monthlySavingKrw = annualSavingKrw / 12;
  const totalSavingKrw = annualSavingKrw * years;
  const grossSalaryEquivalentKrw =
    taxRate >= 1 ? null : annualSavingKrw / (1 - taxRate);

  return {
    benefitAnnualInterestKrw,
    marketAnnualInterestKrw,
    annualSavingKrw,
    monthlySavingKrw,
    totalSavingKrw,
    grossSalaryEquivalentKrw,
    rateGapPercentPoint: marketRatePercent - benefitRatePercent,
  };
}

export function buildMarketRateRows(scenario = SEHL_DEFAULT_SCENARIO): SensitivityRow[] {
  return SEHL_MARKET_RATE_PRESETS.map((marketRatePercent) => {
    const result = calculateSimpleInterestBenefit(
      scenario.principalKrw,
      scenario.benefitRatePercent,
      marketRatePercent,
      scenario.years,
      scenario.taxRatePercent
    );

    return {
      label: `${marketRatePercent.toFixed(1)}%`,
      principalKrw: scenario.principalKrw,
      benefitRatePercent: scenario.benefitRatePercent,
      marketRatePercent,
      annualSavingKrw: result.annualSavingKrw,
      monthlySavingKrw: result.monthlySavingKrw,
    };
  });
}

export function buildPrincipalRows(scenario = SEHL_DEFAULT_SCENARIO): SensitivityRow[] {
  return SEHL_PRINCIPAL_PRESETS.map(({ label, value }) => {
    const result = calculateSimpleInterestBenefit(
      value,
      scenario.benefitRatePercent,
      scenario.marketRatePercent,
      scenario.years,
      scenario.taxRatePercent
    );

    return {
      label,
      principalKrw: value,
      benefitRatePercent: scenario.benefitRatePercent,
      marketRatePercent: scenario.marketRatePercent,
      annualSavingKrw: result.annualSavingKrw,
      monthlySavingKrw: result.monthlySavingKrw,
    };
  });
}

export function formatKoreanWon(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 100000000) {
    const eok = abs / 100000000;
    const formatted = Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1);
    return `${sign}${formatted}억 원`;
  }

  if (abs >= 10000) {
    const man = Math.round(abs / 10000);
    return `${sign}${man.toLocaleString("ko-KR")}만 원`;
  }

  return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export const SEHL_INFO_LINES = [
  "5억 원·연 1.5%는 삼성전자 공식 확정값이 아니라 대표 시뮬레이션 입력값입니다.",
  SEHL_META.notice,
  "저리 사내대출의 과세 여부와 실제 순이득은 회사 규정, 세법 적용, 개인 소득 구간에 따라 달라질 수 있습니다.",
];

export const SEHL_SEO_INTRO = [
  "삼성전자 주택대출 복지는 연봉표에는 잘 드러나지 않지만, 금리 차이만으로도 현금흐름에 큰 영향을 줄 수 있습니다. 예를 들어 5억 원을 연 1.5%로 빌리고 시중금리가 연 4.0%라면 단순 이자 기준 연간 약 1,250만 원의 차이가 납니다.",
  "이 계산기는 사내대출 복지를 연간 이자 절감액, 월 이자 절감액, 세전 연봉 환산액으로 바꿔 보여줍니다. 실제 삼성전자 주택자금 대출 한도와 금리는 공개 자료만으로 확정하기 어렵기 때문에, 모든 결과는 사용자가 입력한 조건에 따른 시뮬레이션으로 해석해야 합니다.",
];

export const SEHL_SEO_CRITERIA = [
  "연간 절감액은 대출원금에 시중금리와 복지금리의 차이를 곱해 계산합니다.",
  "월 절감액은 연간 절감액을 12개월로 나눈 단순 월평균입니다.",
  "세전 연봉 환산액은 연간 절감액을 1에서 추정 세율을 뺀 값으로 나눈 참고 지표입니다.",
  "MVP 계산은 원금이 유지되는 단순 이자 기준이며, 원리금균등·원금균등 상환 결과와 다를 수 있습니다.",
  "실제 사내대출 가능 여부, 한도, 금리, 과세 여부는 회사 내부 규정과 개인 조건 확인이 필요합니다.",
];

export const SEHL_DETAIL_GUIDE: GuideSection[] = [
  {
    eyebrow: "계산 핵심",
    title: "사내 주택대출 복지는 금리 차이를 현금으로 바꿔 보는 계산입니다",
    paragraphs: [
      "주택자금 대출 복지는 월급명세서에 바로 찍히는 현금 보상은 아니지만, 같은 금액을 더 낮은 금리로 빌릴 수 있다면 매달 빠져나가는 이자가 줄어듭니다. 그래서 이 계산기는 복지금리와 시중금리의 차이를 기준으로 연간 이자 절감액을 먼저 계산합니다.",
      "예를 들어 대출원금이 5억 원이고 복지금리가 연 1.5%, 비교할 시중금리가 연 4.0%라면 금리 차이는 2.5%p입니다. 5억 원의 2.5%는 연 1,250만 원이므로, 단순 이자 기준으로 매년 약 1,250만 원의 이자 부담을 줄이는 효과가 생깁니다.",
    ],
    points: [
      "연간 절감액 = 대출원금 × (시중금리 - 복지금리)",
      "월 절감액 = 연간 절감액 ÷ 12개월",
      "기간 총 절감액 = 연간 절감액 × 대출기간",
    ],
  },
  {
    eyebrow: "대표 예시",
    title: "5억 원을 연 1.5%로 빌릴 수 있다면 월 현금흐름이 크게 달라집니다",
    paragraphs: [
      "5억 원을 연 1.5%로 빌리면 단순 이자 기준 연 이자는 약 750만 원입니다. 같은 5억 원을 연 4.0% 시중금리로 빌리면 연 이자는 약 2,000만 원입니다. 두 금액의 차이가 바로 복지대출이 만들어내는 연간 이자 절감액입니다.",
      "연간 1,250만 원을 월평균으로 나누면 약 104만 원입니다. 즉, 실제 대출 실행 조건이 같다는 전제에서는 매달 주거비 부담이 100만 원 이상 낮아지는 것으로 체감될 수 있습니다. 이 때문에 사내대출 복지는 단순한 부가 혜택이 아니라 총보상 관점에서 꽤 큰 항목입니다.",
    ],
    points: [
      "복지금리 1.5% 연 이자: 약 750만 원",
      "시중금리 4.0% 연 이자: 약 2,000만 원",
      "차이: 연 약 1,250만 원, 월 약 104만 원",
    ],
  },
  {
    eyebrow: "연봉 환산",
    title: "이자 절감액은 세후 현금흐름이라 세전 연봉보다 더 크게 느껴질 수 있습니다",
    paragraphs: [
      "연봉 1,250만 원이 오른다고 해서 통장에 1,250만 원이 그대로 남지는 않습니다. 소득세, 지방소득세, 4대보험 등으로 일부가 빠지기 때문입니다. 반대로 이자를 덜 내는 효과는 이미 지출이 줄어드는 방식이라, 사용자가 느끼는 현금흐름은 세후 금액에 가깝습니다.",
      "이 계산기에서 세전 연봉 환산액을 보여주는 이유가 여기에 있습니다. 연간 1,250만 원을 절감하고 추정 세율을 24%로 보면, 같은 세후 효과를 만들기 위해 필요한 세전 연봉은 약 1,645만 원입니다. 다만 이 값은 복지의 체감 가치를 이해하기 위한 참고치이며, 실제 과세 여부를 확정하는 값은 아닙니다.",
    ],
    points: [
      "세전 연봉 환산액 = 연간 절감액 ÷ (1 - 추정 세율)",
      "연 1,250만 원 절감, 세율 24% 가정: 약 1,645만 원",
      "세율이 높을수록 같은 절감액의 세전 연봉 환산 가치는 커집니다.",
    ],
  },
  {
    eyebrow: "입력 방법",
    title: "시중금리는 본인이 실제 받을 수 있는 대출금리로 넣는 것이 가장 현실적입니다",
    paragraphs: [
      "비교 시중금리는 뉴스에 나오는 평균 금리보다 본인이 실제로 받을 수 있는 은행 대출금리, 현재 보유 중인 주택담보대출 금리, 또는 대환을 검토 중인 상품의 예상 금리를 넣는 것이 좋습니다. 신용점수, 담보, LTV, DSR, 고정·변동 선택에 따라 실제 적용 금리가 달라지기 때문입니다.",
      "정확한 금리를 모를 때는 3.5%, 4.0%, 4.5%, 5.0% 프리셋을 눌러 민감도를 먼저 보면 됩니다. 복지금리가 고정되어 있다면 시중금리가 높아질수록 복지의 경제적 가치는 커지고, 시중금리가 낮아질수록 절감액은 줄어듭니다.",
    ],
    points: [
      "현재 보유 대출과 비교: 현재 대출금리를 시중금리에 입력",
      "신규 주택 구입과 비교: 은행 사전조회 예상 금리를 입력",
      "복지 한도 일부만 가능할 때: 실제 이용 가능한 금액만 대출원금에 입력",
    ],
  },
  {
    eyebrow: "확인 사항",
    title: "실제 신청 전에는 한도, 대상, 과세, 중도상환수수료를 따로 확인해야 합니다",
    paragraphs: [
      "사내 주택대출은 회사 복지 규정에 따라 대상자, 재직기간, 주택 보유 여부, 대출 목적, 보증 방식, 한도, 신청 가능 시점이 달라질 수 있습니다. 같은 회사에 다니더라도 개인 조건에 따라 실제 가능한 금액과 금리가 다를 수 있습니다.",
      "기존 주택담보대출을 사내대출로 갈아타는 상황이라면 중도상환수수료, 근저당 말소·설정 비용, 보증료, 인지세 같은 부대비용도 함께 봐야 합니다. 이 계산기의 절감액이 커 보여도 초기 비용이 크면 실제 손익분기점은 뒤로 밀릴 수 있습니다.",
    ],
    points: [
      "회사 내부 복지 규정의 대출 한도와 적용 금리",
      "저리 대출 이익의 과세 여부와 원천징수 처리 방식",
      "기존 대출 상환 시 중도상환수수료와 부대비용",
      "퇴사, 휴직, 전출, 주택 처분 시 상환 조건",
    ],
  },
  {
    eyebrow: "주의",
    title: "이 페이지의 5억·1.5%는 공식 확정 조건이 아니라 계산용 시나리오입니다",
    paragraphs: [
      "이 페이지는 삼성전자 주택대출 복지의 경제적 가치를 계산하기 위한 도구입니다. 5억 원, 연 1.5% 조건은 사용자가 빠르게 이해할 수 있도록 넣은 대표 시뮬레이션이며, 삼성전자 공식 복지 조건을 확정해 고지하는 페이지가 아닙니다.",
      "따라서 결과는 ‘이 조건이라면 이 정도 가치가 있다’는 계산값으로 봐야 합니다. 실제 신청 가능 여부와 최종 금리는 회사 안내, 인사·복지 시스템, 약정서, 세무 처리 기준을 통해 확인해야 합니다.",
    ],
    points: [
      "공식 조건 확인 전에는 결과를 확정 혜택으로 해석하지 않기",
      "개인별 대출 가능 금액과 적용 금리에 맞춰 직접 입력하기",
      "세금과 부대비용은 별도 확인 후 최종 의사결정하기",
    ],
  },
];

export const SEHL_FAQ: FaqItem[] = [
  {
    question: "삼성전자 주택대출 복지 금리는 정말 1.5%인가요?",
    answer:
      "이 페이지의 1.5%는 대표 시뮬레이션 입력값입니다. 실제 금리와 한도는 삼성전자 내부 규정, 재직 조건, 신청 시점에 따라 달라질 수 있으므로 공식 확인이 필요합니다.",
  },
  {
    question: "5억 원을 1.5%로 빌리면 얼마를 아끼나요?",
    answer:
      "시중금리 4.0%와 비교하면 단순 이자 기준 연간 약 1,250만 원, 월 약 104만 원을 아끼는 계산이 나옵니다.",
  },
  {
    question: "이 금액을 연봉으로 환산하면 얼마인가요?",
    answer:
      "연간 절감액 1,250만 원을 세율 24%로 환산하면 세전 연봉 약 1,645만 원 가치로 볼 수 있습니다. 단, 실제 세율과 과세 여부에 따라 달라집니다.",
  },
  {
    question: "사내대출 이득도 세금을 내야 하나요?",
    answer:
      "저리 대출은 조건에 따라 과세 이슈가 생길 수 있습니다. 이 계산기는 세무 판단을 대신하지 않으며, 실제 적용은 회사와 세무 전문가 확인이 필요합니다.",
  },
  {
    question: "원리금균등 상환이면 결과가 달라지나요?",
    answer:
      "달라집니다. 원금이 줄어들면 금리 차이로 절감되는 이자도 줄어듭니다. 현재 계산기는 단순 이자 기준을 기본으로 하며, 상환방식별 계산은 확장 기능으로 다룰 수 있습니다.",
  },
  {
    question: "삼성전자 말고 다른 회사 복지도 비교할 수 있나요?",
    answer:
      "구조상 가능합니다. 같은 계산식을 사용해 SK하이닉스, 현대차, LG, 공공기관 등 회사별 주택자금 대출 복지를 비교 콘텐츠로 확장할 수 있습니다.",
  },
  {
    question: "기존 주택담보대출과 비교해도 되나요?",
    answer:
      "가능합니다. 기존 대출금리를 시중금리에 넣고 사내대출 예상 금리를 복지금리에 넣으면 대략적인 이자 차이를 볼 수 있습니다. 다만 중도상환수수료와 담보 조건은 별도로 확인해야 합니다.",
  },
  {
    question: "시중금리는 어떤 값을 넣어야 하나요?",
    answer:
      "본인이 실제로 받을 수 있는 은행 주택담보대출 예상 금리나 현재 보유 대출 금리를 넣는 것이 가장 현실적입니다. 잘 모르면 4.0%, 4.5%, 5.0% 버튼으로 민감도를 먼저 확인하면 됩니다.",
  },
];

export const SEHL_RELATED_LINKS = [
  {
    href: "/tools/samsung-bonus/",
    label: "삼성전자 성과급 계산기",
    description: "성과급과 금융 복지를 함께 보면 총보상 체감액이 달라집니다.",
  },
  {
    href: "/reports/samsung-bonus-rank-net-comparison-2026/",
    label: "삼성전자 성과급 직급별 실수령액",
    description: "직급별 성과급 실수령액과 복지 가치를 함께 비교해보세요.",
  },
  {
    href: "/tools/loan-refinancing-calculator/",
    label: "대출 갈아타기 계산기",
    description: "기존 주택담보대출과 사내대출의 이자 차이를 함께 비교할 수 있습니다.",
  },
  {
    href: "/tools/salary/",
    label: "연봉 실수령액 계산기",
    description: "복지의 세전 연봉 환산액을 실제 월급 감각과 비교해보세요.",
  },
];
