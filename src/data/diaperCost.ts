// 아기 기저귀 값 계산기 — 데이터 파일
// 모든 수치는 추정값입니다. 참고용으로만 활용하세요.

export const PAGE_META = {
  title: "돌까지 기저귀값 계산기 — 브랜드별 1년 총비용 비교",
  subtitle: "신생아부터 돌까지 기저귀 총비용을 브랜드별로 계산해보세요. 하기스·팸퍼스·보솜이 장당가 비교, 월령별 사용량 자동 계산.",
  methodology: "월령별 평균 사용량과 쿠팡 기준 브랜드 가격을 바탕으로 추정한 참고값입니다.",
  caution: "기저귀 사용량은 아이마다 다르며, 가격은 구매 시점·옵션에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 3월 기준",
};

export type Brand = {
  id: string;
  name: string;
  position: string;
  defaultPricePerUnit: number; // 장당가 (원)
  packPrice: number;           // 팩 가격 (원, 참고용)
  packCount: number;           // 팩당 장수
  color: string;               // 차트 색상
  tag: string;                 // 추천 태그
  desc: string;                // 한 줄 설명
};

export const BRANDS: Brand[] = [
  // ── 하기스 ──────────────────────────────────────────────────────────────────
  {
    id: "hagisSkin",
    name: "하기스 스킨에센셜",
    position: "초프리미엄",
    defaultPricePerUnit: 540,
    packPrice: 62640,
    packCount: 116,
    color: "#1565C0",
    tag: "초프리미엄",
    desc: "밴드형, 피부 밀착 설계",
  },
  {
    id: "hagisNature",
    name: "하기스 네이처메이드",
    position: "중상",
    defaultPricePerUnit: 364,
    packPrice: 46592,
    packCount: 128,
    color: "#0097A7",
    tag: "순한 소재",
    desc: "친환경 소재, 피부 트러블 예민한 아이",
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
    desc: "팬티형, 2026 신형",
  },
  // ── 팸퍼스 ──────────────────────────────────────────────────────────────────
  {
    id: "pampersTouch",
    name: "팸퍼스 터치 오브 네이처",
    position: "프리미엄",
    defaultPricePerUnit: 430,
    packPrice: 55040,
    packCount: 128,
    color: "#6A1B9A",
    tag: "프리미엄",
    desc: "자연 유래 소재, 프리미엄 팸퍼스",
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
    desc: "팬티형, 대용량 168매",
  },
  // ── 보솜이 ──────────────────────────────────────────────────────────────────
  {
    id: "bosomiSofty",
    name: "보솜이 소프티소프트",
    position: "중상",
    defaultPricePerUnit: 380,
    packPrice: 45600,
    packCount: 120,
    color: "#2E7D32",
    tag: "부드러움",
    desc: "소프트 안감, 피부 부드러운 느낌",
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
    desc: "팬티형 썸머, 활동적인 아이",
  },
  {
    id: "bosomiMega",
    name: "보솜이 메가드라이",
    position: "실속형",
    defaultPricePerUnit: 276,
    packPrice: 39744,
    packCount: 144,
    color: "#8BC34A",
    tag: "최저가",
    desc: "대용량 실속 구매",
  },
  // ── 마미포코 ─────────────────────────────────────────────────────────────────
  {
    id: "mamypokoHyper",
    name: "마미포코 하이퍼드라이",
    position: "실속형",
    defaultPricePerUnit: 340,
    packPrice: 44880,
    packCount: 132,
    color: "#E65100",
    tag: "실속형",
    desc: "팬티형, 무난한 가격대",
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
    desc: "부드러운 착용감, 가성비 마미포코",
  },
];

// 월령별 하루 평균 사용량 (추정)
export type MonthlyUsageRange = {
  label: string;
  monthStart: number;
  monthEnd: number;
  dailyCount: number;
  size: string;
};

