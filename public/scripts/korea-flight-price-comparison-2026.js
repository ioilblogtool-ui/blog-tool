(function () {
  "use strict";

  const seedNode = document.getElementById("koreaFlightPriceComparison2026Data");
  if (!seedNode) return;

  const seed = JSON.parse(seedNode.textContent || "{}");
  const routes = Array.isArray(seed.routes) ? seed.routes : [];
  const bookingIndex = Array.isArray(seed.bookingIndex) ? seed.bookingIndex : [];
  const carrierComparisons = Array.isArray(seed.carrierComparisons) ? seed.carrierComparisons : [];
  const regionLabels = seed.regionLabels || {};
  if (!routes.length) return;

  const routeById = Object.fromEntries(routes.map((route) => [route.id, route]));
  const regionNotes = {
    japan: "단거리 특가와 성수기 변동폭을 같이 봐야 합니다.",
    southeastAsia: "항공권 비중이 크고 연말·방학 구간 변동이 큽니다.",
    chinaTaiwan: "주말 단기 여행 수요와 연휴 효과가 강합니다.",
    europe: "여름 성수기와 조기 예약 여부가 가격을 크게 가릅니다.",
    americas: "장거리 직항 프리미엄과 경유 절감액을 비교해야 합니다.",
    oceania: "한국 겨울이 현지 성수기라 12~2월 가격이 높습니다.",
  };

  const state = {
    region: "japan",
    bookingWindow: "d60",
    carrierMode: "total",
  };

  const els = {
    currentRegion: document.getElementById("kfpCurrentRegion"),
    currentRegionNote: document.getElementById("kfpCurrentRegionNote"),
    regionCheapest: document.getElementById("kfpRegionCheapest"),
    regionCheapestValue: document.getElementById("kfpRegionCheapestValue"),
    regionWatch: document.getElementById("kfpRegionWatch"),
    regionWatchText: document.getElementById("kfpRegionWatchText"),
    routeTableBody: document.getElementById("kfpRouteTableBody"),
    carrierTableBody: document.getElementById("kfpCarrierTableBody"),
    bookingLabel: document.getElementById("kfpBookingLabel"),
    bookingComment: document.getElementById("kfpBookingComment"),
    shortIndex: document.getElementById("kfpShortIndex"),
    midIndex: document.getElementById("kfpMidIndex"),
    longIndex: document.getElementById("kfpLongIndex"),
    bookingChart: document.getElementById("kfpBookingChart"),
  };

  let bookingChart = null;

  function formatManwon(value) {
    const safe = Math.max(0, Math.round(Number(value) || 0));
    return `${Math.round(safe / 10000).toLocaleString("ko-KR")}만원`;
  }

  function formatRange(range) {
    if (!range) return "조사 필요";
    return `${formatManwon(range.min)}~${formatManwon(range.max)}`;
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("region", state.region);
    url.searchParams.set("window", state.bookingWindow);
    url.searchParams.set("mode", state.carrierMode);
    window.history.replaceState({}, "", url);
  }

  function restoreFromUrl() {
    const url = new URL(window.location.href);
    const region = url.searchParams.get("region");
    const bookingWindow = url.searchParams.get("window");
    const mode = url.searchParams.get("mode");

    if (region && routes.some((route) => route.region === region)) state.region = region;
    if (bookingWindow && bookingIndex.some((point) => point.window === bookingWindow)) {
      state.bookingWindow = bookingWindow;
    }
    if (mode === "base" || mode === "total") state.carrierMode = mode;
  }

  function getRegionRoutes() {
    return routes.filter((route) => route.region === state.region);
  }

  function getRegularAverage(route) {
    return Math.round((route.prices.regular.min + route.prices.regular.max) / 2);
  }

  function getPeakGap(route) {
    return route.prices.peak.max - route.prices.offseason.min;
  }

  function syncActiveButtons() {
    document.querySelectorAll("[data-kfp-region]").forEach((button) => {
      const active = button.dataset.kfpRegion === state.region;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    document.querySelectorAll("[data-kfp-window]").forEach((button) => {
      const active = button.dataset.kfpWindow === state.bookingWindow;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    document.querySelectorAll("[data-kfp-carrier-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.kfpCarrierMode === state.carrierMode);
    });
  }

  function renderRegionSummary() {
    const regionRoutes = getRegionRoutes();
    if (!regionRoutes.length) return;

    const cheapest = regionRoutes.slice().sort((a, b) => getRegularAverage(a) - getRegularAverage(b))[0];
    const watch = regionRoutes.slice().sort((a, b) => getPeakGap(b) - getPeakGap(a))[0];

    if (els.currentRegion) els.currentRegion.textContent = regionLabels[state.region] || state.region;
    if (els.currentRegionNote) els.currentRegionNote.textContent = regionNotes[state.region] || "";
    if (els.regionCheapest) els.regionCheapest.textContent = cheapest.destinationKo;
    if (els.regionCheapestValue) els.regionCheapestValue.textContent = formatRange(cheapest.prices.regular);
    if (els.regionWatch) els.regionWatch.textContent = watch.destinationKo;
    if (els.regionWatchText) els.regionWatchText.textContent = watch.note;
  }

  function renderRouteTable() {
    if (!els.routeTableBody) return;

    els.routeTableBody.innerHTML = getRegionRoutes()
      .map((route) => `
        <tr>
          <td>
            <strong>${route.origin}-${route.destination}</strong>
            <span>${route.destinationKo} · ${route.countryKo}</span>
          </td>
          <td>${formatRange(route.prices.offseason)}</td>
          <td>${formatRange(route.prices.regular)}</td>
          <td>${formatRange(route.prices.peak)}</td>
          <td>${formatManwon(route.prices.superPeak.min)}+</td>
          <td><span class="kfp-badge">${route.priceFeel}</span></td>
          <td>${route.note}</td>
        </tr>
      `)
      .join("");
  }

  function renderCarrierTable() {
    if (!els.carrierTableBody) return;

    els.carrierTableBody.innerHTML = carrierComparisons
      .map((item) => {
        const route = routeById[item.routeId] || {};
        const displayAmount = state.carrierMode === "base" ? item.baseFare : item.total;
        return `
          <tr>
            <td>${route.destinationKo || item.routeId}</td>
            <td>${item.label}</td>
            <td class="is-money">${formatManwon(displayAmount)}</td>
            <td>${item.baggage > 0 ? formatManwon(item.baggage) : "포함/없음"}</td>
            <td>${item.seatSelection > 0 ? formatManwon(item.seatSelection) : "포함/없음"}</td>
            <td>${item.verdict}</td>
          </tr>
        `;
      })
      .join("");
  }

  function renderBookingComment() {
    const point = bookingIndex.find((item) => item.window === state.bookingWindow) || bookingIndex[1];
    if (!point) return;

    if (els.bookingLabel) els.bookingLabel.textContent = point.label;
    if (els.bookingComment) els.bookingComment.textContent = point.comment;
    if (els.shortIndex) els.shortIndex.textContent = point.shortHaulIndex;
    if (els.midIndex) els.midIndex.textContent = point.midHaulIndex;
    if (els.longIndex) els.longIndex.textContent = point.longHaulIndex;
  }

  function renderBookingChart() {
    if (!els.bookingChart || typeof window.Chart === "undefined") return;

    const labels = bookingIndex.map((point) => point.label);
    const datasets = [
      {
        label: "단거리",
        data: bookingIndex.map((point) => point.shortHaulIndex),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.12)",
        tension: 0.35,
      },
      {
        label: "중거리",
        data: bookingIndex.map((point) => point.midHaulIndex),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        tension: 0.35,
      },
      {
        label: "장거리",
        data: bookingIndex.map((point) => point.longHaulIndex),
        borderColor: "#d97706",
        backgroundColor: "rgba(217, 119, 6, 0.12)",
        tension: 0.35,
      },
    ];

    const selectedIndex = bookingIndex.findIndex((point) => point.window === state.bookingWindow);

    if (bookingChart) {
      bookingChart.data.labels = labels;
      bookingChart.data.datasets = datasets;
      bookingChart.options.scales.x.ticks.color = function (context) {
        return context.index === selectedIndex ? "#0f766e" : "#64748b";
      };
      bookingChart.update();
      return;
    }

    bookingChart = new window.Chart(els.bookingChart.getContext("2d"), {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label(context) {
                return ` ${context.dataset.label}: 지수 ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color(context) {
                return context.index === selectedIndex ? "#0f766e" : "#64748b";
              },
            },
          },
          y: {
            suggestedMin: 80,
            suggestedMax: 210,
            ticks: {
              callback(value) {
                return `${value}`;
              },
            },
          },
        },
      },
    });
  }

  function render() {
    syncActiveButtons();
    renderRegionSummary();
    renderRouteTable();
    renderCarrierTable();
    renderBookingComment();
    renderBookingChart();
  }

  function bindEvents() {
    document.querySelectorAll("[data-kfp-region]").forEach((button) => {
      button.addEventListener("click", () => {
        state.region = button.dataset.kfpRegion || "japan";
        render();
        syncUrl();
      });
    });

    document.querySelectorAll("[data-kfp-window]").forEach((button) => {
      button.addEventListener("click", () => {
        state.bookingWindow = button.dataset.kfpWindow || "d60";
        render();
        syncUrl();
      });
    });

    document.querySelectorAll("[data-kfp-carrier-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.carrierMode = button.dataset.kfpCarrierMode || "total";
        render();
        syncUrl();
      });
    });
  }

  function init() {
    restoreFromUrl();
    bindEvents();
    render();
  }

  init();
})();
