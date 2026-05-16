export type ExchangeType = "domestic" | "global";
export type SupportLevel = "yes" | "limited" | "no";

export interface CoinExchange {
  id: string;
  name: string;
  nameEn: string;
  type: ExchangeType;
  makerFee: string;
  takerFee: string;
  feeNote: string;
  wonDeposit: boolean;
  wonWithdrawal: boolean;
  coinCount: string;
  bankPartner: string;
  kyc: boolean;
  twoFa: boolean;
  mobile: boolean;
  koreanSupport: SupportLevel;
  regulated: SupportLevel;
  pros: string[];
  cons: string[];
  bestFor: string;
  officialUrl: string;
  updatedAt: string;
}

export interface ExchangeRecommendation {
  situation: string;
  exchange: string;
  reason: string;
}

export interface FeeSimulationRow {
  exchange: string;
  feeRate: number;
  feeLabel: string;
  monthlyFee: number;
  annualFee: number;
  note: string;
}

export interface SourceLink {
  label: string;
  href: string;
}

export const CEC_META = {
  slug: "coin-exchange-comparison-2026",
  title: "코인 거래소 비교 2026",
  seoTitle: "코인 거래소 비교 2026 — 업비트·빗썸·코인원·바이낸스 수수료·기능 정리",
  description:
    "2026년 국내외 주요 코인 거래소 수수료, 원화 입출금, 상장 코인 수, 보안 기능, 상황별 추천을 한눈에 비교합니다.",
  updatedAt: "2026-05-11",
  baseLabel: "2026년 5월 공식 수수료표·고객센터 공개 안내 확인 기준",
  caution:
    "수수료, 상장 코인, 입출금 정책은 수시로 바뀔 수 있습니다. 실제 가입과 거래 전에는 각 거래소 공식 페이지에서 최신 조건을 다시 확인해야 합니다.",
} as const;

