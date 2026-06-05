/* ============================================================
 * retirement-dc-db-calculator.js
 * DB형 vs DC형 퇴직연금 전환 계산기
 * ============================================================ */
(function () {
  "use strict";

  // ── 유틸 ─────────────────────────────────────────────────
  function fmtManwon(v) {
    if (isNaN(v) || v === 0) return "0만";
    var neg = v < 0;
    var abs = Math.abs(v);
    var result;
    if (abs >= 10000) {
      var eok = Math.floor(abs / 10000);
      var rem = Math.round((abs % 10000) / 1000);
      result = rem > 0
        ? eok.toLocaleString("ko-KR") + "억 " + rem + "천만"
        : eok.toLocaleString("ko-KR") + "억";
    } else {
      result = Math.round(abs).toLocaleString("ko-KR") + "만";
    }
    return (neg ? "-" : "") + result;
  }

  function calcDb(salary, years, growthPct) {
    var finalSalary = salary * Math.pow(1 + growthPct / 100, years);
    return (finalSalary / 12) * years;
  }

  function calcDc(salary, years, growthPct, dcRatePct) {
    var total = 0;
    var s = salary;
    var r = dcRatePct / 100;
    for (var y = 1; y <= years; y++) {
      var contribution = s / 12;
      var remaining = years - y;
      total += contribution * Math.pow(1 + r, remaining);
      s *= (1 + growthPct / 100);
    }
    return total;
  }

  // ── DOM 참조 ──────────────────────────────────────────────
  var salaryEl    = document.getElementById("rddc-salary");
  var yearsEl     = document.getElementById("rddc-years");
  var growthEl    = document.getElementById("rddc-growth");
  var dcRateEl    = document.getElementById("rddc-dc-rate");

  var dbAmountEl  = document.getElementById("rddc-db-amount");
  var dcAmountEl  = document.getElementById("rddc-dc-amount");
  var dcRateDisp  = document.getElementById("rddc-dc-rate-display");
  var winnerBanner = document.getElementById("rddc-winner-banner");
  var winnerLabel = document.getElementById("rddc-winner-label");
  var winnerDiff  = document.getElementById("rddc-winner-diff");
  var reasonEl    = document.getElementById("rddc-reason");
  var barDb       = document.getElementById("rddc-bar-db");
  var barDc       = document.getElementById("rddc-bar-dc");
  var barDbVal    = document.getElementById("rddc-bar-db-val");
  var barDcVal    = document.getElementById("rddc-bar-dc-val");
  var dbCard      = document.getElementById("rddc-db-card");
  var dcCard      = document.getElementById("rddc-dc-card");
  var scenarioMeta = document.getElementById("rddc-scenario-meta");
  var scenarioTbody = document.getElementById("rddc-scenario-tbody");

  // ── 메인 계산 ──────────────────────────────────────────────
  function update() {
    var salary  = parseFloat(salaryEl.value)  || 0;
    var years   = parseFloat(yearsEl.value)   || 0;
    var growth  = parseFloat(growthEl.value)  || 0;
    var dcRate  = parseFloat(dcRateEl.value)  || 0;

    var db = calcDb(salary, years, growth);
    var dc = calcDc(salary, years, growth, dcRate);
    var diff = dc - db;
    var diffPct = db > 0 ? (diff / db) * 100 : 0;

    // 결과 카드
    if (dbAmountEl) dbAmountEl.textContent = fmtManwon(db) + "만원";
    if (dcAmountEl) dcAmountEl.textContent = fmtManwon(dc) + "만원";
    if (dcRateDisp) dcRateDisp.textContent = "연 " + dcRate + "% 운용 기준";

    // 바 차트
    var maxVal = Math.max(db, dc, 1);
    if (barDb) barDb.style.width = (db / maxVal * 100) + "%";
    if (barDc) barDc.style.width = (dc / maxVal * 100) + "%";
    if (barDbVal) barDbVal.textContent = fmtManwon(db) + "만";
    if (barDcVal) barDcVal.textContent = fmtManwon(dc) + "만";

    // 승자 배너
    var absDiffPct = Math.abs(diffPct);
    if (winnerBanner) {
      winnerBanner.className = "rddc-winner-banner";
      if (absDiffPct < 3) {
        winnerBanner.classList.add("rddc-winner-banner--similar");
        if (winnerLabel) winnerLabel.textContent = "🤝 두 유형이 비슷합니다";
        if (winnerDiff) winnerDiff.textContent = "차이 " + Math.abs(diff).toFixed(0) < 100 ? "소액" : fmtManwon(Math.abs(diff)) + "만";
      } else if (diff > 0) {
        winnerBanner.classList.add("rddc-winner-banner--dc");
        if (winnerLabel) winnerLabel.textContent = "✅ DC형이 " + fmtManwon(diff) + "만 더 유리";
        if (winnerDiff) winnerDiff.textContent = "(+" + diffPct.toFixed(1) + "%)";
      } else {
        winnerBanner.classList.add("rddc-winner-banner--db");
        if (winnerLabel) winnerLabel.textContent = "✅ DB형이 " + fmtManwon(-diff) + "만 더 유리";
        if (winnerDiff) winnerDiff.textContent = "(" + diffPct.toFixed(1) + "%)";
      }
    }

    // 카드 하이라이트
    if (dbCard) dbCard.classList.toggle("rddc-result-card--winner", diff <= 0 && absDiffPct >= 3);
    if (dcCard) dcCard.classList.toggle("rddc-result-card--winner", diff > 0 && absDiffPct >= 3);

    // 이유
    if (reasonEl) {
      var reason = "";
      if (absDiffPct < 3) {
        reason = "두 유형의 차이가 크지 않습니다. 투자 성향과 이직 계획에 따라 선택하세요.";
      } else if (diff > 0) {
        reason = "DC형이 유리합니다. 운용 수익률(" + dcRate + "%)이 연봉 인상률(" + growth + "%)보다 높아 복리 효과가 큽니다.";
      } else {
        reason = "DB형이 유리합니다. 연봉 인상률(" + growth + "%)이 높아 퇴직 시점 임금 기준 계산이 더 유리합니다.";
      }
      reasonEl.textContent = reason;
    }

    // 시나리오 표 업데이트
    if (scenarioTbody && window.RDDC_DC_SCENARIOS) {
      var dbVal = calcDb(salary, years, growth);
      scenarioTbody.innerHTML = window.RDDC_DC_SCENARIOS.map(function (s) {
        var dcVal = calcDc(salary, years, growth, s.dcReturnRate);
        var d = dcVal - dbVal;
        var win = d > 0 ? "DC 유리" : "DB 유리";
        var cls = d > 0 ? "rddc-cell--pos" : "rddc-cell--neg";
        var badgeCls = d > 0 ? "dc" : "db";
        return "<tr>" +
          "<td><strong>" + s.label + "</strong><br><span class='rddc-cell-sub'>" + s.description + "</span></td>" +
          "<td style='color:" + s.color + ";font-weight:700'>" + s.dcReturnRate + "%</td>" +
          "<td><strong>" + fmtManwon(dcVal) + "만</strong></td>" +
          "<td class='" + cls + "'>" + (d > 0 ? "+" : "") + fmtManwon(d) + "만</td>" +
          "<td><span class='rddc-result-badge rddc-result-badge--" + badgeCls + "'>" + win + "</span></td>" +
          "</tr>";
      }).join("");
    }

    if (scenarioMeta) {
      scenarioMeta.textContent = "연봉 " + fmtManwon(salary) + "만 · 근속 " + years + "년 · 인상률 " + growth + "%";
    }
  }

  // ── 이벤트 ────────────────────────────────────────────────
  [salaryEl, yearsEl, growthEl, dcRateEl].forEach(function (el) {
    if (el) el.addEventListener("input", update);
  });

  // 빠른 연봉 버튼
  document.querySelectorAll(".rddc-quick-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (salaryEl) { salaryEl.value = btn.dataset.val; update(); }
    });
  });

  // 근속 버튼
  document.querySelectorAll(".rddc-years-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (yearsEl) { yearsEl.value = btn.dataset.val; update(); }
    });
  });

  // 연봉 인상률 프리셋
  document.querySelectorAll("#rddc-growth-presets .rddc-preset-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#rddc-growth-presets .rddc-preset-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      if (growthEl) { growthEl.value = btn.dataset.val; update(); }
    });
  });

  // DC 수익률 프리셋
  document.querySelectorAll("#rddc-dc-presets .rddc-preset-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#rddc-dc-presets .rddc-preset-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      if (dcRateEl) { dcRateEl.value = btn.dataset.val; update(); }
    });
  });

  // FAQ
  document.querySelectorAll(".rddc-faq-item").forEach(function (item) {
    var btn = item.querySelector(".rddc-faq-q");
    var ans = item.querySelector(".rddc-faq-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      ans.hidden = open;
      item.classList.toggle("is-open", !open);
    });
  });

  // 초기 계산
  update();

})();
