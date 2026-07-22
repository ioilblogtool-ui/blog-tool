export type HbmGenerationStatus = "legacy" | "production" | "earlyProduction" | "mockupOnly";

export interface HbmGeneration {
  id: "hbm3e" | "hbm4" | "hbm4e" | "hbm5";
  name: string;
  interfaceWidthBit: number | null;
  maxDataRateGbps: number | null;
  maxBandwidthTBs: number | null;
  status: HbmGenerationStatus;
  statusLabel: string;
  note: string;
}

export interface HbmTimelineEntry {
  date: string;
  label: string;
  description: string;
}

export interface HbmPositionRow {
  aspect: string;
  samsung: string;
  skhynix: string;
}

export interface HbmMythCard {
  claim: string;
  fact: string;
}

export interface HbmFaqItem {
  question: string;
  answer: string;
}

export const HBM_META = {
  slug: "hbm4-vs-hbm5-beneficiary-comparison",
  title: "HBM4 vs HBM5 차이 2026 | 스펙 비교와 수혜기업 총정리",
  description:
    "HBM3E부터 HBM5까지 세대별 인터페이스 폭·전송속도·대역폭 변화를 비교하고, 삼성전자·SK하이닉스부터 패키징·테스트 기업까지 수혜기업을 정리했습니다.",
  updatedAt: "2026-07-22",
  disclaimer: "이 콘텐츠는 투자 권유가 아닙니다. 투자 판단은 본인 책임이며 전문가 상담을 권장합니다.",
};

export const HBM_GENERATIONS: HbmGeneration[] = [
  {
    id: "hbm3e",
    name: "HBM3E",
    interfaceWidthBit: 1024,
    maxDataRateGbps: 9.6,
    maxBandwidthTBs: 1.2,
    status: "legacy",
    statusLabel: "양산 중(이전 세대)",
    note: "2024~2025년 주력, SK하이닉스가 시장 주도",
  },
  {
    id: "hbm4",
    name: "HBM4",
    interfaceWidthBit: 2048,
    maxDataRateGbps: 11.7,
    maxBandwidthTBs: 2.0,
    status: "production",
    statusLabel: "양산 중",
    note: "삼성전자 2026-02 세계 최초 양산 출하, 인터페이스 폭 HBM3E 대비 2배",
  },
  {
    id: "hbm4e",
    name: "HBM4E",
    interfaceWidthBit: 2048,
    maxDataRateGbps: 16,
    maxBandwidthTBs: 4.0,
    status: "earlyProduction",
    statusLabel: "양산 초기",
    note: "삼성 48GB 용량 공개, SK하이닉스 TSMC 최선단 공정으로 전환",
  },
  {
    id: "hbm5",
    name: "HBM5",
    interfaceWidthBit: null,
    maxDataRateGbps: null,
    maxBandwidthTBs: null,
    status: "mockupOnly",
    statusLabel: "목업 공개(스펙 미확정)",
    note: "삼성전자 실물 목업 공개, 베이스 다이 2nm 공정 예고",
  },
];

export const HBM_TIMELINE: HbmTimelineEntry[] = [
  { date: "2024~2025", label: "HBM3E 주력", description: "SK하이닉스 시장 주도" },
  { date: "2026-02", label: "삼성전자 HBM4 양산", description: "세계 최초 양산 출하" },
  { date: "2026-06", label: "SK하이닉스 HBM4 공급 발표", description: "삼성 발표 3주 만에 공급 발표, 컴퓨텍스에서 HBM4E·HBF 공개" },
  { date: "2026-06", label: "삼성전자 HBM5 목업 공개", description: "베이스 다이 2nm 공정 예고" },
  { date: "2026-07~", label: "HBM4 시장 확대", description: "삼성·SK·마이크론 점유율 경쟁 심화" },
];

export const HBM_POSITION_TABLE: HbmPositionRow[] = [
  { aspect: "HBM3E 시대", samsung: "추격 입장", skhynix: "시장 주도" },
  { aspect: "HBM4 양산", samsung: "2026년 2월 세계 최초 양산 출하", skhynix: "3주 뒤 공급 발표로 추격" },
  { aspect: "베이스 다이 공정", samsung: "자사 파운드리 4나노", skhynix: "TSMC 최선단 공정으로 전환" },
  { aspect: "HBM5 관련", samsung: "실물 목업 최초 공개, 2nm 베이스 다이 예고", skhynix: "컴퓨텍스에서 차세대 폼팩터(HBF 등) 공개" },
  { aspect: "2026년 종합 평가", samsung: "격차 좁히며 추격", skhynix: "방열 등 기존 강점으로 대응" },
];

export const HBM_MYTH_CARDS: HbmMythCard[] = [
  { claim: "HBM은 다 똑같은 메모리다", fact: "세대(HBM3E→HBM4→HBM5)마다 인터페이스 폭과 속도가 크게 달라지고, AI 칩 한 장에 들어가는 HBM 가치도 세대마다 달라진다." },
  { claim: "SK하이닉스가 항상 1위다", fact: "HBM3E 시대는 SK하이닉스가 주도했지만, HBM4부터는 삼성전자가 세계 최초 양산으로 추격하며 격차가 좁혀졌다." },
  { claim: "HBM5는 이미 출시됐다", fact: "2026년 7월 기준 HBM5는 실물 목업 공개 단계이며, 정식 양산 스펙과 시점은 아직 확정되지 않았다." },
];

