import { formatKRW, buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";
import { readParam, writeParams } from "./url-state.js";
import { estimateEarnedTakeHome } from "./income-estimate.js";

const $ = (id) => document.getElementById(id);

const configNode = $("csrConfig");
if (!configNode) {
  throw new Error("couple salary rank config is missing");
}

const {
  companies,
  livingCostScenarios,
  percentileTable,
  combos,
  catLabel,
  averageHouseholdIncome,
  coupleHouseholdMedianMonthly,
} = JSON.parse(configNode.textContent || "{}");

const companyMap = Object.fromEntries(companies.map((c) => [c.name, c]));
const livingCostMap = Object.fromEntries(livingCostScenarios.map((s) => [s.code, s]));

const myCompanySelect = $("myCompanySelect");
const mySalaryInput = $("mySalaryInput");
const mySalarySlider = $("mySalarySlider");
const mySalarySliderVal = $("mySalarySliderVal");

const spouseModeCompany = $("spouseModeCompany");
const spouseModeNone = $("spouseModeNone");
const spouseCompanySelect = $("spouseCompanySelect");
const spouseCompanyField = $("spouseCompanyField");
const spouseSalaryField = $("spouseSalaryField");
const spouseSalaryInput = $("spouseSalaryInput");
const spouseSalarySlider = $("spouseSalarySlider");
const spouseSalarySliderVal = $("spouseSalarySliderVal");

const livingCostTabs = $("livingCostTabs");

let livingCostScenario = "AVERAGE";

// ── 포맷 헬퍼 ─────────────────────────────────────────────────────────────────
function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const eok = Math.floor(abs / 100000000);
  const man = Math.floor((abs % 100000000) / 10000);
  let text;
  if (eok > 0 && man > 0) text = `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  else if (eok > 0) text = `${eok}억원`;
  else text = `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  return negative ? `-${text}` : text;
}

function formatManwon(salM) {
  return `${Number(salM).toLocaleString("ko-KR")}만원`;
}

function formatPercent(ratio) {
  return `${Math.round(Number(ratio || 0) * 100)}%`;
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function toNumber(input) {
  return Number(input && input.value ? input.value : 0);
}

// ── 가구소득 상위 % 추정 (선형 보간) ────────────────────────────────────────────
function estimateTopPercentile(annualM, table) {
  if (annualM >= table[0].annualM) return table[0].topPct;
  const last = table[table.length - 1];
  if (annualM <= last.annualM) return last.topPct;

  for (let i = 0; i < table.length - 1; i += 1) {
    const hi = table[i];
    const lo = table[i + 1];
    if (annualM <= hi.annualM && annualM >= lo.annualM) {
      const ratio = (annualM - lo.annualM) / (hi.annualM - lo.annualM);
      return Math.round(lo.topPct - ratio * (lo.topPct - hi.topPct));
    }
  }
  return 50;
}

// ── 슬라이더/배지 동기화 ─────────────────────────────────────────────────────
function syncMySalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(mySalaryInput.value) || 0), 0), 30000);
  if (mySalarySlider) mySalarySlider.value = Math.min(Math.max(val, Number(mySalarySlider.min)), Number(mySalarySlider.max));
  if (mySalarySliderVal) mySalarySliderVal.textContent = formatManwon(val);
}

function syncSpouseSalarySlider() {
  const val = Math.min(Math.max(Math.round(Number(spouseSalaryInput.value) || 0), 0), 30000);
  if (spouseSalarySlider) spouseSalarySlider.value = Math.min(Math.max(val, Number(spouseSalarySlider.min)), Number(spouseSalarySlider.max));
  if (spouseSalarySliderVal) spouseSalarySliderVal.textContent = formatManwon(val);
}

function isSpouseNone() {
  return spouseModeNone?.checked === true;
}

function updateSpouseFieldState() {
  const none = isSpouseNone();
  spouseCompanyField?.classList.toggle("is-disabled", none);
  spouseSalaryField?.classList.toggle("is-disabled", none);
  if (spouseCompanySelect) spouseCompanySelect.disabled = none;
  if (spouseSalaryInput) spouseSalaryInput.disabled = none;
  if (spouseSalarySlider) spouseSalarySlider.disabled = none;
}

