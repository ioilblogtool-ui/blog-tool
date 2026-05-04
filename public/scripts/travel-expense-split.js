const configEl = document.getElementById("travelExpenseSplitData");
const seed = JSON.parse(configEl?.textContent || "{}");

const meta = seed.meta || {};
const categories = seed.categories || {};
const currencies = Array.isArray(seed.currencies) ? seed.currencies : [];
const presets = Array.isArray(seed.presets) ? seed.presets : [];

const $ = (id) => document.getElementById(id);

let urlTimer = null;
let participantSeq = 0;
let expenseSeq = 0;
let lastCopyText = "";

const state = {
  tripName: "오사카 3박 4일",
  splitMode: "equal",
  defaultCurrency: meta.defaultCurrency || "KRW",
  roundingUnit: meta.defaultRoundingUnit || 100,
  participants: [],
  expenses: [],
  activePresetId: "",
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function parseMoney(value) {
  return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
}

function formatWon(value) {
  return `${Math.round(Number(value) || 0).toLocaleString("ko-KR")}원`;
}

function formatSignedWon(value) {
  const amount = Math.round(Number(value) || 0);
  if (amount > 0) return `받을 돈 ${formatWon(amount)}`;
  if (amount < 0) return `보낼 돈 ${formatWon(Math.abs(amount))}`;
  return "정산 완료";
}

function formatInputNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString("ko-KR");
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function getCurrency(code) {
  return currencies.find((item) => item.code === code) || currencies[0] || { code: "KRW", exchangeRate: 1, unit: "원" };
}

function nextParticipantId() {
  participantSeq += 1;
  return `p${participantSeq}`;
}

function nextExpenseId() {
  expenseSeq += 1;
  return `e${expenseSeq}`;
}

function normalizeParticipants(participants) {
  const max = meta.maxParticipants || 10;
  return participants
    .map((participant, index) => ({
      id: participant.id || nextParticipantId(),
      name: String(participant.name || `참여자${index + 1}`).trim().slice(0, 20) || `참여자${index + 1}`,
      ratio: clamp(participant.ratio, 0, 100),
    }))
    .slice(0, max);
}

function normalizeExpenses(expenses, participants) {
  const participantIds = new Set(participants.map((participant) => participant.id));
  return expenses
    .map((expense, index) => {
      const currency = getCurrency(expense.currency || state.defaultCurrency);
      const included = Array.isArray(expense.includedParticipantIds)
        ? expense.includedParticipantIds.filter((id) => participantIds.has(id))
        : [];
      return {
        id: expense.id || nextExpenseId(),
        category: categories[expense.category] ? expense.category : "etc",
        title: String(expense.title || categories[expense.category] || "기타").trim().slice(0, 28) || "기타",
        amount: Math.max(0, Number(expense.amount) || 0),
        currency: currency.code,
        exchangeRate: Math.max(0, Number(expense.exchangeRate) || Number(currency.exchangeRate) || 1),
        paidBy: participantIds.has(expense.paidBy) ? expense.paidBy : participants[0]?.id,
        includedParticipantIds: included.length ? included : participants.map((participant) => participant.id),
      };
    })
    .filter((expense) => expense.paidBy);
}

function applyPreset(presetId) {
  const preset = presets.find((item) => item.id === presetId);
  if (!preset) return;
  state.splitMode = preset.splitMode || "equal";
  state.defaultCurrency = meta.defaultCurrency || "KRW";
  state.roundingUnit = meta.defaultRoundingUnit || 100;
  state.participants = normalizeParticipants(clone(preset.participants || []));
  state.expenses = normalizeExpenses(
    clone(preset.expenses || []).map((expense, index) => ({ ...expense, id: `e${index + 1}` })),
    state.participants,
  );
  participantSeq = state.participants.length;
  expenseSeq = state.expenses.length;
  state.activePresetId = preset.id;
  setText($("tesPresetSummary"), preset.description);
  syncStaticInputs();
  renderAll();
}

function resetState() {
  state.tripName = "오사카 3박 4일";
  applyPreset(presets[0]?.id || "");
}

function syncStaticInputs() {
  if ($("tesTripName")) $("tesTripName").value = state.tripName;
  if ($("tesSplitMode")) $("tesSplitMode").value = state.splitMode;
  if ($("tesDefaultCurrency")) $("tesDefaultCurrency").value = state.defaultCurrency;
  if ($("tesRoundingUnit")) $("tesRoundingUnit").value = String(state.roundingUnit);
  document.querySelectorAll("[data-tes-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tesPreset === state.activePresetId);
  });
}

