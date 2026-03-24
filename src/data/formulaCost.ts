// 아기 분유 값 계산기 — 데이터 파일
// 모든 수치는 추정값입니다. 참고용으로만 활용하세요.

export const PAGE_META = {
  title: "돌까지 분유값 계산기 — 브랜드별 1년 총비용 비교",
  subtitle: "신생아부터 돌까지 분유 총비용을 브랜드별로 계산해보세요. 앱솔루트 명작·임페리얼드림·압타밀 100g당 가격 비교, 월령별 사용량 자동 계산.",
  methodology: "월령별 평균 사용량(g)과 쿠팡 기준 브랜드 가격을 바탕으로 추정한 참고값입니다.",
  caution: "분유 사용량은 아이마다 다르며, 가격은 구매 시점·단계·옵션에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 3월 기준",
};

export type FormulaBrand = {
  id: string;
  name: string;
  position: string;
  defaultPricePer100g: number; // 100g당 가격 (원)
  canSize: number;             // 캔 용량 (g, 참고용)
  canPrice: number;            // 캔 가격 (원, 참고용)
  color: string;               // 차트 색상
  tag: string;                 // 추천 태그
  desc: string;                // 한 줄 설명
  affiliateUrl: string;        // 쿠팡파트너스 링크
};

export const BRANDS: FormulaBrand[] = [
  // ── 국내 대표 ─────────────────────────────────────────────────────────────────
  {
    id: "absoluteMungjak",
    name: "앱솔루트 명작 2FL",
    position: "국내 대표 / 대중형",
    defaultPricePer100g: 2750,
    canSize: 800,
    canPrice: 22000,
    color: "#0F6E56",
    tag: "베스트셀러",
    desc: "국내 가장 대중적인 대표 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDhQj",
  },
  {
    id: "imperialDreamXO",
    name: "임페리얼드림XO",
    position: "국내 대표 / 대중형",
    defaultPricePer100g: 2875,
    canSize: 800,
    canPrice: 23000,
    color: "#1565C0",
    tag: "스테디셀러",
    desc: "국내 인지도 높은 스테디셀러",
    affiliateUrl: "https://link.coupang.com/a/eaDiwz",
  },
  {
    id: "iamMother",
    name: "아이엠마더",
    position: "국내 대표 / 중상",
    defaultPricePer100g: 3694,
    canSize: 800,
    canPrice: 29550,
    color: "#E65100",
    tag: "중상",
    desc: "국내 상위권 인지도, 중상 가격대",
    affiliateUrl: "https://link.coupang.com/a/eaDkeJ",
  },
  {
    id: "pasturWithmom",
    name: "파스퇴르 위드맘 100일 제왕",
    position: "국내 대표 / 중상",
    defaultPricePer100g: 4200,
    canSize: 750,
    canPrice: 31500,
    color: "#6A1B9A",
    tag: "민감군",
    desc: "제왕절개·민감군에서 자주 비교됨",
    affiliateUrl: "https://link.coupang.com/a/eaDlPg",
  },
  // ── 국내 프리미엄 ─────────────────────────────────────────────────────────────
  {
    id: "absoluteOrganic",
    name: "앱솔루트 유기농 궁",
    position: "국내 프리미엄 / 유기농",
    defaultPricePer100g: 3988,
    canSize: 800,
    canPrice: 31900,
    color: "#2E7D32",
    tag: "유기농",
    desc: "유기농 포지션, 명작보다 한 단계 프리미엄",
    affiliateUrl: "https://link.coupang.com/a/eaDnHQ",
  },
  {
    id: "iamMotherOrganic",
    name: "아이엠마더 유기농 산양",
    position: "국내 프리미엄 / 산양",
    defaultPricePer100g: 4613,
    canSize: 800,
    canPrice: 36900,
    color: "#4CAF50",
    tag: "산양·유기농",
    desc: "산양+유기농 조합 프리미엄",
    affiliateUrl: "https://link.coupang.com/a/eaDs3s",
  },
  {
    id: "truMomPremium",
    name: "트루맘 뉴클래스 슈퍼프리미엄",
    position: "국내 프리미엄",
    defaultPricePer100g: 4975,
    canSize: 800,
    canPrice: 39800,
    color: "#FF9800",
    tag: "국내 프리미엄",
    desc: "후디스 계열 프리미엄 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDuh5",
  },
  // ── 해외 ─────────────────────────────────────────────────────────────────────
  {
    id: "aptamil",
    name: "압타밀 프로푸트라 듀오어드밴스",
    position: "해외 대표 / 프리미엄",
    defaultPricePer100g: 5938,
    canSize: 800,
    canPrice: 47500,
    color: "#0097A7",
    tag: "해외 인기",
    desc: "해외 브랜드 대표 주자, 직구/병행 수요 높음",
    affiliateUrl: "https://link.coupang.com/a/eaDo4a",
  },
  {
    id: "hipp",
    name: "힙 유기농 콤비오틱",
    position: "해외 대표 / 유기농 프리미엄",
    defaultPricePer100g: 6225,
    canSize: 800,
    canPrice: 49800,
    color: "#388E3C",
    tag: "해외 유기농",
    desc: "유기농 선호층 대표 수입 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDp5J",
  },
  {
    id: "illuma",
    name: "일루마 1단계",
    position: "초프리미엄 / 수입",
    defaultPricePer100g: 8260,
    canSize: 810,
    canPrice: 66910,
    color: "#9C27B0",
    tag: "초프리미엄",
    desc: "프리미엄 이미지 강한 고가 수입 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDrli",
  },
];

