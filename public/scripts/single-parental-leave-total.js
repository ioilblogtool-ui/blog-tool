const $ = (id) => document.getElementById(id);

// ── 도넛 차트 ─────────────────────────────────────────────────────────────────
function initOrUpdateDonut(leaveTotal, spouseTotal, supportTotal, welcomeTotal) {
  const ctx = document.getElementById('spl-donut-chart');
  if (!ctx || !window.Chart) return;

  const data = [leaveTotal, spouseTotal, supportTotal, welcomeTotal];
  const colors = ['#1D9E75', '#5DCAA5', '#9FE1CB', '#E1F5EE'];
  const total = data.reduce((a, b) => a + b, 0);

  ['Leave', 'Spouse', 'Support', 'Welcome'].forEach((k, i) => {
    const el = $(`legendPct${k}`);
    if (el) el.textContent = total > 0 ? Math.round(data[i] / total * 100) + '%' : '—%';
  });

  if (window.splDonut) {
    window.splDonut.data.datasets[0].data = data;
    window.splDonut.update();
    return;
  }
  window.splDonut = new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${Math.round(c.parsed / 10000)}만원` } }
      },
      animation: { duration: 400 }
    }
  });
}

// ── 분해 카드 ─────────────────────────────────────────────────────────────────
function updateBreakdownCards(leaveTotal, spouseTotal, supportTotal, welcomeTotal) {
  const fmt = (v) => v >= 100000000
    ? `약 ${(v / 100000000).toFixed(1)}억`
    : `약 ${Math.round(v / 10000)}만`;

  const map = {
    bkLeaveVal: leaveTotal,
    bkSpouseVal: spouseTotal,
    bkSupportVal: supportTotal,
    bkWelcomeVal: welcomeTotal
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = $(id);
    if (el) el.textContent = fmt(val);
  });
}

// ── 스택 바 타임라인 차트 ─────────────────────────────────────────────────────
function initOrUpdateTimeline(monthlyRows) {
  const ctx = document.getElementById('spl-timeline-chart');
  if (!ctx || !window.Chart) return;

  const labels = monthlyRows.map(r => `${r.month}개월`);
  const toMan = (v) => Math.round(v / 10000);

  const leaveData  = monthlyRows.map(r => r.isOnLeave ? toMan(r.leaveIncome) : 0);
  const returnData = monthlyRows.map(r => !r.isOnLeave ? toMan(r.leaveIncome) : 0);
  const spouseData = monthlyRows.map(r => toMan(r.spouseIncome));
  const supportData = monthlyRows.map(r => toMan(r.supportIncome));

  const datasets = [
    { label: '육아휴직 급여', data: leaveData,   backgroundColor: '#1D9E75', stack: 'a' },
    { label: '복직 후 월급',  data: returnData,  backgroundColor: '#0F6E56', stack: 'a' },
    { label: '배우자 급여',   data: spouseData,  backgroundColor: '#5DCAA5', stack: 'a' },
    { label: '부모급여+아동수당', data: supportData, backgroundColor: '#9FE1CB', stack: 'a' },
  ];

  if (window.splTimeline) {
    window.splTimeline.data.labels = labels;
    window.splTimeline.data.datasets.forEach((ds, i) => { ds.data = datasets[i].data; });
    window.splTimeline.update();
    return;
  }

  window.splTimeline = new window.Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}만원` } }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#B4B2A9', font: { size: 9 }, maxRotation: 0,
            callback: (_, i) => (i % 3 === 0) ? `${i + 1}` : ''
          }
        },
        y: {
          stacked: true,
          grid: { color: '#F0EFED' },
          ticks: { color: '#888780', font: { size: 10 }, callback: (v) => v + '만' }
        }
      },
      animation: { duration: 400 }
    }
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

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getVoucher(childOrder, included) {
  if (!included) return 0;
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

function leavePayForMonth(monthlyWage, monthNumber) {
  if (monthNumber <= 3) return Math.min(monthlyWage, 2500000);
  if (monthNumber <= 6) return Math.min(monthlyWage, 2000000);
  return Math.min(monthlyWage * 0.8, 1600000);
}

function allowedLeaveMonths(extensionType) {
  return extensionType === "NONE" ? 12 : 18;
}

function buildTimeline(monthlyWage, spouseSalary, leaveMonths, childOrder, includeVoucher) {
  const voucher = getVoucher(childOrder, includeVoucher);
  const timeline = [];

  for (let month = 0; month < 24; month += 1) {
    const onLeave = month < leaveMonths;
    const leaveUserIncome = onLeave ? leavePayForMonth(monthlyWage, month + 1) : monthlyWage;
    const spouseIncome = spouseSalary;
    const parentBenefit = parentBenefitForMonth(month);
    const childAllowance = childAllowanceForMonth(month);
    const other = month === 0 ? voucher : 0;
    const total = leaveUserIncome + spouseIncome + parentBenefit + childAllowance + other;

    timeline.push({ month, leaveUserIncome, spouseIncome, parentBenefit, childAllowance, other, total, onLeave });
  }

  return timeline;
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function resetSingleLeaveForm() {
  $("singleLeaveUser").value = "MOTHER";
  $("singleMonthlyWage").value = "2500000";
  $("singleSpouseSalary").value = "3500000";
  $("singleLeaveMonths").value = "12";
  $("singleExtensionType").value = "NONE";
  $("singleChildOrder").value = "FIRST";
  $("singleCurrentStatus").value = "BEFORE_BIRTH";
  $("includeVoucherToggle").checked = true;
  $("singleBirthDate").value = getTodayIso();
  renderSingleLeaveTotal();
}

function renderSingleLeaveTotal() {
  const leaveUser = $("singleLeaveUser").value;
  const monthlyWage = Number($("singleMonthlyWage").value || 0);
  const spouseSalary = Number($("singleSpouseSalary").value || 0);
  const requestedLeaveMonths = Number($("singleLeaveMonths").value || 12);
  const extensionType = $("singleExtensionType").value;
  const childOrder = $("singleChildOrder").value;
  const includeVoucher = $("includeVoucherToggle").checked;
  const status = $("singleCurrentStatus").value;
  const birthDate = $("singleBirthDate").value || getTodayIso();

  $("singleMonthlyWageHint").textContent = formatKoreanAmount(monthlyWage);
  $("singleSpouseSalaryHint").textContent = formatKoreanAmount(spouseSalary);
  if (!$("singleBirthDate").value) {
    $("singleBirthDate").value = birthDate;
  }

  const effectiveLeaveMonths = Math.min(requestedLeaveMonths, allowedLeaveMonths(extensionType));
  const timeline = buildTimeline(monthlyWage, spouseSalary, effectiveLeaveMonths, childOrder, includeVoucher);
  const leaveUserIncomeTotal = timeline.reduce((sum, item) => sum + item.leaveUserIncome, 0);
  const spouseIncomeTotal = timeline.reduce((sum, item) => sum + item.spouseIncome, 0);
  const supportTotal = timeline.reduce((sum, item) => sum + item.parentBenefit + item.childAllowance, 0);
  const voucherTotal = getVoucher(childOrder, includeVoucher);
  const total = timeline.reduce((sum, item) => sum + item.total, 0);
  const householdAverage = total / 24;
  const summaryLabel = `${leaveUser === "MOTHER" ? "엄마" : "아빠"} ${effectiveLeaveMonths}개월 육아휴직`;
  const spouseLabel = leaveUser === "MOTHER" ? "남편 월급 포함" : "아내 월급 포함";

  $("singleTotalSummary").textContent = formatKoreanAmount(total);
  $("singleHouseholdAverage").textContent = formatKoreanAmount(householdAverage);
  $("singleLeaveUserIncomeSummary").textContent = formatKoreanAmount(leaveUserIncomeTotal);
  $("singleSpouseIncomeSummary").textContent = formatKoreanAmount(spouseIncomeTotal);

  $("singleLeaveMonthsMetric").textContent = `${effectiveLeaveMonths}개월`;
  $("singleSupportMetric").textContent = formatKoreanAmount(supportTotal);
  $("singleVoucherMetric").textContent = voucherTotal > 0 ? formatKoreanAmount(voucherTotal) : "미포함";

  $("singleLeaveUserIncomeValue").textContent = formatKoreanAmount(leaveUserIncomeTotal);
  $("singleSpouseIncomeValue").textContent = formatKoreanAmount(spouseIncomeTotal);
  $("singleSupportValue").textContent = formatKoreanAmount(supportTotal);
  $("singleVoucherValue").textContent = formatKoreanAmount(voucherTotal);
  $("singleSummaryNote").textContent = `${status === "BEFORE_BIRTH" ? "출생 전 가정" : "출생 후 계산"} · ${summaryLabel} · ${spouseLabel}`;

  initOrUpdateDonut(leaveUserIncomeTotal, spouseIncomeTotal, supportTotal, voucherTotal);
  updateBreakdownCards(leaveUserIncomeTotal, spouseIncomeTotal, supportTotal, voucherTotal);

  const timelineRows = timeline.map(r => ({
    leaveIncome: r.leaveUserIncome,
    spouseIncome: r.spouseIncome,
    supportIncome: r.parentBenefit + r.childAllowance + r.other,
    isOnLeave: r.onLeave,
    month: r.month + 1
  }));
  initOrUpdateTimeline(timelineRows);

  const splSub = $("splTimelineSub");
  if (splSub) splSub.textContent = `${summaryLabel} · ${spouseLabel}`;

  $("singleLeaveTimelineTable").innerHTML = timeline
    .map((item) => {
      const tag = item.onLeave
        ? `<span class="spl-month-tag spl-month-tag--leave">휴직</span>`
        : `<span class="spl-month-tag spl-month-tag--return">복직</span>`;
      return `
        <tr>
          <td>${item.month + 1}개월${tag}</td>
          <td>${formatWon(item.leaveUserIncome)}</td>
          <td>${formatWon(item.spouseIncome)}</td>
          <td>${formatWon(item.parentBenefit)}</td>
          <td>${formatWon(item.childAllowance + item.other)}</td>
          <td>${formatWon(item.total)}</td>
        </tr>
      `;
    })
    .join("");
}

const page = document.querySelector("[data-calculator]")?.dataset.calculator;

if (page === "single-parental-leave-total") {
  if (!$("singleBirthDate").value) {
    $("singleBirthDate").value = getTodayIso();
  }

  [
    "singleLeaveUser",
    "singleMonthlyWage",
    "singleSpouseSalary",
    "singleLeaveMonths",
    "singleExtensionType",
    "singleChildOrder",
    "singleBirthDate",
    "singleCurrentStatus",
    "includeVoucherToggle"
  ].forEach((id) => {
    const element = $(id);
    element?.addEventListener("input", renderSingleLeaveTotal);
    element?.addEventListener("change", renderSingleLeaveTotal);
  });

  $("calcSingleLeaveBtn")?.addEventListener("click", renderSingleLeaveTotal);
  $("resetSingleLeaveBtn")?.addEventListener("click", () => {
    resetSingleLeaveForm();
    flashButton($("resetSingleLeaveBtn"), "초기화됨");
  });

  $("copySingleLeaveLinkBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flashButton($("copySingleLeaveLinkBtn"), "링크 복사됨");
    } catch {
      flashButton($("copySingleLeaveLinkBtn"), "복사 실패");
    }
  });

  renderSingleLeaveTotal();

  // URL 파라미터 있으면 자동 계산
  const urlParams = new URLSearchParams(window.location.search);
  const hasParams = urlParams.has('wage') || urlParams.has('spouse') || urlParams.has('months');
  if (hasParams) {
    setTimeout(() => {
      const calcBtn = $("calcSingleLeaveBtn") ||
                      document.querySelector('.button--primary[type="button"]');
      if (calcBtn) calcBtn.click();
    }, 150);
  }
}
