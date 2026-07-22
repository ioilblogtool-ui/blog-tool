(() => {
  const root = document.querySelector(".sacc-page");
  const dataEl = document.getElementById("sacc-data");
  if (!root || !dataEl) return;

  const cfg = JSON.parse(dataEl.textContent || "{}");
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => Array.from(root.querySelectorAll(selector));

  const ACCOUNT_LABELS = { savings: "청약저축", deposit: "청약예금", installment: "청약부금" };

  const initialState = {
    accountType: "deposit",
    currentBalance: 15000000,
    currentRate: 2.1,
    yearsHeld: 8,
    yearsToHold: 3,
    targetHousing: "both",
    monthlyContribution: 0,
    taxRate: 16.5,
  };

  let state = { ...initialState };
  let activePreset = "old-deposit";
  let rateDirty = false;

  function num(value, fallback = 0) {
    const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function manwon(value) {
    return `${Math.round(value / 10000).toLocaleString("ko-KR")}만 원`;
  }

  function calcDaysUntilDeadline() {
    const today = new Date();
    const deadline = new Date(cfg.policyMeta.conversionDeadline);
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  }

  function calculate(s) {
    const interestBefore = s.currentBalance * (s.currentRate / 100) * s.yearsToHold;
    const interestAfter = s.currentBalance * (cfg.policyMeta.maxNewRatePercent / 100) * s.yearsToHold;
    const interestDiff = interestAfter - interestBefore;
    const housingRule = cfg.housingRules[s.accountType];
    const timing = cfg.applicationTiming[s.accountType];
    const daysUntilDeadline = calcDaysUntilDeadline();

    const annualContribution = s.monthlyContribution * 12;
    const deductionBase = Math.min(annualContribution, cfg.incomeDeductionMeta.annualLimit);
    const deductionAmount = deductionBase * cfg.incomeDeductionMeta.deductionRate;
    const estimatedTaxSaving = deductionAmount * (s.taxRate / 100);

    return {
      interestBefore,
      interestAfter,
      interestDiff,
      housingRule,
      timing,
      daysUntilDeadline,
      isPastDeadline: daysUntilDeadline < 0,
      annualContribution,
      deductionAmount,
      estimatedTaxSaving,
    };
  }

  function getRecommendation(s) {
    const existingKey = s.accountType === "savings" ? "national" : "private";
    if (s.targetHousing === "both") {
      return {
        level: "conditional",
        levelLabel: "조건부 추천",
        text: `현재 ${ACCOUNT_LABELS[s.accountType]}의 실적은 ${cfg.housingRules[s.accountType].existingHousing} 청약에 그대로 인정됩니다. 국민·민영주택을 모두 검토한다면 전환 가치가 있지만, 새롭게 가능해지는 주택 유형은 전환일 이후 실적만 인정된다는 점을 함께 고려하세요.`,
      };
    }
    if (s.targetHousing === existingKey) {
      return {
        level: "caution",
        levelLabel: "신중 검토",
        text: `현재 통장으로 이미 ${cfg.housingRules[s.accountType].existingHousing} 청약 자격을 갖추고 있어 전환의 실익이 크지 않을 수 있습니다. 금리 차이와 기존 통장의 우대 조건을 먼저 비교하세요.`,
      };
    }
    return {
      level: "positive",
      levelLabel: "전환 검토 필요",
      text: `목표로 하는 ${cfg.housingRules[s.accountType].newHousing} 청약은 현재 통장으로는 불가능합니다. 전환하면 청약 자격 자체는 생기지만, 해당 유형의 실적은 전환일 이후부터 새로 쌓인다는 점(${cfg.housingRules[s.accountType].newRecognition})을 감안해 신청 일정을 계획하세요.`,
    };
  }

  function renderDeadlineBadge(result) {
    const el = $('[data-sacc-target="deadline-badge"]');
    if (!el) return;
    if (result.isPastDeadline) {
      el.textContent = "전환 마감이 지났을 수 있습니다 — 최신 공지 확인 필요";
      el.classList.add("is-past");
    } else {
      el.textContent = `제도상 전환 마감 D-${result.daysUntilDeadline} (${cfg.policyMeta.conversionDeadline}까지) · 개별 청약 전환은 더 일찍 필요할 수 있음`;
      el.classList.remove("is-past");
    }
  }

  function renderCompareCards(result) {
    $("#saccCompareGrid").innerHTML = `
      <article class="sacc-compare-col sacc-compare-col--before">
        <h3>전환 전(세전 단리)</h3>
        <strong>금리 ${state.currentRate}%</strong>
        <p>예상이자 ${manwon(result.interestBefore)}</p>
        <p>${result.housingRule.existingHousing} 청약 가능</p>
      </article>
      <article class="sacc-compare-col sacc-compare-col--after">
        <h3>전환 후(세전 단리)</h3>
        <strong>금리 ${cfg.policyMeta.maxNewRatePercent}%</strong>
        <p>예상이자 ${manwon(result.interestAfter)}</p>
        <p>${result.housingRule.existingHousing} + ${result.housingRule.newHousing}</p>
      </article>
    `;
    const sign = result.interestDiff >= 0 ? "+" : "-";
    $("#saccDiffBanner").textContent = `세전 단리 기준 이자 차이: ${sign}${manwon(Math.abs(result.interestDiff))}`;
  }

  function renderDeductionCard(result, s) {
    const el = $("#saccDeductionCard");
    if (!el) return;
    if (s.monthlyContribution <= 0) {
      el.innerHTML = `<p class="sacc-deduction-empty">월 추가 납입액을 입력하면 예상 소득공제 효과를 확인할 수 있습니다.</p>`;
      return;
    }
    el.innerHTML = `
      <h3>예상 소득공제 효과</h3>
      <div class="sacc-deduction-grid">
        <div><span>연간 납입액</span><strong>${manwon(result.annualContribution)}</strong></div>
        <div><span>소득공제 대상금액(연 300만 원 한도의 40%)</span><strong>${manwon(result.deductionAmount)}</strong></div>
        <div><span>선택한 한계세율 ${s.taxRate}% 적용 시 예상 절세효과</span><strong>${manwon(result.estimatedTaxSaving)}</strong></div>
      </div>
      <p class="sacc-deduction-note">${cfg.incomeDeductionMeta.eligibilityNote} 소득공제액은 과세 대상 소득에서 차감되는 금액이며, 절세액을 그대로 환급받는 것이 아닙니다.</p>
    `;
  }

  function renderRuleTable(result, s) {
    const table = $("#saccRuleTable");
    if (!table) return;
    table.innerHTML = `
      <thead>
        <tr><th></th><th>기존에 가능했던 주택</th><th>전환으로 새롭게 가능해진 주택</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>대상 주택</td>
          <td>${result.housingRule.existingHousing}</td>
          <td>${result.housingRule.newHousing}</td>
        </tr>
        <tr>
          <td>실적 인정 방식</td>
          <td>${result.housingRule.existingRecognition}</td>
          <td>${result.housingRule.newRecognition}</td>
        </tr>
      </tbody>
    `;
    $("#saccTimingNote").textContent = `${ACCOUNT_LABELS[s.accountType]}은 ${result.timing.label}. 마감일(9/30)과 별개로 확인하세요.`;
  }

  function renderRecommendation(s) {
    const rec = getRecommendation(s);
    const el = $("#saccRecommendationCard");
    if (!el) return;
    el.className = `sacc-recommendation-card sacc-recommendation-card--${rec.level}`;
    el.innerHTML = `<p class="sacc-recommendation-level">${rec.levelLabel}</p><p class="sacc-recommendation-text">${rec.text}</p>`;
  }

  function renderMessage(result, s) {
    const lines = [
      `${ACCOUNT_LABELS[s.accountType]} ${manwon(s.currentBalance)}을 ${s.yearsHeld}년째 보유 중이며 현재 금리 ${s.currentRate}% 기준으로 ${s.yearsToHold}년 더 보유하면 세전 단순 예상 이자는 약 ${manwon(result.interestBefore)}입니다.`,
      `주택청약종합저축으로 전환하면 최대 금리 ${cfg.policyMeta.maxNewRatePercent}% 적용 시 ${s.yearsToHold}년 세전 예상 이자는 약 ${manwon(result.interestAfter)}으로, 금리 차이에 따른 이자 증가는 약 ${manwon(Math.abs(result.interestDiff))}입니다.`,
      `전환해도 ${result.housingRule.existingHousing} 청약 실적(${result.housingRule.existingRecognition})은 그대로 인정되지만, 새롭게 가능해지는 ${result.housingRule.newHousing}은 실적 인정 방식이 다릅니다(${result.housingRule.newRecognition}). 이 점을 꼭 확인하세요.`,
      `전환 후에는 기존 통장으로 되돌릴 수 없습니다. 제도상 전환 마감은 ${cfg.policyMeta.conversionDeadline}까지이며, ${ACCOUNT_LABELS[s.accountType]}은 ${result.timing.label}.`,
    ];
    $("#saccMessage").textContent = lines.join(" ");
  }

  function readInputs() {
    state.accountType = $('[data-sacc="accountType"]')?.value || "deposit";
    state.currentBalance = Math.max(num($('[data-sacc="currentBalance"]')?.value, 15000000), 0);
    state.currentRate = Math.max(num($('[data-sacc="currentRate"]')?.value, 2.1), 0);
    state.yearsHeld = Math.max(num($('[data-sacc="yearsHeld"]')?.value, 8), 0);
    state.yearsToHold = Math.max(num($('[data-sacc="yearsToHold"]')?.value, 3), 0);
    state.targetHousing = $('[data-sacc="targetHousing"]')?.value || "both";
    state.monthlyContribution = Math.max(num($('[data-sacc="monthlyContribution"]')?.value, 0), 0);
    state.taxRate = num($('[data-sacc="taxRate"]')?.value, 16.5);
  }

  function setControl(key, value) {
    const el = $(`[data-sacc="${key}"]`);
    if (!el) return;
    if (el.classList.contains("input-number")) {
      el.value = typeof value === "number" ? value.toLocaleString("ko-KR") : String(value);
    } else {
      el.value = String(value);
    }
  }

  function applyState(nextState) {
    Object.entries(nextState).forEach(([key, value]) => setControl(key, value));
  }

  function onAccountTypeChange() {
    const type = $('[data-sacc="accountType"]')?.value;
    if (!rateDirty && type) {
      setControl("currentRate", cfg.defaultRateByType[type]);
    }
  }

  function updateUrl(s) {
    const params = new URLSearchParams({
      type: s.accountType,
      balance: String(Math.round(s.currentBalance)),
      rate: String(s.currentRate),
      held: String(s.yearsHeld),
      hold: String(s.yearsToHold),
      target: s.targetHousing,
      contrib: String(Math.round(s.monthlyContribution)),
      tax: String(s.taxRate),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) return false;
    applyState({
      accountType: params.get("type") || initialState.accountType,
      currentBalance: num(params.get("balance"), initialState.currentBalance),
      currentRate: num(params.get("rate"), initialState.currentRate),
      yearsHeld: num(params.get("held"), initialState.yearsHeld),
      yearsToHold: num(params.get("hold"), initialState.yearsToHold),
      targetHousing: params.get("target") || initialState.targetHousing,
      monthlyContribution: num(params.get("contrib"), initialState.monthlyContribution),
      taxRate: num(params.get("tax"), initialState.taxRate),
    });
    rateDirty = true;
    return true;
  }

  function renderPresetState() {
    $$("[data-sacc-preset]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.saccPreset === activePreset);
    });
  }

  function applyPreset(id) {
    const preset = cfg.presets.find((item) => item.id === id);
    if (!preset) return;
    activePreset = id;
    rateDirty = true;
    applyState({ ...initialState, ...preset.input });
    renderPresetState();
    update();
  }

  function update() {
    readInputs();
    const result = calculate(state);
    renderDeadlineBadge(result);
    renderCompareCards(result);
    renderDeductionCard(result, state);
    renderRuleTable(result, state);
    renderRecommendation(state);
    renderMessage(result, state);
    updateUrl(state);
  }

  function bindEvents() {
    $$("[data-sacc]").forEach((el) => {
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

    $('[data-sacc="accountType"]')?.addEventListener("change", onAccountTypeChange);
    $('[data-sacc="currentRate"]')?.addEventListener("input", () => {
      rateDirty = true;
    });

    $$("[data-sacc-preset]").forEach((button) => {
      button.addEventListener("click", () => applyPreset(button.dataset.saccPreset));
    });

    document.getElementById("saccResetBtn")?.addEventListener("click", () => {
      rateDirty = false;
      applyPreset("old-deposit");
    });
    document.getElementById("saccCopyBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const button = document.getElementById("saccCopyBtn");
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