function readStaticInputs() {
  state.tripName = String($("tesTripName")?.value || "여행 정산").trim().slice(0, 32) || "여행 정산";
  state.splitMode = $("tesSplitMode")?.value === "ratio" ? "ratio" : "equal";
  state.defaultCurrency = $("tesDefaultCurrency")?.value || "KRW";
  state.roundingUnit = Number($("tesRoundingUnit")?.value || 100);
}

function buildOption(value, label, selectedValue) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  option.selected = value === selectedValue;
  return option;
}

function renderParticipants() {
  const list = $("tesParticipantList");
  if (!list) return;
  list.replaceChildren();

  state.participants.forEach((participant) => {
    const row = document.createElement("div");
    row.className = "tes-participant-row";
    row.dataset.participantId = participant.id;

    const nameLabel = document.createElement("label");
    nameLabel.append("이름");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = participant.name;
    nameInput.maxLength = 20;
    nameInput.dataset.tesParticipantName = participant.id;
    nameLabel.append(nameInput);

    const ratioLabel = document.createElement("label");
    ratioLabel.append("분담률");
    const ratioInput = document.createElement("input");
    ratioInput.type = "number";
    ratioInput.min = "0";
    ratioInput.max = "100";
    ratioInput.step = "1";
    ratioInput.value = String(participant.ratio);
    ratioInput.dataset.tesParticipantRatio = participant.id;
    ratioLabel.append(ratioInput);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "삭제";
    remove.dataset.tesRemoveParticipant = participant.id;
    remove.disabled = state.participants.length <= (meta.minParticipants || 2);

    row.append(nameLabel, ratioLabel, remove);
    list.append(row);
  });
}

function renderIncludedChecks(container, expense) {
  container.replaceChildren();
  state.participants.forEach((participant) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = expense.includedParticipantIds.includes(participant.id);
    input.dataset.tesIncluded = expense.id;
    input.value = participant.id;
    const span = document.createElement("span");
    span.textContent = participant.name;
    label.append(input, span);
    container.append(label);
  });
}

function renderExpenses() {
  const list = $("tesExpenseList");
  if (!list) return;
  list.replaceChildren();

  state.expenses.forEach((expense) => {
    const row = document.createElement("article");
    row.className = "tes-expense-row";
    row.dataset.expenseId = expense.id;

    const categoryLabel = document.createElement("label");
    categoryLabel.append("항목");
    const categorySelect = document.createElement("select");
    categorySelect.dataset.tesExpenseCategory = expense.id;
    Object.entries(categories).forEach(([value, label]) => {
      categorySelect.append(buildOption(value, label, expense.category));
    });
    categoryLabel.append(categorySelect);

    const titleLabel = document.createElement("label");
    titleLabel.append("내용");
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = expense.title;
    titleInput.maxLength = 28;
    titleInput.dataset.tesExpenseTitle = expense.id;
    titleLabel.append(titleInput);

    const amountLabel = document.createElement("label");
    amountLabel.append("금액");
    const amountInput = document.createElement("input");
    amountInput.type = "text";
    amountInput.inputMode = "numeric";
    amountInput.value = formatInputNumber(expense.amount);
    amountInput.dataset.tesExpenseAmount = expense.id;
    amountLabel.append(amountInput);

    const currencyLabel = document.createElement("label");
    currencyLabel.append("통화");
    const currencySelect = document.createElement("select");
    currencySelect.dataset.tesExpenseCurrency = expense.id;
    currencies.forEach((currency) => currencySelect.append(buildOption(currency.code, currency.code, expense.currency)));
    currencyLabel.append(currencySelect);

    const fxLabel = document.createElement("label");
    fxLabel.append("환율");
    const fxInput = document.createElement("input");
    fxInput.type = "number";
    fxInput.min = "0";
    fxInput.step = "0.1";
    fxInput.value = String(expense.exchangeRate);
    fxInput.dataset.tesExpenseFx = expense.id;
    fxInput.disabled = expense.currency === "KRW";
    fxLabel.append(fxInput);

    const paidLabel = document.createElement("label");
    paidLabel.append("선결제자");
    const paidSelect = document.createElement("select");
    paidSelect.dataset.tesExpensePaidBy = expense.id;
    state.participants.forEach((participant) => paidSelect.append(buildOption(participant.id, participant.name, expense.paidBy)));
    paidLabel.append(paidSelect);

    const includedBlock = document.createElement("div");
    includedBlock.className = "tes-included-block";
    const includedTitle = document.createElement("span");
    includedTitle.textContent = "참여자";
    const includedChecks = document.createElement("div");
    includedChecks.className = "tes-included-checks";
    renderIncludedChecks(includedChecks, expense);
    includedBlock.append(includedTitle, includedChecks);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "삭제";
    remove.dataset.tesRemoveExpense = expense.id;
    remove.disabled = state.expenses.length <= 1;

    row.append(categoryLabel, titleLabel, amountLabel, currencyLabel, fxLabel, paidLabel, includedBlock, remove);
    list.append(row);
  });
}

