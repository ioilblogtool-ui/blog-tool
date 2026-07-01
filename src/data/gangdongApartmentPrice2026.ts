export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type GangdongAreaGroup =
  | "고덕·상일권"
  | "둔촌·성내권"
  | "명일·암사권"
  | "천호·강동역권";

export interface GangdongApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface GangdongApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: GangdongAreaGroup;
  legalDongLabel: "고덕동" | "상일동" | "둔촌동" | "명일동" | "암사동" | "천호동" | "강일동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  supplyNote?: string;
  redevelopmentNote?: string;
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

export interface GangdongAreaCard {
  areaGroup: GangdongAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface GangdongContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface GangdongFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const GDAP_META: GangdongApartmentMeta = {
  slug: "gangdong-apartment-price-2026",
  title: "강동 대장 아파트 Top10 2026",
  seoTitle: "강동 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마 올랐을까",
  description:
    "고덕그라시움, 고덕아르테온, 올림픽파크포레온, 래미안솔베뉴 등 강동구 주요 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 고덕·상일·둔촌·명일·암사 생활권 차이와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 말 설계 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 재확인해야 하는 참고값입니다. 둔촌 재건축·입주 물량 기대감과 현재 실거래가는 분리해서 봐야 합니다.",
};

const withGain = <T extends Omit<GangdongApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): GangdongApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const GDAP_APARTMENTS: GangdongApartmentRow[] = [
  withGain({
    id: "godeok-gracium",
    rank: 1,
    complexName: "고덕그라시움",
    complexNameOfficial: "고덕그라시움",
    areaGroup: "고덕·상일권",
    legalDongLabel: "고덕동",
    addressLabel: "고덕동 대단지 생활권",
    supplyYear: 2019,
    householdCount: 4932,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "상일동역·고덕역 생활권",
    supplyNote: "대단지라 동·층·향·역 접근성에 따른 편차가 큽니다.",
    redevelopmentNote: "고덕 신축 대단지 선호와 학군·생활 인프라 수요 참고",
    latestTradePriceManwon: 253000,
    latestTradeDate: "2026년 5월 20일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 250000,
    previousYearPeriod: "2025년 10~11월 대표 거래 참고 (24.9~25.4억 범위)",
    fiveYearLowPriceManwon: 150000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 45,
    tradeCountNote: "2026년 5월 84㎡ 실거래 24~25.3억 범위. 고층(26층) 25.3억, 중층 24~25억, 저층 24억 수준. 동·층·향에 따라 1억 이상 편차 발생.",
    badge: "보도 기반",
    note: "2026년 5월 84㎡ 실거래가 24~25.3억 범위입니다. 4,932세대 대단지로 동·층·향·역 접근성에 따른 편차를 확인해야 합니다.",
  }),
  withGain({
    id: "godeok-arteon",
    rank: 2,
    complexName: "고덕아르테온",
    complexNameOfficial: "고덕아르테온",
    areaGroup: "고덕·상일권",
    legalDongLabel: "상일동",
    addressLabel: "상일동 신축 대단지축",
    supplyYear: 2020,
    householdCount: 4066,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "상일동역 생활권",
    supplyNote: "신축 대단지 프리미엄과 역 접근성 차이를 함께 봐야 합니다.",
    redevelopmentNote: "고덕·상일권 신축 선호 참고",
    latestTradePriceManwon: 230000,
    latestTradeDate: "2026년 6월 19일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 230000,
    previousYearPeriod: "2025년 10월 대표 거래 참고 (22~23억 범위)",
    fiveYearLowPriceManwon: 145000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 44,
    tradeCountNote: "2026년 상반기 84㎡ 실거래 22~24억 범위. 저층·1층 20~21억대, 중층 22~23억, 고층 23~24억. 층수에 따라 2억 이상 편차 발생.",
    badge: "보도 기반",
    note: "2026년 6월 84㎡ 실거래가 23억 수준입니다. 4,066세대 대단지로 동·층·향에 따른 편차가 크며, 고덕그라시움과 달리 2025년 대비 가격 변동이 크지 않습니다.",
  }),
  withGain({
    id: "godeok-xi",
    rank: 3,
    complexName: "고덕자이",
    complexNameOfficial: "고덕자이",
    areaGroup: "고덕·상일권",
    legalDongLabel: "상일동",
    addressLabel: "상일동 고덕 생활권",
    supplyYear: 2021,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "상일동역 접근",
    supplyNote: "입주연식과 단지 규모를 함께 비교해야 합니다.",
    redevelopmentNote: "고덕 신축축 가격 연동 참고",
    latestTradePriceManwon: 191000,
    latestTradeDate: "2026년 5월 16일",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 190000,
    previousYearPeriod: "2025년 10월 대표 거래 참고 (17.8~19억 범위)",
    fiveYearLowPriceManwon: 135000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonseRatio: 45,
    tradeCountNote: "2026년 5월 84㎡ 실거래 18.7~19.3억 범위. 저층 18.7억, 중층 19~19.3억. 고덕그라시움·아르테온 대비 낮은 가격대.",
    badge: "보도 기반",
    note: "2026년 5월 84㎡ 실거래가 18.7~19.3억 범위입니다. 고덕그라시움(25억대), 아르테온(23억대) 대비 낮은 가격대로 단지 규모·브랜드·입주연식 차이를 함께 봐야 합니다.",
  }),
  withGain({
    id: "raemian-solvenue",
    rank: 4,
    complexName: "래미안명일역솔베뉴",
    complexNameOfficial: "래미안명일역솔베뉴",
    areaGroup: "명일·암사권",
    legalDongLabel: "명일동",
    addressLabel: "명일동 생활권",
    supplyYear: 2019,
    mainAreaLabel: "전용 78㎡ (84㎡ 없음)",
    stationLabel: "명일역·굽은다리역 접근",
    supplyNote: "이 단지의 대표 거래 면적은 78㎡입니다. 84㎡ 기준 단지와 직접 비교 시 주의해야 합니다.",
    redevelopmentNote: "명일 구축·신축 혼재 생활권 참고",
    latestTradePriceManwon: 204000,
    latestTradeDate: "2026년 4월 4일",
    latestTradeArea: "78㎡",
    previousYearPriceManwon: 195000,
    previousYearPeriod: "2025년 9월 대표 거래 참고 (18~20억 범위)",
    fiveYearLowPriceManwon: 139500,
    fiveYearLowDate: "2024년 2월 저점",
    fiveYearLowArea: "78㎡",
    jeonseRatio: 46,
    tradeCountNote: "2026년 상반기 78㎡ 실거래 20~21.7억 범위. 84㎡ 단지와 면적이 달라 직접 비교 시 주의. 2024년 2월 저점 13억9,500 확인.",
    badge: "보도 기반",
    note: "대표 면적이 78㎡로 84㎡ 기준 단지와 직접 가격 비교 시 주의가 필요합니다. 2026년 4월 78㎡ 실거래가 20억4,000입니다.",
  }),
  withGain({
    id: "olympic-park-foreon",
    rank: 5,
    complexName: "올림픽파크포레온",
    complexNameOfficial: "올림픽파크포레온",
    areaGroup: "둔촌·성내권",
    legalDongLabel: "둔촌동",
    addressLabel: "둔촌동 초대형 입주 생활권",
    supplyYear: 2025,
    householdCount: 12032,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "둔촌동역·올림픽공원역 생활권",
    supplyNote: "초대형 입주 물량이라 입주 초기 거래와 안정화 이후 거래를 분리해야 합니다.",
    redevelopmentNote: "둔촌 재건축 기대감과 현재 실거래가는 별도 기준으로 해석해야 합니다.",
    latestTradePriceManwon: 313000,
    latestTradeDate: "2026.06.25",
    latestTradeArea: "84㎡ 19층",
    previousYearPriceManwon: 320000,
    previousYearPeriod: "2025년 10월 기준",
    fiveYearLowPriceManwon: 150000,
    fiveYearLowDate: "분양·입주 초기 기준 참고",
    fiveYearLowArea: "84㎡대",
    jeonseRatio: 43,
    tradeCountNote: "최근 입주축이라 5년 저점 비교가 기존 단지와 다를 수 있습니다.",
    badge: "",
    note: "둔촌 재건축 대표 단지입니다. 입주 물량 효과와 현재 실거래를 분리해야 합니다.",
  }),
  withGain({
    id: "dunchon-rebuild-candidate",
    rank: 6,
    complexName: "둔촌주공 재건축 관련 후보",
    areaGroup: "둔촌·성내권",
    legalDongLabel: "둔촌동",
    addressLabel: "둔촌·성내 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "둔촌동역 접근",
    supplyNote: "재건축 전후 단지명과 면적 기준을 구분해야 합니다.",
    redevelopmentNote: "재건축 기대감은 현재 실거래가와 분리 필요",
    latestTradePriceManwon: 175000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 160000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 125000,
    fiveYearLowDate: "2021~2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "발행 전 공식 단지명, 거래 면적, 취소 여부 확인이 필요합니다.",
    badge: "확인 필요",
    note: "둔촌권 가격 맥락을 보완하는 후보이며, 실제 발행 전 공식명으로 교체해야 합니다.",
  }),
  withGain({
    id: "godeok-central-ipark",
    rank: 7,
    complexName: "고덕센트럴아이파크",
    complexNameOfficial: "고덕센트럴아이파크",
    areaGroup: "고덕·상일권",
    legalDongLabel: "상일동",
    addressLabel: "상일동 생활권",
    supplyYear: 2019,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "상일동역 접근",
    supplyNote: "고덕·상일권 안에서 대단지 상위권과 가격 간격을 확인해야 합니다.",
    redevelopmentNote: "상일동 신축축 실거주 수요 참고",
    latestTradePriceManwon: 207000,
    latestTradeDate: "2026.05.13",
    latestTradeArea: "84㎡ 21층",
    previousYearPriceManwon: 192500,
    previousYearPeriod: "2025년 10월 기준",
    fiveYearLowPriceManwon: 143000,
    fiveYearLowDate: "2024.12.02",
    fiveYearLowArea: "84㎡ 3층",
    jeonseRatio: 47,
    tradeCountNote: "동별 가격 편차와 동일 면적 여부 확인이 필요합니다.",
    badge: "",
    note: "고덕·상일권 가격대를 넓게 보는 보완 후보입니다.",
  }),
  withGain({
    id: "amsa-river-candidate",
    rank: 8,
    complexName: "암사동 한강 인접 대표 단지",
    areaGroup: "명일·암사권",
    legalDongLabel: "암사동",
    addressLabel: "암사 한강 인접 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "암사역·한강 접근",
    supplyNote: "한강 접근성과 단지 연식에 따른 가격 차이를 분리해야 합니다.",
    redevelopmentNote: "한강 인접 실거주 수요 참고",
    latestTradePriceManwon: 150000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 135000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 100000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "대표 단지명과 한강 접근성, 면적 기준을 확인해야 합니다.",
    badge: "확인 필요",
    note: "명일·암사권을 보완하는 후보입니다. 발행 전 공식 단지명 확인이 필요합니다.",
  }),
  withGain({
    id: "cheonho-gangdong-station-candidate",
    rank: 9,
    complexName: "천호·강동역 인접 대표 단지",
    areaGroup: "천호·강동역권",
    legalDongLabel: "천호동",
    addressLabel: "천호역·강동역 상권 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "천호역·강동역 접근",
    supplyNote: "상권 접근성과 주거 쾌적성의 균형을 확인해야 합니다.",
    redevelopmentNote: "천호·성내 정비 기대는 현재 실거래와 분리 필요",
    latestTradePriceManwon: 145000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 130000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 95000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "역세권 단지명과 거래 면적, 세대 수 확인이 필요합니다.",
    badge: "확인 필요",
    note: "천호·강동역권의 도심 접근성과 상권 프리미엄을 보는 후보입니다.",
  }),
  withGain({
    id: "gangil-sangil-candidate",
    rank: 10,
    complexName: "강일·상일동 대표 단지",
    areaGroup: "고덕·상일권",
    legalDongLabel: "강일동",
    addressLabel: "강일·상일 외곽 생활권",
    mainAreaLabel: "대표 면적 확인 필요",
    stationLabel: "강일역·상일동역 접근",
    supplyNote: "강일권은 고덕 중심축과 가격 논리가 다를 수 있습니다.",
    redevelopmentNote: "고덕 업무·교통 접근 기대 참고",
    latestTradePriceManwon: 132000,
    latestTradeDate: "공식 단지명 확인 필요",
    latestTradeArea: "대표 면적 확인 필요",
    previousYearPriceManwon: 118000,
    previousYearPeriod: "2025년 참고",
    fiveYearLowPriceManwon: 88000,
    fiveYearLowDate: "2022년 저점권 참고",
    fiveYearLowArea: "대표 면적 확인 필요",
    tradeCountNote: "강일권 대표 단지명과 거래 건수 확인이 필요합니다.",
    badge: "확인 필요",
    note: "강동 동부 생활권까지 비교 범위를 넓히는 후보입니다.",
  }),
];

