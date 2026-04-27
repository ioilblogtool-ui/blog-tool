const configEl = document.getElementById("postnatalCareConfig");
const {
  POSTNATAL_CARE_DEFAULT_INPUT: DEFAULTS,
  POSTNATAL_CARE_RATES_2026: RATES,
  POSTNATAL_CARE_TIME_OPTIONS: TIME_OPTIONS,
} = JSON.parse(configEl?.textContent || "{}");

const fields = {
  region: document.getElementById("pncRegion"),
  birthType: document.getElementById("pncBirthType"),
  childOrder: document.getElementById("pncChildOrder"),
  incomeType: document.getElementById("pncIncomeType"),
  useVoucher: document.getElementById("pncUseVoucher"),
  servicePeriod: document.getElementById("pncServicePeriod"),
  careTimeType: document.getElementById("pncCareTimeType"),
  localSubsidy: document.getElementById("pncLocalSubsidy"),
  privateExtraCost: document.getElementById("pncPrivateExtraCost"),
};

const resultEls = {
  subcopy: document.getElementById("pncResultSubcopy"),
  totalPrice: document.getElementById("pncTotalPrice"),
  totalPriceNote: document.getElementById("pncTotalPriceNote"),
  governmentSubsidy: document.getElementById("pncGovernmentSubsidy"),
  governmentNote: document.getElementById("pncGovernmentNote"),
  baseUserPayment: document.getElementById("pncBaseUserPayment"),
  finalUserPayment: document.getElementById("pncFinalUserPayment"),
  finalNote: document.getElementById("pncFinalNote"),
  sourceBadge: document.getElementById("pncSourceBadge"),
  sourceText: document.getElementById("pncSourceText"),
  interpretation: document.getElementById("pncInterpretation"),
  breakdownBody: document.getElementById("pncBreakdownTableBody"),
};

const resetBtn = document.getElementById("resetPostnatalCareBtn");
const copyBtn = document.getElementById("copyPostnatalCareLinkBtn");

let chartInstance = null;

function parseManwon(raw) {
  return Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
}

