import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const HANWHA_META: GroupOwnershipMeta = {
  groupId: "hanwha",
  groupName: "한화",
  isLegalHoldingCompany: false,
  holdingCompanyNote:
    "법적 지주회사 아님 — ㈜한화는 그룹 지배구조의 핵심 회사이지만 공정거래법상 지주회사로 신고·관리되는 법적 지주회사는 아닙니다. 따라서 일반지주회사에 적용되는 금융·보험회사 주식 보유 제한 구조와는 다르게 봐야 합니다.",
  affiliateCount: 116,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 11,
  fairTradeRank: 5,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 KIND·DART 공시, 회사 IR, 주요 보도자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 한국거래소 KIND와 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. ★ 한화는 2026년 7월 15일 임시주총에서 ㈜한화 인적분할 계획을 승인해, 이 페이지 작성 시점(2026-07-16)에 지배구조가 바뀌는 중입니다. 아래 지분구조는 분할 효력 발생 전 현재 구조이며, 분할 계획은 별도 섹션에서 설명합니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — 분할 전 현재 구조
export const HANWHA_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "김승연 회장과 김동관·김동원·김동선 3형제",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "hanwha-energy",
    name: "한화에너지",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: null,
  },
  {
    id: "hanwha-corp",
    name: "㈜한화",
    stockCode: "000880",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: 20.51,
    secondaryStakes: [{ holderName: "한화에너지 보유", ratePercent: 22.16 }],
  },
  {
    id: "hanwha-aerospace",
    name: "한화에어로스페이스",
    stockCode: "012450",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-corp",
    primaryRatePercent: 32.18,
  },
  {
    id: "hanwha-systems",
    name: "한화시스템",
    stockCode: "272210",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-aerospace",
    primaryRatePercent: 59.54,
  },
  {
    id: "hanwha-ocean",
    name: "한화오션",
    stockCode: "042660",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-aerospace",
    primaryRatePercent: 25.61,
    secondaryStakes: [{ holderName: "한화시스템 직접 보유", ratePercent: 7.03 }],
  },
  {
    id: "hanwha-solutions",
    name: "한화솔루션",
    stockCode: "009830",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-corp",
    primaryRatePercent: 36.7,
  },
  {
    id: "hanwha-life",
    name: "한화생명보험",
    stockCode: "088350",
    listed: true,
    market: "KOSPI",
    sector: "FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-corp",
    primaryRatePercent: 43.2,
  },
  {
    id: "hanwha-vision",
    name: "한화비전",
    stockCode: "489790",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hanwha-corp",
    primaryRatePercent: 34.0,
  },
];

export const HANWHA_KPI_CARDS = [
  { label: "현재 상태", value: "주총 승인 후", note: "2026-07-15 임시주주총회에서 분할계획서 승인" },
  { label: "분할비율", value: "75.63533 : 24.36467", note: "존속법인 : 신설법인, 순자산 장부가액 기준" },
  { label: "분할기일", value: "2026-08-01 예정", note: "효력 발생 전후로 페이지 해석이 달라지는 기준일" },
  { label: "상장 예정", value: "2026-08-25", note: "존속법인 변경상장·신설법인 신규상장 예정" },
];

export const HANWHA_SPLIT_SCHEDULE = [
  { date: "2026-01-14", event: "이사회 의결", meaning: "㈜한화 인적분할 추진 공식화" },
  { date: "2026-07-15", event: "임시주주총회 승인", meaning: "의결권 행사 주식 기준 99.9% 찬성 보도" },
  { date: "2026-08-01", event: "분할기일 예정", meaning: "존속법인과 신설법인으로 법적 분리 예정" },
  { date: "2026-08-25", event: "변경·신규상장 예정", meaning: "존속법인 변경상장, 신설법인 신규상장 예정" },
];

export const HANWHA_SHARE_ALLOCATION_EXAMPLES = [
  { ownedShares: 10, survivingShares: 7.563533, newCompanyShares: 2.436467 },
  { ownedShares: 100, survivingShares: 75.63533, newCompanyShares: 24.36467 },
  { ownedShares: 1000, survivingShares: 756.3533, newCompanyShares: 243.6467 },
];

