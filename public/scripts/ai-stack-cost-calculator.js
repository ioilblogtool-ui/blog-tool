import { buildDefaultOptions } from "./chart-config.js";
import { readBool, readParam, writeParams } from "./url-state.js";

const configEl = document.getElementById("aiStackCalculatorConfig");
const config = JSON.parse(configEl?.textContent || "{}");

const {
  AI_TOOLS = [],
  PRESET_BUNDLES = [],
  AI_CALC_META = {},
  AI_DEFAULT_STATE = {},
  STAGE_LABELS = {},
} = config;

const stageButtons = Array.from(document.querySelectorAll("[data-stage]"));
const intensityButtons = Array.from(document.querySelectorAll("[data-level]"));
const budgetButtons = Array.from(document.querySelectorAll("[data-budget]"));
const presetButtons = Array.from(document.querySelectorAll("[data-preset-id]"));
const toolCheckboxes = Array.from(document.querySelectorAll(".ai-tool-check__input"));

const exchangeRateInput = document.getElementById("aiExchangeRate");
const vatCheck = document.getElementById("aiVatCheck");
const calculateBtn = document.getElementById("aiCalculateBtn");
const resetBtn = document.getElementById("aiResetBtn");
const copyBtn = document.getElementById("aiCopyLinkBtn");

const resultEls = {
  subcopy: document.getElementById("aiResultSubcopy"),
  stageWarning: document.getElementById("aiStageWarning"),
  monthlyUsd: document.getElementById("aiMonthlyUsd"),
  monthlyKrw: document.getElementById("aiMonthlyKrw"),
  annualUsd: document.getElementById("aiAnnualUsd"),
  annualKrw: document.getElementById("aiAnnualKrw"),
  coverage: document.getElementById("aiCoverage"),
  coverageNote: document.getElementById("aiCoverageNote"),
  savings: document.getElementById("aiSavings"),
  savingsNote: document.getElementById("aiSavingsNote"),
  recName: document.getElementById("aiRecName"),
  recCost: document.getElementById("aiRecCost"),
  recTools: document.getElementById("aiRecTools"),
  recDesc: document.getElementById("aiRecDesc"),
  recMeta: document.getElementById("aiRecMeta"),
  budgetName: document.getElementById("aiBudgetName"),
  budgetCost: document.getElementById("aiBudgetCost"),
  budgetTools: document.getElementById("aiBudgetTools"),
  budgetDesc: document.getElementById("aiBudgetDesc"),
  budgetMeta: document.getElementById("aiBudgetMeta"),
  chartFallback: document.getElementById("aiChartFallback"),
};

const budgetMaxMap = {
  under30: 30,
  "30to60": 60,
  "60to100": 100,
  over100: 999,
};

const state = {
  selectedStages: [...(AI_DEFAULT_STATE.selectedStages || ["planning", "development"])],
  intensity: AI_DEFAULT_STATE.intensity || "normal",
  budget: AI_DEFAULT_STATE.budget || "30to60",
  currentTools: [...(AI_DEFAULT_STATE.currentTools || [])],
  exchangeRate: AI_DEFAULT_STATE.exchangeRate || 1380,
  vatIncluded: Boolean(AI_DEFAULT_STATE.vatIncluded),
  activePresetId: "mvp",
};

