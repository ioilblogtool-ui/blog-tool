const configEl = document.getElementById("cygConfig");
const { defaults = {}, regionRefLines = [] } = JSON.parse(configEl?.textContent || "{}");

const state = {
  homelessYears: defaults.homelessYears ?? 5,
  dependentsCount: defaults.dependentsCount ?? 2,
  subscriptionYears: defaults.subscriptionYears ?? 5,
  isHouseholder: defaults.isHouseholder ?? true,
};

// --- DOM refs ---
const homelessSlider = document.getElementById("cygHomelessSlider");
const homelessYearsInput = document.getElementById("cygHomelessYears");
const homelessScoreVal = document.getElementById("cygHomelessScoreVal");

const depMinusBtn = document.getElementById("cygDepMinus");
const depPlusBtn = document.getElementById("cygDepPlus");
const depCountEl = document.getElementById("cygDepCount");
const depScoreVal = document.getElementById("cygDepScoreVal");

const subYearsInput = document.getElementById("cygSubYears");
const subScoreVal = document.getElementById("cygSubScoreVal");

const householderCheckbox = document.getElementById("cygHouseholder");
const householderLabel = document.getElementById("cygHouseholderLabel");

const totalScoreEl = document.getElementById("cygTotalScore");
const scoreBadgeEl = document.getElementById("cygScoreBadge");
const homelessScoreEl = document.getElementById("cygHomelessScore");
const depScoreEl = document.getElementById("cygDepScore");
const subScoreEl = document.getElementById("cygSubScore");
const strategyListEl = document.getElementById("cygStrategyList");

const resetBtn = document.getElementById("resetCygBtn");
const copyBtn = document.getElementById("copyCygLinkBtn");

let chart = null;

// --- Score tables ---
const HOMELESS_TABLE = [
  [1, 2], [2, 4], [3, 6], [4, 8], [5, 10],
  [6, 12], [7, 14], [8, 16], [9, 18], [10, 20],
  [11, 22], [12, 24], [13, 26], [14, 28], [15, 30],
];

const SUB_TABLE = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
];

function calcHomelessScore(years) {
  for (const [maxYears, score] of HOMELESS_TABLE) {
    if (years < maxYears) return score;
  }
  return 32;
}

function calcDependentsScore(count) {
  const safe = Math.min(Math.max(0, count), 6);
  if (safe === 0) return 5;
  return Math.min(5 + safe * 5, 35);
}

function calcSubscriptionScore(years) {
  if (years < 1) return years === 0 ? 1 : 2;
  for (const [maxYears, score] of SUB_TABLE) {
    if (years < maxYears) return score;
  }
  return 17;
}

function getScoreLevel(score) {
  if (score >= 60) return "top";
  if (score >= 45) return "high";
  if (score >= 30) return "mid";
  return "low";
}

const SCORE_LEVEL_LABELS = {
  top: "최상위",
  high: "높음",
  mid: "보통",
  low: "낮음",
};

function getStrategyMessages(st, result) {
  const msgs = [];
  const { totalScore, homelessScore, dependentsScore, subscriptionScore } = result;

  if (homelessScore < 20) {
    msgs.push("무주택기간을 늘릴수록 가점이 올라갑니다. 주택 보유 이력 없이 기간을 유지하는 것이 중요합니다.");
  }
  if (dependentsScore < 20) {
    msgs.push("부양가족 요건(배우자, 직계존속·직계비속)을 꼼꼼히 확인해 인정 가능한 인원을 파악하세요.");
  }
  if (subscriptionScore < 10) {
    msgs.push("청약통장 가입기간은 시간이 쌓일수록 점수가 올라갑니다. 해지하지 말고 유지하는 것이 핵심입니다.");
  }
  if (!st.isHouseholder) {
    msgs.push("세대주 요건이 붙는 공급유형도 있으니 청약 자격 조건을 모집공고문에서 반드시 확인하세요.");
  }
  if (totalScore < 30) {
    msgs.push("현재 점수대는 경쟁이 낮은 지방 소규모 단지나 특별공급(신혼부부·생애최초) 병행 검토를 추천합니다.");
  }
  if (msgs.length === 0) {
    msgs.push("높은 점수대입니다. 목표 지역과 공급유형 기준을 먼저 정한 뒤 모집공고문을 꼼꼼히 확인하세요.");
  }
  return msgs;
}

