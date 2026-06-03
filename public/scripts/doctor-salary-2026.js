/* ============================================================
 * doctor-salary-2026.js
 * 인터랙션: 근무형태 카드 accordion, 전공 탭, 수당 탭, 차트, FAQ accordion
 * ============================================================ */

(function () {
  "use strict";

  // ── 근무형태 카드 accordion ───────────────────────────────
  let activeTypeId = null;

  function openTypePanel(card) {
    const panel = card.querySelector(".dr-type-panel");
    const icon = card.querySelector(".dr-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closeTypePanel(card) {
    const panel = card.querySelector(".dr-type-panel");
    const icon = card.querySelector(".dr-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initTypeCards() {
    const grid = document.getElementById("dr-type-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".dr-type-card");
      if (!card) return;
      const typeId = card.dataset.typeId;

      if (activeTypeId === typeId) {
        closeTypePanel(card);
        activeTypeId = null;
      } else {
        if (activeTypeId) {
          const prev = grid.querySelector(`[data-type-id="${activeTypeId}"]`);
          if (prev) closeTypePanel(prev);
        }
        openTypePanel(card);
        activeTypeId = typeId;
        setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
      }
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".dr-type-card");
      if (!card) return;
      e.preventDefault();
      card.click();
    });
  }

  // ── 전공 탭 ──────────────────────────────────────────────
  function initSpecialtyTabs() {
    const tabs = document.querySelectorAll(".dr-specialty-tab");
    const tables = document.querySelectorAll(".dr-specialty-table-wrap");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const type = this.dataset.tab;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.dataset.tab === type);
          t.setAttribute("aria-selected", t.dataset.tab === type ? "true" : "false");
        });
        tables.forEach(function (table) {
          table.hidden = table.dataset.tab !== type;
        });
      });
    });
  }

  // ── 수당 탭 (teacher-salary와 동일 클래스 재사용) ────────
  function initAllowanceTabs() {
    const tabs = document.querySelectorAll(".ts-allowance-tab");
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

  // ── 수련 단계별 연봉 차트 ────────────────────────────────
  function initResidentChart() {
    const canvas = document.getElementById("dr-resident-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 300;

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
            backgroundColor: "rgba(66, 133, 244, 0.7)",
            borderColor: "rgba(30, 90, 200, 1)",
            borderWidth: 1,
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
                return " 연 수입 약 " + ctx.parsed.x.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "연 추정 수입 (만 원)", font: { size: 11 } },
          },
          y: { ticks: { font: { size: 13 } } },
        },
      },
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".dr-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".dr-faq-q");
      const ans = item.querySelector(".dr-faq-a");
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
    initTypeCards();
    initSpecialtyTabs();
    initAllowanceTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initResidentChart();
    } else {
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initResidentChart();
        });
      }
    }
  });
})();
