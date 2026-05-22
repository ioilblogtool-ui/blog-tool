(function () {
  "use strict";

  const root = document.querySelector('[data-calculator="delivery-vs-cooking-cost"]');
  const configEl = document.getElementById("dvcc-config");
  if (!root || !configEl) return;

  let config;
  try {
    config = JSON.parse(configEl.textContent || "{}");
  } catch (error) {
    console.error("[delivery-vs-cooking-cost] config parse error", error);
    return;
  }

  const defaultInput = config.defaultInput || {};
  const presets = config.presets || [];
  const state = { ...defaultInput };
  const $ = (id) => document.getElementById(id);

  const fieldMap = {
    householdSize: "dvcc-household-size",
    weeklyDeliveryOrders: "dvcc-weekly-orders",
    mealsPerOrder: "dvcc-meals-per-order",
    weeksPerMonth: "dvcc-weeks-per-month",
    monthlyBudget: "dvcc-monthly-budget",
    deliveryFoodCost: "dvcc-delivery-food-cost",
    deliveryFee: "dvcc-delivery-fee",
    riderTip: "dvcc-rider-tip",
    serviceFee: "dvcc-service-fee",
    couponDiscount: "dvcc-coupon-discount",
    cookingIngredientCost: "dvcc-cooking-ingredient-cost",
    energyCost: "dvcc-energy-cost",
    consumableCost: "dvcc-consumable-cost",
    ingredientWasteRate: "dvcc-waste-rate",
    groceryDeliveryFeePerMeal: "dvcc-grocery-delivery-fee",
    includeTimeCost: "dvcc-include-time-cost",
    hourlyWage: "dvcc-hourly-wage",
    groceryMinutes: "dvcc-grocery-minutes",
    cookingMinutes: "dvcc-cooking-minutes",
    cleanupMinutes: "dvcc-cleanup-minutes",
    includeDeliveryWaitTime: "dvcc-include-wait-time",
    deliveryWaitMinutes: "dvcc-delivery-wait-minutes",
  };

  function clampNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return min;
    return Math.min(Math.max(parsed, min), max);
  }

  function formatKrw(amount) {
    if (!Number.isFinite(amount)) return "-";
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(Math.round(amount));
    if (abs >= 100000000) {
      const value = abs / 100000000;
      return `${sign}${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}억원`;
    }
    if (abs >= 10000) return `${sign}${Math.round(abs / 10000).toLocaleString()}만원`;
    return `${sign}${abs.toLocaleString()}원`;
  }

  function formatFullKrw(amount) {
    if (!Number.isFinite(amount)) return "-";
    return `${Math.round(amount).toLocaleString()}원`;
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return "-";
    return `${Math.round(value * 100)}%`;
  }

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function syncInputs() {
    Object.entries(fieldMap).forEach(([key, id]) => {
      const el = $(id);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(state[key]);
      } else if (key === "ingredientWasteRate") {
        el.value = Math.round((state[key] || 0) * 100);
      } else {
        el.value = state[key];
      }
    });
    updateConditionalFields();
  }

  function readForm() {
    Object.entries(fieldMap).forEach(([key, id]) => {
      const el = $(id);
      if (!el) return;
      if (el.type === "checkbox") {
        state[key] = el.checked;
      } else if (key === "householdSize") {
        state[key] = clampNumber(el.value, 1, 4);
      } else if (key === "ingredientWasteRate") {
        state[key] = clampNumber(el.value, 0, 40) / 100;
      } else {
        state[key] = clampNumber(el.value, 0);
      }
    });
  }

  function calculateDeliveryCost(input) {
    const cashCost = Math.max(
      input.deliveryFoodCost + input.deliveryFee + input.riderTip + input.serviceFee - input.couponDiscount,
      0
    );
    const waitTimeCost = input.includeDeliveryWaitTime
      ? (input.deliveryWaitMinutes / 60) * input.hourlyWage
      : 0;
    return {
      cashCost,
      waitTimeCost,
      comparableCost: cashCost + waitTimeCost,
      extraCost: input.deliveryFee + input.riderTip + input.serviceFee,
    };
  }

  function calculateCookingCost(input) {
    const wasteCost = input.cookingIngredientCost * input.ingredientWasteRate;
    const cashCost =
      input.cookingIngredientCost +
      input.energyCost +
      input.consumableCost +
      wasteCost +
      input.groceryDeliveryFeePerMeal;
    const timeMinutes = input.groceryMinutes + input.cookingMinutes + input.cleanupMinutes;
    const timeCost = input.includeTimeCost ? (timeMinutes / 60) * input.hourlyWage : 0;
    return {
      cashCost,
      wasteCost,
      timeCost,
      comparableCost: cashCost + timeCost,
    };
  }

  function getDecision(monthlySaving, includeTimeCost) {
    if (monthlySaving >= 100000) {
      return {
        label: "직접요리 유리",
        tone: "positive",
        message: "현재 조건에서는 배달을 직접요리로 바꾸면 월 절약액이 크게 발생합니다.",
      };
    }
    if (monthlySaving > 0) {
      return {
        label: "조건부 유리",
        tone: "neutral",
        message: includeTimeCost
          ? "시간 비용을 포함해도 직접요리가 조금 더 유리합니다."
          : "현금 지출 기준으로는 직접요리가 유리하지만 시간 비용도 함께 확인해 보세요.",
      };
    }
    return {
      label: "배달도 합리적",
      tone: "caution",
      message: "현재 입력값에서는 시간이나 식재료 낭비를 고려하면 배달도 합리적인 선택일 수 있습니다.",
    };
  }

  function getWarnings(input, monthlySaving, breakEvenFoodCost) {
    const warnings = [];
    if (!input.includeTimeCost) warnings.push("현재 결과는 시간 비용을 제외한 현금 지출 중심 계산입니다.");
    if (input.ingredientWasteRate >= 0.2) warnings.push("식재료 폐기율이 높으면 직접요리 절약액이 크게 줄어들 수 있습니다.");
    if (breakEvenFoodCost <= 0) warnings.push("배달 부대비용만으로도 직접요리 비용을 넘는 구간입니다.");
    if (monthlySaving < 0 && input.includeTimeCost) warnings.push("시간 비용이 크게 들어가면 배달이 더 합리적으로 보일 수 있습니다.");
    if (input.deliveryFee + input.riderTip + input.serviceFee >= 6000) warnings.push("배달 부대비용이 높은 편입니다. 포장 주문이나 묶음 주문도 비교해 보세요.");
    return warnings;
  }

  function calculate(input) {
    const monthlyOrderCount = input.weeklyDeliveryOrders * input.weeksPerMonth * input.mealsPerOrder;
    const delivery = calculateDeliveryCost(input);
    const cooking = calculateCookingCost(input);
    const monthlyDeliveryCost = monthlyOrderCount * delivery.comparableCost;
    const monthlyCookingCost = monthlyOrderCount * cooking.comparableCost;
    const monthlySaving = monthlyDeliveryCost - monthlyCookingCost;
    const annualSaving = monthlySaving * 12;
    const breakEvenFoodCost =
      cooking.comparableCost -
      input.deliveryFee -
      input.riderTip -
      input.serviceFee +
      input.couponDiscount -
      delivery.waitTimeCost;
    const decision = getDecision(monthlySaving, input.includeTimeCost);
    return {
      monthlyOrderCount,
      delivery,
      cooking,
      monthlyDeliveryCost,
      monthlyCookingCost,
      monthlySaving,
      annualSaving,
      breakEvenFoodCost,
      deliveryExtraCostRatio: delivery.cashCost > 0 ? delivery.extraCost / delivery.cashCost : 0,
      decisionLabel: decision.label,
      decisionTone: decision.tone,
      decisionMessage: decision.message,
      warnings: getWarnings(input, monthlySaving, breakEvenFoodCost),
    };
  }

  function renderWarnings(warnings) {
    const list = $("dvcc-warning-list");
    if (!list) return;
    list.innerHTML = warnings.map((warning) => `<li>${warning}</li>`).join("");
  }

  function renderBreakdown(result) {
    const body = $("dvcc-breakdown-body");
    if (!body) return;
    const rows = [
      ["음식값·식재료비", state.deliveryFoodCost, state.cookingIngredientCost, state.deliveryFoodCost - state.cookingIngredientCost],
      ["부대비용", result.delivery.extraCost, state.energyCost + state.consumableCost + state.groceryDeliveryFeePerMeal, result.delivery.extraCost - (state.energyCost + state.consumableCost + state.groceryDeliveryFeePerMeal)],
      ["할인·폐기 비용", -state.couponDiscount, result.cooking.wasteCost, -state.couponDiscount - result.cooking.wasteCost],
      ["시간 비용", result.delivery.waitTimeCost, result.cooking.timeCost, result.delivery.waitTimeCost - result.cooking.timeCost],
      ["1회 비교 비용", result.delivery.comparableCost, result.cooking.comparableCost, result.delivery.comparableCost - result.cooking.comparableCost],
      ["월 총비용", result.monthlyDeliveryCost, result.monthlyCookingCost, result.monthlySaving],
    ];
    body.innerHTML = rows
      .map(
        ([label, delivery, cooking, diff]) => `
          <tr>
            <th>${label}</th>
            <td>${formatFullKrw(delivery)}</td>
            <td>${formatFullKrw(cooking)}</td>
            <td class="${diff >= 0 ? "is-saving" : "is-extra"}">${formatFullKrw(diff)}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderChart(result) {
    const chart = $("dvcc-cost-chart");
    if (!chart) return;
    const max = Math.max(result.delivery.comparableCost, result.cooking.comparableCost, 1);
    const deliveryWidth = Math.max(2, (result.delivery.comparableCost / max) * 100);
    const cookingWidth = Math.max(2, (result.cooking.comparableCost / max) * 100);
    const deliveryCashWidth = Math.max(0, (result.delivery.cashCost / result.delivery.comparableCost) * 100 || 0);
    const cookingCashWidth = Math.max(0, (result.cooking.cashCost / result.cooking.comparableCost) * 100 || 0);
    chart.innerHTML = `
      <div class="dvcc-chart-row">
        <div class="dvcc-chart-row__head"><strong>배달</strong><span>${formatFullKrw(result.delivery.comparableCost)}</span></div>
        <div class="dvcc-chart-track" style="width:${deliveryWidth}%">
          <span class="dvcc-chart-segment dvcc-chart-segment--cash" style="width:${deliveryCashWidth}%"></span>
          <span class="dvcc-chart-segment dvcc-chart-segment--time" style="width:${100 - deliveryCashWidth}%"></span>
        </div>
      </div>
      <div class="dvcc-chart-row">
        <div class="dvcc-chart-row__head"><strong>직접요리</strong><span>${formatFullKrw(result.cooking.comparableCost)}</span></div>
        <div class="dvcc-chart-track" style="width:${cookingWidth}%">
          <span class="dvcc-chart-segment dvcc-chart-segment--cooking" style="width:${cookingCashWidth}%"></span>
          <span class="dvcc-chart-segment dvcc-chart-segment--time" style="width:${100 - cookingCashWidth}%"></span>
        </div>
      </div>
      <div class="dvcc-chart-legend"><span>현금 비용</span><span>시간 비용</span></div>
    `;
  }

  function render(result) {
    const monthlySavingLabel = result.monthlySaving >= 0 ? formatKrw(result.monthlySaving) : `${formatKrw(Math.abs(result.monthlySaving))} 추가`;
    const annualSavingLabel = result.annualSaving >= 0 ? formatKrw(result.annualSaving) : `${formatKrw(Math.abs(result.annualSaving))} 추가`;
    setText("dvcc-r-annual-saving", annualSavingLabel);
    setText("dvcc-r-monthly-saving", monthlySavingLabel);
    setText("dvcc-r-delivery-monthly", formatKrw(result.monthlyDeliveryCost));
    setText("dvcc-r-cooking-monthly", formatKrw(result.monthlyCookingCost));
    setText("dvcc-r-break-even", result.breakEvenFoodCost > 0 ? formatFullKrw(result.breakEvenFoodCost) : "0원 이하");
    setText("dvcc-r-order-count", `월 ${result.monthlyOrderCount.toFixed(1)}식 기준`);
    setText("dvcc-r-comment", `${result.decisionMessage} 배달 부대비용 비중은 ${formatPercent(result.deliveryExtraCostRatio)}입니다.`);

    const decision = $("dvcc-r-decision");
    if (decision) {
      decision.textContent = result.decisionLabel;
      decision.dataset.tone = result.decisionTone;
    }

    const budgetContext = $("dvcc-r-annual-context");
    if (budgetContext) {
      const budgetGap = state.monthlyBudget ? result.monthlyDeliveryCost - state.monthlyBudget : 0;
      budgetContext.textContent = state.monthlyBudget
        ? budgetGap > 0
          ? `예산보다 월 ${formatKrw(budgetGap)} 초과`
          : `예산 대비 월 ${formatKrw(Math.abs(budgetGap))} 여유`
        : "시뮬레이션";
    }

    setText(
      "dvcc-break-even-copy",
      result.breakEvenFoodCost > 0
        ? `1회 음식값이 ${formatFullKrw(result.breakEvenFoodCost)}보다 높으면 직접요리가 비용상 유리해지는 구간입니다.`
        : "현재 조건에서는 배달비와 수수료만으로도 직접요리 비용을 넘기 쉬운 구조입니다."
    );

    setText("dvcc-waste-rate-label", `${Math.round(state.ingredientWasteRate * 100)}%`);
    renderWarnings(result.warnings);
    renderBreakdown(result);
    renderChart(result);
  }

  function updateConditionalFields() {
    const timeFields = $("dvcc-time-fields");
    const waitField = document.querySelector(".dvcc-wait-field");
    if (timeFields) timeFields.hidden = !state.includeTimeCost;
    if (waitField) waitField.hidden = !state.includeDeliveryWaitTime;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("hh", state.householdSize);
    params.set("wo", state.weeklyDeliveryOrders);
    params.set("food", state.deliveryFoodCost);
    params.set("fee", state.deliveryFee);
    params.set("tip", state.riderTip);
    params.set("coupon", state.couponDiscount);
    params.set("ing", state.cookingIngredientCost);
    params.set("waste", state.ingredientWasteRate);
    params.set("time", state.includeTimeCost ? "1" : "0");
    params.set("wage", state.hourlyWage);
    params.set("cookMin", state.cookingMinutes);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const urlMap = {
      hh: "householdSize",
      wo: "weeklyDeliveryOrders",
      food: "deliveryFoodCost",
      fee: "deliveryFee",
      tip: "riderTip",
      coupon: "couponDiscount",
      ing: "cookingIngredientCost",
      waste: "ingredientWasteRate",
      wage: "hourlyWage",
      cookMin: "cookingMinutes",
    };
    Object.entries(urlMap).forEach(([param, key]) => {
      if (!params.has(param)) return;
      state[key] = key === "ingredientWasteRate" ? clampNumber(params.get(param), 0, 0.4) : clampNumber(params.get(param), 0);
    });
    if (params.has("time")) state.includeTimeCost = params.get("time") === "1";
  }

  async function copyShareLink() {
    updateUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      const button = $("dvcc-copy-link");
      if (button) {
        const original = button.textContent;
        button.textContent = "복사 완료";
        window.setTimeout(() => (button.textContent = original), 1600);
      }
    } catch (error) {
      console.warn("[delivery-vs-cooking-cost] copy failed", error);
    }
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    Object.assign(state, defaultInput, preset.input || {});
    syncInputs();
    render(calculate(state));
    updateUrl();
    document.querySelectorAll(".dvcc-preset").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.preset === id);
      button.setAttribute("aria-pressed", button.dataset.preset === id ? "true" : "false");
    });
  }

  function bindEvents() {
    Object.values(fieldMap).forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("input", () => {
        readForm();
        updateConditionalFields();
        render(calculate(state));
        updateUrl();
      });
      el.addEventListener("change", () => {
        readForm();
        updateConditionalFields();
        render(calculate(state));
        updateUrl();
      });
    });
    document.querySelectorAll(".dvcc-preset").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });
    $("dvcc-reset")?.addEventListener("click", () => {
      Object.assign(state, defaultInput);
      syncInputs();
      render(calculate(state));
      updateUrl();
    });
    $("dvcc-copy-link")?.addEventListener("click", copyShareLink);
  }

  restoreFromUrl();
  syncInputs();
  bindEvents();
  render(calculate(state));
})();
