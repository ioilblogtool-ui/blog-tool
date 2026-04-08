export type BabyCostKpi = {
  label: string;
  value: string;
  sub: string;
  accent?: "up" | "neutral" | "warning";
};

export type BabyCostContextRow = {
  label: string;
  value: string;
  sub: string;
};

export type BabyCostAnnualRow = {
  year: number;
  births: number;
  fertilityRate: number;
};

export type BabyCostCompareRow = {
  label: string;
  value2016: string;
  value2026: string;
  changeLabel: string;
  note: string;
};

export type BabyCostItemRow = {
  item: string;
  cost2016: string;
  cost2026: string;
  changePoint: string;
  interpretation: string;
};

export type BabyCostStructureNote = {
  title: string;
  body: string;
};

export type BabyCostSupportScenario = {
  label: string;
  formula: string;
  diaper: string;
  daycare: string;
  support: string;
  feelBand: string;
};

export type BabyCostReferenceLink = {
  label: string;
  href: string;
};

export type BabyCostFeelDefaults = {
  newborn: {
    formula: number;
    mixed: number;
    breast: number;
    diaper: number;
    daycareHome: number;
    daycareUse: number;
    supportHome: number;
    supportDaycare: number;
  };
  infant: {
    formula: number;
    mixed: number;
    breast: number;
    diaper: number;
    daycareHome: number;
    daycareUse: number;
    supportHome: number;
    supportDaycare: number;
  };
};

