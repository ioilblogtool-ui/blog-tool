(() => {
  const root = document.querySelector(".stpl-page");
  const dataEl = document.getElementById("stpl-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));
  const DAYS_IN_MONTH = 30;

  const initialState = {
    monthlyWage: 3000000,
    leaveUnit: "1week",
    isSixPlusSixEligible: false,
    sixPlusSixMonthNumber: 1,
    hasUsedGeneralLeaveThisYear: false,
    generalLeaveMonthNumber: 1,
  };

  let state = { ...initialState };
  let activePreset = "school-break";

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function percent(value) {
    return `${Math.round(value * 100)}%`;
  }

  function getGeneralTier(monthNumber) {
    return (
      cfg.generalTiers.find((tier) => monthNumber >= tier.minMonth && monthNumber <= tier.maxMonth) ||
      cfg.generalTiers[cfg.generalTiers.length - 1]
    );
  }

  function getDailyAllowance(s) {
    let ratio;
    let cap;
    if (s.isSixPlusSixEligible) {
      ratio = 1.0;
      cap = cfg.sixPlusSixCaps[s.sixPlusSixMonthNumber - 1];
    } else {
      const tier = getGeneralTier(s.generalLeaveMonthNumber);
      ratio = tier.ratio;
      cap = tier.cap;
    }
    const monthlyAllowance = Math.min(s.monthlyWage * ratio, cap);
    return { dailyAllowance: monthlyAllowance / DAYS_IN_MONTH, ratio, cap };
  }

  function calcForUnit(s, days) {
    const workDays = DAYS_IN_MONTH - days;
    const workDaysPay = s.monthlyWage * (workDays / DAYS_IN_MONTH);
    const { dailyAllowance } = getDailyAllowance(s);
    const leaveAllowance = dailyAllowance * days;
    const totalPay = workDaysPay + leaveAllowance;
    const reductionAmount = s.monthlyWage - totalPay;
    const reductionRate = reductionAmount / s.monthlyWage;

    let reductionBadge = "minor";
    if (reductionRate > 0.3) reductionBadge = "large";
    else if (reductionRate > 0.1) reductionBadge = "moderate";

    return { daysUsed: days, workDaysPay, leaveAllowance, totalPay, reductionAmount, reductionRate, reductionBadge };
  }

  function calculate(s) {
    const oneWeek = calcForUnit(s, 7);
    const twoWeeks = calcForUnit(s, 14);
    const { ratio, cap } = getDailyAllowance(s);

    return {
      normalMonthlyWage: s.monthlyWage,
      oneWeek,
      twoWeeks,
      appliedRatio: percent(ratio),
      appliedCap: cap,
      remainingLeaveNote: s.hasUsedGeneralLeaveThisYear
        ? "이미 육아휴직을 사용한 이력이 있어, 단기 사용분만큼 남은 기간이 줄어듭니다."
        : "단기 육아휴직 사용분은 전체 육아휴직 가능 기간(최대 1년~1년 6개월)에서 차감됩니다.",
    };
  }

  function badgeLabel(badge) {
    return { minor: "정상 근무와 큰 차이 없음", moderate: "일부 감소", large: "큰 폭 감소" }[badge] || "";
  }

  function renderEffectiveBadge() {
    const el = $('[data-stpl-target="effective-badge"]');
    if (!el) return;
    const today = new Date();
    const effective = new Date(cfg.policyMeta.effectiveDate);
    if (today < effective) {
      const diffDays = Math.ceil((effective - today) / (1000 * 60 * 60 * 24));
      el.textContent = `시행 예정 D-${diffDays} (${cfg.policyMeta.effectiveDate})`;
      el.classList.add("is-upcoming");
      el.classList.remove("is-active");
    } else {
      el.textContent = "시행 중";
      el.classList.add("is-active");
      el.classList.remove("is-upcoming");
    }
  }

  function renderKpis(result, unit) {
    const active = unit === "1week" ? result.oneWeek : result.twoWeeks;
    $("#stplTotalPay").textContent = manwon(active.totalPay);
    $("#stplUnitLabel").textContent = unit === "1week" ? "1주(7일) 기준" : "2주(14일) 기준";
    $("#stplReductionAmount").textContent = `-${manwon(active.reductionAmount)}`;
    $("#stplReductionRate").textContent = `${percent(active.reductionRate)} · ${badgeLabel(active.reductionBadge)}`;
    $("#stplAppliedRatio").textContent = result.appliedRatio;
    $("#stplAppliedCap").textContent = `월 상한 ${manwon(result.appliedCap)}`;
    $("#stplRemainingNote").textContent = state.hasUsedGeneralLeaveThisYear ? "확인 필요" : "정상 진행";
  }

  function renderCompareCards(result, activeUnit) {
    const cards = [
      { key: "1week", label: "1주 사용", data: result.oneWeek },
      { key: "2weeks", label: "2주 사용", data: result.twoWeeks },
    ];
    $("#stplCompareGrid").innerHTML = cards
      .map(
        (card) => `
        <article class="stpl-compare-card ${card.key === activeUnit ? "is-active" : ""}">
          <h3>${card.label}</h3>
          <strong>${manwon(card.data.totalPay)}</strong>
          <p class="stpl-compare-reduction">-${manwon(card.data.reductionAmount)} (${percent(card.data.reductionRate)})</p>
        </article>
      `
      )
      .join("");
  }

  function renderMessage(result, s) {
    const active = s.leaveUnit === "1week" ? result.oneWeek : result.twoWeeks;
    const other = s.leaveUnit === "1week" ? result.twoWeeks : result.oneWeek;
    const activeLabel = s.leaveUnit === "1week" ? "1주(7일)" : "2주(14일)";
    const otherLabel = s.leaveUnit === "1week" ? "2주(14일)" : "1주(7일)";

    const lines = [
      `월 통상임금 ${manwon(s.monthlyWage)} 기준으로 ${activeLabel} 단기 육아휴직을 사용하면 이번 달 실수령액은 약 ${manwon(active.totalPay)}으로 추정되어, 정상 근무 대비 약 ${manwon(active.reductionAmount)}(${percent(active.reductionRate)}) 줄어듭니다.`,
      `${otherLabel}를 사용하면 이번 달 실수령액은 약 ${manwon(other.totalPay)}으로 추정되어 정상 근무 대비 약 ${manwon(other.reductionAmount)}(${percent(other.reductionRate)}) 줄어듭니다.`,
      result.remainingLeaveNote,
    ];
    $("#stplMessage").textContent = lines.join(" ");
  }

  function renderConditionalFields() {
    const sixField = $('[data-stpl-conditional="sixPlusSix"]');
    const generalField = $('[data-stpl-conditional="generalLeave"]');
    if (sixField) sixField.hidden = !state.isSixPlusSixEligible;
    if (generalField) generalField.hidden = !state.hasUsedGeneralLeaveThisYear;
  }

  function readInputs() {
    state.monthlyWage = Math.max(num($('[data-stpl="monthlyWage"]')?.value, 3000000), 0);
    state.leaveUnit = $('[data-stpl="leaveUnit"]')?.value || "1week";
    state.isSixPlusSixEligible = $('[data-stpl="isSixPlusSixEligible"]')?.checked ?? false;
    state.sixPlusSixMonthNumber = num($('[data-stpl="sixPlusSixMonthNumber"]')?.value, 1);
    state.hasUsedGeneralLeaveThisYear = $('[data-stpl="hasUsedGeneralLeaveThisYear"]')?.checked ?? false;
    state.generalLeaveMonthNumber = num($('[data-stpl="generalLeaveMonthNumber"]')?.value, 1);
  }

  function setControl(key, value) {
    const el = $(`[data-stpl="${key}"]`);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(value);
    } else if (el.classList.contains("input-number")) {
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : String(value);
    } else {
      el.value = String(value);
    }
  }

  function applyState(nextState) {
    Object.entries(nextState).forEach(([key, value]) => setControl(key, value));
  }

  function updateUrl(s) {
    const params = new URLSearchParams({
      wage: String(Math.round(s.monthlyWage)),
      unit: s.leaveUnit,
      six: s.isSixPlusSixEligible ? "1" : "0",
      sixMonth: String(s.sixPlusSixMonthNumber),
      used: s.hasUsedGeneralLeaveThisYear ? "1" : "0",
      usedMonth: String(s.generalLeaveMonthNumber),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return false;
    applyState({
      monthlyWage: num(params.get("wage"), initialState.monthlyWage),
      leaveUnit: params.get("unit") || initialState.leaveUnit,
      isSixPlusSixEligible: params.get("six") === "1",
      sixPlusSixMonthNumber: num(params.get("sixMonth"), initialState.sixPlusSixMonthNumber),
      hasUsedGeneralLeaveThisYear: params.get("used") === "1",
      generalLeaveMonthNumber: num(params.get("usedMonth"), initialState.generalLeaveMonthNumber),
    });
    return true;
  }

  function renderPresetState() {
    $$("[data-stpl-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.stplPreset === activePreset);
    });
  }

  function applyPreset(id) {
    const preset = cfg.presets.find((item) => item.id === id);
    if (!preset) return;
    activePreset = id;
    applyState({ ...initialState, ...preset.input });
    renderPresetState();
    update();
  }

  function update() {
    readInputs();
    renderConditionalFields();
    const result = calculate(state);
    renderKpis(result, state.leaveUnit);
    renderCompareCards(result, state.leaveUnit);
    renderMessage(result, state);
    updateUrl(state);
  }

  function bindEvents() {
    $$("[data-stpl]").forEach((el) => {
      el.addEventListener("input", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      el.addEventListener("change", () => {
        activePreset = "";
        renderPresetState();
        update();
      });
      if (el.classList.contains("input-number")) {
        el.addEventListener("blur", () => {
          const value = num(el.value, 0);
          el.value = value ? value.toLocaleString("ko-KR") : "0";
        });
      }
    });

    $$("[data-stpl-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.stplPreset));
    });

    document.getElementById("stplResetBtn")?.addEventListener("click", () => applyPreset("school-break"));
    document.getElementById("stplCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("stplCopyBtn");
        if (button) {
          const original = button.textContent;
          button.textContent = "링크 복사됨";
          setTimeout(() => {
            button.textContent = original;
          }, 1600);
        }
      } catch {
        window.prompt("아래 주소를 복사하세요.", window.location.href);
      }
    });
  }

  renderEffectiveBadge();
  const restored = restoreFromUrl();
  if (!restored) applyPreset(activePreset);
  bindEvents();
  renderPresetState();
  update();
})();
