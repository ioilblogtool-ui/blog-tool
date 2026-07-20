import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const LOTTE_META: GroupOwnershipMeta = {
  groupId: "lotte",
  groupName: "롯데",
  isLegalHoldingCompany: true,
  holdingCompanyNote:
    "법적 지주회사 롯데지주(주) — 2017년 지주회사로 전환하고 2018년 국내 계열 순환출자를 해소했습니다. 다만 호텔롯데의 주주 구조를 통해 일본 롯데홀딩스와 L투자회사들이 연결돼 있어, 국내 지주회사 구조와 한·일 연결 구조를 분리해서 봐야 합니다.",
  affiliateCount: 98,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 10,
  fairTradeRank: 6,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. 특히 자회사 개별 지분율과 상장 계열사 편입 여부는 회사별 기준일이 다를 수 있어 최신 공시 대조가 필요합니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — 국내 지주회사 축과 한·일 연결 축을 분리
export const LOTTE_TREE_NODES: GroupCompany[] = [
  {
    id: "domestic-shareholder-axis",
    name: "국내 최대주주 등",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "japan-lotte-holdings",
    name: "일본 롯데홀딩스·L투자회사",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "hotel-lotte",
    name: "호텔롯데",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "japan-lotte-holdings",
    primaryRatePercent: 91.72,
  },
  {
    id: "lotte-corp",
    name: "롯데지주",
    stockCode: "004990",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "domestic-shareholder-axis",
    primaryRatePercent: 45.74,
    secondaryStakes: [
      { holderName: "신동빈 개인 보유", ratePercent: 13.73 },
      { holderName: "호텔롯데 보유", ratePercent: 11.68 },
      { holderName: "일본 롯데홀딩스 직접 보유", ratePercent: 2.62 },
    ],
  },
  {
    id: "lotte-shopping",
    name: "롯데쇼핑",
    stockCode: "023530",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lotte-corp",
    primaryRatePercent: 40.0,
  },
  {
    id: "lotte-chemical",
    name: "롯데케미칼",
    stockCode: "011170",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lotte-corp",
    primaryRatePercent: 25.31,
  },
  {
    id: "lotte-chilsung",
    name: "롯데칠성음료",
    stockCode: "005300",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lotte-corp",
    primaryRatePercent: 45.0,
  },
  {
    id: "lotte-wellfood",
    name: "롯데웰푸드",
    stockCode: "280360",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "lotte-corp",
    primaryRatePercent: 48.13,
  },
];

export const LOTTE_KPI_CARDS = [
  { label: "국내 법적 지주회사", value: "롯데지주", note: "2017년 출범한 국내 지배구조 핵심회사" },
  { label: "국내 순환출자", value: "해소", note: "2018년 국내 계열 순환출자 고리 정리" },
  { label: "한·일 연결 핵심", value: "호텔롯데", note: "비상장 사업회사이자 일본계 주주와 연결" },
  { label: "구조 특징", value: "2축 구조", note: "국내 지주회사 축과 한·일 연결 축을 분리해서 해석" },
];

export const LOTTE_DUAL_AXIS = [
  {
    title: "국내 오너·계열사 축",
    path: ["신동빈 및 특수관계인", "롯데지주", "롯데쇼핑·롯데케미칼·롯데웰푸드"],
    note: "국내 상장 계열사는 롯데지주를 중심으로 정리돼 있습니다.",
  },
  {
    title: "한·일 연결 축",
    path: ["일본 롯데홀딩스·L투자회사", "호텔롯데", "롯데지주 주요 주주"],
    note: "호텔롯데는 롯데지주 주요 주주이지만, 롯데지주 전체를 한 줄로 직접 지배한다고 단순화하면 안 됩니다.",
  },
];

export const LOTTE_KOREA_JAPAN_COMPARISON = [
  { label: "주요 지배회사", korea: "롯데지주", japan: "일본 롯데홀딩스" },
  { label: "주요 사업", korea: "유통·화학·식품·호텔 등", japan: "식품 등" },
  { label: "주요 상장시장", korea: "한국거래소", japan: "비상장 중심" },
  { label: "핵심 연결회사", korea: "호텔롯데", japan: "호텔롯데 주주로 연결" },
  { label: "동일 법인 여부", korea: "아니오", japan: "아니오" },
];

export const LOTTE_HOTEL_ROLE_ROWS = [
  { reason: "롯데지주 주요 주주", description: "호텔롯데는 롯데지주 지분을 보유해 국내 지주회사와 연결됩니다." },
  { reason: "일본계 주주 연결", description: "일본 롯데홀딩스와 L투자회사들이 호텔롯데 주주 구조에 연결돼 있습니다." },
  { reason: "비상장회사", description: "시장 가격으로 바로 확인되는 시가총액이 없어 가치 평가가 어렵습니다." },
  { reason: "사업회사", description: "호텔·면세점 등 실제 사업을 운영하는 회사이므로 단순 지분 보유회사로만 볼 수 없습니다." },
  { reason: "상장 가능성", description: "상장 여부와 방식은 지배구조 투명성, 자금조달, 일본계 지분 희석 해석에 영향을 줄 수 있습니다." },
];

export const LOTTE_OWNER_STAKE_GUIDE = [
  { type: "개인 직접 지분", value: "신동빈 → 롯데지주 13.73%", caution: "개인 명의 보유분으로만 설명" },
  { type: "특수관계인 합산", value: "신동빈 외 특수관계인 45.74%", caution: "개인 지분처럼 표현 금지" },
  { type: "호텔롯데 경유", value: "호텔롯데 → 롯데지주 11.68%", caution: "비상장 일본 법인 연결은 구조만 설명" },
  { type: "경영 지위", value: "한국·일본 법인 경영 참여", caution: "주식 소유와 임원 지위를 구분" },
];

export const LOTTE_TIMELINE = [
  { period: "지주사 전환 전", change: "국내 계열사 간 복잡한 출자구조", meaning: "지배관계 이해가 어려웠던 시기" },
  { period: "2017년", change: "롯데지주 출범", meaning: "국내 계열 지주회사 체제 시작" },
  { period: "2018년", change: "국내 순환출자 고리 정리", meaning: "국내 지분구조 단순화" },
  { period: "이후", change: "금융·비금융 계열 재편", meaning: "지주회사 규제와 사업 재편 대응" },
  { period: "현재", change: "호텔롯데·일본 주주 연결 잔존", meaning: "국내 순환출자 해소와 한·일 연결은 별도 문제" },
];

export const LOTTE_BUSINESS_AXES = [
  { axis: "유통", companies: "롯데쇼핑, 롯데하이마트", note: "백화점·마트·이커머스·가전 유통" },
  { axis: "화학·소재", companies: "롯데케미칼, 롯데정밀화학, 롯데에너지머티리얼즈", note: "화학 스프레드와 설비투자에 민감" },
  { axis: "식품·음료", companies: "롯데웰푸드, 롯데칠성음료", note: "식품·음료·주류 실적 축" },
  { axis: "호텔·면세", companies: "호텔롯데", note: "비상장 핵심회사이자 한·일 연결 축" },
  { axis: "IT·서비스", companies: "롯데이노베이트", note: "그룹 디지털 전환과 IT 서비스" },
  { axis: "부동산·리츠", companies: "롯데리츠", note: "그룹 부동산 자산과 배당형 투자" },
];

export const LOTTE_NAV_FORMULA_ROWS = [
  "롯데쇼핑 보유 지분가치",
  "롯데케미칼 보유 지분가치",
  "롯데칠성음료 보유 지분가치",
  "롯데웰푸드 보유 지분가치",
  "비상장 자회사 추정가치",
  "순현금 또는 순차입금 조정",
  "= 롯데지주 추정 NAV",
];

export const LOTTE_HOTEL_IPO_SIMULATION_ROWS = [
  { input: "호텔롯데 예상 기업가치", result: "상장 후 예상 시가총액" },
  { input: "신주 발행 비율", result: "신규 조달금액과 기존 주주 희석률" },
  { input: "구주매출 비율", result: "기존 주주 매각 후 잔여 지분율" },
  { input: "일본계 기존 지분율", result: "상장 후 일본계 주주 예상 지분율" },
  { input: "상장 후 할인율", result: "가정별 평가금액 변화" },
];

export const LOTTE_STOCK_DRIVER_ROWS = [
  { stock: "롯데지주", driver: "자회사 지분가치, 배당, 순차입금, 지주회사 할인" },
  { stock: "롯데쇼핑", driver: "백화점·마트·이커머스·부동산 가치" },
  { stock: "롯데케미칼", driver: "화학 스프레드, 설비투자, 재무부담" },
  { stock: "롯데웰푸드", driver: "식품 실적, 해외사업, 원재료 가격" },
  { stock: "롯데칠성음료", driver: "음료·주류 판매량과 원가" },
  { stock: "호텔롯데", driver: "면세·호텔·관광 업황과 상장 가능성" },
];

export const LOTTE_GROUP_COMPARISON = [
  { group: "롯데", legalHolding: "롯데지주", keyword: "한·일 연결", issue: "호텔롯데 상장과 일본계 지분 연결" },
  { group: "삼성", legalHolding: "없음", keyword: "삼성전자 지배 연결", issue: "삼성생명·물산·전자 연결" },
  { group: "SK", legalHolding: "SK㈜", keyword: "중간지주", issue: "SK스퀘어와 SK하이닉스 할인" },
  { group: "LG", legalHolding: "㈜LG", keyword: "순수지주", issue: "LG화학·LG엔솔 간접 노출" },
  { group: "현대차", legalHolding: "없음", keyword: "순환출자", issue: "현대모비스·현대차·기아 고리" },
  { group: "한화", legalHolding: "없음", keyword: "인적분할", issue: "2026년 분할과 한화에너지 연결" },
];

export const LOTTE_LISTED_DETAIL_ROWS = [
  { name: "롯데지주", code: "004990", business: "지주", parent: "국내 핵심축", role: "국내 지주회사" },
  { name: "롯데쇼핑", code: "023530", business: "유통", parent: "롯데지주", role: "유통 핵심" },
  { name: "롯데케미칼", code: "011170", business: "화학", parent: "롯데지주 등", role: "화학 핵심" },
  { name: "롯데칠성음료", code: "005300", business: "식음료", parent: "롯데지주 등", role: "음료·주류 핵심" },
  { name: "롯데웰푸드", code: "280360", business: "식품", parent: "롯데지주 등", role: "식품 핵심" },
  { name: "롯데하이마트", code: "071840", business: "유통", parent: "롯데쇼핑 등", role: "가전 유통" },
  { name: "롯데정밀화학", code: "004000", business: "화학·소재", parent: "롯데케미칼 등", role: "소재 계열" },
  { name: "롯데이노베이트", code: "286940", business: "IT", parent: "롯데지주 등", role: "IT 서비스" },
  { name: "롯데에너지머티리얼즈", code: "020150", business: "소재", parent: "롯데케미칼 등", role: "배터리 소재" },
  { name: "롯데리츠", code: "330590", business: "리츠", parent: "관계회사 구조 확인 필요", role: "부동산 자산" },
];

export const LOTTE_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "신동빈 → 롯데지주 (개인)",
    ratePercent: 13.73,
    baseDate: "2025-11-28",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=004990",
    confidence: "MEDIUM",
  },
  {
    label: "신동빈 외 특수관계인 → 롯데지주 (합산)",
    ratePercent: 45.74,
    baseDate: "2025-11-28",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=004990",
    confidence: "MEDIUM",
  },
  {
    label: "호텔롯데 → 롯데지주",
    ratePercent: 11.68,
    baseDate: "출처 불명확",
    sourceLabel: "비즈한국, 재벌 지배구조 기사",
    sourceUrl: "https://www.bizhankook.com/bk/article/25320",
    confidence: "MEDIUM",
  },
  {
    label: "일본 롯데홀딩스 → 롯데지주 (직접)",
    ratePercent: 2.62,
    baseDate: "출처 불명확",
    sourceLabel: "비즈한국, 재벌 지배구조 기사",
    sourceUrl: "https://www.bizhankook.com/bk/article/25320",
    confidence: "MEDIUM",
  },
  {
    label: "일본 롯데홀딩스 → 호텔롯데",
    ratePercent: 19.07,
    baseDate: "출처 불명확",
    sourceLabel: "나무위키, 롯데 국적 논란 문서",
    sourceUrl: "https://namu.wiki/w/%EB%A1%AF%EB%8D%B0/%EA%B5%AD%EC%A0%81%20%EB%85%BC%EB%9E%80",
    confidence: "MEDIUM",
  },
  {
    label: "일본 L투자회사 11개사 → 호텔롯데 (합산)",
    ratePercent: 72.65,
    baseDate: "출처 불명확",
    sourceLabel: "나무위키, 롯데 국적 논란 문서",
    sourceUrl: "https://namu.wiki/w/%EB%A1%AF%EB%8D%B0/%EA%B5%AD%EC%A0%81%20%EB%85%BC%EB%9E%80",
    confidence: "MEDIUM",
  },
  {
    label: "롯데지주 → 롯데쇼핑",
    ratePercent: 40.0,
    baseDate: "2019-09-06",
    sourceLabel: "위즈리포트 지분현황 (개별 지분, 오래된 자료)",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=023530",
    confidence: "LOW",
  },
  {
    label: "롯데지주 외 26인 → 롯데쇼핑 (합산)",
    ratePercent: 60.13,
    baseDate: "2026-05-08",
    sourceLabel: "데이터투자, 롯데쇼핑 지분 변동 보도",
    sourceUrl: "https://www.datatooza.com/article/20260508171803910952ef383cce_80",
    confidence: "MEDIUM",
  },
  {
    label: "롯데지주 → 롯데케미칼",
    ratePercent: 25.31,
    baseDate: "2022-12-14",
    sourceLabel: "위즈리포트 지분현황 (개별 지분, 오래된 자료)",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=011170",
    confidence: "LOW",
  },
  {
    label: "롯데지주+롯데물산+Lotte Holdings → 롯데케미칼 (합산)",
    ratePercent: 54.57,
    baseDate: "2022-12-14",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=011170",
    confidence: "LOW",
  },
  {
    label: "롯데지주 → 롯데칠성음료",
    ratePercent: 45.0,
    baseDate: "기준일 불명확",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=005300",
    confidence: "LOW",
  },
  {
    label: "롯데지주 외 16인 → 롯데칠성음료 (합산)",
    ratePercent: 59.73,
    baseDate: "2026-07-02",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=005300",
    confidence: "MEDIUM",
  },
  {
    label: "롯데지주 → 롯데웰푸드",
    ratePercent: 48.13,
    baseDate: "2026년 2월 전후 추정",
    sourceLabel: "IRGO, 롯데웰푸드 기업정보 (68.6%로 보도된 자료와 불일치)",
    sourceUrl: "https://m.irgo.co.kr/IR-COMP/280360/%EB%A1%AF%EB%8D%B0%EC%9B%B0%ED%91%B8%EB%93%9C-%EA%B8%B0%EC%97%85%EC%A0%95%EB%B3%B4",
    confidence: "LOW",
  },
];

