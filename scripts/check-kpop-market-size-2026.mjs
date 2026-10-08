import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

// K팝 시장 규모 2026 리포트 — 데이터·산식·공개 게이트·dist HTML 검증
async function loadModule(path) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const data = await loadModule("src/data/kpopMarketSize2026.ts");
const util = await loadModule("src/utils/kpopMarketSize2026.ts");
const big4 = data.KMS_BIG4_ENABLED ? (await loadModule("src/data/kpopBig4AgencyComparison2026.ts")).KB4_AGENCIES : null;
const view = util.buildReportView(data, big4);

// 표시 변환
assert.equal(util.formatValue(1327, "baekeok"), "13조 2,700억원");
assert.equal(util.formatValue(1801.45, "usd-million"), "18억 145만 달러");
assert.equal(util.formatValue(301744, "usd-thousand"), "3억 174만 달러");
assert.equal(util.formatValue(31.7, "usd-billion"), "317억 달러");
assert.equal(util.formatValue(153845, "eok"), "15조 3,845억원");
assert.equal(util.formatValue(1574021, "eok"), "157조 4,021억원");
assert.equal(util.formatValue(837, "million-accounts"), "8억 3,700만 계정");
assert.equal(util.formatEok(7824), "7,824억원");
assert.equal(util.formatEok(20000), "2조원");

// 산식 고정 케이스(원자료 독립 재계산)
const s = data.KMS_SERIES;
assert.equal(util.multiple(s, "music-sales", 2019, 2024).toFixed(2), (1327 / 681).toFixed(2));
assert.equal(view.trend.salesMultiple, "1.95");
assert.equal(view.trend.exportMultiple, "2.38");
assert.equal(view.trend.salesShare, "8.4");
assert.equal(view.trend.exportShare, "12.8");
assert.throws(() => util.share(s, "music-sales", "content-export", 2024));
assert.throws(() => util.share(s, "content-sales", "music-sales", 2024));

// 환율: 해당 연도 연평균만 사용
const fx = data.KMS_FX;
assert.equal(util.convertUsdToKrw(1801.45, "usd-million", 2024, fx).eok, Math.round(1801.45e6 * 1363.98 / 1e8));
assert.equal(util.convertUsdToKrw(1, "usd-million", 2023, fx), null);

// 4사 연동 — DART 원자료(백만원) 독립 재계산
if (big4) {
  const sum = key => big4.reduce((a, r) => a + r.annual[key].value, 0) / 100;
  assert.ok(view.big4, "4사 비교가 렌더되지 않음");
  assert.equal(view.big4.total2025, util.formatEok(sum("revenue")));
  assert.equal(view.big4.ratio, (sum("prevRevenue") / (1327 * 100) * 100).toFixed(1));
  const missing = structuredClone(big4); missing[0].annual.prevRevenue = { status: "missing", value: null, badge: null, sourceId: null, reason: "x" };
  assert.equal(util.big4Total(missing, "prevRevenue"), null);
  const ref = structuredClone(big4); ref[1].annual.revenue.badge = "참고";
  assert.equal(util.big4Total(ref, "revenue"), null);
}

// 검증 규칙 — 잘못된 데이터 거부
const fresh = () => Object.fromEntries(Object.entries(data).filter(([k]) => k.startsWith("KMS_")).map(([k, v]) => [k, structuredClone(v)]));
const reject = mutate => { const d = fresh(); mutate(d); assert.throws(() => util.validateData(d)); };
reject(d => { d.KMS_STATS[0].badge = "확정"; });
reject(d => { d.KMS_STATS.find(x => x.id === "popculture-sales-2024").badge = "공식"; }); // 원문 미확인 출처에 공식 금지
reject(d => { d.KMS_STATS.find(x => x.id === "music-sales-2025").badge = "공식"; });
reject(d => { d.KMS_SERIES[0].points.pop(); });
reject(d => { d.KMS_SERIES[0].points[5].value = 1330; }); // KPI와 시계열 불일치
reject(d => { d.KMS_EFFECTS[0].scopeLabel = "K팝"; });
reject(d => { d.KMS_KPI_IDS = ["music-sales-2024"]; });
reject(d => { d.KMS_SOURCES[0].url = "http://example.com"; });
assert.throws(() => util.fillTokens("{{unknown}}", view.tokens));

