export type BrokerId =
  | "kiwoom"
  | "toss"
  | "samsung"
  | "mirae"
  | "korea-investment"
  | "nh"
  | "kb"
  | "shinhan"
  | "hana"
  | "daishin";

export type FeeValueStatus = "confirmed" | "needsUpdate" | "eventOnly" | "notSupported" | "unknown";
export type InvestorType =
  | "domestic-trader"
  | "mobile-beginner"
  | "us-long-term"
  | "etf-long-term"
  | "margin-user"
  | "dividend-investor"
  | "auto-investor";

export interface FeeValue {
  value: number | null;
  unit: "%" | "bp" | "krw" | "text";
  label: string;
  status: FeeValueStatus;
  note?: string;
  sourceUrl?: string;
  checkedAt?: string;
}

export interface BrokerageFeeRow {
  brokerId: BrokerId;
  brokerName: string;
  domesticBaseFee: FeeValue;
  domesticEventFee: FeeValue;
  includesAgencyFee: "yes" | "no" | "unknown";
  lifetimeBenefit: "yes" | "conditional" | "no" | "unknown";
  domesticRecommendation: string;
  domesticCaution: string;
}

export interface OverseasFeeRow {
  brokerId: BrokerId;
  brokerName: string;
  usStockFee: FeeValue;
  usEtfSameFee: "yes" | "no" | "unknown";
  fxDiscountRate: FeeValue;
  preAfterMarket: "yes" | "limited" | "no" | "unknown";
  fractionalTrading: "yes" | "limited" | "no" | "unknown";
  recommendationScore: 1 | 2 | 3 | 4 | 5;
  caution: string;
}

export interface CreditInterestRow {
  brokerId: BrokerId;
  brokerName: string;
  day1to7: FeeValue;
  day8to15: FeeValue;
  day16to30: FeeValue;
  day31to60: FeeValue;
  day90Plus: FeeValue;
  sourceNote: string;
}

export interface BrokerFeatureRow {
  brokerId: BrokerId;
  brokerName: string;
  htsStrength: string;
  mtsStrength: string;
  isaSupport: "yes" | "limited" | "no" | "unknown";
  domesticFractional: "yes" | "limited" | "no" | "unknown";
  overseasFractional: "yes" | "limited" | "no" | "unknown";
  autoInvestment: "yes" | "limited" | "no" | "unknown";
  bestFor: InvestorType[];
  caution: string;
}

export interface BrokerRecommendation {
  investorType: InvestorType;
  label: string;
  keyCriteria: string;
  brokerCandidates: BrokerId[];
  reason: string;
  caution: string;
}

export interface FeeSimulationRow {
  id: string;
  label: string;
  annualTradeCount: number;
  tradeAmount: number;
  lowFeeRate: number;
  highFeeRate: number;
}

export interface BrokerageFaqItem {
  q: string;
  a: string;
}

export const SBF_META = {
  slug: "stock-brokerage-fee-comparison-2026",
  title: "국내 증권사 수수료·혜택 비교 2026",
  description:
    "국내주식·미국주식 수수료, 환전 우대, 신용공여 이자율, ISA 연계, 자동투자·소수점 투자, 신규 계좌 혜택까지 2026년 기준으로 비교합니다.",
  updatedAt: "2026년 4월",
  baseLabel: "2026년 4월 기준 공개 수수료표·이벤트·공시 확인 필요",
  caution:
    "수수료, 환전 우대, 이벤트 조건은 수시로 바뀔 수 있습니다. 실제 계좌 개설과 거래 전에는 각 증권사 공식 안내와 금융투자협회 공시를 다시 확인해야 합니다.",
} as const;

const brokerNames: Record<BrokerId, string> = {
  kiwoom: "키움증권",
  toss: "토스증권",
  samsung: "삼성증권",
  mirae: "미래에셋증권",
  "korea-investment": "한국투자증권",
  nh: "NH투자증권",
  kb: "KB증권",
  shinhan: "신한투자증권",
  hana: "하나증권",
  daishin: "대신증권",
};

export const brokerNameById = (id: BrokerId) => brokerNames[id];

export const needsUpdate = (label = "공식 확인 필요", note?: string): FeeValue => ({
  value: null,
  unit: "text",
  label,
  status: "needsUpdate",
  note,
  checkedAt: "2026-04",
});

