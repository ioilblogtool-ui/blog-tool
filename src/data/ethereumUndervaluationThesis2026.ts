import { ethereumReturnRows } from "./ethereumHistoricalReturns20152026";

// ── 타입 ──────────────────────────────────────────

export type ArgumentPoint = {
  id: string;
  label: string;
  value: string;
  detail: string;
  sourceLabel: string;
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

const eth2026 = ethereumReturnRows.find((y) => y.year === 2026)!;
const eth2026PriceLabel = `$${eth2026.startPrice!.toLocaleString("en-US")} → $${eth2026.endPrice.toLocaleString("en-US")} (${eth2026.returnRate}%)`;

export const EUT_META = {
  slug: "ethereum-undervaluation-thesis-2026",
  title: "이더리움은 왜 저평가라는 말이 나올까",
  seoTitle: "이더리움은 왜 저평가일까 2026 | 스테이블코인·RWA 근거 정리",
  seoDescription:
    "이더리움 저평가론의 핵심 근거(스테이블코인 점유율 50~60%, RWA 토큰화 전망, ETH/BTC 비율)와 반대로 제기되는 회의론(L2 가치 유출, ETF 유출)까지 균형 있게 정리했습니다.",
  description: "스테이블코인·RWA 관점의 이더리움 저평가론과, 이에 반박하는 회의론을 함께 정리한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "이 리포트가 다루는 '저평가'는 비교계산소의 결론이 아니라 톰 리 등 특정 분석가·매체가 제기하는 투자 논리입니다. 스테이블코인 점유율, RWA 전망, ETH/BTC 비율 등은 2026년 상반기 보도·조회 시점 기준이며 실시간으로 변동합니다. 이 리포트는 투자를 추천하지 않으며, 근거와 반대 논거를 함께 소개하는 정보성 콘텐츠입니다.",
};

export const EUT_BULL_POINTS: ArgumentPoint[] = [
  {
    id: "stablecoin-share",
    label: "스테이블코인 점유율",
    value: "약 50~60%",
    detail: "이더리움은 전체 스테이블코인 시장(2026년 1분기 약 3,150억 달러)에서 점유율 1위 체인이며, 생태계 내 스테이블코인 공급 규모는 1,800억 달러를 넘어섰습니다.",
    sourceLabel: "2026-04 보도 기준",
  },
  {
    id: "rwa",
    label: "RWA(실물자산 토큰화)",
    value: "2030년까지 최대 50조 달러 전망",
    detail: "주식·채권 등 실물자산을 온체인으로 옮기는 RWA 토큰화 시장이 커지면서, 이더리움이 관련 인프라의 중심으로 거론되고 있습니다.",
    sourceLabel: "업계 전망 보도",
  },
  {
    id: "eth-btc-ratio",
    label: "ETH/BTC 교환비율",
    value: "약 0.0344 (52주 중 낮은 구간)",
    detail: "최근 52주 ETH/BTC 비율은 0.0177~0.0605 사이에서 움직였습니다. 현재 수준은 이 범위의 낮은 편에 위치해 있어, 역사적 평균으로 회귀할 여력이 있다는 주장의 근거로 쓰입니다.",
    sourceLabel: "2026-07 조회 기준",
  },
  {
    id: "network-usage",
    label: "네트워크 사용량",
    value: "일일 거래량 300만 건 첫 돌파",
    detail: "2026년 상반기 이더리움 메인넷 일일 거래 처리량이 사상 처음 300만 건을 넘어서는 등 실사용 지표는 증가 추세를 보였습니다.",
    sourceLabel: "2026년 상반기 보도",
  },
];

export const EUT_SKEPTIC_POINTS: ArgumentPoint[] = [
  {
    id: "l2-value-leak",
    label: "L2 가치 유출 논쟁",
    value: "L2는 크는데 L1은?",
    detail: "레이어2(L2)가 성장할수록 거래와 수수료가 L2로 옮겨가면서 이더리움 메인넷(L1)의 가치 포착력이 약해진다는 논쟁이 2026년 중반 커졌습니다.",
    sourceLabel: "2026년 중반 보도",
  },
  {
    id: "foundation-exodus",
    label: "이더리움 재단 인력 이탈",
    value: "핵심 인재 8명 퇴사",
    detail: "이더리움 재단의 핵심 인력 다수가 퇴사하면서 조직 안정성에 대한 우려가 제기됐습니다.",
    sourceLabel: "2026년 보도",
  },
  {
    id: "etf-outflow",
    label: "현물 ETF 순유출",
    value: "기관 수요 약화 신호",
    detail: "2026년 중반 이더리움 현물 ETF에서 순유출이 발생해, 기관 투자 수요가 약해지고 있다는 해석이 나왔습니다.",
    sourceLabel: "2026년 중반 보도",
  },
  {
    id: "actual-price",
    label: "2026년 실제 가격 흐름",
    value: eth2026PriceLabel,
    detail: "저평가 논의와 별개로, 2026년 연초 대비 현재까지(YTD) 이더리움 가격 자체는 하락했습니다.",
    sourceLabel: "사이트 내 이더리움 역사 수익률 리포트와 동일 출처",
  },
];

export const EUT_FAQ: FaqItem[] = [
  {
    question: "이더리움이 저평가라는 근거는 뭔가요?",
    answer:
      "스테이블코인 점유율(약 50~60%), RWA(실물자산 토큰화) 인프라로서의 위상, 역사적으로 낮은 편인 ETH/BTC 교환비율, 늘어나는 네트워크 사용량이 주요 근거로 제시됩니다. 다만 이는 특정 분석가·매체의 해석이며 확정된 사실이 아닙니다.",
  },
  {
    question: "스테이블코인이 왜 이더리움에 유리한가요?",
    answer:
      "USDT·USDC 등 주요 스테이블코인이 이더리움 네트워크에서 주로 발행·정산되기 때문에, 스테이블코인 거래가 늘어날수록 이더리움 네트워크 사용량과 수수료 수요도 함께 늘어날 수 있다는 논리입니다.",
  },
  {
    question: "RWA(실물자산 토큰화)가 뭔가요?",
    answer:
      "주식, 채권, 부동산 같은 전통 금융 자산을 블록체인 위에 토큰 형태로 옮기는 것을 말합니다. 이 시장이 커지면 이더리움처럼 신뢰성과 개발 생태계를 갖춘 네트워크가 정산 기반으로 선택될 가능성이 높다는 전망이 있습니다.",
  },
  {
    question: "레이어2(L2)가 성장하면 이더리움에 안 좋은가요?",
    answer:
      "의견이 갈립니다. L2가 이더리움의 보안을 빌려 쓰는 확장 수단이라 L1에도 긍정적이라는 시각과, 거래·수수료가 L2로 옮겨가면서 L1의 가치 포착력이 약해진다는 회의론이 동시에 존재합니다. 이 리포트는 두 시각을 모두 소개합니다.",
  },
  {
    question: "이 리포트는 이더리움 투자를 추천하나요?",
    answer:
      "아닙니다. 저평가론과 회의론을 균형 있게 소개하는 정보성 콘텐츠이며, 투자 판단은 최신 데이터와 본인 상황을 기준으로 별도로 내려야 합니다.",
  },
];

export const EUT_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/ethereum-historical-returns-2015-2026/", label: "이더리움 역사 수익률 2015-2026", description: "이더리움 연도별 가격과 수익률 흐름 전체를 정리합니다." },
  { href: "/reports/bitmine-vs-strategy-2026/", label: "비트마인 vs 스트래티지 2026", description: "톰 리의 이더리움 슈퍼사이클 논리와 목표가를 다룬 리포트입니다." },
  { href: "/reports/bitcoin-gold-sp500-10year-comparison-2026/", label: "비트코인 vs 금 vs S&P500 10년 비교", description: "자산군별 장기 수익률을 비교하는 맥락 자료입니다." },
  { href: "/tools/coin-dca-calculator/", label: "코인 적립식 투자 계산기", description: "정기적으로 코인에 투자했을 때의 예상 결과를 계산합니다." },
];