export const HANWHA_BEFORE_AFTER_SPLIT = [
  {
    label: "분할 전 ㈜한화",
    items: ["방산", "조선·해양", "에너지", "금융", "기계·로봇·반도체 장비", "유통·호텔·레저"],
  },
  {
    label: "존속법인",
    items: ["방산", "조선·해양", "에너지", "금융", "한화에어로스페이스", "한화오션", "한화솔루션", "한화생명보험"],
  },
  {
    label: "신설법인",
    items: ["기계·장비", "로봇", "반도체 장비", "유통", "호텔·레저", "한화비전", "한화갤러리아", "아워홈"],
  },
];

export const HANWHA_ENERGY_CONNECTIONS = [
  {
    owner: "김동관",
    energyStake: "50%",
    hanwhaStakeViaEnergy: "약 11.08%",
    note: "50% × 한화에너지의 ㈜한화 22.16%",
  },
  {
    owner: "김동원",
    energyStake: "20%",
    hanwhaStakeViaEnergy: "약 4.43%",
    note: "20% × 한화에너지의 ㈜한화 22.16%",
  },
  {
    owner: "김동선",
    energyStake: "10%",
    hanwhaStakeViaEnergy: "약 2.22%",
    note: "10% × 한화에너지의 ㈜한화 22.16%",
  },
];

export const HANWHA_BROTHER_BUSINESS_AXES = [
  {
    person: "김동관",
    axis: "방산·우주·조선·에너지",
    companies: "한화에어로스페이스, 한화오션, 한화솔루션",
    interpretation: "그룹의 주력 성장축과 존속법인 핵심 사업을 맡는 구조입니다.",
  },
  {
    person: "김동원",
    axis: "금융",
    companies: "한화생명보험, 금융 계열",
    interpretation: "한화생명보험을 중심으로 금융 계열의 경영 역할이 부각됩니다.",
  },
  {
    person: "김동선",
    axis: "유통·호텔·레저·로봇·장비",
    companies: "한화갤러리아, 한화호텔앤드리조트, 한화비전, 신설법인 축",
    interpretation: "인적분할 이후 신설법인과 테크·라이프 축으로 연결됩니다.",
  },
];

export const HANWHA_SPLIT_IMPACT_ROWS = [
  {
    stock: "㈜한화",
    upside: "복합기업 할인 완화 가능성",
    risk: "분할 후 각 법인 가치 재평가와 초기 수급 변동성",
  },
  {
    stock: "신설법인",
    upside: "로봇·반도체 장비·유통·레저 축을 별도 상장사로 평가",
    risk: "상장 직후 적정가치 산정 불확실성과 거래 초기 변동성",
  },
  {
    stock: "한화에어로스페이스",
    upside: "방산·조선·우주 축 집중도 상승",
    risk: "㈜한화 분할 이벤트가 직접 실적 개선을 보장하지는 않음",
  },
  {
    stock: "한화오션",
    upside: "방산·조선 시너지 기대",
    risk: "대규모 투자, 수주·원가, 재무 부담에 민감",
  },
  {
    stock: "한화생명보험",
    upside: "금융 축 역할이 명확해질 가능성",
    risk: "금리·보험손익·금융 규제 변수",
  },
  {
    stock: "한화갤러리아",
    upside: "신설법인 내 유통·라이프 사업 가치 부각",
    risk: "소비 경기와 유통 수익성 변동",
  },
];

export const HANWHA_HOLDING_COMPANY_COMPARISON = [
  { label: "공정거래법상 신고", legalHolding: "지주회사로 신고·관리", hanwha: "법적 지주회사 아님" },
  { label: "주요 기능", legalHolding: "자회사 지분 보유·관리 중심", hanwha: "자체 사업과 계열 지분 보유를 함께 수행" },
  { label: "금융회사 주식 보유", legalHolding: "일반지주회사에는 제한 구조 적용", hanwha: "동일한 지주회사 규제 구조로 단정하기 어려움" },
  { label: "투자자 해석", legalHolding: "지주회사 할인·NAV 관점", hanwha: "사업회사 가치와 지분가치를 함께 봐야 함" },
];

