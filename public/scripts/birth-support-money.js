import { formatKRW, buildDefaultOptions } from "./chart-config.js";
import { readParam, writeParams } from "./url-state.js";

const $ = (id) => document.getElementById(id);
const numberFormatter = new Intl.NumberFormat("ko-KR");

function parseConfig() {
  const el = $("birthSupportMoneyConfig");
  if (!el) return { nationalPolicies: [], localRules: [], regionOptions: [] };
  try {
    return JSON.parse(el.textContent || "{}");
  } catch {
    return { nationalPolicies: [], localRules: [], regionOptions: [] };
  }
}

const config = parseConfig();

function formatWon(value) {
  return `${numberFormatter.format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${numberFormatter.format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  if (man > 0) return `${numberFormatter.format(man)}만원`;
  return `${numberFormatter.format(amount)}원`;
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function readForm() {
  return {
    birthDate: $("bsm-birth-date")?.value || getTodayIso(),
    regionCode: $("bsm-region")?.value || "seoul-gangnam",
    birthOrder: clampNumber($("bsm-birth-order")?.value, 1, 3, 1),
    multipleBirthType: $("bsm-multiple-birth")?.value || "single",
    childcareType: $("bsm-childcare-type")?.value || "home",
    calculationMonths: clampNumber($("bsm-calculation-months")?.value, 12, 95, 24),
  };
}

function calculateFirstMeetingVoucher(input) {
  return input.birthOrder >= 2 ? 3000000 : 2000000;
}

function calculateParentBenefit(month) {
  if (month >= 0 && month <= 11) return 1000000;
  if (month >= 12 && month <= 23) return 500000;
  return 0;
}

function calculateChildAllowance(month) {
  return month >= 0 && month <= 94 ? 100000 : 0;
}

function findRegion(input) {
  return config.regionOptions.find((item) => item.regionCode === input.regionCode) || config.regionOptions[0];
}

function findLocalSupportRules(input) {
  const birthOrder = input.birthOrder >= 3 ? 3 : input.birthOrder;
  const exact = config.localRules.filter((rule) => rule.regionCode === input.regionCode && Number(rule.birthOrder) === birthOrder);
  if (exact.length > 0) return exact;
  return config.localRules.filter((rule) => rule.regionCode === input.regionCode && Number(rule.birthOrder) === 1);
}

function shouldPayLocalRuleAtMonth(rule, month) {
  return month === 0 && Number(rule.amount || 0) > 0;
}

function buildTimeline(input) {
  const localRules = findLocalSupportRules(input);
  const rows = [];

  for (let month = 0; month < input.calculationMonths; month += 1) {
    const firstVoucher = month === 0 ? calculateFirstMeetingVoucher(input) : 0;
    const parentBenefit = calculateParentBenefit(month);
    const childAllowance = calculateChildAllowance(month);
    const localSupport = localRules
      .filter((rule) => shouldPayLocalRuleAtMonth(rule, month))
      .reduce((sum, rule) => sum + Number(rule.amount || 0), 0);
    const badges = [];

    if (firstVoucher > 0 || parentBenefit > 0 || childAllowance > 0) badges.push(month > 23 ? "참고" : "공식");
    if (localSupport > 0) {
      localRules.forEach((rule) => badges.push(rule.badge));
    }

    rows.push({
      month,
      ageLabel: `${month}개월`,
      firstVoucher,
      parentBenefit,
      childAllowance,
      localSupport,
      monthlyTotal: firstVoucher + parentBenefit + childAllowance + localSupport,
      badges: [...new Set(badges)],
    });
  }

  return { rows, localRules };
}

function buildApplicationChecklist(input, localRules) {
  const region = findRegion(input);
  const baseItems = [
    {
      title: "출생신고와 행복출산 원스톱 신청",
      detail: "정부24 또는 주소지 주민센터에서 첫만남이용권, 부모급여, 아동수당 신청 경로를 확인하세요.",
      badge: "공식",
    },
    {
      title: "부모급여·아동수당 계좌 확인",
      detail: "보호자 계좌, 가족관계, 주민등록 정보가 맞는지 확인해야 지급 지연을 줄일 수 있습니다.",
      badge: "공식",
    },
  ];

  const localItems = localRules.map((rule) => ({
    title: `${region?.sido || ""} ${region?.sigungu || ""} 지자체 지원 확인`,
    detail: `${rule.applicationChannel.join(", ")}에서 ${rule.paymentSchedule} 기준을 확인하세요. ${rule.note || ""}`.trim(),
    badge: rule.badge,
  }));

  return [...baseItems, ...localItems];
}

function calculateBirthSupportTotal(input) {
  const { rows, localRules } = buildTimeline(input);
  const allRowsUntil12 = rows.slice(0, Math.min(12, rows.length));
  const allRowsUntil24 = rows.slice(0, Math.min(24, rows.length));

  const sumField = (field) => rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
  const totalAmount = rows.reduce((sum, row) => sum + row.monthlyTotal, 0);
  const firstVoucherTotal = sumField("firstVoucher");
  const parentBenefitTotal = sumField("parentBenefit");
  const childAllowanceTotal = sumField("childAllowance");
  const localTotal = sumField("localSupport");

  return {
    totalAmount,
    firstMonthAmount: rows[0]?.monthlyTotal || 0,
    total12Months: allRowsUntil12.reduce((sum, row) => sum + row.monthlyTotal, 0),
    total24Months: allRowsUntil24.reduce((sum, row) => sum + row.monthlyTotal, 0),
    firstVoucherTotal,
    parentBenefitTotal,
    childAllowanceTotal,
    localTotal,
    oneTimeTotal: firstVoucherTotal + localTotal,
    applicationItemCount: buildApplicationChecklist(input, localRules).length,
    timeline: rows,
    localRules,
    checklist: buildApplicationChecklist(input, localRules),
  };
}

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function renderSummary(input, result) {
  const region = findRegion(input);
  const hasUnconfirmedLocal = result.localRules.some((rule) => rule.badge === "확인 필요" || rule.amount === null);
  const isLongSimulation = input.calculationMonths > 24;

  setText("bsm-r-total", formatKoreanAmount(result.totalAmount));
  setText("bsm-r-first-month", formatKoreanAmount(result.firstMonthAmount));
  setText("bsm-r-12m-total", formatKoreanAmount(result.total12Months));
  setText("bsm-r-24m-total", formatKoreanAmount(result.total24Months));
  setText("bsm-r-first-voucher", formatKoreanAmount(result.firstVoucherTotal));
  setText("bsm-r-parent-benefit", formatKoreanAmount(result.parentBenefitTotal));
  setText("bsm-r-child-allowance", formatKoreanAmount(result.childAllowanceTotal));
  setText("bsm-r-local-support", formatKoreanAmount(result.localTotal));
  setText("bsm-r-onetime-total", formatKoreanAmount(result.oneTimeTotal));
  setText("bsm-r-application-count", `${result.applicationItemCount}개`);
  setText("bsm-r-local-note", hasUnconfirmedLocal ? "확인 필요 지역은 0원 반영" : "입력된 공식 금액 반영");
  setText("bsm-breakdown-note", `${region?.sido || ""} ${region?.sigungu || ""} · ${input.birthOrder >= 3 ? "셋째 이상" : `${input.birthOrder}째`} · ${input.calculationMonths}개월 기준`);

  const badge = $("bsm-result-badge");
  if (badge) {
    badge.textContent = isLongSimulation ? "시뮬레이션" : hasUnconfirmedLocal ? "확인 필요" : "공식+참고";
    badge.className = `bsm-badge ${isLongSimulation ? "bsm-badge--simulation" : hasUnconfirmedLocal ? "bsm-badge--check" : "bsm-badge--official"}`;
  }

  const daycareNotice = input.childcareType === "daycare"
    ? " 어린이집 이용 시 부모급여의 현금 수령 구조는 보육료 바우처와 달라질 수 있습니다."
    : "";
  const longNotice = isLongSimulation
    ? " 95개월 계산은 아동수당 장기 누적 참고 시뮬레이션입니다."
    : "";
  setText("bsm-result-note", `${hasUnconfirmedLocal ? "지자체 금액 확인이 필요한 항목은 0원으로 계산했습니다." : "확인된 지자체 금액과 국가 공통 지원금을 합산했습니다."}${daycareNotice}${longNotice}`);
}

function renderTimelineTable(result) {
  const tbody = $("bsm-timeline-table-body");
  if (!tbody) return;

  tbody.innerHTML = result.timeline
    .map((row) => `
      <tr>
        <td>${row.ageLabel}</td>
        <td>${formatWon(row.firstVoucher)}</td>
        <td>${formatWon(row.parentBenefit)}</td>
        <td>${formatWon(row.childAllowance)}</td>
        <td>${formatWon(row.localSupport)}</td>
        <td>${formatWon(row.monthlyTotal)}</td>
        <td>${row.badges.map((badge) => `<span class="bsm-badge bsm-badge--small">${badge}</span>`).join("") || "-"}</td>
      </tr>
    `)
    .join("");
}

function renderChecklist(result) {
  const container = $("bsm-checklist");
  if (!container) return;
  container.innerHTML = result.checklist
    .map((item) => `
      <article class="bsm-checklist-card">
        <span class="bsm-badge bsm-badge--small">${item.badge}</span>
        <strong>${item.title}</strong>
        <p>${item.detail}</p>
      </article>
    `)
    .join("");
}

let timelineChart = null;

function renderTimelineChart(result) {
  const canvas = $("bsm-timeline-chart");
  if (!canvas || !window.Chart) return;

  const baseOpts = buildDefaultOptions();
  const labels = result.timeline.map((row) => `${row.month}개월`);
  const datasets = [
    {
      label: "첫만남이용권",
      data: result.timeline.map((row) => row.firstVoucher),
      backgroundColor: "rgba(176, 115, 31, 0.82)",
      borderColor: "rgba(176, 115, 31, 1)",
      borderWidth: 1,
    },
    {
      label: "부모급여",
      data: result.timeline.map((row) => row.parentBenefit),
      backgroundColor: "rgba(18, 123, 98, 0.82)",
      borderColor: "rgba(18, 123, 98, 1)",
      borderWidth: 1,
    },
    {
      label: "아동수당",
      data: result.timeline.map((row) => row.childAllowance),
      backgroundColor: "rgba(55, 117, 190, 0.74)",
      borderColor: "rgba(55, 117, 190, 1)",
      borderWidth: 1,
    },
    {
      label: "지자체 지원",
      data: result.timeline.map((row) => row.localSupport),
      backgroundColor: "rgba(135, 88, 190, 0.70)",
      borderColor: "rgba(135, 88, 190, 1)",
      borderWidth: 1,
    },
  ];

  if (timelineChart) {
    timelineChart.data.labels = labels;
    timelineChart.data.datasets.forEach((dataset, index) => {
      dataset.data = datasets[index].data;
    });
    timelineChart.update("none");
    return;
  }

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
          ticks: { font: { size: 9 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 16 },
        },
        y: {
          stacked: true,
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 } },
          grid: { color: "rgba(0,0,0,0.05)" },
        },
      },
      plugins: {
        ...baseOpts.plugins,
        legend: {
          display: true,
          position: "top",
          labels: { font: { size: 11 }, boxWidth: 12, padding: 12 },
        },
        tooltip: {
          ...baseOpts.plugins.tooltip,
          callbacks: {
            label: (c) => ` ${c.dataset.label}: ${formatKRW(c.raw)}`,
          },
        },
      },
    },
  });
}

function syncUrlParams(input) {
  writeParams({
    birthDate: input.birthDate,
    region: input.regionCode,
    order: input.birthOrder,
    multiple: input.multipleBirthType,
    childcare: input.childcareType,
    months: input.calculationMonths,
  });
}

function restoreFromUrl() {
  const today = getTodayIso();
  const birthDate = readParam("birthDate", today);
  const region = readParam("region", "seoul-gangnam");
  const order = readParam("order", "1");
  const multiple = readParam("multiple", "single");
  const childcare = readParam("childcare", "home");
  const months = readParam("months", "24");

  if ($("bsm-birth-date")) $("bsm-birth-date").value = birthDate;
  if ($("bsm-region")) $("bsm-region").value = region;
  if ($("bsm-birth-order")) $("bsm-birth-order").value = order;
  if ($("bsm-multiple-birth")) $("bsm-multiple-birth").value = multiple;
  if ($("bsm-childcare-type")) $("bsm-childcare-type").value = childcare;
  if ($("bsm-calculation-months")) $("bsm-calculation-months").value = months;
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetForm() {
  if ($("bsm-birth-date")) $("bsm-birth-date").value = getTodayIso();
  if ($("bsm-region")) $("bsm-region").value = "seoul-gangnam";
  if ($("bsm-birth-order")) $("bsm-birth-order").value = "1";
  if ($("bsm-multiple-birth")) $("bsm-multiple-birth").value = "single";
  if ($("bsm-childcare-type")) $("bsm-childcare-type").value = "home";
  if ($("bsm-calculation-months")) $("bsm-calculation-months").value = "24";
  render();
}

function render() {
  const input = readForm();
  const result = calculateBirthSupportTotal(input);
  renderSummary(input, result);
  renderTimelineTable(result);
  renderChecklist(result);
  renderTimelineChart(result);
  syncUrlParams(input);
}

restoreFromUrl();

[
  "bsm-birth-date",
  "bsm-region",
  "bsm-birth-order",
  "bsm-multiple-birth",
  "bsm-childcare-type",
  "bsm-calculation-months",
].forEach((id) => {
  const el = $(id);
  el?.addEventListener("input", render);
  el?.addEventListener("change", render);
});

$("bsm-calc-btn")?.addEventListener("click", render);
$("bsm-reset-btn")?.addEventListener("click", () => {
  resetForm();
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
