// 내집마련 자금 계산기 — 클라이언트 스크립트
// 모든 수치는 추정값·참고용입니다. 실제 대출 조건은 반드시 금융기관에서 확인하세요.

// ── 설정 로드 ─────────────────────────────────────────────────────────────────
const configEl = document.getElementById("hpfConfig");
const { PRESETS } = JSON.parse(configEl?.textContent || "{}");

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const priceSlider    = document.getElementById("hpfPriceSlider");
const priceInput     = document.getElementById("hpfPriceInput");
const priceLabel     = document.getElementById("hpfPriceLabel");
const cashSlider     = document.getElementById("hpfCashSlider");
const cashInput      = document.getElementById("hpfCashInput");
const cashLabel      = document.getElementById("hpfCashLabel");
const rateSlider     = document.getElementById("hpfRateSlider");
const rateLabel      = document.getElementById("hpfRateLabel");
const termSelect     = document.getElementById("hpfTerm");
const regCostInput   = document.getElementById("hpfRegCost");
const toheojeWarning = document.getElementById("hpfToheojeWarning");

const elMaxLoan      = document.getElementById("hpf-max-loan");
const elMaxLoanNote  = document.getElementById("hpf-max-loan-note");
const elMinCash      = document.getElementById("hpf-min-cash");
const elMinCashNote  = document.getElementById("hpf-min-cash-note");
const elCashDiff     = document.getElementById("hpf-cash-diff");
const elCashDiffNote = document.getElementById("hpf-cash-diff-note");
const elMonthly      = document.getElementById("hpf-monthly");
const elMonthlyNote  = document.getElementById("hpf-monthly-note");
const elDiffCard     = document.getElementById("hpf-diff-card");
const elBreakdown    = document.getElementById("hpf-breakdown-tbody");
const elLtvDetail    = document.getElementById("hpf-ltv-detail");
const elResultSub    = document.getElementById("hpf-result-sub");

const resetBtn       = document.getElementById("resetHpfBtn");
const copyBtn        = document.getElementById("copyHpfLinkBtn");
const presetBtns     = document.querySelectorAll(".hpf-preset-btn");

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

