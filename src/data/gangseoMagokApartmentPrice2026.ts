export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type GangseoMagokAreaGroup =
  | "마곡·발산권"
  | "우장산·화곡권"
  | "가양·등촌권"
  | "공항·방화권"
  | "한강 인접권";

export interface GangseoMagokApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface GangseoMagokApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: GangseoMagokAreaGroup;
  legalDongLabel: "마곡동" | "내발산동" | "가양동" | "등촌동" | "화곡동" | "방화동" | "염창동" | "공항동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  workplaceNote?: string;
  airportNote?: string;
  riverNote?: string;
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

export interface GangseoMagokAreaCard {
  areaGroup: GangseoMagokAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GangseoMagokContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GangseoMagokFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const GMAP_META: GangseoMagokApartmentMeta = {
  slug: "gangseo-magok-apartment-price-2026",
  title: "강서·마곡 대장 아파트 Top10 2026",
  seoTitle: "강서·마곡 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "마곡13단지 힐스테이트마스터, 마곡엠밸리, 강서힐스테이트, 우장산아이파크이편한세상 등 강서·마곡 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 마곡·발산·우장산·가양 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 말 설계 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 재확인해야 하는 참고값입니다. 마곡 업무지구 접근성은 수요 요인 중 하나일 뿐이며 현재 실거래가와 분리해서 해석해야 합니다.",
};

const withGain = <T extends Omit<GangseoMagokApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): GangseoMagokApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const GMAP_APARTMENTS: GangseoMagokApartmentRow[] = [
  withGain({
    id: "magok-13-hillstate-master",
    rank: 1,
    complexName: "마곡13단지 힐스테이트마스터",
    complexNameOfficial: "마곡13단지힐스테이트마스터",
    areaGroup: "마곡·발산권",
    legalDongLabel: "마곡동",
    addressLabel: "마곡 업무지구 인접 생활권",
    supplyYear: 2017,
    householdCount: 1194,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "마곡나루역·마곡역 접근",
    workplaceNote: "마곡 업무지구 접근성은 수요 요인으로 작용할 수 있으나 가격 보장은 아닙니다.",
    airportNote: "공항철도·김포공항 접근성 참고",
    latestTradePriceManwon: 175000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 155000,
    previousYearPeriod: "2025년 하반기 거래 참고",
    fiveYearLowPriceManwon: 112000,
    fiveYearLowDate: "2022년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 50,
    tradeCountNote: "2026년 5~6월 중층 17~17.5억, 저층 16~16.5억, 고층 18억대 거래 확인. 5년 최저(2022년)는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 2025년 9월 중층 최저 14.9억 확인, 2022년 저점 미검증.",
  }),
  withGain({
    id: "magok-m-valley-7",
    rank: 2,
    complexName: "마곡엠밸리7단지",
    complexNameOfficial: "마곡엠밸리7단지",
    areaGroup: "마곡·발산권",
    legalDongLabel: "마곡동",
    addressLabel: "마곡 업무지구 생활권",
    supplyYear: 2014,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "마곡나루역·양천향교역 접근",
    workplaceNote: "업무지구 인접성은 단지별 역 접근성과 함께 확인해야 합니다.",
    airportNote: "공항철도 접근 참고",
    latestTradePriceManwon: 198500,
    latestTradeDate: "2026년 1월",
    latestTradeArea: "84㎡ (706동 8층, 등기)",
    previousYearPriceManwon: 183000,
    previousYearPeriod: "2025년 9월 (706동 13층)",
    fiveYearLowPriceManwon: 106000,
    fiveYearLowDate: "2022년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 51,
    tradeCountNote: "2026년 1월 19.85억 등기 1건 확인. 2025년 하반기 중층 17.5~18.3억 범위. 2022년 5년 최저는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 2026년 거래 1건이므로 중층 기준 2025년 하반기 시세와 함께 참고.",
  }),
  withGain({
    id: "magok-m-valley-6",
    rank: 3,
    complexName: "마곡엠밸리6단지",
    complexNameOfficial: "마곡엠밸리6단지",
    areaGroup: "마곡·발산권",
    legalDongLabel: "마곡동",
    addressLabel: "마곡·발산 생활권",
    supplyYear: 2014,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "마곡역·발산역 접근",
    workplaceNote: "마곡 업무지구와 발산 생활권을 함께 보는 단지입니다.",
    latestTradePriceManwon: 158000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 142000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 102000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonseRatio: 52,
    tradeCountNote: "84㎡ 동일 타입과 최근 거래 건수 확인이 필요합니다.",
    badge: "확인 필요",
    note: "마곡권 가격대를 보완하는 후보입니다.",
  }),
  withGain({
    id: "magok-m-valley-14-candidate",
    rank: 4,
    complexName: "마곡엠밸리14단지 또는 인접 단지",
    areaGroup: "마곡·발산권",
    legalDongLabel: "마곡동",
    addressLabel: "마곡 단지군 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "마곡역·마곡나루역 접근 확인 필요",
    workplaceNote: "마곡 단지 번호와 실제 위치를 확인한 뒤 비교해야 합니다.",
    latestTradePriceManwon: 150000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 136000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 98000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "발행 전 공식 단지명과 면적, 거래월을 반드시 재확인해야 합니다.",
    badge: "확인 필요",
    note: "마곡 단지군 비교를 위한 후보입니다. 실제 단지명으로 교체해야 합니다.",
  }),
  withGain({
    id: "gangseo-hillstate",
    rank: 5,
    complexName: "강서힐스테이트",
    complexNameOfficial: "강서힐스테이트",
    areaGroup: "우장산·화곡권",
    legalDongLabel: "화곡동",
    addressLabel: "우장산·화곡 대단지 생활권",
    supplyYear: 2015,
    householdCount: 2603,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "우장산역·화곡역 접근",
    workplaceNote: "마곡 접근성보다 대단지 실거주 수요와 가격 접근성을 함께 봐야 합니다.",
    latestTradePriceManwon: 160000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 140000,
    previousYearPeriod: "2025년 10월 거래 참고",
    fiveYearLowPriceManwon: 88000,
    fiveYearLowDate: "2022년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 54,
    tradeCountNote: "2026년 5~6월 중층 15~16.3억 범위 확인. 저층(1~3층)은 13~14.5억대. 2022년 5년 최저는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 마곡 신축축과 입주연식·역 접근성 차이를 분리해서 봐야 합니다.",
  }),
  withGain({
    id: "ujangsan-ipark-epyeon",
    rank: 6,
    complexName: "우장산아이파크이편한세상",
    complexNameOfficial: "우장산아이파크이편한세상",
    areaGroup: "우장산·화곡권",
    legalDongLabel: "화곡동",
    addressLabel: "우장산 실거주 생활권",
    supplyYear: 2008,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "우장산역 접근",
    workplaceNote: "실거주 선호와 5호선 접근성을 함께 보는 단지입니다.",
    latestTradePriceManwon: 160000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 145000,
    previousYearPeriod: "2025년 11~12월 거래 참고",
    fiveYearLowPriceManwon: 83000,
    fiveYearLowDate: "2022년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 55,
    tradeCountNote: "2026년 5~6월 중층 15.5~16.3억, 저층 14~15억 범위 확인. 2022년 5년 최저는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 구축·대단지 특성상 동·층·향별 가격 차이가 큽니다.",
  }),
  withGain({
    id: "deungchon-jugong-candidate",
    rank: 7,
    complexName: "등촌주공3단지",
    complexNameOfficial: "등촌주공3단지",
    areaGroup: "가양·등촌권",
    legalDongLabel: "등촌동",
    addressLabel: "등촌 9호선 생활권",
    mainAreaLabel: "전용 58㎡",
    stationLabel: "가양역·증미역 접근",
    workplaceNote: "여의도·마포·상암 접근성은 현재 실거래가와 분리해서 봐야 합니다.",
    riverNote: "한강 접근성은 단지별로 차이가 큽니다.",
    latestTradePriceManwon: 109000,
    latestTradeDate: "2026년 4~6월",
    latestTradeArea: "58㎡ (중층 기준)",
    previousYearPriceManwon: 90000,
    previousYearPeriod: "2025년 하반기 거래 참고",
    fiveYearLowPriceManwon: 76000,
    fiveYearLowDate: "2022년 저점권 (추가 확인 필요)",
    fiveYearLowArea: "58㎡",
    tradeCountNote: "2026년 중층 10.7~11.4억 범위 확인. 주력 면적 58㎡ 기준. 2022년 5년 최저는 추가 원문 확인 필요.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 구축 단지 특성상 동·층·향별 가격 차이가 있습니다.",
  }),
  withGain({
    id: "gayang-river-candidate",
    rank: 8,
    complexName: "가양 한강변 대표 단지",
    areaGroup: "가양·등촌권",
    legalDongLabel: "가양동",
    addressLabel: "가양 한강 인접 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "가양역·양천향교역 접근",
    workplaceNote: "마곡과 여의도 접근성을 함께 볼 수 있지만 가격 보장 요인은 아닙니다.",
    riverNote: "한강 접근성과 조망은 동·층별 차이가 큽니다.",
    latestTradePriceManwon: 112000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 102000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 72000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "한강 접근성, 조망, 면적 기준을 분리해서 확인해야 합니다.",
    badge: "확인 필요",
    note: "가양 한강 인접축의 가격 맥락을 보는 후보입니다.",
  }),
  withGain({
    id: "yeomchang-river-candidate",
    rank: 9,
    complexName: "염창동아1차",
    complexNameOfficial: "염창동아1차",
    areaGroup: "한강 인접권",
    legalDongLabel: "염창동",
    addressLabel: "염창 한강·9호선 생활권",
    mainAreaLabel: "전용 84㎡",
    stationLabel: "염창역·등촌역 접근",
    workplaceNote: "여의도·마포 접근성은 수요 요인 중 하나로만 해석해야 합니다.",
    riverNote: "한강 인접성은 단지별 실제 접근성과 조망 차이를 확인해야 합니다.",
    latestTradePriceManwon: 114500,
    latestTradeDate: "2026년 1~4월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 97000,
    previousYearPeriod: "2025년 하반기 거래 참고",
    fiveYearLowPriceManwon: 83000,
    fiveYearLowDate: "2023년 2월",
    fiveYearLowArea: "84㎡ (등기)",
    tradeCountNote: "2026년 중층 11.4~12억 범위 확인. 2025년 하반기 9.3~9.9억 대비 상승. 저층과 중층 가격 차이 있음.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 한강 인접성은 단지 내 동·층에 따라 차이가 있습니다.",
  }),
  withGain({
    id: "banghwa-airport-candidate",
    rank: 10,
    complexName: "방화·공항권 대표 단지",
    areaGroup: "공항·방화권",
    legalDongLabel: "방화동",
    addressLabel: "김포공항·공항철도 접근 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "공항시장역·김포공항역 접근 확인 필요",
    workplaceNote: "마곡 업무지구 접근성과 김포공항 접근성을 따로 봐야 합니다.",
    airportNote: "공항 접근성은 이동 편의 요인이지 가격 보장 요인이 아닙니다.",
    latestTradePriceManwon: 98000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 90000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 65000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "방화·공항권 대표 단지명과 공항철도 접근성을 원문으로 확인해야 합니다.",
    badge: "확인 필요",
    note: "공항·방화권 이동성을 비교하기 위한 후보입니다.",
  }),
];

