(function () {
  "use strict";

  const root = document.querySelector('[data-report="corporate-bonus-comparison-2026"]');
  const seedEl = document.getElementById("cbcData");
  if (!root || !seedEl) return;

  const seed = JSON.parse(seedEl.textContent || "{}");
  const scenarios = Array.isArray(seed.salaryScenarios) ? seed.salaryScenarios : [];
  const waterfall = Array.isArray(seed.taxWaterfall) ? seed.taxWaterfall : [];

  function formatMan(value) {
    return `${Math.round(Number(value || 0) / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function baseOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#344054",
            font: { family: "'Pretendard', sans-serif", weight: 800 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#475467", font: { weight: 800 } },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#667085", callback: (value) => `${Math.round(value / 10000)}만` },
          grid: { color: "rgba(31, 41, 55, 0.08)" },
        },
      },
    };
  }

  function initSalaryChart() {
    const canvas = document.getElementById("cbcSalaryScenarioChart");
    if (!canvas || !window.Chart || !scenarios.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: scenarios.map((row) => row.salaryLabel),
        datasets: [
          {
            label: "삼성전자",
            data: scenarios.map((row) => row.samsungBonus),
            backgroundColor: "#6b7280",
            borderRadius: 6,
          },
          {
            label: "SK하이닉스",
            data: scenarios.map((row) => row.skHynixBonus),
            backgroundColor: "#0f6e56",
            borderRadius: 6,
          },
          {
            label: "현대차",
            data: scenarios.map((row) => row.hyundaiBonus),
            backgroundColor: "#2563eb",
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...baseOptions(),
        plugins: {
          ...baseOptions().plugins,
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${formatMan(context.raw)}`,
            },
          },
        },
      },
    });
  }

  function initTaxChart() {
    const canvas = document.getElementById("cbcTaxWaterfallChart");
    if (!canvas || !window.Chart || !waterfall.length) return;

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: waterfall.map((item) => item.label),
        datasets: [
          {
            label: "금액",
            data: waterfall.map((item) => item.amount),
            backgroundColor: waterfall.map((item) => {
              if (item.type === "deduction") return "#dc2626";
              if (item.type === "net") return "#0f6e56";
              return "#344054";
            }),
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...baseOptions(),
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => formatMan(context.raw),
            },
          },
        },
      },
    });
  }

  initSalaryChart();
  initTaxChart();
})();
