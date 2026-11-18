export const NVIDIA_EARNINGS_META = {
  slug: "nvidia-jensen-huang-earnings-2026",
  title: "젠슨 황 사임·엔비디아 실적 2026 | AI 성장 계속될까",
  description: "젠슨 황 사임 이후 발표된 엔비디아 FY2027 3분기 실적을 비교합니다. 데이터센터 성장, Vera Rubin 출하와 중국 데이터센터 컴퓨트 매출을 제외한 다음 분기 전망을 정리했습니다.",
  asOf: "2026-11-18",
  ogImage: "/og/reports/nvidia-jensen-huang-earnings-2026.png",
} as const;

export const nvidiaSources = {
  earnings: { title: "NVIDIA FY2027 3분기 실적 · 2026-11-17", url: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/default.aspx" },
  previous: { title: "NVIDIA FY2027 2분기 실적 · 2026-08-26", url: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/default.aspx" },
  yearAgo: { title: "NVIDIA FY2026 3분기 실적 · 2025-11-19", url: "https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2026/default.aspx" },
  sec: { title: "SEC Form 8-K · 이사회 사임 수리", url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvda-20261111.htm" },
  transition: { title: "NVIDIA CEO 승계 발표 · 2026-11-12", url: "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-CEO-Transition/default.aspx" },
  slides: { title: "NVIDIA FY2027 3분기 실적 프레젠테이션", url: "https://investor.nvidia.com/files/doc_financials/2027/Q327/NVDA-F3Q27-Quarterly-Presentation.pdf" },
} as const;

export const fiscalTimeline = [
  { date: "2026-10-25", label: "FY2027 3분기 종료", detail: "실적 집계는 이 날짜에 끝났습니다.", source: "earnings" },
  { date: "2026-11-11", label: "젠슨 황 사임 수리", detail: "이사회가 사장·CEO·이사직 사임을 수리했습니다.", source: "sec" },
  { date: "2026-11-12", label: "CEO 승계 공개", detail: "콜레트 크레스가 CFO직을 유지하며 임시 CEO를 맡았습니다. 이사회는 정식 후임 인선에 착수했습니다.", source: "transition" },
  { date: "2026-11-17", label: "3분기 실적 발표 (미국 현지)", detail: "한국시간 11월 18일에 해당합니다. 회사는 4분기 가이던스도 공개했습니다.", source: "earnings" },
] as const;

// 금액은 회사 요약표의 십억 달러 단위와 정밀도를 유지한다.
export const revenue = { yearAgo: 57.0, previous: 96.2, current: 115.8 };
export const dataCenter = { yearAgo: 51.2, previous: 89.0, current: 107.6 };
export const nvidiaResults = [
  { label: "연결 매출", unit: "usd", ...revenue, yoy: "+103%", qoq: "+20%" },
  { label: "데이터센터 매출", unit: "usd", ...dataCenter, yoy: "+110%", qoq: "+21%" },
  { label: "GAAP 영업이익", unit: "usd", yearAgo: 36.0, previous: 63.7, current: 77.5, yoy: "+115%", qoq: "+22%" },
  { label: "GAAP 매출총이익률", unit: "percent", yearAgo: 73.4, previous: 75.0, current: 74.8, yoy: "+1.4%p", qoq: "-0.2%p" },
] as const;

export const guidance = { midpoint: 130, tolerance: 0.03, grossMarginLow: 71, grossMarginHigh: 72 } as const;

export const nvidiaFaq = [
  { question: "젠슨 황은 언제 사임했나요?", answer: "이사회는 미국 현지 11월 11일 사임을 수리했고, 회사는 11월 12일 승계를 발표했습니다. 콜레트 크레스가 CFO직을 유지하면서 임시 CEO를 맡았습니다." },
  { question: "3분기 실적은 콜레트 크레스 체제의 성과인가요?", answer: "3분기 실적 집계는 사임 수리 전인 10월 25일에 끝났습니다. 승계 이후 운영 성과를 보려면 후속 분기 실적과 공시를 확인해야 합니다." },
  { question: "데이터센터 매출은 전체의 얼마인가요?", answer: "공개된 3분기 데이터센터 매출 1,076억 달러를 연결 매출 1,158억 달러로 나누면 약 92.9%입니다. 공시 금액을 기준으로 계산한 비중입니다." },
  { question: "Vera Rubin은 매출에 얼마나 기여했나요?", answer: "NVIDIA는 NVL72 출하 개시와 일부 파트너의 가동을 발표했습니다. 이번 실적 발표 자료에서 제품 단독 매출 금액은 확인되지 않습니다." },
  { question: "1,300억 달러 전망에 중국 매출이 포함되나요?", answer: "회사는 중국 데이터센터 컴퓨트 매출을 4분기 전망에 가정하지 않았습니다. 전망을 직전 분기와 비교할 때에는 4분기에 추가된 1주도 고려해야 합니다." },
  { question: "왜 2026년에 FY2027 실적을 발표하나요?", answer: "FY2027은 NVIDIA의 회계연도 이름입니다. 이 회계연도의 3분기는 달력 기준 2026년 10월 25일에 끝났습니다." },
];

export const nvidiaRelated = [
  { href: "/reports/skhynix-nvidia-partnership-2026/", label: "SK하이닉스·엔비디아 AI 인프라 협력" },
  { href: "/reports/ai-capex-slowdown-korea-semiconductor-2026/", label: "AI 설비투자 둔화와 한국 반도체" },
];
