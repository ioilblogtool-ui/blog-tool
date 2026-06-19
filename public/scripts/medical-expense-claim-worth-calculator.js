import { readParam, readBool, writeParams } from "/scripts/url-state.js";

// ── 설정 로드 ─────────────────────────────────────────────────────────────────
const CONFIG = JSON.parse(document.getElementById("meccConfig").textContent);
const { generations, nhiRate, nonClaimPeriod, defaults } = CONFIG;

// ── 상태 ──────────────────────────────────────────────────────────────────────
let currentVisitType = defaults.visitType;
let currentGen = defaults.generation;
let hasDiscount = false;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const coveredFeeInput = document.getElementById("coveredFeeInput");
const nonCoveredFeeInput = document.getElementById("nonCoveredFeeInput");
const medicineFeeInput = document.getElementById("medicineFeeInput");
const coveredCoPayRateInput = document.getElementById("coveredCoPayRateInput");
const nonCoveredCoPayRateInput = document.getElementById("nonCoveredCoPayRateInput");
const monthlyPremiumInput = document.getElementById("monthlyPremiumInput");
const discountRateInput = document.getElementById("discountRateInput");
const monthsElapsedInput = document.getElementById("monthsElapsedInput");

const discountToggle = document.getElementById("discountToggle");
const discountFields = document.getElementById("discountFields");
const discountCompareSection = document.getElementById("discountCompareSection");
const kpiWorthCard = document.getElementById("kpiWorthCard");

// ── 유틸 ─────────────────────────────────────────────────────────────────────
function toNum(el) {
  return Math.max(0, parseFloat(el.value) || 0);
}

