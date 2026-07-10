export type ComparisonRow = {
  area: string;
  korea: string;
  adr: string;
  winner: "korea" | "adr" | "neutral";
  note: string;
};

export type TaxExampleRow = {
  scenario: string;
  koreaTax: number;
  adrTax: number;
  diff: number;
  note: string;
};

export type DecisionCard = {
  audience: string;
  recommendation: "korea" | "adr" | "either";
  reason: string;
};

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

export const reportMeta = {
  slug: "sk-hynix-korea-vs-adr-investment-2026",
  title: "SK하이닉스 국내투자 vs ADR 2026 | 세금·환전 비용 한눈에 비교",
  description:
    "SK하이닉스를 국내 직접투자 vs 나스닥 ADR(SKHY)로 살 때 양도세·배당세·환전 수수료·거래시간 차이를 표로 비교. 실제 투자금 기준 예시 계산 포함.",
  h1: "SK하이닉스, 국내로 살까 나스닥 SKHY로 살까",
  eyebrow: "국내투자 vs ADR(SKHY) 투자 비교",
  updatedAt: "2026-07-10",
};

export const heroKpis = [
  {
    label: "양도세 기준",
    value: "국내 비과세 vs SKHY 22%",
    description: "대주주 아니면 국내 상장주식은 양도세 없음(장내거래 기준), SKHY는 250만원 공제 후 22%",
  },
  {
    label: "환전 비용",
    value: "왕복 스프레드 발생",
    description: "SKHY 매수·매도 시 환전 수수료가 이중으로 붙음",
  },
  {
    label: "거래시간",
    value: "한국장 vs 나스닥(야간)",
    description: "실시간 대응 가능 시간대가 다름",
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    area: "양도소득세",
    korea: "비과세(대주주 제외, 장내거래)",
    adr: "250만원 공제 후 22%(지방세 포함)",
    winner: "korea",
    note: "차익 규모가 클수록 격차 커짐",
  },
  {
    area: "배당소득세",
    korea: "15.4% 원천징수",
    adr: "미국 원천징수 후 국내 조정, 실효세율 상이",
    winner: "neutral",
    note: "개인 종합소득에 따라 달라짐",
  },
  {
    area: "환전 비용",
    korea: "해당 없음",
    adr: "매수·매도 시 왕복 환전 스프레드",
    winner: "korea",
    note: "증권사별 우대율 상이",
  },
  {
    area: "거래 시간",
    korea: "한국 정규장",
    adr: "나스닥 정규장(한국시간 야간)",
    winner: "neutral",
    note: "실시간 대응 가능 시간대 차이",
  },
  {
    area: "최소 매매단위",
    korea: "1주 단위 원화",
    adr: "ADS 1주 단위 달러(ADS 10주=보통주 1주 환산 필요)",
    winner: "neutral",
    note: "환율에 따라 원화 환산액 변동",
  },
];

// 2026년 세법 기준 예시 계산 — 구현 시점 최신 세율·공제 한도 재확인 필요
// 국내(장내, 비대주주): 양도차익 비과세 / SKHY: 250만원 공제 후 22%(지방세 포함) 분리과세
export const taxExampleRows: TaxExampleRow[] = [
  {
    scenario: "500만원 차익",
    koreaTax: 0,
    adrTax: 550000,
    diff: 550000,
    note: "(500만 − 250만) × 22%",
  },
  {
    scenario: "1,000만원 차익",
    koreaTax: 0,
    adrTax: 1650000,
    diff: 1650000,
    note: "(1,000만 − 250만) × 22%",
  },
  {
    scenario: "3,000만원 차익",
    koreaTax: 0,
    adrTax: 6050000,
    diff: 6050000,
    note: "(3,000만 − 250만) × 22%",
  },
];

export const decisionCards: DecisionCard[] = [
  {
    audience: "장기 배당 투자자",
    recommendation: "korea",
    reason: "국내 비과세 혜택과 환전 비용 부담이 없어 장기 보유 시 세금·비용 부담이 상대적으로 적습니다.",
  },
  {
    audience: "미국 지수·ETF와 함께 담고 싶은 투자자",
    recommendation: "adr",
    reason: "나스닥 SKHY로 미국 시장 다른 종목과 한 계좌에서 통합 관리할 수 있습니다.",
  },
  {
    audience: "환테크까지 고려하는 투자자",
    recommendation: "either",
    reason: "환율 타이밍을 함께 활용하고 싶다면 국내·ADR 모두 가능하며 목적에 따라 선택할 수 있습니다.",
  },
];

export const faq: ComparisonFaq[] = [
  {
    question: "SK하이닉스를 SKHY(ADR)로 사면 세금이 더 많이 나오나요?",
    answer:
      "국내 상장 주식은 대주주가 아닌 이상 장내 매매 양도차익이 비과세지만, SKHY는 연간 250만원 공제 후 초과분에 22%(지방세 포함) 분리과세가 적용됩니다. 같은 차익이라도 세후 실수령액 차이가 클 수 있습니다.",
  },
  {
    question: "SKHY 배당금도 국내랑 세율이 다른가요?",
    answer:
      "SKHY 배당금은 미국에서 원천징수된 후 국내에서 조정되는 방식이라 실효세율이 국내 15.4% 원천징수와 다를 수 있습니다. 정확한 세액은 개인 종합소득에 따라 달라지므로 전문가 상담을 권장합니다.",
  },
  {
    question: "환전 수수료는 어느 증권사가 유리한가요?",
    answer:
      "증권사별로 환전 우대율과 스프레드가 다릅니다. 자세한 비교는 증권사 수수료 비교 리포트에서 확인할 수 있습니다.",
  },
  {
    question: "미국주식 환차손익은 어떻게 계산하나요?",
    answer:
      "SKHY는 달러로 거래되므로 주가가 그대로여도 원/달러 환율이 오르내리면 원화로 환산한 평가금액과 손익이 달라집니다. 국내 주가와 SKHY 가격의 실시간 차이는 ADR 프리미엄 계산기에서 확인할 수 있습니다.",
  },
  {
    question: "국내투자와 SKHY(ADR)투자 중 뭐가 더 나은가요?",
    answer:
      "정답은 없습니다. 세금 부담을 최소화하고 싶다면 국내 직접투자가, 미국 시장 다른 종목과 통합 관리하고 싶다면 SKHY가 더 맞을 수 있습니다. 투자 목적에 따라 선택 기준이 달라집니다.",
  },
];

export const relatedLinks: RelatedLink[] = [
  {
    href: "/tools/sk-hynix-adr-premium-calculator/",
    label: "ADR 프리미엄 계산기",
    description: "국내 주가와 SKHY 가격 차이 바로 계산",
  },
  {
    href: "/reports/sk-hynix-adr-listing-2026/",
    label: "SK하이닉스 ADR 상장 완전정리",
    description: "나스닥 상장 배경·조달금액·투자자 영향",
  },
  {
    href: "/reports/stock-brokerage-fee-comparison-2026/",
    label: "증권사 수수료 비교",
    description: "환전 스프레드 상세 비교",
  },
  {
    href: "/reports/sk-hynix-bonus-2027/",
    label: "하이닉스 2027 성과급 전망",
    description: "SK하이닉스 성과급 클러스터 연결",
  },
];
