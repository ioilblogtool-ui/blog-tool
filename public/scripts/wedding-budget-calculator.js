const configEl = document.getElementById("weddingBudgetConfig");

if (!configEl) {
  throw new Error("weddingBudgetConfig not found");
}

const config = JSON.parse(configEl.textContent || "{}");
const regionPresets = config.regionPresets || {};
const tierPresets = config.tierPresets || {};
const honeymoonPresets = config.honeymoonPresets || {};
const categoryDefinitions = config.categoryDefinitions || [];
const regionLabels = config.regionLabels || {};
const tierLabels = config.tierLabels || {};
const defaultCategoryOwners = config.defaultCategoryOwners || {};
const defaultRegion = config.defaultRegion || "seoul";
const defaultTier = config.defaultTier || "average";
const defaultHoneymoonPreset = config.defaultHoneymoonPreset || "southeast_asia";

const els = {
  regionSelect: document.getElementById("weddingRegionSelect"),
  tierSelect: document.getElementById("weddingTierSelect"),
  honeymoonPresetSelect: document.getElementById("weddingHoneymoonPresetSelect"),
  guestCountGroomInput: document.getElementById("weddingGuestCountGroomInput"),
  guestCountBrideInput: document.getElementById("weddingGuestCountBrideInput"),
  mealPriceGroomInput: document.getElementById("weddingMealPriceGroomInput"),
  mealPriceBrideInput: document.getElementById("weddingMealPriceBrideInput"),
  shareModeTabs: Array.from(document.querySelectorAll("[data-share-mode]")),
  ratioField: document.getElementById("weddingRatioField"),
  groomShareRatioInput: document.getElementById("weddingGroomShareRatioInput"),
  groomShareRatioLabel: document.getElementById("weddingGroomShareRatioLabel"),
  customItems: document.getElementById("weddingCustomItems"),
  addCustomItemBtn: document.getElementById("weddingAddCustomItemBtn"),
  resetBtn: document.getElementById("resetWeddingBudgetBtn"),
  copyBtn: document.getElementById("copyWeddingBudgetLinkBtn"),
  presetGuideTitle: document.getElementById("weddingPresetGuideTitle"),
  presetGuideText: document.getElementById("weddingPresetGuideText"),
  totalBudget: document.getElementById("weddingTotalBudget"),
  totalBudgetSub: document.getElementById("weddingTotalBudgetSub"),
  hallBudget: document.getElementById("weddingHallBudget"),
  hallBudgetSub: document.getElementById("weddingHallBudgetSub"),
  groomShare: document.getElementById("weddingGroomShare"),
  groomShareSub: document.getElementById("weddingGroomShareSub"),
  brideShare: document.getElementById("weddingBrideShare"),
  brideShareSub: document.getElementById("weddingBrideShareSub"),
  summaryLine: document.getElementById("weddingSummaryLine"),
  mealCostTotal: document.getElementById("weddingMealCostTotal"),
  mealInsight: document.getElementById("weddingMealInsight"),
  mealInsightText: document.getElementById("weddingMealInsightText"),
  tierInsight: document.getElementById("weddingTierInsight"),
  tierInsightText: document.getElementById("weddingTierInsightText"),
  travelInsight: document.getElementById("weddingTravelInsight"),
  travelInsightText: document.getElementById("weddingTravelInsightText"),
  categoryBoard: document.getElementById("weddingCategoryBoard"),
  tierBoard: document.getElementById("weddingTierCompareBoard"),
};

const inputMap = new Map();
Array.from(document.querySelectorAll("[data-category-input]"))
  .forEach((input) => {
    inputMap.set(`${input.dataset.categoryInput}.${input.dataset.itemKey}`, input);
  });

