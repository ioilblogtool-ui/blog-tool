// K팝 시장 규모 2026 리포트 데이터 — 설계: docs/design/202610/kpop-market-size-2026-design.md
// 값은 원자료 단위를 그대로 저장하고, 표시·환산·비율은 src/utils/kpopMarketSize2026.ts에서만 계산한다.

export type Badge = "공식" | "참고" | "시뮬레이션" | "추정";
export type StatStatus = "확정" | "잠정" | "재확인 필요";
export type Scope =
  | "content-industry"
  | "music-industry"
  | "pop-culture-industry"
  | "agency"
  | "album-export"
  | "global-recorded"
  | "hallyu";
// baekeok = 백억원(콘텐츠산업조사 원표), eok = 억원, usd-* = 달러, million-accounts = 백만 계정
export type Unit = "baekeok" | "eok" | "usd-million" | "usd-thousand" | "usd-billion" | "count" | "person" | "pct" | "million-accounts" | "rank";

export type Source = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedAt: string;
  checkedAt: string;
  locator: string;
  isPrimary: boolean;
  limitation: string | null;
};

export type MarketStat = {
  id: string;
  metricName: string;
  value: number | null;
  unit: Unit;
  year: number;
  scope: Scope;
  scopeLabel: string;
  status: StatStatus;
  badge: Badge | null;
  sourceId: string | null;
  includes: string;
  excludes: string;
  notes?: string;
  missingReason?: string;
};

export type SeriesId = "music-sales" | "music-export" | "content-sales" | "content-export";
export type Series = {
  id: SeriesId;
  label: string;
  unit: "baekeok" | "usd-million";
  scope: Scope;
  sourceId: string;
  points: { year: number; value: number }[];
  provisional?: { year: 2025; growthPct: number; sourceId: string };
  breakNote?: string;
};

export type FxRate = { year: number; krwPerUsd: number | null; basis: "연평균 매매기준율"; sourceId: string | null; checkedAt: string | null };

export type RevenueChannel = {
  key: "album" | "streaming" | "concert" | "fanmeeting" | "md" | "ads" | "ip" | "platform" | "video" | "royalty";
  label: string;
  description: string;
  example?: { text: string; badge: "참고"; sourceId: string };
};

export type EconomicEffect = {
  id: string;
  group: "per-100m" | "annual-2025";
  label: string;
  value: number;
  unit: "eok" | "usd-billion" | "usd-hundred-million" | "person" | "jo";
  scopeLabel: "한류 전체";
  badge: Badge;
  sourceId: string;
  note: string;
};

export type FaqTemplate = { question: string; answer: string };

export const KMS_META = {
  slug: "kpop-market-size-2026",
  h1: "K팝 시장 규모 2026, 실제로 얼마나 클까?",
  seoTitle: "K팝 시장 규모 2026 | 매출·수출 얼마나 클까",
  // 숫자 토큰은 유틸에서 데이터 값으로 치환한다.
  seoDescription: "K팝 시장 규모를 국내 음악산업 매출 {{musicSalesShort}}, 음악 수출 {{musicExportShort}}, 기획업 해외매출, 세계 음악시장 {{globalRecorded}}로 나눠 비교하고 통계마다 숫자가 다른 이유를 정리합니다.",
  heroDescription: "K팝 시장 규모는 조사 범위에 따라 숫자가 달라집니다. 음악산업·기획업·수출·세계시장을 범위별로 나눠 확인하세요.",
  ogImage: "/og/reports/kpop-market-size-2026.png",
  updatedAt: "2026-10-08",
  publishedAt: null as string | null,
  // 4-3 공개 게이트(설계 문서 참고). 4대 기획사 리포트 연동·related 3개 충족
  publishReady: true,
};

// 4사 연결매출은 4대 기획사 리포트 데이터(src/data/kpopBig4AgencyComparison2026.ts, DART 확인값)를 단일 출처로 쓴다.
// 페이지에서 import해 유틸에 넘기며, 이 파일에는 숫자를 다시 적지 않는다.
export const KMS_BIG4_ENABLED = true;

