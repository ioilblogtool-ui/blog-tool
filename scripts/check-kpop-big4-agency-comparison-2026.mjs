import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { KB4_META, KB4_SOURCES, KB4_AGENCIES, KB4_FANOMENON, KB4_RELATED } from '../src/data/kpopBig4AgencyComparison2026.ts';
import { validateData, rankBy, growth, operatingMargin, marketCap, per, buildCopy, formatEok } from '../src/utils/kpopBig4AgencyComparison2026.ts';

validateData(KB4_AGENCIES, KB4_SOURCES, KB4_FANOMENON, KB4_META.publishReady);
const byId = Object.fromEntries(KB4_AGENCIES.map(a => [a.id, a]));
const v = m => m.value;

// 산식 독립 재계산
for (const a of KB4_AGENCIES) {
  const r = v(a.annual.revenue), o = v(a.annual.operatingIncome);
  assert.equal(operatingMargin(a.annual.revenue, a.annual.operatingIncome), Math.round((o / r) * 1000) / 10, `${a.id} 영업이익률`);
  assert.equal(marketCap(a), Math.round(v(a.market.closePriceWon) * v(a.market.sharesOutstanding) / 1e6), `${a.id} 시총`);
  const segSum = a.segments.reduce((s, x) => s + v(x.revenue), 0);
  assert.ok(Math.abs(segSum - r) <= 5, `${a.id} 매출 구성 합계`);
}
// DART 원문 고정 케이스
assert.equal(v(byId.hybe.annual.operatingIncome), 49318);
assert.equal(v(byId.yg.annual.operatingIncome), 71342);
assert.deepEqual(growth(byId.yg.annual.operatingIncome, byId.yg.annual.prevOperatingIncome), { kind: 'label', label: '흑자전환' });
assert.equal(per(byId.hybe), 'N/A');
assert.equal(growth(byId.jyp.latestQuarter.operatingIncome, byId.jyp.latestQuarter.prevYearOperatingIncome).value, -41.4);
assert.equal(formatEok(2649870), '2조 6,499억원');
assert.equal(formatEok(-254385), '-2,544억원');
assert.equal(formatEok(null), '재확인 필요');

// 순위·기준일
assert.equal(new Set(KB4_AGENCIES.map(a => a.market.asOf)).size, 1);
assert.equal(rankBy(KB4_AGENCIES, 'revenue')[0].id, 'hybe');
assert.equal(rankBy(KB4_AGENCIES, 'operatingIncome')[0].id, 'sm');
assert.equal(rankBy(KB4_AGENCIES, 'operatingMargin')[0].id, 'jyp');
const copy = buildCopy(KB4_AGENCIES, KB4_META.marketAsOf);
assert.equal(copy.differentLeaders, true);

// 오류 데이터 거부
for (const mutate of [
  d => { d[0].annual.revenue.value = -1; },
  d => { d[0].annual.revenue.value = 1.5; },
  d => { d[1].id = d[0].id; },
  d => { d[0].annual.operatingIncome.sourceId = 'missing'; },
  d => { d[2].market.asOf = '2026-10-06'; },
  d => { d[3].segments[0].revenue.value += 1000; },
  d => { d[0].annual.revenue.badge = '확정'; },
  d => { d[1].annual.revenue.badge = '참고'; },
]) {
  const copyData = structuredClone(KB4_AGENCIES); mutate(copyData);
  assert.throws(() => validateData(copyData, KB4_SOURCES, KB4_FANOMENON, true));
}
const badFacts = structuredClone(KB4_FANOMENON); badFacts.find(f => f.topic === 'economicEffect').badge = '참고';
assert.throws(() => validateData(KB4_AGENCIES, KB4_SOURCES, badFacts, true));

// 메타·본문
assert.ok(KB4_META.title.length <= 50, 'Title 50자 이내');
assert.ok(KB4_META.description.length >= 80 && KB4_META.description.length <= 120, 'Description 80~120자');
assert.equal(copy.intro.length, 4);
assert.ok(copy.intro.every(p => p.length >= 150));
assert.ok(copy.intro.join('').length >= 600);
assert.ok(copy.faq.length >= 7);
assert.ok(!KB4_META.title.startsWith('패노메논'));
for (const link of KB4_RELATED) assert.ok(existsSync(`src/pages${link.href.slice(0, -1)}.astro`), link.href);

const htmlPath = `dist/reports/${KB4_META.slug}/index.html`;
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(`https://bigyocalc.com/reports/${KB4_META.slug}/`));
  assert.ok(html.includes(`og/reports/${KB4_META.slug}.png`));
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  const graph = jsonLd.find(item => item['@graph'])['@graph'];
  const faqLd = graph.find(item => item['@type'] === 'FAQPage').mainEntity.map(q => q.name);
  assert.deepEqual(faqLd, copy.faq.map(f => f.question));
  for (const q of faqLd) assert.ok(text.includes(q), `화면 FAQ ${q}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'id 중복');
  const badgeTexts = [...html.matchAll(/class="kb4-badge[^"]*">([^<]+)</g)].map(m => m[1].trim());
  assert.ok(badgeTexts.length > 0 && badgeTexts.every(b => ['공식', '참고', '시뮬레이션', '추정'].includes(b)), `배지: ${[...new Set(badgeTexts)]}`);
  for (const word of ['저평가', '고평가', '매수', '매도', '목표주가', '유망']) assert.ok(!text.includes(word), `금칙어 ${word}`);
  const kpi = html.match(/id="kb4-kpi"[\s\S]*?<\/section>/)[0];
  assert.ok(!kpi.includes('2분기'), 'KPI에 분기 값 혼입');
  assert.ok(text.includes('매출 1위와 영업이익 1위는 다른 회사입니다'));
  assert.ok(text.includes('HYBE 레이블'));
  for (const link of KB4_RELATED.slice(0, 2)) {
    const reverse = readFileSync(`dist${link.href}index.html`, 'utf8');
    assert.ok(reverse.includes(`/reports/${KB4_META.slug}/`), `역방향 링크 ${link.href}`);
  }
  console.log('정적 HTML·FAQ 스키마·배지·금칙어·역방향 링크 검증 통과');
}
console.log('DART 수치·산식·순위·기준일·오류 검출·SEO 검증 통과');
