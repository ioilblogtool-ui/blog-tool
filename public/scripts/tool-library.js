function initToolLibrary() {
  const searchInput = document.getElementById("toolSearchInput");
  const emptyState = document.getElementById("toolLibraryEmpty");
  const cards = Array.from(document.querySelectorAll("[data-tool-card]"));
  const filters = Array.from(document.querySelectorAll("[data-filter]"));

  if (!(searchInput instanceof HTMLInputElement) || cards.length === 0) {
    return;
  }

  let activeFilter = "all";

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const searchText = (card.getAttribute("data-search") || "").toLowerCase();
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      const matchesQuery = query.length === 0 || searchText.includes(query);
      const visible = matchesFilter && matchesQuery;

      card.toggleAttribute("hidden", !visible);
      if (visible) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.toggleAttribute("hidden", visibleCount > 0);
    }
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.getAttribute("data-filter") || "all";
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      render();
    });
  });

  searchInput.addEventListener("input", render);
  searchInput.addEventListener("search", render);
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initToolLibrary, { once: true });
} else {
  initToolLibrary();
}
