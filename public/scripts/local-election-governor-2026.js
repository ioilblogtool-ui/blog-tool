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
    pledgeEl: null,
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
    if (typeof voteShare === "number") return voteShare + "%";
    return '<span class="gov-badge gov-badge--pending">공개 확인 범위 제외</span>';
  }

  function getPledgeCheckText(category) {
    if (category.indexOf("교통") >= 0) return "노선 확정, 예비타당성·재정 협의, 착공 시점이 실제 체감도를 가릅니다.";
    if (category.indexOf("주거") >= 0) return "공급 물량, 인허가 속도, 정비사업 규제 변화가 핵심 확인 지표입니다.";
    if (category.indexOf("경제") >= 0 || category.indexOf("일자리") >= 0) return "투자 유치, 산업단지·특구 지정, 실제 고용 창출 규모를 함께 봐야 합니다.";
    if (category.indexOf("교육") >= 0 || category.indexOf("청년") >= 0) return "대상자 범위, 지원 단가, 지자체 예산 반영 여부가 중요합니다.";
    if (category.indexOf("복지") >= 0 || category.indexOf("의료") >= 0) return "서비스 대상, 전달 체계, 지속 예산 확보 여부를 확인해야 합니다.";
    return "예산 반영, 세부 실행 일정, 관련 기관 협의 여부를 함께 봐야 합니다.";
  }

  /* ─── SVG path d 데이터 (한국 행정구역 근사치) ───────────── */
  var REGION_PATHS = {
    seoul:           "M173,158 L192,148 L214,154 L224,174 L214,194 L190,200 L170,188 L164,170 Z",
    incheon:         "M88,164 L120,150 L150,160 L162,188 L146,218 L108,224 L82,204 Z",
    gyeonggi:        "M140,88 L190,68 L246,76 L286,112 L296,168 L274,218 L232,244 L206,220 L224,174 L214,154 L192,148 L173,158 L164,170 L150,160 L120,150 L106,122 Z",
    gangwon:         "M286,82 L360,56 L430,72 L474,126 L466,188 L420,236 L354,248 L300,218 L296,168 L286,112 Z",
    sejong:          "M206,266 L226,256 L246,266 L248,288 L230,300 L210,292 Z",
    chungbuk:        "M264,230 L324,224 L366,256 L374,316 L338,362 L284,354 L248,318 L248,288 L246,266 Z",
    chungnam:        "M116,244 L166,228 L206,244 L210,292 L192,336 L140,350 L94,322 L82,278 Z",
    daejeon:         "M196,318 L224,310 L246,326 L240,354 L210,362 L188,344 Z",
    jeonbuk:         "M126,366 L188,352 L242,368 L264,418 L238,472 L174,484 L118,450 L98,404 Z",
    gwangju_jeonnam: "M106,474 L172,458 L236,478 L282,524 L264,586 L196,610 L128,586 L84,536 Z",
    gyeongbuk:       "M374,262 L430,246 L482,284 L488,360 L448,424 L378,430 L338,362 L374,316 Z",
    daegu:           "M342,372 L370,358 L396,372 L398,404 L370,418 L340,402 Z",
    ulsan:           "M420,430 L458,418 L484,446 L474,488 L430,496 L406,464 Z",
    busan:           "M392,500 L432,494 L462,516 L452,552 L408,564 L378,538 Z",
    gyeongnam:       "M276,452 L340,432 L406,464 L408,520 L354,566 L292,548 L264,500 Z",
    jeju:            "M168,624 L206,606 L252,610 L282,630 L264,652 L210,658 L166,646 Z",
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
    state.pledgeEl = document.getElementById("gov-pledge-detail");
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
    if (hash && REGION_PATHS[hash]) {
      openGovPanel(hash);
    } else {
      renderPledgeDetail(getGovData("seoul") || (window.GOV_DATA && window.GOV_DATA[0]));
    }

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

    var voteText = typeof data.elected.voteShare === "number"
      ? data.elected.voteShare + "%"
      : "공개 확인 범위 제외";

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
    renderPledgeDetail(data);
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
    if (typeof data.elected.voteShare === "number" && data.runner && typeof data.runner.voteShare === "number") {
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

  function renderPledgeDetail(data) {
    if (!state.pledgeEl || !data) return;

    var pledgeCards = data.pledges.map(function (p, i) {
      return '<article class="gov-pledge-detail__card">' +
        '<div class="gov-pledge-detail__card-head">' +
          '<span class="gov-pledge-detail__index">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="gov-pledge-detail__category">' + p.category + "</span>" +
        "</div>" +
        "<h3>" + p.title + "</h3>" +
        "<p>" + p.description + "</p>" +
        "<dl>" +
          "<div>" +
            "<dt>핵심 확인점</dt>" +
            "<dd>" + getPledgeCheckText(p.category) + "</dd>" +
          "</div>" +
          "<div>" +
            "<dt>출처 성격</dt>" +
            "<dd>" + p.source + "</dd>" +
          "</div>" +
        "</dl>" +
      "</article>";
    }).join("");

    state.pledgeEl.innerHTML =
      '<div class="gov-pledge-detail__summary">' +
        '<span class="gov-pledge-detail__region">' + data.regionNameKo + "</span>" +
        "<strong>" + data.elected.name + " 당선자 공약 요약</strong>" +
        "<p>아래 공약은 선관위 공약 자료와 공개 자료를 바탕으로 요약한 참고 정보입니다. 실제 이행 여부는 예산 편성, 조례·중앙정부 협의, 착공·집행 일정으로 함께 확인해야 합니다.</p>" +
      "</div>" +
      '<div class="gov-pledge-detail__grid">' + pledgeCards + "</div>";
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
    initGovMap();
    var chartScript = document.querySelector('script[src*="chart.js"]');
    if (chartScript && typeof Chart === "undefined") {
      chartScript.addEventListener("load", initGovChart, { once: true });
    }
  });

})();