// ── 계산 ──────────────────────────────────────────────────────────────────────
function aggregateResults() {
  const myCompanyName = myCompanySelect.value;
  const mySalaryM = toNumber(mySalaryInput);
  const spouseNone = isSpouseNone();
  const spouseCompanyName = spouseCompanySelect.value;
  const spouseSalaryM = spouseNone ? 0 : toNumber(spouseSalaryInput);

  const myAnnual = mySalaryM * 10000;
  const spouseAnnual = spouseSalaryM * 10000;
  const householdGrossAnnual = myAnnual + spouseAnnual;
  const householdGrossMonthly = householdGrossAnnual / 12;

  const myTakeHomeAnnual = estimateEarnedTakeHome(myAnnual);
  const spouseTakeHomeAnnual = spouseNone ? 0 : estimateEarnedTakeHome(spouseAnnual);
  const householdTakeHomeAnnual = myTakeHomeAnnual + spouseTakeHomeAnnual;
  const householdTakeHomeMonthly = householdTakeHomeAnnual / 12;

  const householdGrossAnnualM = mySalaryM + spouseSalaryM;
  const topPct = estimateTopPercentile(householdGrossAnnualM, percentileTable);

  const averageIncomeRatio = householdGrossAnnual / averageHouseholdIncome;
  const medianIncomeRatio = (householdGrossMonthly) / coupleHouseholdMedianMonthly;

  return {
    myCompanyName,
    mySalaryM,
    spouseNone,
    spouseCompanyName,
    spouseSalaryM,
    myAnnual,
    spouseAnnual,
    householdGrossAnnual,
    householdGrossMonthly,
    householdTakeHomeAnnual,
    householdTakeHomeMonthly,
    householdGrossAnnualM,
    topPct,
    averageIncomeRatio,
    medianIncomeRatio,
  };
}

// ── 렌더 ──────────────────────────────────────────────────────────────────────
function renderSummary(result) {
  setText("resultHeadline", `이 부부는 전국 상위 ${result.topPct}% 가구입니다`);
  setText("percentileSummary", `상위 ${result.topPct}%`);
  setText("percentileSummaryNote", `평균 가구소득 대비 ${formatPercent(result.averageIncomeRatio)}`);
  setText("householdAnnualSummary", formatKoreanAmount(result.householdGrossAnnual));
  setText("householdAnnualSummaryNote", result.spouseNone ? "외벌이 기준" : "맞벌이 합산 기준");
  setText("householdMonthlySummary", formatKoreanAmount(result.householdGrossMonthly));
  setText("householdMonthlySummaryNote", `중위소득 대비 ${formatPercent(result.medianIncomeRatio)}`);
  setText("takeHomeSummary", formatKoreanAmount(result.householdTakeHomeMonthly));
  setText("takeHomeSummaryNote", `연 ${formatKoreanAmount(result.householdTakeHomeAnnual)}`);
}

function renderSurplus(result) {
  const scenario = livingCostMap[livingCostScenario] || livingCostMap.AVERAGE;
  const surplus = result.householdTakeHomeMonthly - scenario.monthlyTotal;

  setText("surplusScenarioLabel", scenario.label);
  setText("surplusTakeHome", formatWon(result.householdTakeHomeMonthly));
  setText("surplusLivingCost", formatWon(scenario.monthlyTotal));
  setText("surplusAmount", formatWon(surplus));

  const surplusEl = $("surplusAmount");
  const card = $("surplusCard");
  if (surplusEl) surplusEl.classList.toggle("is-negative", surplus < 0);
  if (card) card.classList.toggle("is-negative", surplus < 0);
}

function renderDualVsSingle(result) {
  const singleAnnualM = result.mySalaryM;
  const singlePct = estimateTopPercentile(singleAnnualM, percentileTable);
  const dualPct = result.topPct;
  const delta = singlePct - dualPct;

  setText("dualPercentile", `상위 ${dualPct}%`);
  setText("dualAnnual", formatKoreanAmount(result.householdGrossAnnual));
  setText("singlePercentile", `상위 ${singlePct}%`);
  setText("singleAnnual", formatKoreanAmount(singleAnnualM * 10000));
  setText("deltaPercentile", delta > 0 ? `${delta}%p 상승` : delta < 0 ? `${Math.abs(delta)}%p 하락` : "변화 없음");
}

