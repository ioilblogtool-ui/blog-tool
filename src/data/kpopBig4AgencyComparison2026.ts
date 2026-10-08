// HYBE·SM·JYP·YG 4대 기획사 비교 2026 — 데이터
// 실적·총자산·직원 수·매출 구성·아티스트: 각 사 2025 사업보고서 / 2026 반기보고서 (DART) 확인값
// 금액 단위: 백만원 정수 (원 자료 원·천원 → 백만원 사사오입). 화면은 억원으로 표시

export type AgencyId = 'hybe' | 'sm' | 'jyp' | 'yg';
export type Badge = '공식' | '참고' | '시뮬레이션' | '추정';

export type Source = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedAt: string | null;
  checkedAt: string;
  locator: string;
  limitation: string | null;
};

export type Metric =
  | { status: 'available'; value: number; badge: Badge; sourceId: string; note?: string }
  | { status: 'missing'; value: null; badge: null; sourceId: null; reason: string };

export type AnnualFinancials = {
  fiscalYear: 2025;
  basis: 'consolidated';
  revenue: Metric;
  operatingIncome: Metric;
  netIncome: Metric;
  netIncomeOwners: Metric;
  totalAssets: Metric;
  prevRevenue: Metric;
  prevOperatingIncome: Metric;
  nonOperatingNote: string | null;
};

export type QuarterFinancials = {
  label: '2026 2Q';
  periodEnd: '2026-06-30';
  basis: 'consolidated';
  revenue: Metric;
  operatingIncome: Metric;
  prevYearRevenue: Metric;
  prevYearOperatingIncome: Metric;
  driverNote: { text: string; badge: Badge; sourceIds: string[] } | null;
};

export type MarketSnapshot = {
  asOf: string;
  priceType: 'close';
  closePriceWon: Metric;
  sharesOutstanding: Metric;
};

export type ArtistEntry = { name: string; sourceId: string; verifiedAt: string };

export type Segment = { originalName: string; revenue: Metric };

export type EvidenceText = { text: string; badge: Badge; sourceIds: string[] };

export type AgencyRecord = {
  id: AgencyId;
  nameKo: string;
  shortName: string;
  listedName: string;
  exchange: 'KOSPI' | 'KOSDAQ';
  ticker: string;
  structure: 'multi-label' | 'hq-with-subsidiaries';
  structureText: string;
  labels: string[];
  annual: AnnualFinancials;
  latestQuarter: QuarterFinancials;
  market: MarketSnapshot;
  employees: Metric;
  overseasShare: { value: number; basisText: string; sourceId: string };
  segments: Segment[];
  segmentNote: string;
  keyIp: ArtistEntry[];
  ipNote: string;
  strengths: EvidenceText[];
  risks: EvidenceText[];
};

export type FanomenonFactKind = '확인된 사실' | '제기된 문제' | '당사자 설명' | '정부 설명' | '미확인';
export type FanomenonFact = {
  id: string;
  topic: 'role' | 'audit' | 'schedule' | 'venue' | 'format' | 'entity' | 'trademark' | 'opportunityCost' | 'government' | 'revenueModel' | 'economicEffect' | 'smallAgencies' | 'lineup';
  kind: FanomenonFactKind;
  text: string;
  badge: Badge | null;
  sourceIds: string[];
  date: string | null;
};

const CHECKED = '2026-10-08';
const MARKET_AS_OF = '2026-10-07';

export const KB4_META = {
  slug: 'kpop-big4-agency-comparison-2026',
  title: '4대 기획사 비교 2026 | HYBE·SM·JYP·YG 시총·실적',
  description: '박진영 패노메논 이슈로 주목받은 HYBE·SM·JYP·YG 4대 기획사를 시가총액, 2025 매출·영업이익, 영업이익률, 대표 아티스트와 사업구조로 비교합니다.',
  h1: 'HYBE·SM·JYP·YG, 4대 기획사는 실제로 얼마나 다를까?',
  checkedAt: CHECKED,
  marketAsOf: MARKET_AS_OF,
  publishedAt: '2026-10-08',
  modifiedAt: '2026-10-08',
  publishReady: true,
};

