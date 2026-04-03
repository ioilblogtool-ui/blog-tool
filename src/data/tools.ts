export type PreviewStat = {
  label: string;    // '월 실수령', '총보상' 등
  value: string;    // '341만', '1.2억' 등
  context?: string; // '5,000만 기준' 등 맥락
};

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  eyebrow?: string;
  category?: string;
  iframeReady?: boolean;
  badges?: string[];
  previewStats?: PreviewStat[];
};

export const tools: ToolMeta[] = [
  {
    slug: "salary-tier",
    title: "연봉 티어 계산기",
    description: "내 연봉을 입력하면 S·A·B·C 티어와 전체 상위 %를 즉시 확인. 70개+ 기업 영끌 연봉 비교.",
    order: 0,
    eyebrow: "연봉 티어",
    category: "compare",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "비교 기업", value: "70개+" },
      { label: "티어 분류", value: "S·A·B·C" }
    ]
  },
  {
    slug: "bonus-simulator",
    title: "대기업 성과급 시뮬레이터",
    description: "삼성전자, SK하이닉스, 현대자동차의 직급별 성과급과 2026~2028 총보상 시나리오를 비교하는 페이지",
    order: 1,
    eyebrow: "Bonus Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "삼성 총보상", value: "1.1억" },
      { label: "하이닉스", value: "1.8억" }
    ]
  },
  {
    slug: "household-income",
    title: "가구 소득 계산기",
    description: "가구 연 총소득, 월 체감, 실수령 추정, 평균·기준 중위소득 대비 위치를 계산하는 페이지",
    order: 2,
    eyebrow: "Household Income Tool",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "중위소득 대비", value: "138%", context: "4인·8천만" },
      { label: "월 실수령", value: "약 560만" }
    ]
  },
  {
    slug: "diaper-cost",
    title: "아기 기저귀 값 계산기",
    description: "신생아부터 돌까지 월령별 사용량을 자동 계산하고, 하기스·팸퍼스·보솜이 등 브랜드별 총비용을 비교하는 페이지",
    order: 3,
    eyebrow: "육아 소모품",
    category: "parenting",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "돌까지 총 사용량", value: "약 2,700개" },
      { label: "브랜드 절약액", value: "최대 50만원" },
    ],
  },
  {
    slug: "salary",
    title: "연봉 인상 계산기",
    description: "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지",
    order: 4,
    eyebrow: "Salary Tool",
    category: "calculator",
    iframeReady: true,
    badges: ["추천"],
    previewStats: [
      { label: "월 실수령", value: "341만", context: "5천만 기준" },
      { label: "+5% 후", value: "358만" }
    ]
  },
  {
    slug: "retirement",
    title: "퇴직금 계산기",
    description: "평균임금 기준 퇴직금과 세후 추정액을 계산하는 페이지",
    order: 5,
    eyebrow: "Retirement Tool",
    category: "calculator",
    iframeReady: true,
    previewStats: [
      { label: "퇴직금 세전", value: "4,166만", context: "5천만·10년" },
      { label: "세후 추정", value: "약 3,950만" }
    ]
  },
  {
    slug: "negotiation",
    title: "이직 계산기",
    description: "현재 연봉과 목표 연봉의 세전 실수령 차이를 비교하는 페이지",
    order: 6,
    eyebrow: "Negotiation Tool",
    category: "calculator",
    iframeReady: true,
    badges: ["추천"],
    previewStats: [
      { label: "월 실수령 차이", value: "+52만", context: "5→6천만 이직" },
      { label: "인상률", value: "20%" }
    ]
  },
  {
    slug: "parental-leave",
    title: "육아휴직 계산기",
    description: "육아휴직 급여와 복직 후 수입을 비교해 버퍼를 계산하는 페이지",
    order: 7,
    eyebrow: "Parental Leave Tool",
    category: "calculator",
    iframeReady: true,
    previewStats: [
      { label: "가구 수령액", value: "월 200만+" },
      { label: "버퍼 기간", value: "12개월" }
    ]
  },
  {
    slug: "samsung-bonus",
    title: "삼성전자 성과급 계산기",
    description: "개인·부부 모드로 삼성전자 OPI, TAI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",
    order: 8,
    eyebrow: "Samsung Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "OPI+TAI", value: "3,600만", context: "사원 기준" },
      { label: "월 체감", value: "+300만" }
    ]
  },
  {
    slug: "sk-hynix-bonus",
    title: "SK하이닉스 성과급 계산기",
    description: "개인·부부 모드로 SK하이닉스의 PS, PI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",
    order: 9,
    eyebrow: "SK Hynix Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "PS+PI", value: "6,000만", context: "사원 기준" },
      { label: "월 체감", value: "+500만" }
    ]
  },
  {
    slug: "hyundai-bonus",
    title: "현대자동차 성과금 계산기",
    description: "개인·부부 모드로 현대자동차 성과금 패키지와 자사주 포함 총보상, 월 체감액을 계산하는 페이지",
    order: 10,
    eyebrow: "Hyundai Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "성과금 총액", value: "2,800만", context: "책임 기준" },
      { label: "월 체감", value: "+233만" }
    ]
  },
  {
    slug: "birth-support-total",
    title: "출산~2세 총지원금 계산기",
    description: "첫만남이용권, 부모급여, 아동수당을 합쳐 아이 두 돌 전까지 받을 수 있는 총액을 계산하는 페이지",
    order: 11,
    eyebrow: "Birth Support Tool",
    category: "support",
    iframeReady: true,
    badges: ["추천"],
    previewStats: [
      { label: "2세까지 총액", value: "약 2,100만" },
      { label: "월 평균", value: "87만" }
    ]
  },
  {
    slug: "single-parental-leave-total",
    title: "한 명만 육아휴직 총수령액 계산기",
    description: "육아휴직 급여, 부모급여, 아동수당, 첫만남이용권을 합쳐 아이 두 돌까지 가구 총수령액을 계산하는 페이지",
    order: 12,
    eyebrow: "Household Cashflow Tool",
    category: "support",
    iframeReady: true,
    badges: ["대표", "추천"],
    previewStats: [
      { label: "가구 총수령", value: "약 3,800만" },
      { label: "월 평균", value: "158만" }
    ]
  },
  {
    slug: "parental-leave-pay",
    title: "육아휴직 급여 계산기",
    description: "월 통상임금 기준으로 일반 육아휴직 사용 시 월별 급여와 총액을 계산하는 페이지",
    order: 13,
    eyebrow: "Parental Leave Pay Tool",
    category: "support",
    iframeReady: true,
    previewStats: [
      { label: "첫 3개월", value: "월 250만", context: "상한 기준" },
      { label: "4개월~", value: "월 150만" }
    ]
  },
  {
    slug: "home-purchase-fund",
    title: "내집마련 자금 계산기",
    description: "매매가·지역 유형·주택 보유 수를 입력하면 LTV 기반 최대 대출 가능액, 취득세·중개보수 포함 총 필요 현금, 월 상환액을 계산하는 페이지",
    order: 14,
    eyebrow: "부동산 계산기",
    category: "realestate",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "LTV 기준 대출", value: "최대 7억", context: "10억·무주택 기준" },
      { label: "총 필요 현금", value: "약 3.6억" },
    ],
  },
  {
    slug: "formula-cost",
    title: "아기 분유 값 계산기",
    description: "신생아부터 돌까지 월령별 사용량을 자동 계산하고, 매일 앱솔루트·남양 임페리얼·일동후디스 등 브랜드별 총비용을 비교하는 페이지",
    order: 15,
    eyebrow: "육아 소모품",
    category: "parenting",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "돌까지 총 사용량", value: "약 40,000g" },
      { label: "브랜드 절약액", value: "최대 60만원" },
    ],
  },
  {
    slug: "six-plus-six",
    title: "6+6 부모육아휴직제 계산기",
    description: "부모 모두 육아휴직을 쓸 때 특례 적용 여부와 일반 육아휴직 대비 차액을 비교하는 페이지",
    order: 16,
    eyebrow: "6+6 Tool",
    category: "support",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "특례 총액", value: "약 900만", context: "부부 합산" },
      { label: "일반 대비", value: "+300만" }
    ]
  },
  {
    slug: "wedding-budget-calculator",
    title: "결혼 준비 예산 계산기",
    description: "지역·티어·하객 수·식대·분담 비율을 기준으로 웨딩홀, 스드메, 예물, 신혼여행까지 한 번에 계산하는 예산 도구",
    order: 17,
    eyebrow: "Wedding Budget Tool",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "기본 카테고리", value: "6개" },
      { label: "분담 방식", value: "3가지" }
    ]
  },
  {
    slug: "dca-investment-calculator",
    title: "적립식 투자 수익 비교 계산기",
    description: "S&P500·TQQQ·SOXL·삼성전자·에코프로 등 70종목에 매달 같은 금액을 넣었을 때 수익을 비교하는 DCA 시뮬레이터",
    order: 18,
    eyebrow: "DCA 투자 시뮬레이터",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "비교 자산", value: "70종+" },
      { label: "최대 기간", value: "20년" },
    ],
  },
];

