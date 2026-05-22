export type TaxStage = "acquisition" | "holding" | "rental" | "transfer" | "gift";
export type PolicyStatus = "confirmed" | "temporary" | "proposed" | "checkRequired" | "example";
export type RegionStatus = "regulated" | "nonRegulated" | "checkRequired";
export type RiskTone = "neutral" | "caution" | "danger";

export interface MultiHouseTaxStageSummary {
  stage: TaxStage;
  label: string;
  headline: string;
  mainTaxes: string[];
  keyVariables: string[];
  multiHouseIssue: string;
  checkPoint: string;
  relatedCta?: {
    label: string;
    href: string;
  };
}

export interface PolicyWatchItem {
  id: string;
  title: string;
  status: PolicyStatus;
  effectiveDateLabel: string;
  summary: string;
  impact: string;
  sourceLabel: string;
  sourceUrl?: string;
}

export interface AcquisitionTaxRow {
  homeCount: string;
  region: string;
  acquisitionType: string;
  rateGuide: string;
  status: PolicyStatus;
  note: string;
}

export interface RentalTaxComparisonRow {
  label: string;
  separateTax: string;
  globalTax: string;
  note: string;
}

export interface MultiHouseTaxCaseHouse {
  id: string;
  locationLabel: string;
  isRegulatedArea: boolean;
  officialPrice: number;
  acquisitionPrice: number;
  marketPrice: number;
  holdingYears: number;
  rentalIncomeAnnual: number;
  isRegisteredRental: boolean;
  note: string;
}

export interface MultiHouseTaxCase {
  id: string;
  label: string;
  description: string;
  houses: MultiHouseTaxCaseHouse[];
  highlights: string[];
  scenarioNotes: string[];
  warnings: string[];
  holdingTaxHref: string;
}

export interface ComparisonRow {
  label: string;
  leftTitle: string;
  leftValue: string;
  rightTitle: string;
  rightValue: string;
  note: string;
}

export interface RegulatedAreaRow {
  region: string;
  status: RegionStatus;
  effectiveDateLabel: string;
  acquisitionTaxImpact: string;
  transferTaxImpact: string;
  note: string;
}

export interface StrategyItem {
  title: string;
  description: string;
  tone: RiskTone;
}

