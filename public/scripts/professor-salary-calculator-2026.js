const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("psc-data");

if (!configNode) {
  throw new Error("professor salary calculator config is missing");
}

const { professorTypes, rankRows, rankYears, universityTypes, ranks, presets, defaultInput } = JSON.parse(
  configNode.textContent || "{}"
);

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

const NATIONAL_SPAN_MIN = findRankRow("조교수").nationalMin;
const NATIONAL_SPAN_MAX = findRankRow("석좌교수").nationalMax;
const NATIONAL_SPAN = NATIONAL_SPAN_MAX - NATIONAL_SPAN_MIN;

function findRankRow(rank) {
  return rankRows.find((r) => r.rank === rank) || rankRows[0];
}

function findProfessorType(id) {
  return professorTypes.find((t) => t.id === id) || professorTypes[0];
}

function getRankBand(typeId, rank) {
  const rankRow = findRankRow(rank);

  if (typeId === "national") {
    return { min: rankRow.nationalMin, max: rankRow.nationalMax, sourceKind: "공시 기반" };
  }
  if (typeId === "private_top") {
    return { min: rankRow.privateTopMin, max: rankRow.privateTopMax, sourceKind: "공시 기반" };
  }

  const type = findProfessorType(typeId);
  const typeSpan = type.annualMax - type.annualMin;
  const fracMin = (rankRow.nationalMin - NATIONAL_SPAN_MIN) / NATIONAL_SPAN;
  const fracMax = (rankRow.nationalMax - NATIONAL_SPAN_MIN) / NATIONAL_SPAN;

  return {
    min: Math.round(type.annualMin + fracMin * typeSpan),
    max: Math.round(type.annualMin + fracMax * typeSpan),
    sourceKind: "추정 보간",
  };
}

function estimateFulltimeSalary(typeId, rank, years) {
  const band = getRankBand(typeId, rank);
  const range = rankYears[rank];

  if (!range) {
    return { point: Math.round((band.min + band.max) / 2), band, ratio: 0.5, hasYearsInput: false };
  }

  const ratio = Math.min(Math.max((years - range.min) / (range.max - range.min), 0), 1);
  const point = Math.round(band.min + ratio * (band.max - band.min));
  return { point, band, ratio, hasYearsInput: true };
}

function calcAdjunctPay({ perCredit, creditsPerSemester, semestersPerYear }) {
  const annual = perCredit * creditsPerSemester * semestersPerYear;
  return { annual, monthly: annual / 12 };
}

function man(value) {
  return `${numberFormatter.format(Math.round(value / 10_000))}만 원`;
}

