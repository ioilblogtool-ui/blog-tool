const formatMoney = (value, unit) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "확인 필요";
  if (unit === "manwon") return `${amount.toLocaleString("ko-KR")}만 원`;
  return `${(amount / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억 원`;
};

const setUnit = (unit) => {
  document.querySelectorAll("[data-smca-money]").forEach((node) => {
    node.textContent = formatMoney(node.getAttribute("data-smca-money"), unit);
  });

  document.querySelectorAll("[data-smca-unit-toggle]").forEach((button) => {
    const active = button.getAttribute("data-smca-unit-toggle") === unit;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
};

document.querySelectorAll("[data-smca-unit-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    setUnit(button.getAttribute("data-smca-unit-toggle") || "eok");
  });
});

document.querySelectorAll("[data-smca-candidate-card]").forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.getAttribute("data-smca-candidate-card");
    document.querySelectorAll("[data-smca-candidate-card], [data-smca-candidate-detail]").forEach((node) => {
      const attr = node.getAttribute("data-smca-candidate-card") || node.getAttribute("data-smca-candidate-detail");
      node.classList.toggle("is-highlighted", attr === id);
    });
  });
});
