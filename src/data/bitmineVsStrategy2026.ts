import { BTC_YEARS } from "./bitcoinAnnualReturn";
import { ethereumReturnRows } from "./ethereumHistoricalReturns20152026";

// ── 타입 ──────────────────────────────────────────

export type CompanyAsset = "BTC" | "ETH";

export type YearPriceRow = {
  year: number;
  label: string;         // "2023년" | "2026년 (YTD)"
  btcRange: string;       // "$16,618 → $42,208 (+154%)"
  ethRange: string;       // "$1,200 → $2,281 (+90%)"
};

export type PriceTargetScenario = {
  leader: "톰 리" | "마이클 세일러";
  asset: CompanyAsset;
  targetLabel: string;    // "$22,000"
  timeframe: string;      // "2026년 내 최상 시나리오"
  condition: string;      // 전제 조건 설명
  sourceLabel: string;    // 발언 출처/맥락
};

export type CompanyProfile = {
  id: "bitmine" | "strategy";
  company: string;
  ticker: string;
  asset: CompanyAsset;
  holdingLabel: string;
  pctOfSupplyLabel: string;
  targetLabel: string;
  leader: string;
  fundingModel: string;
  stakingYieldLabel?: string;
  riskNote: string;
};

export type ComparisonRow = {
  label: string;
  bitmine: string;
  strategy: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const BVS_META = {
  slug: "bitmine-vs-strategy-2026",
  title: "비트마인 vs 스트래티지, 이더리움·비트코인 기업 트레저리 비교",
  seoTitle: "비트마인 vs 스트래티지 2026 | 이더리움·비트코인 보유량 비교",
  seoDescription:
    "비트마인 ETH 약 540만개, 스트래티지 BTC 약 84만개 보유 현황을 비교합니다. 스테이킹 수익 차이, 목표 보유 비중, 2026년 미실현 손실 리스크까지 정리했습니다.",
  description: "이더리움·비트코인 기업 트레저리 두 회사의 보유 규모, 전략, 리스크를 나란히 비교한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "보유량·평가손실 수치는 2026년 6월 말~7월 초 보도·공시 기준이며 실시간 수치가 아닙니다. 코인 가격 변동에 따라 평가금액과 손익은 매일 달라질 수 있습니다. 이 리포트는 두 회사 중 어느 쪽이 더 나은 투자인지 추천하지 않으며, 기업 트레저리 전략의 구조적 차이를 설명하는 정보성 콘텐츠입니다.",
};

export const BVS_COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: "bitmine",
    company: "비트마인 (Bitmine Immersion Technologies)",
    ticker: "BMNR",
    asset: "ETH",
    holdingLabel: "약 540만~570만 ETH",
    pctOfSupplyLabel: "약 4.7%",
    targetLabel: "이더리움 유통량 5% 확보 (추가 약 64만 ETH 필요)",
    leader: "톰 리 (펀드스트랫 창립자)",
    fundingModel: "주식 발행(ATM)으로 자금을 조달해 ETH 매입",
    stakingYieldLabel: "보유 ETH 스테이킹으로 연 약 2.76억 달러 수익 기대",
    riskNote: "2026년 상반기 ETH 급락으로 평가손실이 약 12조원대까지 확대 보도됨.",
  },
  {
    id: "strategy",
    company: "스트래티지 (구 MicroStrategy)",
    ticker: "MSTR",
    asset: "BTC",
    holdingLabel: "약 84.7만 BTC",
    pctOfSupplyLabel: "약 4%+",
    targetLabel: "100만 BTC 확보",
    leader: "마이클 세일러",
    fundingModel: "주식·전환사채 발행(ATM)으로 자금을 조달해 BTC 매입",
    riskNote: "2026년 1분기에만 약 125억 달러 손실 보고. 2025년 10월 고점 대비 BTC 52% 하락 영향.",
  },
];

