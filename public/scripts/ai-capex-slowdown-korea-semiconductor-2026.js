// url-state.js는 브라우저에 최대 4시간 캐시된다. 다른 페이지와 같은 버전 쿼리로 불러 캐시 사본을 맞춘다.
import { readParam, writeParams } from "./url-state.js?v=20261027";

const configEl = document.getElementById("acsConfig");
const scenarios = configEl ? JSON.parse(configEl.textContent || "{}") : {};
const BADGE_CLASS = { 공식: "official", 참고: "ref", 시뮬레이션: "sim", 추정: "est" };

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setOut(key, value) {
  const node = $(`[data-acs-out="${key}"]`);
  if (node) node.textContent = value;
}

// 시나리오 값은 빌드 시 계산돼 있으므로 표시만 바꾼다.
function selectScenario(id, { sync = true } = {}) {
  const activeId = scenarios[id] ? id : "bear";
  const view = scenarios[activeId];
  if (!view) return;

  $$("[data-acs-sc]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.acsSc === activeId ? "true" : "false");
  });
  setOut("definition", view.definition);
  setOut("exportText", view.exportText);
  setOut("monthsText", view.monthsText ?? "—");
  setOut("gdpText", view.gdpText);

  const bar = $("[data-acs-bar]");
  if (bar) bar.style.width = `${view.barRatio * 100}%`;

  const badge = $("[data-acs-badge]");
  if (badge) {
    badge.textContent = view.badge;
    badge.className = `acs-badge acs-badge--${BADGE_CLASS[view.badge] || "ref"}`;
  }

  const notes = $('[data-acs-out="footnotes"]');
  if (notes) {
    notes.innerHTML = "";
    view.footnotes.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      notes.appendChild(li);
    });
  }

  if (sync) writeParams({ sc: activeId });
}

$$("[data-acs-sc]").forEach((btn) => {
  btn.addEventListener("click", () => selectScenario(btn.dataset.acsSc));
});

selectScenario(readParam("sc", "bear"), { sync: false });
