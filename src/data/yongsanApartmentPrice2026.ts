export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type YongsanAreaGroup =
  | "한남·보광권"
  | "이촌·서빙고권"
  | "용산역·한강로권"
  | "원효로·도원권"
  | "후암·청파권"
  | "초고가 대형면적권";

export interface YongsanApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface YongsanApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: YongsanAreaGroup;
  legalDongLabel: "한남동" | "이촌동" | "서빙고동" | "한강로동" | "원효로" | "도원동" | "후암동" | "청파동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  riverNote?: string;
  developmentNote?: string;
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

export interface YongsanAreaCard {
  areaGroup: YongsanAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface YongsanContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface YongsanFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const YSAP_META: YongsanApartmentMeta = {
  slug: "yongsan-apartment-price-2026",
  title: "용산 대장 아파트 Top10 2026",
  seoTitle: "용산 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "한남더힐, 나인원한남, 래미안첼리투스, 용산센트럴파크 해링턴스퀘어 등 용산구 주요 아파트 Top10의 최근 기준가와 최근 5년 저점 대비 평가차익을 비교합니다. 한남·이촌·용산역 생활권 차이와 개발 기대감 주의 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 말 설계 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 재확인해야 하는 참고값입니다. 초고가·대형 면적 거래는 일반 84㎡ 아파트와 직접 비교하기 어렵습니다.",
};

const withGain = <T extends Omit<YongsanApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): YongsanApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const YSAP_APARTMENTS: YongsanApartmentRow[] = [
  withGain({
    id: "hannam-the-hill",
    rank: 1,
    complexName: "한남더힐",
    complexNameOfficial: "한남더힐",
    areaGroup: "초고가 대형면적권",
    legalDongLabel: "한남동",
    addressLabel: "한남동 고급 주거축",
    supplyYear: 2011,
    householdCount: 600,
    mainAreaLabel: "대형 면적 대표 거래",
    stationLabel: "한강진·이태원 생활권",
    riverNote: "한강·남산 접근성 참고",
    developmentNote: "한남동 초고가 주거 희소성",
    latestTradePriceManwon: 1100000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "대형 면적",
    previousYearPriceManwon: 980000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 700000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대형 면적",
    jeonseRatio: 28,
    tradeCountNote: "대형 면적과 세대 타입 차이가 커서 84㎡ 단지와 직접 비교하면 안 됩니다.",
    badge: "확인 필요",
    note: "용산 초고가 거래를 보여주는 대표 후보입니다. 평가차익은 단순 시세 차이입니다.",
  }),
  withGain({
    id: "nineone-hannam",
    rank: 2,
    complexName: "나인원한남",
    complexNameOfficial: "나인원한남",
    areaGroup: "초고가 대형면적권",
    legalDongLabel: "한남동",
    addressLabel: "한남동 고급 주거축",
    supplyYear: 2019,
    householdCount: 341,
    mainAreaLabel: "대형 면적 대표 거래",
    stationLabel: "한남·이태원 생활권",
    riverNote: "한강 접근성 참고",
    developmentNote: "한남 고급 주거 희소성",
    latestTradePriceManwon: 1000000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "대형 면적",
    previousYearPriceManwon: 900000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 650000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대형 면적",
    jeonseRatio: 30,
    tradeCountNote: "거래 건수와 타입별 가격 차이 확인이 필요합니다.",
    badge: "확인 필요",
    note: "초고가 단지 특성상 일반 아파트 가격표와 같은 방식으로 읽으면 오해가 큽니다.",
  }),
  withGain({
    id: "hannam-riverhill",
    rank: 3,
    complexName: "한남동 고가 단지 후보",
    areaGroup: "한남·보광권",
    legalDongLabel: "한남동",
    addressLabel: "한남·보광 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "한남·한강진 생활권",
    riverNote: "한강 접근성 단지별 상이",
    developmentNote: "한남뉴타운 기대감과 현재 실거래가 분리 필요",
    latestTradePriceManwon: 620000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 560000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 420000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "구현 전 공식 단지명과 면적, 거래월 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "한남 초고가축 보완 후보입니다. 발행 전 실제 단지명으로 교체해야 합니다.",
  }),
  withGain({
    id: "raemian-cellitus",
    rank: 4,
    complexName: "래미안첼리투스",
    complexNameOfficial: "래미안첼리투스",
    areaGroup: "이촌·서빙고권",
    legalDongLabel: "이촌동",
    addressLabel: "이촌 한강변 생활권",
    supplyYear: 2015,
    householdCount: 460,
    mainAreaLabel: "전용 124㎡ 등 대표 면적",
    stationLabel: "이촌역 생활권",
    riverNote: "한강변 조망 변수 큼",
    developmentNote: "이촌 한강변 실거주 선호",
    latestTradePriceManwon: 560000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "대표 면적",
    previousYearPriceManwon: 500000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 350000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대표 면적",
    jeonseRatio: 36,
    tradeCountNote: "조망, 층, 면적에 따른 편차가 큽니다.",
    badge: "확인 필요",
    note: "이촌 한강변 대표 고가 단지입니다. 84㎡ 기준 비교가 어려울 수 있습니다.",
  }),
  withGain({
    id: "hangaram",
    rank: 5,
    complexName: "한가람아파트",
    complexNameOfficial: "한가람",
    areaGroup: "이촌·서빙고권",
    legalDongLabel: "이촌동",
    addressLabel: "이촌역·한강변 생활권",
    supplyYear: 1998,
    householdCount: 2036,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "이촌역",
    riverNote: "한강변 실거주 수요",
    developmentNote: "구축 재평가와 리모델링·정비 기대 분리 필요",
    latestTradePriceManwon: 330000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 300000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 220000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonseRatio: 43,
    tradeCountNote: "대단지라도 동·층·향·조망 차이를 분리해서 봐야 합니다.",
    badge: "확인 필요",
    note: "이촌 실거주형 대표 단지로 초고가 대형 면적 단지와 성격이 다릅니다.",
  }),
  withGain({
    id: "ichon-kolon",
    rank: 6,
    complexName: "이촌코오롱",
    complexNameOfficial: "이촌코오롱",
    areaGroup: "이촌·서빙고권",
    legalDongLabel: "이촌동",
    addressLabel: "이촌 한강변 생활권",
    supplyYear: 1999,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    stationLabel: "이촌역 생활권",
    riverNote: "한강변 접근성 참고",
    developmentNote: "이촌 구축 실거주 수요",
    latestTradePriceManwon: 300000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 또는 유사 면적",
    previousYearPriceManwon: 270000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 200000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonseRatio: 44,
    tradeCountNote: "84㎡ 동일 면적 거래 여부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "이촌권 보완 후보입니다. 면적 기준을 반드시 확인해야 합니다.",
  }),
  withGain({
    id: "central-park-harrington",
    rank: 7,
    complexName: "용산센트럴파크 해링턴스퀘어",
    complexNameOfficial: "용산센트럴파크해링턴스퀘어",
    areaGroup: "용산역·한강로권",
    legalDongLabel: "한강로동",
    addressLabel: "용산역·한강로 생활권",
    supplyYear: 2020,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "용산역·신용산역",
    developmentNote: "국제업무지구 기대감은 현재 실거래가와 분리 필요",
    latestTradePriceManwon: 290000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 260000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 190000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonseRatio: 42,
    tradeCountNote: "개발 기대감과 실제 실거래가를 분리해서 봐야 합니다.",
    badge: "확인 필요",
    note: "용산역·국제업무지구 기대와 교통 접근성이 함께 언급되는 후보입니다.",
  }),
  withGain({
    id: "yongsan-park-tower",
    rank: 8,
    complexName: "용산파크타워",
    complexNameOfficial: "용산파크타워",
    areaGroup: "용산역·한강로권",
    legalDongLabel: "한강로동",
    addressLabel: "용산역·한강로 생활권",
    supplyYear: 2008,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    stationLabel: "용산역·신용산역",
    developmentNote: "용산역 생활권 기대감 참고",
    latestTradePriceManwon: 270000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 또는 유사 면적",
    previousYearPriceManwon: 245000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 180000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonseRatio: 43,
    tradeCountNote: "주상복합 특성과 면적 차이를 함께 확인해야 합니다.",
    badge: "확인 필요",
    note: "용산역 생활권 대표 후보입니다. 개발 기대감은 확정 수혜가 아닙니다.",
  }),
  withGain({
    id: "dowon-samsung-raemian",
    rank: 9,
    complexName: "도원삼성래미안",
    complexNameOfficial: "도원삼성래미안",
    areaGroup: "원효로·도원권",
    legalDongLabel: "도원동",
    addressLabel: "도원동·마포 인접 생활권",
    supplyYear: 2001,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "효창공원앞·공덕 접근",
    developmentNote: "도심·여의도 접근 실거주 수요",
    latestTradePriceManwon: 190000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 172000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 130000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonseRatio: 48,
    tradeCountNote: "한남 초고가 단지와 직접 비교하지 않는 편이 좋습니다.",
    badge: "확인 필요",
    note: "용산 내 상대적 실거주 접근성을 보는 후보입니다.",
  }),
  withGain({
    id: "huam-cheongpa-candidate",
    rank: 10,
    complexName: "후암·청파권 대표 단지 후보",
    areaGroup: "후암·청파권",
    legalDongLabel: "확인 필요",
    addressLabel: "서울역·도심 접근 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "서울역·숙대입구 접근",
    developmentNote: "구도심 정비 기대와 실거주 수요 분리 필요",
    latestTradePriceManwon: 160000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 145000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 110000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "발행 전 공식 단지명, 규모, 거래 건수 확인이 필요합니다.",
    badge: "확인 필요",
    note: "후암·청파권 도심 접근성 보완 후보입니다.",
  }),
];

