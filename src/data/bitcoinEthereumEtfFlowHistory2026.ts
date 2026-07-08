import { BTC_YEARS } from "./bitcoinAnnualReturn";
import { ethereumReturnRows } from "./ethereumHistoricalReturns20152026";

// ── 타입 ──────────────────────────────────────────

export type EtfAsset = "BTC" | "ETH";

export type LaunchProfile = {
  asset: EtfAsset;
  launchDate: string;
  products: string;
};

export type CumulativeSnapshot = {
  asset: EtfAsset;
  label: string;
  note: string;
  asOfLabel: string;
};

export type EventTimelineItem = {
  date: string;
  dateLabel: string;
  title: string;
  detail: string;
};

export type PriceComparisonRow = {
  asset: EtfAsset;
  launchPriceLabel: string;
  currentPriceLabel: string;
  cumulativeLabel: string;
};

export type IssuerFlow = {
  ticker: string;      // "IBIT"
  issuer: string;      // "블랙록"
  role: "winner" | "loser";
  flowLabel: string;    // "누적 약 653억 달러 순유입"
  detail: string;
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

// 가격은 기존 리포트 데이터를 그대로 인용 — 새 숫자를 만들지 않음
const btc2024 = BTC_YEARS.find((y) => y.year === 2024)!;
const btc2026 = BTC_YEARS.find((y) => y.year === 2026)!;
const eth2024 = ethereumReturnRows.find((y) => y.year === 2024)!;
const eth2026 = ethereumReturnRows.find((y) => y.year === 2026)!;

export const BEF_META = {
  slug: "bitcoin-ethereum-etf-flow-history-2026",
  title: "비트코인·이더리움 ETF, 출시부터 지금까지",
  seoTitle: "비트코인·이더리움 ETF 2026 | 출시부터 지금까지 자금 흐름 총정리",
  seoDescription:
    "2024년 출시된 비트코인·이더리움 현물 ETF의 누적 순유입액과 주요 유출입 사건을 정리하고, 같은 기간 가격 흐름과 나란히 대조했습니다. BTC는 여전히 플러스, ETH는 마이너스입니다.",
  description: "2024년 ETF 출시 이후 지금까지의 누적 순유입, 핵심 사건, 가격 흐름을 한 화면에서 정리한 회고형 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "이 리포트의 누적 순유입액·월별 유출입 수치는 2026년 7월 초 보도 기준 스냅샷이며 실시간 데이터가 아닙니다. ETF 자금 흐름은 매일 바뀌므로, 최신 수치는 CoinGlass 등 실시간 트래커에서 확인해야 합니다. 이 리포트는 투자를 추천하지 않으며, ETF 출시 이후 흐름을 정리한 정보성 콘텐츠입니다.",
};

export const BEF_LAUNCH_PROFILES: LaunchProfile[] = [
  { asset: "BTC", launchDate: "2024년 1월", products: "BlackRock IBIT, Fidelity FBTC, ARK 21Shares ARKB, Grayscale GBTC 전환 등" },
  { asset: "ETH", launchDate: "2024년 7월", products: "BlackRock ETHA, Fidelity FETH 등" },
];

export const BEF_CUMULATIVE_SNAPSHOT: CumulativeSnapshot[] = [
  {
    asset: "BTC",
    label: "약 530억~570억 달러",
    note: "2025년 10월 약 630억 달러로 정점을 찍은 뒤 2026년 상반기 조정을 거치며 감소",
    asOfLabel: "2026년 7월 초 기준",
  },
  {
    asset: "ETH",
    label: "BTC 대비 훨씬 작은 규모",
    note: "출시 첫해(2024년 7월) 월 최대 약 54억 달러 순유입을 기록한 바 있으나, 전체 누적 규모는 BTC ETF 대비 작고 월별 변동성이 큼",
    asOfLabel: "2026년 7월 초 기준",
  },
];

export const BEF_EVENT_TIMELINE: EventTimelineItem[] = [
  { date: "2024-01", dateLabel: "2024년 1월", title: "비트코인 현물 ETF 출시", detail: "미국에서 비트코인 현물 ETF가 승인·출시됐습니다. 블랙록 IBIT가 첫해에만 약 370억 달러를 끌어모으며 시장을 주도했습니다." },
  { date: "2024-07", dateLabel: "2024년 7월", title: "이더리움 현물 ETF 출시", detail: "출시 첫 달부터 월 약 54억 달러 순유입을 기록하며 당시 최대치를 나타냈습니다." },
  { date: "2025-10", dateLabel: "2025년 10월", title: "비트코인 ETF 누적 순유입 정점", detail: "누적 순유입액이 약 630억 달러로 최고치를 기록했습니다." },
  { date: "2026-h1", dateLabel: "2026년 상반기", title: "출시 이후 첫 반기 순유출", detail: "BTC·ETH 현물 ETF 합산 상반기 기준 약 54억 달러 순유출 — 2024년 출시 이후 처음. 자금이 AI 섹터로 이동한 영향으로 풀이됩니다. 이더리움 ETF는 상반기 123거래일 중 73일이 순유출일이었고, 누적 순손실은 약 14.7억 달러였습니다." },
  { date: "2026-06", dateLabel: "2026년 6월", title: "비트코인 ETF 최대 월간 순유출", detail: "약 45억 달러 순유출로, 2024년 1월 출시 이후 최대 규모의 월간 유출을 기록했습니다. 시장을 주도해온 IBIT조차 5~6월 두 달간 약 50억 달러가 빠져나갔습니다." },
  { date: "2026-06b", dateLabel: "2026년 6월 말", title: "순유출 행진 종료", detail: "순유출 행진이 끝나고 일시적 순유입으로 전환되며 비트코인 가격이 $63,000대까지 반등했습니다." },
];

// 발행사별 승자·패자 — 같은 BTC ETF 시장 안에서도 수수료 구조에 따라 자금 흐름이 극명하게 갈린 사례
export const BEF_ISSUER_FLOWS: IssuerFlow[] = [
  {
    ticker: "IBIT",
    issuer: "블랙록",
    role: "winner",
    flowLabel: "누적 약 653억 달러 순유입",
    detail: "2024년 한 해에만 약 370억 달러가 유입됐고, 이후로도 시장 자금을 대부분 빨아들였습니다. 운용보수는 0.25% 수준으로 낮은 편입니다.",
  },
  {
    ticker: "GBTC",
    issuer: "그레이스케일",
    role: "loser",
    flowLabel: "누적 약 246억 달러 순유출",
    detail: "기존 신탁에서 저비용 ETF로 자금이 옮겨가며 대규모 환매가 이어졌습니다. 운용보수가 1.5%로 신생 ETF(0.25% 이하) 대비 크게 높은 것이 주된 원인으로 꼽힙니다.",
  },
];

export const BEF_PRICE_COMPARISON: PriceComparisonRow[] = [
  {
    asset: "BTC",
    launchPriceLabel: `$${btc2024.startPrice.toLocaleString("en-US")} (2024년 초)`,
    currentPriceLabel: `$${btc2026.endPrice.toLocaleString("en-US")}`,
    cumulativeLabel: "여전히 플러스",
  },
  {
    asset: "ETH",
    launchPriceLabel: `$${eth2024.startPrice!.toLocaleString("en-US")} (2024년 초)`,
    currentPriceLabel: `$${eth2026.endPrice.toLocaleString("en-US")}`,
    cumulativeLabel: "마이너스",
  },
];

export const BEF_FAQ: FaqItem[] = [
  {
    question: "비트코인·이더리움 ETF는 언제 출시됐나요?",
    answer: "비트코인 현물 ETF는 2024년 1월, 이더리움 현물 ETF는 2024년 7월 미국에서 승인·출시됐습니다.",
  },
  {
    question: "ETF 순유입이 많으면 가격이 오르나요?",
    answer:
      "시점상 상관관계는 보이지만 단정할 인과관계는 아닙니다. 2025년 10월 비트코인 ETF 순유입이 정점을 찍었을 때 가격도 강세였고, 2026년 6월 대규모 순유출 시기에는 가격이 조정을 받았습니다. 다만 거시경제, 규제, 기업 트레저리 수요 등 다른 변수도 함께 작용합니다.",
  },
  {
    question: "지금(2026년 상반기) ETF 자금 흐름은 어떤가요?",
    answer: "2026년 상반기 BTC·ETH ETF 합산으로 출시 이후 처음 반기 기준 순유출(약 54억 달러)을 기록했습니다. 자금이 AI 섹터로 이동한 영향으로 풀이됩니다. 6월에는 비트코인 ETF에서 출시 이후 최대 규모인 약 45억 달러 순유출이 발생했다가, 6월 말 순유출 행진이 끝나고 일시적으로 순유입으로 전환되며 가격이 반등했습니다.",
  },
  {
    question: "같은 비트코인 ETF인데 왜 자금 흐름이 회사마다 다른가요?",
    answer:
      "운용보수 차이가 큽니다. 블랙록 IBIT는 낮은 보수(약 0.25%)로 누적 약 653억 달러를 끌어모은 반면, 기존 신탁에서 전환된 그레이스케일 GBTC는 보수가 1.5%로 높아 누적 약 246억 달러가 빠져나갔습니다. 같은 비트코인을 담아도 상품 구조와 비용에 따라 자금 흐름은 크게 갈립니다.",
  },
  {
    question: "비트코인과 이더리움 중 ETF 성과는 어디가 더 좋았나요?",
    answer:
      "비트코인은 ETF 출시 시점 가격 대비 지금도 여전히 플러스지만, 이더리움은 출시 시점 대비 마이너스입니다. 누적 순유입 규모도 비트코인 ETF가 이더리움 ETF보다 훨씬 큽니다.",
  },
  {
    question: "이 리포트의 순유입 수치는 실시간인가요?",
    answer: "아닙니다. 2026년 7월 초 보도를 기준으로 한 스냅샷입니다. ETF 자금 흐름은 매일 바뀌므로 최신 수치는 CoinGlass 등 실시간 트래커에서 확인하는 것이 정확합니다.",
  },
];

export const BEF_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/bitcoin-annual-return-history/", label: "비트코인 연도별 수익률 역사", description: "2011년부터 지금까지 비트코인 연도별 가격과 수익률을 정리합니다." },
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름을 정리합니다." },
  { href: "/reports/ethereum-undervaluation-thesis-2026/", label: "이더리움은 왜 저평가일까 2026", description: "ETH ETF 순유출을 회의론 근거로 다룬 리포트입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
