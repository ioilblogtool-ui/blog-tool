// 아기 분유 값 계산기 — 클라이언트 스크립트

// ── 설정 로드 ─────────────────────────────────────────────────────────────────
const configEl = document.getElementById("formulaCostConfig");
const { BRANDS, MONTHLY_USAGE_RANGES } = JSON.parse(configEl?.textContent || "{}");

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const durationSlider = document.getElementById("fcDurationSlider");
const durationLabel  = document.getElementById("fcDurationLabel");
const shortcutBtns   = document.querySelectorAll(".fc-shortcut-btn");
const brandCheckboxes = document.querySelectorAll(".fc-brand-checkbox");
const priceInputs    = document.querySelectorAll(".fc-price-input");

const elTotalGrams     = document.getElementById("fc-total-grams");
const elTotalGramsNote = document.getElementById("fc-total-grams-note");
const elMinCost        = document.getElementById("fc-min-cost");
const elMinBrand       = document.getElementById("fc-min-brand");
const elMaxCost        = document.getElementById("fc-max-cost");
const elMaxBrand       = document.getElementById("fc-max-brand");
const elSaveAmount     = document.getElementById("fc-save-amount");
const elSaveNote       = document.getElementById("fc-save-note");
const elResultHeadline = document.getElementById("fc-result-headline");
const elResultSubcopy  = document.getElementById("fc-result-subcopy");
const elCompareTbody   = document.getElementById("fc-compare-tbody");
const resetBtn         = document.getElementById("resetFormulaCostBtn");
const copyBtn          = document.getElementById("copyFormulaCostLinkBtn");

let monthlyChart = null;

// ── 유틸 ──────────────────────────────────────────────────────────────────────
const fmt = (n) => Math.round(n).toLocaleString("ko-KR");
const fmtWon = (n) => `${fmt(n)}원`;
const fmtMan = (n) => {
  const man = n / 10000;
  return man >= 10
    ? `약 ${Math.round(man / 10) * 10}만원`
    : `약 ${man.toFixed(1)}만원`;
};

// ── 월령 → 하루 사용량(g) ─────────────────────────────────────────────────────
function getDailyGrams(month) {
  for (const range of MONTHLY_USAGE_RANGES) {
    if (month >= range.monthStart && month <= range.monthEnd) {
      return range.dailyGrams;
    }
  }
  return 70;
}

// ── 총 사용량 계산 ─────────────────────────────────────────────────────────────
function calcTotalAndMonthly(months) {
  const monthlyArr = [];
  let total = 0;
  for (let m = 0; m < months; m++) {
    const daily = getDailyGrams(m);
    const grams = Math.round(daily * 30);
    monthlyArr.push(grams);
    total += grams;
  }
  return { total, monthlyArr };
}

// ── 선택된 브랜드 목록 ────────────────────────────────────────────────────────
function getSelectedBrands() {
  return Array.from(brandCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => {
      const id      = cb.dataset.brandId;
      const brand   = BRANDS.find((b) => b.id === id);
      const priceEl = document.getElementById(`price-${id}`);
      const price   = priceEl ? parseInt(priceEl.value) || brand.defaultPricePer100g : brand.defaultPricePer100g;
      return { ...brand, pricePer100g: price };
    });
}

// ── 메인 계산 & UI 업데이트 ───────────────────────────────────────────────────
function calculate() {
  const months  = parseInt(durationSlider.value);
  const { total, monthlyArr } = calcTotalAndMonthly(months);
  const selected = getSelectedBrands();

  // KPI — 총 사용량
  elTotalGrams.textContent     = `약 ${fmt(total)}g`;
  elTotalGramsNote.textContent = `${months}개월 기준`;
  elResultHeadline.textContent = `${months}개월 분유 총비용`;
  elResultSubcopy.textContent  = `총 약 ${fmt(total)}g 사용 예상`;

  if (selected.length === 0) {
    elMinCost.textContent  = "-";
    elMinBrand.textContent = "브랜드를 선택하세요";
    elMaxCost.textContent  = "-";
    elMaxBrand.textContent = "-";
    elSaveAmount.textContent = "-";
    elSaveNote.textContent   = "브랜드를 하나 이상 선택하세요";
    elCompareTbody.innerHTML = `<tr><td colspan="5" class="fc-empty-row">브랜드를 선택하면 비교표가 나타납니다.</td></tr>`;
    renderChart(months, monthlyArr, []);
    return;
  }

  // 브랜드별 비용 계산 (100g당 가격 기준)
  const results = selected.map((b) => {
    const totalCost  = total * b.pricePer100g / 100;
    const monthlyAvg = Math.round(totalCost / months);
    return { ...b, totalCost, monthlyAvg };
  }).sort((a, b) => a.totalCost - b.totalCost);

  const cheapest = results[0];
  const priciest = results[results.length - 1];
  const saveAmt  = priciest.totalCost - cheapest.totalCost;

  // KPI 업데이트
  elMinCost.textContent  = fmtMan(cheapest.totalCost);
  elMinBrand.textContent = cheapest.name;
  elMaxCost.textContent  = fmtMan(priciest.totalCost);
  elMaxBrand.textContent = priciest.name;

  if (results.length >= 2) {
    elSaveAmount.textContent = fmtMan(saveAmt);
    elSaveNote.textContent   = `${priciest.name} vs ${cheapest.name} 차이`;
  } else {
    elSaveAmount.textContent = "-";
    elSaveNote.textContent   = "브랜드를 2개 이상 선택하면 절약액을 비교합니다";
  }

  // 비교표 렌더링
  elCompareTbody.innerHTML = results.map((b, i) => {
    const isMin = i === 0;
    const linkUrl = b.affiliateUrl || `https://www.coupang.com/np/search?q=${encodeURIComponent(b.name)}`;
    return `
      <tr class="${isMin ? "fc-row--best" : ""}">
        <td>
          <span class="fc-brand-dot" style="background:${b.color}"></span>
          ${b.name}
          ${isMin ? '<span class="fc-best-badge">최저</span>' : ""}
        </td>
        <td>${fmtWon(b.pricePer100g)}</td>
        <td>${fmtWon(b.monthlyAvg)}</td>
        <td><strong>${fmtMan(b.totalCost)}</strong></td>
        <td>
          <a class="fc-coupang-btn" href="${linkUrl}"
             target="_blank" rel="noopener noreferrer nofollow">보기 →</a>
        </td>
      </tr>
    `;
  }).join("");

  renderChart(months, monthlyArr, results);
  saveParams();
}

