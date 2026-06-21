(function () {
  const dataEl = document.getElementById("aws-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent || "{}");
  const players = Array.isArray(data.players) ? data.players : [];
  const defaultRates = data.rates || { USD: 1375, EUR: 1485, GBP: 1740, KRW: 1 };
  const rateInputs = Array.from(document.querySelectorAll("[data-rate-input]"));
  const viewMode = document.querySelector("[data-view-mode]");
  const resetButton = document.querySelector("[data-reset-rates]");
  const copyButton = document.querySelector("[data-copy-link]");
  const copyStatus = document.querySelector("[data-copy-status]");

  const clampRate = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(Math.max(parsed, 100), 3000);
  };

  const getRates = () => {
    const rates = { ...defaultRates, KRW: 1 };
    rateInputs.forEach((input) => {
      const code = input.getAttribute("data-rate-input");
      rates[code] = clampRate(input.value, defaultRates[code] || 1);
    });
    return rates;
  };

  const toKrw = (player, rates) => Math.round(player.salaryAmount * (rates[player.salaryCurrency] || 1));
  const formatEok = (value) => {
    if (value >= 100000000) {
      const eok = value / 100000000;
      return `${eok >= 10 ? Math.round(eok).toLocaleString() : eok.toFixed(1)}억`;
    }
    return `${Math.round(value / 10000).toLocaleString()}만원`;
  };
  const formatWon = (value) => `${Math.round(value).toLocaleString()}원`;
  const derived = (annual) => ({
    annual,
    monthly: annual / 12,
    daily: annual / 365,
    match90: (annual / 365 / 24 / 60) * 90,
  });

  const getDisplayValue = (annual, mode) => {
    const values = derived(annual);
    if (mode === "match90") return formatWon(values.match90);
    if (mode === "daily") return formatWon(values.daily);
    if (mode === "monthly") return formatEok(values.monthly);
    return formatEok(values.annual);
  };

  const syncUrl = () => {
    const params = new URLSearchParams(window.location.search);
    rateInputs.forEach((input) => {
      params.set(input.getAttribute("data-rate-input").toLowerCase(), input.value);
    });
    if (viewMode) params.set("view", viewMode.value);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", next);
  };

  const restoreFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    rateInputs.forEach((input) => {
      const code = input.getAttribute("data-rate-input");
      const value = params.get(code.toLowerCase());
      if (value) input.value = String(clampRate(value, defaultRates[code] || 1));
    });
    const view = params.get("view");
    if (viewMode && ["annual", "monthly", "daily", "match90"].includes(view)) {
      viewMode.value = view;
    }
  };

  const update = () => {
    const rates = getRates();
    const mode = viewMode ? viewMode.value : "annual";
    const sorted = players
      .map((player) => ({ ...player, krwSalary: toKrw(player, rates) }))
      .sort((a, b) => b.krwSalary - a.krwSalary);

    const top10Total = sorted.slice(0, 10).reduce((sum, player) => sum + player.krwSalary, 0);
    const overseasTotal = sorted
      .filter((player) => player.league !== "K리그1")
      .reduce((sum, player) => sum + player.krwSalary, 0);

    const topKpi = document.querySelector("[data-kpi='top-player']");
    const top10Kpi = document.querySelector("[data-kpi='top10-total']");
    const overseasKpi = document.querySelector("[data-kpi='overseas-total']");
    if (topKpi && sorted[0]) topKpi.textContent = `${formatEok(sorted[0].krwSalary)} · ${sorted[0].sourceBadge}`;
    if (top10Kpi) top10Kpi.textContent = formatEok(top10Total);
    if (overseasKpi) overseasKpi.textContent = formatEok(overseasTotal);

    sorted.forEach((player, index) => {
      const values = derived(player.krwSalary);
      const row = document.querySelector(`[data-player-row="${player.id}"]`);
      if (row) {
        row.style.order = String(index);
        const rankCell = row.querySelector("[data-rank-cell]");
        if (rankCell) rankCell.textContent = String(index + 1);
      }

      const valueEls = [
        document.querySelector(`[data-player-value="${player.id}"]`),
        document.querySelector(`[data-table-annual="${player.id}"]`),
      ].filter(Boolean);
      valueEls.forEach((el) => {
        el.textContent = getDisplayValue(player.krwSalary, mode);
      });

      const monthlyEls = [
        document.querySelector(`[data-player-monthly="${player.id}"]`),
        document.querySelector(`[data-table-monthly="${player.id}"]`),
      ].filter(Boolean);
      monthlyEls.forEach((el) => {
        el.textContent = formatEok(values.monthly);
      });

      const matchEls = [
        document.querySelector(`[data-player-match90="${player.id}"]`),
        document.querySelector(`[data-table-match90="${player.id}"]`),
      ].filter(Boolean);
      matchEls.forEach((el) => {
        el.textContent = formatWon(values.match90);
      });
    });

    const positionTotals = ["FW", "MF", "DF", "GK"].map((position) => ({
      position,
      total: sorted.filter((player) => player.position === position).reduce((sum, player) => sum + player.krwSalary, 0),
    }));
    const maxPosition = Math.max(...positionTotals.map((item) => item.total), 1);
    positionTotals.forEach((item) => {
      const totalEl = document.querySelector(`[data-position-total="${item.position}"]`);
      const barEl = document.querySelector(`[data-position-bar="${item.position}"]`);
      if (totalEl) totalEl.textContent = formatEok(item.total);
      if (barEl) barEl.style.width = `${Math.max((item.total / maxPosition) * 100, 6)}%`;
    });

    syncUrl();
  };

  restoreFromUrl();
  rateInputs.forEach((input) => input.addEventListener("input", update));
  if (viewMode) viewMode.addEventListener("change", update);
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      rateInputs.forEach((input) => {
        const code = input.getAttribute("data-rate-input");
        input.value = defaultRates[code] || 1;
      });
      if (viewMode) viewMode.value = "annual";
      update();
    });
  }
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (copyStatus) copyStatus.textContent = "링크를 복사했습니다.";
      } catch (_error) {
        if (copyStatus) copyStatus.textContent = "주소창의 링크를 복사해 주세요.";
      }
    });
  }

  update();
})();
