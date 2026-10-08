/**
 * birth-support-money.js — 2027 출산지원금 계산기 화면 스크립트 (ES 모듈)
 * 계산은 birth-support-money-core.js, 이 파일은 입력·렌더·차트·URL 동기화만 담당한다.
 */
import { formatKRW, buildDefaultOptions } from "./chart-config.js";
import {
  DEFAULT_STATE,
  LEGACY_KEYS,
  calculate,
  calculateLongTerm,
  calculateOpposite,
  parseBirthDate,
  parseUrlState,
  resolveTotalBadge,
  serializeState,
  validateConfig,
} from "./birth-support-money-core.js";

const $ = (id) => document.getElementById(id);
const numberFormatter = new Intl.NumberFormat("ko-KR");

function parsePayload() {
  try {
    return JSON.parse($("birthSupportMoneyConfig")?.textContent || "{}");
  } catch {
    return {};
  }
}

const payload = parsePayload();
const config = payload.config;
const localRules = payload.localRules || [];
let configError = false;
try {
  validateConfig(config);
} catch {
  configError = true;
}

const BADGE_CLASS = {
  공식: "bsm-badge--official",
  참고: "bsm-badge--reference",
  시뮬레이션: "bsm-badge--simulation",
  추정: "bsm-badge--estimate",
};
const ORDER_LABEL = { 1: "첫째", 2: "둘째", 3: "셋째 이상" };
const TIER_LABEL = { capital: "수도권", nonCapital: "비수도권", depopPreferred: "인구감소지역(우대)", depopSpecial: "인구감소지역(특별)" };
const CARE_LABEL = { home: "가정보육", daycare: "어린이집 이용", switch12: "12개월부터 어린이집" };
const ITEM_LABEL = {
  firstMeeting: "첫만남이용권",
  parentBenefit: "부모급여",
  childAllowance: "아동수당",
  welcomeGrant: "아이맞이지원금",
  childBasicAllowance: "아동기본수당",
  homeCare: "가정보육 추가",
};
const ITEM_COLOR = {
  firstMeeting: "rgba(176, 115, 31, 0.82)",
  parentBenefit: "rgba(18, 123, 98, 0.82)",
  childAllowance: "rgba(55, 117, 190, 0.74)",
  welcomeGrant: "rgba(176, 115, 31, 0.82)",
  childBasicAllowance: "rgba(55, 117, 190, 0.74)",
  homeCare: "rgba(135, 88, 190, 0.70)",
};

/* ── 포맷 ───────────────────────────────────────────── */

function formatWon(value) {
  return `${numberFormatter.format(Math.round(Number(value || 0)))}원`;
}

function formatMan(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = (amount % 100000000) / 10000;
  const manText = Number.isInteger(man) ? numberFormatter.format(man) : man.toLocaleString("ko-KR", { maximumFractionDigits: 1 });
  if (eok > 0 && man > 0) return `${eok}억 ${manText}만원`;
  if (eok > 0) return `${eok}억원`;
  if (amount === 0) return "0원";
  return `${manText}만원`;
}

function formatDelta(value) {
  if (value === 0) return "차이 없음";
  return `${value > 0 ? "+" : "−"}${formatMan(Math.abs(value))}`;
}

function formatDateKo(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/* ── DOM 헬퍼 ───────────────────────────────────────── */

function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach((child) => child && node.appendChild(child));
  return node;
}

function badge(label) {
  return el("span", { className: `bsm-badge bsm-badge--small ${BADGE_CLASS[label] || ""}`, text: label });
}

function setText(id, text) {
  const node = $(id);
  if (node) node.textContent = text;
}

function setBadge(id, label) {
  const node = $(id);
  if (!node) return;
  node.textContent = label;
  node.className = `bsm-badge bsm-badge--small ${BADGE_CLASS[label] || ""}`;
}

function show(id, visible) {
  const node = $(id);
  if (node) node.hidden = !visible;
}

/* ── 입력 ──────────────────────────────────────────── */

const INPUT_IDS = {
  order: "bsm-birth-order",
  tier: "bsm-region-tier",
  preferred: "bsm-preferred",
  care: "bsm-care-mode",
  period: "bsm-period",
  local: "bsm-local-region",
};

