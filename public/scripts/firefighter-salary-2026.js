/* ============================================================
 * firefighter-salary-2026.js
 * 인터랙션: 계급 카드 accordion, 수당 탭, 생애 소득 차트
 * ============================================================ */

(function () {
  "use strict";

  // ── 계급 카드 accordion ────────────────────────────────────
  let activeRankId = null;

  function openPanel(card) {
    const panel = card.querySelector(".ff-rank-panel");
    const icon = card.querySelector(".ff-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closePanel(card) {
    const panel = card.querySelector(".ff-rank-panel");
    const icon = card.querySelector(".ff-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initRankCards() {
    const grid = document.getElementById("ff-rank-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".ff-rank-card");
      if (!card) return;
      const rankId = card.dataset.rankId;

      if (activeRankId === rankId) {
        closePanel(card);
        activeRankId = null;
      } else {
        if (activeRankId) {
          const prev = grid.querySelector(`[data-rank-id="${activeRankId}"]`);
          if (prev) closePanel(prev);
        }
        openPanel(card);
        activeRankId = rankId;
        setTimeout(() => {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 60);
      }
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".ff-rank-card");
      if (!card) return;
      e.preventDefault();
      card.click();
    });

    // URL 파라미터로 초기 오픈
    const params = new URLSearchParams(window.location.search);
    const rankParam = params.get("rank");
    if (rankParam) {
      const target = grid.querySelector(`[data-rank-id="${rankParam}"]`);
      if (target) {
        openPanel(target);
        activeRankId = rankParam;
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }

  // ── 수당 탭 ───────────────────────────────────────────────
  function initAllowanceTabs() {
    const tabs = document.querySelectorAll(".ff-allowance-tab");
    const lists = document.querySelectorAll(".ff-allowance-list");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const type = this.dataset.tab;
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t.dataset.tab === type);
          t.setAttribute("aria-selected", t.dataset.tab === type ? "true" : "false");
        });
        lists.forEach((list) => {
          list.hidden = list.dataset.tab !== type;
        });
      });
    });
  }

  // ── 생애 소득 시뮬레이션 ──────────────────────────────────
  const LIFETIME_PATHS = [
    {
      id: "firefighter-3shift-normal",
      label: "소방사 입직 · 3교대 · 보통 승진",
      yearlyIncome: buildYearlyIncome(3850, 6000, 8000),
    },
    {
      id: "firefighter-3shift-fast",
      label: "소방사 입직 · 3교대 · 빠른 승진",
      yearlyIncome: buildYearlyIncome(3850, 7000, 9500),
    },
    {
      id: "officer-normal",
      label: "소방위 입직 · 보통 승진",
      yearlyIncome: buildYearlyIncome(5000, 7500, 10000),
    },
  ];

  function buildYearlyIncome(startM, midM, lateM) {
    const arr = [];
    for (let y = 1; y <= 30; y++) {
      let val;
      if (y <= 10) val = startM + ((midM - startM) / 10) * (y - 1);
      else if (y <= 20) val = midM + ((lateM - midM) / 10) * (y - 10);
      else val = lateM + 20 * (y - 20);
      arr.push(Math.round(val / 10) * 10);
    }
    return arr;
  }

  let lifetimeChart = null;

  function renderLifetimeChart(pathId) {
    const canvas = document.getElementById("ff-lifetime-canvas");
    if (!canvas || typeof Chart === "undefined") return;

    const path = LIFETIME_PATHS.find((p) => p.id === pathId) || LIFETIME_PATHS[0];
    const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}년차`);
    const data = path.yearlyIncome;

    if (lifetimeChart) {
      lifetimeChart.data.datasets[0].data = data;
      lifetimeChart.data.datasets[0].label = path.label;
      lifetimeChart.update();
      return;
    }

    lifetimeChart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: path.label,
            data,
            borderColor: "#c0392b",
            backgroundColor: "rgba(192, 57, 43, 0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `추정 연봉: ${ctx.raw.toLocaleString("ko-KR")}만 원`,
            },
          },
        },
        scales: {
          x: {
            ticks: { maxTicksLimit: 10, font: { size: 11 } },
          },
          y: {
            ticks: {
              callback: (v) => v.toLocaleString("ko-KR") + "만",
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  function initLifetimeSim() {
    const btns = document.querySelectorAll(".ff-lifetime-btn");
    const summaries = document.querySelectorAll(".ff-lifetime-summary");

    btns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const pathId = this.dataset.pathId;
        btns.forEach((b) => {
          b.classList.toggle("is-active", b.dataset.pathId === pathId);
          b.setAttribute("aria-pressed", b.dataset.pathId === pathId ? "true" : "false");
        });
        summaries.forEach((s) => {
          s.classList.toggle("is-active", s.dataset.pathId === pathId);
        });
        renderLifetimeChart(pathId);
      });
    });

    renderLifetimeChart(LIFETIME_PATHS[0].id);
  }

  // ── 초기화 ────────────────────────────────────────────────
  function init() {
    initRankCards();
    initAllowanceTabs();
    initLifetimeSim();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
