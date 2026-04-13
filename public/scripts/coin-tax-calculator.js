const configEl = document.getElementById("coinTaxCalculatorConfig");
const { CTC_RULES, CTC_DEFAULT_INPUT, CTC_SCENARIO_PRESETS } = JSON.parse(configEl?.textContent || "{}");

const fields = {
  assetName: document.getElementById("ctcAssetName"),
  averageBuyPrice: document.getElementById("ctcAverageBuyPrice"),
  quantity: document.getElementById("ctcQuantity"),
  sellPrice: document.getElementById("ctcSellPrice"),
  buyFeeRate: document.getElementById("ctcBuyFeeRate"),
  sellFeeRate: document.getElementById("ctcSellFeeRate"),
  extraCost: document.getElementById("ctcExtraCost"),
  taxYear: document.getElementById("ctcTaxYear"),
};

const moneyFieldKeys = ["averageBuyPrice", "sellPrice", "extraCost"];

const hints = {
  averageBuyPrice: document.getElementById("ctcAverageBuyPriceHint"),
  sellPrice: document.getElementById("ctcSellPriceHint"),
  extraCost: document.getElementById("ctcExtraCostHint"),
};

const taxModeTabs = document.querySelectorAll(".ctc-tax-mode-tab");
const presetButtons = document.querySelectorAll(".ctc-preset-btn");
const resetBtn = document.getElementById("resetCoinTaxBtn");
const copyBtn = document.getElementById("copyCoinTaxLinkBtn");

const resultEls = {
  resultSubcopy: document.getElementById("ctcResultSubcopy"),
  capitalGain: document.getElementById("ctcCapitalGainValue"),
  taxableIncome: document.getElementById("ctcTaxableIncomeValue"),
  estimatedTax: document.getElementById("ctcEstimatedTaxValue"),
  estimatedTaxNote: document.getElementById("ctcEstimatedTaxNote"),
  afterTaxProfit: document.getElementById("ctcAfterTaxProfitValue"),
  netReceipt: document.getElementById("ctcNetReceiptValue"),
  buyAmount: document.getElementById("ctcBuyAmountValue"),
  sellAmount: document.getElementById("ctcSellAmountValue"),
  buyFee: document.getElementById("ctcBuyFeeValue"),
  sellFee: document.getElementById("ctcSellFeeValue"),
  totalFee: document.getElementById("ctcTotalFeeValue"),
  extraCost: document.getElementById("ctcExtraCostValue"),
  capitalGainRow: document.getElementById("ctcCapitalGainRowValue"),
  deduction: document.getElementById("ctcDeductionValue"),
  taxableIncomeRow: document.getElementById("ctcTaxableIncomeRowValue"),
  estimatedTaxRow: document.getElementById("ctcEstimatedTaxRowValue"),
  taxFreeNotice: document.getElementById("ctcTaxFreeNotice"),
};

