(() => {
  const root = document.querySelector("[data-tsg-root]");
  if (!root) return;

  const won = new Intl.NumberFormat("ko-KR");
  const presets = JSON.parse(document.getElementById("tsg-presets")?.textContent || "[]");
  const fields = [...root.querySelectorAll("[data-tsg-input]")];
  const out = (key) => document.querySelector(`[data-tsg-output="${key}"]`);

  function num(value) {
    return Math.max(0, Number(String(value).replace(/[^\d.]/g, "")) || 0);
  }

  function format(value) {
    return `${won.format(Math.round(value))}원`;
  }

  function read() {
    const input = {};
    fields.forEach((field) => {
      input[field.dataset.tsgInput] = field.type === "checkbox" ? field.checked : field.value;
    });
    return {
      destination: input.destination || "여행",
      months: Math.max(0, num(input.months)),
      people: Math.max(1, num(input.people)),
      saved: num(input.saved),
      rate: num(input.rate),
      flight: num(input.flight),
      lodging: num(input.lodging),
      food: num(input.food),
      transport: num(input.transport),
      activity: num(input.activity),
      shopping: num(input.shopping),
    };
  }

  function monthlyRequired(shortage, months, annualRate) {
    if (shortage <= 0) return 0;
    if (months <= 0) return shortage;
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return shortage / months;
    return shortage / (((1 + monthlyRate) ** months - 1) / monthlyRate);
  }

  function calculate(input) {
    const total = input.flight + input.lodging + input.food + input.transport + input.activity + input.shopping;
    const shortage = Math.max(total - input.saved, 0);
    const monthly = monthlyRequired(shortage, input.months, input.rate);
    return {
      total,
      shortage,
      monthly,
      daily: monthly / 30,
      perPerson: total / input.people,
    };
  }

  function render() {
    const input = read();
    const result = calculate(input);
    out("total").textContent = format(result.total);
    out("shortage").textContent = format(result.shortage);
    out("monthly").textContent = format(result.monthly);
    out("daily").textContent = format(result.daily);
    out("perPerson").textContent = format(result.perPerson);
    out("message").textContent = result.shortage <= 0
      ? `${input.destination} 여행비 목표를 이미 달성한 상태로 추정됩니다.`
      : `${input.months}개월 후 ${input.destination} 여행을 목표로 한다면 매달 약 ${format(result.monthly)}씩 모으면 됩니다.`;
  }

  function applyPreset(id) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    const values = {
      destination: preset.destination,
      months: preset.monthsLeft,
      people: preset.people,
      saved: preset.saved,
      ...preset.budget,
    };
    fields.forEach((field) => {
      const key = field.dataset.tsgInput;
      if (values[key] !== undefined) field.value = values[key];
    });
    render();
  }

  root.addEventListener("input", render);
  root.addEventListener("change", render);
  root.querySelectorAll("[data-tsg-preset]").forEach((button) => {
    button.addEventListener("click", () => applyPreset(button.dataset.tsgPreset));
  });
  document.getElementById("resetTsgBtn")?.addEventListener("click", () => applyPreset("osaka"));
  document.getElementById("copyTsgLinkBtn")?.addEventListener("click", () => navigator.clipboard?.writeText(location.href));
  render();
})();
