const dataNode = document.getElementById("koreaRichTop10Data");
const historyNode = document.getElementById("koreaRichTop10HistoryData");
const select = document.getElementById("koreaRichProfileSelect");
const resetButton = document.getElementById("resetKoreaRichProfileBtn");
const copyButton = document.getElementById("copyKoreaRichProfileLinkBtn");

if (dataNode && historyNode && select) {
  const seed = JSON.parse(dataNode.textContent || "{}");
  const historyEntries = JSON.parse(historyNode.textContent || "[]");
  const entries = Array.isArray(seed.entries) ? seed.entries : [];
  const defaultConfig = seed.conversionDefaults || {};
  const defaultSlug = entries[0]?.slug || "";
  const overviewCards = Array.from(document.querySelectorAll("[data-profile-trigger]"));
  const totalKrwBase = entries.reduce(
    (sum, entry) => sum + usdBillionToKrw(Number(entry.netWorthUsdB) || 0, Number(defaultConfig.usdKrwRate) || 1500),
    0
  );

  let overviewChartInstance = null;
  let historyChartInstance = null;

  const els = {
    rateInput: document.getElementById("usdKrwRateInput"),
    seoulInput: document.getElementById("seoul84PriceInput"),
    grandeurInput: document.getElementById("grandeurPriceInput"),
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
    funKrwValue: document.getElementById("koreaFunKrwValue"),
    funUsdValue: document.getElementById("koreaFunUsdValue"),
    funSeoul: document.getElementById("koreaFunSeoulCount"),
    funGrandeur: document.getElementById("koreaFunGrandeurCount")
  };

  const wealthTypeMap = {
    inherited: "상속형",
    "self-made": "자수성가형",
    mixed: "혼합형"
  };

  const wealthColors = {
    "self-made": { bg: "rgba(15, 110, 86, 0.88)", soft: "rgba(15, 110, 86, 0.16)", border: "rgba(15, 110, 86, 1)" },
    inherited: { bg: "rgba(37, 99, 235, 0.82)", soft: "rgba(37, 99, 235, 0.16)", border: "rgba(37, 99, 235, 1)" },
    mixed: { bg: "rgba(124, 58, 237, 0.82)", soft: "rgba(124, 58, 237, 0.16)", border: "rgba(124, 58, 237, 1)" }
  };

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  function getConfig() {
    return {
      usdKrwRate: toNumber(els.rateInput && els.rateInput.value, Number(defaultConfig.usdKrwRate) || 1500),
      seoul84PriceKrw: toNumber(els.seoulInput && els.seoulInput.value, Number(defaultConfig.seoul84PriceKrw) || 1328680000),
      grandeurPriceKrw: toNumber(els.grandeurInput && els.grandeurInput.value, Number(defaultConfig.grandeurPriceKrw) || 38570000)
    };
  }

  function usdBillionToKrw(netWorthUsdB, usdKrwRate) {
    return Number(netWorthUsdB) * 1000000000 * Number(usdKrwRate);
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

  function updateUrl(slug) {
    const url = new URL(window.location.href);
    if (slug && slug !== defaultSlug) {
      url.searchParams.set("profile", slug);
    } else {
      url.searchParams.delete("profile");
    }
    window.history.replaceState({}, "", url);
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

  function renderOverviewCards(selectedSlug) {
    overviewCards.forEach((card) => {
      const isActive = card.getAttribute("data-profile-trigger") === selectedSlug;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderOverviewChart(selectedSlug, config) {
    const canvas = document.getElementById("koreaOverviewCanvas");
    if (!canvas || !window.Chart) return;

    if (overviewChartInstance) {
      overviewChartInstance.destroy();
      overviewChartInstance = null;
    }

    const backgroundColors = entries.map((entry) => {
      const palette = wealthColors[entry.wealthType] || wealthColors.mixed;
      return entry.slug === selectedSlug ? palette.bg : palette.soft;
    });
    const borderColors = entries.map((entry) => {
      const palette = wealthColors[entry.wealthType] || wealthColors.mixed;
      return palette.border;
    });

    overviewChartInstance = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: entries.map((entry) => `${entry.rank}위 ${entry.name}`),
        datasets: [
          {
            data: entries.map((entry) => {
              const krw = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
              return Math.round((krw / 1000000000000) * 10) / 10;
            }),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 26
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              label(context) {
                const entry = entries[context.dataIndex];
                const krw = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
                const share = Math.round((krw / totalKrwBase) * 100);
                return [formatKrwLarge(krw), formatUsdB(entry.netWorthUsdB), `${entry.sector}`, `TOP 10 대비 약 ${share}%`];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.15)" },
            ticks: { callback: (value) => `${value}조` }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          }
        },
        onHover(event, elements) {
          canvas.style.cursor = elements.length > 0 ? "pointer" : "default";
        },
        onClick(event, elements) {
          if (!elements.length) return;
          const nextEntry = entries[elements[0].index];
          if (!nextEntry) return;
          select.value = nextEntry.slug;
          renderAll();
        }
      }
    });
  }

  function renderHistoryChart(entry, config) {
    const canvas = document.getElementById("koreaHistoryCanvas");
    if (!canvas || !window.Chart || !entry) return;

    if (historyChartInstance) {
      historyChartInstance.destroy();
      historyChartInstance = null;
    }

    const history = historyEntries.find((item) => item.slug === entry.slug);
    if (!history || !Array.isArray(history.history)) return;

    const points = history.history;
    const hasData = points.map((point) => typeof point.netWorthUsdB === "number" && point.netWorthUsdB > 0);

    historyChartInstance = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: points.map((point) => String(point.year)),
        datasets: [
          {
            data: points.map((point) => point.netWorthUsdB || 0),
            backgroundColor: hasData.map((flag) => (flag ? "rgba(37, 99, 235, 0.78)" : "rgba(148, 163, 184, 0.14)")),
            borderColor: hasData.map((flag) => (flag ? "rgba(37, 99, 235, 1)" : "rgba(148, 163, 184, 0.25)")),
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 30
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              title(items) {
                return `${items[0].label}년`;
              },
              label(context) {
                const point = points[context.dataIndex];
                if (!hasData[context.dataIndex]) {
                  return "공개된 자산 데이터 없음";
                }
                const krw = formatKrwLarge(usdBillionToKrw(point.netWorthUsdB, config.usdKrwRate));
                const lines = [formatUsdB(point.netWorthUsdB), krw];
                if (point.sourceRef) {
                  lines.push(point.sourceRef);
                }
                return lines;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.15)" },
            ticks: { callback: (value) => `$${value}B` }
          }
        }
      }
    });
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
    if (els.funKrwValue) els.funKrwValue.textContent = formatKrwLarge(krwValue);
    if (els.funUsdValue) els.funUsdValue.textContent = formatUsdB(entry.netWorthUsdB);
    if (els.funSeoul) els.funSeoul.textContent = formatReadableCount(seoulCount, "채");
    if (els.funGrandeur) els.funGrandeur.textContent = formatReadableCount(grandeurCount, "대");

    renderTags(entry.tags || []);
    renderOverviewCards(entry.slug);
    renderOverviewChart(entry.slug, config);
    renderHistoryChart(entry, config);
    updateUrl(entry.slug);
  }

  function renderAll() {
    const config = getConfig();
    const selected = entries.find((entry) => entry.slug === select.value) || entries[0];
    renderProfile(selected, config);
  }

  function resetInputs() {
    if (els.rateInput) els.rateInput.value = String(defaultConfig.usdKrwRate || 1500);
    if (els.seoulInput) els.seoulInput.value = String(defaultConfig.seoul84PriceKrw || 1328680000);
    if (els.grandeurInput) els.grandeurInput.value = String(defaultConfig.grandeurPriceKrw || 38570000);
  }

  function handleCardSelection(slug) {
    const nextEntry = entries.find((entry) => entry.slug === slug);
    if (!nextEntry) return;
    select.value = nextEntry.slug;
    renderAll();
  }

  overviewCards.forEach((card) => {
    const slug = card.getAttribute("data-profile-trigger");
    if (!slug) return;

    card.addEventListener("click", () => {
      handleCardSelection(slug);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleCardSelection(slug);
    });
  });

  select.addEventListener("change", renderAll);
  [els.rateInput, els.seoulInput, els.grandeurInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", renderAll);
    input.addEventListener("change", renderAll);
  });

  resetButton?.addEventListener("click", () => {
    select.value = defaultSlug;
    resetInputs();
    renderAll();
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "링크 복사 완료";
      window.setTimeout(() => {
        copyButton.textContent = "링크 복사";
      }, 1600);
    } catch {
      copyButton.textContent = "복사 실패";
      window.setTimeout(() => {
        copyButton.textContent = "링크 복사";
      }, 1600);
    }
  });

  const url = new URL(window.location.href);
  const initialSlug = url.searchParams.get("profile") || select.value || defaultSlug;
  const initialEntry = entries.find((entry) => entry.slug === initialSlug) || entries[0];
  if (initialEntry) {
    select.value = initialEntry.slug;
  }
  renderAll();
}
