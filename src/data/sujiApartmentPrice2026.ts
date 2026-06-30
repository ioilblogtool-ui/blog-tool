export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export type SujiAreaGroup =
  | "성복역권"
  | "상현역권"
  | "동천역권"
  | "수지구청역권"
  | "풍덕천권"
  | "광교 인접";

export interface SujiApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface SujiApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial?: string;
  areaGroup: SujiAreaGroup;
  legalDongLabel: "성복동" | "상현동" | "동천동" | "풍덕천동" | "죽전동" | "확인 필요";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
  stationLabel?: string;
  schoolNote?: string;
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

export interface SujiLifestyleCard {
  areaGroup: SujiAreaGroup;
  title: string;
  description: string;
  priceInterpretation: string;
  caution: string;
  badge: DataBadge;
}

export interface SujiContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface SujiFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const SJAP_META: SujiApartmentMeta = {
  slug: "suji-apartment-price-2026",
  title: "수지 대장 아파트 Top10 2026",
  seoTitle: "수지 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나",
  description:
    "성복역 롯데캐슬 골드타운, e편한세상 수지 등 수지 대장 아파트 Top10의 84㎡ 최근 실거래가와 최근 5년 최저가 대비 평가차익을 비교합니다. 신분당선·학군·판교 접근성과 데이터 기준도 함께 확인하세요.",
  updatedAt: "2026-06-30",
  dataAsOf: "2026년 6월 말 발행 기준",
  notice:
    "가격은 국토교통부 실거래가 공개시스템 재확인이 필요한 참고용 기준값입니다. 단지, 동, 층, 향, 면적, 거래 시점에 따라 실제 가격은 달라질 수 있습니다.",
};

const withGain = <T extends Omit<SujiApartmentRow, "estimatedGainManwon" | "estimatedGainRate">>(
  row: T
): SujiApartmentRow => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
};

