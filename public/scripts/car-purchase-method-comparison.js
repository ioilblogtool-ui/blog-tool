(function () {
  const cfg = JSON.parse(document.getElementById("cpmConfig").textContent);
  let state = { ...cfg.defaults };
  let chart = null;

  const fmt = (v) => Math.round(v).toLocaleString("ko-KR") + "만원";
  const EFFECTIVE_TAX_RATE = 0.25;

  function calcLease(s) {
    const deposit = s.carPrice * s.leaseDepositPct / 100;
    const leaseCostPerCycle = s.leaseMonthly * s.leaseTerm;
    const cycles = Math.ceil((s.holdYears * 12) / s.leaseTerm);
    let total = deposit + leaseCostPerCycle * cycles;
    let taxSaving = 0;
    if (s.buyerType === "business") {
      taxSaving = s.leaseMonthly * 12 * s.holdYears * EFFECTIVE_TAX_RATE;
      total -= taxSaving;
    }
    return { deposit, leaseCostPerCycle, cycles, taxSaving, total };
  }

  function calcInstallment(s) {
    const down = s.carPrice * s.instDownPct / 100;
    const principal = s.carPrice - down;
    const monthlyRate = s.instRate / 100 / 12;
    let totalInterest = 0;
    if (monthlyRate > 0) {
      const monthly = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -s.instTerm));
      totalInterest = monthly * s.instTerm - principal;
    }
    let taxSaving = 0;
    if (s.buyerType === "business") {
      taxSaving = totalInterest * EFFECTIVE_TAX_RATE;
    }
    const total = s.carPrice + totalInterest - taxSaving;
    return { down, principal, totalInterest, taxSaving, total };
  }

  function calcCash(s) {
    const opportunityCost = s.carPrice * (s.cashOppRate / 100) * s.holdYears;
    let taxSaving = 0;
    if (s.buyerType === "business") {
      taxSaving = (s.carPrice / 5) * s.holdYears * EFFECTIVE_TAX_RATE;
    }
    const total = s.carPrice + opportunityCost - taxSaving;
    return { opportunityCost, taxSaving, total };
  }

  function calcYearly(s) {
    const leaseYearly = [], instYearly = [], cashYearly = [];
    const deposit = s.carPrice * s.leaseDepositPct / 100;
    const down = s.carPrice * s.instDownPct / 100;
    const principal = s.carPrice - down;
    const monthlyRate = s.instRate / 100 / 12;
    let instMonthly = 0;
    if (monthlyRate > 0) instMonthly = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -s.instTerm));
    else instMonthly = principal / s.instTerm;

    for (let y = 1; y <= s.holdYears; y++) {
      const leaseMos = Math.min(y * 12, s.leaseTerm * Math.ceil((s.holdYears * 12) / s.leaseTerm));
      leaseYearly.push(deposit + s.leaseMonthly * Math.min(y * 12, leaseMos));
      const instMos = Math.min(y * 12, s.instTerm);
      instYearly.push(down + instMonthly * instMos);
      cashYearly.push(s.carPrice + s.carPrice * (s.cashOppRate / 100) * y);
    }
    return { leaseYearly, instYearly, cashYearly };
  }

  function render(lease, inst, cash) {
    const totals = [
      { id: "cpmLeaseCard", total: lease.total, label: "리스" },
      { id: "cpmInstCard", total: inst.total, label: "할부" },
      { id: "cpmCashCard", total: cash.total, label: "현금" },
    ];
    const minTotal = Math.min(lease.total, inst.total, cash.total);

    document.getElementById("cpmLeaseTotal").textContent = fmt(lease.total);
    document.getElementById("cpmInstTotal").textContent = fmt(inst.total);
    document.getElementById("cpmCashTotal").textContent = fmt(cash.total);

    totals.forEach(({ id, total }) => {
      const card = document.getElementById(id);
      card.classList.toggle("is-winner", Math.abs(total - minTotal) < 1);
    });

    const winner = totals.find((t) => Math.abs(t.total - minTotal) < 1);
    document.getElementById("cpmWinner").textContent = winner ? `${winner.label} 구매가 가장 유리합니다` : "";

    const bizNote = document.getElementById("cpmBusinessNote");
    const bizText = document.getElementById("cpmBusinessNoteText");
    if (state.buyerType === "business") {
      bizNote.style.display = "";
      const savings = [
        `리스 절세 ${fmt(lease.taxSaving)}`,
        `할부 절세 ${fmt(inst.taxSaving)}`,
        `현금 감가 절세 ${fmt(cash.taxSaving)}`,
      ];
      bizText.textContent = " — " + savings.join(" / ");
    } else {
      bizNote.style.display = "none";
    }

    const tbody = document.getElementById("cpmTableBody");
    tbody.innerHTML = [
      ["보증금/선납금", fmt(lease.deposit), fmt(state.carPrice * state.instDownPct / 100), "—"],
      ["리스료/이자", fmt(lease.leaseCostPerCycle * lease.cycles - lease.deposit), fmt(inst.totalInterest), "—"],
      ["기회비용", "—", "—", fmt(cash.opportunityCost)],
      ["절세 효과", state.buyerType === "business" ? `-${fmt(lease.taxSaving)}` : "—",
        state.buyerType === "business" ? `-${fmt(inst.taxSaving)}` : "—",
        state.buyerType === "business" ? `-${fmt(cash.taxSaving)}` : "—"],
    ].map(([label, ...vals]) =>
      `<tr><td>${label}</td>${vals.map((v) => `<td>${v}</td>`).join("")}</tr>`
    ).join("");

    document.getElementById("cpmLeaseTotalRow").textContent = fmt(lease.total);
    document.getElementById("cpmInstTotalRow").textContent = fmt(inst.total);
    document.getElementById("cpmCashTotalRow").textContent = fmt(cash.total);
  }

  function renderChart(leaseYearly, instYearly, cashYearly) {
    const labels = Array.from({ length: state.holdYears }, (_, i) => `${i + 1}년차`);
    if (typeof Chart === "undefined") { loadChartJs(() => renderChart(leaseYearly, instYearly, cashYearly)); return; }
    const canvas = document.getElementById("cpmChart");
    if (!canvas) return;
    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "리스", data: leaseYearly, borderColor: "#1a56db", backgroundColor: "rgba(26,86,219,0.08)", tension: 0.3, pointRadius: 4 },
          { label: "할부", data: instYearly, borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", tension: 0.3, pointRadius: 4 },
          { label: "현금", data: cashYearly, borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.08)", tension: 0.3, pointRadius: 4 },
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

  function update() {
    const lease = calcLease(state);
    const inst = calcInstallment(state);
    const cash = calcCash(state);
    const { leaseYearly, instYearly, cashYearly } = calcYearly(state);
    render(lease, inst, cash);
    renderChart(leaseYearly, instYearly, cashYearly);
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
    document.querySelectorAll("[data-cpm]").forEach((el) => {
      const key = el.dataset.cpm;
      if (el.tagName === "SELECT") {
        el.value = state[key] ?? "";
        el.addEventListener("change", () => { state[key] = el.value; update(); });
      } else {
        el.value = state[key] ?? "";
        el.addEventListener("input", () => { state[key] = Number(el.value) || 0; update(); });
      }
    });
  }

  function bindToggles() {
    document.querySelectorAll(".cpm-section--collapsible").forEach((sec) => {
      const toggle = sec.querySelector(".cpm-section__toggle");
      toggle?.addEventListener("click", () => sec.classList.toggle("is-collapsed"));
    });
  }

  function bindReset() {
    document.getElementById("cpmResetBtn")?.addEventListener("click", () => {
      state = { ...cfg.defaults };
      document.querySelectorAll("[data-cpm]").forEach((el) => {
        if (el.tagName === "SELECT") el.value = state[el.dataset.cpm] ?? "";
        else el.value = state[el.dataset.cpm] ?? "";
      });
      update();
    });
  }

  function bindCopy() {
    document.getElementById("cpmCopyLinkBtn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(location.href).catch(() => {});
    });
  }

  loadUrl();
  bindInputs();
  bindToggles();
  bindReset();
  bindCopy();
  update();
})();