export const GDAP_AREA_CARDS: GangdongAreaCard[] = [
  {
    areaGroup: "고덕·상일권",
    title: "고덕·상일권",
    description: "고덕그라시움, 고덕아르테온 등 신축 대단지와 학군·생활 인프라 수요가 집중되는 축입니다.",
    priceInterpretation: "대단지 신축 선호와 역 접근성, 단지 규모가 가격을 크게 좌우합니다.",
    caution: "동·층·향·역 접근성에 따라 같은 84㎡도 가격 차이가 큽니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "둔촌·성내권",
    title: "둔촌·성내권",
    description: "올림픽파크포레온 입주와 둔촌 재건축 이슈가 함께 작용하는 생활권입니다.",
    priceInterpretation: "초대형 입주 물량은 거래가와 전세가를 동시에 흔들 수 있습니다.",
    caution: "재건축 기대감과 현재 실거래가를 같은 값처럼 보면 안 됩니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "명일·암사권",
    title: "명일·암사권",
    description: "명일 실거주 선호와 암사 한강 접근성을 함께 보는 강동 동북 생활권입니다.",
    priceInterpretation: "신축성, 학교, 한강 접근성, 역 접근성의 조합이 중요합니다.",
    caution: "단지 연식과 면적 기준을 맞추지 않으면 비교가 왜곡될 수 있습니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "천호·강동역권",
    title: "천호·강동역권",
    description: "상권, 교통, 구도심 정비 기대가 함께 언급되는 역세권 생활권입니다.",
    priceInterpretation: "역세권 접근성과 상권 편의가 장점이지만 단지별 주거 환경 차이가 큽니다.",
    caution: "정비 기대는 현재 거래가와 분리해서 확인해야 합니다.",
    badge: "추정",
  },
];

