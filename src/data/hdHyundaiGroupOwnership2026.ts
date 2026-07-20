import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const HD_HYUNDAI_META: GroupOwnershipMeta = {
  groupId: "hd-hyundai",
  groupName: "HD현대",
  isLegalHoldingCompany: true,
  holdingCompanyNote:
    "법적 지주회사 HD현대(주) — 조선 부문은 HD한국조선해양을 거치고, HD현대마린솔루션·HD현대일렉트릭·HD현대오일뱅크는 HD현대가 직접 보유하는 혼합형 지주구조입니다.",
  affiliateCount: 29,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 7,
  fairTradeRank: 8,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 KIND·DART 공시, 회사 IR, 주요 보도자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 한국거래소 KIND와 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. 계열사 수는 2026년 공정거래위원회 공시대상기업집단 지정 자료 기준이며, 합병·편입 시점에 따라 차이가 날 수 있습니다.",
};

export const HD_HYUNDAI_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "정몽준 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "hd-hyundai",
    name: "HD현대",
    stockCode: "267250",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: 37.12,
  },
  {
    id: "hd-korea-shipbuilding",
    name: "HD한국조선해양",
    stockCode: "009540",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-hyundai",
    primaryRatePercent: 35.05,
  },
  {
    id: "hd-heavy-industries",
    name: "HD현대중공업",
    stockCode: "329180",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-korea-shipbuilding",
    primaryRatePercent: 69.23,
    secondaryStakes: [{ holderName: "최대주주 등 합산", ratePercent: 69.3 }],
  },
  {
    id: "hd-energy-solution",
    name: "HD현대에너지솔루션",
    stockCode: "322000",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-korea-shipbuilding",
    primaryRatePercent: 53.57,
  },
  {
    id: "hd-oilbank",
    name: "HD현대오일뱅크",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-hyundai",
    primaryRatePercent: 73.85,
  },
  {
    id: "hd-electric",
    name: "HD현대일렉트릭",
    stockCode: "267260",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-hyundai",
    primaryRatePercent: 35.74,
  },
  {
    id: "hd-marine-solution",
    name: "HD현대마린솔루션",
    stockCode: "443060",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-hyundai",
    primaryRatePercent: 55.32,
  },
  {
    id: "hd-site-solution",
    name: "HD현대사이트솔루션",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-hyundai",
    primaryRatePercent: 100,
  },
  {
    id: "hd-construction-equipment",
    name: "HD건설기계",
    stockCode: "267270",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hd-site-solution",
    primaryRatePercent: 37.59,
  },
];

export const HD_HYUNDAI_KPI_CARDS = [
  { label: "법적 지주회사", value: "HD현대", note: "2017년 인적분할 이후 그룹 최상위 지주회사" },
  { label: "조선 중간지주", value: "HD한국조선해양", note: "조선·해양 계열 지분과 R&D·투자관리 축" },
  { label: "직접 상장 자회사", value: "일렉트릭·마린솔루션", note: "HD현대가 직접 보유하는 2단계 상장 축" },
  { label: "구조 유형", value: "직접+중간지주 혼합형", note: "사업 부문별 지배 단계가 다름" },
];

export const HD_HYUNDAI_SHIPBUILDING_ROLES = [
  { company: "HD현대", role: "그룹 지주회사", exposure: "조선·정유·전력·건설기계·서비스 전체", discount: "지주회사 할인" },
  { company: "HD한국조선해양", role: "조선 부문 중간지주", exposure: "조선 계열 포트폴리오", discount: "중간지주·중복상장 할인" },
  { company: "HD현대중공업", role: "조선·엔진·방산 사업회사", exposure: "선박 수주·건조·엔진·특수선", discount: "사업 실적 직접 반영" },
];

