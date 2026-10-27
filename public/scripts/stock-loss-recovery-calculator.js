import { readParam, writeParams, deleteParams } from "./url-state.js";

const configEl = document.getElementById("slrConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const DEFAULTS = config.DEFAULT_INPUT || {
  mode: "price",
  buyPrice: 100000,
  currentPrice: 70000,
  quantity: 100,
  lossRate: 30,
  addAmount: 0,
  addPrice: null,
};
const REBOUND_STEPS = config.REBOUND_STEPS || [0.05, 0.1, 0.2, 0.3];
const CHART_RANGE = config.CHART_LOSS_RANGE || { min: 5, max: 90, step: 5 };
const RATE_MODE_BASE_PRICE = 100000;
const URL_KEYS = ["m", "bp", "cp", "q", "lr", "aa", "ap"];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  buyPrice: $("#slrBuyPrice"),
  currentPrice: $("#slrCurrentPrice"),
  quantity: $("#slrQuantity"),
  lossRate: $("#slrLossRate"),
  addAmount: $("#slrAddAmount"),
  addPrice: $("#slrAddPrice"),
};
const moneyFields = [fields.buyPrice, fields.currentPrice, fields.addAmount, fields.addPrice];

let mode = DEFAULTS.mode;
let addPriceLinked = true;
let chart = null;

// ── 숫자 처리 ─────────────────────────────────────

function parseNumber(value) {
  if (value === null || value === undefined) return NaN;
  const cleaned = String(value).replace(/[,\s원]/g, "");
  if (cleaned === "") return NaN;
  return Number(cleaned);
}

