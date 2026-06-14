import { buildDefaultOptions, formatKRW, CHART_COLORS } from "./chart-config.js";
import { readParam, writeParams } from "./url-state.js";

const configEl = document.getElementById("ubgConfig");
const config = JSON.parse(configEl.textContent || "{}");
const { companies, tierOrder, tierMeta, exchangeRange } = config;

const els = {
  company: document.getElementById("ubgCompany"),
  tier: document.getElementById("ubgTier"),
  tierHint: document.getElementById("ubgTierHint"),
  fxRate: document.getElementById("ubgFxRate"),
  fxRateValue: document.getElementById("ubgFxRateValue"),
  resultSubcopy: document.getElementById("ubgResultSubcopy"),
  totalUsd: document.getElementById("ubgTotalUsd"),
  badge: document.getElementById("ubgBadge"),
  totalKrw: document.getElementById("ubgTotalKrw"),
  monthlyKrw: document.getElementById("ubgMonthlyKrw"),
  stockRatio: document.getElementById("ubgStockRatio"),
  donutLegend: document.getElementById("ubgDonutLegend"),
  fxTableBody: document.querySelector("#ubgFxTable tbody"),
  crossTitle: document.getElementById("ubgCrossTitle"),
  resetBtn: document.getElementById("ubgResetBtn"),
  copyBtn: document.getElementById("ubgCopyLinkBtn"),
};

let donutChart = null;
let crossChart = null;

const formatUsd = (value) => `$${Math.round(value).toLocaleString("en-US")}`;
const usdToKrw = (usd, rate) => Math.round(usd * rate);

const getCompany = (id) => companies.find((c) => c.id === id) ?? companies[0];
const getLevel = (company, tier) => company.levels.find((l) => l.tier === tier) ?? company.levels[0];

function populateTierOptions(company) {
  const previousTier = els.tier.value;
  els.tier.innerHTML = "";
  for (const tier of tierOrder) {
    const level = getLevel(company, tier);
    const opt = document.createElement("option");
    opt.value = tier;
    opt.textContent = `${level.levelLabel} · ${tierMeta[tier].label}`;
    els.tier.appendChild(opt);
  }
  if (tierOrder.includes(previousTier)) {
    els.tier.value = previousTier;
  }
}

function renderDonut(level) {
  const canvas = document.getElementById("ubgDonutChart");
  const data = [level.baseUsd, level.stockUsd, level.bonusUsd];
  const labels = ["Base", "Stock", "Bonus"];
  const colors = [CHART_COLORS.brand, CHART_COLORS.accent, CHART_COLORS.warning];

  if (donutChart) {
    donutChart.data.datasets[0].data = data;
    donutChart.update();
  } else if (canvas && window.Chart) {
    donutChart = new window.Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0 }],
      },
      options: buildDefaultOptions({
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(23,32,51,0.88)",
            callbacks: {
              label: (ctx) => `${ctx.label}: ${formatUsd(ctx.raw)}`,
            },
          },
        },
      }),
    });
  }

  els.donutLegend.innerHTML = labels
    .map((label, i) => `<li><span style="background:${colors[i]}"></span>${label} ${formatUsd(data[i])}</li>`)
    .join("");
}

function renderCrossChart(tier, currentCompanyId, fxRate) {
  const canvas = document.getElementById("ubgCrossChart");
  const labels = companies.map((c) => c.name);
  const data = companies.map((c) => Math.round(usdToKrw(getLevel(c, tier).totalUsd, fxRate) / 10_000));
  const colors = companies.map((c) => (c.id === currentCompanyId ? CHART_COLORS.brand : CHART_COLORS.gray));

  els.crossTitle.textContent = `${tierMeta[tier].label} 레벨, 6개사는 얼마나 차이 날까`;

  if (crossChart) {
    crossChart.data.labels = labels;
    crossChart.data.datasets[0].data = data;
    crossChart.data.datasets[0].backgroundColor = colors;
    crossChart.update();
  } else if (canvas && window.Chart) {
    crossChart = new window.Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "총보상(만원)", data, backgroundColor: colors }],
      },
      options: buildDefaultOptions({
        indexAxis: "y",
        scales: {
          x: {
            ticks: { callback: (value) => formatKRW(value * 10_000) },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(23,32,51,0.88)",
            callbacks: {
              label: (ctx) => `${formatKRW(ctx.raw * 10_000)}원`,
            },
          },
        },
      }),
    });
  }
}

