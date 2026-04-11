const configEl = document.getElementById("pregnancyBirthCostConfig");
const { PREGNANCY_BIRTH_COST_DEFAULT_INPUT } = JSON.parse(configEl?.textContent || "{}");

const PRENATAL_BASELINES = [
  { maxWeeks: 20, cost: 550000 },
  { maxWeeks: 28, cost: 900000 },
  { maxWeeks: 36, cost: 1250000 },
  { maxWeeks: 41, cost: 1500000 },
];

const DELIVERY_COSTS = {
  clinic: { vaginal: 1200000, c_section: 2400000 },
  general: { vaginal: 1800000, c_section: 3400000 },
  tertiary: { vaginal: 2500000, c_section: 4800000 },
};

const DAILY_HOSPITAL_COSTS = {
  clinic: 180000,
  general: 260000,
  tertiary: 380000,
};

const DEFAULT_STAY_DAYS = {
  vaginal: 3,
  c_section: 5,
};

const EPIDURAL_COSTS = {
  clinic: 250000,
  general: 320000,
  tertiary: 400000,
};

const MEDICATION_BASE_COSTS = {
  vaginal: 180000,
  c_section: 320000,
};

const POSTPARTUM_CENTER_COSTS = {
  seoul: { standard: 5100000, suite: 8100000, premium: 12000000 },
  gyeonggi: { standard: 4400000, suite: 6200000, premium: 9100000 },
  local: { standard: 3700000, suite: 5400000, premium: 7600000 },
};

const POSTPARTUM_HELPER_COSTS = {
  seoul: 1750000,
  gyeonggi: 1550000,
  local: 1300000,
};

const POSTPARTUM_HOME_COST = 350000;

const fields = {
  gestationalWeeks: document.getElementById("pregGestationalWeeks"),
  deliveryType: document.getElementById("pregDeliveryType"),
  hospitalTier: document.getElementById("pregHospitalTier"),
  fetusCount: document.getElementById("pregFetusCount"),
  epidural: document.getElementById("pregEpidural"),
  postpartumCareType: document.getElementById("pregPostpartumCareType"),
  postpartumRegion: document.getElementById("pregPostpartumRegion"),
  postpartumRoomType: document.getElementById("pregPostpartumRoomType"),
  underservedArea: document.getElementById("pregUnderservedArea"),
  birthOrder: document.getElementById("pregBirthOrder"),
  hospitalStayDays: document.getElementById("pregHospitalStayDays"),
  prenatalAdjustment: document.getElementById("pregPrenatalAdjustment"),
  postpartumCustomCost: document.getElementById("pregPostpartumCustomCost"),
  voucherEnabled: document.getElementById("pregVoucherEnabled"),
  voucherUsedAmount: document.getElementById("pregVoucherUsedAmount"),
};

const weeksHint = document.getElementById("pregWeeksHint");
const resultSubcopy = document.getElementById("pregResultSubcopy");
const medicalTotalEl = document.getElementById("pregMedicalTotal");
const voucherAvailableEl = document.getElementById("pregVoucherAvailable");
const voucherNoteEl = document.getElementById("pregVoucherNote");
const outOfPocketEl = document.getElementById("pregOutOfPocket");
const outOfPocketNoteEl = document.getElementById("pregOutOfPocketNote");
const finalTotalEl = document.getElementById("pregFinalTotal");
const finalTotalNoteEl = document.getElementById("pregFinalTotalNote");
const savingsValueEl = document.getElementById("pregSavingsValue");
const savingsNoteEl = document.getElementById("pregSavingsNote");
const breakdownTableBody = document.getElementById("pregBreakdownTableBody");
const scenarioTitleEl = document.getElementById("pregScenarioTitle");
const scenarioSummaryEl = document.getElementById("pregScenarioSummary");
const scenarioInsightEl = document.getElementById("pregScenarioInsight");
const scenarioCompareEl = document.getElementById("pregScenarioCompare");
const insightListEl = document.getElementById("pregInsightList");
const voucherRuleSummaryEl = document.getElementById("pregVoucherRuleSummary");
const voucherRuleDetailEl = document.getElementById("pregVoucherRuleDetail");
const firstMeetingVoucherEl = document.getElementById("pregFirstMeetingVoucher");
const resetBtn = document.getElementById("resetPregnancyBirthBtn");
const copyBtn = document.getElementById("copyPregnancyBirthLinkBtn");

