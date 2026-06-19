import { CHART_COLORS, buildDefaultOptions } from "./chart-config.js";
import { readParam, readBool, writeParams } from "./url-state.js";

const $ = (id) => document.getElementById(id);

const configNode = $("mvssConfig");
const config = JSON.parse(configNode?.textContent || "{}");
const { defaults, presets } = config;

// ── 입력 요소 ────────────────────────────────────────────────────────────────
const baseFeeInput = $("baseFeeInput");
const baseFeeSlider = $("baseFeeSlider");
const baseFeeSliderVal = $("baseFeeSliderVal");
const familyDiscountInput = $("familyDiscountInput");
const contractDiscountInput = $("contractDiscountInput");
const earlyTermFeeInput = $("earlyTermFeeInput");
const mvnoFeeInput = $("mvnoFeeInput");
const mvnoFeeSlider = $("mvnoFeeSlider");
const mvnoFeeSliderVal = $("mvnoFeeSliderVal");
const familyLostToggle = $("familyLostToggle");
const familyLossAmountInput = $("familyLossAmountInput");
const familyLossField = $("familyLossField");
const calcBtn = $("calcMvssBtn");
const resetBtn = $("resetMvssBtn");
const copyBtn = $("copyMvssLinkBtn");

let lineChart = null;
let currentPeriod = defaults.period;
let familyLost = false;

// ── 숫자 유틸 ────────────────────────────────────────────────────────────────
const toNum = (el) => Math.max(0, Number(el?.value) || 0);

function formatWon(n) {
  const abs = Math.abs(Math.round(n));
  let str;
  if (abs >= 100_000_000) str = `${(abs / 100_000_000).toFixed(1)}억원`;
  else if (abs >= 10_000) str = `${Math.round(abs / 10_000).toLocaleString("ko-KR")}만원`;
  else str = `${abs.toLocaleString("ko-KR")}원`;
  return n < 0 ? `-${str}` : str;
}

function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function setHidden(el, hide) {
  if (!el) return;
  el.hidden = hide;
}

// ── 슬라이더 동기화 ──────────────────────────────────────────────────────────
function syncSlider(input, slider, valEl) {
  const v = input.value;
  slider.value = v;
  valEl.textContent = `${Number(v).toLocaleString("ko-KR")}원`;
}

baseFeeInput.addEventListener("input", () => {
  syncSlider(baseFeeInput, baseFeeSlider, baseFeeSliderVal);
  render();
});
baseFeeSlider.addEventListener("input", () => {
  baseFeeInput.value = baseFeeSlider.value;
  baseFeeSliderVal.textContent = `${Number(baseFeeSlider.value).toLocaleString("ko-KR")}원`;
  render();
});

mvnoFeeInput.addEventListener("input", () => {
  syncSlider(mvnoFeeInput, mvnoFeeSlider, mvnoFeeSliderVal);
  render();
});
mvnoFeeSlider.addEventListener("input", () => {
  mvnoFeeInput.value = mvnoFeeSlider.value;
  mvnoFeeSliderVal.textContent = `${Number(mvnoFeeSlider.value).toLocaleString("ko-KR")}원`;
  render();
});

[familyDiscountInput, contractDiscountInput, earlyTermFeeInput, familyLossAmountInput].forEach(
  (el) => el?.addEventListener("input", render)
);

// ── 가족결합 상실 토글 ────────────────────────────────────────────────────────
familyLostToggle.addEventListener("click", () => {
  familyLost = !familyLost;
  familyLostToggle.setAttribute("aria-pressed", String(familyLost));
  familyLostToggle.textContent = familyLost ? "ON" : "OFF";
  familyLostToggle.classList.toggle("is-active", familyLost);
  setHidden(familyLossField, !familyLost);
  render();
});

