// 4대보험 계산기 2027 — 화면 연결만 담당. 계산은 four-insurance-core.js(국민연금은 공용 모듈)에서 한다.
// 입력값은 주소·저장소에 남기지 않는다. 링크 복사는 페이지 주소만 복사한다.
import {
  calculateFourInsuranceComparison,
  INSURANCE_KINDS,
  INSURANCE_LABELS,
} from "./four-insurance-core.js?v=20261110";

const configEl = document.getElementById("ficConfig");
const { rules, defaults = {}, presets = [], statusLabels = {} } = JSON.parse(configEl?.textContent || "{}");

const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const page = document.querySelector('[data-calculator="four-insurance-calculator"]');

const state = { comparisonMode: defaults.comparisonMode || "same_basis" };

// ─── 표시 ───
const won = (v) => `${Math.round(v).toLocaleString("ko-KR")}원`;
const signedWon = (v) => (v > 0 ? `+${won(v)}` : v < 0 ? `−${won(-v)}` : "0원");
const monthText = (m) => (m ? `${m.slice(0, 4)}년 ${Number(m.slice(5, 7))}월` : "-");
const listKinds = (kinds) => kinds.map((k) => INSURANCE_LABELS[k]).join("·");
function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c != null) node.append(c);
  return node;
}
function badge(status) {
  return el("span", { class: `fic-badge fic-badge--${status}`, text: statusLabels[status] || status });
}

// ─── 입력 읽기 ───
function readInt(id) {
  const raw = $(id)?.value;
  if (raw == null || String(raw).trim() === "") return null;
  const v = Number(raw);
  return Number.isFinite(v) ? Math.round(v) : null;
}

function readApplicability() {
  const out = {};
  $$("[data-fic-applies]").forEach((s) => (out[s.dataset.ficApplies] = s.value));
  return out;
}

function readInput() {
  const applicability = readApplicability();
  const explicit = $("ficExplicitBases")?.checked && state.comparisonMode === "same_basis";
  const explicitBases = explicit
    ? { pension: readInt("ficBasisPension"), health: readInt("ficBasisHealth"), employment: readInt("ficBasisEmployment") }
    : {};
  const basisMode = explicit ? "explicit_bases" : "simple_estimate";
  const after = {
    month: $("ficAfterMonth")?.value,
    grossPayWon: readInt("ficMonthlySalary"),
    nonTaxablePayWon: readInt("ficTaxFreeAmount") ?? 0,
    basisMode,
    explicitBases,
    applicability,
  };
  const before =
    state.comparisonMode === "changed_pay"
      ? { ...after, month: $("ficBeforeMonth")?.value, grossPayWon: readInt("ficBeforeMonthlySalary"), nonTaxablePayWon: readInt("ficBeforeTaxFreeAmount") ?? 0 }
      : { ...after, month: $("ficBeforeMonth")?.value };

  const taxMode = $("ficTaxMode")?.value || "excluded";
  let tax = { mode: "excluded" };
  if (taxMode === "manual") tax = { mode: "manual", incomeTaxWon: readInt("ficIncomeTax") ?? 0, localTaxWon: readInt("ficLocalTax") ?? 0 };
  if (taxMode === "legacy_preview") tax = { mode: "legacy_preview", dependents: readInt("ficDependents") ?? 1, children: readInt("ficChildren") ?? 0 };

  return {
    comparisonMode: state.comparisonMode,
    before,
    after,
    assumptions: { employmentScenario: Boolean($("ficEmploymentScenario")?.checked) },
    tax,
  };
}

// ─── 렌더 ───
function clearErrors() {
  $$("[data-fic-error]").forEach((e) => (e.textContent = ""));
  const box = $("ficFormError");
  if (box) box.hidden = true;
}

