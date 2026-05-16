const $ = (id) => document.getElementById(id);
const won = (value) => `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;
const pct = (value) => `${Number(value || 0).toFixed(0)}%`;

let config = { presets: [], defaultInput: {} };
let state = {
  jobType: "dev-outsourcing",
  hoursPerMonth: 20,
  baseHourlyRate: 60000,
  aiProductivityBoost: 70,
  aiToolMonthlyCost: 30000,
};

function sanitizeNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function calculate(input) {
  const hoursPerMonth = Math.max(0, input.hoursPerMonth);
  const baseMonthlyIncome = hoursPerMonth * Math.max(0, input.baseHourlyRate);
  const aiMonthlyIncome = baseMonthlyIncome * (1 + Math.max(0, input.aiProductivityBoost) / 100);
  const aiContribution = aiMonthlyIncome - baseMonthlyIncome;
  const netMonthlyIncome = aiMonthlyIncome - Math.max(0, input.aiToolMonthlyCost);
  const effectiveHourlyRate = hoursPerMonth > 0 ? netMonthlyIncome / hoursPerMonth : 0;
  const toolRoiMonths = aiContribution > 0 ? input.aiToolMonthlyCost / aiContribution : Infinity;
  return {
    baseMonthlyIncome,
    aiMonthlyIncome,
    aiContribution,
    netMonthlyIncome,
    effectiveHourlyRate,
    toolRoiMonths,
    isToolCostExceedingIncome: input.aiToolMonthlyCost > aiContribution,
  };
}

function readInputs() {
  state.jobType = $("asicJobType")?.value || state.jobType;
  state.hoursPerMonth = sanitizeNumber($("asicHours")?.value, 0);
  state.baseHourlyRate = sanitizeNumber($("asicRate")?.value, 0);
  state.aiProductivityBoost = Math.min(200, sanitizeNumber($("asicBoost")?.value, 0));
  state.aiToolMonthlyCost = sanitizeNumber($("asicToolCost")?.value, 0);
}

function writeInputs() {
  if ($("asicJobType")) $("asicJobType").value = state.jobType;
  if ($("asicHours")) $("asicHours").value = state.hoursPerMonth;
  if ($("asicRate")) $("asicRate").value = state.baseHourlyRate;
  if ($("asicBoost")) $("asicBoost").value = state.aiProductivityBoost;
  if ($("asicToolCost")) $("asicToolCost").value = state.aiToolMonthlyCost;
}

function roiText(months) {
  if (!Number.isFinite(months)) return "AI 기여 수입이 없어 도구비 회수가 어렵습니다.";
  if (months <= 0) return "도구비가 없어 회수 부담이 없습니다.";
  if (months < 1) return "이번 달 안에 도구비를 즉시 회수하는 구조입니다.";
  return `현재 입력값 기준 도구비는 약 ${months.toFixed(1)}개월 만에 회수됩니다.`;
}

function renderMessage(result) {
  const preset = config.presets.find((item) => item.id === state.jobType);
  const title = $("asicMessageTitle");
  const text = $("asicMessageText");
  const box = $("asicMessageBox");
  if (!title || !text || !box) return;

  if (state.hoursPerMonth <= 0) {
    box.dataset.status = "warning";
    title.textContent = "월 부업 시간을 1시간 이상 입력하세요";
    text.textContent = "시간이 0이면 실효 시급과 수입 비교를 계산할 수 없습니다.";
    return;
  }

  box.dataset.status = result.netMonthlyIncome < 0 || result.isToolCostExceedingIncome ? "warning" : "good";
  title.textContent = result.netMonthlyIncome < 0 ? "도구비가 예상 수입보다 큽니다" : `${preset?.label || "선택한 부업"} 기준 예상 순수입은 ${won(result.netMonthlyIncome)}입니다`;
  text.textContent = `${state.hoursPerMonth}시간을 투입하고 AI 생산성 향상률을 ${pct(state.aiProductivityBoost)}로 보면 기준 수입 ${won(result.baseMonthlyIncome)}에서 AI 사용 후 ${won(result.aiMonthlyIncome)}로 늘어납니다. ${roiText(result.toolRoiMonths)}`;
}

function renderBars(result) {
  const max = Math.max(result.baseMonthlyIncome, result.aiMonthlyIncome, 1);
  const baseWidth = Math.max(4, (result.baseMonthlyIncome / max) * 100);
  const aiWidth = Math.max(4, (result.aiMonthlyIncome / max) * 100);
  if ($("asicBaseBar")) $("asicBaseBar").style.width = `${baseWidth}%`;
  if ($("asicAiBar")) $("asicAiBar").style.width = `${aiWidth}%`;
  if ($("asicBaseBarValue")) $("asicBaseBarValue").textContent = won(result.baseMonthlyIncome);
  if ($("asicAiBarValue")) $("asicAiBarValue").textContent = won(result.aiMonthlyIncome);
}

function renderScenarioTable() {
  const body = $("asicScenarioBody");
  if (!body) return;
  const rates = [...new Set([0, 30, 50, state.aiProductivityBoost, 100].map((value) => Math.round(value)))].sort((a, b) => a - b);
  body.innerHTML = rates
    .map((rate) => {
      const result = calculate({ ...state, aiProductivityBoost: rate });
      const isCurrent = rate === Math.round(state.aiProductivityBoost);
      return `<tr class="${isCurrent ? "is-current" : ""}">
        <td>${rate}%${isCurrent ? " (현재)" : ""}</td>
        <td>${won(result.aiMonthlyIncome)}</td>
        <td>${won(result.aiContribution)}</td>
        <td>${won(result.netMonthlyIncome)}</td>
      </tr>`;
    })
    .join("");
}

function setActivePreset() {
  document.querySelectorAll("[data-asic-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.asicPreset === state.jobType);
  });
  document.querySelectorAll("[data-asic-tip]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.asicTip === state.jobType);
  });
}

function syncUrl() {
  const params = new URLSearchParams();
  params.set("job", state.jobType);
  params.set("hours", String(state.hoursPerMonth));
  params.set("rate", String(state.baseHourlyRate));
  params.set("boost", String(state.aiProductivityBoost));
  params.set("tool", String(state.aiToolMonthlyCost));
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function render(shouldSyncUrl = true) {
  readInputs();
  if ($("asicBoostLabel")) $("asicBoostLabel").textContent = pct(state.aiProductivityBoost);
  const result = calculate(state);
  if ($("asicAiIncome")) $("asicAiIncome").textContent = won(result.aiMonthlyIncome);
  if ($("asicBaseIncome")) $("asicBaseIncome").textContent = won(result.baseMonthlyIncome);
  if ($("asicContribution")) $("asicContribution").textContent = won(result.aiContribution);
  if ($("asicNetIncome")) $("asicNetIncome").textContent = won(result.netMonthlyIncome);
  if ($("asicEffectiveRate")) $("asicEffectiveRate").textContent = state.hoursPerMonth > 0 ? won(result.effectiveHourlyRate) : "-";
  renderMessage(result);
  renderBars(result);
  renderScenarioTable();
  setActivePreset();
  if (shouldSyncUrl) syncUrl();
}

function applyPreset(jobType) {
  const preset = config.presets.find((item) => item.id === jobType);
  if (!preset) return;
  state = {
    ...state,
    jobType: preset.id,
    baseHourlyRate: preset.defaultHourlyRate,
    aiProductivityBoost: preset.defaultProductivityBoost,
  };
  writeInputs();
  render();
}

function restoreFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const job = params.get("job");
  if (job && config.presets.some((item) => item.id === job)) state.jobType = job;
  state.hoursPerMonth = sanitizeNumber(params.get("hours"), state.hoursPerMonth);
  state.baseHourlyRate = sanitizeNumber(params.get("rate"), state.baseHourlyRate);
  state.aiProductivityBoost = Math.min(200, sanitizeNumber(params.get("boost"), state.aiProductivityBoost));
  state.aiToolMonthlyCost = sanitizeNumber(params.get("tool"), state.aiToolMonthlyCost);
}

document.addEventListener("DOMContentLoaded", () => {
  const seed = $("asicConfig");
  config = seed ? JSON.parse(seed.textContent || "{}") : config;
  state = { ...state, ...(config.defaultInput || {}) };
  restoreFromUrl();
  writeInputs();

  document.querySelectorAll("#asicForm input, #asicForm select").forEach((input) => {
    input.addEventListener("input", () => render());
    input.addEventListener("change", () => render());
  });
  document.querySelectorAll("[data-asic-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.asicPreset));
  });
  $("asicResetBtn")?.addEventListener("click", () => {
    state = { ...state, ...(config.defaultInput || {}) };
    writeInputs();
    render();
  });
  $("asicCopyLinkBtn")?.addEventListener("click", async () => {
    syncUrl();
    await navigator.clipboard?.writeText(window.location.href);
  });

  render(false);
});
