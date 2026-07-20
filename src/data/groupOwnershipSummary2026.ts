export type StructureType =
  | "LEGAL_HOLDING"
  | "NON_HOLDING_CORE"
  | "INTERMEDIATE_HOLDING"
  | "CIRCULAR"
  | "PARALLEL_FAMILY"
  | "RESTRUCTURING";

export type VerificationStatus = "검증 완료" | "일부 검증" | "공식 확인 필요";
export type VolatilityLevel = "낮음" | "보통" | "높음";

export interface GroupSummaryRow {
  rank: number;
  groupName: string;
  slug: string;
  legalHoldingCompany: string;
  structureType: StructureType;
  structureLabel: string;
  affiliateCount: number;
  listedCount: number;
  listedCountStatus: VerificationStatus;
  maxListedDepth: string;
  circularStatus: string;
  unlistedCore: string;
  restructuringStatus: string;
  volatility: VolatilityLevel;
  keyFeature: string;
  investorNote: string;
}

export const GROUP_HUB_META = {
  updatedAt: "2026-07-20",
  baseDate: "2026-05-01",
  officialGroupCount: 102,
  officialAffiliateCount: 3538,
  officialSourceLabel: "정책브리핑, 2026년 공시대상기업집단 지정 결과",
  officialSourceUrl: "https://m.korea.kr/news/policyNewsView.do?newsId=156759051",
};

export const GROUP_SUMMARY_ROWS: GroupSummaryRow[] = [
  { rank: 1, groupName: "삼성", slug: "samsung-group-ownership-2026", legalHoldingCompany: "없음", structureType: "NON_HOLDING_CORE", structureLabel: "복합 지분 연결", affiliateCount: 67, listedCount: 18, listedCountStatus: "일부 검증", maxListedDepth: "산정 필요", circularStatus: "순환출자 단정 금지", unlistedCore: "삼성생명·삼성물산 연결 해석", restructuringStatus: "안정", volatility: "보통", keyFeature: "삼성물산·삼성생명·삼성전자로 이어지는 복합 지분 연결", investorNote: "삼성전자를 직접 보려는 투자와 삼성물산·삼성생명을 통한 간접 노출은 구분해야 합니다." },
  { rank: 2, groupName: "SK", slug: "sk-group-ownership-2026", legalHoldingCompany: "SK㈜", structureType: "INTERMEDIATE_HOLDING", structureLabel: "지주사+중간지주", affiliateCount: 151, listedCount: 17, listedCountStatus: "일부 검증", maxListedDepth: "3단계", circularStatus: "없음", unlistedCore: "SK스퀘어·SK실트론 등", restructuringStatus: "재편 진행", volatility: "보통", keyFeature: "SK㈜ 아래 중간지주와 투자회사가 여러 층으로 존재", investorNote: "SK하이닉스 노출은 SK스퀘어·SK㈜를 통한 간접 경로와 직접 투자가 다릅니다." },
  { rank: 3, groupName: "현대차", slug: "hyundai-motor-group-ownership-2026", legalHoldingCompany: "없음", structureType: "CIRCULAR", structureLabel: "순환출자형", affiliateCount: 74, listedCount: 12, listedCountStatus: "일부 검증", maxListedDepth: "순환형 별도 분류", circularStatus: "주요 순환 연결 존재", unlistedCore: "현대엔지니어링 등", restructuringStatus: "개편 가능성 상존", volatility: "보통", keyFeature: "현대모비스·현대차·기아로 이어지는 순환 연결이 핵심", investorNote: "트리 깊이보다 순환 연결과 모비스 역할을 따로 봐야 합니다." },
  { rank: 4, groupName: "LG", slug: "lg-group-ownership-2026", legalHoldingCompany: "㈜LG", structureType: "LEGAL_HOLDING", structureLabel: "순수 지주회사형", affiliateCount: 63, listedCount: 12, listedCountStatus: "일부 검증", maxListedDepth: "3단계", circularStatus: "없음", unlistedCore: "일부 비상장 자회사", restructuringStatus: "안정", volatility: "낮음", keyFeature: "비교 대상 중 상대적으로 단순한 순수 지주회사 구조", investorNote: "LG에너지솔루션 노출은 LG화학과 ㈜LG를 통한 간접 노출까지 나눠 봐야 합니다." },
  { rank: 5, groupName: "한화", slug: "hanwha-group-ownership-2026", legalHoldingCompany: "없음", structureType: "RESTRUCTURING", structureLabel: "사업회사+재편형", affiliateCount: 116, listedCount: 11, listedCountStatus: "일부 검증", maxListedDepth: "산정 필요", circularStatus: "확인 필요", unlistedCore: "한화에너지", restructuringStatus: "인적분할 반영 중", volatility: "높음", keyFeature: "방산·조선·에너지 축 재편과 3형제 승계 구도가 함께 움직임", investorNote: "재편 전후 지분율과 사업회사 노출을 분리해야 합니다." },
  { rank: 6, groupName: "롯데", slug: "lotte-group-ownership-2026", legalHoldingCompany: "롯데지주", structureType: "LEGAL_HOLDING", structureLabel: "국내 지주+일본 연결", affiliateCount: 98, listedCount: 11, listedCountStatus: "일부 검증", maxListedDepth: "산정 필요", circularStatus: "국내 상당 부분 해소", unlistedCore: "호텔롯데", restructuringStatus: "재편 가능성 상존", volatility: "보통", keyFeature: "국내 롯데지주 축과 호텔롯데를 통한 한일 연결 축이 공존", investorNote: "일본 롯데홀딩스를 단일 최상위 루트처럼 단정하면 오해가 생깁니다." },
  { rank: 8, groupName: "HD현대", slug: "hd-hyundai-group-ownership-2026", legalHoldingCompany: "HD현대", structureType: "INTERMEDIATE_HOLDING", structureLabel: "지주사+조선 중간지주", affiliateCount: 29, listedCount: 7, listedCountStatus: "검증 완료", maxListedDepth: "3단계", circularStatus: "없음", unlistedCore: "HD현대오일뱅크", restructuringStatus: "합병 반영", volatility: "보통", keyFeature: "HD한국조선해양을 중심으로 조선 중간지주 구조가 뚜렷함", investorNote: "조선 노출은 HD현대보다 HD한국조선해양·사업 자회사로 갈수록 직접적입니다." },
  { rank: 14, groupName: "LS", slug: "ls-group-ownership-2026", legalHoldingCompany: "개별 확인", structureType: "PARALLEL_FAMILY", structureLabel: "병렬 사촌경영", affiliateCount: 72, listedCount: 10, listedCountStatus: "일부 검증", maxListedDepth: "병렬 축", circularStatus: "확인 필요", unlistedCore: "LS전선", restructuringStatus: "안정", volatility: "낮음", keyFeature: "㈜LS·E1·인베니가 하나의 상하 지배구조가 아닌 병렬 축으로 존재", investorNote: "LS전선과 전력망 노출은 ㈜LS·LS ELECTRIC·비상장 LS전선을 구분해야 합니다." },
  { rank: 18, groupName: "두산", slug: "doosan-group-ownership-2026", legalHoldingCompany: "공식 확인 필요", structureType: "NON_HOLDING_CORE", structureLabel: "복합기업형 핵심회사", affiliateCount: 23, listedCount: 7, listedCountStatus: "검증 완료", maxListedDepth: "3단계", circularStatus: "확인 필요", unlistedCore: "일부 자체 사업", restructuringStatus: "재편 이력", volatility: "보통", keyFeature: "㈜두산이 자체 사업과 주요 계열 지분을 함께 보유", investorNote: "두산로보틱스와 두산밥캣은 현재 구조와 과거 재편안을 분리해야 합니다." },
];

