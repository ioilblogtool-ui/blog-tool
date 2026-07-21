(() => {
  const root = document.querySelector(".suc-page");
  const dataEl = document.getElementById("suc-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const defaultInput = DATA.defaultInput;
  const items = DATA.items || [];
  const presets = DATA.presets || [];
  const scenarios = DATA.scenarios || {};
  const groupLabels = DATA.groupLabels || {};

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  let state = structuredClone(defaultInput);

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function percent(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function getItemMeta(id) {
    return items.find((item) => item.id === id);
  }

  function getPreset(type = state.uniformType) {
    return presets.find((preset) => preset.id === type) || presets[0];
  }

  function calculate() {
    const groupTotals = {};
    let uniformSubtotal = 0;

    state.items.forEach((item) => {
      const meta = getItemMeta(item.id);
      if (!meta) return;
      const lineTotal = Math.max(0, item.unitPrice) * Math.max(0, item.quantity);
      groupTotals[meta.group] = (groupTotals[meta.group] || 0) + lineTotal;
      uniformSubtotal += lineTotal;
    });

    const supportApplied = state.supportEnabled ? Math.min(Math.max(0, state.supportAmount), uniformSubtotal) : 0;
    const outOfPocket = Math.max(uniformSubtotal - supportApplied, 0);
    const extraRiskBudget = Math.round(uniformSubtotal * Math.max(0, state.extraRiskRatio));
    const firstYearBudget = outOfPocket + extraRiskBudget;
    const preset = getPreset();
    const ratioToAverage = preset?.averageBidPrice ? uniformSubtotal / preset.averageBidPrice : 0;
    const averageLabel =
      ratioToAverage < 0.85
        ? "평균보다 낮음"
        : ratioToAverage <= 1.15
          ? "평균권"
          : ratioToAverage <= 1.5
            ? "높은 편"
            : "매우 높은 편";

    return { groupTotals, uniformSubtotal, supportApplied, outOfPocket, extraRiskBudget, firstYearBudget, ratioToAverage, averageLabel };
  }

  function setText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text;
  }

  function readItemsFromInputs() {
    state.items = items.map((meta) => {
      const priceInput = $(`[data-suc-item-price="${meta.id}"]`);
      const quantityInput = $(`[data-suc-item-quantity="${meta.id}"]`);
      return {
        id: meta.id,
        unitPrice: num(priceInput?.value, meta.defaultUnitPrice),
        quantity: clamp(num(quantityInput?.value, meta.defaultQuantity), meta.minQuantity, meta.maxQuantity),
      };
    });
  }

  function applyTypePreset(type) {
    const preset = getPreset(type);
    if (!preset) return;
    state.uniformType = type;
    state.items = items.map((meta) => {
      const overrideQuantity = preset.quantityOverrides?.[meta.id];
      return {
        id: meta.id,
        unitPrice: meta.defaultUnitPrice,
        quantity: overrideQuantity ?? meta.defaultQuantity,
      };
    });
    applyScenario(state.scenario, false);
    syncItemInputs();
  }

  function applyScenario(scenarioId, shouldSync = true) {
    const scenario = scenarios[scenarioId] || scenarios.standard;
    state.scenario = scenarioId;
    state.extraRiskRatio = scenario.extraRiskRatio;

    const extraTop = state.items.find((item) => item.id === "extra-shirt");
    if (extraTop) extraTop.quantity = scenario.extraTopQuantity;

    const ratioInput = $("[data-suc-extra-ratio]");
    if (ratioInput) ratioInput.value = String(Math.round(state.extraRiskRatio * 100));
    if (shouldSync) syncItemInputs();
  }

  function syncItemInputs() {
    state.items.forEach((item) => {
      const priceInput = $(`[data-suc-item-price="${item.id}"]`);
      const quantityInput = $(`[data-suc-item-quantity="${item.id}"]`);
      if (priceInput && document.activeElement !== priceInput) priceInput.value = Math.round(item.unitPrice).toLocaleString("ko-KR");
      if (quantityInput && document.activeElement !== quantityInput) quantityInput.value = String(item.quantity);
    });
  }

  function renderItemTotals() {
    state.items.forEach((item) => {
      const totalEl = $(`[data-suc-item-total="${item.id}"]`);
      if (totalEl) totalEl.textContent = won(item.unitPrice * item.quantity);
    });
  }

  function renderGroupBreakdown(result) {
    const wrap = $("[data-suc-group-breakdown]");
    if (!wrap) return;
    wrap.innerHTML = Object.entries(groupLabels)
      .map(([group, label]) => {
        const value = result.groupTotals[group] || 0;
        const width = result.uniformSubtotal > 0 ? Math.min((value / result.uniformSubtotal) * 100, 100) : 0;
        return `
          <article class="suc-breakdown-row">
            <strong>${label}</strong>
            <span><i style="width:${width}%"></i></span>
            <em>${won(value)}</em>
          </article>
        `;
      })
      .join("");
  }

  function renderAverage(result) {
    const preset = getPreset();
    setText('[data-suc-result="averageLabel"]', result.averageLabel);
    setText(
      '[data-suc-result="averageDescription"]',
      `${preset.label} 평균 ${won(preset.averageBidPrice)} 대비 ${Math.round(result.ratioToAverage * 100)}% 수준입니다. 품목 구성이 다르므로 참고용으로만 보세요.`
    );
  }

  function renderControls() {
    $$("[data-suc-level]").forEach((button) => button.classList.toggle("is-active", button.dataset.sucLevel === state.schoolLevel));
    $$("[data-suc-type]").forEach((button) => button.classList.toggle("is-active", button.dataset.sucType === state.uniformType));
    $$("[data-suc-scenario]").forEach((button) => button.classList.toggle("is-active", button.dataset.sucScenario === state.scenario));

    const supportEnabled = $("[data-suc-support-enabled]");
    const supportAmount = $("[data-suc-support-amount]");
    const extraRatio = $("[data-suc-extra-ratio]");
    if (supportEnabled) supportEnabled.checked = state.supportEnabled;
    if (supportAmount && document.activeElement !== supportAmount) supportAmount.value = Math.round(state.supportAmount).toLocaleString("ko-KR");
    if (extraRatio) extraRatio.value = String(Math.round(state.extraRiskRatio * 100));
    setText("[data-suc-extra-label]", percent(state.extraRiskRatio));
  }

  function render() {
    readItemsFromInputs();
    const result = calculate();
    const preset = getPreset();
    const scenario = scenarios[state.scenario] || scenarios.standard;

    setText('[data-suc-result="uniformSubtotal"]', won(result.uniformSubtotal));
    setText('[data-suc-result="outOfPocket"]', won(result.outOfPocket));
    setText('[data-suc-result="extraRiskBudget"]', won(result.extraRiskBudget));
    setText('[data-suc-result="firstYearBudget"]', won(result.firstYearBudget));
    setText('[data-suc-result="supportApplied"]', `지원금 ${won(result.supportApplied)} 반영`);
    setText("[data-suc-summary]", `${state.schoolLevel === "middle" ? "중학교" : "고등학교"} ${preset.label} ${scenario.label} 기준`);

    renderControls();
    renderItemTotals();
    renderGroupBreakdown(result);
    renderAverage(result);
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("level", state.schoolLevel);
    params.set("type", state.uniformType);
    params.set("scenario", state.scenario);
    params.set("support", state.supportEnabled ? String(Math.round(state.supportAmount)) : "0");
    params.set("extra", String(Math.round(state.extraRiskRatio * 100)));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level");
    const type = params.get("type");
    const scenario = params.get("scenario");
    const support = params.get("support");
    const extra = params.get("extra");

    if (["middle", "high"].includes(level)) state.schoolLevel = level;
    if (presets.some((preset) => preset.id === type)) applyTypePreset(type);
    if (Object.prototype.hasOwnProperty.call(scenarios, scenario)) applyScenario(scenario);
    if (support !== null) {
      const supportValue = num(support, state.supportAmount);
      state.supportEnabled = supportValue > 0;
      state.supportAmount = supportValue;
    }
    if (extra !== null) state.extraRiskRatio = clamp(num(extra, state.extraRiskRatio * 100), 0, 30) / 100;
    syncItemInputs();
  }

  function bindEvents() {
    $$("[data-suc-level]").forEach((button) => {
      button.addEventListener("click", () => {
        state.schoolLevel = button.dataset.sucLevel;
        render();
      });
    });

    $$("[data-suc-type]").forEach((button) => {
      button.addEventListener("click", () => {
        applyTypePreset(button.dataset.sucType);
        render();
      });
    });

    $$("[data-suc-scenario]").forEach((button) => {
      button.addEventListener("click", () => {
        applyScenario(button.dataset.sucScenario);
        render();
      });
    });

    $$("[data-suc-item-price], [data-suc-item-quantity]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("blur", () => {
        if (input.matches("[data-suc-item-price]")) input.value = num(input.value).toLocaleString("ko-KR");
        render();
      });
    });

    $("[data-suc-support-enabled]")?.addEventListener("change", (event) => {
      state.supportEnabled = event.currentTarget.checked;
      render();
    });

    $("[data-suc-support-amount]")?.addEventListener("input", (event) => {
      state.supportAmount = num(event.currentTarget.value, state.supportAmount);
      render();
    });

    $("[data-suc-support-amount]")?.addEventListener("blur", (event) => {
      event.currentTarget.value = num(event.currentTarget.value).toLocaleString("ko-KR");
      render();
    });

    $("[data-suc-extra-ratio]")?.addEventListener("input", (event) => {
      state.extraRiskRatio = clamp(num(event.currentTarget.value), 0, 30) / 100;
      setText("[data-suc-extra-label]", percent(state.extraRiskRatio));
      render();
    });

    document.getElementById("sucResetBtn")?.addEventListener("click", () => {
      state = structuredClone(defaultInput);
      syncItemInputs();
      render();
    });

    document.getElementById("sucCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("sucCopyBtn");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "링크 복사됨";
          setTimeout(() => {
            btn.textContent = original;
          }, 1600);
        }
      } catch {
        if (btn) btn.textContent = "복사 실패";
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
