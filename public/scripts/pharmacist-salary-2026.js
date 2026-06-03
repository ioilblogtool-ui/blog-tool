/* ============================================================
 * pharmacist-salary-2026.js
 * 인터랙션: 근무형태 카드 accordion, 수당 탭, 경력 비교 차트, FAQ accordion
 * ============================================================ */

(function () {
  "use strict";

  // ── 근무형태 카드 accordion ───────────────────────────────
  let activeTypeId = null;

  function openTypePanel(card) {
    const panel = card.querySelector(".ph-type-panel");
    const icon  = card.querySelector(".ph-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closeTypePanel(card) {
    const panel = card.querySelector(".ph-type-panel");
    const icon  = card.querySelector(".ph-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initTypeCards() {
    const grid = document.getElementById("ph-type-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".ph-type-card");
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
      const card = e.target.closest(".ph-type-card");
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

  // ── 경력별 비교 꺾은선 차트 ─────────────────────────────
  function initCareerChart() {
    const canvas = document.getElementById("ph-career-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 300;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const hosp   = JSON.parse(canvas.dataset.hosp   || "[]");
    const com    = JSON.parse(canvas.dataset.com    || "[]");

    new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "병원 약사 (추정 평균, 만 원)",
            data: hosp,
            borderColor: "rgba(66, 133, 244, 1)",
            backgroundColor: "rgba(66, 133, 244, 0.1)",
            pointBackgroundColor: "rgba(30, 90, 200, 1)",
            pointRadius: 5,
            tension: 0.3,
            fill: true,
          },
          {
            label: "약국 봉직약사 (추정 평균, 만 원)",
            data: com,
            borderColor: "rgba(76, 175, 141, 1)",
            backgroundColor: "rgba(76, 175, 141, 0.08)",
            pointBackgroundColor: "rgba(46, 125, 114, 1)",
            pointRadius: 5,
            tension: 0.3,
            fill: true,
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
                return " " + ctx.dataset.label.split("(")[0].trim() + ": 약 " + ctx.parsed.y.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { font: { size: 13 } },
            title: { display: true, text: "경력 구간", font: { size: 12 } },
          },
          y: {
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "연봉 평균 추정 (만 원)", font: { size: 12 } },
          },
        },
      },
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".ph-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".ph-faq-q");
      const ans = item.querySelector(".ph-faq-a");
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
    initAllowanceTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initCareerChart();
    } else {
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initCareerChart();
        });
      }
    }
  });
})();
