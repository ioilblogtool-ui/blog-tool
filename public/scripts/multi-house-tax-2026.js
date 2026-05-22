(function () {
  const tabs = Array.from(document.querySelectorAll("[data-mht-case]"));
  const panels = Array.from(document.querySelectorAll("[data-mht-case-panel]"));

  if (!tabs.length || !panels.length) {
    return;
  }

  const activateCase = (caseId) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.mhtCase === caseId;
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.mhtCasePanel === caseId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateCase(tab.dataset.mhtCase));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      const lastIndex = tabs.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = lastIndex;

      tabs[nextIndex].focus();
      activateCase(tabs[nextIndex].dataset.mhtCase);
    });
  });

  const initial = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  activateCase(initial.dataset.mhtCase);
})();
