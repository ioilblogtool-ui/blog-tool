(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('gmpConfig').textContent);
  const state = { ...cfg.defaults };
  let activeScenario = 'base';
  let chartInst = null;

  function calcForScenario(s) {
    const d = { ...state };
    if (s === 'noLoss') d.resalePrice = d.membershipPrice;
    if (s === 'loss30') d.resalePrice = Math.round(d.membershipPrice * 0.7);

    const annualRoundings = d.roundingPerMonth * d.activeMonths;
    const memberAnnualRound = annualRoundings * (d.memberGreenFee + d.caddyFee + d.cartFee);
    const memberAnnual = memberAnnualRound + d.annualFee;
    const avgGreenFee = d.weekdayGreenFee * (1 - d.weekendRatio) + d.weekendGreenFee * d.weekendRatio;
    const publicAnnual = annualRoundings * (avgGreenFee + d.caddyFee + d.cartFee);
    const annualCapLoss = (d.membershipPrice - d.resalePrice) / d.holdingYears;

    const years = [];
    let breakEvenYear = null;
    for (let y = 1; y <= d.holdingYears; y++) {
      const memberCum = (memberAnnual + annualCapLoss) * y;
      const publicCum = publicAnnual * y;
      years.push({ year: y, memberCum, publicCum });
      if (!breakEvenYear && memberCum < publicCum) breakEvenYear = y;
    }

    const last = years[years.length - 1];
    const memberCostPerRound = annualRoundings > 0 ? (memberAnnual + annualCapLoss) / annualRoundings : 0;
    const publicCostPerRound = annualRoundings > 0 ? publicAnnual / annualRoundings : 0;

    return { memberAnnualRound, memberAnnual, publicAnnual, memberCostPerRound, publicCostPerRound, years, breakEvenYear, memberTotal: last.memberCum, publicTotal: last.publicCum };
  }

  function fw(v) { return Math.round(v).toLocaleString('ko-KR') + '원'; }
  function fws(v) {
    if (Math.abs(v) >= 100_000_000) return (Math.abs(v) / 100_000_000).toFixed(1) + '억원';
    if (Math.abs(v) >= 10_000) return Math.round(Math.abs(v) / 10_000) + '만원';
    return Math.abs(v).toLocaleString('ko-KR') + '원';
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-gmp-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  function renderChart(result) {
    const ctx = document.getElementById('gmpLineChart');
    if (!ctx) return;
    const labels = result.years.map(y => `${y.year}년`);
    const memberData = result.years.map(y => Math.round(y.memberCum));
    const publicData = result.years.map(y => Math.round(y.publicCum));
    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = memberData;
      chartInst.data.datasets[1].data = publicData;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '회원권', data: memberData, borderColor: '#1a56db', backgroundColor: 'rgba(26,86,219,0.1)', tension: 0.3, fill: false },
          { label: '퍼블릭', data: publicData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.3, fill: false },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}원` } },
        },
        scales: { y: { ticks: { callback: v => fws(v) } } },
      },
    });
  }

  function render() {
    const result = calcForScenario(activeScenario);
    const holdingYears = state.holdingYears;

    setResult('memberAnnualRound', fw(result.memberAnnualRound));
    setResult('memberAnnual', fw(result.memberAnnual));
    setResult('memberCostPerRound', fw(result.memberCostPerRound));
    setResult('publicAnnual', fw(result.publicAnnual));
    setResult('publicAnnual2', fw(result.publicAnnual));
    setResult('publicCostPerRound', fw(result.publicCostPerRound));
    setResult('totalLabel', `${holdingYears}년 총비용`);
    setResult('totalLabel2', `${holdingYears}년 총비용`);
    setResult('memberTotal', fws(result.memberTotal));
    setResult('publicTotal', fws(result.publicTotal));

    const box = document.querySelector('[data-gmp-result="conclusionBox"]');
    if (box) {
      const saving = result.publicTotal - result.memberTotal;
      if (result.breakEvenYear) {
        box.className = 'gmp-conclusion gmp-conclusion--member';
        box.innerHTML = `<strong>🏆 회원권 유리</strong> — ${result.breakEvenYear}년차부터 회원권이 유리합니다.<br>${holdingYears}년 후 <em>${fws(Math.abs(saving))}</em> 절감 예상`;
      } else {
        box.className = 'gmp-conclusion gmp-conclusion--public';
        box.innerHTML = `<strong>퍼블릭 유리</strong> — 현재 이용 패턴에서는 ${holdingYears}년간 퍼블릭이 <em>${fws(Math.abs(saving))}</em> 더 저렴합니다.`;
      }
    }

    renderChart(result);
  }

  function bindEvents() {
    document.querySelectorAll('[data-gmp]').forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.gmp;
        if (key === 'weekendRatioPct') {
          state.weekendRatio = Number(el.value) / 100;
          document.querySelectorAll('[data-gmp-num="weekendRatioPct"]').forEach(n => { n.value = el.value; });
        } else {
          state[key] = Number(el.value);
          document.querySelectorAll(`[data-gmp-num="${key}"]`).forEach(n => { n.value = Number(el.value).toLocaleString('ko-KR'); });
        }
        render();
      });
    });

    document.querySelectorAll('[data-gmp-num]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.gmpNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (isNaN(raw)) return;
        if (key === 'weekendRatioPct') {
          state.weekendRatio = raw / 100;
          document.querySelectorAll('[data-gmp="weekendRatioPct"]').forEach(s => { s.value = raw; });
          el.value = raw;
        } else {
          state[key] = raw;
          document.querySelectorAll(`[data-gmp="${key}"]`).forEach(s => { s.value = raw; });
          el.value = raw.toLocaleString('ko-KR');
        }
        render();
      });
    });

    document.querySelectorAll('[data-gmp-scenario]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-gmp-scenario]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeScenario = btn.dataset.gmpScenario;
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
    bindEvents();
    loadChartJs(render);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