function toKrwAmount(expense) {
  if (expense.currency === "KRW") return expense.amount;
  return expense.amount * expense.exchangeRate;
}

function calculateBalance(participants, expenses, splitMode) {
  const balanceMap = new Map(participants.map((participant) => [participant.id, 0]));
  const paidMap = new Map(participants.map((participant) => [participant.id, 0]));
  const owedMap = new Map(participants.map((participant) => [participant.id, 0]));

  expenses.forEach((expense) => {
    const amount = toKrwAmount(expense);
    const includedIds = expense.includedParticipantIds.length ? expense.includedParticipantIds : participants.map((participant) => participant.id);
    paidMap.set(expense.paidBy, (paidMap.get(expense.paidBy) || 0) + amount);
    balanceMap.set(expense.paidBy, (balanceMap.get(expense.paidBy) || 0) + amount);

    if (splitMode === "ratio") {
      const includedSet = new Set(includedIds);
      const includedParticipants = participants.filter((participant) => includedSet.has(participant.id));
      const ratioTotal = includedParticipants.reduce((sum, participant) => sum + participant.ratio, 0);
      const fallbackShare = amount / Math.max(1, includedParticipants.length);
      includedParticipants.forEach((participant) => {
        const owed = ratioTotal > 0 ? amount * (participant.ratio / ratioTotal) : fallbackShare;
        owedMap.set(participant.id, (owedMap.get(participant.id) || 0) + owed);
        balanceMap.set(participant.id, (balanceMap.get(participant.id) || 0) - owed);
      });
    } else {
      const share = amount / Math.max(1, includedIds.length);
      includedIds.forEach((participantId) => {
        owedMap.set(participantId, (owedMap.get(participantId) || 0) + share);
        balanceMap.set(participantId, (balanceMap.get(participantId) || 0) - share);
      });
    }
  });

  return { balanceMap, paidMap, owedMap };
}

function roundAmount(amount, unit) {
  if (!unit || unit <= 1) return Math.round(amount);
  return Math.round(amount / unit) * unit;
}

