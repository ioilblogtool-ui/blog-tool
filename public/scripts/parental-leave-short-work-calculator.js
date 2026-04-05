const $ = (id) => document.getElementById(id);

function parseConfig() {
  try {
    return JSON.parse(document.getElementById('plsw-config')?.textContent || '{}');
  } catch {
    return { defaults: {}, policy: {} };
  }
}

const CONFIG = parseConfig();
const DEFAULTS = CONFIG.defaults || {};
const POLICY = CONFIG.policy || {};
let timelineChart = null;

function formatWon(value) {
  return `${new Intl.NumberFormat('ko-KR').format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat('ko-KR').format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat('ko-KR').format(man)}만원`;
}

function formatMonths(value) {
  return `${Number(value || 0).toFixed(Number(value || 0) % 1 === 0 ? 0 : 1)}개월`;
}

function addYears(dateString, years) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result.toISOString().slice(0, 10);
}

function getNumber(id) {
  return Number($(id)?.value || 0);
}

function getState() {
  return {
    childBirthDate: $('plswChildBirthDate')?.value || DEFAULTS.childBirthDate,
    baseDate: $('plswBaseDate')?.value || DEFAULTS.baseDate,
    monthlyOrdinaryWage: getNumber('plswMonthlyWage'),
    weeklyHoursBefore: getNumber('plswWeeklyBefore'),
    weeklyHoursAfter: getNumber('plswWeeklyAfter'),
    householdType: $('plswHouseholdType')?.value || DEFAULTS.householdType,
    spouseUsedThreeMonths: Boolean($('plswSpouseUsedThreeMonths')?.checked),
    leaveUsedMonths: getNumber('plswLeaveUsedMonths'),
    shortWorkUsedMonths: getNumber('plswShortUsedMonths'),
    plannedLeaveMonths: getNumber('plswPlannedLeaveMonths'),
    scenarioMode: $('plswScenarioMode')?.value || DEFAULTS.scenarioMode
  };
}

function syncHints(state) {
  const wageHint = $('plswMonthlyWageHint');
  if (wageHint) wageHint.textContent = formatKoreanAmount(state.monthlyOrdinaryWage);
}

function determineLeaveMaxMonths(state) {
  if (state.householdType === 'SINGLE_PARENT' || state.householdType === 'DISABLED_CHILD') {
    return {
      months: POLICY.parentalLeaveExtendedMonths || 18,
      reason: state.householdType === 'SINGLE_PARENT' ? '한부모 가정 입력으로 18개월 연장 조건 충족' : '중증 장애아동 부모 입력으로 18개월 연장 조건 충족'
    };
  }
  if (state.spouseUsedThreeMonths) {
    return {
      months: POLICY.parentalLeaveExtendedMonths || 18,
      reason: '배우자도 같은 자녀로 3개월 이상 사용한 것으로 입력되어 18개월 조건 충족'
    };
  }
  return {
    months: POLICY.parentalLeaveDefaultMonths || 12,
    reason: '현재 입력 기준으로는 기본 12개월 한도로 계산'
  };
}

function getLeavePayForMonth(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return Math.min(monthlyWage, 2500000);
  if (monthNumber <= 6) return Math.min(monthlyWage, 2000000);
  return Math.min(monthlyWage * 0.8, 1600000);
}