function calculate() {
  const homelessScore = calcHomelessScore(state.homelessYears);
  const dependentsScore = calcDependentsScore(state.dependentsCount);
  const subscriptionScore = calcSubscriptionScore(state.subscriptionYears);
  const totalScore = homelessScore + dependentsScore + subscriptionScore;
  const scoreLevel = getScoreLevel(totalScore);
  const strategyMessages = getStrategyMessages(state, { totalScore, homelessScore, dependentsScore, subscriptionScore });

  return { totalScore, homelessScore, dependentsScore, subscriptionScore, scoreLevel, strategyMessages };
}

function updateUI(result) {
  const { totalScore, homelessScore, dependentsScore, subscriptionScore, scoreLevel, strategyMessages } = result;

  // KPI cards
  if (totalScoreEl) totalScoreEl.textContent = String(totalScore);
  if (homelessScoreEl) homelessScoreEl.textContent = String(homelessScore);
  if (depScoreEl) depScoreEl.textContent = String(dependentsScore);
  if (subScoreEl) subScoreEl.textContent = String(subscriptionScore);

  // Score badge
  if (scoreBadgeEl) {
    scoreBadgeEl.textContent = SCORE_LEVEL_LABELS[scoreLevel];
    scoreBadgeEl.className = `cyg-score-badge cyg-score-badge--${scoreLevel}`;
  }

  // Score previews in aside
  if (homelessScoreVal) homelessScoreVal.textContent = String(homelessScore);
  if (depScoreVal) depScoreVal.textContent = String(dependentsScore);
  if (subScoreVal) subScoreVal.textContent = String(subscriptionScore);

  // Strategy messages
  if (strategyListEl) {
    strategyListEl.innerHTML = strategyMessages
      .map((msg) => `<li>${msg}</li>`)
      .join("");
  }

  // Chart
  updateChart(totalScore);
}

function updateChart(myScore) {
  const canvas = document.getElementById("cygRegionChart");
  if (!canvas) return;

  const labels = ["내 점수", ...regionRefLines.map((r) => r.label)];
  const myData = [myScore, null, null, null, null];
  const refData = [null, ...regionRefLines.map((r) => r.minScore)];
  const refRangeData = [null, ...regionRefLines.map((r) => r.maxScore - r.minScore)];

  if (chart) {
    chart.data.datasets[0].data = myData;
    chart.data.datasets[1].data = refData;
    chart.data.datasets[2].data = refRangeData;
    chart.update();
    return;
  }

  chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "내 점수",
          data: myData,
          backgroundColor: "#1a56db",
          borderRadius: 6,
          barThickness: 20,
        },
        {
          label: "참고선 하한",
          data: refData,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(0,0,0,0)",
          barThickness: 20,
        },
        {
          label: "참고선 범위",
          data: refRangeData,
          backgroundColor: "rgba(107,114,128,0.25)",
          borderRadius: 6,
          barThickness: 20,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              if (ctx.datasetIndex === 0) return `내 점수: ${ctx.raw}점`;
              if (ctx.datasetIndex === 1) return null;
              const idx = ctx.dataIndex - 1;
              if (regionRefLines[idx]) {
                const r = regionRefLines[idx];
                return `참고선: ${r.minScore}~${r.maxScore}점 (${r.note})`;
              }
              return null;
            },
          },
          filter(item) {
            return item.datasetIndex !== 1;
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: 84,
          ticks: { font: { size: 11 } },
        },
        y: {
          stacked: true,
          ticks: { font: { size: 12 } },
        },
      },
    },
  });
}

function readAndRecalc() {
  state.homelessYears = Math.max(0, Math.min(30, Number(homelessYearsInput?.value) || 0));
  state.subscriptionYears = Math.max(0, Math.min(20, Number(subYearsInput?.value) || 0));
  state.isHouseholder = householderCheckbox?.checked ?? true;
  const result = calculate();
  updateUI(result);
  syncUrlParams();
}

