import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const LS_META: GroupOwnershipMeta = {
  groupId: "ls",
  groupName: "LS",
  isLegalHoldingCompany: true,
  holdingCompanyNote:
    "LS그룹은 ㈜LS·E1·인베니가 하나의 상하 지배구조로 연결되지 않고, 구씨 일가의 여러 방계가 각 사업축을 나눠 경영하는 병렬형 사촌경영 구조입니다. ㈜LS가 E1이나 인베니를 자회사로 지배하는 구조는 아닙니다.",
  affiliateCount: 72,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "HIGH",
  listedAffiliateCount: 10,
  fairTradeRank: 14,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 KIND·DART 공시, 회사 IR, 주요 보도자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 한국거래소 KIND와 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. 재계 순위는 14위·15위 두 표기가 함께 보도되고 있어(산정 기준 차이로 추정) 이 페이지는 14위를 채택했습니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — 루트 3개(다중 루트, ㈜LS·E1·인베니는 병렬 축)
export const LS_TREE_NODES: GroupCompany[] = [
  {
    id: "owner-ls",
    name: "구자열 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "ls-corp",
    name: "㈜LS",
    stockCode: "006260",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner-ls",
    primaryRatePercent: 33.11,
  },
  {
    id: "ls-electric",
    name: "LS일렉트릭",
    stockCode: "010120",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "ls-corp",
    primaryRatePercent: 48.47,
  },
  {
    id: "owner-e1",
    name: "구자열 외 특수관계인 (E1)",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "e1",
    name: "E1",
    stockCode: "017940",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner-e1",
    primaryRatePercent: 45.36,
  },
  {
    id: "owner-inveni",
    name: "구자은 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "inveni",
    name: "인베니",
    stockCode: "015360",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner-inveni",
    primaryRatePercent: 40.55,
  },
];

export const LS_KPI_CARDS = [
  { label: "구조 유형", value: "병렬형 사촌경영", note: "㈜LS·E1·인베니가 단일 상하 구조가 아닌 별도 축" },
  { label: "핵심 비상장사", value: "LS전선·LS MnM", note: "㈜LS NAV에서 추정가치가 중요한 회사" },
  { label: "대표 상장 사업회사", value: "LS ELECTRIC", note: "전력기기·자동화 사업에 직접 노출" },
  { label: "대표 다단계 축", value: "LS전선 계열", note: "비상장 핵심회사 아래 상장 케이블·해저 사업회사" },
];

export const LS_AXIS_COMPARISON = [
  {
    axis: "㈜LS 축",
    industry: "전선·전력·동제련·기계",
    listed: "㈜LS, LS ELECTRIC, 가온전선, LS에코에너지, LS마린솔루션, LS머트리얼즈",
    unlisted: "LS전선, LS MnM, LS엠트론",
    relation: "그룹 핵심사업 간접 노출",
  },
  {
    axis: "E1 축",
    industry: "LPG·에너지·유통",
    listed: "E1, LS네트웍스",
    unlisted: "에너지 관련 자회사",
    relation: "㈜LS 자회사 아님",
  },
  {
    axis: "인베니 축",
    industry: "도시가스·투자",
    listed: "인베니",
    unlisted: "예스코 등",
    relation: "㈜LS 자회사로 단순 분류하면 안 됨",
  },
];

export const LS_COSIN_MANAGEMENT_COMPARISON = [
  { label: "최상위 지배회사", common: "1개 중심", ls: "복수 경영축" },
  { label: "오너 경영", common: "한 가족축 집중", ls: "여러 방계가 분담" },
  { label: "지분 연결", common: "위에서 아래로 연결", ls: "병렬 구조 비중이 큼" },
  { label: "이해 포인트", common: "최상위 지주사 확인", ls: "각 사업축을 별도로 확인" },
];

export const LS_CABLE_STRUCTURE = [
  { company: "㈜LS", role: "상장 지주회사", exposure: "LS전선·LS ELECTRIC·LS MnM 등 그룹 핵심사업 간접 노출" },
  { company: "LS전선", role: "비상장 전선 사업회사", exposure: "초고압·해저·통신·산업전선, 소재 사업" },
  { company: "가온전선", role: "상장 케이블 회사", exposure: "전력·통신 케이블 직접 노출" },
  { company: "LS에코에너지", role: "상장 해외 전선 축", exposure: "베트남 등 해외 전선사업 노출" },
  { company: "LS마린솔루션", role: "상장 해저 시공 축", exposure: "해저케이블 포설·해양 엔지니어링" },
];

export const LS_THREE_STOCK_COMPARISON = [
  { item: "상장 여부", ls: "상장", cable: "비상장", electric: "상장" },
  { item: "회사 성격", ls: "지주회사", cable: "전선 사업회사", electric: "전력·자동화 사업회사" },
  { item: "핵심 사업", ls: "자회사 관리·배당", cable: "초고압·해저·통신 케이블", electric: "전력기기·스마트그리드·자동화" },
  { item: "투자 방식", ls: "그룹 핵심사업 간접 노출", cable: "일반 투자자 직접 투자 어려움", electric: "전력설비 사업 직접 노출" },
  { item: "주요 가치 변수", ls: "자회사 가치·배당·할인", cable: "해저케이블 수주·생산능력", electric: "전력망 투자·데이터센터·공장자동화" },
];

export const LS_POWER_VALUE_CHAIN = [
  { stage: "소재", companies: "LS MnM 등", role: "구리·전기동·소재" },
  { stage: "전선", companies: "LS전선·가온전선·LS에코에너지", role: "전력·통신 케이블" },
  { stage: "해저케이블", companies: "LS전선", role: "해저케이블 제조" },
  { stage: "해양 시공", companies: "LS마린솔루션", role: "포설·시공·해양 엔지니어링" },
  { stage: "전력기기", companies: "LS ELECTRIC", role: "변압·배전·자동화·스마트그리드" },
];

export const LS_E1_AXIS_POINTS = [
  { item: "핵심 사업", value: "LPG 수입·유통" },
  { item: "구자열 개인 지분", value: "12.78%" },
  { item: "최대주주 등 합산", value: "45.36%" },
  { item: "㈜LS와 관계", value: "같은 기업집단 소속이나 ㈜LS 자회사는 아님" },
  { item: "투자 변수", value: "LPG 가격·환율·유통마진·자회사 가치" },
];

export const LS_INVENI_AXIS_POINTS = [
  { item: "과거 사명", value: "예스코홀딩스" },
  { item: "현재 사명", value: "INVENI·인베니" },
  { item: "핵심 연결", value: "도시가스·투자 자산" },
  { item: "구조 위치", value: "LS그룹 내 별도 경영축" },
  { item: "데이터 주의", value: "최대주주 지분은 최신 공시 기준 확인 필요" },
];

export const LS_NAV_FORMULA_ROWS = [
  "LS ELECTRIC 지분가치",
  "+ LS전선 추정가치",
  "+ LS MnM 추정가치",
  "+ LS엠트론 및 기타 비상장 자산",
  "- 순차입금",
  "= ㈜LS 추정 NAV",
];

export const LS_CABLE_VALUATION_ROWS = [
  "추정 기업가치 = EBITDA × 비교기업 배수",
  "추정 지분가치 = (기업가치 - 순차입금) × ㈜LS 보유지분율 × (1 - 비상장 할인율)",
  "㈜LS 주당 가치 기여 = 추정 지분가치 ÷ ㈜LS 발행주식 수",
];

export const LS_LISTED_DETAIL_ROWS = [
  { name: "㈜LS", code: "006260", axis: "㈜LS 축", business: "지주", parent: "오너 일가", exposure: "그룹 핵심사업" },
  { name: "LS ELECTRIC", code: "010120", axis: "㈜LS 축", business: "전력·자동화", parent: "㈜LS", exposure: "전력망 직접" },
  { name: "가온전선", code: "000500", axis: "LS전선 축", business: "전선", parent: "최신 공시 확인", exposure: "케이블 직접" },
  { name: "LS에코에너지", code: "229640", axis: "LS전선 축", business: "해외 전선", parent: "최신 공시 확인", exposure: "베트남·전선" },
  { name: "LS마린솔루션", code: "060370", axis: "LS전선 축", business: "해저 시공", parent: "최신 공시 확인", exposure: "해저케이블 시공" },
  { name: "LS머트리얼즈", code: "417200", axis: "소재 축", business: "울트라커패시터·소재", parent: "최신 공시 확인", exposure: "전력·신소재" },
  { name: "E1", code: "017940", axis: "E1 축", business: "LPG", parent: "오너 일가", exposure: "LPG 직접" },
  { name: "LS네트웍스", code: "000680", axis: "E1 축 확인", business: "유통·임대", parent: "최신 공시 확인", exposure: "자산·유통" },
  { name: "인베니", code: "015360", axis: "인베니 축", business: "도시가스·투자", parent: "오너 일가", exposure: "자산가치" },
  { name: "LS증권", code: "078020", axis: "그룹 편입축 확인", business: "증권", parent: "최신 최대주주 확인", exposure: "금융" },
];

export const LS_GROUP_COMPARISON = [
  { group: "LS", structure: "복수 병렬 경영축", family: "사촌경영", issue: "전력망·해저케이블, 비상장 LS전선 가치" },
  { group: "LG", structure: "단일 순수지주", family: "한 경영축 중심", issue: "지주·모회사 할인" },
  { group: "SK", structure: "최상위·중간지주", family: "단일 오너축", issue: "중간지주 할인" },
  { group: "한화", structure: "핵심회사·비상장 연결", family: "3형제 사업 분화", issue: "승계·분할" },
  { group: "HD현대", structure: "직접+중간지주 혼합형", family: "정몽준·정기선 축", issue: "조선 중복상장·오일뱅크 가치" },
];

export const LS_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "구자열 외 44인 → ㈜LS (합산)",
    ratePercent: 33.11,
    baseDate: "2026-06-26",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=006260",
    confidence: "MEDIUM",
  },
  {
    label: "구자은 → ㈜LS (개인)",
    ratePercent: 3.63,
    baseDate: "2025년 9월 말~2026년 3월",
    sourceLabel: "비즈니스포스트, 구자은 회장 소개 기사",
    sourceUrl: "https://www.businesspost.co.kr/BP?command=article_view&num=434502",
    confidence: "MEDIUM",
  },
  {
    label: "㈜LS → LS일렉트릭",
    ratePercent: 48.47,
    baseDate: "2026-04-13",
    sourceLabel: "네이트뉴스, LS일렉트릭 지분 공시 보도",
    sourceUrl: "https://news.nate.com/view/20260413n34019",
    confidence: "HIGH",
  },
  {
    label: "㈜LS → LS전선 (비상장)",
    ratePercent: 92.6,
    baseDate: "기준일 불명확",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=006260",
    confidence: "MEDIUM",
  },
  {
    label: "구자열 → E1 (개인)",
    ratePercent: 12.78,
    baseDate: "2026-03-19",
    sourceLabel: "KIND, E1 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260319001973&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "구자열 외 특수관계인 → E1 (합산)",
    ratePercent: 45.36,
    baseDate: "2026-03-19",
    sourceLabel: "KIND, E1 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260319001973&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "구자용 → E1 (개인, E1 회장)",
    ratePercent: 9.77,
    baseDate: "2026-02-09",
    sourceLabel: "비즈니스포스트, 구자용 E1 대표 소개 기사",
    sourceUrl: "https://www.businesspost.co.kr/BP?command=article_view&num=431196",
    confidence: "MEDIUM",
  },
  {
    label: "공시상 최대주주 등 → 인베니 (보통주 합산)",
    ratePercent: 40.55,
    baseDate: "2025-09-29",
    sourceLabel: "KIND, INVENI 투자설명서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20250929000029&docno=&method=search&viewerhost=",
    confidence: "MEDIUM",
  },
];