let positionChart = null;

function renderPositionChart(result) {
  const canvas = $("csr-position-chart");
  if (!canvas || !window.Chart) return;

  const labels = ["2인 가구 기준 중위소득", "2024 평균 가구소득(월)", "우리 부부 소득(월)"];
  const values = [
    coupleHouseholdMedianMonthly,
    averageHouseholdIncome / 12,
    result.householdGrossMonthly,
  ];
  const bgColors = ["#9FE1CB", "#5DCAA5", "#0F6E56"];
  const baseOpts = buildDefaultOptions();

  if (positionChart) {
    positionChart.data.datasets[0].data = values;
    positionChart.update("none");
    return;
  }

  positionChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 1.5,
        borderRadius: 6,
        barThickness: 26,
      }],
    },
    options: {
      ...baseOpts,
      indexAxis: "y",
      layout: { padding: { right: 72 } },
      plugins: {
        ...baseOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: { label: (c) => ` ${formatKRW(c.raw)} / 월` },
        },
      },
      scales: {
        x: {
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 }, color: "#888780" },
          grid: { color: "#F0EFED" },
        },
        y: { grid: { display: false }, ticks: { color: "#888780", font: { size: 11 } } },
      },
    },
    plugins: [makeLabelPlugin(formatKRW)],
  });
}

function renderComboList(result) {
  const list = $("comboRankingList");
  if (!list) return;

  const rows = combos.map((combo) => {
    const me = companyMap[combo.meName];
    const spouse = combo.spouseName ? companyMap[combo.spouseName] : null;
    const annualM = (me?.sal || 0) + (spouse?.sal || 0);
    const annual = annualM * 10000;
    const topPct = estimateTopPercentile(annualM, percentileTable);
    const isActive = result.myCompanyName === combo.meName
      && (combo.spouseName === null ? result.spouseNone : result.spouseCompanyName === combo.spouseName && !result.spouseNone);

    return { combo, annualM, annual, topPct, isActive };
  }).sort((a, b) => b.annualM - a.annualM);

  list.innerHTML = rows.map(({ combo, annual, topPct, isActive }) => `
    <button type="button" class="csr-combo-row${isActive ? " is-active" : ""}" data-combo-id="${combo.id}">
      <span class="csr-combo-row__label">
        <strong>${combo.label}</strong>
        <span>${combo.tagline}</span>
      </span>
      <span class="csr-combo-row__value">
        <strong>${formatKoreanAmount(annual)}</strong>
        <span>전국 상위 ${topPct}%</span>
      </span>
    </button>
  `).join("");

  list.querySelectorAll("[data-combo-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const combo = combos.find((c) => c.id === btn.dataset.comboId);
      if (!combo) return;
      applyCombo(combo);
    });
  });
}

function renderCompanyInfo(result) {
  const grid = $("companyInfoGrid");
  if (!grid) return;

  const me = companyMap[result.myCompanyName];
  const cards = [
    { role: "본인", company: me, salM: result.mySalaryM },
  ];
  if (!result.spouseNone) {
    const spouse = companyMap[result.spouseCompanyName];
    cards.push({ role: "배우자", company: spouse, salM: result.spouseSalaryM });
  }

  grid.innerHTML = cards.map(({ role, company, salM }) => `
    <article class="csr-company-card">
      <p>${role}</p>
      <strong>${company?.name || "-"}</strong>
      <span>${catLabel[company?.cat] || ""} · ${formatManwon(salM)}</span>
    </article>
  `).join("");
}

