/**
 * birth-support-total.js — 출산~2세 총지원금 계산기 (ES 모듈)
 * Chart.js 4.x UMD (window.Chart) 필요 — CDN <script> 먼저 로드 후 type="module".
 */
import { formatKRW, buildDefaultOptions } from "./chart-config.js";

const $ = (id) => document.getElementById(id);

function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value || 0)))}원`;
}

function formatKoreanAmount(value) {
  const amount = Math.round(Number(value || 0));
  const eok = Math.floor(amount / 100000000);
  const man = Math.floor((amount % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${new Intl.NumberFormat("ko-KR").format(man)}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${new Intl.NumberFormat("ko-KR").format(man)}만원`;
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function monthDiff(fromDate, toDate) {
  return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getVoucher(childOrder) {
  return childOrder === "SECOND_PLUS" ? 3000000 : 2000000;
}

function parentBenefitForMonth(monthIndex) {
  if (monthIndex < 12) return 1000000;
  if (monthIndex < 24) return 500000;
  return 0;
}

function childAllowanceForMonth(monthIndex) {
  return monthIndex < 24 ? 100000 : 0;
}

function calculateTimeline(childOrder, windowMonths) {
  const voucher = getVoucher(childOrder);
  const timeline = [];
  for (let month = 0; month < windowMonths; month += 1) {
    const voucherAmount  = month === 0 ? voucher : 0;
    const parentBenefit  = parentBenefitForMonth(month);
    const childAllowance = childAllowanceForMonth(month);
    const total          = voucherAmount + parentBenefit + childAllowance;
    timeline.push({ month, voucherAmount, parentBenefit, childAllowance, total });
  }
  return timeline;
}

// ── 스택 바 차트 ──────────────────────────────────────────────────────────────
let timelineChart = null;

function renderTimelineChart(timeline) {
  const canvas = $("birth-support-timeline-chart");
  if (!canvas || !window.Chart) return;

  const labels      = timeline.map((t) => `${t.month}개월`);
  const voucherData = timeline.map((t) => t.voucherAmount);
  const parentData  = timeline.map((t) => t.parentBenefit);
  const allowData   = timeline.map((t) => t.childAllowance);
  const baseOpts    = buildDefaultOptions();

  if (timelineChart) {
    timelineChart.data.labels           = labels;
    timelineChart.data.datasets[0].data = voucherData;
    timelineChart.data.datasets[1].data = parentData;
    timelineChart.data.datasets[2].data = allowData;
    timelineChart.update("none");
    return;
  }

  timelineChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "첫만남이용권",
          data: voucherData,
          backgroundColor: "rgba(186,117,23,0.80)",
          borderColor:     "rgba(186,117,23,1)",
          borderWidth: 1,
        },
        {
          label: "부모급여",
          data: parentData,
          backgroundColor: "rgba(15,110,86,0.82)",
          borderColor:     "rgba(15,110,86,1)",
          borderWidth: 1,
        },
        {
          label: "아동수당",
          data: allowData,
          backgroundColor: "rgba(59,130,246,0.70)",
          borderColor:     "rgba(59,130,246,1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...baseOpts,
      scales: {
        x: {
          stacked: true,
          grid:  { color: "rgba(0,0,0,0.04)" },
          ticks: { font: { size: 9 }, maxRotation: 0 },
        },
        y: {
          stacked: true,
          ticks: { callback: (v) => formatKRW(v), font: { size: 10 } },
          grid:  { color: "rgba(0,0,0,0.05)" },
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

// ── 리셋 헬퍼 ─────────────────────────────────────────────────────────────────
function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => { button.textContent = original; }, 1600);
}

function resetBirthSupportForm() {
  $("birthDate").value = getTodayIso();
  $("childOrder").value = "FIRST";
  $("supportWindowMonths").value = "24";
  $("currentAgeMonths").value = "0";
  $("supportMonthlySalaryReference").value = "3000000";
  renderBirthSupport();
}

// ── 렌더 ─────────────────────────────────────────────────────────────────────
function renderBirthSupport() {
  const birthDateInput  = $("birthDate");
  const childOrder      = $("childOrder").value;
  const ageInput        = $("currentAgeMonths");
  const windowMonths    = Number($("supportWindowMonths").value || 24);
  const salaryReference = Number($("supportMonthlySalaryReference").value || 0);

  if (!birthDateInput.value) {
    birthDateInput.value = getTodayIso();
  }

  const birthDate        = new Date(birthDateInput.value);
  const currentAgeMonths = Math.max(0, Math.min(windowMonths, Number(ageInput.value || 0)));
  const timeline         = calculateTimeline(childOrder, windowMonths);
  const voucher          = getVoucher(childOrder);
  const parentBenefitTotal  = timeline.reduce((sum, item) => sum + item.parentBenefit,  0);
  const childAllowanceTotal = timeline.reduce((sum, item) => sum + item.childAllowance, 0);
  const total               = timeline.reduce((sum, item) => sum + item.total,          0);
  const accumulated         = timeline.slice(0, currentAgeMonths + 1).reduce((sum, item) => sum + item.total, 0);
  const average             = total / windowMonths;
  const autoAge             = Math.max(0, Math.min(windowMonths, monthDiff(birthDate, new Date())));
  const salaryEquivalent    = salaryReference > 0 ? total / salaryReference : 0;
  const replacementRate     = salaryReference > 0 ? average / salaryReference : 0;

  if (document.activeElement !== ageInput) {
    ageInput.value = String(autoAge);
  }

  $("supportSalaryReferenceHint").textContent  = formatKoreanAmount(salaryReference);
  $("supportTotalSummary").textContent         = formatKoreanAmount(total);
  $("supportMonthlyAverage").textContent       = formatKoreanAmount(average);
  $("supportSalaryEquivalent").textContent     = `${salaryEquivalent.toFixed(1)}개월치`;
  $("supportReplacementRate").textContent      = formatPercent(replacementRate);

  $("firstMeetingVoucherValue").textContent    = formatKoreanAmount(voucher);
  $("parentBenefitTotalValue").textContent     = formatKoreanAmount(parentBenefitTotal);
  $("childAllowanceTotalValue").textContent    = formatKoreanAmount(childAllowanceTotal);
  $("supportCurrentAccumulated").textContent   = formatKoreanAmount(accumulated);
  $("supportSummaryNote").textContent          = `${childOrder === "SECOND_PLUS" ? "둘째 이상" : "첫째"} 기준 · 출생~${windowMonths}개월`;

  $("birthSupportTimelineTable").innerHTML = timeline
    .map((item) => `
      <tr>
        <td>${item.month}개월</td>
        <td>${formatWon(item.voucherAmount)}</td>
        <td>${formatWon(item.parentBenefit)}</td>
        <td>${formatWon(item.childAllowance)}</td>
        <td>${formatWon(item.total)}</td>
      </tr>
    `)
    .join("");

  renderTimelineChart(timeline);
}

// ── 초기값 & 이벤트 바인딩 ────────────────────────────────────────────────────
if (!$("birthDate").value) {
  $("birthDate").value = getTodayIso();
}

["birthDate", "childOrder", "currentAgeMonths", "supportWindowMonths", "supportMonthlySalaryReference"].forEach((id) => {
  const element = $(id);
  element?.addEventListener("input",  renderBirthSupport);
  element?.addEventListener("change", renderBirthSupport);
});

$("calcBirthSupportBtn")?.addEventListener("click", renderBirthSupport);
$("resetBirthSupportBtn")?.addEventListener("click", () => {
  resetBirthSupportForm();
  flashButton($("resetBirthSupportBtn"), "초기화됨");
});

$("copyBirthSupportLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyBirthSupportLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyBirthSupportLinkBtn"), "복사 실패");
  }
});

// ── 초기 실행 ─────────────────────────────────────────────────────────────────
renderBirthSupport();
