import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const HMO_META: GroupOwnershipMeta = {
  groupId: "hyundai-motor",
  groupName: "현대차",
  isLegalHoldingCompany: false,
  holdingCompanyNote:
    "법적 지주회사 없음 — 현대모비스가 현대차·기아와 이어지는 순환출자 고리의 지배구조 핵심축입니다. 4대그룹 중 유일하게 순환출자 구조가 남아있습니다.",
  affiliateCount: 74,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 12,
  fairTradeRank: 3,
  updatedAt: "2026-07-16",
  dataSourceNotice:
    "이 페이지의 지분율은 DART 공시를 인용한 위즈리포트·언론 보도 등 2차 자료를 종합한 것입니다. 표에 표시된 신뢰도(높음·중간·낮음)를 참고하시고, 정확한 수치는 전자공시시스템(dart.fss.or.kr) 원문에서 다시 확인하시길 권합니다. 순환출자 고리의 정확한 지분율은 공시 시점에 따라 계속 바뀝니다.",
};

// 지분 연결도(OwnershipTree)용 노드 — 순환출자는 마지막 간선을 그리지 않고 circularNote로 대체
export const HMO_TREE_NODES: GroupCompany[] = [
  {
    id: "owner",
    name: "정의선 외 특수관계인",
    listed: false,
    sector: "NON_FINANCIAL",
    role: "OWNER_FAMILY",
    primaryParentId: null,
    primaryRatePercent: null,
  },
  {
    id: "hyundai-mobis",
    name: "현대모비스",
    stockCode: "012330",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "CORE_COMPANY",
    primaryParentId: "owner",
    primaryRatePercent: null,
  },
  {
    id: "hyundai-motor",
    name: "현대차",
    stockCode: "005380",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hyundai-mobis",
    primaryRatePercent: 21.43,
  },
  {
    id: "kia",
    name: "기아",
    stockCode: "000270",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "hyundai-motor",
    primaryRatePercent: 35.17,
    circularNote: "기아가 현대모비스 지분을 보유한 최대주주 — 순환출자 고리가 다시 현대모비스로 이어집니다.",
  },
  {
    id: "hyundai-steel",
    name: "현대제철",
    stockCode: "004020",
    listed: true,
    market: "KOSPI",
    sector: "NON_FINANCIAL",
    role: "AFFILIATE",
    primaryParentId: "kia",
    primaryRatePercent: 17.27,
    circularNote: "현대제철은 핵심 순환 고리가 아니라 보조 지분 연결로 별도 해석해야 합니다.",
  },
];

export const HMO_OWNERSHIP_FACTS: OwnershipFact[] = [
  {
    label: "정의선 → 현대차 (개인)",
    ratePercent: 2.7,
    baseDate: "2026-05-20",
    sourceLabel: "인베스트조선, 재벌승계지도 기사",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/05/19/2026051980178.html",
    confidence: "MEDIUM",
  },
  {
    label: "정의선 → 현대모비스 (개인)",
    ratePercent: 0.33,
    baseDate: "2025-09",
    sourceLabel: "CEOSCOREDAILY, 재벌승계지도 기사",
    sourceUrl: "https://m.ceoscoredaily.com/page/view/2026010813493113474",
    confidence: "MEDIUM",
  },
  {
    label: "정의선 → 현대글로비스 (개인)",
    ratePercent: 20.0,
    baseDate: "2025-09",
    sourceLabel: "CEOSCOREDAILY, 재벌승계지도 기사",
    sourceUrl: "https://m.ceoscoredaily.com/page/view/2026010813493113474",
    confidence: "MEDIUM",
  },
  {
    label: "정몽구 → 현대차 (개인)",
    ratePercent: 5.57,
    baseDate: "2025-12",
    sourceLabel: "언론 보도, 지분 공시 인용",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/06/15/2026061580139.html",
    confidence: "MEDIUM",
  },
  {
    label: "정몽구 → 현대모비스 (개인)",
    ratePercent: 7.47,
    baseDate: "2026-06",
    sourceLabel: "인베스트조선, 지분 공시 인용",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/06/15/2026061580139.html",
    confidence: "MEDIUM",
  },
  {
    label: "정몽구 → 현대제철 (개인)",
    ratePercent: 11.84,
    baseDate: "2026-06",
    sourceLabel: "인베스트조선, 지분 공시 인용",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/06/15/2026061580139.html",
    confidence: "MEDIUM",
  },
  {
    label: "현대모비스 외 11명 → 현대자동차 (최대주주 등 합산)",
    ratePercent: 30.67,
    baseDate: "2026년 기업지배구조보고서",
    sourceLabel: "현대자동차 기업지배구조 보고서 공시",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260601000966&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "현대모비스 → 현대차",
    ratePercent: 21.43,
    baseDate: "2026년 상반기",
    sourceLabel: "언론 보도, 순환출자 구조 기사",
    sourceUrl: "https://www.newsprime.co.kr/news/article/?no=309277",
    confidence: "MEDIUM",
  },
  {
    label: "현대차 → 기아",
    ratePercent: 35.17,
    baseDate: "2025년 말",
    sourceLabel: "기아 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260312002040&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "기아 → 현대모비스 (최대주주)",
    ratePercent: 18.1,
    baseDate: "2026-06-16",
    sourceLabel: "인베스트조선, 순환출자 구조 기사",
    sourceUrl: "https://www.investchosun.com/site/data/html_dir/2026/06/15/2026061580139.html",
    confidence: "MEDIUM",
  },
  {
    label: "기아 → 현대제철",
    ratePercent: 17.27,
    baseDate: "2025년 말",
    sourceLabel: "현대제철 사업보고서",
    sourceUrl: "https://kind.krx.co.kr/common/disclsviewer.do?acptno=20260318002148&docno=&method=search&viewerhost=",
    confidence: "HIGH",
  },
  {
    label: "현대제철 → 현대모비스",
    ratePercent: 6.1,
    baseDate: "2026년",
    sourceLabel: "언론 보도, 순환출자 구조 기사",
    sourceUrl: "https://www.newsprime.co.kr/news/article/?no=309277",
    confidence: "MEDIUM",
  },
];