function readForm() {
  const parsed = parseBirthDate($("bsm-birth-date")?.value, config.birthDateRange);
  return {
    parsed,
    state: {
      birthDate: parsed.value,
      order: Number($(INPUT_IDS.order).value),
      tier: $(INPUT_IDS.tier).value,
      preferred: $(INPUT_IDS.preferred).value,
      care: $(INPUT_IDS.care).value,
      period: Number($(INPUT_IDS.period).value),
      local: $(INPUT_IDS.local).value,
    },
  };
}

function writeForm(state) {
  $("bsm-birth-date").value = state.birthDate || "";
  Object.entries(INPUT_IDS).forEach(([key, id]) => {
    $(id).value = String(state[key]);
  });
}

/* ── 렌더 ──────────────────────────────────────────── */

function renderBanner(result, state) {
  const banner = $("bsm-system-banner");
  banner.hidden = false;
  banner.dataset.system = result.system;
  banner.className = `bsm-system-banner bsm-system-banner--${result.system === "current" ? "current" : "reform"}`;
  if (result.system === "current") {
    setText("bsm-system-label", `${formatDateKo(state.birthDate)} 출생 · 현행 제도`);
    setText("bsm-system-title", "현행 첫만남이용권·부모급여·아동수당 체계");
    setText("bsm-system-desc", state.birthDate < "2027-01-01"
      ? "현재 시행 중인 제도 기준입니다. 2027년 이후 지급분도 현행 기준이 유지된다고 가정했습니다."
      : "2027년 6월 30일 이전 출생아는 현행 제도가 유지될 예정입니다. 경과규정 확정 전이라 합계는 추정입니다.");
  } else {
    setText("bsm-system-label", `${formatDateKo(state.birthDate)} 출생 · 개편안 적용 예정`);
    setText("bsm-system-title", "아이맞이지원금·아동기본수당 체계 적용 예정");
    setText("bsm-system-desc", "2027년 7월 1일 이후 출생아부터 적용 예정인 예산안 기준입니다. 국회 심의와 법 개정 과정에서 달라질 수 있습니다.");
  }
  $("bsm-preferred-help").textContent = result.system === "current"
    ? "우대지역 여부는 2027년 7월 1일 이후 출생에만 적용됩니다. 아래 제도 비교 카드에는 계속 쓰입니다."
    : "행정안전부 지방우대지수 기준 우대지역 명단은 아직 공개되지 않았습니다. 모르면 ‘모름’을 선택하세요.";
}

function renderKpis(result, state) {
  const reform = result.system === "reform2027";
  setText("bsm-r-birth-support", formatMan(result.birthSupport));
  setText("bsm-r-birth-support-sub", reform ? "현금 · 출생 후 1년간 4회 분할 예정" : "국민행복카드 바우처 · 출생 시 1회");
  setBadge("bsm-r-birth-support-badge", reform && result.preferred ? "시뮬레이션" : "공식");

  const m = result.monthly;
  setText("bsm-r-monthly", m.m0to11 === m.m12to23 ? `월 ${formatMan(m.m0to11)}` : `월 ${formatMan(m.m0to11)} → ${formatMan(m.m12to23)}`);
  setText("bsm-r-monthly-sub", m.m0to11 === m.m12to23 ? "0~23개월 동일" : "0~11개월 → 12~23개월");
  const monthlyBadge = (!reform && state.care !== "home") || (reform && state.care === "switch12") ? "추정" : "시뮬레이션";
  setBadge("bsm-r-monthly-badge", monthlyBadge);

  setText("bsm-r-12m", formatMan(result.total12));
  setText("bsm-r-24m", formatMan(result.total24));
  setBadge("bsm-r-12m-badge", result.badge24);
  setBadge("bsm-r-24m-badge", result.badge24);

  const hint = $("bsm-r-preferred-hint");
  if (reform && state.preferred === "unknown" && result.preferredVariant) {
    const v = result.preferredVariant;
    hint.textContent = `위 금액은 일반지역 기준입니다. 우대지역이면 예상액이 첫 1년 ${formatDelta(v.total12 - result.total12)}, 두 돌까지 ${formatDelta(v.total24 - result.total24)} 늘어납니다.`;
    hint.hidden = false;
  } else {
    hint.hidden = true;
  }

  setText(
    "bsm-result-note",
    `${formatDateKo(state.birthDate)} 출생 · ${ORDER_LABEL[state.order]} · ${reform ? (result.preferred ? "우대지역" : "일반지역") : TIER_LABEL[state.tier]} · ${CARE_LABEL[state.care]} 기준, 두 돌까지 약 ${formatMan(result.total24)} 예상(${result.badge24}).`,
  );

  if (state.period === config.longTermMonths) {
    const long = calculateLongTerm(config, state);
    setText("bsm-r-long", formatMan(long.totalPeriod));
    show("bsm-long-panel", true);
  } else {
    show("bsm-long-panel", false);
  }
}