function isUsable(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function fmtWon(value) {
  if (!isUsable(value)) return "—";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
}

function fmtSignedWon(value) {
  if (!isUsable(value)) return "—";
  const rounded = Math.round(value);
  if (rounded > 0) return `+${rounded.toLocaleString("ko-KR")}원`;
  return fmtWon(rounded);
}

function fmtPrice(value) {
  if (!isUsable(value)) return "—";
  return `${value.toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}원`;
}

function fmtPct(value, digits = 2) {
  if (!isUsable(value)) return "—";
  const fixed = Math.abs(value * 100).toFixed(digits);
  if (Number(fixed) === 0) return `${Number(0).toFixed(digits)}%`;
  return `${value > 0 ? "+" : "−"}${fixed}%`;
}

function formatMoneyInput(input) {
  if (!input) return;
  const value = parseNumber(input.value);
  if (isUsable(value)) input.value = Math.round(value).toLocaleString("ko-KR");
}

// ── 계산 ──────────────────────────────────────────

function calcBase({ buyPrice, currentPrice, quantity }) {
  const cost = buyPrice * quantity;
  const value = currentPrice * quantity;
  return {
    cost,
    value,
    pnl: value - cost,
    lossRate: currentPrice / buyPrice - 1,
    recoveryNeeded: currentPrice > 0 ? buyPrice / currentPrice - 1 : null,
    breakevenPrice: buyPrice,
  };
}

function calcAveraging({ buyPrice, currentPrice, quantity, addAmount, addPrice }) {
  const addQty = addPrice > 0 ? Math.floor(addAmount / addPrice + 1e-9) : 0;
  const spent = addQty * addPrice;
  const baseCost = buyPrice * quantity;
  const totalQty = quantity + addQty;
  const totalCost = baseCost + spent;
  const avgPrice = totalCost / totalQty;
  return {
    addQty,
    spent,
    leftover: addAmount - spent,
    totalQty,
    totalCost,
    avgPrice,
    recoveryNeeded: currentPrice > 0 ? avgPrice / currentPrice - 1 : null,
    costIncreaseRate: spent / baseCost,
  };
}

function calcRebound(currentPrice, qty, cost, g) {
  const value = currentPrice * (1 + g) * qty;
  return { value, pnl: value - cost, returnRate: value / cost - 1 };
}

const recoveryFromLoss = (lossRatio) => (lossRatio < 1 ? lossRatio / (1 - lossRatio) : null);

// ── 입력 ──────────────────────────────────────────

function setError(key, message) {
  const node = $(`[data-slr-error="${key}"]`);
  if (node) node.textContent = message || "";
}

function readInputs() {
  ["buyPrice", "currentPrice", "lossRate", "addPrice"].forEach((key) => setError(key, ""));

  let quantity = Math.floor(parseNumber(fields.quantity?.value));
  if (!isUsable(quantity) || quantity < 1) quantity = 1;

  if (mode === "rate") {
    const lossRate = parseNumber(fields.lossRate?.value);
    if (!isUsable(lossRate) || lossRate < 0 || lossRate >= 100) {
      setError("lossRate", "손실률은 0 이상 100 미만으로 입력해 주세요.");
      return null;
    }
    return {
      mode,
      buyPrice: RATE_MODE_BASE_PRICE,
      currentPrice: RATE_MODE_BASE_PRICE * (1 - lossRate / 100),
      quantity: 1,
      lossRate,
      addAmount: 0,
      addPrice: 0,
    };
  }

  const buyPrice = parseNumber(fields.buyPrice?.value);
  const currentPrice = parseNumber(fields.currentPrice?.value);
  if (!isUsable(buyPrice) || buyPrice <= 0) {
    setError("buyPrice", "매수가를 입력해 주세요.");
    return null;
  }
  if (!isUsable(currentPrice) || currentPrice < 0) {
    setError("currentPrice", "현재가를 입력해 주세요.");
    return null;
  }

  let addAmount = parseNumber(fields.addAmount?.value);
  if (!isUsable(addAmount) || addAmount < 0) addAmount = 0;

  let addPrice = addPriceLinked ? currentPrice : parseNumber(fields.addPrice?.value);
  if (addAmount > 0 && (!isUsable(addPrice) || addPrice <= 0)) {
    setError("addPrice", "추가매수 가격을 입력해 주세요.");
    addPrice = 0;
  }

  return { mode, buyPrice, currentPrice, quantity, lossRate: null, addAmount, addPrice: addPrice || 0 };
}

// ── 렌더 ──────────────────────────────────────────

function setResult(key, value) {
  $$(`[data-slr-result="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function toggle(selector, show) {
  $$(selector).forEach((node) => {
    if (show) node.removeAttribute("hidden");
    else node.setAttribute("hidden", "");
  });
}

function renderMain(inputs, base) {
  const pnlNode = $('[data-slr-result="pnl"]');
  pnlNode?.classList.toggle("slr-result-value--loss", base.pnl < 0);
  pnlNode?.classList.toggle("slr-result-value--profit", base.pnl > 0);

  if (inputs.currentPrice === 0) {
    setResult("recoveryNeeded", "계산 불가");
    setResult("mainNote", "가격이 0이면 상승률로 복구할 수 없습니다.");
  } else if (inputs.currentPrice >= inputs.buyPrice) {
    setResult("recoveryNeeded", fmtPct(0));
    setResult("mainNote", `이미 본전 이상입니다. 현재 수익률은 ${fmtPct(base.lossRate)}입니다.`);
  } else {
    setResult("recoveryNeeded", fmtPct(base.recoveryNeeded));
    setResult(
      "mainNote",
      `손실률은 ${fmtPct(base.lossRate)}지만, 줄어든 금액에서 다시 올라야 하므로 더 큰 상승이 필요합니다.`,
    );
  }

  setResult("lossRate", fmtPct(base.lossRate));
  setResult("pnl", fmtSignedWon(base.pnl));
  setResult("valueNote", `원금 ${fmtWon(base.cost)} → 평가 ${fmtWon(base.value)}`);
  setResult("breakevenPrice", fmtPrice(base.breakevenPrice));
  toggle("[data-slr-money]", inputs.mode === "price");
}

function renderAveraging(inputs, base) {
  const active = inputs.mode === "price" && inputs.addAmount > 0 && inputs.addPrice > 0 && inputs.currentPrice > 0;
  toggle("[data-slr-avg]", active);
  if (!active) return null;

  const avg = calcAveraging(inputs);
  const warning = $('[data-slr-result="addWarning"]');
  const grid = $(".slr-compare-grid");

  if (avg.addQty === 0) {
    setResult("addSummary", "");
    setResult("addWarning", "추가매수 금액으로 1주도 살 수 없습니다. 금액이나 가격을 확인해 주세요.");
    warning?.removeAttribute("hidden");
    grid?.setAttribute("hidden", "");
    return null;
  }

  warning?.setAttribute("hidden", "");
  grid?.removeAttribute("hidden");
  setResult(
    "addSummary",
    `${avg.addQty.toLocaleString("ko-KR")}주 추가 매수(${fmtWon(avg.spent)}), 남는 금액 ${fmtWon(avg.leftover)} · 총 ${avg.totalQty.toLocaleString("ko-KR")}주`,
  );
  setResult("avgBeforeRecovery", fmtPct(Math.max(base.recoveryNeeded ?? 0, 0)));
  setResult("avgAfterRecovery", fmtPct(Math.max(avg.recoveryNeeded ?? 0, 0)));
  setResult("avgBeforeCost", fmtWon(base.cost));
  setResult("avgAfterCost", fmtWon(avg.totalCost));
  setResult("costIncrease", `투자원금 ${fmtPct(avg.costIncreaseRate, 1)} 증가 · 더 떨어지면 손실 금액도 커집니다`);
  setResult("avgBeforePrice", fmtPrice(inputs.buyPrice));
  setResult("avgAfterPrice", fmtPrice(avg.avgPrice));
  return avg;
}

function renderRebound(inputs, base, avg) {
  const section = $("[data-slr-rebound-section]");
  if (inputs.currentPrice === 0) {
    section?.setAttribute("hidden", "");
    return;
  }
  section?.removeAttribute("hidden");

  const showMoney = inputs.mode === "price";
  const columns = [{ key: "step", label: "현재가 대비" }];
  if (showMoney) {
    columns.push({ key: "value", label: "평가금액" }, { key: "pnl", label: "손익" });
  }
  columns.push({ key: "rate", label: "원금 대비" });
  if (avg) {
    columns.push({ key: "avgPnl", label: "추가매수 후 손익" }, { key: "avgRate", label: "추가매수 후 원금 대비" });
  }

  const head = $("[data-slr-rebound-head]");
  if (head) head.innerHTML = columns.map((c) => `<th scope="col">${c.label}</th>`).join("");

  const body = $("[data-slr-rebound-body]");
  if (!body) return;
  const tone = (v) => (v < 0 ? "slr-cell-loss" : v > 0 ? "slr-cell-profit" : "");

  body.innerHTML = REBOUND_STEPS.map((g) => {
    const r = calcRebound(inputs.currentPrice, inputs.quantity, base.cost, g);
    const cells = {
      step: `+${Math.round(g * 100)}%`,
      value: fmtWon(r.value),
      pnl: `<span class="${tone(r.pnl)}">${fmtSignedWon(r.pnl)}</span>`,
      rate: `<span class="${tone(r.returnRate)}">${fmtPct(r.returnRate)}</span>`,
    };
    if (avg) {
      const ra = calcRebound(inputs.currentPrice, avg.totalQty, avg.totalCost, g);
      cells.avgPnl = `<span class="${tone(ra.pnl)}">${fmtSignedWon(ra.pnl)}</span>`;
      cells.avgRate = `<span class="${tone(ra.returnRate)}">${fmtPct(ra.returnRate)}</span>`;
    }
    const tds = columns.map((c) => `<td data-label="${c.label}">${cells[c.key]}</td>`).join("");
    return `<tr>${tds}</tr>`;
  }).join("");
}

function renderReference(base) {
  const lossPct = Math.round(-base.lossRate * 10000) / 100;
  $$("[data-slr-ref-loss]").forEach((row) => {
    row.classList.toggle("is-current", Number(row.dataset.slrRefLoss) === lossPct);
  });
}

function initChart() {
  const wrap = $("[data-slr-chart-wrap]");
  const canvas = document.getElementById("slrChart");
  if (!wrap || !canvas || typeof window.Chart === "undefined") return;
  wrap.removeAttribute("hidden");

  const curve = [];
  for (let loss = CHART_RANGE.min; loss <= CHART_RANGE.max; loss += CHART_RANGE.step) {
    curve.push({ x: loss, y: Math.round(recoveryFromLoss(loss / 100) * 1000) / 10 });
  }

  chart = new window.Chart(canvas, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "복구 필요 상승률",
          data: curve,
          showLine: true,
          borderColor: "#1a56db",
          backgroundColor: "#1a56db",
          pointRadius: 2,
          borderWidth: 2,
        },
        {
          label: "내 위치",
          data: [],
          borderColor: "#d95c5c",
          backgroundColor: "#d95c5c",
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `손실 −${ctx.parsed.x.toFixed(1)}% → 필요 +${ctx.parsed.y.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: {
          min: CHART_RANGE.min,
          max: CHART_RANGE.max,
          title: { display: true, text: "손실률" },
          ticks: { callback: (v) => `−${v}%` },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "필요 상승률" },
          ticks: { callback: (v) => `+${v}%` },
        },
      },
    },
  });
}

