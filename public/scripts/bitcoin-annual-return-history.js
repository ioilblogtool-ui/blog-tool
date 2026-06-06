(function () {
  const page = document.querySelector('[data-report="bitcoin-annual-return-history"]');
  if (!page) return;

  const currentPrice = Number(page.dataset.currentPrice) || 104000;
  const simulatorData = JSON.parse(page.dataset.simulator || "[]");

  const yearSelect = document.getElementById("btc-sim-year");
  const amountInput = document.getElementById("btc-sim-amount");
  const elBtcAmount = document.getElementById("btc-sim-btc-amount");
  const elCurrentKrw = document.getElementById("btc-sim-current-krw");
  const elMultiple = document.getElementById("btc-sim-multiple");
  const elReturnPct = document.getElementById("btc-sim-return-pct");

  function formatKrw(won) {
    if (won >= 1e12) return (won / 1e12).toFixed(1) + "조 원";
    if (won >= 1e8) return Math.round(won / 1e8) + "억 원";
    if (won >= 1e4) return Math.round(won / 1e4) + "만 원";
    return won.toLocaleString() + "원";
  }

  function formatUsdShort(v) {
    if (v >= 1000) return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    return "$" + v.toFixed(4);
  }

  // KRW/USD 환율 참고값 (계산용 고정 환율 — 실제 환율과 다름)
  const KRW_PER_USD = 1380;

  function calculate() {
    const selectedYear = Number(yearSelect.value);
    const investAmountKrw = Number(amountInput.value) || 1000000;

    const entry = simulatorData.find((d) => d.year === selectedYear);
    if (!entry) return;

    const entryPriceUsd = entry.startPrice;
    const investAmountUsd = investAmountKrw / KRW_PER_USD;

    const btcAcquired = investAmountUsd / entryPriceUsd;
    const currentValueUsd = btcAcquired * currentPrice;
    const currentValueKrw = currentValueUsd * KRW_PER_USD;
    const multiple = currentValueKrw / investAmountKrw;
    const returnPct = ((currentValueKrw - investAmountKrw) / investAmountKrw) * 100;

    elBtcAmount.textContent = btcAcquired.toFixed(6) + " BTC";
    elCurrentKrw.textContent = formatKrw(Math.round(currentValueKrw));

    if (multiple >= 2) {
      elMultiple.textContent = multiple.toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "배";
      elMultiple.className = "btc-positive";
    } else if (multiple < 1) {
      elMultiple.textContent = multiple.toFixed(2) + "배";
      elMultiple.className = "btc-negative";
    } else {
      elMultiple.textContent = multiple.toFixed(2) + "배";
      elMultiple.className = "";
    }

    const sign = returnPct >= 0 ? "+" : "";
    elReturnPct.textContent = sign + returnPct.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "%";
    elReturnPct.className = returnPct >= 0 ? "btc-positive" : "btc-negative";
  }

  if (yearSelect && amountInput) {
    yearSelect.addEventListener("change", calculate);
    amountInput.addEventListener("input", calculate);
    // 기본 선택을 2020년으로
    const defaultOption = [...yearSelect.options].find((o) => o.value === "2020");
    if (defaultOption) {
      yearSelect.value = "2020";
    }
    calculate();
  }
})();
