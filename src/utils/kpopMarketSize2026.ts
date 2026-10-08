import type { Badge, MarketStat, Series, SeriesId, Unit, FxRate, EconomicEffect, Source, FaqTemplate, RevenueChannel } from "../data/kpopMarketSize2026";

type ReportData = {
  KMS_META: { slug: string; h1: string; seoTitle: string; seoDescription: string; heroDescription: string; ogImage: string; updatedAt: string; publishedAt: string | null; publishReady: boolean };
  KMS_BIG4_ENABLED: boolean;
  KMS_SOURCES: Source[];
  KMS_STATS: MarketStat[];
  KMS_SERIES: Series[];
  KMS_FX: FxRate[];
  KMS_KPI_IDS: readonly string[];
  KMS_SCOPE_ROW_IDS: readonly string[];
  KMS_OVERSEAS_IDS: readonly string[];
  KMS_GLOBAL_IDS: readonly string[];
  KMS_CHANNELS: RevenueChannel[];
  KMS_EFFECTS: EconomicEffect[];
  KMS_SEO_INTRO: string[];
  KMS_FAQ: FaqTemplate[];
  KMS_BIG4_FAQ_FALLBACK: string;
  KMS_BIG4_FAQ_TEMPLATE: string;
};

// 4대 기획사 데이터(백만원 정수)에서 필요한 최소 형태만 받는다.
type Big4Metric = { status: "available"; value: number; badge: Badge; sourceId: string } | { status: "missing"; value: null; badge: null; sourceId: null };
export type Big4Input = { id: string; shortName: string; annual: { fiscalYear: number; basis: string; revenue: Big4Metric; prevRevenue: Big4Metric } };

const BADGES: Badge[] = ["공식", "참고", "시뮬레이션", "추정"];
const fail = (message: string): never => { throw new Error(`K팝 시장 규모 데이터 오류: ${message}`); };
const num = (n: number, digits = 0) => n.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** 억원 정수 → '157조 4,021억원' / '7,824억원' */
export function formatEok(eok: number): string {
  const sign = eok < 0 ? "-" : "";
  const abs = Math.round(Math.abs(eok));
  const jo = Math.floor(abs / 10000);
  const rest = abs % 10000;
  if (jo === 0) return `${sign}${num(rest)}억원`;
  return `${sign}${num(jo)}조${rest ? ` ${num(rest)}억` : ""}원`;
}

/** 달러 금액 → '18억 145만 달러' / '317억 달러' */
export function formatUsd(dollars: number): string {
  const eok = Math.floor(dollars / 1e8);
  const man = Math.round((dollars - eok * 1e8) / 1e4);
  if (eok === 0) return `${num(man)}만 달러`;
  return `${num(eok)}억${man ? ` ${num(man)}만` : ""} 달러`;
}

export function toDollars(value: number, unit: Unit): number {
  if (unit === "usd-million") return value * 1e6;
  if (unit === "usd-thousand") return value * 1e3;
  if (unit === "usd-billion") return value * 1e9;
  return fail(`달러 단위 아님 ${unit}`);
}

export function formatValue(value: number, unit: Unit): string {
  switch (unit) {
    case "baekeok": return formatEok(value * 100);
    case "eok": return formatEok(value);
    case "usd-million": case "usd-thousand": case "usd-billion": return formatUsd(toDollars(value, unit));
    case "count": return `${num(value)}개`;
    case "person": return `${num(value)}명`;
    case "pct": return `${num(value, 1)}%`;
    case "million-accounts": return `${num(Math.floor(value / 100))}억 ${num((value % 100) * 100)}만 계정`;
    case "rank": return `세계 ${value}위`;
  }
}

export function formatStat(stat: MarketStat): string {
  return stat.value === null ? (stat.missingReason ?? "재확인 필요") : formatValue(stat.value, stat.unit);
}

export const isUsd = (unit: Unit) => unit === "usd-million" || unit === "usd-thousand" || unit === "usd-billion";

/** 해당 통계 연도의 연평균 환율로만 환산. 결과는 억원(시뮬레이션) */
export function convertUsdToKrw(value: number, unit: Unit, year: number, fx: FxRate[]): { eok: number; rate: number } | null {
  const rate = fx.find(f => f.year === year)?.krwPerUsd ?? null;
  if (rate === null) return null;
  return { eok: Math.round(toDollars(value, unit) * rate / 1e8), rate };
}

const seriesById = (series: Series[], id: SeriesId) => series.find(s => s.id === id) ?? fail(`시계열 없음 ${id}`);
const pointValue = (s: Series, year: number) => s.points.find(p => p.year === year)?.value ?? null;