export const SJAP_APARTMENTS: SujiApartmentRow[] = [
  withGain({
    id: "seongbok-lotte-castle-goldtown",
    rank: 1,
    complexName: "성복역 롯데캐슬 골드타운",
    complexNameOfficial: "수지성복역롯데캐슬골드타운",
    areaGroup: "성복역권",
    legalDongLabel: "성복동",
    addressLabel: "성복동 · 신분당선 성복역 역세권",
    supplyYear: 2017,
    householdCount: 1694,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 성복역 도보권",
    schoolNote: "성복초·성복중 학군",
    latestTradePriceManwon: 165000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (15.5~17.47억 범위, 84~85㎡)",
    latestTradeArea: "84~85㎡",
    previousYearPriceManwon: 150000,
    previousYearPeriod: "2025년 12월 대표 거래 참고 (14.5~15.75억)",
    fiveYearLowPriceManwon: 105000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 73000,
    jeonseRatio: 44.2,
    tradeCountNote: "2026년 5~6월 84~85㎡ 실거래 15.5~17.47억. 고층(34층) 17.4억대, 중층 16~16.5억, 저층 15.5억 이하로 층수 편차 큼.",
    badge: "확인 필요",
    note: "2026년 5~6월 84~85㎡ 실거래가 15.5~17.47억 범위입니다. 신분당선 성복역 직역세권 수지 대표 신축 단지로 층수에 따른 가격 편차가 1.5~2억 발생합니다.",
  }),
  withGain({
    id: "e-pyeonhan-suji",
    rank: 2,
    complexName: "e편한세상 수지",
    complexNameOfficial: "e편한세상수지",
    areaGroup: "수지구청역권",
    legalDongLabel: "풍덕천동",
    addressLabel: "풍덕천동 · 수지구청역 인근",
    supplyYear: 2004,
    householdCount: 1338,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 수지구청역 접근 가능",
    schoolNote: "수지 중심 학군",
    latestTradePriceManwon: 160000,
    latestTradeDate: "2026년 5~6월 실거래 기준 (15.3~16.4억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 135000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (13.1~15억)",
    fiveYearLowPriceManwon: 91000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 68000,
    jeonseRatio: 42.5,
    tradeCountNote: "2026년 5~6월 84㎡ 실거래 15.3~16.4억. 고층(24~28층) 16~16.4억, 중층(13~15층) 15.7~16.3억, 저층(4층 이하) 15억 이하로 층수 편차 있음.",
    badge: "확인 필요",
    note: "2026년 5~6월 84㎡ 실거래가 15.3~16.4억 범위입니다. 수지구 중심 학군·인프라 선호 단지로, 2025년 하반기(12.6~13.7억) 대비 약 2~3억 회복했습니다.",
  }),
  withGain({
    id: "dongcheon-xi",
    rank: 3,
    complexName: "동천자이",
    complexNameOfficial: "동천자이",
    areaGroup: "동천역권",
    legalDongLabel: "동천동",
    addressLabel: "동천동 · 신분당선 동천역 인근",
    supplyYear: 2014,
    householdCount: 1375,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 동천역 도보권",
    schoolNote: "동천동 학군, 판교 접근 우위",
    latestTradePriceManwon: 110000,
    latestTradeDate: "2026년 2~5월 실거래 기준 (10.5~11.5억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 100000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (9.75~10.7억)",
    fiveYearLowPriceManwon: 85000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 50000,
    jeonseRatio: 45.5,
    tradeCountNote: "2026년 2~5월 84㎡ 실거래 10.5~11.5억. 고층(31~36층) 11~11.5억, 중·저층 10.5억 수준. 2026년 4월 7.6억(7층)은 특수거래로 제외.",
    badge: "확인 필요",
    note: "2026년 2~5월 84㎡ 실거래가 10.5~11.5억 범위입니다. 신분당선 동천역 접근성과 판교 직주근접 수요가 가격을 지지합니다.",
  }),
  withGain({
    id: "dongcheon-raemian-eastpalace",
    rank: 4,
    complexName: "동천 래미안 이스트팰리스",
    complexNameOfficial: "동천래미안이스트팰리스",
    areaGroup: "동천역권",
    legalDongLabel: "동천동",
    addressLabel: "동천동 · 신분당선 동천역권",
    supplyYear: 2016,
    householdCount: 1562,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 동천역 도보권",
    schoolNote: "동천동 학군 접근성",
    latestTradePriceManwon: 115000,
    latestTradeDate: "2026년 2~5월 실거래 기준 (11.47~12억 범위, 84㎡)",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 107000,
    previousYearPeriod: "2025년 10~12월 대표 거래 참고 (10.85~11.3억)",
    fiveYearLowPriceManwon: 92500,
    fiveYearLowDate: "2023년 6월 저점 (9.25억)",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 53000,
    jeonseRatio: 46.1,
    tradeCountNote: "2026년 2~5월 84㎡ 실거래 11.47~12억. 12층 12억, 6~7층 11.5~11.7억, 2~3층 11.5억 수준. 층수 편차 약 5,000만원.",
    badge: "확인 필요",
    note: "2026년 2~5월 84㎡ 실거래가 11.47~12억 범위입니다. 5년 저점은 2023년 6월 9.25억이며, 그 대비 약 2.2억 회복한 수준입니다.",
  }),
  withGain({
    id: "raemian-suji-eastpark",
    rank: 5,
    complexName: "래미안 수지 이스트파크",
    complexNameOfficial: "래미안수지이스트파크",
    areaGroup: "풍덕천권",
    legalDongLabel: "풍덕천동",
    addressLabel: "풍덕천동 · 수지구청 생활권",
    supplyYear: 2011,
    householdCount: 1204,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 수지구청역 도보 가능",
    latestTradePriceManwon: 115000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 102000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 78000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 52000,
    jeonseRatio: 45,
    tradeCountNote: "수지 중심 생활권 단지로 거래 건수와 면적 일치 여부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "브랜드·준신축성을 가진 수지 중심 생활권 단지입니다. 풍덕천동 가격대 비교축 역할을 합니다.",
  }),
  withGain({
    id: "seongbok-kcc-switzen",
    rank: 6,
    complexName: "성복역 KCC스위첸",
    complexNameOfficial: "수지성복역KCC스위첸",
    areaGroup: "성복역권",
    legalDongLabel: "성복동",
    addressLabel: "성복동 · 신분당선 성복역권",
    supplyYear: 2018,
    householdCount: 1130,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 성복역 도보권",
    latestTradePriceManwon: 107000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 93000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 72000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 47000,
    jeonseRatio: 44,
    tradeCountNote: "같은 성복역권이라도 단지별 역 거리와 동 위치에 따라 가격 차이가 납니다.",
    badge: "확인 필요",
    note: "성복역권 가격대 보조 후보입니다. 롯데캐슬 골드타운과 함께 성복동 신축권 가격대를 확인할 때 참고합니다.",
  }),
  withGain({
    id: "suji-hillstate-seongbok",
    rank: 7,
    complexName: "힐스테이트 수지 성복",
    complexNameOfficial: "힐스테이트수지성복",
    areaGroup: "성복역권",
    legalDongLabel: "성복동",
    addressLabel: "성복동 · 성복역권 브랜드 단지",
    supplyYear: 2020,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 성복역 도보 접근",
    latestTradePriceManwon: 98000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 86000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 67000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 44000,
    jeonseRatio: 45,
    tradeCountNote: "거래 건수가 적어 층·동·면적 일치 여부를 발행 전 원문에서 반드시 확인해야 합니다.",
    badge: "확인 필요",
    note: "성복동 브랜드 준신축 단지로 성복역 접근성과 학군 수요가 가격에 반영됩니다.",
  }),
  withGain({
    id: "gwanggyo-sanghyeon-solhime",
    rank: 8,
    complexName: "광교상현 솔하임",
    complexNameOfficial: "광교상현솔하임",
    areaGroup: "상현역권",
    legalDongLabel: "상현동",
    addressLabel: "상현동 · 신분당선 상현역권 (광교 인접)",
    supplyYear: 2015,
    householdCount: 885,
    mainAreaLabel: "전용 84㎡ 중심",
    stationLabel: "신분당선 상현역 도보권",
    schoolNote: "상현동 학군, 광교 생활권 중복 체감",
    latestTradePriceManwon: 92000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대",
    previousYearPriceManwon: 81000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 62000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대",
    jeonsePriceManwon: 42000,
    jeonseRatio: 46,
    tradeCountNote: "광교 생활권과 겹치는 단지로 수지구 행정구역 기준임을 주의해야 합니다.",
    badge: "확인 필요",
    note: "상현역권 단지로 수지구 행정구역이지만 광교 생활권과 겹칩니다. 광교 리포트와 함께 확인하는 편이 더 정확합니다.",
  }),
  withGain({
    id: "manhyeon-2-jugong",
    rank: 9,
    complexName: "만현마을2단지 주공",
    complexNameOfficial: "만현마을2단지",
    areaGroup: "상현역권",
    legalDongLabel: "상현동",
    addressLabel: "상현동 · 상현역 인접 구축",
    supplyYear: 1997,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    stationLabel: "신분당선 상현역 접근 가능",
    latestTradePriceManwon: 73000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 우선, 거래 없으면 유사 면적",
    previousYearPriceManwon: 64000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 49000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonsePriceManwon: 34000,
    jeonseRatio: 47,
    tradeCountNote: "구축 단지로 84㎡ 거래 건수가 적어 유사 면적 거래가 혼재할 수 있습니다.",
    badge: "확인 필요",
    note: "상현동 실거주 수요와 가격 접근성 비교 후보입니다. 신축·준신축 단지와 직접 가격 비교에 주의해야 합니다.",
  }),
  withGain({
    id: "pungdeokcheon-hyundai",
    rank: 10,
    complexName: "풍덕천 현대",
    complexNameOfficial: "풍덕천현대",
    areaGroup: "풍덕천권",
    legalDongLabel: "풍덕천동",
    addressLabel: "풍덕천동 · 수지 중심 구축 생활권",
    supplyYear: 1995,
    mainAreaLabel: "전용 84㎡ 또는 유사 면적",
    latestTradePriceManwon: 65000,
    latestTradeDate: "2026년 상반기 참고 기준",
    latestTradeArea: "84㎡대 우선, 거래 없으면 유사 면적",
    previousYearPriceManwon: 57000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 44000,
    fiveYearLowDate: "2022년 하반기 저점권 참고",
    fiveYearLowArea: "84㎡대 또는 유사 면적",
    jeonsePriceManwon: 31000,
    jeonseRatio: 48,
    tradeCountNote: "구축 단지로 면적·동·층에 따라 가격 차이가 크며, 84㎡ 일치 거래 건수 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "풍덕천동 구축 수지 중심 생활권 비교 후보입니다. 신축 대비 진입 가격이 낮지만 연식 차이를 고려해야 합니다.",
  }),
];

