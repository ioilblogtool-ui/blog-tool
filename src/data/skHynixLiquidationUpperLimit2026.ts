export type TimelineEntry = {
  date: string;
  dateLabel: string;
  headline: string;
  detail: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type MechanismStep = {
  order: number;
  title: string;
  text: string;
};

export type FactcheckStatus = "확인됨" | "해석" | "확인 안 됨";

export type FactcheckRow = {
  rumor: string;
  status: FactcheckStatus;
  note: string;
};

export type RelatedLink = { href: string; label: string };
export type FaqItem = { question: string; answer: string };

export const SKLU_META = {
  slug: "sk-hynix-liquidation-upper-limit-2026",
  title: "SK하이닉스 청산 사태부터 사상 첫 상한가까지",
  seoTitle: "SK하이닉스 청산 사태 2026 완전 정리 | 사흘 만에 상한가 간 이유",
  seoDescription:
    "1주 이상거래로 시작된 826억 원 해외 청산 사고와 레버리지 ETF 78% 폭락, 사흘 만의 사상 첫 상한가까지 타임라인으로 정리. 팩트체크 포함.",
  description: "1주 이상거래가 부른 826억 원 해외 청산 사고, 그리고 사흘 만의 사상 첫 30% 상한가.",
  updatedAt: "2026-07-31",
  dataNote:
    "이 페이지는 실제 보도된 사실을 시간순으로 정리한 콘텐츠이며 투자 조언이 아닙니다. 레버리지·파생상품은 원금 손실 위험이 매우 크며, 확인되지 않은 온라인 소문은 별도로 구분해 표시합니다.",
} as const;

export const SKLU_KEY_METRICS = {
  abnormalPrice: 1_272_000,
  liquidationAmountKrw: 82_600_000_000,
  affectedUsers: 900,
  leverageEtfDropMin: 73.4,
  leverageEtfDropMax: 78,
  upperLimitGainPct: 29.95,
  upperLimitPrice: 1_718_000,
} as const;

export const SKLU_TIMELINE: TimelineEntry[] = [
  {
    date: "2026-07-27",
    dateLabel: "7월 27일 (월)",
    headline: "정규장 종가 181만 6,000원",
    detail: "사태 발생 전 마지막 정규장 종가입니다.",
    sourceLabel: "서울경제",
    sourceUrl: "https://www.sedaily.com/article/20073867",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화) 오전 8시",
    headline: "넥스트레이드(NXT) 프리마켓, 1주 127만 2,000원 이상 체결",
    detail: "전일 종가 대비 -29.99%인 하한가 수준으로 단 1주가 체결되며 이상거래가 발생했습니다.",
    sourceLabel: "SBS Biz",
    sourceUrl: "https://biz.sbs.co.kr/article/20000325667",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화)",
    headline: "해외 파생상품 826억 원 강제청산",
    detail:
      "이상 체결가가 가상자산 파생상품 플랫폼 trade.xyz의 'SK하이닉스 연계 무기한선물' 오라클에 반영되며 가격이 17.9% 급락, 약 5,740만 달러(약 826억 원) 규모 롱포지션이 2분 만에 강제청산됐습니다. 900명 이상이 영향을 받은 것으로 추정됩니다.",
    sourceLabel: "아시아경제",
    sourceUrl: "https://www.asiae.co.kr/article/2026073014435134205",
  },
  {
    date: "2026-07-28",
    dateLabel: "7월 28일 (화) 정규장 마감",
    headline: "국내 정규장 종가 -14.6%, 155만원",
    detail: "해외 파생상품만큼 극단적이지는 않았지만 국내 정규장도 하루 만에 큰 폭으로 하락했습니다.",
    sourceLabel: "파이낸셜뉴스",
    sourceUrl: "https://www.fnnews.com/news/202607291318553622",
  },
  {
    date: "2026-07-29",
    dateLabel: "7월 29일 (수)",
    headline: "레버리지 ETF -73~78%, 서킷브레이커 발동",
    detail:
      "TIGER SK하이닉스 레버리지 등 단일종목 레버리지 상품이 상장가 대비 -73.4~-78%까지 폭락하며 반대매매·강제청산 공포가 확산됐고, 코스피·코스닥 양시장 서킷브레이커가 발동됐습니다.",
    sourceLabel: "ZDNet Korea",
    sourceUrl: "https://zdnet.co.kr/view/?no=20260729143214",
  },
  {
    date: "2026-07-30",
    dateLabel: "7월 30일 (목)",
    headline: "trade.xyz, 피해 전액 보상 발표",
    detail: "청산 피해자에게 손실 전액을 보상하고 가격 산출 방식을 개선하겠다고 밝혔습니다.",
    sourceLabel: "SBS Biz",
    sourceUrl: "https://biz.sbs.co.kr/article/20000325667",
  },
  {
    date: "2026-07-30",
    dateLabel: "7월 30일 (목)",
    headline: "최태원 회장, SK하이닉스 주식 첫 개인 매수(약 48억원)",
    detail:
      "최태원 SK그룹 회장이 SK하이닉스 보통주 3,620주(종가 132만 2,000원 기준 약 48억원)를 장내매수하며 사상 처음 개인 명의로 SK하이닉스 주식을 보유하게 됐습니다. \"책임경영\" 차원으로 알려졌으며, 내부자 사전공시 의무(거래금액 50억원 이상 시 30일 전 공시) 기준에 걸리지 않는 최대치로 맞췄다는 평가도 있습니다.",
    sourceLabel: "뉴시스",
    sourceUrl: "https://www.newsis.com/view/NISX20260730_0003730593",
  },
  {
    date: "2026-07-31",
    dateLabel: "7월 31일 (금)",
    headline: "사상 첫 30% 상한가, 171만 8,000원",
    detail:
      "미국 필라델피아 반도체지수 +8.19% 급등과 AI 투자 지속 기대감에 힘입어 2015년 가격제한폭 30% 확대 이후 처음으로 상한가를 기록했습니다. 삼성전자도 20%대 폭등, 코스피 전체가 급등했습니다. 전날 매수한 최태원 회장은 하루 만에 평가이익 약 12억원을 거뒀습니다.",
    sourceLabel: "머니투데이",
    sourceUrl: "https://www.mt.co.kr/stock/2026/07/31/2026073114355560595",
  },
];