/** 같은 시계열 안에서 두 연도의 배수 */
export function multiple(series: Series[], id: SeriesId, from: number, to: number): number | null {
  const s = seriesById(series, id);
  const a = pointValue(s, from), b = pointValue(s, to);
  return a === null || b === null || a <= 0 ? null : b / a;
}

// 같은 조사·같은 연도의 부분/전체만 비중 계산을 허용한다.
const ALLOWED_SHARE_PAIRS: [SeriesId, SeriesId][] = [["music-sales", "content-sales"], ["music-export", "content-export"]];
export function share(series: Series[], partId: SeriesId, wholeId: SeriesId, year: number): number | null {
  if (!ALLOWED_SHARE_PAIRS.some(([p, w]) => p === partId && w === wholeId)) fail(`허용되지 않은 비중 계산 ${partId}/${wholeId}`);
  const part = seriesById(series, partId), whole = seriesById(series, wholeId);
  if (part.sourceId !== whole.sourceId || part.unit !== whole.unit) fail("비중 계산 출처·단위 불일치");
  const a = pointValue(part, year), b = pointValue(whole, year);
  return a === null || b === null || b <= 0 ? null : a / b * 100;
}

export function buildBars(s: Series) {
  const max = Math.max(...s.points.map(p => p.value));
  return s.points.map(p => ({
    year: p.year,
    value: p.value,
    widthPct: max > 0 ? p.value / max * 100 : 0,
    label: s.unit === "baekeok" ? `${num(p.value / 100, 1)}조원` : `${num(p.value / 100, 1)}억 달러`,
  }));
}

/** 4개사 모두 공식 값일 때만 합계(억원). 결과는 시뮬레이션 */
export function big4Total(agencies: Big4Input[], key: "revenue" | "prevRevenue"): number | null {
  if (agencies.length !== 4) return null;
  const metrics = agencies.map(a => a.annual[key]);
  if (metrics.some(m => m.status !== "available" || m.badge !== "공식")) return null;
  return metrics.reduce((sum, m) => sum + (m.value ?? 0), 0) / 100;
}

/** 4사 연결매출 합계 ÷ 같은 해 국내 음악산업 매출 × 100 (단순 규모 비교) */
export function big4VsMusic(totalEok: number | null, musicSalesBaekeok: number | null): number | null {
  return totalEok === null || musicSalesBaekeok === null || musicSalesBaekeok <= 0 ? null : totalEok / (musicSalesBaekeok * 100) * 100;
}

