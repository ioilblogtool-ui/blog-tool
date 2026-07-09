(() => {
  const seedEl = document.getElementById("iskChartSeed");
  const canvas = document.getElementById("iskLadderChart");
  if (!seedEl || !canvas || !window.Chart) return;

  const { labels, values, groups } = JSON.parse(seedEl.textContent || "{}");
  if (!Array.isArray(labels) || !labels.length) return;

  const colorFor = (group) => (group === "kinder" ? "rgba(217, 119, 6, 0.75)" : "rgba(26, 86, 219, 0.75)");

  new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "연간 비용(만원)",
          data: values,
          backgroundColor: groups.map(colorFor),
          borderRadius: 6,
          maxBarThickness: 34,
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
              return `연간 비용: ${Number(context.raw || 0).toLocaleString("ko-KR")}만원`;
            },
          },
        },
      },
      scales: {
        x: { ticks: { color: "#4b5563", maxRotation: 60, minRotation: 40 }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: "#6b7280", callback: (v) => `${Number(v).toLocaleString("ko-KR")}만` },
          grid: { color: "rgba(219, 212, 202, 0.5)" },
        },
      },
    },
  });
})();