export const HD_HYUNDAI_INDIRECT_CONNECTIONS = [
  { step: "HD현대 → HD한국조선해양", rate: "35.05%" },
  { step: "HD한국조선해양 → HD현대중공업", rate: "69.23%" },
  { step: "HD현대의 HD현대중공업 단순 간접 연결값", rate: "약 24.27%" },
];

export const HD_HYUNDAI_MARINE_SOLUTION_COMPARISON = [
  { item: "역할", shipbuilding: "조선 부문 중간지주·R&D", marine: "선박 유지보수·부품·디지털 서비스" },
  { item: "HD현대 직접 보유", shipbuilding: "예", marine: "예" },
  { item: "상장 단계", shipbuilding: "HD현대 아래 2단계", marine: "HD현대 아래 2단계" },
  { item: "조선 사이클", shipbuilding: "신규 선박 발주와 자회사 실적 영향", marine: "운항 선박·애프터마켓 수요 영향" },
  { item: "구조 위치", shipbuilding: "조선 자회사 상단", marine: "HD현대 직계 상장 자회사" },
];

export const HD_HYUNDAI_CONSTRUCTION_RESTRUCTURING = [
  { label: "재편 전", structure: "HD현대 → HD현대사이트솔루션 → HD현대건설기계·HD현대인프라코어", note: "건설기계 상장사가 분리돼 있던 구조" },
  { label: "재편 후", structure: "HD현대 → HD현대사이트솔루션 → 통합 HD건설기계", note: "중복 사업·조직 통합으로 단일 축 강화" },
];

export const HD_HYUNDAI_OILBANK_POINTS = [
  "HD현대의 핵심 비상장 자회사",
  "정유·석유화학 사업으로 정제마진, 유가, 환율에 민감",
  "비상장이라 시가총액을 직접 확인하기 어려움",
  "HD현대 NAV 산정에서 큰 불확실성으로 작동",
  "상장 추진 여부와 일정은 공식 공시 확인 전까지 확정 표현을 피해야 함",
];

export const HD_HYUNDAI_NAV_FORMULA_ROWS = [
  "HD한국조선해양 시가총액 × 35.05%",
  "HD현대일렉트릭 시가총액 × 보유지분율",
  "HD현대마린솔루션 시가총액 × 55.32%",
  "HD현대오일뱅크 추정가치 × 보유지분율",
  "HD현대사이트솔루션 등 비상장 자회사 추정가치",
  "+ 기타 자산 + 순현금 - 순차입금",
  "= HD현대 추정 NAV",
];

export const HD_HYUNDAI_LISTING_DEPTH_ROWS = [
  { path: "HD현대 → HD한국조선해양 → HD현대중공업", depth: "3단계", meaning: "상장 지주회사·상장 중간지주·상장 사업회사" },
  { path: "HD현대 → HD현대마린솔루션", depth: "2단계", meaning: "HD현대 직계 상장 자회사" },
  { path: "HD현대 → HD현대일렉트릭", depth: "2단계", meaning: "전력기기 직접 투자 축" },
  { path: "HD현대 → HD현대사이트솔루션 → HD건설기계", depth: "3단계", meaning: "비상장 중간회사 경유 건설기계 축" },
];

export const HD_HYUNDAI_BUSINESS_AXES = [
  { axis: "조선·해양", holder: "HD한국조선해양", companies: "HD현대중공업, HD현대마린엔진, HD현대삼호" },
  { axis: "선박 서비스", holder: "HD현대 직계", companies: "HD현대마린솔루션" },
  { axis: "에너지", holder: "HD현대 직계", companies: "HD현대오일뱅크, HD현대에너지솔루션" },
  { axis: "전기·전력", holder: "HD현대 직계", companies: "HD현대일렉트릭" },
  { axis: "건설기계", holder: "HD현대사이트솔루션", companies: "HD건설기계" },
  { axis: "로봇", holder: "그룹 연결", companies: "HD현대로보틱스" },
];

