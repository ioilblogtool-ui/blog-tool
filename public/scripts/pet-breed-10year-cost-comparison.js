(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('pbcConfig').textContent);
  const entries = cfg.entries;

  const state = {
    petType: 'dog',
    includePrice: false,
  };

  let chartInst = null;

  const DOG_COLOR = '#1a56db';
  const CAT_COLOR = '#7c3aed';
  const PRICE_COLOR = 'rgba(245,158,11,0.7)';

  function calc10Year(entry, includePrice) {
    const base = entry.monthlyCostAvg * 12 * 10;
    const price = includePrice ? (entry.purchasePriceMin + entry.purchasePriceMax) / 2 : 0;
    return base + price;
  }

  function fwShort(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억';
    if (v >= 10_000) return Math.round(v / 10_000) + '만';
    return v.toLocaleString('ko-KR');
  }

  function getFiltered() {
    return entries.filter(e => e.petType === state.petType)
      .sort((a, b) => b.monthlyCostAvg - a.monthlyCostAvg);
  }

  function renderChart() {
    const ctx = document.getElementById('pbcBarChart');
    if (!ctx) return;

    const filtered = getFiltered();
    const labels = filtered.map(e => e.name);
    const baseData = filtered.map(e => e.monthlyCostAvg * 12 * 10);
    const priceData = filtered.map(e =>
      state.includePrice ? (e.purchasePriceMin + e.purchasePriceMax) / 2 : 0
    );
    const barColor = state.petType === 'dog' ? DOG_COLOR : CAT_COLOR;

    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = baseData;
      chartInst.data.datasets[0].backgroundColor = barColor;
      chartInst.data.datasets[1].data = priceData;
      chartInst.update();
      return;
    }

    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '10년 생활비',
            data: baseData,
            backgroundColor: barColor,
            borderRadius: 4,
          },
          {
            label: '분양가 평균',
            data: priceData,
            backgroundColor: PRICE_COLOR,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${fwShort(ctx.raw)}원`,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { callback: v => fwShort(v) + '원' },
          },
          y: { stacked: true },
        },
      },
    });
  }

  function filterCards() {
    document.querySelectorAll('.pbc-breed-card').forEach(card => {
      card.style.display = card.dataset.pbcType === state.petType ? '' : 'none';
    });
  }

  function update() {
    renderChart();
    filterCards();
  }

  function bindTabs() {
    document.querySelectorAll('[data-pbc-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-pbc-tab]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.petType = btn.dataset.pbcTab;
        update();
      });
    });
  }

  function bindPriceToggle() {
    const cb = document.querySelector('[data-pbc-include-price]');
    if (!cb) return;
    cb.addEventListener('change', () => {
      state.includePrice = cb.checked;
      update();
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
    filterCards();
    bindTabs();
    bindPriceToggle();
    loadChartJs(renderChart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
