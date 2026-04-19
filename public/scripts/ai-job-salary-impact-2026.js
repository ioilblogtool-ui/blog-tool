const dataNode = document.getElementById("aiJobSalaryImpact2026Data");
const report = dataNode ? JSON.parse(dataNode.textContent || "{}") : null;

if (report) {
  const state = {
    activeFilter: new URLSearchParams(window.location.search).get("filter") || "all",
    selectedJobId: new URLSearchParams(window.location.search).get("job") || report.jobImpactRows[0]?.id,
  };

  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const jobCards = Array.from(document.querySelectorAll("[data-job-id]"));
  const jobSelect = document.getElementById("ajsJobSelect");
  const checklist = document.getElementById("ajsChecklist");
  const chartCanvas = document.getElementById("ajsGapChart");
  let gapChart = null;

  const getJob = (id) => report.jobImpactRows.find((job) => job.id === id) || report.jobImpactRows[0];
  const getGap = (id) => report.gapCompareRows.find((row) => row.id === id) || report.gapCompareRows[0];

  const updateUrl = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("job", state.selectedJobId);
    params.set("filter", state.activeFilter);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  const renderSelectedJob = () => {
    const job = getJob(state.selectedJobId);
    const gap = getGap(state.selectedJobId);

    setText("ajsSelectedName", job.name);
    setText("ajsSelectedSummary", job.summary);
    setText("ajsSelectedBand", job.salaryBand2026);
    setText("ajsSelectedPremium", job.aiPremiumRange);
    setText("ajsGapSummary", gap.summary);

    const whyList = document.getElementById("ajsSelectedWhy");
    if (whyList) {
      whyList.innerHTML = job.why.map((item) => `<li>${item}</li>`).join("");
    }

    const signalList = document.getElementById("ajsSelectedSignals");
    if (signalList) {
      signalList.innerHTML = job.negotiationSignals.map((item) => `<span>${item}</span>`).join("");
    }

    if (jobSelect) jobSelect.value = job.id;

    jobCards.forEach((card) => {
      card.classList.toggle("is-active", card.getAttribute("data-job-id") === job.id);
    });

    if (gapChart) {
      gapChart.data.datasets[0].data = [gap.aiUserSalaryIndex, gap.productivityIndex, gap.negotiationPowerIndex];
      gapChart.data.datasets[1].data = [gap.nonAiSalaryIndex, 100, 100];
      gapChart.options.plugins.title.text = `${gap.jobName} 인덱스 비교`;
      gapChart.update();
    }
  };

  const renderFilter = () => {
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-filter") === state.activeFilter);
    });

    let firstVisibleId = "";
    jobCards.forEach((card) => {
      const tags = card.getAttribute("data-filter-tags") || "";
      const visible = state.activeFilter === "all" || tags.split(/\s+/).includes(state.activeFilter);
      card.hidden = !visible;
      if (visible && !firstVisibleId) firstVisibleId = card.getAttribute("data-job-id") || "";
    });

    if (jobSelect) {
      Array.from(jobSelect.options).forEach((option) => {
        const job = getJob(option.value);
        option.hidden = state.activeFilter !== "all" && !job.filterTags.includes(state.activeFilter);
      });
    }

    const currentCard = jobCards.find((card) => card.getAttribute("data-job-id") === state.selectedJobId);
    if (currentCard?.hidden && firstVisibleId) {
      state.selectedJobId = firstVisibleId;
    }
    renderSelectedJob();
  };

  const renderChecklist = () => {
    if (!checklist) return;
    const score = Array.from(checklist.querySelectorAll("input:checked")).reduce(
      (sum, input) => sum + Number(input.value || 0),
      0,
    );
    const cta =
      score >= 8
        ? {
            title: "연봉 인상·협상 계산기로 바로 넘어가세요",
            body: "성과 근거가 충분한 편입니다. 인상률별 실수령 차이와 제안 연봉 차이를 계산해 협상 범위를 잡아보세요.",
            href: "/tools/negotiation/",
          }
        : score >= 4
          ? {
              title: "AI 스택 비용을 먼저 정리해보세요",
              body: "AI 활용 근거가 쌓이는 중입니다. 도구 조합과 구독 비용을 정리해 업무 ROI를 설명할 준비를 하세요.",
              href: "/tools/ai-stack-cost-calculator/",
            }
          : {
              title: "AI 시급/ROI부터 계산해보세요",
              body: "아직 성과 근거가 약한 단계입니다. 먼저 줄인 시간과 비용 효과를 숫자로 바꿔보는 편이 좋습니다.",
              href: "/tools/ai-automation-hourly-roi/",
            };

    setText("ajsCtaTitle", cta.title);
    setText("ajsCtaBody", cta.body);
    setText("ajsChecklistScore", `${score}점`);

    const link = document.getElementById("ajsCtaLink");
    if (link) link.setAttribute("href", cta.href);
  };

  const initChart = () => {
    if (!chartCanvas || !window.Chart) return;
    const gap = getGap(state.selectedJobId);
    gapChart = new window.Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: ["연봉", "생산성", "협상력"],
        datasets: [
          {
            label: "AI 활용자",
            data: [gap.aiUserSalaryIndex, gap.productivityIndex, gap.negotiationPowerIndex],
            backgroundColor: "#0f766e",
            borderRadius: 8,
          },
          {
            label: "비활용자 기준",
            data: [gap.nonAiSalaryIndex, 100, 100],
            backgroundColor: "#cbd5e1",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: `${gap.jobName} 인덱스 비교`,
            color: "#162033",
            font: { weight: "700" },
          },
        },
        scales: {
          y: {
            min: 80,
            max: 150,
            ticks: { callback: (value) => `${value}` },
            grid: { color: "rgba(148, 163, 184, 0.22)" },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.getAttribute("data-filter") || "all";
      renderFilter();
      updateUrl();
    });
  });

  jobCards.forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedJobId = card.getAttribute("data-job-id") || state.selectedJobId;
      renderSelectedJob();
      updateUrl();
    });
  });

  jobSelect?.addEventListener("change", () => {
    state.selectedJobId = jobSelect.value;
    renderSelectedJob();
    updateUrl();
  });

  checklist?.addEventListener("change", renderChecklist);

  initChart();
  renderFilter();
  renderChecklist();
}