export const HD_HYUNDAI_LISTED_DETAIL_ROWS = [
  { name: "HD현대", code: "267250", business: "지주", parent: "정몽준 외", depth: "1", nature: "그룹 전체" },
  { name: "HD한국조선해양", code: "009540", business: "조선 중간지주", parent: "HD현대", depth: "2", nature: "조선 포트폴리오" },
  { name: "HD현대중공업", code: "329180", business: "조선·엔진·방산", parent: "HD한국조선해양", depth: "3", nature: "조선 직접" },
  { name: "HD현대일렉트릭", code: "267260", business: "전력기기", parent: "HD현대", depth: "2", nature: "전력망 직접" },
  { name: "HD현대마린솔루션", code: "443060", business: "선박 서비스", parent: "HD현대", depth: "2", nature: "애프터마켓" },
  { name: "HD현대에너지솔루션", code: "322000", business: "태양광", parent: "HD한국조선해양", depth: "3", nature: "신재생에너지" },
  { name: "HD건설기계", code: "267270", business: "건설장비", parent: "HD현대사이트솔루션", depth: "3", nature: "건설기계" },
];

export const HD_HYUNDAI_RESTRUCTURING_TIMELINE = [
  { period: "2017년", event: "당시 현대중공업 인적분할", meaning: "지주회사 체제 출범" },
  { period: "2021년", event: "조선사업회사 HD현대중공업 상장", meaning: "HD현대→HD한국조선해양→HD현대중공업 3단계 상장 구조 형성" },
  { period: "2024년", event: "HD현대마린솔루션 상장", meaning: "선박 서비스 직계 상장 자회사 추가" },
  { period: "2024년", event: "STX중공업 인수", meaning: "선박 엔진 축 강화" },
  { period: "2025~2026년", event: "조선·건설기계 합병 재편", meaning: "계열사 수와 지분율 기준일 혼재 주의" },
];

export const HD_HYUNDAI_GROUP_COMPARISON = [
  { group: "HD현대", keyword: "직접+중간지주 혼합형", issue: "조선 3단계 상장과 비상장 오일뱅크 가치" },
  { group: "삼성", keyword: "핵심회사 간 지분 연결", issue: "삼성생명·물산·전자 연결" },
  { group: "SK", keyword: "중간지주", issue: "SK스퀘어와 SK하이닉스 할인" },
  { group: "LG", keyword: "순수지주", issue: "LG화학·LG엔솔 간접 노출" },
  { group: "현대차", keyword: "순환출자", issue: "현대모비스·현대차·기아 고리" },
  { group: "한화", keyword: "인적분할", issue: "2026년 분할과 한화에너지 연결" },
];

