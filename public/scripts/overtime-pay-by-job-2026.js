(function () {
  const raw = document.getElementById("opjChartData");
  if (!raw) return;

  const data = JSON.parse(raw.textContent || "{}");
  const industries = Array.isArray(data.industries) ? data.industries.slice() : [];
  const disputes = Array.isArray(data.disputes) ? data.disputes.slice() : [];
  const genderAge = Array.isArray(data.genderAge) ? data.genderAge.slice() : [];

  if (!industries.length || typeof Chart === "undefined") return;

  const colors = {
    green900: "#0f3d35",
    green700: "#0f6e56",
    green500: "#25a17c",
    teal300: "#75d4bd",
    blue600: "#2563eb",
    amber500: "#f59e0b",
    red600: "#dc2626",
    slate500: "#64748b",
  };

  const fmtPercent = (value) => `${Math.round(Number(value) * 100)}%`;
  const fmtWon = (value) => `${Math.round(Number(value)).toLocaleString("ko-KR")}원`;

  function buildOvertimeChart() {
    const canvas = document.getElementById("opjOvertimeChart");
    if (!canvas) return;

    const sorted = industries.slice().sort((a, b) => b.monthlyOvertimeHours - a.monthlyOvertimeHours);

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: sorted.map((item) => item.shortLabel),
        datasets: [{
          label: "월평균 야근 시간",
          data: sorted.map((item) => item.monthlyOvertimeHours),
          backgroundColor: ["#0f6e56", "#16896a", "#25a17c", "#55b99c", "#8fd8c3", "#c7eee2"],
          borderRadius: 10,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.parsed.x}시간 추정`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback(value) {
                return `${value}h`;
              },
            },
            grid: { color: "rgba(148, 163, 184, 0.16)" },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  function buildPopalChart() {
    const canvas = document.getElementById("opjPopalChart");
    if (!canvas) return;

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: industries.map((item) => item.shortLabel),
        datasets: [{
          data: industries.map((item) => Math.round(item.popalRate * 100)),
          backgroundColor: ["#dc2626", "#f59e0b", "#ef4444", "#25a17c", "#0f6e56", "#94a3b8"],
          borderColor: "#fff",
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.label}: ${context.parsed}% 추정`;
              },
            },
          },
        },
      },
    });
  }

  function buildDisputeChart() {
    const canvas = document.getElementById("opjDisputeChart");
    if (!canvas || !disputes.length) return;

    new Chart(canvas, {
      type: "line",
      data: {
        labels: disputes.map((item) => `${item.year}년`),
        datasets: [
          {
            label: "분쟁 지수",
            data: disputes.map((item) => item.totalCases),
            borderColor: colors.green700,
            backgroundColor: "rgba(15, 110, 86, 0.12)",
            fill: true,
            tension: 0.32,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "평균 청구액",
            data: disputes.map((item) => Math.round(item.avgAmount / 10000)),
            borderColor: colors.amber500,
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            yAxisID: "y1",
            tension: 0.32,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label(context) {
                if (context.dataset.yAxisID === "y1") {
                  return `평균 청구액: ${Number(context.parsed.y).toLocaleString("ko-KR")}만원`;
                }
                return `분쟁 지수: ${context.parsed.y}천건`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback(value) {
                return `${value}천건`;
              },
            },
          },
          y1: {
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: {
              callback(value) {
                return `${value}만원`;
              },
            },
          },
        },
      },
    });
  }

  function buildGenderAgeChart() {
    const canvas = document.getElementById("opjGenderAgeChart");
    if (!canvas || !genderAge.length) return;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: genderAge.map((item) => item.ageGroup),
        datasets: [
          {
            label: "남성",
            data: genderAge.map((item) => item.maleHours),
            backgroundColor: colors.blue600,
            borderRadius: 8,
          },
          {
            label: "여성",
            data: genderAge.map((item) => item.femaleHours),
            backgroundColor: colors.green500,
            borderRadius: 8,
          },
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
                return `${context.dataset.label}: 월 ${context.parsed.y}시간 추정`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback(value) {
                return `${value}h`;
              },
            },
          },
        },
      },
    });
  }

  buildOvertimeChart();
  buildPopalChart();
  buildDisputeChart();
  buildGenderAgeChart();
})();
