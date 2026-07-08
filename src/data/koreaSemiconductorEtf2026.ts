// ── 타입 ──────────────────────────────────────────

export type EquityCategory = "TOP2" | "TOP3" | "BROAD";

export type EquityEtf = {
  ticker: string;
  name: string;
  manager: string;
  category: EquityCategory;
  categoryLabel: string;
  focus: string;
  expenseRatio: number | null;
  aumKrwBillion: number;
  aumLabel: string;
  listedDate: string;
  fit: string;
};

export type BondMixEtf = {
  ticker: string;
  name: string;
  manager: string;
  structure: string;
  expenseRatio: number | null;
  note: string;
};

export type SolKodexComparisonRow = {
  label: string;
  sol: string;
  kodex: string;
};

export type MatchingRow = {
  need: string;
  etf: string;
};

export type FaqItem = { question: string; answer: string };
export type RelatedLink = { href: string; label: string; description: string };

// ── 데이터 ────────────────────────────────────────

export const KSE_META = {
  slug: "korea-semiconductor-etf-2026",
  title: "국내 반도체 ETF, 뭐가 다를까",
  seoTitle: "국내 반도체 ETF 2026 | SOL·KODEX·ACE 뭐가 다를까 총정리",
  seoDescription:
    "SOL·KODEX AI반도체TOP2플러스, ACE AI반도체TOP3+, TIGER 반도체TOP10 등 국내 상장 반도체 ETF 10종의 구성종목·보수·순자산을 비교. 연금계좌용 채권혼합형까지 포함.",
  description:
    "SOL·KODEX·ACE·TIGER·1Q·HANARO 등 국내 상장 반도체 ETF 10종을 구조·보수·순자산 기준으로 비교하고, 연금·IRP용 채권혼합형까지 정리했습니다.",
  updatedAt: "2026-07-08",
  dataNote:
    "총보수·순자산·구성종목은 각 운용사 공식 페이지 기준이며 리밸런싱마다 바뀔 수 있습니다. 실제 투자 전에는 반드시 운용사 공식 페이지에서 최신 정보를 다시 확인하세요. 이 리포트는 투자를 추천하지 않습니다.",
};

export const KSE_EQUITY_ETFS: EquityEtf[] = [
  {
    ticker: "0167A0",
    name: "SOL AI반도체TOP2플러스",
    manager: "신한자산운용",
    category: "TOP2",
    categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스·SK스퀘어 중심 + AI 소부장 10종목",
    expenseRatio: 0.45,
    aumKrwBillion: 69900,
    aumLabel: "약 6.99조",
    listedDate: "2026-03-17",
    fit: "하이닉스·HBM·AI 서버 밸류체인 강세에 베팅하고 싶을 때",
  },
  {
    ticker: "395160",
    name: "KODEX AI반도체TOP2플러스",
    manager: "삼성자산운용",
    category: "TOP2",
    categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스 합산 약 50% + AI 반도체 소부장",
    expenseRatio: 0.45,
    aumKrwBillion: 46064,
    aumLabel: "약 4.61조",
    listedDate: "2021-07-30 (2026-05 리뉴얼)",
    fit: "SOL과 같은 컨셉을 삼성 운용사 상품으로 담고 싶을 때",
  },
  {
    ticker: "469150",
    name: "ACE AI반도체TOP3+",
    manager: "한국투자신탁운용",
    category: "TOP3",
    categoryLabel: "TOP3+형",
    focus: "SK하이닉스·삼성전자·한미반도체 약 75% 압축",
    expenseRatio: 0.3,
    aumKrwBillion: 12000,
    aumLabel: "약 1.2조",
    listedDate: "2023-10-17",
    fit: "한미반도체 등 HBM 장비주까지 강하게 보고 싶을 때",
  },
  {
    ticker: "0182R0",
    name: "1Q K반도체TOP2+",
    manager: "하나자산운용",
    category: "TOP2",
    categoryLabel: "TOP2+형",
    focus: "삼성전자·SK하이닉스 중심 + SK스퀘어·삼성전기 편입",
    expenseRatio: 0.2,
    aumKrwBillion: 2543,
    aumLabel: "약 2,543억",
    listedDate: "2026-04",
    fit: "보수에 민감하고 저비용 TOP2+ 상품을 원할 때",
  },
  {
    ticker: "396500",
    name: "TIGER 반도체TOP10",
    manager: "미래에셋자산운용",
    category: "BROAD",
    categoryLabel: "대형분산형",
    focus: "반도체 시총 상위 10종목, 상위 2개 각 25% 구조",
    expenseRatio: 0.45,
    aumKrwBillion: 103000,
    aumLabel: "약 10.3조",
    listedDate: "2021-08-10",
    fit: "가장 무난하게 국내 반도체 대표주 전체에 투자하고 싶을 때",
  },
  {
    ticker: "395270",
    name: "HANARO Fn K-반도체",
    manager: "NH-Amundi자산운용",
    category: "BROAD",
    categoryLabel: "대형분산형",
    focus: "국내 반도체 핵심 20종목, 삼성전기 비중 높은 편",
    expenseRatio: 0.45,
    aumKrwBillion: 45000,
    aumLabel: "약 4.50조",
    listedDate: "2021-07-30",
    fit: "특정 대형주보다 K-반도체 생태계 전체에 분산 투자하고 싶을 때",
  },
];

