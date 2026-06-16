import { buildDefaultOptions, makeLabelPlugin, formatKRW } from "./chart-config.js";

(() => {
  const configEl = document.getElementById("ibbConfig");
  const root = document.querySelector("[data-ibb-calculator]");
  if (!configEl || !root) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const companies = Array.isArray(config.companies) ? config.companies : [];

  const TAX_RATE_SIMPLE = 0.22;

  const state = {
    annualSalary: 120_000_000,
    monthlySalary: 10_000_000,
    monthlySalaryTouched: false,
    taxMode: "simple",
    manualTaxRate: 0.22,
    companies: {},
  };

  companies.forEach((company) => {
    state.companies[company.id] = {
      mode: company.defaultMode || "salaryPercent",
      salaryPercent: Number(company.defaultSalaryPercent || 0),
      monthlyMultiple: Number(company.defaultMonthlyMultiple || 0),
      fixedAmount: Number(company.defaultFixedAmount || 0),
    };
  });

  const els = {
    annualSalary: root.querySelector("[data-ibb-annual-salary]"),
    monthlySalary: root.querySelector("[data-ibb-monthly-salary]"),
    monthlyHint: root.querySelector("[data-ibb-monthly-hint]"),
    resetMonthly: root.querySelector("[data-ibb-reset-monthly]"),
    taxMode: root.querySelector("[data-ibb-tax-mode]"),
    manualTaxRate: root.querySelector("[data-ibb-manual-tax-rate]"),
    bestNet: document.querySelector("[data-ibb-best-net]"),
    bestNetCompany: document.querySelector("[data-ibb-best-net-company]"),
    maxGap: document.querySelector("[data-ibb-max-gap]"),
    monthlyGap: document.querySelector("[data-ibb-monthly-gap]"),
    bestTotal: document.querySelector("[data-ibb-best-total]"),
    bestTotalCompany: document.querySelector("[data-ibb-best-total-company]"),
    resultTable: document.querySelector("[data-ibb-result-table]"),
    resetBtn: document.getElementById("ibbResetBtn"),
    copyBtn: document.getElementById("ibbCopyLinkBtn"),
  };

  const formatWon = (value) => {
    const rounded = Math.round(Number(value) || 0);
    if (Math.abs(rounded) >= 100_000_000) {
      const eok = rounded / 100_000_000;
      return `${eok.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억 원`;
    }
    if (Math.abs(rounded) >= 10_000) {
      return `${Math.round(rounded / 10_000).toLocaleString("ko-KR")}만 원`;
    }
    return `${rounded.toLocaleString("ko-KR")}원`;
  };

  const formatInputNumber = (value) =>
    String(Math.max(0, Math.round(Number(value) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parseNumber = (value) => Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);

  function getTaxRate() {
    if (state.taxMode === "manual") return Math.min(Math.max(state.manualTaxRate, 0), 0.6);
    return TAX_RATE_SIMPLE;
  }

  function calculateGrossBonus(input) {
    if (input.mode === "salaryPercent") return state.annualSalary * (input.salaryPercent / 100);
    if (input.mode === "monthlyMultiple") return state.monthlySalary * input.monthlyMultiple;
    return input.fixedAmount;
  }

  function getInputLabel(input) {
    if (input.mode === "salaryPercent") return `연봉 대비 ${input.salaryPercent.toLocaleString("ko-KR")}％`;
    if (input.mode === "monthlyMultiple") return `월급 ${input.monthlyMultiple.toLocaleString("ko-KR")}개월`;
    return `고정 ${formatWon(input.fixedAmount)}`;
  }

  function calculateResults() {
    const taxRate = getTaxRate();
    return companies.map((company) => {
      const input = state.companies[company.id];
      const grossBonus = calculateGrossBonus(input);
      const netBonus = Math.max(grossBonus * (1 - taxRate), 0);
      return {
        company,
        input,
        grossBonus,
        netBonus,
        monthlyEquivalent: grossBonus / 12,
        totalCompensation: state.annualSalary + grossBonus,
      };
    });
  }

  function syncInputs() {
    if (els.annualSalary) els.annualSalary.value = formatInputNumber(state.annualSalary);
    if (els.monthlySalary) els.monthlySalary.value = formatInputNumber(state.monthlySalary);
    if (els.monthlyHint) {
      els.monthlyHint.textContent = state.monthlySalaryTouched
        ? "직접 입력한 월 기본급을 유지합니다."
        : "연봉을 바꾸면 자동 갱신됩니다.";
    }
    if (els.taxMode) els.taxMode.value = state.taxMode;
    if (els.manualTaxRate) {
      els.manualTaxRate.value = String(Math.round(state.manualTaxRate * 1000) / 10);
      els.manualTaxRate.disabled = state.taxMode !== "manual";
    }

    companies.forEach((company) => {
      const input = state.companies[company.id];
      const mode = root.querySelector(`[data-ibb-mode="${company.id}"]`);
      const percent = root.querySelector(`[data-ibb-salary-percent="${company.id}"]`);
      const multiple = root.querySelector(`[data-ibb-monthly-multiple="${company.id}"]`);
      const fixed = root.querySelector(`[data-ibb-fixed-amount="${company.id}"]`);
      if (mode) mode.value = input.mode;
      if (percent) percent.value = String(input.salaryPercent);
      if (multiple) multiple.value = String(input.monthlyMultiple);
      if (fixed) fixed.value = formatInputNumber(input.fixedAmount);

      root.querySelectorAll(`[data-ibb-field-group="${company.id}"]`).forEach((field) => {
        field.hidden = field.dataset.ibbFieldMode !== input.mode;
      });
    });
  }

  function renderResults(results) {
    const byNet = [...results].sort((a, b) => b.netBonus - a.netBonus);
    const byGross = [...results].sort((a, b) => b.grossBonus - a.grossBonus);
    const byTotal = [...results].sort((a, b) => b.totalCompensation - a.totalCompensation);
    const bestNet = byNet[0];
    const bestTotal = byTotal[0];
    const maxGap = byGross.length ? byGross[0].grossBonus - byGross[byGross.length - 1].grossBonus : 0;

    if (els.bestNet) els.bestNet.textContent = bestNet ? formatWon(bestNet.netBonus) : "-";
    if (els.bestNetCompany) els.bestNetCompany.textContent = bestNet ? bestNet.company.name : "-";
    if (els.maxGap) els.maxGap.textContent = formatWon(maxGap);
    if (els.monthlyGap) els.monthlyGap.textContent = formatWon(maxGap / 12);
    if (els.bestTotal) els.bestTotal.textContent = bestTotal ? formatWon(bestTotal.totalCompensation) : "-";
    if (els.bestTotalCompany) els.bestTotalCompany.textContent = bestTotal ? bestTotal.company.name : "-";

    if (els.resultTable) {
      els.resultTable.innerHTML = results
        .map((result) => {
          const isBest = bestNet && result.company.id === bestNet.company.id;
          return `
          <tr class="${isBest ? "is-best" : ""}">
            <td class="cell-label"><strong>${escapeHtml(result.company.name)}</strong></td>
            <td>${escapeHtml(getInputLabel(result.input))}</td>
            <td>${formatWon(result.grossBonus)}</td>
            <td class="cell-highlight">${formatWon(result.netBonus)}</td>
            <td>${formatWon(result.monthlyEquivalent)}</td>
            <td>${formatWon(result.totalCompensation)}</td>
          </tr>
        `;
        })
        .join("");
    }
  }

  let _chart = null;
  function renderChart(results) {
    const canvas = document.getElementById("ibbCompareChart");
    if (!canvas || !window.Chart) return;

    const labels = results.map((r) => r.company.shortName);
    const grossData = results.map((r) => r.grossBonus);
    const netData = results.map((r) => r.netBonus);

    if (_chart) { _chart.destroy(); _chart = null; }

    _chart = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "세전 성과급", data: grossData, backgroundColor: "#3F83F8", borderRadius: 4 },
          { label: "세후 성과급", data: netData, backgroundColor: "#1A56DB", borderRadius: 4 },
        ],
      },
      options: {
        ...buildDefaultOptions(),
        plugins: {
          ...buildDefaultOptions().plugins,
          legend: { display: true, position: "top", labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatWon(ctx.parsed.y)}` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#888780" } },
          y: { grid: { color: "#F0EFED" }, ticks: { color: "#888780", callback: (v) => formatKRW(v) } },
        },
      },
      plugins: [makeLabelPlugin(formatKRW)],
    });
  }

  function update() {
    syncInputs();
    const results = calculateResults();
    renderResults(results);
    renderChart(results);
  }

  function resetAll() {
    state.annualSalary = 120_000_000;
    state.monthlySalary = 10_000_000;
    state.monthlySalaryTouched = false;
    state.taxMode = "simple";
    state.manualTaxRate = 0.22;
    companies.forEach((company) => {
      state.companies[company.id] = {
        mode: company.defaultMode || "salaryPercent",
        salaryPercent: Number(company.defaultSalaryPercent || 0),
        monthlyMultiple: Number(company.defaultMonthlyMultiple || 0),
        fixedAmount: Number(company.defaultFixedAmount || 0),
      };
    });
    update();
  }

  els.annualSalary?.addEventListener("input", (event) => {
    state.annualSalary = parseNumber(event.target.value);
    if (!state.monthlySalaryTouched) state.monthlySalary = Math.round(state.annualSalary / 12);
    update();
  });

  els.monthlySalary?.addEventListener("input", (event) => {
    state.monthlySalaryTouched = true;
    state.monthlySalary = parseNumber(event.target.value);
    update();
  });

  els.resetMonthly?.addEventListener("click", () => {
    state.monthlySalaryTouched = false;
    state.monthlySalary = Math.round(state.annualSalary / 12);
    update();
  });

  els.taxMode?.addEventListener("change", (event) => {
    state.taxMode = event.target.value === "manual" ? "manual" : "simple";
    update();
  });

  els.manualTaxRate?.addEventListener("input", (event) => {
    state.manualTaxRate = parseNumber(event.target.value) / 100;
    update();
  });

  companies.forEach((company) => {
    root.querySelector(`[data-ibb-mode="${company.id}"]`)?.addEventListener("change", (event) => {
      state.companies[company.id].mode = event.target.value;
      update();
    });
    root.querySelector(`[data-ibb-salary-percent="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].salaryPercent = parseNumber(event.target.value);
      update();
    });
    root.querySelector(`[data-ibb-monthly-multiple="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].monthlyMultiple = parseNumber(event.target.value);
      update();
    });
    root.querySelector(`[data-ibb-fixed-amount="${company.id}"]`)?.addEventListener("input", (event) => {
      state.companies[company.id].fixedAmount = parseNumber(event.target.value);
      update();
    });
  });

  els.resetBtn?.addEventListener("click", resetAll);
  els.copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      els.copyBtn.textContent = "링크 복사됨";
      window.setTimeout(() => { els.copyBtn.textContent = "링크 복사"; }, 1500);
    } catch {
      els.copyBtn.textContent = "복사 실패";
    }
  });

  update();
})();