// ── 비교 기간 탭 ──────────────────────────────────────────────────────────────
document.querySelectorAll(".mvss-period-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentPeriod = Number(btn.dataset.period);
    document.querySelectorAll(".mvss-period-btn").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.period === String(currentPeriod)));
    });
    render();
  });
});

// ── 예시 요금제 버튼 ─────────────────────────────────────────────────────────
document.querySelectorAll(".mvss-preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const fee = Number(btn.dataset.fee);
    mvnoFeeInput.value = fee;
    mvnoFeeSlider.value = fee;
    mvnoFeeSliderVal.textContent = `${fee.toLocaleString("ko-KR")}원`;
    document.querySelectorAll(".mvss-preset-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    render();
  });
});

// ── 계산 ─────────────────────────────────────────────────────────────────────
function compute() {
  const baseFee = toNum(baseFeeInput);
  const familyDiscount = toNum(familyDiscountInput);
  const contractDiscount = toNum(contractDiscountInput);
  const earlyTermFee = toNum(earlyTermFeeInput);
  const mvnoFee = toNum(mvnoFeeInput);
  const familyLossAmount = familyLost ? toNum(familyLossAmountInput) : 0;

  const currentMonthly = Math.max(0, baseFee - familyDiscount - contractDiscount);
  const mvnoMonthly = mvnoFee + familyLossAmount;
  const monthlySaving = currentMonthly - mvnoMonthly;

  const saving12 = monthlySaving * 12;
  const savingPeriod = monthlySaving * currentPeriod;

  const breakEvenMonths =
    earlyTermFee > 0 && monthlySaving > 0 ? Math.ceil(earlyTermFee / monthlySaving) : 0;

  const chartData = Array.from({ length: currentPeriod }, (_, i) => ({
    month: i + 1,
    cumulative: monthlySaving * (i + 1) - earlyTermFee,
  }));

  return {
    baseFee, familyDiscount, contractDiscount, earlyTermFee,
    mvnoFee, familyLossAmount,
    currentMonthly, mvnoMonthly, monthlySaving,
    saving12, savingPeriod,
    breakEvenMonths, chartData,
    isWarning: monthlySaving <= 0,
  };
}

// ── 렌더 함수들 ───────────────────────────────────────────────────────────────
function renderRealtime(r) {
  setText("currentMonthlyLabel", formatWon(r.currentMonthly));
  setText("mvnoMonthlyLabel", formatWon(r.mvnoMonthly));
}

function renderKpi(r) {
  setHidden($("mvssWarningBanner"), !r.isWarning);

  const periodLabel = `${currentPeriod}개월 절감액`;
  setText("kpiPeriodLabel", periodLabel);
  setText("mvssResultHeadline", r.isWarning ? "현재 요금제가 더 유리합니다" : `${currentPeriod}개월 통신비 절감액`);

  setText("kpiPeriodSaving", formatWon(r.savingPeriod));
  setText("kpiPeriodNote", r.isWarning ? "알뜰폰이 더 비쌉니다" : `${currentPeriod}개월 총 절감 추정`);

  setText("kpiMonthlySaving", formatWon(r.monthlySaving));
  setText("kpiMonthlyNote", `월 ${formatWon(r.currentMonthly)} → ${formatWon(r.mvnoMonthly)}`);

  setText("kpi1yearSaving", formatWon(r.saving12));
  setText("kpi1yearNote", "1년 누적 절감 추정");

  if (r.earlyTermFee === 0) {
    setText("kpiBreakEven", "즉시 전환 가능");
    setText("kpiBreakEvenNote", "위약금 없음");
  } else if (r.isWarning) {
    setText("kpiBreakEven", "회수 불가");
    setText("kpiBreakEvenNote", "절감액이 없어 회수되지 않습니다");
  } else {
    setText("kpiBreakEven", `${r.breakEvenMonths}개월 후`);
    setText("kpiBreakEvenNote", `위약금 ${formatWon(r.earlyTermFee)} 회수 시점`);
  }
}

