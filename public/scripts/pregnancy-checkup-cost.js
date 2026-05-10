(() => {
  const root = document.querySelector("[data-pcc-root]");
  if (!root) return;

  const tests = JSON.parse(document.getElementById("pcc-tests")?.textContent || "[]");
  const won = new Intl.NumberFormat("ko-KR");
  const out = (key) => document.querySelector(`[data-pcc-output="${key}"]`);

  function num(value) {
    return Math.max(0, Number(String(value).replace(/[^\d.]/g, "")) || 0);
  }

  function format(value) {
    return `${won.format(Math.round(value))}원`;
  }

  function read() {
    return {
      week: Math.min(40, Math.max(4, num(root.querySelector("[data-pcc-input='week']")?.value))),
      multiple: root.querySelector("[data-pcc-input='multiple']")?.checked || false,
      underserved: root.querySelector("[data-pcc-input='underserved']")?.checked || false,
      nipt: root.querySelector("[data-pcc-input='nipt']")?.checked || false,
      amnio: root.querySelector("[data-pcc-input='amnio']")?.checked || false,
      usedVoucher: num(root.querySelector("[data-pcc-input='usedVoucher']")?.value),
    };
  }

  function calculate(input) {
    const voucher = (input.multiple ? 1400000 : 1000000) + (input.underserved ? 200000 : 0);
    const remaining = tests.filter((test) => {
      if (test.endWeek < input.week) return false;
      if (test.id === "nipt" && !input.nipt) return false;
      if (test.id === "amnio" && !input.amnio) return false;
      return true;
    });
    const min = remaining.reduce((sum, test) => sum + test.minCost, 0);
    const max = remaining.reduce((sum, test) => sum + test.maxCost, 0);
    const voucherLeft = Math.max(voucher - input.usedVoucher, 0);
    return {
      remaining,
      min,
      max,
      voucherLeft,
      oopMin: Math.max(min - voucherLeft, 0),
      oopMax: Math.max(max - voucherLeft, 0),
    };
  }

  function render() {
    const result = calculate(read());
    out("total").textContent = `${format(result.min)}~${format(result.max)}`;
    out("voucher").textContent = format(result.voucherLeft);
    out("oop").textContent = `${format(result.oopMin)}~${format(result.oopMax)}`;
    out("count").textContent = `${result.remaining.length}개`;
    out("timeline").innerHTML = result.remaining
      .map((test) => `<li><b>${test.startWeek}~${test.endWeek}주</b><span>${test.name}</span><em>${test.type}</em></li>`)
      .join("");
  }

  root.addEventListener("input", render);
  root.addEventListener("change", render);
  document.getElementById("resetPccBtn")?.addEventListener("click", () => location.reload());
  document.getElementById("copyPccLinkBtn")?.addEventListener("click", () => navigator.clipboard?.writeText(location.href));
  render();
})();
