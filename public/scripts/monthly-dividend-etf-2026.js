const configEl = document.getElementById("mdeConfig");
const { etfs, defaultInvestment, defaultTaxRate } = JSON.parse(configEl?.textContent || "{}");

// ── DOM refs ──────────────────────────────────────────────────────────────────
const investmentInput = document.getElementById("mdeInvestment");
const taxRateInput = document.getElementById("mdeTaxRate");
const categoryTabs = document.querySelectorAll(".mde-tab-btn");

// ── State ─────────────────────────────────────────────────────────────────────
let investment = defaultInvestment;
let taxRate = defaultTaxRate;

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseMoney(raw) {
  return Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
}

function fmt(n) {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function calcNetMonthly(annualRate) {
  return (investment * annualRate / 100) * (1 - taxRate / 100) / 12;
}

// ── Update table monthly-net cells ───────────────────────────────────────────
function updateTable() {
  etfs.forEach((etf) => {
    const cell = document.querySelector(`[data-etf-net="${etf.id}"]`);
    if (cell) cell.textContent = fmt(calcNetMonthly(etf.annualDistributionRate));
  });
}

// ── Update scenario cards ─────────────────────────────────────────────────────
function updateScenarios() {
  etfs.slice(0, 3).forEach((etf) => {
    const base = calcNetMonthly(etf.annualDistributionRate);
    const baseEl = document.querySelector(`[data-scenario-base="${etf.id}"]`);
    const el20 = document.querySelector(`[data-scenario-20="${etf.id}"]`);
    const el40 = document.querySelector(`[data-scenario-40="${etf.id}"]`);
    if (baseEl) baseEl.textContent = fmt(base);
    if (el20) el20.textContent = fmt(base * 0.8);
    if (el40) el40.textContent = fmt(base * 0.6);
  });
}

function recalc() {
  updateTable();
  updateScenarios();
}

// ── Category filter ───────────────────────────────────────────────────────────
function applyFilter(category) {
  document.querySelectorAll("[data-cat-row]").forEach((row) => {
    const show = category === "all" || row.dataset.catRow === category;
    row.style.display = show ? "" : "none";
  });
}

categoryTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryTabs.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    applyFilter(btn.dataset.catTab);
  });
});

// ── Investment input ──────────────────────────────────────────────────────────
if (investmentInput) {
  investmentInput.addEventListener("input", () => {
    investment = parseMoney(investmentInput.value);
    investmentInput.value = investment.toLocaleString("ko-KR");
    recalc();
  });
  investmentInput.addEventListener("focus", () => {
    investmentInput.value = parseMoney(investmentInput.value) || "";
  });
  investmentInput.addEventListener("blur", () => {
    investmentInput.value = parseMoney(investmentInput.value).toLocaleString("ko-KR");
  });
}

if (taxRateInput) {
  taxRateInput.addEventListener("input", () => {
    taxRate = Math.min(99.9, Math.max(0, parseFloat(taxRateInput.value) || 0));
    recalc();
  });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
recalc();
