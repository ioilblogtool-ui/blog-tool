const configEl = document.getElementById("firstBirthdayPartyCostConfig");
const {
  BIRTHDAY_REGION_OPTIONS = [],
  PARTY_TYPE_PRESETS = [],
  OPTION_COSTS = {},
  DEFAULT_INPUT = {},
} = JSON.parse(configEl?.textContent || "{}");

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  guestCount: $("#fbpcGuestCount"),
  guaranteedCount: $("#fbpcGuaranteedCount"),
  mealPrice: $("#fbpcMealPrice"),
  venuePackageCost: $("#fbpcVenuePackageCost"),
  studioTier: $("#fbpcStudioTier"),
  eventSnapEnabled: $("#fbpcEventSnapEnabled"),
  eventSnapCost: $("#fbpcEventSnapCost"),
  childHanbokTier: $("#fbpcChildHanbokTier"),
  parentHanbokEnabled: $("#fbpcParentHanbokEnabled"),
  parentHanbokCost: $("#fbpcParentHanbokCost"),
  dolTableTier: $("#fbpcDolTableTier"),
  replyGiftUnitPrice: $("#fbpcReplyGiftUnitPrice"),
  replyGiftCount: $("#fbpcReplyGiftCount"),
  hostEventEnabled: $("#fbpcHostEventEnabled"),
  hostEventCost: $("#fbpcHostEventCost"),
  growthVideoEnabled: $("#fbpcGrowthVideoEnabled"),
  growthVideoCost: $("#fbpcGrowthVideoCost"),
  hairMakeupEnabled: $("#fbpcHairMakeupEnabled"),
  hairMakeupCost: $("#fbpcHairMakeupCost"),
  reserveRate: $("#fbpcReserveRate"),
  expectedGiftMoney: $("#fbpcExpectedGiftMoney"),
};

const output = {
  totalCost: $("#fbpcTotalCost"),
  mealTotal: $("#fbpcMealTotal"),
  extraTotal: $("#fbpcExtraTotal"),
  netCost: $("#fbpcNetCost"),
  costPerGuest: $("#fbpcCostPerGuest"),
  billableGuestCount: $("#fbpcBillableGuestCount"),
  interpretation: $("#fbpcInterpretation"),
  warnings: $("#fbpcWarnings"),
  breakdown: $("[data-fbpc-breakdown]"),
  scenarios: $("[data-fbpc-scenarios]"),
};

const resetBtn = $("#fbpcResetButton");
const shareBtn = $("#fbpcShareButton");

let selectedRegion = DEFAULT_INPUT.region || "metro";
let selectedPartyType = DEFAULT_INPUT.partyType || "banquet";
let isRestoring = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const num = (el, fallback = 0) => Number.parseInt(el?.value || fallback, 10) || fallback;
const fmt = (value) => Math.round(value).toLocaleString("ko-KR");
const fmtWon = (value) => `${fmt(value)}원`;
const fmtMan = (value) => {
  const man = Math.round(value / 10000);
  return man >= 100 ? `약 ${fmt(man)}만원` : `${fmt(man)}만원`;
};

function getRegion() {
  return BIRTHDAY_REGION_OPTIONS.find((item) => item.id === selectedRegion) || BIRTHDAY_REGION_OPTIONS[1] || { multiplier: 1, label: "수도권" };
}

function getPreset(type = selectedPartyType) {
  return PARTY_TYPE_PRESETS.find((item) => item.id === type) || PARTY_TYPE_PRESETS[1] || {};
}

function optionValue(group, tier) {
  return OPTION_COSTS[group]?.[tier]?.value || 0;
}

