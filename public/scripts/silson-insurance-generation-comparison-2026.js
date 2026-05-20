(function () {
  const root = document.querySelector('[data-report="silson-insurance-generation-comparison-2026"]');
  if (!root) return;

  const formatter = new Intl.NumberFormat("ko-KR");
  const state = {
    selectedGeneration: "gen2",
    selectedAgeGroup: "30s",
    selectedUsageLevel: "medium",
    currentMonthlyPremium: 42000,
    targetMonthlyPremium: 18000,
    annualCoveredCost: 300000,
    annualNonCoveredCost: 500000,
    outpatientVisits: 6,
  };

  const matrix = {
    "20s": { low: "4세대/신규세대 검토", medium: "4세대 유지 검토", high: "특약 확인 후 판단" },
    "30s": { low: "보험료 절감 중심 검토", medium: "손익분기 계산 필요", high: "3대 비급여 이용액 확인" },
    "40s": { low: "기존 세대 유지도 검토", medium: "유지·전환 비교 필수", high: "기존 세대 유지 쪽 유리 가능" },
    "50s": { low: "신중", medium: "유지 우선 검토", high: "전환 신중, 약관 확인 우선" },
  };

  const generationSelect = root.querySelector("#sigc-generation-select");
  const ageSelect = root.querySelector("#sigc-age-group");
  const usageSelect = root.querySelector("#sigc-usage-level");
  const inputs = {
    currentMonthlyPremium: root.querySelector("#sigc-current-premium"),
    targetMonthlyPremium: root.querySelector("#sigc-target-premium"),
    annualCoveredCost: root.querySelector("#sigc-covered-cost"),
    annualNonCoveredCost: root.querySelector("#sigc-non-covered-cost"),
    outpatientVisits: root.querySelector("#sigc-outpatient-visits"),
  };

  function won(value) {
    return `${formatter.format(Math.round(value))}원`;
  }

  function calculateSwitchBreakEven(input) {
    const annualPremiumSaving = Math.max(input.currentMonthlyPremium - input.targetMonthlyPremium, 0) * 12;
    const estimatedExtraOutOfPocket =
      input.annualCoveredCost * 0.1 +
      input.annualNonCoveredCost * 0.1 +
      input.outpatientVisits * 10000;
    const netBenefit = annualPremiumSaving - estimatedExtraOutOfPocket;

    if (netBenefit >= 300000) {
      return {
        annualPremiumSaving,
        estimatedExtraOutOfPocket,
        netBenefit,
        tone: "positive",
        label: "전환 검토 가능",
        message: "보험료 절감 효과가 추가 본인부담 추정보다 큽니다. 단, 고액 비급여 예정이 있으면 약관을 먼저 확인하세요.",
      };
    }

    if (netBenefit >= 0) {
      return {
        annualPremiumSaving,
        estimatedExtraOutOfPocket,
        netBenefit,
        tone: "neutral",
        label: "비교 필요",
        message: "보험료 절감과 보장 축소가 비슷한 구간입니다. 최근 1년 비급여 이용액을 기준으로 다시 계산하세요.",
      };
    }

    return {
      annualPremiumSaving,
      estimatedExtraOutOfPocket,
      netBenefit,
      tone: "caution",
      label: "유지 우선 검토",
      message: "추가 본인부담 추정이 보험료 절감액보다 큽니다. 기존 세대 유지가 나을 수 있습니다.",
    };
  }

  function updateGenerationCards() {
    root.querySelectorAll("[data-generation-card]").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.generationCard === state.selectedGeneration);
    });
  }

  function updateMatrixMessage() {
    const result = matrix[state.selectedAgeGroup]?.[state.selectedUsageLevel] || "조건 확인 필요";
    const target = root.querySelector("#sigc-matrix-result");
    if (target) target.textContent = result;
  }

  function updateBreakEvenResult() {
    const result = calculateSwitchBreakEven(state);
    const box = root.querySelector("#sigc-break-even-result");
    const saving = root.querySelector("#sigc-switch-saving");
    const extra = root.querySelector("#sigc-extra-out-of-pocket");
    const net = root.querySelector("#sigc-net-benefit");
    const label = root.querySelector("#sigc-decision-label");
    const message = root.querySelector("#sigc-decision-message");

    if (box) box.dataset.tone = result.tone;
    if (saving) saving.textContent = won(result.annualPremiumSaving);
    if (extra) extra.textContent = won(result.estimatedExtraOutOfPocket);
    if (net) net.textContent = won(result.netBenefit);
    if (label) label.textContent = result.label;
    if (message) message.textContent = result.message;
  }

  function bindEvents() {
    if (generationSelect) {
      generationSelect.addEventListener("change", () => {
        state.selectedGeneration = generationSelect.value;
        updateGenerationCards();
      });
    }

    if (ageSelect) {
      ageSelect.addEventListener("change", () => {
        state.selectedAgeGroup = ageSelect.value;
        updateMatrixMessage();
      });
    }

    if (usageSelect) {
      usageSelect.addEventListener("change", () => {
        state.selectedUsageLevel = usageSelect.value;
        updateMatrixMessage();
      });
    }

    Object.entries(inputs).forEach(([key, input]) => {
      if (!input) return;
      input.addEventListener("input", () => {
        state[key] = Number(input.value || 0);
        updateBreakEvenResult();
      });
    });
  }

  bindEvents();
  updateGenerationCards();
  updateMatrixMessage();
  updateBreakEvenResult();
})();