export const GMAP_AREA_CARDS: GangseoMagokAreaCard[] = [
  {
    areaGroup: "마곡·발산권",
    title: "마곡·발산권",
    description: "마곡 업무지구, 신축급 단지, 5호선·9호선 접근성이 함께 언급되는 생활권입니다.",
    priceInterpretation: "업무지구 접근성과 신축성이 가격 수요 요인으로 작용할 수 있습니다.",
    caution: "마곡 업무지구가 매매가를 보장한다는 식으로 해석하면 안 됩니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "우장산·화곡권",
    title: "우장산·화곡권",
    description: "우장산 생활권, 대단지 실거주 수요, 상대적 가격 접근성을 함께 보는 축입니다.",
    priceInterpretation: "마곡 신축축보다 실거주와 대단지 선호가 더 중요할 수 있습니다.",
    caution: "마곡 단지와 입주연식·역 접근성 차이를 분리해야 합니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "가양·등촌권",
    title: "가양·등촌권",
    description: "9호선, 한강 접근성, 여의도·마포 접근성을 함께 보는 생활권입니다.",
    priceInterpretation: "업무지구보다 교통축과 한강 접근성이 가격 설명에 더 크게 작용할 수 있습니다.",
    caution: "구축·단지별 연식과 면적 차이 확인이 필요합니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "공항·방화권",
    title: "공항·방화권",
    description: "김포공항, 공항철도, 서남권 이동성을 함께 보는 생활권입니다.",
    priceInterpretation: "공항 접근성은 이동 편의 요인으로 볼 수 있습니다.",
    caution: "항공·공항 접근성이 항상 가격 프리미엄을 뜻하지는 않습니다.",
    badge: "추정",
  },
  {
    areaGroup: "한강 인접권",
    title: "한강 인접권",
    description: "염창·가양 등 한강 접근성과 9호선 수요가 함께 언급되는 축입니다.",
    priceInterpretation: "한강 접근성, 조망, 역 접근성이 단지별 가격 차이를 만듭니다.",
    caution: "한강 접근성을 가격 보장처럼 표현하면 안 됩니다.",
    badge: "확인 필요",
  },
];

