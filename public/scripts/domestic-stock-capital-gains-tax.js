const configEl = document.getElementById("domesticStockCapitalGainsTaxConfig");
const config = JSON.parse(configEl?.textContent || "{}");
const { DSCGT_RULES, DSCGT_DEFAULT_LOTS, DSCGT_SCENARIO_PRESETS } = config;

const lotListEl = document.getElementById("dscgtLotList");
const addLotBtn = document.getElementById("dscgtAddLotBtn");
const presetButtons = document.querySelectorAll(".dscgt-preset-btn");
const taxModeTabs = document.querySelectorAll(".dscgt-tax-mode-tab");
const resetBtn = document.getElementById("resetDomesticStockTaxBtn");
const copyBtn = document.getElementById("copyDomesticStockTaxLinkBtn");

const resultEls = {
  statusBadge: document.getElementById("dscgtStatusBadge"),
  statusTitle: document.getElementById("dscgtStatusTitle"),
  statusText: document.getElementById("dscgtStatusText"),
  resultSubcopy: document.getElementById("dscgtResultSubcopy"),
  totalGain: document.getElementById("dscgtTotalGainValue"),
  taxableIncome: document.getElementById("dscgtTaxableIncomeValue"),
  nationalTax: document.getElementById("dscgtNationalTaxValue"),
  totalTax: document.getElementById("dscgtTotalTaxValue"),
  afterTaxProfit: document.getElementById("dscgtAfterTaxProfitValue"),
  profitTotal: document.getElementById("dscgtProfitTotalValue"),
  lossTotal: document.getElementById("dscgtLossTotalValue"),
  netGain: document.getElementById("dscgtNetGainValue"),
  deduction: document.getElementById("dscgtDeductionValue"),
  taxableIncomeRow: document.getElementById("dscgtTaxableIncomeRowValue"),
  localTax: document.getElementById("dscgtLocalTaxValue"),
  netReceipt: document.getElementById("dscgtNetReceiptValue"),
};

const state = {
  lots: [],
  taxMode: "effective",
};

function structuredCloneFallback(value) {
  return JSON.parse(JSON.stringify(value));
}

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return structuredCloneFallback(value);
}

state.lots = clone(DSCGT_DEFAULT_LOTS || []);

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseMoneyValue(raw) {
  const value = String(raw || "").replace(/[^\d.-]/g, "");
  return Math.max(0, Math.round(Number(value) || 0));
}

function formatMoneyInput(value) {
  return parseMoneyValue(value).toLocaleString("ko-KR");
}

function parseNumberValue(raw) {
  return Math.max(0, Number(String(raw || "").replace(/[^\d.]/g, "")) || 0);
}

function fmtWon(value) {
  if (!Number.isFinite(value)) return "-";
  const rounded = Math.round(value);
  const abs = Math.abs(rounded);
  const sign = rounded < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  if (man > 0) return `${sign}${man.toLocaleString("ko-KR")}만원`;
  return "0원";
}

function getTradeTypeLabel(value) {
  if (value === "otc") return "장외거래";
  if (value === "unlisted") return "비상장주식";
  return "상장주식 장내거래";
}

function isAutoMajorShareholder(lot, buyAmount, sellAmount) {
  if (lot.tradeType !== "listed") return false;
  return Math.max(buyAmount, sellAmount) >= DSCGT_RULES.majorShareholderThresholdWon;
}

function isTaxableLot(lot, buyAmount, sellAmount) {
  return lot.tradeType === "unlisted"
    || lot.tradeType === "otc"
    || (lot.tradeType === "listed" && (lot.isMajorShareholder || isAutoMajorShareholder(lot, buyAmount, sellAmount)));
}

function getTaxReason(lot, buyAmount, sellAmount) {
  if (lot.tradeType === "unlisted") return "비상장주식";
  if (lot.tradeType === "otc") return "장외거래";
  if (isAutoMajorShareholder(lot, buyAmount, sellAmount)) return "50억원 이상 대주주 가능성";
  if (lot.isMajorShareholder) return "대주주";
  return "일반 상장주식 장내거래";
}

function getLotRate(lot, taxableIncome) {
  if (lot.holdingPeriod === "under1y") return DSCGT_RULES.shortTermRate;
  if (taxableIncome > 300000000) return DSCGT_RULES.surchargeRate;
  return DSCGT_RULES.generalRate;
}

