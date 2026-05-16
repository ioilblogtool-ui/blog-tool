(() => {
  const configEl = document.getElementById("coinDcaCalculatorConfig");
  const config = JSON.parse(configEl?.textContent || "{}");
  const presets = config.presets || [];
  const defaultInput = config.defaultInput || {
    coinName: "비트코인(BTC)",
    monthlyAmount: 100000,
    months: 24,
    currentPrice: 130000000,
    startPrice: 80000000,
  };

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    coin: q("[data-cdca-input='coin']"),
    monthly: q("[data-cdca-input='monthly']"),
    months: q("[data-cdca-input='months']"),
    price: q("[data-cdca-input='price']"),
    startPrice: q("[data-cdca-input='startPrice']"),
    error: q("#cdcaError"),
    resultSubcopy: q("#cdcaResultSubcopy"),
    avgPrice: q("#cdcaAvgPrice"),
    totalInvested: q("#cdcaTotalInvested"),
    currentValue: q("#cdcaCurrentValue"),
    returnRate: q("#cdcaReturnRate"),
    returnNote: q("#cdcaReturnNote"),
    totalCoins: q("#cdcaTotalCoins"),
    message: q("#cdcaMessage"),
    scenarioBody: q("#cdcaScenarioBody"),
    monthlyBody: q("#cdcaMonthlyBody"),
    resetBtn: q("#resetCoinDcaBtn"),
    copyBtn: q("#copyCoinDcaLinkBtn"),
  };

  let state = { ...defaultInput };

  function numberOnly(value) {
    return String(value || "").replace(/[^\d.-]/g, "");
  }

  function sanitize(value, fallback, min, max) {
    const n = Number(numberOnly(value));
    if (!Number.isFinite(n) || n < min) return fallback;
    if (typeof max === "number") return Math.min(n, max);
    return n;
  }

  function formatInput(value) {
    const n = Number(numberOnly(value));
    return Number.isFinite(n) ? Math.round(n).toLocaleString("ko-KR") : "";
  }

  function fmtWon(value) {
    const rounded = Math.round(value);
    return `${rounded.toLocaleString("ko-KR")}원`;
  }

  function fmtCompactWon(value) {
    const n = Math.round(value);
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    const eok = Math.floor(abs / 100000000);
    const man = Math.round((abs % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
    if (eok > 0) return `${sign}${eok}억원`;
    return `${sign}${man.toLocaleString("ko-KR")}만원`;
  }

  function fmtCoin(value) {
    if (!Number.isFinite(value)) return "-";
    if (value >= 1) return value.toLocaleString("ko-KR", { maximumFractionDigits: 6 });
    return value.toLocaleString("ko-KR", { maximumFractionDigits: 8, minimumFractionDigits: 8 });
  }

  function fmtRate(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function classify(value) {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "";
  }

  function readInputs() {
    state.coinName = String(els.coin?.value || "").trim() || "코인";
    state.monthlyAmount = sanitize(els.monthly?.value, defaultInput.monthlyAmount, 1000);
    state.months = Math.round(sanitize(els.months?.value, defaultInput.months, 1, 120));
    state.currentPrice = sanitize(els.price?.value, defaultInput.currentPrice, 1);
    const rawStart = String(els.startPrice?.value || "").trim();
    state.startPrice = rawStart ? sanitize(rawStart, null, 1) : null;
  }

  function writeInputs(next) {
    state = { ...state, ...next };
    if (els.coin) els.coin.value = state.coinName || "";
    if (els.monthly) els.monthly.value = Math.round(state.monthlyAmount).toLocaleString("ko-KR");
    if (els.months) els.months.value = String(Math.round(state.months));
    if (els.price) els.price.value = Math.round(state.currentPrice).toLocaleString("ko-KR");
    if (els.startPrice) {
      els.startPrice.value = state.startPrice ? Math.round(state.startPrice).toLocaleString("ko-KR") : "";
    }
  }

  function calculate(input) {
    const effectiveStart = input.startPrice ?? input.currentPrice;
    const months = Math.max(1, Math.round(input.months));
    let totalCoins = 0;
    const monthlyData = [];

    for (let i = 0; i < months; i += 1) {
      const t = months === 1 ? 0 : i / (months - 1);
      const price = effectiveStart + (input.currentPrice - effectiveStart) * t;
      const coinsThisMonth = input.monthlyAmount / price;
      totalCoins += coinsThisMonth;
      const totalInvested = input.monthlyAmount * (i + 1);

      monthlyData.push({
        month: i + 1,
        price,
        coinsThisMonth,
        totalCoins,
        totalInvested,
        avgBuyPrice: totalInvested / totalCoins,
      });
    }

    const totalInvested = input.monthlyAmount * months;
    const avgBuyPrice = totalInvested / totalCoins;
    const currentValue = totalCoins * input.currentPrice;
    const profitLoss = currentValue - totalInvested;
    const returnRate = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalCoins,
      avgBuyPrice,
      currentValue,
      profitLoss,
      returnRate,
      breakEvenPrice: avgBuyPrice,
      monthlyData,
      simpleMode: input.startPrice === null || input.startPrice === input.currentPrice,
    };
  }

  function renderKpi(result) {
    if (els.avgPrice) els.avgPrice.textContent = fmtWon(result.avgBuyPrice);
    if (els.totalInvested) els.totalInvested.textContent = fmtCompactWon(result.totalInvested);
    if (els.currentValue) els.currentValue.textContent = fmtCompactWon(result.currentValue);
    if (els.returnRate) {
      els.returnRate.textContent = fmtRate(result.returnRate);
      els.returnRate.classList.toggle("positive", result.returnRate > 0);
      els.returnRate.classList.toggle("negative", result.returnRate < 0);
    }
    if (els.returnNote) {
      els.returnNote.textContent = result.simpleMode ? "시작가 입력 시 수익률 계산" : "세금·수수료 전 추정";
    }
    if (els.totalCoins) els.totalCoins.textContent = fmtCoin(result.totalCoins);
    if (els.resultSubcopy) {
      els.resultSubcopy.textContent = `${state.coinName} · ${state.months}개월 · 월 ${fmtCompactWon(state.monthlyAmount)} 기준`;
    }
  }

  function renderMessage(result) {
    if (!els.message) return;
    const coin = state.coinName || "코인";
    const startText = state.startPrice ? `${fmtCompactWon(state.startPrice)}부터 ` : "";
    const direction = result.profitLoss > 0 ? "수익 구간" : result.profitLoss < 0 ? "손실 구간" : "손익분기 구간";
    const modeNote = result.simpleMode
      ? "시작가를 입력하지 않아 전 기간을 현재가로 매수한 단순 모드입니다. 이 결과는 수익률보다 보유 수량 확인에 가깝습니다."
      : `평균 매수가는 약 ${fmtWon(result.avgBuyPrice)}이며 현재가 대비 ${fmtRate(result.returnRate)}의 세전 수익률로 추정됩니다.`;

    els.message.innerHTML = `
      <strong>${coin} DCA 결과는 ${direction}입니다.</strong>
      <p>${coin}을 ${startText}월 ${fmtCompactWon(state.monthlyAmount)}씩 ${state.months}개월간 적립하면 총 투자금 ${fmtCompactWon(result.totalInvested)}으로 약 ${fmtCoin(result.totalCoins)}개를 모을 수 있습니다.</p>
      <p>${modeNote}</p>
    `;
  }

  function renderScenarioTable(result) {
    if (!els.scenarioBody) return;
    const rows = [
      { label: "-30%", multiplier: 0.7 },
      { label: "-10%", multiplier: 0.9 },
      { label: "현재", multiplier: 1, current: true },
      { label: "+10%", multiplier: 1.1 },
      { label: "+30%", multiplier: 1.3 },
    ];

    els.scenarioBody.innerHTML = rows.map((row) => {
      const price = state.currentPrice * row.multiplier;
      const value = result.totalCoins * price;
      const profit = value - result.totalInvested;
      const rate = (profit / result.totalInvested) * 100;
      const cls = classify(profit);
      return `
        <tr class="${row.current ? "is-current" : ""}">
          <td>${row.label} (${fmtWon(price)})</td>
          <td>${fmtCompactWon(value)}</td>
          <td class="${cls}">${profit >= 0 ? "+" : ""}${fmtCompactWon(profit)}</td>
          <td class="${cls}">${fmtRate(rate)}</td>
        </tr>
      `;
    }).join("");
  }

  function importantMonths(months) {
    const set = new Set([1, months]);
    [6, 12, 18, 24, 36, 60, 84, 120].forEach((m) => {
      if (m > 1 && m < months) set.add(m);
    });
    return Array.from(set).sort((a, b) => a - b);
  }

  function renderMonthlyTable(result) {
    if (!els.monthlyBody) return;
    const months = importantMonths(result.monthlyData.length);
    els.monthlyBody.innerHTML = months.map((month) => {
      const item = result.monthlyData[month - 1];
      return `
        <tr>
          <td>${item.month}개월차</td>
          <td>${fmtWon(item.price)}</td>
          <td>${fmtCoin(item.coinsThisMonth)}</td>
          <td>${fmtCoin(item.totalCoins)}</td>
          <td>${fmtWon(item.avgBuyPrice)}</td>
        </tr>
      `;
    }).join("");
  }

  function setError(message) {
    if (!els.error) return;
    els.error.hidden = !message;
    els.error.textContent = message || "";
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("coin", state.coinName);
    params.set("monthly", Math.round(state.monthlyAmount));
    params.set("months", Math.round(state.months));
    params.set("price", Math.round(state.currentPrice));
    if (state.startPrice) params.set("start", Math.round(state.startPrice));
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (!params.toString()) return false;
    const next = {
      coinName: params.get("coin") || defaultInput.coinName,
      monthlyAmount: sanitize(params.get("monthly"), defaultInput.monthlyAmount, 1000),
      months: Math.round(sanitize(params.get("months"), defaultInput.months, 1, 120)),
      currentPrice: sanitize(params.get("price"), defaultInput.currentPrice, 1),
      startPrice: params.get("start") ? sanitize(params.get("start"), null, 1) : null,
    };
    writeInputs(next);
    return true;
  }

  function render() {
    readInputs();
    writeInputs(state);

    if (state.monthlyAmount < 1000) {
      setError("월 적립액은 1,000원 이상 입력하세요.");
      return;
    }
    if (state.months < 1) {
      setError("적립 기간은 1개월 이상 입력하세요.");
      return;
    }
    if (state.currentPrice < 1) {
      setError("현재 코인 가격은 1원 이상 입력하세요.");
      return;
    }

    setError("");
    const result = calculate(state);
    renderKpi(result);
    renderMessage(result);
    renderScenarioTable(result);
    renderMonthlyTable(result);
    syncUrl();
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    qa("[data-cdca-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.cdcaPreset === id);
    });
    writeInputs({
      coinName: preset.coinName,
      monthlyAmount: preset.monthlyAmount,
      months: preset.months,
      currentPrice: preset.currentPrice,
      startPrice: preset.startPrice,
    });
    render();
  }

  function resetAll() {
    qa("[data-cdca-preset]").forEach((button, index) => {
      button.classList.toggle("is-active", index === 0);
    });
    writeInputs(defaultInput);
    history.replaceState(null, "", location.pathname);
    render();
  }

  function copyLink() {
    navigator.clipboard?.writeText(location.href).then(() => {
      if (!els.copyBtn) return;
      const original = els.copyBtn.textContent;
      els.copyBtn.textContent = "복사됨";
      setTimeout(() => {
        els.copyBtn.textContent = original;
      }, 1400);
    });
  }

  function bindEvents() {
    qa("[data-cdca-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", () => {
        if (input.dataset.cdcaInput !== "coin") input.value = formatInput(input.value);
        render();
      });
    });

    qa("[data-cdca-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.cdcaPreset));
    });

    els.resetBtn?.addEventListener("click", resetAll);
    els.copyBtn?.addEventListener("click", copyLink);
  }

  restoreFromUrl();
  bindEvents();
  render();
})();

