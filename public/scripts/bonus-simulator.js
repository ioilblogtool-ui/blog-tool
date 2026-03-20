const $ = (id) => document.getElementById(id);

const configNode = $("bonusSimulatorConfig");

if (!configNode) {
  throw new Error("bonus simulator config is missing");
}

const { companyConfigs, rankOptions, scenarioOptions, growthModeOptions } = JSON.parse(configNode.textContent || "{}");
const companyMap = Object.fromEntries(companyConfigs.map((company) => [company.companyCode, company]));
const rankMap = Object.fromEntries(rankOptions.map((rank) => [rank.code, rank.label]));
const scenarioMap = Object.fromEntries(scenarioOptions.map((scenario) => [scenario.code, scenario]));
const growthMap = Object.fromEntries(growthModeOptions.map((mode) => [mode.code, mode]));

const companySelect = $("companySelect");
const rankSelect = $("rankSelect");
const annualSalaryInput = $("annualSalaryInput");
const scenarioSelect = $("scenarioSelect");
const presetSelect = $("presetSelect");
const monthlyBaseInput = $("monthlyBaseInput");
const growthModeSelect = $("growthModeSelect");
const includeStockToggle = $("includeStockToggle");

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

function formatPct(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function toNumber(input) {
  return Number(input && input.value ? input.value : 0);
}

function getCompany() {
  return companyMap[companySelect.value] || companyConfigs[0];
}

function deriveMonthlyBase(company, annualSalary) {
  if (company.bonusModel === "HYUNDAI_PACKAGE") {
    return annualSalary * company.hyundaiPackage.monthlyBaseRatio / 12;
  }

  return annualSalary / 12;
}

function fillPresetOptions(company) {
  presetSelect.innerHTML = company.presets
    .map((preset) => `<option value="${preset.key}">${preset.label}</option>`)
    .join("");
  presetSelect.value = company.defaultPresetKey;
  setText("presetHeading", company.presetHeading);
  setText("payoutLabel1", company.payoutLabels[0]);
  setText("payoutLabel2", company.payoutLabels[1]);
}

function syncRecommendedAnnual() {
  const company = getCompany();
  const recommendedAnnual = company.baseSalaryByRank[rankSelect.value];
  annualSalaryInput.value = String(recommendedAnnual);
  annualSalaryInput.dataset.manual = "false";
}

function syncMonthlyBase(force = false) {
  const company = getCompany();
  if (force || monthlyBaseInput.dataset.manual !== "true") {
    monthlyBaseInput.value = String(Math.round(deriveMonthlyBase(company, toNumber(annualSalaryInput))));
    monthlyBaseInput.dataset.manual = "false";
  }
}

function updateContextHints() {
  const company = getCompany();
  const scenario = scenarioMap[scenarioSelect.value];
  const growthMode = growthMap[growthModeSelect.value];
  const preset = company.presets.find((item) => item.key === presetSelect.value) || company.presets[0];

  setText("annualSalaryHint", `추천값: ${formatKoreanAmount(company.baseSalaryByRank[rankSelect.value])}`);
  setText("scenarioHint", scenario.description);
  setText("presetHint", preset.description);
  setText("growthModeHint", growthMode.description);
  setText("monthlyBaseHint", `${company.companyName} 기준 자동 추정: ${formatKoreanAmount(toNumber(monthlyBaseInput))}`);

  const isHyundai = company.companyCode === "HYUNDAI";
  includeStockToggle.disabled = !isHyundai;
  if (!isHyundai) includeStockToggle.checked = false;
}

function getPositionLabel(company, payoutRatio) {
  const ratios = company.presets.map((item) => item.bonusRatio * company.scenarioMultiplier.BASE);
  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  const normalized = max === min ? 0.5 : (payoutRatio - min) / (max - min);

  if (normalized < 0.34) return "낮음 느낌";
  if (normalized < 0.67) return "평균 느낌";
  return "높음 느낌";
}

function calculateBonus(company, annualSalary, monthlyBase, scenarioCode, presetKey, includeStock) {
  const preset = company.presets.find((item) => item.key === presetKey) || company.presets[0];
  const scenarioMultiplier = company.scenarioMultiplier[scenarioCode] || 1;
  let payout1 = 0;
  let payout2 = 0;
  let extras = 0;
  let bonusAmount = 0;

  if (company.bonusModel === "SAMSUNG_TAI_OPI") {
    bonusAmount = annualSalary * preset.bonusRatio * scenarioMultiplier;
    payout1 = Math.min(annualSalary * 0.14, bonusAmount * 0.24);
    payout2 = Math.max(0, bonusAmount - payout1);
  }

  if (company.bonusModel === "SK_PI_PS") {
    bonusAmount = annualSalary * preset.bonusRatio * scenarioMultiplier;
    payout1 = bonusAmount * 0.1;
    payout2 = bonusAmount * 0.9;
  }

  if (company.bonusModel === "HYUNDAI_PACKAGE") {
    const packageConfig = company.hyundaiPackage;
    const packageMultiplier = preset.bonusRatio * scenarioMultiplier;
    const cashBonus = monthlyBase * packageConfig.packageRate * packageMultiplier + packageConfig.fixedCashBonus;
    const giftValue = packageConfig.giftValue;
    const stockValue = includeStock ? packageConfig.stockShares * packageConfig.stockReferencePrice : 0;

    bonusAmount = cashBonus;
    payout1 = cashBonus;
    payout2 = giftValue + stockValue;
    extras = giftValue + stockValue;
  }

  const totalComp = annualSalary + bonusAmount + extras;
  const payoutRatio = annualSalary > 0 ? bonusAmount / annualSalary : 0;

  return {
    preset,
    bonusAmount,
    payout1,
    payout2,
    extras,
    totalComp,
    payoutRatio,
    positionLabel: getPositionLabel(company, payoutRatio)
  };
}

function projectYears(company, annualSalary, bonusAmount, extras, scenarioCode, growthCode) {
  const years = [2026, 2027, 2028];
  const projection = [];
  let salary = annualSalary;
  let bonus = bonusAmount;
  const salaryGrowth = company.futureProjection.salaryGrowth[growthCode] + company.futureProjection.scenarioAdjust[scenarioCode];
  const bonusGrowth = company.futureProjection.bonusGrowth[growthCode] + company.futureProjection.scenarioAdjust[scenarioCode];

  years.forEach((year, index) => {
    if (index > 0) {
      salary *= 1 + salaryGrowth;
      bonus *= 1 + bonusGrowth;
    }

    projection.push({
      year,
      salary,
      bonus,
      extras,
      total: salary + bonus + extras,
      annualGrowth: index === 0 ? 0 : projection[index - 1].total > 0 ? (salary + bonus + extras) / projection[index - 1].total - 1 : 0
    });
  });

  return projection;
}

function buildDetailRows(company, annualSalary, monthlyBase, result, projections) {
  const rows = [
    ["회사", company.companyName],
    ["직급", rankMap[rankSelect.value]],
    ["추천/입력 연봉", formatWon(annualSalary)],
    [company.payoutLabels[0], formatWon(result.payout1)],
    [company.payoutLabels[1], formatWon(result.payout2)],
    ["주식/기타 보상", formatWon(result.extras)],
    ["2026 예상 총보상", formatWon(result.totalComp)],
    ["2026~2028 누적 총보상", formatWon(projections.reduce((sum, item) => sum + item.total, 0))]
  ];

  if (company.bonusModel === "HYUNDAI_PACKAGE") {
    rows.splice(3, 0, ["월 기준급/통상임금", formatWon(monthlyBase)]);
  }

  return rows;
}

function renderCompare(rankCode, scenarioCode, growthCode, includeStock) {
  const compareData = companyConfigs.map((company) => {
    const annualSalary = company.baseSalaryByRank[rankCode];
    const monthlyBase = deriveMonthlyBase(company, annualSalary);
    const result = calculateBonus(company, annualSalary, monthlyBase, scenarioCode, company.defaultPresetKey, includeStock && company.companyCode === "HYUNDAI");
    const projection = projectYears(company, annualSalary, result.bonusAmount, result.extras, scenarioCode, growthCode);

    return {
      companyCode: company.companyCode,
      companyName: company.companyName,
      totalComp: result.totalComp,
      bonusAmount: result.bonusAmount,
      threeYearTotal: projection.reduce((sum, item) => sum + item.total, 0)
    };
  });

  const maxTotal = Math.max(...compareData.map((item) => item.totalComp), 1);

  setText(
    "companyCompareList",
    ""
  );

  $("companyCompareList").innerHTML = compareData
    .map((item) => {
      const width = `${(item.totalComp / maxTotal) * 100}%`;
      return `
        <article class="compare-item compare-item--${item.companyCode}">
          <div class="compare-item__head">
            <strong>${item.companyName}</strong>
            <span>${formatKoreanAmount(item.totalComp)}</span>
          </div>
          <div class="compare-item__bar"><span style="width:${width}"></span></div>
          <div class="compare-item__meta">
            <span>2026 성과급 ${formatKoreanAmount(item.bonusAmount)}</span>
            <span>3년 누적 ${formatKoreanAmount(item.threeYearTotal)}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderScenarioCards(company, annualSalary, monthlyBase, presetKey, includeStock) {
  const mappings = [
    ["CONSERVATIVE", "scenarioBonusConservative", "scenarioTotalConservative"],
    ["BASE", "scenarioBonusBase", "scenarioTotalBase"],
    ["AGGRESSIVE", "scenarioBonusAggressive", "scenarioTotalAggressive"]
  ];

  mappings.forEach(([scenarioCode, bonusId, totalId]) => {
    const result = calculateBonus(company, annualSalary, monthlyBase, scenarioCode, presetKey, includeStock);
    setText(bonusId, formatKoreanAmount(result.bonusAmount));
    setText(totalId, `총보상 ${formatKoreanAmount(result.totalComp)}`);
  });

  document.querySelectorAll("[data-scenario-card]").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.scenarioCard === scenarioSelect.value);
  });
}

function buildInsight(company, scenarioCode, presetKey, growthCode) {
  const preset = company.presets.find((item) => item.key === presetKey) || company.presets[0];
  const scenario = scenarioMap[scenarioCode].label;
  const growth = growthMap[growthCode].label;

  if (company.companyCode === "SKHYNIX") {
    return {
      share: `나는 하이닉스 ${preset.label} ${rankMap[rankSelect.value]} 타입`,
      body: `업황 레버리지형 보상 선호에 가까운 결과입니다. ${scenario} 시나리오와 ${growth} 성장 기대를 넣으면 3개년 누적 변동 폭이 크게 보입니다.`
    };
  }

  if (company.companyCode === "HYUNDAI") {
    return {
      share: `나는 현대차 패키지 ${rankMap[rankSelect.value]} 타입`,
      body: `고정급과 패키지형 보상 안정성을 선호하는 결과입니다. ${scenario} 시나리오에서도 총보상 흐름이 비교적 매끈하게 이어집니다.`
    };
  }

  return {
    share: `나는 삼성전자 ${preset.label} ${rankMap[rankSelect.value]} 타입`,
    body: `사업부 편차를 활용하는 보상 감각에 가깝습니다. ${scenario} 시나리오에서 조직 프리셋에 따라 올해 보너스 체감 차이가 크게 나는 구조입니다.`
  };
}

function render() {
  const company = getCompany();
  const annualSalary = toNumber(annualSalaryInput);
  const monthlyBase = toNumber(monthlyBaseInput);
  const scenarioCode = scenarioSelect.value;
  const presetKey = presetSelect.value;
  const growthCode = growthModeSelect.value;
  const includeStock = includeStockToggle.checked;

  updateContextHints();

  const result = calculateBonus(company, annualSalary, monthlyBase, scenarioCode, presetKey, includeStock);
  const projections = projectYears(company, annualSalary, result.bonusAmount, result.extras, scenarioCode, growthCode);
  const cumulativeTotal = projections.reduce((sum, item) => sum + item.total, 0);
  const insight = buildInsight(company, scenarioCode, presetKey, growthCode);

  setText("bonusSummary", formatKoreanAmount(result.bonusAmount));
  setText("totalCompSummary", formatKoreanAmount(result.totalComp));
  setText("threeYearSummary", formatKoreanAmount(cumulativeTotal));
  setText("positionSummary", result.positionLabel);

  setText("bonusSummaryMirror", formatKoreanAmount(result.bonusAmount));
  setText("totalCompSummaryMirror", formatKoreanAmount(result.totalComp));
  setText("threeYearSummaryMirror", formatKoreanAmount(cumulativeTotal));
  setText("positionSummaryMirror", result.positionLabel);

  setText("year2026Total", formatKoreanAmount(projections[0].total));
  setText("year2027Total", formatKoreanAmount(projections[1].total));
  setText("year2028Total", formatKoreanAmount(projections[2].total));
  setText("year2026Note", `${company.heroLabel} 반영`);
  setText("year2027Note", projections[1].annualGrowth > 0 ? `전년 대비 +${formatPct(projections[1].annualGrowth)}` : "전년 수준 가정");
  setText("year2028Note", projections[2].annualGrowth > 0 ? `전년 대비 +${formatPct(projections[2].annualGrowth)}` : "전년 수준 가정");

  setText("companyTagline", `${company.companyName} · ${company.heroLabel} · ${result.preset.label}`);
  setText("payoutValue1", formatKoreanAmount(result.payout1));
  setText("payoutValue2", formatKoreanAmount(result.payout2));
  setText("baseAnnualValue", formatKoreanAmount(annualSalary));
  setText("extrasValue", formatKoreanAmount(result.extras));

  $("bonusBreakdownTable").innerHTML = buildDetailRows(company, annualSalary, monthlyBase, result, projections)
    .map(([label, value]) => `
      <tr>
        <td>${label}</td>
        <td>${value}</td>
      </tr>
    `)
    .join("");

  setText("insightText", insight.body);
  setText("shareCopy", insight.share);
  $("companyNotes").innerHTML = company.notes.map((line) => `<p class="note-chip">${line}</p>`).join("");

  renderScenarioCards(company, annualSalary, monthlyBase, presetKey, includeStock);
  renderCompare(rankSelect.value, scenarioCode, growthCode, includeStock);
}

function flashButton(button, label) {
  if (!button) return;
  const original = button.textContent;
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1600);
}

function initDefaults() {
  fillPresetOptions(getCompany());
  syncRecommendedAnnual();
  syncMonthlyBase(true);
  updateContextHints();
}

companySelect.addEventListener("change", () => {
  fillPresetOptions(getCompany());
  syncRecommendedAnnual();
  syncMonthlyBase(true);
  render();
});

rankSelect.addEventListener("change", () => {
  syncRecommendedAnnual();
  syncMonthlyBase(true);
  render();
});

annualSalaryInput.addEventListener("input", () => {
  annualSalaryInput.dataset.manual = "true";
  syncMonthlyBase(false);
  render();
});

monthlyBaseInput.addEventListener("input", () => {
  monthlyBaseInput.dataset.manual = "true";
  render();
});

[scenarioSelect, presetSelect, growthModeSelect, includeStockToggle].forEach((element) => {
  element.addEventListener(element.type === "checkbox" ? "change" : "input", render);
});

$("calcBonusBtn")?.addEventListener("click", render);

$("resetBonusBtn")?.addEventListener("click", () => {
  companySelect.value = companyConfigs[0].companyCode;
  rankSelect.value = companyConfigs[0].defaultRank;
  scenarioSelect.value = "BASE";
  growthModeSelect.value = "NORMAL";
  includeStockToggle.checked = false;
  monthlyBaseInput.dataset.manual = "false";
  fillPresetOptions(getCompany());
  presetSelect.value = getCompany().defaultPresetKey;
  syncRecommendedAnnual();
  syncMonthlyBase(true);
  render();
  flashButton($("resetBonusBtn"), "초기화됨");
});

$("copyBonusLinkBtn")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    flashButton($("copyBonusLinkBtn"), "링크 복사됨");
  } catch {
    flashButton($("copyBonusLinkBtn"), "복사 실패");
  }
});

initDefaults();
render();
