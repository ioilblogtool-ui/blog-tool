import { buildDefaultOptions } from "./chart-config.js";
import { readBool, readParam, writeParams } from "./url-state.js";

const configEl = document.getElementById("aiSubscriptionCostData");
const seed = JSON.parse(configEl?.textContent || "{}");

const tools = seed.tools || [];
const presets = seed.presets || [];
const duplicateRules = seed.duplicateRules || [];
const defaults = seed.defaults || {};

const inputs = {
  mode: Array.from(document.querySelectorAll('input[name="aisMode"]')),
  headcount: document.getElementById("aisHeadcount"),
  exchangeRate: document.getElementById("aisExchangeRate"),
  monthlyWorkHours: document.getElementById("aisMonthlyWorkHours"),
  hourlyValue: document.getElementById("aisHourlyValue"),
  monthlySavedHours: document.getElementById("aisMonthlySavedHours"),
  cardFeeRate: document.getElementById("aisCardFeeRate"),
  vat: document.getElementById("aisVatCheck"),
  cardFee: document.getElementById("aisCardFeeCheck"),
};

const els = {
  validation: document.getElementById("aisValidation"),
  resultSubcopy: document.getElementById("aisResultSubcopy"),
  monthlyCost: document.getElementById("aisMonthlyCost"),
  monthlyUsd: document.getElementById("aisMonthlyUsd"),
  yearlyCost: document.getElementById("aisYearlyCost"),
  perUserCost: document.getElementById("aisPerUserCost"),
  headcountNote: document.getElementById("aisHeadcountNote"),
  savedValueKpi: document.getElementById("aisSavedValueKpi"),
  netBenefit: document.getElementById("aisNetBenefit"),
  netBenefitNote: document.getElementById("aisNetBenefitNote"),
  roiCard: document.getElementById("aisRoiCard"),
  roiScore: document.getElementById("aisRoiScore"),
  roiMessage: document.getElementById("aisRoiMessage"),
  savedValue: document.getElementById("aisSavedValue"),
  breakEvenHours: document.getElementById("aisBreakEvenHours"),
  warnings: document.getElementById("aisDuplicateWarnings"),
  chartFallback: document.getElementById("aisChartFallback"),
};

const toolChecks = Array.from(document.querySelectorAll("[data-ais-tool]"));
const priceInputs = Array.from(document.querySelectorAll("[data-ais-price]"));
const presetButtons = Array.from(document.querySelectorAll("[data-ais-preset]"));
const resetBtn = document.getElementById("aisResetBtn");
const copyBtn = document.getElementById("aisCopyLinkBtn");

let costChart = null;