// 월령별 하루 평균 분유 사용량 (g, 완전 분유 수유 기준 추정)
export type MonthlyUsageRange = {
  label: string;
  monthStart: number;
  monthEnd: number;
  dailyGrams: number;
  note: string;
};

export const MONTHLY_USAGE_RANGES: MonthlyUsageRange[] = [
  { label: "0~1개월",   monthStart: 0,  monthEnd: 1,  dailyGrams: 80,  note: "신생아 소량 수유" },
  { label: "2~3개월",   monthStart: 2,  monthEnd: 3,  dailyGrams: 120, note: "수유량 급증" },
  { label: "4~6개월",   monthStart: 4,  monthEnd: 6,  dailyGrams: 140, note: "분유 최대 소비" },
  { label: "7~9개월",   monthStart: 7,  monthEnd: 9,  dailyGrams: 100, note: "이유식 병행 시작" },
  { label: "10~12개월", monthStart: 10, monthEnd: 12, dailyGrams: 70,  note: "이유식 비중 증가" },
];

// 제휴 추천 상품 (쿠팡파트너스)
export const AFFILIATE_PRODUCTS = [
  {
    tag: "베스트셀러",
    title: "앱솔루트 명작 2FL",
    desc: "100g당 2,750원 · 국내 대표 대중형",
    url: "https://link.coupang.com/a/eaDhQj",
  },
  {
    tag: "해외 인기",
    title: "압타밀 프로푸트라 듀오어드밴스",
    desc: "100g당 5,938원 · 직구/병행 수요 1위",
    url: "https://link.coupang.com/a/eaDo4a",
  },
  {
    tag: "초프리미엄",
    title: "일루마 1단계",
    desc: "100g당 8,260원 · 프리미엄 수입 분유",
    url: "https://link.coupang.com/a/eaDrli",
  },
  {
    tag: "해외 유기농",
    title: "힙 유기농 콤비오틱",
    desc: "100g당 6,225원 · 유기농 선호층 대표",
    url: "https://link.coupang.com/a/eaDp5J",
  },
];

export const PAGE_FAQ = [
  {
    question: "분유는 언제까지 먹여야 하나요?",
    answer: "보통 만 12개월(돌)까지는 분유를 권장하며, 돌 이후에는 생우유로 전환하는 경우가 많습니다. 이 계산기는 돌(12개월)까지를 기본으로 계산하며, 최대 18개월까지 설정할 수 있습니다.",
  },
  {
    question: "신생아 분유는 하루에 얼마나 먹나요?",
    answer: "신생아(0~1개월)는 한 번에 60~90ml씩 하루 8~10회 수유합니다. 1개월이 지나면 수유량이 늘어 3~4개월에 가장 많이 소비합니다. 이 계산기는 완전 분유 수유 기준 월령 평균값으로 추정합니다.",
  },
  {
    question: "1단계·2단계·3단계 분유 차이가 있나요?",
    answer: "단계별로 영양 성분 비율이 다르게 구성되어 있습니다. 일반적으로 1단계(0~6개월), 2단계(6~12개월), 3단계(12개월 이상)로 나뉩니다. 이 계산기는 단계 구분 없이 100g당 가격으로 비교합니다.",
  },
  {
    question: "브랜드 선택 기준이 있나요?",
    answer: "가성비를 원하면 앱솔루트 명작 2FL(2,750원/100g), 중상 선택은 아이엠마더(3,694원/100g), 유기농을 원하면 앱솔루트 유기농 궁이나 힙 유기농 콤비오틱, 해외 프리미엄을 원하면 압타밀이나 일루마가 자주 비교됩니다.",
  },
  {
    question: "분유값이 생각보다 많이 드는 이유가 뭔가요?",
    answer: "생후 3~6개월에 하루 최대 700~900ml를 먹는 시기에 분유 소비가 가장 많습니다. 브랜드를 최저가로 바꾸거나 대용량 팩을 구매하면 1년에 30~60만원 이상 차이가 날 수 있습니다.",
  },
  {
    question: "이 계산기 결과가 실제 비용과 다를 수 있나요?",
    answer: "네. 월령별 사용량과 브랜드 가격은 완전 분유 수유 기준 평균 추정값입니다. 모유·혼합 수유이거나 이유식 비중에 따라 실제 소비량이 크게 달라집니다. 100g당 가격을 직접 수정하면 더 정확하게 계산할 수 있습니다.",
  },
];

export const relatedLinks = [
  { href: "/tools/diaper-cost/",              label: "아기 기저귀 값 계산기" },
  { href: "/tools/birth-support-total/",      label: "출산~2세 총지원금 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "한 명만 육아휴직 총수령액 계산기" },
  { href: "/tools/parental-leave-pay/",       label: "육아휴직 급여 계산기" },
];