let costChart = null;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function parseMoneyInput(raw) {
  const manwon = Math.max(0, parseInt(String(raw || "").replace(/[^\d]/g, ""), 10) || 0);
  return manwon * 10000;
}

function formatMoneyInput(raw) {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

function formatKrw(value) {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(Math.round(value));
  const sign = value < 0 ? "-" : "";
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${sign}${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  if (eok > 0) return `${sign}${eok}억원`;
  return `${sign}${man.toLocaleString("ko-KR")}만원`;
}

function getFetusMultiplier(fetusCount) {
  if (fetusCount <= 1) return 1;
  if (fetusCount === 2) return 1.35;
  return 1.6;
}

function getPrenatalBaseCost(weeks) {
  return PRENATAL_BASELINES.find((item) => weeks <= item.maxWeeks)?.cost ?? PRENATAL_BASELINES[PRENATAL_BASELINES.length - 1].cost;
}

function getInput() {
  return {
    gestationalWeeks: clamp(parseInt(fields.gestationalWeeks?.value || PREGNANCY_BIRTH_COST_DEFAULT_INPUT.gestationalWeeks, 10) || 38, 4, 41),
    deliveryType: fields.deliveryType?.value === "c_section" ? "c_section" : "vaginal",
    hospitalTier: ["clinic", "general", "tertiary"].includes(fields.hospitalTier?.value || "") ? fields.hospitalTier.value : "general",
    fetusCount: clamp(parseInt(fields.fetusCount?.value || "1", 10) || 1, 1, 3),
    epidural: fields.epidural?.value !== "no",
    postpartumCareType: ["center", "helper", "home"].includes(fields.postpartumCareType?.value || "") ? fields.postpartumCareType.value : "center",
    postpartumRegion: ["seoul", "gyeonggi", "local"].includes(fields.postpartumRegion?.value || "") ? fields.postpartumRegion.value : "gyeonggi",
    postpartumRoomType: ["standard", "suite", "premium"].includes(fields.postpartumRoomType?.value || "") ? fields.postpartumRoomType.value : "standard",
    underservedArea: fields.underservedArea?.value === "yes",
    birthOrder: fields.birthOrder?.value === "second_or_more" ? "second_or_more" : "first",
    hospitalStayDays: clamp(parseInt(fields.hospitalStayDays?.value || "0", 10) || 0, 0, 20),
    prenatalAdjustment: parseMoneyInput(fields.prenatalAdjustment?.value || 0),
    postpartumCustomCost: parseMoneyInput(fields.postpartumCustomCost?.value || 0),
    voucherEnabled: fields.voucherEnabled?.value !== "no",
    voucherUsedAmount: parseMoneyInput(fields.voucherUsedAmount?.value || 0),
  };
}

function computeVoucherLimit(input) {
  let base = input.fetusCount === 1 ? 1000000 : Math.max(1400000, input.fetusCount * 1000000);
  if (input.underservedArea) base += 200000;
  return base;
}

function computePostpartumCost(input) {
  if (input.postpartumCustomCost > 0) return input.postpartumCustomCost;
  if (input.postpartumCareType === "helper") return POSTPARTUM_HELPER_COSTS[input.postpartumRegion];
  if (input.postpartumCareType === "home") return POSTPARTUM_HOME_COST;
  return POSTPARTUM_CENTER_COSTS[input.postpartumRegion][input.postpartumRoomType];
}

function calculateLeanScenario(input) {
  const fetusMultiplier = getFetusMultiplier(input.fetusCount);
  const prenatalCost = Math.round(getPrenatalBaseCost(input.gestationalWeeks) * fetusMultiplier + input.prenatalAdjustment);
  const deliveryCost = Math.round(DELIVERY_COSTS[input.hospitalTier][input.deliveryType] * fetusMultiplier);
  const stayDays = input.hospitalStayDays || DEFAULT_STAY_DAYS[input.deliveryType];
  const hospitalizationCost = Math.round(DAILY_HOSPITAL_COSTS[input.hospitalTier] * stayDays * fetusMultiplier);
  const epiduralCost = input.epidural ? EPIDURAL_COSTS[input.hospitalTier] : 0;
  const medicationCost = Math.round(MEDICATION_BASE_COSTS[input.deliveryType] * fetusMultiplier);
  const medicalTotal = prenatalCost + deliveryCost + hospitalizationCost + epiduralCost + medicationCost;
  const voucherAvailable = input.voucherEnabled ? Math.max(0, computeVoucherLimit(input) - input.voucherUsedAmount) : 0;
  const medicalOutOfPocket = Math.max(0, medicalTotal - voucherAvailable);
  return { finalTotal: medicalOutOfPocket + computePostpartumCost(input) };
}

function calculateScenario(input) {
  const fetusMultiplier = getFetusMultiplier(input.fetusCount);
  const prenatalCost = Math.round(getPrenatalBaseCost(input.gestationalWeeks) * fetusMultiplier + input.prenatalAdjustment);
  const deliveryCost = Math.round(DELIVERY_COSTS[input.hospitalTier][input.deliveryType] * fetusMultiplier);
  const stayDays = input.hospitalStayDays || DEFAULT_STAY_DAYS[input.deliveryType];
  const hospitalizationCost = Math.round(DAILY_HOSPITAL_COSTS[input.hospitalTier] * stayDays * fetusMultiplier);
  const epiduralCost = input.epidural ? EPIDURAL_COSTS[input.hospitalTier] : 0;
  const medicationCost = Math.round(MEDICATION_BASE_COSTS[input.deliveryType] * fetusMultiplier);
  const medicalTotal = prenatalCost + deliveryCost + hospitalizationCost + epiduralCost + medicationCost;
  const voucherLimit = computeVoucherLimit(input);
  const voucherAvailable = input.voucherEnabled ? Math.max(0, voucherLimit - input.voucherUsedAmount) : 0;
  const medicalOutOfPocket = Math.max(0, medicalTotal - voucherAvailable);
  const postpartumCareCost = computePostpartumCost(input);
  const finalTotal = medicalOutOfPocket + postpartumCareCost;
  const firstMeetingVoucher = input.birthOrder === "second_or_more" ? 3000000 : 2000000;

  const leanScenario = {
    ...input,
    hospitalTier: "clinic",
    postpartumCareType: "home",
    postpartumCustomCost: 0,
    epidural: false,
    hospitalStayDays: 0,
  };

  return {
    prenatalCost,
    deliveryCost,
    hospitalizationCost,
    epiduralCost,
    medicationCost,
    medicalTotal,
    voucherLimit,
    voucherAvailable,
    medicalOutOfPocket,
    postpartumCareCost,
    finalTotal,
    stayDays,
    firstMeetingVoucher,
    leanResult: calculateLeanScenario(leanScenario),
  };
}

function createComparisonScenarios(input) {
  const altDeliveryInput = { ...input, deliveryType: input.deliveryType === "vaginal" ? "c_section" : "vaginal" };
  const altHospitalInput = { ...input, hospitalTier: input.hospitalTier === "tertiary" ? "general" : "clinic" };
  return {
    altDelivery: calculateScenario(altDeliveryInput),
    altHospital: calculateScenario(altHospitalInput),
    altDeliveryInput,
    altHospitalInput,
  };
}

function updateBreakdownTable(result) {
  const rows = [
    ["산전검사비", result.prenatalCost, "주수와 다태아 가중치를 반영한 추정치"],
    ["분만비", result.deliveryCost, "분만 방식과 병원 등급 기준"],
    ["입원비", result.hospitalizationCost, `${result.stayDays}일 기준 추정`],
    ["무통분만", result.epiduralCost, result.epiduralCost > 0 ? "선택 옵션 포함" : "미선택"],
    ["약제·처치", result.medicationCost, "단순 평균 보정치"],
    ["지원금 차감", -result.voucherAvailable, "의료비 영역에만 반영"],
    ["산후조리", result.postpartumCareCost, "의료 바우처 차감 제외"],
  ];

  breakdownTableBody.innerHTML = rows.map(([label, value, note]) => `
    <tr>
      <td>${label}</td>
      <td>${formatKrw(value)}</td>
      <td>${note}</td>
    </tr>
  `).join("");
}

function updateSummary(input, result) {
  const hospitalLabelMap = { clinic: "동네 산부인과", general: "종합병원", tertiary: "상급종합병원" };
  const deliveryLabelMap = { vaginal: "자연분만", c_section: "제왕절개" };
  const careLabelMap = { center: "산후조리원", helper: "산후도우미", home: "집조리" };

  medicalTotalEl.textContent = formatKrw(result.medicalTotal);
  voucherAvailableEl.textContent = formatKrw(result.voucherAvailable);
  voucherNoteEl.textContent = input.voucherEnabled ? `총 한도 ${formatKrw(result.voucherLimit)} 중 잔여 반영` : "바우처 미적용";
  outOfPocketEl.textContent = formatKrw(result.medicalOutOfPocket);
  outOfPocketNoteEl.textContent = result.voucherAvailable > 0 ? `의료비 ${formatKrw(result.medicalTotal)} - 지원금 ${formatKrw(result.voucherAvailable)}` : "지원금 차감 없이 계산";
  finalTotalEl.textContent = formatKrw(result.finalTotal);
  finalTotalNoteEl.textContent = `${careLabelMap[input.postpartumCareType]} ${formatKrw(result.postpartumCareCost)} 포함`;

  const savings = Math.max(result.finalTotal - result.leanResult.finalTotal, 0);
  savingsValueEl.textContent = savings > 0 ? formatKrw(savings) : "차이 작음";
  savingsNoteEl.textContent = savings > 0 ? "동네 산부인과 + 집조리 기준과의 차이" : "현재 구성이 이미 저비용에 가깝습니다.";

  scenarioTitleEl.textContent = `${deliveryLabelMap[input.deliveryType]} · ${hospitalLabelMap[input.hospitalTier]}`;
  scenarioSummaryEl.textContent = `${input.fetusCount}태아 · ${careLabelMap[input.postpartumCareType]} · ${input.gestationalWeeks}주 기준`;
  scenarioInsightEl.textContent = input.deliveryType === "c_section"
    ? "제왕절개는 수술비와 입원일수 영향으로 의료비 총액이 빠르게 커집니다. 특히 병원 급이 올라갈수록 격차가 더 벌어질 수 있습니다."
    : "자연분만은 기본 총액이 상대적으로 낮지만, 무통분만과 조리 선택에 따라 체감 총비용 차이는 여전히 크게 납니다.";

  resultSubcopy.textContent = `${hospitalLabelMap[input.hospitalTier]} · ${deliveryLabelMap[input.deliveryType]} · ${careLabelMap[input.postpartumCareType]} 기준으로 계산했습니다.`;
  voucherRuleSummaryEl.textContent = formatKrw(result.voucherLimit);
  voucherRuleDetailEl.textContent = input.fetusCount === 1
    ? `단태아 100만원${input.underservedArea ? " + 분만취약지 20만원" : ""} 기준`
    : `${input.fetusCount}태아 기준 다태아 지원${input.underservedArea ? " + 분만취약지 20만원" : ""}`;
  firstMeetingVoucherEl.textContent = formatKrw(result.firstMeetingVoucher);
}

function updateComparison(input, result) {
  const { altDelivery, altHospital } = createComparisonScenarios(input);
  const deliveryGap = Math.abs(altDelivery.finalTotal - result.finalTotal);
  const hospitalGap = Math.abs(altHospital.finalTotal - result.finalTotal);
  const insights = [];

  insights.push(
    input.deliveryType === "vaginal"
      ? `제왕절개로 바꾸면 총비용이 ${formatKrw(deliveryGap)} 더 커질 수 있습니다.`
      : `자연분만 시나리오로 보면 총비용이 ${formatKrw(deliveryGap)} 낮아질 수 있습니다.`
  );
  insights.push(
    input.hospitalTier === "tertiary"
      ? `종합병원으로 낮추면 총비용이 ${formatKrw(hospitalGap)} 줄 수 있습니다.`
      : `병원 등급을 올리면 총비용이 ${formatKrw(hospitalGap)} 늘어날 수 있습니다.`
  );
  insights.push(
    input.postpartumCareType === "center"
      ? "조리원이 총예산에서 가장 큰 비중을 차지하는 경우가 많아, 조리 방식 조정이 예산에 미치는 영향이 큽니다."
      : "의료비보다 조리비가 가벼운 구조라면 병원 등급과 분만 방식 차이가 더 크게 체감될 수 있습니다."
  );

  scenarioCompareEl.textContent = `분만 방식 변경 시 ${formatKrw(deliveryGap)}, 병원급 변경 시 ${formatKrw(hospitalGap)} 차이`;
  insightListEl.innerHTML = insights.map((text) => `<li>${text}</li>`).join("");
}

function renderChart(result) {
  const canvas = document.getElementById("pregnancyBirthCostChart");
  if (!canvas || typeof Chart === "undefined") return;

  const values = [
    result.prenatalCost,
    result.deliveryCost,
    result.hospitalizationCost,
    result.epiduralCost,
    result.medicationCost,
    -result.voucherAvailable,
    result.postpartumCareCost,
  ];

  if (costChart) costChart.destroy();

  costChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["산전검사", "분만", "입원", "무통", "약제·처치", "지원금", "산후조리"],
      datasets: [
        {
          data: values.map((item) => Math.round(item / 10000)),
          backgroundColor: values.map((value) => value < 0 ? "#0f766e" : "#f59e0b"),
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              return formatKrw((context.raw || 0) * 10000);
            },
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback(value) {
              return `${Number(value).toLocaleString("ko-KR")}만원`;
            },
          },
        },
      },
    },
  });
}