function showErrors(errors) {
  const messages = [];
  for (const side of ["before", "after"]) {
    for (const e of errors[side] || []) {
      const slot = document.querySelector(`[data-fic-error="${side}_${e.field}"]`) || document.querySelector(`[data-fic-error="after_${e.field}"]`);
      if (slot) slot.textContent = e.message;
      messages.push(e.message);
    }
  }
  const box = $("ficFormError");
  if (box) {
    box.hidden = false;
    box.textContent = `입력을 확인해 주세요: ${[...new Set(messages)].join(" ")}`;
  }
  // 오래된 결과를 최신처럼 보이지 않게 비운다
  ["ficAfterTotal", "ficDelta", "ficCash"].forEach((id) => setText(id, "-"));
  ["ficAfterTotalNote", "ficDeltaNote", "ficCashNote"].forEach((id) => setText(id, "입력 오류"));
  $("ficCompareBody")?.replaceChildren();
  $("ficCompareFoot")?.replaceChildren();
  $("ficNotes")?.replaceChildren();
  $("ficCashBody")?.replaceChildren();
  $("ficEmployerBody")?.replaceChildren();
  const sc = $("ficScenario");
  if (sc) sc.hidden = true;
}

function itemCell(item) {
  if (!item) return "-";
  if (item.status === "calculated") return won(item.employeeWon);
  if (item.status === "not_applicable") return "미적용";
  return "계산 안 함";
}

function itemStatus(item) {
  if (item.status === "not_applicable") return el("span", { class: "fic-muted", text: "미적용" });
  if (item.status === "unavailable") {
    if (item.issue.code === "FI_SCENARIO_NOT_OPTED_IN") return el("span", { class: "fic-badge fic-badge--unknown", text: "정부안 · 합계 제외" });
    return badge("unknown");
  }
  if (item.assumption) return badge("scenario");
  const roundingAssumption = item.provenance?.roundingStatus !== "verified";
  if (roundingAssumption) return el("span", { class: "fic-badge fic-badge--scenario", text: `${statusLabels[item.ruleStatus || "verified"] || "요율 확인"} · 단수 가정` });
  return badge(item.ruleStatus || "verified");
}

function renderTable(r) {
  const body = $("ficCompareBody");
  const foot = $("ficCompareFoot");
  if (!body || !foot) return;
  body.replaceChildren(
    ...r.comparison.rows.map((row) => {
      const deltaText = row.deltaWon == null ? "-" : signedWon(row.deltaWon) + (row.after.assumption ? " (가정)" : "");
      return el("tr", {}, [
        el("th", { scope: "row", text: INSURANCE_LABELS[row.kind] }),
        el("td", { "data-label": "2026", text: itemCell(row.before) }),
        el("td", { "data-label": "2027", text: itemCell(row.after) }),
        el("td", { "data-label": "월 차이", text: deltaText }),
        el("td", { "data-label": "기준 상태" }, [itemStatus(row.after)]),
      ]);
    }),
  );

  const b = r.before;
  const a = r.after;
  const subset = r.comparison.scope === "common_subset";
  // 비교 범위가 일부 항목이면 양쪽 모두 같은 범위의 소계를 보여 준다(전체 합계 vs 소계를 나란히 두지 않음)
  const total = (agg, sub) =>
    subset ? `${won(sub)} (같은 범위 소계)` : agg.completeTotalWon != null ? won(agg.completeTotalWon) : `${won(agg.verifiedSubtotalWon)} (소계)`;
  const deltaText =
    r.comparison.scope === "complete" ? signedWon(r.comparison.deltaWon)
    : r.comparison.scope === "common_subset" ? `${signedWon(r.comparison.deltaWon)} (${listKinds(r.comparison.kinds)})`
    : "-";
  const scopeText =
    a.completeTotalWon != null && b.completeTotalWon != null ? "전체 합계" : `계산 가능 항목 소계 · 단수 가정${a.missingKinds.length ? ` · ${listKinds(a.missingKinds)} 제외` : ""}`;
  foot.replaceChildren(
    el("tr", {}, [
      el("th", { scope: "row", text: "근로자 보험료 합계" }),
      el("td", { "data-label": "2026", text: total(b, r.comparison.beforeSubtotalWon) }),
      el("td", { "data-label": "2027", text: total(a, r.comparison.afterSubtotalWon) }),
      el("td", { "data-label": "월 차이", text: deltaText }),
      el("td", { "data-label": "기준 상태", text: scopeText }),
    ]),
  );
}

