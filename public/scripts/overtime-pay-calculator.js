(() => {
  const DATA = JSON.parse(document.getElementById('opcData').textContent);
  // DATA: { JOB_TYPE_LABELS, OVERTIME_RATE, NET_RATE, PRESETS }

  let state = {
    jobType: 'office',
    basePay: 3000000,
    scheduledHours: 209,
    overtimeHours: 0,
    nightHours: 0,
    holidayUnder8: 0,
    holidayOver8: 0,
    companySize: 'over30',
    isPopal: false,
    popalAmount: 0,
  };

  let chartInstance = null;

  const JOB_TIPS = {
    it:         'IT 직종은 포괄임금제 적용 비율이 높습니다. 포괄임금 한도 초과 여부를 반드시 확인하세요.',
    production: '교대·야간 근무가 많은 생산직은 야간 가산수당이 연간 수백만 원에 달할 수 있습니다.',
    medical:    '의료직은 야간·휴일 중복 근무가 많습니다. 중복 가산이 정확히 적용됐는지 확인하세요.',
    office:     '포괄임금제 여부를 근로계약서에서 확인한 뒤 토글을 설정하세요.',
    shift:      '교대근무는 야간근로 시간 집계가 중요합니다. 22:00~06:00 실제 근무 시간을 정확히 입력하세요.',
    other:      '근로계약서상 소정근로시간과 기본급을 정확히 확인한 뒤 입력하세요.',
  };

  function q(sel) { return document.querySelector(sel); }

  function sanitize(val, fallback, min, max) {
    const n = parseFloat(String(val).replace(/,/g, ''));
    if (isNaN(n) || n < min) return fallback;
    return max !== undefined ? Math.min(n, max) : n;
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function fmtShort(n) {
    const abs = Math.abs(n);
    if (abs >= 10000) return Math.round(n / 10000) + '만원';
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function readInputs() {
    state.jobType        = q('[data-opc-input="jobType"]')?.value ?? 'office';
    state.basePay        = sanitize(q('[data-opc-input="basePay"]')?.value, 3000000, 100000);
    state.scheduledHours = sanitize(q('[data-opc-input="scheduledHours"]')?.value, 209, 1, 300);
    state.overtimeHours  = sanitize(q('[data-opc-input="overtimeHours"]')?.value, 0, 0, 200);
    state.nightHours     = sanitize(q('[data-opc-input="nightHours"]')?.value, 0, 0, 200);
    state.holidayUnder8  = sanitize(q('[data-opc-input="holidayUnder8"]')?.value, 0, 0, 8);
    state.holidayOver8   = sanitize(q('[data-opc-input="holidayOver8"]')?.value, 0, 0, 100);
    state.companySize    = q('[data-opc-input="companySize"]:checked')?.value ?? 'over30';
    state.isPopal        = q('[data-opc-input="isPopal"]')?.checked ?? false;
    state.popalAmount    = sanitize(q('[data-opc-input="popalAmount"]')?.value, 0, 0);
  }

  function calculate(s) {
    const hourlyWage = s.scheduledHours > 0 ? s.basePay / s.scheduledHours : 0;
    const addRate = DATA.OVERTIME_RATE[s.companySize]; // 0 or 0.5

    const overtimePay      = hourlyWage * (1 + addRate) * s.overtimeHours;
    const nightPay         = hourlyWage * 0.5 * s.nightHours;
    const holidayPayUnder8 = hourlyWage * (1 + addRate) * s.holidayUnder8;
    // 휴일 8h 초과: 5인 미만 ×1.0, 이상 ×2.0
    const holiday2Rate     = addRate > 0 ? 2.0 : 1.0;
    const holidayPayOver8  = hourlyWage * holiday2Rate * s.holidayOver8;

    const totalGross = overtimePay + nightPay + holidayPayUnder8 + holidayPayOver8;
    const totalNet   = totalGross * DATA.NET_RATE;

    const popalExcess    = s.isPopal ? totalGross - s.popalAmount : 0;
    const isPopalWarning = s.isPopal && popalExcess > 0;

    // 주 52시간 경고: 월 연장시간 ÷ 4.345 > 12h
    const weeklyOvertimeWarning = (s.overtimeHours / 4.345) > 12;

    return {
      hourlyWage, overtimePay, nightPay,
      holidayPayUnder8, holidayPayOver8,
      totalGross, totalNet,
      popalExcess, isPopalWarning,
      weeklyOvertimeWarning,
      addRate, holiday2Rate,
    };
  }

  function renderKpi(r) {
    const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setEl('opcTotalGrossValue', fmt(r.totalGross));
    setEl('opcTotalNetValue',   fmt(r.totalNet));
    setEl('opcHourlyWageValue', fmt(r.hourlyWage));

    const card = document.getElementById('opcPopalStatusCard');
    const val  = document.getElementById('opcPopalStatusValue');
    const sub  = document.getElementById('opcPopalStatusSub');
    if (!state.isPopal) {
      if (val) val.textContent = '미적용';
      if (sub) sub.textContent = '포괄임금제 토글을 켜면 확인됩니다';
      if (card) card.classList.remove('is-warning');
    } else if (r.isPopalWarning) {
      if (val) val.textContent = `초과 ${fmtShort(r.popalExcess)}`;
      if (sub) sub.textContent = '법정 수당이 포괄임금 한도를 초과합니다';
      if (card) card.classList.add('is-warning');
    } else {
      if (val) val.textContent = '정상';
      if (sub) sub.textContent = `여유 ${fmtShort(-r.popalExcess)}`;
      if (card) card.classList.remove('is-warning');
    }
  }

  function renderTable(r, s) {
    const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    const rateLabel = r.addRate > 0 ? '×1.5' : '×1.0 (5인 미만)';
    const rate2Label = r.holiday2Rate === 2.0 ? '×2.0' : '×1.0 (5인 미만)';

    setEl('opcOvertimeHoursCell',  s.overtimeHours + 'h');
    setEl('opcOvertimeRateCell',   rateLabel);
    setEl('opcOvertimePayCell',    fmt(r.overtimePay));
    setEl('opcNightHoursCell',     s.nightHours + 'h');
    setEl('opcNightPayCell',       fmt(r.nightPay));
    setEl('opcHoliday1HoursCell',  s.holidayUnder8 + 'h');
    setEl('opcHoliday1RateCell',   rateLabel);
    setEl('opcHoliday1PayCell',    fmt(r.holidayPayUnder8));
    setEl('opcHoliday2HoursCell',  s.holidayOver8 + 'h');
    setEl('opcHoliday2RateCell',   rate2Label);
    setEl('opcHoliday2PayCell',    fmt(r.holidayPayOver8));
    setEl('opcTotalGrossCell',     fmt(r.totalGross));
    setEl('opcTotalNetCell',       fmt(r.totalNet));
  }

  function renderPopalCard(r, s) {
    const card = document.getElementById('opcPopalCard');
    if (!card) return;
    if (!s.isPopal) {
      card.classList.remove('is-visible');
      return;
    }
    card.classList.add('is-visible');
    const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setEl('opcPopalLegalPay',  fmt(r.totalGross));
    setEl('opcPopalIncluded',  fmt(s.popalAmount));

    const excessEl = document.getElementById('opcPopalExcess');
    if (excessEl) {
      excessEl.textContent = (r.popalExcess >= 0 ? '+' : '') + fmt(r.popalExcess);
      excessEl.className = 'opc-popal-excess ' + (r.popalExcess > 0 ? 'is-over' : 'is-ok');
    }
    const consultLink = document.getElementById('opcPopalConsultLink');
    if (consultLink) consultLink.style.display = r.isPopalWarning ? 'inline-block' : 'none';
  }

  function renderWarnings(r) {
    const popalBanner = document.getElementById('opcPopalWarningBanner');
    const hrBanner    = document.getElementById('opc52hrWarningBanner');
    if (popalBanner) popalBanner.classList.toggle('is-visible', r.isPopalWarning);
    if (hrBanner)    hrBanner.classList.toggle('is-visible', r.weeklyOvertimeWarning);

    const under5Banner = document.getElementById('opcUnder5Banner');
    if (under5Banner) under5Banner.classList.toggle('is-visible', state.companySize === 'under5');
  }

  function renderChart(r) {
    const canvas = document.getElementById('opcChart');
    if (!canvas) return;

    const items = [
      { label: '연장근로', value: r.overtimePay,      color: '#1a56db' },
      { label: '야간근로', value: r.nightPay,          color: '#0f6e56' },
      { label: '휴일(8h↓)', value: r.holidayPayUnder8, color: '#7c3aed' },
      { label: '휴일(8h↑)', value: r.holidayPayOver8,  color: '#dc2626' },
    ].filter(d => d.value > 0);

    const centerEl = document.getElementById('opcChartCenter');

    if (typeof Chart === 'undefined') return;

    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

    if (items.length === 0) {
      if (centerEl) centerEl.textContent = '0원';
      return;
    }

    if (centerEl) centerEl.textContent = fmtShort(r.totalGross);

    chartInstance = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: items.map(d => d.label),
        datasets: [{
          data: items.map(d => d.value),
          backgroundColor: items.map(d => d.color),
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12 } },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)}`,
            },
          },
        },
      },
    });
  }

  function renderMessage(r, s) {
    const el = document.getElementById('opcResultMessage');
    if (!el) return;
    const payMan = Math.round(s.basePay / 10000);
    const hourly = Math.round(r.hourlyWage).toLocaleString('ko-KR');
    const grossMan = Math.round(r.totalGross / 10000);
    const netMan   = Math.round(r.totalNet / 10000);
    el.textContent =
      `기본급 ${payMan}만 원 기준 통상임금(시간급)은 ${hourly}원입니다. ` +
      `이번 달 연장 ${s.overtimeHours}h · 야간 ${s.nightHours}h · 휴일 ${s.holidayUnder8 + s.holidayOver8}h 근무 기준 ` +
      `법정 수당 합계는 ${grossMan}만 원(세전), 세후 추정 약 ${netMan}만 원입니다.`;
  }

  function renderJobTip(s) {
    const el = document.getElementById('opcJobTip');
    if (!el) return;
    let tip = JOB_TIPS[s.jobType] || '';
    if (s.companySize === 'under5') {
      tip += (tip ? ' ' : '') + '5인 미만 사업장은 연장·휴일 가산율(+50%)이 적용되지 않습니다. 기본 임금만 청구 가능합니다.';
    }
    el.textContent = tip;
    el.style.display = tip ? 'block' : 'none';
  }

  function togglePopalField(isPopal) {
    const field = document.getElementById('opcPopalField');
    if (field) field.classList.toggle('is-open', isPopal);
  }

  function applyPreset(id) {
    const preset = DATA.PRESETS.find(p => p.id === id);
    if (!preset) return;

    const setVal = (sel, val) => {
      const el = q(sel);
      if (el) {
        if (el.type === 'checkbox') { el.checked = val; }
        else if (el.type === 'radio') { el.checked = true; }
        else { el.value = typeof val === 'number' && sel.includes('Pay') ? val.toLocaleString('ko-KR') : val; }
      }
    };

    // Set select
    const jobEl = q('[data-opc-input="jobType"]');
    if (jobEl) jobEl.value = preset.jobType;

    // Set number inputs
    const basePayEl = q('[data-opc-input="basePay"]');
    if (basePayEl) basePayEl.value = preset.basePay.toLocaleString('ko-KR');

    q('[data-opc-input="scheduledHours"]').value = preset.scheduledHours;
    q('[data-opc-input="overtimeHours"]').value  = preset.overtimeHours;
    q('[data-opc-input="nightHours"]').value      = preset.nightHours;
    q('[data-opc-input="holidayUnder8"]').value   = preset.holidayHoursUnder8;
    q('[data-opc-input="holidayOver8"]').value    = preset.holidayHoursOver8;

    // radio
    const radio = q(`[data-opc-input="companySize"][value="${preset.companySize}"]`);
    if (radio) radio.checked = true;

    // toggle
    const popalEl = q('[data-opc-input="isPopal"]');
    if (popalEl) popalEl.checked = preset.isPopalImgeum;

    const popalAmtEl = q('[data-opc-input="popalAmount"]');
    if (popalAmtEl) popalAmtEl.value = preset.popalAmount.toLocaleString('ko-KR');

    togglePopalField(preset.isPopalImgeum);

    // active button highlight
    document.querySelectorAll('.opc-preset-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.presetId === id);
    });

    refresh();
  }

  function syncUrl(s) {
    const params = new URLSearchParams({
      job:      s.jobType,
      pay:      s.basePay,
      hours:    s.scheduledHours,
      ot:       s.overtimeHours,
      night:    s.nightHours,
      hol1:     s.holidayUnder8,
      hol2:     s.holidayOver8,
      size:     s.companySize,
      popal:    s.isPopal ? '1' : '0',
      popalamt: s.popalAmount,
    });
    history.replaceState(null, '', '?' + params.toString());
  }

  function restoreFromUrl() {
    const p = new URLSearchParams(location.search);
    if (!p.has('pay')) return;

    const setInput = (sel, val) => {
      const el = q(sel);
      if (el) el.value = val;
    };

    const jobEl = q('[data-opc-input="jobType"]');
    if (jobEl && p.has('job')) jobEl.value = p.get('job');

    const basePayEl = q('[data-opc-input="basePay"]');
    if (basePayEl && p.has('pay')) {
      const n = parseInt(p.get('pay'));
      basePayEl.value = isNaN(n) ? p.get('pay') : n.toLocaleString('ko-KR');
    }

    setInput('[data-opc-input="scheduledHours"]', p.get('hours') ?? 209);
    setInput('[data-opc-input="overtimeHours"]',  p.get('ot')    ?? 0);
    setInput('[data-opc-input="nightHours"]',      p.get('night') ?? 0);
    setInput('[data-opc-input="holidayUnder8"]',   p.get('hol1')  ?? 0);
    setInput('[data-opc-input="holidayOver8"]',    p.get('hol2')  ?? 0);

    const size = p.get('size') ?? 'over30';
    const radio = q(`[data-opc-input="companySize"][value="${size}"]`);
    if (radio) radio.checked = true;

    const isPopal = p.get('popal') === '1';
    const popalEl = q('[data-opc-input="isPopal"]');
    if (popalEl) popalEl.checked = isPopal;
    togglePopalField(isPopal);

    const popalAmtEl = q('[data-opc-input="popalAmount"]');
    if (popalAmtEl && p.has('popalamt')) {
      const n = parseInt(p.get('popalamt'));
      popalAmtEl.value = isNaN(n) ? 0 : n.toLocaleString('ko-KR');
    }
  }

  function refresh() {
    readInputs();
    const r = calculate(state);
    renderKpi(r);
    renderTable(r, state);
    renderPopalCard(r, state);
    renderWarnings(r);
    renderChart(r);
    renderMessage(r, state);
    renderJobTip(state);
    syncUrl(state);
  }

  function formatNumberInput(el) {
    const raw = el.value.replace(/,/g, '');
    const n = parseInt(raw);
    if (!isNaN(n)) el.value = n.toLocaleString('ko-KR');
  }

  function bindEvents() {
    // 모든 입력 이벤트
    document.querySelectorAll('[data-opc-input]').forEach(el => {
      el.addEventListener('input', () => {
        if (el.dataset.opcInput === 'isPopal') togglePopalField(el.checked);
        refresh();
      });
      el.addEventListener('change', refresh);
    });

    // 쉼표 포맷 (숫자 필드)
    ['basePay', 'popalAmount'].forEach(key => {
      const el = q(`[data-opc-input="${key}"]`);
      if (el) el.addEventListener('blur', () => formatNumberInput(el));
    });

    // 프리셋 버튼
    document.querySelectorAll('.opc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.presetId));
    });

    // 리셋 버튼
    const resetBtn = document.getElementById('opcResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => applyPreset('preset-it'));

    // 링크 복사 버튼
    const copyBtn = document.getElementById('opcCopyLinkBtn');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(location.href).catch(() => {});
    });
  }

  // Chart.js 로드 후 초기화
  function init() {
    restoreFromUrl();
    bindEvents();
    refresh();
  }

  if (typeof Chart !== 'undefined') {
    init();
  } else {
    // Chart.js가 아직 로드되지 않은 경우
    window.addEventListener('load', init);
  }
})();
