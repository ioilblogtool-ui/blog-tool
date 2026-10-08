import type { AgencyRecord, Badge, FanomenonFact, Metric, Source } from "../data/kpopBig4AgencyComparison2026";

const BADGES: Badge[] = ["공식", "참고", "시뮬레이션", "추정"];
const OFFICIAL_PUBLISHERS = /DART|한국거래소|국회|하이브|에스엠|JYP|와이지/;
const AGENCY_IDS = ["hybe", "sm", "jyp", "yg"];

export type Growth = { kind: "pct"; value: number } | { kind: "label"; label: "흑자전환" | "적자전환" | "적자지속" } | null;
export type RankRow = { id: string; shortName: string; value: number; rank: number };

const val = (m: Metric): number | null => (m.status === "available" ? m.value : null);
const round = (n: number, digits: number) => Math.round(n * 10 ** digits) / 10 ** digits;

export function operatingMargin(revenue: Metric, oi: Metric): number | null {
  const r = val(revenue), o = val(oi);
  if (r === null || o === null || r <= 0) return null;
  return round((o / r) * 100, 1);
}

export function growth(curr: Metric, prev: Metric): Growth {
  const c = val(curr), p = val(prev);
  if (c === null || p === null) return null;
  if (p > 0) return c > 0 ? { kind: "pct", value: round(((c - p) / p) * 100, 1) } : { kind: "label", label: "적자전환" };
  if (c > 0) return { kind: "label", label: "흑자전환" };
  return { kind: "label", label: "적자지속" };
}

/** 금액 단위는 백만원. 시가총액(백만원) = 종가 × 발행주식 총수 / 100만 */
export function marketCap(a: AgencyRecord): number | null {
  const price = val(a.market.closePriceWon), shares = val(a.market.sharesOutstanding);
  if (price === null || shares === null) return null;
  return Math.round((price * shares) / 1e6);
}

export function capToSales(a: AgencyRecord): number | null {
  const cap = marketCap(a), rev = val(a.annual.revenue);
  if (cap === null || rev === null || rev <= 0) return null;
  return round(cap / rev, 2);
}

/** PER = 시가총액 / 2025 지배주주 순이익. 적자면 'N/A' */
export function per(a: AgencyRecord): number | "N/A" | null {
  const cap = marketCap(a), ni = val(a.annual.netIncomeOwners);
  if (cap === null || ni === null) return null;
  if (ni <= 0) return "N/A";
  return round(cap / ni, 1);
}

export type RankKey = "marketCap" | "revenue" | "operatingIncome" | "operatingMargin" | "q2OperatingMargin" | "employees" | "totalAssets";

export function metricOf(a: AgencyRecord, key: RankKey): number | null {
  switch (key) {
    case "marketCap": return marketCap(a);
    case "revenue": return val(a.annual.revenue);
    case "operatingIncome": return val(a.annual.operatingIncome);
    case "operatingMargin": return operatingMargin(a.annual.revenue, a.annual.operatingIncome);
    case "q2OperatingMargin": return operatingMargin(a.latestQuarter.revenue, a.latestQuarter.operatingIncome);
    case "employees": return val(a.employees);
    case "totalAssets": return val(a.annual.totalAssets);
  }
}

/** 4개사 값이 모두 있을 때만 순위를 낸다. 시총은 기준일이 모두 같아야 한다. */
export function rankBy(agencies: AgencyRecord[], key: RankKey): RankRow[] | null {
  if (key === "marketCap" && new Set(agencies.map(a => a.market.asOf)).size !== 1) return null;
  const rows = agencies.map(a => ({ id: a.id, shortName: a.shortName, value: metricOf(a, key) }));
  if (rows.some(r => r.value === null)) return null;
  const sorted = [...rows].sort((x, y) => (y.value as number) - (x.value as number));
  return sorted.map(r => ({ ...r, value: r.value as number, rank: sorted.findIndex(s => s.value === r.value) + 1 }));
}

export function top(agencies: AgencyRecord[], key: RankKey): RankRow | null {
  return rankBy(agencies, key)?.[0] ?? null;
}

export function buildBars(agencies: AgencyRecord[], key: RankKey) {
  const values = agencies.map(a => metricOf(a, key));
  const max = Math.max(...values.map(v => (v === null ? 0 : Math.abs(v))), 1);
  return agencies.map((a, i) => {
    const v = values[i];
    return { id: a.id, shortName: a.shortName, value: v, widthPct: v === null || v <= 0 ? 0 : round((v / max) * 100, 1), negative: v !== null && v < 0 };
  });
}