const ownerRows = new Map();
Array.from(document.querySelectorAll("[data-owner-row]"))
  .forEach((row) => ownerRows.set(row.dataset.ownerRow, row));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function encodeState(state) {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeState(raw) {
  try {
    const padding = "=".repeat((4 - (raw.length % 4 || 4)) % 4);
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/") + padding;
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function formatManwon(value) {
  return `${roundOne(value).toLocaleString("ko-KR")}만원`;
}

function formatLarge(value) {
  if (value >= 10000) {
    const eok = value / 10000;
    return `${eok.toFixed(eok >= 10 ? 0 : 1)}억원`;
  }
  return formatManwon(value);
}

function sanitizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

function getDefaultGuestCount(region) {
  if (region === "seoul") {
    return { groom: 110, bride: 105 };
  }
  if (region === "metro") {
    return { groom: 95, bride: 90 };
  }
  return { groom: 85, bride: 80 };
}

function buildHoneymoonItems(honeymoonPreset, multiplier) {
  const base = honeymoonPresets[honeymoonPreset].baseCost * multiplier;
  const ratios = honeymoonPreset === "japan"
    ? { flight: 0.28, hotel: 0.34, localSpend: 0.18, shopping: 0.1, exchange: 0.04, insurance: 0.03, etc: 0.03 }
    : honeymoonPreset === "hawaii"
      ? { flight: 0.37, hotel: 0.4, localSpend: 0.11, shopping: 0.05, exchange: 0.03, insurance: 0.02, etc: 0.02 }
      : honeymoonPreset === "europe"
        ? { flight: 0.36, hotel: 0.4, localSpend: 0.14, shopping: 0.04, exchange: 0.03, insurance: 0.015, etc: 0.015 }
        : honeymoonPreset === "maldives"
          ? { flight: 0.33, hotel: 0.45, localSpend: 0.12, shopping: 0.04, exchange: 0.02, insurance: 0.02, etc: 0.02 }
          : { flight: 0.36, hotel: 0.38, localSpend: 0.14, shopping: 0.05, exchange: 0.03, insurance: 0.02, etc: 0.02 };

  return Object.fromEntries(Object.entries(ratios).map(([key, ratio]) => [key, roundOne(base * ratio)]));
}

function buildPreset(region, tier, honeymoonPreset) {
  const regionBase = regionPresets[region];
  const tierBase = tierPresets[tier];
  const guestCount = getDefaultGuestCount(region);

  return {
    region,
    tier,
    honeymoonPreset,
    guestCountGroom: guestCount.groom,
    guestCountBride: guestCount.bride,
    mealPriceGroom: regionBase.mealPriceBase,
    mealPriceBride: regionBase.mealPriceBase,
    categories: {
      weddingPrep: {
        familyMeeting: 30,
        parentGift: 50,
        weddingBand: tier === "budget" ? 180 : tier === "premium" ? 450 : 300,
        invitationPrint: 30,
        invitationMobile: 5,
        returnGift: tier === "budget" ? 20 : tier === "premium" ? 60 : 40,
        beautyCare: tier === "budget" ? 40 : tier === "premium" ? 120 : 80,
      },
      hall: {
        rental: roundOne(regionBase.hallRentalBase * tierBase.hallMultiplier),
        basicDecor: roundOne(100 * tierBase.hallMultiplier),
        bouquet: 30,
        hanbok: tier === "budget" ? 60 : tier === "premium" ? 160 : 120,
        mainSnap: 70,
        subSnap: tier === "budget" ? 0 : tier === "premium" ? 40 : 25,
        videoPre: tier === "premium" ? 35 : 30,
        videoMain: tier === "budget" ? 0 : 30,
        helper: 25,
        mcTip: 30,
        photoTable: tier === "premium" ? 20 : 15,
        flowerShower: tier === "budget" ? 0 : 10,
        weddingCar: tier === "premium" ? 20 : 15,
        mealBrideSide: 0,
        mealGroomSide: 0,
      },
      sdm: {
        package: roundOne(regionBase.sdmBase * tierBase.sdmMultiplier),
        originalFiles: 30,
        studioSnack: tier === "premium" ? 15 : 10,
        retouch: tier === "premium" ? 30 : 20,
        frame: tier === "premium" ? 30 : 20,
        dressFitting: 10,
        dressUpgrade: tier === "budget" ? 20 : tier === "premium" ? 90 : 50,
        casualDress: tier === "premium" ? 30 : 20,
        secondDress: tier === "premium" ? 50 : 30,
        tuxedoRental: 30,
        earlyStart: tier === "premium" ? 20 : 15,
        hanbokRental: tier === "premium" ? 40 : 30,
      },
      honeymoon: buildHoneymoonItems(honeymoonPreset, tierBase.honeymoonMultiplier),
    },
  };
}

function createDefaultState() {
  const preset = buildPreset(defaultRegion, defaultTier, defaultHoneymoonPreset);
  return {
    region: preset.region,
    tier: preset.tier,
    honeymoonPreset: preset.honeymoonPreset,
    guestCountGroom: preset.guestCountGroom,
    guestCountBride: preset.guestCountBride,
    mealPriceGroom: preset.mealPriceGroom,
    mealPriceBride: preset.mealPriceBride,
    shareMode: "half",
    groomShareRatio: 50,
    categories: clone(preset.categories),
    categoryOwners: clone(defaultCategoryOwners),
    customItems: [],
  };
}

function applyPreset(region, tier, honeymoonPreset) {
  const preset = buildPreset(region, tier, honeymoonPreset);
  state.region = preset.region;
  state.tier = preset.tier;
  state.honeymoonPreset = preset.honeymoonPreset;
  state.guestCountGroom = preset.guestCountGroom;
  state.guestCountBride = preset.guestCountBride;
  state.mealPriceGroom = preset.mealPriceGroom;
  state.mealPriceBride = preset.mealPriceBride;
  state.categories = clone(preset.categories);
}

function collectCustomItems() {
  return Array.from(els.customItems.querySelectorAll(".wedding-custom-item")).map((row) => ({
    id: row.dataset.customId,
    name: row.querySelector("[data-custom-name]").value.trim() || "추가 항목",
    amount: sanitizeNumber(row.querySelector("[data-custom-amount]").value),
  }));
}

function renderCustomItems() {
  const markup = state.customItems.map((item) => `
    <div class="wedding-custom-item" data-custom-id="${item.id}">
      <input type="text" value="${escapeHtml(item.name)}" data-custom-name placeholder="항목명" />
      <div class="wedding-inline-input">
        <input type="number" min="0" step="1" value="${item.amount}" data-custom-amount />
        <em>만원</em>
      </div>
      <button type="button" class="wedding-remove-btn" data-remove-custom="${item.id}">삭제</button>
    </div>
  `).join("");

  els.customItems.innerHTML = markup || '<p class="wedding-empty-copy">플래너·양복·예복 추가비처럼 화면에 없는 항목이 있으면 직접 넣을 수 있습니다.</p>';

  els.customItems.querySelectorAll("[data-custom-name], [data-custom-amount]").forEach((input) => {
    input.addEventListener("input", () => {
      state.customItems = collectCustomItems();
      syncUrl();
      render();
    });
  });

  els.customItems.querySelectorAll("[data-remove-custom]").forEach((button) => {
    button.addEventListener("click", () => {
      state.customItems = state.customItems.filter((item) => item.id !== button.dataset.removeCustom);
      syncUrl();
      render();
    });
  });
}

function getMealTotal() {
  return {
    groom: roundOne(state.guestCountGroom * state.mealPriceGroom),
    bride: roundOne(state.guestCountBride * state.mealPriceBride),
  };
}

function syncAutoItems() {
  const meal = getMealTotal();
  if (state.categories.hall) {
    state.categories.hall.mealGroomSide = meal.groom;
    state.categories.hall.mealBrideSide = meal.bride;
  }
}

function getCategoryTotals() {
  syncAutoItems();
  return categoryDefinitions.map((category) => {
    const items = state.categories[category.key] || {};
    const total = roundOne(Object.values(items).reduce((sum, value) => sum + sanitizeNumber(value), 0));
    return {
      key: category.key,
      label: category.label,
      accent: category.accent,
      total,
    };
  });
}

function getTierTotals(region, honeymoonPreset) {
  return Object.keys(tierLabels).map((tier) => {
    const preset = buildPreset(region, tier, honeymoonPreset);
    const mealTotal = preset.guestCountGroom * preset.mealPriceGroom + preset.guestCountBride * preset.mealPriceBride;
    const categoriesTotal = Object.values(preset.categories).reduce((sum, items) => {
      return sum + Object.values(items).reduce((acc, amount) => acc + sanitizeNumber(amount), 0);
    }, 0);
    return {
      tier,
      total: roundOne(mealTotal + categoriesTotal),
    };
  });
}

function calculate() {
  const categoryTotals = getCategoryTotals();
  const customItemsTotal = state.customItems.reduce((sum, item) => sum + sanitizeNumber(item.amount), 0);
  const categoriesTotal = categoryTotals.reduce((sum, category) => sum + category.total, 0);
  const totalBudget = roundOne(categoriesTotal + customItemsTotal);
  const largest = [...categoryTotals].sort((a, b) => b.total - a.total)[0] || { label: "-", total: 0 };
  const meal = getMealTotal();
  const mealTotal = roundOne(meal.groom + meal.bride);
  const mealShare = totalBudget > 0 ? (mealTotal / totalBudget) * 100 : 0;

  let groomShareAmount = 0;
  let brideShareAmount = 0;
  let shareLabel = "반반 분담";

  if (state.shareMode === "half") {
    groomShareAmount = totalBudget / 2;
    brideShareAmount = totalBudget / 2;
  } else if (state.shareMode === "ratio") {
    groomShareAmount = totalBudget * (state.groomShareRatio / 100);
    brideShareAmount = totalBudget - groomShareAmount;
    shareLabel = `신랑 ${state.groomShareRatio}% · 신부 ${100 - state.groomShareRatio}%`;
  } else {
    categoryTotals.forEach((category) => {
      const owner = state.categoryOwners[category.key];
      if (owner === "groom") {
        groomShareAmount += category.total;
      } else if (owner === "bride") {
        brideShareAmount += category.total;
      } else {
        groomShareAmount += category.total / 2;
        brideShareAmount += category.total / 2;
      }
    });
    groomShareAmount += customItemsTotal / 2;
    brideShareAmount += customItemsTotal / 2;
    shareLabel = "카테고리별 분담";
  }

  return {
    totalBudget,
    categoryTotals,
    largest,
    meal,
    mealTotal,
    mealShare,
    hallTotal: categoryTotals.find((category) => category.key === "hall")?.total || 0,
    groomShareAmount: roundOne(groomShareAmount),
    brideShareAmount: roundOne(brideShareAmount),
    shareLabel,
    tierTotals: getTierTotals(state.region, state.honeymoonPreset),
    customItemsTotal: roundOne(customItemsTotal),
  };
}

function renderCategoryInputs() {
  syncAutoItems();
  categoryDefinitions.forEach((category) => {
    category.items.forEach((item) => {
      const input = inputMap.get(`${category.key}.${item.key}`);
      if (input) {
        input.value = state.categories[category.key]?.[item.key] ?? 0;
        input.readOnly = input.dataset.auto === "true";
      }
    });
  });
}

function renderOwners() {
  ownerRows.forEach((row, categoryKey) => {
    row.hidden = state.shareMode !== "category";
    row.querySelectorAll("[data-owner-value]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.ownerValue === state.categoryOwners[categoryKey]);
    });
  });
}

function renderCategoryBoard(categoryTotals, totalBudget) {
  els.categoryBoard.innerHTML = categoryTotals.map((category) => {
    const share = totalBudget > 0 ? (category.total / totalBudget) * 100 : 0;
    return `
      <article class="wedding-share-card">
        <div class="wedding-share-card__head">
          <strong>${category.label}</strong>
          <span>${formatManwon(category.total)}</span>
        </div>
        <div class="wedding-progress">
          <span class="wedding-progress__fill" style="width:${share}%; background:${category.accent}"></span>
        </div>
        <p>${share.toFixed(1)}% 비중</p>
      </article>
    `;
  }).join("");
}

function renderTierBoard(tierTotals, totalBudget) {
  const currentTierBase = tierTotals.find((item) => item.tier === state.tier)?.total || totalBudget;
  els.tierBoard.innerHTML = tierTotals.map((item) => {
    const diff = roundOne(totalBudget - item.total);
    const diffText = diff === 0
      ? "현재 예산과 기본값이 유사합니다"
      : diff > 0
        ? `${formatManwon(diff)} 높은 편`
        : `${formatManwon(Math.abs(diff))} 낮은 편`;
    return `
      <article class="wedding-tier-card ${item.tier === state.tier ? "is-current" : ""}">
        <p>${tierLabels[item.tier]}</p>
        <strong>${formatLarge(item.total)}</strong>
        <span>${diffText}</span>
        <em>현재 선택 티어 기준 ${Math.round((item.total / Math.max(currentTierBase, 1)) * 100)}%</em>
      </article>
    `;
  }).join("");
}

function render() {
  const result = calculate();
  const honeymoonMeta = honeymoonPresets[state.honeymoonPreset];
  const regionMeta = regionPresets[state.region];

  els.regionSelect.value = state.region;
  els.tierSelect.value = state.tier;
  els.honeymoonPresetSelect.value = state.honeymoonPreset;
  els.guestCountGroomInput.value = state.guestCountGroom;
  els.guestCountBrideInput.value = state.guestCountBride;
  els.mealPriceGroomInput.value = state.mealPriceGroom;
  els.mealPriceBrideInput.value = state.mealPriceBride;
  els.groomShareRatioInput.value = state.groomShareRatio;
  els.groomShareRatioLabel.textContent = `${state.groomShareRatio}%`;
  els.ratioField.hidden = state.shareMode !== "ratio";

  els.shareModeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.shareMode === state.shareMode);
  });

  renderCategoryInputs();
  renderOwners();
  renderCustomItems();

  result.categoryTotals.forEach((category) => {
    const totalEl = document.getElementById(`category-total-${category.key}`);
    if (totalEl) {
      totalEl.textContent = formatManwon(category.total);
    }
  });

  els.presetGuideTitle.textContent = `${regionLabels[state.region]} 기준값`;
  els.presetGuideText.textContent = regionMeta.note;

  els.totalBudget.textContent = formatLarge(result.totalBudget);
  els.totalBudgetSub.textContent = `${regionLabels[state.region]} · ${tierLabels[state.tier]} · ${honeymoonMeta.label}`;
  els.hallBudget.textContent = formatLarge(result.hallTotal);
  els.hallBudgetSub.textContent = `양가 식대 ${formatManwon(result.mealTotal)} 포함`;
  els.groomShare.textContent = formatLarge(result.groomShareAmount);
  els.groomShareSub.textContent = result.shareLabel;
  els.brideShare.textContent = formatLarge(result.brideShareAmount);
  els.brideShareSub.textContent = result.shareLabel;
  els.summaryLine.textContent = `${regionLabels[state.region]} ${tierLabels[state.tier]} 티어와 ${honeymoonMeta.label} 여행 기준으로 계산한 추정 예산입니다.`;
  els.mealCostTotal.textContent = formatManwon(result.mealTotal);
  els.mealInsight.textContent = `양가 식대 합계 ${formatManwon(result.mealTotal)}`;
  els.mealInsightText.textContent = result.mealShare >= 25
    ? "하객 수와 식대 단가 영향이 커서 웨딩홀 총액이 빠르게 증가하는 상태입니다. 식대와 하객 수를 먼저 조정해보세요."
    : "현재 구조에서는 식대보다 스드메나 신혼여행 쪽이 더 큰 변수가 될 수 있습니다.";

  const activeTierBase = result.tierTotals.find((item) => item.tier === state.tier)?.total || 0;
  const tierGap = roundOne(result.totalBudget - activeTierBase);
  els.tierInsight.textContent = tierGap === 0
    ? "현재 예산이 선택 티어 기본값과 비슷합니다"
    : tierGap > 0
      ? `선택 티어보다 ${formatManwon(tierGap)} 높습니다`
      : `선택 티어보다 ${formatManwon(Math.abs(tierGap))} 낮습니다`;
  els.tierInsightText.textContent = "기본값은 중간 시장가 기준이므로, 실제 계약 옵션을 더할수록 프리미엄 티어에 가까워질 수 있습니다.";

  els.travelInsight.textContent = `${honeymoonMeta.label} 여행 · ${honeymoonMeta.days}일 기준`;
  els.travelInsightText.textContent = `${honeymoonMeta.label} 기본 총액을 ${tierLabels[state.tier]} 티어 배수로 조정해 항공과 숙박 비중을 자동 배분합니다.`;

  renderCategoryBoard(result.categoryTotals, result.totalBudget);
  renderTierBoard(result.tierTotals, result.totalBudget);
}

function syncUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("state", encodeState(state));
  window.history.replaceState({}, "", url);
}

function restoreFromUrl() {
  const url = new URL(window.location.href);
  const raw = url.searchParams.get("state");
  if (!raw) {
    return createDefaultState();
  }

  const parsed = decodeState(raw);
  if (!parsed) {
    return createDefaultState();
  }

  const next = createDefaultState();
  next.region = parsed.region && regionPresets[parsed.region] ? parsed.region : next.region;
  next.tier = parsed.tier && tierPresets[parsed.tier] ? parsed.tier : next.tier;
  next.honeymoonPreset = parsed.honeymoonPreset && honeymoonPresets[parsed.honeymoonPreset]
    ? parsed.honeymoonPreset
    : next.honeymoonPreset;

  const preset = buildPreset(next.region, next.tier, next.honeymoonPreset);
  next.region = preset.region;
  next.tier = preset.tier;
  next.honeymoonPreset = preset.honeymoonPreset;
  next.guestCountGroom = preset.guestCountGroom;
  next.guestCountBride = preset.guestCountBride;
  next.mealPriceGroom = preset.mealPriceGroom;
  next.mealPriceBride = preset.mealPriceBride;
  next.categories = clone(preset.categories);

  next.guestCountGroom = sanitizeNumber(parsed.guestCountGroom, next.guestCountGroom);
  next.guestCountBride = sanitizeNumber(parsed.guestCountBride, next.guestCountBride);
  next.mealPriceGroom = sanitizeNumber(parsed.mealPriceGroom, next.mealPriceGroom);
  next.mealPriceBride = sanitizeNumber(parsed.mealPriceBride, next.mealPriceBride);
  next.shareMode = ["half", "ratio", "category"].includes(parsed.shareMode) ? parsed.shareMode : next.shareMode;
  next.groomShareRatio = Math.min(100, Math.max(0, sanitizeNumber(parsed.groomShareRatio, next.groomShareRatio)));
  if (parsed.categories) {
    next.categories = clone(parsed.categories);
  }
  if (parsed.categoryOwners) {
    next.categoryOwners = { ...next.categoryOwners, ...parsed.categoryOwners };
  }
  if (Array.isArray(parsed.customItems)) {
    next.customItems = parsed.customItems.map((item, index) => ({
      id: item.id || `custom-${Date.now()}-${index}`,
      name: item.name || "추가 항목",
      amount: sanitizeNumber(item.amount),
    }));
  }
  return next;
}

