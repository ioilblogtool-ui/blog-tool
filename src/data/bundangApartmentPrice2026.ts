export type DataBadge = "공식 재확인 필요" | "보도 기반" | "추정" | "참고";

export type RedevelopmentStatus =
  | "재건축 기대"
  | "선도지구 관련"
  | "특별정비구역 관련"
  | "일반 구축"
  | "신축·준신축"
  | "확인 필요";

export interface BundangApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface BundangApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: "정자동" | "수내동" | "서현동" | "이매동" | "야탑동" | "분당동" | "기타";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  redevelopmentStatus: RedevelopmentStatus;
  latestTradePriceManwon: number;
  latestTradeDate: string;
  latestTradeArea: string;
  previousYearPriceManwon?: number;
  previousYearPeriod?: string;
  fiveYearLowPriceManwon: number;
  fiveYearLowDate: string;
  fiveYearLowArea: string;
  estimatedGainManwon: number;
  estimatedGainRate: number;
  jeonsePriceManwon?: number;
  jeonseRatio?: number;
  tradeCountNote: string;
  badge: DataBadge;
  note: string;
}

export interface BundangRedevelopmentCard {
  areaGroup: BundangApartmentRow["areaGroup"];
  title: string;
  statusLabel: string;
  description: string;
  caution: string;
  badge: DataBadge;
}

export interface BundangContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface BundangFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const BDAP_META: BundangApartmentMeta = {
  slug: "bundang-apartment-price-2026",
  title: "분당 대장 아파트 Top10 2026",
  seoTitle: "분당 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나",
  description:
    "파크뷰와 정자동·수내동·서현동 대표 단지 등 분당 대장 아파트 Top10의 최근 기준가와 최근 5년 저점 대비 평가차익을 비교합니다. 1기 신도시 재건축 기대와 데이터 기준도 함께 확인하세요.",
  updatedAt: "2026-06-29",
  dataAsOf: "2026년 6월 말 발행 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템 재확인이 필요한 참고용 기준값입니다. 단지, 동, 층, 향, 면적, 거래 시점에 따라 실제 가격은 달라질 수 있습니다.",
};