const state = {
  mode: defaults.mode || "personal",
  headcount: defaults.headcount || 1,
  exchangeRate: defaults.exchangeRate || 1400,
  includeVat: Boolean(defaults.includeVat),
  includeCardFee: Boolean(defaults.includeCardFee),
  cardFeeRate: defaults.cardFeeRate || 0.015,
  monthlyWorkHours: defaults.monthlyWorkHours || 160,
  hourlyValueKrw: defaults.hourlyValueKrw || 30000,
  monthlySavedHours: defaults.monthlySavedHours || 10,
  selectedToolIds: [...(defaults.selectedToolIds || [])],
  toolPrices: { ...(defaults.toolPrices || {}) },
  activePresetId: "",
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function formatKrw(value) {
  const rounded = Math.round(Number(value) || 0);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}약 ${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}약 ${eok}억원`;
  if (man > 0) return `${sign}약 ${man.toLocaleString("ko-KR")}만원`;
  return `${sign}약 ${abs.toLocaleString("ko-KR")}원`;
}

function formatUsd(value) {
  return `$${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function setHtml(el, html) {
  if (el) el.innerHTML = html;
}

function getTool(toolId) {
  return tools.find((tool) => tool.id === toolId);
}

function readStateFromInputs() {
  state.mode = inputs.mode.find((input) => input.checked)?.value || "personal";
  state.headcount = Math.round(clamp(inputs.headcount?.value, 1, 100));
  state.exchangeRate = Math.round(clamp(inputs.exchangeRate?.value, 500, 3000));
  state.monthlyWorkHours = clamp(inputs.monthlyWorkHours?.value, 1, 400);
  state.hourlyValueKrw = Math.round(clamp(inputs.hourlyValue?.value, 0, 1000000));
  state.monthlySavedHours = clamp(inputs.monthlySavedHours?.value, 0, 400);
  state.includeVat = Boolean(inputs.vat?.checked);
  state.includeCardFee = Boolean(inputs.cardFee?.checked);
  state.cardFeeRate = clamp(inputs.cardFeeRate?.value, 0, 10) / 100;

  state.selectedToolIds = toolChecks.filter((input) => input.checked).map((input) => input.dataset.aisTool);
  priceInputs.forEach((input) => {
    const tool = getTool(input.dataset.aisPrice);
    const max = tool?.currency === "KRW" ? 1000000 : 1000;
    state.toolPrices[input.dataset.aisPrice] = clamp(input.value, 0, max);
  });
}

function syncInputs() {
  inputs.mode.forEach((input) => {
    input.checked = input.value === state.mode;
    input.closest(".ais-mode-card")?.classList.toggle("is-active", input.checked);
  });
  if (inputs.headcount) inputs.headcount.value = String(state.headcount);
  if (inputs.exchangeRate) inputs.exchangeRate.value = String(state.exchangeRate);
  if (inputs.monthlyWorkHours) inputs.monthlyWorkHours.value = String(state.monthlyWorkHours);
  if (inputs.hourlyValue) inputs.hourlyValue.value = String(state.hourlyValueKrw);
  if (inputs.monthlySavedHours) inputs.monthlySavedHours.value = String(state.monthlySavedHours);
  if (inputs.cardFeeRate) inputs.cardFeeRate.value = String(Math.round(state.cardFeeRate * 1000) / 10);
  if (inputs.vat) inputs.vat.checked = state.includeVat;
  if (inputs.cardFee) inputs.cardFee.checked = state.includeCardFee;

  toolChecks.forEach((input) => {
    input.checked = state.selectedToolIds.includes(input.dataset.aisTool);
    input.closest(".ais-tool-row")?.classList.toggle("is-checked", input.checked);
  });
  priceInputs.forEach((input) => {
    const value = state.toolPrices[input.dataset.aisPrice];
    if (value !== undefined) input.value = String(value);
  });
  presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.aisPreset === state.activePresetId);
  });
}

function restoreStateFromUrl() {
  const mode = readParam("mode", state.mode);
  if (["personal", "team"].includes(mode)) state.mode = mode;
  state.headcount = Math.round(clamp(readParam("n", state.headcount), 1, 100));
  state.exchangeRate = Math.round(clamp(readParam("fx", state.exchangeRate), 500, 3000));
  state.includeVat = readBool("vat", state.includeVat);
  state.includeCardFee = readBool("fee", state.includeCardFee);
  state.monthlySavedHours = clamp(readParam("hours", state.monthlySavedHours), 0, 400);
  state.hourlyValueKrw = Math.round(clamp(readParam("value", state.hourlyValueKrw), 0, 1000000));

  const toolParam = readParam("tools", "");
  if (toolParam) {
    state.selectedToolIds = toolParam
      .split(",")
      .map((item) => item.trim())
      .filter((toolId) => tools.some((tool) => tool.id === toolId));
  }
}

function syncUrlState() {
  writeParams({
    mode: state.mode,
    n: state.headcount,
    fx: state.exchangeRate,
    vat: state.includeVat ? 1 : 0,
    fee: state.includeCardFee ? 1 : 0,
    hours: state.monthlySavedHours,
    value: state.hourlyValueKrw,
    tools: state.selectedToolIds.join(","),
  });
}

function detectDuplicates(selectedTools) {
  return duplicateRules.filter((rule) => {
    if (Array.isArray(rule.toolIds) && rule.toolIds.length) {
      const hitCount = rule.toolIds.filter((id) => selectedTools.some((tool) => tool.id === id)).length;
      return hitCount >= rule.threshold;
    }
    const hitCount = selectedTools.filter((tool) => rule.categoryIds.includes(tool.category)).length;
    return hitCount >= rule.threshold;
  });
}

function roiTone(score) {
  if (score >= 300) {
    return ["high", "매우 효율적", "구독료 대비 추정 시간 절감 효과가 큰 편입니다."];
  }
  if (score >= 150) {
    return ["good", "효율적", "핵심 도구 중심으로 유지할 만한 추정 수준입니다."];
  }
  if (score >= 100) {
    return ["mid", "본전 수준", "사용 빈도와 중복 구독을 함께 점검해보세요."];
  }
  return ["low", "본전 미달", "입력한 절감 시간 기준으로는 비용 대비 효과가 낮을 수 있습니다."];
}

