import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHECKLIST_IDS, createChecklistState, transitionChecklist, summarizeChecklist } from '../public/scripts/2026-year-end-tax-saving-guide.js';
import { YETS_META, YETS_CHECKLIST, YETS_FAQ, YETS_INTRO, YETS_RELATED_LINKS, YETS_SOURCES, YETS_RULES } from '../src/data/yearEndTaxSavingGuide2026.ts';
import { YETC_RULES } from '../src/data/yearEndTaxRefundCalculator.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routeRoot = process.env.YETS_SITE_ROOT || root;
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`통과: ${name}`); };
test('처음 상태는 6개 미확인, 준비 완료 없음', () => {
  const summary = summarizeChecklist(createChecklistState());
  assert.equal(summary.unknown, 6); assert.equal(summary.applicable, 0); assert.equal(summary.ready, 0);
});
test('미확인·비해당 항목은 준비 완료로 바뀌지 않음', () => {
  const state = createChecklistState();
  assert.equal(transitionChecklist(state, 'card', 'preparation', 'ready'), state);
  const excluded = transitionChecklist(state, 'card', 'applicability', 'not_applicable');
  assert.equal(transitionChecklist(excluded, 'card', 'preparation', 'ready'), excluded);
});
test('해당 선택 후 준비 완료, 기존 객체는 보존', () => {
  const original = createChecklistState();
  let state = transitionChecklist(original, 'card', 'applicability', 'applies');
  state = transitionChecklist(state, 'card', 'preparation', 'ready');
  assert.equal(original.card.applicability, 'unknown');
  assert.equal(summarizeChecklist(state).ready, 1); assert.equal(summarizeChecklist(state).applicable, 1);
  assert.match(summarizeChecklist(state).message, /미확인|확인하지 않은/);
});
test('비해당·미확인 전환 시 준비 상태 리셋', () => {
  let state = transitionChecklist(createChecklistState(), 'rent', 'applicability', 'applies');
  state = transitionChecklist(state, 'rent', 'preparation', 'ready');
  for (const value of ['not_applicable', 'unknown']) {
    const next = transitionChecklist(state, 'rent', 'applicability', value);
    assert.equal(next.rent.preparation, 'unchecked'); assert.equal(summarizeChecklist(next).ready, 0);
  }
});
test('모두 비해당은 100%·전체 준비 완료를 표시하지 않음', () => {
  const state = CHECKLIST_IDS.reduce((s, id) => transitionChecklist(s, id, 'applicability', 'not_applicable'), createChecklistState());
  const summary = summarizeChecklist(state);
  assert.equal(summary.unknown, 0); assert.equal(summary.applicable, 0);
  assert.doesNotMatch(summary.message, /100%|준비 완료/);
});
test('모두 준비 완료해도 공제 적용을 확정하지 않음', () => {
  const state = CHECKLIST_IDS.reduce((s, id) => transitionChecklist(transitionChecklist(s, id, 'applicability', 'applies'), id, 'preparation', 'ready'), createChecklistState());
  const summary = summarizeChecklist(state);
  assert.equal(summary.ready, 6); assert.match(summary.message, /적용요건과 증빙/);
  assert.doesNotMatch(summary.message, /승인|공제 확정/);
});
test('초기화는 독립 상태를 반환', () => {
  const first = createChecklistState(); const second = createChecklistState();
  first.card.preparation = 'ready'; assert.equal(second.card.preparation, 'unchecked');
});
test('잘못된 ID·필드·값은 상태를 변경하지 않음', () => {
  const state = createChecklistState();
  for (const args of [['__proto__', 'applicability', 'applies'], ['card', 'anything', 'ready'], ['card', 'applicability', 'other']]) assert.equal(transitionChecklist(state, ...args), state);
});
test('콘텐츠 항목과 클라이언트 ID가 일치하고 출처가 존재', () => {
  assert.deepEqual(YETS_CHECKLIST.map(item => item.id), [...CHECKLIST_IDS]);
  assert.equal(new Set(YETS_CHECKLIST.map(item => item.id)).size, 6);
  const sourceIds = new Set(YETS_SOURCES.map(source => source.id));
  YETS_CHECKLIST.forEach(item => item.sourceIds.forEach(id => assert.ok(sourceIds.has(id))));
});
test('일반 규칙은 기존 엔진의 단일 출처를 참조', () => {
  assert.equal(YETS_RULES.pensionCombinedCap, YETC_RULES.pension.combinedCap);
  assert.equal(YETS_RULES.rentCap, YETC_RULES.rent.cap);
  assert.equal(YETS_RULES.cardThresholdRate, YETC_RULES.card.thresholdRate);
});
test('기존 URL·내부 링크와 충분한 설명·FAQ', () => {
  assert.equal(YETS_META.slug, '2026-year-end-tax-saving-guide');
  assert.ok(YETS_FAQ.length >= 6); assert.ok(YETS_INTRO.length >= 4);
  YETS_INTRO.forEach(paragraph => assert.ok(paragraph.length >= 150));
  YETS_RELATED_LINKS.forEach(link => assert.ok(fs.existsSync(path.join(routeRoot, 'src/pages', link.href.replace(/^\//, '').replace(/\/$/, '') + '.astro')), link.href));
});
test('브라우저 모듈은 체크 상태를 저장·전송하지 않음', () => {
  const client = fs.readFileSync(path.join(root, 'public/scripts/2026-year-end-tax-saving-guide.js'), 'utf8');
  assert.doesNotMatch(client, /localStorage|sessionStorage|indexedDB|URLSearchParams|history\.|location\.|fetch\s*\(|sendBeacon|XMLHttpRequest|innerHTML|eval\s*\(/);
});
test('리포트는 세션 재생·광고·근거 없는 차트를 추가하지 않음', () => {
  const page = fs.readFileSync(path.join(root, 'src/pages/reports/2026-year-end-tax-saving-guide.astro'), 'utf8');
  assert.match(page, /recordSessions=\{false\}/); assert.match(page, /loadAds=\{false\}/);
  assert.doesNotMatch(page, /Chart\.js|window\.Chart|SIMULATION_CASES|누락 1위/);
  assert.match(page, /dateModified: YETS_META.updatedAt/);
});
test('메타 등록은 기존 URL 한 번만 유지', () => {
  const reports = fs.readFileSync(path.join(root, 'src/data/reports.ts'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
  assert.equal(reports.split('slug: "2026-year-end-tax-saving-guide"').length - 1, 1);
  assert.equal(sitemap.split('https://bigyocalc.com/reports/2026-year-end-tax-saving-guide/').length - 1, 1);
  assert.doesNotMatch(sitemap, /year-end-tax-checklist-2026/);
});
console.log(`연말정산 가이드 검증 완료: ${passed}개 사례`);
