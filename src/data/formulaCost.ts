export const PAGE_META = {
  title: "돌까지 분유값 계산기 | 브랜드별 1년 총비용 비교",
  subtitle: "신생아부터 돌까지 분유 총비용을 브랜드별로 계산해보세요. 압타밀, 앱솔루트 명작, 임페리얼XO까지 100g당 가격 비교와 월령별 사용량을 한 번에 정리합니다.",
  methodology: "월령별 평균 분유 사용량과 100g당 브랜드 가격을 바탕으로 추정한 참고값입니다.",
  caution: "분유 사용량은 아이마다 다르고, 가격은 구매 시점과 옵션에 따라 달라질 수 있습니다.",
  updatedAt: "2026년 3월 기준",
};

export type FormulaBrand = {
  id: string;
  name: string;
  position: string;
  defaultPricePer100g: number;
  canSize: number;
  canPrice: number;
  color: string;
  tag: string;
  desc: string;
  affiliateUrl: string;
};

export const BRANDS: FormulaBrand[] = [
  {
    id: "absoluteMungjak",
    name: "앱솔루트 명작 2FL",
    position: "국내 대표 / 대중형",
    defaultPricePer100g: 2750,
    canSize: 800,
    canPrice: 22000,
    color: "#0F6E56",
    tag: "베스트셀러",
    desc: "국내 시장에서 가장 대중적으로 비교되는 기본 라인",
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
    desc: "국내 인지도가 높은 스테디셀러 분유",
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
    tag: "중상급",
    desc: "국내 상위권 수요가 있는 중상급 라인",
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
    desc: "신생아 초기 민감군에서 자주 비교되는 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDlPg",
  },
  {
    id: "absoluteOrganic",
    name: "앱솔루트 유기농 궁",
    position: "국내 프리미엄 / 유기농",
    defaultPricePer100g: 3988,
    canSize: 800,
    canPrice: 31900,
    color: "#2E7D32",
    tag: "유기농",
    desc: "명작보다 한 단계 프리미엄인 국내 유기농 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDnHQ",
  },
  {
    id: "iamMotherOrganic",
    name: "아이엠마더 유기농 오가닉",
    position: "국내 프리미엄 / 오가닉",
    defaultPricePer100g: 4613,
    canSize: 800,
    canPrice: 36900,
    color: "#4CAF50",
    tag: "오가닉",
    desc: "오가닉 계열로 비교되는 국내 프리미엄 제품",
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
    desc: "뉴트리시아 계열과 자주 비교되는 프리미엄 라인",
    affiliateUrl: "https://link.coupang.com/a/eaDuh5",
  },
  {
    id: "aptamil",
    name: "압타밀 프로푸트라 어드밴스",
    position: "해외 대표 / 프리미엄",
    defaultPricePer100g: 5938,
    canSize: 800,
    canPrice: 47500,
    color: "#0097A7",
    tag: "해외 인기",
    desc: "직구와 병행 수요가 높은 해외 대표 브랜드",
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
    desc: "유기농 선호층에서 자주 찾는 수입 분유",
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
    desc: "가격대가 가장 높은 프리미엄 수입 분유",
    affiliateUrl: "https://link.coupang.com/a/eaDrli",
  },
];

export type MonthlyUsageRange = {
  label: string;
  monthStart: number;
  monthEnd: number;
  dailyGrams: number;
  note: string;
};

export const MONTHLY_USAGE_RANGES: MonthlyUsageRange[] = [
  { label: "0~1개월", monthStart: 0, monthEnd: 1, dailyGrams: 80, note: "신생아 소량 수유" },
  { label: "2~3개월", monthStart: 2, monthEnd: 3, dailyGrams: 120, note: "수유량이 빠르게 늘어나는 구간" },
  { label: "4~6개월", monthStart: 4, monthEnd: 6, dailyGrams: 140, note: "분유 소비가 가장 큰 구간" },
  { label: "7~9개월", monthStart: 7, monthEnd: 9, dailyGrams: 100, note: "이유식 병행 시작" },
  { label: "10~12개월", monthStart: 10, monthEnd: 12, dailyGrams: 70, note: "이유식 비중 확대" },
];

