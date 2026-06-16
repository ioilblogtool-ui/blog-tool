(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('picConfig').textContent);

  const state = {
    monthlyPremium: cfg.defaults.monthlyPremium,
    coverageLimit: cfg.defaults.coverageLimit,
    coverageRate: cfg.defaults.coverageRate,
    annualRoutine: cfg.defaults.annualRoutine,
    emergencyProb: cfg.defaults.emergencyProb,
    emergencyCost: cfg.defaults.emergencyCost,
    analysisYears: cfg.defaults.analysisYears,
  };

  let chartInst = null;

  // ── 계산 ──────────────────────────────────────────────────
  function calcResult(overrides) {
    const d = Object.assign({}, state, overrides || {});
    const annualPremium = d.monthlyPremium * 12;
    const annualExpected = d.annualRoutine + d.emergencyProb * d.emergencyCost;
    const coverable = Math.min(annualExpected, d.coverageLimit);
    const covered = coverable * d.coverageRate;
    const selfPay = annualExpected - covered;
    const insuranceAnnual = annualPremium + selfPay;
    const noInsuranceAnnual = annualExpected;

    const insuranceCum = [], noInsuranceCum = [];
    for (let y = 1; y <= d.analysisYears; y++) {
      insuranceCum.push(insuranceAnnual * y);
      noInsuranceCum.push(noInsuranceAnnual * y);
    }

    // 손익분기점: 누적 보험료 = 응급 1회 보장금액이 되는 시점
    const coveredOnce = Math.min(d.emergencyCost, d.coverageLimit) * d.coverageRate;
    const breakEvenYears = annualPremium > 0 ? coveredOnce / annualPremium : null;

    const lastY = d.analysisYears;
    const saving = noInsuranceCum[lastY - 1] - insuranceCum[lastY - 1];

    return { annualPremium, insuranceAnnual, noInsuranceAnnual, insuranceCum, noInsuranceCum, breakEvenYears, coveredOnce, saving };
  }

  // ── 포맷 ──────────────────────────────────────────────────
  function fw(v) { return Math.round(v).toLocaleString('ko-KR') + '원'; }
  function fws(v) {
    const abs = Math.abs(v);
    let str;
    if (abs >= 100_000_000) str = (abs / 100_000_000).toFixed(1) + '억원';
    else if (abs >= 10_000) str = Math.round(abs / 10_000) + '만원';
    else str = abs.toLocaleString('ko-KR') + '원';
    return v < 0 ? '-' + str : str;
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-pic-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  // ── 차트 ──────────────────────────────────────────────────
  function renderChart(result) {
    const ctx = document.getElementById('picLineChart');
    if (!ctx) return;

    const labels = Array.from({ length: state.analysisYears }, (_, i) => `${i + 1}년`);
    const insData = result.insuranceCum.map(Math.round);
    const noInsData = result.noInsuranceCum.map(Math.round);

    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = insData;
      chartInst.data.datasets[1].data = noInsData;
      chartInst.update();
      return;
    }

    chartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '보험 가입', data: insData, borderColor: '#1a56db', backgroundColor: 'rgba(26,86,219,0.08)', tension: 0.3, fill: false },
          { label: '비보험', data: noInsData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.08)', tension: 0.3, fill: false },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}원` } },
        },
        scales: {
          y: { ticks: { callback: v => fws(v) } },
        },
      },
    });
  }

  // ── 시나리오 ──────────────────────────────────────────────
  function calcScenario(overrides) {
    const r = calcResult(overrides);
    const saving = r.noInsuranceCum[state.analysisYears - 1] - r.insuranceCum[state.analysisYears - 1];
    if (saving > 0) return `${state.analysisYears}년 후 보험이 ${fws(saving)} 절감`;
    return `${state.analysisYears}년 후 비보험이 ${fws(-saving)} 저렴`;
  }

  // ── 렌더 ──────────────────────────────────────────────────
  function render() {
    const result = calcResult();
    const { analysisYears } = state;

    // KPI
    if (result.breakEvenYears !== null) {
      const beY = result.breakEvenYears;
      setResult('breakEven', beY < 1 ? '1년 미만' : `약 ${beY.toFixed(1)}년`);
      setResult('breakEvenLabel', '응급 1회 보장금액 회수 시점');
    } else {
      setResult('breakEven', '—');
      setResult('breakEvenLabel', '계산 불가');
    }
    setResult('insuranceAnnual', fw(result.insuranceAnnual));
    setResult('noInsuranceAnnual', fw(result.noInsuranceAnnual));
    setResult('savingLabel', `${analysisYears}년 ${result.saving >= 0 ? '절감액' : '추가부담'}`);
    setResult('saving', fws(result.saving));

    // 결론
    const conclusionEl = document.querySelector('[data-pic-result="conclusion"]');
    if (conclusionEl) {
      if (result.saving > 0) {
        conclusionEl.innerHTML = `<strong>✅ 보험 가입이 유리합니다</strong><br>입력하신 조건에서 ${analysisYears}년간 보험이 비보험 대비 <em>${fws(result.saving)}</em> 절감 예상입니다.`;
        conclusionEl.className = 'pic-conclusion pic-conclusion--better';
      } else {
        conclusionEl.innerHTML = `<strong>비보험이 유리합니다</strong><br>입력하신 조건에서 ${analysisYears}년간 비보험이 보험 대비 <em>${fws(-result.saving)}</em> 저렴합니다. 단, 응급 발생 시 전액 본인 부담입니다.`;
        conclusionEl.className = 'pic-conclusion pic-conclusion--neutral';
      }
    }

    // 시나리오
    setResult('scenarioGood', calcScenario({ emergencyProb: 0 }));
    setResult('scenarioAvg', calcScenario());
    setResult('scenarioBad', calcScenario({ emergencyProb: 1, emergencyCost: 3_000_000 }));

    renderChart(result);
  }

  // ── 슬라이더/숫자 동기화 ──────────────────────────────────
  function syncNumFromSlider(key, rawVal) {
    // coverageRatePct / emergencyProbPct → 비율로 변환
    if (key === 'coverageRatePct') { state.coverageRate = rawVal / 100; }
    else if (key === 'emergencyProbPct') { state.emergencyProb = rawVal / 100; }
    else { state[key] = rawVal; }
    document.querySelectorAll(`[data-pic-num="${key}"]`).forEach(el => {
      el.value = rawVal.toLocaleString('ko-KR');
    });
  }

  // ── 프리셋 ────────────────────────────────────────────────
  function applyPreset(presetId) {
    const preset = cfg.presets.find(p => p.id === presetId);
    if (!preset) return;
    state.monthlyPremium = preset.monthlyPremium;
    state.coverageLimit = preset.coverageLimit;
    state.coverageRate = preset.coverageRate;
    syncElsFromState();
    render();
  }

  function syncElsFromState() {
    const map = {
      monthlyPremium: state.monthlyPremium,
      coverageLimit: state.coverageLimit,
      coverageRatePct: Math.round(state.coverageRate * 100),
      annualRoutine: state.annualRoutine,
      emergencyProbPct: Math.round(state.emergencyProb * 100),
      emergencyCost: state.emergencyCost,
      analysisYears: state.analysisYears,
    };
    Object.entries(map).forEach(([key, val]) => {
      document.querySelectorAll(`[data-pic="${key}"]`).forEach(el => { el.value = val; });
      document.querySelectorAll(`[data-pic-num="${key}"]`).forEach(el => {
        el.value = val.toLocaleString('ko-KR');
      });
    });
  }

  // ── 이벤트 ────────────────────────────────────────────────
  function bindEvents() {
    document.querySelectorAll('[data-pic]').forEach(el => {
      el.addEventListener('input', () => {
        syncNumFromSlider(el.dataset.pic, Number(el.value));
        render();
      });
    });

    document.querySelectorAll('[data-pic-num]').forEach(el => {
      el.addEventListener('change', () => {
        const key = el.dataset.picNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (isNaN(raw)) return;
        syncNumFromSlider(key, raw);
        document.querySelectorAll(`[data-pic="${key}"]`).forEach(s => { s.value = raw; });
        el.value = raw.toLocaleString('ko-KR');
        render();
      });
    });

    const presetSel = document.querySelector('[data-pic-preset]');
    if (presetSel) {
      presetSel.addEventListener('change', () => applyPreset(presetSel.value));
    }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
