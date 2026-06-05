/* covered-call-etf-guide-2026.js — FAQ + 비교표 필터 */
(function () {
  "use strict";

  // FAQ
  document.querySelectorAll(".cceg-faq-item").forEach(function (item) {
    var btn = item.querySelector(".cceg-faq-q");
    var ans = item.querySelector(".cceg-faq-a");
    if (!btn || !ans) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      ans.hidden = open;
      item.classList.toggle("is-open", !open);
    });
  });

  // 비교표 필터
  document.querySelectorAll(".cceg-filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".cceg-filter-btn").forEach(function (b) { b.classList.remove("cceg-filter-btn--active"); });
      btn.classList.add("cceg-filter-btn--active");
      var filter = btn.dataset.filter;
      document.querySelectorAll(".cceg-table tbody tr").forEach(function (row) {
        row.hidden = filter !== "all" && row.dataset.market !== filter;
      });
    });
  });
})();
