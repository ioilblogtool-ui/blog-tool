(function () {
  "use strict";

  const dataEl = document.getElementById("sjap-data");
  if (!dataEl) return;

  let apartments = [];
  try {
    apartments = JSON.parse(dataEl.textContent || "[]");
  } catch {
    apartments = [];
  }
  if (!apartments.length) return;

  const sortKeys = ["rank", "gain", "gainRate", "latestPrice", "area"];
  const areaGroupOrder = {
    "성복역권": 1,
    "동천역권": 2,
    "수지구청역권": 3,
    "상현역권": 4,
    "풍덕천권": 5,
    "광교 인접": 6,
  };

  const els = {
    tabs: Array.from(document.querySelectorAll("[data-sjap-tab]")),
    sortButtons: Array.from(document.querySelectorAll("[data-sjap-sort]")),
    rows: Array.from(document.querySelectorAll("[data-sjap-row]")),
    barRows: Array.from(document.querySelectorAll("[data-sjap-bar-row]")),
    tableBody: document.querySelector("[data-sjap-table-body]"),
    bars: document.querySelector("[data-sjap-bars]"),
    area: document.querySelector("[data-sjap-area]"),
    name: document.querySelector("[data-sjap-name]"),
    sentence: document.querySelector("[data-sjap-sentence]"),
    latest: document.querySelector("[data-sjap-latest]"),
    low: document.querySelector("[data-sjap-low]"),
    gain: document.querySelector("[data-sjap-gain]"),
    rate: document.querySelector("[data-sjap-rate]"),
    badge: document.querySelector("[data-sjap-badge]"),
    areaLabel: document.querySelector("[data-sjap-area-label]"),
    date: document.querySelector("[data-sjap-date]"),
    station: document.querySelector("[data-sjap-station]"),
    jeonse: document.querySelector("[data-sjap-jeonse]"),
    note: document.querySelector("[data-sjap-note]"),
    tradeNote: document.querySelector("[data-sjap-trade-note]"),
  };

  const formatEok = (manwon) => {
    const eok = manwon / 10000;
    const value = eok >= 10 ? eok.toFixed(1) : eok.toFixed(2);
    return `${value.replace(/\.0$/, "")}억원`;
  };

  const formatPercent = (value) => `${Number(value).toFixed(1)}%`;

  const getApartmentById = (id) => apartments.find((item) => item.id === id) || apartments[0];

  const getSortedApartments = (sortKey) => {
    const rows = apartments.slice();
    if (sortKey === "gain") return rows.sort((a, b) => b.estimatedGainManwon - a.estimatedGainManwon);
    if (sortKey === "gainRate") return rows.sort((a, b) => b.estimatedGainRate - a.estimatedGainRate);
    if (sortKey === "latestPrice") return rows.sort((a, b) => b.latestTradePriceManwon - a.latestTradePriceManwon);
    if (sortKey === "area") {
      return rows.sort((a, b) => {
        const diff = (areaGroupOrder[a.areaGroup] || 99) - (areaGroupOrder[b.areaGroup] || 99);
        return diff || a.rank - b.rank;
      });
    }
    return rows.sort((a, b) => a.rank - b.rank);
  };

  const readStateFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const complex = params.get("complex");
    const sort = params.get("sort");
    return {
      complex: apartments.some((item) => item.id === complex) ? complex : apartments[0].id,
      sort: sortKeys.includes(sort) ? sort : "rank",
    };
  };

  const writeStateToUrl = (state) => {
    const params = new URLSearchParams(window.location.search);
    params.set("complex", state.complex);
    params.set("sort", state.sort);
    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const setText = (el, value) => {
    if (el) el.textContent = value;
  };

  const renderProfitCard = (apartment) => {
    setText(els.area, `${apartment.areaGroup} · ${apartment.legalDongLabel}`);
    setText(els.name, apartment.complexName);
    setText(
      els.sentence,
      `${apartment.fiveYearLowDate} ${formatEok(apartment.fiveYearLowPriceManwon)}에 거래된 뒤, 현재 기준가는 ${formatEok(apartment.latestTradePriceManwon)}입니다. 단순 시세 차이는 ${formatEok(apartment.estimatedGainManwon)}, 상승률은 ${formatPercent(apartment.estimatedGainRate)}로 추정됩니다.`
    );
    setText(els.latest, formatEok(apartment.latestTradePriceManwon));
    setText(els.low, formatEok(apartment.fiveYearLowPriceManwon));
    setText(els.gain, formatEok(apartment.estimatedGainManwon));
    setText(els.rate, formatPercent(apartment.estimatedGainRate));
    setText(els.badge, apartment.badge);
    setText(els.areaLabel, apartment.mainAreaLabel);
    setText(els.date, apartment.latestTradeDate);
    setText(els.station, apartment.stationLabel || "확인 필요");
    setText(els.jeonse, apartment.jeonseRatio ? `${apartment.jeonseRatio}% 참고` : "거래 부족");
    setText(els.note, apartment.note);
    setText(els.tradeNote, apartment.tradeCountNote);
  };

  const renderActiveState = (complexId) => {
    els.tabs.forEach((tab) => {
      const isActive = tab.getAttribute("data-sjap-tab") === complexId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    els.rows.forEach((row) => row.classList.toggle("is-active", row.getAttribute("data-sjap-row") === complexId));
    els.barRows.forEach((row) => row.classList.toggle("is-active", row.getAttribute("data-sjap-bar-row") === complexId));
  };

  const renderTable = (sortKey) => {
    if (!els.tableBody) return;
    getSortedApartments(sortKey).forEach((apartment) => {
      const row = document.querySelector(`[data-sjap-row="${apartment.id}"]`);
      if (row) els.tableBody.appendChild(row);
    });
  };

  const renderBars = (sortKey) => {
    if (!els.bars) return;
    getSortedApartments(sortKey).forEach((apartment) => {
      const row = document.querySelector(`[data-sjap-bar-row="${apartment.id}"]`);
      if (row) els.bars.appendChild(row);
    });
  };

  const renderSortButtons = (sortKey) => {
    els.sortButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-sjap-sort") === sortKey);
    });
  };

  let state = readStateFromUrl();

  const update = (nextState) => {
    state = { ...state, ...nextState };
    const apartment = getApartmentById(state.complex);
    renderProfitCard(apartment);
    renderActiveState(apartment.id);
    renderSortButtons(state.sort);
    renderTable(state.sort);
    renderBars(state.sort);
    writeStateToUrl(state);
  };

  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-sjap-tab");
      if (id && apartments.some((item) => item.id === id)) update({ complex: id });
    });
  });

  els.sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sort = button.getAttribute("data-sjap-sort");
      if (sortKeys.includes(sort)) update({ sort });
    });
  });

  update(state);
})();
