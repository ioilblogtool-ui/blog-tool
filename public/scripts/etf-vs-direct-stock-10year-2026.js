const dataNode = document.getElementById("etfVsDirectStock10Year2026Data");
const report = dataNode ? JSON.parse(dataNode.textContent || "{}") : null;

if (report) {
  const state = {
    mode: new URLSearchParams(window.location.search).get("mode") || "gross",
  };

  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  const tableRows = Array.from(document.querySelectorAll("#evds26CompareBody tr"));
  const chartCanvas = document.getElementById("evds26GrowthChart");
  let chart = null;

  const modeLabel = {
    gross: "배당 미포함",
    dividend: "배당 재투자",
    afterTax: "세후 단순 추정",
  };

  const modeField = {
    gross: "cumulativeReturn",
    dividend: "dividendAdjustedReturn",
    afterTax: "afterTaxReturn",
  };

  const fmt = (value) => `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)}%`;

  const updateUrl = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", state.mode);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const rowsById = new Map(report.tenYearRows.map((row) => [row.id, row]));

  const getIndexSeries = (assetId) => {
    const base = report.yearlyIndex.find((row) => row.assetId === assetId);
    const asset = rowsById.get(assetId);
    if (!base || !asset) return [];

    const target = Number(asset[modeField[state.mode]] ?? asset.cumulativeReturn);
    const grossTarget = Number(asset.cumulativeReturn || 0);
    const multiplier = grossTarget === 0 ? 1 : (100 + target) / (100 + grossTarget);

    return Object.values(base.years).map((value, index, arr) => {
      if (state.mode === "gross") return value;
      const progress = index / Math.max(arr.length - 1, 1);
      return Math.round(value * (1 + (multiplier - 1) * progress));
    });
  };

  const renderTableMode = () => {
    modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-mode") === state.mode);
    });

    tableRows.forEach((row) => {
      const asset = rowsById.get(row.getAttribute("data-asset-id"));
      if (!asset) return;
      const mainCell = row.querySelector('[data-value="gross"]');
      const value = asset[modeField[state.mode]] ?? asset.cumulativeReturn;
      if (mainCell) {
        mainCell.textContent = fmt(value);
        mainCell.classList.toggle("is-selected-mode", state.mode !== "gross");
      }
    });
  };

  const renderChart = () => {
    if (!chartCanvas || !window.Chart) return;
    const labels = Object.keys(report.yearlyIndex[0]?.years || {});
    const palette = ["#0f766e", "#2563eb", "#334155", "#9333ea", "#b45309", "#dc2626"];
    const datasets = report.tenYearRows.map((asset, index) => ({
      label: asset.name,
      data: getIndexSeries(asset.id),
      borderColor: palette[index % palette.length],
      backgroundColor: palette[index % palette.length],
      borderWidth: asset.bucket === "domestic-etf" ? 2 : 2.6,
      pointRadius: 2,
      tension: 0.28,
    }));

    if (!chart) {
      chart = new window.Chart(chartCanvas, {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { position: "bottom" },
            title: {
              display: true,
              text: `2016=100 성장 곡선 · ${modeLabel[state.mode]}`,
              color: "#172033",
              font: { weight: "700" },
            },
          },
          scales: {
            y: {
              min: 60,
              ticks: { callback: (value) => `${value}` },
              grid: { color: "rgba(148, 163, 184, 0.22)" },
            },
            x: { grid: { display: false } },
          },
        },
      });
      return;
    }

    chart.data.datasets = datasets;
    chart.options.plugins.title.text = `2016=100 성장 곡선 · ${modeLabel[state.mode]}`;
    chart.update();
  };

  const setMode = (mode) => {
    state.mode = mode;
    renderTableMode();
    renderChart();
    updateUrl();
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.getAttribute("data-mode") || "gross"));
  });

  document.querySelectorAll("[data-global-row]").forEach((row) => {
    row.addEventListener("click", () => {
      document.querySelectorAll("[data-global-row]").forEach((item) => item.classList.remove("is-active"));
      row.classList.add("is-active");
    });
  });

  renderTableMode();
  renderChart();
}

