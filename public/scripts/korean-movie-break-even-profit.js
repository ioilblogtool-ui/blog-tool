(function () {
  "use strict";

  const dataEl = document.getElementById("kmbepReportData");
  if (!dataEl) return;

  let report;
  try {
    report = JSON.parse(dataEl.textContent || "{}");
  } catch {
    return;
  }

  const movies = report.movies || [];

  // ── 비교표 정렬 ────────────────────────────────────────
  const tableBody = document.getElementById("kmbepTableBody");
  const sortTabs = document.getElementById("kmbepSortTabs");

  if (tableBody && sortTabs) {
    sortTabs.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-sort]");
      if (!btn) return;
      sortTabs.querySelectorAll(".kmbep-tab-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      sortMovies(btn.dataset.sort);
    });
  }

  function sortMovies(mode) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((a, b) => {
      if (mode === "audienceDesc") {
        return Number(b.dataset.audience) - Number(a.dataset.audience);
      }
      if (mode === "productionCostAsc") {
        const ca = Number(a.dataset.cost);
        const cb = Number(b.dataset.cost);
        if (ca === 9999 && cb === 9999) return 0;
        if (ca === 9999) return 1;
        if (cb === 9999) return -1;
        return ca - cb;
      }
      if (mode === "roiDesc") {
        const ra = Number(a.dataset.roi);
        const rb = Number(b.dataset.roi);
        if (ra === -1 && rb === -1) return 0;
        if (ra === -1) return 1;
        if (rb === -1) return -1;
        return rb - ra;
      }
      return 0;
    });
    rows.forEach((row) => tableBody.appendChild(row));
  }

  // ── 차트 ───────────────────────────────────────────────
  const chartTabsEl = document.getElementById("kmbepChartTabs");
  if (!chartTabsEl || typeof Chart === "undefined") return;

  let audienceChartInstance = null;
  let revenueChartInstance = null;
  let roiChartInstance = null;

  const panelMap = {
    audience: document.getElementById("kmbepChartAudience"),
    revenue: document.getElementById("kmbepChartRevenue"),
    roi: document.getElementById("kmbepChartRoi"),
  };

  // 관객 수 내림차순 top 12
  const sorted = [...movies].sort((a, b) => b.audienceCount - a.audienceCount).slice(0, 12);

  const COLORS = {
    gold: "rgba(251, 191, 36, 0.85)",
    goldBorder: "rgba(217, 119, 6, 1)",
    green: "rgba(52, 211, 153, 0.85)",
    greenBorder: "rgba(5, 150, 105, 1)",
    blue: "rgba(96, 165, 250, 0.85)",
    blueBorder: "rgba(37, 99, 235, 1)",
    red: "rgba(248, 113, 113, 0.85)",
    redBorder: "rgba(185, 28, 28, 1)",
  };

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 12 }, padding: 14 },
      },
    },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 } } },
      y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { font: { size: 11 } } },
    },
  };

  // ── 차트 1: 관객 수 비교 (horizontal bar) ───────────────
  function buildAudienceChart() {
    if (audienceChartInstance) return;
    const ctx = document.getElementById("kmbepAudienceChart");
    if (!ctx) return;

    audienceChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sorted.map((m) => m.title),
        datasets: [
          {
            label: "관객 수 (만 명)",
            data: sorted.map((m) => m.audienceCount),
            backgroundColor: sorted.map((m) =>
              m.audienceCount >= 1500
                ? COLORS.gold
                : m.audienceCount >= 1200
                ? COLORS.green
                : COLORS.blue
            ),
            borderColor: sorted.map((m) =>
              m.audienceCount >= 1500
                ? COLORS.goldBorder
                : m.audienceCount >= 1200
                ? COLORS.greenBorder
                : COLORS.blueBorder
            ),
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...chartDefaults,
        indexAxis: "y",
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x.toLocaleString("ko-KR")}만 명`,
            },
          },
        },
        scales: {
          x: {
            ...chartDefaults.scales.x,
            title: { display: true, text: "관객 수 (만 명)", font: { size: 11 } },
            ticks: {
              font: { size: 11 },
              callback: (v) => `${v.toLocaleString()}만`,
            },
          },
          y: { ...chartDefaults.scales.y },
        },
      },
    });
  }

  // ── 차트 2: 제작비 vs 박스오피스 (grouped bar) ───────────
  function buildRevenueChart() {
    if (revenueChartInstance) return;
    const ctx = document.getElementById("kmbepRevenueChart");
    if (!ctx) return;

    const known = [...movies]
      .filter((m) => m.productionCost !== null)
      .sort((a, b) => b.audienceCount - a.audienceCount)
      .slice(0, 12);

    revenueChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: known.map((m) => m.title),
        datasets: [
          {
            label: "제작비 (억 원)",
            data: known.map((m) => m.productionCost),
            backgroundColor: COLORS.red,
            borderColor: COLORS.redBorder,
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: "박스오피스 (억 원)",
            data: known.map((m) => m.boxOfficeRevenue),
            backgroundColor: COLORS.green,
            borderColor: COLORS.greenBorder,
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString("ko-KR")}억`,
            },
          },
        },
        scales: {
          x: { ...chartDefaults.scales.x, ticks: { font: { size: 10 }, maxRotation: 35 } },
          y: {
            ...chartDefaults.scales.y,
            title: { display: true, text: "금액 (억 원)", font: { size: 11 } },
            ticks: {
              font: { size: 11 },
              callback: (v) => `${v.toLocaleString()}억`,
            },
          },
        },
      },
    });
  }

  // ── 차트 3: 추정 ROI 비교 (horizontal bar) ───────────────
  function buildRoiChart() {
    if (roiChartInstance) return;
    const ctx = document.getElementById("kmbepRoiChart");
    if (!ctx) return;

    const roiMovies = [...movies]
      .filter((m) => m.roi !== null)
      .sort((a, b) => b.roi - a.roi);

    roiChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: roiMovies.map((m) => m.title),
        datasets: [
          {
            label: "추정 ROI (%)",
            data: roiMovies.map((m) => m.roi),
            backgroundColor: roiMovies.map((m) =>
              m.roi >= 1000 ? COLORS.gold : m.roi >= 500 ? COLORS.green : COLORS.blue
            ),
            borderColor: roiMovies.map((m) =>
              m.roi >= 1000 ? COLORS.goldBorder : m.roi >= 500 ? COLORS.greenBorder : COLORS.blueBorder
            ),
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        ...chartDefaults,
        indexAxis: "y",
        plugins: {
          ...chartDefaults.plugins,
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` 추정 ROI ${ctx.parsed.x.toLocaleString("ko-KR")}% (추정)`,
            },
          },
        },
        scales: {
          x: {
            ...chartDefaults.scales.x,
            title: { display: true, text: "추정 ROI (%)", font: { size: 11 } },
            ticks: {
              font: { size: 11 },
              callback: (v) => `${v.toLocaleString()}%`,
            },
          },
          y: { ...chartDefaults.scales.y },
        },
      },
    });
  }

  // ── 차트 탭 이벤트 ─────────────────────────────────────
  chartTabsEl.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-chart]");
    if (!btn) return;

    const mode = btn.dataset.chart;
    chartTabsEl.querySelectorAll(".kmbep-tab-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    Object.keys(panelMap).forEach((key) => {
      const panel = panelMap[key];
      if (panel) panel.hidden = key !== mode;
    });

    if (mode === "audience") buildAudienceChart();
    if (mode === "revenue") buildRevenueChart();
    if (mode === "roi") buildRoiChart();
  });

  // 초기 로드 시 차트 1 바로 렌더링
  buildAudienceChart();
})();