function calculateLot(lot) {
  const buyAmount = lot.averageBuyPrice * lot.quantity;
  const sellAmount = lot.sellPrice * lot.quantity;
  const capitalGain = sellAmount - buyAmount - lot.buyFee - lot.sellFee - lot.extraCost;
  const autoMajorShareholder = isAutoMajorShareholder(lot, buyAmount, sellAmount);
  return {
    ...lot,
    buyAmount,
    sellAmount,
    capitalGain,
    autoMajorShareholder,
    isTaxable: isTaxableLot(lot, buyAmount, sellAmount),
    reason: getTaxReason(lot, buyAmount, sellAmount),
  };
}

function calculate() {
  const rows = state.lots.map(calculateLot);
  const taxableRows = rows.filter((row) => row.isTaxable);
  const profitTotal = taxableRows.reduce((sum, row) => sum + Math.max(0, row.capitalGain), 0);
  const lossTotal = taxableRows.reduce((sum, row) => sum + Math.min(0, row.capitalGain), 0);
  const netGain = profitTotal + lossTotal;
  const taxableIncome = Math.max(0, netGain - DSCGT_RULES.basicDeduction);
  const representativeRate = taxableRows.reduce((rate, row) => Math.max(rate, getLotRate(row, taxableIncome)), 0);
  const nationalTax = taxableIncome * representativeRate;
  const localTax = state.taxMode === "effective" ? nationalTax * DSCGT_RULES.localTaxRate : 0;
  const totalTax = nationalTax + localTax;
  const totalGain = rows.reduce((sum, row) => sum + row.capitalGain, 0);
  const totalSellAmount = rows.reduce((sum, row) => sum + row.sellAmount, 0);
  const totalSellFee = rows.reduce((sum, row) => sum + row.sellFee, 0);
  const afterTaxProfit = netGain - totalTax;
  const netReceipt = totalSellAmount - totalSellFee - totalTax;

  return {
    rows,
    taxableRows,
    profitTotal,
    lossTotal,
    netGain,
    taxableIncome,
    nationalTax,
    localTax,
    totalTax,
    totalGain,
    afterTaxProfit,
    netReceipt,
    representativeRate,
    isTaxable: taxableRows.length > 0,
  };
}

function readLotsFromDom() {
  const lotCards = [...document.querySelectorAll(".dscgt-lot-card")];
  state.lots = lotCards.map((card, index) => ({
    id: card.dataset.lotId || `lot-${index + 1}`,
    assetName: card.querySelector("[data-field='assetName']")?.value?.trim() || `종목 ${index + 1}`,
    tradeType: card.querySelector("[data-field='tradeType']")?.value || "listed",
    averageBuyPrice: parseMoneyValue(card.querySelector("[data-field='averageBuyPrice']")?.value),
    sellPrice: parseMoneyValue(card.querySelector("[data-field='sellPrice']")?.value),
    quantity: parseNumberValue(card.querySelector("[data-field='quantity']")?.value),
    buyFee: parseMoneyValue(card.querySelector("[data-field='buyFee']")?.value),
    sellFee: parseMoneyValue(card.querySelector("[data-field='sellFee']")?.value),
    extraCost: parseMoneyValue(card.querySelector("[data-field='extraCost']")?.value),
    isMajorShareholder: card.querySelector("[data-field='isMajorShareholder']")?.checked || false,
    holdingPeriod: card.querySelector("[data-field='holdingPeriod']")?.value || "over1y",
  }));
}

