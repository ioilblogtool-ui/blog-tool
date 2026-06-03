(() => {
  const configEl = document.getElementById("sbfcConfig");
  const root = document.querySelector("[data-sbfc-calculator]");
  if (!configEl || !root) return;

  const { brokers } = JSON.parse(configEl.textContent || "{}");
  if (!Array.isArray(brokers) || brokers.length === 0) return;

  const AGENCY_FEE_RATE = 0.000041; // 유관기관 제비용 (국내주식)
  const TRANSACTION_TAX_RATE = 0.0018; // 증권거래세 (국내주식 매도)

  const state = {
    type: "domestic",
    tradeAmount: 1_000_000,
    monthlyCount: 4,
    selected: Object.fromEntries(brokers.map((b) => [b.id, b.defaultSelected])),
  };

  const els = {
    toggleBtns: root.querySelectorAll("[data-sbfc-type]"),
    tradeAmount: root.querySelector("[data-sbfc-trade-amount]"),
    amountHint: root.querySelector("[data-sbfc-amount-hint]"),
    monthlyCount: root.querySelector("[data-sbfc-monthly-count]"),
    overseasNote: document.querySelector("[data-sbfc-overseas-note]"),
    overseasCol: document.querySelector("[data-sbfc-overseas-col]"),
    brokerChecks: root.querySelectorAll("[data-sbfc-broker-check]"),
    bestBroker: document.querySelector("[data-sbfc-best-broker]"),
    bestFee: document.querySelector("[data-sbfc-best-fee]"),
    maxGap: document.querySelector("[data-sbfc-max-gap]"),
    annualVolume: document.querySelector("[data-sbfc-annual-volume]"),
    volumeDesc: document.querySelector("[data-sbfc-volume-desc]"),
    tableBody: document.querySelector("[data-sbfc-table-body]"),
    // 1회 매도 수수료
    sellCommission: document.querySelector("[data-sbfc-sell-commission]"),
    sellAgency: document.querySelector("[data-sbfc-sell-agency]"),
    sellTax: document.querySelector("[data-sbfc-sell-tax]"),
    sellTaxWrap: document.querySelector("[data-sbfc-sell-tax-wrap]"),
    sellTotal: document.querySelector("[data-sbfc-sell-total]"),
    sellBrokerName: document.querySelector("[data-sbfc-sell-broker-name]"),
    resetBtn: document.getElementById("sbfcResetBtn"),
    copyBtn: document.getElementById("sbfcCopyLinkBtn"),
  };

  const fmt = (n) => {
    const abs = Math.abs(Math.round(n));
    if (abs >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억 원`;
    if (abs >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
    return `${Math.round(n).toLocaleString("ko-KR")}원`;
  };

  const fmtRate = (r) => `${(r * 100).toFixed(3)}%`;

  const parseAmount = (v) => Number(String(v).replace(/[^\d]/g, "")) || 0;

  const fmtInput = (n) => n.toLocaleString("ko-KR");

  function calcAnnualFee(broker) {
    const annual = state.tradeAmount * state.monthlyCount * 12;
    if (state.type === "domestic") {
      const commFee = annual * broker.domesticRate;
      const agencyFee = annual * AGENCY_FEE_RATE;
      return { commFee, agencyFee, fxFee: 0, total: commFee + agencyFee, rate: broker.domesticRate };
    } else {
      const commFee = annual * broker.overseasRate;
      const fxFee = annual * broker.fxSpread;
      return { commFee, agencyFee: 0, fxFee, total: commFee + fxFee, rate: broker.overseasRate };
    }
  }

  function render() {
    const active = brokers.filter((b) => state.selected[b.id]);
    if (active.length === 0) {
      if (els.bestBroker) els.bestBroker.textContent = "증권사를 선택하세요";
      if (els.bestFee) els.bestFee.textContent = "—";
      if (els.maxGap) els.maxGap.textContent = "—";
      if (els.tableBody) els.tableBody.innerHTML = "";
      return;
    }

    const results = active
      .map((b) => ({ broker: b, ...calcAnnualFee(b) }))
      .sort((a, b) => a.total - b.total);

    const best = results[0];
    const worst = results[results.length - 1];
    const annualVolume = state.tradeAmount * state.monthlyCount * 12;

    if (els.bestBroker) els.bestBroker.textContent = best.broker.name;
    if (els.bestFee) els.bestFee.textContent = `연간 ${fmt(best.total)}`;
    if (els.maxGap) els.maxGap.textContent = results.length > 1 ? fmt(worst.total - best.total) : "—";
    if (els.annualVolume) els.annualVolume.textContent = fmt(annualVolume);
    if (els.volumeDesc) {
      els.volumeDesc.textContent = `월 ${state.monthlyCount}회 × ${fmt(state.tradeAmount)} × 12개월`;
    }

    if (els.overseasNote) {
      els.overseasNote.style.display = state.type === "overseas" ? "flex" : "none";
    }
    if (els.overseasCol) {
      els.overseasCol.style.display = state.type === "overseas" ? "" : "none";
    }

    if (els.tableBody) {
      els.tableBody.innerHTML = results
        .map((r, i) => {
          const isBest = i === 0;
          const note = state.type === "domestic" ? r.broker.domesticNote : r.broker.overseasNote;
          const rateVal = state.type === "domestic" ? r.broker.domesticRate : r.broker.overseasRate;
          return `
            <tr class="${isBest ? "sbfc-row--best" : ""}">
              <td>
                ${isBest ? '<span class="sbfc-rank-badge">최저</span>' : `<span class="sbfc-rank">${i + 1}위</span>`}
                ${r.broker.name}
              </td>
              <td>${fmtRate(rateVal)}</td>
              <td class="sbfc-td-fee">${fmt(r.total)}</td>
              ${state.type === "overseas" ? `<td class="sbfc-td-fx">${fmt(r.fxFee)}</td>` : ""}
              <td class="sbfc-td-note">${note}</td>
            </tr>
          `;
        })
        .join("");
    }

    // 1회 매도 수수료 계산 (선택된 증권사 중 최저 기준)
    if (active.length > 0) {
      const top = results[0]; // 최저 수수료 증권사
      const amt = state.tradeAmount;
      const isDomestic = state.type === "domestic";
      const commRate = isDomestic ? top.broker.domesticRate : top.broker.overseasRate;
      const commission = amt * commRate;
      const agency = isDomestic ? amt * AGENCY_FEE_RATE : 0;
      const txTax = isDomestic ? amt * TRANSACTION_TAX_RATE : 0;
      const total = commission + agency + txTax;

      if (els.sellCommission) els.sellCommission.textContent = fmt(commission) + ` (${fmtRate(commRate)})`;
      if (els.sellAgency) els.sellAgency.textContent = fmt(agency);
      if (els.sellTaxWrap) els.sellTaxWrap.style.display = isDomestic ? "" : "none";
      if (els.sellTax) els.sellTax.textContent = fmt(txTax);
      if (els.sellTotal) els.sellTotal.textContent = fmt(total);
      if (els.sellBrokerName) els.sellBrokerName.textContent = `${top.broker.name} 기준`;
    }
  }

  // 투자 유형 토글
  els.toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.type = btn.dataset.sbfcType;
      els.toggleBtns.forEach((b) => b.classList.toggle("active", b === btn));
      render();
      saveUrl();
    });
  });

  // 거래금액 입력
  if (els.tradeAmount) {
    els.tradeAmount.addEventListener("input", () => {
      const val = parseAmount(els.tradeAmount.value);
      state.tradeAmount = val;
      els.tradeAmount.value = fmtInput(val);
      if (els.amountHint) {
        if (val >= 100_000_000) {
          els.amountHint.textContent = `${(val / 100_000_000).toFixed(2)}억 원`;
        } else if (val >= 10_000) {
          els.amountHint.textContent = `${Math.round(val / 10_000).toLocaleString("ko-KR")}만 원`;
        } else {
          els.amountHint.textContent = "";
        }
      }
      render();
      saveUrl();
    });
    els.tradeAmount.addEventListener("focus", () => {
      els.tradeAmount.value = String(state.tradeAmount);
    });
    els.tradeAmount.addEventListener("blur", () => {
      els.tradeAmount.value = fmtInput(state.tradeAmount);
    });
  }

  // 월 거래 횟수
  if (els.monthlyCount) {
    els.monthlyCount.addEventListener("input", () => {
      state.monthlyCount = Math.max(1, parseInt(els.monthlyCount.value) || 1);
      render();
      saveUrl();
    });
  }

  // 증권사 체크박스
  els.brokerChecks.forEach((chk) => {
    chk.addEventListener("change", () => {
      state.selected[chk.dataset.sbfcBrokerCheck] = chk.checked;
      render();
      saveUrl();
    });
  });

  // URL 상태 저장/복원
  function saveUrl() {
    const params = new URLSearchParams();
    params.set("type", state.type);
    params.set("amount", state.tradeAmount);
    params.set("count", state.monthlyCount);
    params.set("sel", brokers.filter((b) => state.selected[b.id]).map((b) => b.id).join(","));
    history.replaceState(null, "", `?${params.toString()}`);
  }

  function loadUrl() {
    const params = new URLSearchParams(location.search);
    if (params.has("type") && ["domestic", "overseas"].includes(params.get("type"))) {
      state.type = params.get("type");
      els.toggleBtns.forEach((b) => b.classList.toggle("active", b.dataset.sbfcType === state.type));
    }
    if (params.has("amount")) {
      const v = parseInt(params.get("amount")) || 1_000_000;
      state.tradeAmount = v;
      if (els.tradeAmount) els.tradeAmount.value = fmtInput(v);
    }
    if (params.has("count")) {
      const v = Math.max(1, parseInt(params.get("count")) || 4);
      state.monthlyCount = v;
      if (els.monthlyCount) els.monthlyCount.value = v;
    }
    if (params.has("sel")) {
      const ids = params.get("sel").split(",");
      brokers.forEach((b) => { state.selected[b.id] = ids.includes(b.id); });
      els.brokerChecks.forEach((chk) => {
        chk.checked = state.selected[chk.dataset.sbfcBrokerCheck] ?? false;
      });
    }
  }

  // 리셋
  if (els.resetBtn) {
    els.resetBtn.addEventListener("click", () => {
      state.type = "domestic";
      state.tradeAmount = 1_000_000;
      state.monthlyCount = 4;
      brokers.forEach((b) => { state.selected[b.id] = b.defaultSelected; });
      els.toggleBtns.forEach((b) => b.classList.toggle("active", b.dataset.sbfcType === "domestic"));
      if (els.tradeAmount) els.tradeAmount.value = fmtInput(1_000_000);
      if (els.monthlyCount) els.monthlyCount.value = 4;
      els.brokerChecks.forEach((chk) => {
        chk.checked = state.selected[chk.dataset.sbfcBrokerCheck] ?? false;
      });
      history.replaceState(null, "", location.pathname);
      render();
    });
  }

  // 링크 복사
  if (els.copyBtn) {
    els.copyBtn.addEventListener("click", () => {
      saveUrl();
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadUrl();
  render();
})();
