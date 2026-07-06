import { calcJobExample, won, manwon } from "./senior-job-shared.js";
import { readParam, readBool, writeParams } from "./url-state.js";

(() => {
  const root = document.querySelector(".sjsc-page");
  const dataEl = document.getElementById("sjsc-data");
  if (!root || !dataEl) return;

  const jobs = JSON.parse(dataEl.textContent || "[]");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const state = {
    ageBand: readParam("age", "60-64"),
    physicalCondition: readParam("phys", "MEDIUM"),
    targetMonthlyPay: Number(readParam("pay", "800000")),
    dailyHours: Number(readParam("hours", "4")),
    canNightShift: readBool("night", false),
    hasCertificate: readBool("cert", false),
    canCareWork: readBool("care", false),
    selectedJob: readParam("job", ""),
  };

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : fallback;
  }

  function calculateJobScore(user, job) {
    let score = 0;
    if (job.hourlyWageDefault * 8 * 22 >= user.targetMonthlyPay) score += 30;
    else score -= 20;

    if (user.physicalCondition === "LOW" && (job.physicalLoad === "HIGH" || job.physicalLoad === "MEDIUM_HIGH")) {
      score -= 30;
    } else {
      score += 20;
    }

    if (job.requiresCertificate && !user.hasCertificate) score -= 15;
    else score += 10;

    if (job.nightShift && !user.canNightShift) score -= 20;
    if (job.partTimeAvailable && user.dailyHours <= 5) score += 15;
    if (job.jobCode === "CARE_WORKER" && user.canCareWork) score += 20;
    if (!job.recommendedAge.includes(user.ageBand)) score -= 10;

    return score;
  }

  function renderRankGrid() {
    const scored = jobs
      .map((job) => ({ job, score: calculateJobScore(state, job) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const grid = $("[data-sjsc-rank-grid]");
    if (!grid) return;
    grid.innerHTML = scored
      .map(({ job }, index) => {
        const calc = calcJobExample(job);
        return `
          <article class="sjsc-rank-card${index === 0 ? " sjsc-rank-card--top" : ""}" data-sjsc-job="${job.jobCode}">
            <span class="sjsc-rank-card__no">${index + 1}위</span>
            <strong>${job.jobName}</strong>
            <span class="sjsc-rank-card__pay">${manwon(calc.total)}</span>
            <small>준비기간 ${job.prepPeriodDays === 0 ? "즉시" : job.prepPeriodDays + "일"} · 체력부담 ${job.physicalLoad}</small>
          </article>`;
      })
      .join("");

    $$("[data-sjsc-job]").forEach((card) => {
      card.addEventListener("click", () => {
        state.selectedJob = card.getAttribute("data-sjsc-job");
        renderDetail();
      });
    });

    if (!state.selectedJob && scored[0]) state.selectedJob = scored[0].job.jobCode;
  }

  function renderDetail() {
    const job = jobs.find((j) => j.jobCode === state.selectedJob) || jobs[0];
    if (!job) return;
    const calc = calcJobExample(job);

    const set = (key, value) => {
      const el = $(`[data-sjsc-result="${key}"]`);
      if (el) el.textContent = value;
    };
    set("monthlyHours", `${calc.monthlyHours.toFixed(1)}시간`);
    set("basePay", won(calc.basePay));
    set("weeklyHolidayPay", calc.weeklyHolidayPay > 0 ? won(calc.weeklyHolidayPay) : "미적용");
    set("total", won(calc.total));
  }

  function render() {
    renderRankGrid();
    renderDetail();
    writeParams({
      age: state.ageBand,
      phys: state.physicalCondition,
      pay: state.targetMonthlyPay,
      hours: state.dailyHours,
      night: state.canNightShift,
      cert: state.hasCertificate,
      care: state.canCareWork,
    });
  }

  // ── 입력 바인딩 ──────────────────────────────
  $('[data-sjsc="ageBand"]').value = state.ageBand;
  $('[data-sjsc="ageBand"]').addEventListener("change", (e) => { state.ageBand = e.target.value; render(); });

  $('[data-sjsc="physicalCondition"]').value = state.physicalCondition;
  $('[data-sjsc="physicalCondition"]').addEventListener("change", (e) => { state.physicalCondition = e.target.value; render(); });

  const payInput = $('[data-sjsc="targetMonthlyPay"]');
  const paySlider = $('[data-sjsc-slider="targetMonthlyPay"]');
  const payVal = $('[data-sjsc-slider-val="targetMonthlyPay"]');

  function syncPaySlider() {
    const val = Math.min(Math.max(num(payInput.value, 800000), 300000), 2500000);
    paySlider.value = String(val);
    payVal.textContent = manwon(val);
    state.targetMonthlyPay = val;
  }
  payInput.value = state.targetMonthlyPay.toLocaleString("ko-KR");
  payInput.addEventListener("input", () => { syncPaySlider(); render(); });
  paySlider.addEventListener("input", () => {
    payInput.value = Number(paySlider.value).toLocaleString("ko-KR");
    syncPaySlider();
    render();
  });
  syncPaySlider();

  $('[data-sjsc="dailyHours"]').value = String(state.dailyHours);
  $('[data-sjsc="dailyHours"]').addEventListener("change", (e) => { state.dailyHours = Number(e.target.value); render(); });

  $('[data-sjsc="canNightShift"]').checked = state.canNightShift;
  $('[data-sjsc="canNightShift"]').addEventListener("change", (e) => { state.canNightShift = e.target.checked; render(); });

  $('[data-sjsc="hasCertificate"]').checked = state.hasCertificate;
  $('[data-sjsc="hasCertificate"]').addEventListener("change", (e) => { state.hasCertificate = e.target.checked; render(); });

  $('[data-sjsc="canCareWork"]').checked = state.canCareWork;
  $('[data-sjsc="canCareWork"]').addEventListener("change", (e) => { state.canCareWork = e.target.checked; render(); });

  $$("[data-sjsc-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const job = jobs.find((j) => j.jobCode === btn.getAttribute("data-sjsc-preset"));
      if (!job) return;
      state.selectedJob = job.jobCode;
      state.hasCertificate = job.requiresCertificate ? true : state.hasCertificate;
      state.canNightShift = job.nightShift ? true : state.canNightShift;
      render();
    });
  });

  document.getElementById("sjscResetBtn")?.addEventListener("click", () => {
    window.location.href = window.location.pathname;
  });
  document.getElementById("sjscCopyBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
  });

  render();
})();
