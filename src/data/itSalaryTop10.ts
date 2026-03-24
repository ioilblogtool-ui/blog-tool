export type ItCompanyEntry = {
  rank: number;
  slug: string;
  name: string;
  nameEn: string;
  category: string;       // "IT·플랫폼" | "IT·통신" | "IT·게임" | "IT·SI" 등
  baseKrwM: number;       // 기본급 기준 연봉 (만원)
  totalCompM: number;     // 성과급 포함 영끌 추정 (만원)
  monthlyNetKrwM: number; // 월 실수령 추정 (만원)
  highlights: string[];   // 핵심 강점 (최대 3개)
  benefits: string[];     // 복리후생
  pros: string[];
  cons: string[];
  summary: string;
  benefitScore: number;   // 복지 점수 /10
};

export type AffiliateProduct = {
  title: string;
  desc: string;
  tag: string;           // 예: "베스트셀러", "IT 필독"
  url: string;           // 쿠팡파트너스 링크 (플레이스홀더)
};

export const IT_TOP10_META = {
  title: "IT 업계 신입 초봉 TOP 10 — 연봉·복지 완벽 비교 [2026]",
  subtitle: "네이버·카카오·SK텔레콤·현대오토에버 등 주요 IT 기업 신입 연봉과 복지를 한눈에 비교하는 2026년 최신 리포트",
  methodology: "잡플래닛·블라인드 집계, 공개 채용 공고, 현직자 커뮤니티 기반 추정치입니다. 공식 자료가 아닙니다.",
  caution: "실제 연봉은 직군·부서·입사 시기에 따라 다를 수 있습니다. 모든 수치는 참고용 추정치입니다.",
  updatedAt: "2026년 3월 기준",
};