function syncDependentFields(input) {
  weeksHint.textContent = `${input.gestationalWeeks}주`;
  const roomTypeField = fields.postpartumRoomType?.closest(".field");
  if (roomTypeField) roomTypeField.style.display = input.postpartumCareType === "center" ? "" : "none";
}

function syncUrlParams(input) {
  const params = new URLSearchParams();
  params.set("weeks", String(input.gestationalWeeks));
  params.set("delivery", input.deliveryType);
  params.set("tier", input.hospitalTier);
  params.set("fetus", String(input.fetusCount));
  params.set("epidural", input.epidural ? "1" : "0");
  params.set("care", input.postpartumCareType);
  params.set("region", input.postpartumRegion);
  params.set("room", input.postpartumRoomType);
  params.set("under", input.underservedArea ? "1" : "0");
  params.set("order", input.birthOrder);
  params.set("voucher", input.voucherEnabled ? "1" : "0");
  params.set("voucherUsed", String(input.voucherUsedAmount));
  if (input.hospitalStayDays) params.set("stay", String(input.hospitalStayDays));
  if (input.prenatalAdjustment) params.set("prenatalAdj", String(input.prenatalAdjustment));
  if (input.postpartumCustomCost) params.set("careCost", String(input.postpartumCustomCost));
  history.replaceState(null, "", `?${params.toString()}`);
}