function breakdownCard(label, value, note, badgeLabel) {
  return el("article", { className: "bsm-breakdown-card" }, [
    el("span", { text: label }),
    el("strong", { text: value }),
    el("small", { text: note }),
    badge(badgeLabel),
  ]);
}

function renderBreakdown(result, state) {
  const container = $("bsm-breakdown");
  container.replaceChildren();
  const items = result.byItem24;
  const cards = [];
  if (result.system === "current") {
    const daycareNote = state.care === "home" ? "0세 월 100만 · 1세 월 50만원" : "어린이집 이용 월은 보육료 차액만 현금";
    cards.push(breakdownCard("첫만남이용권", formatMan(items.firstMeeting), "국민행복카드 바우처", "공식"));
    cards.push(breakdownCard("부모급여 합계", formatMan(items.parentBenefit), daycareNote, state.care === "home" ? "시뮬레이션" : "추정"));
    cards.push(breakdownCard("아동수당 합계", formatMan(items.childAllowance), `${TIER_LABEL[state.tier]} 월 ${formatMan(config.current.childAllowance[state.tier].amount)}`, "시뮬레이션"));
  } else {
    const r = config.reform2027;
    cards.push(breakdownCard("아이맞이지원금", formatMan(r.welcomeGrant[state.order].amount), "현금 · 1년간 4회 분할 예정", "공식"));
    if (state.preferred === "yes") {
      cards.push(breakdownCard("우대지역 추가", formatMan(r.welcomeGrantPreferredAddon.amount), "아이맞이지원금 추가분", "공식"));
    } else if (state.preferred === "unknown") {
      cards.push(breakdownCard("우대지역 추가", "미반영", "우대지역이면 +500만원", "공식"));
    }
    cards.push(breakdownCard(
      "아동기본수당 합계",
      formatMan(items.childBasicAllowance),
      result.preferred ? "우대지역 월 30만원" : "월 20만원 · 현금 10만 + 지역사랑상품권 10만",
      "시뮬레이션",
    ));
    cards.push(breakdownCard(
      "가정보육 추가 합계",
      formatMan(items.homeCare || 0),
      state.care === "daycare" ? "어린이집 이용 시 미지급" : "0~1세 어린이집 미이용 월 30만원",
      state.care === "switch12" ? "추정" : "시뮬레이션",
    ));
  }
  cards.forEach((card) => container.appendChild(card));
  setText("bsm-breakdown-note", "두 돌까지(24개월) 기준 항목별 합계입니다.");
}

function renderCompareSystem(result, state) {
  const body = $("bsm-compare-system-body");
  body.replaceChildren();
  const opposite = calculateOpposite(config, state);
  const isCurrent = result.system === "current";
  const currentRes = isCurrent ? result : opposite;
  const reformRes = isCurrent ? opposite : result;
  const d12 = reformRes.total12 - currentRes.total12;
  const d24 = reformRes.total24 - currentRes.total24;

  const table = el("table", { className: "result-table bsm-compare-table" }, [
    el("thead", {}, [el("tr", {}, [
      el("th", { text: "구분", attrs: { scope: "col" } }),
      el("th", { text: "6월 30일 출생(현행)", attrs: { scope: "col" } }),
      el("th", { text: "7월 1일 출생(개편안)", attrs: { scope: "col" } }),
      el("th", { text: "차이", attrs: { scope: "col" } }),
    ])]),
    el("tbody", {}, [
      el("tr", {}, [el("th", { text: "첫 1년", attrs: { scope: "row" } }), el("td", { text: formatMan(currentRes.total12) }), el("td", { text: formatMan(reformRes.total12) }), el("td", { className: "bsm-compare-card__delta", text: formatDelta(d12) })]),
      el("tr", {}, [el("th", { text: "두 돌까지", attrs: { scope: "row" } }), el("td", { text: formatMan(currentRes.total24) }), el("td", { text: formatMan(reformRes.total24) }), el("td", { className: "bsm-compare-card__delta", text: formatDelta(d24) })]),
    ]),
  ]);
  body.appendChild(el("div", { className: "table-wrap" }, [table]));

  const prefNote = state.preferred === "unknown" ? " 우대지역 여부를 모르는 경우 개편안은 일반지역 기준입니다." : "";
  body.appendChild(el("p", {
    className: "bsm-compare-summary",
    text: `같은 ${ORDER_LABEL[state.order]}·${CARE_LABEL[state.care]} 조건에서 ${isCurrent ? "2027년 7월 1일 출생이면" : "2027년 6월 30일 출생이면"} 두 돌까지 예상액은 ${formatMan(opposite.total24)}입니다. 기간에 따라 유불리가 달라집니다.${prefNote}`,
  }, []));
  body.appendChild(el("p", { className: "bsm-compare-badge" }, [badge(resolveTotalBadge({ kind: "diff" })), el("span", { text: " 차이 값은 경과규정·개편안 확정 전 추정입니다." })]));
}

