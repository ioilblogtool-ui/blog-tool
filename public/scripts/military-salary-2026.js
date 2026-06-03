/* ============================================================
 * military-salary-2026.js
 * 인터랙션: 병사 차트, 부사관 탭, 장교 탭, 수당 탭, FAQ accordion
 * ============================================================ */

(function () {
  "use strict";

  // ── 부사관 탭 ────────────────────────────────────────────
  function initNcoTabs() {
    const tabs   = document.querySelectorAll(".ml-nco-tab");
    const tables = document.querySelectorAll(".ml-nco-table-wrap");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const key = this.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.dataset.tab === key);
          t.setAttribute("aria-selected", t.dataset.tab === key ? "true" : "false");
        });
        tables.forEach(function (t) {
          t.hidden = t.dataset.tab !== key;
        });
      });
    });
  }

  // ── 장교 탭 ──────────────────────────────────────────────
  function initOfficerTabs() {
    const tabs   = document.querySelectorAll(".ml-officer-tab");
    const tables = document.querySelectorAll(".ml-officer-table-wrap");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const key = this.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.dataset.tab === key);
          t.setAttribute("aria-selected", t.dataset.tab === key ? "true" : "false");
        });
        tables.forEach(function (t) {
          t.hidden = t.dataset.tab !== key;
        });
      });
    });
  }

  // ── 수당 탭 ──────────────────────────────────────────────
  function initAllowanceTabs() {
    const tabs  = document.querySelectorAll(".ts-allowance-tab");
    const lists = document.querySelectorAll(".ts-allowance-list");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const type = this.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.dataset.tab === type);
          t.setAttribute("aria-selected", t.dataset.tab === type ? "true" : "false");
        });
        lists.forEach(function (list) {
          list.hidden = list.dataset.tab !== type;
        });
      });
    });
  }

  // ── 병사 봉급 차트 ────────────────────────────────────────
  function initSoldierChart() {
    const canvas = document.getElementById("ml-soldier-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 220;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const values = JSON.parse(canvas.dataset.values || "[]");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "기본급 (만 원)",
            data: values,
            backgroundColor: [
              "rgba(144, 164, 174, 0.8)",
              "rgba(100, 181, 246, 0.8)",
              "rgba(77, 182, 172, 0.8)",
              "rgba(76, 175, 80, 0.8)",
            ],
            borderColor: [
              "rgba(96, 125, 139, 1)",
              "rgba(30, 136, 229, 1)",
              "rgba(0, 137, 123, 1)",
              "rgba(46, 125, 50, 1)",
            ],
            borderWidth: 1,
            borderRadius: 8,
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
                return " 기본급 " + ctx.parsed.y.toLocaleString("ko-KR") + "만 원";
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 14, weight: "bold" } } },
          y: {
            beginAtZero: true,
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "월 기본급 (만 원)", font: { size: 11 } },
          },
        },
      },
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".ml-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".ml-faq-q");
      const ans = item.querySelector(".ml-faq-a");
      if (!btn || !ans) return;

      btn.addEventListener("click", function () {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        ans.hidden = open;
        item.classList.toggle("is-open", !open);
      });
    });
  }

  // ── 초기화 ───────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    initNcoTabs();
    initOfficerTabs();
    initAllowanceTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initSoldierChart();
    } else {
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initSoldierChart();
        });
      }
    }
  });
})();