function updateChartPoint(base) {
  if (!chart) return;
  const lossPct = -base.lossRate * 100;
  const note = $("[data-slr-chart-note]");
  if (lossPct > 0 && lossPct <= CHART_RANGE.max && base.recoveryNeeded !== null) {
    chart.data.datasets[1].data = [{ x: lossPct, y: base.recoveryNeeded * 100 }];
    if (note) note.textContent = `빨간 점이 지금 입력한 손실(${fmtPct(base.lossRate)})입니다.`;
  } else {
    chart.data.datasets[1].data = [];
    if (note) note.textContent = lossPct > CHART_RANGE.max ? "입력한 손실률이 차트 범위(−90%)를 벗어났습니다." : "";
  }
  chart.update("none");
}

// ── URL 상태 ──────────────────────────────────────

function syncUrl(inputs) {
  const values = {
    m: inputs.mode === DEFAULTS.mode ? null : inputs.mode,
    bp: inputs.mode === "price" && inputs.buyPrice !== DEFAULTS.buyPrice ? inputs.buyPrice : null,
    cp: inputs.mode === "price" && inputs.currentPrice !== DEFAULTS.currentPrice ? inputs.currentPrice : null,
    q: inputs.mode === "price" && inputs.quantity !== DEFAULTS.quantity ? inputs.quantity : null,
    lr: inputs.mode === "rate" && inputs.lossRate !== DEFAULTS.lossRate ? inputs.lossRate : null,
    aa: inputs.mode === "price" && inputs.addAmount > 0 ? inputs.addAmount : null,
    ap: inputs.mode === "price" && inputs.addAmount > 0 && !addPriceLinked ? inputs.addPrice : null,
  };
  const toWrite = {};
  const toDelete = [];
  Object.entries(values).forEach(([key, value]) => {
    if (value === null) toDelete.push(key);
    else toWrite[key] = value;
  });
  deleteParams(toDelete);
  if (Object.keys(toWrite).length > 0) writeParams(toWrite);
}

