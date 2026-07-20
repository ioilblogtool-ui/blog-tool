import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const LG_META: GroupOwnershipMeta = {
  groupId: "lg",
  groupName: "LG",
  isLegalHoldingCompany: true,
  holdingCompanyNote:
    "순수지주회사 ㈜LG — 별도 제조·판매 사업보다 주요 자회사 지분 보유, 배당, 브랜드 사용료를 중심으로 운영됩니다. 삼성의 교차 지분, SK의 중간지주, 현대차의 순환출자와 비교하면 ㈜LG에서 주요 자회사로 지분이 내려가는 형태가 상대적으로 단순합니다.",
  affiliateCount: 63,
  affiliateCountBaseDate: "2025-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 12,
  fairTradeRank: 4,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도·회사 공식 IR 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. 계열사 수는 2025년 5월 1일 기준으로, 2026년 갱신치는 확인되지 않았습니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — LG는 다중 부모·순환출자 없는 순수 트리
export const LG_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "구광모 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "lg-corp",
    name: "㈜LG",
    stockCode: "003550",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: 42.5,
  },
  {
    id: "lg-electronics",
    name: "LG전자",
    stockCode: "066570",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lg-corp",
    primaryRatePercent: 33.7,
  },
  {
    id: "lg-chem",
    name: "LG화학",
    stockCode: "051910",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lg-corp",
    primaryRatePercent: 34.95,
  },
  {
    id: "lg-energy-solution",
    name: "LG에너지솔루션",
    stockCode: "373220",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lg-chem",
    primaryRatePercent: 79.38,
  },
  {
    id: "lg-uplus",
    name: "LG유플러스",
    stockCode: "032640",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lg-corp",
    primaryRatePercent: 38.25,
  },
  {
    id: "lg-h-and-h",
    name: "LG생활건강",
    stockCode: "051900",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lg-corp",
    primaryRatePercent: 34.74,
  },
];

export const LG_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "구광모 → ㈜LG (개인)",
    ratePercent: 16.6,
    baseDate: "2026년 5월",
    sourceLabel: "인사이트코리아, 자사주 소각 관련 보도",
    sourceUrl: "https://www.insight.co.kr/news/555594",
    confidence: "MEDIUM",
  },
  {
    label: "구광모 외 특수관계인 → ㈜LG (합산)",
    ratePercent: 42.5,
    baseDate: "2026년 기업지배구조보고서",
    sourceLabel: "㈜LG 기업지배구조 보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260601001229&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "㈜LG → LG전자",
    ratePercent: 33.7,
    baseDate: "2026년",
    sourceLabel: "뉴스프라임, LG그룹 지분구조 기사",
    sourceUrl: "https://m.newsprime.co.kr/section_view.html?no=334863",
    confidence: "MEDIUM",
  },
  {
    label: "㈜LG → LG화학",
    ratePercent: 34.95,
    baseDate: "2026년 3월 말",
    sourceLabel: "LG화학 분기보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260514001307&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "㈜LG → LG유플러스",
    ratePercent: 38.25,
    baseDate: "2026년 5월",
    sourceLabel: "LG유플러스 공식 IR 대주주현황",
    sourceUrl: "https://www.lguplus.com/about/ko/investing/info/major-shareholders",
    confidence: "HIGH",
  },
  {
    label: "㈜LG → LG생활건강",
    ratePercent: 34.74,
    baseDate: "2026년",
    sourceLabel: "LG생활건강 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=051900",
    confidence: "MEDIUM",
  },
  {
    label: "㈜LG → LG씨엔에스",
    ratePercent: 45,
    baseDate: "2025년 상장 후",
    sourceLabel: "파이낸셜뉴스, LG CNS 지분 관련 보도",
    sourceUrl: "https://www.fnnews.com/news/202502091840137313",
    confidence: "MEDIUM",
  },
  {
    label: "LG화학 → LG에너지솔루션",
    ratePercent: 79.38,
    baseDate: "2026년 1분기",
    sourceLabel: "LG에너지솔루션 분기보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260514001078&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "LG전자 → 로보스타",
    ratePercent: 33.4,
    baseDate: "2024년 1분기",
    sourceLabel: "에프앤가이드, 로보스타 기업정보",
    sourceUrl: "https://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?gicode=A090360",
    confidence: "MEDIUM",
  },
];

export const LG_KPI_CARDS = [
  { label: "법적 지주회사", value: "㈜LG", note: "순수지주회사 구조", tone: "official" },
  { label: "최대주주 등 지분율", value: "42.5%", note: "2026년 기업지배구조보고서", tone: "official" },
  { label: "상장 계열사", value: "12개", note: "종목코드 교차검증 기준", tone: "official" },
  { label: "대표 손자회사", value: "LG엔솔", note: "㈜LG→LG화학→LG에너지솔루션", tone: "official" },
  { label: "순환출자", value: "없음", note: "주요 지분흐름 기준", tone: "calculated" },
  { label: "핵심 상장 깊이", value: "3단계", note: "비교계산소 자체 분류", tone: "calculated" },
];