/** 백만원 → 억원 표시 문자열 */
export function formatEok(million: number | null): string {
  if (million === null) return "재확인 필요";
  const n = Math.round(million / 100);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 10000) {
    const jo = Math.floor(abs / 10000), rest = abs % 10000;
    return `${sign}${jo}조${rest ? ` ${rest.toLocaleString("ko-KR")}억` : ""}원`;
  }
  return `${sign}${abs.toLocaleString("ko-KR")}억원`;
}

export function formatJo(n: number | null): string {
  if (n === null) return "재확인 필요";
  return n >= 1e6 ? `약 ${(n / 1e6).toFixed(2)}조원` : `약 ${Math.round(n / 100).toLocaleString("ko-KR")}억원`;
}

const JOSA_GA: Record<string, string> = { HYBE: "가", SM: "이", JYP: "가", YG: "가" };
const JOSA_NEUN: Record<string, string> = { HYBE: "는", SM: "은", JYP: "는", YG: "는" };
export const neun = (shortName: string | undefined) => (shortName ? `${shortName}${JOSA_NEUN[shortName] ?? "는"}` : "집계 중");
/** 회사명 + 주격 조사(이/가) */
export const ga = (shortName: string | undefined) => (shortName ? `${shortName}${JOSA_GA[shortName] ?? "가"}` : "집계 중");

export const formatPct = (n: number | null) => (n === null ? "재확인 필요" : `${n.toFixed(1)}%`);
export const formatGrowth = (g: Growth) => (g === null ? "재확인 필요" : g.kind === "label" ? g.label : `${g.value > 0 ? "+" : ""}${g.value.toFixed(1)}%`);
export const formatPer = (p: number | "N/A" | null) => (p === null ? "재확인 필요" : p === "N/A" ? "적자(N/A)" : `${p.toFixed(1)}배`);