export const HD_HYUNDAI_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "정몽준 → HD현대 (개인)",
    ratePercent: 26.6,
    baseDate: "2026년 4월",
    sourceLabel: "이코노믹데일리, 재벌승계지도 기사",
    sourceUrl: "https://m.ekn.kr/view.php?key=20260410021244946",
    confidence: "MEDIUM",
  },
  {
    label: "정기선 → HD현대 (개인)",
    ratePercent: 6.12,
    baseDate: "2026년 4월",
    sourceLabel: "이코노믹데일리, 재벌승계지도 기사",
    sourceUrl: "https://m.ekn.kr/view.php?key=20260410021244946",
    confidence: "MEDIUM",
  },
  {
    label: "정몽준 외 5인 → HD현대 (최대주주+특수관계인 합산)",
    ratePercent: 37.12,
    baseDate: "2026-07-15",
    sourceLabel: "위즈리포트 지분현황 (DART 연동)",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1010001.aspx?cmp_cd=267250",
    confidence: "HIGH",
  },
  {
    label: "HD현대 → HD한국조선해양",
    ratePercent: 35.05,
    baseDate: "2026-03-20",
    sourceLabel: "KIND, HD한국조선해양 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260320001327&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "HD현대 → HD현대오일뱅크 (직접)",
    ratePercent: 73.85,
    baseDate: "2026년 4월",
    sourceLabel: "세이프타임즈, HD현대중공업 관련 기사",
    sourceUrl: "https://www.safetimes.co.kr/news/articleView.html?idxno=238749",
    confidence: "MEDIUM",
  },
  {
    label: "HD현대 → HD현대일렉트릭 (직접)",
    ratePercent: 35.74,
    baseDate: "2026년 4월",
    sourceLabel: "세이프타임즈, HD현대중공업 관련 기사",
    sourceUrl: "https://www.safetimes.co.kr/news/articleView.html?idxno=238749",
    confidence: "MEDIUM",
  },
  {
    label: "HD현대 → HD현대마린솔루션 (최대주주 등 합산)",
    ratePercent: 55.32,
    baseDate: "2026-05-29",
    sourceLabel: "KIND, HD현대마린솔루션 기업지배구조보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260529001481&docno=&method=search&viewerhost=&viewerport=",
    confidence: "HIGH",
  },
  {
    label: "HD현대 → HD현대사이트솔루션 (완전자회사)",
    ratePercent: 100,
    baseDate: "2025년 재편",
    sourceLabel: "더벨, 건설기계 중복사업 통합 기사",
    sourceUrl: "https://www.thebell.co.kr/free/content/ArticleView.asp?key=202507011656216600103430",
    confidence: "MEDIUM",
  },
  {
    label: "HD한국조선해양 → HD현대중공업 (직접)",
    ratePercent: 69.23,
    baseDate: "2026-03-20",
    sourceLabel: "KIND, HD한국조선해양 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260320001327&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "HD한국조선해양 외 → HD현대중공업 (최대주주 등 합산)",
    ratePercent: 69.3,
    baseDate: "2026-06-01",
    sourceLabel: "KIND, HD현대중공업 기업지배구조보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260601000769&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "HD한국조선해양 → HD현대에너지솔루션",
    ratePercent: 53.57,
    baseDate: "2026년",
    sourceLabel: "GoInsider, HD현대에너지솔루션 기업정보",
    sourceUrl: "https://goinsider.kr/stock/01199550",
    confidence: "MEDIUM",
  },
  {
    label: "HD현대사이트솔루션 → HD건설기계",
    ratePercent: 37.59,
    baseDate: "2026년 초 합병 후",
    sourceLabel: "더벨, 건설기계 중복사업 통합 기사",
    sourceUrl: "https://www.thebell.co.kr/free/content/ArticleView.asp?key=202507011656216600103430",
    confidence: "MEDIUM",
  },
];

