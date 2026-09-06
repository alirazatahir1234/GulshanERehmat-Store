/**
 * Man mega menu: category filtering + link hover + essentials marquee.
 */
function restartEssentialsAnimation(root) {
  const tagline = root.querySelector('[data-essentials-tagline]');
  const track = tagline?.querySelector('.man-mega-menu__essentials-tagline-track');
  if (!(track instanceof HTMLElement)) return;

  track.style.animation = 'none';
  void track.offsetWidth;
  track.style.animation = '';
}

function watchMenuOpen(root) {
  const listItem = root.closest('.menu-list__list-item');
  if (!(listItem instanceof HTMLElement)) return;

  const disclosure = listItem.querySelector('.menu-list__disclosure');
  if (!(disclosure instanceof HTMLElement)) return;

  const sync = () => {
    if (disclosure.getAttribute('aria-expanded') === 'true') {
      restartEssentialsAnimation(root);
    }
  };

  const observer = new MutationObserver(sync);
  observer.observe(disclosure, { attributes: true, attributeFilter: ['aria-expanded'] });

  listItem.addEventListener('pointerenter', () => {
    window.setTimeout(() => restartEssentialsAnimation(root), 50);
  });
}

function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function initManMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.manMegaReady === 'true') return;

  const cards = Array.from(root.querySelectorAll('.man-mega-menu__card[data-mega-category]'));
  const essentialsTrigger = root.querySelector('.man-mega-menu__essentials[data-mega-category]');
  const categoryTriggers = essentialsTrigger ? cards.concat(essentialsTrigger) : cards;
  const panels = Array.from(root.querySelectorAll('[data-mega-panel]'));
  const linkGroups = root.querySelectorAll('[data-man-links]');

  let activeCategory = '';

  const setCategory = (category, { force = false } = {}) => {
    if (!category || (!force && category === activeCategory)) return;
    activeCategory = category;

    categoryTriggers.forEach((trigger) => {
      const isActive = trigger.getAttribute('data-mega-category') === category;
      trigger.classList.toggle('is-active', isActive);
      trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
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

    if (category === 'essentials') {
      restartEssentialsAnimation(root);
    }
  };

  categoryTriggers.forEach((trigger) => {
    const category = trigger.getAttribute('data-mega-category');
    const isEssentials = category === 'essentials';

    if (canHover()) {
      trigger.addEventListener('pointerenter', () => setCategory(category));
    }

    trigger.addEventListener('focus', () => setCategory(category));

    trigger.addEventListener('click', (event) => {
      // Essentials wrapper click: select panel first; allow nested link to navigate when already active
      if (isEssentials) {
        const link = event.target instanceof Element ? event.target.closest('[data-essentials-link]') : null;
        if (category !== activeCategory) {
          event.preventDefault();
          setCategory(category);
        } else if (!link) {
          event.preventDefault();
        }
        return;
      }

      // Top cards: first click selects; second click navigates
      if (category !== activeCategory) {
        event.preventDefault();
        setCategory(category);
      }
    });

    if (isEssentials) {
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setCategory(category);
        }
      });
    }
  });

  linkGroups.forEach((group) => {
    const links = group.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('pointerenter', () => {
        links.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      });
      link.addEventListener('focus', () => {
        links.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    });
  });

  const initial =
    root.querySelector('.man-mega-menu__card[data-mega-category].is-active')?.getAttribute('data-mega-category') ||
    'summer';
  setCategory(initial, { force: true });

  watchMenuOpen(root);
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