function generateSettlements(balanceMap, participants, roundingUnit) {
  const nameById = Object.fromEntries(participants.map((participant) => [participant.id, participant.name]));
  const debtors = Array.from(balanceMap.entries())
    .filter(([, amount]) => amount < -0.5)
    .map(([id, amount]) => ({ id, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);
  const creditors = Array.from(balanceMap.entries())
    .filter(([, amount]) => amount > 0.5)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const rawAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = roundAmount(rawAmount, roundingUnit);

    if (roundedAmount > 0) {
      transfers.push({
        fromId: debtor.id,
        fromName: nameById[debtor.id],
        toId: creditor.id,
        toName: nameById[creditor.id],
        amount: roundedAmount,
      });
    }

    debtor.amount -= rawAmount;
    creditor.amount -= rawAmount;
    if (debtor.amount <= 0.5) i += 1;
    if (creditor.amount <= 0.5) j += 1;
  }

  return transfers;
}

function calculateTravelExpenseSplit() {
  const participants = normalizeParticipants(state.participants);
  const expenses = normalizeExpenses(state.expenses, participants).filter((expense) => expense.amount > 0);
  const { balanceMap, paidMap, owedMap } = calculateBalance(participants, expenses, state.splitMode);
  const totalCost = expenses.reduce((sum, expense) => sum + toKrwAmount(expense), 0);
  const transfers = generateSettlements(balanceMap, participants, state.roundingUnit);
  const debtorTotal = Array.from(balanceMap.values()).filter((value) => value < 0).reduce((sum, value) => sum + Math.abs(value), 0);
  const transferTotal = transfers.reduce((sum, transfer) => sum + transfer.amount, 0);

  return {
    totalCost: Math.round(totalCost),
    averagePerPerson: Math.round(totalCost / Math.max(1, participants.length)),
    participantSettlements: participants.map((participant) => {
      const balance = balanceMap.get(participant.id) || 0;
      return {
        participantId: participant.id,
        name: participant.name,
        paidAmount: Math.round(paidMap.get(participant.id) || 0),
        owedAmount: Math.round(owedMap.get(participant.id) || 0),
        balance: Math.round(balance),
      };
    }),
    transfers,
    roundingDiff: Math.round(transferTotal - debtorTotal),
  };
}

function buildCopyText(result) {
  const lines = [
    `[${state.tripName} 여행 정산]`,
    `총 경비: ${formatWon(result.totalCost)}`,
    `1인 평균: ${formatWon(result.averagePerPerson)}`,
    "",
    "송금 내역",
  ];

  if (result.transfers.length) {
    result.transfers.forEach((transfer) => {
      lines.push(`${transfer.fromName} → ${transfer.toName} ${formatWon(transfer.amount)}`);
    });
  } else {
    lines.push("추가 송금 없이 정산 완료");
  }

  lines.push("", "※ 선결제자와 불참 항목을 반영한 계산 결과입니다.", "※ 실제 송금 전 비용 포함 기준을 한 번 더 확인하세요.");
  return lines.join("\n");
}

function renderResults() {
  const result = calculateTravelExpenseSplit();
  setText($("tesTotalCost"), formatWon(result.totalCost));
  setText($("tesAverageCost"), formatWon(result.averagePerPerson));
  setText($("tesTransferCount"), `${result.transfers.length}건`);
  setText($("tesRoundingDiff"), formatWon(result.roundingDiff));
  setText($("tesTripNameSummary"), `${state.tripName} · ${state.expenses.length}개 항목`);
  setText($("tesResultSubcopy"), `${state.participants.length}명 · ${state.splitMode === "ratio" ? "비율 분담" : "더치페이"} · ${state.roundingUnit.toLocaleString("ko-KR")}원 단위`);

  const transferList = $("tesTransferList");
  if (transferList) {
    transferList.replaceChildren();
    if (!result.transfers.length) {
      const empty = document.createElement("li");
      empty.className = "tes-empty-row";
      empty.textContent = "현재 입력값에서는 추가 송금 없이 정산이 완료된 상태입니다.";
      transferList.append(empty);
    } else {
      result.transfers.forEach((transfer) => {
        const item = document.createElement("li");
        const names = document.createElement("span");
        names.textContent = `${transfer.fromName} → ${transfer.toName}`;
        const amount = document.createElement("strong");
        amount.textContent = formatWon(transfer.amount);
        item.append(names, amount);
        transferList.append(item);
      });
    }
  }

  const body = $("tesSettlementBody");
  if (body) {
    body.replaceChildren();
    result.participantSettlements.forEach((item) => {
      const row = document.createElement("tr");
      [item.name, formatWon(item.paidAmount), formatWon(item.owedAmount), formatSignedWon(item.balance)].forEach((text, index) => {
        const cell = document.createElement("td");
        cell.textContent = text;
        if (index === 3) cell.dataset.status = item.balance > 0 ? "receive" : item.balance < 0 ? "send" : "settled";
        row.append(cell);
      });
      body.append(row);
    });
  }

  lastCopyText = buildCopyText(result);
  setText($("tesCopyText"), lastCopyText);
}

function renderAll() {
  state.participants = normalizeParticipants(state.participants);
  state.expenses = normalizeExpenses(state.expenses, state.participants);
  syncStaticInputs();
  renderParticipants();
  renderExpenses();
  renderResults();
  syncUrl();
}

function addParticipant() {
  if (state.participants.length >= (meta.maxParticipants || 10)) return;
  const id = nextParticipantId();
  state.participants.push({ id, name: `참여자${state.participants.length + 1}`, ratio: Math.round(100 / (state.participants.length + 1)) });
  state.expenses.forEach((expense) => {
    expense.includedParticipantIds.push(id);
  });
  state.activePresetId = "";
  renderAll();
}

function removeParticipant(id) {
  if (state.participants.length <= (meta.minParticipants || 2)) return;
  state.participants = state.participants.filter((participant) => participant.id !== id);
  state.expenses.forEach((expense) => {
    expense.includedParticipantIds = expense.includedParticipantIds.filter((participantId) => participantId !== id);
    if (expense.paidBy === id) expense.paidBy = state.participants[0]?.id || "";
  });
  state.activePresetId = "";
  renderAll();
}

function addExpense(category = "etc", title = "") {
  const currency = getCurrency(state.defaultCurrency);
  state.expenses.push({
    id: nextExpenseId(),
    category,
    title: title || categories[category] || "기타",
    amount: 0,
    currency: currency.code,
    exchangeRate: Number(currency.exchangeRate) || 1,
    paidBy: state.participants[0]?.id || "",
    includedParticipantIds: state.participants.map((participant) => participant.id),
  });
  state.activePresetId = "";
  renderAll();
}

function removeExpense(id) {
  if (state.expenses.length <= 1) return;
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  state.activePresetId = "";
  renderAll();
}

function updateParticipant(id, field, value) {
  const participant = state.participants.find((item) => item.id === id);
  if (!participant) return;
  if (field === "name") participant.name = String(value || "").trim().slice(0, 20) || participant.name;
  if (field === "ratio") participant.ratio = clamp(value, 0, 100);
  state.activePresetId = "";
  renderAll();
}

function updateExpense(id, field, value) {
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) return;
  if (field === "category") {
    expense.category = categories[value] ? value : "etc";
    if (!expense.title || Object.values(categories).includes(expense.title)) expense.title = categories[expense.category];
  }
  if (field === "title") expense.title = String(value || "").trim().slice(0, 28) || expense.title;
  if (field === "amount") expense.amount = Math.max(0, parseMoney(value));
  if (field === "currency") {
    const currency = getCurrency(value);
    expense.currency = currency.code;
    expense.exchangeRate = Number(currency.exchangeRate) || 1;
  }
  if (field === "exchangeRate") expense.exchangeRate = Math.max(0, Number(value) || 1);
  if (field === "paidBy") expense.paidBy = value;
  state.activePresetId = "";
  renderAll();
}