export const HD_HYUNDAI_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "HD현대", stockCode: "267250", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD한국조선해양", stockCode: "009540", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD현대중공업", stockCode: "329180", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD현대일렉트릭", stockCode: "267260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD현대에너지솔루션", stockCode: "322000", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD현대마린솔루션", stockCode: "443060", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "HD건설기계", stockCode: "267270", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const HD_HYUNDAI_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "HD현대는 지주회사 체제인가요?",
    answer: "예. 2017년 당시 현대중공업 인적분할을 통해 지주회사 체제가 출범했고, 현재 HD현대(주)가 그룹 최상위 법적 지주회사 역할을 합니다.",
  },
  {
    question: "HD현대는 왜 부문마다 지배 방식이 다른가요?",
    answer:
      "조선 부문은 HD한국조선해양이라는 중간지주 성격의 회사를 거치지만, HD현대마린솔루션·HD현대일렉트릭·HD현대오일뱅크는 HD현대가 직접 보유합니다. 건설기계는 HD현대사이트솔루션을 거칩니다.",
  },
  {
    question: "HD현대중공업의 최대주주는 누구인가요?",
    answer:
      "HD한국조선해양이 최대주주입니다. 2026년 3월 사업보고서 기준 직접 지분율은 69.23%이며, 2026년 기업지배구조보고서 기준 최대주주 등 합산 지분율은 69.30%로 표시했습니다.",
  },
  {
    question: "HD현대마린솔루션은 어느 회사의 자회사인가요?",
    answer:
      "HD현대가 직접 최대주주인 상장회사로 보는 것이 적절합니다. 조선 관련 서비스 사업을 하지만 지분구조상 HD한국조선해양 아래가 아니라 HD현대 직계 상장 자회사 축에 놓았습니다.",
  },
  {
    question: "HD현대오일뱅크는 상장회사인가요?",
    answer: "아니오. 현재 페이지 기준 비상장 핵심 자회사로 분류했습니다. 정유·석유화학 사업 가치가 HD현대 NAV 산정에 중요하지만, 비상장이라 시장 시가총액을 직접 확인하기 어렵습니다.",
  },
  {
    question: "HD현대 주식을 사면 조선업에 투자하는 건가요?",
    answer:
      "조선업에 간접적으로 노출되지만 조선업만 보유하는 것은 아닙니다. HD현대는 HD한국조선해양뿐 아니라 정유, 전력기기, 선박 서비스, 건설기계 등 여러 사업가치의 영향을 받습니다.",
  },
  {
    question: "HD한국조선해양과 HD현대중공업 중 어느 종목이 조선업에 더 직접적인가요?",
    answer:
      "선박 수주·건조·엔진·특수선 사업에 직접 노출되는 쪽은 HD현대중공업입니다. HD한국조선해양은 여러 조선 계열사의 가치와 중간지주 할인 영향을 함께 받습니다.",
  },
  {
    question: "HD현대그룹 상장 계열사는 몇 개인가요?",
    answer: "이번 조사에서 종목코드까지 확인된 것은 7개입니다. HD현대·HD한국조선해양 같은 핵심 계열사부터 HD현대마린솔루션까지 포함됩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
];

export const HD_HYUNDAI_SEO_INTRO = [
  "HD현대는 2017년 당시 현대중공업 인적분할 이후 형성된 법적 지주회사 체제입니다. 핵심은 부문마다 지배 단계가 다르다는 점입니다. 조선 부문은 HD한국조선해양을 거쳐 HD현대중공업으로 연결되지만, HD현대마린솔루션과 HD현대일렉트릭은 HD현대가 직접 보유합니다.",
  "정몽준 아산사회복지재단 이사장은 HD현대 지분 26.60%를, 정기선 HD현대 회장은 6.12%를 보유합니다. 최대주주 및 특수관계인 합산 지분은 37.12%로, 이 수치는 위즈리포트가 DART 공시를 직접 연동해 제공하는 만큼 신뢰도가 높습니다.",
  "HD현대그룹은 2026년 공정거래위원회 공시대상기업집단 지정 자료 기준 국내 계열사 29개로 정리했습니다. 다만 HD현대중공업-HD현대미포 합병, 건설기계 계열 재편처럼 기준 시점에 따라 계열사 수와 지분율 해석이 달라질 수 있어, 표마다 기준일을 함께 표시했습니다.",
];

export const HD_HYUNDAI_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "최대주주 및 특수관계인 합산 지분(37.12%)은 위즈리포트가 DART 공시를 직접 연동해 제공하는 수치로 신뢰도가 높습니다.",
  "HD현대마린솔루션은 2026년 기업지배구조보고서 기준 HD현대가 직접 최대주주로 표시되는 상장회사이므로 지분 연결도에 포함했습니다.",
  "HD한국조선해양→HD현대중공업은 직접 지분 69.23%와 최대주주 등 합산 69.30%를 구분했습니다. 기존 75.02%는 과거 또는 합병 전후 기준이 섞였을 가능성이 있어 제거했습니다.",
  "직접 지분과 간접 연결값은 다릅니다. HD현대→HD한국조선해양→HD현대중공업 24.27%는 단순 곱셈 참고값이지 HD현대의 직접 의결권 비율이 아닙니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
