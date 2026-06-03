/* ============================================================
 * flight-attendant-salary-2026.js
 * 인터랙션: 항공사 유형 탭, 항공사 카드 accordion, 수당 탭, 차트, FAQ
 * ============================================================ */

(function () {
  "use strict";

  // ── 항공사 유형 탭 (FSC / LCC) ───────────────────────────
  function initAirlineTabs() {
    const tabs  = document.querySelectorAll(".fa-airline-tab");
    const grids = document.querySelectorAll(".fa-airline-grid");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const type = this.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.dataset.tab === type);
          t.setAttribute("aria-selected", t.dataset.tab === type ? "true" : "false");
        });
        grids.forEach(function (g) {
          g.hidden = g.dataset.tab !== type;
        });
        activeAirlineId = null;
      });
    });
  }

  // ── 항공사 카드 accordion ─────────────────────────────────
  let activeAirlineId = null;

  function openPanel(card) {
    const panel = card.querySelector(".fa-airline-panel");
    const icon  = card.querySelector(".fa-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closePanel(card) {
    const panel = card.querySelector(".fa-airline-panel");
    const icon  = card.querySelector(".fa-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initAirlineCards() {
    document.addEventListener("click", function (e) {
      const card = e.target.closest(".fa-airline-card");
      if (!card) return;
      const id = card.dataset.airlineId;

      if (activeAirlineId === id) {
        closePanel(card);
        activeAirlineId = null;
      } else {
        if (activeAirlineId) {
          const prev = document.querySelector(`[data-airline-id="${activeAirlineId}"]`);
          if (prev) closePanel(prev);
        }
        openPanel(card);
        activeAirlineId = id;
        setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".fa-airline-card");
      if (!card) return;
      e.preventDefault();
      card.click();
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

  // ── 직급별 연봉 차트 ─────────────────────────────────────
  function initRankChart() {
    const canvas = document.getElementById("fa-rank-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 260;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const values = JSON.parse(canvas.dataset.values || "[]");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "연 추정 수입 (만 원)",
            data: values,
            backgroundColor: "rgba(25, 118, 210, 0.7)",
            borderColor: "rgba(13, 71, 161, 1)",
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
                return " 연 수입 약 " + ctx.parsed.y.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: { ticks: { font: { size: 13 } } },
          y: {
            beginAtZero: true,
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "연 추정 수입 (만 원)", font: { size: 11 } },
          },
        },
      },
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".fa-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".fa-faq-q");
      const ans = item.querySelector(".fa-faq-a");
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
    initAirlineTabs();
    initAirlineCards();
    initAllowanceTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initRankChart();
    } else {
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initRankChart();
        });
      }
    }
  });
})();
