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
    title: "IT 업계 신입 초봉 TOP 10 — 연봉·복지 완벽 비교 [2026]",
    description: "네이버·카카오·SK텔레콤·현대오토에버 등 주요 IT 기업 신입 연봉과 복리후생을 랭킹 카드로 상세 비교하는 2026년 최신 리포트",
    order: 1,
    badges: ["IT", "TOP10"]
  },
  {
    slug: "new-employee-salary-2026",
    title: "2026 신입사원 초봉 비교 리포트",
    description: "IT·반도체·자동차·금융·공공 분야 주요 기업의 2026년 신입사원 초봉을 바 차트와 상세 카드로 비교하는 인터랙티브 리포트",
    order: 2,
    badges: ["2026"]
  },
  {
    slug: "korea-rich-top10-assets",
    title: "한국 부자 TOP 10 자산 비교 리포트",
    description: "2026년 현재 최신 공개 기준으로 한국 상위 10명 자산과 서울 국평·그랜저 환산값을 함께 보는 인터랙티브 리포트",
    order: 4,
    badges: ["KRW 기준"]
  },
  {
    slug: "us-rich-top10-patterns",
    title: "미국 부자 TOP 10 성공 패턴 리포트",
    description: "자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트",
    order: 5,
    badges: ["리포트"]
  }
];
