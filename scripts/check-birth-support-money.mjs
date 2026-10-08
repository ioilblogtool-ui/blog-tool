// 2027 출산지원금 계산기 자동 검증 (설계서 9-3)
// 실행: node scripts/check-birth-support-money.mjs
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import * as core from "../public/scripts/birth-support-money-core.js";

const directory = await fs.mkdtemp(path.join(os.tmpdir(), "bsm-check-"));
let checks = 0;
const ok = () => { checks += 1; };

try {
  const source = await fs.readFile("src/data/birthSupportMoney.ts", "utf8");
  const result = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  assert.equal(result.diagnostics?.length ?? 0, 0);
  const target = path.join(directory, "birthSupportMoney.mjs");
  await fs.writeFile(target, result.outputText);
  const data = await import(pathToFileURL(target).href);
  const config = data.BSM_CONFIG;

  // 1. 설정 검증
  core.validateConfig(config); ok();

  // 2. 대표 시나리오
  for (const scenario of data.BSM_SCENARIOS) {
    const state = { ...core.DEFAULT_STATE, ...scenario.input, period: 24 };
    const r = core.calculate(config, state);
    assert.equal(r.system, scenario.system, `${scenario.id} system`);
    assert.equal(r.birthSupport, scenario.birthSupport, `${scenario.id} birthSupport`);
    assert.equal(r.total12, scenario.total12, `${scenario.id} total12`);
    assert.equal(r.total24, scenario.total24, `${scenario.id} total24`);
    assert.equal(r.badge24, scenario.badge, `${scenario.id} badge`);
    ok();
  }

  // 3. 장기 참고 (복지부 예시 1,280만원)
  const longBase = { ...core.DEFAULT_STATE, order: 1, tier: "capital", preferred: "no", care: "home" };
  const longCurrent = core.calculateLongTerm(config, { ...longBase, birthDate: "2027-06-30" });
  const longReform = core.calculateLongTerm(config, { ...longBase, birthDate: "2027-07-01" });
  assert.equal(longCurrent.totalPeriod, data.BSM_LONG_TERM_CHECK.current);
  assert.equal(longReform.totalPeriod, data.BSM_LONG_TERM_CHECK.reform2027);
  assert.equal(longReform.totalPeriod - longCurrent.totalPeriod, data.BSM_LONG_TERM_CHECK.diff);
  assert.equal(longReform.badge, "추정");
  ok();

  // 4. 경계값
  const range = config.birthDateRange;
  assert.equal(core.resolveSystem("2027-06-30", config.reformCutoff), "current");
  assert.equal(core.resolveSystem("2027-07-01", config.reformCutoff), "reform2027");
  assert.equal(core.parseBirthDate("2026-01-01", range).status, "valid");
  assert.equal(core.parseBirthDate("2028-12-31", range).status, "valid");
  assert.equal(core.parseBirthDate("2025-12-31", range).status, "outOfRange");
  assert.equal(core.parseBirthDate("2029-01-01", range).status, "outOfRange");
  assert.equal(core.parseBirthDate("", range).status, "empty");
  assert.equal(core.parseBirthDate("2027-02-30", range).status, "invalid");
  assert.equal(core.parseBirthDate("2028-02-29", range).status, "valid");
  assert.equal(core.parseBirthDate("abc", range).status, "invalid");
  ok();

  const s = (extra) => ({ ...core.DEFAULT_STATE, ...extra });
  assert.equal(core.calculate(config, s({ birthDate: "2027-06-30", order: 3 })).birthSupport, 3000000);
  const unknown = core.calculate(config, s({ birthDate: "2027-07-01", preferred: "unknown" }));
  assert.equal(unknown.preferred, false);
  assert.equal(unknown.preferredVariant.total12 - unknown.total12, 6200000);
  assert.equal(unknown.preferredVariant.total24 - unknown.total24, 7400000);
  const switchRows = core.calculate(config, s({ birthDate: "2027-07-01", care: "switch12" })).rows;
  assert.equal(switchRows[11].items.homeCare, 300000);
  assert.equal(switchRows[12].items.homeCare, 0);
  const daycareRows = core.calculate(config, s({ birthDate: "2027-06-30", care: "daycare" })).rows;
  assert.equal(daycareRows[0].items.parentBenefit, 460000);
  assert.equal(daycareRows[12].items.parentBenefit, 25000);
  assert.equal(core.calculate(config, s({ birthDate: "2027-07-01", period: 12 })).rows.length, 12);
  const third = core.calculate(config, s({ birthDate: "2027-07-01", order: 3 })).rows;
  assert.deepEqual([0, 3, 6, 9].map((m) => third[m].items.welcomeGrant), [3750000, 3750000, 3750000, 3750000]);
  assert.equal(core.resolveTotalBadge({ system: "current", birthDate: "2026-05-01", care: "home" }), "시뮬레이션");
  assert.equal(core.resolveTotalBadge({ kind: "diff" }), "추정");
  const opposite = core.calculateOpposite(config, s({ birthDate: "2027-06-30" }));
  assert.equal(opposite.system, "reform2027");
  assert.equal(opposite.total24, 22000000);
  ok();

  // 5. URL 상태
  const localCodes = data.BSM_LOCAL_RULES.map((rule) => rule.regionCode);
  const parse = (query) => core.parseUrlState(new URLSearchParams(query), config, localCodes);
  const v2 = parse("v=2&bd=2027-07-01&order=2&tier=nonCapital&pref=unknown&care=switch12&period=156&local=seoul-gangdong");
  assert.deepEqual(v2.state, { birthDate: "2027-07-01", order: 2, tier: "nonCapital", preferred: "unknown", care: "switch12", period: 156, local: "seoul-gangdong" });
  assert.deepEqual(v2.notices, []);
  const bad = parse("bd=2030-01-01&order=9&tier=x&pref=maybe&care=x&period=95&local=mars");
  assert.deepEqual(bad.state, { ...core.DEFAULT_STATE });
  assert.ok(bad.notices.includes("invalid") && bad.notices.includes("invalidDate"));
  const legacy = parse("birthDate=2026-05-01&region=seoul-gangdong&order=1&multiple=twins&childcare=daycare&months=95");
  assert.equal(legacy.state.birthDate, "2026-05-01");
  assert.equal(legacy.state.local, "seoul-gangdong");
  assert.equal(legacy.state.care, "daycare");
  assert.equal(legacy.state.period, 24);
  assert.ok(legacy.notices.includes("legacyMonths"));
  assert.equal(parse("region=local-example").state.local, "none");
  assert.deepEqual(core.serializeState(v2.state), { v: "2", bd: "2027-07-01", order: "2", tier: "nonCapital", pref: "unknown", care: "switch12", period: "156", local: "seoul-gangdong" });
  assert.equal("bd" in core.serializeState(core.DEFAULT_STATE), false);
  ok();

  // 6. 배지 4종 외 문자열 금지 / 7. 콘텐츠 기준 / 8. 금지 표현 / 9. 메타 길이
  const files = [
    "src/data/birthSupportMoney.ts",
    "public/scripts/birth-support-money-core.js",
    "public/scripts/birth-support-money.js",
    "src/pages/tools/birth-support-money.astro",
  ];
  const texts = await Promise.all(files.map((file) => fs.readFile(file, "utf8")));
  texts.forEach((text, i) => {
    assert.ok(!text.includes("확인 필요\""), `${files[i]}: '확인 필요' 배지 리터럴`);
    for (const phrase of ["무조건 지급", "확정 시행", "2027년생 전체 적용", "7월에 낳으면", "이득"]) {
      assert.ok(!text.includes(phrase), `${files[i]}: 금지 표현 '${phrase}'`);
    }
  });
  ok();

  assert.ok(data.BSM_INTRO.length >= 4);
  data.BSM_INTRO.forEach((p, i) => assert.ok(p.length >= 150, `intro ${i + 1} ${p.length}자`));
  assert.ok(data.BSM_INTRO.join("").length >= 600);
  assert.ok(data.BSM_FAQ.length >= 8);
  data.BSM_FAQ.forEach((f) => assert.ok(f.answer.split(/[.?]\s|[.?]$/).filter(Boolean).length >= 2, `FAQ 답변 2문장: ${f.question}`));
  assert.ok(data.BSM_RELATED_LINKS.length >= 4 && data.BSM_RELATED_LINKS.length <= 5);
  for (const link of data.BSM_RELATED_LINKS) {
    const [, kind, slug] = link.href.split("/");
    await fs.access(`src/pages/${kind}/${slug}.astro`);
  }
  assert.ok(data.BSM_META.title.length <= 50, `title ${data.BSM_META.title.length}자`);
  assert.ok(data.BSM_META.description.length >= 80 && data.BSM_META.description.length <= 120, `description ${data.BSM_META.description.length}자`);
  ok();

  console.log(`birth-support-money 검증 통과: ${checks}개 그룹`);
} finally {
  await fs.rm(directory, { recursive: true, force: true });
}
