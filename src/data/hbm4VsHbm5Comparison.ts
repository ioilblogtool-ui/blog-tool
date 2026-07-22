export type HbmGenerationStatus = "production" | "productionExpanding" | "sampleQualification";
export type HbmBeneficiaryDirectness = "veryHigh" | "high" | "medium" | "indirect";

export interface HbmGeneration {
  id: "hbm3e" | "hbm4" | "hbm4e";
  name: string;
  interfaceWidthBit: number;
  pinSpeedLabel: string;
  bandwidthLabel: string;
  capacityLabel: string;
  status: HbmGenerationStatus;
  statusLabel: string;
  note: string;
}

export interface HbmTimelineEntry {
  date: string;
  company: string;
  label: string;
  description: string;
}

export interface HbmPositionRow {
  aspect: string;
  samsung: string;
  skhynix: string;
  micron: string;
}

export interface HbmChallengeRow {
  challenge: string;
  reason: string;
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
  title: "HBM4·HBM4E 차이 총정리 | 삼성전자·SK하이닉스·마이크론 비교",
  description:
    "HBM3E, HBM4, HBM4E의 인터페이스 폭, 핀 속도, 대역폭, 용량과 양산 현황을 비교합니다. 삼성전자·SK하이닉스·마이크론 경쟁 구도와 파운드리·패키징·테스트 수혜기업까지 확인하세요.",
  h1: "HBM3E vs HBM4 vs HBM4E 비교",
  updatedAt: "2026-07-22",
  disclaimer: "이 콘텐츠는 투자 권유가 아닙니다. 투자 판단은 본인 책임이며 전문가 상담을 권장합니다.",
  hbm5ExclusionNote:
    "HBM5는 차기 세대로 거론되지만, 2026년 7월 기준 삼성전자·SK하이닉스·마이크론의 공식 규격 발표나 확정된 제품 사양을 확인하기 어려워 이번 비교에서는 제외했습니다.",
};

// 대역폭 = 핀당 전송속도 × 인터페이스 폭 ÷ 8. 표준(JEDEC)과 제조사 발표 제품 사양을 구분해 범위로 표시한다.
export const HBM_GENERATIONS: HbmGeneration[] = [
  {
    id: "hbm3e",
    name: "HBM3E",
    interfaceWidthBit: 1024,
    pinSpeedLabel: "최대 약 9.2~9.8Gbps/pin",
    bandwidthLabel: "약 1.2TB/s",
    capacityLabel: "24GB · 36GB",
    status: "production",
    statusLabel: "주력 양산",
    note: "2024~2026년 AI 가속기 주력 메모리, SK하이닉스가 초기 시장 주도",
  },
  {
    id: "hbm4",
    name: "HBM4",
    interfaceWidthBit: 2048,
    pinSpeedLabel: "표준 8Gbps · 제품 10~13Gbps",
    bandwidthLabel: "표준 약 2.0TB/s · 제품 최대 3.3TB/s",
    capacityLabel: "24~36GB(향후 48GB)",
    status: "productionExpanding",
    statusLabel: "양산 확대",
    note: "인터페이스 폭 HBM3E 대비 2배. 삼성전자 2026-02 상용 양산 출하, 마이크론 2026년 1분기 대량 출하 시작",
  },
  {
    id: "hbm4e",
    name: "HBM4E",
    interfaceWidthBit: 2048,
    pinSpeedLabel: "안정 14Gbps · 확장 최대 16Gbps",
    bandwidthLabel: "공식 발표 최대 3.6TB/s(16Gbps 이론치 약 4.1TB/s)",
    capacityLabel: "48GB(향후 64GB)",
    status: "sampleQualification",
    statusLabel: "고객 샘플 공급 · 인증 단계",
    note: "삼성전자 2026-05-29, SK하이닉스 2026-06-18에 12단 48GB 샘플을 주요 고객에 공급 — 상용 양산 이전 단계",
  },
];

