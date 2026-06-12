import { formatKRW, buildDefaultOptions, makeLabelPlugin, CHART_COLORS } from "./chart-config.js";
import { readParam, writeParams } from "./url-state.js";

const $ = (id) => document.getElementById(id);

const configNode = $("wpmConfig");
const config = JSON.parse(configNode?.textContent || "{}");

const {
  stages,
  fifaPrizeTable,
  kfaBaseBonusM,
  kfaWinBonusM,
  kfaDrawBonusM,
  kfaStageBonusM,
  squadSize,
  otherIncomeTaxRate,
  sonSalaryUsd,
  defaultExchangeRate,
} = config;

const stageCodes = stages.map((s) => s.code);

const finalStageSelect = $("finalStageSelect");
const groupWinsSelect = $("groupWinsSelect");
const groupDrawsSelect = $("groupDrawsSelect");
const exchangeRateInput = $("exchangeRateInput");
const exchangeRateSlider = $("exchangeRateSlider");
const exchangeRateSliderVal = $("exchangeRateSliderVal");
const calcBtn = $("calcWpmBtn");
const resetBtn = $("resetWpmBtn");
const copyBtn = $("copyWpmLinkBtn");

let stageChart = null;

function formatWon(n) {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

function formatManwon(m) {
  if (m >= 10000) {
    return `${(m / 10000).toFixed(m % 10000 === 0 ? 0 : 1)}억원`;
  }
  return `${m.toLocaleString("ko-KR")}만원`;
}

function formatUsd(n) {
  return `${n.toLocaleString("en-US")}달러`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function computePerPlayerBonusM(stage, groupWins, groupDraws) {
  const matchBonus = groupWins * kfaWinBonusM + groupDraws * kfaDrawBonusM;
  return kfaBaseBonusM + matchBonus + kfaStageBonusM[stage];
}

function syncExchangeInputs(value) {
  exchangeRateInput.value = String(value);
  exchangeRateSlider.value = String(value);
  exchangeRateSliderVal.textContent = `${Number(value).toLocaleString("ko-KR")}원`;
}

function renderSummary(stage, groupWins, groupDraws, exchangeRate) {
  const fifaPrizeUsd = fifaPrizeTable[stage];
  const fifaPrizeKrw = fifaPrizeUsd * exchangeRate;
  const perPlayerBonusM = computePerPlayerBonusM(stage, groupWins, groupDraws);
  const squadTotalBonusM = perPlayerBonusM * squadSize;
  const afterTaxM = Math.round(perPlayerBonusM * (1 - otherIncomeTaxRate));

  const stageInfo = stages.find((s) => s.code === stage);

  setText("resultHeadline", `${stageInfo.label} 시 대표팀 포상금`);

  setText("perPlayerSummary", formatManwon(perPlayerBonusM));
  setText("perPlayerSummaryNote", `${stageInfo.label} 진출 시 선수 1인당`);

  setText("fifaPrizeSummary", formatKRW(fifaPrizeKrw));
  setText("fifaPrizeSummaryNote", `약 ${formatUsd(fifaPrizeUsd)} · 대한축구협회 지급`);

  setText("squadTotalSummary", formatManwon(squadTotalBonusM));
  setText("squadTotalSummaryNote", `선수단 ${squadSize}명 합산`);

  setText("afterTaxSummary", formatManwon(afterTaxM));
  setText("afterTaxSummaryNote", `기타소득세 ${Math.round(otherIncomeTaxRate * 100)}% 차감 추정`);

  return { perPlayerBonusM, squadTotalBonusM, afterTaxM, fifaPrizeKrw, fifaPrizeUsd };
}

function renderBreakdown(stage, groupWins, groupDraws) {
  const matchBonusM = groupWins * kfaWinBonusM + groupDraws * kfaDrawBonusM;
  const stageBonusM = kfaStageBonusM[stage];
  const stageInfo = stages.find((s) => s.code === stage);
  const isEstimate = stage === "SEMI" || stage === "FINAL" || stage === "WINNER";

  setText("breakdownBase", formatManwon(kfaBaseBonusM));
  setText("breakdownMatch", formatManwon(matchBonusM));
  setText("breakdownMatchNote", `${groupWins}승 ${groupDraws}무 (승리 ${formatManwon(kfaWinBonusM)} · 무승부 ${formatManwon(kfaDrawBonusM)})`);
  setText("breakdownStage", formatManwon(stageBonusM));
  setText("breakdownStageNote", `${stageInfo.label} 진출 보너스${isEstimate ? " (추정)" : ""}`);
}

function renderSonCompare(perPlayerBonusM, exchangeRate) {
  const sonAnnualKrw = sonSalaryUsd * exchangeRate;
  const sonDailyKrw = sonAnnualKrw / 365;
  const perPlayerBonusKrw = perPlayerBonusM * 10000;

  const annualPct = (perPlayerBonusKrw / sonAnnualKrw) * 100;
  const dailyRatio = perPlayerBonusKrw / sonDailyKrw;

  setText("sonAnnualPct", `${annualPct.toFixed(1)}%`);
  setText("sonAnnualNote", `손흥민 추정 연봉 ${formatKRW(sonAnnualKrw)} 대비`);

  setText("sonDailyRatio", `${dailyRatio.toFixed(1)}일치`);
  setText("sonDailyNote", `손흥민 추정 일급 ${formatKRW(sonDailyKrw)} 대비`);
}

function renderStageChart(currentStage, groupWins, groupDraws) {
  const labels = stages.map((s) => s.shortLabel);
  const data = stages.map((s) => computePerPlayerBonusM(s.code, groupWins, groupDraws) * 10000);
  const colors = stages.map((s) =>
    s.code === currentStage ? CHART_COLORS.brand : CHART_COLORS.gray
  );

  const canvas = $("wpm-stage-chart");
  if (!canvas || !window.Chart) return;

  if (stageChart) {
    stageChart.data.labels = labels;
    stageChart.data.datasets[0].data = data;
    stageChart.data.datasets[0].backgroundColor = colors;
    stageChart.update();
    return;
  }

  stageChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "1인당 포상금",
          data,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 48,
        },
      ],
    },
    options: buildDefaultOptions({
      indexAxis: "y",
      scales: {
        x: { ticks: { callback: (v) => formatKRW(v) }, grid: { display: false } },
        y: { grid: { display: false } },
      },
    }),
    plugins: [makeLabelPlugin(formatKRW)],
  });
}