let donutChart = null;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function formatUsd(value) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function formatKrw(value) {
  const rounded = Math.round(Number(value) || 0);
  const abs = Math.abs(rounded);
  const sign = rounded < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}약 ${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}약 ${eok}억원`;
  if (man > 0) return `${sign}약 ${man.toLocaleString("ko-KR")}만원`;
  return `${sign}약 ${abs.toLocaleString("ko-KR")}원`;
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function setHtml(el, html) {
  if (el) el.innerHTML = html;
}

function getToolById(toolId) {
  return AI_TOOLS.find((tool) => tool.id === toolId) || null;
}

function stageCoverage(preset) {
  if (!state.selectedStages.length) return 0;
  const covered = state.selectedStages.filter((stage) => preset.targetStages.includes(stage)).length;
  return covered / state.selectedStages.length;
}

function intensityScore(preset) {
  if (state.intensity === "light") {
    return preset.type === "budget" ? 3 : preset.type === "balanced" ? 2 : 1;
  }
  if (state.intensity === "heavy") {
    return preset.type === "full" ? 3 : preset.type === "balanced" ? 2 : 1;
  }
  return preset.type === "balanced" ? 3 : preset.type === "full" ? 2 : 1;
}

function inferBudgetFromCost(monthlyCostUsd) {
  if (monthlyCostUsd <= 30) return "under30";
  if (monthlyCostUsd <= 60) return "30to60";
  if (monthlyCostUsd <= 100) return "60to100";
  return "over100";
}

function renderToolChips(container, toolIds) {
  const html = toolIds
    .map((toolId) => getToolById(toolId))
    .filter(Boolean)
    .map((tool) => `<span class="ai-rec-chip">${tool.name}</span>`)
    .join("");
  setHtml(container, html);
}

function syncStageButtons() {
  stageButtons.forEach((button) => {
    button.classList.toggle("is-active", state.selectedStages.includes(button.dataset.stage || ""));
  });
}

function syncChoiceButtons() {
  intensityButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.level === state.intensity);
  });
  budgetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.budget === state.budget);
  });
}

function syncToolChecks() {
  toolCheckboxes.forEach((input) => {
    const checked = state.currentTools.includes(input.value);
    input.checked = checked;
    input.closest(".ai-tool-check")?.classList.toggle("is-checked", checked);
  });
}

function syncOptionInputs() {
  if (exchangeRateInput) exchangeRateInput.value = String(state.exchangeRate);
  if (vatCheck) vatCheck.checked = state.vatIncluded;
}

function syncPresetButtons() {
  presetButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.presetId === state.activePresetId);
  });
}

function syncUrlState() {
  writeParams({
    stages: state.selectedStages.join(","),
    level: state.intensity,
    budget: state.budget,
    tools: state.currentTools.join(","),
    fx: state.exchangeRate,
    vat: state.vatIncluded ? 1 : 0,
  });
}

function restoreUrlState() {
  const stageParam = readParam("stages", state.selectedStages.join(","));
  const stages = stageParam
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && STAGE_LABELS[item]);
  state.selectedStages = stages.length ? stages : [...AI_DEFAULT_STATE.selectedStages];

  const level = readParam("level", state.intensity);
  if (["light", "normal", "heavy"].includes(level)) state.intensity = level;

  const budget = readParam("budget", state.budget);
  if (budgetMaxMap[budget]) state.budget = budget;

  const toolParam = readParam("tools", "");
  state.currentTools = toolParam
    .split(",")
    .map((item) => item.trim())
    .filter((item) => AI_TOOLS.some((tool) => tool.id === item));

  const exchangeRate = parseInt(readParam("fx", String(state.exchangeRate)), 10);
  state.exchangeRate = clamp(Number.isFinite(exchangeRate) ? exchangeRate : AI_CALC_META.defaultExchangeRate, 1000, 2000);
  state.vatIncluded = readBool("vat", false);
}

function resetState() {
  state.selectedStages = [...AI_DEFAULT_STATE.selectedStages];
  state.intensity = AI_DEFAULT_STATE.intensity;
  state.budget = AI_DEFAULT_STATE.budget;
  state.currentTools = [...AI_DEFAULT_STATE.currentTools];
  state.exchangeRate = AI_DEFAULT_STATE.exchangeRate;
  state.vatIncluded = Boolean(AI_DEFAULT_STATE.vatIncluded);
  state.activePresetId = "mvp";
  applyStateToUi();
  runCalculation();
}

function applyStateToUi() {
  syncStageButtons();
  syncChoiceButtons();
  syncToolChecks();
  syncOptionInputs();
  syncPresetButtons();
}

function resolveRecommendedPreset() {
  const eligible = PRESET_BUNDLES.filter((preset) => preset.monthlyCostUsd <= budgetMaxMap[state.budget]);
  const candidates = (eligible.length ? eligible : PRESET_BUNDLES).slice().sort((a, b) => {
    const coverageGap = stageCoverage(b) - stageCoverage(a);
    if (coverageGap !== 0) return coverageGap;
    const intensityGap = intensityScore(b) - intensityScore(a);
    if (intensityGap !== 0) return intensityGap;
    return a.monthlyCostUsd - b.monthlyCostUsd;
  });
  return candidates[0] || PRESET_BUNDLES[0];
}

function resolveBudgetPreset() {
  const candidates = PRESET_BUNDLES
    .filter((preset) => stageCoverage(preset) > 0)
    .slice()
    .sort((a, b) => {
      if (a.monthlyCostUsd !== b.monthlyCostUsd) return a.monthlyCostUsd - b.monthlyCostUsd;
      return stageCoverage(b) - stageCoverage(a);
    });
  return candidates[0] || PRESET_BUNDLES[0];
}

function updateDonutChart(preset) {
  if (!donutChart) return;
  const tools = preset.toolIds.map((toolId) => getToolById(toolId)).filter(Boolean);
  const colors = ["#1d9e75", "#4a90d9", "#9c7cc7", "#f59e0b", "#ef4444", "#0ea5e9", "#64748b", "#14b8a6"];
  donutChart.data.labels = tools.map((tool) => tool.name);
  donutChart.data.datasets[0].data = tools.map((tool) => tool.monthlyUsd);
  donutChart.data.datasets[0].backgroundColor = colors.slice(0, tools.length);
  donutChart.update("none");
}

function initDonutChart() {
  const canvas = document.getElementById("aiDonutChart");
  if (!canvas || !window.Chart) {
    if (resultEls.chartFallback) resultEls.chartFallback.hidden = false;
    return;
  }

  donutChart = new window.Chart(canvas, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
        },
      ],
    },
    options: buildDefaultOptions({
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatUsd(ctx.parsed)}/월`,
          },
        },
      },
      cutout: "62%",
    }),
  });
}