export const GDAP_CONTEXT: GangdongContextCard[] = [
  {
    title: "고덕 신축 대단지 축",
    body: "고덕·상일권은 2019년 이후 입주한 대단지가 많아 강동 내 신축 가격 기준점으로 자주 비교됩니다. 다만 동별 역 접근성과 타입 차이가 큽니다.",
    badge: "확인 필요",
  },
  {
    title: "올림픽파크포레온 입주 효과",
    body: "둔촌권은 초대형 입주 물량이 매매와 전세 시장에 동시에 영향을 줄 수 있습니다. 입주 초기 거래와 안정화 이후 거래를 분리해야 합니다.",
    badge: "확인 필요",
  },
  {
    title: "명일·암사 실거주 수요",
    body: "명일·암사권은 학교, 생활 인프라, 한강 접근성 같은 실거주 요소가 가격을 설명하는 경우가 많습니다.",
    badge: "추정",
  },
  {
    title: "천호·강동역 상권 접근성",
    body: "천호·강동역권은 교통과 상권 접근성이 강점입니다. 구도심 정비 기대는 현재 실거래가와 분리해서 봐야 합니다.",
    badge: "추정",
  },
];

export const GDAP_METHOD: string[] = [
  "서울특별시 강동구 행정구역을 기준으로 단지를 묶고, 생활권은 고덕·상일, 둔촌·성내, 명일·암사, 천호·강동역권으로 구분했습니다.",
  "84㎡ 거래가 있는 단지는 84㎡를 우선 기준으로 삼고, 후보 단지는 대표 면적 확인 필요로 별도 표기했습니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 참고가를 뺀 단순 시세 차이입니다.",
  "취득세, 중개보수, 보유세, 대출이자, 양도소득세, 수리비는 모두 제외했습니다.",
  "둔촌 재건축·입주 물량 기대감은 현재 실거래가와 분리해 설명하며, 가격 보장 표현을 사용하지 않습니다.",
  "발행 전 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래월, 취소 여부를 재검증해야 합니다.",
];

