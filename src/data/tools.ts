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
    eyebrow: "육아 양육",
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
    title: "현대자동차 성과급 계산기",
    description: "개인·부부 모드로 현대자동차 성과급 패키지와 자사주 포함 총보상, 월 체감액을 계산하는 페이지",
    order: 10,
    eyebrow: "Hyundai Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "성과급 총액", value: "2,800만", context: "책임 기준" },
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
    eyebrow: "육아 양육",
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
  {
    slug: "fire-calculator",
    title: "파이어족 계산기",
    description: "현재 자산, 월 투자 가능 금액, 생활비, 기대수익률을 넣으면 FIRE 목표 자산과 예상 달성 시점, 부족 금액을 계산하는 도구",
    order: 19,
    eyebrow: "FIRE Calculator",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "핵심 결과", value: "목표 자산" },
      { label: "시나리오", value: "3종 비교" },
    ],
  },
  {
    slug: "baby-growth-percentile-calculator",
    title: "아기 성장 백분위 계산기",
    description: "몸무게, 키, 머리둘레를 기준으로 성장 백분위를 참고용으로 계산하고 월령별 수유량, 발달 체크, 예방접종 흐름을 함께 보는 도구",
    order: 20,
    eyebrow: "육아 성장 계산기",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "성장 지표", value: "3가지" },
      { label: "월령 가이드", value: "수유·발달·접종" },
    ],
  },
  {
    slug: "parental-leave-short-work-calculator",
    title: "육아휴직 + 육아기 단축근무 계산기",
    description: "육아휴직 18개월 여부, 남은 휴직·단축근무 기간, 2026년 기준 단축근무 예상 월급을 한 번에 계산하는 정책형 도구",
    order: 21,
    eyebrow: "육아 정책 계산기",
    category: "support",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "핵심 결과", value: "남은 기간" },
      { label: "급여 기준", value: "250만/160만" },
    ],
  },
  {
    slug: "wedding-gift-break-even-calculator",
    title: "결혼 축의금 손익분기점 계산기",
    description: "예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산합니다.",
    order: 22,
    eyebrow: "결혼 예산 계산",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "식대 × 보증인원", value: "핵심 구조" },
      { label: "손익분기점", value: "자동 계산" },
    ],
  },
  {
    slug: "pregnancy-birth-cost",
    title: "임신 출산 비용 계산기",
    description: "산전검사비, 분만비, 입원비, 산후조리 비용을 나눠 계산하고 지원금 차감 후 예상 본인부담액까지 보여주는 계산기",
    order: 23,
    eyebrow: "임신 출산 계산기",
    category: "support",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "핵심 구조", value: "의료비 vs 조리비" },
      { label: "지원금 반영", value: "자동 차감" },
    ],
  },
  {
    slug: "national-pension-calculator",
    title: "국민연금 예상수령액 계산기",
    description: "현재 나이, 가입 시작 연도, 월소득 또는 보험료를 입력하면 조기·정상·연기 수령 기준 예상 월연금과 손익분기점을 비교하는 계산기",
    order: 24,
    eyebrow: "연금 계산기",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "정상 수령 나이", value: "65세" },
      { label: "연기 가산", value: "+0.6%/월" },
    ],
  },
  {
    slug: "jeonwolse-conversion",
    title: "전월세 전환율 계산기",
    description: "전세 보증금과 월세 조건을 같은 기준으로 환산해 실제 전환율, 법정 상한 초과 여부, 전세 vs 월세 총비용 차이를 비교합니다.",
    order: 24.5,
    eyebrow: "부동산 비교 계산",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "법정 상한", value: "연 4.50%", context: "2026-04 기준금리 2.50%" },
      { label: "핵심 비교", value: "총비용 + 유불리", context: "전세 vs 월세" },
    ],
  },
  {
    slug: "irp-pension-calculator",
    title: "IRP 연금 계산기",
    description: "IRP·DC 적립금과 월 추가 납입액을 기준으로 은퇴 시점 예상 적립금과 연금 수령·일시금 차이를 비교하는 계산기",
    order: 24.6,
    eyebrow: "투자 도구",
    category: "investment",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "월 납입 시나리오", value: "10만~50만" },
      { label: "수익률 비교", value: "3%·5%·7%" }
    ]
  },
  {
    slug: "coin-tax-calculator",
    title: "코인 세금 계산기",
    description: "비트코인·이더리움 등 가상자산 매도 시 양도차익, 250만원 공제, 예상 세금, 세후 순이익을 바로 계산하는 페이지",
    order: 25,
    eyebrow: "가상자산 세금",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "기본공제", value: "250만원", context: "국세청 안내 기준" },
      { label: "기본 계산세율", value: "22%", context: "지방세 포함" },
    ],
  },
  {
    slug: "ai-stack-cost-calculator",
    title: "AI 스택 비용 계산기",
    description: "ChatGPT, Claude, Cursor, Perplexity 등 AI 도구 조합을 선택하면 월 구독료, 연간 비용, 중복 지출과 추천 스택을 한 번에 비교하는 계산기",
    order: 26,
    eyebrow: "AI Productivity Tool",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "비교 도구", value: "8종" },
      { label: "핵심 결과", value: "월·연간 비용" },
    ],
  },
  {
    slug: "ai-automation-hourly-roi",
    title: "AI 업무 자동화 시급 계산기",
    description: "월급, 반복 업무 시간, 절감 시간, AI 도구 비용을 기준으로 도입 후 체감 시급 상승과 투자 회수 기간을 계산하는 도구",
    order: 26.1,
    eyebrow: "AI Productivity Tool",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "핵심 입력", value: "월급·절감시간" },
      { label: "결과 지표", value: "시급·회수기간" },
    ],
  },
  {
    slug: "child-tutoring-cost-calculator",
    title: "아이 사교육비 계산기",
    description: "자녀 수, 학교급, 과목, 지역을 입력하면 월·연간·누적 교육비와 또래 평균 대비 수준을 한 번에 계산. 기회비용 시뮬레이션 포함.",
    order: 26,
    eyebrow: "사교육비 계산기",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "비교 기준", value: "4개 지역" },
      { label: "자녀 수", value: "최대 4명" },
    ],
  },
  {
    slug: "fetal-insurance-calculator",
    title: "태아보험 보험료 계산기",
    description: "임신 주수와 산모 나이, 보장 유형, 특약 선택 기준으로 예상 월 보험료 범위와 총 납입액을 계산합니다.",
    order: 27,
    eyebrow: "임신·출산 보험",
    category: "support",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "입력 기준", value: "주수·특약" },
      { label: "결과 구조", value: "월 보험료 범위" },
    ],
  },
  {
    slug: "apt-cheonyak-gajum-calculator",
    title: "아파트 청약 가점 계산기",
    description: "무주택기간, 부양가족 수, 청약통장 가입기간을 입력하면 총 84점 기준 청약 가점과 서울·수도권·지방 참고 당첨선을 바로 확인합니다.",
    order: 24.7,
    eyebrow: "청약 가점 계산",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "만점", value: "84점", context: "무주택 32 + 부양가족 35 + 통장 17" },
      { label: "비교", value: "지역 참고선", context: "서울·수도권·지방" },
    ],
  },
  {
    slug: "overseas-travel-cost",
    title: "해외여행 총비용 계산기",
    description: "항공권, 숙박, 식비, 교통비, 관광비, 쇼핑, 비상금까지 합쳐 일본·동남아·유럽·미주 여행 예산을 계산하는 도구",
    order: 27,
    eyebrow: "여행 예산 계산기",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "지원 권역", value: "일본·동남아·유럽" },
      { label: "핵심 결과", value: "총 여행 예산" },
    ],
  },
];