export const GROUP_HUB_KPIS = [
  { label: "비교 그룹", value: "9개", note: "상세 리포트가 연결된 주요 대기업집단" },
  { label: "공식 기준일", value: "2026-05-01", note: "공정위 공시대상기업집단 지정 기준" },
  { label: "공식 지정 집단", value: "102개", note: "2026년 공시대상기업집단 전체" },
  { label: "공식 소속회사", value: "3,538개", note: "공정위 발표 전체 소속회사 수" },
  { label: "구조 유형", value: "6종", note: "지주사·중간지주·순환·병렬·재편 등" },
  { label: "상장사 수", value: "확인 기준", note: "그룹별 상세 페이지에서 교차 검증한 범위" },
];

export const STRUCTURE_TYPE_LABELS: Record<StructureType, string> = {
  LEGAL_HOLDING: "법적 지주회사 중심",
  NON_HOLDING_CORE: "비지주 핵심회사",
  INTERMEDIATE_HOLDING: "중간지주 포함",
  CIRCULAR: "순환출자형",
  PARALLEL_FAMILY: "병렬 사촌경영",
  RESTRUCTURING: "구조 재편 진행",
};

export const STRUCTURE_TYPE_DESCRIPTIONS = [
  { type: "LEGAL_HOLDING" as const, title: "법적 지주회사 중심", groups: "SK, LG, 롯데, HD현대", note: "법적 지주회사가 있더라도 중간지주·상장 자회사가 많으면 구조는 복잡할 수 있습니다." },
  { type: "NON_HOLDING_CORE" as const, title: "비지주 핵심회사", groups: "삼성, 두산", note: "법적 지주회사가 아니어도 특정 회사가 실질적 지분 연결의 중심 역할을 할 수 있습니다." },
  { type: "CIRCULAR" as const, title: "순환출자형", groups: "현대차", note: "일반적인 위아래 트리보다 순환 연결과 핵심 고리를 따로 봐야 합니다." },
  { type: "PARALLEL_FAMILY" as const, title: "병렬 사촌경영", groups: "LS", note: "하나의 최상위 지주사가 모든 축을 지배한다고 보면 오해가 생깁니다." },
  { type: "RESTRUCTURING" as const, title: "구조 재편 진행", groups: "한화", note: "인적분할·합병·사업 재편의 완료 여부와 기준일을 함께 확인해야 합니다." },
];