function renderNotes(r) {
  const notes = [];
  const push = (label, text) => notes.push(el("li", {}, [el("strong", { text: `${label} ` }), text]));
  for (const [side, agg, month] of [["2026", r.before, r.periods.before.month], ["2027", r.after, r.periods.after.month]]) {
    for (const item of agg.items) {
      const label = `${side} ${INSURANCE_LABELS[item.kind]}:`;
      if (item.status === "unavailable") push(label, item.issue.message);
      for (const adj of item.adjustments || []) {
        const kind = { income_rounding: "천원 미만 버림", lower_bound: "하한 적용", upper_bound: "상한 적용" }[adj.kind];
        push(label, `${kind} ${won(adj.beforeWon)} → ${won(adj.afterWon)} (${monthText(month)} 기준)`);
      }
      for (const n of item.notes || []) push(label, n);
    }
  }
  for (const w of r.warnings) push("확인:", w.message);
  push("단수 처리:", "국민연금 원 미만, 건강·장기요양·고용보험 10원 미만 버림(통용 방식)으로 계산했습니다. 공단 고지액과 몇십 원 다를 수 있습니다.");
  $("ficNotes")?.replaceChildren(...notes);
}

const CASH_LABELS = {
  after_insurance: "보험료 공제 후 금액",
  estimated_take_home: "추정 수령액 (세금 직접 입력)",
  preview: "참고 수령액 (간이 세금 추정)",
  unavailable: "공제 후 금액",
};

function renderCash(r) {
  const b = r.cash.before;
  const a = r.cash.after;
  const v = (x) => (x == null ? "-" : won(x));
  const rows = [
    ["세전 월 급여", v(b.grossPayWon), v(a.grossPayWon)],
    ["근로자 보험료", b.insuranceTotalWon == null ? "계산 안 함" : v(b.insuranceTotalWon), a.insuranceTotalWon == null ? "계산 안 함" : v(a.insuranceTotalWon) + (a.assumption ? " (가정)" : "")],
    ["소득세", b.incomeTaxWon == null ? "제외" : v(b.incomeTaxWon), a.incomeTaxWon == null ? "제외" : v(a.incomeTaxWon)],
    ["지방소득세", b.localTaxWon == null ? "제외" : v(b.localTaxWon), a.localTaxWon == null ? "제외" : v(a.localTaxWon)],
    [CASH_LABELS[a.label === "unavailable" ? b.label : a.label], v(b.amountWon), v(a.amountWon)],
  ];
  $("ficCashBody")?.replaceChildren(
    ...rows.map(([label, x, y]) => el("tr", {}, [el("th", { scope: "row", text: label }), el("td", { "data-label": "2026", text: x }), el("td", { "data-label": "2027", text: y })])),
  );

  setText("ficCashLabel", `2027 ${CASH_LABELS[a.label]}`);
  if (a.amountWon == null) {
    setText("ficCash", "-");
    const missing = r.after.missingKinds;
    const hint = missing.length === 1 && missing[0] === "employment"
      ? " 고용보험 정부안 가정을 켜거나 고용보험 '미적용'을 고르면 계산합니다."
      : "";
    setText("ficCashNote", (a.issue?.message || "계산할 수 없습니다.") + hint);
  } else {
    setText("ficCash", won(a.amountWon));
    const extra = a.label === "after_insurance" ? "소득세 제외 · 세후 실수령액 아님" : a.label === "preview" ? "간이 세금 추정 포함 · 참고용" : "입력한 세금 반영 · 기타 공제 미포함";
    setText("ficCashNote", (a.assumption ? "고용보험 가정 포함 · " : "") + extra + (a.amountWon < 0 ? " · 공제액이 급여보다 큽니다. 입력을 확인하세요." : ""));
  }
}