function fmtWon(n) {
  const abs = Math.abs(n);
  if (abs >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`;
  if (abs >= 10_000) {
    const man = n / 10_000;
    return `${Number.isInteger(man) ? man.toLocaleString() : man.toFixed(1)}만원`;
  }
  return `${Math.round(n).toLocaleString()}원`;
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setHidden(el, flag) {
  if (flag) el.setAttribute("hidden", "");
  else el.removeAttribute("hidden");
}

// ── 세대 탭 ───────────────────────────────────────────────────────────────────
document.querySelectorAll(".mecc-gen-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentGen = btn.dataset.gen;
    document.querySelectorAll(".mecc-gen-btn").forEach((b) =>
      b.setAttribute("aria-pressed", b === btn ? "true" : "false")
    );
    applyGenDefaults();
    render();
  });
});

function applyGenDefaults() {
  const g = generations.find((x) => x.id === currentGen);
  if (!g) return;
  coveredCoPayRateInput.value = Math.round(g.coveredCoPayRate * 100);
  nonCoveredCoPayRateInput.value = Math.round(g.nonCoveredCoPayRate * 100);
  const note = document.getElementById("meccGenNote");
  if (note) note.textContent = g.note;
}

// ── 통원/입원 탭 ──────────────────────────────────────────────────────────────
document.querySelectorAll(".mecc-visit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentVisitType = btn.dataset.visit;
    document.querySelectorAll(".mecc-visit-btn").forEach((b) =>
      b.setAttribute("aria-pressed", b === btn ? "true" : "false")
    );
    render();
  });
});

// ── 무청구 할인 토글 ──────────────────────────────────────────────────────────
discountToggle.addEventListener("click", () => {
  hasDiscount = !hasDiscount;
  discountToggle.setAttribute("aria-pressed", hasDiscount ? "true" : "false");
  discountToggle.textContent = hasDiscount ? "ON" : "OFF";
  discountToggle.classList.toggle("is-active", hasDiscount);
  setHidden(discountFields, !hasDiscount);
  render();
});

// ── 계산 로직 ─────────────────────────────────────────────────────────────────
function compute() {
  const g = generations.find((x) => x.id === currentGen) ?? generations[2];
  const nhiCoveredRate = nhiRate[currentVisitType];

  const coveredFee = toNum(coveredFeeInput);
  const nonCoveredFee = toNum(nonCoveredFeeInput);
  const medicineFee = toNum(medicineFeeInput);
  const coveredCoPayRate = toNum(coveredCoPayRateInput) / 100;
  const nonCoveredCoPayRate = toNum(nonCoveredCoPayRateInput) / 100;
  const outpatientDeductible = currentVisitType === "outpatient" ? g.outpatientDeductible : 0;
  const medicineDeductible = g.medicineDeductible;

  // 급여 환급
  const patientShareCovered = coveredFee * (1 - nhiCoveredRate);
  const afterDeductibleCovered = Math.max(0, patientShareCovered - outpatientDeductible);
  const coveredCoPayAmt = afterDeductibleCovered * coveredCoPayRate;
  const coveredRefund = Math.max(0, afterDeductibleCovered - coveredCoPayAmt);

  // 비급여 환급
  const nonCoveredCoPayAmt = nonCoveredFee * nonCoveredCoPayRate;
  const nonCoveredRefund = Math.max(0, nonCoveredFee - nonCoveredCoPayAmt);

  // 약제비 환급
  const medicineDeductibleAmt = Math.min(medicineFee, medicineDeductible);
  const medicineRefund = Math.max(0, medicineFee - medicineDeductibleAmt);

  const totalRefund = coveredRefund + nonCoveredRefund + medicineRefund;
  const totalFee = coveredFee + nonCoveredFee + medicineFee;
  const selfPay = Math.max(0, totalFee - totalRefund);

  // 무청구 할인 손실
  let discountLoss = 0;
  if (hasDiscount) {
    const monthlyPremium = toNum(monthlyPremiumInput);
    const discountRate = toNum(discountRateInput) / 100;
    const monthsElapsed = Math.min(36, toNum(monthsElapsedInput));
    if (monthsElapsed >= 36) {
      // 이미 할인 받는 중 → 다음 갱신 주기 1년치 손실 추정
      discountLoss = monthlyPremium * discountRate * 12;
    } else {
      const remaining = nonClaimPeriod - monthsElapsed;
      discountLoss = monthlyPremium * discountRate * remaining;
    }
  }

  const claimWorth = totalRefund - discountLoss;

  // 판정
  let verdict;
  if (totalRefund <= 0) {
    verdict = "no_refund";
  } else if (!hasDiscount) {
    verdict = "claim_recommended";
  } else if (claimWorth > 0) {
    verdict = "claim_recommended";
  } else {
    verdict = "skip_recommended";
  }

  return {
    coveredRefund,
    nonCoveredRefund,
    medicineRefund,
    totalRefund,
    selfPay,
    discountLoss,
    claimWorth,
    verdict,
    // 내역용
    patientShareCovered,
    afterDeductibleCovered,
    coveredCoPayAmt,
    outpatientDeductible,
    nonCoveredFee,
    nonCoveredCoPayAmt,
    medicineFee,
    medicineDeductibleAmt,
    gen: g,
  };
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderKpi(r) {
  setText("kpiRefund", fmtWon(r.totalRefund));
  setText("kpiRefundSub", `총 병원비 ${fmtWon(r.selfPay + r.totalRefund)} 중`);
  setText("kpiSelfPay", fmtWon(r.selfPay));

  // 실익 카드 (할인 있을 때만)
  setHidden(kpiWorthCard, !hasDiscount);
  if (hasDiscount) {
    const sign = r.claimWorth >= 0 ? "+" : "";
    setText("kpiWorth", `${sign}${fmtWon(r.claimWorth)}`);
    setText("kpiWorthSub", r.claimWorth >= 0 ? "청구가 이득" : "참는 게 이득");
    document.getElementById("kpiWorth").className =
      r.claimWorth >= 0 ? "mecc-diff-positive" : "mecc-diff-negative";
  }

  // 판정
  const verdictCard = document.getElementById("kpiVerdictCard");
  verdictCard.className = "kpi-card mecc-verdict-card";
  if (r.verdict === "claim_recommended") {
    verdictCard.classList.add("mecc-verdict--recommend");
    setText("kpiVerdict", "청구 권장");
    setText("kpiVerdictSub", "환급 실익 있음");
  } else if (r.verdict === "skip_recommended") {
    verdictCard.classList.add("mecc-verdict--skip");
    setText("kpiVerdict", "청구 비권장");
    setText("kpiVerdictSub", "무청구 할인 유지 유리");
  } else {
    verdictCard.classList.add("mecc-verdict--no-refund");
    setText("kpiVerdict", "환급 없음");
    setText("kpiVerdictSub", "공제 초과 또는 해당 없음");
  }
}

function renderBreakdown(r) {
  // 급여
  const covRows = document.getElementById("breakdownCoveredRows");
  if (covRows) {
    covRows.innerHTML = `
      <div class="mecc-breakdown-row"><span>환자 부담 (공단 제외)</span><span>${fmtWon(r.patientShareCovered)}</span></div>
      ${currentVisitType === "outpatient" ? `<div class="mecc-breakdown-row"><span>통원 공제</span><span>-${fmtWon(r.outpatientDeductible)}</span></div>` : ""}
      <div class="mecc-breakdown-row"><span>자기부담 공제</span><span>-${fmtWon(r.coveredCoPayAmt)}</span></div>
    `;
  }
  setText("coveredRefundAmt", fmtWon(r.coveredRefund));
  // 비급여
  setText("nonCoveredFeeDisp", fmtWon(r.nonCoveredFee));
  setText("nonCoveredCoPayDisp", `-${fmtWon(r.nonCoveredCoPayAmt)}`);
  setText("nonCoveredRefundAmt", fmtWon(r.nonCoveredRefund));
  // 약제비
  setText("medicineFeeDisp", fmtWon(r.medicineFee));
  setText("medicineDeductibleDisp", `-${fmtWon(r.medicineDeductibleAmt)}`);
  setText("medicineRefundAmt", fmtWon(r.medicineRefund));
}

function renderDiscountCompare(r) {
  setHidden(discountCompareSection, !hasDiscount);
  if (!hasDiscount) return;

  setText("dcTotalRefund", `+${fmtWon(r.totalRefund)}`);
  setText("dcDiscountLoss", `-${fmtWon(r.discountLoss)}`);

  const sign = r.claimWorth >= 0 ? "+" : "";
  const worthEl = document.getElementById("dcClaimWorth");
  worthEl.textContent = `${sign}${fmtWon(r.claimWorth)}`;
  worthEl.className = r.claimWorth >= 0 ? "mecc-diff-positive" : "mecc-diff-negative";

  const verdictEl = document.getElementById("dcVerdict");
  if (r.verdict === "claim_recommended") {
    verdictEl.innerHTML = `<span class="mecc-verdict-badge mecc-verdict--recommend">청구 권장</span>`;
    verdictEl.nextElementSibling?.remove();
  } else if (r.verdict === "skip_recommended") {
    verdictEl.innerHTML = `<span class="mecc-verdict-badge mecc-verdict--skip">청구 비권장</span>`;
  } else {
    verdictEl.innerHTML = "";
  }
}

function renderGenInfo(r) {
  const g = r.gen;
  setText("genInfoCoveredCoPayRate", `${Math.round(g.coveredCoPayRate * 100)}%`);
  setText("genInfoNonCoveredCoPayRate", `${Math.round(g.nonCoveredCoPayRate * 100)}%`);
  setText("genInfoOutpatientDeductible", `${g.outpatientDeductible.toLocaleString()}원`);
  setText("genInfoMedicineDeductible", `${g.medicineDeductible.toLocaleString()}원`);
  setText("genInfoNote", g.note);
}

function render() {
  const r = compute();
  renderKpi(r);
  renderBreakdown(r);
  renderDiscountCompare(r);
  renderGenInfo(r);
  writeParams({
    vt: currentVisitType,
    gen: currentGen,
    cf: toNum(coveredFeeInput),
    ncf: toNum(nonCoveredFeeInput),
    med: toNum(medicineFeeInput),
    ccp: toNum(coveredCoPayRateInput),
    nccp: toNum(nonCoveredCoPayRateInput),
    disc: hasDiscount ? 1 : 0,
    prem: toNum(monthlyPremiumInput),
    dr: toNum(discountRateInput),
    mo: toNum(monthsElapsedInput),
  });
}

// ── 이벤트 ────────────────────────────────────────────────────────────────────
document.getElementById("calcMeccBtn").addEventListener("click", render);

document.getElementById("resetMeccBtn")?.addEventListener("click", () => {
  currentVisitType = defaults.visitType;
  currentGen = defaults.generation;
  hasDiscount = false;

  coveredFeeInput.value = defaults.coveredFee;
  nonCoveredFeeInput.value = defaults.nonCoveredFee;
  medicineFeeInput.value = defaults.medicineFee;
  monthlyPremiumInput.value = defaults.monthlyPremium;
  discountRateInput.value = Math.round(defaults.nonClaimDiscountRate * 100);
  monthsElapsedInput.value = defaults.nonClaimMonthsElapsed;

  document.querySelectorAll(".mecc-visit-btn").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.visit === currentVisitType ? "true" : "false")
  );
  document.querySelectorAll(".mecc-gen-btn").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.gen === currentGen ? "true" : "false")
  );
  discountToggle.setAttribute("aria-pressed", "false");
  discountToggle.textContent = "OFF";
  discountToggle.classList.remove("is-active");
  setHidden(discountFields, true);

  applyGenDefaults();
  render();
});

// 입력값 변경 시 즉시 반영
[coveredFeeInput, nonCoveredFeeInput, medicineFeeInput,
 coveredCoPayRateInput, nonCoveredCoPayRateInput,
 monthlyPremiumInput, discountRateInput, monthsElapsedInput].forEach((el) => {
  el.addEventListener("input", render);
});

// ── URL 파라미터 복원 ─────────────────────────────────────────────────────────
(function applyUrlParams() {
  const vt = readParam("vt");
  if (vt === "outpatient" || vt === "inpatient") {
    currentVisitType = vt;
    document.querySelectorAll(".mecc-visit-btn").forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.visit === currentVisitType ? "true" : "false")
    );
  }

  const gen = readParam("gen");
  if (gen && generations.find((x) => x.id === gen)) {
    currentGen = gen;
    document.querySelectorAll(".mecc-gen-btn").forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.gen === currentGen ? "true" : "false")
    );
  }

  const cf = readParam("cf"); if (cf) coveredFeeInput.value = cf;
  const ncf = readParam("ncf"); if (ncf) nonCoveredFeeInput.value = ncf;
  const med = readParam("med"); if (med) medicineFeeInput.value = med;
  const ccp = readParam("ccp"); if (ccp) coveredCoPayRateInput.value = ccp;
  const nccp = readParam("nccp"); if (nccp) nonCoveredCoPayRateInput.value = nccp;

  const disc = readParam("disc");
  if (disc === "1") {
    hasDiscount = true;
    discountToggle.setAttribute("aria-pressed", "true");
    discountToggle.textContent = "ON";
    discountToggle.classList.add("is-active");
    setHidden(discountFields, false);
  }

  const prem = readParam("prem"); if (prem) monthlyPremiumInput.value = prem;
  const dr = readParam("dr"); if (dr) discountRateInput.value = dr;
  const mo = readParam("mo"); if (mo) monthsElapsedInput.value = mo;

  applyGenDefaults();
  render();
})();
