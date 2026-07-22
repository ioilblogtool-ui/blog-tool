(() => {
  const root = document.querySelector(".pwd-page");
  const dataEl = document.getElementById("pwd-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const JUDGEMENT_LABELS = {
    likely: "신청 검토",
    borderline: "기준 근접",
    needsCheck: "추가 정보 필요",
    unlikely: "현재 입력 기준 가능성 낮음",
  };
  const BENEFIT_TYPE_LABELS = { cash: "현금급여", service: "서비스·비용지원", participation: "참여·주거지원" };
  const BENEFIT_TYPE_ORDER = ["cash", "service", "participation"];

  const initialState = {
    age: 68,
    householdSize: 1,
    isCouple: false,
    spouseAge: 65,
    region: "city",
    housingOwnership: "current",
    earnedIncome: 0,
    publicPension: 300000,
    otherIncome: 0,
    spouseEarnedIncome: 0,
    spousePublicPension: 0,
    spouseOtherIncome: 0,
    realEstate: 200000000,
    financialAsset: 10000000,
    spouseFinancialAsset: 0,
    debt: 0,
    carValue: 0,
    ltciGrade: "none",
    mealDifficulty: false,
    dressingDifficulty: false,
    toiletDifficulty: false,
    mobilityDifficulty: false,
    dementiaDiagnosis: false,
  };

  let state = { ...initialState };
  let activePreset = "living-with-child";

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function judgementLabel(judgement) {
    return JUDGEMENT_LABELS[judgement] || "추가 정보 필요";
  }

  function withMissingInputs(id, extra) {
    const base = cfg.missingInputHints[id] || [];
    return extra ? [...extra, ...base] : base;
  }

  function judgeBasicPension(s) {
    const householdType = s.isCouple ? "couple" : "single";
    const threshold = cfg.bpec.selectionThreshold[householdType];
    const assetDeduction = cfg.bpec.basicAssetDeduction[s.region] ?? 0;

    const myWorkIncome = Math.max(s.earnedIncome - cfg.bpec.workIncomeDeduction, 0) * cfg.bpec.workIncomeRate;
    const spouseWorkIncome = s.isCouple ? Math.max(s.spouseEarnedIncome - cfg.bpec.workIncomeDeduction, 0) * cfg.bpec.workIncomeRate : 0;
    const totalOtherIncome = s.otherIncome + s.publicPension + (s.isCouple ? s.spouseOtherIncome + s.spousePublicPension : 0);

    const totalFinancialAsset = s.financialAsset + (s.isCouple ? s.spouseFinancialAsset : 0);
    const assetBase = Math.max(s.realEstate + totalFinancialAsset - s.debt - assetDeduction - cfg.bpec.financialAssetDeduction, 0);
    const assetMonthlyIncome = (assetBase * cfg.bpec.assetConversionRateAnnual) / 12;
    const incomeRecognized = myWorkIncome + spouseWorkIncome + totalOtherIncome + assetMonthlyIncome;

    const ratio = incomeRecognized / threshold;
    let judgement = "unlikely";
    if (ratio <= 0.95) judgement = "likely";
    else if (ratio <= 1.05) judgement = "borderline";

    const estimatedMonthlyBenefit = judgement === "likely" ? cfg.bpec.maxBenefit[householdType] : 0;
    const spouseMissing = s.isCouple && s.spouseEarnedIncome === 0 && s.spousePublicPension === 0 && s.spouseFinancialAsset === 0;

    return {
      id: "basicPension",
      label: "기초연금",
      benefitType: "cash",
      judgement,
      reasonSummary:
        judgement === "likely"
          ? `추정 소득인정액 ${manwon(incomeRecognized)} · 선정기준 ${manwon(threshold)} 대비 여유`
          : judgement === "borderline"
            ? `추정 소득인정액 ${manwon(incomeRecognized)} · 선정기준 근접`
            : `추정 소득인정액 ${manwon(incomeRecognized)} · 선정기준 ${manwon(threshold)} 초과`,
      missingInputs: withMissingInputs("basicPension", spouseMissing ? ["배우자 소득·재산(부부가구 미입력)"] : null),
      applicationAgency: cfg.applicationAgency.basicPension,
      detailLinkHref: "/tools/basic-pension-eligibility-calculator/",
      estimatedMonthlyBenefit,
      accuracyNote: spouseMissing ? "배우자 소득·재산이 입력되지 않아 판정 정확도가 낮습니다." : null,
    };
  }

  function judgeLtci(s) {
    const functionalCount = [s.mealDifficulty, s.dressingDifficulty, s.toiletDifficulty, s.mobilityDifficulty, s.dementiaDiagnosis].filter(Boolean).length;

    if (s.ltciGrade !== "none") {
      const gradeRow = cfg.ltciGrades.find((row) => row.grade === s.ltciGrade);
      return {
        id: "ltci",
        label: "장기요양보험",
        benefitType: "service",
        judgement: "likely",
        reasonSummary: gradeRow ? `${gradeRow.label} 보유 — 월 재가급여 한도 ${manwon(gradeRow.homeCareLimit)} 적용` : `${s.ltciGrade}등급 보유`,
        missingInputs: [],
        applicationAgency: cfg.applicationAgency.ltci,
        detailLinkHref: "/tools/ltci-grade-benefit-calculator-2026/",
        estimatedMonthlyBenefit: 0,
      };
    }

    if (functionalCount >= 1) {
      return {
        id: "ltci",
        label: "장기요양보험",
        benefitType: "service",
        judgement: "needsCheck",
        reasonSummary: `등급 미보유 · 일상생활 도움 필요 항목 ${functionalCount}개 — 인정신청 검토 권장`,
        missingInputs: withMissingInputs("ltci"),
        applicationAgency: cfg.applicationAgency.ltci,
        detailLinkHref: "/tools/ltci-grade-benefit-calculator-2026/",
        estimatedMonthlyBenefit: 0,
      };
    }

    return {
      id: "ltci",
      label: "장기요양보험",
      benefitType: "service",
      judgement: "unlikely",
      reasonSummary: "등급 미보유 · 입력한 건강 정보상 필요성이 낮게 나타남",
      missingInputs: withMissingInputs("ltci"),
      applicationAgency: cfg.applicationAgency.ltci,
      detailLinkHref: "/tools/ltci-grade-benefit-calculator-2026/",
      estimatedMonthlyBenefit: 0,
    };
  }

  function judgeSeniorJob(s) {
    const judgement = s.age >= 65 ? "needsCheck" : "unlikely";
    return {
      id: "seniorJob",
      label: "노인일자리",
      benefitType: "participation",
      judgement,
      reasonSummary:
        judgement === "needsCheck"
          ? "연령 조건 충족 가능성 있음 — 사업유형·지역별 모집 자격은 별도 확인 필요"
          : "연령 기준 미충족(만 65세 이상 대상)",
      missingInputs: judgement === "needsCheck" ? withMissingInputs("seniorJob") : [],
      applicationAgency: cfg.applicationAgency.seniorJob,
      detailLinkHref: "/tools/senior-job-salary-calculator-2026/",
      estimatedMonthlyBenefit: 0,
      note: "노인일자리 활동비는 근로·활동의 대가로, 현금급여 합계에는 포함하지 않습니다.",
    };
  }

  function judgeLivelihoodGroup(s) {
    const householdSize = Math.max(1, Math.min(6, s.householdSize || (s.isCouple ? 2 : 1)));
    const threshold = cfg.wbe.thresholds.find((t) => t.householdSize === householdSize) || cfg.wbe.thresholds[0];
    const assetDeduction = cfg.wbe.assetDeductionByRegion[s.region] ?? 0;

    const myEarned = s.earnedIncome + (s.isCouple ? s.spouseEarnedIncome : 0);
    const incomeAfterDeduction = Math.max(myEarned - myEarned * 0.3, 0) + s.otherIncome + s.publicPension + (s.isCouple ? s.spouseOtherIncome + s.spousePublicPension : 0);
    const totalAsset = s.realEstate + s.financialAsset + (s.isCouple ? s.spouseFinancialAsset : 0);
    const assetBase = Math.max(totalAsset - s.debt - assetDeduction, 0);
    const assetMonthlyIncome = assetBase * (cfg.wbe.rates.financialAsset ?? 0.0626);
    const incomeRecognized = incomeAfterDeduction + assetMonthlyIncome;

    const defs = [
      { type: "livelihood", label: "생계급여", benefitType: "cash" },
      { type: "medical", label: "의료급여", benefitType: "service" },
      { type: "housing", label: "주거급여", benefitType: "cash" },
    ];

    return defs.map(({ type, label, benefitType }) => {
      const t = threshold[type];
      const ratio = incomeRecognized / t;
      let judgement = "unlikely";
      if (ratio <= 0.95) judgement = "likely";
      else if (ratio <= 1.05) judgement = "borderline";
      return {
        id: type,
        label,
        benefitType,
        judgement,
        reasonSummary:
          judgement === "likely"
            ? `추정 소득인정액 ${manwon(incomeRecognized)} · ${householdSize}인 가구 선정기준(${manwon(t)}) 이내`
            : judgement === "borderline"
              ? `선정기준(${manwon(t)}) 근접`
              : `선정기준(${manwon(t)}) 초과 추정`,
        missingInputs: withMissingInputs(type),
        applicationAgency: cfg.applicationAgency[type],
        detailLinkHref: "/tools/welfare-benefit-eligibility/",
        estimatedMonthlyBenefit: type === "livelihood" && judgement === "likely" ? Math.max(t - incomeRecognized, 0) : 0,
      };
    });
  }

  function judgeSeniorRentalGroup() {
    return (cfg.housingTypes || []).map((housingType) => ({
      id: `seniorRental-${housingType.id}`,
      label: housingType.name,
      benefitType: "participation",
      judgement: "needsCheck",
      reasonSummary: `${housingType.target} · 경쟁도 ${housingType.difficulty} — 모집공고 확인 필요`,
      missingInputs: withMissingInputs("seniorRental"),
      applicationAgency: cfg.applicationAgency.seniorRental,
      detailLinkHref: "/tools/senior-rental-housing-eligibility-calculator-2026/",
      estimatedMonthlyBenefit: 0,
    }));
  }

  function judgeReduction(basicPensionStatus, livelihoodStatus) {
    const likelyBase = basicPensionStatus.judgement === "likely" || livelihoodStatus.judgement === "likely";
    return {
      id: "reduction",
      label: "교통비·통신비·에너지 감면",
      benefitType: "service",
      judgement: "needsCheck",
      reasonSummary: likelyBase
        ? "기초연금·기초생활수급 대상과 연계되는 감면이 있을 수 있으나 항목별 신청 여부 확인 필요"
        : "감면 항목별로 대상 기준이 달라 별도 확인 필요",
      missingInputs: ["감면 항목별 신청 여부"],
      applicationAgency: cfg.applicationAgency.reduction,
      detailLinkHref: "/reports/2026-government-welfare-benefits/",
      estimatedMonthlyBenefit: 0,
      note: "감면은 자동 적용되지 않는 경우가 있습니다. 통신사·전기가스 공급기관·주민센터에 신청 여부를 확인하세요.",
    };
  }

  function calculate(s) {
    const basicPension = judgeBasicPension(s);
    const ltci = judgeLtci(s);
    const seniorJob = judgeSeniorJob(s);
    const livelihoodGroup = judgeLivelihoodGroup(s);
    const seniorRentalGroup = judgeSeniorRentalGroup();
    const livelihood = livelihoodGroup.find((x) => x.id === "livelihood");
    const housing = livelihoodGroup.find((x) => x.id === "housing");
    const reduction = judgeReduction(basicPension, livelihood);

    const statuses = [basicPension, ltci, seniorJob, ...livelihoodGroup, ...seniorRentalGroup, reduction];

    const likelyCount = statuses.filter((x) => x.judgement === "likely").length;
    const needsCheckCount = statuses.filter((x) => x.judgement === "needsCheck" || x.judgement === "borderline").length;
    const unlikelyCount = statuses.filter((x) => x.judgement === "unlikely").length;
    const estimatedMonthlyCashBenefit =
      (basicPension.estimatedMonthlyBenefit || 0) + (livelihood?.estimatedMonthlyBenefit || 0) + (housing?.estimatedMonthlyBenefit || 0);

    return { statuses, likelyCount, needsCheckCount, unlikelyCount, estimatedMonthlyCashBenefit };
  }

  function renderSummary(result) {
    $("#pwdLikelyCount").textContent = `${result.likelyCount}개`;
    $("#pwdCashBenefit").textContent = manwon(result.estimatedMonthlyCashBenefit);
    $("#pwdNeedsCheckCount").textContent = `${result.needsCheckCount}개`;
    $("#pwdUnlikelyCount").textContent = `${result.unlikelyCount}개`;
  }

  function renderGroupedMatrix(result) {
    const container = $("#pwdGroupedMatrix");
    if (!container) return;

    container.innerHTML = BENEFIT_TYPE_ORDER.map((type) => {
      const items = result.statuses.filter((s) => s.benefitType === type);
      if (!items.length) return "";
      const cards = items
        .map(
          (item) => `
          <article class="pwd-matrix-card">
            <div class="pwd-matrix-card__head">
              <span class="pwd-matrix-card__title">${item.label}</span>
              <span class="pwd-status-badge pwd-status-badge--${item.judgement}">${judgementLabel(item.judgement)}</span>
            </div>
            <p class="pwd-matrix-card__reason">${item.reasonSummary}</p>
            ${item.accuracyNote ? `<p class="pwd-matrix-card__accuracy">⚠️ ${item.accuracyNote}</p>` : ""}
            ${item.note ? `<p class="pwd-matrix-card__note">${item.note}</p>` : ""}
            ${
              item.missingInputs && item.missingInputs.length
                ? `<p class="pwd-matrix-card__missing"><strong>참고할 추가 정보:</strong> ${item.missingInputs.join(", ")}</p>`
                : ""
            }
            <div class="pwd-matrix-card__footer">
              <span class="pwd-matrix-card__agency">${item.applicationAgency}</span>
              <a class="pwd-matrix-card__link" href="${item.detailLinkHref}">자세히 보기 →</a>
            </div>
          </article>
        `
        )
        .join("");

      return `
        <section class="pwd-benefit-group">
          <h3 class="pwd-benefit-group__title">${BENEFIT_TYPE_LABELS[type]}</h3>
          <div class="pwd-matrix-grid">${cards}</div>
        </section>
      `;
    }).join("");
  }

  function renderNextActions(result) {
    const container = $("#pwdNextActions");
    if (!container) return;

    const priorityItems = result.statuses
      .filter((item) => item.judgement === "needsCheck" || item.judgement === "borderline" || item.judgement === "likely")
      .sort((a, b) => {
        const rank = { likely: 0, borderline: 1, needsCheck: 2, unlikely: 3 };
        return rank[a.judgement] - rank[b.judgement];
      })
      .slice(0, 3);

    if (!priorityItems.length) {
      container.innerHTML = "";
      return;
    }

    const rows = priorityItems
      .map(
        (item, index) => `
        <article class="pwd-action-card">
          <p class="pwd-action-card__rank">${index + 1}순위 · ${item.label}</p>
          <p class="pwd-action-card__desc">${item.accuracyNote || item.reasonSummary}</p>
          <p class="pwd-action-card__agency">문의: ${item.applicationAgency}</p>
        </article>
      `
      )
      .join("");

    container.innerHTML = `
      <h3 class="pwd-next-actions__title">다음 행동</h3>
      <div class="pwd-action-grid">${rows}</div>
    `;
  }

  function renderMessage(result) {
    const icon = { likely: "✅", borderline: "🔶", needsCheck: "🔍", unlikely: "❌" };
    const lines = result.statuses.map((item) => `${icon[item.judgement] || ""} ${item.label} — ${judgementLabel(item.judgement)}`);
    lines.push("이 결과는 자가 점검용 추정이며 공식 판정이 아닙니다. 복지로 모의계산과 다를 수 있습니다.");
    $("#pwdMessage").textContent = lines.join("\n");
  }

  function renderConditionalFields() {
    $$('[data-pwd-conditional="spouse"]').forEach((el) => {
      el.hidden = !state.isCouple;
    });
  }

  function readInputs() {
    state.age = num($('[data-pwd="age"]')?.value, 68);
    state.householdSize = num($('[data-pwd="householdSize"]')?.value, 1);
    state.isCouple = $('[data-pwd="isCouple"]')?.checked ?? false;
    state.spouseAge = num($('[data-pwd="spouseAge"]')?.value, 65);
    state.region = $('[data-pwd="region"]')?.value || "city";
    state.housingOwnership = $('[data-pwd="housingOwnership"]')?.value || "current";

    state.earnedIncome = Math.max(num($('[data-pwd="earnedIncome"]')?.value, 0), 0);
    state.publicPension = Math.max(num($('[data-pwd="publicPension"]')?.value, 0), 0);
    state.otherIncome = Math.max(num($('[data-pwd="otherIncome"]')?.value, 0), 0);
    state.spouseEarnedIncome = Math.max(num($('[data-pwd="spouseEarnedIncome"]')?.value, 0), 0);
    state.spousePublicPension = Math.max(num($('[data-pwd="spousePublicPension"]')?.value, 0), 0);
    state.spouseOtherIncome = Math.max(num($('[data-pwd="spouseOtherIncome"]')?.value, 0), 0);

    state.realEstate = Math.max(num($('[data-pwd="realEstate"]')?.value, 0), 0);
    state.financialAsset = Math.max(num($('[data-pwd="financialAsset"]')?.value, 0), 0);
    state.spouseFinancialAsset = Math.max(num($('[data-pwd="spouseFinancialAsset"]')?.value, 0), 0);
    state.debt = Math.max(num($('[data-pwd="debt"]')?.value, 0), 0);
    state.carValue = Math.max(num($('[data-pwd="carValue"]')?.value, 0), 0);

    state.ltciGrade = $('[data-pwd="ltciGrade"]')?.value || "none";
    state.mealDifficulty = $('[data-pwd="mealDifficulty"]')?.checked ?? false;
    state.dressingDifficulty = $('[data-pwd="dressingDifficulty"]')?.checked ?? false;
    state.toiletDifficulty = $('[data-pwd="toiletDifficulty"]')?.checked ?? false;
    state.mobilityDifficulty = $('[data-pwd="mobilityDifficulty"]')?.checked ?? false;
    state.dementiaDiagnosis = $('[data-pwd="dementiaDiagnosis"]')?.checked ?? false;
  }

  function setControl(key, value) {
    const el = $(`[data-pwd="${key}"]`);
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
      age: String(s.age),
      hh: String(s.householdSize),
      couple: s.isCouple ? "1" : "0",
      region: s.region,
      ltci: s.ltciGrade,
      earned: String(Math.round(s.earnedIncome)),
      public: String(Math.round(s.publicPension)),
      other: String(Math.round(s.otherIncome)),
      re: String(Math.round(s.realEstate)),
      fa: String(Math.round(s.financialAsset)),
      debt: String(Math.round(s.debt)),
      car: String(Math.round(s.carValue)),
      house: s.housingOwnership,
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return false;
    applyState({
      age: num(params.get("age"), initialState.age),
      householdSize: num(params.get("hh"), initialState.householdSize),
      isCouple: params.get("couple") === "1",
      region: params.get("region") || initialState.region,
      ltciGrade: params.get("ltci") || initialState.ltciGrade,
      earnedIncome: num(params.get("earned"), initialState.earnedIncome),
      publicPension: num(params.get("public"), initialState.publicPension),
      otherIncome: num(params.get("other"), initialState.otherIncome),
      realEstate: num(params.get("re"), initialState.realEstate),
      financialAsset: num(params.get("fa"), initialState.financialAsset),
      debt: num(params.get("debt"), initialState.debt),
      carValue: num(params.get("car"), initialState.carValue),
      housingOwnership: params.get("house") || initialState.housingOwnership,
    });
    return true;
  }

  function renderPresetState() {
    $$("[data-pwd-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.pwdPreset === activePreset);
    });
  }

  function applyPreset(id) {
    const preset = cfg.presets.find((item) => item.id === id);
    if (!preset) return;
    activePreset = id;
    applyState({ ...initialState, ...preset.input });
    renderConditionalFields();
    renderPresetState();
    update();
  }

  function update() {
    readInputs();
    renderConditionalFields();
    const result = calculate(state);
    renderSummary(result);
    renderGroupedMatrix(result);
    renderNextActions(result);
    renderMessage(result);
    updateUrl(state);
  }

  function bindEvents() {
    $$("[data-pwd]").forEach((el) => {
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

    $$("[data-pwd-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.pwdPreset));
    });

    document.getElementById("pwdResetBtn")?.addEventListener("click", () => applyPreset("living-with-child"));
    document.getElementById("pwdCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("pwdCopyBtn");
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

  const restored = restoreFromUrl();
  if (!restored) applyPreset(activePreset);
  bindEvents();
  renderPresetState();
  update();
})();