function loadFromUrlParams() {
  const params = new URLSearchParams(location.search);
  if (params.has("weeks") && fields.gestationalWeeks) fields.gestationalWeeks.value = params.get("weeks");
  if (params.has("delivery") && fields.deliveryType) fields.deliveryType.value = params.get("delivery");
  if (params.has("tier") && fields.hospitalTier) fields.hospitalTier.value = params.get("tier");
  if (params.has("fetus") && fields.fetusCount) fields.fetusCount.value = params.get("fetus");
  if (params.has("epidural") && fields.epidural) fields.epidural.value = params.get("epidural") === "1" ? "yes" : "no";
  if (params.has("care") && fields.postpartumCareType) fields.postpartumCareType.value = params.get("care");
  if (params.has("region") && fields.postpartumRegion) fields.postpartumRegion.value = params.get("region");
  if (params.has("room") && fields.postpartumRoomType) fields.postpartumRoomType.value = params.get("room");
  if (params.has("under") && fields.underservedArea) fields.underservedArea.value = params.get("under") === "1" ? "yes" : "no";
  if (params.has("order") && fields.birthOrder) fields.birthOrder.value = params.get("order");
  if (params.has("voucher") && fields.voucherEnabled) fields.voucherEnabled.value = params.get("voucher") === "1" ? "yes" : "no";
  if (params.has("voucherUsed") && fields.voucherUsedAmount) fields.voucherUsedAmount.value = formatMoneyInput(Math.round((Number(params.get("voucherUsed")) || 0) / 10000));
  if (params.has("stay") && fields.hospitalStayDays) fields.hospitalStayDays.value = params.get("stay");
  if (params.has("prenatalAdj") && fields.prenatalAdjustment) fields.prenatalAdjustment.value = formatMoneyInput(Math.round((Number(params.get("prenatalAdj")) || 0) / 10000));
  if (params.has("careCost") && fields.postpartumCustomCost) fields.postpartumCustomCost.value = formatMoneyInput(Math.round((Number(params.get("careCost")) || 0) / 10000));
}

