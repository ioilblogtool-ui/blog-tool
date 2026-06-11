export const UIP_META = {
  slug: "us-major-ipo-outlook-2026",
  title: "2026 미국 대형 IPO 전망 리포트",
  seoTitle: "2026 미국 대형 IPO 전망 리포트 | 비교계산소",
  seoDescription:
    "오픈AI, 앤트로픽, 스페이스X, 스트라이프, 데이터브릭스 등 미국 대형 비상장 기업의 추정 기업가치, 사업 개요, IPO 추진 현황을 한 화면에서 비교합니다.",
  description:
    "미국 대형 비상장 기업들의 추정 밸류에이션과 IPO 추진 현황을 정리한 리포트입니다.",
  updatedAt: "2026-06-10",
  dataNote:
    "이 리포트의 기업가치·IPO 추진 현황은 2025년까지 보도된 투자 라운드, 텐더오퍼, 상장 신청 관련 뉴스를 기준으로 정리한 추정치입니다. 실제 상장 여부·시점·기업가치는 이후 변경되었을 수 있으니 투자 판단 전 반드시 최신 공시와 뉴스를 직접 확인하세요. 특정 종목에 대한 매수·매도 추천이 아닙니다.",
};

export const UIP_KPI = {
  candidateCount: 11,
  totalEstValuationUsd: 1_157_600_000_000,
  topCompanyName: "스페이스X",
  topCompanyValuationUsd: 400_000_000_000,
  fintechCount: 4,
  fintechSharePct: 36,
};

export type ConfidenceLevel = "낮음" | "중간" | "참고";

export interface IpoCandidate {
  id: string;
  name: string;
  nameKo: string;
  sector: string;
  hq: string;
  founded: number;
  valuationUsd: number;
  valuationNote: string;
  summary: string;
  ipoStatus: string;
  ipoDetail: string;
  confidence: ConfidenceLevel;
}

