(function () {
  "use strict";

  const LABELS = ["신입", "1년차", "3년차", "5년차", "7년차", "10년차", "15년차", "20년차"];
  const SERIES = [
    { id: "big5", label: "빅5", color: "#1f8f8b", data: [6500, 6800, 7500, 8500, 9200, 10200, 11200, 12000] },
    { id: "capital-univ", label: "수도권 대학병원", color: "#239b93", data: [5800, 6000, 6700, 7400, 8000, 8700, 9500, 10000] },
    { id: "general", label: "종합병원", color: "#41b8aa", data: [5200, 5400, 6000, 6600, 7100, 7600, 8200, 8500] },
    { id: "local-small", label: "중소병원", color: "#7ccfc4", data: [4200, 4350, 4700, 5000, 5300, 5600, 6000, 6200] },
    { id: "public-health", label: "공공기관", color: "#4f9fb8", data: [4600, 4750, 5200, 5600, 6000, 6600, 7200, 7800] },
    { id: "rehab-care", label: "요양·재활", color: "#8bbd9e", data: [4500, 4650, 5000, 5500, 5800, 6200, 6600, 6800] },
  ];

  let activeTypeId = null;
  let growthChart = null;

  function openCard(card) {
    const panel = card.querySelector(".ns-hospital-panel");
    const icon = card.querySelector(".ns-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "-";
  }

  function closeCard(card) {
    const panel = card.querySelector(".ns-hospital-panel");
    const icon = card.querySelector(".ns-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "+";
  }

  function initHospitalCards() {
    const grid = document.getElementById("ns-hospital-grid");
    if (!grid) return;

    function toggleCard(card) {
      const typeId = card.dataset.typeId;
      if (!typeId) return;

      if (activeTypeId === typeId) {
        closeCard(card);
        activeTypeId = null;
        return;
      }

      if (activeTypeId) {
        const prev = grid.querySelector(`[data-type-id="${activeTypeId}"]`);
        if (prev) closeCard(prev);
      }

      openCard(card);
      activeTypeId = typeId;
      setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 60);
    }

    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".ns-hospital-card");
      if (!card) return;
      toggleCard(card);
    });

    grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".ns-hospital-card");
      if (!card) return;
      event.preventDefault();
      toggleCard(card);
    });

    const params = new URLSearchParams(window.location.search);
    const selectedType = params.get("type");
    if (selectedType) {
      const target = grid.querySelector(`[data-type-id="${selectedType}"]`);
      if (target) {
        openCard(target);
        activeTypeId = selectedType;
      }
    }
  }

  function initAllowanceTabs() {
    const tabs = document.querySelectorAll(".ns-allowance-tab");
    const lists = document.querySelectorAll(".ns-allowance-list");
    if (!tabs.length || !lists.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const group = tab.dataset.group;
        tabs.forEach((item) => {
          const active = item.dataset.group === group;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", active ? "true" : "false");
        });
        lists.forEach((list) => {
          list.hidden = list.dataset.group !== group;
        });
      });
    });
  }

  function buildDatasets(activeIds) {
    return SERIES.filter((series) => activeIds.includes(series.id)).map((series) => ({
      label: series.label,
      data: series.data,
      backgroundColor: series.color,
      borderColor: series.color,
      borderRadius: 8,
      maxBarThickness: 18,
    }));
  }

  function initGrowthChart() {
    const canvas = document.getElementById("ns-growth-chart");
    const chips = Array.from(document.querySelectorAll(".ns-legend-chip"));
    if (!canvas || typeof Chart === "undefined" || !chips.length) return;

    let activeIds = chips.map((chip) => chip.dataset.seriesId).filter(Boolean);

    growthChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: LABELS,
        datasets: buildDatasets(activeIds),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label}: ${context.raw.toLocaleString("ko-KR")}만원`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#4b5563", font: { size: 11 } },
          },
          y: {
            beginAtZero: false,
            suggestedMin: 3500,
            suggestedMax: 12500,
            ticks: {
              color: "#4b5563",
              callback(value) {
                return `${value.toLocaleString("ko-KR")}만`;
              },
            },
          },
        },
      },
    });

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const id = chip.dataset.seriesId;
        if (!id) return;

        const isActive = chip.classList.contains("is-active");
        if (isActive && activeIds.length === 1) return;

        chip.classList.toggle("is-active", !isActive);
        activeIds = chips
          .filter((item) => item.classList.contains("is-active"))
          .map((item) => item.dataset.seriesId)
          .filter(Boolean);

        growthChart.data.datasets = buildDatasets(activeIds);
        growthChart.update();
      });
    });
  }

  function init() {
    initHospitalCards();
    initAllowanceTabs();
    initGrowthChart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
