(function () {
  "use strict";

  const state = {
    scenario: "reform", // "reform" | "old"
    timing: "normal",   // "early" | "normal" | "defer"
  };

  let contributionChart = null;
  let pensionChart = null;
  let ratioChart = null;

  // ── 보험료율 step line chart ────────────────────────────────────────────────
  function initRateChart() {
    const canvas = document.getElementById("np-rate-chart");
    if (!canvas || typeof Chart === "undefined") return;
    canvas.height = 260;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const values = JSON.parse(canvas.dataset.values || "[]");

    new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "보험료율 (%)",
            data: values,
            borderColor: "rgba(76, 175, 141, 1)",
            backgroundColor: "rgba(76, 175, 141, 0.1)",
            pointBackgroundColor: "rgba(46, 125, 114, 1)",
            pointRadius: 5,
            stepped: true,
            fill: true,
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
              label: function (ctx) {
                return " 보험료율 " + ctx.parsed.y + "%";
              },
            },
          },
        },
        scales: {
          y: {
            min: 8,
            max: 14,
            ticks: {
              callback: function (v) {
                return v + "%";
              },
            },
            title: { display: true, text: "보험료율 (%)", font: { size: 11 } },
          },
        },
      },
    });
  }

  // ── 세대별 납입 총액 grouped bar ────────────────────────────────────────────
  function initContributionChart() {
    const canvas = document.getElementById("np-contribution-chart");
    if (!canvas || typeof Chart === "undefined") return;
    canvas.height = 300;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const old = JSON.parse(canvas.dataset.old || "[]");
    const reform = JSON.parse(canvas.dataset.reform || "[]");

    contributionChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "개혁 전",
            data: old,
            backgroundColor: "rgba(144, 164, 174, 0.6)",
            borderColor: "rgba(96, 125, 139, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "개혁 반영",
            data: reform,
            backgroundColor: "rgba(76, 175, 141, 0.7)",
            borderColor: "rgba(46, 125, 114, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return (
                  " " +
                  ctx.dataset.label +
                  ": 약 " +
                  ctx.parsed.y.toLocaleString("ko-KR") +
                  "만원 (시뮬레이션)"
                );
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (v) {
                return v + "만";
              },
            },
            title: {
              display: true,
              text: "납입 총액 (만원, 시뮬레이션)",
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  // ── 세대별 예상 수령액 bar ──────────────────────────────────────────────────
  function initPensionChart() {
    const canvas = document.getElementById("np-pension-chart");
    if (!canvas || typeof Chart === "undefined") return;
    canvas.height = 280;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const old = JSON.parse(canvas.dataset.old || "[]");
    const reform = JSON.parse(canvas.dataset.reform || "[]");

    pensionChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "개혁 전",
            data: old,
            backgroundColor: "rgba(144, 164, 174, 0.6)",
            borderColor: "rgba(96, 125, 139, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "개혁 반영",
            data: reform,
            backgroundColor: "rgba(76, 175, 141, 0.7)",
            borderColor: "rgba(46, 125, 114, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "top" },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return (
                  " " +
                  ctx.dataset.label +
                  ": 약 " +
                  ctx.parsed.y +
                  "만원/월 (시뮬레이션)"
                );
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (v) {
                return v + "만";
              },
            },
            title: {
              display: true,
              text: "월 수령액 (만원, 시뮬레이션)",
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  // ── 수익비 horizontal bar ───────────────────────────────────────────────────
  function initRatioChart() {
    const canvas = document.getElementById("np-ratio-chart");
    if (!canvas || typeof Chart === "undefined") return;
    canvas.height = 260;

    const labels = JSON.parse(canvas.dataset.labels || "[]");

    function getData() {
      return JSON.parse(canvas.dataset[state.timing] || "[]");
    }

    ratioChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "수익비 (시뮬레이션)",
            data: getData(),
            backgroundColor: "rgba(76, 175, 141, 0.7)",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " 수익비 " + ctx.parsed.x.toFixed(2) + " (시뮬레이션)";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "수익비 (총수령 ÷ 총납입, 시뮬레이션)",
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  function updateRatioChart() {
    if (!ratioChart) return;
    const canvas = document.getElementById("np-ratio-chart");
    ratioChart.data.datasets[0].data = JSON.parse(
      canvas.dataset[state.timing] || "[]"
    );
    ratioChart.update();
  }

  // ── OECD horizontal bar ─────────────────────────────────────────────────────
  function initOecdChart() {
    const canvas = document.getElementById("np-oecd-chart");
    if (!canvas || typeof Chart === "undefined") return;
    canvas.height = 320;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const values = JSON.parse(canvas.dataset.values || "[]");

    const colors = labels.map(function (l) {
      return l.includes("한국")
        ? "rgba(76, 175, 141, 0.9)"
        : "rgba(74, 144, 217, 0.5)";
    });

    new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "소득대체율 (%)",
            data: values,
            backgroundColor: colors,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " 소득대체율 약 " + ctx.parsed.x + "%";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 110,
            ticks: {
              callback: function (v) {
                return v + "%";
              },
            },
          },
        },
      },
    });
  }

  // ── 시나리오 버튼 ────────────────────────────────────────────────────────────
  function initScenarioBtns() {
    const btns = document.querySelectorAll(".np-scenario-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.scenario = btn.dataset.scenario;
        btns.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });
  }

  // ── 수령 방식 탭 ─────────────────────────────────────────────────────────────
  function initTimingTabs() {
    const tabs = document.querySelectorAll(".np-timing-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.timing = tab.dataset.timing;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        updateRatioChart();
      });
    });
  }

  // ── FAQ 아코디언 ─────────────────────────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".np-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".np-faq-q");
      const ans = item.querySelector(".np-faq-a");
      const icon = item.querySelector(".np-faq-icon");
      if (!btn || !ans) return;
      btn.addEventListener("click", function () {
        const isOpen = !ans.hidden;
        ans.hidden = isOpen;
        if (icon) icon.textContent = isOpen ? "＋" : "－";
      });
    });
  }

  // ── 초기화 ───────────────────────────────────────────────────────────────────
  function initCharts() {
    initRateChart();
    initContributionChart();
    initPensionChart();
    initRatioChart();
    initOecdChart();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScenarioBtns();
    initTimingTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initCharts();
    } else {
      var s = document.querySelector('script[src*="chart"]');
      if (s) {
        s.addEventListener("load", initCharts);
      }
    }
  });
})();
