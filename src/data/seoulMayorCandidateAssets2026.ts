export type CandidateAssetSourceBadge = "선관위" | "재산공개" | "보도확인" | "계산" | "확인필요";
export type CandidateStatus = "등록" | "사퇴" | "등록무효" | "정정확인";
export type AssetTone = "neutral" | "primary" | "asset" | "caution" | "muted";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: CandidateAssetSourceBadge;
  note?: string;
}

export interface SeoulMayorCandidateAsset {
  id: string;
  candidateName: string;
  partyName: string;
  currentRole: string;
  birthYear?: number;
  status: CandidateStatus;
  totalAssetsManwon: number;
  realEstateManwon?: number;
  landManwon?: number;
  buildingManwon?: number;
  jeonseRightManwon?: number;
  depositsManwon?: number;
  securitiesManwon?: number;
  debtsManwon?: number;
  netAssetsManwon?: number;
  realEstateRatio?: number;
  financialAssetRatio?: number;
  assetTags: string[];
  sourceBadge: CandidateAssetSourceBadge;
  sourceIds: string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  summary: string;
  caution?: string;
}

export interface CandidateMetricCard {
  label: string;
  candidateId: string;
  value: string;
  description: string;
  tone: AssetTone;
  badge?: CandidateAssetSourceBadge;
}

export interface AssetCompositionSegment {
  key: "realEstate" | "deposit" | "securities" | "other";
  label: string;
  valueManwon: number;
  ratio: number;
  tone: AssetTone;
}