export const LG_DIRECT_INDIRECT_ROWS = [
  { type: "직계 자회사", company: "LG전자", connection: "㈜LG가 직접 지분 보유" },
  { type: "직계 자회사", company: "LG화학", connection: "㈜LG가 직접 지분 보유" },
  { type: "직계 자회사", company: "LG유플러스", connection: "㈜LG가 직접 지분 보유" },
  { type: "직계 자회사", company: "LG생활건강", connection: "㈜LG가 직접 지분 보유" },
  { type: "직계 자회사", company: "LG CNS", connection: "㈜LG가 직접 지분 보유" },
  { type: "상장 손자회사", company: "LG에너지솔루션", connection: "㈜LG→LG화학→LG에너지솔루션" },
  { type: "하위 상장회사", company: "LG디스플레이·LG이노텍·로보스타", connection: "LG전자 아래 지분 연결은 회사별 공시 확인 필요" },
  { type: "하위 상장회사", company: "LG헬로비전", connection: "LG유플러스 아래 연결" },
];

export const LG_ENSOL_CONNECTIONS = [
  {
    label: "㈜LG → LG화학",
    rate: "34.95%",
    description: "㈜LG가 LG화학 보통주를 보유한 직접 지분율입니다.",
  },
  {
    label: "LG화학 → LG에너지솔루션",
    rate: "79.38%",
    description: "LG화학이 LG에너지솔루션을 보유한 최대주주 지분율입니다.",
  },
  {
    label: "㈜LG의 LG에너지솔루션 단순 간접 연결값",
    rate: "약 27.74%",
    description: "34.95%와 79.38%를 단순 곱한 경제적 연결 참고값입니다.",
  },
];

export const LG_OWNER_TO_ENSOL_CONNECTIONS = [
  { label: "최대주주 등 → ㈜LG", formula: "42.5%", value: "42.5%" },
  { label: "㈜LG → LG화학", formula: "34.95%", value: "34.95%" },
  { label: "LG화학 → LG에너지솔루션", formula: "79.38%", value: "79.38%" },
  { label: "전체 단순 연결값", formula: "42.5% × 34.95% × 79.38%", value: "약 11.79%" },
];

export const LG_THREE_STOCK_COMPARISON = [
  { metric: "회사 성격", lgCorp: "순수지주회사", lgChem: "화학·첨단소재 및 배터리 모회사", lgEnsol: "배터리 사업회사" },
  { metric: "LG엔솔 직접 보유", lgCorp: "아니오", lgChem: "예, 79.38%", lgEnsol: "자기 사업" },
  { metric: "주요 가치 원천", lgCorp: "여러 자회사 지분·배당·브랜드", lgChem: "화학사업·첨단소재·LG엔솔 지분", lgEnsol: "배터리 실적·수주·가동률" },
  { metric: "투자 노출", lgCorp: "LG그룹 전반", lgChem: "화학+배터리 간접", lgEnsol: "배터리 직접" },
  { metric: "주요 할인 요인", lgCorp: "지주회사 할인", lgChem: "모회사 할인·복합사업 할인", lgEnsol: "고평가·업황 변동" },
  { metric: "주가 핵심 변수", lgCorp: "자회사 가치·배당·자사주", lgChem: "석유화학·양극재·LG엔솔 가치", lgEnsol: "전기차 수요·배터리 가격" },
];

export const LG_CHEM_DISCOUNT_REASONS = [
  { title: "모회사 할인", body: "LG화학이 LG에너지솔루션 지분을 많이 보유해도 그 가치가 LG화학 시가총액에 100% 반영되지 않을 수 있습니다." },
  { title: "현금화 제약", body: "경영권과 연결된 핵심 지분이라 대규모 매각 가능성이 제한적입니다." },
  { title: "자체 사업 실적", body: "석유화학·첨단소재 등 LG화학 별도 사업의 실적과 재무 부담이 함께 반영됩니다." },
  { title: "이중상장 구조", body: "모회사와 핵심 자회사가 모두 상장돼 투자자가 배터리 사업에 직접 투자할 수 있습니다." },
  { title: "배당 연결의 한계", body: "자회사 가치 상승이 모회사 주주에게 즉시 현금으로 배분되는 것은 아닙니다." },
];

