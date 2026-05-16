(() => {
  'use strict';

  // ─── 데이터 로드 ────────────────────────────────────────────
  const PRESETS = JSON.parse(document.getElementById('tec-presets')?.textContent || '[]');
  const METHOD_DEFAULTS = JSON.parse(document.getElementById('tec-methods')?.textContent || '[]');

  // 국가→팁 맵
  const COUNTRY_TIPS = {};
  PRESETS.forEach(p => { COUNTRY_TIPS[p.country] = p.tip; });

  // ─── 상태 ───────────────────────────────────────────────────
  let state = {
    country: '일본',
    currency: 'JPY',
    unit: 100,
    krwAmount: 1000000,
    baseRate: 900,
    travelers: 1,
    travelDays: 4,
    overrides: {},  // { METHOD: { preferentialRate, fixedFee } }
  };

  // ─── 유틸 ───────────────────────────────────────────────────
  function q(id) { return document.getElementById(id); }
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  function sanitize(val, fallback = 0, min = 0) {
    const n = parseFloat(String(val).replace(/,/g, ''));
    return (isNaN(n) || n < min) ? fallback : n;
  }

  function fmtForeign(v, currency, unit) {
    if (v <= 0) return '0';
    const rounded = unit === 100
      ? Math.floor(v)           // JPY·VND: 정수
      : Math.floor(v * 100) / 100; // 소수점 2자리
    return rounded.toLocaleString('ko-KR') + (currency === 'JPY' ? '엔' : currency === 'VND' ? '동' : '');
  }

  function fmtKrw(v) {
    if (v <= 0) return '0원';
    return Math.round(v).toLocaleString('ko-KR') + '원';
  }

  function fmtRate(appliedRate, unit) {
    if (unit === 100) return `${appliedRate.toFixed(2)}원`;
    return `${appliedRate.toFixed(2)}원`;
  }

  // ─── 핵심 계산 ──────────────────────────────────────────────
  function calcOne(krwAmount, baseRate, unit, cfg) {
    const pref = cfg.preferentialRate ?? 0;
    const spread = cfg.spreadRate * (1 - pref / 100);
    const applied = baseRate * (1 + spread / 100);
    const cardFee = krwAmount * (cfg.cardFeeRate / 100);
    const available = Math.max(0, krwAmount - cfg.fixedFee - cardFee);
    const foreign = available <= 0 ? 0 : (available / applied) * unit;
    const feeKrw = krwAmount - (foreign / unit) * baseRate;
    return { method: cfg.method, label: cfg.label, applied, foreign, feeKrw };
  }

  function calculateAll(s) {
    const results = METHOD_DEFAULTS.map(cfg => {
      const ov = s.overrides[cfg.method] || {};
      const merged = { ...cfg, ...ov };
      return calcOne(s.krwAmount, s.baseRate, s.unit, merged);
    });

    const sortedByForeign = [...results].sort((a, b) => b.foreign - a.foreign);
    const worst = Math.min(...results.map(r => r.foreign));
    const airport = results.find(r => r.method === 'AIRPORT');

    return sortedByForeign.map((r, i) => ({
      ...r,
      rank: i + 1,
      savingVsWorst: Math.max(0, ((r.foreign - worst) / s.unit) * s.baseRate),
      savingVsAirport: airport ? Math.max(0, ((r.foreign - airport.foreign) / s.unit) * s.baseRate) : 0,
    }));
  }

  function calcSensitivity(s) {
    const offsets = [-20, -10, 0, 10, 20];
    return offsets.map(offset => {
      const rate = s.baseRate + offset;
      const tc = calcOne(s.krwAmount, rate, s.unit, METHOD_DEFAULTS.find(m => m.method === 'TRAVEL_CARD'));
      const ba = calcOne(s.krwAmount, rate, s.unit, METHOD_DEFAULTS.find(m => m.method === 'BANK_APP'));
      const ap = calcOne(s.krwAmount, rate, s.unit, METHOD_DEFAULTS.find(m => m.method === 'AIRPORT'));
      return { rate, offset, tc, ba, ap };
    });
  }

  // ─── 렌더링 ─────────────────────────────────────────────────
  function renderKpi(results, s) {
    const best = results[0];
    const airport = results.find(r => r.method === 'AIRPORT');
    const currency = s.currency;
    const unit = s.unit;

    setText('tecBestMethod', best.label);
    setText('tecBestNote', `수수료 최저 · 실수령 외화 최대`);
    setText('tecBestForeign', fmtForeign(best.foreign, currency, unit));

    if (airport) {
      const saving = best.savingVsAirport;
      setText('tecSavingVsAirport', saving > 0 ? fmtKrw(saving) : '동일');
    }

    const daily = best.foreign / (s.travelers * s.travelDays);
    setText('tecDailyBudget', fmtForeign(daily, currency, unit));
    setText('tecDailyNote', `${s.travelers}인 · ${s.travelDays}일 기준`);

    // 자연어 메시지
    const bestForeignStr = fmtForeign(best.foreign, currency, unit);
    const airportSaving = airport ? Math.round(best.savingVsAirport) : 0;
    const perDay = fmtForeign(daily, currency, unit);
    setText(
      'tecMessage',
      `${s.krwAmount.toLocaleString('ko-KR')}원 환전 시, ${best.label}이 가장 유리합니다. ` +
      `실수령 ${bestForeignStr}. ` +
      (airportSaving > 0 ? `공항 환전 대비 약 ${airportSaving.toLocaleString('ko-KR')}원 절약. ` : '') +
      `${s.travelers}인 ${s.travelDays}일 기준 하루 예산 약 ${perDay}입니다. 이 결과는 추정값이며 실제 환전 전 최신 조건을 확인하세요.`
    );
  }

  function renderComparisonTable(results, s) {
    const tbody = q('tecComparisonBody');
    if (!tbody) return;
    const currency = s.currency;
    const unit = s.unit;

    tbody.innerHTML = results.map(r => {
      const isBest = r.rank === 1;
      const isWorst = r.rank === results.length;
      const rowClass = isBest ? 'is-best' : isWorst ? 'is-worst' : '';
      const rankBadgeClass = `tec-rank-badge${isBest ? ' tec-rank-badge--1' : ''}`;
      const savingStr = r.savingVsAirport > 0 ? `+${fmtKrw(r.savingVsAirport)}` : (r.method === 'AIRPORT' ? '기준' : `−${fmtKrw(Math.abs(r.savingVsAirport))}`);
      return `<tr class="${rowClass}">
        <td class="tec-method">
          <span class="${rankBadgeClass}">${r.rank}</span>
          ${r.label}${isBest ? ' <span class="tec-best-badge">추천</span>' : ''}
        </td>
        <td>${fmtRate(r.applied, unit)}</td>
        <td><strong>${fmtForeign(r.foreign, currency, unit)}</strong></td>
        <td class="tec-fee">${fmtKrw(r.feeKrw)}</td>
        <td>${savingStr}</td>
        <td>${r.rank}위</td>
      </tr>`;
    }).join('');
  }

  function renderSensitivityTable(rows, s) {
    const tbody = q('tecSensitivityBody');
    if (!tbody) return;
    const currency = s.currency;
    const unit = s.unit;

    tbody.innerHTML = rows.map(row => {
      const isCurrent = row.offset === 0;
      const diff = ((row.tc.foreign - row.ap.foreign) / unit) * row.rate;
      return `<tr class="${isCurrent ? 'is-current' : ''}">
        <td>${row.rate.toFixed(2)}원 (${row.offset >= 0 ? '+' : ''}${row.offset})</td>
        <td>${fmtForeign(row.tc.foreign, currency, unit)}</td>
        <td>${fmtForeign(row.ba.foreign, currency, unit)}</td>
        <td>${fmtForeign(row.ap.foreign, currency, unit)}</td>
        <td>+${fmtKrw(Math.max(0, diff))}</td>
      </tr>`;
    }).join('');
  }

  function renderCountryTip(country) {
    const tipEl = q('tecCountryTip');
    if (!tipEl) return;
    const tip = COUNTRY_TIPS[country];
    tipEl.textContent = tip || '국가 프리셋을 선택하면 해당 국가의 환전 팁이 표시됩니다.';
  }

  function setText(id, text) {
    const el = q(id); if (el) el.textContent = text;
  }

  // ─── 전체 업데이트 ──────────────────────────────────────────
  function update() {
    readInputs();
    updateRateLabel();
    const results = calculateAll(state);
    renderKpi(results, state);
    renderComparisonTable(results, state);
    renderSensitivityTable(calcSensitivity(state), state);
    renderCountryTip(state.country);
    syncUrl();
  }

  // ─── 입력 읽기 ──────────────────────────────────────────────
  function readInputs() {
    const currencyEl = q('tecCurrency');
    const selectedOpt = currencyEl?.selectedOptions[0];
    state.currency = currencyEl?.value || 'JPY';
    state.unit = parseInt(selectedOpt?.dataset.unit || '100');
    state.baseRate = sanitize(q('tecRate')?.value, 900, 0.01);
    state.krwAmount = sanitize(q('tecAmount')?.value, 1000000, 10000);
    state.travelers = sanitize(q('tecTravelers')?.value, 1, 1);
    state.travelDays = sanitize(q('tecDays')?.value, 4, 1);

    // 상세 수수료 오버라이드 읽기
    state.overrides = {};
    qsa('.tec-adv-input').forEach(el => {
      const method = el.dataset.method;
      const field = el.dataset.field;
      if (!method || !field) return;
      if (!state.overrides[method]) state.overrides[method] = {};
      state.overrides[method][field] = sanitize(el.value, 0, 0);
    });
  }

  function updateRateLabel() {
    const label = q('tecRateLabel');
    if (!label) return;
    const unitLabel = state.unit === 100 ? `100${state.currency} 기준` : `1${state.currency} 기준`;
    label.textContent = `기준 환율 (${unitLabel}, 원)`;
  }

  // ─── 프리셋 적용 ────────────────────────────────────────────
  function applyPreset(preset) {
    state.country = preset.country;
    state.currency = preset.currency;
    state.unit = preset.unit;
    state.baseRate = preset.defaultRate;

    // DOM 업데이트
    const currencyEl = q('tecCurrency');
    if (currencyEl) currencyEl.value = preset.currency;
    const rateEl = q('tecRate');
    if (rateEl) rateEl.value = preset.defaultRate;

    // 칩 active 처리
    qsa('.tec-preset-chip').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tecPreset === preset.country);
    });

    update();
  }

  // ─── URL 동기화 ─────────────────────────────────────────────
  function syncUrl() {
    try {
      const params = new URLSearchParams({
        country: state.country,
        currency: state.currency,
        amount: state.krwAmount,
        rate: state.baseRate,
        travelers: state.travelers,
        days: state.travelDays,
      });
      history.replaceState(null, '', `${location.pathname}?${params}`);
    } catch (_) {}
  }

  function restoreFromUrl() {
    try {
      const p = new URLSearchParams(location.search);
      if (p.has('currency')) {
        const currency = p.get('currency');
        const preset = PRESETS.find(pr => pr.currency === currency);
        if (preset) {
          state.country = p.get('country') || preset.country;
          state.currency = currency;
          state.unit = preset.unit;
        }
      }
      if (p.has('amount'))    state.krwAmount = sanitize(p.get('amount'), 1000000, 10000);
      if (p.has('rate'))      state.baseRate = sanitize(p.get('rate'), 900, 0.01);
      if (p.has('travelers')) state.travelers = sanitize(p.get('travelers'), 1, 1);
      if (p.has('days'))      state.travelDays = sanitize(p.get('days'), 4, 1);

      // DOM 반영
      const setVal = (id, v) => { const el = q(id); if (el) el.value = v; };
      setVal('tecCurrency', state.currency);
      setVal('tecRate', state.baseRate);
      setVal('tecAmount', state.krwAmount);
      setVal('tecTravelers', state.travelers);
      setVal('tecDays', state.travelDays);

      // 해당 칩 active
      qsa('.tec-preset-chip').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.tecPreset === state.country);
      });
    } catch (_) {}
  }

  // ─── 리셋 ───────────────────────────────────────────────────
  function resetAll() {
    state = { country: '일본', currency: 'JPY', unit: 100, krwAmount: 1000000, baseRate: 900, travelers: 1, travelDays: 4, overrides: {} };
    const setVal = (id, v) => { const el = q(id); if (el) el.value = v; };
    setVal('tecCurrency', 'JPY');
    setVal('tecRate', 900);
    setVal('tecAmount', 1000000);
    setVal('tecTravelers', 1);
    setVal('tecDays', 4);
    // 오버라이드 리셋
    METHOD_DEFAULTS.forEach(cfg => {
      qsa(`.tec-adv-input[data-method="${cfg.method}"][data-field="preferentialRate"]`)
        .forEach(el => { el.value = cfg.preferentialRate; });
      qsa(`.tec-adv-input[data-method="${cfg.method}"][data-field="fixedFee"]`)
        .forEach(el => { el.value = cfg.fixedFee; });
    });
    qsa('.tec-preset-chip').forEach(btn => btn.classList.toggle('is-active', btn.dataset.tecPreset === '일본'));
    update();
  }

  // ─── 이벤트 바인딩 ──────────────────────────────────────────
  function bindEvents() {
    // 기본 입력
    ['tecCurrency','tecRate','tecAmount','tecTravelers','tecDays'].forEach(id => {
      q(id)?.addEventListener('input', () => {
        // 통화 변경 시 기본 환율 자동 적용
        if (id === 'tecCurrency') {
          const opt = q('tecCurrency')?.selectedOptions[0];
          const defaultRate = parseFloat(opt?.dataset.rate || '0');
          const unit = parseInt(opt?.dataset.unit || '1');
          if (defaultRate > 0) { const r = q('tecRate'); if (r) r.value = defaultRate; }
          state.unit = unit;
        }
        update();
      });
    });

    // 상세 설정 입력
    qsa('.tec-adv-input').forEach(el => el.addEventListener('input', update));

    // 프리셋 칩
    qsa('.tec-preset-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = PRESETS.find(pr => pr.country === btn.dataset.tecPreset);
        if (p) applyPreset(p);
      });
    });

    // 리셋·복사
    q('tecResetBtn')?.addEventListener('click', resetAll);
    q('tecCopyLinkBtn')?.addEventListener('click', () => {
      syncUrl();
      navigator.clipboard?.writeText(location.href).catch(() => {});
    });
  }

  // ─── 초기화 ─────────────────────────────────────────────────
  restoreFromUrl();
  bindEvents();

  // 일본 프리셋 기본 active
  if (!new URLSearchParams(location.search).has('currency')) {
    qsa('.tec-preset-chip').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.tecPreset === '일본');
    });
  }

  update();
})();