export interface SeoulMayorPolicySummary {
  candidateId: string;
  candidateName: string;
  housingSupplySummary: string;
  redevelopmentSummary: string;
  rentalHousingSummary: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface CandidateGuideStep {
  title: string;
  body: string;
  href?: string;
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface SeoulMayorCandidateAssetsData {
  meta: {
    slug: string;
    title: string;
    description: string;
    h1: string;
    eyebrow: string;
    updatedAt: string;
    electionDate: string;
    dataBasis: string;
    caution: string;
  };
  sources: SourceInfo[];
  candidates: SeoulMayorCandidateAsset[];
  metricCards: CandidateMetricCard[];
  policySummaries: SeoulMayorPolicySummary[];
  guideSteps: CandidateGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}

export function calcNetAssets(candidate: SeoulMayorCandidateAsset) {
  if (candidate.debtsManwon === undefined || candidate.debtsManwon === null) return null;
  return candidate.totalAssetsManwon - candidate.debtsManwon;
}

export function calcRealEstateRatio(candidate: SeoulMayorCandidateAsset) {
  if (!candidate.totalAssetsManwon || !candidate.realEstateManwon) return null;
  return (candidate.realEstateManwon / candidate.totalAssetsManwon) * 100;
}

export function calcFinancialAssetRatio(candidate: SeoulMayorCandidateAsset) {
  if (!candidate.totalAssetsManwon) return null;
  const financial = (candidate.depositsManwon ?? 0) + (candidate.securitiesManwon ?? 0);
  if (!financial) return null;
  return (financial / candidate.totalAssetsManwon) * 100;
}

export function calcOtherAssets(candidate: SeoulMayorCandidateAsset) {
  return Math.max(
    candidate.totalAssetsManwon -
      (candidate.realEstateManwon ?? 0) -
      (candidate.depositsManwon ?? 0) -
      (candidate.securitiesManwon ?? 0),
    0
  );
}

export function formatManwon(value?: number | null) {
  if (value === undefined || value === null) return "확인 필요";
  if (Math.abs(value) >= 10000) {
    const eok = value / 10000;
    return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억`;
  }
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}

const NEC_URL = "https://info.nec.go.kr/";
const POLICY_URL = "https://policy.nec.go.kr/";

export const SEOUL_MAYOR_SOURCES: SourceInfo[] = [
  {
    id: "nec-info",
    label: "중앙선거관리위원회 선거통계시스템",
    organization: "중앙선거관리위원회",
    url: NEC_URL,
    asOf: "2026-05-31",
    badge: "확인필요",
    note: "후보자별 세부 재산 항목은 선거통계시스템 원문에서 최종 확인이 필요합니다.",
  },
  {
    id: "policy-nec",
    label: "중앙선거관리위원회 정책·공약마당",
    organization: "중앙선거관리위원회",
    url: POLICY_URL,
    asOf: "2026-05-31",
    badge: "선관위",
  },
  {
    id: "press-asset",
    label: "서울시장 후보 재산 보도 확인값",
    organization: "언론 보도",
    url: "https://www.kukinews.com/article/view/kuk202605150005",
    asOf: "2026-05-15",
    badge: "보도확인",
    note: "총재산 headline 수치 확인용이며, 세부 항목은 원문 확인 후 업데이트합니다.",
  },
];

export const SEOUL_MAYOR_CANDIDATES: SeoulMayorCandidateAsset[] = [
  {
    id: "oh-sehoon",
    candidateName: "오세훈",
    partyName: "국민의힘",
    currentRole: "서울특별시장",
    status: "등록",
    totalAssetsManwon: 728960,
    assetTags: ["총재산 보도확인", "현직 시장", "세부항목 원문확인 필요"],
    sourceBadge: "보도확인",
    sourceIds: ["press-asset", "nec-info"],
    sourceLabel: "서울시장 후보 재산 보도 확인값",
    sourceUrl: "https://www.kukinews.com/article/view/kuk202605150005",
    sourceDate: "2026-05-15",
    summary:
      "보도 기준 총재산은 약 72.9억 원입니다. 부동산·예금·증권·채무 세부 항목은 선관위 원문 확인 후 분리 업데이트가 필요합니다.",
    caution: "현재 페이지의 세부 항목은 확인 필요로 표시합니다.",
  },
  {
    id: "jung-wonoh",
    candidateName: "정원오",
    partyName: "더불어민주당",
    currentRole: "전 성동구청장",
    status: "등록",
    totalAssetsManwon: 182389,
    assetTags: ["총재산 보도확인", "전 성동구청장", "세부항목 원문확인 필요"],
    sourceBadge: "보도확인",
    sourceIds: ["press-asset", "nec-info"],
    sourceLabel: "서울시장 후보 재산 보도 확인값",
    sourceUrl: "https://www.kukinews.com/article/view/kuk202605150005",
    sourceDate: "2026-05-15",
    summary:
      "보도 기준 총재산은 약 18.2억 원입니다. 부동산·예금·증권·채무 세부 항목은 선관위 원문 확인 후 분리 업데이트가 필요합니다.",
    caution: "현재 페이지의 세부 항목은 확인 필요로 표시합니다.",
  },
];

const richest = [...SEOUL_MAYOR_CANDIDATES].sort((a, b) => b.totalAssetsManwon - a.totalAssetsManwon)[0];
const second = [...SEOUL_MAYOR_CANDIDATES].sort((a, b) => a.totalAssetsManwon - b.totalAssetsManwon)[0];

export const SEOUL_MAYOR_METRIC_CARDS: CandidateMetricCard[] = [
  {
    label: "총재산 상단 후보",
    candidateId: richest.id,
    value: `${richest.candidateName} ${formatManwon(richest.totalAssetsManwon)}`,
    description: "2026년 5월 후보 등록 재산 보도 확인값 기준입니다.",
    tone: "primary",
    badge: "보도확인",
  },
  {
    label: "상대 후보 신고액",
    candidateId: second.id,
    value: `${second.candidateName} ${formatManwon(second.totalAssetsManwon)}`,
    description: "같은 보도 확인 기준으로 표시하며 원문 세부 항목은 추후 확인 대상입니다.",
    tone: "neutral",
    badge: "보도확인",
  },
  {
    label: "부동산 비중",
    candidateId: "both",
    value: "확인 필요",
    description: "토지·건물·전세권 세부값은 선관위 후보자 공개자료 원문 확인 후 계산합니다.",
    tone: "caution",
    badge: "확인필요",
  },
  {
    label: "순자산 추정",
    candidateId: "both",
    value: "확인 필요",
    description: "순자산은 총재산에서 채무를 차감한 단순 계산값이므로 채무 항목 확보 후 표시합니다.",
    tone: "muted",
    badge: "계산",
  },
];

export const SEOUL_MAYOR_POLICY_SUMMARIES: SeoulMayorPolicySummary[] = [
  {
    candidateId: "oh-sehoon",
    candidateName: "오세훈",
    housingSupplySummary: "주택 공급 확대와 도시 경쟁력 강화를 함께 내세우는 흐름으로 보도됐습니다.",
    redevelopmentSummary: "민간 정비사업, 재개발·재건축 속도와 규제 완화 관련 메시지가 핵심 축입니다.",
    rentalHousingSummary: "공공·민간 공급 조합과 주거 안정 장치를 함께 확인해야 합니다.",
    sourceLabel: "정책·공약마당에서 후보 공약 원문 확인",
    sourceUrl: POLICY_URL,
  },
  {
    candidateId: "jung-wonoh",
    candidateName: "정원오",
    housingSupplySummary: "주택 공급과 주거 안정, 생활권 기반 도시정책을 함께 제시하는 흐름으로 보도됐습니다.",
    redevelopmentSummary: "도시정비와 공급 속도를 강조하되 세부 실행 방식은 공약집 원문 확인이 필요합니다.",
    rentalHousingSummary: "전월세·공공주거·청년 주거 정책은 정책·공약마당에서 별도 확인해야 합니다.",
    sourceLabel: "정책·공약마당에서 후보 공약 원문 확인",
    sourceUrl: POLICY_URL,
  },
];

export const SEOUL_MAYOR_GUIDE_STEPS: CandidateGuideStep[] = [
  {
    title: "선거통계시스템 접속",
    body: "중앙선거관리위원회 선거통계시스템에서 선거명과 지역을 선택합니다.",
    href: NEC_URL,
  },
  {
    title: "제9회 전국동시지방선거 선택",
    body: "후보자 메뉴에서 서울특별시장 선거 후보자 목록으로 이동합니다.",
  },
  {
    title: "후보자명 클릭",
    body: "후보자 상세 페이지에서 재산, 병역, 전과, 납세, 학력, 경력 공개자료를 확인합니다.",
  },
  {
    title: "정책·공약마당 확인",
    body: "재산 공개자료와 별도로 후보별 공약집을 열어 부동산·주거 공약을 확인합니다.",
    href: POLICY_URL,
  },
];

export const SEOUL_MAYOR_RELATED_LINKS: RelatedReportLink[] = [
  {
    label: "전국 후보 재산 순위 TOP 50",
    href: "/reports/local-election-candidate-assets-ranking-2026/",
    description: "지방선거 후보 재산을 전국 단위로 비교합니다.",
  },
  {
    label: "광역단체장 후보 재산 비교",
    href: "/reports/governor-mayor-candidate-assets-comparison-2026/",
    description: "시도지사 후보 재산을 지역별로 비교합니다.",
  },
  {
    label: "서울 구별 아파트 실거래가",
    href: "/reports/seoul-apartment-price-2026/",
    description: "서울 부동산 가격 흐름을 구별로 확인합니다.",
  },
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    description: "공시가격 기준 보유세를 추정합니다.",
  },
];

export const SEOUL_MAYOR_FAQ = [
  {
    q: "서울시장 후보 재산은 어디서 확인할 수 있나요?",
    a: "중앙선거관리위원회 선거통계시스템의 후보자 정보 공개자료에서 확인할 수 있습니다. 후보자명 상세 화면에서 재산, 병역, 전과, 납세, 학력, 경력을 함께 확인하세요.",
  },
  {
    q: "오세훈·정원오 후보 재산은 어떤 기준인가요?",
    a: "이 페이지의 headline 총재산은 2026년 5월 후보 등록 재산 보도 확인값을 기준으로 먼저 정리했습니다. 세부 항목은 선관위 원문 확인 후 업데이트가 필요한 항목은 확인 필요로 표시합니다.",
  },
  {
    q: "부동산 신고액은 현재 아파트 시세인가요?",
    a: "아닙니다. 부동산 신고액은 공개자료의 신고 기준 금액이며 실제 현재 시세, 실거래가, 호가와 다를 수 있습니다.",
  },
  {
    q: "후보 재산에는 배우자 재산도 포함되나요?",
    a: "후보자 재산 공개자료에는 후보자 본인 외 배우자와 직계존비속 등 신고 대상 가족 재산이 포함될 수 있습니다. 원문에서 신고 대상 범위를 함께 확인해야 합니다.",
  },
  {
    q: "채무가 있으면 총재산은 어떻게 봐야 하나요?",
    a: "총재산만 보지 말고 채무와 순자산 추정값을 함께 봐야 합니다. 순자산 추정은 총재산에서 채무를 뺀 단순 계산값이며 공식 순위와 다를 수 있습니다.",
  },
  {
    q: "후보 재산과 부동산 공약은 어떻게 연결해서 봐야 하나요?",
    a: "개인 재산 공개자료와 서울시 부동산 정책 공약은 별도 정보입니다. 함께 참고할 수는 있지만 하나가 다른 하나의 옳고 그름을 자동으로 증명하지는 않습니다.",
  },
  {
    q: "선거 후에도 이 페이지를 볼 수 있나요?",
    a: "선거 후에도 후보자 공개자료 아카이브로 유지할 수 있습니다. 당선자 재산 공개나 정정 자료가 나오면 기준일을 바꿔 업데이트할 수 있습니다.",
  },
];

export const seoulMayorCandidateAssets2026: SeoulMayorCandidateAssetsData = {
  meta: {
    slug: "seoul-mayor-candidate-assets-2026",
    title: "서울시장 후보 재산·부동산 비교 2026",
    description:
      "2026 서울시장 후보 오세훈·정원오의 재산 신고액을 총재산, 부동산, 예금, 증권, 채무 기준으로 비교합니다.",
    h1: "서울시장 후보 재산·부동산 비교 2026",
    eyebrow: "선거 데이터 리포트",
    updatedAt: "2026.05.31",
    electionDate: "2026.06.03",
    dataBasis: "후보자 등록 재산 보도 확인값 및 선관위 원문 확인 가이드",
    caution:
      "이 페이지는 후보자 공개자료를 이해하기 쉽게 정리한 참고 리포트입니다. 재산 신고액은 실제 현재 시세와 다를 수 있고, 자료 정정·사퇴·등록무효에 따라 바뀔 수 있습니다.",
  },
  sources: SEOUL_MAYOR_SOURCES,
  candidates: SEOUL_MAYOR_CANDIDATES,
  metricCards: SEOUL_MAYOR_METRIC_CARDS,
  policySummaries: SEOUL_MAYOR_POLICY_SUMMARIES,
  guideSteps: SEOUL_MAYOR_GUIDE_STEPS,
  relatedLinks: SEOUL_MAYOR_RELATED_LINKS,
  faq: SEOUL_MAYOR_FAQ,
  seoIntro: [
    "서울시장 후보 재산 공개자료는 단순히 누가 더 많은 재산을 신고했는지를 보는 표가 아닙니다. 총재산, 부동산, 금융자산, 채무를 나눠 보면 후보별 자산 구조가 더 분명하게 보이고, 신고 기준의 한계도 함께 이해할 수 있습니다.",
    "2026년 서울시장 선거에서는 오세훈 국민의힘 후보와 정원오 더불어민주당 후보의 재산 신고액이 주요 검색 수요로 이어지고 있습니다. 이 페이지는 headline 금액을 크게 보여주되, 공식 원문 확인이 필요한 세부 항목은 확인 필요로 분리해 표시합니다.",
    "부동산 신고액은 현재 아파트 시세가 아니며, 예금과 증권 역시 신고 시점의 평가액입니다. 채무가 포함된 경우 총재산만 보면 자산 구조를 오해할 수 있으므로, 순자산 추정과 비중 계산은 별도 계산값으로 구분해야 합니다.",
    "후보자의 개인 재산과 서울시 부동산 공약은 함께 참고할 수 있지만 같은 정보는 아닙니다. 재산 공개자료는 후보자의 신고 내역이고, 부동산 공약은 서울시 정책 방향이므로 각각의 출처와 기준을 따로 확인하는 것이 좋습니다.",
  ],
  seoCriteria: [
    "중앙선거관리위원회 후보자 공개자료를 최종 기준으로 삼으며, 원문 미확인 세부 항목은 확인 필요로 표시합니다.",
    "금액은 신고 기준 금액이며 실제 현재 시세, 실거래가, 호가와 다를 수 있습니다.",
    "순자산과 비중은 이해를 돕기 위한 단순 계산값이며 공식 선관위 수치가 아닙니다.",
    "후보 사퇴, 등록무효, 자료 정정이 있으면 비교표와 기준일이 바뀔 수 있습니다.",
  ],
};

