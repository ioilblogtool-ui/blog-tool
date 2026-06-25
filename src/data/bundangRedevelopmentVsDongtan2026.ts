// 분당 재건축 vs 동탄 신축 비교 리포트 2026 데이터
// 설계 문서: docs/design/202606/bundang-redevelopment-vs-dongtan-newbuild-2026-design.md
//
// ⚠️ 재건축 사업 단계와 분담금은 확정값이 아니다. 가격은 국토교통부 실거래가
// 공개시스템 기준 특정 시점 예시이며 권역 전체 평균이 아니다. 이 리포트는
// 분당과 동탄 중 우열을 가리는 자료가 아니다.

export type ComparisonPriority = "live" | "invest" | "school" | "transit";
export type DataConfidence = "공식 발표" | "보도 기준" | "추정" | "확정 전";

export interface ComparisonFrameRow {
  id: string;
  labelKo: string;
  bundangValue: string;
  dongtanValue: string;
  confidence: DataConfidence;
  note?: string;
  relatedPriority?: ComparisonPriority[];
}

export interface PriorityTabConfig {
  id: ComparisonPriority;
  label: string;
  bundangSummary: string;
  dongtanSummary: string;
  interpretation: string;
}

export interface BundangStageItem {
  zoneName: string;
  complexes: string[];
  stage: string;
  stageDate: string;
  nextStep: string;
  confidence: DataConfidence;
}

export interface DongtanSupplyItem {
  complexName: string;
  area: string;
  units: number;
  moveInLabel: string;
  confidence: DataConfidence;
}

