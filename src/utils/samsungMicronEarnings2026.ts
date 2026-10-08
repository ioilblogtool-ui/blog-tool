import type { Metric, MetricKey, QuarterRecord, ReportData, Snapshot, Badge } from "../data/samsungMicronEarnings2026";
export type GrowthResult = { kind: "percent"; value: number; badge: Badge } | { kind: "label"; label: string };
const fail = (message: string): never => { throw new Error(`실적 비교 데이터 오류: ${message}`); };
const dateValue = (value: string): number => {
  const parsed = Date.parse(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 10) !== value) fail(`유효하지 않은 날짜 ${value}`);
  return parsed;
};
export function calculateMargin(revenue: number | null, op: number | null): number | null {
  return revenue !== null && op !== null && Number.isFinite(revenue) && Number.isFinite(op) && revenue > 0 ? op / revenue * 100 : null;
}
export function calculateGrowth(current: number | null, previous: number | null): GrowthResult {
  if (current === null || previous === null || !Number.isFinite(current) || !Number.isFinite(previous)) return { kind: "label", label: "계산 불가" };
  if (previous > 0) return { kind: "percent", value: (current / previous - 1) * 100, badge: "시뮬레이션" };
  if (previous < 0 && current > 0) return { kind: "label", label: "흑자 전환" };
  if (previous < 0 && current < 0) return { kind: "label", label: current > previous ? "적자 축소" : current < previous ? "적자 확대" : "적자 지속" };
  return { kind: "label", label: "계산 불가" };
}
export const formatPercent = (value: number, digits = 1) => `${(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value).toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`;
export function formatMoney(record: QuarterRecord, metric: Metric): string {
  if (metric.status !== "available") return metric.reason;
  const value = record.unit === "million" ? metric.value / 100 : metric.value;
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 4 })}${record.currency === "KRW" ? "조 원" : "억 달러"}`;
}
export function resolveSnapshot(id: string, data: ReportData): Snapshot {
  return data.SME_SNAPSHOTS.find(s => s.id === id) ?? fail(`스냅샷 없음 ${id}`);
}
export function validateReportData(data: ReportData): void {
  for (const items of [data.SME_RECORDS.map(r => r.recordId), data.SME_SOURCES.map(s => s.id), data.SME_SNAPSHOTS.map(s => s.id), data.SME_COMPANIES.map(c => c.id)]) {
    if (new Set(items).size !== items.length) fail("ID 중복");
  }
  const sources = new Set(data.SME_SOURCES.map(s => s.id));
  const records = new Map(data.SME_RECORDS.map(r => [r.recordId, r]));
  const badges: Badge[] = ["공식", "참고", "시뮬레이션", "추정"];
  const checkSource = (id: string) => { if (!sources.has(id)) fail(`출처 없음 ${id}`); };
  const checkMetric = (m: Metric) => {
    if (m.status === "available") {
      if (!Number.isFinite(m.value) || !badges.includes(m.badge)) fail("수치·배지 오류");
      checkSource(m.sourceId);
    } else if (m.value !== null || m.badge !== null || m.sourceId !== null || !m.reason) fail("미공개 값 오류");
  };
  for (const s of data.SME_SOURCES) {
    if (!s.url.startsWith("https://")) fail("출처 URL 오류");
    dateValue(s.checkedAt); if (s.publishedAt) dateValue(s.publishedAt);
  }
  for (const r of data.SME_RECORDS) {
    if (!data.SME_COMPANIES.some(c => c.id === r.companyId)) fail("회사 없음");
    if (!Number.isInteger(r.revision) || r.revision < 1 || !Number.isInteger(r.fiscalYear) || ![1, 2, 3, 4].includes(r.fiscalQuarter)) fail("회계분기·버전 오류");
    if (!["preliminary", "reported"].includes(r.releaseStatus)) fail("실적 발표 상태 오류");
    if (!r.recordId.endsWith(`-r${r.revision}`)) fail("레코드 버전 ID 불일치");
    if ((r.currency === "USD") !== (r.unit === "million")) fail("통화·단위 오류");
    const start = dateValue(r.periodStart), end = dateValue(r.periodEnd);
    if (start > end) fail("기간 역전");
    dateValue(r.checkedAt); if (r.releasedAt) dateValue(r.releasedAt);
    if (!r.periodSourceIds.length) fail("기간 출처 없음"); r.periodSourceIds.forEach(checkSource);
    if (r.weeks !== null && (end - start) / 86400000 + 1 !== r.weeks * 7) fail("주 수 불일치");
    if (r.periodStartMethod === "day-after-previous-end" && (!r.previousPeriodEnd || dateValue(r.previousPeriodEnd) + 86400000 !== start)) fail("분기 시작일 추론 오류");
    [r.revenue, r.operatingProfit, r.netIncome, r.reportedMargin, ...Object.values(r.officialGrowth)].forEach(checkMetric);
    for (const [kind, id] of [["qoq", r.previousQuarterId], ["yoy", r.previousYearQuarterId]] as const) {
      if (!id) continue;
      const previous = records.get(id) ?? fail(`비교 분기 없음 ${id}`);
      for (const field of ["companyId", "scope", "basis", "currency", "unit"] as const) if (previous[field] !== r[field]) fail("비교 범위 불일치");
      const expectedQuarter = kind === "yoy" ? r.fiscalQuarter : r.fiscalQuarter === 1 ? 4 : r.fiscalQuarter - 1;
      const expectedYear = kind === "yoy" || r.fiscalQuarter === 1 ? r.fiscalYear - 1 : r.fiscalYear;
      if (previous.fiscalQuarter !== expectedQuarter || previous.fiscalYear !== expectedYear) fail("비교 회계분기 불일치");
      if (kind === "qoq" && dateValue(previous.periodEnd) + 86400000 !== start) fail("직전 분기 기간 불일치");
    }
  }
  for (const s of data.SME_SNAPSHOTS) {
    dateValue(s.updatedAt); const companies = new Set<string>();
    if (s.recordIds.length < 2) fail("비교 회사 부족");
    for (const id of s.recordIds) {
      const r = records.get(id) ?? fail("스냅샷 레코드 없음");
      if (r.scope !== "consolidated" || r.basis === "non-GAAP" || companies.has(r.companyId)) fail("활성 비교 범위·중복 오류");
      if ([r.revenue, r.operatingProfit].some(m => m.status === "available" && m.badge !== "공식")) fail("실적 비교에 추정 수치 혼입");
      if (data.SME_COMPANIES.find(c => c.id === r.companyId)?.availability !== "available") fail("발표 대기 회사 혼입");
      companies.add(r.companyId);
    }
    for (const id of s.segmentRecordIds) if (!records.has(id) || records.get(id)?.scope === "consolidated") fail("사업부 범위 오류");
  }
  for (const e of data.SME_EVIDENCE) {
    e.sourceIds.forEach(checkSource); e.appliesToRecordIds.forEach(id => { if (!records.has(id)) fail("해석 대상 레코드 없음"); });
  }
  for (const p of data.SME_PRODUCT_UPDATES) { p.sourceIds.forEach(checkSource); if (p.announcedAt) dateValue(p.announcedAt); }
  for (const g of data.SME_GUIDANCE) { checkSource(g.sourceId); dateValue(g.announcedAt); }
  resolveSnapshot(data.SME_ACTIVE_SNAPSHOT_ID, data);
}
export function buildReportView(snapshot: Snapshot, data: ReportData) {
  const byId = new Map(data.SME_RECORDS.map(r => [r.recordId, r]));
  const records = data.SME_COMPANIES.flatMap(c => snapshot.recordIds.map(id => byId.get(id)!).filter(r => r.companyId === c.id));
  const companyName = (id: string) => data.SME_COMPANIES.find(c => c.id === id)!.name;
  const metrics: MetricKey[] = ["revenue", "operatingProfit"];
  const kpiGroups = records.map(record => ({ company: companyName(record.companyId), record, margin: calculateMargin(record.revenue.value, record.operatingProfit.value), cards: metrics.map(key => ({ label: `${companyName(record.companyId)} ${key === "revenue" ? "매출" : "영업이익"}`, displayValue: formatMoney(record, record[key]), badge: record[key].badge, sourceId: record[key].sourceId, key })) }));
  type Cell = { text: string; badge: Badge | null; sourceId: string | null };
  const plain = (text: string): Cell => ({ text, badge: null, sourceId: null });
  const growth = (r: QuarterRecord, metric: "revenue" | "operatingProfit", direction: "Yoy" | "Qoq"): Cell => {
    const key = `${metric === "revenue" ? "revenue" : "op"}${direction}` as keyof QuarterRecord["officialGrowth"];
    const official = r.officialGrowth[key];
    if (official?.status === "available") return { text: formatPercent(official.value, 2), badge: official.badge, sourceId: official.sourceId };
    const previous = byId.get((direction === "Yoy" ? r.previousYearQuarterId : r.previousQuarterId) ?? "");
    const result = calculateGrowth(r[metric].value, previous?.[metric].value ?? null);
    return result.kind === "percent" ? { text: formatPercent(result.value, 2), badge: result.badge, sourceId: null } : plain(result.label);
  };
  const rows = [
    { label: "기준 분기", cells: records.map(r => plain(r.periodLabel)) },
    { label: "대상기간", cells: records.map(r => plain(`${r.periodStart} ~ ${r.periodEnd}${r.weeks ? ` (${r.weeks}주)` : ""}`)) },
    { label: "회계기준·통화", cells: records.map(r => plain(`${r.basis} · ${r.currency === "KRW" ? "조 원" : "억 달러"}`)) },
    { label: "발표 상태", cells: records.map(r => plain(r.releaseStatus === "preliminary" ? "잠정 연결실적" : `발표된 연결실적${r.auditStatus === "unaudited" ? " (미감사)" : ""}`)) },
    { label: "발표일", cells: records.map(r => plain(r.releasedAt ?? "최초 발표일 미확인")) },
    ...(["revenue", "operatingProfit", "netIncome"] as MetricKey[]).map(key => ({ label: key === "revenue" ? "매출" : key === "operatingProfit" ? "영업이익" : "순이익", cells: records.map(r => ({ text: formatMoney(r, r[key]), badge: r[key].badge, sourceId: r[key].sourceId })) })),
    { label: "영업이익률", cells: kpiGroups.map(g => ({ text: g.margin === null ? "계산 불가" : formatPercent(g.margin), badge: g.margin === null ? null : "시뮬레이션" as Badge, sourceId: null })) },
    ...(["revenue", "operatingProfit"] as const).flatMap(metric => (["Yoy", "Qoq"] as const).map(direction => ({ label: `${metric === "revenue" ? "매출" : "영업이익"} ${direction === "Yoy" ? "전년동기" : "전분기"} 증감률`, cells: records.map(r => growth(r, metric, direction)) }))),
  ];
  const three = records.length === 3;
  const meta = { ...data.SME_META, updatedAt: snapshot.updatedAt, ...(three ? { title: "삼성전자·SK하이닉스·마이크론 실적 비교 2026", seoTitle: "삼성전자·SK하이닉스·마이크론 실적 비교 2026 — 비교계산소", seoDescription: "삼성전자·SK하이닉스·마이크론의 최신 실적을 매출·영업이익·이익률로 비교합니다. 회사별 회계기간과 사업구조 차이, AI·HBM 영향과 성과급 해석 기준까지 확인하세요." } : {}) };
  const samsung = records.find(r => r.companyId === "samsung"), micron = records.find(r => r.companyId === "micron");
  const faq = [
    { question: "삼성전자 2026년 3분기 영업이익은 얼마인가요?", answer: samsung ? `${samsung.periodLabel} 영업이익은 ${formatMoney(samsung, samsung.operatingProfit)}입니다. ${samsung.releaseStatus === "preliminary" ? "현재 수치는 공식 잠정 연결실적이며 확정 결산 결과가 아닙니다." : "공식 연결실적이며 사업부별 실적과 구분해 읽어야 합니다."}` : "삼성전자 공식 발표 자료를 확인하세요. 이번 비교 범위는 표의 기간을 기준으로 합니다." },
    { question: "삼성전자 3분기 실적은 전년보다 얼마나 늘었나요?", answer: samsung ? `매출 전년동기 증감률은 ${growth(samsung, "revenue", "Yoy").text}, 영업이익은 ${growth(samsung, "operatingProfit", "Yoy").text}입니다. 전분기와 전년동기는 다른 비교 기준이므로 표의 항목을 구분하세요.` : "현재 표의 삼성전자 열을 확인하세요. 비교 기준이 없는 지표는 계산하지 않습니다." },
    { question: "마이크론 최신 실적은 얼마인가요?", answer: micron ? `${micron.periodLabel} 매출은 ${formatMoney(micron, micron.revenue)}, 영업이익은 ${formatMoney(micron, micron.operatingProfit)}입니다. ${micron.periodStart}부터 ${micron.periodEnd}까지의 미국 GAAP 연결실적입니다.` : "마이크론 공식 발표를 확인하세요. 다른 회사와 회계기간이 다릅니다." },
    { question: "삼성전자와 마이크론 중 영업이익률이 더 높은 곳은 어디인가요?", answer: `${kpiGroups.map(g => `${g.company} ${g.margin === null ? "계산 불가" : formatPercent(g.margin)}`).join(", ")}입니다. 같은 산식의 참고 비교이며 회사의 기술 경쟁력 순위나 투자 수익을 뜻하지 않습니다.` },
    { question: "삼성전자와 마이크론 실적을 직접 비교해도 되나요?", answer: "회사 전체의 규모·수익성을 참고하는 비교는 가능합니다. 다만 통화·회계기간·회계기준·사업구조가 달라 동일 기간의 메모리 경쟁력 비교로 단정할 수 없습니다." },
    { question: "삼성전자 반도체 사업부 실적은 언제 나오나요?", answer: "확정실적과 컨퍼런스콜 자료에서 사업부별 공식 정보를 확인해야 합니다. 정확한 일정은 공식 IR을 확인하고, 공개되지 않은 메모리 영업이익을 DS 전체 수치로 대신하지 않습니다." },
    { question: "HBM이 실적에 얼마나 영향을 줬나요?", answer: "공개된 HBM 매출 변화와 제품·고객 코멘트까지 확인할 수 있습니다. 제품별 영업이익 기여액이 공개되지 않았다면 전체 이익 증가분을 HBM에 배분할 수 없습니다." },
    { question: "SK하이닉스 실적은 언제 비교에 추가되나요?", answer: three ? "SK하이닉스 공식 실적을 비교표에 추가했습니다. 각 회사의 실제 대상기간을 확인하고 읽어주세요." : "2026년 3분기 공식 실적 발표 후 같은 페이지에 추가할 예정입니다. 발표 전 예상 수치는 비교표나 이익률 순위에 넣지 않습니다." },
    { question: "삼성전자 실적이 좋아지면 성과급도 늘어나나요?", answer: "실적 개선은 참고 요인이지만 OPI·TAI는 사업부와 별도 산정 기준을 확인해야 합니다. 개인 성과급을 연결 영업이익 증가율만으로 계산하지 않고 관련 가이드에서 회사별 기준을 확인하세요." },
  ];
  return { meta, records, companies: records.map(r => data.SME_COMPANIES.find(c => c.id === r.companyId)!), kpiGroups, rows, faq,
    periodNote: `회사별 회계기간은 서로 다릅니다. ${records.map(r => `${companyName(r.companyId)} ${r.periodLabel}: ${r.periodStart} ~ ${r.periodEnd}${r.weeks ? ` (${r.weeks}주)` : ""}`).join(" · ")}. 동일 기간으로 환산한 비교가 아닙니다.`,
    segments: snapshot.segmentRecordIds.map(id => byId.get(id)!),
    evidence: data.SME_EVIDENCE.filter(e => e.appliesToRecordIds.some(id => snapshot.recordIds.includes(id))),
    trends: records.map(record => ({ record, company: companyName(record.companyId), history: [byId.get(record.previousYearQuarterId ?? ""), byId.get(record.previousQuarterId ?? ""), record].filter((r): r is QuarterRecord => !!r) })),
    noticeLines: [`최신 발표 기준입니다. ${records.map(r => `${companyName(r.companyId)} ${r.periodLabel}`).join(" · ")}의 대상기간은 서로 다릅니다.`, `${records.map(r => `${companyName(r.companyId)} ${r.basis}`).join(" · ")} 연결실적입니다. 원통화 금액이며 원화 환산은 하지 않습니다.`, "잠정실적·미공개 항목을 확인하세요. 영업이익률만으로 메모리 경쟁력을 단정할 수 없습니다."],
  };
}
export function buildJsonLd(view: ReturnType<typeof buildReportView>, canonical: string) {
  const base = new URL("/", canonical).href;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: view.meta.title, description: view.meta.seoDescription, dateModified: view.meta.updatedAt, ...(view.meta.publishedAt ? { datePublished: view.meta.publishedAt } : {}), mainEntityOfPage: canonical, author: { "@type": "Organization", name: "비교계산소" } },
    { "@type": "FAQPage", mainEntity: view.faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: base }, { "@type": "ListItem", position: 2, name: "리포트", item: `${base}reports/` }, { "@type": "ListItem", position: 3, name: view.meta.title, item: canonical }] },
  ] };
}