export function validateData(agencies: AgencyRecord[], sources: Source[], facts: FanomenonFact[], publishReady = false): void {
  const errors: string[] = [];
  const sourceIds = new Set(sources.map(s => s.id));
  if (new Set(sources.map(s => s.id)).size !== sources.length) errors.push("출처 id 중복");
  const ids = agencies.map(a => a.id);
  if (ids.length !== 4 || new Set(ids).size !== 4 || !AGENCY_IDS.every(id => ids.includes(id as AgencyRecord["id"]))) errors.push("회사 id는 hybe·sm·jyp·yg 4개여야 합니다");

  const checkMetric = (label: string, m: Metric, opts: { positive?: boolean; integer?: boolean } = {}) => {
    if (m.status === "missing") { if (publishReady) errors.push(`${label}: 공개 상태에서 누락`); return; }
    if (!BADGES.includes(m.badge)) errors.push(`${label}: 허용되지 않은 배지 ${m.badge}`);
    if (!sourceIds.has(m.sourceId)) errors.push(`${label}: 없는 출처 ${m.sourceId}`);
    if (!Number.isFinite(m.value)) errors.push(`${label}: 숫자가 아님`);
    if (opts.integer !== false && !Number.isInteger(m.value)) errors.push(`${label}: 정수가 아님`);
    if (opts.positive && m.value <= 0) errors.push(`${label}: 0 이하`);
    if (m.badge === "공식") {
      const src = sources.find(s => s.id === m.sourceId);
      if (src && !OFFICIAL_PUBLISHERS.test(src.publisher)) errors.push(`${label}: 공식 배지인데 출처가 공시·회사 자료가 아님`);
    }
    if (publishReady && ["매출", "영업이익", "순이익", "총자산", "2Q 매출", "2Q 영업이익", "직원 수"].some(k => label.endsWith(k)) && m.badge !== "공식") errors.push(`${label}: 공개 상태 핵심 수치는 공식이어야 합니다`);
  };

  for (const a of agencies) {
    const p = a.shortName;
    if (a.annual.fiscalYear !== 2025 || a.annual.basis !== "consolidated") errors.push(`${p}: 연간 기준 오류`);
    if (a.latestQuarter.label !== "2026 2Q" || a.latestQuarter.basis !== "consolidated") errors.push(`${p}: 분기 기준 오류`);
    checkMetric(`${p} 매출`, a.annual.revenue, { positive: true });
    checkMetric(`${p} 영업이익`, a.annual.operatingIncome);
    checkMetric(`${p} 순이익`, a.annual.netIncome);
    checkMetric(`${p} 지배주주 순이익`, a.annual.netIncomeOwners);
    checkMetric(`${p} 총자산`, a.annual.totalAssets, { positive: true });
    checkMetric(`${p} 전년 매출`, a.annual.prevRevenue, { positive: true });
    checkMetric(`${p} 전년 영업이익`, a.annual.prevOperatingIncome);
    checkMetric(`${p} 2Q 매출`, a.latestQuarter.revenue, { positive: true });
    checkMetric(`${p} 2Q 영업이익`, a.latestQuarter.operatingIncome);
    checkMetric(`${p} 전년 2Q 매출`, a.latestQuarter.prevYearRevenue, { positive: true });
    checkMetric(`${p} 전년 2Q 영업이익`, a.latestQuarter.prevYearOperatingIncome);
    checkMetric(`${p} 종가`, a.market.closePriceWon, { positive: true });
    checkMetric(`${p} 발행주식`, a.market.sharesOutstanding, { positive: true });
    checkMetric(`${p} 직원 수`, a.employees, { positive: true });
    if (a.market.priceType !== "close") errors.push(`${p}: 종가가 아닌 시세`);
    const segSum = a.segments.reduce((s, x) => s + (val(x.revenue) ?? 0), 0);
    const rev = val(a.annual.revenue);
    if (rev !== null && Math.abs(segSum - rev) > 5) errors.push(`${p}: 매출 구성 합계(${segSum}) ≠ 매출(${rev})`);
    a.segments.forEach(s => checkMetric(`${p} ${s.originalName}`, s.revenue, { positive: true }));
    if (publishReady && a.keyIp.length < 3) errors.push(`${p}: 대표 IP 3개 미만`);
    for (const ip of a.keyIp) if (!sourceIds.has(ip.sourceId) || !ip.verifiedAt) errors.push(`${p} ${ip.name}: 출처·확인일 누락`);
    for (const t of [...a.strengths, ...a.risks]) {
      if (!BADGES.includes(t.badge)) errors.push(`${p}: 강점/리스크 배지 오류`);
      if (t.sourceIds.length === 0 || t.sourceIds.some(id => !sourceIds.has(id))) errors.push(`${p}: 강점/리스크 출처 오류`);
    }
    if (a.latestQuarter.driverNote && a.latestQuarter.driverNote.sourceIds.some(id => !sourceIds.has(id))) errors.push(`${p}: 분기 설명 출처 오류`);
    if (!sourceIds.has(a.overseasShare.sourceId)) errors.push(`${p}: 해외 비중 출처 오류`);
  }
  if (new Set(agencies.map(a => a.market.asOf)).size !== 1) errors.push("시가총액 기준일이 4개사 모두 같아야 합니다");

  for (const f of facts) {
    if (f.kind === "미확인" && f.badge !== null) errors.push(`패노메논 ${f.id}: 미확인 항목에 배지`);
    if (f.kind !== "미확인" && (f.badge === null || !BADGES.includes(f.badge))) errors.push(`패노메논 ${f.id}: 배지 누락`);
    if (f.topic === "economicEffect" && f.badge !== "추정") errors.push(`패노메논 ${f.id}: 경제효과 전망은 추정 배지`);
    if (f.sourceIds.some(id => !sourceIds.has(id))) errors.push(`패노메논 ${f.id}: 없는 출처`);
    if (f.kind !== "미확인" && f.sourceIds.length === 0) errors.push(`패노메논 ${f.id}: 출처 없음`);
  }
  if (errors.length) throw new Error(`4대 기획사 리포트 데이터 오류:\n- ${errors.join("\n- ")}`);
}

