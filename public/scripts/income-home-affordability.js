// 소득 대비 집값 부담 계산기 — 클라이언트 스크립트
// LTV·취득세·중개보수·월상환 계산 로직은 내집마련 자금 계산기(home-purchase-fund.js)와 동일합니다.
// 모든 수치는 추정값·참고용입니다. 실제 대출 가능액은 금융기관 심사 결과에 따라 달라질 수 있습니다.

// ── 설정 로드 ─────────────────────────────────────────────────────────────────
const configEl = document.getElementById("ihaConfig");
const { PRESETS } = JSON.parse(configEl?.textContent || "{}");

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const incomeSlider  = document.getElementById("ihaIncomeSlider");
const incomeInput   = document.getElementById("ihaIncomeInput");
const incomeLabel   = document.getElementById("ihaIncomeLabel");
const cashSlider    = document.getElementById("ihaCashSlider");
const cashInput     = document.getElementById("ihaCashInput");
const cashLabel     = document.getElementById("ihaCashLabel");
const debtInput     = document.getElementById("ihaDebtInput");
const rateSlider    = document.getElementById("ihaRateSlider");
const rateLabel     = document.getElementById("ihaRateLabel");
const termSelect    = document.getElementById("ihaTerm");
const dsrSelect     = document.getElementById("ihaDsr");

const elAffordablePrice = document.getElementById("iha-affordable-price");
const elMaxLoan          = document.getElementById("iha-max-loan");
const elPir               = document.getElementById("iha-pir");
const elPirBadge          = document.getElementById("iha-pir-badge");
const elMonthlyBurden     = document.getElementById("iha-monthly-burden");
const elMonthlyBurdenNote = document.getElementById("iha-monthly-burden-note");
const elInterpretation    = document.getElementById("iha-interpretation");
const elResultSub         = document.getElementById("iha-result-sub");
const elRegionTbody        = document.getElementById("iha-region-tbody");
const elBreakdown          = document.getElementById("iha-breakdown-tbody");
const elCtaLink             = document.getElementById("iha-cta-link");

const resetBtn   = document.getElementById("resetIhaBtn");
const copyBtn    = document.getElementById("copyIhaLinkBtn");
const presetBtns = document.querySelectorAll(".iha-preset-btn");

// ── 유틸 ──────────────────────────────────────────────────────────────────────
const fmt    = (n) => Math.round(n).toLocaleString("ko-KR");
const fmtWon = (n) => `${fmt(n)}원`;