export const SJAP_LIFESTYLE_CARDS: SujiLifestyleCard[] = [
  {
    areaGroup: "성복역권",
    title: "성복역권",
    description:
      "신분당선 성복역 직역세권으로 강남·판교 접근성이 핵심 선호 요인입니다. 2017~2020년 사이 분양한 신축·준신축 브랜드 단지가 집중되어 있어 수지 최상단 가격을 형성합니다.",
    priceInterpretation:
      "신분당선 역세권 프리미엄이 가장 직접적으로 반영된 구역입니다. 같은 성복역권이라도 역과의 도보 거리, 동 배치, 조망에 따라 가격 차이가 납니다.",
    caution:
      "성복역에서 강남(신사역)까지 신분당선으로 약 40분이 소요됩니다. '역세권'이라도 버스 환승이나 도로 체감은 단지마다 다릅니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "동천역권",
    title: "동천역권",
    description:
      "신분당선 동천역 접근성과 판교 직주근접 수요가 가격을 지지합니다. 동천동 브랜드 단지는 판교 테크노밸리 재직자 실거주 수요와 맞닿아 있습니다.",
    priceInterpretation:
      "판교 접근성을 중시하는 실거주자에게 선호도가 높습니다. 동천역 도보 거리와 판교까지의 출퇴근 동선 체감이 단지별로 다릅니다.",
    caution:
      "동천동은 수지구 남부로 성복역권 대비 강남 접근 거리가 길 수 있습니다. 판교 직주근접 여부와 도로 체감을 실제 출퇴근 동선으로 확인해야 합니다.",
    badge: "확인 필요",
  },
  {
    areaGroup: "상현역권",
    title: "상현역권",
    description:
      "신분당선 상현역권은 행정구역상 수지구(상현동)지만 광교 생활권과 겹치는 구역입니다. 광교 신도시 인프라와 수지 학군을 함께 체감할 수 있다는 점이 선호 이유로 언급됩니다.",
    priceInterpretation:
      "광교와 수지 사이에서 두 생활권의 프리미엄을 동시에 노릴 수 있지만, 어느 쪽도 완전히 속하지 않는 애매한 위치로 해석될 수도 있습니다.",
    caution:
      "광교 리포트와 수지 리포트에 모두 겹치는 단지입니다. 이 리포트의 데이터는 수지구 행정구역 기준이며, 광교 생활권 단지로 보고 싶으면 광교 리포트를 함께 확인하세요.",
    badge: "확인 필요",
  },
  {
    areaGroup: "풍덕천권",
    title: "풍덕천권 · 수지구청역권",
    description:
      "수지구의 행정 중심으로 생활 인프라와 학군이 두껍습니다. 신분당선 수지구청역(개통 계획 포함)이나 버스 환승으로 강남 접근이 가능하지만 성복·동천역권 대비 직역세권 프리미엄은 낮습니다.",
    priceInterpretation:
      "역세권 프리미엄보다는 학군·생활 인프라·구축 대비 접근성 가격이 가격 형성의 핵심입니다. 진입 가격이 성복·동천역권보다 상대적으로 낮아 실거주 수요가 꾸준합니다.",
    caution:
      "수지구청역은 발행 시점 기준 신분당선 연장 계획에 포함되어 있으나, 공사 일정과 개통 시점은 발행 전 공식 확인이 필요합니다.",
    badge: "확인 필요",
  },
];

