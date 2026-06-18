(function () {
  'use strict';

  const cfg = JSON.parse(document.getElementById('bgsConfig').textContent);
  const { localSubsidy, ageOptions, parentalBenefit, childAllowance, firstMeeting,
          daycareSubsidy, kindergartenSubsidy, homeCare, pregnancyMedical,
          timeline, timelineLabels } = cfg;

  const state = {
    childCount: 1,
    children: [{ age: 'age0' }],
    region: '서울',
    care: 'home',
    income: 'low',
  };

  const CHILD_ALLOWANCE_AGES = ['age0', 'age1', 'age2', 'age3to5', 'age6to7'];

  // ── 자녀 입력 필드 렌더 ──────────────────────────────────
  function renderChildInputs() {
    const container = document.getElementById('bgsChildrenInputs');
    container.innerHTML = '';
    state.children.forEach((child, i) => {
      const div = document.createElement('div');
      div.className = 'bgs-child-row';
      const labelText = state.childCount > 1 ? `${i + 1}번째 자녀 나이` : '자녀 나이';
      div.innerHTML = `
        <label class="bgs-label">${labelText}</label>
        <select class="bgs-select bgs-age-select" data-index="${i}">
          ${ageOptions.map(o => `<option value="${o.value}"${child.age === o.value ? ' selected' : ''}>${o.label}</option>`).join('')}
        </select>
      `;
      container.appendChild(div);
    });
    container.querySelectorAll('.bgs-age-select').forEach(sel => {
      sel.addEventListener('change', e => {
        state.children[+e.target.dataset.index].age = e.target.value;
        calculate();
      });
    });
  }

  // ── 월 지원금 계산 (자녀 1명 기준) ────────────────────────
  function getMonthlyItems(child, idx) {
    const age = child.age;
    const care = state.care;
    const prefix = state.childCount > 1 ? `${idx + 1}째 ` : '';
    const items = [];

    if (care === 'home') {
      const pb = parentalBenefit[age] || 0;
      if (pb) items.push({ label: prefix + '부모급여', amount: pb, method: '현금' });
      const hc = homeCare[age] || 0;
      if (hc) items.push({ label: prefix + '가정양육수당', amount: hc, method: '현금' });
    } else if (care === 'daycare') {
      // 0·1세: 보육료가 부모급여 대체
      if (age !== 'age0' && age !== 'age1') {
        const pb = parentalBenefit[age] || 0;
        if (pb) items.push({ label: prefix + '부모급여', amount: pb, method: '현금' });
      }
      const sub = daycareSubsidy[age] || 0;
      if (sub) items.push({ label: prefix + '보육료 지원', amount: sub, method: '바우처' });
    } else if (care === 'kindergarten') {
      const pb = parentalBenefit[age] || 0;
      if (pb) items.push({ label: prefix + '부모급여', amount: pb, method: '현금' });
      const sub = kindergartenSubsidy[age] || 0;
      if (sub) items.push({ label: prefix + '유아학비 지원', amount: sub, method: '바우처' });
    }

    if (CHILD_ALLOWANCE_AGES.includes(age)) {
      items.push({ label: prefix + '아동수당', amount: childAllowance, method: '현금' });
    }

    return items;
  }

  // ── 1회성 지원금 계산 ─────────────────────────────────────
  function calcOneTime() {
    const items = [];
    const regionData = localSubsidy[state.region];

    state.children.forEach((child, i) => {
      const birth = i + 1;
      const fmAmt = firstMeeting[Math.min(birth, 2)] || firstMeeting[2];
      items.push({ label: `첫만남이용권 (${birth}째)`, amount: fmAmt, method: '국민행복카드' });
    });

    if (regionData) {
      state.children.forEach((child, i) => {
        const birth = i + 1;
        const idx = Math.min(birth - 1, 2);
        const amt = regionData[idx];
        if (amt > 0) {
          items.push({ label: `${state.region} 출산장려금 (${birth}째)`, amount: amt, method: '현금' });
        }
      });
    }

    items.push({ label: '임신·출산 진료비 (국민행복카드)', amount: pregnancyMedical, method: '바우처' });
    return items;
  }

  // ── 포맷 ─────────────────────────────────────────────────
  function fmt(n) {
    if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, '') + '천만원';
    if (n >= 10000) return Math.round(n / 10000) + '만원';
    return n.toLocaleString() + '원';
  }

  // ── 렌더 ─────────────────────────────────────────────────
  function renderResults(monthlyItems, oneTimeItems, totalMonthly, totalOneTime) {
    document.getElementById('bgsMonthlyTotal').textContent = fmt(totalMonthly);
    document.getElementById('bgsYearlyTotal').textContent = fmt(totalMonthly * 12);
    document.getElementById('bgsOneTimeTotal').textContent = fmt(totalOneTime);

    const tbody = document.getElementById('bgsMonthlyBody');
    tbody.innerHTML = monthlyItems.map(item => `
      <tr>
        <td>${item.label}</td>
        <td class="bgs-num">${fmt(item.amount)}</td>
        <td class="bgs-num">${fmt(item.amount * 12)}</td>
        <td class="bgs-method">${item.method}</td>
      </tr>
    `).join('');
    document.getElementById('bgsTableMonthSum').textContent = fmt(totalMonthly);
    document.getElementById('bgsTableYearSum').textContent = fmt(totalMonthly * 12);

    const otbody = document.getElementById('bgsOneTimeBody');
    otbody.innerHTML = oneTimeItems.map(item => `
      <tr>
        <td>${item.label}</td>
        <td class="bgs-num">${fmt(item.amount)}</td>
        <td class="bgs-method">${item.method}</td>
      </tr>
    `).join('');
    document.getElementById('bgsOneTimeSum').textContent = fmt(totalOneTime);

    const multi = document.getElementById('bgsMultiChildBenefits');
    multi.classList.toggle('is-hidden', state.childCount < 3);
  }

  // ── 차트 ─────────────────────────────────────────────────
  let timelineChart = null;

  function renderTimelineChart() {
    loadChartJs(() => {
      const ctx = document.getElementById('bgsTimelineChart');
      if (!ctx) return;
      if (timelineChart) timelineChart.destroy();

      const data = (timeline[state.care] || timeline.home).map(v => Math.round(v / 10000));

      timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timelineLabels,
          datasets: [{
            label: '월 지원금',
            data,
            borderColor: '#1a56db',
            backgroundColor: 'rgba(26,86,219,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: '#1a56db',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `월 ${ctx.parsed.y}만원`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: v => v + '만원' },
            },
          },
        },
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

  // ── 메인 계산 ─────────────────────────────────────────────
  function calculate() {
    let allMonthlyItems = [];
    let totalMonthly = 0;

    state.children.forEach((child, i) => {
      const items = getMonthlyItems(child, i);
      allMonthlyItems = allMonthlyItems.concat(items);
      totalMonthly += items.reduce((s, x) => s + x.amount, 0);
    });

    const oneTimeItems = calcOneTime();
    const totalOneTime = oneTimeItems.reduce((s, x) => s + x.amount, 0);

    renderResults(allMonthlyItems, oneTimeItems, totalMonthly, totalOneTime);
    renderTimelineChart();
    updateURL();
  }

  // ── URL 상태 ──────────────────────────────────────────────
  function updateURL() {
    const p = new URLSearchParams();
    p.set('count', state.childCount);
    p.set('ages', state.children.map(c => c.age).join(','));
    p.set('region', state.region);
    p.set('care', state.care);
    p.set('income', state.income);
    history.replaceState(null, '', '?' + p.toString());
  }

  function restoreURL() {
    const p = new URLSearchParams(location.search);
    const cnt = parseInt(p.get('count'), 10);
    if (cnt >= 1 && cnt <= 4) {
      state.childCount = cnt;
      const ages = (p.get('ages') || '').split(',');
      state.children = Array.from({ length: cnt }, (_, i) => ({
        age: ages[i] || 'age0',
      }));
    }
    if (p.get('region') && localSubsidy[p.get('region')]) state.region = p.get('region');
    if (p.get('care')) state.care = p.get('care');
    if (p.get('income')) state.income = p.get('income');
  }

  // ── 이벤트 바인딩 ─────────────────────────────────────────
  function bindEvents() {
    document.querySelectorAll('.bgs-count-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cnt = +btn.dataset.count;
        state.childCount = cnt;
        while (state.children.length < cnt) state.children.push({ age: 'age0' });
        state.children = state.children.slice(0, cnt);
        document.querySelectorAll('.bgs-count-btn').forEach(b =>
          b.classList.toggle('is-active', +b.dataset.count === cnt)
        );
        renderChildInputs();
        calculate();
      });
    });

    document.getElementById('bgsRegion').addEventListener('change', e => {
      state.region = e.target.value;
      calculate();
    });

    document.querySelectorAll('.bgs-care-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.care = btn.dataset.care;
        document.querySelectorAll('.bgs-care-btn').forEach(b =>
          b.classList.toggle('is-active', b.dataset.care === state.care)
        );
        calculate();
      });
    });

    document.getElementById('bgsIncome').addEventListener('change', e => {
      state.income = e.target.value;
      calculate();
    });
  }

  // ── 초기화 ────────────────────────────────────────────────
  restoreURL();

  document.querySelectorAll('.bgs-count-btn').forEach(b =>
    b.classList.toggle('is-active', +b.dataset.count === state.childCount)
  );
  document.querySelectorAll('.bgs-care-btn').forEach(b =>
    b.classList.toggle('is-active', b.dataset.care === state.care)
  );
  const regionEl = document.getElementById('bgsRegion');
  if (regionEl) regionEl.value = state.region;
  const incomeEl = document.getElementById('bgsIncome');
  if (incomeEl) incomeEl.value = state.income;

  renderChildInputs();
  bindEvents();
  calculate();

})();
