const configEl = document.getElementById("fetalInsuranceCalculatorConfig");
const config = JSON.parse(configEl?.textContent || "{}");

const {
  FI_DEFAULT_STATE,
  FI_WEEK_BANDS,
  FI_PREMIUM_RULES,
  FI_SPECIAL_OPTIONS,
  FI_PLAN_LABELS,
  FI_PAYMENT_TERM_LABELS,
  FI_MATURITY_LABELS,
  FI_GUIDE_TEXT,
} = config;

const fields = {
  week: document.getElementById("fiWeek"),
  maternalAge: document.getElementById("fiMaternalAge"),
  maturityAge: document.getElementById("fiMaturityAge"),
  highRisk: document.getElementById("fiHighRisk"),
  underserved: document.getElementById("fiUnderserved"),
};

const planButtons = Array.from(document.querySelectorAll("[data-fi-plan]"));
const paymentButtons = Array.from(document.querySelectorAll("[data-fi-term]"));
const specialInputs = Array.from(document.querySelectorAll(".fi-special-input"));

const output = {
  subcopy: document.getElementById("fiResultSubcopy"),
  monthlyRange: document.getElementById("fiMonthlyRange"),
  totalRange: document.getElementById("fiTotalRange"),
  status: document.getElementById("fiStatus"),
  monthlyNote: document.getElementById("fiMonthlyNote"),
  totalNote: document.getElementById("fiTotalNote"),
  statusNote: document.getElementById("fiStatusNote"),
  guidePrimary: document.getElementById("fiGuidePrimary"),
  guideSecondary: document.getElementById("fiGuideSecondary"),
  statusBadge: document.getElementById("fiStatusBadge"),
  compareBody: document.getElementById("fiCompareTableBody"),
  interpretation: document.getElementById("fiInterpretation"),
};

const resetBtn = document.getElementById("resetFetalInsuranceBtn");
const copyBtn = document.getElementById("copyFetalInsuranceLinkBtn");
const calcBtn = document.getElementById("fiCalculateBtn");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatManwon(value) {
  const rounded = Math.round(value / 10000);
  return `${rounded.toLocaleString("ko-KR")}만원`;
}

function formatRange(min, max) {
  return `${formatManwon(min)} ~ ${formatManwon(max)}`;
}

function formatMonths(term) {
  if (term === "10y") return 120;
  if (term === "20y") return 240;
  return 360;
}

function resolveAgeBand(age) {
  if (age <= 29) return "20_29";
  if (age <= 34) return "30_34";
  if (age <= 39) return "35_39";
  return "40_45";
}

function resolveWeekBand(week) {
  return FI_WEEK_BANDS.find((item) => week >= item.minWeek && week <= item.maxWeek) || FI_WEEK_BANDS[FI_WEEK_BANDS.length - 1];
}

function getSelectedPlan() {
  return planButtons.find((button) => button.classList.contains("is-active"))?.dataset.fiPlan || FI_DEFAULT_STATE.plan;
}

function getSelectedPaymentTerm() {
  return paymentButtons.find((button) => button.classList.contains("is-active"))?.dataset.fiTerm || FI_DEFAULT_STATE.paymentTerm;
}

function getSelectedSpecialOptions() {
  return specialInputs.filter((input) => input.checked).map((input) => input.value);
}

function readState() {
  return {
    week: clamp(parseInt(fields.week?.value || FI_DEFAULT_STATE.week, 10) || FI_DEFAULT_STATE.week, 4, 32),
    maternalAge: clamp(parseInt(fields.maternalAge?.value || FI_DEFAULT_STATE.maternalAge, 10) || FI_DEFAULT_STATE.maternalAge, 20, 45),
    plan: getSelectedPlan(),
    paymentTerm: getSelectedPaymentTerm(),
    maturityAge: fields.maturityAge?.value || FI_DEFAULT_STATE.maturityAge,
    specialOptions: getSelectedSpecialOptions(),
    highRisk: Boolean(fields.highRisk?.checked),
    underserved: Boolean(fields.underserved?.checked),
  };
}

