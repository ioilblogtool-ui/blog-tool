export type SeoulHousingKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral";
};

export type SeoulHousingSeriesItem = {
  year: number;
  saleEok: number;
  pir: number;
  jeonseEok: number;
  rentDepositEok: number;
  rentMonthlyManwon: number;
};

export type SeoulHousingCompareRow = {
  label: string;
  value2016: string;
  value2026: string;
  changeLabel: string;
};

export type SeoulHousingDistrictCard = {
  slug: string;
  districtName: string;
  priceEok: number;
  summary: string;
  note: string;
};

export const seoulHousing2016Vs2026 = {
  meta: {
    slug: "seoul-housing-2016-vs-2026",
    title: "서울 집값 2016 vs 2026 비교 | 매매·전세·월세 10년 변화",
    subtitle:
      "서울 평균 매매가, 전세가, 월세, PIR을 기준으로 2016년과 2026년의 주거비 변화를 한 화면에서 비교하고, 내 연봉 기준 체감 부담까지 바로 확인하는 리포트입니다.",
    methodology:
      "이 리포트는 서울 평균 매매가, 전세가, 월세, PIR과 구별 대표 가격을 공개 자료와 기사 정리값 기준으로 비교계산소 리포트 형식에 맞게 재구성한 참고용 콘텐츠입니다.",
    caution:
      "서울 평균값과 특정 구 대표 단지·대표 가격은 같은 성격의 수치가 아니므로 분리해서 해석해야 합니다. 체감 계산은 추정치이며 실제 대출, 자산, 가구 소득 구조에 따라 달라질 수 있습니다.",
    updatedAt: "2026년 4월 기준 정리",
  },
  reportLead:
    "서울 평균 매매가는 2016년 4.1억원에서 2026년 10.3억원으로 올라 10년 사이 2배 이상 커졌습니다. 전세와 월세도 함께 상승했고, PIR은 11.9배에서 25.6배로 높아져 집값 자체보다 연봉 대비 부담이 더 가파르게 악화된 구조를 보여줍니다.",
  kpis: [
    { label: "서울 평균 매매가 상승", value: "+152%", sub: "4.1억 → 10.3억", accent: "up" },
    { label: "서울 평균 전세가 상승", value: "+115%", sub: "2.6억 → 5.6억", accent: "up" },
    { label: "PIR", value: "25.6배", sub: "2016년 11.9배 대비 2.1배 수준", accent: "up" },
    { label: "월세 전환 비중", value: "64%", sub: "2016년 41% 대비 +23%p", accent: "up" },
    { label: "서울 평균 월세", value: "+88%", sub: "62만 → 117만원", accent: "up" },
    { label: "강남 3구 상단 체감", value: "60.8억", sub: "서초 상단 대표 가격 기준", accent: "neutral" },
  ] satisfies SeoulHousingKpi[],
  coreSeries: [
    { year: 2016, saleEok: 4.1, pir: 11.9, jeonseEok: 2.6, rentDepositEok: 0.42, rentMonthlyManwon: 62 },
    { year: 2018, saleEok: 5.9, pir: 15.1, jeonseEok: 3.8, rentDepositEok: 0.65, rentMonthlyManwon: 74 },
    { year: 2020, saleEok: 8.1, pir: 20.8, jeonseEok: 5.2, rentDepositEok: 1.0, rentMonthlyManwon: 88 },
    { year: 2021, saleEok: 9.4, pir: 24.1, jeonseEok: 5.4, rentDepositEok: 1.05, rentMonthlyManwon: 95 },
    { year: 2022, saleEok: 9.8, pir: 23.5, jeonseEok: 5.4, rentDepositEok: 1.1, rentMonthlyManwon: 105 },
    { year: 2024, saleEok: 9.8, pir: 24.9, jeonseEok: 5.4, rentDepositEok: 1.2, rentMonthlyManwon: 113 },
    { year: 2026, saleEok: 10.3, pir: 25.6, jeonseEok: 5.6, rentDepositEok: 1.3, rentMonthlyManwon: 117 },
  ] satisfies SeoulHousingSeriesItem[],
  compareRows: [
    { label: "서울 평균 매매가", value2016: "4.1억", value2026: "10.3억", changeLabel: "+152%" },
    { label: "서울 평균 전세가", value2016: "2.6억", value2026: "5.6억", changeLabel: "+115%" },
    { label: "서울 평균 월세 보증금", value2016: "4,200만", value2026: "1.3억", changeLabel: "+210%" },
    { label: "서울 평균 월세", value2016: "62만원", value2026: "117만원", changeLabel: "+88%" },
    { label: "PIR", value2016: "11.9배", value2026: "25.6배", changeLabel: "+13.7배p" },
    { label: "월세 전환 비중", value2016: "41%", value2026: "64%", changeLabel: "+23%p" },
    { label: "연봉 대비 전세 배수", value2016: "7.5배", value2026: "14.3배", changeLabel: "+6.8배p" },
  ] satisfies SeoulHousingCompareRow[],
  districtCards: [
    { slug: "seocho", districtName: "서초구", priceEok: 51.3, summary: "서울 상단 체감을 가장 강하게 끌어올리는 구간입니다.", note: "원베일리 84㎡ 평균가 60.8억대 참고" },
    { slug: "gangnam", districtName: "강남구", priceEok: 39.3, summary: "평균값과 대표 단지 체감이 모두 높은 핵심 상단 구간입니다.", note: "대치·개포권 중심의 상단 형성" },
    { slug: "songpa", districtName: "송파구", priceEok: 32.7, summary: "대단지 비교가 가능한 대표 실수요 체감 구간입니다.", note: "잠실권 대단지 평균 반영" },
    { slug: "mapo", districtName: "마포구", priceEok: 23.9, summary: "비강남권 중 상단 체감이 빠르게 형성된 구간입니다.", note: "아현·공덕·염리권 포함" },
    { slug: "seongdong", districtName: "성동구", priceEok: 23.0, summary: "서울숲과 옥수 축이 평균을 끌어올리는 구조입니다.", note: "성수·금호권 체감 반영" },
    { slug: "gangdong", districtName: "강동구", priceEok: 20.4, summary: "신축 공급 영향으로 비교군이 풍부한 구간입니다.", note: "고덕권 신축 단지 기준" },
  ] satisfies SeoulHousingDistrictCard[],
  patternNotes: [
    { title: "2021년", body: "서울 평균 매매가가 가장 빠르게 뛰던 구간입니다. 저금리와 유동성, 공급 불안 심리가 겹치며 체감 급등이 강하게 형성됐습니다." },
    { title: "25.6배", body: "PIR은 가격 자체보다 부담 악화를 더 선명하게 보여줍니다. 평균 직장인 기준으로 서울 평균 주택이 더 멀어진 구조입니다." },
    { title: "64%", body: "전세에서 월세로의 전환 비중이 커졌습니다. 초기 목돈 부담이 높은 전세보다 매달 현금 유출이 생기는 월세 구조가 빠르게 확산됐습니다." },
    { title: "구별 편차", body: "서울 평균만 보면 체감이 뭉개질 수 있습니다. 서초·강남·송파 상단과 마포·성동·강동의 가격 차이를 따로 읽어야 합니다." },
  ],
  structureBox: {
    title: "전세에서 월세로 이동한 시장 구조",
    body:
      "전세는 초기 목돈 부담이 크지만 월 고정비가 상대적으로 낮고, 월세는 보증금 부담이 낮아 보여도 매달 현금 유출이 생깁니다. 서울에서는 전세가와 월세 보증금이 함께 올라가면서 전세·월세 모두 부담스러워진 구조가 나타났고, 결과적으로 주거 방식 선택 자체가 더 어려워졌습니다.",
  },
  references: {
    official: [
      { label: "국토교통부 주거누리", href: "https://www.myhome.go.kr/" },
      { label: "국토교통부 실거래가 공개시스템", href: "https://rt.molit.go.kr/" },
      { label: "통계청 국가통계포털", href: "https://kosis.kr/" },
    ],
    market: [
      { label: "KB부동산", href: "https://kbland.kr/" },
      { label: "네이버 부동산", href: "https://new.land.naver.com/" },
      { label: "호갱노노", href: "https://hogangnono.com/" },
    ],
    finance: [
      { label: "부동산 매매 자금 계산기", href: "/tools/home-purchase-fund/" },
      { label: "가구 소득 계산기", href: "/tools/household-income/" },
      { label: "연봉 실수령 계산기", href: "/tools/salary/" },
    ],
  },
  relatedLinks: [
    { label: "부동산 매매 자금 계산기", href: "/tools/home-purchase-fund/" },
    { label: "서울 국평 아파트 가격 비교 리포트", href: "/reports/seoul-84-apartment-prices/" },
    { label: "결혼비용 2016 vs 2026 리포트", href: "/reports/wedding-cost-2016-vs-2026/" },
  ],
  faq: [
    { q: "PIR은 무엇인가요?", a: "PIR은 Price to Income Ratio의 약자로, 연소득 대비 집값 배수를 뜻합니다. 서울 평균 PIR 25.6배는 평균 직장인이 연봉을 모두 모아도 서울 평균 주택에 닿기 어려운 구조임을 보여주는 비교 지표입니다." },
    { q: "서울 집값은 왜 10년 사이 이렇게 많이 올랐나요?", a: "저금리, 유동성, 공급 불안, 지역 선호 집중이 겹치며 가격이 크게 상승했습니다. 다만 이 리포트의 핵심은 가격 상승 자체보다 연봉 대비 부담과 주거 방식 변화가 함께 악화됐다는 점입니다." },
    { q: "전세보다 월세가 더 많아진 이유는 무엇인가요?", a: "전세 보증금 자체가 크게 오르면서 초기 목돈 부담이 커졌고, 임대차 구조 변화와 금리 환경 영향으로 월세 전환 비중이 높아졌습니다. 그래서 지금은 전세와 월세 모두 각각 다른 방식으로 부담을 키우는 구조입니다." },
    { q: "구별 가격 카드와 서울 평균은 같은 기준인가요?", a: "아닙니다. 서울 평균은 도시 전체 평균값이고, 구 카드 값은 대표 구간 체감을 보여주는 비교용 요약값입니다. 특정 대표 단지나 상단 사례를 포함하기 때문에 서울 평균과 직접 1:1 대응해서 보지 않는 것이 좋습니다." },
    { q: "내 연봉 기준 체감 계산은 공식 계산인가요?", a: "아닙니다. 이 계산은 서울 평균 매매가, 전세가, 월세를 연봉 기준으로 단순 환산한 추정 비교입니다. 실제 자산, 대출 한도, 맞벌이 여부, 보유 현금에 따라 체감은 크게 달라질 수 있습니다." },
  ],
  calculatorDefaults: {
    annualIncomeManwon: 5000,
    avgSale2016Manwon: 41000,
    avgSale2026Manwon: 103000,
    avgJeonse2026Manwon: 56000,
    avgMonthlyRent2026Manwon: 117,
  },
};

export function formatEok(value: number) {
  return `${value.toFixed(1)}억`;
}

export function formatManwon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

export function calcHousingFeelings(annualIncomeManwon: number, defaults = seoulHousing2016Vs2026.calculatorDefaults) {
  const safeIncome = Math.max(annualIncomeManwon || 0, 1);
  const sale2016Years = +(defaults.avgSale2016Manwon / safeIncome).toFixed(1);
  const sale2026Years = +(defaults.avgSale2026Manwon / safeIncome).toFixed(1);
  const jeonse2026Years = +(defaults.avgJeonse2026Manwon / safeIncome).toFixed(1);
  const annualRent2026Manwon = defaults.avgMonthlyRent2026Manwon * 12;
  const annualRentShare = Math.round((annualRent2026Manwon / safeIncome) * 100);

  return {
    sale2016Years,
    sale2026Years,
    jeonse2026Years,
    annualRent2026Manwon,
    annualRentShare,
  };
}