export const eventOnly = (label: string, note?: string): FeeValue => ({
  value: null,
  unit: "text",
  label,
  status: "eventOnly",
  note,
  checkedAt: "2026-04",
});

export const notSupported = (label = "미지원 또는 확인 필요", note?: string): FeeValue => ({
  value: null,
  unit: "text",
  label,
  status: "notSupported",
  note,
  checkedAt: "2026-04",
});

export const percentFee = (value: number, label: string, note?: string): FeeValue => ({
  value,
  unit: "%",
  label,
  status: "confirmed",
  note,
  checkedAt: "2026-04",
});

export const formatFeeLabel = (fee: FeeValue) => fee.label;

export const formatWon = (value: number) => `${Math.round(value).toLocaleString("ko-KR")}원`;

const standardDomesticRows: Array<Pick<BrokerageFeeRow, "brokerId" | "domesticRecommendation" | "domesticCaution">> = [
  {
    brokerId: "kiwoom",
    domesticRecommendation: "거래 빈도가 높고 HTS 주문·조건검색을 자주 쓰는 투자자가 우선 검토할 만합니다.",
    domesticCaution: "이벤트 수수료가 유관기관 제비용 포함인지, 기간 종료 후 기본 수수료가 얼마인지 확인해야 합니다.",
  },
  {
    brokerId: "toss",
    domesticRecommendation: "모바일 앱 중심으로 소액·초보 거래를 시작하려는 투자자에게 접근성이 좋습니다.",
    domesticCaution: "간편함과 별개로 주문 유형, 이벤트 종료 조건, 해외주식 환전 조건을 따로 확인해야 합니다.",
  },
  {
    brokerId: "samsung",
    domesticRecommendation: "국내외 주식과 연금·ISA를 한 계좌 흐름으로 관리하려는 투자자가 비교할 만합니다.",
    domesticCaution: "계좌 종류별 수수료가 다를 수 있으므로 종합계좌, ISA, 연금계좌 조건을 분리해 봐야 합니다.",
  },
  {
    brokerId: "mirae",
    domesticRecommendation: "해외주식, ETF, 연금 계좌까지 같이 운용하려는 장기 투자자에게 비교 가치가 있습니다.",
    domesticCaution: "해외주식 이벤트와 국내주식 이벤트의 적용 기간·대상 계좌가 다를 수 있습니다.",
  },
  {
    brokerId: "korea-investment",
    domesticRecommendation: "리서치, 국내외 상품 라인업, ISA 연계를 함께 보는 투자자에게 적합 후보입니다.",
    domesticCaution: "온라인·모바일·영업점 주문 수수료가 다를 수 있어 실제 주문 채널 기준으로 확인해야 합니다.",
  },
  {
    brokerId: "nh",
    domesticRecommendation: "은행·증권 연계와 안정적인 종합 서비스를 중시하는 투자자가 비교할 만합니다.",
    domesticCaution: "제휴 계좌, 비대면 계좌, 기존 계좌의 이벤트 적용 여부가 다를 수 있습니다.",
  },
  {
    brokerId: "kb",
    domesticRecommendation: "은행 연계, ISA, 국내외 ETF를 같이 관리하려는 투자자에게 후보가 됩니다.",
    domesticCaution: "환전 우대와 해외주식 수수료는 이벤트 문구보다 실제 적용 화면 확인이 필요합니다.",
  },
  {
    brokerId: "shinhan",
    domesticRecommendation: "은행 앱 연계와 해외주식 접근성을 같이 보는 투자자에게 검토 가치가 있습니다.",
    domesticCaution: "기본 수수료와 이벤트 수수료가 계좌 개설 경로에 따라 달라질 수 있습니다.",
  },
  {
    brokerId: "hana",
    domesticRecommendation: "하나금융 계좌 연계와 해외 투자 서비스를 함께 쓰려는 투자자가 비교할 만합니다.",
    domesticCaution: "환전 우대율과 적용 통화, 자동환전 스프레드는 이벤트 상세 조건을 확인해야 합니다.",
  },
  {
    brokerId: "daishin",
    domesticRecommendation: "HTS 기반 주문과 전통 증권사 서비스를 선호하는 투자자가 후보로 볼 수 있습니다.",
    domesticCaution: "모바일 이벤트와 HTS·영업점 수수료가 다를 수 있으므로 주문 채널을 먼저 정해야 합니다.",
  },
];