export const HMO_KPI_CARDS = [
  { label: "국내 계열사", value: "74개", note: "공정위 2026-05-01 기준", tone: "official" },
  { label: "상장 계열사", value: "12개", note: "종목코드 교차검증 기준", tone: "official" },
  { label: "재계 순위", value: "3위", note: "공정자산 320.8조원 기준", tone: "official" },
  { label: "법적 지주회사", value: "없음", note: "현대모비스가 핵심축", tone: "official" },
  { label: "핵심 순환 고리", value: "3개사", note: "현대모비스·현대차·기아", tone: "calculated" },
  { label: "순환출자 상태", value: "유지", note: "비교계산소 자체 분류", tone: "calculated" },
];

export const HMO_CIRCULAR_CONNECTIONS = [
  {
    step: "1",
    label: "현대모비스 → 현대자동차",
    rate: "21.43%",
    description: "현대모비스가 현대자동차 주요 지분을 보유하는 첫 번째 연결입니다.",
  },
  {
    step: "2",
    label: "현대자동차 → 기아",
    rate: "35.17%",
    description: "현대자동차가 기아의 최대주주로 공시된 연결입니다.",
  },
  {
    step: "3",
    label: "기아 → 현대모비스",
    rate: "18.10%",
    description: "기아가 현대모비스 지분을 보유해 순환 고리가 다시 현대모비스로 돌아갑니다.",
  },
  {
    step: "결과",
    label: "순환 고리 단순 연결값",
    rate: "약 1.36%",
    description: "세 지분율을 단순 곱한 참고값입니다. 직접 지분이나 법적 의결권이 아닙니다.",
  },
];

export const HMO_CORE_COMPANY_ROLES = [
  {
    company: "현대모비스",
    role: "핵심 자동차부품·A/S",
    position: "현대차 주요 주주, 순환 고리 핵심축",
    investorPoint: "그룹 지배구조 개편 기대와 사업가치 평가가 함께 반영됩니다.",
  },
  {
    company: "현대자동차",
    role: "완성차 중심 사업회사",
    position: "기아 최대주주",
    investorPoint: "완성차 실적, 배당, 글로벌 판매, 계열사 지분가치를 함께 봅니다.",
  },
  {
    company: "기아",
    role: "완성차 사업회사",
    position: "현대차 자회사이면서 현대모비스 최대주주",
    investorPoint: "높은 수익성, 주주환원, 순환출자 해소 방식이 주요 변수입니다.",
  },
  {
    company: "현대글로비스",
    role: "물류·유통",
    position: "오너 일가 지분과 관련해 개편 시 자주 거론",
    investorPoint: "개편 기대가 반영될 수 있지만 공식 확정안과 구분해야 합니다.",
  },
];

