/**
 * 광역단체장 후보 재산 비교 2026
 * 기능: 테이블 정렬 전환 + Chart.js 정당별 평균 가로 막대
 */

(function () {
  'use strict';

  // ── 데이터 주입 ────────────────────────────────────────────────────────────
  const dataEl = document.getElementById('gmcaReportData');
  if (!dataEl) return;

  let report;
  try {
    report = JSON.parse(dataEl.textContent || '{}');
  } catch (e) {
    console.warn('[gmca] JSON parse error', e);
    return;
  }

  const candidates = report.candidates || [];
  const partyAverages = report.partyAverages || [];

  // ── 유틸 ──────────────────────────────────────────────────────────────────
  function fmtEok(manWon) {
    if (manWon === null || manWon === undefined || manWon === '') return '—';
    const v = Number(manWon);
    if (isNaN(v)) return '—';
    const eok = Math.floor(v / 10000);
    const cheonMan = Math.floor((v % 10000) / 1000);
    if (eok === 0) return `${v.toLocaleString('ko-KR')}만 원`;
    if (cheonMan > 0) return `${eok}억 ${cheonMan}천만`;
    return `${eok}억`;
  }

  function partyBadgeClass(code) {
    return `gmca-party-badge gmca-party-badge--${code}`;
  }

  // ── 테이블 정렬 ───────────────────────────────────────────────────────────
  const sortTabsEl = document.getElementById('gmcaSortTabs');
  const tableBodyEl = document.getElementById('gmcaTableBody');

  function sortCandidates(mode) {
    const sorted = [...candidates];
    if (mode === 'assetsDesc') {
      sorted.sort((a, b) => b.totalAssets - a.totalAssets);
    } else if (mode === 'assetsAsc') {
      sorted.sort((a, b) => a.totalAssets - b.totalAssets);
    } else if (mode === 'regionAsc') {
      sorted.sort((a, b) => a.regionCode.localeCompare(b.regionCode));
    } else if (mode === 'partyAsc') {
      const order = { ppp: 0, dp: 1, rebuilding: 2, etc: 3 };
      sorted.sort((a, b) => {
        const diff = (order[a.partyCode] ?? 9) - (order[b.partyCode] ?? 9);
        return diff !== 0 ? diff : b.totalAssets - a.totalAssets;
      });
    }
    return sorted;
  }

  function renderTable(sorted) {
    if (!tableBodyEl) return;
    const rows = sorted.map((c, i) => {
      const debtStr = (c.debt !== null && c.debt > 0)
        ? `<span class="gmca-debt-val">${fmtEok(c.debt)}</span>`
        : fmtEok(c.debt);

      return `<tr
        data-total="${c.totalAssets}"
        data-region="${c.regionCode}"
        data-party="${c.partyCode}"
      >
        <td class="col-rank">${i + 1}</td>
        <td class="col-name gmca-name-cell"><span class="gmca-name">${c.name}</span></td>
        <td class="col-party"><span class="${partyBadgeClass(c.partyCode)}">${c.party}</span></td>
        <td class="col-region">${c.regionShort}</td>
        <td class="col-total gmca-total">${fmtEok(c.totalAssets)}</td>
        <td class="col-re">${fmtEok(c.realEstate)}</td>
        <td class="col-fin">${fmtEok(c.financialAssets)}</td>
        <td class="col-debt">${debtStr}</td>
        <td class="col-note gmca-note">${c.note || ''}</td>
      </tr>`;
    });
    tableBodyEl.innerHTML = rows.join('');
  }

  if (sortTabsEl) {
    sortTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-sort]');
      if (!btn) return;
      sortTabsEl.querySelectorAll('.gmca-tab-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderTable(sortCandidates(btn.dataset.sort));
    });
  }

  // ── Chart.js 정당별 평균 가로 막대 ────────────────────────────────────────
  function initPartyChart() {
    const canvas = document.getElementById('gmcaPartyChart');
    if (!canvas || !window.Chart) return;

    const filtered = partyAverages.filter((p) => p.candidateCount > 0);
    if (!filtered.length) return;

    const labels = filtered.map((p) => `${p.partyLabel} (${p.candidateCount}명)`);
    const values = filtered.map((p) => Math.round(p.averageAssets / 10000)); // 억 원
    const colors = filtered.map((p) => p.color || '#9ca3af');

    new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '평균 재산 (억 원)',
            data: values,
            backgroundColor: colors.map((c) => c + 'cc'),
            borderColor: colors,
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x.toLocaleString('ko-KR')}억 원`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `${v}억`,
              font: { size: 12 },
            },
            grid: { color: '#f1f5f9' },
          },
          y: {
            ticks: { font: { size: 13 } },
            grid: { display: false },
          },
        },
      },
    });
  }

  // Chart.js 로드 타이밍 대응
  if (window.Chart) {
    initPartyChart();
  } else {
    const scripts = document.querySelectorAll('script[src*="chart"]');
    if (scripts.length) {
      scripts[scripts.length - 1].addEventListener('load', initPartyChart);
    } else {
      window.addEventListener('load', initPartyChart);
    }
  }
})();
