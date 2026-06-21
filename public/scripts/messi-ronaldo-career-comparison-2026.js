(function () {
  const dataEl = document.getElementById("mrcc-data");
  if (!dataEl) return;

  const data = JSON.parse(dataEl.textContent || "{}");
  const records = Array.isArray(data.records) ? data.records : [];
  const categories = Array.from(new Set(records.map((r) => r.category)));

  const tabButtons = Array.from(document.querySelectorAll("[data-category-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-category-panel]"));

  const syncUrl = (category) => {
    const params = new URLSearchParams(window.location.search);
    params.set("category", category);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", next);
  };

  const setCategory = (category) => {
    if (!categories.includes(category)) return;
    tabButtons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-category-tab") === category));
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.getAttribute("data-category-panel") === category));
    syncUrl(category);
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => setCategory(btn.getAttribute("data-category-tab")));
  });

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category");
  if (initialCategory && categories.includes(initialCategory)) {
    setCategory(initialCategory);
  }
})();
