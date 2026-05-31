export type CandidateAssetBadge = "공식" | "보도확인" | "부분공개" | "계산" | "업데이트필요";
export type ElectionType = "시·도지사" | "교육감" | "구·시·군의장" | "광역의원" | "기초의원" | "국회의원보궐";
export type CandidateStatus = "등록" | "사퇴" | "등록무효" | "정정확인";
export type AssetSortKey =
  | "totalAssetsManwon"
  | "realEstateManwon"
  | "depositsManwon"
  | "securitiesManwon"
  | "debtsManwon"
  | "netAssetsManwon";
export type AssetTone = "neutral" | "primary" | "asset" | "caution" | "muted";

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: CandidateAssetBadge;
  note?: string;
}

export interface LocalElectionCandidateAsset {
  id: string;
  rank: number;
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  sidoName: string;
  districtName: string;
  totalAssetsManwon: number;
  realEstateManwon?: number;
  landManwon?: number;
  buildingManwon?: number;
  depositsManwon?: number;
  securitiesManwon?: number;
  debtsManwon?: number;
  netAssetsManwon?: number;
  realEstateRatio?: number;
  financialAssetRatio?: number;
  assetTags: string[];
  status: CandidateStatus;
  sourceIds: string[];
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  note: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  description: string;
  tone: AssetTone;
  badge?: CandidateAssetBadge;
}

export interface DistributionItem {
  label: string;
  count: number;
  percentage?: number;
  tone?: AssetTone;
}

