/* ============================================================
 * teacher-salary-2026.js
 * 인터랙션: 학교급 카드 accordion, 호봉표 펼치기, 수당 탭,
 *           예상 연봉 차트, 연봉 시뮬레이션 차트, FAQ accordion
 * ============================================================ */

(function () {
  "use strict";

  // ── 학교급 카드 accordion ─────────────────────────────────
  let activeLevelId = null;

  function openLevelPanel(card) {
    const panel = card.querySelector(".ts-level-panel");
    const icon = card.querySelector(".ts-toggle-icon");
    if (!panel) return;
    panel.hidden = false;
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "▲";
  }

  function closeLevelPanel(card) {
    const panel = card.querySelector(".ts-level-panel");
    const icon = card.querySelector(".ts-toggle-icon");
    if (!panel) return;
    panel.hidden = true;
    card.classList.remove("is-active");
    card.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "▼";
  }

  function initLevelCards() {
    const grid = document.getElementById("ts-level-grid");
    if (!grid) return;

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".ts-level-card");
      if (!card) return;
      const levelId = card.dataset.levelId;

      if (activeLevelId === levelId) {
        closeLevelPanel(card);
        activeLevelId = null;
      } else {
        if (activeLevelId) {
          const prev = grid.querySelector(`[data-level-id="${activeLevelId}"]`);
          if (prev) closeLevelPanel(prev);
        }
        openLevelPanel(card);
        activeLevelId = levelId;
        setTimeout(() => {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 60);
      }
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".ts-level-card");
      if (!card) return;
      e.preventDefault();
      card.click();
    });

    // URL 파라미터로 초기 오픈
    const params = new URLSearchParams(window.location.search);
    const levelParam = params.get("level");
    if (levelParam) {
      const target = grid.querySelector(`[data-level-id="${levelParam}"]`);
      if (target) {
        openLevelPanel(target);
        activeLevelId = levelParam;
        setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }

  // ── 호봉표 펼치기 ─────────────────────────────────────────
  function initHobongToggle() {
    const btn = document.getElementById("ts-hobong-toggle");
    const full = document.getElementById("ts-hobong-full");
    if (!btn || !full) return;

    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        full.hidden = true;
        btn.textContent = "전체 호봉표 펼쳐보기 (1~40호봉) ▼";
        btn.setAttribute("aria-expanded", "false");
      } else {
        full.hidden = false;
        btn.textContent = "전체 호봉표 접기 ▲";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  }

  // ── 수당 탭 ───────────────────────────────────────────────
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

  // ── 예상 연봉 바 차트 ─────────────────────────────────────
  function initAnnualChart() {
    const canvas = document.getElementById("ts-annual-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 320;

    const labels = JSON.parse(canvas.dataset.labels || "[]");
    const values = JSON.parse(canvas.dataset.values || "[]");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "예상 연봉 (추정, 만 원)",
            data: values,
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
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " 예상 연봉 약 " + ctx.parsed.x.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: function (v) { return v + "만"; },
            },
            title: {
              display: true,
              text: "예상 연봉 (만 원, 추정)",
              font: { size: 11 },
            },
          },
          y: {
            ticks: { font: { size: 13 } },
          },
        },
      },
    });
  }

  // ── 연봉 시뮬레이션 차트 ─────────────────────────────────
  let simChart = null;
  let simState = {
    entry: "elem",    // 'elem' | 'fixed'
    classTeacher: true,
  };

  function buildSimData(entry, classTeacher) {
    const canvas = document.getElementById("ts-sim-chart");
    if (!canvas) return { labels: [], data: [] };

    const allElem  = JSON.parse(canvas.dataset.elem  || "[]");
    const allFixed = JSON.parse(canvas.dataset.fixed || "[]");
    const labels   = JSON.parse(canvas.dataset.labels || "[]");

    const base = entry === "fixed" ? allFixed : allElem;
    const classBonus = classTeacher ? Math.round(200_000 * 12 / 10_000) : 0;
    const data = base.map(function (v) { return v + classBonus; });

    return { labels, data };
  }

  function initSimChart() {
    const canvas = document.getElementById("ts-sim-chart");
    if (!canvas || typeof Chart === "undefined") return;

    canvas.height = 360;

    const { labels, data } = buildSimData(simState.entry, simState.classTeacher);

    simChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "예상 연봉 (추정, 만 원)",
            data: data,
            borderColor: "rgba(76, 175, 141, 1)",
            backgroundColor: "rgba(76, 175, 141, 0.1)",
            pointBackgroundColor: "rgba(46, 125, 114, 1)",
            pointRadius: 4,
            tension: 0.3,
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
                return " 예상 연봉 약 " + ctx.parsed.y.toLocaleString("ko-KR") + "만 원 (추정)";
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10,
              font: { size: 12 },
            },
            title: { display: true, text: "경력 연차", font: { size: 12 } },
          },
          y: {
            ticks: {
              callback: function (v) { return v + "만"; },
            },
            title: { display: true, text: "예상 연봉 (만 원, 추정)", font: { size: 12 } },
          },
        },
      },
    });

    // 컨트롤 버튼
    document.querySelectorAll(".ts-sim-btn[data-entry]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".ts-sim-btn[data-entry]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        this.classList.add("is-active");
        simState.entry = this.dataset.entry;
        updateSimChart();
      });
    });

    document.querySelectorAll(".ts-sim-btn[data-classtp]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".ts-sim-btn[data-classtp]").forEach(function (b) {
          b.classList.remove("is-active");
        });
        this.classList.add("is-active");
        simState.classTeacher = this.dataset.classtp === "yes";
        updateSimChart();
      });
    });
  }

  function updateSimChart() {
    if (!simChart) return;
    const { data } = buildSimData(simState.entry, simState.classTeacher);
    simChart.data.datasets[0].data = data;
    simChart.update();
  }

  // ── FAQ accordion ─────────────────────────────────────────
  function initFaq() {
    const items = document.querySelectorAll(".ts-faq-item");
    items.forEach(function (item) {
      const btn = item.querySelector(".ts-faq-q");
      const ans = item.querySelector(".ts-faq-a");
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
    initLevelCards();
    initHobongToggle();
    initAllowanceTabs();
    initFaq();

    if (typeof Chart !== "undefined") {
      initAnnualChart();
      initSimChart();
    } else {
      // Chart.js 로드 대기
      const chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", function () {
          initAnnualChart();
          initSimChart();
        });
      }
    }
  });
})();
