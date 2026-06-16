(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('pmcConfig').textContent);

  const state = {
    petType: 'dog',
    values: {},
  };

  const ITEM_COLORS = {
    food: '#1a56db',
    snack: '#d97706',
    litter: '#64748b',
    medical: '#059669',
    grooming: '#7c3aed',
    toys: '#0891b2',
    insurance: '#be185d',
    hotel: '#92400e',
    training: '#374151',
  };

  let chartInst = null;

  // ── 계산 ──────────────────────────────────────────────────
  function calculate() {
    const monthly = Object.values(state.values).reduce((s, v) => s + v, 0);
    return {
      monthly,
      annual: monthly * 12,
      tenYear: monthly * 12 * 10,
      daily: Math.round(monthly / 30),
    };
  }

  // ── 포맷 ──────────────────────────────────────────────────
  function fw(v) { return Math.round(v).toLocaleString('ko-KR') + '원'; }
  function fws(v) {
    if (v >= 100_000_000) return (v / 100_000_000).toFixed(1) + '억원';
    if (v >= 10_000) return Math.round(v / 10_000) + '만원';
    return fw(v);
  }

  function setResult(key, val) {
    document.querySelectorAll(`[data-pmc-result="${key}"]`).forEach(el => { el.textContent = val; });
  }

  // ── 차트 ──────────────────────────────────────────────────
  function renderChart() {
    const ctx = document.getElementById('pmcDonutChart');
    if (!ctx) return;

    const filtered = cfg.items.filter(item => (state.values[item.id] || 0) > 0);
    const data = filtered.map(item => state.values[item.id] || 0);
    const labels = filtered.map(item => item.label);
    const colors = filtered.map(item => ITEM_COLORS[item.id] || '#94a3b8');

    if (chartInst) {
      chartInst.data.labels = labels;
      chartInst.data.datasets[0].data = data;
      chartInst.data.datasets[0].backgroundColor = colors;
      chartInst.update();
      return;
    }

    chartInst = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 2 }],
      },
      options: {
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12 } },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = ctx.chart.data.datasets[0].data.reduce((s, v) => s + v, 0);
                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return `${ctx.label}: ${ctx.raw.toLocaleString('ko-KR')}원 (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  // ── 렌더 ──────────────────────────────────────────────────
  function render() {
    const r = calculate();
    setResult('monthly', fws(r.monthly));
    setResult('annual', fws(r.annual));
    setResult('ten-year', fws(r.tenYear));
    setResult('daily', fw(r.daily));
    setResult('insight-coffee', `월 양육비는 커피(5,000원) 약 ${Math.round(r.monthly / 5000)}잔에 해당합니다.`);
    setResult('insight-daily', `하루 평균 ${Math.round(r.monthly / 30).toLocaleString('ko-KR')}원이 드는 셈입니다.`);
    renderChart();
    syncUrl();
  }

  // ── 탭 전환 ───────────────────────────────────────────────
  function switchPet(petType) {
    state.petType = petType;
    document.querySelectorAll('[data-pmc-pet]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.pmcPet === petType);
    });
    document.querySelectorAll('[data-pmc-item]').forEach(slider => {
      const key = petType === 'dog' ? 'defaultDog' : 'defaultCat';
      const val = Number(slider.dataset[key]);
      slider.value = val;
      state.values[slider.dataset.pmcItem] = val;
      const numEl = document.querySelector(`[data-pmc-num="${slider.dataset.pmcItem}"]`);
      if (numEl) numEl.value = val.toLocaleString('ko-KR');
    });
    render();
  }

  // ── URL 파라미터 ──────────────────────────────────────────
  function syncUrl() {
    const params = new URLSearchParams();
    params.set('pet', state.petType);
    Object.entries(state.values).forEach(([k, v]) => params.set(k, v));
    history.replaceState(null, '', '?' + params.toString());
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has('pet')) {
      const pet = params.get('pet');
      if (pet === 'dog' || pet === 'cat') state.petType = pet;
    }
    cfg.items.forEach(item => {
      if (params.has(item.id)) {
        const val = Number(params.get(item.id));
        if (!isNaN(val)) state.values[item.id] = val;
      }
    });
  }

  // ── 이벤트 ────────────────────────────────────────────────
  function bindPetTabs() {
    document.querySelectorAll('[data-pmc-pet]').forEach(btn => {
      btn.addEventListener('click', () => switchPet(btn.dataset.pmcPet));
    });
  }

  function bindSliders() {
    document.querySelectorAll('[data-pmc-item]').forEach(slider => {
      slider.addEventListener('input', () => {
        const id = slider.dataset.pmcItem;
        const val = Number(slider.value);
        state.values[id] = val;
        const numEl = document.querySelector(`[data-pmc-num="${id}"]`);
        if (numEl) numEl.value = val.toLocaleString('ko-KR');
        render();
      });
    });
  }

  function bindNumbers() {
    document.querySelectorAll('[data-pmc-num]').forEach(el => {
      el.addEventListener('change', () => {
        const id = el.dataset.pmcNum;
        const raw = Number(el.value.replace(/,/g, ''));
        if (isNaN(raw)) return;
        state.values[id] = raw;
        const slider = document.querySelector(`[data-pmc-item="${id}"]`);
        if (slider) slider.value = raw;
        el.value = raw.toLocaleString('ko-KR');
        render();
      });
    });
  }

  function bindOptionalToggle() {
    const btn = document.querySelector('[data-pmc-toggle="optional"]');
    const wrap = document.querySelector('.pmc-optional-wrap');
    if (!btn || !wrap) return;
    btn.addEventListener('click', () => {
      const hidden = wrap.hasAttribute('hidden');
      if (hidden) {
        wrap.removeAttribute('hidden');
        btn.textContent = '− 선택 항목 닫기';
      } else {
        wrap.setAttribute('hidden', '');
        btn.textContent = '+ 선택 항목 추가';
      }
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function applyStateToDOM() {
    document.querySelectorAll('[data-pmc-item]').forEach(slider => {
      const id = slider.dataset.pmcItem;
      if (state.values[id] !== undefined) {
        slider.value = state.values[id];
        const numEl = document.querySelector(`[data-pmc-num="${id}"]`);
        if (numEl) numEl.value = state.values[id].toLocaleString('ko-KR');
      }
    });
    document.querySelectorAll('[data-pmc-pet]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.pmcPet === state.petType);
    });
  }

  function init() {
    // 기본값 설정
    cfg.items.forEach(item => {
      state.values[item.id] = item.defaultDog;
    });

    restoreFromUrl();
    applyStateToDOM();
    bindPetTabs();
    bindSliders();
    bindNumbers();
    bindOptionalToggle();
    loadChartJs(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