export const HBM_TIMELINE: HbmTimelineEntry[] = [
  { date: "2025-03", company: "SK하이닉스", label: "HBM4 고객 샘플 공급", description: "12단 HBM4 샘플을 주요 고객에 공급" },
  { date: "2025-09", company: "SK하이닉스", label: "HBM4 개발 완료", description: "HBM4 개발 완료 및 양산 체제 구축 발표" },
  { date: "2026-02-12", company: "삼성전자", label: "HBM4 상용 양산 출하", description: "업계 최초 상용 HBM4 양산·출하 발표" },
  { date: "2026-Q1", company: "마이크론", label: "HBM4 대량 출하 시작", description: "HBM4 36GB 12단 제품 양산 출하 시작" },
  { date: "2026-05-29", company: "삼성전자", label: "HBM4E 샘플 공급", description: "12단 48GB HBM4E 샘플을 주요 고객에 출하" },
  { date: "2026-06-18", company: "SK하이닉스", label: "HBM4E 샘플 공급", description: "12단 48GB HBM4E 샘플을 주요 고객에 출하" },
  { date: "2026 하반기", company: "업계", label: "HBM4 공급 확대", description: "HBM4 공급 확대와 HBM4E 고객 인증 진행" },
];

export const HBM_POSITION_TABLE: HbmPositionRow[] = [
  { aspect: "HBM3E 시장 위치", samsung: "후발 추격", skhynix: "시장 선도", micron: "점유율 확대" },
  { aspect: "HBM4 개발·샘플", samsung: "개발·고객 인증 진행", skhynix: "2025년 3월 샘플 공급", micron: "2025년 샘플 공급" },
  { aspect: "HBM4 양산", samsung: "2026년 2월 상용 양산·출하 발표", skhynix: "2025년 9월 양산 체제 구축", micron: "2026년 1분기 대량 출하" },
  { aspect: "HBM4 핀 속도(제품)", samsung: "안정 11.7 · 최대 13Gbps", skhynix: "10Gbps 이상 공개", micron: "11Gbps 이상 공개" },
  { aspect: "HBM4 최대 대역폭(제품)", samsung: "최대 3.3TB/s", skhynix: "2TB/s 이상 공개", micron: "2.8TB/s 이상 공개" },
  { aspect: "베이스 다이", samsung: "자사 파운드리 4nm", skhynix: "파운드리 협업 확대", micron: "로직 공정 활용" },
  { aspect: "HBM4E 샘플", samsung: "2026년 5월 29일", skhynix: "2026년 6월 18일", micron: "공개 로드맵 확인 필요" },
  { aspect: "패키징 강점", samsung: "턴키 역량(설계~패키징 통합)", skhynix: "MR-MUF 공정·열 특성", micron: "HBM3E 기반 생산 효율성" },
];

export const HBM_POSITION_SUMMARY =
  "HBM3E 시장에서는 SK하이닉스가 엔비디아 공급 경험과 양산 안정성을 바탕으로 선도했습니다. HBM4에서는 삼성전자가 2026년 2월 상용 양산 출하를 먼저 발표했고, 마이크론도 2026년 1분기 대량 출하에 들어가면서 경쟁 구도가 3강으로 다변화됐습니다. SK하이닉스는 기존 고객 관계, MR-MUF 패키징과 열 관리 역량을 바탕으로 HBM4·HBM4E 경쟁에 대응하고 있습니다. 삼성전자가 HBM4 양산 출하를 먼저 발표했다는 사실만으로 시장 점유율 우위까지 확정됐다고 보기는 어렵습니다 — 개발 완료·샘플 공급·양산 체제 구축·상용 출하는 서로 다른 단계입니다.";

export const HBM_BASE_DIE_EXPLANATION =
  "HBM3E까지는 메모리 제조사의 표준화된 베이스 다이가 GPU와 HBM을 연결하는 역할에 가까웠습니다. HBM4부터는 베이스 다이가 단순 연결층을 넘어 메모리 제어와 고객 맞춤형 로직 기능을 담당하는 방향으로 발전하고 있습니다. 이 때문에 메모리 셀 미세공정뿐 아니라 파운드리 공정, 설계 IP, 인터포저와 첨단 패키징 역량이 함께 중요해집니다. 삼성전자는 HBM4에 1c D램과 자사 4나노 로직 베이스 다이를 결합했다고 공식 발표했습니다.";

export const HBM_BANDWIDTH_EXPLANATION =
  "대역폭은 핀당 전송속도 × 인터페이스 폭 ÷ 8로 계산합니다. HBM4는 JEDEC 표준 8Gbps 기준으로는 약 2.0TB/s이지만, 삼성전자 제품 사양(최대 13Gbps)을 적용하면 약 3.3TB/s로 계산됩니다. HBM4E는 삼성전자·SK하이닉스가 공식 발표한 안정 동작 속도 14Gbps 기준 최대 3.6TB/s이며, 확장 가능 속도인 16Gbps를 이론상 적용하면 약 4.1TB/s입니다. 왜 인터페이스 폭이 넓어졌는지도 함께 보면, HBM3E는 핀 속도를 높여 대역폭을 확대했지만 속도가 높아질수록 전력 소비와 신호 무결성 부담이 커집니다. HBM4는 인터페이스 폭을 1,024bit에서 2,048bit로 넓혀 한 번에 전달하는 데이터 양을 늘리는 방식으로 대역폭을 확대했습니다.";