function renderEmployer(r) {
  const section = $("ficEmployerSection");
  const show = Boolean($("ficShowEmployerShare")?.checked);
  if (section) section.hidden = !show;
  if (!show) return;
  const cell = (item) =>
    item.status === "calculated" && item.employerWon != null ? won(item.employerWon) + (item.assumption ? " (가정)" : "")
    : item.status === "not_applicable" ? "미적용" : "계산 안 함";
  const rows = INSURANCE_KINDS.map((kind) => {
    const b = r.before.items.find((i) => i.kind === kind);
    const a = r.after.items.find((i) => i.kind === kind);
    const label = kind === "employment" ? "고용보험 (실업급여분)" : INSURANCE_LABELS[kind];
    return el("tr", {}, [el("th", { scope: "row", text: label }), el("td", { "data-label": "2026", text: cell(b) }), el("td", { "data-label": "2027", text: cell(a) })]);
  });
  $("ficEmployerBody")?.replaceChildren(...rows);
}

function render() {
  clearErrors();
  syncModeUi();
  const input = readInput();
  const res = calculateFourInsuranceComparison(input, rules);
  if (!res.ok) {
    showErrors(res.errors);
    return;
  }
  const r = res.value;
  const a = r.after;

  setText(
    "ficModeCaption",
    `${r.comparisonMode === "same_basis" ? "같은 월급 기준" : "급여 변화 포함"} · ${monthText(r.periods.before.month)} vs ${monthText(r.periods.after.month)}` +
      (r.periods.after.basisMode === "explicit_bases" ? " · 보험별 기준 직접 입력" : " · 급여−비과세를 산정 기준으로 추정"),
  );

  if (a.completeTotalWon != null) {
    setText("ficAfterTotalLabel", "2027 근로자 보험료 합계");
    setText("ficAfterTotal", won(a.completeTotalWon));
    setText("ficAfterTotalNote", `${monthText(r.periods.after.month)} · 적용 항목 모두 계산`);
  } else {
    setText("ficAfterTotalLabel", "2027 계산 가능 항목 소계 · 단수 가정");
    setText("ficAfterTotal", won(a.verifiedSubtotalWon));
    setText("ficAfterTotalNote", `${listKinds(a.includedKinds) || "계산된 항목 없음"}만 포함 · ${listKinds(a.missingKinds)} 제외`);
  }

  if (r.comparison.deltaWon == null) {
    setText("ficDelta", "-");
    setText("ficDeltaNote", r.comparison.issue?.message || "비교할 수 없습니다.");
  } else {
    setText("ficDelta", signedWon(r.comparison.deltaWon));
    setText(
      "ficDeltaNote",
      r.comparison.scope === "complete"
        ? `연 환산 ${signedWon(r.comparison.deltaWon * 12)} (12개월 같은 조건 가정)`
        : `${listKinds(r.comparison.kinds)}만 비교 · 연 환산 ${signedWon(r.comparison.deltaWon * 12)}`,
    );
  }

  const sc = $("ficScenario");
  if (sc) {
    sc.hidden = !r.scenarioComparison;
    if (r.scenarioComparison) {
      setText(
        "ficScenarioText",
        `고용보험 정부안 1.0%를 가정하면 2027 근로자 보험료는 ${won(r.scenarioComparison.afterWon)}, 2026년보다 월 ${signedWon(r.scenarioComparison.deltaWon)}입니다. 법령 개정 전 가정값입니다.`,
      );
    }
  }

  renderTable(r);
  renderNotes(r);
  renderCash(r);
  renderEmployer(r);
}

