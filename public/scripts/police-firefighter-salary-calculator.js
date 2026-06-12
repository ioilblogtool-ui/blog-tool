const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("pfConfig");

if (!configNode) {
  throw new Error("police/firefighter salary calculator config is missing");
}

const { ranks, allowances, jobGradeSupport, shiftPatterns, defaultInput, presets } = JSON.parse(configNode.textContent || "{}");

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

function getRank(rankId) {
  return ranks.find((r) => r.id === rankId) || ranks[0];
}

function getRankLabel(rank, org) {
  return org === "fire" ? rank.fireLabel : rank.policeLabel;
}

function getStepRow(rankId, step) {
  const rank = getRank(rankId);
  return rank.steps.find((s) => s.step === step) || rank.steps[0];
}

function getShiftPattern(id) {
  return shiftPatterns.find((p) => p.id === id) || shiftPatterns[shiftPatterns.length - 1];
}

function getLongevityBonusPercent(step) {
  const years = Math.max(0, step - 1);
  return Math.min(years * 5, 50);
}

// 총지급액 구간별 공제율 추정 (연금+건보+장기요양+소득세 근사)
function getNetRatio(grossMonthly) {
  if (grossMonthly < 2_800_000) return 0.85;
  if (grossMonthly < 3_800_000) return 0.84;
  if (grossMonthly < 5_000_000) return 0.82;
  if (grossMonthly < 7_000_000) return 0.79;
  if (grossMonthly < 9_000_000) return 0.76;
  return 0.73;
}

function getAllowanceBreakdown(input) {
  const rank = getRank(input.rankId);
  const childAmount = allowances.childAllowance * input.childCount;
  const isFire = input.org === "fire";
  const shift = getShiftPattern(input.shiftPatternId);

  const items = [
    { name: "직급보조비", amount: jobGradeSupport[rank.equiv] || 0, condition: `${rank.equiv} 상당`, applied: true },
    { name: "정액급식비", amount: allowances.mealAllowance, condition: "전 공무원 공통", applied: true },
    { name: "위험근무수당", amount: allowances.dangerAllowance, condition: "경찰·소방 공통", applied: true },
    { name: "가족수당 (배우자)", amount: allowances.spouseAllowance, condition: "배우자 등록 시", applied: input.hasSpouse },
    {
      name: "가족수당 (자녀)",
      amount: childAmount,
      condition: input.childCount > 0 ? `자녀 ${input.childCount}명` : "자녀 없음",
      applied: input.childCount > 0,
    },
  ];

  items.push({
    name: "교대근무수당 (추정)",
    amount: shift.monthlyExtra,
    condition: isFire ? shift.label : "소방만 적용",
    applied: isFire && shift.monthlyExtra > 0,
  });

  return items;
}