// VC_COMPANIES(semiconductorValueChain.ts)에서 필터링할 HBM 관련 기업 id — 신규 기업 프로필 중복 작성 금지
export const HBM_RELATED_COMPANY_IDS = ["samsung", "skhynix", "micron", "tsmc", "hms", "amkor", "speta", "isc", "lino", "okins"];

export const HBM_BENEFICIARY_NOTES: Record<string, string> = {
  samsung: "HBM4 세계 최초 양산 + HBM5 목업 공개로 주도권 확대",
  skhynix: "TSMC 파운드리 전환으로 HBM4 이후 대응력 강화",
  micron: "메모리 3강 구도 유지, ASP 상승 수혜",
  tsmc: "SK하이닉스 HBM4·HBM4E 베이스 다이 위탁 생산 물량 증가",
  hms: "HBM 적층 패키징 장비(TC본더) 수요 확대",
  amkor: "어드밴스드 패키징 물량 증가",
  speta: "패키징 기판 수요 확대",
  isc: "고속·고발열 HBM 테스트 소켓 수요 확대",
  lino: "HBM 테스트 소켓 단가 방어력",
  okins: "HBM 검사 공정 확대 수혜",
};

export const HBM_FAQ: HbmFaqItem[] = [
  { question: "HBM4와 HBM5의 가장 큰 차이는 무엇인가요?", answer: "HBM4는 HBM3E 대비 인터페이스 폭이 2배로 늘어난 세대이며, HBM5는 아직 실물 목업 공개 단계로 베이스 다이에 2나노 공정 적용이 예고된 차세대 규격입니다. 정식 양산 스펙은 2026년 7월 기준 확정되지 않았습니다." },
  { question: "삼성전자와 SK하이닉스 중 누가 앞서 있나요?", answer: "HBM3E 시대는 SK하이닉스가 주도했지만, HBM4부터는 삼성전자가 2026년 2월 세계 최초로 양산 출하하며 격차를 좁혀 2026년 기준 백중세로 평가됩니다." },
  { question: "HBM 세대 전환의 수혜는 메모리 회사에만 있나요?", answer: "아닙니다. 베이스 다이를 위탁 생산하는 파운드리, 적층·패키징을 담당하는 후공정 기업, 테스트 소켓을 공급하는 검사장비 기업까지 밸류체인 전반에 영향이 미칩니다." },
  { question: "이 리포트의 종목 정보는 투자 추천인가요?", answer: "아닙니다. 공개된 보도자료와 언론 보도를 기준으로 정리한 참고 정보이며, 투자 판단과 책임은 본인에게 있습니다." },
];

export const HBM_SEO_CONTENT = {
  introTitle: "HBM4 vs HBM5, 무엇이 달라지나",
  intro: [
    "HBM(고대역폭메모리)은 AI 반도체의 핵심 부품으로, 세대가 바뀔 때마다 인터페이스 폭과 전송속도가 크게 달라집니다. 이 리포트는 현재 양산 중인 HBM4부터 목업 단계인 HBM5까지, 세대별 스펙 변화를 숫자로 비교하고 어떤 기업이 수혜를 받는지 정리했습니다.",
    "HBM3E 시대는 SK하이닉스가 시장을 주도했지만, 2026년 2월 삼성전자가 HBM4를 세계 최초로 양산 출하하면서 격차가 좁혀졌습니다. HBM4E에서는 삼성이 48GB 용량을 공개했고, SK하이닉스도 TSMC의 최선단 공정으로 베이스 다이 생산 방식을 전환하며 대응하고 있습니다.",
    "HBM 세대 전환의 수혜는 메모리 제조사에만 머무르지 않습니다. 베이스 다이를 위탁 생산하는 파운드리, 적층·패키징을 담당하는 후공정 기업, 테스트 소켓을 공급하는 검사장비 기업까지 밸류체인 전반에 영향이 미칩니다.",
    "HBM5는 2026년 7월 기준 삼성전자가 실물 목업을 공개한 단계이며, 베이스 다이에 2나노 공정을 적용할 계획이 알려졌을 뿐 정식 양산 스펙과 시점은 확정되지 않았습니다.",
  ],
  criteria: [
    "세대별 스펙과 경쟁 구도는 2026년 7월 기준 공개된 언론 보도를 기준으로 정리했습니다.",
    "HBM5는 목업 공개 단계이며 정식 스펙이 아닙니다.",
    "이 콘텐츠는 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있습니다.",
  ],
};

export const HBM_RELATED_LINKS = [
  { href: "/reports/semiconductor-value-chain/", label: "반도체 밸류체인 한눈에 보기" },
  { href: "/reports/semiconductor-etf-2026/", label: "미국·한국 반도체 ETF 비교 2026" },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
];
