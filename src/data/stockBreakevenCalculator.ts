export type MarketType = "kospi" | "kosdaq" | "konex" | "custom";

export interface MarketPreset {
  id: MarketType;
  label: string;
  transactionTaxRate: number;
  note: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  summary: string;
  values: {
    buyPrice: number;
    quantity: number;
    buyFeeRate: number;
    sellFeeRate: number;
    market: MarketType;
    transactionTaxRate: number;
    currentPrice: number | null;
    targetReturnRate: number;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
}

export const SBC_MARKET_PRESETS: MarketPreset[] = [
  { id: "kospi",  label: "코스피",    transactionTaxRate: 0.0018, note: "증권거래세 0.18%" },
  { id: "kosdaq", label: "코스닥",    transactionTaxRate: 0.0018, note: "증권거래세 0.18%" },
  { id: "konex",  label: "코넥스",    transactionTaxRate: 0.001,  note: "증권거래세 0.10%" },
  { id: "custom", label: "직접 입력", transactionTaxRate: 0,      note: "세율 직접 입력" },
];

export const SBC_DEFAULT_INPUT = {
  buyPrice: 50_000,
  quantity: 100,
  buyFeeRate: 0.00015,
  sellFeeRate: 0.00015,
  market: "kospi" as MarketType,
  transactionTaxRate: 0.0018,
  currentPrice: null as number | null,
  targetReturnRate: 5,
};

export const SBC_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "large-cap",
    label: "대형주 100주",
    summary: "코스피 · 5만원 매수 · 현재가 입력",
    values: {
      buyPrice: 80_000,
      quantity: 100,
      buyFeeRate: 0.00015,
      sellFeeRate: 0.00015,
      market: "kospi",
      transactionTaxRate: 0.0018,
      currentPrice: 76_000,
      targetReturnRate: 10,
    },
  },
  {
    id: "kosdaq-mid",
    label: "코스닥 중형주",
    summary: "코스닥 · 1만5천원 · 500주",
    values: {
      buyPrice: 15_000,
      quantity: 500,
      buyFeeRate: 0.00015,
      sellFeeRate: 0.00015,
      market: "kosdaq",
      transactionTaxRate: 0.0018,
      currentPrice: 13_500,
      targetReturnRate: 15,
    },
  },
  {
    id: "loss-recovery",
    label: "30% 하락 후 회복",
    summary: "10만원 매수 · 현재 7만원",
    values: {
      buyPrice: 100_000,
      quantity: 50,
      buyFeeRate: 0.00015,
      sellFeeRate: 0.00015,
      market: "kospi",
      transactionTaxRate: 0.0018,
      currentPrice: 70_000,
      targetReturnRate: 0,
    },
  },
];

export const SBC_FAQ: FaqItem[] = [
  {
    question: "매수가와 손익분기점은 왜 다른가요?",
    answer: "주식을 살 때 매수 수수료, 팔 때 매도 수수료와 증권거래세가 발생합니다. 이 비용을 모두 회수해야 진짜 '본전'이 되므로 손익분기점 매도가는 매수가보다 높습니다. 수수료율이 낮아 보여도 수량이 많으면 무시하기 어려운 금액이 됩니다.",
  },
  {
    question: "증권거래세율은 얼마인가요?",
    answer: "2026년 기준 코스피·코스닥 상장주식 증권거래세율은 0.18%입니다(매도금액 기준). 코넥스는 0.10%입니다. 실제 적용 세율은 시장과 거래 방식에 따라 다를 수 있으니 이용 중인 증권사 HTS/MTS에서 확인하세요.",
  },
  {
    question: "수수료율은 어디서 확인하나요?",
    answer: "증권사마다 수수료율이 다릅니다. 온라인(MTS/HTS) 기준으로 보통 0.015%~0.1% 수준이며, 신규 계좌 개설 혜택으로 일정 기간 무료인 경우도 있습니다. 정확한 수수료는 이용 중인 증권사 앱의 '수수료 안내'에서 확인하세요.",
  },
  {
    question: "목표 수익률 계산은 어떻게 되나요?",
    answer: "목표 수익률을 입력하면, 매수 총비용 대비 해당 수익률만큼 순이익이 남도록 하는 매도가를 계산합니다. 예를 들어 목표 10% 입력 시 수수료·거래세를 모두 낸 뒤 10%의 순이익이 남는 매도가가 표시됩니다.",
  },
  {
    question: "이 계산기에 양도소득세도 반영되나요?",
    answer: "이 계산기는 매매 수수료와 증권거래세(거래 시 자동 부과)만 반영합니다. 국내 상장주식 개인투자자(비대주주)는 원칙적으로 양도소득세 과세 대상이 아닙니다. 대주주이거나 비상장주식이라면 별도 양도소득세 계산이 필요합니다.",
  },
];

export const SBC_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/domestic-stock-capital-gains-tax/", label: "국내주식 양도소득세 계산기" },
  { href: "/tools/dca-investment-calculator/",        label: "적립식 투자 수익 비교 계산기" },
  { href: "/tools/coin-tax-calculator/",              label: "코인 세금 계산기" },
  { href: "/tools/fire-calculator/",                  label: "파이어족 계산기" },
];