export const LISTING_DEPTH_ROWS = [
  { group: "SK", path: "SK㈜ → SK스퀘어 → SK하이닉스", depth: "3단계", note: "대표적인 지주사+중간지주 경로" },
  { group: "LG", path: "㈜LG → LG화학 → LG에너지솔루션", depth: "3단계", note: "물적분할 이후 모회사 할인 논점" },
  { group: "HD현대", path: "HD현대 → HD한국조선해양 → HD현대중공업", depth: "3단계", note: "조선 중간지주 구조" },
  { group: "두산", path: "㈜두산 → 두산에너빌리티 → 두산밥캣", depth: "3단계", note: "현재 구조 기준, 로보틱스 경로와 구분" },
  { group: "현대차", path: "현대모비스·현대차·기아 순환 연결", depth: "순환형", note: "단순 깊이보다 순환 고리 여부가 중요" },
];

export const DOUBLE_LISTING_ROWS = [
  { group: "SK", structure: "SK㈜ → SK스퀘어 → SK하이닉스", investorIssue: "지주사·중간지주 할인과 반도체 직접 노출 차이" },
  { group: "LG", structure: "㈜LG → LG화학 → LG에너지솔루션", investorIssue: "물적분할 이후 모회사 할인과 배터리 직접 투자 차이" },
  { group: "HD현대", structure: "HD현대 → HD한국조선해양 → 조선 상장 자회사", investorIssue: "조선 업황 노출이 여러 상장사로 나뉨" },
  { group: "두산", structure: "㈜두산 → 두산에너빌리티 → 두산밥캣", investorIssue: "현재 공시 구조와 과거 재편안을 혼동하면 안 됨" },
  { group: "삼성", structure: "삼성물산·삼성생명·삼성전자 복합 연결", investorIssue: "직접 지분과 간접 지분의 경제적 노출을 구분" },
];

export const INVESTMENT_EXPOSURE_ROWS = [
  { theme: "반도체", direct: "삼성전자, SK하이닉스, 두산테스나", indirect: "삼성물산·삼성생명, SK㈜·SK스퀘어, ㈜두산" },
  { theme: "배터리", direct: "LG에너지솔루션", indirect: "LG화학, ㈜LG" },
  { theme: "조선", direct: "HD현대중공업, 한화오션", indirect: "HD한국조선해양, HD현대, 한화" },
  { theme: "원전·전력", direct: "두산에너빌리티, LS ELECTRIC", indirect: "㈜두산, ㈜LS" },
  { theme: "방산·항공", direct: "한화에어로스페이스", indirect: "한화, 한화에너지 축" },
  { theme: "자동차", direct: "현대차, 기아, 현대모비스", indirect: "순환 연결 구조상 상호 지분 영향 병존" },
];

export const HUB_CALCULATOR_LINKS = [
  { href: "/tools/indirect-ownership-calculator/", label: "간접 지분율 계산기", description: "여러 단계 지분 연결의 단순 경제적 노출을 계산합니다." },
  { href: "/reports/group-ownership-hub-2026/", label: "그룹 지분구조 허브", description: "9개 그룹의 구조 유형과 공식 기준일을 한 화면에서 비교합니다." },
  { href: "/reports/", label: "리포트 전체 보기", description: "그룹별 상세 해설과 계산형 리포트를 이어서 확인합니다." },
];

export const GROUP_HUB_FAQ = [
  { question: "지주회사가 있으면 지배구조가 무조건 단순한가요?", answer: "아닙니다. 법적 지주회사가 있어도 중간지주와 상장 자회사·손자회사가 여러 단계로 존재하면 투자 구조는 복잡할 수 있습니다. SK와 HD현대가 대표적입니다." },
  { question: "상장 계열사가 많으면 투자자에게 무조건 좋은가요?", answer: "꼭 그렇지는 않습니다. 계열사별 자금조달과 사업 전문성은 좋아질 수 있지만, 모회사 할인·중복상장·소액주주 이해상충 문제가 생길 수 있습니다." },
  { question: "법적 지주회사와 실질 지배구조 정점은 무엇이 다른가요?", answer: "법적 지주회사는 공정거래법상 요건을 충족해 관리되는 회사입니다. 실질 지배구조 정점은 법적 지주회사가 아니더라도 주요 계열 지분과 의사결정에서 중심 역할을 하는 회사를 설명하는 비공식 표현입니다." },
  { question: "계열사 수와 상장 계열사 수는 어떻게 봐야 하나요?", answer: "계열사 수는 공정위 공시대상기업집단 지정 자료를 기준으로 보고, 상장 계열사 수는 같은 기준일의 소속회사 여부와 KRX 상장 여부를 교차 확인하는 것이 안전합니다. 이 허브에서는 확인 범위를 별도로 표시합니다." },
  { question: "허브와 상세 페이지의 역할은 어떻게 다른가요?", answer: "허브는 공식 기준일과 구조 유형을 보수적으로 비교하는 페이지이고, 상세 페이지는 그룹별 지분율·역사·재편 이슈·투자 해석을 더 깊게 다룹니다." },
];
