const dataEl = document.getElementById("seoul84ApartmentPricesData");
const data = JSON.parse(dataEl?.textContent || "{}");

const districtSelect = document.getElementById("saprDistrictSelect");
const searchInput = document.getElementById("saprSearchInput");
const sortSelect = document.getElementById("saprSortSelect");
const resetBtn = document.getElementById("saprResetBtn");
const copyBtn = document.getElementById("saprCopyLinkBtn");
const resultsBody = document.getElementById("saprResultsBody");
const compareGrid = document.getElementById("saprCompareGrid");
const salaryCompare = document.getElementById("saprSalaryCompare");
const compareStatus = document.getElementById("saprCompareStatus");
const resultsSummary = document.getElementById("saprResultsSummary");
const priceModeNotice = document.getElementById("saprPriceModeNotice");
const ctaLink = document.getElementById("saprCtaLink");
const ctaText = document.getElementById("saprCtaText");
const compareLead = document.getElementById("saprCompareLead");
const liveCount = document.getElementById("saprLiveCount");
const liveRange = document.getElementById("saprLiveRange");
const liveDistrict = document.getElementById("saprLiveDistrict");
const liveNarrative = document.getElementById("saprLiveNarrative");
const focusDistrict = document.getElementById("saprFocusDistrict");
const focusName = document.getElementById("saprFocusName");
const focusMeta = document.getElementById("saprFocusMeta");
const focusPrice = document.getElementById("saprFocusPrice");
const focusYears = document.getElementById("saprFocusYears");
const focusGap = document.getElementById("saprFocusGap");
const focusTags = document.getElementById("saprFocusTags");

const PRICE_SLIDER_MAX_MAN = 350000;
const REGION_MAP = {
  gangnam: "regulated",
  seocho: "regulated",
  songpa: "regulated",
  mapo: "regulated",
  seongdong: "regulated",
  gangdong: "regulated",
};

const state = {
  district: "all",
  query: "",
  grade: "all",
  sort: "price_desc",
  priceMode: "avg",
  salaryMode: "avgWorker",
  compareIds: [],
};

function formatEok(value) {
  if (value === null || value === undefined) return "-";
  const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  return `${fixed}억`;
}

