import { readParam, writeParams } from "./url-state.js";

const configEl = document.getElementById("tpdConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const defaultPreset = config.DEFAULT_PRESET || {};
const presets = config.PRESETS || [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  existingShares: $("#tpd-existing-shares"),
  treasuryShares: $("#tpd-treasury-shares"),
  newShares: $("#tpd-new-shares"),
  investmentAmount: $("#tpd-investment-amount"),
  investmentUnit: $("#tpd-investment-unit"),
  currentPrice: $("#tpd-current-price"),
  ownedShares: $("#tpd-owned-shares"),
  cancelledShares: $("#tpd-cancelled-shares"),
  investorName: $("#tpd-investor-name"),
};

const unitMultipliers = {
  won: 1,
  man: 10_000,
  eok: 100_000_000,
  jo: 1_000_000_000_000,
};

function toNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min = 0) {
  return Math.max(min, toNumber(value));
}

function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function formatWon(value) {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) {
    return `${formatNumber(value / 1_000_000_000_000, 2)}조원`;
  }
  if (abs >= 100_000_000) {
    return `${formatNumber(value / 100_000_000, 1)}억원`;
  }
  return `${formatNumber(value)}원`;
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value)}원`;
}

function formatPercent(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value * 100, digits)}%`;
}

function setResult(key, value) {
  $$(`[data-result="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function getInvestmentAmountWon() {
  const unit = fields.investmentUnit?.value || "won";
  const multiplier = unitMultipliers[unit] || 1;
  return clamp(fields.investmentAmount?.value) * multiplier;
}

function setMoneyDisplayFromWon(won) {
  if (!fields.investmentAmount || !fields.investmentUnit) return;
  if (won >= unitMultipliers.eok && won % unitMultipliers.eok === 0) {
    fields.investmentAmount.value = String(won / unitMultipliers.eok);
    fields.investmentUnit.value = "eok";
    return;
  }
  if (won >= unitMultipliers.man && won % unitMultipliers.man === 0) {
    fields.investmentAmount.value = String(won / unitMultipliers.man);
    fields.investmentUnit.value = "man";
    return;
  }
  fields.investmentAmount.value = String(won);
  fields.investmentUnit.value = "won";
}

function readInputs() {
  const existingShares = clamp(fields.existingShares?.value);
  const treasuryShares = Math.min(clamp(fields.treasuryShares?.value), existingShares);
  const newShares = clamp(fields.newShares?.value);
  const investmentAmount = getInvestmentAmountWon();
  const currentPrice = clamp(fields.currentPrice?.value);
  const ownedShares = clamp(fields.ownedShares?.value);
  const cancelledShares = Math.min(clamp(fields.cancelledShares?.value), treasuryShares);
  const investorName = (fields.investorName?.value || "신규 투자자").trim() || "신규 투자자";

  return {
    existingShares,
    treasuryShares,
    newShares,
    investmentAmount,
    currentPrice,
    ownedShares,
    cancelledShares,
    investorName,
  };
}

function calculate(inputs) {
  const preOutstandingShares = Math.max(0, inputs.existingShares - inputs.treasuryShares);
  const postIssuedShares = Math.max(0, inputs.existingShares + inputs.newShares - inputs.cancelledShares);
  const postTreasuryShares = Math.max(0, inputs.treasuryShares - inputs.cancelledShares);
  const postOutstandingShares = Math.max(0, postIssuedShares - postTreasuryShares);
  const issuePrice = inputs.newShares > 0 ? inputs.investmentAmount / inputs.newShares : NaN;
  const investorOwnershipRate =
    postOutstandingShares > 0 ? inputs.newShares / postOutstandingShares : NaN;
  const existingOwnershipRate =
    postOutstandingShares > 0 ? preOutstandingShares / postOutstandingShares : NaN;
  const dilutionRate = Number.isFinite(existingOwnershipRate) ? 1 - existingOwnershipRate : NaN;
  const breakEvenValueIncreaseRate =
    existingOwnershipRate > 0 ? 1 / existingOwnershipRate - 1 : NaN;
  const preMoneyValuation =
    inputs.currentPrice > 0 && inputs.existingShares > 0
      ? inputs.currentPrice * inputs.existingShares
      : NaN;
  const postMoneyValuation = Number.isFinite(preMoneyValuation)
    ? preMoneyValuation + inputs.investmentAmount
    : NaN;
  const issuePricePreMoneyValuation = Number.isFinite(issuePrice)
    ? issuePrice * inputs.existingShares
    : NaN;
  const issuePricePostMoneyValuation = Number.isFinite(issuePrice)
    ? issuePrice * postIssuedShares
    : NaN;
  const investmentToMarketCapRate =
    Number.isFinite(preMoneyValuation) && preMoneyValuation > 0
      ? inputs.investmentAmount / preMoneyValuation
      : NaN;
  const investorPaperGainRate =
    inputs.currentPrice > 0 && Number.isFinite(issuePrice) && issuePrice > 0
      ? inputs.currentPrice / issuePrice - 1
      : NaN;
  const issueDiscountRate =
    inputs.currentPrice > 0 && Number.isFinite(issuePrice)
      ? (inputs.currentPrice - issuePrice) / inputs.currentPrice
      : NaN;
  const ownershipBefore =
    preOutstandingShares > 0 ? inputs.ownedShares / preOutstandingShares : NaN;
  const ownershipAfter =
    postOutstandingShares > 0 ? inputs.ownedShares / postOutstandingShares : NaN;

  return {
    preOutstandingShares,
    postIssuedShares,
    postTreasuryShares,
    postOutstandingShares,
    issuePrice,
    investorOwnershipRate,
    existingOwnershipRate,
    dilutionRate,
    breakEvenValueIncreaseRate,
    preMoneyValuation,
    postMoneyValuation,
    issuePricePreMoneyValuation,
    issuePricePostMoneyValuation,
    investmentToMarketCapRate,
    investorPaperGainRate,
    issueDiscountRate,
    ownershipBefore,
    ownershipAfter,
  };
}

function formatDiscount(value) {
  if (!Number.isFinite(value)) return "현재 주가 입력 필요";
  if (Math.abs(value) < 0.0001) return "현재가와 거의 동일";
  return value > 0 ? `${formatPercent(value)} 할인` : `${formatPercent(Math.abs(value))} 할증`;
}

function assessDiscount(value) {
  if (!Number.isFinite(value)) return "현재 주가를 입력하면 발행가 적정성 참고 문구가 표시됩니다.";
  if (value < 0) return "현재가보다 높은 가격의 할증 발행입니다.";
  if (value <= 0.03) return "현재가와 유사한 수준입니다.";
  if (value <= 0.1) return "일정 수준 할인 발행입니다.";
  if (value <= 0.2) return "할인 폭이 큰 편입니다.";
  return "기존 주주 희석 부담과 발행 조건 확인이 필요합니다.";
}

function render() {
  const inputs = readInputs();
  const result = calculate(inputs);
  const valid = inputs.existingShares > 0 && inputs.newShares > 0 && inputs.investmentAmount > 0;

  setResult("resultBadge", valid ? "단순 계산" : "입력 필요");
  setResult("dilutionRateHero", valid ? formatPercent(result.investorOwnershipRate) : "-");
  setResult(
    "resultSentence",
    valid
      ? `발표 조건대로 거래가 종결되어 ${inputs.investorName}가 신주 ${formatNumber(inputs.newShares)}주를 취득하면 신규 투자자 지분율은 ${formatPercent(result.investorOwnershipRate)}입니다.`
      : "기존 발행주식 총수, 신주 수, 투자금액을 입력하면 계산합니다.",
  );

  setResult("issuePrice", valid ? formatPrice(result.issuePrice) : "-");
  setResult("investorOwnershipRate", valid ? formatPercent(result.investorOwnershipRate) : "-");
  setResult("dilutionRate", valid ? formatPercent(result.dilutionRate) : "-");
  setResult("breakEvenValueIncreaseRate", valid ? formatPercent(result.breakEvenValueIncreaseRate) : "-");
  setResult("postMoneyShares", valid ? `${formatNumber(result.postIssuedShares)}주` : "-");
  setResult("postOutstandingShares", valid ? `${formatNumber(result.postOutstandingShares)}주` : "-");
  setResult("preMoneyValuation", formatWon(result.preMoneyValuation));
  setResult("postMoneyValuation", formatWon(result.postMoneyValuation));
  setResult("issuePricePreMoneyValuation", formatWon(result.issuePricePreMoneyValuation));
  setResult("issuePricePostMoneyValuation", formatWon(result.issuePricePostMoneyValuation));
  setResult("investmentToMarketCapRate", formatPercent(result.investmentToMarketCapRate));
  setResult("investorPaperGainRate", formatPercent(result.investorPaperGainRate));
  setResult("issueDiscountRate", formatDiscount(result.issueDiscountRate));
  setResult("discountAssessment", assessDiscount(result.issueDiscountRate));
  setResult("ownershipBefore", Number.isFinite(result.ownershipBefore) ? formatPercent(result.ownershipBefore, 6) : "-");
  setResult("ownershipAfter", Number.isFinite(result.ownershipAfter) ? formatPercent(result.ownershipAfter, 6) : "-");

  if (valid && inputs.ownedShares > 0) {
    const shareDrop = result.ownershipBefore - result.ownershipAfter;
    const relativeDrop = result.ownershipBefore > 0 ? shareDrop / result.ownershipBefore : NaN;
    setResult(
      "ownershipComment",
      `${formatNumber(inputs.ownedShares)}주 보유 수량은 그대로지만 회사 전체 유통주식 수가 늘어나 지분율은 상대적으로 ${formatPercent(relativeDrop)} 감소합니다.`,
    );
  } else {
    setResult("ownershipComment", "보유 주식 수를 입력하면 개인 기준 변화가 표시됩니다.");
  }

  writeParams({
    existing: Math.round(inputs.existingShares),
    treasury: Math.round(inputs.treasuryShares),
    new: Math.round(inputs.newShares),
    amount: Math.round(inputs.investmentAmount),
    price: Math.round(inputs.currentPrice),
    owned: inputs.ownedShares,
    cancel: Math.round(inputs.cancelledShares),
    investor: inputs.investorName,
  });
}

function applyPreset(preset) {
  if (!preset) return;
  fields.existingShares.value = preset.existingShares;
  fields.treasuryShares.value = preset.treasuryShares || 0;
  fields.newShares.value = preset.newShares;
  setMoneyDisplayFromWon(preset.investmentAmount);
  fields.currentPrice.value = preset.currentPrice;
  fields.ownedShares.value = preset.ownedShares;
  fields.cancelledShares.value = preset.treasurySharesCancelled;
  fields.investorName.value = preset.investorName;
  render();
}

function hydrateFromUrl() {
  fields.existingShares.value = readParam("existing", defaultPreset.existingShares || 0);
  fields.treasuryShares.value = readParam("treasury", defaultPreset.treasuryShares || 0);
  fields.newShares.value = readParam("new", defaultPreset.newShares || 0);
  const amountWon = toNumber(readParam("amount", defaultPreset.investmentAmount || 0));
  setMoneyDisplayFromWon(amountWon);
  fields.currentPrice.value = readParam("price", defaultPreset.currentPrice || 0);
  fields.ownedShares.value = readParam("owned", defaultPreset.ownedShares || 0);
  fields.cancelledShares.value = readParam("cancel", defaultPreset.treasurySharesCancelled || 0);
  fields.investorName.value = readParam("investor", defaultPreset.investorName || "신규 투자자");
}

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", render);
  field?.addEventListener("change", render);
});

$$(".tpd-preset-chip").forEach((button) => {
  button.addEventListener("click", () => {
    const preset = presets.find((item) => item.id === button.dataset.preset);
    applyPreset(preset);
  });
});

$("#tpdResetBtn")?.addEventListener("click", () => {
  applyPreset(defaultPreset);
});

$("#tpdCopyLinkBtn")?.addEventListener("click", async (event) => {
  render();
  try {
    await navigator.clipboard.writeText(window.location.href);
    event.currentTarget.textContent = "링크 복사됨";
    window.setTimeout(() => {
      event.currentTarget.textContent = "링크 복사";
    }, 1600);
  } catch {
    event.currentTarget.textContent = "복사 실패";
  }
});

hydrateFromUrl();
render();