export interface BattlegroundLink {
  label: string;
  href: string;
  description: string;
  status: "준비중" | "게시됨";
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface ElectionGuideStep {
  title: string;
  body: string;
  href?: string;
}

export interface LocalElectionCandidateAssetsRankingData {
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
  summaryCards: SummaryCard[];
  candidates: LocalElectionCandidateAsset[];
  sidoDistribution: DistributionItem[];
  electionTypeDistribution: DistributionItem[];
  partyDistribution: DistributionItem[];
  battlegroundLinks: BattlegroundLink[];
  guideSteps: ElectionGuideStep[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}

const infoNecUrl = "https://info.nec.go.kr/";

const rawCandidates: Array<Omit<LocalElectionCandidateAsset, "assetTags" | "status" | "sourceIds" | "sourceLabel" | "sourceUrl" | "sourceDate" | "note" | "electionType" | "districtName">> = [
  { rank: 1, id: "oh-se-hoon", candidateName: "오세훈", partyName: "국민의힘", sidoName: "서울특별시", totalAssetsManwon: 728960 },
  { rank: 2, id: "moon-sung-yu", candidateName: "문성유", partyName: "국민의힘", sidoName: "제주특별자치도", totalAssetsManwon: 599474 },
  { rank: 3, id: "cho-eung-cheon", candidateName: "조응천", partyName: "개혁신당", sidoName: "경기도", totalAssetsManwon: 564469 },
  { rank: 4, id: "park-hyung-joon", candidateName: "박형준", partyName: "국민의힘", sidoName: "부산광역시", totalAssetsManwon: 552992 },
  { rank: 5, id: "yang-jung-moo", candidateName: "양정무", partyName: "국민의힘", sidoName: "전북특별자치도", totalAssetsManwon: 512875 },
  { rank: 6, id: "jung-i-han", candidateName: "정이한", partyName: "개혁신당", sidoName: "부산광역시", totalAssetsManwon: 497151 },
  { rank: 7, id: "chu-kyung-ho", candidateName: "추경호", partyName: "국민의힘", sidoName: "대구광역시", totalAssetsManwon: 471069 },
  { rank: 8, id: "kim-jin-tae", candidateName: "김진태", partyName: "국민의힘", sidoName: "강원특별자치도", totalAssetsManwon: 438656 },
  { rank: 9, id: "yang-hyang-ja", candidateName: "양향자", partyName: "국민의힘", sidoName: "경기도", totalAssetsManwon: 405988 },
  { rank: 10, id: "shin-yong-han", candidateName: "신용한", partyName: "더불어민주당", sidoName: "충청북도", totalAssetsManwon: 339874 },
  { rank: 11, id: "park-chan-dae", candidateName: "박찬대", partyName: "더불어민주당", sidoName: "인천광역시", totalAssetsManwon: 307610 },
  { rank: 12, id: "lee-jang-woo", candidateName: "이장우", partyName: "국민의힘", sidoName: "대전광역시", totalAssetsManwon: 285892 },
  { rank: 13, id: "chu-mi-ae", candidateName: "추미애", partyName: "더불어민주당", sidoName: "경기도", totalAssetsManwon: 279641 },
  { rank: 14, id: "kim-kwan-young", candidateName: "김관영", partyName: "무소속", sidoName: "전북특별자치도", totalAssetsManwon: 262370 },
  { rank: 15, id: "kwon-young-guk", candidateName: "권영국", partyName: "정의당", sidoName: "서울특별시", totalAssetsManwon: 226597 },
  { rank: 16, id: "kim-doo-gyum", candidateName: "김두겸", partyName: "국민의힘", sidoName: "울산광역시", totalAssetsManwon: 209264 },
  { rank: 17, id: "park-wan-soo", candidateName: "박완수", partyName: "국민의힘", sidoName: "경상남도", totalAssetsManwon: 198774 },
  { rank: 18, id: "choi-min-ho", candidateName: "최민호", partyName: "국민의힘", sidoName: "세종특별자치시", totalAssetsManwon: 198337 },
  { rank: 19, id: "kim-sang-wook", candidateName: "김상욱", partyName: "더불어민주당", sidoName: "울산광역시", totalAssetsManwon: 196763 },
  { rank: 20, id: "lee-cheol-woo", candidateName: "이철우", partyName: "국민의힘", sidoName: "경상북도", totalAssetsManwon: 190260 },
  { rank: 21, id: "yoo-jeong-bok", candidateName: "유정복", partyName: "국민의힘", sidoName: "인천광역시", totalAssetsManwon: 184427 },
  { rank: 22, id: "kim-kyung-soo", candidateName: "김경수", partyName: "더불어민주당", sidoName: "경상남도", totalAssetsManwon: 183788 },
  { rank: 23, id: "min-hyung-bae", candidateName: "민형배", partyName: "더불어민주당", sidoName: "전남광주통합특별시", totalAssetsManwon: 183026 },
  { rank: 24, id: "jung-won-oh", candidateName: "정원오", partyName: "더불어민주당", sidoName: "서울특별시", totalAssetsManwon: 182389 },
  { rank: 25, id: "kim-sung-soo", candidateName: "김성수", partyName: "무소속", sidoName: "전북특별자치도", totalAssetsManwon: 181455 },
  { rank: 26, id: "kim-jung-cheol", candidateName: "김정철", partyName: "개혁신당", sidoName: "서울특별시", totalAssetsManwon: 179885 },
  { rank: 27, id: "woo-sang-ho", candidateName: "우상호", partyName: "더불어민주당", sidoName: "강원특별자치도", totalAssetsManwon: 176490 },
  { rank: 28, id: "kim-boo-kyum", candidateName: "김부겸", partyName: "더불어민주당", sidoName: "대구광역시", totalAssetsManwon: 161701 },
  { rank: 29, id: "kim-tae-heum", candidateName: "김태흠", partyName: "국민의힘", sidoName: "충청남도", totalAssetsManwon: 159204 },
  { rank: 30, id: "lee-won-taek", candidateName: "이원택", partyName: "더불어민주당", sidoName: "전북특별자치도", totalAssetsManwon: 136304 },
  { rank: 31, id: "lee-jung-hyun", candidateName: "이정현", partyName: "국민의힘", sidoName: "전남광주통합특별시", totalAssetsManwon: 124776 },
  { rank: 32, id: "yang-yoon-nyeong", candidateName: "양윤녕", partyName: "무소속", sidoName: "제주특별자치도", totalAssetsManwon: 98072 },
  { rank: 33, id: "cho-sang-ho", candidateName: "조상호", partyName: "더불어민주당", sidoName: "세종특별자치시", totalAssetsManwon: 87810 },
  { rank: 34, id: "lee-gi-boong", candidateName: "이기붕", partyName: "개혁신당", sidoName: "인천광역시", totalAssetsManwon: 75443 },
  { rank: 35, id: "park-soo-hyun", candidateName: "박수현", partyName: "더불어민주당", sidoName: "충청남도", totalAssetsManwon: 74419 },
  { rank: 36, id: "jeon-jae-soo", candidateName: "전재수", partyName: "더불어민주당", sidoName: "부산광역시", totalAssetsManwon: 71724 },
  { rank: 37, id: "kim-hyun-wook", candidateName: "김현욱", partyName: "국민연합", sidoName: "경기도", totalAssetsManwon: 70850 },
  { rank: 38, id: "heo-tae-jeong", candidateName: "허태정", partyName: "더불어민주당", sidoName: "대전광역시", totalAssetsManwon: 59361 },
  { rank: 39, id: "wi-seong-gon", candidateName: "위성곤", partyName: "더불어민주당", sidoName: "제주특별자치도", totalAssetsManwon: 57087 },
  { rank: 40, id: "park-maeng-woo", candidateName: "박맹우", partyName: "무소속", sidoName: "울산광역시", totalAssetsManwon: 56187 },
  { rank: 41, id: "jeon-hee-young", candidateName: "전희영", partyName: "진보당", sidoName: "경상남도", totalAssetsManwon: 52929 },
  { rank: 42, id: "kim-jong-hoon", candidateName: "김종훈", partyName: "진보당", sidoName: "울산광역시", totalAssetsManwon: 47187 },
  { rank: 43, id: "lee-jong-wook", candidateName: "이종욱", partyName: "진보당", sidoName: "전남광주통합특별시", totalAssetsManwon: 44000 },
  { rank: 44, id: "hong-sung-gyu", candidateName: "홍성규", partyName: "진보당", sidoName: "경기도", totalAssetsManwon: 34051 },
  { rank: 45, id: "ha-heon-hwi", candidateName: "하헌휘", partyName: "개혁신당", sidoName: "세종특별자치시", totalAssetsManwon: 33261 },
  { rank: 46, id: "lee-soo-chan", candidateName: "이수찬", partyName: "개혁신당", sidoName: "대구광역시", totalAssetsManwon: 30347 },
  { rank: 47, id: "kang-eun-mi", candidateName: "강은미", partyName: "정의당", sidoName: "전남광주통합특별시", totalAssetsManwon: 24390 },
  { rank: 48, id: "kim-kwang-man", candidateName: "김광만", partyName: "무소속", sidoName: "전남광주통합특별시", totalAssetsManwon: 20285 },
  { rank: 49, id: "yoo-ji-hye", candidateName: "유지혜", partyName: "여성의당", sidoName: "서울특별시", totalAssetsManwon: 7709 },
  { rank: 50, id: "lee-kang-san", candidateName: "이강산", partyName: "자유통일당", sidoName: "서울특별시", totalAssetsManwon: 7073 },
];

const addTags = (value: number) => {
  const tags = ["시·도지사 후보"];
  if (value >= 500000) tags.push("50억 이상");
  else if (value >= 100000) tags.push("10억 이상");
  else tags.push("10억 미만");
  tags.push("세부내역 확인 필요");
  return tags;
};

export const localElectionCandidateAssets: LocalElectionCandidateAsset[] = rawCandidates.map((candidate) => ({
  ...candidate,
  electionType: "시·도지사",
  districtName: `${candidate.sidoName} 시·도지사 선거`,
  assetTags: addTags(candidate.totalAssetsManwon),
  status: "등록",
  sourceIds: ["nec", "nojam"],
  sourceLabel: "중앙선관위 공개자료 기반 정리",
  sourceUrl: infoNecUrl,
  sourceDate: "2026-05-26",
  note: "총재산 신고액 기준입니다. 부동산·예금·증권·채무 세부 내역은 중앙선관위 후보자 정보 공개자료에서 재확인해야 합니다.",
}));

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

export function calcNetAssets(candidate: LocalElectionCandidateAsset) {
  return candidate.netAssetsManwon ?? candidate.totalAssetsManwon - (candidate.debtsManwon ?? 0);
}

const countBy = (items: LocalElectionCandidateAsset[], key: keyof LocalElectionCandidateAsset): DistributionItem[] => {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const label = String(item[key]);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count, percentage: Math.round((count / items.length) * 100) }))
    .sort((a, b) => b.count - a.count);
};