export const DOMESTIC_FEE_ROWS: BrokerageFeeRow[] = standardDomesticRows.map((row) => ({
  brokerId: row.brokerId,
  brokerName: brokerNameById(row.brokerId),
  domesticBaseFee: needsUpdate("기본 수수료표 확인 필요", "온라인·모바일·영업점 수수료가 다를 수 있습니다."),
  domesticEventFee: eventOnly("비대면 이벤트 확인 필요", "신규·휴면·타사대체입고 등 대상 조건이 붙을 수 있습니다."),
  includesAgencyFee: "unknown",
  lifetimeBenefit: "conditional",
  domesticRecommendation: row.domesticRecommendation,
  domesticCaution: row.domesticCaution,
}));

export const OVERSEAS_FEE_ROWS: OverseasFeeRow[] = [
  ["kiwoom", 4, "미국주식 거래 화면과 환전 우대 적용 시간이 중요합니다."],
  ["toss", 4, "소수점·모바일 경험은 편하지만 고급 주문 조건은 따로 확인해야 합니다."],
  ["samsung", 4, "연금·ISA와 해외 ETF를 함께 보는 경우 계좌별 조건을 확인해야 합니다."],
  ["mirae", 5, "해외주식 장기투자자는 수수료보다 환전·배당·세금 안내까지 같이 봐야 합니다."],
  ["korea-investment", 4, "해외주식 이벤트 적용 대상과 자동환전 조건을 구분해야 합니다."],
  ["nh", 3, "은행 연계 편의성과 실제 해외주식 체결 비용을 함께 비교해야 합니다."],
  ["kb", 3, "환전 우대율이 높아 보여도 적용 통화와 시간대 조건을 확인해야 합니다."],
  ["shinhan", 3, "모바일 해외주식 이벤트와 기본 수수료표를 동시에 확인해야 합니다."],
  ["hana", 3, "은행 연계 환전 조건과 증권 계좌 내 환전 조건이 다를 수 있습니다."],
  ["daishin", 3, "해외주식 서비스 범위와 프리·애프터마켓 지원 범위를 확인해야 합니다."],
].map(([brokerId, score, caution]) => ({
  brokerId: brokerId as BrokerId,
  brokerName: brokerNameById(brokerId as BrokerId),
  usStockFee: needsUpdate("미국주식 수수료 확인 필요", "이벤트 수수료와 기본 수수료를 분리해 확인하세요."),
  usEtfSameFee: "unknown",
  fxDiscountRate: needsUpdate("환전 우대 확인 필요", "우대율, 스프레드, 자동환전 조건을 함께 봐야 합니다."),
  preAfterMarket: brokerId === "toss" ? "limited" : "unknown",
  fractionalTrading: brokerId === "toss" || brokerId === "mirae" || brokerId === "samsung" ? "limited" : "unknown",
  recommendationScore: score as OverseasFeeRow["recommendationScore"],
  caution: caution as string,
}));

export const CREDIT_INTEREST_ROWS: CreditInterestRow[] = (Object.keys(brokerNames) as BrokerId[]).map((brokerId) => ({
  brokerId,
  brokerName: brokerNameById(brokerId),
  day1to7: needsUpdate("1~7일 이자율 확인 필요"),
  day8to15: needsUpdate("8~15일 이자율 확인 필요"),
  day16to30: needsUpdate("16~30일 이자율 확인 필요"),
  day31to60: needsUpdate("31~60일 이자율 확인 필요"),
  day90Plus: needsUpdate("90일 초과 이자율 확인 필요"),
  sourceNote: "신용공여 이자율은 구간별·등급별·담보유형별로 달라질 수 있어 금융투자협회와 증권사 공시 확인이 필요합니다.",
}));