let state = restoreFromUrl();

function bindEvents() {
  els.regionSelect.addEventListener("change", () => {
    applyPreset(els.regionSelect.value, els.tierSelect.value, els.honeymoonPresetSelect.value);
    syncUrl();
    render();
  });

  els.tierSelect.addEventListener("change", () => {
    applyPreset(els.regionSelect.value, els.tierSelect.value, els.honeymoonPresetSelect.value);
    syncUrl();
    render();
  });

  els.honeymoonPresetSelect.addEventListener("change", () => {
    applyPreset(els.regionSelect.value, els.tierSelect.value, els.honeymoonPresetSelect.value);
    syncUrl();
    render();
  });

  [
    [els.guestCountGroomInput, "guestCountGroom"],
    [els.guestCountBrideInput, "guestCountBride"],
    [els.mealPriceGroomInput, "mealPriceGroom"],
    [els.mealPriceBrideInput, "mealPriceBride"],
  ].forEach(([input, key]) => {
    input.addEventListener("input", () => {
      state[key] = sanitizeNumber(input.value);
      syncUrl();
      render();
    });
  });

  els.shareModeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.shareMode = tab.dataset.shareMode;
      syncUrl();
      render();
    });
  });

  els.groomShareRatioInput.addEventListener("input", () => {
    state.groomShareRatio = sanitizeNumber(els.groomShareRatioInput.value, 50);
    syncUrl();
    render();
  });

  inputMap.forEach((input, key) => {
    input.addEventListener("input", () => {
      if (input.dataset.auto === "true") {
        return;
      }
      const [categoryKey, itemKey] = key.split(".");
      state.categories[categoryKey][itemKey] = sanitizeNumber(input.value);
      syncUrl();
      render();
    });
  });

  document.querySelectorAll("[data-owner-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.categoryOwners[button.dataset.ownerCategory] = button.dataset.ownerValue;
      syncUrl();
      render();
    });
  });

  els.addCustomItemBtn.addEventListener("click", () => {
    state.customItems.push({ id: `custom-${Date.now()}`, name: "추가 항목", amount: 0 });
    syncUrl();
    render();
  });

  els.resetBtn.addEventListener("click", () => {
    state = createDefaultState();
    syncUrl();
    render();
  });

  els.copyBtn.addEventListener("click", async () => {
    syncUrl();
    try {
      await navigator.clipboard.writeText(window.location.href);
      els.copyBtn.textContent = "링크 복사 완료";
      window.setTimeout(() => {
        els.copyBtn.textContent = "링크 복사";
      }, 1500);
    } catch {
      els.copyBtn.textContent = "복사 실패";
      window.setTimeout(() => {
        els.copyBtn.textContent = "링크 복사";
      }, 1500);
    }
  });
}

bindEvents();
syncUrl();
render();

