(function () {
  "use strict";

  const seedNode = document.getElementById("overseasTravelCostCompare2026Data");
  if (!seedNode) return;

  const seed = JSON.parse(seedNode.textContent || "{}");
  const matrix = seed.matrix || {};
  const cities = Array.isArray(seed.cities) ? seed.cities : [];
  if (!cities.length) return;

  const cityById = Object.fromEntries(cities.map((city) => [city.id, city]));
  const styleLabels = {
    budget: "배낭형",
    standard: "스탠다드",
    premium: "프리미엄",
  };
  const durationLabels = {
    "2n3d": "2박 3일",
    "4n5d": "4박 5일",
    "7n8d": "7박 8일",
  };
  const regionNames = {
    japan: "일본",
    "southeast-asia": "동남아",
    europe: "유럽",
  };
  const regionColors = {
    japan: "#0f766e",
    "southeast-asia": "#2563eb",
    europe: "#d97706",
  };

  const state = {
    style: "standard",
    duration: "4n5d",
  };

  const els = {
    scenarioLine: document.getElementById("otcScenarioLine"),
    lowCity: document.getElementById("otcSummaryLowCity"),
    lowValue: document.getElementById("otcSummaryLowValue"),
    highCity: document.getElementById("otcSummaryHighCity"),
    highValue: document.getElementById("otcSummaryHighValue"),
    avgValue: document.getElementById("otcSummaryAvgValue"),
    region: document.getElementById("otcSummaryRegion"),
    regionValue: document.getElementById("otcSummaryRegionValue"),
    gapValue: document.getElementById("otcSummaryGapValue"),
    gapText: document.getElementById("otcSummaryGapText"),
    flightText: document.getElementById("otcSummaryFlightText"),
    flightValue: document.getElementById("otcSummaryFlightValue"),
    tableBody: document.getElementById("otcCompareTableBody"),
    chart: document.getElementById("otcCompareChart"),
  };

  let chart = null;

  function formatWon(value) {
    const safe = Math.max(0, Math.round(Number(value) || 0));
    return `${safe.toLocaleString("ko-KR")}원`;
  }

  function getRows() {
    const styles = matrix[state.style] || {};
    const rows = Array.isArray(styles[state.duration]) ? styles[state.duration] : [];
    return rows.slice().sort((a, b) => a.total - b.total);
  }

  function syncActiveButtons() {
    document.querySelectorAll("[data-otc-style]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.otcStyle === state.style);
    });
    document.querySelectorAll("[data-otc-duration]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.otcDuration === state.duration);
    });
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("style", state.style);
    url.searchParams.set("duration", state.duration);
    window.history.replaceState({}, "", url);
  }

  function updateScenarioLine() {
    if (!els.scenarioLine) return;
    els.scenarioLine.innerHTML = `현재 기준은 <strong>${styleLabels[state.style]}</strong> · <strong>${durationLabels[state.duration]}</strong>, 성인 <strong>${seed.meta?.persons || 2}인</strong>입니다.`;
  }

  function renderSummary(rows) {
    if (!rows.length) return;

    const lowest = rows[0];
    const highest = rows[rows.length - 1];
    const average = Math.round(rows.reduce((sum, row) => sum + row.total, 0) / rows.length);
    const gap = highest.total - lowest.total;

    const regionBuckets = new Map();
    let maxFlightShare = { row: lowest, share: 0 };

    rows.forEach((row) => {
      const regionId = cityById[row.cityId]?.region || "japan";
      if (!regionBuckets.has(regionId)) regionBuckets.set(regionId, []);
      regionBuckets.get(regionId).push(row.total);

      const share = (row.flight + row.luggage) / Math.max(1, row.total);
      if (share > maxFlightShare.share) maxFlightShare = { row, share };
    });

    let bestRegionId = "japan";
    let bestRegionAvg = Infinity;
    regionBuckets.forEach((values, regionId) => {
      const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
      if (avg < bestRegionAvg) {
        bestRegionAvg = avg;
        bestRegionId = regionId;
      }
    });

    if (els.lowCity) els.lowCity.textContent = cityById[lowest.cityId]?.label || lowest.cityId;
    if (els.lowValue) els.lowValue.textContent = formatWon(lowest.total);
    if (els.highCity) els.highCity.textContent = cityById[highest.cityId]?.label || highest.cityId;
    if (els.highValue) els.highValue.textContent = formatWon(highest.total);
    if (els.avgValue) els.avgValue.textContent = formatWon(average);
    if (els.region) els.region.textContent = regionNames[bestRegionId] || bestRegionId;
    if (els.regionValue) els.regionValue.textContent = `평균 ${formatWon(Math.round(bestRegionAvg))}`;
    if (els.gapValue) els.gapValue.textContent = formatWon(gap);
    if (els.gapText) els.gapText.textContent = `${cityById[lowest.cityId]?.label || lowest.cityId} 대비 ${cityById[highest.cityId]?.label || highest.cityId}`;
    if (els.flightText) els.flightText.textContent = `${cityById[maxFlightShare.row.cityId]?.label || maxFlightShare.row.cityId}는 항공 비중이 큽니다`;
    if (els.flightValue) els.flightValue.textContent = `총액의 약 ${Math.round(maxFlightShare.share * 100)}%가 항공권과 수하물입니다.`;
  }

  function renderTable(rows) {
    if (!els.tableBody) return;

    els.tableBody.innerHTML = rows
      .map((row) => {
        const city = cityById[row.cityId] || {};
        const transportAttraction = (row.transport || 0) + (row.attractions || 0);
        const miscBlock = (row.sim || 0) + (row.insurance || 0) + (row.misc || 0);
        return `
          <tr>
            <td>
              <strong>${city.label || row.cityId}</strong>
              <span>${regionNames[city.region] || city.region || "-"}</span>
            </td>
            <td>${formatWon((row.flight || 0) + (row.luggage || 0))}</td>
            <td>${formatWon(row.accommodation)}</td>
            <td>${formatWon(row.food)}</td>
            <td>${formatWon(transportAttraction)}</td>
            <td>${formatWon(miscBlock)}</td>
            <td class="is-total">${formatWon(row.total)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function renderChart(rows) {
    if (!els.chart || typeof window.Chart === "undefined") return;

    const labels = rows.map((row) => cityById[row.cityId]?.label || row.cityId);
    const data = rows.map((row) => row.total);
    const colors = rows.map((row) => {
      const regionId = cityById[row.cityId]?.region || "japan";
      return regionColors[regionId] || "#64748b";
    });

    const config = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "총예산",
            data,
            backgroundColor: colors,
            borderRadius: 12,
            borderSkipped: false,
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
                return ` ${context.label}: ${formatWon(context.raw)}`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            ticks: {
              callback(value) {
                return `${Number(value).toLocaleString("ko-KR")}원`;
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
    syncActiveButtons();
    syncUrl();
    updateScenarioLine();
    renderSummary(rows);
    renderTable(rows);
    renderChart(rows);
  }

  document.querySelectorAll("[data-otc-style]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.dataset.otcStyle || button.dataset.otcStyle === state.style) return;
      state.style = button.dataset.otcStyle;
      render();
    });
  });

  document.querySelectorAll("[data-otc-duration]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.dataset.otcDuration || button.dataset.otcDuration === state.duration) return;
      state.duration = button.dataset.otcDuration;
      render();
    });
  });

  const params = new URL(window.location.href).searchParams;
  if (params.get("style") && matrix[params.get("style")]) state.style = params.get("style");
  if (params.get("duration") && durationLabels[params.get("duration")]) state.duration = params.get("duration");

  render();
})();