// 상장 계열사 10개 — 이번 조사에서 종목코드·시장 전부 교차검증
export const LS_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "㈜LS", stockCode: "006260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS일렉트릭", stockCode: "010120", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "가온전선", stockCode: "000500", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "E1", stockCode: "017940", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "인베니", stockCode: "015360", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS네트웍스", stockCode: "000680", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS에코에너지", stockCode: "229640", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS마린솔루션", stockCode: "060370", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS머트리얼즈", stockCode: "417200", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "LS증권", stockCode: "078020", market: "KOSDAQ", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const LS_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "LS는 지주회사 체제인가요?",
    answer: "㈜LS는 그룹 핵심 지주회사 역할을 하지만, LS그룹 전체를 하나의 지주회사 아래 모든 계열사가 연결된 구조로 보면 안 됩니다. ㈜LS·E1·인베니가 각각 별도 사업축과 주주구조를 가진 병렬형 구조로 이해하는 편이 적절합니다.",
  },
  {
    question: "㈜LS가 E1과 인베니를 지배하나요?",
    answer:
      "아닙니다. 세 회사는 같은 LS 기업집단에 속하지만, ㈜LS가 E1과 인베니를 일반적인 자회사처럼 지배하는 단일 상하 구조로 이해하면 안 됩니다. 각 회사의 최대주주와 지분구조를 별도로 봐야 합니다.",
  },
  {
    question: "\"사촌경영\"이 뭔가요?",
    answer:
      "창업가 형제들의 후손들이 여러 사업축을 나눠 경영하는 방식입니다. 한 사람이 모든 핵심회사를 직접 지배하는 형태보다 가족주주와 경영 역할이 여러 갈래로 분산돼 있습니다.",
  },
  {
    question: "LS전선 주식은 살 수 있나요?",
    answer:
      "LS전선 자체는 비상장회사이므로 거래소에서 직접 매수할 수 없습니다. ㈜LS 또는 관련 상장 자회사를 통해 간접 노출될 수 있지만, 각 종목의 사업 노출은 서로 다릅니다.",
  },
  {
    question: "㈜LS와 LS ELECTRIC 중 어느 종목이 전력망에 더 직접적인가요?",
    answer:
      "LS ELECTRIC은 전력기기·배전·자동화 실적에 직접 노출됩니다. ㈜LS는 LS ELECTRIC뿐 아니라 LS전선·LS MnM·LS엠트론 등 다양한 자회사 가치와 지주회사 할인의 영향을 함께 받습니다.",
  },
  {
    question: "E1 주식을 사면 LS ELECTRIC에도 투자하는 건가요?",
    answer:
      "아닙니다. E1과 LS ELECTRIC은 같은 기업집단 소속이지만 ㈜LS→E1→LS ELECTRIC으로 이어지는 지분관계가 아닙니다.",
  },
  {
    question: "인베니는 원래 무슨 회사였나요?",
    answer:
      "예스코홀딩스입니다. 2018년 도시가스사업부문을 예스코로 물적분할하고 지주회사로 전환했으며, 2025년 3월 정기주주총회에서 투자형 지주회사 정체성을 강조하기 위해 인베니(INVENI)로 사명을 변경했습니다.",
  },
  {
    question: "LS그룹 상장 계열사는 몇 개인가요?",
    answer: "2026년 기준 10개입니다. 코스피 7개(㈜LS·LS일렉트릭·가온전선·E1·인베니·LS네트웍스·LS에코에너지)와 코스닥 3개(LS마린솔루션·LS머트리얼즈·LS증권)로 나뉩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer: "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
];

