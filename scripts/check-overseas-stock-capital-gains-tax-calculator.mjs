import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OS_CONFIG, OS_RULE, OS_EXAMPLES} from '../src/data/overseasStockCapitalGainsTaxCalculator.ts';
import {validateOverseasEligibility, parseWon, normalizeProfitLossRows, mergeProfitLossRows, calculateOverseasTax, compareOverseasScenario, createBaselineState} from '../public/scripts/overseas-stock-capital-gains-tax-core.js';
let passed = 0;
function test(label, fn) { fn(); passed++; console.log(`통과: ${label}`); }
const row = (gain='',loss='',cost='',costKind='already_included') => ({gain:String(gain),loss:String(loss),cost:String(cost),costKind});
const totals = rows => {const r=normalizeProfitLossRows(rows,OS_CONFIG); assert.equal(r.ok,true); return r.value;};
const calc = rows => {const r=calculateOverseasTax(totals(rows),OS_RULE); assert.equal(r.ok,true);return r.value;};
const eligible = {asset:'overseas_listed_stock_or_etf',residency:'eligible',standardRate:'yes',mixedDomesticTaxableStock:'no',specialTaxAdjustment:'no'};
test('대상 확인 완료',()=>assert.equal(validateOverseasEligibility(eligible).ok,true));
for (const key of Object.keys(eligible)) test(`미확인 ${key} 차단`,()=>{
  assert.equal(validateOverseasEligibility({...eligible,[key]:'unknown'}).ok,false);
  const e={...eligible};delete e[key];assert.equal(validateOverseasEligibility(e).ok,false);
});
for (const [key,value] of [['asset','domestic_listed_etf'],['asset','other'],['residency','ineligible'],['standardRate','no'],['mixedDomesticTaxableStock','yes'],['specialTaxAdjustment','yes']]) test(`미지원 ${key}:${value}`,()=>assert.equal(validateOverseasEligibility({...eligible,[key]:value}).ok,false));
for (const e of OS_EXAMPLES) test(`독립 기대값 ${e.label}`,()=>{
  const r=calc([row(e.gain,e.loss)]);assert.equal(r.taxableBaseWon,BigInt(e.base)); assert.equal(r.nationalTaxWon,BigInt(e.national)); assert.equal(r.localTaxWon,BigInt(e.local));assert.equal(r.totalTaxWon,BigInt(e.total));
});
test('미반영 적격 비용 100만원',()=>assert.equal(calc([row(10000000,0,1000000,'separate_eligible_cost')]).totalTaxWon,1430000n));
test('이미 반영된 비용은 잔류 입력도 중복 차감하지 않음',()=>assert.equal(calc([row(10000000,0,'bad','already_included')]).totalTaxWon,1650000n));
test('계좌 합산 공제는 한번',()=>assert.equal(calc([row(5000000,0),row(5000000,0)]).totalTaxWon,1650000n));
test('행 순서 무관 및 합계 모드 전환의 경제적 값 보존',()=>{
  const rows=[row(6000000,1000000,100000,'separate_eligible_cost'),row(4000000,2000000),row()];
  const a=calc(rows),b=calc([...rows].reverse());assert.deepEqual(a,b);
  const merged=mergeProfitLossRows(rows,OS_CONFIG);assert.equal(merged.ok,true);assert.deepEqual(calc([merged.value]),a);
});
test('전부 빈칸과 명시적 0 구분',()=>{
  assert.equal(normalizeProfitLossRows([row()],OS_CONFIG).issue.code,'OS_NO_INPUT');
  assert.equal(calc([row('0','')]).totalTaxWon,0n);assert.equal(totals([row(),row('',0)]).activeRows,1);
});
test('비용만 넣으면 손익 입력 요청',()=>assert.equal(normalizeProfitLossRows([row('','',100,'separate_eligible_cost')],OS_CONFIG).ok,false));
for (const invalid of ['-1','1.1','1e6','1,00','abc','1000000000001','9999999999999999999']) test(`금액 검증 ${invalid}`,()=>assert.equal(parseWon(invalid).ok,false));
test('쉼표·공백 정상 정수',()=>assert.equal(parseWon(' 1,000,000 ').value,1000000n));
test('20개 계좌 한도 및 초과 차단',()=>{
  assert.equal(normalizeProfitLossRows(Array.from({length:20},()=>row(1)),OS_CONFIG).ok,true);
  assert.equal(normalizeProfitLossRows(Array.from({length:21},()=>row(1)),OS_CONFIG).issue.code,'OS_TOO_MANY_ROWS');
});
test('1조원 20행도 정수 정밀도 유지',()=>{
  const r=calc(Array.from({length:20},()=>row('1000000000000')));
  assert.equal(r.netGainWon,20000000000000n);assert.equal(r.totalTaxWon,4399999450000n);
});
for (const [gain,base,remaining] of [[2499999,0,1],[2500000,0,0],[2500001,1,0]]) test(`공제 경계 ${gain}`,()=>{
  const r=calc([row(gain)]);assert.equal(r.taxableBaseWon,BigInt(base));assert.equal(r.deductionRemainingWon,BigInt(remaining));
});
test('순손실도 공제 잔여는 250만원 이하, 음수 세금 없음',()=>{
  const r=calc([row(2000000,4000000)]);assert.equal(r.netGainWon,-2000000n);assert.equal(r.deductionRemainingWon,2500000n);assert.equal(r.totalTaxWon,0n);
});
for (const [base,national,local] of [[49,0,0],[50,10,0],[499,90,0],[500,100,10],[999,190,10]]) test(`국세·지방세 개별 10원 절사 경계 ${base}`,()=>{
  const r=calc([row(2500000+base)]);assert.equal(r.nationalTaxWon,BigInt(national));assert.equal(r.localTaxWon,BigInt(local));
});
test('22% 합계 한번 절사와 구분',()=>assert.equal(calc([row(2500499)]).totalTaxWon,90n));
test('시나리오 손실 300만원은 세액 66만원 감소',()=>{
  const r=compareOverseasScenario(totals([row(10000000)]),row(0,3000000),OS_RULE,OS_CONFIG);
  assert.equal(r.ok,true);assert.equal(r.value.taxDeltaWon,-660000n);assert.equal(r.value.after.totalTaxWon,990000n);
});
test('시나리오 이익 증가·0변화·공제 재사용 금지',()=>{
  const t=totals([row(10000000)]);
  assert.equal(compareOverseasScenario(t,row(1000000,0),OS_RULE,OS_CONFIG).value.taxDeltaWon,220000n);
  assert.equal(compareOverseasScenario(t,row(0,0),OS_RULE,OS_CONFIG).value.taxDeltaWon,0n);
  assert.equal(compareOverseasScenario(t,row(),OS_RULE,OS_CONFIG).ok,false);
});
test('규칙 누락·미검증·연도·지방세 기준 혼동 차단',()=>{
  const t=totals([row(10000000)]);
  for (const rule of [null,{...OS_RULE,status:'unknown'},{...OS_RULE,taxYear:2027},{...OS_RULE,localTaxBasis:'national_calculated_tax'},{...OS_RULE,nationalRounding:null},{...OS_RULE,sourceIds:[]}]) assert.equal(calculateOverseasTax(t,rule).issue.code,'OS_TAX_RULE_UNVERIFIED');
});
test('잘못된 내부 합계 차단',()=>assert.equal(calculateOverseasTax({gainWon:-1n,lossAbsWon:0n,separateCostWon:0n},OS_RULE).ok,false));
test('기준 수정 후 오래된 결과 재사용 차단',()=>{
  const state=createBaselineState(),t=totals([row(10000000)]);assert.equal(state.current(),null);
  state.accept(t);assert.deepEqual(state.current(),t);const copy=state.current();copy.gainWon=0n;assert.equal(state.current().gainWon,10000000n);
  state.invalidate();assert.equal(state.current(),null);state.accept(t);assert.deepEqual(state.current(),t);
});
test('빈 상태의 계좌 모드 통합',()=>assert.deepEqual(mergeProfitLossRows([row(),row()],OS_CONFIG).value,row()));
test('잘못된 입력은 통합 시 버리지 않음',()=>assert.equal(mergeProfitLossRows([row('-1')],OS_CONFIG).ok,false));
test('통합 금액이 입력 한도 초과면 계좌 모드 유지 요청',()=>assert.equal(mergeProfitLossRows([row('1000000000000'),row('1')],OS_CONFIG).ok,false));
test('개인 금액의 저장·URL·전송 경로 없음',()=>{
  const js=readFileSync(new URL('../public/scripts/overseas-stock-capital-gains-tax-calculator.js',import.meta.url),'utf8');
  assert.doesNotMatch(js,/localStorage|sessionStorage|URLSearchParams|history\.|location\.|fetch\(|sendBeacon|console\./);
  assert.match(js,/link\[rel="canonical"\]/);
  const page=readFileSync(new URL('../src/pages/tools/overseas-stock-capital-gains-tax-calculator.astro',import.meta.url),'utf8');
  assert.match(page,/recordSessions=\{false\}/);assert.match(page,/loadAds=\{false\}/);assert.match(page,/replace\(\/</);
});
console.log(`해외주식 양도소득세 ${passed}개 검증 통과`);