function renderComparePreferred(result) {
  const panel = $("bsm-compare-preferred");
  if (result.system !== "reform2027" || !result.preferredVariant) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const body = $("bsm-compare-preferred-body");
  body.replaceChildren();
  const base = result.preferred ? result.preferredVariant : result;
  const pref = result.preferred ? result : result.preferredVariant;
  const table = el("table", { className: "result-table bsm-compare-table" }, [
    el("thead", {}, [el("tr", {}, [
      el("th", { text: "구분", attrs: { scope: "col" } }),
      el("th", { text: "일반지역", attrs: { scope: "col" } }),
      el("th", { text: "우대지역", attrs: { scope: "col" } }),
      el("th", { text: "차이", attrs: { scope: "col" } }),
    ])]),
    el("tbody", {}, [
      el("tr", {}, [el("th", { text: "출생 직후", attrs: { scope: "row" } }), el("td", { text: formatMan(base.birthSupport) }), el("td", { text: formatMan(pref.birthSupport) }), el("td", { className: "bsm-compare-card__delta", text: formatDelta(pref.birthSupport - base.birthSupport) })]),
      el("tr", {}, [el("th", { text: "첫 1년", attrs: { scope: "row" } }), el("td", { text: formatMan(base.total12) }), el("td", { text: formatMan(pref.total12) }), el("td", { className: "bsm-compare-card__delta", text: formatDelta(pref.total12 - base.total12) })]),
      el("tr", {}, [el("th", { text: "두 돌까지", attrs: { scope: "row" } }), el("td", { text: formatMan(base.total24) }), el("td", { text: formatMan(pref.total24) }), el("td", { className: "bsm-compare-card__delta", text: formatDelta(pref.total24 - base.total24) })]),
    ]),
  ]);
  body.appendChild(el("div", { className: "table-wrap" }, [table]));
  body.appendChild(el("p", { className: "bsm-compare-summary", text: "우대지역은 아이맞이지원금 +500만원, 아동기본수당 월 +10만원이 더해지는 안입니다." }));
  body.appendChild(el("p", { className: "bsm-compare-badge" }, [badge("시뮬레이션")]));
}

function itemKeys(system) {
  return system === "current" ? ["firstMeeting", "parentBenefit", "childAllowance"] : ["welcomeGrant", "childBasicAllowance", "homeCare"];
}