export const HANWHA_GROUP_COMPARISON = [
  { group: "삼성", keyword: "삼성전자 지배 연결", difference: "보험·물산·전자 간 지분 연결 해석이 핵심" },
  { group: "SK", keyword: "중간지주와 다단 상장", difference: "SK㈜·SK스퀘어·SK하이닉스 연결이 핵심" },
  { group: "현대차", keyword: "순환출자", difference: "현대모비스·현대차·기아 순환 고리 해석이 핵심" },
  { group: "LG", keyword: "단순 지주회사", difference: "구조는 단순하지만 모회사 할인과 LG엔솔 간접 노출이 핵심" },
  { group: "한화", keyword: "진행 중인 인적분할", difference: "현재 지분도보다 분할 이후 두 상장사와 한화에너지 연결 해석이 핵심" },
];

export const HANWHA_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "김승연 → ㈜한화 (개인)",
    ratePercent: 11.33,
    baseDate: "2025년 3월 증여 후",
    sourceLabel: "헤럴드경제, 지분 증여 관련 보도",
    sourceUrl: "https://biz.heraldcorp.com/article/10454542",
    confidence: "MEDIUM",
  },
  {
    label: "김동관 → ㈜한화 (개인)",
    ratePercent: 9.76,
    baseDate: "2025년 3분기 말",
    sourceLabel: "뉴시스, 오너3세 시대 관련 보도",
    sourceUrl: "https://www.newsis.com/view/NISX20250331_0003120455",
    confidence: "MEDIUM",
  },
  {
    label: "김동원 → ㈜한화 (개인)",
    ratePercent: 5.37,
    baseDate: "2025년 3분기 말",
    sourceLabel: "뉴시스, 오너3세 시대 관련 보도",
    sourceUrl: "https://www.newsis.com/view/NISX20250331_0003120455",
    confidence: "MEDIUM",
  },
  {
    label: "김동선 → ㈜한화 (개인)",
    ratePercent: 5.37,
    baseDate: "2025년 3분기 말",
    sourceLabel: "뉴시스, 오너3세 시대 관련 보도",
    sourceUrl: "https://www.newsis.com/view/NISX20250331_0003120455",
    confidence: "MEDIUM",
  },
  {
    label: "3형제 합산 → ㈜한화",
    ratePercent: 20.51,
    baseDate: "2025년 3분기 말",
    sourceLabel: "뉴시스, 오너3세 시대 관련 보도",
    sourceUrl: "https://www.newsis.com/view/NISX20250331_0003120455",
    confidence: "MEDIUM",
  },
  {
    label: "김동관 → 한화에너지 (개인 최대주주, 간접지배)",
    ratePercent: 22.16,
    baseDate: "2026년 1월",
    sourceLabel: "더벨, 부채 이관 효과 기사",
    sourceUrl: "https://www.thebell.co.kr/front/newsview.asp?key=202601191639209040107220",
    confidence: "MEDIUM",
  },
  {
    label: "㈜한화 → 한화에어로스페이스",
    ratePercent: 32.18,
    baseDate: "2026년 초",
    sourceLabel: "㈜한화 IR 지배지분구조도",
    sourceUrl: "https://www.hanwhacorp.co.kr/hanwha/investment/share_structure.jsp",
    confidence: "MEDIUM",
  },
  {
    label: "㈜한화 → 한화솔루션",
    ratePercent: 36.7,
    baseDate: "2026년 초",
    sourceLabel: "㈜한화 IR 지배지분구조도",
    sourceUrl: "https://www.hanwhacorp.co.kr/hanwha/investment/share_structure.jsp",
    confidence: "MEDIUM",
  },
  {
    label: "㈜한화 → 한화생명보험",
    ratePercent: 43.2,
    baseDate: "2026년 초",
    sourceLabel: "㈜한화 IR 지배지분구조도",
    sourceUrl: "https://www.hanwhacorp.co.kr/hanwha/investment/share_structure.jsp",
    confidence: "MEDIUM",
  },
  {
    label: "㈜한화 → 한화비전",
    ratePercent: 34.0,
    baseDate: "2026년 초",
    sourceLabel: "㈜한화 IR 지배지분구조도",
    sourceUrl: "https://www.hanwhacorp.co.kr/hanwha/investment/share_structure.jsp",
    confidence: "MEDIUM",
  },
  {
    label: "한화에어로스페이스 → 한화시스템",
    ratePercent: 59.54,
    baseDate: "2026년",
    sourceLabel: "디지털투데이, 한화시스템 지분 관련 보도",
    sourceUrl: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=649795",
    confidence: "MEDIUM",
  },
  {
    label: "한화에어로스페이스 → 한화오션 (단독)",
    ratePercent: 25.61,
    baseDate: "2026-04-08",
    sourceLabel: "네이트뉴스, 한화오션 최대주주 보도",
    sourceUrl: "https://news.nate.com/view/20260408n35383",
    confidence: "MEDIUM",
  },
  {
    label: "한화에어로스페이스+특수관계인 → 한화오션 (합산)",
    ratePercent: 60.42,
    baseDate: "2026-04-08",
    sourceLabel: "네이트뉴스, 한화오션 최대주주 보도",
    sourceUrl: "https://news.nate.com/view/20260408n35383",
    confidence: "MEDIUM",
  },
  {
    label: "한화시스템 → 한화오션",
    ratePercent: 7.03,
    baseDate: "2026년 3월",
    sourceLabel: "네이트뉴스, 한화오션 최대주주 보도",
    sourceUrl: "https://news.nate.com/view/20260408n35383",
    confidence: "MEDIUM",
  },
];

