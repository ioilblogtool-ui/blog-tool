(function () {
  const cfg = JSON.parse(document.getElementById("nucConfig").textContent);
  let state = { ...cfg.defaults };
  let chart = null;

  const fmt = (v) => Math.round(v).toLocaleString("ko-KR") + "만원";

  function calcTotal(price, insurance, monthly, residualPct) {
    const tax = price * 0.07;
    const insuranceTotal = insurance * 5;
    const maintenanceTotal = monthly * 12 * 5;
    const depreciation = price * (1 - residualPct / 100);
    const total = tax + insuranceTotal + maintenanceTotal + depreciation;
    return { tax, insuranceTotal, maintenanceTotal, depreciation, total };
  }

  function calcYearly(price, insurance, monthly, residualPct) {
    const tax = price * 0.07;
    const annualDepr = price * (1 - residualPct / 100) / 5;
    const yearly = [];
    for (let y = 1; y <= 5; y++) {
      yearly.push(tax + insurance * y + monthly * 12 * y + annualDepr * y);
    }
    return yearly;
  }

  function findBreakEven(newY, usedY) {
    for (let i = 0; i < newY.length; i++) {
      if (newY[i] <= usedY[i]) return i + 1;
    }
    return null;
  }

  function calculate() {
    const s = state;
    const newR = calcTotal(s.newPrice, s.newInsurance, s.newMonthly, s.newResidual);
    const usedR = calcTotal(s.usedPrice, s.usedInsurance, s.usedMonthly, s.usedResidual);
    const newY = calcYearly(s.newPrice, s.newInsurance, s.newMonthly, s.newResidual);
    const usedY = calcYearly(s.usedPrice, s.usedInsurance, s.usedMonthly, s.usedResidual);
    const diff = newR.total - usedR.total;
    const breakEven = findBreakEven(newY, usedY);
    return { newR, usedR, newY, usedY, diff, breakEven };
  }

  function render(r) {
    const { newR, usedR, diff, breakEven } = r;
    const s = state;

    document.getElementById("nucNewTotal").textContent = fmt(newR.total);
    document.getElementById("nucUsedTotal").textContent = fmt(usedR.total);
    document.getElementById("nucDiff").textContent = fmt(Math.abs(diff));
    document.getElementById("nucDiffSub").textContent = diff > 0 ? "중고차가 더 저렴" : diff < 0 ? "신차가 더 저렴" : "동일";
    document.getElementById("nucBreakEven").textContent = breakEven ? breakEven + "년차" : "5년 내 없음";

    const conclusion = document.getElementById("nucConclusion");
    if (diff > 0) {
      conclusion.className = "nuc-conclusion nuc-conclusion--used";
      conclusion.innerHTML = `<strong>5년 기준 중고차가 더 유리합니다</strong><p>신차 대비 약 ${fmt(diff)} 절약</p>`;
    } else if (diff < 0) {
      conclusion.className = "nuc-conclusion nuc-conclusion--new";
      conclusion.innerHTML = `<strong>5년 기준 신차가 더 유리합니다</strong><p>중고차 대비 약 ${fmt(Math.abs(diff))} 절약</p>`;
    } else {
      conclusion.className = "nuc-conclusion";
      conclusion.innerHTML = `<strong>신차와 중고차 5년 총비용이 비슷합니다</strong>`;
    }

    document.getElementById("nucNewSub").textContent = "취득세 " + fmt(newR.tax) + " 포함";
    document.getElementById("nucUsedSub").textContent = "취득세 " + fmt(usedR.tax) + " 포함";

    document.getElementById("nucNewPriceRow").textContent = fmt(s.newPrice);
    document.getElementById("nucUsedPriceRow").textContent = fmt(s.usedPrice);
    document.getElementById("nucNewTaxRow").textContent = fmt(newR.tax);
    document.getElementById("nucUsedTaxRow").textContent = fmt(usedR.tax);
    document.getElementById("nucNewInsRow").textContent = fmt(newR.insuranceTotal);
    document.getElementById("nucUsedInsRow").textContent = fmt(usedR.insuranceTotal);
    document.getElementById("nucNewMaintRow").textContent = fmt(newR.maintenanceTotal);
    document.getElementById("nucUsedMaintRow").textContent = fmt(usedR.maintenanceTotal);
    document.getElementById("nucNewDeprRow").textContent = fmt(newR.depreciation);
    document.getElementById("nucUsedDeprRow").textContent = fmt(usedR.depreciation);
    document.getElementById("nucNewTotalRow").textContent = fmt(newR.total);
    document.getElementById("nucUsedTotalRow").textContent = fmt(usedR.total);
  }

  function renderChart(r) {
    const { newY, usedY } = r;
    const labels = ["1년차", "2년차", "3년차", "4년차", "5년차"];

    if (typeof Chart === "undefined") {
      loadChartJs(() => renderChart(r));
      return;
    }

    const canvas = document.getElementById("nucChart");
    if (!canvas) return;
    if (chart) chart.destroy();

    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "신차", data: newY, borderColor: "#1a56db", backgroundColor: "rgba(26,86,219,0.08)", tension: 0.3, pointRadius: 4 },
          { label: "중고차", data: usedY, borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", tension: 0.3, pointRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
        scales: {
          y: { ticks: { callback: (v) => v.toLocaleString("ko-KR") + "만" } },
        },
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

  function update() {
    const r = calculate();
    render(r);
    renderChart(r);
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
      if (k in state) state[k] = isNaN(v) ? v : Number(v);
    });
  }

  function bindInputs() {
    document.querySelectorAll("[data-nuc]").forEach((el) => {
      const key = el.dataset.nuc;
      el.value = state[key] ?? "";
      el.addEventListener("input", () => {
        state[key] = Number(el.value) || 0;
        update();
      });
    });
  }

  function bindPresets() {
    document.querySelectorAll(".nuc-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = cfg.presets[btn.dataset.preset];
        if (!preset) return;
        state = { ...state, ...preset };
        document.querySelectorAll("[data-nuc]").forEach((el) => {
          if (state[el.dataset.nuc] !== undefined) el.value = state[el.dataset.nuc];
        });
        document.querySelectorAll(".nuc-preset-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        update();
      });
    });
  }

  function bindReset() {
    document.getElementById("nucResetBtn")?.addEventListener("click", () => {
      state = { ...cfg.defaults };
      document.querySelectorAll("[data-nuc]").forEach((el) => { el.value = state[el.dataset.nuc] ?? ""; });
      document.querySelectorAll(".nuc-preset-btn").forEach((b) => b.classList.remove("is-active"));
      document.querySelector('.nuc-preset-btn[data-preset="mid"]')?.classList.add("is-active");
      update();
    });
  }

  function bindCopy() {
    document.getElementById("nucCopyLinkBtn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadUrl();
  bindInputs();
  bindPresets();
  bindReset();
  bindCopy();
  update();
})();
