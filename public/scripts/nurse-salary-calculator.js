const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("nscConfig");

if (!configNode) {
  throw new Error("nurse salary calculator config is missing");
}

const { hospitalTypes, yearOptions, nightShiftOptions, defaultInput, presets } = JSON.parse(configNode.textContent || "{}");

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

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

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function getHospitalType(id) {
  return hospitalTypes.find((t) => t.id === id) || hospitalTypes[0];
}

function getNightShiftOption(id) {
  return nightShiftOptions.find((o) => o.id === id) || nightShiftOptions[0];
}

function getYearPoint(hospitalTypeId, year) {
  const type = getHospitalType(hospitalTypeId);
  return type.yearlyProgression.find((p) => p.year === year) || type.yearlyProgression[0];
}

function addRange(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function calculate(input) {
  const type = getHospitalType(input.hospitalTypeId);
  const yearPoint = getYearPoint(input.hospitalTypeId, input.year);
  const night = getNightShiftOption(input.nightShiftId);

  const nightAnnual = [night.monthlyExtraRange[0] * 12, night.monthlyExtraRange[1] * 12];
  const annualGross = addRange(yearPoint.salary.annualGross, nightAnnual);
  const monthlyNet = addRange(yearPoint.salary.monthlyNetEstimate, night.monthlyExtraRange);

  return { type, yearPoint, night, annualGross, monthlyNet };
}

function renderScoreList(type) {
  const target = $("#nscScoreList");
  if (!target) return;

  const items = [
    { label: "워라밸", score: type.workLifeBalanceScore },
    { label: "성장성", score: type.growthScore },
    { label: "이직 위험", labelValue: type.turnoverRiskLabel },
  ];

  target.innerHTML = items.map((item) => {
    if (item.labelValue) {
      return `
        <div class="nsc-score-row">
          <span class="nsc-score-row__label">${item.label}</span>
          <span class="nsc-score-row__value">${item.labelValue}</span>
        </div>
      `;
    }
    const pct = (item.score / 5) * 100;
    return `
      <div class="nsc-score-row">
        <span class="nsc-score-row__label">${item.label}</span>
        <div class="nsc-score-bar"><span style="width:${pct}%"></span></div>
        <span class="nsc-score-row__value">${item.score} / 5</span>
      </div>
    `;
  }).join("");
}

function renderAllowanceNotes(type) {
  const target = $("#nscAllowanceNotes");
  if (!target) return;

  target.innerHTML = `
    <p class="nsc-allowance-notes__title">${type.shortName} 수당·특징</p>
    <ul>${type.allowanceNotes.map((note) => `<li>${note}</li>`).join("")}</ul>
  `;
}

function renderCompareTable(input) {
  const target = $("#nscCompareRows");
  if (!target) return;

  target.innerHTML = hospitalTypes.map((type) => {
    const result = calculate({ ...input, hospitalTypeId: type.id });
    const isSelected = type.id === input.hospitalTypeId;
    return `
      <tr class="${isSelected ? "is-selected" : ""}">
        <td><strong>${type.shortName}</strong></td>
        <td>${formatRangeWon(result.annualGross)}</td>
        <td>${formatRangeWon(result.monthlyNet)}</td>
      </tr>
    `;
  }).join("");
}

function syncInputsFromState() {
  const yearSelect = $('[data-nsc="year"]');
  const nightSelect = $('[data-nsc="nightShiftId"]');

  if (yearSelect) yearSelect.value = String(state.year);
  if (nightSelect) nightSelect.value = state.nightShiftId;

  $$(".nsc-hospital-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.hospitalType === state.hospitalTypeId);
  });
}

function render() {
  const result = calculate(state);
  const yearOption = yearOptions.find((o) => o.value === state.year) || yearOptions[0];

  setText("#nscMonthlyNet", formatRangeWon(result.monthlyNet));
  setText("#nscAnnualGross", formatRangeWon(result.annualGross));
  setText("#nscNightExtra", result.night.monthlyExtraRange[0] === 0 && result.night.monthlyExtraRange[1] === 0
    ? "없음"
    : `월 ${formatMan(result.night.monthlyExtraRange[0])} ~ ${formatMan(result.night.monthlyExtraRange[1])}원`);
  setText("#nscHospitalLabel", result.type.shortName);
  setText("#nscYearLabel", yearOption.label);
  setText(
    "#nscSummaryText",
    `${result.type.shortName} ${yearOption.label} 기준 연봉은 ${formatRangeWon(result.annualGross)}, 월 실수령은 ${formatRangeWon(result.monthlyNet)}으로 추정됩니다.`
  );

  renderScoreList(result.type);
  renderAllowanceNotes(result.type);
  renderCompareTable(state);
  syncInputsFromState();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);

  $$(".nsc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const hospitalTypeId = params.get("hospitalTypeId");
  if (hospitalTypeId && hospitalTypes.some((t) => t.id === hospitalTypeId)) state.hospitalTypeId = hospitalTypeId;
  const year = params.get("year");
  if (year !== null && yearOptions.some((o) => o.value === Number(year))) state.year = Number(year);
  const nightShiftId = params.get("nightShiftId");
  if (nightShiftId && nightShiftOptions.some((o) => o.id === nightShiftId)) state.nightShiftId = nightShiftId;
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  const yearSelect = $('[data-nsc="year"]');
  const nightSelect = $('[data-nsc="nightShiftId"]');

  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      state.year = Number(yearSelect.value);
      render();
    });
  }

  if (nightSelect) {
    nightSelect.addEventListener("change", () => {
      state.nightShiftId = nightSelect.value;
      render();
    });
  }

  $$(".nsc-hospital-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.hospitalTypeId = button.dataset.hospitalType;
      render();
    });
  });

  $$(".nsc-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("nscResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);

      $$(".nsc-preset-btn").forEach((button, index) => {
        button.classList.toggle("is-active", index === 0);
      });

      render();
    });
  }

  const copyBtn = document.getElementById("nscCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("hospitalTypeId", state.hospitalTypeId);
      url.searchParams.set("year", String(state.year));
      url.searchParams.set("nightShiftId", state.nightShiftId);
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = "링크 복사"; }, 1600);
    });
  }

  render();
}

init();
