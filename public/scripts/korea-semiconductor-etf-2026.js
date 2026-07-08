const categoryTabs = document.getElementById("kseCategoryTabs");
const chartSeedElement = document.getElementById("kseChartSeed");

if (categoryTabs) {
  categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category-tab]");
    if (!button) return;

    const category = button.getAttribute("data-category-tab") || "all";
    categoryTabs.querySelectorAll(".kse-tab-btn").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    document.querySelectorAll("[data-category-row]").forEach((row) => {
      const rowCategory = row.getAttribute("data-category-row");
      row.classList.toggle("is-hidden", !(category === "all" || rowCategory === category));
    });
  });
}

if (chartSeedElement) {
  const seed = JSON.parse(chartSeedElement.textContent || "{}");
  const canvas = document.getElementById("kseAumChart");
  const rows = Array.isArray(seed.etfs) ? seed.etfs : [];

  if (canvas && rows.length && window.Chart) {
    const categoryColor = {
      TOP2: "rgba(26, 86, 219, 0.82)",
      TOP3: "rgba(180, 83, 9, 0.82)",
      BROAD: "rgba(5, 150, 105, 0.82)",
    };

    new window.Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map((item) => item.ticker),
        datasets: [
          {
            label: "순자산(억원)",
            data: rows.map((item) => Number(item.aumKrwBillion || 0)),
            backgroundColor: rows.map((item) => categoryColor[item.category] || "rgba(107, 114, 128, 0.82)"),
            borderRadius: 8,
            maxBarThickness: 40,
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
                const value = Number(context.raw || 0);
                return value >= 10000
                  ? `순자산: ${(value / 10000).toFixed(2)}조원`
                  : `순자산: ${value.toLocaleString("ko-KR")}억원`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#4b5563", maxRotation: 45, minRotation: 25 },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6b7280",
              callback(value) {
                const numeric = Number(value);
                return numeric >= 10000 ? `${(numeric / 10000).toFixed(0)}조` : `${numeric.toLocaleString("ko-KR")}억`;
              },
            },
            grid: { color: "rgba(219, 212, 202, 0.5)" },
          },
        },
      },
    });
  }
}
