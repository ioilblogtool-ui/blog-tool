export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type SeongdongAreaGroup =
  | "서울숲·성수권"
  | "옥수·금호권"
  | "왕십리·행당권"
  | "응봉·마장권"
  | "한강변권";

export interface SeongdongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SeongdongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SeongdongAreaGroup;
  legalDongLabel:
    | "성수동1가"
    | "성수동2가"
    | "옥수동"
    | "금호동1가"
    | "금호동2가"
    | "금호동3가"
    | "금호동4가"
    | "행당동"
    | "응봉동"
    | "마장동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  riverNote?: string;
  commuteNote?: string;
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

export interface SeongdongAreaCard {
  areaGroup: SeongdongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SeongdongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SeongdongFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SDAP_META: SeongdongApartmentMeta = {
  slug: "seongdong-apartment-price-2026",
  title: "성동 대장 아파트 Top10 2026",
  seoTitle: "성동 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "아크로서울포레스트, 트리마제, 갤러리아포레, 래미안 옥수 리버젠 등 성동구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 서울숲·성수·옥수·금호·왕십리 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 말 발행 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템 재확인이 필요한 참고용 기준값입니다. 초고가 주상복합과 일반 아파트는 면적·세대 타입·거래 건수 차이가 커 직접 비교에 주의해야 합니다.",
};

const withGain = <T extends Omit<SeongdongApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): SeongdongApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const SDAP_APARTMENTS: SeongdongApartmentRow[] = [
  withGain({
    id: "acro-seoul-forest",
    rank: 1,
    complexName: "아크로서울포레스트",
    complexNameOfficial: "아크로서울포레스트",
    areaGroup: "서울숲·성수권",
    legalDongLabel: "성수동1가",
    addressLabel: "성수동1가 · 서울숲 인접 초고가",
    supplyYear: 2019,
    householdCount: 280,
    mainAreaLabel: "전용 84㎡ (단지 내 소형 타입 — 거래 건수 적음, 발행 전 원문 재확인 필수)",
    stationLabel: "2호선 뚝섬역·서울숲역 접근",
    riverNote: "한강·서울숲 인접",
    commuteNote: "강남·도심 접근 용이",
    latestTradePriceManwon: 490000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "전용 84㎡ 타입 (거래 건수·층·동 재확인 필요)",
    previousYearPriceManwon: 430000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 290000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡ 또는 유사 타입",
    jeonsePriceManwon: 160000,
    jeonseRatio: 33,
    tradeCountNote: "전용 84㎡ 타입 거래 건수가 매우 적습니다. 발행 전 국토교통부 실거래가 시스템에서 같은 타입 최신 거래를 반드시 확인해야 합니다.",
    badge: "확인 필요",
    note: "서울숲 인접 성동구 최상위 초고가 단지입니다. 전용 84㎡는 단지 내 소형 타입으로 거래가 드물고 가격 변동성이 큽니다. 대형 타입과 같은 단지명으로 묶여 있어 직접 비교 시 타입 확인이 필수입니다.",
  }),
  withGain({
    id: "trimaje",
    rank: 2,
    complexName: "트리마제",
    complexNameOfficial: "트리마제",
    areaGroup: "서울숲·성수권",
    legalDongLabel: "성수동1가",
    addressLabel: "성수동1가 · 서울숲 주상복합",
    supplyYear: 2017,
    householdCount: 688,
    mainAreaLabel: "전용 84㎡ (주상복합 — 오피스텔·상업시설 거래 혼재 여부 확인 필요)",
    stationLabel: "2호선 뚝섬역 인근",
    riverNote: "한강·서울숲 조망 가능",
    latestTradePriceManwon: 320000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "전용 84㎡ (주상복합 타입, 거래 건수 재확인 필요)",
    previousYearPriceManwon: 280000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 195000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡ 또는 유사 타입",
    jeonsePriceManwon: 120000,
    jeonseRatio: 38,
    tradeCountNote: "주상복합 특성상 오피스텔·상업시설 거래가 혼재할 수 있습니다. 순수 아파트(주거) 타입 거래만 집계해야 하며, 발행 전 원문 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "성동구 대표 주상복합 고가 단지입니다. 전용 84㎡ 타입이 존재하나 주상복합 특성상 세대 타입과 거래 건수가 일반 아파트와 달라 직접 비교 시 주의가 필요합니다.",
  }),
  withGain({
    id: "galleria-fore",
    rank: 3,
    complexName: "갤러리아포레",
    complexNameOfficial: "갤러리아포레",
    areaGroup: "서울숲·성수권",
    legalDongLabel: "성수동1가",
    addressLabel: "성수동1가 · 서울숲 초대형 고급 단지",
    supplyYear: 2012,
    householdCount: 190,
    mainAreaLabel: "전용 183㎡ 이상 위주 (84㎡ 타입 없음 — 대형 타입 기준 참고가 표기)",
    stationLabel: "2호선 서울숲역·뚝섬역 접근",
    riverNote: "서울숲 인접",
    latestTradePriceManwon: 650000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "전용 183㎡ 이상 위주 (84㎡ 타입 없음 — 발행 전 반드시 확인)",
    previousYearPriceManwon: 560000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 390000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "전용 183㎡ 이상 위주",
    tradeCountNote: "84㎡ 타입이 없어 일반 아파트와 직접 비교 불가능합니다. 이 단지의 수치는 전용 183㎡ 이상 대형 타입 기준 참고가이며, 타입·면적·거래 건수는 발행 전 원문에서 반드시 재확인해야 합니다.",
    badge: "확인 필요",
    note: "갤러리아포레는 전용 183㎡ 이상 초대형 타입이 주력인 소규모 고급 단지입니다. 84㎡ 비교 단지와 단순 가격 비교는 의미가 없으며, 이 단지의 수치는 별도 면적 기준 참고용으로만 확인해야 합니다.",
  }),
  withGain({
    id: "seoul-forest-riverview-xi",
    rank: 4,
    complexName: "서울숲리버뷰자이",
    complexNameOfficial: "서울숲리버뷰자이",
    areaGroup: "한강변권",
    legalDongLabel: "성수동2가",
    addressLabel: "성수동2가 · 한강변 대단지",
    supplyYear: 2009,
    householdCount: 941,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "2호선 뚝섬역 도보권",
    riverNote: "한강변 조망 가능 동 있음",
    latestTradePriceManwon: 185000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 160000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 118000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 78000,
    jeonseRatio: 42,
    tradeCountNote: "동·층·향에 따라 한강 조망 유무가 가격에 영향을 줍니다. 층·동별 편차가 클 수 있습니다.",
    badge: "확인 필요",
    note: "성수동 한강변 대단지로 뚝섬역 역세권과 한강 접근성이 가격을 지지합니다.",
  }),
  withGain({
    id: "raemian-oksu-rivergen",
    rank: 5,
    complexName: "래미안 옥수 리버젠",
    complexNameOfficial: "래미안옥수리버젠",
    areaGroup: "옥수·금호권",
    legalDongLabel: "옥수동",
    addressLabel: "옥수동 · 한강변·역세권 실거주",
    supplyYear: 2012,
    householdCount: 1104,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "3호선 옥수역 도보권",
    riverNote: "한강 조망 가능 동 있음",
    commuteNote: "강남·도심 접근성",
    latestTradePriceManwon: 178000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 155000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 113000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 75000,
    jeonseRatio: 42,
    tradeCountNote: "옥수역 거리와 동 배치에 따라 한강 조망 여부와 가격 편차가 달라집니다.",
    badge: "확인 필요",
    note: "옥수 한강변 실거주 수요를 대표하는 단지입니다. 3호선 옥수역 역세권과 한강 접근성이 함께 가격을 지지합니다.",
  }),
  withGain({
    id: "e-pyeonhan-oksu-parkills",
    rank: 6,
    complexName: "e편한세상 옥수 파크힐스",
    complexNameOfficial: "e편한세상옥수파크힐스",
    areaGroup: "옥수·금호권",
    legalDongLabel: "옥수동",
    addressLabel: "옥수동 · 브랜드 준신축",
    supplyYear: 2016,
    householdCount: 1097,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "3호선 옥수역 도보권",
    latestTradePriceManwon: 157000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 136000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 99000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 66000,
    jeonseRatio: 42,
    tradeCountNote: "준신축 브랜드 단지로 층·동 위치에 따라 조망과 가격 차이가 납니다.",
    badge: "확인 필요",
    note: "옥수권 준신축 브랜드 단지 선호 수요가 반영됩니다. 래미안 옥수 리버젠과 함께 옥수권 가격대를 비교할 때 참고합니다.",
  }),
  withGain({
    id: "hillstate-seoul-forest-river",
    rank: 7,
    complexName: "힐스테이트 서울숲 리버",
    complexNameOfficial: "힐스테이트서울숲리버",
    areaGroup: "한강변권",
    legalDongLabel: "응봉동",
    addressLabel: "응봉동 · 금호·응봉 한강변",
    supplyYear: 2020,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "응봉역 또는 버스 환승",
    riverNote: "한강·중랑천 인접",
    latestTradePriceManwon: 142000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 123000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 90000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 60000,
    jeonseRatio: 42,
    tradeCountNote: "공식 단지명과 법정동을 발행 전 원문에서 재확인해야 합니다.",
    badge: "확인 필요",
    note: "응봉동 한강변 준신축 단지 후보입니다. 공식 단지명과 행정구역 기준을 발행 전 원문에서 반드시 확인해야 합니다.",
  }),
  withGain({
    id: "seoul-forest-prugio",
    rank: 8,
    complexName: "서울숲 푸르지오",
    complexNameOfficial: "서울숲푸르지오",
    areaGroup: "서울숲·성수권",
    legalDongLabel: "성수동2가",
    addressLabel: "성수동2가 · 성수·응봉 생활권",
    supplyYear: 2007,
    householdCount: 1074,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "2호선 뚝섬역·응봉역 접근",
    riverNote: "한강·응봉산 인접",
    latestTradePriceManwon: 130000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 113000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 83000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 55000,
    jeonseRatio: 42,
    tradeCountNote: "성수동2가 단지로 서울숲 인접성과 성수 상권 접근성이 가격에 함께 반영됩니다.",
    badge: "확인 필요",
    note: "성수·응봉 생활권 대단지 후보입니다. 서울숲권 초고가 단지와 직접 가격 비교 시 연식과 면적 차이를 주의해야 합니다.",
  }),
  withGain({
    id: "wangsimni-newtown-tenzhill",
    rank: 9,
    complexName: "왕십리뉴타운 텐즈힐",
    complexNameOfficial: "텐즈힐",
    areaGroup: "왕십리·행당권",
    legalDongLabel: "행당동",
    addressLabel: "행당동 · 왕십리 환승 대단지",
    supplyYear: 2014,
    householdCount: 2529,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "2·5호선 왕십리역 역세권",
    commuteNote: "도심·강남 환승 접근성",
    latestTradePriceManwon: 118000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 103000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 76000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 52000,
    jeonseRatio: 44,
    tradeCountNote: "대단지 특성상 동·층·향 차이가 대표 거래 해석에 영향을 줄 수 있습니다.",
    badge: "확인 필요",
    note: "왕십리역 환승 역세권 대단지입니다. 서울숲권 초고가 단지와 직접 가격을 비교하기보다 왕십리·행당권 내 가격 수준으로 해석해야 합니다.",
  }),
  withGain({
    id: "haengdang-hanshin-haerimwon",
    rank: 10,
    complexName: "행당 한진 타운",
    complexNameOfficial: "행당한진타운",
    areaGroup: "왕십리·행당권",
    legalDongLabel: "행당동",
    addressLabel: "행당동 · 왕십리·행당 실거주축",
    supplyYear: 2000,
    householdCount: 1584,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    stationLabel: "2호선 행당역·왕십리역 접근 가능",
    latestTradePriceManwon: 96000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 우선, 거래 없으면 유사 면적",
    previousYearPriceManwon: 84000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 62000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonsePriceManwon: 43000,
    jeonseRatio: 45,
    tradeCountNote: "구축 단지로 84㎡ 거래 건수와 면적 일치 여부를 원문에서 재확인해야 합니다.",
    badge: "확인 필요",
    note: "왕십리·행당 실거주축 구축 대표 후보입니다. 서울숲권 대비 진입 가격이 낮지만 연식과 생활권 체감 차이를 함께 봐야 합니다.",
  }),
];

