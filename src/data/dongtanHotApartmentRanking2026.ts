export type FactBadge = "확인됨" | "추정" | "주의";

export interface HotApartmentRow {
  rank: number;
  complexName: string;
  district: string;
  priceManwon: number;
  unitArea: string;
  tradeDate: string;
  prevHighManwon: number | null;
  increaseManwon: number | null;
  increasePeriod: string | null;
  badge: FactBadge;
  note?: string;
}

export interface MarketHeatKpi {
  label: string;
  value: string;
  description: string;
  badge: FactBadge;
}

export interface PolarizationCard {
  label: string;
  complexName: string;
  district: string;
  priceManwon: number;
  unitArea: string;
}

export interface InsightCard {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  label: string;
  description: string;
}

export const DHAR_META = {
  slug: "dongtan-hot-apartment-ranking-2026",
  title: "동탄 신고가 아파트 TOP8 추적 2026",
  seoTitle: "동탄 아파트 신고가 순위 2026 | 한 달 만에 1억 4천 오른 단지는",
  seoDescription:
    "동탄역롯데캐슬 22억 2,500만원 등 2026년 6월 신고가를 기록한 동탄 아파트 8곳을 거래가·상승액 기준으로 정리합니다. 주간 상승률 전국 1위, 동탄 부동산 과열 신호도 함께 확인하세요.",
  description:
    "2026년 6월 신고가를 기록한 동탄 아파트 8곳을 거래가, 거래일, 직전 최고가 대비 상승액 기준으로 추적하는 인터랙티브 리포트입니다.",
  updatedAt: "2026-06-25",
  dataNote:
    "거래가는 2026년 6월 보도된 실거래 사례(파이낸셜뉴스 등)를 인용한 확인된 수치이며, 추정값이 아닙니다. 같은 단지라도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 보면 안 됩니다. 이 리포트는 투자 추천이 아니며, 매수·매도 결정은 별도 확인을 거쳐야 합니다.",
};

