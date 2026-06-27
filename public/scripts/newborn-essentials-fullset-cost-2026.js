(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('nefcConfig').textContent);
  const ITEMS = cfg.items || [];
  const PRICE_TABLE = cfg.priceTable || {};
  const RESET_ITEMS = cfg.secondChildResetItems || [];
  const SEARCH_KEYWORD = cfg.itemSearchKeyword || {};

  const state = {
    checked: { ...(cfg.defaults?.checkedItems || {}) },
    grades: { ...(cfg.defaults?.itemGrades || {}) },
    secondChild: false,
  };

  let chartInst = null;

  const ITEM_LABELS = {};
  document.querySelectorAll('[data-nefc-item]').forEach((card) => {
    const id = card.dataset.nefcItem;
    const labelEl = card.querySelector('.nefc-item-check span');
    if (labelEl) ITEM_LABELS[id] = labelEl.textContent;
  });

  function itemCost(item, grade) {
    return (PRICE_TABLE[item] && PRICE_TABLE[item][grade]) || 0;
  }

  function calculate() {
    let selectedTotal = 0;
    const tierTotal = { frugal: 0, mid: 0, premium: 0 };

    ITEMS.forEach((item) => {
      if (!state.checked[item]) return;
      selectedTotal += itemCost(item, state.grades[item]);
      ['frugal', 'mid', 'premium'].forEach((grade) => {
        tierTotal[grade] += itemCost(item, grade);
      });
    });

    const savingVsPremium = tierTotal.premium - selectedTotal;
    const anySelected = ITEMS.some((item) => state.checked[item]);

    return { selectedTotal, tierTotal, savingVsPremium, anySelected };
  }

  function fw(v) {
    return Math.round(v).toLocaleString('ko-KR') + '원';
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderChart(result) {
    const ctx = document.getElementById('nefcTierChart');
    if (!ctx) return;
    const labels = ['가성비', '중급', '프리미엄'];
    const data = [
      Math.round(result.tierTotal.frugal),
      Math.round(result.tierTotal.mid),
      Math.round(result.tierTotal.premium),
    ];
    if (chartInst) {
      chartInst.data.datasets[0].data = data;
      chartInst.update();
      return;
    }
    chartInst = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '등급별 전체 합계',
            data,
            backgroundColor: ['#10b981', '#1a56db', '#f59e0b'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => `${c.raw.toLocaleString('ko-KR')}원` } },
        },
        scales: { y: { ticks: { callback: (v) => fw(v) } } },
      },
    });
  }

  function renderTable() {
    const tbody = document.getElementById('nefcItemTableBody');
    if (!tbody) return;
    tbody.innerHTML = ITEMS.map((item) => {
      const checked = state.checked[item];
      const grade = state.grades[item];
      const gradeLabel = { frugal: '가성비', mid: '중급', premium: '프리미엄' }[grade] || grade;
      const cost = checked ? itemCost(item, grade) : 0;
      const keyword = SEARCH_KEYWORD[item] || ITEM_LABELS[item] || item;
      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(keyword)}`;
      return `
        <tr class="${checked ? '' : 'is-muted'}">
          <td>${ITEM_LABELS[item] || item}</td>
          <td>${checked ? '선택' : '제외'}</td>
          <td>${checked ? gradeLabel : '-'}</td>
          <td>${checked ? fw(cost) : '0원 (합계 미포함)'}</td>
          <td><a class="nefc-item-link" href="${searchUrl}" target="_blank" rel="noreferrer">둘러보기</a></td>
        </tr>
      `;
    }).join('');
  }

  function render() {
    const result = calculate();
    setText('nefcSelectedTotal', fw(result.selectedTotal));
    setText('nefcPremiumTotal', fw(result.tierTotal.premium));
    setText('nefcSaving', fw(Math.max(result.savingVsPremium, 0)));
    renderChart(result);
    renderTable();
    syncQuery();
  }

  function syncQuery() {
    const params = new URLSearchParams();
    const offItems = ITEMS.filter((item) => !state.checked[item]);
    if (offItems.length > 0) params.set('off', offItems.join(','));
    const gradeEntries = ITEMS.filter((item) => state.grades[item] !== 'mid').map((item) => `${item}:${state.grades[item]}`);
    if (gradeEntries.length > 0) params.set('grades', gradeEntries.join(','));
    if (state.secondChild) params.set('second', '1');
    const query = params.toString();
    window.history.replaceState({}, '', query ? `${window.location.pathname}?${query}` : window.location.pathname);
  }

  function applyQuery() {
    const params = new URLSearchParams(window.location.search);
    const off = params.get('off');
    if (off) {
      off.split(',').forEach((item) => {
        if (item in state.checked) state.checked[item] = false;
      });
    }
    const grades = params.get('grades');
    if (grades) {
      grades.split(',').forEach((pair) => {
        const [item, grade] = pair.split(':');
        if (item in state.grades && grade) state.grades[item] = grade;
      });
    }
    if (params.get('second') === '1') {
      state.secondChild = true;
      RESET_ITEMS.forEach((item) => {
        state.checked[item] = false;
      });
    }
  }

  function syncUI() {
    ITEMS.forEach((item) => {
      const checkbox = document.querySelector(`[data-nefc-check="${item}"]`);
      if (checkbox) checkbox.checked = state.checked[item];
      document.querySelectorAll(`[data-nefc-grade-btn="${item}"]`).forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.nefcGradeValue === state.grades[item]);
      });
    });
    const secondChildToggle = document.getElementById('nefcSecondChild');
    if (secondChildToggle) secondChildToggle.checked = state.secondChild;
  }

  function bindEvents() {
    ITEMS.forEach((item) => {
      const checkbox = document.querySelector(`[data-nefc-check="${item}"]`);
      checkbox?.addEventListener('change', () => {
        state.checked[item] = checkbox.checked;
        render();
      });

      document.querySelectorAll(`[data-nefc-grade-btn="${item}"]`).forEach((btn) => {
        btn.addEventListener('click', () => {
          state.grades[item] = btn.dataset.nefcGradeValue;
          syncUI();
          render();
        });
      });
    });

    const secondChildToggle = document.getElementById('nefcSecondChild');
    secondChildToggle?.addEventListener('change', () => {
      state.secondChild = secondChildToggle.checked;
      if (state.secondChild) {
        RESET_ITEMS.forEach((item) => {
          state.checked[item] = false;
        });
        syncUI();
      }
      render();
    });

    document.getElementById('resetNefcBtn')?.addEventListener('click', () => {
      state.checked = { ...(cfg.defaults?.checkedItems || {}) };
      state.grades = { ...(cfg.defaults?.itemGrades || {}) };
      state.secondChild = false;
      syncUI();
      render();
    });

    document.getElementById('copyNefcLinkBtn')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        /* clipboard unavailable */
      }
    });
  }

  function loadChartJs(cb) {
    if (window.Chart) {
      cb();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    applyQuery();
    syncUI();
    bindEvents();
    loadChartJs(render);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