export const UIP_COMPANIES: IpoCandidate[] = [
  {
    id: "openai",
    name: "OpenAI",
    nameKo: "오픈AI",
    sector: "생성형 AI",
    hq: "미국 캘리포니아",
    founded: 2015,
    valuationUsd: 300_000_000_000,
    valuationNote: "2025년 직원 대상 주식 매각 보도 기준 추정",
    summary:
      "챗GPT를 개발한 생성형 AI 기업으로, 비영리 재단 구조에서 영리법인으로 전환을 추진하면서 기업가치가 빠르게 상승했습니다.",
    ipoStatus: "공식 일정 없음 (참고)",
    ipoDetail:
      "경영진이 인터뷰에서 향후 상장 가능성을 언급한 적은 있지만, 영리법인 전환 절차가 진행 중이며 구체적인 상장 시점은 공식화되지 않았습니다.",
    confidence: "참고",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    nameKo: "앤트로픽",
    sector: "생성형 AI",
    hq: "미국 캘리포니아",
    founded: 2021,
    valuationUsd: 170_000_000_000,
    valuationNote: "2025년 투자 라운드 보도 기준 추정",
    summary:
      "AI 모델 클로드(Claude)를 개발하는 생성형 AI 기업으로, 아마존·구글 등으로부터 대규모 투자를 유치하며 기업가치가 급등했습니다.",
    ipoStatus: "공식 일정 없음 (루머)",
    ipoDetail:
      "설립 이후 빠르게 기업가치가 상승하며 잠재적 IPO 후보로 자주 거론되지만, 공식적인 상장 계획은 발표된 바 없습니다.",
    confidence: "낮음",
  },
  {
    id: "spacex",
    name: "SpaceX",
    nameKo: "스페이스X",
    sector: "우주 · 항공",
    hq: "미국 텍사스",
    founded: 2002,
    valuationUsd: 400_000_000_000,
    valuationNote: "2025년 텐더오퍼 보도 기준 추정",
    summary:
      "발사체와 위성 인터넷(스타링크) 사업을 운영하는 우주기업으로, 비상장 기업 중 최고 수준의 기업가치로 평가받습니다.",
    ipoStatus: "스타링크 분리 상장설 등 루머 다수",
    ipoDetail:
      "일론 머스크는 회사 전체보다는 스타링크 사업부의 분리 상장 가능성을 언급한 적이 있습니다. 자세한 기업가치 추이와 주주 구성은 별도 스페이스X 상장 전망 리포트에서 확인할 수 있습니다.",
    confidence: "낮음",
  },
  {
    id: "stripe",
    name: "Stripe",
    nameKo: "스트라이프",
    sector: "핀테크 · 결제 인프라",
    hq: "미국 (아일랜드 공동본사)",
    founded: 2010,
    valuationUsd: 91_500_000_000,
    valuationNote: "2024년 직원 대상 텐더오퍼 보도 기준 추정",
    summary:
      "온라인 결제 처리와 핀테크 인프라(API 기반 결제·정산·구독과금)를 제공하는 글로벌 결제 플랫폼입니다.",
    ipoStatus: "공식 일정 없음 (루머)",
    ipoDetail:
      "2021년부터 상장설이 꾸준히 제기되어 왔으나, 2024년에는 IPO 대신 직원 보유 주식 유동화를 위한 텐더오퍼를 진행했습니다. 공식 상장 계획은 발표되지 않았습니다.",
    confidence: "낮음",
  },
  {
    id: "databricks",
    name: "Databricks",
    nameKo: "데이터브릭스",
    sector: "데이터 · AI 플랫폼",
    hq: "미국 캘리포니아",
    founded: 2013,
    valuationUsd: 100_000_000_000,
    valuationNote: "2025년 투자 라운드 보도 기준 추정",
    summary:
      "데이터 레이크하우스와 AI·머신러닝 모델 개발 플랫폼을 제공하는 기업용 소프트웨어 회사입니다.",
    ipoStatus: "상장 준비 언급 (참고)",
    ipoDetail:
      "경영진이 인터뷰에서 IPO를 준비하고 있다는 취지로 언급한 바 있으나, 구체적인 시점은 공식화되지 않았습니다. 2026년 이후 상장 가능성이 거론됩니다.",
    confidence: "중간",
  },
  {
    id: "klarna",
    name: "Klarna",
    nameKo: "클라르나",
    sector: "핀테크 · 후불결제",
    hq: "스웨덴 (미국 증시 상장 추진)",
    founded: 2005,
    valuationUsd: 14_600_000_000,
    valuationNote: "2025년 기준 보도 추정 (2022년 저점 대비 회복)",
    summary:
      "먼저 사고 나중에 갚는 후불결제 서비스를 제공하는 핀테크 기업으로, 미국 시장 확장에 주력하고 있습니다.",
    ipoStatus: "미국 증시 상장 신청 보도",
    ipoDetail:
      "2025년 뉴욕증권거래소 상장을 신청했다는 보도가 있었으나, 시장 상황에 따라 일정이 조정될 수 있다는 점이 함께 보도되었습니다. 진행 상황은 변동될 수 있습니다.",
    confidence: "중간",
  },
  {
    id: "canva",
    name: "Canva",
    nameKo: "캔바",
    sector: "디자인 · 구독형 소프트웨어",
    hq: "호주 (미국 증시 상장 검토)",
    founded: 2013,
    valuationUsd: 32_000_000_000,
    valuationNote: "2025년 직원 대상 주식 매각 보도 기준 추정",
    summary:
      "온라인 그래픽 디자인 툴을 제공하는 구독형 소프트웨어 플랫폼으로, 전 세계 개인·기업 사용자를 보유하고 있습니다.",
    ipoStatus: "2026년 상장 가능성 보도 (루머)",
    ipoDetail:
      "공동창업자가 향후 수년 내 상장 가능성을 시사한 바 있으며, 2026년이 후보 시점 중 하나로 거론되지만 공식 일정은 확정되지 않았습니다.",
    confidence: "낮음",
  },
  {
    id: "discord",
    name: "Discord",
    nameKo: "디스코드",
    sector: "소셜 · 커뮤니티 플랫폼",
    hq: "미국 캘리포니아",
    founded: 2015,
    valuationUsd: 15_000_000_000,
    valuationNote: "2024년 투자 라운드 보도 기준 추정",
    summary:
      "게이머와 다양한 온라인 커뮤니티가 사용하는 음성·텍스트 메시징 플랫폼입니다.",
    ipoStatus: "비공개 상장 신청 보도",
    ipoDetail:
      "2024년 비공개 형태로 미국 증권당국에 상장 신청서를 제출했다는 보도가 있었습니다. 비공개 신청 특성상 이후 진행 상황은 외부에서 확인하기 어렵습니다.",
    confidence: "중간",
  },
  {
    id: "cerebras",
    name: "Cerebras Systems",
    nameKo: "세레브라스",
    sector: "반도체 · AI 칩",
    hq: "미국 캘리포니아",
    founded: 2015,
    valuationUsd: 4_000_000_000,
    valuationNote: "2024년 투자 라운드 보도 기준 추정",
    summary:
      "AI 학습·추론에 특화된 초대형 단일 칩(웨이퍼 스케일 칩)을 설계하는 반도체 스타트업입니다.",
    ipoStatus: "나스닥 상장 신청, 심사 지연 보도",
    ipoDetail:
      "2024년 나스닥 상장을 신청했으나, 외국인투자 심사(CFIUS) 등 규제 이슈로 절차가 지연되고 있다는 보도가 있었습니다. 이후 진행 여부는 확인이 필요합니다.",
    confidence: "낮음",
  },
  {
    id: "plaid",
    name: "Plaid",
    nameKo: "플레이드",
    sector: "핀테크 · 데이터 인프라",
    hq: "미국 캘리포니아",
    founded: 2013,
    valuationUsd: 6_100_000_000,
    valuationNote: "2025년 다운라운드 보도 기준 추정",
    summary:
      "은행 계좌와 핀테크 앱을 연결하는 데이터 연동 API를 제공하는 금융 인프라 기업입니다.",
    ipoStatus: "장기 상장 후보, 일정 불투명",
    ipoDetail:
      "한때 상장 유력 후보로 거론되었으나, 2021년 고점(약 134억 달러 추정) 대비 기업가치가 크게 하락한 것으로 보도되며 상장 일정은 불투명한 상태입니다.",
    confidence: "낮음",
  },
  {
    id: "chime",
    name: "Chime",
    nameKo: "차임",
    sector: "핀테크 · 디지털 뱅킹",
    hq: "미국 캘리포니아",
    founded: 2013,
    valuationUsd: 25_000_000_000,
    valuationNote: "2021년 투자 라운드 기준, 이후 변동 가능성 있는 추정치",
    summary:
      "수수료 없는 모바일 중심 디지털 뱅킹 서비스를 제공하는 미국 대표 인터넷 전문은행입니다.",
    ipoStatus: "미국 증시 상장 신청 보도",
    ipoDetail:
      "2025년 나스닥 상장을 신청했다는 보도가 있었습니다. 신청 이후 실제 상장 완료 여부와 최종 공모가는 시점에 따라 달라질 수 있으므로 최신 정보를 확인해야 합니다.",
    confidence: "중간",
  },
];

