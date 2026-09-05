/**
 * Man mega menu: link hover active state + essentials tagline marquee restart.
 */
function restartEssentialsAnimation(root) {
  const tagline = root.querySelector('[data-essentials-tagline]');
  const track = tagline?.querySelector('.man-mega-menu__essentials-tagline-track');
  if (!(track instanceof HTMLElement)) return;

  track.style.animation = 'none';
  // Force reflow so the marquee restarts when the menu opens
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

function initManMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.manMegaReady === 'true') return;

  const links = root.querySelectorAll('[data-man-links] a');

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
