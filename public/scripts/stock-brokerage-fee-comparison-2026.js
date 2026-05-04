const dataNode = document.getElementById("stockBrokerageFeeComparison2026Data");
const pageData = dataNode ? JSON.parse(dataNode.textContent || "{}") : {};

const recommendations = Array.isArray(pageData.recommendations) ? pageData.recommendations : [];
const presets = Array.isArray(pageData.simulationPresets) ? pageData.simulationPresets : [];
const defaultInvestorType = pageData.defaultInvestorType || "domestic-trader";

const formatWon = (value) => `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const findRecommendation = (type) =>
  recommendations.find((item) => item.investorType === type) || recommendations[0];

const renderRecommendation = (type) => {
  const panel = document.getElementById("sbfRecommendationPanel");
  const recommendation = findRecommendation(type);
  if (!panel || !recommendation) return;

  panel.replaceChildren();

  const eyebrow = document.createElement("p");
  eyebrow.className = "sbf-panel-eyebrow";
  eyebrow.textContent = recommendation.keyCriteria;

  const title = document.createElement("h3");
  title.textContent = recommendation.label;

  const chipRow = document.createElement("div");
  chipRow.className = "sbf-broker-chip-row";
  (recommendation.brokerNames || []).forEach((name) => {
    const chip = document.createElement("span");
    chip.textContent = name;
    chipRow.append(chip);
  });

  const reason = document.createElement("p");
  reason.textContent = recommendation.reason;

  const caution = document.createElement("p");
  caution.className = "sbf-caution";
  caution.textContent = recommendation.caution;

  panel.append(eyebrow, title, chipRow, reason, caution);
};

const setInvestorType = (type, shouldPush = true) => {
  const recommendation = findRecommendation(type);
  if (!recommendation) return;

  document.querySelectorAll("[data-sbf-investor-type]").forEach((button) => {
    const isActive = button.getAttribute("data-sbf-investor-type") === recommendation.investorType;
    button.classList.toggle("is-active", isActive);
  });

  renderRecommendation(recommendation.investorType);

  if (shouldPush) {
    const url = new URL(window.location.href);
    url.searchParams.set("type", recommendation.investorType);
    window.history.replaceState({}, "", url);
  }
};

const bindInvestorTabs = () => {
  document.querySelectorAll("[data-sbf-investor-type]").forEach((button) => {
    button.addEventListener("click", () => {
      setInvestorType(button.getAttribute("data-sbf-investor-type") || defaultInvestorType);
    });
  });

  const initialType = new URLSearchParams(window.location.search).get("type") || defaultInvestorType;
  setInvestorType(initialType, false);
};

const updateSimulation = () => {
  const amountInput = document.getElementById("sbfSimulationAmount");
  const countInput = document.getElementById("sbfSimulationCount");
  const lowRateInput = document.getElementById("sbfLowFeeRate");
  const highRateInput = document.getElementById("sbfHighFeeRate");

  const amount = safeNumber(amountInput?.value);
  const count = safeNumber(countInput?.value);
  const lowRate = safeNumber(lowRateInput?.value) / 100;
  const highRate = safeNumber(highRateInput?.value) / 100;

  const lowFee = amount * count * lowRate;
  const highFee = amount * count * highRate;
  const diff = Math.max(0, highFee - lowFee);

  const lowFeeNode = document.getElementById("sbfLowFee");
  const highFeeNode = document.getElementById("sbfHighFee");
  const diffNode = document.getElementById("sbfFeeDiff");

  if (lowFeeNode) lowFeeNode.textContent = formatWon(lowFee);
  if (highFeeNode) highFeeNode.textContent = formatWon(highFee);
  if (diffNode) diffNode.textContent = formatWon(diff);
};

const applyPreset = (presetId) => {
  const preset = presets.find((item) => item.id === presetId);
  if (!preset) return;

  const amountInput = document.getElementById("sbfSimulationAmount");
  const countInput = document.getElementById("sbfSimulationCount");
  const lowRateInput = document.getElementById("sbfLowFeeRate");
  const highRateInput = document.getElementById("sbfHighFeeRate");

  if (amountInput) amountInput.value = String(preset.tradeAmount);
  if (countInput) countInput.value = String(preset.annualTradeCount);
  if (lowRateInput) lowRateInput.value = String(preset.lowFeeRate);
  if (highRateInput) highRateInput.value = String(preset.highFeeRate);

  document.querySelectorAll("[data-sbf-simulation-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-sbf-simulation-preset") === presetId);
  });

  updateSimulation();
};

const bindSimulation = () => {
  ["sbfSimulationAmount", "sbfSimulationCount", "sbfLowFeeRate", "sbfHighFeeRate"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateSimulation);
  });

  document.querySelectorAll("[data-sbf-simulation-preset]").forEach((button, index) => {
    if (index === 0) button.classList.add("is-active");
    button.addEventListener("click", () => {
      applyPreset(button.getAttribute("data-sbf-simulation-preset"));
    });
  });

  updateSimulation();
};

bindInvestorTabs();
bindSimulation();
