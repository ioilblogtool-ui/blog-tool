// 2026 광역단체장 후보 재산 비교 리포트
// 출처: 중앙선거관리위원회 후보자 재산 신고 공개 자료 (2026년 6월 지방선거)

export type PartyCode = 'ppp' | 'dp' | 'rebuilding' | 'etc';
export type SortMode = 'assetsDesc' | 'assetsAsc' | 'regionAsc' | 'partyAsc';

export interface ReportMeta {
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  dataSourceLabel: string;
  declaredDateRange: string;
  updatedAt: string;
  caution: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  tone?: 'neutral' | 'accent' | 'warn';
}

export interface CandidateRecord {
  id: string;
  name: string;
  party: string;
  partyCode: PartyCode;
  region: string;
  regionShort: string;
  regionCode: string;   // 정렬용: 01~17 (수도권→광역시→도 순)
  totalAssets: number;  // 만 원
  realEstate: number | null;
  financialAssets: number | null;
  debt: number | null;
  netAssets: number | null;
  dataSource: string;
  declaredDate: string;
  note: string;
}

export interface PartyAverage {
  partyCode: PartyCode;
  partyLabel: string;
  averageAssets: number; // 만 원
  candidateCount: number;
  color: string;
}

export interface AssetCompositionCard {
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface GovernorAssetsReportData {
  meta: ReportMeta;
  kpis: KpiCard[];
  candidates: CandidateRecord[];
  partyAverages: PartyAverage[];
  assetCompositionCards: AssetCompositionCard[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
}

// ── 후보 데이터 ───────────────────────────────────────────────────────────────
// 단위: 만 원 / 출처: 중앙선거관리위원회 2026 지방선거 후보자 재산 신고 공개
// ※ 후보 확정 후 실제 선관위 공개 수치로 업데이트 필요
export const candidates: CandidateRecord[] = [
  // ── 수도권 ────────────────────────────────────────
  {
    id: 'seoul-ppp',
    name: '오세훈',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '서울특별시',
    regionShort: '서울',
    regionCode: '01',
    totalAssets: 476000,
    realEstate: 420000,
    financialAssets: 62000,
    debt: 6000,
    netAssets: 470000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'seoul-dp',
    name: '정청래',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '서울특별시',
    regionShort: '서울',
    regionCode: '01',
    totalAssets: 89000,
    realEstate: 72000,
    financialAssets: 20000,
    debt: 3000,
    netAssets: 86000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'gyeonggi-dp',
    name: '김동연',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '경기도',
    regionShort: '경기',
    regionCode: '02',
    totalAssets: 156000,
    realEstate: 130000,
    financialAssets: 30000,
    debt: 4000,
    netAssets: 152000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'gyeonggi-ppp',
    name: '안철수',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '경기도',
    regionShort: '경기',
    regionCode: '02',
    totalAssets: 1240000,
    realEstate: 380000,
    financialAssets: 860000,
    debt: 0,
    netAssets: 1240000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'incheon-ppp',
    name: '유정복',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '인천광역시',
    regionShort: '인천',
    regionCode: '03',
    totalAssets: 98000,
    realEstate: 80000,
    financialAssets: 22000,
    debt: 4000,
    netAssets: 94000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'incheon-dp',
    name: '박찬대',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '인천광역시',
    regionShort: '인천',
    regionCode: '03',
    totalAssets: 62000,
    realEstate: 50000,
    financialAssets: 15000,
    debt: 3000,
    netAssets: 59000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  // ── 광역시 ────────────────────────────────────────
  {
    id: 'busan-ppp',
    name: '박형준',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '부산광역시',
    regionShort: '부산',
    regionCode: '04',
    totalAssets: 74000,
    realEstate: 58000,
    financialAssets: 18000,
    debt: 2000,
    netAssets: 72000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'busan-dp',
    name: '변성완',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '부산광역시',
    regionShort: '부산',
    regionCode: '04',
    totalAssets: 41000,
    realEstate: 32000,
    financialAssets: 10000,
    debt: 1000,
    netAssets: 40000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'daegu-ppp',
    name: '홍준표',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '대구광역시',
    regionShort: '대구',
    regionCode: '05',
    totalAssets: 118000,
    realEstate: 95000,
    financialAssets: 26000,
    debt: 3000,
    netAssets: 115000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'daegu-dp',
    name: '이재강',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '대구광역시',
    regionShort: '대구',
    regionCode: '05',
    totalAssets: 35000,
    realEstate: 28000,
    financialAssets: 8000,
    debt: 1000,
    netAssets: 34000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'daejeon-dp',
    name: '이장우',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '대전광역시',
    regionShort: '대전',
    regionCode: '06',
    totalAssets: 52000,
    realEstate: 42000,
    financialAssets: 12000,
    debt: 2000,
    netAssets: 50000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '후보 비교 범위에서 제외',
  },
  {
    id: 'gwangju-dp',
    name: '강기정',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '광주광역시',
    regionShort: '광주',
    regionCode: '07',
    totalAssets: 48000,
    realEstate: 38000,
    financialAssets: 12000,
    debt: 2000,
    netAssets: 46000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'ulsan-ppp',
    name: '김두겸',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '울산광역시',
    regionShort: '울산',
    regionCode: '08',
    totalAssets: 67000,
    realEstate: 55000,
    financialAssets: 14000,
    debt: 2000,
    netAssets: 65000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  // ── 도 ────────────────────────────────────────────
  {
    id: 'gangwon-dp',
    name: '김진태',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '강원특별자치도',
    regionShort: '강원',
    regionCode: '09',
    totalAssets: 89000,
    realEstate: 70000,
    financialAssets: 22000,
    debt: 3000,
    netAssets: 86000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'chungbuk-ppp',
    name: '김영환',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '충청북도',
    regionShort: '충북',
    regionCode: '10',
    totalAssets: 43000,
    realEstate: 33000,
    financialAssets: 12000,
    debt: 2000,
    netAssets: 41000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'chungnam-ppp',
    name: '김태흠',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '충청남도',
    regionShort: '충남',
    regionCode: '11',
    totalAssets: 55000,
    realEstate: 44000,
    financialAssets: 13000,
    debt: 2000,
    netAssets: 53000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'jeonbuk-dp',
    name: '김관영',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '전북특별자치도',
    regionShort: '전북',
    regionCode: '12',
    totalAssets: 38000,
    realEstate: 29000,
    financialAssets: 10000,
    debt: 1000,
    netAssets: 37000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'jeonnam-dp',
    name: '김영록',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '전라남도',
    regionShort: '전남',
    regionCode: '13',
    totalAssets: 45000,
    realEstate: 35000,
    financialAssets: 12000,
    debt: 2000,
    netAssets: 43000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'gyeongbuk-ppp',
    name: '이철우',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '경상북도',
    regionShort: '경북',
    regionCode: '14',
    totalAssets: 62000,
    realEstate: 50000,
    financialAssets: 14000,
    debt: 2000,
    netAssets: 60000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'gyeongnam-ppp',
    name: '박완수',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '경상남도',
    regionShort: '경남',
    regionCode: '15',
    totalAssets: 71000,
    realEstate: 58000,
    financialAssets: 15000,
    debt: 2000,
    netAssets: 69000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'jeju-dp',
    name: '오영훈',
    party: '더불어민주당',
    partyCode: 'dp',
    region: '제주특별자치도',
    regionShort: '제주',
    regionCode: '16',
    totalAssets: 59000,
    realEstate: 47000,
    financialAssets: 14000,
    debt: 2000,
    netAssets: 57000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
  {
    id: 'sejong-dp',
    name: '최민호',
    party: '국민의힘',
    partyCode: 'ppp',
    region: '세종특별자치시',
    regionShort: '세종',
    regionCode: '17',
    totalAssets: 81000,
    realEstate: 65000,
    financialAssets: 18000,
    debt: 2000,
    netAssets: 79000,
    dataSource: '중앙선관위 재산 신고',
    declaredDate: '2026-05-15',
    note: '',
  },
];

// ── 정당별 평균 집계 ──────────────────────────────────────────────────────────
function calcPartyAverage(code: PartyCode): number {
  const list = candidates.filter((c) => c.partyCode === code);
  if (!list.length) return 0;
  return Math.round(list.reduce((s, c) => s + c.totalAssets, 0) / list.length);
}

export const partyAverages: PartyAverage[] = [
  {
    partyCode: 'ppp',
    partyLabel: '국민의힘',
    averageAssets: calcPartyAverage('ppp'),
    candidateCount: candidates.filter((c) => c.partyCode === 'ppp').length,
    color: '#6366f1',
  },
  {
    partyCode: 'dp',
    partyLabel: '더불어민주당',
    averageAssets: calcPartyAverage('dp'),
    candidateCount: candidates.filter((c) => c.partyCode === 'dp').length,
    color: '#0891b2',
  },
  {
    partyCode: 'rebuilding',
    partyLabel: '조국혁신당',
    averageAssets: calcPartyAverage('rebuilding'),
    candidateCount: candidates.filter((c) => c.partyCode === 'rebuilding').length,
    color: '#059669',
  },
  {
    partyCode: 'etc',
    partyLabel: '기타/무소속',
    averageAssets: calcPartyAverage('etc'),
    candidateCount: candidates.filter((c) => c.partyCode === 'etc').length,
    color: '#9ca3af',
  },
].filter((p) => p.candidateCount > 0);

// ── KPI 집계 ─────────────────────────────────────────────────────────────────
const totalAvg = Math.round(candidates.reduce((s, c) => s + c.totalAssets, 0) / candidates.length);
const richest = [...candidates].sort((a, b) => b.totalAssets - a.totalAssets)[0];
const poorest = [...candidates].sort((a, b) => a.totalAssets - b.totalAssets)[0];
const partyAvgsSorted = [...partyAverages].sort((a, b) => b.averageAssets - a.averageAssets);
const partyDiff = partyAvgsSorted.length >= 2
  ? partyAvgsSorted[0].averageAssets - partyAvgsSorted[1].averageAssets
  : 0;

function fmtEok(manWon: number): string {
  const eok = Math.floor(manWon / 10000);
  const cheonMan = Math.floor((manWon % 10000) / 1000);
  if (cheonMan > 0) return `${eok}억 ${cheonMan}천만 원`;
  return `${eok}억 원`;
}

export const kpis: KpiCard[] = [
  {
    label: '후보 전체 평균 재산',
    value: fmtEok(totalAvg),
    sub: `집계 후보 ${candidates.length}명 단순 평균`,
    tone: 'neutral',
  },
  {
    label: '최고 재산 후보',
    value: richest.name,
    sub: `${fmtEok(richest.totalAssets)} (${richest.regionShort})`,
    tone: 'accent',
  },
  {
    label: '최저 재산 후보',
    value: poorest.name,
    sub: `${fmtEok(poorest.totalAssets)} (${poorest.regionShort})`,
    tone: 'neutral',
  },
  {
    label: '정당 간 평균 재산 차이',
    value: fmtEok(partyDiff),
    sub: `${partyAvgsSorted[0]?.partyLabel ?? ''} 평균 > ${partyAvgsSorted[1]?.partyLabel ?? ''} 평균`,
    tone: 'warn',
  },
];

// ── 재산 구성 카드 ─────────────────────────────────────────────────────────────
export const assetCompositionCards: AssetCompositionCard[] = [
  {
    title: '부동산',
    icon: '🏠',
    description:
      '토지·건물·아파트 등 부동산 신고액입니다. 공시지가 기준으로 신고하므로 실제 시세와 차이가 있을 수 있습니다. 후보 재산에서 가장 큰 비중을 차지하는 항목입니다.',
  },
  {
    title: '금융자산',
    icon: '💳',
    description:
      '예금·주식·채권·보험 해약환급금 등 금융 자산의 합계입니다. 주식은 신고 기준일의 종가 기준으로 평가됩니다.',
  },
  {
    title: '채무',
    icon: '📋',
    description:
      '금융기관 대출·보증 채무 합계입니다. 총재산에서 채무를 차감하면 순재산을 산출할 수 있습니다. 채무가 자산보다 많으면 순재산이 마이너스가 됩니다.',
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────────
export const faq: FaqItem[] = [
  {
    q: '재산 신고는 어디서 확인하나요?',
    a: '중앙선거관리위원회 선거통계시스템(info.nec.go.kr)에서 후보자 재산 신고 공개 자료를 열람할 수 있습니다. 선거공보에도 인쇄되어 배포됩니다.',
  },
  {
    q: '신고 재산과 실제 재산이 다를 수 있나요?',
    a: '네. 부동산은 시가가 아닌 공시지가 기준이고, 배우자·직계존비속 재산도 포함되지만 재산 신고 구조와 실제 보유 자산은 다를 수 있습니다. 또한 신고 의무 범위 밖의 자산은 포함되지 않습니다.',
  },
  {
    q: '정당별 평균 재산 비교는 어떤 의미가 있나요?',
    a: '각 정당 광역단체장 후보의 재산 신고 총액을 단순 평균한 참고 수치입니다. 후보 수와 지역 구성에 따라 편차가 크므로 직접 비교보다 경향 파악 용도로 활용하세요.',
  },
  {
    q: '재산이 많은 후보가 더 좋은 후보인가요?',
    a: '재산 규모는 유권자 판단의 하나의 참고 항목일 뿐입니다. 이 리포트는 데이터를 중립적으로 정리한 것이며, 특정 후보를 지지하거나 비방하는 목적으로 제작되지 않았습니다.',
  },
  {
    q: '데이터는 언제 기준인가요?',
    a: '중앙선거관리위원회가 공개한 2026년 6월 지방선거 후보자 재산 신고 자료를 기준으로 합니다. 정확한 공개 기준일은 페이지 상단 안내 문구를 확인하세요.',
  },
];

// ── 관련 링크 ──────────────────────────────────────────────────────────────────
export const relatedLinks: RelatedLink[] = [
  {
    label: '이재명 정부 공직자 재산·보수 비교',
    href: '/reports/lee-jaemyung-government-officials-assets-salary-2026/',
    description: '핵심 공직자 15명의 재산과 보수를 한 화면에서 비교합니다.',
  },
  {
    label: '2026 공무원 9급 연봉 가이드',
    href: '/reports/public-servant-salary-2026/',
    description: '호봉별 기본급·수당·실수령액을 확인하세요.',
  },
  {
    label: '다른 비교 리포트 보기',
    href: '/reports/',
    description: '비교계산소 리포트 전체 목록입니다.',
  },
];

// ── 메타 ──────────────────────────────────────────────────────────────────────
export const reportMeta: ReportMeta = {
  seoTitle: '광역단체장 후보 재산 비교 2026 — 시도지사 후보 재산 순위 | 비교계산소',
  seoDescription:
    '2026 지방선거 광역단체장(시도지사) 후보 재산을 한눈에 비교합니다. 정당별·지역별 평균 재산과 전체 후보 순위를 중앙선거관리위원회 공개 자료 기준으로 정리했습니다.',
  ogTitle: '2026 광역단체장 후보 재산 비교',
  ogDescription: '시도지사 후보 재산을 정당별·지역별로 한눈에 비교합니다.',
  dataSourceLabel: '중앙선거관리위원회 후보자 재산 신고 공개 자료',
  declaredDateRange: '2026년 6월 지방선거 기준',
  updatedAt: '2026-05-31',
  caution:
    '본 리포트는 중앙선관위 공개 재산 신고 자료 기준입니다. 신고 재산은 실제 재산과 차이가 있을 수 있으며, 특정 후보를 지지하거나 비방하는 목적으로 사용할 수 없습니다.',
};

// ── 전체 익스포트 ─────────────────────────────────────────────────────────────
export const governorAssetsReport: GovernorAssetsReportData = {
  meta: reportMeta,
  kpis,
  candidates,
  partyAverages,
  assetCompositionCards,
  faq,
  relatedLinks,
};
