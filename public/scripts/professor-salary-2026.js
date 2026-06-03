/* ============================================================
 * professor-salary-2026.js
 * 인터랙션: 대학유형 카드 accordion, 직급 차트, 대학 그룹 차트, FAQ
 * ============================================================ */

(function () {
  "use strict";

  // ── 대학 유형 카드 accordion ──────────────────────────────
  let activeTypeId = null;

  function openPanel(card) {
    const panel = card.querySelector(".pf-type-panel");
    const icon  = card.querySelector(".pf-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closePanel(card) {
    const panel = card.querySelector(".pf-type-panel");
    const icon  = card.querySelector(".pf-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initTypeCards() {
    const grid = document.getElementById("pf-type-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".pf-type-card");
      if (!card) return;
      const id = card.dataset.typeId;

      if (activeTypeId === id) {
        closePanel(card);
        activeTypeId = null;
      } else {
        if (activeTypeId) {
          const prev = grid.querySelector(`[data-type-id="${activeTypeId}"]`);
          if (prev) closePanel(prev);
        }
        openPanel(card);
        activeTypeId = id;
        setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
      }
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".pf-type-card");
      if (!card) return;
      e.preventDefault();
      card.click();
    });
  }

  // ── 직급별 연봉 비교 차트 ────────────────────────────────
  function initRankChart() {
    const canvas = document.getElementById("pf-rank-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 280;

    const labels   = JSON.parse(canvas.dataset.labels   || "[]");
    const national = JSON.parse(canvas.dataset.national || "[]");
    const priv     = JSON.parse(canvas.dataset.private  || "[]");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "국립대 (추정 평균, 만 원)",
            data: national,
            backgroundColor: "rgba(66, 133, 244, 0.7)",
            borderColor: "rgba(30, 90, 200, 1)",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "사립 상위권 (추정 평균, 만 원)",
            data: priv,
            backgroundColor: "rgba(76, 175, 141, 0.7)",
            borderColor: "rgba(46, 125, 114, 1)",
            borderWidth: 1,
            borderRadius: 6,
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
          x: { ticks: { font: { size: 13 } } },
          y: {
            beginAtZero: true,
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "추정 평균 연봉 (만 원)", font: { size: 11 } },
          },
        },
      },
    });
  }

  // ── 대학 그룹별 가로 차트 ────────────────────────────────
  function initUniChart() {
    const canvas = document.getElementById("pf-uni-chart");
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
            label: "평균 연봉 (만 원, 추정)",
            data: values,
            backgroundColor: "rgba(156, 124, 199, 0.75)",
            borderColor: "rgba(100, 70, 160, 1)",
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
                return " 평균 연봉 약 " + ctx.parsed.x.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { callback: function (v) { return v + "만"; } },
            title: { display: true, text: "평균 연봉 (만 원, 추정)", font: { size: 11 } },
          },
          y: { ticks: { font: { size: 12 } } },
        },
      },
    });
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".pf-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".pf-faq-q");
      const ans = item.querySelector(".pf-faq-a");
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
    initFaq();

    if (typeof Chart !== "undefined") {
      initRankChart();
      initUniChart();
    } else {
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initRankChart();
          initUniChart();
        });
      }
    }
  });
})();