export const GMAP_CONTEXT: GangseoMagokContextCard[] = [
  {
    title: "마곡 업무지구",
    body: "마곡 업무지구는 직주근접 수요 요인으로 작용할 수 있지만, 단지 가격을 보장하지 않습니다. 입주연식, 역 접근성, 거래 시점과 함께 봐야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "9호선·5호선·공항철도 접근성",
    body: "강서구는 9호선, 5호선, 공항철도 접근 여부에 따라 생활권이 다르게 읽힙니다. 실제 도보권 여부와 환승 동선을 확인해야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "김포공항·여의도·상암 접근성",
    body: "김포공항, 여의도, 상암 접근성은 수요를 설명하는 변수입니다. 다만 교통 접근성이 곧 가격 상승을 의미하지는 않습니다.",
    badge: "추정",
  },
  {
    title: "우장산 실거주 수요",
    body: "우장산·화곡권은 대단지, 학교, 생활 인프라, 가격 접근성을 함께 보는 실거주 수요가 중요합니다.",
    badge: "추정",
  },
  {
    title: "가양·등촌 한강 인접 생활권",
    body: "가양·등촌·염창은 한강 접근성과 9호선 수요가 함께 작용합니다. 조망, 동, 층, 연식에 따른 차이가 큽니다.",
    badge: "확인 필요",
  },
];