export function validateData(d: ReportData): void {
  const ids = (xs: { id: string }[]) => { const list = xs.map(x => x.id); if (new Set(list).size !== list.length) fail("ID 중복"); };
  ids(d.KMS_SOURCES); ids(d.KMS_STATS); ids(d.KMS_SERIES); ids(d.KMS_EFFECTS);
  const sources = new Map(d.KMS_SOURCES.map(s => [s.id, s]));
  const stats = new Map(d.KMS_STATS.map(s => [s.id, s]));
  const dateOk = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
  for (const s of d.KMS_SOURCES) {
    if (!s.url.startsWith("https://")) fail(`출처 URL ${s.id}`);
    if (!dateOk(s.publishedAt) || !dateOk(s.checkedAt)) fail(`출처 날짜 ${s.id}`);
  }
  const officialPublisher = /문화체육관광부|한국콘텐츠진흥원|한국국제문화교류진흥원|IFPI|관세청|한국은행|DART/;
  for (const s of d.KMS_STATS) {
    if (s.value === null) {
      if (s.badge !== null || s.sourceId !== null || !s.missingReason) fail(`미확정 값 형식 ${s.id}`);
      continue;
    }
    if (!Number.isFinite(s.value) || s.value < 0) fail(`수치 오류 ${s.id}`);
    if (!s.badge || !BADGES.includes(s.badge)) fail(`배지 오류 ${s.id}`);
    const src = sources.get(s.sourceId ?? "") ?? fail(`출처 없음 ${s.id}`);
    if (s.badge === "공식" && !(src.isPrimary && officialPublisher.test(src.publisher))) fail(`공식 배지에 원문 미확인 출처 ${s.id}`);
    if (s.status === "잠정" && s.badge === "공식" && !(s.notes ?? "").includes("잠정")) fail(`잠정 표기 누락 ${s.id}`);
  }
  for (const list of [d.KMS_KPI_IDS, d.KMS_SCOPE_ROW_IDS, d.KMS_OVERSEAS_IDS, d.KMS_GLOBAL_IDS]) {
    for (const id of list) if (!stats.has(id)) fail(`화면 레코드 없음 ${id}`);
  }
  if (d.KMS_KPI_IDS.length !== 4) fail("KPI는 4개");
  for (const s of d.KMS_SERIES) {
    if (!sources.has(s.sourceId)) fail(`시계열 출처 ${s.id}`);
    const years = s.points.map(p => p.year);
    if (years.join() !== "2019,2020,2021,2022,2023,2024") fail(`시계열 연도 ${s.id}`);
    if (s.points.some(p => !(p.value > 0))) fail(`시계열 값 ${s.id}`);
    if (s.provisional && !sources.has(s.provisional.sourceId)) fail(`잠정 출처 ${s.id}`);
  }
  // 시계열 2024 원표 값과 KPI 값이 같은 발표의 수치인지 확인(반올림 허용 0.1)
  const music2024 = pointValue(seriesById(d.KMS_SERIES, "music-sales"), 2024);
  if (music2024 !== stats.get("music-sales-2024")?.value) fail("음악 매출 시계열·KPI 불일치");
  const export2024 = pointValue(seriesById(d.KMS_SERIES, "music-export"), 2024) ?? 0;
  if (Math.abs(export2024 - (stats.get("music-export-2024")?.value ?? 0)) > 0.1) fail("음악 수출 시계열·KPI 불일치");
  for (const f of d.KMS_FX) if (f.krwPerUsd !== null && (!(f.krwPerUsd > 500 && f.krwPerUsd < 3000) || !f.sourceId || !sources.has(f.sourceId))) fail(`환율 오류 ${f.year}`);
  for (const e of d.KMS_EFFECTS) {
    if (e.scopeLabel !== "한류 전체") fail(`경제효과 범위 ${e.id}`);
    if (!BADGES.includes(e.badge) || !sources.has(e.sourceId)) fail(`경제효과 배지·출처 ${e.id}`);
  }
  for (const c of d.KMS_CHANNELS) if (c.example && !sources.has(c.example.sourceId)) fail(`수익경로 출처 ${c.key}`);
  if (d.KMS_CHANNELS.length !== 10) fail("수익경로는 10개");
}

export function buildBig4(d: ReportData, agencies: Big4Input[] | null) {
  if (!d.KMS_BIG4_ENABLED || !agencies) return null;
  if (agencies.some(a => a.annual.fiscalYear !== 2025 || a.annual.basis !== "consolidated")) fail("4사 기준 연도·연결 기준 불일치");
  const total2025 = big4Total(agencies, "revenue");
  const total2024 = big4Total(agencies, "prevRevenue");
  const music2024 = d.KMS_STATS.find(s => s.id === "music-sales-2024")?.value ?? null;
  const ratio = big4VsMusic(total2024, music2024);
  if (total2025 === null || total2024 === null || ratio === null) return null;
  return {
    rows: agencies.map(a => ({ id: a.id, name: a.shortName, revenue2025: formatEok((a.annual.revenue.value ?? 0) / 100), revenue2024: formatEok((a.annual.prevRevenue.value ?? 0) / 100) })),
    total2025: formatEok(total2025),
    total2024: formatEok(total2024),
    ratio: num(ratio, 1),
    ratioValue: ratio,
  };
}

export function buildTokens(d: ReportData, big4: ReturnType<typeof buildBig4> = null): Record<string, string> {
  const stat = (id: string) => d.KMS_STATS.find(s => s.id === id) ?? fail(`토큰 레코드 없음 ${id}`);
  const salesMultiple = multiple(d.KMS_SERIES, "music-sales", 2019, 2024);
  const exportMultiple = multiple(d.KMS_SERIES, "music-export", 2019, 2024);
  const musicSales = stat("music-sales-2024").value ?? 0;
  const musicExport = stat("music-export-2024").value ?? 0;
  return {
    musicSales2024: formatStat(stat("music-sales-2024")),
    musicSalesShort: `${num(musicSales / 100, 1)}조원`,
    musicSales2019: formatValue(pointValue(seriesById(d.KMS_SERIES, "music-sales"), 2019) ?? 0, "baekeok"),
    musicExport2024: formatStat(stat("music-export-2024")),
    musicExportShort: `${num(Math.floor(musicExport / 100))}억 달러`,
    popculture2024: formatStat(stat("popculture-sales-2024")),
    agencyDomestic2024: formatStat(stat("agency-domestic-2024")),
    agencyOverseas2024: formatStat(stat("agency-overseas-2024")),
    albumExport2025: formatStat(stat("album-export-2025")),
    globalRecorded: formatStat(stat("global-recorded-2025")),
    salesMultiple: salesMultiple === null ? "-" : num(salesMultiple, 2),
    exportMultiple: exportMultiple === null ? "-" : num(exportMultiple, 2),
    big4FaqAnswer: big4
      ? d.KMS_BIG4_FAQ_TEMPLATE.replace("{{big4Total2025}}", big4.total2025).replace("{{big4Total2024}}", big4.total2024).replace("{{big4Ratio2024}}", big4.ratio)
      : d.KMS_BIG4_FAQ_FALLBACK,
  };
}