export const YSAP_AREA_CARDS: YongsanAreaCard[] = [
  {
    areaGroup: "한남·보광권",
    title: "한남·보광권",
    description: "초고가 주거축과 정비 기대가 함께 언급되는 생활권입니다.",
    priceInterpretation: "희소성과 대형 면적 거래가 가격을 크게 끌어올릴 수 있습니다.",
    caution: "84㎡ 일반 아파트와 직접 비교하면 가격 차이가 과장될 수 있습니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "이촌·서빙고권",
    title: "이촌·서빙고권",
    description: "한강변 실거주 수요와 전통 선호가 강한 용산 대표 주거축입니다.",
    priceInterpretation: "한강 조망, 역 접근성, 대단지 여부가 가격 차이를 만듭니다.",
    caution: "구축 기대감과 현재 실거래가는 분리해서 봐야 합니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "용산역·한강로권",
    title: "용산역·한강로권",
    description: "용산역, 신용산역, 국제업무지구 기대감이 함께 거론되는 권역입니다.",
    priceInterpretation: "교통과 업무지구 기대가 가격에 반영될 수 있습니다.",
    caution: "개발 일정과 수혜 금액을 확정값처럼 해석하면 안 됩니다.",
    badge: "보도 기반",
  },
  {
    areaGroup: "원효로·도원권",
    title: "원효로·도원권",
    description: "용산 안에서 상대적으로 실거주 접근성을 함께 보는 권역입니다.",
    priceInterpretation: "도심·여의도 접근성과 생활권 균형이 중요합니다.",
    caution: "한남 초고가 단지와 가격 논리가 다릅니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "후암·청파권",
    title: "후암·청파권",
    description: "서울역·도심 접근성이 강점인 구도심 주거축입니다.",
    priceInterpretation: "단지 규모와 정비 기대, 역 접근성이 함께 작용합니다.",
    caution: "거래 건수와 공식 단지명 확인이 먼저입니다.",
    badge: "확인 필요",
  },
];

