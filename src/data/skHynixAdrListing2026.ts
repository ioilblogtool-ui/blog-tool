export type AdrTimelineStep = {
  step: string;
  label: string;
  status: "completed";
  description: string;
};

export type AdrReasonCard = {
  title: string;
  description: string;
  points: string[];
  tone: "confirmed" | "outlook";
};

export type AdrImpactRow = {
  area: string;
  beforeListing: string;
  afterListing: string;
  note: string;
};

export type AdrFaq = {
  question: string;
  answer: string;
};

export type AdrRelatedLink = {
  href: string;
  label: string;
  description: string;
};

export const reportMeta = {
  slug: "sk-hynix-adr-listing-2026",
  title: "SK하이닉스 나스닥 ADR 상장 완전 정리 | SKHY 티커·조달금액 총정리",
  description:
    "SK하이닉스 나스닥 ADR(SKHY) 상장 배경과 공모가 149달러·조달 265억 달러 규모, 국내 투자자 세금·수급 영향을 정리. ADR 프리미엄 계산기 연결 포함.",
  h1: "SK하이닉스, 나스닥 ADR 상장으로 뭐가 달라졌나",
  eyebrow: "SK하이닉스 나스닥 ADR 상장",
  updatedAt: "2026-07-10",
};

export const heroKpis = [
  {
    label: "상장일·거래소",
    value: "2026-07-10 나스닥(SKHY)",
    description: "Nasdaq Global Select Market, 공모가 ADS 1주당 149달러",
  },
  {
    label: "조달 규모",
    value: "약 265억 달러",
    description: "한국 보통주 약 1,779만 주 신주 발행 기반(외신 기준 약 280억 달러)",
  },
  {
    label: "국내 투자자 영향",
    value: "직접 지분 변동 없음",
    description: "보유 주식 자체는 그대로, 신주 발행에 따른 지분 희석은 존재",
  },
];

export const timelineSteps: AdrTimelineStep[] = [
  {
    step: "1",
    label: "상장 공식 발표",
    status: "completed",
    description: "SK하이닉스가 미국 나스닥 ADR 상장 계획을 공식 발표했습니다.",
  },
  {
    step: "2",
    label: "증권신고서 등 규제 신고",
    status: "completed",
    description: "미국 증권당국 대상 증권신고서 등 필요한 규제 절차를 거쳤습니다.",
  },
  {
    step: "3",
    label: "기관 대상 공모",
    status: "completed",
    description: "기관 주문이 공모 물량의 약 7배 이상 몰릴 만큼 수요가 컸습니다.",
  },
  {
    step: "4",
    label: "나스닥 거래 개시",
    status: "completed",
    description: "2026년 7월 10일 티커 SKHY로 나스닥 거래를 시작했습니다.",
  },
];

export const reasonCards: AdrReasonCard[] = [
  {
    title: "HBM·첨단 메모리 생산능력 확대",
    description: "이번 상장으로 조달한 자금은 국내 신규 팹 건설과 장비 투자 재원으로 쓰일 예정입니다.",
    points: ["국내 신규 팹 건설", "HBM 생산장비 투자"],
    tone: "confirmed",
  },
  {
    title: "미국 기관투자자 기반 확대 기대",
    description: "나스닥 상장으로 그동안 접근이 제한적이었던 미국 기관투자자의 직접 참여가 늘어날 것으로 기대됩니다.",
    points: ["미국 기관 직접 매매 가능", "공모 당시 수요 약 7배 초과"],
    tone: "outlook",
  },
  {
    title: "코리아 디스카운트 일부 완화 가능성",
    description: "미국 시장 유동성이 더해지면 그동안 거론돼 온 코리아 디스카운트가 일부 완화될 수 있다는 시장 기대가 있습니다.",
    points: ["미국 유동성 유입 기대", "실제 완화 여부는 향후 확인 필요"],
    tone: "outlook",
  },
  {
    title: "마이크론 대비 밸류에이션 격차 축소 가능성",
    description: "마이크론 등 미국 반도체 기업과 같은 시장에서 직접 비교되면서 밸류에이션 격차가 줄어들 수 있다는 전망도 나옵니다.",
    points: ["글로벌 AI·HBM 대표 기업 재평가 기대", "실적·수급에 따라 결과는 달라질 전망"],
    tone: "outlook",
  },
];

