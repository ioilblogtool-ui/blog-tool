const dataNode = document.getElementById("earningsData");
const select = document.getElementById("earningsCompanySelect");
const resetButton = document.getElementById("resetEarningsBtn");
const copyButton = document.getElementById("copyEarningsLinkBtn");

if (dataNode && select) {
  const companies = JSON.parse(dataNode.textContent || "[]");
  const overviewCards = Array.from(document.querySelectorAll("[data-earnings-trigger]"));
  const barRows = Array.from(document.querySelectorAll("[data-earnings-bar]"));
  const defaultCompanyId = companies.find((item) => item.reported)?.id || companies[0]?.id || "";

  const beatMissLabel = {
    beat: "컨센서스 상회",
    miss: "컨센서스 하회",
    mixed: "엇갈림",
    pending: "발표 전"
  };

  const els = {
    ticker: document.getElementById("companyTicker"),
    name: document.getElementById("companyName"),
    rank: document.getElementById("companyRank"),
    reportDate: document.getElementById("companyReportDate"),
    fiscalLabel: document.getElementById("companyFiscalLabel"),
    revenue: document.getElementById("companyRevenue"),
    revenueBadge: document.getElementById("companyRevenueBadge"),
    eps: document.getElementById("companyEps"),
    epsBadge: document.getElementById("companyEpsBadge"),
    stockReaction: document.getElementById("companyStockReaction"),
    stockNote: document.getElementById("companyStockNote"),
    caveatBox: document.getElementById("companyCaveatBox"),
    caveatText: document.getElementById("companyCaveatText"),
    capexNote: document.getElementById("companyCapexNote"),
    summary: document.getElementById("companySummary"),
    highlights: document.getElementById("companyHighlights"),
    sourceLink: document.getElementById("companySourceLink"),
    sourceName: document.getElementById("companySourceName")
  };

  function setBadge(el, value) {
    if (!el) return;
    el.textContent = beatMissLabel[value] || value;
    el.className = `beg-badge beg-badge--${value}`;
  }

  function renderHighlights(items) {
    if (!els.highlights) return;
    els.highlights.innerHTML = "";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      els.highlights.appendChild(li);
    });
  }

  function updateUrl(companyId) {
    const url = new URL(window.location.href);
    if (companyId && companyId !== defaultCompanyId) {
      url.searchParams.set("company", companyId);
    } else {
      url.searchParams.delete("company");
    }
    window.history.replaceState({}, "", url);
  }

  function renderOverviewCards(selectedId) {
    overviewCards.forEach((card) => {
      const isActive = card.getAttribute("data-earnings-trigger") === selectedId;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderBarRows(selectedId) {
    barRows.forEach((row) => {
      row.classList.toggle("is-active", row.getAttribute("data-earnings-bar") === selectedId);
    });
  }

  function renderCompany(company) {
    if (!company) return;

    if (els.ticker) els.ticker.textContent = company.ticker;
    if (els.name) els.name.textContent = company.nameKr;
    if (els.rank) els.rank.textContent = `${company.rank}위`;
    if (els.reportDate) els.reportDate.textContent = company.reportDateDisplay;
    if (els.fiscalLabel) els.fiscalLabel.textContent = company.fiscalLabel;

    if (els.revenue) {
      els.revenue.textContent = company.reported
        ? `$${company.revenueUsdB}B (+${company.revenueYoyPct}%)`
        : "—";
    }
    setBadge(els.revenueBadge, company.revenueVsConsensus);

    if (els.eps) els.eps.textContent = company.epsDisplay || "—";
    setBadge(els.epsBadge, company.epsVsConsensus);

    if (els.stockReaction) {
      els.stockReaction.textContent =
        company.stockReactionPct !== null
          ? `${company.stockReactionPct > 0 ? "+" : ""}${company.stockReactionPct}%`
          : "—";
    }
    if (els.stockNote) els.stockNote.textContent = company.stockReactionNote || "";

    if (els.caveatBox) {
      const hasCaveat = Boolean(company.epsCaveat);
      els.caveatBox.hidden = !hasCaveat;
      if (els.caveatText) els.caveatText.textContent = company.epsCaveat || "";
    }

    if (els.capexNote) els.capexNote.textContent = company.capexNote || "";
    if (els.summary) els.summary.textContent = company.summary || "";
    renderHighlights(company.highlights);

    if (els.sourceLink) els.sourceLink.setAttribute("href", company.sourceUrl || "#");
    if (els.sourceName) els.sourceName.textContent = company.sourceName || "";

    renderOverviewCards(company.id);
    renderBarRows(company.id);
    updateUrl(company.id);
  }

  function handleCardSelection(id) {
    const nextCompany = companies.find((item) => item.id === id);
    if (!nextCompany) return;
    select.value = nextCompany.id;
    renderCompany(nextCompany);
  }

  overviewCards.forEach((card) => {
    const id = card.getAttribute("data-earnings-trigger");
    if (!id) return;

    card.addEventListener("click", () => {
      handleCardSelection(id);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleCardSelection(id);
    });
  });

  select.addEventListener("change", (event) => {
    const nextCompany = companies.find((item) => item.id === event.target.value);
    renderCompany(nextCompany);
  });

  resetButton?.addEventListener("click", () => {
    const nextCompany = companies.find((item) => item.id === defaultCompanyId) || companies[0];
    if (!nextCompany) return;
    select.value = nextCompany.id;
    renderCompany(nextCompany);
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "링크 복사 완료";
      window.setTimeout(() => {
        copyButton.textContent = "링크 복사";
      }, 1600);
    } catch {
      copyButton.textContent = "복사 실패";
      window.setTimeout(() => {
        copyButton.textContent = "링크 복사";
      }, 1600);
    }
  });

  const url = new URL(window.location.href);
  const initialCompanyId = url.searchParams.get("company") || select.value || defaultCompanyId;
  const initialCompany = companies.find((item) => item.id === initialCompanyId) || companies[0];
  if (initialCompany) {
    select.value = initialCompany.id;
  }
  renderCompany(initialCompany);
}