const average = Math.round(localElectionCandidateAssets.reduce((sum, item) => sum + item.totalAssetsManwon, 0) / localElectionCandidateAssets.length);

export const localElectionCandidateAssetsRanking2026: LocalElectionCandidateAssetsRankingData = {
  meta: {
    slug: "local-election-candidate-assets-ranking-2026",
    title: "2026 지방선거 후보 재산 순위 TOP 50",
    description: "2026 지방선거 시·도지사 후보 재산 신고액 상위 50명을 총재산, 지역, 정당, 공개자료 확인 경로 기준으로 정리했습니다.",
    h1: "2026 지방선거 후보 재산 순위 TOP 50",
    eyebrow: "선거 데이터 리포트",
    updatedAt: "2026-05-31",
    electionDate: "2026-06-03",
    dataBasis: "중앙선관위 후보자 공개자료 기반 시·도지사 후보 재산 신고액 정리",
    caution: "재산 신고액은 실제 현재 시세가 아니며, 후보자 본인과 배우자·직계존비속의 신고 대상 재산이 포함될 수 있습니다. 세부 내역은 중앙선관위 원자료에서 확인해야 합니다.",
  },
  sources: [
    {
      id: "nec",
      label: "중앙선거관리위원회 선거통계시스템",
      organization: "중앙선거관리위원회",
      url: "https://info.nec.go.kr/",
      asOf: "2026-05-26",
      badge: "공식",
      note: "후보자 명부와 후보자 정보 공개자료의 1차 확인 경로입니다.",
    },
    {
      id: "nojam",
      label: "노잼선거 재산 순위 공개 정리",
      organization: "노잼선거",
      url: "https://nojam.kr/stats/wealth",
      asOf: "2026-05-26",
      badge: "보도확인",
      note: "중앙선관위 공개자료를 시·도지사 후보 재산 신고액 기준으로 재정렬한 보조 출처입니다.",
    },
  ],
  summaryCards: [
    {
      label: "재산 신고액 1위",
      value: `오세훈 · ${formatManwon(localElectionCandidateAssets[0].totalAssetsManwon)}`,
      description: "시·도지사 후보 공개자료 정리 기준 TOP 50 중 가장 높은 신고액입니다.",
      tone: "primary",
      badge: "공식",
    },
    {
      label: "TOP 50 평균",
      value: formatManwon(average),
      description: "상위 50명 단순 평균이며 전체 후보 평균과 다릅니다.",
      tone: "asset",
      badge: "계산",
    },
    {
      label: "10억 이상",
      value: `${localElectionCandidateAssets.filter((item) => item.totalAssetsManwon >= 100000).length}명`,
      description: "총재산 신고액이 10억원 이상인 후보 수입니다.",
      tone: "neutral",
    },
    {
      label: "세부 내역",
      value: "원자료 확인 필요",
      description: "부동산·예금·증권·채무 항목은 후보자별 공개자료에서 직접 확인해야 합니다.",
      tone: "caution",
      badge: "업데이트필요",
    },
  ],
  candidates: localElectionCandidateAssets,
  sidoDistribution: countBy(localElectionCandidateAssets, "sidoName"),
  electionTypeDistribution: countBy(localElectionCandidateAssets, "electionType"),
  partyDistribution: countBy(localElectionCandidateAssets, "partyName"),
  battlegroundLinks: [
    { label: "서울시장 후보 재산 비교 2026", href: "/reports/seoul-mayor-candidate-assets-2026/", description: "오세훈·정원오 서울시장 후보 재산 신고액과 공개자료 확인 경로를 별도 페이지에서 비교합니다.", status: "게시됨" },
    { label: "경기지사 후보 재산 비교 2026", href: "/reports/gyeonggi-governor-candidate-assets-2026/", description: "경기도지사 후보 공개자료를 별도로 비교하는 확장 페이지입니다.", status: "준비중" },
    { label: "광역단체장 후보 재산 비교 2026", href: "/reports/governor-mayor-candidate-assets-comparison-2026/", description: "시도지사 후보 재산을 지역별·정당별로 다시 비교하는 확장 리포트입니다.", status: "게시됨" },
  ],
  guideSteps: [
    { title: "선거통계시스템 접속", body: "중앙선관위 선거통계시스템에서 선거명과 지역을 선택합니다.", href: "https://info.nec.go.kr/" },
    { title: "후보자 명부 확인", body: "후보자 이름을 선택해 후보자 정보 공개자료로 이동합니다." },
    { title: "재산 신고 항목 확인", body: "총재산뿐 아니라 부동산, 예금, 증권, 채무, 납세, 전과, 병역, 학력도 함께 확인합니다." },
    { title: "공약과 함께 읽기", body: "정책·공약마당에서 후보자의 공약과 지역 현안 대응을 같이 봅니다.", href: "https://policy.nec.go.kr/" },
  ],
  relatedLinks: [
    { label: "이재명 정부 공직자 재산·보수 비교", href: "/reports/lee-jaemyung-government-officials-assets-salary-2026/", description: "공직자 공개재산과 보수를 함께 비교합니다." },
    { label: "서울 구별 아파트 실거래가", href: "/reports/seoul-apartment-price-2026/", description: "후보 부동산 신고액을 지역 가격 흐름과 분리해 읽는 데 참고합니다." },
    { label: "한국 부자 TOP 10 자산 비교", href: "/reports/korea-rich-top10-assets/", description: "고액 자산 구조를 다른 공개 데이터와 비교합니다." },
    { label: "아파트 보유세 계산기", href: "/tools/apartment-holding-tax/", description: "부동산 보유 부담을 계산할 때 참고합니다." },
  ],
  faq: [
    { q: "지방선거 후보 재산은 어디서 확인할 수 있나요?", a: "중앙선거관리위원회 선거통계시스템의 후보자 정보 공개자료에서 확인할 수 있습니다. 후보자별 재산, 병역, 전과, 납세, 학력, 경력 정보를 함께 볼 수 있습니다." },
    { q: "후보 재산 신고액에 가족 재산도 포함되나요?", a: "후보자 본인뿐 아니라 배우자와 직계존비속의 신고 대상 재산이 포함될 수 있습니다. 후보자별 세부 공개자료에서 대상 범위를 확인해야 합니다." },
    { q: "부동산 신고액은 현재 시세인가요?", a: "아닙니다. 공개자료의 신고 기준 금액이며 실제 현재 매매 시세와 다를 수 있습니다." },
    { q: "총재산이 높으면 후보 자질이 좋거나 나쁘다는 뜻인가요?", a: "그렇게 해석하면 안 됩니다. 재산 총액은 검증의 한 항목일 뿐이며 전과, 납세, 병역, 경력, 공약을 함께 봐야 합니다." },
    { q: "채무가 있으면 재산 순위를 어떻게 봐야 하나요?", a: "총재산과 채무를 함께 보고 순자산 개념으로 다시 읽어야 합니다. 이 페이지는 현재 총재산 신고액 중심이며 세부 채무는 원자료 확인이 필요합니다." },
    { q: "후보자가 사퇴하면 순위도 바뀌나요?", a: "사퇴, 등록무효, 자료 정정이 있으면 순위와 목록이 바뀔 수 있습니다. 선거 직전에는 중앙선관위 원자료를 다시 확인해야 합니다." },
    { q: "우리 동네 후보 재산도 볼 수 있나요?", a: "이 페이지는 시·도지사 후보 TOP 50 중심입니다. 구·시·군의장, 지방의원 등 지역 후보는 중앙선관위에서 지역과 선거구를 선택해 확인하는 것이 정확합니다." },
  ],
  seoIntro: [
    "2026 지방선거 후보 재산 공개자료는 후보자의 경제적 배경을 이해하기 위한 기본 자료입니다. 다만 재산 신고액은 후보자를 평가하는 결론이 아니라 출발점입니다. 총재산, 채무, 부동산, 예금, 증권, 가족 신고 범위를 함께 봐야 숫자의 의미를 과도하게 해석하지 않을 수 있습니다.",
    "이 페이지는 중앙선거관리위원회 공개자료를 바탕으로 정리된 시·도지사 후보 재산 신고액 상위 50명을 한 화면에서 비교할 수 있게 구성했습니다. 후보자명, 정당, 지역, 신고액을 먼저 보여주고, 지역별·정당별 분포를 함께 제공해 선거 데이터를 구조적으로 읽을 수 있게 했습니다.",
    "후보 재산 순위는 총액만 보면 오해가 생기기 쉽습니다. 부동산 중심 자산인지, 금융자산 중심인지, 채무가 큰 구조인지에 따라 같은 총액도 전혀 다르게 해석됩니다. 그래서 세부 내역은 반드시 중앙선관위 후보자 정보 공개자료에서 직접 확인해야 합니다.",
    "선거 정보는 후보 사퇴, 등록무효, 자료 정정에 따라 바뀔 수 있습니다. 이 리포트는 검색과 비교를 돕는 참고 자료이며, 실제 투표 판단은 후보자의 전과, 병역, 납세, 경력, 공약, 지역 현안 대응까지 함께 확인한 뒤 내려야 합니다.",
  ],
  seoCriteria: [
    "중앙선거관리위원회 후보자 공개자료를 1차 기준으로 삼고, 공개 정리 데이터를 보조 확인했습니다.",
    "금액은 후보자 신고 기준 금액이며 실제 현재 시세와 다를 수 있습니다.",
    "이 페이지의 TOP 50은 시·도지사 후보 재산 신고액 정리 범위이며 전체 지방선거 모든 후보를 뜻하지 않습니다.",
    "후보 사퇴, 등록무효, 자료 정정이 발생하면 순위가 달라질 수 있습니다.",
  ],
};
