(function () {
  "use strict";

  const root = document.querySelector('[data-report="2026-salaried-loan-comparison"]');
  const seedEl = document.getElementById("slcData");
  if (!root || !seedEl) return;

  const seed = JSON.parse(seedEl.textContent || "{}");
  const loans = Array.isArray(seed.loans) ? seed.loans : [];
  const salaryScenarios = Array.isArray(seed.salaryScenarios) ? seed.salaryScenarios : [];
  const highCostRows = Array.isArray(seed.highCostRows) ? seed.highCostRows : [];

  function all(selector) {
    return Array.from(root.querySelectorAll(selector));
  }

  function fmtMan(value) {
    return `${Math.round(Number(value || 0) / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function setLoanFilter(group) {
    all("[data-slc-filter]").forEach((button) => {
      const active = button.dataset.slcFilter === group;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    all("[data-slc-group]").forEach((card) => {
      const visible = group === "all" || card.dataset.slcGroup === group;
      card.hidden = !visible;
    });
  }

  function setJobFilter(job) {
    all("[data-slc-job-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.slcJobFilter === job);
    });

    all("[data-slc-job-card]").forEach((card) => {
      card.hidden = card.dataset.slcJobCard !== job;
    });
  }

  function baseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#374151",
            font: { family: "'Pretendard', sans-serif", weight: 700 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#4b5563", font: { weight: 700 } },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#6b7280" },
          grid: { color: "rgba(15, 110, 86, 0.08)" },
        },
      },
    };
  }

  function initRateRangeChart() {
    const canvas = document.getElementById("slcRateRangeChart");
    if (!canvas || !window.Chart || !loans.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: loans.map((item) => item.name),
        datasets: [
          {
            label: "최저 금리",
            data: loans.map((item) => item.rateMin * 100),
            backgroundColor: "#93c5be",
            borderRadius: 6,
          },
          {
            label: "최고 금리",
            data: loans.map((item) => item.rateMax * 100),
            backgroundColor: "#0f6e56",
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        plugins: {
          ...baseChartOptions().plugins,
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: 연 ${Number(context.raw).toFixed(1)}%`,
            },
          },
        },
        scales: {
          ...baseChartOptions().scales,
          y: {
            ...baseChartOptions().scales.y,
            ticks: { callback: (value) => `${value}%`, color: "#6b7280" },
          },
        },
      },
    });
  }

  function initSalaryLimitChart() {
    const canvas = document.getElementById("slcSalaryLimitChart");
    if (!canvas || !window.Chart || !salaryScenarios.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: salaryScenarios.map((row) => row.salaryLabel),
        datasets: [
          {
            label: "보수적 신용대출",
            data: salaryScenarios.map((row) => row.conservativeCreditLimit),
            backgroundColor: "#c9d8d2",
            borderRadius: 6,
          },
          {
            label: "공격적 신용대출",
            data: salaryScenarios.map((row) => row.aggressiveCreditLimit),
            backgroundColor: "#0f6e56",
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        plugins: {
          ...baseChartOptions().plugins,
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${fmtMan(context.raw)}`,
            },
          },
        },
        scales: {
          ...baseChartOptions().scales,
          y: {
            ...baseChartOptions().scales.y,
            ticks: { callback: (value) => `${Math.round(value / 10000)}만`, color: "#6b7280" },
          },
        },
      },
    });
  }

  function initDebtCostChart() {
    const canvas = document.getElementById("slcDebtCostChart");
    if (!canvas || !window.Chart || !highCostRows.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: highCostRows.map((row) => `${fmtMan(row.amount)} / ${row.months}개월`),
        datasets: [
          {
            label: "카드론",
            data: highCostRows.map((row) => row.cardLoanInterest),
            backgroundColor: "#f59e0b",
            borderRadius: 6,
          },
          {
            label: "리볼빙",
            data: highCostRows.map((row) => row.revolvingInterest),
            backgroundColor: "#dc2626",
            borderRadius: 6,
          },
          {
            label: "신용대출",
            data: highCostRows.map((row) => row.creditLoanInterest),
            backgroundColor: "#0f6e56",
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...baseChartOptions(),
        plugins: {
          ...baseChartOptions().plugins,
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${fmtMan(context.raw)}`,
            },
          },
        },
        scales: {
          ...baseChartOptions().scales,
          y: {
            ...baseChartOptions().scales.y,
            ticks: { callback: (value) => `${Math.round(value / 10000)}만`, color: "#6b7280" },
          },
        },
      },
    });
  }

  all("[data-slc-filter]").forEach((button) => {
    button.addEventListener("click", () => setLoanFilter(button.dataset.slcFilter || "all"));
  });

  all("[data-slc-job-filter]").forEach((button) => {
    button.addEventListener("click", () => setJobFilter(button.dataset.slcJobFilter));
  });

  if (window.Chart) {
    initRateRangeChart();
    initSalaryLimitChart();
    initDebtCostChart();
  } else {
    window.addEventListener("load", () => {
      initRateRangeChart();
      initSalaryLimitChart();
      initDebtCostChart();
    });
  }
})();
