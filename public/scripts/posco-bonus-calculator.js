/**
 * posco-bonus-calculator.js — 포스코 성과급 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("poscoBonusConfig");
if (!configNode) throw new Error("poscoBonusConfig is missing");

const { poscoCompanies, poscoRankPresets, poscoScenarioOptions, poscoComparisonItems } =
  JSON.parse(configNode.textContent || "{}");

const companyMap = Object.fromEntries(poscoCompanies.map((c) => [c.code, c]));
const rankMap    = Object.fromEntries(poscoRankPresets.map((r) => [r.code, r]));

// ── DOM refs ──────────────────────────────────────────────────────────────────
const poscoCompanySelect       = $("poscoCompanySelect");
const poscoRankSelect           = $("poscoRankSelect");
const poscoMonthlyBaseInput     = $("poscoMonthlyBaseInput");
const poscoMonthlyBaseSlider    = $("poscoMonthlyBaseSlider");
const poscoMonthlyBaseSliderVal = $("poscoMonthlyBaseSliderVal");
const poscoCustomRateInput      = $("poscoCustomRateInput");
const poscoCustomRateSlider     = $("poscoCustomRateSlider");
const poscoCustomRateSliderVal  = $("poscoCustomRateSliderVal");
const poscoScenarioBlock        = $("poscoScenarioBlock");
const poscoCustomRateBlock      = $("poscoCustomRateBlock");

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

// ── 세후 추정 세율 ─────────────────────────────────────────────────────────────
function estimateTaxRate(bonusAmount) {
  if (bonusAmount < 10000000)  return 0.165;
  if (bonusAmount < 30000000)  return 0.264;
  if (bonusAmount < 50000000)  return 0.374;
  return 0.418;
}

// ── 상태 읽기 ─────────────────────────────────────────────────────────────────
function getRateMode() {
  return document.querySelector('input[name="poscoRateMode"]:checked')?.value || "ESTIMATE";
}

function getScenario() {
  return document.querySelector('input[name="poscoScenario"]:checked')?.value || "BASE";
}

function getRate() {
  const code    = poscoCompanySelect?.value || "POSCO";
  const company = companyMap[code] || poscoCompanies[0];
  if (getRateMode() === "CUSTOM") {
    return Math.max(0, Math.min(800, Number(poscoCustomRateInput?.value || 20)));
  }
  const scenario = getScenario();
  return company.baseScenario[scenario] ?? company.baseScenario.BASE;
}

// ── 계산 ──────────────────────────────────────────────────────────────────────
function calculate() {
  const monthlyBase = Math.max(0, toNumber(poscoMonthlyBaseInput));
  const rate = getRate();

  const totalGross = monthlyBase * rate / 100;
  const taxRate = estimateTaxRate(totalGross);
  const totalNet = Math.max(0, totalGross * (1 - taxRate));
  const monthlyRatio = monthlyBase > 0 ? totalGross / monthlyBase : 0;

  const rankPreset = rankMap[poscoRankSelect?.value] || poscoRankPresets[1];
  const annualSalary = rankPreset.defaultAnnualSalary;
  const annualRatio = annualSalary > 0 ? totalGross / annualSalary * 100 : 0;

  return {
    monthlyBase,
    rate,
    totalGross,
    totalNet,
    taxRate,
    monthlyRatio,
    annualSalary,
    annualRatio,
  };
}

// ── 슬라이더 동기화 ───────────────────────────────────────────────────────────
function syncMonthlyBaseSlider() {
  const val = Math.min(12000000, Math.max(2000000, Math.round(toNumber(poscoMonthlyBaseInput))));
  if (poscoMonthlyBaseSlider) poscoMonthlyBaseSlider.value = val;
  if (poscoMonthlyBaseSliderVal) poscoMonthlyBaseSliderVal.textContent = formatKoreanAmount(val);
}

function syncCustomRateSlider() {
  const val = Math.min(800, Math.max(0, Math.round(toNumber(poscoCustomRateInput))));
  if (poscoCustomRateSlider) poscoCustomRateSlider.value = val;
  if (poscoCustomRateSliderVal) poscoCustomRateSliderVal.textContent = `${val}%`;
}

// ── 컨트롤 정규화 ─────────────────────────────────────────────────────────────
function normalizeControls() {
  const isCustom = getRateMode() === "CUSTOM";
  if (poscoScenarioBlock) poscoScenarioBlock.hidden = isCustom;
  if (poscoCustomRateBlock) poscoCustomRateBlock.hidden = !isCustom;

  const code = poscoCompanySelect?.value || "POSCO";
  const scenario = getScenario();

  const scenarioLabels = { CONSERVATIVE: "보수적 (저성과 가정)", BASE: "기준 (보도 기반 추정)", AGGRESSIVE: "낙관적 (고성과 가정)" };
  setText("poscoScenarioHint", scenarioLabels[scenario] || "");

  document.querySelectorAll(".pbc-company-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.code === code);
  });

  document.querySelectorAll(".pbc-company-fact-block").forEach((block) => {
    block.hidden = block.dataset.code !== code;
  });
}

// ── KPI 카드 렌더링 ───────────────────────────────────────────────────────────
function renderKpiCards(result) {
  const code = poscoCompanySelect?.value || "POSCO";
  const company = companyMap[code] || poscoCompanies[0];
  const scenario = getScenario();
  const scenarioLabel = poscoScenarioOptions?.find((s) => s.code === scenario)?.label || scenario;
  const rankPreset = rankMap[poscoRankSelect?.value] || poscoRankPresets[1];

  setText("poscoResultHeadline", `${rankPreset.label} 기준 ${company.label} 성과급`);
  setText("poscoResultSubcopy", `${company.label} · ${getRateMode() === "CUSTOM" ? "직접입력" : scenarioLabel} 시나리오 · 지급률 ${result.rate}%`);

  setText("poscoTotalGross", formatKoreanAmount(result.totalGross));
  setText("poscoTotalGrossNote", `연간 합계 (월 기본급 × ${result.rate}%) 시뮬레이션`);
  setText("poscoTotalNet", formatKoreanAmount(result.totalNet));
  setText("poscoTotalNetNote", `세율 약 ${(result.taxRate * 100).toFixed(1)}% 추정 기준 참고값`);
  setText("poscoMonthlyRatio", `${result.monthlyRatio.toFixed(1)}개월`);
  setText("poscoMonthlyRatioNote", `월 기본급 ${formatKoreanAmount(result.monthlyBase)} 기준`);
  setText("poscoAnnualRatio", `${result.annualRatio.toFixed(1)}%`);
  setText("poscoAnnualRatioNote", `연봉 ${formatKoreanAmount(result.annualSalary)} 기준 참고값`);
}

// ── 다음 단계 링크 업데이트 ──────────────────────────────────────────────────
function updateNextStepLinks(result) {
  const bonus = Math.max(0, Math.round(result.totalGross));
  const salary = Math.max(0, Math.round(result.annualSalary));
  const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonus / 12) / 50000) * 50000));

  const afterTaxCta = $("poscoAfterTaxCta");
  const dcaCta      = $("poscoDcaCta");

  if (afterTaxCta) {
    afterTaxCta.href = `/tools/bonus-after-tax-calculator/?bonus=${bonus}&salary=${salary}&company=posco`;
  }
  if (dcaCta) {
    dcaCta.href = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
  }
  setText("poscoNextStepNote", `성과급 세전 ${formatKoreanAmount(bonus)} 기준 · 투자 계산기는 월 ${formatKoreanAmount(monthlyInvest)} 적립으로 연결합니다.`);
}

// ── 직급별 예상표 ─────────────────────────────────────────────────────────────
function renderRankTable() {
  const rate = getRate();
  const tbody = $("poscoRankTableBody");
  if (!tbody) return;

  tbody.innerHTML = poscoRankPresets.map((rank) => {
    const gross = rank.defaultMonthlyBase * rate / 100;
    const net   = gross * (1 - estimateTaxRate(gross));
    const months = rank.defaultMonthlyBase > 0 ? (gross / rank.defaultMonthlyBase).toFixed(1) : "0.0";
    return `
      <tr>
        <td class="cell-label">
          <strong>${rank.label}</strong>
          <span>연봉 ${formatKoreanAmount(rank.defaultAnnualSalary)}</span>
        </td>
        <td>${formatKoreanAmount(rank.defaultMonthlyBase)}</td>
        <td class="cell-highlight">${formatKoreanAmount(gross)}</td>
        <td>${formatKoreanAmount(net)}</td>
        <td>${months}개월</td>
      </tr>
    `;
  }).join("");
}

// ── 계열사별 PI+PS 범위 바 차트 ──────────────────────────────────────────────
let _companyChart = null;
function renderCompanyChart() {
  const canvas = $("posco-company-chart");
  if (!canvas || !window.Chart) return;

  const labels   = poscoCompanies.map((c) => c.label);
  const consData = poscoCompanies.map((c) => c.baseScenario.CONSERVATIVE);
  const baseData = poscoCompanies.map((c) => c.baseScenario.BASE);
  const aggrData = poscoCompanies.map((c) => c.baseScenario.AGGRESSIVE);

  if (_companyChart) { _companyChart.destroy(); _companyChart = null; }

  _companyChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "보수적", data: consData, backgroundColor: "#93C5FD", borderRadius: 3 },
        { label: "기준",   data: baseData, backgroundColor: "#1A56DB", borderRadius: 3 },
        { label: "낙관적", data: aggrData, backgroundColor: "#1E429F", borderRadius: 3 },
      ],
    },
    options: {
      ...buildDefaultOptions(),
      plugins: {
        legend: { position: "top", labels: { boxWidth: 12, padding: 10, font: { size: 11 }, color: "#888780" } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#888780" } },
        y: {
          ticks: { callback: (v) => `${v}%`, color: "#888780" },
          grid: { color: "#F0EFED" },
          title: { display: true, text: "PI+PS 합계 (%)", color: "#888780", font: { size: 10 } },
        },
      },
    },
  });
}

// ── 타사 비교 가로 바 차트 ────────────────────────────────────────────────────
let _compareChart = null;
function renderCompareChart(result) {
  const canvas = $("posco-compare-chart");
  if (!canvas || !window.Chart) return;

  const { monthlyBase, totalGross } = result;
  const code = poscoCompanySelect?.value || "POSCO";
  const company = companyMap[code] || poscoCompanies[0];

  const compValues = poscoComparisonItems.map((item) => monthlyBase * item.monthlyMultiplier);
  const allLabels  = [company.label, ...poscoComparisonItems.map((i) => i.label)];
  const allValues  = [totalGross, ...compValues];
  const allColors  = ["#1A56DB", ...poscoComparisonItems.map((i) => i.color)];

  if (_compareChart) { _compareChart.destroy(); _compareChart = null; }

  _compareChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: allLabels,
      datasets: [{
        label: "연간 성과급 추정 (세전)",
        data: allValues,
        backgroundColor: allColors,
        borderRadius: 4,
      }],
    },
    options: {
      ...buildDefaultOptions(),
      indexAxis: "y",
      layout: { padding: { right: 90 } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => formatKoreanAmount(ctx.parsed.x) } },
      },
      scales: {
        x: { display: false },
        y: { grid: { display: false }, ticks: { color: "#888780" } },
      },
    },
    plugins: [makeLabelPlugin(formatKoreanAmount)],
  });
}

// ── 메인 렌더 ─────────────────────────────────────────────────────────────────
function render() {
  normalizeControls();
  syncMonthlyBaseSlider();
  if (getRateMode() === "CUSTOM") {
    syncCustomRateSlider();
  }
  const result = calculate();
  renderKpiCards(result);
  updateNextStepLinks(result);
  renderRankTable();
  renderCompanyChart();
  renderCompareChart(result);
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetPage() {
  if (poscoCompanySelect) poscoCompanySelect.value = "POSCO";
  if (poscoRankSelect)    poscoRankSelect.value     = "ASSISTANT_MANAGER";

  const defaultRank = rankMap["ASSISTANT_MANAGER"] || poscoRankPresets[1];
  if (poscoMonthlyBaseInput) poscoMonthlyBaseInput.value = String(defaultRank.defaultMonthlyBase);

  const rateModeEl = document.querySelector('input[name="poscoRateMode"][value="ESTIMATE"]');
  if (rateModeEl) rateModeEl.checked = true;

  const baseScenarioEl = document.querySelector('input[name="poscoScenario"][value="BASE"]');
  if (baseScenarioEl) baseScenarioEl.checked = true;

  if (poscoCustomRateInput) poscoCustomRateInput.value = "20";

  render();
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1500);
}

// ── 이벤트 리스너 ─────────────────────────────────────────────────────────────
poscoCompanySelect?.addEventListener("change", () => {
  render();
});

poscoRankSelect?.addEventListener("change", () => {
  const rank = rankMap[poscoRankSelect.value] || poscoRankPresets[1];
  if (poscoMonthlyBaseInput) poscoMonthlyBaseInput.value = String(rank.defaultMonthlyBase);
  setText("poscoMonthlyBaseHint", `추천 월 기본급: ${formatKoreanAmount(rank.defaultMonthlyBase)}`);
  render();
});

poscoMonthlyBaseInput?.addEventListener("input", () => {
  syncMonthlyBaseSlider();
  render();
});

poscoMonthlyBaseSlider?.addEventListener("input", () => {
  if (poscoMonthlyBaseInput) poscoMonthlyBaseInput.value = poscoMonthlyBaseSlider.value;
  syncMonthlyBaseSlider();
  render();
});

poscoCustomRateInput?.addEventListener("input", () => { syncCustomRateSlider(); render(); });
poscoCustomRateSlider?.addEventListener("input", () => {
  if (poscoCustomRateInput) poscoCustomRateInput.value = poscoCustomRateSlider.value;
  syncCustomRateSlider();
  render();
});

document.querySelectorAll('input[name="poscoRateMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll('input[name="poscoScenario"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll(".pbc-preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const rateModeCustom = document.querySelector('input[name="poscoRateMode"][value="CUSTOM"]');
    if (rateModeCustom) rateModeCustom.checked = true;
    if (poscoCustomRateInput) poscoCustomRateInput.value = btn.dataset.rate;
    syncCustomRateSlider();
    render();
  });
});

$("calcPoscoBonusBtn")?.addEventListener("click", render);

$("resetPoscoBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetPoscoBonusBtn"), "초기화됨");
});

$("copyPoscoBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyPoscoBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyPoscoBonusLinkBtn"), "복사 실패");
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
resetPage();
