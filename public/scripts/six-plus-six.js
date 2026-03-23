const $ = (id) => document.getElementById(id);

// ── Chart.js 가로 바 차트 ────────────────────────────────────────────────
let sixCompareChart = null;

function initChart() {
  const canvas = document.getElementById('six-compare-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  sixCompareChart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['엄마 6+6', '엄마 일반', '아빠 6+6', '아빠 일반'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#5DCAA5', '#B4B2A9', '#1D9E75', '#B4B2A9'],
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.x.toFixed(0)}만원` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#888780', font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { color: '#888780', font: { size: 11 } } }
      }
    }
  });
}

function updateChart(mS, mN, fS, fN) {
  if (!sixCompareChart) return;
  sixCompareChart.data.datasets[0].data = [
    Math.round(mS / 10000),
    Math.round(mN / 10000),
    Math.round(fS / 10000),
    Math.round(fN / 10000)
  ];
  sixCompareChart.update();
}

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

function normalLeavePay(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return Math.min(monthlyWage, 2500000);
  if (monthNumber <= 6) return Math.min(monthlyWage, 2000000);
  return Math.min(monthlyWage * 0.8, 1600000);
}

function specialLeavePay(monthlyWage, monthNumber) {
  const caps = [2500000, 2500000, 3000000, 3500000, 4000000, 4500000];
  if (monthNumber <= 6) return Math.min(monthlyWage, caps[monthNumber - 1]);
  return normalLeavePay(monthlyWage, monthNumber);
}

function allowedLeaveMonths(motherMonths, fatherMonths) {
  return motherMonths >= 3 && fatherMonths >= 3 ? 18 : 12;
}

function computeTotal(monthlyWage, months, useSpecial, allowedMonthsCount) {
  const effectiveMonths = Math.min(months, allowedMonthsCount);
  let total = 0;
  const monthly = [];

  for (let month = 1; month <= effectiveMonths; month += 1) {
    const pay = useSpecial ? specialLeavePay(monthlyWage, month) : normalLeavePay(monthlyWage, month);
    total += pay;
    monthly.push(pay);
  }

  return { total, monthly, effectiveMonths };
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function setText(id, value) {
  const node = $(id);
  if (node) node.textContent = value;
}

function resetSixPlusSixForm() {
  $("sixMotherWage").value = "2500000";
  $("sixFatherWage").value = "2500000";
  $("sixMotherMonths").value = "6";
  $("sixFatherMonths").value = "6";
  $("sixChildAgeMonths").value = "0";
  $("sixLeaveMode").value = "SEQUENTIAL";
  renderSixPlusSix();
}

function renderSixPlusSix() {
  const motherWage = Number($("sixMotherWage").value || 0);
  const fatherWage = Number($("sixFatherWage").value || 0);
  const requestedMotherMonths = Number($("sixMotherMonths").value || 6);
  const requestedFatherMonths = Number($("sixFatherMonths").value || 6);
  const childAgeMonths = Number($("sixChildAgeMonths").value || 0);
  const leaveMode = $("sixLeaveMode").value;

  const extensionMonths = allowedLeaveMonths(requestedMotherMonths, requestedFatherMonths);
  const specialEligible = childAgeMonths <= 18 && requestedMotherMonths > 0 && requestedFatherMonths > 0;
  const motherSpecial = computeTotal(motherWage, requestedMotherMonths, specialEligible, extensionMonths);
  const fatherSpecial = computeTotal(fatherWage, requestedFatherMonths, specialEligible, extensionMonths);
  const motherNormal = computeTotal(motherWage, requestedMotherMonths, false, extensionMonths);
  const fatherNormal = computeTotal(fatherWage, requestedFatherMonths, false, extensionMonths);

  const householdTotal = motherSpecial.total + fatherSpecial.total;
  const normalTotal = motherNormal.total + fatherNormal.total;
  const difference = householdTotal - normalTotal;
  const originalSalaryTotal = motherWage * motherSpecial.effectiveMonths + fatherWage * fatherSpecial.effectiveMonths;
  const replacementRate = originalSalaryTotal > 0 ? householdTotal / originalSalaryTotal : 0;
  const motherGain = motherSpecial.total - motherNormal.total;
  const fatherGain = fatherSpecial.total - fatherNormal.total;
  const eligibilityLabel = specialEligible ? "6+6 가능" : "6+6 불가";
  const modeLabel = leaveMode === "SIMULTANEOUS" ? "동시" : "순차";

  setText("sixEligibilitySummary", eligibilityLabel);
  setText("sixHouseholdTotalSummary", formatKoreanAmount(householdTotal));
  setText("sixDifferenceSummary", formatKoreanAmount(difference));
  setText("sixReplacementSummary", formatPercent(replacementRate));
  setText("sixExtensionSummary", `${extensionMonths}개월`);

  setText("sixMotherGainMetric", formatKoreanAmount(motherGain));
  setText("sixFatherGainMetric", formatKoreanAmount(fatherGain));
  setText("sixMotherGainMetricCard", formatKoreanAmount(motherGain));
  setText("sixFatherGainMetricCard", formatKoreanAmount(fatherGain));
  setText("sixEligibilityMetric", eligibilityLabel);
  setText("sixReplacementSummaryMirror", formatPercent(replacementRate));

  setText("sixMotherTotalValue", formatKoreanAmount(motherSpecial.total));
  setText("sixFatherTotalValue", formatKoreanAmount(fatherSpecial.total));
  setText("sixHouseholdTotalValue", formatKoreanAmount(householdTotal));
  setText("sixHouseholdTotalMirror", formatKoreanAmount(householdTotal));
  setText("sixDifferenceValue", formatKoreanAmount(difference));
  setText("sixSummaryNote", `${modeLabel} 사용 · 자녀 생후 ${childAgeMonths}개월 · 연장 한도 ${extensionMonths}개월`);

  const largerParent = motherGain === fatherGain ? "부모 모두 비슷하게" : motherGain > fatherGain ? "엄마 쪽이 더 크게" : "아빠 쪽이 더 크게";
  const decisionCopy = specialEligible
    ? `${largerParent} 체감하는 구조입니다. 두 사람 모두 사용하면 일반 육아휴직보다 총액이 유리합니다.`
    : `현재 조건으로는 6+6 특례 적용이 어렵습니다. 자녀 개월 수와 두 사람 사용 여부를 다시 확인해보세요.`;
  const differenceCopy = difference > 0
    ? `일반 육아휴직 대비 ${formatKoreanAmount(difference)} 더 받을 수 있는 흐름입니다.`
    : `현재 입력 기준으로는 일반 육아휴직 대비 추가 수령 차이가 크지 않습니다.`;

  setText("sixDecisionCopy", decisionCopy);
  setText("sixDifferenceCopy", differenceCopy);

  // ── KPI 카드 색상 분기 ─────────────────────────────────────────────────
  const eligibilityCard = document.getElementById('sixEligibilitySummary')?.closest('.metric-card');
  if (eligibilityCard) {
    if (specialEligible) {
      eligibilityCard.classList.add('kpi-card--ok');
      eligibilityCard.classList.remove('kpi-card--warn');
    } else {
      eligibilityCard.classList.add('kpi-card--warn');
      eligibilityCard.classList.remove('kpi-card--ok');
    }
  }

  // ── 차트 업데이트 ──────────────────────────────────────────────────────
  updateChart(motherSpecial.total, motherNormal.total, fatherSpecial.total, fatherNormal.total);

  const maxMonths = Math.max(motherSpecial.effectiveMonths, fatherSpecial.effectiveMonths, 6);
  const rows = [];

  for (let month = 1; month <= maxMonths; month += 1) {
    rows.push([
      `${month}개월차`,
      month <= motherSpecial.effectiveMonths ? formatWon(motherSpecial.monthly[month - 1] || 0) : "-",
      month <= motherNormal.effectiveMonths ? formatWon(motherNormal.monthly[month - 1] || 0) : "-",
      month <= fatherSpecial.effectiveMonths ? formatWon(fatherSpecial.monthly[month - 1] || 0) : "-",
      month <= fatherNormal.effectiveMonths ? formatWon(fatherNormal.monthly[month - 1] || 0) : "-"
    ]);
  }

  rows.push([
    "총액",
    formatWon(motherSpecial.total),
    formatWon(motherNormal.total),
    formatWon(fatherSpecial.total),
    formatWon(fatherNormal.total)
  ]);

  $("sixComparisonTable").innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "six-plus-six") {
  ["sixMotherWage", "sixFatherWage", "sixMotherMonths", "sixFatherMonths", "sixChildAgeMonths", "sixLeaveMode"].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderSixPlusSix);
    element?.addEventListener("change", renderSixPlusSix);
  });

  $("calcSixPlusSixBtn")?.addEventListener("click", renderSixPlusSix);
  $("resetSixPlusSixBtn")?.addEventListener("click", () => {
    resetSixPlusSixForm();
    flashButton($("resetSixPlusSixBtn"), "초기화됨");
  });

  $("copySixPlusSixLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("copySixPlusSixLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copySixPlusSixLinkBtn"), "복사 실패");
    }
  });

  initChart();
  renderSixPlusSix();

  // ── URL 파라미터 자동 계산 ────────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const hasParams = urlParams.has('mom') || urlParams.has('dad') || urlParams.has('m1') || urlParams.has('child');
  if (hasParams) {
    setTimeout(() => {
      const calcBtn = document.getElementById('calcSixPlusSixBtn');
      if (calcBtn) calcBtn.click();
    }, 150);
  }
}
