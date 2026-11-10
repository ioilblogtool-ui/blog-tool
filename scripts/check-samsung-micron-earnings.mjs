import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

// 기존 TypeScript 런타임을 이용해 별도 테스트 프레임워크 없이 순수 모듈을 검증한다.
async function loadModule(path) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const data = await loadModule("src/data/samsungMicronEarnings2026.ts");
const util = await loadModule("src/utils/samsungMicronEarnings2026.ts");
util.validateReportData(data);

// ─── 1. 이전 2사 잠정 스냅샷이 그대로 재현되는지(스냅샷 보존) ───
const snapshot = util.resolveSnapshot(data.SME_PRELIMINARY_SNAPSHOT_ID, data);
const view = util.buildReportView(snapshot, data);
assert.equal(view.records.length, 2);
assert.equal(view.faq.length, 9);
assert.equal(util.formatPercent(util.calculateMargin(195, 107.4)), "55.1%");
assert.equal(util.formatPercent(util.calculateMargin(54229, 43751)), "80.7%");
assert.equal(util.formatPercent(util.calculateGrowth(54229, 41456).value, 2), "30.81%");
assert.equal(util.formatPercent(util.calculateGrowth(43751, 3654).value, 2), "1,097.35%");
assert.equal(util.calculateMargin(0, 1), null);
assert.equal(util.calculateMargin(null, 1), null);
assert.equal(util.calculateMargin(10, -1), -10);
assert.equal(util.calculateGrowth(1, 0).label, "계산 불가");
assert.equal(util.calculateGrowth(1, -1).label, "흑자 전환");
assert.equal(util.calculateGrowth(-1, -2).label, "적자 축소");
assert.equal(util.calculateGrowth(-3, -2).label, "적자 확대");
assert.equal(util.calculateGrowth(null, 1).label, "계산 불가");
assert.equal(view.rows.find(r => r.label === "매출 전년동기 증감률").cells[0].text, "126.59%");
assert.equal(view.rows.find(r => r.label === "매출 전년동기 증감률").cells[0].badge, "공식");
assert.equal(view.rows.find(r => r.label === "매출 전년동기 증감률").cells[1].badge, "시뮬레이션");
assert.equal(util.formatMoney(view.records[1], view.records[1].revenue), "542.29억 달러");
assert.equal(view.records[0].operatingProfit.value, 107.4);
assert.equal(view.records[0].releaseStatus, "preliminary");
assert.ok(data.SME_SEO_INTRO.every(p => p.length >= 150));
assert.ok(data.SME_SEO_INTRO.join("").length >= 600);
assert.ok(view.meta.seoTitle.length <= 50);
assert.ok(view.meta.seoDescription.length >= 80 && view.meta.seoDescription.length <= 120);

// ─── 2. 활성 3사 스냅샷 (기대값은 공식 발표 금액으로 손계산) ───
const active = util.buildReportView(util.resolveSnapshot(data.SME_ACTIVE_SNAPSHOT_ID, data), data);
assert.deepEqual(active.companies.map(c => c.id), ["samsung", "skhynix", "micron"]);
assert.ok(active.rows.every(row => row.cells.length === 3));
assert.ok(active.records.every(r => r.scope === "consolidated"));
const [ss, hy, mu] = active.records;
assert.equal(ss.recordId, "samsung-2026-q3-consolidated-kifrs-r2");
assert.equal(ss.releaseStatus, "reported");
assert.equal(util.formatMoney(ss, ss.revenue), "195.3조 원");
assert.equal(util.formatMoney(hy, hy.revenue), "104.6155조 원");
assert.equal(util.formatMoney(hy, hy.operatingProfit), "83.3338조 원");
assert.equal(mu.recordId, "micron-2026-q4-consolidated-gaap-r1");
const margin = label => active.kpiGroups.find(g => g.company === label).margin;
assert.equal(util.formatPercent(margin("삼성전자")), "55.0%"); // 107.4 / 195.3
assert.equal(util.formatPercent(margin("SK하이닉스")), "79.7%"); // 83.3338 / 104.6155 = 79.66%
assert.equal(util.formatPercent(margin("마이크론")), "80.7%");
const growthRow = label => active.rows.find(r => r.label === label).cells;
// 삼성 확정: 공식 증감률은 정수만 공개 → 비교 분기로 재계산(시뮬레이션)
assert.equal(growthRow("매출 전분기 증감률")[0].text, "13.88%"); // 195.3 / 171.5 − 1
assert.equal(growthRow("매출 전분기 증감률")[0].badge, "시뮬레이션");
assert.equal(growthRow("영업이익 전분기 증감률")[0].text, "20.01%"); // 107.4 / 89.49 − 1
assert.equal(growthRow("매출 전년동기 증감률")[0].text, "126.93%"); // 195.3 / 86.06 − 1
// SK하이닉스: 발표 32%·38%·328%·632%와 같은 방향·크기
assert.equal(growthRow("매출 전분기 증감률")[1].text, "31.89%"); // 104.6155 / 79.3187 − 1
assert.equal(growthRow("영업이익 전분기 증감률")[1].text, "37.64%"); // 83.3338 / 60.5426 − 1
assert.equal(growthRow("매출 전년동기 증감률")[1].text, "327.89%"); // 104.6155 / 24.4489 − 1 = 327.894%
assert.equal(growthRow("영업이익 전년동기 증감률")[1].text, "632.06%"); // 83.3338 / 11.3834 − 1
// 삼성 DS는 메인 표가 아니라 별도 사업부 표
assert.equal(active.segments.length, 1);
assert.equal(active.segments[0].record.scope, "DS");
assert.equal(util.formatPercent(active.segments[0].margin), "72.4%"); // 106.5 / 147.1
assert.ok(active.faq.some(f => f.question.includes("DS")));
assert.equal(active.faq.length, 9);
assert.match(active.meta.title, /SK하이닉스/);
assert.ok(active.meta.seoTitle.length <= 50);
assert.ok(active.meta.seoDescription.length >= 80 && active.meta.seoDescription.length <= 120);
assert.ok(active.evidence.some(e => e.companyId === "skhynix"));
assert.ok(!active.evidence.some(e => e.title === "사업부별 기여는 확정실적에서 확인")); // 잠정 전용 설명은 활성 스냅샷에서 빠짐