export const KMS_SOURCES: Source[] = [
  { id: "mcst-content-survey-2024", publisher: "문화체육관광부", title: "콘텐츠산업, 매출 157조 원, 수출 141억 달러로 성장세 유지 — 2025년 콘텐츠산업조사(2024년 기준)", url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156746399", publishedAt: "2026-02-27", checkedAt: "2026-10-08", locator: "보도자료 붙임 ‘2025년 콘텐츠산업조사 주요 내용’ 매출액·수출액·사업체·종사자 표", isPrimary: true, limitation: "음악 매출은 원표 단위(백억 원)까지만 공개" },
  { id: "kocca-trend-2025", publisher: "한국콘텐츠진흥원", title: "2025년 4분기 및 연간 콘텐츠산업 동향분석 보고서", url: "https://www.newsis.com/view/NISX20260430_0003612521", publishedAt: "2026-04-30", checkedAt: "2026-10-08", locator: "보도 본문(장르별 증감률)", isPrimary: false, limitation: "언론 보도로 확인. 장르별 절대금액은 보도에 없어 성장률만 사용" },
  { id: "kocca-popculture-2025", publisher: "한국콘텐츠진흥원·문화체육관광부", title: "2025 대중문화예술산업 실태조사(2024년 기준)", url: "https://www.mt.co.kr/culture/2026/01/23/2026012315264616629", publishedAt: "2026-01-23", checkedAt: "2026-10-08", locator: "보도 본문", isPrimary: false, limitation: "복수 언론 보도로 수치 일치 확인. 보고서 원문 미열람" },
  { id: "ifpi-gmr-2026", publisher: "IFPI", title: "Global Music Report 2026: Global recorded music revenues grow 6.4%", url: "https://www.ifpi.org/global-music-report-2026-global-recorded-music-revenues-grow-6-4-as-record-companies-drive-innovation/", publishedAt: "2026-03-18", checkedAt: "2026-10-08", locator: "보도자료 본문", isPrimary: true, limitation: null },
  { id: "mbw-ifpi-top10-2026", publisher: "Music Business Worldwide", title: "IFPI’s Global Music Report 2026: 10 quick (and crucial) takeaways", url: "https://www.musicbusinessworldwide.com/10-quick-and-crucial-takeaways-from-ifpis-global-music-report-2026/", publishedAt: "2026-03-18", checkedAt: "2026-10-08", locator: "Top 10 시장 목록", isPrimary: false, limitation: "IFPI 원문 순위표 대신 업계 매체 인용" },
  { id: "kcs-album-export-2025", publisher: "관세청 수출입무역통계(언론 인용)", title: "2025년 음반 수출 사상 최대", url: "https://www.imaeil.com/page/view/2026011617184107588", publishedAt: "2026-01-16", checkedAt: "2026-10-08", locator: "보도 본문", isPrimary: false, limitation: "관세청 원자료 미대조, 물품(실물 음반) 수출만 집계" },
  { id: "kocca-hallyu-export-effect-2026", publisher: "한국콘텐츠진흥원", title: "한류산업 수출의 경제 효과", url: "https://www.newspim.com/news/view/20260709000171", publishedAt: "2026-07-09", checkedAt: "2026-10-08", locator: "보도 본문", isPrimary: false, limitation: "2006~2024 자료 기반 산업연관 분석. 게임·방송 등 한류 전체 기준" },
  { id: "kofice-hallyu-effect-2025", publisher: "한국국제문화교류진흥원", title: "2025 한류의 경제적 파급효과 연구", url: "https://www.etoday.co.kr/news/view/2600969", publishedAt: "2026-07-07", checkedAt: "2026-10-08", locator: "보도 본문", isPrimary: false, limitation: "언론 보도로 확인. 문화콘텐츠·소비재·관광을 합한 한류 전체 기준" },
  { id: "hybe-2025-results", publisher: "SPOTV NEWS(하이브 공시 인용)", title: "하이브, 2025년 2조 6498억 역대 최고 매출", url: "https://www.spotvnews.co.kr/news/articleView.html?idxno=798317", publishedAt: "2026-02-12", checkedAt: "2026-10-08", locator: "공연 부문 매출", isPrimary: false, limitation: "개별 기업 사례. 산업 전체 수익 구조를 대표하지 않음" },
  { id: "ecos-fx", publisher: "한국은행 경제통계시스템(ECOS)", title: "주요국 통화의 대원화환율 — 원/미국달러(매매기준율) 연평균", url: "https://ecos.bok.or.kr/", publishedAt: "2026-01-02", checkedAt: "2026-10-08", locator: "통계표 731Y004, 항목 0000001 평균자료", isPrimary: true, limitation: null },
];

export const KMS_STATS: MarketStat[] = [
  { id: "content-sales-2024", metricName: "콘텐츠산업 매출", value: 1574021, unit: "eok", year: 2024, scope: "content-industry", scopeLabel: "콘텐츠산업 11개 장르", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "출판·만화·음악·영화·게임·애니메이션·방송·광고·캐릭터·지식정보·콘텐츠솔루션", excludes: "K팝만 따로 본 규모가 아님" },
  { id: "content-export-2024", metricName: "콘텐츠산업 수출", value: 14075.43, unit: "usd-million", year: 2024, scope: "content-industry", scopeLabel: "콘텐츠산업 11개 장르", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "11개 장르 사업체 수출(게임이 60.4%)", excludes: "소비재·관광 등 연관 수출" },
  { id: "music-sales-2024", metricName: "국내 음악산업 매출", value: 1327, unit: "baekeok", year: 2024, scope: "music-industry", scopeLabel: "음악산업", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "음악 제작·유통·공연·온라인 음악·노래연습장 등 음악산업 사업체 매출", excludes: "드라마·게임, 배우·방송인 매니지먼트, 해외 법인 매출" },
  { id: "music-export-2024", metricName: "음악산업 수출", value: 1801.45, unit: "usd-million", year: 2024, scope: "music-industry", scopeLabel: "음악산업", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "음악산업 사업체가 해외에서 올린 매출(음원·음반·공연 등)", excludes: "소비재·관광 등 한류 연관 효과" },
  { id: "music-biz-2024", metricName: "음악산업 사업체 수", value: 37082, unit: "count", year: 2024, scope: "music-industry", scopeLabel: "음악산업", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "음악산업 특수분류 사업체", excludes: "-" },
  { id: "music-workers-2024", metricName: "음악산업 종사자", value: 73677, unit: "person", year: 2024, scope: "music-industry", scopeLabel: "음악산업", status: "확정", badge: "공식", sourceId: "mcst-content-survey-2024", includes: "음악산업 사업체 종사자", excludes: "-" },
  { id: "music-sales-2025", metricName: "음악산업 매출(2025)", value: null, unit: "baekeok", year: 2025, scope: "music-industry", scopeLabel: "음악산업", status: "재확인 필요", badge: null, sourceId: null, includes: "-", excludes: "-", missingReason: "2025년은 동향분석 성장률(+15.8%)만 공개. 확정 금액은 2026년 콘텐츠산업조사(2025년 기준) 발표 후 반영" },
  { id: "popculture-sales-2024", metricName: "대중문화예술산업 매출", value: 153845, unit: "eok", year: 2024, scope: "pop-culture-industry", scopeLabel: "대중문화예술산업", status: "확정", badge: "참고", sourceId: "kocca-popculture-2025", includes: "대중문화예술기획업(연예기획사)과 제작업 매출 — 가수·배우·방송인 포함", excludes: "음악 유통·플랫폼 전체, 콘텐츠산업 전체" },
  { id: "agency-domestic-2024", metricName: "기획업 국내 매출", value: 78020, unit: "eok", year: 2024, scope: "agency", scopeLabel: "대중문화예술기획업", status: "확정", badge: "참고", sourceId: "kocca-popculture-2025", includes: "등록 연예기획사의 국내 매출", excludes: "제작업, 음악시장 전체" },
  { id: "agency-overseas-2024", metricName: "기획업 해외 매출", value: 17057, unit: "eok", year: 2024, scope: "agency", scopeLabel: "대중문화예술기획업", status: "확정", badge: "참고", sourceId: "kocca-popculture-2025", includes: "등록 연예기획사의 해외 매출(2022년 대비 +61.7%)", excludes: "기획사 외 음악 사업체의 수출" },
  { id: "album-export-2025", metricName: "음반 수출", value: 301744, unit: "usd-thousand", year: 2025, scope: "album-export", scopeLabel: "실물 음반 수출", status: "확정", badge: "참고", sourceId: "kcs-album-export-2025", includes: "CD 등 실물 음반의 통관 수출(전년 대비 +3.4%)", excludes: "스트리밍·공연·MD" },
  { id: "global-recorded-2025", metricName: "세계 녹음음악 시장 매출", value: 31.7, unit: "usd-billion", year: 2025, scope: "global-recorded", scopeLabel: "IFPI 녹음음악", status: "확정", badge: "공식", sourceId: "ifpi-gmr-2026", includes: "전 세계 스트리밍·실물 음반·실연권·싱크 등 녹음음악 매출", excludes: "공연·MD·팬 플랫폼" },
  { id: "global-growth-2025", metricName: "세계 녹음음악 시장 성장률", value: 6.4, unit: "pct", year: 2025, scope: "global-recorded", scopeLabel: "IFPI 녹음음악", status: "확정", badge: "공식", sourceId: "ifpi-gmr-2026", includes: "11년 연속 성장, 아시아 +10.9%", excludes: "-" },
  { id: "global-streaming-share-2025", metricName: "스트리밍 매출 비중", value: 69.6, unit: "pct", year: 2025, scope: "global-recorded", scopeLabel: "IFPI 녹음음악", status: "확정", badge: "공식", sourceId: "ifpi-gmr-2026", includes: "유료 구독 52.4% + 광고 기반 스트리밍", excludes: "-" },
  { id: "global-paid-subs-2025", metricName: "유료 스트리밍 계정", value: 837, unit: "million-accounts", year: 2025, scope: "global-recorded", scopeLabel: "IFPI 녹음음악", status: "확정", badge: "공식", sourceId: "ifpi-gmr-2026", includes: "전 세계 유료 구독 계정 사용자", excludes: "-" },
  { id: "korea-rank-2025", metricName: "한국 녹음음악 시장 순위", value: 7, unit: "rank", year: 2025, scope: "global-recorded", scopeLabel: "IFPI 녹음음악", status: "확정", badge: "참고", sourceId: "mbw-ifpi-top10-2026", includes: "한국 안에서 소비된 녹음음악 매출 순위", excludes: "K팝의 해외 매출(수출)" },
];

// 같은 발표(2026-02-27 문체부 보도자료 붙임)의 한 표에서만 가져온 시계열
export const KMS_SERIES: Series[] = [
  { id: "music-sales", label: "국내 음악산업 매출", unit: "baekeok", scope: "music-industry", sourceId: "mcst-content-survey-2024", points: [{ year: 2019, value: 681 }, { year: 2020, value: 606 }, { year: 2021, value: 937 }, { year: 2022, value: 1101 }, { year: 2023, value: 1263 }, { year: 2024, value: 1327 }], provisional: { year: 2025, growthPct: 15.8, sourceId: "kocca-trend-2025" }, breakNote: "2021년 증가 폭에 코로나19 이후 회복 외에 조사 범위 변화가 포함됐는지는 공개 자료로 확인되지 않았습니다." },
  { id: "music-export", label: "음악산업 수출", unit: "usd-million", scope: "music-industry", sourceId: "mcst-content-survey-2024", points: [{ year: 2019, value: 756.2 }, { year: 2020, value: 679.6 }, { year: 2021, value: 775.3 }, { year: 2022, value: 927.6 }, { year: 2023, value: 1222.5 }, { year: 2024, value: 1801.4 }], provisional: { year: 2025, growthPct: 32.4, sourceId: "kocca-trend-2025" } },
  { id: "content-sales", label: "콘텐츠산업 매출", unit: "baekeok", scope: "content-industry", sourceId: "mcst-content-survey-2024", points: [{ year: 2019, value: 12671 }, { year: 2020, value: 12828 }, { year: 2021, value: 13751 }, { year: 2022, value: 15108 }, { year: 2023, value: 15418 }, { year: 2024, value: 15740 }] },
  { id: "content-export", label: "콘텐츠산업 수출", unit: "usd-million", scope: "content-industry", sourceId: "mcst-content-survey-2024", points: [{ year: 2019, value: 10253.9 }, { year: 2020, value: 11924.3 }, { year: 2021, value: 12452.9 }, { year: 2022, value: 13243.0 }, { year: 2023, value: 13345.3 }, { year: 2024, value: 14075.4 }] },
];

export const KMS_FX: FxRate[] = [
  { year: 2024, krwPerUsd: 1363.98, basis: "연평균 매매기준율", sourceId: "ecos-fx", checkedAt: "2026-10-08" },
  { year: 2025, krwPerUsd: 1422.22, basis: "연평균 매매기준율", sourceId: "ecos-fx", checkedAt: "2026-10-08" },
];

export const KMS_KPI_IDS = ["music-sales-2024", "music-export-2024", "popculture-sales-2024", "global-recorded-2025"] as const;
export const KMS_SCOPE_ROW_IDS = ["content-sales-2024", "music-sales-2024", "popculture-sales-2024", "agency-domestic-2024", "agency-overseas-2024", "music-export-2024", "album-export-2025", "global-recorded-2025"] as const;
export const KMS_OVERSEAS_IDS = ["music-export-2024", "agency-overseas-2024", "album-export-2025"] as const;
export const KMS_GLOBAL_IDS = ["global-recorded-2025", "global-growth-2025", "global-streaming-share-2025", "global-paid-subs-2025"] as const;

export const KMS_CHANNELS: RevenueChannel[] = [
  { key: "album", label: "음반", description: "실물 앨범 판매입니다. 팬 사인회 응모·포토카드 등 수집 수요가 크지만, 2025년 음반 수출 증가율은 3.4%로 음악산업 수출 증가율보다 낮았습니다." },
  { key: "streaming", label: "음원·스트리밍", description: "국내 음원 플랫폼과 해외 스트리밍 서비스에서 재생 수에 따라 정산받는 매출입니다. 세계 녹음음악 매출의 약 70%가 스트리밍입니다." },
  { key: "concert", label: "콘서트·월드투어", description: "티켓 매출과 현장 MD가 함께 발생합니다. 해외 공연 확대는 2025년 음악 수출 성장의 주요 배경으로 꼽혔습니다.", example: { text: "하이브 공연 매출 2025년 7,639억원(+69.4%)", badge: "참고", sourceId: "hybe-2025-results" } },
  { key: "fanmeeting", label: "팬미팅·팬 이벤트", description: "공연보다 작은 규모로 자주 열리며, 팬덤 규모가 곧 매출로 이어지는 구조입니다." },
  { key: "md", label: "MD·굿즈", description: "응원봉·의류·캐릭터 상품 등 아티스트 IP를 활용한 상품 판매입니다. 공연·온라인 판매와 함께 커집니다." },
  { key: "ads", label: "광고·출연", description: "아티스트의 광고 모델·방송·행사 출연료입니다. 브랜드 인지도와 화제성에 따라 편차가 큽니다." },
  { key: "ip", label: "IP·라이선스", description: "캐릭터·게임·애니메이션 등 다른 사업자에게 아티스트·음악 IP 사용권을 주고 받는 수입입니다." },
  { key: "platform", label: "팬 플랫폼·멤버십", description: "팬 커뮤니티 앱, 유료 멤버십, 메시지 구독 서비스 등 기획사가 직접 운영하는 디지털 매출입니다." },
  { key: "video", label: "영상 콘텐츠", description: "자체 예능·다큐·공연 실황 영상의 판매·스트리밍 매출과 유튜브 광고 수익입니다." },
  { key: "royalty", label: "해외 로열티", description: "해외에서 음악이 사용될 때 받는 저작권·저작인접권 사용료입니다. 공연·방송·리메이크 사용 등이 포함됩니다." },
];

export const KMS_EFFECTS: EconomicEffect[] = [
  { id: "per100m-production", group: "per-100m", label: "국내 생산유발효과", value: 7824, unit: "eok", scopeLabel: "한류 전체", badge: "참고", sourceId: "kocca-hallyu-export-effect-2026", note: "한류산업 수출 1억 달러 증가 시. 콘텐츠 2,341억원 + 연관산업 5,483억원" },
  { id: "per100m-related-export", group: "per-100m", label: "연관 소비재 수출 증가", value: 2.02, unit: "usd-hundred-million", scopeLabel: "한류 전체", badge: "참고", sourceId: "kocca-hallyu-export-effect-2026", note: "한류산업 수출 1억 달러 증가 시 화장품·식품 등 연관산업 수출" },
  { id: "per100m-jobs", group: "per-100m", label: "취업유발효과", value: 3389, unit: "person", scopeLabel: "한류 전체", badge: "참고", sourceId: "kocca-hallyu-export-effect-2026", note: "한류산업 수출 1억 달러 증가 시" },
  { id: "annual-total-export", group: "annual-2025", label: "한류 유발 총수출", value: 189.76, unit: "usd-hundred-million", scopeLabel: "한류 전체", badge: "참고", sourceId: "kofice-hallyu-effect-2025", note: "2025년. 문화콘텐츠 101억 8,800만 달러 + 소비재·관광 87억 8,800만 달러(전년 대비 +15.9%)" },
  { id: "annual-production", group: "annual-2025", label: "한류 생산유발효과", value: 48.28, unit: "jo", scopeLabel: "한류 전체", badge: "참고", sourceId: "kofice-hallyu-effect-2025", note: "2025년. 취업유발효과 24만 2,370명" },
];

export const KMS_SEO_INTRO = [
  "K팝은 세계 무대에서 꾸준히 흥행하고 있지만 ‘K팝 시장이 몇 조원인가’라는 질문에 답하는 공식 단일 통계는 없습니다. 정부 통계는 ‘K팝’이라는 장르 단위가 아니라 콘텐츠산업, 음악산업, 대중문화예술산업처럼 업종 단위로 집계하기 때문입니다. 그래서 어떤 범위를 기준으로 삼느냐에 따라 같은 해의 시장 규모도 수 배씩 다르게 보이며, 이 리포트는 그 범위를 먼저 구분합니다.",
  "국내 음악산업 매출은 2024년 {{musicSales2024}}이고, 가수뿐 아니라 배우·방송인 기획사와 제작사를 함께 보는 대중문화예술산업은 {{popculture2024}}입니다. 연예기획업만 따로 보면 국내 매출 {{agencyDomestic2024}}, 해외 매출 {{agencyOverseas2024}}입니다. 각 숫자가 무엇을 포함하고 무엇을 빠뜨리는지 비교표로 정리해, 서로 다른 통계를 하나의 ‘K팝 시장’ 숫자로 더하지 않도록 안내합니다.",
  "K팝의 성장은 국내 매출보다 해외 매출에서 더 뚜렷합니다. 음악산업 수출은 2019년부터 2024년까지 약 {{exportMultiple}}배로 늘어 {{musicExport2024}}에 이르렀고, 같은 기간 매출은 약 {{salesMultiple}}배가 됐습니다. 세계 녹음음악 시장은 2025년 {{globalRecorded}} 규모입니다. 다만 세계 시장 통계는 공연과 MD를 빼고 국가별 소비 기준으로 집계해 K팝의 세계 점유율을 단순 계산하기 어렵습니다.",
  "국내 확정 통계는 2024년 기준이고, 2025년은 연간 동향분석의 잠정 성장률만 공개됐습니다. 통계마다 기준연도, 조사 방식, 통화가 다르고, 달러를 원화로 바꾼 값은 해당 연도 한국은행 연평균 환율을 적용한 참고용 시뮬레이션입니다. 2025년 기준 콘텐츠산업조사, 대중문화예술산업 실태조사, IFPI 보고서가 새로 나오면 같은 기준으로 숫자를 갱신합니다.",
];

export const KMS_CRITERIA = [
  "국내 매출·수출은 문화체육관광부 콘텐츠산업조사(2024년 기준) 확정 통계입니다. 2025년은 한국콘텐츠진흥원 연간 동향분석의 잠정 성장률만 따로 표시합니다.",
  "대중문화예술산업·기획업 수치는 대중문화예술산업 실태조사(2024년 기준, 격년 조사)이며 가수 외 배우·방송인 기획도 포함합니다.",
  "세계 시장은 IFPI 녹음음악(공연·MD 제외) 기준입니다. K팝의 세계 점유율은 공식 통계가 없어 계산하지 않습니다.",
  "원화 환산은 해당 통계 연도의 한국은행 원/달러 연평균 매매기준율을 적용한 시뮬레이션입니다. 범위가 다른 통계는 서로 더하지 않습니다.",
];

export const KMS_FAQ: FaqTemplate[] = [
  { question: "K팝 시장 규모는 몇 조원인가요?", answer: "‘K팝 시장’만 따로 집계한 공식 통계는 없습니다. 정의가 가장 명확한 국내 음악산업 매출은 2024년 {{musicSales2024}}이며, 배우·방송인 기획까지 포함한 대중문화예술산업은 {{popculture2024}}입니다." },
  { question: "한국 음악산업 매출은 얼마나 되나요?", answer: "문화체육관광부 콘텐츠산업조사 기준 2024년 음악산업 매출은 {{musicSales2024}}으로 전년보다 5.1% 늘었습니다. 2025년은 잠정 동향 기준 15.8% 성장해 콘텐츠 장르 중 가장 높은 증가율을 기록했습니다." },
  { question: "K팝 수출액은 얼마인가요?", answer: "음악산업 수출은 2024년 {{musicExport2024}}로 1년 새 47.4% 늘었습니다. 실물 음반 수출만 보면 2025년 {{albumExport2025}}이며, 두 숫자는 집계 범위가 달라 더하면 안 됩니다." },
  { question: "K팝은 세계 음악시장에서 어느 정도 규모인가요?", answer: "IFPI 기준 2025년 세계 녹음음악 시장은 {{globalRecorded}}이고, 한국 시장은 업계 매체 인용 기준 세계 7위입니다. 이 순위는 한국 안의 음악 소비 규모이며 공연·MD와 해외 수출은 반영되지 않아, K팝의 세계 점유율을 공식적으로 계산한 값은 없습니다." },
  { question: "HYBE·SM·JYP·YG 매출을 합치면 얼마인가요?", answer: "{{big4FaqAnswer}}" },
  { question: "K팝은 음반과 공연 중 어디서 더 많이 버나요?", answer: "산업 전체의 수익원별 공식 분리 통계는 없습니다. 다만 2025년 음반 수출은 3.4% 늘어난 반면 음악산업 수출은 32.4% 늘어, 공연·디지털 등 음반 외 수익의 비중이 커지는 흐름으로 해석됩니다." },
  { question: "K팝 시장 규모 자료마다 숫자가 다른 이유는 무엇인가요?", answer: "콘텐츠산업·음악산업·대중문화예술산업·기획업·음반 수출이 각각 다른 범위를 집계하기 때문입니다. 기준연도와 통화(원·달러)도 서로 달라 같은 표에 놓을 때는 범위를 함께 봐야 합니다." },
  { question: "K팝 산업은 매년 얼마나 성장하고 있나요?", answer: "음악산업 매출은 2019년 {{musicSales2019}}에서 2024년 {{musicSales2024}}으로 약 {{salesMultiple}}배가 됐습니다. 같은 기간 수출은 약 {{exportMultiple}}배로 매출보다 빠르게 늘었습니다." },
  { question: "K팝이 한국 경제에 미치는 효과는 얼마나 되나요?", answer: "한국콘텐츠진흥원 연구에 따르면 한류산업 수출이 1억 달러 늘면 국내 생산유발효과는 약 7,824억원, 연관 소비재 수출은 약 2.02억 달러입니다. 이 수치는 게임·드라마 등을 포함한 한류 전체 기준이며 K팝 단독 효과는 아닙니다." },
];

export const KMS_BIG4_FAQ_FALLBACK = "4대 기획사 연결매출 합계는 각 사 사업보고서 대조를 마친 뒤 이 페이지에 반영합니다. 연결매출에는 해외 자회사와 비음악 사업 매출도 포함되므로, 합계가 나오더라도 국내 음악산업 매출과의 단순 규모 비교로만 볼 수 있고 시장점유율로 해석할 수는 없습니다.";

export const KMS_BIG4_FAQ_TEMPLATE = "각 사 사업보고서 기준 2025년 4대 기획사 연결매출 합계는 {{big4Total2025}}입니다. 같은 해 비교가 가능한 2024년 합계({{big4Total2024}})는 국내 음악산업 매출의 약 {{big4Ratio2024}}% 규모지만, 연결매출에는 해외 자회사·비음악 사업이 포함돼 시장점유율이 아니라 단순 규모 비교로만 볼 수 있습니다.";

export const KMS_RELATED = [
  { href: "/reports/kpop-big4-agency-comparison-2026/", label: "HYBE·SM·JYP·YG 4대 기획사 시총·실적 비교" },
  { href: "/reports/korean-movie-break-even-profit/", label: "영화는 얼마나 벌어야 남을까 — 흥행 손익 비교" },
  { href: "/reports/kospi-large-cap-2026-q2-earnings/", label: "코스피 대형주 2분기 실적도 비교해 보기" },
];

export const KMS_UPDATE_LOG = [{ date: "2026-10-08", text: "2024년 확정 통계·2025년 잠정 성장률·IFPI 2025 기준으로 작성" }];