function calculate() {
  readStateFromInputs();

  const validationMessages = [];
  if (state.monthlySavedHours > state.monthlyWorkHours) validationMessages.push("월 절감 시간은 월 업무 시간보다 클 수 없습니다.");
  if (state.exchangeRate < 500 || state.exchangeRate > 3000) validationMessages.push("환율은 500원 이상 3,000원 이하로 입력하세요.");
  if (!state.selectedToolIds.length) validationMessages.push("도구를 하나 이상 선택하면 구독비를 계산할 수 있습니다.");

  if (els.validation) {
    els.validation.hidden = validationMessages.length === 0;
    els.validation.innerHTML = validationMessages.map((message) => `<p>${message}</p>`).join("");
  }

  const selectedTools = tools.filter((tool) => state.selectedToolIds.includes(tool.id));
  const vatMul = state.includeVat ? 1.1 : 1;
  const feeMul = state.includeCardFee ? 1 + state.cardFeeRate : 1;

  const toolCosts = selectedTools.map((tool) => {
    const inputPrice = Number(state.toolPrices[tool.id] ?? tool.defaultMonthlyUsd ?? 0);
    const baseKrw = tool.currency === "KRW" ? inputPrice : inputPrice * state.exchangeRate;
    const quantity = state.mode === "team" && tool.pricingUnit === "seat" ? state.headcount : 1;
    const monthlyKrw = Math.round(baseKrw * quantity * vatMul * feeMul);
    return {
      id: tool.id,
      name: tool.name,
      category: tool.category,
      monthlyKrw,
      monthlyUsd: tool.currency === "USD" ? inputPrice * quantity : 0,
    };
  });

  const monthlyCostKrw = toolCosts.reduce((sum, item) => sum + item.monthlyKrw, 0);
  const yearlyCostKrw = monthlyCostKrw * 12;
  const perUserCostKrw = Math.round(monthlyCostKrw / Math.max(1, state.headcount));
  const savedHoursForCalc = Math.min(state.monthlySavedHours, state.monthlyWorkHours);
  const savedValueKrw = Math.round(savedHoursForCalc * state.hourlyValueKrw);
  const netBenefitKrw = savedValueKrw - monthlyCostKrw;
  const roiScore = monthlyCostKrw > 0 ? Math.round((savedValueKrw / monthlyCostKrw) * 100) : 0;
  const breakEvenHours = state.hourlyValueKrw > 0 ? monthlyCostKrw / state.hourlyValueKrw : 0;
  const duplicateWarnings = detectDuplicates(selectedTools);

  renderResults({
    toolCosts,
    monthlyCostKrw,
    yearlyCostKrw,
    perUserCostKrw,
    savedValueKrw,
    netBenefitKrw,
    roiScore,
    breakEvenHours,
    duplicateWarnings,
  });
  updateCostChart(toolCosts);
  syncUrlState();
}

function renderResults(result) {
  const selectedCount = result.toolCosts.length;
  const usdTotal = result.toolCosts.reduce((sum, item) => sum + item.monthlyUsd, 0);
  const feeNote = [state.includeVat ? "VAT 포함" : "", state.includeCardFee ? "카드 수수료 포함" : ""].filter(Boolean).join(" · ");
  const [tone, label, message] = roiTone(result.roiScore);

  setText(els.resultSubcopy, `${selectedCount}개 도구 · ${state.mode === "team" ? `${state.headcount}명 팀` : "개인"} 기준 추정${feeNote ? ` · ${feeNote}` : ""}`);
  setText(els.monthlyCost, selectedCount ? formatKrw(result.monthlyCostKrw) : "선택된 도구 없음");
  setText(els.monthlyUsd, `${formatUsd(usdTotal)} 기준 · 환율 ${state.exchangeRate.toLocaleString("ko-KR")}원`);
  setText(els.yearlyCost, formatKrw(result.yearlyCostKrw));
  setText(els.perUserCost, formatKrw(result.perUserCostKrw));
  setText(els.headcountNote, state.mode === "team" ? `${state.headcount}명 기준 1인당 추정` : "개인 기준");
  setText(els.savedValueKpi, formatKrw(result.savedValueKrw));
  setText(els.netBenefit, formatKrw(result.netBenefitKrw));
  setText(els.netBenefitNote, result.netBenefitKrw >= 0 ? "월 절감 가치가 구독비보다 큼" : "구독비가 절감 가치보다 큼");
  setText(els.roiScore, selectedCount ? `${result.roiScore.toLocaleString("ko-KR")}점` : "0점");
  setText(els.roiMessage, selectedCount ? `${label} · ${message}` : "AI 도구를 선택하면 비용 대비 효과를 계산합니다.");
  setText(els.savedValue, formatKrw(result.savedValueKrw));
  setText(els.breakEvenHours, `${result.breakEvenHours.toFixed(1)}시간`);
  els.roiCard?.setAttribute("data-tone", tone);

  if (!result.duplicateWarnings.length) {
    setHtml(els.warnings, `<p class="ais-empty">현재 선택 조합에서는 뚜렷한 중복 구독 경고가 없습니다.</p>`);
  } else {
    setHtml(
      els.warnings,
      result.duplicateWarnings
        .map(
          (warning) => `
            <article class="ais-warning-card">
              <strong>${warning.title}</strong>
              <p>${warning.message}</p>
              <span>${warning.recommendation}</span>
            </article>
          `,
        )
        .join(""),
    );
  }
}