function findRule(state, plan = state.plan) {
  const ageBand = resolveAgeBand(state.maternalAge);
  const weekBand = resolveWeekBand(state.week);
  return (
    FI_PREMIUM_RULES.find(
      (item) =>
        item.maternalAgeBand === ageBand &&
        item.weekBand === weekBand.key &&
        item.plan === plan &&
        item.paymentTerm === state.paymentTerm &&
        item.maturityAge === state.maturityAge
    ) ||
    FI_PREMIUM_RULES.find((item) => item.plan === plan && item.paymentTerm === state.paymentTerm && item.maturityAge === state.maturityAge)
  );
}

function calcSpecialOptionCost(ids) {
  return ids.reduce((sum, id) => {
    const matched = FI_SPECIAL_OPTIONS.find((item) => item.id === id);
    return sum + (matched ? matched.extraMonthly : 0);
  }, 0);
}

function calculate(state, planOverride) {
  const plan = planOverride || state.plan;
  const rule = findRule(state, plan);
  const weekBand = resolveWeekBand(state.week);
  const extraMonthly = calcSpecialOptionCost(state.specialOptions);

  let monthlyMin = (rule?.monthlyMin || 0) + extraMonthly;
  let monthlyMax = (rule?.monthlyMax || 0) + extraMonthly;

  if (state.highRisk) {
    monthlyMin = Math.round(monthlyMin * 1.08);
    monthlyMax = Math.round(monthlyMax * 1.15);
  }

  const totalMonths = formatMonths(state.paymentTerm);

  return {
    plan,
    totalMonths,
    weekBand,
    monthlyMin,
    monthlyMax,
    totalMin: monthlyMin * totalMonths,
    totalMax: monthlyMax * totalMonths,
    extraMonthly,
  };
}

function buildGuideCards(state, result) {
  const primary = FI_GUIDE_TEXT.status[result.weekBand.status];
  const detail = [];

  if (state.highRisk) detail.push(FI_GUIDE_TEXT.factors.highRisk);
  else detail.push(FI_GUIDE_TEXT.factors.standard);

  if (state.underserved) detail.push(FI_GUIDE_TEXT.factors.underserved);
  else detail.push(`선택한 특약 ${state.specialOptions.length}개 기준으로 월 ${formatManwon(result.extraMonthly)}가 가산됩니다.`);

  return {
    primary,
    secondary: {
      title: "보험료를 읽는 기준",
      body: detail.join(" "),
      tone: state.highRisk || state.underserved ? "warn" : "neutral",
    },
  };
}

function renderCompareTable(state) {
  const plans = ["basic", "standard", "enhanced"];
  output.compareBody.innerHTML = plans
    .map((plan) => {
      const result = calculate(state, plan);
      return `
        <tr>
          <td>${FI_PLAN_LABELS[plan]}</td>
          <td>${formatRange(result.monthlyMin, result.monthlyMax)}</td>
          <td>${formatRange(result.totalMin, result.totalMax)}</td>
          <td>${state.specialOptions.length}개 특약 포함</td>
        </tr>
      `;
    })
    .join("");
}

function renderResult(result, state) {
  const guides = buildGuideCards(state, result);
  output.monthlyRange.textContent = formatRange(result.monthlyMin, result.monthlyMax);
  output.totalRange.textContent = formatRange(result.totalMin, result.totalMax);
  output.status.textContent = result.weekBand.label;
  output.statusBadge.textContent = result.weekBand.status === "safe" ? "적정" : result.weekBand.status === "caution" ? "확인 필요" : "서둘러 확인";
  output.statusBadge.dataset.status = result.weekBand.status;
  output.monthlyNote.textContent = `${FI_PLAN_LABELS[state.plan]} · ${FI_PAYMENT_TERM_LABELS[state.paymentTerm]} · ${FI_MATURITY_LABELS[state.maturityAge]}`;
  output.totalNote.textContent = `${result.totalMonths.toLocaleString("ko-KR")}개월 기준 총 납입 범위`;
  output.statusNote.textContent = `${state.week}주 기준 체크 구간입니다.`;
  output.subcopy.textContent = `현재 기준은 ${FI_PLAN_LABELS[state.plan]} · ${FI_PAYMENT_TERM_LABELS[state.paymentTerm]}, 산모 ${state.maternalAge}세입니다.`;

  output.guidePrimary.className = `fi-guide-card fi-guide-card--${guides.primary.tone}`;
  output.guidePrimary.innerHTML = `<strong>${guides.primary.title}</strong><p>${guides.primary.body}</p>`;
  output.guideSecondary.className = `fi-guide-card fi-guide-card--${guides.secondary.tone}`;
  output.guideSecondary.innerHTML = `<strong>${guides.secondary.title}</strong><p>${guides.secondary.body}</p>`;

  output.interpretation.innerHTML = `
    <p>이 계산기는 특정 보험사 상품 비교가 아니라 주수, 산모 연령, 납입 기간, 만기, 특약 선택 기준의 범위 추정 도구입니다.</p>
    <p>월 보험료 범위는 선택 특약과 고위험 임신 여부를 반영해 계산했고, 총 납입액은 납입 기간 전체 개월 수 기준으로 단순 합산했습니다.</p>
    <p>실제 가입 전에는 중복 보장 여부와 현재 주수에서 꼭 넣어야 할 특약 우선순위를 먼저 확인하는 편이 안전합니다.</p>
  `;
}