function renderLots() {
  if (!lotListEl) return;
  lotListEl.textContent = "";
  state.lots.forEach((lot, index) => {
    const card = document.createElement("article");
    card.className = "dscgt-lot-card";
    card.dataset.lotId = lot.id || `lot-${index + 1}`;
    card.innerHTML = `
      <div class="dscgt-lot-card__head">
        <strong>종목 ${index + 1}</strong>
        <button type="button" class="dscgt-remove-lot" ${state.lots.length <= 1 ? "disabled" : ""}>삭제</button>
      </div>
      <div class="dscgt-lot-grid">
        <label class="field"><span>종목명</span><input class="input-number" data-field="assetName" type="text" value="${escapeAttr(lot.assetName)}"></label>
        <label class="field"><span>거래 유형</span><select class="select" data-field="tradeType">
          <option value="listed" ${lot.tradeType === "listed" ? "selected" : ""}>상장주식 장내거래</option>
          <option value="otc" ${lot.tradeType === "otc" ? "selected" : ""}>상장주식 장외거래</option>
          <option value="unlisted" ${lot.tradeType === "unlisted" ? "selected" : ""}>비상장주식</option>
        </select></label>
        <label class="field"><span>평균 매수가</span><input class="input-number" data-field="averageBuyPrice" inputmode="numeric" value="${lot.averageBuyPrice.toLocaleString("ko-KR")}"></label>
        <label class="field"><span>예상 매도가</span><input class="input-number" data-field="sellPrice" inputmode="numeric" value="${lot.sellPrice.toLocaleString("ko-KR")}"></label>
        <label class="field"><span>수량</span><input class="input-number" data-field="quantity" type="number" min="0" step="0.0001" value="${lot.quantity}"></label>
        <label class="field"><span>보유 기간</span><select class="select" data-field="holdingPeriod">
          <option value="over1y" ${lot.holdingPeriod === "over1y" ? "selected" : ""}>1년 이상</option>
          <option value="under1y" ${lot.holdingPeriod === "under1y" ? "selected" : ""}>1년 미만</option>
        </select></label>
        <label class="field"><span>매수 수수료</span><input class="input-number" data-field="buyFee" inputmode="numeric" value="${lot.buyFee.toLocaleString("ko-KR")}"></label>
        <label class="field"><span>매도 수수료</span><input class="input-number" data-field="sellFee" inputmode="numeric" value="${lot.sellFee.toLocaleString("ko-KR")}"></label>
        <label class="field"><span>기타 필요경비</span><input class="input-number" data-field="extraCost" inputmode="numeric" value="${lot.extraCost.toLocaleString("ko-KR")}"></label>
        <label class="dscgt-check"><input data-field="isMajorShareholder" type="checkbox" ${lot.isMajorShareholder ? "checked" : ""}><span>대주주 직접 체크</span></label>
      </div>
      <p class="dscgt-lot-card__status" data-lot-status>${getTradeTypeLabel(lot.tradeType)} 기준 확인 중</p>
    `;
    lotListEl.appendChild(card);
  });
}

function renderTaxModeState() {
  taxModeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.getAttribute("data-mode") === state.taxMode);
  });
}