export const SKLU_MECHANISM_STEPS: MechanismStep[] = [
  { order: 1, title: "이상 체결", text: "넥스트레이드 프리마켓에서 유동성이 얕은 시간대에 1주가 하한가 수준으로 체결됐습니다." },
  { order: 2, title: "오라클 반영", text: "해외 파생상품 플랫폼의 가격 오라클이 이 이상치를 그대로 실시간 반영했습니다." },
  { order: 3, title: "자동 강제청산", text: "오라클 가격에 연동된 무기한선물 포지션이 자동으로 강제청산되며 2분 만에 826억 원 규모가 정리됐습니다." },
];

export const SKLU_LEVERAGE_COMPARISON = {
  underlyingDropPct: 14.6,
  leverageDropMinPct: 73.4,
  leverageDropMaxPct: 78,
} as const;

export const SKLU_FACTCHECK: FactcheckRow[] = [
  {
    rumor: "AI 펀드 마진콜이 근본 원인이다",
    status: "해석",
    note: "일부 매체가 원인으로 지목했으나, 감독당국의 공식 조사 결과는 아직 확인되지 않았습니다.",
  },
  {
    rumor: "40년 모아온 22억을 날렸다",
    status: "확인 안 됨",
    note: "일부 SNS 주장에 대해 조작(주작) 의혹이 제기됐으며, 사실 여부는 확정되지 않았습니다.",
  },
  {
    rumor: "'레오폴드'가 배후다",
    status: "확인 안 됨",
    note: "국내 주요 언론 보도에서 관련 내용을 확인할 수 없어, 이 페이지에서는 다루지 않습니다.",
  },
];

