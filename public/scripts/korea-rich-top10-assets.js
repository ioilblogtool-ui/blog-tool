const dataNode = document.getElementById("koreaRichTop10Data");
const historyNode = document.getElementById("koreaRichTop10HistoryData");
const select = document.getElementById("koreaRichProfileSelect");

if (dataNode && historyNode && select) {
  const seed = JSON.parse(dataNode.textContent || "{}");
  const historyEntries = JSON.parse(historyNode.textContent || "[]");
  const entries = Array.isArray(seed.entries) ? seed.entries : [];
  const defaultConfig = seed.conversionDefaults || {};

  const els = {
    rateInput: document.getElementById("usdKrwRateInput"),
    seoulInput: document.getElementById("seoul84PriceInput"),
    grandeurInput: document.getElementById("grandeurPriceInput"),
    overview: document.getElementById("koreaTop10Overview"),
    chart: document.getElementById("koreaAssetChart"),
    historyChart: document.getElementById("koreaHistoryChart"),
    name: document.getElementById("koreaProfileName"),
    nameEn: document.getElementById("koreaProfileNameEn"),
    rank: document.getElementById("koreaProfileRank"),
    krwValue: document.getElementById("koreaProfileKrwValue"),
    usdValue: document.getElementById("koreaProfileUsdValue"),
    seoulCount: document.getElementById("koreaProfileSeoulCount"),
    grandeurCount: document.getElementById("koreaProfileGrandeurCount"),
    source: document.getElementById("koreaProfileSource"),
    sector: document.getElementById("koreaProfileSector"),
    wealthType: document.getElementById("koreaProfileWealthType"),
    tags: document.getElementById("koreaProfileTags"),
    summary: document.getElementById("koreaProfileSummary"),
    funSeoul: document.getElementById("koreaFunSeoulCount"),
    funGrandeur: document.getElementById("koreaFunGrandeurCount")
  };

  const wealthTypeMap = {
    inherited: "상속형",
    "self-made": "자수성가형",
    mixed: "혼합형"
  };

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function getConfig() {
    return {
      usdKrwRate: toNumber(els.rateInput && els.rateInput.value, defaultConfig.usdKrwRate || 1500),
      seoul84PriceKrw: toNumber(els.seoulInput && els.seoulInput.value, defaultConfig.seoul84PriceKrw || 1328680000),
      grandeurPriceKrw: toNumber(els.grandeurInput && els.grandeurInput.value, defaultConfig.grandeurPriceKrw || 38570000)
    };
  }

  function formatKrwLarge(value) {
    const jo = Math.floor(value / 1000000000000);
    const remainder = value % 1000000000000;
    const eok = Math.floor(remainder / 100000000);

    if (jo > 0) {
      return `${jo.toLocaleString("ko-KR")}조 ${eok.toLocaleString("ko-KR")}억 원`;
    }

    return `${Math.floor(value / 100000000).toLocaleString("ko-KR")}억 원`;
  }

  function formatUsdB(value) {
    return `$${Number(value).toFixed(1)}B`;
  }

  function formatReadableCount(value, unit) {
    return `약 ${Math.round(value).toLocaleString("ko-KR")}${unit}`;
  }

  function usdBillionToKrw(netWorthUsdB, usdKrwRate) {
    return netWorthUsdB * 1000000000 * usdKrwRate;
  }

  function renderTags(tags) {
    if (!els.tags) return;
    els.tags.innerHTML = "";
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      els.tags.appendChild(chip);
    });
  }

  function renderHistory(entry, config) {
    if (!els.historyChart || !entry) return;

    const history = historyEntries.find((item) => item.slug === entry.slug);
    if (!history || !Array.isArray(history.history)) {
      els.historyChart.innerHTML = "";
      return;
    }

    const maxUsd = Math.max(...history.history.map((point) => point.netWorthUsdB || 0), 0);
    els.historyChart.innerHTML = history.history
      .map((point) => {
        const hasValue = typeof point.netWorthUsdB === "number" && point.netWorthUsdB > 0;
        const width = hasValue && maxUsd > 0 ? (point.netWorthUsdB / maxUsd) * 100 : 0;
        const krwValue = hasValue
          ? formatKrwLarge(usdBillionToKrw(point.netWorthUsdB, config.usdKrwRate))
          : "데이터 없음";
        const usdValue = hasValue ? formatUsdB(point.netWorthUsdB) : "공개값 확인 어려움";
        const statusLabel = point.inTop10 === true ? "TOP 10 진입" : "기준 확인 어려움";
        const sourceLabel = point.sourceRef || "공개 앵커 데이터 미확보";

        return `
          <article class="korea-history-card${hasValue ? "" : " is-empty"}">
            <div class="korea-history-card__head">
              <strong>${point.year}</strong>
              <span>${statusLabel}</span>
            </div>
            <p class="korea-history-card__krw">${krwValue}</p>
            <p class="korea-history-card__usd">${usdValue}</p>
            <div class="korea-history-card__track">
              <span class="korea-history-card__fill" style="width:${width}%"></span>
            </div>
            <p class="korea-history-card__source">${sourceLabel}</p>
          </article>
        `;
      })
      .join("");
  }

  function renderOverview(config) {
    if (!els.overview) return;

    els.overview.innerHTML = entries
      .map((entry) => {
        const krwValue = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
        return `
          <article class="report-overview-card korea-overview-card" data-entry-card="${entry.slug}">
            <p>${entry.rank}위 · ${entry.name}</p>
            <strong>${formatKrwLarge(krwValue)}</strong>
            <span>${formatUsdB(entry.netWorthUsdB)}</span>
            <em>${entry.sector}</em>
          </article>
        `;
      })
      .join("");
  }

  function renderChart(config) {
    if (!els.chart) return;

    const maxUsd = Math.max(...entries.map((entry) => entry.netWorthUsdB));
    els.chart.innerHTML = entries
      .map((entry) => {
        const krwValue = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
        const width = (entry.netWorthUsdB / maxUsd) * 100;

        return `
          <div class="distribution-row">
            <div class="distribution-row__head distribution-row__head--stacked">
              <span>${entry.rank}위 · ${entry.name}</span>
              <strong>${formatKrwLarge(krwValue)}</strong>
            </div>
            <div class="distribution-row__track korea-asset-chart__track">
              <span class="distribution-row__fill" style="width:${width}%"></span>
            </div>
            <p class="korea-asset-chart__meta">${formatUsdB(entry.netWorthUsdB)} · ${entry.sector}</p>
          </div>
        `;
      })
      .join("");
  }

  function renderProfile(entry, config) {
    if (!entry) return;

    const krwValue = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
    const seoulCount = krwValue / config.seoul84PriceKrw;
    const grandeurCount = krwValue / config.grandeurPriceKrw;

    if (els.name) els.name.textContent = entry.name;
    if (els.nameEn) els.nameEn.textContent = entry.nameEn || "";
    if (els.rank) els.rank.textContent = `${entry.rank}위`;
    if (els.krwValue) els.krwValue.textContent = formatKrwLarge(krwValue);
    if (els.usdValue) els.usdValue.textContent = formatUsdB(entry.netWorthUsdB);
    if (els.seoulCount) els.seoulCount.textContent = formatReadableCount(seoulCount, "채");
    if (els.grandeurCount) els.grandeurCount.textContent = formatReadableCount(grandeurCount, "대");
    if (els.source) els.source.textContent = entry.sourceOfWealth;
    if (els.sector) els.sector.textContent = entry.sector;
    if (els.wealthType) els.wealthType.textContent = wealthTypeMap[entry.wealthType] || entry.wealthType;
    if (els.summary) els.summary.textContent = entry.summary;
    if (els.funSeoul) els.funSeoul.textContent = formatReadableCount(seoulCount, "채");
    if (els.funGrandeur) els.funGrandeur.textContent = formatReadableCount(grandeurCount, "대");

    renderTags(entry.tags || []);
  }

  function renderAll() {
    const config = getConfig();
    const selected = entries.find((entry) => entry.slug === select.value) || entries[0];
    renderOverview(config);
    renderChart(config);
    renderProfile(selected, config);
    renderHistory(selected, config);
  }

  select.addEventListener("change", renderAll);
  [els.rateInput, els.seoulInput, els.grandeurInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", renderAll);
      input.addEventListener("change", renderAll);
    }
  });

  renderAll();
}