export const IT_TOP10: ItCompanyEntry[] = [
  {
    rank: 1,
    slug: "naver",
    name: "네이버",
    nameEn: "NAVER",
    category: "IT·플랫폼",
    baseKrwM: 7000,
    totalCompM: 9000,
    monthlyNetKrwM: 490,
    highlights: ["RSU(주식보상) 지급", "완전 자율 근무제", "국내 IT 최상위 기본급"],
    benefits: [
      "RSU·스톡옵션 제공",
      "완전 자율 선택 근무제",
      "선택적 복리후생 포인트",
      "사내 어린이집",
      "사내 헬스장·의료시설",
      "무제한 간식·식사 지원",
    ],
    pros: ["기본급 자체가 국내 IT 최상위", "자유로운 근무 문화", "RSU로 자산 증식 기회"],
    cons: ["경쟁 강도 높음", "성과 압박 존재", "조직 규모에 따른 관료화 일부"],
    summary: "국내 IT 플랫폼 1위. 기본급 7,000만 원에 RSU·성과급 합산 시 총보상은 9천만 원 이상으로, IT 업계 연봉 순위 1위를 다투는 기업입니다. 자율 근무와 복지 수준 모두 국내 최상위권입니다.",
    benefitScore: 9.5,
  },
  {
    rank: 2,
    slug: "sk-telecom",
    name: "SK텔레콤",
    nameEn: "SK Telecom",
    category: "IT·통신",
    baseKrwM: 6500,
    totalCompM: 8000,
    monthlyNetKrwM: 456,
    highlights: ["SK그룹 최상위 성과급 구조", "AI·양자 컴퓨팅 핵심 투자", "높은 안정성"],
    benefits: [
      "SK그룹 공동 복리후생",
      "우리사주 제도",
      "자녀 학자금 전액 지원",
      "의료비·건강검진 지원",
      "유연 근무제",
      "사내 식당·카페",
    ],
    pros: ["통신+IT 업계 최고 수준 처우", "대기업 안정성", "글로벌 AI 사업 확장 기회"],
    cons: ["통신 사업 특성상 야근 문화 일부 존재", "대기업 특유의 수직적 문화"],
    summary: "국내 통신·IT 1위 기업. 기본급 6,500만 원에 SK그룹 성과급 구조로 영끌 시 8,000만 원 이상. AI·클라우드 사업 확장으로 개발직군 처우가 꾸준히 개선되고 있습니다.",
    benefitScore: 9.0,
  },
  {
    rank: 3,
    slug: "hyundai-autoever",
    name: "현대오토에버",
    nameEn: "Hyundai AutoEver",
    category: "IT·SI",
    baseKrwM: 7000,
    totalCompM: 8000,
    monthlyNetKrwM: 490,
    highlights: ["현대차그룹 계열사 안정성", "기본급 7,000만 원", "모빌리티·SDV 핵심 역할"],
    benefits: [
      "현대차그룹 공동 복리후생",
      "자사차 구매 할인",
      "사내대출 저금리",
      "복지포인트 연 100만+ 지급",
      "사내 어린이집·의료실",
      "동호회 지원금",
    ],
    pros: ["그룹사 중 IT 직군 처우 최상위", "자동차+소프트웨어 융합 경험", "안정적 성장"],
    cons: ["그룹사 특성상 보수적 문화", "자동차 도메인에 한정될 수 있음"],
    summary: "현대차그룹 IT 계열사. SDV(소프트웨어 중심 자동차) 전환으로 IT 인재 처우가 급격히 개선됐습니다. 기본급 7,000만 원에 그룹사 성과급 포함 8,000만 원 이상 가능합니다.",
    benefitScore: 9.0,
  },
  {
    rank: 4,
    slug: "nexon",
    name: "넥슨",
    nameEn: "Nexon",
    category: "IT·게임",
    baseKrwM: 7000,
    totalCompM: 7500,
    monthlyNetKrwM: 490,
    highlights: ["게임사 최상위 기본급", "게임 성과급 존재", "글로벌 퍼블리셔"],
    benefits: [
      "게임 성과급(PI·PS)",
      "RSU 제공 (직군 따라)",
      "자유로운 근무 문화",
      "사내식당·카페",
      "개인개발비 지원",
      "오락 시설 지원",
    ],
    pros: ["게임사 중 기본급 최상위", "자유로운 개발 문화", "글로벌 게임 개발 경험"],
    cons: ["게임 흥행 의존 성과급 편차", "크런치 문화 일부 잔존"],
    summary: "국내 대형 게임사 중 기본급 최상위. 7,000만 원 기본급에 게임 출시·흥행 시 성과급이 더해집니다. 메이플스토리·던전앤파이터 등 글로벌 IP 보유로 안정적 수익 기반을 갖추고 있습니다.",
    benefitScore: 8.5,
  },
  {
    rank: 5,
    slug: "kt",
    name: "KT",
    nameEn: "KT",
    category: "IT·통신",
    baseKrwM: 7000,
    totalCompM: 7000,
    monthlyNetKrwM: 490,
    highlights: ["기본급 7,000만 원", "공기업 준하는 안정성", "클라우드·AI 전환 중"],
    benefits: [
      "통신 요금 직원 할인",
      "자녀 학자금 지원",
      "의료비·건강검진",
      "유연 근무제",
      "복지포인트",
      "사내 식당",
    ],
    pros: ["높은 고용 안정성", "기본급 수준이 상위권", "클라우드·AI 사업 성장 기회"],
    cons: ["통신사 특성상 보수적 조직 문화", "성과급 수준이 상대적으로 낮음"],
    summary: "국내 2위 통신사. AI·클라우드 전환으로 IT 직군 수요가 높아졌고, 기본급 7,000만 원에 안정적인 고용 환경을 제공합니다. 대기업 안정성을 원하는 IT 취업 준비생에게 인기 높은 기업입니다.",
    benefitScore: 8.5,
  },
  {
    rank: 6,
    slug: "lg-uplus",
    name: "LG유플러스",
    nameEn: "LG U+",
    category: "IT·통신",
    baseKrwM: 7000,
    totalCompM: 7000,
    monthlyNetKrwM: 490,
    highlights: ["LG그룹 복리후생", "기본급 7,000만 원", "AI·구독 서비스 전환 적극"],
    benefits: [
      "LG그룹 공동 복리후생",
      "통신 요금 무료 제공",
      "자녀 학자금",
      "의료비 지원",
      "사내 식당",
      "동호회 활동비",
    ],
    pros: ["LG그룹 계열사 안정성", "기본급 수준 양호", "구독 서비스 성장 중"],
    cons: ["통신 3사 중 상대적으로 규모 작음", "성과급 편차 있음"],
    summary: "LG그룹 통신·IT 계열사. 기본급 7,000만 원에 LG그룹 공동 복리후생을 받을 수 있습니다. IPTV·구독 서비스·AI 사업 확대로 IT 인재 채용이 꾸준히 이뤄지고 있습니다.",
    benefitScore: 8.5,
  },
  {
    rank: 7,
    slug: "kakao",
    name: "카카오",
    nameEn: "Kakao",
    category: "IT·플랫폼",
    baseKrwM: 6500,
    totalCompM: 6500,
    monthlyNetKrwM: 456,
    highlights: ["국민 메신저 플랫폼", "IT 문화 선도", "스톡옵션·RSU 기회"],
    benefits: [
      "스톡옵션·RSU (직군 따라)",
      "자율 재택 근무",
      "선택적 복리후생",
      "사내 식당·카페",
      "개인 도서비 지원",
      "어린이집 지원",
    ],
    pros: ["자유로운 수평적 조직 문화", "국내 최대 모바일 플랫폼 경험", "재택 근무 활성화"],
    cons: ["2024년 구조조정 이후 성과급 보수적", "카카오 계열사 분리로 불확실성 증가"],
    summary: "국민 메신저 카카오톡 운영사. 2024년 이후 조직 슬림화를 거쳐 안정화 중. 기본급 6,500만 원에 수평적 문화와 유연한 근무 방식이 강점입니다. 스톡옵션·RSU 기회도 존재합니다.",
    benefitScore: 8.0,
  },
  {
    rank: 8,
    slug: "lg-cns",
    name: "LG CNS",
    nameEn: "LG CNS",
    category: "IT·SI",
    baseKrwM: 6500,
    totalCompM: 7000,
    monthlyNetKrwM: 456,
    highlights: ["LG그룹 전산 계열사", "클라우드·DX 컨설팅 성장", "안정적 수익 구조"],
    benefits: [
      "LG그룹 복리후생 공유",
      "자녀 학자금",
      "의료비 지원",
      "사내식당·카페",
      "유연근무제",
      "자기계발비 지원",
    ],
    pros: ["LG 계열사 안정성", "다양한 DX 프로젝트 경험", "처우 꾸준히 개선 중"],
    cons: ["SI 특성상 고객사 파견 근무 가능", "프로젝트별 강도 편차"],
    summary: "LG그룹 IT 서비스·DX 전문 계열사. 클라우드·AI·DX 컨설팅 사업 성장으로 처우가 꾸준히 개선되고 있습니다. 기본급 6,500만 원에 그룹 복리후생이 강점입니다.",
    benefitScore: 8.5,
  },
  {
    rank: 9,
    slug: "samsung-sds",
    name: "삼성SDS",
    nameEn: "Samsung SDS",
    category: "IT·SI",
    baseKrwM: 6000,
    totalCompM: 6500,
    monthlyNetKrwM: 421,
    highlights: ["삼성그룹 IT 계열사", "글로벌 물류·클라우드 서비스", "삼성 복리후생"],
    benefits: [
      "삼성그룹 공동 복리후생",
      "OPI·성과급",
      "복지포인트 연간 지급",
      "자녀 학자금 지원",
      "사내 어린이집",
      "종합 건강검진",
    ],
    pros: ["삼성그룹 브랜드·복리후생", "글로벌 물류 IT 경험", "안정적 대기업 환경"],
    cons: ["삼성그룹 특유의 수직적 문화", "성과급이 삼성전자 대비 낮음"],
    summary: "삼성그룹 IT 서비스·물류 계열사. 기본급 6,000만 원에 삼성그룹 공동 복리후생이 강점입니다. 글로벌 SCM·클라우드·AI 솔루션 분야에서 성장 중이며, 삼성 내 전산 시스템을 직접 개발·운영합니다.",
    benefitScore: 9.0,
  },
  {
    rank: 10,
    slug: "ncsoft",
    name: "엔씨소프트",
    nameEn: "NCSoft",
    category: "IT·게임",
    baseKrwM: 6000,
    totalCompM: 6000,
    monthlyNetKrwM: 421,
    highlights: ["대형 게임 IP 보유", "스톡옵션 기회", "리니지·아이온·블레이드&소울"],
    benefits: [
      "스톡옵션 제공",
      "성과급(흥행 연동)",
      "자유 근무 문화",
      "자기개발비 지원",
      "사내식당·헬스장",
      "육아 지원 제도",
    ],
    pros: ["게임 개발 문화 자유로움", "스톡옵션 기회", "탄탄한 글로벌 IP"],
    cons: ["신작 흥행에 따른 성과급 편차 큼", "최근 구조조정 이슈"],
    summary: "리니지·아이온·블레이드&소울 등 글로벌 IP를 보유한 대형 게임사. 기본급 6,000만 원에 스톡옵션 기회가 있습니다. 게임 흥행 시 성과급 상승 폭이 크지만 흥행 미흡 시 편차도 큽니다.",
    benefitScore: 7.5,
  },
];

