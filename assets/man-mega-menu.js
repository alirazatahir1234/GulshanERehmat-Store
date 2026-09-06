/**
 * Man mega menu: category filtering + link hover active state.
 */
function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function initManMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.manMegaReady === 'true') return;

  const cards = Array.from(root.querySelectorAll('.man-mega-menu__card[data-mega-category]'));
  const panels = Array.from(root.querySelectorAll('[data-mega-panel]'));
  const linkGroups = root.querySelectorAll('[data-man-links]');

  let activeCategory = '';

  const setCategory = (category, { force = false } = {}) => {
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