function formatManwon(value) {
  if (value === null || value === undefined) return "-";
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

function formatYears(value) {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(1)}년`;
}

function getPriceValue(entry) {
  return state.priceMode === "high" ? entry.highPriceEok : entry.avgPriceEok;
}

function getSalaryYears(entry) {
  if (state.salaryMode === "samsung") return entry.salaryYearsSamsung;
  if (state.salaryMode === "hynix") return entry.salaryYearsHynix;
  return entry.salaryYearsAvgWorker;
}

function getFilteredEntries() {
  const query = state.query.trim().toLowerCase();
  return data.entries
    .filter((entry) => state.district === "all" || entry.districtKey === state.district)
    .filter((entry) => state.grade === "all" || entry.grade === state.grade)
    .filter((entry) => {
      if (!query) return true;
      return `${entry.apartmentName} ${entry.districtLabel} ${(entry.tags || []).join(" ")}`.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (state.sort === "name") return a.apartmentName.localeCompare(b.apartmentName, "ko");
      const aVal = getPriceValue(a);
      const bVal = getPriceValue(b);
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return state.sort === "price_asc" ? aVal - bVal : bVal - aVal;
    });
}

function getCompareEntries(filteredEntries) {
  return filteredEntries.filter((entry) => state.compareIds.includes(entry.id));
}

function syncCompareIds(filteredEntries) {
  const visibleIds = new Set(filteredEntries.map((entry) => entry.id));
  state.compareIds = state.compareIds.filter((id) => visibleIds.has(id));
}

function buildCtaHref(entry) {
  const params = new URLSearchParams();
  const region = REGION_MAP[entry.districtKey] || "regulated";
  params.set("region", region);
  const selectedPrice = getPriceValue(entry);
  if (selectedPrice !== null) {
    const man = Math.round(selectedPrice * 10000);
    if (man <= PRICE_SLIDER_MAX_MAN) params.set("price", String(man));
  }
  return `/tools/home-purchase-fund/${params.toString() ? `?${params.toString()}` : ""}`;
}

function renderResultsTable(filteredEntries) {
  resultsBody.innerHTML = filteredEntries.length
    ? filteredEntries
        .map((entry) => {
          const checked = state.compareIds.includes(entry.id) ? "checked" : "";
          const disabled = entry.compareEnabled ? "" : "disabled";
          return `
            <tr>
              <td class="sapr-col-compare"><input type="checkbox" data-compare-id="${entry.id}" ${checked} ${disabled} /></td>
              <td>${entry.districtLabel}</td>
              <td><strong>${entry.apartmentName}</strong></td>
              <td>${entry.householdCount.toLocaleString("ko-KR")}</td>
              <td>${entry.grade}</td>
              <td>${formatEok(entry.highPriceEok)}</td>
              <td>${formatEok(entry.avgPriceEok)}</td>
              <td>${formatManwon(entry.pricePerPyeongMan)}</td>
              <td class="sapr-col-link"><a href="${entry.hogangnonoUrl}" target="_blank" rel="noreferrer" class="fc-coupang-btn">보기 →</a></td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="9" class="sapr-empty-row">조건에 맞는 단지가 없습니다.</td></tr>`;
}

function renderFocus(filteredEntries, compareEntries) {
  const target = compareEntries[0] || filteredEntries[0];
  if (!target) {
    focusName.textContent = "조건에 맞는 단지가 없습니다.";
    focusMeta.textContent = "필터를 넓히면 대표 단지 요약이 다시 채워집니다.";
    focusPrice.textContent = "-";
    focusDistrict.textContent = "-";
    focusYears.textContent = "-";
    focusGap.textContent = "-";
    focusTags.innerHTML = "";
    return;
  }

  const gap = target.highPriceEok !== null && target.avgPriceEok !== null
    ? Math.max(0, target.highPriceEok - target.avgPriceEok)
    : null;

  focusName.textContent = target.apartmentName;
  focusMeta.textContent = `${target.grade} · ${target.householdCount.toLocaleString("ko-KR")}세대 · ${target.approvalYear || "입주연도 미상"}년 입주`;
  focusPrice.textContent = formatEok(target.avgPriceEok);
  focusDistrict.textContent = target.districtLabel;
  focusYears.textContent = formatYears(getSalaryYears(target));
  focusGap.textContent = gap !== null ? formatEok(gap) : "-";
  focusTags.innerHTML = (target.tags || []).map((tag) => `<span>${tag}</span>`).join("");
}

function renderLiveBrief(filteredEntries, compareEntries) {
  const values = filteredEntries.map((entry) => getPriceValue(entry)).filter((value) => value !== null);
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const districts = data.filterOptions.districts.map((district) => {
    const entries = filteredEntries.filter((entry) => entry.districtKey === district.value && getPriceValue(entry) !== null);
    const avg = entries.length ? entries.reduce((sum, entry) => sum + getPriceValue(entry), 0) / entries.length : null;
    return { label: district.label, avg };
  }).filter((item) => item.avg !== null).sort((a, b) => b.avg - a.avg);

  liveCount.textContent = `${filteredEntries.length}개`;
  resultsSummary.textContent = `${state.priceMode === "high" ? "최고가" : "평균가"} 기준 비교군`;
  liveRange.textContent = min !== null && max !== null ? `${formatEok(min)} ~ ${formatEok(max)}` : "-";
  priceModeNotice.textContent = `${state.priceMode === "high" ? "최고가" : "평균가"} 기준`;
  liveDistrict.textContent = districts[0]?.label || "-";
  compareStatus.textContent = `비교 선택 ${state.compareIds.length}개`;

  if (!filteredEntries.length) {
    liveNarrative.textContent = "현재 조건에서는 비교군이 없습니다. 지역이나 등급 조건을 넓혀 보세요.";
    compareLead.textContent = "비교 대상이 없어 카드 비교를 만들 수 없습니다.";
    return;
  }

  if (compareEntries.length >= 2) {
    const first = compareEntries[0];
    const second = compareEntries[1];
    const gap = Math.abs((getPriceValue(first) || 0) - (getPriceValue(second) || 0));
    liveNarrative.textContent = `${first.apartmentName}과 ${second.apartmentName}의 ${state.priceMode === "high" ? "최고가" : "평균가"} 차이는 ${formatEok(gap)}입니다.`;
    compareLead.textContent = `${first.apartmentName}을 기준점으로 다른 단지와 가격 간극과 체감 연수를 같이 읽는 흐름입니다.`;
    return;
  }

  const top = filteredEntries[0];
  const bottom = filteredEntries[filteredEntries.length - 1];
  const gap = top && bottom ? Math.abs((getPriceValue(top) || 0) - (getPriceValue(bottom) || 0)) : null;
  liveNarrative.textContent = gap !== null
    ? `${top.districtLabel} 상단 단지와 하단 비교 구간의 차이는 ${formatEok(gap)} 수준입니다.`
    : "현재 조건에서 시장 흐름을 읽을 수 있습니다.";
  compareLead.textContent = "표에서 비교 체크를 두 개 이상 선택하면 카드 해석이 더 직접적으로 바뀝니다.";
}

function renderCompareCards(filteredEntries) {
  const compareEntries = getCompareEntries(filteredEntries);
  const anchor = compareEntries[0];
  compareGrid.innerHTML = compareEntries.length
    ? compareEntries.map((entry, index) => {
        const delta = anchor && anchor.id !== entry.id ? Math.abs((getPriceValue(anchor) || 0) - (getPriceValue(entry) || 0)) : null;
        return `
          <article class="sapr-compare-card${index === 0 ? " is-featured" : ""}">
            <div class="sapr-compare-card__head">
              <div>
                <p class="sapr-compare-card__eyebrow">${entry.districtLabel}</p>
                <h3>${entry.apartmentName}</h3>
              </div>
              <span class="sapr-compare-card__chip">${entry.grade}</span>
            </div>
            <div class="sapr-compare-card__price">
              <strong>${formatEok(getPriceValue(entry))}</strong>
              <span>${formatManwon(entry.pricePerPyeongMan)}/평</span>
            </div>
            <div class="sapr-compare-card__meta">
              <span>최고가 ${formatEok(entry.highPriceEok)}</span>
              <span>체감 ${formatYears(getSalaryYears(entry))}</span>
            </div>
            <p class="sapr-compare-card__note">${delta !== null ? `기준 단지와 차이 ${formatEok(delta)}` : "첫 번째 선택 단지를 기준점으로 봅니다."}</p>
            <a class="sapr-compare-card__cta" href="${buildCtaHref(entry)}">자금 계산기로 이어보기</a>
          </article>
        `;
      }).join("")
    : `<article class="sapr-empty-panel">표에서 비교 체크를 선택하면 여기서 카드형 비교가 시작됩니다.</article>`;
}

function renderSalaryCompare(filteredEntries) {
  const compareEntries = getCompareEntries(filteredEntries).filter((entry) => getSalaryYears(entry) !== null);
  const baseEntries = compareEntries.length ? compareEntries : filteredEntries.filter((entry) => getSalaryYears(entry) !== null).slice(0, 5);
  const sorted = baseEntries.slice().sort((a, b) => (getSalaryYears(b) || 0) - (getSalaryYears(a) || 0));
  const max = Math.max(...sorted.map((entry) => getSalaryYears(entry) || 0), 1);

  salaryCompare.innerHTML = sorted.length
    ? sorted.map((entry) => {
        const years = getSalaryYears(entry);
        const width = Math.max(12, ((years || 0) / max) * 100);
        return `
          <article class="sapr-salary-row">
            <div class="sapr-salary-row__head">
              <strong>${entry.apartmentName}</strong>
              <span>${entry.districtLabel} · 평균가 ${formatEok(entry.avgPriceEok)}</span>
            </div>
            <div class="sapr-salary-row__track"><div class="sapr-salary-row__fill" style="width:${width}%"></div></div>
            <div class="sapr-salary-row__value">${formatYears(years)}</div>
          </article>
        `;
      }).join("")
    : `<article class="sapr-empty-panel">현재 조건에서는 연봉 대비 체감 비교를 보여줄 수 없습니다.</article>`;
}

function renderCta(filteredEntries) {
  const compareEntries = getCompareEntries(filteredEntries);
  const target = compareEntries[0] || filteredEntries[0];
  if (!target) {
    ctaLink.setAttribute("href", "/tools/home-purchase-fund/");
    ctaText.textContent = "현재 조건에서는 자금 계산기 연결 대상이 없습니다.";
    return;
  }

  ctaLink.setAttribute("href", buildCtaHref(target));
  const selectedPrice = getPriceValue(target);
  const man = selectedPrice !== null ? Math.round(selectedPrice * 10000) : null;
  const priceLabel = state.priceMode === "high" ? "최고가" : "평균가";
  ctaText.textContent = man !== null && man > PRICE_SLIDER_MAX_MAN
    ? `${target.apartmentName}의 ${priceLabel}는 계산기 상한(35억)을 넘어서 지역 조건만 넘깁니다. 가격은 이동 후 직접 입력해 주세요.`
    : `${target.apartmentName}의 ${priceLabel}를 기준으로 자금 계산기로 바로 이어집니다.`;
}

function saveState() {
  const params = new URLSearchParams();
  if (state.district !== "all") params.set("district", state.district);
  if (state.query) params.set("q", state.query);
  if (state.grade !== "all") params.set("grade", state.grade);
  if (state.sort !== "price_desc") params.set("sort", state.sort);
  if (state.priceMode !== "avg") params.set("price", state.priceMode);
  if (state.salaryMode !== "avgWorker") params.set("salary", state.salaryMode);
  if (state.compareIds.length) params.set("compare", state.compareIds.join(","));
  history.replaceState(null, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  state.district = params.get("district") || "all";
  state.query = params.get("q") || "";
  state.grade = params.get("grade") || "all";
  state.sort = params.get("sort") || "price_desc";
  state.priceMode = params.get("price") || "avg";
  state.salaryMode = params.get("salary") || "avgWorker";
  state.compareIds = (params.get("compare") || "").split(",").map((id) => id.trim()).filter(Boolean);

  districtSelect.value = state.district;
  searchInput.value = state.query;
  sortSelect.value = state.sort;
  document.querySelectorAll('input[name="saprPriceMode"]').forEach((input) => {
    input.checked = input.value === state.priceMode;
  });
  document.querySelectorAll('input[name="saprSalaryMode"]').forEach((input) => {
    input.checked = input.value === state.salaryMode;
  });
  document.querySelectorAll('input[name="saprGrade"]').forEach((input) => {
    input.checked = input.value === state.grade;
  });
  syncGradeChipState();
}

function syncGradeChipState() {
  document.querySelectorAll(".sapr-chip-check").forEach((chip) => {
    const input = chip.querySelector("input");
    chip.classList.toggle("is-active", !!input?.checked);
  });
}

function render() {
  const filteredEntries = getFilteredEntries();
  syncCompareIds(filteredEntries);
  const compareEntries = getCompareEntries(filteredEntries);
  renderResultsTable(filteredEntries);
  renderFocus(filteredEntries, compareEntries);
  renderLiveBrief(filteredEntries, compareEntries);
  renderCompareCards(filteredEntries);
  renderSalaryCompare(filteredEntries);
  renderCta(filteredEntries);
  saveState();
}

function handleCompareToggle(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const id = target.dataset.compareId;
  if (!id) return;

  if (target.checked) {
    if (!state.compareIds.includes(id)) state.compareIds.push(id);
  } else {
    state.compareIds = state.compareIds.filter((item) => item !== id);
  }
  render();
}

async function copyCurrentLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (copyBtn) copyBtn.textContent = "링크 복사됨";
    window.setTimeout(() => {
      if (copyBtn) copyBtn.textContent = "링크 복사";
    }, 1500);
  } catch {
    if (copyBtn) copyBtn.textContent = "복사 실패";
  }
}

resetBtn?.addEventListener("click", () => {
  state.district = "all";
  state.query = "";
  state.grade = "all";
  state.sort = "price_desc";
  state.priceMode = "avg";
  state.salaryMode = "avgWorker";
  state.compareIds = data.entries.filter((entry) => entry.compareEnabled && entry.avgPriceEok !== null).slice(0, 3).map((entry) => entry.id);

  districtSelect.value = state.district;
  searchInput.value = state.query;
  sortSelect.value = state.sort;
  document.querySelectorAll('input[name="saprPriceMode"]').forEach((input, index) => {
    input.checked = index === 0;
  });
  document.querySelectorAll('input[name="saprSalaryMode"]').forEach((input, index) => {
    input.checked = index === 0;
  });
  document.querySelectorAll('input[name="saprGrade"]').forEach((input, index) => {
    input.checked = index === 0;
  });
  syncGradeChipState();
  render();
});

copyBtn?.addEventListener("click", copyCurrentLink);

districtSelect?.addEventListener("change", () => {
  state.district = districtSelect.value;
  render();
});

searchInput?.addEventListener("input", () => {
  state.query = searchInput.value;
  render();
});

sortSelect?.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

document.querySelectorAll('input[name="saprPriceMode"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      state.priceMode = input.value;
      render();
    }
  });
});

document.querySelectorAll('input[name="saprSalaryMode"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      state.salaryMode = input.value;
      render();
    }
  });
});

document.querySelectorAll('input[name="saprGrade"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) {
      state.grade = input.value;
      syncGradeChipState();
      render();
    }
  });
});

resultsBody?.addEventListener("change", handleCompareToggle);

applyQueryState();
if (!state.compareIds.length) {
  state.compareIds = data.entries.filter((entry) => entry.compareEnabled && entry.avgPriceEok !== null).slice(0, 3).map((entry) => entry.id);
}
render();




