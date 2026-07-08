(function () {
  "use strict";

  const dataEl = document.getElementById("babyMedicineData");
  const pageData = JSON.parse(dataEl?.textContent || "{}");
  const checklist = Array.isArray(pageData.checklist) ? pageData.checklist : [];
  const dangerSignals = Array.isArray(pageData.dangerSignals) ? pageData.dangerSignals : [];

  const checklistInputs = Array.from(document.querySelectorAll("[data-bmc-item]"));
  const dangerInputs = Array.from(document.querySelectorAll("[data-bmc-danger]"));
  const scoreValue = document.getElementById("bmcScoreValue");
  const scoreLevel = document.getElementById("bmcScoreLevel");
  const scoreMessage = document.getElementById("bmcScoreMessage");
  const missingList = document.getElementById("bmcMissingList");
  const requiredList = document.getElementById("bmcRequiredList");
  const dangerResult = document.getElementById("bmcDangerResult");
  const dangerHeadline = document.getElementById("bmcDangerHeadline");
  const dangerText = document.getElementById("bmcDangerText");
  const dangerMessages = document.getElementById("bmcDangerMessages");

  const logFields = {
    child: document.getElementById("bmcLogChild"),
    temp: document.getElementById("bmcLogTemp"),
    symptoms: document.getElementById("bmcLogSymptoms"),
    ingredient: document.getElementById("bmcLogIngredient"),
    product: document.getElementById("bmcLogProduct"),
    time: document.getElementById("bmcLogTime"),
    amount: document.getElementById("bmcLogAmount"),
    memo: document.getElementById("bmcLogMemo"),
  };
  const logOutput = document.getElementById("bmcLogOutput");
  const copyLogBtn = document.getElementById("bmcCopyLogBtn");
  const printLogBtn = document.getElementById("bmcPrintLogBtn");
  const resetBtn = document.getElementById("bmcResetBtn");
  const copyLinkBtn = document.getElementById("bmcCopyLinkBtn");

  function checkedItemIds() {
    return checklistInputs.filter((input) => input.checked).map((input) => input.dataset.bmcItem);
  }

  function getLevel(score) {
    if (score >= 80) {
      return {
        className: "bmc-score-card--good",
        label: "준비 양호",
        message: "기본 상비약과 기록 도구가 대부분 준비되어 있습니다. 유효기간과 성분 중복만 다시 확인하세요.",
      };
    }
    if (score >= 50) {
      return {
        className: "bmc-score-card--watch",
        label: "보완 필요",
        message: "기본 항목은 일부 준비되어 있지만 복약 기록, ORS, 응급 연락처 같은 핵심 항목을 보완하세요.",
      };
    }
    return {
      className: "bmc-score-card--start",
      label: "우선 준비",
      message: "체온계, 해열제 성분 확인, 투약 도구, 응급 연락처부터 먼저 준비하는 것이 좋습니다.",
    };
  }

  function renderPillList(node, items, emptyText) {
    if (!node) return;
    node.textContent = "";
    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = emptyText;
      node.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      node.appendChild(li);
    });
  }

  function renderChecklist() {
    const selectedIds = checkedItemIds();
    const total = checklist.reduce((sum, item) => sum + Number(item.score || 0), 0);
    const checked = checklist
      .filter((item) => selectedIds.includes(item.id))
      .reduce((sum, item) => sum + Number(item.score || 0), 0);
    const score = total > 0 ? Math.round((checked / total) * 100) : 0;
    const level = getLevel(score);
    const missingRequired = checklist
      .filter((item) => item.required && !selectedIds.includes(item.id))
      .map((item) => item.shortLabel || item.label);
    const missingAll = checklist
      .filter((item) => !selectedIds.includes(item.id))
      .slice(0, 6)
      .map((item) => item.shortLabel || item.label);

    const card = document.getElementById("bmcScoreCard");
    if (card) {
      card.className = `bmc-score-card ${level.className}`;
    }
    if (scoreValue) scoreValue.textContent = `${score}점`;
    if (scoreLevel) scoreLevel.textContent = level.label;
    if (scoreMessage) scoreMessage.textContent = level.message;
    renderPillList(missingList, missingAll, "현재 체크 기준으로 표시할 부족 항목이 없습니다.");
    renderPillList(requiredList, missingRequired, "필수 항목은 모두 체크되었습니다.");
  }

  function selectedDangerSignals() {
    const ids = dangerInputs.filter((input) => input.checked).map((input) => input.dataset.bmcDanger);
    return dangerSignals.filter((signal) => ids.includes(signal.id));
  }

  function renderDanger() {
    const selected = selectedDangerSignals();
    const hasUrgent = selected.some((item) => item.severity === "urgent");
    const hasConsult = selected.some((item) => item.severity === "consult");

    if (dangerResult) {
      dangerResult.className = hasUrgent
        ? "bmc-danger-result bmc-danger-result--urgent"
        : hasConsult
          ? "bmc-danger-result bmc-danger-result--consult"
          : "bmc-danger-result";
      dangerResult.setAttribute("role", hasUrgent ? "alert" : "status");
    }

    if (hasUrgent) {
      dangerHeadline.textContent = "즉시 진료 또는 응급 상담이 필요한 신호가 체크되었습니다";
      dangerText.textContent = "이 도구 결과로 집에서 지켜볼지 결정하지 말고 소아청소년과, 응급의료 상담, 119 안내를 우선하세요.";
    } else if (hasConsult) {
      dangerHeadline.textContent = "진료 상담을 권장하는 신호가 있습니다";
      dangerText.textContent = "상태가 나빠지거나 보호자가 불안하면 기다리지 말고 약국, 소아청소년과, 야간·휴일 진료기관에 상담하세요.";
    } else {
      dangerHeadline.textContent = "체크된 위험 신호는 없습니다";
      dangerText.textContent = "다만 아이 상태가 변하거나 보호자가 불안하면 체크 결과와 관계없이 상담을 우선하세요.";
    }

    if (dangerMessages) {
      dangerMessages.textContent = "";
      selected.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.label} ${item.message}`;
        dangerMessages.appendChild(li);
      });
    }
  }

  function buildLogText() {
    const value = (field, fallback = "미입력") => String(field?.value || "").trim() || fallback;
    return [
      "[아기 복약 기록]",
      `이름/별칭: ${value(logFields.child, "선택 입력")}`,
      `체온: ${value(logFields.temp)}도`,
      `증상: ${value(logFields.symptoms)}`,
      `성분: ${value(logFields.ingredient)}`,
      `제품명: ${value(logFields.product, "선택 입력")}`,
      `복용 시간: ${value(logFields.time)}`,
      `복용량: ${value(logFields.amount, "제품 설명서/약사 안내 기준으로 직접 확인")}`,
      `메모: ${value(logFields.memo, "없음")}`,
      "",
      "※ 이 기록은 진료 또는 약국 상담 시 전달하기 위한 참고용입니다.",
      "※ 이 페이지는 복용량을 자동 계산하지 않습니다.",
    ].join("\n");
  }

  function renderLog() {
    if (logOutput) logOutput.textContent = buildLogText();
  }

  async function copyText(text, button, defaultText) {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        button.textContent = "복사됨";
        window.setTimeout(() => {
          button.textContent = defaultText;
        }, 1600);
      }
    } catch (_) {
      if (button) {
        button.textContent = "복사 실패";
        window.setTimeout(() => {
          button.textContent = defaultText;
        }, 1600);
      }
    }
  }

  function resetAll() {
    checklistInputs.forEach((input) => {
      input.checked = Boolean(input.dataset.bmcDefault === "true");
    });
    dangerInputs.forEach((input) => {
      input.checked = false;
    });
    Object.values(logFields).forEach((field) => {
      if (field && field.tagName !== "SELECT") field.value = "";
      if (field && field.tagName === "SELECT") field.selectedIndex = 0;
    });
    renderChecklist();
    renderDanger();
    renderLog();
  }

  checklistInputs.forEach((input) => input.addEventListener("change", renderChecklist));
  dangerInputs.forEach((input) => input.addEventListener("change", renderDanger));
  Object.values(logFields).forEach((field) => {
    if (!field) return;
    const eventName = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(eventName, renderLog);
  });

  copyLogBtn?.addEventListener("click", () => copyText(buildLogText(), copyLogBtn, "기록 복사"));
  printLogBtn?.addEventListener("click", () => window.print());
  resetBtn?.addEventListener("click", resetAll);
  copyLinkBtn?.addEventListener("click", () => copyText(window.location.href, copyLinkBtn, "링크 복사"));

  renderChecklist();
  renderDanger();
  renderLog();
})();
