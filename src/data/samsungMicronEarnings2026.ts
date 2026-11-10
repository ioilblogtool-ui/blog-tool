export type CompanyId = "samsung" | "micron" | "skhynix";
export type Badge = "공식" | "참고" | "시뮬레이션" | "추정";
export type MetricKey = "revenue" | "operatingProfit" | "netIncome";
export type Metric =
  | { status: "available"; value: number; badge: Badge; sourceId: string }
  | { status: "unpublished"; value: null; badge: null; sourceId: null; reason: string };
export type Source = { id: string; title: string; url: string; publisher: string; publishedAt: string | null; checkedAt: string; locator: string };
export type Company = { id: CompanyId; name: string; businessSummary: string; availability: "available" | "pending" };
export type QuarterRecord = {
  recordId: string; revision: number; companyId: CompanyId; fiscalYear: number; fiscalQuarter: 1 | 2 | 3 | 4;
  periodLabel: string; periodStart: string; periodEnd: string;
  periodStartMethod: "published" | "day-after-previous-end"; previousPeriodEnd: string | null; periodSourceIds: string[]; weeks: number | null;
  currency: "KRW" | "USD"; unit: "trillion" | "million"; scope: "consolidated" | "DS" | "memory";
  basis: "K-IFRS" | "US-GAAP" | "non-GAAP"; releaseStatus: "preliminary" | "reported";
  auditStatus: "unaudited" | "reviewed" | "audited" | "unknown"; releasedAt: string | null; checkedAt: string;
  revenue: Metric; operatingProfit: Metric; netIncome: Metric; reportedMargin: Metric;
  officialGrowth: Partial<Record<"revenueYoy" | "revenueQoq" | "opYoy" | "opQoq", Metric>>;
  previousQuarterId: string | null; previousYearQuarterId: string | null;
};
export type Snapshot = { id: string; updatedAt: string; recordIds: string[]; segmentRecordIds: string[]; note: string };
export type EvidenceItem = { companyId: CompanyId; title: string; text: string; badge: Badge | null; sourceIds: string[]; appliesToRecordIds: string[] };
export type ProductUpdate = { companyId: CompanyId; generation: "HBM3E" | "HBM4" | "HBM4E"; stage: string; announcedAt: string | null; text: string; sourceIds: string[] };
export type Guidance = { companyId: CompanyId; periodLabel: string; basis: "US-GAAP"; announcedAt: string; sourceId: string; lines: string[] };
export type ReportData = {
  SME_META: typeof SME_META; SME_COMPANIES: Company[]; SME_SOURCES: Source[]; SME_RECORDS: QuarterRecord[];
  SME_SNAPSHOTS: Snapshot[]; SME_ACTIVE_SNAPSHOT_ID: string; SME_EVIDENCE: EvidenceItem[];
  SME_PRODUCT_UPDATES: ProductUpdate[]; SME_GUIDANCE: Guidance[];
};

