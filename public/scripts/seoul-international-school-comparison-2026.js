(() => {
  const seedEl = document.getElementById("siscChartSeed");
  const canvas = document.getElementById("siscRankingChart");
  if (!seedEl || !canvas || !window.Chart) return;

  const { labels, values } = JSON.parse(seedEl.textContent || "{}");
  if (!Array.isArray(labels) || !labels.length) return;

  new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "대표 학년 연간 학비(만원)",
          data: values,
          backgroundColor: "rgba(26, 86, 219, 0.7)",
          borderRadius: 6,
          maxBarThickness: 44,
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
              return `연간 학비: ${Number(context.raw || 0).toLocaleString("ko-KR")}만원`;
            },
          },
        },
      },
      scales: {
        x: { ticks: { color: "#4b5563" }, grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { color: "#6b7280", callback: (v) => `${Number(v).toLocaleString("ko-KR")}만` },
          grid: { color: "rgba(219, 212, 202, 0.5)" },
        },
      },
    },
  });
})();