function num(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function syncYearsSlider() {
  const range = rankYears[state.rank];
  const slider = $("#pscYearsSlider");
  const input = $("#pscYearsInput");
  if (!range || !slider || !input) return;

  slider.min = String(range.min);
  slider.max = String(range.max);
  const clamped = Math.min(Math.max(state.years, range.min), range.max);
  state.years = clamped;
  slider.value = String(clamped);
  input.value = String(clamped);
  setText("#pscYearsSliderVal", `${clamped}년차`);
}

function syncModeUI() {
  const isFulltime = state.mode === "fulltime";
  $("#pscFulltimeFields")?.classList.toggle("is-hidden", !isFulltime);
  $("#pscAdjunctFields")?.classList.toggle("is-hidden", isFulltime);
  $("#pscBandCard")?.classList.toggle("is-hidden", !isFulltime);
  $("#pscGaugeWrap")?.classList.toggle("is-hidden", !isFulltime);
  $("#pscCompareSection")?.classList.toggle("is-hidden", !isFulltime);
  $("#pscResearchSection")?.classList.toggle("is-hidden", !isFulltime);

  $("#pscModeFulltimeChip input")?.setAttribute("aria-current", isFulltime ? "true" : "false");
}

function syncRankUI() {
  const hasYears = Boolean(rankYears[state.rank]);
  $("#pscYearsField")?.classList.toggle("is-hidden", !hasYears);
  $("#pscDistinguishedNote")?.classList.toggle("is-hidden", hasYears);

  $$("[data-psc-rank-chip]").forEach((chip) => {
    const radio = chip.querySelector("input");
    if (radio) radio.checked = chip.dataset.pscRankChip === state.rank;
  });
  $$("[data-psc-type-chip]").forEach((chip) => {
    const radio = chip.querySelector("input");
    if (radio) radio.checked = chip.dataset.pscTypeChip === state.typeId;
  });
}

function renderCompareTable() {
  const tbody = $("#pscCompareRows");
  if (!tbody) return;

  tbody.innerHTML = universityTypes
    .map((type) => {
      const band = getRankBand(type.id, state.rank);
      const badgeClass = band.sourceKind === "공시 기반" ? "psc-badge--official" : "psc-badge--estimated";
      const isSelected = type.id === state.typeId;
      return `
        <tr data-psc-compare-row="${type.id}" class="${isSelected ? "is-selected" : ""}">
          <td><strong>${type.label}</strong></td>
          <td>${man(band.min)} ~ ${man(band.max)}</td>
          <td><span class="psc-badge ${badgeClass}">${band.sourceKind}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderFulltime() {
  syncRankUI();
  syncYearsSlider();

  const estimate = estimateFulltimeSalary(state.typeId, state.rank, state.years);
  const typeLabel = findProfessorType(state.typeId)?.name || "";

  setText("#pscResultTitle", `${typeLabel} ${state.rank} 예상 연봉`);
  setText("#pscResultSubtitle", "대학유형·직급·연차를 바꾸면 즉시 다시 계산됩니다.");
  setText("#pscMainLabel", estimate.hasYearsInput ? "예상 연봉 (연차 반영 포인트 추정)" : "예상 연봉 (밴드 중간값)");
  setText("#pscMainValue", man(estimate.point));
  setText("#pscBandValue", `${man(estimate.band.min)} ~ ${man(estimate.band.max)}`);
  setText("#pscSourceKindBadge", estimate.band.sourceKind);

  const fill = $("[data-psc-gauge-fill]");
  if (fill) fill.style.width = `${Math.round(estimate.ratio * 100)}%`;

  renderCompareTable();
}

function renderAdjunct() {
  const result = calcAdjunctPay({
    perCredit: state.perCredit,
    creditsPerSemester: state.creditsPerSemester,
    semestersPerYear: state.semestersPerYear,
  });

  setText("#pscResultTitle", "시간강사 예상 강의료");
  setText("#pscResultSubtitle", "학점당 단가·학점수·학기 수를 바꾸면 즉시 다시 계산됩니다.");
  setText("#pscMainLabel", "예상 연 강의료");
  setText("#pscMainValue", `${man(result.annual)} (월 평균 ${man(result.monthly)})`);
}

function render() {
  syncModeUI();
  if (state.mode === "fulltime") {
    renderFulltime();
  } else {
    renderAdjunct();
  }
  updateUrl();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, defaultInput, preset.input);

  $$(".psc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pscPreset === id);
  });

  const modeRadio = document.querySelector(`input[name="pscMode"][value="${state.mode}"]`);
  if (modeRadio) modeRadio.checked = true;

  render();
}

function updateUrl() {
  const params = new URLSearchParams();
  params.set("mode", state.mode);
  if (state.mode === "fulltime") {
    params.set("type", state.typeId);
    params.set("rank", state.rank);
    params.set("years", String(state.years));
  } else {
    params.set("credit", String(Math.round(state.perCredit)));
    params.set("credits", String(state.creditsPerSemester));
    params.set("sem", String(state.semestersPerYear));
  }
  history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  if (params.get("mode") === "adjunct" || params.get("mode") === "fulltime") state.mode = params.get("mode");
  if (params.has("type") && universityTypes.some((t) => t.id === params.get("type"))) state.typeId = params.get("type");
  if (params.has("rank") && ranks.includes(params.get("rank"))) state.rank = params.get("rank");
  if (params.has("years")) state.years = num(params.get("years"), defaultInput.years);
  if (params.has("credit")) state.perCredit = num(params.get("credit"), defaultInput.perCredit);
  if (params.has("credits")) state.creditsPerSemester = num(params.get("credits"), defaultInput.creditsPerSemester);
  if (params.has("sem")) state.semestersPerYear = num(params.get("sem"), defaultInput.semestersPerYear);
}

function bindEvents() {
  $$('input[name="pscMode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.mode = radio.value;
        render();
      }
    });
  });

  $$('input[name="pscTypeId"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.typeId = radio.value;
        render();
      }
    });
  });

  $$('input[name="pscRank"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.rank = radio.value;
        render();
      }
    });
  });

  $$('input[name="pscSemesters"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.semestersPerYear = num(radio.value, 2);
        render();
      }
    });
  });

  const yearsInput = $("#pscYearsInput");
  const yearsSlider = $("#pscYearsSlider");
  yearsInput?.addEventListener("input", () => {
    state.years = num(yearsInput.value, state.years);
    syncYearsSlider();
    render();
  });
  yearsSlider?.addEventListener("input", () => {
    state.years = num(yearsSlider.value, state.years);
    if (yearsInput) yearsInput.value = String(state.years);
    setText("#pscYearsSliderVal", `${state.years}년차`);
    render();
  });

  const perCreditInput = $("#pscPerCreditInput");
  perCreditInput?.addEventListener("input", () => {
    state.perCredit = num(perCreditInput.value, state.perCredit);
    render();
  });

  const creditsInput = $("#pscCreditsInput");
  const creditsSlider = $("#pscCreditsSlider");
  creditsInput?.addEventListener("input", () => {
    state.creditsPerSemester = num(creditsInput.value, state.creditsPerSemester);
    if (creditsSlider) creditsSlider.value = String(state.creditsPerSemester);
    setText("#pscCreditsSliderVal", `${state.creditsPerSemester}학점`);
    render();
  });
  creditsSlider?.addEventListener("input", () => {
    state.creditsPerSemester = num(creditsSlider.value, state.creditsPerSemester);
    if (creditsInput) creditsInput.value = String(state.creditsPerSemester);
    setText("#pscCreditsSliderVal", `${state.creditsPerSemester}학점`);
    render();
  });

  $$(".psc-preset-btn").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.pscPreset));
  });

  $("#pscResetBtn")?.addEventListener("click", () => {
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, defaultInput);

    $$(".psc-preset-btn").forEach((button, index) => {
      button.classList.toggle("is-active", index === 0);
    });
    const modeRadio = document.querySelector(`input[name="pscMode"][value="${state.mode}"]`);
    if (modeRadio) modeRadio.checked = true;

    const perCreditInputEl = $("#pscPerCreditInput");
    if (perCreditInputEl) perCreditInputEl.value = numberFormatter.format(state.perCredit);
    const creditsInputEl = $("#pscCreditsInput");
    if (creditsInputEl) creditsInputEl.value = String(state.creditsPerSemester);
    const creditsSliderEl = $("#pscCreditsSlider");
    if (creditsSliderEl) creditsSliderEl.value = String(state.creditsPerSemester);

    render();
  });

  $("#pscCopyBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      const btn = $("#pscCopyBtn");
      if (btn) {
        btn.textContent = "링크 복사 완료";
        setTimeout(() => {
          btn.textContent = "링크 복사";
        }, 1600);
      }
    } catch {
      const btn = $("#pscCopyBtn");
      if (btn) btn.textContent = "복사 실패";
    }
  });
}

function init() {
  restoreFromUrl();
  bindEvents();
  render();
}

init();
