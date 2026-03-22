const dataNode = document.getElementById("koreaRichTop10Data");
const historyNode = document.getElementById("koreaRichTop10HistoryData");
const select = document.getElementById("koreaRichProfileSelect");

if (dataNode && historyNode && select) {
  const seed = JSON.parse(dataNode.textContent || "{}");
  const historyEntries = JSON.parse(historyNode.textContent || "[]");
  const entries = Array.isArray(seed.entries) ? seed.entries : [];
  const defaultConfig = seed.conversionDefaults || {};

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
    funSeoul: document.getElementById("koreaFunSeoulCount"),
    funGrandeur: document.getElementById("koreaFunGrandeurCount")
  };

  const wealthTypeMap = {
    inherited: "상속형",
    "self-made": "자수성가형",
    mixed: "혼합형"
  };

  // 부의 유형별 차트 색상
  const wealthColors = {
    "self-made": { bg: "rgba(16, 185, 129, 0.78)", border: "rgba(16, 185, 129, 1)" },
    inherited:   { bg: "rgba(37,  99, 235, 0.78)", border: "rgba(37,  99, 235, 1)" },
    mixed:       { bg: "rgba(139, 92, 246, 0.78)", border: "rgba(139, 92, 246, 1)" }
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

  // ─── 개요 가로 바 차트 (상위 10명) ─────────────────────────────────────────
  function renderOverview(config) {
    const canvas = document.getElementById("koreaOverviewCanvas");
    if (!canvas || !window.Chart) return;

    if (overviewChartInstance) {
      overviewChartInstance.destroy();
      overviewChartInstance = null;
    }

    // 조원 단위 (소수점 1자리)
    const krwValues = entries.map((e) => {
      const krw = usdBillionToKrw(e.netWorthUsdB, config.usdKrwRate);
      return Math.round((krw / 1e12) * 10) / 10;
    });

    const bgColors    = entries.map((e) => (wealthColors[e.wealthType] || wealthColors.mixed).bg);
    const borderColors = entries.map((e) => (wealthColors[e.wealthType] || wealthColors.mixed).border);

    overviewChartInstance = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: entries.map((e) => `${e.rank}위 ${e.name}`),
        datasets: [{
          data: krwValues,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const entry = entries[ctx.dataIndex];
                const krw = usdBillionToKrw(entry.netWorthUsdB, config.usdKrwRate);
                return [
                  formatKrwLarge(krw),
                  formatUsdB(entry.netWorthUsdB),
                  entry.sector
                ];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: "조원" },
            ticks: { callback: (v) => `${v}조` },
            grid: { color: "rgba(148, 163, 184, 0.15)" }
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
          if (elements.length > 0 && select) {
            select.value = entries[elements[0].index].slug;
            renderAll();
          }
        }
      }
    });
  }

  // ─── 자산 변화 세로 바 차트 (선택 인물 연도별) ────────────────────────────
  function renderHistory(entry, config) {
    const canvas = document.getElementById("koreaHistoryCanvas");
    if (!canvas || !entry || !window.Chart) return;

    if (historyChartInstance) {
      historyChartInstance.destroy();
      historyChartInstance = null;
    }

    const history = historyEntries.find((item) => item.slug === entry.slug);
    if (!history || !Array.isArray(history.history)) return;

    const points  = history.history;
    const hasData = points.map((p) => typeof p.netWorthUsdB === "number" && p.netWorthUsdB > 0);

    historyChartInstance = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: points.map((p) => String(p.year)),
        datasets: [{
          data: points.map((p) => p.netWorthUsdB || 0),
          backgroundColor: hasData.map((v) =>
            v ? "rgba(37, 99, 235, 0.75)" : "rgba(148, 163, 184, 0.12)"
          ),
          borderColor: hasData.map((v) =>
            v ? "rgba(37, 99, 235, 1)" : "rgba(148, 163, 184, 0.25)"
          ),
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title(items) {
                return `${items[0].label}년`;
              },
              label(ctx) {
                const i = ctx.dataIndex;
                const p = points[i];
                if (!hasData[i]) return "공개 앵커 데이터 미확보";
                const krw = formatKrwLarge(usdBillionToKrw(p.netWorthUsdB, config.usdKrwRate));
                const lines = [formatUsdB(p.netWorthUsdB), krw];
                if (p.sourceRef) lines.push(p.sourceRef);
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
            title: { display: true, text: "$B" },
            ticks: { callback: (v) => `$${v}B` },
            grid: { color: "rgba(148, 163, 184, 0.15)" }
          }
        }
      }
    });
  }

  // ─── 프로필 카드 ──────────────────────────────────────────────────────────
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
