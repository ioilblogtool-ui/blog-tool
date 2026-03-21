export type FounderType = "founder" | "cofounder" | "operator" | "investor";
export type EducationType = "degree" | "dropout" | "graduate-study" | "mixed";
export type MbtiConfidence = "low" | "medium";

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
  selfMadeStyle: "startup" | "ownership" | "investment" | "mixed";
  personalityTags: string[];
  mbtiEstimate?: string;
  mbtiConfidence?: MbtiConfidence;
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
  title: "미국 부자 TOP 10 성공 패턴 리포트",
  description:
    "미국 부자 TOP 10의 자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트"
};

export const cautionNotes = [
  "MBTI는 공식 공개가 아닌 경우가 많아 참고용 추정으로만 제공합니다.",
  "자산·학력·업종 정보는 공개 프로필과 보도 자료를 기준으로 정리했습니다."
];

export const wealthProfiles: WealthProfile[] = [
  {
    id: "elon-musk",
    rank: 1,
    name: "Elon Musk",
    netWorthDisplay: "$428B",
    netWorthUsdB: 428,
    companies: ["Tesla", "SpaceX", "xAI"],
    primaryCompany: "Tesla / SpaceX / xAI",
    sector: "전기차 · 우주 · AI",
    education: ["University of Pennsylvania"],
    educationType: "degree",
    founderType: "founder",
    selfMadeStyle: "startup",
    personalityTags: ["제품집착형", "기술집중형", "리스크테이커형"],
    mbtiEstimate: "INTJ",
    mbtiConfidence: "low",
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
    id: "larry-ellison",
    rank: 2,
    name: "Larry Ellison",
    netWorthDisplay: "$276B",
    netWorthUsdB: 276,
    companies: ["Oracle"],
    primaryCompany: "Oracle",
    sector: "소프트웨어",
    education: ["University of Illinois Urbana-Champaign", "University of Chicago"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "ownership",
    personalityTags: ["플랫폼 확장형", "운영형", "장기보유형"],
    mbtiEstimate: "ENTJ",
    mbtiConfidence: "low",
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
    id: "mark-zuckerberg",
    rank: 3,
    name: "Mark Zuckerberg",
    netWorthDisplay: "$253B",
    netWorthUsdB: 253,
    companies: ["Meta"],
    primaryCompany: "Meta",
    sector: "소셜 플랫폼",
    education: ["Harvard"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "startup",
    personalityTags: ["플랫폼 확장형", "제품집착형", "리스크테이커형"],
    mbtiEstimate: "INTJ",
    mbtiConfidence: "low",
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
    id: "jeff-bezos",
    rank: 4,
    name: "Jeff Bezos",
    netWorthDisplay: "$241B",
    netWorthUsdB: 241,
    companies: ["Amazon"],
    primaryCompany: "Amazon",
    sector: "전자상거래 · 클라우드",
    education: ["Princeton"],
    educationType: "degree",
    founderType: "founder",
    selfMadeStyle: "startup",
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
    id: "larry-page",
    rank: 5,
    name: "Larry Page",
    netWorthDisplay: "$179B",
    netWorthUsdB: 179,
    companies: ["Google"],
    primaryCompany: "Google",
    sector: "검색 · 플랫폼",
    education: ["University of Michigan", "Stanford graduate studies"],
    educationType: "graduate-study",
    founderType: "cofounder",
    selfMadeStyle: "startup",
    personalityTags: ["기술집중형", "플랫폼 확장형", "제품집착형"],
    summary: "기술 기반 검색 플랫폼을 핵심 자산으로 키운 공동창업자 사례입니다.",
    highlights: ["검색 플랫폼 중심", "공동창업 구조", "기술 중심 성장"]
  },
  {
    id: "sergey-brin",
    rank: 6,
    name: "Sergey Brin",
    netWorthDisplay: "$166B",
    netWorthUsdB: 166,
    companies: ["Google"],
    primaryCompany: "Google",
    sector: "검색 · 플랫폼",
    education: ["University of Maryland", "Stanford graduate studies"],
    educationType: "graduate-study",
    founderType: "cofounder",
    selfMadeStyle: "startup",
    personalityTags: ["기술집중형", "공동창업형", "장기보유형"],
    summary: "공동창업 이후 핵심 지분을 오래 보유한 기술 창업자 사례입니다.",
    highlights: ["공동창업자 구조", "장기 지분 보유", "기술 기반 성장"]
  },
  {
    id: "steve-ballmer",
    rank: 7,
    name: "Steve Ballmer",
    netWorthDisplay: "$153B",
    netWorthUsdB: 153,
    companies: ["Microsoft"],
    primaryCompany: "Microsoft",
    sector: "소프트웨어",
    education: ["Harvard", "Stanford GSB"],
    educationType: "mixed",
    founderType: "operator",
    selfMadeStyle: "ownership",
    personalityTags: ["운영형", "장기보유형", "플랫폼 확장형"],
    summary: "창업자가 아니지만 대기업 운영 경험과 지분 보유를 통해 큰 자산을 만든 사례입니다.",
    highlights: ["운영형 부자", "창업자 외 사례", "장기 지분 효과"]
  },
  {
    id: "jensen-huang",
    rank: 8,
    name: "Jensen Huang",
    netWorthDisplay: "$151B",
    netWorthUsdB: 151,
    companies: ["Nvidia"],
    primaryCompany: "Nvidia",
    sector: "반도체 · AI 인프라",
    education: ["Oregon State", "Stanford"],
    educationType: "degree",
    founderType: "cofounder",
    selfMadeStyle: "startup",
    personalityTags: ["기술집중형", "제품집착형", "장기복리형"],
    summary: "반도체와 AI 인프라 수요를 장기간 연결한 공동창업자 사례입니다.",
    highlights: ["반도체 집중", "AI 인프라 수혜", "장기 복리 성장"]
  },
  {
    id: "warren-buffett",
    rank: 9,
    name: "Warren Buffett",
    netWorthDisplay: "$150B",
    netWorthUsdB: 150,
    companies: ["Berkshire Hathaway"],
    primaryCompany: "Berkshire Hathaway",
    sector: "투자 · 보험",
    education: ["University of Nebraska", "Columbia"],
    educationType: "degree",
    founderType: "investor",
    selfMadeStyle: "investment",
    personalityTags: ["투자형", "장기복리형", "보수형"],
    mbtiEstimate: "ISTJ",
    mbtiConfidence: "low",
    summary: "투자와 자본 배분을 통해 자산을 장기간 복리로 키운 대표 사례입니다.",
    highlights: ["장기 복리 투자", "자본 배분 중심", "투자형 부자 대표"]
  },
  {
    id: "michael-dell",
    rank: 10,
    name: "Michael Dell",
    netWorthDisplay: "$129B",
    netWorthUsdB: 129,
    companies: ["Dell Technologies"],
    primaryCompany: "Dell Technologies",
    sector: "하드웨어 · 인프라",
    education: ["University of Texas at Austin"],
    educationType: "dropout",
    founderType: "founder",
    selfMadeStyle: "startup",
    personalityTags: ["운영형", "제품집착형", "장기보유형"],
    summary: "하드웨어 기업을 직접 창업하고 오랜 기간 지분과 경영을 유지한 사례입니다.",
    highlights: ["하드웨어 창업", "중퇴 후 창업", "운영과 지분 동시 유지"]
  }
];

export const sectorSummary: DistributionItem[] = [
  { label: "기술/플랫폼", count: 7 },
  { label: "소프트웨어", count: 1 },
  { label: "투자/보험", count: 1 },
  { label: "하드웨어/인프라", count: 1 }
];

export const educationSummary: DistributionItem[] = [
  { label: "학위 보유 중심", count: 5 },
  { label: "중퇴 사례", count: 3 },
  { label: "대학원 과정 경험", count: 3 }
];

export const founderTypeSummary: DistributionItem[] = [
  { label: "Founder", count: 5 },
  { label: "Cofounder", count: 3 },
  { label: "Operator", count: 1 },
  { label: "Investor", count: 1 }
];

export const commonPatterns: PatternSummary[] = [
  { title: "기술 업종 집중", body: "TOP 10 대부분이 플랫폼, 소프트웨어, 반도체, 전기차처럼 기술 중심 산업에서 부를 만들었습니다." },
  { title: "창업자·공동창업자 우세", body: "직접 회사를 만든 사례가 많고, 단순 경영인보다 지분을 가진 창업형 인물이 두드러집니다." },
  { title: "장기 지분 보유", body: "부의 핵심은 연봉보다 지분 가치 상승이었고, 이를 장기간 유지한 패턴이 반복됩니다." },
  { title: "공학·수학 배경 다수", body: "공학, 컴퓨터, 수학 친화적 배경이 자주 보이지만 명문대 중퇴 사례도 적지 않습니다." }
];

export const faqItems: FaqItem[] = [
  { question: "미국 부자 TOP 10은 어떤 기준으로 정리하나요?", answer: "공개 자산 순위와 대표 회사, 업종, 학력, 창업 배경을 기준으로 정리합니다." },
  { question: "MBTI는 왜 참고용인가요?", answer: "공식 공개가 아닌 추정이 많아서 성향 참고 수준으로만 보는 것이 안전합니다." },
  { question: "학력이 성공을 결정하나요?", answer: "단순히 그렇게 보긴 어렵지만 공학·수학·컴퓨터 계열 배경이 자주 보이는 패턴은 있습니다." },
  { question: "창업형과 투자형은 어떻게 다른가요?", answer: "창업형은 회사를 직접 만들고 지분을 보유한 경우, 투자형은 자본 배분과 투자 성과 중심의 경우를 뜻합니다." }
];
