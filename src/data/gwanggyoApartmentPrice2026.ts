export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type GwanggyoAreaGroup =
  | "호수공원권"
  | "광교중앙역권"
  | "상현역권"
  | "신대역권"
  | "업무지구권"
  | "광교 인접";

export interface GwanggyoApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  cityLabel: string;
  areaGroup: GwanggyoAreaGroup;
  addressLabel: string;
  mainAreaLabel: string;
  stationLabel?: string;
  parkLabel?: string;
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

export interface GwanggyoAreaCard {
  areaGroup: GwanggyoAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GwanggyoContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GwanggyoFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

function withGain(
  row: Omit<GwanggyoApartmentRow, "estimatedGainManwon" | "estimatedGainRate">
): GwanggyoApartmentRow {
  const gain = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  return {
    ...row,
    estimatedGainManwon: gain,
    estimatedGainRate: Math.round((gain / row.fiveYearLowPriceManwon) * 1000) / 10,
  };
}

export const GDAP_META = {
  slug: "gwanggyo-apartment-price-2026",
  title: "광교 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나",
  seoTitle: "광교 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나",
  description:
    "광교자연앤힐스테이트와 광교중흥S클래스 등 광교 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 호수공원·신분당선·업무지구 프리미엄과 데이터 기준도 함께 확인하세요.",
  updatedAt: "2026년 6월",
  dataAsOf: "2026년 6월 기준 아실·국토교통부 실거래가 공개시스템",
  notice:
    "국토교통부 실거래가 공개시스템 기준 최신 매매 거래를 반영했으며, 단지별 층·향·동에 따라 실제 가격 차이가 클 수 있습니다.",
};

export const GDAP_APARTMENTS: GwanggyoApartmentRow[] = [
  withGain({
    id: "janyeon-hillstate",
    rank: 1,
    complexName: "광교자연앤힐스테이트",
    complexNameOfficial: "광교자연앤힐스테이트",
    cityLabel: "수원시 영통구",
    areaGroup: "광교중앙역권",
    addressLabel: "이의동 · 신분당선 광교중앙역권",
    mainAreaLabel: "전용 84㎡",
    stationLabel: "신분당선 광교중앙역 도보권",
    latestTradePriceManwon: 190000,
    latestTradeDate: "2026년 6월",
    latestTradeArea: "전용 84㎡",
    previousYearPriceManwon: 169000,
    previousYearPeriod: "2025년 하반기",
    fiveYearLowPriceManwon: 115000,
    fiveYearLowDate: "2022년 하반기 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    jeonseRatio: 52,
    tradeCountNote: "거래 건수 많음. 월별 다수 거래 확인됨. 직거래·특이 거래 제외 기준.",
    badge: "보도 기반",
    note: "2026년 5~6월 중층(14~41층) 대표 거래 기준 약 17억~19억 3천 범위. 최고 19억 7천(24층, 2026.06). 저층(3~8층) 제외 중층 이상 대표값으로 19억 적용. 5년 저점은 추정치이며 국토교통부 원문 재확인 필요.",
  }),
  withGain({
    id: "jungheung-s-class",
    rank: 2,
    complexName: "광교중흥S클래스",
    complexNameOfficial: "광교중흥S클래스",
    cityLabel: "수원시 영통구",
    areaGroup: "호수공원권",
    addressLabel: "이의동 · 광교호수공원 인근",
    mainAreaLabel: "전용 84㎡",
    parkLabel: "광교호수공원 인접",
    latestTradePriceManwon: 176000,
    latestTradeDate: "2026년 6월",
    latestTradeArea: "전용 84㎡",
    previousYearPriceManwon: 164000,
    previousYearPeriod: "2025년 하반기",
    fiveYearLowPriceManwon: 112000,
    fiveYearLowDate: "2022년 하반기 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    jeonseRatio: 51,
    tradeCountNote: "거래 건수 많음. 월별 다수 거래 확인됨. 직거래(2025.10, 12.5억) 제외 기준.",
    badge: "보도 기반",
    note: "2026년 5~6월 중층(13~41층) 대표 거래 기준 약 16.9억~18억 3천 범위. 최고 18억 6천(42층, 2026.06). 직거래(2025.10, 12억 5천) 제외. 저층(9층 이하) 제외 중층 이상 대표값으로 17억 6천 적용. 5년 저점 추정치.",
  }),
  withGain({
    id: "ipark-lake",
    rank: 3,
    complexName: "광교호수공원아이파크",
    complexNameOfficial: "광교아이파크",
    cityLabel: "수원시 영통구",
    areaGroup: "호수공원권",
    addressLabel: "이의동 · 광교호수공원 인근",
    mainAreaLabel: "전용 84㎡",
    parkLabel: "광교호수공원 인접",
    latestTradePriceManwon: 168000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 106000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "단지 내 타입 혼재 여부 확인 필요. 거래 건수 적을 수 있음. 구현 전 원문 재확인 필수.",
    badge: "확인 필요",
    note: "호수공원 인접 단지. 층·조망에 따라 가격 차이가 클 수 있습니다. 원문 재확인 필요.",
  }),
  withGain({
    id: "gwanggyo-thesharp",
    rank: 4,
    complexName: "광교더샵",
    complexNameOfficial: "광교더샵",
    cityLabel: "수원시 영통구",
    areaGroup: "광교중앙역권",
    addressLabel: "이의동 · 신분당선 광교중앙역권",
    mainAreaLabel: "전용 84㎡ 추정",
    stationLabel: "신분당선 광교중앙역 도보권",
    latestTradePriceManwon: 158000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 100000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "구현 전 국토교통부 원문으로 거래 건수·가격 재확인 필요.",
    badge: "확인 필요",
    note: "광교중앙역 인근 역세권 단지. 실거래 원문 재확인 필요.",
  }),
  withGain({
    id: "gwanggyo-centralview",
    rank: 5,
    complexName: "광교센트럴뷰",
    complexNameOfficial: "광교센트럴뷰",
    cityLabel: "수원시 영통구",
    areaGroup: "광교중앙역권",
    addressLabel: "이의동 · 광교중앙역권",
    mainAreaLabel: "전용 84㎡ 추정",
    stationLabel: "신분당선 광교중앙역 인근",
    latestTradePriceManwon: 152000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 96000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "구현 전 국토교통부 원문으로 거래 건수·가격 재확인 필요.",
    badge: "확인 필요",
    note: "역세권·상업 인프라 중심 단지. 실거래 원문 재확인 필요.",
  }),
  withGain({
    id: "gwanggyo-raemian",
    rank: 6,
    complexName: "래미안광교",
    complexNameOfficial: "래미안광교",
    cityLabel: "용인시 수지구",
    areaGroup: "상현역권",
    addressLabel: "상현동 · 신분당선 상현역권",
    mainAreaLabel: "전용 84㎡ 추정",
    stationLabel: "신분당선 상현역권",
    latestTradePriceManwon: 142000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 90000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "용인시 수지구 행정구역. 광교 생활권 겹침. 구현 전 원문 재확인 필요.",
    badge: "확인 필요",
    note: "행정구역은 용인시 수지구이나 광교 생활권과 겹치는 단지. 수지 아파트 리포트와 함께 확인하는 편이 더 정확합니다.",
  }),
  withGain({
    id: "gwanggyo-xi",
    rank: 7,
    complexName: "광교상록자이",
    complexNameOfficial: "광교상록자이",
    cityLabel: "수원시 영통구",
    areaGroup: "광교 인접",
    addressLabel: "하동 · 광교 인접",
    mainAreaLabel: "전용 84㎡ 추정",
    latestTradePriceManwon: 136000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 86000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "광교 인접 구축·준신축 단지. 구현 전 원문 재확인 필요.",
    badge: "확인 필요",
    note: "광교 생활권 인접 단지. 입주연식·역 접근성 차이를 주의해야 합니다. 실거래 원문 재확인 필요.",
  }),
  withGain({
    id: "epenji-gwanggyo",
    rank: 8,
    complexName: "e편한세상광교",
    complexNameOfficial: "e편한세상광교",
    cityLabel: "용인시 수지구",
    areaGroup: "상현역권",
    addressLabel: "상현동 · 상현역권",
    mainAreaLabel: "전용 84㎡ 추정",
    stationLabel: "신분당선 상현역",
    latestTradePriceManwon: 132000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 83000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "용인시 수지구 행정구역. 상현역 접근성 단지. 구현 전 원문 재확인 필요.",
    badge: "확인 필요",
    note: "상현역권으로 수지구 행정구역. 광교 생활권과 겹칩니다. 실거래 원문 재확인 필요.",
  }),
  withGain({
    id: "gwanggyo-hillstate",
    rank: 9,
    complexName: "광교힐스테이트",
    complexNameOfficial: "광교힐스테이트",
    cityLabel: "수원시 영통구",
    areaGroup: "신대역권",
    addressLabel: "영통구 · 광교신대역권",
    mainAreaLabel: "전용 84㎡ 추정",
    stationLabel: "광교(경기대)역 인근",
    latestTradePriceManwon: 126000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 80000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "신대역권 단지. 구현 전 국토교통부 원문으로 가격·면적 재확인 필요.",
    badge: "확인 필요",
    note: "신대역·호수공원 접근 단지. 실거래 원문 재확인 필요.",
  }),
  withGain({
    id: "gwanggyo-prugio-worldmark",
    rank: 10,
    complexName: "광교푸르지오월드마크",
    complexNameOfficial: "광교푸르지오월드마크",
    cityLabel: "수원시 영통구",
    areaGroup: "업무지구권",
    addressLabel: "이의동 · 광교 법조타운·업무지구",
    mainAreaLabel: "전용 84㎡ (면적 타입 혼재 — 구현 전 확인 필요)",
    latestTradePriceManwon: 118000,
    latestTradeDate: "2026년 상반기 추정",
    latestTradeArea: "전용 84㎡ 추정",
    fiveYearLowPriceManwon: 75000,
    fiveYearLowDate: "2022년 추정",
    fiveYearLowArea: "전용 84㎡ 추정",
    tradeCountNote: "업무지구 인접 단지. 면적 타입 혼재 여부 확인 필요. 구현 전 원문 재확인 필수.",
    badge: "확인 필요",
    note: "광교 법조타운·업무지구 인접. 면적 타입 혼재 여부와 오피스텔 거래 혼재 가능성을 확인해야 합니다.",
  }),
];

export const GDAP_AREA_CARDS: GwanggyoAreaCard[] = [
  {
    areaGroup: "호수공원권",
    title: "호수공원권",
    description:
      "광교호수공원 인접 단지군. 광교중흥S클래스·광교호수공원아이파크 등이 이 권역에 속합니다. 조망·생활 인프라 접근성이 가격에 반영되는 경우가 많습니다.",
    priceInterpretation:
      "조망층·고층은 중층 대비 수천만 원~수억 원 차이가 발생할 수 있습니다. 동·층·향에 따라 같은 단지 내에서도 가격 편차가 큽니다.",
    caution: "호수공원 조망 여부가 가격에 반영되지만, 모든 동·층에서 조망이 확보되지는 않습니다.",
    badge: "추정",
  },
  {
    areaGroup: "광교중앙역권",
    title: "광교중앙역권",
    description:
      "신분당선 광교중앙역 도보권 단지군. 광교자연앤힐스테이트·광교더샵·광교센트럴뷰 등이 이 권역에 속합니다. 강남·판교 접근성이 실거주 수요에 반영됩니다.",
    priceInterpretation:
      "역과의 실제 도보 거리와 동선에 따라 체감 접근성이 다릅니다. 같은 역세권이라도 도로 구조와 출구에 따라 실거주 편의가 달라질 수 있습니다.",
    caution: "지도상 거리와 실제 도보 동선은 다를 수 있습니다. 현장 확인 필요.",
    badge: "추정",
  },
  {
    areaGroup: "상현역권",
    title: "상현역권",
    description:
      "신분당선 상현역 인근 단지군. 행정구역상 용인시 수지구이나 광교 생활권과 겹치는 경우가 많습니다. 래미안광교·e편한세상광교 등이 이 권역에 속합니다.",
    priceInterpretation:
      "광교 생활권과 수지 학군을 함께 체감할 수 있지만, 수원·용인 경계 지역으로 행정구역 분류에 주의해야 합니다.",
    caution: "이 리포트는 광교 생활권 기준이며 행정구역순 순위가 아닙니다. 수지 리포트와 함께 확인하세요.",
    badge: "확인 필요",
  },
  {
    areaGroup: "신대역권",
    title: "신대역권",
    description:
      "광교(경기대)역 인근 단지군. 호수공원 접근성과 수원 생활 인프라를 함께 활용할 수 있는 위치입니다.",
    priceInterpretation:
      "호수공원권 대비 역 접근성 차이가 가격에 반영되는 경우가 있습니다. 단지별 실거래 확인 필요.",
    caution: "실거래 건수가 적을 수 있어 대표값 해석에 주의가 필요합니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "업무지구권",
    title: "업무지구권",
    description:
      "광교 법조타운·업무지구 인접 단지군. 광교푸르지오월드마크 등이 이 권역에 속합니다. 업무·상권 접근성이 수요 기반이 됩니다.",
    priceInterpretation:
      "업무지구 수요와 상업시설 접근성이 가격을 지지하는 경우가 있으나, 면적 타입 혼재 여부를 반드시 확인해야 합니다.",
    caution: "오피스텔·상업시설 거래가 혼재될 수 있으므로 국토교통부 원문에서 거래 유형 구분 필요.",
    badge: "확인 필요",
  },
];

export const GDAP_CONTEXT: GwanggyoContextCard[] = [
  {
    title: "광교호수공원과 신분당선",
    body: "광교는 국내 신도시 가운데 호수공원 규모가 큰 편에 속합니다. 신분당선 광교중앙역·상현역은 판교·강남 방향 직통 접근을 제공하며, 이 두 가지 요소가 실거주 선호의 핵심으로 자주 언급됩니다. 다만 역세권 단지가 모두 같은 접근성을 가지는 것은 아니며, 출구·동선 차이가 실제 이용 편의에 영향을 줍니다.",
    badge: "추정",
  },
  {
    title: "수원·용인 고소득 실거주 수요",
    body: "삼성전자·경기도 법조타운·IT기업 밀집 지역과의 근거리 접근성이 광교 실거주 수요 기반 중 하나로 언급됩니다. 고소득 직장인 수요가 전세가율 유지에 기여한다는 해석도 있으나, 직주근접 이익은 시기와 직장 위치에 따라 달라집니다.",
    badge: "추정",
  },
  {
    title: "행정구역과 생활권의 혼용",
    body: "광교신도시는 수원시 영통구(이의동·하동 등)와 용인시 수지구(상현동 일부)가 함께 생활권을 형성합니다. 검색 시 '광교'로 묶이더라도 행정구역에 따라 취득세 기준, 전입신고 등에 차이가 있을 수 있습니다. 이 리포트는 생활권 기준 비교이므로, 행정구역별 기준이 필요한 경우 원문을 직접 확인해야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "층·향·조망에 따른 가격 차이",
    body: "광교 단지들은 고층에서 호수공원 조망이 확보되는 동과 그렇지 않은 동이 혼재하는 경우가 많습니다. 같은 단지 84㎡라도 고층 조망층과 저층 내향 동의 거래가는 수억 원 차이가 날 수 있으며, 이 리포트의 단지별 기준가는 중층 대표값 중심입니다.",
    badge: "추정",
  },
];

export const GDAP_METHOD: string[] = [
  "최근 실거래가: 아실·국토교통부 실거래가 공개시스템 기준 2026년 5~6월 매매 거래. 직거래·특이 거래 제외.",
  "5년 저점: 2021~2026년 국토교통부 매매 실거래 최저값 기준. 자연앤힐스테이트·중흥S클래스는 아실 기준 확인, 나머지 단지는 추정값.",
  "평가차익(추정): 최근 기준가 − 5년 최저 실거래가. 취득세·중개보수·대출이자·양도세 미반영 단순 시세 차이.",
  "상승률(추정): 평가차익 ÷ 5년 저점 × 100. 복리·배당 등 금융 수익 개념과 다릅니다.",
  "전세가율: 최근 전세 실거래가 ÷ 최근 매매 기준가. 거래 건수 부족 단지는 생략 또는 참고 표기.",
  "배지 기준: '보도 기반'은 아실 등 공개 데이터 인용. '확인 필요'는 구현 전 임시 추정치로 국토교통부 원문 재확인 필수.",
];

export const GDAP_RISKS: string[] = [
  "층·향·조망 차이: 같은 단지 84㎡라도 호수공원 조망 고층과 저층 내향 동의 가격 차이가 수억 원에 달할 수 있습니다. 평균값으로 해석하면 안 됩니다.",
  "직거래 및 특이 거래: 직거래는 시세보다 현저히 낮은 경우가 있습니다. 이 리포트는 가능한 경우 직거래를 제외하고 일반 매매 기준을 적용했으나, 모든 경우에 검증되지 않았습니다.",
  "행정구역 혼재: 상현역권 단지는 용인시 수지구 행정구역으로 취득세·전입신고 기준이 수원시와 다를 수 있습니다.",
  "금리·대출 규제: 광교 단지 가격은 대출 한도와 금리 변화에 민감하게 반응할 수 있습니다. 현재 가격이 향후 유지된다는 보장이 없습니다.",
  "확인 필요 단지: 3~10위 단지는 실거래 원문 재확인 전 임시 추정값입니다. 이 데이터를 의사결정에 바로 활용하면 안 됩니다.",
  "5년 저점 추정 한계: 자연앤힐스테이트·중흥S클래스의 5년 저점도 2022년 저점 추정치로, 국토교통부 원문 검색으로 재확인이 필요합니다.",
];

export const GDAP_FAQ: GwanggyoFaqItem[] = [
  {
    question: "광교 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 호수공원·신분당선·업무지구 접근성, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "광교 생활권은 수원인가요, 용인인가요?",
    answer:
      "둘 다 섞여 검색되는 경우가 많습니다. 광교신도시는 수원시 영통구와 용인시 수지구 일부가 함께 생활권을 형성하므로, 이 리포트는 행정구역 순위가 아니라 광교 생활권 대표 단지 비교로 봐야 합니다.",
  },
  {
    question: "광교자연앤힐스테이트가 광교중흥S클래스보다 더 비싼가요?",
    answer:
      "2026년 6월 기준 아실 실거래가로는 자연앤힐스테이트 84㎡가 중흥S클래스 84㎡보다 최근 중층 거래가 기준 약 1억 원 이상 높게 나타납니다. 다만 두 단지의 위치·동·층에 따라 차이가 달라질 수 있으며, 중흥S클래스 고층은 더 높은 가격을 형성하기도 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "광교 아파트는 왜 비싼가요?",
    answer:
      "광교호수공원, 신분당선, 법조타운·업무지구, 수원·용인 고소득 실거주 수요, 신도시 인프라가 함께 가격을 지지합니다. 다만 단지별 조망과 역 접근성에 따라 가격 차이가 큽니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 호수공원 조망이나 희소성이 큰 단지는 전세가율이 낮아도 매매가가 높을 수 있습니다.",
  },
  {
    question: "지금 광교 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const GDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/",
    label: "동탄·분당·수지·영통 대장 아파트 비교",
    description: "경기 남부 주요 주거지의 84㎡ 가격대와 교통·학군·리스크를 비교합니다.",
  },
  {
    href: "/reports/dongtan-apartment-price-2026/",
    label: "동탄 대장 아파트 Top10",
    description: "GTX-A 이후 동탄 대표 단지의 실거래가와 최저가 대비 평가차익을 확인합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 대표 단지의 실거래가와 재건축 기대, 최저가 대비 평가차익을 확인합니다.",
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

export const GDAP_SEO_INTRO: string[] = [
  "광교 아파트 실거래가를 검색할 때 가장 먼저 혼동이 생기는 부분은 '광교가 수원인지 용인인지'입니다. 광교신도시는 수원시 영통구(이의동·하동 등)와 용인시 수지구 일부가 하나의 생활권으로 묶여 있어, 단지마다 행정구역이 다릅니다. 이 리포트는 행정구역 순위가 아니라 광교 생활권 대표 단지를 비교합니다.",
  "광교 아파트 가격에 영향을 주는 요인 중 가장 자주 언급되는 것은 광교호수공원과 신분당선입니다. 호수공원 조망층은 비조망층 대비 수천만 원~수억 원 차이가 나는 경우가 있으며, 신분당선 광교중앙역과 상현역은 판교·강남 방향 직통 접근을 제공해 실거주 수요를 끌어들이는 요소로 작용합니다.",
  "이 리포트의 평가차익(추정)은 최근 기준 실거래가에서 최근 5년 최저 실거래가를 뺀 단순 시세 차이입니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세는 반영되지 않으며, 실제 투자 수익이나 확정 수익으로 해석하면 안 됩니다.",
  "광교자연앤힐스테이트와 광교중흥S클래스의 2026년 6월 기준 실거래가는 아실·국토교통부 공개 데이터를 기반으로 반영했습니다. 나머지 단지는 구현 전 임시 추정값으로 국토교통부 실거래가 공개시스템에서 반드시 원문을 재확인해야 합니다.",
  "광교 단지별 가격 차이를 볼 때는 층·향·동·거래 시점을 함께 확인해야 합니다. 같은 단지 84㎡라도 고층 조망층과 저층 내향 동의 거래가 차이가 크며, 직거래·특이 거래는 일반 시세와 다를 수 있습니다. 이 리포트는 가능한 경우 직거래와 특이 거래를 제외한 일반 매매 중층 대표값을 사용합니다.",
];

export const GDAP_SEO_CRITERIA: string[] = [
  "이 리포트의 순위는 2026년 6월 기준 최근 실거래가 수준, 단지 인지도, 검색 수요, 생활권 대표성을 종합해 구성했습니다. 매수 추천 순위가 아닙니다.",
  "자연앤힐스테이트와 중흥S클래스의 5년 저점은 아실 데이터 기준 추정값으로, 2022년 하반기 시장 저점 시기를 반영했습니다. 국토교통부 원문으로 재확인이 필요합니다.",
  "상현역권 단지(래미안광교·e편한세상광교)는 행정구역상 용인시 수지구이나 광교 생활권과 겹치는 경우가 많아 이 리포트에 포함했습니다. 실거주 기준은 수지 아파트 리포트와 함께 확인하는 것을 권장합니다.",
  "전세가율은 최근 전세 실거래가가 충분한 경우에만 표시하며, 거래 건수가 부족한 단지는 '확인 필요'로 표기합니다.",
  "광교 단지들은 호수공원 조망과 신분당선 접근성에 따라 같은 단지 내에서도 가격 편차가 크게 나타납니다. 이 리포트의 기준가는 중층 대표값이며, 최고가나 최저가가 아닙니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
