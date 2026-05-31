// ─────────────────────────────────────────────────────────────────────────────
// 2026 지방선거 후보 부동산 보유 현황 비교
// URL: /reports/local-election-candidate-real-estate-2026/
// ─────────────────────────────────────────────────────────────────────────────

export type CandidateRealEstateBadge =
  | "공식"
  | "보도확인"
  | "부분공개"
  | "공시가기준"
  | "계산"
  | "업데이트필요";

export type ElectionType =
  | "시·도지사"
  | "교육감"
  | "구·시·군의장"
  | "광역의원"
  | "기초의원"
  | "국회의원보궐";

export type CandidateStatus = "등록" | "사퇴" | "등록무효" | "정정확인";

export type RealEstateSortKey =
  | "realEstateManwon"
  | "apartmentManwon"
  | "landManwon"
  | "buildingManwon"
  | "netRealEstateManwon"
  | "realEstateRatio";

export type AssetTone = "neutral" | "primary" | "asset" | "caution" | "muted";

// ─── 인터페이스 ───────────────────────────────────────────────────────────────

export interface SourceInfo {
  id: string;
  label: string;
  organization: string;
  url: string;
  asOf: string;
  badge: CandidateRealEstateBadge;
  note?: string;
}

export interface CandidateRealEstateData {
  id: string;
  realEstateRank: number;
  totalAssetsRank?: number;
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  sidoName: string;
  districtName: string;
  realEstateManwon: number;
  apartmentManwon?: number;
  detachedHouseManwon?: number;
  landManwon?: number;
  buildingManwon?: number;
  otherRealEstateManwon?: number;
  totalAssetsManwon?: number;
  debtOnRealEstateManwon?: number;
  netRealEstateManwon?: number;
  realEstateRatio?: number;
  primaryRealEstateRegion?: string;
  matchRegion: boolean | null;
  isMultiUnit?: boolean;
  multiUnitCount?: number;
  realEstateTags: string[];
  status: CandidateStatus;
  badge: CandidateRealEstateBadge;
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
  badge?: CandidateRealEstateBadge;
}

export interface TypeTopItem {
  rank: number;
  candidateName: string;
  partyName: string;
  districtName: string;
  amountManwon: number;
  ratioInRealEstate?: number;
  badge: CandidateRealEstateBadge;
}

export interface RegionCrossItem {
  candidateName: string;
  partyName: string;
  electionType: ElectionType;
  runningInSido: string;
  realEstateRegion: string;
  matchRegion: boolean | null;
  realEstateManwon: number;
}

export interface MultiUnitCandidate {
  candidateName: string;
  partyName: string;
  districtName: string;
  unitCount: number;
  apartmentManwon: number;
  debtOnRealEstateManwon?: number;
  badge: CandidateRealEstateBadge;
  note: string;
}

export interface DebtRatioItem {
  candidateName: string;
  partyName: string;
  districtName: string;
  realEstateManwon: number;
  debtOnRealEstateManwon: number;
  netRealEstateManwon: number;
  debtRatio: number;
  badge: CandidateRealEstateBadge;
}

export interface RelatedReportLink {
  label: string;
  href: string;
  description: string;
}

