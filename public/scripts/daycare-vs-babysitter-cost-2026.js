(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('dvbConfig').textContent);
  const state = { ...cfg.defaults };
  let chartInst = null;

  const WEEKS_PER_MONTH = 4.345;

  function calculateShortWork(input) {
    const policy = cfg.shortWorkPolicy || {};
    const before = Math.max(input.weeklyHoursBefore, 1);
    const after = Math.max(Math.min(input.weeklyHoursAfter, before), 0);
    const monthlyWage = Math.max(input.monthlyOrdinaryWage, 0);
    const reducedHours = Math.max(before - after, 0);
    const firstTenHours = Math.min(reducedHours, 10);
    const extraHours = Math.max(reducedHours - 10, 0);
    const minBase = policy.minimumBaseWage || 500000;
    const firstCap = policy.firstTenHoursCapWage || 2500000;
    const extraCap = policy.extraHoursCapWage || 1600000;

    const companyPay = monthlyWage * (after / before);

    const firstBase = firstTenHours > 0 ? Math.min(Math.max(monthlyWage, minBase), firstCap) : 0;
    const firstSupport = firstBase * (firstTenHours / before);
    const extraRawBase = monthlyWage * 0.8;
    const extraBase = extraHours > 0 ? Math.min(Math.max(extraRawBase, minBase), extraCap) : 0;
    const extraSupport = extraBase * (extraHours / before);
    const governmentSupport = reducedHours > 0 ? firstSupport + extraSupport : 0;
    const estimatedTotal = companyPay + governmentSupport;
    const incomeLoss = Math.max(monthlyWage - estimatedTotal, 0);

    return { companyPay, governmentSupport, estimatedTotal, incomeLoss };
  }

  function calculate(input) {
    const daycareSubsidy = (cfg.daycareSubsidy || {})[input.childAge] || 0;
    const daycareNetCost = Math.max(input.extraCostMonthly, 0);

    const homeCareAllowance = (cfg.homeCareAllowance || {})[input.childAge] || 0;

    let homeCareGross = 0;
    let homeCareGrossLabel = '인건비';
    if (input.homeCareMode === 'sitterFull' || input.homeCareMode === 'sitterPart') {
      homeCareGross = input.sitterHourlyWage * input.sitterWeeklyHours * WEEKS_PER_MONTH;
      homeCareGrossLabel = '베이비시터 인건비';
    } else {
      const shortWork = calculateShortWork(input);
      homeCareGross = shortWork.incomeLoss;
      homeCareGrossLabel = '단축근무 임금손실';
    }
    const homeCareNetCost = Math.max(homeCareGross - homeCareAllowance, 0);

    const monthlyDifference = homeCareNetCost - daycareNetCost;
    const cheaperOption = monthlyDifference >= 0 ? 'DAYCARE' : 'HOME_CARE';
    const annualDifference = Math.abs(monthlyDifference) * 12;

    return {
      daycareSubsidy,
      daycareNetCost,
      homeCareAllowance,
      homeCareGross,
      homeCareGrossLabel,
      homeCareNetCost,
      monthlyDifference,
      cheaperOption,
      annualDifference,
    };
  }

  function fw(v) {
    return Math.round(v).toLocaleString('ko-KR') + '원';
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-dvb-result="${key}"]`).forEach((el) => {
      el.textContent = val;
    });
  }

  function renderChart(result) {
    const ctx = document.getElementById('dvbBarChart');
    if (!ctx) return;
    const labels = ['어린이집', '가정보육'];
    const data = [Math.round(result.daycareNetCost), Math.round(result.homeCareNetCost)];
    if (chartInst) {
      chartInst.data.datasets[0].data = data;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '월 순부담액',
            data,
            backgroundColor: ['#1a56db', '#f59e0b'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.raw.toLocaleString('ko-KR')}원` } },
        },
        scales: { y: { ticks: { callback: (v) => fw(v) } } },
      },
    });
  }

  function syncSectionVisibility() {
    const isSitter = state.homeCareMode === 'sitterFull' || state.homeCareMode === 'sitterPart';
    const sitterSection = document.querySelector('[data-dvb-section="sitter"]');
    const shortWorkSection = document.querySelector('[data-dvb-section="shortWork"]');
    if (sitterSection) sitterSection.classList.toggle('is-hidden', !isSitter);
    if (shortWorkSection) shortWorkSection.classList.toggle('is-hidden', isSitter);

    if (state.homeCareMode === 'sitterFull') {
      state.sitterWeeklyHours = state.sitterWeeklyHours < 30 ? 40 : state.sitterWeeklyHours;
    } else if (state.homeCareMode === 'sitterPart') {
      state.sitterWeeklyHours = state.sitterWeeklyHours > 30 ? 20 : state.sitterWeeklyHours;
    }

    const sitterCta = document.querySelector('[data-dvb-cta="sitter"]');
    const shortWorkCta = document.querySelector('[data-dvb-cta="shortWork"]');
    if (sitterCta) sitterCta.classList.toggle('is-hidden', !isSitter);
    if (shortWorkCta) shortWorkCta.classList.toggle('is-hidden', isSitter);
  }

  function render() {
    syncSectionVisibility();
    const result = calculate(state);

    setResult('daycareSubsidy', fw(result.daycareSubsidy) + ' (체감 0원)');
    setResult('daycareExtra', fw(result.daycareNetCost));
    setResult('daycareNetCost', fw(result.daycareNetCost));
    setResult('homeCareGrossLabel', result.homeCareGrossLabel);
    setResult('homeCareGross', fw(result.homeCareGross));
    setResult('homeCareAllowance', fw(result.homeCareAllowance));
    setResult('homeCareNetCost', fw(result.homeCareNetCost));
    setResult('monthlyDifference', fw(Math.abs(result.monthlyDifference)));
    setResult('annualDifference', fw(result.annualDifference));

    const box = document.querySelector('[data-dvb-result="conclusionBox"]');
    if (box) {
      if (result.cheaperOption === 'DAYCARE') {
        box.className = 'dvb-conclusion dvb-conclusion--daycare';
        box.innerHTML = `<strong>🏫 어린이집이 더 저렴</strong> — 월 ${fw(Math.abs(result.monthlyDifference))}, 연간 ${fw(result.annualDifference)} 더 적게 듭니다.`;
      } else {
        box.className = 'dvb-conclusion dvb-conclusion--homecare';
        box.innerHTML = `<strong>🏠 가정보육이 더 저렴</strong> — 월 ${fw(Math.abs(result.monthlyDifference))}, 연간 ${fw(result.annualDifference)} 더 적게 듭니다.`;
      }
    }

    renderChart(result);
    syncQuery();
  }

  function syncQuery() {
    const params = new URLSearchParams();
    params.set('age', state.childAge);
    params.set('daycareType', state.daycareType);
    params.set('extra', String(Math.round(state.extraCostMonthly)));
    params.set('mode', state.homeCareMode);
    params.set('sitterWage', String(Math.round(state.sitterHourlyWage)));
    params.set('sitterHours', String(Math.round(state.sitterWeeklyHours)));
    params.set('wage', String(Math.round(state.monthlyOrdinaryWage)));
    params.set('wh', String(Math.round(state.weeklyHoursBefore)));
    params.set('rwh', String(Math.round(state.weeklyHoursAfter)));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  function applyQuery() {
    const params = new URLSearchParams(window.location.search);
    const mapping = {
      age: 'childAge',
      daycareType: 'daycareType',
      mode: 'homeCareMode',
    };
    Object.entries(mapping).forEach(([key, stateKey]) => {
      const value = params.get(key);
      if (value) state[stateKey] = value;
    });
    const numberMapping = {
      extra: 'extraCostMonthly',
      sitterWage: 'sitterHourlyWage',
      sitterHours: 'sitterWeeklyHours',
      wage: 'monthlyOrdinaryWage',
      wh: 'weeklyHoursBefore',
      rwh: 'weeklyHoursAfter',
    };
    Object.entries(numberMapping).forEach(([key, stateKey]) => {
      const value = Number(params.get(key));
      if (value > 0) state[stateKey] = value;
    });
  }

  function syncChipUI() {
    document.querySelectorAll('[data-dvb-chip]').forEach((btn) => {
      const group = btn.dataset.dvbChip;
      const isActive = btn.dataset.dvbValue === state[group];
      btn.classList.toggle('is-active', isActive);
    });
  }

  function syncSliderUI() {
    [
      'extraCostMonthly',
      'sitterHourlyWage',
      'sitterWeeklyHours',
      'monthlyOrdinaryWage',
      'weeklyHoursBefore',
      'weeklyHoursAfter',
    ].forEach((key) => {
      document.querySelectorAll(`[data-dvb="${key}"]`).forEach((slider) => {
        slider.value = state[key];
      });
      document.querySelectorAll(`[data-dvb-num="${key}"]`).forEach((num) => {
        num.value = Number(state[key]).toLocaleString('ko-KR');
      });
    });
  }

  function bindEvents() {
    document.querySelectorAll('[data-dvb]').forEach((el) => {
      el.addEventListener('input', () => {
        const key = el.dataset.dvb;
        state[key] = Number(el.value);
        document.querySelectorAll(`[data-dvb-num="${key}"]`).forEach((n) => {
          n.value = Number(el.value).toLocaleString('ko-KR');
        });
        render();
      });
    });

    document.querySelectorAll('[data-dvb-num]').forEach((el) => {
      el.addEventListener('change', () => {
        const key = el.dataset.dvbNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (Number.isNaN(raw)) return;
        state[key] = raw;
        document.querySelectorAll(`[data-dvb="${key}"]`).forEach((s) => {
          s.value = raw;
        });
        el.value = raw.toLocaleString('ko-KR');
        render();
      });
    });

    document.querySelectorAll('[data-dvb-chip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.dvbChip;
        state[group] = btn.dataset.dvbValue;
        if (group === 'daycareType' && btn.dataset.dvbExtra) {
          state.extraCostMonthly = Number(btn.dataset.dvbExtra);
        }
        syncChipUI();
        syncSliderUI();
        render();
      });
    });

    document.querySelectorAll('[data-dvb-sitter-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.sitterHourlyWage = Number(btn.dataset.dvbSitterPreset);
        syncSliderUI();
        render();
      });
    });

    const resetBtn = document.getElementById('resetDvbBtn');
    resetBtn?.addEventListener('click', () => {
      Object.assign(state, cfg.defaults);
      syncChipUI();
      syncSliderUI();
      render();
    });

    const copyBtn = document.getElementById('copyDvbLinkBtn');
    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        /* clipboard unavailable */
      }
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) {
      cb();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    applyQuery();
    syncChipUI();
    syncSliderUI();
    bindEvents();
    loadChartJs(render);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
