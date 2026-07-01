(function () {
  var root = document.querySelector("[data-report='worldcup-manager-salary-comparison-2026']");
  if (!root) return;

  var tbody = root.querySelector("[data-wmcs-body]");
  var rows = Array.prototype.slice.call(root.querySelectorAll("[data-manager-row]"));
  var confedSelect = root.querySelector("[data-wmcs-confed]");
  var sourceSelect = root.querySelector("[data-wmcs-source]");
  var sortSelect = root.querySelector("[data-wmcs-sort]");
  var status = root.querySelector("[data-wmcs-status]");

  function getState() {
    return {
      confed: confedSelect ? confedSelect.value : "all",
      source: sourceSelect ? sourceSelect.value : "all",
      sort: sortSelect ? sortSelect.value : "salary-desc",
    };
  }

  function sourceMatches(row, mode) {
    var badge = row.getAttribute("data-source") || "";
    var isKorea = row.getAttribute("data-korea") === "true";
    if (mode === "korea") return isKorea;
    if (mode === "reported") return badge === "보도 기준" || badge === "보도 범위";
    if (mode === "estimated") return badge === "추정" || badge === "보도 기준" || badge === "보도 범위";
    return true;
  }

  function rowMatches(row, state) {
    var confed = row.getAttribute("data-confed");
    return (state.confed === "all" || confed === state.confed) && sourceMatches(row, state.source);
  }

  function sortRows(activeRows, sortMode) {
    return activeRows.sort(function (a, b) {
      if (sortMode === "salary-asc") {
        return Number(a.getAttribute("data-salary")) - Number(b.getAttribute("data-salary"));
      }
      if (sortMode === "country") {
        return (a.getAttribute("data-country") || "").localeCompare(b.getAttribute("data-country") || "", "ko");
      }
      return Number(b.getAttribute("data-salary")) - Number(a.getAttribute("data-salary"));
    });
  }

  function updateStatus(count, state) {
    if (!status) return;
    var confedLabel = state.confed === "all" ? "전체 대륙" : state.confed;
    var sourceLabel = {
      all: "전체 데이터",
      reported: "보도 기준·보도 범위",
      estimated: "추정 포함",
      korea: "한국 감독",
    }[state.source] || "전체 데이터";
    status.textContent = confedLabel + " / " + sourceLabel + " 조건으로 " + count + "명을 표시 중입니다.";
  }

  function render() {
    if (!tbody) return;
    var state = getState();
    var activeRows = rows.filter(function (row) {
      return rowMatches(row, state);
    });
    var sortedRows = sortRows(activeRows, state.sort);

    rows.forEach(function (row) {
      row.hidden = true;
    });

    sortedRows.forEach(function (row, index) {
      row.hidden = false;
      var rank = row.querySelector("[data-rank]");
      if (rank) rank.textContent = String(index + 1);
      tbody.appendChild(row);
    });

    updateStatus(sortedRows.length, state);
  }

  [confedSelect, sourceSelect, sortSelect].forEach(function (select) {
    if (!select) return;
    select.addEventListener("change", render);
  });

  render();
})();