export const GMAP_METHOD: string[] = [
  "서울특별시 강서구 행정구역을 기준으로 단지를 묶고, 생활권은 마곡·발산, 우장산·화곡, 가양·등촌, 공항·방화, 한강 인접권으로 구분했습니다.",
  "84㎡ 거래가 있는 단지는 84㎡를 우선 기준으로 삼고, 후보 단지는 대표 면적 확인 필요로 별도 표기했습니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 참고가를 뺀 단순 시세 차이입니다.",
  "취득세, 중개보수, 보유세, 대출이자, 양도소득세, 수리비는 모두 제외했습니다.",
  "마곡 업무지구, 김포공항, 9호선 접근성은 현재 실거래가와 분리해 설명하며 가격 보장 표현을 사용하지 않습니다.",
  "발행 전 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 재검증해야 합니다.",
];

export const GMAP_RISKS: string[] = [
  "같은 단지라도 동, 층, 향, 조망, 역 접근성, 면적 타입에 따라 가격 차이가 큽니다.",
  "거래 건수가 1~2건뿐이면 한 건의 대표 거래가 평균처럼 보일 수 있습니다.",
  "마곡 업무지구 접근성은 수요 요인일 수 있지만 가격 보장을 의미하지 않습니다.",
  "마곡 신축축과 우장산·화곡 실거주축, 가양·등촌 한강 인접축은 가격 논리가 다릅니다.",
  "실제 매수 판단은 자금 계획, 대출 조건, 세금, 현장 확인을 함께 거쳐야 합니다.",
];

