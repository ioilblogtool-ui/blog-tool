const $ = (id) => document.getElementById(id);

// ── 월별 차트 ─────────────────────────────────────────────────────────────────
function initOrUpdateChart(monthlyData) {
  const ctx = document.getElementById('plp-monthly-chart');
  if (!ctx || !window.Chart) return;

  const colors = monthlyData.map((_, i) => {
    if (i < 3) return '#1D9E75';
    if (i < 6) return '#5DCAA5';
    return '#9FE1CB';
  });
  const labels = monthlyData.map((_, i) => `${i + 1}개월`);
  const values = monthlyData.map(d => Math.round(d / 10000));

  if (window.plpChart) {
    window.plpChart.data.labels = labels;
    window.plpChart.data.datasets[0].data = values;
    window.plpChart.data.datasets[0].backgroundColor = colors;
    window.plpChart.update();
    return;
  }

  window.plpChart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (c) => `${c.parsed.y}만원` }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#888780', font: { size: 10 } }
        },
        y: {
          grid: { color: '#F0EFED' },
          ticks: { color: '#888780', font: { size: 10 }, callback: (v) => v + '만' }
        }
      },
      animation: { duration: 400 }
    }
  });
}

// ── 상한 뱃지 ─────────────────────────────────────────────────────────────────
function updateLimitBadges(wage) {
  const limits = [2500000, 2000000, 1600000];
  const rates  = [1.0, 1.0, 0.8];

  ['1', '2', '3'].forEach((n, i) => {
    const badge = $(`limitBadge${n}`);
    const note  = $(`limitNote${n}`);
    if (!badge || !note) return;

    const calculated = wage * rates[i];
    const isHit = calculated > limits[i];
    const actual = Math.min(calculated, limits[i]);

    badge.textContent = isHit ? `상한 ${limits[i] / 10000}만 적용` : '상한 미적용';
    badge.className = `plp-limit-badge ${isHit ? 'is-hit' : 'is-ok'}`;
    note.textContent = isHit
      ? `월 ${Math.round(wage / 10000)}만 → ${Math.round(actual / 10000)}만 수령`
      : `월 ${Math.round(actual / 10000)}만 그대로 수령`;
  });
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

function allowedLeaveMonths(extensionType) {
  return extensionType === "NONE" ? 12 : 18;
}

function leavePayForMonth(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return { pay: Math.min(monthlyWage, 2500000), cap: 2500000, ratio: "100%" };
  if (monthNumber <= 6) return { pay: Math.min(monthlyWage, 2000000), cap: 2000000, ratio: "100%" };
  return { pay: Math.min(monthlyWage * 0.8, 1600000), cap: 1600000, ratio: "80%" };
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetLeavePayForm() {
  $("leavePayMonthlyWage").value = "2500000";
  $("leavePayMonths").value = "12";
  $("leavePayExtensionType").value = "NONE";
  $("leavePayUser").value = "MOTHER";
  $("leavePayStartMonth").value = "0";
  renderParentalLeavePay();
}

function renderParentalLeavePay() {
  const monthlyWage = Number($("leavePayMonthlyWage").value || 0);
  const requestedLeaveMonths = Number($("leavePayMonths").value || 12);
  const extensionType = $("leavePayExtensionType").value;
  const leaveUser = $("leavePayUser").value;
  const startMonth = Number($("leavePayStartMonth").value || 0);
  const effectiveMonths = Math.min(requestedLeaveMonths, allowedLeaveMonths(extensionType));

  $("leavePayMonthlyWageHint").textContent = formatKoreanAmount(monthlyWage);

  const rows = [];
  let total = 0;
  let cappedCount = 0;

  for (let month = 1; month <= effectiveMonths; month += 1) {
    const result = leavePayForMonth(monthlyWage, month);
    const basePay = result.ratio === "80%" ? monthlyWage * 0.8 : monthlyWage;
    const capped = result.pay < basePay;
    if (capped) cappedCount += 1;
    total += result.pay;

    rows.push({
      label: `${startMonth + month}개월차`,
      ratio: result.ratio,
      cap: result.cap,
      pay: result.pay,
      capped
    });
  }

  const average = effectiveMonths > 0 ? total / effectiveMonths : 0;
  const replacementRate = monthlyWage > 0 ? average / monthlyWage : 0;
  const allowanceLabel = extensionType === "NONE" ? "12개월" : "18개월";

  $("leavePayTotalSummary").textContent = formatKoreanAmount(total);
  $("leavePayAverageSummary").textContent = formatKoreanAmount(average);
  $("leavePayReplacementSummary").textContent = formatPercent(replacementRate);
  $("leavePayAllowanceSummary").textContent = allowanceLabel;
  $("leavePaySummaryNote").textContent = `${leaveUser === "MOTHER" ? "엄마" : "아빠"} 기준 · 요청 ${requestedLeaveMonths}개월 / 반영 ${effectiveMonths}개월 · 상한 적용 ${cappedCount}개월`;

  initOrUpdateChart(rows.map(r => r.pay));
  updateLimitBadges(monthlyWage);

  $("leavePayTable").innerHTML = rows
    .map((row) => `
      <tr>
        <td>${row.label}</td>
        <td>${row.ratio}</td>
        <td>${formatWon(row.cap)}</td>
        <td>${formatWon(row.pay)}</td>
        <td>${row.capped ? "적용" : "미적용"}</td>
      </tr>
    `)
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "parental-leave-pay") {
  ["leavePayMonthlyWage", "leavePayMonths", "leavePayExtensionType", "leavePayUser", "leavePayStartMonth"].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderParentalLeavePay);
    element?.addEventListener("change", renderParentalLeavePay);
  });

  $("calcLeavePayBtn")?.addEventListener("click", renderParentalLeavePay);
  $("resetLeavePayBtn")?.addEventListener("click", () => {
    resetLeavePayForm();
    flashButton($("resetLeavePayBtn"), "초기화됨");
  });

  $("copyLeavePayLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("copyLeavePayLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copyLeavePayLinkBtn"), "복사 실패");
    }
  });

  renderParentalLeavePay();

  // URL 파라미터 있으면 자동 계산
  const urlParams = new URLSearchParams(window.location.search);
  const hasParams = urlParams.has('wage') || urlParams.has('months') || urlParams.has('w');
  if (hasParams) {
    setTimeout(() => {
      const calcBtn = $("calcLeavePayBtn") ||
                      document.querySelector('.button--primary[type="button"]');
      if (calcBtn) calcBtn.click();
    }, 150);
  }
}
