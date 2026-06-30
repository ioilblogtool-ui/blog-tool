export type DataBadge = "공식" | "보도 기반" | "추정" | "확인 필요";

export interface DongtanApartmentMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  updatedAt: string;
  dataAsOf: string;
  notice: string;
}

export interface DongtanApartmentRow {
  id: string;
  rank: number;
  complexName: string;
  complexNameOfficial: string;
  areaGroup: "동탄역권" | "시범단지" | "호수공원권" | "동탄2 기타" | "동탄1";
  addressLabel: string;
  supplyYear?: number;
  householdCount?: number;
  mainAreaLabel: string;
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

export interface DongtanApartmentViewRow extends DongtanApartmentRow {
  estimatedGainManwon: number;
  estimatedGainRate: number;
}

export interface DongtanContextCard {
  title: string;
  body: string;
  badge: DataBadge;
}

export interface DongtanFaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const DTAP_META: DongtanApartmentMeta = {
  slug: "dongtan-apartment-price-2026",
  title: "동탄 대장 아파트 Top10 2026",
  seoTitle: "동탄 아파트 실거래가 2026 | 대장 아파트 Top10, 최저가 대비 얼마나 올랐나",
  description:
    "동탄역 롯데캐슬 등 동탄 대장 아파트 Top10의 최근 실거래가와 최근 5년 최저가 대비 평가차익(추정)을 비교합니다. GTX-A 이후 가격 변화와 데이터 기준을 함께 확인하세요.",
  updatedAt: "2026-06-29",
  dataAsOf: "2026년 6월 보도 실거래 및 후보 단지 재확인 전 참고값",
  notice:
    "최근 거래가는 2026년 6월 보도된 실거래 사례와 설계 단계 후보 데이터를 함께 정리한 참고값입니다. 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일을 다시 확인한 뒤 실제 의사결정에 활용해야 합니다.",
};

const rawApartments: DongtanApartmentRow[] = [
  {
    id: "lotte-castle",
    rank: 1,
    complexName: "동탄역 롯데캐슬",
    complexNameOfficial: "동탄역롯데캐슬",
    areaGroup: "동탄역권",
    addressLabel: "화성시 오산동·동탄역 초역세권",
    supplyYear: 2021,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 222500,
    latestTradeDate: "2026-06-04",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 185000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 126000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 90000,
    jeonseRatio: 40.4,
    tradeCountNote: "최신가는 2026년 6월 보도 실거래 사례입니다.",
    badge: "보도 기반",
    note: "최저가는 공개 실거래 재확인 전 참고값입니다. 세부 동·층·향에 따라 차이가 큽니다.",
  },
  {
    id: "woonam-firstvill",
    rank: 2,
    complexName: "동탄역 시범우남퍼스트빌",
    complexNameOfficial: "동탄역시범우남퍼스트빌",
    areaGroup: "시범단지",
    addressLabel: "화성시 청계동·시범단지",
    supplyYear: 2015,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 186000,
    latestTradeDate: "2026-06-05",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 154000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 104000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 69000,
    jeonseRatio: 37.1,
    tradeCountNote: "2026년 6월 보도 실거래 사례를 최신 기준가로 사용했습니다.",
    badge: "보도 기반",
    note: "시범단지는 같은 84㎡라도 동탄역 접근성과 층에 따른 차이가 큽니다.",
  },
  {
    id: "hanwha-prestige",
    rank: 3,
    complexName: "동탄역 시범한화꿈에그린프레스티지",
    complexNameOfficial: "동탄역시범한화꿈에그린프레스티지",
    areaGroup: "시범단지",
    addressLabel: "화성시 청계동·시범단지",
    supplyYear: 2015,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 176000,
    latestTradeDate: "2026-06-05",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 145000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 99000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 67000,
    jeonseRatio: 38.1,
    tradeCountNote: "2026년 6월 보도 실거래 사례를 최신 기준가로 사용했습니다.",
    badge: "보도 기반",
    note: "평가차익은 단순 시세 차이이며 실제 수익이 아닙니다.",
  },
  {
    id: "the-sharp-central",
    rank: 4,
    complexName: "동탄역 시범더샵센트럴시티",
    complexNameOfficial: "동탄역시범더샵센트럴시티",
    areaGroup: "시범단지",
    addressLabel: "화성시 청계동·시범단지",
    supplyYear: 2015,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 161000,
    latestTradeDate: "2026-06-16",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 138000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 94000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 62000,
    jeonseRatio: 38.5,
    tradeCountNote: "2026년 6월 보도 실거래 사례를 최신 기준가로 사용했습니다.",
    badge: "보도 기반",
    note: "단지별 거래 건수가 적으면 한 건의 거래가 대표값처럼 보일 수 있습니다.",
  },
  {
    id: "linstraus-lake",
    rank: 5,
    complexName: "동탄 린스트라우스 더레이크",
    complexNameOfficial: "동탄린스트라우스더레이크",
    areaGroup: "호수공원권",
    addressLabel: "화성시 송동·호수공원 생활권",
    supplyYear: 2019,
    mainAreaLabel: "전용 98㎡",
    latestTradePriceManwon: 140000,
    latestTradeDate: "2026-06-02",
    latestTradeArea: "98㎡",
    previousYearPriceManwon: 121000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 89000,
    fiveYearLowDate: "2022년 하반기 저점 참고",
    fiveYearLowArea: "98㎡",
    jeonsePriceManwon: 57000,
    jeonseRatio: 40.7,
    tradeCountNote: "84㎡가 아닌 98㎡ 거래입니다.",
    badge: "보도 기반",
    note: "면적이 달라 84㎡ 단지와 직접 비교하면 안 됩니다.",
  },
  {
    id: "lake-xi-terrace",
    rank: 6,
    complexName: "동탄 더레이크 자이더테라스",
    complexNameOfficial: "동탄더레이크자이더테라스",
    areaGroup: "호수공원권",
    addressLabel: "화성시 송동·호수공원권",
    supplyYear: 2018,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 132000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 112000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 82000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 54000,
    jeonseRatio: 40.9,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "호수공원권 대표 후보입니다. 거래 면적과 단지명 표기 재확인이 필요합니다.",
  },
  {
    id: "bando-ubora-ivy",
    rank: 7,
    complexName: "동탄역 반도유보라 아이비파크",
    complexNameOfficial: "동탄역반도유보라아이비파크",
    areaGroup: "동탄역권",
    addressLabel: "화성시 오산동·동탄역권",
    supplyYear: 2017,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 128000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 109000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 81000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 52000,
    jeonseRatio: 40.6,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "동탄역권 중상위권 비교 후보입니다.",
  },
  {
    id: "central-sangrok",
    rank: 8,
    complexName: "동탄역 센트럴상록",
    complexNameOfficial: "동탄역센트럴상록",
    areaGroup: "동탄역권",
    addressLabel: "화성시 오산동·동탄역권",
    supplyYear: 2018,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 121000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 103000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 78000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 50000,
    jeonseRatio: 41.3,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "실거래 건수가 적으면 최신가 해석에 주의해야 합니다.",
  },
  {
    id: "geumgang-central-park",
    rank: 9,
    complexName: "동탄2 금강펜테리움 센트럴파크",
    complexNameOfficial: "동탄2금강펜테리움센트럴파크",
    areaGroup: "동탄2 기타",
    addressLabel: "화성시 동탄2 기타 생활권",
    supplyYear: 2016,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 98000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 86000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 64000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 43000,
    jeonseRatio: 43.9,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "동탄역권과 생활권이 달라 가격 레벨을 그대로 비교하면 안 됩니다.",
  },
  {
    id: "metapolis",
    rank: 10,
    complexName: "메타폴리스",
    complexNameOfficial: "메타폴리스",
    areaGroup: "동탄1",
    addressLabel: "화성시 반송동·동탄1 중심상권",
    supplyYear: 2010,
    mainAreaLabel: "전용 84㎡",
    latestTradePriceManwon: 93000,
    latestTradeDate: "2026년 6월 후보 기준",
    latestTradeArea: "84㎡",
    previousYearPriceManwon: 82000,
    previousYearPeriod: "2025년 대표 거래 참고",
    fiveYearLowPriceManwon: 58000,
    fiveYearLowDate: "2022년 저점 참고",
    fiveYearLowArea: "84㎡",
    jeonsePriceManwon: 39000,
    jeonseRatio: 41.9,
    tradeCountNote: "설계 단계 후보값으로 국토부 재확인이 필요합니다.",
    badge: "확인 필요",
    note: "동탄1 대표 후보입니다. 연식과 주상복합 특성을 함께 봐야 합니다.",
  },
];

export const DTAP_APARTMENTS: DongtanApartmentViewRow[] = rawApartments.map((row) => {
  const estimatedGainManwon = row.latestTradePriceManwon - row.fiveYearLowPriceManwon;
  const estimatedGainRate = Math.round((estimatedGainManwon / row.fiveYearLowPriceManwon) * 1000) / 10;
  return { ...row, estimatedGainManwon, estimatedGainRate };
});

export const DTAP_CONTEXT: DongtanContextCard[] = [
  {
    title: "GTX-A와 동탄역 접근성",
    body: "동탄역권 단지는 광역 교통 기대감이 가격에 빠르게 반영될 수 있습니다. 다만 역 접근성은 실제 도보 동선과 단지 출입구 위치에 따라 체감이 달라집니다.",
    badge: "추정",
  },
  {
    title: "삼성·반도체 벨트 배후 수요",
    body: "동탄은 삼성전자, 용인·평택 반도체 벨트와 함께 거론되는 주거지입니다. 직주근접 수요는 강점이지만 출퇴근 동선과 실거주 선호는 단지별로 다릅니다.",
    badge: "추정",
  },
  {
    title: "시범단지와 호수공원권의 성격 차이",
    body: "시범단지는 동탄역 접근성과 초기 신도시 인프라, 호수공원권은 쾌적성과 생활권 선호가 핵심입니다. 같은 동탄이라도 가격을 만드는 이유가 다릅니다.",
    badge: "추정",
  },
  {
    title: "후보값은 원자료 확인 전 단계",
    body: "일부 단지는 설계 단계 후보값입니다. 실제 발행 전에는 국토교통부 실거래가 공개시스템에서 단지명, 면적, 거래일, 취소 여부를 다시 확인해야 합니다.",
    badge: "확인 필요",
  },
];

export const DTAP_METHOD: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하고, 84㎡ 거래가 부족한 경우 면적을 별도 표기했습니다.",
  "평가차익(추정)은 최근 기준가에서 최근 5년 저점 참고가를 뺀 단순 시세 차이입니다.",
  "상승률(추정)은 평가차익을 최근 5년 저점 참고가로 나눈 값입니다.",
  "세금, 중개보수, 대출이자, 보유세, 양도소득세, 수리비는 모두 제외했습니다.",
  "거래 건수가 적은 단지는 평균 시세가 아니라 대표 거래 사례로 읽어야 합니다.",
];