export const BVS_COMPARISON_TABLE: ComparisonRow[] = [
  { label: "보유 자산", bitmine: "이더리움(ETH)", strategy: "비트코인(BTC)" },
  { label: "보유량", bitmine: "약 540만~570만 ETH", strategy: "약 84.7만 BTC" },
  { label: "전체 공급량 대비", bitmine: "약 4.7%", strategy: "약 4%+" },
  { label: "목표 비중", bitmine: "유통량 5%", strategy: "100만 BTC" },
  { label: "스테이킹 수익", bitmine: "연 약 2.76억 달러 기대", strategy: "없음 (BTC 구조상 불가)" },
  { label: "리더", bitmine: "톰 리", strategy: "마이클 세일러" },
  { label: "자금 조달", bitmine: "주식 발행(ATM)", strategy: "주식·전환사채 발행(ATM)" },
];

// 2023년·2026년(YTD) 가격은 기존 리포트(BTC_YEARS, ethereumReturnRows)와 동일 출처를 그대로 인용 — 새 숫자를 만들지 않음
const usd = (value: number) => `$${value.toLocaleString("en-US")}`;
const pct = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

const btc2023 = BTC_YEARS.find((y) => y.year === 2023)!;
const btc2026 = BTC_YEARS.find((y) => y.year === 2026)!;
const eth2023 = ethereumReturnRows.find((y) => y.year === 2023)!;
const eth2026 = ethereumReturnRows.find((y) => y.year === 2026)!;

export const BVS_PRICE_HISTORY: YearPriceRow[] = [
  {
    year: 2023,
    label: "2023년 (연초 → 연말)",
    btcRange: `${usd(btc2023.startPrice)} → ${usd(btc2023.endPrice)} (${pct(btc2023.returnPct)})`,
    ethRange: `${usd(eth2023.startPrice!)} → ${usd(eth2023.endPrice)} (${pct(Math.round(eth2023.returnRate!))})`,
  },
  {
    year: 2026,
    label: "2026년 (연초 → 현재, YTD)",
    btcRange: `${usd(btc2026.startPrice)} → ${usd(btc2026.endPrice)} (${pct(btc2026.returnPct)})`,
    ethRange: `${usd(eth2026.startPrice!)} → ${usd(eth2026.endPrice)} (${pct(Math.round(eth2026.returnRate!))})`,
  },
];

export const BVS_PRICE_TARGETS: PriceTargetScenario[] = [
  {
    leader: "톰 리",
    asset: "ETH",
    targetLabel: "$22,000",
    timeframe: "최상 시나리오 (시점 미확정)",
    condition: "비트코인이 25만 달러에 도달하고, 현재 역사적 저점인 ETH/BTC 교환비율이 과거 평균 수준으로 회귀한다는 두 조건이 동시에 충족되는 낙관적 시나리오",
    sourceLabel: "컨센서스 2026 컨퍼런스 발언",
  },
  {
    leader: "톰 리",
    asset: "ETH",
    targetLabel: "$12,000",
    timeframe: "2026년 연말",
    condition: "같은 시점 비트코인 20만 달러 전망과 함께 제시된 연말 목표치",
    sourceLabel: "2026년 초 인터뷰",
  },
  {
    leader: "톰 리",
    asset: "ETH",
    targetLabel: "$7,000",
    timeframe: "시점 미확정 (하향 조정)",
    condition: "이더리움이 먼저 2,500달러까지 추가 하락한 뒤에야 도달 가능하다고 단서를 단 하향 조정 전망",
    sourceLabel: "2026년 상반기 급락 이후 인터뷰",
  },
  {
    leader: "마이클 세일러",
    asset: "BTC",
    targetLabel: "0달러 또는 100만 달러",
    timeframe: "장기 (시점 미확정)",
    condition: "비트코인은 실패해서 0이 되거나, 준비자산으로 자리잡아 100만 달러로 간다는 이분법적 전망 — 중간 시나리오를 제시하지 않음",
    sourceLabel: "2026년 2월 인터뷰",
  },
  {
    leader: "마이클 세일러",
    asset: "BTC",
    targetLabel: "100만 달러",
    timeframe: "2033년 전망",
    condition: "비트코인 현물 ETF 이후 은행권 담보대출 확산 등 제도권 편입이 계속된다는 전제",
    sourceLabel: "과거 인터뷰 종합",
  },
  {
    leader: "마이클 세일러",
    asset: "BTC",
    targetLabel: "2,100만 달러",
    timeframe: "2046년 전망 (초장기)",
    condition: "가장 낙관적인 초장기 시나리오로, 2026년 현재 가격과는 직접 비교하기 어려운 먼 미래 전망",
    sourceLabel: "과거 인터뷰 종합",
  },
];

