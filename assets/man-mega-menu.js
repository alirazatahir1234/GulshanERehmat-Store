/**
 * Man mega menu: category filtering, nested Wash n Wear brands, link hover.
 * Default whenever Men opens: Summer → Wash n Wear → Kafoor by Taiba.
 * Visual selection only — no auto navigation / URL change.
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
  const defaultCategory = root.getAttribute('data-default-category') || 'summer';
  const defaultNestedId = root.getAttribute('data-default-nested') || 'kafoor-lines';

  let activeCategory = '';
  let activeNestedId = '';
  let wasOpen = false;

  const getNestedChain = (nestedId) => {
    if (!nestedId) return [];
    const byId = new Map(
      nestedPanels.map((panel) => [panel.getAttribute('data-nested-panel'), panel])
    );
    const chain = [];
    let current = nestedId;
    const guard = new Set();

    while (current && !guard.has(current)) {
      guard.add(current);
      chain.unshift(current);
      const panel = byId.get(current);
      current = panel?.getAttribute('data-nested-parent') || '';
    }

    return chain;
  };

  const setNested = (nestedId, { force = false } = {}) => {
    if (!force && nestedId === activeNestedId) return;
    activeNestedId = nestedId || '';
    const chain = getNestedChain(nestedId);

    nestedPanels.forEach((panel) => {
      const id = panel.getAttribute('data-nested-panel');
      const isActive = chain.includes(id);
      panel.classList.toggle('is-visible', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    nestedTriggers.forEach((trigger) => {
      const id = trigger.getAttribute('data-nested-trigger');
      const isActive = chain.includes(id);
      trigger.classList.toggle('is-active', isActive);
      trigger.classList.toggle('is-nested-open', isActive);
      trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });
  };

  const clearNested = () => setNested('', { force: true });

  const applyDefaultNested = (category) => {
    if (category === defaultCategory && defaultNestedId) {
      setNested(defaultNestedId, { force: true });
      return;
    }
    clearNested();
  };

  const setCategory = (category, { force = false, restoreDefaultNested = true } = {}) => {
    if (!category || (!force && category === activeCategory)) return;
    activeCategory = category;

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

    if (restoreDefaultNested) {
      applyDefaultNested(category);
    } else {
      clearNested();
    }
  };

  /**
   * Visual-only default state used every time Men opens.
   * Does not navigate or change the URL.
   */
  const resetDefaults = () => {
    setCategory(defaultCategory, { force: true, restoreDefaultNested: true });
  };

  cards.forEach((card) => {
    const category = card.getAttribute('data-mega-category');

    if (canHover()) {
      card.addEventListener('pointerenter', () => {
        // Switching top cards restores that card's default nest (Summer → Wash → Kafoor)
        setCategory(category, { restoreDefaultNested: true });
      });
    }

    card.addEventListener('focus', () => {
      setCategory(category, { restoreDefaultNested: true });
    });

    card.addEventListener('click', (event) => {
      // First click only activates the panel — do not navigate away from Men
      if (category !== activeCategory) {
        event.preventDefault();
        setCategory(category, { restoreDefaultNested: true });
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
      const isOpen = activeNestedId === nestedId || getNestedChain(activeNestedId).includes(nestedId);
      const isAnchor = trigger.tagName === 'A';

      // Expand cascade first; only follow the link on a second intentional click
      if (!isOpen) {
        event.preventDefault();
        setNested(nestedId);
        return;
      }

      if (!canHover()) {
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
      if (!id) return;
      // Keep deeper nests open when hovering an already-active parent column
      const chain = getNestedChain(activeNestedId);
      if (chain.includes(id) && activeNestedId !== id) return;
      setNested(id);
    });

    const links = panel.querySelectorAll('a, button');
    links.forEach((link) => {
      const activate = () => {
        const id = panel.getAttribute('data-nested-panel');
        if (!id) return;
        // Non-trigger links reset to this panel level (closes deeper nests)
        if (!link.hasAttribute('data-nested-trigger')) {
          setNested(id);
        }
      };

      link.addEventListener('pointerenter', activate);
      link.addEventListener('focus', activate);
    });
  });

  const isSubmenuOpen = (submenu) => {
    if (!(submenu instanceof HTMLElement)) return false;
    if (submenu.hasAttribute('data-active')) return true;
    if (submenu.inert === false) return true;
    return false;
  };

  const syncOpenState = (submenu) => {
    const open = isSubmenuOpen(submenu);
    if (open && !wasOpen) {
      resetDefaults();
    }
    if (!open && wasOpen) {
      // Reset while closed so the next open always starts from defaults
      resetDefaults();
    }
    wasOpen = open;
  };

  // Re-apply defaults whenever the Men header submenu opens/closes
  const submenu =
    root.closest('[ref="submenu[]"]') ||
    root.closest('.menu-list__submenu');

  if (submenu instanceof HTMLElement) {
    wasOpen = isSubmenuOpen(submenu);
    const observer = new MutationObserver(() => syncOpenState(submenu));
    observer.observe(submenu, {
      attributes: true,
      attributeFilter: ['data-active', 'inert'],
    });
  }

  const listItem = root.closest('.menu-list__list-item');
  const disclosure = listItem?.querySelector('[ref="disclosure[]"], .menu-list__disclosure');
  if (disclosure instanceof HTMLElement) {
    const disclosureObserver = new MutationObserver(() => {
      if (disclosure.getAttribute('aria-expanded') === 'true') {
        resetDefaults();
      }
    });
    disclosureObserver.observe(disclosure, {
      attributes: true,
      attributeFilter: ['aria-expanded'],
    });
  }

  // Also catch hover activation via MegaMenuHoverEvent / pointer on the Men item
  const menItem = listItem?.querySelector('[ref="menuitem"], .menu-list__link');
  if (menItem instanceof HTMLElement && canHover()) {
    menItem.addEventListener('pointerenter', () => {
      // Defer until header-menu marks the submenu active
      requestAnimationFrame(() => resetDefaults());
    });
  }

  resetDefaults();
  root.dataset.manMegaReady = 'true';
  root.__manMegaResetDefaults = resetDefaults;
}

function initAllManMegaMenus(scope = document) {
  scope.querySelectorAll('[data-man-mega-menu]').forEach((root) => initManMegaMenu(root));
}

initAllManMegaMenus();

document.addEventListener('shopify:section:load', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement) initAllManMegaMenus(target);
});