// 상장 계열사 — 이번 조사에서 종목코드까지 교차검증된 11개 (전체 상장사 수는 약 12개로 알려짐)
export const HANWHA_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "㈜한화", stockCode: "000880", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화에어로스페이스", stockCode: "012450", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화오션", stockCode: "042660", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화시스템", stockCode: "272210", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화솔루션", stockCode: "009830", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화엔진", stockCode: "082740", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화비전", stockCode: "489790", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화갤러리아", stockCode: "452260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화생명보험", stockCode: "088350", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화손해보험", stockCode: "000370", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "한화투자증권", stockCode: "003530", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const HANWHA_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "한화는 지주회사 체제인가요?",
    answer:
      "㈜한화는 그룹 지배구조의 핵심 회사이지만 공정거래법상 지주회사로 신고·관리되는 법적 지주회사는 아닙니다. 따라서 일반지주회사에 적용되는 금융·보험회사 주식 보유 제한 구조와는 다르게 봐야 합니다.",
  },
  {
    question: "2026년 한화 인적분할이 뭔가요?",
    answer:
      "㈜한화를 존속법인과 신설법인으로 나누는 계획입니다. 존속법인은 방산·조선·에너지·금융 축을, 신설법인은 기계·로봇·반도체 장비·유통·호텔·레저 축을 맡는 구조입니다. 2026년 7월 15일 임시주총에서 분할계획이 승인됐고, 분할비율은 존속법인 0.7563533, 신설법인 0.2436467입니다.",
  },
  {
    question: "김승연 회장과 아들 3형제 중 누가 더 많은 지분을 가지고 있나요?",
    answer:
      "3형제(김동관·김동원·김동선) 합산 지분이 20.51%로, 김승연 회장 개인 지분 11.33%보다 이미 많습니다. 2025년 3월 지분 증여 이후 경영권이 3세대로 넘어가는 흐름을 보여주는 수치입니다.",
  },
  {
    question: "한화오션의 최대주주는 누구인가요?",
    answer:
      "한화에어로스페이스입니다. 단독 지분은 25.61%이지만, 한화시스템이 보유한 7.03%를 포함한 특수관계인 합산 지분은 60.42%에 달합니다.",
  },
  {
    question: "한화그룹 상장 계열사는 몇 개인가요?",
    answer: "이번 조사에서 종목코드까지 확인된 것은 11개입니다. 공식 기업집단 자료와 상장사 목록은 기준일에 따라 달라질 수 있으므로, 이 페이지에서는 종목코드 확인 여부를 기준으로 별도 표기했습니다.",
  },
  {
    question: "기존 ㈜한화 주주는 신설법인 주식도 받나요?",
    answer:
      "인적분할 구조이므로 기준일에 ㈜한화 주식을 보유한 주주는 존속법인과 신설법인 주식을 분할비율에 따라 받는 구조입니다. 단, 실제 배정 주식 수와 단주 처리 방식은 최종 공시와 증권사 안내를 확인해야 합니다.",
  },
  {
    question: "한화에너지가 왜 중요하게 보이나요?",
    answer:
      "한화에너지는 ㈜한화 지분 22.16%를 보유한 주요 주주로 알려져 있고, 오너 3형제 지분과 연결돼 있어 단순한 개인 직접지분만으로는 한화그룹 지배구조를 설명하기 어렵습니다. 다만 간접 연결값은 경제적 노출을 단순 계산한 참고값일 뿐, 법적 의결권이 개인에게 곧바로 귀속된다는 뜻은 아닙니다.",
  },
  {
    question: "인적분할 후 주가가 자동으로 오르나요?",
    answer:
      "그렇지 않습니다. 사업 분리로 각 법인의 가치가 더 선명해질 수는 있지만, 분할 후 실적, 부채, 배당정책, 상장 직후 수급, 시장 할인율에 따라 합산 시가총액은 분할 전보다 높아질 수도 낮아질 수도 있습니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 특히 이 페이지는 2026년 7월 15일 승인된 인적분할이 아직 효력 발생 전인 시점의 구조를 기준으로 하므로, 분할 완료 후에는 지배구조가 크게 바뀝니다.",
  },
];

