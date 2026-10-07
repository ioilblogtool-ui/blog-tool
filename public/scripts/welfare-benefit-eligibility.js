import {BENEFITS,validateConfig,parseAmount,calculateComparison,restoreState,serializePublicState,buildShareURL} from './welfare-benefit-eligibility-core.js';
const $ = id => document.getElementById(id);
const money = amount => `${amount.toLocaleString('ko-KR')}원`;
const pending = '공식 기준표 확인 후 안내 예정';
const comparisonText = result => result.status==='below'?'기준 이하':result.status==='equal'?'기준 이하 · 기준과 같음':result.status==='above'?'기준 초과':result.status==='unavailable'?pending:result.status==='invalid'?'올바른 금액을 입력하세요':'금액을 입력하면 비교합니다.';
const gapText = result => result.gap===null?'':result.gap>0?`기준까지 ${money(result.gap)} 남음`:result.gap<0?`${money(-result.gap)} 초과`:'차이 0원';
let config,state,timer;
const initialURL=window.__wbeInitialUrl ?? location.href;
delete window.__wbeInitialUrl;
try {
  config=JSON.parse($('wbe-config').textContent);validateConfig(config);
  restore(initialURL);
  $('wbe-amount').addEventListener('input',()=>render());
  $('wbe-amount').addEventListener('blur',()=>{const parsed=parseAmount($('wbe-amount').value,config.limits);if(parsed.status==='valid') $('wbe-amount').value=parsed.amount.toLocaleString('ko-KR');});
  for(const id of ['wbe-year','wbe-hh']) $(id).addEventListener('change',()=>{state.year=Number($('wbe-year').value);state.hh=Number($('wbe-hh').value);render();});
  document.querySelectorAll('[name=wbe-mode]').forEach(input=>input.addEventListener('change',()=>{state.mode=input.value;$('wbe-amount').value='';$('wbe-share-amount').checked=false;render();}));
  $('wbe-reset').addEventListener('click',()=>{state={...config.defaults,amount:'',notice:''};applyState();$('wbe-share-amount').checked=false;$('wbe-notice').hidden=true;$('wbe-copy-fallback').hidden=true;$('wbe-share-status').textContent='입력값을 초기화했습니다.';render();$('wbe-year').focus();});
  $('wbe-copy').addEventListener('click',copyLink);
  $('wbe-share-amount').addEventListener('change',()=>{$('wbe-copy-fallback').hidden=true;$('wbe-share-status').textContent='';});
  window.addEventListener('popstate',()=>{if(location.search!==`?${serializePublicState(state)}` || location.hash.startsWith('#amount=')) restore(location.href);});
} catch(error) {
  $('wbe-config-error').hidden=false;
  document.querySelectorAll('.wbe-inputs input,.wbe-inputs select,#wbe-copy,#wbe-share-amount').forEach(input=>input.disabled=true);
}
function applyState() {
  $('wbe-year').value=String(state.year);$('wbe-hh').value=String(state.hh);
  document.querySelectorAll('[name=wbe-mode]').forEach(input=>input.checked=input.value===state.mode);
  $('wbe-amount').value=state.amount;
}
function restore(url) {
  state=restoreState(url,config);applyState();$('wbe-share-amount').checked=false;
  $('wbe-notice').textContent=state.notice;$('wbe-notice').hidden=!state.notice;
  render();
}
function render() {
  const parsed=parseAmount($('wbe-amount').value,config.limits),result=calculateComparison(config,state,parsed);
  const monthly=state.mode==='monthly';
  $('wbe-error').hidden=parsed.status!=='invalid';
  $('wbe-error').textContent=parsed.status==='invalid'?'0~1,000,000,000원 범위의 정수를 입력하세요. 쉼표는 3자리마다 사용할 수 있습니다.':'';
  $('wbe-amount').setAttribute('aria-invalid',String(parsed.status==='invalid'));
  $('wbe-share-amount').disabled=parsed.status!=='valid';if(parsed.status!=='valid') $('wbe-share-amount').checked=false;
  $('wbe-copy-fallback').hidden=true;$('wbe-share-status').textContent='';
  $('wbe-amount-label').textContent=monthly?'월 소득 (원) · 단순 비교':'월 소득인정액 (원)';
  $('wbe-mode-note').textContent=monthly?'월 소득은 소득인정액이 아닙니다. 재산·자동차·공제 등을 반영하기 전 금액 비교이며 수급 자격을 판정하지 않습니다.':'소득평가액과 재산의 소득환산액을 합한 월 소득인정액을 입력하세요. 재산·자동차·공제 산정은 상세 계산기에서 확인하세요.';
  $('wbe-result-title').textContent=`${state.year}년 · ${state.hh}인 가구 · ${config.modeLabels[state.mode]}`;
  $('wbe-result-note').textContent=`${state.year===2027?'2027년 기준은 2027년 1월 1일부터 적용됩니다. ':''}${monthly?'소득인정액 산정 전 금액 비교입니다. ':''}비교 결과는 시뮬레이션이며 실제 수급 결정이 아닙니다.`;
  $('wbe-median').textContent=result.median.verified?money(result.median.amount):pending;$('wbe-median-badge').textContent=result.median.badge;
  $('wbe-input-caption').textContent=monthly?'입력 월 소득 · 단순 비교':'입력 소득인정액';
  $('wbe-input-value').textContent=parsed.status==='valid'?money(parsed.amount):parsed.status==='invalid'?'입력 오류':'금액을 입력하세요';
  $('wbe-ratio').textContent=result.ratio===null?'—':`${Math.round(result.ratio).toLocaleString('ko-KR')}%`;
  for(const key of BENEFITS) {
    const row=document.querySelector(`[data-benefit="${key}"]`),item=result.benefits[key];row.dataset.status=item.status;
    row.querySelector('[data-threshold]').textContent=item.threshold.verified?money(item.threshold.amount):pending;
    row.querySelector('[data-threshold-badge]').textContent=item.threshold.badge;
    row.querySelector('[data-comparison]').textContent=comparisonText(item);
    row.querySelector('[data-gap]').textContent=item.gap===null?'':`${gapText(item)} · 시뮬레이션${monthly?' · 월 소득 단순 비교':''}`;
    const scale=row.querySelector('.wbe-scale');scale.hidden=!item.threshold.verified||!result.median.verified;
    row.querySelector('[data-limit-marker]').style.width=`${Math.min(100,100*item.threshold.amount/result.median.amount/1.2)}%`;
    const marker=row.querySelector('[data-income-marker]');marker.hidden=result.ratio===null;marker.style.left=`${Math.min(100,(result.ratio??0)/1.2)}%`;
  }
  $('wbe-scale-caption').textContent=`막대: 중위소득 0~120%. 연한 영역은 급여 기준, 진한 선은 내 금액입니다.${result.ratio>120?' 내 금액은 120%를 넘어 막대 끝에 표시합니다. 실제 비율은 위 숫자를 확인하세요.':''}`;
  const tbody=$('wbe-year-rows');tbody.replaceChildren();
  for(const key of BENEFITS) {
    const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=config.benefitLabels[key];tr.append(th);
    for(const year of [2026,2027]) {const item=result.years[year].benefits[key],td=document.createElement('td');td.textContent=item.threshold.verified?`${money(item.threshold.amount)} · ${item.threshold.badge}`:pending;const detail=document.createElement('small');detail.textContent=`${comparisonText(item)}${item.gap===null?'':` · ${gapText(item)} · 시뮬레이션`}`;td.append(detail);tr.append(td);}
    tbody.append(tr);
  }
  const clean=new URL(location.href);clean.search=serializePublicState(state).toString();if(!['#overview','#highlights','#criteria','#faq','#related'].includes(clean.hash)) clean.hash='';history.replaceState(null,'',clean.href);
  clearTimeout(timer);timer=setTimeout(()=>{$('wbe-summary').textContent=parsed.status==='valid'?`${state.year}년 ${state.hh}인 ${config.modeLabels[state.mode]}, 중위소득 대비 ${Math.round(result.ratio)}%. ${BENEFITS.map(key=>`${config.benefitLabels[key]} ${comparisonText(result.benefits[key])}`).join('. ')}`:parsed.status==='empty'?'금액을 입력하면 비교 결과를 확인할 수 있습니다.':'입력 금액을 확인하세요.';},350);
}
async function copyLink() {
  const parsed=parseAmount($('wbe-amount').value,config.limits),link=buildShareURL(location.href,state,parsed,$('wbe-share-amount').checked);
  try {await navigator.clipboard.writeText(link);$('wbe-share-status').textContent=$('wbe-share-amount').checked?'금액을 포함한 링크를 복사했습니다. 공유 대상을 확인하세요.':'금액을 제외한 링크를 복사했습니다.';}
  catch { $('wbe-share-link').value=link;$('wbe-copy-fallback').hidden=false;$('wbe-share-link').focus();$('wbe-share-link').select();$('wbe-share-status').textContent='자동 복사가 지원되지 않습니다. 표시된 링크를 직접 복사하세요.'; }
}
