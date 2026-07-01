(function () {
  "use strict";

  // ─── Data ──────────────────────────────────────────────────────────────────

  const dataEl = document.getElementById("sdar-data");
  if (!dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const districts = DATA.districts || [];

  // ─── Sort State ────────────────────────────────────────────────────────────

  let currentSort = "price"; // "price" | "change" | "jeonse"

  function getSortValue(d, sort) {
    if (sort === "price") return d.latestPriceManwon;
    if (sort === "change") return d.yoyChangePercent;
    if (sort === "jeonse") return d.jeonseRatio ?? -1;
    return 0;
  }

  function getSorted(sort) {
    return [...districts].sort((a, b) => getSortValue(b, sort) - getSortValue(a, sort));
  }

  // ─── Format helpers ────────────────────────────────────────────────────────

  function formatEok(manwon) {
    if (!manwon || manwon === 0) return "-";
    const eok = manwon / 10000;
    if (eok >= 100) return Math.round(eok) + "억";
    if (Number.isInteger(eok)) return eok + "억";
    return eok.toFixed(1) + "억";
  }

  function formatChange(pct) {
    if (!pct || pct === 0) return "-";
    const sign = pct > 0 ? "+" : "";
    return sign + pct.toFixed(1) + "%";
  }

  function changeClass(pct) {
    if (!pct || pct === 0) return "is-none";
    return pct > 0 ? "is-up" : "is-down";
  }

  function badgeHtml(status) {
    if (status === "추정") return '<span class="sdar-badge sdar-badge--est">추정</span>';
    if (status === "참고") return '<span class="sdar-badge sdar-badge--ref">참고</span>';
    return "";
  }

  function linkHtml(slug) {
    if (!slug) return '<span class="sdar-td-link"><span>준비 중</span></span>';
    return `<td class="sdar-td-link"><a href="/reports/${slug}/">상세 보기</a></td>`;
  }

  // ─── Table Render ──────────────────────────────────────────────────────────

  const tbody = document.getElementById("sdar-tbody");

  function renderTable(sort) {
    if (!tbody) return;
    const sorted = getSorted(sort);
    tbody.innerHTML = sorted
      .map(
        (d, i) => `
      <tr>
        <td class="sdar-td-rank">${i + 1}</td>
        <td class="sdar-td-district">${d.districtName}${badgeHtml(d.status)}</td>
        <td class="sdar-td-price">${formatEok(d.latestPriceManwon)}</td>
        <td class="sdar-td-change ${changeClass(d.yoyChangePercent)}">${formatChange(d.yoyChangePercent)}</td>
        <td class="sdar-td-jeonse">${d.jeonseRatio != null ? d.jeonseRatio + "%" : "-"}</td>
        <td class="sdar-td-complex">${d.representativeComplex}</td>
        ${d.reportSlug
          ? `<td class="sdar-td-link"><a href="/reports/${d.reportSlug}/">상세 보기</a></td>`
          : `<td class="sdar-td-link"><span>준비 중</span></td>`}
      </tr>`
      )
      .join("");
  }

  // ─── Sort Tabs ─────────────────────────────────────────────────────────────

  const tabs = document.querySelectorAll(".sdar-sort-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const sort = this.dataset.sort;
      if (sort === currentSort) return;
      currentSort = sort;
      tabs.forEach((t) => t.classList.remove("is-active"));
      this.classList.add("is-active");
      renderTable(sort);
    });
  });

  // ─── Bar Chart ─────────────────────────────────────────────────────────────

  function initChart() {
    const canvas = document.getElementById("sdar-bar-chart");
    if (!canvas || typeof Chart === "undefined") return;

    const sorted = getSorted("price");
    const labels = sorted.map((d) => d.districtName);
    const values = sorted.map((d) => d.latestPriceManwon / 10000);

    const bgColors = sorted.map((d, i) => {
      if (i < 3) return "rgba(26, 86, 219, 0.85)";      // top3 진한 파랑
      if (i >= sorted.length - 2) return "rgba(107, 114, 128, 0.5)"; // 하위 회색
      return "rgba(26, 86, 219, 0.45)";
    });

    new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "대표 매매가 (억)",
            data: values,
            backgroundColor: bgColors,
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
              label: (ctx) => " " + ctx.parsed.x.toFixed(1) + "억",
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: {
              callback: (v) => v + "억",
              font: { size: 11 },
            },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
        },
      },
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────────

  renderTable(currentSort);
  initChart();
})();