export const DTAP_RISKS: string[] = [
  "단기 급등 이후에는 신고가와 다음 거래 사이의 공백이 길어질 수 있습니다.",
  "같은 단지라도 동, 층, 향, 조망, 수리 상태에 따라 가격 차이가 크게 날 수 있습니다.",
  "84㎡가 아닌 면적은 같은 순위표 안에서도 직접 비교에 주의해야 합니다.",
  "금리, DSR, 취득세, 종부세, 양도세 규정은 실제 부담 가능성을 크게 바꿉니다.",
  "후보값은 국토교통부 실거래가 공개시스템에서 취소 거래 여부까지 재확인해야 합니다.",
];

export const DTAP_FAQ: DongtanFaqItem[] = [
  {
    question: "동탄 대장 아파트는 어떤 기준으로 선정했나요?",
    answer:
      "단지 인지도, 동탄역 접근성, 최근 실거래가 수준, 검색 수요, 거래 데이터 확보 가능성을 함께 봅니다. 순위는 지역 우열이나 매수 추천이 아니라 비교 편의를 위한 기준입니다.",
  },
  {
    question: "최저가 대비 평가차익은 실제 수익인가요?",
    answer:
      "아닙니다. 취득세, 중개보수, 대출이자, 보유세, 양도소득세를 제외한 단순 시세 차이입니다. 그래서 본문에서는 투자 수익이 아니라 평가차익(추정)으로 표기합니다.",
  },
  {
    question: "84㎡ 거래가 없으면 어떻게 비교하나요?",
    answer:
      "84㎡를 우선 기준으로 삼되, 최근 거래가 없으면 다른 면적을 별도 표기합니다. 면적이 다르면 같은 순위표 안에서도 직접 비교에 주의해야 합니다.",
  },
  {
    question: "동탄역 롯데캐슬이 동탄에서 가장 비싼 아파트인가요?",
    answer:
      "동탄역 초역세권 대표 단지로 상단 가격을 형성하는 경우가 많지만, 거래 시점·면적·층·향에 따라 다른 단지가 더 높은 거래를 기록할 수 있습니다.",
  },
  {
    question: "동탄 아파트는 GTX-A 때문에 오른 건가요?",
    answer:
      "GTX-A는 중요한 요인 중 하나입니다. 다만 삼성·반도체 배후 수요, 신도시 생활 인프라, 매물 감소, 단지별 상품성도 함께 작용하므로 하나의 이유로 단정하면 안 됩니다.",
  },
  {
    question: "지금 동탄 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천이 아닙니다. 최근 가격과 과거 저점 대비 변화를 보여주는 참고 자료이며, 실제 매수 판단은 자금 계획, 대출 조건, 실거주 필요, 거래 현장 확인을 함께 고려해야 합니다.",
  },
  {
    question: "전세가율이 높으면 좋은 단지인가요?",
    answer:
      "전세가율은 실거주 수요를 보는 참고 지표일 뿐입니다. 전세가율이 높아도 향후 입주 물량, 금리, 수리 상태, 학군·교통 선호에 따라 매매가는 다르게 움직일 수 있습니다.",
  },
];