export const SJAP_CONTEXT: SujiContextCard[] = [
  {
    title: "신분당선과 강남·판교 접근성",
    body: "수지 가격은 신분당선으로 강남(신사역)·판교(판교역)·정자(분당)를 연결한다는 점이 핵심입니다. 성복역·동천역·상현역 중 어느 역 생활권인지에 따라 가격대가 달라집니다.",
    badge: "확인 필요",
  },
  {
    title: "학군과 실거주 선호",
    body: "성복동, 풍덕천동, 동천동은 수지구 내에서 상급 학군으로 자주 언급됩니다. 실거주 수요와 학군 배정 체감이 가격에 함께 반영됩니다.",
    badge: "확인 필요",
  },
  {
    title: "분당 대체지 검색 수요",
    body: "수지는 분당보다 가격 부담이 낮으면서 신분당선·학군·판교 접근성을 가져갈 수 있다는 점에서 대체지로 검토됩니다. 다만 분당과 입지·학군·가격 레벨이 같다는 뜻은 아닙니다.",
    badge: "확인 필요",
  },
  {
    title: "거래 건수와 면적 차이",
    body: "최근 거래가 적은 단지는 한 건의 가격이 평균처럼 보일 수 있습니다. 전용 84㎡가 아닌 유사 면적 거래는 같은 표 안에서도 직접 비교에 주의해야 합니다.",
    badge: "확인 필요",
  },
];

