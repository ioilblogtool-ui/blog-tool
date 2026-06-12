const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("pscConfig");

if (!configNode) {
  throw new Error("public servant salary calculator config is missing");
}

const { grades, allowances, defaultInput, presets } = JSON.parse(configNode.textContent || "{}");

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

function formatWon(value) {
  return `${numberFormatter.format(Math.round(Number(value || 0)))}원`;
}

function formatMan(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);

  if (eok > 0 && man > 0) return `${eok}억 ${numberFormatter.format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${numberFormatter.format(man)}만원`;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function getGrade(gradeId) {
  return grades.find((g) => g.id === gradeId) || grades[0];
}

function getStepRow(gradeId, step) {
  const grade = getGrade(gradeId);
  return grade.steps.find((s) => s.step === step) || grade.steps[0];
}

function getMaxStep(gradeId) {
  return getGrade(gradeId).maxStep;
}

function getLongevityBonusAmount(step) {
  const tier = allowances.longevityBonusTiers.find((t) => step >= t.minStep);
  return tier ? tier.amount : 0;
}

function getLongevityBonusPercent(step) {
  const years = Math.max(0, step - 1);
  return Math.min(years * 5, 50);
}

function getAllowanceBreakdown(input) {
  const grade = getGrade(input.grade);
  const childAmount = allowances.childAllowance * input.childCount;

  return [
    { name: "직급보조비", amount: grade.jobGradeSupport, condition: `${grade.label} 공통`, applied: true },
    { name: "정액급식비", amount: allowances.mealAllowance, condition: "전 공무원 공통", applied: true },
    { name: "가족수당 (배우자)", amount: allowances.spouseAllowance, condition: "배우자 등록 시", applied: input.hasSpouse },
    {
      name: "가족수당 (자녀)",
      amount: childAmount,
      condition: input.childCount > 0 ? `자녀 ${input.childCount}명` : "자녀 없음",
      applied: input.childCount > 0,
    },
    {
      name: "정근수당가산금",
      amount: getLongevityBonusAmount(input.step),
      condition: "근속 5년↑ 5만원 · 10년↑ 10만원 · 15년↑ 15만원",
      applied: getLongevityBonusAmount(input.step) > 0,
    },
  ];
}

function calculate(input) {
  const row = getStepRow(input.grade, input.step);
  const grade = getGrade(input.grade);

  const baseAllowances = grade.jobGradeSupport + allowances.mealAllowance;
  const allowanceItems = getAllowanceBreakdown(input);
  const extraAllowances = allowanceItems
    .filter((item) => item.applied && (item.name === "가족수당 (배우자)" || item.name === "가족수당 (자녀)" || item.name === "정근수당가산금"))
    .reduce((sum, item) => sum + item.amount, 0);

  const allowanceSum = allowanceItems.filter((item) => item.applied).reduce((sum, item) => sum + item.amount, 0);

  const netBase = row.monthlyBase + baseAllowances;
  const netRatio = netBase > 0 ? row.monthlyNetEstimate / netBase : 0.93;

  const monthlyNet = row.monthlyNetEstimate + extraAllowances * netRatio;

  const longevityPercent = getLongevityBonusPercent(input.step);
  const holidayBonus = row.monthlyBase * allowances.holidayBonusRate * 2;
  const longevityBonusAnnual = row.monthlyBase * (longevityPercent / 100) * 2;
  const annualExtra = holidayBonus + longevityBonusAnnual;

  const annualGross = (row.monthlyBase + allowanceSum) * 12 + annualExtra;
  const annualNet = row.monthlyNetEstimate * 12 + extraAllowances * 12 * netRatio + annualExtra * netRatio;

  return {
    row,
    grade,
    allowanceItems,
    allowanceSum,
    monthlyNet,
    annualGross,
    annualNet,
    netRatio,
    holidayBonus,
    longevityPercent,
    longevityBonusAnnual,
  };
}

function getNearbySteps(gradeId, step) {
  const grade = getGrade(gradeId);
  const result = [];
  for (let s = step - 3; s <= step + 3; s++) {
    if (s < 1 || s > grade.maxStep) continue;
    result.push(getStepRow(gradeId, s));
  }
  return result;
}

function renderAllowanceTable(result) {
  const target = $("#pscAllowanceRows");
  if (!target) return;

  target.innerHTML = result.allowanceItems.map((item) => `
    <tr class="${item.applied ? "" : "psc-row--inactive"}">
      <td>${item.name}</td>
      <td>${item.applied ? formatWon(item.amount) : "미적용"}</td>
      <td>${item.condition}</td>
    </tr>
  `).join("");
}

