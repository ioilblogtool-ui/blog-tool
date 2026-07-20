import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const SAMSUNG_META: GroupOwnershipMeta = {
  groupId: "samsung",
  groupName: "삼성",
  isLegalHoldingCompany: false,
  holdingCompanyNote:
    "법적 지주회사 없음 — 삼성물산이 삼성생명(금융)과 삼성전자·삼성바이오로직스·삼성SDS(비금융) 지분을 동시에 보유하며 사실상 지배구조 정점 역할을 합니다.",
  affiliateCount: 67,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "HIGH",
  listedAffiliateCount: 18,
  fairTradeRank: 1,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — "주 연결선"만 표시, 다중 부모는 secondaryStakes로 처리
export const SAMSUNG_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "이재용 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "samsung-cnt",
    name: "삼성물산",
    stockCode: "028260",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: 38.07,
  },
  {
    id: "samsung-life",
    name: "삼성생명",
    stockCode: "032830",
    listed: true,
    market: "KOSPI",
    sector: "FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "samsung-cnt",
    primaryRatePercent: 19.34,
  },
  {
    id: "samsung-elec",
    name: "삼성전자",
    stockCode: "005930",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "samsung-life",
    primaryRatePercent: 8.51,
    secondaryStakes: [{ holderName: "삼성물산 직접 보유", ratePercent: 5.05 }],
  },
  {
    id: "samsung-bio",
    name: "삼성바이오로직스",
    stockCode: "207940",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "samsung-cnt",
    primaryRatePercent: 43.06,
  },
  {
    id: "samsung-sds",
    name: "삼성SDS",
    stockCode: "018260",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "samsung-cnt",
    primaryRatePercent: 17.09,
    secondaryStakes: [{ holderName: "삼성전자 직접 보유", ratePercent: 22.59 }],
  },
];

export const SAMSUNG_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "이재용 → 삼성물산 (개인)",
    ratePercent: 22.01,
    baseDate: "2026-05-15",
    sourceLabel: "디지털투데이, 지분 공시 인용 보도",
    sourceUrl: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=668619",
    confidence: "MEDIUM",
  },
  {
    label: "이재용 외 특수관계인 11인 → 삼성물산 (합산)",
    ratePercent: 38.07,
    baseDate: "2026-05-15",
    sourceLabel: "디지털투데이, 지분 공시 인용 보도",
    sourceUrl: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=668619",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성생명",
    ratePercent: 19.34,
    baseDate: "2025년 3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성생명 → 삼성전자 (최대주주)",
    ratePercent: 8.51,
    baseDate: "2026년 7월",
    sourceLabel: "언론 보도, 삼성생명 특별계정 지분 변동 기사",
    sourceUrl: "https://www.datatooza.com/article/20260706163702969252ef343992_80",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성전자 (직접)",
    ratePercent: 5.05,
    baseDate: "2025년 3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성바이오로직스",
    ratePercent: 43.06,
    baseDate: "2025년 3분기",
    sourceLabel: "위즈리포트 지분현황",
    sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=028260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성물산 → 삼성SDS",
    ratePercent: 17.09,
    baseDate: "2026년",
    sourceLabel: "알파스퀘어 종목 정보",
    sourceUrl: "https://alphasquare.co.kr/home/stock-summary?code=018260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성전자 → 삼성SDS",
    ratePercent: 22.59,
    baseDate: "2026년",
    sourceLabel: "알파스퀘어 종목 정보",
    sourceUrl: "https://alphasquare.co.kr/home/stock-summary?code=018260",
    confidence: "MEDIUM",
  },
  {
    label: "삼성전자 최대주주+특수관계인 합산",
    ratePercent: 17.32,
    baseDate: "2026-07-06",
    sourceLabel: "데이터투자, 삼성생명 특별계정 지분 변동 기사",
    sourceUrl: "https://www.datatooza.com/article/20260706163702969252ef343992_80",
    confidence: "MEDIUM",
  },
];