export function fillTokens(text: string, tokens: Record<string, string>): string {
  const out = text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => tokens[key] ?? fail(`알 수 없는 토큰 ${key}`));
  if (out.includes("{{")) fail("치환되지 않은 토큰");
  return out;
}

export function buildReportView(d: ReportData, agencies: Big4Input[] | null = null) {
  validateData(d);
  const big4 = buildBig4(d, agencies);
  const tokens = buildTokens(d, big4);
  const stat = (id: string) => d.KMS_STATS.find(s => s.id === id)!;
  const sourceOf = (id: string | null) => (id ? d.KMS_SOURCES.find(s => s.id === id) ?? null : null);
  const krwOf = (s: MarketStat) => (s.value !== null && isUsd(s.unit) ? convertUsdToKrw(s.value, s.unit, s.year, d.KMS_FX) : null);
  const card = (id: string) => {
    const s = stat(id);
    const krw = krwOf(s);
    return { stat: s, display: formatStat(s), source: sourceOf(s.sourceId), krw: krw && { display: `약 ${formatEok(krw.eok)}`, rate: num(krw.rate, 2), year: s.year } };
  };
  const musicSales = seriesById(d.KMS_SERIES, "music-sales");
  const musicExport = seriesById(d.KMS_SERIES, "music-export");
  return {
    meta: { ...d.KMS_META, seoDescription: fillTokens(d.KMS_META.seoDescription, tokens) },
    kpis: d.KMS_KPI_IDS.map(card),
    scopeRows: d.KMS_SCOPE_ROW_IDS.map(card),
    overseas: d.KMS_OVERSEAS_IDS.map(card),
    global: d.KMS_GLOBAL_IDS.map(card),
    koreaRank: card("korea-rank-2025"),
    content2024: card("content-sales-2024"),
    musicBiz: card("music-biz-2024"),
    musicWorkers: card("music-workers-2024"),
    trend: {
      sales: { series: musicSales, bars: buildBars(musicSales) },
      export: { series: musicExport, bars: buildBars(musicExport) },
      salesMultiple: tokens.salesMultiple,
      exportMultiple: tokens.exportMultiple,
      salesShare: num(share(d.KMS_SERIES, "music-sales", "content-sales", 2024) ?? 0, 1),
      exportShare: num(share(d.KMS_SERIES, "music-export", "content-export", 2024) ?? 0, 1),
    },
    effects: d.KMS_EFFECTS.map(e => ({ ...e, display: formatEffect(e), source: sourceOf(e.sourceId) })),
    intro: d.KMS_SEO_INTRO.map(p => fillTokens(p, tokens)),
    faq: d.KMS_FAQ.map(f => ({ question: f.question, answer: fillTokens(f.answer, tokens) })),
    big4,
    tokens,
  };
}

export function formatEffect(e: EconomicEffect): string {
  switch (e.unit) {
    case "eok": return formatEok(e.value);
    case "jo": return `${num(e.value, 2)}조원`;
    case "usd-hundred-million": return `${num(e.value, 2)}억 달러`;
    case "usd-billion": return formatUsd(e.value * 1e9);
    case "person": return `${num(e.value)}명`;
  }
}

export function buildJsonLd(view: ReturnType<typeof buildReportView>, canonical: string) {
  const base = new URL("/", canonical).href;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: view.meta.h1, description: view.meta.seoDescription, dateModified: view.meta.updatedAt, ...(view.meta.publishedAt ? { datePublished: view.meta.publishedAt } : {}), mainEntityOfPage: canonical, author: { "@type": "Organization", name: "비교계산소" } },
    { "@type": "FAQPage", mainEntity: view.faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "홈", item: base }, { "@type": "ListItem", position: 2, name: "리포트", item: `${base}reports/` }, { "@type": "ListItem", position: 3, name: view.meta.h1, item: canonical }] },
  ] };
}
