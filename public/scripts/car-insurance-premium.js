(function () {
  const cfg = JSON.parse(document.getElementById('cipConfig').textContent);
  const { basePremium, ageFactor, careerFactor, accidentFactor, priceFactor, carAgeFactor, driverFactor, coverageFactor, discounts, insurers, defaults } = cfg;

  let state = {
    carPrice: defaults.carPrice,
    carAge: defaults.carAge,
    driverAge: defaults.driverAge,
    career: defaults.career,
    accident: defaults.accident,
    driverScope: defaults.driverScope,
    coverage: defaults.coverage,
    checkedDiscounts: [],
  };

  // URL 복원
  const params = new URLSearchParams(location.search);
  if (params.get('cp'))   state.carPrice    = +params.get('cp');
  if (params.get('ca'))   state.carAge      = params.get('ca');
  if (params.get('da'))   state.driverAge   = +params.get('da');
  if (params.get('dc'))   state.career      = params.get('dc');
  if (params.get('acc'))  state.accident    = params.get('acc');
  if (params.get('ds'))   state.driverScope = params.get('ds');
  if (params.get('cov'))  state.coverage    = params.get('cov');
  if (params.get('disc')) state.checkedDiscounts = params.get('disc').split(',').filter(Boolean);

  function getAgeBand(age) {
    if (age <= 24) return '20-24';
    if (age <= 29) return '25-29';
    if (age <= 34) return '30-34';
    if (age <= 39) return '35-39';
    if (age <= 49) return '40-49';
    if (age <= 59) return '50-59';
    return '60+';
  }

  function getPriceKey(price) {
    const keys = Object.keys(priceFactor).map(Number).sort((a, b) => b - a);
    return String(keys.find(k => price >= k) || keys[keys.length - 1]);
  }

  function estimateBase() {
    let base = basePremium;
    base *= priceFactor[getPriceKey(state.carPrice)] || 1;
    base *= carAgeFactor[state.carAge] || 1;
    base *= coverageFactor[state.coverage] || 1;
    base *= ageFactor[getAgeBand(state.driverAge)] || 1;
    base *= careerFactor[state.career] || 1;
    base *= accidentFactor[state.accident] || 1;
    base *= driverFactor[state.driverScope] || 1;
    return Math.round(base / 10000) * 10000;
  }

  function calcDiscounts(base) {
    const checked = state.checkedDiscounts;
    // 마일리지: low/mid 중복 방지 — low 체크 시 mid 무시
    const hasMileageLow = checked.includes('mileage_low');
    let totalRate = 0;
    const applied = [];
    discounts.forEach(d => {
      if (!checked.includes(d.id)) return;
      if (d.id === 'mileage_mid' && hasMileageLow) return;
      totalRate += d.rate;
      applied.push({ ...d, amount: Math.round(base * d.rate) });
    });
    const cappedRate = Math.min(totalRate, 0.65);
    const discountTotal = Math.round(base * cappedRate);
    return { applied, totalRate: cappedRate, discountTotal, final: base - discountTotal };
  }

  function recommendInsurers() {
    const checked = state.checkedDiscounts;
    const hasChild = checked.includes('child_infant') || checked.includes('child_multi') || checked.includes('birth') || checked.includes('pregnant');
    const hasMileage = checked.includes('mileage_low') || checked.includes('mileage_mid');
    const hasDirect = checked.includes('direct');
    return [...insurers].map(ins => {
      let score = ins.share;
      if (hasChild && ins.childDiscount) score += 20;
      if (hasMileage && ins.mileageDiscount) score += 10;
      if (hasDirect && ins.directDiscount) score += 5;
      return { ...ins, score };
    }).sort((a, b) => b.score - a.score).slice(0, 3);
  }

  function fmt(n) { return Math.round(n).toLocaleString('ko-KR') + '원'; }

  function render() {
    const base = estimateBase();
    const { applied, totalRate, discountTotal, final } = calcDiscounts(base);

    // KPI
    setText('cipBeforeVal', fmt(base));
    setText('cipRateVal', Math.round(totalRate * 100) + '%');
    setText('cipAfterVal', fmt(final));
    setText('cipAfterSub', discountTotal > 0 ? `연 ${fmt(discountTotal)} 절약` : '');

    // 절약 배너
    const banner = document.getElementById('cipSavingBanner');
    if (banner) {
      if (discountTotal > 0) {
        banner.textContent = `✅ 할인 항목 적용 시 연 ${fmt(discountTotal)} 절약 가능`;
        banner.classList.remove('is-hidden');
      } else {
        banner.classList.add('is-hidden');
      }
    }

    // 적용 할인 리스트
    const listEl = document.getElementById('cipAppliedList');
    if (listEl) {
      if (applied.length === 0) {
        listEl.innerHTML = '<p class="cip-no-discount">적용된 할인 항목이 없습니다.<br>왼쪽 체크리스트에서 해당 항목을 선택하세요.</p>';
      } else {
        listEl.innerHTML = applied.map(d =>
          `<div class="cip-applied-item">
            <span class="cip-applied-item__label">${d.icon} ${d.label}</span>
            <span class="cip-applied-item__amount">-${fmt(d.amount)} (${Math.round(d.rate * 100)}%)</span>
          </div>`
        ).join('');
      }
    }

    // 보험사 추천
    renderRecommend();
  }

  function renderRecommend() {
    const top3 = recommendInsurers();
    const grid = document.getElementById('cipRecommendGrid');
    if (!grid) return;
    grid.innerHTML = top3.map((ins, i) => `
      <div class="cip-recommend-card${i === 0 ? ' cip-recommend-card--top' : ''}">
        <div class="cip-recommend-card__rank">${i === 0 ? '🏆 1순위 추천' : i === 1 ? '2순위' : '3순위'}</div>
        <div class="cip-recommend-card__name">${ins.name}</div>
        <ul class="cip-recommend-card__strengths">
          ${ins.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function syncURL() {
    const p = new URLSearchParams({
      cp: state.carPrice,
      ca: state.carAge,
      da: state.driverAge,
      dc: state.career,
      acc: state.accident,
      ds: state.driverScope,
      cov: state.coverage,
      disc: state.checkedDiscounts.join(','),
    });
    history.replaceState(null, '', '?' + p.toString());
  }

  function bindInputs() {
    // select / number inputs
    document.querySelectorAll('[data-cip]').forEach(el => {
      const key = el.dataset.cip;
      el.value = state[key] ?? '';
      el.addEventListener('change', () => {
        state[key] = el.type === 'number' ? +el.value : el.value;
        render();
        syncURL();
      });
      el.addEventListener('input', () => {
        state[key] = el.type === 'number' ? +el.value : el.value;
        render();
        syncURL();
      });
    });

    // 할인 체크박스
    document.querySelectorAll('[data-cip-disc]').forEach(el => {
      const id = el.dataset.cipDisc;
      el.checked = state.checkedDiscounts.includes(id);
      el.addEventListener('change', () => {
        if (el.checked) {
          if (!state.checkedDiscounts.includes(id)) state.checkedDiscounts.push(id);
        } else {
          state.checkedDiscounts = state.checkedDiscounts.filter(d => d !== id);
        }
        render();
        syncURL();
      });
    });
  }

  // 리셋
  const resetBtn = document.getElementById('cipResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { ...defaults, checkedDiscounts: [], carPrice: defaults.carPrice, driverAge: defaults.driverAge };
      document.querySelectorAll('[data-cip]').forEach(el => { el.value = state[el.dataset.cip] ?? ''; });
      document.querySelectorAll('[data-cip-disc]').forEach(el => { el.checked = false; });
      render();
      syncURL();
    });
  }

  // 링크 복사
  const copyBtn = document.getElementById('cipCopyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      syncURL();
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  bindInputs();
  render();
})();