export const SAMSUNG_KPI_CARDS = [
  { label: "국내 계열사", value: "67개", note: "공정위 2026-05-01 기준", tone: "official" },
  { label: "상장 계열사", value: "18개", note: "비금융 14개 + 금융 4개", tone: "official" },
  { label: "법적 지주회사", value: "없음", note: "삼성물산이 사실상 핵심축", tone: "official" },
  { label: "재계 순위", value: "1위", note: "공정자산 기준", tone: "official" },
  { label: "상장사 비율", value: "26.9%", note: "18개 ÷ 67개, 자체 산정", tone: "calculated" },
  { label: "최대 연결 단계", value: "3단계", note: "오너 일가→물산→생명→전자", tone: "calculated" },
];

export const SAMSUNG_ELECTRONICS_CONNECTIONS = [
  {
    label: "삼성물산 직접 보유",
    rate: "5.05%",
    description: "삼성물산이 삼성전자 주식을 직접 보유한 지분율입니다.",
  },
  {
    label: "삼성물산→삼성생명→삼성전자 단순 간접 연결",
    rate: "약 1.65%",
    description: "삼성물산의 삼성생명 지분율 19.34%와 삼성생명의 삼성전자 지분율 8.51%를 단순 곱한 참고값입니다.",
  },
  {
    label: "직접+간접 단순 합산 참고값",
    rate: "약 6.70%",
    description: "서로 다른 권리를 단순 합산한 참고값이며 법적 의결권이나 실제 동일 지분으로 해석하면 안 됩니다.",
  },
];

export const SAMSUNG_LISTED_STAGE_ROWS = [
  { company: "삼성물산", stockCode: "028260", shareholder: "이재용 외 특수관계인", role: "지배구조 핵심회사", stage: "1", tags: ["핵심축", "비금융"] },
  { company: "삼성전자", stockCode: "005930", shareholder: "삼성생명·삼성물산 외", role: "핵심 사업회사", stage: "2", tags: ["대표 사업", "교차 지분"] },
  { company: "삼성생명", stockCode: "032830", shareholder: "삼성물산 외", role: "금융 핵심회사", stage: "2", tags: ["금융", "삼성전자 최대주주"] },
  { company: "삼성바이오로직스", stockCode: "207940", shareholder: "삼성물산 외", role: "바이오 핵심회사", stage: "2", tags: ["성장 사업", "비금융"] },
  { company: "삼성SDS", stockCode: "018260", shareholder: "삼성전자·삼성물산", role: "IT 서비스", stage: "2", tags: ["상장 자회사", "교차 지분"] },
  { company: "삼성화재·삼성카드·삼성증권", stockCode: "각사 코드", shareholder: "삼성생명 등", role: "금융 상장 계열", stage: "2~3", tags: ["금융", "상장 계열"] },
  { company: "삼성FN리츠", stockCode: "448730", shareholder: "공시 기준 확인 필요", role: "상장 리츠", stage: "기타", tags: ["리츠", "상장 계열"] },
];

export const SAMSUNG_GROUP_COMPARISON = [
  { metric: "법적 지주회사", samsung: "없음", sk: "SK㈜", lg: "㈜LG", hyundai: "없음" },
  { metric: "핵심 지배구조 회사", samsung: "삼성물산", sk: "SK㈜", lg: "㈜LG", hyundai: "현대모비스" },
  { metric: "금융·비금융 혼재", samsung: "높음", sk: "상대적으로 낮음", lg: "낮음", hyundai: "낮음" },
  { metric: "중간지주 성격", samsung: "제한적", sk: "있음", lg: "일부", hyundai: "없음" },
  { metric: "핵심 특징", samsung: "삼성생명 연결", sk: "SK스퀘어 분리", lg: "전형적 지주사", hyundai: "순환출자 개편 이슈" },
];