export const BVS_FAQ: FaqItem[] = [
  {
    question: "비트마인은 왜 이더리움을 이렇게 많이 사나요?",
    answer:
      "비트마인을 이끄는 톰 리는 월가의 자산 토큰화와 AI 에이전트 확산이 이더리움 수요를 견인할 것이라는 '이더리움 슈퍼사이클' 전망을 근거로 들고 있습니다. 회사는 이더리움 유통량의 5%를 확보하는 것을 목표로 밝혔습니다.",
  },
  {
    question: "스트래티지는 왜 비트코인을 이렇게 많이 사나요?",
    answer:
      "마이클 세일러는 비트코인을 법정화폐를 대체할 디지털 준비자산으로 보고, 회사 재무 전략의 핵심으로 삼고 있습니다. 목표는 100만 BTC 확보입니다.",
  },
  {
    question: "두 회사 중 어디가 더 위험한가요?",
    answer:
      "이 리포트는 어느 쪽이 더 안전하거나 나은 투자라고 판단하지 않습니다. 두 회사 모두 주식 발행으로 조달한 자금을 코인에 베팅하는 유사한 구조이며, 2026년 상반기 급락장에서 스트래티지·비트마인 모두 대규모 평가손실을 겪었습니다. 코인 가격에 연동된 레버리지 구조라는 공통 리스크가 있습니다.",
  },
  {
    question: "ETH 스테이킹 수익은 BTC 보유보다 유리한가요?",
    answer:
      "이더리움은 지분증명(PoS) 구조라 보유량을 스테이킹해 추가 수익을 낼 수 있지만(비트마인은 연 약 2.76억 달러 기대), 비트코인은 작업증명(PoW) 구조라 스테이킹 개념 자체가 없습니다. 다만 스테이킹 수익도 코인 가격 변동 리스크를 상쇄하지는 못합니다.",
  },
  {
    question: "이 리포트의 보유량 수치는 얼마나 최신인가요?",
    answer:
      "2026년 6월 말~7월 초 보도·공시를 기준으로 정리했습니다. 두 회사 모두 거의 매주 코인을 추가 매수하고 있어 실제 최신 보유량은 각 사 공시나 Bitcoin Treasuries 등 트레저리 추적 사이트에서 확인하는 것이 정확합니다.",
  },
  {
    question: "톰 리·마이클 세일러가 제시한 목표가는 믿을 만한가요?",
    answer:
      "톰 리는 이더리움 목표가를 2만 2,000달러부터 7,000달러까지 시장 상황에 따라 여러 차례 크게 조정했고, 마이클 세일러의 비트코인 100만 달러 전망도 2033년이라는 장기 시점을 전제로 합니다. 둘 다 자사 코인 보유 전략에 이해관계가 걸린 회사 대표의 개인 전망이며, 실현을 보장하지 않는 참고용 시나리오로만 봐야 합니다.",
  },
];

export const BVS_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/bitcoin-supply-holders-2026/", label: "비트코인 보유 현황 2026", description: "국가·기업·개인별 비트코인 보유 분포 전체 리포트입니다." },
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름을 정리합니다." },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인 vs 금 vs S&P500 10년 비교", description: "자산군별 장기 수익률을 비교하는 맥락 자료입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
