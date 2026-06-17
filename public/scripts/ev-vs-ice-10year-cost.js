(function () {
  const cfg = JSON.parse(document.getElementById("eviConfig").textContent);
  let state = { ...cfg.defaults };
  let chart = null;

  const fmt = (v) => Math.round(v).toLocaleString("ko-KR") + "만원";
  const EV_EFFICIENCY = 6.0; // km/kWh

  function getSubsidy() {
    const sub = cfg.subsidies[state.region] || { national: 650, local: 0 };
    return sub.national + sub.local;
  }

  function calcEvAnnualCharge() {
    const totalKwh = state.annualKm / EV_EFFICIENCY;
    const homeKwh = totalKwh * state.homeChargePct / 100;
    const publicKwh = totalKwh * (1 - state.homeChargePct / 100);
    return (homeKwh * state.homeChargeRate + publicKwh * state.publicChargeRate) / 10000;
  }

  function calcIceAnnualFuel() {
    return state.annualKm / state.iceFuelEff * state.iceFuelPrice / 10000;
  }

  function calcYearly() {
    const subsidy = getSubsidy();
    const evNetPrice = state.evPrice - subsidy;
    const evTax = evNetPrice * 0.07;
    const evAnnualCharge = calcEvAnnualCharge();
    const iceFuel = calcIceAnnualFuel();
    const iceTax = state.icePrice * 0.07;

    const evYearly = [], iceYearly = [];
    for (let y = 1; y <= state.holdYears; y++) {
      let evCumul = evNetPrice + evTax + evAnnualCharge * y + state.evInsuranceAnnual * y;
      if (state.includeBatteryReplace && y >= 10) evCumul += 1000;
      evYearly.push(evCumul);
      const iceCumul = state.icePrice + iceTax + (iceFuel + state.iceMaintenanceAnnual + state.iceInsuranceAnnual) * y;
      iceYearly.push(iceCumul);
    }
    return { evYearly, iceYearly, evNetPrice, evTax, evAnnualCharge, iceFuel, iceTax, subsidy };
  }

  function findBreakEven(evY, iceY) {
    for (let i = 0; i < evY.length; i++) {
      if (evY[i] <= iceY[i]) return i + 1;
    }
    return null;
  }

  function render(data) {
    const { evYearly, iceYearly, evNetPrice, evTax, evAnnualCharge, iceFuel, iceTax, subsidy } = data;
    const evTotal = evYearly[evYearly.length - 1];
    const iceTotal = iceYearly[iceYearly.length - 1];
    const diff = evTotal - iceTotal;
    const breakEven = findBreakEven(evYearly, iceYearly);

    document.getElementById("eviEvTotal").textContent = fmt(evTotal);
    document.getElementById("eviIceTotal").textContent = fmt(iceTotal);
    document.getElementById("eviEvSub").textContent = `보조금 ${fmt(subsidy)} 차감 후`;
    document.getElementById("eviDiff").textContent = fmt(Math.abs(diff));
    document.getElementById("eviDiffSub").textContent = diff > 0 ? "내연기관이 더 저렴" : diff < 0 ? "전기차가 더 저렴" : "동일";
    document.getElementById("eviBreakEven").textContent = breakEven ? `${breakEven}년차` : `${state.holdYears}년 내 없음`;

    const bLabel = document.getElementById("eviBreakevenLabel");
    bLabel.textContent = breakEven ? `${breakEven}년차부터 전기차가 내연기관보다 유리해집니다` : `보유기간 내 전기차가 역전되지 않습니다`;

    document.getElementById("eviEvPriceRow").textContent = fmt(evNetPrice);
    document.getElementById("eviIcePriceRow").textContent = fmt(state.icePrice);
    document.getElementById("eviEvTaxRow").textContent = fmt(evTax);
    document.getElementById("eviIceTaxRow").textContent = fmt(iceTax);
    document.getElementById("eviEvFuelRow").textContent = fmt(evAnnualCharge * state.holdYears);
    document.getElementById("eviIceFuelRow").textContent = fmt(iceFuel * state.holdYears);
    document.getElementById("eviEvInsRow").textContent = fmt(state.evInsuranceAnnual * state.holdYears);
    document.getElementById("eviIceInsRow").textContent = fmt(state.iceInsuranceAnnual * state.holdYears);
    document.getElementById("eviEvMaintRow").textContent = "—";
    document.getElementById("eviIceMaintRow").textContent = fmt(state.iceMaintenanceAnnual * state.holdYears);

    const batteryRow = document.getElementById("eviEvBatteryRow");
    if (state.includeBatteryReplace && state.holdYears >= 10) {
      batteryRow.style.display = "";
      document.getElementById("eviEvBatteryCost").textContent = "1,000만원";
    } else {
      batteryRow.style.display = "none";
    }

    document.getElementById("eviEvTotalRow").textContent = fmt(evTotal);
    document.getElementById("eviIceTotalRow").textContent = fmt(iceTotal);
  }

  function renderChart(evYearly, iceYearly) {
    const labels = Array.from({ length: state.holdYears }, (_, i) => `${i + 1}년차`);
    if (typeof Chart === "undefined") { loadChartJs(() => renderChart(evYearly, iceYearly)); return; }
    const canvas = document.getElementById("eviChart");
    if (!canvas) return;
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "전기차", data: evYearly, borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.08)", tension: 0.3, pointRadius: 4 },
          { label: "내연기관", data: iceYearly, borderColor: "#6b7280", backgroundColor: "rgba(107,114,128,0.08)", tension: 0.3, pointRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: { y: { ticks: { callback: (v) => v.toLocaleString("ko-KR") + "만" } } },
      },
    });
  }

  function loadChartJs(cb) {
    if (window._chartJsLoading) { setTimeout(() => { if (typeof Chart !== "undefined") cb(); else loadChartJs(cb); }, 200); return; }
    window._chartJsLoading = true;
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  function updateSubsidyDisplay() {
    const sub = cfg.subsidies[state.region] || { national: 650, local: 0 };
    document.getElementById("eviNationalSubsidy").textContent = sub.national;
    document.getElementById("eviLocalSubsidy").textContent = sub.local;
  }

  function update() {
    updateSubsidyDisplay();
    const data = calcYearly();
    render(data);
    renderChart(data.evYearly, data.iceYearly);
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => params.set(k, v));
    history.replaceState(null, "", "?" + params.toString());
  }

  function loadUrl() {
    const params = new URLSearchParams(location.search);
    params.forEach((v, k) => {
      if (k in state) {
        if (v === "true") state[k] = true;
        else if (v === "false") state[k] = false;
        else if (!isNaN(v)) state[k] = Number(v);
        else state[k] = v;
      }
    });
  }

  function bindInputs() {
    document.querySelectorAll("[data-evi]").forEach((el) => {
      const key = el.dataset.evi;
      el.value = state[key] ?? "";
      el.addEventListener("input", () => { state[key] = Number(el.value) || 0; update(); });
    });
    document.querySelectorAll("[data-evi-bool]").forEach((el) => {
      const key = el.dataset.eviBool;
      el.checked = !!state[key];
      el.addEventListener("change", () => { state[key] = el.checked; update(); });
    });
  }

  function bindRegion() {
    document.querySelectorAll(".evi-region-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.region = btn.dataset.region;
        document.querySelectorAll(".evi-region-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        update();
      });
    });
  }

  function bindReset() {
    document.getElementById("eviResetBtn")?.addEventListener("click", () => {
      state = { ...cfg.defaults };
      document.querySelectorAll("[data-evi]").forEach((el) => { el.value = state[el.dataset.evi] ?? ""; });
      document.querySelectorAll("[data-evi-bool]").forEach((el) => { el.checked = !!state[el.dataset.eviBool]; });
      document.querySelectorAll(".evi-region-btn").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.region === state.region);
      });
      update();
    });
  }

  function bindCopy() {
    document.getElementById("eviCopyLinkBtn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadUrl();
  bindInputs();
  bindRegion();
  bindReset();
  bindCopy();
  update();
})();