function updateWarning(isVisible) {
  if (resultEls.stageWarning) resultEls.stageWarning.hidden = !isVisible;
}

function clearResultCards() {
  setText(resultEls.monthlyUsd, "-");
  setText(resultEls.monthlyKrw, "-");
  setText(resultEls.annualUsd, "-");
  setText(resultEls.annualKrw, "-");
  setText(resultEls.coverage, "-");
  setText(resultEls.coverageNote, "업무 단계를 먼저 선택하세요");
  setText(resultEls.savings, "-");
  setText(resultEls.savingsNote, "절약형 비교 불가");
  setText(resultEls.recName, "-");
  setText(resultEls.recCost, "-");
  setText(resultEls.recDesc, "-");
  setText(resultEls.recMeta, "-");
  setHtml(resultEls.recTools, "");
  setText(resultEls.budgetName, "-");
  setText(resultEls.budgetCost, "-");
  setText(resultEls.budgetDesc, "-");
  setText(resultEls.budgetMeta, "-");
  setHtml(resultEls.budgetTools, "");
}

function updateResultDom(recommended, budgetAlt) {
  const overlapUsd = recommended.toolIds
    .filter((toolId) => state.currentTools.includes(toolId))
    .map((toolId) => getToolById(toolId))
    .filter(Boolean)
    .reduce((sum, tool) => sum + tool.monthlyUsd, 0);

  const totalUsd = recommended.monthlyCostUsd;
  const additionalUsd = Math.max(0, totalUsd - overlapUsd);
  const vatMultiplier = state.vatIncluded ? 1.1 : 1;
  const monthlyKrw = Math.round(additionalUsd * state.exchangeRate * vatMultiplier);
  const annualUsd = additionalUsd * 12;
  const annualKrw = monthlyKrw * 12;
  const coveragePct = Math.round(stageCoverage(recommended) * 100);
  const savingsUsd = Math.max(0, totalUsd - budgetAlt.monthlyCostUsd);
  const selectedStageText = state.selectedStages.map((stage) => STAGE_LABELS[stage]).join(" · ");

  setText(resultEls.subcopy, `${selectedStageText} 기준 · 이미 구독 중인 툴 ${state.currentTools.length}개 반영`);
  setText(resultEls.monthlyUsd, formatUsd(additionalUsd));
  setText(resultEls.monthlyKrw, `${formatKrw(monthlyKrw)}${state.vatIncluded ? " · VAT 포함" : ""}`);
  setText(resultEls.annualUsd, formatUsd(annualUsd));
  setText(resultEls.annualKrw, formatKrw(annualKrw));
  setText(resultEls.coverage, `${coveragePct}%`);
  setText(resultEls.coverageNote, `선택 단계 ${state.selectedStages.length}개 중 ${Math.round((coveragePct / 100) * state.selectedStages.length)}개 커버`);
  setText(resultEls.savings, formatUsd(savingsUsd));
  setText(resultEls.savingsNote, `${budgetAlt.name} 대비 ${formatUsd(savingsUsd)} 차이`);

  setText(resultEls.recName, recommended.name);
  setText(resultEls.recCost, `${formatUsd(totalUsd)}/월`);
  setText(resultEls.recDesc, recommended.description);
  setText(resultEls.recMeta, `${recommended.forWhom} · 현재 구독 반영 후 추가 ${formatUsd(additionalUsd)}`);
  renderToolChips(resultEls.recTools, recommended.toolIds);

  setText(resultEls.budgetName, budgetAlt.name);
  setText(resultEls.budgetCost, `${formatUsd(budgetAlt.monthlyCostUsd)}/월`);
  setText(resultEls.budgetDesc, budgetAlt.description);
  setText(resultEls.budgetMeta, `${budgetAlt.forWhom} · 최소 비용 기준`);
  renderToolChips(resultEls.budgetTools, budgetAlt.toolIds);
}

