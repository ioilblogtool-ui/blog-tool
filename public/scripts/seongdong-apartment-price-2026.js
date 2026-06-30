(function () {
  var dataEl = document.getElementById("sdap-data");
  if (!dataEl) return;

  var apartments = [];
  try {
    apartments = JSON.parse(dataEl.textContent || "[]");
  } catch (e) {
    apartments = [];
  }
  if (!apartments.length) return;

  var areaGroupOrder = {
    "서울숲·성수권": 1,
    "한강변권": 2,
    "옥수·금호권": 3,
    "왕십리·행당권": 4,
    "응봉·마장권": 5,
  };

  var allowedSorts = ["rank", "gain", "gainRate", "latestPrice", "area"];
  var allowedIds = apartments.map(function (row) { return row.id; });
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
    return apartments.find(function (item) { return item.id === id; }) || apartments[0];
  }

  function getSortedRows(sortKey) {
    var rows = apartments.slice();
    if (sortKey === "gain") return rows.sort(function (a, b) { return b.estimatedGainManwon - a.estimatedGainManwon; });
    if (sortKey === "gainRate") return rows.sort(function (a, b) { return b.estimatedGainRate - a.estimatedGainRate; });
    if (sortKey === "latestPrice") return rows.sort(function (a, b) { return b.latestTradePriceManwon - a.latestTradePriceManwon; });
    if (sortKey === "area") return rows.sort(function (a, b) {
      return (areaGroupOrder[a.areaGroup] || 99) - (areaGroupOrder[b.areaGroup] || 99) || a.rank - b.rank;
    });
    return rows.sort(function (a, b) { return a.rank - b.rank; });
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function renderProfitCard(apartment) {
    setText('[data-sdap-field="badge"]', apartment.badge);
    setText('[data-sdap-field="complexName"]', apartment.complexName);
    setText(
      '[data-sdap-field="areaMeta"]',
      apartment.legalDongLabel + " · " + apartment.areaGroup +
      (apartment.stationLabel ? " · " + apartment.stationLabel : "")
    );
    setText(
      '[data-sdap-field="profitSentence"]',
      apartment.fiveYearLowDate + " " + formatEok(apartment.fiveYearLowPriceManwon) + "에 거래된 뒤, 현재 기준가는 " + formatEok(apartment.latestTradePriceManwon) + "입니다."
    );
    setText('[data-sdap-field="gain"]', formatEok(apartment.estimatedGainManwon));
    setText('[data-sdap-field="gainRate"]', formatPercent(apartment.estimatedGainRate));
    setText('[data-sdap-field="latest"]', formatEok(apartment.latestTradePriceManwon));
    setText('[data-sdap-field="latestMeta"]', apartment.latestTradeDate + " · " + apartment.latestTradeArea);
    setText('[data-sdap-field="low"]', formatEok(apartment.fiveYearLowPriceManwon));
    setText('[data-sdap-field="jeonse"]', apartment.jeonseRatio ? formatPercent(apartment.jeonseRatio) + " 참고" : "확인 필요");
    setText('[data-sdap-field="areaNote"]', apartment.mainAreaLabel);
    setText('[data-sdap-field="note"]', apartment.note);
  }

  function renderTable(sortKey) {
    var tbody = document.querySelector("[data-sdap-table-body]");
    if (!tbody) return;
    var rows = getSortedRows(sortKey);
    tbody.textContent = "";
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      if (row.id === activeId) tr.className = "is-selected";
      tr.setAttribute("data-row-id", row.id);

      var rankTd = document.createElement("td");
      rankTd.textContent = String(row.rank);
      tr.appendChild(rankTd);

      var nameTh = document.createElement("th");
      nameTh.setAttribute("scope", "row");
      var nameStrong = document.createElement("strong");
      nameStrong.textContent = row.complexName;
      var nameSpan = document.createElement("span");
      nameSpan.textContent = row.mainAreaLabel;
      nameTh.appendChild(nameStrong);
      nameTh.appendChild(nameSpan);
      tr.appendChild(nameTh);

      var cells = [
        row.legalDongLabel,
        row.areaGroup,
        formatEok(row.latestTradePriceManwon),
        row.latestTradeDate,
        row.previousYearPriceManwon
          ? formatEok(row.latestTradePriceManwon - row.previousYearPriceManwon) + " 상승 참고"
          : "확인 필요",
        formatEok(row.fiveYearLowPriceManwon),
        formatEok(row.estimatedGainManwon) + " · " + formatPercent(row.estimatedGainRate),
        row.jeonseRatio ? formatPercent(row.jeonseRatio) + " 참고" : "확인 필요",
        row.tradeCountNote,
      ];

      cells.forEach(function (text) {
        var td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderBars(sortKey) {
    var list = document.querySelector("[data-sdap-bars]");
    if (!list) return;
    var maxPrice = Math.max.apply(null, apartments.map(function (row) { return row.latestTradePriceManwon; }));
    var rows = getSortedRows(sortKey);
    list.textContent = "";
    rows.forEach(function (row) {
      var article = document.createElement("article");
      article.className = "sdap-bar-row" + (row.id === activeId ? " is-selected" : "");
      article.setAttribute("data-row-id", row.id);

      var label = document.createElement("div");
      label.className = "sdap-bar-row__label";
      var strong = document.createElement("strong");
      strong.textContent = row.complexName;
      var areaSpan = document.createElement("span");
      areaSpan.textContent = row.areaGroup + " · " + row.badge;
      label.appendChild(strong);
      label.appendChild(areaSpan);

      var bars = document.createElement("div");
      bars.className = "sdap-bar-row__bars";
      var latest = document.createElement("span");
      latest.className = "sdap-bar sdap-bar--latest";
      latest.style.width = Math.max(12, (row.latestTradePriceManwon / maxPrice) * 100) + "%";
      latest.textContent = formatEok(row.latestTradePriceManwon);
      var low = document.createElement("span");
      low.className = "sdap-bar sdap-bar--low";
      low.style.width = Math.max(12, (row.fiveYearLowPriceManwon / maxPrice) * 100) + "%";
      low.textContent = formatEok(row.fiveYearLowPriceManwon);
      bars.appendChild(latest);
      bars.appendChild(low);

      article.appendChild(label);
      article.appendChild(bars);
      list.appendChild(article);
    });
  }

  function renderAreaCards(apartment) {
    var cards = document.querySelectorAll("[data-sdap-area-cards] [data-area-group]");
    cards.forEach(function (card) {
      card.classList.toggle("is-selected", card.getAttribute("data-area-group") === apartment.areaGroup);
    });
  }

  function writeStateToUrl() {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("complex", activeId);
      url.searchParams.set("sort", activeSort);
      window.history.replaceState({}, "", url);
    } catch (e) {}
  }

  function readStateFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      var complex = params.get("complex");
      var sort = params.get("sort");
      if (complex && allowedIds.indexOf(complex) >= 0) activeId = complex;
      if (sort && allowedSorts.indexOf(sort) >= 0) activeSort = sort;
    } catch (e) {}
  }

  function updateTabs() {
    document.querySelectorAll(".sdap-tab").forEach(function (button) {
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
    if (allowedIds.indexOf(id) < 0) return;
    activeId = id;
    var apt = getApartmentById(activeId);
    renderProfitCard(apt);
    renderAreaCards(apt);
    updateTabs();
    renderTable(activeSort);
    renderBars(activeSort);
    writeStateToUrl();
  }

  function setSort(sortKey) {
    if (allowedSorts.indexOf(sortKey) < 0) return;
    activeSort = sortKey;
    updateSortButtons();
    renderTable(activeSort);
    renderBars(activeSort);
    writeStateToUrl();
  }

  function initTabs() {
    document.querySelectorAll(".sdap-tab").forEach(function (button) {
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
    var apt = getApartmentById(activeId);
    renderProfitCard(apt);
    renderAreaCards(apt);
    updateTabs();
    updateSortButtons();
    renderTable(activeSort);
    renderBars(activeSort);
  }

  init();
})();
