export const FX_RATE_KRW_PER_USD = 1507.01;
export const DATA_UPDATED_AT = "2026-04-09";

export type EtfMarket = "US" | "KR";
export type SourceKind = "official" | "secondary";

export type SemiconductorEtf = {
  slug: string;
  ticker: string;
  name: string;
  market: EtfMarket;
  manager: string;
  focus: string;
  category: string;
  hedged: string;
  expenseRatio: number;
  aumOriginal: string;
  aumKrwBillion: number;
  sourceDate: string;
  sourceKind: SourceKind;
  sourceUrl: string;
  topHoldings: { name: string; weight: number }[];
  fit: string;
  watchouts: string;
};

export type SemiconductorCompany = {
  rank: number;
  name: string;
  ticker: string;
  country: string;
  segment: string;
  marketCapUsdTrillion: number;
  marketCapKrwTrillion: number;
  sourceUrl: string;
  includedEtfs: string[];
};

export const REPORT_META = {
  title: "미국·한국 반도체 ETF 비교 2026 | SOXX, SMH, TIGER, RISE, ACE 규모·시총 한눈에 보기",
  description:
    "SOXX, SMH, XSD, PSI와 TIGER 미국필라델피아반도체나스닥, TIGER Fn반도체TOP10, RISE AI반도체TOP10, ACE AI반도체TOP3+를 원화 기준 규모와 최신 시총 기준으로 비교하는 반도체 ETF 리포트입니다.",
  methodology:
    "미국 ETF 순자산은 iShares, VanEck, State Street 공식 상품 페이지를 우선 사용했고, 확인이 어려운 항목은 CompaniesMarketCap 등 보조 출처를 별도 표기했습니다. 한국 ETF 순자산은 운용사 상품 페이지와 최근 기사 내 KRX 인용 수치를 함께 사용했습니다.",
  caution:
    "2026년 4월 9일 현재 최신 공개 기준을 반영했지만, ETF 순자산과 시가총액은 시장 가격에 따라 수시로 변합니다. 원화 환산은 2026년 4월 초 달러/원 1,507.01원을 비교용 기준환율로 사용한 참고값입니다.",
  updatedAt: "2026년 4월 9일 기준 최신 공개 수치 반영",
};