function runCalculation() {
  state.exchangeRate = clamp(parseInt(exchangeRateInput?.value || AI_CALC_META.defaultExchangeRate, 10) || AI_CALC_META.defaultExchangeRate, 1000, 2000);
  state.vatIncluded = Boolean(vatCheck?.checked);

  if (!state.selectedStages.length) {
    updateWarning(true);
    clearResultCards();
    syncUrlState();
    return;
  }

  updateWarning(false);
  const recommended = resolveRecommendedPreset();
  const budgetAlt = resolveBudgetPreset();
  updateResultDom(recommended, budgetAlt);
  updateDonutChart(recommended);
  syncUrlState();
}

function applyPreset(presetId) {
  const preset = PRESET_BUNDLES.find((item) => item.id === presetId);
  if (!preset) return;
  state.selectedStages = [...preset.targetStages];
  state.budget = inferBudgetFromCost(preset.monthlyCostUsd);
  state.intensity = preset.type === "budget" ? "light" : preset.type === "full" ? "heavy" : "normal";
  state.activePresetId = preset.id;
  applyStateToUi();
  runCalculation();
}

function bindStageButtons() {
  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stage = button.dataset.stage;
      if (!stage) return;
      if (state.selectedStages.includes(stage)) {
        state.selectedStages = state.selectedStages.filter((item) => item !== stage);
      } else {
        state.selectedStages = [...state.selectedStages, stage];
      }
      state.activePresetId = null;
      applyStateToUi();
      runCalculation();
    });
  });
}

function bindChoiceButtons() {
  intensityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.intensity = button.dataset.level || state.intensity;
      state.activePresetId = null;
      applyStateToUi();
      runCalculation();
    });
  });

  budgetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.budget = button.dataset.budget || state.budget;
      state.activePresetId = null;
      applyStateToUi();
      runCalculation();
    });
  });
}

function bindToolChecks() {
  toolCheckboxes.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.currentTools = Array.from(new Set([...state.currentTools, input.value]));
      } else {
        state.currentTools = state.currentTools.filter((item) => item !== input.value);
      }
      input.closest(".ai-tool-check")?.classList.toggle("is-checked", input.checked);
      runCalculation();
    });
  });
}

function bindOptionInputs() {
  exchangeRateInput?.addEventListener("input", () => {
    state.activePresetId = null;
    runCalculation();
  });
  vatCheck?.addEventListener("change", runCalculation);
}

function bindPresetButtons() {
  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const presetId = button.dataset.presetId;
      if (!presetId) return;
      applyPreset(presetId);
    });
  });
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (copyBtn) {
      const original = copyBtn.textContent;
      copyBtn.textContent = "링크 복사됨";
      window.setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    }
  } catch (error) {
    console.error("Failed to copy link", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  restoreUrlState();
  applyStateToUi();
  bindStageButtons();
  bindChoiceButtons();
  bindToolChecks();
  bindOptionInputs();
  bindPresetButtons();
  calculateBtn?.addEventListener("click", runCalculation);
  resetBtn?.addEventListener("click", resetState);
  copyBtn?.addEventListener("click", copyLink);

  if (window.Chart) {
    initDonutChart();
    runCalculation();
  } else {
    if (resultEls.chartFallback) resultEls.chartFallback.hidden = false;
    window.addEventListener(
      "load",
      () => {
        if (window.Chart && !donutChart) {
          if (resultEls.chartFallback) resultEls.chartFallback.hidden = true;
          initDonutChart();
          runCalculation();
        }
      },
      { once: true },
    );
    runCalculation();
  }
});
