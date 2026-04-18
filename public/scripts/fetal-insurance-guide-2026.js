const faqButtons = Array.from(document.querySelectorAll(".fig-faq-item__button"));
const tocLinks = Array.from(document.querySelectorAll(".fig-toc a"));
const sections = Array.from(document.querySelectorAll("[data-fig-section]"));

function setFaqState(button, expanded) {
  const panel = button.nextElementSibling;
  const icon = button.querySelector(".fig-faq-item__icon");

  button.setAttribute("aria-expanded", expanded ? "true" : "false");

  if (panel) {
    panel.classList.toggle("is-open", expanded);
  }

  if (icon) {
    icon.textContent = expanded ? "−" : "+";
  }
}

faqButtons.forEach((button, index) => {
  setFaqState(button, index === 0);

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((item) => setFaqState(item, false));
    setFaqState(button, !isExpanded);
  });
});

tocLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId?.startsWith("#")) return;

    const section = document.querySelector(targetId);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", targetId);
  });
});

if (sections.length > 0 && tocLinks.length > 0 && "IntersectionObserver" in window) {
  const linkMap = new Map(tocLinks.map((link) => [link.getAttribute("href"), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      const activeId = `#${visibleEntry.target.id}`;
      tocLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === activeId));
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: [0.15, 0.35, 0.6],
    }
  );

  sections.forEach((section) => observer.observe(section));

  const hashLink = linkMap.get(window.location.hash);
  if (hashLink) {
    hashLink.classList.add("is-active");
  }
}
