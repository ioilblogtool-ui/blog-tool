const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("tscConfig");

if (!configNode) {
  throw new Error("teacher salary calculator config is missing");
}

const { steps, allowances, defaultInput, presets } = JSON.parse(configNode.textContent || "{}");

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

function getStepRow(step) {
  return steps.find((s) => s.step === step) || steps[0];
}

function getAllowanceBreakdown(input) {
  const items = [
    { name: "교직수당", amount: allowances.dutyAllowance, condition: "전 교사 공통", applied: true },
    { name: "정액급식비", amount: allowances.mealAllowance, condition: "전 공무원 공통", applied: true },
    {
      name: "교원연구비",
      amount: input.careerUnder5 ? allowances.researchAllowanceJunior : allowances.researchAllowanceSenior,
      condition: input.careerUnder5 ? "경력 5년 미만" : "경력 5년 이상",
      applied: true,
    },
    { name: "담임수당", amount: allowances.classTeacherAllowance, condition: "담임교사 배정 시", applied: input.classTeacher },
    { name: "보직수당", amount: allowances.positionAllowance, condition: "교무·연구·학생부장 등", applied: input.position },
    { name: "특수교사 수당", amount: allowances.specialEducationAllowance, condition: "특수학교·특수학급 배치 시", applied: input.specialEducation },
  ];

  return items;
}

function calculate(input) {
  const row = getStepRow(input.step);
  const allowanceItems = getAllowanceBreakdown(input);
  const appliedAllowances = allowanceItems.filter((item) => item.applied);
  const allowanceSum = appliedAllowances.reduce((sum, item) => sum + item.amount, 0);

  const netRatio = row.monthlyBase > 0 ? row.monthlyNetEstimate / row.monthlyBase : 0.82;

  const monthlyNet = row.monthlyNetEstimate + allowanceSum * netRatio;
  const holidayBonus = row.monthlyBase * allowances.holidayBonusRate * 2;
  const annualGross = row.annualGross + allowanceSum * 12 + holidayBonus;
  const annualNet = row.monthlyNetEstimate * 12 + (allowanceSum * 12 + holidayBonus) * netRatio;

  return {
    row,
    allowanceItems,
    allowanceSum,
    monthlyNet,
    annualGross,
    annualNet,
    netRatio,
  };
}

function getNearbySteps(step) {
  const result = [];
  for (let s = step - 3; s <= step + 3; s++) {
    if (s < 1 || s > 40) continue;
    result.push(getStepRow(s));
  }
  return result;
}

function renderAllowanceTable(result) {
  const target = $("#tscAllowanceRows");
  if (!target) return;

  target.innerHTML = result.allowanceItems.map((item) => `
    <tr class="${item.applied ? "" : "tsc-row--inactive"}">
      <td>${item.name}</td>
      <td>${item.applied ? formatWon(item.amount) : "미적용"}</td>
      <td>${item.condition}</td>
    </tr>
  `).join("");
}

function renderNearbyTable(step) {
  const target = $("#tscNearbyRows");
  if (!target) return;

  target.innerHTML = getNearbySteps(step).map((row) => `
    <tr class="${row.step === step ? "is-selected" : ""}">
      <td><strong>${row.step}호봉</strong></td>
      <td>${formatWon(row.monthlyBase)}</td>
      <td>${formatWon(row.annualGross)}</td>
      <td>${formatWon(row.monthlyNetEstimate)}</td>
    </tr>
  `).join("");
}

function syncInputsFromState() {
  const stepInput = $('[data-tsc="step"]');
  const stepRange = $('[data-tsc="stepRange"]');
  if (stepInput) stepInput.value = String(state.step);
  if (stepRange) stepRange.value = String(state.step);

  $$('[data-tsc]').forEach((input) => {
    const key = input.dataset.tsc;
    if (!key || key === "step" || key === "stepRange") return;
    if (input.type === "checkbox") input.checked = Boolean(state[key]);
  });
}

function clampStep(value) {
  const n = Math.round(Number(value) || 1);
  return Math.min(40, Math.max(1, n));
}

function readInputs() {
  $$('[data-tsc]').forEach((input) => {
    const key = input.dataset.tsc;
    if (!key) return;

    if (input.type === "checkbox") {
      state[key] = input.checked;
    }
  });
}

function render() {
  readInputs();
  syncInputsFromState();

  const result = calculate(state);

  setText("#tscMonthlyNet", formatWon(result.monthlyNet));
  setText("#tscMonthlyBase", formatWon(result.row.monthlyBase));
  setText("#tscAllowanceSum", formatWon(result.allowanceSum));
  setText("#tscAnnualGross", formatWon(result.annualGross));
  setText("#tscAnnualNet", formatWon(result.annualNet));
  setText("#tscStepLabel", String(state.step));
  setText(
    "#tscSummaryText",
    `${state.step}호봉 기준 월 실수령은 약 ${formatMan(result.monthlyNet)}, 연봉은 약 ${formatMan(result.annualGross)}으로 추정됩니다.`
  );

  renderAllowanceTable(result);
  renderNearbyTable(state.step);
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);
  syncInputsFromState();

  $$(".tsc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const step = params.get("step");
  if (step) state.step = clampStep(step);
  if (params.get("classTeacher") !== null) state.classTeacher = params.get("classTeacher") === "true";
  if (params.get("position") !== null) state.position = params.get("position") === "true";
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  const stepInput = $('[data-tsc="step"]');
  const stepRange = $('[data-tsc="stepRange"]');

  if (stepInput) {
    stepInput.addEventListener("input", () => {
      state.step = clampStep(stepInput.value);
      render();
    });
  }

  if (stepRange) {
    stepRange.addEventListener("input", () => {
      state.step = clampStep(stepRange.value);
      render();
    });
  }

  $$('[data-tsc]').forEach((input) => {
    const key = input.dataset.tsc;
    if (key === "step" || key === "stepRange") return;
    input.addEventListener("input", render);
    input.addEventListener("change", render);
  });

  $$(".tsc-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("tscResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);
      syncInputsFromState();

      $$(".tsc-preset-btn").forEach((button, index) => {
        button.classList.toggle("is-active", index === 0);
      });

      render();
    });
  }

  const copyBtn = document.getElementById("tscCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("step", String(state.step));
      url.searchParams.set("classTeacher", String(state.classTeacher));
      url.searchParams.set("position", String(state.position));
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = "링크 복사"; }, 1600);
    });
  }

  render();
}

init();
