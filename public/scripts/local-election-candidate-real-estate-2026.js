// ─────────────────────────────────────────────────────────────────────────────
// 2026 지방선거 후보 부동산 보유 현황 비교
// /reports/local-election-candidate-real-estate-2026/
// ─────────────────────────────────────────────────────────────────────────────

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// ── 설정 로드 ────────────────────────────────────────────────────────────────
const configNode = document.getElementById("lcreData");
if (!configNode) throw new Error("lcreData config missing");

const { candidates, regionCross } = JSON.parse(configNode.textContent || "{}");

// ── 상태 ─────────────────────────────────────────────────────────────────────
const state = {
  query: "",
  sido: "",
  party: "",
  sortKey: "realEstateManwon",
  regionFilter: "all",
  activeTypeTab: "apt",
};

// ── 포맷 유틸 ────────────────────────────────────────────────────────────────
function formatManwon(value) {
  if (value === undefined || value === null) return "확인 필요";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10_000) return `${sign}${(abs / 10_000).toFixed(1).replace(".0", "")}억`;
  return `${sign}${abs.toLocaleString("ko-KR")}만원`;
}

// ── 필터·정렬 ────────────────────────────────────────────────────────────────
function filterCandidates() {
  return candidates.filter((c) => {
    if (state.query) {
      const q = state.query.toLowerCase();
      if (
        !c.candidateName.includes(state.query) &&
        !c.districtName.includes(state.query) &&
        !c.partyName.includes(state.query)
      )
        return false;
    }
    if (state.sido && c.sidoName !== state.sido) return false;
    if (state.party && c.partyName !== state.party) return false;
    return true;
  });
}

function sortCandidates(list, key) {
  return [...list].sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    return bv - av;
  });
}

// ── 렌더: 데스크톱 테이블 ─────────────────────────────────────────────────────
function renderTable(list) {
  const tbody = $("#lcreTableBody");
  if (!tbody) return;

  tbody.innerHTML = list
    .map((c) => {
      const isWithdrawn = c.status !== "등록";
      return `
      <tr class="${isWithdrawn ? "is-withdrawn" : ""}">
        <td class="lcre-rank">#${c.realEstateRank}</td>
        <td>
          <span class="lcre-cand-name">${c.candidateName}</span>
          <span class="lcre-party-badge">${c.partyName}</span>
        </td>
        <td class="lcre-district">${c.districtName}</td>
        <td class="lcre-amount">
          ${formatManwon(c.realEstateManwon)}
          <span class="lcre-badge lcre-badge--assessed">공시가</span>
        </td>
        <td class="lcre-amount lcre-amount--sub">
          ${c.apartmentManwon !== undefined && c.apartmentManwon !== null
            ? formatManwon(c.apartmentManwon)
            : '<span class="lcre-badge lcre-badge--update">세부 제외</span>'}
        </td>
        <td class="lcre-amount lcre-amount--sub">
          ${c.landManwon !== undefined && c.landManwon !== null
            ? formatManwon(c.landManwon)
            : '<span class="lcre-badge lcre-badge--update">세부 제외</span>'}
        </td>
        <td class="lcre-amount lcre-amount--sub">
          ${c.buildingManwon !== undefined && c.buildingManwon !== null
            ? formatManwon(c.buildingManwon)
            : '<span class="lcre-badge lcre-badge--update">세부 제외</span>'}
        </td>
        <td class="lcre-amount">${formatManwon(c.totalAssetsManwon)}</td>
        <td>
          <span class="lcre-status-badge lcre-status--${isWithdrawn ? "withdrawn" : "registered"}">
            ${c.status}
          </span>
        </td>
        <td>
          <a href="${c.sourceUrl}" target="_blank" rel="noopener noreferrer" class="lcre-source-link">원문</a>
        </td>
      </tr>`;
    })
    .join("");
}