function renderCompare(r) {
  const currentRows = $("compareCurrentRows");
  const mvnoRows = $("compareMvnoRows");
  const diffEl = $("mvssCompareDiff");
  if (!currentRows || !mvnoRows) return;

  const row = (label, val, isDiscount = false) =>
    `<div class="mvss-compare-row"><span>${label}</span><span class="${isDiscount ? "mvss-compare-row--discount" : ""}">${val}</span></div>`;

  currentRows.innerHTML =
    row("기본료", formatWon(r.baseFee)) +
    (r.familyDiscount > 0 ? row("가족결합 할인", `−${formatWon(r.familyDiscount)}`, true) : "") +
    (r.contractDiscount > 0 ? row("선택약정 할인", `−${formatWon(r.contractDiscount)}`, true) : "");

  mvnoRows.innerHTML =
    row("월 요금", formatWon(r.mvnoFee)) +
    (r.familyLossAmount > 0 ? row("가족결합 상실 추가", `+${formatWon(r.familyLossAmount)}`) : "");

  setText("compareCurrentTotal", formatWon(r.currentMonthly));
  setText("compareMvnoTotal", formatWon(r.mvnoMonthly));

  const saving = r.monthlySaving;
  diffEl.innerHTML = saving > 0
    ? `<strong class="mvss-diff-positive">월 ${formatWon(saving)} 절약 · ${currentPeriod}개월 ${formatWon(r.savingPeriod)} 절약</strong>`
    : saving === 0
    ? `<span>현재 요금제와 알뜰폰 비용이 동일합니다.</span>`
    : `<strong class="mvss-diff-negative">알뜰폰이 월 ${formatWon(Math.abs(saving))} 더 비쌉니다.</strong>`;
}

