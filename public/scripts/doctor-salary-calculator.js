const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("dscConfig");

if (!configNode) {
  throw new Error("doctor salary calculator config is missing");
}

const { workTypes, traineeStages, residentSteps, specialties, allowances, defaultInput, presets } = JSON.parse(
  configNode.textContent || "{}"
);

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

const EMPLOYEE_NET_RATIO = 0.7;
const SELF_EMPLOYED_NET_RATIO = 0.65;

function formatMan(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);

  if (eok > 0 && man > 0) return `${eok}억 ${numberFormatter.format(man)}만`;
  if (eok > 0) return `${eok}억`;
  return `${numberFormatter.format(man)}만`;
}

function formatRangeWon(range) {
  const [min, max] = range;
  if (min === max) return `약 ${formatMan(min)}원`;
  return `약 ${formatMan(min)} ~ ${formatMan(max)}원`;
}

function withTopicParticle(word) {
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return `${word}는`;
  const hasJongseong = (lastChar - 0xac00) % 28 !== 0;
  return hasJongseong ? `${word}은` : `${word}는`;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function getWorkType(id) {
  return workTypes.find((t) => t.id === id) || workTypes[0];
}

function getSpecialty(name) {
  return specialties.find((s) => s.specialty === name) || specialties[0];
}

function getResidentStep(stage) {
  return residentSteps.find((s) => s.stage === stage) || residentSteps[0];
}

function calculate(input) {
  const workType = getWorkType(input.workTypeId);
  let annualRange;
  let monthlyRange;
  let monthlyLabel;
  let detailLabel;
  let detailNote;

  if (input.workTypeId === "trainee") {
    const step = getResidentStep(input.residentStage);
    annualRange = [step.annualEstimate, step.annualEstimate];
    monthlyRange = [step.monthlyTotal, step.monthlyTotal];
    monthlyLabel = "월 급여 (수당포함, 세전 추정)";
    detailLabel = step.label;
    detailNote = step.note;
  } else if (input.workTypeId === "fellow") {
    const step = getResidentStep("fellow");
    annualRange = [step.annualEstimate, step.annualEstimate];
    monthlyRange = [step.monthlyTotal, step.monthlyTotal];
    monthlyLabel = "월 급여 (수당포함, 세전 추정)";
    detailLabel = step.label;
    detailNote = step.note;
  } else if (input.workTypeId === "employee" || input.workTypeId === "self_employed") {
    const specialty = getSpecialty(input.specialtyId);
    const isEmployee = input.workTypeId === "employee";
    const specialtyRange = isEmployee
      ? [specialty.employeeAnnualMin, specialty.employeeAnnualMax]
      : [specialty.selfEmployedMin, specialty.selfEmployedMax];

    if (specialtyRange[0] === 0 && specialtyRange[1] === 0) {
      annualRange = [workType.annualMin, workType.annualMax];
      detailNote = `${withTopicParticle(specialty.specialty)} 개원 사례가 거의 없어 ${workType.name} 전체 범위로 표시합니다.`;
    } else {
      annualRange = specialtyRange;
      detailNote = specialty.note;
    }

    const ratio = isEmployee ? EMPLOYEE_NET_RATIO : SELF_EMPLOYED_NET_RATIO;
    monthlyRange = [Math.round((annualRange[0] / 12) * ratio), Math.round((annualRange[1] / 12) * ratio)];
    monthlyLabel = "월 실수령 (추정)";
    detailLabel = specialty.specialty;
  } else {
    annualRange = [workType.annualMin, workType.annualMax];
    monthlyRange = [workType.monthlyNetMin, workType.monthlyNetMax];
    monthlyLabel = "월 실수령 (추정)";
    detailLabel = workType.badge;
    detailNote = workType.description;
  }

  return { workType, annualRange, monthlyRange, monthlyLabel, detailLabel, detailNote };
}

function renderAllowanceNotes() {
  const target = $("#dscAllowanceNotes");
  if (!target) return;

  target.innerHTML = allowances
    .map(
      (item) => `
      <li><strong>${item.name}</strong> — ${item.amount} <span>(${item.condition})</span></li>
    `
    )
    .join("");
}

function renderSpecialtyTable(input) {
  const target = $("#dscSpecialtyRows");
  if (!target) return;

  const showSelf = input.workTypeId === "self_employed";
  const isSpecialtyRelevant = input.workTypeId === "employee" || input.workTypeId === "self_employed";

  target.innerHTML = specialties
    .map((row) => {
      const isSelected = isSpecialtyRelevant && row.specialty === input.specialtyId;
      const selfRange =
        row.selfEmployedMin === 0 && row.selfEmployedMax === 0
          ? "개원 사례 거의 없음"
          : formatRangeWon([row.selfEmployedMin, row.selfEmployedMax]);
      return `
        <tr class="${isSelected ? "is-selected" : ""}">
          <td><strong>${row.specialty}</strong></td>
          <td>${formatRangeWon([row.employeeAnnualMin, row.employeeAnnualMax])}</td>
          <td>${selfRange}</td>
          <td>${row.demandLevel}</td>
        </tr>
      `;
    })
    .join("");

  void showSelf;
}

function renderResidentTable(input) {
  const target = $("#dscResidentRows");
  if (!target) return;

  const isResident = input.workTypeId === "trainee" || input.workTypeId === "fellow";
  const selectedStage = input.workTypeId === "fellow" ? "fellow" : input.residentStage;

  target.innerHTML = residentSteps
    .map((step) => {
      const isSelected = isResident && step.stage === selectedStage;
      return `
        <tr class="${isSelected ? "is-selected" : ""}">
          <td><strong>${step.label}</strong></td>
          <td>${formatMan(step.monthlyTotal)}원</td>
          <td>${formatMan(step.annualEstimate)}원</td>
        </tr>
      `;
    })
    .join("");
}

function syncInputsFromState() {
  $$(".dsc-worktype-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.workType === state.workTypeId);
  });

  const stageField = $("#dscStageField");
  const specialtyField = $("#dscSpecialtyField");

  if (stageField) stageField.classList.toggle("is-hidden", state.workTypeId !== "trainee");
  if (specialtyField) {
    specialtyField.classList.toggle(
      "is-hidden",
      !(state.workTypeId === "employee" || state.workTypeId === "self_employed")
    );
  }

  const stageSelect = $('[data-dsc="residentStage"]');
  const specialtySelect = $('[data-dsc="specialtyId"]');

  if (stageSelect) stageSelect.value = state.residentStage;
  if (specialtySelect) specialtySelect.value = state.specialtyId;
}