export interface SectorShare {
  sector: string;
  count: number;
  companies: string;
}

export const UIP_SECTOR_DISTRIBUTION: SectorShare[] = [
  { sector: "핀테크 · 결제/뱅킹", count: 4, companies: "스트라이프, 클라르나, 플레이드, 차임" },
  { sector: "생성형 AI", count: 2, companies: "오픈AI, 앤트로픽" },
  { sector: "데이터 · AI / 반도체", count: 2, companies: "데이터브릭스, 세레브라스" },
  { sector: "디자인 · 구독형 소프트웨어", count: 1, companies: "캔바" },
  { sector: "소셜 · 커뮤니티", count: 1, companies: "디스코드" },
  { sector: "우주 · 항공", count: 1, companies: "스페이스X" },
];

export interface KoreaAccessItem {
  method: string;
  description: string;
  pros: string[];
  cons: string[];
}

export const UIP_KOREA_ACCESS: KoreaAccessItem[] = [
  {
    method: "상장 후 미국 증시 직접투자",
    description:
      "위 기업들이 실제로 상장에 성공하면, 국내 증권사의 해외주식 거래 서비스를 통해 나스닥·뉴욕증권거래소에서 직접 매수할 수 있습니다.",
    pros: [
      "상장 직후부터 일반 투자자도 동일하게 거래 가능",
      "국내 주요 증권사 앱에서 미국 주식 매매 지원",
    ],
    cons: [
      "상장 전 비상장 주식에는 일반 투자자가 접근하기 어려움",
      "상장 초기 변동성이 크고, 환율 변동 리스크가 추가됨",
    ],
  },
  {
    method: "관련 산업 ETF를 통한 간접 노출",
    description:
      "핀테크, 클라우드 소프트웨어, 반도체 등 관련 산업에 투자하는 미국 상장 ETF를 활용하면 개별 IPO 성공 여부와 무관하게 산업 전반에 분산 투자할 수 있습니다.",
    pros: [
      "특정 기업의 상장 지연·실패 리스크를 분산",
      "기존 상장 ETF는 즉시 매매 가능",
    ],
    cons: [
      "비상장 기업 자체에 대한 직접 노출은 아님",
      "ETF 구성 종목과 비중은 운용사·시점에 따라 다름",
    ],
  },
];