function renderTimelineTable(result) {
  const keys = itemKeys(result.system);
  const head = $("bsm-timeline-head");
  head.replaceChildren(el("tr", {}, [
    el("th", { text: "개월", attrs: { scope: "col" } }),
    ...keys.map((key) => el("th", { text: ITEM_LABEL[key], attrs: { scope: "col" } })),
    el("th", { text: "월 합계", attrs: { scope: "col" } }),
  ]));
  const body = $("bsm-timeline-table-body");
  body.replaceChildren();
  const long = result.rows.length > 24;
  if (!long) {
    result.rows.forEach((row) => {
      body.appendChild(el("tr", {}, [
        el("td", { text: `${row.month}개월` }),
        ...keys.map((key) => {
          const td = el("td", { text: formatWon(row.items[key]) });
          if (row.estimatedCells.includes(key) && row.items[key] > 0) td.appendChild(badge("추정"));
          return td;
        }),
        el("td", { text: formatWon(row.total) }),
      ]));
    });
    return;
  }
  for (let year = 0; year * 12 < result.rows.length; year += 1) {
    const slice = result.rows.slice(year * 12, year * 12 + 12);
    const sum = (key) => slice.reduce((acc, row) => acc + row.items[key], 0);
    body.appendChild(el("tr", {}, [
      el("td", { text: `만 ${year}세 (12개월 합계)` }),
      ...keys.map((key) => el("td", { text: formatWon(sum(key)) })),
      el("td", { text: formatWon(slice.reduce((acc, row) => acc + row.total, 0)) }),
    ]));
  }
}

let timelineChart = null;
let chartSystem = null;

function renderTimelineChart(result) {
  const canvas = $("bsm-timeline-chart");
  const wrap = $("bsm-timeline-chart-wrap");
  if (!canvas || !window.Chart) {
    if (wrap) wrap.hidden = true;
    return;
  }
  const keys = itemKeys(result.system);
  const labels = result.rows.map((row) => `${row.month}개월`);
  const datasets = keys.map((key) => ({
    label: ITEM_LABEL[key],
    data: result.rows.map((row) => row.items[key]),
    backgroundColor: ITEM_COLOR[key],
    borderWidth: 0,
  }));

  if (timelineChart && chartSystem === result.system && timelineChart.data.labels.length === labels.length) {
    timelineChart.data.labels = labels;
    timelineChart.data.datasets.forEach((dataset, index) => {
      dataset.data = datasets[index].data;
    });
    timelineChart.update("none");
    return;
  }
  if (timelineChart) timelineChart.destroy();
  chartSystem = result.system;

  const baseOpts = buildDefaultOptions();
  timelineChart = new window.Chart(canvas, {
    type: "bar",
    data: { labels, datasets },
    options: {
      ...baseOpts,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { color: "rgba(0,0,0,0.04)" },
          ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: labels.length > 24 ? 13 : 12 },
        },
        y: {
          stacked: true,
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 } },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
      plugins: {
        ...baseOpts.plugins,
        legend: { display: true, position: "top", labels: { font: { size: 11 }, boxWidth: 12, padding: 12 } },
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: { label: (c) => ` ${c.dataset.label}: ${formatKRW(c.raw)}` },
        },
      },
    },
  });
}

function renderLocal(state, result) {
  const note = $("bsm-local-note");
  if (state.local === "none") {
    note.textContent = "지자체 출산지원금은 지역마다 금액·거주요건·신청기한이 달라 중앙정부 예상액과 따로 확인하세요.";
    return;
  }
  const rule = localRules.find((item) => item.regionCode === state.local && item.birthOrder === Math.min(state.order, 3))
    || localRules.find((item) => item.regionCode === state.local);
  if (!rule || rule.amount === null) {
    note.textContent = `${rule?.label || "선택한 지역"}의 금액은 아직 반영하지 않았습니다. ${rule?.note || ""} 신청 경로: ${rule?.applicationChannel.join(", ") || "주소지 주민센터"}.`;
    return;
  }
  const grand = (result?.total24 || 0) + rule.amount;
  note.textContent = `${rule.label} 지원 ${formatMan(rule.amount)}(${rule.badge})을 더하면 두 돌까지 전체 약 ${formatMan(grand)}(추정)입니다.${result?.system === "reform2027" ? " 개편안과 지자체 지원의 중복 가능 여부는 확인이 필요합니다." : ""}`;
}

