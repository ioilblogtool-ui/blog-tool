/**
 * 직종별 연금 비교 리포트 2026
 * 기능: 납입 기간 탭 전환 → bar row 업데이트 + Chart.js 묶음 막대
 */

(function () {
  'use strict';

  const dataEl = document.getElementById('pbjcReportData');
  if (!dataEl) return;

  let report;
  try {
    report = JSON.parse(dataEl.textContent || '{}');
  } catch (e) {
    return;
  }

  const pensions = report.pensions || [];
  const termSimulations = report.termSimulations || [];

  // ── 납입 기간 탭 전환 + bar row 업데이트 ────────────────────────────────
  const tabsEl = document.getElementById('pbjcTermTabs');
  const barListEl = document.getElementById('pbjcBarList');

  function updateBars(termKey) {
    const sim = termSimulations.find((s) => s.termKey === termKey);
    if (!sim || !barListEl) return;

    const maxReceive = Math.max(...sim.rows.map((r) => r.monthlyReceiveMan));

    barListEl.querySelectorAll('.pbjc-bar-row').forEach((rowEl) => {
      const pensionId = rowEl.dataset.pension;
      const simRow = sim.rows.find((r) => r.pensionId === pensionId);
      if (!simRow) return;

      const pct = Math.max(4, Math.round((simRow.monthlyReceiveMan / maxReceive) * 100));
      const bar = rowEl.querySelector('.pbjc-bar-row__bar');
      const val = rowEl.querySelector('.pbjc-bar-row__val');

      if (bar) bar.style.width = pct + '%';
      if (val) val.childNodes[0].textContent = simRow.monthlyReceiveMan.toLocaleString('ko-KR') + '만 원';
    });
  }

  if (tabsEl) {
    tabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.pbjc-tab-btn');
      if (!btn) return;
      tabsEl.querySelectorAll('.pbjc-tab-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      updateBars(btn.dataset.term);
    });
  }

  // ── Chart.js 묶음 막대 ────────────────────────────────────────────────────
  function initChart() {
    const canvas = document.getElementById('pbjcTermChart');
    if (!canvas || !window.Chart) return;

    const labels = termSimulations.map((s) => s.termLabel);
    const datasets = pensions.map((pension) => ({
      label: pension.nameShort,
      data: termSimulations.map((sim) => {
        const row = sim.rows.find((r) => r.pensionId === pension.id);
        return row ? row.monthlyReceiveMan : 0;
      }),
      backgroundColor: pension.color + 'cc',
      borderColor: pension.color,
      borderWidth: 1.5,
      borderRadius: 4,
    }));

    new window.Chart(canvas, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 12 }, padding: 14 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('ko-KR')}만 원 (추정)`,
            },
          },
        },
        scales: {
          x: {
            ticks: { font: { size: 13 } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => v + '만',
              font: { size: 12 },
            },
            grid: { color: '#f1f5f9' },
          },
        },
      },
    });
  }

  if (window.Chart) {
    initChart();
  } else {
    const chartScript = document.querySelector('script[src*="chart"]');
    if (chartScript) {
      chartScript.addEventListener('load', initChart);
    } else {
      window.addEventListener('load', initChart);
    }
  }
})();
