(() => {
  const DATA = JSON.parse(document.getElementById('nwcChartData').textContent);
  if (typeof Chart === 'undefined') return;

  // ── 섹션 02: 지역별 전세 보증금 Bar 차트 ──
  const regionCanvas = document.getElementById('nwcRegionChart');
  if (regionCanvas) {
    new Chart(regionCanvas, {
      type: 'bar',
      data: {
        labels: DATA.regionJeonse.map(d => d.region),
        datasets: [{
          label: '평균 전세 보증금 (만원)',
          data: DATA.regionJeonse.map(d => Math.round(d.avgDeposit / 10000)),
          backgroundColor: DATA.regionJeonse.map(d => d.color + 'cc'),
          borderColor: DATA.regionJeonse.map(d => d.color),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw.toLocaleString('ko-KR')}만원`,
            },
          },
        },
        scales: {
          x: { ticks: { callback: v => v.toLocaleString('ko-KR') + '만' } },
        },
      },
    });
  }

  // ── 섹션 05: 가계부 시뮬레이션 Bar 차트 ──
  const budgetCanvas = document.getElementById('nwcBudgetChart');
  if (budgetCanvas) {
    const labels = DATA.householdBudgets.map(b => b.label);
    new Chart(budgetCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '고정비',
            data: DATA.householdBudgets.map(b => Math.round(b.fixed / 10000)),
            backgroundColor: '#fca5a5cc',
            borderColor: '#dc2626',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: '변동비',
            data: DATA.householdBudgets.map(b => Math.round(b.variable / 10000)),
            backgroundColor: '#fcd34dcc',
            borderColor: '#d97706',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: '월 저축',
            data: DATA.householdBudgets.map(b => Math.round(b.savings / 10000)),
            backgroundColor: '#6ee7b7cc',
            borderColor: '#0f6e56',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}만원`,
            },
          },
        },
        scales: {
          y: { ticks: { callback: v => v.toLocaleString('ko-KR') + '만' } },
        },
      },
    });
  }

  // ── 섹션 12: 2016 vs 2026 비교 Bar 차트 ──
  const compareCanvas = document.getElementById('nwcCompareChart');
  if (compareCanvas) {
    const items = DATA.comparison2016;
    new Chart(compareCanvas, {
      type: 'bar',
      data: {
        labels: items.map(c => c.item),
        datasets: [
          {
            label: '2016',
            data: items.map(c => Math.round(c.val2016 / 10000)),
            backgroundColor: '#9ca3afcc',
            borderRadius: 4,
          },
          {
            label: '2026',
            data: items.map(c => Math.round(c.val2026 / 10000)),
            backgroundColor: '#1a56dbcc',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}만원`,
            },
          },
        },
        scales: {
          y: { ticks: { callback: v => v.toLocaleString('ko-KR') + '만' } },
        },
      },
    });
  }

  // ── 혼수 탭 전환 ──
  const tabs = document.querySelectorAll('.nwc-honsu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
    });
  });
})();
