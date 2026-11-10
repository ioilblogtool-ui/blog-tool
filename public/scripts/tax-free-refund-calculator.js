// url-state.js는 브라우저에 캐시될 수 있어 deleteParams가 있는 사본을 받도록 버전 쿼리를 붙인다.
import { readParam, writeParams, deleteParams } from "./url-state.js?v=20261027";

const configEl = document.getElementById("tfrConfig");
const config = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const COUNTRIES = config.COUNTRIES || [];
const FX = config.FX || {};
const DEFAULTS = config.DEFAULT_INPUT || { country: "JP", amount: 33000, rateType: "standard" };
const URL_KEYS = ["c", "a", "rt", "fx", "fee"];
const NO_DECIMAL = new Set(["JPY", "TWD", "THB"]);

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const fields = {
  amount: $("#tfrAmount"),
  fx: $("#tfrFx"),
  fee: $("#tfrFee"),
};

const state = {
  country: DEFAULTS.country,
  rateType: DEFAULTS.rateType,
  fxEdited: false,
};

const findCountry = (code) => COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];

// ─── 계산 ───
function calcRefund(country, amount, rateType) {
  const r = rateType === "reduced" && country.reducedRate ? country.reducedRate : country.vatRate;
  const preTax = amount / (1 + r);
  const vat = amount - preTax;
  const basisAmount = country.minBasis === "pre-tax" ? preTax : amount;
  const meetsMin =
    country.minBasis === "none" || country.minPurchase == null || basisAmount >= country.minPurchase - 1e-6;
  const requiredInclusive =
    country.minPurchase == null ? 0 : country.minBasis === "pre-tax" ? country.minPurchase * (1 + r) : country.minPurchase;
  const shortfall = meetsMin ? 0 : requiredInclusive - amount;
  return { r, preTax, vat, maxRate: r / (1 + r), meetsMin, requiredInclusive, shortfall };
}

// ─── 표시 ───
const safe = (v) => Number.isFinite(v);
function fmtLocal(v, country) {
  if (!safe(v)) return "—";
  const digits = NO_DECIMAL.has(country.currency) ? 0 : 2;
  return `${v.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}${country.currencyLabel}`;
}
function fmtKrw(v) {
  if (!safe(v)) return "—";
  return `${(Math.round(v / 10) * 10).toLocaleString("ko-KR")}원`;
}
const fmtPct = (v) => (safe(v) ? `${(v * 100).toFixed(2)}%` : "—");

function parseNumber(input) {
  if (!input) return NaN;
  const raw = String(input.value).replace(/,/g, "").trim();
  if (raw === "") return NaN;
  return Number(raw);
}