export interface RealExample {
  region: "bundang" | "dongtan";
  complex: string;
  location: string;
  sizeLabel: string;
  priceEokMin: number;
  priceEokMax: number;
  tradeLabel: string;
  sourceLabel: string;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export const BRD_META = {
  slug: "bundang-redevelopment-vs-dongtan-newbuild-2026",
  title: "분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까",
  seoTitle: "분당 재건축 vs 동탄 신축 비교 2026 - 15억이면 어디가 나을까",
  seoDescription:
    "분당 재건축 시범단지와 동탄 신축 아파트를 학군, 교통, 투자 포인트, 리스크 기준으로 비교합니다. 내 상황에 맞는 선택 기준을 확인하세요.",
  dataAsOf: "2026-06",
  updatedAt: "2026-06-23",
  dataNote:
    "분당 재건축 사업 단계와 분담금은 확정값이 아니라 진행 상황 기준 정리이며, 가격은 국토교통부 실거래가 공개시스템 기준 특정 시점 예시입니다. 이 리포트는 두 지역 중 우열을 가리는 자료가 아닙니다.",
};

export const BRD_COMPARISON_FRAME: ComparisonFrameRow[] = [
  {
    id: "satisfaction",
    labelKo: "현재 주거 만족도",
    bundangValue: "단지 노후도에 따라 편차 있음 (배관·주차 불편 vs 넓은 녹지·생활 인프라)",
    dongtanValue: "높음 (신축 커뮤니티·주차·단열)",
    confidence: "추정",
    relatedPriority: ["live"],
  },
  {
    id: "stage",
    labelKo: "재건축/개발 진행 단계",
    bundangValue: "선도지구 지정(2024.11) → 특별정비구역 지정(2026.1, 샛별마을·시범우성·목련마을) → 사업시행자 선정 진행 중",
    dongtanValue: "입주 진행 중 (2026년 화성시 금강펜테리움6·7차 1,765세대 입주)",
    confidence: "보도 기준",
    note: "분당은 착공·완공이 아니라 정비구역 지정 단계. 시범단지 이주 목표는 2029년.",
    relatedPriority: ["live", "invest"],
  },
  {
    id: "school",
    labelKo: "학군",
    bundangValue: "전통적으로 강한 권역으로 형성",
    dongtanValue: "신도시 학군 조성 중, 단지·블록별 편차 큼",
    confidence: "확정 전",
    note: "정량 지표(진학률 등) 미확인. 우열 단정 표현 사용하지 않음.",
    relatedPriority: ["school"],
  },
  {
    id: "transit",
    labelKo: "강남 접근성",
    bundangValue: "신분당선으로 환승 없이 강남역 도달",
    dongtanValue: "GTX-A 개통으로 수서까지 약 20분대 단축",
    confidence: "공식 발표",
    note: "GTX-A는 일반 지하철과 배차간격·요금 구조가 다름.",
    relatedPriority: ["transit"],
  },
  {
    id: "volatility",
    labelKo: "가격 변동성",
    bundangValue: "선도지구 지정 이후 단지별 격차 확대 (서현시범우성 16.1억 vs 양지마을1단지금호 23.75억, 84㎡ 기준)",
    dongtanValue: "GTX-A 개통 전후 단기 급등 (예: 메타폴리스 84㎡ 분양가 4억대 → 9억대)",
    confidence: "보도 기준",
    note: "분당은 같은 선도지구 안에서도 단지(우성·현대·금호 등)에 따라 84㎡ 기준 7억 이상 차이가 확인된다.",
    relatedPriority: ["invest"],
  },
  {
    id: "investPoint",
    labelKo: "투자 포인트",
    bundangValue: "토지 가치 + 재건축 사업성 (용적률 상향, 통합 재건축 인센티브)",
    dongtanValue: "직주근접 신축 희소성 + GTX 노선 추가 호재",
    confidence: "추정",
    relatedPriority: ["invest"],
  },
  {
    id: "risk",
    labelKo: "핵심 리스크",
    bundangValue: "재건축 속도 지연, 분담금 미확정, 이주·재정착 기간 거주 불편",
    dongtanValue: "단기 급등 후 조정 가능성, GTX 운임·배차 변수, 상권 성숙도 시간 소요",
    confidence: "추정",
    relatedPriority: ["live", "invest", "transit"],
  },
];

export const BRD_PRIORITY_TABS: PriorityTabConfig[] = [
  {
    id: "live",
    label: "실거주 우선",
    bundangSummary: "생활 인프라는 완성되어 있지만 이주·재정착까지 거주 불편이 발생할 수 있습니다.",
    dongtanSummary: "신축 편의성은 높지만 상권·생활 인프라가 아직 성숙하는 중인 구역도 있습니다.",
    interpretation: "지금 당장 안정적인 거주를 원한다면 분당의 기존 인프라가, 새 시설 위주의 생활을 원한다면 동탄 신축이 부합합니다.",
  },
  {
    id: "invest",
    label: "투자 우선",
    bundangSummary: "재건축 사업성에 기댄 장기 투자 성격이 강하고, 분담금 규모가 수익을 좌우합니다.",
    dongtanSummary: "이미 GTX-A 개통 호재가 가격에 상당 부분 반영된 상태로, 추가 상승 여력은 신중히 봐야 합니다.",
    interpretation: "분당은 사업 진행 속도와 분담금이, 동탄은 추가 호재(노선 연장 등) 여부가 핵심 변수입니다.",
  },
  {
    id: "school",
    label: "학군 우선",
    bundangSummary: "전통적으로 학원가·학군이 잘 형성되어 있다는 평가가 많습니다.",
    dongtanSummary: "신도시 특성상 학군이 만들어지는 중이며 블록별 차이가 있습니다.",
    interpretation: "이미 형성된 학군을 원하면 분당, 신도시 성장과 함께할 수 있다면 동탄도 고려할 수 있습니다.",
  },
  {
    id: "transit",
    label: "교통 우선",
    bundangSummary: "신분당선으로 환승 없이 강남 출퇴근이 가능합니다.",
    dongtanSummary: "GTX-A로 서울 접근성이 크게 개선됐지만 배차간격과 요금 구조를 함께 봐야 합니다.",
    interpretation: "매일 강남 출퇴근이라면 신분당선의 환승 없는 안정성과 GTX-A의 속도를 직접 비교해보는 것이 좋습니다.",
  },
];

export const BRD_BUNDANG_STAGES: BundangStageItem[] = [
  {
    zoneName: "시범단지",
    complexes: ["우성", "현대", "장안타운 건영3차"],
    stage: "특별정비구역 지정(시범우성) · 현대-우성 예비사업자 지정",
    stageDate: "2026-01-19(특별정비구역) / 2026-05-30(예비사업자)",
    nextStep: "사업시행자 정식 선정 → 이주(목표 2029년)",
    confidence: "보도 기준",
  },
  {
    zoneName: "양지마을",
    complexes: ["1단지 금호", "2단지 청구", "3·5단지 금호한양", "5단지 한양", "6단지 금호청구·한양"],
    stage: "사업시행자 투표로 대신자산신탁 선정",
    stageDate: "2026-06",
    nextStep: "소유주 설명회·동의서 징구 → 정식 사업시행자 지정(이르면 7월)",
    confidence: "보도 기준",
  },
  {
    zoneName: "샛별마을",
    complexes: ["동성", "라이프", "우방", "삼부", "현대"],
    stage: "특별정비구역 지정",
    stageDate: "2026-01-19",
    nextStep: "사업시행자 선정 절차 진행",
    confidence: "보도 기준",
  },
  {
    zoneName: "목련마을",
    complexes: ["빌라단지"],
    stage: "특별정비구역 지정",
    stageDate: "2026-01-19",
    nextStep: "사업시행자 선정 절차 진행",
    confidence: "보도 기준",
  },
];

export const BRD_DONGTAN_SUPPLY: DongtanSupplyItem[] = [
  {
    complexName: "동탄신도시 금강펜테리움6차센트럴파크",
    area: "화성시 신동",
    units: 1103,
    moveInLabel: "2026년 2월 입주 예정",
    confidence: "보도 기준",
  },
  {
    complexName: "동탄신도시 금강펜테리움7차센트럴파크",
    area: "화성시 신동",
    units: 662,
    moveInLabel: "2026년 7월 입주 예정",
    confidence: "보도 기준",
  },
  {
    complexName: "힐스테이트 동탄역 센트릭",
    area: "화성시 오산동 동탄2신도시",
    units: 0,
    moveInLabel: "2026년 입주 예정 (분양 당시 안내 기준, 세대수 재확인 필요)",
    confidence: "보도 기준",
  },
];

export const BRD_REAL_EXAMPLES: RealExample[] = [
  {
    region: "bundang",
    complex: "서현시범우성",
    location: "성남시 분당구 서현동 (시범단지)",
    sizeLabel: "전용 84㎡",
    priceEokMin: 16.1,
    priceEokMax: 16.1,
    tradeLabel: "2025년 3월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "서현시범현대",
    location: "성남시 분당구 서현동 (시범단지)",
    sizeLabel: "전용 84㎡",
    priceEokMin: 19.9,
    priceEokMax: 19.9,
    tradeLabel: "2025년 10월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "양지마을1단지금호",
    location: "성남시 분당구 수내동 (양지마을)",
    sizeLabel: "전용 84.9㎡",
    priceEokMin: 23.75,
    priceEokMax: 23.75,
    tradeLabel: "2026년 3월 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준 보도",
  },
  {
    region: "bundang",
    complex: "샛별마을(라이프)",
    location: "성남시 분당구 분당동 (샛별마을)",
    sizeLabel: "전용 85㎡",
    priceEokMin: 16.0,
    priceEokMax: 16.0,
    tradeLabel: "2025년 실거래",
    sourceLabel: "국토교통부 실거래가 공개시스템 기준",
  },
  {
    region: "dongtan",
    complex: "힐스테이트 동탄역 센트릭",
    location: "화성시 오산동 동탄2신도시",
    sizeLabel: "전용 84㎡ (분양가 기준)",
    priceEokMin: 9.65,
    priceEokMax: 10.05,
    tradeLabel: "2022년 9월 분양가 (2026년 입주 예정 — 분양가이며 실거래가 아님)",
    sourceLabel: "분양 공고 기준, 입주 시점 실거래가는 별도 확인 필요",
  },
  {
    region: "dongtan",
    complex: "동탄2신도시 메타폴리스",
    location: "화성시 동탄2신도시",
    sizeLabel: "전용 84㎡",
    priceEokMin: 9,
    priceEokMax: 9,
    tradeLabel: "2024~2025년 실거래 (2017년 분양가 4억대 → 약 2배 이상 상승)",
    sourceLabel: "보도 기준, GTX-A 개통 전후 비교 사례",
  },
];

export const BRD_FAQ: ComparisonFaq[] = [
  {
    question: "분당 재건축은 지금 사도 안전한가요?",
    answer:
      "선도지구·특별정비구역 지정은 사업이 본격적으로 시작됐다는 의미지만, 사업시행자 선정, 이주, 착공까지는 다단계 절차가 남아있습니다. '안전하다'고 단정하기보다, 진행 단계와 분담금 미확정 리스크를 함께 보고 판단해야 합니다.",
  },
  {
    question: "동탄은 너무 늦게 들어가는 거 아닌가요?",
    answer:
      "GTX-A 개통 전 매수자 대비 가격 차이는 분명히 존재합니다. 다만 2026년에도 금강펜테리움6·7차 등 신규 입주 물량이 남아있어, 어떤 단지·시점에 들어가는지에 따라 상황이 다릅니다.",
  },
  {
    question: "분당과 동탄 중 학군은 어디가 좋나요?",
    answer:
      "정량적으로 비교하기 어려운 영역입니다. 분당은 전통적으로 학군이 잘 형성된 권역으로 평가받고, 동탄은 신도시 특성상 학군이 만들어지는 중이며 블록별 차이가 있습니다.",
  },
  {
    question: "신분당선과 GTX-A 중 어느 교통이 더 나은가요?",
    answer:
      "신분당선은 환승 없이 강남역까지 도달할 수 있는 안정적인 노선입니다. GTX-A는 더 빠르지만 배차간격과 요금 구조가 일반 지하철과 다르다는 점을 함께 고려해야 합니다.",
  },
  {
    question: "15억으로 분당, 동탄 각각 어떤 단지를 살 수 있나요?",
    answer:
      "본문의 예산 슬라이더에서 확인할 수 있습니다. 다만 제시되는 단지는 국토교통부 실거래가 공개시스템 기준 일부 예시이며, 권역 내 모든 단지를 대표하지는 않습니다. 분당은 같은 선도지구 안에서도 단지별로 84㎡ 기준 16억대부터 23억대까지 격차가 큽니다.",
  },
  {
    question: "재건축 분담금은 얼마나 나올까요?",
    answer:
      "사업시행 인가 전까지는 분담금이 확정되지 않습니다. 유사한 1기 신도시 재건축 사례를 참고할 수는 있지만, 정확한 금액은 해당 단지 조합·사업시행자의 공식 발표를 통해 확인해야 합니다.",
  },
  {
    question: "투자 목적이면 어디가 나을까요?",
    answer:
      "분당은 토지 가치와 재건축 사업성에 기반한 투자이고, 동탄은 직주근접 신축 희소성과 교통 호재에 기반한 투자입니다. 두 방식의 성격이 달라 우열을 단정하기 어렵습니다.",
  },
];

export const BRD_RELATED_LINKS = [
  { href: "/reports/dongtan-hot-apartment-ranking-2026/", label: "동탄 신고가 아파트 TOP8 추적" },
  { href: "/tools/home-purchase-fund/", label: "내집마련 자금 계산기" },
  { href: "/tools/income-home-affordability/", label: "소득 대비 집값 부담 계산기" },
  { href: "/reports/seoul-housing-affordability-map-2026/", label: "내 연봉으로 서울 어디 살 수 있나" },
  { href: "/reports/seoul-mortgage-refinancing-2026/", label: "대환대출 갈아타기 손익 비교" },
];