export const SKLU_FAQ: FaqItem[] = [
  {
    question: "SK하이닉스 청산 사태는 정확히 어떤 사건인가요?",
    answer: "넥스트레이드 프리마켓에서 1주가 이상 체결되면서 그 가격이 해외 파생상품 오라클에 반영돼 약 826억 원 규모가 강제청산된 사건입니다.",
  },
  {
    question: "국내 SK하이닉스 주가도 폭락했나요?",
    answer: "정규장 기준으로는 7월 28일 하루 -14.6% 하락했으며, 해외 파생상품만큼 극단적이지는 않았습니다.",
  },
  {
    question: "레버리지 ETF는 왜 더 크게 떨어졌나요?",
    answer: "레버리지 상품은 기초자산 일별 수익률의 배수를 추종하도록 설계돼 있어 하락폭이 구조적으로 증폭됩니다.",
  },
  {
    question: "상한가는 어떻게 갔나요?",
    answer: "7월 31일 미국 반도체지수 급등과 AI 투자 기대감이 겹치며 사상 첫 30% 상한가를 기록했습니다.",
  },
  {
    question: "피해자는 보상받았나요?",
    answer: "trade.xyz는 청산 피해자에게 손실 전액을 보상하겠다고 발표했습니다.",
  },
  {
    question: "최태원 회장도 이때 주식을 샀다는 게 사실인가요?",
    answer:
      "사실입니다. 7월 30일 SK하이닉스 보통주 3,620주(약 48억원)를 장내매수해 사상 처음 개인 명의로 주식을 보유하게 됐고, 다음날 상한가로 하루 만에 평가이익 약 12억원을 거뒀습니다.",
  },
  {
    question: "'레오폴드' 음모론은 사실인가요?",
    answer: "확인되지 않았습니다. 국내 주요 언론 보도에서 관련 내용을 찾을 수 없습니다.",
  },
];

export const SKLU_SEO_INTRO = [
  "2026년 7월 28일, 대체거래소 넥스트레이드 프리마켓에서 SK하이닉스 단 1주가 하한가 수준인 127만 2,000원에 체결되는 이상거래가 발생했습니다. 이 가격이 해외 가상자산 파생상품 플랫폼의 오라클에 그대로 반영되며 약 826억 원 규모의 롱포지션이 2분 만에 강제청산됐습니다.",
  "충격은 국내로도 번져 단일종목 레버리지 ETF가 상장가 대비 최대 78%까지 폭락하고 서킷브레이커가 발동됐습니다. 이 와중에 최태원 SK그룹 회장이 사상 처음 SK하이닉스 주식을 개인 매수했고, 사흘 뒤인 7월 31일 SK하이닉스는 미국 반도체지수 급등에 힘입어 사상 첫 30% 상한가로 반전했습니다.",
];

export const SKLU_SEO_CRITERIA = [
  "7/28 넥스트레이드 프리마켓 1주 이상 체결가: 127만 2,000원(-29.99%)",
  "해외 파생상품 강제청산 규모: 약 826억 원(5,740만 달러), 900명 이상 영향",
  "국내 정규장 낙폭(7/28): -14.6%, 레버리지 ETF 낙폭: 상장가 대비 -73.4~-78%",
  "7/30 최태원 회장 SK하이닉스 첫 개인 매수(약 48억원, 3,620주)",
  "7/31 사상 첫 30% 상한가(+29.95%), 171만 8,000원",
  "이 페이지는 보도된 사실 기준으로 정리했으며, 확인되지 않은 온라인 소문은 별도로 표시합니다",
];

export const SKLU_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/kospi-leverage-etf-calculator/", label: "코스피 레버리지 ETF 손익 계산기" },
  { href: "/reports/sk-hynix-earnings-ps-outlook-2026/", label: "SK하이닉스 실적·PS 전망 2026" },
  { href: "/reports/korea-semiconductor-etf-2026/", label: "국내 반도체 ETF 비교 2026" },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 실적 전망 2026~2028" },
];
