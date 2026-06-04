/* ============================================================
 * local-election-superintendent-2026.js
 * 교육감 당선자 SVG 지도 인터랙션
 * 시도지사 지도(local-election-governor-2026.js)와 동일한 패턴 재사용
 * SVG path d 데이터 동일, 색상만 교육감 성향 체계로 변경
 * ============================================================ */

(function () {
  "use strict";

  var state = {
    activeRegionId: null,
    svgEl: null,
    panelEl: null,
    tooltipEl: null,
    isMobile: false,
  };

  /* ─── SVG path d 데이터 (시도지사 지도와 동일) ──────────── */
  var REGION_PATHS = {
    seoul:           "M187,185 L197,180 L210,182 L218,188 L215,198 L205,202 L193,200 L185,193 Z",
    incheon:         "M150,185 L165,178 L178,181 L187,185 L185,193 L178,200 L168,205 L155,202 L145,196 Z",
    gyeonggi:        "M155,150 L180,138 L205,135 L235,140 L258,155 L265,175 L260,200 L245,218 L225,228 L218,220 L215,198 L210,182 L197,180 L187,185 L178,181 L165,178 L150,185 L145,196 L135,210 L130,230 L138,248 L150,255 L155,245 L165,240 L180,238 L195,242 L205,250 L208,260 L200,270 L190,272 L178,265 L165,268 L155,278 L150,290 L158,298 L170,302 L165,315 L155,318 L148,312 L138,318 L130,310 L120,305 L112,295 L108,280 L112,265 L118,250 L120,230 L115,212 L118,195 L125,178 L135,165 Z",
    gangwon:         "M258,155 L285,140 L320,130 L355,128 L385,132 L410,142 L425,158 L430,178 L420,198 L405,215 L390,228 L372,238 L355,242 L338,238 L320,242 L305,255 L292,268 L280,278 L268,272 L260,260 L258,242 L265,225 L265,200 L260,180 Z",
    sejong:          "M178,318 L190,312 L200,315 L205,325 L198,335 L185,338 L175,332 Z",
    chungbuk:        "M200,270 L208,260 L220,258 L238,262 L255,270 L268,280 L278,295 L280,312 L272,325 L258,332 L242,335 L225,330 L212,320 L205,308 L200,295 L200,280 Z",
    chungnam:        "M108,280 L120,275 L135,278 L148,285 L155,295 L158,312 L150,325 L138,332 L125,335 L112,330 L100,320 L92,305 L90,290 L98,282 Z",
    daejeon:         "M155,318 L165,315 L178,318 L185,328 L185,338 L175,345 L162,345 L152,338 L150,328 Z",
    jeonbuk:         "M92,335 L108,330 L125,335 L138,340 L150,338 L162,345 L175,345 L185,352 L192,365 L185,380 L172,392 L158,398 L142,400 L128,395 L115,385 L105,372 L98,358 L90,345 Z",
    gwangju_jeonnam: "M90,358 L105,355 L115,360 L128,368 L142,375 L158,372 L172,368 L185,365 L198,372 L210,382 L218,398 L215,415 L205,428 L192,438 L175,445 L158,448 L140,445 L125,435 L112,422 L100,408 L88,392 L82,375 Z",
    gyeongbuk:       "M280,278 L292,268 L305,255 L320,248 L338,250 L355,258 L370,270 L382,285 L388,305 L385,325 L375,345 L360,360 L342,370 L325,375 L308,368 L295,355 L282,340 L278,322 Z",
    daegu:           "M258,340 L272,335 L282,342 L285,355 L278,365 L265,368 L252,362 L248,350 Z",
    ulsan:           "M355,345 L370,340 L382,348 L388,362 L385,378 L372,385 L358,382 L348,370 L348,358 Z",
    busan:           "M308,382 L325,378 L340,382 L348,395 L345,410 L332,418 L318,415 L308,405 L305,392 Z",
    gyeongnam:       "M218,398 L235,392 L252,390 L265,395 L278,408 L285,422 L282,438 L268,450 L252,455 L235,452 L220,445 L208,432 L205,418 Z",
    jeju:            "M135,530 L162,522 L190,525 L210,535 L215,548 L205,560 L182,565 L158,562 L138,552 L128,540 Z",
  };

  /* ─── 유틸 ──────────────────────────────────────────────── */
  function getEduData(regionId) {
    return (window.EDU_DATA || []).find(function (s) { return s.regionId === regionId; }) || null;
  }

  function getOrientationClass(orientation) {
    if (orientation === "진보") return "progressive";
    if (orientation === "보수") return "conservative";
    if (orientation === "중도") return "moderate";
    return "pending";
  }

  /* ─── SVG path 주입 ─────────────────────────────────────── */
  function injectPaths() {
    var svg = document.getElementById("edu-map-svg");
    if (!svg) return;
    Object.keys(REGION_PATHS).forEach(function (id) {
      var path = document.getElementById("edu-region-" + id);
      if (path) path.setAttribute("d", REGION_PATHS[id]);
    });
  }

  /* ─── 초기화 ────────────────────────────────────────────── */
  function initEduMap() {
    state.svgEl    = document.getElementById("edu-map-svg");
    state.panelEl  = document.getElementById("edu-panel");
    state.tooltipEl = document.getElementById("edu-tooltip");
    state.isMobile = window.innerWidth < 900;

    if (!state.svgEl) return;

    injectPaths();

    state.svgEl.querySelectorAll(".edu-map__region").forEach(function (path) {
      path.addEventListener("mouseenter", onHover);
      path.addEventListener("mouseleave", function () {
        if (state.tooltipEl) state.tooltipEl.classList.remove("is-visible");
      });
      path.addEventListener("mousemove", onMove);
      path.addEventListener("click", onClick);
      path.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); }
      });
    });

    // 목록 버튼
    document.querySelectorAll(".edu-list__btn, .edu-quick__btn").forEach(function (btn) {
      btn.addEventListener("click", function () { openPanel(btn.dataset.regionId); });
    });

    initTabs();
    initFaq();

    var hash = location.hash.replace("#", "");
    if (hash && REGION_PATHS[hash]) openPanel(hash);

    initChart();
  }

  /* ─── 툴팁 ──────────────────────────────────────────────── */
  function onHover(e) {
    var data = getEduData(e.currentTarget.dataset.regionId);
    if (!data || !state.tooltipEl) return;
    var name = data.name === "TODO" ? "확정대기" : data.name;
    var orient = data.orientation !== "확정대기" ? data.orientation : "확인 중";
    state.tooltipEl.innerHTML =
      '<span class="edu-tooltip__name">' + name + "</span>" +
      '<span class="edu-tooltip__region">' + data.regionNameKo + "</span>" +
      '<span class="edu-tooltip__orient edu-tooltip__orient--' + getOrientationClass(data.orientation) + '">' + orient + "</span>";
    state.tooltipEl.classList.add("is-visible");
    moveTooltip(e);
  }

  function onMove(e) { moveTooltip(e); }

  function moveTooltip(e) {
    if (!state.tooltipEl || !state.svgEl) return;
    var r = state.svgEl.getBoundingClientRect();
    var x = e.clientX - r.left + 14;
    var y = e.clientY - r.top  - 10;
    if (x + 150 > r.width) x = e.clientX - r.left - 160;
    state.tooltipEl.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  /* ─── 패널 ──────────────────────────────────────────────── */
  function onClick(e) {
    var id = e.currentTarget.dataset.regionId;
    if (state.activeRegionId === id) { closePanel(); } else { openPanel(id); }
  }

  function openPanel(regionId) {
    var data = getEduData(regionId);
    if (!data || !state.panelEl) return;
    state.activeRegionId = regionId;

    document.querySelectorAll(".edu-map__region").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.regionId === regionId);
    });

    renderPanel(data);
    state.panelEl.classList.add("is-open");
    history.replaceState(null, "", "#" + regionId);

    if (state.isMobile) {
      state.panelEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closePanel() {
    state.activeRegionId = null;
    if (state.panelEl) state.panelEl.classList.remove("is-open");
    document.querySelectorAll(".edu-map__region.is-active").forEach(function (el) {
      el.classList.remove("is-active");
    });
    history.replaceState(null, "", location.pathname);
  }

  function renderPanel(data) {
    var isPending = data.badge === "확정대기";
    var name      = isPending ? "확인 중" : data.name;
    var oClass    = getOrientationClass(data.orientation);
    var orientText = isPending ? "확정대기" : data.orientation;
    var reelectionHtml = data.isReelection ? '<span class="edu-panel__reelect">재선</span>' : "";

    var careerHtml = data.career.map(function (c) { return "<li>" + c + "</li>"; }).join("");

    var pledgesHtml = data.pledges.map(function (p, i) {
      return '<details class="edu-panel__pledge"' + (i === 0 ? " open" : "") + ">" +
        '<summary class="edu-panel__pledge-sum">' +
          '<span class="edu-panel__pledge-cat">' + p.category + "</span>" +
          p.title +
        "</summary>" +
        '<p class="edu-panel__pledge-desc">' + p.description + "</p>" +
        '<span class="edu-panel__pledge-src">' + p.source + "</span>" +
        "</details>";
    }).join("");

    state.panelEl.innerHTML =
      '<button type="button" class="edu-panel__close" aria-label="닫기">✕</button>' +
      '<div class="edu-panel__hd">' +
        '<span class="edu-panel__region">' + data.regionNameKo + "</span>" +
        '<span class="edu-panel__orient-badge edu-panel__orient-badge--' + oClass + '">' + orientText + ' [편집부]</span>' +
        reelectionHtml +
      "</div>" +
      '<h2 class="edu-panel__name">' + name + "</h2>" +
      (data.voteShare > 0 ? '<p class="edu-panel__vote">득표율 <strong>' + data.voteShare + "%</strong></p>" : "") +
      (!isPending && data.orientationBasis
        ? '<p class="edu-panel__basis">성향 근거: ' + data.orientationBasis + "</p>"
        : "") +
      (data.career.length > 0
        ? '<h3 class="edu-panel__sec">주요 이력</h3><ul class="edu-panel__career">' + careerHtml + "</ul>"
        : "") +
      '<h3 class="edu-panel__sec">핵심 공약</h3>' +
      pledgesHtml +
      '<a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="edu-panel__link">' +
        "선관위 공약마당 →" +
      "</a>";

    state.panelEl.querySelector(".edu-panel__close").addEventListener("click", closePanel);
  }

  /* ─── 탭 ────────────────────────────────────────────────── */
  function initTabs() {
    var tabMap  = document.getElementById("edu-tab-map");
    var tabList = document.getElementById("edu-tab-list");
    var mapView  = document.getElementById("edu-map-view");
    var listView = document.getElementById("edu-list-view");
    if (!tabMap) return;

    tabMap.addEventListener("click", function () {
      tabMap.classList.add("edu-tab--active");   tabMap.setAttribute("aria-selected", "true");
      tabList.classList.remove("edu-tab--active"); tabList.setAttribute("aria-selected", "false");
      mapView  && mapView.classList.remove("is-hidden");
      listView && listView.classList.add("is-hidden");
    });
    tabList.addEventListener("click", function () {
      tabList.classList.add("edu-tab--active");  tabList.setAttribute("aria-selected", "true");
      tabMap.classList.remove("edu-tab--active");  tabMap.setAttribute("aria-selected", "false");
      listView && listView.classList.remove("is-hidden");
      mapView  && mapView.classList.add("is-hidden");
    });
  }

  /* ─── FAQ ────────────────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll(".edu-faq__item").forEach(function (item) {
      var btn = item.querySelector(".edu-faq__q");
      var ans = item.querySelector(".edu-faq__a");
      if (!btn || !ans) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        ans.hidden = open;
        item.classList.toggle("is-open", !open);
      });
    });
  }

  /* ─── 차트 ──────────────────────────────────────────────── */
  function initChart() {
    var canvas = document.getElementById("edu-orientation-chart");
    if (!canvas || typeof Chart === "undefined") return;

    var progressive  = parseInt(canvas.dataset.progressive  || "0");
    var conservative = parseInt(canvas.dataset.conservative || "0");
    var pending      = parseInt(canvas.dataset.pending      || "16");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["진보", "보수", "확정대기"],
        datasets: [{
          label: "교육감 수",
          data: [progressive, conservative, pending],
          backgroundColor: [
            "rgba(33, 150, 243, 0.8)",
            "rgba(255, 87, 34, 0.8)",
            "rgba(189, 189, 189, 0.8)",
          ],
          borderRadius: 8,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) { return " " + ctx.parsed.y + "명"; },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 17,
            ticks: { stepSize: 1 },
            title: { display: true, text: "교육감 수 (명)" },
          },
        },
      },
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Chart !== "undefined") {
      initEduMap();
    } else {
      var s = document.querySelector('script[src*="chart.js"]');
      if (s) { s.addEventListener("load", initEduMap); } else { initEduMap(); }
    }
  });

})();