// ── 메인 렌더 ─────────────────────────────────────

function updatePresetState(inputs) {
  $$("[data-slr-preset]").forEach((btn) => {
    const loss = Number(btn.dataset.slrPreset);
    const active =
      inputs.mode === "rate"
        ? inputs.lossRate === loss
        : inputs.buyPrice === RATE_MODE_BASE_PRICE && inputs.currentPrice === RATE_MODE_BASE_PRICE * (1 - loss / 100);
    btn.classList.toggle("is-active", active);
  });
}

function render() {
  const inputs = readInputs();
  if (!inputs) return;

  const base = calcBase(inputs);
  renderMain(inputs, base);
  const avg = renderAveraging(inputs, base);
  renderRebound(inputs, base, avg);
  renderReference(base);
  updateChartPoint(base);
  updatePresetState(inputs);
  syncUrl(inputs);
}

function setMode(next) {
  mode = next === "rate" ? "rate" : "price";
  $$("[data-slr-mode]").forEach((btn) => {
    const active = btn.dataset.slrMode === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  toggle('[data-slr-mode-panel="price"]', mode === "price");
  toggle('[data-slr-mode-panel="rate"]', mode === "rate");

  const addPanel = $("[data-slr-add-panel]");
  addPanel?.querySelectorAll("input").forEach((input) => {
    input.disabled = mode === "rate";
  });
  toggle("[data-slr-add-disabled]", mode === "rate");
}

function setAddPriceLinked(linked) {
  addPriceLinked = linked;
  if (fields.addPrice) fields.addPrice.dataset.linked = linked ? "true" : "false";
  toggle("#slrAddPriceSync", !linked);
  if (linked && fields.addPrice && fields.currentPrice) {
    fields.addPrice.value = fields.currentPrice.value;
  }
}

function applyValues(values) {
  if (fields.buyPrice) fields.buyPrice.value = Math.round(values.buyPrice).toLocaleString("ko-KR");
  if (fields.currentPrice) fields.currentPrice.value = Math.round(values.currentPrice).toLocaleString("ko-KR");
  if (fields.quantity) fields.quantity.value = String(values.quantity);
  if (fields.lossRate) fields.lossRate.value = String(values.lossRate);
  if (fields.addAmount) fields.addAmount.value = Math.round(values.addAmount).toLocaleString("ko-KR");
  setMode(values.mode);
  if (values.addPrice === null) {
    setAddPriceLinked(true);
  } else {
    setAddPriceLinked(false);
    if (fields.addPrice) fields.addPrice.value = Math.round(values.addPrice).toLocaleString("ko-KR");
  }
}

function hydrateFromUrl() {
  const num = (key, fallback) => {
    const value = parseNumber(readParam(key, ""));
    return isUsable(value) ? value : fallback;
  };
  const ap = parseNumber(readParam("ap", ""));
  applyValues({
    mode: readParam("m", DEFAULTS.mode) === "rate" ? "rate" : "price",
    buyPrice: num("bp", DEFAULTS.buyPrice),
    currentPrice: num("cp", DEFAULTS.currentPrice),
    quantity: Math.max(1, Math.floor(num("q", DEFAULTS.quantity))),
    lossRate: num("lr", DEFAULTS.lossRate),
    addAmount: Math.max(0, num("aa", DEFAULTS.addAmount)),
    addPrice: isUsable(ap) && ap > 0 ? ap : null,
  });
}

// ── 이벤트 ────────────────────────────────────────

[fields.buyPrice, fields.quantity, fields.lossRate, fields.addAmount].forEach((field) => {
  field?.addEventListener("input", render);
});

fields.currentPrice?.addEventListener("input", () => {
  if (addPriceLinked && fields.addPrice) fields.addPrice.value = fields.currentPrice.value;
  render();
});

fields.addPrice?.addEventListener("input", () => {
  setAddPriceLinked(false);
  render();
});

fields.quantity?.addEventListener("change", () => {
  const q = Math.floor(parseNumber(fields.quantity.value));
  fields.quantity.value = String(isUsable(q) && q >= 1 ? q : 1);
  render();
});

moneyFields.forEach((field) => {
  field?.addEventListener("blur", () => formatMoneyInput(field));
});

$("#slrAddPriceSync")?.addEventListener("click", () => {
  setAddPriceLinked(true);
  render();
});

$$("[data-slr-mode]").forEach((btn) => {
  btn.addEventListener("click", () => {
    setMode(btn.dataset.slrMode);
    render();
  });
});

$$("[data-slr-preset]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const loss = Number(btn.dataset.slrPreset);
    if (mode === "rate") {
      if (fields.lossRate) fields.lossRate.value = String(loss);
    } else {
      if (fields.buyPrice) fields.buyPrice.value = RATE_MODE_BASE_PRICE.toLocaleString("ko-KR");
      if (fields.currentPrice) {
        fields.currentPrice.value = (RATE_MODE_BASE_PRICE * (1 - loss / 100)).toLocaleString("ko-KR");
      }
      if (addPriceLinked && fields.addPrice && fields.currentPrice) fields.addPrice.value = fields.currentPrice.value;
    }
    render();
  });
});

$("#slrResetBtn")?.addEventListener("click", () => {
  applyValues(DEFAULTS);
  deleteParams(URL_KEYS);
  render();
});

$("#slrCopyLinkBtn")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  render();
  try {
    await navigator.clipboard.writeText(window.location.href);
    button.textContent = "링크 복사됨";
  } catch {
    button.textContent = "복사 실패";
  }
  window.setTimeout(() => {
    button.textContent = "링크 복사";
  }, 1600);
});

hydrateFromUrl();
initChart();
render();