// 상장 계열사 11개 — 이번 조사에서 종목코드 교차검증
export const LOTTE_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "롯데지주", stockCode: "004990", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데쇼핑", stockCode: "023530", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데케미칼", stockCode: "011170", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데칠성음료", stockCode: "005300", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데웰푸드", stockCode: "280360", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데하이마트", stockCode: "071840", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데정밀화학", stockCode: "004000", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데이노베이트", stockCode: "286940", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데에너지머티리얼즈", stockCode: "020150", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "롯데리츠", stockCode: "330590", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const LOTTE_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "롯데는 지주회사 체제인가요?",
    answer:
      "예. 국내 구조는 롯데지주(주)를 중심으로 한 법적 지주회사 체제입니다. 2017년 롯데지주가 출범했고 2018년 국내 계열 순환출자 고리를 정리했습니다. 다만 호텔롯데의 주주 구조를 통해 일본 롯데홀딩스와 L투자회사들이 연결돼 있어 국내 지주회사 축과 한·일 연결 축을 분리해서 봐야 합니다.",
  },
  {
    question: "롯데지주의 최상위 주주는 한국 회사인가요?",
    answer:
      "롯데지주의 주주는 신동빈 회장 개인, 국내 계열회사, 호텔롯데, 일본 롯데홀딩스 등으로 구성됩니다. 호텔롯데에는 일본 롯데홀딩스와 L투자회사들이 연결돼 있지만, 이를 근거로 일본 롯데홀딩스가 롯데지주를 단독으로 직접 지배한다고 단순화해서는 안 됩니다.",
  },
  {
    question: "신동빈 회장이 실질적으로 롯데를 지배하는 방식은?",
    answer:
      "개인 직접 지분과 특수관계인 합산, 경영 지위를 구분해야 합니다. 신동빈 회장의 롯데지주 개인 지분은 13.73%이고, 최대주주 및 특수관계인 합산 지분은 45.74%로 표시됩니다. 일본 롯데홀딩스 경영 참여는 국내 주식 보유와 다른 기준의 지위입니다.",
  },
  {
    question: "롯데는 한국 회사인가요, 일본 회사인가요?",
    answer:
      "한국과 일본에 별도의 법인·사업·지배회사가 존재하며 호텔롯데 등을 통해 지분 및 경영관계가 연결돼 있습니다. 따라서 한국 회사 또는 일본 회사 한쪽으로만 단순 분류하기보다 한·일 양국에 기반을 둔 기업집단 구조로 이해하는 편이 정확합니다.",
  },
  {
    question: "호텔롯데는 롯데지주의 모회사인가요?",
    answer:
      "호텔롯데가 롯데지주 지분을 보유한 주요 주주인 것은 맞지만, 일반적인 완전 모회사·자회사 관계처럼 표현하기에는 지분구조가 복합적입니다. 호텔롯데 지분율과 다른 특수관계인 지분을 함께 봐야 합니다.",
  },
  {
    question: "호텔롯데가 상장하면 롯데지주에 호재인가요?",
    answer:
      "호텔롯데 가치가 시장에서 가시화되고 지배구조가 투명해질 가능성은 있지만, 신주 발행 규모, 구주매출, 공모가, 자금 사용처와 기존 주주 희석에 따라 영향이 달라집니다. 상장 자체가 자동 호재라고 단정할 수 없습니다.",
  },
  {
    question: "롯데웰푸드 지분율이 자료마다 다른 이유는?",
    answer:
      "롯데지주의 롯데웰푸드 지분율이 48.13%로 보도된 자료와 68.6%로 보도된 자료가 함께 존재합니다. 자사주 포함 여부나 기준일 차이로 추정되며, 이 페이지에서는 신뢰도를 \"낮음\"으로 표시하고 재검증이 필요함을 명시했습니다.",
  },
  {
    question: "롯데그룹 상장 계열사는 몇 개인가요?",
    answer: "이번 페이지에서 동일 기준으로 표시한 상장 계열사는 10개입니다. 롯데렌탈처럼 상장 여부와 그룹 편입 상태를 별도로 교차확인해야 하는 항목은 확정 목록에 넣지 않았습니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 크게 다릅니다. 특히 자회사 개별 지분율 일부는 2019~2022년 기준 자료가 섞여 있어, 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
];

