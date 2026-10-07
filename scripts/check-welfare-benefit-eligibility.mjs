import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import * as core from '../public/scripts/welfare-benefit-eligibility-core.js';
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'wbe-check-'));
const files=[];
try {
  for(const name of ['welfareThresholds','welfareBenefitEligibility']) {
    const source=await fs.readFile(`src/data/${name}.ts`,'utf8');
    const result=ts.transpileModule(source,{reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}});
    assert.equal(result.diagnostics?.length??0,0);
    const target=path.join(directory,`${name}.mjs`);files.push(target);
    await fs.writeFile(target,result.outputText.replace("'./welfareThresholds'","'./welfareThresholds.mjs'"));
  }
  const {WELFARE_CONFIG:config}=await import(pathToFileURL(files[0]).href);
  const compat=await import(pathToFileURL(files[1]).href);
  core.validateConfig(config);
  const parsed=core.parseAmount('3,000,000',config.limits),state={year:2027,hh:4,mode:'recognized'};
  const result=core.calculateComparison(config,state,parsed);
  assert.equal(result.median.amount,6929885);assert.equal(Math.round(result.ratio),43);
  assert.deepEqual(core.BENEFITS.map(key=>result.benefits[key].gap),[-782437,-228046,326345,464943]);
  const second=core.calculateComparison(config,state,core.parseAmount('2150000'));
  assert.equal(second.benefits.livelihood.gap,67563);assert.equal(second.years[2026].benefits.livelihood.gap,-71684);
  let boundaryChecks=0;
  for(const year of [2026,2027]) for(let hh=1;hh<=20;hh++) for(const key of core.BENEFITS) {
    const threshold=core.resolveThreshold(config,year,hh,key);
    if(!threshold.verified){assert.deepEqual(core.compareBenefit(parsed,threshold),{status:'unavailable',gap:null});continue;}
    for(const [offset,status,gap] of [[-1,'below',1],[0,'equal',0],[1,'above',-1]]) {assert.deepEqual(core.compareBenefit({status:'valid',amount:threshold.amount+offset},threshold),{status,gap});boundaryChecks++;}
  }
  const rounded=core.calculateComparison(config,state,core.parseAmount('2217564'));assert.equal(Math.round(rounded.ratio),32);assert.equal(rounded.benefits.livelihood.status,'above');
  for(const [year,hh,key,expected] of [[2027,7,'median',10152665],[2027,8,'median',11176129],[2027,9,'median',12199593],[2027,7,'housing',4873279],[2027,8,'housing',5364542],[2027,9,'housing',5855805],[2026,8,'median',10474348]]) assert.equal(core.resolveThreshold(config,year,hh,key).amount,expected);
  for(const input of ['0','3,000,000','1000000000']) assert.equal(core.parseAmount(input).status,'valid');
  for(const input of ['3만원','1e6','1.5','-1','3,00','3 000','1000000001']) assert.equal(core.parseAmount(input).status,'invalid');
  assert.equal(core.parseAmount(' ').status,'empty');assert.equal(core.calculateComparison(config,state,core.parseAmount('0')).ratio,0);
  const expected2026=[[2564238,820556,1025695,1230834,1282119],[4199292,1343773,1679717,2015660,2099646],[5359036,1714892,2143614,2572337,2679518],[6494738,2078316,2597895,3117474,3247369],[7556719,2418150,3022688,3627225,3778360],[8555952,2737905,3422381,4106857,4277976]];
  assert.deepEqual(compat.WBE_2026_THRESHOLDS.map(row=>[row.medianIncome,row.livelihood,row.medical,row.housing,row.education]),expected2026);
  const url='https://bigyocalc.com/tools/welfare-benefit-eligibility/';
  assert.equal(core.buildShareURL(url,state,parsed).includes('amount'),false);
  const shared=core.buildShareURL(url,state,parsed,true);assert.equal(new URL(shared).hash,'#amount=3000000');assert.equal(core.restoreState(shared,config).amount,'3000000');
  assert.equal(core.buildShareURL(url,state,core.parseAmount(''),true).includes('amount'),false);
  assert.equal(core.restoreState(url+'?hh=3&earned=2500000&hasset=50000000',config).year,2026);
  assert.equal(core.restoreState(url+'?hh=3&earned=2500000',config).amount,'');
  for(const query of ['v=2&year=2027&hh=4&mode=recognized&hh=3','v=2&year=2028&hh=4&mode=recognized','v=2&year=2027e0&hh=4&mode=recognized','v=2&year=2027&hh=0&mode=recognized','v=2&year=2027&hh=4&mode=wrong']) assert.match(core.restoreState(url+'?'+query,config).notice,/초기화/);
  assert.equal(core.restoreState(shared.replace('3000000','-1'),config).amount,'');
  assert.equal(core.restoreState(url+'?v=2&year=2027&hh=4&mode=recognized#faq',config).notice,'');
  const broken=structuredClone(config);broken.years[2027].rows[4].medical.sourceId='missing';assert.throws(()=>core.validateConfig(broken));
  assert.ok(compat.WBE_SEO_CONTENT.intro.length>=5);assert.ok(compat.WBE_SEO_CONTENT.intro.join('').length>=800);assert.ok(compat.WBE_FAQ.length>=5);
  console.log(`복지급여 검증 통과: 대표 예시·${boundaryChecks}개 경계값·가산·입력·URL·2026 호환·SEO`);
} finally {
  for(const file of files) await fs.unlink(file);
  await fs.rmdir(directory);
}