export const SJAP_SOURCE_LINKS: RelatedLink[] = [
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

export const SJAP_FAQ: SujiFaqItem[] = [
  {
    question: "수지 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 최근 실거래가 수준, 신분당선 접근성, 성복·상현·동천 생활권 대표성, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 매수 추천이나 지역 우열이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 투자 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "수지는 분당 대체지가 될 수 있나요?",
    answer:
      "수지는 신분당선, 학군, 판교·강남 접근성을 갖춘 지역이라 분당보다 가격 부담을 낮추고 싶은 실거주자에게 대체지로 검토됩니다. 다만 분당과 입지·학군·가격 레벨이 같다는 뜻은 아니며, 성복·상현·동천별 체감이 다릅니다.",
  },
  {
    question: "성복역 롯데캐슬 골드타운이 수지에서 가장 비싼 아파트인가요?",
    answer:
      "성복역 롯데캐슬 골드타운은 수지 대표 대장 단지로 자주 언급되지만, 거래 시점·면적·층·향·동에 따라 e편한세상 수지, 동천동 주요 단지 등 다른 단지가 더 높은 거래를 기록할 수 있습니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 유사 면적을 별도 표기합니다. 면적이 다르면 같은 표 안에서도 직접 비교에 주의해야 하며, 화면에는 해당 면적을 명확히 표시합니다.",
  },
  {
    question: "수지 아파트는 왜 비싼가요?",
    answer:
      "신분당선, 학군, 판교·강남 접근성, 성복·상현·동천의 주거 선호, 광교 생활권 인접성이 함께 가격을 지지합니다. 다만 단지별 역 접근성과 도로 체감에 따라 가격 차이가 큽니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요와 가격 지지력을 보는 참고 지표일 뿐입니다. 신분당선 접근성이 강한 단지는 전세가율이 낮아도 매매가가 높을 수 있고, 전세가율이 높아도 향후 매매가를 보장하지 않습니다.",
  },
  {
    question: "지금 수지 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 출퇴근 동선, 현장 확인을 함께 고려해야 합니다.",
  },
];

export const SJAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/",
    label: "동탄·분당·수지·영통 대장 아파트 비교",
    description: "경기 남부 주요 주거지의 84㎡ 가격대와 교통·학군·리스크를 비교합니다.",
  },
  {
    href: "/reports/bundang-apartment-price-2026/",
    label: "분당 대장 아파트 Top10",
    description: "분당 대표 단지의 실거래가와 재건축 기대, 최저가 대비 평가차익을 확인합니다.",
  },
  {
    href: "/reports/gwanggyo-apartment-price-2026/",
    label: "광교 대장 아파트 Top10",
    description: "광교 생활권 대표 단지의 실거래가와 최저가 대비 평가차익을 확인합니다.",
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

export const SJAP_SEO_INTRO = [
  "수지 아파트 실거래가를 볼 때는 단순히 가장 비싼 단지 하나만 보면 부족합니다. 성복역권, 동천역권, 상현역권, 풍덕천권은 모두 수지구 안에 있지만 가격을 만드는 이유가 다릅니다. 성복역권은 신분당선 직역세권 프리미엄, 동천역권은 판교 직주근접 수요, 상현역권은 광교 인접 생활권, 풍덕천권은 학군·인프라 기반 실거주 수요가 각각 가격에 반영됩니다.",
  "이 리포트는 수지 대표 단지의 최근 기준가와 최근 5년 저점권 가격을 나란히 놓고 평가차익(추정)을 계산합니다. 단, 이 금액은 취득세, 중개보수, 보유세, 대출이자, 양도소득세를 모두 제외한 단순 시세 차이입니다.",
  "수지를 분당 대체지로 검토하는 수요가 많지만, 분당과 수지는 입지·학군·가격 레벨이 같지 않습니다. 신분당선 접근성은 유사하지만, 생활권 체감과 재건축 기대 여부는 분당과 다르게 봐야 합니다.",
  "따라서 이 페이지는 매수 추천이 아니라 비교용 지도에 가깝습니다. 관심 단지를 고른 뒤에는 국토교통부 실거래가 공개시스템에서 같은 면적의 최신 거래를 다시 확인하고, 주택구입자금 계산기와 취득세 계산기로 월 부담과 초기 비용을 함께 보는 흐름이 안전합니다.",
  "특히 84㎡ 거래가 부족한 단지는 유사 면적 거래가 섞일 수 있습니다. 표의 면적 라벨, 거래일, 주의 문구를 함께 확인해야 단지 간 가격 차이를 과장해서 해석하지 않을 수 있습니다.",
];

export const SJAP_SEO_CRITERIA = [
  "가격은 전용 84㎡를 우선 기준으로 하며, 거래가 부족한 단지는 유사 면적임을 별도 표기합니다.",
  "평가차익(추정)은 현재 기준가에서 최근 5년 저점권 가격을 뺀 단순 시세 차이입니다.",
  "생활권 구분(성복역권·동천역권·상현역권·풍덕천권)은 행정구역이 아닌 실거주 체감 기준이며, 단지별 역 접근 거리는 달라질 수 있습니다.",
  "전세가율은 참고 지표이며, 전세 거래 건수가 부족하면 가격 지지력 판단에 한계가 있습니다.",
  "모든 수치는 발행 전 국토교통부 실거래가 공개시스템에서 원문 재검증이 필요합니다.",
];

export function formatEok(manwon: number): string {
  const eok = manwon / 10000;
  const fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
  return `${fixed.replace(/\.0$/, "")}억원`;
}
