/* ============================================================
 * local-election-governor-2026.js
 * 2026 지방선거 시도지사 SVG 지도 인터랙션
 * ============================================================ */

(function () {
  "use strict";

  /* ─── 상태 ──────────────────────────────────────────────── */
  var state = {
    activeRegionId: null,
    svgEl: null,
    panelEl: null,
    tooltipEl: null,
    isMobile: false,
  };

  /* ─── 유틸 ──────────────────────────────────────────────── */
  function getGovData(regionId) {
    if (!window.GOV_DATA) return null;
    return window.GOV_DATA.find(function (g) { return g.regionId === regionId; }) || null;
  }

  function getPartyClass(party) {
    if (party === "더불어민주당") return "dem";
    if (party === "국민의힘")     return "ppp";
    return "ind";
  }

  function formatVote(voteShare, badge) {
    if (voteShare > 0) return voteShare + "%";
    return '<span class="gov-badge gov-badge--pending">확정대기</span>';
  }

  /* ─── SVG path d 데이터 (한국 행정구역 근사치) ───────────── */
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

  /* ─── SVG path 주입 ─────────────────────────────────────── */
  function injectSvgPaths() {
    var svg = document.getElementById("gov-map-svg");
    if (!svg) return;
    Object.keys(REGION_PATHS).forEach(function (regionId) {
      var path = document.getElementById("gov-region-" + regionId);
      if (path) path.setAttribute("d", REGION_PATHS[regionId]);
    });
  }

  /* ─── 초기화 ────────────────────────────────────────────── */
  function initGovMap() {
    state.svgEl    = document.getElementById("gov-map-svg");
    state.panelEl  = document.getElementById("gov-panel");
    state.tooltipEl = document.getElementById("gov-tooltip");
    state.isMobile = window.innerWidth < 900;

    if (!state.svgEl) return;

    injectSvgPaths();

    // 지역 path 이벤트
    var regions = state.svgEl.querySelectorAll(".gov-map__region");
    regions.forEach(function (path) {
      path.addEventListener("mouseenter", onRegionHover);
      path.addEventListener("mouseleave", onRegionLeave);
      path.addEventListener("mousemove",  onRegionMove);
      path.addEventListener("click",      onRegionClick);
      path.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRegionClick(e);
        }
      });
    });

    // 목록 버튼 이벤트 (지도 아래 목록)
    document.querySelectorAll("[data-region-id]").forEach(function (btn) {
      if (btn.id && btn.id.startsWith("gov-region-")) return; // SVG path 제외
      btn.addEventListener("click", function () {
        openGovPanel(btn.dataset.regionId);
      });
    });

    initGovTabs();
    initGovFaq();

    // URL 해시 → 초기 패널 오픈
    var hash = location.hash.replace("#", "");
    if (hash && REGION_PATHS[hash]) openGovPanel(hash);

    // 차트
    initGovChart();

    window.addEventListener("resize", function () {
      state.isMobile = window.innerWidth < 900;
    });
  }

  /* ─── 툴팁 ──────────────────────────────────────────────── */
  function onRegionHover(e) {
    var regionId = e.currentTarget.dataset.regionId;
    var data = getGovData(regionId);
    if (!data || !state.tooltipEl) return;

    var voteText = data.elected.voteShare > 0
      ? data.elected.voteShare + "%"
      : "확정대기";

    state.tooltipEl.innerHTML =
      '<span class="gov-tooltip__name">' + data.elected.name + "</span>" +
      '<span class="gov-tooltip__region">' + data.regionNameKo + "</span>" +
      '<span class="gov-tooltip__party gov-tooltip__party--' + getPartyClass(data.elected.party) + '">' + data.elected.party + "</span>" +
      '<span class="gov-tooltip__vote">' + voteText + "</span>";

    state.tooltipEl.classList.add("is-visible");
    moveTooltip(e);
  }

  function onRegionLeave() {
    if (state.tooltipEl) state.tooltipEl.classList.remove("is-visible");
  }

  function onRegionMove(e) {
    moveTooltip(e);
  }

  function moveTooltip(e) {
    if (!state.tooltipEl || !state.svgEl) return;
    var rect = state.svgEl.getBoundingClientRect();
    var x = e.clientX - rect.left + 14;
    var y = e.clientY - rect.top  - 10;
    // 우측 경계 처리
    if (x + 160 > rect.width) x = e.clientX - rect.left - 170;
    state.tooltipEl.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  /* ─── 패널 열기/닫기 ────────────────────────────────────── */
  function onRegionClick(e) {
    var regionId = e.currentTarget.dataset.regionId;
    if (state.activeRegionId === regionId) {
      closeGovPanel();
    } else {
      openGovPanel(regionId);
    }
  }

  function openGovPanel(regionId) {
    var data = getGovData(regionId);
    if (!data || !state.panelEl) return;

    state.activeRegionId = regionId;

    // SVG 활성 표시
    document.querySelectorAll(".gov-map__region").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.regionId === regionId);
    });

    renderGovPanel(data);
    state.panelEl.classList.add("is-open");

    history.replaceState(null, "", "#" + regionId);

    if (state.isMobile) {
      state.panelEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function closeGovPanel() {
    state.activeRegionId = null;
    if (state.panelEl) state.panelEl.classList.remove("is-open");
    document.querySelectorAll(".gov-map__region.is-active").forEach(function (el) {
      el.classList.remove("is-active");
    });
    history.replaceState(null, "", location.pathname);
  }

  /* ─── 패널 렌더 ─────────────────────────────────────────── */
  function renderGovPanel(data) {
    var panel = state.panelEl;
    var pClass = getPartyClass(data.elected.party);
    var voteHtml = formatVote(data.elected.voteShare, data.elected.badge);

    // 득표 바
    var barHtml = "";
    if (data.elected.voteShare > 0 && data.runner && data.runner.voteShare > 0) {
      var ePct = data.elected.voteShare;
      var rPct = data.runner.voteShare;
      var eClass = getPartyClass(data.elected.party);
      var rClass = getPartyClass(data.runner.party);
      barHtml =
        '<div class="gov-panel__bar-wrap">' +
        '<div class="gov-panel__bar-seg gov-panel__bar-seg--' + eClass + '" style="flex:' + ePct + '">' +
          '<span>' + data.elected.name + ' ' + ePct + '%</span>' +
        '</div>' +
        '<div class="gov-panel__bar-seg gov-panel__bar-seg--' + rClass + '" style="flex:' + rPct + '">' +
          '<span>' + data.runner.name + ' ' + rPct + '%</span>' +
        '</div>' +
        '</div>';
    }

    // 이력
    var careerHtml = data.career.map(function (c) {
      return "<li>" + c + "</li>";
    }).join("");

    // 공약
    var pledgesHtml = data.pledges.map(function (p, i) {
      return '<details class="gov-panel__pledge"' + (i === 0 ? " open" : "") + ">" +
        '<summary class="gov-panel__pledge-sum">' +
          '<span class="gov-panel__pledge-cat">' + p.category + "</span>" +
          p.title +
        "</summary>" +
        '<p class="gov-panel__pledge-desc">' + p.description + "</p>" +
        '<span class="gov-panel__pledge-src">' + p.source + "</span>" +
        "</details>";
    }).join("");

    // 교체 배지
    var flipHtml = data.isPartyFlip
      ? '<span class="gov-panel__flip">🔄 정당 교체</span>'
      : "";

    panel.innerHTML =
      '<button type="button" class="gov-panel__close" aria-label="닫기">✕</button>' +
      '<div class="gov-panel__hd">' +
        '<span class="gov-panel__region-name">' + data.regionNameKo + "</span>" +
        '<span class="gov-panel__party-badge gov-panel__party-badge--' + pClass + '">' + data.elected.party + "</span>" +
        flipHtml +
      "</div>" +
      '<h2 class="gov-panel__name">' + data.elected.name + "</h2>" +
      '<div class="gov-panel__vote-row">' +
        '<span class="gov-panel__vote-label">득표율</span>' +
        '<span class="gov-panel__vote-val">' + voteHtml + "</span>" +
      "</div>" +
      barHtml +
      '<div class="gov-panel__career">' +
        '<h3 class="gov-panel__sec-title">주요 이력</h3>' +
        '<ul class="gov-panel__career-list">' + careerHtml + "</ul>" +
      "</div>" +
      '<div class="gov-panel__pledges">' +
        '<h3 class="gov-panel__sec-title">핵심 공약</h3>' +
        pledgesHtml +
      "</div>" +
      '<a href="https://policy.nec.go.kr" target="_blank" rel="noopener noreferrer" class="gov-panel__ext-link">' +
        "선관위 공약마당에서 전체 공약 보기 →" +
      "</a>";

    // 닫기 버튼 이벤트
    panel.querySelector(".gov-panel__close").addEventListener("click", closeGovPanel);
  }

  /* ─── 모바일 탭 ─────────────────────────────────────────── */
  function initGovTabs() {
    var tabMap  = document.getElementById("gov-tab-map");
    var tabList = document.getElementById("gov-tab-list");
    var mapView  = document.getElementById("gov-map-view");
    var listView = document.getElementById("gov-list-view");
    if (!tabMap || !tabList) return;

    tabMap.addEventListener("click", function () {
      tabMap.classList.add("gov-tab--active");
      tabMap.setAttribute("aria-selected", "true");
      tabList.classList.remove("gov-tab--active");
      tabList.setAttribute("aria-selected", "false");
      mapView  && mapView.classList.remove("is-hidden");
      listView && listView.classList.add("is-hidden");
    });

    tabList.addEventListener("click", function () {
      tabList.classList.add("gov-tab--active");
      tabList.setAttribute("aria-selected", "true");
      tabMap.classList.remove("gov-tab--active");
      tabMap.setAttribute("aria-selected", "false");
      listView && listView.classList.remove("is-hidden");
      mapView  && mapView.classList.add("is-hidden");
    });
  }

  /* ─── FAQ accordion ─────────────────────────────────────── */
  function initGovFaq() {
    document.querySelectorAll(".gov-faq__item").forEach(function (item) {
      var btn = item.querySelector(".gov-faq__q");
      var ans = item.querySelector(".gov-faq__a");
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
  function initGovChart() {
    var canvas = document.getElementById("gov-party-chart");
    if (!canvas || typeof Chart === "undefined") return;

    var dem2022 = parseInt(canvas.dataset.dem2022 || "5");
    var ppp2022 = parseInt(canvas.dataset.ppp2022 || "12");
    var dem2026 = parseInt(canvas.dataset.dem2026 || "12");
    var ppp2026 = parseInt(canvas.dataset.ppp2026 || "4");

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ["더불어민주당", "국민의힘"],
        datasets: [
          {
            label: "2022년",
            data: [dem2022, ppp2022],
            backgroundColor: ["rgba(0,120,215,0.35)", "rgba(230,30,43,0.35)"],
            borderColor:      ["rgba(0,120,215,0.7)",  "rgba(230,30,43,0.7)"],
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "2026년",
            data: [dem2026, ppp2026],
            backgroundColor: ["rgba(0,120,215,0.85)", "rgba(230,30,43,0.85)"],
            borderColor:      ["rgba(0,90,170,1)",     "rgba(180,20,30,1)"],
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
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return " " + ctx.dataset.label + ": " + ctx.parsed.x + "곳";
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 16,
            ticks: { stepSize: 2 },
            title: { display: true, text: "당선 수 (총 16곳)" },
          },
        },
      },
    });
  }

  /* ─── Chart.js 로드 대기 ─────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof Chart !== "undefined") {
      initGovMap();
    } else {
      var chartScript = document.querySelector('script[src*="chart.js"]');
      if (chartScript) {
        chartScript.addEventListener("load", initGovMap);
      } else {
        initGovMap();
      }
    }
  });

})();