export const EXCHANGES: CoinExchange[] = [
  {
    id: "upbit",
    name: "업비트",
    nameEn: "Upbit",
    type: "domestic",
    makerFee: "0.05%",
    takerFee: "0.05%",
    feeNote: "원화마켓 일반 거래 수수료 기준",
    wonDeposit: true,
    wonWithdrawal: true,
    coinCount: "약 200종 이상",
    bankPartner: "케이뱅크",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "yes",
    regulated: "yes",
    pros: ["국내 최대 수준의 유동성", "앱과 주문 화면이 직관적", "원화 입출금 동선이 익숙함"],
    cons: ["국내 최저 수수료는 아님", "선물·레버리지 거래 미지원"],
    bestFor: "코인을 처음 시작하거나 원화 입출금 안정성을 중시하는 투자자",
    officialUrl: "https://support.upbit.com/",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "bithumb",
    name: "빗썸",
    nameEn: "Bithumb",
    type: "domestic",
    makerFee: "0.04%",
    takerFee: "0.04%",
    feeNote: "수수료 쿠폰 적용 시 0.04%, 미적용·만료 시 조건 변경 가능",
    wonDeposit: true,
    wonWithdrawal: true,
    coinCount: "약 200종",
    bankPartner: "NH농협은행",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "yes",
    regulated: "yes",
    pros: ["국내 대형 거래소", "수수료 쿠폰 적용 시 낮은 수수료", "이벤트·프로모션이 잦은 편"],
    cons: ["쿠폰·이벤트 조건 확인 필요", "앱과 메뉴가 초보자에게 복잡할 수 있음"],
    bestFor: "수수료와 이벤트를 적극적으로 확인하는 중급 투자자",
    officialUrl: "https://support.bithumb.com/hc/ko/articles/51037001822745",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "coinone",
    name: "코인원",
    nameEn: "Coinone",
    type: "domestic",
    makerFee: "기본 0.20%",
    takerFee: "기본 0.20%",
    feeNote: "Open API 거래는 0.02% 안내. 일반 앱 거래와 구분 필요",
    wonDeposit: true,
    wonWithdrawal: true,
    coinCount: "약 200종",
    bankPartner: "우리은행",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "yes",
    regulated: "yes",
    pros: ["Open API 기준 낮은 수수료", "국내 규제 체계 내 운영", "깔끔한 거래 화면"],
    cons: ["일반 수수료와 API 수수료 차이 큼", "업비트 대비 유동성은 낮을 수 있음"],
    bestFor: "수수료 조건을 직접 확인하고 자동매매·API까지 고려하는 투자자",
    officialUrl: "https://coinone.co.kr/support/fee-guide",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "korbit",
    name: "코빗",
    nameEn: "Korbit",
    type: "domestic",
    makerFee: "0.05%",
    takerFee: "0.05%",
    feeNote: "수수료 플랜과 이벤트에 따라 달라질 수 있음",
    wonDeposit: true,
    wonWithdrawal: true,
    coinCount: "약 50종",
    bankPartner: "신한은행",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "yes",
    regulated: "yes",
    pros: ["국내 초기 거래소로 운영 이력 보유", "주요 코인 중심 구성", "보수적 투자자에게 단순한 선택지"],
    cons: ["상장 코인 수가 적은 편", "거래량이 대형 거래소보다 낮을 수 있음"],
    bestFor: "BTC·ETH 등 주요 코인 위주로 거래하는 보수적 투자자",
    officialUrl: "https://www.korbit.co.kr/",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "binance",
    name: "바이낸스",
    nameEn: "Binance",
    type: "global",
    makerFee: "0.10%",
    takerFee: "0.10%",
    feeNote: "VIP 0 현물 기본 구간 예시, BNB 수수료 할인 가능",
    wonDeposit: false,
    wonWithdrawal: false,
    coinCount: "350종 이상",
    bankPartner: "원화 직접 입출금 불가",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "limited",
    regulated: "limited",
    pros: ["세계 최대급 유동성", "알트코인 선택지가 넓음", "선물·레버리지·Web3 기능 제공"],
    cons: ["원화 직접 입출금 불가", "국내 규제 체계 밖이라 분쟁 대응이 제한적"],
    bestFor: "국내 미상장 알트코인이나 글로벌 파생상품을 보조적으로 쓰는 중급 이상 투자자",
    officialUrl: "https://www.binance.com/en/fee/trading",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "coinbase",
    name: "코인베이스",
    nameEn: "Coinbase",
    type: "global",
    makerFee: "0.40% 예시",
    takerFee: "0.60% 예시",
    feeNote: "Coinbase Advanced는 계정·거래량·주문 미리보기 기준으로 수수료 표시",
    wonDeposit: false,
    wonWithdrawal: false,
    coinCount: "약 200종",
    bankPartner: "원화 직접 입출금 불가",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "no",
    regulated: "limited",
    pros: ["미국 상장사로 규제 준수 이미지 강함", "기관 투자자 친화적", "주요 코인 중심"],
    cons: ["수수료가 높게 나올 수 있음", "한국어 고객지원과 원화 입출금이 불편"],
    bestFor: "달러 기반 해외 거래와 미국 규제 체계를 중시하는 투자자",
    officialUrl: "https://help.coinbase.com/en/coinbase/trading-and-funding/advanced-trade/advanced-trade-fees",
    updatedAt: CEC_META.updatedAt,
  },
  {
    id: "okx",
    name: "OKX",
    nameEn: "OKX",
    type: "global",
    makerFee: "0.08%",
    takerFee: "0.10%",
    feeNote: "VIP 0 현물 기본 구간 예시, 등급·토큰 보유에 따라 변동",
    wonDeposit: false,
    wonWithdrawal: false,
    coinCount: "약 300종",
    bankPartner: "원화 직접 입출금 불가",
    kyc: true,
    twoFa: true,
    mobile: true,
    koreanSupport: "limited",
    regulated: "limited",
    pros: ["바이낸스 대안으로 넓은 상품군", "선물·옵션·Web3 지갑 지원", "글로벌 유동성 보유"],
    cons: ["원화 입출금 불가", "국내 사용자 보호 체계는 제한적"],
    bestFor: "해외 대형 거래소를 보조로 쓰고 싶은 중급 이상 투자자",
    officialUrl: "https://www.okx.com/fees",
    updatedAt: CEC_META.updatedAt,
  },
];

export const SUMMARY_CARDS = [
  {
    title: "처음 시작",
    value: "국내 원화 거래소",
    body: "업비트·빗썸·코인원·코빗은 원화 입출금과 한국어 고객지원 흐름이 있어 입문자에게 이해가 쉽습니다.",
  },
  {
    title: "수수료 확인",
    value: "기본·쿠폰·API 분리",
    body: "빗썸 쿠폰, 코인원 Open API처럼 표시 수수료의 적용 조건이 달라 반드시 공식 안내를 확인해야 합니다.",
  },
  {
    title: "알트코인 선택지",
    value: "해외 거래소 넓음",
    body: "바이낸스·OKX는 상장 코인과 파생상품이 많지만 원화 입출금과 국내 분쟁 대응은 불리합니다.",
  },
  {
    title: "보안 우선",
    value: "FIU·2FA 확인",
    body: "국내 이용자는 수수료보다 FIU 신고 여부, 2단계 인증, 출금 화이트리스트부터 확인하는 편이 안전합니다.",
  },
];

