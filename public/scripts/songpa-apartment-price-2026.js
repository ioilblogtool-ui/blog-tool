(function () {
  var dataEl = document.getElementById("spap-data");
  if (!dataEl) return;

  var apartments = [];
  try {
    apartments = JSON.parse(dataEl.textContent || "[]");
  } catch (error) {
    apartments = [];
  }
  if (!apartments.length) return;

  var allowedSorts = ["rank", "gain", "gainRate", "latestPrice", "area"];
  var activeId = apartments[0].id;
  var activeSort = "rank";

  function formatEok(manwon) {
    var eok = manwon / 10000;
    var fixed = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
    return fixed.replace(/\.0$/, "") + "억원";
  }

  function formatPercent(value) {
    return Number(value).toFixed(1).replace(/\.0$/, "") + "%";
  }

  function getApartmentById(id) {
    return apartments.find(function (item) {
      return item.id === id;
    }) || apartments[0];
  }

  function getSortedRows(sortKey) {
    var rows = apartments.slice();
    if (sortKey === "gain") {
      return rows.sort(function (a, b) {
        return b.estimatedGainManwon - a.estimatedGainManwon;
      });
    }
    if (sortKey === "gainRate") {
      return rows.sort(function (a, b) {
        return b.estimatedGainRate - a.estimatedGainRate;
      });
    }
    if (sortKey === "latestPrice") {
      return rows.sort(function (a, b) {
        return b.latestTradePriceManwon - a.latestTradePriceManwon;
      });
    }
    if (sortKey === "area") {
      return rows.sort(function (a, b) {
        return a.areaGroup.localeCompare(b.areaGroup, "ko") || a.rank - b.rank;
      });
    }
    return rows.sort(function (a, b) {
      return a.rank - b.rank;
    });
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text || "";
  }

  function renderProfitCard(apartment) {
    setText('[data-spap-field="badge"]', apartment.badge);
    setText('[data-spap-field="complexName"]', apartment.complexName);
    setText('[data-spap-field="areaLine"]', apartment.legalDongLabel + " · " + apartment.areaGroup + " · " + (apartment.stationLabel || "역 접근성 확인 필요"));
    setText(
      '[data-spap-field="profitSentence"]',
      apartment.fiveYearLowDate + " " + formatEok(apartment.fiveYearLowPriceManwon) + "에 거래됐고, 현재 기준가는 " + formatEok(apartment.latestTradePriceManwon) + "입니다."
    );
    setText('[data-spap-field="gain"]', formatEok(apartment.estimatedGainManwon));
    setText('[data-spap-field="gainRate"]', formatPercent(apartment.estimatedGainRate));
    setText('[data-spap-field="latest"]', formatEok(apartment.latestTradePriceManwon));
    setText('[data-spap-field="latestMeta"]', apartment.latestTradeDate + " · " + apartment.latestTradeArea);
    setText('[data-spap-field="low"]', formatEok(apartment.fiveYearLowPriceManwon));
    setText('[data-spap-field="parkNote"]', apartment.parkNote || "생활권 메모 확인 필요");
    setText('[data-spap-field="redevelopmentNote"]', apartment.redevelopmentNote || "재건축 기대 단지로 분류하지 않았습니다.");
    setText('[data-spap-field="note"]', apartment.note);
  }

  function renderAreaStatus(apartment) {
    document.querySelectorAll("[data-area-group]").forEach(function (card) {
      card.classList.toggle("is-selected", card.getAttribute("data-area-group") === apartment.areaGroup);
    });
  }

  function renderTable(sortKey) {
    var tbody = document.querySelector("[data-spap-table-body]");
    if (!tbody) return;
    var rows = getSortedRows(sortKey);
    tbody.textContent = "";
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      if (row.id === activeId) tr.className = "is-selected";
      tr.setAttribute("data-row-id", row.id);

      var cells = [
        String(row.rank),
        row.complexName + "\n" + row.mainAreaLabel,
        row.legalDongLabel,
        row.areaGroup,
        formatEok(row.latestTradePriceManwon),
        row.latestTradeDate,
        row.previousYearPriceManwon ? formatEok(row.latestTradePriceManwon - row.previousYearPriceManwon) + " 상승 참고" : "확인 필요",
        formatEok(row.fiveYearLowPriceManwon),
        formatEok(row.estimatedGainManwon) + " · " + formatPercent(row.estimatedGainRate),
        row.jeonseRatio ? formatPercent(row.jeonseRatio) + " 참고" : "확인 필요",
        row.tradeCountNote,
      ];

      cells.forEach(function (text, index) {
        var cell = document.createElement(index === 1 ? "th" : "td");
        if (index === 1) cell.setAttribute("scope", "row");
        cell.textContent = text;
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
  }

  function renderBars(sortKey) {
    var list = document.querySelector("[data-spap-bars]");
    if (!list) return;
    var maxPrice = Math.max.apply(null, apartments.map(function (row) { return row.latestTradePriceManwon; }));
    var rows = getSortedRows(sortKey);
    list.textContent = "";
    rows.forEach(function (row) {
      var article = document.createElement("article");
      article.className = "spap-bar-row" + (row.id === activeId ? " is-selected" : "");
      article.setAttribute("data-row-id", row.id);

      var label = document.createElement("div");
      label.className = "spap-bar-row__label";
      var strong = document.createElement("strong");
      strong.textContent = row.complexName;
      var badge = document.createElement("span");
      badge.textContent = row.areaGroup + " · " + row.badge;
      label.appendChild(strong);
      label.appendChild(badge);

      var bars = document.createElement("div");
      bars.className = "spap-bar-row__bars";
      var latest = document.createElement("span");
      latest.className = "spap-bar spap-bar--latest";
      latest.style.width = Math.max(12, (row.latestTradePriceManwon / maxPrice) * 100) + "%";
      latest.textContent = formatEok(row.latestTradePriceManwon);
      var low = document.createElement("span");
      low.className = "spap-bar spap-bar--low";
      low.style.width = Math.max(12, (row.fiveYearLowPriceManwon / maxPrice) * 100) + "%";
      low.textContent = formatEok(row.fiveYearLowPriceManwon);
      bars.appendChild(latest);
      bars.appendChild(low);

      article.appendChild(label);
      article.appendChild(bars);
      list.appendChild(article);
    });
  }

  function writeStateToUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("complex", activeId);
    url.searchParams.set("sort", activeSort);
    window.history.replaceState({}, "", url);
  }

  function readStateFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var complex = params.get("complex");
    var sort = params.get("sort");
    if (apartments.some(function (row) { return row.id === complex; })) activeId = complex;
    if (allowedSorts.indexOf(sort) >= 0) activeSort = sort;
  }

  function updateTabs() {
    document.querySelectorAll(".spap-tab").forEach(function (button) {
      var isActive = button.getAttribute("data-complex") === activeId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function updateSortButtons() {
    document.querySelectorAll("[data-sort]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-sort") === activeSort);
    });
  }

  function setActiveApartment(id) {
    var apartment = getApartmentById(id);
    activeId = apartment.id;
    renderProfitCard(apartment);
    renderAreaStatus(apartment);
    updateTabs();
    renderTable(activeSort);
    renderBars(activeSort);
    writeStateToUrl();
  }

  function setSort(sortKey) {
    activeSort = allowedSorts.indexOf(sortKey) >= 0 ? sortKey : "rank";
    updateSortButtons();
    renderTable(activeSort);
    renderBars(activeSort);
    writeStateToUrl();
  }

  function initTabs() {
    document.querySelectorAll(".spap-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        setActiveApartment(button.getAttribute("data-complex"));
      });
    });
  }

  function initSortControls() {
    document.querySelectorAll("[data-sort]").forEach(function (button) {
      button.addEventListener("click", function () {
        setSort(button.getAttribute("data-sort"));
      });
    });
  }

  function init() {
    readStateFromUrl();
    initTabs();
    initSortControls();
    renderProfitCard(getApartmentById(activeId));
    renderAreaStatus(getApartmentById(activeId));
    updateTabs();
    updateSortButtons();
    renderTable(activeSort);
    renderBars(activeSort);
  }

  init();
})();