function fmtWon(n) {
  if (!Number.isFinite(n)) return "-";
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function fmtManwon(n) {
  if (!Number.isFinite(n)) return "-";
  const man = Math.round(n / 10000);
  return man.toLocaleString("ko-KR") + "만원";
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function readState() {
  return {
    region: fields.region?.value || DEFAULTS.region,
    birthType: fields.birthType?.value || DEFAULTS.birthType,
    childOrder: fields.childOrder?.value || DEFAULTS.childOrder,
    incomeType: fields.incomeType?.value || DEFAULTS.incomeType,
    useVoucher: fields.useVoucher?.value !== "no",
    servicePeriod: fields.servicePeriod?.value || DEFAULTS.servicePeriod,
    careTimeType: fields.careTimeType?.value || DEFAULTS.careTimeType,
    localSubsidy: parseManwon(fields.localSubsidy?.value) * 10000,
    privateExtraCost: parseManwon(fields.privateExtraCost?.value) * 10000,
  };
}

function lookupRate(state) {
  const effectiveIncomeType = state.incomeType === "unknown" ? "tonghap" : state.incomeType;

  let match = RATES.find(
    (r) =>
      r.birthType === state.birthType &&
      r.childOrder === state.childOrder &&
      r.incomeType === effectiveIncomeType &&
      r.servicePeriod === state.servicePeriod
  );

  if (!match) {
    match = RATES.find(
      (r) =>
        r.birthType === "single" &&
        r.childOrder === "first" &&
        r.incomeType === effectiveIncomeType &&
        r.servicePeriod === state.servicePeriod
    );
    if (match) {
      const multiplier = state.birthType === "triplet_plus" ? 2.0 : state.birthType === "twin" ? 1.5 : 1;
      match = {
        ...match,
        totalPrice: Math.round(match.totalPrice * multiplier),
        governmentSubsidy: Math.round(match.governmentSubsidy * multiplier),
        userPayment: Math.round(match.userPayment * multiplier),
        sourceBadge: "추정",
        sourceLabel: "단태아 첫째아 기준 추정값. 실제 지원 조건은 보건소에서 확인하세요.",
      };
    }
  }

  if (!match) match = RATES[0];
  return match;
}

function getCareTimeExtra(careTimeType) {
  const opt = TIME_OPTIONS?.find((t) => t.careTimeType === careTimeType);
  return opt ? { extra: opt.extraCost, sourceBadge: opt.sourceBadge, note: opt.note } : { extra: 0, sourceBadge: "추정", note: "" };
}

function calculate(state) {
  const rate = lookupRate(state);
  const timeExtra = getCareTimeExtra(state.careTimeType);

  const totalPrice = rate.totalPrice;
  const governmentSubsidy = state.useVoucher ? rate.governmentSubsidy : 0;
  const baseUserPayment = totalPrice - governmentSubsidy;
  const finalUserPayment = baseUserPayment - state.localSubsidy + timeExtra.extra + state.privateExtraCost;

  const isFallback = rate.sourceBadge === "추정";
  const hasExtra = timeExtra.extra > 0 || state.localSubsidy > 0 || state.privateExtraCost > 0;

  return {
    rate,
    totalPrice,
    governmentSubsidy,
    baseUserPayment,
    finalUserPayment: Math.max(0, finalUserPayment),
    timeExtra: timeExtra.extra,
    timeExtraBadge: timeExtra.sourceBadge,
    timeExtraNote: timeExtra.note,
    isFallback,
    hasExtra,
    sourceBadge: isFallback ? "추정" : "공식",
    sourceText: rate.sourceLabel,
  };
}

function renderChart(result) {
  const canvas = document.getElementById("postnatalCareChart");
  if (!canvas || typeof Chart === "undefined") return;

  const data = [
    result.governmentSubsidy,
    result.baseUserPayment,
    result.timeExtra,
    result.rate.totalPrice > 0 ? Math.max(0, -result.timeExtra - result.rate.totalPrice + result.rate.totalPrice) : 0,
  ].filter((v, i) => i < 3);

  const labels = ["정부지원금", "기본 본인부담금", "추가 비용"];
  const colors = ["#1a56db", "#e8a000", "#d95c5c"];

  if (chartInstance) {
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff",
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${fmtWon(ctx.raw)}`,
          },
        },
      },
    },
  });
}

function renderBreakdown(result, state) {
  const tbody = resultEls.breakdownBody;
  if (!tbody) return;

  const rows = [
    ["총 서비스 가격", fmtWon(result.totalPrice), result.rate.sourceBadge],
    ["정부지원금", state.useVoucher ? fmtWon(result.governmentSubsidy) : "미적용", state.useVoucher ? result.rate.sourceBadge : "-"],
    ["기본 본인부담금", fmtWon(result.baseUserPayment), result.rate.sourceBadge],
  ];

  if (state.localSubsidy > 0) {
    rows.push(["지자체 추가 지원", `−${fmtWon(state.localSubsidy)}`, "직접 입력"]);
  }
  if (result.timeExtra > 0) {
    rows.push(["시간 유형 추가 비용", `+${fmtWon(result.timeExtra)}`, result.timeExtraBadge]);
  }
  if (state.privateExtraCost > 0) {
    rows.push(["민간 추가 비용", `+${fmtWon(state.privateExtraCost)}`, "직접 입력"]);
  }
  rows.push(["최종 예상 부담금", fmtWon(result.finalUserPayment), result.sourceBadge]);

  tbody.innerHTML = rows
    .map(([label, value, badge]) =>
      `<tr><td>${label}</td><td style="text-align:right;font-weight:700">${value}</td><td><span class="pnc-badge pnc-badge--${badge === "공식" ? "official" : badge === "추정" ? "estimate" : "ref"}">${badge}</span></td></tr>`
    )
    .join("");
}

function renderInterpretation(result, state) {
  const parts = [];

  if (state.incomeType === "unknown") parts.push("소득 구간을 150% 이하(통합)로 임시 계산했습니다.");
  if (result.isFallback) parts.push("해당 조건의 공식 가격표를 찾지 못해 추정값으로 표시했습니다. 보건소에서 실제 지원 금액을 확인하세요.");
  if (!state.useVoucher) parts.push("바우처 미적용 기준이라 정부지원금이 0원으로 계산됩니다.");
  if (result.timeExtra > 0) parts.push("야간·입주형 추가 비용은 제공기관마다 다를 수 있습니다.");
  if (result.finalUserPayment === 0) parts.push("지자체 지원 합산 시 계산상 부담금이 0원 이하로 나왔습니다.");

  if (parts.length === 0) parts.push("공식 지원사업 기준과 일치하는 조건입니다. 최종 신청 전 거주지 보건소에서 확인하세요.");

  setText(resultEls.interpretation, parts.join(" "));
}

function updateUI(result, state) {
  const childOrderLabel = { first: "첫째아", second: "둘째아", third_plus: "셋째아 이상" }[state.childOrder] || "";
  const birthTypeLabel = { single: "단태아", twin: "쌍태아", triplet_plus: "삼태아 이상" }[state.birthType] || "";
  const periodLabel = { short: "단축형", standard: "표준형", extended: "연장형" }[state.servicePeriod] || "";

  setText(resultEls.subcopy, `${birthTypeLabel} ${childOrderLabel} · ${periodLabel} ${result.rate.serviceDays}일 기준`);
  setText(resultEls.totalPrice, fmtWon(result.totalPrice));
  setText(resultEls.totalPriceNote, `${result.rate.serviceDays}일 기준 · 바우처 차감 전`);
  setText(resultEls.governmentSubsidy, state.useVoucher ? fmtWon(result.governmentSubsidy) : "미적용");
  setText(resultEls.governmentNote, `${result.rate.sourceBadge} 표 기준`);
  setText(resultEls.baseUserPayment, fmtWon(result.baseUserPayment));
  setText(resultEls.finalUserPayment, fmtWon(result.finalUserPayment));
  setText(resultEls.finalNote, result.hasExtra ? "추가 지원·추가 비용 반영" : "추가 비용 없음");

  const badge = resultEls.sourceBadge;
  if (badge) {
    badge.textContent = result.sourceBadge;
    badge.className = `pnc-badge pnc-badge--${result.sourceBadge === "공식" ? "official" : "estimate"}`;
  }
  setText(resultEls.sourceText, result.sourceText);

  renderInterpretation(result, state);
  renderBreakdown(result, state);
  renderChart(result);
}

function syncUrlParams(state) {
  const p = new URLSearchParams();
  p.set("region", state.region);
  p.set("bt", state.birthType);
  p.set("co", state.childOrder);
  p.set("inc", state.incomeType);
  p.set("voucher", state.useVoucher ? "yes" : "no");
  p.set("sp", state.servicePeriod);
  p.set("ct", state.careTimeType);
  if (state.localSubsidy > 0) p.set("ls", String(state.localSubsidy / 10000));
  if (state.privateExtraCost > 0) p.set("pec", String(state.privateExtraCost / 10000));
  history.replaceState(null, "", `?${p.toString()}`);
}

function loadFromUrl() {
  const p = new URLSearchParams(location.search);
  if (p.get("region") && fields.region) fields.region.value = p.get("region");
  if (p.get("bt") && fields.birthType) fields.birthType.value = p.get("bt");
  if (p.get("co") && fields.childOrder) fields.childOrder.value = p.get("co");
  if (p.get("inc") && fields.incomeType) fields.incomeType.value = p.get("inc");
  if (p.get("voucher") && fields.useVoucher) fields.useVoucher.value = p.get("voucher");
  if (p.get("sp") && fields.servicePeriod) fields.servicePeriod.value = p.get("sp");
  if (p.get("ct") && fields.careTimeType) fields.careTimeType.value = p.get("ct");
  if (p.get("ls") && fields.localSubsidy) fields.localSubsidy.value = p.get("ls");
  if (p.get("pec") && fields.privateExtraCost) fields.privateExtraCost.value = p.get("pec");
}

function runCalculation() {
  const state = readState();
  const result = calculate(state);
  updateUI(result, state);
  syncUrlParams(state);
}

function resetAll() {
  if (fields.region) fields.region.value = DEFAULTS.region;
  if (fields.birthType) fields.birthType.value = DEFAULTS.birthType;
  if (fields.childOrder) fields.childOrder.value = DEFAULTS.childOrder;
  if (fields.incomeType) fields.incomeType.value = DEFAULTS.incomeType;
  if (fields.useVoucher) fields.useVoucher.value = "yes";
  if (fields.servicePeriod) fields.servicePeriod.value = DEFAULTS.servicePeriod;
  if (fields.careTimeType) fields.careTimeType.value = DEFAULTS.careTimeType;
  if (fields.localSubsidy) fields.localSubsidy.value = "";
  if (fields.privateExtraCost) fields.privateExtraCost.value = "";
  runCalculation();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    if (copyBtn) {
      const orig = copyBtn.textContent;
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => { copyBtn.textContent = orig; }, 1500);
    }
  } catch (e) { console.error(e); }
}

Object.values(fields).forEach((field) => {
  if (!field) return;
  field.addEventListener("change", runCalculation);
  field.addEventListener("input", runCalculation);
});

resetBtn?.addEventListener("click", resetAll);
copyBtn?.addEventListener("click", copyLink);

loadFromUrl();
runCalculation();