function render() {
  const result = calculate(state);

  setText("#dscMonthlyLabel", result.monthlyLabel);
  setText("#dscMonthlyValue", formatRangeWon(result.monthlyRange));
  setText("#dscAnnualValue", formatRangeWon(result.annualRange));
  setText("#dscDetailLabel", result.detailLabel);
  setText("#dscDetailNote", result.detailNote || "");
  setText("#dscWorkTypeLabel", result.workType.name);

  const monthlyName = result.monthlyLabel.replace(" (추정)", "").replace(" (수당포함, 세전 추정)", "");
  setText(
    "#dscSummaryText",
    `${result.workType.name} (${result.detailLabel}) 기준 연봉은 ${formatRangeWon(result.annualRange)}, ${withTopicParticle(monthlyName)} ${formatRangeWon(result.monthlyRange)}으로 추정됩니다.`
  );

  renderSpecialtyTable(state);
  renderResidentTable(state);
  syncInputsFromState();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);

  $$(".dsc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const workTypeId = params.get("workTypeId");
  if (workTypeId && workTypes.some((t) => t.id === workTypeId)) state.workTypeId = workTypeId;

  const specialtyId = params.get("specialtyId");
  if (specialtyId && specialties.some((s) => s.specialty === specialtyId)) state.specialtyId = specialtyId;

  const residentStage = params.get("residentStage");
  if (residentStage && traineeStages.some((s) => s.stage === residentStage)) state.residentStage = residentStage;
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  $$(".dsc-worktype-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.workTypeId = button.dataset.workType;
      render();
    });
  });

  const stageSelect = $('[data-dsc="residentStage"]');
  if (stageSelect) {
    stageSelect.addEventListener("change", () => {
      state.residentStage = stageSelect.value;
      render();
    });
  }

  const specialtySelect = $('[data-dsc="specialtyId"]');
  if (specialtySelect) {
    specialtySelect.addEventListener("change", () => {
      state.specialtyId = specialtySelect.value;
      render();
    });
  }

  $$(".dsc-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("dscResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);

      $$(".dsc-preset-btn").forEach((button, index) => {
        button.classList.toggle("is-active", index === 0);
      });

      render();
    });
  }

  const copyBtn = document.getElementById("dscCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("workTypeId", state.workTypeId);
      url.searchParams.set("specialtyId", state.specialtyId);
      url.searchParams.set("residentStage", state.residentStage);
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => {
        copyBtn.textContent = "링크 복사";
      }, 1600);
    });
  }

  renderAllowanceNotes();
  render();
}

init();