function renderChecklist(result) {
  const container = $("bsm-checklist");
  container.replaceChildren();
  const items = result?.system === "reform2027"
    ? [
      { title: "출생신고 후 신청 방법 확인", detail: "아이맞이지원금·아동기본수당 신청 방법은 아직 공개되지 않았습니다. 출생 전 복지로·정부24 공지를 확인하세요.", badge: "참고" },
      { title: "지역사랑상품권 수령 준비", detail: "아동기본수당 일부는 지역사랑상품권으로 지급될 예정입니다. 거주지 상품권 사용처를 확인하세요.", badge: "참고" },
    ]
    : [
      { title: "출생신고와 행복출산 원스톱 신청", detail: "정부24 또는 주소지 주민센터에서 첫만남이용권·부모급여·아동수당을 함께 신청할 수 있습니다.", badge: "공식" },
      { title: "출생 후 60일 이내 신청", detail: "부모급여·아동수당은 출생일로부터 60일 이내 신청해야 출생 월부터 소급 지급됩니다.", badge: "공식" },
    ];
  items.push({ title: "보호자 계좌·가족관계 확인", detail: "계좌와 주민등록 정보가 맞아야 지급 지연을 줄일 수 있습니다.", badge: "참고" });
  items.forEach((item) => {
    container.appendChild(el("article", { className: "bsm-checklist-card" }, [
      badge(item.badge),
      el("strong", { text: item.title }),
      el("p", { text: item.detail }),
    ]));
  });
}

/* ── URL ───────────────────────────────────────────── */

function syncUrl(state) {
  const params = new URLSearchParams(window.location.search);
  LEGACY_KEYS.forEach((key) => params.delete(key));
  params.delete("bd");
  Object.entries(serializeState(state)).forEach(([key, value]) => params.set(key, value));
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
}

function showUrlNotice(notices) {
  const messages = [];
  if (notices.includes("invalid") || notices.includes("invalidDate")) messages.push("공유 링크의 일부 값이 올바르지 않아 기본값으로 바꿨습니다.");
  if (notices.includes("legacyMonths")) messages.push("95개월 기간은 장기 참고(만 13세 미만)로 바뀌어 두 돌 기준으로 표시합니다.");
  const node = $("bsm-url-notice");
  node.textContent = messages.join(" ");
  node.hidden = messages.length === 0;
}

/* ── 메인 ──────────────────────────────────────────── */

function render() {
  const { parsed, state } = readForm();
  const dateInput = $("bsm-birth-date");
  const errorNode = $("bsm-input-error");

  if (configError) {
    errorNode.textContent = "기준 데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요.";
    errorNode.hidden = false;
    return;
  }

  syncUrl(state);
  const valid = parsed.status === "valid";
  dateInput.setAttribute("aria-invalid", parsed.status === "invalid" || parsed.status === "outOfRange" ? "true" : "false");
  errorNode.hidden = parsed.status === "valid" || parsed.status === "empty";
  if (parsed.status === "invalid") errorNode.textContent = "날짜 형식이 올바르지 않습니다.";
  if (parsed.status === "outOfRange") errorNode.textContent = "2026년 1월 1일부터 2028년 12월 31일 사이 날짜만 계산할 수 있습니다.";

  show("bsm-empty-state", parsed.status === "empty");
  show("bsm-result", valid);
  show("bsm-timeline-panel", valid);
  if (!valid) {
    $("bsm-system-banner").hidden = true;
    renderChecklist(null);
    renderLocal(state, null);
    return;
  }

  const result = calculate(config, state);
  renderBanner(result, state);
  renderKpis(result, state);
  renderBreakdown(result, state);
  renderCompareSystem(result, state);
  renderComparePreferred(result);
  renderTimelineTable(result);
  renderTimelineChart(result);
  renderLocal(state, result);
  renderChecklist(result);
  setText("bsm-timeline-note", result.rows.length > 24 ? "장기 참고 구간은 만 나이별 12개월 합계로 보여줍니다(추정)." : "일시금과 매월 지급분을 나눠 봅니다.");
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function init() {
  if (!configError) {
    const { state, notices } = parseUrlState(
      new URLSearchParams(window.location.search),
      config,
      localRules.map((rule) => rule.regionCode),
    );
    writeForm(state);
    showUrlNotice(notices);
  }

  ["bsm-birth-date", ...Object.values(INPUT_IDS)].forEach((id) => {
    const node = $(id);
    node?.addEventListener("input", render);
    node?.addEventListener("change", render);
  });

  $("bsm-reset-btn")?.addEventListener("click", () => {
    writeForm(DEFAULT_STATE);
    showUrlNotice([]);
    render();
    flashButton($("bsm-reset-btn"), "초기화됨");
  });

  $("bsm-copy-link-btn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("bsm-copy-link-btn"), "링크 복사됨");
    } catch {
      flashButton($("bsm-copy-link-btn"), "복사 실패");
    }
  });

  render();
}

init();
