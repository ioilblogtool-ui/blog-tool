import type {
  GroupCompany,
  OwnershipFact,
  ListedAffiliateRow,
  GroupOwnershipMeta,
  GroupOwnershipFaqItem,
} from "./groupOwnershipTypes";

export const DOOSAN_META: GroupOwnershipMeta = {
  groupId: "doosan",
  groupName: "두산",
  isLegalHoldingCompany: false,
  holdingCompanyNote:
    "㈜두산은 2026년 현재 공정거래법상 지주회사로 단정해 설명하기보다, 주요 계열사 지분과 자체 사업을 함께 보유한 그룹 핵심 회사로 보는 편이 안전합니다. 투자자는 법적 지주회사 여부보다 ㈜두산이 직접 보유한 두산에너빌리티·두산로보틱스·두산테스나·오리콤 지분, 그리고 두산에너빌리티가 보유한 두산밥캣·두산퓨얼셀 지분을 분리해서 봐야 합니다.",
  affiliateCount: 23,
  affiliateCountBaseDate: "2026-05-01",
  affiliateCountConfidence: "MEDIUM",
  listedAffiliateCount: 7,
  fairTradeRank: 18,
  updatedAt: "2026-07-20",
  dataSourceNotice:
    "이 페이지의 지분율은 KIND·DART 공시와 기업정보 제공 자료를 함께 대조한 참고 정보입니다. 특히 두산로보틱스·두산밥캣 관련 재편은 발표·정정·철회·변경 가능성이 있었던 사안이므로, 현재 완료된 지분구조와 과거 추진안을 구분해 읽어야 합니다.",
};

