import { won } from "./senior-job-shared.js";

(() => {
  const root = document.querySelector(".sgsc-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);

  const WEEKS_PER_MONTH = 4.345;
  const PATTERNS = {
    ALTERNATE_DAY: { monthlyHours: 24 * 15, nightCyclesPerMonth: 15 },
    THREE_SHIFT: { monthlyHours: 8 * 5 * WEEKS_PER_MONTH, nightCyclesPerMonth: (5 * WEEKS_PER_MONTH) / 3 },
    DAILY: { monthlyHours: 8 * 5 * WEEKS_PER_MONTH, nightCyclesPerMonth: 0 },
  };
  const NIGHT_SHIFT_PREMIUM_RATE = 0.5;
  const NIGHT_SHIFT_HOURS = 8;
  const INSURANCE_DEDUCTION_RATE = 0.093;

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function getPattern() {
    return document.querySelector('input[name="sgscPattern"]:checked')?.value || "ALTERNATE_DAY";
  }

  function render() {
    const p = PATTERNS[getPattern()];
    const hourlyWage = num($('[data-sgsc="hourlyWage"]').value, 10320);
    const includeNightShift = $('[data-sgsc="includeNightShift"]').checked;
    const isMonitoringApproved = $('[data-sgsc="isMonitoringApproved"]').checked;
    const applyInsurance = $('[data-sgsc="applyInsurance"]').checked;

    const basePay = hourlyWage * p.monthlyHours;
    const nightPremium =
      includeNightShift && !isMonitoringApproved
        ? hourlyWage * NIGHT_SHIFT_PREMIUM_RATE * NIGHT_SHIFT_HOURS * p.nightCyclesPerMonth
        : 0;
    const grossPay = basePay + nightPremium;
    const insuranceDeduction = applyInsurance ? grossPay * INSURANCE_DEDUCTION_RATE : 0;
    const netPay = grossPay - insuranceDeduction;

    const set = (key, value) => {
      const el = $(`[data-sgsc-result="${key}"]`);
      if (el) el.textContent = value;
    };
    set("monthlyHours", `${p.monthlyHours.toFixed(1)}시간`);
    set("basePay", won(basePay));
    set("nightPremium", nightPremium > 0 ? won(nightPremium) : "미적용");
    set("netPay", won(netPay));
  }

  root.querySelectorAll('input[name="sgscPattern"]').forEach((el) => el.addEventListener("change", render));
  ["hourlyWage"].forEach((key) => $(`[data-sgsc="${key}"]`)?.addEventListener("input", render));
  ["includeNightShift", "isMonitoringApproved", "applyInsurance"].forEach((key) => {
    $(`[data-sgsc="${key}"]`)?.addEventListener("change", render);
  });

  document.getElementById("sgscResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("sgscCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  render();
})();