function render() {
  syncMySalarySlider();
  syncSpouseSalarySlider();
  updateSpouseFieldState();

  const scenario = livingCostMap[livingCostScenario] || livingCostMap.AVERAGE;
  setText("livingCostDesc", scenario.description);

  const result = aggregateResults();
  renderSummary(result);
  renderSurplus(result);
  renderDualVsSingle(result);
  renderPositionChart(result);
  renderComboList(result);
  renderCompanyInfo(result);

  writeParams({
    me: result.myCompanyName,
    ms: result.mySalaryM,
    sm: result.spouseNone ? "NONE" : "COMPANY",
    sp: result.spouseCompanyName,
    ss: result.spouseSalaryM,
    lc: livingCostScenario,
  });
}

// ── 입력 이벤트 ────────────────────────────────────────────────────────────────
myCompanySelect?.addEventListener("change", () => {
  const company = companyMap[myCompanySelect.value];
  if (company) {
    mySalaryInput.value = company.sal;
  }
  render();
});

spouseCompanySelect?.addEventListener("change", () => {
  const company = companyMap[spouseCompanySelect.value];
  if (company) {
    spouseSalaryInput.value = company.sal;
  }
  render();
});

[mySalaryInput, spouseSalaryInput].forEach((el) => {
  el?.addEventListener("input", render);
});

mySalarySlider?.addEventListener("input", () => {
  mySalaryInput.value = mySalarySlider.value;
  render();
});

spouseSalarySlider?.addEventListener("input", () => {
  spouseSalaryInput.value = spouseSalarySlider.value;
  render();
});

[spouseModeCompany, spouseModeNone].forEach((el) => {
  el?.addEventListener("change", render);
});

livingCostTabs?.querySelectorAll("[data-scenario]").forEach((btn) => {
  btn.addEventListener("click", () => {
    livingCostScenario = btn.dataset.scenario;
    livingCostTabs.querySelectorAll("[data-scenario]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    render();
  });
});

$("calcCsrBtn")?.addEventListener("click", render);

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1500);
}

function applyCombo(combo) {
  const me = companyMap[combo.meName];
  if (me) {
    myCompanySelect.value = me.name;
    mySalaryInput.value = me.sal;
  }
  if (combo.spouseName) {
    spouseModeCompany.checked = true;
    const spouse = companyMap[combo.spouseName];
    if (spouse) {
      spouseCompanySelect.value = spouse.name;
      spouseSalaryInput.value = spouse.sal;
    }
  } else {
    spouseModeNone.checked = true;
  }
  render();
  $("csr-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetPage() {
  myCompanySelect.value = "SK텔레콤";
  mySalaryInput.value = companyMap["SK텔레콤"]?.sal ?? 8000;
  spouseModeCompany.checked = true;
  spouseCompanySelect.value = "현대자동차";
  spouseSalaryInput.value = companyMap["현대자동차"]?.sal ?? 9500;
  livingCostScenario = "AVERAGE";
  livingCostTabs?.querySelectorAll("[data-scenario]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.scenario === "AVERAGE"));
  });
  render();
}

$("resetCsrBtn")?.addEventListener("click", () => {
  resetPage();
  flashButton($("resetCsrBtn"), "초기화됨");
});

$("copyCsrLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyCsrLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyCsrLinkBtn"), "복사 실패");
  }
});

// ── URL 파라미터 복원 후 초기 실행 ────────────────────────────────────────────
(function applyUrlParams() {
  const me = readParam("me", "");
  const ms = readParam("ms", "");
  const sm = readParam("sm", "");
  const sp = readParam("sp", "");
  const ss = readParam("ss", "");
  const lc = readParam("lc", "");
  const hasParams = [me, ms, sm, sp, ss, lc].some((v) => v !== "");

  if (hasParams) {
    if (me && companyMap[me]) myCompanySelect.value = me;
    if (ms) mySalaryInput.value = ms;
    if (sm === "NONE") {
      spouseModeNone.checked = true;
    } else {
      spouseModeCompany.checked = true;
    }
    if (sp && companyMap[sp]) spouseCompanySelect.value = sp;
    if (ss) spouseSalaryInput.value = ss;
    if (lc && livingCostMap[lc]) {
      livingCostScenario = lc;
      livingCostTabs?.querySelectorAll("[data-scenario]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.scenario === lc));
      });
    }
    render();
  } else {
    resetPage();
  }
})();