const withGain = <T extends Omit<BundangApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): BundangApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const BDAP_APARTMENTS: BundangApartmentRow[] = [
  withGain({
    id: "parkview",
    rank: 1,
    complexName: "파크뷰",
    complexNameOfficial: "분당파크뷰",
    areaGroup: "정자동",
    addressLabel: "정자동 판교·정자 생활권",
    supplyYear: 2004,
    householdCount: 1829,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "신축·준신축",
    latestTradePriceManwon: 250000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 225000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 165000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 120000,
    jeonseRatio: 48,
    tradeCountNote: "최근 거래 건수와 면적 일치 여부는 발행 전 국토부 원문 재확인이 필요합니다.",
    badge: "공식 재확인 필요",
    note: "분당 대표 고가 단지로 자주 언급되지만, 파크뷰 한 단지를 분당 전체 가격으로 보면 안 됩니다.",
  }),
  withGain({
    id: "jeongdeun-woosung",
    rank: 2,
    complexName: "정든마을 우성",
    areaGroup: "정자동",
    addressLabel: "정자역·학군 생활권",
    supplyYear: 1994,
    householdCount: 408,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "재건축 기대",
    latestTradePriceManwon: 205000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 185000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 128000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 85000,
    jeonseRatio: 41,
    tradeCountNote: "거래 층과 동에 따른 편차가 클 수 있어 대표 거래로만 해석해야 합니다.",
    badge: "공식 재확인 필요",
    note: "정자동 구축 대표축으로 재건축 기대와 역세권 수요가 함께 언급됩니다.",
  }),
  withGain({
    id: "yangji-kumho",
    rank: 3,
    complexName: "양지마을 금호",
    areaGroup: "수내동",
    addressLabel: "수내역·학군 생활권",
    supplyYear: 1992,
    householdCount: 918,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "재건축 기대",
    latestTradePriceManwon: 198000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 178000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 123000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 80000,
    jeonseRatio: 40,
    tradeCountNote: "수내동 상단 거래는 층·향·역 접근성에 따라 가격 차이가 큽니다.",
    badge: "공식 재확인 필요",
    note: "수내동 대표 고가 구축 후보로, 생활 인프라와 학군 수요를 함께 봐야 합니다.",
  }),
  withGain({
    id: "yangji-hanyang",
    rank: 4,
    complexName: "양지마을 한양",
    areaGroup: "수내동",
    addressLabel: "수내역 인근 생활권",
    supplyYear: 1992,
    householdCount: 768,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "재건축 기대",
    latestTradePriceManwon: 192000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 173000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 121000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 78000,
    jeonseRatio: 41,
    tradeCountNote: "같은 양지마을 안에서도 단지와 동별 가격 차이를 분리해서 봐야 합니다.",
    badge: "공식 재확인 필요",
    note: "수내 생활권 비교축으로, 금호와 함께 보는 편이 가격 해석에 유리합니다.",
  }),
  withGain({
    id: "sibeom-woosung",
    rank: 5,
    complexName: "시범우성",
    areaGroup: "서현동",
    addressLabel: "서현 시범단지",
    supplyYear: 1991,
    householdCount: 1874,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "선도지구 관련",
    latestTradePriceManwon: 190000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 170000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 113000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 72000,
    jeonseRatio: 38,
    tradeCountNote: "시범단지 재건축 이슈는 발행 시점별 보도와 공고를 함께 확인해야 합니다.",
    badge: "보도 기반",
    note: "서현 시범단지 대표 후보로 재건축 기대감이 가격 해석의 핵심 변수입니다.",
  }),
  withGain({
    id: "sibeom-hyundai",
    rank: 6,
    complexName: "시범현대",
    areaGroup: "서현동",
    addressLabel: "서현 시범단지",
    supplyYear: 1991,
    householdCount: 1695,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "선도지구 관련",
    latestTradePriceManwon: 186000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 166000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 111000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 70000,
    jeonseRatio: 38,
    tradeCountNote: "시범단지는 단지별 추진 속도와 거래 면적 차이를 분리해서 봐야 합니다.",
    badge: "보도 기반",
    note: "서현 시범단지 내 구축 대표축입니다. 재건축 기대를 확정 일정으로 읽으면 안 됩니다.",
  }),
  withGain({
    id: "sibeom-hanyang",
    rank: 7,
    complexName: "시범한양",
    areaGroup: "서현동",
    addressLabel: "서현 시범단지",
    supplyYear: 1991,
    householdCount: 2419,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "선도지구 관련",
    latestTradePriceManwon: 181000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 162000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 108000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 69000,
    jeonseRatio: 38,
    tradeCountNote: "대단지 특성상 동·층·향 차이가 대표 거래 해석에 크게 작용할 수 있습니다.",
    badge: "보도 기반",
    note: "시범단지 비교에서 함께 확인해야 하는 후보입니다.",
  }),
  withGain({
    id: "imaechon-cheonggu",
    rank: 8,
    complexName: "이매촌 청구",
    areaGroup: "이매동",
    addressLabel: "이매역·판교 접근 생활권",
    supplyYear: 1992,
    householdCount: 710,
    mainAreaLabel: "전용 84㎡ 중심",
    redevelopmentStatus: "일반 구축",
    latestTradePriceManwon: 167000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 150000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 100000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 66000,
    jeonseRatio: 40,
    tradeCountNote: "이매동은 판교 접근성, 역 접근성, 학군 체감이 가격에 함께 반영됩니다.",
    badge: "공식 재확인 필요",
    note: "정자·수내·서현 상단권과 다른 성격의 실거주형 고가 후보입니다.",
  }),
  withGain({
    id: "areum-geonyeong",
    rank: 9,
    complexName: "아름마을 건영",
    areaGroup: "이매동",
    addressLabel: "이매·야탑 생활권",
    supplyYear: 1992,
    householdCount: 1152,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    redevelopmentStatus: "일반 구축",
    latestTradePriceManwon: 158000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 우선, 거래 없으면 유사 면적",
    previousYearPriceManwon: 142000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 96000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonsePriceManwon: 64000,
    jeonseRatio: 41,
    tradeCountNote: "84㎡ 동일 면적 거래 여부는 재검증이 필요합니다.",
    badge: "참고",
    note: "이매·야탑 생활권 보조 후보로, 면적 차이를 반드시 확인해야 합니다.",
  }),
  withGain({
    id: "mokryeon-hanil",
    rank: 10,
    complexName: "목련마을 한일",
    areaGroup: "분당동",
    addressLabel: "분당동 구축 생활권",
    supplyYear: 1995,
    householdCount: 1178,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    redevelopmentStatus: "특별정비구역 관련",
    latestTradePriceManwon: 151000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 우선, 거래 없으면 유사 면적",
    previousYearPriceManwon: 136000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 93000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonsePriceManwon: 61000,
    jeonseRatio: 40,
    tradeCountNote: "특별정비구역 관련 표현은 발행 시점 기준 공고와 보도 확인이 필요합니다.",
    badge: "보도 기반",
    note: "분당동 구축 가격과 재건축 기대를 함께 설명하기 위한 후보입니다.",
  }),
];