export const FEATURE_ROWS: BrokerFeatureRow[] = [
  {
    brokerId: "kiwoom",
    brokerName: "키움증권",
    htsStrength: "활발한 국내주식 주문과 HTS 활용",
    mtsStrength: "국내주식 거래 중심",
    isaSupport: "limited",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "unknown",
    bestFor: ["domestic-trader", "margin-user"],
    caution: "초보자는 주문 화면과 신용거래 설정을 충분히 익힌 뒤 이용해야 합니다.",
  },
  {
    brokerId: "toss",
    brokerName: "토스증권",
    htsStrength: "HTS보다 모바일 중심",
    mtsStrength: "간단한 탐색과 소액 투자",
    isaSupport: "unknown",
    domesticFractional: "unknown",
    overseasFractional: "limited",
    autoInvestment: "limited",
    bestFor: ["mobile-beginner", "auto-investor"],
    caution: "간편한 앱일수록 이벤트 조건과 주문 제한을 놓치기 쉽습니다.",
  },
  {
    brokerId: "samsung",
    brokerName: "삼성증권",
    htsStrength: "종합자산관리와 리서치",
    mtsStrength: "국내외 상품 탐색",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "limited",
    autoInvestment: "limited",
    bestFor: ["us-long-term", "etf-long-term", "dividend-investor"],
    caution: "연금·ISA·종합계좌의 수수료와 매매 가능 상품이 다를 수 있습니다.",
  },
  {
    brokerId: "mirae",
    brokerName: "미래에셋증권",
    htsStrength: "해외주식과 ETF 라인업",
    mtsStrength: "글로벌 투자 기능",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "limited",
    autoInvestment: "limited",
    bestFor: ["us-long-term", "etf-long-term", "dividend-investor", "auto-investor"],
    caution: "해외주식은 수수료보다 환전·배당세·양도세 관리가 더 클 수 있습니다.",
  },
  {
    brokerId: "korea-investment",
    brokerName: "한국투자증권",
    htsStrength: "리서치와 종합 상품",
    mtsStrength: "국내외 투자 균형",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "limited",
    autoInvestment: "limited",
    bestFor: ["etf-long-term", "dividend-investor"],
    caution: "이벤트 적용 계좌와 기존 계좌의 수수료가 다를 수 있습니다.",
  },
  {
    brokerId: "nh",
    brokerName: "NH투자증권",
    htsStrength: "은행·증권 연계",
    mtsStrength: "종합 자산 조회",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "unknown",
    bestFor: ["etf-long-term"],
    caution: "제휴 계좌 조건과 직접 개설 계좌 조건을 구분해야 합니다.",
  },
  {
    brokerId: "kb",
    brokerName: "KB증권",
    htsStrength: "은행 연계와 국내외 상품",
    mtsStrength: "통합 금융 앱 연계",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "limited",
    bestFor: ["etf-long-term", "dividend-investor"],
    caution: "은행 환전 우대와 증권 해외주식 환전 조건을 따로 확인해야 합니다.",
  },
  {
    brokerId: "shinhan",
    brokerName: "신한투자증권",
    htsStrength: "은행 연계 서비스",
    mtsStrength: "모바일 통합 금융",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "limited",
    bestFor: ["mobile-beginner", "dividend-investor"],
    caution: "계좌 개설 경로별 혜택 차이를 먼저 확인해야 합니다.",
  },
  {
    brokerId: "hana",
    brokerName: "하나증권",
    htsStrength: "금융그룹 연계",
    mtsStrength: "은행·증권 연결",
    isaSupport: "yes",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "unknown",
    bestFor: ["dividend-investor"],
    caution: "환전·해외주식 이벤트의 적용 통화와 대상 계좌를 확인해야 합니다.",
  },
  {
    brokerId: "daishin",
    brokerName: "대신증권",
    htsStrength: "HTS 기반 전통 거래",
    mtsStrength: "기본 거래 기능",
    isaSupport: "limited",
    domesticFractional: "unknown",
    overseasFractional: "unknown",
    autoInvestment: "unknown",
    bestFor: ["domestic-trader"],
    caution: "주문 채널별 수수료와 이벤트 대상 여부를 분리해 확인해야 합니다.",
  },
];