export const LS_SEO_INTRO = [
  "LS그룹은 하나의 지주회사 아래 모든 계열사가 연결된 구조가 아닙니다. ㈜LS·E1·인베니가 서로 다른 사업축을 형성하고, 구씨 일가의 여러 방계가 경영을 분담합니다. 따라서 LS그룹은 단일 트리보다 병렬형 사촌경영 구조로 이해하는 편이 정확합니다.",
  "투자 관점에서는 ㈜LS 아래 비상장 LS전선과 그 주변 상장 계열사의 관계가 핵심입니다. LS전선은 초고압·해저·통신 케이블을 담당하는 비상장 핵심회사이고, LS ELECTRIC은 전력기기·자동화에 직접 노출되는 상장 사업회사입니다. ㈜LS는 이 여러 사업가치를 한꺼번에 반영하지만 지주회사 할인도 함께 받습니다.",
  "E1과 인베니는 같은 LS 기업집단 소속이지만 ㈜LS의 자회사로 단순 분류하면 안 됩니다. E1은 LPG·에너지 유통 축, 인베니는 도시가스·투자 자산 축으로 별도 확인해야 합니다. LS그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 72개, 상장 계열사는 10개로 정리했습니다.",
];

export const LS_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 ㈜LS·E1·인베니 3개를 별도 나무로 나란히 표시했습니다. ㈜LS가 E1과 인베니를 자회사처럼 지배하는 구조로 표시하지 않았습니다.",
  "인베니(구 예스코홀딩스)의 기존 68.99% 수치는 기준 혼재 가능성이 있어 제거하고, 2025년 투자설명서에서 확인되는 보통주 기준 최대주주 등 합산 40.55%를 표시했습니다.",
  "같은 기업집단과 자회사 관계는 다릅니다. 그룹 회장, 개인 보유지분, 특수관계인 합산, 각 축의 경영권은 구분해서 설명했습니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
