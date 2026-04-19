const dataEl = document.getElementById("seoulAptCheonyakCutline2026Data");
const seed = dataEl ? JSON.parse(dataEl.textContent || "{}") : null;

if (!seed) {
  console.warn("Seoul apartment cheonyak cutline report data not available.");
}

const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const areaLabels = {
  under60: "59㎡ 이하",
  eightyFour: "84㎡",
  large: "대형 평형",
};

const state = {
  score: seed?.simulationDefaults?.score || 52,
  areaBand: seed?.simulationDefaults?.areaBand || "eightyFour",
  regionGroup: seed?.simulationDefaults?.regionGroup || "southwest",
  supplyType: seed?.simulationDefaults?.supplyType || "generalScore",
  activeScoreBand: "fifties",
  caseFilter: "all",
};

function clampScore(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(84, Math.max(0, parsed));
}

function readParams() {
  const params = new URLSearchParams(window.location.search);
  const score = params.get("score");
  const area = params.get("area");
  const region = params.get("region");
  const supply = params.get("supply");

  if (score !== null) state.score = clampScore(score);
  if (seed.areaCutlines.some((item) => item.key === area)) state.areaBand = area;
  if (seed.regionCutlines.some((item) => item.key === region)) state.regionGroup = region;
  if (seed.supplyStrategies.some((item) => item.key === supply)) state.supplyType = supply;
}

function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("score", String(state.score));
  params.set("area", state.areaBand);
  params.set("region", state.regionGroup);
  params.set("supply", state.supplyType);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

function getRegion(key) {
  return seed.regionCutlines.find((item) => item.key === key) || seed.regionCutlines[0];
}

function getArea(key) {
  return seed.areaCutlines.find((item) => item.key === key) || seed.areaCutlines[1];
}

function getSupply(key) {
  return seed.supplyStrategies.find((item) => item.key === key) || seed.supplyStrategies[0];
}

function getScoreBand(score) {
  if (score >= 70) return seed.scoreBandStrategies.find((item) => item.key === "seventiesPlus");
  if (score >= 60) return seed.scoreBandStrategies.find((item) => item.key === "sixties");
  if (score >= 50) return seed.scoreBandStrategies.find((item) => item.key === "fifties");
  return seed.scoreBandStrategies.find((item) => item.key === "forties");
}

function getRecommendation() {
  const region = getRegion(state.regionGroup);
  const area = getArea(state.areaBand);
  const supply = getSupply(state.supplyType);
  const scoreBand = getScoreBand(state.score);
  const gap = state.score - region.representativeScore;
  let signal = "매우 어려움";
  if (gap >= 5) signal = "도전권";
  else if (gap >= -4) signal = "공고별 확인 구간";
  else if (gap >= -12) signal = "추첨제·특공 병행 필요";

  return {
    region,
    area,
    supply,
    scoreBand,
    gap,
    signal,
    summary: `${state.score}점은 ${scoreBand.label} 전략에 해당합니다. ${region.label} ${area.label} 조합은 ${signal}으로 보고, ${supply.label} 조건을 모집공고 기준으로 다시 확인하는 것이 좋습니다.`,
  };
}

function renderCaseRows() {
  $$("[data-area]").forEach((row) => {
    const show = state.caseFilter === "all" || row.dataset.area === state.caseFilter;
    row.hidden = !show;
  });
}

function renderScoreBand(key) {
  const strategy = seed.scoreBandStrategies.find((item) => item.key === key) || seed.scoreBandStrategies[1];
  state.activeScoreBand = strategy.key;

  $("sacBandLabel").textContent = strategy.label;
  $("sacBandZone").textContent = strategy.possibleZone;
  $("sacBandStrategy").textContent = strategy.mainStrategy;
  $("sacBandAvoid").textContent = strategy.avoid;
  $("sacBandCta").textContent = strategy.ctaLabel;
  $("sacBandCta").setAttribute("href", strategy.ctaHref);

  $$("[data-score-band]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scoreBand === strategy.key);
  });
}

function renderSimulator() {
  const result = getRecommendation();

  $("sacScoreInput").value = String(state.score);
  $("sacAreaSelect").value = state.areaBand;
  $("sacRegionSelect").value = state.regionGroup;
  $("sacSupplySelect").value = state.supplyType;

  $("sacResultSignal").textContent = result.signal;
  $("sacResultSummary").textContent = result.summary;
  $("sacResultRegion").textContent = `지역 기준 ${result.region.representativeScore}점`;
  $("sacResultArea").textContent = `면적 ${result.area.label}`;
  $("sacResultSupply").textContent = result.supply.label;

  $$("[data-region]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.region === state.regionGroup);
  });

  const bandKey = result.scoreBand?.key || "fifties";
  renderScoreBand(bandKey);
  syncUrl();
}

function bindCaseFilters() {
  $$("[data-case-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.caseFilter = button.dataset.caseFilter || "all";
      $$("[data-case-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderCaseRows();
    });
  });
}

function bindRegionCards() {
  $$("[data-region]").forEach((button) => {
    button.addEventListener("click", () => {
      state.regionGroup = button.dataset.region || state.regionGroup;
      renderSimulator();
    });
  });
}

function bindScoreTabs() {
  $$("[data-score-band]").forEach((button) => {
    button.addEventListener("click", () => {
      renderScoreBand(button.dataset.scoreBand || "fifties");
    });
  });
}

function bindSimulator() {
  $("sacScoreInput")?.addEventListener("input", (event) => {
    state.score = clampScore(event.target.value);
    renderSimulator();
  });
  $("sacAreaSelect")?.addEventListener("change", (event) => {
    state.areaBand = event.target.value;
    renderSimulator();
  });
  $("sacRegionSelect")?.addEventListener("change", (event) => {
    state.regionGroup = event.target.value;
    renderSimulator();
  });
  $("sacSupplySelect")?.addEventListener("change", (event) => {
    state.supplyType = event.target.value;
    renderSimulator();
  });
}

if (seed) {
  readParams();
  bindCaseFilters();
  bindRegionCards();
  bindScoreTabs();
  bindSimulator();
  renderCaseRows();
  renderSimulator();
}
