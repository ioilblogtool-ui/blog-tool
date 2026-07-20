import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const SK_META: GroupOwnershipMeta = {
  groupId: "sk",
  groupName: "SK",
  isLegalHoldingCompany: true,
  holdingCompanyNote:
    "법적 지주회사 SK㈜ — SK스퀘어(반도체·ICT 중간지주), SK이노베이션(에너지·화학 중간지주) 등 중간지주회사를 통해 계열사를 지배하는 다단계 구조입니다.",
  affiliateCount: 151,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "HIGH",
  listedAffiliateCount: 17,
  fairTradeRank: 2,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. SK그룹 상장 계열사는 약 21개로 알려져 있으나, 이 페이지에는 종목코드까지 교차검증된 17개만 표시했습니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — "주 연결선"만 표시
export const SK_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "최태원 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "sk-holdings",
    name: "SK㈜",
    stockCode: "034730",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: 25.41,
  },
  {
    id: "sk-square",
    name: "SK스퀘어",
    stockCode: "402340",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "sk-holdings",
    primaryRatePercent: 32.14,
  },
  {
    id: "sk-hynix",
    name: "SK하이닉스",
    stockCode: "000660",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "sk-square",
    primaryRatePercent: 20.5,
  },
  {
    id: "sk-innovation",
    name: "SK이노베이션",
    stockCode: "096770",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "sk-holdings",
    primaryRatePercent: 51.09,
  },
  {
    id: "sk-telecom",
    name: "SK텔레콤",
    stockCode: "017670",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "sk-holdings",
    primaryRatePercent: 30.57,
  },
  {
    id: "skc",
    name: "SKC",
    stockCode: "011790",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "sk-holdings",
    primaryRatePercent: 40.64,
  },
];

export const SK_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "최태원 → SK㈜ (개인)",
    ratePercent: 17.9,
    baseDate: "2026년 2월",
    sourceLabel: "인베스트조선, 지분 공시 인용 보도",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "최태원 외 특수관계인 → SK㈜ (합산)",
    ratePercent: 25.41,
    baseDate: "2026년 2월",
    sourceLabel: "인베스트조선, 지분 공시 인용 보도",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "SK㈜ 자사주",
    ratePercent: 24.8,
    baseDate: "2026년 2월",
    sourceLabel: "언론 보도 (단일 출처)",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "LOW",
  },
  {
    label: "SK㈜ → SK스퀘어",
    ratePercent: 32.14,
    baseDate: "2026년",
    sourceLabel: "인베스트조선, SK스퀘어 지분구조 기사",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "SK㈜ → SK이노베이션",
    ratePercent: 51.09,
    baseDate: "2026년",
    sourceLabel: "인베스트조선, 지분 공시 인용 보도",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "SK㈜ → SK텔레콤",
    ratePercent: 30.57,
    baseDate: "2026년",
    sourceLabel: "인베스트조선, 지분 공시 인용 보도",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "SK㈜ → SKC",
    ratePercent: 40.64,
    baseDate: "2026년",
    sourceLabel: "인베스트조선, 지분 공시 인용 보도",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/21/2026052180171.html",
    confidence: "MEDIUM",
  },
  {
    label: "SK스퀘어 → SK하이닉스 (최대주주)",
    ratePercent: 20.5,
    baseDate: "2026년",
    sourceLabel: "블로터, SK스퀘어 관련 기사",
    sourceUrl: "https://www.bloter.net/news/articleView.html?idxno=665177",
    confidence: "MEDIUM",
  },
  {
    label: "SK이노베이션 → SK에너지 (비상장 완전자회사)",
    ratePercent: 100,
    baseDate: "2011년 물적분할 이후 상시",
    sourceLabel: "SK이노베이션 뉴스룸",
    sourceUrl: "https://skinnonews.com/archives/25579",
    confidence: "HIGH",
  },
  {
    label: "SK이노베이션 → SK온 (비상장 완전자회사)",
    ratePercent: 100,
    baseDate: "2021년 물적분할 이후 상시",
    sourceLabel: "나무위키, SK온 문서",
    sourceUrl: "https://namu.wiki/w/SK%EC%98%A8",
    confidence: "HIGH",
  },
];

export const SK_KPI_CARDS = [
  { label: "국내 계열사", value: "151개", note: "공정위 2026-05-01 기준", tone: "official" },
  { label: "재계 순위", value: "2위", note: "공정자산 기준", tone: "official" },
  { label: "법적 지주회사", value: "SK㈜", note: "그룹 최상위 지주회사", tone: "official" },
  { label: "상장 계열사", value: "17개", note: "종목코드 교차검증 기준", tone: "official" },
  { label: "최대 연결 단계", value: "3단계", note: "오너→SK㈜→SK스퀘어→하이닉스", tone: "calculated" },
  { label: "상장구조 복잡도", value: "높음", note: "중간지주·다단계 상장 기반 자체 평가", tone: "calculated" },
];