export const ETF_ROWS: SemiconductorEtf[] = [
  {
    slug: "smh",
    ticker: "SMH",
    name: "VanEck Semiconductor ETF",
    market: "US",
    manager: "VanEck",
    focus: "엔비디아·TSMC·브로드컴 비중이 높은 미국 대표 집중형",
    category: "미국 상장 / 집중형",
    hedged: "해당 없음",
    expenseRatio: 0.35,
    aumOriginal: "$43.38B",
    aumKrwBillion: 65387.2,
    sourceDate: "2026-04-06",
    sourceKind: "official",
    sourceUrl: "https://www.vaneck.com/us/en/investments/semiconductor-etf-smh/",
    topHoldings: [
      { name: "NVIDIA", weight: 19.23 },
      { name: "TSMC", weight: 11.59 },
      { name: "Broadcom", weight: 8.06 },
    ],
    fit: "엔비디아와 AI 수혜 강도를 크게 가져가고 싶은 투자자",
    watchouts: "상위 종목 쏠림이 강해서 업황 조정기에 변동성이 크게 느껴질 수 있습니다.",
  },
  {
    slug: "soxx",
    ticker: "SOXX",
    name: "iShares Semiconductor ETF",
    market: "US",
    manager: "iShares",
    focus: "미국 반도체 30종목 수정 시총가중의 정석형 분산",
    category: "미국 상장 / 분산형",
    hedged: "해당 없음",
    expenseRatio: 0.35,
    aumOriginal: "$20.69B",
    aumKrwBillion: 31184.4,
    sourceDate: "2026-03-26",
    sourceKind: "official",
    sourceUrl: "https://www.ishares.com/us/products/239705/ishares-phlx-semiconductor-etf/",
    topHoldings: [
      { name: "NVIDIA", weight: 8.5 },
      { name: "Broadcom", weight: 8.4 },
      { name: "AMD", weight: 8.2 },
    ],
    fit: "처음 반도체 ETF를 시작하면서 특정 종목 편중은 줄이고 싶은 투자자",
    watchouts: "SMH보다 집중도가 낮아 상승장 탄력은 다소 약하게 느껴질 수 있습니다.",
  },
  {
    slug: "xsd",
    ticker: "XSD",
    name: "SPDR S&P Semiconductor ETF",
    market: "US",
    manager: "State Street",
    focus: "동일가중 성격이 강해 중형주 비중이 상대적으로 높은 구조",
    category: "미국 상장 / 균등형",
    hedged: "해당 없음",
    expenseRatio: 0.35,
    aumOriginal: "$1.72B",
    aumKrwBillion: 2586.7,
    sourceDate: "2025-11-07",
    sourceKind: "official",
    sourceUrl: "https://www.ssga.com/us/en/individual/etfs/funds/spdr-sp-semiconductor-etf-xsd",
    topHoldings: [],
    fit: "대형주 편중을 줄이고 장비·중형 성장주까지 넓게 담고 싶은 투자자",
    watchouts: "운용 규모와 유동성은 SMH, SOXX보다 작습니다.",
  },
  {
    slug: "psi",
    ticker: "PSI",
    name: "Invesco Semiconductors ETF",
    market: "US",
    manager: "Invesco",
    focus: "미국 반도체 전반을 넓게 담는 팩터형 분산 ETF",
    category: "미국 상장 / 분산형",
    hedged: "해당 없음",
    expenseRatio: 0.56,
    aumOriginal: "$1.21B",
    aumKrwBillion: 1823.5,
    sourceDate: "2026-03-10",
    sourceKind: "secondary",
    sourceUrl: "https://companiesmarketcap.com/invesco-semiconductors-etf/holdings/",
    topHoldings: [
      { name: "Broadcom", weight: 5.65 },
      { name: "Micron", weight: 5.18 },
      { name: "KLA", weight: 5.18 },
    ],
    fit: "AI 수혜주뿐 아니라 미국 반도체 밸류체인 전반을 넓게 가져가고 싶은 투자자",
    watchouts: "총보수가 상대적으로 높고 운용 규모는 대형 ETF보다 작습니다.",
  },
  {
    slug: "tiger-us-phlx",
    ticker: "381180",
    name: "TIGER 미국필라델피아반도체나스닥",
    market: "KR",
    manager: "미래에셋자산운용",
    focus: "원화로 미국 반도체 대표 지수에 접근하는 국내 상장 대형 ETF",
    category: "한국 상장 / 미국지수",
    hedged: "환노출",
    expenseRatio: 0.49,
    aumOriginal: "2.55조원",
    aumKrwBillion: 2551.1,
    sourceDate: "2025-07-29",
    sourceKind: "official",
    sourceUrl: "https://www.tigeretf.com/ko/product/search/detail/index.do?ksdFund=KR7381180009",
    topHoldings: [
      { name: "NVIDIA", weight: 12.99 },
      { name: "Broadcom", weight: 10.06 },
      { name: "TSMC", weight: 8.32 },
    ],
    fit: "미국 반도체 대형주를 원화 계좌와 연금 계좌에서 편하게 담고 싶은 투자자",
    watchouts: "미국 원ETF 대비 총보수가 높고 환노출이 있습니다.",
  },
  {
    slug: "tiger-fn-top10",
    ticker: "396500",
    name: "TIGER Fn반도체TOP10",
    market: "KR",
    manager: "미래에셋자산운용",
    focus: "삼성전자·SK하이닉스 중심의 국내 반도체 TOP10 압축형",
    category: "한국 상장 / 국내반도체",
    hedged: "해당 없음",
    expenseRatio: 0.45,
    aumOriginal: "7071억원",
    aumKrwBillion: 707.1,
    sourceDate: "2025-07-29",
    sourceKind: "official",
    sourceUrl: "https://www.tigeretf.com/ko/product/search/detail/index.do?ksdFund=KR7396500001",
    topHoldings: [
      { name: "SK하이닉스", weight: 27.58 },
      { name: "삼성전자", weight: 23.85 },
      { name: "한미반도체", weight: 13.85 },
    ],
    fit: "국내 메모리와 장비주 비중을 같이 가져가고 싶은 투자자",
    watchouts: "상위 2종목 비중이 높아 국내 반도체 대형주 흐름에 민감합니다.",
  },
  {
    slug: "rise-ai-top10",
    ticker: "0093A0",
    name: "RISE AI반도체TOP10",
    market: "KR",
    manager: "KB자산운용",
    focus: "국내 AI 반도체 키워드와 시가총액을 같이 반영한 10종목 분산",
    category: "한국 상장 / 국내 AI반도체",
    hedged: "해당 없음",
    expenseRatio: 0.2,
    aumOriginal: "765억원",
    aumKrwBillion: 76.6,
    sourceDate: "2026-02-13",
    sourceKind: "official",
    sourceUrl: "https://www.riseetf.co.kr/prod/finderDetail/44J0",
    topHoldings: [
      { name: "삼성전자", weight: 13.64 },
      { name: "SK하이닉스", weight: 12.42 },
      { name: "원익IPS", weight: 12.37 },
    ],
    fit: "HBM, 테스트, 장비, 팹리스까지 국내 AI 밸류체인을 넓게 보고 싶은 투자자",
    watchouts: "상장 역사가 짧아 장기 운용 트랙레코드는 더 지켜볼 필요가 있습니다.",
  },
  {
    slug: "ace-ai-top3",
    ticker: "469150",
    name: "ACE AI반도체TOP3+",
    market: "KR",
    manager: "한국투자신탁운용",
    focus: "삼성전자·SK하이닉스·한미반도체 중심의 HBM 압축형",
    category: "한국 상장 / 국내 압축형",
    hedged: "해당 없음",
    expenseRatio: 0.45,
    aumOriginal: "5294억원",
    aumKrwBillion: 529.4,
    sourceDate: "2026-03-17",
    sourceKind: "secondary",
    sourceUrl: "https://www.hankyung.com/article/2026031891926",
    topHoldings: [],
    fit: "HBM 대장주 3종목에 강하게 베팅하고 싶은 투자자",
    watchouts: "3종목 중심이라 ETF라기보다 압축 포트폴리오에 가깝습니다.",
  },
  {
    slug: "rise-us-nyse",
    ticker: "469050",
    name: "RISE 미국반도체NYSE(H)",
    market: "KR",
    manager: "KB자산운용",
    focus: "SOXX 계열 미국 반도체 지수에 원화로 접근하는 환헤지형",
    category: "한국 상장 / 미국지수",
    hedged: "환헤지",
    expenseRatio: 0.01,
    aumOriginal: "165억원",
    aumKrwBillion: 16.5,
    sourceDate: "2026-03-12",
    sourceKind: "official",
    sourceUrl: "https://www.riseetf.co.kr/prod/finderDetail/44F4",
    topHoldings: [
      { name: "Micron", weight: 8.8 },
      { name: "NVIDIA", weight: 7.31 },
      { name: "Applied Materials", weight: 7.08 },
    ],
    fit: "달러 환율 변동을 줄이면서 미국 반도체에 접근하고 싶은 투자자",
    watchouts: "규모가 아직 크지 않아 유동성은 대형 국내 상장 ETF보다 약합니다.",
  },
  {
    slug: "ace-global-top4",
    ticker: "446770",
    name: "ACE 글로벌반도체TOP4 Plus",
    market: "KR",
    manager: "한국투자신탁운용",
    focus: "엔비디아·SK하이닉스·TSMC·ASML 중심의 글로벌 4축 압축형",
    category: "한국 상장 / 글로벌 압축형",
    hedged: "환노출",
    expenseRatio: 0.45,
    aumOriginal: "1조338억원",
    aumKrwBillion: 1033.8,
    sourceDate: "2026-02-24",
    sourceKind: "secondary",
    sourceUrl: "https://www.mk.co.kr/news/etc/11971186",
    topHoldings: [
      { name: "SK하이닉스", weight: 23.0 },
      { name: "ASML", weight: 20.83 },
      { name: "NVIDIA", weight: 17.8 },
    ],
    fit: "한국, 미국, 대만, 유럽 핵심 4개 축을 한 번에 압축하고 싶은 투자자",
    watchouts: "집중도가 높아 ETF 규모가 커도 실제 성격은 압축형 포트폴리오에 가깝습니다.",
  },
];