export const HBM_CHALLENGE_TABLE: HbmChallengeRow[] = [
  { challenge: "발열", reason: "속도와 적층 수 증가" },
  { challenge: "수율", reason: "D램 다이와 베이스 다이 결합 복잡성" },
  { challenge: "패키징", reason: "TSV·본딩 정밀도 상승" },
  { challenge: "전력 효율", reason: "데이터센터 전력 한계" },
  { challenge: "고객 인증", reason: "GPU·ASIC과 함께 검증 필요" },
  { challenge: "공급 능력", reason: "첨단 D램 웨이퍼와 후공정 병목" },
];

export const HBM_INVESTOR_KPIS = [
  "HBM 출하량 증가율",
  "HBM 매출 비중",
  "일반 D램 대비 HBM 가격 프리미엄",
  "12단·16단 제품 비중",
  "고객 인증 통과 여부",
  "HBM 설비투자 규모",
  "첨단 D램 웨이퍼 투입량",
  "패키징 장비 수주잔고",
  "영업이익률과 수율",
  "엔비디아·ASIC 고객 다변화",
];

export const HBM_DRAM_IMPACT_NOTE =
  "HBM은 같은 용량의 일반 D램보다 더 많은 웨이퍼와 복잡한 후공정을 필요로 합니다. 메모리 업체가 HBM 생산 비중을 확대하면 범용 D램 공급 여력이 줄어들 수 있고, 이는 서버·PC·모바일 D램 가격에도 영향을 줄 수 있습니다. 다만 HBM이 일반 D램보다 정확히 몇 배의 웨이퍼를 쓰는지는 적층 수와 수율에 따라 달라지므로, 검증된 출처 없이 고정된 배수로 단정하지 않습니다.";

// VC_COMPANIES(semiconductorValueChain.ts)에서 필터링할 HBM 밸류체인 기업 id — 신규 기업 프로필 중복 작성 금지
export const HBM_RELATED_COMPANY_IDS = ["samsung", "skhynix", "micron", "tsmc", "hms", "amkor", "speta", "isc", "lino", "okins"];

export interface HbmBeneficiaryInfo {
  tier: string; // "① HBM 제조사" 등
  directness: HbmBeneficiaryDirectness;
  connection: string;
  note: string;
  caveat?: string;
}

export const HBM_BENEFICIARY_INFO: Record<string, HbmBeneficiaryInfo> = {
  samsung: { tier: "① HBM 제조사", directness: "veryHigh", connection: "HBM·D램·파운드리·패키징", note: "HBM4 세계 최초 상용 양산 출하 + HBM4E 샘플 공급으로 3강 경쟁의 한 축" },
  skhynix: { tier: "① HBM 제조사", directness: "veryHigh", connection: "HBM 설계·제조·패키징", note: "HBM3E 시장 선도, HBM4 개발·양산체제 구축을 가장 먼저 완료. MR-MUF 패키징·열 특성이 강점" },
  micron: { tier: "① HBM 제조사", directness: "veryHigh", connection: "HBM·D램 제조", note: "미국 유일 대형 메모리사. 2026년 1분기 HBM4 대량 출하 시작" },
  tsmc: { tier: "② 파운드리·베이스 다이", directness: "high", connection: "커스텀 베이스 다이·AI GPU 파운드리", note: "SK하이닉스 등 HBM4 베이스 다이 위탁 생산과 맞물려 물량 증가" },
  hms: { tier: "③ 적층·패키징 장비·소재", directness: "high", connection: "HBM 적층 패키징 장비(TC 본더)", note: "HBM 세대 전환에 따른 TC 본더 수요 확대 — 수주잔고·장비 출하가 핵심 확인 지표" },
  amkor: { tier: "③ 적층·패키징 장비·소재", directness: "high", connection: "첨단 패키징(OSAT)", note: "어드밴스드 패키징 물량 증가 가능성 — 고객·제품 믹스는 별도 확인 필요" },
  speta: {
    tier: "③ 적층·패키징 장비·소재",
    directness: "indirect",
    connection: "AI 서버·네트워크 장비용 고다층 PCB(MLB)",
    note: "AI 가속기·네트워크 장비 확대로 고다층 MLB 수요가 늘어날 수 있는 AI 인프라 간접 수혜 기업입니다. HBM을 직접 적층하는 패키지 기판과는 구분됩니다.",
  },
  isc: { tier: "④ 검사·서버 인프라", directness: "medium", connection: "HBM·AI 칩 테스트 소켓", note: "HBM 출하량이 늘수록 반복 소모품 성격의 테스트 소켓 수요가 함께 증가할 수 있음" },
  lino: {
    tier: "④ 검사·서버 인프라",
    directness: "medium",
    connection: "테스트 소켓·프로브핀",
    note: "고성능 반도체 테스트 수요 확대와 연결될 수 있으나, HBM向 매출이 차지하는 비중은 별도 확인이 필요합니다.",
  },
  okins: {
    tier: "④ 검사·서버 인프라",
    directness: "indirect",
    connection: "번인 테스트 소켓",
    note: "메모리·시스템반도체 신뢰성 검사 수요 확대와 간접적으로 연결될 수 있습니다.",
    caveat: "이 리포트에 표시되는 시가총액은 원화·달러 환산 과정에서 오차가 있을 수 있는 소형주입니다. 투자 판단 전 별도로 최신 시세를 확인하세요.",
  },
};

