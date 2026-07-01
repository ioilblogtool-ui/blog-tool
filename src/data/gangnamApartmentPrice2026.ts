export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type GangnamAreaGroup =
  | "압구정·청담권"
  | "대치·도곡권"
  | "개포·일원권"
  | "삼성·역삼권"
  | "재건축 기대권"
  | "초고가 대형면적권";

export interface GangnamApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface GangnamApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: GangnamAreaGroup;
  legalDongLabel: "압구정동" | "청담동" | "대치동" | "개포동" | "일원동" | "삼성동" | "역삼동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  schoolNote?: string;
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

export interface GangnamApartmentViewRow extends GangnamApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface GangnamAreaCard {
  areaGroup: GangnamAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GangnamContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GangnamFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const GNAP_META: GangnamApartmentMeta = {
  slug: "gangnam-apartment-price-2026",
  title: "강남 대장 아파트 Top10 2026",
  seoTitle: "강남 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "압구정 현대, 래미안대치팰리스, 디에이치자이개포 등 강남구 주요 아파트 Top10의 최근 기준가와 최근 5년 저점 대비 평가차익(추정)을 비교합니다.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 설계 단계 후보값",
  notice:
    "이 페이지의 가격은 강남구 주요 단지 비교 화면을 구현하기 위한 후보값입니다. 발행 전 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일, 취소 여부를 다시 확인해야 합니다.",
};

const rawApartments: GangnamApartmentRow[] = [
  {
    id: "apgujeong-hyundai",
    rank: 1,
    complexName: "압구정 현대",
    complexNameOfficial: "현대아파트",
    areaGroup: "재건축 기대권",
    legalDongLabel: "압구정동",
    addressLabel: "강남구 압구정동 한강변 재건축 기대권",
    supplyYear: 1976,
    householdCount: 9600,
    mainAreaLabel: "전용 82㎡ 유사 면적",
    stationLabel: "압구정역·한강 접근",
    schoolNote: "압구정 생활권",
    redevelopmentNote: "재건축 기대감 반영 가능성",
    latestTradePriceManwon: 520000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "82㎡ 유사 면적",
    previousYearPriceManwon: 470000,
    previousYearPeriod: "2025년 고가 거래 참고",
    fiveYearLowPriceManwon: 310000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "82㎡ 유사 면적",
    jeonsePriceManwon: 115000,
    jeonseRatio: 22.1,
    tradeCountNote: "재건축 기대권 단지라 같은 면적이라도 동, 층, 사업 기대감에 따라 가격 차이가 큽니다.",
    badge: "확인 필요",
    note: "현재 실거래가와 미래 재건축 기대감을 분리해서 해석해야 합니다.",
  },
  {
    id: "apgujeong-hanyang",
    rank: 2,
    complexName: "압구정 한양",
    complexNameOfficial: "한양아파트",
    areaGroup: "재건축 기대권",
    legalDongLabel: "압구정동",
    addressLabel: "강남구 압구정동 압구정 생활권",
    supplyYear: 1977,
    householdCount: 2860,
    mainAreaLabel: "전용 84㎡ 유사 면적",
    stationLabel: "압구정역 접근",
    redevelopmentNote: "재건축 기대감 반영 가능성",
    latestTradePriceManwon: 470000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡ 유사 면적",
    previousYearPriceManwon: 430000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 285000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡ 유사 면적",
    jeonsePriceManwon: 105000,
    jeonseRatio: 22.3,
    tradeCountNote: "압구정 재건축 단지는 공식 단지명과 동별 거래를 반드시 재확인해야 합니다.",
    badge: "확인 필요",
    note: "재건축 기대감이 가격에 섞일 수 있어 단순 84㎡ 일반 아파트와 직접 비교하면 안 됩니다.",
  },
  {
    id: "cheongdam-jai",
    rank: 3,
    complexName: "청담자이",
    areaGroup: "압구정·청담권",
    legalDongLabel: "청담동",
    addressLabel: "강남구 청담동 청담 생활권",
    supplyYear: 2011,
    householdCount: 708,
    mainAreaLabel: "전용 82~89㎡",
    stationLabel: "청담역·한강 접근",
    schoolNote: "청담 학군·고급 주거 수요",
    latestTradePriceManwon: 410000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "82~89㎡",
    previousYearPriceManwon: 385000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 260000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "82~89㎡",
    jeonsePriceManwon: 160000,
    jeonseRatio: 39,
    tradeCountNote: "청담권 초고가 거래는 거래 건수가 적어 한 건의 가격 영향이 큽니다.",
    badge: "확인 필요",
    note: "층, 조망, 면적 차이를 함께 봐야 하는 단지입니다.",
  },
  {
    id: "raemian-daechi-palace",
    rank: 4,
    complexName: "래미안대치팰리스",
    areaGroup: "대치·도곡권",
    legalDongLabel: "대치동",
    addressLabel: "강남구 대치동 학원가 생활권",
    supplyYear: 2015,
    householdCount: 1608,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "대치역·도곡역 접근",
    schoolNote: "대치 학원가 수요",
    latestTradePriceManwon: 395000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 360000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 245000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 190000,
    jeonseRatio: 48.1,
    tradeCountNote: "학군 수요가 강하지만 매매가 상승을 보장한다는 뜻은 아닙니다.",
    badge: "확인 필요",
    note: "학군 프리미엄은 단지별, 동별, 거래 시점별로 다르게 반영됩니다.",
  },
  {
    id: "tower-palace",
    rank: 5,
    complexName: "타워팰리스",
    areaGroup: "대치·도곡권",
    legalDongLabel: "도곡동" as "확인 필요",
    addressLabel: "강남구 도곡동 초고층 주상복합권",
    supplyYear: 2002,
    householdCount: 2590,
    mainAreaLabel: "전용 84㎡ 유사 면적",
    stationLabel: "도곡역·매봉역 접근",
    latestTradePriceManwon: 370000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡ 유사 면적",
    previousYearPriceManwon: 345000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 225000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡ 유사 면적",
    jeonsePriceManwon: 170000,
    jeonseRatio: 45.9,
    tradeCountNote: "주상복합은 관리비, 면적 구조, 층수 차이를 별도로 봐야 합니다.",
    badge: "확인 필요",
    note: "일반 아파트 84㎡와 전용·공용 구조가 달라 직접 비교에 주의가 필요합니다.",
  },
  {
    id: "eunma",
    rank: 6,
    complexName: "은마아파트",
    areaGroup: "재건축 기대권",
    legalDongLabel: "대치동",
    addressLabel: "강남구 대치동 재건축 기대권",
    supplyYear: 1979,
    householdCount: 4424,
    mainAreaLabel: "전용 76㎡",
    stationLabel: "대치역·학원가 접근",
    schoolNote: "대치 학군",
    redevelopmentNote: "재건축 기대감 반영 가능성",
    latestTradePriceManwon: 365000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "76㎡",
    previousYearPriceManwon: 335000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 210000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "76㎡",
    jeonsePriceManwon: 90000,
    jeonseRatio: 24.7,
    tradeCountNote: "재건축 기대와 현재 주거 가치가 함께 반영되는 대표 단지입니다.",
    badge: "확인 필요",
    note: "부담금, 사업 속도, 입주 시점은 확정값처럼 표현하면 안 됩니다.",
  },
  {
    id: "dh-xi-gaepo",
    rank: 7,
    complexName: "디에이치자이개포",
    areaGroup: "개포·일원권",
    legalDongLabel: "개포동",
    addressLabel: "강남구 일원동 신축 대단지권",
    supplyYear: 2021,
    householdCount: 1996,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "대모산입구역·개포동역 접근",
    schoolNote: "개포 신축 선호",
    latestTradePriceManwon: 370000,
    latestTradeDate: "2026년 5월",
    latestTradeArea: "84㎡ (15층)",
    previousYearPriceManwon: 345000,
    previousYearPeriod: "2025년 상반기 거래 참고",
    fiveYearLowPriceManwon: 235000,
    fiveYearLowDate: "2023년 3월",
    fiveYearLowArea: "84㎡ (등기)",
    jeonsePriceManwon: 170000,
    jeonseRatio: 45.9,
    tradeCountNote: "2026년 1~5월 37~37.5억 거래 확인. 동·층에 따라 가격 차이가 있습니다.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 신축 프리미엄은 공급·금리·전세 수요에 따라 달라질 수 있습니다.",
  },
  {
    id: "gaepo-raemian-blessige",
    rank: 8,
    complexName: "래미안블레스티지",
    areaGroup: "개포·일원권",
    legalDongLabel: "개포동",
    addressLabel: "강남구 개포동 신축 주거권",
    supplyYear: 2019,
    householdCount: 1957,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "개포동역 접근",
    latestTradePriceManwon: 330000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 305000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 205000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 165000,
    jeonseRatio: 50,
    tradeCountNote: "2026년 4~6월 31~34.5억 거래 확인. 층·시점별 편차가 큽니다.",
    badge: "확인 필요",
    note: "신축 대단지 선호가 가격에 반영될 수 있으나 보장 요소는 아닙니다.",
  },
  {
    id: "gaepo-xi-presidence",
    rank: 9,
    complexName: "개포자이프레지던스",
    areaGroup: "개포·일원권",
    legalDongLabel: "개포동",
    addressLabel: "강남구 개포동 신축 대단지권",
    supplyYear: 2023,
    householdCount: 3375,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "개포동역·대모산입구역 접근",
    latestTradePriceManwon: 360000,
    latestTradeDate: "2026년 5~6월",
    latestTradeArea: "84㎡ (중층 기준)",
    previousYearPriceManwon: 385000,
    previousYearPeriod: "2025년 10~11월 거래 참고",
    fiveYearLowPriceManwon: 241084,
    fiveYearLowDate: "2023년 1월",
    fiveYearLowArea: "84㎡ 7층 (등기)",
    jeonsePriceManwon: 155000,
    jeonseRatio: 43.1,
    tradeCountNote: "2026년 저층 33~35억, 중고층 36~39억. 입주 직후 저점 대비 현재 상승폭 크게 확인됨.",
    badge: "공식",
    note: "국토교통부 실거래가 기준 확인값. 입주장(2023년 1월) 최저가 대비 2026년 현재 약 36~37억 수준으로 상승.",
  },
  {
    id: "is-park",
    rank: 10,
    complexName: "역삼 아이파크",
    areaGroup: "삼성·역삼권",
    legalDongLabel: "역삼동",
    addressLabel: "강남구 역삼동 업무지구 접근권",
    supplyYear: 2006,
    householdCount: 541,
    mainAreaLabel: "전용 84㎡",
    stationLabel: "선릉역·역삼역 접근",
    schoolNote: "업무지구 직주근접",
    latestTradePriceManwon: 285000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 260000,
    previousYearPeriod: "2025년 거래 참고",
    fiveYearLowPriceManwon: 175000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 135000,
    jeonseRatio: 47.4,
    tradeCountNote: "업무지구 접근성이 매매가를 보장한다는 의미는 아닙니다.",
    badge: "확인 필요",
    note: "직주근접 수요와 단지 규모, 연식, 거래량을 함께 봐야 합니다.",
  },
];

export const GNAP_APARTMENTS: GangnamApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const GNAP_AREA_CARDS: GangnamAreaCard[] = [
  {
    areaGroup: "압구정·청담권",
    title: "압구정·청담권",
    description: "한강 조망, 초고가 희소성, 고급 주거 수요가 함께 작동하는 권역입니다.",
    priceInterpretation: "강남 상단 가격을 만드는 권역이지만 거래 건수가 적어 한 건의 영향이 큽니다.",
    caution: "재건축 기대감과 현재 실거래가를 분리해서 봐야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "대치·도곡권",
    title: "대치·도곡권",
    description: "학군 수요와 전통 고가 주거 선호가 강한 권역입니다.",
    priceInterpretation: "학군 프리미엄은 단지와 거래 시점에 따라 다르게 반영됩니다.",
    caution: "학군이 매매가 상승을 보장한다는 표현은 금지합니다.",
    badge: "추정",
  },
  {
    areaGroup: "개포·일원권",
    title: "개포·일원권",
    description: "신축 대단지와 정비사업 완료 단지가 가격을 이끄는 권역입니다.",
    priceInterpretation: "입주 연식, 단지 규모, 전세 수요를 함께 봐야 합니다.",
    caution: "신축 프리미엄과 거래 시점 차이를 분리해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "삼성·역삼권",
    title: "삼성·역삼권",
    description: "업무지구 접근성과 직주근접 수요가 강한 권역입니다.",
    priceInterpretation: "직주근접 수요가 있어도 단지 규모와 연식에 따라 가격 차이가 납니다.",
    caution: "업무지구 접근성이 매매가를 보장한다는 표현은 피해야 합니다.",
    badge: "추정",
  },
  {
    areaGroup: "재건축 기대권",
    title: "재건축 기대권",
    description: "사업 단계, 대지지분, 조합 상황, 부담금 기대가 가격에 섞이는 권역입니다.",
    priceInterpretation: "현재 실거래가와 미래 기대감이 함께 반영될 수 있습니다.",
    caution: "사업 속도, 부담금, 입주 시점은 확정값처럼 표현하지 않습니다.",
    badge: "확인 필요",
  },
];

export const GNAP_CONTEXT: GangnamContextCard[] = [
  {
    title: "강남 가격은 한 가지 이유로 설명되지 않습니다",
    body: "압구정·청담의 희소성, 대치 학군, 개포 신축, 삼성·역삼 직주근접, 재건축 기대감이 서로 다른 방식으로 가격에 반영됩니다.",
    badge: "추정",
  },
  {
    title: "재건축 기대감은 별도 변수입니다",
    body: "압구정 현대, 압구정 한양, 은마처럼 재건축 기대가 있는 단지는 현재 실거래가와 미래 기대감을 분리해서 읽어야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "전세가율은 보조 지표입니다",
    body: "전세가율은 실거주 수요를 참고하는 데 도움을 주지만 매매가 상승을 보장하지 않습니다.",
    badge: "추정",
  },
  {
    title: "후보값은 원자료 검증 전 단계입니다",
    body: "발행 전 국토교통부 실거래가 공개시스템에서 거래일, 면적, 취소 여부, 공식 단지명을 다시 확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const GNAP_METHOD: string[] = [
  "서울특별시 강남구 행정구역 기준으로 후보 단지를 정리했습니다.",
  "전용 84㎡를 우선 기준으로 삼되, 재건축·초고가 단지는 유사 면적을 별도로 표시했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점권 참고가를 뺀 단순 시세 차이입니다.",
  "취득세, 중개보수, 보유세, 대출이자, 양도세, 수리비는 반영하지 않았습니다.",
  "재건축 기대 단지는 사업 속도, 부담금, 입주 시점을 확정적으로 표현하지 않습니다.",
];

export const GNAP_RISKS: string[] = [
  "강남구 전체를 하나의 평균 가격처럼 보면 생활권별 차이를 놓칠 수 있습니다.",
  "재건축 기대 단지는 사업 속도, 부담금, 조합 상황에 따라 가격 해석이 달라질 수 있습니다.",
  "같은 단지라도 동, 층, 조망, 면적, 수리 상태, 거래 시점에 따라 가격 차이가 큽니다.",
  "초고가 단지는 거래 건수가 적어 한 건의 거래가 전체 흐름처럼 보일 수 있습니다.",
  "금리, DSR, 취득세, 보유세, 대출 조건은 실제 부담 가능성을 크게 바꿉니다.",
];

export const GNAP_FAQ: GangnamFaqItem[] = [
  {
    question: "강남 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 검색 수요, 생활권 대표성, 단지 규모, 입주 연식, 데이터 확인 가능성을 함께 봅니다. 매수 추천 순위가 아니라 비교를 위한 후보 목록입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 평가차익(추정)으로 표시합니다.",
  },
  {
    question: "강남 아파트는 왜 비싼가요?",
    answer:
      "압구정·청담의 희소성, 대치 학군 수요, 개포 신축 선호, 삼성·역삼 업무지구 접근성, 재건축 기대감이 함께 작동합니다. 다만 단지별 가격 논리는 서로 다릅니다.",
  },
  {
    question: "압구정 재건축 단지와 개포 신축 단지를 같이 비교해도 되나요?",
    answer:
      "직접 비교에는 주의가 필요합니다. 재건축 단지는 미래 기대감이 섞일 수 있고, 개포 신축 단지는 입주 연식과 실거주 선호가 크게 반영됩니다.",
  },
  {
    question: "재건축 기대 단지 가격은 어떻게 봐야 하나요?",
    answer:
      "현재 실거래가와 미래 기대감을 분리해서 봐야 합니다. 사업 속도, 부담금, 금리, 조합 상황에 따라 가격 해석이 달라집니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되 최근 거래가 없으면 유사 면적 또는 대표 면적을 별도로 표시합니다. 면적이 다르면 같은 단지라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "학군이 좋으면 매매가가 보장되나요?",
    answer:
      "아닙니다. 학군 수요는 가격에 영향을 줄 수 있지만 금리, 대출 규제, 공급, 거래 시점, 단지 상태에 따라 가격은 달라질 수 있습니다.",
  },
  {
    question: "지금 강남 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const GNAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 평가차익(추정)을 비교합니다.",
  },
  {
    href: "/reports/yongsan-apartment-price-2026/",
    label: "용산 대장 아파트 Top10",
    description: "한남·이촌·용산 생활권의 초고가 거래와 개발 기대감을 구분해서 봅니다.",
  },
  {
    href: "/reports/seongdong-apartment-price-2026/",
    label: "성동 대장 아파트 Top10",
    description: "성수·서울숲·옥수 생활권 주요 단지의 가격 변화를 비교합니다.",
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

export const GNAP_SEO_INTRO: string[] = [
  "강남 아파트 실거래가를 볼 때는 먼저 생활권을 나눠야 합니다. 압구정·청담권, 대치·도곡권, 개포·일원권, 삼성·역삼권, 재건축 기대권은 가격을 만드는 이유가 서로 다릅니다.",
  "이 리포트는 압구정 현대, 압구정 한양, 청담자이, 래미안대치팰리스, 디에이치자이개포 같은 후보 단지를 같은 화면에서 비교하도록 만든 페이지입니다. 현재 값은 설계 단계 후보값이므로 발행 전 원자료 재확인이 필요합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도세, 대출이자, 수리비를 제외한 단순 시세 차이입니다.",
  "재건축 기대 단지는 일반 신축 단지와 해석 방식이 다릅니다. 사업 기대감이 가격에 반영될 수 있으므로 현재 실거래가와 미래 기대감을 분리해서 봐야 합니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 국토교통부 실거래가 원자료, 등기, 대출 가능액, 세금, 관리비, 현장 컨디션을 함께 확인해야 합니다.",
];

export const GNAP_SEO_CRITERIA: string[] = [
  "강남구 행정구역 안의 주요 고가 단지 후보를 생활권별로 분류했습니다.",
  "전용 84㎡를 우선 기준으로 삼되, 재건축·초고가 단지는 유사 면적을 별도로 표시했습니다.",
  "평가차익과 상승률은 모두 추정 계산이며 공식 수익률이 아닙니다.",
  "재건축 기대감, 학군, 신축 프리미엄, 직주근접성은 가격 보장 요소로 표현하지 않습니다.",
  "발행 전 국토교통부 실거래가 공개시스템에서 단지명과 거래일을 다시 확인해야 합니다.",
];
