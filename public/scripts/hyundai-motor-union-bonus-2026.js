(function () {
  "use strict";

  const cfg = JSON.parse(document.getElementById("hmuConfig")?.textContent || "{}");
  const {
    profitBases = [],
    employeeBases = [],
    demandRate = 0.3,
    defaultProfitBasisId = "",
    defaultEmployeeBasisId = "",
  } = cfg;

  const state = {
    profitBasisId: defaultProfitBasisId,
    employeeBasisId: defaultEmployeeBasisId,
  };

  const els = {
    profitSelect: () => document.getElementById("hmuProfitBasis"),
    employeeSelect: () => document.getElementById("hmuEmployeeBasis"),
    totalFund: () => document.getElementById("hmuTotalFund"),
    perHead: () => document.getElementById("hmuPerHead"),
    employeeCount: () => document.getElementById("hmuEmployeeCount"),
    matrixRows: () => document.querySelectorAll("#hmuMatrixTable tbody tr"),
  };

  function formatWon(amount) {
    if (amount >= 1_000_000_000_000) {
      const jo = Math.floor(amount / 1_000_000_000_000);
      const eok = Math.round((amount % 1_000_000_000_000) / 100_000_000);
      return eok > 0 ? `${jo}조 ${eok.toLocaleString()}억원` : `${jo}조원`;
    }
    if (amount >= 100_000_000) {
      const eok = amount / 100_000_000;
      return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
    }
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }

  function findById(list, id) {
    return list.find((item) => item.id === id);
  }

  function render() {
    const profit = findById(profitBases, state.profitBasisId);
    const employee = findById(employeeBases, state.employeeBasisId);
    if (!profit || !employee) return;

    const totalFund = profit.netProfit * demandRate;
    const perHead = totalFund / employee.employeeCount;

    const totalFundEl = els.totalFund();
    const perHeadEl = els.perHead();
    const employeeCountEl = els.employeeCount();
    if (totalFundEl) totalFundEl.textContent = formatWon(totalFund);
    if (perHeadEl) perHeadEl.textContent = formatWon(perHead);
    if (employeeCountEl) employeeCountEl.textContent = employee.shortLabel;

    els.matrixRows().forEach((row) => {
      const match =
        row.dataset.profitBasis === state.profitBasisId &&
        row.dataset.employeeBasis === state.employeeBasisId;
      row.classList.toggle("is-active", match);
    });
  }

  function bindEvents() {
    const profitSelect = els.profitSelect();
    const employeeSelect = els.employeeSelect();
    if (profitSelect) {
      profitSelect.addEventListener("change", () => {
        state.profitBasisId = profitSelect.value;
        render();
      });
    }
    if (employeeSelect) {
      employeeSelect.addEventListener("change", () => {
        state.employeeBasisId = employeeSelect.value;
        render();
      });
    }
  }

  function init() {
    bindEvents();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
