(function () {
  const root = document.querySelector(".hosp-page");
  const dataNode = document.getElementById("hosp-data");

  if (!root || !dataNode) return;

  const config = JSON.parse(dataNode.textContent || "{}");
  const rules = config.rules || {};
  const presets = config.presets || [];
  const targets = config.targets || [];
  const baseAmounts = rules.baseAmounts || {};
  const deadline = new Date(`${rules.secondRoundEnd || "2026-07-03"}T23:59:59+09:00`);

  const fields = {
    targetType: root.querySelector('[data-hosp="targetType"]'),
    eligiblePeople: root.querySelector('[data-hosp="eligiblePeople"]'),
    residenceArea: root.querySelector('[data-hosp="residenceArea"]'),
    isPopulationDeclineArea: root.querySelector('[data-hosp="isPopulationDeclineArea"]'),
    applicationRound: root.querySelector('[data-hosp="applicationRound"]'),
    applicationDate: root.querySelector('[data-hosp="applicationDate"]'),
    birthYearLastDigit: root.querySelector('[data-hosp="birthYearLastDigit"]'),
    paymentMethod: root.querySelector('[data-hosp="paymentMethod"]'),
  };

  const output = {
    totalAmount: document.getElementById("hosp-total-amount"),
    perPersonAmount: document.getElementById("hosp-per-person-amount"),
    baseAmount: document.getElementById("hosp-base-amount"),
    regionalExtra: document.getElementById("hosp-regional-extra"),
    deadline: document.getElementById("hosp-application-deadline"),
    status: document.getElementById("hosp-application-status"),
    interpretation: document.getElementById("hosp-result-interpretation"),
    checklist: document.getElementById("hosp-checklist"),
    summary: document.getElementById("hosp-summary"),
  };

  const resetButton = document.getElementById("hospResetBtn");
  const copyButton = document.getElementById("hospCopyBtn");
  const presetButtons = Array.from(root.querySelectorAll("[data-hosp-preset]"));

  const won = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;
  const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);
  const targetLabel = (value) => targets.find((target) => target.value === value)?.label || "대상 확인 필요";

  function readInput() {
    return {
      targetType: fields.targetType?.value || "unknown",
      eligiblePeople: clamp(fields.eligiblePeople?.value, 1, rules.maxPeople || 20),
      residenceArea: fields.residenceArea?.value || "capital-area",
      isPopulationDeclineArea: Boolean(fields.isPopulationDeclineArea?.checked),
      applicationRound: fields.applicationRound?.value || "second",
      applicationDate: fields.applicationDate?.value || "",
      birthYearLastDigit: fields.birthYearLastDigit?.value || "",
      paymentMethod: fields.paymentMethod?.value || "account",
    };
  }

  function calculate(input) {
    const baseAmount = baseAmounts[input.targetType] || 0;
    const regionalExtra =
      input.residenceArea === "non-capital-area" && input.isPopulationDeclineArea
        ? rules.regionalExtraAmount || 0
        : 0;
    const perPersonAmount = baseAmount + regionalExtra;
    const totalAmount = perPersonAmount * input.eligiblePeople;
    const applicationDate = input.applicationDate ? new Date(`${input.applicationDate}T12:00:00+09:00`) : null;
    const daysLeft = applicationDate ? Math.ceil((deadline - applicationDate) / 86400000) : null;

    return {
      baseAmount,
      regionalExtra,
      perPersonAmount,
      totalAmount,
      daysLeft,
      isAfterDeadline: applicationDate ? applicationDate > deadline : false,
      needsTargetCheck: input.targetType === "unknown",
    };
  }

  function buildChecklist(input, result) {
    const items = [];

    if (result.needsTargetCheck) {
      items.push("대상 유형이 확정되지 않았습니다. 주민센터 또는 복지로에서 수급·차상위·한부모 자격을 먼저 확인하세요.");
    } else {
      items.push(`${targetLabel(input.targetType)} 증명 서류와 신분증을 준비하세요.`);
    }

    if (result.regionalExtra > 0) {
      items.push("비수도권 인구감소지역 추가 지원은 지자체 공고에서 실제 적용 여부를 확인하세요.");
    } else if (input.residenceArea === "non-capital-area") {
      items.push("비수도권 거주자는 인구감소지역 추가 지원 대상인지 지자체 공고를 한 번 더 확인하세요.");
    }

    if (result.isAfterDeadline) {
      items.push("입력한 신청일이 2차 신청 마감 이후입니다. 추가 접수 또는 이의신청 가능 여부를 지자체에 문의하세요.");
    } else if (typeof result.daysLeft === "number") {
      items.push(`입력한 신청일 기준 2차 마감까지 ${Math.max(result.daysLeft, 0)}일 남았습니다.`);
    } else {
      items.push("신청 예정일을 입력하면 2차 마감까지 남은 기간을 확인할 수 있습니다.");
    }

    if (input.birthYearLastDigit) {
      items.push(`출생연도 끝자리 ${input.birthYearLastDigit}번의 요일제 적용 여부를 신청 지자체 안내에서 확인하세요.`);
    }

    return items;
  }

  function render() {
    const input = readInput();
    const result = calculate(input);
    const checklist = buildChecklist(input, result);

    if (fields.eligiblePeople) fields.eligiblePeople.value = String(input.eligiblePeople);
    if (output.totalAmount) output.totalAmount.textContent = won(result.totalAmount);
    if (output.perPersonAmount) output.perPersonAmount.textContent = won(result.perPersonAmount);
    if (output.baseAmount) output.baseAmount.textContent = won(result.baseAmount);
    if (output.regionalExtra) output.regionalExtra.textContent = result.regionalExtra > 0 ? `+${won(result.regionalExtra)}` : "해당 없음";
    if (output.deadline) output.deadline.textContent = "2026년 7월 3일";

    if (output.status) {
      output.status.textContent = result.isAfterDeadline
        ? "마감 후 확인 필요"
        : result.needsTargetCheck
          ? "대상 확인 필요"
          : "신청 준비 가능";
      output.status.dataset.state = result.isAfterDeadline ? "danger" : result.needsTargetCheck ? "warn" : "ok";
    }

    if (output.interpretation) {
      if (result.needsTargetCheck) {
        output.interpretation.textContent =
          "대상 유형이 확정되지 않아 금액을 보수적으로 0원으로 표시했습니다. 자격 확인 후 다시 계산하면 예상 수령액이 산정됩니다.";
      } else {
        output.interpretation.textContent = `${targetLabel(input.targetType)} ${input.eligiblePeople}명 기준 예상 수령액은 ${won(result.totalAmount)}입니다. 실제 지급액은 지자체 심사와 지역 추가 지원 적용 여부에 따라 달라질 수 있습니다.`;
      }
    }

    if (output.checklist) {
      output.checklist.innerHTML = checklist.map((item) => `<li>${item}</li>`).join("");
    }

    if (output.summary) {
      output.summary.textContent = `${targetLabel(input.targetType)} ${input.eligiblePeople}명 · ${won(result.totalAmount)} 예상`;
    }
  }

  function applyPreset(presetId) {
    const preset = presets.find((item) => item.id === presetId);
    if (!preset) return;

    if (fields.targetType) fields.targetType.value = preset.targetType;
    if (fields.eligiblePeople) fields.eligiblePeople.value = String(preset.eligiblePeople);
    if (fields.residenceArea) fields.residenceArea.value = preset.residenceArea;
    if (fields.isPopulationDeclineArea) fields.isPopulationDeclineArea.checked = preset.isPopulationDeclineArea;

    presetButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.hospPreset === presetId);
    });

    render();
  }

  Object.values(fields).forEach((field) => {
    field?.addEventListener("input", render);
    field?.addEventListener("change", render);
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.hospPreset));
  });

  resetButton?.addEventListener("click", () => {
    if (fields.targetType) fields.targetType.value = "basic-livelihood-recipient";
    if (fields.eligiblePeople) fields.eligiblePeople.value = "1";
    if (fields.residenceArea) fields.residenceArea.value = "capital-area";
    if (fields.isPopulationDeclineArea) fields.isPopulationDeclineArea.checked = false;
    if (fields.applicationRound) fields.applicationRound.value = "second";
    if (fields.applicationDate) fields.applicationDate.value = "2026-06-04";
    if (fields.birthYearLastDigit) fields.birthYearLastDigit.value = "";
    if (fields.paymentMethod) fields.paymentMethod.value = "account";
    presetButtons.forEach((button) => button.classList.remove("is-active"));
    render();
  });

  copyButton?.addEventListener("click", async () => {
    const text = output.summary?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "복사 완료";
      window.setTimeout(() => {
        copyButton.textContent = "결과 복사";
      }, 1500);
    } catch {
      copyButton.textContent = "복사 실패";
      window.setTimeout(() => {
        copyButton.textContent = "결과 복사";
      }, 1500);
    }
  });

  render();
})();