export const HBM_MYTH_CARDS: HbmMythCard[] = [
  { claim: "HBM 속도가 2배면 AI 성능도 2배다", fact: "그렇지 않습니다. 실제 AI 시스템 성능은 GPU 연산 능력, 메모리 용량, 소프트웨어 최적화, 네트워크와 전력 제한에 함께 좌우됩니다. 메모리 병목이 큰 작업일수록 HBM 대역폭 향상의 효과가 커집니다." },
  { claim: "세계 최초 발표 기업이 시장 점유율도 1위다", fact: "개발 완료, 샘플 공급, 고객 인증, 양산 준비, 상용 출하는 서로 다른 단계입니다. 최초 발표만으로 실제 출하량이나 점유율 우위를 판단하기는 어렵습니다." },
  { claim: "HBM4E는 HBM5다", fact: "HBM4E는 HBM4의 확장형으로 인터페이스 폭 2,048bit를 유지하면서 속도와 용량을 높인 제품입니다. 2026년 7월 기준 공식 발표가 없는 HBM5의 규격과는 구분해야 합니다." },
  { claim: "HBM 제조사가 모든 공정을 혼자 한다", fact: "HBM은 D램 제조뿐 아니라 로직 베이스 다이, TSV, 본딩, 인터포저, 첨단 패키징과 테스트가 결합된 제품입니다. 파운드리와 장비·소재 업체의 역할이 함께 커집니다." },
  { claim: "AI 관련 기업이면 모두 HBM 직접 수혜다", fact: "AI 서버 PCB나 네트워크 장비 기업은 AI 인프라 투자 수혜를 받을 수 있지만, HBM 출하량과 직접 연결되는 기업과는 수혜 경로가 다릅니다." },
];

