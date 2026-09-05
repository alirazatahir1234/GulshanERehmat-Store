/**
 * Man mega menu: link hover active state for arrow highlight.
 */
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
