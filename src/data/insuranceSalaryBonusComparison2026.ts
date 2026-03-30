export type InsuranceType = "life" | "nonlife";
export type CompareMode = "avgSalary" | "bonus" | "newHire" | "totalComp";
export type Scenario = "conservative" | "base" | "aggressive";

export type InsuranceCompanyEntry = {
  slug: string;
  companyId: string;
  companyName: string;
  nameEn: string;
  insuranceType: InsuranceType;
  avgSalaryManwon: number;
  newHireSalaryManwon: number;
  managerSalaryManwon: number;
  bonusRateMin: number;
  bonusRateBase: number;
  bonusRateMax: number;
  extraBonusM?: number;
  bonusComment: string;
  estTotalCompBase: number;
  employeeCount: number;
  revenueText: string;
  companyTag: string;
  summary: string;
  tags: string[];
  hiringUrl?: string;
  officialUrl?: string;
  irUrl?: string;
  updatedAt: string;
};

export type InsuranceSalaryBonusComparison2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: InsuranceCompanyEntry[];
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

const entries: InsuranceCompanyEntry[] = [
  {
    slug: "samsung-fire",
    companyId: "samsung-fire",
    companyName: "삼성화재",
    nameEn: "Samsung Fire & Marine Insurance",
    insuranceType: "nonlife",
    avgSalaryManwon: 14200,
    newHireSalaryManwon: 4900,
    managerSalaryManwon: 11600,
    bonusRateMin: 0.18,
    bonusRateBase: 0.34,
    bonusRateMax: 0.52,
    extraBonusM: 250,
    bonusComment: "손보 대형사 가운데서도 실적과 평가 반영 폭이 크지 않은 편이며, 기본 연봉과 성과급의 균형이 안정적으로 형성되는 구조로 해석됩니다.",
    estTotalCompBase: 19280,
    employeeCount: 6400,
    revenueText: "원수보험료 26조원대",
    companyTag: "고연봉·대형 손보 대표주",
    summary: "손해보험 업계 상단을 대표하는 회사로, 평균 연봉과 총보상 모두 상위권을 형성하는 구조입니다.",
    tags: ["손보", "상단권", "브랜드", "안정형"],
    hiringUrl: "https://www.samsungfire.com/recruit/main.do",
    officialUrl: "https://www.samsungfire.com/",
    irUrl: "https://www.samsungfire.com/company/ir/management.do",
    updatedAt: "2026-03"
  },
  {
    slug: "samsung-life",
    companyId: "samsung-life",
    companyName: "삼성생명",
    nameEn: "Samsung Life Insurance",
    insuranceType: "life",
    avgSalaryManwon: 13100,
    newHireSalaryManwon: 4700,
    managerSalaryManwon: 11000,
    bonusRateMin: 0.16,
    bonusRateBase: 0.3,
    bonusRateMax: 0.46,
    extraBonusM: 220,
    bonusComment: "생보 대형사 중에서는 높은 보상 체계를 유지하지만, 손보 상단 기업 대비 성과급 업사이드는 다소 완만한 편으로 읽힙니다.",
    estTotalCompBase: 17250,
    employeeCount: 5100,
    revenueText: "수입보험료 18조원대",
    companyTag: "생보 상위권 브랜드",
    summary: "생명보험 업계 대표주 성격이 강하며, 브랜드와 안정성을 중시하는 지원자에게 비교 우선순위가 높은 회사입니다.",
    tags: ["생보", "상단권", "브랜드", "안정형"],
    hiringUrl: "https://www.samsunglife.com/Recruit-0",
    officialUrl: "https://www.samsunglife.com/",
    irUrl: "https://www.samsunglife.com/IrInfo-0",
    updatedAt: "2026-03"
  },
  {
    slug: "meritz-fire",
    companyId: "meritz-fire",
    companyName: "메리츠화재",
    nameEn: "Meritz Fire & Marine Insurance",
    insuranceType: "nonlife",
    avgSalaryManwon: 11500,
    newHireSalaryManwon: 4300,
    managerSalaryManwon: 9800,
    bonusRateMin: 0.3,
    bonusRateBase: 0.72,
    bonusRateMax: 1.1,
    extraBonusM: 350,
    bonusComment: "성과급 영향력이 매우 큰 회사로 해석하는 편이 적절하며, 기본 연봉보다 총보상 기준으로 보는 것이 현실에 더 가깝습니다.",
    estTotalCompBase: 20130,
    employeeCount: 3900,
    revenueText: "원수보험료 12조원대",
    companyTag: "성과급 강세",
    summary: "절대 평균 연봉보다 성과급과 총보상 경쟁력이 더 자주 언급되는 대표 사례입니다.",
    tags: ["손보", "성과급 강세", "총보상", "성과연동"],
    hiringUrl: "https://www.meritzfire.com/recruit/recruit.do",
    officialUrl: "https://www.meritzfire.com/",
    irUrl: "https://www.meritzfire.com/ir/management.do",
    updatedAt: "2026-03"
  },
  {
    slug: "hyundai-marine",
    companyId: "hyundai-marine",
    companyName: "현대해상",
    nameEn: "Hyundai Marine & Fire Insurance",
    insuranceType: "nonlife",
    avgSalaryManwon: 10800,
    newHireSalaryManwon: 4200,
    managerSalaryManwon: 9200,
    bonusRateMin: 0.12,
    bonusRateBase: 0.24,
    bonusRateMax: 0.38,
    extraBonusM: 180,
    bonusComment: "전통 대형 손보사답게 기본급과 성과급이 비교적 균형적이며, 메리츠화재처럼 공격적인 성과연동 구조와는 구별됩니다.",
    estTotalCompBase: 13572,
    employeeCount: 4300,
    revenueText: "원수보험료 15조원대",
    companyTag: "전통 대형 손보 안정형",
    summary: "고연봉 상단보다는 안정적 총보상과 브랜드 인지도가 함께 비교 포인트로 읽히는 회사입니다.",
    tags: ["손보", "대형사", "안정형", "브랜드"],
    hiringUrl: "https://hi.wd3.myworkdayjobs.com/HDfire",
    officialUrl: "https://www.hi.co.kr/",
    irUrl: "https://www.hi.co.kr/serviceAction.do?menuId=100887",
    updatedAt: "2026-03"
  },
  {
    slug: "db-insurance",
    companyId: "db-insurance",
    companyName: "DB손해보험",
    nameEn: "DB Insurance",
    insuranceType: "nonlife",
    avgSalaryManwon: 10400,
    newHireSalaryManwon: 5100,
    managerSalaryManwon: 9000,
    bonusRateMin: 0.12,
    bonusRateBase: 0.28,
    bonusRateMax: 0.45,
    extraBonusM: 220,
    bonusComment: "신입 초봉은 경쟁력이 높고 성과급도 중상 수준으로 읽히며, 손보 대형사 중 최근 체감이 개선된 축으로 자주 언급됩니다.",
    estTotalCompBase: 13532,
    employeeCount: 4900,
    revenueText: "원수보험료 17조원대",
    companyTag: "초봉 강세 손보사",
    summary: "초봉 경쟁력이 상대적으로 높아 취준생 관점과 이직 관점 모두에서 자주 비교되는 보험사입니다.",
    tags: ["손보", "초봉 강세", "중상 보상", "이직 관심"],
    hiringUrl: "https://www.idbins.com/recruit/main.jsp",
    officialUrl: "https://www.idbins.com/",
    irUrl: "https://www.idbins.com/company/ir/ir.jsp",
    updatedAt: "2026-03"
  },
  {
    slug: "kb-insurance",
    companyId: "kb-insurance",
    companyName: "KB손해보험",
    nameEn: "KB Insurance",
    insuranceType: "nonlife",
    avgSalaryManwon: 9800,
    newHireSalaryManwon: 4100,
    managerSalaryManwon: 8600,
    bonusRateMin: 0.1,
    bonusRateBase: 0.2,
    bonusRateMax: 0.32,
    extraBonusM: 170,
    bonusComment: "대형 금융그룹 계열 특성이 반영돼 공격적 보상보다는 안정적 총보상 구조로 이해하는 편이 자연스럽습니다.",
    estTotalCompBase: 11930,
    employeeCount: 3500,
    revenueText: "원수보험료 14조원대",
    companyTag: "금융그룹 안정형",
    summary: "상단 연봉 경쟁보다는 그룹 브랜드와 안정적 처우를 함께 보는 지원자에게 더 자주 선택되는 회사입니다.",
    tags: ["손보", "금융그룹", "안정형", "브랜드"],
    hiringUrl: "https://www.kbinsure.co.kr/recruit/main.ec",
    officialUrl: "https://www.kbinsure.co.kr/",
    irUrl: "https://www.kbinsure.co.kr/about/ir/ec",
    updatedAt: "2026-03"
  },
  {
    slug: "hanwha-life",
    companyId: "hanwha-life",
    companyName: "한화생명",
    nameEn: "Hanwha Life",
    insuranceType: "life",
    avgSalaryManwon: 9500,
    newHireSalaryManwon: 4000,
    managerSalaryManwon: 8200,
    bonusRateMin: 0.08,
    bonusRateBase: 0.18,
    bonusRateMax: 0.3,
    extraBonusM: 150,
    bonusComment: "생보 대형사 중에서는 보수적 총보상 구조에 가깝고, 연봉보다는 조직 안정성과 금융업 경력 축적 관점에서 비교되는 편입니다.",
    estTotalCompBase: 11360,
    employeeCount: 4300,
    revenueText: "수입보험료 16조원대",
    companyTag: "생보 안정형",
    summary: "생명보험 업계 경력을 쌓으려는 사용자에게 의미가 있는 비교 대상이며, 보상 구조는 비교적 안정적으로 해석됩니다.",
    tags: ["생보", "안정형", "대형사", "금융업 경력"],
    hiringUrl: "https://www.hanwhalife.com/recruit/main.do",
    officialUrl: "https://www.hanwhalife.com/",
    irUrl: "https://www.hanwhalife.com/company/ir/ir_main.do",
    updatedAt: "2026-03"
  }
];