function calculate(input) {
  const row = getStepRow(input.rankId, input.step);
  const rank = getRank(input.rankId);
  const allowanceItems = getAllowanceBreakdown(input);
  const allowanceSum = allowanceItems.filter((item) => item.applied).reduce((sum, item) => sum + item.amount, 0);

  const grossMonthly = row.monthlyBase + allowanceSum;
  const netRatio = getNetRatio(grossMonthly);
  const monthlyNet = grossMonthly * netRatio;

  const longevityPercent = getLongevityBonusPercent(input.step);
  const holidayBonus = row.monthlyBase * allowances.holidayBonusRate * 2;
  const longevityBonusAnnual = row.monthlyBase * (longevityPercent / 100) * 2;
  const annualExtra = holidayBonus + longevityBonusAnnual;

  const annualGross = grossMonthly * 12 + annualExtra;
  const annualNet = annualGross * netRatio;

  return {
    row,
    rank,
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

function getNearbySteps(rankId, step) {
  const rank = getRank(rankId);
  const result = [];
  for (let s = step - 3; s <= step + 3; s++) {
    if (s < 1 || s > rank.maxStep) continue;
    result.push(getStepRow(rankId, s));
  }
  return result;
}

function renderAllowanceTable(result) {
  const target = $("#pfAllowanceRows");
  if (!target) return;

  target.innerHTML = result.allowanceItems.map((item) => `
    <tr class="${item.applied ? "" : "pf-row--inactive"}">
      <td>${item.name}</td>
      <td>${item.applied ? formatWon(item.amount) : "미적용"}</td>
      <td>${item.condition}</td>
    </tr>
  `).join("");
}

function renderAnnualTable(result) {
  const target = $("#pfAnnualRows");
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
    <tr class="${item.applied ? "" : "pf-row--inactive"}">
      <td>${item.name}</td>
      <td>${item.applied ? formatWon(item.amount) : "미적용"}</td>
      <td>${item.condition}</td>
    </tr>
  `).join("");
}

function renderNearbyTable(rankId, step) {
  const target = $("#pfNearbyRows");
  if (!target) return;

  target.innerHTML = getNearbySteps(rankId, step).map((row) => {
    const result = calculate({ ...state, step: row.step });
    return `
    <tr class="${row.step === step ? "is-selected" : ""}">
      <td><strong>${row.step}호봉</strong></td>
      <td>${formatWon(row.monthlyBase)}</td>
      <td>${formatWon(result.monthlyNet)}</td>
    </tr>
  `;
  }).join("");
}

function clampStep(value, rankId) {
  const max = getRank(rankId || state.rankId).maxStep;
  const n = Math.round(Number(value) || 1);
  return Math.min(max, Math.max(1, n));
}

function clampChildCount(value) {
  const n = Math.round(Number(value) || 0);
  return Math.min(4, Math.max(0, n));
}

function syncInputsFromState() {
  const stepInput = $('[data-pf="step"]');
  const stepRange = $('[data-pf="stepRange"]');
  const childInput = $('[data-pf="childCount"]');
  const spouseInput = $('[data-pf="hasSpouse"]');
  const rankSelect = $('[data-pf="rankId"]');
  const shiftSelect = $('[data-pf="shiftPatternId"]');
  const rank = getRank(state.rankId);

  if (rankSelect) rankSelect.value = state.rankId;
  if (stepInput) {
    stepInput.value = String(state.step);
    stepInput.max = String(rank.maxStep);
  }
  if (stepRange) {
    stepRange.max = String(rank.maxStep);
    stepRange.value = String(state.step);
  }
  if (childInput) childInput.value = String(state.childCount);
  if (spouseInput) spouseInput.checked = Boolean(state.hasSpouse);
  if (shiftSelect) shiftSelect.value = state.shiftPatternId;

  setText("#pfStepHint", `1~${rank.maxStep}호봉`);

  $$(".pf-org-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pfOrg === state.org);
  });

  const shiftField = document.getElementById("pfShiftField");
  if (shiftField) shiftField.classList.toggle("is-hidden", state.org !== "fire");
}

function render() {
  state.step = clampStep(state.step, state.rankId);

  const result = calculate(state);
  const rankLabel = getRankLabel(result.rank, state.org);

  setText("#pfMonthlyNet", formatWon(result.monthlyNet));
  setText("#pfMonthlyBase", formatWon(result.row.monthlyBase));
  setText("#pfAllowanceSum", formatWon(result.allowanceSum));
  setText("#pfAnnualGross", formatWon(result.annualGross));
  setText("#pfAnnualNet", formatWon(result.annualNet));
  setText("#pfRankLabel", rankLabel);
  setText("#pfStepLabel", String(state.step));
  setText(
    "#pfSummaryText",
    `${rankLabel} ${state.step}호봉 기준 월 실수령은 약 ${formatMan(result.monthlyNet)}, 연봉은 약 ${formatMan(result.annualGross)}으로 추정됩니다.`
  );

  renderAllowanceTable(result);
  renderAnnualTable(result);
  renderNearbyTable(state.rankId, state.step);
  syncInputsFromState();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);
  state.step = clampStep(state.step, state.rankId);

  $$(".pf-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const org = params.get("org");
  if (org === "police" || org === "fire") state.org = org;
  const rankId = params.get("rankId");
  if (rankId && ranks.some((r) => r.id === rankId)) state.rankId = rankId;
  const step = params.get("step");
  if (step) state.step = clampStep(step, state.rankId);
  if (params.get("hasSpouse") !== null) state.hasSpouse = params.get("hasSpouse") === "true";
  const childCount = params.get("childCount");
  if (childCount !== null) state.childCount = clampChildCount(childCount);
  const shiftPatternId = params.get("shiftPatternId");
  if (shiftPatternId && shiftPatterns.some((p) => p.id === shiftPatternId)) state.shiftPatternId = shiftPatternId;
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  const stepInput = $('[data-pf="step"]');
  const stepRange = $('[data-pf="stepRange"]');
  const childInput = $('[data-pf="childCount"]');
  const spouseInput = $('[data-pf="hasSpouse"]');
  const rankSelect = $('[data-pf="rankId"]');
  const shiftSelect = $('[data-pf="shiftPatternId"]');

  if (stepInput) {
    stepInput.addEventListener("input", () => {
      state.step = clampStep(stepInput.value, state.rankId);
      render();
    });
  }

  if (stepRange) {
    stepRange.addEventListener("input", () => {
      state.step = clampStep(stepRange.value, state.rankId);
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

  if (rankSelect) {
    rankSelect.addEventListener("change", () => {
      state.rankId = rankSelect.value;
      state.step = clampStep(state.step, state.rankId);
      render();
    });
  }

  if (shiftSelect) {
    shiftSelect.addEventListener("change", () => {
      state.shiftPatternId = shiftSelect.value;
      render();
    });
  }

  $$(".pf-org-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.org = button.dataset.pfOrg;
      render();
    });
  });

  $$(".pf-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.preset));
  });

  const resetBtn = document.getElementById("pfResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, defaultInput);

      $$(".pf-preset-btn").forEach((button, index) => {
        button.classList.toggle("is-active", index === 0);
      });

      render();
    });
  }

  const copyBtn = document.getElementById("pfCopyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.searchParams.set("org", state.org);
      url.searchParams.set("rankId", state.rankId);
      url.searchParams.set("step", String(state.step));
      url.searchParams.set("hasSpouse", String(state.hasSpouse));
      url.searchParams.set("childCount", String(state.childCount));
      url.searchParams.set("shiftPatternId", state.shiftPatternId);
      await navigator.clipboard?.writeText(url.toString());
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = "링크 복사"; }, 1600);
    });
  }

  render();
}

init();
