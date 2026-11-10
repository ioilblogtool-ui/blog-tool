import { calculatePensionRateOnly, calculatePensionMonthly, roundRational } from './national-pension-contribution-core.js';

const fail = (code, message, field) => ({ ok: false, issue: { code, message, field } });
export const validMonth = value => /^202[67]-(0[1-9]|1[0-2])$/.test(value || '');

export function validateContributionInput(raw, maxAmount = 100_000_000) {
  if (!['rate_only', 'monthly_estimate'].includes(raw.mode)) return fail('NP_MODE', '비교 방식을 선택해 주세요.', 'mode');
  if (!['employee', 'regional'].includes(raw.subscriber)) return fail('NP_SUBSCRIBER', '가입 유형을 선택해 주세요.', 'subscriber');
  const text = String(raw.amount ?? '').trim();
  if (!text) return fail('NP_EMPTY_BASIS', '기준 금액을 입력해 주세요.', 'amount');
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text)) return fail('NP_AMOUNT_FORMAT', '금액은 원 단위 정수로 입력해 주세요. 소수·음수·지수 표기는 사용할 수 없습니다.', 'amount');
  const amountWon = Number(text.replaceAll(',', ''));
  if (!Number.isSafeInteger(amountWon) || amountWon > maxAmount) return fail('NP_AMOUNT_LIMIT', '기준 금액은 1억원 이하로 입력해 주세요.', 'amount');
  if (amountWon <= 0) return fail('NP_ZERO_OR_NEGATIVE', '기준 금액은 0보다 커야 합니다. 소득이 없다면 납부예외 여부를 공단에 확인하세요.', 'amount');
  if (raw.mode === 'monthly_estimate') {
    if (!['reported_basis', 'income_estimate'].includes(raw.inputKind)) return fail('NP_INPUT_KIND', '신고 기준소득월액 또는 소득월액 추정을 선택해 주세요.', 'inputKind');
    if (!validMonth(raw.beforeMonth)) return fail('NP_INVALID_MONTH', '기준월은 2026·2027년의 유효한 월을 선택해 주세요.', 'beforeMonth');
    if (!validMonth(raw.afterMonth)) return fail('NP_INVALID_MONTH', '비교월은 2026·2027년의 유효한 월을 선택해 주세요.', 'afterMonth');
  }
  return { ok: true, value: { mode: raw.mode, subscriber: raw.subscriber, amountWon,
    inputKind: raw.inputKind, beforeMonth: raw.beforeMonth, afterMonth: raw.afterMonth,
    allowEstimate: raw.allowEstimate === true } };
}

export function calculateContributionComparison(input, rules, pathRates) {
  if (input.mode === 'rate_only') {
    const result = calculatePensionRateOnly({ fixedBasisWon: input.amountWon, subscriber: input.subscriber, fromYear: 2026, toYear: 2027 }, pathRates);
    if (!result.ok) return result;
    return { ok: true, value: { ...result.value, beforeLabel: '2026년', afterLabel: '2027년', assumption: false,
      ruleIds: [result.value.before.ruleId, result.value.after.ruleId] } };
  }
  // 공용 함수는 단수 처리 가정을 포함한다. 명시적으로 선택하지 않으면 추정 숫자를 만들지 않는다.
  const rounding = rules.rounding?.pensionPremium;
  if (rounding?.status !== 'verified' && !input.allowEstimate) return fail('NP_ESTIMATE_CONSENT', '보험료 단수 처리 가정을 확인하고 참고 추정에 동의해 주세요.', 'allowEstimate');
  if (!rounding || !Number.isSafeInteger(rounding.unit) || rounding.unit <= 0) return fail('NP_ASSESSMENT_UNAVAILABLE', '보험료 단수 처리 규칙을 확인할 수 없습니다. 요율 비교를 이용하세요.');
  const monthly = month => calculatePensionMonthly({ month, subscriber: input.subscriber,
    basisInput: { kind: input.inputKind, amountWon: input.amountWon } }, rules);
  const before = monthly(input.beforeMonth);
  if (!before.ok) return { ...before, issue: { ...before.issue, field: before.issue.code === 'NP_INVALID_REPORTED_BASIS' ? 'amount' : 'beforeMonth' } };
  const after = monthly(input.afterMonth);
  if (!after.ok) return { ...after, issue: { ...after.issue, field: after.issue.code === 'NP_INVALID_REPORTED_BASIS' ? 'amount' : 'afterMonth' } };
  const subscriberDeltaWon = after.value.subscriberWon - before.value.subscriberWon;
  return { ok: true, value: { mode: 'monthly_estimate', before: before.value, after: after.value,
    beforeLabel: input.beforeMonth, afterLabel: input.afterMonth,
    subscriberDeltaWon, employerDeltaWon: input.subscriber === 'regional' ? null : after.value.employerWon - before.value.employerWon,
    monthlyDeltaAnnualizedWon: subscriberDeltaWon * 12, annualizationMonths: 12,
    assumption: rounding.status !== 'verified',
    ruleIds: [...new Set([before.value.provenance.rateRuleId, after.value.provenance.rateRuleId,
      before.value.provenance.basisRuleId, after.value.provenance.basisRuleId, rounding.id])],
  } };
}