function renderFxTable(totalUsd, currentRate) {
  const rates = [];
  for (let r = exchangeRange.min; r <= exchangeRange.max; r += exchangeRange.step * 4) {
    rates.push(r);
  }
  if (!rates.includes(currentRate)) {
    rates.push(currentRate);
    rates.sort((a, b) => a - b);
  }

  els.fxTableBody.innerHTML = rates
    .map((rate) => {
      const totalKrw = usdToKrw(totalUsd, rate);
      const monthlyKrw = Math.round(totalKrw / 12);
      const isCurrent = rate === currentRate;
      return `<tr class="${isCurrent ? "is-current" : ""}"><td>${rate.toLocaleString("ko-KR")}원${isCurrent ? " (현재)" : ""}</td><td><strong>${formatKRW(totalKrw)}원</strong></td><td>${formatKRW(monthlyKrw)}원</td></tr>`;
    })
    .join("");
}

function updateRelatedLinks(companyId) {
  document.querySelectorAll("[data-company-link]").forEach((el) => {
    el.hidden = el.getAttribute("data-company-link") !== companyId;
  });
}

function render() {
  const companyId = els.company.value;
  const tier = els.tier.value;
  const fxRate = Number(els.fxRate.value);

  const company = getCompany(companyId);
  const level = getLevel(company, tier);
  const totalKrw = usdToKrw(level.totalUsd, fxRate);
  const monthlyKrw = Math.round(totalKrw / 12);
  const stockRatio = Math.round((level.stockUsd / level.totalUsd) * 100);

  els.fxRateValue.textContent = fxRate.toLocaleString("ko-KR");
  els.resultSubcopy.textContent = `${company.name} ${level.levelLabel} (${level.roleExample}, 경력 ${level.yearsExperience}) 기준입니다.`;
  els.totalUsd.textContent = formatUsd(level.totalUsd);
  els.badge.textContent = level.badge;
  els.totalKrw.textContent = `${formatKRW(totalKrw)}원`;
  els.monthlyKrw.textContent = `${formatKRW(monthlyKrw)}원`;
  els.stockRatio.textContent = `${stockRatio}%`;

  renderDonut(level);
  renderFxTable(level.totalUsd, fxRate);
  renderCrossChart(tier, companyId, fxRate);
  updateRelatedLinks(companyId);

  writeParams({ company: companyId, tier, fx: fxRate });
}

function handleCompanyChange() {
  const company = getCompany(els.company.value);
  populateTierOptions(company);
  render();
}

els.company.addEventListener("change", handleCompanyChange);
els.tier.addEventListener("change", render);
els.fxRate.addEventListener("input", render);

if (els.resetBtn) {
  els.resetBtn.addEventListener("click", () => {
    els.company.value = companies[0].id;
    populateTierOptions(companies[0]);
    els.tier.value = "senior";
    els.fxRate.value = String(config.exchangeRate);
    render();
  });
}

if (els.copyBtn) {
  els.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      els.copyBtn.textContent = "복사됨!";
      setTimeout(() => {
        els.copyBtn.textContent = "링크 복사";
      }, 1500);
    } catch {
      /* ignore */
    }
  });
}

// 초기화: URL 파라미터 우선
const initialCompanyId = readParam("company", companies[0].id);
const initialCompany = companies.find((c) => c.id === initialCompanyId) ?? companies[0];
els.company.value = initialCompany.id;
populateTierOptions(initialCompany);

const initialTier = readParam("tier", "senior");
if (tierOrder.includes(initialTier)) {
  els.tier.value = initialTier;
}

const initialFx = Number(readParam("fx", String(config.exchangeRate)));
if (!Number.isNaN(initialFx) && initialFx >= exchangeRange.min && initialFx <= exchangeRange.max) {
  els.fxRate.value = String(initialFx);
}

render();
