(function () {
  const configEl = document.getElementById("itcpConfig");
  if (!configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const defaults = config.defaults || {};
  const presets = config.presets || [];
  const numberKeys = new Set([
    "contractMonths",
    "usedMonths",
    "monthlyFee",
    "monthlyDiscount",
    "deviceDiscount",
    "signupGift",
    "giftReturnThresholdMonths",
    "installFeeReturn",
    "deviceNonReturnFee",
    "newMonthlyFee",
    "newSignupGift",
    "newInstallFee",
    "bundleDiscountLossMonthly",
    "forfeitedRetentionBenefit",
  ]);
  const urlKeys = {
    productType: "type",
    contractMonths: "term",
    usedMonths: "used",
    monthlyFee: "fee",
    monthlyDiscount: "discount",
    deviceDiscount: "device",
    signupGift: "gift",
    giftReturnThresholdMonths: "giftMonth",
    giftReturnMode: "giftMode",
    installFeeReturn: "oldInstall",
    deviceNonReturnFee: "nonReturn",
    newMonthlyFee: "newFee",
    newSignupGift: "newGift",
    newInstallFee: "install",
    bundleDiscountLossMonthly: "bundleLoss",
    forfeitedRetentionBenefit: "retention",
  };
  const statusLabels = {
    goodToSwitch: "갈아타기 검토",
    checkAgain: "재확인 필요",
    likelyLoss: "손해 가능성",
    contractEnded: "약정 만료",
  };

  let state = { ...defaults };

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatKrw(value) {
    const rounded = Math.round(value || 0);
    const sign = rounded < 0 ? "-" : "";
    return `${sign}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
  }

  function formatPercent(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function normalize(input) {
    const merged = { ...defaults, ...input };
    const contractMonths = clamp(Math.round(toNumber(merged.contractMonths, defaults.contractMonths || 36)), 1, 60);
    const usedMonths = clamp(Math.round(toNumber(merged.usedMonths, defaults.usedMonths || 0)), 0, contractMonths);
    const normalized = { ...merged, contractMonths, usedMonths };
    numberKeys.forEach((key) => {
      if (key === "contractMonths" || key === "usedMonths") return;
      normalized[key] = Math.max(0, Math.round(toNumber(normalized[key], defaults[key] || 0)));
    });
    return normalized;
  }

  function getReturnRate(input) {
    if (!input.contractMonths) return 0;
    return clamp((input.contractMonths - input.usedMonths) / input.contractMonths, 0, 1);
  }

  function calculateGiftReturn(input) {
    if (input.giftReturnMode === "none" || input.signupGift <= 0) return 0;
    if (input.giftReturnMode === "fullBeforeThreshold") {
      return input.usedMonths < input.giftReturnThresholdMonths ? input.signupGift : 0;
    }
    return Math.round(input.signupGift * getReturnRate(input));
  }

  function calculatePenalty(rawInput) {
    const input = normalize(rawInput);
    const remainingMonths = Math.max(0, input.contractMonths - input.usedMonths);
    const returnRate = getReturnRate(input);
    const contractDiscountReturn = Math.round(input.monthlyDiscount * remainingMonths * returnRate);
    const deviceDiscountReturn = Math.round(input.deviceDiscount * remainingMonths * returnRate);
    const giftReturn = calculateGiftReturn(input);
    const totalPenalty =
      contractDiscountReturn +
      deviceDiscountReturn +
      giftReturn +
      input.installFeeReturn +
      input.deviceNonReturnFee;

    return {
      input,
      remainingMonths,
      returnRate,
      contractDiscountReturn,
      deviceDiscountReturn,
      giftReturn,
      installFeeReturn: input.installFeeReturn,
      deviceNonReturnFee: input.deviceNonReturnFee,
      totalPenalty,
      breakdown: [
        ["contractDiscountReturn", "약정 할인반환금", contractDiscountReturn, "월 약정할인액과 남은 약정기간을 기준으로 추정했습니다."],
        ["deviceDiscountReturn", "장비 할인반환금", deviceDiscountReturn, "셋톱박스·공유기 임대료 할인 반환 가능분입니다."],
        ["giftReturn", "사은품 반환", giftReturn, "가입 사은품 유지 조건을 기준으로 계산했습니다."],
        ["installFeeReturn", "설치비 반환", input.installFeeReturn, "면제받은 설치비가 청구되는 경우를 반영합니다."],
        ["deviceNonReturnFee", "장비 미반납 비용", input.deviceNonReturnFee, "장비 분실·미반납 시 추가될 수 있는 비용입니다."],
      ].map(([id, label, amount, description]) => ({ id, label, amount, description })),
    };
  }

  function getStatus(penalty, totalSwitchProfit) {
    if (penalty.remainingMonths === 0) return "contractEnded";
    if (totalSwitchProfit >= 100000) return "goodToSwitch";
    if (totalSwitchProfit < 0) return "likelyLoss";
    return "checkAgain";
  }

  function getHeadline(status, totalSwitchProfit) {
    if (status === "contractEnded") return "약정기간을 채운 상태라 해지 부담이 낮습니다";
    if (status === "goodToSwitch") return `예상 순이익이 ${formatKrw(totalSwitchProfit)}입니다`;
    if (status === "likelyLoss") return `지금 갈아타면 ${formatKrw(Math.abs(totalSwitchProfit))} 손해 가능성이 있습니다`;
    return "사은품 조건과 재약정 혜택을 한 번 더 확인하세요";
  }

  function getAdvice(status, penalty) {
    if (status === "contractEnded") {
      return "약정기간을 이미 채웠다면 약정 할인반환금은 낮게 잡힙니다. 장비 반납과 미납요금만 확인하세요.";
    }
    if (status === "goodToSwitch") {
      return "신규 사은품과 남은 기간 절감액이 위약금보다 큽니다. 단, 실제 해지 전 고객센터에서 최종 위약금을 확인하세요.";
    }
    if (status === "likelyLoss") {
      return "위약금과 포기하는 혜택이 더 큽니다. 약정 종료가 가까우면 만료 후 이동하거나 재약정 혜택을 비교하는 편이 낫습니다.";
    }
    if (penalty.giftReturn > 0) {
      return "사은품 반환 조건이 손익을 크게 바꾸는 구간입니다. 가입처의 유지 조건 개월 수를 먼저 확인하세요.";
    }
    return "차이가 크지 않습니다. 신규 설치비, 결합할인 손실, 재약정 상품권까지 넣어 다시 비교하세요.";
  }

  function calculate(rawInput) {
    const penalty = calculatePenalty(rawInput);
    const input = penalty.input;
    const monthlySaving = input.monthlyFee - input.newMonthlyFee - input.bundleDiscountLossMonthly;
    const remainingTermSaving = monthlySaving * penalty.remainingMonths;
    const immediateNetProfit =
      input.newSignupGift - penalty.totalPenalty - input.newInstallFee - input.forfeitedRetentionBenefit;
    const totalSwitchProfit = immediateNetProfit + remainingTermSaving;
    const breakEvenBase =
      penalty.totalPenalty + input.newInstallFee + input.forfeitedRetentionBenefit - input.newSignupGift;
    const breakEvenMonths = monthlySaving > 0 ? Math.max(0, Math.ceil(breakEvenBase / monthlySaving)) : null;
    const status = getStatus(penalty, totalSwitchProfit);
    return {
      penalty,
      monthlySaving,
      remainingTermSaving,
      immediateNetProfit,
      totalSwitchProfit,
      breakEvenMonths,
      status,
      headline: getHeadline(status, totalSwitchProfit),
      advice: getAdvice(status, penalty),
    };
  }

  function setOutput(key, value) {
    document.querySelectorAll(`[data-itcp-output="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  function syncControls() {
    document.querySelectorAll("[data-itcp-input]").forEach((el) => {
      const key = el.dataset.itcpInput;
      if (!key) return;
      if (el.type === "range" || el.type === "number" || el.tagName === "SELECT") {
        el.value = String(state[key]);
      }
      if (key === "usedMonths") {
        el.max = String(state.contractMonths);
      }
    });

    document.querySelectorAll("[data-itcp-product]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.itcpProduct === state.productType);
    });
    document.querySelectorAll("[data-itcp-contract]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.itcpContract) === state.contractMonths);
    });
  }

  function renderBreakdown(penalty) {
    const wrapper = document.querySelector("[data-itcp-breakdown]");
    if (wrapper) {
      wrapper.innerHTML = penalty.breakdown
        .map(
          (item) => `
            <article class="itcp-breakdown-card">
              <span>${item.label}</span>
              <strong>${formatKrw(item.amount)}</strong>
              <p>${item.description}</p>
            </article>
          `,
        )
        .join("");
    }

    const bar = document.querySelector("[data-itcp-bar]");
    if (bar) {
      if (penalty.totalPenalty <= 0) {
        bar.innerHTML = '<span class="itcp-bar__empty">예상 위약금이 없습니다</span>';
      } else {
        bar.innerHTML = penalty.breakdown
          .filter((item) => item.amount > 0)
          .map((item) => {
            const width = Math.max(4, Math.round((item.amount / penalty.totalPenalty) * 100));
            return `<span class="itcp-bar__segment itcp-bar__segment--${item.id}" style="width:${width}%" title="${item.label} ${formatKrw(item.amount)}"></span>`;
          })
          .join("");
      }
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();
    Object.entries(urlKeys).forEach(([key, param]) => {
      if (state[key] !== defaults[key]) {
        params.set(param, String(state[key]));
      }
    });
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function render() {
    state = normalize(state);
    const result = calculate(state);
    state = result.penalty.input;

    const statusBox = document.querySelector("[data-itcp-status]");
    if (statusBox) statusBox.dataset.itcpStatus = result.status;

    setOutput("statusLabel", statusLabels[result.status] || "재확인 필요");
    setOutput("headline", result.headline);
    setOutput("advice", result.advice);
    setOutput("totalPenalty", formatKrw(result.penalty.totalPenalty));
    setOutput("totalSwitchProfit", formatKrw(result.totalSwitchProfit));
    setOutput("breakEvenMonths", result.breakEvenMonths === null ? "회수 어려움" : result.breakEvenMonths === 0 ? "즉시 이득" : `${result.breakEvenMonths}개월`);
    setOutput("giftReturn", formatKrw(result.penalty.giftReturn));
    setOutput("remainingMonths", `${result.penalty.remainingMonths}개월`);
    setOutput("returnRate", formatPercent(result.penalty.returnRate));
    setOutput("monthlySaving", formatKrw(result.monthlySaving));
    setOutput("immediateNetProfit", formatKrw(result.immediateNetProfit));
    setOutput("remainingTermSaving", formatKrw(result.remainingTermSaving));

    renderBreakdown(result.penalty);
    syncControls();
    updateUrl();
  }

  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    Object.entries(urlKeys).forEach(([key, param]) => {
      if (!params.has(param)) return;
      const raw = params.get(param);
      state[key] = numberKeys.has(key) ? toNumber(raw, defaults[key] || 0) : raw;
    });
    state = normalize(state);
  }

  function bindEvents() {
    document.querySelectorAll("[data-itcp-input]").forEach((el) => {
      const eventName = el.type === "range" ? "input" : "change";
      el.addEventListener(eventName, () => {
        const key = el.dataset.itcpInput;
        state[key] = numberKeys.has(key) ? toNumber(el.value, defaults[key] || 0) : el.value;
        render();
      });
      if (el.type === "number") {
        el.addEventListener("input", () => {
          const key = el.dataset.itcpInput;
          state[key] = toNumber(el.value, defaults[key] || 0);
          render();
        });
      }
    });

    document.querySelectorAll("[data-itcp-product]").forEach((button) => {
      button.addEventListener("click", () => {
        state.productType = button.dataset.itcpProduct;
        render();
      });
    });

    document.querySelectorAll("[data-itcp-contract]").forEach((button) => {
      button.addEventListener("click", () => {
        state.contractMonths = toNumber(button.dataset.itcpContract, defaults.contractMonths || 36);
        state.usedMonths = Math.min(state.usedMonths, state.contractMonths);
        render();
      });
    });

    document.querySelectorAll("[data-itcp-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets.find((item) => item.id === button.dataset.itcpPreset);
        if (!preset) return;
        state = normalize({ ...defaults, ...(preset.input || {}) });
        render();
      });
    });

    document.getElementById("itcpResetBtn")?.addEventListener("click", () => {
      state = normalize(defaults);
      render();
    });

    document.getElementById("itcpCopyLinkBtn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (error) {
        const textarea = document.createElement("textarea");
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
    });
  }

  restoreFromUrl();
  bindEvents();
  render();
})();