function fmtBig(n) {
  if (n === 0) return "0원";
  const abs  = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const eok  = Math.floor(abs / 100000000);
  const man  = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

// ── 기준 상수 ─────────────────────────────────────────────────────────────────
const LTV_RATES = {
  overheated:  { none: 50, one: 40, two_plus: 0  },
  regulated:   { none: 70, one: 60, two_plus: 30 },
  unregulated: { none: 70, one: 60, two_plus: 50 },
};

const REGION_LABELS = {
  overheated:  "투기과열지구 + 토허제",
  regulated:   "조정대상지역",
  unregulated: "비규제지역",
};

const STRESS_DSR_ADD_RATE = 1.5; // %p

const PIR_BANDS = [
  { max: 5,        label: "낮음",      tone: "positive" },
  { max: 8,        label: "보통",      tone: "neutral"  },
  { max: 12,       label: "높음",      tone: "warning"  },
  { max: Infinity, label: "매우 높음", tone: "negative" },
];

// ── 계산 함수 (home-purchase-fund.js와 동일) ────────────────────────────────────
function getLTV(regionType, ownershipType) {
  return (LTV_RATES[regionType] || LTV_RATES.regulated)[ownershipType] || 0;
}

function getPolicyLimit(regionType, price) {
  if (regionType === "unregulated") return Infinity;
  if (price <= 1500000000) return 600000000;
  if (price <= 2500000000) return 400000000;
  return 200000000;
}

function calcAcquisitionTax(price, ownershipType, regionType) {
  if (ownershipType === "two_plus") {
    if (regionType !== "unregulated") {
      return price * 0.12 * 1.1;
    }
    return price * 0.08 * 1.1;
  }
  if (ownershipType === "one" && regionType !== "unregulated") {
    return price * 0.08 * 1.1;
  }

  const SIX_EOK  = 600000000;
  const NINE_EOK = 900000000;
  let baseRate;
  if (price <= SIX_EOK) {
    baseRate = 0.01;
  } else if (price <= NINE_EOK) {
    baseRate = 0.01 + ((price - SIX_EOK) / (NINE_EOK - SIX_EOK)) * 0.02;
  } else {
    baseRate = 0.03;
  }
  return price * baseRate * 1.1;
}

function calcBrokerageFee(price) {
  const LIMITS = [
    { max: 50000000,   rate: 0.006, cap: 250000   },
    { max: 200000000,  rate: 0.005, cap: 800000   },
    { max: 900000000,  rate: 0.004, cap: Infinity },
    { max: 1200000000, rate: 0.005, cap: Infinity },
    { max: 1500000000, rate: 0.006, cap: Infinity },
    { max: Infinity,   rate: 0.007, cap: Infinity },
  ];
  for (const bracket of LIMITS) {
    if (price <= bracket.max) {
      return Math.min(price * bracket.rate, bracket.cap);
    }
  }
  return price * 0.007;
}

function calcMonthlyPayment(loan, annualRate, termYears) {
  if (loan <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── 신규 계산 함수 ────────────────────────────────────────────────────────────

// DSR 한도 기준 최대 대출 가능액 (스트레스 DSR 가산)
function calcDsrLoanLimit(income, existingDebtAnnual, dsrRatio, rate, termYears) {
  const annualAvailable = Math.max(income * dsrRatio - existingDebtAnnual, 0);
  if (annualAvailable <= 0) return 0;
  const monthlyAvailable = annualAvailable / 12;
  const r = (rate + STRESS_DSR_ADD_RATE) / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return monthlyAvailable * n;
  return monthlyAvailable * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}

// 적정 매매가 역산 (이분 탐색)
function calcAffordablePrice(dsrLoanLimit, cash, regionType, ownershipType) {
  let lo = 100000000;   // 1억
  let hi = 5000000000;  // 50억
  const ltv = getLTV(regionType, ownershipType);

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const ltvLoan = mid * ltv / 100;
    const policyLimit = getPolicyLimit(regionType, mid);
    const maxLoan = Math.min(dsrLoanLimit, ltvLoan, policyLimit);
    const tax = calcAcquisitionTax(mid, ownershipType, regionType);
    const brokerage = calcBrokerageFee(mid);
    const requiredCash = (mid - maxLoan) + tax + brokerage;

    if (requiredCash <= cash) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function getPirBand(pir) {
  return PIR_BANDS.find((b) => pir < b.max) || PIR_BANDS[PIR_BANDS.length - 1];
}

// ── 입력값 읽기 ───────────────────────────────────────────────────────────────
function getRegionType() {
  const checked = document.querySelector('input[name="ihaRegion"]:checked');
  return checked ? checked.value : "regulated";
}

function getOwnershipType() {
  const checked = document.querySelector('input[name="ihaOwnership"]:checked');
  return checked ? checked.value : "none";
}

// ── 레이블 업데이트 ───────────────────────────────────────────────────────────
function updateIncomeLabel(manVal) {
  if (incomeLabel) incomeLabel.textContent = fmtBig(manVal * 10000);
}

function updateCashLabel(manVal) {
  if (cashLabel) cashLabel.textContent = fmtBig(manVal * 10000);
}

function updateRateLabel(val) {
  if (rateLabel) rateLabel.textContent = `${parseFloat(val).toFixed(1)}%`;
}

function updateAllLabels() {
  updateIncomeLabel(parseFloat(incomeSlider.value));
  updateCashLabel(parseFloat(cashSlider.value));
  updateRateLabel(rateSlider.value);
}

// ── 단일 시나리오 계산 ────────────────────────────────────────────────────────
function calcScenario(income, cash, existingDebtAnnual, regionType, ownershipType, rate, term, dsr) {
  const dsrLoanLimit = calcDsrLoanLimit(income, existingDebtAnnual, dsr, rate, term);
  const price = calcAffordablePrice(dsrLoanLimit, cash, regionType, ownershipType);

  const ltv = getLTV(regionType, ownershipType);
  const ltvLoan = price * ltv / 100;
  const policyLimit = getPolicyLimit(regionType, price);
  const maxLoan = Math.min(dsrLoanLimit, ltvLoan, policyLimit);

  const tax = calcAcquisitionTax(price, ownershipType, regionType);
  const brokerage = calcBrokerageFee(price);
  const selfFund = price - maxLoan;
  const requiredCash = selfFund + tax + brokerage;

  const pir = income > 0 ? price / income : 0;
  const monthly = calcMonthlyPayment(maxLoan, rate, term);
  const monthlyBurden = income > 0 ? (monthly / (income / 12)) * 100 : 0;

  return { price, ltv, maxLoan, tax, brokerage, selfFund, requiredCash, pir, monthly, monthlyBurden, dsrLoanLimit };
}

// ── 메인 계산 함수 ────────────────────────────────────────────────────────────
function calculate() {
  const incomeMan = parseFloat(incomeSlider.value) || 1000;
  const income    = incomeMan * 10000;
  const cashMan   = parseFloat(cashSlider.value) || 0;
  const cash      = cashMan * 10000;
  const debtMan   = parseFloat(debtInput.value) || 0;
  const existingDebtAnnual = debtMan * 10000;
  const rate = parseFloat(rateSlider.value) || 4.0;
  const term = parseInt(termSelect.value, 10) || 30;
  const dsr  = parseFloat(dsrSelect.value) || 0.4;
  const regionType    = getRegionType();
  const ownershipType = getOwnershipType();

  const result = calcScenario(income, cash, existingDebtAnnual, regionType, ownershipType, rate, term, dsr);
  const band = getPirBand(result.pir);

  // ── KPI 카드 업데이트 ────────────────────────────────────────────────────
  elAffordablePrice.textContent = fmtBig(result.price);

  elMaxLoan.textContent = fmtBig(result.maxLoan);

  elPir.textContent = `${result.pir.toFixed(1)}배`;
  elPirBadge.textContent = band.label;
  elPirBadge.className = `iha-pir-badge iha-pir-badge--${band.tone}`;

  elMonthlyBurden.textContent = `${result.monthlyBurden.toFixed(0)}%`;
  elMonthlyBurdenNote.textContent = `월 상환액 약 ${fmtBig(Math.round(result.monthly))}`;

  // ── 결과 해석 문구 ────────────────────────────────────────────────────────
  elInterpretation.textContent =
    `연소득 ${fmtBig(income)}, 보유 현금 ${fmtBig(cash)} 기준으로 ` +
    `DSR ${(dsr * 100).toFixed(0)}% 한도에서 최대 약 ${fmtBig(result.maxLoan)}까지 대출이 가능할 것으로 추정됩니다. ` +
    `이를 반영한 적정 매매가는 약 ${fmtBig(result.price)}이며, 연봉의 약 ${result.pir.toFixed(1)}배(${band.label} 구간)입니다. ` +
    `월 상환액은 약 ${fmtBig(Math.round(result.monthly))}으로 월급의 약 ${result.monthlyBurden.toFixed(0)}%를 차지합니다.`;

  if (elResultSub) {
    elResultSub.textContent =
      `${REGION_LABELS[regionType]} · 적정 매매가 ${fmtBig(result.price)} · PIR ${result.pir.toFixed(1)}배`;
  }

  // ── 지역 유형별 비교표 ───────────────────────────────────────────────────
  const regionOrder = ["overheated", "regulated", "unregulated"];
  let regionHtml = "";
  regionOrder.forEach((rt) => {
    const r = calcScenario(income, cash, existingDebtAnnual, rt, ownershipType, rate, term, dsr);
    const isActive = rt === regionType;
    regionHtml += `<tr class="${isActive ? "iha-region-table__row--active" : ""}">
      <td>${REGION_LABELS[rt]}</td>
      <td>${fmtBig(r.price)}</td>
      <td>${fmtBig(r.maxLoan)}</td>
      <td>${r.pir.toFixed(1)}배</td>
    </tr>`;
  });
  elRegionTbody.innerHTML = regionHtml;

  // ── 비용 상세 내역 테이블 ─────────────────────────────────────────────────
  const rows = [
    { label: "적정 매매가",                amount: result.price,        note: "역산 결과" },
    { label: "최대 대출 가능액",            amount: -result.maxLoan,     note: "DSR·LTV·정책 한도 중 최소" },
    { label: "필요 자기자본",               amount: result.selfFund,     note: "매매가 − 대출" },
    { label: "취득세 (지방교육세 포함)",     amount: result.tax,          note: "추정값" },
    { label: "중개보수 (상한 기준)",        amount: result.brokerage,    note: "추정값" },
  ];

  let html = rows.map((r) => {
    const isNeg = r.amount < 0;
    const display = isNeg
      ? `<span style="color:#CF1322">−${fmtBig(Math.abs(r.amount))}</span>`
      : fmtBig(r.amount);
    return `<tr>
      <td>${r.label}</td>
      <td>${display}</td>
      <td style="color:#888780;font-size:11px">${r.note}</td>
    </tr>`;
  }).join("");

  html += `<tr class="iha-row--total">
    <td><strong>합계 필요 현금</strong></td>
    <td><strong>${fmtBig(result.requiredCash)}</strong></td>
    <td style="color:#0F6E56;font-size:11px">자기자본 + 부대비용</td>
  </tr>`;

  elBreakdown.innerHTML = html;

  // ── 내집마련 자금 계산기 CTA 링크 ────────────────────────────────────────
  if (elCtaLink) {
    const priceMan = Math.round(result.price / 10000);
    const params = new URLSearchParams({
      price:     String(priceMan),
      cash:      String(cashMan),
      rate:      String(rate),
      term:      String(term),
      region:    regionType,
      ownership: ownershipType,
    });
    elCtaLink.href = `../home-purchase-fund/?${params.toString()}`;
  }

  saveParams();
}

// ── URL 파라미터 저장/불러오기 ─────────────────────────────────────────────────
function saveParams() {
  try {
    const params = new URLSearchParams({
      income:    incomeSlider.value,
      cash:      cashSlider.value,
      debt:      debtInput.value,
      rate:      rateSlider.value,
      term:      termSelect.value,
      dsr:       dsrSelect.value,
      region:    getRegionType(),
      ownership: getOwnershipType(),
    });
    const url = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, "", url);
  } catch (_) {}
}

function loadParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("income")) {
      incomeSlider.value = params.get("income");
      incomeInput.value  = params.get("income");
    }
    if (params.has("cash")) {
      cashSlider.value = params.get("cash");
      cashInput.value  = params.get("cash");
    }
    if (params.has("debt")) {
      debtInput.value = params.get("debt");
    }
    if (params.has("rate")) {
      rateSlider.value = params.get("rate");
    }
    if (params.has("term")) {
      termSelect.value = params.get("term");
    }
    if (params.has("dsr")) {
      dsrSelect.value = params.get("dsr");
    }
    if (params.has("region")) {
      const r = document.querySelector(`input[name="ihaRegion"][value="${params.get("region")}"]`);
      if (r) r.checked = true;
    }
    if (params.has("ownership")) {
      const o = document.querySelector(`input[name="ihaOwnership"][value="${params.get("ownership")}"]`);
      if (o) o.checked = true;
    }
  } catch (_) {}
}

