(function () {
  "use strict";

  const cfg = JSON.parse(document.getElementById("sbuConfig")?.textContent || "{}");
  const {
    operatingProfit = 0,
    employeeBases = [],
    demandRate = 0.2,
    encouragementPerHead = 0,
    defaultEmployeeBasisId = "",
  } = cfg;

  const state = {
    employeeBasisId: defaultEmployeeBasisId,
  };

  const els = {
    employeeSelect: () => document.getElementById("sbuEmployeeBasis"),
    totalFund: () => document.getElementById("sbuTotalFund"),
    perHead: () => document.getElementById("sbuPerHead"),
    perHeadTotal: () => document.getElementById("sbuPerHeadTotal"),
    matrixRows: () => document.querySelectorAll("#sbuMatrixTable tbody tr"),
  };

  function formatWon(amount) {
    if (amount >= 1_000_000_000_000) {
      const jo = Math.floor(amount / 1_000_000_000_000);
      const eok = Math.round((amount % 1_000_000_000_000) / 100_000_000);
      return eok > 0 ? `${jo}조 ${eok.toLocaleString()}억원` : `${jo}조원`;
    }
    if (amount >= 100_000_000) {
      const eok = amount / 100_000_000;
      const eokText = eok % 1 === 0 ? eok.toLocaleString() : eok.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      return `${eokText}억원`;
    }
    return `${Math.round(amount / 10_000).toLocaleString()}만원`;
  }

  function findById(list, id) {
    return list.find((item) => item.id === id);
  }

  function render() {
    const employee = findById(employeeBases, state.employeeBasisId);
    if (!employee) return;

    const totalFund = operatingProfit * demandRate;
    const perHead = totalFund / employee.employeeCount;
    const perHeadTotal = perHead + encouragementPerHead;

    const totalFundEl = els.totalFund();
    const perHeadEl = els.perHead();
    const perHeadTotalEl = els.perHeadTotal();
    if (totalFundEl) totalFundEl.textContent = formatWon(totalFund);
    if (perHeadEl) perHeadEl.textContent = formatWon(perHead);
    if (perHeadTotalEl) perHeadTotalEl.textContent = formatWon(perHeadTotal);

    els.matrixRows().forEach((row) => {
      row.classList.toggle("is-active", row.dataset.employeeBasis === state.employeeBasisId);
    });
  }

  function bindEvents() {
    const employeeSelect = els.employeeSelect();
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
