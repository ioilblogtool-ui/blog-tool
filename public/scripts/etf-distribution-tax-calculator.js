(() => {
  const cfg = document.getElementById("edtcConfig");
  if (!cfg) return;
  const { types } = JSON.parse(cfg.textContent || "{}");

  const state = {
    distributionMonthly: 500_000,
    typeId: "kr-overseas",
    isaMode: "off",
  };

  const fmtKrw = n => {
    n = Math.round(n);
    if (Math.abs(n) >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
    return `${n.toLocaleString("ko-KR")}원`;
  };
  const parse = v => Number(String(v).replace(/[^\d]/g, "")) || 0;

  const ISA_LIMITS = { off: 0, general: 2_000_000, seomin: 4_000_000 };
  const ISA_OVER_RATE = 0.099;

  const els = {
    distribution: document.querySelector("[data-edtc-distribution]"),
    typeRadios: document.querySelectorAll("[data-edtc-type]"),
    typeLabels: document.querySelectorAll("[data-edtc-type-label]"),
    isaBtns: document.querySelectorAll("[data-edtc-isa]"),
    isaNote: document.querySelector("[data-edtc-isa-note]"),
    isaCard: document.querySelector("[data-edtc-isa-card]"),
    netMonthly: document.querySelector("[data-edtc-net-monthly]"),
    netAnnual: document.querySelector("[data-edtc-net-annual]"),
    taxMonthly: document.querySelector("[data-edtc-tax-monthly]"),
    taxRateLabel: document.querySelector("[data-edtc-tax-rate-label]"),
    isaSaving: document.querySelector("[data-edtc-isa-saving]"),
    compareTable: document.querySelector("[data-edtc-compare-table]"),
    resetBtn: document.getElementById("edtcResetBtn"),
    copyBtn: document.getElementById("edtcCopyBtn"),
  };

  function getType() { return types.find(t => t.id === state.typeId) || types[0]; }

  function calcNet(monthly, taxRate, isaMode) {
    const annual = monthly * 12;
    if (isaMode === "off") {
      const tax = annual * taxRate;
      return { net: annual - tax, tax, rate: taxRate };
    }
    const limit = ISA_LIMITS[isaMode] || 0;
    const taxFree = Math.min(annual, limit);
    const over = Math.max(0, annual - limit);
    const tax = over * ISA_OVER_RATE;
    return { net: annual - tax, tax, rate: over > 0 ? ISA_OVER_RATE : 0, taxFree };
  }

  function render() {
    const type = getType();
    const monthly = state.distributionMonthly;
    const annual = monthly * 12;
    const { net, tax, rate } = calcNet(monthly, type.taxRate, state.isaMode);

    if (els.netMonthly) els.netMonthly.textContent = fmtKrw(net / 12);
    if (els.netAnnual) els.netAnnual.textContent = `연간 ${fmtKrw(net)}`;
    if (els.taxMonthly) els.taxMonthly.textContent = fmtKrw(tax / 12);
    if (els.taxRateLabel) els.taxRateLabel.textContent = `세율 ${(rate * 100).toFixed(1)}% 적용`;

    // ISA 절세 효과
    const normalTax = annual * type.taxRate;
    const isaAnnual = calcNet(monthly, type.taxRate, state.isaMode).tax;
    const saving = normalTax - isaAnnual;
    if (els.isaSaving) {
      if (state.isaMode !== "off" && type.id !== "us-listed") {
        els.isaSaving.textContent = saving > 0 ? `+${fmtKrw(saving)}` : "0원";
        if (els.isaCard) els.isaCard.style.display = "";
      } else {
        if (els.isaCard) els.isaCard.style.display = state.typeId === "us-listed" ? "none" : "";
        if (els.isaSaving) els.isaSaving.textContent = "0원 (비활성)";
      }
    }

    // ISA 안내
    const usListed = state.typeId === "us-listed";
    if (els.isaNote) {
      els.isaNote.textContent = usListed
        ? "미국 상장 ETF는 ISA 계좌 편입이 불가합니다."
        : "ISA 계좌 일반형: 비과세 200만원, 서민형: 비과세 400만원";
    }
    els.isaBtns.forEach(b => {
      if (usListed && b.dataset.edtcIsa !== "off") b.disabled = true;
      else b.disabled = false;
    });

    // 계좌별 비교 표
    if (els.compareTable) {
      const rows = [
        { label: "일반 계좌", taxRate: type.taxRate, isa: "off" },
        { label: "ISA 일반형", taxRate: type.taxRate, isa: "general" },
        { label: "ISA 서민형", taxRate: type.taxRate, isa: "seomin" },
      ];
      els.compareTable.innerHTML = `
        <div class="edtc-ct-row edtc-ct-row--head"><span>계좌</span><span>월 세후</span><span>연간 세금</span></div>
        ${rows.map(r => {
          const c = calcNet(monthly, r.taxRate, r.isa);
          const isActive = state.isaMode === r.isa;
          const disabled = usListed && r.isa !== "off";
          return `<div class="edtc-ct-row${isActive ? " edtc-ct-row--active" : ""}${disabled ? " edtc-ct-row--disabled" : ""}">
            <span>${r.label}${disabled ? " (불가)" : ""}</span>
            <span>${fmtKrw(c.net / 12)}</span>
            <span>${fmtKrw(c.tax)}</span>
          </div>`;
        }).join("")}
      `;
    }
  }

  if (els.distribution) {
    els.distribution.addEventListener("input", () => {
      state.distributionMonthly = parse(els.distribution.value);
      els.distribution.value = state.distributionMonthly.toLocaleString("ko-KR");
      render();
    });
    els.distribution.addEventListener("focus", () => { els.distribution.value = String(state.distributionMonthly); });
    els.distribution.addEventListener("blur", () => { els.distribution.value = state.distributionMonthly.toLocaleString("ko-KR"); });
  }

  els.typeRadios.forEach(r => {
    r.addEventListener("change", () => {
      state.typeId = r.value;
      els.typeLabels.forEach(l => l.classList.toggle("active", l.dataset.edtcTypeLabel === state.typeId));
      if (state.typeId === "us-listed" && state.isaMode !== "off") {
        state.isaMode = "off";
        els.isaBtns.forEach(b => b.classList.toggle("active", b.dataset.edtcIsa === "off"));
      }
      render();
    });
  });

  els.isaBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (state.typeId === "us-listed" && btn.dataset.edtcIsa !== "off") return;
      state.isaMode = btn.dataset.edtcIsa;
      els.isaBtns.forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });

  if (els.resetBtn) els.resetBtn.addEventListener("click", () => {
    state.distributionMonthly = 500_000; state.typeId = "kr-overseas"; state.isaMode = "off";
    if (els.distribution) els.distribution.value = "500,000";
    els.typeRadios.forEach(r => { r.checked = r.value === "kr-overseas"; });
    els.typeLabels.forEach(l => l.classList.toggle("active", l.dataset.edtcTypeLabel === "kr-overseas"));
    els.isaBtns.forEach(b => b.classList.toggle("active", b.dataset.edtcIsa === "off"));
    render();
  });

  if (els.copyBtn) els.copyBtn.addEventListener("click", () => navigator.clipboard.writeText(location.href).catch(() => {}));

  render();
})();
