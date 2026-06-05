/**
 * 2026 시도지사 당선자 재산 공개 비교 리포트
 * 기능: 테이블 정렬 + 정당별 차트 + 카드 스크롤
 */

(function () {
  'use strict';

  // ── 데이터 주입 ──────────────────────────────────────────────
  const dataEl = document.getElementById('lewaReportData');
  if (!dataEl) return;

  let report;
  try {
    report = JSON.parse(dataEl.textContent || '{}');
  } catch (e) {
    console.warn('[lewa] JSON parse error', e);
    return;
  }

  const winners = report.winners || [];

  // ── 유틸 ────────────────────────────────────────────────────
  function fmtEok(manWon) {
    if (!manWon || manWon === 0) return '확인중';
    const v = Number(manWon);
    if (isNaN(v)) return '—';
    if (v >= 10000) {
      const eok = Math.floor(v / 10000);
      const cheonMan = Math.floor((v % 10000) / 1000);
      if (cheonMan > 0) return `${eok}억 ${cheonMan}천만`;
      return `${eok}억`;
    }
    return `${v.toLocaleString('ko-KR')}만원`;
  }

  function fmtEokOrDash(manWon) {
    if (!manWon || manWon === 0) return '—';
    return fmtEok(manWon);
  }

  function partyCode(party) {
    if (party === '더불어민주당') return 'dp';
    if (party === '국민의힘') return 'ppp';
    return 'etc';
  }

  // ── 테이블 정렬 ──────────────────────────────────────────────
  const sortTabsEl = document.getElementById('lewaSortTabs');
  const tableBodyEl = document.getElementById('lewaTableBody');

  function sortWinners(mode) {
    const sorted = [...winners];
    if (mode === 'assetsDesc') {
      sorted.sort((a, b) => {
        if (b.totalAsset === 0 && a.totalAsset === 0) return 0;
        if (b.totalAsset === 0) return -1;
        if (a.totalAsset === 0) return 1;
        return b.totalAsset - a.totalAsset;
      });
    } else if (mode === 'regionAsc') {
      sorted.sort((a, b) => a.regionNameKo.localeCompare(b.regionNameKo));
    } else if (mode === 'partyAsc') {
      sorted.sort((a, b) => {
        const order = { '더불어민주당': 0, '국민의힘': 1 };
        const diff = (order[a.party] ?? 9) - (order[b.party] ?? 9);
        return diff !== 0 ? diff : b.totalAsset - a.totalAsset;
      });
    }
    return sorted;
  }

  function renderTable(mode) {
    if (!tableBodyEl) return;
    const sorted = sortWinners(mode);
    tableBodyEl.innerHTML = sorted.map((w, i) => {
      const pc = partyCode(w.party);
      const totalDisplay = fmtEok(w.totalAsset);
      const isZero = w.totalAsset === 0;
      return `<tr data-lewa-row="${w.regionId}" style="cursor:pointer" onclick="document.getElementById('lewa-card-${w.regionId}')?.scrollIntoView({behavior:'smooth',block:'start'})">
        <td class="lewa-rank-cell">${i + 1}</td>
        <td>${w.regionNameKo}</td>
        <td style="font-weight:700">${w.name}</td>
        <td><span class="lewa-party-badge lewa-party-badge--${pc}">${w.party}</span></td>
        <td class="lewa-money-cell${isZero ? ' lewa-money-cell--zero' : ''}">${totalDisplay}</td>
        <td class="lewa-money-cell lewa-money-cell--zero">${fmtEokOrDash(w.realEstate)}</td>
        <td class="lewa-money-cell lewa-money-cell--zero">${fmtEokOrDash(w.deposit + w.stock)}</td>
        <td class="lewa-money-cell lewa-money-cell--zero">${fmtEokOrDash(w.debt)}</td>
        <td class="lewa-badge-cell"><span style="background:${w.badge === '공개' ? '#d1fae5' : '#fef3c7'};color:${w.badge === '공개' ? '#065f46' : '#92400e'}">${w.badge}</span></td>
      </tr>`;
    }).join('');
  }

  let currentSort = 'assetsDesc';
  renderTable(currentSort);

  if (sortTabsEl) {
    sortTabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lewa-sort]');
      if (!btn) return;
      const mode = btn.dataset.lewaSort;
      currentSort = mode;
      sortTabsEl.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderTable(mode);
    });
  }

  // ── 정당별 차트 ─────────────────────────────────────────────
  function initChart() {
  const chartCanvas = document.getElementById('lewaPartyChart');
  if (chartCanvas && window.Chart) {
    const dpWinners = winners.filter(w => w.party === '더불어민주당' && w.totalAsset > 0);
    const pppWinners = winners.filter(w => w.party === '국민의힘' && w.totalAsset > 0);

    const dpAvg = dpWinners.length > 0
      ? Math.round(dpWinners.reduce((s, w) => s + w.totalAsset, 0) / dpWinners.length)
      : 0;
    const pppAvg = pppWinners.length > 0
      ? Math.round(pppWinners.reduce((s, w) => s + w.totalAsset, 0) / pppWinners.length)
      : 0;

    new window.Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ['더불어민주당', '국민의힘'],
        datasets: [{
          label: '평균 재산 (만원)',
          data: [dpAvg, pppAvg],
          backgroundColor: ['rgba(29,78,216,0.7)', 'rgba(185,28,28,0.7)'],
          borderColor: ['#1d4ed8', '#b91c1c'],
          borderWidth: 1,
          borderRadius: 6,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.x;
                if (!v) return ' 확인중';
                if (v >= 10000) return ` ${(v / 10000).toFixed(1)}억`;
                return ` ${v.toLocaleString('ko-KR')}만원`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (v) => v >= 10000 ? `${(v / 10000).toFixed(0)}억` : `${v}만`
            }
          }
        }
      }
    });

    // 정당 통계 카드 업데이트
    const dpAvgEl = document.getElementById('lewaDpAvg');
    const pppAvgEl = document.getElementById('lewaPppAvg');
    const dpCountEl = document.getElementById('lewaDpCount');
    const pppCountEl = document.getElementById('lewaPppCount');

    if (dpAvgEl) dpAvgEl.textContent = dpAvg > 0 ? fmtEok(dpAvg) : '집계중';
    if (pppAvgEl) pppAvgEl.textContent = pppAvg > 0 ? fmtEok(pppAvg) : '집계중';
    if (dpCountEl) dpCountEl.textContent = `${dpWinners.length}명 공개 기준`;
    if (pppCountEl) pppCountEl.textContent = `${pppWinners.length}명 공개 기준`;
  }
  }

  // Chart.js 로드 완료 후 실행
  if (window.Chart) {
    initChart();
  } else {
    const chartScript = document.querySelector('script[src*="chart.js"]');
    if (chartScript) {
      chartScript.addEventListener('load', initChart);
    } else {
      window.addEventListener('load', initChart);
    }
  }

})();
