// 기준금리·대출금리 변동 계산기
// 상환 공식: loan-refinancing-calculator.js 의 calculateMonthlyPayment/calculateTotalInterest 와 동일
(function () {
  "use strict";

  const configEl = document.getElementById("lircConfig");
  if (!configEl) return;

  const config = JSON.parse(configEl.textContent || "{}");
  const defaults = config.defaultInput || {};
  const limits = config.limits || {};
  const quickDeltas = Array.isArray(config.quickDeltas) ? config.quickDeltas : [];
  const presets = Array.isArray(config.presets) ? config.presets : [];
  const repayOptions = Array.isArray(config.repayOptions) ? config.repayOptions : [];
  const baseRate = config.baseRate || {};
  const REPAY_TYPES = ["annuity", "equalPrincipal", "bullet"];
  const RATE_MODES = ["delta", "target"];
  const MINUS = "−";

  const state = { ...defaults };

  const $ = (id) => document.getElementById(id);
  const els = {
    balance: $("lircBalance"),
    years: $("lircYears"),
    extraMonths: $("lircExtraMonths"),
    periodNote: $("lircPeriodNote"),
    repayNote: $("lircRepayNote"),
    rateNow: $("lircRateNow"),
    rateNowNote: $("lircRateNowNote"),
    rateDelta: $("lircRateDelta"),
    rateNew: $("lircRateNew"),
    ratePreview: $("lircRatePreview"),
    invalid: $("lircInvalid"),
    kpiGrid: $("lircKpiGrid"),
    kpiMonthly: $("lircKpiMonthly"),
    kpiTotal: $("lircKpiTotal"),
    kpiAnnual: $("lircKpiAnnual"),
    monthlyDiff: $("lircMonthlyDiff"),
    monthlyDiffSub: $("lircMonthlyDiffSub"),
    nextMonthly: $("lircNextMonthly"),
    nextMonthlySub: $("lircNextMonthlySub"),
    totalDiff: $("lircTotalDiff"),
    totalDiffSub: $("lircTotalDiffSub"),
    annualDiff: $("lircAnnualDiff"),
    message: $("lircMessage"),
    detailBody: $("lircDetailBody"),
    quickBody: $("lircQuickBody"),
    quickNote: $("lircQuickNote"),
    nextMeetingRow: $("lircNextMeetingRow"),
    nextMeeting: $("lircNextMeeting"),
    pendingWarn: $("lircPendingWarn"),
    ctaGrid: $("lircCtaGrid"),
    resetBtn: $("lircResetBtn"),
    copyBtn: $("lircCopyLinkBtn"),
  };

  // ---------- utils ----------
  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }
  function round3(v) {
    return Math.round(v * 1000) / 1000;
  }
  function toNumber(v) {
    const n = Number(String(v ?? "").replace(/,/g, "").trim());
    return String(v ?? "").trim() === "" || !Number.isFinite(n) ? null : n;
  }
  function roundWon(n) {
    const r = Math.round(n);
    return r === 0 ? 0 : r;
  }
  function fmtWon(n) {
    return `${roundWon(n).toLocaleString("ko-KR")}원`;
  }
  function fmtSignedWon(n) {
    const r = roundWon(n);
    if (r === 0) return "0원";
    return `${r > 0 ? "+" : MINUS}${Math.abs(r).toLocaleString("ko-KR")}원`;
  }
  function fmtKoreanWon(n) {
    const abs = Math.abs(roundWon(n));
    if (abs < 10000) return `${abs.toLocaleString("ko-KR")}원`;
    if (abs < 1000000) {
      const man = Math.floor(abs / 10000);
      const rest = abs % 10000;
      return rest ? `${man}만 ${rest.toLocaleString("ko-KR")}원` : `${man}만원`;
    }
    const manTotal = Math.round(abs / 10000);
    if (manTotal < 10000) return `약 ${manTotal.toLocaleString("ko-KR")}만원`;
    const eok = Math.floor(manTotal / 10000);
    const man = manTotal % 10000;
    return man ? `약 ${eok}억 ${man.toLocaleString("ko-KR")}만원` : `약 ${eok}억원`;
  }
  function fmtRate(r) {
    return `${r.toFixed(2)}%`;
  }
  function fmtDelta(d) {
    const r = round3(d);
    if (r === 0) return "0.00%p";
    return `${r > 0 ? "+" : MINUS}${Math.abs(r).toFixed(2)}%p`;
  }
  function fmtPeriod(months) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y === 0) return `${m}개월`;
    return m === 0 ? `${y}년` : `${y}년 ${m}개월`;
  }
  function signOf(n) {
    const r = roundWon(n);
    return r > 0 ? "up" : r < 0 ? "down" : "zero";
  }
  function setText(el, text) {
    if (el) el.textContent = text;
  }
  function todayIso() {
    const d = new Date();
    const pad = (x) => String(x).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function fmtDateKo(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const day = ["일", "월", "화", "수", "목", "금", "토"][new Date(y, m - 1, d).getDay()];
    return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}(${day})`;
  }
  function repayLabel(id) {
    const option = repayOptions.find((item) => item.id === id);
    return option ? option.label : id;
  }

  // ---------- calc ----------
  function annuity(P, R, n) {
    const i = R / 12;
    const M = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const m12 = Math.min(12, n);
    let bal = P;
    let firstYearInterest = 0;
    for (let k = 0; k < m12; k += 1) {
      const interest = bal * i;
      firstYearInterest += interest;
      bal -= M - interest;
    }
    return { monthlyPayment: M, lastPayment: M, totalInterest: M * n - P, firstYearInterest };
  }

  function equalPrincipal(P, R, n) {
    const i = R / 12;
    const C = P / n;
    const m12 = Math.min(12, n);
    return {
      monthlyPayment: C + P * i,
      lastPayment: C + C * i,
      totalInterest: (i * P * (n + 1)) / 2,
      firstYearInterest: i * (m12 * P - (C * m12 * (m12 - 1)) / 2),
    };
  }

  function bullet(P, R, n) {
    const i = R / 12;
    return {
      monthlyPayment: P * i,
      lastPayment: P * i + P,
      totalInterest: P * i * n,
      firstYearInterest: P * i * Math.min(12, n),
    };
  }

  function calcSchedule(P, R, n, repay) {
    if (repay === "bullet") return bullet(P, R, n);
    if (repay === "equalPrincipal") return equalPrincipal(P, R, n);
    return annuity(P, R, n);
  }

  function normalize() {
    const P = clamp(state.balance, limits.balance.min, limits.balance.max);
    const n = clamp(Math.round(state.months), limits.months.min, limits.months.max);
    const rateNowApplied = round3(clamp(state.rateNow, limits.rate.min, limits.rate.max));
    const rateNewRaw = round3(state.rateMode === "target" ? state.rateNew : rateNowApplied + state.rateDelta);
    const rateNewApplied = round3(clamp(rateNewRaw, limits.rate.min, limits.rate.max));
    return {
      P,
      n,
      repay: state.repay,
      rateNowApplied,
      rateNewApplied,
      clampedToZero: rateNewRaw < 0,
      clampedToMax: rateNewRaw > limits.rate.max,
      delta: round3(rateNewApplied - rateNowApplied),
    };
  }

  function computeResult(input) {
    const now = calcSchedule(input.P, input.rateNowApplied / 100, input.n, input.repay);
    const next = calcSchedule(input.P, input.rateNewApplied / 100, input.n, input.repay);
    return {
      ...input,
      now,
      next,
      monthlyDiff: next.monthlyPayment - now.monthlyPayment,
      totalInterestDiff: next.totalInterest - now.totalInterest,
      annualDiff: next.firstYearInterest - now.firstYearInterest,
    };
  }

  function computeQuickRows(result) {
    return quickDeltas.map((d) => {
      const rateRaw = round3(result.rateNowApplied + d);
      const rate = round3(clamp(rateRaw, limits.rate.min, limits.rate.max));
      const r = calcSchedule(result.P, rate / 100, result.n, result.repay);
      return {
        delta: d,
        rate,
        monthlyPayment: r.monthlyPayment,
        monthlyDiff: r.monthlyPayment - result.now.monthlyPayment,
        totalInterestDiff: r.totalInterest - result.now.totalInterest,
        clampedToZero: rateRaw < 0,
        clampedToMax: rateRaw > limits.rate.max,
        isCurrent: Math.abs(d - result.delta) < 0.0005,
      };
    });
  }

  // ---------- render ----------
  function monthlyLabel(repay) {
    if (repay === "equalPrincipal") return "월 상환액(첫 달)";
    if (repay === "bullet") return "월 이자";
    return "월 상환액";
  }

  function renderRatePreview(input) {
    let text = `${fmtRate(input.rateNowApplied)} → ${fmtRate(input.rateNewApplied)} (${fmtDelta(input.delta)})`;
    if (input.clampedToZero) text += " · 0% 하한 적용";
    if (input.clampedToMax) text += " · 20% 상한 적용";
    setText(els.ratePreview, text);
  }

  function renderKpis(result) {
    setText(els.monthlyDiff, fmtSignedWon(result.monthlyDiff));
    setText(els.monthlyDiffSub, `${monthlyLabel(result.repay)} ${fmtWon(result.now.monthlyPayment)} → ${fmtWon(result.next.monthlyPayment)}`);
    if (els.kpiMonthly) els.kpiMonthly.dataset.sign = signOf(result.monthlyDiff);

    setText(els.nextMonthly, fmtWon(result.next.monthlyPayment));
    let sub = `${fmtRate(result.rateNewApplied)} · ${repayLabel(result.repay)}`;
    if (result.repay === "equalPrincipal") sub = `첫 달 기준 · 마지막 달 ${fmtWon(result.next.lastPayment)}`;
    if (result.repay === "bullet") sub = `월 이자 · 만기 원금 ${fmtWon(result.P)} 별도`;
    setText(els.nextMonthlySub, sub);

    setText(els.totalDiff, fmtSignedWon(result.totalInterestDiff));
    setText(els.totalDiffSub, `${fmtWon(result.now.totalInterest)} → ${fmtWon(result.next.totalInterest)}`);
    if (els.kpiTotal) els.kpiTotal.dataset.sign = signOf(result.totalInterestDiff);

    setText(els.annualDiff, fmtSignedWon(result.annualDiff));
    if (els.kpiAnnual) els.kpiAnnual.dataset.sign = signOf(result.annualDiff);
  }

  function renderDetailTable(result) {
    if (!els.detailBody) return;
    const rows = [
      ["적용 금리", fmtRate(result.rateNowApplied), fmtRate(result.rateNewApplied), fmtDelta(result.delta)],
      [
        monthlyLabel(result.repay),
        fmtWon(result.now.monthlyPayment),
        fmtWon(result.next.monthlyPayment),
        fmtSignedWon(result.monthlyDiff),
      ],
    ];
    if (result.repay !== "annuity") {
      rows.push([
        result.repay === "bullet" ? "만기 달 납부액(이자+원금)" : "마지막 달 상환액",
        fmtWon(result.now.lastPayment),
        fmtWon(result.next.lastPayment),
        fmtSignedWon(result.next.lastPayment - result.now.lastPayment),
      ]);
    }
    rows.push([
      "남은 기간 총이자",
      fmtWon(result.now.totalInterest),
      fmtWon(result.next.totalInterest),
      fmtSignedWon(result.totalInterestDiff),
    ]);
    rows.push([
      "총 상환액(원금+이자)",
      fmtWon(result.P + result.now.totalInterest),
      fmtWon(result.P + result.next.totalInterest),
      fmtSignedWon(result.totalInterestDiff),
    ]);
    els.detailBody.innerHTML = rows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
      .join("");
  }

  function renderQuickTable(result) {
    if (!els.quickBody) return;
    const rows = computeQuickRows(result);
    els.quickBody.innerHTML = rows
      .map(
        (row) => `<tr class="${row.isCurrent ? "is-current" : ""}" data-quick-delta="${row.delta}" tabindex="0">
          <td>${fmtDelta(row.delta)}</td>
          <td>${fmtRate(row.rate)}${row.clampedToZero || row.clampedToMax ? "*" : ""}</td>
          <td class="lirc-col-hide-sm">${fmtWon(row.monthlyPayment)}</td>
          <td data-sign="${signOf(row.monthlyDiff)}">${fmtSignedWon(row.monthlyDiff)}</td>
          <td data-sign="${signOf(row.totalInterestDiff)}">${fmtSignedWon(row.totalInterestDiff)}</td>
        </tr>`
      )
      .join("");
    const clampNote = (rows.some((row) => row.clampedToZero) ? " · * 0% 하한 적용" : "") + (rows.some((row) => row.clampedToMax) ? " · * 20% 상한 적용 (요청 변동폭과 실제 변동폭이 다를 수 있음)" : "");
    if (els.quickNote) {
      els.quickNote.innerHTML = `현재 금리 ${fmtRate(result.rateNowApplied)} 기준 · ${repayLabel(result.repay)} · 남은 ${fmtPeriod(result.n)}${clampNote} <span class="lirc-badge" data-badge="시뮬레이션">시뮬레이션</span>`;
    }
  }

  function renderMessage(result) {
    const base = `대출잔액 ${fmtKoreanWon(result.P).replace(/^약 /, "")}·남은 ${fmtPeriod(result.n)}·${repayLabel(result.repay)} 기준으로`;
    const tail = " 실제 변경 시점과 폭은 대출 약정의 기준지표·변동주기·가산금리에 따라 달라집니다.";
    let text;
    const sign = signOf(result.monthlyDiff);
    if (sign === "zero" && signOf(result.totalInterestDiff) === "zero") {
      text = "금리 변화가 없어 월 상환액과 총이자 변화가 없습니다.";
    } else {
      const up = result.delta > 0;
      const move = `금리가 연 ${fmtRate(result.rateNowApplied)}에서 ${fmtRate(result.rateNewApplied)}로 ${Math.abs(result.delta).toFixed(2)}%p ${up ? "올라가면" : "내려가면"}`;
      const monthlyWord = result.repay === "bullet" ? "월 이자는" : result.repay === "equalPrincipal" ? "첫 달 상환액은" : "월 상환액은";
      text = `${base} ${move}, ${monthlyWord} ${fmtKoreanWon(result.monthlyDiff)} ${up ? "늘고" : "줄고"} 남은 기간 총이자는 ${fmtKoreanWon(result.totalInterestDiff)} ${up ? "늘어나는" : "줄어드는"} 것으로 계산됩니다.`;
      if (up) text += " 부담이 크다면 대출 갈아타기나 일부 중도상환을 함께 비교해 보세요.";
    }
    if (els.message) {
      els.message.innerHTML = `${text}${tail} <span class="lirc-badge" data-badge="추정">추정</span>`;
    }
  }

  function renderBaseRateCard() {
    const meetings = Array.isArray(baseRate.meetings) ? baseRate.meetings : [];
    const today = todayIso();
    const next = meetings.find((d) => d >= today);
    if (els.nextMeetingRow && els.nextMeeting) {
      els.nextMeetingRow.hidden = false;
      if (!next) {
        els.nextMeeting.textContent = "다음 일정 발표 전 (한국은행 홈페이지 확인)";
      } else if (next === today) {
        els.nextMeeting.textContent = `오늘 ${fmtDateKo(next)} 결정회의 (오전 발표)`;
      } else {
        els.nextMeeting.textContent = fmtDateKo(next);
      }
    }
    const pending = meetings.filter((d) => d > (baseRate.lastReviewedMeeting || "") && d < today);
    if (els.pendingWarn && pending.length > 0) {
      const latest = pending[pending.length - 1];
      const [, m, d] = latest.split("-").map(Number);
      els.pendingWarn.textContent = `${m}월 ${d}일 결정회의 결과가 아직 이 페이지에 반영되지 않았을 수 있습니다. 최신 기준금리는 한국은행에서 확인하세요.`;
      els.pendingWarn.hidden = false;
    }
  }

  function renderCtaOrder(result) {
    if (!els.ctaGrid) return;
    const refinance = els.ctaGrid.querySelector('[data-cta="refinance"]');
    const prepay = els.ctaGrid.querySelector('[data-cta="prepay"]');
    if (!refinance || !prepay) return;
    const first = result.monthlyDiff > 0.5 ? refinance : prepay;
    const second = first === refinance ? prepay : refinance;
    els.ctaGrid.append(first, second);
    first.classList.add("is-primary");
    second.classList.remove("is-primary");
  }

  function renderInvalid(message) {
    if (els.invalid) {
      els.invalid.textContent = message;
      els.invalid.hidden = false;
    }
    [els.monthlyDiff, els.nextMonthly, els.totalDiff, els.annualDiff].forEach((el) => setText(el, "-"));
    [els.monthlyDiffSub, els.nextMonthlySub, els.totalDiffSub].forEach((el) => setText(el, "-"));
    [els.kpiMonthly, els.kpiTotal, els.kpiAnnual].forEach((el) => {
      if (el) el.dataset.sign = "zero";
    });
    setText(els.message, "값을 입력하면 결과 해석이 표시됩니다.");
    if (els.detailBody) els.detailBody.innerHTML = "";
    if (els.quickBody) els.quickBody.innerHTML = "";
  }

  function render() {
    if (toNumber(els.rateNow?.value) === null || (state.rateMode === "target" && toNumber(els.rateNew?.value) === null) || (state.rateMode === "delta" && toNumber(els.rateDelta?.value) === null)) {
      renderInvalid("현재 금리와 변경 후 금리 또는 변동폭을 입력하세요. 0%는 0으로 입력하세요.");
      return;
    }
    const rawRateNow = state.rateNow;
    setText(
      els.rateNowNote,
      rawRateNow < limits.rate.min || rawRateNow > limits.rate.max
        ? "0~20% 범위로 조정해 계산했어요"
        : "은행 앱·약정서의 현재 연 금리"
    );
    setText(els.periodNote, state.months > limits.months.max ? "최대 50년(600개월)으로 계산했어요" : "최대 50년(600개월)");

    if (!(state.balance > 0)) {
      renderInvalid("대출잔액을 입력하세요.");
      syncUrl();
      return;
    }
    if (!Number.isSafeInteger(state.balance) || state.balance < limits.balance.min || state.balance > limits.balance.max) {
      renderInvalid("대출잔액은 10,000~5,000,000,000원 범위의 정수로 입력하세요.");
      return;
    }
    if (!(state.months >= 1)) {
      renderInvalid("남은 기간을 1개월 이상 입력하세요.");
      syncUrl();
      return;
    }
    if (els.invalid) els.invalid.hidden = true;

    const input = normalize();
    const result = computeResult(input);
    renderRatePreview(input);
    renderKpis(result);
    renderDetailTable(result);
    renderQuickTable(result);
    renderMessage(result);
    renderCtaOrder(result);
    syncUrl();
  }

  // ---------- input ----------
  function readInputs() {
    const balance = toNumber(els.balance?.value);
    state.balance = balance === null ? 0 : balance;
    const years = toNumber(els.years?.value) ?? 0;
    const extra = toNumber(els.extraMonths?.value) ?? 0;
    state.months = Math.max(0, Math.round(years)) * 12 + Math.max(0, Math.round(extra));
    const rateNow = toNumber(els.rateNow?.value);
    state.rateNow = rateNow === null ? 0 : rateNow;
    if (state.rateMode === "target") {
      const rateNew = toNumber(els.rateNew?.value);
      state.rateNew = rateNew === null ? state.rateNow : rateNew;
      state.rateDelta = round3(state.rateNew - state.rateNow);
    } else {
      const delta = toNumber(els.rateDelta?.value);
      state.rateDelta = clamp(delta === null ? 0 : delta, limits.delta.min, limits.delta.max);
      state.rateNew = round3(state.rateNow + state.rateDelta);
    }
  }

  function writeInputs() {
    if (els.balance && document.activeElement !== els.balance) {
      els.balance.value = state.balance > 0 ? Math.round(state.balance).toLocaleString("ko-KR") : "";
    }
    if (els.years) els.years.value = String(Math.floor(state.months / 12));
    if (els.extraMonths) els.extraMonths.value = String(state.months % 12);
    if (els.rateNow) els.rateNow.value = Number(state.rateNow).toFixed(2);
    if (els.rateDelta) els.rateDelta.value = String(round3(state.rateDelta));
    if (els.rateNew) els.rateNew.value = Number(state.rateNew).toFixed(2);
    syncToggles();
  }

  function syncToggles() {
    document.querySelectorAll("[data-repay]").forEach((btn) => {
      const active = btn.dataset.repay === state.repay;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const repayOption = repayOptions.find((item) => item.id === state.repay);
    if (repayOption) setText(els.repayNote, repayOption.note);

    document.querySelectorAll("[data-rate-mode]").forEach((btn) => {
      const active = btn.dataset.rateMode === state.rateMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll("[data-mode-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.modePanel !== state.rateMode;
    });
    document.querySelectorAll("[data-delta]").forEach((chip) => {
      const active = state.rateMode === "delta" && Math.abs(Number(chip.dataset.delta) - state.rateDelta) < 0.0005;
      chip.classList.toggle("is-active", active);
    });
  }

  function setRateMode(mode) {
    if (!RATE_MODES.includes(mode) || mode === state.rateMode) return;
    readInputs();
    state.rateMode = mode;
    writeInputs();
    render();
  }

  function setRepay(repay) {
    if (!REPAY_TYPES.includes(repay)) return;
    state.repay = repay;
    syncToggles();
    render();
  }

  function applyDelta(d) {
    readInputs();
    state.rateMode = "delta";
    state.rateDelta = d;
    state.rateNew = round3(state.rateNow + d);
    writeInputs();
    render();
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    readInputs();
    Object.assign(state, preset.input);
    if (state.rateMode === "target") {
      state.rateNew = round3(Math.max(0, state.rateNow + state.rateDelta));
    } else {
      state.rateNew = round3(state.rateNow + state.rateDelta);
    }
    writeInputs();
    render();
  }

  function resetAll() {
    Object.assign(state, defaults);
    writeInputs();
    render();
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (state.balance !== defaults.balance) params.set("b", String(Math.round(state.balance)));
    if (state.rateNow !== defaults.rateNow) params.set("r0", String(round3(state.rateNow)));
    if (state.months !== defaults.months) params.set("m", String(state.months));
    if (state.repay !== defaults.repay) params.set("repay", state.repay);
    if (state.rateMode === "target") {
      params.set("mode", "target");
      params.set("r1", String(round3(state.rateNew)));
    } else if (round3(state.rateDelta) !== defaults.rateDelta) {
      params.set("d", String(round3(state.rateDelta)));
    }
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const num = (key) => (params.has(key) ? toNumber(params.get(key)) : null);
    const b = num("b");
    if (b !== null && b > 0) state.balance = clamp(b, limits.balance.min, limits.balance.max);
    const r0 = num("r0");
    if (r0 !== null) state.rateNow = clamp(r0, limits.rate.min, limits.rate.max);
    const m = num("m");
    if (m !== null && m >= 1) state.months = clamp(Math.round(m), limits.months.min, limits.months.max);
    if (REPAY_TYPES.includes(params.get("repay"))) state.repay = params.get("repay");
    if (RATE_MODES.includes(params.get("mode"))) state.rateMode = params.get("mode");
    const d = num("d");
    const r1 = num("r1");
    if (state.rateMode === "target") {
      state.rateNew = r1 !== null ? clamp(r1, limits.rate.min, limits.rate.max) : round3(state.rateNow + state.rateDelta);
      state.rateDelta = round3(state.rateNew - state.rateNow);
    } else {
      if (d !== null) state.rateDelta = clamp(d, limits.delta.min, limits.delta.max);
      state.rateNew = round3(state.rateNow + state.rateDelta);
    }
  }

  function onInput() {
    readInputs();
    syncToggles();
    render();
  }

  // ---------- bind ----------
  if (els.balance) {
    els.balance.addEventListener("focus", () => {
      const n = toNumber(els.balance.value);
      els.balance.value = n === null ? "" : String(n);
    });
    els.balance.addEventListener("blur", () => {
      const n = toNumber(els.balance.value);
      els.balance.value = n === null || n <= 0 ? "" : Math.round(n).toLocaleString("ko-KR");
    });
  }
  [els.balance, els.years, els.extraMonths, els.rateNow, els.rateDelta, els.rateNew].forEach((input) => {
    if (input) input.addEventListener("input", onInput);
  });
  document.querySelectorAll("[data-repay]").forEach((btn) => {
    btn.addEventListener("click", () => setRepay(btn.dataset.repay));
  });
  document.querySelectorAll("[data-rate-mode]").forEach((btn) => {
    btn.addEventListener("click", () => setRateMode(btn.dataset.rateMode));
  });
  document.querySelectorAll("[data-delta]").forEach((chip) => {
    chip.addEventListener("click", () => applyDelta(Number(chip.dataset.delta)));
  });
  document.querySelectorAll("[data-preset-id]").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.presetId));
  });
  if (els.quickBody) {
    const pick = (event) => {
      const row = event.target.closest("[data-quick-delta]");
      if (row) applyDelta(Number(row.dataset.quickDelta));
    };
    els.quickBody.addEventListener("click", pick);
    els.quickBody.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pick(event);
      }
    });
  }
  if (els.resetBtn) els.resetBtn.addEventListener("click", resetAll);
  if (els.copyBtn) {
    els.copyBtn.addEventListener("click", () => {
      syncUrl();
      navigator.clipboard?.writeText(window.location.href).then(() => {
        const original = els.copyBtn.textContent;
        els.copyBtn.textContent = "링크를 복사했어요";
        setTimeout(() => {
          els.copyBtn.textContent = original;
        }, 1400);
      });
    });
  }

  loadFromUrl();
  writeInputs();
  renderBaseRateCard();
  render();
})();