export const SEMICONDUCTOR_COMPANIES: SemiconductorCompany[] = [
  { rank: 1, name: "NVIDIA", ticker: "NVDA", country: "미국", segment: "GPU·AI 가속기", marketCapUsdTrillion: 4.425, marketCapKrwTrillion: 6668.5, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SMH", "SOXX", "TIGER 미국필라델피아반도체나스닥"] },
  { rank: 2, name: "TSMC", ticker: "TSM", country: "대만", segment: "파운드리", marketCapUsdTrillion: 1.897, marketCapKrwTrillion: 2859.8, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SMH", "SOXX", "ACE 글로벌반도체TOP4 Plus"] },
  { rank: 3, name: "Broadcom", ticker: "AVGO", country: "미국", segment: "ASIC·네트워크", marketCapUsdTrillion: 1.662, marketCapKrwTrillion: 2504.7, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SMH", "SOXX", "TIGER 미국필라델피아반도체나스닥"] },
  { rank: 4, name: "Samsung Electronics", ticker: "005930", country: "한국", segment: "메모리", marketCapUsdTrillion: 0.90895, marketCapKrwTrillion: 1370.1, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["TIGER Fn반도체TOP10", "RISE AI반도체TOP10", "ACE AI반도체TOP3+"] },
  { rank: 5, name: "ASML", ticker: "ASML", country: "네덜란드", segment: "반도체 장비", marketCapUsdTrillion: 0.55798, marketCapKrwTrillion: 840.9, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SMH", "SOXX", "ACE 글로벌반도체TOP4 Plus"] },
  { rank: 6, name: "SK hynix", ticker: "000660", country: "한국", segment: "메모리", marketCapUsdTrillion: 0.47733, marketCapKrwTrillion: 719.4, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["TIGER Fn반도체TOP10", "RISE AI반도체TOP10", "ACE AI반도체TOP3+", "ACE 글로벌반도체TOP4 Plus"] },
  { rank: 7, name: "Micron", ticker: "MU", country: "미국", segment: "메모리", marketCapUsdTrillion: 0.45868, marketCapKrwTrillion: 691.3, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SOXX", "RISE 미국반도체NYSE(H)"] },
  { rank: 8, name: "AMD", ticker: "AMD", country: "미국", segment: "CPU·GPU", marketCapUsdTrillion: 0.37796, marketCapKrwTrillion: 569.6, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SMH", "SOXX", "TIGER 미국필라델피아반도체나스닥"] },
  { rank: 9, name: "Lam Research", ticker: "LRCX", country: "미국", segment: "반도체 장비", marketCapUsdTrillion: 0.30959, marketCapKrwTrillion: 466.7, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SOXX", "TIGER 미국필라델피아반도체나스닥"] },
  { rank: 10, name: "Applied Materials", ticker: "AMAT", country: "미국", segment: "반도체 장비", marketCapUsdTrillion: 0.30611, marketCapKrwTrillion: 461.5, sourceUrl: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/", includedEtfs: ["SOXX", "RISE 미국반도체NYSE(H)", "TIGER 미국필라델피아반도체나스닥"] },
];

export const SUMMARY_CARDS = [
  { label: "가장 큰 미국 ETF", value: "SMH 65.4조원", sub: "공식 순자산 기준, 2026-04-06" },
  { label: "가장 큰 한국 상장 ETF", value: "TIGER 미국필라델피아 2.55조원", sub: "국내 상장 반도체 ETF 중 대형급" },
  { label: "최대 반도체 시총", value: "엔비디아 6,668조원", sub: "2026-04-09 기준 원화 환산" },
  { label: "가장 압축적인 국내형", value: "ACE AI반도체TOP3+", sub: "삼성전자·SK하이닉스·한미반도체 중심" },
] as const;

export const TAKEAWAYS = [
  {
    title: "원화 기준으로 보면 규모 차이가 훨씬 선명합니다",
    body: "SMH와 SOXX는 한국 상장 반도체 ETF보다 운용 규모가 한 단계 이상 큽니다. 국내 ETF는 접근성과 과세 편의가 장점이고, 미국 원ETF는 규모와 유동성이 강점입니다.",
  },
  {
    title: "국내형도 성격이 완전히 다릅니다",
    body: "TIGER 미국필라델피아반도체나스닥은 미국 지수 추종형이고, RISE AI반도체TOP10은 국내 AI 밸류체인 분산형, ACE AI반도체TOP3+는 HBM 3종 압축형입니다.",
  },
  {
    title: "ETF를 볼 때 시총 상위 기업이 어디에 얼마나 들어있는지가 중요합니다",
    body: "엔비디아, TSMC, 브로드컴, 삼성전자, SK하이닉스가 어느 ETF에 얼마나 담기는지에 따라 수익 곡선이 크게 달라집니다. 같은 반도체 ETF라도 사실상 다른 포트폴리오입니다.",
  },
  {
    title: "추가로 꼭 볼 만한 항목은 환헤지와 상위 1종목 비중입니다",
    body: "원화 상장 ETF 중 미국 반도체를 담더라도 환노출인지 환헤지인지에 따라 체감이 달라집니다. 동시에 상위 1종목 비중이 20% 안팎이면 집중형으로 보는 편이 맞습니다.",
  },
] as const;

export const MATCHING_ROWS = [
  { need: "엔비디아 비중을 강하게 원함", etf: "SMH" },
  { need: "미국 반도체를 정석형으로 분산", etf: "SOXX" },
  { need: "미국 반도체를 원화 계좌로 크게 담고 싶음", etf: "TIGER 미국필라델피아반도체나스닥" },
  { need: "국내 HBM 핵심 3종에 집중", etf: "ACE AI반도체TOP3+" },
  { need: "국내 AI 반도체 밸류체인을 넓게", etf: "RISE AI반도체TOP10" },
  { need: "환율 부담을 줄인 미국 반도체 접근", etf: "RISE 미국반도체NYSE(H)" },
  { need: "글로벌 4대 핵심 축을 압축", etf: "ACE 글로벌반도체TOP4 Plus" },
] as const;

export const REFERENCES = {
  official: [
    { label: "VanEck SMH 공식 페이지", href: "https://www.vaneck.com/us/en/investments/semiconductor-etf-smh/" },
    { label: "iShares SOXX 공식 페이지", href: "https://www.ishares.com/us/products/239705/ishares-phlx-semiconductor-etf/" },
    { label: "State Street XSD 공식 페이지", href: "https://www.ssga.com/us/en/individual/etfs/funds/spdr-sp-semiconductor-etf-xsd" },
    { label: "RISE AI반도체TOP10 공식 페이지", href: "https://www.riseetf.co.kr/prod/finderDetail/44J0" },
    { label: "RISE 미국반도체NYSE(H) 공식 페이지", href: "https://www.riseetf.co.kr/prod/finderDetail/44F4" },
    { label: "TIGER 미국필라델피아반도체나스닥 공식 페이지", href: "https://www.tigeretf.com/ko/product/search/detail/index.do?ksdFund=KR7381180009" },
    { label: "TIGER Fn반도체TOP10 공식 페이지", href: "https://www.tigeretf.com/ko/product/search/detail/index.do?ksdFund=KR7396500001" },
  ],
  market: [
    { label: "반도체 시총 순위 CompaniesMarketCap", href: "https://companiesmarketcap.com/semiconductors/largest-semiconductor-companies-by-market-cap/" },
    { label: "달러/원 환율 히스토리 참고", href: "https://www.exchange-rates.org/exchange-rate-history/usd-krw-2026" },
  ],
  supporting: [
    { label: "ACE AI반도체TOP3+ 순자산 5000억 기사", href: "https://www.hankyung.com/article/2026031891926" },
    { label: "ACE 글로벌반도체TOP4 Plus 1조 기사", href: "https://www.mk.co.kr/news/etc/11971186" },
    { label: "반도체 밸류체인 리포트", href: "/reports/semiconductor-value-chain/" },
    { label: "적립식 투자 수익 계산기", href: "/tools/dca-investment-calculator/" },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    q: "SOXX와 SMH는 무엇이 가장 다른가요?",
    a: "SOXX는 30종목 분산형에 가깝고, SMH는 엔비디아와 TSMC 비중이 더 높은 집중형입니다. 상승장 탄력은 SMH, 덜 쏠린 구조는 SOXX 쪽으로 보는 편이 이해가 쉽습니다.",
  },
  {
    q: "원화 기준으로 미국 반도체를 사고 싶으면 어떤 ETF가 편한가요?",
    a: "국내 상장 ETF 중에서는 TIGER 미국필라델피아반도체나스닥이 가장 규모가 크고, RISE 미국반도체NYSE(H)는 환헤지형이라는 차이가 있습니다. 원화 매수 편의와 연금 계좌 활용이 장점입니다.",
  },
  {
    q: "국내 반도체 ETF 중 가장 성격이 강한 ETF는 무엇인가요?",
    a: "ACE AI반도체TOP3+는 사실상 삼성전자, SK하이닉스, 한미반도체 중심의 압축 포트폴리오에 가깝습니다. 반대로 RISE AI반도체TOP10은 장비, 테스트, 팹리스까지 넓게 담는 쪽입니다.",
  },
  {
    q: "이 페이지의 시총은 왜 원화로 다시 보여주나요?",
    a: "한국 사용자 입장에서는 달러 시총보다 원화 환산값이 규모 차이를 직관적으로 읽기 쉽기 때문입니다. 다만 이는 비교용 환산값이고 실제 시장가치는 환율에 따라 달라집니다.",
  },
] as const;

export const RELATED_LINKS = [
  { label: "적립식 투자 수익 계산기", href: "/tools/dca-investment-calculator/" },
  { label: "FIRE 계산기", href: "/tools/fire-calculator/" },
  { label: "반도체 밸류체인 한눈에 보기", href: "/reports/semiconductor-value-chain/" },
  { label: "비교 리포트 전체 보기", href: "/reports/" },
] as const;