export function buildContributionRatePath(basis, subscriber, pathRates) {
  const rows = [];
  for (let year = 2026; year <= 2033; year++) {
    const result = calculatePensionRateOnly({ fixedBasisWon: basis, subscriber, fromYear: 2026, toYear: year }, pathRates);
    if (!result.ok) return result;
    const rate = pathRates.find(rule => rule.id === result.value.after.ruleId);
    rows.push({ year, totalRate: rate.total.num / rate.total.den,
      subscriberRate: (subscriber === 'regional' ? rate.total.num / rate.total.den : rate.employee.num / rate.employee.den),
      burden: result.value.after });
  }
  return { ok: true, value: rows };
}

export function displayAmount(value) {
  return typeof value === 'number' ? value : roundRational(value);
}

function init(root, config) {
  const form = root.querySelector('[data-np-form]');
  const results = root.querySelector('[data-np-results]');
  const status = root.querySelector('[data-np-status]');
  const error = root.querySelector('[data-np-error]');
  const fields = Object.fromEntries(['amount', 'mode', 'inputKind', 'beforeMonth', 'afterMonth', 'allowEstimate'].map(key => [key, form.elements.namedItem(key)]));
  const fmt = value => `${displayAmount(value).toLocaleString('ko-KR')}원`;
  const set = (name, value) => { root.querySelector(`[data-np-${name}]`).textContent = value; };
  const deltaText = value => { const n = displayAmount(value); return n > 0 ? `${fmt(n)} 증가` : n < 0 ? `${fmt(-n)} 감소` : '차이 없음'; };
  const read = () => ({ mode: fields.mode.value, subscriber: form.elements.namedItem('subscriber').value,
    amount: fields.amount.value, inputKind: fields.inputKind.value, beforeMonth: fields.beforeMonth.value,
    afterMonth: fields.afterMonth.value, allowEstimate: fields.allowEstimate.checked });
  const invalidate = () => {
    results.hidden = true;
    error.hidden = true;
    form.querySelectorAll('[aria-invalid="true"]').forEach(element => { element.removeAttribute('aria-invalid'); });
    status.textContent = '입력 조건을 확인한 뒤 계산하기를 눌러 주세요.';
  };
  const updateMode = () => {
    const monthly = fields.mode.value === 'monthly_estimate';
    root.querySelector('[data-np-monthly-fields]').hidden = !monthly;
    fields.inputKind.disabled = !monthly;
    fields.beforeMonth.disabled = !monthly;
    fields.afterMonth.disabled = !monthly;
    fields.allowEstimate.disabled = !monthly;
    set('amount-label', monthly && fields.inputKind.value === 'income_estimate' ? '신고 전 소득월액 추정 입력' : '기준소득월액');
  };
  const makeCell = (row, text, header = false) => {
    const cell = document.createElement(header ? 'th' : 'td');
    if (header) cell.scope = 'row';
    cell.textContent = text;
    row.append(cell);
  };
  const showFailure = issue => {
    results.hidden = true;
    error.hidden = false;
    error.textContent = issue.message;
    status.textContent = '계산 결과를 표시하지 않았습니다. 안내를 확인해 주세요.';
    const field = issue.field && fields[issue.field];
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  };
  form.addEventListener('input', () => { invalidate(); updateMode(); });
  form.addEventListener('change', () => { invalidate(); updateMode(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); invalidate();
    const validated = validateContributionInput(read(), config.maxAmount);
    if (!validated.ok) { showFailure(validated.issue); return; }
    let result;
    try { result = calculateContributionComparison(validated.value, config.rules, config.pathRates); }
    catch { showFailure({ message: '계산 기준을 확인할 수 없습니다. 입력과 적용기간을 다시 확인하세요.' }); return; }
    if (!result.ok) { showFailure(result.issue); return; }
    const r = result.value;
    set('after-label', `${r.afterLabel} 월 본인 부담${r.assumption ? ' 참고 추정' : ' 요율 적용액'}`);
    set('after-amount', fmt(r.after.subscriberWon));
    set('monthly-delta', deltaText(r.subscriberDeltaWon));
    set('annual-delta', deltaText(r.monthlyDeltaAnnualizedWon));
    set('before-heading', r.beforeLabel); set('after-heading', r.afterLabel);
    set('basis-note', r.mode === 'rate_only' ? `같은 기준소득월액 ${fmt(r.after.basisWon)} · 상·하한·보험료 단수 처리 제외` : `기준월 적용 ${fmt(r.before.basisWon)} → 비교월 적용 ${fmt(r.after.basisWon)} · 단수 처리 ${r.assumption ? '가정 적용' : '확인된 기준'}`);
    set('mode-note', r.mode === 'rate_only' ? '시뮬레이션 · 요율만 비교' : r.assumption ? '참고 추정 · 보험료 원 미만 버림 가정' : '시뮬레이션 · 월별 추정');
    const tbody = root.querySelector('[data-np-breakdown]');
    tbody.replaceChildren();
    for (const [label, key] of [['본인 부담', 'subscriberWon'], ['회사 부담', 'employerWon'], ['전체 보험료', 'totalWon']]) {
      const row = document.createElement('tr'); makeCell(row, label, true);
      makeCell(row, r.before[key] === null ? '해당 없음' : fmt(r.before[key]));
      makeCell(row, r.after[key] === null ? '해당 없음' : fmt(r.after[key]));
      tbody.append(row);
    }
    const adjustments = [...(r.before.adjustments || []), ...(r.after.adjustments || [])];
    set('adjustments', adjustments.length ? '소득월액 추정 입력에서 천원 미만 절사 또는 기간별 상·하한을 적용했습니다. 위의 적용 기준금액을 확인하세요.' : '입력 기준금액의 추가 소득 보정은 없습니다.');
    set('rule-note', `사용한 계산 기준: ${r.ruleIds.join(' · ')}`);
    const path = buildContributionRatePath(r.after.basisWon, validated.value.subscriber, config.pathRates);
    const pathBody = root.querySelector('[data-np-path]'); pathBody.replaceChildren();
    if (path.ok) {
      for (const item of path.value) {
        const row = document.createElement('tr'); makeCell(row, `${item.year}년`, true);
        makeCell(row, `${(item.totalRate * 100).toFixed(1)}%`);
        makeCell(row, `${(item.subscriberRate * 100).toFixed(2)}%`);
        makeCell(row, fmt(item.burden.subscriberWon)); pathBody.append(row);
      }
      set('path-basis', `기준소득월액 ${fmt(r.after.basisWon)} 고정 · ${validated.value.subscriber === 'regional' ? '지역가입자' : '직장가입자'} · 미래 상·하한·지원금 미반영`);
    } else set('path-basis', path.issue.message);
    results.hidden = false;
    status.textContent = `${r.afterLabel} 본인 월 부담 ${fmt(r.after.subscriberWon)}, 월 차이는 ${deltaText(r.subscriberDeltaWon)}입니다. ${r.assumption ? '단수 처리 가정이 있는 참고 추정입니다.' : '상하한을 제외한 요율 비교입니다.'}`;
  });
  root.querySelectorAll('[data-np-preset]').forEach(button => button.addEventListener('click', () => {
    fields.amount.value = Number(button.dataset.npPreset).toLocaleString('ko-KR'); invalidate(); fields.amount.focus();
  }));
  root.querySelector('[data-np-reset]').addEventListener('click', () => {
    form.reset(); invalidate(); updateMode();
    root.querySelector('[data-np-copy-status]').textContent = '';
    root.querySelector('[data-np-copy-fallback]').hidden = true;
    fields.amount.focus();
  });
  root.querySelector('[data-np-copy]').addEventListener('click', async () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    if (!canonical) return;
    try { await navigator.clipboard.writeText(canonical); set('copy-status', '입력값 없는 페이지 주소를 복사했습니다.'); }
    catch {
      const fallback = root.querySelector('[data-np-copy-fallback]');
      fallback.value = canonical; fallback.hidden = false; fallback.focus(); fallback.select();
      set('copy-status', '아래 페이지 주소를 선택해 직접 복사하세요. 입력값은 포함하지 않습니다.');
    }
  });
  updateMode();
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-calculator="national-pension-contribution-calculator"]');
  const config = document.getElementById('npContributionConfig');
  if (root && config) init(root, JSON.parse(config.textContent));
}
