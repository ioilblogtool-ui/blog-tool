(function () {
  const payloadScript = document.getElementById("shaaPayload");
  if (!payloadScript) return;

  const payload = JSON.parse(payloadScript.textContent || "{}");
  const districts = payload.districts || [];
  const tierLabels = payload.tierLabels || {};
  const defaults = payload.defaults || {};

  const incomeRange = document.getElementById("shaaIncomeRange");
  const incomeNumber = document.getElementById("shaaIncomeNumber");
  const cashRange = document.getElementById("shaaCashRange");
  const cashNumber = document.getElementById("shaaCashNumber");
  const ltvSelect = document.getElementById("shaaLtvSelect");
  const modeBuyBtn = document.getElementById("shaaModeBuy");
  const modeJeonseBtn = document.getElementById("shaaModeJeonse");
  const panel = document.getElementById("shaaPanel");
  const tooltip = document.getElementById("shaaTooltip");
  const searchInput = document.getElementById("shaaDistrictSearch");
  const searchButton = document.getElementById("shaaDistrictSearchButton");
  const interactiveNodes = document.querySelectorAll("[data-district-id]");

  let mode = "buy";
  let selectedDistrictId = "gangnam";

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const formatEok = (manwon) => {
    if (!Number.isFinite(manwon) || manwon <= 0) return "0원";
    const eok = manwon / 10000;
    return `${eok >= 10 ? eok.toFixed(1) : eok.toFixed(2)}억원`;
  };

  function calcMaxBuyBudget(cashManwon, ltv) {
    return cashManwon / (1 - ltv / 100);
  }

  function calcMaxJeonseBudget(cashManwon, jeonseLoanRatio) {
    return cashManwon + cashManwon * jeonseLoanRatio;
  }

  function classify(district, maxBuy, maxJeonse) {
    const averageManwon = district.average / 10000;
    const price84Manwon = district.price84 / 10000;
    const jeonseManwon = (district.average * (district.jeonseRatio / 100)) / 10000;

    // price84(국민평형 84㎡ 평균가)는 average(전체 평형 평균가)보다 항상 높으므로
    // 더 큰 임계값(price84)을 먼저 확인해야 "대출 부담 큼" 구간이 제대로 분류된다.
    let tier;
    if (maxBuy >= price84Manwon) tier = "buyable";
    else if (maxBuy >= averageManwon) tier = "stretch";
    else if (maxJeonse >= jeonseManwon) tier = "jeonse-only";
    else tier = "hard";

    return Object.assign({}, district, { tier, averageManwon, price84Manwon, jeonseManwon });
  }

  function recalcAll() {
    const cash = Number(cashNumber.value) || 0;
    const ltv = Number(ltvSelect.value) || 70;
    const maxBuy = calcMaxBuyBudget(cash, ltv);
    const maxJeonse = calcMaxJeonseBudget(cash, defaults.jeonseLoanRatio || 0.8);
    return districts.map((d) => classify(d, maxBuy, maxJeonse));
  }

  function repaintMap(results) {
    const byId = new Map(results.map((r) => [r.id, r]));
    interactiveNodes.forEach((node) => {
      const result = byId.get(node.dataset.districtId);
      if (!result) return;
      // SVG 요소의 className은 SVGAnimatedString 객체라 문자열 메서드를 쓸 수 없으므로 classList로 처리한다.
      Array.from(node.classList).forEach((cls) => {
        if (cls.indexOf("shaa-map__district--") === 0) node.classList.remove(cls);
      });
      node.classList.add("shaa-map__district--" + result.tier);
      node.classList.toggle("is-active", node.dataset.districtId === selectedDistrictId);
      node.setAttribute("aria-label", result.district + " " + (tierLabels[result.tier] || result.tier));
    });
  }

  function updateSummary(results) {
    const counts = { buyable: 0, stretch: 0, "jeonse-only": 0, hard: 0 };
    results.forEach((r) => { counts[r.tier] = (counts[r.tier] || 0) + 1; });
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = String(value); };
    setText("shaaCountBuyable", counts.buyable);
    setText("shaaCountStretch", counts.stretch);
    setText("shaaCountJeonseOnly", counts["jeonse-only"]);
    setText("shaaCountHard", counts.hard);
  }

  function updatePanel(results) {
    const selected = results.find((r) => r.id === selectedDistrictId) || results[0];
    if (!selected || !panel) return;

    const nameEl = document.getElementById("shaaPanelDistrictName");
    if (nameEl) nameEl.textContent = selected.district;

    const pill = document.getElementById("shaaPanelTierPill");
    if (pill) {
      pill.textContent = tierLabels[selected.tier] || selected.tier;
      pill.className = "shaa-tier-pill shaa-tier-pill--" + selected.tier;
    }

    const averageEl = document.getElementById("shaaPanelAverage");
    if (averageEl) averageEl.textContent = formatEok(selected.averageManwon);
    const price84El = document.getElementById("shaaPanelPrice84");
    if (price84El) price84El.textContent = formatEok(selected.price84Manwon);
    const jeonseEl = document.getElementById("shaaPanelJeonse");
    if (jeonseEl) jeonseEl.textContent = formatEok(selected.jeonseManwon);

    const cash = Number(cashNumber.value) || 0;
    const ltv = Number(ltvSelect.value) || 70;
    const maxBuy = calcMaxBuyBudget(cash, ltv);
    const reference = selected.tier === "buyable" ? selected.price84Manwon : selected.averageManwon;
    const gap = selected.tier === "buyable"
      ? maxBuy - reference
      : reference - maxBuy;
    const gapLabel = selected.tier === "buyable"
      ? "예산 여유 약 " + formatEok(gap)
      : "예산 부족 약 " + formatEok(gap);
    const gapEl = document.getElementById("shaaPanelGap");
    if (gapEl) gapEl.textContent = gapLabel;
  }

  function recalcAndRepaint() {
    const results = recalcAll();
    repaintMap(results);
    updateSummary(results);
    updatePanel(results);
  }

  function syncRangeAndNumber(rangeEl, numberEl) {
    if (!rangeEl || !numberEl) return;
    rangeEl.addEventListener("input", () => { numberEl.value = rangeEl.value; recalcAndRepaint(); });
    numberEl.addEventListener("input", () => { rangeEl.value = numberEl.value; recalcAndRepaint(); });
  }
  syncRangeAndNumber(incomeRange, incomeNumber);
  syncRangeAndNumber(cashRange, cashNumber);
  if (ltvSelect) ltvSelect.addEventListener("change", recalcAndRepaint);

  function setMode(nextMode) {
    mode = nextMode;
    if (modeBuyBtn) {
      modeBuyBtn.classList.toggle("is-active", mode === "buy");
      modeBuyBtn.setAttribute("aria-selected", String(mode === "buy"));
    }
    if (modeJeonseBtn) {
      modeJeonseBtn.classList.toggle("is-active", mode === "jeonse");
      modeJeonseBtn.setAttribute("aria-selected", String(mode === "jeonse"));
    }
    document.querySelectorAll(".shaa-map").forEach((map) => map.classList.toggle("shaa-map--jeonse", mode === "jeonse"));
  }
  if (modeBuyBtn) modeBuyBtn.addEventListener("click", () => setMode("buy"));
  if (modeJeonseBtn) modeJeonseBtn.addEventListener("click", () => setMode("jeonse"));

  interactiveNodes.forEach((node) => {
    const id = node.dataset.districtId;
    node.addEventListener("click", () => {
      selectedDistrictId = id;
      const results = recalcAll();
      repaintMap(results);
      updatePanel(results);
      history.replaceState(null, "", "#" + id);
    });
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectedDistrictId = id;
        const results = recalcAll();
        repaintMap(results);
        updatePanel(results);
      }
    });
    node.addEventListener("mouseenter", () => {
      const result = recalcAll().find((r) => r.id === id);
      if (!tooltip || !result) return;
      tooltip.innerHTML = "<strong>" + escapeHtml(result.district) + "</strong><span>" + escapeHtml(tierLabels[result.tier] || result.tier) + "</span>";
      tooltip.setAttribute("aria-hidden", "false");
    });
    node.addEventListener("mousemove", (event) => {
      if (!tooltip) return;
      tooltip.style.left = (event.offsetX + 14) + "px";
      tooltip.style.top = (event.offsetY + 14) + "px";
    });
    node.addEventListener("mouseleave", () => {
      if (!tooltip) return;
      tooltip.setAttribute("aria-hidden", "true");
    });
  });

  function findDistrict(query) {
    const normalized = String(query || "").trim().replace(/\s/g, "");
    if (!normalized) return null;
    return districts.find((d) => d.district.replace(/\s/g, "").includes(normalized)) || null;
  }

  function runSearch() {
    if (!searchInput) return;
    const district = findDistrict(searchInput.value);
    if (district) {
      selectedDistrictId = district.id;
      const results = recalcAll();
      repaintMap(results);
      updatePanel(results);
      const target = document.getElementById("shaa-district-" + district.id);
      if (target) target.focus({ preventScroll: true });
      return;
    }
    searchInput.setAttribute("aria-invalid", "true");
    window.setTimeout(() => searchInput.removeAttribute("aria-invalid"), 1200);
  }

  if (searchButton) searchButton.addEventListener("click", runSearch);
  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
  }

  const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
  if (districts.some((d) => d.id === hashId)) selectedDistrictId = hashId;

  recalcAndRepaint();
})();