function calculateShortWorkPay(state) {
  const before = Math.max(state.weeklyHoursBefore, 1);
  const after = state.weeklyHoursAfter;
  const reducedHours = Math.max(before - after, 0);
  const firstTenHours = Math.min(reducedHours, 10);
  const extraHours = Math.max(reducedHours - 10, 0);

  const companyPay = state.monthlyOrdinaryWage * (after / before);

  // Work24 공식 모의계산식 기준:
  // 1) 최초 10시간 단축분은 월 통상임금 100%에 상한을 먼저 적용한 뒤,
  //    단축 전 소정근로시간 대비 비율을 곱합니다.
  // 2) 나머지 단축분은 월 통상임금 80%에 상한을 먼저 적용한 뒤,
  //    추가 단축시간 비율을 곱합니다.
  const supportFirstBase = Math.min(
    state.monthlyOrdinaryWage,
    POLICY.shortWorkFirstTenCap || 2500000
  );
  const supportFirstRawBase = state.monthlyOrdinaryWage;
  const supportFirst = supportFirstBase * (firstTenHours / before);
  const supportFirstHitCap = supportFirstRawBase > supportFirstBase;

  const supportExtraRawBase = state.monthlyOrdinaryWage * 0.8;
  const supportExtraBase = Math.min(
    supportExtraRawBase,
    POLICY.shortWorkExtraCap || 1600000
  );
  const supportExtra = supportExtraBase * (extraHours / before);
  const supportExtraHitCap = supportExtraRawBase > supportExtraBase;

  const governmentSupportRaw = supportFirst + supportExtra;
  const governmentSupport = reducedHours > 0
    ? Math.max(governmentSupportRaw, POLICY.shortWorkMinSupport || 500000)
    : 0;
  const estimatedMonthlyTotal = companyPay + governmentSupport;
  const deltaVsOriginal = estimatedMonthlyTotal - state.monthlyOrdinaryWage;

  return {
    reducedHours,
    firstTenHours,
    extraHours,
    companyPay,
    supportFirstBase,
    supportFirst,
    supportFirstHitCap,
    supportExtraBase,
    supportExtra,
    supportExtraHitCap,
    governmentSupportRaw,
    governmentSupport,
    estimatedMonthlyTotal,
    deltaVsOriginal
  };
}
function calculate(state) {
  const leaveInfo = determineLeaveMaxMonths(state);
  const leaveMaxMonths = leaveInfo.months;
  const leaveUsedMonths = Math.min(Math.max(state.leaveUsedMonths, 0), leaveMaxMonths);
  const leaveRemainingMonths = Math.max(leaveMaxMonths - leaveUsedMonths, 0);

  const shortMaxMonths = Math.min(
    POLICY.shortWorkMaxMonths || 36,
    (POLICY.shortWorkBaseMonths || 12) + leaveRemainingMonths * 2
  );
  const shortUsedMonths = Math.min(Math.max(state.shortWorkUsedMonths, 0), shortMaxMonths);
  const shortRemainingMonths = Math.max(shortMaxMonths - shortUsedMonths, 0);

  const shortPay = calculateShortWorkPay(state);
  const leaveExpiry = addYears(state.childBirthDate, 8);
  const shortExpiry = addYears(state.childBirthDate, 12);

  let warning = '';
  if (state.weeklyHoursAfter < (POLICY.weeklyHoursMinAfterReduction || 15) || state.weeklyHoursAfter > (POLICY.weeklyHoursMaxAfterReduction || 35)) {
    warning = '단축 후 근로시간은 주 15시간 이상 35시간 이하 기준으로 보는 것이 맞습니다.';
  }

  return {
    leaveMaxMonths,
    leaveUsedMonths,
    leaveRemainingMonths,
    shortMaxMonths,
    shortUsedMonths,
    shortRemainingMonths,
    leaveExpiry,
    shortExpiry,
    shortPay,
    leaveInfo,
    warning
  };
}

