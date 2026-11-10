import { validateOverseasEligibility, normalizeProfitLossRows, mergeProfitLossRows, calculateOverseasTax, compareOverseasScenario, createBaselineState } from './overseas-stock-capital-gains-tax-core.js';

export function initOverseasCalculator(root, config) {
  const q = selector => root.querySelector(selector);
  const baseForm = q('[data-os-base-form]'), scenarioForm = q('[data-os-scenario-form]');
  const rowsHost = q('[data-os-rows]'), state = createBaselineState();
  const result = q('[data-os-result]'), scenarioPanel = q('[data-os-scenario-panel]'), scenarioResult = q('[data-os-scenario-result]');
  const mode = q('[data-os-mode]');
  let currentMode = 'aggregate', serial = 0;
  const blankRow = () => ({gain: '', loss: '', cost: '', costKind: 'already_included'});
  const money = n => `${n.toLocaleString('ko-KR')}원`;
  const announce = text => { q('[data-os-status]').textContent = text; };
  const eligibility = () => Object.fromEntries(['asset','residency','standardRate','mixedDomesticTaxableStock','specialTaxAdjustment'].map(key => [key, baseForm.elements.namedItem(key).value]));
  const controls = row => Object.fromEntries(['gain','loss','cost','costKind'].map(key => [key, row.querySelector(`[data-os-key="${key}"]`)]));
  const readRow = row => Object.fromEntries(Object.entries(controls(row)).map(([key, field]) => [key, field.value]));
  const readRows = () => [...rowsHost.querySelectorAll('[data-os-row]')].map(readRow);
  const readScenario = () => readRow(q('[data-os-scenario-row]'));
  const hideScenario = () => { scenarioResult.hidden = true; q('[data-os-scenario-error]').hidden = true; };
  const invalidate = () => {
    state.invalidate(); result.hidden = true; scenarioPanel.hidden = true; hideScenario();
    q('[data-os-error]').hidden = true;
    root.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    announce('조건을 확인한 뒤 기준 세금 계산을 눌러 주세요.');
  };
  function costVisibility(row) {
    const c = controls(row), separate = c.costKind.value === 'separate_eligible_cost';
    row.querySelector('[data-os-cost-wrap]').hidden = !separate;
    c.cost.disabled = !separate;
  }
  function renderRows(rows) {
    rowsHost.replaceChildren();
    rows.forEach((row, i) => {
      const fragment = q('[data-os-row-template]').content.cloneNode(true);
      const fieldset = fragment.querySelector('[data-os-row]');
      fieldset.querySelector('legend').textContent = currentMode === 'aggregate' ? '올해 전체 실현손익' : `계좌 ${i + 1}`;
      const c = controls(fieldset);
      for (const [key, field] of Object.entries(c)) {
        const id = `os-row-${serial++}-${key}`;
        field.id = id; field.name = id; field.value = row[key];
        fieldset.querySelector(`[data-os-label="${key}"]`).htmlFor = id;
      }
      const remove = fieldset.querySelector('[data-os-remove]');
      remove.hidden = currentMode !== 'accounts'; remove.setAttribute('aria-label', `계좌 ${i + 1} 삭제`);
      costVisibility(fieldset); rowsHost.append(fragment);
    });
    q('[data-os-add]').hidden = currentMode !== 'accounts';
    q('[data-os-add]').disabled = rows.length >= config.maxRows;
    q('[data-os-row-count]').textContent = currentMode === 'accounts' ? `${rows.length} / ${config.maxRows}개 계좌 · 공제는 합계에 한 번 적용` : '모든 증권사의 2026 귀속 지원 대상 손익을 합산해 입력하세요.';
  }
  function error(issue, scenario = false) {
    const target = q(scenario ? '[data-os-scenario-error]' : '[data-os-error]');
    target.textContent = issue.message; target.hidden = false;
    if (issue.field) {
      const match = /^row-(\d+)-(\w+)$/.exec(issue.field);
      const row = scenario ? q('[data-os-scenario-row]') : match && rowsHost.querySelectorAll('[data-os-row]')[Number(match[1])];
      const field = row && match && row.querySelector(`[data-os-key="${match[2]}"]`);
      if (field) { field.setAttribute('aria-invalid','true'); field.focus(); }
    }
    announce('계산하지 않았습니다. 입력 안내를 확인해 주세요.');
  }
  function updateEligibility(clear = false) {
    if (clear) {
      currentMode = 'aggregate'; mode.value = 'aggregate'; renderRows([blankRow()]);
      scenarioForm.reset(); costVisibility(q('[data-os-scenario-row]'));
    }
    const eligible = validateOverseasEligibility(eligibility());
    q('[data-os-inputs]').hidden = !eligible.ok;
    q('[data-os-inputs]').disabled = !eligible.ok;
    q('[data-os-eligibility-message]').textContent = eligible.ok ? '일반 계산 대상 확인 완료. 원화 실현손익을 입력하세요.' : eligible.issue.message;
  }
  baseForm.addEventListener('input', event => {
    invalidate();
    const row = event.target.closest('[data-os-row]'); if (row) costVisibility(row);
  });
  baseForm.addEventListener('change', event => {
    invalidate();
    if (event.target.matches('[data-os-eligibility]')) updateEligibility(true);
  });
  mode.addEventListener('change', event => {
    event.stopPropagation(); invalidate();
    const rows = readRows();
    if (mode.value === 'aggregate') {
      const merged = mergeProfitLossRows(rows, config);
      if (!merged.ok) { mode.value = currentMode; error(merged.issue); return; }
      currentMode = 'aggregate'; renderRows([merged.value]); announce('계좌별 내역을 합계 한 행으로 통합했습니다. 다시 계산해 주세요.');
    } else {
      currentMode = 'accounts'; renderRows(rows); announce('기존 합계를 계좌 1로 옮겼습니다. 추가 계좌와 중복 입력하지 마세요.');
    }
  });
  q('[data-os-add]').addEventListener('click', () => {
    const rows = readRows(); if (rows.length >= config.maxRows) return;
    rows.push(blankRow()); invalidate(); renderRows(rows);
    rowsHost.lastElementChild.querySelector('input').focus();
  });
  rowsHost.addEventListener('click', event => {
    const button = event.target.closest('[data-os-remove]'); if (!button) return;
    const all = [...rowsHost.querySelectorAll('[data-os-row]')], index = all.indexOf(button.closest('[data-os-row]'));
    const rows = readRows(); rows.splice(index, 1); invalidate(); renderRows(rows.length ? rows : [blankRow()]);
    announce(`계좌 ${index + 1}을 제외했습니다. 기준 세금을 다시 계산해 주세요.`);
    q('[data-os-add]').focus();
  });
  function addCells(tbody, label, values) {
    const tr = document.createElement('tr'), th = document.createElement('th');
    th.scope = 'row'; th.textContent = label; tr.append(th);
    for (const value of values) { const td = document.createElement('td'); td.textContent = money(value); tr.append(td); }
    tbody.append(tr);
  }
  const breakdown = [ ['실현이익 합계','gainWon'], ['실현손실 · 차감','lossAbsWon'], ['별도 적격 비용 · 차감','separateCostWon'], ['합산 순손익','netGainWon'], ['실제 적용 기본공제','deductionAppliedWon'], ['공제 후 과세표준','taxableBaseWon'], ['국세 · 20% 적용 후 10원 미만 버림','nationalTaxWon'], ['지방소득세 · 2% 적용 후 10원 미만 버림','localTaxWon'], ['예상 총 세액','totalTaxWon'] ];
  baseForm.addEventListener('submit', event => {
    event.preventDefault(); invalidate();
    const eligible = validateOverseasEligibility(eligibility()); if (!eligible.ok) { error(eligible.issue); return; }
    const totals = normalizeProfitLossRows(readRows(), config); if (!totals.ok) { error(totals.issue); return; }
    const calculated = calculateOverseasTax(totals.value, config.rule); if (!calculated.ok) { error(calculated.issue); return; }
    const b = calculated.value;
    q('[data-os-total]').textContent = money(b.totalTaxWon); q('[data-os-taxable]').textContent = money(b.taxableBaseWon);
    q('[data-os-remaining]').textContent = money(b.deductionRemainingWon);
    const body = q('[data-os-breakdown]'); body.replaceChildren();
    for (const [label,key] of breakdown) addCells(body,label,[b[key]]);
    state.accept(totals.value); result.hidden = false; scenarioPanel.hidden = false;
    announce(`기준 예상 총 세액 ${money(b.totalTaxWon)}입니다. 일반 사례의 예상값이며 신고 의무를 판정하지 않습니다.`);
  });
  scenarioForm.addEventListener('input', event => { hideScenario(); costVisibility(q('[data-os-scenario-row]')); event.target.removeAttribute('aria-invalid'); });
  scenarioForm.addEventListener('change', () => { hideScenario(); costVisibility(q('[data-os-scenario-row]')); });
  scenarioForm.addEventListener('submit', event => {
    event.preventDefault(); hideScenario();
    const totals = state.current(); if (!totals) { error({code:'OS_STALE_BASELINE',message:'기준 세금을 먼저 다시 계산하세요.'},true); return; }
    const comparison = compareOverseasScenario(totals, readScenario(), config.rule, config);
    if (!comparison.ok) { error(comparison.issue,true); return; }
    const c = comparison.value, delta = c.taxDeltaWon;
    const text = delta < 0n ? `예상 세금 ${money(-delta)} 감소` : delta > 0n ? `예상 세금 ${money(delta)} 증가` : '현재 조건에서 예상 세금 차이 없음';
    q('[data-os-delta]').textContent = text;
    const body = q('[data-os-comparison]'); body.replaceChildren();
    for (const [label,key] of breakdown) addCells(body,label,[c.before[key],c.after[key],c.after[key]-c.before[key]]);
    scenarioResult.hidden = false; announce(text);
  });
  q('[data-os-clear-scenario]').addEventListener('click', () => { scenarioForm.reset(); costVisibility(q('[data-os-scenario-row]')); hideScenario(); announce('시나리오를 지웠습니다. 기준 세액은 유지합니다.'); });
  q('[data-os-reset]').addEventListener('click', () => {
    baseForm.reset(); scenarioForm.reset(); invalidate(); updateEligibility(true);
    q('[data-os-copy-status]').textContent = ''; q('[data-os-copy-fallback]').hidden = true;
    baseForm.elements.namedItem('asset').focus();
  });
  q('[data-os-copy]').addEventListener('click', async () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href; if (!canonical) return;
    try { await navigator.clipboard.writeText(canonical); q('[data-os-copy-status]').textContent = '입력값 없는 페이지 주소를 복사했습니다.'; }
    catch { const field = q('[data-os-copy-fallback]'); field.value = canonical; field.hidden = false; field.focus(); field.select(); q('[data-os-copy-status]').textContent = '아래 주소를 직접 복사하세요. 입력값은 포함하지 않습니다.'; }
  });
  renderRows([blankRow()]); updateEligibility(); costVisibility(q('[data-os-scenario-row]'));
}
if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-calculator="overseas-stock-capital-gains-tax-calculator"]'), config = document.getElementById('osTaxConfig');
  if (root && config) initOverseasCalculator(root, JSON.parse(config.textContent));
}