export const MONTHLY_USAGE_RANGES: MonthlyUsageRange[] = [
  { label: "0~1개월", monthStart: 0, monthEnd: 1,  dailyCount: 11,  size: "NB/S" },
  { label: "2~3개월", monthStart: 2, monthEnd: 3,  dailyCount: 9,   size: "S"    },
  { label: "4~6개월", monthStart: 4, monthEnd: 6,  dailyCount: 7,   size: "M"    },
  { label: "7~9개월", monthStart: 7, monthEnd: 9,  dailyCount: 6,   size: "M/L"  },
  { label: "10~12개월", monthStart: 10, monthEnd: 12, dailyCount: 5.5, size: "L" },
];

// 제휴 상품 (쿠팡파트너스 파트너 링크로 교체 필요 — 현재는 검색/상품 URL)
export const AFFILIATE_PRODUCTS = [
  {
    tag: "최저가",
    title: "보솜이 메가드라이",
    desc: "장당 276원 · 대용량 실속 구매",
    url: "https://www.coupang.com/np/search?q=보솜이+메가드라이",
  },
  {
    tag: "가성비",
    title: "보솜이 액션핏",
    desc: "장당 323원 · 120매 38,760원",
    url: "https://www.coupang.com/vp/products/8675584745",
  },
  {
    tag: "대중형",
    title: "하기스 매직컴포트",
    desc: "장당 476원 · 128매 · 2026 신형",
    url: "https://www.coupang.com/vp/products/9364912515",
  },
  {
    tag: "글로벌",
    title: "팸퍼스 베이비드라이",
    desc: "장당 411원 · 168매 대용량",
    url: "https://www.coupang.com/np/search?q=%ED%8C%B8%ED%8D%BC%EC%8A%A4+%EB%B2%A0%EC%9D%B4%EB%B9%84%EB%93%9C%EB%9D%BC%EC%9D%B4+4%EB%8B%A8%EA%B3%84",
  },
];

export const PAGE_FAQ = [
  {
    question: "기저귀는 언제까지 써야 하나요?",
    answer: "보통 만 2~3세, 배변 훈련이 완성되면 졸업합니다. 이 계산기는 돌(12개월)까지를 기본으로 계산하며, 최대 24개월까지 설정할 수 있습니다.",
  },
  {
    question: "신생아 기저귀 하루에 몇 개 써야 하나요?",
    answer: "신생아 초기(0~1개월)는 하루 10~12개가 일반적입니다. 생후 3개월부터는 6~8개로 줄어들며, 이 계산기는 각 월령 평균값을 기준으로 추정합니다.",
  },
  {
    question: "사이즈는 언제 바꿔야 하나요?",
    answer: "기저귀가 자주 새거나 허벅지 자국이 심하면 한 단계 큰 사이즈로 올립니다. 체중 기준도 있지만 아이마다 체형이 달라 직접 확인이 가장 정확합니다.",
  },
  {
    question: "브랜드 선택 기준이 있나요?",
    answer: "가성비를 원하면 보솜이 액션핏(330원/장), 대중적 선택은 하기스 매직컴포트(402원/장), 피부가 예민하면 팸퍼스 베이비드라이 또는 하기스 스킨에센셜이 자주 추천됩니다. 처음에는 소량으로 여러 브랜드를 비교해보는 게 좋습니다.",
  },
  {
    question: "기저귀값이 생각보다 많이 드는 이유가 뭔가요?",
    answer: "신생아 초기에는 하루 10개 이상 사용하기 때문에 월 비용이 높습니다. 대용량 팩으로 구매하면 장당가를 낮출 수 있으며, 가성비 브랜드로 바꾸는 것만으로도 1년에 30~50만원 이상 차이가 날 수 있습니다.",
  },
  {
    question: "이 계산기 결과가 실제 비용과 다를 수 있나요?",
    answer: "네. 월령별 사용량과 브랜드 가격은 평균 추정값이므로 실제와 다를 수 있습니다. 아이의 사용 습관과 구매 가격에 맞게 장당가를 직접 수정하면 더 정확하게 계산할 수 있습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/diaper-cost/",              label: "아기 기저귀 값 계산기" },
  { href: "/tools/birth-support-total/",      label: "출산~2세 총지원금 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "한 명만 육아휴직 총수령액 계산기" },
  { href: "/tools/parental-leave-pay/",       label: "육아휴직 급여 계산기" },
];
