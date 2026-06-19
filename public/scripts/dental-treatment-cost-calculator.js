(function () {
  "use strict";

  var _cfg = JSON.parse(document.getElementById("dtcConfig").textContent);
  var TREATMENTS = _cfg.treatments;
  var INSURANCE_TABLE = _cfg.insuranceTable;

  var state = {
    treatmentId: "implant",
    optionId: null,
    count: 1,
    userPrice: null,
  };

  // ---- DOM helpers ----
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  function getTreatment(id) {
    return TREATMENTS.find(function (t) { return t.id === id; });
  }

  // ---- Tabs ----
  function initTabs() {
    $$(".dtc-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.treatmentId = btn.dataset.treatment;
        state.optionId = null;
        state.userPrice = null;
        render();
      });
    });
  }

  // ---- Calculate ----
  function calculate() {
    var treatment = getTreatment(state.treatmentId);
    if (!treatment) return null;

    var optionId = state.optionId || treatment.options[0].id;
    var option = treatment.options.find(function (o) { return o.id === optionId; });
    if (!option) return null;

    var count = treatment.perTooth ? (state.count || 1) : 1;
    var userPrice = state.userPrice;

    var totalLow  = option.low  * count;
    var totalAvg  = option.avg  * count;
    var totalHigh = option.high * count;

    var verdict = null;
    var gaugePos = 50;
    if (userPrice !== null && !isNaN(userPrice)) {
      var range = totalHigh - totalLow;
      if (range > 0) {
        gaugePos = ((userPrice - totalLow) / range) * 100;
        gaugePos = Math.max(0, Math.min(100, gaugePos));
      }
      if (userPrice < totalLow)       verdict = "low";
      else if (userPrice > totalHigh) verdict = "high";
      else                            verdict = "normal";
    }

    return {
      treatment: treatment,
      option: option,
      count: count,
      totalLow: totalLow,
      totalAvg: totalAvg,
      totalHigh: totalHigh,
      userPrice: userPrice,
      verdict: verdict,
      gaugePos: gaugePos,
    };
  }

  var VERDICT_TEXT = {
    low:    { badge: "--low",    label: "낮음",   msg: "전국 평균보다 저렴한 견적입니다." },
    normal: { badge: "--normal", label: "보통",   msg: "전국 평균 범위 내의 견적입니다." },
    high:   { badge: "--high",   label: "높음",   msg: "전국 평균보다 비싼 견적입니다. 추가 상담을 권장합니다." },
    null:   { badge: "--empty",  label: "—",      msg: "견적을 입력하면 판정이 표시됩니다." },
  };

  function fmt(n) {
    if (n === null || isNaN(n)) return "—";
    return (n * 10000).toLocaleString("ko-KR") + "원";
  }

  // ---- Render ----
  function render() {
    var result = calculate();
    if (!result) return;

    var treatment = result.treatment;
    var option    = result.option;

    // active tab
    $$(".dtc-tab-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.treatment === state.treatmentId);
    });

    // option select
    var optSel = $("#dtc-option-select");
    if (optSel) {
      optSel.innerHTML = treatment.options.map(function (o) {
        return '<option value="' + o.id + '"' + (o.id === option.id ? " selected" : "") + ">" + o.label + "</option>";
      }).join("");
    }

    // count row
    var countRow = $(".dtc-count-row");
    if (countRow) {
      countRow.classList.toggle("is-visible", treatment.perTooth);
      var countInput = $("#dtc-count");
      if (countInput && countInput.value !== String(result.count)) {
        countInput.value = result.count;
      }
    }

    // insurance banner
    var banner = $(".dtc-insurance-banner");
    if (banner) {
      banner.classList.toggle("is-visible", treatment.insuranceAvailable);
      var bannerText = banner.querySelector(".dtc-banner-text");
      if (bannerText && treatment.insuranceNote) {
        bannerText.textContent = treatment.insuranceNote;
      }
    }

    // verdict card
    var vInfo = VERDICT_TEXT[result.verdict] || VERDICT_TEXT[null];
    var verdictBadge = $(".dtc-verdict-badge");
    if (verdictBadge) {
      verdictBadge.className = "dtc-verdict-badge dtc-verdict-badge" + vInfo.badge;
      verdictBadge.textContent = vInfo.label;
    }
    var verdictMsg = $(".dtc-verdict-msg");
    if (verdictMsg) verdictMsg.textContent = vInfo.msg;

    // kpi values
    var kvLow  = $("#dtc-kv-low");
    var kvAvg  = $("#dtc-kv-avg");
    var kvHigh = $("#dtc-kv-high");
    if (kvLow)  kvLow.textContent  = fmt(result.totalLow);
    if (kvAvg)  kvAvg.textContent  = fmt(result.totalAvg);
    if (kvHigh) kvHigh.textContent = fmt(result.totalHigh);

    // gauge
    var marker = $(".dtc-gauge-marker");
    if (marker) {
      marker.style.left = result.gaugePos + "%";
    }
    var gaugeLabel = $(".dtc-gauge-user-label");
    if (gaugeLabel) {
      gaugeLabel.textContent = result.userPrice !== null ? fmt(result.userPrice) : "";
    }

    // range table
    renderRangeTable(treatment, option, result.count);
  }

  function renderRangeTable(treatment, selectedOption, count) {
    var tbody = $("#dtc-range-tbody");
    if (!tbody) return;
    tbody.innerHTML = treatment.options.map(function (o) {
      var isSelected = o.id === selectedOption.id;
      return '<tr class="' + (isSelected ? "dtc-row--selected" : "") + '">' +
        "<td>" + o.label + "</td>" +
        '<td class="dtc-col-low">' + fmt(o.low * count) + "</td>" +
        '<td class="dtc-col-avg">' + fmt(o.avg * count) + "</td>" +
        '<td class="dtc-col-high">' + fmt(o.high * count) + "</td>" +
        (o.insuranceLow ? '<td>' + fmt(o.insuranceLow * count) + " ~ " + fmt(o.insuranceHigh * count) + "</td>" : "<td>—</td>") +
        "</tr>";
    }).join("");
  }

  // ---- Event bindings ----
  function bindEvents() {
    var optSel = $("#dtc-option-select");
    if (optSel) {
      optSel.addEventListener("change", function () {
        state.optionId = this.value;
        render();
      });
    }

    var countInput = $("#dtc-count");
    if (countInput) {
      countInput.addEventListener("input", function () {
        var v = parseInt(this.value, 10);
        state.count = isNaN(v) || v < 1 ? 1 : v;
        render();
      });
    }

    var priceInput = $("#dtc-price");
    if (priceInput) {
      priceInput.addEventListener("input", function () {
        var v = parseFloat(this.value);
        state.userPrice = isNaN(v) ? null : v;
        render();
      });
    }
  }

  // ---- URL state ----
  function restoreFromUrl() {
    var params = new URLSearchParams(location.search);
    if (params.get("t")) state.treatmentId = params.get("t");
    if (params.get("o")) state.optionId = params.get("o");
    if (params.get("c")) state.count = parseInt(params.get("c"), 10) || 1;
    if (params.get("p")) {
      var p = parseFloat(params.get("p"));
      if (!isNaN(p)) {
        state.userPrice = p;
        var priceInput = $("#dtc-price");
        if (priceInput) priceInput.value = p;
      }
    }
  }

  function buildShareUrl() {
    var params = new URLSearchParams();
    params.set("t", state.treatmentId);
    if (state.optionId) params.set("o", state.optionId);
    if (state.count > 1) params.set("c", state.count);
    if (state.userPrice !== null) params.set("p", state.userPrice);
    return location.origin + location.pathname + "?" + params.toString();
  }

  function bindCopyLink() {
    var btn = $("#dtc-copy-link");
    if (!btn) return;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(buildShareUrl()).then(function () {
        var orig = btn.textContent;
        btn.textContent = "복사됨!";
        setTimeout(function () { btn.textContent = orig; }, 1500);
      });
    });
  }

  function bindReset() {
    var btn = $("#dtc-reset");
    if (!btn) return;
    btn.addEventListener("click", function () {
      state.treatmentId = "implant";
      state.optionId = null;
      state.count = 1;
      state.userPrice = null;
      var priceInput = $("#dtc-price");
      if (priceInput) priceInput.value = "";
      var countInput = $("#dtc-count");
      if (countInput) countInput.value = 1;
      history.replaceState(null, "", location.pathname);
      render();
    });
  }

  // ---- Init ----
  document.addEventListener("DOMContentLoaded", function () {
    restoreFromUrl();
    initTabs();
    bindEvents();
    bindCopyLink();
    bindReset();
    render();
  });
})();
