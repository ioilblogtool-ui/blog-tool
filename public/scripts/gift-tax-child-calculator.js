// 자녀 증여세 계산기 — 클라이언트 스크립트
// 모든 수치는 참고용 추정값입니다. 실제 신고는 홈택스·세무 전문가를 통해 확인하세요.

// ── 상수 ──────────────────────────────────────────────────────────────────────
const MINOR_BASIC_DEDUCTION = 20_000_000;
const ADULT_BASIC_DEDUCTION = 50_000_000;
const MARRIAGE_BIRTH_MAX_DEDUCTION = 100_000_000;
const MINOR_AGE_THRESHOLD = 19;

const GIFT_TAX_BRACKETS = [
  { maxBase: 100_000_000, rate: 0.1, deduction: 0 },
  { maxBase: 500_000_000, rate: 0.2, deduction: 10_000_000 },
  { maxBase: 1_000_000_000, rate: 0.3, deduction: 60_000_000 },
  { maxBase: 3_000_000_000, rate: 0.4, deduction: 160_000_000 },
  { maxBase: null, rate: 0.5, deduction: 460_000_000 },
];

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const ageInput            = document.getElementById("gtcAge");
const ageHint              = document.getElementById("gtcAgeHint");
const giftSlider           = document.getElementById("gtcGiftSlider");
const giftInput            = document.getElementById("gtcGiftInput");
const giftLabel            = document.getElementById("gtcGiftLabel");
const priorGiftInput       = document.getElementById("gtcPriorGiftInput");
const marriageToggle       = document.getElementById("gtcMarriageToggle");
const marriageDateField    = document.getElementById("gtcMarriageDateField");
const marriageDateInput    = document.getElementById("gtcMarriageDate");
const birthToggle          = document.getElementById("gtcBirthToggle");
const birthDateField       = document.getElementById("gtcBirthDateField");
const birthDateInput       = document.getElementById("gtcBirthDate");
const usedDeductionInput   = document.getElementById("gtcUsedDeductionInput");
const purposeSelect        = document.getElementById("gtcPurpose");

const elTotalDeduction     = document.getElementById("gtc-total-deduction");
const elTotalDeductionNote = document.getElementById("gtc-total-deduction-note");
const elTaxBase            = document.getElementById("gtc-tax-base");
const elTaxAmount          = document.getElementById("gtc-tax-amount");
const elBreakdown          = document.getElementById("gtc-breakdown-tbody");
const elResultDetail       = document.getElementById("gtc-result-detail");
const elResultSub          = document.getElementById("gtc-result-sub");

const resetBtn              = document.getElementById("resetGtcBtn");
const copyBtn               = document.getElementById("copyGtcLinkBtn");

// ── 유틸 ──────────────────────────────────────────────────────────────────────
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

// ── 요건 판정 ─────────────────────────────────────────────────────────────────
function isWithinTwoYears(dateStr) {
  if (!dateStr) return false;
  const target = new Date(dateStr);
  const now = new Date();
  const diffYears = Math.abs(now - target) / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears <= 2;
}

// ── 계산 함수 ─────────────────────────────────────────────────────────────────
function getBasicDeduction(age) {
  return age < MINOR_AGE_THRESHOLD ? MINOR_BASIC_DEDUCTION : ADULT_BASIC_DEDUCTION;
}

function getMarriageBirthDeduction({ marriageOk, birthOk, usedDeduction }) {
  const remaining = Math.max(0, MARRIAGE_BIRTH_MAX_DEDUCTION - usedDeduction);
  return (marriageOk || birthOk) ? remaining : 0;
}

function calcGiftTax(taxBase) {
  const bracket = GIFT_TAX_BRACKETS.find((b) => b.maxBase === null || taxBase <= b.maxBase);
  return Math.max(0, taxBase * bracket.rate - bracket.deduction);
}

// ── 레이블 업데이트 ───────────────────────────────────────────────────────────
function updateGiftLabel(manVal) {
  if (giftLabel) giftLabel.textContent = fmtBig(manVal * 10000);
}