function initCostChart() {
  const canvas = document.getElementById("aisCostChart");
  if (!canvas || !window.Chart) return;
  costChart = new window.Chart(canvas, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{ data: [], backgroundColor: ["#1d9e75", "#4a90d9", "#f59e0b", "#9c7cc7", "#14b8a6", "#ef4444", "#64748b", "#0ea5e9"], borderWidth: 0 }],
    },
    options: buildDefaultOptions({
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatKrw(ctx.parsed)}`,
          },
        },
      },
    }),
  });
}

function updateCostChart(toolCosts) {
  const fallbackHtml = toolCosts.length
    ? toolCosts.map((item) => `<p><strong>${escapeHtml(item.name)}</strong><span>${formatKrw(item.monthlyKrw)}</span></p>`).join("")
    : "<p>선택된 도구가 없습니다.</p>";
  setHtml(els.chartFallback, fallbackHtml);

  if (!costChart) return;
  costChart.data.labels = toolCosts.map((item) => item.name);
  costChart.data.datasets[0].data = toolCosts.map((item) => item.monthlyKrw);
  costChart.update("none");
}

function applyPreset(presetId) {
  const preset = presets.find((item) => item.id === presetId);
  if (!preset) return;
  state.mode = preset.mode;
  state.headcount = preset.headcount;
  state.selectedToolIds = [...preset.selectedToolIds];
  state.monthlySavedHours = preset.monthlySavedHours;
  state.hourlyValueKrw = preset.hourlyValueKrw;
  state.activePresetId = preset.id;
  syncInputs();
  calculate();
}

function resetState() {
  state.mode = defaults.mode || "personal";
  state.headcount = defaults.headcount || 1;
  state.exchangeRate = defaults.exchangeRate || 1400;
  state.includeVat = Boolean(defaults.includeVat);
  state.includeCardFee = Boolean(defaults.includeCardFee);
  state.cardFeeRate = defaults.cardFeeRate || 0.015;
  state.monthlyWorkHours = defaults.monthlyWorkHours || 160;
  state.hourlyValueKrw = defaults.hourlyValueKrw || 30000;
  state.monthlySavedHours = defaults.monthlySavedHours || 10;
  state.selectedToolIds = [...(defaults.selectedToolIds || [])];
  state.toolPrices = { ...(defaults.toolPrices || {}) };
  state.activePresetId = "";
  syncInputs();
  calculate();
}

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (!copyBtn) return;
    const original = copyBtn.textContent;
    copyBtn.textContent = "링크 복사됨";
    window.setTimeout(() => {
      copyBtn.textContent = original;
    }, 1500);
  } catch (error) {
    console.error("Failed to copy URL", error);
  }
}

function bindEvents() {
  [...Object.values(inputs).flat(), ...toolChecks, ...priceInputs].filter(Boolean).forEach((input) => {
    input.addEventListener("input", () => {
      state.activePresetId = "";
      calculate();
      syncInputs();
    });
    input.addEventListener("change", () => {
      state.activePresetId = "";
      calculate();
      syncInputs();
    });
  });
  presetButtons.forEach((button) => button.addEventListener("click", () => applyPreset(button.dataset.aisPreset)));
  resetBtn?.addEventListener("click", resetState);
  copyBtn?.addEventListener("click", copyShareUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  restoreStateFromUrl();
  syncInputs();
  bindEvents();
  if (window.Chart) initCostChart();
  calculate();
});
