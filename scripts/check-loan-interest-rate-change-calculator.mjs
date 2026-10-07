import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const data=await fs.readFile('src/data/loanInterestRateChangeCalculator.ts','utf8');
const compiled=ts.transpileModule(data,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
assert.equal(compiled.diagnostics?.length??0,0);
const d=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputText).toString('base64'));
const config={defaultInput:d.LIRC_DEFAULT_INPUT,limits:d.LIRC_LIMITS,quickDeltas:d.LIRC_QUICK_DELTAS,presets:d.LIRC_PRESETS,repayOptions:d.LIRC_REPAY_OPTIONS,baseRate:d.LIRC_BASE_RATE};
const script=await fs.readFile('public/scripts/loan-interest-rate-change-calculator.js','utf8');
const marker=script.indexOf('// ---------- bind ----------');assert.ok(marker>0);
// 실제 클로저의 계산 함수를 검사하고 브라우저 이벤트 등록만 제외한다.
const context=vm.createContext({document:{getElementById:id=>id==='lircConfig'?{textContent:JSON.stringify(config)}:null}});
vm.runInContext(script.slice(0,marker)+'globalThis.audit={state,calcSchedule,normalize,computeResult,computeQuickRows};})();',context);
const calc=context.audit;
const fixtures=[
  ['annuity',3.75,1389347,-42899,-15443680],['equalPrincipal',3.75,1770833,-62500,-11281250],['bullet',3.75,937500,-62500,-22500000],
  ['annuity',3.5,1347134,-85112,-30640256],['equalPrincipal',3.5,1708333,-125000,-22562500],['bullet',3.5,875000,-125000,-45000000],
  ['annuity',4.5,1520056,87810,31611616],['equalPrincipal',4.5,1958333,125000,22562500],['bullet',4.5,1125000,125000,45000000],
];
for(const [repay,rate,monthly,diff,total] of fixtures) {
  Object.assign(calc.state,d.LIRC_DEFAULT_INPUT,{repay,rateMode:'target',rateNew:rate});
  const r=calc.computeResult(calc.normalize());assert.equal(Math.round(r.next.monthlyPayment),monthly);assert.equal(Math.round(r.monthlyDiff),diff);assert.equal(Math.round(r.totalInterestDiff),total);
}
for(const repay of ['annuity','equalPrincipal','bullet']) {
  const zero=calc.calcSchedule(300000000,0,360,repay);assert.equal(zero.totalInterest,0);
  const one=calc.calcSchedule(300000000,.04,1,repay);assert.ok(Math.abs(one.totalInterest-1000000)<.01);
}
const schedule=calc.calcSchedule(300000000,.04,360,'equalPrincipal');let interest=0;
for(let i=0;i<360;i++) interest+=(300000000-i*300000000/360)*.04/12;
assert.ok(Math.abs(schedule.totalInterest-interest)<.01);
Object.assign(calc.state,d.LIRC_DEFAULT_INPUT,{rateNow:20,rateDelta:1});assert.equal(calc.normalize().clampedToMax,true);
const quick=calc.computeQuickRows(calc.computeResult(calc.normalize()));assert.ok(quick.find(r=>r.delta===1).clampedToMax);
Object.assign(calc.state,d.LIRC_DEFAULT_INPUT,{rateNow:.5,rateDelta:-1});assert.equal(calc.normalize().rateNewApplied,0);assert.equal(calc.normalize().clampedToZero,true);
assert.ok(d.LIRC_INTRO.length>=5&&d.LIRC_INTRO.join('').length>=800&&d.LIRC_FAQ.length>=6);
console.log('대출금리 검증 통과: 대표 예시 9개·0%·1개월·원금균등 독립 합산·상하한·SEO');