function formatMoneyFields() {
  ["prenatalAdjustment", "postpartumCustomCost", "voucherUsedAmount"].forEach((key) => {
    if (fields[key]) fields[key].value = formatMoneyInput(fields[key].value);
  });
}

function render() {
  formatMoneyFields();
  const input = getInput();
  syncDependentFields(input);
  const result = calculateScenario(input);
  updateSummary(input, result);
  updateBreakdownTable(result);
  updateComparison(input, result);
  renderChart(result);
  syncUrlParams(input);
}

Object.values(fields).forEach((field) => {
  if (!field) return;
  field.addEventListener("input", render);
  field.addEventListener("change", render);
});

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (fields.gestationalWeeks) fields.gestationalWeeks.value = String(PREGNANCY_BIRTH_COST_DEFAULT_INPUT.gestationalWeeks);
    if (fields.deliveryType) fields.deliveryType.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.deliveryType;
    if (fields.hospitalTier) fields.hospitalTier.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.hospitalTier;
    if (fields.fetusCount) fields.fetusCount.value = String(PREGNANCY_BIRTH_COST_DEFAULT_INPUT.fetusCount);
    if (fields.epidural) fields.epidural.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.epidural ? "yes" : "no";
    if (fields.postpartumCareType) fields.postpartumCareType.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.postpartumCareType;
    if (fields.postpartumRegion) fields.postpartumRegion.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.postpartumRegion;
    if (fields.postpartumRoomType) fields.postpartumRoomType.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.postpartumRoomType;
    if (fields.underservedArea) fields.underservedArea.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.underservedArea ? "yes" : "no";
    if (fields.birthOrder) fields.birthOrder.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.birthOrder;
    if (fields.hospitalStayDays) fields.hospitalStayDays.value = "";
    if (fields.prenatalAdjustment) fields.prenatalAdjustment.value = "";
    if (fields.postpartumCustomCost) fields.postpartumCustomCost.value = "";
    if (fields.voucherEnabled) fields.voucherEnabled.value = PREGNANCY_BIRTH_COST_DEFAULT_INPUT.voucherEnabled ? "yes" : "no";
    if (fields.voucherUsedAmount) fields.voucherUsedAmount.value = formatMoneyInput(PREGNANCY_BIRTH_COST_DEFAULT_INPUT.voucherUsedAmount / 10000);
    render();
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copyBtn.textContent = "링크 복사됨";
      setTimeout(() => {
        copyBtn.textContent = "링크 복사";
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  });
}

loadFromUrlParams();
render();