export const DHAR_RANKING: HotApartmentRow[] = [
  { rank: 1, complexName: "동탄역롯데캐슬", district: "여울동", priceManwon: 222500, unitArea: "84㎡", tradeDate: "2026-06-04", prevHighManwon: 208000, increaseManwon: 14500, increasePeriod: "1개월", badge: "확인됨" },
  { rank: 2, complexName: "동탄역시범우남퍼스트빌", district: "동탄역 인근", priceManwon: 186000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: 173000, increaseManwon: 13000, increasePeriod: null, badge: "확인됨" },
  { rank: 3, complexName: "동탄역시범한화꿈에그린프레스티지", district: "동탄역 인근", priceManwon: 176000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: 158000, increaseManwon: 18000, increasePeriod: null, badge: "확인됨" },
  { rank: 4, complexName: "동탄역시범더샵센트럴시티", district: "동탄역 인근", priceManwon: 161000, unitArea: "84㎡", tradeDate: "2026-06-16", prevHighManwon: 153000, increaseManwon: 8000, increasePeriod: null, badge: "확인됨" },
  { rank: 5, complexName: "동탄 린스트라우스더레이트", district: "동탄2신도시", priceManwon: 140000, unitArea: "98㎡", tradeDate: "2026-06-02", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨", note: "84㎡가 아닌 98㎡ 거래입니다. 면적이 달라 다른 단지와 직접 비교하면 안 됩니다." },
  { rank: 6, complexName: "호수공원역센트럴시티", district: "호수공원 인근", priceManwon: 119500, unitArea: "84㎡", tradeDate: "2026-06-20", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
  { rank: 7, complexName: "동탄더레이크팰리스", district: "호수공원 인근", priceManwon: 105000, unitArea: "84㎡", tradeDate: "2026-06-05", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
  { rank: 8, complexName: "동탄레이크자연앤푸르지오", district: "호수공원 인근", priceManwon: 99000, unitArea: "84㎡", tradeDate: "2026-06", prevHighManwon: null, increaseManwon: null, increasePeriod: null, badge: "확인됨" },
];

export const DHAR_MARKET_HEAT: MarketHeatKpi[] = [
  { label: "동탄구 주간 상승률", value: "+1.98%", description: "전국 최고 수준, 서울 강서구(0.42%)의 4배 이상", badge: "확인됨" },
  { label: "주말 방문 수요", value: "하루 10여 팀", description: "한 집을 보러 오는 팀 수, 3개 조로 나눠 안내 (중개사 인터뷰)", badge: "확인됨" },
  { label: "계약파기 배액배상", value: "1억 6,000만원", description: "계약금 8,000만원 거래를 배액배상 후 해제, 재매도 시 1.5~2억원 추가 차익", badge: "확인됨" },
  { label: "동탄 내 가격 격차", value: "약 4.5배", description: "중심지 22억 2,500만원 vs 외곽 4억 9,000만원", badge: "확인됨" },
];

export const DHAR_POLARIZATION: PolarizationCard[] = [
  { label: "중심지 (동탄역 초역세권)", complexName: "동탄역롯데캐슬", district: "여울동", priceManwon: 222500, unitArea: "84㎡" },
  { label: "외곽 (산척동)", complexName: "그린힐반도유보라아이비파크10", district: "산척동", priceManwon: 49000, unitArea: "84㎡" },
];

export const DHAR_INSIGHTS: InsightCard[] = [
  {
    title: "신고가가 한 달 단위로 갱신되고 있다",
    body: "동탄역롯데캐슬은 5월 20억 8,000만원에서 6월 22억 2,500만원으로 한 달 만에 1억 4,500만원이 올랐습니다. 동탄역시범 단지들도 같은 기간 8,000만~1억 8,000만원씩 직전 최고가를 경신했습니다.",
  },
  {
    title: "주말마다 10팀씩 몰리는 매수 경쟁",
    body: "공인중개사 인터뷰에 따르면 주말에는 한 집에 하루 10여 팀이 방문해 3개 조로 나눠 안내해야 할 정도로 수요가 집중되고 있습니다.",
  },
  {
    title: "계약을 깨도 더 남는 구조",
    body: "한 매도자는 계약금 8,000만원 거래를 배액배상(1억 6,000만원)으로 해제한 뒤 재매도해 원래 계약가보다 1억 5,000만~2억원을 더 받았습니다. 위약금을 물어도 다시 팔면 남는 시장이라는 점이 과열의 핵심 신호입니다.",
  },
  {
    title: "같은 동탄인데 4배 넘게 차이 난다",
    body: "동탄역 초역세권(22억 2,500만원)과 외곽 산척동(4억 9,000만원)의 84㎡ 가격 차이가 약 4.5배에 달합니다. '동탄'이라는 한 단어로 뭉뚱그려 보면 체감이 크게 왜곡될 수 있습니다.",
  },
];

export const DHAR_FAQ: FaqItem[] = [
  {
    question: "신고가는 무엇을 기준으로 판단하나요?",
    answer:
      "국토교통부 실거래가 공개시스템에 등록된 거래 중 해당 단지·평형의 직전 최고 거래가를 넘어선 거래를 신고가로 봅니다. 이 리포트는 언론에 보도된 실거래 사례를 인용했으며, 보도되지 않은 더 높은 거래가 있을 수도 있습니다.",
  },
  {
    question: "동탄은 왜 이렇게 많이 오르고 있나요?",
    answer:
      "GTX-A 노선 개통 기대감, 반도체 클러스터(용인·평택) 배후 주거지로서의 수요, 규제 변경 전 매수를 서두르는 심리가 겹친 것으로 보도되고 있습니다. 다만 이 리포트는 원인을 단정하기보다 실제 거래 데이터로 확인된 현상을 정리하는 데 초점을 맞춥니다.",
  },
  {
    question: "지금 동탄 아파트를 사도 될까요?",
    answer:
      "이 리포트는 매수 추천을 하지 않습니다. 신고가 랠리와 과열 신호를 보여드리지만, 신고가 이후 가격이 유지되는지 꺾이는지는 후속 거래를 지켜봐야 알 수 있습니다. 실제 매수 결정은 본인의 자금 계획과 리스크 감내 수준에 따라 별도로 판단해야 합니다.",
  },
  {
    question: "배액배상이 무엇인가요?",
    answer:
      "매도자가 계약을 일방적으로 해제할 때 받은 계약금의 2배를 매수자에게 돌려주는 것을 말합니다. 이 리포트에 소개된 사례는 매도자가 1억 6,000만원(계약금 8,000만원의 2배)을 물어주고도 가격이 더 오른 뒤 재매도해 차익을 본 경우로, 시장이 얼마나 빠르게 오르고 있는지를 보여주는 사례입니다.",
  },
  {
    question: "이 순위는 얼마나 자주 업데이트되나요?",
    answer:
      "신고가는 거래가 발생할 때마다 바뀔 수 있어 이 리포트는 월 1회 이상 갱신을 목표로 합니다. 업데이트 기준일은 페이지 상단에 표시되며, 가장 최신 거래는 국토교통부 실거래가 공개시스템에서 직접 확인하는 것이 가장 정확합니다.",
  },
  {
    question: "같은 단지인데 다른 사이트랑 가격이 다른 이유는 무엇인가요?",
    answer:
      "같은 단지라도 동·층·향·연식에 따라 가격이 크게 다르고, 호가와 실거래가도 차이가 날 수 있습니다. 이 리포트의 가격은 보도된 특정 거래 사례이며, 같은 평형이라도 다른 거래는 가격이 다를 수 있습니다.",
  },
];

export const DHAR_RELATED_LINKS: RelatedLink[] = [
  { href: "/reports/dongtan-20-billion-apartment-affordability-2026/", label: "동탄 20억 시대, 진짜 가능한 가격일까?", description: "84㎡ 20억 기준 필요 현금·대출·월 상환액 검증" },
  { href: "/reports/gyeonggi-south-leader-apartment-comparison-2026/", label: "동탄·분당·수지·영통 대장 아파트 가격 비교", description: "경기 남부 4개 지역 대장 아파트 비교" },
  { href: "/reports/bundang-redevelopment-vs-dongtan-newbuild-2026/", label: "분당 재건축 vs 동탄 신축, 15억이면 어디가 나을까", description: "예산 15억 기준 지역 선택 비교" },
  { href: "/reports/yongin-vs-pyeongtaek-cluster-housing-2026/", label: "용인 vs 평택 반도체 클러스터 2026", description: "경기 남부 메가 프로젝트와 부동산 영향 비교" },
];

export const DHAR_SEO_INTRO: string[] = [
  "동탄 아파트값이 무섭게 오르고 있다는 체감은 숫자로도 확인됩니다. 2026년 6월 동탄구 주간 아파트 가격은 전주 대비 1.98% 올라 전국 최고 상승률을 기록했고, 이는 같은 기간 서울 강서구(0.42%)의 4배가 넘는 속도입니다. 이 리포트는 실제로 어떤 단지가 신고가를 기록했는지, 한 달 사이 얼마나 올랐는지를 보도된 실거래 사례 기준으로 추적합니다.",
  "가장 눈에 띄는 사례는 동탄역롯데캐슬입니다. 전용 84㎡가 5월 20억 8,000만원에서 6월 4일 22억 2,500만원에 거래되며 한 달 만에 1억 4,500만원이 올랐습니다. 동탄역시범우남퍼스트빌(+1억 3,000만원), 동탄역시범한화꿈에그린프레스티지(+1억 8,000만원), 동탄역시범더샵센트럴시티(+8,000만원)도 같은 시기 직전 최고가를 잇따라 경신했습니다.",
  "가격만큼 눈에 띄는 건 시장의 '온도'입니다. 한 공인중개사는 주말마다 한 집에 하루 10여 팀이 몰려 3개 조로 나눠 안내해야 한다고 말했고, 한 매도자는 계약금 8,000만원짜리 거래를 배액배상(1억 6,000만원)으로 해제한 뒤 다시 팔아 1억 5,000만~2억원을 더 받았습니다. 위약금을 물어줘도 다시 파는 게 더 이득인 시장이라는 뜻으로, 이 리포트가 다루는 '과열'의 실체를 보여주는 사례입니다.",
  "다만 '동탄'이라는 한 단어로 뭉뚱그려 보면 체감이 크게 왜곡될 수 있습니다. 동탄역 초역세권 동탄역롯데캐슬이 22억 2,500만원인 반면, 외곽 산척동의 그린힐반도유보라아이비파크10은 같은 84㎡가 4억 9,000만원으로 약 4.5배 차이가 납니다. 이 리포트는 신고가 순위와 함께 이런 양극화도 같은 화면에서 보여줍니다.",
  "이 리포트는 매수 추천이 아닙니다. 신고가 랠리와 과열 신호를 데이터로 정리해 보여드리지만, 신고가 이후 가격이 유지될지 꺾일지는 후속 거래를 지켜봐야 합니다. 같은 단지도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 받아들이지 말고, 실제 매수 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 거쳐야 합니다.",
];

export const DHAR_SEO_CRITERIA: string[] = [
  "거래가는 2026년 6월 언론에 보도된 실거래 사례를 인용한 확인된 수치이며 추정값이 아닙니다.",
  "같은 단지도 동·층·향·연식에 따라 가격이 크게 다르므로 표의 가격을 단지 전체의 확정 시세로 보면 안 됩니다.",
  "TOP10을 채우기 위해 추정 단지를 넣지 않았으며, 확인된 8개 단지만 순위에 포함했습니다.",
  "이 리포트는 투자·매수 추천이 아니며, 실제 거래 판단은 국토교통부 실거래가 공개시스템과 현장 확인을 거쳐야 합니다.",
];
