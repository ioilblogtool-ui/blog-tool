const configEl = document.getElementById("stockBreakevenCalculatorConfig");
const { SBC_MARKET_PRESETS, SBC_DEFAULT_INPUT, SBC_SCENARIO_PRESETS } = JSON.parse(configEl?.textContent || "{}");

const fields = {
  buyPrice: document.getElementById("sbcBuyPrice"),
  quantity: document.getElementById("sbcQuantity"),
  buyFeeRate: document.getElementById("sbcBuyFeeRate"),
  txTaxRate: document.getElementById("sbcTxTaxRate"),
  sellFeeRate: document.getElementById("sbcSellFeeRate"),
  currentPrice: document.getElementById("sbcCurrentPrice"),
  targetReturnRate: document.getElementById("sbcTargetReturnRate"),
};

const moneyFieldKeys = ["buyPrice", "currentPrice"];

const hints = {
  buyPrice: document.getElementById("sbcBuyPriceHint"),
  currentPrice: document.getElementById("sbcCurrentPriceHint"),
};

const marketTabs = document.querySelectorAll(".sbc-market-tab");
const marketNote = document.getElementById("sbcMarketNote");
const txTaxField = document.getElementById("sbcTxTaxField");
const presetButtons = document.querySelectorAll(".sbc-preset-btn");
const resetBtn = document.getElementById("sbcResetBtn");
const copyBtn = document.getElementById("sbcCopyLinkBtn");

const resultEls = {
  subcopy: document.getElementById("sbcResultSubcopy"),
  breakevenPrice: document.getElementById("sbcBreakevenPrice"),
  breakevenRiseRate: document.getElementById("sbcBreakevenRiseRate"),
  totalBuyCost: document.getElementById("sbcTotalBuyCost"),
  totalCost: document.getElementById("sbcTotalCost"),
  targetPrice: document.getElementById("sbcTargetPrice"),
  targetRateLabel: document.getElementById("sbcTargetRateLabel"),
  currentSection: document.getElementById("sbcCurrentSection"),
  currentBox: document.getElementById("sbcCurrentBox"),
  statusBadge: document.getElementById("sbcStatusBadge"),
  currentProfitLoss: document.getElementById("sbcCurrentProfitLoss"),
  currentReturnRate: document.getElementById("sbcCurrentReturnRate"),
  gapToBreakeven: document.getElementById("sbcGapToBreakeven"),
  gapRate: document.getElementById("sbcGapRate"),
  dBuyPrice: document.getElementById("sbcDBuyPrice"),
  dQuantity: document.getElementById("sbcDQuantity"),
  dBuyAmount: document.getElementById("sbcDBuyAmount"),
  dBuyFee: document.getElementById("sbcDBuyFee"),
  dTotalBuyCost: document.getElementById("sbcDTotalBuyCost"),
  dBePrice: document.getElementById("sbcDBePrice"),
  dSellFee: document.getElementById("sbcDSellFee"),
  dTxTax: document.getElementById("sbcDTxTax"),
  dTotalCost: document.getElementById("sbcDTotalCost"),
};