// ─── 3. 잘못된 데이터는 검증에서 거부 ───
const fresh = () => Object.fromEntries(Object.entries(data).filter(([key]) => key.startsWith("SME_")).map(([key, value]) => [key, structuredClone(value)]));
const reject = (mutate) => { const fixture = fresh(); mutate(fixture); assert.throws(() => util.validateReportData(fixture)); };
const idx = (d, id) => d.SME_RECORDS.findIndex(r => r.recordId === id);
reject(d => { d.SME_RECORDS[0].previousQuarterId = d.SME_RECORDS[4].recordId; });
reject(d => { d.SME_RECORDS[0].revenue.sourceId = "missing"; });
reject(d => { d.SME_RECORDS[0].periodStart = "2026-02-30"; });
reject(d => { d.SME_RECORDS[3].weeks = 13; });
reject(d => { d.SME_RECORDS[3].basis = "non-GAAP"; });
reject(d => { d.SME_RECORDS[0].netIncome.value = 0; });
reject(d => { d.SME_RECORDS[0].releaseStatus = "guidance"; });
reject(d => { d.SME_RECORDS[0].revision = 2; });
reject(d => { d.SME_RECORDS[0].operatingProfit.badge = "추정"; });
// T5-09: 삼성 DS를 연결실적 메인 비교에 넣으면 실패
reject(d => { const s = d.SME_SNAPSHOTS.find(x => x.id === d.SME_ACTIVE_SNAPSHOT_ID); s.recordIds[0] = "samsung-2026-q3-ds-kifrs-r1"; });
// 연결실적을 사업부 표에 넣어도 실패
reject(d => { const s = d.SME_SNAPSHOTS.find(x => x.id === d.SME_ACTIVE_SNAPSHOT_ID); s.segmentRecordIds.push("skhynix-2026-q3-consolidated-kifrs-r1"); });
// 같은 회사 두 레코드(잠정 r1 + 확정 r2)를 한 스냅샷에 넣으면 실패
reject(d => { const s = d.SME_SNAPSHOTS.find(x => x.id === d.SME_ACTIVE_SNAPSHOT_ID); s.recordIds.push(d.SME_RECORDS[0].recordId); });
// SK하이닉스 전분기 연결이 어긋나면 실패
reject(d => { d.SME_RECORDS[idx(d, "skhynix-2026-q3-consolidated-kifrs-r1")].previousQuarterId = "skhynix-2025-q3-consolidated-kifrs-r1"; });
// SK하이닉스를 발표 대기로 되돌리면 활성 3사 스냅샷은 실패
reject(d => { d.SME_COMPANIES.find(c => c.id === "skhynix").availability = "pending"; });

// 정정 레코드(r3)를 새 스냅샷에 연결하면 표·카드가 같은 새 값을 쓰고, 기존 스냅샷은 그대로
const fixture = fresh();
const revision = structuredClone(fixture.SME_RECORDS[idx(fixture, "samsung-2026-q3-consolidated-kifrs-r2")]);
revision.recordId = revision.recordId.replace("r2", "r3"); revision.revision = 3; revision.operatingProfit.value = 100;
fixture.SME_RECORDS.push(revision);
const activeSnap = fixture.SME_SNAPSHOTS.find(s => s.id === fixture.SME_ACTIVE_SNAPSHOT_ID);
fixture.SME_SNAPSHOTS.push({ ...structuredClone(activeSnap), id: "corrected", recordIds: [revision.recordId, ...activeSnap.recordIds.slice(1)] });
util.validateReportData(fixture);
assert.equal(util.buildReportView(activeSnap, fixture).records[0].operatingProfit.value, 107.4);
const corrected = util.buildReportView(fixture.SME_SNAPSHOTS.at(-1), fixture);
assert.equal(corrected.records[0].operatingProfit.value, 100);
assert.equal(corrected.kpiGroups[0].cards.find(c => c.key === "operatingProfit").displayValue, "100조 원");

const zero = { status: "available", value: 0, badge: "공식", sourceId: "samsung-kr" };
assert.equal(util.formatMoney(view.records[0], zero), "0조 원");
assert.match(util.formatMoney(view.records[0], view.records[0].netIncome), /미공개/);
const jsonLd = util.buildJsonLd(active, "https://bigyocalc.com/reports/samsung-micron-earnings-2026/");
assert.equal(jsonLd["@graph"][1].mainEntity.length, active.faq.length);
assert.ok(!("datePublished" in jsonLd["@graph"][0]));
assert.equal(jsonLd["@graph"][0].dateModified, "2026-11-10");
console.log("실적 산식·예외·범위·3사 스냅샷·DS 분리·정정 버전·스냅샷 보존·SEO 검증 통과");
