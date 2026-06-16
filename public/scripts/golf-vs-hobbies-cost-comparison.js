(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('ghcConfig').textContent);
  const hobbies = cfg.hobbies;

  let activeTab = 'monthly';
  let chartInst = null;

  const TAB_FIELD = { monthly: 'monthlyAvg', fiveYear: 'fiveYearTotal', tenYear: 'tenYearTotal' };
  const TAB_LABEL = { monthly: '월 비용 (원)', fiveYear: '5년 총비용 (원)', tenYear: '10년 총비용 (원)' };
  const GOLF_COLOR = '#1a56db';
  const OTHER_COLOR = '#94a3b8';

  function fwShort(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억';
    if (v >= 10_000) return Math.round(v / 10_000) + '만';
    return v.toLocaleString('ko-KR');
  }

  function renderChart(tab) {
    const ctx = document.getElementById('ghcBarChart');
    if (!ctx) return;

    const field = TAB_FIELD[tab];
    const sorted = [...hobbies].sort((a, b) => b[field] - a[field]);
    const labels = sorted.map(h => `${h.emoji} ${h.name}`);
    const data = sorted.map(h => h[field]);
    const colors = sorted.map(h => h.isGolf ? GOLF_COLOR : OTHER_COLOR);

    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = data;
      chartInst.data.datasets[0].backgroundColor = colors;
      chartInst.data.datasets[0].label = TAB_LABEL[tab];
      chartInst.options.plugins.title.text = TAB_LABEL[tab];
      chartInst.update();
      return;
    }

    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: TAB_LABEL[tab], data, backgroundColor: colors, borderRadius: 4 }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: TAB_LABEL[tab], font: { size: 14 } },
          tooltip: { callbacks: { label: ctx => fwShort(ctx.raw) + '원' } },
        },
        scales: {
          x: { ticks: { callback: v => fwShort(v) + '원' } },
        },
      },
    });
  }

  function bindTabs() {
    document.querySelectorAll('[data-ghc-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-ghc-tab]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeTab = btn.dataset.ghcTab;
        renderChart(activeTab);
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
    bindTabs();
    loadChartJs(() => renderChart(activeTab));
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