export const RECOMMENDATIONS: ExchangeRecommendation[] = [
  {
    situation: "코인 처음 시작",
    exchange: "업비트",
    reason: "국내 유동성이 크고 앱 동선이 단순합니다. 원화 입출금, 주문, 출금 제한 같은 기본 흐름을 익히기 좋습니다.",
  },
  {
    situation: "수수료를 꼼꼼히 줄이고 싶다",
    exchange: "빗썸 또는 코인원",
    reason: "빗썸은 쿠폰 적용 수수료, 코인원은 Open API 수수료 조건을 확인할 가치가 있습니다. 다만 일반 거래와 이벤트 조건을 분리해서 봐야 합니다.",
  },
  {
    situation: "BTC·ETH 외 알트코인 거래",
    exchange: "바이낸스 또는 OKX",
    reason: "국내 미상장 코인 선택지가 넓습니다. 대신 원화 직접 입출금이 되지 않아 스테이블코인 전송, 네트워크 수수료, 트래블룰을 함께 관리해야 합니다.",
  },
  {
    situation: "보안·규제 안전성 우선",
    exchange: "국내 VASP 거래소",
    reason: "국내 거래소는 FIU 신고와 실명계좌 체계 안에서 운영됩니다. 큰 금액을 보관한다면 수수료보다 규제 체계와 고객센터 접근성을 먼저 확인하세요.",
  },
  {
    situation: "선물·레버리지 필요",
    exchange: "바이낸스 또는 OKX",
    reason: "국내 거래소는 현물 중심입니다. 파생상품은 손실이 빠르게 커질 수 있어 보조 계정과 제한된 금액으로만 검토하는 편이 보수적입니다.",
  },
  {
    situation: "주요 코인 장기 보유",
    exchange: "업비트·코빗·코인원",
    reason: "BTC·ETH 위주라면 상장 코인 수보다 출금 안정성, 2FA, 콜드월렛 보관, 고객센터 대응을 우선 보는 것이 좋습니다.",
  },
];

export const CHECKLIST_ITEMS = [
  "원화 직접 입출금이 필요한지 먼저 결정",
  "거래하려는 코인이 실제로 상장되어 있는지 확인",
  "표시 수수료가 기본값인지 쿠폰·API·VIP 조건인지 구분",
  "FIU 신고, KYC, 2FA, 출금 화이트리스트 지원 여부 확인",
  "해외 거래소 이용 시 트래블룰, 네트워크 수수료, 입금 태그 확인",
  "큰 금액은 거래소 장기 보관보다 개인 지갑 분산 보관 검토",
];

export const FEE_SIMULATION_ROWS: FeeSimulationRow[] = [
  { exchange: "빗썸 쿠폰", feeRate: 0.0004, feeLabel: "0.04%", monthlyFee: 400, annualFee: 4800, note: "쿠폰 적용 예시" },
  { exchange: "업비트·코빗", feeRate: 0.0005, feeLabel: "0.05%", monthlyFee: 500, annualFee: 6000, note: "원화마켓 일반 예시" },
  { exchange: "바이낸스", feeRate: 0.001, feeLabel: "0.10%", monthlyFee: 1000, annualFee: 12000, note: "현물 VIP 0 예시" },
  { exchange: "OKX", feeRate: 0.001, feeLabel: "0.10%", monthlyFee: 1000, annualFee: 12000, note: "taker 기준 예시" },
  { exchange: "코인원 기본", feeRate: 0.002, feeLabel: "0.20%", monthlyFee: 2000, annualFee: 24000, note: "일반 거래 기본 예시" },
  { exchange: "코인베이스", feeRate: 0.006, feeLabel: "0.60%", monthlyFee: 6000, annualFee: 72000, note: "taker 예시" },
];