// ─── 모드 UI ───
function syncModeUi() {
  const changed = state.comparisonMode === "changed_pay";
  $$("[data-fic-compare]").forEach((b) => {
    const on = b.dataset.ficCompare === state.comparisonMode;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  const before = document.querySelector("[data-fic-before-pay]");
  if (before) before.hidden = !changed;
  const sl = document.querySelector("[data-fic-salary-label]");
  if (sl) sl.textContent = changed ? "2027 세전 월 급여 (원)" : "세전 월 급여 (원)";
  const tl = document.querySelector("[data-fic-taxfree-label]");
  if (tl) tl.textContent = changed ? "2027 비과세 금액 (원)" : "비과세 금액 (원)";

  const explicitBox = $("ficExplicitBases");
  if (explicitBox) explicitBox.disabled = changed;
  const explicitFields = document.querySelector("[data-fic-explicit-fields]");
  if (explicitFields) explicitFields.hidden = !(explicitBox?.checked && !changed);

  const mode = $("ficTaxMode")?.value;
  $$("[data-fic-tax]").forEach((p) => (p.hidden = p.dataset.ficTax !== mode));
}

function applyDefaults() {
  state.comparisonMode = defaults.comparisonMode || "same_basis";
  const set = (id, v) => $(id) && ($(id).value = v ?? "");
  set("ficBeforeMonth", defaults.beforeMonth);
  set("ficAfterMonth", defaults.afterMonth);
  set("ficMonthlySalary", defaults.monthlySalary);
  set("ficTaxFreeAmount", defaults.taxFreeAmount);
  set("ficBeforeMonthlySalary", defaults.beforeMonthlySalary);
  set("ficBeforeTaxFreeAmount", defaults.beforeTaxFreeAmount);
  ["ficBasisPension", "ficBasisHealth", "ficBasisEmployment", "ficIncomeTax", "ficLocalTax"].forEach((id) => set(id, ""));
  set("ficDependents", defaults.dependents);
  set("ficChildren", defaults.children);
  set("ficTaxMode", defaults.taxMode);
  $$("[data-fic-applies]").forEach((s) => (s.value = defaults.applicability?.[s.dataset.ficApplies] || "applies"));
  if ($("ficExplicitBases")) $("ficExplicitBases").checked = false;
  if ($("ficEmploymentScenario")) $("ficEmploymentScenario").checked = Boolean(defaults.employmentScenario);
  if ($("ficShowEmployerShare")) $("ficShowEmployerShare").checked = Boolean(defaults.showEmployerShare);
}

/** 예전 공유 링크(?salary=&taxfree=)는 한 번만 읽고 주소에서 지운다 */
function hydrateLegacyQuery() {
  const params = new URLSearchParams(window.location.search);
  const salary = Number(params.get("salary"));
  const taxfree = Number(params.get("taxfree"));
  if (Number.isFinite(salary) && salary > 0) $("ficMonthlySalary").value = String(Math.round(salary));
  if (Number.isFinite(taxfree) && taxfree >= 0 && params.has("taxfree")) $("ficTaxFreeAmount").value = String(Math.round(taxfree));
  if (["salary", "taxfree", "dependents"].some((k) => params.has(k))) {
    ["salary", "taxfree", "dependents"].forEach((k) => params.delete(k));
    const q = params.toString();
    history.replaceState(null, "", q ? `${location.pathname}?${q}` : location.pathname);
  }
}

if (page && rules) {
  hydrateLegacyQuery();
  page.addEventListener("input", render);
  page.addEventListener("change", render);
  $$("[data-fic-compare]").forEach((b) =>
    b.addEventListener("click", () => {
      state.comparisonMode = b.dataset.ficCompare;
      render();
    }),
  );
  $$("[data-fic-preset]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = presets[Number(b.dataset.ficPreset)];
      if (!p) return;
      $("ficMonthlySalary").value = p.monthlySalary;
      $("ficTaxFreeAmount").value = p.taxFreeAmount;
      if (state.comparisonMode === "changed_pay") {
        $("ficBeforeMonthlySalary").value = p.monthlySalary;
        $("ficBeforeTaxFreeAmount").value = p.taxFreeAmount;
      }
      render();
    }),
  );
  $("resetFicBtn")?.addEventListener("click", () => {
    applyDefaults();
    render();
  });
  $("copyFicLinkBtn")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const clean = `${location.origin}${location.pathname}`;
    try {
      await navigator.clipboard.writeText(clean);
      button.textContent = "페이지 링크 복사됨";
    } catch {
      button.textContent = "복사 실패";
    }
    setTimeout(() => (button.textContent = "링크 복사"), 1600);
  });
  render();
}
