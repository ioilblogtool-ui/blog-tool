import { readParam, writeParams } from "./url-state.js";
import { CHART_COLORS, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const configEl = document.getElementById("skadrConfig");
const { ADR_SPEC, DEFAULT_INPUT, PRESETS } = JSON.parse(configEl?.textContent || "{}");
const ADS_PER_SHARE = ADR_SPEC?.adsPerShare ?? 10;
const ROUND_TRIP_FEE_PERCENT = 1.5; // 왕복 환전비용 참고 추정치(%p) — 실제 증권사 조건에 따라 다름

const fields = {
  krxPrice: document.getElementById("skadrKrxPrice"),
  fxRate: document.getElementById("skadrFxRate"),
  adsPrice: document.getElementById("skadrAdsPrice"),
};

const resultEls = {
  heroResult: document.getElementById("skadrHeroResult"),
  directionBadge: document.getElementById("skadrDirectionBadge"),
  premiumPercent: document.getElementById("skadrPremiumPercent"),
  directionLabel: document.getElementById("skadrDirectionLabel"),
  impliedValue: document.getElementById("skadrImpliedValue"),
  premiumAmount: document.getElementById("skadrPremiumAmount"),
  fxApplied: document.getElementById("skadrFxApplied"),
  netSpread: document.getElementById("skadrNetSpread"),
  netSpreadCard: document.getElementById("skadrNetSpreadCard"),
};

const chartCanvas = document.getElementById("skadr-compare-chart");
const presetButtons = document.querySelectorAll(".skadr-preset-chip");
const resetBtn = document.getElementById("skadrResetBtn");
const copyBtn = document.getElementById("skadrCopyLinkBtn");

let compareChart = null;

const state = {
  krxPrice: Number(readParam("krx", DEFAULT_INPUT.krxPrice)),
  fxRate: Number(readParam("fx", DEFAULT_INPUT.fxRate)),
  adsPrice: Number(readParam("ads", DEFAULT_INPUT.adsPrice)),
};

function formatWon(value) {
  if (!Number.isFinite(value)) return "-";
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatFx(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}원`;
}

function calculate({ krxPrice, fxRate, adsPrice }) {
  const impliedShareValueKrw = adsPrice * ADS_PER_SHARE * fxRate;
  const premiumAmount = impliedShareValueKrw - krxPrice;
  const premiumPercent = krxPrice > 0 ? (premiumAmount / krxPrice) * 100 : 0;
  const direction = premiumPercent > 0.01 ? "premium" : premiumPercent < -0.01 ? "discount" : "neutral";

  const netSpreadPercent =
    direction === "premium"
      ? premiumPercent - ROUND_TRIP_FEE_PERCENT
      : direction === "discount"
        ? premiumPercent + ROUND_TRIP_FEE_PERCENT
        : 0;

  return {
    impliedShareValueKrw: Math.round(impliedShareValueKrw),
    premiumAmount: Math.round(premiumAmount),
    premiumPercent,
    netSpreadPercent,
    direction,
  };
}

const directionBadgeLabels = {
  premium: "프리미엄(할증)",
  discount: "디스카운트(할인)",
  neutral: "등가",
};

const directionLabels = {
  premium: (pct) => `나스닥 SKHY가 국내보다 ${Math.abs(pct).toFixed(2)}% 비쌉니다 (김치프리미엄)`,
  discount: (pct) => `나스닥 SKHY가 국내보다 ${Math.abs(pct).toFixed(2)}% 쌉니다 (디스카운트)`,
  neutral: () => "국내 주가와 SKHY 환산가가 거의 같습니다",
};

function netSpreadLabel(netSpreadPercent, direction) {
  if (direction === "neutral" || Math.abs(netSpreadPercent) < 0.01) {
    return "실익 거의 없음";
  }
  return formatPercent(netSpreadPercent);
}

const directionChartColor = {
  premium: CHART_COLORS.warning,
  discount: CHART_COLORS.brand,
  neutral: CHART_COLORS.gray,
};

function renderChart(krxPrice, impliedShareValueKrw, direction) {
  if (!chartCanvas || typeof window.Chart === "undefined") return;

  const barColor = directionChartColor[direction] ?? CHART_COLORS.gray;
  const data = {
    labels: ["국내 주가", "SKHY 환산가치"],
    datasets: [
      {
        data: [krxPrice, impliedShareValueKrw],
        backgroundColor: [CHART_COLORS.gray, barColor],
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options = buildDefaultOptions({
    indexAxis: "y",
    scales: {
      x: { display: false, grid: { display: false } },
      y: { grid: { display: false }, ticks: { font: { size: 12 } } },
    },
    layout: { padding: { right: 56 } },
  });

  if (compareChart) {
    compareChart.data = data;
    compareChart.options = options;
    compareChart.update();
    return;
  }

  compareChart = new window.Chart(chartCanvas, {
    type: "bar",
    data,
    options,
    plugins: [makeLabelPlugin((raw) => formatWon(raw))],
  });
}

function render() {
  const hasValidInput = state.krxPrice > 0 && state.fxRate > 0 && state.adsPrice > 0;

  if (!hasValidInput) {
    resultEls.premiumPercent.textContent = "-";
    resultEls.directionLabel.textContent = "값을 입력하면 계산됩니다";
    resultEls.directionBadge.textContent = "입력 대기";
    resultEls.heroResult.dataset.direction = "neutral";
    resultEls.impliedValue.textContent = "-";
    resultEls.premiumAmount.textContent = "-";
    resultEls.fxApplied.textContent = "-";
    resultEls.netSpread.textContent = "-";
    resultEls.netSpreadCard?.classList.remove("skadr-stat-card--positive", "skadr-stat-card--negative");
    return;
  }

  const result = calculate(state);

  resultEls.premiumPercent.textContent = formatPercent(result.premiumPercent);
  resultEls.directionLabel.textContent = directionLabels[result.direction](result.premiumPercent);
  resultEls.directionBadge.textContent = directionBadgeLabels[result.direction];
  resultEls.heroResult.dataset.direction = result.direction;
  resultEls.impliedValue.textContent = formatWon(result.impliedShareValueKrw);
  resultEls.premiumAmount.textContent = formatWon(result.premiumAmount);
  resultEls.fxApplied.textContent = formatFx(state.fxRate);
  resultEls.netSpread.textContent = netSpreadLabel(result.netSpreadPercent, result.direction);

  resultEls.netSpreadCard?.classList.remove("skadr-stat-card--positive", "skadr-stat-card--negative");
  if (result.netSpreadPercent > 0.01) {
    resultEls.netSpreadCard?.classList.add("skadr-stat-card--positive");
  } else if (result.netSpreadPercent < -0.01) {
    resultEls.netSpreadCard?.classList.add("skadr-stat-card--negative");
  }

  renderChart(state.krxPrice, result.impliedShareValueKrw, result.direction);
}

function syncFieldsFromState() {
  fields.krxPrice.value = state.krxPrice;
  fields.fxRate.value = state.fxRate;
  fields.adsPrice.value = state.adsPrice;
}

function persistState() {
  writeParams({ krx: state.krxPrice, fx: state.fxRate, ads: state.adsPrice });
}

function runCalculation() {
  state.krxPrice = Number(fields.krxPrice.value) || 0;
  state.fxRate = Number(fields.fxRate.value) || 0;
  state.adsPrice = Number(fields.adsPrice.value) || 0;
  render();
  persistState();
}

function resetAll() {
  state.krxPrice = DEFAULT_INPUT.krxPrice;
  state.fxRate = DEFAULT_INPUT.fxRate;
  state.adsPrice = DEFAULT_INPUT.adsPrice;
  syncFieldsFromState();
  render();
  persistState();
}

function copyLink() {
  persistState();
  navigator.clipboard?.writeText(window.location.href).then(() => {
    if (!copyBtn) return;
    const original = copyBtn.textContent;
    copyBtn.textContent = "링크 복사됨";
    setTimeout(() => {
      copyBtn.textContent = original;
    }, 1500);
  });
}

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", runCalculation);
});

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = PRESETS.find((p) => p.id === btn.dataset.preset);
    if (!preset) return;
    state.krxPrice = preset.krxPrice;
    state.fxRate = preset.fxRate;
    state.adsPrice = preset.adsPrice;
    syncFieldsFromState();
    render();
    persistState();

    presetButtons.forEach((other) => other.classList.remove("skadr-preset-chip--active"));
    btn.classList.add("skadr-preset-chip--active");
  });
});

fields.krxPrice?.addEventListener("input", () => {
  presetButtons.forEach((btn) => btn.classList.remove("skadr-preset-chip--active"));
});
fields.fxRate?.addEventListener("input", () => {
  presetButtons.forEach((btn) => btn.classList.remove("skadr-preset-chip--active"));
});
fields.adsPrice?.addEventListener("input", () => {
  presetButtons.forEach((btn) => btn.classList.remove("skadr-preset-chip--active"));
});

resetBtn?.addEventListener("click", () => {
  presetButtons.forEach((btn) => btn.classList.remove("skadr-preset-chip--active"));
});
resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

syncFieldsFromState();
render();