export const DOOSAN_TREE_NODES: GroupCompany[] = [
  { id: "owner", name: "박정원 외 특수관계인", listed: false, sector: "NON_FINANCIAL", role: "OWNER_FAMILY", primaryParentId: null, primaryRatePercent: null },
  { id: "doosan-corp", name: "㈜두산", stockCode: "000150", listed: true, market: "KOSPI", sector: "NON_FINANCIAL", role: "CORE_COMPANY", primaryParentId: "owner", primaryRatePercent: 41.08 },
  { id: "doosan-enerbility", name: "두산에너빌리티", stockCode: "034020", listed: true, market: "KOSPI", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-corp", primaryRatePercent: 30.68 },
  { id: "doosan-robotics", name: "두산로보틱스", stockCode: "454910", listed: true, market: "KOSPI", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-corp", primaryRatePercent: 49.98 },
  { id: "doosan-tesna", name: "두산테스나", stockCode: "131970", listed: true, market: "KOSDAQ", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-corp", primaryRatePercent: 38.69 },
  { id: "oricom", name: "오리콤", stockCode: "010470", listed: true, market: "KOSDAQ", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-corp", primaryRatePercent: 60.89 },
  { id: "doosan-bobcat", name: "두산밥캣", stockCode: "241560", listed: true, market: "KOSPI", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-enerbility", primaryRatePercent: 48.17 },
  { id: "doosan-fuelcell", name: "두산퓨얼셀", stockCode: "336260", listed: true, market: "KOSPI", sector: "NON_FINANCIAL", role: "AFFILIATE", primaryParentId: "doosan-enerbility", primaryRatePercent: 37.85 },
];

export const DOOSAN_OWNERSHIP_FACTS: OwnershipFact[] = [
  { label: "박정원 외 26인 → ㈜두산", ratePercent: 41.08, baseDate: "2026-02-25", sourceLabel: "WiseReport, ㈜두산 지분현황", sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=000150", confidence: "MEDIUM" },
  { label: "박정원 → ㈜두산", ratePercent: 7.97, baseDate: "2026-02-25", sourceLabel: "WiseReport, ㈜두산 지분현황", sourceUrl: "https://comp.wisereport.co.kr/company/c1070001.aspx?cmp_cd=000150", confidence: "MEDIUM" },
  { label: "㈜두산 → 두산에너빌리티", ratePercent: 30.68, baseDate: "2026-07-16", sourceLabel: "WiseReport, 두산에너빌리티 주주현황", sourceUrl: "https://comp.wisereport.co.kr/samsung/company/c1010001.aspx?cmp_cd=034020&cn=", confidence: "MEDIUM" },
  { label: "㈜두산 → 두산로보틱스", ratePercent: 49.98, baseDate: "2026-06-09", sourceLabel: "KIND, 주식등의 대량보유상황보고서", sourceUrl: "https://kind.krx.co.kr/external/2026/06/09/000726/20260609001680/00636.htm", confidence: "HIGH" },
  { label: "두산에너빌리티 → 두산밥캣", ratePercent: 48.17, baseDate: "2026-03-05", sourceLabel: "KIND, 두산밥캣 최대주주등소유주식변동신고서", sourceUrl: "https://kind.krx.co.kr/external/2026/03/05/001815/20260305000797/99602.htm", confidence: "HIGH" },
  { label: "두산에너빌리티 외 → 두산퓨얼셀", ratePercent: 37.85, baseDate: "2026-02-04", sourceLabel: "WiseReport, 두산퓨얼셀 주주현황", sourceUrl: "https://wcomp.fnguide.com/Etp/EtfAnalysis?cmp_cd=336260", confidence: "MEDIUM" },
  { label: "㈜두산 → 두산테스나", ratePercent: 38.69, baseDate: "2026-03-31", sourceLabel: "KIND, 두산테스나 분기보고서", sourceUrl: "https://kind.krx.co.kr/external/2026/05/15/001941/20260515004301/11013.htm", confidence: "MEDIUM" },
  { label: "㈜두산 → 오리콤", ratePercent: 60.89, baseDate: "2026-05-15", sourceLabel: "오리콤 분기보고서·기업정보", sourceUrl: "https://kind.krx.co.kr/external/2026/05/15/002504/20260515005662/11013.htm", confidence: "LOW" },
];

export const DOOSAN_KPI_CARDS = [
  { label: "그룹 정점", value: "㈜두산", note: "법적 지주회사 여부보다 주요 계열 지분과 자체 사업을 함께 보는 구조" },
  { label: "두산로보틱스 최대주주", value: "㈜두산 49.98%", note: "2026년 6월 대량보유보고서 기준" },
  { label: "두산밥캣 최대주주", value: "두산에너빌리티 48.17%", note: "2026년 3월 최대주주등 소유주식 공시 기준" },
  { label: "핵심 투자축", value: "에너지·로봇·반도체", note: "원전/SMR, 협동로봇, 반도체 테스트·전자소재를 분리해서 해석" },
];

export const DOOSAN_STRUCTURE_STATUS_ROWS = [
  { item: "두산로보틱스 지분", current: "㈜두산이 직접 보유", previous: "2025년 말 기준 68.11%였으나, 2026년 2~4월 공시 이후 49.98%로 낮아짐", investor: "로봇 사업 노출은 두산로보틱스가 직접적이고, ㈜두산은 보유지분 가치로 간접 반영" },
  { item: "두산밥캣 지분", current: "두산에너빌리티가 최대주주", previous: "로보틱스 아래로 옮기는 재편안이 추진됐지만 현재 완료 구조로 쓰면 안 됨", investor: "건설기계·산업차량 노출은 두산밥캣이 직접적이고, 두산에너빌리티에는 연결 실적·지분가치로 반영" },
  { item: "두산에너빌리티 지분", current: "㈜두산이 30.68% 보유", previous: "원전·SMR 기대가 커지며 그룹 시가총액에서 비중이 커진 축", investor: "원전/가스터빈/발전서비스는 두산에너빌리티를 중심으로 봐야 함" },
  { item: "두산테스나·오리콤", current: "㈜두산의 직접 또는 계열 지분 축", previous: "트리에서 누락되면 반도체 테스트·광고 계열 노출이 약해 보임", investor: "㈜두산은 순수 지분회사라기보다 자체 사업과 포트폴리오 가치가 섞인 복합기업" },
];

export const DOOSAN_BUSINESS_AXIS_ROWS = [
  { axis: "㈜두산", business: "전자BG, 디지털이노베이션, 지분 보유", listed: "000150", signal: "전자소재·AI 인프라·자회사 가치가 함께 반영" },
  { axis: "두산에너빌리티", business: "원전, SMR, 가스터빈, 발전 기자재·서비스", listed: "034020", signal: "수주잔고, 원전 프로젝트, 가스터빈·SMR 기대" },
  { axis: "두산로보틱스", business: "협동로봇, 자동화 솔루션", listed: "454910", signal: "매출 성장, 적자 축소, 글로벌 판매망·M&A" },
  { axis: "두산밥캣", business: "소형 건설기계, 산업차량, 포터블파워", listed: "241560", signal: "북미 경기, 금리, 주주환원, 현금창출력" },
  { axis: "두산테스나", business: "시스템반도체 테스트", listed: "131970", signal: "가동률, 고객사 물량, 후공정 투자 사이클" },
];

export const DOOSAN_RESTRUCTURING_TIMELINE = [
  { period: "2024년", event: "두산밥캣을 로봇 축과 결합하려는 재편안 발표", meaning: "밥캣의 현금창출력과 로봇 성장성을 묶는 구상이었지만 소액주주 가치 논란이 커짐", status: "추진안" },
  { period: "2024~2025년", event: "분할합병·주식교환 조건을 둘러싼 논란", meaning: "합병비율, 공개매수, 두산에너빌리티 주주 영향이 핵심 쟁점", status: "논란" },
  { period: "2026년 2월", event: "㈜두산의 두산로보틱스 지분이 50.06%로 축소", meaning: "2025년 말 68.11%였던 보유비율과 현재 지분율을 구분해야 함", status: "완료 공시" },
  { period: "2026년 4~6월", event: "㈜두산의 두산로보틱스 보유비율 49.98% 공시", meaning: "로보틱스는 두산에너빌리티 자회사가 아니라 ㈜두산의 직접 보유 축으로 보는 것이 안전", status: "현재 기준" },
];

export const DOOSAN_VALUE_CHAIN_ROWS = [
  { stage: "AI 전력 수요", companies: "두산에너빌리티", role: "원전·SMR·가스터빈·발전 기자재 수요 기대" },
  { stage: "수소·연료전지", companies: "두산퓨얼셀", role: "발전용 연료전지와 장기 유지보수 매출" },
  { stage: "피지컬 AI", companies: "두산로보틱스", role: "협동로봇·자동화 솔루션 성장성" },
  { stage: "산업장비", companies: "두산밥캣", role: "북미 소형장비·산업차량 현금창출력" },
  { stage: "반도체 인프라", companies: "㈜두산 전자BG·두산테스나", role: "전자소재와 시스템반도체 테스트 노출" },
];

export const DOOSAN_INDIRECT_CALC_ROWS = [
  { target: "박정원 외 → 두산에너빌리티", formula: "41.08% x 30.68%", result: "약 12.61%", note: "㈜두산을 통한 단순 간접 노출 계산" },
  { target: "㈜두산 → 두산밥캣", formula: "30.68% x 48.17%", result: "약 14.78%", note: "두산에너빌리티를 통한 단순 간접 노출" },
  { target: "㈜두산 → 두산퓨얼셀", formula: "30.68% x 37.85%", result: "약 11.61%", note: "두산에너빌리티 외 특수관계인 합산 지분 기준" },
  { target: "박정원 외 → 두산로보틱스", formula: "41.08% x 49.98%", result: "약 20.53%", note: "법적 보유지분이 아니라 경제적 노출을 단순화한 값" },
];

export const DOOSAN_NAV_FORMULA_ROWS = [
  "㈜두산 추정 NAV = 상장 자회사 지분가치 + 비상장/자체 사업가치 - 순차입금",
  "상장 자회사 지분가치 = 각 자회사 시가총액 x ㈜두산 보유지분율",
  "자체 사업가치 = 전자BG·디지털이노베이션 등 영업가치에 적정 배수를 적용",
  "복합기업 할인율 = 1 - ㈜두산 시가총액 / 추정 NAV",
];

export const DOOSAN_HOLDING_CHECK_ROWS = [
  { label: "자회사 주식가액 비율", value: "자회사 주식가액 합계 / 자산총액", note: "50% 이상 여부가 핵심 참고 기준" },
  { label: "주의할 점", value: "법적 지주회사 여부는 단순 계산만으로 확정 불가", note: "공정위 지정·공시·회사 설명을 함께 확인해야 함" },
  { label: "투자자 관점", value: "지주회사 할인보다 복합기업 NAV 할인", note: "㈜두산은 자체 사업과 지분가치가 함께 움직임" },
];

export const DOOSAN_LISTED_DETAIL_ROWS = [
  { name: "㈜두산", code: "000150", market: "KOSPI", business: "전자소재·IT서비스·그룹 핵심 회사", parent: "박정원 외", exposure: "그룹 전체·전자소재·자회사 가치" },
  { name: "두산에너빌리티", code: "034020", market: "KOSPI", business: "원전·SMR·가스터빈·발전설비", parent: "㈜두산", exposure: "에너지 인프라·두산밥캣·두산퓨얼셀 연결" },
  { name: "두산로보틱스", code: "454910", market: "KOSPI", business: "협동로봇·자동화", parent: "㈜두산", exposure: "로봇 성장성 직접 노출" },
  { name: "두산밥캣", code: "241560", market: "KOSPI", business: "소형 건설기계·산업차량", parent: "두산에너빌리티", exposure: "북미 경기·현금창출력" },
  { name: "두산퓨얼셀", code: "336260", market: "KOSPI", business: "발전용 연료전지", parent: "두산에너빌리티 외", exposure: "수소·분산전원·장기서비스" },
  { name: "두산테스나", code: "131970", market: "KOSDAQ", business: "시스템반도체 테스트", parent: "㈜두산", exposure: "반도체 후공정·가동률" },
  { name: "오리콤", code: "010470", market: "KOSDAQ", business: "광고·매거진", parent: "㈜두산", exposure: "광고 경기·콘텐츠" },
];

export const DOOSAN_GROUP_COMPARISON = [
  { group: "두산", structure: "복합기업형 핵심회사 + 다단 지분", issue: "현재 구조와 과거 재편안을 구분해야 함" },
  { group: "한화", structure: "방산·조선·에너지 재편형", issue: "3형제 축과 사업 재편이 핵심" },
  { group: "HD현대", structure: "지주사-중간지주-사업회사", issue: "조선·에너지 중간지주 해석" },
  { group: "LS", structure: "사촌경영 병렬축", issue: "㈜LS·E1·인베니를 단일 지배구조로 보면 안 됨" },
];

export const DOOSAN_LISTED_AFFILIATES: ListedAffiliateRow[] = [
  { name: "㈜두산", stockCode: "000150", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "두산에너빌리티", stockCode: "034020", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "두산로보틱스", stockCode: "454910", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "두산밥캣", stockCode: "241560", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "두산퓨얼셀", stockCode: "336260", market: "KOSPI", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "두산테스나", stockCode: "131970", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
  { name: "오리콤", stockCode: "010470", market: "KOSDAQ", sector: "NON_FINANCIAL", stockCodeConfidence: "HIGH" },
];

export const DOOSAN_FAQ: GroupOwnershipFaqItem[] = [
  { question: "두산로보틱스의 최대주주는 누구인가요?", answer: "2026년 6월 KIND 대량보유보고서 기준 ㈜두산입니다. 보유비율은 49.98%로 공시되어 있으며, 2025년 말 기준 68.11%와는 기준일이 다릅니다." },
  { question: "두산밥캣은 두산로보틱스 자회사인가요?", answer: "현재 공시 기준으로는 아닙니다. 두산밥캣의 최대주주는 두산에너빌리티이며, 2026년 3월 공시 기준 두산에너빌리티 보유지분은 48.17%입니다. 과거 두산로보틱스 아래로 옮기는 재편안은 현재 완료 구조와 구분해야 합니다." },
  { question: "㈜두산은 지주회사인가요?", answer: "투자 콘텐츠에서는 '법적 지주회사'라고 단정하기보다 주요 계열 지분과 자체 사업을 함께 보유한 복합기업형 핵심회사로 설명하는 편이 안전합니다. 법적 지주회사 여부는 자회사 주식가액 비율뿐 아니라 공정위 지정과 공시를 함께 확인해야 합니다." },
  { question: "두산에너빌리티와 두산밥캣 중 무엇이 더 직접적인 투자 노출인가요?", answer: "원전·SMR·가스터빈은 두산에너빌리티가 직접적이고, 소형 건설기계·산업차량은 두산밥캣이 직접적입니다. 두산에너빌리티는 두산밥캣 지분과 연결 실적을 통해 밥캣 영향을 함께 받습니다." },
  { question: "두산로보틱스 주가는 왜 지배구조 이슈와 함께 움직이나요?", answer: "로봇 성장성 자체도 중요하지만, 두산밥캣 재편안처럼 그룹 내 현금창출 사업과 결합하려는 시도가 있었기 때문입니다. 그래서 두산로보틱스는 실적, 밸류에이션, 재편 가능성을 함께 봐야 합니다." },
  { question: "㈜두산 NAV는 어떻게 볼 수 있나요?", answer: "상장 자회사 지분가치, 자체 사업가치, 비상장 자산, 순차입금을 합산·차감해 추정할 수 있습니다. 다만 ㈜두산은 순수 지주사가 아니므로 '지주회사 할인'보다 '복합기업 NAV 할인'이라는 표현이 더 적절합니다." },
];

export const DOOSAN_SEO_INTRO = [
  "두산그룹 지분구조는 단순히 ㈜두산 아래에 모든 회사가 일렬로 붙어 있는 형태가 아닙니다. 2026년 공시 기준으로는 ㈜두산이 두산에너빌리티와 두산로보틱스를 직접 보유하고, 두산에너빌리티 아래에 두산밥캣과 두산퓨얼셀이 연결되는 구조로 보는 것이 안전합니다.",
  "특히 기존 페이지처럼 두산에너빌리티가 두산로보틱스를 보유하고, 두산로보틱스가 두산밥캣을 지배하는 구조로 표시하면 현재 공시와 어긋날 수 있습니다. 2024년에 두산밥캣을 로봇 축과 결합하려는 재편안이 추진됐지만, 투자 콘텐츠에서는 현재 완료된 공시 구조와 과거 추진안을 반드시 분리해야 합니다.",
  "투자자 관점에서는 ㈜두산, 두산에너빌리티, 두산로보틱스, 두산밥캣의 역할이 서로 다릅니다. ㈜두산은 전자소재와 자회사 지분가치가 섞인 복합기업이고, 두산에너빌리티는 원전·SMR·가스터빈, 두산로보틱스는 협동로봇 성장성, 두산밥캣은 북미 건설기계와 현금창출력이 핵심입니다.",
];

export const DOOSAN_SEO_CRITERIA = [
  "두산로보틱스 지분율은 2025년 말 68.11%와 2026년 6월 49.98%가 기준일별로 다르므로, 본문에서는 최신 대량보유보고서 기준을 우선 표시했습니다.",
  "두산밥캣은 2026년 공시 기준 두산에너빌리티가 최대주주입니다. 두산로보틱스 아래로 이동하는 재편안은 현재 완료 구조로 표시하지 않았습니다.",
  "㈜두산은 자체 사업과 계열 지분을 함께 보유하므로 순수 지주회사 할인보다 복합기업 NAV 할인 관점으로 설명했습니다.",
  "간접 지분율 계산은 경제적 노출을 이해하기 위한 단순 곱셈이며, 법적 의결권이나 연결 재무제표상 지배력을 그대로 의미하지 않습니다.",
];
