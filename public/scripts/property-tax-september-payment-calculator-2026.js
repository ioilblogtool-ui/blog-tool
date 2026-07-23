import { readParam, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".property-tax-september-page");
  const dataEl = document.getElementById("ptsp-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const HOUSING_GENERAL = [
    { min: 0, max: 60_000_000, base: 0, rate: 0.001 },
    { min: 60_000_000, max: 150_000_000, base: 60_000, rate: 0.0015 },
    { min: 150_000_000, max: 300_000_000, base: 195_000, rate: 0.0025 },
    { min: 300_000_000, max: null, base: 570_000, rate: 0.004 },
  ];
  const HOUSING_SPECIAL = [
    { min: 0, max: 60_000_000, base: 0, rate: 0.0005 },
    { min: 60_000_000, max: 150_000_000, base: 30_000, rate: 0.001 },
    { min: 150_000_000, max: 300_000_000, base: 120_000, rate: 0.002 },
    { min: 300_000_000, max: null, base: 420_000, rate: 0.0035 },
  ];
  const LAND_AGGREGATE = [
    { min: 0, max: 50_000_000, base: 0, rate: 0.002 },
    { min: 50_000_000, max: 100_000_000, base: 100_000, rate: 0.003 },
    { min: 100_000_000, max: null, base: 250_000, rate: 0.005 },
  ];
  const LAND_SEPARATE = [
    { min: 0, max: 200_000_000, base: 0, rate: 0.002 },
    { min: 200_000_000, max: 1_000_000_000, base: 400_000, rate: 0.003 },
    { min: 1_000_000_000, max: null, base: 2_800_000, rate: 0.004 },
  ];

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function won(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);
  }

  function calcProgressive(taxBase, brackets) {
    if (taxBase <= 0) return 0;
    const bracket = brackets.find((item) => taxBase > item.min && (item.max === null || taxBase <= item.max));
    if (!bracket) return 0;
    return Math.round(bracket.base + (taxBase - bracket.min) * bracket.rate);
  }

  function calcLand(taxBase, type) {
    if (type === "aggregate") return calcProgressive(taxBase, LAND_AGGREGATE);
    if (type === "separate") return calcProgressive(taxBase, LAND_SEPARATE);
    if (type === "specialHighRate") return Math.round(taxBase * 0.04);
    return Math.round(taxBase * 0.002);
  }

  function readState() {
    const d = cfg.defaultInput;
    return {
      mode: root.dataset.ptspMode || d.mode,
      julyHousingAmount: num($('[data-ptsp-input="julyHousingAmount"]')?.value, d.julyHousingAmount),
      julyInputBasis: $('[data-ptsp-input="julyInputBasis"]')?.value || d.julyInputBasis,
      paidAllInJuly: Boolean($('[data-ptsp-input="paidAllInJuly"]')?.checked),
      includeLandTax: Boolean($('[data-ptsp-input="includeLandTax"]')?.checked),
      landTaxType: $('[data-ptsp-input="landTaxType"]')?.value || d.landTaxType,
      landTaxBase: num($('[data-ptsp-input="landTaxBase"]')?.value, d.landTaxBase),
      housingPublicPrice: num($('[data-ptsp-input="housingPublicPrice"]')?.value, d.housingPublicPrice),
      fairMarketValueRatio: num($('[data-ptsp-input="fairMarketValueRatio"]')?.value, d.fairMarketValueRatio),
      useSingleHomeSpecialRate: Boolean($('[data-ptsp-input="useSingleHomeSpecialRate"]')?.checked),
      localEducationTax: num($('[data-ptsp-input="localEducationTax"]')?.value, d.localEducationTax),
      regionalResourceFacilityTax: num($('[data-ptsp-input="regionalResourceFacilityTax"]')?.value, d.regionalResourceFacilityTax),
      manualHousingTax: num($('[data-ptsp-input="manualHousingTax"]')?.value, d.manualHousingTax),
      manualLandTax: num($('[data-ptsp-input="manualLandTax"]')?.value, d.manualLandTax),
      taxCreditAmount: num($('[data-ptsp-input="taxCreditAmount"]')?.value, d.taxCreditAmount),
    };
  }

  function setInput(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      const el = $(`[data-ptsp-input="${key}"]`);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
      } else {
        el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : value;
      }
    });
  }

  function calc(input) {
    const housingTaxBase = clamp(input.housingPublicPrice, 0, 10_000_000_000) * (clamp(input.fairMarketValueRatio, 1, 100) / 100);
    const annualHousingTax = calcProgressive(housingTaxBase, input.useSingleHomeSpecialRate ? HOUSING_SPECIAL : HOUSING_GENERAL);
    let septemberHousingTax = 0;
    let landPropertyTax = 0;
    let modeLabel = "7월 고지액 기준";
    let estimateLevel = "simple";

    if (input.mode === "july") {
      septemberHousingTax = input.paidAllInJuly ? 0 : input.julyHousingAmount;
      landPropertyTax = input.includeLandTax ? calcLand(input.landTaxBase, input.landTaxType) : 0;
    } else if (input.mode === "house") {
      septemberHousingTax = Math.round(annualHousingTax / 2);
      landPropertyTax = input.includeLandTax ? calcLand(input.landTaxBase, input.landTaxType) : 0;
      modeLabel = "공시가격 기준 추정";
      estimateLevel = "estimated";
    } else if (input.mode === "land") {
      landPropertyTax = calcLand(input.landTaxBase, input.landTaxType);
      modeLabel = "토지 과세표준 기준";
      estimateLevel = "estimated";
    } else {
      septemberHousingTax = input.manualHousingTax;
      landPropertyTax = input.manualLandTax;
      modeLabel = "직접 입력 합산";
      estimateLevel = "manual";
    }

    const extraTax = input.localEducationTax + input.regionalResourceFacilityTax;
    const septemberTotal = Math.max(0, septemberHousingTax + landPropertyTax + extraTax - input.taxCreditAmount);
    return {
      housingTaxBase,
      annualHousingTax,
      septemberHousingTax,
      landPropertyTax,
      extraTax,
      septemberTotal,
      julyComparisonAmount: septemberTotal - input.julyHousingAmount,
      modeLabel,
      estimateLevel,
      insight: buildInsight(input, septemberHousingTax),
    };
  }

  function buildInsight(input, septemberHousingTax) {
    if (input.mode === "july" && input.paidAllInJuly) return "7월에 주택분이 일시부과된 경우 9월 주택분 고지서가 없을 수 있습니다. 토지분이나 다른 부가세목이 있는지는 고지서를 확인해야 합니다.";
    if (input.mode === "july") return `7월 주택분 입력액 기준 9월 주택 2기분은 약 ${won(septemberHousingTax)}으로 예상됩니다. 토지분이 있으면 9월 납부액은 더 커질 수 있습니다.`;
    if (input.mode === "house") return "공시가격 기준 결과는 공정시장가액비율과 세율표를 적용한 추정액입니다. 세부담 상한, 감면, 공동명의, 지방교육세 등은 실제 고지서에서 달라질 수 있습니다.";
    if (input.mode === "land") return "토지분 재산세는 토지 과세 유형 선택이 중요합니다. 종합합산·별도합산·분리과세 구분은 고지서나 지자체 안내를 기준으로 확인하세요.";
    return "직접 입력 모드는 고지서 항목을 예산표처럼 합산합니다. 실제 납부는 위택스·이택스 또는 지방자치단체 고지서 기준으로 확인하세요.";
  }

  function updateVisibility(mode) {
    root.dataset.ptspMode = mode;
    $$("[data-ptsp-group]").forEach((el) => {
      const groups = el.dataset.ptspGroup.split(",");
      if (el.dataset.ptspGroup === "land") {
        el.hidden = false;
        $('[data-ptsp-land-toggle]')?.toggleAttribute("hidden", mode === "land");
        return;
      }
      el.hidden = !groups.includes(mode);
    });
    if (mode === "land") setInput({ includeLandTax: true });
    $$("[data-ptsp-mode]").forEach((button) => button.classList.toggle("is-active", button.dataset.ptspMode === mode));
  }

  function renderBadges(result) {
    const badges = [
      result.estimateLevel === "manual" ? { tone: "info", text: "직접 입력" } : { tone: "warn", text: "추정 · 고지서 확인 필요" },
      { tone: "neutral", text: "납부기간 9월 16일~9월 30일" },
    ];
    if (result.landPropertyTax > 0) badges.push({ tone: "info", text: "토지분 포함" });
    $('[data-ptsp-result="badges"]').innerHTML = badges.map((b) => `<span class="augcalc-badge augcalc-badge--${b.tone}">${b.text}</span>`).join("");
  }

  function renderFormula(input, result) {
    const rows = [];
    if (input.mode === "july") {
      rows.push(["주택 2기분", input.paidAllInJuly ? "7월 일시부과 선택으로 0원" : `${won(input.julyHousingAmount)} × 1 = ${won(result.septemberHousingTax)}`]);
    } else if (input.mode === "house") {
      rows.push(["주택 과세표준", `${won(input.housingPublicPrice)} × ${input.fairMarketValueRatio}% = ${won(result.housingTaxBase)}`]);
      rows.push(["주택 연세액", won(result.annualHousingTax)]);
      rows.push(["9월 주택 2기분", `${won(result.annualHousingTax)} ÷ 2 = ${won(result.septemberHousingTax)}`]);
    } else if (input.mode === "land") {
      rows.push(["토지 과세표준", won(input.landTaxBase)]);
      rows.push(["토지분 재산세", won(result.landPropertyTax)]);
    } else {
      rows.push(["주택 2기분 직접 입력", won(input.manualHousingTax)]);
      rows.push(["토지분 직접 입력", won(input.manualLandTax)]);
    }
    if (result.landPropertyTax > 0 && input.mode !== "land" && input.mode !== "manual") rows.push(["토지분", won(result.landPropertyTax)]);
    if (result.extraTax > 0) rows.push(["지방교육세·지역자원시설세", won(result.extraTax)]);
    if (input.taxCreditAmount > 0) rows.push(["공제", `- ${won(input.taxCreditAmount)}`]);
    rows.push(["9월 예상 납부액", won(result.septemberTotal)]);
    $('[data-ptsp-result="formula"]').innerHTML = rows.map(([label, value]) => `<div class="augcalc-formula__row"><span>${label}</span><strong>${value}</strong></div>`).join("");
  }

  function render() {
    const state = readState();
    updateVisibility(state.mode);
    const result = calc(state);
    $('[data-ptsp-result="modeLabel"]').textContent = result.modeLabel;
    $('[data-ptsp-result="septemberTotal"]').textContent = won(result.septemberTotal);
    $('[data-ptsp-result="septemberHousingTax"]').textContent = won(result.septemberHousingTax);
    $('[data-ptsp-result="landPropertyTax"]').textContent = won(result.landPropertyTax);
    $('[data-ptsp-result="extraTax"]').textContent = won(result.extraTax);
    $('[data-ptsp-result="julyComparisonAmount"]').textContent = won(result.julyComparisonAmount);
    $('[data-ptsp-result="insight"]').textContent = result.insight;
    renderBadges(result);
    renderFormula(state, result);
    writeParams({
      mode: state.mode,
      july: state.julyHousingAmount,
      basis: state.julyInputBasis,
      paidAll: state.paidAllInJuly ? 1 : 0,
      land: state.includeLandTax ? 1 : 0,
      lt: state.landTaxType,
      lb: state.landTaxBase,
      pp: state.housingPublicPrice,
      fmv: state.fairMarketValueRatio,
      single: state.useSingleHomeSpecialRate ? 1 : 0,
      edu: state.localEducationTax,
      res: state.regionalResourceFacilityTax,
      mh: state.manualHousingTax,
      ml: state.manualLandTax,
      credit: state.taxCreditAmount,
    });
  }

  $$("[data-ptsp-input]").forEach((el) => el.addEventListener("input", render));
  $$("[data-ptsp-input]").forEach((el) => el.addEventListener("change", render));
  $$("[data-ptsp-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      updateVisibility(button.dataset.ptspMode);
      render();
    });
  });

  document.getElementById("ptspResetBtn")?.addEventListener("click", () => { window.location.href = window.location.pathname; });
  document.getElementById("ptspCopyBtn")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  });

  function restoreFromUrl() {
    const mode = readParam("mode", "");
    if (!mode) {
      updateVisibility(cfg.defaultInput.mode);
      return;
    }
    updateVisibility(mode);
    setInput({
      julyHousingAmount: num(readParam("july", ""), cfg.defaultInput.julyHousingAmount),
      julyInputBasis: readParam("basis", cfg.defaultInput.julyInputBasis),
      paidAllInJuly: readParam("paidAll", "0") === "1",
      includeLandTax: readParam("land", "0") === "1",
      landTaxType: readParam("lt", cfg.defaultInput.landTaxType),
      landTaxBase: num(readParam("lb", ""), cfg.defaultInput.landTaxBase),
      housingPublicPrice: num(readParam("pp", ""), cfg.defaultInput.housingPublicPrice),
      fairMarketValueRatio: num(readParam("fmv", ""), cfg.defaultInput.fairMarketValueRatio),
      useSingleHomeSpecialRate: readParam("single", "1") === "1",
      localEducationTax: num(readParam("edu", ""), cfg.defaultInput.localEducationTax),
      regionalResourceFacilityTax: num(readParam("res", ""), cfg.defaultInput.regionalResourceFacilityTax),
      manualHousingTax: num(readParam("mh", ""), cfg.defaultInput.manualHousingTax),
      manualLandTax: num(readParam("ml", ""), cfg.defaultInput.manualLandTax),
      taxCreditAmount: num(readParam("credit", ""), cfg.defaultInput.taxCreditAmount),
    });
  }

  restoreFromUrl();
  render();
})();
