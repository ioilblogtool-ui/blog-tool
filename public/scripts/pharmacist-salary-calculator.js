const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const configNode = document.getElementById("pscConfig");

if (!configNode) {
  throw new Error("pharmacist salary calculator config is missing");
}

const { workTypes, careerRows, regionRows, allowances, defaultInput, presets } = JSON.parse(
  configNode.textContent || "{}"
);

const state = { ...defaultInput };
const numberFormatter = new Intl.NumberFormat("ko-KR");

const HOSPITAL_NET_RATIO = 0.78;
const COMMUNITY_NET_RATIO = 0.75;
const OWNER_NET_RATIO = 0.65;

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

function getCareerRow(years) {
  return careerRows.find((c) => c.years === years) || careerRows[0];
}

function getRegionRow(region) {
  return regionRows.find((r) => r.region === region) || regionRows[0];
}

function calculate(input) {
  const workType = getWorkType(input.workTypeId);
  let annualRange;
  let monthlyRange;
  let detailLabel;
  let detailNote;

  if (input.workTypeId === "hospital" || input.workTypeId === "community") {
    const career = getCareerRow(input.career);
    const isHospital = input.workTypeId === "hospital";
    annualRange = isHospital ? [career.hospitalMin, career.hospitalMax] : [career.communityMin, career.communityMax];
    const ratio = isHospital ? HOSPITAL_NET_RATIO : COMMUNITY_NET_RATIO;
    monthlyRange = [Math.round((annualRange[0] / 12) * ratio), Math.round((annualRange[1] / 12) * ratio)];
    detailLabel = career.label;
    detailNote = career.note;
  } else if (input.workTypeId === "owner") {
    const region = getRegionRow(input.region);
    annualRange = [region.avgAnnual, region.avgAnnual];
    monthlyRange = [Math.round((region.avgAnnual / 12) * OWNER_NET_RATIO), Math.round((region.avgAnnual / 12) * OWNER_NET_RATIO)];
    detailLabel = region.region;
    detailNote = `개국 비용 ${region.openingCost}. ${region.note}`;
  } else {
    annualRange = [workType.annualMin, workType.annualMax];
    monthlyRange = [workType.monthlyNetMin, workType.monthlyNetMax];
    detailLabel = workType.badge;
    detailNote = workType.description;
  }

  return { workType, annualRange, monthlyRange, detailLabel, detailNote };
}

function renderAllowanceNotes() {
  const target = $("#pscAllowanceNotes");
  if (!target) return;

  target.innerHTML = allowances
    .map(
      (item) => `
      <li><strong>${item.name}</strong> — ${item.amount} <span>(${item.condition})</span></li>
    `
    )
    .join("");
}

function renderCareerTable(input) {
  const target = $("#pscCareerRows");
  if (!target) return;

  const isRelevant = input.workTypeId === "hospital" || input.workTypeId === "community";

  target.innerHTML = careerRows
    .map((row) => {
      const isSelected = isRelevant && row.years === input.career;
      return `
        <tr class="${isSelected ? "is-selected" : ""}">
          <td><strong>${row.label}</strong></td>
          <td>${formatRangeWon([row.hospitalMin, row.hospitalMax])}</td>
          <td>${formatRangeWon([row.communityMin, row.communityMax])}</td>
        </tr>
      `;
    })
    .join("");
}

function renderRegionTable(input) {
  const target = $("#pscRegionRows");
  if (!target) return;

  const isRelevant = input.workTypeId === "owner";

  target.innerHTML = regionRows
    .map((row) => {
      const isSelected = isRelevant && row.region === input.region;
      return `
        <tr class="${isSelected ? "is-selected" : ""}">
          <td><strong>${row.region}</strong></td>
          <td>${formatMan(row.avgAnnual)}원</td>
          <td>${row.openingCost}</td>
          <td>${row.demandLevel}</td>
        </tr>
      `;
    })
    .join("");
}

function syncInputsFromState() {
  $$(".psc-worktype-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.workType === state.workTypeId);
  });

  const careerField = $("#pscCareerField");
  const regionField = $("#pscRegionField");

  if (careerField) {
    careerField.classList.toggle("is-hidden", !(state.workTypeId === "hospital" || state.workTypeId === "community"));
  }
  if (regionField) {
    regionField.classList.toggle("is-hidden", state.workTypeId !== "owner");
  }

  const careerSelect = $('[data-psc="career"]');
  const regionSelect = $('[data-psc="region"]');

  if (careerSelect) careerSelect.value = state.career;
  if (regionSelect) regionSelect.value = state.region;
}

function render() {
  const result = calculate(state);

  setText("#pscMonthlyValue", formatRangeWon(result.monthlyRange));
  setText("#pscAnnualValue", formatRangeWon(result.annualRange));
  setText("#pscDetailLabel", result.detailLabel);
  setText("#pscDetailNote", result.detailNote || "");
  setText("#pscWorkTypeLabel", result.workType.name);

  setText(
    "#pscSummaryText",
    `${result.workType.name} (${result.detailLabel}) 기준 연봉은 ${formatRangeWon(result.annualRange)}, ${withTopicParticle("월 실수령")} ${formatRangeWon(result.monthlyRange)}으로 추정됩니다.`
  );

  renderCareerTable(state);
  renderRegionTable(state);
  syncInputsFromState();
}

function applyPreset(id) {
  const preset = presets.find((item) => item.id === id);
  if (!preset) return;

  Object.assign(state, preset.input);

  $$(".psc-preset-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === id);
  });

  render();
}

function applyQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const workTypeId = params.get("workTypeId");
  if (workTypeId && workTypes.some((t) => t.id === workTypeId)) state.workTypeId = workTypeId;

  const career = params.get("career");
  if (career && careerRows.some((c) => c.years === career)) state.career = career;

  const region = params.get("region");
  if (region && regionRows.some((r) => r.region === region)) state.region = region;
}

function init() {
  applyQueryParams();
  syncInputsFromState();

  $$(".psc-worktype-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.workTypeId = button.dataset.workType;
      render();
    });
  });

  const careerSelect = $('[data-psc="career"]');
  if (careerSelect) {
    careerSelect.addEventListener("change", () => {
      state.career = careerSelect.value;
      render();
    });
  }

  const regionSelect = $('[data-psc="region"]');
  if (regionSelect) {
    regionSelect.addEventListener("change", () => {
      state.region = regionSelect.value;
      render();
    });
  }

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
      url.searchParams.set("workTypeId", state.workTypeId);
      url.searchParams.set("career", state.career);
      url.searchParams.set("region", state.region);
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