const state = {
  ...CTC_DEFAULT_INPUT,
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function parseMoneyValue(raw) {
  return Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
}

function formatMoneyValue(raw) {
  const numeric = parseMoneyValue(raw);
  return numeric.toLocaleString("ko-KR");
}

function fmtBig(n) {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

function fmtInlineMoney(n) {
  if (!Number.isFinite(n) || n <= 0) return "약 0원";
  return `약 ${fmtBig(n)}`;
}

function pctToRate(value) {
  return clamp((parseFloat(value) || 0) / 100, 0, 1);
}

function readForm() {
  state.assetName = fields.assetName?.value?.trim() || "BTC";
  state.averageBuyPrice = parseMoneyValue(fields.averageBuyPrice?.value);
  state.quantity = Math.max(0, parseFloat(fields.quantity?.value || 0) || 0);
  state.sellPrice = parseMoneyValue(fields.sellPrice?.value);
  state.buyFeeRate = pctToRate(fields.buyFeeRate?.value);
  state.sellFeeRate = pctToRate(fields.sellFeeRate?.value);
  state.extraCost = parseMoneyValue(fields.extraCost?.value);
  state.taxYear = parseInt(fields.taxYear?.value || CTC_RULES.defaultTaxYear, 10);
}

function calcBuyAmount(input) {
  return input.averageBuyPrice * input.quantity;
}

function calcSellAmount(input) {
  return input.sellPrice * input.quantity;
}

function calcBuyFee(buyAmount, input) {
  return buyAmount * input.buyFeeRate;
}

function calcSellFee(sellAmount, input) {
  return sellAmount * input.sellFeeRate;
}

function calcCapitalGain(sellAmount, buyAmount, totalFee, extraCost) {
  return sellAmount - buyAmount - totalFee - extraCost;
}

function calcTaxableIncome(capitalGain) {
  return Math.max(0, capitalGain - CTC_RULES.basicDeduction);
}

function calcAppliedTaxRate(input) {
  return input.taxMode === "incomeTaxOnly" ? CTC_RULES.incomeTaxRate : CTC_RULES.effectiveTaxRate;
}

function calculate(input) {
  const buyAmount = calcBuyAmount(input);
  const sellAmount = calcSellAmount(input);
  const buyFee = calcBuyFee(buyAmount, input);
  const sellFee = calcSellFee(sellAmount, input);
  const totalFee = buyFee + sellFee;
  const capitalGain = calcCapitalGain(sellAmount, buyAmount, totalFee, input.extraCost);
  const taxableIncome = calcTaxableIncome(capitalGain);
  const appliedTaxRate = calcAppliedTaxRate(input);
  const estimatedTax = taxableIncome * appliedTaxRate;
  const afterTaxProfit = capitalGain - estimatedTax;
  const netReceipt = sellAmount - sellFee - estimatedTax;

  return {
    buyAmount,
    sellAmount,
    buyFee,
    sellFee,
    totalFee,
    capitalGain,
    taxableIncome,
    estimatedTax,
    afterTaxProfit,
    netReceipt,
    appliedTaxRate,
    isTaxFree: taxableIncome <= 0,
  };
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function renderHints() {
  setText(hints.averageBuyPrice, fmtInlineMoney(state.averageBuyPrice));
  setText(hints.sellPrice, fmtInlineMoney(state.sellPrice));
  setText(hints.extraCost, fmtInlineMoney(state.extraCost));
}

function renderPresetState() {
  presetButtons.forEach((button) => {
    const presetId = button.getAttribute("data-preset-id");
    const isActive = CTC_SCENARIO_PRESETS.some((preset) => {
      if (preset.id !== presetId) return false;
      return preset.values.assetName === state.assetName
        && preset.values.averageBuyPrice === state.averageBuyPrice
        && preset.values.quantity === state.quantity
        && preset.values.sellPrice === state.sellPrice;
    });
    button.classList.toggle("is-active", isActive);
  });
}

function renderTaxModeState() {
  taxModeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.getAttribute("data-mode") === state.taxMode);
  });
}

function updateUI(result) {
  setText(resultEls.resultSubcopy, `${state.assetName || "코인"} · 수량 ${state.quantity} · 과세 기준 ${state.taxYear}년 참고`);
  setText(resultEls.capitalGain, fmtBig(result.capitalGain));
  setText(resultEls.taxableIncome, fmtBig(result.taxableIncome));
  setText(resultEls.estimatedTax, fmtBig(result.estimatedTax));
  setText(resultEls.estimatedTaxNote, `${Math.round(result.appliedTaxRate * 100)}% 기준`);
  setText(resultEls.afterTaxProfit, fmtBig(result.afterTaxProfit));
  setText(resultEls.netReceipt, fmtBig(result.netReceipt));

  setText(resultEls.buyAmount, fmtBig(result.buyAmount));
  setText(resultEls.sellAmount, fmtBig(result.sellAmount));
  setText(resultEls.buyFee, fmtBig(result.buyFee));
  setText(resultEls.sellFee, fmtBig(result.sellFee));
  setText(resultEls.totalFee, fmtBig(result.totalFee));
  setText(resultEls.extraCost, fmtBig(state.extraCost));
  setText(resultEls.capitalGainRow, fmtBig(result.capitalGain));
  setText(resultEls.deduction, fmtBig(CTC_RULES.basicDeduction));
  setText(resultEls.taxableIncomeRow, fmtBig(result.taxableIncome));
  setText(resultEls.estimatedTaxRow, fmtBig(result.estimatedTax));

  if (resultEls.taxFreeNotice) {
    resultEls.taxFreeNotice.hidden = !result.isTaxFree;
  }
}