// SEO·메타
assert.ok(data.KMS_META.seoTitle.length <= 50);
assert.ok(view.meta.seoDescription.length >= 80 && view.meta.seoDescription.length <= 120, `description ${view.meta.seoDescription.length}자`);
assert.match(view.meta.seoDescription, /13\.3조원/);
assert.equal(view.intro.length, 4);
assert.ok(view.intro.every(p => p.length >= 150));
assert.ok(view.intro.join("").length >= 600);
assert.ok(view.faq.length >= 7);
assert.ok(view.faq.every(f => f.answer.split(/(?<=[.다요])\s/).filter(Boolean).length >= 2), "FAQ 답변 2문장 이상");
const jsonLd = util.buildJsonLd(view, "https://bigyocalc.com/reports/kpop-market-size-2026/");
assert.equal(jsonLd["@graph"][1].mainEntity.length, view.faq.length);

// 공개 게이트(설계 4-3)
if (data.KMS_META.publishReady) {
  const kpis = data.KMS_KPI_IDS.map(id => data.KMS_STATS.find(x => x.id === id));
  assert.ok(kpis.every(k => k.value !== null && ["공식", "참고"].includes(k.badge)), "KPI 값·배지");
  assert.ok(data.KMS_RELATED.length >= 3, "related 3개 이상");
  for (const r of data.KMS_RELATED) assert.ok(fs.existsSync(`src/pages${r.href.replace(/\/$/, "")}.astro`), `관련 페이지 없음 ${r.href}`);
  if (data.KMS_BIG4_ENABLED) assert.ok(view.big4, "4사 연동 활성인데 공식 값 미충족");
}

// dist HTML 검증(빌드 후)
const distPath = "dist/reports/kpop-market-size-2026/index.html";
if (fs.existsSync(distPath)) {
  const html = fs.readFileSync(distPath, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  for (const v of ["13조 2,700억원", "18억 145만 달러", "3억 174만 달러", "317억 달러", "15조 3,845억원"]) assert.ok(text.includes(v), `표시값 없음 ${v}`);
  assert.equal((html.match(/class="kms-bar-fill"/g) ?? []).length, 12, "막대 12개(2시계열 × 2019~2024)");
  assert.ok(text.includes("2025 잠정 +15.8%") && text.includes("2025 잠정 +32.4%"));
  assert.doesNotMatch(text, /K팝 시장\s*[0-9]/);
  assert.doesNotMatch(text, /K팝 전체 수출\s*[0-9]/);
  assert.doesNotMatch(text, /점유율\s*[0-9]/);
  for (const word of ["매수", "매도", "목표주가", "저평가", "고평가", "유망"]) assert.ok(!text.includes(word), `금칙어 ${word}`);
  const shareMentions = text.match(/[^.]{0,30}시장점유율[^.]{0,30}/g) ?? [];
  assert.ok(shareMentions.every(m => /아닙니다|아니라|해석할 수는 없|로만/.test(m)), `시장점유율 단정 표현: ${shareMentions.join(" | ")}`);
  const badges = [...html.matchAll(/class="kms-badge" data-badge="([^"]*)"/g)].map(m => m[1]);
  assert.ok(badges.length > 0 && badges.every(b => ["공식", "참고", "시뮬레이션", "추정"].includes(b)), "배지 4종 외");
  const economy = html.slice(html.indexOf('id="kms-economy"'), html.indexOf('id="kms-sources"'));
  assert.equal((economy.match(/kms-scope-tag">한류 전체/g) ?? []).length, data.KMS_EFFECTS.length);
  for (const r of data.KMS_RELATED) assert.ok(html.includes(`href="${r.href}"`), `related 링크 ${r.href}`);
  assert.ok(html.includes('"@type":"FAQPage"'));
  console.log("dist HTML 검증 통과");
} else {
  console.log("dist 없음 — HTML 검증은 npm run build 후 다시 실행");
}
console.log("K팝 시장 규모 데이터·산식·4사 연동·게이트·SEO 검증 통과");
