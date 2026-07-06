(() => {
  const root = document.querySelector(".gyws-page");
  const configEl = document.getElementById("gyws-data");
  if (!root || !configEl) return;

  const { companyTypes, incomeLimit } = JSON.parse(configEl.textContent || "{}");

  const $ = (sel) => root.querySelector(sel);

  let state = {
    age: 27,
    livesInGyeonggi: true,
    companyType: "sme",
    weeklyHours: 40,
    monthlyIncome: 3_000_000,
  };

  const won = (n) => `${Math.round(n).toLocaleString("ko-KR")}원`;

  function getCompany(type) {
    return companyTypes.find((c) => c.value === type) || companyTypes[0];
  }

  function evaluate() {
    const ageOk = state.age >= 19 && state.age <= 39;
    const hoursOk = state.weeklyHours >= 36;
    const company = getCompany(state.companyType);

    const welfarePointEligible =
      ageOk &&
      state.livesInGyeonggi &&
      hoursOk &&
      company.welfarePointEligible &&
      state.monthlyIncome <= incomeLimit;

    const workerSupportEligible =
      ageOk && state.livesInGyeonggi && hoursOk && company.workerSupportEligible;

    return { ageOk, hoursOk, company, welfarePointEligible, workerSupportEligible };
  }

  function reasonFor(programId, evalResult) {
    const { ageOk, hoursOk, company } = evalResult;
    if (!ageOk) return "만 19~39세가 아닙니다";
    if (!state.livesInGyeonggi) return "경기도 거주 요건을 충족하지 않습니다";
    if (programId === "welfarePoint" && !company.welfarePointEligible) return "대상 기업 형태가 아닙니다";
    if (programId === "workerSupport" && !company.workerSupportEligible) return "중소기업 재직자만 대상입니다";
    if (!hoursOk) return "주 36시간 이상 근무 요건을 충족하지 않습니다";
    if (programId === "welfarePoint" && state.monthlyIncome > incomeLimit) return "월급여 385만원 소득기준을 초과합니다";
    return "대상 조건을 충족합니다";
  }

  function render() {
    const evalResult = evaluate();
    const { welfarePointEligible, workerSupportEligible } = evalResult;

    $("#gywsWelfarePointResult").textContent = welfarePointEligible ? "대상 · 연 120만원" : "대상 아님";
    $("#gywsWelfarePointReason").textContent = reasonFor("welfarePoint", evalResult);

    $("#gywsWorkerSupportResult").textContent = workerSupportEligible ? "대상 · 2년 480만원" : "대상 아님";
    $("#gywsWorkerSupportReason").textContent = reasonFor("workerSupport", evalResult);

    const totalAnnual =
      (welfarePointEligible ? 1_200_000 : 0) + (workerSupportEligible ? 2_400_000 : 0);
    $("#gywsTotalResult").textContent = totalAnnual > 0 ? `${won(totalAnnual)} (연 환산)` : "해당 없음";

    syncURL();
  }

  function bindInputs() {
    root.querySelectorAll("[data-gyws]").forEach((el) => {
      const key = el.dataset.gyws;
      if (el.type === "checkbox") {
        el.addEventListener("change", () => {
          state[key] = el.checked;
          render();
        });
      } else {
        const eventName = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventName, () => {
          const raw = el.value.replace(/,/g, "");
          state[key] = el.type === "number" || el.inputMode === "numeric" ? Number(raw) || 0 : raw;
          render();
        });
      }
    });
  }

  function syncURL() {
    const p = new URLSearchParams({
      age: state.age,
      gyeonggi: state.livesInGyeonggi ? "1" : "0",
      company: state.companyType,
      hours: state.weeklyHours,
      income: state.monthlyIncome,
    });
    history.replaceState(null, "", `?${p.toString()}`);
  }

  function restoreFromURL() {
    const p = new URLSearchParams(location.search);
    if (p.has("age")) state.age = Number(p.get("age"));
    if (p.has("gyeonggi")) state.livesInGyeonggi = p.get("gyeonggi") === "1";
    if (p.has("company")) state.companyType = p.get("company");
    if (p.has("hours")) state.weeklyHours = Number(p.get("hours"));
    if (p.has("income")) state.monthlyIncome = Number(p.get("income"));
  }

  function syncInputsFromState() {
    root.querySelectorAll("[data-gyws]").forEach((el) => {
      const key = el.dataset.gyws;
      if (el.type === "checkbox") {
        el.checked = !!state[key];
      } else if (el.tagName === "SELECT") {
        el.value = state[key];
      } else if (el.inputMode === "numeric") {
        el.value = Number(state[key]).toLocaleString("ko-KR");
      } else {
        el.value = state[key];
      }
    });
  }

  document.getElementById("gywsResetBtn")?.addEventListener("click", () => {
    state = { age: 27, livesInGyeonggi: true, companyType: "sme", weeklyHours: 40, monthlyIncome: 3_000_000 };
    syncInputsFromState();
    render();
  });

  document.getElementById("gywsCopyBtn")?.addEventListener("click", () => {
    syncURL();
    navigator.clipboard?.writeText(location.href).catch(() => {});
  });

  restoreFromURL();
  syncInputsFromState();
  bindInputs();
  render();
})();