function updateIncluded(expenseId, participantId, checked) {
  const expense = state.expenses.find((item) => item.id === expenseId);
  if (!expense) return;
  const set = new Set(expense.includedParticipantIds);
  if (checked) set.add(participantId);
  else set.delete(participantId);
  expense.includedParticipantIds = Array.from(set);
  state.activePresetId = "";
  renderAll();
}

function syncUrl() {
  clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    const params = new URLSearchParams();
    params.set("mode", state.splitMode);
    params.set("round", String(state.roundingUnit));
    params.set("names", state.participants.map((participant) => participant.name).join(","));
    if (state.activePresetId) params.set("preset", state.activePresetId);
    history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  }, 200);
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return false;
  const preset = params.get("preset");
  if (preset && presets.some((item) => item.id === preset)) applyPreset(preset);
  if (["equal", "ratio"].includes(params.get("mode") || "")) state.splitMode = params.get("mode");
  const rounding = Number(params.get("round"));
  if ([1, 10, 100, 1000].includes(rounding)) state.roundingUnit = rounding;
  const names = (params.get("names") || "").split(",").map((name) => name.trim()).filter(Boolean);
  if (names.length >= 2) {
    state.participants = names.slice(0, meta.maxParticipants || 10).map((name, index) => ({
      id: `p${index + 1}`,
      name,
      ratio: Math.round(100 / names.length),
    }));
    state.expenses = normalizeExpenses(clone(seed.expenses || []), state.participants);
    participantSeq = state.participants.length;
    expenseSeq = state.expenses.length;
    state.activePresetId = "";
    setText($("tesPresetSummary"), "공유 링크의 참여자 이름을 불러왔습니다.");
  }
  return true;
}

