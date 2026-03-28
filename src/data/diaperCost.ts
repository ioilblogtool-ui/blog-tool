export const PAGE_META = {
  title: "돌까지 기저귀값 계산기 | 브랜드별 1년 총비용 비교",
  subtitle: "신생아부터 돌까지 기저귀 총비용을 브랜드별로 계산해보세요. 하기스, 보솜이, 팸퍼스, 마미포코까지 장당 가격과 월령별 사용량을 한 번에 비교합니다.",
  methodology: "월령별 평균 사용량과 브랜드 장당 가격을 바탕으로 추정한 참고값입니다.",
  caution: "기저귀 사용량은 아이마다 다르고, 가격은 구매 시점과 옵션에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 3월 기준",
};

export type Brand = {
  id: string;
  name: string;
  position: string;
  defaultPricePerUnit: number;
  packPrice: number;
  packCount: number;
  color: string;
  tag: string;
  desc: string;
};

export const BRANDS: Brand[] = [
  {
    id: "hagisSkin",
    name: "하기스 스킨에센스",
    position: "초프리미엄",
    defaultPricePerUnit: 540,
    packPrice: 62640,
    packCount: 116,
    color: "#1565C0",
    tag: "초프리미엄",
    desc: "민감 피부 라인으로 자주 비교되는 상단 제품군",
  },
  {
    id: "hagisNature",
    name: "하기스 네이처메이드",
    position: "중상",
    defaultPricePerUnit: 364,
    packPrice: 46592,
    packCount: 128,
    color: "#0097A7",
    tag: "식물성 소재",
    desc: "네이처 계열을 찾는 보호자가 자주 보는 라인",
  },
  {
    id: "hagisMagic",
    name: "하기스 매직컴포트",
    position: "대중형",
    defaultPricePerUnit: 476,
    packPrice: 60928,
    packCount: 128,
    color: "#2196F3",
    tag: "대중형",
    desc: "대형마트와 온라인에서 가장 많이 비교되는 기본군",
  },
  {
    id: "pampersTouch",
    name: "팸퍼스 터치 오브 네이처",
    position: "프리미엄",
    defaultPricePerUnit: 430,
    packPrice: 55040,
    packCount: 128,
    color: "#6A1B9A",
    tag: "프리미엄",
    desc: "프리미엄 계열에서 자주 비교되는 팸퍼스 라인",
  },
  {
    id: "pampers",
    name: "팸퍼스 베이비드라이",
    position: "중간",
    defaultPricePerUnit: 411,
    packPrice: 69048,
    packCount: 168,
    color: "#9C27B0",
    tag: "글로벌",
    desc: "대용량 구성으로 자주 비교되는 대표 제품",
  },
  {
    id: "bosomiSofty",
    name: "보솜이 액션핏 소프트",
    position: "중상",
    defaultPricePerUnit: 380,
    packPrice: 45600,
    packCount: 120,
    color: "#2E7D32",
    tag: "부드러움",
    desc: "착용감 중심으로 비교되는 보솜이 상위 라인",
  },
  {
    id: "bosomiAction",
    name: "보솜이 액션핏",
    position: "가성비",
    defaultPricePerUnit: 323,
    packPrice: 38760,
    packCount: 120,
    color: "#4CAF50",
    tag: "가성비",
    desc: "장당 가격이 낮아 가장 많이 비교되는 제품군",
  },
  {
    id: "bosomiMega",
    name: "보솜이 메가 슬림핏",
    position: "대용량",
    defaultPricePerUnit: 276,
    packPrice: 39744,
    packCount: 144,
    color: "#8BC34A",
    tag: "최저가",
    desc: "대용량 기준 최저가 비교군으로 자주 올라오는 라인",
  },
  {
    id: "mamypokoHyper",
    name: "마미포코 에어핏",
    position: "대용량",
    defaultPricePerUnit: 340,
    packPrice: 44880,
    packCount: 132,
    color: "#E65100",
    tag: "대용량",
    desc: "가격과 수량 균형이 무난한 대용량 제품",
  },
  {
    id: "mamypokoSuper",
    name: "마미포코 슈퍼컴포트",
    position: "가성비",
    defaultPricePerUnit: 329,
    packPrice: 43428,
    packCount: 132,
    color: "#FF9800",
    tag: "가성비",
    desc: "착용감과 가격을 같이 보는 비교군",
  },
];

export type MonthlyUsageRange = {
  label: string;
  monthStart: number;
  monthEnd: number;
  dailyCount: number;
  size: string;
};

export const MONTHLY_USAGE_RANGES: MonthlyUsageRange[] = [
  { label: "0~1개월", monthStart: 0, monthEnd: 1, dailyCount: 11, size: "NB/S" },
  { label: "2~3개월", monthStart: 2, monthEnd: 3, dailyCount: 9, size: "S" },
  { label: "4~6개월", monthStart: 4, monthEnd: 6, dailyCount: 7, size: "M" },
  { label: "7~9개월", monthStart: 7, monthEnd: 9, dailyCount: 6, size: "M/L" },
  { label: "10~12개월", monthStart: 10, monthEnd: 12, dailyCount: 5.5, size: "L" },
];