function setActiveButtons() {
  $$("[data-fbpc-region]").forEach((btn) => {
    const isActive = btn.dataset.fbpcRegion === selectedRegion;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  $$("[data-fbpc-party-type]").forEach((btn) => {
    const isActive = btn.dataset.fbpcPartyType === selectedPartyType;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function setInputValue(el, value) {
  if (!el) return;
  el.value = String(value);
}

function applyPreset(type) {
  const preset = getPreset(type);
  selectedPartyType = type;

  setInputValue(fields.guestCount, preset.defaultGuestCount || DEFAULT_INPUT.guestCount);
  setInputValue(fields.guaranteedCount, preset.defaultGuaranteedCount ?? DEFAULT_INPUT.guaranteedCount);
  setInputValue(fields.mealPrice, preset.defaultMealPrice || DEFAULT_INPUT.mealPrice);
  setInputValue(fields.venuePackageCost, preset.defaultVenuePackageCost || DEFAULT_INPUT.venuePackageCost);
  setInputValue(fields.replyGiftUnitPrice, preset.defaultReplyGiftUnitPrice ?? DEFAULT_INPUT.replyGiftUnitPrice);
  setInputValue(fields.replyGiftCount, preset.defaultGuaranteedCount || preset.defaultGuestCount || DEFAULT_INPUT.replyGiftCount);

  if (type === "familyMeal") {
    fields.studioTier.value = "value";
    fields.childHanbokTier.value = "value";
    fields.dolTableTier.value = "value";
    fields.eventSnapEnabled.checked = false;
    fields.hostEventEnabled.checked = false;
    fields.growthVideoEnabled.checked = false;
  } else if (type === "hotelPremium") {
    fields.studioTier.value = "premium";
    fields.childHanbokTier.value = "premium";
    fields.dolTableTier.value = "premium";
    fields.eventSnapEnabled.checked = true;
  } else if (type === "selfPartyRoom") {
    fields.studioTier.value = "value";
    fields.childHanbokTier.value = "standard";
    fields.dolTableTier.value = "value";
    fields.eventSnapEnabled.checked = false;
  } else {
    fields.studioTier.value = "standard";
    fields.childHanbokTier.value = "standard";
    fields.dolTableTier.value = "standard";
    fields.eventSnapEnabled.checked = true;
  }

  setActiveButtons();
  calculateAndRender();
}

function readInput() {
  return {
    region: selectedRegion,
    partyType: selectedPartyType,
    guestCount: clamp(num(fields.guestCount, 1), 1, 300),
    guaranteedCount: clamp(num(fields.guaranteedCount, 0), 0, 300),
    mealPrice: clamp(num(fields.mealPrice, 0), 0, 300000),
    venuePackageCost: clamp(num(fields.venuePackageCost, 0), 0, 5000000),
    studioTier: fields.studioTier.value,
    eventSnapEnabled: fields.eventSnapEnabled.checked,
    eventSnapCost: clamp(num(fields.eventSnapCost, 0), 0, 3000000),
    childHanbokTier: fields.childHanbokTier.value,
    parentHanbokEnabled: fields.parentHanbokEnabled.checked,
    parentHanbokCost: clamp(num(fields.parentHanbokCost, 0), 0, 3000000),
    dolTableTier: fields.dolTableTier.value,
    replyGiftUnitPrice: clamp(num(fields.replyGiftUnitPrice, 0), 0, 50000),
    replyGiftCount: clamp(num(fields.replyGiftCount, 0), 0, 300),
    hostEventEnabled: fields.hostEventEnabled.checked,
    hostEventCost: clamp(num(fields.hostEventCost, 0), 0, 2000000),
    growthVideoEnabled: fields.growthVideoEnabled.checked,
    growthVideoCost: clamp(num(fields.growthVideoCost, 0), 0, 1000000),
    hairMakeupEnabled: fields.hairMakeupEnabled.checked,
    hairMakeupCost: clamp(num(fields.hairMakeupCost, 0), 0, 1000000),
    reserveRate: clamp(num(fields.reserveRate, 0), 0, 20),
    expectedGiftMoney: clamp(num(fields.expectedGiftMoney, 0), 0, 30000000),
  };
}

function calculate(input) {
  const region = getRegion();
  const billableGuestCount = Math.max(input.guestCount, input.guaranteedCount);
  const mealTotal = billableGuestCount * input.mealPrice * region.multiplier;
  const venueTotal = input.venuePackageCost * region.multiplier;
  const studioTotal = optionValue("studio", input.studioTier) + (input.eventSnapEnabled ? input.eventSnapCost : 0);
  const outfitTotal = optionValue("childHanbok", input.childHanbokTier) + (input.parentHanbokEnabled ? input.parentHanbokCost : 0);
  const dolTableTotal = optionValue("dolTable", input.dolTableTier);
  const replyGiftTotal = input.replyGiftUnitPrice * input.replyGiftCount;
  const eventTotal =
    (input.hostEventEnabled ? input.hostEventCost : 0)
    + (input.growthVideoEnabled ? input.growthVideoCost : 0)
    + (input.hairMakeupEnabled ? input.hairMakeupCost : 0);
  const subtotalBeforeReserve = mealTotal + venueTotal + studioTotal + outfitTotal + dolTableTotal + replyGiftTotal + eventTotal;
  const reserveAmount = subtotalBeforeReserve * input.reserveRate / 100;
  const totalCost = subtotalBeforeReserve + reserveAmount;
  const netCost = Math.max(totalCost - input.expectedGiftMoney, 0);
  const costPerGuest = totalCost / Math.max(input.guestCount, 1);
  const extraTotal = totalCost - mealTotal;
  const mealSharePercent = totalCost > 0 ? mealTotal / totalCost * 100 : 0;

  const breakdown = [
    { id: "meal", label: "식대", amount: mealTotal },
    { id: "venue", label: "장소·패키지", amount: venueTotal },
    { id: "studio", label: "촬영", amount: studioTotal },
    { id: "outfit", label: "한복·의상", amount: outfitTotal },
    { id: "dolTable", label: "돌상", amount: dolTableTotal },
    { id: "replyGift", label: "답례품", amount: replyGiftTotal },
    { id: "event", label: "진행비", amount: eventTotal },
    { id: "reserve", label: "예비비", amount: reserveAmount },
  ].map((item) => ({
    ...item,
    sharePercent: totalCost > 0 ? item.amount / totalCost * 100 : 0,
  }));

  const warnings = [];
  if (input.guaranteedCount > input.guestCount) warnings.push("보증 인원이 하객 수보다 커서 식대가 보증 인원 기준으로 계산됩니다.");
  if (mealSharePercent >= 70) warnings.push("식대 비중이 높습니다. 하객 수와 보증 인원 조정이 가장 큰 절약 포인트입니다.");
  if (extraTotal >= 2000000) warnings.push("부대비용이 200만원 이상입니다. 촬영·돌상·한복 옵션을 낮추면 총액을 줄일 수 있습니다.");
  if (input.expectedGiftMoney >= totalCost && totalCost > 0) warnings.push("예상 축의금이 총비용 이상입니다. 축의금은 확정 수입이 아니므로 보수적으로 입력하세요.");

  let interpretation = `${region.label} ${getPreset().label} 기준 예상 총비용은 ${fmtMan(totalCost)}입니다.`;
  if (mealSharePercent >= 70) {
    interpretation += " 식대가 대부분을 차지하므로 보증 인원과 1인 식대 확인이 핵심입니다.";
  } else {
    interpretation += " 식대와 부대 옵션을 함께 조정하면 예산을 더 현실적으로 맞출 수 있습니다.";
  }

  return {
    billableGuestCount,
    mealTotal,
    extraTotal,
    netCost,
    totalCost,
    costPerGuest,
    mealSharePercent,
    breakdown,
    warnings,
    interpretation,
  };
}

function buildScenarioComparison(input) {
  return [
    { id: "familyMeal", label: "소규모", desc: "직계 가족 식사 중심" },
    { id: "banquet", label: "일반", desc: "연회장 표준형" },
    { id: "hotelPremium", label: "프리미엄", desc: "호텔·고급 패키지" },
  ].map((scenario) => {
    const preset = getPreset(scenario.id);
    const scenarioInput = {
      ...input,
      partyType: scenario.id,
      guestCount: preset.defaultGuestCount,
      guaranteedCount: preset.defaultGuaranteedCount,
      mealPrice: preset.defaultMealPrice,
      venuePackageCost: preset.defaultVenuePackageCost,
      replyGiftUnitPrice: preset.defaultReplyGiftUnitPrice,
      replyGiftCount: preset.defaultGuaranteedCount || preset.defaultGuestCount,
      studioTier: scenario.id === "hotelPremium" ? "premium" : scenario.id === "familyMeal" ? "value" : "standard",
      childHanbokTier: scenario.id === "hotelPremium" ? "premium" : scenario.id === "familyMeal" ? "value" : "standard",
      dolTableTier: scenario.id === "hotelPremium" ? "premium" : scenario.id === "familyMeal" ? "value" : "standard",
      eventSnapEnabled: scenario.id !== "familyMeal",
    };
    const result = calculate(scenarioInput);
    return { ...scenario, amount: result.totalCost, diff: result.totalCost - calculate(input).totalCost };
  });
}

function renderBreakdown(items) {
  output.breakdown.innerHTML = items
    .filter((item) => item.amount > 0)
    .map((item) => `
      <div class="fbpc-breakdown-item">
        <div class="fbpc-breakdown-item__head">
          <strong>${item.label}</strong>
          <span>${fmtMan(item.amount)} · ${item.sharePercent.toFixed(1)}%</span>
        </div>
        <div class="fbpc-breakdown-track">
          <span style="width:${Math.min(item.sharePercent, 100).toFixed(1)}%"></span>
        </div>
      </div>
    `).join("");
}

function renderScenarios(items) {
  output.scenarios.innerHTML = items.map((item) => `
    <article class="fbpc-scenario-card${item.id === selectedPartyType ? " is-current" : ""}">
      <p>${item.label}</p>
      <strong>${fmtMan(item.amount)}</strong>
      <span>${item.desc}</span>
      <em>${item.diff === 0 ? "현재 조건" : item.diff > 0 ? `현재보다 +${fmtMan(item.diff)}` : `현재보다 -${fmtMan(Math.abs(item.diff))}`}</em>
    </article>
  `).join("");
}

function render(result, input) {
  output.totalCost.textContent = fmtMan(result.totalCost);
  output.mealTotal.textContent = fmtMan(result.mealTotal);
  output.extraTotal.textContent = fmtMan(result.extraTotal);
  output.netCost.textContent = fmtMan(result.netCost);
  output.costPerGuest.textContent = fmtWon(result.costPerGuest);
  output.billableGuestCount.textContent = `식대 기준 ${result.billableGuestCount}명`;
  output.interpretation.textContent = result.interpretation;

  output.warnings.innerHTML = result.warnings.map((warning) => `<li>${warning}</li>`).join("");
  renderBreakdown(result.breakdown);
  renderScenarios(buildScenarioComparison(input));
}

function saveParams(input) {
  if (isRestoring) return;
  const params = new URLSearchParams();
  params.set("region", input.region);
  params.set("type", input.partyType);
  params.set("guest", input.guestCount);
  params.set("guarantee", input.guaranteedCount);
  params.set("meal", input.mealPrice);
  params.set("venue", input.venuePackageCost);
  params.set("studio", input.studioTier);
  params.set("snap", input.eventSnapEnabled ? "1" : "0");
  params.set("childHanbok", input.childHanbokTier);
  params.set("parentHanbok", input.parentHanbokEnabled ? "1" : "0");
  params.set("dol", input.dolTableTier);
  params.set("giftUnit", input.replyGiftUnitPrice);
  params.set("giftCount", input.replyGiftCount);
  params.set("host", input.hostEventEnabled ? "1" : "0");
  params.set("video", input.growthVideoEnabled ? "1" : "0");
  params.set("makeup", input.hairMakeupEnabled ? "1" : "0");
  params.set("reserve", input.reserveRate);
  params.set("money", input.expectedGiftMoney);
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function calculateAndRender() {
  const input = readInput();
  const result = calculate(input);
  render(result, input);
  saveParams(input);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return;

  isRestoring = true;
  selectedRegion = params.get("region") || selectedRegion;
  selectedPartyType = params.get("type") || selectedPartyType;
  setInputValue(fields.guestCount, params.get("guest") || fields.guestCount.value);
  setInputValue(fields.guaranteedCount, params.get("guarantee") || fields.guaranteedCount.value);
  setInputValue(fields.mealPrice, params.get("meal") || fields.mealPrice.value);
  setInputValue(fields.venuePackageCost, params.get("venue") || fields.venuePackageCost.value);
  fields.studioTier.value = params.get("studio") || fields.studioTier.value;
  fields.eventSnapEnabled.checked = params.get("snap") !== "0";
  fields.childHanbokTier.value = params.get("childHanbok") || fields.childHanbokTier.value;
  fields.parentHanbokEnabled.checked = params.get("parentHanbok") === "1";
  fields.dolTableTier.value = params.get("dol") || fields.dolTableTier.value;
  setInputValue(fields.replyGiftUnitPrice, params.get("giftUnit") || fields.replyGiftUnitPrice.value);
  setInputValue(fields.replyGiftCount, params.get("giftCount") || fields.replyGiftCount.value);
  fields.hostEventEnabled.checked = params.get("host") === "1";
  fields.growthVideoEnabled.checked = params.get("video") === "1";
  fields.hairMakeupEnabled.checked = params.get("makeup") === "1";
  setInputValue(fields.reserveRate, params.get("reserve") || fields.reserveRate.value);
  setInputValue(fields.expectedGiftMoney, params.get("money") || fields.expectedGiftMoney.value);
  setActiveButtons();
  isRestoring = false;
}

function reset() {
  selectedRegion = DEFAULT_INPUT.region;
  applyPreset(DEFAULT_INPUT.partyType);
  fields.eventSnapCost.value = DEFAULT_INPUT.eventSnapCost;
  fields.parentHanbokEnabled.checked = DEFAULT_INPUT.parentHanbokEnabled;
  fields.parentHanbokCost.value = DEFAULT_INPUT.parentHanbokCost;
  fields.hostEventEnabled.checked = DEFAULT_INPUT.hostEventEnabled;
  fields.hostEventCost.value = DEFAULT_INPUT.hostEventCost;
  fields.growthVideoEnabled.checked = DEFAULT_INPUT.growthVideoEnabled;
  fields.growthVideoCost.value = DEFAULT_INPUT.growthVideoCost;
  fields.hairMakeupEnabled.checked = DEFAULT_INPUT.hairMakeupEnabled;
  fields.hairMakeupCost.value = DEFAULT_INPUT.hairMakeupCost;
  fields.reserveRate.value = DEFAULT_INPUT.reserveRate;
  fields.expectedGiftMoney.value = DEFAULT_INPUT.expectedGiftMoney;
  calculateAndRender();
}

async function copyShareUrl() {
  const input = readInput();
  saveParams(input);
  try {
    await navigator.clipboard.writeText(location.href);
    shareBtn.textContent = "링크 복사됨";
    setTimeout(() => { shareBtn.textContent = "링크 복사"; }, 1400);
  } catch {
    window.prompt("아래 링크를 복사하세요.", location.href);
  }
}

function bindEvents() {
  $$("[data-fbpc-region]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRegion = btn.dataset.fbpcRegion;
      setActiveButtons();
      calculateAndRender();
    });
  });

  $$("[data-fbpc-party-type]").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.fbpcPartyType));
  });

  Object.values(fields).forEach((el) => {
    el?.addEventListener("input", calculateAndRender);
    el?.addEventListener("change", calculateAndRender);
  });

  resetBtn?.addEventListener("click", reset);
  shareBtn?.addEventListener("click", copyShareUrl);
}

function init() {
  restoreFromUrl();
  setActiveButtons();
  bindEvents();
  calculateAndRender();
}

document.addEventListener("DOMContentLoaded", init);