export const YSAP_CONTEXT: YongsanContextCard[] = [
  {
    title: "한남 초고가 주거축",
    body: "한남더힐과 나인원한남은 대형 면적과 희소성이 가격을 만드는 단지입니다. 일반 84㎡ 아파트와 같은 줄에 놓고 해석하면 안 됩니다.",
    badge: "확인 필요",
  },
  {
    title: "이촌 한강변 실거주 수요",
    body: "이촌동은 한강변, 역 접근성, 학군·생활 인프라가 함께 작용합니다. 조망과 층에 따른 가격 차이가 큽니다.",
    badge: "확인 필요",
  },
  {
    title: "용산역 개발 기대감",
    body: "국제업무지구 기대감은 가격에 반영될 수 있지만 일정, 인허가, 금리, 규제에 따라 달라질 수 있습니다.",
    badge: "보도 기반",
  },
  {
    title: "도심·강남·여의도 접근성",
    body: "용산은 도심, 강남, 여의도 접근성을 동시에 보는 수요가 있습니다. 단지별 실제 출퇴근 동선은 별도 확인이 필요합니다.",
    badge: "추정",
  },
];

export const YSAP_METHOD: string[] = [
  "84㎡ 거래가 있는 단지는 84㎡를 우선 기준으로 삼고, 초고가·대형 면적 단지는 대표 면적을 별도 표기했습니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 참고가를 뺀 단순 시세 차이입니다.",
  "취득세, 중개보수, 보유세, 대출이자, 양도소득세, 수리비는 모두 제외했습니다.",
  "개발 기대감은 현재 실거래가와 분리해 설명하며, 사업 일정이나 수혜 금액을 확정값으로 보지 않습니다.",
  "후보값은 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export const YSAP_RISKS: string[] = [
  "초고가 단지는 거래 건수가 적어 한 건의 가격이 평균처럼 보일 수 있습니다.",
  "같은 단지라도 동, 층, 향, 조망, 면적, 세대 타입에 따라 가격 차이가 큽니다.",
  "한남 초고가 단지와 이촌·원효로 실거주형 단지는 가격 논리가 다릅니다.",
  "국제업무지구 등 개발 기대감은 확정 수익이나 가격 보장을 의미하지 않습니다.",
  "실제 매수 판단은 자금 계획, 대출 조건, 세금, 현장 확인을 함께 거쳐야 합니다.",
];