export const HMO_CONTROL_INTERPRETATION = [
  "오너 개인 지분만 보면 현대차그룹 전체 구조를 설명하기 어렵습니다.",
  "현대모비스·현대자동차·기아의 계열사 간 지분관계가 경영권 기반의 핵심입니다.",
  "현대글로비스처럼 오너 일가 지분과 관련해 시장에서 자주 거론되는 회사도 개편 논의에서 함께 주목됩니다.",
  "직접 지분율과 실질적인 경영 영향력은 동일 개념이 아닙니다.",
];

export const HMO_UNWINDING_BARRIERS = [
  { reason: "현대모비스 지분 확보 비용", description: "핵심축 지분을 추가 취득하려면 큰 자금이 필요합니다." },
  { reason: "주주 간 이해관계", description: "현대모비스·현대차·기아 주주에게 효과가 서로 다를 수 있습니다." },
  { reason: "합병비율 논란", description: "회사 간 합병이나 분할 시 적정 가치 산정이 가장 큰 쟁점이 됩니다." },
  { reason: "세금 부담", description: "지분 매각·교환 과정에서 세금과 거래비용이 발생할 수 있습니다." },
  { reason: "외국인·기관 주주", description: "주요 상장사 주주의 동의와 시장 평가를 피하기 어렵습니다." },
  { reason: "사업구조 변화", description: "전동화·SDV·로보틱스 등 사업 재편과 동시에 검토될 수 있습니다." },
];

export const HMO_RESTRUCTURING_SCENARIOS = [
  {
    title: "현대모비스 중심 유지",
    summary: "오너 일가→현대모비스→현대자동차→기아 흐름을 중심으로 정리하는 방식입니다.",
    upside: "기존 구조를 활용하고 정점이 비교적 명확합니다.",
    risk: "현대모비스 지분 확보 부담과 모비스 주주 반발 가능성이 남습니다.",
  },
  {
    title: "투자부문·사업부문 분할",
    summary: "현대모비스를 투자부문과 모듈·부품 사업부문으로 나눠 지분과 사업가치를 분리하는 가상 시나리오입니다.",
    upside: "지배구조 단순화와 사업가치 분리 평가가 가능해질 수 있습니다.",
    risk: "분할비율, 재상장, 합병 구조가 복잡하고 소액주주 이해상충 논란이 생길 수 있습니다.",
  },
  {
    title: "지분 매입·교환",
    summary: "기아 보유 현대모비스 지분 정리와 오너 일가 핵심회사 지분 확대를 조합하는 방식입니다.",
    upside: "순환출자를 직접 해소할 수 있고 기업 분할을 최소화할 수 있습니다.",
    risk: "막대한 자금, 세금, 주가 변동, 거래 상대방 확보 문제가 큽니다.",
  },
  {
    title: "현대글로비스 활용",
    summary: "현대글로비스를 활용하는 방안은 시장에서 거론되는 가상 시나리오 중 하나입니다.",
    upside: "오너 일가 지분과 물류·유통 사업가치를 함께 활용할 수 있다는 기대가 있습니다.",
    risk: "회사가 확정 발표한 개편안이 아니므로 기대감 선반영과 무산 가능성을 구분해야 합니다.",
  },
];

export const HMO_INVESTOR_IMPACT = [
  { stock: "현대모비스", positive: "지배구조 핵심회사 가치 부각", risk: "분할·합병비율 논란" },
  { stock: "현대자동차", positive: "순환출자 해소와 주주환원 개선 기대", risk: "계열사 지분 매각·취득 부담" },
  { stock: "기아", positive: "보유 지분가치 현실화 가능성", risk: "현대모비스 지분 처리 방식" },
  { stock: "현대글로비스", positive: "개편 과정에서 역할 확대 가능성", risk: "기대감 선반영 후 무산 가능성" },
  { stock: "현대제철", positive: "비핵심 지분 정리 가능성", risk: "매각가격·자금 활용 불확실성" },
];