export const LOTTE_SEO_INTRO = [
  "롯데그룹은 2017년 롯데지주(주)로 전환하고 2018년 국내 계열사 간 순환출자를 해소해, 국내 지배구조만 보면 지주회사 중심으로 정리된 그룹입니다. 하지만 호텔롯데의 주주 구조를 통해 일본 롯데홀딩스와 L투자회사들이 연결돼 있어, 국내 지주회사 구조와 한·일 연결 구조를 나눠서 봐야 합니다.",
  "신동빈 회장의 롯데지주 개인 지분은 13.73%이며, 최대주주 및 특수관계인 합산 지분율은 45.74%입니다. 이 합산 지분을 신동빈 회장 개인 보유분처럼 표현하면 안 됩니다. 또한 일본 롯데홀딩스에서의 경영 지위와 한국 롯데지주의 주식 소유관계는 서로 다른 기준으로 구분해야 합니다.",
  "호텔롯데는 단순한 지분 보유용 회사가 아니라 호텔·면세점 등 사업을 운영하는 비상장 사업회사이면서, 한국 롯데와 일본 롯데를 연결하는 지분구조상의 핵심회사입니다. 향후 호텔롯데 상장 여부와 방식은 롯데 지배구조 해석, 일본계 지분 희석, 롯데지주 할인율에 영향을 줄 수 있습니다.",
];

export const LOTTE_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 국내 최대주주 등→롯데지주 축과 일본 롯데홀딩스·L투자회사→호텔롯데 축을 분리했습니다. 일본 롯데홀딩스가 롯데지주를 한 줄로 직접 지배한다고 단순화하지 않기 위해서입니다.",
  "자회사 개별 지분율(롯데쇼핑·롯데케미칼·롯데칠성·롯데웰푸드) 일부는 기준일이 오래된 자료가 섞여 있어 신뢰도를 \"낮음\"으로 표시했습니다. 최신 DART 공시 대조를 권장합니다.",
  "개인 지분, 최대주주 및 특수관계인 합산, 경영 지위, 비상장 일본 법인 경유 연결은 서로 다른 개념으로 구분했습니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