const dart = (id: string, title: string, rcpNo: string, publishedAt: string, locator: string): Source => ({
  id, publisher: '금융감독원 DART', title, url: `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${rcpNo}`, publishedAt, checkedAt: CHECKED, locator, limitation: null,
});

export const KB4_SOURCES: Source[] = [
  dart('dart-hybe-2025-ar', '하이브 2025 사업보고서', '20260320000802', '2026-03-20', '요약재무정보·연결 포괄손익계산서·매출 및 수주상황·직원 등 현황·기타 참고사항'),
  dart('dart-sm-2025-ar', '에스엠 2025 사업보고서', '20260317000781', '2026-03-17', '요약재무정보·연결 포괄손익계산서·주요 제품 및 서비스·직원 등 현황·회사의 개요'),
  dart('dart-jyp-2025-ar', 'JYP Ent. 2025 사업보고서', '20260318001519', '2026-03-18', '요약재무정보·매출 및 수주상황·직원 등 현황·사업의 개요'),
  dart('dart-yg-2025-ar', '와이지엔터테인먼트 2025 사업보고서', '20260323001610', '2026-03-23', '요약재무정보·연결 포괄손익계산서·주요 제품 및 서비스·직원 등 현황·주요계약(전속계약 현황)'),
  dart('dart-hybe-2026-h1', '하이브 2026 반기보고서', '20260814004127', '2026-08-14', '연결 포괄손익계산서 3개월 열·주식의 총수'),
  dart('dart-sm-2026-h1', '에스엠 2026 반기보고서', '20260814002930', '2026-08-14', '연결 포괄손익계산서 3개월 열·주식의 총수'),
  dart('dart-jyp-2026-h1', 'JYP Ent. 2026 반기보고서', '20260814003204', '2026-08-14', '연결 포괄손익계산서 3개월 열·주식의 총수'),
  dart('dart-yg-2026-h1', '와이지엔터테인먼트 2026 반기보고서', '20260814004237', '2026-08-14', '연결 포괄손익계산서 3개월 열·주식의 총수'),
  { id: 'price-close', publisher: 'Yahoo Finance (KRX 일별 종가)', title: '352820.KS·041510.KQ·035900.KQ·122870.KQ 일별 시세', url: 'https://finance.yahoo.com/quote/352820.KS/history/', publishedAt: MARKET_AS_OF, checkedAt: CHECKED, locator: `${MARKET_AS_OF} 종가`, limitation: 'KRX 정보데이터시스템은 로그인이 필요해 외부 시세 서비스의 종가를 사용했습니다.' },
  { id: 'hybe-business', publisher: '하이브', title: '하이브 비즈니스 소개(레이블)', url: 'https://hybecorp.com/ko/company/business/', publishedAt: null, checkedAt: CHECKED, locator: 'MUSIC 레이블 목록', limitation: null },
  { id: 'news-hybe-2q', publisher: '뉴시스', title: 'BTS 컴백 효과 톡톡…하이브, 2분기 매출 1조4500억원 달성', url: 'https://www.newsis.com/view/NISX20260728_0003726594', publishedAt: '2026-07-28', checkedAt: CHECKED, locator: '본문', limitation: null },
  { id: 'news-audit-fn', publisher: '파이낸셜뉴스', title: "'암살자(들)' 공방…박진영, 패노메논 특혜 의혹 부인 [2026 국감]", url: 'https://www.fnnews.com/news/202610071453090365', publishedAt: '2026-10-07', checkedAt: CHECKED, locator: '본문', limitation: null },
  { id: 'news-audit-dd', publisher: '디지털데일리', title: '국감 증인 선 박진영 “4대 기획사 가수들, 패노메논 출연 안하면 2~3배 더 벌어”', url: 'https://www.ddaily.co.kr/page/view/2026100715074705265', publishedAt: '2026-10-07', checkedAt: CHECKED, locator: '본문', limitation: null },
  { id: 'news-audit-yna', publisher: '연합뉴스', title: '패노메논 4대 기획사 전담 법인 관련 국감 보도', url: 'https://www.yna.co.kr/amp/view/AKR20261007127452005', publishedAt: '2026-10-07', checkedAt: CHECKED, locator: '본문', limitation: '조사 환경에서 원문을 직접 열람하지 못해 다른 매체 보도로 교차 확인했습니다.' },
  { id: 'news-audit-ytn', publisher: 'YTN', title: '박진영 "패노메논, 4대 기획사 특혜 아닌 희생"', url: 'https://www.ytn.co.kr/_ln/0106_202610071548359006', publishedAt: '2026-10-07', checkedAt: CHECKED, locator: '본문', limitation: null },
  { id: 'news-launch-dd', publisher: '디지털데일리', title: '‘경제효과 1조원’ K코첼라 현실로…패노메논, 내년 12월 창동아레나서 개최', url: 'https://www.ddaily.co.kr/page/view/2026072715221584217', publishedAt: '2026-07-27', checkedAt: CHECKED, locator: '본문', limitation: null },
  { id: 'news-industry-tf', publisher: '더팩트', title: "[패노메논을 향한 시선들②] '패노메논'을 둘러싼 업계의 반응", url: 'https://news.tf.co.kr/read/ogmeta/2357437.htm', publishedAt: '2026-08-25', checkedAt: CHECKED, locator: '본문', limitation: null },
];

