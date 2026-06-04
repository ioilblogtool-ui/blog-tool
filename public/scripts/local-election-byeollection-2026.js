/* ============================================================
 * local-election-byeollection-2026.js
 * 재보궐 당선자 카드 필터 탭 + accordion + 차트
 * ============================================================ */

(function () {
  "use strict";

  var BYE_STATE = {
    activePartyFilter:  "all",
    activeRegionFilter: "all",
  };

  /* ─── 초기화 ──────────────────────────────────────────────── */
  function initBye() {
    initByePartyFilter();
    initByeRegionFilter();
    initByeFaq();
    initByeChart();
  }

  /* ─── 정당 필터 탭 ────────────────────────────────────────── */
  function initByePartyFilter() {
    var tabs = document.querySelectorAll(".bye-filter-tab[data-party-filter]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("bye-filter-tab--active"); });
        tab.classList.add("bye-filter-tab--active");
        BYE_STATE.activePartyFilter = tab.dataset.partyFilter;
        filterByeCards();
      });
    });
  }

  /* ─── 지역 필터 탭 ────────────────────────────────────────── */
  function initByeRegionFilter() {
    var tabs = document.querySelectorAll(".bye-filter-tab[data-region-filter]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("bye-filter-tab--active"); });
        tab.classList.add("bye-filter-tab--active");
        BYE_STATE.activeRegionFilter = tab.dataset.regionFilter;
        filterByeCards();
      });
    });
  }

  /* ─── 카드 필터링 ─────────────────────────────────────────── */
  function filterByeCards() {
    var cards   = document.querySelectorAll(".bye-card");
    var visible = 0;

    cards.forEach(function (card) {
      var partyMatch =
        BYE_STATE.activePartyFilter === "all" ||
        card.dataset.party === BYE_STATE.activePartyFilter;

      var regionMatch =
        BYE_STATE.activeRegionFilter === "all" ||
        card.dataset.region === BYE_STATE.activeRegionFilter;

      var show = partyMatch && regionMatch;
      card.classList.toggle("is-hidden", !show);
      if (show) visible++;
    });

    var emptyEl = document.getElementById("bye-empty-state");
    if (emptyEl) emptyEl.classList.toggle("is-visible", visible === 0);
  }

  /* ─── FAQ accordion ───────────────────────────────────────── */
  function initByeFaq() {
    document.querySelectorAll(".bye-faq__item").forEach(function (item) {
      var btn = item.querySelector(".bye-faq__q");
      var ans = item.querySelector(".bye-faq__a");
      if (!btn || !ans) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        ans.hidden = open;
        item.classList.toggle("is-open", !open);
      });
    });
  }

  /* ─── 의석 파이 차트 ──────────────────────────────────────── */
  function initByeChart() {
    var canvas = document.getElementById("bye-seat-chart");
    if (!canvas || typeof Chart === "undefined") return;

    var dem = parseInt(canvas.dataset.dem || "9");
    var ppp = parseInt(canvas.dataset.ppp || "4");
    var ind = parseInt(canvas.dataset.ind || "1");

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["더불어민주당", "국민의힘", "무소속"],
        datasets: [{
          data: [dem, ppp, ind],
          backgroundColor: [
            "rgba(0, 120, 215, 0.85)",
            "rgba(230, 30, 43, 0.85)",
            "rgba(136, 136, 136, 0.85)",
          ],
          borderColor: ["#fff", "#fff", "#fff"],
          borderWidth: 3,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
          legend: { position: "bottom", labels: { padding: 16, font: { size: 13 } } },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " " + ctx.label + ": " + ctx.parsed + "석";
              },
            },
          },
        },
      },
    });
  }

  /* ─── 실행 ────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Chart !== "undefined") {
      initBye();
    } else {
      var s = document.querySelector('script[src*="chart.js"]');
      if (s) { s.addEventListener("load", initBye); } else { initBye(); }
    }
  });

})();