function buildScenarios(state, result) {
  const remainingLeave = result.leaveRemainingMonths;
  const remainingShort = result.shortRemainingMonths;
  const leavePayMonth1 = getLeavePayForMonth(state.monthlyOrdinaryWage, 1);
  const leavePayMonth7 = getLeavePayForMonth(state.monthlyOrdinaryWage, 7);
  const shortPay = result.shortPay.estimatedMonthlyTotal;

  const rows = [
    {
      code: 'LEAVE_FIRST',
      label: '휴직 우선',
      monthly: remainingLeave > 0 ? leavePayMonth1 : shortPay,
      leave: `${formatMonths(Math.min(Math.max(state.plannedLeaveMonths, 1), remainingLeave || state.plannedLeaveMonths))} 먼저 사용`,
      short: remainingShort > 0 ? `${formatMonths(remainingShort)} 이어 사용 가능` : '추가 단축근무 여유 적음',
      insight: '돌봄 시간을 먼저 확보하고 이후 유연근무로 이어가는 흐름'
    },
    {
      code: 'SHORT_FIRST',
      label: '단축 우선',
      monthly: shortPay,
      leave: remainingLeave > 0 ? `${formatMonths(remainingLeave)} 남겨둘 수 있음` : '남은 휴직 여유 적음',
      short: remainingShort > 0 ? `${formatMonths(remainingShort)} 바로 활용` : '단축근무 여유 적음',
      insight: '현금흐름 방어가 상대적으로 좋은 구조'
    },
    {
      code: 'MIXED',
      label: '혼합 사용',
      monthly: Math.round((Math.min(leavePayMonth7, shortPay) + shortPay) / 2),
      leave: remainingLeave > 0 ? `${formatMonths(Math.min(remainingLeave, Math.max(1, state.plannedLeaveMonths / 2)))} 분산 사용` : '남은 휴직 여유 적음',
      short: remainingShort > 0 ? `${formatMonths(Math.min(remainingShort, 12))} 혼합 적용` : '단축근무 여유 적음',
      insight: '휴직과 단축근무를 나눠 써서 리스크를 분산하는 흐름'
    }
  ];

  const auto = [...rows].sort((a, b) => b.monthly - a.monthly)[0];
  const best = state.scenarioMode === 'AUTO' ? auto.code : state.scenarioMode;

  return {
    rows,
    bestCode: best,
    bestRow: rows.find((row) => row.code === best) || auto,
    autoRow: auto
  };
}

function buildTimeline(state, result, scenarios) {
  const bestCode = scenarios.bestCode;
  const leaveMonthsPlanned = Math.min(result.leaveRemainingMonths, Math.max(state.plannedLeaveMonths, 0));
  const shortMonthsPlanned = Math.min(result.shortRemainingMonths, 12);
  const rows = [];

  for (let month = 1; month <= 12; month += 1) {
    let status = '복직';
    let companyPay = state.monthlyOrdinaryWage;
    let support = 0;

    if ((bestCode === 'LEAVE_FIRST' || bestCode === 'MIXED') && month <= leaveMonthsPlanned) {
      status = '육아휴직';
      companyPay = 0;
      support = getLeavePayForMonth(state.monthlyOrdinaryWage, month);
    } else if (bestCode === 'SHORT_FIRST' && month <= shortMonthsPlanned) {
      status = '단축근무';
      companyPay = result.shortPay.companyPay;
      support = result.shortPay.governmentSupport;
    } else if (bestCode === 'LEAVE_FIRST' && month > leaveMonthsPlanned && month <= leaveMonthsPlanned + shortMonthsPlanned) {
      status = '단축근무';
      companyPay = result.shortPay.companyPay;
      support = result.shortPay.governmentSupport;
    } else if (bestCode === 'MIXED' && month % 2 === 0 && month <= leaveMonthsPlanned + shortMonthsPlanned) {
      status = '단축근무';
      companyPay = result.shortPay.companyPay;
      support = result.shortPay.governmentSupport;
    }

    rows.push({
      month,
      status,
      companyPay: Math.round(companyPay),
      support: Math.round(support),
      total: Math.round(companyPay + support)
    });
  }

  return rows;
}

