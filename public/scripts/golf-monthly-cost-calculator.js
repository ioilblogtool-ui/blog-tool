(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('gmcConfig').textContent);
  const state = { ...cfg.defaults };
  const CHART_COLORS = ['#1a56db', '#0ea5e9', '#14b8a6', '#f59e0b', '#6b7280'];
  let chartInst = null;

  function calculate() {
    const roundingMonthly =
      state.roundingCount *
      (state.greenFee +
        (state.hasCaddy ? state.caddyFee : 0) +
        (state.hasCart ? state.cartFee : 0) +
        state.mealCost);

    const practiceMonthly =
      state.practiceType === 'monthly'
        ? state.practiceMonthly
        : state.practiceType === 'session'
        ? state.practiceSessionCount * state.practiceSessionPrice
        : 0;

    const equipMonthly = state.clubPrice / state.clubYears / 12 + state.consumables + state.shoesAnnual / 12;
    const apparelMonthly = state.apparelAnnual / 12;
    const otherMonthly = state.insurance + state.screenCount * state.screenPrice + state.roundingCount * state.transportPerRound;

    const totalMonthly = roundingMonthly + practiceMonthly + equipMonthly + apparelMonthly + otherMonthly;
    const totalAnnual = totalMonthly * 12;
    const costPerRound = state.roundingCount > 0 ? totalMonthly / state.roundingCount : 0;

    const breakdown = [
      { label: '라운딩', monthly: roundingMonthly },
      { label: '연습장', monthly: practiceMonthly },
      { label: '장비 감가', monthly: equipMonthly },
      { label: '의류', monthly: apparelMonthly },
      { label: '기타', monthly: otherMonthly },
    ];

    return { roundingMonthly, totalMonthly, totalAnnual, costPerRound, breakdown };
  }

  function fw(v) { return Math.round(v).toLocaleString('ko-KR') + '원'; }
  function fws(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억원';
    if (v >= 10_000) return Math.round(v / 10_000) + '만원';
    return fw(v);
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-gmc-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  function renderChart(breakdown, total) {
    const ctx = document.getElementById('gmcDonutChart');
    if (!ctx) return;
    const data = breakdown.map(b => Math.round(b.monthly));
    const labels = breakdown.map(b => b.label);
    if (chartInst) {
      chartInst.data.datasets[0].data = data;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: CHART_COLORS, borderWidth: 2 }] },
      options: {
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return `${ctx.label}: ${val.toLocaleString('ko-KR')}원 (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  function renderTable(breakdown, total) {
    const tbody = document.getElementById('gmcTableBody');
    if (!tbody) return;
    tbody.innerHTML = breakdown.map(b => {
      const pct = total > 0 ? ((b.monthly / total) * 100).toFixed(1) : 0;
      return `<tr><td>${b.label}</td><td>${fw(b.monthly)}</td><td>${fw(b.monthly * 12)}</td><td>${pct}%</td></tr>`;
    }).join('');
  }

  function render() {
    const result = calculate();
    setResult('totalMonthly', fws(result.totalMonthly));
    setResult('totalAnnual', fws(result.totalAnnual));
    setResult('roundingRatio', result.totalMonthly > 0 ? ((result.roundingMonthly / result.totalMonthly) * 100).toFixed(1) + '%' : '—');
    setResult('costPerRound', result.costPerRound > 0 ? fw(result.costPerRound) : '—');
    setResult('totalMonthlyFoot', fw(result.totalMonthly));
    setResult('totalAnnualFoot', fw(result.totalAnnual));
    renderChart(result.breakdown, result.totalMonthly);
    renderTable(result.breakdown, result.totalMonthly);

    const box = document.querySelector('[data-gmc-result="compareText"]');
    if (box) {
      const annual = result.totalAnnual;
      box.innerHTML = `<strong>같은 금액으로...</strong> 헬스장 월정액 ${Math.round(annual / 80_000)}개월치 · 테니스 레슨 ${Math.round(annual / 120_000)}개월치 이용 가능`;
    }
  }

  function syncNumFromSlider(key, el) {
    state[key] = Number(el.value);
    document.querySelectorAll(`[data-gmc-num="${key}"]`).forEach(n => { n.value = Number(el.value).toLocaleString('ko-KR'); });
  }

  function syncSliderFromNum(key, val) {
    state[key] = val;
    document.querySelectorAll(`[data-gmc="${key}"]`).forEach(s => { s.value = val; });
  }

  function bindSectionToggles() {
    document.querySelectorAll('[data-gmc-toggle]').forEach(header => {
      header.addEventListener('click', () => {
        const key = header.dataset.gmcToggle;
        const body = document.querySelector(`[data-gmc-body="${key}"]`);
        const arrow = header.querySelector('.gmc-section-arrow');
        if (!body) return;
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : '';
        if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
      });
    });
  }

  function bindPracticeType() {
    document.querySelectorAll('[name="practiceType"]').forEach(radio => {
      radio.addEventListener('change', () => {
        state.practiceType = radio.value;
        ['monthly', 'session'].forEach(t => {
          const el = document.querySelector(`[data-gmc-show="practiceType-${t}"]`);
          if (el) el.style.display = state.practiceType === t ? '' : 'none';
        });
        render();
      });
    });
  }

  function bindEvents() {
    document.querySelectorAll('[data-gmc]').forEach(el => {
      el.addEventListener('input', () => {
        syncNumFromSlider(el.dataset.gmc, el);
        render();
      });
    });

    document.querySelectorAll('[data-gmc-num]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.gmcNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (!isNaN(raw)) { syncSliderFromNum(key, raw); render(); }
        el.value = state[key] != null ? state[key].toLocaleString('ko-KR') : raw.toLocaleString('ko-KR');
      });
    });

    document.querySelectorAll('[data-gmc-bool]').forEach(el => {
      el.addEventListener('change', () => {
        state[el.dataset.gmcBool] = el.checked;
        render();
      });
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    bindSectionToggles();
    bindPracticeType();
    bindEvents();
    loadChartJs(render);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