export const SME_META = {
  slug: "samsung-micron-earnings-2026",
  // 리포트 목록(reports.ts)이 이 값을 쓰므로 활성 3사 스냅샷 기준으로 둔다. 2사 스냅샷 화면에서는 buildReportView가 updatedAt만 덮어쓴다.
  title: "삼성전자·SK하이닉스·마이크론 실적 비교 2026",
  seoTitle: "삼성전자·SK하이닉스·마이크론 실적 비교 2026 | 매출·영업이익률",
  seoDescription: "삼성전자·SK하이닉스·마이크론의 연결실적과 영업이익률을 비교하고 삼성 DS를 별도 표로 확인합니다. 각 사 실적 기간·회계 기준·사업 범위 차이를 함께 안내합니다.",
  description: "삼성·SK하이닉스 2026년 3분기와 마이크론 최신 공시 분기를 비교합니다. 회계기간과 사업 범위는 서로 다릅니다.",
  updatedAt: "2026-11-10", publishedAt: null as string | null,
  ogImage: "/og/reports/samsung-micron-earnings-2026.png",
};
export const SME_COMPANIES: Company[] = [
  { id: "samsung", name: "삼성전자", availability: "available", businessSummary: "메모리·파운드리·모바일·가전·디스플레이 등 여러 사업을 포함하는 종합전자회사입니다." },
  { id: "skhynix", name: "SK하이닉스", availability: "available", businessSummary: "DRAM·HBM·NAND 등 메모리 중심 기업입니다. 연결실적에 비메모리 사업 비중이 작아 삼성전자 전체 연결실적과 범위가 다릅니다." },
  { id: "micron", name: "마이크론", availability: "available", businessSummary: "DRAM·NAND 등 메모리와 저장장치 중심 기업입니다. 삼성전자 전체 연결실적과 사업 범위가 다릅니다." },
];
const checkedAt = "2026-10-08";
const source = (id: string, title: string, url: string, publisher: string, publishedAt: string | null, locator: string): Source => ({ id, title, url, publisher, publishedAt, checkedAt, locator });
export const SME_SOURCES: Source[] = [
  source("samsung-kr", "삼성전자 2026년 3분기 잠정실적", "https://news.samsung.com/kr/삼성전자-2026년-3분기-잠정실적-발표", "삼성전자 뉴스룸", "2026-10-08", "연결 잠정치·공식 증감률"),
  source("samsung-global", "삼성전자 현재·비교 분기 연결실적", "https://news.samsung.com/global/samsung-electronics-announces-earnings-guidance-for-third-quarter-2026", "삼성전자 뉴스룸", "2026-10-08", "K-IFRS 표, 조 원"),
  source("micron-q4", "마이크론 FY2026 4분기 실적", "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx", "마이크론 IR", "2026-09-30", "GAAP 분기 재무표·다음 분기 전망, 백만 달러"),
  source("micron-q3", "마이크론 FY2026 3분기 실적", "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx", "마이크론 IR", "2026-06-24", "분기 종료일·직전 분기 종료일"),
  source("micron-2025-q4", "마이크론 FY2025 4분기 실적", "https://investors.micron.com/news/press-release/2025/Micron-Technology-Inc--Reports-Results-for-the-Fourth-Quarter-and-Full-Year-of-Fiscal-2025-09-23-2025/default.aspx", "마이크론 IR", "2025-09-23", "분기 종료일·직전 분기 종료일"),
  source("micron-remarks", "마이크론 FY2026 4분기 컨콜 준비자료", "https://s25.q4cdn.com/621799436/files/doc_financials/2026/q4/Q4-FY26-Prepared-Remarks.pdf", "마이크론 IR", "2026-09-30", "4쪽 HBM, 7쪽 DRAM·NAND 가격·출하"),
  source("samsung-hbm3e", "삼성전자·AMD AI 메모리 협력", "https://news.samsung.com/global/samsung-and-amd-expand-strategic-collaboration-on-next-generation-ai-memory-solutions", "삼성전자 뉴스룸", "2026-03-18", "HBM3E 공급 관계"),
  source("samsung-hbm4", "삼성전자 HBM4 양산 출하", "https://news.samsung.com/kr/삼성전자-세계-최초-업계-최고-성능의-hbm4-양산-출하", "삼성전자 뉴스룸", "2026-02-12", "HBM4 양산 출하 발표"),
  source("samsung-hbm4e", "삼성전자 HBM4E 샘플 출하", "https://news.samsung.com/global/samsung-electronics-begins-shipment-of-industry-first-hbm4e-samples", "삼성전자 뉴스룸", "2026-05-29", "샘플과 양산 구분"),
  source("micron-hbm3e", "마이크론 AI 메모리 제품 안내", "https://www.micron.com/markets-industries/ai", "마이크론", null, "HBM3E 공급 제품 안내, 게시일 미표기"),
  // 2026-11-10 갱신: 삼성전자 확정실적·SK하이닉스 3분기 실적
  { id: "samsung-q3-kr", title: "삼성전자 2026년 3분기 실적 발표", url: "https://news.samsung.com/kr/삼성전자-2026년-3분기-실적-발표", publisher: "삼성전자 뉴스룸", publishedAt: "2026-10-29", checkedAt: "2026-11-10", locator: "연결 매출·영업이익, DS 부문 매출·영업이익, 전분기 증감" },
  { id: "samsung-q3-global", title: "Samsung Electronics Announces Third Quarter 2026 Results", url: "https://news.samsung.com/global/samsung-electronics-announces-third-quarter-2026-results", publisher: "삼성전자 뉴스룸", publishedAt: "2026-10-29", checkedAt: "2026-11-10", locator: "사업부별 매출·영업이익(조 원)" },
  { id: "skhynix-q3", title: "SK hynix Announces 3Q26 Financial Results", url: "https://news.skhynix.com/en/q3-2026-business-results/", publisher: "SK하이닉스 뉴스룸", publishedAt: "2026-10-28", checkedAt: "2026-11-10", locator: "연결 실적 표(십억 원): 3Q26·2Q26·3Q25 매출·영업이익·순이익" },
  { id: "skhynix-q3-kr", title: "SK하이닉스, 2026년 3분기 경영실적 발표", url: "https://news.skhynix.co.kr/q3-2026-business-results/", publisher: "SK하이닉스 뉴스룸", publishedAt: "2026-10-28", checkedAt: "2026-11-10", locator: "국문 발표(영문 발표와 같은 수치)" },
];
const metric = (value: number, sourceId: string): Metric => ({ status: "available", value, badge: "공식", sourceId });
const missing = (reason = "이번 비교 자료에서 미수집"): Metric => ({ status: "unpublished", value: null, badge: null, sourceId: null, reason });
const makeRecord = (companyId: CompanyId, fiscalYear: number, fiscalQuarter: 1 | 2 | 3 | 4, start: string, end: string, revenue: number, op: number, sourceId: string): QuarterRecord => ({
  recordId: `${companyId}-${fiscalYear}-q${fiscalQuarter}-consolidated-${companyId === "micron" ? "gaap" : "kifrs"}-r1`, revision: 1,
  companyId, fiscalYear, fiscalQuarter, periodLabel: companyId === "micron" ? `FY${fiscalYear} ${fiscalQuarter}분기` : `${fiscalYear}년 ${fiscalQuarter}분기`,
  periodStart: start, periodEnd: end, periodStartMethod: "published", previousPeriodEnd: null, periodSourceIds: [sourceId], weeks: null,
  currency: companyId === "micron" ? "USD" : "KRW", unit: companyId === "micron" ? "million" : "trillion", scope: "consolidated",
  basis: companyId === "micron" ? "US-GAAP" : "K-IFRS", releaseStatus: "reported", auditStatus: "unknown", releasedAt: null, checkedAt,
  revenue: metric(revenue, sourceId), operatingProfit: metric(op, sourceId), netIncome: missing(), reportedMargin: missing(), officialGrowth: {}, previousQuarterId: null, previousYearQuarterId: null,
});
const samsung = makeRecord("samsung", 2026, 3, "2026-07-01", "2026-09-30", 195, 107.4, "samsung-global");
samsung.releaseStatus = "preliminary"; samsung.releasedAt = "2026-10-08"; samsung.netIncome = missing("잠정자료에서 순이익 미공개");
samsung.previousQuarterId = "samsung-2026-q2-consolidated-kifrs-r1"; samsung.previousYearQuarterId = "samsung-2025-q3-consolidated-kifrs-r1";
samsung.officialGrowth = { revenueYoy: metric(126.59, "samsung-kr"), revenueQoq: metric(13.70, "samsung-kr"), opYoy: metric(782.50, "samsung-kr"), opQoq: metric(20.01, "samsung-kr") };
const micron = makeRecord("micron", 2026, 4, "2026-05-29", "2026-09-03", 54229, 43751, "micron-q4");
micron.releasedAt = "2026-09-30"; micron.auditStatus = "unaudited"; micron.netIncome = metric(37701, "micron-q4"); micron.reportedMargin = metric(80.7, "micron-q4");
micron.previousQuarterId = "micron-2026-q3-consolidated-gaap-r1"; micron.previousYearQuarterId = "micron-2025-q4-consolidated-gaap-r1";
const micronPrevious = makeRecord("micron", 2026, 3, "2026-02-27", "2026-05-28", 41456, 33318, "micron-q4");
const micronYearAgo = makeRecord("micron", 2025, 4, "2025-05-30", "2025-08-28", 11315, 3654, "micron-q4");
for (const [record, priorEnd, periodSourceId, weeks] of [
  [micron, "2026-05-28", "micron-q3", 14],
  [micronPrevious, "2026-02-26", "micron-q3", 13],
  [micronYearAgo, "2025-05-29", "micron-2025-q4", 13],
] as const) {
  record.periodStartMethod = "day-after-previous-end"; record.previousPeriodEnd = priorEnd; record.periodSourceIds = [periodSourceId, "micron-q4"]; record.weeks = weeks;
}
// ─── 2026-11-10: 삼성전자 확정 연결실적(r2), SK하이닉스 3분기, 삼성전자 DS ───
const reviewedAt = "2026-11-10";
// 삼성전자 확정실적: 잠정(r1)을 덮어쓰지 않고 새 버전으로 등록. 영업이익 107.4조 원 동일, 매출 195→195.3조 원
const samsungFinal: QuarterRecord = {
  ...samsung,
  recordId: "samsung-2026-q3-consolidated-kifrs-r2", revision: 2, releaseStatus: "reported", releasedAt: "2026-10-29", checkedAt: reviewedAt,
  periodSourceIds: ["samsung-q3-kr"],
  revenue: metric(195.3, "samsung-q3-kr"), operatingProfit: metric(107.4, "samsung-q3-kr"),
  netIncome: missing("확정실적 보도자료에 순이익 미기재"),
  officialGrowth: {}, // 확정 발표는 전분기 14%·20%처럼 정수 반올림만 공개 → 비교 분기로 재계산
};
// 삼성전자 DS 부문: 메모리·시스템LSI·파운드리 포함. 메모리 단독 영업이익은 미공개
const samsungDs: QuarterRecord = {
  ...makeRecord("samsung", 2026, 3, "2026-07-01", "2026-09-30", 147.1, 106.5, "samsung-q3-kr"),
  recordId: "samsung-2026-q3-ds-kifrs-r1", scope: "DS", releasedAt: "2026-10-29", checkedAt: reviewedAt,
  netIncome: missing("사업부 순이익은 공개하지 않음"),
};
const hynixRecord = (year: number, quarter: 1 | 2 | 3 | 4, start: string, end: string, revenue: number, op: number, net: number): QuarterRecord => ({
  ...makeRecord("skhynix", year, quarter, start, end, revenue, op, "skhynix-q3"),
  checkedAt: reviewedAt, netIncome: metric(net, "skhynix-q3"),
});
// 원자료 단위 십억 원 → 조 원(소수 4자리, 원자료 정밀도 그대로)
const hynix = hynixRecord(2026, 3, "2026-07-01", "2026-09-30", 104.6155, 83.3338, 39.7756);
hynix.releasedAt = "2026-10-28"; hynix.auditStatus = "unaudited";
hynix.reportedMargin = metric(80, "skhynix-q3");
hynix.previousQuarterId = "skhynix-2026-q2-consolidated-kifrs-r1"; hynix.previousYearQuarterId = "skhynix-2025-q3-consolidated-kifrs-r1";
const hynixPrevious = hynixRecord(2026, 2, "2026-04-01", "2026-06-30", 79.3187, 60.5426, 93.9226);
const hynixYearAgo = hynixRecord(2025, 3, "2025-07-01", "2025-09-30", 24.4489, 11.3834, 12.5975);

