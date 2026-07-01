export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type HanamMisaAreaGroup =
  | "미사역권"
  | "망월천·한강공원권"
  | "감일권"
  | "위례 하남권"
  | "덕풍·신장권";

export interface HanamMisaApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface HanamMisaApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: HanamMisaAreaGroup;
  legalDongLabel:
    | "망월동"
    | "풍산동"
    | "선동"
    | "미사동"
    | "감이동"
    | "학암동"
    | "덕풍동"
    | "신장동"
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
  jeonsePriceManwon?: number;
  jeonseRatio?: number;
  tradeCountNote: string;
  badge: DataBadge;
  note: string;
}

export interface HanamMisaApartmentViewRow extends HanamMisaApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface HanamMisaAreaCard {
  areaGroup: HanamMisaAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface HanamMisaContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface HanamMisaFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const HMAP_META: HanamMisaApartmentMeta = {
  slug: "hanam-misa-apartment-price-2026",
  title: "하남·미사 대장 아파트 Top10 2026",
  seoTitle: "하남·미사 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "미사강변센트럴자이, 미사강변푸르지오, 미사강변리버뷰자이 등 하남·미사 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 미사역·망월천·한강공원·감일·위례 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-07-01",
  dataAsOf: "2026년 7월 설계 단계 후보값",
  notice:
    "이 페이지의 가격은 하남·미사 주요 단지 비교 화면을 구현하기 위한 후보값입니다. 발행 전 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 다시 확인해야 합니다.",
};

const rawApartments: HanamMisaApartmentRow[] = [
  {
    id: "misa-central-xi",
    rank: 1,
    complexName: "미사강변센트럴자이",
    complexNameOfficial: "미사강변센트럴자이",
    areaGroup: "미사역권",
    legalDongLabel: "망월동",
    addressLabel: "하남시 망월동·미사강변도시",
    supplyYear: 2015,
    householdCount: 1394,
    mainAreaLabel: "전용 96㎡ (37평)",
    stationLabel: "미사역(5호선) 접근",
    riverNote: "미사강변도시 중심 상업권",
    commuteNote: "강동·잠실 접근",
    latestTradePriceManwon: 163000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "96㎡ (중층 기준)",
    previousYearPriceManwon: 143000,
    previousYearPeriod: "2025년 10~11월 거래 참고",
    fiveYearLowPriceManwon: 80000,
    fiveYearLowDate: "2023년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "96㎡",
    jeonsePriceManwon: 58000,
    jeonseRatio: 35.6,
    tradeCountNote: "2026년 5~6월 중층 16~17억 범위 확인. 2025년 하반기 13.5~15.3억 대비 상승. 5년 최저(2022~2024년)는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값(96㎡). 저층·고층 가격 편차가 있으며 동·향도 함께 확인해야 합니다.",
  },
  {
    id: "misa-riverside-prugio",
    rank: 2,
    complexName: "미사강변푸르지오",
    complexNameOfficial: "미사강변푸르지오",
    areaGroup: "망월천·한강공원권",
    legalDongLabel: "망월동",
    addressLabel: "하남시 망월동·망월천 생활권",
    supplyYear: 2014,
    householdCount: 2066,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "미사역(5호선) 인접",
    riverNote: "망월천·한강공원 접근",
    commuteNote: "강동 접근",
    latestTradePriceManwon: 142000,
    latestTradeDate: "2026년 3~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 122000,
    previousYearPeriod: "2025년 9월 거래 참고",
    fiveYearLowPriceManwon: 76000,
    fiveYearLowDate: "2023년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 55000,
    jeonseRatio: 38.7,
    tradeCountNote: "2026년 중층 14~15.4억 범위 확인. 2025년 하반기 중층 12~12.5억 대비 상승. 5년 최저(2022~2024년)는 추가 원문 확인 필요.",
    badge: "공식",
    note: "망월천과 한강공원 수변 생활권이 수요 요인으로 작용할 수 있습니다. 강변 조망 여부에 따라 동·호 차이가 큽니다.",
  },
  {
    id: "misa-riverview-xi",
    rank: 3,
    complexName: "미사강변리버뷰자이",
    complexNameOfficial: "미사강변리버뷰자이",
    areaGroup: "망월천·한강공원권",
    legalDongLabel: "망월동",
    addressLabel: "하남시 망월동·한강공원 인접",
    supplyYear: 2015,
    householdCount: 822,
    mainAreaLabel: "전용 91㎡",
    stationLabel: "미사역(5호선) 접근",
    riverNote: "한강공원·망월천 조망권",
    commuteNote: "강동·강남 접근",
    latestTradePriceManwon: 120000,
    latestTradeDate: "2025년 12월~2026년 1월",
    latestTradeArea: "91㎡ (중층 기준)",
    previousYearPriceManwon: 117000,
    previousYearPeriod: "2025년 10월 거래 참고",
    fiveYearLowPriceManwon: 84100,
    fiveYearLowDate: "2023년 1월",
    fiveYearLowArea: "91㎡ (등기)",
    jeonsePriceManwon: 56000,
    jeonseRatio: 46.7,
    tradeCountNote: "2025년 12월~2026년 1월 12~12.5억 등기 확인. 직거래(26년 5월 10.5억, 4월 7.55억) 제외. 5년 최저 2023년 1월 8.41억 등기 확인.",
    badge: "공식",
    note: "강변 조망 선호 수요와 자이 브랜드 인지도가 가격에 반영될 수 있습니다. 조망 여부에 따른 동·호 차이를 확인해야 합니다.",
  },
  {
    id: "misa-riverforest-shapir",
    rank: 4,
    complexName: "미사강변더샵리버포레",
    complexNameOfficial: "미사강변더샵리버포레",
    areaGroup: "망월천·한강공원권",
    legalDongLabel: "망월동",
    addressLabel: "하남시 망월동·미사강변도시",
    supplyYear: 2015,
    householdCount: 592,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "미사역(5호선) 접근",
    riverNote: "망월천·한강 수변 생활권",
    commuteNote: "강동 접근",
    latestTradePriceManwon: 122000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 107000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 73000,
    fiveYearLowDate: "2023년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 53000,
    jeonseRatio: 43.4,
    tradeCountNote: "소규모 단지로 거래 건수가 적습니다. 단일 거래를 평균가처럼 해석하면 안 됩니다.",
    badge: "확인 필요",
    note: "거래 건수가 적어 단일 거래가 시세를 과대·과소 표현할 수 있습니다. 공식 단지명을 국토부에서 재확인해야 합니다.",
  },
  {
    id: "misa-emco-centerial",
    rank: 5,
    complexName: "미사강변엠코센트리엘",
    complexNameOfficial: "확인 필요",
    areaGroup: "미사역권",
    legalDongLabel: "망월동",
    addressLabel: "하남시 망월동·미사역 생활권",
    supplyYear: 2014,
    householdCount: 1096,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "미사역(5호선) 접근",
    riverNote: "미사역 상업지구 인접",
    commuteNote: "강동·잠실 접근",
    latestTradePriceManwon: 118000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 104000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 70000,
    fiveYearLowDate: "2023년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 50000,
    jeonseRatio: 42.4,
    tradeCountNote: "단지명·공식명 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "미사역 접근성과 상업지구 편의성이 가격 요인으로 작용할 수 있습니다. 공식 단지명을 먼저 확인해야 합니다.",
  },
  {
    id: "gamil-sweet-city",
    rank: 6,
    complexName: "하남감일스윗시티",
    complexNameOfficial: "확인 필요",
    areaGroup: "감일권",
    legalDongLabel: "감이동",
    addressLabel: "하남시 감이동·감일지구",
    supplyYear: 2020,
    householdCount: 1600,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "송파·위례 접근",
    riverNote: "감일지구 신도시형 단지",
    commuteNote: "강남·송파 접근",
    latestTradePriceManwon: 108000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 95000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 65000,
    fiveYearLowDate: "2023년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 47000,
    jeonseRatio: 43.5,
    tradeCountNote: "감일권 대표 후보로 공식 단지명 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "감일지구는 미사강변도시와 생활권이 다릅니다. 송파·위례 접근성이 가격에 더 크게 반영될 수 있습니다.",
  },
  {
    id: "gamil-prugio",
    rank: 7,
    complexName: "감일푸르지오마크베르",
    complexNameOfficial: "감일푸르지오마크베르",
    areaGroup: "감일권",
    legalDongLabel: "감이동",
    addressLabel: "하남시 감이동·감일지구",
    supplyYear: 2021,
    householdCount: 2156,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "위례·송파 생활권",
    riverNote: "신도시형 신축 단지",
    commuteNote: "강남·잠실 접근",
    latestTradePriceManwon: 140000,
    latestTradeDate: "2026년 3~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 120000,
    previousYearPeriod: "2025년 9~10월 거래 참고",
    fiveYearLowPriceManwon: 99000,
    fiveYearLowDate: "2023년 10월 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 46000,
    jeonseRatio: 32.9,
    tradeCountNote: "2026년 3~6월 중층 14~14.3억, 저층 13.3억 확인. 2025년 9~10월 11.2~12.4억 대비 상승. 5년 최저 2023년 10월 9.9억 (추가 원문 확인 필요).",
    badge: "공식",
    note: "신축 단지로 입주 초반 거래 데이터가 적을 수 있습니다. 단지명과 면적을 국토부에서 재확인해야 합니다.",
  },
  {
    id: "wiryeo-hanam-central",
    rank: 8,
    complexName: "위례중흥S클래스",
    complexNameOfficial: "위례중흥S클래스",
    areaGroup: "위례 하남권",
    legalDongLabel: "학암동",
    addressLabel: "하남시 학암동·위례 하남권",
    supplyYear: 2020,
    householdCount: 1400,
    mainAreaLabel: "전용 101㎡ (38평)",
    stationLabel: "위례신사선(예정)·송파 접근",
    riverNote: "위례 생활권 인접",
    commuteNote: "송파·강남 접근",
    latestTradePriceManwon: 149000,
    latestTradeDate: "2026년 2~3월",
    latestTradeArea: "101㎡ (중층 기준)",
    previousYearPriceManwon: 141500,
    previousYearPeriod: "2025년 10~11월 거래 참고",
    fiveYearLowPriceManwon: 100500,
    fiveYearLowDate: "2024년 5월 (2023년 저점 추가 확인 필요)",
    fiveYearLowArea: "101㎡ (등기)",
    jeonsePriceManwon: 43000,
    jeonseRatio: 28.9,
    tradeCountNote: "2026년 3월 11층 14.9억, 2월 4층 15.8억 등기 확인. 2025년 10~11월 13.9~14.15억 대비 상승. 5년 최저는 2024년 5월 10.05억 확인 (2023년 추가 확인 필요).",
    badge: "공식",
    note: "위례신사선 계획이 있지만 확정되지 않은 변수입니다. 위례 생활권과 하남 행정구역의 중첩을 고려해야 합니다.",
  },
  {
    id: "deokpung-raemian",
    rank: 9,
    complexName: "하남 래미안",
    complexNameOfficial: "확인 필요",
    areaGroup: "덕풍·신장권",
    legalDongLabel: "덕풍동",
    addressLabel: "하남시 덕풍동·하남 원도심",
    supplyYear: 2008,
    householdCount: 900,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 동부축 접근",
    riverNote: "하남 원도심 생활권",
    commuteNote: "강동 접근",
    latestTradePriceManwon: 75000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 65000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 45000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 34000,
    jeonseRatio: 45.3,
    tradeCountNote: "원도심 구축 단지로 공식 단지명 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "덕풍·신장 원도심은 미사 신축과 입주연식·생활권이 다릅니다. 직접 가격 비교 시 주의가 필요합니다.",
  },
  {
    id: "hanam-central-prugio",
    rank: 10,
    complexName: "하남 센트럴 푸르지오",
    complexNameOfficial: "확인 필요",
    areaGroup: "덕풍·신장권",
    legalDongLabel: "신장동",
    addressLabel: "하남시 신장동·하남시청 인근",
    supplyYear: 2010,
    householdCount: 780,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "5호선 하남시청역 접근",
    riverNote: "하남 원도심 생활권",
    commuteNote: "강동·구리 접근",
    latestTradePriceManwon: 70000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 62000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 42000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 32000,
    jeonseRatio: 45.7,
    tradeCountNote: "원도심 후보로 공식 단지명 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "5호선 하남시청역 접근성이 있지만 미사강변도시와 생활권이 다릅니다. 입주연식과 생활 편의 시설 차이를 확인해야 합니다.",
  },
];

export const HMAP_APARTMENTS: HanamMisaApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const HMAP_AREA_CARDS: HanamMisaAreaCard[] = [
  {
    areaGroup: "미사역권",
    title: "미사역권",
    description: "5호선 미사역, 상업지구, 업무·생활 편의 접근성이 가격에 반영됩니다.",
    priceInterpretation: "미사강변도시 내 역 접근성과 상업지구 편의성을 함께 봅니다.",
    caution: "역 접근성이 가격을 보장하지 않습니다. 동·층·향에 따른 차이를 확인해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "망월천·한강공원권",
    title: "망월천·한강공원권",
    description: "수변 생활권, 산책·공원 선호, 미사강변도시 이미지가 함께 작용합니다.",
    priceInterpretation: "조망·수변 선호 수요가 가격에 반영될 수 있지만 동·층·향에 따라 차이가 큽니다.",
    caution: "한강공원 조망은 동·호 위치에 따라 크게 달라집니다. 직접 확인이 필요합니다.",
    badge: "추정",
  },
  {
    areaGroup: "감일권",
    title: "감일권",
    description: "송파·위례 접근성, 신도시형 신축 단지 수요가 가격을 만듭니다.",
    priceInterpretation: "미사와 생활권이 다르므로 미사 단지와 직접 비교 시 주의가 필요합니다.",
    caution: "감일은 하남시 행정구역이지만 위례·송파 생활권에 더 가깝게 해석되는 경우가 많습니다.",
    badge: "추정",
  },
  {
    areaGroup: "위례 하남권",
    title: "위례 하남권",
    description: "위례 생활권과 하남 행정구역이 중첩되는 지역으로, 생활권 해석에 주의가 필요합니다.",
    priceInterpretation: "위례신사선 계획은 확정되지 않은 변수로, 가격에 선반영 여부를 판단해야 합니다.",
    caution: "위례 생활권으로 보느냐 하남 생활권으로 보느냐에 따라 비교 기준이 달라집니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "덕풍·신장권",
    title: "덕풍·신장권",
    description: "하남 원도심, 5호선 동부축, 상대적으로 낮은 가격 접근성을 가집니다.",
    priceInterpretation: "미사 신축보다 가격이 낮지만 실거주 논리와 생활권이 다릅니다.",
    caution: "미사 신축과 입주연식·생활권·편의시설 차이를 함께 표시해야 합니다.",
    badge: "추정",
  },
];

export const HMAP_CONTEXT: HanamMisaContextCard[] = [
  {
    title: "하남·미사는 단일 생활권이 아닙니다",
    body: "미사강변도시, 감일, 위례 하남권, 덕풍·신장 원도심은 가격을 만드는 이유가 다릅니다. 같은 하남시 안에서도 5호선 접근성, 입주연식, 수변 접근성에 따라 가격 차이가 크게 납니다.",
    badge: "추정",
  },
  {
    title: "5호선 하남선이 핵심 교통 변수입니다",
    body: "미사역·하남풍산역·하남시청역·하남검단산역 4개 역이 강동구와 연결됩니다. 역 접근성은 가격에 영향을 줄 수 있는 요인이지만 역 거리가 가격을 보장하지는 않습니다.",
    badge: "추정",
  },
  {
    title: "한강공원·망월천은 생활권 가산 요인입니다",
    body: "미사강변도시의 한강공원과 망월천 수변 생활권은 선호 수요를 만듭니다. 다만 조망권은 동·호 위치에 따라 차이가 크므로 단지 전체 평균처럼 해석하면 안 됩니다.",
    badge: "추정",
  },
  {
    title: "감일·위례는 별도 생활권으로 봐야 합니다",
    body: "감일지구와 위례 하남권은 하남시 행정구역에 포함되지만 미사강변도시와 생활권이 다릅니다. 두 권역을 직접 비교하면 실거주 판단이 왜곡될 수 있습니다.",
    badge: "확인 필요",
  },
];

export const HMAP_METHOD: string[] = [
  "경기도 하남시 행정구역을 기준으로 후보 단지를 정리했습니다.",
  "최근 기준가는 전용 84㎡를 우선 사용하고, 유사 면적은 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "세금, 중개보수, 보유세, 대출이자, 양도소득세, 수리비는 모두 제외했습니다.",
  "현재 값은 설계 단계 후보값으로, 발행 전 국토교통부 실거래가 공개시스템에서 재검증해야 합니다.",
];

export const HMAP_RISKS: string[] = [
  "미사강변도시 가격을 하남시 전체 평균처럼 해석하면 실제 생활권 판단이 왜곡됩니다.",
  "같은 단지라도 동·층·향·조망·수리 상태에 따라 가격 차이가 큽니다.",
  "위례신사선 등 교통 계획은 확정값이 아닙니다. 선반영 여부를 별도로 판단해야 합니다.",
  "감일·위례 하남권은 미사강변도시와 생활권이 달라 직접 비교 시 주의해야 합니다.",
  "금리, DSR, 취득세, 보유세, 양도세 조건은 실제 부담 가능성을 크게 바꿉니다.",
];

export const HMAP_FAQ: HanamMisaFaqItem[] = [
  {
    question: "하남·미사 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "미사 아파트는 왜 주목받나요?",
    answer:
      "5호선 하남선, 강동·잠실 접근성, 미사강변도시의 신축 대단지, 한강공원과 망월천 생활권, 상업지구 접근성이 함께 작용합니다. 다만 단지별 역 접근성과 입주연식에 따라 가격 차이가 큽니다.",
  },
  {
    question: "미사와 감일, 위례를 같이 비교해도 되나요?",
    answer:
      "같은 하남시에 포함될 수 있지만 생활권이 다릅니다. 미사는 5호선·한강공원·강동 접근성이 강하고, 감일·위례는 송파·위례 생활권과 더 가깝게 해석되는 경우가 많습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "5호선 역세권이면 가격이 보장되나요?",
    answer:
      "아닙니다. 역 접근성은 가격에 영향을 줄 수 있는 요인일 뿐입니다. 금리, 대출 규제, 전세 시장, 단지 상태, 거래 시점에 따라 가격은 달라질 수 있습니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 하남·미사 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const HMAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gangdong-apartment-price-2026/",
    label: "강동 대장 아파트 Top10",
    description: "고덕·상일·둔촌 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "신도시형 고가 주거지의 실거래가와 최저가 대비 변화를 비교합니다.",
  },
  {
    href: "/reports/suwon-yeongtong-apartment-price-2026/",
    label: "수원 영통 대장 아파트 Top10",
    description: "수원 영통구 주요 단지의 실거래가와 최저가 대비 평가차익을 비교합니다.",
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

export const HMAP_SEO_INTRO: string[] = [
  "하남·미사 아파트 실거래가를 볼 때는 먼저 생활권을 나눠야 합니다. 미사역권, 망월천·한강공원권, 감일권, 위례 하남권, 덕풍·신장 원도심은 가격을 만드는 이유가 서로 다릅니다.",
  "이 리포트는 미사강변센트럴자이, 미사강변푸르지오, 미사강변리버뷰자이 등 검색 수요가 강한 후보를 같은 표로 비교합니다. 다만 현재 값은 설계 단계 후보값이므로 발행 전 국토교통부 실거래가 공개시스템에서 재검증해야 합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도소득세, 대출이자, 수리비를 제외한 단순 시세 차이입니다. 그래서 모든 차익성 수치는 평가차익(추정)으로 표시했습니다.",
  "하남시는 미사강변도시, 감일, 위례 하남권, 덕풍·신장 원도심의 가격 논리가 다릅니다. 같은 하남시 안에서도 5호선 접근성, 서울 접근성, 입주연식, 단지 규모, 수변 접근성에 따라 가격 차이가 크게 나타날 수 있습니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 관심 단지를 고른 뒤 최신 실거래가 원문, 취소 거래 여부, 매물 호가, 대출 조건, 세금, 관리비, 실거주 동선을 함께 확인해야 합니다.",
];

export const HMAP_SEO_CRITERIA: string[] = [
  "경기도 하남시 행정구역과 생활권 분류를 함께 표시했습니다.",
  "최근 기준가는 전용 84㎡를 우선 사용하되, 유사 면적은 화면에 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "미사·감일·위례 하남권은 생활권이 다르므로 직접 비교 시 주의해야 합니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 단지명과 거래월을 다시 확인해야 합니다.",
];
