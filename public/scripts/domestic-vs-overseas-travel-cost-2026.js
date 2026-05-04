(function () {
  "use strict";

  const seedNode = document.getElementById("dvotc-data");
  if (!seedNode) return;

  const seed = JSON.parse(seedNode.textContent || "{}");
  const destinations = Array.isArray(seed.destinations) ? seed.destinations : [];
  const categoryOrder = Array.isArray(seed.categoryOrder) ? seed.categoryOrder : [];
  const categoryLabels = seed.categoryLabels || {};
  if (!destinations.length) return;

  const state = { view: "all" };
  const els = {
    tableBody: document.getElementById("dvotc-summary-grid"),
    breakdownGrid: document.getElementById("dvotc-breakdown-grid"),
    rankCost: document.getElementById("dvotc-rank-cost"),
    rankValue: document.getElementById("dvotc-rank-value"),
    chart: document.getElementById("dvotc-cost-chart"),
  };

  let chart = null;

  function formatWon(value) {
    return `${Math.round((Number(value) || 0) / 10000).toLocaleString("ko-KR")}만원`;
  }

  function formatRange(range) {
    return `${formatWon(range.min)}~${formatWon(range.max)}`;
  }

  function midpoint(range) {
    return Math.round(((range?.min || 0) + (range?.max || 0)) / 2);
  }

  function getRows() {
    return destinations
      .filter((item) => state.view === "all" || item.type === state.view)
      .slice()
      .sort((a, b) => a.total.min - b.total.min);
  }

  function syncButtons() {
    document.querySelectorAll("[data-dvotc-view]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.dvotcView === state.view);
    });
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    if (state.view === "all") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", state.view);
    }
    window.history.replaceState({}, "", url);
  }

  function renderTable(rows) {
    if (!els.tableBody) return;

    els.tableBody.innerHTML = rows
      .map(
        (item, index) => `
          <tr data-type="${item.type}">
            <td>${index + 1}</td>
            <td>
              <strong>${item.name}</strong>
              <span>${item.summary}</span>
            </td>
            <td>${item.regionLabel}</td>
            <td class="is-total">${formatRange(item.total)}</td>
            <td>${item.valueScore}점</td>
            <td>${(item.keyVariables || []).slice(0, 3).join(" · ")}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderBreakdown(rows) {
    if (!els.breakdownGrid) return;

    els.breakdownGrid.innerHTML = rows
      .map((item) => {
        const costRows = categoryOrder
          .map((category) => {
            const range = item.costs?.[category] || { min: 0, max: 0 };
            return `
              <div class="dvotc-cost-row">
                <span>${categoryLabels[category] || category}</span>
                <b>${formatRange(range)}</b>
              </div>
            `;
          })
          .join("");

        return `
          <article class="dvotc-destination-card" data-type="${item.type}">
            <div class="dvotc-destination-card__head">
              <p>${item.regionLabel}</p>
              <h3>${item.name}</h3>
              <strong>${formatRange(item.total)}</strong>
            </div>
            <div class="dvotc-cost-list">${costRows}</div>
            <p class="dvotc-card-note">${item.caution}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderRanks(rows) {
    if (els.rankCost) {
      els.rankCost.innerHTML = rows
        .map((item) => `<li><span>${item.name}</span><strong>${formatRange(item.total)}</strong></li>`)
        .join("");
    }

    if (els.rankValue) {
      els.rankValue.innerHTML = rows
        .slice()
        .sort((a, b) => b.valueScore - a.valueScore)
        .map((item) => `<li><span>${item.name}</span><strong>${item.valueScore}점 · ${formatWon(midpoint(item.total))}</strong></li>`)
        .join("");
    }
  }

  function renderChart(rows) {
    if (!els.chart || typeof window.Chart === "undefined") return;

    const labels = rows.map((item) => item.name);
    const data = rows.map((item) => midpoint(item.total));
    const minData = rows.map((item) => item.total.min);
    const maxData = rows.map((item) => item.total.max);
    const colors = rows.map((item) => (item.type === "domestic" ? "#0f766e" : "#2563eb"));

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "총비용 중앙값",
            data,
            backgroundColor: colors,
            borderRadius: 8,
            borderSkipped: false,
            customMin: minData,
            customMax: maxData,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const index = context.dataIndex;
                return ` 추정 범위: ${formatWon(minData[index])}~${formatWon(maxData[index])}`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            ticks: {
              callback(value) {
                return formatWon(value);
              },
            },
          },
        },
      },
    };

    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = colors;
      chart.update();
      return;
    }

    chart = new window.Chart(els.chart.getContext("2d"), config);
  }

  function render() {
    const rows = getRows();
    syncButtons();
    syncUrl();
    renderTable(rows);
    renderBreakdown(rows);
    renderRanks(rows);
    renderChart(rows);
  }

  document.querySelectorAll("[data-dvotc-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.dvotcView || "all";
      if (next === state.view) return;
      state.view = ["all", "domestic", "overseas"].includes(next) ? next : "all";
      render();
    });
  });

  const initialView = new URL(window.location.href).searchParams.get("view");
  if (["domestic", "overseas"].includes(initialView)) state.view = initialView;

  render();
})();
