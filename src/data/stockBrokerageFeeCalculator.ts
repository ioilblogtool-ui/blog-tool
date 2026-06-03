export interface BrokerFeeInfo {
  id: string;
  name: string;
  domesticRate: number;
  overseasRate: number;
  fxSpread: number;
  domesticNote: string;
  overseasNote: string;
  defaultSelected: boolean;
  badge?: string;
}

export const SBFC_BROKERS: BrokerFeeInfo[] = [
  {
    id: "kiwoom",
    name: "키움증권",
    domesticRate: 0.00015,
    overseasRate: 0.0025,
    fxSpread: 0.005,
    domesticNote: "비대면 이벤트 기준. 이벤트 종료 후 기본 수수료 적용",
    overseasNote: "미국주식 기준. 유관기관 제비용 별도",
    defaultSelected: true,
    badge: "국내 1위",
  },
  {
    id: "toss",
    name: "토스증권",
    domesticRate: 0.0,
    overseasRate: 0.001,
    fxSpread: 0.005,
    domesticNote: "국내주식 수수료 무료(유관기관 제비용 별도)",
    overseasNote: "이벤트 기준. 종료 후 0.25% 적용 가능",
    defaultSelected: true,
    badge: "국내 무료",
  },
  {
    id: "samsung",
    name: "삼성증권",
    domesticRate: 0.00015,
    overseasRate: 0.0019,
    fxSpread: 0.006,
    domesticNote: "비대면 기준. 계좌 종류별 수수료 상이",
    overseasNote: "미국주식 기준. ISA·연금계좌 별도",
    defaultSelected: true,
  },
  {
    id: "mirae",
    name: "미래에셋증권",
    domesticRate: 0.00015,
    overseasRate: 0.0035,
    fxSpread: 0.006,
    domesticNote: "비대면 기준",
    overseasNote: "미국주식 기준. 환전 우대 조건 별도 확인",
    defaultSelected: false,
  },
  {
    id: "korea-investment",
    name: "한국투자증권",
    domesticRate: 0.00015,
    overseasRate: 0.0025,
    fxSpread: 0.005,
    domesticNote: "비대면 기준. 주문 채널별 수수료 상이",
    overseasNote: "미국주식 기준. 이벤트 조건 별도",
    defaultSelected: false,
  },
  {
    id: "nh",
    name: "NH투자증권",
    domesticRate: 0.00015,
    overseasRate: 0.0025,
    fxSpread: 0.007,
    domesticNote: "비대면 기준",
    overseasNote: "미국주식 기준",
    defaultSelected: false,
  },
  {
    id: "kb",
    name: "KB증권",
    domesticRate: 0.00015,
    overseasRate: 0.0025,
    fxSpread: 0.006,
    domesticNote: "비대면 기준",
    overseasNote: "미국주식 기준",
    defaultSelected: false,
  },
];

export const SBFC_META = {
  title: "주식 매도 수수료 계산기 2026 — 증권사별 1회·연간 수수료 비교 | 비교계산소",
  description:
    "주식 매도 수수료가 얼마인지 바로 계산하세요. 거래금액을 입력하면 1회 매도 수수료(매매수수료 + 유관기관 제비용 + 증권거래세)를 즉시 산출하고, 키움·토스·삼성·미래에셋 등 7개 증권사 연간 수수료도 함께 비교합니다.",
} as const;

// 증권거래세 (국내주식 매도 시)
export const SBFC_TRANSACTION_TAX = {
  domestic: 0.0018,  // 코스피 0.18% (2024~ 인하 기준)
  kosdaq: 0.0018,    // 코스닥 동일
  label: "0.18%",
  note: "2024년 인하 기준. 코스피·코스닥 공통 적용",
} as const;

export const SBFC_FAQS = [
  {
    question: "증권사 수수료는 어떻게 계산하나요?",
    answer:
      "매매수수료는 '거래금액 × 수수료율'로 계산합니다. 여기에 유관기관 제비용(약 0.004%)이 별도로 붙습니다. 해외주식은 수수료 외에 환전 스프레드도 실질 비용에 포함됩니다.",
  },
  {
    question: "토스증권 국내주식 수수료가 0%면 진짜 공짜인가요?",
    answer:
      "매매수수료는 0%이지만 유관기관 제비용(거래소·예탁결제원 등)은 부과됩니다. 1회 거래당 약 0.004% 수준으로 소액이지만 0은 아닙니다. 이 계산기에서는 유관기관 제비용을 별도로 표시합니다.",
  },
  {
    question: "미국주식 수수료 외에 환전 비용은 얼마인가요?",
    answer:
      "미국주식 거래 시 원화→달러 환전이 필요합니다. 증권사별 환전 스프레드는 보통 0.5~1.0% 수준이며, 이 계산기에서는 환전 비용을 포함한 실질 총비용을 함께 표시합니다.",
  },
  {
    question: "이벤트 수수료와 기본 수수료 중 어느 걸 기준으로 해야 하나요?",
    answer:
      "계좌 개설 후 장기 보유 시에는 이벤트 종료 후 기본 수수료가 적용됩니다. 이 계산기는 현재 가장 널리 적용되는 이벤트/비대면 기준 수수료율을 사용합니다. 실제 계좌 개설 전 각 증권사 공식 안내를 반드시 확인하세요.",
  },
];
