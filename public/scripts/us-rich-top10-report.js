import { buildDefaultOptions, makeLabelPlugin } from "./chart-config.js";

const dataNode = document.getElementById("wealthProfilesData");
const select = document.getElementById("wealthProfileSelect");
const resetButton = document.getElementById("resetUsRichProfileBtn");
const copyButton = document.getElementById("copyUsRichProfileLinkBtn");

if (dataNode && select) {
  const profiles = JSON.parse(dataNode.textContent || "[]");
  const overviewCards = Array.from(document.querySelectorAll("[data-profile-trigger]"));
  const totalNetWorthUsdB = profiles.reduce((sum, profile) => sum + (Number(profile.netWorthUsdB) || 0), 0);
  const defaultProfileId = profiles[0]?.id || "";
  let overviewChartInstance = null;

  const els = {
    name: document.getElementById("profileName"),
    rank: document.getElementById("profileRank"),
    netWorth: document.getElementById("profileNetWorth"),
    shareOfTop10: document.getElementById("profileShareOfTop10"),
    primaryCompany: document.getElementById("profilePrimaryCompany"),
    sector: document.getElementById("profileSector"),
    education: document.getElementById("profileEducation"),
    founderType: document.getElementById("profileFounderType"),
    style: document.getElementById("profileStyle"),
    companies: document.getElementById("profileCompanies"),
    tags: document.getElementById("profileTags"),
    mbtiBlock: document.getElementById("mbtiBlock"),
    mbti: document.getElementById("profileMbti"),
    mbtiConfidence: document.getElementById("profileMbtiConfidence"),
    summary: document.getElementById("profileSummary"),
    highlights: document.getElementById("profileHighlights"),
    imageBlock: document.getElementById("profileImageBlock"),
    image: document.getElementById("profileImage"),
    imageSourceLink: document.getElementById("profileImageSourceLink"),
    imageLicense: document.getElementById("profileImageLicense"),
    funNetWorthKrw: document.getElementById("funNetWorthKrw"),
    funApartmentUnits: document.getElementById("funApartmentUnits"),
    funGrandeurUnits: document.getElementById("funGrandeurUnits"),
    funSalaryYears: document.getElementById("funSalaryYears")
  };

  const founderTypeMap = {
    founder: "창업형",
    cofounder: "공동창업형",
    operator: "운영형",
    investor: "투자형"
  };

  const styleMap = {
    startup: "스타트업형",
    ownership: "지분보유형",
    investment: "투자형",
    mixed: "혼합형"
  };

  const funConversionConfig = {
    usdToKrw: 1380,
    apartmentPriceKrw: 1800000000,
    grandeurPriceKrw: 50000000,
    annualSalaryReferenceKrw: 100000000
  };

  function formatLargeKrw(value) {
    const jo = 1000000000000;
    const eok = 100000000;

    if (value >= jo) {
      return `약 ${(value / jo).toFixed(1)}조 원`;
    }

    if (value >= eok) {
      return `약 ${(value / eok).toFixed(0)}억 원`;
    }

    return `약 ${Math.round(value).toLocaleString("ko-KR")}원`;
  }

  function formatLargeCount(value, unit) {
    if (value >= 10000) {
      return `약 ${Math.round(value).toLocaleString("ko-KR")}${unit}`;
    }

    return `약 ${value.toFixed(1)}${unit}`;
  }

  function updateUrl(profileId) {
    const url = new URL(window.location.href);
    if (profileId && profileId !== defaultProfileId) {
      url.searchParams.set("profile", profileId);
    } else {
      url.searchParams.delete("profile");
    }
    window.history.replaceState({}, "", url);
  }

  function renderTags(tags) {
    if (!els.tags) return;
    els.tags.innerHTML = "";
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      els.tags.appendChild(chip);
    });
  }

  function renderHighlights(items) {
    if (!els.highlights) return;
    els.highlights.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      els.highlights.appendChild(li);
    });
  }

  function attachFallback(image) {
    if (!els.image) return;

    els.image.onerror = null;

    if (!image || !image.fallbackSrc) {
      return;
    }

    els.image.onerror = () => {
      if (els.image && els.image.getAttribute("src") !== image.fallbackSrc) {
        els.image.setAttribute("src", image.fallbackSrc);
        els.image.onerror = null;
      }
    };
  }

  function renderImage(image) {
    const hasImage = Boolean(image && image.src);

    if (els.imageBlock) {
      els.imageBlock.hidden = !hasImage;
    }

    if (!hasImage) {
      if (els.image) {
        els.image.removeAttribute("src");
        els.image.setAttribute("alt", "");
        els.image.onerror = null;
      }
      if (els.imageSourceLink) {
        els.imageSourceLink.removeAttribute("href");
        els.imageSourceLink.textContent = "";
      }
      if (els.imageLicense) {
        els.imageLicense.textContent = "";
      }
      return;
    }

    if (els.image) {
      els.image.setAttribute("src", image.src);
      els.image.setAttribute("alt", image.alt || "");
      attachFallback(image);
    }

    if (els.imageSourceLink) {
      els.imageSourceLink.setAttribute("href", image.sourceUrl || "#");
      els.imageSourceLink.textContent = image.sourceName || "출처";
    }

    if (els.imageLicense) {
      els.imageLicense.textContent = image.licenseLabel || "";
    }
  }

  function renderFunConversion(profile) {
    const netWorthKrw = profile.netWorthUsdB * 1000000000 * funConversionConfig.usdToKrw;
    const apartmentUnits = netWorthKrw / funConversionConfig.apartmentPriceKrw;
    const grandeurUnits = netWorthKrw / funConversionConfig.grandeurPriceKrw;
    const salaryYears = netWorthKrw / funConversionConfig.annualSalaryReferenceKrw;

    if (els.funNetWorthKrw) {
      els.funNetWorthKrw.textContent = formatLargeKrw(netWorthKrw);
    }

    if (els.funApartmentUnits) {
      els.funApartmentUnits.textContent = formatLargeCount(apartmentUnits, "채 수준");
    }

    if (els.funGrandeurUnits) {
      els.funGrandeurUnits.textContent = formatLargeCount(grandeurUnits, "대 수준");
    }

    if (els.funSalaryYears) {
      els.funSalaryYears.textContent = formatLargeCount(salaryYears, "년치");
    }
  }

  function renderOverviewCards(selectedId) {
    overviewCards.forEach((card) => {
      const isActive = card.getAttribute("data-profile-trigger") === selectedId;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderOverviewChart(selectedId) {
    const canvas = document.getElementById("usRichOverviewCanvas");
    if (!canvas || !window.Chart) return;

    if (overviewChartInstance) {
      overviewChartInstance.destroy();
      overviewChartInstance = null;
    }

    const selectedIndex = profiles.findIndex((profile) => profile.id === selectedId);
    const backgroundColors = profiles.map((_, index) =>
      index === selectedIndex ? "rgba(15, 110, 86, 0.88)" : "rgba(15, 110, 86, 0.16)"
    );
    const borderColors = profiles.map((_, index) =>
      index === selectedIndex ? "rgba(15, 110, 86, 1)" : "rgba(15, 110, 86, 0.28)"
    );

    overviewChartInstance = new window.Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: profiles.map((profile) => `${profile.rank}위 ${profile.name}`),
        datasets: [
          {
            data: profiles.map((profile) => profile.netWorthUsdB),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 26
          }
        ]
      },
      options: buildDefaultOptions({
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              label(context) {
                const profile = profiles[context.dataIndex];
                const share = Math.round((profile.netWorthUsdB / totalNetWorthUsdB) * 100);
                return [`$${profile.netWorthUsdB}B`, `${profile.sector}`, `TOP 10 대비 ${share}%`];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "rgba(148, 163, 184, 0.15)" },
            ticks: {
              callback: (value) => `$${value}B`
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12 } }
          }
        },
        onHover(event, elements) {
          canvas.style.cursor = elements.length > 0 ? "pointer" : "default";
        },
        onClick(event, elements) {
          if (!elements.length) return;
          const nextProfile = profiles[elements[0].index];
          if (!nextProfile) return;
          select.value = nextProfile.id;
          renderProfile(nextProfile);
        }
      }),
      plugins: [makeLabelPlugin((value) => `$${value}B`)]
    });
  }

  function renderProfile(profile) {
    if (!profile) return;

    if (els.name) els.name.textContent = profile.name;
    if (els.rank) els.rank.textContent = `${profile.rank}위`;
    if (els.netWorth) els.netWorth.textContent = profile.netWorthDisplay;
    if (els.shareOfTop10) {
      const share = Math.round((profile.netWorthUsdB / totalNetWorthUsdB) * 100);
      els.shareOfTop10.textContent = `TOP 10 합산 자산의 약 ${share}%`;
    }
    if (els.primaryCompany) els.primaryCompany.textContent = profile.primaryCompany;
    if (els.sector) els.sector.textContent = profile.sector;
    if (els.education) els.education.textContent = profile.education.join(" · ");
    if (els.founderType) els.founderType.textContent = founderTypeMap[profile.founderType] || profile.founderType;
    if (els.style) els.style.textContent = styleMap[profile.selfMadeStyle] || profile.selfMadeStyle;
    if (els.companies) els.companies.textContent = profile.companies.join(" / ");
    if (els.summary) els.summary.textContent = profile.summary;

    renderTags(profile.personalityTags || []);
    renderHighlights(profile.highlights || []);
    renderImage(profile.image);
    renderFunConversion(profile);
    renderOverviewCards(profile.id);
    renderOverviewChart(profile.id);
    updateUrl(profile.id);

    const hasMbti = Boolean(profile.mbtiEstimate);
    if (els.mbtiBlock) els.mbtiBlock.hidden = !hasMbti;
    if (hasMbti) {
      if (els.mbti) els.mbti.textContent = profile.mbtiEstimate;
      if (els.mbtiConfidence) {
        els.mbtiConfidence.textContent = profile.mbtiConfidence === "medium" ? "중간 신뢰도" : "낮은 신뢰도";
      }
    }
  }

  function handleCardSelection(id) {
    const nextProfile = profiles.find((profile) => profile.id === id);
    if (!nextProfile) return;
    select.value = nextProfile.id;
    renderProfile(nextProfile);
  }

  overviewCards.forEach((card) => {
    const id = card.getAttribute("data-profile-trigger");
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
    const nextId = event.target.value;
    const nextProfile = profiles.find((profile) => profile.id === nextId);
    renderProfile(nextProfile);
  });

  resetButton?.addEventListener("click", () => {
    const nextProfile = profiles.find((profile) => profile.id === defaultProfileId) || profiles[0];
    if (!nextProfile) return;
    select.value = nextProfile.id;
    renderProfile(nextProfile);
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
  const initialProfileId = url.searchParams.get("profile") || select.value || defaultProfileId;
  const initialProfile = profiles.find((profile) => profile.id === initialProfileId) || profiles[0];
  if (initialProfile) {
    select.value = initialProfile.id;
  }
  renderProfile(initialProfile);
}
