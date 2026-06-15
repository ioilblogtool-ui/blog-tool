/**
 * hanwha-bonus-calculator.js — 한화오션·한화에어로스페이스 성과급 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("hanwhaBonusConfig");
if (!configNode) throw new Error("hanwhaBonusConfig is missing");

const { HANWHA_COMPANIES, HANWHA_SIMPLE_TAX_RATE, HANWHA_SCENARIO_RATES } =
  JSON.parse(configNode.textContent || "{}");

const companyMap = Object.fromEntries(HANWHA_COMPANIES.map((c) => [c.code, c]));

// ── DOM refs ──────────────────────────────────────────────────────────────────
const hbcAnnualSalaryInput     = $("hbcAnnualSalaryInput");
const hbcAnnualSalarySlider    = $("hbcAnnualSalarySlider");
const hbcAnnualSalarySliderVal = $("hbcAnnualSalarySliderVal");

const hbcSalaryPercentInput     = $("hbcSalaryPercentInput");
const hbcSalaryPercentSlider    = $("hbcSalaryPercentSlider");
const hbcSalaryPercentSliderVal = $("hbcSalaryPercentSliderVal");

const hbcMonthlyMultipleInput     = $("hbcMonthlyMultipleInput");
const hbcMonthlyMultipleSlider    = $("hbcMonthlyMultipleSlider");
const hbcMonthlyMultipleSliderVal = $("hbcMonthlyMultipleSliderVal");

const hbcFixedAmountInput = $("hbcFixedAmountInput");
const hbcManualTaxInput   = $("hbcManualTaxInput");

const hbcSalaryPercentBlock   = $("hbcSalaryPercentBlock");
const hbcMonthlyMultipleBlock = $("hbcMonthlyMultipleBlock");
const hbcFixedAmountBlock     = $("hbcFixedAmountBlock");
const hbcManualTaxBlock       = $("hbcManualTaxBlock");

let currentCompanyCode = HANWHA_COMPANIES[0].code;

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
  return document.querySelector('input[name="hbcMode"]:checked')?.value || "salaryPercent";
}

function getTaxMode() {
  return document.querySelector('input[name="hbcTaxMode"]:checked')?.value || "simple";
}

function getTaxRate() {
  if (getTaxMode() === "manual") {
    return Math.max(0, Math.min(50, toNumber(hbcManualTaxInput))) / 100;
  }
  return HANWHA_SIMPLE_TAX_RATE;
}

function getCompany() {
  return companyMap[currentCompanyCode] || HANWHA_COMPANIES[0];
}

// ── 계산 ──────────────────────────────────────────────────────────────────────
function computeGross(annualSalary, mode) {
  const monthlySalary = annualSalary / 12;
  switch (mode) {
    case "monthlyMultiple":
      return monthlySalary * Math.max(0, toNumber(hbcMonthlyMultipleInput));
    case "fixedAmount":
      return Math.max(0, toNumber(hbcFixedAmountInput));
    case "salaryPercent":
    default:
      return annualSalary * Math.max(0, toNumber(hbcSalaryPercentInput)) / 100;
  }
}

function calculate() {
  const annualSalary  = Math.max(0, toNumber(hbcAnnualSalaryInput));
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
  const val = Math.min(150000000, Math.max(30000000, Math.round(toNumber(hbcAnnualSalaryInput))));
  if (hbcAnnualSalarySlider) hbcAnnualSalarySlider.value = val;
  if (hbcAnnualSalarySliderVal) hbcAnnualSalarySliderVal.textContent = formatKoreanAmount(val);
}

function syncSalaryPercentSlider() {
  const val = Math.min(60, Math.max(0, Math.round(toNumber(hbcSalaryPercentInput))));
  if (hbcSalaryPercentSlider) hbcSalaryPercentSlider.value = val;
  if (hbcSalaryPercentSliderVal) hbcSalaryPercentSliderVal.textContent = `${val}%`;
}

function syncMonthlyMultipleSlider() {
  const val = Math.min(10, Math.max(0, toNumber(hbcMonthlyMultipleInput)));
  if (hbcMonthlyMultipleSlider) hbcMonthlyMultipleSlider.value = val;
  if (hbcMonthlyMultipleSliderVal) hbcMonthlyMultipleSliderVal.textContent = `${val}배`;
}

// ── 컨트롤 정규화 ─────────────────────────────────────────────────────────────
function normalizeControls() {
  const mode = getMode();
  if (hbcSalaryPercentBlock) hbcSalaryPercentBlock.hidden = mode !== "salaryPercent";
  if (hbcMonthlyMultipleBlock) hbcMonthlyMultipleBlock.hidden = mode !== "monthlyMultiple";
  if (hbcFixedAmountBlock) hbcFixedAmountBlock.hidden = mode !== "fixedAmount";

  const isManualTax = getTaxMode() === "manual";
  if (hbcManualTaxBlock) hbcManualTaxBlock.hidden = !isManualTax;

  document.querySelectorAll(".hbc-tab").forEach((tab) => {
    const isActive = tab.dataset.company === currentCompanyCode;
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  document.querySelectorAll(".hbc-company-fact-block").forEach((block) => {
    block.hidden = block.dataset.company !== currentCompanyCode;
  });
}

// ── 회사 설명 영역 갱신 ──────────────────────────────────────────────────────
function renderCompanyInfo() {
  const company = getCompany();
  setText("hbcCompanyDesc", company.description);
  setText("hbcStructureTitle", `${company.label} 성과급이란?`);
  setText("hbcCompanyFullDesc", company.description);
  setText("hbcCaution", company.caution);
  setText("hbcIndustryNote", company.industryNote);
}

// ── KPI 카드 렌더링 ───────────────────────────────────────────────────────────
const MODE_LABELS = {
  salaryPercent: "연봉 × 지급률",
  monthlyMultiple: "월급 × 배수",
  fixedAmount: "직접 입력 금액",
};

function renderKpiCards(result) {
  const company = getCompany();
  setText("hbcResultHeadline", `${company.label} 성과급 계산 결과`);
  setText("hbcResultSubcopy", `${MODE_LABELS[result.mode] || ""} · 세금 ${getTaxMode() === "manual" ? "직접 입력" : "간이 세율 22%"} 기준`);

  setText("hbcTotalGross", formatKoreanAmount(result.totalGross));
  setText("hbcTotalGrossNote", "시뮬레이션");
  setText("hbcTotalNet", formatKoreanAmount(result.totalNet));
  setText("hbcTotalNetNote", `세율 ${(result.taxRate * 100).toFixed(1)}% 적용 참고값`);
  setText("hbcMonthlyRatio", `${result.monthlyRatio.toFixed(1)}개월`);
  setText("hbcMonthlyRatioNote", `월급 ${formatKoreanAmount(result.monthlySalary)} 기준`);
  setText("hbcAnnualRatio", `${result.annualRatio.toFixed(1)}%`);
  setText("hbcAnnualRatioNote", `연봉 ${formatKoreanAmount(result.annualSalary)} 기준 참고값`);
}

// ── 다음 단계 링크 업데이트 ──────────────────────────────────────────────────
function updateNextStepLinks(result) {
  const company = getCompany();
  const bonus = Math.max(0, Math.round(result.totalGross));
  const salary = Math.max(0, Math.round(result.annualSalary));
  const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonus / 12) / 50000) * 50000));

  const afterTaxCta = $("hbcAfterTaxCta");
  const dcaCta      = $("hbcDcaCta");

  if (afterTaxCta) {
    afterTaxCta.href = `/tools/bonus-after-tax-calculator/?bonus=${bonus}&salary=${salary}&company=${company.code}`;
  }
  if (dcaCta) {
    dcaCta.href = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
  }
  setText("hbcNextStepNote", `성과급 세전 ${formatKoreanAmount(bonus)} 기준 · 투자 계산기는 월 ${formatKoreanAmount(monthlyInvest)} 적립으로 연결합니다.`);
}

// ── 시나리오 표 ───────────────────────────────────────────────────────────────
function renderScenarioTable(result) {
  const tbody = $("hbcScenarioTableBody");
  if (!tbody) return;

  const { annualSalary, monthlySalary, taxRate } = result;

  tbody.innerHTML = HANWHA_SCENARIO_RATES.map((scenario) => {
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
  const canvas = $("hanwha-scenario-chart");
  if (!canvas || !window.Chart) return;

  const { annualSalary, taxRate } = result;
  const labels = HANWHA_SCENARIO_RATES.map((s) => s.label);
  const grossData = HANWHA_SCENARIO_RATES.map((s) => annualSalary * s.rate / 100);
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
  renderCompanyInfo();
  syncAnnualSalarySlider();
  syncSalaryPercentSlider();
  syncMonthlyMultipleSlider();

  const result = calculate();
  renderKpiCards(result);
  updateNextStepLinks(result);
  renderScenarioTable(result);
  renderScenarioChart(result);
}

// ── 탭 전환 (회사별 기본값으로 초기화) ──────────────────────────────────────
function applyCompanyDefaults(code) {
  const company = companyMap[code] || HANWHA_COMPANIES[0];
  currentCompanyCode = company.code;

  if (hbcAnnualSalaryInput) hbcAnnualSalaryInput.value = String(company.defaultAnnualSalary);
  if (hbcSalaryPercentInput) hbcSalaryPercentInput.value = String(company.defaultSalaryPercent);
  if (hbcMonthlyMultipleInput) hbcMonthlyMultipleInput.value = String(company.defaultMonthlyMultiple);
  if (hbcFixedAmountInput) hbcFixedAmountInput.value = String(company.defaultFixedAmount);
  if (hbcManualTaxInput) hbcManualTaxInput.value = String(HANWHA_SIMPLE_TAX_RATE * 100);

  const modeEl = document.querySelector(`input[name="hbcMode"][value="${company.defaultMode}"]`);
  if (modeEl) modeEl.checked = true;

  const taxModeEl = document.querySelector('input[name="hbcTaxMode"][value="simple"]');
  if (taxModeEl) taxModeEl.checked = true;

  render();
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetPage() {
  applyCompanyDefaults(HANWHA_COMPANIES[0].code);
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1500);
}

// ── 이벤트 리스너 ─────────────────────────────────────────────────────────────
document.querySelectorAll(".hbc-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    applyCompanyDefaults(tab.dataset.company);
  });
});

hbcAnnualSalaryInput?.addEventListener("input", () => { syncAnnualSalarySlider(); render(); });
hbcAnnualSalarySlider?.addEventListener("input", () => {
  if (hbcAnnualSalaryInput) hbcAnnualSalaryInput.value = hbcAnnualSalarySlider.value;
  syncAnnualSalarySlider();
  render();
});

hbcSalaryPercentInput?.addEventListener("input", () => { syncSalaryPercentSlider(); render(); });
hbcSalaryPercentSlider?.addEventListener("input", () => {
  if (hbcSalaryPercentInput) hbcSalaryPercentInput.value = hbcSalaryPercentSlider.value;
  syncSalaryPercentSlider();
  render();
});

hbcMonthlyMultipleInput?.addEventListener("input", () => { syncMonthlyMultipleSlider(); render(); });
hbcMonthlyMultipleSlider?.addEventListener("input", () => {
  if (hbcMonthlyMultipleInput) hbcMonthlyMultipleInput.value = hbcMonthlyMultipleSlider.value;
  syncMonthlyMultipleSlider();
  render();
});

hbcFixedAmountInput?.addEventListener("input", render);
hbcManualTaxInput?.addEventListener("input", render);

document.querySelectorAll('input[name="hbcMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll('input[name="hbcTaxMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll(".hbc-preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const monthlyMultipleModeEl = document.querySelector('input[name="hbcMode"][value="monthlyMultiple"]');
    if (monthlyMultipleModeEl) monthlyMultipleModeEl.checked = true;
    if (hbcMonthlyMultipleInput) hbcMonthlyMultipleInput.value = btn.dataset.value;
    syncMonthlyMultipleSlider();
    render();
  });
});

$("calcHanwhaBonusBtn")?.addEventListener("click", render);

$("resetHanwhaBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetHanwhaBonusBtn"), "초기화됨");
});

$("copyHanwhaBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyHanwhaBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyHanwhaBonusLinkBtn"), "복사 실패");
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
resetPage();