export const babyCost2016Vs2026 = {
  meta: {
    slug: "baby-cost-2016-vs-2026",
    title: "아이 키우는 비용 2016 vs 2026 비교 | 분유·기저귀·어린이집 얼마나 올랐나",
    subtitle:
      "분유, 기저귀, 어린이집을 기준으로 2016년과 2026년의 육아 체감 비용을 비교하고, 최신 출산 통계와 부모급여·보육료 구조까지 함께 읽는 인터랙티브 리포트입니다.",
    methodology:
      "출생아 수·합계출산율은 통계청 공식 통계, 평균 초혼 연령은 2024년 혼인이혼 통계, 부모급여는 보건복지부 정책 페이지, 2026년 보육료는 아이사랑 공지 기준을 사용했습니다. 분유와 기저귀는 국가 단일 평균통계가 없어 2016년 소비자단체 가격조사와 2026년 비교계산소 계산기 기준 대표 상품 가격을 같은 단위로 재구성한 참고값입니다.",
    caution:
      "2026년 4월 8일 현재 연간 출생아 수·합계출산율 최신 연간 값은 2025년 잠정 통계까지입니다. 분유·기저귀는 브랜드, 구매처, 행사 여부에 따라 실제 체감이 크게 달라질 수 있습니다.",
    updatedAt: "2026년 4월 8일 출처 반영 업데이트",
  },
  reportLead:
    "공식 통계로 보면 출생아 수는 2016년 40만 6,243명에서 2025년 잠정 25만 4,457명으로 줄었고, 합계출산율도 1.17명에서 0.80명으로 낮아졌습니다. 같은 기간 육아 현장에서는 분유·기저귀 같은 반복지출의 체감이 커졌고, 어린이집은 보육료 자체보다 부모급여 차액 구조를 함께 봐야 실제 부담을 읽을 수 있게 됐습니다.",
  kpis: [
    { label: "출생아 수 변화", value: "-37.4%", sub: "2016 40.6만 → 2025 25.4만(잠정)", accent: "warning" },
    { label: "합계출산율 변화", value: "1.17 → 0.80", sub: "2016 대비 2025 잠정치", accent: "warning" },
    { label: "0세반 보육료 지원단가", value: "+39.7%", sub: "41.8만 → 58.4만", accent: "up" },
    { label: "부모급여", value: "0세 월 100만원", sub: "1세 월 50만원, 2026 기준", accent: "up" },
    { label: "분유 대표 800g 1통", value: "+39%", sub: "2016 최저 15,807원 → 2026 22,000원", accent: "up" },
    { label: "기저귀 대표 장당가", value: "+59~134%", sub: "2016 최저 203원 → 2026 323~476원", accent: "up" },
  ] satisfies BabyCostKpi[],
  contextRows: [
    { label: "2016 출생아 수", value: "406,243명", sub: "합계출산율 1.172명" },
    { label: "2024 출생아 수", value: "238,317명", sub: "합계출산율 0.748명" },
    { label: "2025 출생아 수", value: "254,457명", sub: "합계출산율 0.800명, 잠정" },
    { label: "평균 초혼 연령", value: "남 33.9 / 여 31.6", sub: "2024년 혼인이혼 통계" },
  ] satisfies BabyCostContextRow[],
  annualRows: [
    { year: 2016, births: 406243, fertilityRate: 1.172 },
    { year: 2017, births: 357771, fertilityRate: 1.052 },
    { year: 2018, births: 326822, fertilityRate: 0.977 },
    { year: 2019, births: 302676, fertilityRate: 0.918 },
    { year: 2020, births: 272337, fertilityRate: 0.837 },
    { year: 2021, births: 260562, fertilityRate: 0.808 },
    { year: 2022, births: 249186, fertilityRate: 0.778 },
    { year: 2023, births: 230028, fertilityRate: 0.721 },
    { year: 2024, births: 238317, fertilityRate: 0.748 },
    { year: 2025, births: 254457, fertilityRate: 0.8 },
  ] satisfies BabyCostAnnualRow[],
  compareRows: [
    { label: "분유 대표 800g 1통", value2016: "1.58만~1.97만원", value2026: "2.20만~2.96만원", changeLabel: "+12~39%", note: "2016 가격조사 vs 2026 대표 상품 기준" },
    { label: "기저귀 대표 장당가", value2016: "최저 203원", value2026: "323원~476원", changeLabel: "+59~134%", note: "반복구매 체감이 큰 항목" },
    { label: "어린이집 0세반 지원단가", value2016: "41.8만원", value2026: "58.4만원", changeLabel: "+39.7%", note: "공식 보육료 지원단가 기준" },
    { label: "부모 현금지원", value2016: "부모급여 없음", value2026: "0세 월 100만원 / 1세 월 50만원", changeLabel: "지원 확대", note: "어린이집 이용 시 차액 구조로 전환" },
  ] satisfies BabyCostCompareRow[],
  itemRows: [
    {
      item: "분유",
      cost2016: "앱솔루트 명작 800g 최저 15,807원, 임페리얼XO 800g 최저 19,667원",
      cost2026: "앱솔루트 명작 800g 22,000원, 아이엠마더 800g 29,550원",
      changePoint: "대표 캔 기준 +12~39%",
      interpretation: "단가 상승 자체도 있지만 프리미엄 선택지 확장으로 체감 차이가 더 크게 벌어졌습니다.",
    },
    {
      item: "기저귀",
      cost2016: "하기스 보송보송 162매 최저 32,900원(장당 203원)",
      cost2026: "보솜이 액션핏 323원/매, 하기스 매직컴포트 476원/매",
      changePoint: "대표 장당가 +59~134%",
      interpretation: "한 번의 구매액보다 월 반복구매 총량이 체감 부담을 빠르게 키웁니다.",
    },
    {
      item: "어린이집",
      cost2016: "0세반 41.8만 / 1세반 36.8만 / 2세반 30.4만",
      cost2026: "0세반 58.4만 / 1세반 51.5만 / 2세반 42.6만",
      changePoint: "정부지원 단가 +40% 안팎",
      interpretation: "보육료만 보면 단순 인상처럼 보이지만, 2026년은 부모급여 차액 구조를 함께 봐야 실제 체감이 읽힙니다.",
    },
  ] satisfies BabyCostItemRow[],
  structureNotes: [
    {
      title: "출생 통계의 최신 연간 값은 2025년 잠정까지입니다",
      body: "이 페이지는 2026년 4월 8일 현재 공표된 최신 연간 출생 통계인 2025년 잠정치를 기준으로 연도별 흐름을 보여줍니다.",
    },
    {
      title: "어린이집은 공식 단가보다 차액 구조가 중요합니다",
      body: "2026년에는 부모급여와 보육료 차액 정산 구조가 있어, 단순 보육료 인상률만 보면 실제 체감을 오해할 수 있습니다.",
    },
    {
      title: "분유와 기저귀는 반복구매 체감이 핵심입니다",
      body: "대표 상품 가격 자체도 올랐지만, 월별 누적 구매가 이어진다는 점에서 부모 체감은 더 크게 나타납니다.",
    },
    {
      title: "육아비는 주거·결혼 비용 위에 겹쳐집니다",
      body: "평균 초혼 연령이 남 33.9세, 여 31.6세까지 올라온 환경에서 육아가 시작되기 때문에 같은 금액도 더 무겁게 느껴질 수 있습니다.",
    },
  ] satisfies BabyCostStructureNote[],
  supportScenarios: [
    { label: "0세 가정보육", formula: "월 11만", diaper: "월 9만", daycare: "가정보육 중심", support: "부모급여 100만원", feelBand: "지원금 범위 안에서 방어 가능" },
    { label: "0세 어린이집", formula: "월 8만", diaper: "월 8만", daycare: "0세반 58.4만", support: "부모급여 차액 41.6만원", feelBand: "보육료 외 추가 준비비 확인 필요" },
    { label: "12~23개월 어린이집", formula: "월 7만", diaper: "월 7.5만", daycare: "1세반 51.5만 / 2세반 42.6만", support: "부모급여 차액 없음", feelBand: "월 40만원 이상 체감 가능" },
  ] satisfies BabyCostSupportScenario[],
  references: {
    official: [
      { label: "2025년 출생통계(잠정) 통계청", href: "https://www.kostat.go.kr/boardDownload.es?bid=204&list_no=443686&seq=1" },
      { label: "2024년 혼인이혼 통계 통계청", href: "https://www.kostat.go.kr/board.es?act=view&bid=204&list_no=435601&mid=a10301020300&ref_bid=&tag=" },
      { label: "부모급여 보건복지부 정책 페이지", href: "https://www.mohw.go.kr/menu.es?mid=a10711030600" },
    ] satisfies BabyCostReferenceLink[],
    policy: [
      { label: "2026년 보육료 인상 및 부모급여 차액 공지", href: "https://www.childcare.go.kr/?BVIEWGB=2&bgb=1&bid=1895876&cb_sido_code=&cb_sigun_code=&flag=Sl&menuno=326&offset=&programId=&searchStr=&searchType=1" },
      { label: "중앙육아종합지원센터 0~5세반 보육료", href: "https://central.childcare.go.kr/lcentral/d1_30000/d1_600058/d1_600320/d1_600322.jsp" },
      { label: "출산~2세 지원금 계산기", href: "/tools/birth-support-total/" },
    ] satisfies BabyCostReferenceLink[],
    reading: [
      { label: "2016년 영아 대상 기관보육 내실화 방안 연구", href: "https://repo.kicce.re.kr/bitstream/2019.oak/793/2/%EC%98%81%EC%95%84%20%EB%8C%80%EC%83%81%20%EA%B8%B0%EA%B4%80%EB%B3%B4%EC%9C%A1%20%EB%82%B4%EC%8B%A4%ED%99%94%20%EB%B0%A9%EC%95%88%20%EC%97%B0%EA%B5%AC%3A%20%EA%B0%80%EC%A0%95%EC%96%B4%EB%A6%B0%EC%9D%B4%EC%A7%91%EC%9D%84%20%EC%A4%91%EC%8B%AC%EC%9C%BC%EB%A1%9C.pdf" },
      { label: "2016년 분유·기저귀 가격조사 기사", href: "https://www.wowtv.co.kr/NewsCenter/News/Read?articleId=A201605300532" },
      { label: "신생아~돌 육아 비용 가이드", href: "/reports/baby-cost-guide-first-year/" },
    ] satisfies BabyCostReferenceLink[],
  },
  relatedLinks: [
    { label: "출산~2세 지원금 계산기", href: "/tools/birth-support-total/" },
    { label: "육아휴직 + 육아기 단축근무 계산기", href: "/tools/parental-leave-short-work-calculator/" },
    { label: "신생아~돌 육아 비용 가이드", href: "/reports/baby-cost-guide-first-year/" },
  ] satisfies BabyCostReferenceLink[],
  faq: [
    {
      q: "왜 2026년 리포트인데 출산율 차트는 2025년까지인가요?",
      a: "2026년 4월 8일 현재 통계청이 공표한 최신 연간 출생아 수·합계출산율은 2025년 잠정치까지이기 때문입니다. 그래서 연도별 차트는 2016~2025로 구성했습니다.",
    },
    {
      q: "어린이집 비용은 왜 단순 가격비교로 끝내지 않나요?",
      a: "2026년에는 0~23개월 아동의 부모급여와 보육료 차액 구조가 있어서, 공식 보육료 단가만 보면 실제 체감이 왜곡될 수 있기 때문입니다.",
    },
    {
      q: "분유·기저귀 값은 공식 통계가 아닌가요?",
      a: "국가가 공표하는 단일 평균 가격통계가 바로 제공되지 않아, 2016년 소비자단체 가격조사와 2026년 현재 비교계산소 계산기 기준 대표 상품 가격을 같은 단위로 맞춘 참고값입니다.",
    },
    {
      q: "부모급여가 있으면 육아비 부담이 거의 없어지나요?",
      a: "가정보육 초기 부담을 줄이는 데는 도움이 되지만 분유, 기저귀, 주거비, 시간 비용을 모두 대체하지는 못합니다. 특히 어린이집 이용 시에는 차액 구조와 추가 준비비를 함께 봐야 합니다.",
    },
  ],
  feelDefaults: {
    newborn: {
      formula: 110000,
      mixed: 70000,
      breast: 30000,
      diaper: 90000,
      daycareHome: 0,
      daycareUse: 584000,
      supportHome: 1000000,
      supportDaycare: 416000,
    },
    infant: {
      formula: 70000,
      mixed: 45000,
      breast: 20000,
      diaper: 75000,
      daycareHome: 0,
      daycareUse: 515000,
      supportHome: 500000,
      supportDaycare: 0,
    },
  } satisfies BabyCostFeelDefaults,
};

