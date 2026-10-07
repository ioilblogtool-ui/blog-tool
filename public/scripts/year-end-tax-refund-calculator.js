// 계산 함수는 DOM과 분리해 브라우저와 Node 검증에서 동일하게 사용한다.
export function parseValue(field, raw, rules) {
  if (field.type === 'checkbox') return { value: raw === true };
  if (field.type === 'select') {
    return field.options.some(option => option.value === raw)
      ? { value: raw } : { error: '선택값을 다시 확인하세요.' };
  }
  const text = String(raw ?? '').trim().replace(/,/g, '');
  if (!text && field.key === 'withheldTax') return { value: null };
  if (!text) return { error: '금액 또는 인원을 입력하세요. 없으면 0을 입력하세요.' };
  const value = Number(text);
  const maximum = field.type === 'count' ? rules.maxPeople : rules.maxMoney;
  if (!/^\d+$/.test(text) || !Number.isSafeInteger(value) || value < (field.min ?? 0) || value > maximum) {
    return { error: field.type === 'count' ? '허용 범위의 정수 인원을 입력하세요.' : '0 이상 100억원 이하의 원 단위 정수를 입력하세요.' };
  }
  return { value };
}

export function validateInput(state, fields, rules) {
  const errors = {};
  for (const field of fields) {
    const parsed = parseValue(field, state[field.key], rules);
    if (parsed.error) errors[field.key] = parsed.error;
  }
  for (const key of ['children', 'cardLimitChildren']) {
    if (state[key] > state.dependents - 1) errors[key] = '본인을 제외한 기본공제 가족 수를 넘을 수 없어요.';
  }
  for (const key of ['elderlyDependents', 'disabledDependents']) {
    if (state[key] > state.dependents) errors[key] = '본인 포함 기본공제 가족 수를 넘을 수 없어요.';
  }
  return errors;
}

export function restoreState(params, defaults, fields, rules) {
  const state = { ...defaults };
  const warnings = [];
  const legacy = params.get('v') !== '2';
  for (const field of fields) {
    if (!params.has(field.url)) continue;
    const raw = params.get(field.url);
    if (field.type === 'checkbox' && raw !== '0' && raw !== '1') {
      warnings.push(field.label + '의 공유값을 복원하지 않았어요.');
      continue;
    }
    const parsed = parseValue(field, field.type === 'checkbox' ? raw === '1' : raw, rules);
    if (parsed.error) warnings.push(field.label + '의 공유값을 복원하지 않았어요.');
    else state[field.key] = parsed.value;
  }
  if (legacy && state.withheldTax === 0) {
    state.withheldTax = null;
    warnings.push('구버전 링크의 기납부 0원은 미입력으로 복원했어요. 실제 0원이면 다시 입력하세요.');
  }
  if (legacy && params.has('don')) warnings.push('구버전 기부금 지출액은 복원하지 않았어요. 산정 완료 일반 기부금 세액공제액을 다시 입력하세요.');
  if (legacy && (state.monthlyRent || state.housingSubscription || state.mortgageRepayment)) {
    warnings.push('구버전 링크의 주택·월세 요건은 다시 확인하세요.');
  }
  if (legacy && state.educationExpense) warnings.push('교육비가 대상자별 한도를 반영한 공제대상액인지 확인하세요.');
  return { state, warnings };
}

export function serializeState(state, fields) {
  const params = new URLSearchParams({ v: '2' });
  for (const field of fields) {
    const value = state[field.key];
    if (value === null) continue;
    params.set(field.url, field.type === 'checkbox' ? (value ? '1' : '0') : String(value));
  }
  return params;
}

