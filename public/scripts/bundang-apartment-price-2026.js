(function () {
  "use strict";

  const dataEl = document.getElementById("bdap-data");
  if (!dataEl) return;

  let apartments = [];
  try {
    apartments = JSON.parse(dataEl.textContent || "[]");
  } catch {
    apartments = [];
  }
  if (!apartments.length) return;

  const sortKeys = ["rank", "gain", "gainRate", "latestPrice", "redevelopment"];
  const redevelopmentWeight = {
    "선도지구 관련": 5,
    "특별정비구역 관련": 4,
    "재건축 기대": 3,
    "일반 구축": 2,
    "신축·준신축": 1,
    "확인 필요": 0,
  };

  const els = {
    tabs: Array.from(document.querySelectorAll("[data-bdap-tab]")),
    sortButtons: Array.from(document.querySelectorAll("[data-bdap-sort]")),
    rows: Array.from(document.querySelectorAll("[data-bdap-row]")),
    barRows: Array.from(document.querySelectorAll("[data-bdap-bar-row]")),
    tableBody: document.querySelector("[data-bdap-table-body]"),
    bars: document.querySelector("[data-bdap-bars]"),
    area: document.querySelector("[data-bdap-area]"),
    name: document.querySelector("[data-bdap-name]"),
    sentence: document.querySelector("[data-bdap-sentence]"),
    latest: document.querySelector("[data-bdap-latest]"),
    low: document.querySelector("[data-bdap-low]"),
    gain: document.querySelector("[data-bdap-gain]"),
    rate: document.querySelector("[data-bdap-rate]"),
    badge: document.querySelector("[data-bdap-badge]"),
    areaLabel: document.querySelector("[data-bdap-area-label]"),
    date: document.querySelector("[data-bdap-date]"),
    jeonse: document.querySelector("[data-bdap-jeonse]"),
    note: document.querySelector("[data-bdap-note]"),
    tradeNote: document.querySelector("[data-bdap-trade-note]"),
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
    if (sortKey === "redevelopment") {
      return rows.sort((a, b) => {
        const diff = (redevelopmentWeight[b.redevelopmentStatus] || 0) - (redevelopmentWeight[a.redevelopmentStatus] || 0);
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
    setText(els.area, `${apartment.areaGroup} · ${apartment.redevelopmentStatus}`);
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
    setText(els.jeonse, apartment.jeonseRatio ? `${apartment.jeonseRatio}% 참고` : "거래 부족");
    setText(els.note, apartment.note);
    setText(els.tradeNote, apartment.tradeCountNote);
  };

  const renderActiveState = (complexId) => {
    els.tabs.forEach((tab) => {
      const isActive = tab.getAttribute("data-bdap-tab") === complexId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    els.rows.forEach((row) => row.classList.toggle("is-active", row.getAttribute("data-bdap-row") === complexId));
    els.barRows.forEach((row) => row.classList.toggle("is-active", row.getAttribute("data-bdap-bar-row") === complexId));
  };

  const renderTable = (sortKey) => {
    if (!els.tableBody) return;
    getSortedApartments(sortKey).forEach((apartment) => {
      const row = document.querySelector(`[data-bdap-row="${apartment.id}"]`);
      if (row) els.tableBody.appendChild(row);
    });
  };

  const renderBars = (sortKey) => {
    if (!els.bars) return;
    getSortedApartments(sortKey).forEach((apartment) => {
      const row = document.querySelector(`[data-bdap-bar-row="${apartment.id}"]`);
      if (row) els.bars.appendChild(row);
    });
  };

  const renderSortButtons = (sortKey) => {
    els.sortButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-bdap-sort") === sortKey);
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
      const id = tab.getAttribute("data-bdap-tab");
      if (id && apartments.some((item) => item.id === id)) update({ complex: id });
    });
  });

  els.sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sort = button.getAttribute("data-bdap-sort");
      if (sortKeys.includes(sort)) update({ sort });
    });
  });

  update(state);
})();