type StageMode = "newborn" | "infant";
type FeedingMode = "formula" | "mixed" | "breast";
type ChildcareMode = "home" | "daycare";

export function formatCostManwon(value: number) {
  return `${(value / 10000).toFixed(1)}만원`;
}

export function calcBabyCostFeelings(
  stageMode: StageMode,
  feedingMode: FeedingMode,
  childcareMode: ChildcareMode,
  defaults = babyCost2016Vs2026.feelDefaults,
) {
  const stage = defaults[stageMode];
  const feedingCost = stage[feedingMode];
  const diaperCost = stage.diaper;
  const childcareCost = childcareMode === "daycare" ? stage.daycareUse : stage.daycareHome;
  const support = childcareMode === "daycare" ? stage.supportDaycare : stage.supportHome;
  const baseMonthlyCost = feedingCost + diaperCost + childcareCost;
  const netBurden = Math.max(baseMonthlyCost - support, 0);

  let largestLabel = "분유";
  let largestCost = feedingCost;
  if (diaperCost > largestCost) {
    largestCost = diaperCost;
    largestLabel = "기저귀";
  }
  if (childcareCost > largestCost) {
    largestLabel = "어린이집";
  }

  let feelBand = "월 10만원 미만";
  if (netBurden >= 400000) feelBand = "월 40만원 이상";
  else if (netBurden >= 200000) feelBand = "월 20만~40만원";
  else if (netBurden >= 100000) feelBand = "월 10만~20만원";

  let summaryLabel = "지원금 반영 시 버틸 만한 구간";
  if (childcareMode === "daycare") summaryLabel = "공식 지원과 실제 준비비를 함께 봐야 하는 구간";
  else if (feedingMode === "formula") summaryLabel = "반복구매 체감이 크게 남는 구간";

  return {
    feedingCost,
    diaperCost,
    childcareCost,
    support,
    baseMonthlyCost,
    netBurden,
    feelBand,
    largestLabel,
    summaryLabel,
  };
}