export const HBM_FAQ: HbmFaqItem[] = [
  {
    question: "HBM4와 HBM4E의 가장 큰 차이는 무엇인가요?",
    answer: "인터페이스 폭은 모두 2,048bit이지만 HBM4E는 핀 속도, 용량, 전력 효율과 열 특성을 높인 확장형 제품입니다. 삼성전자와 SK하이닉스가 공개한 HBM4E 샘플은 12단 48GB, 안정 14Gbps·확장 최대 16Gbps 수준입니다.",
  },
  {
    question: "HBM4의 최대 대역폭은 2TB/s인가요, 3.3TB/s인가요?",
    answer: "둘 다 다른 기준에서 나온 값입니다. JEDEC 표준 8Gbps와 2,048bit를 적용하면 약 2.0TB/s이고, 삼성전자 제품의 최대 13Gbps를 적용하면 약 3.3TB/s입니다. 표준 최소 수준과 제조사 고성능 제품 사양을 구분해야 합니다.",
  },
  {
    question: "HBM5는 언제 출시되나요?",
    answer: "2026년 7월 기준 공식 규격과 주요 제조사의 확정된 양산 일정이 공개되지 않았습니다. 현재 제조사가 공식 발표한 차세대 제품 비교는 HBM4E까지로 제한하는 것이 안전합니다.",
  },
  {
    question: "삼성전자와 SK하이닉스 중 누가 앞서 있나요?",
    answer: "HBM3E의 고객 공급과 시장 지위에서는 SK하이닉스가 선도해 왔습니다. HBM4에서는 삼성전자가 2026년 2월 업계 최초 상용 양산 출하를 발표했고, SK하이닉스와 마이크론도 생산과 공급을 확대하고 있습니다. 제품 성능, 고객 인증, 수율과 실제 출하량을 함께 봐야 합니다.",
  },
  {
    question: "HBM4E는 이미 양산 중인가요?",
    answer: "삼성전자와 SK하이닉스는 2026년 5~6월 주요 고객에게 HBM4E 샘플을 공급했습니다. 양산은 고객 일정에 맞춰 시작될 예정이므로, 2026년 7월 기준으로는 '샘플 공급·고객 인증 단계'로 보는 것이 정확합니다.",
  },
  {
    question: "HBM 수혜기업은 어떻게 구분하나요?",
    answer: "HBM 매출이 직접 발생하는 메모리 제조사, 베이스 다이를 생산하는 파운드리, 적층 장비와 소재 기업, 테스트·AI 서버 인프라 기업으로 나눌 수 있습니다. 뒤쪽 단계일수록 실제 HBM 매출 연관성을 별도로 확인해야 합니다.",
  },
];

export const HBM_SEO_CONTENT = {
  introTitle: "HBM3E vs HBM4 vs HBM4E, 무엇이 달라지나",
  intro: [
    "HBM은 AI 가속기가 대규모 데이터를 빠르게 처리할 수 있도록 돕는 고대역폭 메모리입니다. 세대가 바뀔수록 핀당 전송속도뿐 아니라 인터페이스 폭, 적층 용량, 베이스 다이와 패키징 구조가 함께 발전합니다.",
    "HBM3E는 1,024bit 인터페이스와 약 1.2TB/s 수준의 대역폭을 제공하며 2024~2026년 AI 가속기의 주력 메모리로 사용되고 있습니다. HBM4는 인터페이스 폭을 2,048bit로 두 배 확대하고 로직 베이스 다이의 역할을 강화해, 표준 기준 약 2.0TB/s에서 제품 사양 기준 최대 3.3TB/s의 대역폭을 제공합니다.",
    "HBM4E는 HBM4의 인터페이스 구조를 유지하면서 핀 속도와 적층 용량, 전력 효율과 열 특성을 강화한 확장형 제품입니다. 2026년 7월 기준 삼성전자와 SK하이닉스는 안정 14Gbps·확장 최대 16Gbps, 12단 48GB HBM4E 샘플을 주요 고객에게 공급하고 있습니다.",
    "이 리포트에서는 HBM3E, HBM4, HBM4E의 인터페이스 폭, 전송속도, 대역폭, 용량과 공급 단계를 비교합니다. 또한 메모리 제조사뿐 아니라 파운드리, 적층·패키징 장비, 테스트와 AI 서버 인프라까지 HBM 밸류체인이 어떻게 연결되는지 정리합니다.",
    "대역폭 수치는 JEDEC 표준과 제조사별 제품 사양이 다를 수 있습니다. 개발 완료, 고객 샘플 공급, 양산 준비와 상용 출하는 서로 다른 단계이므로 각 기업의 발표도 단계별로 구분해 해석해야 합니다.",
  ],
  criteria: [
    "세대별 스펙과 타임라인은 2026년 7월 기준 삼성전자·SK하이닉스·마이크론 공식 발표 자료를 기준으로 정리했습니다.",
    "HBM5는 공식 규격·제품 사양이 확인되지 않아 이번 비교에서 제외했으며, 관련 내용은 별도로 명시합니다.",
    "대역폭은 JEDEC 표준 기준과 제조사 제품 사양 기준을 구분해 범위로 표시합니다.",
    "이 콘텐츠는 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있습니다.",
  ],
};

export const HBM_RELATED_LINKS = [
  { href: "/reports/semiconductor-value-chain/", label: "반도체 밸류체인 한눈에 보기" },
  { href: "/reports/semiconductor-etf-2026/", label: "미국·한국 반도체 ETF 비교 2026" },
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자 vs SK하이닉스 성과급 2026" },
  { href: "/tools/dca-investment-calculator/", label: "적립식 투자 수익 비교 계산기" },
];
