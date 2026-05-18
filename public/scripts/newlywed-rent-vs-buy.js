(() => {
  const DATA = JSON.parse(document.getElementById('nrbData').textContent);
  const LOAN_MONTHS = 360; // 30년 기준

  let state = {
    jeonseDeposit: 300000000,
    jeonseLoan: 150000000,
    jeonseLoanRate: 0.03,
    buyPrice: 500000000,
    buyLoan: 300000000,
    buyLoanRate: 0.04,
    loanType: 'equal-payment',
    livingYears: 5,
    housePriceGrowthRate: 0.02,
    depositReturnRate: 0.04,
    includeAcquisitionTax: true,
    isSpecialLoan: false,
    specialLoanRate: 0.027,
  };

  let chartInstance = null;

  function q(sel) { return document.querySelector(sel); }
  function qs(sel) { return document.querySelectorAll(sel); }

  function sanitize(val, fallback, min, max) {
    const n = parseFloat(String(val).replace(/,/g, ''));
    if (isNaN(n)) return fallback;
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  }

  function fmtWon(n) {
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function fmtMan(n) {
    const abs = Math.abs(n);
    if (abs >= 100000000) return (n / 100000000).toFixed(1) + '억원';
    if (abs >= 10000) return Math.round(n / 10000).toLocaleString('ko-KR') + '만원';
    return Math.round(n).toLocaleString('ko-KR') + '원';
  }

  function fmtMonthly(n) {
    return Math.round(n / 10000).toLocaleString('ko-KR') + '만원';
  }

  // 취득세 계산
  function calcAcquisitionTax(price) {
    let taxRate;
    if (price <= 600000000) {
      taxRate = DATA.ACQUISITION_TAX_RATE.under6; // 1.1%
    } else if (price <= 900000000) {
      taxRate = (price / 100000000 * 2 / 3 - 3) / 100;
    } else {
      taxRate = DATA.ACQUISITION_TAX_RATE.over9; // 3.3%
    }
    const tax = price * taxRate;
    const regFee = price * DATA.REGISTRATION_FEE_RATE;
    return tax + regFee;
  }

  // 원리금균등 월 상환액
  function calcEqualPaymentMonthly(loan, annualRate, months) {
    if (annualRate === 0) return loan / months;
    const r = annualRate / 12;
    return loan * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  }

  // Y년차 잔여 원금 (원리금균등)
  function calcRemainingPrincipal(loan, annualRate, months, yearsPaid) {
    if (annualRate === 0) return loan - loan / months * 12 * yearsPaid;
    const r = annualRate / 12;
    const n = yearsPaid * 12;
    return loan * (Math.pow(1 + r, months) - Math.pow(1 + r, n)) / (Math.pow(1 + r, months) - 1);
  }

  // Y년차 이자 (원리금균등 기준 연간 이자)
  function calcYearlyInterest(loan, annualRate, yearIdx, type) {
    if (type === 'bullet') {
      return loan * annualRate;
    }
    if (type === 'equal-principal') {
      const annualPrincipal = loan / (LOAN_MONTHS / 12);
      const remaining = Math.max(loan - annualPrincipal * (yearIdx - 1), 0);
      return remaining * annualRate;
    }
    // equal-payment
    const remaining = calcRemainingPrincipal(loan, annualRate, LOAN_MONTHS, yearIdx - 1);
    return remaining * annualRate;
  }

  // N년 후 잔여 대출
  function calcFinalRemaining(loan, annualRate, years, type) {
    if (type === 'bullet') return loan;
    if (type === 'equal-principal') {
      const annualPrincipal = loan / (LOAN_MONTHS / 12);
      return Math.max(loan - annualPrincipal * years, 0);
    }
    return Math.max(calcRemainingPrincipal(loan, annualRate, LOAN_MONTHS, years), 0);
  }

  function calculate(s) {
    const loanRate = s.isSpecialLoan ? s.specialLoanRate : s.buyLoanRate;

    // ── 전세 ──
    const jeonseEquity = Math.max(s.jeonseDeposit - s.jeonseLoan, 0);
    const jeonseInterestAnnual = s.jeonseLoan * s.jeonseLoanRate;
    const depositOpportunityCost = jeonseEquity * s.depositReturnRate;
    const jeonseAnnualCost = jeonseInterestAnnual + depositOpportunityCost;

    // ── 매매 ──
    const buyEquity = Math.max(s.buyPrice - s.buyLoan, 0);
    const monthlyPayment = calcEqualPaymentMonthly(s.buyLoan, loanRate, LOAN_MONTHS);
    const acquisitionTax = s.includeAcquisitionTax ? calcAcquisitionTax(s.buyPrice) : 0;
    const houseGrowthAnnual = s.buyPrice * s.housePriceGrowthRate;
    const buyInterestAnnual1 = calcYearlyInterest(s.buyLoan, loanRate, 1, s.loanType);
    const buyAnnualNetCost = buyInterestAnnual1 - houseGrowthAnnual;

    // ── 연도별 누적 ──
    const maxYears = Math.max(s.livingYears, 10);
    const yearResults = [];
    let buyCum = s.includeAcquisitionTax ? acquisitionTax : 0;
    let breakevenYear = null;

    for (let y = 1; y <= maxYears; y++) {
      const jeonseCum = jeonseAnnualCost * y;
      const buyInterestY = calcYearlyInterest(s.buyLoan, loanRate, y, s.loanType);
      buyCum += Math.max(buyInterestY - houseGrowthAnnual, buyInterestY * 0.05); // 매매 누적은 이자 최소 5% 반영
      const diff = jeonseCum - buyCum; // 양수 = 매매 유리
      yearResults.push({ year: y, jeonseCumCost: jeonseCum, buyCumCost: buyCum, diff });

      if (breakevenYear === null && diff >= 0) {
        breakevenYear = y;
      }
    }

    const finalResult = yearResults[s.livingYears - 1] || yearResults[yearResults.length - 1];
    const finalDiff = finalResult.diff;
    const betterOption = finalDiff > 0 ? 'BUY' : finalDiff < 0 ? 'JEONSE' : 'SAME';

    // ── 집값 상승 순자산 ──
    const houseFinalValue = s.buyPrice * Math.pow(1 + s.housePriceGrowthRate, s.livingYears);
    const remainingLoan = calcFinalRemaining(s.buyLoan, loanRate, s.livingYears, s.loanType);
    const buyFinalNetAsset = houseFinalValue - remainingLoan;

    // ── 특례대출 절감액 ──
    const normalInterestTotal = s.buyLoan * s.buyLoanRate * s.livingYears;
    const specialInterestTotal = s.buyLoan * s.specialLoanRate * s.livingYears;
    const specialLoanSaving = normalInterestTotal - specialInterestTotal;

    return {
      jeonseEquity, jeonseInterestAnnual, depositOpportunityCost, jeonseAnnualCost,
      buyEquity, buyMonthlyPayment: monthlyPayment, buyInterestAnnual: buyInterestAnnual1,
      acquisitionTax, buyAnnualNetCost,
      yearResults: yearResults.slice(0, maxYears),
      breakevenYear, finalDiff, betterOption,
      houseFinalValue, buyFinalNetAsset,
      specialLoanSaving,
      loanRate,
    };
  }

  function renderKpi(r, s) {
    const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    // Main card
    const absManwon = Math.abs(Math.round(r.finalDiff / 10000));
    const winLabel = r.betterOption === 'BUY' ? '매매가' : r.betterOption === 'JEONSE' ? '전세가' : '비슷합니다';
    setEl('nrbKpiMainLabel', `${s.livingYears}년 누적 순비용 차이`);
    setEl('nrbKpiMainValue', absManwon.toLocaleString('ko-KR') + '만원');
    setEl('nrbKpiMainSub', r.betterOption === 'SAME' ? '두 옵션이 비슷합니다' : `${winLabel} 약 ${absManwon.toLocaleString('ko-KR')}만원 저렴`);

    // 월 실부담
    setEl('nrbJeonseMonthlyValue', fmtMonthly(r.jeonseAnnualCost / 12) + '/월');
    setEl('nrbBuyMonthlyValue', fmtMonthly(r.buyMonthlyPayment) + '/월');

    // 손익분기
    if (r.breakevenYear && r.breakevenYear <= s.livingYears) {
      setEl('nrbBreakevenValue', r.breakevenYear + '년째');
      setEl('nrbBreakevenSub', `${r.breakevenYear}년째부터 매매가 유리`);
    } else if (r.breakevenYear) {
      setEl('nrbBreakevenValue', r.breakevenYear + '년째');
      setEl('nrbBreakevenSub', '입력 기간 이후 전환 예상');
    } else {
      setEl('nrbBreakevenValue', '전환 없음');
      setEl('nrbBreakevenSub', '설정 기간 내 전환점 없음');
    }

    // 자산 카드
    setEl('nrbHouseFinalLabel', `집값 (${s.livingYears}년 후)`);
    setEl('nrbHouseFinalValue', fmtMan(r.houseFinalValue));
    setEl('nrbNetAssetLabel', `매매 순자산 (${s.livingYears}년 후)`);
    setEl('nrbNetAssetValue', fmtMan(r.buyFinalNetAsset));
    setEl('nrbAssetTitle', `${s.livingYears}년 거주 후 매매 순자산`);
  }

  function renderMessage(r, s) {
    const el = document.getElementById('nrbResultMessage');
    if (!el) return;
    const jeonseDepositMan = Math.round(s.jeonseDeposit / 10000);
    const buyPriceMan = Math.round(s.buyPrice / 10000);
    const growthPct = (s.housePriceGrowthRate * 100).toFixed(1);
    const absManwon = Math.abs(Math.round(r.finalDiff / 10000));
    const winLabel = r.betterOption === 'BUY' ? '매매' : r.betterOption === 'JEONSE' ? '전세' : '두 선택이 비슷합니다';
    const breakText = r.breakevenYear
      ? `${r.breakevenYear}년째부터 매매가 더 유리해집니다.`
      : '입력 기간 내 전환점이 없습니다.';

    el.textContent = `전세 보증금 ${Math.round(jeonseDepositMan / 10000)}억 / 매매가 ${Math.round(buyPriceMan / 10000)}억 기준, 집값이 연 ${growthPct}% 오른다고 가정하면 ${s.livingYears}년 거주 시 ${winLabel}가 약 ${absManwon.toLocaleString('ko-KR')}만원 저렴합니다. ${breakText}`;
  }

  const TABLE_YEARS = [1, 3, 5, 10];

  function renderTable(r, s) {
    const tbody = document.getElementById('nrbCompareTableBody');
    if (!tbody) return;

    const years = [...new Set([...TABLE_YEARS, s.livingYears])].filter(y => y <= 20).sort((a, b) => a - b);
    const rows = years.map(y => {
      const yr = r.yearResults[y - 1];
      if (!yr) return '';
      const diff = yr.diff;
      const winner = diff > 0 ? 'BUY' : diff < 0 ? 'JEONSE' : 'SAME';
      const diffLabel = winner === 'BUY' ? `매매 +${fmtMan(diff)}` : winner === 'JEONSE' ? `전세 +${fmtMan(-diff)}` : '비슷';
      const isBreakeven = r.breakevenYear === y;
      const rowClass = isBreakeven ? ' class="is-breakeven"' : '';
      const diffClass = winner === 'BUY' ? ' class="is-buy-win"' : winner === 'JEONSE' ? ' class="is-jeonse-win"' : '';
      const yearLabel = y === s.livingYears ? `${y}년 (입력)` : `${y}년`;
      return `<tr${rowClass}><td>${yearLabel}${isBreakeven ? ' ⭐' : ''}</td><td>${fmtMan(yr.jeonseCumCost)}</td><td>${fmtMan(yr.buyCumCost)}</td><td${diffClass}>${diffLabel}</td></tr>`;
    }).join('');
    tbody.innerHTML = rows;
  }

  function renderChart(r, s) {
    const canvas = document.getElementById('nrbChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

    const maxY = Math.min(s.livingYears + 2, 20);
    const labels = r.yearResults.slice(0, maxY).map(y => `${y.year}년`);
    const jeonseData = r.yearResults.slice(0, maxY).map(y => Math.round(y.jeonseCumCost / 10000));
    const buyData = r.yearResults.slice(0, maxY).map(y => Math.round(y.buyCumCost / 10000));

    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '전세 누적 비용',
            data: jeonseData,
            borderColor: '#1a56db',
            backgroundColor: 'rgba(26,86,219,0.08)',
            tension: 0.3,
            fill: false,
            pointRadius: 4,
          },
          {
            label: '매매 누적 비용',
            data: buyData,
            borderColor: '#0f6e56',
            backgroundColor: 'rgba(15,110,86,0.08)',
            tension: 0.3,
            fill: false,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('ko-KR')}만원`,
            },
          },
        },
        scales: {
          y: {
            ticks: { callback: v => v.toLocaleString('ko-KR') + '만' },
          },
        },
      },
    });
  }

  function renderSpecialLoanCard(r, s) {
    const card = document.getElementById('nrbSpecialCard');
    if (!card) return;
    if (!s.isSpecialLoan) { card.classList.remove('is-visible'); return; }
    card.classList.add('is-visible');

    const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setEl('nrbNormalRateLabel', `일반 금리 (${(s.buyLoanRate * 100).toFixed(1)}%) 적용 시 ${s.livingYears}년 이자`);
    setEl('nrbSpecialRateLabel', `특례금리 (${(s.specialLoanRate * 100).toFixed(1)}%) 적용 시 ${s.livingYears}년 이자`);
    setEl('nrbNormalInterest', fmtMan(s.buyLoan * s.buyLoanRate * s.livingYears));
    setEl('nrbSpecialInterest', fmtMan(s.buyLoan * s.specialLoanRate * s.livingYears));
    setEl('nrbSpecialSaving', '+' + fmtMan(r.specialLoanSaving) + ' 절감');
  }

  function toggleSpecialLoanField(on) {
    const field = document.getElementById('nrbSpecialField');
    if (field) field.classList.toggle('is-open', on);
  }

  function readInputs() {
    const getNum = (sel, fb, min, max) => sanitize(q(sel)?.value, fb, min, max);
    const getPct = (val) => sanitize(val, 0, 0, 100) / 100;

    state.jeonseDeposit = getNum('[data-nrb-input="jeonseDeposit"]', 300000000, 0);
    state.jeonseLoan    = getNum('[data-nrb-input="jeonseLoan"]', 0, 0);
    state.jeonseLoanRate = getPct(q('[data-nrb-input="jeonseLoanRate"]')?.value);
    state.buyPrice      = getNum('[data-nrb-input="buyPrice"]', 500000000, 0);
    state.buyLoan       = getNum('[data-nrb-input="buyLoan"]', 0, 0);
    state.buyLoanRate   = getPct(q('[data-nrb-input="buyLoanRate"]')?.value);
    state.loanType      = q('[data-nrb-input="loanType"]')?.value ?? 'equal-payment';
    state.livingYears   = sanitize(q('[data-nrb-input="livingYears"]')?.value, 5, 1, 20);
    state.housePriceGrowthRate = getPct(q('[data-nrb-input="housePriceGrowthRate"]')?.value);
    state.depositReturnRate    = getPct(q('[data-nrb-input="depositReturnRate"]')?.value);
    state.includeAcquisitionTax = q('[data-nrb-input="includeAcquisitionTax"]')?.checked ?? true;
    state.isSpecialLoan         = q('[data-nrb-input="isSpecialLoan"]')?.checked ?? false;
    state.specialLoanRate       = getPct(q('[data-nrb-input="specialLoanRate"]')?.value ?? '2.7');

    // 음수 방어
    state.jeonseLoan = Math.min(state.jeonseLoan, state.jeonseDeposit);
    state.buyLoan    = Math.min(state.buyLoan, state.buyPrice);
  }

  function formatCommaInput(el) {
    const raw = el.value.replace(/,/g, '');
    const n = parseInt(raw);
    if (!isNaN(n)) el.value = n.toLocaleString('ko-KR');
  }

  function applyPreset(id) {
    const p = DATA.PRESETS.find(pr => pr.id === id);
    if (!p) return;

    const setComma = (sel, val) => {
      const el = q(sel);
      if (el) el.value = typeof val === 'number' ? val.toLocaleString('ko-KR') : val;
    };
    const setVal = (sel, val) => { const el = q(sel); if (el) el.value = val; };
    const setCheck = (sel, val) => { const el = q(sel); if (el) el.checked = val; };

    setComma('[data-nrb-input="jeonseDeposit"]', p.jeonseDeposit);
    setComma('[data-nrb-input="jeonseLoan"]', p.jeonseLoan);
    setVal('[data-nrb-input="jeonseLoanRate"]', (p.jeonseLoanRate * 100).toFixed(1));
    setComma('[data-nrb-input="buyPrice"]', p.buyPrice);
    setComma('[data-nrb-input="buyLoan"]', p.buyLoan);
    setVal('[data-nrb-input="buyLoanRate"]', (p.buyLoanRate * 100).toFixed(1));
    setVal('[data-nrb-input="loanType"]', p.loanType);
    setVal('[data-nrb-input="livingYears"]', p.livingYears);
    setVal('[data-nrb-input="housePriceGrowthRate"]', p.housePriceGrowthRate * 100);
    setVal('[data-nrb-input="depositReturnRate"]', p.depositReturnRate * 100);
    setCheck('[data-nrb-input="includeAcquisitionTax"]', p.includeAcquisitionTax);
    setCheck('[data-nrb-input="isSpecialLoan"]', p.isSpecialLoan);
    setVal('[data-nrb-input="specialLoanRate"]', (p.specialLoanRate * 100).toFixed(1));

    // 슬라이더 표시값 업데이트
    updateSliderDisplay('livingYears', p.livingYears + '년');
    updateSliderDisplay('housePriceGrowthRate', (p.housePriceGrowthRate * 100).toFixed(1) + '%');
    updateSliderDisplay('depositReturnRate', (p.depositReturnRate * 100).toFixed(1) + '%');

    toggleSpecialLoanField(p.isSpecialLoan);

    qs('.nrb-preset-btn').forEach(btn => btn.classList.toggle('is-active', btn.dataset.presetId === id));
    refresh();
  }

  function updateSliderDisplay(key, val) {
    const valMap = {
      livingYears: 'nrbLivingYearsVal',
      housePriceGrowthRate: 'nrbGrowthRateVal',
      depositReturnRate: 'nrbDepositReturnVal',
    };
    const el = document.getElementById(valMap[key]);
    if (el) el.textContent = val;
  }

  function syncUrl(s) {
    const p = new URLSearchParams({
      jd: s.jeonseDeposit, jl: s.jeonseLoan, jr: (s.jeonseLoanRate * 100).toFixed(1),
      bp: s.buyPrice, bl: s.buyLoan, br: (s.buyLoanRate * 100).toFixed(1),
      lt: s.loanType, ly: s.livingYears,
      gr: (s.housePriceGrowthRate * 100).toFixed(1),
      dr: (s.depositReturnRate * 100).toFixed(1),
      tax: s.includeAcquisitionTax ? '1' : '0',
      sp: s.isSpecialLoan ? '1' : '0',
      sr: (s.specialLoanRate * 100).toFixed(1),
    });
    history.replaceState(null, '', '?' + p.toString());
  }

  function restoreFromUrl() {
    const p = new URLSearchParams(location.search);
    if (!p.has('bp')) return;

    const setComma = (sel, val) => {
      const el = q(sel);
      if (el && val) el.value = parseInt(val).toLocaleString('ko-KR');
    };
    const setVal = (sel, val) => { const el = q(sel); if (el && val !== null) el.value = val; };
    const setCheck = (sel, val) => { const el = q(sel); if (el) el.checked = val === '1'; };

    setComma('[data-nrb-input="jeonseDeposit"]', p.get('jd'));
    setComma('[data-nrb-input="jeonseLoan"]', p.get('jl'));
    setVal('[data-nrb-input="jeonseLoanRate"]', p.get('jr'));
    setComma('[data-nrb-input="buyPrice"]', p.get('bp'));
    setComma('[data-nrb-input="buyLoan"]', p.get('bl'));
    setVal('[data-nrb-input="buyLoanRate"]', p.get('br'));
    setVal('[data-nrb-input="loanType"]', p.get('lt'));
    setVal('[data-nrb-input="livingYears"]', p.get('ly'));
    setVal('[data-nrb-input="housePriceGrowthRate"]', p.get('gr'));
    setVal('[data-nrb-input="depositReturnRate"]', p.get('dr'));
    setCheck('[data-nrb-input="includeAcquisitionTax"]', p.get('tax'));
    setCheck('[data-nrb-input="isSpecialLoan"]', p.get('sp'));
    setVal('[data-nrb-input="specialLoanRate"]', p.get('sr'));

    if (p.get('ly')) updateSliderDisplay('livingYears', p.get('ly') + '년');
    if (p.get('gr')) updateSliderDisplay('housePriceGrowthRate', p.get('gr') + '%');
    if (p.get('dr')) updateSliderDisplay('depositReturnRate', p.get('dr') + '%');
    if (p.get('sp') === '1') toggleSpecialLoanField(true);
  }

  function refresh() {
    readInputs();
    const r = calculate(state);
    renderKpi(r, state);
    renderMessage(r, state);
    renderTable(r, state);
    renderChart(r, state);
    renderSpecialLoanCard(r, state);
    syncUrl(state);
  }

  function bindEvents() {
    qs('[data-nrb-input]').forEach(el => {
      el.addEventListener('input', () => {
        if (el.dataset.nrbInput === 'isSpecialLoan') toggleSpecialLoanField(el.checked);

        // 슬라이더 실시간 표시
        if (el.dataset.nrbInput === 'livingYears') updateSliderDisplay('livingYears', el.value + '년');
        if (el.dataset.nrbInput === 'housePriceGrowthRate') updateSliderDisplay('housePriceGrowthRate', el.value + '%');
        if (el.dataset.nrbInput === 'depositReturnRate') updateSliderDisplay('depositReturnRate', el.value + '%');

        refresh();
      });
      el.addEventListener('change', refresh);
    });

    ['jeonseDeposit', 'jeonseLoan', 'buyPrice', 'buyLoan'].forEach(key => {
      const el = q(`[data-nrb-input="${key}"]`);
      if (el) el.addEventListener('blur', () => formatCommaInput(el));
    });

    qs('.nrb-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.presetId));
    });

    const resetBtn = document.getElementById('nrbResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => applyPreset('수도권-신혼'));

    const copyBtn = document.getElementById('nrbCopyLinkBtn');
    if (copyBtn) copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(location.href).catch(() => {});
    });
  }

  function init() {
    restoreFromUrl();
    bindEvents();
    refresh();
  }

  if (typeof Chart !== 'undefined') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