const ok = (value: number, sourceId: string, badge: Badge = '공식', note?: string): Metric => ({ status: 'available', value, badge, sourceId, ...(note ? { note } : {}) });

export const KB4_AGENCIES: AgencyRecord[] = [
  {
    id: 'hybe', nameKo: '하이브', shortName: 'HYBE', listedName: '하이브', exchange: 'KOSPI', ticker: '352820',
    structure: 'multi-label',
    structureText: '여러 레이블 자회사와 플랫폼(위버스)·해외 법인을 거느린 멀티레이블 구조입니다. 아티스트는 하이브 본사가 아니라 각 레이블에 속합니다.',
    labels: ['BIGHIT MUSIC', 'BELIFT LAB', 'SOURCE MUSIC', 'PLEDIS ENTERTAINMENT', 'KOZ ENTERTAINMENT', 'ADOR', 'YX LABELS', 'HYBE X Geffen Records 등'],
    annual: {
      fiscalYear: 2025, basis: 'consolidated',
      revenue: ok(2649870, 'dart-hybe-2025-ar'), operatingIncome: ok(49318, 'dart-hybe-2025-ar'),
      netIncome: ok(-254385, 'dart-hybe-2025-ar'), netIncomeOwners: ok(-237280, 'dart-hybe-2025-ar'),
      totalAssets: ok(5485474, 'dart-hybe-2025-ar'),
      prevRevenue: ok(2255649, 'dart-hybe-2025-ar'), prevOperatingIncome: ok(184045, 'dart-hybe-2025-ar'),
      nonOperatingNote: '2025년 연결 기타비용이 2,950억원으로 늘어 영업이익보다 큰 순손실이 났습니다.',
    },
    latestQuarter: {
      label: '2026 2Q', periodEnd: '2026-06-30', basis: 'consolidated',
      revenue: ok(1449998, 'dart-hybe-2026-h1'), operatingIncome: ok(170925, 'dart-hybe-2026-h1'),
      prevYearRevenue: ok(705649, 'dart-hybe-2026-h1'), prevYearOperatingIncome: ok(65919, 'dart-hybe-2026-h1'),
      driverNote: { text: '방탄소년단 컴백·투어가 반영된 분기라는 보도가 있습니다. 같은 해 1분기는 영업손실(약 1,966억원)이었습니다.', badge: '참고', sourceIds: ['news-hybe-2q', 'dart-hybe-2026-h1'] },
    },
    market: { asOf: MARKET_AS_OF, priceType: 'close', closePriceWon: ok(167000, 'price-close', '참고'), sharesOutstanding: ok(43102249, 'dart-hybe-2026-h1', '공식', '2026-06-30 발행주식 총수. 이후 전환사채 전환 등으로 달라질 수 있습니다.') },
    employees: ok(893, 'dart-hybe-2025-ar'),
    overseasShare: { value: 72.7, basisText: '지역별 매출 중 국내 외 비중', sourceId: 'dart-hybe-2025-ar' },
    segments: [
      { originalName: '음반/음원', revenue: ok(772960, 'dart-hybe-2025-ar') },
      { originalName: '공연', revenue: ok(763949, 'dart-hybe-2025-ar') },
      { originalName: 'MD 및 라이선싱', revenue: ok(570571, 'dart-hybe-2025-ar') },
      { originalName: '콘텐츠', revenue: ok(258846, 'dart-hybe-2025-ar') },
      { originalName: '광고·출연료', revenue: ok(147155, 'dart-hybe-2025-ar') },
      { originalName: '팬클럽 등 기타', revenue: ok(136389, 'dart-hybe-2025-ar') },
    ],
    segmentNote: '사업보고서 제품별 매출(연결) 분류 그대로입니다.',
    keyIp: ['방탄소년단', '투모로우바이투게더', '세븐틴', '투어스', '엔하이픈', '아일릿', '르세라핌', '뉴진스', '보이넥스트도어', '코르티스'].map(name => ({ name, sourceId: 'dart-hybe-2025-ar', verifiedAt: CHECKED })),
    ipNote: '사업보고서 ‘기타 참고사항’에 IP 사업 대상으로 기재된 아티스트입니다. 모두 HYBE 레이블 소속이며 레이블별 배정은 각 레이블 공지를 확인하세요.',
    strengths: [
      { text: '2025년 연결 매출 2조 6,499억원으로 4개사 중 가장 크고, 공연 매출만 7,639억원(전년 4,509억원)입니다.', badge: '공식', sourceIds: ['dart-hybe-2025-ar'] },
      { text: '해외 매출 비중이 약 72.7%로 높고, 팬 플랫폼 위버스를 직접 운영합니다.', badge: '공식', sourceIds: ['dart-hybe-2025-ar'] },
    ],
    risks: [
      { text: '2025년 영업이익률 1.9%로 4개사 중 가장 낮고, 연결 순손실 2,544억원을 냈습니다.', badge: '공식', sourceIds: ['dart-hybe-2025-ar'] },
      { text: '2026년 1분기 영업손실 뒤 2분기 흑자로 돌아서는 등 분기별 실적 변동이 큽니다.', badge: '공식', sourceIds: ['dart-hybe-2026-h1'] },
    ],
  },
  {
    id: 'sm', nameKo: 'SM엔터테인먼트', shortName: 'SM', listedName: '에스엠', exchange: 'KOSDAQ', ticker: '041510',
    structure: 'hq-with-subsidiaries',
    structureText: '본사가 아티스트 IP를 운영하고 광고·영상·팬덤 플랫폼·여행 등 자회사를 연결합니다. 공시 기준 기업집단 ‘카카오’ 소속입니다.',
    labels: [],
    annual: {
      fiscalYear: 2025, basis: 'consolidated',
      revenue: ok(1174935, 'dart-sm-2025-ar'), operatingIncome: ok(183034, 'dart-sm-2025-ar'),
      netIncome: ok(359364, 'dart-sm-2025-ar'), netIncomeOwners: ok(347213, 'dart-sm-2025-ar'),
      totalAssets: ok(2007711, 'dart-sm-2025-ar'),
      prevRevenue: ok(989725, 'dart-sm-2025-ar'), prevOperatingIncome: ok(87297, 'dart-sm-2025-ar'),
      nonOperatingNote: '2025년 순이익에는 관계기업 및 공동기업투자이익 2,140억원이 포함돼 영업이익보다 순이익이 큽니다.',
    },
    latestQuarter: {
      label: '2026 2Q', periodEnd: '2026-06-30', basis: 'consolidated',
      revenue: ok(349641, 'dart-sm-2026-h1'), operatingIncome: ok(52880, 'dart-sm-2026-h1'),
      prevYearRevenue: ok(302914, 'dart-sm-2026-h1'), prevYearOperatingIncome: ok(47611, 'dart-sm-2026-h1'),
      driverNote: null,
    },
    market: { asOf: MARKET_AS_OF, priceType: 'close', closePriceWon: ok(79000, 'price-close', '참고'), sharesOutstanding: ok(22894690, 'dart-sm-2026-h1', '공식', '2026-06-30 발행주식 총수') },
    employees: ok(765, 'dart-sm-2025-ar'),
    overseasShare: { value: 35.9, basisText: '연결 매출 중 수출 비중', sourceId: 'dart-sm-2025-ar' },
    segments: [
      { originalName: '공연·영상 콘텐츠 제작 등', revenue: ok(502804, 'dart-sm-2025-ar') },
      { originalName: '음반/음원', revenue: ok(320638, 'dart-sm-2025-ar') },
      { originalName: '매니지먼트(출연료)', revenue: ok(277805, 'dart-sm-2025-ar') },
      { originalName: '광고대행', revenue: ok(59103, 'dart-sm-2025-ar') },
      { originalName: '여행 등 기타', revenue: ok(14586, 'dart-sm-2025-ar') },
    ],
    segmentNote: '사업보고서 주요 제품 및 서비스 분류입니다. 공연과 영상 콘텐츠가 한 항목으로 묶여 있어 공연 매출만 따로 볼 수 없습니다.',
    keyIp: ['KANGTA', 'BoA', 'TVXQ!', 'SUPER JUNIOR', "GIRLS' GENERATION", 'SHINee', 'EXO', 'Red Velvet', 'NCT 127', 'NCT DREAM', 'SuperM', 'WayV', 'aespa', 'GOT the beat', 'RIIZE', 'NCT WISH', 'Hearts2Hearts'].map(name => ({ name, sourceId: 'dart-sm-2025-ar', verifiedAt: CHECKED })),
    ipNote: '사업보고서 ‘회사의 개요’에 소속 아티스트로 기재된 순서입니다.',
    strengths: [
      { text: '2025년 영업이익 1,830억원으로 4개사 중 가장 많고, 전년(873억원)보다 두 배 이상 늘었습니다.', badge: '공식', sourceIds: ['dart-sm-2025-ar'] },
      { text: '사업보고서에 기재된 아티스트가 17팀(명)으로, 데뷔 연차가 다양한 IP를 운영합니다.', badge: '공식', sourceIds: ['dart-sm-2025-ar'] },
    ],
    risks: [
      { text: '순이익 3,594억원 중 2,140억원이 관계기업 관련 이익이라 순이익으로 수익성을 비교하면 과대평가될 수 있습니다.', badge: '공식', sourceIds: ['dart-sm-2025-ar'] },
      { text: '수출 매출 비중이 약 35.9%로 4개사 중 가장 낮아 국내 매출 의존도가 상대적으로 높습니다.', badge: '공식', sourceIds: ['dart-sm-2025-ar'] },
    ],
  },
  {
    id: 'jyp', nameKo: 'JYP엔터테인먼트', shortName: 'JYP', listedName: 'JYP Ent.', exchange: 'KOSDAQ', ticker: '035900',
    structure: 'hq-with-subsidiaries',
    structureText: '본사 안에 아티스트 단위 레이블 조직을 두고, 일본 법인(JYP Entertainment Japan)과 플랫폼·MD 자회사(블루개러지) 등을 연결합니다.',
    labels: [],
    annual: {
      fiscalYear: 2025, basis: 'consolidated',
      revenue: ok(821855, 'dart-jyp-2025-ar'), operatingIncome: ok(155246, 'dart-jyp-2025-ar'),
      netIncome: ok(160563, 'dart-jyp-2025-ar'), netIncomeOwners: ok(160562, 'dart-jyp-2025-ar'),
      totalAssets: ok(851090, 'dart-jyp-2025-ar'),
      prevRevenue: ok(601788, 'dart-jyp-2025-ar'), prevOperatingIncome: ok(128262, 'dart-jyp-2025-ar'),
      nonOperatingNote: null,
    },
    latestQuarter: {
      label: '2026 2Q', periodEnd: '2026-06-30', basis: 'consolidated',
      revenue: ok(183143, 'dart-jyp-2026-h1'), operatingIncome: ok(30998, 'dart-jyp-2026-h1'),
      prevYearRevenue: ok(215832, 'dart-jyp-2026-h1'), prevYearOperatingIncome: ok(52908, 'dart-jyp-2026-h1'),
      driverNote: null,
    },
    market: { asOf: MARKET_AS_OF, priceType: 'close', closePriceWon: ok(38550, 'price-close', '참고'), sharesOutstanding: ok(35532492, 'dart-jyp-2026-h1', '공식', '2026-06-30 발행주식 총수(자기주식 포함)') },
    employees: ok(496, 'dart-jyp-2025-ar'),
    overseasShare: { value: 57.2, basisText: '연결 매출 중 수출 비중', sourceId: 'dart-jyp-2025-ar' },
    segments: [
      { originalName: '초상권 외 기타(MD 등)', revenue: ok(294695, 'dart-jyp-2025-ar') },
      { originalName: '음반/음원', revenue: ok(257893, 'dart-jyp-2025-ar') },
      { originalName: '콘서트', revenue: ok(188892, 'dart-jyp-2025-ar') },
      { originalName: '광고', revenue: ok(45016, 'dart-jyp-2025-ar') },
      { originalName: '출연료', revenue: ok(35358, 'dart-jyp-2025-ar') },
    ],
    segmentNote: '사업보고서 매출 실적(연결) 분류입니다. ‘초상권 외’ 항목에 MD·IP 관련 매출이 포함됩니다.',
    keyIp: ['DAY6', 'TWICE', 'Stray Kids', 'ITZY', 'NiziU', 'Xdinary Heroes', 'NMIXX', 'GIRLSET', 'NEXZ', 'KickFlip'].map(name => ({ name, sourceId: 'dart-jyp-2025-ar', verifiedAt: CHECKED })),
    ipNote: '사업보고서 ‘사업의 개요’에 주요·신규 아티스트로 기재된 팀 가운데 국내외 그룹 활동 팀입니다.',
    strengths: [
      { text: '2025년 영업이익률 18.9%로 4개사 중 가장 높습니다.', badge: '공식', sourceIds: ['dart-jyp-2025-ar'] },
      { text: '2025년 말 차입금이 없다고 공시했고, 수출 매출 비중이 약 57.2%입니다.', badge: '공식', sourceIds: ['dart-jyp-2025-ar'] },
    ],
    risks: [
      { text: '2026년 2분기 영업이익이 310억원으로 전년 같은 분기(529억원)보다 줄었습니다.', badge: '공식', sourceIds: ['dart-jyp-2026-h1'] },
      { text: '2026년 상반기 누적 매출은 3,691억원으로 전년 동기(3,566억원)보다 늘었지만 영업이익은 644억원으로 전년 동기(725억원)보다 줄었습니다.', badge: '공식', sourceIds: ['dart-jyp-2026-h1'] },
    ],
  },
  {
    id: 'yg', nameKo: 'YG엔터테인먼트', shortName: 'YG', listedName: '와이지엔터테인먼트', exchange: 'KOSDAQ', ticker: '122870',
    structure: 'hq-with-subsidiaries',
    structureText: '본사가 아티스트 매니지먼트·공연을 맡고, 음원 유통·MD 자회사 와이지플러스와 해외 법인 등을 연결합니다.',
    labels: [],
    annual: {
      fiscalYear: 2025, basis: 'consolidated',
      revenue: ok(545404, 'dart-yg-2025-ar'), operatingIncome: ok(71342, 'dart-yg-2025-ar'),
      netIncome: ok(53745, 'dart-yg-2025-ar'), netIncomeOwners: ok(36900, 'dart-yg-2025-ar'),
      totalAssets: ok(838779, 'dart-yg-2025-ar'),
      prevRevenue: ok(364949, 'dart-yg-2025-ar'), prevOperatingIncome: ok(-20558, 'dart-yg-2025-ar'),
      nonOperatingNote: null,
    },
    latestQuarter: {
      label: '2026 2Q', periodEnd: '2026-06-30', basis: 'consolidated',
      revenue: ok(127760, 'dart-yg-2026-h1'), operatingIncome: ok(10968, 'dart-yg-2026-h1'),
      prevYearRevenue: ok(100411, 'dart-yg-2026-h1'), prevYearOperatingIncome: ok(8360, 'dart-yg-2026-h1'),
      driverNote: null,
    },
    market: { asOf: MARKET_AS_OF, priceType: 'close', closePriceWon: ok(41500, 'price-close', '참고'), sharesOutstanding: ok(18691049, 'dart-yg-2026-h1', '공식', '2026-06-30 발행주식 총수') },
    employees: ok(438, 'dart-yg-2025-ar'),
    overseasShare: { value: 56.9, basisText: '연결 매출 중 수출 비중', sourceId: 'dart-yg-2025-ar' },
    segments: [
      { originalName: '상·제품(앨범·음원·MD)', revenue: ok(201885, 'dart-yg-2025-ar') },
      { originalName: '공연', revenue: ok(126387, 'dart-yg-2025-ar') },
      { originalName: '기타 사업(광고·출연·로열티 등)', revenue: ok(129887, 'dart-yg-2025-ar') },
      { originalName: '음악서비스', revenue: ok(87247, 'dart-yg-2025-ar') },
    ],
    segmentNote: '사업보고서 주요 제품 및 서비스 분류입니다. 앨범·음원·MD가 ‘상·제품’ 한 항목으로 묶여 있습니다.',
    keyIp: ['블랙핑크', '베이비몬스터', '트레저', '악뮤', '위너', '션', '은지원'].map(name => ({ name, sourceId: 'dart-yg-2025-ar', verifiedAt: CHECKED })),
    ipNote: '사업보고서 ‘전속계약 현황’(2025-12-31 기준)에 기재된 가수입니다. 멤버 개인 활동 계약은 별도일 수 있습니다.',
    strengths: [
      { text: '2025년 영업이익 713억원으로 전년 영업손실(206억원)에서 흑자로 돌아섰고, 매출은 49.4% 늘었습니다.', badge: '공식', sourceIds: ['dart-yg-2025-ar'] },
      { text: '2025년 공연 매출이 1,264억원으로 전년(170억원)보다 크게 늘었습니다.', badge: '공식', sourceIds: ['dart-yg-2025-ar'] },
    ],
    risks: [
      { text: '영업이익이 2023년 869억원 → 2024년 손실 206억원 → 2025년 713억원으로, 대형 투어 유무에 따라 크게 출렁였습니다.', badge: '공식', sourceIds: ['dart-yg-2025-ar'] },
      { text: '전속계약 가수가 7팀(명)으로 4개사 중 가장 적어 소수 IP 활동의 영향이 큽니다.', badge: '공식', sourceIds: ['dart-yg-2025-ar'] },
    ],
  },
];