function fmtMan(wonVal) {
  const man = wonVal / 10000;
  if (man >= 10000) {
    const eok = man / 10000;
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억원`;
  }
  return `${Math.round(man).toLocaleString("ko-KR")}만원`;
}

// ── 계산 함수 ─────────────────────────────────────────────────────────────────

// LTV 비율표 (%)
const LTV_RATES = {
  overheated:  { none: 50, one: 40, two_plus: 0  },
  regulated:   { none: 70, one: 60, two_plus: 30 },
  unregulated: { none: 70, one: 60, two_plus: 50 },
};

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
  // 다주택 중과
  if (ownershipType === "two_plus") {
    if (regionType !== "unregulated") {
      return price * 0.12 * 1.1; // 12% + 지방교육세
    }
    return price * 0.08 * 1.1;  // 비규제 다주택 8%
  }
  if (ownershipType === "one" && regionType !== "unregulated") {
    return price * 0.08 * 1.1;  // 2주택 조정 8%
  }

  // 일반세율 (1주택 또는 비규제 추가)
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

// ── 입력값 읽기 ───────────────────────────────────────────────────────────────
function getRegionType() {
  const checked = document.querySelector('input[name="hpfRegion"]:checked');
  return checked ? checked.value : "regulated";
}

function getOwnershipType() {
  const checked = document.querySelector('input[name="hpfOwnership"]:checked');
  return checked ? checked.value : "none";
}

// ── 레이블 업데이트 ───────────────────────────────────────────────────────────
function updatePriceLabel(manVal) {
  const won = manVal * 10000;
  if (priceLabel) priceLabel.textContent = fmtBig(won);
}

function updateCashLabel(manVal) {
  const won = manVal * 10000;
  if (cashLabel) cashLabel.textContent = fmtBig(won);
}

function updateRateLabel(val) {
  if (rateLabel) rateLabel.textContent = `${parseFloat(val).toFixed(1)}%`;
}

function updateAllLabels() {
  updatePriceLabel(parseFloat(priceSlider.value));
  updateCashLabel(parseFloat(cashSlider.value));
  updateRateLabel(rateSlider.value);
}

// ── 메인 계산 함수 ────────────────────────────────────────────────────────────
function calculate() {
  // 입력값 수집
  const priceMan     = parseFloat(priceSlider.value) || 100000;
  const price        = priceMan * 10000;                       // 원
  const rate         = parseFloat(rateSlider.value) || 4.0;
  const term         = parseInt(termSelect.value, 10) || 30;
  const cashMan      = parseFloat(cashSlider.value) || 0;
  const cash         = cashMan * 10000;                        // 원
  const regCostMan   = parseFloat(regCostInput.value) || 0;
  const regionType   = getRegionType();
  const ownershipType = getOwnershipType();

  // 대출 계산
  const ltv          = getLTV(regionType, ownershipType);
  const ltvLoan      = Math.floor(price * ltv / 100);
  const policyLimit  = getPolicyLimit(regionType, price);
  const maxLoan      = Math.min(ltvLoan, policyLimit);

  // 부대비용 계산
  const acquisitionTax   = calcAcquisitionTax(price, ownershipType, regionType);
  const brokerageFee     = calcBrokerageFee(price);
  const registrationCost = regCostMan * 10000;

  const totalAdditional  = acquisitionTax + brokerageFee + registrationCost;
  const selfFund         = price - maxLoan;                    // 자기자본 (순수)
  const minCashNeeded    = selfFund + totalAdditional;         // 총 필요 현금
  const cashDiff         = cash - minCashNeeded;

  // 월 상환액
  const monthly = calcMonthlyPayment(maxLoan, rate, term);

  // ── KPI 카드 업데이트 ────────────────────────────────────────────────────
  elMaxLoan.textContent     = fmtBig(maxLoan);
  elMaxLoanNote.textContent = ltv === 0
    ? "대출 불가 (LTV 0%)"
    : `LTV ${ltv}% · 정책 한도 반영`;

  elMinCash.textContent     = fmtBig(minCashNeeded);
  elMinCashNote.textContent = "취득세+중개보수+등기비 포함";

  elCashDiff.textContent    = (cashDiff >= 0 ? "+" : "") + fmtBig(cashDiff);
  elCashDiffNote.textContent = cashDiff >= 0 ? "현금 여유" : "현금 부족";

  // 여유/부족 카드 색상
  elDiffCard.classList.remove("hpf-kpi-card--surplus", "hpf-kpi-card--deficit");
  if (cashDiff > 0) {
    elDiffCard.classList.add("hpf-kpi-card--surplus");
  } else if (cashDiff < 0) {
    elDiffCard.classList.add("hpf-kpi-card--deficit");
  }

  elMonthly.textContent     = maxLoan > 0 ? fmtBig(Math.round(monthly)) : "대출 없음";
  elMonthlyNote.textContent = maxLoan > 0
    ? `${rate.toFixed(1)}% · ${term}년 원리금균등`
    : "LTV 0% — 전액 자기자본";

  // ── 상세 내역 테이블 ─────────────────────────────────────────────────────
  const rows = [
    { label: "매매가",                 amount: price,          note: "희망 매매가" },
    { label: "최대 대출 가능액",        amount: -maxLoan,       note: `LTV ${ltv}% · 정책 한도` },
    { label: "필요 자기자본",           amount: selfFund,       note: "매매가 − 대출" },
    { label: "취득세 (지방교육세 포함)", amount: acquisitionTax, note: "추정값" },
    { label: "중개보수 (상한 기준)",    amount: brokerageFee,   note: "추정값" },
    { label: "등기 비용 (추정)",        amount: registrationCost, note: "직접 입력" },
  ];

  let html = rows.map(r => {
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

  // 합계 행
  html += `<tr class="hpf-row--total">
    <td><strong>합계 필요 현금</strong></td>
    <td><strong>${fmtBig(minCashNeeded)}</strong></td>
    <td style="color:#0F6E56;font-size:11px">자기자본 + 부대비용</td>
  </tr>`;

  elBreakdown.innerHTML = html;

  // ── LTV 안내 박스 ────────────────────────────────────────────────────────
  const regionLabels = {
    overheated:  "투기과열지구 + 토허제",
    regulated:   "조정대상지역",
    unregulated: "비규제지역",
  };
  const ownershipLabels = { none: "무주택", one: "1주택", two_plus: "2주택 이상" };
  const policyLimitText = policyLimit === Infinity
    ? "정책 한도 없음"
    : `정책 한도 ${fmtBig(policyLimit)}`;

  elLtvDetail.textContent =
    `${regionLabels[regionType]} · ${ownershipLabels[ownershipType]} → LTV ${ltv}% (${policyLimitText})`;

  // ── 토허제 경고 ──────────────────────────────────────────────────────────
  if (toheojeWarning) {
    toheojeWarning.hidden = regionType !== "overheated";
  }

  // ── 결과 요약 문구 ────────────────────────────────────────────────────────
  if (elResultSub) {
    elResultSub.textContent =
      `${fmtBig(price)} 매매 · LTV ${ltv}% · 총 필요 현금 ${fmtBig(minCashNeeded)}`;
  }

  saveParams();
}

// ── URL 파라미터 저장/불러오기 ─────────────────────────────────────────────────
function saveParams() {
  try {
    const params = new URLSearchParams({
      price:     priceSlider.value,
      cash:      cashSlider.value,
      rate:      rateSlider.value,
      term:      termSelect.value,
      regCost:   regCostInput.value,
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
    if (params.has("price")) {
      priceSlider.value = params.get("price");
      priceInput.value  = params.get("price");
    }
    if (params.has("cash")) {
      cashSlider.value = params.get("cash");
      cashInput.value  = params.get("cash");
    }
    if (params.has("rate")) {
      rateSlider.value = params.get("rate");
    }
    if (params.has("term")) {
      termSelect.value = params.get("term");
    }
    if (params.has("regCost")) {
      regCostInput.value = params.get("regCost");
    }
    if (params.has("region")) {
      const r = document.querySelector(`input[name="hpfRegion"][value="${params.get("region")}"]`);
      if (r) r.checked = true;
    }
    if (params.has("ownership")) {
      const o = document.querySelector(`input[name="hpfOwnership"][value="${params.get("ownership")}"]`);
      if (o) o.checked = true;
    }
  } catch (_) {}
}

// ── 프리셋 로드 ───────────────────────────────────────────────────────────────
function loadPreset(preset) {
  // 프리셋 값은 원(won) 단위로 저장됨 → 만원으로 변환
  const priceMan = Math.round(preset.price / 10000);
  const cashMan  = Math.round(preset.cash  / 10000);

  priceSlider.value = priceMan;
  priceInput.value  = priceMan;
  cashSlider.value  = Math.min(cashMan, parseInt(cashSlider.max, 10));
  cashInput.value   = cashMan;
  rateSlider.value  = preset.rate;
  termSelect.value  = preset.term;

  // 지역 유형
  const regionEl = document.querySelector(
    `input[name="hpfRegion"][value="${preset.regionType}"]`
  );
  if (regionEl) regionEl.checked = true;

  // 주택 보유 수
  const ownershipEl = document.querySelector(
    `input[name="hpfOwnership"][value="${preset.ownershipType}"]`
  );
  if (ownershipEl) ownershipEl.checked = true;

  // 프리셋 버튼 활성 표시
  presetBtns.forEach((btn) => {
    const p = JSON.parse(btn.dataset.preset || "{}");
    btn.classList.toggle("is-active", p.id === preset.id);
  });

  updateAllLabels();
  calculate();
}

// ── 초기화 ────────────────────────────────────────────────────────────────────
function resetAll() {
  priceSlider.value = 100000;
  priceInput.value  = 100000;
  cashSlider.value  = 30000;
  cashInput.value   = 30000;
  rateSlider.value  = 4.0;
  termSelect.value  = 30;
  regCostInput.value = 80;

  const regionEl = document.querySelector('input[name="hpfRegion"][value="regulated"]');
  if (regionEl) regionEl.checked = true;
  const ownershipEl = document.querySelector('input[name="hpfOwnership"][value="none"]');
  if (ownershipEl) ownershipEl.checked = true;

  presetBtns.forEach((btn) => btn.classList.remove("is-active"));

  updateAllLabels();
  calculate();
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────

// 매매가 슬라이더 ↔ 직접 입력
priceSlider.addEventListener("input", () => {
  priceInput.value = priceSlider.value;
  updatePriceLabel(parseFloat(priceSlider.value));
  calculate();
});
priceInput.addEventListener("input", () => {
  const v = parseFloat(priceInput.value) || 0;
  priceSlider.value = Math.min(v, parseInt(priceSlider.max, 10));
  updatePriceLabel(v);
  calculate();
});
priceInput.addEventListener("change", () => {
  const v = parseFloat(priceInput.value) || 0;
  priceSlider.value = Math.min(v, parseInt(priceSlider.max, 10));
  updatePriceLabel(v);
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

// 금리 슬라이더
rateSlider.addEventListener("input", () => {
  updateRateLabel(rateSlider.value);
  calculate();
});

// 대출 기간·등기비
termSelect.addEventListener("change", calculate);
regCostInput.addEventListener("input", calculate);
regCostInput.addEventListener("change", calculate);

// 지역 유형·주택 보유 수 라디오
document.querySelectorAll('input[name="hpfRegion"]').forEach((el) =>
  el.addEventListener("change", calculate)
);
document.querySelectorAll('input[name="hpfOwnership"]').forEach((el) =>
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