// 쿠팡파트너스 제품
export const AFFILIATE_BOXES = {
  // ③ 코딩테스트·IT 취업 도서 (TOP5 이후 삽입)
  itBooks: {
    title: "IT 취업 준비, 이 책들로 시작하세요",
    context: "상위권 IT 기업 코딩테스트·기술 면접을 준비하는 분들을 위한 추천 도서입니다.",
    products: [
      {
        title: "이것이 취업을 위한 코딩 테스트다",
        desc: "국내 코딩테스트 대비 교재 1위. 네이버·카카오·삼성 기출 유형 총망라",
        tag: "코딩테스트 1위",
        url: "https://link.coupang.com/a/eaeeGK",
      },
      {
        title: "파이썬 알고리즘 인터뷰",
        desc: "IT 대기업 알고리즘 면접 대비. 실전 문제 93개 + 해설 수록",
        tag: "알고리즘 면접",
        url: "https://link.coupang.com/a/eaegxa",
      },
      {
        title: "AI 개발자가 되고 싶으세요?",
        desc: "여섯 명의 현직 개발자가 기록한 AI 시대 생존 전략. AI 진로 고민 중이라면 필독",
        tag: "AI 취업",
        url: "https://link.coupang.com/a/eaelWd",
      },
    ] as AffiliateProduct[],
  },
  // ⑥ 개발자 업무 효율 아이템 (복지 비교 섹션 이후 삽입)
  devTools: {
    title: "IT 직장인 업무 효율을 높이는 꿀템",
    context: "상위권 IT 기업에 입사하면 본인이 직접 구매하거나 회사 지원을 받는 업무 필수 아이템입니다.",
    products: [
      {
        title: "레오폴드 FC900RBT MX2A 저소음 적축",
        desc: "개발자 커뮤니티 인정 명품 키보드. 저소음 적축으로 사무실·재택 모두 쾌적",
        tag: "개발자 추천",
        url: "https://link.coupang.com/a/eaepCM",
      },
      {
        title: "카멜 싱글 모니터암 CA1",
        desc: "책상 공간 확보 + 목·허리 피로 감소. 모니터 위치 자유롭게 조정 가능",
        tag: "홈오피스 필수",
        url: "https://link.coupang.com/a/eaerCl",
      },
      {
        title: "생활탐정홈즈 체중분산 메모리폼 의자방석",
        desc: "하루 8시간 이상 앉아있는 개발자를 위한 체중분산 메모리폼 방석",
        tag: "건강 관리",
        url: "https://link.coupang.com/a/eaet2T",
      },
    ] as AffiliateProduct[],
  },
  // 연봉협상·이직 도서 (FAQ 이후 삽입)
  salaryBooks: {
    title: "연봉협상·이직 준비, 이 책부터 읽으세요",
    context: "IT 기업 입사 후 연봉협상, 또는 이직 시 연봉을 높이기 위한 실전 전략 도서입니다.",
    products: [
      {
        title: "나는 연봉협상으로 1000만원을 올렸다",
        desc: "현직 HR 출신 저자가 알려주는 연봉협상 실전 스크립트와 전략",
        tag: "연봉협상 베스트",
        url: "https://link.coupang.com/a/SALARY_NEGO_BOOK",
      },
      {
        title: "이직의 기술 — 3년차부터 시작하는",
        desc: "IT 개발자·기획자·마케터를 위한 이직 전략과 포트폴리오 만들기",
        tag: "이직 전략",
        url: "https://link.coupang.com/a/JOB_CHANGE_BOOK",
      },
    ] as AffiliateProduct[],
  },
};