const state = {
  buyPrice: SBC_DEFAULT_INPUT.buyPrice,
  quantity: SBC_DEFAULT_INPUT.quantity,
  buyFeeRate: SBC_DEFAULT_INPUT.buyFeeRate,
  sellFeeRate: SBC_DEFAULT_INPUT.sellFeeRate,
  market: SBC_DEFAULT_INPUT.market,
  transactionTaxRate: SBC_DEFAULT_INPUT.transactionTaxRate,
  currentPrice: null,
  targetReturnRate: SBC_DEFAULT_INPUT.targetReturnRate,
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

function pctToRate(value) {
  return clamp((parseFloat(value) || 0) / 100, 0, 1);
}

function fmtBig(n) {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "-" : "";
  const eok = Math.floor(abs / 100_000_000);
  const man = Math.round((abs % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  if (abs < 10_000) return `${sign}${abs.toLocaleString("ko-KR")}원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

function fmtWon(n) {
  if (!Number.isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function fmtPct(n) {
  if (!Number.isFinite(n)) return "-";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function fmtInlineMoney(n) {
  if (!Number.isFinite(n) || n <= 0) return "";
  return `약 ${fmtBig(n)}`;
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function readForm() {
  state.buyPrice = parseMoneyValue(fields.buyPrice?.value);
  state.quantity = Math.max(1, parseInt(fields.quantity?.value || 1, 10) || 1);
  state.buyFeeRate = pctToRate(fields.buyFeeRate?.value);
  state.transactionTaxRate = pctToRate(fields.txTaxRate?.value);
  state.sellFeeRate = pctToRate(fields.sellFeeRate?.value);

  const cpRaw = parseMoneyValue(fields.currentPrice?.value);
  state.currentPrice = cpRaw > 0 ? cpRaw : null;

  state.targetReturnRate = Math.max(0, parseFloat(fields.targetReturnRate?.value || 0) || 0);
}

function calculate(s) {
  const { buyPrice, quantity, buyFeeRate, sellFeeRate, transactionTaxRate, currentPrice, targetReturnRate } = s;

  const totalBuyAmount = buyPrice * quantity;
  const buyFee = totalBuyAmount * buyFeeRate;
  const totalBuyCost = totalBuyAmount + buyFee;

  const denominator = 1 - sellFeeRate - transactionTaxRate;
  const safe = denominator > 0 ? denominator : 0.001;

  const breakEvenSellAmount = totalBuyCost / safe;
  const breakEvenSellPrice = breakEvenSellAmount / quantity;
  const breakEvenRiseRate = buyPrice > 0
    ? ((breakEvenSellPrice - buyPrice) / buyPrice) * 100
    : 0;

  const beSellFee = breakEvenSellAmount * sellFeeRate;
  const beTxTax = breakEvenSellAmount * transactionTaxRate;
  const totalCostAtBE = buyFee + beSellFee + beTxTax;

  const targetNetReceipt = totalBuyCost * (1 + targetReturnRate / 100);
  const targetSellAmount = targetNetReceipt / safe;
  const targetSellPrice = targetSellAmount / quantity;
  const targetRiseRate = buyPrice > 0
    ? ((targetSellPrice - buyPrice) / buyPrice) * 100
    : 0;

  let currentResult = null;
  if (currentPrice && currentPrice > 0) {
    const curSellAmount = currentPrice * quantity;
    const curSellFee = curSellAmount * sellFeeRate;
    const curTxTax = curSellAmount * transactionTaxRate;
    const curNetReceipt = curSellAmount - curSellFee - curTxTax;
    const profitLoss = curNetReceipt - totalBuyCost;
    const returnRate = totalBuyCost > 0 ? (profitLoss / totalBuyCost) * 100 : 0;
    const gapToBreakEven = breakEvenSellPrice - currentPrice;
    const gapRate = currentPrice > 0 ? (gapToBreakEven / currentPrice) * 100 : 0;

    const NEAR_THRESHOLD = 0.5;
    const status = profitLoss >= 0
      ? "profit"
      : (gapToBreakEven / breakEvenSellPrice * 100 < NEAR_THRESHOLD ? "near" : "loss");

    currentResult = {
      profitLoss,
      returnRate,
      gapToBreakEven,
      gapRate,
      status,
    };
  }

  return {
    totalBuyAmount,
    buyFee,
    totalBuyCost,
    breakEvenSellPrice,
    breakEvenRiseRate,
    beSellFee,
    beTxTax,
    totalCostAtBE,
    targetSellPrice,
    targetRiseRate,
    currentResult,
  };
}

function updateUI(result) {
  setText(resultEls.subcopy, `${state.quantity}주 · 매수가 ${fmtWon(state.buyPrice)} 기준`);

  setText(resultEls.breakevenPrice, fmtWon(result.breakEvenSellPrice));
  setText(resultEls.breakevenRiseRate, fmtPct(result.breakEvenRiseRate));
  setText(resultEls.totalBuyCost, fmtBig(result.totalBuyCost));
  setText(resultEls.totalCost, fmtBig(result.totalCostAtBE));
  setText(resultEls.targetPrice, fmtWon(result.targetSellPrice));
  setText(resultEls.targetRateLabel, String(state.targetReturnRate));

  setText(resultEls.dBuyPrice, fmtWon(state.buyPrice));
  setText(resultEls.dQuantity, `${state.quantity.toLocaleString("ko-KR")}주`);
  setText(resultEls.dBuyAmount, fmtBig(result.totalBuyAmount));
  setText(resultEls.dBuyFee, fmtBig(result.buyFee));
  setText(resultEls.dTotalBuyCost, fmtBig(result.totalBuyCost));
  setText(resultEls.dBePrice, fmtWon(result.breakEvenSellPrice));
  setText(resultEls.dSellFee, fmtBig(result.beSellFee));
  setText(resultEls.dTxTax, fmtBig(result.beTxTax));
  setText(resultEls.dTotalCost, fmtBig(result.totalCostAtBE));

  if (result.currentResult) {
    const cr = result.currentResult;
    if (resultEls.currentSection) resultEls.currentSection.style.display = "";
    const box = resultEls.currentBox;
    if (box) {
      box.className = "sbc-current-box";
      box.classList.add(`sbc-current-box--${cr.status}`);
    }
    const badge = resultEls.statusBadge;
    if (badge) {
      badge.className = "sbc-status-badge";
      badge.classList.add(`sbc-status-badge--${cr.status}`);
      badge.textContent = cr.status === "profit" ? "수익 중" : cr.status === "near" ? "손익분기 근접" : "손실 중";
    }
    const plEl = resultEls.currentProfitLoss;
    if (plEl) {
      plEl.textContent = fmtBig(cr.profitLoss);
      plEl.className = "sbc-current-value";
      plEl.classList.add(cr.profitLoss >= 0 ? "sbc-result-value--profit" : "sbc-result-value--loss");
    }
    const rrEl = resultEls.currentReturnRate;
    if (rrEl) {
      rrEl.textContent = fmtPct(cr.returnRate);
      rrEl.className = "sbc-current-value";
      rrEl.classList.add(cr.returnRate >= 0 ? "sbc-result-value--profit" : "sbc-result-value--loss");
    }
    setText(resultEls.gapToBreakeven,
      cr.gapToBreakEven <= 0 ? "도달 완료" : `+${fmtWon(cr.gapToBreakEven)}`
    );
    setText(resultEls.gapRate,
      cr.gapToBreakEven <= 0 ? "-" : `+${cr.gapRate.toFixed(2)}% 필요`
    );
  } else {
    if (resultEls.currentSection) resultEls.currentSection.style.display = "none";
  }
}

function renderMarketState() {
  marketTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.getAttribute("data-market") === state.market);
  });
  const preset = SBC_MARKET_PRESETS.find((m) => m.id === state.market);
  if (preset && marketNote) marketNote.textContent = preset.note;
  if (fields.txTaxRate) {
    const isCustom = state.market === "custom";
    fields.txTaxRate.disabled = !isCustom;
    if (!isCustom && preset) {
      fields.txTaxRate.value = (preset.transactionTaxRate * 100).toFixed(3);
    }
  }
}

function renderPresetState() {
  presetButtons.forEach((btn) => {
    const presetId = btn.getAttribute("data-preset-id");
    const preset = SBC_SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const v = preset.values;
    const isActive =
      v.buyPrice === state.buyPrice &&
      v.quantity === state.quantity &&
      v.market === state.market;
    btn.classList.toggle("is-active", isActive);
  });
}

function renderHints() {
  setText(hints.buyPrice, fmtInlineMoney(state.buyPrice));
  setText(hints.currentPrice, state.currentPrice ? fmtInlineMoney(state.currentPrice) : "");
}

function syncUrlParams() {
  const params = new URLSearchParams();
  params.set("bp", String(state.buyPrice));
  params.set("qty", String(state.quantity));
  params.set("bf", String(Math.round(state.buyFeeRate * 100000) / 1000));
  params.set("sf", String(Math.round(state.sellFeeRate * 100000) / 1000));
  params.set("mkt", state.market);
  params.set("tt", String(Math.round(state.transactionTaxRate * 100000) / 1000));
  if (state.currentPrice) params.set("cp", String(state.currentPrice));
  params.set("tr", String(state.targetReturnRate));
  history.replaceState(null, "", `?${params.toString()}`);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(location.search);
  if (params.get("bp") && fields.buyPrice) fields.buyPrice.value = formatMoneyValue(params.get("bp"));
  if (params.get("qty") && fields.quantity) fields.quantity.value = params.get("qty");
  if (params.get("bf") && fields.buyFeeRate) fields.buyFeeRate.value = params.get("bf");
  if (params.get("sf") && fields.sellFeeRate) fields.sellFeeRate.value = params.get("sf");
  if (params.get("tt") && fields.txTaxRate) fields.txTaxRate.value = params.get("tt");
  if (params.get("cp") && fields.currentPrice) fields.currentPrice.value = formatMoneyValue(params.get("cp"));
  if (params.get("tr") && fields.targetReturnRate) fields.targetReturnRate.value = params.get("tr");

  const mkt = params.get("mkt");
  if (mkt && SBC_MARKET_PRESETS.some((m) => m.id === mkt)) {
    state.market = mkt;
    if (mkt !== "custom") {
      const preset = SBC_MARKET_PRESETS.find((m) => m.id === mkt);
      state.transactionTaxRate = preset.transactionTaxRate;
    }
  }
}

function applyPreset(presetId) {
  const preset = SBC_SCENARIO_PRESETS.find((p) => p.id === presetId);
  if (!preset) return;
  const v = preset.values;

  if (fields.buyPrice) fields.buyPrice.value = formatMoneyValue(v.buyPrice);
  if (fields.quantity) fields.quantity.value = String(v.quantity);
  if (fields.buyFeeRate) fields.buyFeeRate.value = (v.buyFeeRate * 100).toFixed(3);
  if (fields.sellFeeRate) fields.sellFeeRate.value = (v.sellFeeRate * 100).toFixed(3);
  if (fields.targetReturnRate) fields.targetReturnRate.value = String(v.targetReturnRate);

  if (v.currentPrice) {
    if (fields.currentPrice) fields.currentPrice.value = formatMoneyValue(v.currentPrice);
  } else {
    if (fields.currentPrice) fields.currentPrice.value = "";
  }

  state.market = v.market;
  state.transactionTaxRate = v.transactionTaxRate;
  renderMarketState();

  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (copyBtn) {
      const original = copyBtn.textContent;
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    }
  } catch (e) {
    console.error(e);
  }
}

function resetAll() {
  if (fields.buyPrice) fields.buyPrice.value = formatMoneyValue(SBC_DEFAULT_INPUT.buyPrice);
  if (fields.quantity) fields.quantity.value = String(SBC_DEFAULT_INPUT.quantity);
  if (fields.buyFeeRate) fields.buyFeeRate.value = (SBC_DEFAULT_INPUT.buyFeeRate * 100).toFixed(3);
  if (fields.sellFeeRate) fields.sellFeeRate.value = (SBC_DEFAULT_INPUT.sellFeeRate * 100).toFixed(3);
  if (fields.currentPrice) fields.currentPrice.value = "";
  if (fields.targetReturnRate) fields.targetReturnRate.value = String(SBC_DEFAULT_INPUT.targetReturnRate);
  state.market = SBC_DEFAULT_INPUT.market;
  state.transactionTaxRate = SBC_DEFAULT_INPUT.transactionTaxRate;
  renderMarketState();
  runCalculation();
}

function runCalculation() {
  readForm();
  renderHints();
  renderMarketState();
  renderPresetState();
  const result = calculate(state);
  updateUI(result);
  syncUrlParams();
}

Object.entries(fields).forEach(([key, field]) => {
  if (!field) return;
  field.addEventListener("input", () => {
    if (moneyFieldKeys.includes(key)) {
      const raw = parseMoneyValue(field.value);
      if (raw > 0) field.value = formatMoneyValue(field.value);
    }
    runCalculation();
  });
  field.addEventListener("change", runCalculation);
});

marketTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const mkt = tab.getAttribute("data-market");
    if (!mkt) return;
    state.market = mkt;
    const preset = SBC_MARKET_PRESETS.find((m) => m.id === mkt);
    if (mkt !== "custom" && preset) {
      state.transactionTaxRate = preset.transactionTaxRate;
    }
    renderMarketState();
    runCalculation();
  });
});

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyPreset(btn.getAttribute("data-preset-id"));
  });
});

resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

loadFromUrlParams();
runCalculation();
