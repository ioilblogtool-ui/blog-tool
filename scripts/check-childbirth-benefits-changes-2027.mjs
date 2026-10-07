import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CBC_POLICIES, CBC_POLICY_BY_ID, CBC_SOURCES, CBC_TRANSITION, CBC_HOME_TOTALS, CBC_CTA, CBC_RELATED, CBC_META, CBC_INTRO, CBC_FAQ, formatAmount, validateReportData } from '../src/data/childbirthBenefitsChanges2027.ts';

validateReportData();
const welcome = CBC_POLICY_BY_ID['welcome-grant'];
assert.deepEqual(welcome.amounts.value.map(row => row.amountWon), [10000000, 12000000, 15000000, 15000000, 17000000, 20000000]);
assert.deepEqual(welcome.paymentCycle.value, { kind: 'quarterly', installments: 4 });
assert.ok(welcome.amounts.value.every(row => row.basis === 'total'));
assert.equal(CBC_TRANSITION.previous.value.through, '2027-06-30');
assert.equal(CBC_TRANSITION.next.value.from, '2027-07-01');
assert.equal(CBC_TRANSITION.confirmation.legislation, 'amendmentRequired');
for (const policy of CBC_POLICIES.filter(policy => policy.version === 'proposal-2027')) {
  assert.equal(policy.confirmation.budget, 'proposal');
  assert.equal(policy.confirmation.legislation, 'amendmentRequired');
  assert.ok(!policy.policyStatuses.includes('current'));
  assert.ok(policy.recheckItems.length > 0);
}
assert.deepEqual(CBC_POLICY_BY_ID['basic-child-benefit'].amounts.value.map(row => [row.amountWon, row.cashWon.value, row.voucherWon.value]), [[200000, 100000, 100000], [300000, 150000, 150000]]);
assert.deepEqual(CBC_HOME_TOTALS.value.map(row => row.amountWon), [500000, 600000]);
assert.equal(CBC_POLICY_BY_ID['homecare-extra'].amounts.value[0].cashWon.value, null);
assert.equal(formatAmount(null), '재확인 필요');
assert.equal(formatAmount(0), '0만원');
assert.equal(CBC_POLICY_BY_ID['welcome-grant'].regionalPreference.value, null);
assert.equal(CBC_CTA.supports2027Proposal, false);
assert.ok(!CBC_CTA.label.includes('2027'));
assert.equal(new Set(CBC_RELATED.map(link => link.href)).size, 4);
for (const link of CBC_RELATED) assert.ok(existsSync(`src/pages${link.href.slice(0, -1)}.astro`), link.href);
assert.ok(CBC_META.title.length <= 50);
assert.ok(CBC_META.description.length >= 80 && CBC_META.description.length <= 120);
assert.equal(CBC_INTRO.length, 4);
assert.ok(CBC_INTRO.every(paragraph => paragraph.length >= 150));
assert.ok(CBC_INTRO.join('').length >= 600);
assert.equal(CBC_FAQ.length, 10);
for (const mutate of [
  policies => { policies[0].amounts.value[0].amountWon = -1; },
  policies => { policies[0].amounts.value[0].amountWon = 0.5; },
  policies => { policies[1].id = policies[0].id; },
  policies => { policies[0].sourceIds = ['missing']; },
  policies => { policies[3].applicableBirthDate.value = { from: '2027-07-01', through: '2027-06-30' }; },
  policies => { policies[3].confirmation.budget = 'approved'; },
  policies => { policies[4].amounts.value[0].cashWon.value = 200000; },
]) {
  const copy = structuredClone(CBC_POLICIES); mutate(copy);
  assert.throws(() => validateReportData(copy, CBC_SOURCES));
}
const htmlPath = `dist/reports/${CBC_META.slug}/index.html`;
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(`https://bigyocalc.com/reports/${CBC_META.slug}/`));
  assert.ok(html.includes(`og/reports/${CBC_META.slug}.png`));
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  const graph = jsonLd.find(item => item['@graph'])['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'FAQPage').mainEntity.length, 10);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!html.includes('adsbygoogle.js'));
  for (const link of CBC_RELATED) {
    const reverse = readFileSync(`dist${link.href}index.html`, 'utf8');
    assert.ok(reverse.includes(`/reports/${CBC_META.slug}/`), `역방향 링크 ${link.href}`);
  }
  console.log('정적 HTML·FAQ 스키마·메타·양방향 링크 검증 통과');
}
console.log('정책 발표값·출생일 경계·지급수단·미확인 처리·오류 검출·SEO 검증 통과');
