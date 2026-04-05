export type Industry =
  | "semiconductor"
  | "auto"
  | "platform"
  | "itService"
  | "electronics"
  | "construction"
  | "airline";

export type GrowthType =
  | "starterFast"
  | "stable"
  | "longTenure"
  | "performanceHeavy";

export type SalaryBandPoint = {
  year: 1 | 3 | 5 | 7 | 10 | 12 | 15;
  min: number;
  mid: number;
  max: number;
};

export type LargeCompanySalaryGrowthEntry = {
  slug: string;
  companyId: string;
  companyName: string;
  industry: Industry;
  starterSalaryManwon: number | null;
  avgSalaryManwon: number;
  tenureYears: number;
  growthType: GrowthType;
  year10BandLabel: string;
  salaryBands: SalaryBandPoint[];
  summary: string;
  notes?: string;
  tags: string[];
  referenceLabel?: string;
  officialUrl?: string;
  hiringUrl?: string;
  infoUrl?: string;
  updatedAt: string;
};

export type LargeCompanySalaryGrowthByYears2026Data = {
  meta: {
    slug: string;
    title: string;
    subtitle: string;
    methodology: string;
    caution: string;
    updatedAt: string;
  };
  entries: LargeCompanySalaryGrowthEntry[];
  typeCards: {
    type: GrowthType;
    title: string;
    body: string;
    companies: string[];
  }[];
  patternPoints: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  referenceLinks: {
    official: { label: string; href: string }[];
    hiring: { label: string; href: string }[];
    info: { label: string; href: string }[];
  };
  relatedLinks: {
    label: string;
    href: string;
    kind: "tool" | "report";
  }[];
};

export const formatKrwM = (value: number) => {
  if (value >= 10000) {
    const uk = value / 10000;
    return `${Number.isInteger(uk) ? uk.toFixed(0) : uk.toFixed(1)}억원`;
  }
  return `${value.toLocaleString("ko-KR")}만원`;
};

export const formatYears = (value: number) => `${value.toFixed(1)}년`;

export const getBandByYear = (entry: LargeCompanySalaryGrowthEntry, year: SalaryBandPoint["year"]) =>
  entry.salaryBands.find((point) => point.year === year);

export const formatBand = (point: SalaryBandPoint) =>
  `${formatKrwM(point.min)} ~ ${formatKrwM(point.max)}`;

