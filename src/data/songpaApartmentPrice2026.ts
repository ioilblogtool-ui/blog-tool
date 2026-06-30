export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type SongpaAreaGroup =
  | "잠실·신천권"
  | "올림픽공원·방이권"
  | "가락·헬리오시티권"
  | "문정·장지권"
  | "재건축 기대권";

export interface SongpaApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SongpaApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SongpaAreaGroup;
  legalDongLabel: "잠실동" | "신천동" | "방이동" | "가락동" | "문정동" | "장지동" | "오금동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  parkNote?: string;
  redevelopmentNote?: string;
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

export interface SongpaApartmentViewRow extends SongpaApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface SongpaAreaCard {
  areaGroup: SongpaAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SongpaContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SongpaFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SPAP_META: SongpaApartmentMeta = {
  slug: "songpa-apartment-price-2026",
  title: "송파 대장 아파트 Top10 2026",
  seoTitle: "송파 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "잠실엘스, 리센츠, 트리지움, 파크리오, 헬리오시티 등 송파구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익(추정)을 비교합니다. 잠실·올림픽공원·가락·문정 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 설계 단계 후보값",
  notice:
    "이 페이지의 가격은 송파구 주요 단지 비교 화면을 구현하기 위한 후보값입니다. 발행 전 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 다시 확인해야 합니다.",
};

const rawApartments: SongpaApartmentRow[] = [
  {
    id: "jamsil-els",
    rank: 3,
    complexName: "잠실엘스",
    complexNameOfficial: "잠실엘스",
    areaGroup: "잠실·신천권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·잠실 대단지",
    supplyYear: 2008,
    householdCount: 5678,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "잠실새내·종합운동장 접근",
    parkNote: "한강·잠실종합운동장 생활권",
    latestTradePriceManwon: 330000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (32.5~34억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 310000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 205000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 150000,
    jeonseRatio: 45.5,
    tradeCountNote: "2026년 5~6월 84㎡ 실거래 32.5~34억 범위. 2월 신고가 37억 이후 조정된 수준.",
    badge: "확인 필요",
    note: "2026년 5~6월 84㎡ 실거래가 32.5~34억 범위입니다. 동·층·향과 거래 시점에 따라 1.5억 이상 편차가 발생합니다.",
  },
  {
    id: "ricenz",
    rank: 2,
    complexName: "리센츠",
    complexNameOfficial: "리센츠",
    areaGroup: "잠실·신천권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·잠실 대단지",
    supplyYear: 2008,
    householdCount: 5563,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "잠실새내역 접근",
    parkNote: "한강·잠실 상권 생활권",
    latestTradePriceManwon: 345000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (33~36억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 310000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 198000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 155000,
    jeonseRatio: 44.9,
    tradeCountNote: "2026년 5~6월 84㎡ 실거래 33~36억 범위. 고층·조망에 따라 2억 이상 편차 발생.",
    badge: "확인 필요",
    note: "2026년 5~6월 84㎡ 실거래가 33~36억 범위입니다. 잠실엘스보다 최근 가격이 소폭 높게 형성됩니다.",
  },
  {
    id: "trizium",
    rank: 4,
    complexName: "잠실 트리지움",
    complexNameOfficial: "트리지움",
    areaGroup: "잠실·신천권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·잠실역 생활권",
    supplyYear: 2007,
    householdCount: 3696,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "잠실역·잠실새내역 접근",
    parkNote: "잠실 상권·석촌호수 접근",
    latestTradePriceManwon: 315000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (30.3~32.5억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 310000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (30.5~32.3억)",
    fiveYearLowPriceManwon: 190000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 140000,
    jeonseRatio: 44.4,
    tradeCountNote: "2026년 5~6월 84㎡ 실거래 30.3~32.5억 범위. 저층·고층 편차 1~2억 발생.",
    badge: "확인 필요",
    note: "2026년 5~6월 84㎡ 실거래가 30.3~32.5억 범위입니다. 잠실역 접근성과 학군 수요가 함께 반영됩니다.",
  },
  {
    id: "park-rio",
    rank: 5,
    complexName: "파크리오",
    complexNameOfficial: "파크리오",
    areaGroup: "올림픽공원·방이권",
    legalDongLabel: "신천동",
    addressLabel: "송파구 신천동·올림픽공원 인접",
    supplyYear: 2008,
    householdCount: 6864,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "잠실나루·몽촌토성 접근",
    parkNote: "올림픽공원·한강 접근",
    latestTradePriceManwon: 280000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (27~30억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 295000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (28~30.5억)",
    fiveYearLowPriceManwon: 180000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 128000,
    jeonseRatio: 45.7,
    tradeCountNote: "2026년 5월 일반층 27~28.4억, 6월 고층(34층) 29~30억. 층수에 따른 편차가 큽니다.",
    badge: "확인 필요",
    note: "2026년 5~6월 84㎡ 실거래 27~30억 범위입니다. 잠실역이 아닌 잠실나루·몽촌토성역 생활권으로 잠실 4대 단지보다 낮은 수준입니다.",
  },
  {
    id: "olympic-village",
    rank: 7,
    complexName: "올림픽선수기자촌",
    complexNameOfficial: "올림픽선수기자촌",
    areaGroup: "재건축 기대권",
    legalDongLabel: "방이동",
    addressLabel: "송파구 방이동·올림픽공원권",
    supplyYear: 1988,
    householdCount: 5540,
    mainAreaLabel: "전용 83~84㎡ 유사 면적",
    stationLabel: "올림픽공원역 접근",
    parkNote: "올림픽공원 인접",
    redevelopmentNote: "재건축 기대감 반영 가능성",
    latestTradePriceManwon: 270000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "83~84㎡",
    previousYearPriceManwon: 238000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 165000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "83~84㎡",
    jeonsePriceManwon: 90000,
    jeonseRatio: 33.3,
    tradeCountNote: "재건축 기대 단지로 면적·동별 거래 확인이 필요합니다.",
    badge: "확인 필요",
    note: "재건축 기대감과 현재 실거래가를 분리해서 봐야 합니다.",
  },
  {
    id: "jamsil-jugong-5",
    rank: 1,
    complexName: "잠실주공5단지",
    complexNameOfficial: "잠실주공5단지",
    areaGroup: "재건축 기대권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·재건축 기대권",
    supplyYear: 1978,
    householdCount: 3930,
    mainAreaLabel: "전용 76㎡ (재건축 단지 대표 면적·84㎡ 미해당)",
    stationLabel: "잠실역 접근",
    parkNote: "석촌호수·잠실 상권 접근",
    redevelopmentNote: "재건축 기대감 대표 단지",
    latestTradePriceManwon: 400000,
    latestTradeDate: "2026년 4~5월 실거래 기준 (39.2~42.4억 범위, 76㎡)",
    latestTradeArea: "76㎡",
    previousYearPriceManwon: 390000,
    previousYearPeriod: "2025년 하반기 대표 거래 참고 (76㎡)",
    fiveYearLowPriceManwon: 230000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "76㎡",
    jeonsePriceManwon: 110000,
    jeonseRatio: 27.5,
    tradeCountNote: "76㎡가 대표 거래 면적입니다. 재건축 기대감이 가격에 반영되어 있어 84㎡ 단지와 직접 비교 시 주의해야 합니다.",
    badge: "확인 필요",
    note: "2026년 4~5월 76㎡ 실거래가 39~42억 수준입니다. 재건축 기대감이 반영된 가격이며 분담금·사업 속도·입주시점은 확정 표현하면 안 됩니다.",
  },
  {
    id: "asia-athlete-village",
    rank: 8,
    complexName: "아시아선수촌",
    complexNameOfficial: "아시아선수촌",
    areaGroup: "재건축 기대권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·종합운동장권",
    supplyYear: 1986,
    householdCount: 1356,
    mainAreaLabel: "전용 99㎡ 유사 면적",
    stationLabel: "종합운동장역 접근",
    parkNote: "탄천·종합운동장 인접",
    redevelopmentNote: "고가 구축·재건축 기대 후보",
    latestTradePriceManwon: 255000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "99㎡",
    previousYearPriceManwon: 226000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 158000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "99㎡",
    jeonsePriceManwon: 78000,
    jeonseRatio: 30.6,
    tradeCountNote: "84㎡가 아닌 면적 후보로 직접 비교에 주의가 필요합니다.",
    badge: "확인 필요",
    note: "면적과 재건축 기대감 때문에 잠실 대단지와 같은 방식으로 비교하면 안 됩니다.",
  },
  {
    id: "lake-palace",
    rank: 9,
    complexName: "잠실 레이크팰리스",
    complexNameOfficial: "레이크팰리스",
    areaGroup: "잠실·신천권",
    legalDongLabel: "잠실동",
    addressLabel: "송파구 잠실동·석촌호수 생활권",
    supplyYear: 2006,
    householdCount: 2678,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "잠실새내·잠실역 접근",
    parkNote: "석촌호수 접근",
    latestTradePriceManwon: 250000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 225000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 166000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 114000,
    jeonseRatio: 45.6,
    tradeCountNote: "후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "석촌호수 접근성과 잠실권 입지가 가격에 반영될 수 있습니다.",
  },
  {
    id: "helio-city",
    rank: 6,
    complexName: "헬리오시티",
    complexNameOfficial: "헬리오시티",
    areaGroup: "가락·헬리오시티권",
    legalDongLabel: "가락동",
    addressLabel: "송파구 가락동·대단지",
    supplyYear: 2018,
    householdCount: 9510,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "가락시장·송파역 접근",
    parkNote: "가락시장·수서·강남 접근",
    latestTradePriceManwon: 280000,
    latestTradeDate: "2026년 5월 실거래 기준 (27.7~29억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 295000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (28.9~30.5억)",
    fiveYearLowPriceManwon: 175000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 132000,
    jeonseRatio: 47.1,
    tradeCountNote: "9,510세대 대단지로 거래 분포가 넓습니다. 동·층·향에 따라 27~30억 편차 발생.",
    badge: "확인 필요",
    note: "2026년 5월 84㎡ 실거래 27.7~29억 수준입니다. 세대 수가 많아 동·층·향·수리 상태별 가격 차이가 큽니다.",
  },
  {
    id: "munjeong-raemian",
    rank: 10,
    complexName: "문정 래미안",
    complexNameOfficial: "문정래미안",
    areaGroup: "문정·장지권",
    legalDongLabel: "문정동",
    addressLabel: "송파구 문정동·문정 업무지구권",
    supplyYear: 2004,
    householdCount: 1696,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "문정·장지역 생활권",
    parkNote: "문정 업무지구·동남권 접근",
    latestTradePriceManwon: 185000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 165000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 116000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 86000,
    jeonseRatio: 46.5,
    tradeCountNote: "문정·장지권 대표 후보로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "잠실 대단지와 가격 논리가 다르므로 직접 우열 비교는 피해야 합니다.",
  },
];

export const SPAP_APARTMENTS: SongpaApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const SPAP_AREA_CARDS: SongpaAreaCard[] = [
  {
    areaGroup: "잠실·신천권",
    title: "잠실·신천권",
    description: "잠실 대단지, 학군, 상권, 교통, 한강 접근성이 함께 가격을 만듭니다.",
    priceInterpretation: "송파 상단 가격을 만드는 축이지만 송파 전체 평균처럼 보면 안 됩니다.",
    caution: "동·층·향, 학군 선호, 역 접근성에 따라 같은 단지 안에서도 차이가 큽니다.",
    badge: "추정",
  },
  {
    areaGroup: "올림픽공원·방이권",
    title: "올림픽공원·방이권",
    description: "올림픽공원, 한강, 잠실 접근성과 구축 대단지 수요를 함께 봅니다.",
    priceInterpretation: "쾌적성과 재건축 기대감이 가격에 섞여 보일 수 있습니다.",
    caution: "현재 실거래가와 미래 재건축 기대를 분리해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "가락·헬리오시티권",
    title: "가락·헬리오시티권",
    description: "헬리오시티 같은 대단지와 가락시장·수서·강남 접근성이 핵심입니다.",
    priceInterpretation: "세대 수가 많아 거래가 다양하게 분포합니다.",
    caution: "단일 거래를 단지 전체 평균처럼 해석하지 않아야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "문정·장지권",
    title: "문정·장지권",
    description: "문정 업무지구, 위례, 동남권 이동 편의성을 함께 보는 생활권입니다.",
    priceInterpretation: "잠실권보다 가격 레벨은 낮아도 실거주 논리가 다릅니다.",
    caution: "잠실 대장 단지와 직접 우열 비교를 피해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "재건축 기대권",
    title: "재건축 기대권",
    description: "대지지분, 사업 단계, 미래 기대감이 현재 가격에 반영될 수 있습니다.",
    priceInterpretation: "실거래가에는 현재 주거 가치와 미래 기대가 섞여 있을 수 있습니다.",
    caution: "분담금, 사업 속도, 입주시점을 확정값처럼 표현하면 안 됩니다.",
    badge: "확인 필요",
  },
];

export const SPAP_CONTEXT: SongpaContextCard[] = [
  {
    title: "송파는 잠실만으로 설명되지 않습니다",
    body: "잠실 대단지는 송파 가격의 상단을 만들지만, 헬리오시티·문정·방이권은 다른 생활권과 수요를 가집니다.",
    badge: "추정",
  },
  {
    title: "재건축 기대감은 별도 변수입니다",
    body: "잠실주공5단지, 올림픽선수기자촌, 아시아선수촌처럼 재건축 기대가 있는 단지는 현재 실거래가와 미래 기대를 분리해서 읽어야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "전세가율은 보조 지표입니다",
    body: "전세가율은 실거주 수요를 보는 참고값이지만 매매가 상승을 보장하지 않습니다. 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
    badge: "추정",
  },
  {
    title: "후보값은 원자료 확인 전입니다",
    body: "발행 전에는 국토교통부 실거래가 공개시스템에서 거래월, 면적, 취소 여부, 공식 단지명을 다시 확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const SPAP_METHOD: string[] = [
  "서울특별시 송파구 행정구역 기준으로 후보 단지를 정리했습니다.",
  "최근 기준가는 전용 84㎡를 우선 사용하고, 유사 면적은 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "세금, 중개보수, 보유세, 대출이자, 양도소득세, 수리비는 모두 제외했습니다.",
  "재건축 기대 단지는 사업 단계, 분담금, 입주시점을 확정적으로 표현하지 않습니다.",
];

export const SPAP_RISKS: string[] = [
  "잠실권 가격을 송파구 전체 평균처럼 해석하면 실제 생활권 판단이 왜곡될 수 있습니다.",
  "재건축 기대 단지는 사업 속도, 분담금, 규제, 조합 상황에 따라 가격 해석이 달라집니다.",
  "같은 단지라도 면적, 동, 층, 향, 조망, 수리 상태에 따라 가격 차이가 큽니다.",
  "대단지는 거래 건수가 많아도 특정 한 건이 전체 시세를 대표하지 않을 수 있습니다.",
  "금리, DSR, 취득세, 보유세, 양도세 조건은 실제 부담 가능성을 크게 바꿉니다.",
];

export const SPAP_FAQ: SongpaFaqItem[] = [
  {
    question: "송파 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "송파 아파트는 왜 비싼가요?",
    answer:
      "잠실 대단지와 학군·상권·교통, 올림픽공원과 한강 접근성, 헬리오시티 같은 대단지 실거주 수요, 일부 재건축 기대감이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "잠실엘스와 헬리오시티를 같이 비교해도 되나요?",
    answer:
      "같은 송파구에 있지만 가격 논리가 다릅니다. 잠실엘스는 잠실권 입지와 학군·상권 수요가 강하고, 헬리오시티는 대단지 규모와 가락·수서·강남 접근성을 함께 봐야 합니다.",
  },
  {
    question: "재건축 기대 단지는 가격을 어떻게 봐야 하나요?",
    answer:
      "재건축 기대감은 가격에 반영될 수 있지만 사업 속도, 분담금, 규제, 금리, 조합 상황에 따라 달라집니다. 현재 실거래가와 미래 기대감을 분리해서 봐야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 송파 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const SPAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·옥수·금호·왕십리 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포 대장 아파트 Top10",
    description: "공덕·아현·대흥·상암 생활권 주요 단지의 가격 변화를 비교합니다.",
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

export const SPAP_SEO_INTRO: string[] = [
  "송파 아파트 실거래가를 볼 때는 먼저 생활권을 나눠야 합니다. 잠실 대단지, 올림픽공원·방이권, 가락·헬리오시티권, 문정·장지권, 재건축 기대권은 가격을 만드는 이유가 서로 다릅니다.",
  "이 리포트는 잠실엘스, 리센츠, 트리지움, 파크리오, 헬리오시티 등 검색 수요가 강한 후보를 같은 표로 비교합니다. 다만 현재 값은 설계 단계 후보값이므로 발행 전 국토교통부 실거래가 공개시스템에서 재검증해야 합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도소득세, 대출이자, 수리비를 제외한 단순 시세 차이입니다. 그래서 모든 차익성 수치는 평가차익(추정)으로 표시했습니다.",
  "송파는 재건축 기대감이 큰 단지가 함께 섞여 있습니다. 잠실주공5단지, 올림픽선수기자촌, 아시아선수촌처럼 미래 사업성이 거론되는 단지는 현재 실거래가와 미래 기대를 분리해서 봐야 합니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 관심 단지를 고른 뒤 최신 실거래가 원문, 취소 거래 여부, 매물 호가, 대출 조건, 세금, 관리비, 실거주 동선을 함께 확인해야 합니다.",
];

export const SPAP_SEO_CRITERIA: string[] = [
  "서울특별시 송파구 행정구역과 생활권 분류를 함께 표시했습니다.",
  "최근 기준가는 전용 84㎡를 우선 사용하되, 유사 면적은 화면에 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "재건축 기대감은 현재 실거래가와 분리해 해석해야 합니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 단지명과 거래월을 다시 확인해야 합니다.",
];