export const SOURCE_LINKS: SourceLink[] = [
  { label: "업비트 고객센터", href: "https://support.upbit.com/" },
  { label: "빗썸 수수료 안내", href: "https://support.bithumb.com/hc/ko/articles/51037001822745" },
  { label: "코인원 수수료 안내", href: "https://coinone.co.kr/support/fee-guide" },
  { label: "바이낸스 수수료표", href: "https://www.binance.com/en/fee/trading" },
  { label: "Coinbase Advanced 수수료", href: "https://help.coinbase.com/en/coinbase/trading-and-funding/advanced-trade/advanced-trade-fees" },
  { label: "OKX 수수료표", href: "https://www.okx.com/fees" },
  { label: "금융정보분석원", href: "https://www.kofiu.go.kr/" },
];

export const RELATED_LINKS = [
  { href: "/tools/coin-dca-calculator/", label: "코인 DCA 계산기" },
  { href: "/tools/coin-tax-calculator/", label: "가상자산 세금 계산기" },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인·금·S&P500 10년 비교" },
  { href: "/reports/stock-brokerage-fee-comparison-2026/", label: "증권사 수수료 비교" },
  { href: "/tools/us-stock-exchange-profit-calculator/", label: "미국주식 환차손익 계산기" },
];

export const CEC_FAQ = [
  {
    question: "업비트와 빗썸 중 어디가 더 좋은가요?",
    answer:
      "초보자는 앱 사용성과 유동성이 좋은 업비트를 먼저 검토하기 쉽고, 수수료와 이벤트를 적극적으로 확인한다면 빗썸도 후보가 됩니다. 다만 빗썸 0.04%는 쿠폰 조건과 유효기간을 확인해야 하므로 거래 전 공식 안내를 다시 봐야 합니다.",
  },
  {
    question: "코인 거래소 수수료는 어떻게 계산하나요?",
    answer:
      "거래 수수료는 체결 금액에 수수료율을 곱해 계산합니다. 예를 들어 100만원을 0.05% 수수료율로 매수하면 수수료는 500원입니다. 매수와 매도 양쪽에 수수료가 붙을 수 있으므로 왕복 비용으로 봐야 합니다.",
  },
  {
    question: "코인원 수수료가 0.02%인가요?",
    answer:
      "코인원 공식 안내 기준으로 일반 KRW 거래 기본 수수료와 Open API 거래 수수료가 다르게 표시됩니다. 0.02%는 Open API 거래 조건으로 안내되므로 일반 앱 거래자가 그대로 적용된다고 보면 안 됩니다.",
  },
  {
    question: "국내 거래소에 없는 알트코인은 어떻게 거래하나요?",
    answer:
      "보통 국내 거래소에서 USDT 등으로 이동 가능한 자산을 확보한 뒤 해외 거래소 지갑으로 전송해 거래합니다. 이 과정에는 네트워크 수수료, 트래블룰 확인, 입금 주소와 태그 입력 위험이 있으므로 소액 테스트 전송이 필요합니다.",
  },
  {
    question: "해외 거래소를 한국에서 사용해도 되나요?",
    answer:
      "해외 거래소는 원화 실명계좌와 국내 VASP 체계 밖에서 운영되는 경우가 많아 법적 보호와 고객센터 대응이 제한될 수 있습니다. 국내 투자자는 국내 거래소를 주력으로 두고 해외 거래소는 보조적으로 쓰는 경우가 많습니다.",
  },
  {
    question: "거래소 해킹이나 피싱은 어떻게 줄이나요?",
    answer:
      "거래소 앱을 공식 경로로 설치하고, 앱 기반 2FA를 설정하고, 출금 주소 화이트리스트를 등록하세요. 장기 보유 물량은 거래소에 모두 보관하기보다 개인 지갑 분산 보관을 검토하는 것이 좋습니다.",
  },
  {
    question: "거래소마다 같은 코인 가격이 다른 이유는 무엇인가요?",
    answer:
      "거래소마다 독립된 주문 장부와 유동성을 갖기 때문입니다. 가격 차이를 이용한 차익거래도 가능하지만 수수료, 전송 시간, 출금 제한을 감안하면 일반 투자자가 안정적으로 수익화하기는 어렵습니다.",
  },
  {
    question: "거래소를 여러 개 사용해도 되나요?",
    answer:
      "가능합니다. 다만 세금 신고와 자금 흐름 기록이 복잡해집니다. 복수 거래소를 쓰면 매수·매도 내역, 코인 간 교환, 거래소 간 전송 기록을 별도로 보관해야 합니다.",
  },
];