export const SK_BUSINESS_AXES = [
  {
    axis: "반도체·ICT",
    coreCompany: "SK스퀘어",
    companies: "SK하이닉스, ICT 투자회사",
    point: "SK하이닉스가 SK㈜ 직접 자회사가 아니라 SK스퀘어 아래에 있다는 점이 핵심입니다.",
  },
  {
    axis: "통신",
    coreCompany: "SK텔레콤",
    companies: "통신·AI·플랫폼",
    point: "2021년 인적분할 이후 통신 사업회사와 투자회사 역할이 분리됐습니다.",
  },
  {
    axis: "에너지·화학",
    coreCompany: "SK이노베이션",
    companies: "SK에너지, SK온, SK아이이테크놀로지",
    point: "배터리·소재 자회사가 연결돼 있어 모회사 가치 해석에 자회사 가치가 크게 작용합니다.",
  },
  {
    axis: "소재·바이오",
    coreCompany: "SKC·SK디스커버리",
    companies: "소재, 케미칼, 바이오",
    point: "그룹 전체 지주축과 별도로 세부 사업축의 상장사가 여럿 존재합니다.",
  },
];

export const SK_HOLDING_VS_SQUARE = [
  { metric: "역할", skHoldings: "그룹 최상위 지주회사", skSquare: "반도체·ICT 투자회사" },
  { metric: "출범 배경", skHoldings: "기존 SK 지주회사", skSquare: "2021년 SK텔레콤 인적분할" },
  { metric: "핵심 보유 회사", skHoldings: "SK이노베이션, SK텔레콤, SKC 등", skSquare: "SK하이닉스 등" },
  { metric: "주요 수익원", skHoldings: "배당·브랜드·자회사 가치", skSquare: "투자자산 가치·배당" },
  { metric: "SK하이닉스 직접 보유", skHoldings: "아니오", skSquare: "예" },
  { metric: "투자 포인트", skHoldings: "그룹 전체 분산 노출", skSquare: "반도체·ICT 집중 노출" },
  { metric: "주요 리스크", skHoldings: "지주회사 할인", skSquare: "자산가치 할인·투자회사 변동성" },
];

export const SK_HYNIX_CONNECTIONS = [
  {
    label: "SK㈜ → SK스퀘어",
    rate: "32.14%",
    description: "SK㈜가 SK스퀘어를 통해 반도체·ICT 투자축에 연결되는 1단계 지분입니다.",
  },
  {
    label: "SK스퀘어 → SK하이닉스",
    rate: "20.50%",
    description: "SK스퀘어가 SK하이닉스 지분을 보유한 최대주주 연결입니다.",
  },
  {
    label: "SK㈜의 SK하이닉스 단순 간접 연결값",
    rate: "약 6.59%",
    description: "32.14%와 20.50%를 단순 곱한 참고값입니다. 직접 보유 지분이나 동일 의결권이 아닙니다.",
  },
];

export const SK_OWNER_TO_HYNIX_CONNECTIONS = [
  {
    label: "최태원 개인 기준",
    formula: "17.9% × 32.14% × 20.5%",
    value: "약 1.18%",
  },
  {
    label: "특수관계인 합산 기준",
    formula: "25.41% × 32.14% × 20.5%",
    value: "약 1.67%",
  },
];

export const SK_LISTED_STAGE_ROWS = [
  { company: "SK㈜", stockCode: "034730", shareholder: "최태원 외 특수관계인", upperPath: "최상위", stage: "지주회사", business: "그룹 지주" },
  { company: "SK스퀘어", stockCode: "402340", shareholder: "SK㈜", upperPath: "SK㈜", stage: "1단계", business: "반도체·ICT 투자" },
  { company: "SK하이닉스", stockCode: "000660", shareholder: "SK스퀘어", upperPath: "SK㈜→SK스퀘어", stage: "2단계", business: "반도체" },
  { company: "SK이노베이션", stockCode: "096770", shareholder: "SK㈜", upperPath: "SK㈜", stage: "1단계", business: "에너지·화학" },
  { company: "SK아이이테크놀로지", stockCode: "361610", shareholder: "SK이노베이션", upperPath: "SK㈜→SK이노베이션", stage: "2단계", business: "배터리 소재" },
  { company: "SK텔레콤", stockCode: "017670", shareholder: "SK㈜", upperPath: "SK㈜", stage: "1단계", business: "통신·AI" },
  { company: "SKC", stockCode: "011790", shareholder: "SK㈜", upperPath: "SK㈜", stage: "1단계", business: "소재" },
  { company: "SK디스커버리·SK케미칼", stockCode: "006120·285130", shareholder: "별도 축", upperPath: "소재·바이오 축", stage: "2단계 이상", business: "바이오·케미칼" },
];

