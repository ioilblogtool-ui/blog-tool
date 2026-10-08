/**
 * birth-support-money-core.js — 2027 출산지원금 계산기 순수 계산 모듈
 * DOM·window 접근 금지. 브라우저와 scripts/check-birth-support-money.mjs가 함께 사용한다.
 */

export const BADGES = ["공식", "참고", "시뮬레이션", "추정"];
export const ORDERS = [1, 2, 3];
export const TIERS = ["capital", "nonCapital", "depopPreferred", "depopSpecial"];
export const PREFERRED = ["no", "yes", "unknown"];
export const CARE_MODES = ["home", "daycare", "switch12"];
export const PERIODS = [12, 24, 156];

export const DEFAULT_STATE = Object.freeze({
  birthDate: null,
  order: 1,
  tier: "capital",
  preferred: "no",
  care: "home",
  period: 24,
  local: "none",
});

function assertCell(cell, sources, path) {
  if (!cell || !Number.isSafeInteger(cell.amount) || cell.amount < 0) throw new Error(`금액 형식 오류: ${path}`);
  if (!BADGES.includes(cell.badge)) throw new Error(`배지 오류: ${path}`);
  if (!sources[cell.sourceId]) throw new Error(`출처 누락: ${path}`);
}

export function validateConfig(config) {
  if (config?.schemaVersion !== 2) throw new Error("기준 데이터 형식 오류");
  const { sources, current, reform2027 } = config;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.reformCutoff)) throw new Error("기준일 형식 오류");
  for (const order of ORDERS) {
    assertCell(current.firstMeeting[order], sources, `current.firstMeeting.${order}`);
    assertCell(reform2027.welcomeGrant[order], sources, `reform2027.welcomeGrant.${order}`);
  }
  for (const key of ["age0", "age1"]) {
    assertCell(current.parentBenefit[key], sources, `current.parentBenefit.${key}`);
    assertCell(current.daycareFee[key], sources, `current.daycareFee.${key}`);
  }
  for (const tier of TIERS) assertCell(current.childAllowance[tier], sources, `current.childAllowance.${tier}`);
  for (const key of ["welcomeGrantPreferredAddon", "childBasicAllowance", "childBasicAllowancePreferredAddon", "homeCareAddon"]) {
    assertCell(reform2027[key], sources, `reform2027.${key}`);
  }
  if (reform2027.welcomeGrantInstallments.months.length < 1) throw new Error("분할 지급 설정 오류");
  return true;
}

function isValidCalendarDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1) return false;
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d <= daysInMonth;
}

export function parseBirthDate(raw, range) {
  const value = String(raw ?? "").trim();
  if (!value) return { status: "empty", value: null };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !isValidCalendarDate(value)) return { status: "invalid", value: null };
  if (value < range.min || value > range.max) return { status: "outOfRange", value: null };
  return { status: "valid", value };
}

export function resolveSystem(isoDate, cutoff) {
  return isoDate >= cutoff ? "reform2027" : "current";
}

export function isHomeCareMonth(care, month) {
  if (care === "home") return true;
  if (care === "switch12") return month < 12;
  return false;
}

export function buildCurrentRows(config, state, months) {
  const c = config.current;
  const rows = [];
  for (let month = 0; month < months; month += 1) {
    const estimatedCells = [];
    const firstMeeting = month === 0 ? c.firstMeeting[state.order].amount : 0;
    const pbFull = month < 12 ? c.parentBenefit.age0.amount : month < 24 ? c.parentBenefit.age1.amount : 0;
    let parentBenefit = pbFull;
    if (pbFull > 0 && !isHomeCareMonth(state.care, month)) {
      const fee = month < 12 ? c.daycareFee.age0.amount : c.daycareFee.age1.amount;
      parentBenefit = Math.max(0, pbFull - fee);
      estimatedCells.push("parentBenefit");
    }
    const childAllowance = c.childAllowance[state.tier].amount;
    const items = { firstMeeting, parentBenefit, childAllowance };
    rows.push({ month, items, total: firstMeeting + parentBenefit + childAllowance, estimatedCells });
  }
  return rows;
}

export function welcomeGrantTotal(config, order, preferred) {
  const r = config.reform2027;
  return r.welcomeGrant[order].amount + (preferred ? r.welcomeGrantPreferredAddon.amount : 0);
}

export function buildReformRows(config, state, months, preferred) {
  const r = config.reform2027;
  const grantTotal = welcomeGrantTotal(config, state.order, preferred);
  const schedule = r.welcomeGrantInstallments.months;
  const share = Math.floor(grantTotal / schedule.length);
  const remainder = grantTotal - share * schedule.length;
  const basic = r.childBasicAllowance.amount;
  const basicAddon = preferred ? r.childBasicAllowancePreferredAddon.amount : 0;
  const rows = [];
  for (let month = 0; month < months; month += 1) {
    const estimatedCells = [];
    const idx = schedule.indexOf(month);
    let welcomeGrant = 0;
    if (idx >= 0) {
      welcomeGrant = share + (idx === schedule.length - 1 ? remainder : 0);
      estimatedCells.push("welcomeGrant");
    }
    const homeCare = month <= r.homeCareAddon.untilMonth && isHomeCareMonth(state.care, month) ? r.homeCareAddon.amount : 0;
    if (homeCare > 0 && state.care === "switch12") estimatedCells.push("homeCare");
    const items = { welcomeGrant, childBasicAllowance: basic + basicAddon, homeCare };
    rows.push({ month, items, total: welcomeGrant + basic + basicAddon + homeCare, estimatedCells });
  }
  return rows;
}