export const HANWHA_SEO_INTRO = [
  "한화그룹은 조사 시점(2026년 7월)에 지배구조 자체가 크게 바뀌는 중입니다. 2026년 1월 이사회에서 ㈜한화 인적분할을 의결했고, 7월 15일 임시주주총회에서 분할계획서가 승인됐습니다. 존속법인은 방산·조선·에너지·금융 축을, 신설법인은 기계·로봇·반도체 장비·유통·호텔·레저 축을 맡는 구조로 재편될 예정입니다.",
  "㈜한화만 보면 한화그룹 지배구조를 이해하기 어렵습니다. 김승연 회장과 3형제의 직접 지분, 한화에너지가 보유한 ㈜한화 22.16%, 그리고 인적분할 이후 두 상장사로 나뉘는 사업 구조를 함께 봐야 합니다.",
  "한화그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 116개로 집계됩니다. 다만 계열사 수와 상장 계열사 수는 기준일과 집계 방식에 따라 달라질 수 있어, 이 페이지에서는 확인 가능한 상장 종목과 핵심 지분 연결을 중심으로 설명합니다.",
];

export const HANWHA_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "이 페이지의 지분 연결도는 2026년 인적분할 효력 발생 전(분할계획 승인 직후) 시점의 구조입니다. 분할 완료 후에는 존속법인·신설법인으로 크게 재편됩니다.",
  "한화에너지를 통한 간접 연결값은 단순 경제적 연결을 설명하기 위한 참고 계산입니다. 직접 의결권, 법적 소유권, 실질 지배력과 동일한 개념으로 보지 않습니다.",
  "한화오션처럼 한화에어로스페이스와 한화시스템이 동시에 지분을 보유하는 경우, 트리에는 가장 비중이 큰 연결(한화에어로스페이스)만 표시하고 나머지는 보조 텍스트로 표기했습니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
