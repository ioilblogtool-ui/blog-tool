const dataNode = document.getElementById("lecar-data");
const tableBody = document.getElementById("lecar-ranking-table-body");
const cardList = document.getElementById("lecar-candidate-list");
const resultCount = document.getElementById("lecar-result-count");
const searchInput = document.getElementById("lecar-search");
const sidoFilter = document.getElementById("lecar-sido-filter");
const electionTypeFilter = document.getElementById("lecar-election-type-filter");
const partyFilter = document.getElementById("lecar-party-filter");
const sortButtons = [...document.querySelectorAll("[data-lecar-sort]")];

const candidates = dataNode ? JSON.parse(dataNode.textContent || "[]") : [];
const state = {
  query: "",
  sido: "all",
  electionType: "all",
  party: "all",
  sortKey: "totalAssetsManwon",
};

const formatManwon = (value) => {
  if (value === undefined || value === null) return "확인 필요";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 10000) return `${sign}${String((abs / 10000).toFixed(1)).replace(".0", "")}억`;
  return `${sign}${abs.toLocaleString("ko-KR")}만원`;
};

const safeText = (value) => String(value ?? "");
const metric = (candidate, key) => {
  if (key === "netAssetsManwon") return candidate.netAssetsManwon ?? candidate.totalAssetsManwon - (candidate.debtsManwon ?? 0);
  return candidate[key] ?? Number.NEGATIVE_INFINITY;
};

const matches = (candidate) => {
  const haystack = [
    candidate.candidateName,
    candidate.partyName,
    candidate.sidoName,
    candidate.electionType,
    candidate.districtName,
  ].map(safeText).join(" ").toLowerCase();
  const queryMatch = !state.query || haystack.includes(state.query.toLowerCase());
  return queryMatch
    && (state.sido === "all" || candidate.sidoName === state.sido)
    && (state.electionType === "all" || candidate.electionType === state.electionType)
    && (state.party === "all" || candidate.partyName === state.party);
};

const renderTable = (items) => {
  if (!tableBody) return;
  tableBody.innerHTML = items.map((candidate) => `
    <tr>
      <td>${candidate.rank}</td>
      <td><strong>${candidate.candidateName}</strong><span>${candidate.sourceLabel}</span></td>
      <td>${candidate.partyName}</td>
      <td>${candidate.sidoName}</td>
      <td>${candidate.electionType}</td>
      <td>${formatManwon(candidate.totalAssetsManwon)}</td>
      <td>${formatManwon(candidate.realEstateManwon)}</td>
      <td>${formatManwon(candidate.depositsManwon)}</td>
      <td>${formatManwon(candidate.securitiesManwon)}</td>
      <td>${formatManwon(candidate.debtsManwon)}</td>
      <td>${formatManwon(metric(candidate, "netAssetsManwon"))}</td>
    </tr>
  `).join("");
};

const renderCards = (items) => {
  if (!cardList) return;
  cardList.innerHTML = items.map((candidate) => `
    <article class="lecar-candidate-card">
      <div>
        <span>TOP ${candidate.rank}</span>
        <h3>${candidate.candidateName}</h3>
        <p>${candidate.partyName} · ${candidate.sidoName} · ${candidate.electionType}</p>
      </div>
      <strong>${formatManwon(candidate.totalAssetsManwon)}</strong>
    </article>
  `).join("");
};

const syncSortButtons = () => {
  sortButtons.forEach((button) => {
    const active = button.dataset.lecarSort === state.sortKey;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

const update = () => {
  const items = candidates
    .filter(matches)
    .sort((a, b) => metric(b, state.sortKey) - metric(a, state.sortKey) || a.rank - b.rank);
  renderTable(items);
  renderCards(items);
  syncSortButtons();
  if (resultCount) resultCount.textContent = `총 ${items.length.toLocaleString("ko-KR")}명 표시 중`;
};

searchInput?.addEventListener("input", (event) => {
  state.query = event.currentTarget.value.trim();
  update();
});
sidoFilter?.addEventListener("change", (event) => {
  state.sido = event.currentTarget.value;
  update();
});
electionTypeFilter?.addEventListener("change", (event) => {
  state.electionType = event.currentTarget.value;
  update();
});
partyFilter?.addEventListener("change", (event) => {
  state.party = event.currentTarget.value;
  update();
});
sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.sortKey = button.dataset.lecarSort;
    update();
  });
});

update();