export const BROKER_RECOMMENDATIONS: BrokerRecommendation[] = [
  {
    investorType: "domestic-trader",
    label: "국내주식 매매가 많은 투자자",
    keyCriteria: "국내주식 온라인 수수료, 유관기관 제비용 포함 여부, HTS 안정성",
    brokerCandidates: ["kiwoom", "daishin", "samsung"],
    reason: "거래 빈도가 높으면 앱 편의성보다 체결 화면, 주문 기능, 이벤트 종료 후 기본 수수료가 중요합니다.",
    caution: "거래가 잦을수록 작은 수수료 차이보다 잘못된 주문, 과매매, 세금 관리 누락이 더 큰 손실로 이어질 수 있습니다.",
  },
  {
    investorType: "mobile-beginner",
    label: "모바일 초보 투자자",
    keyCriteria: "앱 이해도, 소액 투자, 이벤트 조건의 단순성",
    brokerCandidates: ["toss", "shinhan", "kb"],
    reason: "처음 시작한다면 복잡한 HTS보다 주문 과정이 명확하고 계좌·환전 상태를 쉽게 확인할 수 있는 앱이 유리합니다.",
    caution: "간편한 앱에서도 신용거래, 해외주식 자동환전, 이벤트 종료 조건은 반드시 별도로 확인해야 합니다.",
  },
  {
    investorType: "us-long-term",
    label: "미국주식 장기 투자자",
    keyCriteria: "미국주식 수수료, 환전 우대, 배당·양도세 관리",
    brokerCandidates: ["mirae", "samsung", "korea-investment"],
    reason: "장기 투자자는 매매 수수료보다 환전 스프레드, 배당 입금, 세금 리포트, 프리·애프터마켓 지원이 누적 비용을 좌우합니다.",
    caution: "무료 수수료 이벤트가 있어도 환전 비용과 양도세 신고 편의성은 별도입니다.",
  },
  {
    investorType: "etf-long-term",
    label: "ETF 장기 투자자",
    keyCriteria: "ISA·연금 계좌 지원, ETF 매매 가능 범위, 수수료보다 계좌 구조",
    brokerCandidates: ["samsung", "mirae", "nh", "kb"],
    reason: "ETF 장기 투자는 증권사 수수료보다 ISA·연금저축·IRP 계좌에서 운용 가능한 상품과 절세 구조가 더 중요할 수 있습니다.",
    caution: "연금계좌는 중도 인출 제한과 상품 제한이 있으므로 일반 계좌와 같은 기준으로 보면 안 됩니다.",
  },
  {
    investorType: "margin-user",
    label: "신용거래·담보대출 이용자",
    keyCriteria: "신용공여 이자율, 반대매매 기준, 담보 유지비율",
    brokerCandidates: ["kiwoom", "samsung", "korea-investment"],
    reason: "신용거래는 매매 수수료보다 이자율과 반대매매 리스크가 훨씬 큽니다.",
    caution: "이 영역은 추천이 아니라 위험 확인 영역입니다. 금리 상승, 주가 급락, 담보 부족이 겹치면 손실이 급격히 커질 수 있습니다.",
  },
  {
    investorType: "dividend-investor",
    label: "배당·달러 현금흐름 투자자",
    keyCriteria: "배당 입금, 환전, 세금 자료, 해외 ETF 지원",
    brokerCandidates: ["mirae", "samsung", "kb", "hana"],
    reason: "배당 투자자는 거래 수수료보다 배당 입금 내역, 원천징수, 환전 흐름을 꾸준히 추적할 수 있어야 합니다.",
    caution: "미국 배당주는 배당소득세, 금융소득종합과세 가능성, 환율 변동을 함께 봐야 합니다.",
  },
  {
    investorType: "auto-investor",
    label: "자동투자·소수점 투자자",
    keyCriteria: "자동매수, 소수점, 최소 주문 금액, 예약 주문",
    brokerCandidates: ["toss", "mirae", "samsung", "korea-investment"],
    reason: "매달 정액으로 투자한다면 수수료보다 자동화 범위와 주문 누락 없이 실행되는 구조가 중요합니다.",
    caution: "소수점·자동투자는 체결 가격, 환전 시점, 주문 취소 가능 시간 등 일반 주문과 다른 조건이 붙을 수 있습니다.",
  },
];

export const FEE_SIMULATION_ROWS: FeeSimulationRow[] = [
  {
    id: "small",
    label: "월 1회 100만원",
    annualTradeCount: 12,
    tradeAmount: 1_000_000,
    lowFeeRate: 0.003,
    highFeeRate: 0.015,
  },
  {
    id: "active",
    label: "월 10회 300만원",
    annualTradeCount: 120,
    tradeAmount: 3_000_000,
    lowFeeRate: 0.003,
    highFeeRate: 0.015,
  },
  {
    id: "large",
    label: "분기 1회 3,000만원",
    annualTradeCount: 4,
    tradeAmount: 30_000_000,
    lowFeeRate: 0.003,
    highFeeRate: 0.015,
  },
];

