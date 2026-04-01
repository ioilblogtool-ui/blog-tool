export type SalaryAssetKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral";
};

export type SalaryAssetAverageSeriesItem = {
  year: number;
  averageSalaryManwon: number;
  averageAssetEok: number;
};

export type SalaryAssetIndexSeriesItem = {
  year: number;
  salaryIndex: number;
  assetIndex: number;
  housingIndex: number;
};

export type SalaryAssetCompareRow = {
  label: string;
  value2016: string;
  value2026: string;
  changeLabel: string;
};

export type SalaryIncomeBandRow = {
  label: string;
  salary2016: string;
  salary2026: string;
  growth: string;
  feeling: string;
};

export type SalaryAssetGapCard = {
  slug: string;
  title: string;
  asset2016: string;
  asset2026: string;
  growth: string;
  summary: string;
  note: string;
};

export type SalaryAssetAgeRow = {
  age: string;
  asset2016Eok: number;
  asset2026Eok: number;
  note: string;
};

export const salaryAsset2016Vs2026 = {
  meta: {
    slug: "salary-asset-2016-vs-2026",
    title: "한국인 평균 연봉·자산 2016 vs 2026 비교 | 따라잡을 수 있나",
    subtitle:
      "중위 연봉, 평균 자산, 서울 집값 지수를 한 화면에서 비교해 2016년과 2026년 사이 자산 형성 구조가 어떻게 달라졌는지 읽는 인터랙티브 리포트입니다.",
    methodology:
      "이 리포트는 공개 통계와 기사 정리값을 기준으로 중위 연봉, 평균 연봉, 중위 자산, 평균 자산, 서울 평균 집값과 부동산 보유 여부별 자산 격차를 비교계산소 리포트 형식에 맞게 재구성한 참고용 콘텐츠입니다.",
    caution:
      "평균값과 중위값은 같은 의미가 아니며, 자산 통계는 금융자산·부동산 평가 방식에 따라 차이가 있을 수 있습니다. 체감 계산은 단순 추정치이며 실제 저축률, 투자수익률, 부채, 맞벌이 여부에 따라 달라집니다.",
    updatedAt: "2026년 4월 기준 정리",
  },
  reportLead:
    "중위 연봉은 2016년 2,960만원에서 2026년 3,910만원으로 32% 늘었지만, 중위 자산은 1.9억원에서 3.3억원으로 73% 상승했고 서울 집값 지수는 252까지 올라 연봉 상승보다 자산과 주거비 부담이 더 빠르게 벌어진 구조를 보여줍니다.",
  kpis: [
    { label: "중위 연봉 변화", value: "+32%", sub: "2,960만 → 3,910만", accent: "up" },
    { label: "중위 자산 변화", value: "+73%", sub: "1.9억 → 3.3억", accent: "up" },
    { label: "서울 집값 지수", value: "252", sub: "2016=100 기준", accent: "up" },
    { label: "부동산 보유자 자산", value: "5.8억", sub: "2016년 2.6억 대비 +123%", accent: "up" },
    { label: "미보유자 자산", value: "0.6억", sub: "2016년 0.5억 대비 +20%", accent: "neutral" },
    { label: "자산 격차", value: "5.2억", sub: "2016년 2.1억에서 확대", accent: "up" },
  ] satisfies SalaryAssetKpi[],
  averageSeries: [
    { year: 2016, averageSalaryManwon: 3420, averageAssetEok: 2.8 },
    { year: 2018, averageSalaryManwon: 3610, averageAssetEok: 3.1 },
    { year: 2020, averageSalaryManwon: 3890, averageAssetEok: 3.6 },
    { year: 2021, averageSalaryManwon: 4020, averageAssetEok: 3.9 },
    { year: 2022, averageSalaryManwon: 4260, averageAssetEok: 4.4 },
    { year: 2024, averageSalaryManwon: 4540, averageAssetEok: 4.9 },
    { year: 2026, averageSalaryManwon: 4780, averageAssetEok: 5.4 },
  ] satisfies SalaryAssetAverageSeriesItem[],
  indexSeries: [
    { year: 2016, salaryIndex: 100, assetIndex: 100, housingIndex: 100 },
    { year: 2018, salaryIndex: 106, assetIndex: 111, housingIndex: 132 },
    { year: 2020, salaryIndex: 114, assetIndex: 126, housingIndex: 184 },
    { year: 2021, salaryIndex: 119, assetIndex: 139, housingIndex: 214 },
    { year: 2022, salaryIndex: 124, assetIndex: 151, housingIndex: 236 },
    { year: 2024, salaryIndex: 129, assetIndex: 164, housingIndex: 239 },
    { year: 2026, salaryIndex: 132, assetIndex: 173, housingIndex: 252 },
  ] satisfies SalaryAssetIndexSeriesItem[],
  compareRows: [
    { label: "중위 연봉", value2016: "2,960만원", value2026: "3,910만원", changeLabel: "+32%" },
    { label: "평균 연봉", value2016: "3,420만원", value2026: "4,780만원", changeLabel: "+40%" },
    { label: "중위 자산", value2016: "1.9억원", value2026: "3.3억원", changeLabel: "+73%" },
    { label: "평균 자산", value2016: "2.8억원", value2026: "5.4억원", changeLabel: "+93%" },
    { label: "서울 평균 집값", value2016: "4.1억원", value2026: "10.3억원", changeLabel: "+152%" },
    { label: "보유자-미보유자 격차", value2016: "2.1억원", value2026: "5.2억원", changeLabel: "+148%" },
    { label: "서울 집값/중위 연봉", value2016: "13.9배", value2026: "26.3배", changeLabel: "+12.4배p" },
  ] satisfies SalaryAssetCompareRow[],
  incomeBands: [
    { label: "하위 25%", salary2016: "1,920만원", salary2026: "2,250만원", growth: "+17%", feeling: "서울 전세도 부담이 큰 구간" },
    { label: "중위 50%", salary2016: "2,960만원", salary2026: "3,910만원", growth: "+32%", feeling: "집값 속도를 따라가기 어려운 구간" },
    { label: "상위 25%", salary2016: "4,800만원", salary2026: "6,500만원", growth: "+35%", feeling: "대출과 맞벌이 전제가 필요한 구간" },
    { label: "상위 10%", salary2016: "7,500만원", salary2026: "10,200만원", growth: "+36%", feeling: "전세 접근은 가능하지만 매매는 여전히 부담" },
    { label: "상위 5%", salary2016: "1억 800만원", salary2026: "1억 4,500만원", growth: "+34%", feeling: "비교적 접근 가능하지만 자산 격차 영향이 큼" },
  ] satisfies SalaryIncomeBandRow[],
  gapCards: [
    {
      slug: "owner",
      title: "부동산 보유자",
      asset2016: "2.6억원",
      asset2026: "5.8억원",
      growth: "+123%",
      summary: "보유 자산의 가격 상승 효과가 누적되며 10년 동안 자산 증가 폭이 가장 크게 벌어진 집단입니다.",
      note: "평균 자산 5.1억 수준의 부동산과 0.7억 수준의 금융자산 구조",
    },
    {
      slug: "non-owner",
      title: "부동산 미보유자",
      asset2016: "0.5억원",
      asset2026: "0.6억원",
      growth: "+20%",
      summary: "소득과 저축만으로는 자산 증가폭이 제한적이어서 보유자와의 격차가 더 벌어진 구간입니다.",
      note: "평균 금융자산 0.4억 수준, 전월세 부담이 누적되는 구조",
    },
  ] satisfies SalaryAssetGapCard[],
  ageRows: [
    { age: "20대", asset2016Eok: 0.8, asset2026Eok: 1.1, note: "사회초년 구간으로 상승 폭이 제한적입니다." },
    { age: "30대", asset2016Eok: 1.9, asset2026Eok: 2.7, note: "내 집 마련 진입 장벽이 가장 크게 느껴지는 구간입니다." },
    { age: "40대", asset2016Eok: 3.5, asset2026Eok: 5.8, note: "기존 보유자산 효과가 본격적으로 커지는 구간입니다." },
    { age: "50대", asset2016Eok: 4.8, asset2026Eok: 7.6, note: "누적 자산과 부동산 평가이익이 크게 반영됩니다." },
    { age: "60대+", asset2016Eok: 4.2, asset2026Eok: 6.4, note: "현금흐름보다 기존 보유자산 영향이 큽니다." },
  ] satisfies SalaryAssetAgeRow[],
  patternNotes: [
    { title: "132 vs 252", body: "2016년을 100으로 두면 중위 연봉 지수는 132인데 서울 집값 지수는 252입니다. 소득 상승만으로는 주거비 속도를 따라가기 어려운 구조입니다." },
    { title: "+73%", body: "중위 자산은 늘었지만, 이 변화가 모두에게 동일하게 분배된 것은 아닙니다. 보유 여부에 따라 실제 체감은 크게 갈립니다." },
    { title: "5.2억 격차", body: "부동산 보유자와 미보유자 사이 평균 자산 차이는 2016년 2.1억원에서 2026년 5.2억원으로 확대됐습니다." },
    { title: "40~50대 집중", body: "자산 증가 폭은 40~50대에서 가장 크게 나타납니다. 기존 보유자산이 있는 구간일수록 상승 효과가 크게 누적됩니다." },
  ],
  structureBox: {
    title: "연봉보다 자산이 더 빨리 벌어진 10년",
    body:
      "소득은 매년 조금씩 늘어도 자산은 집값 상승과 기존 보유자산 효과가 겹치면서 더 빠르게 확대됩니다. 특히 서울 주거비가 급등한 2020년 이후에는 소득 상승만으로 격차를 메우기 어려워졌고, 자산 형성 초입 구간일수록 체감 박탈감이 커지는 구조가 뚜렷해졌습니다.",
  },
  references: {
    official: [
      { label: "통계청 국가통계포털", href: "https://kosis.kr/" },
      { label: "한국은행 경제통계시스템", href: "https://ecos.bok.or.kr/" },
      { label: "국토교통부 실거래가 공개시스템", href: "https://rt.molit.go.kr/" },
    ],
    market: [
      { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/" },
      { label: "가구 소득 계산기", href: "/tools/household-income/" },
      { label: "연봉 티어 계산기", href: "/tools/salary-tier/" },
    ],
    next: [
      { label: "연봉 실수령 계산기", href: "/tools/salary/" },
      { label: "연봉 협상 계산기", href: "/tools/negotiation/" },
      { label: "부동산 매매 자금 계산기", href: "/tools/home-purchase-fund/" },
    ],
  },
  relatedLinks: [
    { label: "연봉 티어 계산기", href: "/tools/salary-tier/" },
    { label: "서울 집값 2016 vs 2026 리포트", href: "/reports/seoul-housing-2016-vs-2026/" },
    { label: "가구 소득 계산기", href: "/tools/household-income/" },
  ],
  faq: [
    { q: "평균 연봉과 중위 연봉은 왜 같이 보나요?", a: "평균 연봉은 상위 구간 영향이 반영돼 전체 체감을 과하게 높여 보일 수 있고, 중위 연봉은 가운데 분포를 보여줍니다. 이 리포트는 평균과 중위를 같이 두어 연봉 체감과 자산 구조를 더 현실적으로 읽게 합니다." },
    { q: "왜 서울 집값을 같이 비교하나요?", a: "자산 형성 체감에서 가장 큰 축이 주거비이기 때문입니다. 연봉이 올라도 서울 집값과 전세가가 더 빠르게 오르면 자산 축적 속도는 뒤처질 수 있습니다." },
    { q: "부동산 보유자와 미보유자 자산 차이는 어떤 의미인가요?", a: "같은 10년 동안에도 보유 여부에 따라 자산 증가폭이 크게 달랐다는 뜻입니다. 기존 보유자산이 있는 집단은 가격 상승 효과를 누적하지만, 미보유 집단은 저축만으로 따라가야 하므로 격차가 커질 수 있습니다." },
    { q: "내 연봉 기준 체감 계산은 공식 계산인가요?", a: "아닙니다. 입력 연봉을 기준으로 서울 집값과 전세가, 10년 저축 가정을 단순 비교한 추정치입니다. 실제 자산, 부채, 투자수익률, 맞벌이 여부에 따라 결과는 크게 달라질 수 있습니다." },
  ],
  calculatorDefaults: {
    annualIncomeManwon: 4000,
    savingRatePercent: 30,
    medianSalary2026Manwon: 3910,
    seoulAvgHouse2026Manwon: 103000,
    seoulAvgJeonse2026Manwon: 56000,
  },
};

export function formatAssetEok(value: number) {
  return `${value.toFixed(1)}억`;
}

export function calcSalaryAssetFeelings(
  annualIncomeManwon: number,
  savingRatePercent: number,
  defaults = salaryAsset2016Vs2026.calculatorDefaults,
) {
  const safeIncome = Math.max(Number(annualIncomeManwon) || 0, 1);
  const safeSavingRate = Math.min(Math.max(Number(savingRatePercent) || 0, 0), 100);
  const annualSaving = safeIncome * (safeSavingRate / 100);
  const tenYearSaving = Math.round(annualSaving * 10);
  const houseGapManwon = Math.max(defaults.seoulAvgHouse2026Manwon - tenYearSaving, 0);
  const jeonseYears = +(defaults.seoulAvgJeonse2026Manwon / Math.max(annualSaving, 1)).toFixed(1);
  const houseMultiple = +(defaults.seoulAvgHouse2026Manwon / safeIncome).toFixed(1);
  const salaryPosition = safeIncome >= 14500 ? "상위 5% 안쪽" : safeIncome >= 10200 ? "상위 10% 안쪽" : safeIncome >= 6500 ? "상위 25% 안쪽" : safeIncome >= 3910 ? "중위권 이상" : safeIncome >= 2250 ? "중위권 아래" : "하위 25% 구간";

  return {
    annualSaving,
    tenYearSaving,
    houseGapManwon,
    jeonseYears,
    houseMultiple,
    salaryPosition,
  };
}
