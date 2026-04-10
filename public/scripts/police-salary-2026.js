/* ============================================================
 * police-salary-2026.js
 * 인터랙션: 계급 카드 accordion, 수당 탭, 생애 소득 차트
 * ============================================================ */

(function () {
  "use strict";

  // ── 계급 카드 accordion ────────────────────────────────────
  let activeRankId = null;

  function openPanel(card) {
    const panel = card.querySelector(".ps-rank-panel");
    const icon = card.querySelector(".ps-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closePanel(card) {
    const panel = card.querySelector(".ps-rank-panel");
    const icon = card.querySelector(".ps-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initRankCards() {
    const grid = document.getElementById("ps-rank-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".ps-rank-card");
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
        // 부드럽게 스크롤
        setTimeout(() => {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 60);
      }
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".ps-rank-card");
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
    const tabs = document.querySelectorAll(".ps-allowance-tab");
    const lists = document.querySelectorAll(".ps-allowance-list");

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
  // 경로 데이터 (Astro에서 주입 불가 → inline data)
  const LIFETIME_PATHS = [
    {
      id: "constable-normal",
      label: "순경 입직 · 보통 승진",
      yearlyIncome: buildYearlyIncome(3600, 5500, 7500),
    },
    {
      id: "constable-fast",
      label: "순경 입직 · 빠른 승진",
      yearlyIncome: buildYearlyIncome(3600, 6500, 9000),
    },
    {
      id: "inspector-normal",
      label: "경위 입직 · 보통 승진",
      yearlyIncome: buildYearlyIncome(4700, 7000, 9500),
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
    const canvas = document.getElementById("ps-lifetime-canvas");
    if (!canvas) return;

    const path = LIFETIME_PATHS.find((p) => p.id === pathId) || LIFETIME_PATHS[0];
    const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}년차`);
    const data = path.yearlyIncome;

    if (typeof Chart === "undefined") return;

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
            borderColor: "#2c5f9e",
            backgroundColor: "rgba(44, 95, 158, 0.08)",
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
            ticks: {
              maxTicksLimit: 10,
              font: { size: 11 },
            },
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
    const btns = document.querySelectorAll(".ps-lifetime-btn");
    const summaries = document.querySelectorAll(".ps-lifetime-summary");

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

    // 초기 렌더 — Chart.js CDN이 blocking script이므로 이 시점에는 반드시 로드됨
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
