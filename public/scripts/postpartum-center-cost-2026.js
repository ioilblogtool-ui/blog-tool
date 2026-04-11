(function () {
  "use strict";

  if (typeof Chart === "undefined") return;

  const regionCanvas = document.getElementById("pc-region-chart");
  if (regionCanvas) {
    new Chart(regionCanvas, {
      type: "bar",
      data: {
        labels: ["서울", "광주", "인천", "경기", "부산", "전국 평균"],
        datasets: [
          { label: "일반실 평균", data: [506, 407, 396, 438, 368, 372], backgroundColor: "#d48c5b", borderRadius: 8 },
          { label: "특실 평균", data: [810, null, null, 622, 520, 543], backgroundColor: "#8a5a44", borderRadius: 8 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label(context) {
                if (context.raw == null) return `${context.dataset.label}: 데이터 제한`;
                return `${context.dataset.label}: ${Number(context.raw).toLocaleString("ko-KR")}만원`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback(value) {
                return `${value.toLocaleString("ko-KR")}만`;
              },
            },
          },
        },
      },
    });
  }

  const trendCanvas = document.getElementById("pc-trend-chart");
  if (trendCanvas) {
    new Chart(trendCanvas, {
      type: "line",
      data: {
        labels: ["2021", "2024", "2024H2 일반실", "2025H2 일반실", "2024H2 특실", "2025H2 특실"],
        datasets: [
          {
            label: "평균 비용 추이",
            data: [243.1, 286.5, 355, 372, 520, 543],
            borderColor: "#8a5a44",
            backgroundColor: "rgba(138, 90, 68, 0.12)",
            fill: true,
            tension: 0.28,
            pointRadius: 4,
            pointHoverRadius: 6,
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
                return `평균 비용: ${Number(context.raw).toLocaleString("ko-KR")}만원`;
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback(value) {
                return `${value.toLocaleString("ko-KR")}만`;
              },
            },
          },
        },
      },
    });
  }
})();