export const GMAP_FAQ: GangseoMagokFaqItem[] = [
  {
    question: "강서·마곡 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "마곡 아파트는 왜 주목받나요?",
    answer:
      "마곡 업무지구, 5호선·9호선 접근성, 김포공항과 공항철도, 여의도·마포·상암 접근성, 비교적 신축급 단지가 함께 작용합니다. 다만 단지별 입주연식과 역 접근성에 따라 가격 차이가 큽니다.",
  },
  {
    question: "마곡엠밸리 단지는 어떻게 비교해야 하나요?",
    answer:
      "마곡엠밸리는 단지 번호와 위치, 역 접근성, 입주연식, 면적에 따라 가격이 다르게 나타날 수 있습니다. 공식 단지명과 거래 면적을 확인한 뒤 비교해야 합니다.",
  },
  {
    question: "강서힐스테이트와 마곡 단지를 같이 비교해도 되나요?",
    answer:
      "같은 강서구에 있지만 가격 논리가 다릅니다. 마곡은 업무지구·신축급 수요가 강하고, 강서힐스테이트와 우장산권 단지는 실거주·대단지·상대적 가격 접근성이 중요합니다.",
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
    question: "지금 강서·마곡 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const GMAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/mapo-apartment-price-2026/",
    label: "마포 대장 아파트 Top10",
    description: "공덕·아현·대흥·상암 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "서울숲·옥수·금호·왕십리 생활권 주요 단지의 가격 변화를 비교합니다.",
  },
  {
    href: "/reports/gangnam-apartment-price-2026/",
    label: "강남 대장 아파트 Top10",
    description: "압구정·대치·개포 생활권의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/seoul-housing-affordability-map-2026/",
    label: "서울 구별 PIR 지도",
    description: "연소득 기준으로 서울 어느 구까지 감당 가능한지 확인합니다.",
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

export const GMAP_SEO_INTRO: string[] = [
  "강서·마곡 아파트 실거래가를 볼 때는 마곡 업무지구 인접 신축축, 우장산·화곡 실거주축, 가양·등촌 9호선·한강 인접축을 나눠 봐야 합니다. 같은 강서구라도 가격을 만드는 이유가 다릅니다.",
  "이 리포트는 강서구 주요 단지의 최근 기준가와 최근 5년 저점권 참고가를 나란히 놓고 평가차익(추정)을 계산합니다. 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다.",
  "마곡13단지 힐스테이트마스터와 마곡엠밸리 단지들은 업무지구 접근성과 신축성이 함께 언급되지만, 단지 번호와 위치, 역 접근성, 면적에 따라 가격 차이가 큽니다.",
  "강서힐스테이트와 우장산아이파크이편한세상은 마곡 신축축과 다른 실거주·대단지 가격 논리를 가질 수 있습니다. 같은 84㎡라도 입주연식과 생활권을 맞춰 비교해야 합니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 서울특별시 강서구, 단지명, 면적, 거래월, 취소 여부를 다시 확인하고 취득세와 대출 조건까지 함께 계산해야 합니다.",
];

export const GMAP_SEO_CRITERIA: string[] = [
  "서울특별시 강서구 행정구역 기준으로 단지를 묶되, 생활권은 마곡·발산, 우장산·화곡, 가양·등촌, 공항·방화, 한강 인접권으로 나눠 표시했습니다.",
  "84㎡ 거래가 있는 단지는 84㎡를 우선 사용하고, 후보 단지는 대표 면적 확인 필요로 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "마곡 업무지구와 공항·9호선 접근성은 현재 실거래가와 분리해서 설명하며 가격 보장 표현을 사용하지 않습니다.",
  "후보값은 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