// --- Slider sync ---
if (homelessSlider && homelessYearsInput) {
  homelessSlider.addEventListener("input", () => {
    homelessYearsInput.value = homelessSlider.value;
    readAndRecalc();
  });
  homelessYearsInput.addEventListener("input", () => {
    const v = Math.max(0, Math.min(30, Number(homelessYearsInput.value) || 0));
    homelessSlider.value = String(v);
    readAndRecalc();
  });
}

// --- Stepper ---
if (depMinusBtn && depPlusBtn && depCountEl) {
  depMinusBtn.addEventListener("click", () => {
    state.dependentsCount = Math.max(0, state.dependentsCount - 1);
    depCountEl.textContent = String(state.dependentsCount);
    const result = calculate();
    updateUI(result);
    syncUrlParams();
  });
  depPlusBtn.addEventListener("click", () => {
    state.dependentsCount = Math.min(6, state.dependentsCount + 1);
    depCountEl.textContent = String(state.dependentsCount);
    const result = calculate();
    updateUI(result);
    syncUrlParams();
  });
}

// --- Sub years & householder ---
subYearsInput?.addEventListener("input", readAndRecalc);
householderCheckbox?.addEventListener("change", () => {
  state.isHouseholder = householderCheckbox.checked;
  if (householderLabel) {
    householderLabel.textContent = state.isHouseholder ? "세대주" : "세대원";
  }
  readAndRecalc();
});

// --- URL params ---
function syncUrlParams() {
  const url = new URL(window.location.href);
  url.searchParams.set("hy", String(state.homelessYears));
  url.searchParams.set("dc", String(state.dependentsCount));
  url.searchParams.set("sy", String(state.subscriptionYears));
  url.searchParams.set("hh", state.isHouseholder ? "1" : "0");
  window.history.replaceState(null, "", url.toString());
}

function restoreFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("hy")) state.homelessYears = Math.max(0, Math.min(30, Number(params.get("hy")) || 0));
  if (params.has("dc")) state.dependentsCount = Math.max(0, Math.min(6, Number(params.get("dc")) || 0));
  if (params.has("sy")) state.subscriptionYears = Math.max(0, Math.min(20, Number(params.get("sy")) || 0));
  if (params.has("hh")) state.isHouseholder = params.get("hh") === "1";

  // Sync DOM
  if (homelessSlider) homelessSlider.value = String(state.homelessYears);
  if (homelessYearsInput) homelessYearsInput.value = String(state.homelessYears);
  if (depCountEl) depCountEl.textContent = String(state.dependentsCount);
  if (subYearsInput) subYearsInput.value = String(state.subscriptionYears);
  if (householderCheckbox) householderCheckbox.checked = state.isHouseholder;
  if (householderLabel) householderLabel.textContent = state.isHouseholder ? "세대주" : "세대원";
}

// --- Reset ---
resetBtn?.addEventListener("click", () => {
  state.homelessYears = defaults.homelessYears ?? 5;
  state.dependentsCount = defaults.dependentsCount ?? 2;
  state.subscriptionYears = defaults.subscriptionYears ?? 5;
  state.isHouseholder = defaults.isHouseholder ?? true;

  if (homelessSlider) homelessSlider.value = String(state.homelessYears);
  if (homelessYearsInput) homelessYearsInput.value = String(state.homelessYears);
  if (depCountEl) depCountEl.textContent = String(state.dependentsCount);
  if (subYearsInput) subYearsInput.value = String(state.subscriptionYears);
  if (householderCheckbox) householderCheckbox.checked = state.isHouseholder;
  if (householderLabel) householderLabel.textContent = state.isHouseholder ? "세대주" : "세대원";

  const result = calculate();
  updateUI(result);
  syncUrlParams();
});

// --- Copy link ---
copyBtn?.addEventListener("click", () => {
  navigator.clipboard?.writeText(window.location.href).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = "복사됨!";
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  });
});

// --- Init ---
restoreFromUrl();
const initialResult = calculate();
updateUI(initialResult);