const entries: LargeCompanySalaryGrowthEntry[] = [
  {
    slug: "samsung-electronics",
    companyId: "samsung-electronics",
    companyName: "삼성전자",
    industry: "semiconductor",
    starterSalaryManwon: 5250,
    avgSalaryManwon: 15800,
    tenureYears: 13.7,
    growthType: "performanceHeavy",
    year10BandLabel: "1.3억~1.5억",
    salaryBands: [
      { year: 1, min: 5100, mid: 5250, max: 5400 },
      { year: 3, min: 5900, mid: 6200, max: 6600 },
      { year: 5, min: 7200, mid: 7700, max: 8200 },
      { year: 7, min: 9800, mid: 10800, max: 11800 },
      { year: 10, min: 13000, mid: 14000, max: 15000 },
      { year: 12, min: 14200, mid: 15200, max: 16400 },
      { year: 15, min: 14800, mid: 15800, max: 17000 },
    ],
    summary: "성과급 반영 폭이 커서 상단 밴드가 넓게 벌어지는 대표적인 성과급형 대기업입니다.",
    tags: ["반도체", "전자", "성과급형", "상단 연봉"],
    officialUrl: "https://www.samsung.com/sec/",
    hiringUrl: "https://www.samsungcareers.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "sk-hynix",
    companyId: "sk-hynix",
    companyName: "SK하이닉스",
    industry: "semiconductor",
    starterSalaryManwon: 5255,
    avgSalaryManwon: 18500,
    tenureYears: 13.4,
    growthType: "performanceHeavy",
    year10BandLabel: "1.4억~1.7억",
    salaryBands: [
      { year: 1, min: 5100, mid: 5255, max: 5400 },
      { year: 3, min: 6100, mid: 6500, max: 7000 },
      { year: 5, min: 7500, mid: 8100, max: 8800 },
      { year: 7, min: 10400, mid: 11600, max: 12800 },
      { year: 10, min: 14000, mid: 15500, max: 17000 },
      { year: 12, min: 15600, mid: 17000, max: 18400 },
      { year: 15, min: 16500, mid: 18000, max: 19500 },
    ],
    summary: "업황 민감도가 크지만 상방이 매우 높아 10년차 이후 체감 격차가 크게 벌어지는 편입니다.",
    tags: ["반도체", "성과급형", "고성장", "상단 밴드"],
    officialUrl: "https://www.skhynix.com/",
    hiringUrl: "https://recruit.skhynix.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "hyundai-motor",
    companyId: "hyundai-motor",
    companyName: "현대자동차",
    industry: "auto",
    starterSalaryManwon: 5383,
    avgSalaryManwon: 13100,
    tenureYears: 15.8,
    growthType: "longTenure",
    year10BandLabel: "1.1억~1.3억",
    salaryBands: [
      { year: 1, min: 5200, mid: 5383, max: 5550 },
      { year: 3, min: 5900, mid: 6250, max: 6600 },
      { year: 5, min: 7000, mid: 7450, max: 7900 },
      { year: 7, min: 8600, mid: 9300, max: 10000 },
      { year: 10, min: 11000, mid: 12100, max: 13000 },
      { year: 12, min: 11800, mid: 12700, max: 13600 },
      { year: 15, min: 12600, mid: 13600, max: 14600 },
    ],
    summary: "초반보다 중후반 누적 상승이 강한 장기근속형 패턴으로 읽는 편이 자연스럽습니다.",
    tags: ["자동차", "장기근속형", "제조", "현대차그룹"],
    officialUrl: "https://www.hyundai.com/",
    hiringUrl: "https://talent.hyundai.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "kia",
    companyId: "kia",
    companyName: "기아",
    industry: "auto",
    starterSalaryManwon: 5200,
    avgSalaryManwon: 13400,
    tenureYears: 20.8,
    growthType: "longTenure",
    year10BandLabel: "1.15억~1.3억",
    salaryBands: [
      { year: 1, min: 5050, mid: 5200, max: 5400 },
      { year: 3, min: 5800, mid: 6150, max: 6500 },
      { year: 5, min: 6900, mid: 7400, max: 7900 },
      { year: 7, min: 8600, mid: 9300, max: 10000 },
      { year: 10, min: 11500, mid: 12300, max: 13200 },
      { year: 12, min: 12300, mid: 13100, max: 13900 },
      { year: 15, min: 13200, mid: 14000, max: 14900 },
    ],
    summary: "근속 구조가 길고 제조업 특성이 강해 후반부 체감이 크게 살아나는 장기근속형 사례입니다.",
    tags: ["자동차", "장기근속형", "근속연수 상위", "제조"],
    officialUrl: "https://worldwide.kia.com/",
    hiringUrl: "https://career.kia.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "hyundai-mobis",
    companyId: "hyundai-mobis",
    companyName: "현대모비스",
    industry: "auto",
    starterSalaryManwon: 5100,
    avgSalaryManwon: 13700,
    tenureYears: 13.1,
    growthType: "stable",
    year10BandLabel: "1.15억~1.3억",
    salaryBands: [
      { year: 1, min: 4950, mid: 5100, max: 5300 },
      { year: 3, min: 5700, mid: 6000, max: 6350 },
      { year: 5, min: 6900, mid: 7350, max: 7800 },
      { year: 7, min: 8500, mid: 9300, max: 10100 },
      { year: 10, min: 11500, mid: 12300, max: 13000 },
      { year: 12, min: 12300, mid: 13100, max: 13900 },
      { year: 15, min: 13000, mid: 13800, max: 14700 },
    ],
    summary: "완만하지만 전체 구간이 고르게 올라가는 안정형 제조 대기업에 가깝습니다.",
    tags: ["자동차부품", "안정형", "현대차그룹", "제조"],
    officialUrl: "https://www.mobis.co.kr/",
    hiringUrl: "https://careers.mobis.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "naver",
    companyId: "naver",
    companyName: "네이버",
    industry: "platform",
    starterSalaryManwon: 6000,
    avgSalaryManwon: 14600,
    tenureYears: 7.7,
    growthType: "starterFast",
    year10BandLabel: "1.2억~1.4억",
    salaryBands: [
      { year: 1, min: 5800, mid: 6000, max: 6200 },
      { year: 3, min: 7200, mid: 7800, max: 8400 },
      { year: 5, min: 8500, mid: 9300, max: 10100 },
      { year: 7, min: 9800, mid: 10800, max: 11800 },
      { year: 10, min: 12000, mid: 13000, max: 14000 },
      { year: 12, min: 12800, mid: 13800, max: 14800 },
      { year: 15, min: 13400, mid: 14500, max: 15600 },
    ],
    summary: "초반 상승 체감이 빠르고 5년차까지 존재감이 강한 대표적인 초봉형 플랫폼 기업입니다.",
    tags: ["플랫폼", "초봉형", "IT", "고성장"],
    officialUrl: "https://www.navercorp.com/",
    hiringUrl: "https://recruit.navercorp.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "kakao",
    companyId: "kakao",
    companyName: "카카오",
    industry: "platform",
    starterSalaryManwon: 5400,
    avgSalaryManwon: 10200,
    tenureYears: 5.5,
    growthType: "starterFast",
    year10BandLabel: "0.95억~1.15억",
    salaryBands: [
      { year: 1, min: 5200, mid: 5400, max: 5600 },
      { year: 3, min: 6400, mid: 7000, max: 7600 },
      { year: 5, min: 7700, mid: 8400, max: 9100 },
      { year: 7, min: 8600, mid: 9300, max: 10000 },
      { year: 10, min: 9500, mid: 10500, max: 11500 },
      { year: 12, min: 9800, mid: 10800, max: 11800 },
      { year: 15, min: 10200, mid: 11200, max: 12300 },
    ],
    summary: "초반 상승 속도는 빠르지만 장기 밴드는 완만해지는 초봉형 플랫폼 기업으로 보는 편이 적절합니다.",
    tags: ["플랫폼", "초봉형", "변동성", "IT"],
    officialUrl: "https://www.kakaocorp.com/",
    hiringUrl: "https://careers.kakao.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "sk-telecom",
    companyId: "sk-telecom",
    companyName: "SK텔레콤",
    industry: "platform",
    starterSalaryManwon: 5300,
    avgSalaryManwon: 16100,
    tenureYears: 13.7,
    growthType: "stable",
    year10BandLabel: "1.3억~1.5억",
    salaryBands: [
      { year: 1, min: 5150, mid: 5300, max: 5450 },
      { year: 3, min: 6100, mid: 6500, max: 6900 },
      { year: 5, min: 7400, mid: 7900, max: 8500 },
      { year: 7, min: 9800, mid: 10700, max: 11600 },
      { year: 10, min: 13000, mid: 14100, max: 15200 },
      { year: 12, min: 14200, mid: 15200, max: 16200 },
      { year: 15, min: 15000, mid: 16100, max: 17200 },
    ],
    summary: "초반 급등형보다는 긴 호흡으로 누적되는 안정형 통신 대기업에 가깝습니다.",
    tags: ["통신", "안정형", "장기 보상", "상단 연봉"],
    officialUrl: "https://www.sktelecom.com/",
    hiringUrl: "https://careers.sktelecom.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "samsung-sds",
    companyId: "samsung-sds",
    companyName: "삼성SDS",
    industry: "itService",
    starterSalaryManwon: 5500,
    avgSalaryManwon: 13800,
    tenureYears: 17.2,
    growthType: "stable",
    year10BandLabel: "1.2억~1.35억",
    salaryBands: [
      { year: 1, min: 5300, mid: 5500, max: 5700 },
      { year: 3, min: 6200, mid: 6700, max: 7200 },
      { year: 5, min: 7500, mid: 8000, max: 8600 },
      { year: 7, min: 9300, mid: 10100, max: 10900 },
      { year: 10, min: 12000, mid: 12800, max: 13500 },
      { year: 12, min: 12600, mid: 13400, max: 14200 },
      { year: 15, min: 13300, mid: 14100, max: 15000 },
    ],
    summary: "대형 SI 특유의 안정적인 성장곡선을 갖고 있어 중장기 누적 상승이 예측 가능한 편입니다.",
    tags: ["IT서비스", "안정형", "삼성", "대형 SI"],
    officialUrl: "https://www.samsungsds.com/kr/index.html",
    hiringUrl: "https://www.samsungsds.com/kr/careers/careers.html",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "lg-cns",
    companyId: "lg-cns",
    companyName: "LG CNS",
    industry: "itService",
    starterSalaryManwon: 5200,
    avgSalaryManwon: 11600,
    tenureYears: 12.9,
    growthType: "stable",
    year10BandLabel: "1.0억~1.2억",
    salaryBands: [
      { year: 1, min: 5000, mid: 5200, max: 5400 },
      { year: 3, min: 5800, mid: 6200, max: 6600 },
      { year: 5, min: 7000, mid: 7500, max: 8000 },
      { year: 7, min: 8400, mid: 9100, max: 9800 },
      { year: 10, min: 10200, mid: 11100, max: 12000 },
      { year: 12, min: 10900, mid: 11700, max: 12600 },
      { year: 15, min: 11600, mid: 12400, max: 13300 },
    ],
    summary: "AX·클라우드 축이 강하지만 전반 흐름은 안정적으로 고르게 오르는 편입니다.",
    tags: ["IT서비스", "안정형", "AX", "대형 SI"],
    officialUrl: "https://www.lgcns.com/",
    hiringUrl: "https://www.lgcns.com/careers/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "hyundai-autoever",
    companyId: "hyundai-autoever",
    companyName: "현대오토에버",
    industry: "itService",
    starterSalaryManwon: 5070,
    avgSalaryManwon: 10100,
    tenureYears: 6.5,
    growthType: "starterFast",
    year10BandLabel: "0.95억~1.1억",
    salaryBands: [
      { year: 1, min: 4900, mid: 5070, max: 5250 },
      { year: 3, min: 5900, mid: 6400, max: 6900 },
      { year: 5, min: 7200, mid: 7800, max: 8400 },
      { year: 7, min: 8200, mid: 8900, max: 9600 },
      { year: 10, min: 9500, mid: 10300, max: 11000 },
      { year: 12, min: 9900, mid: 10700, max: 11500 },
      { year: 15, min: 10300, mid: 11100, max: 12000 },
    ],
    summary: "모빌리티·SDV 투자 흐름을 반영해 초반 성장 체감이 빠른 초봉형 IT서비스 기업입니다.",
    tags: ["IT서비스", "초봉형", "모빌리티", "현대차그룹"],
    officialUrl: "https://www.hyundai-autoever.com/",
    hiringUrl: "https://recruit.hyundai-autoever.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "lg-electronics",
    companyId: "lg-electronics",
    companyName: "LG전자",
    industry: "electronics",
    starterSalaryManwon: 5300,
    avgSalaryManwon: 11700,
    tenureYears: 13.8,
    growthType: "stable",
    year10BandLabel: "1.0억~1.15억",
    salaryBands: [
      { year: 1, min: 5150, mid: 5300, max: 5450 },
      { year: 3, min: 5900, mid: 6250, max: 6600 },
      { year: 5, min: 7100, mid: 7600, max: 8100 },
      { year: 7, min: 8500, mid: 9200, max: 9900 },
      { year: 10, min: 10200, mid: 10900, max: 11600 },
      { year: 12, min: 10900, mid: 11600, max: 12300 },
      { year: 15, min: 11500, mid: 12200, max: 13000 },
    ],
    summary: "전자·제조 대기업 중에서 가장 전형적인 안정형 성장 패턴으로 읽히는 편입니다.",
    tags: ["전자", "안정형", "제조", "LG"],
    officialUrl: "https://www.lge.co.kr/",
    hiringUrl: "https://careers.lg.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "posco-holdings",
    companyId: "posco-holdings",
    companyName: "포스코홀딩스",
    industry: "electronics",
    starterSalaryManwon: 5073,
    avgSalaryManwon: 14700,
    tenureYears: 12.6,
    growthType: "stable",
    year10BandLabel: "1.2억~1.4억",
    salaryBands: [
      { year: 1, min: 4900, mid: 5073, max: 5250 },
      { year: 3, min: 5800, mid: 6200, max: 6600 },
      { year: 5, min: 7200, mid: 7800, max: 8400 },
      { year: 7, min: 9400, mid: 10200, max: 11000 },
      { year: 10, min: 12000, mid: 13000, max: 14000 },
      { year: 12, min: 12900, mid: 13800, max: 14700 },
      { year: 15, min: 13600, mid: 14500, max: 15400 },
    ],
    summary: "제조·소재 업종 특성상 중간 이후 안정적으로 올라가는 전형적인 안정형 고연봉 그룹입니다.",
    tags: ["소재", "안정형", "고연봉", "제조"],
    officialUrl: "https://www.posco-inc.com/",
    hiringUrl: "https://gorecruit.posco.co.kr/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "hyundai-engineering-construction",
    companyId: "hyundai-engineering-construction",
    companyName: "현대건설",
    industry: "construction",
    starterSalaryManwon: 4939,
    avgSalaryManwon: 10900,
    tenureYears: 13.6,
    growthType: "stable",
    year10BandLabel: "0.95억~1.1억",
    salaryBands: [
      { year: 1, min: 4800, mid: 4939, max: 5100 },
      { year: 3, min: 5500, mid: 5900, max: 6300 },
      { year: 5, min: 6700, mid: 7200, max: 7700 },
      { year: 7, min: 8100, mid: 8800, max: 9500 },
      { year: 10, min: 9500, mid: 10300, max: 11000 },
      { year: 12, min: 10100, mid: 10800, max: 11600 },
      { year: 15, min: 10700, mid: 11500, max: 12300 },
    ],
    summary: "건설업 경기와 프로젝트 영향을 받지만 장기적으로는 안정형 건설사 패턴에 가깝습니다.",
    tags: ["건설", "안정형", "프로젝트", "대형사"],
    officialUrl: "https://www.hdec.kr/",
    hiringUrl: "https://recruit.hdec.kr/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
  {
    slug: "korean-air",
    companyId: "korean-air",
    companyName: "대한항공",
    industry: "airline",
    starterSalaryManwon: 4062,
    avgSalaryManwon: 12300,
    tenureYears: 18.4,
    growthType: "longTenure",
    year10BandLabel: "1.0억~1.15억",
    salaryBands: [
      { year: 1, min: 3900, mid: 4062, max: 4250 },
      { year: 3, min: 4700, mid: 5100, max: 5500 },
      { year: 5, min: 5900, mid: 6500, max: 7100 },
      { year: 7, min: 7600, mid: 8400, max: 9200 },
      { year: 10, min: 10000, mid: 10800, max: 11600 },
      { year: 12, min: 11000, mid: 11800, max: 12600 },
      { year: 15, min: 11800, mid: 12600, max: 13400 },
    ],
    summary: "초봉은 낮아 보여도 근속이 길고 중후반 누적 구간이 강한 장기근속형 구조로 보는 편이 맞습니다.",
    tags: ["항공", "장기근속형", "근속연수 상위", "운항업"],
    officialUrl: "https://www.koreanair.com/",
    hiringUrl: "https://recruit.koreanair.com/",
    infoUrl: "https://www.catch.co.kr/",
    updatedAt: "2026-04-01",
  },
];

export const largeCompanySalaryGrowthByYears2026: LargeCompanySalaryGrowthByYears2026Data = {
  meta: {
    slug: "large-company-salary-growth-by-years-2026",
    title: "2026 대기업 연차별 연봉 성장 비교",
    subtitle:
      "주요 대기업 15개사의 공개 평균연봉, 초봉, 근속연수를 바탕으로 1년차·5년차·10년차·15년차 성장 흐름을 비교하는 인터랙티브 리포트입니다.",
    methodology:
      "공개 평균연봉, 초봉, 근속연수 기준값을 바탕으로 비교계산소 리포트용 표준화 성장 밴드 모델을 구성했습니다.",
    caution:
      "연차별 밴드는 실제 공시 확정값이 아니라 참고용 추정치입니다. 직무, 직군, 평가, 성과급, 사업부에 따라 개인별 차이가 큽니다.",
    updatedAt: "2026년 4월 기준",
  },
  entries,
  typeCards: [
    {
      type: "starterFast",
      title: "초봉형",
      body: "입사 초반 보상 체감이 빠르고 5년차까지 존재감이 큰 유형입니다. 플랫폼·모빌리티 계열에 자주 보입니다.",
      companies: ["네이버", "카카오", "현대오토에버"],
    },
    {
      type: "stable",
      title: "안정형",
      body: "전 구간이 고르게 올라가며 평균연봉과 장기 체감이 함께 유지되는 유형입니다. 제조·통신·대형 SI에서 자주 보입니다.",
      companies: ["SK텔레콤", "삼성SDS", "LG전자"],
    },
    {
      type: "longTenure",
      title: "장기근속형",
      body: "초반보다 10년차 이후 체감이 강한 유형입니다. 제조·항공처럼 근속 구조가 긴 업종에 많이 나타납니다.",
      companies: ["현대자동차", "기아", "대한항공"],
    },
    {
      type: "performanceHeavy",
      title: "성과급형",
      body: "평균연봉 상단과 밴드 폭이 함께 커지는 유형입니다. 업황과 성과급 민감도가 높아 상방 체감이 큽니다.",
      companies: ["삼성전자", "SK하이닉스"],
    },
  ],
  patternPoints: [
    {
      title: "초봉 순위와 10년차 순위는 다를 수 있습니다",
      body: "플랫폼형 기업은 초반 체감이 빠르지만, 제조·통신·반도체 대기업은 10년차 이후 누적 차이가 더 크게 벌어질 수 있습니다.",
    },
    {
      title: "평균연봉이 높아도 성장 방식은 서로 다릅니다",
      body: "성과급형은 상단 밴드 폭이 넓고, 안정형은 구간별 예측 가능성이 높으며, 장기근속형은 중후반 누적 상승이 강한 편입니다.",
    },
    {
      title: "내 연봉 비교는 계산기로 이어져야 의미가 완성됩니다",
      body: "이 페이지는 시장 흐름을 읽는 리포트이고, 실제 이직 체감과 인상 체감은 연봉 인상 계산기와 이직 계산기로 이어져야 더 정확합니다.",
    },
  ],
  faq: [
    {
      q: "연차별 연봉 수치는 실제 공시 수치인가요?",
      a: "아닙니다. 회사별로 동일 형식의 연차별 연봉을 공시하지 않기 때문에, 이 페이지의 수치는 공개 평균연봉, 초봉, 근속연수 기준을 활용한 표준화 추정 밴드입니다.",
    },
    {
      q: "평균연봉이 높은 회사가 무조건 좋은 회사인가요?",
      a: "그렇지 않습니다. 근속 구조, 성과급 비중, 업종 변동성, 직군 차이에 따라 체감은 크게 달라질 수 있습니다. 이 페이지는 그 차이를 읽기 쉽게 비교하는 것이 목적입니다.",
    },
    {
      q: "플랫폼 회사와 제조 대기업을 직접 비교해도 되나요?",
      a: "가능하지만 성장 방식이 다르다는 전제를 두고 읽는 편이 안전합니다. 플랫폼은 초반, 제조와 통신은 중후반 누적 체감이 강한 경우가 많습니다.",
    },
    {
      q: "내 연봉과 비교하려면 어디를 보면 되나요?",
      a: "상단 차트로 시장 흐름을 읽고, 중단 벤치마크 패널에서 내 연봉을 넣어 유사 기업과 겹치는 구간을 확인하면 됩니다.",
    },
  ],
  referenceLinks: {
    official: [
      { label: "삼성전자 공식 사이트", href: "https://www.samsung.com/sec/" },
      { label: "네이버 공식 사이트", href: "https://www.navercorp.com/" },
      { label: "현대자동차 공식 사이트", href: "https://www.hyundai.com/" },
      { label: "삼성SDS 공식 사이트", href: "https://www.samsungsds.com/kr/index.html" },
    ],
    hiring: [
      { label: "삼성 커리어스", href: "https://www.samsungcareers.com/" },
      { label: "네이버 채용", href: "https://recruit.navercorp.com/" },
      { label: "현대자동차 채용", href: "https://talent.hyundai.com/" },
      { label: "현대오토에버 채용", href: "https://recruit.hyundai-autoever.com/" },
    ],
    info: [
      { label: "기업 정보 비교 - 캐치", href: "https://www.catch.co.kr/" },
      { label: "전자공시시스템 DART", href: "https://dart.fss.or.kr/" },
      { label: "사업보고서 / IR 자료 재확인", href: "https://kind.krx.co.kr/" },
    ],
  },
  relatedLinks: [
    { label: "연봉 티어 계산기", href: "/tools/salary-tier/", kind: "tool" },
    { label: "연봉 인상 계산기", href: "/tools/negotiation/", kind: "tool" },
    { label: "이직 계산기", href: "/tools/salary/", kind: "tool" },
    { label: "2026 신입사원 초봉 비교 리포트", href: "/reports/new-employee-salary-2026/", kind: "report" },
    { label: "IT SI·SM 대기업 평균 연봉 비교", href: "/reports/it-si-sm-salary-comparison-2026/", kind: "report" },
  ],
};