export interface IpoFaqItem {
  question: string;
  answer: string;
}

export const UIP_FAQ: IpoFaqItem[] = [
  {
    question: "이 리포트에 나온 기업가치는 정확한 수치인가요?",
    answer:
      "아닙니다. 모두 투자 라운드, 직원 대상 텐더오퍼, 언론 보도를 바탕으로 한 추정치이며, 비상장 기업 특성상 실제 가치와 차이가 있을 수 있습니다. 공식 재무제표 기준 수치가 아닙니다.",
  },
  {
    question: "여기 나온 기업들은 2026년에 모두 상장하나요?",
    answer:
      "아닙니다. 일부는 상장을 신청했다는 보도가 있을 뿐 확정된 일정이 아니며, 일부는 단순히 상장 가능성이 거론되는 수준(루머)입니다. 신뢰도 배지를 참고해 정보의 확실성을 구분해 주세요.",
  },
  {
    question: "한국에서 이 기업들의 비상장 주식을 직접 살 수 있나요?",
    answer:
      "일반적으로 어렵습니다. 미국 비상장 기업의 지분은 임직원, 기관·벤처 투자자 등 제한된 대상에게만 거래되며, 한국 개인 투자자가 접근할 수 있는 공식 채널은 사실상 없습니다. 상장 이후 직접투자나 관련 ETF를 통한 간접 노출이 현실적인 방법입니다.",
  },
  {
    question: "이 리포트의 정보는 언제 기준인가요?",
    answer:
      "2025년까지 보도된 자료를 기준으로 작성되었습니다. IPO 추진 현황은 빠르게 변할 수 있으므로, 투자 판단 전 반드시 최신 뉴스와 공식 공시를 확인하시기 바랍니다.",
  },
];

export interface RelatedLink {
  href: string;
  label: string;
  desc: string;
}

export const UIP_RELATED_LINKS: RelatedLink[] = [
  {
    href: "/reports/spacex-ipo-outlook-2026/",
    label: "스페이스X 상장(IPO) 전망 리포트",
    desc: "비상장 우주기업 스페이스X의 기업가치 추이와 IPO 전망",
  },
  {
    href: "/tools/etf-vs-direct-stock-10year-2026/",
    label: "ETF vs 직접투자 10년 비교",
    desc: "분산 투자와 개별 종목 투자의 장기 수익률 비교",
  },
  {
    href: "/tools/us-stock-korean-real-return-2026/",
    label: "미국 주식 환율 반영 실질 수익률 계산기",
    desc: "환율 변동을 반영한 미국 주식 투자 실질 수익 계산",
  },
];
