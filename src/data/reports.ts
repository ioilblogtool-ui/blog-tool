export type ReportMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  badges?: string[];
};

export const reports: ReportMeta[] = [
  {
    slug: "it-salary-top10",
    title: "IT 업계 신입 초봉 TOP 10 연봉·복지 환경 비교 [2026]",
    description: "네이버, 카카오, SK텔레콤, 현대오토에버 등 주요 IT 기업의 2026년 신입 연봉과 복지를 카드형으로 비교하는 리포트입니다.",
    order: 1,
    badges: ["IT", "TOP10"],
  },
  {
    slug: "new-employee-salary-2026",
    title: "2026 신입사원 초봉 비교 리포트",
    description: "IT, 반도체, 자동차, 금융, 공공 등 주요 기업의 2026년 신입 초봉을 비교하는 인터랙티브 리포트입니다.",
    order: 2,
    badges: ["2026"],
  },
  {
    slug: "it-si-sm-salary-comparison-2026",
    title: "IT SI·SM 대기업 평균 연봉·성과급 비교 리포트 2026",
    description: "삼성SDS, LG CNS, 현대오토에버, 한화시스템 ICT 등 주요 IT서비스 기업의 평균 연봉, 초봉, 성과급 체감, 회사 규모를 비교하는 인터랙티브 리포트입니다.",
    order: 3,
    badges: ["IT서비스", "2026"],
  },
  {
    slug: "insurance-salary-bonus-comparison-2026",
    title: "국내 TOP 보험사 평균 연봉·성과급 비교 리포트 2026",
    description: "삼성화재, 삼성생명, 메리츠화재, 현대해상, DB손해보험, KB손해보험 등 주요 보험사의 평균 연봉, 신입 초봉, 성과급, 총보상을 함께 비교하는 인터랙티브 리포트입니다.",
    order: 4,
    badges: ["보험", "2026"],
  },
  {
    slug: "construction-salary-bonus-comparison-2026",
    title: "국내 TOP 대형 건설사 평균 연봉·성과급 비교 리포트 2026",
    description: "현대건설, GS건설, 대우건설, 롯데건설, 현대엔지니어링, 삼성E&A, SK에코플랜트 등 주요 대형 건설사의 평균 연봉, 신입 초봉, 성과급, 총보상을 함께 비교하는 인터랙티브 리포트입니다.",
    order: 5,
    badges: ["건설", "2026"],
  },
  {
    slug: "lee-jaemyung-government-officials-assets-salary-2026",
    title: "2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트",
    description: "정기 재산변동 공개 기준으로 이재명 정부 핵심 공직자 15명의 총재산, 세부 자산, 공직 보수를 한 화면에서 비교하는 인터랙티브 리포트입니다.",
    order: 6,
    badges: ["공직자", "재산공개", "2026"],
  },
  {
    slug: "seoul-84-apartment-prices",
    title: "서울 국평 아파트 가격 비교 리포트",
    description: "강남, 서초, 송파, 마포, 성동, 강동의 대단지 84㎡ 아파트 가격을 최고가와 평균가 기준으로 비교하고 연봉 대비 체감까지 보여주는 리포트입니다.",
    order: 7,
    badges: ["부동산", "서울"],
  },
  {
    slug: "korea-rich-top10-assets",
    title: "한국 부자 TOP 10 자산 비교 리포트",
    description: "2026년 현재 최신 공개 기준으로 한국 상위 10명의 자산과 서울 국평, 그랜저 환산값을 함께 보는 인터랙티브 리포트입니다.",
    order: 8,
    badges: ["KRW 기준"],
  },
  {
    slug: "us-rich-top10-patterns",
    title: "미국 부자 TOP 10 성공 패턴 리포트",
    description: "자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트입니다.",
    order: 9,
    badges: ["리포트"],
  },
];
