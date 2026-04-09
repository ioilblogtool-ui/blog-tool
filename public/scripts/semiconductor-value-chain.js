(function () {
  "use strict";

  const REVENUE_HISTORY = {
    nvda: { unit: "B USD", points: [{ label: "FY22", value: 26.9 }, { label: "FY23", value: 27.0 }, { label: "FY24", value: 60.9 }, { label: "FY25", value: 126.0 }, { label: "FY26", value: 215.9 }] },
    qcom: { unit: "B USD", points: [{ label: "FY20", value: 23.5 }, { label: "FY21", value: 33.6 }, { label: "FY22", value: 44.2 }, { label: "FY23", value: 35.8 }, { label: "FY24", value: 38.7 }] },
    brcm: { unit: "B USD", points: [{ label: "FY20", value: 23.9 }, { label: "FY21", value: 27.5 }, { label: "FY22", value: 33.2 }, { label: "FY23", value: 35.8 }, { label: "FY24", value: 51.6 }] },
    amd: { unit: "B USD", points: [{ label: "2020", value: 9.8 }, { label: "2021", value: 16.4 }, { label: "2022", value: 23.6 }, { label: "2023", value: 22.7 }, { label: "2024", value: 25.8 }] },
    asml: { unit: "B EUR", points: [{ label: "2021", value: 18.6 }, { label: "2022", value: 21.2 }, { label: "2023", value: 27.6 }, { label: "2024", value: 30.6 }, { label: "2025", value: 32.7 }] },
    lrcx: { unit: "B USD", points: [{ label: "FY21", value: 14.6 }, { label: "FY22", value: 17.2 }, { label: "FY23", value: 17.4 }, { label: "FY24", value: 14.3 }, { label: "FY25", value: 18.4 }] },
    klac: { unit: "B USD", points: [{ label: "FY20", value: 5.8 }, { label: "FY21", value: 6.9 }, { label: "FY22", value: 9.2 }, { label: "FY23", value: 10.5 }, { label: "FY24", value: 10.8 }] },
    amat: { unit: "B USD", points: [{ label: "FY20", value: 17.2 }, { label: "FY21", value: 23.1 }, { label: "FY22", value: 25.8 }, { label: "FY23", value: 26.5 }, { label: "FY24", value: 27.2 }] },
    wonik: { unit: "T KRW", points: [{ label: "2020", value: 0.43 }, { label: "2021", value: 1.07 }, { label: "2022", value: 0.98 }, { label: "2023", value: 0.59 }, { label: "2024", value: 0.8 }] },
    tsmc: { unit: "T TWD", points: [{ label: "2021", value: 1.59 }, { label: "2022", value: 2.26 }, { label: "2023", value: 2.16 }, { label: "2024", value: 2.89 }, { label: "2025", value: 3.81 }] },
    samsung: { unit: "T KRW", points: [{ label: "2021", value: 279.6 }, { label: "2022", value: 302.2 }, { label: "2023", value: 258.9 }, { label: "2024", value: 170.4 }, { label: "2025", value: 333.6 }] },
    skhynix: { unit: "T KRW", points: [{ label: "2021", value: 42.9 }, { label: "2022", value: 44.6 }, { label: "2023", value: 32.7 }, { label: "2024", value: 46.5 }, { label: "2025", value: 97.1 }] },
    micron: { unit: "B USD", points: [{ label: "FY20", value: 21.4 }, { label: "FY21", value: 27.7 }, { label: "FY22", value: 30.8 }, { label: "FY23", value: 15.5 }, { label: "FY24", value: 38.8 }] },
    hms: { unit: "T KRW", points: [{ label: "2020", value: 0.26 }, { label: "2021", value: 0.38 }, { label: "2022", value: 0.33 }, { label: "2023", value: 0.16 }, { label: "2024", value: 0.7 }] },
    amkor: { unit: "B USD", points: [{ label: "2020", value: 5.0 }, { label: "2021", value: 6.0 }, { label: "2022", value: 7.1 }, { label: "2023", value: 6.5 }, { label: "2024", value: 7.1 }] },
    speta: { unit: "T KRW", points: [{ label: "2020", value: 0.32 }, { label: "2021", value: 0.39 }, { label: "2022", value: 0.47 }, { label: "2023", value: 0.58 }, { label: "2024", value: 0.5 }] },
    isc: { unit: "T KRW", points: [{ label: "2020", value: 0.15 }, { label: "2021", value: 0.17 }, { label: "2022", value: 0.2 }, { label: "2023", value: 0.17 }, { label: "2024", value: 0.25 }] },
    lino: { unit: "T KRW", points: [{ label: "2020", value: 0.21 }, { label: "2021", value: 0.24 }, { label: "2022", value: 0.28 }, { label: "2023", value: 0.33 }, { label: "2024", value: 0.4 }] },
    okins: { unit: "T KRW", points: [{ label: "2020", value: 0.08 }, { label: "2021", value: 0.09 }, { label: "2022", value: 0.11 }, { label: "2023", value: 0.1 }, { label: "2024", value: 0.15 }] },
  };

  const dataEl = document.getElementById("vc-data");
  if (!dataEl) return;

  let steps = [];
  let companies = [];
  let usdKrw = 1360;

  try {
    const parsed = JSON.parse(dataEl.textContent || "{}");
    steps = parsed.steps || [];
    companies = parsed.companies || [];
    usdKrw = parsed.usdKrw || 1360;
  } catch {
    return;
  }

  function getStep(id) {
    return steps.find((step) => step.id === id) || null;
  }

  function getCompany(id) {
    return companies.find((company) => company.id === id) || null;
  }

  function getCompaniesForStep(stepId) {
    const step = getStep(stepId);
    if (!step) return [];
    return step.companyIds.map(getCompany).filter(Boolean);
  }

  function formatKrwFromUsd(amountUsd) {
    const trillion = (amountUsd * usdKrw) / 1e12;
    const rounded = trillion >= 100 ? Math.round(trillion) : Number(trillion.toFixed(1));
    return `${rounded.toLocaleString("ko-KR")}조원`;
  }

  function strengthDots(value) {
    return "★".repeat(value) + "☆".repeat(5 - value);
  }

  function strongerSide(step) {
    if (step.usStrength === step.krStrength) return "미국·한국 비슷";
    return step.usStrength > step.krStrength ? "미국 우위" : "한국 우위";
  }

  function isDomesticEtfName(name) {
    return /^(RISE|ACE|TIGER)/.test(name);
  }

  function badges(items, className) {
    if (!items || items.length === 0) {
      return `<span class="${className} ${className}--empty">없음</span>`;
    }
    return items.map((item) => `<span class="${className}">${item}</span>`).join("");
  }

  function renderFactCard(label, value, subvalue) {
    return `
      <div class="vc-stat-card">
        <dt>${label}</dt>
        <dd>${value}</dd>
        ${subvalue ? `<p>${subvalue}</p>` : ""}
      </div>
    `;
  }

  function renderRevenueMiniChart(companyId) {
    const history = REVENUE_HISTORY[companyId];
    if (!history) return "";

    const width = 160;
    const height = 44;
    const paddingX = 10;
    const paddingY = 10;
    const values = history.points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = history.points.map((point, index) => {
      const x = paddingX + (index * (width - paddingX * 2)) / (history.points.length - 1);
      const y = height - paddingY - ((point.value - min) / range) * (height - paddingY * 2);
      return { ...point, x, y };
    });

    const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
    const start = history.points[0].value;
    const end = history.points[history.points.length - 1].value;
    const growth = start > 0 ? (((end - start) / start) * 100).toFixed(0) : "0";

    return `
      <div class="vc-revenue-chart-card">
        <div class="vc-revenue-chart-head">
          <span>${history.points[0].label} → ${history.points[history.points.length - 1].label} · ${history.unit}</span>
          <strong>${growth >= 0 ? "+" : ""}${growth}%</strong>
        </div>
        <svg class="vc-revenue-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
          <polyline class="vc-revenue-chart__line" points="${polyline}"></polyline>
          ${points.map((point) => `<circle class="vc-revenue-chart__dot" cx="${point.x}" cy="${point.y}" r="3"></circle>`).join("")}
        </svg>
        <div class="vc-revenue-chart-labels">
          <span>${history.points[0].label}</span>
          <span>${history.points[history.points.length - 1].label}</span>
      </div>
    `;
  }

  function renderStepPanel(step) {
    const stepCompanies = getCompaniesForStep(step.id);
    const stepCapUsd = stepCompanies.reduce((sum, company) => sum + company.marketCapUsd, 0);

    return `
      <div class="vc-panel-step">
        <div class="vc-panel-header">
          <span class="vc-panel-num">${step.num}</span>
          <h3 class="vc-panel-title">${step.name}</h3>
          <span class="vc-panel-en">${step.nameEn}</span>
        </div>
        <p class="vc-panel-desc">${step.fullDesc}</p>
        <div class="vc-panel-stat-grid">
          ${renderFactCard("추적 시총", `약 ${formatKrwFromUsd(stepCapUsd)}`, `${stepCompanies.length}개 대표 기업 기준`)}
          ${renderFactCard("강한 국가", strongerSide(step), `미국 ${strengthDots(step.usStrength)} · 한국 ${strengthDots(step.krStrength)}`)}
        </div>
        <div class="vc-panel-myth">
          <p class="vc-panel-myth__label">자주 하는 오해</p>
          <p class="vc-panel-myth__claim">"${step.myth.claim}"</p>
          <p class="vc-panel-myth__fact">→ ${step.myth.fact}</p>
        </div>
        <div class="vc-panel-chip-group">
          ${badges(stepCompanies.map((company) => company.name), "vc-chip")}
        </div>
      </div>
    `;
  }

  function renderCompanyPanel(company) {
    const step = getStep(company.stepId);
    const domesticEtfs = company.etfs.filter(isDomesticEtfName);
    const globalEtfs = company.etfs.filter((name) => !isDomesticEtfName(name));
    const panelClass = company.country === "KR" ? "vc-panel-company vc-panel-company--kr" : "vc-panel-company";

    const revenueCard = company.revenue
      ? renderFactCard(
          "최근 매출",
          `${company.revenue.value}`,
          `${company.revenue.period}${company.revenue.krwApprox ? ` · ${company.revenue.krwApprox}` : ""}${company.revenue.growth ? ` · ${company.revenue.growth}` : ""}`
        )
      : "";
    const opCard = company.operatingIncome
      ? renderFactCard(
          "영업이익",
          `${company.operatingIncome.value}`,
          `${company.operatingIncome.krwApprox ? `${company.operatingIncome.krwApprox} · ` : ""}${company.operatingIncome.margin ? `마진 ${company.operatingIncome.margin}` : ""}${company.operatingIncome.growth ? ` · ${company.operatingIncome.growth}` : ""}`
        )
      : "";
    const employeeCard = company.employees
      ? renderFactCard(
          "임직원 수",
          `${company.employees.value}`,
          `${company.employees.growth5y ? `5년간 ${company.employees.growth5y}` : "최근 공시 기준"}`
        )
      : "";

    return `
      <div class="${panelClass}">
        <div class="vc-panel-header">
          <span class="vc-panel-flag">${company.flag}</span>
          <h3 class="vc-panel-title">${company.name}</h3>
          <span class="vc-panel-ticker">${company.ticker}</span>
          ${step ? `<span class="vc-panel-step-badge">${step.name}</span>` : ""}
          ${company.country === "KR" ? `<span class="vc-panel-country-badge">한국 상장</span>` : ""}
        </div>
        <p class="vc-panel-segment">${company.segment}</p>
        <div class="vc-panel-marketcap">
          <strong>${company.marketCapKrwDisplay}</strong>
          <span>${company.marketCapDisplay}</span>
        </div>
        <div class="vc-panel-stat-grid">
          ${renderFactCard("업력", company.ageLabel, company.hq)}
          ${revenueCard}
          ${opCard}
          ${employeeCard}
        </div>
        <p class="vc-panel-role">${company.roleDesc}</p>
        <div class="vc-panel-section">
          <p class="vc-panel-section__title">5년 매출 추이</p>
          ${renderRevenueMiniChart(company.id)}
        </div>
        <div class="vc-panel-why">
          <p class="vc-panel-why__label">왜 중요할까</p>
          <p>${company.whyItMatters}</p>
        </div>
        <div class="vc-panel-note">
          <p class="vc-panel-note__label">규모 체감</p>
          <p>${company.scaleNote}</p>
        </div>
        <div class="vc-panel-section">
          <p class="vc-panel-section__title">5개년 성장 포인트</p>
          <div class="vc-panel-growth-grid">
            ${company.growth5y.map((item) => `
              <div class="vc-growth-card">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="vc-panel-section">
          <p class="vc-panel-section__title">실적을 움직이는 수요 축</p>
          <div class="vc-panel-chip-group">
            ${badges(company.demandDrivers, "vc-chip vc-chip--driver")}
          </div>
        </div>
        ${domesticEtfs.length > 0 ? `
          <div class="vc-panel-section">
            <p class="vc-panel-section__title">국내 ETF로 바로 보기</p>
            <div class="vc-panel-chip-group">
              ${domesticEtfs.map((name) => `<a class="vc-etf-link vc-etf-link--kr" href="../semiconductor-etf-2026/" title="${name} ETF 비교 페이지로 이동">${name}</a>`).join("")}
            </div>
          </div>
        ` : ""}
        <div class="vc-panel-etfs">
          <span class="vc-panel-etfs__label">기타 편입 ETF</span>
          ${badges(globalEtfs, "vc-etf-badge")}
        </div>
      </div>
    `;
  }

  const filterRow = document.getElementById("vcFilterRow");
  const detailPanel = document.getElementById("vcDetailPanel");
  const detailContent = document.getElementById("vcDetailContent");
  const closeBtn = document.getElementById("vcDetailClose");
  const flowGrid = document.getElementById("vcFlowGrid");

  if (!filterRow || !detailPanel || !detailContent || !closeBtn || !flowGrid) return;

  let activeStepId = null;
  let activeCompanyId = null;

  function openPanel(html) {
    detailContent.innerHTML = html;
    detailPanel.classList.remove("is-hidden");
    detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function clearActiveState() {
    flowGrid.querySelectorAll(".vc-step-header.is-active").forEach((el) => el.classList.remove("is-active"));
    flowGrid.querySelectorAll(".vc-company-btn.is-active").forEach((el) => el.classList.remove("is-active"));
    flowGrid.querySelectorAll(".vc-step-header").forEach((el) => el.setAttribute("aria-expanded", "false"));
  }

  function closePanel() {
    detailPanel.classList.add("is-hidden");
    detailContent.innerHTML = "";
    activeStepId = null;
    activeCompanyId = null;
    clearActiveState();
  }

  flowGrid.addEventListener("click", function (event) {
    const stepButton = event.target.closest(".vc-step-header[data-step]");
    if (stepButton) {
      const stepId = stepButton.dataset.step;
      if (activeStepId === stepId) {
        closePanel();
        return;
      }

      clearActiveState();
      activeStepId = stepId;
      activeCompanyId = null;
      stepButton.classList.add("is-active");
      stepButton.setAttribute("aria-expanded", "true");

      const step = getStep(stepId);
      if (step) openPanel(renderStepPanel(step));
      return;
    }

    const companyButton = event.target.closest(".vc-company-btn[data-company-id]");
    if (companyButton) {
      const companyId = companyButton.dataset.companyId;
      if (activeCompanyId === companyId) {
        closePanel();
        return;
      }

      clearActiveState();
      activeCompanyId = companyId;
      activeStepId = null;
      companyButton.classList.add("is-active");

      const company = getCompany(companyId);
      if (company) openPanel(renderCompanyPanel(company));
    }
  });

  closeBtn.addEventListener("click", closePanel);

  filterRow.addEventListener("click", function (event) {
    const button = event.target.closest(".vc-filter-btn[data-filter]");
    if (!button) return;

    const filter = button.dataset.filter;
    filterRow.querySelectorAll(".vc-filter-btn").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    flowGrid.querySelectorAll(".vc-company-btn[data-country]").forEach((item) => {
      const country = item.dataset.country;
      if (filter === "all" || country === filter) {
        item.classList.remove("is-dimmed");
      } else {
        item.classList.add("is-dimmed");
      }
    });
  });
})();