// ── Chart.js 월별 차트 ────────────────────────────────────────────────────────
function renderChart(months, monthlyArr, results) {
  const ctx = document.getElementById("fc-monthly-chart");
  if (!ctx) return;

  const labels = Array.from({ length: months }, (_, i) => `${i + 1}개월`);

  const datasets = results.map((b) => ({
    label: b.name,
    data: monthlyArr.map((grams) => grams * b.pricePer100g / 100),
    backgroundColor: b.color + "33",
    borderColor: b.color,
    borderWidth: 2,
    tension: 0.3,
    fill: false,
  }));

  if (datasets.length === 0) {
    datasets.push({
      label: "월 사용량(g)",
      data: monthlyArr,
      backgroundColor: "#E1F5EE",
      borderColor: "#0F6E56",
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    });
  }

  if (monthlyChart) {
    monthlyChart.destroy();
    monthlyChart = null;
  }

  monthlyChart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: results.length > 1 },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmtWon(Math.round(ctx.raw))}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) => `${Math.round(v / 10000)}만원`,
            font: { size: 10 },
          },
          grid: { color: "#F0EFED" },
        },
        x: {
          ticks: { font: { size: 10 } },
          grid: { display: false },
        },
      },
    },
  });
}

// ── URL 파라미터 ──────────────────────────────────────────────────────────────
function saveParams() {
  const months   = durationSlider.value;
  const selected = Array.from(brandCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.dataset.brandId)
    .join(",");
  const prices = Array.from(brandCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => {
      const el = document.getElementById(`price-${cb.dataset.brandId}`);
      return `${cb.dataset.brandId}:${el?.value || ""}`;
    })
    .join("|");

  const url = new URL(window.location.href);
  url.searchParams.set("months", months);
  url.searchParams.set("brands", selected);
  if (prices) url.searchParams.set("prices", prices);
  history.replaceState(null, "", url.toString());
}

function loadParams() {
  const url    = new URL(window.location.href);
  const months = url.searchParams.get("months");
  const brands = url.searchParams.get("brands");
  const prices = url.searchParams.get("prices");

  if (months) {
    durationSlider.value = months;
    updateDurationUI(parseInt(months));
  }
  if (brands) {
    const ids = brands.split(",");
    brandCheckboxes.forEach((cb) => {
      cb.checked = ids.includes(cb.dataset.brandId);
    });
  }
  if (prices) {
    prices.split("|").forEach((pair) => {
      const [id, val] = pair.split(":");
      const el = document.getElementById(`price-${id}`);
      if (el && val) el.value = val;
    });
  }
}

// ── 기간 슬라이더 UI ──────────────────────────────────────────────────────────
function updateDurationUI(months) {
  durationLabel.textContent = `${months}개월`;
  shortcutBtns.forEach((btn) => {
    btn.classList.toggle("is-active", parseInt(btn.dataset.months) === months);
  });
}

// ── 리셋 ──────────────────────────────────────────────────────────────────────
function resetAll() {
  durationSlider.value = "12";
  updateDurationUI(12);

  brandCheckboxes.forEach((cb) => {
    cb.checked = ["absoluteMungjak", "imperialDreamXO", "aptamil"].includes(cb.dataset.brandId);
  });

  BRANDS.forEach((b) => {
    const el = document.getElementById(`price-${b.id}`);
    if (el) el.value = b.defaultPricePer100g;
  });

  history.replaceState(null, "", window.location.pathname);
  calculate();
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────────────────────
durationSlider?.addEventListener("input", () => {
  const months = parseInt(durationSlider.value);
  updateDurationUI(months);
  calculate();
});

shortcutBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const months = parseInt(btn.dataset.months);
    durationSlider.value = months;
    updateDurationUI(months);
    calculate();
  });
});

brandCheckboxes.forEach((cb) => {
  cb.addEventListener("change", calculate);
});

priceInputs.forEach((input) => {
  input.addEventListener("input", calculate);
});

resetBtn?.addEventListener("click", resetAll);

copyBtn?.addEventListener("click", () => {
  saveParams();
  navigator.clipboard?.writeText(window.location.href).then(() => {
    const orig = copyBtn.textContent;
    copyBtn.textContent = "복사됨!";
    setTimeout(() => { copyBtn.textContent = orig; }, 1500);
  });
});

// ── 초기화 ────────────────────────────────────────────────────────────────────
loadParams();
calculate();