export const KSE_BOND_MIX_ETFS: BondMixEtf[] = [
  {
    ticker: "0162Z0",
    name: "RISE 삼성전자SK하이닉스채권혼합50",
    manager: "KB자산운용",
    structure: "삼성전자 25% + SK하이닉스 25% + 국고·통안채 50%",
    expenseRatio: 0.01,
    note: "안전자산으로 분류되어 연금계좌 내 최대 100% 투자 가능",
  },
  {
    ticker: "0177N0",
    name: "KODEX 삼성전자SK하이닉스채권혼합50",
    manager: "삼성자산운용",
    structure: "삼성전자 25% + SK하이닉스 25% + 채권 50%",
    expenseRatio: 0.07,
    note: "RISE와 동일 컨셉의 삼성 운용사 상품",
  },
  {
    ticker: "0182S0",
    name: "1Q K반도체TOP2채권혼합50",
    manager: "하나자산운용",
    structure: "반도체 TOP2 50% + 단기국고통안채 50%",
    expenseRatio: 0.01,
    note: "저보수 채권혼합형",
  },
  {
    ticker: "0183V0",
    name: "KIWOOM 삼성전자&SK하이닉스채권혼합50",
    manager: "키움투자자산운용",
    structure: "삼성전자 25% + SK하이닉스 25% + 국고·통안채(잔존만기 3개월~1년) 50%",
    expenseRatio: 0.07,
    note: "2026년 4월 21일 상장한 후발 상품, 순자산·거래량은 상대적으로 작은 편",
  },
];

export const KSE_SOL_KODEX_COMPARISON: SolKodexComparisonRow[] = [
  { label: "운용사", sol: "신한자산운용", kodex: "삼성자산운용" },
  { label: "상장", sol: "2026년 3월", kodex: "2021년 7월 (2026년 5월 리뉴얼)" },
  { label: "컨셉", sol: "TOP2 + SK스퀘어 + AI 소부장", kodex: "TOP2 약 50% + AI 소부장" },
  { label: "보수", sol: "0.45%", kodex: "0.45%" },
  { label: "특징", sol: "후발이지만 자금 유입 강함", kodex: "기존 상품 리뉴얼, 운용 이력 김" },
];