export const impactRows: AdrImpactRow[] = [
  {
    area: "기존 주주 지분",
    beforeListing: "국내 상장 주식 보유",
    afterListing: "동일(변동 없음)",
    note: "신주 발행에 따른 지분 희석은 존재",
  },
  {
    area: "미국 투자자 접근성",
    beforeListing: "국내 계좌 통한 우회 투자만 가능",
    afterListing: "나스닥에서 SKHY로 직접 매매 가능",
    note: "-",
  },
  {
    area: "국내 주가 흐름",
    beforeListing: "코스피 단일 가격 형성",
    afterListing: "SKHY 가격과 상호 참고되며 변동성 확대 가능(전망)",
    note: "프리미엄/디스카운트 발생 가능",
  },
  {
    area: "외국인 수급",
    beforeListing: "국내 상장분 통한 외국인 매매만 존재",
    afterListing: "미국 기관 직접 참여 확대(전망)",
    note: "공모 당시 수요 약 7배 초과",
  },
  {
    area: "개인투자자 세금",
    beforeListing: "해당 없음",
    afterListing: "ADR 직접 매수 시 해외주식 양도세 체계 적용",
    note: "상세는 비교 리포트 참고",
  },
];

export const faq: AdrFaq[] = [
  {
    question: "SK하이닉스 ADR(SKHY)이 뭔가요?",
    answer:
      "SK하이닉스는 2026년 7월 10일 미국 나스닥(Nasdaq Global Select Market)에 ADR을 상장했습니다. 티커는 SKHY, 공모가는 ADS 1주당 149달러였고, ADS 10주가 한국 보통주 1주를 나타내는 구조입니다.",
  },
  {
    question: "SK하이닉스는 왜 나스닥 ADR 상장을 했나요?",
    answer:
      "공식 목적은 HBM·첨단 메모리 생산능력 확대를 위한 국내 신규 팹 건설과 장비 투자 재원 확보입니다. 이와 별개로 시장에서는 미국 기관투자자 기반 확대, 코리아 디스카운트 완화, 마이크론 대비 밸류에이션 격차 축소 등을 기대효과로 거론하고 있습니다.",
  },
  {
    question: "ADR 상장하면 국내 주가에 영향이 있나요?",
    answer:
      "코리아 디스카운트 완화 기대가 시장에서 거론되지만 이는 아직 확정된 결과가 아닙니다. 실제 재평가는 향후 미국 시장 유동성, HBM 실적, 주주환원 정책에 따라 결정될 전망입니다.",
  },
  {
    question: "ADR이 상장되면 제가 가진 국내 주식은 어떻게 되나요?",
    answer:
      "보유 지분 자체는 그대로 유지됩니다. 다만 신주 발행에 따른 지분 희석과 단기 수급 부담은 존재할 수 있습니다.",
  },
  {
    question: "ADR 상장 후 세금은 어떻게 달라지나요?",
    answer:
      "국내 보유분은 기존과 동일합니다. ADR을 직접 매수하면 해외주식 양도세 체계가 적용되며, 자세한 비교는 국내투자 vs ADR 투자 비교 리포트에서 확인할 수 있습니다.",
  },
];

export const relatedLinks: AdrRelatedLink[] = [
  {
    href: "/tools/sk-hynix-adr-premium-calculator/",
    label: "ADR 프리미엄 계산기",
    description: "국내 주가와 SKHY 가격 차이 바로 계산",
  },
  {
    href: "/reports/sk-hynix-korea-vs-adr-investment-2026/",
    label: "국내투자 vs ADR 투자 비교",
    description: "세금·환전비용·거래시간 비교표",
  },
  {
    href: "/reports/sk-hynix-bonus-2027/",
    label: "하이닉스 2027 성과급 전망",
    description: "SK하이닉스 성과급 클러스터 연결",
  },
  {
    href: "/tools/sk-hynix-bonus/",
    label: "하이닉스 성과급 계산기",
    description: "PS·PI 실수령액 계산",
  },
];