export const BDAP_REDEVELOPMENT_CARDS: BundangRedevelopmentCard[] = [
  {
    areaGroup: "정자동",
    title: "정자동",
    statusLabel: "역세권·상급 생활권 기대",
    description: "파크뷰처럼 준신축 성격이 강한 단지와 구축 재건축 기대 단지가 함께 있어 가격 해석을 분리해야 합니다.",
    caution: "준신축 고가 단지는 재건축 기대보다 입지·상품성이 가격을 더 설명할 수 있습니다.",
    badge: "참고",
  },
  {
    areaGroup: "수내동",
    title: "수내동",
    statusLabel: "학군·역세권 구축 기대",
    description: "수내역 접근성과 학군 선호가 강해 재건축 기대와 실거주 수요가 동시에 반영될 수 있습니다.",
    caution: "단지별 추진 단계, 동별 선호, 학군 배정 기대를 따로 확인해야 합니다.",
    badge: "참고",
  },
  {
    areaGroup: "서현동",
    title: "서현동 시범단지",
    statusLabel: "선도지구 관련 이슈",
    description: "시범단지는 1기 신도시 재건축 보도에서 자주 언급되는 축입니다. 기대감은 크지만 사업 일정은 달라질 수 있습니다.",
    caution: "분담금, 이주 시점, 사업시행자 선정은 확정값으로 볼 수 없습니다.",
    badge: "보도 기반",
  },
  {
    areaGroup: "이매동",
    title: "이매동",
    statusLabel: "판교 접근 실거주형",
    description: "이매역과 판교 접근성, 학군 체감이 가격을 받치는 생활권입니다. 재건축 기대만으로 설명하기 어렵습니다.",
    caution: "단지·동·역 접근 시간에 따라 가격 차이가 커질 수 있습니다.",
    badge: "참고",
  },
  {
    areaGroup: "분당동",
    title: "분당동",
    statusLabel: "특별정비구역 관련 확인 필요",
    description: "분당동 구축 단지는 특별정비구역 논의와 생활권 재평가를 함께 봐야 합니다.",
    caution: "구역 지정과 실제 사업 속도는 별개이므로 발행 시점 원문 확인이 필요합니다.",
    badge: "보도 기반",
  },
];

export const BDAP_CONTEXT: BundangContextCard[] = [
  {
    title: "판교·강남 접근성",
    body: "분당 가격은 단지 자체뿐 아니라 판교 테크노밸리, 강남 업무지구, 수인분당선·신분당선 접근성이 함께 만듭니다.",
    badge: "참고",
  },
  {
    title: "1기 신도시 재건축 기대",
    body: "재건축 기대는 분당 구축 가격의 핵심 변수지만, 단계가 같아도 분담금·동의율·사업 속도에 따라 결과가 달라질 수 있습니다.",
    badge: "보도 기반",
  },
  {
    title: "학군과 생활 인프라",
    body: "정자·수내·서현은 학군, 상권, 공원, 병원 등 기존 생활 인프라가 두꺼워 실거주 수요가 꾸준히 비교됩니다.",
    badge: "참고",
  },
  {
    title: "거래 건수와 면적 차이",
    body: "최근 거래가 적은 단지는 한 건의 가격이 평균처럼 보일 수 있습니다. 전용 84㎡가 아니면 면적 차이를 반드시 봐야 합니다.",
    badge: "공식 재확인 필요",
  },
];

export const BDAP_SOURCE_LINKS: RelatedLink[] = [
  {
    href: "https://rt.molit.go.kr/",
    label: "국토교통부 실거래가 공개시스템",
    description: "단지별 매매·전세 실거래가 원문 확인 기준입니다.",
  },
  {
    href: "https://www.reb.or.kr/",
    label: "한국부동산원",
    description: "지역별 가격 흐름과 주간 시장 동향을 확인할 때 참고합니다.",
  },
  {
    href: "https://new.land.naver.com/",
    label: "네이버부동산",
    description: "실거래가와 현재 매물가 차이를 보조적으로 확인합니다.",
  },
];

