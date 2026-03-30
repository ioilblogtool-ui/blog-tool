export type CompanyType = "construction" | "engineering" | "plant";
export type CompareMode = "avgSalary" | "bonus" | "newHire" | "totalComp" | "contractorRank";
export type Scenario = "conservative" | "base" | "aggressive";

export type ConstructionCompanyEntry = {
  slug: string;
  companyId: string;
  companyName: string;
  nameEn: string;
  companyType: CompanyType;
  avgSalaryManwon: number;
  newHireSalaryManwon: number;
  managerSalaryManwon: number;
  avgBonusManwon?: number;
  maxBonusManwon?: number;
  bonusRateMin: number;
  bonusRateBase: number;
  bonusRateMax: number;
  extraBonusM?: number;
  bonusComment: string;
  estTotalCompBaseManwon: number;
  employeeCount: number;
  revenueEok: number;
  revenueText: string;
  contractorRank: number;
  growthTag: string;
  companyTag: string;
  summary: string;
  tags: string[];
  hiringUrl?: string;
  officialUrl?: string;
  irUrl?: string;
  updatedAt: string;
};

export type ConstructionSalaryBonusComparison2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: ConstructionCompanyEntry[];
  patternPoints: { title: string; body: string }[];
  featureCards: { company: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    hiring: { label: string; href: string }[];
    official: { label: string; href: string }[];
    ir: { label: string; href: string }[];
  };
  affiliateProducts: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};