function syncUrlParams() {
  const params = new URLSearchParams();
  params.set("asset", state.assetName);
  params.set("bp", String(state.averageBuyPrice));
  params.set("qty", String(state.quantity));
  params.set("sp", String(state.sellPrice));
  params.set("bf", String(Math.round(state.buyFeeRate * 10000) / 100));
  params.set("sf", String(Math.round(state.sellFeeRate * 10000) / 100));
  params.set("ec", String(state.extraCost));
  params.set("tm", state.taxMode);
  params.set("ty", String(state.taxYear));
  history.replaceState(null, "", `?${params.toString()}`);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(location.search);
  if (params.get("asset") && fields.assetName) fields.assetName.value = params.get("asset");
  if (params.get("bp") && fields.averageBuyPrice) fields.averageBuyPrice.value = formatMoneyValue(params.get("bp"));
  if (params.get("qty") && fields.quantity) fields.quantity.value = params.get("qty");
  if (params.get("sp") && fields.sellPrice) fields.sellPrice.value = formatMoneyValue(params.get("sp"));
  if (params.get("bf") && fields.buyFeeRate) fields.buyFeeRate.value = params.get("bf");
  if (params.get("sf") && fields.sellFeeRate) fields.sellFeeRate.value = params.get("sf");
  if (params.get("ec") && fields.extraCost) fields.extraCost.value = formatMoneyValue(params.get("ec"));
  if (params.get("ty") && fields.taxYear) fields.taxYear.value = params.get("ty");

  const taxMode = params.get("tm");
  if (taxMode === "effective" || taxMode === "incomeTaxOnly") state.taxMode = taxMode;
}

function applyPreset(presetId) {
  const preset = CTC_SCENARIO_PRESETS.find((item) => item.id === presetId);
  if (!preset) return;

  if (fields.assetName) fields.assetName.value = preset.values.assetName;
  if (fields.averageBuyPrice) fields.averageBuyPrice.value = formatMoneyValue(preset.values.averageBuyPrice);
  if (fields.quantity) fields.quantity.value = String(preset.values.quantity);
  if (fields.sellPrice) fields.sellPrice.value = formatMoneyValue(preset.values.sellPrice);
  if (fields.buyFeeRate) fields.buyFeeRate.value = (preset.values.buyFeeRate * 100).toFixed(2);
  if (fields.sellFeeRate) fields.sellFeeRate.value = (preset.values.sellFeeRate * 100).toFixed(2);
  if (fields.extraCost) fields.extraCost.value = formatMoneyValue(preset.values.extraCost);
  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (copyBtn) {
      const original = copyBtn.textContent;
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1500);
    }
  } catch (error) {
    console.error(error);
  }
}

function resetAll() {
  if (fields.assetName) fields.assetName.value = CTC_DEFAULT_INPUT.assetName;
  if (fields.averageBuyPrice) fields.averageBuyPrice.value = formatMoneyValue(CTC_DEFAULT_INPUT.averageBuyPrice);
  if (fields.quantity) fields.quantity.value = String(CTC_DEFAULT_INPUT.quantity);
  if (fields.sellPrice) fields.sellPrice.value = formatMoneyValue(CTC_DEFAULT_INPUT.sellPrice);
  if (fields.buyFeeRate) fields.buyFeeRate.value = (CTC_DEFAULT_INPUT.buyFeeRate * 100).toFixed(2);
  if (fields.sellFeeRate) fields.sellFeeRate.value = (CTC_DEFAULT_INPUT.sellFeeRate * 100).toFixed(2);
  if (fields.extraCost) fields.extraCost.value = formatMoneyValue(CTC_DEFAULT_INPUT.extraCost);
  if (fields.taxYear) fields.taxYear.value = String(CTC_DEFAULT_INPUT.taxYear);
  state.taxMode = CTC_DEFAULT_INPUT.taxMode;
  renderTaxModeState();
  runCalculation();
}

function runCalculation() {
  readForm();
  renderHints();
  renderTaxModeState();
  renderPresetState();
  const result = calculate(state);
  updateUI(result);
  syncUrlParams();
}

Object.entries(fields).forEach(([key, field]) => {
  if (!field) return;
  field.addEventListener("input", () => {
    if (moneyFieldKeys.includes(key)) {
      field.value = formatMoneyValue(field.value);
    }
    runCalculation();
  });
  field.addEventListener("change", runCalculation);
});

taxModeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const mode = tab.getAttribute("data-mode");
    if (mode === "effective" || mode === "incomeTaxOnly") {
      state.taxMode = mode;
      renderTaxModeState();
      runCalculation();
    }
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.getAttribute("data-preset-id"));
  });
});

resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

loadFromUrlParams();
runCalculation();
