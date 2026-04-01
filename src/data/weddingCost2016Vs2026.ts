import { PAGE_META } from "./weddingBudget";

export type WeddingCostYearRow = {
  year: number;
  label: string;
  totalManwon: number;
  ceremonyPrepManwon: number;
  hallManwon: number;
  sdmManwon: number;
  honeymoonManwon: number;
  salaryReferenceManwon: number;
  note: string;
};

export type WeddingCostItemRow = {
  label: string;
  sublabel: string;
  value2016: number;
  value2026: number;
};

export type WeddingSavingTip = {
  step: string;
  title: string;
  body: string;
  tag: string;
};

export type WeddingRelatedCalc = {
  tag: string;
  title: string;
  desc: string;
  href: string;
};

export type WeddingSeriesLink = {
  tag: string;
  title: string;
  desc: string;
  href: string;
};

export const weddingCost2016Vs2026 = {
  meta: {
    slug: "wedding-cost-2016-vs-2026",
    title: "결혼비용 2016 vs 2026 비교 | 10년 만에 얼마나 올랐을까",
    subtitle:
      "웨딩홀, 식대, 스드메, 신혼여행까지 2016년과 2026년 평균 결혼비용을 항목별로 비교하고, 내 연봉 기준 부담도를 직접 계산해볼 수 있는 리포트입니다.",
    methodology:
      "원본 웹기획서의 2016·2026 비교 수치와 공개 웨딩 비용 흐름을 현재 비교계산소 리포트 구조에 맞게 재구성했습니다.",
    caution:
      "리포트 수치는 시장 비교용 기준값이며 실제 계약 금액은 지역, 시즌, 보증 인원, 옵션 추가 여부에 따라 달라질 수 있습니다.",
    updatedAt: PAGE_META.updatedAt,
  },
  reportLead:
    "2016년 평균 결혼 총비용은 2,476만원 수준이었지만, 2026년 현재 기준은 4,413만원까지 올라 10년 만에 약 78% 상승했습니다. 지금은 결혼 총비용이 직장인 1인 연봉 1년치를 넘어서는 구간으로 읽히기 시작합니다.",
  kpis: [
    { label: "2016 평균 총비용", value: "2,476만원", sub: "과거 웨딩 리포트 기준" },
    { label: "2026 평균 총비용", value: "4,413만원", sub: "+78% / +1,937만원 상승", accent: "up" },
    { label: "연봉 대비 부담도", value: "1.08배", sub: "2016년 0.71배에서 연봉 초과 구간", accent: "up" },
    { label: "결혼 건수 감소", value: "-38%", sub: "32만건(2016) → 20만건(2025)" },
    { label: "웨딩홀 식대 상승", value: "+91%", sub: "1인당 7.2만 → 13.8만원", accent: "up" },
    { label: "스드메 기본 패키지", value: "+84%", sub: "460만 → 850만원(서울 평균)", accent: "up" },
  ],
  timeline: [
    { year: 2016, amount: 2476 },
    { year: 2018, amount: 2820 },
    { year: 2020, amount: 3150 },
    { year: 2021, amount: 3380 },
    { year: 2022, amount: 3740 },
    { year: 2024, amount: 4120 },
    { year: 2026, amount: 4413 },
  ],
  timelineNote:
    "결혼비용은 물가와 함께 완만하게 오른 것이 아니라, 2021년 이후 더 가파르게 상승했습니다. 코로나 이후 웨딩 수요 회복과 공급 감소, 식대·인건비 상승이 겹치며 증가폭이 커졌습니다.",
  yearRows: [
    {
      year: 2016,
      label: "2016 비교 기준",
      totalManwon: 2476,
      ceremonyPrepManwon: 180,
      hallManwon: 1180,
      sdmManwon: 696,
      honeymoonManwon: 420,
      salaryReferenceManwon: 3487,
      note: "당시 평균 웨딩 비용 구조를 현재 비교 포맷으로 재정리한 기준",
    },
    {
      year: 2026,
      label: "2026 현재 기준",
      totalManwon: 4413,
      ceremonyPrepManwon: 303,
      hallManwon: 2040,
      sdmManwon: 1170,
      honeymoonManwon: 900,
      salaryReferenceManwon: 4086,
      note: "원본 기획의 현재 평균 총비용과 서울 웨딩 시장 체감 기준 반영",
    },
  ] satisfies WeddingCostYearRow[],
  itemRows: [
    { label: "웨딩홀 대관료", sublabel: "서울 주요식장 기본 장식 포함", value2016: 320, value2026: 760 },
    { label: "식대 합산", sublabel: "하객 200명 기준", value2016: 1440, value2026: 2760 },
    { label: "스드메 기본", sublabel: "스튜디오·드레스·메이크업", value2016: 460, value2026: 850 },
    { label: "신혼여행", sublabel: "동남아 기준 2인", value2016: 540, value2026: 950 },
    { label: "예물·예단", sublabel: "반지·시계·한복 포함", value2016: 450, value2026: 720 },
    { label: "청첩장·답례품", sublabel: "종이+모바일+답례품", value2016: 62, value2026: 98 },
    { label: "상견례·기타", sublabel: "상견례·부모 선물·피부관리", value2016: 204, value2026: 275 },
  ] satisfies WeddingCostItemRow[],
  itemTableNote:
    "결혼비용이 오른 이유는 모든 항목이 조금씩 오른 것이 아니라, 식대·웨딩홀·스드메처럼 핵심 항목이 빠르게 오른 데 있습니다.",
  patternNotes: [
    {
      title: "+152%",
      body: "웨딩홀 대관료 상승. 서울 상급 호텔 예식장은 2016년 300만원대에서 2026년 700만원을 넘는 구간까지 올라갔습니다.",
    },
    {
      title: "+91%",
      body: "식대 인상. 하객 200명 기준 식대만 2016년 1,440만원에서 2026년 2,760만원으로 1,300만원 이상 늘어난 구조입니다.",
    },
    {
      title: "+94%",
      body: "신혼여행 비용 상승. 코로나 이후 항공권과 숙박비가 정상화 이상으로 올라가며 현재 허니문 비용을 밀어올렸습니다.",
    },
    {
      title: "20만건",
      body: "2025년 혼인 건수 기준입니다. 2016년 32만건 대비 38% 감소했고, 비용 부담이 결혼 지연의 핵심 요인 중 하나로 읽힙니다.",
    },
  ],
  analysisNote:
    "누적 소비자물가 상승률만으로 설명하기 어려울 정도로, 결혼 핵심 항목의 인상 폭이 컸습니다. 코로나 기간 공급 축소 이후 웨딩홀·스튜디오 수급 불균형이 생겼고, 식재료비·인건비 상승이 식대와 패키지 가격에 반영됐습니다.",
  regionRows: [
    { region: "서울 상급호텔", hall: "700만원~", sdm: "900만원~", estimate: "1,600만원~" },
    { region: "서울 일반 웨딩홀", hall: "350~500만원", sdm: "750~900만원", estimate: "1,100~1,400만원" },
    { region: "수도권 웨딩홀", hall: "250~350만원", sdm: "600~750만원", estimate: "850~1,100만원" },
    { region: "지방 광역시", hall: "180~280만원", sdm: "450~600만원", estimate: "630~880만원" },
  ],
  regionNote:
    "같은 결혼식이라도 지역에 따라 부담 차이가 큽니다. 특히 서울 특급호텔과 지방 광역시 기준의 격차는 수백만원 단위가 될 수 있습니다.",
  savingGuide: [
    {
      step: "01",
      title: "하객 초대 기준 먼저 정하기",
      body: "식대는 하객 수 × 단가로 결정됩니다. 2026년 기준 서울 1인당 13~15만원 수준이라, 하객 50명 차이만으로도 750만원 이상 달라질 수 있습니다.",
      tag: "식대 절감",
    },
    {
      step: "02",
      title: "평일·오전 예식 할인 활용",
      body: "같은 웨딩홀이라도 주말 대비 평일·오전 시간대는 20~35% 할인이 적용되는 경우가 많습니다. 유연한 날짜 선택이 가능하다면 가장 효과적인 방법입니다.",
      tag: "웨딩홀 절감",
    },
    {
      step: "03",
      title: "스드메 분리 견적 받기",
      body: "패키지 전체 가격이 저렴해 보여도 옵션이 붙으면 실제 계약가가 크게 올라갑니다. 기본가와 추가금 구조를 분리해서 비교하는 것이 중요합니다.",
      tag: "스드메 절감",
    },
    {
      step: "04",
      title: "모바일 청첩장 + 실속 답례품",
      body: "종이 청첩장 대신 모바일 청첩장을 활용하면 10~30만원을 줄일 수 있습니다. 답례품 단가 기준을 먼저 정하면 예산 초과를 막기 좋습니다.",
      tag: "준비비 절감",
    },
    {
      step: "05",
      title: "신혼여행 얼리버드·비성수기 예약",
      body: "허니문 패키지는 3~6개월 전 얼리버드 시즌과 비성수기를 활용하면 같은 목적지 기준 30~40% 절감이 가능합니다. 목적지 선택 전 항공권 가격부터 확인하세요.",
      tag: "허니문 절감",
    },
  ] satisfies WeddingSavingTip[],
  relatedCalculators: [
    {
      tag: "결혼 준비",
      title: "결혼 준비 예산 계산기",
      desc: "지역, 티어, 하객 수, 신혼여행 지역을 직접 설정해 총예산을 계산합니다.",
      href: "/tools/wedding-budget-calculator/",
    },
    {
      tag: "소득 계산",
      title: "가구 소득 계산기",
      desc: "맞벌이 기준 합산 소득과 세후 실수령액을 함께 계산해볼 수 있습니다.",
      href: "/tools/household-income/",
    },
    {
      tag: "부동산 자금",
      title: "부동산 매매 자금 계산기",
      desc: "신혼집 매매 자금과 대출 가능 범위를 한 번에 시뮬레이션합니다.",
      href: "/tools/home-purchase-fund/",
    },
    {
      tag: "연봉 계산",
      title: "연봉 실수령액 계산기",
      desc: "세전 연봉 기준 실제 월 수령액과 4대보험 공제액을 계산합니다.",
      href: "/tools/salary/",
    },
  ] satisfies WeddingRelatedCalc[],
  affiliateCards: [
    {
      tag: "웨딩 플랫폼",
      title: "다이렉트 웨딩홀 가격 비교",
      desc: "서울 지역 웨딩홀 견적을 중간 수수료 없이 직접 비교할 수 있는 다이렉트웨딩 서비스입니다.",
      button: "웨딩홀 견적 보기",
      href: "https://www.directwedding.co.kr/weddinghall?city=%EC%84%9C%EC%9A%B8",
    },
    {
      tag: "허니문",
      title: "신혼여행 패키지",
      desc: "신혼여행 패키지(발리/우붓 허니문 8일 (2+2+2)) — 항공·숙박·현지 일정이 포함된 허니문 패키지입니다.",
      button: "여행 패키지 보기",
      href: "https://3ha.in/r/414807",
    },
    {
      tag: "쿠팡파트너스",
      title: "청첩장·답례품 준비",
      desc: "비용 절감 포인트 1순위. 온라인 청첩장 활용과 실속 답례품 구성을 한 번에 비교해보세요.",
      button: "쿠팡에서 보기",
      href: "https://link.coupang.com/a/efEGvy",
    },
    {
      tag: "재테크",
      title: "돈의 속성",
      desc: "결혼 자금 마련부터 절약 습관까지. 재테크 베스트셀러로 결혼 이후 자산 관리를 준비해보세요.",
      button: "쿠팡에서 보기",
      href: "https://link.coupang.com/a/efEJ6t",
    },
  ],
  seriesLinks: [
    {
      tag: "부동산 리포트",
      title: "서울 집값 2016 vs 2026",
      desc: "국평 아파트 시세, 10년 사이 얼마나 올랐는지 비교합니다.",
      href: "/reports/seoul-84-apartment-prices/",
    },
    {
      tag: "연봉 리포트",
      title: "신입 연봉 2026 현황",
      desc: "대기업·중견·스타트업 기준 신입 연봉과 결혼 자금 관계를 읽어봅니다.",
      href: "/reports/new-employee-salary-2026/",
    },
  ] satisfies WeddingSeriesLink[],
  faq: [
    {
      q: "왜 결혼비용 상승률이 일반 물가보다 더 높게 보이나요?",
      a: "웨딩홀, 식대, 스드메처럼 공급이 제한된 업종이 많고, 코로나 이후 공급 축소와 수요 회복이 겹치면서 일반 물가보다 더 빠르게 상승한 구간이 생겼기 때문입니다.",
    },
    {
      q: "식대는 왜 이렇게 많이 올랐나요?",
      a: "웨딩홀 식재료비·인건비 상승, 코로나 이후 공급 감소로 웨딩홀이 단가를 올렸습니다. 2026년 서울 평균 식대는 1인당 13~15만원대입니다.",
    },
    {
      q: "스드메 기본가가 왜 업체마다 다른가요?",
      a: "지역·패키지 구성·시즌에 따라 크게 달라집니다. 수도권 스튜디오 기준 850만원은 중간값으로, 실제 계약가와 차이가 날 수 있습니다.",
    },
    {
      q: "결혼비용을 줄이려면 어디부터 봐야 하나요?",
      a: "식대가 총비용에서 차지하는 비중이 가장 크기 때문에, 하객 수 기준을 먼저 정하는 것이 효과적입니다. 이후 평일·오전 예식 할인, 스드메 분리 견적, 모바일 청첩장 활용 순으로 접근하면 됩니다.",
    },
    {
      q: "서울과 지방의 결혼비용 차이는 어느 정도인가요?",
      a: "서울 특급호텔 기준 스드메+웨딩홀 합산이 1,600만원 이상인 반면, 지방 광역시는 630~880만원 수준으로 두 배 가까운 차이가 납니다. 신혼여행과 예물은 지역 차이가 상대적으로 적습니다.",
    },
    {
      q: "이 리포트 수치가 실제 계약가와 같은가요?",
      a: "아닙니다. 시장 비교용 평균 구조에 가깝고, 실제 견적은 지역, 보증 인원, 업그레이드 옵션, 여행 지역에 따라 달라집니다. 내 조건으로 계산하려면 하단 결혼 준비 예산 계산기를 이용하세요.",
    },
  ],
};

export function formatManwon(value: number) {
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function formatEokFromManwon(value: number) {
  return `${(value / 10000).toFixed(2)}억원`;
}