export const SDAP_AREA_CARDS: SeongdongAreaCard[] = [
  {
    areaGroup: "서울숲·성수권",
    title: "서울숲·성수권",
    description:
      "아크로서울포레스트, 트리마제, 갤러리아포레 등 성동구 최상단 가격을 형성하는 구역입니다. 서울숲 인접성, 성수 상권과 업무 확장성, 희소한 고급 단지 특성이 초고가 프리미엄을 만듭니다.",
    priceInterpretation:
      "서울숲·성수 개발 기대감과 희소성이 가격에 반영되어 있습니다. 단지 규모가 작고 대형 면적 위주라 84㎡ 비교가 어려운 경우가 많습니다.",
    caution:
      "주상복합·초고가 단지는 거래 건수가 적어 한 건의 거래가 시세처럼 보일 수 있습니다. 성수 개발 기대감은 가격에 선반영될 수 있으며 향후 변동성이 클 수 있습니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "옥수·금호권",
    title: "옥수·금호권",
    description:
      "3호선 옥수역 역세권과 한강변 실거주 수요가 가격 핵심입니다. 강남·도심 모두 빠르게 접근할 수 있어 실거주 선호가 강한 구역입니다.",
    priceInterpretation:
      "한강 조망이 가능한 동·층은 프리미엄이 반영됩니다. 역에서의 도보 거리, 경사, 동 배치에 따라 같은 단지 안에서도 가격 차이가 납니다.",
    caution:
      "금호동은 경사 지형으로 실거주 편의성 체감이 단지별로 다릅니다. 한강 조망이 가격을 보장하지는 않으며, 거래 시점·층·향에 따라 큰 편차가 있습니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "왕십리·행당권",
    title: "왕십리·행당권",
    description:
      "2·5호선 왕십리역 환승 교통과 왕십리뉴타운 대단지 생활권이 가격을 지지합니다. 서울숲·성수권 대비 가격 접근성이 높아 실거주 수요가 꾸준합니다.",
    priceInterpretation:
      "환승 편의성이 가격의 핵심 변수입니다. 서울숲권 초고가 단지와 직접 비교보다는 왕십리·행당권 내 가격 수준으로 해석해야 합니다.",
    caution:
      "서울숲권과 왕십리권은 같은 성동구지만 가격 논리가 다릅니다. 같은 표에서 두 권역을 단순 비교하면 왜곡이 생길 수 있습니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "한강변권",
    title: "한강변권",
    description:
      "성수동·응봉동 한강변 단지는 조망과 강변 접근성으로 프리미엄이 형성됩니다. 서울숲 인접 단지와 겹치는 경우도 있어 생활권 분류에 유의해야 합니다.",
    priceInterpretation:
      "한강 조망 여부와 층·동 위치가 같은 단지 안에서도 가격 차이를 만듭니다. 최신 실거래가가 조망 동인지 내향 동인지 확인이 필요합니다.",
    caution:
      "한강 조망과 접근성은 가격에 영향을 줄 수 있지만 가격을 보장하지 않습니다. 실제 가격은 동·층·향·면적·거래 시점에 따라 달라집니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "응봉·마장권",
    title: "응봉·마장권",
    description:
      "성동구 내 상대적 가격 접근성이 있는 생활권입니다. 한강·중랑천 인접성, 응봉산 녹지 접근성이 거주 선호 이유로 언급됩니다.",
    priceInterpretation:
      "서울숲·옥수권 대비 진입 가격이 낮지만, 연식과 교통 체감 차이가 있습니다. 성동구 안에서 가격 접근성을 원하는 실거주 수요층이 주요 수요입니다.",
    caution:
      "거래 건수가 적어 대표 거래 한 건이 시세처럼 보일 수 있습니다. 단지별 연식, 역 접근성, 생활 인프라 차이를 개별 확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const SDAP_CONTEXT: SeongdongContextCard[] = [
  {
    title: "서울숲·한강변 희소성",
    body: "서울숲과 한강변 인접성은 성동 고가 단지의 핵심 변수입니다. 하지만 희소성이 가격을 영구적으로 보장하지는 않으며, 거래 건수가 적어 한 건의 거래가 시세를 왜곡할 수 있습니다.",
    badge: "확인 필요",
  },
  {
    title: "성수 업무·상권 확장성",
    body: "성수동은 카페·브랜드 팝업·오피스 입주 등 상권과 업무지구 확장이 이어지고 있습니다. 이 기대감이 가격에 선반영될 수 있지만, 개발 속도와 실거주 체감은 별개로 봐야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "옥수·금호 실거주 수요",
    body: "옥수·금호권은 3호선 역세권과 한강변, 강남·도심 접근성이 실거주 수요를 만들어냅니다. 서울숲권 초고가 단지와 비교 시 연식·유형·가격 논리가 다릅니다.",
    badge: "확인 필요",
  },
  {
    title: "왕십리 환승 접근성",
    body: "2·5호선 환승 왕십리역은 도심·강남 모두 접근 가능한 교통 허브입니다. 뉴타운 대단지와 함께 왕십리·행당권 가격 지지력의 핵심입니다.",
    badge: "확인 필요",
  },
];

export const SDAP_SOURCE_LINKS: RelatedLink[] = [
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

export const SDAP_FAQ: SeongdongFaqItem[] = [
  {
    question: "성동 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "성동 아파트는 왜 비싼가요?",
    answer:
      "서울숲과 한강변 희소성, 성수 상권과 업무지구 확장성, 옥수·금호의 강남·도심 접근성, 왕십리 환승 교통이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "트리마제와 일반 아파트를 같이 비교해도 되나요?",
    answer:
      "직접 비교에는 주의가 필요합니다. 트리마제, 갤러리아포레, 아크로서울포레스트 같은 단지는 주상복합·대형 면적 거래가 많을 수 있어 면적과 세대 타입을 반드시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "서울숲권과 옥수·금호권은 가격을 같이 봐도 되나요?",
    answer:
      "둘 다 성동구에 속하지만 가격 논리는 다릅니다. 서울숲권은 초고가·희소성·성수 상권 수요가 강하고, 옥수·금호권은 한강변과 강남·도심 접근성, 실거주 선호가 중요합니다.",
  },
  {
    question: "한강 조망이 있으면 무조건 비싼가요?",
    answer:
      "한강 조망과 접근성은 가격에 영향을 줄 수 있지만 가격을 보장하지 않습니다. 실제 가격은 동·층·향·면적, 거래 시점, 단지 상태에 따라 달라집니다.",
  },
  {
    question: "지금 성동 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const SDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포 대장 아파트 Top10",
    description: "공덕·아현·대흥·상암 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/yongsan-apartment-price-2026/",
    label: "용산 대장 아파트 Top10",
    description: "한강변·국제업무지구 기대감과 실거래가 변화를 구분해서 봅니다.",
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

export const SDAP_SEO_INTRO = [
  "성동 아파트 실거래가를 볼 때는 서울숲·성수권, 옥수·금호권, 왕십리·행당권을 나눠서 봐야 합니다. 아크로서울포레스트·트리마제·갤러리아포레는 서울숲 인접 초고가·소규모·대형 면적 단지로 일반 84㎡ 아파트와 단순 비교가 어렵습니다. 래미안 옥수 리버젠·e편한세상 옥수 파크힐스는 실거주 수요와 한강변·역세권 접근성이 가격을 지지하고, 왕십리뉴타운 텐즈힐은 환승 교통 중심의 다른 가격 논리로 움직입니다.",
  "이 리포트는 성동 대표 단지의 최근 기준가와 최근 5년 저점권 가격을 나란히 놓고 평가차익(추정)을 계산합니다. 단, 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 모두 제외한 단순 시세 차이입니다.",
  "성수 개발 기대감은 성동 가격의 중요한 변수지만, 개발 속도·입주자 체감·상권 변화는 가격 방향과 항상 같지 않습니다. 서울숲 희소성을 가격 보장처럼 해석하면 실거래가를 왜곡하게 됩니다.",
  "따라서 이 페이지는 매수 추천이 아니라 비교용 지도에 가깝습니다. 관심 단지를 고른 뒤에는 국토교통부 실거래가 공개시스템에서 같은 면적·타입의 최신 거래를 다시 확인하고, 주택구입자금 계산기와 취득세 계산기로 월 부담과 초기 비용을 함께 보는 흐름이 안전합니다.",
  "특히 아크로서울포레스트·트리마제·갤러리아포레는 84㎡ 거래가 부족하거나 대형 면적 위주 거래가 섞일 수 있습니다. 표의 면적 라벨, 거래일, 주의 문구를 반드시 함께 확인해야 합니다.",
];

export const SDAP_SEO_CRITERIA = [
  "가격은 전용 84㎡를 우선 기준으로 하며, 거래가 부족하거나 대형 면적 위주 단지는 별도 표기합니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 가격을 뺀 단순 시세 차이입니다.",
  "생활권 구분(서울숲·성수권·옥수·금호권·왕십리·행당권·한강변권·응봉·마장권)은 실거주 체감 기준이며, 단지별 행정동과 다를 수 있습니다.",
  "주상복합 단지는 오피스텔·상업시설 거래와 순수 아파트 거래를 구분해야 하며, 직접 비교에 주의가 필요합니다.",
  "모든 수치는 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export const SDAP_METHOD: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하고, 84㎡ 거래가 부족하거나 해당 타입이 없는 단지는 면적·타입을 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "상승률(추정)은 평가차익을 최근 5년 저점 참고가로 나눈 값으로, 실제 투자 수익률이 아닙니다.",
  "세금, 중개보수, 대출이자, 보유세, 양도소득세, 수리비는 모두 제외했습니다.",
  "아크로서울포레스트·트리마제·갤러리아포레는 면적 타입·세대 구성이 일반 아파트와 달라 84㎡ 기준 비교에 별도 주의가 필요합니다.",
  "거래 건수가 적은 단지는 평균 시세가 아니라 대표 거래 사례로 읽어야 합니다.",
];

export const SDAP_RISKS: string[] = [
  "같은 단지라도 동·층·향·한강 조망·수리 상태에 따라 가격 차이가 크게 납니다.",
  "서울숲권 초고가 단지(아크로서울포레스트·트리마제·갤러리아포레)와 옥수·왕십리권 일반 단지의 가격 논리가 다릅니다. 같은 표에서 단순 비교하면 왜곡될 수 있습니다.",
  "성수 개발 기대감은 가격에 선반영될 수 있으며, 실제 개발 속도와 실거주 체감은 가격 방향과 다를 수 있습니다.",
  "금리, DSR, 취득세, 종부세, 양도세 규정 변화는 실제 매수 부담을 크게 바꿉니다.",
  "신축·준신축과 구축 단지를 같은 기준으로 직접 비교하면 연식 차이가 반영되지 않아 해석이 왜곡될 수 있습니다.",
  "이 리포트의 모든 수치는 참고용 추정값으로, 실제 의사결정 전 국토교통부 실거래가 공개시스템 원자료를 반드시 확인해야 합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
