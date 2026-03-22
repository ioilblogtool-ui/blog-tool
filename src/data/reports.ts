export type ReportMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  badges?: string[];
};

export const reports: ReportMeta[] = [
  {
    slug: "korea-rich-top10-assets",
    title: "한국 부자 TOP 10 자산 비교 리포트",
    description: "2026년 현재 최신 공개 기준으로 한국 상위 10명 자산과 서울 국평·그랜저 환산값을 함께 보는 인터랙티브 리포트",
    order: 1,
    badges: ["신규", "KRW 기준"]
  },
  {
    slug: "us-rich-top10-patterns",
    title: "미국 부자 TOP 10 성공 패턴 리포트",
    description: "자산, 학력, 업종, 창업 배경, 성향 태그를 선택해서 비교해보는 인터랙티브 리포트",
    order: 2,
    badges: ["리포트"]
  }
];
