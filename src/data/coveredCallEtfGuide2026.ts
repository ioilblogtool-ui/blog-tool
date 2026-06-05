// ============================================================
// coveredCallEtfGuide2026.ts
// 커버드콜 ETF 장단점 완전 정리 데이터
// ============================================================

export interface ProConItem {
  emoji: string;
  title: string;
  detail: string;
  badge?: string;
}

export interface EtfCompareRow {
  ticker: string;
  name: string;
  market: "국내" | "미국";
  annualDistRate: number;
  strategy: string;
  upCap: boolean;       // 상승 제한 여부
  riskLevel: "낮음" | "중간" | "높음" | "매우높음";
  taxRate: number;
  note: string;
}

export interface InvestorType {
  icon: string;
  type: string;
  suitable: boolean;
  reason: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

// ── 커버드콜 전략 설명 ────────────────────────────────────
export const STRATEGY_STEPS = [
  { step: "①", title: "ETF가 주식 보유", desc: "S&P500·나스닥100 등 지수 기반 주식 포트폴리오를 보유합니다." },
  { step: "②", title: "콜옵션 매도", desc: "보유 주식에 대한 콜옵션(살 권리)을 매도해 옵션 프리미엄을 수취합니다." },
  { step: "③", title: "프리미엄을 분배금으로", desc: "수취한 옵션 프리미엄을 투자자에게 월 분배금으로 지급합니다." },
  { step: "④", title: "상승 수익은 제한", desc: "주가가 행사가 이상 오르면 그 초과 상승분은 옵션 매수자에게 귀속됩니다." },
];

// ── 장점 ─────────────────────────────────────────────────
export const PROS: ProConItem[] = [
  {
    emoji: "💰",
    title: "높은 월 분배율",
    detail: "연 8~60%의 높은 분배율로 매월 현금 흐름을 만들 수 있습니다. 일반 배당주(연 2~4%) 대비 훨씬 높은 분배 소득이 가능합니다.",
    badge: "핵심 장점",
  },
  {
    emoji: "📅",
    title: "매월 분배금 지급",
    detail: "대부분의 커버드콜 ETF는 매월(일부는 매주) 분배금을 지급합니다. 퇴직 후 월생활비나 현금 흐름 창출에 활용하기 좋습니다.",
  },
  {
    emoji: "📉",
    title: "변동성 완화 효과",
    detail: "옵션 프리미엄 수취로 하락장에서 일반 지수 ETF 대비 낙폭이 작습니다. 동일한 조건에서 S&P500보다 손실이 줄어드는 효과가 있습니다.",
  },
  {
    emoji: "🎯",
    title: "횡보장에서 강함",
    detail: "주가가 옆으로 움직이는 횡보장에서 일반 지수 ETF는 수익이 없지만, 커버드콜은 옵션 프리미엄으로 꾸준히 분배금을 받을 수 있습니다.",
  },
  {
    emoji: "🏦",
    title: "DC형 퇴직연금 편입 가능",
    detail: "국내 상장 커버드콜 ETF는 퇴직연금 DC형 계좌에 편입 가능합니다. (레버리지·인버스 제외) 노후 대비에도 활용할 수 있습니다.",
  },
];

// ── 단점 ─────────────────────────────────────────────────
export const CONS: ProConItem[] = [
  {
    emoji: "🚫",
    title: "상승장 수익 제한",
    detail: "주가가 크게 오를 때 행사가 이상 상승분은 옵션 매수자에게 귀속됩니다. 2020~2021년 같은 강세장에서는 일반 ETF가 훨씬 유리합니다.",
    badge: "핵심 단점",
  },
  {
    emoji: "📉",
    title: "원금 손실은 그대로",
    detail: "하락장에서 분배금이 완충 역할을 하지만, 주가 하락에 따른 원금 손실은 그대로 발생합니다. '분배금을 받으며 원금이 녹는' 상황이 생길 수 있습니다.",
    badge: "주의",
  },
  {
    emoji: "📊",
    title: "분배율 변동성",
    detail: "시장 변동성이 낮아지면 옵션 프리미엄이 줄어 분배율도 감소합니다. 표시된 분배율은 과거 기준이며 미래 분배가 보장되지 않습니다.",
  },
  {
    emoji: "💸",
    title: "미국 ETF 세금 부담",
    detail: "미국 상장 커버드콜 ETF(CONY·JEPI 등)는 배당소득에 22% 세금이 부과됩니다. 국내 ETF(15.4%)보다 세금 부담이 크고, 분배금이 매달 과세 소득으로 잡힙니다.",
  },
  {
    emoji: "⚠️",
    title: "단일 종목형은 위험 매우 높음",
    detail: "CONY(코인베이스)·AMDY(AMD) 같은 단일 종목 커버드콜은 분배율이 40~60%로 매우 높지만, 기초 자산이 단일 주식이라 변동성과 원금 손실 위험이 극도로 큽니다.",
    badge: "고위험",
  },
  {
    emoji: "🔄",
    title: "분배금 재투자 비효율",
    detail: "매월 받는 분배금에 세금이 원천징수된 후 재투자해야 합니다. 세전 복리 효과를 누리기 어려워 장기 자산 증식 목적으로는 일반 성장형 ETF가 유리합니다.",
  },
];

// ── ETF 비교표 ────────────────────────────────────────────
export const ETF_COMPARE: EtfCompareRow[] = [
  {
    ticker: "TIGER 나스닥100CC",
    name: "TIGER 미국나스닥100커버드콜",
    market: "국내",
    annualDistRate: 12.0,
    strategy: "나스닥100 + 콜옵션 매도",
    upCap: true,
    riskLevel: "중간",
    taxRate: 15.4,
    note: "매월 분배. DC형 편입 가능",
  },
  {
    ticker: "TIGER S&P500CC",
    name: "TIGER 미국S&P500커버드콜",
    market: "국내",
    annualDistRate: 10.0,
    strategy: "S&P500 + 콜옵션 매도",
    upCap: true,
    riskLevel: "중간",
    taxRate: 15.4,
    note: "매월 분배. 상대적으로 안정적",
  },
  {
    ticker: "KODEX 나스닥100CC",
    name: "KODEX 미국나스닥100커버드콜",
    market: "국내",
    annualDistRate: 11.0,
    strategy: "나스닥100 + 콜옵션 매도",
    upCap: true,
    riskLevel: "중간",
    taxRate: 15.4,
    note: "삼성자산운용 운용",
  },
  {
    ticker: "JEPI",
    name: "JPMorgan Equity Premium Income",
    market: "미국",
    annualDistRate: 8.5,
    strategy: "S&P500 + ELN(구조화채권)",
    upCap: true,
    riskLevel: "낮음",
    taxRate: 22,
    note: "변동성 가장 낮음. 안정적 분배",
  },
  {
    ticker: "JEPQ",
    name: "JPMorgan Nasdaq Equity Premium",
    market: "미국",
    annualDistRate: 10.0,
    strategy: "나스닥100 + ELN",
    upCap: true,
    riskLevel: "중간",
    taxRate: 22,
    note: "JEPI의 나스닥 버전",
  },
  {
    ticker: "QYLD",
    name: "Global X Nasdaq-100 Covered Call",
    market: "미국",
    annualDistRate: 12.0,
    strategy: "나스닥100 ATM 콜옵션 완전매도",
    upCap: true,
    riskLevel: "높음",
    taxRate: 22,
    note: "상승 수익 완전 포기. 분배율 높음",
  },
  {
    ticker: "CONY",
    name: "YieldMax COIN Option Income",
    market: "미국",
    annualDistRate: 60.0,
    strategy: "코인베이스 단일종목 합성 커버드콜",
    upCap: true,
    riskLevel: "매우높음",
    taxRate: 22,
    note: "⚠️ 단일종목. 원금 손실 위험 극대",
  },
  {
    ticker: "AMDY",
    name: "YieldMax AMD Option Income",
    market: "미국",
    annualDistRate: 55.0,
    strategy: "AMD 단일종목 합성 커버드콜",
    upCap: true,
    riskLevel: "매우높음",
    taxRate: 22,
    note: "⚠️ 단일종목. 변동성 매우 큼",
  },
];

// ── 투자자 유형별 적합성 ──────────────────────────────────
export const INVESTOR_TYPES: InvestorType[] = [
  {
    icon: "👴",
    type: "은퇴 후 현금흐름 필요",
    suitable: true,
    reason: "매월 생활비 목적으로 분배금을 활용하기 좋습니다. JEPI처럼 안정적인 커버드콜 ETF가 적합합니다.",
  },
  {
    icon: "💼",
    type: "DC형 퇴직연금 운용",
    suitable: true,
    reason: "국내 상장 커버드콜 ETF를 퇴직연금 DC형 계좌에서 운용 가능합니다. 세금 절약 + 분배금 효과를 함께 누릴 수 있습니다.",
  },
  {
    icon: "📈",
    type: "자산 증식이 목표 (30~40대)",
    suitable: false,
    reason: "장기 자산 증식이 목표라면 일반 S&P500·나스닥100 ETF가 훨씬 유리합니다. 커버드콜은 강세장 수익이 제한됩니다.",
  },
  {
    icon: "🎯",
    type: "월 현금흐름 원하는 직장인",
    suitable: true,
    reason: "성과급·여유자금으로 월 배당 소득을 만들고 싶은 직장인에게 적합합니다. 연봉의 일부를 투자해 월 10~30만원 현금흐름 목표에 활용 가능.",
  },
  {
    icon: "⚡",
    type: "CONY·AMDY 단일종목형",
    suitable: false,
    reason: "분배율이 40~60%로 매력적이지만 원금 손실 위험이 매우 큽니다. 전체 자산의 5% 이하 소액으로만 접근을 권장합니다.",
  },
  {
    icon: "🔰",
    type: "투자 초보자",
    suitable: false,
    reason: "구조가 복잡하고 분배금이 높아 보여도 원금이 줄어들 수 있습니다. 일반 인덱스 ETF부터 시작하는 것을 권장합니다.",
  },
];

// ── FAQ ───────────────────────────────────────────────────
export const FAQ: FaqItem[] = [
  {
    q: "커버드콜 ETF 분배금은 어떻게 만들어지나요?",
    a: "커버드콜 ETF는 보유 주식에 대해 콜옵션(살 권리)을 매도하고 그 대가인 옵션 프리미엄을 받습니다. 이 프리미엄을 매월 투자자에게 분배금으로 지급합니다. 따라서 분배금의 원천은 주식 배당금이 아닌 옵션 프리미엄입니다.",
  },
  {
    q: "분배율 40%는 믿어도 되나요?",
    a: "과거 실적 기준으로 표시되며 미래 분배가 보장되지 않습니다. 특히 시장 변동성이 낮아지면 옵션 프리미엄도 줄어 분배율이 급격히 감소할 수 있습니다. 분배율보다 총수익률(분배금 + 주가 변동)을 함께 봐야 합니다.",
  },
  {
    q: "커버드콜 ETF와 일반 지수 ETF 중 어느 것이 더 유리한가요?",
    a: "강세장(주가 지속 상승)에서는 일반 지수 ETF가 훨씬 유리합니다. 횡보장이나 완만한 하락장에서는 커버드콜 ETF가 유리합니다. 10~20년 이상 장기 투자 목적이라면 일반 S&P500 ETF가 역사적으로 더 높은 총수익률을 보였습니다.",
  },
  {
    q: "CONY·AMDY 같은 단일 종목 커버드콜이 왜 위험한가요?",
    a: "단일 종목(코인베이스, AMD 등)의 주가가 하락하면 ETF 가격도 그대로 하락합니다. 분배금을 받는 동안 원금이 지속적으로 줄어드는 '수익률 사기(yield trap)'에 빠질 수 있습니다. 코인베이스처럼 변동성 큰 종목은 한 달에 30% 하락도 가능합니다.",
  },
  {
    q: "국내 상장 커버드콜 ETF와 미국 상장 커버드콜 ETF의 세금 차이는?",
    a: "국내 상장 ETF 분배금은 15.4% 원천징수됩니다. 미국 상장 ETF(JEPI, CONY 등)는 미국에서 15% 원천징수 후 국내에서 추가 과세돼 실질 세율이 약 22%입니다. 세금 절약 목적이라면 국내 상장 커버드콜 ETF가 유리합니다.",
  },
  {
    q: "커버드콜 ETF를 퇴직연금 DC형에 넣어도 되나요?",
    a: "국내 상장 커버드콜 ETF는 DC형 퇴직연금 계좌에 편입 가능합니다. 미국 상장 ETF(JEPI·CONY 등)는 DC형 퇴직연금에서 직접 매수 불가합니다. 레버리지·인버스 ETF도 퇴직연금에서 편입 불가합니다.",
  },
];