export const LG_SPINOFF_COMPARISON = [
  { item: "배터리 사업", before: "LG화학 내부 사업부", after: "LG에너지솔루션 별도 법인" },
  { item: "기존 LG화학 주주", before: "배터리 사업을 회사 내부에서 보유", after: "LG엔솔 주식을 직접 배정받지 않음" },
  { item: "LG화학", before: "배터리 사업 직접 수행", after: "LG엔솔 최대주주" },
  { item: "투자자 선택", before: "LG화학으로 배터리 노출", after: "LG엔솔 직접 투자 가능" },
  { item: "시장 이슈", before: "복합사업 가치", after: "모회사 할인·중복상장 논란" },
];

export const LG_NAV_FORMULA_ROWS = [
  { input: "LG전자 시가총액", description: "기준일 시가총액" },
  { input: "㈜LG 보유지분율", description: "최신 공시 기준" },
  { input: "LG화학·LG유플러스·LG생활건강·LG CNS 시가총액", description: "상장 자회사 가치 산정" },
  { input: "비상장 자산", description: "사용자 추정 또는 별도 평가" },
  { input: "순현금·순차입금", description: "공시 기준 입력" },
  { input: "㈜LG 시가총액", description: "할인율 계산 기준" },
];

export const LG_LISTED_DEPTH_ROWS = [
  { stage: "1단계", companies: "㈜LG", note: "최상위 순수지주회사" },
  { stage: "2단계", companies: "LG전자·LG화학·LG유플러스·LG생활건강·LG CNS", note: "㈜LG가 직접 보유한 주요 상장 자회사" },
  { stage: "3단계", companies: "LG에너지솔루션", note: "LG화학 아래 대표 상장 손자회사" },
  { stage: "하위 상장", companies: "LG디스플레이·LG이노텍·로보스타·LG헬로비전", note: "사업회사 아래 연결은 회사별 공시 확인 필요" },
];

export const LG_BUSINESS_AXES = [
  { axis: "전자·가전", companies: "LG전자", business: "가전·TV·전장·B2B" },
  { axis: "디스플레이·부품", companies: "LG디스플레이·LG이노텍", business: "패널·카메라모듈·전자부품" },
  { axis: "화학·소재", companies: "LG화학", business: "석유화학·첨단소재" },
  { axis: "배터리", companies: "LG에너지솔루션", business: "전기차·ESS 배터리" },
  { axis: "통신", companies: "LG유플러스·LG헬로비전", business: "이동통신·인터넷·방송" },
  { axis: "생활소비재", companies: "LG생활건강", business: "화장품·생활용품·음료" },
  { axis: "IT 서비스", companies: "LG CNS", business: "클라우드·DX·AI" },
  { axis: "로봇", companies: "로보스타", business: "산업용 로봇" },
];

export const LG_CNS_LISTING_POINTS = [
  "비상장 자회사였던 LG CNS의 시장가치가 상장으로 가시화됩니다.",
  "㈜LG가 보유한 LG CNS 지분가치 산정이 쉬워져 NAV 계산 정확도가 높아질 수 있습니다.",
  "자회사 상장만으로 지주회사 할인이 자동 해소되는 것은 아닙니다.",
  "상장 후 지분 희석 여부, 보호예수, 매각 가능성을 별도로 확인해야 합니다.",
];

export const LG_GROUP_COMPARISON = [
  { metric: "법적 지주회사", lg: "㈜LG", samsung: "없음", sk: "SK㈜", hyundai: "없음" },
  { metric: "최상위 구조", lg: "순수지주회사", samsung: "교차 지분", sk: "지주·중간지주", hyundai: "순환출자" },
  { metric: "지분 흐름", lg: "대체로 단방향", samsung: "복수 연결", sk: "다단계", hyundai: "원형 고리" },
  { metric: "대표 손자회사", lg: "LG에너지솔루션", samsung: "다수 연결", sk: "SK하이닉스", hyundai: "순환고리 중심" },
  { metric: "대표 중복상장", lg: "LG화학·LG엔솔", samsung: "삼성물산·주요 계열사", sk: "SK㈜·SK스퀘어·SK하이닉스", hyundai: "현대모비스·현대차·기아" },
  { metric: "투자 핵심", lg: "지주·모회사 할인", samsung: "복잡한 지배관계", sk: "중간지주 할인", hyundai: "개편 시나리오" },
];

// 상장 계열사 12개 — 이번 조사에서 종목코드 교차검증
export const LG_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "㈜LG", stockCode: "003550", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG전자", stockCode: "066570", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG화학", stockCode: "051910", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG에너지솔루션", stockCode: "373220", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG이노텍", stockCode: "011070", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG디스플레이", stockCode: "034220", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG유플러스", stockCode: "032640", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG생활건강", stockCode: "051900", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG헬로비전", stockCode: "037560", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LG씨엔에스", stockCode: "064400", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "로보스타", stockCode: "090360", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HSAD", stockCode: "035000", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
];