function syncUrl(state) {
  const params = new URLSearchParams();
  params.set("week", String(state.week));
  params.set("age", String(state.maternalAge));
  params.set("plan", state.plan);
  params.set("term", state.paymentTerm);
  params.set("maturity", state.maturityAge);
  if (state.highRisk) params.set("highRisk", "1");
  if (state.underserved) params.set("underserved", "1");
  if (state.specialOptions.length > 0) params.set("special", state.specialOptions.join(","));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function setActiveButton(buttons, value, key) {
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset[key] === value);
  });
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  if (params.has("week") && fields.week) fields.week.value = params.get("week");
  if (params.has("age") && fields.maternalAge) fields.maternalAge.value = params.get("age");
  if (params.has("maturity") && fields.maturityAge) fields.maturityAge.value = params.get("maturity");
  if (params.has("highRisk") && fields.highRisk) fields.highRisk.checked = params.get("highRisk") === "1";
  if (params.has("underserved") && fields.underserved) fields.underserved.checked = params.get("underserved") === "1";
  setActiveButton(planButtons, params.get("plan") || FI_DEFAULT_STATE.plan, "fiPlan");
  setActiveButton(paymentButtons, params.get("term") || FI_DEFAULT_STATE.paymentTerm, "fiTerm");

  const selected = new Set((params.get("special") || FI_DEFAULT_STATE.specialOptions.join(",")).split(",").filter(Boolean));
  specialInputs.forEach((input) => {
    input.checked = selected.has(input.value);
  });
}

function render() {
  const state = readState();
  const result = calculate(state);
  renderResult(result, state);
  renderCompareTable(state);
  syncUrl(state);
}

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveButton(planButtons, button.dataset.fiPlan, "fiPlan");
    render();
  });
});

paymentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveButton(paymentButtons, button.dataset.fiTerm, "fiTerm");
    render();
  });
});

Object.values(fields).forEach((field) => {
  if (!field) return;
  field.addEventListener("input", render);
  field.addEventListener("change", render);
});

specialInputs.forEach((input) => input.addEventListener("change", render));
if (calcBtn) calcBtn.addEventListener("click", render);

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (fields.week) fields.week.value = String(FI_DEFAULT_STATE.week);
    if (fields.maternalAge) fields.maternalAge.value = String(FI_DEFAULT_STATE.maternalAge);
    if (fields.maturityAge) fields.maturityAge.value = FI_DEFAULT_STATE.maturityAge;
    if (fields.highRisk) fields.highRisk.checked = FI_DEFAULT_STATE.highRisk;
    if (fields.underserved) fields.underserved.checked = FI_DEFAULT_STATE.underserved;
    setActiveButton(planButtons, FI_DEFAULT_STATE.plan, "fiPlan");
    setActiveButton(paymentButtons, FI_DEFAULT_STATE.paymentTerm, "fiTerm");
    specialInputs.forEach((input) => {
      input.checked = FI_DEFAULT_STATE.specialOptions.includes(input.value);
    });
    render();
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => {
        copyBtn.textContent = "링크 복사";
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  });
}

restoreFromUrl();
render();