export interface SourceLink {
  label: string;
  organization: string;
  url: string;
  status: PolicyStatus;
  note: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export const MHT_META = {
  slug: "multi-house-tax-2026",
  title: "2026 다주택자 세금 완전 분석",
  description:
    "2026년 다주택자 세금을 취득세, 종합부동산세, 양도소득세, 임대소득세로 나눠 분석합니다.",
  updatedAt: "2026-05-22",
};

export const POLICY_STATUS_LABELS: Record<PolicyStatus, string> = {
  confirmed: "확정",
  temporary: "한시",
  proposed: "개정 가능",
  checkRequired: "확인 필요",
  example: "예시",
};

export const REGION_STATUS_LABELS: Record<RegionStatus, string> = {
  regulated: "규제지역",
  nonRegulated: "비규제지역",
  checkRequired: "확인 필요",
};

export const MHT_SUMMARY_CARDS = [
  {
    label: "핵심 변수",
    value: "주택 수·지역·양도일",
    description: "다주택자 세금은 같은 주택 수라도 조정대상지역, 보유기간, 취득 원인에 따라 달라집니다.",
    status: "checkRequired" as PolicyStatus,
  },
  {
    label: "양도세 중과 유예",
    value: "2026.5.9 종료",
    description: "국세청 뉴스레터 기준 다주택자 양도세 중과 유예는 2026년 5월 9일 종료로 안내됐습니다.",
    status: "temporary" as PolicyStatus,
  },
  {
    label: "종부세 기본공제",
    value: "일반 9억·1주택 12억",
    description: "주택분 종부세는 인별 공시가격 합계에서 공제금액을 차감해 판단합니다.",
    status: "confirmed" as PolicyStatus,
  },
  {
    label: "임대소득 기준",
    value: "연 2천만원 이하 선택",
    description: "주택임대 수입금액이 2천만원 이하이면 분리과세와 종합과세 중 선택할 수 있습니다.",
    status: "confirmed" as PolicyStatus,
  },
];

export const MHT_STAGES: MultiHouseTaxStageSummary[] = [
  {
    stage: "acquisition",
    label: "취득",
    headline: "취득세 중과",
    mainTaxes: ["취득세", "지방교육세", "농어촌특별세"],
    keyVariables: ["주택 수", "조정대상지역 여부", "매매·증여·상속"],
    multiHouseIssue: "주택 수와 지역에 따라 취득세 중과 여부가 달라질 수 있습니다.",
    checkPoint: "일시적 2주택 예외, 증여 취득세, 법인 취득 여부를 별도로 확인합니다.",
    relatedCta: { label: "취득세 계산기 보기", href: "/tools/real-estate-acquisition-tax/" },
  },
  {
    stage: "holding",
    label: "보유",
    headline: "재산세·종부세",
    mainTaxes: ["재산세", "종합부동산세", "농어촌특별세"],
    keyVariables: ["공시가격", "인별 합산", "합산배제"],
    multiHouseIssue: "인별 공시가격 합계와 임대주택 합산배제 요건이 핵심입니다.",
    checkPoint: "과세기준일인 6월 1일 보유 현황과 9월 합산배제 신고 기간을 확인합니다.",
    relatedCta: { label: "보유세 계산하기", href: "/tools/apartment-holding-tax/" },
  },
  {
    stage: "rental",
    label: "임대",
    headline: "임대소득세",
    mainTaxes: ["주택임대소득세", "지방소득세", "건강보험료 영향"],
    keyVariables: ["연 임대수입", "등록 여부", "다른 종합소득"],
    multiHouseIssue: "연 2천만원 이하라도 분리과세가 항상 유리하다고 단정할 수 없습니다.",
    checkPoint: "필요경비, 기본공제, 다른 종합소득, 건강보험료 변화를 함께 봅니다.",
  },
  {
    stage: "transfer",
    label: "양도",
    headline: "양도세 중과",
    mainTaxes: ["양도소득세", "지방소득세"],
    keyVariables: ["양도일", "보유기간", "조정대상지역", "매도 순서"],
    multiHouseIssue: "2026년 5월 9일 이후 중과 적용 여부와 장기보유특별공제 제한이 쟁점입니다.",
    checkPoint: "계약일이 아니라 양도일 기준 판단 항목이 많으므로 신고 전 확인이 필요합니다.",
  },
  {
    stage: "gift",
    label: "이전",
    headline: "증여·부담부증여",
    mainTaxes: ["증여세", "증여 취득세", "양도소득세"],
    keyVariables: ["시가", "채무 승계", "수증자 자금출처"],
    multiHouseIssue: "양도세만 피하려는 증여는 취득세와 향후 양도세에서 불리할 수 있습니다.",
    checkPoint: "부담부증여, 가족 간 자금출처, 향후 취득가액까지 같이 검토합니다.",
  },
];

export const MHT_POLICY_WATCH: PolicyWatchItem[] = [
  {
    id: "transfer-tax-surcharge-end",
    title: "다주택자 양도세 중과 유예 종료",
    status: "temporary",
    effectiveDateLabel: "2026년 5월 9일 종료 안내",
    summary: "국세청 뉴스레터는 다주택자 양도소득세 중과 유예가 2026년 5월 9일 종료된다고 안내했습니다.",
    impact: "조정대상지역 내 주택 양도 시 2주택 +20%p, 3주택 이상 +30%p 중과 여부와 장기보유특별공제 제한을 확인해야 합니다.",
    sourceLabel: "국세청 뉴스레터",
    sourceUrl: "https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2209&nttSn=1350545",
  },
  {
    id: "comprehensive-real-estate-tax-deduction",
    title: "주택분 종부세 공제금액",
    status: "confirmed",
    effectiveDateLabel: "매년 6월 1일 과세기준일",
    summary: "국세청은 주택분 종부세 공제금액을 일반 9억원, 1세대 1주택자 12억원으로 안내합니다.",
    impact: "다주택자는 인별 주택 공시가격 합계와 합산배제 가능성을 먼저 점검해야 합니다.",
    sourceLabel: "국세청 종합부동산세 개요",
    sourceUrl: "https://j.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7733&mi=2351",
  },
  {
    id: "rental-income-choice",
    title: "주택임대소득 2천만원 이하 선택과세",
    status: "confirmed",
    effectiveDateLabel: "종합소득세 신고 시 판단",
    summary: "주택임대 수입금액이 2천만원 이하이면 종합과세와 분리과세 중 선택할 수 있습니다.",
    impact: "근로소득, 사업소득, 필요경비, 등록임대 여부에 따라 유불리가 달라질 수 있습니다.",
    sourceLabel: "국세청 주택임대소득 신고안내",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7686&mi=2250",
  },
  {
    id: "private-rental-rules",
    title: "장기·단기 민간임대 요건 변화",
    status: "proposed",
    effectiveDateLabel: "등록일·주택 유형별 적용",
    summary: "국세청 양도소득세 안내는 장기민간임대주택 공시가격 기준 상향과 단기민간임대주택 추가 내용을 안내합니다.",
    impact: "아파트 여부, 건설형·매입형, 등록일, 임대기간, 임대료 증가율을 분리해서 확인해야 합니다.",
    sourceLabel: "국세청 양도소득세 개요",
    sourceUrl: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7707&mi=2308",
  },
];

export const MHT_ACQUISITION_ROWS: AcquisitionTaxRow[] = [
  {
    homeCount: "1주택",
    region: "전국",
    acquisitionType: "매매",
    rateGuide: "기본세율 구간 확인",
    status: "confirmed",
    note: "주택 가격, 면적, 취득 원인에 따라 부가세목이 달라질 수 있습니다.",
  },
  {
    homeCount: "일시적 2주택",
    region: "전국",
    acquisitionType: "매매",
    rateGuide: "특례 요건 확인",
    status: "checkRequired",
    note: "종전주택 처분기한과 세대 기준을 충족해야 예외가 적용될 수 있습니다.",
  },
  {
    homeCount: "2주택",
    region: "조정대상지역",
    acquisitionType: "매매",
    rateGuide: "중과 가능성 확인",
    status: "checkRequired",
    note: "취득 당시 조정대상지역 여부와 보유 주택 수 산정이 핵심입니다.",
  },
  {
    homeCount: "3주택 이상",
    region: "일반·조정",
    acquisitionType: "매매·증여",
    rateGuide: "중과 가능성 큼",
    status: "checkRequired",
    note: "법인 취득, 증여 취득, 주택 수 제외 특례를 별도로 검토해야 합니다.",
  },
];

export const MHT_RENTAL_COMPARISON: RentalTaxComparisonRow[] = [
  {
    label: "적용 기준",
    separateTax: "주택임대 수입금액 2천만원 이하 선택 가능",
    globalTax: "다른 종합소득과 합산 신고",
    note: "2천만원 초과 시에는 종합과세 대상입니다.",
  },
  {
    label: "세율 구조",
    separateTax: "분리과세 세율 14%",
    globalTax: "종합소득세율 6~45%",
    note: "단순 세율만으로 유불리를 판단하면 안 됩니다.",
  },
  {
    label: "비용·공제",
    separateTax: "등록임대 여부에 따라 필요경비·공제 차이",
    globalTax: "실제 비용과 소득공제 반영 가능",
    note: "다른 소득 규모가 클수록 비교가 필요합니다.",
  },
  {
    label: "주의점",
    separateTax: "건강보험료와 등록요건 사후관리를 함께 확인",
    globalTax: "누진세율 구간 상승 가능성",
    note: "홈택스 예상세액 비교 서비스를 확인하는 것이 안전합니다.",
  },
];

export const MHT_REGULATED_AREAS: RegulatedAreaRow[] = [
  {
    region: "서울 강남구·서초구·송파구·용산구",
    status: "regulated",
    effectiveDateLabel: "2026년 5월 22일 확인 필요",
    acquisitionTaxImpact: "취득세 중과와 일시적 2주택 예외 판단에 영향",
    transferTaxImpact: "양도세 중과, 장기보유특별공제 제한 여부 확인",
    note: "국토교통부·지자체 고시 기준으로 지정·해제 여부가 바뀔 수 있습니다.",
  },
  {
    region: "그 외 서울·수도권",
    status: "checkRequired",
    effectiveDateLabel: "양도일·취득일 기준 확인",
    acquisitionTaxImpact: "지정일 전후 취득 여부 확인",
    transferTaxImpact: "양도일 현재 조정대상지역 여부 확인",
    note: "동 단위 지정이나 해제 가능성을 최신 공고로 확인하세요.",
  },
  {
    region: "지방 광역시·중소도시",
    status: "checkRequired",
    effectiveDateLabel: "최신 고시 확인",
    acquisitionTaxImpact: "일반지역이어도 3주택 이상 중과 가능성 확인",
    transferTaxImpact: "지방 저가주택 주택 수 제외 요건 확인",
    note: "저가주택, 미분양, 임대주택 특례는 별도 요건을 봐야 합니다.",
  },
];

export const MHT_CASES: MultiHouseTaxCase[] = [
  {
    id: "seoul-two-homes",
    label: "서울 2주택자",
    description: "거주 1주택과 임대 1주택을 보유한 서울 2주택자 예시입니다.",
    holdingTaxHref: "/tools/apartment-holding-tax/?officialPrice=2000000000&homeCount=two",
    houses: [
      {
        id: "home-a",
        locationLabel: "서울 거주 주택",
        isRegulatedArea: true,
        officialPrice: 1_200_000_000,
        acquisitionPrice: 900_000_000,
        marketPrice: 1_700_000_000,
        holdingYears: 8,
        rentalIncomeAnnual: 0,
        isRegisteredRental: false,
        note: "거주 주택",
      },
      {
        id: "home-b",
        locationLabel: "서울 임대 주택",
        isRegulatedArea: true,
        officialPrice: 800_000_000,
        acquisitionPrice: 650_000_000,
        marketPrice: 1_100_000_000,
        holdingYears: 5,
        rentalIncomeAnnual: 18_000_000,
        isRegisteredRental: false,
        note: "월세 수입 발생",
      },
    ],
    highlights: ["공시가격 합산", "임대소득 과세", "매도 순서", "조정대상지역"],
    scenarioNotes: [
      "보유세는 인별 공시가격 합계와 합산배제 여부가 먼저 쟁점입니다.",
      "임대소득 1,800만원은 분리과세 선택 가능 구간이지만 다른 소득과 비교해야 합니다.",
      "양도세는 양도일, 보유기간, 거주요건, 필요경비에 따라 결과가 달라집니다.",
    ],
    warnings: ["예시이며 실제 세액을 보장하지 않습니다.", "일시적 2주택인지 여부는 취득·처분 순서로 별도 판단합니다."],
  },
  {
    id: "capital-local-three-homes",
    label: "수도권+지방 3주택자",
    description: "수도권 1채와 지방 2채를 보유한 3주택자 예시입니다.",
    holdingTaxHref: "/tools/apartment-holding-tax/?officialPrice=1330000000&homeCount=three",
    houses: [
      {
        id: "home-a",
        locationLabel: "수도권 주택",
        isRegulatedArea: false,
        officialPrice: 900_000_000,
        acquisitionPrice: 700_000_000,
        marketPrice: 1_200_000_000,
        holdingYears: 6,
        rentalIncomeAnnual: 0,
        isRegisteredRental: false,
        note: "실거주 또는 공실",
      },
      {
        id: "home-b",
        locationLabel: "지방 임대 주택 1",
        isRegulatedArea: false,
        officialPrice: 250_000_000,
        acquisitionPrice: 210_000_000,
        marketPrice: 300_000_000,
        holdingYears: 8,
        rentalIncomeAnnual: 13_000_000,
        isRegisteredRental: true,
        note: "등록임대 검토",
      },
      {
        id: "home-c",
        locationLabel: "지방 임대 주택 2",
        isRegulatedArea: false,
        officialPrice: 180_000_000,
        acquisitionPrice: 160_000_000,
        marketPrice: 230_000_000,
        holdingYears: 8,
        rentalIncomeAnnual: 11_000_000,
        isRegisteredRental: true,
        note: "저가주택 특례 검토",
      },
    ],
    highlights: ["3주택 산정", "지방 저가주택", "임대등록 사후요건", "임대수입 2천만원 초과"],
    scenarioNotes: [
      "연 임대수입 합계 2,400만원이면 주택임대소득 2천만원 이하 선택과세 구간을 넘을 수 있습니다.",
      "지방 저가주택 주택 수 제외는 소재지, 기준시가, 취득시기 등 세부 요건을 확인해야 합니다.",
      "보유보다 매도·증여가 나은지는 양도차익과 수증자 상황까지 비교해야 합니다.",
    ],
    warnings: ["등록임대 요건 위반 시 감면세액 추징 가능성이 있습니다.", "지방 주택이라고 자동으로 주택 수에서 제외되지는 않습니다."],
  },
];

export const MHT_GIFT_SALE_COMPARISON: ComparisonRow[] = [
  {
    label: "주요 세금",
    leftTitle: "매도",
    leftValue: "양도소득세·지방소득세",
    rightTitle: "증여",
    rightValue: "증여세·증여 취득세",
    note: "부담부증여는 채무 승계분에 양도세가 함께 생길 수 있습니다.",
  },
  {
    label: "기준 가격",
    leftTitle: "매도",
    leftValue: "양도가액과 취득가액",
    rightTitle: "증여",
    rightValue: "시가 기준",
    note: "시가 산정과 유사매매사례가 쟁점이 될 수 있습니다.",
  },
  {
    label: "추가 쟁점",
    leftTitle: "매도",
    leftValue: "필요경비·보유기간",
    rightTitle: "증여",
    rightValue: "자금출처·향후 취득가액",
    note: "자녀에게 이전할 때는 향후 양도 시 세금까지 같이 봐야 합니다.",
  },
];

export const MHT_CORPORATE_COMPARISON: ComparisonRow[] = [
  {
    label: "소득 관리",
    leftTitle: "개인 보유",
    leftValue: "임대소득이 개인 종합소득에 반영",
    rightTitle: "법인 보유",
    rightValue: "법인세와 배당 과세 구조로 분리",
    note: "소득 분산만 보고 판단하면 배당·청산 비용을 놓칠 수 있습니다.",
  },
  {
    label: "취득·보유",
    leftTitle: "개인 보유",
    leftValue: "주택 수와 지역에 따른 개인 세제 적용",
    rightTitle: "법인 보유",
    rightValue: "법인 취득세, 법인 종부세, 대출 제한 검토",
    note: "단순 절세 목적 법인 전환은 사후 비용이 커질 수 있습니다.",
  },
  {
    label: "출구 전략",
    leftTitle: "개인 보유",
    leftValue: "매도·증여·상속 선택",
    rightTitle: "법인 보유",
    rightValue: "법인 매각, 배당, 청산까지 고려",
    note: "법인은 만들 때보다 정리할 때 비용이 더 중요할 수 있습니다.",
  },
];

export const MHT_STRATEGIES: StrategyItem[] = [
  { title: "양도 순서를 먼저 정하기", description: "양도세는 어떤 주택을 먼저 파는지에 따라 비과세, 중과, 장기보유특별공제 적용이 달라질 수 있습니다.", tone: "caution" },
  { title: "조정대상지역 지정일 확인", description: "취득일과 양도일 기준 지역 상태가 다르면 판단이 달라질 수 있으므로 최신 고시를 먼저 확인합니다.", tone: "danger" },
  { title: "합산배제는 사전 검토", description: "종부세 합산배제는 등록, 임대기간, 임대료 증가율, 신고기간을 모두 충족해야 합니다.", tone: "caution" },
  { title: "임대소득은 다른 소득과 함께 비교", description: "2천만원 이하라고 무조건 분리과세가 유리하지 않습니다. 근로·사업소득과 필요경비를 같이 봅니다.", tone: "neutral" },
  { title: "증여·법인은 출구 비용까지 계산", description: "증여 취득세, 자금출처, 법인 배당·청산 비용까지 포함해야 비교가 가능합니다.", tone: "caution" },
];

export const MHT_SOURCE_LINKS: SourceLink[] = [
  {
    label: "다주택자 양도세 중과 유예 종료",
    organization: "국세청",
    url: "https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2209&nttSn=1350545",
    status: "temporary",
    note: "2026년 4월 27일 국세청 뉴스레터 기준",
  },
  {
    label: "종합부동산세 개요",
    organization: "국세청",
    url: "https://j.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7733&mi=2351",
    status: "confirmed",
    note: "과세기준일, 공제금액, 합산배제 신고기간 확인",
  },
  {
    label: "종부세 세액계산 흐름도",
    organization: "국세청",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7735&mi=2353",
    status: "confirmed",
    note: "공정시장가액비율과 세액계산 구조 확인",
  },
  {
    label: "주택임대소득 신고안내",
    organization: "국세청",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7686&mi=2250",
    status: "confirmed",
    note: "2천만원 이하 종합과세·분리과세 선택 구조 확인",
  },
  {
    label: "양도소득세 개요",
    organization: "국세청",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7707&mi=2308",
    status: "checkRequired",
    note: "양도세 중과 제외 대상과 민간임대 요건 확인",
  },
];

export const MHT_FAQ: FaqItem[] = [
  {
    question: "2026년에 다주택자 양도세 중과는 적용되나요?",
    answer:
      "다주택자가 조정대상지역 내 주택을 양도하는 경우 중과 규정이 쟁점입니다. 국세청은 중과 유예가 2026년 5월 9일 종료된다고 안내했으므로 양도일, 보유기간, 주택 수 산정, 지역 상태를 최신 기준으로 확인해야 합니다.",
  },
  {
    question: "2주택자도 종부세가 나오나요?",
    answer:
      "가능합니다. 종부세는 인별 주택 공시가격 합계에서 공제금액을 차감해 계산합니다. 2주택 여부만으로 판단하지 말고 공시가격 합계, 합산배제, 공동명의, 1세대 1주택 특례 여부를 함께 봐야 합니다.",
  },
  {
    question: "임대소득이 2천만원 이하이면 무조건 분리과세가 유리한가요?",
    answer:
      "아닙니다. 국세청은 2천만원 이하 주택임대소득에 대해 종합과세와 분리과세 중 선택할 수 있다고 안내합니다. 다른 종합소득, 필요경비, 등록임대 여부, 건강보험료에 따라 유불리가 달라질 수 있습니다.",
  },
  {
    question: "임대사업자 등록을 하면 다주택자 세금이 줄어드나요?",
    answer:
      "일부 세목에서 합산배제나 감면 가능성이 있을 수 있지만 등록 시기, 주택 유형, 공시가격, 임대기간, 임대료 증가율, 신고기한 등 요건을 충족해야 합니다. 사후요건 위반 시 추징 가능성도 있습니다.",
  },
  {
    question: "자녀에게 증여하는 것이 매도보다 유리한가요?",
    answer:
      "조건에 따라 다릅니다. 증여세, 증여 취득세, 부담부증여, 향후 양도 시 취득가액, 자금출처 소명까지 같이 계산해야 하므로 양도세만 보고 판단하면 위험합니다.",
  },
];

export const MHT_RELATED_LINKS: RelatedLink[] = [
  { label: "아파트 보유세 계산기", href: "/tools/apartment-holding-tax/", description: "공시가격 기준 재산세와 종부세를 추정합니다." },
  { label: "부동산 취득세 계산기", href: "/tools/real-estate-acquisition-tax/", description: "매매·증여·상속 취득세와 부가 세목을 계산합니다." },
  { label: "주택 매수 자금 계산기", href: "/tools/home-purchase-fund/", description: "취득 전 필요한 현금과 대출 구조를 점검합니다." },
  { label: "전세 vs 월세 계산기", href: "/tools/jeonse-vs-wolse-calculator/", description: "임대 수익과 거주비 비교에 필요한 전월세 전환을 확인합니다." },
  { label: "대출 갈아타기 계산기", href: "/tools/loan-refinancing-calculator/", description: "금리 변경 시 월 납입금과 총 이자 변화를 비교합니다." },
];

export const formatKrw = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export const formatEok = (value: number) => {
  if (value >= 100_000_000) {
    const eok = value / 100_000_000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }

  return formatKrw(value);
};
