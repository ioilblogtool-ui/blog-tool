// ── 타입 ──────────────────────────────────────────

export type PriceTableRow = {
  size: string;
  basicPrice: number;
  packagePrice: number;
  note?: string;
};

export type SupplyTimelineItem = {
  period: string;
  label: string;
  detail: string;
  status: "완료" | "목표";
};

export type OverseasRow = {
  region: string;
  partner: string;
  model: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

// ── 데이터 ────────────────────────────────────────

export const SAMH_META = {
  slug: "samsung-ai-modular-home-2026",
  title: "삼성 AI 모듈러 홈, 가격과 공급 계획 총정리",
  seoTitle: "삼성 AI 모듈러 홈 2026 완전 정리 | 평당 가격 얼마",
  seoDescription:
    "삼성 AI 모듈러 홈 평당 500만~650만원 가격 기준과 10·30·40평형 예상 비용을 정리했습니다. 3년 1만호 공급계획, 화성 쇼룸, 클레이튼 해외 사업까지 확인하세요.",
  description: "평당 가격 기준과 평형별 예상 비용, 3년 1만호 공급 로드맵을 한눈에 정리한 리포트입니다.",
  updatedAt: "2026-07-07",
  dataNote:
    "평당 가격(기본형 약 500만원, AI 가전 패키지 포함 약 600만~650만원)은 2026-06-24 보도 기준이며, 삼성전자·공간제작소의 공식 확정 견적이 아닙니다. 부지 매입비, 기초공사, 인허가, 상하수도 인입 등 부대비용은 포함되지 않으므로 실제 총비용은 더 늘어날 수 있습니다.",
};

// 평당 500만원(기본형) / 650만원(AI 가전 패키지) 기준 단순 곱셈 — 부대비용 제외
export const SAMH_PRICE_TABLE: PriceTableRow[] = [
  { size: "10평", basicPrice: 50_000_000, packagePrice: 65_000_000 },
  { size: "20평", basicPrice: 100_000_000, packagePrice: 130_000_000, note: "화성 쇼룸 전시 평형" },
  { size: "30평", basicPrice: 150_000_000, packagePrice: 195_000_000 },
  { size: "40평", basicPrice: 200_000_000, packagePrice: 260_000_000 },
];

export const SAMH_SUPPLY_TIMELINE: SupplyTimelineItem[] = [
  {
    period: "2026년 6월",
    label: "화성 쇼룸 공개",
    detail: "경기 화성시에 공간제작소와 공동 기획한 쇼룸 2개소(100평형·20평형) 오픈",
    status: "완료",
  },
  {
    period: "3년 내",
    label: "1만호 공급",
    detail: "단독주택 중심으로 누적 1만호 공급이 목표",
    status: "목표",
  },
  {
    period: "2029년",
    label: "3만호 공급 + 사업 확장",
    detail: "아파트·공공주택·빌딩 등으로 모듈러 홈 사업 영역 확장",
    status: "목표",
  },
];

export const SAMH_OVERSEAS: OverseasRow[] = [
  {
    region: "북미",
    partner: "클레이턴 홈스",
    model: "클레이턴이 신규 공급하는 주택에 삼성 AI 가전 패키지를 결합해 공급 (시공은 클레이턴, 가전·AI 홈 솔루션은 삼성전자 담당)",
  },
];

export const SAMH_FAQ: FaqItem[] = [
  {
    question: "삼성 AI 모듈러 홈은 얼마인가요?",
    answer:
      "보도 기준 평당 약 500만원(기본형)이며, 에어컨·냉장고·TV 등 필수 가전과 스마트 조명·홈캠·로봇청소기 등 20여 종을 묶은 AI 가전 패키지를 포함하면 평당 600만~650만원 수준입니다. 부지 매입비와 인허가 비용은 별도입니다.",
  },
  {
    question: "모듈러 주택은 일반 주택과 무엇이 다른가요?",
    answer:
      "공장에서 방·욕실 단위 모듈을 미리 제작한 뒤 부지에서 조립하는 방식으로, 현장에서 처음부터 골조를 세우는 일반 건축보다 공사 기간이 짧습니다. 시공은 모듈러 목조주택 전문사인 공간제작소가 맡고, 삼성전자는 AI 가전과 스마트싱스 기반 홈 솔루션 결합을 담당합니다.",
  },
  {
    question: "삼성 AI 모듈러 홈은 어디서 볼 수 있나요?",
    answer: "경기 화성시에 공간제작소와 공동으로 만든 쇼룸이 있으며, 100평형과 20평형 두 개 동으로 구성되어 있습니다.",
  },
  {
    question: "아파트에도 적용되나요?",
    answer:
      "현재는 단독주택 중심 사업이며, 삼성전자는 3년 내 1만호·2029년 3만호 공급을 거치며 아파트·공공주택·빌딩으로 사업 영역을 확장할 계획이라고 밝혔습니다. 아직 구체적인 아파트 적용 일정은 공개되지 않았습니다.",
  },
  {
    question: "해외에서도 살 수 있나요?",
    answer:
      "북미에서는 현지 최대 모듈러 주택 업체인 클레이턴 홈스와 협업 중입니다. 국내처럼 삼성전자가 직접 시공하는 방식이 아니라, 클레이턴이 공급하는 신규 주택에 삼성 AI 가전 패키지를 결합하는 방식입니다.",
  },
];

export const SAMH_SEO_INTRO = [
  "삼성전자가 2026년 6월 24일 경기 화성 쇼룸에서 'AI 모듈러 홈' 사업을 공식 발표했습니다. 공간제작소와 협업한 모듈러 목조주택에 삼성 AI 가전과 스마트싱스 기반 홈 솔루션을 패키지로 결합한 형태로, 3년 내 1만호, 2029년까지 3만호 공급을 목표로 내걸었습니다.",
  "가격은 평당(3.3㎡) 약 500만원이 기본 건축비이며, 에어컨·냉장고·TV 등 필수 가전과 스마트 조명·홈캠·로봇청소기 등 20여 종의 스마트홈 연동 기기를 묶은 AI 가전 패키지를 포함하면 평당 600만~650만원 수준으로 올라갑니다. 고객은 부지 규모와 라이프스타일에 맞춰 10평형부터 40평형까지 선택할 수 있습니다.",
  "다만 이 가격은 순수 건축비 기준이며, 부지 매입비, 기초공사, 인허가, 상하수도 인입 같은 부대비용은 포함되지 않습니다. 실제 총 예산을 계산할 때는 이 부분을 반드시 별도로 고려해야 합니다.",
  "해외 사업은 국내와 결이 다릅니다. 북미에서는 삼성전자가 직접 시공하지 않고, 현지 최대 모듈러 주택 업체인 클레이턴 홈스가 공급하는 신규 주택에 AI 가전 패키지만 결합해 공급하고 있습니다.",
];

export const SAMH_SEO_CRITERIA = [
  "평당가(기본형 약 500만원, AI 가전 패키지 포함 약 600만~650만원)는 2026-06-24 보도 기준이며 공식 확정 견적이 아닙니다.",
  "평형별 예상 비용표는 평형 × 평당가 단순 곱셈이며, 부지·인허가·기초공사 등 부대비용은 포함하지 않습니다.",
  "3년 1만호·2029년 3만호는 삼성전자가 발표한 목표치이며, 실제 공급 실적과 다를 수 있습니다.",
  "국내(직접 시공+가전 결합)와 북미(가전 패키지만 공급, 클레이턴 홈스 협업)는 사업 모델이 다릅니다.",
];

export const SAMH_RELATED_LINKS: RelatedLink[] = [
  { href: "/tools/home-purchase-fund/", label: "내 집 마련 자금 계산기", description: "예산과 대출 조건을 넣어 내 집 마련 자금 계획을 확인합니다." },
  { href: "/tools/real-estate-acquisition-tax/", label: "부동산 취득세 계산기", description: "신축 주택 취득 시 예상 취득세를 계산합니다." },
  { href: "/tools/apartment-holding-tax/", label: "아파트 보유세 계산기", description: "보유세·재산세 예상 금액을 확인합니다." },
  { href: "/reports/seoul-housing-2016-vs-2026/", label: "서울 집값 2016 vs 2026", description: "아파트 가격 흐름과 대안 주거 형태를 비교하는 맥락 자료입니다." },
];