function renderPresetState() {
  presetButtons.forEach((button) => {
    const preset = DSCGT_SCENARIO_PRESETS.find((item) => item.id === button.getAttribute("data-preset-id"));
    const firstPresetLot = preset?.lots?.[0];
    const firstStateLot = state.lots[0];
    const isActive = Boolean(firstPresetLot && firstStateLot && preset.lots.length === state.lots.length
      && firstPresetLot.tradeType === firstStateLot.tradeType
      && firstPresetLot.isMajorShareholder === firstStateLot.isMajorShareholder);
    button.classList.toggle("is-active", isActive);
  });
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function updateLotStatuses(result) {
  result.rows.forEach((row, index) => {
    const status = document.querySelectorAll("[data-lot-status]")[index];
    if (!status) return;
    const estimatedTradeAmount = Math.max(row.buyAmount, row.sellAmount);
    status.textContent = row.isTaxable
      ? `${row.reason} 기준 과세 대상 가능성이 높습니다. 예상 양도차익 ${fmtWon(row.capitalGain)}`
      : `양도소득세 0원으로 보는 입력입니다. 상장주식 장내거래, 대주주 직접 체크 꺼짐, 추정 거래금액 ${fmtWon(estimatedTradeAmount)}로 50억원 미만이어서 과세대상 손익에서 제외했습니다. 실제 지분율 기준 대주주라면 체크를 켜세요.`;
    status.classList.toggle("is-taxable", row.isTaxable);
  });
}

function updateUI(result) {
  const statusClass = result.isTaxable ? "is-taxable" : "is-taxfree";
  resultEls.statusBadge?.classList.remove("is-taxable", "is-taxfree");
  resultEls.statusBadge?.classList.add(statusClass);
  setText(resultEls.statusBadge, result.isTaxable ? "과세 가능성 있음" : "비과세 가능성 높음");
  setText(
    resultEls.statusTitle,
    result.isTaxable ? "대주주·장외·비상장 기준으로 과세 대상일 수 있습니다" : "현재 입력 기준 과세 대상이 아닐 수 있습니다"
  );
  setText(
    resultEls.statusText,
    result.isTaxable
      ? "과세대상 주식의 손익을 통산한 뒤 기본공제 250만원을 차감해 예상 세액을 계산했습니다."
      : "국내 상장주식 장내거래 소액주주는 양도소득세 계산 대상이 아닐 수 있어 예상 세액을 0원으로 표시합니다. 대주주라면 종목 입력의 대주주 직접 체크를 켜세요."
  );
  setText(resultEls.resultSubcopy, `${state.lots.length}개 종목 입력 · 과세대상 ${result.taxableRows.length}개 · ${state.taxMode === "effective" ? "지방소득세 포함" : "국세만"} 기준`);
  setText(resultEls.totalGain, fmtWon(result.totalGain));
  setText(resultEls.taxableIncome, fmtWon(result.taxableIncome));
  setText(resultEls.nationalTax, fmtWon(result.nationalTax));
  setText(resultEls.totalTax, fmtWon(result.totalTax));
  setText(resultEls.afterTaxProfit, fmtWon(result.afterTaxProfit));
  setText(resultEls.profitTotal, fmtWon(result.profitTotal));
  setText(resultEls.lossTotal, fmtWon(result.lossTotal));
  setText(resultEls.netGain, fmtWon(result.netGain));
  setText(resultEls.deduction, fmtWon(Math.min(Math.max(result.netGain, 0), DSCGT_RULES.basicDeduction)));
  setText(resultEls.taxableIncomeRow, fmtWon(result.taxableIncome));
  setText(resultEls.localTax, fmtWon(result.localTax));
  setText(resultEls.netReceipt, fmtWon(result.netReceipt));
  updateLotStatuses(result);
}

function syncUrlParams() {
  const params = new URLSearchParams();
  params.set("mode", state.taxMode);
  params.set("lots", String(state.lots.length));
  const taxableKind = state.lots.some((lot) => lot.isMajorShareholder) ? "major" : state.lots.some((lot) => lot.tradeType !== "listed") ? "taxable" : "small";
  params.set("taxable", taxableKind);
  history.replaceState(null, "", `?${params.toString()}`);
}

function runCalculation() {
  readLotsFromDom();
  renderTaxModeState();
  renderPresetState();
  const result = calculate();
  updateUI(result);
  syncUrlParams();
}

function applyPreset(presetId) {
  const preset = DSCGT_SCENARIO_PRESETS.find((item) => item.id === presetId);
  if (!preset) return;
  state.lots = clone(preset.lots);
  renderLots();
  runCalculation();
}

function addLot() {
  readLotsFromDom();
  const last = state.lots[state.lots.length - 1] || DSCGT_DEFAULT_LOTS[0];
  state.lots.push({
    ...clone(last),
    id: `lot-${Date.now()}`,
    assetName: `종목 ${state.lots.length + 1}`,
  });
  renderLots();
  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (!copyBtn) return;
    const original = copyBtn.textContent;
    copyBtn.textContent = "링크 복사됨";
    setTimeout(() => {
      copyBtn.textContent = original;
    }, 1500);
  } catch (error) {
    console.error(error);
  }
}

function resetAll() {
  state.lots = clone(DSCGT_DEFAULT_LOTS);
  state.taxMode = "effective";
  renderLots();
  runCalculation();
}

lotListEl?.addEventListener("input", (event) => {
  if (event.target?.matches("[data-field='averageBuyPrice'], [data-field='sellPrice'], [data-field='buyFee'], [data-field='sellFee'], [data-field='extraCost']")) {
    event.target.value = formatMoneyInput(event.target.value);
  }
  runCalculation();
});

lotListEl?.addEventListener("change", runCalculation);
lotListEl?.addEventListener("click", (event) => {
  const button = event.target?.closest(".dscgt-remove-lot");
  if (!button) return;
  readLotsFromDom();
  const card = button.closest(".dscgt-lot-card");
  const id = card?.dataset.lotId;
  state.lots = state.lots.filter((lot) => lot.id !== id);
  if (state.lots.length === 0) state.lots = clone(DSCGT_DEFAULT_LOTS);
  renderLots();
  runCalculation();
});

taxModeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const mode = tab.getAttribute("data-mode");
    if (mode === "effective" || mode === "incomeTaxOnly") {
      state.taxMode = mode;
      runCalculation();
    }
  });
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.getAttribute("data-preset-id")));
});

addLotBtn?.addEventListener("click", addLot);
resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

renderLots();
runCalculation();