export const GDAP_RISKS: string[] = [
  "같은 단지라도 동, 층, 향, 조망, 역 접근성, 면적 타입에 따라 가격 차이가 큽니다.",
  "입주 초기 단지는 거래 건수와 전세 물량 영향으로 가격 변동성이 커질 수 있습니다.",
  "재건축 기대감은 확정 수익이나 가격 보장을 의미하지 않습니다.",
  "후보 단지는 공식 단지명과 거래 면적을 확인한 뒤 실제 발행 데이터로 교체해야 합니다.",
  "실제 매수 판단은 자금 계획, 대출 조건, 세금, 현장 확인을 함께 거쳐야 합니다.",
];

export const GDAP_FAQ: GangdongFaqItem[] = [
  {
    question: "강동 대장 아파트는 어떤 기준으로 선정하나요?",
    answer:
      "최근 실거래가 수준, 거래 데이터 확인 가능성, 검색 수요, 생활권 대표성, 단지 규모와 입주연식을 함께 봅니다. 순위는 매수 추천이나 투자 순위가 아니라 비교를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다. 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "고덕그라시움과 고덕아르테온은 왜 자주 비교되나요?",
    answer:
      "둘 다 고덕·상일권의 신축 대단지로 검색 수요와 실거주 선호가 높기 때문입니다. 다만 역 접근성, 동·층·향, 거래 타입에 따라 가격 차이가 날 수 있습니다.",
  },
  {
    question: "올림픽파크포레온은 기존 강동 단지와 같은 방식으로 비교해도 되나요?",
    answer:
      "주의가 필요합니다. 초대형 입주 단지는 입주 초기 거래, 전세 물량, 분양권·입주권 맥락이 섞일 수 있어 기존 단지의 5년 저점 비교와 다르게 읽어야 합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없거나 후보 단지인 경우 대표 면적 확인 필요로 표시합니다. 면적이 다르면 같은 생활권이라도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "강동구 실거래가는 어디서 확인해야 하나요?",
    answer:
      "국토교통부 실거래가 공개시스템에서 서울특별시 강동구, 단지명, 전용면적, 거래월, 취소 여부를 직접 확인해야 합니다. 이 페이지의 값은 발행 전 재검증이 필요한 참고값입니다.",
  },
  {
    question: "둔촌 재건축 기대감은 가격에 얼마나 반영되나요?",
    answer:
      "기대감은 일부 가격에 반영될 수 있지만 입주 물량, 금리, 대출 규제, 시장 심리에 따라 달라집니다. 이 리포트에서는 기대감과 현재 실거래가를 분리해서 설명합니다.",
  },
  {
    question: "지금 강동 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 판단은 자금 계획, 대출 조건, 실거주 필요, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const GDAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/songpa-apartment-price-2026/",
    label: "송파 대장 아파트 Top10",
    description: "잠실·가락·문정 생활권 주요 단지의 실거래가와 저점 대비 변화를 확인합니다.",
  },
  {
    href: "/reports/seoul-84-apartment-prices/",
    label: "서울 국평 아파트 가격 비교",
    description: "서울 주요 구의 84㎡ 아파트 가격을 한 화면에서 비교합니다.",
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

export const GDAP_SEO_INTRO: string[] = [
  "강동 아파트 실거래가를 볼 때는 고덕·상일 신축 대단지, 둔촌·성내 입주 물량, 명일·암사 실거주 수요, 천호·강동역 상권 접근성을 나눠 봐야 합니다. 같은 강동구라도 가격을 만드는 이유가 다릅니다.",
  "이 리포트는 강동구 주요 단지의 최근 기준가와 최근 5년 저점권 참고가를 나란히 놓고 평가차익(추정)을 계산합니다. 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 제외한 단순 시세 차이입니다.",
  "고덕그라시움과 고덕아르테온은 신축 대단지라는 공통점이 있지만 동·층·향·역 접근성에 따라 가격 차이가 큽니다. 동일 84㎡라도 거래 조건을 맞춰 확인해야 합니다.",
  "올림픽파크포레온은 초대형 입주 물량이라는 특수성이 있어 기존 단지의 저점 비교와 다르게 읽어야 합니다. 입주 초기 거래, 전세 물량, 분양·입주권 맥락을 현재 실거래와 분리해야 합니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 서울특별시 강동구, 단지명, 면적, 거래월, 취소 여부를 다시 확인하고 취득세와 대출 조건까지 함께 계산해야 합니다.",
];

export const GDAP_SEO_CRITERIA: string[] = [
  "서울특별시 강동구 행정구역 기준으로 단지를 묶되, 생활권은 고덕·상일, 둔촌·성내, 명일·암사, 천호·강동역권으로 나눠 표시했습니다.",
  "84㎡ 거래가 있는 단지는 84㎡를 우선 사용하고, 후보 단지는 대표 면적 확인 필요로 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "둔촌 재건축·입주 물량 기대감은 현재 실거래가와 분리해서 설명하며 가격 보장 표현을 사용하지 않습니다.",
  "후보값은 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
