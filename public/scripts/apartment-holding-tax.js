(() => {
  const root = document.querySelector("[data-aht-root]");
  const configNode = document.getElementById("ahtConfig");
  if (!root || !configNode) return;

  const config = JSON.parse(configNode.textContent || "{}");
  const state = { ...(config.defaultInput || {}) };
  const won = new Intl.NumberFormat("ko-KR");

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const input = (name) => root.querySelector(`[data-aht="${name}"]`);
  const output = (name) => document.querySelector(`[data-aht-output="${name}"]`);

  function parseNumber(value) {
    return Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0;
  }

  function formatWon(value) {
    return `${won.format(Math.round(Number(value || 0)))}원`;
  }

  function formatEok(value) {
    const amount = Math.round(Number(value || 0));
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount);
    const eok = Math.floor(abs / 100000000);
    const man = Math.floor((abs % 100000000) / 10000);
    if (eok > 0 && man > 0) return `${sign}${eok}억 ${won.format(man)}만원`;
    if (eok > 0) return `${sign}${eok}억원`;
    return `${sign}${won.format(man)}만원`;
  }

  function formatPercent(value, digits = 1) {
    return `${Number(value || 0).toFixed(digits)}%`;
  }

  function setText(name, value) {
    const el = output(name);
    if (el) el.textContent = value;
  }

  function getYearConfig(year) {
    return (config.yearConfigs || []).find((item) => item.year === Number(year)) || config.yearConfigs?.[0];
  }

  function getBracket(base, brackets) {
    return brackets.find((bracket) => (
      base >= bracket.min && (bracket.max === null || base <= bracket.max)
    )) || brackets[0];
  }

  function calculateProgressiveTax(base, brackets) {
    if (!base || base <= 0) return 0;
    const bracket = getBracket(base, brackets);
    return Math.max(base * bracket.rate / 100 - bracket.deduction, 0);
  }

  function getCreditRate(value, rates) {
    const rate = rates.find((item) => value >= item.minValue && (item.maxValue === null || value < item.maxValue));
    return rate || { rate: 0, label: "해당 없음" };
  }

  function getSharePrice(currentState) {
    return Math.max(currentState.officialPrice * currentState.ownershipShareRate / 100, 0);
  }

  function isOneHome(currentState) {
    return currentState.homeCountType === "one" && currentState.isOneHouseholdOneHome;
  }

  function getPropertyTaxRatio(currentState, yearConfig) {
    if (currentState.propertyTaxFairMarketRatio && currentState.propertyTaxFairMarketRatio > 0) {
      return { ratio: currentState.propertyTaxFairMarketRatio, label: "직접 입력" };
    }

    if (isOneHome(currentState)) {
      const special = yearConfig.propertyTaxOneHomeSpecialRatios.find((item) => currentState.officialPrice <= item.maxOfficialPrice);
      if (special) return { ratio: special.ratio, label: special.label };
    }

    return { ratio: yearConfig.propertyTaxFairMarketRatio, label: "일반 주택 기본 비율" };
  }

  function getComprehensiveDeduction(currentState, yearConfig) {
    if (currentState.comprehensiveTaxDeductionOverride && currentState.comprehensiveTaxDeductionOverride > 0) {
      return currentState.comprehensiveTaxDeductionOverride;
    }
    return isOneHome(currentState)
      ? yearConfig.comprehensiveTaxDeductionOneHome
      : yearConfig.comprehensiveTaxDeductionGeneral;
  }

  function getComprehensiveRatio(currentState, yearConfig) {
    return currentState.comprehensiveTaxFairMarketRatio && currentState.comprehensiveTaxFairMarketRatio > 0
      ? currentState.comprehensiveTaxFairMarketRatio
      : yearConfig.comprehensiveTaxFairMarketRatio;
  }

  function getHomeCountLabel(value) {
    return { one: "1주택", two: "2주택", threePlus: "3주택 이상" }[value] || "1주택";
  }

  function calculateHoldingTax(currentState) {
    const yearConfig = getYearConfig(currentState.taxYear);
    const shareOfficialPrice = getSharePrice(currentState);
    const propertyRatioInfo = getPropertyTaxRatio(currentState, yearConfig);
    const propertyTaxBase = shareOfficialPrice * propertyRatioInfo.ratio / 100;
    const propertyBrackets = isOneHome(currentState) && currentState.officialPrice <= 900000000
      ? yearConfig.propertyTaxSpecialBrackets
      : yearConfig.propertyTaxBrackets;
    const propertyTax = calculateProgressiveTax(propertyTaxBase, propertyBrackets);
    const localEducationTax = propertyTax * yearConfig.localEducationTaxRate / 100;

    const deduction = getComprehensiveDeduction(currentState, yearConfig);
    const comprehensiveRatio = getComprehensiveRatio(currentState, yearConfig);
    const comprehensiveBase = Math.max(shareOfficialPrice - deduction, 0) * comprehensiveRatio / 100;
    const comprehensiveBrackets = currentState.homeCountType === "threePlus"
      ? yearConfig.comprehensiveTaxBracketsMultiHome
      : yearConfig.comprehensiveTaxBracketsGeneral;
    const comprehensiveBeforeCredit = calculateProgressiveTax(comprehensiveBase, comprehensiveBrackets);

    const seniorCredit = isOneHome(currentState) ? getCreditRate(currentState.age, yearConfig.seniorCreditRates) : { rate: 0, label: "해당 없음" };
    const holdingCredit = isOneHome(currentState) ? getCreditRate(currentState.holdingYears, yearConfig.longHoldingCreditRates) : { rate: 0, label: "해당 없음" };
    const totalCreditRate = Math.min(seniorCredit.rate + holdingCredit.rate, yearConfig.oneHomeCreditLimitRate);
    const creditAmount = comprehensiveBeforeCredit * totalCreditRate / 100;
    const comprehensiveAfterCredit = Math.max(comprehensiveBeforeCredit - creditAmount, 0);
    const ruralSpecialTax = comprehensiveAfterCredit * yearConfig.ruralSpecialTaxRate / 100;
    const totalBeforeCap = propertyTax + localEducationTax + comprehensiveAfterCredit + ruralSpecialTax;

    let capApplied = false;
    let totalHoldingTax = totalBeforeCap;
    if (currentState.applyTaxBurdenCap && currentState.previousYearHoldingTax && currentState.previousYearHoldingTax > 0) {
      const capRate = currentState.officialPrice <= 300000000 ? 105 : currentState.officialPrice <= 600000000 ? 110 : 130;
      const capAmount = currentState.previousYearHoldingTax * capRate / 100;
      if (totalHoldingTax > capAmount) {
        totalHoldingTax = capAmount;
        capApplied = true;
      }
    }

    const noCreditTotal = propertyTax + localEducationTax + comprehensiveBeforeCredit + comprehensiveBeforeCredit * yearConfig.ruralSpecialTaxRate / 100;

    return {
      yearConfig,
      shareOfficialPrice,
      propertyRatioInfo,
      propertyTaxBase,
      propertyTax,
      localEducationTax,
      deduction,
      comprehensiveRatio,
      comprehensiveBase,
      comprehensiveBeforeCredit,
      seniorCredit,
      holdingCredit,
      totalCreditRate,
      creditAmount,
      comprehensiveAfterCredit,
      ruralSpecialTax,
      totalBeforeCap,
      totalHoldingTax,
      capApplied,
      noCreditTotal,
      creditSavingAmount: Math.max(noCreditTotal - totalHoldingTax, 0),
      isComprehensiveTaxTarget: comprehensiveBase > 0,
      comprehensiveEntryPrice: deduction / Math.max(currentState.ownershipShareRate / 100, 0.01),
      effectiveTaxRate: shareOfficialPrice > 0 ? totalHoldingTax / shareOfficialPrice * 100 : 0,
      warnings: buildWarnings(currentState, yearConfig, comprehensiveBase, capApplied),
    };
  }

  function buildWarnings(currentState, yearConfig, comprehensiveBase, capApplied) {
    const warnings = ["모든 결과는 공시가격 기준 간이 추정입니다. 실제 고지세액은 지자체와 국세청 산정 결과가 우선합니다."];
    if (currentState.officialPrice <= 0) warnings.push("공시가격을 0원보다 크게 입력해야 계산이 의미 있습니다.");
    if (currentState.ownershipShareRate <= 0) warnings.push("지분율이 0% 이하이면 보유세 계산이 불가능합니다.");
    if (currentState.ownershipType !== "single") warnings.push("공동명의는 납세자별 합산과 1세대 1주택 판단에 따라 실제 결과가 달라질 수 있습니다.");
    if (currentState.homeCountType !== "one" && currentState.isOneHouseholdOneHome) warnings.push("주택 수가 2주택 이상이면 1세대 1주택 공제를 적용하지 않는 것이 일반적입니다.");
    if (currentState.regionType === "regulated") warnings.push("조정대상지역 여부는 향후 정책과 다주택 중과 판단에 영향을 줄 수 있어 최신 고시 확인이 필요합니다.");
    if (!comprehensiveBase) warnings.push("현재 입력값에서는 종부세 과세표준이 0원으로 추정됩니다.");
    if (capApplied) warnings.push("세부담상한을 단순 적용해 총액을 낮췄습니다. 실제 상한 계산은 세목별로 달라질 수 있습니다.");
    yearConfig.notes.forEach((note) => warnings.push(note));
    return warnings;
  }

  function buildScenarios(currentState) {
    const changes = [-10, 0, 5, 10, 20, 30];
    const base = calculateHoldingTax(currentState).totalHoldingTax;
    return changes.map((change) => {
      const nextState = {
        ...currentState,
        officialPrice: Math.max(currentState.officialPrice * (1 + change / 100), 0),
      };
      const result = calculateHoldingTax(nextState);
      return {
        change,
        officialPrice: nextState.officialPrice,
        totalHoldingTax: result.totalHoldingTax,
        comprehensiveTax: result.comprehensiveAfterCredit,
        diff: result.totalHoldingTax - base,
      };
    });
  }

  function findOfficialPriceForTargetTax(currentState, targetTax) {
    if (!targetTax || targetTax <= 0) return null;
    let low = 0;
    let high = 10_000_000_000;
    for (let i = 0; i < 60; i += 1) {
      const mid = (low + high) / 2;
      const result = calculateHoldingTax({ ...currentState, officialPrice: mid });
      if (result.totalHoldingTax < targetTax) low = mid;
      else high = mid;
    }
    return Math.ceil(high / 100000) * 100000;
  }

  function readInputs() {
    $$("[data-aht]").forEach((el) => {
      const key = el.dataset.aht;
      if (!key) return;
      if (el.type === "checkbox") {
        state[key] = el.checked;
      } else if (el.dataset.type === "number" || el.dataset.format === "money") {
        const parsed = parseNumber(el.value);
        state[key] = el.value.trim() === "" && ["propertyTaxFairMarketRatio", "comprehensiveTaxFairMarketRatio", "comprehensiveTaxDeductionOverride", "previousYearHoldingTax", "targetHoldingTax"].includes(key)
          ? null
          : parsed;
      } else {
        state[key] = el.value;
      }
    });

    if (state.homeCountType !== "one") state.isOneHouseholdOneHome = false;
  }

  function setInputValue(name, value) {
    const el = input(name);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
    } else if (value === null || value === undefined) {
      el.value = "";
    } else if (el.dataset.format === "money") {
      el.value = won.format(Math.round(Number(value || 0)));
    } else {
      el.value = String(value);
    }
  }

  function syncInputs() {
    Object.entries(state).forEach(([key, value]) => setInputValue(key, value));
    const oneHomeToggle = input("isOneHouseholdOneHome");
    if (oneHomeToggle) oneHomeToggle.disabled = state.homeCountType !== "one";
  }

  function renderBreakdown(result) {
    const body = output("breakdownRows");
    if (!body) return;
    const rows = [
      ["재산세", result.propertyTax, `과세표준 ${formatEok(result.propertyTaxBase)} · ${result.propertyRatioInfo.label}`],
      ["지방교육세", result.localEducationTax, `재산세 × ${formatPercent(result.yearConfig.localEducationTaxRate, 0)}`],
      ["종합부동산세", result.comprehensiveAfterCredit, `과세표준 ${formatEok(result.comprehensiveBase)} · 공제 후`],
      ["농어촌특별세", result.ruralSpecialTax, `종부세 × ${formatPercent(result.yearConfig.ruralSpecialTaxRate, 0)}`],
      ["연간 보유세 합계", result.totalHoldingTax, result.capApplied ? "세부담상한 단순 적용" : "세목 합산"],
    ];
    body.innerHTML = rows.map((row, index) => `
      <tr class="${index === rows.length - 1 ? "aht-total-row" : ""}">
        <td>${row[0]}</td>
        <td>${formatWon(row[1])}</td>
        <td>${row[2]}</td>
      </tr>
    `).join("");
  }

  function renderCredit(result) {
    setText("seniorCreditRate", formatPercent(result.seniorCredit.rate, 0));
    setText("holdingCreditRate", formatPercent(result.holdingCredit.rate, 0));
    setText("totalCreditRate", formatPercent(result.totalCreditRate, 0));
    setText("creditSavingAmount", formatWon(result.creditSavingAmount));
    setText("beforeCreditTax", formatWon(result.noCreditTotal));
    setText("afterCreditTax", formatWon(result.totalHoldingTax));
  }

  function renderScenarios(currentState) {
    const body = output("scenarioRows");
    if (!body) return;
    body.innerHTML = buildScenarios(currentState).map((item) => `
      <tr>
        <td>${item.change > 0 ? `+${item.change}%` : `${item.change}%`}</td>
        <td>${formatEok(item.officialPrice)}</td>
        <td>${formatWon(item.totalHoldingTax)}</td>
        <td>${formatWon(item.comprehensiveTax)}</td>
        <td>${item.diff >= 0 ? "+" : ""}${formatWon(item.diff)}</td>
      </tr>
    `).join("");
  }

  function renderWarnings(result) {
    const list = output("warnings");
    if (!list) return;
    list.innerHTML = result.warnings.map((warning) => `<li>${warning}</li>`).join("");
  }

  function render() {
    readInputs();
    syncInputs();

    const result = calculateHoldingTax(state);
    const propertyAreaTax = result.propertyTax + result.localEducationTax;
    const comprehensiveAreaTax = result.comprehensiveAfterCredit + result.ruralSpecialTax;
    const targetPrice = findOfficialPriceForTargetTax(state, state.targetHoldingTax);

    setText("totalHoldingTax", `${formatWon(result.totalHoldingTax)} 추정`);
    setText("propertyAreaTax", formatWon(propertyAreaTax));
    setText("comprehensiveAreaTax", formatWon(comprehensiveAreaTax));
    setText("creditSaving", formatWon(result.creditSavingAmount));
    setText("entryPrice", formatEok(result.comprehensiveEntryPrice));
    setText("targetPrice", targetPrice ? formatEok(targetPrice) : "-");
    setText("effectiveRate", formatPercent(result.effectiveTaxRate, 3));
    setText("summaryText", `${getHomeCountLabel(state.homeCountType)} · 공시가격 ${formatEok(state.officialPrice)} 기준 연간 보유세는 약 ${formatWon(result.totalHoldingTax)}로 추정됩니다.`);
    setText("comprehensiveStatus", result.isComprehensiveTaxTarget ? "종부세 과세표준 발생" : "종부세 비과세 추정");
    setText("deductionAmount", formatEok(result.deduction));
    setText("shareOfficialPrice", formatEok(result.shareOfficialPrice));

    renderBreakdown(result);
    renderCredit(result);
    renderScenarios(state);
    renderWarnings(result);
  }

  function applyPreset(id) {
    const preset = (config.presets || []).find((item) => item.id === id);
    if (!preset) return;
    Object.assign(state, preset.input);
    $$(".aht-preset-btn").forEach((button) => button.classList.toggle("is-active", button.dataset.preset === id));
    syncInputs();
    render();
  }

  function init() {
    syncInputs();
    $$(".aht-preset-btn").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });

    $$("[data-aht]").forEach((el) => {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    const resetButton = document.getElementById("resetAhtBtn");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, config.defaultInput || {});
        $$(".aht-preset-btn").forEach((button, index) => button.classList.toggle("is-active", index === 0));
        syncInputs();
        render();
      });
    }

    const copyButton = document.getElementById("copyAhtLinkBtn");
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const url = new URL(window.location.href);
        url.searchParams.set("price", String(state.officialPrice));
        url.searchParams.set("homes", String(state.homeCountType));
        await navigator.clipboard?.writeText(url.toString());
        copyButton.textContent = "링크 복사됨";
        setTimeout(() => { copyButton.textContent = "링크 복사"; }, 1600);
      });
    }

    const params = new URLSearchParams(window.location.search);
    const price = parseNumber(params.get("price"));
    if (price > 0) state.officialPrice = price;
    if (params.get("homes")) state.homeCountType = params.get("homes");
    syncInputs();
    render();
  }

  init();
})();