export const HMO_BUSINESS_ECOSYSTEM = [
  { axis: "완성차", companies: "현대자동차 · 기아" },
  { axis: "핵심 부품", companies: "현대모비스 · 현대위아" },
  { axis: "소재", companies: "현대제철 · 현대비앤지스틸" },
  { axis: "물류·유통", companies: "현대글로비스" },
  { axis: "건설·인프라", companies: "현대건설 · 현대로템" },
  { axis: "소프트웨어·광고", companies: "현대오토에버 · 이노션" },
  { axis: "금융", companies: "현대차증권" },
];

export const HMO_LISTED_DETAIL_ROWS = [
  { company: "현대모비스", stockCode: "012330", shareholder: "기아 외", business: "부품·A/S", position: "지배구조 핵심축", circular: "포함" },
  { company: "현대자동차", stockCode: "005380", shareholder: "현대모비스 외", business: "완성차", position: "핵심 사업회사", circular: "포함" },
  { company: "기아", stockCode: "000270", shareholder: "현대자동차 외", business: "완성차", position: "현대모비스 최대주주", circular: "포함" },
  { company: "현대제철", stockCode: "004020", shareholder: "기아 외", business: "철강", position: "보조 지분 연결", circular: "보조" },
  { company: "현대글로비스", stockCode: "086280", shareholder: "오너 일가·계열사", business: "물류", position: "개편 관심회사", circular: "미포함" },
  { company: "현대오토에버", stockCode: "307950", shareholder: "현대자동차 외", business: "IT·SDV", position: "미래차 소프트웨어", circular: "미포함" },
];

export const HMO_STRUCTURE_TIMELINE = [
  { year: "2000년대", event: "현대차그룹 분리·재편", impact: "현재 자동차그룹 체계가 형성됐습니다." },
  { year: "이후", event: "현대모비스 중심 부품 통합", impact: "현대모비스가 핵심 부품회사이자 지배구조 핵심축으로 부상했습니다." },
  { year: "2018", event: "현대모비스 분할·합병 개편안 추진", impact: "주주 반발과 가치 산정 논란으로 철회됐습니다." },
  { year: "이후", event: "주주환원·사업 경쟁력 강화", impact: "개편 전 기업가치 개선과 시장 설득이 중요해졌습니다." },
  { year: "현재", event: "순환출자 구조 유지", impact: "향후 해소 방식이 시장의 주요 관심사로 남아 있습니다." },
];

export const HMO_GROUP_COMPARISON = [
  { metric: "법적 지주회사", samsung: "없음", sk: "SK㈜", hyundai: "없음", lg: "㈜LG" },
  { metric: "핵심 구조", samsung: "삼성물산·삼성생명", sk: "SK㈜·중간지주", hyundai: "현대모비스·현대차·기아 순환", lg: "㈜LG 중심" },
  { metric: "대표 이슈", samsung: "금융 계열 연결", sk: "다단계 상장", hyundai: "순환출자 해소", lg: "지주회사 할인" },
  { metric: "개편 난이도", samsung: "높음", sk: "높음", hyundai: "매우 높음", lg: "상대적으로 낮음" },
];

