const $ = (id) => document.getElementById(id);
const won = (v) => `${Math.round(v).toLocaleString("ko-KR")}원`;
const usd = (v) => `$${Number(v).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const pct = (v) => `${v >= 0 ? "+" : ""}${Number(v).toFixed(2)}%`;

let config = { presets: [], defaults: {} };

function n(id) {
  return Number(String($(id)?.value || "0").replace(/,/g, "")) || 0;
}

function calculate(input) {
  const grossBuyUsd = input.buyPriceUsd * input.quantity;
  const grossSellUsd = input.sellPriceUsd * input.quantity;
  const buyFeeUsd = input.includeFee ? grossBuyUsd * (input.feeRate / 100) : 0;
  const sellFeeUsd = input.includeFee ? grossSellUsd * (input.feeRate / 100) : 0;
  const buyAmountUsd = grossBuyUsd + buyFeeUsd;
  const sellAmountUsd = grossSellUsd - sellFeeUsd;
  const buyAmountKrw = buyAmountUsd * input.buyExchangeRate;
  const sellAmountKrw = sellAmountUsd * input.sellExchangeRate;
  const stockProfitUsd = sellAmountUsd - buyAmountUsd;
  const stockReturnRateUsd = buyAmountUsd > 0 ? (stockProfitUsd / buyAmountUsd) * 100 : 0;
  const totalProfitKrw = sellAmountKrw - buyAmountKrw;
  const totalReturnRateKrw = buyAmountKrw > 0 ? (totalProfitKrw / buyAmountKrw) * 100 : 0;
  const sameRateSellAmountKrw = sellAmountUsd * input.buyExchangeRate;
  const fxProfitKrw = sellAmountKrw - sameRateSellAmountKrw;
  const fxImpactRatePoint = totalReturnRateKrw - stockReturnRateUsd;
  const fxImpactRatio = totalProfitKrw !== 0 ? (fxProfitKrw / totalProfitKrw) * 100 : null;

  return {
    buyAmountUsd,
    sellAmountUsd,
    buyAmountKrw,
    sellAmountKrw,
    stockProfitUsd,
    stockReturnRateUsd,
    totalProfitKrw,
    totalReturnRateKrw,
    fxProfitKrw,
    fxImpactRatePoint,
    fxImpactRatio,
    rows: simulationRows(buyAmountKrw, sellAmountUsd),
  };
}

function simulationRows(buyAmountKrw, sellAmountUsd) {
  const rows = [];
  for (let rate = 1100; rate <= 1500; rate += 50) {
    const sellKrw = sellAmountUsd * rate;
    const profit = sellKrw - buyAmountKrw;
    rows.push({ rate, sellKrw, profit, returnRate: buyAmountKrw > 0 ? (profit / buyAmountKrw) * 100 : 0 });
  }
  return rows;
}

function readForm() {
  return {
    buyExchangeRate: n("usepBuyRate"),
    sellExchangeRate: n("usepSellRate"),
    buyPriceUsd: n("usepBuyPrice"),
    sellPriceUsd: n("usepSellPrice"),
    quantity: n("usepQuantity"),
    includeFee: $("usepIncludeFee")?.checked ?? false,
    feeRate: n("usepFeeRate"),
  };
}

function comment(result) {
  if (result.stockReturnRateUsd > 0 && result.totalReturnRateKrw < 0) {
    return "주가는 올랐지만 환율 하락 때문에 원화 기준 손실이 발생했습니다.";
  }
  if (result.stockReturnRateUsd < 0 && result.totalReturnRateKrw > 0) {
    return "주가는 하락했지만 환율 상승으로 원화 기준 수익이 발생했습니다.";
  }
  if (result.stockReturnRateUsd > result.totalReturnRateKrw) {
    return "환율 하락 또는 비용 영향으로 실제 원화 수익률이 달러 수익률보다 낮습니다.";
  }
  if (result.stockReturnRateUsd < result.totalReturnRateKrw) {
    return "환율 상승 영향으로 원화 기준 수익률이 달러 수익률보다 높습니다.";
  }
  return "환율 영향이 크지 않아 달러 수익률과 원화 수익률이 비슷합니다.";
}

function render() {
  const result = calculate(readForm());
  $("usepUsdReturn").textContent = pct(result.stockReturnRateUsd);
  $("usepKrwReturn").textContent = pct(result.totalReturnRateKrw);
  $("usepBuyKrw").textContent = won(result.buyAmountKrw);
  $("usepSellKrw").textContent = won(result.sellAmountKrw);
  $("usepFxProfit").textContent = won(result.fxProfitKrw);
  $("usepFxImpact").textContent = `${result.fxImpactRatePoint >= 0 ? "+" : ""}${result.fxImpactRatePoint.toFixed(2)}%p`;
  $("usepComment").textContent = comment(result);
  $("usepDetailBody").innerHTML = [
    ["매수 달러 총액", usd(result.buyAmountUsd)],
    ["매도 달러 총액", usd(result.sellAmountUsd)],
    ["달러 기준 손익", usd(result.stockProfitUsd)],
    ["원화 기준 손익", won(result.totalProfitKrw)],
    ["환율 영향 비중", result.fxImpactRatio === null ? "참고 불가" : pct(result.fxImpactRatio)],
  ].map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
  $("usepSimulationBody").innerHTML = result.rows
    .map((row) => `<tr><td>${row.rate.toLocaleString("ko-KR")}원</td><td>${won(row.sellKrw)}</td><td>${won(row.profit)}</td><td>${pct(row.returnRate)}</td></tr>`)
    .join("");
}

function applyPreset(id) {
  const preset = config.presets.find((item) => item.id === id);
  if (!preset) return;
  $("usepBuyRate").value = preset.buyExchangeRate;
  $("usepSellRate").value = preset.sellExchangeRate;
  $("usepBuyPrice").value = preset.buyPriceUsd;
  $("usepSellPrice").value = preset.sellPriceUsd;
  $("usepQuantity").value = preset.quantity;
  $("usepIncludeFee").checked = preset.includeFee;
  $("usepFeeRate").value = preset.feeRate;
  document.querySelectorAll("[data-usep-preset]").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.usepPreset === id));
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  const seed = $("usepConfig");
  config = seed ? JSON.parse(seed.textContent || "{}") : config;
  document.querySelectorAll("#usepForm input").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  document.querySelectorAll("[data-usep-preset]").forEach((btn) => btn.addEventListener("click", () => applyPreset(btn.dataset.usepPreset)));
  $("usepResetBtn")?.addEventListener("click", () => applyPreset(config.presets[0]?.id));
  $("usepCopyLinkBtn")?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText(window.location.href);
  });
  render();
});