export function createCalculator(rules) {
  const floor = value => Math.floor(value + 1e-7);
  const positive = value => Math.max(0, value);
  function calcLaborDeduction(salary) {
    const bracket = rules.laborDeduction.find(row => salary <= row.max) ?? rules.laborDeduction.at(-1);
    return floor(Math.min(bracket.fixed + (salary - bracket.from) * bracket.rate, rules.laborDeductionCap));
  }
  function calcIncomeTax(base) {
    const bracket = rules.taxBrackets.find(row => base <= row.max) ?? rules.taxBrackets.at(-1);
    return floor(positive(base * bracket.rate - bracket.deduction));
  }
  function calcLaborTaxCredit(salary, tax) {
    const rule = rules.laborCredit;
    const row = rule.caps.find(item => salary <= item.max) ?? rule.caps.at(-1);
    const cap = Math.max(row.floor, row.cap - (salary - row.from) * row.reduction);
    const raw = tax <= rule.taxBoundary ? tax * rule.lowRate : rule.fixed + (tax - rule.taxBoundary) * rule.highRate;
    return floor(Math.min(cap, raw));
  }
  function calcCardDeduction(s) {
    const c = rules.card;
    const low = s.grossSalary <= c.salaryBoundary;
    const culture = low ? s.cultureSportsAmount + s.cultureDebitAmount : 0;
    const credit = s.creditCardAmount + (low ? 0 : s.cultureSportsAmount);
    const debit = s.debitCashAmount + (low ? 0 : s.cultureDebitAmount);
    const special = s.traditionalMarketAmount + s.publicTransportAmount;
    const total = credit + debit + culture + special;
    const threshold = s.grossSalary * c.thresholdRate;
    // 법 제126조의2제2항제6호: 15% → 30%(문화 포함) → 40% 순서 차감.
    const creditUsed = Math.min(threshold, credit);
    const debitUsed = Math.min(positive(threshold - creditUsed), debit + culture);
    const specialUsed = Math.min(positive(threshold - creditUsed - debitUsed), special);
    const thresholdDeduction = creditUsed * c.creditRate + debitUsed * c.debitRate + specialUsed * c.specialRate;
    const specialRaw = special * c.specialRate + culture * c.debitRate;
    const raw = positive(credit * c.creditRate + debit * c.debitRate + specialRaw - thresholdDeduction);
    const baseCap = (low ? c.lowCaps : c.highCaps)[Math.min(s.cardLimitChildren, 2)];
    const extra = Math.min(positive(raw - baseCap), specialRaw, low ? c.extraLowCap : c.extraHighCap);
    return { total, threshold, remaining: positive(threshold - total), raw, thresholdDeduction,
      baseCap, extra: floor(extra), deduction: floor(Math.min(raw, baseCap) + extra) };
  }
  function calcPensionCredit(s) {
    const p = rules.pension;
    const savingBase = Math.min(s.pensionSaving, p.savingCap);
    const base = Math.min(savingBase + s.irpAmount, p.combinedCap);
    const remaining = positive(p.combinedCap - base);
    const savingRemaining = Math.min(positive(p.savingCap - savingBase), remaining);
    const rate = s.grossSalary <= p.salaryBoundary ? p.lowRate : p.highRate;
    return { base, remaining, savingRemaining, rate, credit: floor(base * rate) };
  }
  function calculate(s) {
    const laborDeduction = calcLaborDeduction(s.grossSalary);
    const laborIncome = s.grossSalary - laborDeduction;
    const personal = s.dependents * rules.personal.basic + s.elderlyDependents * rules.personal.elderly + s.disabledDependents * rules.personal.disabled;
    const card = calcCardDeduction(s);
    const pension = calcPensionCredit(s);
    const h = rules.housing;
    const subscription = s.subscriptionEligible === 'yes' && s.grossSalary <= h.salaryCap
      ? Math.min(s.housingSubscription, h.subscriptionCap) * h.rate : 0;
    const mortgage = s.housingEligible === 'yes' ? s.mortgageRepayment * h.rate : 0;
    const housing = floor(Math.min(subscription + mortgage, h.combinedCap));
    const child = s.children === 0 ? 0 : rules.child.first + (s.children > 1 ? rules.child.second : 0) + positive(s.children - 2) * rules.child.subsequent;
    const medical = floor(Math.min(positive(s.medicalExpense - s.grossSalary * rules.medical.thresholdRate), rules.medical.cap) * rules.medical.rate);
    const education = floor(s.educationExpense * rules.educationRate);
    const insurance = floor(Math.min(s.insurance, rules.insurance.cap) * rules.insurance.rate);
    const r = rules.rent;
    const rent = s.isRenter && s.rentEligible === 'yes' && s.grossSalary <= r.salaryCap
      ? floor(Math.min(s.monthlyRent, r.cap) * (s.grossSalary <= r.salaryBoundary ? r.lowRate : r.highRate)) : 0;
    const commonDeduction = personal + s.pensionInsuranceDeduction + card.deduction;
    const commonCredits = child + pension.credit;
    function alternative(standard) {
      // 청약은 특별소득공제가 아니므로 표준 대안에도 유지. 전세대출·사회보험은 제외.
      const appliedHousing = standard ? floor(subscription) : housing;
      const social = standard ? 0 : s.socialInsuranceDeduction;
      const deductions = commonDeduction + appliedHousing + social;
      const taxBase = floor(positive(laborIncome - deductions));
      const taxAmount = calcIncomeTax(taxBase);
      const laborCredit = calcLaborTaxCredit(s.grossSalary, taxAmount);
      const specialCredit = standard ? rules.standardCredit : medical + education + insurance + s.donationCreditInput + rent;
      const nominalCredits = laborCredit + commonCredits + specialCredit;
      const finalTax = floor(positive(taxAmount - nominalCredits));
      return { standard, appliedHousing, social, deductions, taxBase, taxAmount, laborCredit, nominalCredits, finalTax };
    }
    const itemized = alternative(false);
    const standard = alternative(true);
    const selected = standard.finalTax < itemized.finalTax ? standard : itemized;
    const credits = [
      { label: '근로소득세액공제', nominal: selected.laborCredit },
      { label: '자녀세액공제', nominal: child },
      { label: '연금저축·IRP 세액공제', nominal: pension.credit },
      ...(selected.standard ? [{ label: '표준세액공제', nominal: rules.standardCredit }] : [
        { label: '의료비 세액공제', nominal: medical }, { label: '교육비 세액공제', nominal: education },
        { label: '보험료 세액공제', nominal: insurance }, { label: '일반 기부금 세액공제', nominal: s.donationCreditInput },
        { label: '월세 세액공제', nominal: rent },
      ]),
    ];
    const warnings = [];
    if (s.monthlyRent > 0 && (!s.isRenter || s.rentEligible !== 'yes')) warnings.push('월세는 무주택 여부와 나머지 요건을 확인해야 반영됩니다.');
    if (s.monthlyRent > 0 && s.grossSalary > r.salaryCap) warnings.push('총급여가 8천만원을 초과해 월세 공제를 적용하지 않았어요.');
    if (s.housingSubscription > 0 && s.subscriptionEligible !== 'yes') warnings.push('주택청약 공제요건을 확인해야 반영됩니다.');
    if (s.housingSubscription > 0 && s.grossSalary > h.salaryCap) warnings.push('총급여가 7천만원을 초과해 주택청약 공제를 적용하지 않았어요.');
    if (s.mortgageRepayment > 0 && s.housingEligible !== 'yes') warnings.push('전세대출 공제요건을 확인해야 반영됩니다.');
    if (s.pensionSaving + s.irpAmount > pension.base) warnings.push('연금계좌 실제 납입액은 유지하고 공제대상액에만 한도를 적용했어요.');
    if (selected.standard) warnings.push('입력 범위에서는 표준세액공제 대안의 세금이 더 적어 선택했어요. 사회보험·전세대출 특별소득공제와 특별세액공제·월세는 이 대안에서 제외됩니다.');
    if (selected.nominalCredits > selected.taxAmount) warnings.push('명목 세액공제 합계가 산출세액을 넘어요. 실제 반영 효과는 남은 세금까지만 적용됩니다.');
    return { ...selected, laborDeduction, laborIncome, personal, card, pension, child, medical, education, insurance, rent, credits, warnings,
      appliedCredit: selected.taxAmount - selected.finalTax,
      refund: s.withheldTax === null ? null : s.withheldTax - selected.finalTax,
      refundScope: s.withheldTax === null ? 'unknown' : s.withheldPeriod };
  }
  function compareScenario(s, key, amount) {
    const before = calculate(s);
    const after = calculate({ ...s, [key]: s[key] + amount });
    return { amount, deductionIncrease: after.card.deduction - before.card.deduction,
      nominalCreditIncrease: after.pension.credit - before.pension.credit,
      incomeTaxDecrease: Math.max(0, before.finalTax - after.finalTax) };
  }
  return { calcLaborDeduction, calcIncomeTax, calcLaborTaxCredit, calcCardDeduction, calcPensionCredit, calculate, compareScenario };
}