export const AFFILIATE_PRODUCTS = [
  {
    tag: "최저가",
    title: "보솜이 메가 슬림핏",
    desc: "장당 276원 수준의 대용량 최저가 비교군",
    url: "https://www.coupang.com/np/search?q=%EB%B3%B4%EC%86%9C%EC%9D%B4+%EB%A9%94%EA%B0%80+%EC%8A%AC%EB%A6%BC%ED%95%8F",
  },
  {
    tag: "가성비",
    title: "보솜이 액션핏",
    desc: "장당 323원 수준의 대표 가성비 기저귀",
    url: "https://www.coupang.com/vp/products/8675584745",
  },
  {
    tag: "대중형",
    title: "하기스 매직컴포트",
    desc: "장당 476원 수준의 대중형 비교군",
    url: "https://www.coupang.com/vp/products/9364912515",
  },
  {
    tag: "글로벌",
    title: "팸퍼스 베이비드라이",
    desc: "장당 411원 수준의 글로벌 대표 제품",
    url: "https://www.coupang.com/np/search?q=%ED%8C%B8%ED%8D%BC%EC%8A%A4+%EB%B2%A0%EC%9D%B4%EB%B9%84%EB%93%9C%EB%9D%BC%EC%9D%B4+4%EB%8B%A8%EA%B3%84",
  },
];

export const EXTERNAL_REFERENCE_LINKS = [
  {
    title: "질병관리청 국가건강정보포털 영유아 건강",
    desc: "기저귀 발진, 피부 관리, 영유아 성장 단계별 기본 정보를 확인할 때 참고",
    url: "https://health.kdca.go.kr/healthinfo/",
  },
  {
    title: "대한소아청소년과학회",
    desc: "영유아 피부와 성장 관련 전문 학회 자료를 찾을 때 참고",
    url: "https://www.pediatrics.or.kr/",
  },
  {
    title: "소비자24",
    desc: "생활용품 관련 리콜과 소비자 정보를 확인할 때 참고",
    url: "https://www.consumer.go.kr/",
  },
];

export const PAGE_FAQ = [
  {
    question: "기저귀는 언제까지 쓰나요?",
    answer: "개인차가 있지만 보통 만 2~3세 전후에 배변 훈련이 마무리되면 졸업하는 경우가 많습니다. 이 계산기는 돌까지를 기본 구간으로 두고, 최대 24개월까지도 비교할 수 있게 구성했습니다.",
  },
  {
    question: "신생아는 기저귀를 하루에 몇 장 쓰나요?",
    answer: "신생아 초기에는 하루 10장 안팎까지 사용하는 경우가 흔하고, 월령이 올라갈수록 장수가 점차 줄어듭니다. 이 계산기는 월령별 평균 장수를 기준으로 단순화해 계산합니다.",
  },
  {
    question: "사이즈는 언제 바꾸면 되나요?",
    answer: "허벅지나 배 부분이 자주 새거나, 착용했을 때 압박이 느껴지면 다음 사이즈를 고려하는 경우가 많습니다. 실제 사이즈 교체는 체형 차이가 커서 참고용으로만 봐야 합니다.",
  },
  {
    question: "브랜드는 어떻게 비교하면 좋나요?",
    answer: "장당 가격 기준의 가성비를 먼저 보려면 보솜이 액션핏, 메가 슬림핏 같은 제품이 유리하고, 착용감이나 프리미엄 계열을 함께 보려면 하기스, 팸퍼스까지 같이 두고 총액을 비교하는 방식이 현실적입니다.",
  },
  {
    question: "기저귀값이 생각보다 많이 드는 이유는 뭔가요?",
    answer: "생후 초기 몇 개월은 하루 사용량이 가장 많고, 행사 여부에 따라 장당 가격 차이도 크게 벌어지기 때문입니다. 브랜드를 바꾸거나 대용량 묶음을 활용하면 연간 비용 차이가 꽤 커질 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 비용이 왜 다를 수 있나요?",
    answer: "이 값은 월령별 평균 장수와 현재 입력한 장당 가격을 기준으로 계산한 추정치입니다. 실제 사용량, 밤기저귀 분리 사용, 할인 행사 여부에 따라 지출은 달라질 수 있습니다.",
  },
];

export const NEXT_CALCULATOR = {
  href: "/tools/formula-cost/",
  title: "다음 계산기 열기",
  headline: "분유값 계산기로 이어보기",
  desc: "기저귀와 함께 가장 자주 비교되는 육아 고정지출은 분유입니다. 같은 기간 기준으로 브랜드별 분유 총비용도 바로 이어서 확인해보세요.",
  cta: "분유값 계산기 열기",
};

export const relatedLinks = [
  { href: "/tools/formula-cost/", label: "아기 분유값 계산기" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "엄마만 육아휴직 총수령액 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
];
