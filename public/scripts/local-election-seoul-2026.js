(function () {
  const dataScript = document.getElementById("seoulElectionData");
  if (!dataScript) return;

  const districts = JSON.parse(dataScript.textContent || "[]");
  const districtMap = new Map(districts.map((district) => [district.districtId, district]));
  const panel = document.getElementById("seoulElectionPanel");
  const tooltip = document.getElementById("seoulElectionTooltip");
  const searchInput = document.getElementById("seoulDistrictSearch");
  const searchButton = document.getElementById("seoulDistrictSearchButton");
  const interactiveNodes = document.querySelectorAll("[data-district-id]");

  const partyClass = (party) => {
    if (party === "더불어민주당") return "dem";
    if (party === "국민의힘") return "ppp";
    return "other";
  };

  const formatVoteShare = (voteShare) => (
    typeof voteShare === "number" && voteShare > 0 ? `${voteShare.toFixed(2)}%` : "확정대기"
  );

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const renderPanel = (district) => {
    if (!panel || !district) return;
    const cls = partyClass(district.elected.party);
    const tags = district.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    const pledges = district.pledges.map((pledge) => `
      <article class="seoul-election-panel__pledge">
        <span>${escapeHtml(pledge.category)}</span>
        <strong>${escapeHtml(pledge.title)}</strong>
        <p>${escapeHtml(pledge.description)}</p>
      </article>
    `).join("");
    const career = district.career.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

    panel.innerHTML = `
      <p class="seoul-election-panel__eyebrow">선택된 구</p>
      <h3>${escapeHtml(district.districtName)}</h3>
      <div class="seoul-election-party-pill seoul-election-party-pill--${cls}">${escapeHtml(district.elected.party)}</div>
      <dl class="seoul-election-panel__facts">
        <div><dt>당선자</dt><dd>${escapeHtml(district.elected.name)}</dd></div>
        <div><dt>득표율</dt><dd>${escapeHtml(formatVoteShare(district.elected.voteShare))}</dd></div>
        <div><dt>상태</dt><dd>${escapeHtml(district.elected.badge)}</dd></div>
        <div><dt>2022년 대비</dt><dd>${district.isPartyFlip ? "정당 교체" : "정당 유지"}</dd></div>
        <div><dt>인구 규모</dt><dd>${escapeHtml(district.population)}</dd></div>
      </dl>
      <div class="seoul-election-panel__tags">${tags}</div>
      <div class="seoul-election-panel__career">
        <strong>이력 확인 상태</strong>
        <ul>${career}</ul>
      </div>
      <div class="seoul-election-panel__pledges">${pledges}</div>
      <p class="seoul-election-panel__note">${escapeHtml(district.noteDate)} 기준. 공식 원문 확인 후 후보별 세부 수치를 보강합니다.</p>
    `;
  };

  const setActive = (districtId, options = {}) => {
    const district = districtMap.get(districtId);
    if (!district) return;

    interactiveNodes.forEach((node) => {
      node.classList.toggle("is-active", node.dataset.districtId === districtId);
    });

    renderPanel(district);
    if (searchInput) searchInput.value = district.districtName;

    if (!options.skipHash) {
      history.replaceState(null, "", `#${districtId}`);
    }
  };

  const findDistrict = (query) => {
    const normalized = String(query || "").trim().replace(/\s/g, "");
    if (!normalized) return null;
    return districts.find((district) => {
      const full = district.districtName.replace(/\s/g, "");
      const short = district.districtShort.replace(/\s/g, "");
      return full === normalized || short === normalized || full.includes(normalized) || short.includes(normalized);
    }) || null;
  };

  const runSearch = () => {
    const district = findDistrict(searchInput ? searchInput.value : "");
    if (district) {
      setActive(district.districtId);
      document.getElementById(`seoul-district-${district.districtId}`)?.focus({ preventScroll: true });
      return;
    }
    if (searchInput) {
      searchInput.setAttribute("aria-invalid", "true");
      window.setTimeout(() => searchInput.removeAttribute("aria-invalid"), 1200);
    }
  };

  interactiveNodes.forEach((node) => {
    const districtId = node.dataset.districtId;
    node.addEventListener("click", () => setActive(districtId));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActive(districtId);
      }
    });
  });

  document.querySelectorAll(".seoul-election-map__district").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      const district = districtMap.get(node.dataset.districtId);
      if (!tooltip || !district) return;
      tooltip.innerHTML = `<strong>${escapeHtml(district.districtName)}</strong><span>${escapeHtml(district.elected.party)}</span>`;
      tooltip.setAttribute("aria-hidden", "false");
    });
    node.addEventListener("mousemove", (event) => {
      if (!tooltip) return;
      tooltip.style.left = `${event.offsetX + 14}px`;
      tooltip.style.top = `${event.offsetY + 14}px`;
    });
    node.addEventListener("mouseleave", () => {
      if (!tooltip) return;
      tooltip.setAttribute("aria-hidden", "true");
    });
  });

  if (searchButton) searchButton.addEventListener("click", runSearch);
  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runSearch();
      }
    });
    searchInput.addEventListener("input", () => {
      const district = findDistrict(searchInput.value);
      if (district && searchInput.value.replace(/\s/g, "").length >= 2) {
        setActive(district.districtId);
      }
    });
  }

  const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
  if (districtMap.has(hashId)) {
    setActive(hashId, { skipHash: true });
  } else {
    setActive("gangnam", { skipHash: true });
  }
})();
