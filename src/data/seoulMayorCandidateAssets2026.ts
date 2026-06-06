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

export interface SearchIntentAnswer {
  query: string;
  answer: string;
  anchor: string;
}

export interface AssetDisclosureChecklistItem {
  label: string;
  status: CandidateAssetSourceBadge;
  description: string;
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
  searchIntentAnswers: SearchIntentAnswer[];
  disclosureChecklist: AssetDisclosureChecklistItem[];
  policySummaries: SeoulMayorPolicySummary[];
  guideSteps: CandidateGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}

export function calcNetAssets(candidate: SeoulMayorCandidateAsset) {
  if (candidate.netAssetsManwon !== undefined && candidate.netAssetsManwon !== null) return candidate.netAssetsManwon;
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
  const knownAssets =
    (candidate.realEstateManwon ?? 0) + (candidate.depositsManwon ?? 0) + (candidate.securitiesManwon ?? 0);
  const knownDebts = candidate.debtsManwon ?? 0;

  return Math.max(
    candidate.totalAssetsManwon - knownAssets + knownDebts,
    0
  );
}

export function formatManwon(value?: number | null) {
  if (value === undefined || value === null) return "별도 보도 없음";
  if (Math.abs(value) >= 10000) {
    const eok = value / 10000;
    return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억 원`;
  }
  return `${value.toLocaleString("ko-KR")}만 원`;
}

export function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "계산 제외";
  return `${Math.round(value)}%`;
}

const NEC_URL = "https://info.nec.go.kr/";
const POLICY_URL = "https://policy.nec.go.kr/";
const PETI_URL = "https://www.peti.go.kr/";
const PRESS_URL = "https://www.donga.com/news/amp/all/20260326/133610884/1";
const NEWSIS_URL = "https://nwww.newsis.com/view/NISX20260325_0003564150";

export const SEOUL_MAYOR_SOURCES: SourceInfo[] = [
  {
    id: "nec-info",
    label: "중앙선거관리위원회 선거통계시스템",
    organization: "중앙선거관리위원회",
    url: NEC_URL,
    asOf: "2026-05-31",
    badge: "선관위",
    note: "후보자 등록 및 선거 공개자료 확인 경로입니다.",
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
    id: "peti",
    label: "공직윤리시스템 정기 재산변동사항",
    organization: "정부공직자윤리위원회",
    url: PETI_URL,
    asOf: "2026-03-26",
    badge: "재산공개",
    note: "공직윤리시스템과 전자관보에 공개된 2026년 정기 재산변동사항 기준입니다.",
  },
  {
    id: "press-asset",
    label: "서울시장 후보 재산 세부 보도 확인값",
    organization: "동아일보·뉴시스",
    url: PRESS_URL,
    asOf: "2026-03-26",
    badge: "보도확인",
    note: "공직윤리시스템과 관보 공개자료를 인용한 세부 항목 보도 확인값입니다.",
  },
];

export const SEOUL_MAYOR_CANDIDATES: SeoulMayorCandidateAsset[] = [
  {
    id: "oh-sehoon",
    candidateName: "오세훈",
    partyName: "국민의힘",
    currentRole: "서울특별시장",
    status: "등록",
    totalAssetsManwon: 728961,
    realEstateManwon: 272128,
    landManwon: 13728,
    buildingManwon: 258400,
    depositsManwon: 179261,
    securitiesManwon: 258873,
    debtsManwon: 130000,
    netAssetsManwon: 728961,
    assetTags: ["오세훈 재산", "총재산 72.9억", "해외주식 비중", "임대보증금 채무"],
    sourceBadge: "재산공개",
    sourceIds: ["peti", "press-asset"],
    sourceLabel: "2026년 공직자 정기 재산변동사항 보도 확인값",
    sourceUrl: PRESS_URL,
    sourceDate: "2026-03-26",
    summary:
      "오세훈 재산 신고액은 72억8961만 원입니다. 강남구 대치동 다세대주택 등 건물 25억8400만 원, 토지 1억3728만 원, 예금 17억9261만 원, 증권 25억8873만 원, 채무 13억 원이 보도 확인됐습니다.",
    caution: "부동산 금액은 신고 기준 금액이며 현재 시세나 실거래가가 아닙니다.",
  },
  {
    id: "jung-wonoh",
    candidateName: "정원오",
    partyName: "더불어민주당",
    currentRole: "성동구청장",
    status: "등록",
    totalAssetsManwon: 182390,
    realEstateManwon: 97400,
    buildingManwon: 97400,
    depositsManwon: 74693,
    securitiesManwon: 3035,
    debtsManwon: 0,
    netAssetsManwon: 182390,
    assetTags: ["정원오 재산신고", "총재산 18.2억", "아파트·예금 중심", "증권 3035만 원"],
    sourceBadge: "재산공개",
    sourceIds: ["peti", "press-asset"],
    sourceLabel: "2026년 공직자 정기 재산변동사항 보도 확인값",
    sourceUrl: NEWSIS_URL,
    sourceDate: "2026-03-26",
    summary:
      "정원오 재산 신고액은 18억2390만 원입니다. 배우자 명의 성동구 행당동 아파트 9억7400만 원, 예금 7억4693만 원, 증권 3035만 원이 보도 확인됐습니다.",
    caution: "정원오 후보의 채무 항목은 세부 보도에서 별도 금액이 확인되지 않아 0원으로 표시합니다.",
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
    label: "자산 구성 차이",
    candidateId: "both",
    value: "해외주식 vs 예금",
    description: "오세훈은 해외주식 등 증권 비중이 크고, 정원오는 아파트·예금 중심 구조로 보도됐습니다.",
    tone: "asset",
    badge: "보도확인",
  },
];

export const SEOUL_MAYOR_SEARCH_INTENT_ANSWERS: SearchIntentAnswer[] = [
  {
    query: "오세훈 재산",
    answer:
      "2026년 5월 후보 등록 재산 보도 확인값 기준으로 오세훈 재산 신고액은 약 72.9억 원입니다.",
    anchor: "#oh-sehoon-assets",
  },
  {
    query: "오세훈 재산신고",
    answer:
      "오세훈 재산신고 세부 항목은 건물 25억8400만 원, 토지 1억3728만 원, 예금 17억9261만 원, 증권 25억8873만 원, 채무 13억 원으로 보도 확인됐습니다.",
    anchor: "#asset-disclosure-checklist",
  },
  {
    query: "오세훈 재산목록",
    answer:
      "재산목록에서 가장 큰 축은 건물·증권·예금입니다. 증권은 해외주식 중심으로 비중이 커진 점이 특징입니다.",
    anchor: "#source-guide",
  },
  {
    query: "서울시장 후보 재산",
    answer:
      "같은 보도 확인 기준으로 오세훈 후보 약 72.9억 원, 정원오 후보 약 18.2억 원을 비교합니다.",
    anchor: "#candidate-assets",
  },
];

export const SEOUL_MAYOR_DISCLOSURE_CHECKLIST: AssetDisclosureChecklistItem[] = [
  {
    label: "총재산 신고액",
    status: "재산공개",
    description:
      "오세훈 72억8961만 원, 정원오 18억2390만 원입니다. 두 후보의 격차는 약 54억6571만 원입니다.",
  },
  {
    label: "부동산 재산목록",
    status: "보도확인",
    description:
      "오세훈은 건물 25억8400만 원과 토지 1억3728만 원, 정원오는 배우자 명의 성동구 행당동 아파트 9억7400만 원이 확인됐습니다.",
  },
  {
    label: "예금·증권",
    status: "보도확인",
    description:
      "오세훈은 예금 17억9261만 원·증권 25억8873만 원, 정원오는 예금 7억4693만 원·증권 3035만 원입니다.",
  },
  {
    label: "채무·순자산",
    status: "보도확인",
    description:
      "오세훈 채무는 임대보증금 13억 원입니다. 정원오는 세부 보도에서 별도 채무 금액이 확인되지 않았습니다.",
  },
  {
    label: "투자 성향",
    status: "보도확인",
    description:
      "오세훈은 테슬라·팔란티어 등 해외주식 비중 확대, 정원오는 부동산·예금 중심의 안정형 구조로 보도됐습니다.",
  },
  {
    label: "원문 대조",
    status: "확인필요",
    description:
      "후보자 본인·배우자 등 신고 대상자별 세부 명세는 공직윤리시스템 또는 전자관보 원문에서 최종 대조해야 합니다.",
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
    a: "2026년 공직자 정기 재산변동사항 보도 확인값 기준으로 오세훈 재산 신고액은 72억8961만 원입니다. 주요 항목은 건물 25억8400만 원, 토지 1억3728만 원, 예금 17억9261만 원, 증권 25억8873만 원, 채무 13억 원입니다.",
  },
  {
    q: "오세훈 재산목록은 어디까지 확인됐나요?",
    a: "총재산, 토지, 건물, 예금, 증권, 채무 등 주요 항목을 보도 확인값으로 반영했습니다. 후보자 본인·배우자 등 신고 대상자별 세부 명세는 공직윤리시스템 또는 전자관보 원문에서 최종 대조해야 합니다.",
  },
  {
    q: "오세훈 재산신고액과 정원오 재산신고액은 어떻게 비교되나요?",
    a: "오세훈 후보는 72억8961만 원, 정원오 후보는 18억2390만 원입니다. 오세훈 후보가 약 54억6571만 원 높고, 총재산 신고액 기준으로 약 4.0배입니다.",
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
    a: "총재산만 보지 말고 채무와 순재산을 함께 봐야 합니다. 오세훈 후보는 임대보증금 채무 13억 원이 보도 확인됐고, 정원오 후보는 세부 보도에서 별도 채무 금액이 확인되지 않았습니다.",
  },
];

export const seoulMayorCandidateAssets2026: SeoulMayorCandidateAssetsData = {
  meta: {
    slug: "seoul-mayor-candidate-assets-2026",
    title: "오세훈 재산 2026 | 재산신고액·재산목록·정원오 비교",
    description:
      "오세훈 재산 신고액은 72억8961만 원입니다. 건물·토지·예금·증권·채무 재산목록과 정원오 재산신고액 18억2390만 원을 비교합니다.",
    h1: "오세훈 재산 2026: 재산신고액·재산목록 비교",
    eyebrow: "서울시장 후보 재산",
    updatedAt: "2026.06.06",
    electionDate: "2026.06.03",
    dataBasis: "2026년 공직자 정기 재산변동사항 보도 확인값 및 원문 대조 가이드",
    caution:
      "이 페이지는 후보자 재산 공개자료를 이해하기 쉽게 정리한 참고 리포트입니다. 재산 신고액은 실제 현재 시세와 다를 수 있고, 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
  },
  sources: SEOUL_MAYOR_SOURCES,
  candidates: SEOUL_MAYOR_CANDIDATES,
  metricCards: SEOUL_MAYOR_METRIC_CARDS,
  searchIntentAnswers: SEOUL_MAYOR_SEARCH_INTENT_ANSWERS,
  disclosureChecklist: SEOUL_MAYOR_DISCLOSURE_CHECKLIST,
  policySummaries: SEOUL_MAYOR_POLICY_SUMMARIES,
  guideSteps: SEOUL_MAYOR_GUIDE_STEPS,
  relatedLinks: SEOUL_MAYOR_RELATED_LINKS,
  faq: SEOUL_MAYOR_FAQ,
  seoIntro: [
    "오세훈 재산 키워드는 서울시장 후보 재산 공개자료를 빠르게 확인하려는 검색 의도가 강합니다. 이 페이지는 오세훈 재산 신고액 72억8961만 원과 정원오 재산신고액 18억2390만 원을 같은 기준으로 비교합니다.",
    "2026년 서울시장 선거 관련 재산 공개자료는 총재산, 부동산, 예금, 증권, 채무를 나눠 봐야 합니다. 오세훈 후보는 건물 25억8400만 원, 토지 1억3728만 원, 예금 17억9261만 원, 증권 25억8873만 원, 채무 13억 원으로 정리했습니다.",
    "정원오 후보는 배우자 명의 성동구 행당동 아파트 9억7400만 원, 예금 7억4693만 원, 증권 3035만 원 중심의 구조입니다. 두 후보의 차이는 단순 총액뿐 아니라 증권 비중과 예금·부동산 중심 구조에서도 나타납니다.",
    "오세훈 재산목록 검색자는 총액뿐 아니라 어떤 항목이 큰지 알고 싶어 합니다. 그래서 이 페이지는 총재산, 부동산, 예금, 증권, 채무, 기타·차액을 한 표에서 비교합니다.",
    "후보자의 개인 재산과 서울시 부동산 공약은 별도 정보입니다. 재산 공개자료는 후보자의 신고 내역이고, 부동산 공약은 정책 방향이므로 각각의 출처를 따로 확인하는 것이 좋습니다.",
  ],
  seoCriteria: [
    "오세훈 재산: 2026년 공직자 정기 재산변동사항 보도 확인값 기준 72억8961만 원으로 표시합니다.",
    "정원오 재산신고액: 같은 기준 18억2390만 원으로 표시합니다.",
    "세부 항목: 오세훈은 건물·토지·예금·증권·채무, 정원오는 아파트·예금·증권 중심으로 확인된 주요 항목을 반영했습니다.",
    "공개자료 해석: 신고액은 현재 시세나 실거래가가 아니며 신고 기준 금액입니다.",
  ],
};
