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
    slug: "kbo-salary-calculator",
    title: "KBO 선수 연봉 계산기",
    description: "KBO 선수 연봉 입력 → 세후 월 실수령·리그 내 상위 몇%·포지션 평균 대비·류현진 등 대표 선수 비교.",
    order: 0,
    eyebrow: "KBO 연봉",
    category: "스포츠",
    badges: ["신규", "추천"],
    previewStats: [
      { label: "리그 평균", value: "1.4억" },
      { label: "류현진", value: "25억 (1위)" },
    ],
  },
  {
    slug: "capital-gains-tax-calculator",
    title: "양도소득세 계산기",
    description: "1주택 비과세·장기보유특별공제·단기양도세율·다주택 중과까지 자동 반영. 아파트·토지·상가 양도세를 미리 계산하세요.",
    order: 0,
    eyebrow: "양도소득세",
    category: "부동산·세금",
    badges: ["신규", "추천"],
    previewStats: [
      { label: "1주택 비과세", value: "12억 이하" },
      { label: "장특공제 최대", value: "80%" },
    ],
  },
  {
    slug: "gift-tax-calculator",
    title: "증여세 계산기",
    description: "배우자·자녀·부모 등 관계별 공제 한도, 누진세율, 신고세액공제까지 한 번에 계산. 10년 분할 증여 전략 포함.",
    order: 0,
    eyebrow: "증여세",
    category: "부동산·세금",
    badges: ["추천"],
    previewStats: [
      { label: "성인 자녀 공제", value: "5,000만원" },
      { label: "배우자 공제", value: "6억원" },
    ],
  },
  {
    slug: "aircon-electricity-cost",
    title: "에어컨 전기요금 계산기",
    description: "에어컨 소비전력·사용 시간으로 월 전기요금 추가분과 누진 구간을 계산합니다. 인버터 보정, 여름 완화 구간 자동 적용.",
    order: 0,
    eyebrow: "에어컨 전기요금",
    category: "생활·유틸리티",
    badges: ["신규", "여름"],
    previewStats: [
      { label: "벽걸이 중형·8h", value: "월 +3~6만원" },
      { label: "누진 구간 반영", value: "정확한 추가 요금" },
    ],
  },
  {
    slug: "dividend-target-calculator",
    title: "배당금 목표 투자금 계산기",
    description: "월 배당금 목표 입력 → CONY·YMAX·SCHD 등 ETF별 필요 투자금 자동 계산. 세전·세후 구분, 위험도 비교.",
    order: 0,
    eyebrow: "배당 목표 역산",
    category: "투자·재테크",
    badges: ["신규", "추천"],
    previewStats: [
      { label: "월 100만원", value: "CONY 기준 1,500만" },
      { label: "SCHD 기준", value: "약 3.4억" },
    ],
  },
  {
    slug: "us-dividend-tax-calculator",
    title: "미국주식 배당소득세 계산기",
    description: "미국주식 배당금 세후 실수령 계산. 원천징수 15% + 금융소득종합과세 기준 반영.",
    order: 0,
    eyebrow: "미국 배당세",
    category: "투자·재테크",
    badges: ["신규"],
    previewStats: [
      { label: "원천징수", value: "15%" },
      { label: "종합과세 기준", value: "연 2,000만원" },
    ],
  },
  {
    slug: "etf-distribution-tax-calculator",
    title: "ETF 분배금 세후 계산기",
    description: "국내 ETF(15.4%) vs 미국 ETF(15%) vs ISA 계좌(비과세) 분배금 세후 실수령 비교.",
    order: 0,
    eyebrow: "ETF 분배금 세후",
    category: "투자·재테크",
    badges: ["신규"],
    previewStats: [
      { label: "국내 ETF", value: "15.4%" },
      { label: "ISA 초과분", value: "9.9%" },
    ],
  },
  {
    slug: "isa-tax-calculator",
    title: "ISA 계좌 절세 시뮬레이터",
    description: "일반형·서민형·농어민형 선택 후 납입액·수익률·기간 입력 → 비과세 혜택·절세액·만기 수령액을 일반 계좌와 자동 비교.",
    order: 0,
    eyebrow: "ISA 절세",
    category: "투자·재테크",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "일반형 비과세", value: "200만원" },
      { label: "서민형 비과세", value: "400만원" },
    ],
  },
  {
    slug: "stock-brokerage-fee-calculator",
    title: "증권사 수수료 계산기",
    description: "1회 거래금액·월 거래 횟수 입력 → 키움·토스·삼성 등 주요 증권사 연간 수수료 자동 비교. 국내·미국주식 선택 가능.",
    order: 0,
    eyebrow: "증권사 수수료",
    category: "compare",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "비교 증권사", value: "7곳" },
      { label: "국내·미국주식", value: "선택 가능" },
    ],
  },
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
    slug: "teacher-salary-calculator",
    title: "교사 호봉 실수령액 계산기",
    description: "호봉, 담임·보직 여부를 입력하면 2026년 교원 봉급표 기준 월급과 세후 실수령액, 연봉을 계산하는 페이지",
    order: 1.6,
    eyebrow: "교사 연봉",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "교사", "호봉"],
    previewStats: [
      { label: "9호봉 실수령", value: "약 270만" },
      { label: "기준", value: "2026 봉급표" }
    ]
  },
  {
    slug: "public-servant-salary-calculator",
    title: "공무원 호봉 실수령액 계산기",
    description: "9급·8급·7급 직급과 호봉, 가족수당을 입력하면 2026년 공무원보수규정 기준 월급과 세후 실수령액, 연봉을 계산하는 페이지",
    order: 1.65,
    eyebrow: "공무원 연봉",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "공무원", "호봉"],
    previewStats: [
      { label: "9급 1호봉 실수령", value: "약 206만" },
      { label: "기준", value: "2026 봉급표" }
    ]
  },
  {
    slug: "police-firefighter-salary-calculator",
    title: "경찰·소방 호봉 실수령액 계산기",
    description: "경찰·소방 계급과 호봉, 가족수당, 교대근무 여부를 입력하면 2026년 공무원보수규정 기준 월급과 세후 실수령액, 연봉을 계산하는 페이지",
    order: 1.66,
    eyebrow: "경찰·소방 연봉",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "경찰", "소방", "호봉"],
    previewStats: [
      { label: "순경 1호봉 실수령", value: "약 240만" },
      { label: "기준", value: "2026 봉급표" }
    ]
  },
  {
    slug: "nurse-salary-calculator",
    title: "간호사 연차별 연봉·실수령 계산기",
    description: "병원 유형(빅5·대학병원·종합병원·중소병원·보건소·요양병원)과 연차, 나이트 근무 횟수를 입력하면 2026년 기준 연봉과 월 실수령액 범위를 추정하는 페이지",
    order: 1.67,
    eyebrow: "간호사 연봉",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "간호사", "연봉"],
    previewStats: [
      { label: "종합병원 신입 연봉", value: "약 3,800~5,200만" },
      { label: "기준", value: "2026 추정" }
    ]
  },
  {
    slug: "bonus-after-tax-calculator",
    title: "성과급 세후 실수령액 계산기",
    description: "성과급 총액과 연봉을 입력해 소득세, 지방소득세, 4대보험을 뺀 통장 입금액을 간이 추정하는 계산기",
    order: 1.5,
    eyebrow: "Bonus Tax Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "성과급", "세후"],
    previewStats: [
      { label: "대표 입력", value: "3,000만원", context: "성과급" },
      { label: "출력", value: "세후 실수령" }
    ]
  },
  {
    slug: "semiconductor-bonus-comparison",
    title: "반도체 성과급 비교 계산기",
    description: "삼성전자, SK하이닉스, DB하이텍 등 반도체 기업 성과급을 연봉·월급·성과급률 기준으로 세전·세후 비교하는 시뮬레이션 계산기",
    order: 1.7,
    eyebrow: "반도체 성과급 비교",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "성과급", "시뮬레이션"],
    previewStats: [
      { label: "비교 회사", value: "8개" },
      { label: "핵심 결과", value: "세후 추정" }
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
    slug: "couple-salary-rank-calculator",
    title: "맞벌이 부부 가구소득 계산기",
    description: "본인과 배우자가 다니는 대기업을 고르면 합산 연봉, 가구소득 전국 순위, 생활비 차감 후 잉여자금을 계산하는 페이지",
    order: 2.5,
    eyebrow: "맞벌이 가구소득",
    category: "compare",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "예시 합산 연봉", value: "2억 8,500만" },
      { label: "가구소득 위치", value: "전국 상위 1%대" }
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
    slug: "four-insurance-calculator",
    title: "4대보험 계산기 2026",
    description: "월급과 비과세 금액을 입력해 국민연금, 건강보험, 장기요양보험, 고용보험 공제액과 간이 세금, 예상 실수령액을 계산합니다.",
    order: 4.1,
    eyebrow: "4대보험",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "2026", "급여명세서"],
    previewStats: [
      { label: "국민연금", value: "4.75%", context: "근로자" },
      { label: "건강보험", value: "3.595%", context: "근로자" }
    ]
  },
  {
    slug: "minimum-wage-2026",
    title: "2026 최저임금 계산기",
    description: "2026년 최저임금 기준으로 시급·주급·월급·연봉을 환산하고 주휴수당, 4대보험 공제 후 세후 실수령, 최저임금 미달 여부를 확인하는 계산기",
    order: 4.2,
    eyebrow: "최저임금",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "2026", "주휴수당"],
    previewStats: [
      { label: "2026 시급", value: "10,320원" },
      { label: "월 환산", value: "215.7만", context: "209시간" }
    ]
  },
  {
    slug: "health-insurance-premium-calculator",
    title: "건강보험료 계산기 2026",
    description: "2026년 건강보험료율과 장기요양보험료율을 기준으로 직장가입자·지역가입자 월 보험료와 퇴직 전환 부담을 계산합니다.",
    order: 4.4,
    eyebrow: "건강보험료 계산",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "2026", "4대보험"],
    previewStats: [
      { label: "건강보험료율", value: "7.19%", context: "2026년 공식" },
      { label: "장기요양", value: "13.14%", context: "건보료 대비" }
    ]
  },
  {
    slug: "unemployment-benefit-calculator",
    title: "실업급여 계산기 2026",
    description: "평균임금, 고용보험 가입기간, 나이, 퇴사 사유를 입력해 2026년 기준 예상 구직급여액과 수급기간을 계산합니다.",
    order: 4.6,
    eyebrow: "구직급여",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "2026", "퇴사"],
    previewStats: [
      { label: "1일 상한", value: "68,100원" },
      { label: "수급기간", value: "120~270일" }
    ]
  },
  {
    slug: "retirement-dc-db-calculator",
    title: "퇴직연금 DB형 DC형 전환 계산기",
    description: "연봉·근속연수·ETF 수익률 입력 → DB형 vs DC형 퇴직금 자동 비교. 임금 피크제·이직 계획별 시뮬레이션. DC형 전환 시 얼마나 유리한지 즉시 확인.",
    order: 4.8,
    eyebrow: "퇴직연금 전환 계산기",
    category: "투자·재테크",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "DC 수익률", value: "5개 시나리오" },
      { label: "ETF", value: "S&P500·나스닥" },
    ],
  },
  {
    slug: "peak-wage-retirement-calculator",
    title: "임금피크제 퇴직금 계산기",
    description: "임금피크제 전후 연봉, 근속연수, DC 운용수익률을 입력해 퇴직연금 DB형 유지와 DC형 전환 예상 금액을 비교하는 간이 계산기입니다.",
    order: 4.85,
    eyebrow: "임금피크제 퇴직금",
    category: "투자·재테크",
    iframeReady: false,
    badges: ["신규", "임금피크제", "DB·DC"],
    previewStats: [
      { label: "비교", value: "DB 유지 vs DC 전환" },
      { label: "판단", value: "손익분기 수익률" },
    ],
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
    title: "삼성전자 성과급 협의안 계산기",
    description: "2026년 잠정합의안 기준 삼성전자 DS 특별경영성과급, 자사주 지급, 개인·부부 총보상을 계산하는 페이지",
    order: 8,
    eyebrow: "Samsung Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "잠정합의안", value: "12%", context: "OPI 포함" },
      { label: "DS 특별", value: "10.5%" }
    ]
  },
  {
    slug: "sk-hynix-bonus",
    title: "하이닉스 성과급 계산기 2026",
    description: "SK하이닉스 PS·PI 성과급을 직급·연봉 기준으로 계산하고 세후 실수령, 부부 합산 총보상, 월 체감액을 확인하는 페이지",
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
    slug: "lg-bonus",
    title: "LG전자 성과급 계산기",
    description: "H&A·HE·VS·BS 사업부별 PI 지급률과 기본급을 입력해 세전·세후 성과급을 계산하고 삼성전자·SK하이닉스와 비교하는 페이지",
    order: 9.5,
    eyebrow: "LG Electronics Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "H&A 기준", value: "800만", context: "대리 기준" },
      { label: "사업부별", value: "H&A·HE·VS·BS" }
    ]
  },
  {
    slug: "hyundai-bonus",
    title: "현대차 성과급 계산기 2026",
    description: "현대자동차 임단협 성과급 패키지를 직급·연봉·월 기본급 기준으로 계산하고 자사주 포함 세후 실수령과 부부 합산을 확인하는 페이지",
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
    slug: "it-platform-bonus-comparison",
    title: "IT 플랫폼 성과급 비교 2026",
    description: "카카오, 네이버, 쿠팡, 크래프톤, 라인플러스, 토스 6개사 성과급 구조와 RSU·스톡옵션 포함 총보상을 비교합니다. 내 연봉 기준 예상 현금 PI를 즉시 계산해보세요.",
    order: 10.4,
    eyebrow: "IT 플랫폼 성과급",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교 대상", value: "6개사" },
      { label: "보상 유형", value: "현금·RSU·스옵" },
    ],
  },
  {
    slug: "finance-bonus-comparison",
    title: "금융권 성과급 비교 2026",
    description: "KB국민은행·신한은행·하나은행·우리은행·미래에셋증권 등 금융권 성과급 구조를 업권별로 비교합니다. 내 연봉 기준 예상 성과급을 즉시 계산하세요.",
    order: 10.5,
    eyebrow: "금융권 성과급",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교 대상", value: "8개사" },
      { label: "업권", value: "은행·증권·보험" },
    ],
  },
  {
    slug: "shipbuilding-bonus-comparison",
    title: "조선업 성과급 비교 계산기",
    description: "HD현대중공업, 한화오션, 삼성중공업 성과급을 월급 n개월, 고정 격려금, 성과급률 기준으로 비교하는 계산기",
    order: 10.6,
    eyebrow: "Shipbuilding Bonus Tool",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정", "성과급"],
    previewStats: [
      { label: "비교 대상", value: "조선 3사" },
      { label: "입력 방식", value: "혼합" }
    ]
  },
  {
    slug: "auto-bonus-comparison",
    title: "자동차 성과급 비교 계산기 2026",
    description: "현대차, 기아, 현대모비스, 한국GM, 르노코리아 성과급을 같은 연봉·월급 기준으로 비교하는 계산기. 자사주 참고 포함.",
    order: 10.7,
    eyebrow: "자동차 성과급 비교",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정", "성과급"],
    previewStats: [
      { label: "비교 대상", value: "자동차 5사" },
      { label: "자사주", value: "참고 포함" }
    ]
  },
  {
    slug: "oil-refinery-bonus-comparison",
    title: "정유 성과급 비교 계산기 2026",
    description: "SK이노베이션, GS칼텍스, S-OIL(에쓰오일), HD현대오일뱅크, 롯데케미칼 성과급을 같은 연봉 기준으로 비교하는 계산기.",
    order: 10.8,
    eyebrow: "정유 성과급 비교",
    category: "simulator",
    iframeReady: true,
    badges: ["신규", "추정", "성과급"],
    previewStats: [
      { label: "비교 대상", value: "정유 5사" },
      { label: "입력 방식", value: "연봉%·월급·고정" }
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
    slug: "birth-support-money",
    title: "출산지원금 총수령액 계산기",
    description: "출생일, 거주 지역, 출생순위를 입력하면 첫만남이용권, 부모급여, 아동수당과 일부 지자체 출산지원금을 합산해 예상 총수령액을 계산합니다.",
    order: 11.5,
    eyebrow: "출산지원금 계산",
    category: "support",
    iframeReady: true,
    badges: ["출산지원금", "육아", "지자체"],
    previewStats: [
      { label: "국가 공통", value: "3종" },
      { label: "기간 선택", value: "12·24·95개월" }
    ]
  },
  {
    slug: "welfare-benefit-eligibility",
    title: "복지급여 수급 자격 계산기",
    description: "가구원 수, 소득, 재산, 자동차 정보를 입력하면 2026년 기준 중위소득 대비 소득인정액과 생계·의료·주거·교육급여 수급 가능성을 간이 계산합니다.",
    order: 11.7,
    eyebrow: "복지급여 계산",
    category: "support",
    iframeReady: true,
    badges: ["복지", "2026", "자가 점검"],
    previewStats: [
      { label: "급여 기준", value: "4종", context: "생계·의료·주거·교육" },
      { label: "핵심 결과", value: "소득인정액" }
    ]
  },
  {
    slug: "high-oil-support-payment-calculator",
    title: "고유가 피해지원금 계산기",
    description: "2026년 고유가 피해지원금 대상 유형과 거주 지역을 입력하면 1인당 지원액, 총 예상 수령액, 2차 신청 마감 체크리스트를 확인합니다.",
    order: 11.75,
    eyebrow: "고유가 피해지원금",
    category: "support",
    iframeReady: true,
    badges: ["신규", "2026", "지원금"],
    previewStats: [
      { label: "기초생활수급자", value: "55만 원" },
      { label: "2차 신청 마감", value: "7월 3일" }
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
    slug: "income-home-affordability",
    title: "소득 대비 집값 부담 계산기",
    description: "연봉과 보유 현금을 입력하면 DSR·LTV 기준 최대 대출 가능액과 적정 매매가, 연봉 대비 집값 배수(PIR), 월 상환 부담률을 계산하는 페이지",
    order: 14.45,
    eyebrow: "부동산 계산기",
    category: "realestate",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "적정 매매가", value: "연봉의 약 12배", context: "연봉 6천·현금 1.5억 기준" },
      { label: "월 상환 부담률", value: "월급의 약 38%" },
    ],
  },
  {
    slug: "mortgage-prepayment-penalty",
    title: "중도상환 수수료 계산기",
    description: "대출 잔여 원금, 수수료율, 잔여 기간을 입력하면 중도상환 수수료와 이자 절감액을 비교해 갚는 게 유리한지 바로 확인합니다.",
    order: 14.5,
    eyebrow: "대출 계산기",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "부동산"],
    previewStats: [
      { label: "수수료 공식", value: "원금×율×잔여비율", context: "은행 일반 기준" },
      { label: "결과", value: "유불리 자동 판정" },
    ],
  },
  {
    slug: "loan-refinancing-calculator",
    title: "대출 갈아타기 계산기",
    description: "현재 대출 잔액·금리·남은 기간과 신규 대출 금리, 중도상환수수료를 입력하면 월 납입금 절감액과 손익분기 시점을 계산합니다.",
    order: 14.52,
    eyebrow: "대환대출 계산",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "대출", "손익분기"],
    previewStats: [
      { label: "핵심 결과", value: "월 절감액" },
      { label: "판단 기준", value: "회수 기간" },
    ],
  },
  {
    slug: "silson-insurance-refund-calculator",
    title: "실손보험 환급액 계산기",
    description: "병원비 영수증의 급여 본인부담금과 비급여 항목을 입력하면 실손보험 세대별 자기부담률, 통원 공제, 연간 한도를 반영해 예상 환급액을 계산합니다.",
    order: 14.54,
    eyebrow: "보험 계산기",
    category: "support",
    iframeReady: true,
    badges: ["신규", "보험", "비급여"],
    previewStats: [
      { label: "핵심 결과", value: "예상 환급액" },
      { label: "확인 항목", value: "4세대 누적" },
    ],
  },
  {
    slug: "real-estate-acquisition-tax",
    title: "부동산 취득세 계산기",
    description: "매매·증여·상속 시 취득세, 지방교육세, 농어촌특별세, 총 납부세액을 주택 수·조정지역 여부에 따라 자동 계산합니다.",
    order: 14.6,
    eyebrow: "부동산 세금 계산",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "세금", "2026"],
    previewStats: [
      { label: "지원 유형", value: "매매·증여·상속" },
      { label: "결과", value: "총 납부세액" },
    ],
  },
  {
    slug: "apartment-holding-tax",
    title: "아파트 보유세 계산기",
    description: "공시가격과 주택 수, 1세대 1주택 여부를 입력해 재산세·지방교육세·종합부동산세·농어촌특별세를 합산 추정합니다.",
    order: 14.62,
    eyebrow: "부동산 보유세 계산",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "보유세", "2026"],
    previewStats: [
      { label: "계산 세목", value: "4종", context: "재산세·종부세" },
      { label: "추가 기능", value: "종부세 진입가" },
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
    slug: "breastfeeding-vs-formula-cost",
    title: "모유수유 vs 분유 비용 계산기",
    description: "완모·혼합·완분 수유 방식별 12개월 누적 비용과 유축기 구매·렌탈 손익분기점, 분유 등급별 예상 지출을 비교합니다.",
    order: 15.2,
    eyebrow: "육아 비용 비교",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교 방식", value: "완모·혼합·완분" },
      { label: "핵심 결과", value: "손익분기점" },
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
    slug: "bonus-etf-investment-calculator",
    title: "성과급으로 ETF 투자하면 월 배당금 얼마?",
    description: "성과급 세후 실수령을 계산하고, ETF에 투자하면 월 배당금이 얼마인지 바로 확인합니다. 삼성·하이닉스·현대차 성과급 시뮬레이션.",
    order: 1.6,
    eyebrow: "성과급 ETF 투자",
    category: "투자·재테크",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "성과급 1천만", value: "월 7만원 배당" },
      { label: "연봉 6천만 기준", value: "ETF 연결" },
    ],
  },
  {
    slug: "monthly-dividend-etf-calculator",
    title: "월배당 ETF 배당금 계산기",
    description: "투자금과 ETF를 선택하면 월 예상 배당금·세후 실수령액을 즉시 계산합니다. CONY·JEPI·JEPQ·SCHD·나스닥100커버드콜 등 14개 ETF 프리셋, 목표 월배당 역산, ETF 비교표 제공.",
    order: 17.4,
    eyebrow: "월배당 ETF 계산기",
    category: "투자·재테크",
    iframeReady: false,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "ETF 프리셋", value: "14개" },
      { label: "목표 역산", value: "월 100만원" },
    ],
  },
  {
    slug: "dividend-monthly-income",
    title: "배당주 월급 계산기",
    description: "투자 원금과 배당수익률을 입력해 세후 월 배당금을 계산하거나, 목표 월 배당에 필요한 원금을 역산하는 계산기. 배당 재투자 10년·20년 시뮬레이션 포함.",
    order: 17.5,
    eyebrow: "배당 계산기",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규"],
    previewStats: [
      { label: "기본 세율", value: "15.4%" },
      { label: "시뮬레이션", value: "20년" },
    ],
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
    slug: "retirement-fund-depletion",
    title: "노후 자금 고갈 계산기",
    description: "현재 자산, 생활비, 국민연금, 물가상승률, 운용수익률을 기준으로 은퇴 시점 필요 자산과 자산 고갈 예상 나이를 추정하는 계산기",
    order: 24.65,
    eyebrow: "은퇴·노후 계산",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "핵심 결과", value: "고갈 시점" },
      { label: "시나리오", value: "낙관·기본·보수" }
    ]
  },
  {
    slug: "youth-savings-maturity-calculator",
    title: "청년 적금 만기 수령액 계산기",
    description: "월 납입액과 금리를 입력해 청년미래적금, 청년도약계좌, 일반 적금의 원금·이자·정부기여금·세후 만기 수령액을 비교합니다.",
    order: 24.67,
    eyebrow: "청년 정책적금",
    category: "support",
    iframeReady: true,
    badges: ["신규", "청년", "정책적금"],
    previewStats: [
      { label: "비교 상품", value: "3종" },
      { label: "핵심 결과", value: "만기 수령액" },
    ],
  },
  {
    slug: "savings-vs-etf-retirement",
    title: "월 적금 vs ETF 노후 계산기",
    description: "현재 나이, 은퇴 목표 나이, 월 투자금, 적금 금리, ETF 기대수익률, 물가상승률을 입력하면 은퇴 시점 자산과 실질 구매력, 생활비 커버 기간을 비교합니다.",
    order: 24.68,
    eyebrow: "노후 준비 계산",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "시뮬레이션"],
    previewStats: [
      { label: "비교", value: "적금 vs ETF" },
      { label: "결과", value: "고갈 시점" }
    ]
  },
  {
    slug: "coin-dca-calculator",
    title: "코인 DCA 계산기",
    description: "비트코인·이더리움 등 가상자산을 매달 정액으로 적립했을 때 평균 매수가, 보유 수량, 현재 평가액, 수익률을 계산합니다.",
    order: 24.9,
    eyebrow: "가상자산 적립식 투자",
    category: "투자·재테크",
    iframeReady: true,
    badges: ["신규", "시뮬레이션"],
    previewStats: [
      { label: "핵심 결과", value: "평균 매수가" },
      { label: "시나리오", value: "±30%" },
    ],
  },
  {
    slug: "ev-vs-ice-cost-calculator",
    title: "전기차 vs 내연기관 총비용 비교 계산기",
    description: "전기차와 휘발유·디젤·LPG차의 보조금·취득세·충전비·유지비·보험료를 전부 합산해 5년·10년 총보유비용을 비교합니다. 손익분기점 연도를 즉시 확인하세요.",
    order: 25.55,
    eyebrow: "자동차 비용 비교",
    category: "compare",
    iframeReady: true,
    badges: ["신규", "시뮬레이션"],
    previewStats: [
      { label: "비교 항목", value: "TCO 6가지" },
      { label: "손익분기", value: "연도 즉시 계산" },
    ],
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
    slug: "domestic-stock-capital-gains-tax",
    title: "국내주식 양도소득세 계산기",
    description: "국내 상장주식 대주주, 장외거래, 비상장주식 양도 시 예상 세액을 계산하고 손익통산과 기본공제까지 반영하는 계산기입니다.",
    order: 25.5,
    eyebrow: "주식 세금",
    category: "investment",
    iframeReady: true,
    badges: ["세금", "국내주식", "2026"],
    previewStats: [
      { label: "기본공제", value: "250만원", context: "연간 기준" },
      { label: "과세 판정", value: "대주주·장외·비상장" },
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
    slug: "ai-subscription-cost",
    title: "AI 도구 월비용 계산기",
    description: "ChatGPT, Claude, Copilot, Perplexity, Notion AI 등 AI 구독료를 합산하고 월 절감 시간 대비 ROI와 중복 구독 가능성을 점검하는 계산기",
    order: 26.2,
    eyebrow: "AI 구독비 계산",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교 도구", value: "8종" },
      { label: "핵심 결과", value: "월비용·ROI" },
    ],
  },
  {
    slug: "ai-work-roi-calculator",
    title: "AI 업무 ROI 계산기",
    description: "월급, 반복업무 시간, AI 도구 비용을 입력해 시간절감액과 연간 ROI를 계산합니다.",
    order: 26.25,
    eyebrow: "AI ROI 계산",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "ROI"],
    previewStats: [
      { label: "핵심 결과", value: "월 순이익" },
      { label: "판정", value: "ROI 등급" },
    ],
  },
  {
    slug: "ai-side-income-calculator",
    title: "AI 부업 수입 계산기",
    description: "부업 시간, 예상 시급, AI 생산성 향상률, 도구 구독료를 입력하면 AI 사용 전후 수입과 도구비 차감 후 순수입을 계산합니다.",
    order: 26.26,
    eyebrow: "AI 부업 계산",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "업종 프리셋", value: "6종" },
      { label: "핵심 결과", value: "순수입" },
    ],
  },
  {
    slug: "ai-tutoring-vs-academy-cost",
    title: "AI 과외 vs 학원 비용 계산기",
    description:
      "자녀 학년, 과목 수, 학원비와 AI 학습 도구 구독료를 입력하면 월 절감액, 연간 절약액, 과목별 AI 대체 가능성을 계산합니다.",
    order: 26.27,
    eyebrow: "AI 교육비 비교",
    category: "ai",
    iframeReady: true,
    badges: ["신규", "시뮬레이션"],
    previewStats: [
      { label: "비교 기준", value: "학원 vs AI" },
      { label: "출력", value: "월·연 절감액" },
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
    slug: "daycare-vs-kindergarten-cost",
    title: "어린이집 vs 유치원 비용 계산기",
    description: "아이 나이, 거주 지역, 맞벌이 여부, 기관 유형을 입력하면 보육료·유아학비 지원금 차감 후 어린이집과 유치원 월 실부담금을 비교합니다.",
    order: 26.05,
    eyebrow: "육아 비용 비교",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교 대상", value: "어린이집 vs 유치원" },
      { label: "지원금 반영", value: "2026년 기준" },
    ],
  },
  {
    slug: "delivery-vs-cooking-cost",
    title: "배달 vs 직접 요리 비용 계산기",
    description: "주당 배달 횟수, 배달비, 쿠폰, 식재료비, 조리 시간까지 입력해 월간·연간 절약액과 손익분기 주문금액을 계산합니다.",
    order: 26.08,
    eyebrow: "생활비 절약",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "비교", value: "배달 vs 집밥" },
      { label: "출력", value: "연간 절약액" },
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
  {
    slug: "travel-expense-split",
    title: "여행 경비 분담 계산기",
    description: "친구·커플·가족 여행 후 선결제자, 불참 항목, 더치페이와 비율 분담을 반영해 누가 누구에게 얼마 보내면 되는지 계산합니다.",
    order: 27.1,
    eyebrow: "여행 정산 계산기",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규", "여행"],
    previewStats: [
      { label: "정산 방식", value: "더치페이·비율" },
      { label: "핵심 결과", value: "송금 내역" },
    ],
  },
  {
    slug: "flight-cheapest-timing-calculator",
    title: "항공권 최저가 시기 계산기",
    description: "출발지, 목적지 권역, 출발 월, 인원수를 기준으로 지금 예매와 기다렸다 예매하는 경우의 예상 항공권 차이를 계산합니다.",
    order: 27.2,
    eyebrow: "항공권 예매 타이밍",
    category: "lifestyle",
    iframeReady: true,
    badges: ["신규", "추정"],
    previewStats: [
      { label: "지원 권역", value: "일본·동남아·유럽" },
      { label: "핵심 결과", value: "예매 시점 비교" },
    ],
  },
  {
    slug: "postnatal-care-cost",
    title: "산후도우미 비용 계산기",
    description: "거주 지역, 출산 유형, 소득 구간, 이용 기간을 입력하면 2026년 산모·신생아 건강관리 지원사업 기준 정부지원금과 예상 본인부담금을 계산합니다.",
    order: 27.35,
    eyebrow: "출산·산후관리",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "출산", "정부지원"],
    previewStats: [
      { label: "기준", value: "2026년 공개표", context: "공식 산모·신생아 지원사업" },
      { label: "지원 유형", value: "단축·표준·연장형" },
    ],
  },
  {
    slug: "postnatal-care-income-eligibility",
    title: "산후도우미 지원금 소득기준 계산기",
    description: "가구원 수와 건강보험료를 입력해 2026년 산모·신생아 건강관리 지원사업의 기준중위소득 150% 해당 여부와 예외지원 확인 포인트를 계산합니다.",
    order: 27.36,
    eyebrow: "산후도우미 소득기준",
    category: "parenting",
    iframeReady: true,
    badges: ["신규", "출산", "소득기준"],
    previewStats: [
      { label: "판정 기준", value: "150%", context: "기준중위소득" },
      { label: "입력", value: "건보료", context: "맞벌이 합산 가능" },
    ],
  },
  {
    slug: "stock-breakeven-calculator",
    title: "주식 손익분기점 계산기",
    description: "매수가, 수량, 수수료, 증권거래세를 반영해 실제 본전 매도가와 목표 수익률 매도가를 즉시 계산합니다. 현재 주가 입력 시 지금 내 손익도 확인할 수 있습니다.",
    order: 27.3,
    eyebrow: "주식 계산기",
    category: "investment",
    iframeReady: true,
    badges: ["신규", "주식"],
    previewStats: [
      { label: "거래세 기본값", value: "0.18%", context: "코스피·코스닥 기준" },
      { label: "계산 항목", value: "수수료+거래세", context: "매수·매도 모두 반영" },
    ],
  },
  {
    slug: "us-stock-exchange-profit-calculator",
    title: "미국주식 환차손익 계산기",
    description: "매수·매도 환율과 주가를 반영해 달러 수익률과 실제 원화 수익률 차이를 계산합니다.",
    order: 27.32,
    eyebrow: "미국주식 환율 계산",
    category: "investment",
    iframeReady: true,
    badges: ["미국주식", "환율"],
    previewStats: [
      { label: "비교", value: "달러 vs 원화" },
      { label: "핵심 결과", value: "환차손익" },
    ],
  },
  {
    slug: "travel-savings-goal-calculator",
    title: "여행 적금 목표 계산기",
    description: "목표 여행 예산과 출발 예정월을 입력하면 매달 필요한 여행 적금 금액과 하루 절약액을 계산합니다.",
    order: 27.25,
    eyebrow: "여행 예산",
    category: "lifestyle",
    iframeReady: true,
    badges: ["여행", "적금"],
    previewStats: [
      { label: "핵심 결과", value: "월 적립액" },
      { label: "시나리오", value: "0~4% 금리" },
    ],
  },
  {
    slug: "early-retirement-age",
    title: "조기 은퇴 가능 나이 계산기",
    description: "월 소득, 지출, 현재 자산, 투자수익률을 입력해 목표 은퇴자산과 조기 은퇴 가능 나이를 계산합니다.",
    order: 24.66,
    eyebrow: "FIRE 계산기",
    category: "investment",
    iframeReady: true,
    badges: ["은퇴", "FIRE", "추정"],
    previewStats: [
      { label: "핵심 결과", value: "은퇴 나이" },
      { label: "기준", value: "인출률" },
    ],
  },
  {
    slug: "jeonse-vs-wolse-calculator",
    title: "아파트 월세 vs 전세 손익 계산기",
    description: "전세대출 이자, 보증금 기회비용, 월세 납부액을 비교해 전세와 월세 중 유리한 선택을 계산합니다.",
    order: 24.55,
    eyebrow: "부동산 비용",
    category: "realestate",
    iframeReady: true,
    badges: ["전세", "월세"],
    previewStats: [
      { label: "핵심 결과", value: "손익 차이" },
      { label: "보조 지표", value: "손익분기 월세" },
    ],
  },
  {
    slug: "pregnancy-checkup-cost",
    title: "임신 주수별 검사비 계산기",
    description: "현재 임신 주수를 기준으로 남은 산부인과 검사 항목, 예상 검사비, 바우처 차감 후 본인부담액을 계산합니다.",
    order: 23.5,
    eyebrow: "임신 검사비",
    category: "support",
    iframeReady: true,
    badges: ["임신", "검사비", "추정"],
    previewStats: [
      { label: "핵심 결과", value: "남은 검사비" },
      { label: "지원금", value: "바우처 차감" },
    ],
  },
  {
    slug: "pension-optimal-age",
    title: "연금 수령 최적 나이 계산기",
    description: "국민연금, 개인연금, 퇴직연금을 언제부터 받는 게 유리한지 계산합니다. 수령 나이별 누적액과 손익분기 나이를 비교합니다.",
    order: 24,
    eyebrow: "연금 수령 최적 나이",
    category: "retire",
    iframeReady: true,
    badges: ["연금", "노후", "국민연금"],
    previewStats: [
      { label: "추천 수령 나이", value: "건강수명 기준" },
      { label: "손익분기 나이", value: "조기 vs 정상" },
    ],
  },
  {
    slug: "year-end-tax-refund-calculator",
    title: "연말정산 환급액 계산기",
    description: "총급여·부양가족·신용카드·의료비·연금저축 등 공제 항목을 입력하면 연말정산 예상 환급액을 자동 계산합니다. 연금저축·IRP 한도 미달 시 추가 납입 효과도 함께 확인하세요.",
    order: 5.2,
    eyebrow: "연말정산 절세",
    category: "calculator",
    iframeReady: true,
    badges: ["연말정산", "세금", "절세"],
    previewStats: [
      { label: "핵심 결과", value: "예상 환급액" },
      { label: "추가 기능", value: "연금저축 여력" },
    ],
  },
  {
    slug: "overtime-pay-calculator",
    title: "야근수당 계산기",
    description: "기본급과 연장·야간·휴일 근로 시간을 입력하면 통상임금 기반 법정 수당을 자동 계산합니다. 포괄임금 초과 여부 확인 및 세후 실수령 증가액까지 한눈에 확인하세요.",
    order: 5.5,
    eyebrow: "야근수당 계산",
    category: "calculator",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "직종 프리셋", value: "4종" },
      { label: "핵심 결과", value: "세전·세후 수당" },
    ],
  },
  {
    slug: "newlywed-rent-vs-buy",
    title: "신혼집 전세 vs 매매 손익 계산기",
    description: "전세 보증금·매매가·대출 금리·거주 기간을 입력하면 누적 순비용과 손익분기 전환 시점을 자동 계산합니다. 신혼부부 특례대출 조건 포함.",
    order: 14.55,
    eyebrow: "전세 vs 매매",
    category: "realestate",
    iframeReady: true,
    badges: ["신규", "추천"],
    previewStats: [
      { label: "핵심 결과", value: "손익분기 시점" },
      { label: "시나리오", value: "집값 상승률 슬라이더" },
    ],
  },
  {
    slug: "travel-exchange-calculator",
    title: "여행 환전 손익 계산기",
    description: "트래블카드, 은행 앱, 은행 창구, 공항, 현지 ATM 5가지 환전 방법의 실수령 외화와 수수료를 한 번에 비교합니다.",
    order: 25,
    eyebrow: "여행 환전 비교",
    category: "travel",
    iframeReady: true,
    badges: ["환전", "트래블카드", "여행"],
    previewStats: [
      { label: "추천 방법", value: "트래블카드" },
      { label: "5가지 방법 비교", value: "수수료 한눈에" },
    ],
  },
];

// 모바일 메뉴 "인기 계산기" 섹션에 고정 노출할 slug 목록 (운영 중 교체 시 이 배열만 수정)
export const MOBILE_POPULAR_SLUGS: string[] = [
  "salary-tier",
  "household-income",
  "samsung-bonus",
  "sk-hynix-bonus",
  "single-parental-leave-total",
  "fire-calculator",
];