export const SK_TREASURY_STOCK_NOTES = [
  { label: "최대주주·특수관계인 지분", meaning: "경영권 및 의결권 분석의 기본 축입니다." },
  { label: "자사주", meaning: "회사가 자기 주식을 보유한 것으로, 일반적으로 의결권이 제한됩니다." },
  { label: "자사주 소각", meaning: "발행주식 수 감소로 주당 가치 기대가 달라질 수 있습니다." },
  { label: "자사주 처분", meaning: "유통 주식 수와 지배구조 해석에 영향을 줄 수 있습니다." },
];

export const SK_STRUCTURE_TIMELINE = [
  { year: "2007", event: "SK㈜ 지주회사 전환", impact: "투자회사와 사업회사 역할을 분리하며 지주회사 체제를 만들었습니다." },
  { year: "2011", event: "SK이노베이션 사업 분할", impact: "에너지·화학 자회사 체계가 강화됐습니다." },
  { year: "2021", event: "SK텔레콤 인적분할", impact: "SK텔레콤과 SK스퀘어가 분리되며 반도체·ICT 투자축이 독립했습니다." },
  { year: "2021", event: "SK온 물적분할", impact: "배터리 사업이 비상장 자회사로 분리됐습니다." },
  { year: "2022 이후", event: "비핵심 계열사 정리", impact: "계열사 수 축소와 리밸런싱이 지배구조 해석의 주요 변수가 됐습니다." },
  { year: "최근", event: "리밸런싱·합병 검토", impact: "그룹 재무구조와 중복상장 구조 개선 가능성이 시장에서 주목받고 있습니다." },
];

export const SK_GROUP_COMPARISON = [
  { metric: "법적 지주회사", samsung: "없음", sk: "SK㈜", lg: "㈜LG", hyundai: "없음" },
  { metric: "핵심 구조", samsung: "삼성물산·삼성생명", sk: "SK㈜·중간지주", lg: "㈜LG 중심", hyundai: "현대모비스 중심" },
  { metric: "대표 중간지주", samsung: "제한적", sk: "SK스퀘어·SK이노베이션", lg: "상대적으로 단순", hyundai: "없음" },
  { metric: "상장 깊이", samsung: "복잡", sk: "매우 복잡", lg: "비교적 단순", hyundai: "순환출자 이슈" },
  { metric: "핵심 질문", samsung: "삼성전자 지배구조", sk: "SK하이닉스 간접 보유", lg: "지주회사 할인", hyundai: "순환출자 개편" },
];

export const SK_INVESTOR_INSIGHTS = [
  {
    title: "지주회사 할인",
    body:
      "SK㈜ 주가는 SK스퀘어·SK이노베이션·SK텔레콤·SKC 등 보유 자회사 가치의 단순 합으로 움직이지 않을 수 있습니다. 순차입금, 비상장 자산, 배당 정책, 지주회사 할인율을 함께 봐야 합니다.",
  },
  {
    title: "중간지주 할인",
    body:
      "SK하이닉스에 간접 노출되는 경로는 SK㈜와 SK스퀘어 두 단계입니다. SK스퀘어 자체도 투자회사 할인과 자산가치 변동성을 받을 수 있어 SK하이닉스 직접 투자와 체감이 다릅니다.",
  },
  {
    title: "중복상장 해석",
    body:
      "상장 모회사 아래 상장 자회사가 있으면 자회사 가치가 어느 회사 주가에 얼마나 반영되는지 판단이 어려워집니다. SK㈜→SK스퀘어→SK하이닉스가 대표적인 분석 포인트입니다.",
  },
];

