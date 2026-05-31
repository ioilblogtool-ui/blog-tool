const scenarioButtons = document.querySelectorAll("[data-yfs-scenario-button]");
const scenarioRows = document.querySelectorAll("[data-yfs-scenario-row]");

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-yfs-scenario-button");

    scenarioButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    scenarioRows.forEach((row) => {
      row.classList.toggle("is-active", row.getAttribute("data-yfs-scenario-row") === target);
    });
  });
});