export const BDAP_FAQ: BundangFaqItem[] = [
  {
    question: "분당 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 정자·수내·서현 등 생활권 대표성, 검색 수요, 거래 데이터 확보 가능성, 재건축 기대 여부를 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세, 재건축 분담금 등을 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "분당 재건축 단지는 지금 사면 안전한가요?",
    answer:
      "안전하다고 단정할 수 없습니다. 선도지구나 특별정비구역 관련 이슈는 가격 기대감을 만들 수 있지만, 사업 속도, 분담금, 이주 시점, 정책 변화에 따라 결과가 크게 달라질 수 있습니다.",
  },
  {
    question: "파크뷰가 분당에서 가장 비싼 아파트인가요?",
    answer:
      "파크뷰는 분당 대표 대장 단지로 자주 언급되지만, 거래 시점·면적·층·향·동에 따라 수내동이나 서현동 일부 단지가 더 높은 거래를 기록할 수 있습니다. 단일 단지를 분당 전체 가격으로 보면 안 됩니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "분당 아파트는 재건축 때문에 오른 건가요?",
    answer:
      "재건축 기대는 중요한 변수 중 하나입니다. 다만 신분당선·분당선 교통, 판교 접근성, 학군, 기존 생활 인프라, 매물 상황도 함께 작용하므로 하나의 이유로 단정하면 안 됩니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 재건축 기대가 큰 단지는 전세가율이 낮아도 매매가가 높을 수 있고, 전세가율이 높아도 사업성이나 입지 변수는 별도로 봐야 합니다.",
  },
  {
    question: "지금 분당 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 재건축 리스크, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const BDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/",
    label: "분당 재건축 vs 동탄 신축 비교",
    description: "15억 예산 기준 두 지역의 실거주·투자·교통·학군 포인트를 비교합니다.",
  },
  {
    href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/",
    label: "동탄·분당·수지·영통 대장 아파트 비교",
    description: "경기 남부 주요 주거지의 84㎡ 가격대와 교통·학군·리스크를 비교합니다.",
  },
  {
    href: "/reports/dongtan-hot-apartment-ranking-2026/",
    label: "동탄 신고가 아파트 추적",
    description: "GTX-A 이후 동탄 대표 단지의 실거래가와 신고가 사례를 확인합니다.",
  },
  {
    href: "/tools/income-home-affordability/",
    label: "소득 대비 집값 부담 계산기",
    description: "내 소득과 대출 조건으로 감당 가능한 집값을 계산합니다.",
  },
  {
    href: "/tools/real-estate-acquisition-tax/",
    label: "부동산 취득세 계산기",
    description: "매수가에 따른 취득세 부담을 함께 확인합니다.",
  },
];

export const BDAP_SEO_INTRO = [
  "분당 아파트 실거래가를 볼 때는 단순히 가장 비싼 단지 하나만 보면 부족합니다. 정자동, 수내동, 서현동, 이매동은 모두 분당 안에 있지만 가격을 만드는 이유가 다릅니다. 정자동은 판교·정자 생활권과 상품성, 수내동은 학군과 역세권, 서현동은 시범단지와 재건축 기대, 이매동은 판교 접근성과 실거주 수요가 함께 작용합니다.",
  "이 리포트는 분당 대표 단지의 최근 기준가와 최근 5년 저점권 가격을 나란히 놓고 평가차익(추정)을 계산합니다. 단, 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세, 재건축 분담금을 모두 제외한 단순 시세 차이입니다.",
  "재건축 기대가 있는 단지는 가격 설명력이 커질 수 있지만, 기대감과 확정 일정은 다릅니다. 선도지구, 특별정비구역, 조합 의사결정, 정책 변화, 공사비와 분담금은 모두 별도로 확인해야 합니다.",
  "따라서 이 페이지는 매수 추천이 아니라 비교용 지도에 가깝습니다. 관심 단지를 고른 뒤에는 국토교통부 실거래가 공개시스템에서 같은 면적의 최신 거래를 다시 확인하고, 주택구입자금 계산기와 취득세 계산기로 월 부담과 초기 비용을 함께 보는 흐름이 안전합니다.",
  "특히 84㎡ 거래가 부족한 단지는 유사 면적 거래가 섞일 수 있습니다. 표의 면적 라벨, 거래일, 주의 문구를 함께 확인해야 단지 간 가격 차이를 과장해서 해석하지 않을 수 있습니다.",
];

export const BDAP_SEO_CRITERIA = [
  "가격은 전용 84㎡를 우선 기준으로 하며, 거래가 부족한 단지는 유사 면적임을 별도 표기합니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 가격을 뺀 단순 시세 차이입니다.",
  "재건축 단계는 발행 시점 기준 참고이며, 분담금·입주 시점·사업 일정은 확정값이 아닙니다.",
  "전세가율은 참고 지표이며, 전세 거래 건수가 부족하면 가격 지지력 판단에 한계가 있습니다.",
  "모든 수치는 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