function renderStageTable(currentStage, groupWins, groupDraws, exchangeRate) {
  const container = $("wpmStageTable");
  if (!container) return;

  const rows = stages
    .map((s) => {
      const perPlayerBonusM = computePerPlayerBonusM(s.code, groupWins, groupDraws);
      const fifaPrizeKrw = fifaPrizeTable[s.code] * exchangeRate;
      const isCurrent = s.code === currentStage;
      const isEstimate = s.code === "SEMI" || s.code === "FINAL" || s.code === "WINNER";
      return `
        <tr class="${isCurrent ? "wpm-stage-table__row--current" : ""}">
          <td>${s.label}${isEstimate ? ' <span class="wpm-badge">추정</span>' : ""}</td>
          <td>${formatKRW(fifaPrizeKrw)}</td>
          <td>${formatManwon(perPlayerBonusM)}</td>
          <td>${formatManwon(perPlayerBonusM * squadSize)}</td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <table class="wpm-table">
      <thead>
        <tr>
          <th>단계</th>
          <th>FIFA 협회 상금</th>
          <th>1인당 포상금</th>
          <th>선수단 총액</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function render() {
  const stage = finalStageSelect.value;
  const groupWins = Number(groupWinsSelect.value);
  const groupDraws = Number(groupDrawsSelect.value);
  const exchangeRate = Number(exchangeRateInput.value) || defaultExchangeRate;

  const { perPlayerBonusM } = renderSummary(stage, groupWins, groupDraws, exchangeRate);
  renderBreakdown(stage, groupWins, groupDraws);
  renderSonCompare(perPlayerBonusM, exchangeRate);
  renderStageChart(stage, groupWins, groupDraws);
  renderStageTable(stage, groupWins, groupDraws, exchangeRate);

  writeParams({
    stage,
    gw: groupWins,
    gd: groupDraws,
    fx: exchangeRate,
  });
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1500);
}

function resetPage() {
  finalStageSelect.value = "ROUND16";
  groupWinsSelect.value = "1";
  groupDrawsSelect.value = "0";
  syncExchangeInputs(defaultExchangeRate);
}

finalStageSelect.addEventListener("change", render);
groupWinsSelect.addEventListener("change", render);
groupDrawsSelect.addEventListener("change", render);

exchangeRateInput.addEventListener("input", () => {
  exchangeRateSlider.value = exchangeRateInput.value;
  exchangeRateSliderVal.textContent = `${Number(exchangeRateInput.value).toLocaleString("ko-KR")}원`;
  render();
});

exchangeRateSlider.addEventListener("input", () => {
  exchangeRateInput.value = exchangeRateSlider.value;
  exchangeRateSliderVal.textContent = `${Number(exchangeRateSlider.value).toLocaleString("ko-KR")}원`;
  render();
});

calcBtn?.addEventListener("click", render);

resetBtn?.addEventListener("click", () => {
  resetPage();
  render();
  flashButton(resetBtn, "초기화 완료");
});

copyBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton(copyBtn, "복사 완료");
  } catch {
    flashButton(copyBtn, "복사 실패");
  }
});

(function applyUrlParams() {
  const stageParam = readParam("stage", "");
  if (stageParam && stageCodes.includes(stageParam)) {
    finalStageSelect.value = stageParam;
    groupWinsSelect.value = readParam("gw", "1");
    groupDrawsSelect.value = readParam("gd", "0");
    syncExchangeInputs(readParam("fx", String(defaultExchangeRate)));
  } else {
    resetPage();
  }
  render();
})();