function initCalculator(root, cfg) {
  const { rules, defaults, fields, presets } = cfg;
  const calc = createCalculator(rules);
  const q = selector => root.querySelector(selector);
  const all = selector => Array.from(root.querySelectorAll(selector));
  const fmt = value => Math.floor(Math.abs(value)).toLocaleString('ko-KR') + '원';
  const set = (id, value) => { const el = q('#' + id); if (el) el.textContent = value; };
  let state = { ...defaults };
  let migrationWarnings = [];
  let valid = true;
  const inputs = new Map(fields.map(field => [field.key, q('[data-yetc="' + field.key + '"]')]));
  function writeInputs(values) {
    fields.forEach(field => {
      const el = inputs.get(field.key);
      if (!el) return;
      const value = values[field.key];
      if (field.type === 'checkbox') el.checked = Boolean(value);
      else el.value = value === null ? '' : field.type === 'money' ? Number(value).toLocaleString('ko-KR') : String(value);
    });
  }
  function readInputs() {
    const next = { ...state };
    const errors = {};
    for (const field of fields) {
      const el = inputs.get(field.key);
      const parsed = parseValue(field, field.type === 'checkbox' ? el.checked : el.value, rules);
      if (parsed.error) errors[field.key] = parsed.error;
      else next[field.key] = parsed.value;
    }
    if (!Object.keys(errors).length) Object.assign(errors, validateInput(next, fields, rules));
    for (const field of fields) {
      const el = inputs.get(field.key);
      el.setAttribute('aria-invalid', String(Boolean(errors[field.key])));
      set('yetc-error-' + field.key, errors[field.key] ?? '');
    }
    valid = Object.keys(errors).length === 0;
    // 시나리오 입력도 결과 영역 안에 있으므로 오류가 나도 입력칸은 유지한다.
    q('#yetcResults').hidden = false;
    q('#yetcInvalid').hidden = valid;
    q('#yetcCopyBtn').disabled = !valid;
    if (!valid) {
      for (const id of ['yetcMainValue', 'yetcCardValue', 'yetcPensionValue', 'yetcBestValue', 'yetcPensionNominal', 'yetcPensionGain']) set(id, '—');
      for (const id of ['yetcMainNote', 'yetcCardNote', 'yetcPensionNote', 'yetcBestNote', 'yetcCardProgressText', 'yetcPensionProgressText', 'yetcCardCap', 'yetcMethod']) set(id, '입력 오류를 확인하세요.');
      for (const id of ['yetcCardComparison', 'yetcPensionComparison', 'yetcFlow', 'yetcDeductionRows', 'yetcWarnings']) q('#' + id).replaceChildren();
      q('#yetcWarnings').hidden = true;
      q('#yetcCardProgress').value = 0;
      q('#yetcPensionProgress').value = 0;
    }
    if (valid) state = next;
    return valid;
  }
  function renderRows(container, rows) {
    const nodes = rows.map(row => {
      const tr = document.createElement('tr');
      row.forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.append(td); });
      return tr;
    });
    container.replaceChildren(...nodes);
  }
  function renderSummary(result) {
    let label = '예상 결정세액';
    let value = result.finalTax;
    let note = '환급액을 보려면 기납부 소득세를 입력하세요.';
    if (result.refund !== null) {
      value = result.refund;
      if (result.refundScope === 'ytd') {
        label = '현재 기납부액 대비 차이';
        note = (value > 0 ? '현재 기납부액이 ' : value < 0 ? '예상 결정세액이 ' : '두 금액이 같아요. ') +
          (value !== 0 ? fmt(value) + ' 더 커요. ' : '') + '연말 최종 환급액은 아닙니다.';
      } else {
        label = value > 0 ? '예상 환급액' : value < 0 ? '예상 추가납부' : '환급·추가납부 차액';
        note = '예상 결정세액 ' + fmt(result.finalTax) + ' · 지방소득세 제외';
      }
    }
    set('yetcMainLabel', label);
    set('yetcMainValue', fmt(value));
    set('yetcMainNote', note);
    q('#yetcMainCard').classList.toggle('yetc-kpi--pay', result.refund !== null && result.refund < 0);
    set('yetcCardValue', result.card.remaining > 0 ? fmt(result.card.remaining) + ' 남음' : '25% 기준 충족');
    set('yetcCardNote', '현재 카드 소득공제 ' + fmt(result.card.deduction));
    set('yetcPensionValue', fmt(result.pension.remaining));
    set('yetcPensionNote', '연금저축 단독 추가 가능 ' + fmt(result.pension.savingRemaining));
    set('yetcCardProgressText', fmt(result.card.total) + ' / 문턱 ' + fmt(result.card.threshold));
    q('#yetcCardProgress').max = Math.max(1, result.card.threshold);
    q('#yetcCardProgress').value = Math.min(result.card.total, result.card.threshold);
    set('yetcPensionProgressText', '공제대상 납입액 ' + fmt(result.pension.base) + ' / ' + fmt(rules.pension.combinedCap));
    q('#yetcPensionProgress').max = rules.pension.combinedCap;
    q('#yetcPensionProgress').value = result.pension.base;
    const candidates = [
      ['신용카드', 'creditCardAmount'], ['체크·현금영수증', 'debitCashAmount'],
      ['연금저축', 'pensionSaving'], ['IRP', 'irpAmount'],
    ].map(([label, key]) => ({ label, gain: calc.compareScenario(state, key, 1_000_000).incomeTaxDecrease }));
    const max = Math.max(...candidates.map(candidate => candidate.gain));
    set('yetcBestValue', max > 0 ? fmt(max) : '추가 세금 감소 없음');
    set('yetcBestNote', max > 0 ? candidates.filter(candidate => candidate.gain === max).map(candidate => candidate.label).join(' · ') + '에 100만원 추가하는 독립 가정' : '현재 입력과 동일 100만원 가정 기준');
    const notices = [...migrationWarnings, ...result.warnings];
    q('#yetcWarnings').replaceChildren(...notices.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    q('#yetcWarnings').hidden = notices.length === 0;
  }
  function renderScenarios() {
    renderRows(q('#yetcCardComparison'), [
      ['일반 신용카드', 'creditCardAmount'], ['일반 체크·현금영수증', 'debitCashAmount'],
    ].map(([label, key]) => {
      const s = calc.compareScenario(state, key, state.additionalSpend);
      return [label, fmt(s.deductionIncrease), fmt(s.incomeTaxDecrease)];
    }));
    const key = state.pensionTarget === 'saving' ? 'pensionSaving' : 'irpAmount';
    const scenario = calc.compareScenario(state, key, state.additionalPension);
    set('yetcPensionNominal', fmt(scenario.nominalCreditIncrease));
    set('yetcPensionGain', fmt(scenario.incomeTaxDecrease));
    renderRows(q('#yetcPensionComparison'), [500_000, 1_000_000, 2_000_000, 3_000_000].map(amount => {
      const s = calc.compareScenario(state, key, amount);
      return [fmt(amount), fmt(s.nominalCreditIncrease), fmt(s.incomeTaxDecrease)];
    }));
  }
  function renderBreakdown(r) {
    renderRows(q('#yetcFlow'), [
      ['총급여', fmt(state.grossSalary)], ['근로소득공제', fmt(r.laborDeduction)], ['근로소득금액', fmt(r.laborIncome)],
      ['적용 소득공제 합계', fmt(r.deductions)], ['과세표준', fmt(r.taxBase)], ['산출세액', fmt(r.taxAmount)],
      ['명목 세액공제 합계', fmt(r.nominalCredits)], ['세금에 반영된 세액공제', fmt(r.appliedCredit)],
      ['예상 결정세액', fmt(r.finalTax)], ['기납부 소득세', state.withheldTax === null ? '미입력' : fmt(state.withheldTax)],
    ]);
    renderRows(q('#yetcDeductionRows'), [
      ['인적공제', fmt(r.personal), '—'], ['공적연금보험료', fmt(state.pensionInsuranceDeduction), '—'],
      ['건강·고용보험료', fmt(r.social), '—'], ['주택자금', fmt(r.appliedHousing), '—'], ['카드', fmt(r.card.deduction), '—'],
      ...r.credits.map(item => [item.label, '—', fmt(item.nominal)]),
    ]);
    set('yetcMethod', r.standard ? '표준세액공제 대안 적용' : '항목별 공제 대안 적용');
    set('yetcCardCap', '기본한도 ' + fmt(r.card.baseCap) + ' · 추가공제 ' + fmt(r.card.extra));
  }
  function syncUrl() {
    // 입력값은 서버에 보내지 않는 URL fragment에 저장한다. 구버전 query는 제거.
    const url = new URL(location.href);
    fields.forEach(field => url.searchParams.delete(field.url));
    url.searchParams.delete('don');
    url.searchParams.delete('v');
    url.hash = 'yetc=' + serializeState(state, fields).toString();
    history.replaceState(null, '', url);
  }
  function update(sync = true) {
    if (!readInputs()) return;
    const result = calc.calculate(state);
    renderSummary(result);
    renderScenarios();
    renderBreakdown(result);
    if (sync) syncUrl();
  }
  function switchTab(id, focus = false) {
    all('[data-yetc-tab]').forEach(button => {
      const active = button.dataset.yetcTab === id;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    all('[data-yetc-panel]').forEach(panel => { panel.hidden = panel.dataset.yetcPanel !== id; });
  }
  const hash = location.hash.startsWith('#yetc=') ? location.hash.slice(6) : '';
  const restored = restoreState(new URLSearchParams(hash || location.search), defaults, fields, rules);
  state = restored.state;
  migrationWarnings = restored.warnings;
  writeInputs(state);
  // 소득 관련 값은 세션 녹화 도구에 노출하지 않으며 URL query로도 유지하지 않는다.
  fields.forEach(field => {
    const el = inputs.get(field.key);
    el.addEventListener(field.type === 'select' || field.type === 'checkbox' ? 'change' : 'input', () => {
      all('[data-yetc-preset]').forEach(button => button.setAttribute('aria-pressed', 'false'));
      update();
    });
    if (field.type === 'money') el.addEventListener('blur', () => {
      const parsed = parseValue(field, el.value, rules);
      if (!parsed.error) el.value = parsed.value === null ? '' : parsed.value.toLocaleString('ko-KR');
    });
  });
  all('[data-yetc-tab]').forEach((button, index, tabs = all('[data-yetc-tab]')) => {
    button.addEventListener('click', () => switchTab(button.dataset.yetcTab));
    button.addEventListener('keydown', event => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      switchTab(tabs[next].dataset.yetcTab, true);
    });
  });
  all('[data-yetc-preset]').forEach(button => button.addEventListener('click', () => {
    const preset = presets.find(item => item.id === button.dataset.yetcPreset);
    state = { ...defaults, ...preset.input };
    migrationWarnings = [];
    writeInputs(state);
    all('[data-yetc-preset]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
  }));
  all('[data-yetc-quick]').forEach(button => button.addEventListener('click', () => {
    inputs.get('additionalPension').value = Number(button.dataset.yetcQuick).toLocaleString('ko-KR');
    update();
  }));
  q('#yetcResetBtn').addEventListener('click', () => {
    state = { ...defaults }; migrationWarnings = [];
    writeInputs(state);
    all('[data-yetc-preset]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    switchTab('basic');
    q('#yetcCopyFallback').hidden = true;
    set('yetcCopyStatus', '');
    update();
  });
  q('#yetcWithheldLink').addEventListener('click', () => { switchTab('basic'); inputs.get('withheldTax').focus(); });
  // 상세 안내의 페이지 내 이동이 공유 상태 fragment를 지우지 않도록 유지한다.
  all('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  q('#yetcCopyBtn').addEventListener('click', async () => {
    if (!valid) return;
    syncUrl();
    try {
      await navigator.clipboard.writeText(location.href);
      set('yetcCopyStatus', '입력값이 포함된 링크를 복사했어요.');
      q('#yetcCopyFallback').hidden = true;
    } catch {
      set('yetcCopyStatus', '자동 복사가 안 되면 아래 링크를 선택해 직접 복사하세요.');
      const input = q('#yetcCopyFallback');
      input.value = location.href; input.hidden = false; input.focus(); input.select();
    }
  });
  switchTab('basic');
  update();
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-calculator="year-end-tax-refund-calculator"]');
  const config = document.getElementById('yetcConfig');
  if (root && config) initCalculator(root, JSON.parse(config.textContent));
}
