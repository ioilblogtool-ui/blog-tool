export type CompareMode = "salary" | "starter" | "companySize";
export type FilterGroup = "all" | "top" | "stable" | "ops";

export type CompanyEntry = {
  slug: string;
  name: string;
  nameEn: string;
  groupType: Exclude<FilterGroup, "all"> | "growth";
  avgSalaryM: number;
  starterSalaryMinM: number;
  starterSalaryMaxM: number;
  starterSalaryNote: string;
  bonusLabel: "높음" | "중간" | "변동 큼" | "보수적" | "추정";
  bonusSummary: string;
  revenueEok: number;
  headcount: number;
  businessFocus: string[];
  tags: string[];
  recommendedFor: string[];
  summary: string;
  referenceLinks: { label: string; href: string }[];
};

export type TierBucket = {
  key: string;
  label: string;
  minM: number;
  maxM?: number;
};

export type ItSiSmSalaryComparison2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  companies: CompanyEntry[];
  tierBuckets: TierBucket[];
  patternPoints: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    salary: { label: string; href: string }[];
  };
  affiliateProducts: {
    tag: string;
    title: string;
    desc: string;
    url: string;
  }[];
};

const companies: CompanyEntry[] = [
  {
    slug: "samsung-sds",
    name: "삼성SDS",
    nameEn: "Samsung SDS",
    groupType: "top",
    avgSalaryM: 13800,
    starterSalaryMinM: 6200,
    starterSalaryMaxM: 6800,
    starterSalaryNote: "개발·엔지니어 직군 기준 추정",
    bonusLabel: "변동 큼",
    bonusSummary: "삼성 그룹 성과급 정책의 영향을 받는 구조로, 연도별 체감 보상 편차가 상대적으로 크게 나타나는 편입니다.",
    revenueEok: 138000,
    headcount: 13500,
    businessFocus: ["클라우드", "ERP", "금융 SI", "공공 DX"],
    tags: ["상단권", "대형 SI", "삼성", "엔터프라이즈"],
    recommendedFor: ["대형 프로젝트 경험을 쌓고 싶은 개발자", "안정성과 브랜드를 같이 보는 이직자"],
    summary: "국내 대형 SI 가운데서도 평균 연봉 상단 구간을 형성하는 대표 사례로 볼 수 있습니다.",
    referenceLinks: [
      { label: "삼성SDS 회사소개", href: "https://www.samsungsds.com/kr/index.html" },
      { label: "삼성SDS 채용", href: "https://www.samsungsds.com/kr/careers/careers.html" }
    ]
  },
  {
    slug: "lg-cns",
    name: "LG CNS",
    nameEn: "LG CNS",
    groupType: "top",
    avgSalaryM: 13200,
    starterSalaryMinM: 6000,
    starterSalaryMaxM: 6600,
    starterSalaryNote: "개발 직군 기준 추정",
    bonusLabel: "중간",
    bonusSummary: "성과급 요소는 존재하지만, 업황 민감 업종 대비 변동 폭은 상대적으로 완만한 편으로 해석됩니다.",
    revenueEok: 59000,
    headcount: 7800,
    businessFocus: ["AX", "스마트팩토리", "금융", "클라우드"],
    tags: ["상단권", "대형 SI", "LG", "AX"],
    recommendedFor: ["클라우드·데이터 프로젝트를 원하는 개발자", "대기업 IT서비스 커리어를 보는 지원자"],
    summary: "국내 IT서비스 업계에서 평균 연봉과 성장 기대를 함께 견인하는 축으로 해석됩니다.",
    referenceLinks: [
      { label: "LG CNS 회사소개", href: "https://www.lgcns.com/" },
      { label: "LG CNS 채용", href: "https://www.lgcns.com/careers/" }
    ]
  },
  {
    slug: "hyundai-autoever",
    name: "현대오토에버",
    nameEn: "Hyundai AutoEver",
    groupType: "growth",
    avgSalaryM: 11800,
    starterSalaryMinM: 5600,
    starterSalaryMaxM: 6200,
    starterSalaryNote: "IT·SDV 직군 기준 추정",
    bonusLabel: "중간",
    bonusSummary: "완성차 그룹의 투자 사이클과 연동되는 성격이 있어, 성과 체감은 중상 수준으로 평가되는 경우가 많습니다.",
    revenueEok: 34000,
    headcount: 5400,
    businessFocus: ["SDV", "모빌리티", "스마트팩토리", "그룹 IT"],
    tags: ["성장형", "모빌리티", "현대차그룹", "내재화"],
    recommendedFor: ["자동차 소프트웨어와 그룹 IT를 함께 경험하고 싶은 개발자"],
    summary: "전통적인 SI보다는 모빌리티·차량 소프트웨어 축이 강해, 성장형 포지션으로 분류하기에 적합한 기업입니다.",
    referenceLinks: [
      { label: "현대오토에버 회사소개", href: "https://www.hyundai-autoever.com/" },
      { label: "현대오토에버 채용", href: "https://recruit.hyundai-autoever.com/" }
    ]
  },
  {
    slug: "hanwha-systems-ict",
    name: "한화시스템 ICT",
    nameEn: "Hanwha Systems ICT",
    groupType: "growth",
    avgSalaryM: 10900,
    starterSalaryMinM: 5400,
    starterSalaryMaxM: 5900,
    starterSalaryNote: "ICT 부문 기준 추정",
    bonusLabel: "중간",
    bonusSummary: "방산·ICT 포트폴리오가 혼합된 구조라서, 프로젝트 구성과 사업 실적에 따라 성과 체감 차이가 발생하는 편입니다.",
    revenueEok: 28000,
    headcount: 4400,
    businessFocus: ["방산 ICT", "SI", "보안", "항공·국방"],
    tags: ["성장형", "방산", "한화", "보안"],
    recommendedFor: ["방산·보안·대형 시스템 사업에 관심 있는 개발자"],
    summary: "순수 그룹 IT 기업이라기보다 방산·ICT 결합형 포트폴리오를 갖고 있어, 보상 구조와 업무 성격이 차별적으로 나타납니다.",
    referenceLinks: [
      { label: "한화시스템 회사소개", href: "https://www.hanwhasystems.com/" },
      { label: "한화시스템 채용", href: "https://www.hanwhasystems.com/kr/recruit/recruit_main.do" }
    ]
  },
  {
    slug: "miracom-inc",
    name: "미라콤아이앤씨",
    nameEn: "MIRACOM INC",
    groupType: "top",
    avgSalaryM: 10100,
    starterSalaryMinM: 5200,
    starterSalaryMaxM: 5700,
    starterSalaryNote: "MES·스마트팩토리 직군 기준 추정",
    bonusLabel: "중간",
    bonusSummary: "삼성 계열 제조 프로젝트 비중이 반영되지만, 실제 보상 체감은 직무와 프로젝트 포트폴리오에 따라 차이가 납니다.",
    revenueEok: 6200,
    headcount: 1400,
    businessFocus: ["MES", "스마트팩토리", "제조 DX"],
    tags: ["상단권", "제조 DX", "삼성 계열", "스마트팩토리"],
    recommendedFor: ["제조 현장형 시스템과 스마트팩토리 경험을 원하는 개발자"],
    summary: "절대 규모는 상대적으로 작지만, 제조 DX 특화 포지션 덕분에 평균 연봉은 상단권에 위치합니다.",
    referenceLinks: [
      { label: "미라콤아이앤씨 회사소개", href: "https://www.miracom-inc.com/" }
    ]
  },
  {
    slug: "shinsegae-inc",
    name: "신세계I&C",
    nameEn: "Shinsegae I&C",
    groupType: "stable",
    avgSalaryM: 9600,
    starterSalaryMinM: 4800,
    starterSalaryMaxM: 5300,
    starterSalaryNote: "개발·플랫폼 직군 기준 추정",
    bonusLabel: "보수적",
    bonusSummary: "유통 계열 그룹 IT 성격이 강해, 공격적인 성과급보다는 안정적인 보상 구조로 해석되는 편입니다.",
    revenueEok: 5800,
    headcount: 1700,
    businessFocus: ["리테일 IT", "이커머스", "플랫폼 운영"],
    tags: ["안정형", "유통 IT", "그룹 IT"],
    recommendedFor: ["유통·커머스 도메인 경험을 쌓고 싶은 개발자"],
    summary: "보상 급등형 구조는 아니지만, 유통 그룹 IT 기업답게 비교적 안정적인 체계를 유지하는 편입니다.",
    referenceLinks: [
      { label: "신세계I&C 회사소개", href: "https://www.shinsegae-inc.com/" },
      { label: "신세계I&C 채용", href: "https://job.shinsegaeinc.com/" }
    ]
  },
  {
    slug: "cj-olive-networks",
    name: "CJ올리브네트웍스",
    nameEn: "CJ OliveNetworks",
    groupType: "stable",
    avgSalaryM: 9300,
    starterSalaryMinM: 4700,
    starterSalaryMaxM: 5200,
    starterSalaryNote: "디지털·개발 직군 기준 추정",
    bonusLabel: "보수적",
    bonusSummary: "그룹 실적 영향은 존재하지만, 전반적으로는 완만한 성과급 흐름을 보이는 조직으로 분류됩니다.",
    revenueEok: 8600,
    headcount: 2300,
    businessFocus: ["커머스", "콘텐츠 IT", "DX", "운영"],
    tags: ["안정형", "그룹 IT", "커머스", "콘텐츠"],
    recommendedFor: ["그룹 서비스 운영과 DX를 함께 경험하고 싶은 개발자"],
    summary: "CJ 계열 서비스 운영과 프로젝트 수행 비중이 함께 존재해, 안정형과 운영형 사이의 성격을 보입니다.",
    referenceLinks: [
      { label: "CJ올리브네트웍스 회사소개", href: "https://www.cjolivenetworks.co.kr/" },
      { label: "CJ올리브네트웍스 채용", href: "https://www.cjolivenetworks.co.kr/recruit/" }
    ]
  },
  {
    slug: "lotte-innovate",
    name: "롯데이노베이트",
    nameEn: "LOTTE Innovate",
    groupType: "stable",
    avgSalaryM: 8900,
    starterSalaryMinM: 4600,
    starterSalaryMaxM: 5100,
    starterSalaryNote: "개발·인프라 직군 기준 추정",
    bonusLabel: "보수적",
    bonusSummary: "전형적인 그룹 IT 보상 체계에 가까워 상단 업사이드는 제한적이지만, 하방 안정성은 상대적으로 확보된 편입니다.",
    revenueEok: 11300,
    headcount: 3900,
    businessFocus: ["리테일 IT", "그룹 시스템", "스마트물류", "AI 전환"],
    tags: ["안정형", "그룹 IT", "운영형", "롯데"],
    recommendedFor: ["대형 그룹 시스템 운영과 개선 업무를 선호하는 개발자"],
    summary: "브랜드 개편 이후 성장 서사를 강화하고 있지만, 현재 보상 체계는 여전히 안정형 그룹 IT에 가깝습니다.",
    referenceLinks: [
      { label: "롯데이노베이트 회사소개", href: "https://www.lotteinnovate.com/" }
    ]
  },
  {
    slug: "kt-ds",
    name: "KT ds",
    nameEn: "KT ds",
    groupType: "ops",
    avgSalaryM: 8300,
    starterSalaryMinM: 4300,
    starterSalaryMaxM: 4800,
    starterSalaryNote: "개발·운영 직군 기준 추정",
    bonusLabel: "보수적",
    bonusSummary: "통신 그룹 IT 운영 성격이 강해, 성과급 업사이드는 제한적인 구조로 평가되는 경우가 많습니다.",
    revenueEok: 9000,
    headcount: 5200,
    businessFocus: ["통신 IT", "운영", "금융·공공 SI", "플랫폼 유지보수"],
    tags: ["운영형", "통신 IT", "안정형"],
    recommendedFor: ["운영·유지보수와 대형 고객사 시스템 경험을 원하는 개발자"],
    summary: "대규모 운영 조직의 특성이 강해, 보상 상단보다 안정성과 업무 지속성이 더 자주 비교 포인트로 언급됩니다.",
    referenceLinks: [
      { label: "KT ds 회사소개", href: "https://www.ktds.com/" },
      { label: "KT ds 채용", href: "https://recruit.kt.com/" }
    ]
  }
];

