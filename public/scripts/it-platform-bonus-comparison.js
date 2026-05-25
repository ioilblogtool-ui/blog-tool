// ─────────────────────────────────────────────
// IT 플랫폼 성과급 비교 계산기
// /tools/it-platform-bonus-comparison/
// ─────────────────────────────────────────────

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// ── 설정 로드 ────────────────────────────────
const configNode = document.getElementById("itpbcConfig");
if (!configNode) throw new Error("itpbc config missing");

const { companies, taxBrackets } = JSON.parse(configNode.textContent || "{}");

// ── 상태 ─────────────────────────────────────
const state = {
  annualSalary: 80_000_000,
};

// ── 포맷 유틸 ────────────────────────────────
const nf = new Intl.NumberFormat("ko-KR");

function parseWon(str) {
  return Number(String(str || "0").replace(/[^\d]/g, "")) || 0;
}

function formatWon(val) {
  const n = Math.round(Number(val) || 0);
  return `${nf.format(n)}원`;
}

function formatMan(val) {
  const n = Math.round(Number(val) || 0);
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${nf.format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${nf.format(man)}만원`;
}

function formatPercent(val, digits = 1) {
  return `${Number(val || 0).toFixed(digits)}%`;
}

// ── 계산 ─────────────────────────────────────
function getTaxRate(salary) {
  const bracket = taxBrackets.find(
    (b) =>
      salary >= b.minAnnualSalary &&
      (b.maxAnnualSalary === null || salary <= b.maxAnnualSalary)
  );
  return bracket ? bracket.estimatedDeductionRate : 0.24;
}

function calcCompany(company, salary) {
  const gross = salary * (company.defaultCashPiPercent / 100);
  const taxRate = getTaxRate(salary);
  const net = gross * (1 - taxRate);
  return {
    id: company.id,
    name: company.name,
    shortName: company.shortName,
    gross,
    net,
    taxRate,
    piPercent: company.defaultCashPiPercent,
    badge: company.cashPiBadge,
  };
}

// ── 렌더: KPI ────────────────────────────────
function renderKpi(results) {
  const sorted = [...results].sort((a, b) => b.gross - a.gross);
  const best = sorted[0];
  if (!best) return;

  const salaryLabel = $(`#itpbcSalaryLabel`);
  if (salaryLabel) salaryLabel.textContent = formatMan(state.annualSalary);

  const bestGrossEl = $(`#itpbcBestGross`);
  const bestNetEl = $(`#itpbcBestNet`);
  const bestCompanyEl = $(`#itpbcBestCompany`);
  const taxRateEl = $(`#itpbcTaxRate`);

  if (bestGrossEl) bestGrossEl.textContent = formatMan(best.gross);
  if (bestNetEl) bestNetEl.textContent = formatMan(best.net);
  if (bestCompanyEl) bestCompanyEl.textContent = best.name;
  if (taxRateEl) taxRateEl.textContent = formatPercent(best.taxRate * 100, 0);
}

// ── 렌더: 바 차트 ─────────────────────────────
function renderBarChart(results) {
  const sorted = [...results].sort((a, b) => b.gross - a.gross);
  const maxGross = sorted[0]?.gross || 1;
  const bestId = sorted[0]?.id;

  results.forEach((r) => {
    const row = $(`[data-company="${r.id}"]`);
    const bar = $(`[data-bar="${r.id}"]`);
    const val = $(`[data-gross="${r.id}"]`);
    if (!row || !bar || !val) return;

    const pct = maxGross > 0 ? (r.gross / maxGross) * 100 : 0;
    bar.style.width = `${Math.max(pct, 2)}%`;
    val.textContent = formatMan(r.gross);

    row.classList.toggle("itpbc-bar-row--best", r.id === bestId);
    bar.classList.toggle("itpbc-bar-fill--best", r.id === bestId);
  });

  // 정렬: DOM 순서를 내림차순으로 재배열
  const chart = $(`#itpbcBarChart`);
  if (chart) {
    sorted.forEach((r) => {
      const row = $(`[data-company="${r.id}"]`);
      if (row) chart.appendChild(row);
    });
  }
}

// ── 렌더: 결과 카드 ──────────────────────────
function renderResultCards(results) {
  const sorted = [...results].sort((a, b) => b.gross - a.gross);
  const bestId = sorted[0]?.id;

  results.forEach((r) => {
    const card = $(`[data-card="${r.id}"]`);
    const grossEl = $(`[data-gross-card="${r.id}"]`);
    const netEl = $(`[data-net-card="${r.id}"]`);
    const rateEl = $(`[data-rate-card="${r.id}"]`);
    if (!card || !grossEl || !netEl || !rateEl) return;

    grossEl.textContent = formatMan(r.gross);
    netEl.textContent = formatMan(r.net);
    rateEl.textContent = formatPercent(r.piPercent, 0);

    card.classList.toggle("itpbc-result-card--best", r.id === bestId);
  });

  // 정렬: DOM 순서를 내림차순으로 재배열
  const container = $(`#itpbcResultCards`);
  if (container) {
    sorted.forEach((r) => {
      const card = $(`[data-card="${r.id}"]`);
      if (card) container.appendChild(card);
    });
  }
}

// ── 렌더: 세금 구간 하이라이트 ──────────────
function highlightBracket(salary) {
  taxBrackets.forEach((b) => {
    const row = $(`#itpbcBracket-${b.label}`);
    if (!row) return;
    const active =
      salary >= b.minAnnualSalary &&
      (b.maxAnnualSalary === null || salary <= b.maxAnnualSalary);
    row.classList.toggle("is-selected", active);
  });
}

// ── 메인 업데이트 ────────────────────────────
function update() {
  const results = companies.map((c) => calcCompany(c, state.annualSalary));
  renderKpi(results);
  renderBarChart(results);
  renderResultCards(results);
  highlightBracket(state.annualSalary);
}

// ── 슬라이더·입력 연동 ──────────────────────
const salaryInput = $(`#itpbcSalaryInput`);
const salarySlider = $(`#itpbcSalarySlider`);
const sliderVal = $(`#itpbcSliderVal`);

function syncFromSalary(val) {
  const clamped = Math.max(30_000_000, Math.min(300_000_000, val));
  state.annualSalary = clamped;
  if (salarySlider) salarySlider.value = clamped;
  if (sliderVal) sliderVal.textContent = formatMan(clamped);
  if (salaryInput) salaryInput.value = formatMan(clamped);
  update();
}

if (salarySlider) {
  salarySlider.addEventListener("input", () => {
    syncFromSalary(Number(salarySlider.value));
  });
}

if (salaryInput) {
  salaryInput.addEventListener("change", () => {
    syncFromSalary(parseWon(salaryInput.value));
  });
  salaryInput.addEventListener("focus", () => {
    salaryInput.value = String(state.annualSalary);
  });
  salaryInput.addEventListener("blur", () => {
    salaryInput.value = formatMan(state.annualSalary);
  });
}

// ── URL 파라미터 동기화 ──────────────────────
function readUrlParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const salaryParam = params.get("salary");
    if (salaryParam) {
      const val = Number(salaryParam);
      if (val >= 30_000_000 && val <= 300_000_000) return val;
    }
  } catch (_) {}
  return null;
}

function writeUrlParam(salary) {
  try {
    const params = new URLSearchParams(window.location.search);
    params.set("salary", String(salary));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  } catch (_) {}
}

const urlSalary = readUrlParam();
if (urlSalary) {
  state.annualSalary = urlSalary;
  if (salarySlider) salarySlider.value = urlSalary;
}

// URL 파라미터 업데이트 (디바운스)
let urlTimer = null;
function scheduleUrlWrite() {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => writeUrlParam(state.annualSalary), 400);
}

if (salarySlider) {
  salarySlider.addEventListener("input", scheduleUrlWrite);
}

// ── 리셋 ────────────────────────────────────
const resetBtn = $(`#itpbcResetBtn`);
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    syncFromSalary(80_000_000);
  });
}

// ── 링크 복사 ────────────────────────────────
const copyBtn = $(`#itpbcCopyBtn`);
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  });
}

// ── 초기 렌더 ────────────────────────────────
syncFromSalary(state.annualSalary);