const entries: ConstructionCompanyEntry[] = [
  {
    slug: "hyundai-enc",
    companyId: "hyundai-enc",
    companyName: "현대건설",
    nameEn: "Hyundai Engineering & Construction",
    companyType: "construction",
    avgSalaryManwon: 11600,
    newHireSalaryManwon: 4700,
    managerSalaryManwon: 9800,
    avgBonusManwon: 1800,
    maxBonusManwon: 3200,
    bonusRateMin: 0.12,
    bonusRateBase: 0.26,
    bonusRateMax: 0.42,
    extraBonusM: 180,
    bonusComment: "브랜드 주택과 대형 프로젝트 포트폴리오가 함께 반영되는 구조라, 기본 연봉과 성과급의 균형이 상대적으로 안정적인 편입니다.",
    estTotalCompBaseManwon: 13600,
    employeeCount: 7000,
    revenueEok: 297000,
    revenueText: "매출 29.7조원대",
    contractorRank: 2,
    growthTag: "대형 프로젝트·브랜드 주택",
    companyTag: "시공능력 상위권 대표주",
    summary: "대형 건설사 중 브랜드와 규모, 평균 연봉을 함께 보는 기준점 역할을 하는 회사입니다.",
    tags: ["종합건설", "상위권", "브랜드", "대형 프로젝트"],
    hiringUrl: "https://recruit.hdec.kr/",
    officialUrl: "https://www.hdec.kr/",
    irUrl: "https://www.hdec.kr/kr/ir/finance.aspx",
    updatedAt: "2026-03"
  },
  {
    slug: "gs-enc",
    companyId: "gs-enc",
    companyName: "GS건설",
    nameEn: "GS Engineering & Construction",
    companyType: "construction",
    avgSalaryManwon: 11800,
    newHireSalaryManwon: 4600,
    managerSalaryManwon: 10100,
    avgBonusManwon: 1900,
    maxBonusManwon: 3400,
    bonusRateMin: 0.14,
    bonusRateBase: 0.28,
    bonusRateMax: 0.45,
    extraBonusM: 200,
    bonusComment: "주택 사업 비중과 업황 민감도가 함께 작용해 성과급 편차가 생기지만, 상단 건설사 가운데서는 총보상 경쟁력이 강한 편입니다.",
    estTotalCompBaseManwon: 15304,
    employeeCount: 5400,
    revenueEok: 135000,
    revenueText: "매출 13.5조원대",
    contractorRank: 5,
    growthTag: "자이 브랜드·주택 강점",
    companyTag: "주택 브랜드 강세",
    summary: "주택 브랜드 인지도와 대형사 포지션 덕분에 취준생과 이직 준비자 모두에게 자주 비교되는 회사입니다.",
    tags: ["종합건설", "브랜드", "주택 강세", "상위권"],
    hiringUrl: "https://recruit.gsenc.com/",
    officialUrl: "https://www.gsenc.com/",
    irUrl: "https://www.gsenc.com/pr/ir/management.aspx",
    updatedAt: "2026-03"
  },
  {
    slug: "daewoo-enc",
    companyId: "daewoo-enc",
    companyName: "대우건설",
    nameEn: "Daewoo Engineering & Construction",
    companyType: "construction",
    avgSalaryManwon: 11200,
    newHireSalaryManwon: 5100,
    managerSalaryManwon: 9600,
    avgBonusManwon: 1700,
    maxBonusManwon: 3000,
    bonusRateMin: 0.12,
    bonusRateBase: 0.24,
    bonusRateMax: 0.4,
    extraBonusM: 180,
    bonusComment: "대형 프로젝트와 주택 사업 흐름이 동시에 반영되는 구조이며, 신입 초봉 경쟁력도 비교적 높게 읽히는 편입니다.",
    estTotalCompBaseManwon: 13068,
    employeeCount: 6200,
    revenueEok: 112000,
    revenueText: "매출 11.2조원대",
    contractorRank: 3,
    growthTag: "대형 프로젝트·도시정비",
    companyTag: "초봉 강세 대형사",
    summary: "신입 초봉과 브랜드, 프로젝트 경험까지 같이 볼 수 있어 취업 시장에서 존재감이 큰 대형 건설사입니다.",
    tags: ["종합건설", "초봉 강세", "대형사", "프로젝트"],
    hiringUrl: "https://recruit.daewooenc.com/",
    officialUrl: "https://www.daewooenc.com/",
    irUrl: "https://www.daewooenc.com/ir/irMain.do",
    updatedAt: "2026-03"
  },
  {
    slug: "lotte-enc",
    companyId: "lotte-enc",
    companyName: "롯데건설",
    nameEn: "Lotte Engineering & Construction",
    companyType: "construction",
    avgSalaryManwon: 10100,
    newHireSalaryManwon: 4300,
    managerSalaryManwon: 8700,
    avgBonusManwon: 1300,
    maxBonusManwon: 2400,
    bonusRateMin: 0.08,
    bonusRateBase: 0.18,
    bonusRateMax: 0.3,
    extraBonusM: 150,
    bonusComment: "그룹 계열 특성이 반영돼 공격적인 성과급보다는 안정적 보상 구조로 읽히는 편이며, 브랜드와 복지 안정성을 함께 보는 사용자가 많습니다.",
    estTotalCompBaseManwon: 12068,
    employeeCount: 4600,
    revenueEok: 76000,
    revenueText: "매출 7.6조원대",
    contractorRank: 8,
    growthTag: "주택·그룹 계열 안정형",
    companyTag: "그룹 계열 안정형",
    summary: "연봉 상단보다는 그룹 계열 안정성과 주택사업 존재감을 함께 보는 지원자에게 비교 우선순위가 높은 회사입니다.",
    tags: ["종합건설", "안정형", "그룹 계열", "주택"],
    hiringUrl: "https://recruit.lottecon.co.kr/",
    officialUrl: "https://www.lottecon.co.kr/",
    irUrl: "https://www.lottecon.co.kr/pr/ir/financial.asp",
    updatedAt: "2026-03"
  },
  {
    slug: "hyundai-eng",
    companyId: "hyundai-eng",
    companyName: "현대엔지니어링",
    nameEn: "Hyundai Engineering",
    companyType: "engineering",
    avgSalaryManwon: 10900,
    newHireSalaryManwon: 4100,
    managerSalaryManwon: 9300,
    avgBonusManwon: 1600,
    maxBonusManwon: 2900,
    bonusRateMin: 0.12,
    bonusRateBase: 0.22,
    bonusRateMax: 0.38,
    extraBonusM: 170,
    bonusComment: "엔지니어링·해외 프로젝트 중심 성격이 강해 종합건설과는 보상 구조의 결이 다르게 읽히며, 프로젝트 성과 반영 폭도 존재합니다.",
    estTotalCompBaseManwon: 12610,
    employeeCount: 7200,
    revenueEok: 149000,
    revenueText: "매출 14.9조원대",
    contractorRank: 4,
    growthTag: "해외·엔지니어링 강점",
    companyTag: "해외 프로젝트 경쟁력",
    summary: "종합건설사와 다르게 엔지니어링과 해외 프로젝트 축으로 해석해야 하는 대표 회사입니다.",
    tags: ["엔지니어링", "해외 프로젝트", "상위권", "현대차그룹"],
    hiringUrl: "https://www.hec.co.kr/recruit/main.do",
    officialUrl: "https://www.hec.co.kr/",
    irUrl: "https://www.hec.co.kr/ir/finance.asp",
    updatedAt: "2026-03"
  },
  {
    slug: "samsung-ea",
    companyId: "samsung-ea",
    companyName: "삼성E&A",
    nameEn: "Samsung E&A",
    companyType: "plant",
    avgSalaryManwon: 12400,
    newHireSalaryManwon: 4700,
    managerSalaryManwon: 10500,
    avgBonusManwon: 2200,
    maxBonusManwon: 3800,
    bonusRateMin: 0.18,
    bonusRateBase: 0.34,
    bonusRateMax: 0.52,
    extraBonusM: 220,
    bonusComment: "플랜트·해외수주 성과가 보상에 반영되는 구조라 업황과 프로젝트 상황에 따라 성과급 체감이 크게 달라질 수 있습니다.",
    estTotalCompBaseManwon: 16836,
    employeeCount: 5200,
    revenueEok: 102000,
    revenueText: "매출 10.2조원대",
    contractorRank: 11,
    growthTag: "플랜트·해외수주 강세",
    companyTag: "플랜트 상단권",
    summary: "종합건설사와 다른 결의 보상 구조를 보여주는 대표 사례로, 플랜트·해외수주 경쟁력을 같이 해석해야 합니다.",
    tags: ["플랜트", "상단권", "해외수주", "성과급 강세"],
    hiringUrl: "https://www.samsungena.com/kr/recruit/overview.html",
    officialUrl: "https://www.samsungena.com/",
    irUrl: "https://www.samsungena.com/kr/investors/financial-information.html",
    updatedAt: "2026-03"
  },
  {
    slug: "sk-ecoplant",
    companyId: "sk-ecoplant",
    companyName: "SK에코플랜트",
    nameEn: "SK ecoplant",
    companyType: "construction",
    avgSalaryManwon: 10600,
    newHireSalaryManwon: 5000,
    managerSalaryManwon: 9100,
    avgBonusManwon: 1500,
    maxBonusManwon: 2800,
    bonusRateMin: 0.1,
    bonusRateBase: 0.22,
    bonusRateMax: 0.36,
    extraBonusM: 180,
    bonusComment: "친환경 사업 전환과 그룹 계열 프리미엄이 동시에 반영되며, 신입 초봉과 브랜드 체감이 모두 준수한 축으로 읽힙니다.",
    estTotalCompBaseManwon: 13112,
    employeeCount: 4700,
    revenueEok: 90000,
    revenueText: "매출 9.0조원대",
    contractorRank: 10,
    growthTag: "친환경·전환 스토리",
    companyTag: "친환경 전환 서사",
    summary: "기존 종합건설 이미지보다 친환경·에너지 전환 스토리가 강해 성장성 관점에서 자주 비교되는 회사입니다.",
    tags: ["종합건설", "친환경", "성장형", "그룹 계열"],
    hiringUrl: "https://www.skecoplant.com/recruit/main",
    officialUrl: "https://www.skecoplant.com/",
    irUrl: "https://www.skecoplant.com/investor/financial-info",
    updatedAt: "2026-03"
  }
];