/** 순위 서술이 들어가는 intro·FAQ 문장을 데이터에서 생성한다 */
export function buildCopy(agencies: AgencyRecord[], marketAsOf: string) {
  const name = (r: RankRow | null) => ga(r?.shortName);
  const byId = Object.fromEntries(agencies.map(a => [a.id, a]));
  const revRank = rankBy(agencies, "revenue");
  const oiRank = rankBy(agencies, "operatingIncome");
  const marginRank = rankBy(agencies, "operatingMargin");
  const capRank = rankBy(agencies, "marketCap");
  const q2Margin = rankBy(agencies, "q2OperatingMargin");
  const revTop = revRank?.[0] ?? null, oiTop = oiRank?.[0] ?? null, marginTop = marginRank?.[0] ?? null, capTop = capRank?.[0] ?? null;
  const oiLast = oiRank?.[oiRank.length - 1] ?? null;
  const fmtRankList = (rows: RankRow[] | null, fmt: (v: number) => string) => rows ? rows.map(r => `${r.shortName} ${fmt(r.value)}`).join(" > ") : "집계 중";
  const others = revTop ? agencies.filter(a => a.id !== revTop.id).reduce((s, a) => s + (val(a.annual.revenue) ?? 0), 0) : null;
  const ygGrowth = growth(byId.yg.annual.operatingIncome, byId.yg.annual.prevOperatingIncome);
  const jypQ2 = growth(byId.jyp.latestQuarter.operatingIncome, byId.jyp.latestQuarter.prevYearOperatingIncome);
  const differentLeaders = !!revTop && !!oiTop && revTop.id !== oiTop.id;

  const intro = [
    `최근 박진영 대중문화교류위원회 공동위원장이 국정감사에 출석하면서 글로벌 K컬처 축제 ‘패노메논’이 다시 주목받았습니다. 패노메논은 2027년 12월 개최를 목표로 K팝 공연과 팬덤 시상식, K컬처 전시를 묶은 행사이고, 하이브·SM·JYP·YG가 같은 자본금과 의결권을 가진 전담 법인을 만들어 참여한다고 알려졌습니다. 평소 경쟁하는 네 회사가 한 법인에 모였다는 점에서, 이 회사들이 실제로 어느 정도 규모인지 궁금해집니다.`,
    `흔히 ‘4대 기획사’로 묶이지만 네 회사의 규모와 체질은 꽤 다릅니다. 2025년 연결 매출은 ${name(revTop)} ${formatEok(revTop?.value ?? null)}으로 나머지 세 회사 합계(${formatEok(others)})보다 큽니다. 반면 영업이익은 ${name(oiTop)} ${formatEok(oiTop?.value ?? null)}으로 가장 많았고, 영업이익률은 ${name(marginTop)} ${formatPct(marginTop?.value ?? null)}로 가장 높았습니다. YG는 영업이익이 ${formatGrowth(ygGrowth)}했습니다. 무엇을 기준으로 보느냐에 따라 순위가 달라집니다.`,
    `그래서 이 리포트는 시가총액, 매출, 영업이익, 영업이익률을 한 표에 놓고 함께 봅니다. 시가총액은 시장의 기대를, 매출은 사업의 크기를, 영업이익과 이익률은 실제로 남기는 힘을 보여줍니다. 여기에 각 사 사업보고서에 기재된 아티스트와 음반·공연·MD·콘텐츠 같은 매출 구성을 더하면, 회사마다 무엇으로 돈을 벌고 어떤 활동에 실적이 크게 흔들리는지 이해할 수 있습니다.`,
    `비교에는 한계도 있습니다. 실적은 각 회사의 연결 재무제표 기준이라 자회사 실적이 포함되며, 시가총액은 ${marketAsOf} 종가로 직접 계산한 값이라 매일 달라집니다. 분기 실적은 월드투어나 컴백 시기에 따라 크게 출렁이므로 연간 실적과 따로 봐야 합니다. 하이브처럼 레이블이 나뉜 회사는 아티스트가 본사가 아닌 레이블에 속한다는 점도 함께 확인해 주세요. 이 페이지는 투자 권유가 아닌 공개 자료 비교입니다.`,
  ];

  const faq = [
    { question: "한국 4대 기획사는 어디인가요?", answer: "보통 하이브(HYBE), SM엔터테인먼트, JYP엔터테인먼트, YG엔터테인먼트를 가리킵니다. 정부나 거래소가 지정한 공식 분류가 아니라, 상장 엔터테인먼트 회사 가운데 규모와 인지도가 큰 네 곳을 부르는 업계 관용 표현입니다." },
    { question: "HYBE·SM·JYP·YG 중 가장 큰 회사는 어디인가요?", answer: `매출·시가총액·총자산 기준으로는 ${name(revTop)} 가장 큽니다. ${marketAsOf} 종가 기준 시가총액은 ${name(capTop)} ${formatJo(capTop?.value ?? null)}입니다. 다만 2025년 영업이익 기준으로는 ${name(oiTop)} 1위이고 ${neun(oiLast?.shortName)} 4위여서, ‘가장 크다’의 기준을 먼저 정해야 합니다.` },
    { question: "4대 기획사 중 매출이 가장 큰 곳은 어디인가요?", answer: `2025년 연결 매출 기준 ${fmtRankList(revRank, formatEok)} 순입니다. 각 사 2025 사업보고서 수치입니다.` },
    { question: "영업이익률이 가장 높은 기획사는 어디인가요?", answer: `2025년 연간 기준 ${fmtRankList(marginRank, formatPct)} 순입니다. 2026년 2분기만 보면 ${fmtRankList(q2Margin, formatPct)} 순이며, JYP 2분기 영업이익은 전년 같은 분기 대비 ${formatGrowth(jypQ2)}였습니다. 분기 수치는 투어·컴백 시기의 영향을 크게 받습니다.` },
    { question: "HYBE는 왜 시가총액이 큰가요?", answer: `HYBE는 2025년 매출이 ${formatEok(val(byId.hybe.annual.revenue))}으로 가장 크고, 여러 레이블과 팬 플랫폼 위버스, 해외 법인을 함께 운영합니다. 시가총액은 과거 이익보다 앞으로의 기대가 반영된 시장 가격이라, 2025년 영업이익이 4개사 중 ${oiRank?.find(r => r.id === "hybe")?.rank ?? "-"}위였어도 시가총액은 가장 큽니다. 이 설명은 투자 판단이 아닙니다.` },
    { question: "각 기획사의 대표 가수는 누구인가요?", answer: `각 사 2025 사업보고서 기재 기준으로 HYBE 레이블에는 ${byId.hybe.keyIp.slice(0, 4).map(i => i.name).join("·")} 등, SM에는 ${["aespa", "RIIZE", "NCT 127", "EXO"].join("·")} 등, JYP에는 ${byId.jyp.keyIp.slice(0, 4).map(i => i.name).join("·")} 등, YG에는 ${byId.yg.keyIp.slice(0, 3).map(i => i.name).join("·")} 등이 기재돼 있습니다. 개인 활동 계약은 별도일 수 있습니다.` },
    { question: "박진영 패노메논은 무엇인가요?", answer: "패노메논(FANOMENON)은 2027년 12월 서울 창동 서울아레나와 킨텍스 등에서 열 예정인 대형 K컬처 축제입니다. K팝 공연, 팬덤 시상식, K컬처 기업 전시·체험을 결합한 행사로, 박진영 대중문화교류위원회 공동위원장이 추진에 참여하고 있습니다." },
    { question: "패노메논에 왜 4대 기획사가 참여하나요?", answer: "정부와 위원회는 민간 주도로 행사를 운영하기 위해 4대 기획사가 전담 법인을 만들었다고 설명했습니다. 국정감사에서는 특정 회사 특혜라는 지적이 나왔고, 박진영 위원장은 오히려 각 사가 기회손실을 감수한다는 취지로 답했습니다. 이 페이지는 어느 쪽이 맞는지 결론 내리지 않고 제기된 문제와 당사자 설명을 나눠 정리합니다." },
    { question: "4대 기획사가 공동으로 회사를 만든 것이 맞나요?", answer: "2026년 10월 7일 국정감사 관련 보도에 따르면 하이브·SM·YG·JYP가 동일한 자본금과 의결권을 갖는 행사 전담 법인을 설립했습니다. 법인 이름, 자본금 액수, 설립일은 이 페이지 작성 시점까지 확인되지 않았습니다." },
    { question: "패노메논 수익은 JYP가 가져가나요?", answer: "확인된 사실은 JYP가 ‘패노메논’ 상표를 먼저 출원했다는 점이 국정감사에서 지적됐다는 것입니다. 박진영 위원장은 제3자의 선점을 막기 위한 출원이며 JYP에 남는 것이 없다는 취지로 설명했습니다. 전담 법인은 4개사가 동일 지분 구조로 보도됐지만, 수익 배분 방식과 상표권 귀속 변경 여부는 공개되지 않아 결론 내릴 수 없습니다." },
  ];

  return { intro, faq, differentLeaders, revTop, oiTop, marginTop, capTop, oiLast };
}
