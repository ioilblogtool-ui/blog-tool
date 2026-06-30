export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type MapoAreaGroup =
  | "아현·공덕권"
  | "대흥·염리권"
  | "합정·상수권"
  | "상암·DMC권"
  | "용강·도화권";

export interface MapoApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface MapoApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial: string;
  areaGroup: MapoAreaGroup;
  legalDongLabel:
    | "아현동"
    | "공덕동"
    | "염리동"
    | "대흥동"
    | "신공덕동"
    | "합정동"
    | "상수동"
    | "상암동"
    | "용강동"
    | "도화동"
    | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  commuteNote?: string;
  latestTradePriceManwon: number;
  latestTradeDate: string;
  latestTradeArea: string;
  previousYearPriceManwon?: number;
  previousYearPeriod?: string;
  fiveYearLowPriceManwon: number;
  fiveYearLowDate: string;
  fiveYearLowArea: string;
  jeonsePriceManwon?: number;
  jeonseRatio?: number;
  tradeCountNote: string;
  badge: DataBadge;
  note: string;
}

export interface MapoApartmentViewRow extends MapoApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface MapoAreaCard {
  areaGroup: MapoAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface MapoContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface MapoFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const MAPAP_META: MapoApartmentMeta = {
  slug: "mapo-apartment-price-2026",
  title: "마포 대장 아파트 Top10 2026",
  seoTitle: "마포 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "마포래미안푸르지오, 공덕자이, 마포프레스티지자이, 신촌그랑자이 등 마포구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 아현·공덕·대흥·상암 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 설계 단계 후보 데이터 기준 (국토부 재확인 필요)",
  notice:
    "이 리포트의 가격은 설계 단계 후보값입니다. 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일을 다시 확인한 뒤 실제 의사결정에 활용해야 합니다.",
};

const rawApartments: MapoApartmentRow[] = [
  {
    id: "mapo-the-clash",
    rank: 1,
    complexName: "마포더클래시",
    complexNameOfficial: "마포더클래시",
    areaGroup: "아현·공덕권",
    legalDongLabel: "아현동",
    addressLabel: "서울특별시 마포구 아현동·아현뉴타운",
    supplyYear: 2022,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "2호선·5호선 공덕역 도보권",
    commuteNote: "공덕 환승, 광화문·여의도 접근",
    latestTradePriceManwon: 278000,
    latestTradeDate: "2026년 상반기 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 255000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 230000,
    fiveYearLowDate: "2022~2023년 입주 초기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 120000,
    jeonseRatio: 43.2,
    tradeCountNote: "2022년 준공 신축 단지로 거래 건수가 적습니다. 대표 거래 기준으로 읽어야 합니다.",
    badge: "확인 필요",
    note: "아현뉴타운 신축 대표 단지입니다. 거래 건수가 적으면 한 건의 거래가 기준가처럼 보일 수 있습니다.",
  },
  {
    id: "mapo-raemian-prugio",
    rank: 2,
    complexName: "마포래미안푸르지오",
    complexNameOfficial: "마포래미안푸르지오",
    areaGroup: "아현·공덕권",
    legalDongLabel: "아현동",
    addressLabel: "서울특별시 마포구 아현동·아현뉴타운",
    supplyYear: 2014,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 애오개역·2호선 아현역 도보권",
    commuteNote: "공덕 환승 도보 이동, 광화문·여의도 30분 내",
    latestTradePriceManwon: 250000,
    latestTradeDate: "2026년 6월 실거래 기준 (23.4~26.5억 범위)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 222000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 158000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 105000,
    jeonseRatio: 42.0,
    tradeCountNote: "대단지로 거래 데이터가 상대적으로 풍부합니다. 동·층·향에 따라 23.4~26.5억 편차 발생.",
    badge: "확인 필요",
    note: "마포 대표 대단지로 2026년 6월 기준 84㎡ 매매가 23.4~26.5억 수준입니다. 동·층·향에 따라 편차가 큽니다.",
  },
  {
    id: "mapo-prestige-xi",
    rank: 3,
    complexName: "마포프레스티지자이",
    complexNameOfficial: "마포프레스티지자이",
    areaGroup: "대흥·염리권",
    legalDongLabel: "염리동",
    addressLabel: "서울특별시 마포구 염리동·염리 재개발축",
    supplyYear: 2020,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 애오개역·2호선 이대역 도보권",
    latestTradePriceManwon: 283000,
    latestTradeDate: "2026년 6월 13일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 285000,
    previousYearPeriod: "2025년 9~10월 중층 실거래 참고",
    fiveYearLowPriceManwon: 189000,
    fiveYearLowDate: "2024년 3~6월 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 98000,
    jeonseRatio: 34.6,
    tradeCountNote: "실거래 기준. 25.10 최고 29억6천(105동25층). 26.06 28억3천(108동18층). 1층 특수 거래 제외 중층 대표값.",
    badge: "보도 기반",
    note: "24.03~06 저점 18억9천 → 25.10 최고 29억6천 → 26.06 28억3천. 25년 하반기 고점 이후 소폭 조정 흐름. 1층 저가 특수 거래 혼재.",
  },
  {
    id: "sinchon-grand-xi",
    rank: 4,
    complexName: "마포그랑자이",
    complexNameOfficial: "마포그랑자이",
    areaGroup: "대흥·염리권",
    legalDongLabel: "대흥동",
    addressLabel: "서울특별시 마포구 대흥동·신촌 생활권",
    supplyYear: 2021,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "2호선 이대역·6호선 대흥역 도보권",
    latestTradePriceManwon: 249500,
    latestTradeDate: "2026년 4월 22일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 255000,
    previousYearPeriod: "2025년 9~10월 중층 실거래 참고",
    fiveYearLowPriceManwon: 175000,
    fiveYearLowDate: "2024년 9월 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 92000,
    jeonseRatio: 36.9,
    tradeCountNote: "실거래 기준. 25.10 고점 26억8500(104동12층). 26.04 24억9500(109동10층). 1·2층 저가 특수 거래 혼재.",
    badge: "보도 기반",
    note: "24.09 저점 17억5천 → 25.10 고점 26억8500 → 26.04 24억9500. 고점 대비 조정 흐름. 신촌그랑자이와 동일 단지.",
  },
  {
    id: "gongdeok-xi",
    rank: 5,
    complexName: "공덕자이",
    complexNameOfficial: "공덕자이",
    areaGroup: "아현·공덕권",
    legalDongLabel: "공덕동",
    addressLabel: "서울특별시 마포구 공덕동·공덕역권",
    supplyYear: 2009,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선·6호선·경의중앙선·공항철도 공덕역 환승",
    commuteNote: "공덕 4개 노선 환승, 광화문·여의도·용산 직결",
    latestTradePriceManwon: 235000,
    latestTradeDate: "2026년 6월 6일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 230000,
    previousYearPeriod: "2025년 8~9월 중층 실거래 참고",
    fiveYearLowPriceManwon: 169000,
    fiveYearLowDate: "2024년 6월 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 85000,
    jeonseRatio: 36.2,
    tradeCountNote: "실거래 기준. 25.09 고점 24억8천(114동7층). 26.06 23억5천(8층). 1층 저가 거래 혼재.",
    badge: "보도 기반",
    note: "24.06 저점 16억9천 → 25.09 고점 24억8천 → 26.06 23억5천. 고점 대비 소폭 조정. 2009년 구축이나 공덕역 4호선 환승 프리미엄 유지.",
  },
  {
    id: "gongdeok-sk-leaders-view",
    rank: 6,
    complexName: "공덕SK리더스뷰",
    complexNameOfficial: "공덕SK리더스뷰",
    areaGroup: "아현·공덕권",
    legalDongLabel: "신공덕동",
    addressLabel: "서울특별시 마포구 신공덕동·공덕역권",
    supplyYear: 2010,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "공덕역 인접",
    latestTradePriceManwon: 172000,
    latestTradeDate: "2026년 상반기 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 155000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 118000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 78000,
    jeonseRatio: 45.3,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "공덕 환승 역세권 단지입니다. 단지명과 면적별 거래 분포를 국토부에서 재확인하세요.",
  },
  {
    id: "mapo-hangang-ipark",
    rank: 7,
    complexName: "마포한강아이파크",
    complexNameOfficial: "마포한강아이파크",
    areaGroup: "용강·도화권",
    legalDongLabel: "용강동",
    addressLabel: "서울특별시 마포구 용강동·한강변",
    supplyYear: 2008,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 마포역 도보권",
    commuteNote: "여의도·용산 차량·지하철 이동",
    latestTradePriceManwon: 165000,
    latestTradeDate: "2026년 상반기 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 148000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 112000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 76000,
    jeonseRatio: 46.1,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "한강 접근성이 가격에 영향을 줄 수 있습니다. 한강 조망 여부는 동·층에 따라 차이가 크므로 가격 보장처럼 해석하면 안 됩니다.",
  },
  {
    id: "raemian-gongdeok5",
    rank: 8,
    complexName: "래미안공덕5차",
    complexNameOfficial: "래미안공덕5차",
    areaGroup: "아현·공덕권",
    legalDongLabel: "공덕동",
    addressLabel: "서울특별시 마포구 공덕동·공덕역권",
    supplyYear: 2007,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "공덕역 도보권",
    latestTradePriceManwon: 158000,
    latestTradeDate: "2026년 상반기 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 142000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 108000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 72000,
    jeonseRatio: 45.6,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "공덕권 구축 래미안 단지입니다. 단지명 표기와 면적별 거래를 국토부에서 재확인하세요.",
  },
  {
    id: "mapo-xi",
    rank: 9,
    complexName: "마포자이",
    complexNameOfficial: "마포자이",
    areaGroup: "대흥·염리권",
    legalDongLabel: "염리동",
    addressLabel: "서울특별시 마포구 염리동·대흥·염리권",
    supplyYear: 2008,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 애오개역 도보권",
    latestTradePriceManwon: 260000,
    latestTradeDate: "2026년 6월 6일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 245000,
    previousYearPeriod: "2025년 9~10월 중층 실거래 참고",
    fiveYearLowPriceManwon: 153500,
    fiveYearLowDate: "2024년 4월 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 68000,
    jeonseRatio: 26.2,
    tradeCountNote: "실거래 기준. 25.09~10 23억4천~25억3천. 26.06 26억(104동9층). 저층·특수 거래 혼재.",
    badge: "보도 기반",
    note: "24.04 저점 15억3500 → 25.10 25억3천 → 26.06 26억. 1년 반 만에 +69% 상승. 2008년 구축 대비 가격 레벨이 높은 편.",
  },
  {
    id: "sangam-worldcup-park9",
    rank: 10,
    complexName: "상암 월드컵파크9단지",
    complexNameOfficial: "상암월드컵파크9단지",
    areaGroup: "상암·DMC권",
    legalDongLabel: "상암동",
    addressLabel: "서울특별시 마포구 상암동·DMC 생활권",
    supplyYear: 2006,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "6호선 디지털미디어시티역 도보권",
    commuteNote: "DMC 업무지구 도보, 공항철도 환승",
    latestTradePriceManwon: 128000,
    latestTradeDate: "2026년 상반기 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 115000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 88000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 60000,
    jeonseRatio: 46.9,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "상암·DMC권 대단지 대표 단지입니다. 공덕권과 가격 논리가 달라 직접 비교에 주의하세요.",
  },
];

export const MAPAP_APARTMENTS: MapoApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const MAPAP_AREA_CARDS: MapoAreaCard[] = [
  {
    areaGroup: "아현·공덕권",
    title: "아현·공덕권 — 도심 환승·대단지",
    description: "마포래미안푸르지오, 공덕자이, 마포더클래시 등이 포함된 마포 핵심 생활권입니다.",
    priceInterpretation: "공덕 4개 노선 환승과 광화문·여의도·용산 접근성이 가격에 반영되는 경향이 있습니다.",
    caution: "역까지 실제 도보 동선과 단지 출입구 위치에 따라 접근성 체감이 다릅니다.",
    badge: "추정",
  },
  {
    areaGroup: "대흥·염리권",
    title: "대흥·염리권 — 신촌축·재개발 신축",
    description: "마포프레스티지자이, 신촌그랑자이, 마포자이 등 신촌과 공덕 사이 재개발축 단지들이 포함됩니다.",
    priceInterpretation: "신축 브랜드 선호와 재개발 완료 후 생활환경 개선이 가격에 영향을 줄 수 있습니다.",
    caution: "신축 프리미엄과 생활권 선호를 분리해서 해석해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "상암·DMC권",
    title: "상암·DMC권 — 업무지구·대단지",
    description: "상암 월드컵파크 계열 대단지와 DMC 업무지구 생활권이 포함됩니다.",
    priceInterpretation: "DMC 업무지구 접근성과 대단지 생활환경이 가격에 반영됩니다.",
    caution: "아현·공덕권과 가격 논리가 달라 같은 기준으로 직접 비교하면 안 됩니다.",
    badge: "추정",
  },
  {
    areaGroup: "용강·도화권",
    title: "용강·도화권 — 한강접근·여의도이동",
    description: "마포한강아이파크 등 한강 접근성이 있는 용강·도화 생활권 단지들이 포함됩니다.",
    priceInterpretation: "한강 접근성과 여의도·용산 이동 편의가 가격에 영향을 줄 수 있습니다.",
    caution: "한강 조망 여부를 가격 보장처럼 표현하면 안 됩니다. 동·층에 따라 조망 차이가 큽니다.",
    badge: "추정",
  },
];

export const MAPAP_CONTEXT: MapoContextCard[] = [
  {
    title: "공덕 환승 접근성",
    body: "공덕역은 5호선·6호선·경의중앙선·공항철도가 교차하는 교통 허브입니다. 광화문, 여의도, 용산, 인천공항까지 환승 없이 이동할 수 있어 도심 접근성 프리미엄으로 자주 거론됩니다. 다만 역 접근성은 단지 위치와 출입구 방향에 따라 체감이 달라집니다.",
    badge: "추정",
  },
  {
    title: "아현·염리 재개발축",
    body: "아현뉴타운과 염리 재개발 완료 이후 신축 대단지가 공급되면서 마포 가격 축이 변화했습니다. 신축 브랜드 선호가 가격에 반영되는 경향이 있지만, 신축이라는 이유만으로 가격이 지속 상승한다고 단정할 수 없습니다.",
    badge: "추정",
  },
  {
    title: "한강 접근성과 상암 업무지구",
    body: "용강·도화 생활권의 한강 접근성과 상암동 DMC 업무지구 인접성은 각각 다른 수요를 만듭니다. 한강변이라는 이유만으로 가격이 보장되지 않으며, 동·층·향에 따라 실제 조망 차이가 큽니다.",
    badge: "추정",
  },
  {
    title: "후보값은 국토부 재확인 전 단계",
    body: "이 리포트의 모든 가격은 설계 단계 후보값입니다. 실제 배포 전에는 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일, 취소 거래 여부를 반드시 재확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const MAPAP_METHOD: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하고, 84㎡ 거래가 부족한 경우 면적을 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "상승률(추정)은 평가차익을 최근 5년 저점 참고가로 나눈 값으로, 실제 투자 수익률이 아닙니다.",
  "세금, 중개보수, 대출이자, 보유세, 양도소득세, 수리비는 모두 제외했습니다.",
  "거래 건수가 적은 단지는 평균 시세가 아니라 대표 거래 사례로 읽어야 합니다.",
];

export const MAPAP_RISKS: string[] = [
  "같은 단지라도 동·층·향·조망·수리 상태에 따라 가격 차이가 크게 납니다.",
  "신축 단지는 거래 건수가 적어 한 건의 거래가 기준가처럼 보일 수 있으므로 주의가 필요합니다.",
  "공덕역 접근성이나 한강 조망이 가격을 보장한다는 식의 단정은 실제 거래 데이터와 다를 수 있습니다.",
  "금리, DSR, 취득세, 종부세, 양도세 규정 변화는 실제 매수 부담을 크게 바꿉니다.",
  "신축과 구축을 같은 기준으로 직접 비교하면 연식 차이가 반영되지 않아 해석이 왜곡될 수 있습니다.",
  "이 리포트의 모든 수치는 설계 단계 후보값으로, 실제 의사결정 전 국토부 원자료를 반드시 확인해야 합니다.",
];

export const MAPAP_FAQ: MapoFaqItem[] = [
  {
    question: "마포 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "마포 아파트는 왜 비싼가요?",
    answer:
      "광화문, 여의도, 용산 접근성이 좋고 공덕 환승축, 아현·염리 재개발축, 한강 접근성, 상암 업무지구 수요가 함께 작용합니다. 다만 단지별 입주연식과 역 접근성에 따라 가격 차이가 큽니다.",
  },
  {
    question: "마포래미안푸르지오가 마포에서 가장 비싼 아파트인가요?",
    answer:
      "특정 단지가 항상 가장 비싸다고 단정할 수 없습니다. 거래 시점, 면적, 동·층·향, 실거래 건수에 따라 순위가 바뀔 수 있으므로 최신 실거래가 기준으로 다시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "공덕권과 상암권은 같이 비교해도 되나요?",
    answer:
      "둘 다 마포구에 속하지만 가격 논리는 다릅니다. 공덕권은 도심·여의도 환승 접근성이 강하고, 상암권은 DMC 업무지구와 대단지 생활권 성격이 강하므로 생활권을 나눠 봐야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 마포 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const MAPAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·왕십리·옥수·금호 생활권 주요 단지의 가격 변화를 비교합니다.",
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
    href: "/reports/gangnam-apartment-price-2026/",
    label: "강남 대장 아파트 Top10",
    description: "강남 주요 단지의 실거래가와 재건축·학군 프리미엄을 비교합니다.",
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

export const MAPAP_SEO_INTRO: string[] = [
  "마포 아파트 실거래가를 볼 때 가장 먼저 구분해야 할 것은 생활권입니다. 아현·공덕권의 도심 환승 접근성, 대흥·염리권의 신축 재개발축, 상암·DMC권의 업무지구 인접성, 용강·도화권의 한강 접근성은 가격을 만드는 논리가 서로 다릅니다.",
  "이 리포트는 마포래미안푸르지오, 공덕자이, 마포프레스티지자이, 신촌그랑자이 등 Top10 후보를 같은 표에 놓고 최근 기준가와 최근 5년 저점 참고가를 비교합니다. 다만 모든 값은 설계 단계 후보값으로 국토교통부 실거래가 공개시스템에서 재확인이 필요합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도소득세, 대출이자, 수리비를 제외한 단순 시세 차이입니다. 그래서 모든 차익성 수치는 평가차익(추정)으로 표기했습니다.",
  "마포는 강남 대체지가 아니라 도심 접근성, 공덕 환승축, 여의도·용산·광화문 접근성이라는 독자적인 수요로 읽어야 합니다. 신축 브랜드 선호, 재개발 완료 이후 생활환경, 한강 조망 가능 여부가 가격에 함께 작용하지만 어느 하나로 단정하면 안 됩니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 관심 단지를 고른 뒤에는 최신 실거래가 원문, 취소 거래 여부, 매물 호가, 대출 조건, 세금, 관리비, 실거주 동선을 함께 확인해야 합니다.",
];

export const MAPAP_SEO_CRITERIA: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하되, 다른 면적은 화면에 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "모든 가격 데이터는 설계 단계 후보값으로, 배지를 통해 원자료 재확인 필요성을 표시했습니다.",
  "서울특별시 마포구 행정구역 기준을 유지하며, 생활권 분류는 주거 수요와 접근성 축을 기준으로 했습니다.",
  "이 리포트는 매수 추천이 아니라 실거래가 기준 비교 참고자료입니다.",
];