export const AFFILIATE_PRODUCTS = [
  {
    tag: "베스트셀러",
    title: "앱솔루트 명작 2FL",
    desc: "100g당 2,750원 수준의 국내 대표 대중형 분유",
    url: "https://link.coupang.com/a/eaDhQj",
  },
  {
    tag: "해외 인기",
    title: "압타밀 프로푸트라 어드밴스",
    desc: "100g당 5,938원 수준의 수입 분유 비교군",
    url: "https://link.coupang.com/a/eaDo4a",
  },
  {
    tag: "초프리미엄",
    title: "일루마 1단계",
    desc: "100g당 8,260원 수준의 프리미엄 수입 분유",
    url: "https://link.coupang.com/a/eaDrli",
  },
  {
    tag: "해외 유기농",
    title: "힙 유기농 콤비오틱",
    desc: "100g당 6,225원 수준의 유기농 수입 분유",
    url: "https://link.coupang.com/a/eaDp5J",
  },
];

export const EXTERNAL_REFERENCE_LINKS = [
  {
    title: "식품의약품안전처 수입식품 정보마루",
    desc: "수입 분유와 식품 관련 기본 정보를 확인할 때 참고",
    url: "https://impfood.mfds.go.kr/",
  },
  {
    title: "질병관리청 국가건강정보포털 영아 영양",
    desc: "영아 수유, 이유식, 성장 단계별 기본 가이드를 확인할 때 참고",
    url: "https://health.kdca.go.kr/healthinfo/",
  },
  {
    title: "대한소아청소년과학회",
    desc: "영유아 수유와 성장 관련 전문 학회 자료를 찾을 때 참고",
    url: "https://www.pediatrics.or.kr/",
  },
];

export const PAGE_FAQ = [
  {
    question: "분유는 언제까지 먹이나요?",
    answer: "보통 만 12개월 전후까지 분유를 사용하고, 이후에는 생우유로 전환하는 경우가 많습니다. 이 계산기는 돌까지를 기본 구간으로 두고, 최대 18개월까지도 비교할 수 있게 구성했습니다.",
  },
  {
    question: "신생아는 분유를 하루에 얼마나 먹나요?",
    answer: "신생아 초기에는 적은 양을 자주 먹고, 2~6개월 구간에서 사용량이 가장 커지는 경우가 많습니다. 이 계산기는 완전 분유 수유 기준의 평균 사용량을 월령별로 단순화해 적용합니다.",
  },
  {
    question: "1단계, 2단계, 3단계 분유 차이가 있나요?",
    answer: "단계별로 권장 월령과 영양 성분 비율이 다릅니다. 이 페이지는 세부 단계 차이보다는 100g당 가격과 월령별 총 사용량을 중심으로 브랜드 비용을 비교하는 용도입니다.",
  },
  {
    question: "브랜드는 어떻게 비교하면 좋나요?",
    answer: "가성비를 먼저 보면 앱솔루트 명작, 임페리얼XO 같은 국내 대표군이 유리하고, 유기농이나 수입 프리미엄을 선호하면 힙, 압타밀, 일루마 같은 브랜드를 같이 놓고 총액 차이를 보는 방식이 가장 현실적입니다.",
  },
  {
    question: "왜 돌 전후 비용 차이가 크게 나나요?",
    answer: "생후 3~6개월 전후가 분유 소비량이 가장 큰 구간이기 때문입니다. 브랜드를 바꾸거나 할인 시점에 대용량으로 구매하면 연간 비용 차이가 크게 벌어질 수 있습니다.",
  },
  {
    question: "계산 결과와 실제 비용이 왜 다를 수 있나요?",
    answer: "이 값은 월령별 평균 사용량과 현재 입력한 100g당 가격을 기준으로 계산한 추정치입니다. 혼합 수유 여부, 이유식 시작 시점, 할인 행사 여부에 따라 실제 지출은 달라질 수 있습니다.",
  },
];

export const NEXT_CALCULATOR = {
  href: "/tools/diaper-cost/",
  title: "다음 계산기 열기",
  headline: "기저귀 계산기로 이어보기",
  desc: "분유 다음으로 고정지출 체감이 큰 영역은 기저귀입니다. 같은 기간 기준으로 브랜드별 기저귀 총비용도 바로 이어서 비교해보세요.",
  cta: "기저귀값 계산기 열기",
};

export const relatedLinks = [
  { href: "/tools/diaper-cost/", label: "아기 기저귀값 계산기" },
  { href: "/tools/birth-support-total/", label: "출산~2세 총지원금 계산기" },
  { href: "/tools/single-parental-leave-total/", label: "엄마만 육아휴직 총수령액 계산기" },
  { href: "/tools/parental-leave-pay/", label: "육아휴직 급여 계산기" },
];