export const SAMSUNG_INVESTOR_INSIGHTS = [
  {
    title: "지주회사 할인",
    body:
      "삼성물산이 보유한 계열사 지분가치가 크더라도 시가총액에 그대로 반영된다고 보기는 어렵습니다. 지분 매각 가능성, 세금과 거래비용, 지배 목적 보유, 소액주주에게 직접 배분되지 않는 자산가치가 할인 요인으로 작용할 수 있습니다.",
  },
  {
    title: "금융·산업자본 규제 변수",
    body:
      "삼성생명이 삼성전자 주요 주주라는 구조는 일반 제조업 그룹과 다른 핵심 포인트입니다. 보험사 계열사의 비금융 계열사 지분 보유는 보험업법과 금융 규제 변화에 따라 시장에서 지속적으로 주목받는 요소입니다.",
  },
  {
    title: "배당과 현금흐름",
    body:
      "삼성전자 배당이 늘면 삼성생명·삼성물산의 배당수익과 현금흐름에 긍정적으로 작용할 수 있습니다. 다만 배당 증가가 곧바로 각 회사의 주가 상승을 보장하는 것은 아닙니다.",
  },
];

export const SAMSUNG_STRUCTURE_TIMELINE = [
  { year: "2014", event: "삼성SDS 상장", impact: "IT 서비스 계열의 상장 자회사 구조가 부각됐습니다." },
  { year: "2014", event: "제일모직 상장", impact: "이후 삼성물산 합병 전 지배구조 핵심 회사로 주목받았습니다." },
  { year: "2015", event: "제일모직·삼성물산 합병", impact: "현재 삼성물산 중심 구조가 형성되는 중요한 계기가 됐습니다." },
  { year: "2016", event: "삼성바이오로직스 상장", impact: "바이오 계열사의 상장 가치가 삼성물산 지분가치 논의와 연결됐습니다." },
  { year: "이후", event: "계열사 분할·합병 및 지분 변동", impact: "상장 계열사 구성과 지분율은 공시 시점에 따라 계속 변합니다." },
];

// 상장 계열사 전체 목록 (18개, 2026-05-01 공정위 기준: 비금융 14 + 금융 4)
export const SAMSUNG_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "삼성전자", stockCode: "005930", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성물산", stockCode: "028260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성바이오로직스", stockCode: "207940", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성SDI", stockCode: "006400", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성SDS", stockCode: "018260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성E&A", stockCode: "028050", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성전기", stockCode: "009150", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "MEDIUM" },
  { name: "삼성중공업", stockCode: "010140", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "에스원", stockCode: "012750", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "제일기획", stockCode: "030000", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "호텔신라", stockCode: "008770", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "멀티캠퍼스", stockCode: "067280", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "LOW" },
  { name: "삼성에피스홀딩스", stockCode: "0126Z0", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성FN리츠", stockCode: "448730", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성생명", stockCode: "032830", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성카드", stockCode: "029780", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성증권", stockCode: "016360", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "삼성화재", stockCode: "000810", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const SAMSUNG_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "삼성은 지주회사 체제인가요?",
    answer:
      "아닙니다. 삼성은 SK·LG처럼 공정거래법상 법적 지주회사가 없습니다. 대신 삼성물산이 삼성생명·삼성전자·삼성바이오로직스·삼성SDS 등 핵심 계열사 지분을 나눠 보유하며 사실상 지배구조 정점 역할을 합니다.",
  },
  {
    question: "삼성의 실질적인 지배주주는 누구인가요?",
    answer:
      "이재용 회장이 삼성물산 지분 22.01%를 개인 명의로 보유하고 있고, 특수관계인 11인을 합치면 38.07%입니다(2026-05-15 기준). 삼성물산이 삼성생명·삼성전자 등을 지배하는 구조이므로, 삼성물산 지분이 곧 그룹 전체에 대한 지분 연결상 영향권으로 이어집니다.",
  },
  {
    question: "삼성전자의 최대주주는 삼성물산인가요, 삼성생명인가요?",
    answer:
      "삼성생명입니다. 삼성생명이 삼성전자 지분 8.51%로 최대주주이고, 삼성물산도 별도로 5.05%를 직접 보유합니다. 최대주주 및 특수관계인 지분을 모두 합치면 17.32%(2026-07-06 기준)입니다.",
  },
  {
    question: "삼성그룹 상장 계열사는 몇 개인가요?",
    answer:
      "2026년 5월 1일 공정거래위원회 지정 기준 18개입니다(비금융 14개, 금융 4개). 삼성전자·삼성물산·삼성바이오로직스처럼 잘 알려진 곳부터 삼성FN리츠 같은 리츠까지 포함됩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 계열사·상장사 수는 2026년 5월 1일 공정거래위원회 지정 기준이며, 개별 지분율은 2025년 3분기~2026년 7월 사이 보도된 자료를 기준으로 합니다. 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "이재용 회장이 삼성전자를 직접 보유하나요?",
    answer:
      "직접 보유 지분과 삼성물산·삼성생명 등을 통한 지분 연결은 구분해야 합니다. 직접 지분이 작더라도 삼성물산 지분, 특수관계인 지분, 핵심 계열사 간 보유 관계를 통해 그룹 지배구조에 영향력을 행사할 수 있습니다.",
  },
  {
    question: "삼성FN리츠도 삼성그룹 상장 계열사 수에 포함되나요?",
    answer:
      "이 페이지는 2026년 5월 1일 공정거래위원회 공시대상기업집단 지정 기준의 상장 계열사 목록을 따릅니다. 따라서 삼성FN리츠처럼 상장 부동산투자회사도 해당 기준에 포함되는 경우 함께 집계했습니다.",
  },
];