export const constructionSalaryBonusComparison2026: ConstructionSalaryBonusComparison2026Data = {
  meta: {
    slug: "construction-salary-bonus-comparison-2026",
    title: "국내 TOP 대형 건설사 평균 연봉·성과급 비교 리포트 2026",
    subtitle: "현대건설, GS건설, 대우건설, 롯데건설, 현대엔지니어링, 삼성E&A, SK에코플랜트 등 주요 대형 건설사의 평균 연봉, 초봉, 성과급, 총보상을 함께 비교하는 리포트입니다.",
    methodology: "사업보고서, 기사, 채용 정보, 연봉 플랫폼 공개 수치를 교차 참고해 2026년 비교용 지표로 재구성했습니다.",
    caution: "성과급과 총보상은 프로젝트 실적, 수주, 평가 정책에 따라 크게 달라질 수 있어 참고용 추정치로 해석해야 합니다.",
    updatedAt: "2026년 3월 기준"
  },
  entries,
  patternPoints: [
    {
      title: "종합건설 상위권은 브랜드와 규모가 동시에 작동한다",
      body: "현대건설, GS건설, 대우건설처럼 브랜드와 대형 프로젝트 포트폴리오를 동시에 가진 회사는 평균 연봉과 총보상 모두에서 상단에 위치하는 경우가 많습니다. 취준생과 이직 준비자 모두 이 축을 먼저 보게 됩니다."
    },
    {
      title: "플랜트·엔지니어링 회사는 연봉 구조의 결이 다르다",
      body: "삼성E&A, 현대엔지니어링처럼 플랜트·엔지니어링 성격이 강한 회사는 종합건설사와 달리 해외 프로젝트와 수주 흐름을 같이 봐야 합니다. 같은 연봉표라도 해석 기준이 달라집니다."
    },
    {
      title: "시공능력 순위와 연봉 순위는 반드시 같지 않다",
      body: "시공능력은 규모와 수행 역량의 지표지만, 실제 연봉과 성과급은 사업 포트폴리오와 프로젝트 수익성에 따라 달라집니다. 그래서 순위표를 그대로 연봉표로 읽으면 왜곡될 수 있습니다."
    },
    {
      title: "총보상 기준으로 다시 봐야 하는 회사가 있다",
      body: "기본 연봉만 보면 비슷해 보이더라도 성과급과 추가 상여를 반영하면 체감이 크게 달라지는 회사가 존재합니다. 이 페이지에서 계산기를 붙인 이유도 그 차이를 빠르게 확인하기 위해서입니다."
    }
  ],
  featureCards: [
    { company: "현대건설", body: "시공능력 상위권과 브랜드, 대형 프로젝트를 함께 보는 기준점" },
    { company: "GS건설", body: "주택 브랜드 인지도와 총보상 체감이 모두 강한 축" },
    { company: "삼성E&A", body: "플랜트·해외수주 성격이 강해 종합건설과 다른 해석이 필요한 회사" },
    { company: "SK에코플랜트", body: "친환경 전환 스토리까지 같이 읽는 성장형 건설사" }
  ],
  faq: [
    {
      q: "대형 건설사 중 평균 연봉이 가장 높은 곳은 어디인가요?",
      a: "이 리포트 기준으로는 삼성E&A와 GS건설, 현대건설이 상위권에 위치합니다. 다만 종합건설과 플랜트 기업은 보상 구조의 결이 달라 총보상 기준으로 함께 보는 편이 더 정확합니다."
    },
    {
      q: "건설사 성과급이 높은 회사는 어디인가요?",
      a: "기준 시나리오에서는 삼성E&A의 성과급 반영 비중이 가장 크게 설정돼 있습니다. 실제 지급 규모는 프로젝트 실적과 수주 흐름에 따라 크게 달라질 수 있습니다."
    },
    {
      q: "건설사 신입 초봉은 어느 정도인가요?",
      a: "대략 4,000만 원대 초반에서 5,000만 원대 초반까지 분포하며, 대우건설과 SK에코플랜트처럼 5,000만 원 안팎 추정치를 보이는 회사도 있습니다."
    },
    {
      q: "시공능력 순위도 같이 봐야 하나요?",
      a: "네. 건설업에서는 시공능력 순위와 매출 규모가 회사의 수행 역량과 브랜드를 읽는 중요한 지표입니다. 다만 연봉 순위와 반드시 같지는 않으므로 함께 비교해야 합니다."
    },
    {
      q: "총보상 계산 결과는 얼마나 믿어야 하나요?",
      a: "이 페이지의 총보상 계산은 기본 연봉과 성과급 시나리오를 단순화한 추정치입니다. 실제로는 현장수당, 프로젝트 인센티브, 평가, 지급 정책에 따라 차이가 큽니다."
    },
    {
      q: "건설사 이직 시 연봉만 보면 되나요?",
      a: "아닙니다. 건설사는 연봉 외에도 성과급, 프로젝트 경험, 시공능력, 회사 유형, 브랜드 포지션을 함께 봐야 실제 체감과 커리어 판단이 쉬워집니다."
    }
  ],
  referenceLinks: {
    hiring: [
      { label: "현대건설 채용", href: "https://recruit.hdec.kr/" },
      { label: "GS건설 채용", href: "https://recruit.gsenc.com/" },
      { label: "대우건설 채용", href: "https://recruit.daewooenc.com/" },
      { label: "삼성E&A 채용", href: "https://www.samsungena.com/kr/recruit/overview.html" }
    ],
    official: [
      { label: "현대건설", href: "https://www.hdec.kr/" },
      { label: "GS건설", href: "https://www.gsenc.com/" },
      { label: "현대엔지니어링", href: "https://www.hec.co.kr/" },
      { label: "SK에코플랜트", href: "https://www.skecoplant.com/" }
    ],
    ir: [
      { label: "현대건설 IR", href: "https://www.hdec.kr/kr/ir/finance.aspx" },
      { label: "GS건설 IR", href: "https://www.gsenc.com/pr/ir/management.aspx" },
      { label: "대우건설 IR", href: "https://www.daewooenc.com/ir/irMain.do" },
      { label: "삼성E&A IR", href: "https://www.samsungena.com/kr/investors/financial-information.html" }
    ]
  },
  affiliateProducts: [
    {
      tag: "이직 준비",
      title: "면접 복장 정리 스탠드",
      desc: "현장·본사 면접 준비 시 복장과 서류를 함께 정리하기 좋은 보조 아이템입니다.",
      url: "https://link.coupang.com/a/eedeUt"
    },
    {
      tag: "업무 환경",
      title: "A4 문서 클립보드",
      desc: "문서와 도면, 체크리스트를 자주 다루는 환경에서 가볍게 쓰기 좋습니다.",
      url: "https://link.coupang.com/a/eedc0F"
    },
    {
      tag: "생산성",
      title: "휴대용 보조배터리",
      desc: "이동이 잦은 현장·외근 환경에서 기본적으로 챙기기 좋은 생산성 아이템입니다.",
      url: "https://link.coupang.com/a/eeddOd"
    }
  ]
};

export function formatManwon(value: number): string {
  if (value >= 10000) {
    const eok = value / 10000;
    return `${Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1)}억원`;
  }

  return `${value.toLocaleString("ko-KR")}만원`;
}

export function formatBonusRate(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function getCompanyTypeLabel(type: CompanyType): string {
  if (type === "engineering") return "엔지니어링";
  if (type === "plant") return "플랜트";
  return "종합건설";
}
