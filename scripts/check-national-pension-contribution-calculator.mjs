import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NP_CONFIG, NP_RATE_PATH, NP_EXAMPLES } from '../src/data/nationalPensionContributionCalculator.ts';
import { validateContributionInput, calculateContributionComparison, buildContributionRatePath, displayAmount, validMonth } from '../public/scripts/national-pension-contribution-calculator.js';
let count = 0;
function test(name, fn) { fn(); count++; console.log(`PASS ${name}`); }
const raw = { ...NP_CONFIG.defaults, amount: '3,000,000' };
const input = overrides => { const v = validateContributionInput({ ...raw, ...overrides }); assert.equal(v.ok, true); return v.value; };
const calc = overrides => calculateContributionComparison(input(overrides), NP_CONFIG.rules, NP_RATE_PATH);
for (const e of NP_EXAMPLES) test(`직장 ${e.basis}원 독립 기대값`, () => {
  const r = calc({ amount: String(e.basis) }); assert.equal(r.ok, true);
  assert.equal(displayAmount(r.value.before.subscriberWon), e.before);
  assert.equal(displayAmount(r.value.after.subscriberWon), e.after);
  assert.equal(displayAmount(r.value.subscriberDeltaWon), e.monthly);
  assert.equal(displayAmount(r.value.monthlyDeltaAnnualizedWon), e.annualized);
});
test('지역 300만원은 전체 부담 및 회사 해당없음', () => {
  const r = calc({subscriber: 'regional'}).value;
  assert.equal(displayAmount(r.before.subscriberWon), 285000); assert.equal(displayAmount(r.after.subscriberWon), 300000);
  assert.equal(r.after.employerWon, null); assert.equal(displayAmount(r.monthlyDeltaAnnualizedWon), 180000);
});
test('요율 경로 2026~2033 및 2033 본인 6.5%', () => {
  const r = buildContributionRatePath(3000000, 'employee', NP_RATE_PATH); assert.equal(r.ok, true);
  assert.equal(r.value.length, 8); assert.deepEqual(r.value.map(x => x.totalRate), [.095,.10,.105,.11,.115,.12,.125,.13]);
  assert.equal(displayAmount(r.value.at(-1).burden.subscriberWon), 195000);
  assert.equal(displayAmount(buildContributionRatePath(3000000, 'regional', NP_RATE_PATH).value.at(-1).burden.subscriberWon), 390000);
});
test('경로 데이터 누락 시 0 또는 이전 요율로 대체하지 않음', () => assert.equal(buildContributionRatePath(3000000, 'employee', NP_RATE_PATH.filter(x => !x.from.startsWith('2030'))).ok, false));
test('소액 요율은 원 미만 유리수 보존', () => {
  const r = calc({amount: '1'}).value; assert.equal(r.after.subscriberWon.num / r.after.subscriberWon.den, .05);
  assert.equal(r.subscriberDeltaWon.num / r.subscriberDeltaWon.den, .0025);
});
test('최대 1억원에서 차액과 12개월 환산 정밀도', () => {
  const r = calc({amount: '100000000'}).value;
  assert.equal(displayAmount(r.subscriberDeltaWon), 250000); assert.equal(displayAmount(r.monthlyDeltaAnnualizedWon), 3000000);
});
for (const amount of ['', '0', '-1', '1.5', '1e6', '3,00,000', 'abc', '100000001', '9007199254740993']) test(`잘못된 금액 ${JSON.stringify(amount)}`, () => assert.equal(validateContributionInput({...raw, amount}).ok, false));
test('잘못된 유형 거부', () => {
  assert.equal(validateContributionInput({...raw, subscriber: 'other'}).ok, false);
  assert.equal(validateContributionInput({...raw, mode: 'other'}).ok, false);
});
test('유효 월 검증', () => { for (const m of ['2027-00','2027-13','2028-01','2027-1','x']) assert.equal(validMonth(m), false); assert.equal(validMonth('2027-12'), true); });
const monthly = {mode: 'monthly_estimate', allowEstimate: true};
test('가정 미확인 월별 추정 차단', () => assert.equal(calc({...monthly, allowEstimate: false}).issue.code, 'NP_ESTIMATE_CONSENT'));
test('월별 참고 추정의 값과 가정 표시', () => {
  const r = calc(monthly); assert.equal(r.ok, true); assert.equal(r.value.assumption, true);
  assert.equal(r.value.before.subscriberWon, 142500); assert.equal(r.value.after.subscriberWon, 150000);
  assert.equal(r.value.monthlyDeltaAnnualizedWon, 90000);
});
test('2027년 7월 미확인 상하한 계산 차단', () => assert.equal(calc({...monthly, afterMonth: '2027-07'}).issue.code, 'NP_BASIS_RULE_UNAVAILABLE'));
test('신고값의 천원 단위·기간별 범위 검증', () => {
  for (const amount of ['3000001','409000','6591000']) assert.equal(calc({...monthly, amount}).issue.code, 'NP_INVALID_REPORTED_BASIS');
});
test('소득 추정만 절사 및 상하한 적용', () => {
  const low = calc({...monthly, inputKind: 'income_estimate', amount: '1'}).value;
  assert.equal(low.after.basisWon, 410000); assert.equal(low.after.subscriberWon, 20500);
  const high = calc({...monthly, inputKind: 'income_estimate', amount: '9000000'}).value;
  assert.equal(high.after.basisWon, 6590000); assert.equal(high.after.subscriberWon, 329500);
});
test('6월·7월 경계의 서로 다른 상한 적용', () => {
  const r = calc({...monthly, inputKind: 'income_estimate', amount: '9000000', beforeMonth: '2026-06', afterMonth: '2026-07'}).value;
  assert.equal(r.before.basisWon, 6370000); assert.equal(r.after.basisWon, 6590000);
});
test('잘못된 월·입력 종류는 사전 검증 차단', () => {
  assert.equal(validateContributionInput({...raw, ...monthly, afterMonth: '2027-13'}).ok, false);
  assert.equal(validateContributionInput({...raw, ...monthly, inputKind: 'other'}).ok, false);
});
test('페이지 추적·광고 비활성 및 설정 JSON 삽입 보호', () => {
  const page = readFileSync(new URL('../src/pages/tools/national-pension-contribution-calculator.astro', import.meta.url), 'utf8');
  assert.match(page, /recordSessions=\{false\}/); assert.match(page, /loadAds=\{false\}/); assert.match(page, /replace\(\/</);
});
console.log(`국민연금 보험료 계산기 ${count}개 검사 통과`);