// 배열 앞 6개 순서는 기존 검증 스크립트가 인덱스로 참조하므로 유지하고 새 레코드는 뒤에 붙인다
export const SME_RECORDS: QuarterRecord[] = [samsung,
  makeRecord("samsung", 2026, 2, "2026-04-01", "2026-06-30", 171.5, 89.49, "samsung-global"),
  makeRecord("samsung", 2025, 3, "2025-07-01", "2025-09-30", 86.06, 12.17, "samsung-global"), micron, micronPrevious, micronYearAgo,
  samsungFinal, samsungDs, hynix, hynixPrevious, hynixYearAgo];
export const SME_PRELIMINARY_SNAPSHOT_ID = "2026-10-08-preliminary";
export const SME_ACTIVE_SNAPSHOT_ID = "2026-11-10-q3-reported";
export const SME_SNAPSHOTS: Snapshot[] = [
  { id: SME_PRELIMINARY_SNAPSHOT_ID, updatedAt: checkedAt, recordIds: [samsung.recordId, micron.recordId], segmentRecordIds: [], note: "삼성전자 잠정 연결실적과 마이크론 최신 GAAP 실적을 반영했습니다." },
  { id: SME_ACTIVE_SNAPSHOT_ID, updatedAt: reviewedAt, recordIds: [samsungFinal.recordId, hynix.recordId, micron.recordId], segmentRecordIds: [samsungDs.recordId], note: "삼성전자 확정 연결실적, SK하이닉스 3분기 실적을 추가하고 삼성전자 DS를 별도 표로 분리했습니다." },
];
export const SME_EVIDENCE: EvidenceItem[] = [
  { companyId: "samsung", title: "사업부별 기여는 확정실적에서 확인", text: "잠정 발표에는 DS·메모리·파운드리·MX별 실적과 이익 기여액이 없습니다. 회사 전체의 이익 증가분을 HBM에 배분하지 않습니다.", badge: null, sourceIds: ["samsung-kr"], appliesToRecordIds: [samsung.recordId] },
  { companyId: "micron", title: "DRAM 가격과 출하 증가", text: "DRAM 매출은 398억 달러로 전체의 73%입니다. 전분기 매출은 27% 늘었고, 가격은 10%대 후반, 비트 출하는 한 자릿수 중반 증가했다고 설명했습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
  { companyId: "micron", title: "NAND 가격 상승과 AI 저장 수요", text: "NAND 매출은 141억 달러로 전체의 26%입니다. 전분기 매출은 42%, 가격은 약 30%, 비트 출하는 약 10% 증가했다고 설명했습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
  { companyId: "samsung", title: "DS가 전사 영업이익 대부분", text: "DS 부문은 매출 147.1조 원, 영업이익 106.5조 원으로 전사 영업이익 107.4조 원의 대부분을 냈습니다. DS에는 메모리 외 시스템LSI·파운드리도 포함되며, 메모리 단독 영업이익은 공개되지 않았습니다.", badge: "공식", sourceIds: ["samsung-q3-kr"], appliesToRecordIds: ["samsung-2026-q3-consolidated-kifrs-r2"] },
  { companyId: "samsung", title: "HBM4·서버 SSD와 환율 영향", text: "회사는 메모리가 HBM4 판매 급증과 서버 SSD 수요로 분기 최대 실적을 냈다고 설명했습니다. 환율 하락으로 전분기 대비 영업이익이 약 10조 원 줄어드는 영향이 있었다고 밝혔습니다.", badge: "공식", sourceIds: ["samsung-q3-kr"], appliesToRecordIds: ["samsung-2026-q3-consolidated-kifrs-r2"] },
  { companyId: "skhynix", title: "HBM4 본격 출하와 서버 DDR5", text: "서버용 DDR5 판매가 크게 늘고 HBM4 출하가 본격화됐다고 설명했습니다. HBM 매출액과 DRAM 내 HBM 비중은 공개하지 않았습니다.", badge: "공식", sourceIds: ["skhynix-q3"], appliesToRecordIds: ["skhynix-2026-q3-consolidated-kifrs-r1"] },
  { companyId: "skhynix", title: "순이익은 전분기보다 감소", text: "영업이익은 전분기보다 38% 늘었지만 순이익은 39.8조 원으로 전분기 93.9조 원보다 58% 줄었습니다. 순이익에는 영업 외 손익과 법인세가 반영되므로, 이 리포트는 영업이익을 기준으로 비교합니다. 회사는 검토가 끝나지 않은 수치로 감사 과정에서 바뀔 수 있다고 밝혔습니다.", badge: "공식", sourceIds: ["skhynix-q3"], appliesToRecordIds: ["skhynix-2026-q3-consolidated-kifrs-r1"] },
  { companyId: "micron", title: "HBM 확대와 공급 제약", text: "HBM 매출 증가율은 회사 전체 매출 증가율을 상회했습니다. 회사는 메모리 공급 제약과 HBM4 확대를 설명했지만, HBM 제품별 영업이익 기여액은 공개하지 않았습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
];
export const SME_PRODUCT_UPDATES: ProductUpdate[] = [
  { companyId: "samsung", generation: "HBM3E", stage: "공급 관계", announcedAt: "2026-03-18", text: "AMD AI 가속기에 대한 HBM3E 공급 관계를 발표했습니다.", sourceIds: ["samsung-hbm3e"] },
  { companyId: "samsung", generation: "HBM4", stage: "양산 출하", announcedAt: "2026-02-12", text: "HBM4 양산 출하를 발표했습니다. 이번 분기 이익 기여액과는 별개 정보입니다.", sourceIds: ["samsung-hbm4"] },
  { companyId: "samsung", generation: "HBM4E", stage: "샘플 출하", announcedAt: "2026-05-29", text: "HBM4E 샘플 출하를 발표했습니다. 샘플 출하를 양산 매출로 해석하지 않습니다.", sourceIds: ["samsung-hbm4e"] },
  { companyId: "skhynix", generation: "HBM4", stage: "본격 출하", announcedAt: "2026-10-28", text: "3분기 실적 발표에서 HBM4 출하가 본격화됐고, 4분기에는 HBM4가 출하량·매출 모두 HBM3E를 넘어설 것으로 예상했습니다.", sourceIds: ["skhynix-q3"] },
  { companyId: "micron", generation: "HBM3E", stage: "제품 안내", announcedAt: null, text: "공식 AI 제품 안내에 HBM3E를 소개합니다. 이번 분기 별도 매출·이익은 확인되지 않습니다.", sourceIds: ["micron-hbm3e"] },
  { companyId: "micron", generation: "HBM4", stage: "출하 확대 설명", announcedAt: "2026-09-30", text: "Q4 컨콜 준비자료에서 HBM4 확대를 설명했습니다.", sourceIds: ["micron-remarks"] },
  { companyId: "micron", generation: "HBM4E", stage: "고객 협력", announcedAt: "2026-09-30", text: "엔비디아와 custom-HBM4E(NVHBM) 협력을 언급했습니다. 실제 양산 매출과 구분합니다.", sourceIds: ["micron-remarks"] },
];
export const SME_GUIDANCE: Guidance[] = [{ companyId: "micron", periodLabel: "FY2027 1분기", basis: "US-GAAP", announcedAt: "2026-09-30", sourceId: "micron-q4", lines: ["매출 615억 달러 ± 15억 달러", "매출총이익률 약 85.95% · 영업비용 약 23.1억 달러", "희석 주당순이익 37.84달러 ± 1.00달러"] }];
export const SME_UPDATE_LOG = [
  { date: "2026-11-10", text: "삼성전자 확정실적 반영(매출 195조 → 195.3조 원, 영업이익 107.4조 원 동일). SK하이닉스 2026년 3분기 실적 추가, 삼성전자 DS 부문 별도 표 추가" },
  { date: "2026-10-08", text: "삼성전자 Q3 잠정실적·마이크론 FY2026 Q4 비교 자료 작성" },
];
/** 2사 잠정 스냅샷 시절 본문(이전 스냅샷 보존용) */
export const SME_SEO_INTRO_PRELIMINARY = [
  "삼성전자 2026년 3분기 잠정실적은 이번 분기에 회사 전체가 얼마나 벌었는지 먼저 확인하는 자료입니다. 실적 발표 직후에는 매출과 영업이익 숫자뿐 아니라 지난해 같은 분기와 직전 분기보다 얼마나 달라졌는지 함께 살펴볼 필요가 있습니다. 이 리포트는 공식 연결실적을 출발점으로 삼고, 아직 결산을 마치지 않은 잠정 발표라는 점과 사업부별 설명이 추가될 시점을 구분해 안내합니다.",
  "마이크론 최신 실적을 함께 보면 한국과 미국의 주요 메모리 기업이 각자의 최근 발표에서 어떤 수익성을 보여주었는지 살펴볼 수 있습니다. 매출과 영업이익은 원통화로 읽고, 영업이익률은 같은 나눗셈으로 계산해 규모와 수익성을 구분합니다. 마이크론 회계연도의 분기 명칭과 실제 시작일·종료일을 함께 표시하며, 두 기업의 실적이 완전히 같은 기간의 결과라는 오해를 줄입니다.",
  "AI 서버와 가속기는 데이터를 빠르게 전달할 메모리와 저장장치를 필요로 합니다. 다만 AI 수요가 늘었다는 설명만으로 한 회사의 이익 증가를 모두 설명할 수는 없습니다. 제품 가격, 출하량, 고부가 제품 비중과 비용을 함께 읽어야 하며, 이 리포트는 회사가 공식 자료에서 공개한 변화와 편집 해석을 구분합니다. HBM 양산이나 고객 협력 발표도 해당 분기의 이익 기여액이 공개된 것과는 다르게 해석해야 합니다.",
  "삼성전자는 반도체 외에도 여러 전자 사업을 포함하고, 마이크론은 메모리와 저장장치 중심의 기업입니다. 그래서 전체 회사의 영업이익률 차이만으로 메모리 기술 경쟁력이나 투자 성과를 단정할 수 없습니다. 삼성전자 확정실적과 SK하이닉스 발표가 나오면 비교 범위를 보강하고, 직원 성과급은 회사별 별도 기준을 확인하도록 관련 리포트로 연결합니다. 분기 영업이익의 증가율을 개인의 성과급 증가율로 그대로 적용하지 않습니다.",
];
export const SME_SEO_INTRO = [
  "삼성전자와 SK하이닉스는 2026년 10월 말 3분기 실적을 발표했고, 마이크론은 9월 말 FY2026 4분기 실적을 발표했습니다. 이 리포트는 세 회사의 공식 연결실적을 같은 표에 놓고 매출·영업이익·영업이익률을 비교합니다. 다만 마이크론 회계분기는 5월 말부터 9월 초까지로 한국 두 회사의 7~9월과 다르고, 통화도 원과 달러로 달라 같은 기간·같은 단위의 비교는 아닙니다.",
  "삼성전자 확정실적은 매출 195.3조 원, 영업이익 107.4조 원으로 10월 8일 잠정치와 영업이익이 같고 매출만 0.3조 원 늘었습니다. SK하이닉스는 매출 104.6조 원, 영업이익 83.3조 원으로 영업이익률이 80%에 가깝습니다. 삼성전자 전체 이익률이 낮아 보이는 것은 모바일·가전·디스플레이 등 이익률이 낮은 사업까지 연결실적에 들어가기 때문이며, 메모리 경쟁력만의 차이로 읽으면 안 됩니다.",
  "그래서 삼성전자는 반도체를 맡는 DS 부문을 따로 표로 보여줍니다. DS는 매출 147.1조 원, 영업이익 106.5조 원으로 전사 이익의 대부분을 차지합니다. 하지만 DS에는 메모리 외 시스템LSI·파운드리도 들어 있고, 메모리 단독 영업이익은 공개되지 않았습니다. DS 수치를 메모리 실적이나 SK하이닉스·마이크론과 같은 범위의 숫자로 바꿔 읽지 않도록 메인 비교표와 분리했습니다.",
  "세 회사 모두 HBM과 서버용 메모리 수요를 실적 개선 이유로 들었지만, HBM 매출액이나 제품별 영업이익은 공개하지 않았습니다. 전체 이익 증가분을 HBM에 배분하거나 HBM 시장점유율을 이 표로 추정하지 않습니다. SK하이닉스 수치는 회사가 검토 중이라고 밝힌 값이라 감사 과정에서 바뀔 수 있습니다. 직원 성과급은 회사별 산정 기준이 따로 있으므로 분기 영업이익 증가율을 그대로 적용하지 않습니다.",
];
export const SME_CRITERIA = ["삼성전자·SK하이닉스 연결 K-IFRS와 마이크론 연결 US-GAAP 기준입니다. 마이크론 Non-GAAP 이익과 삼성전자 DS 부문은 기본 비교표에 섞지 않습니다.", "영업이익률은 영업이익 ÷ 매출 × 100으로 재계산합니다. 공식 증감률이 소수 둘째 자리까지 공개되지 않으면 같은 회사의 비교 분기로 성장률을 계산합니다.", "삼성전자·SK하이닉스는 조 원, 마이크론은 억 달러로 표시합니다. 환율을 사용한 원화 환산이나 절대 이익 차액 비교는 제공하지 않습니다.", "공식은 공개 발표, 참고는 편집 해석, 시뮬레이션은 계산 결과, 추정은 별도 추산입니다. 미공개 항목은 0으로 채우지 않습니다."];
export const SME_RELATED = [
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자·SK하이닉스 성과급과 총보상 비교" },
  { href: "/reports/sk-hynix-earnings-ps-outlook-2026/", label: "SK하이닉스 실적과 PS 전망" },
  { href: "/reports/hbm4-vs-hbm5-beneficiary-comparison/", label: "HBM4·HBM4E 기술과 경쟁 구도" },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 4사 실적 전망 2026~2028" },
  { href: "/reports/semiconductor-etf-2026/", label: "반도체 ETF 비교" },
];
