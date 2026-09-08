/**
 * Man mega menu: category filtering, nested Wash n Wear brands, link hover.
 */
function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function initManMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.manMegaReady === 'true') return;

  const cards = Array.from(root.querySelectorAll('.man-mega-menu__card[data-mega-category]'));
  const panels = Array.from(root.querySelectorAll('[data-mega-panel]'));
  const linkGroups = root.querySelectorAll('[data-man-links]');
  const nestedTriggers = Array.from(root.querySelectorAll('[data-nested-trigger]'));
  const nestedPanels = Array.from(root.querySelectorAll('[data-nested-panel]'));

  let activeCategory = '';
  let activeNestedId = '';

  const setNested = (nestedId, { force = false } = {}) => {
    if (!force && nestedId === activeNestedId) return;
    activeNestedId = nestedId || '';

    nestedPanels.forEach((panel) => {
      const id = panel.getAttribute('data-nested-panel');
      const isActive = Boolean(nestedId) && id === nestedId;
      panel.classList.toggle('is-visible', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    nestedTriggers.forEach((trigger) => {
      const id = trigger.getAttribute('data-nested-trigger');
      const isActive = Boolean(nestedId) && id === nestedId;
      trigger.classList.toggle('is-active', isActive);
      trigger.classList.toggle('is-nested-open', isActive);
      trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  };

  const clearNested = () => setNested('', { force: true });

  const setCategory = (category, { force = false } = {}) => {
    if (!category || (!force && category === activeCategory)) return;
    activeCategory = category;
    clearNested();

    cards.forEach((card) => {
      const isActive = card.getAttribute('data-mega-category') === category;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isActive = panel.getAttribute('data-mega-panel') === category;
      panel.classList.toggle('is-active', isActive);

      if (isActive) {
        panel.removeAttribute('hidden');
        panel.classList.remove('is-animating');
        void panel.offsetWidth;
        panel.classList.add('is-animating');
      } else {
        panel.setAttribute('hidden', '');
        panel.classList.remove('is-animating');
      }
    });
  };

  cards.forEach((card) => {
    const category = card.getAttribute('data-mega-category');

    if (canHover()) {
      card.addEventListener('pointerenter', () => setCategory(category));
    }

    card.addEventListener('focus', () => setCategory(category));

    card.addEventListener('click', (event) => {
      if (category !== activeCategory) {
        event.preventDefault();
        setCategory(category);
      }
    });
  });

  linkGroups.forEach((group) => {
    const items = group.querySelectorAll('a, button, .man-mega-menu__link-disabled');
    items.forEach((item) => {
      const activate = () => {
        items.forEach((el) => {
          if (!el.hasAttribute('data-nested-trigger')) el.classList.remove('is-active');
        });
        if (!item.hasAttribute('data-nested-trigger')) {
          item.classList.add('is-active');
          clearNested();
        }
      };

      item.addEventListener('pointerenter', activate);
      item.addEventListener('focus', activate);
    });
  });

  nestedTriggers.forEach((trigger) => {
    const nestedId = trigger.getAttribute('data-nested-trigger');
    if (!nestedId) return;

    const openNested = () => setNested(nestedId);

    if (canHover()) {
      trigger.addEventListener('pointerenter', openNested);
    }

    trigger.addEventListener('focus', openNested);

    trigger.addEventListener('click', (event) => {
      const isOpen = activeNestedId === nestedId;
      const isAnchor = trigger.tagName === 'A';

      if (!canHover()) {
        if (!isOpen) {
          event.preventDefault();
          setNested(nestedId);
          return;
        }
        if (!isAnchor) {
          event.preventDefault();
          clearNested();
        }
        return;
      }

      if (!isAnchor) {
        event.preventDefault();
        setNested(nestedId);
      }
    });
  });

  nestedPanels.forEach((panel) => {
    panel.addEventListener('pointerenter', () => {
      const id = panel.getAttribute('data-nested-panel');
      if (id) setNested(id);
    });

    const links = panel.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('focus', () => {
        const id = panel.getAttribute('data-nested-panel');
        if (id) setNested(id);
      });
    });
  });

  const initial =
    root.querySelector('.man-mega-menu__card[data-mega-category].is-active')?.getAttribute('data-mega-category') ||
    'summer';
  setCategory(initial, { force: true });

  root.dataset.manMegaReady = 'true';
}

function initAllManMegaMenus(scope = document) {
  scope.querySelectorAll('[data-man-mega-menu]').forEach((root) => initManMegaMenu(root));
}

initAllManMegaMenus();

document.addEventListener('shopify:section:load', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement) initAllManMegaMenus(target);
});