export function sumRange(rows, from, to) {
  return rows.slice(from, to).reduce((sum, row) => sum + row.total, 0);
}

function sumItems(rows, to) {
  const byItem = {};
  rows.slice(0, to).forEach((row) => {
    Object.entries(row.items).forEach(([key, value]) => {
      byItem[key] = (byItem[key] || 0) + value;
    });
  });
  return byItem;
}

/**
 * 배지 결정 규칙(설계서 5-5). 첫 해당 규칙을 반환한다.
 * kind: 'total' | 'longTerm' | 'diff' | 'grand'
 */
export function resolveTotalBadge({ kind = "total", system, birthDate, care }) {
  if (kind === "longTerm" || kind === "diff" || kind === "grand") return "추정";
  if (system === "current" && birthDate >= "2027-01-01") return "추정";
  if (system === "current" && care !== "home") return "추정";
  if (system === "reform2027" && care === "switch12") return "추정";
  return "시뮬레이션";
}

function monthlyAmount(row, system) {
  if (!row) return 0;
  return system === "current" ? row.items.parentBenefit + row.items.childAllowance : row.items.childBasicAllowance + row.items.homeCare;
}

function summarize(config, system, rows, state, preferred) {
  const period = state.period;
  const birthSupport = system === "current"
    ? config.current.firstMeeting[state.order].amount
    : welcomeGrantTotal(config, state.order, preferred);
  return {
    system,
    preferred,
    rows: rows.slice(0, period),
    birthSupport,
    monthly: { m0to11: monthlyAmount(rows[0], system), m12to23: monthlyAmount(rows[12], system) },
    total12: sumRange(rows, 0, 12),
    total24: sumRange(rows, 0, 24),
    totalPeriod: sumRange(rows, 0, period),
    byItemPeriod: sumItems(rows, period),
    byItem24: sumItems(rows, 24),
    badge: resolveTotalBadge({ kind: period === config.longTermMonths ? "longTerm" : "total", system, birthDate: state.birthDate, care: state.care }),
    badge24: resolveTotalBadge({ kind: "total", system, birthDate: state.birthDate, care: state.care }),
  };
}

function rowsFor(config, system, state, months, preferred) {
  return system === "current"
    ? buildCurrentRows(config, state, months)
    : buildReformRows(config, state, months, preferred);
}

export function calculate(config, state) {
  const system = resolveSystem(state.birthDate, config.reformCutoff);
  const months = Math.max(state.period, 24);
  const preferred = state.preferred === "yes";
  const base = summarize(config, system, rowsFor(config, system, state, months, preferred), state, preferred);
  if (system === "reform2027") {
    const other = !preferred;
    base.preferredVariant = summarize(config, system, rowsFor(config, system, state, months, other), state, other);
  }
  return base;
}

/** 같은 조건에서 출생일만 반대 체계 대표일로 바꿔 24개월 계산 */
export function calculateOpposite(config, state) {
  const system = resolveSystem(state.birthDate, config.reformCutoff);
  const birthDate = system === "current" ? config.reformCutoff : "2027-06-30";
  const oppositeState = {
    ...state,
    birthDate,
    period: 24,
    preferred: state.preferred === "unknown" ? "no" : state.preferred,
  };
  return calculate(config, oppositeState);
}

export function calculateLongTerm(config, state) {
  return calculate(config, { ...state, period: config.longTermMonths });
}

/* ── URL 상태 ────────────────────────────────────────────────── */

function pick(value, allowed, fallback, notices) {
  if (value === null || value === undefined || value === "") return fallback;
  const match = allowed.find((item) => String(item) === String(value));
  if (match === undefined) {
    notices.add("invalid");
    return fallback;
  }
  return match;
}

/**
 * @param {URLSearchParams} params
 * @param {{ birthDateRange: {min:string,max:string} }} config
 * @param {string[]} localCodes
 */
export function parseUrlState(params, config, localCodes = []) {
  const notices = new Set();
  const get = (key) => params.get(key);
  const state = { ...DEFAULT_STATE };

  const rawDate = get("bd") ?? get("birthDate");
  if (rawDate) {
    const parsed = parseBirthDate(rawDate, config.birthDateRange);
    if (parsed.status === "valid") state.birthDate = parsed.value;
    else notices.add("invalidDate");
  }

  state.order = pick(get("order") === null ? null : Number(get("order")), ORDERS, 1, notices);
  state.tier = pick(get("tier"), TIERS, "capital", notices);
  state.preferred = pick(get("pref"), PREFERRED, "no", notices);

  const care = get("care") ?? get("childcare");
  state.care = pick(care, CARE_MODES, "home", notices);

  let period = get("period");
  if (period === null && get("months") !== null) {
    period = get("months");
    if (period === "95") {
      notices.add("legacyMonths");
      period = "24";
    }
  }
  state.period = pick(period === null ? null : Number(period), PERIODS, 24, notices);

  const local = get("local") ?? get("region");
  if (local !== null) {
    if (local === "none" || localCodes.includes(local)) state.local = local;
    else if (get("local") !== null) notices.add("invalid");
  }

  return { state, notices: [...notices] };
}

export function serializeState(state) {
  const out = {
    v: "2",
    order: String(state.order),
    tier: state.tier,
    pref: state.preferred,
    care: state.care,
    period: String(state.period),
    local: state.local,
  };
  if (state.birthDate) out.bd = state.birthDate;
  return out;
}

export const LEGACY_KEYS = ["birthDate", "region", "multiple", "childcare", "months"];
