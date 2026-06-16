(function () {
  "use strict";

  const cfg = JSON.parse(document.getElementById("cbrConfig")?.textContent || "{}");
  const { entries = [], top10 = [], baseSalary = 60_000_000, taxRate = 0.22, industryColors = {}, industryLabels = {} } = cfg;

  let state = { activeIndustry: "all" };
  let chart = null;

  const els = {
    filterTabs: () => document.querySelectorAll(".cbr-filter-tab"),
    tableBody: () => document.getElementById("cbrTableBody"),
    chartCanvas: () => document.getElementById("cbrRankingChart"),
  };

  function getFiltered() {
    if (state.activeIndustry === "all") return entries;
    return entries.filter((e) => e.industry === state.activeIndustry);
  }

  function getTop10(list) {
    return [...list].sort((a, b) => b.salaryPercent - a.salaryPercent).slice(0, 10);
  }

  function formatWon(n) {
    if (n >= 100_000_000) {
      const v = n / 100_000_000;
      return (v % 1 === 0 ? v : v.toFixed(1)) + "억원";
    }
    return Math.round(n / 10_000).toLocaleString() + "만원";
  }

  function getColor(industry) {
    return industryColors[industry] || "#1a56db";
  }

  function renderChart(list) {
    const top = getTop10(list);
    const canvas = els.chartCanvas();
    if (!canvas || typeof Chart === "undefined") return;

    const labels = top.map((e) => e.name);
    const data = top.map((e) => e.salaryPercent);
    const colors = top.map((e) => getColor(e.industry));

    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = colors;
      chart.update();
      return;
    }

    chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "성과급률 (%)",
            data,
            backgroundColor: colors,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const entry = top[ctx.dataIndex];
                const gross = baseSalary * entry.salaryPercent / 100;
                const conf = entry.confidence === "confirmed" ? "확정" : "추정";
                return [
                  ` 성과급률: ${entry.salaryPercent}% (${conf})`,
                  ` 6천만원 기준 세전: ${formatWon(gross)}`,
                  ` ${entry.basis}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (v) => v + "%",
              font: { size: 12 },
            },
            grid: { color: "rgba(0,0,0,0.06)" },
          },
          y: {
            ticks: {
              font: { size: 12 },
            },
            grid: { display: false },
          },
        },
      },
    });
  }

  function renderTable(list) {
    const tbody = els.tableBody();
    if (!tbody) return;
    const sorted = [...list].sort((a, b) => b.salaryPercent - a.salaryPercent);
    tbody.querySelectorAll("tr").forEach((row) => {
      const industry = row.dataset.cbrIndustry;
      const match = state.activeIndustry === "all" || industry === state.activeIndustry;
      row.style.display = match ? "" : "none";
    });
    // re-rank visible rows
    let rank = 1;
    tbody.querySelectorAll("tr").forEach((row) => {
      if (row.style.display !== "none") {
        const badge = row.querySelector(".cbr-rank-badge");
        if (badge) badge.textContent = rank++;
      }
    });
  }

  function setFilter(industry) {
    state.activeIndustry = industry;
    els.filterTabs().forEach((tab) => {
      const active = tab.dataset.cbrFilter === industry;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    const filtered = getFiltered();
    renderChart(filtered);
    renderTable(filtered);
  }

  function bindEvents() {
    els.filterTabs().forEach((tab) => {
      tab.addEventListener("click", () => setFilter(tab.dataset.cbrFilter));
    });
  }

  function loadChartJs(cb) {
    if (typeof Chart !== "undefined") { cb(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  function init() {
    bindEvents();
    loadChartJs(() => renderChart(entries));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
