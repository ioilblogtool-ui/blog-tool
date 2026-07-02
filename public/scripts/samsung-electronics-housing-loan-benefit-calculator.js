(function () {
  const root = document.querySelector('[data-calculator="samsung-electronics-housing-loan-benefit-calculator"]');
  if (!root) return;

  const inputs = {
    principal: root.querySelector('[data-sehl-input="principal"]'),
    benefitRate: root.querySelector('[data-sehl-input="benefit-rate"]'),
    marketRate: root.querySelector('[data-sehl-input="market-rate"]'),
    years: root.querySelector('[data-sehl-input="years"]'),
    taxRate: root.querySelector('[data-sehl-input="tax-rate"]'),
  };

  const outputs = {
    summary: root.querySelector('[data-sehl-output="summary"]'),
    annualSaving: root.querySelector('[data-sehl-output="annual-saving"]'),
    monthlySaving: root.querySelector('[data-sehl-output="monthly-saving"]'),
    totalSaving: root.querySelector('[data-sehl-output="total-saving"]'),
    grossSalary: root.querySelector('[data-sehl-output="gross-salary"]'),
    benefitInterest: root.querySelector('[data-sehl-output="benefit-interest"]'),
    marketInterest: root.querySelector('[data-sehl-output="market-interest"]'),
    rateGap: root.querySelector('[data-sehl-output="rate-gap"]'),
    warning: root.querySelector('[data-sehl-output="warning"]'),
  };

  const marketTable = root.querySelector('[data-sehl-table="market-rate"]');
  const principalTable = root.querySelector('[data-sehl-table="principal"]');
  const resetButton = document.getElementById("sehlResetBtn");
  const copyButton = document.getElementById("sehlCopyLinkBtn");
  const defaults = {
    principal: 500000000,
    benefitRate: 1.5,
    marketRate: 4.0,
    years: 10,
    taxRate: 24,
  };
  const principalPresets = [100000000, 300000000, 500000000, 700000000];
  const marketRatePresets = [3.5, 4.0, 4.5, 5.0];

  function parseNumber(value) {
    const normalized = String(value ?? "").replace(/,/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function readState() {
    return {
      principal: clamp(parseNumber(inputs.principal?.value), 0, 1000000000),
      benefitRate: clamp(parseNumber(inputs.benefitRate?.value), 0, 10),
      marketRate: clamp(parseNumber(inputs.marketRate?.value), 0, 15),
      years: clamp(parseNumber(inputs.years?.value), 1, 40),
      taxRate: clamp(parseNumber(inputs.taxRate?.value), 0, 100),
    };
  }

  function calculate(state) {
    const benefitAnnualInterest = state.principal * (state.benefitRate / 100);
    const marketAnnualInterest = state.principal * (state.marketRate / 100);
    const annualSaving = marketAnnualInterest - benefitAnnualInterest;
    const monthlySaving = annualSaving / 12;
    const totalSaving = annualSaving * state.years;
    const grossSalary = state.taxRate >= 100 ? null : annualSaving / (1 - state.taxRate / 100);

    return {
      benefitAnnualInterest,
      marketAnnualInterest,
      annualSaving,
      monthlySaving,
      totalSaving,
      grossSalary,
      rateGap: state.marketRate - state.benefitRate,
    };
  }

  function formatWon(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (abs >= 100000000) {
      const eok = abs / 100000000;
      const formatted = Number.isInteger(eok) ? eok.toFixed(0) : eok.toFixed(1);
      return `${sign}${formatted}억 원`;
    }

    if (abs >= 10000) {
      return `${sign}${Math.round(abs / 10000).toLocaleString("ko-KR")}만 원`;
    }

    return `${sign}${Math.round(abs).toLocaleString("ko-KR")}원`;
  }

  function formatPercent(value) {
    return `${value.toFixed(1)}%`;
  }

  function writeText(node, value) {
    if (node) node.textContent = value;
  }

  function syncPresetState(group, value) {
    root.querySelectorAll(`[data-sehl-preset="${group}"]`).forEach((button) => {
      const isActive = Number(button.dataset.value) === Number(value);
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderMarketRows(state) {
    if (!marketTable) return;

    marketTable.innerHTML = marketRatePresets
      .map((marketRate) => {
        const rowResult = calculate({ ...state, marketRate });
        return `<tr>
          <td>${formatPercent(marketRate)}</td>
          <td>${formatPercent(marketRate - state.benefitRate)}p</td>
          <td>${formatWon(rowResult.annualSaving)}</td>
          <td>${formatWon(rowResult.monthlySaving)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderPrincipalRows(state) {
    if (!principalTable) return;

    principalTable.innerHTML = principalPresets
      .map((principal) => {
        const rowResult = calculate({ ...state, principal });
        const label = principal >= 100000000 ? `${principal / 100000000}억` : formatWon(principal);
        return `<tr>
          <td>${label}</td>
          <td>${formatWon(rowResult.annualSaving)}</td>
          <td>${formatWon(rowResult.monthlySaving)}</td>
        </tr>`;
      })
      .join("");
  }

  function renderWarning(state, result) {
    if (!outputs.warning) return;

    outputs.warning.classList.toggle("is-negative", result.annualSaving < 0);

    if (result.annualSaving < 0) {
      outputs.warning.textContent = "입력한 시중금리가 복지금리보다 낮아 이자 절감 효과가 없습니다.";
      return;
    }

    if (state.taxRate >= 100) {
      outputs.warning.textContent = "세율은 100% 미만으로 입력해야 세전 연봉 환산액을 계산할 수 있습니다.";
      return;
    }

    outputs.warning.textContent =
      "실제 순이득은 과세 여부, 대출 실행 조건, 기존 대출 수수료에 따라 달라질 수 있습니다.";
  }

  function render() {
    const state = readState();
    const result = calculate(state);

    if (inputs.principal) inputs.principal.value = Math.round(state.principal).toLocaleString("ko-KR");
    syncPresetState("principal", state.principal);
    syncPresetState("market-rate", state.marketRate);
    syncPresetState("tax-rate", state.taxRate);

    writeText(
      outputs.summary,
      `시중금리 ${formatPercent(state.marketRate)}와 복지금리 ${formatPercent(state.benefitRate)}의 차이 ${formatPercent(result.rateGap)}p 기준입니다.`
    );
    writeText(outputs.annualSaving, formatWon(result.annualSaving));
    writeText(outputs.monthlySaving, formatWon(result.monthlySaving));
    writeText(outputs.totalSaving, formatWon(result.totalSaving));
    writeText(outputs.grossSalary, result.grossSalary === null ? "계산 불가" : formatWon(result.grossSalary));
    writeText(outputs.benefitInterest, formatWon(result.benefitAnnualInterest));
    writeText(outputs.marketInterest, formatWon(result.marketAnnualInterest));
    writeText(outputs.rateGap, `${formatPercent(result.rateGap)}p`);
    renderWarning(state, result);
    renderMarketRows(state);
    renderPrincipalRows(state);
  }

  function reset() {
    if (inputs.principal) inputs.principal.value = defaults.principal.toLocaleString("ko-KR");
    if (inputs.benefitRate) inputs.benefitRate.value = String(defaults.benefitRate);
    if (inputs.marketRate) inputs.marketRate.value = String(defaults.marketRate);
    if (inputs.years) inputs.years.value = String(defaults.years);
    if (inputs.taxRate) inputs.taxRate.value = String(defaults.taxRate);
    render();
  }

  Object.values(inputs).forEach((input) => {
    input?.addEventListener("input", render);
    input?.addEventListener("change", render);
  });

  root.querySelectorAll("[data-sehl-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.sehlPreset;
      const value = button.dataset.value;
      if (group === "principal" && inputs.principal) inputs.principal.value = Number(value).toLocaleString("ko-KR");
      if (group === "market-rate" && inputs.marketRate) inputs.marketRate.value = value;
      if (group === "tax-rate" && inputs.taxRate) inputs.taxRate.value = value;
      render();
    });
  });

  resetButton?.addEventListener("click", reset);
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "링크 복사 완료";
      window.setTimeout(() => {
        copyButton.textContent = "링크 복사";
      }, 1600);
    } catch {
      copyButton.textContent = "복사 실패";
    }
  });

  render();
})();