export const SAMSUNG_SEO_INTRO = [
  '삼성은 국내 최대 기업집단이자 유일하게 법적 지주회사가 없는 4대 그룹입니다. 대신 삼성물산이 삼성생명(금융)과 삼성전자·삼성바이오로직스·삼성SDS(비금융) 지분을 동시에 보유하며 그룹 전체를 사실상 지배합니다. 이 구조 때문에 "삼성전자의 진짜 주인이 누구인가"라는 질문에는 이재용 회장 한 사람이 아니라 삼성물산→삼성생명으로 이어지는 지분 연결 전체를 봐야 정확히 답할 수 있습니다.',
  "이재용 회장은 삼성물산 지분 22.01%를 개인 명의로 보유하고, 특수관계인을 합치면 38.07%입니다. 삼성물산은 이 지배력을 바탕으로 삼성생명 19.34%, 삼성바이오로직스 43.06%, 삼성SDS 17.09%를 보유합니다. 특히 삼성전자는 삼성생명(8.51%, 최대주주)과 삼성물산(5.05%, 직접)이 함께 지분을 보유하는 구조라, 단일 회사 하나만 봐서는 지배관계를 온전히 파악하기 어렵습니다.",
  "삼성그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 67개, 그중 상장사는 18개입니다. 삼성전자·삼성물산처럼 시가총액 상위 대형주부터 삼성FN리츠 같은 부동산투자회사까지 폭넓게 포함됩니다.",
];

export const SAMSUNG_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 각 회사의 가장 비중이 큰 상위 지분(주 연결선)만 그리고, 그 외 상위 지분은 보조 텍스트로 표기합니다. 삼성전자·삼성SDS처럼 상위 계열사 2곳 이상에서 지분을 보유하는 경우가 이에 해당합니다.",
  "계열사·상장사 수는 2026년 5월 1일 공정거래위원회 \"공시대상기업집단\" 지정 기준입니다.",
  '"지배한다"는 표현 대신 "지분 연결상 영향권", "최대주주 및 특수관계인 기준" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.',
];
