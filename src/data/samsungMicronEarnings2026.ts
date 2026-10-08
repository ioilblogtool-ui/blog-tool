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
  title: "삼성전자 vs 마이크론 최신 실적 비교 2026",
  seoTitle: "삼성전자 3분기 실적 2026 | 마이크론과 영업이익 비교 — 비교계산소",
  seoDescription: "삼성전자 2026년 3분기 잠정실적과 마이크론 FY2026 4분기의 매출·영업이익·이익률을 비교합니다. 기준기간·사업구조 차이, AI·HBM 영향과 성과급 연결까지 확인하세요.",
  description: "최신 발표의 매출·영업이익·이익률을 비교하고, AI·HBM 경쟁과 직원 성과급의 연결을 살펴봅니다.",
  updatedAt: "2026-10-08", publishedAt: null as string | null,
  ogImage: "/og/reports/samsung-micron-earnings-2026.png",
};
export const SME_COMPANIES: Company[] = [
  { id: "samsung", name: "삼성전자", availability: "available", businessSummary: "메모리·파운드리·모바일·가전·디스플레이 등 여러 사업을 포함하는 종합전자회사입니다." },
  { id: "skhynix", name: "SK하이닉스", availability: "pending", businessSummary: "메모리 중심 기업입니다. 2026년 3분기 공식 실적 발표 후 비교에 추가합니다." },
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
export const SME_RECORDS: QuarterRecord[] = [samsung,
  makeRecord("samsung", 2026, 2, "2026-04-01", "2026-06-30", 171.5, 89.49, "samsung-global"),
  makeRecord("samsung", 2025, 3, "2025-07-01", "2025-09-30", 86.06, 12.17, "samsung-global"), micron, micronPrevious, micronYearAgo];
export const SME_ACTIVE_SNAPSHOT_ID = "2026-10-08-preliminary";
export const SME_SNAPSHOTS: Snapshot[] = [{ id: SME_ACTIVE_SNAPSHOT_ID, updatedAt: checkedAt, recordIds: [samsung.recordId, micron.recordId], segmentRecordIds: [], note: "삼성전자 잠정 연결실적과 마이크론 최신 GAAP 실적을 반영했습니다." }];
export const SME_EVIDENCE: EvidenceItem[] = [
  { companyId: "samsung", title: "사업부별 기여는 확정실적에서 확인", text: "잠정 발표에는 DS·메모리·파운드리·MX별 실적과 이익 기여액이 없습니다. 회사 전체의 이익 증가분을 HBM에 배분하지 않습니다.", badge: null, sourceIds: ["samsung-kr"], appliesToRecordIds: [samsung.recordId] },
  { companyId: "micron", title: "DRAM 가격과 출하 증가", text: "DRAM 매출은 398억 달러로 전체의 73%입니다. 전분기 매출은 27% 늘었고, 가격은 10%대 후반, 비트 출하는 한 자릿수 중반 증가했다고 설명했습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
  { companyId: "micron", title: "NAND 가격 상승과 AI 저장 수요", text: "NAND 매출은 141억 달러로 전체의 26%입니다. 전분기 매출은 42%, 가격은 약 30%, 비트 출하는 약 10% 증가했다고 설명했습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
  { companyId: "micron", title: "HBM 확대와 공급 제약", text: "HBM 매출 증가율은 회사 전체 매출 증가율을 상회했습니다. 회사는 메모리 공급 제약과 HBM4 확대를 설명했지만, HBM 제품별 영업이익 기여액은 공개하지 않았습니다.", badge: "공식", sourceIds: ["micron-remarks"], appliesToRecordIds: [micron.recordId] },
];
export const SME_PRODUCT_UPDATES: ProductUpdate[] = [
  { companyId: "samsung", generation: "HBM3E", stage: "공급 관계", announcedAt: "2026-03-18", text: "AMD AI 가속기에 대한 HBM3E 공급 관계를 발표했습니다.", sourceIds: ["samsung-hbm3e"] },
  { companyId: "samsung", generation: "HBM4", stage: "양산 출하", announcedAt: "2026-02-12", text: "HBM4 양산 출하를 발표했습니다. 이번 분기 이익 기여액과는 별개 정보입니다.", sourceIds: ["samsung-hbm4"] },
  { companyId: "samsung", generation: "HBM4E", stage: "샘플 출하", announcedAt: "2026-05-29", text: "HBM4E 샘플 출하를 발표했습니다. 샘플 출하를 양산 매출로 해석하지 않습니다.", sourceIds: ["samsung-hbm4e"] },
  { companyId: "micron", generation: "HBM3E", stage: "제품 안내", announcedAt: null, text: "공식 AI 제품 안내에 HBM3E를 소개합니다. 이번 분기 별도 매출·이익은 확인되지 않습니다.", sourceIds: ["micron-hbm3e"] },
  { companyId: "micron", generation: "HBM4", stage: "출하 확대 설명", announcedAt: "2026-09-30", text: "Q4 컨콜 준비자료에서 HBM4 확대를 설명했습니다.", sourceIds: ["micron-remarks"] },
  { companyId: "micron", generation: "HBM4E", stage: "고객 협력", announcedAt: "2026-09-30", text: "엔비디아와 custom-HBM4E(NVHBM) 협력을 언급했습니다. 실제 양산 매출과 구분합니다.", sourceIds: ["micron-remarks"] },
];
export const SME_GUIDANCE: Guidance[] = [{ companyId: "micron", periodLabel: "FY2027 1분기", basis: "US-GAAP", announcedAt: "2026-09-30", sourceId: "micron-q4", lines: ["매출 615억 달러 ± 15억 달러", "매출총이익률 약 85.95% · 영업비용 약 23.1억 달러", "희석 주당순이익 37.84달러 ± 1.00달러"] }];
export const SME_UPDATE_LOG = [{ date: "2026-10-08", text: "삼성전자 Q3 잠정실적·마이크론 FY2026 Q4 비교 자료 작성" }];
export const SME_SEO_INTRO = [
  "삼성전자 2026년 3분기 잠정실적은 이번 분기에 회사 전체가 얼마나 벌었는지 먼저 확인하는 자료입니다. 실적 발표 직후에는 매출과 영업이익 숫자뿐 아니라 지난해 같은 분기와 직전 분기보다 얼마나 달라졌는지 함께 살펴볼 필요가 있습니다. 이 리포트는 공식 연결실적을 출발점으로 삼고, 아직 결산을 마치지 않은 잠정 발표라는 점과 사업부별 설명이 추가될 시점을 구분해 안내합니다.",
  "마이크론 최신 실적을 함께 보면 한국과 미국의 주요 메모리 기업이 각자의 최근 발표에서 어떤 수익성을 보여주었는지 살펴볼 수 있습니다. 매출과 영업이익은 원통화로 읽고, 영업이익률은 같은 나눗셈으로 계산해 규모와 수익성을 구분합니다. 마이크론 회계연도의 분기 명칭과 실제 시작일·종료일을 함께 표시하며, 두 기업의 실적이 완전히 같은 기간의 결과라는 오해를 줄입니다.",
  "AI 서버와 가속기는 데이터를 빠르게 전달할 메모리와 저장장치를 필요로 합니다. 다만 AI 수요가 늘었다는 설명만으로 한 회사의 이익 증가를 모두 설명할 수는 없습니다. 제품 가격, 출하량, 고부가 제품 비중과 비용을 함께 읽어야 하며, 이 리포트는 회사가 공식 자료에서 공개한 변화와 편집 해석을 구분합니다. HBM 양산이나 고객 협력 발표도 해당 분기의 이익 기여액이 공개된 것과는 다르게 해석해야 합니다.",
  "삼성전자는 반도체 외에도 여러 전자 사업을 포함하고, 마이크론은 메모리와 저장장치 중심의 기업입니다. 그래서 전체 회사의 영업이익률 차이만으로 메모리 기술 경쟁력이나 투자 성과를 단정할 수 없습니다. 삼성전자 확정실적과 SK하이닉스 발표가 나오면 비교 범위를 보강하고, 직원 성과급은 회사별 별도 기준을 확인하도록 관련 리포트로 연결합니다. 분기 영업이익의 증가율을 개인의 성과급 증가율로 그대로 적용하지 않습니다.",
];
export const SME_CRITERIA = ["삼성전자 연결 K-IFRS와 마이크론 연결 US-GAAP 기준입니다. 마이크론 Non-GAAP 이익은 기본 표에 섞지 않습니다.", "영업이익률은 영업이익 ÷ 매출 × 100으로 재계산합니다. 공식 증감률이 없을 때 같은 회사의 비교 분기로 성장률을 계산합니다.", "삼성전자는 조 원, 마이크론은 억 달러로 표시합니다. 환율을 사용한 원화 환산이나 절대 이익 차액 비교는 제공하지 않습니다.", "공식은 공개 발표, 참고는 편집 해석, 시뮬레이션은 계산 결과, 추정은 별도 추산입니다. 미공개 항목은 0으로 채우지 않습니다."];
export const SME_RELATED = [
  { href: "/reports/samsung-vs-skhynix-earnings-bonus-2026/", label: "삼성전자·SK하이닉스 성과급과 총보상 비교" },
  { href: "/reports/sk-hynix-earnings-ps-outlook-2026/", label: "SK하이닉스 실적과 PS 전망" },
  { href: "/reports/hbm4-vs-hbm5-beneficiary-comparison/", label: "HBM4·HBM4E 기술과 경쟁 구도" },
  { href: "/reports/semiconductor-stocks-forecast-2026-2028/", label: "반도체 4사 실적 전망 2026~2028" },
  { href: "/reports/semiconductor-etf-2026/", label: "반도체 ETF 비교" },
];
