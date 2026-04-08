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
    slug: "large-company-salary-growth-by-years-2026",
    title: "2026 대기업 연차별 연봉 성장 비교 리포트",
    description: "주요 대기업 15개사의 초봉, 평균 연봉, 근속연수를 바탕으로 1년차·5년차·10년차·15년차 성장 흐름을 비교하는 인터랙티브 리포트입니다.",
    order: 6,
    badges: ["연차별", "연봉성장", "2026"],
  },
  {
    slug: "lee-jaemyung-government-officials-assets-salary-2026",
    title: "2026 이재명 정부 핵심 공직자 재산·보수 비교 리포트",
    description: "정기 재산변동 공개 기준으로 이재명 정부 핵심 공직자 15명의 총재산, 세부 자산, 공직 보수를 한 화면에서 비교하는 인터랙티브 리포트입니다.",
    order: 7,
    badges: ["공직자", "재산공개", "2026"],
  },
  {
    slug: "seoul-84-apartment-prices",
    title: "서울 국평 아파트 가격 비교 리포트",
    description: "강남, 서초, 송파, 마포, 성동, 강동의 대단지 84㎡ 아파트 가격을 최고가와 평균가 기준으로 비교하고 연봉 대비 체감까지 보여주는 리포트입니다.",
    order: 8,
    badges: ["부동산", "서울"],
  },
  {
    slug: "korea-rich-top10-assets",
    title: "한국 부자 TOP 10 자산 비교 리포트",
    description: "2026년 현재 최신 공개 기준으로 한국 상위 10명의 자산과 서울 국평, 그랜저 환산값을 함께 보는 인터랙티브 리포트입니다.",
    order: 9,
    badges: ["KRW 기준"],
  },
  {
    slug: "us-rich-top10-patterns",
    title: "미국 부자 TOP 10 성공 패턴 리포트",
    description: "자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트입니다.",
    order: 10,
    badges: ["리포트"],
  },
  {
    slug: "wedding-cost-2016-vs-2026",
    title: "결혼비용 2016 vs 2026 리포트",
    description: "웨딩홀, 스드메, 신혼여행, 예식 준비 비용을 같은 항목 체계로 다시 묶어 10년 사이 결혼 총예산 변화를 비교하는 리포트입니다.",
    order: 11,
    badges: ["결혼", "예산"],
  },
  {
    slug: "seoul-housing-2016-vs-2026",
    title: "서울 집값 2016 vs 2026 비교 리포트",
    description: "서울 평균 매매가, 전세가, 월세, PIR을 기준으로 2016년과 2026년의 주거비 변화를 비교하고 연봉 기준 체감까지 보여주는 리포트입니다.",
    order: 12,
    badges: ["서울", "부동산", "10년비교"],
  },
  {
    slug: "salary-asset-2016-vs-2026",
    title: "한국인 평균 연봉·자산 2016 vs 2026 비교 리포트",
    description: "중위 연봉, 평균 자산, 서울 집값 지수를 한 화면에서 비교해 2016년과 2026년 사이 자산 형성 구조가 어떻게 달라졌는지 읽는 인터랙티브 리포트입니다.",
    order: 13,
    badges: ["연봉", "자산", "10년비교"],
  },
  {
    slug: "baby-cost-guide-first-year",
    title: "신생아~돌까지 육아 비용 총정리 — 가성비·평균·프리미엄 비교",
    description: "기저귀, 분유, 병원비, 이유식, 육아용품까지 아기 1년 육아 비용을 3단계 기준으로 비교하고 지원금 반영 후 실부담까지 확인하는 리포트입니다.",
    order: 14,
    badges: ["육아", "비용비교"],
  },
  {
    slug: "baby-cost-2016-vs-2026",
    title: "아이 키우는 비용 2016 vs 2026 비교 리포트",
    description: "분유, 기저귀, 어린이집을 기준으로 2016년과 2026년의 육아 체감 비용 변화를 비교하고 지원금 반영 후 순부담까지 읽는 인터랙티브 리포트입니다.",
    order: 15,
    badges: ["육아", "10년비교"],
  },
  {
    slug: "seoul-apartment-jeonse-report",
    title: "전세 사라지는 서울 아파트 | 신혼부부가 찾던 역세권 전세는 왜 없어졌나",
    description: "서울 아파트 전세가 왜 체감상 더 어려워졌는지, 평균 전세가와 전세 비중 변화, 강서·강동·강북 실수요 지역 기준으로 정리한 비교 리포트입니다.",
    order: 16,
    badges: ["서울", "전세", "부동산"],
  },
];