export const KB4_FANOMENON: FanomenonFact[] = [
  { id: 'launch', topic: 'schedule', kind: '확인된 사실', text: '정부와 대중문화교류위원회가 글로벌 K컬처 축제 ‘패노메논’을 2027년 12월 개최한다고 발표했습니다.', badge: '참고', sourceIds: ['news-launch-dd'], date: '2026-07-27' },
  { id: 'audit', topic: 'audit', kind: '확인된 사실', text: '박진영 대통령 직속 대중문화교류위원회 공동위원장이 국회 문화체육관광위원회 국정감사에 증인으로 출석했습니다.', badge: '참고', sourceIds: ['news-audit-fn', 'news-audit-ytn'], date: '2026-10-07' },
  { id: 'entity', topic: 'entity', kind: '확인된 사실', text: '하이브·SM·JYP·YG가 동일한 자본금과 의결권을 갖는 행사 전담 법인을 설립해 참여한다고 밝혀졌습니다.', badge: '참고', sourceIds: ['news-audit-dd', 'news-audit-yna'], date: '2026-10-07' },
  { id: 'venue', topic: 'venue', kind: '확인된 사실', text: '서울 창동 서울아레나에서 K팝 공연·팬덤 시상식을, 킨텍스에서 K컬처 기업 전시·체험을 여는 구성입니다.', badge: '참고', sourceIds: ['news-launch-dd', 'news-audit-dd'], date: '2026-07-27' },
  { id: 'government', topic: 'government', kind: '확인된 사실', text: '정부는 출입국·안전관리, 방한 관광, K컬처 중소기업 참여 확대 등을 지원한다고 발표했습니다.', badge: '참고', sourceIds: ['news-launch-dd'], date: '2026-07-27' },
  { id: 'effect', topic: 'economicEffect', kind: '확인된 사실', text: '한국문화관광연구원은 총방문객 52만명(외래 관광객 20만명), 경제효과 약 1조원을 전망했습니다. 실제 결과가 아닌 사전 전망치입니다.', badge: '추정', sourceIds: ['news-launch-dd'], date: '2026-07-27' },
  { id: 'trademark-issue', topic: 'trademark', kind: '제기된 문제', text: '국정감사에서 JYP가 ‘패노메논’ 상표를 먼저 출원한 것이 특혜 아니냐는 지적이 나왔습니다.', badge: '참고', sourceIds: ['news-audit-fn'], date: '2026-10-07' },
  { id: 'trademark-answer', topic: 'trademark', kind: '당사자 설명', text: '박진영 위원장은 발표 이후 제3자의 상표 선점을 우려해 먼저 출원했으며 JYP에 남는 것은 없다는 취지로 답했습니다.', badge: '참고', sourceIds: ['news-audit-fn', 'news-audit-dd'], date: '2026-10-07' },
  { id: 'favor-issue', topic: 'opportunityCost', kind: '제기된 문제', text: '4대 기획사 중심 구조가 특정 회사에 대한 특혜가 될 수 있다는 지적이 제기됐습니다.', badge: '참고', sourceIds: ['news-audit-ytn'], date: '2026-10-07' },
  { id: 'favor-answer', topic: 'opportunityCost', kind: '당사자 설명', text: '박진영 위원장은 소속 가수들이 각자 공연을 하면 2~3배를 벌 수 있어 오히려 수백억원대 기회손실이 생긴다는 취지로 설명했습니다. 이 금액은 검증된 수치가 아닌 당사자 주장입니다.', badge: '참고', sourceIds: ['news-audit-dd', 'news-audit-ytn'], date: '2026-10-07' },
  { id: 'minister', topic: 'government', kind: '정부 설명', text: '최휘영 문화체육관광부 장관은 4대 기획사가 이권을 노리고 들어온 것이 아니라는 취지로 답하며 사업 특수성을 고려해 달라고 했습니다.', badge: '참고', sourceIds: ['news-audit-fn'], date: '2026-10-07' },
  { id: 'small-agency', topic: 'smallAgencies', kind: '제기된 문제', text: '라인업이 한정돼 중소기획사 그룹이 배제될 수 있다는 업계 우려가 보도됐습니다. 박진영 위원장은 중소기획사를 배제하지 않겠다는 취지로 반박했습니다.', badge: '참고', sourceIds: ['news-industry-tf'], date: '2026-08-25' },
  { id: 'unknown-entity', topic: 'entity', kind: '미확인', text: '전담 법인의 이름·자본금 액수·설립일', badge: null, sourceIds: [], date: null },
  { id: 'unknown-lineup', topic: 'lineup', kind: '미확인', text: '출연 아티스트 라인업과 4대 기획사 대표 IP의 참여 범위', badge: null, sourceIds: [], date: null },
  { id: 'unknown-small', topic: 'smallAgencies', kind: '미확인', text: '중소기획사의 공식 참여 방식·쿼터', badge: null, sourceIds: [], date: null },
  { id: 'unknown-revenue', topic: 'revenueModel', kind: '미확인', text: '티켓·협찬 수익의 배분 방식과 상표권 귀속 변경 여부', badge: null, sourceIds: [], date: null },
  { id: 'unknown-schedule', topic: 'schedule', kind: '미확인', text: '정확한 개최 기간(보도마다 11일·2주로 다름)', badge: null, sourceIds: [], date: null },
];

export const KB4_RELATED = [
  { href: '/reports/korean-movie-break-even-profit/', label: '영화는 얼마나 벌어야 남을까 — 흥행 손익 비교' },
  { href: '/reports/kospi-large-cap-2026-q2-earnings/', label: '코스피 대형주 2분기 실적 2026 비교' },
  { href: '/reports/us-bigtech-q2-2026-earnings/', label: '실적과 주가 반응, 미국 빅테크 2분기 비교' },
  { href: '/reports/kpop-market-size-2026/', label: 'K팝 산업 전체 규모는 얼마나 클까 — 음악산업 매출·수출' },
];

export const KB4_CHANGELOG = [
  { date: '2026-10-08', text: '최초 공개. 2025 사업보고서·2026 반기보고서(DART) 실적, 2026-10-07 종가 기준 시가총액 반영.' },
];