export const LG_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "LG는 왜 지배구조가 가장 단순하다고 평가받나요?",
    answer:
      "삼성의 교차 지분, SK의 중간지주, 현대차의 순환출자와 비교하면 ㈜LG라는 순수지주회사에서 주요 자회사로 지분이 내려가는 형태가 상대적으로 단순합니다. 다만 LG화학→LG에너지솔루션처럼 사업회사 아래 상장 자회사가 존재하므로 투자 구조까지 모두 단순한 것은 아닙니다.",
  },
  {
    question: "㈜LG는 무슨 사업을 하나요?",
    answer:
      "별도 사업을 하지 않는 순수지주회사입니다. LG전자·LG화학·LG유플러스·LG생활건강 등 자회사 지분을 보유하고 배당·상표권 수익으로 운영됩니다.",
  },
  {
    question: "LG에너지솔루션은 ㈜LG 소유인가요?",
    answer:
      "㈜LG가 직접 보유하지는 않습니다. ㈜LG가 LG화학 지분 34.95%를 보유하고, LG화학이 LG에너지솔루션 지분 79.38%를 보유하는 구조입니다. 따라서 LG에너지솔루션은 ㈜LG와 간접적으로 연결된 상장 손자회사에 해당합니다.",
  },
  {
    question: "LG그룹 상장 계열사는 몇 개인가요?",
    answer:
      "2026년 기준 12개입니다. ㈜LG·LG전자·LG화학처럼 잘 알려진 곳부터, 사업회사(LG전자)의 자회사인 로보스타처럼 지주사 직계가 아닌 상장사도 포함됩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 계열사 수는 2025년 5월 1일 기준으로 2026년 갱신치가 확인되지 않았으니, 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "㈜LG 주식을 사면 LG에너지솔루션에도 투자하는 건가요?",
    answer:
      "LG화학 지분을 통해 경제적으로 일부 간접 노출된다고 볼 수 있지만 LG에너지솔루션 주식을 직접 보유하는 것과는 다릅니다. ㈜LG 주가는 LG전자·LG화학·LG유플러스·LG생활건강·LG CNS 등 여러 자회사 가치와 지주회사 할인의 영향을 함께 받습니다.",
  },
  {
    question: "LG화학과 LG에너지솔루션 중 어느 종목이 배터리에 더 직접적인가요?",
    answer:
      "LG에너지솔루션이 배터리 사업 실적에 더 직접적으로 노출됩니다. LG화학은 LG에너지솔루션 지분을 보유하지만 석유화학·첨단소재 등 자체 사업과 재무구조의 영향도 함께 받습니다.",
  },
  {
    question: "LG는 지배구조가 단순한데 왜 지주회사 할인이 생기나요?",
    answer:
      "구조가 단순하더라도 자회사 지분을 자유롭게 매각하기 어렵고, 자회사 가치가 지주회사 주주에게 직접 배분되지 않으며, 세금·운영비용·중복상장·자본 배분 문제가 존재할 수 있기 때문입니다.",
  },
];

export const LG_SEO_INTRO = [
  "LG는 주요 대기업집단 가운데 비교적 단순한 순수지주회사 구조입니다. 삼성처럼 여러 계열사가 교차로 지분을 보유하지도 않고, 현대차처럼 순환출자도 없습니다. ㈜LG라는 순수지주회사 하나가 최상단에서 LG전자·LG화학·LG유플러스·LG생활건강 지분을 한 방향으로 보유합니다.",
  "구광모 회장 등 최대주주 측은 ㈜LG 지분 42.5%를 보유한 것으로 기업지배구조보고서에 표시돼 있습니다. ㈜LG는 이 지배력을 바탕으로 LG전자, LG화학, LG유플러스, LG생활건강 등 주요 자회사 지분을 보유합니다. LG에너지솔루션은 ㈜LG가 직접 보유하지 않고 LG화학을 거친 상장 손자회사라는 점이 자주 헷갈리는 부분입니다.",
  "LG그룹은 2025년 5월 1일 공정거래위원회 기준 국내 계열사 63개, 상장 계열사는 12개입니다. LG전자의 자회사인 로보스타처럼 지주사 직계가 아니라 사업회사 아래 상장된 곳도 있습니다.",
];

export const LG_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도·회사 공식 IR 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 ㈜LG에서 주요 자회사로 한 방향으로 내려가는 순수지주회사 구조를 반영했습니다.",
  "계열사 수는 2025년 5월 1일 기준이며, 2026년 5월 1일 갱신치는 확인되지 않았습니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