export const YSAP_FAQ: YongsanFaqItem[] = [
  {
    question: "용산 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "용산 아파트는 왜 비싼가요?",
    answer:
      "한남 초고가 주거지의 희소성, 이촌 한강변 실거주 수요, 용산역과 도심·강남·여의도 접근성, 국제업무지구 기대감이 함께 작용합니다. 다만 생활권별 가격 논리가 달라 단지별로 나눠 봐야 합니다.",
  },
  {
    question: "한남더힐과 일반 아파트를 같이 비교해도 되나요?",
    answer:
      "직접 비교에는 주의가 필요합니다. 한남더힐, 나인원한남 같은 단지는 대형 면적과 초고가 거래가 많을 수 있어 84㎡ 일반 아파트와 같은 기준으로 단순 비교하면 오해가 생길 수 있습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적 또는 대표 면적을 별도 표기합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "용산 개발 기대감은 가격에 얼마나 반영되나요?",
    answer:
      "개발 기대감은 일부 가격에 반영될 수 있지만 사업 일정, 인허가, 금리, 규제, 시장 상황에 따라 달라집니다. 이 리포트에서는 현재 실거래가와 미래 기대감을 분리해서 설명합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 매매가 부담을 참고하는 지표일 뿐입니다. 전세가율이 높다고 매매가 상승을 보장하지 않으며, 금리와 전세 시장 상황에 따라 달라질 수 있습니다.",
  },
  {
    question: "지금 용산 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const YSAP_RELATED_LINKS: RelatedLink[] = [
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
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
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

export const YSAP_SEO_INTRO: string[] = [
  "용산 아파트 실거래가를 볼 때는 한남 초고가 주거축, 이촌 한강변 실거주축, 용산역·한강로 개발 기대축을 분리해서 봐야 합니다. 같은 용산구라도 가격을 만드는 이유와 거래 면적이 크게 다릅니다.",
  "이 리포트는 용산구 주요 단지의 최근 기준가와 최근 5년 저점권 참고가를 나란히 놓고 평가차익(추정)을 계산합니다. 다만 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다.",
  "한남더힐, 나인원한남처럼 대형 면적 거래가 많은 단지는 일반 84㎡ 아파트와 직접 비교하기 어렵습니다. 화면에서는 면적 라벨과 주의 문구를 함께 표시해 비교 기준을 분리했습니다.",
  "용산국제업무지구 같은 개발 기대감은 현재 가격에 반영될 수 있지만 확정 수혜가 아닙니다. 사업 일정, 인허가, 금리, 규제, 시장 상황에 따라 결과가 달라질 수 있습니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 다시 확인하고, 취득세와 대출 조건까지 함께 계산해야 합니다.",
];

export const YSAP_SEO_CRITERIA: string[] = [
  "용산구 행정구역 기준으로 단지를 묶되, 생활권은 한남·이촌·용산역·원효로·후암권으로 나눠 표시했습니다.",
  "84㎡ 거래가 있는 단지는 84㎡를 우선 사용하고, 대형 면적 단지는 대표 면적임을 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "개발 기대감은 현재 실거래가와 분리해서 설명하며 가격 보장 표현을 사용하지 않습니다.",
  "후보값은 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
