(function () {
  const cfg = JSON.parse(document.getElementById('mw27Config').textContent);
  const { current, history, global: globalData, items, defaults } = cfg;

  // 4대보험 근로자 부담률
  const INS_RATE = 0.04500 + 0.03545 + 0.004591 + 0.009; // ~9.404%

  let state = {
    hourly: current.hourly,
    hoursPerDay: defaults.hoursPerDay,
    daysPerWeek: defaults.daysPerWeek,
    includeWeeklyHoliday: defaults.includeWeeklyHoliday,
    compareMode: defaults.compareMode,
    compareItem: defaults.compareItem,
  };

  // URL 파라미터 복원
  const params = new URLSearchParams(location.search);
  if (params.get('hourly'))  state.hourly = +params.get('hourly');
  if (params.get('hpd'))    state.hoursPerDay = +params.get('hpd');
  if (params.get('dpw'))    state.daysPerWeek = +params.get('dpw');
  if (params.get('wh'))     state.includeWeeklyHoliday = params.get('wh') === '1';
  if (params.get('mode'))   state.compareMode = params.get('mode');
  if (params.get('item'))   state.compareItem = params.get('item');

  function calcMonthlyHours(hpd, dpw, withHoliday) {
    const weekly = hpd * dpw;
    const holidayHours = withHoliday && weekly >= 15 ? hpd : 0;
    return ((weekly + holidayHours) * 365) / 12 / 7;
  }

  function calcIncomeTax(gross) {
    if (gross <= 1060000) return 0;
    if (gross <= 1500000) return Math.round((gross - 1060000) * 0.06);
    if (gross <= 3000000) return Math.round(26400 + (gross - 1500000) * 0.15);
    return Math.round(26400 + 225000 + (gross - 3000000) * 0.24);
  }

  function calcResult() {
    const monthlyHours = calcMonthlyHours(state.hoursPerDay, state.daysPerWeek, state.includeWeeklyHoliday);
    const gross = Math.round(state.hourly * monthlyHours);
    const insurance = Math.round(gross * INS_RATE);
    const incomeTax = calcIncomeTax(gross);
    const localTax = Math.round(incomeTax * 0.1);
    const net = gross - insurance - incomeTax - localTax;
    const annual = net * 12;
    return { gross, insurance, incomeTax, localTax, net, annual };
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function render() {
    const r = calcResult();

    setText('mw27GrossVal', fmt(r.gross));
    setText('mw27NetVal', fmt(r.net));
    setText('mw27AnnualVal', fmt(r.annual));

    // 세후 공제 내역
    setText('mw27GrossRow', fmt(r.gross));
    setText('mw27InsRow', '-' + fmt(r.insurance));
    setText('mw27TaxRow', '-' + fmt(r.incomeTax + r.localTax));
    setText('mw27NetRow', fmt(r.net));

    // 인상 배지 (announced)
    const badge = document.getElementById('mw27RaiseBadge');
    if (badge) {
      if (current.announced && current.hourly !== current.prevHourly) {
        const diff = current.hourly - current.prevHourly;
        const rate = ((diff / current.prevHourly) * 100).toFixed(1);
        badge.textContent = `전년 대비 +${rate}% 인상 (${current.prevHourly.toLocaleString()}원 → ${current.hourly.toLocaleString()}원)`;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }

    renderGlobalChart();
    renderPurchaseChart();
  }

  // 차트 인스턴스
  let globalChart = null;
  let purchaseChart = null;
  let historyChart = null;

  function renderGlobalChart() {
    const mode = state.compareMode;
    const sorted = [...globalData].sort((a, b) =>
      (mode === 'ppp' ? b.hourlyPPP - a.hourlyPPP : b.hourlyUSD - a.hourlyUSD)
    );
    const labels = sorted.map(c => c.flag + ' ' + c.country);
    const data = sorted.map(c => mode === 'ppp' ? c.hourlyPPP : c.hourlyUSD);
    const koreaIdx = sorted.findIndex(c => c.country === '한국');
    const colors = sorted.map((_, i) => i === koreaIdx ? '#1a56db' : '#d1d5db');

    const ctx = document.getElementById('mw27GlobalChart');
    if (!ctx) return;
    if (globalChart) globalChart.destroy();
    globalChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `$${ctx.parsed.x.toFixed(2)}/시간 (${mode === 'ppp' ? 'PPP' : 'USD'})`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: mode === 'ppp' ? '시간당 USD (PPP 환산)' : '시간당 USD (환율 환산)', font: { size: 11 } },
            grid: { color: '#f3f4f6' },
          },
          y: { grid: { display: false } },
        },
      },
    });

    // 한국 순위 표시
    const rankEl = document.getElementById('mw27KoreaRank');
    if (rankEl) rankEl.textContent = `한국은 ${mode === 'ppp' ? 'PPP' : '달러 환산'} 기준 ${koreaIdx + 1}위`;
  }

  function renderPurchaseChart() {
    const item = items[state.compareItem];
    // 한국 기준 시급 구매력
    const koreaHourlyKRW = state.hourly;
    // 각 나라: 시급(USD) / 빅맥(USD) = 구매 개수
    const sorted = [...globalData].sort((a, b) => {
      const pa = (state.compareMode === 'ppp' ? a.hourlyPPP : a.hourlyUSD) / a.bigmacUSD;
      const pb = (state.compareMode === 'ppp' ? b.hourlyPPP : b.hourlyUSD) / b.bigmacUSD;
      return pb - pa;
    });

    // 한국은 원화 기준으로 계산
    const koreaEntry = sorted.find(c => c.country === '한국');
    const powers = sorted.map(c => {
      if (c.country === '한국') {
        return +(koreaHourlyKRW / item.priceKRW).toFixed(2);
      }
      const hourly = state.compareMode === 'ppp' ? c.hourlyPPP : c.hourlyUSD;
      return +(hourly / c.bigmacUSD).toFixed(2);
    });

    const koreaIdx = sorted.findIndex(c => c.country === '한국');
    const labels = sorted.map(c => c.flag + ' ' + c.country);
    const colors = sorted.map((_, i) => i === koreaIdx ? '#1a56db' : '#d1d5db');

    const ctx = document.getElementById('mw27PurchaseChart');
    if (!ctx) return;
    if (purchaseChart) purchaseChart.destroy();
    purchaseChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: powers,
          backgroundColor: colors,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${item.icon} ${ctx.parsed.x.toFixed(2)}개`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: `1시간 일하면 ${item.label} 몇 개`, font: { size: 11 } },
            grid: { color: '#f3f4f6' },
          },
          y: { grid: { display: false } },
        },
      },
    });

    const koreaItem = powers[koreaIdx];
    const itemTitleEl = document.getElementById('mw27PurchaseTitle');
    if (itemTitleEl) itemTitleEl.textContent = `1시간 일하면 ${item.icon} ${item.label} 몇 개 살 수 있나?`;
    const koreaEl = document.getElementById('mw27KoreaPower');
    if (koreaEl) koreaEl.textContent = `한국: ${koreaItem.toFixed(2)}개 (${koreaIdx + 1}위)`;
  }

  function renderHistoryChart() {
    const ctx = document.getElementById('mw27HistoryChart');
    if (!ctx) return;
    if (historyChart) historyChart.destroy();
    historyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.map(h => h.year + '년'),
        datasets: [
          {
            label: '시급 (원)',
            data: history.map(h => h.hourly),
            borderColor: '#1a56db',
            backgroundColor: 'rgba(26,86,219,0.08)',
            fill: true,
            tension: 0.3,
            yAxisID: 'y',
            pointBackgroundColor: history.map(h => h.year === 2027 ? '#ef4444' : '#1a56db'),
            pointRadius: history.map(h => h.year === 2027 ? 6 : 4),
          },
          {
            label: '인상률 (%)',
            data: history.map(h => h.changeRate),
            borderColor: '#10b981',
            borderDash: [4, 4],
            tension: 0.3,
            yAxisID: 'y2',
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
        scales: {
          y: {
            position: 'left',
            title: { display: true, text: '시급 (원)', font: { size: 10 } },
            grid: { color: '#f3f4f6' },
          },
          y2: {
            position: 'right',
            title: { display: true, text: '인상률 (%)', font: { size: 10 } },
            grid: { display: false },
          },
        },
      },
    });
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function bindInputs() {
    document.querySelectorAll('[data-mw27]').forEach(el => {
      el.value = state[el.dataset.mw27] ?? '';
      el.addEventListener('input', () => {
        state[el.dataset.mw27] = el.type === 'number' ? +el.value : el.value;
        render();
        syncURL();
      });
    });
    document.querySelectorAll('[data-mw27-bool]').forEach(el => {
      el.checked = !!state[el.dataset.mw27Bool];
      el.addEventListener('change', () => {
        state[el.dataset.mw27Bool] = el.checked;
        render();
        syncURL();
      });
    });
    document.querySelectorAll('.mw27-mode-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        state.compareMode = btn.dataset.mode;
        document.querySelectorAll('.mw27-mode-tab').forEach(b => b.classList.toggle('is-active', b === btn));
        render();
        syncURL();
      });
    });
    document.querySelectorAll('.mw27-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.compareItem = btn.dataset.item;
        document.querySelectorAll('.mw27-item-btn').forEach(b => b.classList.toggle('is-active', b === btn));
        renderPurchaseChart();
        syncURL();
      });
    });
  }

  function syncURL() {
    const p = new URLSearchParams({
      hourly: state.hourly,
      hpd: state.hoursPerDay,
      dpw: state.daysPerWeek,
      wh: state.includeWeeklyHoliday ? '1' : '0',
      mode: state.compareMode,
      item: state.compareItem,
    });
    history.replaceState(null, '', '?' + p.toString());
  }

  function loadChartJs(cb) {
    if (window.Chart) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  // 리셋
  const resetBtn = document.getElementById('mw27ResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = {
        hourly: current.hourly,
        hoursPerDay: defaults.hoursPerDay,
        daysPerWeek: defaults.daysPerWeek,
        includeWeeklyHoliday: defaults.includeWeeklyHoliday,
        compareMode: defaults.compareMode,
        compareItem: defaults.compareItem,
      };
      document.querySelectorAll('[data-mw27]').forEach(el => { el.value = state[el.dataset.mw27] ?? ''; });
      document.querySelectorAll('[data-mw27-bool]').forEach(el => { el.checked = !!state[el.dataset.mw27Bool]; });
      document.querySelectorAll('.mw27-mode-tab').forEach(b => b.classList.toggle('is-active', b.dataset.mode === state.compareMode));
      document.querySelectorAll('.mw27-item-btn').forEach(b => b.classList.toggle('is-active', b.dataset.item === state.compareItem));
      render();
      syncURL();
    });
  }

  // 링크 복사
  const copyBtn = document.getElementById('mw27CopyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      syncURL();
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadChartJs(() => {
    bindInputs();
    render();
    renderHistoryChart();
  });
})();