// ── 프리셋 로드 ───────────────────────────────────────────────────────────────
function loadPreset(preset) {
  const incomeMan = Math.round(preset.income / 10000);
  const cashMan   = Math.round(preset.cash / 10000);

  incomeSlider.value = Math.min(incomeMan, parseInt(incomeSlider.max, 10));
  incomeInput.value  = incomeMan;
  cashSlider.value   = Math.min(cashMan, parseInt(cashSlider.max, 10));
  cashInput.value    = cashMan;
  debtInput.value    = Math.round(preset.existingDebtAnnual / 10000);
  rateSlider.value   = preset.rate;
  termSelect.value   = preset.term;
  dsrSelect.value    = preset.dsr;

  const regionEl = document.querySelector(`input[name="ihaRegion"][value="${preset.regionType}"]`);
  if (regionEl) regionEl.checked = true;

  const ownershipEl = document.querySelector(`input[name="ihaOwnership"][value="${preset.ownershipType}"]`);
  if (ownershipEl) ownershipEl.checked = true;

  presetBtns.forEach((btn) => {
    const p = JSON.parse(btn.dataset.preset || "{}");
    btn.classList.toggle("is-active", p.id === preset.id);
  });

  updateAllLabels();
  calculate();
}

// ── 초기화 ────────────────────────────────────────────────────────────────────
function resetAll() {
  incomeSlider.value = 6000;
  incomeInput.value  = 6000;
  cashSlider.value   = 15000;
  cashInput.value    = 15000;
  debtInput.value    = 0;
  rateSlider.value   = 4.0;
  termSelect.value   = 30;
  dsrSelect.value    = 0.4;

  const regionEl = document.querySelector('input[name="ihaRegion"][value="regulated"]');
  if (regionEl) regionEl.checked = true;
  const ownershipEl = document.querySelector('input[name="ihaOwnership"][value="none"]');
  if (ownershipEl) ownershipEl.checked = true;

  presetBtns.forEach((btn) => btn.classList.remove("is-active"));

  updateAllLabels();
  calculate();
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────

// 연소득 슬라이더 ↔ 직접 입력
incomeSlider.addEventListener("input", () => {
  incomeInput.value = incomeSlider.value;
  updateIncomeLabel(parseFloat(incomeSlider.value));
  calculate();
});
incomeInput.addEventListener("input", () => {
  const v = parseFloat(incomeInput.value) || 0;
  incomeSlider.value = Math.min(v, parseInt(incomeSlider.max, 10));
  updateIncomeLabel(v);
  calculate();
});
incomeInput.addEventListener("change", () => {
  const v = parseFloat(incomeInput.value) || 0;
  incomeSlider.value = Math.min(v, parseInt(incomeSlider.max, 10));
  updateIncomeLabel(v);
  calculate();
});

// 보유 현금 슬라이더 ↔ 직접 입력
cashSlider.addEventListener("input", () => {
  cashInput.value = cashSlider.value;
  updateCashLabel(parseFloat(cashSlider.value));
  calculate();
});
cashInput.addEventListener("input", () => {
  const v = parseFloat(cashInput.value) || 0;
  cashSlider.value = Math.min(v, parseInt(cashSlider.max, 10));
  updateCashLabel(v);
  calculate();
});
cashInput.addEventListener("change", () => {
  const v = parseFloat(cashInput.value) || 0;
  cashSlider.value = Math.min(v, parseInt(cashSlider.max, 10));
  updateCashLabel(v);
  calculate();
});

// 기존 대출
debtInput.addEventListener("input", calculate);
debtInput.addEventListener("change", calculate);

// 금리 슬라이더
rateSlider.addEventListener("input", () => {
  updateRateLabel(rateSlider.value);
  calculate();
});

// 대출 기간 · DSR 한도
termSelect.addEventListener("change", calculate);
dsrSelect.addEventListener("change", calculate);

// 지역 유형 · 주택 보유 수 라디오
document.querySelectorAll('input[name="ihaRegion"]').forEach((el) =>
  el.addEventListener("change", calculate)
);
document.querySelectorAll('input[name="ihaOwnership"]').forEach((el) =>
  el.addEventListener("change", calculate)
);

// 프리셋 버튼
presetBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const preset = JSON.parse(btn.dataset.preset || "{}");
    loadPreset(preset);
  });
});

// 리셋 버튼
if (resetBtn) {
  resetBtn.addEventListener("click", resetAll);
}

// 링크 복사 버튼
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    saveParams();
    navigator.clipboard?.writeText(window.location.href).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "복사됨!";
      setTimeout(() => { copyBtn.textContent = orig; }, 1500);
    }).catch(() => {});
  });
}

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
loadParams();
updateAllLabels();
calculate();
