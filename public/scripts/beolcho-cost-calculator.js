(() => {
  const root = document.querySelector(".bcc-page");
  const dataEl = document.getElementById("bcc-data");
  if (!root || !dataEl) return;

  const DATA = JSON.parse(dataEl.textContent || "{}");
  const presets = DATA.presets || [];
  const addonItems = DATA.addonItems || [];
  const defaultInput = DATA.defaultInput || {};
  let state = { ...defaultInput, addonIds: [...(defaultInput.addonIds || [])] };

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const BASE_UNIT_PRICE = { min: 80_000, max: 120_000 };

  const TERRAIN = {
    flat: { multiplier: 1.0 },
    gentleSlope: { multiplier: 1.15 },
    steepSlope: { multiplier: 1.35 },
  };

  const ACCESS = {
    nearParking: { multiplier: 1.0 },
    walkNeeded: { multiplier: 1.15 },
    hardAccess: { multiplier: 1.35 },
  };

  const AREA = {
    under10: { surchargeMin: -15_000, surchargeMax: -10_000 },
    size11to20: { surchargeMin: 0, surchargeMax: 0 },
    size21to30: { surchargeMin: 30_000, surchargeMax: 50_000 },
    size31to50: { surchargeMin: 60_000, surchargeMax: 100_000 },
    over50: { surchargeMin: 0, surchargeMax: 0, requiresQuote: true },
    unsure: { surchargeMin: 0, surchargeMax: 0, requiresQuote: true },
  };

  const ADDITIONAL_GRAVE_SAME = { min: 40_000, max: 70_000 };

  const DISTANCE = {
    sameArea: { min: 0, max: 0 },
    adjacentArea: { min: 10_000, max: 20_000 },
    longDistance: { min: 20_000, max: 50_000 },
    unsure: { min: 0, max: 0 },
  };

  const TIMING = {
    offPeak: { rateMin: 0, rateMax: 0 },
    fourWeeksPlus: { rateMin: 0, rateMax: 5 },
    twoToFourWeeks: { rateMin: 10, rateMax: 15 },
    withinTwoWeeks: { rateMin: 15, rateMax: 25 },
  };

  const DEBRIS = {
    onSiteTidy: { min: 0, max: 0 },
    pileUp: { min: 0, max: 10_000 },
    haulAway: { min: 20_000, max: 80_000 },
  };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }

  function won(value) {
    return `${Math.round(value || 0).toLocaleString("ko-KR")}원`;
  }

  function wonSigned(value) {
    const rounded = Math.round(value || 0);
    if (rounded === 0) return "0원";
    return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
  }

  function calculate() {
    const terrain = TERRAIN[state.terrain] || TERRAIN.flat;
    const access = ACCESS[state.access] || ACCESS.nearParking;
    const firstGraveMin = Math.round(BASE_UNIT_PRICE.min * terrain.multiplier * access.multiplier);
    const firstGraveMax = Math.round(BASE_UNIT_PRICE.max * terrain.multiplier * access.multiplier);

    let graveSubtotalMin, graveSubtotalMax;
    if (state.siteGrouping === "separate") {
      graveSubtotalMin = firstGraveMin * state.graveCount;
      graveSubtotalMax = firstGraveMax * state.graveCount;
    } else {
      const additionalCount = Math.max(state.graveCount - 1, 0);
      graveSubtotalMin = firstGraveMin + additionalCount * ADDITIONAL_GRAVE_SAME.min;
      graveSubtotalMax = firstGraveMax + additionalCount * ADDITIONAL_GRAVE_SAME.max;
    }

    const area = AREA[state.areaBand] || AREA.size11to20;
    const distance = DISTANCE[state.distanceBand] || DISTANCE.sameArea;
    const debris = DEBRIS[state.debrisHandling] || DEBRIS.onSiteTidy;

    const selectedAddons = addonItems.filter((a) => state.addonIds.includes(a.id));
    const addonMin = selectedAddons.reduce((s, a) => s + a.minAmount, 0);
    const addonMax = selectedAddons.reduce((s, a) => s + a.maxAmount, 0);

    const subtotalMin = Math.max(graveSubtotalMin + area.surchargeMin + distance.min + debris.min + addonMin, 0);
    const subtotalMax = graveSubtotalMax + area.surchargeMax + distance.max + debris.max + addonMax;

    const timing = TIMING[state.timing] || TIMING.offPeak;
    const timingSurchargeMin = Math.round((subtotalMin * timing.rateMin) / 100);
    const timingSurchargeMax = Math.round((subtotalMax * timing.rateMax) / 100);

    const totalMin = subtotalMin + timingSurchargeMin;
    const totalMax = subtotalMax + timingSurchargeMax;
    const representative = Math.round((totalMin + totalMax) / 2 / 10_000) * 10_000;

    return {
      graveSubtotalMin, graveSubtotalMax,
      areaSurchargeMin: area.surchargeMin, areaSurchargeMax: area.surchargeMax,
      distanceMin: distance.min, distanceMax: distance.max,
      debrisMin: debris.min, debrisMax: debris.max,
      addonMin, addonMax,
      timingSurchargeMin, timingSurchargeMax,
      totalMin, totalMax, representative,
      perGraveAvgMin: Math.round(totalMin / state.graveCount),
      perGraveAvgMax: Math.round(totalMax / state.graveCount),
      requiresAreaQuote: Boolean(area.requiresQuote),
    };
  }

  function setText(selector, value) {
    const el = $(selector);
    if (el) el.textContent = value;
  }

  function readInputs() {
    state.graveCount = Math.min(Math.max(num($('[data-bcc-input="graveCount"]')?.value, state.graveCount), 1), 20);
    state.siteGrouping = $('[data-bcc-input="siteGrouping"]')?.value || state.siteGrouping;
    const terrainInput = $('input[name="bcc-terrain"]:checked');
    if (terrainInput) state.terrain = terrainInput.value;
    const accessInput = $('input[name="bcc-access"]:checked');
    if (accessInput) state.access = accessInput.value;
    state.areaBand = $('[data-bcc-input="areaBand"]')?.value || state.areaBand;
    state.distanceBand = $('[data-bcc-input="distanceBand"]')?.value || state.distanceBand;
    state.timing = $('[data-bcc-input="timing"]')?.value || state.timing;
    state.debrisHandling = $('[data-bcc-input="debrisHandling"]')?.value || state.debrisHandling;
    state.addonIds = $$("[data-bcc-addon]").filter((el) => el.checked).map((el) => el.dataset.bccAddon);
  }

  function syncInputs() {
    const graveInput = $('[data-bcc-input="graveCount"]');
    if (graveInput && document.activeElement !== graveInput) graveInput.value = state.graveCount;
    const sel = (name) => $(`[data-bcc-input="${name}"]`);
    if (sel("siteGrouping")) sel("siteGrouping").value = state.siteGrouping;
    if (sel("areaBand")) sel("areaBand").value = state.areaBand;
    if (sel("distanceBand")) sel("distanceBand").value = state.distanceBand;
    if (sel("timing")) sel("timing").value = state.timing;
    if (sel("debrisHandling")) sel("debrisHandling").value = state.debrisHandling;
    $$('input[name="bcc-terrain"]').forEach((el) => { el.checked = el.value === state.terrain; });
    $$('input[name="bcc-access"]').forEach((el) => { el.checked = el.value === state.access; });
    $$("[data-bcc-addon]").forEach((el) => { el.checked = state.addonIds.includes(el.dataset.bccAddon); });
  }

  function render() {
    readInputs();
    const result = calculate();

    const quoteWarning = $("[data-bcc-quote-warning]");
    if (quoteWarning) quoteWarning.hidden = !result.requiresAreaQuote;

    setText('[data-bcc-result="totalMin"]', won(result.totalMin));
    setText('[data-bcc-result="totalMax"]', won(result.totalMax));
    setText('[data-bcc-result="representative"]', won(result.representative));
    setText('[data-bcc-result="perGraveAvgMin"]', won(result.perGraveAvgMin));
    setText('[data-bcc-result="perGraveAvgMax"]', won(result.perGraveAvgMax));
    setText('[data-bcc-result="graveSubtotalMin"]', won(result.graveSubtotalMin));
    setText('[data-bcc-result="graveSubtotalMax"]', won(result.graveSubtotalMax));
    setText('[data-bcc-result="areaSurchargeMin"]', wonSigned(result.areaSurchargeMin));
    setText('[data-bcc-result="areaSurchargeMax"]', wonSigned(result.areaSurchargeMax));
    setText('[data-bcc-result="distanceMin"]', won(result.distanceMin));
    setText('[data-bcc-result="distanceMax"]', won(result.distanceMax));
    setText('[data-bcc-result="debrisMin"]', won(result.debrisMin));
    setText('[data-bcc-result="debrisMax"]', won(result.debrisMax));
    setText('[data-bcc-result="addonMin"]', won(result.addonMin));
    setText('[data-bcc-result="addonMax"]', won(result.addonMax));
    setText('[data-bcc-result="timingSurchargeMin"]', won(result.timingSurchargeMin));
    setText('[data-bcc-result="timingSurchargeMax"]', won(result.timingSurchargeMax));

    $$("[data-bcc-preset]").forEach((button) => {
      const preset = presets.find((item) => item.id === button.dataset.bccPreset);
      const isActive = preset
        && preset.input.graveCount === state.graveCount
        && preset.input.terrain === state.terrain
        && preset.input.access === state.access
        && preset.input.areaBand === state.areaBand
        && preset.input.timing === state.timing;
      button.classList.toggle("is-active", Boolean(isActive));
    });

    syncInputs();
    syncUrl();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    params.set("graves", String(state.graveCount));
    params.set("grouping", state.siteGrouping);
    params.set("terrain", state.terrain);
    params.set("access", state.access);
    params.set("area", state.areaBand);
    params.set("distance", state.distanceBand);
    params.set("timing", state.timing);
    params.set("debris", state.debrisHandling);
    if (state.addonIds.length) params.set("addons", state.addonIds.join(","));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return;
    state.graveCount = num(params.get("graves"), state.graveCount);
    if (params.get("grouping")) state.siteGrouping = params.get("grouping");
    if (params.get("terrain") && TERRAIN[params.get("terrain")]) state.terrain = params.get("terrain");
    if (params.get("access") && ACCESS[params.get("access")]) state.access = params.get("access");
    if (params.get("area") && AREA[params.get("area")]) state.areaBand = params.get("area");
    if (params.get("distance") && DISTANCE[params.get("distance")]) state.distanceBand = params.get("distance");
    if (params.get("timing") && TIMING[params.get("timing")]) state.timing = params.get("timing");
    if (params.get("debris") && DEBRIS[params.get("debris")]) state.debrisHandling = params.get("debris");
    const addons = params.get("addons");
    if (addons) state.addonIds = addons.split(",").filter(Boolean);
    syncInputs();
  }

  function bindEvents() {
    $$("[data-bcc-input]").forEach((input) => {
      input.addEventListener("input", render);
      input.addEventListener("change", render);
    });
    $$('input[name="bcc-terrain"]').forEach((input) => input.addEventListener("change", render));
    $$('input[name="bcc-access"]').forEach((input) => input.addEventListener("change", render));
    $$("[data-bcc-addon]").forEach((input) => input.addEventListener("change", render));

    $$("[data-bcc-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets.find((item) => item.id === button.dataset.bccPreset);
        if (!preset) return;
        state = { ...defaultInput, addonIds: [], ...preset.input };
        state.addonIds = [...(preset.input.addonIds || [])];
        syncInputs();
        render();
      });
    });

    document.getElementById("bccResetBtn")?.addEventListener("click", () => {
      state = { ...defaultInput, addonIds: [...(defaultInput.addonIds || [])] };
      syncInputs();
      render();
    });

    document.getElementById("bccCopyBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("bccCopyBtn");
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "링크 복사됨";
          setTimeout(() => {
            btn.textContent = original;
          }, 1600);
        }
      } catch {
        if (btn) btn.textContent = "복사 실패";
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