export const DTAP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/dongtan-20-billion-apartment-affordability-2026/",
    label: "동탄 20억 아파트, 진짜 감당 가능한가",
    description: "고가 단지 매수를 고민할 때 필요한 현금·대출·월 상환액을 확인합니다.",
  },
  {
    href: "/reports/dongtan-hot-apartment-ranking-2026/",
    label: "동탄 신고가 아파트 추적 리포트",
    description: "최근 고가 거래와 단기 과열 신호를 별도로 추적합니다.",
  },
  {
    href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/",
    label: "분당 재건축 vs 동탄 신축 비교",
    description: "15억 예산 기준 두 지역의 실거주·투자·교통·학군 포인트를 비교합니다.",
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

export const DTAP_SEO_INTRO: string[] = [
  "동탄 아파트 실거래가를 볼 때 가장 먼저 구분해야 할 것은 최신 가격과 과거 저점 대비 변화입니다. 최근 신고가만 보면 시장 온도는 보이지만, 어느 단지가 과거 저점 대비 얼마나 움직였는지는 따로 계산해야 합니다.",
  "이 리포트는 동탄역 롯데캐슬, 시범단지, 호수공원권, 동탄1 대표 후보를 같은 표에 놓고 최근 기준가와 최근 5년 저점 참고가를 비교합니다. 다만 일부 값은 설계 단계 후보값이므로 국토교통부 실거래가 공개시스템에서 재확인해야 합니다.",
  "평가차익(추정)은 실제 투자 수익이 아닙니다. 취득세, 중개보수, 보유세, 양도소득세, 대출이자, 수리비를 제외한 단순 시세 차이입니다. 그래서 모든 차익성 수치는 평가차익(추정)으로 표기했습니다.",
  "동탄은 같은 행정권역 안에서도 동탄역권, 시범단지, 호수공원권, 동탄1의 가격을 만드는 이유가 다릅니다. 동탄역 접근성, 생활 인프라, 연식, 단지 상품성, 거래 건수까지 함께 봐야 가격 차이를 제대로 읽을 수 있습니다.",
  "실제 매수 판단은 이 페이지 하나로 끝내면 안 됩니다. 관심 단지를 고른 뒤에는 최신 실거래가 원문, 취소 거래 여부, 매물 호가, 대출 조건, 세금, 관리비, 실거주 동선을 함께 확인해야 합니다.",
];

export const DTAP_SEO_CRITERIA: string[] = [
  "최근 기준가는 전용 84㎡를 우선 사용하되, 다른 면적은 화면에 별도 표기했습니다.",
  "평가차익과 상승률은 모두 추정 산식이며 공식 수익률이 아닙니다.",
  "후보값과 확인값을 배지로 분리해 원자료 재확인 필요성을 표시했습니다.",
  "이 리포트는 매수 추천이 아니라 실거래가 기준 비교 참고자료입니다.",
  "실제 의사결정 전에는 국토교통부 실거래가 공개시스템에서 단지명과 거래일을 다시 확인해야 합니다.",
];