export const insuranceSalaryBonusComparison2026: InsuranceSalaryBonusComparison2026Data = {
  meta: {
    slug: "insurance-salary-bonus-comparison-2026",
    title: "국내 TOP 보험사 평균 연봉·성과급 비교 리포트 2026",
    subtitle: "삼성화재, 삼성생명, 메리츠화재, 현대해상, DB손해보험, KB손해보험 등 주요 보험사의 평균 연봉, 신입 초봉, 성과급, 총보상을 함께 비교하는 리포트입니다.",
    methodology: "사업보고서, 기사, 채용 정보, 연봉 플랫폼 공개 수치를 교차 참고해 2026년 비교용 지표로 재구성했습니다.",
    caution: "성과급과 총보상은 회사 실적, 평가, 지급 정책에 따라 크게 달라질 수 있어 참고용 추정치로 해석해야 합니다.",
    updatedAt: "2026년 3월 기준"
  },
  entries,
  patternPoints: [
    {
      title: "손보 상위권이 평균 연봉과 총보상에서 더 강하게 보인다",
      body: "삼성화재, 메리츠화재, 현대해상, DB손해보험처럼 손해보험 대형사는 평균 연봉과 총보상 모두에서 비교 우위를 보이는 경우가 많습니다. 실손, 자동차, 장기보험 포트폴리오와 실적 민감도가 총보상 차이를 키우는 축으로 읽힙니다."
    },
    {
      title: "생보는 성과급보다 안정적 보상 체계로 읽히는 편이다",
      body: "삼성생명과 한화생명은 브랜드와 안정성 측면의 매력이 분명하지만, 성과급 업사이드는 손보 상단 기업보다 완만한 편으로 해석됩니다. 따라서 생보 지원자는 총보상보다 장기 커리어 관점까지 같이 보는 편이 적절합니다."
    },
    {
      title: "메리츠화재는 연봉보다 총보상 기준으로 봐야 한다",
      body: "기본 연봉만 놓고 보면 삼성 계열보다 낮아 보일 수 있지만, 성과급 반영 시 총보상 경쟁력이 크게 달라지는 전형적 사례입니다. 이 리포트에서 메리츠화재를 따로 읽어야 하는 이유가 여기에 있습니다."
    },
    {
      title: "신입 초봉과 평균 연봉 순서는 반드시 일치하지 않는다",
      body: "DB손해보험처럼 초봉 존재감이 큰 회사도 있고, 삼성화재처럼 전체 평균 연봉과 장기 보상 구조가 더 강한 회사도 있습니다. 취준생과 이직 준비자는 같은 표를 다른 기준으로 읽어야 합니다."
    }
  ],
  featureCards: [
    { company: "삼성화재", body: "평균 연봉과 브랜드 안정성을 함께 보는 손보 상단 대표주" },
    { company: "삼성생명", body: "생보 업계 기준점 역할을 하는 상위권 보상 구조" },
    { company: "메리츠화재", body: "성과급 반영 시 총보상 체감이 크게 달라지는 회사" },
    { company: "DB손해보험", body: "초봉 경쟁력이 상대적으로 높아 취준생 관심이 큰 축" }
  ],
  faq: [
    {
      q: "보험사 중 평균 연봉이 가장 높은 곳은 어디인가요?",
      a: "이 리포트 기준으로는 삼성화재가 평균 연봉 상단에 위치합니다. 다만 메리츠화재처럼 성과급 반영 시 총보상 순위가 달라지는 회사도 있어, 연봉과 총보상을 분리해서 보는 편이 정확합니다."
    },
    {
      q: "성과급이 가장 강한 보험사는 어디인가요?",
      a: "기준 시나리오에서는 메리츠화재의 성과급 반영 폭이 가장 크게 설정돼 있습니다. 실제 지급 규모는 연도별 실적과 정책에 따라 크게 달라질 수 있습니다."
    },
    {
      q: "생명보험사와 손해보험사 중 어디가 더 높나요?",
      a: "이 페이지의 비교 대상만 놓고 보면 손해보험사 쪽이 평균 연봉과 총보상 모두에서 더 강하게 나타납니다. 다만 생보는 안정성과 브랜드 측면에서 다른 장점이 있습니다."
    },
    {
      q: "보험사 신입 초봉은 어느 정도인가요?",
      a: "대략 4,000만 원대 초반에서 5,000만 원대 초반까지 분포하며, DB손해보험처럼 5,000만 원 안팎 추정치를 보이는 회사도 있습니다."
    },
    {
      q: "총보상 계산 결과는 얼마나 믿어야 하나요?",
      a: "이 페이지의 총보상 계산은 기본 연봉과 성과급 시나리오를 단순화한 추정치입니다. 실무에서는 부서, 개인 평가, 추가 보너스, 지급 정책에 따라 차이가 큽니다."
    },
    {
      q: "보험사 이직 시 연봉만 보면 되나요?",
      a: "아닙니다. 보험사는 성과급 구조와 보상 변동성이 회사마다 달라 연봉만 보면 판단이 왜곡될 수 있습니다. 이 리포트도 평균 연봉과 총보상을 함께 보도록 설계했습니다."
    }
  ],
  referenceLinks: {
    hiring: [
      { label: "삼성화재 채용", href: "https://www.samsungfire.com/recruit/main.do" },
      { label: "삼성생명 채용", href: "https://www.samsunglife.com/Recruit-0" },
      { label: "메리츠화재 채용", href: "https://www.meritzfire.com/recruit/recruit.do" },
      { label: "DB손해보험 채용", href: "https://www.idbins.com/recruit/main.jsp" }
    ],
    official: [
      { label: "삼성화재", href: "https://www.samsungfire.com/" },
      { label: "삼성생명", href: "https://www.samsunglife.com/" },
      { label: "현대해상", href: "https://www.hi.co.kr/" },
      { label: "KB손해보험", href: "https://www.kbinsure.co.kr/" }
    ],
    ir: [
      { label: "삼성화재 IR", href: "https://www.samsungfire.com/company/ir/management.do" },
      { label: "삼성생명 IR", href: "https://www.samsunglife.com/IrInfo-0" },
      { label: "현대해상 IR", href: "https://www.hi.co.kr/serviceAction.do?menuId=100887" },
      { label: "DB손해보험 IR", href: "https://www.idbins.com/company/ir/ir.jsp" }
    ]
  },
  affiliateProducts: [
    {
      tag: "이직 준비",
      title: "커리어 인터뷰 노트",
      desc: "이직 면접 준비와 프로젝트 정리에 바로 쓰기 좋은 정리형 아이템입니다.",
      url: "https://link.coupang.com/a/eedbhF"
    },
    {
      tag: "업무 환경",
      title: "노트북 거치대",
      desc: "문서와 엑셀, 브라우저를 오래 보는 금융권 사무 환경에서 자세 정리에 도움이 됩니다.",
      url: "https://link.coupang.com/a/eec9It"
    },
    {
      tag: "생산성",
      title: "무선 숫자 키패드",
      desc: "숫자 입력과 표 작업 비중이 높은 사용자를 위한 생산성 보조 장비입니다.",
      url: "https://link.coupang.com/a/eedaw0"
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

export function getInsuranceTypeLabel(type: InsuranceType): string {
  return type === "life" ? "생명보험" : "손해보험";
}
