/**
 * lg-bonus.js — LG전자 성과급 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

const configNode = $("lgCompensationConfig");
if (!configNode) throw new Error("lgCompensationConfig is missing");

const { lgDivisions, lgRankPresets, lgScenarioOptions, lgComparisonItems } =
  JSON.parse(configNode.textContent || "{}");

const divisionMap = Object.fromEntries(lgDivisions.map((d) => [d.code, d]));
const rankMap     = Object.fromEntries(lgRankPresets.map((r) => [r.code, r]));

// ── DOM refs ──────────────────────────────────────────────────────────────────
const lgDivisionSelect     = $("lgDivisionSelect");
const lgRankSelect         = $("lgRankSelect");
const lgMonthlyBaseInput   = $("lgMonthlyBaseInput");
const lgMonthlyBaseSlider  = $("lgMonthlyBaseSlider");
const lgMonthlyBaseSliderVal = $("lgMonthlyBaseSliderVal");
const lgPiH1Input   = $("lgPiH1Input");
const lgPiH1Slider  = $("lgPiH1Slider");
const lgPiH1SliderVal = $("lgPiH1SliderVal");
const lgPiH2Input   = $("lgPiH2Input");
const lgPiH2Slider  = $("lgPiH2Slider");
const lgPiH2SliderVal = $("lgPiH2SliderVal");
const lgUnionBonusInput = $("lgUnionBonusInput");
const lgScenarioBlock   = $("lgScenarioBlock");
const lgCustomPiBlock   = $("lgCustomPiBlock");

// ── 유틸 ──────────────────────────────────────────────────────────────────────
function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
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
function getPiMode() {
  return document.querySelector('input[name="piMode"]:checked')?.value || "ESTIMATE";
}

function getScenario() {
  return document.querySelector('input[name="lgScenario"]:checked')?.value || "BASE";
}

function getPiRates() {
  const divCode  = lgDivisionSelect?.value || "HA";
  const division = divisionMap[divCode] || lgDivisions[0];
  if (getPiMode() === "CUSTOM") {
    return {
      h1: Math.max(0, Math.min(200, Number(lgPiH1Input?.value || 100))),
      h2: Math.max(0, Math.min(200, Number(lgPiH2Input?.value || 100))),
    };
  }
  const scenario = getScenario();
  return division.baseScenario[scenario] || division.baseScenario.BASE;
}

// ── 계산 ──────────────────────────────────────────────────────────────────────
function calculate() {
  const monthlyBase = Math.max(0, toNumber(lgMonthlyBaseInput));
  const { h1, h2 }  = getPiRates();
  const unionBonus  = Math.max(0, toNumber(lgUnionBonusInput)) * 10000;

  const piH1Amount = monthlyBase * h1 / 100;
  const piH2Amount = monthlyBase * h2 / 100;
  const totalPiGross = piH1Amount + piH2Amount + unionBonus;
  const taxRate = estimateTaxRate(totalPiGross);
  const totalPiNet  = Math.max(0, totalPiGross * (1 - taxRate));
  const monthlyRatio = monthlyBase > 0 ? totalPiGross / monthlyBase : 0;

  const rankPreset = rankMap[lgRankSelect?.value] || lgRankPresets[1];
  const annualSalary = rankPreset.defaultAnnualSalary;
  const annualRatio  = annualSalary > 0 ? totalPiGross / annualSalary * 100 : 0;

  return {
    monthlyBase,
    h1,
    h2,
    piH1Amount,
    piH2Amount,
    unionBonus,
    totalPiGross,
    totalPiNet,
    taxRate,
    monthlyRatio,
    annualSalary,
    annualRatio,
  };
}

// ── 슬라이더 동기화 ───────────────────────────────────────────────────────────
function syncMonthlyBaseSlider() {
  const val = Math.min(12000000, Math.max(2000000, Math.round(toNumber(lgMonthlyBaseInput))));
  if (lgMonthlyBaseSlider) lgMonthlyBaseSlider.value = val;
  if (lgMonthlyBaseSliderVal) lgMonthlyBaseSliderVal.textContent = formatKoreanAmount(val);
}

function syncPiH1Slider() {
  const val = Math.min(200, Math.max(0, Math.round(toNumber(lgPiH1Input))));
  if (lgPiH1Slider) lgPiH1Slider.value = val;
  if (lgPiH1SliderVal) lgPiH1SliderVal.textContent = `${val}%`;
}

function syncPiH2Slider() {
  const val = Math.min(200, Math.max(0, Math.round(toNumber(lgPiH2Input))));
  if (lgPiH2Slider) lgPiH2Slider.value = val;
  if (lgPiH2SliderVal) lgPiH2SliderVal.textContent = `${val}%`;
}

// ── 컨트롤 정규화 ─────────────────────────────────────────────────────────────
function normalizeControls() {
  const isCustom = getPiMode() === "CUSTOM";
  if (lgScenarioBlock) lgScenarioBlock.hidden = isCustom;
  if (lgCustomPiBlock) lgCustomPiBlock.hidden = !isCustom;

  const divCode  = lgDivisionSelect?.value || "HA";
  const division = divisionMap[divCode] || lgDivisions[0];
  const scenario = getScenario();

  const scenarioLabels = { CONSERVATIVE: "보수적 (저성과 가정)", BASE: "기준 (보도 기반 추정)", AGGRESSIVE: "낙관적 (고성과 가정)" };
  setText("lgScenarioHint", scenarioLabels[scenario] || "");

  // 사업부 카드 활성화
  document.querySelectorAll(".lgb-division-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.code === divCode);
  });
}

// ── KPI 카드 렌더링 ───────────────────────────────────────────────────────────
function renderKpiCards(result) {
  const divCode  = lgDivisionSelect?.value || "HA";
  const division = divisionMap[divCode] || lgDivisions[0];
  const scenario = getScenario();
  const scenarioLabel = lgScenarioOptions?.find((s) => s.code === scenario)?.label || scenario;
  const rankPreset = rankMap[lgRankSelect?.value] || lgRankPresets[1];

  setText("lgResultHeadline", `${rankPreset.label} 기준 LG전자 ${division.label} 성과급`);
  setText("lgResultSubcopy", `${division.label} 사업부 · ${getPiMode() === "CUSTOM" ? "직접입력" : scenarioLabel} 시나리오`);

  setText("lgTotalPiGross", formatKoreanAmount(result.totalPiGross));
  setText("lgTotalPiGrossNote", `상반기 ${formatKoreanAmount(result.piH1Amount)} + 하반기 ${formatKoreanAmount(result.piH2Amount)}`);
  setText("lgTotalPiNet", formatKoreanAmount(result.totalPiNet));
  setText("lgTotalPiNetNote", `세율 약 ${(result.taxRate * 100).toFixed(1)}% 추정 기준 참고값`);
  setText("lgMonthlyRatio", `${result.monthlyRatio.toFixed(1)}개월`);
  setText("lgMonthlyRatioNote", `월 기본급 ${formatKoreanAmount(result.monthlyBase)} 기준`);
  setText("lgAnnualRatio", `${result.annualRatio.toFixed(1)}%`);
  setText("lgAnnualRatioNote", `연봉 ${formatKoreanAmount(result.annualSalary)} 기준 참고값`);
}

// ── 다음 단계 링크 업데이트 ──────────────────────────────────────────────────
function updateNextStepLinks(result) {
  const bonus = Math.max(0, Math.round(result.totalPiGross));
  const salary = Math.max(0, Math.round(result.annualSalary));
  const monthlyInvest = Math.min(3000000, Math.max(100000, Math.round((bonus / 12) / 50000) * 50000));

  const afterTaxCta = $("lgAfterTaxCta");
  const dcaCta      = $("lgDcaCta");

  if (afterTaxCta) {
    afterTaxCta.href = `/tools/bonus-after-tax-calculator/?bonus=${bonus}&salary=${salary}&company=lg`;
  }
  if (dcaCta) {
    dcaCta.href = `/tools/dca-investment-calculator/?m=${monthlyInvest}&p=10&a=SP500,NASDAQ100,QQQ&fx=1&div=1`;
  }
  setText("lgNextStepNote", `성과급 세전 ${formatKoreanAmount(bonus)} 기준 · 투자 계산기는 월 ${formatKoreanAmount(monthlyInvest)} 적립으로 연결합니다.`);
}

// ── 직급별 예상표 ─────────────────────────────────────────────────────────────
function renderRankTable() {
  const { h1, h2 } = getPiRates();
  const tbody = $("lgRankTableBody");
  if (!tbody) return;

  tbody.innerHTML = lgRankPresets.map((rank) => {
    const piGross = rank.defaultMonthlyBase * (h1 + h2) / 100;
    const piNet   = piGross * (1 - estimateTaxRate(piGross));
    const months  = rank.defaultMonthlyBase > 0 ? (piGross / rank.defaultMonthlyBase).toFixed(1) : "0.0";
    return `
      <tr>
        <td class="cell-label">
          <strong>${rank.label}</strong>
          <span>연봉 ${formatKoreanAmount(rank.defaultAnnualSalary)}</span>
        </td>
        <td>${formatKoreanAmount(rank.defaultMonthlyBase)}</td>
        <td class="cell-highlight">${formatKoreanAmount(piGross)}</td>
        <td>${formatKoreanAmount(piNet)}</td>
        <td>${months}개월</td>
      </tr>
    `;
  }).join("");
}

// ── 사업부별 PI 범위 바 차트 ──────────────────────────────────────────────────
let _divisionChart = null;
function renderDivisionChart() {
  const canvas = $("lg-division-chart");
  if (!canvas || !window.Chart) return;

  const labels   = lgDivisions.map((d) => d.label);
  const consData = lgDivisions.map((d) => d.baseScenario.CONSERVATIVE.h1 + d.baseScenario.CONSERVATIVE.h2);
  const baseData = lgDivisions.map((d) => d.baseScenario.BASE.h1 + d.baseScenario.BASE.h2);
  const aggrData = lgDivisions.map((d) => d.baseScenario.AGGRESSIVE.h1 + d.baseScenario.AGGRESSIVE.h2);

  if (_divisionChart) { _divisionChart.destroy(); _divisionChart = null; }

  _divisionChart = new window.Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "보수적 (상+하)", data: consData, backgroundColor: "#93C5FD", borderRadius: 3 },
        { label: "기준 (상+하)",   data: baseData, backgroundColor: "#1A56DB", borderRadius: 3 },
        { label: "낙관적 (상+하)", data: aggrData, backgroundColor: "#1E429F", borderRadius: 3 },
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
          title: { display: true, text: "PI 합계 (%)", color: "#888780", font: { size: 10 } },
        },
      },
    },
  });
}

// ── 타사 비교 가로 바 차트 ────────────────────────────────────────────────────
let _compareChart = null;
function renderCompareChart(result) {
  const canvas = $("lg-compare-chart");
  if (!canvas || !window.Chart) return;

  const { h1, h2, monthlyBase } = result;
  const lgTotal = monthlyBase * (h1 + h2) / 100;
  const divCode  = lgDivisionSelect?.value || "HA";
  const division = divisionMap[divCode] || lgDivisions[0];

  const compValues = lgComparisonItems.map((item) => monthlyBase * item.monthlyMultiplier);
  const allLabels  = [`LG ${division.label}`, ...lgComparisonItems.map((i) => i.label)];
  const allValues  = [lgTotal, ...compValues];
  const allColors  = ["#1A56DB", ...lgComparisonItems.map((i) => i.color)];

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
  if (getPiMode() === "CUSTOM") {
    syncPiH1Slider();
    syncPiH2Slider();
  }
  const result = calculate();
  renderKpiCards(result);
  updateNextStepLinks(result);
  renderRankTable();
  renderDivisionChart();
  renderCompareChart(result);
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetPage() {
  if (lgDivisionSelect)     lgDivisionSelect.value = "HA";
  if (lgRankSelect)         lgRankSelect.value      = "ASSISTANT_MANAGER";

  const defaultRank = rankMap["ASSISTANT_MANAGER"] || lgRankPresets[1];
  if (lgMonthlyBaseInput)  lgMonthlyBaseInput.value  = String(defaultRank.defaultMonthlyBase);

  const piModeEl = document.querySelector('input[name="piMode"][value="ESTIMATE"]');
  if (piModeEl) piModeEl.checked = true;

  const baseScenarioEl = document.querySelector('input[name="lgScenario"][value="BASE"]');
  if (baseScenarioEl) baseScenarioEl.checked = true;

  if (lgPiH1Input)  lgPiH1Input.value  = "100";
  if (lgPiH2Input)  lgPiH2Input.value  = "100";
  if (lgUnionBonusInput) lgUnionBonusInput.value = "0";

  render();
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1500);
}

// ── 이벤트 리스너 ─────────────────────────────────────────────────────────────
lgDivisionSelect?.addEventListener("change", () => {
  render();
});

lgRankSelect?.addEventListener("change", () => {
  const rank = rankMap[lgRankSelect.value] || lgRankPresets[1];
  if (lgMonthlyBaseInput) lgMonthlyBaseInput.value = String(rank.defaultMonthlyBase);
  setText("lgMonthlyBaseHint", `추천 월 기본급: ${formatKoreanAmount(rank.defaultMonthlyBase)}`);
  render();
});

lgMonthlyBaseInput?.addEventListener("input", () => {
  syncMonthlyBaseSlider();
  render();
});

lgMonthlyBaseSlider?.addEventListener("input", () => {
  if (lgMonthlyBaseInput) lgMonthlyBaseInput.value = lgMonthlyBaseSlider.value;
  syncMonthlyBaseSlider();
  render();
});

lgPiH1Input?.addEventListener("input", () => { syncPiH1Slider(); render(); });
lgPiH1Slider?.addEventListener("input", () => {
  if (lgPiH1Input) lgPiH1Input.value = lgPiH1Slider.value;
  syncPiH1Slider();
  render();
});

lgPiH2Input?.addEventListener("input", () => { syncPiH2Slider(); render(); });
lgPiH2Slider?.addEventListener("input", () => {
  if (lgPiH2Input) lgPiH2Input.value = lgPiH2Slider.value;
  syncPiH2Slider();
  render();
});

lgUnionBonusInput?.addEventListener("input", render);

document.querySelectorAll('input[name="piMode"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

document.querySelectorAll('input[name="lgScenario"]').forEach((radio) => {
  radio.addEventListener("change", render);
});

$("calcLgBonusBtn")?.addEventListener("click", render);

$("resetLgBonusBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetLgBonusBtn"), "초기화됨");
});

$("copyLgBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyLgBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyLgBonusLinkBtn"), "복사 실패");
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
resetPage();
