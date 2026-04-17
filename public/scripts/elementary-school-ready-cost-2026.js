(function () {
  const STORAGE_KEY = 'esr-checklist-v1';

  function safeStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function readState(storage) {
    if (!storage) return {};
    try {
      const raw = storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeState(storage, state) {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Ignore quota / privacy mode failures.
    }
  }

  function initChecklist(storage) {
    const checkboxes = Array.from(document.querySelectorAll('.esr-checklist__checkbox'));
    if (!checkboxes.length) return;

    const items = Array.from(document.querySelectorAll('.esr-checklist__item'));
    const counter = document.getElementById('esrCounterNum');
    const state = readState(storage);

    const syncItem = (checkbox) => {
      const id = checkbox.dataset.itemId;
      const item = checkbox.closest('.esr-checklist__item');
      if (!id || !item) return;
      const checked = checkbox.checked;
      item.classList.toggle('is-complete', checked);
      state[id] = checked;
    };

    checkboxes.forEach((checkbox) => {
      const id = checkbox.dataset.itemId;
      if (id && Object.prototype.hasOwnProperty.call(state, id)) {
        checkbox.checked = Boolean(state[id]);
      }
      syncItem(checkbox);
      checkbox.addEventListener('change', () => {
        syncItem(checkbox);
        writeState(storage, state);
        updateCounter();
      });
    });

    function updateCounter() {
      if (!counter) return;
      const completed = items.filter((item) => item.classList.contains('is-complete')).length;
      counter.textContent = String(completed);
    }

    updateCounter();
  }

  function initFaq() {
    const items = Array.from(document.querySelectorAll('.esr-faq__item'));
    if (!items.length) return;

    items.forEach((item) => {
      const button = item.querySelector('.esr-faq__question');
      const isOpen = item.classList.contains('is-open');
      if (button) {
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        button.addEventListener('click', () => {
          const nextOpen = !item.classList.contains('is-open');
          item.classList.toggle('is-open', nextOpen);
          button.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        });
      }
    });
  }

  function init() {
    const storage = safeStorage();
    initChecklist(storage);
    initFaq();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