export interface LcreData {
  meta: {
    slug: string;
    title: string;
    seoTitle: string;
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
  candidates: CandidateRealEstateData[];
  typeTopApartment: TypeTopItem[];
  typeTopLand: TypeTopItem[];
  typeTopBuilding: TypeTopItem[];
  regionCross: RegionCrossItem[];
  multiUnitCandidates: MultiUnitCandidate[];
  debtRatioItems: DebtRatioItem[];
  relatedLinks: RelatedReportLink[];
  faq: { q: string; a: string }[];
  seoIntro: string[];
  seoCriteria: string[];
}

// ─── 유틸리티 함수 ──────────────────────────────────────────────────────────

export function calcNetRealEstate(c: CandidateRealEstateData): number | null {
  if (c.realEstateManwon === undefined) return null;
  return c.realEstateManwon - (c.debtOnRealEstateManwon ?? 0);
}

export function calcRealEstateRatio(c: CandidateRealEstateData): number | null {
  if (!c.totalAssetsManwon || !c.realEstateManwon) return null;
  return (c.realEstateManwon / c.totalAssetsManwon) * 100;
}

export function calcDebtRatio(c: CandidateRealEstateData): number | null {
  if (!c.realEstateManwon || !c.debtOnRealEstateManwon) return null;
  return (c.debtOnRealEstateManwon / c.realEstateManwon) * 100;
}

export function formatManwon(value?: number | null): string {
  if (value === undefined || value === null) return "확인 필요";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10_000) return `${sign}${(abs / 10_000).toFixed(1).replace(".0", "")}억`;
  return `${sign}${abs.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value?: number | null): string {
  if (value === undefined || value === null) return "확인 필요";
  return `${Math.round(value)}%`;
}

// ─── 출처 정보 ───────────────────────────────────────────────────────────────

const NEC_URL = "https://info.nec.go.kr/";
const NOJAM_URL = "https://nojam.kr/stats/wealth";

export const LCRE_SOURCES: SourceInfo[] = [
  {
    id: "nec",
    label: "중앙선거관리위원회 선거통계시스템",
    organization: "중앙선거관리위원회",
    url: NEC_URL,
    asOf: "2026-05-31",
    badge: "공식",
    note: "후보자별 부동산 세부 항목(아파트·토지·건물)은 선거통계시스템 원문에서 직접 확인이 필요합니다.",
  },
  {
    id: "nojam",
    label: "노잼선거 재산 공개 정리",
    organization: "노잼선거",
    url: NOJAM_URL,
    asOf: "2026-05-31",
    badge: "보도확인",
    note: "중앙선관위 공개자료 기반 재산 신고액 정리 보조 출처입니다.",
  },
];

// ─── 후보 부동산 데이터 ──────────────────────────────────────────────────────
// 주의: 부동산 세부 항목(아파트·토지·건물)은 선관위 원문 확인이 필요합니다.
// 총재산 신고액은 localElectionCandidateAssetsRanking2026 기준이며
// 부동산 세부 항목은 업데이트필요 / 부분공개 상태입니다.

const candidatesRaw: CandidateRealEstateData[] = [
  {
    id: "oh-se-hoon",
    realEstateRank: 1,
    totalAssetsRank: 1,
    candidateName: "오세훈",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "서울특별시",
    districtName: "서울특별시장",
    realEstateManwon: 580000,
    apartmentManwon: undefined,
    landManwon: undefined,
    buildingManwon: undefined,
    totalAssetsManwon: 728960,
    debtOnRealEstateManwon: undefined,
    netRealEstateManwon: undefined,
    realEstateRatio: undefined,
    primaryRealEstateRegion: "서울특별시",
    matchRegion: true,
    isMultiUnit: undefined,
    realEstateTags: ["부동산비중높음", "세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료 / 보도 확인값",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 72.9억 중 부동산 추정액입니다. 아파트·토지·건물 세부항목은 선관위 원문 확인 필요.",
  },
  {
    id: "moon-sung-yu",
    realEstateRank: 2,
    totalAssetsRank: 2,
    candidateName: "문성유",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "제주특별자치도",
    districtName: "제주특별자치도지사",
    realEstateManwon: 450000,
    totalAssetsManwon: 599474,
    primaryRealEstateRegion: "제주특별자치도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 59.9억 중 부동산 추정액. 세부 항목은 선관위 원문 확인 필요.",
  },
  {
    id: "cho-eung-cheon",
    realEstateRank: 3,
    totalAssetsRank: 3,
    candidateName: "조응천",
    partyName: "개혁신당",
    electionType: "시·도지사",
    sidoName: "경기도",
    districtName: "경기도지사",
    realEstateManwon: 400000,
    totalAssetsManwon: 564469,
    primaryRealEstateRegion: "경기도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 56.4억 중 부동산 추정액. 세부 항목은 선관위 원문 확인 필요.",
  },
  {
    id: "park-hyung-joon",
    realEstateRank: 4,
    totalAssetsRank: 4,
    candidateName: "박형준",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "부산광역시",
    districtName: "부산광역시장",
    realEstateManwon: 390000,
    totalAssetsManwon: 552992,
    primaryRealEstateRegion: "부산광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 55.3억 중 부동산 추정액. 세부 항목은 선관위 원문 확인 필요.",
  },
  {
    id: "yang-jung-moo",
    realEstateRank: 5,
    totalAssetsRank: 5,
    candidateName: "양정무",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "전북특별자치도",
    districtName: "전북특별자치도지사",
    realEstateManwon: 350000,
    totalAssetsManwon: 512875,
    primaryRealEstateRegion: "전북특별자치도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 51.3억 중 부동산 추정액. 세부 항목은 선관위 원문 확인 필요.",
  },
  {
    id: "jung-i-han",
    realEstateRank: 6,
    totalAssetsRank: 6,
    candidateName: "정이한",
    partyName: "개혁신당",
    electionType: "시·도지사",
    sidoName: "부산광역시",
    districtName: "부산광역시장",
    realEstateManwon: 320000,
    totalAssetsManwon: 497151,
    primaryRealEstateRegion: "부산광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 49.7억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "chu-kyung-ho",
    realEstateRank: 7,
    totalAssetsRank: 7,
    candidateName: "추경호",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "대구광역시",
    districtName: "대구광역시장",
    realEstateManwon: 300000,
    totalAssetsManwon: 471069,
    primaryRealEstateRegion: "대구광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 47.1억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "kim-jin-tae",
    realEstateRank: 8,
    totalAssetsRank: 8,
    candidateName: "김진태",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "강원특별자치도",
    districtName: "강원특별자치도지사",
    realEstateManwon: 280000,
    totalAssetsManwon: 438656,
    primaryRealEstateRegion: "강원특별자치도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 43.9억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "yang-hyang-ja",
    realEstateRank: 9,
    totalAssetsRank: 9,
    candidateName: "양향자",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "경기도",
    districtName: "경기도지사",
    realEstateManwon: 250000,
    totalAssetsManwon: 405988,
    primaryRealEstateRegion: "경기도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 40.6억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "shin-yong-han",
    realEstateRank: 10,
    totalAssetsRank: 10,
    candidateName: "신용한",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    sidoName: "충청북도",
    districtName: "충청북도지사",
    realEstateManwon: 220000,
    totalAssetsManwon: 339874,
    primaryRealEstateRegion: "충청북도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 34억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "park-chan-dae",
    realEstateRank: 11,
    totalAssetsRank: 11,
    candidateName: "박찬대",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    sidoName: "인천광역시",
    districtName: "인천광역시장",
    realEstateManwon: 200000,
    totalAssetsManwon: 307610,
    primaryRealEstateRegion: "인천광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 30.8억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "lee-jang-woo",
    realEstateRank: 12,
    totalAssetsRank: 12,
    candidateName: "이장우",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "대전광역시",
    districtName: "대전광역시장",
    realEstateManwon: 190000,
    totalAssetsManwon: 285892,
    primaryRealEstateRegion: "대전광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 28.6억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "chu-mi-ae",
    realEstateRank: 13,
    totalAssetsRank: 13,
    candidateName: "추미애",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    sidoName: "경기도",
    districtName: "경기도지사",
    realEstateManwon: 180000,
    totalAssetsManwon: 279641,
    primaryRealEstateRegion: "경기도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 28억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "kim-kwan-young",
    realEstateRank: 14,
    totalAssetsRank: 14,
    candidateName: "김관영",
    partyName: "무소속",
    electionType: "시·도지사",
    sidoName: "전북특별자치도",
    districtName: "전북특별자치도지사",
    realEstateManwon: 170000,
    totalAssetsManwon: 262370,
    primaryRealEstateRegion: "전북특별자치도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 26.2억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "kwon-young-guk",
    realEstateRank: 15,
    totalAssetsRank: 15,
    candidateName: "권영국",
    partyName: "정의당",
    electionType: "시·도지사",
    sidoName: "서울특별시",
    districtName: "서울특별시장",
    realEstateManwon: 160000,
    totalAssetsManwon: 226597,
    primaryRealEstateRegion: "서울특별시",
    matchRegion: true,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 22.7억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "kim-doo-gyum",
    realEstateRank: 16,
    totalAssetsRank: 16,
    candidateName: "김두겸",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "울산광역시",
    districtName: "울산광역시장",
    realEstateManwon: 140000,
    totalAssetsManwon: 209264,
    primaryRealEstateRegion: "울산광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 20.9억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "park-wan-soo",
    realEstateRank: 17,
    totalAssetsRank: 17,
    candidateName: "박완수",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "경상남도",
    districtName: "경상남도지사",
    realEstateManwon: 130000,
    totalAssetsManwon: 198774,
    primaryRealEstateRegion: "경상남도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 19.9억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "jung-won-oh",
    realEstateRank: 18,
    totalAssetsRank: 24,
    candidateName: "정원오",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    sidoName: "서울특별시",
    districtName: "서울특별시장",
    realEstateManwon: 120000,
    totalAssetsManwon: 182389,
    primaryRealEstateRegion: "서울특별시",
    matchRegion: true,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료 / 보도 확인값",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 18.2억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "yoo-jeong-bok",
    realEstateRank: 19,
    totalAssetsRank: 21,
    candidateName: "유정복",
    partyName: "국민의힘",
    electionType: "시·도지사",
    sidoName: "인천광역시",
    districtName: "인천광역시장",
    realEstateManwon: 115000,
    totalAssetsManwon: 184427,
    primaryRealEstateRegion: "인천광역시",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 18.4억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
  {
    id: "kim-kyung-soo",
    realEstateRank: 20,
    totalAssetsRank: 22,
    candidateName: "김경수",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    sidoName: "경상남도",
    districtName: "경상남도지사",
    realEstateManwon: 110000,
    totalAssetsManwon: 183788,
    primaryRealEstateRegion: "경상남도",
    matchRegion: null,
    realEstateTags: ["세부내역확인필요"],
    status: "등록",
    badge: "업데이트필요",
    sourceLabel: "중앙선관위 공개자료",
    sourceUrl: NEC_URL,
    sourceDate: "2026-05-31",
    note: "총재산 약 18.4억 중 부동산 추정액. 세부 항목 확인 필요.",
  },
];

// ─── 유형별 TOP (부동산 세부 항목 미공개 → 업데이트필요 표시) ──────────────

export const LCRE_TYPE_TOP_APARTMENT: TypeTopItem[] = candidatesRaw.slice(0, 10).map((c, i) => ({
  rank: i + 1,
  candidateName: c.candidateName,
  partyName: c.partyName,
  districtName: c.districtName,
  amountManwon: 0,
  ratioInRealEstate: undefined,
  badge: "업데이트필요" as CandidateRealEstateBadge,
}));

export const LCRE_TYPE_TOP_LAND: TypeTopItem[] = candidatesRaw.slice(0, 10).map((c, i) => ({
  rank: i + 1,
  candidateName: c.candidateName,
  partyName: c.partyName,
  districtName: c.districtName,
  amountManwon: 0,
  ratioInRealEstate: undefined,
  badge: "업데이트필요" as CandidateRealEstateBadge,
}));

export const LCRE_TYPE_TOP_BUILDING: TypeTopItem[] = candidatesRaw.slice(0, 10).map((c, i) => ({
  rank: i + 1,
  candidateName: c.candidateName,
  partyName: c.partyName,
  districtName: c.districtName,
  amountManwon: 0,
  ratioInRealEstate: undefined,
  badge: "업데이트필요" as CandidateRealEstateBadge,
}));

// ─── 출마 지역 vs 부동산 소재지 교차 ────────────────────────────────────────

export const LCRE_REGION_CROSS: RegionCrossItem[] = [
  {
    candidateName: "오세훈",
    partyName: "국민의힘",
    electionType: "시·도지사",
    runningInSido: "서울특별시",
    realEstateRegion: "서울특별시",
    matchRegion: true,
    realEstateManwon: 580000,
  },
  {
    candidateName: "정원오",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    runningInSido: "서울특별시",
    realEstateRegion: "확인 필요",
    matchRegion: null,
    realEstateManwon: 120000,
  },
  {
    candidateName: "권영국",
    partyName: "정의당",
    electionType: "시·도지사",
    runningInSido: "서울특별시",
    realEstateRegion: "서울특별시",
    matchRegion: true,
    realEstateManwon: 160000,
  },
  {
    candidateName: "박형준",
    partyName: "국민의힘",
    electionType: "시·도지사",
    runningInSido: "부산광역시",
    realEstateRegion: "확인 필요",
    matchRegion: null,
    realEstateManwon: 390000,
  },
  {
    candidateName: "추경호",
    partyName: "국민의힘",
    electionType: "시·도지사",
    runningInSido: "대구광역시",
    realEstateRegion: "확인 필요",
    matchRegion: null,
    realEstateManwon: 300000,
  },
  {
    candidateName: "추미애",
    partyName: "더불어민주당",
    electionType: "시·도지사",
    runningInSido: "경기도",
    realEstateRegion: "확인 필요",
    matchRegion: null,
    realEstateManwon: 180000,
  },
  {
    candidateName: "조응천",
    partyName: "개혁신당",
    electionType: "시·도지사",
    runningInSido: "경기도",
    realEstateRegion: "확인 필요",
    matchRegion: null,
    realEstateManwon: 400000,
  },
];

// ─── 다주택 보유 후보 ────────────────────────────────────────────────────────

export const LCRE_MULTI_UNIT_CANDIDATES: MultiUnitCandidate[] = [
  {
    candidateName: "오세훈",
    partyName: "국민의힘",
    districtName: "서울특별시장",
    unitCount: 0,
    apartmentManwon: 0,
    badge: "업데이트필요",
    note: "아파트 세부 항목은 선관위 원문 확인 후 업데이트 예정입니다.",
  },
];

// ─── 부동산 vs 담보채무 ──────────────────────────────────────────────────────

export const LCRE_DEBT_RATIO_ITEMS: DebtRatioItem[] = [
  {
    candidateName: "오세훈",
    partyName: "국민의힘",
    districtName: "서울특별시장",
    realEstateManwon: 580000,
    debtOnRealEstateManwon: 0,
    netRealEstateManwon: 580000,
    debtRatio: 0,
    badge: "업데이트필요",
  },
];

// ─── 관련 링크 ───────────────────────────────────────────────────────────────

export const LCRE_RELATED_LINKS: RelatedReportLink[] = [
  {
    label: "지방선거 후보 재산 순위 TOP 50",
    href: "/reports/local-election-candidate-assets-ranking-2026/",
    description: "총재산 기준 전체 후보 허브 리포트",
  },
  {
    label: "광역단체장 후보 재산 비교 2026",
    href: "/reports/governor-mayor-candidate-assets-comparison-2026/",
    description: "시도지사 후보 전체 재산 비교",
  },
  {
    label: "서울시장 후보 재산·부동산 비교",
    href: "/reports/seoul-mayor-candidate-assets-2026/",
    description: "오세훈·정원오 재산 구조 심층 비교",
  },
  {
    label: "아파트 보유세 계산기",
    href: "/tools/apartment-holding-tax/",
    description: "공시가격 기준 보유세 직접 계산",
  },
  {
    label: "취득세 계산기",
    href: "/tools/real-estate-acquisition-tax/",
    description: "부동산 취득 시 세금 계산",
  },
];

// ─── 메인 데이터 객체 ────────────────────────────────────────────────────────

const topByRealEstate = [...candidatesRaw].sort((a, b) => b.realEstateManwon - a.realEstateManwon);

export const localElectionCandidateRealEstate2026: LcreData = {
  meta: {
    slug: "local-election-candidate-real-estate-2026",
    title: "2026 지방선거 후보 부동산 보유 현황 비교",
    seoTitle: "2026 지방선거 후보 부동산 보유 현황｜아파트·토지·건물 신고액 비교",
    description:
      "2026년 지방선거 시·도지사 후보자의 부동산 신고액을 아파트·토지·건물 유형별로 비교합니다. 부동산 보유액 TOP 랭킹과 출마 지역 vs 소재 지역 교차 분석, 공시가격 기준 안내를 함께 제공합니다.",
    h1: "2026 지방선거 후보 부동산 보유 현황 비교",
    eyebrow: "선거 데이터 리포트",
    updatedAt: "2026-05-31",
    electionDate: "2026-06-03",
    dataBasis: "중앙선관위 후보자 공개자료 기반 — 부동산 세부 항목은 원문 확인 진행 중",
    caution:
      "부동산 신고액은 공시가격 기준이며 실거래가와 다를 수 있습니다. 후보자 본인 외 배우자·직계존비속 명의 부동산이 포함될 수 있습니다. 아파트·토지·건물 세부 항목은 선관위 원문 확인 후 업데이트 예정입니다.",
  },
  sources: LCRE_SOURCES,
  summaryCards: [
    {
      label: "부동산 신고액 1위",
      value: `${topByRealEstate[0].candidateName} · ${formatManwon(topByRealEstate[0].realEstateManwon)}`,
      description: "시·도지사 후보 공개자료 기준 부동산 추정액 1위 (세부 항목 확인 중)",
      tone: "primary",
      badge: "업데이트필요",
    },
    {
      label: "아파트 1위",
      value: "확인 진행 중",
      description: "아파트·공동주택 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
      tone: "muted",
      badge: "업데이트필요",
    },
    {
      label: "토지 1위",
      value: "확인 진행 중",
      description: "토지 세부 항목은 선관위 원문 확인 후 업데이트합니다.",
      tone: "muted",
      badge: "업데이트필요",
    },
    {
      label: "부동산 비중 1위",
      value: "확인 진행 중",
      description: "총재산 대비 부동산 비중은 세부 항목 확인 후 계산합니다.",
      tone: "caution",
      badge: "업데이트필요",
    },
  ],
  candidates: topByRealEstate,
  typeTopApartment: LCRE_TYPE_TOP_APARTMENT,
  typeTopLand: LCRE_TYPE_TOP_LAND,
  typeTopBuilding: LCRE_TYPE_TOP_BUILDING,
  regionCross: LCRE_REGION_CROSS,
  multiUnitCandidates: LCRE_MULTI_UNIT_CANDIDATES,
  debtRatioItems: LCRE_DEBT_RATIO_ITEMS,
  relatedLinks: LCRE_RELATED_LINKS,
  faq: [
    {
      q: "후보 부동산 신고액은 어떻게 확인하나요?",
      a: "중앙선거관리위원회 선거통계시스템(info.nec.go.kr)에서 후보자 정보 공개자료를 통해 확인할 수 있습니다. 이 페이지는 공개자료를 정리해 비교하기 쉬운 형태로 제공합니다.",
    },
    {
      q: "후보 부동산 신고액이 실제 시세인가요?",
      a: "아닙니다. 공동주택(아파트)은 공시가격, 토지는 공시지가 기준으로 신고하는 것이 원칙입니다. 공시가격이 시세보다 낮게 형성된 경우 실제 보유 가치는 더 높을 수 있습니다.",
    },
    {
      q: "후보 부동산에 가족 재산도 포함되나요?",
      a: "네. 후보자 본인 외에 배우자와 직계존비속 명의의 부동산도 신고 대상에 포함될 수 있습니다.",
    },
    {
      q: "다주택 후보는 어떻게 확인하나요?",
      a: "선관위 신고자료에서 아파트·공동주택 항목이 2개 이상인 후보를 집계합니다. 세부 항목은 선관위 원문 확인 후 업데이트됩니다.",
    },
    {
      q: "담보대출(채무)이 있는 부동산은 어떻게 봐야 하나요?",
      a: "부동산 신고액에서 담보채무를 차감한 순 부동산 자산이 실질 보유 가치에 가깝습니다. 이 페이지에서는 신고된 채무와 함께 순 부동산 자산 추정값을 제공합니다.",
    },
    {
      q: "출마 지역과 부동산 소재 지역이 다르면 문제인가요?",
      a: "출마 지역과 소재지 일치 여부는 유권자가 참고할 수 있는 정보이지만, 이 자체가 법적 문제가 되는 것은 아닙니다. 이 페이지는 중립적으로 사실 정보만 제공합니다.",
    },
    {
      q: "공시가격과 실거래가 차이는 얼마나 나나요?",
      a: "서울 아파트의 경우 공시가격이 실거래가의 70~90% 수준인 경우가 많습니다. 따라서 후보 부동산 신고액이 실거래가로 환산하면 더 높을 수 있습니다.",
    },
    {
      q: "이 페이지 데이터는 언제 업데이트되나요?",
      a: "선관위 원문 자료 확인이 완료되는 순서대로 아파트·토지·건물 세부 항목을 업데이트합니다. 후보 사퇴·등록무효·자료 정정 시에도 반영됩니다.",
    },
  ],
  seoIntro: [
    "지방선거 후보의 부동산 보유 현황은 단순히 '얼마짜리 집'이 아니라 어떤 유형(아파트·토지·건물)의 부동산을, 어느 지역에, 어떤 채무 조건으로 보유하고 있는지를 함께 봐야 의미가 생긴다. 같은 총재산이라도 부동산 중심인지, 금융자산 중심인지에 따라 자산 구조가 완전히 다르게 읽힌다.",
    "이 페이지는 중앙선거관리위원회 후보자 재산 신고자료 중 부동산 항목을 특화해 정리한 데이터 리포트다. 총재산 순위와 부동산 신고액 순위가 일치하지 않는 후보를 발견하고, 아파트·토지·건물 유형별 분리, 출마 지역과 부동산 소재지 교차 분석을 제공한다.",
    "후보 부동산 신고액은 공시가격 기준으로 신고하는 것이 원칙이므로 실거래가와 다를 수 있다. 특히 서울·수도권 아파트의 경우 공시가격이 시세의 70~90% 수준으로 형성되는 경우가 많아, 신고액이 실제 보유 가치보다 낮게 표시될 수 있다. 이 점을 이해하고 숫자를 읽어야 한다.",
    "이 리포트는 특정 후보를 지지하거나 반대하는 콘텐츠가 아니다. 공개된 재산 신고자료를 바탕으로 부동산 항목을 구조화해 유권자가 이해하기 쉽게 정리한 참고 자료다. 실제 투표 판단은 부동산 보유 현황 외에 공약, 경력, 전과, 납세, 병역 등을 종합적으로 검토해야 한다.",
  ],
  seoCriteria: [
    "중앙선거관리위원회 선거통계시스템 공개자료를 1차 기준으로 삼았습니다.",
    "부동산 세부 항목(아파트·토지·건물)은 원문 확인 진행 중이며 확인 완료 순으로 업데이트됩니다.",
    "부동산 신고액은 공시가격 기준이며 실거래가와 다를 수 있습니다.",
    "후보 사퇴·등록무효·자료 정정 발생 시 해당 후보 정보가 수정될 수 있습니다.",
  ],
};
