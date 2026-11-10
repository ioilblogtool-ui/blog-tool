// DOM·입출력 없음. 금액은 BigInt 원 단위. 직렬화 규칙만 데이터 파일에서 주입한다.
const fail = (code, message, field) => ({ ok: false, issue: { code, message, field } });
export function validateOverseasEligibility(e) {
  if (!e || Object.values(e).some(v => !v || v === 'unknown')) return fail('OS_ELIGIBILITY_UNKNOWN', '계산 대상의 모든 항목을 확인해 주세요. 모르는 조건은 공식 안내에서 먼저 확인하세요.');
  if (e.asset !== 'overseas_listed_stock_or_etf') return fail('OS_ASSET_UNSUPPORTED', '국내 상장 ETF와 기타 상품은 이 계산 대상이 아닙니다. 상품별 과세체계를 확인하세요.');
  if (e.residency !== 'eligible') return fail('OS_RESIDENCY_UNSUPPORTED', '국외주식 과세대상 거주 요건에 해당하는 일반 사례만 계산합니다.');
  if (e.standardRate !== 'yes') return fail('OS_RATE_UNSUPPORTED', '일반 국세 20% 적용 대상만 지원합니다.');
  if (e.mixedDomesticTaxableStock !== 'no') return fail('OS_MIXED_TAX_RATE', '국내 과세대상 주식과의 합산·세율 배분은 별도 신고 자료로 확인해 주세요.');
  if (e.specialTaxAdjustment !== 'no') return fail('OS_SPECIAL_ADJUSTMENT', '특례·외국납부세액공제·기납부세액 등 별도 조정은 이 계산에서 지원하지 않습니다.');
  return { ok: true };
}
export function parseWon(raw, max = '1000000000000') {
  const text = String(raw ?? '').trim();
  if (!text) return { ok: true, value: 0n, blank: true };
  if (text.startsWith('-')) return fail('OS_NEGATIVE_ABSOLUTE', '손실도 양수로 입력하세요. 계산할 때 차감합니다.');
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text) || text.length > 18) return fail('OS_AMOUNT_FORMAT', '금액은 원 단위 정수로 입력하세요. 음수·소수·지수 표기는 사용할 수 없습니다.');
  const value = BigInt(text.replaceAll(',', ''));
  if (value > BigInt(max)) return fail('OS_AMOUNT_LIMIT', '각 입력 금액은 1조원 이하로 입력해 주세요.');
  return { ok: true, value, blank: false };
}
export function normalizeProfitLossRows(rows, config = {}) {
  if (!Array.isArray(rows) || rows.length > (config.maxRows ?? 20)) return fail('OS_TOO_MANY_ROWS', '계좌 입력은 최대 20행입니다. 더 많은 계좌는 합계로 입력하세요.');
  let gainWon = 0n, lossAbsWon = 0n, separateCostWon = 0n, activeRows = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!['already_included','separate_eligible_cost'].includes(row.costKind)) return fail('OS_COST_MODE', '비용 반영 방식을 선택해 주세요.', `row-${i}-costKind`);
    const gain = parseWon(row.gain, config.maxAmountWon), loss = parseWon(row.loss, config.maxAmountWon);
    const cost = row.costKind === 'separate_eligible_cost' ? parseWon(row.cost, config.maxAmountWon) : {ok: true, value: 0n, blank: true};
    for (const [key, value] of [['gain',gain],['loss',loss],['cost',cost]]) if (!value.ok) return { ...value, issue: { ...value.issue, field: `row-${i}-${key}` } };
    if (gain.blank && loss.blank) {
      if (cost.value > 0n) return fail('OS_NO_INPUT', `계좌 ${i + 1}의 이익 또는 손실을 먼저 입력하세요. 0원도 직접 입력할 수 있습니다.`, `row-${i}-gain`);
      continue;
    }
    activeRows++; gainWon += gain.value; lossAbsWon += loss.value; separateCostWon += cost.value;
  }
  if (!activeRows) return fail('OS_NO_INPUT', '이익 또는 손실을 입력해 주세요. 실현손익이 없다면 0을 직접 입력하세요.', 'row-0-gain');
  return { ok: true, value: { gainWon, lossAbsWon, separateCostWon, activeRows } };
}
export function mergeProfitLossRows(rows, config) {
  const result = normalizeProfitLossRows(rows, config);
  if (!result.ok) {
    // 전부 빈 행만 있는 모드 전환은 금액을 새로 만들지 않는다. 잘못된 값은 그대로 오류 처리.
    if (result.issue.code === 'OS_NO_INPUT' && rows.every(r => !String(r.gain ?? '').trim() && !String(r.loss ?? '').trim() && (!String(r.cost ?? '').trim() || r.costKind === 'already_included'))) return {ok: true, value: {gain: '', loss: '', cost: '', costKind: 'already_included'}};
    return result;
  }
  const v = result.value;
  const max = BigInt(config?.maxAmountWon ?? '1000000000000');
  if ([v.gainWon,v.lossAbsWon,v.separateCostWon].some(n => n > max)) return fail('OS_AMOUNT_LIMIT', '통합 후 각 금액이 1조원을 초과합니다. 계좌별 입력을 유지해 주세요.');
  return {ok: true, value: {gain: String(v.gainWon), loss: String(v.lossAbsWon), cost: String(v.separateCostWon), costKind: v.separateCostWon > 0n ? 'separate_eligible_cost' : 'already_included'}};
}
function verifiedRule(r) {
  // 규칙 누락을 22% 근사값으로 대체하지 않는다.
  try {
    return r?.status === 'cross_checked' && r.taxYear === 2026 && r.localTaxBasis === 'taxable_income'
      && r.nationalRounding?.kind === 'floor' && r.localRounding?.kind === 'floor'
      && BigInt(r.deductionWon) === 2500000n
      && BigInt(r.nationalRate.num) === 20n && BigInt(r.nationalRate.den) === 100n
      && BigInt(r.localRate.num) === 2n && BigInt(r.localRate.den) === 100n
      && BigInt(r.nationalRounding.unitWon) === 10n && BigInt(r.localRounding.unitWon) === 10n
      && ['nts-calculation','local-rate','national-rounding','local-rounding'].every(id => r.sourceIds?.includes(id));
  } catch { return false; }
}
export function calculateOverseasTax(totals, rule) {
  if (!verifiedRule(rule)) return fail('OS_TAX_RULE_UNVERIFIED', '2026년 일반 세율·공제·단수 처리 기준을 확인할 수 없어 계산하지 않았습니다.');
  if (!totals || ['gainWon','lossAbsWon','separateCostWon'].some(k => typeof totals[k] !== 'bigint' || totals[k] < 0n)) return fail('OS_INVALID_TOTALS', '손익 합계의 형식을 확인해 주세요.');
  const {gainWon, lossAbsWon, separateCostWon} = totals;
  const netGainWon = gainWon - lossAbsWon - separateCostWon;
  const nominalDeductionWon = BigInt(rule.deductionWon);
  const deductionAppliedWon = netGainWon <= 0n ? 0n : netGainWon < nominalDeductionWon ? netGainWon : nominalDeductionWon;
  const taxableBaseWon = netGainWon > nominalDeductionWon ? netGainWon - nominalDeductionWon : 0n;
  const tax = (rate, rounding) => taxableBaseWon * BigInt(rate.num) / (BigInt(rate.den) * BigInt(rounding.unitWon)) * BigInt(rounding.unitWon);
  const nationalTaxWon = tax(rule.nationalRate, rule.nationalRounding), localTaxWon = tax(rule.localRate, rule.localRounding);
  return {ok: true, value: {gainWon, lossAbsWon, separateCostWon, netGainWon, nominalDeductionWon, deductionAppliedWon,
    deductionRemainingWon: nominalDeductionWon - deductionAppliedWon, taxableBaseWon, nationalTaxWon, localTaxWon, totalTaxWon: nationalTaxWon + localTaxWon}};
}
export function compareOverseasScenario(totals, scenarioRow, rule, config) {
  const scenario = normalizeProfitLossRows([scenarioRow], config);
  if (!scenario.ok) return scenario;
  const before = calculateOverseasTax(totals, rule);
  if (!before.ok) return before;
  const s = scenario.value;
  const after = calculateOverseasTax({gainWon: totals.gainWon + s.gainWon, lossAbsWon: totals.lossAbsWon + s.lossAbsWon, separateCostWon: totals.separateCostWon + s.separateCostWon}, rule);
  if (!after.ok) return after;
  return {ok: true, value: {before: before.value, after: after.value, taxDeltaWon: after.value.totalTaxWon - before.value.totalTaxWon}};
}
export function createBaselineState() {
  let revision = 0, baseline = null;
  return {
    invalidate() { revision++; baseline = null; },
    accept(totals) { baseline = {revision, totals: {...totals}}; },
    current() { return baseline?.revision === revision ? {...baseline.totals} : null; },
  };
}
