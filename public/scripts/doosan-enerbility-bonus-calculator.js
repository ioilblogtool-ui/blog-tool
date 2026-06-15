/**
 * doosan-enerbility-bonus-calculator.js — 두산에너빌리티 성과급 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("doosanBonusConfig");
if (!configNode) throw new Error("doosanBonusConfig is missing");

const { DOOSAN_BONUS_DEFAULTS, DOOSAN_SIMPLE_TAX_RATE, DOOSAN_SCENARIO_RATES } =
  JSON.parse(configNode.textContent || "{}");

// ── DOM refs ──────────────────────────────────────────────────────────────────
const dbcAnnualSalaryInput     = $("dbcAnnualSalaryInput");
const dbcAnnualSalarySlider    = $("dbcAnnualSalarySlider");
const dbcAnnualSalarySliderVal = $("dbcAnnualSalarySliderVal");

const dbcSalaryPercentInput     = $("dbcSalaryPercentInput");
const dbcSalaryPercentSlider    = $("dbcSalaryPercentSlider");
const dbcSalaryPercentSliderVal = $("dbcSalaryPercentSliderVal");

const dbcMonthlyMultipleInput     = $("dbcMonthlyMultipleInput");
const dbcMonthlyMultipleSlider    = $("dbcMonthlyMultipleSlider");
const dbcMonthlyMultipleSliderVal = $("dbcMonthlyMultipleSliderVal");

const dbcFixedAmountInput = $("dbcFixedAmountInput");
const dbcManualTaxInput   = $("dbcManualTaxInput");

const dbcSalaryPercentBlock   = $("dbcSalaryPercentBlock");
const dbcMonthlyMultipleBlock = $("dbcMonthlyMultipleBlock");
const dbcFixedAmountBlock     = $("dbcFixedAmountBlock");
const dbcManualTaxBlock       = $("dbcManualTaxBlock");

// ── 유틸 ──────────────────────────────────────────────────────────────────────
function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function toNumber(input) {
  return Number(input?.value || 0);
}

// ── 상태 읽기 ─────────────────────────────────────────────────────────────────
function getMode() {
  return document.querySelector('input[name="dbcMode"]:checked')?.value || "salaryPercent";
}

function getTaxMode() {
  return document.querySelector('input[name="dbcTaxMode"]:checked')?.value || "simple";
}

function getTaxRate() {
  if (getTaxMode() === "manual") {
    return Math.max(0, Math.min(50, toNumber(dbcManualTaxInput))) / 100;
  }
  return DOOSAN_SIMPLE_TAX_RATE;
}

// ── 계산 ──────────────────────────────────────────────────────────────────────
function computeGross(annualSalary, mode) {
  const monthlySalary = annualSalary / 12;
  switch (mode) {
    case "monthlyMultiple":
      return monthlySalary * Math.max(0, toNumber(dbcMonthlyMultipleInput));
    case "fixedAmount":
      return Math.max(0, toNumber(dbcFixedAmountInput));
    case "salaryPercent":
    default:
      return annualSalary * Math.max(0, toNumber(dbcSalaryPercentInput)) / 100;
  }
}

function calculate() {
  const annualSalary  = Math.max(0, toNumber(dbcAnnualSalaryInput));
  const monthlySalary = annualSalary / 12;
  const mode = getMode();

  const totalGross = computeGross(annualSalary, mode);
  const taxRate = getTaxRate();
  const totalNet = Math.max(0, totalGross * (1 - taxRate));
  const monthlyRatio = monthlySalary > 0 ? totalGross / monthlySalary : 0;
  const annualRatio  = annualSalary > 0 ? totalGross / annualSalary * 100 : 0;

  return { annualSalary, monthlySalary, mode, totalGross, totalNet, taxRate, monthlyRatio, annualRatio };
}

// ── 슬라이더 동기화 ───────────────────────────────────────────────────────────
function syncAnnualSalarySlider() {
  const val = Math.min(150000000, Math.max(30000000, Math.round(toNumber(dbcAnnualSalaryInput))));
  if (dbcAnnualSalarySlider) dbcAnnualSalarySlider.value = val;
  if (dbcAnnualSalarySliderVal) dbcAnnualSalarySliderVal.textContent = formatKoreanAmount(val);
}

function syncSalaryPercentSlider() {
  const val = Math.min(60, Math.max(0, Math.round(toNumber(dbcSalaryPercentInput))));
  if (dbcSalaryPercentSlider) dbcSalaryPercentSlider.value = val;
  if (dbcSalaryPercentSliderVal) dbcSalaryPercentSliderVal.textContent = `${val}%`;
}

function syncMonthlyMultipleSlider() {
  const val = Math.min(6, Math.max(0, toNumber(dbcMonthlyMultipleInput)));
  if (dbcMonthlyMultipleSlider) dbcMonthlyMultipleSlider.value = val;
  if (dbcMonthlyMultipleSliderVal) dbcMonthlyMultipleSliderVal.textContent = `${val}배`;
}

// ── 컨트롤 정규화 ─────────────────────────────────────────────────────────────
function normalizeControls() {
  const mode = getMode();
  if (dbcSalaryPercentBlock) dbcSalaryPercentBlock.hidden = mode !== "salaryPercent";
  if (dbcMonthlyMultipleBlock) dbcMonthlyMultipleBlock.hidden = mode !== "monthlyMultiple";
  if (dbcFixedAmountBlock) dbcFixedAmountBlock.hidden = mode !== "fixedAmount";

  const isManualTax = getTaxMode() === "manual";
  if (dbcManualTaxBlock) dbcManualTaxBlock.hidden = !isManualTax;
}

// ── KPI 카드 렌더링 ───────────────────────────────────────────────────────────
const MODE_LABELS = {
  salaryPercent: "연봉 × 지급률",
  monthlyMultiple: "월급 × 배수",
  fixedAmount: "직접 입력 금액",
};

function renderKpiCards(result) {
  setText("dbcResultHeadline", "두산에너빌리티 성과급 계산 결과");
  setText("dbcResultSubcopy", `${MODE_LABELS[result.mode] || ""} · 세금 ${getTaxMode() === "manual" ? "직접 입력" : "간이 세율 22%"} 기준`);

  setText("dbcTotalGross", formatKoreanAmount(result.totalGross));
  setText("dbcTotalGrossNote", "시뮬레이션");
  setText("dbcTotalNet", formatKoreanAmount(result.totalNet));
  setText("dbcTotalNetNote", `세율 ${(result.taxRate * 100).toFixed(1)}% 적용 참고값`);
  setText("dbcMonthlyRatio", `${result.monthlyRatio.toFixed(1)}개월`);
  setText("dbcMonthlyRatioNote", `월급 ${formatKoreanAmount(result.monthlySalary)} 기준`);
  setText("dbcAnnualRatio", `${result.annualRatio.toFixed(1)}%`);
  setText("dbcAnnualRatioNote", `연봉 ${formatKoreanAmount(result.annualSalary)} 기준 참고값`);
}

// ── 다음 단계 링크 업데이트 ──────────────────────────────────────────────────
function updateNextStepLinks(result) {
  const bonus = Math.max(0, Math.round(result.totalGross));
  const salary = Math.max(0, Math.round(result.annualSalary));
  const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonus / 12) / 50000) * 50000));

  const afterTaxCta = $("dbcAfterTaxCta");
  const dcaCta      = $("dbcDcaCta");

  if (afterTaxCta) {
    afterTaxCta.href = `/tools/bonus-after-tax-calculator/?bonus=${bonus}&salary=${salary}&company=doosan-enerbility`;
  }
  if (dcaCta) {
    dcaCta.href = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
  }
  setText("dbcNextStepNote", `성과급 세전 ${formatKoreanAmount(bonus)} 기준 · 투자 계산기는 월 ${formatKoreanAmount(monthlyInvest)} 적립으로 연결합니다.`);
}

// ── 시나리오 표 ───────────────────────────────────────────────────────────────
function renderScenarioTable(result) {
  const tbody = $("dbcScenarioTableBody");
  if (!tbody) return;

  const { annualSalary, monthlySalary, taxRate } = result;

  tbody.innerHTML = DOOSAN_SCENARIO_RATES.map((scenario) => {
    const gross = annualSalary * scenario.rate / 100;
    const net   = gross * (1 - taxRate);
    const months = monthlySalary > 0 ? (gross / monthlySalary).toFixed(1) : "0.0";
    return `
      <tr>
        <td class="cell-label"><strong>${scenario.label}</strong></td>
        <td class="cell-highlight">${formatKoreanAmount(gross)}</td>
        <td>${formatKoreanAmount(net)}</td>
        <td>${months}개월</td>
      </tr>
    `;
  }).join("");
}

// ── 시나리오 비교 차트 ────────────────────────────────────────────────────────
let _scenarioChart = null;
function renderScenarioChart(result) {
  const canvas = $("doosan-scenario-chart");
  if (!canvas || !window.Chart) return;

  const { annualSalary, taxRate } = result;
  const labels = DOOSAN_SCENARIO_RATES.map((s) => s.label);
  const grossData = DOOSAN_SCENARIO_RATES.map((s) => annualSalary * s.rate / 100);
  const netData   = grossData.map((g) => g * (1 - taxRate));

  if (_scenarioChart) { _scenarioChart.destroy(); _scenarioChart = null; }

  _scenarioChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "세전", data: grossData, backgroundColor: "#1A56DB", borderRadius: 3 },
        { label: "세후 추정", data: netData, backgroundColor: "#93C5FD", borderRadius: 3 },
      ],
    },
    options: {
      ...buildDefaultOptions(),
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, padding: 10, font: { size: 11 }, color: "#888780" } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatKoreanAmount(ctx.parsed.y)}` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#888780" } },
        y: {
          ticks: { callback: (v) => formatKoreanAmount(v), color: "#888780" },
          grid: { color: "#F0EFED" },
        },
      },
    },
    plugins: [makeLabelPlugin(formatKoreanAmount)],
  });
}

// ── 메인 렌더 ─────────────────────────────────────────────────────────────────
function render() {
  normalizeControls();
  syncAnnualSalarySlider();
  syncSalaryPercentSlider();
  syncMonthlyMultipleSlider();

  const result = calculate();
  renderKpiCards(result);
  updateNextStepLinks(result);
  renderScenarioTable(result);
  renderScenarioChart(result);
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetPage() {
  if (dbcAnnualSalaryInput) dbcAnnualSalaryInput.value = String(DOOSAN_BONUS_DEFAULTS.defaultAnnualSalary);
  if (dbcSalaryPercentInput) dbcSalaryPercentInput.value = String(DOOSAN_BONUS_DEFAULTS.defaultSalaryPercent);
  if (dbcMonthlyMultipleInput) dbcMonthlyMultipleInput.value = String(DOOSAN_BONUS_DEFAULTS.defaultMonthlyMultiple);
  if (dbcFixedAmountInput) dbcFixedAmountInput.value = String(DOOSAN_BONUS_DEFAULTS.defaultFixedAmount);
  if (dbcManualTaxInput) dbcManualTaxInput.value = String(DOOSAN_SIMPLE_TAX_RATE * 100);

  const modeEl = document.querySelector(`input[name="dbcMode"][value="${DOOSAN_BONUS_DEFAULTS.defaultMode}"]`);
  if (modeEl) modeEl.checked = true;

  const taxModeEl = document.querySelector('input[name="dbcTaxMode"][value="simple"]');
  if (taxModeEl) taxModeEl.checked = true;

  render();
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1500);
}

// ── 이벤트 리스너 ─────────────────────────────────────────────────────────────
dbcAnnualSalaryInput?.addEventListener("input", () => { syncAnnualSalarySlider(); render(); });
dbcAnnualSalarySlider?.addEventListener("input", () => {
  if (dbcAnnualSalaryInput) dbcAnnualSalaryInput.value = dbcAnnualSalarySlider.value;
  syncAnnualSalarySlider();
  render();
});

dbcSalaryPercentInput?.addEventListener("input", () => { syncSalaryPercentSlider(); render(); });
dbcSalaryPercentSlider?.addEventListener("input", () => {
  if (dbcSalaryPercentInput) dbcSalaryPercentInput.value = dbcSalaryPercentSlider.value;
  syncSalaryPercentSlider();
  render();
});

dbcMonthlyMultipleInput?.addEventListener("input", () => { syncMonthlyMultipleSlider(); render(); });
dbcMonthlyMultipleSlider?.addEventListener("input", () => {
  if (dbcMonthlyMultipleInput) dbcMonthlyMultipleInput.value = dbcMonthlyMultipleSlider.value;
  syncMonthlyMultipleSlider();
  render();
});

dbcFixedAmountInput?.addEventListener("input", render);
dbcManualTaxInput?.addEventListener("input", render);

document.querySelectorAll('input[name="dbcMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll('input[name="dbcTaxMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

$("calcDoosanBonusBtn")?.addEventListener("click", render);

$("resetDoosanBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetDoosanBonusBtn"), "초기화됨");
});

$("copyDoosanBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyDoosanBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyDoosanBonusLinkBtn"), "복사 실패");
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
resetPage();
