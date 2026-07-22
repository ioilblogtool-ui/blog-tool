export type FounderType = "founder" | "cofounder" | "operator" | "investor";
export type EducationType = "degree" | "dropout" | "graduate-study" | "mixed";
export type WealthAccumulationType =
  | "founder-equity"
  | "cofounder-platform"
  | "executive-equity"
  | "investment-compound"
  | "family-expansion";

export type ProfileImage = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sourceName: string;
  sourceUrl: string;
  licenseLabel: string;
  licenseUrl?: string;
};

export type WealthProfile = {
  id: string;
  rank: number;
  name: string;
  netWorthDisplay: string;
  netWorthUsdB: number;
  companies: string[];
  primaryCompany: string;
  sector: string;
  education: string[];
  educationType: EducationType;
  founderType: FounderType;
  selfMadeStyle: WealthAccumulationType;
  wealthSource: string;
  wealthDriver: string;
  personalityTags: string[];
  summary: string;
  highlights: string[];
  image?: ProfileImage;
};

export type DistributionItem = {
  label: string;
  count: number;
};

export type PatternSummary = {
  title: string;
  body: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const reportMeta = {
  slug: "us-rich-top10-patterns",
  title: "세계 부자 순위 2026 | 자산·성공 패턴 비교",
  description:
    "세계 부자 TOP 10을 선택하면 추정 자산, 대표 기업, 학력, 성공 패턴을 바로 확인. 원화 환산과 생활 단위 비교, 자산 원천 정리까지 포함."
};

export const dataMeta = {
  asOfDate: "2026-07-20",
  asOfDateDisplay: "2026년 7월 20일",
  sourceName: "Forbes Real-Time Billionaires",
  sourceUrl: "https://www.forbes.com/real-time-billionaires/",
  usdToKrw: 1500,
  assetNote: "추정 순자산 (상장·비상장 지분, 부동산 등에서 부채를 뺀 값)"
};

export const cautionNotes = [
  "자산과 순위는 Forbes Real-Time Billionaires 기준이며, 주가와 비상장기업 가치평가에 따라 수시로 달라질 수 있습니다.",
  "성향 태그와 성공 패턴은 공개 행보를 바탕으로 한 해석이며, 절대적인 성공 공식이 아닙니다."
];

export const wealthProfiles: WealthProfile[] = [
  {
    id: "elon-musk",
    rank: 1,
    name: "Elon Musk",
    netWorthDisplay: "$797.6B",
    netWorthUsdB: 797.6,
    companies: ["Tesla", "SpaceX", "xAI"],
    primaryCompany: "Tesla / SpaceX / xAI",
    sector: "전기차 · 우주 · AI",
    education: ["University of Pennsylvania"],
    educationType: "degree",
    founderType: "founder",
    selfMadeStyle: "founder-equity",
    wealthSource: "SpaceX · Tesla · xAI 지분",
    wealthDriver: "비상장기업 가치평가, Tesla 주가 변동",
    personalityTags: ["제품집착형", "기술집중형", "리스크테이커형"],
    summary: "여러 산업에서 제품과 인프라를 동시에 확장하며 지분을 오래 보유한 창업형 사례입니다.",
    highlights: ["창업 후 지분 장기 보유", "기술·제조·플랫폼 결합", "고위험 고성장 베팅 반복"],
    image: {
      src: "/images/reports/us-rich-top10/elon-musk.jpg",
      fallbackSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Elon_Musk_2025_(cropped).jpg?width=720",
      alt: "Elon Musk portrait",
      sourceName: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Elon_Musk_2025_(cropped).jpg",
      licenseLabel: "파일 페이지 라이선스 참고"
    }
  },
  {
    id: "larry-page",
    rank: 2,
    name: "Larry Page",
    netWorthDisplay: "$284.3B",
    netWorthUsdB: 284.3,
    companies: ["Alphabet"],
    primaryCompany: "Alphabet",
    sector: "검색 · 플랫폼",
    education: ["University of Michigan", "Stanford graduate studies"],
    educationType: "graduate-study",
    founderType: "cofounder",
    selfMadeStyle: "cofounder-platform",
    wealthSource: "Alphabet(구글) 지분",
    wealthDriver: "Alphabet 주가, 검색광고·AI 사업 성장 기대",
    personalityTags: ["기술집중형", "플랫폼 확장형", "제품집착형"],
    summary: "공동창업한 검색 플랫폼을 AI 시대 핵심 자산으로 키운 공동창업자 사례입니다.",
    highlights: ["공동창업 구조로 지분 장기 보유", "검색·광고에서 AI로 사업 확장", "플랫폼 네트워크 효과 극대화"]
  },
  {
    id: "sergey-brin",
    rank: 3,
    name: "Sergey Brin",
    netWorthDisplay: "$262.3B",
    netWorthUsdB: 262.3,
    companies: ["Alphabet"],
    primaryCompany: "Alphabet",
    sector: "검색 · 플랫폼",
    education: ["University of Maryland", "Stanford graduate studies"],
    educationType: "graduate-study",
    founderType: "cofounder",
    selfMadeStyle: "cofounder-platform",
    wealthSource: "Alphabet(구글) 지분",
    wealthDriver: "Alphabet 주가 변동",
    personalityTags: ["기술집중형", "공동창업형", "장기보유형"],
    summary: "공동창업 이후 핵심 지분을 오래 보유한 기술 창업자 사례입니다.",
    highlights: ["공동창업자 구조", "장기 지분 보유", "기술 기반 성장"]
  },
  {
    id: "jeff-bezos",
    rank: 4,
    name: "Jeff Bezos",
    netWorthDisplay: "$256.6B",
    netWorthUsdB: 256.6,
    companies: ["Amazon"],
    primaryCompany: "Amazon",
    sector: "전자상거래 · 클라우드",
    education: ["Princeton"],
    educationType: "degree",
    founderType: "founder",
    selfMadeStyle: "founder-equity",
    wealthSource: "Amazon 지분",
    wealthDriver: "Amazon 주가, 보유 주식 매각",
    personalityTags: ["장기복리형", "플랫폼 확장형", "운영형"],
    summary: "유통에서 시작해 클라우드와 플랫폼으로 확장하며 복합 사업 구조를 만든 사례입니다.",
    highlights: ["장기 투자 기조", "전자상거래 + 클라우드", "운영 효율 극대화"],
    image: {
      src: "/images/reports/us-rich-top10/jeff-bezos.jpg",
      fallbackSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeff_Bezos_(153327601).jpg?width=720",
      alt: "Jeff Bezos portrait",
      sourceName: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jeff_Bezos_(153327601).jpg",
      licenseLabel: "파일 페이지 라이선스 참고"
    }
  },
  {
    id: "michael-dell",
    rank: 5,
    name: "Michael Dell",
    netWorthDisplay: "$223.2B",
    netWorthUsdB: 223.2,
    companies: ["Dell Technologies"],
    primaryCompany: "Dell Technologies",
    sector: "하드웨어 · 인프라",
    education: ["University of Texas at Austin"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "founder-equity",
    wealthSource: "Dell Technologies 지분",
    wealthDriver: "AI 서버·인프라 수요 확대에 따른 주가 상승",
    personalityTags: ["운영형", "제품집착형", "장기보유형"],
    summary: "하드웨어 기업을 직접 창업하고 오랜 기간 지분과 경영을 유지한 사례입니다.",
    highlights: ["하드웨어 창업", "중퇴 후 창업", "AI 서버 수요로 최근 자산 급증"]
  },
  {
    id: "mark-zuckerberg",
    rank: 6,
    name: "Mark Zuckerberg",
    netWorthDisplay: "$221.6B",
    netWorthUsdB: 221.6,
    companies: ["Meta"],
    primaryCompany: "Meta",
    sector: "소셜 플랫폼",
    education: ["Harvard"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "founder-equity",
    wealthSource: "Meta 지분",
    wealthDriver: "광고 사업 성장, AI 투자 확대에 따른 주가 변동",
    personalityTags: ["플랫폼 확장형", "제품집착형", "리스크테이커형"],
    summary: "플랫폼 네트워크 효과를 극대화하고 대규모 투자 방향을 직접 주도한 창업형 사례입니다.",
    highlights: ["네트워크 효과 극대화", "플랫폼 장악력", "장기 대형 투자"],
    image: {
      src: "/images/reports/us-rich-top10/mark-zuckerberg.jpg",
      fallbackSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Mark_Zuckerberg_(2025).jpg?width=720",
      alt: "Mark Zuckerberg portrait",
      sourceName: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mark_Zuckerberg_(2025).jpg",
      licenseLabel: "파일 페이지 라이선스 참고"
    }
  },
  {
    id: "jensen-huang",
    rank: 7,
    name: "Jensen Huang",
    netWorthDisplay: "$175.4B",
    netWorthUsdB: 175.4,
    companies: ["Nvidia"],
    primaryCompany: "Nvidia",
    sector: "반도체 · AI 인프라",
    education: ["Oregon State", "Stanford"],
    educationType: "degree",
    founderType: "cofounder",
    selfMadeStyle: "cofounder-platform",
    wealthSource: "Nvidia 지분",
    wealthDriver: "AI 반도체 수요 급증에 따른 주가 상승",
    personalityTags: ["기술집중형", "제품집착형", "장기복리형"],
    summary: "반도체와 AI 인프라 수요를 장기간 연결한 공동창업자 사례입니다.",
    highlights: ["반도체 집중", "AI 인프라 수혜", "장기 복리 성장"]
  },
  {
    id: "larry-ellison",
    rank: 8,
    name: "Larry Ellison",
    netWorthDisplay: "$167.0B",
    netWorthUsdB: 167.0,
    companies: ["Oracle"],
    primaryCompany: "Oracle",
    sector: "소프트웨어",
    education: ["University of Illinois Urbana-Champaign", "University of Chicago"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "founder-equity",
    wealthSource: "Oracle 지분",
    wealthDriver: "클라우드·AI 데이터센터 수요 확대",
    personalityTags: ["플랫폼 확장형", "운영형", "장기보유형"],
    summary: "엔터프라이즈 소프트웨어 시장을 장기간 지배하며 지분과 영향력을 함께 유지한 사례입니다.",
    highlights: ["B2B 소프트웨어 집중", "오랜 기간 지분 보유", "플랫폼 지배력 구축"],
    image: {
      src: "/images/reports/us-rich-top10/larry-ellison.png",
      fallbackSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Larry_Ellison_picture.png?width=720",
      alt: "Larry Ellison portrait",
      sourceName: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Larry_Ellison_picture.png",
      licenseLabel: "파일 페이지 라이선스 참고"
    }
  },
  {
    id: "bernard-arnault",
    rank: 9,
    name: "Bernard Arnault",
    netWorthDisplay: "$151.4B",
    netWorthUsdB: 151.4,
    companies: ["LVMH"],
    primaryCompany: "LVMH",
    sector: "명품 · 소비재",
    education: ["École Polytechnique"],
    educationType: "degree",
    founderType: "operator",
    selfMadeStyle: "family-expansion",
    wealthSource: "LVMH 등 명품 브랜드 그룹 지분",
    wealthDriver: "글로벌 명품 소비 동향과 LVMH 주가",
    personalityTags: ["가업 확장형", "브랜드 인수형", "장기보유형"],
    summary: "가족 기업을 발판으로 다수의 명품 브랜드를 인수·통합해 세계 최대 명품 그룹을 만든 가업 확장형 사례입니다.",
    highlights: ["가족 기업에서 사업 확장", "다수 명품 브랜드 인수·통합", "장기간 그룹 지배력 유지"]
  },
  {
    id: "warren-buffett",
    rank: 10,
    name: "Warren Buffett",
    netWorthDisplay: "$139.3B",
    netWorthUsdB: 139.3,
    companies: ["Berkshire Hathaway"],
    primaryCompany: "Berkshire Hathaway",
    sector: "투자 · 보험",
    education: ["University of Nebraska", "Columbia"],
    educationType: "degree",
    founderType: "investor",
    selfMadeStyle: "investment-compound",
    wealthSource: "Berkshire Hathaway 지분",
    wealthDriver: "보험·주식 포트폴리오 장기 운용 성과",
    personalityTags: ["투자형", "장기복리형", "보수형"],
    summary: "투자와 자본 배분을 통해 자산을 장기간 복리로 키운 대표 사례입니다.",
    highlights: ["장기 복리 투자", "자본 배분 중심", "투자형 부자 대표"]
  }
];

export const sectorSummary: DistributionItem[] = [
  { label: "기술/플랫폼", count: 6 },
  { label: "소프트웨어", count: 1 },
  { label: "하드웨어/인프라", count: 1 },
  { label: "명품/소비재", count: 1 },
  { label: "투자/보험", count: 1 }
];

export const educationSummary: DistributionItem[] = [
  { label: "학위 보유 중심", count: 5 },
  { label: "중퇴 사례", count: 3 },
  { label: "대학원 과정 경험", count: 2 }
];

export const founderTypeSummary: DistributionItem[] = [
  { label: "Founder", count: 5 },
  { label: "Cofounder", count: 3 },
  { label: "Operator", count: 1 },
  { label: "Investor", count: 1 }
];

export const commonPatterns: PatternSummary[] = [
  {
    title: "기술 업종 집중",
    body: "최신 상위권에는 검색 플랫폼, 전자상거래, 반도체, 하드웨어, AI 인프라처럼 확장성이 큰 기술 기업 창업자가 다수 포함됩니다. 다만 Warren Buffett의 투자·보험, Bernard Arnault의 명품 소비재처럼 기술 기업이 아닌 사례도 있습니다."
  },
  {
    title: "창업자·공동창업자 우세",
    body: "상위권 대부분은 높은 연봉이 아니라 자신이 설립하거나 성장시킨 기업의 지분을 장기간 보유해 자산을 키웠습니다. 기업가치가 수십~수백 배로 커지며 보유 지분 가치도 함께 늘어난 구조입니다."
  },
  {
    title: "장기 지분 보유",
    body: "공통점은 단순 장기투자가 아니라 경영권이나 영향력을 유지할 정도의 핵심 지분을 오래 보유했다는 점입니다. 다만 세금 납부, 자선 활동, 포트폴리오 조정을 위해 일부 지분을 매각한 사례도 많습니다."
  },
  {
    title: "공학·수학 배경 다수",
    body: "공학·컴퓨터·수학 친화적 배경이 자주 보이지만 학력 자체가 성공의 원인이라 보기는 어렵습니다. 명문대 졸업자와 중퇴자가 함께 존재하며, 창업 시점과 시장 규모, 지분율이 자산 형성에 더 직접적인 영향을 미쳤습니다."
  }
];

export const faqItems: FaqItem[] = [
  {
    question: "세계 부자 TOP 10은 어떤 기준으로 정리하나요?",
    answer: "Forbes Real-Time Billionaires의 공개 자산 순위와 대표 회사, 업종, 학력, 창업 배경을 기준으로 정리합니다."
  },
  {
    question: "자산 순위는 왜 매일 바뀌나요?",
    answer: "대부분의 자산이 현금이 아니라 상장·비상장 기업 지분으로 구성되어 있기 때문입니다. 주가, 환율, 비상장기업 가치평가가 바뀌면 추정 순자산도 함께 바뀝니다."
  },
  {
    question: "자산 금액을 실제 현금으로 보유하고 있나요?",
    answer: "아닙니다. 순자산은 보유 주식과 비상장기업 지분, 부동산 등 자산에서 부채를 뺀 추정치이며, 한 번에 현금화하기는 어렵습니다."
  },
  {
    question: "학력이 성공을 결정하나요?",
    answer: "단순히 그렇게 보긴 어렵지만 공학·수학·컴퓨터 계열 배경이 자주 보이는 패턴은 있습니다."
  },
  {
    question: "창업형과 투자형은 어떻게 다른가요?",
    answer: "창업형은 회사를 직접 만들거나 공동창업해 지분을 보유한 경우이고, 투자형은 자본 배분과 장기 투자 성과를 중심으로 자산을 키운 경우를 뜻합니다."
  }
];