function renderAnnualTable(result) {
  const target = $("#pscAnnualRows");
  if (!target) return;

  const rows = [
    {
      name: "명절휴가비",
      amount: result.holidayBonus,
      condition: "설·추석 연 2회, 기본급 60%씩",
      applied: true,
    },
    {
      name: "정근수당",
      amount: result.longevityBonusAnnual,
      condition: result.longevityPercent > 0 ? `근속 비례 ${result.longevityPercent}%, 연 2회` : "근속 1년 미만 (미지급)",
      applied: result.longevityPercent > 0,
    },
  ];

  target.innerHTML = rows.map((item) => `
    <tr class="${item.applied ? "" : "psc-row--inactive"}">
      <td>${item.name}</td>
      <td>${item.applied ? formatWon(item.amount) : "미적용"}</td>
      <td>${item.condition}</td>
    </tr>
  `).join("");
}

function renderNearbyTable(gradeId, step) {
  const target = $("#pscNearbyRows");
  if (!target) return;

  target.innerHTML = getNearbySteps(gradeId, step).map((row) => `
    <tr class="${row.step === step ? "is-selected" : ""}">
      <td><strong>${row.step}호봉</strong></td>
      <td>${formatWon(row.monthlyBase)}</td>
      <td>${formatWon(row.monthlyNetEstimate)}</td>
    </tr>
  `).join("");
}

function clampStep(value, gradeId) {
  const max = getMaxStep(gradeId || state.grade);
  const n = Math.round(Number(value) || 1);
  return Math.min(max, Math.max(1, n));
}

function clampChildCount(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(4, Math.max(0, n));
}

function syncInputsFromState() {
  const stepInput = $('[data-psc="step"]');
  const stepRange = $('[data-psc="stepRange"]');
  const childInput = $('[data-psc="childCount"]');
  const spouseInput = $('[data-psc="hasSpouse"]');

  if (stepInput) stepInput.value = String(state.step);
  if (stepRange) {
    stepRange.max = String(getMaxStep(state.grade));
    stepRange.value = String(state.step);
  }
  if (stepInput) stepInput.max = String(getMaxStep(state.grade));
  if (childInput) childInput.value = String(state.childCount);
  if (spouseInput) spouseInput.checked = Boolean(state.hasSpouse);

  $$(".psc-grade-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pscGrade === state.grade);
  });
}

function render() {
  state.step = clampStep(state.step, state.grade);

  const result = calculate(state);

  setText("#pscMonthlyNet", formatWon(result.monthlyNet));
  setText("#pscMonthlyBase", formatWon(result.row.monthlyBase));
  setText("#pscAllowanceSum", formatWon(result.allowanceSum));
  setText("#pscAnnualGross", formatWon(result.annualGross));
  setText("#pscAnnualNet", formatWon(result.annualNet));
  setText("#pscGradeLabel", result.grade.label.replace("급", ""));
  setText("#pscStepLabel", String(state.step));
  setText(
    "#pscSummaryText",
    `${result.grade.label} ${state.step}호봉 기준 월 실수령은 약 ${formatMan(result.monthlyNet)}, 연봉은 약 ${formatMan(result.annualGross)}으로 추정됩니다.`
  );

  renderAllowanceTable(result);
  renderAnnualTable(result);
  renderNearbyTable(state.grade, state.step);
  syncInputsFromState();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);
  state.step = clampStep(state.step, state.grade);

  $$(".psc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const grade = params.get("grade");
  if (grade === "9" || grade === "8" || grade === "7") state.grade = grade;
  const step = params.get("step");
  if (step) state.step = clampStep(step, state.grade);
  if (params.get("hasSpouse") !== null) state.hasSpouse = params.get("hasSpouse") === "true";
  const childCount = params.get("childCount");
  if (childCount !== null) state.childCount = clampChildCount(childCount);
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  const stepInput = $('[data-psc="step"]');
  const stepRange = $('[data-psc="stepRange"]');
  const childInput = $('[data-psc="childCount"]');
  const spouseInput = $('[data-psc="hasSpouse"]');

  if (stepInput) {
    stepInput.addEventListener("input", () => {
      state.step = clampStep(stepInput.value, state.grade);
      render();
    });
  }

  if (stepRange) {
    stepRange.addEventListener("input", () => {
      state.step = clampStep(stepRange.value, state.grade);
      render();
    });
  }

  if (childInput) {
    childInput.addEventListener("input", () => {
      state.childCount = clampChildCount(childInput.value);
      render();
    });
  }

  if (spouseInput) {
    spouseInput.addEventListener("change", () => {
      state.hasSpouse = spouseInput.checked;
      render();
    });
  }

  $$(".psc-grade-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.grade = button.dataset.pscGrade;
      state.step = clampStep(state.step, state.grade);
      render();
    });
  });

  $$(".psc-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("pscResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);

      $$(".psc-preset-btn").forEach((button, index) => {
        button.classList.toggle("is-active", index === 0);
      });

      render();
    });
  }

  const copyBtn = document.getElementById("pscCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("grade", state.grade);
      url.searchParams.set("step", String(state.step));
      url.searchParams.set("hasSpouse", String(state.hasSpouse));
      url.searchParams.set("childCount", String(state.childCount));
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = "링크 복사"; }, 1600);
    });
  }

  render();
}

init();