function updateSummary(state, result, scenarios) {
  $('plswLeaveMaxSummary').textContent = formatMonths(result.leaveMaxMonths);
  $('plswLeaveRemainSummary').textContent = formatMonths(result.leaveRemainingMonths);
  $('plswShortMaxSummary').textContent = formatMonths(result.shortMaxMonths);
  $('plswShortRemainSummary').textContent = formatMonths(result.shortRemainingMonths);
  $('plswShortPaySummary').textContent = formatKoreanAmount(result.shortPay.estimatedMonthlyTotal);
  $('plswBestStrategySummary').textContent = scenarios.bestRow.label;
  $('plswLeaveExpirySummary').textContent = result.leaveExpiry;
  $('plswShortExpirySummary').textContent = result.shortExpiry;

  $('plswEligibilityValue').textContent = `${result.leaveMaxMonths}개월`;
  $('plswEligibilityReason').textContent = result.leaveMaxMonths === 18 ? '연장 조건 충족' : '기본 한도 적용';
  $('plswShortTotalValue').textContent = formatMonths(result.shortMaxMonths);
  $('plswShortReason').textContent = result.leaveRemainingMonths > 0 ? '미사용 휴직 2배 가산' : '기본 12개월 기준';
  $('plswEligibilityNote').textContent = result.warning || `${result.leaveInfo.reason} · 단축근무는 기본 12개월 + 남은 육아휴직 ${formatMonths(result.leaveRemainingMonths)}의 2배를 반영했습니다.`;

  $('plswCompanyPay').textContent = formatKoreanAmount(result.shortPay.companyPay);
  $('plswGovernmentSupport').textContent = formatKoreanAmount(result.shortPay.governmentSupport);
  $('plswEstimatedTotal').textContent = formatKoreanAmount(result.shortPay.estimatedMonthlyTotal);
  $('plswDeltaCopy').textContent = result.shortPay.deltaVsOriginal >= 0
    ? `기존 월급 대비 ${formatKoreanAmount(result.shortPay.deltaVsOriginal)} 증가`
    : `기존 월급 대비 ${formatKoreanAmount(Math.abs(result.shortPay.deltaVsOriginal))} 감소`;
  const firstTenNote = result.shortPay.firstTenHours > 0 ? `최초 ${result.shortPay.firstTenHours}시간: ${formatKoreanAmount(result.shortPay.supportFirst)}${result.shortPay.supportFirstHitCap ? ' (상한 적용)' : ' (상한 미도달)'}` : '최초 10시간 구간 없음';
  const extraNote = result.shortPay.extraHours > 0 ? `추가 ${result.shortPay.extraHours}시간: ${formatKoreanAmount(result.shortPay.supportExtra)}${result.shortPay.supportExtraHitCap ? ' (상한 적용)' : ' (상한 미도달)'}` : '추가 단축분 없음';
  $('plswPayNote').textContent = `회사 지급 ${formatKoreanAmount(result.shortPay.companyPay)} + 정부 지원 ${formatKoreanAmount(result.shortPay.governmentSupport)} 구조 · ${firstTenNote} · ${extraNote}`;
  $('plswReducedHoursLabel').textContent = `주 ${result.shortPay.reducedHours}시간 단축`;

  const firstFormulaValue = $('plswFormulaFirstValue');
  const firstFormulaCode = $('plswFormulaFirstCode');
  const extraFormulaValue = $('plswFormulaExtraValue');
  const extraFormulaCode = $('plswFormulaExtraCode');
  const formulaNote = $('plswFormulaNote');

  if (firstFormulaValue) {
    firstFormulaValue.textContent = result.shortPay.firstTenHours > 0
      ? formatKoreanAmount(result.shortPay.supportFirst)
      : '해당 없음';
  }

  if (firstFormulaCode) {
    firstFormulaCode.textContent = result.shortPay.firstTenHours > 0
      ? `min(${formatKoreanAmount(state.monthlyOrdinaryWage)}, ${formatKoreanAmount(POLICY.shortWorkFirstTenCap || 2500000)}) × ${result.shortPay.firstTenHours}/${state.weeklyHoursBefore}`
      : '최초 10시간 구간 없음';
  }

  if (extraFormulaValue) {
    extraFormulaValue.textContent = result.shortPay.extraHours > 0
      ? formatKoreanAmount(result.shortPay.supportExtra)
      : '해당 없음';
  }

  if (extraFormulaCode) {
    extraFormulaCode.textContent = result.shortPay.extraHours > 0
      ? `min(${formatKoreanAmount(state.monthlyOrdinaryWage * 0.8)}, ${formatKoreanAmount(POLICY.shortWorkExtraCap || 1600000)}) × ${result.shortPay.extraHours}/${state.weeklyHoursBefore}`
      : '추가 단축분 없음';
  }

  if (formulaNote) {
    formulaNote.textContent = result.shortPay.reducedHours > 0
      ? `최초 10시간 구간은 월 통상임금 100%에 250만원 상한을 먼저 비교하고, 추가 단축분은 월 통상임금 80%에 160만원 상한을 먼저 비교한 뒤 단축 전 주 근로시간 비율을 곱해 계산합니다. 현재 입력 기준 총 정부 지원금은 ${formatKoreanAmount(result.shortPay.governmentSupport)}입니다.`
      : '단축시간이 없어서 정부 지원금 계산식이 적용되지 않습니다.';
  }

  const firstRatio = result.shortPay.reducedHours > 0 ? (result.shortPay.firstTenHours / result.shortPay.reducedHours) * 100 : 0;
  const extraRatio = result.shortPay.reducedHours > 0 ? (result.shortPay.extraHours / result.shortPay.reducedHours) * 100 : 0;
  const firstBar = $('plswFirstTenBar');
  const extraBar = $('plswExtraBar');
  if (firstBar) firstBar.style.flex = String(Math.max(firstRatio, result.shortPay.reducedHours > 0 ? 1 : 0));
  if (extraBar) extraBar.style.flex = String(Math.max(extraRatio, result.shortPay.extraHours > 0 ? 1 : 0));

  $('plswScenarioNote').textContent = `자동 추천은 ${scenarios.autoRow.label} 시나리오입니다. 현재 선택은 ${scenarios.bestRow.label}입니다.`;
}

