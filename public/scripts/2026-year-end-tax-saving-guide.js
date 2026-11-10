export const CHECKLIST_IDS = Object.freeze(['card', 'retirement', 'rent', 'medical', 'dependents', 'donation']);
const applicabilityValues = new Set(['unknown', 'applies', 'not_applicable']);
const preparationValues = new Set(['unchecked', 'in_progress', 'ready']);

export function createChecklistState() {
  return Object.fromEntries(CHECKLIST_IDS.map(id => [id, { applicability: 'unknown', preparation: 'unchecked' }]));
}

export function transitionChecklist(state, id, field, value) {
  if (!CHECKLIST_IDS.includes(id)) return state;
  const current = state[id];
  if (!current) return state;
  if (field === 'applicability' && applicabilityValues.has(value)) {
    return { ...state, [id]: { applicability: value, preparation: value === 'applies' ? current.preparation : 'unchecked' } };
  }
  if (field === 'preparation' && preparationValues.has(value) && current.applicability === 'applies') {
    return { ...state, [id]: { ...current, preparation: value } };
  }
  return state;
}

export function summarizeChecklist(state) {
  let applicable = 0;
  let ready = 0;
  let unknown = 0;
  for (const id of CHECKLIST_IDS) {
    const item = state[id];
    if (item.applicability === 'unknown') unknown++;
    if (item.applicability === 'applies') {
      applicable++;
      if (item.preparation === 'ready') ready++;
    }
  }
  let message;
  if (unknown === CHECKLIST_IDS.length) message = '6개 항목의 해당 여부부터 확인하세요.';
  else if (applicable === 0) message = '현재 해당한다고 선택한 항목이 없습니다.';
  else message = `해당 ${applicable}개 중 ${ready}개 준비 완료.`;
  if (unknown > 0 && unknown < CHECKLIST_IDS.length) message += ` 아직 확인하지 않은 항목 ${unknown}개가 남아 있습니다.`;
  if (unknown === 0 && applicable > 0 && ready === applicable) message += ' 공제 적용요건과 증빙을 마지막으로 확인하세요.';
  return { applicable, ready, unknown, message };
}

export function initChecklist(root) {
  let state = createChecklistState();
  const status = root.querySelector('[data-yets-status]');
  const cards = [...root.querySelectorAll('[data-yets-item]')];
  const render = () => {
    for (const card of cards) {
      const item = state[card.dataset.yetsItem];
      if (!item) continue;
      const applicability = card.querySelector('[data-yets-field="applicability"]');
      const preparation = card.querySelector('[data-yets-field="preparation"]');
      applicability.value = item.applicability;
      preparation.value = item.preparation;
      preparation.disabled = item.applicability !== 'applies';
      card.dataset.prepared = String(item.applicability === 'applies' && item.preparation === 'ready');
    }
    status.textContent = summarizeChecklist(state).message;
  };
  root.addEventListener('change', event => {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) return;
    const field = select.dataset.yetsField;
    const card = select.closest('[data-yets-item]');
    if (!field || !card || !root.contains(card)) return;
    state = transitionChecklist(state, card.dataset.yetsItem, field, select.value);
    render();
  });
  root.querySelector('[data-yets-reset]').addEventListener('click', () => {
    state = createChecklistState();
    render();
    status.textContent = '준비 상태를 모두 초기화했습니다. 6개 항목의 해당 여부부터 확인하세요.';
  });
  root.querySelectorAll('[data-yets-controls]').forEach(element => { element.hidden = false; });
  render();
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-yets-checklist]');
  if (root) initChecklist(root);
}
