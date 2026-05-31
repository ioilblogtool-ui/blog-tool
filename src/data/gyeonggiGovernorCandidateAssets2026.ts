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

export interface GyeonggiGovernorCandidateAsset {
  id: string;
  candidateName: string;
  partyName: string;
  currentRole: string;
  birthYear?: number;
  status: CandidateStatus;
  isPrimaryComparison: boolean;
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
  candidateId?: string;
  value: string;
  description: string;
  tone: AssetTone;
  badge?: CandidateAssetSourceBadge;
}

export interface GyeonggiGovernorPolicySummary {
  candidateId: string;
  candidateName: string;
  housingSummary: string;
  transportSummary: string;
  industrySummary: string;
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

export interface GyeonggiGovernorCandidateAssetsData {
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
  candidates: GyeonggiGovernorCandidateAsset[];
  metricCards: CandidateMetricCard[];
  policySummaries: GyeonggiGovernorPolicySummary[];
  guideSteps: CandidateGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}

const infoNecUrl = "https://info.nec.go.kr/";
const policyNecUrl = "https://policy.nec.go.kr/";
const lawmakeUrl = "https://www.lawmake.kr/local-elections/2026/races/17187";

export function calcNetAssets(candidate: GyeonggiGovernorCandidateAsset) {
  return candidate.netAssetsManwon ?? candidate.totalAssetsManwon - (candidate.debtsManwon ?? 0);
}

export function calcRealEstateRatio(candidate: GyeonggiGovernorCandidateAsset) {
  if (!candidate.totalAssetsManwon || !candidate.realEstateManwon) return null;
  return (candidate.realEstateManwon / candidate.totalAssetsManwon) * 100;
}

export function calcFinancialAssetRatio(candidate: GyeonggiGovernorCandidateAsset) {
  if (!candidate.totalAssetsManwon) return null;
  const financial = (candidate.depositsManwon ?? 0) + (candidate.securitiesManwon ?? 0);
  return (financial / candidate.totalAssetsManwon) * 100;
}

export function calcOtherAssets(candidate: GyeonggiGovernorCandidateAsset) {
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
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10000) return `${sign}${(abs / 10000).toFixed(1).replace(".0", "")}억`;
  return `${sign}${abs.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value?: number | null) {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}

export const gyeonggiGovernorCandidates: GyeonggiGovernorCandidateAsset[] = [
  {
    id: "chu-mi-ae",
    candidateName: "추미애",
    partyName: "더불어민주당",
    currentRole: "전 법무부 장관·전 국회의원",
    status: "등록",
    isPrimaryComparison: true,
    totalAssetsManwon: 279641,
    assetTags: ["기본 비교", "총재산 27.9억", "세부내역 확인 필요"],
    sourceBadge: "선관위",
    sourceIds: ["nec", "lawmake", "fn"],
    sourceLabel: "중앙선관위 공개자료 기반 정리",
    sourceUrl: infoNecUrl,
    sourceDate: "2026-05-26",
    summary: "경기도지사 기본 비교 후보입니다. 총재산 신고액은 공개자료 정리 기준 약 27.9억원이며, 부동산·예금·증권·채무 세부 내역은 선관위 원자료에서 재확인해야 합니다.",
    caution: "세부 자산 구성은 구현 시점 원문 확인 후 보강합니다.",
  },
  {
    id: "yang-hyang-ja",
    candidateName: "양향자",
    partyName: "국민의힘",
    currentRole: "전 국회의원·국민의힘 최고위원",
    status: "등록",
    isPrimaryComparison: true,
    totalAssetsManwon: 405988,
    assetTags: ["기본 비교", "총재산 40.6억", "세부내역 확인 필요"],
    sourceBadge: "선관위",
    sourceIds: ["nec", "lawmake", "fn"],
    sourceLabel: "중앙선관위 공개자료 기반 정리",
    sourceUrl: infoNecUrl,
    sourceDate: "2026-05-26",
    summary: "경기도지사 기본 비교 후보입니다. 총재산 신고액은 공개자료 정리 기준 약 40.6억원이며, 자산 세부 항목은 선관위 후보자 정보 공개자료에서 확인해야 합니다.",
    caution: "증권·예금 등 금융자산 세부 항목은 원문 확인 후 표시합니다.",
  },
  {
    id: "cho-eung-cheon",
    candidateName: "조응천",
    partyName: "개혁신당",
    currentRole: "전 국회의원",
    status: "등록",
    isPrimaryComparison: false,
    totalAssetsManwon: 564469,
    assetTags: ["기타 등록 후보", "총재산 56.4억", "세부내역 확인 필요"],
    sourceBadge: "선관위",
    sourceIds: ["nec", "lawmake", "fn"],
    sourceLabel: "중앙선관위 공개자료 기반 정리",
    sourceUrl: infoNecUrl,
    sourceDate: "2026-05-26",
    summary: "기타 등록 후보로 별도 접기 영역에 표시합니다. 기본 비교는 검색 의도상 추미애·양향자를 중심으로 구성합니다.",
  },
  {
    id: "hong-sung-gyu",
    candidateName: "홍성규",
    partyName: "진보당",
    currentRole: "정당 후보",
    status: "등록",
    isPrimaryComparison: false,
    totalAssetsManwon: 34051,
    assetTags: ["기타 등록 후보", "총재산 3.4억"],
    sourceBadge: "선관위",
    sourceIds: ["nec", "fn"],
    sourceLabel: "중앙선관위 공개자료 기반 정리",
    sourceUrl: infoNecUrl,
    sourceDate: "2026-05-26",
    summary: "기타 등록 후보로 전체 후보 보기 영역에서 확인할 수 있습니다.",
  },
  {
    id: "kim-hyun-wook",
    candidateName: "김현욱",
    partyName: "국민연합",
    currentRole: "정당 후보",
    status: "등록",
    isPrimaryComparison: false,
    totalAssetsManwon: 70850,
    assetTags: ["기타 등록 후보", "총재산 7.1억"],
    sourceBadge: "선관위",
    sourceIds: ["nec", "fn"],
    sourceLabel: "중앙선관위 공개자료 기반 정리",
    sourceUrl: infoNecUrl,
    sourceDate: "2026-05-26",
    summary: "기타 등록 후보로 전체 후보 보기 영역에서 확인할 수 있습니다.",
  },
];

const primaryCandidates = gyeonggiGovernorCandidates.filter((candidate) => candidate.isPrimaryComparison);
const primarySorted = [...primaryCandidates].sort((a, b) => b.totalAssetsManwon - a.totalAssetsManwon);
const primaryDiff = Math.abs(primaryCandidates[0].totalAssetsManwon - primaryCandidates[1].totalAssetsManwon);

export const gyeonggiGovernorCandidateAssets2026: GyeonggiGovernorCandidateAssetsData = {
  meta: {
    slug: "gyeonggi-governor-candidate-assets-2026",
    title: "경기도지사 후보 재산·부동산 비교 2026",
    description: "2026 경기도지사 후보 추미애·양향자의 재산 신고액을 총재산, 부동산, 예금, 증권, 채무 기준으로 비교합니다.",
    h1: "경기도지사 후보 재산·부동산 비교 2026",
    eyebrow: "선거 데이터 리포트",
    updatedAt: "2026-05-31",
    electionDate: "2026-06-03",
    dataBasis: "중앙선관위 후보자 공개자료 및 후보 비교 서비스 정리값 기준",
    caution: "재산 신고액은 실제 현재 시세가 아니며, 후보자 본인 외 신고 대상 가족 재산이 포함될 수 있습니다. 후보 사퇴, 등록무효, 자료 정정이 있으면 비교표가 바뀔 수 있습니다.",
  },
  sources: [
    {
      id: "nec",
      label: "중앙선거관리위원회 선거통계시스템",
      organization: "중앙선거관리위원회",
      url: infoNecUrl,
      asOf: "2026-05-26",
      badge: "선관위",
      note: "후보자 명부와 후보자 정보 공개자료의 1차 확인 경로입니다.",
    },
    {
      id: "policy",
      label: "중앙선거관리위원회 정책·공약마당",
      organization: "중앙선거관리위원회",
      url: policyNecUrl,
      asOf: "2026-05-31",
      badge: "선관위",
      note: "후보자 공약 확인 경로입니다.",
    },
    {
      id: "lawmake",
      label: "Lawmake 경기도지사 후보 비교",
      organization: "Lawmake",
      url: lawmakeUrl,
      asOf: "2026-05-31",
      badge: "보도확인",
      note: "선관위 공개자료를 재정리한 후보 비교 보조 출처입니다.",
    },
    {
      id: "fn",
      label: "파이낸셜뉴스 후보 등록 보도",
      organization: "파이낸셜뉴스",
      url: "https://www.fnnews.com/ampNews/202605140603253158",
      asOf: "2026-05-14",
      badge: "보도확인",
      note: "경기도지사 후보 구도 확인용 보조 출처입니다.",
    },
  ],
  candidates: gyeonggiGovernorCandidates,
  metricCards: [
    {
      label: "기본 비교 상단",
      candidateId: primarySorted[0].id,
      value: `${primarySorted[0].candidateName} · ${formatManwon(primarySorted[0].totalAssetsManwon)}`,
      description: "추미애·양향자 기본 비교 후보 중 총재산 신고액이 더 큰 후보입니다.",
      tone: "primary",
      badge: "선관위",
    },
    {
      label: "기본 후보 신고액 차이",
      value: formatManwon(primaryDiff),
      description: "두 후보 총재산 신고액의 단순 차이입니다. 세부 구성은 원자료 확인이 필요합니다.",
      tone: "asset",
      badge: "계산",
    },
    {
      label: "부동산·금융 세부 항목",
      value: "원자료 확인 필요",
      description: "부동산, 예금, 증권, 채무 항목은 선관위 후보자 상세 공개자료에서 재확인합니다.",
      tone: "caution",
      badge: "확인필요",
    },
    {
      label: "기타 등록 후보",
      value: `${gyeonggiGovernorCandidates.filter((candidate) => !candidate.isPrimaryComparison).length}명`,
      description: "조응천 등 기타 등록 후보는 접기 영역에서 함께 확인할 수 있습니다.",
      tone: "neutral",
    },
  ],
  policySummaries: [
    {
      candidateId: "chu-mi-ae",
      candidateName: "추미애",
      housingSummary: "공공주택, 주거 안정, 경기 생활권 개선 공약은 정책·공약마당 원문에서 확인합니다.",
      transportSummary: "GTX, 광역교통, 출퇴근 생활권 관련 공약은 후보 공약집 기준으로 별도 확인합니다.",
      industrySummary: "경기 혁신, 문화·산업 클러스터, 지역경제 공약은 재산 정보와 분리해 읽습니다.",
      sourceLabel: "정책·공약마당",
      sourceUrl: policyNecUrl,
    },
    {
      candidateId: "yang-hyang-ja",
      candidateName: "양향자",
      housingSummary: "주택 공급, 도시 인프라, 생활권 공약은 정책·공약마당 원문 기준으로 확인합니다.",
      transportSummary: "교통망, 광역 이동, 출퇴근 개선 공약은 후보 공약집에서 별도 확인합니다.",
      industrySummary: "반도체·첨단산업, 일자리, GRDP 성장 공약은 개인 재산 공개자료와 분리해 봅니다.",
      sourceLabel: "정책·공약마당",
      sourceUrl: policyNecUrl,
    },
  ],
  guideSteps: [
    { title: "선거통계시스템 접속", body: "중앙선관위 선거통계시스템에서 제9회 전국동시지방선거를 선택합니다.", href: infoNecUrl },
    { title: "경기도지사 후보 선택", body: "지역을 경기도로 고르고 후보자 명부에서 경기도지사 후보를 확인합니다." },
    { title: "후보자 정보 공개자료 확인", body: "재산, 전과, 병역, 납세, 학력, 경력 항목을 후보별로 함께 확인합니다." },
    { title: "공약 원문 확인", body: "정책·공약마당에서 주택, 교통, 산업 공약을 별도 정보로 확인합니다.", href: policyNecUrl },
  ],
  relatedLinks: [
    { label: "지방선거 후보 재산 순위 TOP 50", href: "/reports/local-election-candidate-assets-ranking-2026/", description: "전국 시·도지사 후보 재산 신고액 순위를 봅니다." },
    { label: "광역단체장 후보 재산 비교 2026", href: "/reports/governor-mayor-candidate-assets-comparison-2026/", description: "시도지사 후보 재산을 지역·정당별로 비교합니다." },
    { label: "서울시장 후보 재산·부동산 비교", href: "/reports/seoul-mayor-candidate-assets-2026/", description: "서울시장 후보 재산 비교 페이지입니다." },
    { label: "아파트 보유세 계산기", href: "/tools/apartment-holding-tax/", description: "부동산 보유 부담 구조를 계산해 봅니다." },
  ],
  faq: [
    { q: "경기도지사 후보 재산은 어디서 확인할 수 있나요?", a: "중앙선거관리위원회 선거통계시스템의 후보자 정보 공개자료에서 확인할 수 있습니다. 후보자별 재산뿐 아니라 전과, 병역, 납세, 학력, 경력도 함께 볼 수 있습니다." },
    { q: "추미애·양향자 후보 재산은 어떤 기준인가요?", a: "이 페이지는 후보자 등록 공개자료와 후보 비교 서비스의 정리값을 바탕으로 구성한 참고 리포트입니다. 구현과 업데이트 시에는 선관위 후보자 공개자료 원문을 우선합니다." },
    { q: "부동산 신고액은 현재 아파트 시세인가요?", a: "아닙니다. 부동산 신고액은 공개자료의 신고 기준 금액이며 실제 현재 매매 시세와 다를 수 있습니다. 시세 판단에는 별도 실거래가 자료가 필요합니다." },
    { q: "후보 재산에는 배우자 재산도 포함되나요?", a: "후보자 본인 외 배우자와 직계존비속 등 신고 대상 가족 재산이 포함될 수 있습니다. 후보자별 상세 공개자료에서 신고 대상과 세부 항목을 확인해야 합니다." },
    { q: "채무가 있으면 총재산은 어떻게 봐야 하나요?", a: "총재산과 채무를 함께 보고 순자산 추정값을 참고해야 합니다. 다만 순자산 추정은 이해를 돕기 위한 단순 계산값이며 공식 선관위 순위와 다를 수 있습니다." },
    { q: "후보 재산과 경기도 공약은 어떻게 연결해서 봐야 하나요?", a: "개인 재산 공개자료와 정책 공약은 별도 정보입니다. 두 정보를 함께 참고할 수는 있지만, 재산 구조가 특정 공약의 옳고 그름을 자동으로 증명하지는 않습니다." },
    { q: "선거 후에도 이 페이지를 볼 수 있나요?", a: "선거 후에는 당선자 재산과 후보별 공개자료 아카이브로 유지할 수 있습니다. 후보 사퇴, 등록무효, 자료 정정이 있으면 페이지 내용도 업데이트되어야 합니다." },
  ],
  seoIntro: [
    "경기도지사 후보 재산 공개자료는 후보자의 경제적 배경을 이해하기 위한 참고 정보입니다. 하지만 재산 신고액은 후보를 평가하는 결론이 아니라 공개된 검증 자료 중 하나입니다. 총재산만 보면 부동산, 예금, 증권, 채무가 어떤 구조인지 놓칠 수 있어 항목별로 나눠 읽는 것이 중요합니다.",
    "이 페이지는 2026 경기도지사 선거의 주요 검색축인 추미애·양향자 후보를 기본 비교 대상으로 두고, 조응천 등 기타 등록 후보는 별도 영역에서 확인할 수 있게 구성했습니다. 후보자별 총재산 신고액을 먼저 보여주되, 세부 내역은 선관위 원자료에서 재확인해야 한다는 점을 반복해서 안내합니다.",
    "경기도지사 선거는 주택 공급, GTX와 광역교통, 반도체 산업벨트 같은 생활 의제가 큰 선거입니다. 다만 후보 개인 재산과 정책 공약은 서로 다른 정보입니다. 재산 공개자료는 후보자 검증 자료이고, 공약은 경기도 운영 방향을 판단하는 자료이므로 섹션을 분리해서 읽어야 합니다.",
    "후보자 정보는 선거 기간 중 사퇴, 등록무효, 자료 정정으로 달라질 수 있습니다. 이 리포트는 검색과 비교를 돕는 참고 자료이며, 실제 투표 판단은 재산뿐 아니라 전과, 납세, 병역, 경력, 공약, 토론 내용을 함께 확인한 뒤 내려야 합니다.",
  ],
  seoCriteria: [
    "중앙선거관리위원회 후보자 공개자료를 우선 기준으로 사용합니다.",
    "금액은 신고 기준 금액이며 실제 현재 시세와 다를 수 있습니다.",
    "순자산과 비중은 이해를 돕기 위한 단순 계산값입니다.",
    "후보 사퇴, 등록무효, 자료 정정이 있으면 비교표가 바뀔 수 있습니다.",
  ],
};