// ── 렌더: 모바일 카드 ────────────────────────────────────────────────────────
function renderCards(list) {
  const container = $("#lcreCardList");
  if (!container) return;

  const maxRe = Math.max(...list.map((c) => c.realEstateManwon ?? 0), 1);

  container.innerHTML = list
    .map((c) => {
      const barW = Math.max(Math.round(((c.realEstateManwon ?? 0) / maxRe) * 100), 3);
      const isWithdrawn = c.status !== "등록";
      return `
      <li class="lcre-candidate-card">
        <div class="lcre-candidate-card__header">
          <span class="lcre-rank">#${c.realEstateRank}</span>
          <strong class="lcre-candidate-card__name">${c.candidateName}</strong>
          <span class="lcre-party-badge">${c.partyName}</span>
          <span class="lcre-status-badge lcre-status--${isWithdrawn ? "withdrawn" : "registered"}">${c.status}</span>
        </div>
        <div class="lcre-candidate-card__main">
          <span class="lcre-candidate-card__re-total">${formatManwon(c.realEstateManwon)}</span>
          <span class="lcre-candidate-card__re-label">부동산 신고액</span>
          <span class="lcre-badge lcre-badge--assessed">공시가기준</span>
        </div>
        <div class="lcre-bar-track">
          <div class="lcre-bar-fill" style="width: ${barW}%"></div>
        </div>
        <div class="lcre-candidate-card__grid">
          <div><span>아파트</span><strong>${c.apartmentManwon != null ? formatManwon(c.apartmentManwon) : "세부 제외"}</strong></div>
          <div><span>토지</span><strong>${c.landManwon != null ? formatManwon(c.landManwon) : "세부 제외"}</strong></div>
          <div><span>건물</span><strong>${c.buildingManwon != null ? formatManwon(c.buildingManwon) : "세부 제외"}</strong></div>
          <div><span>총재산</span><strong>${formatManwon(c.totalAssetsManwon)}</strong></div>
        </div>
        <div class="lcre-candidate-card__footer">
          <span>${c.districtName}</span>
          <a href="${c.sourceUrl}" target="_blank" rel="noopener noreferrer">원문 확인</a>
        </div>
      </li>`;
    })
    .join("");
}

// ── 렌더: 결과 수 ─────────────────────────────────────────────────────────────
function updateCount(n) {
  const el = $("#lcreCount");
  if (el) el.textContent = `${n}명 표시 중`;
}

// ── 전체 업데이트 ─────────────────────────────────────────────────────────────
function update() {
  const filtered = filterCandidates();
  const sorted = sortCandidates(filtered, state.sortKey);
  renderTable(sorted);
  renderCards(sorted);
  updateCount(sorted.length);
}

// ── 검색 ─────────────────────────────────────────────────────────────────────
const searchInput = $("#lcreSearch");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim();
    update();
  });
}

// ── 시도 필터 ─────────────────────────────────────────────────────────────────
const sidoSelect = $("#lcreFilterSido");
if (sidoSelect) {
  sidoSelect.addEventListener("change", () => {
    state.sido = sidoSelect.value;
    update();
  });
}

// ── 정당 필터 ─────────────────────────────────────────────────────────────────
const partySelect = $("#lcreFilterParty");
if (partySelect) {
  partySelect.addEventListener("change", () => {
    state.party = partySelect.value;
    update();
  });
}

// ── 정렬 버튼 ─────────────────────────────────────────────────────────────────
$$(".lcre-sort-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.sortKey = btn.dataset.sort;
    $$(".lcre-sort-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    update();
  });
});

// ── 유형별 탭 ─────────────────────────────────────────────────────────────────
$$(".lcre-type-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    $$(".lcre-type-tab").forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");

    $$(".lcre-type-panel").forEach((panel) => {
      panel.hidden = true;
    });
    const targetPanel = $(`#lcreTab${target.charAt(0).toUpperCase() + target.slice(1)}`);
    if (targetPanel) targetPanel.hidden = false;

    state.activeTypeTab = target;
  });
});

// ── 지역 교차 필터 ────────────────────────────────────────────────────────────
function renderRegionTable(filter) {
  const tbody = $("#lcreRegionTable tbody");
  if (!tbody || !regionCross) return;

  const filtered =
    filter === "all"
      ? regionCross
      : filter === "match"
      ? regionCross.filter((r) => r.matchRegion === true)
      : filter === "mismatch"
      ? regionCross.filter((r) => r.matchRegion === false)
      : regionCross.filter((r) => r.matchRegion === null);

  tbody.innerHTML = filtered
    .map((r) => {
      const matchClass =
        r.matchRegion === true
          ? "lcre-match lcre-match--yes"
          : r.matchRegion === false
          ? "lcre-match lcre-match--no"
          : "lcre-match lcre-match--unknown";
      const matchText =
        r.matchRegion === true ? "✓ 일치" : r.matchRegion === false ? "≠ 불일치" : "확인불가";
      return `
      <tr data-match="${r.matchRegion === null ? "unknown" : r.matchRegion ? "match" : "mismatch"}">
        <td>
          <strong>${r.candidateName}</strong>
          <span class="lcre-party-badge">${r.partyName}</span>
        </td>
        <td>${r.runningInSido}</td>
        <td>${r.realEstateRegion}</td>
        <td><span class="${matchClass}">${matchText}</span></td>
        <td class="lcre-amount">${formatManwon(r.realEstateManwon)}</td>
      </tr>`;
    })
    .join("");
}

$$(".lcre-region-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    state.regionFilter = filter;
    $$(".lcre-region-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    renderRegionTable(filter);
  });
});

// ── 초기 렌더 ────────────────────────────────────────────────────────────────
update();
renderRegionTable("all");