function formatAmountField(country) {
  const v = parseNumber(fields.amount);
  if (!safe(v)) return;
  const digits = NO_DECIMAL.has(country.currency) ? 0 : 2;
  fields.amount.value = v.toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

function setText(key, text) {
  const el = document.querySelector(`[data-tfr-result="${key}"]`);
  if (el) el.textContent = text;
}
function setError(key, text) {
  const el = document.querySelector(`[data-tfr-error="${key}"]`);
  if (el) el.textContent = text;
}

// ─── 국가 전환 ───
function applyCountry(code, { resetAmount }) {
  const country = findCountry(code);
  state.country = country.code;
  if (!country.reducedRate) state.rateType = "standard";

  $$("[data-tfr-country]").forEach((btn) => {
    const active = btn.dataset.tfrCountry === country.code;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  $("#tfrCurrencyLabel").textContent = country.currencyLabel;
  $$("[data-tfr-fx-unit]").forEach((el) => (el.textContent = country.currencyLabel));
  if (resetAmount) {
    fields.amount.value = String(country.sampleAmount);
    formatAmountField(country);
  }
  if (!state.fxEdited) fields.fx.value = String(FX[country.currency] || "");

  const rateWrap = $("[data-tfr-rate-wrap]");
  if (rateWrap) rateWrap.hidden = !country.reducedRate;
  syncRateButtons();

  fields.amount.disabled = !country.available;
  setText("countryName", country.name);
  const statusEl = document.querySelector('[data-tfr-result="status"]');
  if (statusEl) {
    statusEl.textContent = country.status === "verified" ? "공식 확인" : "확인 필요";
    statusEl.classList.toggle("tfr-badge--ok", country.status === "verified");
  }
  setText("place", country.refundPlace);
  const notesEl = document.querySelector('[data-tfr-result="notes"]');
  if (notesEl) {
    notesEl.replaceChildren(
      ...country.notes.map((n) => {
        const li = document.createElement("li");
        li.textContent = n;
        return li;
      }),
    );
  }
  const japan = $("[data-tfr-japan]");
  if (japan) japan.hidden = country.code !== "JP";
  $$("[data-tfr-bar]").forEach((el) => el.classList.toggle("is-current", el.dataset.tfrBar === country.code));
}

function syncRateButtons() {
  $$("[data-tfr-rate]").forEach((btn) => {
    const active = btn.dataset.tfrRate === state.rateType;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

// ─── 렌더 ───
function render() {
  const country = findCountry(state.country);
  const unavailable = $("[data-tfr-unavailable]");
  const mainCards = $(".tfr-result-cards");
  const breakdownSection = $("[data-tfr-breakdown-section]");

  if (!country.available) {
    if (unavailable) {
      unavailable.hidden = false;
      unavailable.textContent = `${country.name}은 2021년부터 관광객 부가세 환급 제도가 없어 돌려받을 수 있는 금액이 없습니다.`;
    }
    if (mainCards) mainCards.hidden = true;
    if (breakdownSection) breakdownSection.hidden = true;
    setError("amount", "");
    writeState(country, NaN);
    return;
  }
  if (unavailable) unavailable.hidden = true;
  if (mainCards) mainCards.hidden = false;
  if (breakdownSection) breakdownSection.hidden = false;

  const amount = parseNumber(fields.amount);
  if (!safe(amount) || amount <= 0) {
    setError("amount", "결제 금액을 0보다 크게 입력해 주세요.");
    return;
  }
  setError("amount", "");

  let fx = parseNumber(fields.fx);
  if (!safe(fx) || fx <= 0) {
    fx = FX[country.currency] || 0;
    fields.fx.value = String(fx);
    state.fxEdited = false;
  }

  const feeRaw = parseNumber(fields.fee);
  let fee = null;
  if (safe(feeRaw)) {
    if (feeRaw < 0 || feeRaw > 100) {
      setError("fee", "0~100 사이로 입력해 주세요.");
    } else {
      setError("fee", "");
      fee = feeRaw;
    }
  } else {
    setError("fee", "");
  }

  const res = calcRefund(country, amount, state.rateType);
  const afterFee = fee != null ? res.vat * (1 - fee / 100) : null;

  setText("refundKrw", fmtKrw(res.vat * fx));
  setText("refundLocal", `${fmtLocal(res.vat, country)} · 결제 금액의 ${fmtPct(res.maxRate)}`);
  const feeText =
    afterFee != null
      ? `수수료 ${fee}% 반영 시 약 ${fmtLocal(afterFee, country)} (${fmtKrw(afterFee * fx)}) · 추정`
      : "대행사 수수료가 있으면 실제로 받는 금액은 이보다 적습니다.";
  setText("feeNote", res.meetsMin ? feeText : `아직 최소금액에 못 미쳐 지금은 환급 대상이 아닙니다. ${feeText}`);

  const minCard = $("[data-tfr-min-card]");
  if (minCard) minCard.dataset.state = res.meetsMin ? "ok" : "short";
  if (res.meetsMin) {
    setText("minStatus", "환급 대상");
    let note = country.minLabel;
    if (country.tripTotalMin) note += ` · 여행 전체 합계 ${country.tripTotalMin.toLocaleString("ko-KR")}${country.currencyLabel} 이상인지도 확인하세요.`;
    setText("minNote", note);
  } else {
    setText("minStatus", "금액 부족");
    setText(
      "minNote",
      `${fmtLocal(res.shortfall, country)}(약 ${fmtKrw(res.shortfall * fx)}) 더 사면 환급 대상입니다. ${fmtLocal(res.requiredInclusive, country)} 이상 결제 필요.`,
    );
  }

  const body = $("[data-tfr-breakdown]");
  if (body) {
    const rows = [
      ["결제 금액 (세금 포함)", fmtLocal(amount, country)],
      [`세금 뺀 금액 (세율 ${(res.r * 100).toFixed(0)}%)`, fmtLocal(res.preTax, country)],
      ["포함된 부가세 = 최대 환급액", fmtLocal(res.vat, country), true],
    ];
    if (afterFee != null) {
      rows.push([`대행사 수수료 (${fee}%)`, `−${fmtLocal(res.vat - afterFee, country)}`]);
      rows.push(["수수료 반영 환급액 (추정)", fmtLocal(afterFee, country), true]);
    }
    rows.push(["원화 환산 (최대 환급액)", fmtKrw(res.vat * fx)]);
    body.replaceChildren(
      ...rows.map(([label, value, strong]) => {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.scope = "row";
        th.textContent = label;
        const td = document.createElement("td");
        if (strong) {
          const s = document.createElement("strong");
          s.textContent = value;
          td.appendChild(s);
        } else {
          td.textContent = value;
        }
        tr.append(th, td);
        return tr;
      }),
    );
  }

  writeState(country, amount, fee);
}

function writeState(country, amount, fee = null) {
  const set = {};
  const remove = [];
  if (country.code !== DEFAULTS.country) set.c = country.code;
  else remove.push("c");
  const isSample = safe(amount) && Math.abs(amount - country.sampleAmount) < 1e-9;
  if (safe(amount) && !(country.code === DEFAULTS.country ? amount === DEFAULTS.amount : isSample)) set.a = amount;
  else remove.push("a");
  if (state.rateType === "reduced") set.rt = "reduced";
  else remove.push("rt");
  if (state.fxEdited) set.fx = parseNumber(fields.fx);
  else remove.push("fx");
  if (fee != null) set.fee = fee;
  else remove.push("fee");
  deleteParams(remove);
  if (Object.keys(set).length) writeParams(set);
}

// ─── URL 복원 ───
function hydrateFromUrl() {
  const code = readParam("c", DEFAULTS.country);
  const country = findCountry(code);
  state.rateType = readParam("rt", "standard") === "reduced" ? "reduced" : "standard";
  const fx = Number(readParam("fx", ""));
  if (safe(fx) && fx > 0) {
    fields.fx.value = String(fx);
    state.fxEdited = true;
  }
  applyCountry(country.code, { resetAmount: true });
  const a = Number(readParam("a", ""));
  if (safe(a) && a > 0) {
    fields.amount.value = String(a);
    formatAmountField(country);
  } else if (country.code === DEFAULTS.country) {
    fields.amount.value = String(DEFAULTS.amount);
    formatAmountField(country);
  }
  const fee = readParam("fee", "");
  if (fee !== "") fields.fee.value = fee;
}

// ─── 이벤트 ───
$$("[data-tfr-country]").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyCountry(btn.dataset.tfrCountry, { resetAmount: true });
    render();
  });
});

$$("[data-tfr-rate]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.rateType = btn.dataset.tfrRate === "reduced" ? "reduced" : "standard";
    syncRateButtons();
    render();
  });
});

fields.amount?.addEventListener("input", render);
fields.amount?.addEventListener("blur", () => formatAmountField(findCountry(state.country)));
fields.fx?.addEventListener("input", () => {
  state.fxEdited = true;
  render();
});
fields.fee?.addEventListener("input", render);

$("#tfrResetBtn")?.addEventListener("click", () => {
  state.rateType = DEFAULTS.rateType;
  state.fxEdited = false;
  fields.fee.value = "";
  applyCountry(DEFAULTS.country, { resetAmount: false });
  fields.amount.value = String(DEFAULTS.amount);
  formatAmountField(findCountry(DEFAULTS.country));
  deleteParams(URL_KEYS);
  render();
});

$("#tfrCopyLinkBtn")?.addEventListener("click", async (event) => {
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
render();