// 상장 계열사 — 이번 조사에서 종목코드까지 교차검증된 17개 (전체 상장사 수는 약 21개로 알려짐, 4개는 미확인)
export const SK_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "SK㈜", stockCode: "034730", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK하이닉스", stockCode: "000660", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK스퀘어", stockCode: "402340", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK텔레콤", stockCode: "017670", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK이노베이션", stockCode: "096770", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SKC", stockCode: "011790", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK바이오팜", stockCode: "326030", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK바이오사이언스", stockCode: "302440", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK가스", stockCode: "018670", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK네트웍스", stockCode: "001740", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK리츠", stockCode: "395400", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK이터닉스", stockCode: "475150", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK아이이테크놀로지", stockCode: "361610", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK디스커버리", stockCode: "006120", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK오션플랜트", stockCode: "100090", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK케미칼", stockCode: "285130", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "SK증권", stockCode: "001510", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const SK_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "SK는 지주회사 체제인가요?",
    answer:
      "예. SK㈜가 공정거래법상 법적 지주회사입니다. SK스퀘어(반도체·ICT), SK이노베이션(에너지·화학) 같은 중간지주회사를 두어 계열사를 다단계로 지배하는 구조입니다.",
  },
  {
    question: "SK㈜와 SK스퀘어는 뭐가 다른가요?",
    answer:
      "SK㈜는 그룹 전체를 지배하는 지주회사이고, SK스퀘어는 2021년 SK텔레콤에서 인적분할해 출범한 반도체·ICT 투자 전담 중간지주회사입니다. SK하이닉스의 최대주주는 SK㈜가 아니라 SK스퀘어(20.5%)입니다.",
  },
  {
    question: "SK하이닉스의 최대주주는 누구인가요?",
    answer:
      "SK스퀘어입니다. SK㈜가 SK스퀘어 지분 32.14%를 보유하고, SK스퀘어가 다시 SK하이닉스 지분 20.5%를 보유하는 2단계 구조입니다.",
  },
  {
    question: "SK그룹 계열사는 몇 개인가요?",
    answer:
      "2026년 5월 1일 공정거래위원회 지정 기준 151개입니다. 2023년 219개로 정점을 찍은 뒤 비핵심 계열사를 대거 정리해 2년 사이 68개가 줄었습니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 계열사 수는 2026년 5월 1일 공정거래위원회 지정 기준이며, 개별 지분율은 2026년 2~7월 사이 보도된 자료를 기준으로 합니다. 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "SK㈜ 주식을 사면 SK하이닉스에도 투자하는 건가요?",
    answer:
      "경제적으로 일부 간접 노출이 있다고 볼 수 있지만 SK하이닉스 주식을 직접 보유하는 것과는 다릅니다. SK㈜ 주가는 다른 계열사 가치, 비상장 자산, 순차입금, 지주회사 할인 등의 영향을 함께 받습니다.",
  },
  {
    question: "SK스퀘어와 SK하이닉스 중 어느 종목이 더 직접적인가요?",
    answer:
      "SK하이닉스 실적과 주가에 직접 노출되려면 SK하이닉스가 더 직접적입니다. SK스퀘어는 SK하이닉스 지분가치 외에도 다른 투자자산과 투자회사 할인율 변화의 영향을 받습니다.",
  },
  {
    question: "SK이노베이션과 SK온은 모두 상장사인가요?",
    answer:
      "SK이노베이션은 상장사이고, SK온은 비상장 자회사입니다. 따라서 SK온의 가치는 SK이노베이션을 통해 간접적으로 반영될 수 있습니다.",
  },
];

export const SK_SEO_INTRO = [
  "SK는 삼성과 달리 공정거래법상 법적 지주회사 체제를 갖춘 그룹입니다. SK㈜가 그룹 전체를 지배하는 최상위 지주회사이고, 그 아래 SK스퀘어(반도체·ICT)와 SK이노베이션(에너지·화학)이라는 두 개의 중간지주회사가 각각 사업 영역을 나눠 관리합니다. 이 다단계 구조 때문에 \"SK하이닉스는 SK㈜ 소유 아닌가?\"라는 질문에는 \"아니요, SK스퀘어가 최대주주입니다\"라고 답해야 정확합니다.",
  "최태원 회장은 SK㈜ 지분 17.9%를 개인 명의로 보유하고, 특수관계인을 합치면 25.41%입니다. SK㈜는 이 지배력을 바탕으로 SK스퀘어 32.14%, SK이노베이션 51.09%, SK텔레콤 30.57%, SKC 40.64%를 보유합니다. SK스퀘어는 2021년 SK텔레콤에서 인적분할해 출범했으며, SK하이닉스 지분 20.5%를 보유한 최대주주입니다.",
  "SK그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 151개로, 삼성(67개)보다 두 배 이상 많습니다. 다만 2023년 219개로 정점을 찍은 뒤 비핵심 계열사를 대거 정리해 2년 사이 68개가 줄었습니다. 상장 계열사는 약 21개로 알려져 있으며, 이 페이지에는 종목코드까지 교차검증된 17개를 표시했습니다.",
];

export const SK_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 SK㈜→SK스퀘어→SK하이닉스로 이어지는 중간지주 구조를 그대로 반영했습니다.",
  "상장 계열사 수는 약 21개로 알려져 있으나, 이 페이지에는 종목코드까지 교차검증된 17개만 표시했습니다. 나머지는 한국거래소(KRX) 확인 후 추가될 예정입니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
