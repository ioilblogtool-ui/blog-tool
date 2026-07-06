import { calcMonthlyPay, won, getWeeklyHolidayEligible } from "./senior-job-shared.js";

(() => {
  const root = document.querySelector(".cjsc-page");
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function getRadioValue(name, fallback) {
    return Number(document.querySelector(`input[name="${name}"]:checked`)?.value ?? fallback);
  }

  function render() {
    const dailyHours = getRadioValue("cjscHours", 4);
    const weeklyDays = getRadioValue("cjscDays", 5);
    const hourlyWage = num($('[data-cjsc="hourlyWage"]').value, 10320);

    const calc = calcMonthlyPay(hourlyWage, dailyHours, weeklyDays);
    const eligible = getWeeklyHolidayEligible(calc.weeklyHours);

    const set = (key, value) => {
      const el = $(`[data-cjsc-result="${key}"]`);
      if (el) el.textContent = value;
    };
    set("weeklyHours", `${calc.weeklyHours}시간`);
    set("holidayStatus", eligible ? "적용 (주 15시간 이상)" : "미적용 (주 15시간 미만)");
    set("total", won(calc.total));
  }

  root.querySelectorAll('input[name="cjscHours"], input[name="cjscDays"]').forEach((el) =>
    el.addEventListener("change", render)
  );
  $('[data-cjsc="hourlyWage"]')?.addEventListener("input", render);

  document.getElementById("cjscResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("cjscCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  render();
})();