export const itSiSmSalaryComparison2026: ItSiSmSalaryComparison2026Data = {
  meta: {
    slug: "it-si-sm-salary-comparison-2026",
    title: "IT SI·SM 대기업 평균 연봉·성과급 비교 리포트 2026",
    subtitle:
      "삼성SDS, LG CNS, 현대오토에버, 한화시스템 ICT 등 국내 주요 IT서비스 기업의 평균 연봉, 초봉, 성과급 체감, 회사 규모를 함께 비교하는 리포트입니다.",
    methodology:
      "사업보고서와 감사보고서, 채용 페이지, 보도자료, 커뮤니티 기반 추정치를 교차 확인해 2026년 비교 지표로 재구성했습니다.",
    caution:
      "평균 연봉과 초봉에는 공시치와 추정치가 함께 포함되며, 성과급은 연도별 편차가 커 정량 확정값보다 체감 지표로 해석하는 것이 적절합니다.",
    updatedAt: "2026년 3월 기준"
  },
  companies,
  tierBuckets: [
    { key: "tier-10000", label: "1억 이상", minM: 10000 },
    { key: "tier-8000", label: "8천~1억", minM: 8000, maxM: 9999 },
    { key: "tier-7000", label: "7천~8천", minM: 7000, maxM: 7999 },
    { key: "tier-6000", label: "6천~7천", minM: 6000, maxM: 6999 },
    { key: "tier-under-6000", label: "6천 미만", minM: 0, maxM: 5999 }
  ],
  patternPoints: [
    {
      title: "삼성SDS·LG CNS가 평균 연봉 상단을 형성",
      body: "브랜드 파워와 프로젝트 규모, 핵심 고객 기반이 큰 대형 SI 기업이 평균 연봉 상단을 지속적으로 형성하는 흐름이 관찰됩니다."
    },
    {
      title: "현대오토에버·한화시스템 ICT는 성장 스토리가 강함",
      body: "단순 운영 조직보다 모빌리티, 방산, 보안 같은 산업 축이 결합된 기업에서 성장형 보상 해석이 더 자주 나타납니다."
    },
    {
      title: "신세계I&C·CJ올리브네트웍스·롯데이노베이트는 안정형 그룹 IT",
      body: "성과급 상단은 제한적이지만, 그룹 IT 운영과 내부 서비스 중심 구조 덕분에 안정성이 핵심 해석 포인트로 언급됩니다."
    },
    {
      title: "KT ds는 운영형 조직 특성이 가장 뚜렷",
      body: "대규모 운영·유지보수 비중이 높아 평균 연봉은 상대적으로 낮게 나타나지만, 업무 지속성과 조직 규모는 분명한 강점으로 해석됩니다."
    }
  ],
  faq: [
    {
      q: "이 페이지의 평균 연봉은 모두 공시 기준인가요?",
      a: "아닙니다. 사업보고서상 평균 보수와 채용 페이지 정보, 커뮤니티 추정치가 함께 반영돼 있습니다. 따라서 공시 기반이 아닌 항목은 참고용 추정치로 보는 것이 적절합니다."
    },
    {
      q: "성과급은 왜 정량 수치 대신 체감으로 표기했나요?",
      a: "SI·SM 계열은 사업 실적과 그룹 정책의 영향으로 연도별 편차가 커서, 단일 숫자로 고정 제시하면 해석 왜곡이 발생하기 쉽기 때문입니다."
    },
    {
      q: "내 연봉 벤치마크는 어떤 기준으로 계산하나요?",
      a: "이 리포트에 포함된 9개 기업의 평균 연봉 배열을 기준으로 상대 위치를 계산합니다. 따라서 업계 전체를 대표하는 분포 통계로 해석해서는 안 됩니다."
    },
    {
      q: "초봉이 낮아 보여도 장기적으로 괜찮은 회사가 있나요?",
      a: "그렇습니다. 안정형 그룹 IT 기업은 초봉과 성과급 상단은 제한적일 수 있지만, 장기 재직 안정성과 도메인 경험 축적 측면에서 선호되는 경우가 있습니다."
    }
  ],
  referenceLinks: {
    official: [
      { label: "삼성SDS", href: "https://www.samsungsds.com/kr/index.html" },
      { label: "LG CNS", href: "https://www.lgcns.com/" },
      { label: "현대오토에버", href: "https://www.hyundai-autoever.com/" },
      { label: "한화시스템", href: "https://www.hanwhasystems.com/" }
    ],
    salary: [
      { label: "잡플래닛", href: "https://www.jobplanet.co.kr/" },
      { label: "블라인드", href: "https://www.teamblind.com/kr/" },
      { label: "원티드", href: "https://www.wanted.co.kr/" }
    ]
  },
  affiliateProducts: [
    {
      tag: "업무 환경",
      title: "듀얼 모니터 암",
      desc: "대형 SI·운영 조직처럼 장시간 IDE와 문서를 오갈 때 정리감이 좋은 장비입니다.",
      url: "https://link.coupang.com/a/edjhxN"
    },
    {
      tag: "이직 준비",
      title: "개발자 면접 정리 노트",
      desc: "이직 시즌에 프로젝트 경험과 기술 스택을 빠르게 재정리할 때 쓰기 좋습니다.",
      url: "https://link.coupang.com/a/edjigv"
    },
    {
      tag: "생산성",
      title: "기계식 키보드",
      desc: "문서·코드 작업 비중이 높은 직군에 잘 맞는 생산성 장비 카테고리입니다.",
      url: "https://link.coupang.com/a/edjjlX"
    }
  ]
};

export function formatKrwM(value: number): string {
  if (value >= 10000) {
    const uk = value / 10000;
    return `${uk % 1 === 0 ? uk.toFixed(0) : uk.toFixed(1)}억원`;
  }
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function getStarterMidM(entry: CompanyEntry): number {
  return Math.round((entry.starterSalaryMinM + entry.starterSalaryMaxM) / 2);
}

export function getTierLabel(avgSalaryM: number): string {
  if (avgSalaryM >= 10000) return "1억 이상";
  if (avgSalaryM >= 8000) return "8천~1억";
  if (avgSalaryM >= 7000) return "7천~8천";
  if (avgSalaryM >= 6000) return "6천~7천";
  return "6천 미만";
}

