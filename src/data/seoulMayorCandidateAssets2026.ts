export type CandidateAssetSourceBadge = "선관위" | "재산공개" | "보도확인" | "계산" | "확인필요";
export type CandidateStatus = "등록" | "사퇴" | "등록무효" | "확정확인";
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
    return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억 원`;
  }
  return `${value.toLocaleString("ko-KR")}만 원`;
}

export function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}

const NEC_URL = "https://info.nec.go.kr/";
const POLICY_URL = "https://policy.nec.go.kr/";
const PRESS_URL = "https://www.kukinews.com/article/view/kuk202605150005";

export const SEOUL_MAYOR_SOURCES: SourceInfo[] = [
  {
    id: "nec-info",
    label: "중앙선거관리위원회 선거통계시스템",
    organization: "중앙선거관리위원회",
    url: NEC_URL,
    asOf: "2026-05-31",
    badge: "확인필요",
    note: "후보자별 세부 재산 항목은 선관위 원문에서 최종 확인이 필요합니다.",
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
    url: PRESS_URL,
    asOf: "2026-05-15",
    badge: "보도확인",
    note: "총재산 headline 수치 확인용입니다. 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
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
    assetTags: ["오세훈 재산", "총재산 보도확인", "현직 시장", "세부 항목 확인 필요"],
    sourceBadge: "보도확인",
    sourceIds: ["press-asset", "nec-info"],
    sourceLabel: "서울시장 후보 재산 보도 확인값",
    sourceUrl: PRESS_URL,
    sourceDate: "2026-05-15",
    summary:
      "오세훈 재산 신고액 headline은 보도 확인 기준 약 72.9억 원입니다. 부동산, 예금, 증권, 채무 등 세부 항목은 선관위 원문 확인 전까지 확인 필요로 구분합니다.",
    caution: "현재 페이지의 세부 항목은 확인 필요로 표시합니다.",
  },
  {
    id: "jung-wonoh",
    candidateName: "정원오",
    partyName: "더불어민주당",
    currentRole: "성동구청장",
    status: "등록",
    totalAssetsManwon: 182389,
    assetTags: ["정원오 재산신고", "총재산 보도확인", "성동구청장", "세부 항목 확인 필요"],
    sourceBadge: "보도확인",
    sourceIds: ["press-asset", "nec-info"],
    sourceLabel: "서울시장 후보 재산 보도 확인값",
    sourceUrl: PRESS_URL,
    sourceDate: "2026-05-15",
    summary:
      "정원오 재산 신고액 headline은 보도 확인 기준 약 18.2억 원입니다. 부동산, 예금, 증권, 채무 등 세부 항목은 선관위 원문 확인 전까지 확인 필요로 구분합니다.",
    caution: "현재 페이지의 세부 항목은 확인 필요로 표시합니다.",
  },
];

const sortedByAssets = [...SEOUL_MAYOR_CANDIDATES].sort((a, b) => b.totalAssetsManwon - a.totalAssetsManwon);
const richest = sortedByAssets[0];
const second = sortedByAssets[1];

export const SEOUL_MAYOR_METRIC_CARDS: CandidateMetricCard[] = [
  {
    label: "오세훈 재산 신고액",
    candidateId: "oh-sehoon",
    value: `${formatManwon(SEOUL_MAYOR_CANDIDATES[0].totalAssetsManwon)}`,
    description: "2026년 5월 후보 등록 재산 보도 확인값 기준입니다.",
    tone: "primary",
    badge: "보도확인",
  },
  {
    label: "정원오 재산 신고액",
    candidateId: "jung-wonoh",
    value: `${formatManwon(SEOUL_MAYOR_CANDIDATES[1].totalAssetsManwon)}`,
    description: "같은 보도 확인 기준으로 표시한 headline 수치입니다.",
    tone: "neutral",
    badge: "보도확인",
  },
  {
    label: "재산 순위",
    candidateId: richest.id,
    value: `${richest.candidateName} 1위`,
    description: `${richest.candidateName} 후보가 ${second.candidateName} 후보보다 총재산 신고액이 높게 보도됐습니다.`,
    tone: "asset",
    badge: "계산",
  },
  {
    label: "세부 항목",
    candidateId: "both",
    value: "확인 필요",
    description: "부동산·예금·증권·채무 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
    tone: "caution",
    badge: "확인필요",
  },
];

export const SEOUL_MAYOR_POLICY_SUMMARIES: SeoulMayorPolicySummary[] = [
  {
    candidateId: "oh-sehoon",
    candidateName: "오세훈",
    housingSupplySummary: "주택 공급 확대와 도시 경쟁력 강화 흐름을 함께 확인해야 합니다.",
    redevelopmentSummary: "재개발·재건축, 민간 정비사업 속도와 규제 완화 관련 메시지가 핵심입니다.",
    rentalHousingSummary: "공공·민간 공급 조합과 주거 안정 장치를 함께 확인해야 합니다.",
    sourceLabel: "정책·공약마당에서 오세훈 공약 원문 확인",
    sourceUrl: POLICY_URL,
  },
  {
    candidateId: "jung-wonoh",
    candidateName: "정원오",
    housingSupplySummary: "주택 공급, 생활권 기반 도시정책, 주거 안정 방향을 함께 확인해야 합니다.",
    redevelopmentSummary: "도시정비와 공급 속도를 강조하되 세부 실행 방식은 공약 원문 확인이 필요합니다.",
    rentalHousingSummary: "청년·신혼부부·공공주거 정책은 정책·공약마당에서 별도 확인해야 합니다.",
    sourceLabel: "정책·공약마당에서 정원오 공약 원문 확인",
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
    title: "서울시장 후보 목록 선택",
    body: "후보자 메뉴에서 서울특별시장 선거 후보자 목록으로 이동합니다.",
  },
  {
    title: "후보자명 클릭",
    body: "후보자 상세 페이지에서 재산, 병역, 전과, 납세, 학력, 경력 공개자료를 확인합니다.",
  },
  {
    title: "공약 원문 확인",
    body: "재산 공개자료와 별도로 후보자별 부동산·주거 공약은 정책·공약마당에서 확인합니다.",
    href: POLICY_URL,
  },
];

export const SEOUL_MAYOR_RELATED_LINKS: RelatedReportLink[] = [
  {
    label: "전국 후보 재산 순위 TOP 50",
    href: "/reports/local-election-candidate-assets-ranking-2026/",
    description: "지방선거 후보 재산을 전국 순위로 비교합니다.",
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
    q: "오세훈 재산은 얼마인가요?",
    a: "이 페이지에서는 2026년 5월 후보 등록 재산 보도 확인값 기준으로 오세훈 재산 신고액을 약 72.9억 원으로 표시합니다. 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
  },
  {
    q: "오세훈 재산신고액과 정원오 재산신고액은 어떻게 비교되나요?",
    a: "보도 확인 headline 기준 오세훈 후보는 약 72.9억 원, 정원오 후보는 약 18.2억 원입니다. 두 수치는 같은 기준의 총재산 신고액으로 비교했습니다.",
  },
  {
    q: "서울시장 후보 재산 순위는 어디서 확인하나요?",
    a: "후보자별 재산 공개자료는 중앙선거관리위원회 선거통계시스템에서 확인할 수 있습니다. 이 페이지는 검색자가 빠르게 비교할 수 있도록 주요 headline 수치를 정리합니다.",
  },
  {
    q: "부동산 신고액은 현재 시세인가요?",
    a: "아닙니다. 부동산 신고액은 공개자료의 신고 기준 금액이며 실제 현재 시세, 실거래가, 감정가와 다를 수 있습니다.",
  },
  {
    q: "후보 재산에는 배우자 재산도 포함되나요?",
    a: "후보자 재산 공개자료에는 후보자 본인과 신고 대상 가족의 재산이 포함될 수 있습니다. 정확한 포함 범위는 선관위 원문에서 확인해야 합니다.",
  },
  {
    q: "채무가 있으면 총재산을 어떻게 봐야 하나요?",
    a: "총재산만 보지 말고 채무와 순자산 추정값을 함께 봐야 합니다. 다만 이 페이지의 순자산은 세부 채무 항목 확인 후 업데이트합니다.",
  },
];

export const seoulMayorCandidateAssets2026: SeoulMayorCandidateAssetsData = {
  meta: {
    slug: "seoul-mayor-candidate-assets-2026",
    title: "오세훈 재산 2026 | 서울시장 후보 재산신고액·정원오 재산 비교",
    description:
      "오세훈 재산 신고액은 2026년 5월 후보 등록 보도 확인 기준 약 72.9억 원입니다. 정원오 재산신고액과 서울시장 후보 재산 순위를 함께 비교합니다.",
    h1: "오세훈 재산 2026: 서울시장 후보 재산신고액 비교",
    eyebrow: "서울시장 후보 재산",
    updatedAt: "2026.06.05",
    electionDate: "2026.06.03",
    dataBasis: "후보자 등록 재산 보도 확인값 및 선관위 원문 확인 가이드",
    caution:
      "이 페이지는 후보자 재산 공개자료를 이해하기 쉽게 정리한 참고 리포트입니다. 재산 신고액은 실제 현재 시세와 다를 수 있고, 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
  },
  sources: SEOUL_MAYOR_SOURCES,
  candidates: SEOUL_MAYOR_CANDIDATES,
  metricCards: SEOUL_MAYOR_METRIC_CARDS,
  policySummaries: SEOUL_MAYOR_POLICY_SUMMARIES,
  guideSteps: SEOUL_MAYOR_GUIDE_STEPS,
  relatedLinks: SEOUL_MAYOR_RELATED_LINKS,
  faq: SEOUL_MAYOR_FAQ,
  seoIntro: [
    "오세훈 재산 키워드는 서울시장 후보 재산 공개자료를 빠르게 확인하려는 검색 의도가 강합니다. 이 페이지는 오세훈 재산 신고액 headline과 정원오 재산신고액을 같은 기준으로 비교합니다.",
    "2026년 서울시장 선거 관련 재산 공개자료는 총재산, 부동산, 예금, 증권, 채무를 나눠 봐야 합니다. 현재는 총재산 headline 보도 확인값을 우선 표시하고, 세부 항목은 확인 필요로 구분합니다.",
    "오세훈 재산 신고액은 약 72.9억 원, 정원오 재산 신고액은 약 18.2억 원으로 정리했습니다. 이 수치는 공개자료 이해를 돕기 위한 비교값이며 최종 확인은 중앙선거관리위원회 원문을 우선합니다.",
    "후보자의 개인 재산과 서울시 부동산 공약은 별도 정보입니다. 재산 공개자료는 후보자의 신고 내역이고, 부동산 공약은 정책 방향이므로 각각의 출처를 따로 확인하는 것이 좋습니다.",
  ],
  seoCriteria: [
    "오세훈 재산: 2026년 5월 후보 등록 재산 보도 확인값 기준 약 72.9억 원으로 표시합니다.",
    "정원오 재산신고액: 같은 기준 약 18.2억 원으로 표시합니다.",
    "세부 항목: 부동산·예금·증권·채무는 선관위 원문 확인 후 업데이트하며 확인 전에는 추정하지 않습니다.",
    "공개자료 해석: 신고액은 현재 시세나 실거래가가 아니며 신고 기준 금액입니다.",
  ],
};