// 상장 계열사 12개 — 전부 이번 조사에서 종목코드 교차검증
export const HMO_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "현대자동차", stockCode: "005380", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "기아", stockCode: "000270", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대모비스", stockCode: "012330", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대제철", stockCode: "004020", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대건설", stockCode: "000720", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대글로비스", stockCode: "086280", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대위아", stockCode: "011210", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대로템", stockCode: "064350", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대오토에버", stockCode: "307950", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "이노션", stockCode: "214320", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대비앤지스틸", stockCode: "004560", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "현대차증권", stockCode: "001500", market: "KOSPI", sector: "FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const HMO_FAQ: GroupOwnershipFaqItem[] = [
  {
    question: "현대차그룹은 지주회사 체제인가요?",
    answer:
      "아닙니다. 현대차그룹은 4대그룹 중 유일하게 법적 지주회사가 없고 순환출자 구조를 유지하고 있습니다. 현대모비스가 현대차 지분을, 현대차가 기아 지분을, 기아가 다시 현대모비스 지분을 보유하는 고리로 이어집니다. 현대모비스는 법적 지주회사가 아니라 지배구조 핵심축으로 보는 편이 정확합니다.",
  },
  {
    question: "순환출자가 뭔가요?",
    answer:
      "A사가 B사 지분을, B사가 C사 지분을, C사가 다시 A사 지분을 보유해 지분이 원을 그리며 돌아오는 구조입니다. 현대차그룹은 현대모비스→현대차→기아→현대모비스로 이어지며, 적은 지분으로도 순환 전체에 지배력을 행사할 수 있다는 점이 특징이자 규제 이슈입니다.",
  },
  {
    question: "정의선 회장의 실질 지배력은 어느 정도인가요?",
    answer:
      "개인 명의 지분만으로 그룹 전체 구조를 설명하기는 어렵습니다. 오너 일가의 직접 지분과 현대모비스·현대차·기아의 계열사 간 지분 연결이 결합돼 그룹 경영권의 기반을 형성합니다.",
  },
  {
    question: "현대차그룹 상장 계열사는 몇 개인가요?",
    answer: "2026년 5월 1일 공정거래위원회 지정 기준 12개입니다. 현대자동차·기아·현대모비스 같은 핵심 계열사부터 현대차증권까지 포함됩니다.",
  },
  {
    question: "이 지분율은 언제 기준인가요?",
    answer:
      "회사마다 공시 시점이 달라 표마다 기준일을 따로 표기했습니다. 특히 순환출자 고리의 지분율은 자사주 매입 등으로 자주 바뀌므로, 정확한 현재 수치는 전자공시시스템에서 다시 확인하는 것이 안전합니다.",
  },
  {
    question: "현대차와 기아는 서로 같은 회사인가요?",
    answer:
      "아닙니다. 현대자동차가 기아 지분 35.17%를 보유한 최대주주지만, 두 회사는 각각 독립된 이사회와 주주를 가진 별도 상장회사입니다.",
  },
  {
    question: "순환출자는 불법인가요?",
    answer:
      "기존 순환출자가 곧바로 일률적으로 불법이 되는 것은 아니지만, 신규·강화되는 순환출자에는 규제가 적용될 수 있고 관련 공시 의무도 존재합니다. 따라서 불법 구조라고 단정하기보다 기존 순환출자 구조 및 규제 대상이라고 설명하는 것이 적절합니다.",
  },
  {
    question: "순환출자가 해소되면 현대모비스 주가는 오르나요?",
    answer:
      "해소 방식에 따라 다릅니다. 현대모비스가 지배구조 핵심축으로 부각될 수 있지만, 분할비율·합병비율·자금조달·주식 교환 조건에 따라 기존 주주에게 불리한 결과가 발생할 수도 있습니다.",
  },
];

export const HMO_SEO_INTRO = [
  "현대차그룹은 4대그룹(삼성·SK·현대차·LG) 중 유일하게 순환출자 구조가 남아있는 그룹입니다. 순환출자란 현대모비스가 현대차 지분을, 현대차가 기아 지분을, 기아가 다시 현대모비스 지분을 보유해 지분이 원을 그리며 돌아오는 구조를 말합니다. 이 구조 덕분에 적은 지분으로도 그룹 전체에 지배력을 행사할 수 있다는 점이 오랫동안 규제 이슈였습니다.",
  "정의선 회장의 개인 명의 지분만 보면 그룹 전체 구조를 설명하기 어렵습니다. 현대모비스→현대차→기아로 이어지는 순환출자 고리와 현대글로비스 등 계열사 지분이 함께 논의되며, 직접 지분율과 실질적인 경영 영향력은 동일 개념이 아닙니다.",
  "현대차그룹은 2026년 5월 1일 공정거래위원회 기준 국내 계열사 74개, 상장 계열사는 12개입니다. 공정자산 총액은 320.8조원으로 재계 순위 3위입니다.",
];

export const HMO_SEO_CRITERIA = [
  "지분율은 DART 공시를 인용한 언론 보도 등 2차 자료를 종합했습니다 — 원문 대조는 전자공시시스템(dart.fss.or.kr)에서 직접 확인하는 것이 가장 정확합니다.",
  "지분 연결도(트리)는 순환출자 고리를 닫는 마지막 간선(기아→현대모비스)을 그리지 않고, 노드 하단에 \"🔁 순환출자 있음\" 표시와 별도 설명으로 대체했습니다.",
  "현대제철은 핵심 순환 고리가 아니라 기아→현대제철, 현대제철→현대모비스로 이어지는 보조 지분 연결로 분리해 해석합니다.",
  "\"지배한다\"는 표현 대신 \"지분 연결상 영향권\", \"최대주주 및 특수관계인 기준\" 등 공정거래위원회·금융감독원이 실제 쓰는 용어를 사용합니다.",
];