export const KSE_MATCHING_ROWS: MatchingRow[] = [
  { need: "반도체 슈퍼사이클에 공격적으로 베팅하고 싶다", etf: "SOL AI반도체TOP2플러스 / KODEX AI반도체TOP2플러스" },
  { need: "한미반도체 등 HBM 장비주까지 강하게 담고 싶다", etf: "ACE AI반도체TOP3+" },
  { need: "가장 무난한 국내 반도체 대표주 ETF를 원한다", etf: "TIGER 반도체TOP10" },
  { need: "특정 종목 쏠림 없이 K-반도체 생태계 전체를 담고 싶다", etf: "HANARO Fn K-반도체" },
  { need: "보수를 최대한 낮추고 싶다", etf: "1Q K반도체TOP2+ (0.20%)" },
  { need: "연금저축·IRP에서 안전자산 비중까지 채우고 싶다", etf: "RISE / KODEX / 1Q 채권혼합50" },
];

export const KSE_FAQ: FaqItem[] = [
  {
    question: "SOL AI반도체TOP2플러스와 가장 비슷한 ETF는 무엇인가요?",
    answer:
      "KODEX AI반도체TOP2플러스가 가장 유사합니다. 둘 다 삼성전자·SK하이닉스를 핵심으로 하고 AI 반도체 소부장을 함께 담으며, 총보수도 0.45%로 동일합니다. SOL은 SK스퀘어 비중이 상대적으로 크고, KODEX는 TOP2 합산 비중을 약 50%로 맞춘 점이 다릅니다.",
  },
  {
    question: "TOP2+와 TOP3+는 뭐가 다른가요?",
    answer:
      "TOP2+는 삼성전자·SK하이닉스 2개 대형주를 중심에 두고 AI 소부장을 추가하는 구조이고, TOP3+(ACE AI반도체TOP3+)는 여기에 한미반도체를 더해 3개 종목에 약 75%를 압축 투자합니다. TOP3+는 HBM 장비주 노출이 커서 상대적으로 변동성이 높을 수 있습니다.",
  },
  {
    question: "반도체 ETF를 연금저축·IRP에 넣어도 되나요?",
    answer:
      "일반 주식형 반도체 ETF는 연금계좌에서도 위험자산으로 분류되어 최대 70%까지만 담을 수 있습니다. RISE·KODEX·1Q의 삼성전자SK하이닉스채권혼합50처럼 주식 50%+채권 50% 구조의 채권혼합형은 안전자산으로 분류되어 연금계좌 내 최대 100%까지 투자할 수 있습니다.",
  },
  {
    question: "채권혼합50 ETF는 안전자산으로 분류되나요?",
    answer:
      "네. RISE 삼성전자SK하이닉스채권혼합50 등은 주식 비중이 50% 이하로 설계되어 자본시장법상 안전자산으로 분류됩니다. 다만 상품마다 세부 요건이 다를 수 있으므로 운용사 공식 페이지에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "보수가 가장 낮은 국내 반도체 ETF는 어디인가요?",
    answer:
      "주식형 중에서는 1Q K반도체TOP2+가 연 0.20%로 가장 낮습니다. 채권혼합형까지 포함하면 RISE·1Q 계열 채권혼합50 상품이 연 0.01%로 더 낮습니다.",
  },
];

export const KSE_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/semiconductor-etf-2026/",
    label: "미국·한국 반도체 ETF 비교 2026",
    description: "SOXX, SMH 등 미국 ETF까지 포함해 원화 기준 체급을 폭넓게 비교합니다.",
  },
  {
    href: "/reports/semiconductor-value-chain/",
    label: "반도체 산업 구조 한눈에 보기",
    description: "설계·장비·전공정·후공정 등 반도체 밸류체인 전체 구조를 정리합니다.",
  },
  {
    href: "/reports/semiconductor-stocks-forecast-2026-2028/",
    label: "반도체 개별 종목 실적 전망 2026~2028",
    description: "삼성전자·SK하이닉스·마이크론·TSMC 실적 전망을 비교합니다.",
  },
  {
    href: "/tools/dca-investment-calculator/?tab=SEMICONDUCTOR",
    label: "반도체 종목 적립식 투자 계산기",
    description: "월 투자금과 기간을 설정해 실제 수익 차이를 비교합니다.",
  },
];
