const dataNode = document.getElementById("wealthProfilesData");
const select = document.getElementById("wealthProfileSelect");

if (dataNode && select) {
  const profiles = JSON.parse(dataNode.textContent || "[]");

  const els = {
    name: document.getElementById("profileName"),
    rank: document.getElementById("profileRank"),
    netWorth: document.getElementById("profileNetWorth"),
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
    imageLicense: document.getElementById("profileImageLicense")
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

  function renderProfile(profile) {
    if (!profile) return;

    if (els.name) els.name.textContent = profile.name;
    if (els.rank) els.rank.textContent = `${profile.rank}위`;
    if (els.netWorth) els.netWorth.textContent = profile.netWorthDisplay;
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

    const hasMbti = Boolean(profile.mbtiEstimate);
    if (els.mbtiBlock) els.mbtiBlock.hidden = !hasMbti;
    if (hasMbti) {
      if (els.mbti) els.mbti.textContent = profile.mbtiEstimate;
      if (els.mbtiConfidence) {
        els.mbtiConfidence.textContent = profile.mbtiConfidence === "medium" ? "중간 신뢰도" : "낮은 신뢰도";
      }
    }
  }

  select.addEventListener("change", (event) => {
    const nextId = event.target.value;
    const nextProfile = profiles.find((profile) => profile.id === nextId);
    renderProfile(nextProfile);
  });

  const initialProfile = profiles.find((profile) => profile.id === select.value) || profiles[0];
  renderProfile(initialProfile);
}
