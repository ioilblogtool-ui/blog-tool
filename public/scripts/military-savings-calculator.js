(() => {
  const root = document.querySelector(".msc-page");
  const configEl = document.getElementById("mscConfig");
  if (!root || !configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const defaults = config.defaultInput || {};
  const limits = config.limits || { maxMonths: 21, maxMonthlyContribution: 550000 };
  const presets = config.presets || [];

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const TAX_RATE = 0.154;

  let state = { ...defaults };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function calcInstallment({ monthlyContribution, months, annualRate, matchingRate, taxFree }) {
    const monthlyRate = annualRate / 100 / 12;
    const principal = monthlyContribution * months;
    const grossInterest = monthlyContribution * ((months * (months + 1)) / 2) * monthlyRate;
    const tax = taxFree ? 0 : grossInterest * TAX_RATE;
    const netInterest = Math.max(grossInterest - tax, 0);
    const matching = principal * (matchingRate / 100);
    const total = principal + netInterest + matching;
    return { principal, netInterest, matching, total };
  }

  function readState() {
    state.monthlyContribution = num($('[data-msc="monthlyContribution"]')?.value, defaults.monthlyContribution);
    state.months = Math.min(Math.max(num($('[data-msc="months"]')?.value, defaults.months), 1), limits.maxMonths);
    state.annualRate = num($('[data-msc="annualRate"]')?.value, defaults.annualRate);
    state.matchingRate = num($('[data-msc="matchingRate"]')?.value, defaults.matchingRate);
    state.taxFree = $('[data-msc="taxFree"]')?.checked ?? true;
  }

  function setControl(key, value) {
    const el = $(`[data-msc="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") el.checked = Boolean(value);
    else el.value = String(value);
  }

  function render() {
    const result = calcInstallment(state);

    $("#mscPrincipal").textContent = won(result.principal);
    $("#mscInterest").textContent = won(result.netInterest);
    $("#mscMatching").textContent = won(result.matching);
    $("#mscTotalPayout").textContent = won(result.total);
    $("#mscSummaryText").textContent = `월 ${won(state.monthlyContribution)}을 ${state.months}개월 납입했을 때 예상 만기 수령액입니다.`;

    renderScenarioTable();
    updateUrl();
  }

  function renderScenarioTable() {
    const max = limits.maxMonthlyContribution;
    const steps = [0.2, 0.4, 0.6, 0.8, 1].map((ratio) => Math.round((max * ratio) / 10000) * 10000);
    const body = $("#mscScenarioRows");
    if (!body) return;
    body.innerHTML = steps
      .map((amount) => {
        const result = calcInstallment({ ...state, monthlyContribution: amount });
        const isCurrent = amount === state.monthlyContribution;
        return `
          <tr class="${isCurrent ? "is-current" : ""}">
            <td>${won(amount)}</td>
            <td>${won(result.principal)}</td>
            <td>${won(result.netInterest)}</td>
            <td>${won(result.matching)}</td>
            <td>${won(result.total)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function updateUrl() {
    const params = new URLSearchParams({
      contribution: String(Math.round(state.monthlyContribution)),
      months: String(state.months),
      rate: String(state.annualRate),
      matching: String(state.matchingRate),
      taxFree: state.taxFree ? "1" : "0",
    });
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("contribution")) state.monthlyContribution = num(params.get("contribution"));
    if (params.has("months")) state.months = num(params.get("months"));
    if (params.has("rate")) state.annualRate = num(params.get("rate"));
    if (params.has("matching")) state.matchingRate = num(params.get("matching"));
    if (params.has("taxFree")) state.taxFree = params.get("taxFree") === "1";
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
  }

  $$("[data-msc]").forEach((el) => {
    const eventName = el.type === "checkbox" ? "change" : "input";
    el.addEventListener(eventName, () => {
      readState();
      render();
    });
  });

  $$("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      $$("[data-preset]").forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      state.months = num(button.dataset.presetMonths, defaults.months);
      state.monthlyContribution = num(button.dataset.presetContribution, defaults.monthlyContribution);
      Object.entries(state).forEach(([key, value]) => setControl(key, value));
      render();
    });
  });

  document.getElementById("mscResetBtn")?.addEventListener("click", () => {
    state = { ...defaults };
    Object.entries(state).forEach(([key, value]) => setControl(key, value));
    render();
  });

  document.getElementById("mscCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  });

  restoreFromUrl();
  render();
})();