export const IT_TOP10_FAQ = [
  {
    q: "IT 업계 신입 초봉이 가장 높은 곳은 어디인가요?",
    a: "2026년 기준 IT 업계 신입 기본급은 네이버·현대오토에버·넥슨·KT·LG유플러스가 7,000만 원으로 상위권입니다. RSU·성과급 포함 총보상 기준으로는 네이버(9,000만), SK텔레콤(8,000만), 현대오토에버(8,000만) 순입니다.",
  },
  {
    q: "IT 기업과 반도체 기업 중 연봉이 더 높은 곳은?",
    a: "성과급 포함 영끌 기준으로 SK하이닉스(1.5억)·현대자동차(9,500만) 등 반도체·완성차가 IT 플랫폼 기업을 앞섭니다. 그러나 IT 기업은 재택근무·RSU·유연근무 등 비현금 복지가 강해 전체 만족도 기준으로는 차이가 줄어듭니다.",
  },
  {
    q: "IT 기업 신입 연봉과 복지, 어느 것을 더 중요하게 봐야 하나요?",
    a: "초봉 차이가 크지 않다면 (500만 원 이내) 복지를 더 중요하게 보는 것이 합리적입니다. RSU(주식보상)는 수년 후 수천만 원의 추가 수입이 될 수 있고, 재택근무·유연근무는 교통비·시간 절감 효과가 연간 수백만 원에 달합니다.",
  },
  {
    q: "삼성SDS와 LG CNS 중 어디가 더 좋은가요?",
    a: "연봉 기준으로는 LG CNS(6,500만)가 삼성SDS(6,000만)보다 약간 높습니다. 복리후생은 삼성그룹이 더 넓고 체계적이라는 평가가 많습니다. 개발 문화는 두 곳 모두 SI 특성상 프로젝트형 업무가 중심이며, 클라우드·DX 비중이 높아지는 추세입니다.",
  },
  {
    q: "카카오 신입 초봉은 최근 많이 낮아진 건가요?",
    a: "2024년 이후 카카오 구조조정 과정에서 성과급이 보수적으로 운영되면서 총보상 기준으로는 예전 대비 다소 낮아진 편입니다. 기본급 6,500만 원은 유지되고 있으며, 자유로운 근무 문화와 RSU 기회는 여전히 강점입니다.",
  },
  {
    q: "IT 취업 코딩테스트 준비, 어떻게 해야 하나요?",
    a: "네이버·카카오·SK·현대오토에버 등 상위 IT 기업은 공통적으로 알고리즘 코딩테스트를 시행합니다. 파이썬 또는 Java로 그리디, DP, 그래프(BFS/DFS), 정렬, 해시 유형을 집중적으로 준비하는 것이 효과적입니다. 백준·프로그래머스에서 기업별 기출 문제를 반복 풀이하는 것을 권장합니다.",
  },
];