function renderScenarioTable(scenarios) {
  const tbody = $('plswScenarioTable');
  if (!tbody) return;
  tbody.innerHTML = scenarios.rows.map((row) => `
    <tr class="${row.code === scenarios.bestCode ? 'is-highlight' : ''}">
      <td><strong>${row.label}</strong></td>
      <td>${formatKoreanAmount(row.monthly)}</td>
      <td>${row.leave}</td>
      <td>${row.short}</td>
      <td>${row.insight}</td>
    </tr>
  `).join('');
}

function initOrUpdateChart(rows) {
  const canvas = $('plsw-timeline-chart');
  if (!canvas || !window.Chart) return;
  const labels = rows.map((row) => `${row.month}개월차`);
  const company = rows.map((row) => Math.round(row.companyPay / 10000));
  const support = rows.map((row) => Math.round(row.support / 10000));

  if (timelineChart) {
    timelineChart.data.labels = labels;
    timelineChart.data.datasets[0].data = company;
    timelineChart.data.datasets[1].data = support;
    timelineChart.update();
    return;
  }

  timelineChart = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '회사 지급',
          data: company,
          backgroundColor: '#B4B2A9',
          borderRadius: 4,
          borderSkipped: false,
          stack: 'cash'
        },
        {
          label: '지원금',
          data: support,
          backgroundColor: '#1D9E75',
          borderRadius: 4,
          borderSkipped: false,
          stack: 'cash'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}만원`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#888780', font: { size: 10 } }
        },
        y: {
          stacked: true,
          ticks: { callback: (value) => `${value}만`, color: '#888780', font: { size: 10 } },
          grid: { color: '#F0EFED' }
        }
      }
    }
  });
}

function renderTimeline(rows, scenarios) {
  const tbody = $('plswTimelineTable');
  if (tbody) {
    tbody.innerHTML = rows.map((row) => `
      <tr>
        <td>${row.month}개월차</td>
        <td>${row.status}</td>
        <td>${formatWon(row.companyPay)}</td>
        <td>${formatWon(row.support)}</td>
        <td>${formatWon(row.total)}</td>
      </tr>
    `).join('');
  }
  $('plswTimelineNote').textContent = `${scenarios.bestRow.label} 기준으로 앞으로 12개월 현금흐름을 단순화해 정리한 표입니다.`;
  initOrUpdateChart(rows);
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  const mapping = {
    birth: 'plswChildBirthDate',
    base: 'plswBaseDate',
    wage: 'plswMonthlyWage',
    wh: 'plswWeeklyBefore',
    rwh: 'plswWeeklyAfter',
    type: 'plswHouseholdType',
    leaveUsed: 'plswLeaveUsedMonths',
    shortUsed: 'plswShortUsedMonths',
    plan: 'plswPlannedLeaveMonths',
    scenario: 'plswScenarioMode'
  };

  Object.entries(mapping).forEach(([key, id]) => {
    const value = params.get(key);
    if (value !== null && $(id)) $(id).value = value;
  });

  if (params.has('spouse3') && $('plswSpouseUsedThreeMonths')) {
    $('plswSpouseUsedThreeMonths').checked = params.get('spouse3') === '1';
  }
}

function syncQuery(state) {
  const params = new URLSearchParams();
  params.set('birth', state.childBirthDate);
  params.set('base', state.baseDate);
  params.set('wage', String(Math.round(state.monthlyOrdinaryWage)));
  params.set('wh', String(state.weeklyHoursBefore));
  params.set('rwh', String(state.weeklyHoursAfter));
  params.set('type', state.householdType);
  params.set('spouse3', state.spouseUsedThreeMonths ? '1' : '0');
  params.set('leaveUsed', String(state.leaveUsedMonths));
  params.set('shortUsed', String(state.shortWorkUsedMonths));
  params.set('plan', String(state.plannedLeaveMonths));
  params.set('scenario', state.scenarioMode);
  const next = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', next);
}

function render() {
  const state = getState();
  syncHints(state);
  const result = calculate(state);
  const scenarios = buildScenarios(state, result);
  const timelineRows = buildTimeline(state, result, scenarios);
  updateSummary(state, result, scenarios);
  renderScenarioTable(scenarios);
  renderTimeline(timelineRows, scenarios);
  syncQuery(state);
}

function resetForm() {
  $('plswChildBirthDate').value = DEFAULTS.childBirthDate;
  $('plswBaseDate').value = DEFAULTS.baseDate;
  $('plswMonthlyWage').value = String(DEFAULTS.monthlyOrdinaryWage);
  $('plswWeeklyBefore').value = String(DEFAULTS.weeklyHoursBefore);
  $('plswWeeklyAfter').value = String(DEFAULTS.weeklyHoursAfter);
  $('plswHouseholdType').value = DEFAULTS.householdType;
  $('plswSpouseUsedThreeMonths').checked = Boolean(DEFAULTS.spouseUsedThreeMonths);
  $('plswLeaveUsedMonths').value = String(DEFAULTS.leaveUsedMonths);
  $('plswShortUsedMonths').value = String(DEFAULTS.shortWorkUsedMonths);
  $('plswPlannedLeaveMonths').value = String(DEFAULTS.plannedLeaveMonths);
  $('plswScenarioMode').value = DEFAULTS.scenarioMode;
  render();
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

const page = document.querySelector('[data-calculator]')?.dataset.calculator;
if (page === 'parental-leave-short-work-calculator') {
  applyQueryState();

  [
    'plswChildBirthDate',
    'plswBaseDate',
    'plswMonthlyWage',
    'plswWeeklyBefore',
    'plswWeeklyAfter',
    'plswHouseholdType',
    'plswLeaveUsedMonths',
    'plswShortUsedMonths',
    'plswPlannedLeaveMonths',
    'plswScenarioMode'
  ].forEach((id) => {
    const element = $(id);
    element?.addEventListener('input', render);
    element?.addEventListener('change', render);
  });

  $('plswSpouseUsedThreeMonths')?.addEventListener('change', render);
  $('calcPlswBtn')?.addEventListener('click', render);
  $('resetPlswBtn')?.addEventListener('click', () => {
    resetForm();
    flashButton($('resetPlswBtn'), '초기화됨');
  });
  $('copyPlswLinkBtn')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($('copyPlswLinkBtn'), '링크 복사됨');
    } catch {
      flashButton($('copyPlswLinkBtn'), '복사 실패');
    }
  });

  render();
}