function bindEvents() {
  $("tesTripName")?.addEventListener("input", () => {
    readStaticInputs();
    state.activePresetId = "";
    renderResults();
    syncUrl();
  });
  ["tesSplitMode", "tesDefaultCurrency", "tesRoundingUnit"].forEach((id) => {
    $(id)?.addEventListener("change", () => {
      readStaticInputs();
      state.activePresetId = "";
      if (id === "tesDefaultCurrency") {
        const currency = getCurrency(state.defaultCurrency);
        state.expenses.forEach((expense) => {
          expense.currency = currency.code;
          expense.exchangeRate = Number(currency.exchangeRate) || 1;
        });
      }
      renderAll();
    });
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const value = target.value;
    if (target.dataset.tesParticipantName) {
      const participant = state.participants.find((item) => item.id === target.dataset.tesParticipantName);
      if (participant) participant.name = String(value || "").trim().slice(0, 20) || participant.name;
      state.activePresetId = "";
      renderResults();
      syncUrl();
    }
    if (target.dataset.tesParticipantRatio) {
      const participant = state.participants.find((item) => item.id === target.dataset.tesParticipantRatio);
      if (participant) participant.ratio = clamp(value, 0, 100);
      state.activePresetId = "";
      renderResults();
      syncUrl();
    }
    if (target.dataset.tesExpenseTitle) {
      const expense = state.expenses.find((item) => item.id === target.dataset.tesExpenseTitle);
      if (expense) expense.title = String(value || "").trim().slice(0, 28) || expense.title;
      state.activePresetId = "";
      renderResults();
      syncUrl();
    }
    if (target.dataset.tesExpenseAmount) {
      const expense = state.expenses.find((item) => item.id === target.dataset.tesExpenseAmount);
      if (expense) expense.amount = Math.max(0, parseMoney(value));
      state.activePresetId = "";
      renderResults();
      syncUrl();
    }
    if (target.dataset.tesExpenseFx) {
      const expense = state.expenses.find((item) => item.id === target.dataset.tesExpenseFx);
      if (expense) expense.exchangeRate = Math.max(0, Number(value) || 1);
      state.activePresetId = "";
      renderResults();
      syncUrl();
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.tesExpenseCategory) updateExpense(target.dataset.tesExpenseCategory, "category", target.value);
    if (target.dataset.tesExpenseCurrency) updateExpense(target.dataset.tesExpenseCurrency, "currency", target.value);
    if (target.dataset.tesExpensePaidBy) updateExpense(target.dataset.tesExpensePaidBy, "paidBy", target.value);
    if (target.dataset.tesIncluded) updateIncluded(target.dataset.tesIncluded, target.value, target.checked);
    if (target.dataset.tesParticipantName || target.dataset.tesParticipantRatio) renderAll();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.tesRemoveParticipant) removeParticipant(target.dataset.tesRemoveParticipant);
    if (target.dataset.tesRemoveExpense) removeExpense(target.dataset.tesRemoveExpense);
    if (target.dataset.tesPreset) applyPreset(target.dataset.tesPreset);
    if (target.dataset.tesQuickExpense) addExpense(target.dataset.tesQuickExpense, target.dataset.tesQuickTitle || "");
  });

  $("tesAddParticipant")?.addEventListener("click", addParticipant);
  $("tesAddExpense")?.addEventListener("click", () => addExpense("etc", "기타"));
  $("tesResetBtn")?.addEventListener("click", resetState);
  $("tesCopyLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
    } catch (_) {
      window.alert("링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해주세요.");
    }
  });
  $("tesCopyResult")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastCopyText);
      const button = $("tesCopyResult");
      const original = button?.textContent || "정산 결과 복사";
      if (button) button.textContent = "복사 완료";
      window.setTimeout(() => {
        if (button) button.textContent = original;
      }, 1500);
    } catch (_) {
      window.alert("정산 결과 복사에 실패했습니다. 복사용 문구를 직접 선택해 복사해주세요.");
    }
  });
}

function init() {
  state.participants = normalizeParticipants(clone(seed.participants || []));
  state.expenses = normalizeExpenses(clone(seed.expenses || []), state.participants);
  participantSeq = state.participants.length;
  expenseSeq = state.expenses.length;
  bindEvents();
  if (!restoreFromUrl() && presets[0]) applyPreset(presets[0].id);
  else renderAll();
}

document.addEventListener("DOMContentLoaded", init);