export const EVENT_TRAPS = [
  {
    title: "무료 수수료의 범위",
    body: "무료 문구가 있어도 유관기관 제비용, SEC fee, ADR fee, 환전 스프레드가 별도일 수 있습니다.",
  },
  {
    title: "평생 혜택의 조건",
    body: "평생 우대는 신규 고객, 비대면 계좌, 이벤트 신청, 특정 앱 주문처럼 조건이 붙는 경우가 많습니다.",
  },
  {
    title: "이벤트 종료 후 기본 수수료",
    body: "1년 무료 이후 기본 수수료로 돌아가면 거래 빈도가 높은 투자자는 비용이 크게 달라질 수 있습니다.",
  },
  {
    title: "환전 우대와 실제 환율",
    body: "환전 우대율이 높아도 기준 환율, 스프레드, 자동환전 시간대가 달라 실제 체감 비용은 달라집니다.",
  },
];

export const CHECKLIST_ITEMS = [
  "국내주식 기본 수수료와 이벤트 수수료를 분리해 확인",
  "유관기관 제비용 포함 여부 확인",
  "해외주식 수수료와 환전 스프레드를 함께 비교",
  "프리마켓·애프터마켓·소수점 투자 지원 범위 확인",
  "ISA·연금계좌·일반계좌의 상품과 수수료 차이 확인",
  "신용거래 사용 전 이자율, 반대매매, 담보유지비율 확인",
];

export const SBF_SOURCE_LINKS = [
  { label: "금융투자협회 전자공시", href: "https://freesis.kofia.or.kr/", type: "official" },
  { label: "금융투자협회", href: "https://www.kofia.or.kr/", type: "official" },
  { label: "키움증권", href: "https://www.kiwoom.com/", type: "broker" },
  { label: "토스증권", href: "https://tossinvest.com/", type: "broker" },
  { label: "삼성증권", href: "https://www.samsungpop.com/", type: "broker" },
  { label: "미래에셋증권", href: "https://securities.miraeasset.com/", type: "broker" },
  { label: "한국투자증권", href: "https://securities.koreainvestment.com/", type: "broker" },
];

export const SBF_RELATED_LINKS = [
  { href: "/tools/stock-breakeven-calculator/", label: "주식 물타기·손익분기 계산기" },
  { href: "/tools/domestic-stock-capital-gains-tax/", label: "국내주식 양도세 계산기" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 계산기" },
  { href: "/reports/etf-vs-direct-stock-10year-2026/", label: "ETF vs 직접투자 10년 비교" },
  { href: "/reports/retirement-pension-dc-db-irp-2026/", label: "퇴직연금 DC·DB·IRP 비교" },
];

export const SBF_FAQ: BrokerageFaqItem[] = [
  {
    q: "증권사 수수료가 0원이면 정말 비용이 없나요?",
    a: "아닙니다. 국내주식은 유관기관 제비용, 해외주식은 환전 스프레드와 현지 제비용이 남을 수 있습니다. 무료 문구는 적용 범위와 기간을 확인해야 합니다.",
  },
  {
    q: "국내주식만 하면 어떤 기준을 먼저 보면 되나요?",
    a: "거래 빈도가 높다면 이벤트 종료 후 기본 수수료, 유관기관 제비용 포함 여부, 주문 화면 안정성을 먼저 보세요. 거래가 적다면 앱 편의성과 계좌 관리 편의성이 더 중요할 수 있습니다.",
  },
  {
    q: "미국주식 투자자는 수수료와 환전 중 무엇이 더 중요한가요?",
    a: "둘 다 중요하지만 장기 투자자는 환전 스프레드, 배당 입금, 양도세 자료 제공, 프리·애프터마켓 지원까지 같이 봐야 합니다.",
  },
  {
    q: "신용거래 수수료도 같이 비교해야 하나요?",
    a: "신용거래는 매매 수수료보다 이자율과 반대매매 리스크가 더 큽니다. 신용공여 이자율은 구간별로 달라지므로 반드시 공식 공시를 확인해야 합니다.",
  },
  {
    q: "이 리포트가 특정 증권사를 추천하나요?",
    a: "아닙니다. 투자 성향별로 확인할 후보와 기준을 정리한 것입니다. 실제 선택은 최신 공식 수수료표, 이벤트 조건, 본인의 거래 방식에 따라 달라집니다.",
  },
];
