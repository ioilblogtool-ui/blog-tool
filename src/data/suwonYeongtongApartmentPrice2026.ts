export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type YeongtongAreaGroup =
  | "망포역권"
  | "영통역권"
  | "매탄·원천권"
  | "광교 인접권"
  | "영통구청·중심상권권";

export interface YeongtongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface YeongtongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial: string;
  areaGroup: YeongtongAreaGroup;
  legalDongLabel: "망포동" | "영통동" | "매탄동" | "원천동" | "이의동" | "하동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  workplaceNote?: string;
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
  gwanggyoOverlap?: boolean;
}

export interface YeongtongApartmentViewRow extends YeongtongApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface YeongtongAreaCard {
  areaGroup: YeongtongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface YeongtongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface YeongtongFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SYTAP_META: YeongtongApartmentMeta = {
  slug: "suwon-yeongtong-apartment-price-2026",
  title: "수원 영통 대장 아파트 Top10 2026",
  seoTitle: "수원 영통 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "영통 아이파크캐슬, 힐스테이트 영통, 래미안 영통 마크원 등 수원 영통구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 망포·영통·매탄·광교 인접 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 설계 단계 후보 데이터 기준 (국토부 재확인 필요)",
  notice:
    "이 리포트의 가격은 설계 단계 후보값입니다. 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일을 다시 확인한 뒤 실제 의사결정에 활용해야 합니다.",
};

const rawApartments: YeongtongApartmentRow[] = [
  {
    id: "gwanggyo-nature-hillstate",
    rank: 1,
    complexName: "광교 자연앤힐스테이트",
    complexNameOfficial: "광교자연앤힐스테이트",
    areaGroup: "광교 인접권",
    legalDongLabel: "이의동",
    addressLabel: "수원시 영통구 이의동·광교 생활권",
    supplyYear: 2011,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "신분당선 광교역 인접",
    latestTradePriceManwon: 190000,
    latestTradeDate: "2026년 6월",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 169000,
    previousYearPeriod: "2025년 하반기 실거래 참고",
    fiveYearLowPriceManwon: 115000,
    fiveYearLowDate: "2022년 하반기 추정",
    fiveYearLowArea: "84㎡ 추정",
    jeonsePriceManwon: 58000,
    jeonseRatio: 30.5,
    tradeCountNote: "아실 기준 2026년 5~6월 중층(14~41층) 다수 거래 확인. 최고 19억 7천(2026.06, 24층). 저층 제외 중층 대표값 적용.",
    badge: "보도 기반",
    note: "2026년 5~6월 84㎡ 중층 거래 기준 약 17억~19억 7천 범위. 광교 리포트와 동일 단지. 5년 저점은 추정치로 국토부 원문 재확인 필요.",
    gwanggyoOverlap: true,
  },
  {
    id: "gwanggyo-jungheung",
    rank: 2,
    complexName: "광교 중흥S클래스",
    complexNameOfficial: "광교중흥S클래스에코시티",
    areaGroup: "광교 인접권",
    legalDongLabel: "이의동",
    addressLabel: "수원시 영통구 이의동·광교 생활권",
    supplyYear: 2012,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "신분당선 광교중앙역 인접",
    latestTradePriceManwon: 132000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 116000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 90000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 54000,
    jeonseRatio: 40.9,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "광교 생활권 단지이며 광교 리포트와 중복될 수 있습니다. 단지명 표기와 면적을 재확인하세요.",
    gwanggyoOverlap: true,
  },
  {
    id: "yeongtong-ipark-castle",
    rank: 3,
    complexName: "영통 아이파크캐슬",
    complexNameOfficial: "영통아이파크캐슬",
    areaGroup: "망포역권",
    legalDongLabel: "망포동",
    addressLabel: "수원시 영통구 망포동·망포역권",
    supplyYear: 2019,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 망포역 도보권",
    workplaceNote: "삼성디지털시티 차량 15분 내외",
    latestTradePriceManwon: 129000,
    latestTradeDate: "2026년 6월",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 105000,
    previousYearPeriod: "2025년 10~12월 중층 실거래 참고",
    fiveYearLowPriceManwon: 82000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 48000,
    jeonseRatio: 37.2,
    tradeCountNote: "아실 기준 2026년 4~6월 다수 거래 확인. 최고 13억(23층, 2026.06). 저층(1~2층) 제외 중층 대표값 적용.",
    badge: "보도 기반",
    note: "2026년 5~6월 84㎡ 중층 거래 기준 약 12.7억~13억 범위. 저층(1층)은 9~10억대 특수 거래 있음. 5년 저점 2022년 8.2억 참고.",
  },
  {
    id: "hillstate-yeongtong",
    rank: 4,
    complexName: "힐스테이트 영통",
    complexNameOfficial: "힐스테이트영통",
    areaGroup: "망포역권",
    legalDongLabel: "망포동",
    addressLabel: "수원시 영통구 망포동·망포역권",
    supplyYear: 2018,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 망포역 도보권",
    latestTradePriceManwon: 87000,
    latestTradeDate: "2026년 6월",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 80000,
    previousYearPeriod: "2025년 11~12월 84㎡ 중층 실거래 참고",
    fiveYearLowPriceManwon: 74000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 40000,
    jeonseRatio: 46.0,
    tradeCountNote: "아실 기준 2026년 1~6월 84㎡ 다수 거래 확인. 84㎡ 중층(5층+) 기준 8.6억~8.9억. 97㎡·115㎡ 혼재 단지이므로 면적 구분 필요.",
    badge: "보도 기반",
    note: "2026년 5~6월 84㎡ 중층 거래 기준 약 8.6억~8.94억 범위. 저층(2~3층)은 7.3억~7.4억 특수 거래 있음. 97㎡·115㎡ 타입도 혼재. 5년 저점 2022년 7.4억 참고.",
  },
  {
    id: "gwanggyo-lakepark-ipark",
    rank: 5,
    complexName: "광교 호수공원 아이파크",
    complexNameOfficial: "광교호수공원아이파크",
    areaGroup: "광교 인접권",
    legalDongLabel: "하동",
    addressLabel: "수원시 영통구 하동·광교 호수공원 생활권",
    supplyYear: 2013,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "신분당선 광교역 인접",
    latestTradePriceManwon: 103000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 90000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 72000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 43000,
    jeonseRatio: 41.7,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "호수공원 인접 프리미엄이 반영된 단지입니다. 광교 리포트와 중복 가능성을 확인하세요.",
    gwanggyoOverlap: true,
  },
  {
    id: "raemian-yeongtong-markone",
    rank: 6,
    complexName: "래미안 영통 마크원",
    complexNameOfficial: "래미안영통마크원",
    areaGroup: "영통역권",
    legalDongLabel: "영통동",
    addressLabel: "수원시 영통구 영통동·영통역권",
    supplyYear: 2021,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 영통역 도보권",
    latestTradePriceManwon: 96000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 84000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 66000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 41000,
    jeonseRatio: 42.7,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "영통역권 신축 브랜드 단지 후보입니다. 단지명과 준공 연도를 국토부에서 재확인하세요.",
  },
  {
    id: "yeongtong-sk-view",
    rank: 7,
    complexName: "영통 SK뷰",
    complexNameOfficial: "영통SK뷰",
    areaGroup: "영통역권",
    legalDongLabel: "영통동",
    addressLabel: "수원시 영통구 영통동·영통역권",
    supplyYear: 2016,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 영통역 인접",
    latestTradePriceManwon: 86000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 75000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 58000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 37000,
    jeonseRatio: 43.0,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "영통역권 준신축 단지 비교 후보입니다. 거래 건수가 적으면 대표 거래 해석에 주의하세요.",
  },
  {
    id: "maetan-weave-neulchai",
    rank: 8,
    complexName: "매탄 위브하늘채",
    complexNameOfficial: "매탄위브하늘채",
    areaGroup: "매탄·원천권",
    legalDongLabel: "매탄동",
    addressLabel: "수원시 영통구 매탄동·삼성디지털시티 인접",
    supplyYear: 2014,
    mainAreaLabel: "전용 84㎡",
    workplaceNote: "삼성디지털시티 차량·도보 근접",
    latestTradePriceManwon: 80000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 70000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 54000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 35000,
    jeonseRatio: 43.8,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "삼성디지털시티 수요가 직주근접 가격을 보장한다는 식의 해석은 금물입니다. 단지 연식과 교통 접근성을 함께 보세요.",
  },
  {
    id: "ehs-yeongtong2",
    rank: 9,
    complexName: "e편한세상 영통2차",
    complexNameOfficial: "e편한세상영통2차",
    areaGroup: "영통역권",
    legalDongLabel: "영통동",
    addressLabel: "수원시 영통구 영통동·영통역권",
    supplyYear: 2012,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 영통역 도보권",
    latestTradePriceManwon: 74000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 64000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 50000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 33000,
    jeonseRatio: 44.6,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "영통 중심 생활 편의권 기존 단지입니다. 연식 대비 가격과 신축 대비 차이를 함께 보세요.",
  },
  {
    id: "yeongtong-ipark2",
    rank: 10,
    complexName: "영통 아이파크2차",
    complexNameOfficial: "영통아이파크2단지",
    areaGroup: "망포역권",
    legalDongLabel: "망포동",
    addressLabel: "수원시 영통구 망포동·망포역권",
    supplyYear: 2010,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "분당선 망포역 인근",
    latestTradePriceManwon: 68000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 59000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 46000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 30000,
    jeonseRatio: 44.1,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "망포역권 내 구축 단지 비교 후보입니다. 영통 아이파크캐슬과 같은 생활권이나 연식 차이가 큽니다.",
  },
];

export const SYTAP_APARTMENTS: YeongtongApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const SYTAP_AREA_CARDS: YeongtongAreaCard[] = [
  {
    areaGroup: "망포역권",
    title: "망포역권 — 신축 대단지·분당선",
    description: "영통 아이파크캐슬, 힐스테이트 영통 등 2018~2019년 입주 단지가 집중된 생활권입니다.",
    priceInterpretation: "신축 선호와 분당선 망포역 접근성이 가격에 반영되는 경향이 있습니다.",
    caution: "같은 단지 안에서도 동·층·향에 따라 가격 차이가 크게 납니다.",
    badge: "추정",
  },
  {
    areaGroup: "영통역권",
    title: "영통역권 — 생활 인프라·학원가",
    description: "영통역 인근 학원가와 상권을 중심으로 형성된 기존 영통 주거 생활권입니다.",
    priceInterpretation: "생활 편의성과 학군 선호가 반영되지만 단지 연식 차이에 따라 가격이 달라집니다.",
    caution: "신축 대비 연식 차이를 가격과 분리해서 해석해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "매탄·원천권",
    title: "매탄·원천권 — 삼성디지털시티 인접",
    description: "삼성디지털시티와 원천 업무지구 인근 주거 생활권입니다.",
    priceInterpretation: "직주근접 수요가 가격에 영향을 줄 수 있으나 교통 접근성과 함께 판단해야 합니다.",
    caution: "삼성 수요가 가격을 보장한다는 단정은 금물입니다.",
    badge: "추정",
  },
  {
    areaGroup: "광교 인접권",
    title: "광교 인접권 — 호수공원·신분당선",
    description: "영통구 행정구역 안에 속하면서 광교 생활권을 공유하는 단지들이 포함됩니다.",
    priceInterpretation: "호수공원과 신분당선 접근성이 가격 프리미엄에 반영되는 경향이 있습니다.",
    caution: "광교 리포트와 단지 중복 가능성이 있으므로 행정구역과 단지명을 국토부에서 재확인하세요.",
    badge: "확인 필요",
  },
];

export const SYTAP_CONTEXT: YeongtongContextCard[] = [
  {
    title: "삼성디지털시티와 직주근접 수요",
    body: "수원 영통구는 삼성디지털시티와 인접해 직주근접 수요가 거론됩니다. 다만 직주근접만으로 가격 상승을 단정할 수 없으며, 도보 동선과 단지별 접근성 차이를 함께 봐야 합니다.",
    badge: "추정",
  },
  {
    title: "분당선과 신분당선 접근성",
    body: "망포역·영통역(분당선)과 광교역·광교중앙역(신분당선)이 권역별 접근성을 결정합니다. 같은 영통구 안에서도 역까지의 실제 동선에 따라 체감 가치가 달라집니다.",
    badge: "추정",
  },
  {
    title: "광교 생활권과 영통구 경계",
    body: "광교신도시 일부 단지는 수원시 영통구(이의동·하동)에 속하면서도 광교 생활권으로 검색되는 경우가 많습니다. 이 리포트는 영통구 기준을 유지하되 광교 중복 단지를 별도 표시합니다.",
    badge: "확인 필요",
  },
  {
    title: "후보값은 국토부 재확인 전 단계",
    body: "이 리포트의 모든 가격은 설계 단계 후보값입니다. 실제 배포 전에는 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일, 취소 거래 여부를 반드시 재확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const SYTAP_METHOD: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하고, 84㎡ 거래가 부족한 경우 면적을 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "상승률(추정)은 평가차익을 최근 5년 저점 참고가로 나눈 값으로, 실제 투자 수익률이 아닙니다.",
  "세금, 중개보수, 대출이자, 보유세, 양도소득세, 수리비는 모두 제외했습니다.",
  "거래 건수가 적은 단지는 평균 시세가 아니라 대표 거래 사례로 읽어야 합니다.",
  "광교 인접권 단지는 광교 리포트와 중복될 수 있으므로 행정구역과 단지명을 원자료에서 재확인하세요.",
];

export const SYTAP_RISKS: string[] = [
  "같은 단지라도 동·층·향·조망·수리 상태에 따라 가격 차이가 크게 납니다.",
  "84㎡ 거래 건수가 적으면 한 건의 거래가 대표값처럼 보일 수 있으므로 주의가 필요합니다.",
  "금리, DSR, 취득세, 종부세, 양도세 규정 변화는 실제 매수 부담을 크게 바꿉니다.",
  "광교 인접권 단지는 영통구 행정구역 기준과 광교 생활권 기준이 혼재할 수 있습니다.",
  "삼성디지털시티 인접성이 가격을 보장한다는 단정은 실제 거래 데이터와 다를 수 있습니다.",
  "이 리포트의 모든 수치는 설계 단계 후보값으로, 실제 의사결정 전 국토부 원자료를 반드시 확인해야 합니다.",
];

export const SYTAP_FAQ: YeongtongFaqItem[] = [
  {
    question: "수원 영통 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "영통구와 광교 생활권은 왜 겹치나요?",
    answer:
      "광교신도시 일부 단지는 수원시 영통구에 속하면서도 사용자는 광교 생활권으로 검색하는 경우가 많습니다. 이 리포트는 영통구 기준을 유지하되 광교 리포트와 중복될 수 있는 단지를 별도 표시합니다.",
  },
  {
    question: "영통 아이파크캐슬이 영통에서 가장 비싼 아파트인가요?",
    answer:
      "영통구 전체로 보면 광교 인접권 단지가 더 높은 가격을 기록하는 경우가 많습니다. 다만 거래 시점·면적·동·층·향에 따라 순위가 바뀔 수 있으므로 최신 실거래가 기준으로 다시 확인해야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "영통 아파트는 왜 망포와 광교를 함께 봐야 하나요?",
    answer:
      "영통구 안에서도 망포역권 신축 대단지, 기존 영통 중심상권, 매탄·원천 업무지구, 광교 인접 단지의 수요가 다르기 때문입니다. 생활권을 나누면 가격 차이를 더 현실적으로 해석할 수 있습니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 영통 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const SYTAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "광교 생활권 주요 단지의 실거래가와 최저가 대비 평가차익을 비교합니다.",
  },
  {
    href: "/reports/suji-apartment-price-2026/",
    label: "수지 대장 아파트 Top10",
    description: "수지구 주요 단지의 신분당선·생활권 프리미엄과 가격 변화를 확인합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 주요 단지의 실거래가, 재건축 기대, 저점 대비 변화를 비교합니다.",
  },
  {
    href: "/reports/dongtan-apartment-price-2026/",
    label: "동탄 대장 아파트 Top10",
    description: "동탄 주요 단지의 GTX-A 이후 가격 흐름과 최저가 대비 변화를 확인합니다.",
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

export const SYTAP_SEO_INTRO: string[] = [
  "수원 영통 아파트 실거래가를 볼 때 가장 먼저 구분해야 할 것은 권역입니다. 망포역권 신축 대단지, 기존 영통 생활권, 매탄·원천 업무지구 인접, 광교 인접 단지는 같은 영통구 안에서도 가격을 만드는 이유가 다릅니다.",
  "이 리포트는 영통 아이파크캐슬, 힐스테이트 영통, 광교 자연앤힐스테이트, 래미안 영통 마크원 등 Top10 후보를 같은 표에 놓고 최근 기준가와 최근 5년 저점 참고가를 비교합니다. 다만 모든 값은 설계 단계 후보값으로 국토교통부 실거래가 공개시스템에서 재확인이 필요합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도소득세, 대출이자, 수리비를 제외한 단순 시세 차이입니다. 그래서 모든 차익성 수치는 평가차익(추정)으로 표기했습니다.",
  "광교 인접권 단지는 영통구에 행정 주소가 있더라도 광교 생활권으로 검색되는 경우가 많습니다. 이 리포트는 영통구 기준을 유지하되 광교 리포트와 중복될 수 있는 단지를 별도 표시해 혼동을 줄였습니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 관심 단지를 고른 뒤에는 최신 실거래가 원문, 취소 거래 여부, 매물 호가, 대출 조건, 세금, 관리비, 실거주 동선을 함께 확인해야 합니다.",
];

export const SYTAP_SEO_CRITERIA: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하되, 다른 면적은 화면에 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "모든 가격 데이터는 설계 단계 후보값으로, 배지를 통해 원자료 재확인 필요성을 표시했습니다.",
  "수원시 영통구 행정구역 기준을 유지하되, 광교 생활권 중복 단지는 별도 표시했습니다.",
  "이 리포트는 매수 추천이 아니라 실거래가 기준 비교 참고자료입니다.",
];