function renderChart(r) {
  const canvas = $("mvss-line-chart");
  const noteEl = $("mvssChartNote");
  if (!canvas || !window.Chart) return;

  const labels = r.chartData.map((d) => `${d.month}개월`);
  const data = r.chartData.map((d) => d.cumulative);
  const colors = data.map((v) => (v >= 0 ? CHART_COLORS.brand : CHART_COLORS.warning));

  if (lineChart) {
    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = data;
    lineChart.data.datasets[0].pointBackgroundColor = colors;
    lineChart.update();
  } else {
    lineChart = new window.Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "누적 절감액",
            data,
            borderColor: CHART_COLORS.brand,
            backgroundColor: "rgba(29,158,117,0.08)",
            pointBackgroundColor: colors,
            pointRadius: 3,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: buildDefaultOptions({
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
          y: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { callback: (v) => (Math.abs(v) >= 10000 ? `${Math.round(v / 10000)}만` : `${v}`) },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatWon(ctx.raw)}`,
            },
          },
        },
      }),
    });
  }

  // 위약금 회수선 — afterDraw 플러그인
  if (!lineChart._mvssBreakEvenPlugin) {
    lineChart._mvssBreakEvenPlugin = true;
    lineChart.options.plugins.breakEvenLine = true;
    const plugin = {
      id: "breakEvenLine",
      afterDraw(chart) {
        const bm = r.breakEvenMonths;
        if (!bm || bm <= 0 || bm > currentPeriod) return;
        const { ctx, chartArea, scales } = chart;
        const xPos = scales.x.getPixelForValue(bm - 1);
        ctx.save();
        ctx.strokeStyle = CHART_COLORS.warning;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(xPos, chartArea.top);
        ctx.lineTo(xPos, chartArea.bottom);
        ctx.stroke();
        ctx.fillStyle = CHART_COLORS.warning;
        ctx.font = "500 10px sans-serif";
        ctx.fillText(`${bm}개월 회수`, xPos + 4, chartArea.top + 12);
        ctx.restore();
      },
    };
    window.Chart.register(plugin);
    lineChart.update();
  }

  if (noteEl) {
    if (r.earlyTermFee > 0 && !r.isWarning && r.breakEvenMonths <= currentPeriod) {
      noteEl.textContent = `${r.breakEvenMonths}개월째부터 위약금 ${formatWon(r.earlyTermFee)} 회수 완료, 실질 절약 시작`;
    } else if (r.earlyTermFee > 0 && r.breakEvenMonths > currentPeriod) {
      noteEl.textContent = `${currentPeriod}개월 안에 위약금이 회수되지 않습니다. 위약금 만료 후 전환을 고려해 보세요.`;
    } else {
      noteEl.textContent = "";
    }
  }
}

function render() {
  const r = compute();
  renderRealtime(r);
  renderKpi(r);
  renderCompare(r);
  renderChart(r);

  writeParams({
    base: toNum(baseFeeInput),
    fam: toNum(familyDiscountInput),
    sel: toNum(contractDiscountInput),
    etf: toNum(earlyTermFeeInput),
    mvno: toNum(mvnoFeeInput),
    fl: familyLost ? toNum(familyLossAmountInput) : 0,
    period: currentPeriod,
  });
}

// ── 버튼 ─────────────────────────────────────────────────────────────────────
function flashButton(btn, label) {
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = label;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1500);
}

function resetPage() {
  baseFeeInput.value = defaults.baseFee;
  familyDiscountInput.value = defaults.familyDiscount;
  contractDiscountInput.value = defaults.contractDiscount;
  earlyTermFeeInput.value = defaults.earlyTermFee;
  mvnoFeeInput.value = defaults.mvnoFee;
  familyLossAmountInput.value = defaults.familyLossAmount;

  baseFeeSlider.value = defaults.baseFee;
  baseFeeSliderVal.textContent = `${defaults.baseFee.toLocaleString("ko-KR")}원`;
  mvnoFeeSlider.value = defaults.mvnoFee;
  mvnoFeeSliderVal.textContent = `${defaults.mvnoFee.toLocaleString("ko-KR")}원`;

  familyLost = false;
  familyLostToggle.setAttribute("aria-pressed", "false");
  familyLostToggle.textContent = "OFF";
  familyLostToggle.classList.remove("is-active");
  setHidden(familyLossField, true);

  currentPeriod = defaults.period;
  document.querySelectorAll(".mvss-period-btn").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.period === String(currentPeriod)));
  });

  document.querySelectorAll(".mvss-preset-btn").forEach((b) => b.classList.remove("is-active"));
}

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

// ── URL 파라미터 복원 ─────────────────────────────────────────────────────────
(function applyUrlParams() {
  const base = readParam("base", "");
  if (base) {
    baseFeeInput.value = base;
    baseFeeSlider.value = base;
    baseFeeSliderVal.textContent = `${Number(base).toLocaleString("ko-KR")}원`;

    familyDiscountInput.value = readParam("fam", "0");
    contractDiscountInput.value = readParam("sel", "0");
    earlyTermFeeInput.value = readParam("etf", "0");

    const mvnoVal = readParam("mvno", String(defaults.mvnoFee));
    mvnoFeeInput.value = mvnoVal;
    mvnoFeeSlider.value = mvnoVal;
    mvnoFeeSliderVal.textContent = `${Number(mvnoVal).toLocaleString("ko-KR")}원`;

    const fl = Number(readParam("fl", "0"));
    if (fl > 0) {
      familyLost = true;
      familyLossAmountInput.value = fl;
      familyLostToggle.setAttribute("aria-pressed", "true");
      familyLostToggle.textContent = "ON";
      familyLostToggle.classList.add("is-active");
      setHidden(familyLossField, false);
    }

    const p = Number(readParam("period", String(defaults.period)));
    if ([12, 24, 36].includes(p)) {
      currentPeriod = p;
      document.querySelectorAll(".mvss-period-btn").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.period === String(currentPeriod)));
      });
    }
  } else {
    resetPage();
  }
  render();
})();