function updateAgeHint(age) {
  if (!ageHint) return;
  ageHint.textContent = age < MINOR_AGE_THRESHOLD
    ? "19세 미만 → 미성년 기본공제 2,000만원 적용"
    : "19세 이상 → 성년 기본공제 5,000만원 적용";
}

function toggleConditionalField(field, checked) {
  if (field) field.hidden = !checked;
}

// ── 메인 계산 함수 ────────────────────────────────────────────────────────────
function calculate() {
  const age            = parseInt(ageInput.value, 10) || 0;
  const giftMan         = parseFloat(giftSlider.value) || 0;
  const giftAmount      = giftMan * 10000;
  const priorGiftMan    = parseFloat(priorGiftInput.value) || 0;
  const priorGift       = priorGiftMan * 10000;
  const usedDeductionMan = parseFloat(usedDeductionInput.value) || 0;
  const usedDeduction    = usedDeductionMan * 10000;

  const marriageChecked = marriageToggle.checked;
  const birthChecked     = birthToggle.checked;
  const marriageOk       = marriageChecked && isWithinTwoYears(marriageDateInput.value);
  const birthOk          = birthChecked && isWithinTwoYears(birthDateInput.value);

  const basicDeduction      = getBasicDeduction(age);
  const additionalDeduction = getMarriageBirthDeduction({ marriageOk, birthOk, usedDeduction });
  const totalDeduction      = basicDeduction + additionalDeduction;

  const totalGift = giftAmount + priorGift;
  const taxBase    = Math.max(0, totalGift - totalDeduction);
  const taxAmount  = calcGiftTax(taxBase);

  // ── KPI 카드 ──────────────────────────────────────────────────────────────
  elTotalDeduction.textContent = fmtBig(totalDeduction);
  elTotalDeductionNote.textContent = additionalDeduction > 0
    ? `기본 ${fmtBig(basicDeduction)} + 추가 ${fmtBig(additionalDeduction)}`
    : `기본공제만 적용 (${age < MINOR_AGE_THRESHOLD ? "미성년" : "성년"})`;

  elTaxBase.textContent = fmtBig(taxBase);
  elTaxAmount.textContent = fmtBig(Math.round(taxAmount));

  // ── 공제 적용 내역 ────────────────────────────────────────────────────────
  const rows = [
    { label: "이번 증여금액", amount: giftAmount, note: "현재 증여할 금액" },
    { label: "최근 10년 증여금액", amount: priorGift, note: "수증자 기준 합산" },
    { label: "기본공제", amount: -basicDeduction, note: age < MINOR_AGE_THRESHOLD ? "미성년 2,000만원" : "성년 5,000만원" },
    { label: "혼인·출산 추가공제", amount: -additionalDeduction, note: additionalDeduction > 0 ? "요건 충족" : "요건 미충족 또는 미적용" },
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

  html += `<tr class="gtc-row--total">
    <td><strong>과세표준</strong></td>
    <td><strong>${fmtBig(taxBase)}</strong></td>
    <td style="color:#0F6E56;font-size:11px">증여금액 합계 − 공제 합계</td>
  </tr>`;

  elBreakdown.innerHTML = html;

  // ── 결과 문구 ────────────────────────────────────────────────────────────
  if (taxBase === 0) {
    elResultDetail.textContent =
      `${age < MINOR_AGE_THRESHOLD ? "미성년" : "성년"} 자녀 기본공제 ${fmtBig(basicDeduction)}${additionalDeduction > 0 ? `와 혼인·출산 추가공제 ${fmtBig(additionalDeduction)}를` : "를"} 적용하면 과세표준이 0원이 되어 예상 증여세는 0원입니다. 목돈 증여라면 향후 자금출처 소명을 위해 0원 신고를 검토해보세요.`;
  } else {
    elResultDetail.textContent =
      `공제 적용 후 과세표준 ${fmtBig(taxBase)}에 누진세율을 적용한 예상 증여세는 ${fmtBig(Math.round(taxAmount))}입니다. 정확한 신고는 홈택스 또는 세무 전문가를 통해 확인하세요.`;
  }

  if ((marriageChecked && !marriageOk) || (birthChecked && !birthOk)) {
    elResultDetail.textContent += " 입력한 날짜가 2년 요건을 벗어나 혼인·출산 추가공제가 적용되지 않았습니다.";
  }

  if (elResultSub) {
    elResultSub.textContent = `증여금액 ${fmtBig(giftAmount)} · 적용 공제 ${fmtBig(totalDeduction)} · 예상 증여세 ${fmtBig(Math.round(taxAmount))}`;
  }

  saveParams();
}

// ── URL 파라미터 저장/불러오기 ─────────────────────────────────────────────────
function saveParams() {
  try {
    const params = new URLSearchParams({
      age: ageInput.value,
      gift: giftSlider.value,
      prior: priorGiftInput.value,
      marriage: marriageToggle.checked ? "1" : "0",
      marriageDate: marriageDateInput.value || "",
      birth: birthToggle.checked ? "1" : "0",
      birthDate: birthDateInput.value || "",
      used: usedDeductionInput.value,
      purpose: purposeSelect.value,
    });
    const url = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, "", url);
  } catch (_) {}
}

function loadParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("age")) ageInput.value = params.get("age");
    if (params.has("gift")) {
      giftSlider.value = params.get("gift");
      giftInput.value = params.get("gift");
    }
    if (params.has("prior")) priorGiftInput.value = params.get("prior");
    if (params.has("marriage")) marriageToggle.checked = params.get("marriage") === "1";
    if (params.has("marriageDate")) marriageDateInput.value = params.get("marriageDate");
    if (params.has("birth")) birthToggle.checked = params.get("birth") === "1";
    if (params.has("birthDate")) birthDateInput.value = params.get("birthDate");
    if (params.has("used")) usedDeductionInput.value = params.get("used");
    if (params.has("purpose")) purposeSelect.value = params.get("purpose");
  } catch (_) {}
}

// ── 초기화 ────────────────────────────────────────────────────────────────────
function resetAll() {
  ageInput.value = 20;
  giftSlider.value = 2000;
  giftInput.value = 2000;
  priorGiftInput.value = 0;
  marriageToggle.checked = false;
  marriageDateInput.value = "";
  birthToggle.checked = false;
  birthDateInput.value = "";
  usedDeductionInput.value = 0;
  purposeSelect.value = "invest";

  toggleConditionalField(marriageDateField, false);
  toggleConditionalField(birthDateField, false);
  updateAgeHint(20);
  updateGiftLabel(2000);
  calculate();
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
ageInput.addEventListener("input", () => {
  const age = parseInt(ageInput.value, 10) || 0;
  updateAgeHint(age);
  calculate();
});

giftSlider.addEventListener("input", () => {
  giftInput.value = giftSlider.value;
  updateGiftLabel(parseFloat(giftSlider.value));
  calculate();
});
giftInput.addEventListener("input", () => {
  const v = parseFloat(giftInput.value) || 0;
  giftSlider.value = Math.min(v, parseInt(giftSlider.max, 10));
  updateGiftLabel(v);
  calculate();
});

priorGiftInput.addEventListener("input", calculate);
usedDeductionInput.addEventListener("input", calculate);
purposeSelect.addEventListener("change", calculate);

marriageToggle.addEventListener("change", () => {
  toggleConditionalField(marriageDateField, marriageToggle.checked);
  calculate();
});
marriageDateInput.addEventListener("change", calculate);

birthToggle.addEventListener("change", () => {
  toggleConditionalField(birthDateField, birthToggle.checked);
  calculate();
});
birthDateInput.addEventListener("change", calculate);

if (resetBtn) resetBtn.addEventListener("click", resetAll);

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
toggleConditionalField(marriageDateField, marriageToggle.checked);
toggleConditionalField(birthDateField, birthToggle.checked);
updateAgeHint(parseInt(ageInput.value, 10) || 0);
updateGiftLabel(parseFloat(giftSlider.value) || 0);
calculate();
