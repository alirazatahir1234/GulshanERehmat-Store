/**
 * Woman mega menu: Printed Three Piece activation + fabric hover image swap.
 */
function initWomanMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.womanMegaReady === 'true') return;

  const trigger = root.querySelector('[data-fabric-menu]');
  const fabricColumn = root.querySelector('[data-fabric-column]');
  const fabricLinks = root.querySelectorAll('[data-fabric-link]');
  const featureLink = root.querySelector('[data-feature-link]');
  const featureTitle = root.querySelector('[data-feature-heading]');
  const featureSubtitle = root.querySelector('[data-feature-subheading]');

  const activateFabrics = () => {
    trigger?.classList.add('is-active');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    fabricColumn?.classList.add('is-active');
  };

  const setActiveFabric = (link) => {
    fabricLinks.forEach((item) => item.classList.remove('is-active'));
    link.classList.add('is-active');

    const imageUrl = link.getAttribute('data-image');
    const imageAlt = link.getAttribute('data-image-alt') || link.textContent?.trim() || '';
    const title = link.getAttribute('data-feature-title') || link.textContent?.trim() || '';
    const subtitle = link.getAttribute('data-feature-subtitle') || 'Warmth Meets Elegance';

    if (imageUrl && featureLink) {
      featureLink.hidden = false;
      let img = featureLink.querySelector('.woman-mega-menu__feature-image');

      if (!(img instanceof HTMLImageElement)) {
        img = document.createElement('img');
        img.className = 'woman-mega-menu__feature-image';
        img.loading = 'lazy';
        featureLink.replaceChildren(img);
      }

      img.src = imageUrl;
      img.alt = imageAlt;
    }

    if (featureLink instanceof HTMLAnchorElement && link instanceof HTMLAnchorElement) {
      featureLink.href = link.href;
    }

    if (featureTitle && title) featureTitle.textContent = title;
    if (featureSubtitle) featureSubtitle.textContent = subtitle;
  };

  trigger?.addEventListener('pointerenter', activateFabrics);
  trigger?.addEventListener('focus', activateFabrics);
  trigger?.addEventListener('click', (event) => {
    event.preventDefault();
    activateFabrics();
  });

  fabricLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => setActiveFabric(link));
    link.addEventListener('focus', () => setActiveFabric(link));
  });

  root.dataset.womanMegaReady = 'true';
}

function initAllWomanMegaMenus(scope = document) {
  scope.querySelectorAll('[data-woman-mega-menu]').forEach((root) => initWomanMegaMenu(root));
}

initAllWomanMegaMenus();

document.addEventListener('shopify:section:load', (event) => {
  const target = event.target;
  if (target instanceof HTMLElement) initAllWomanMegaMenus(target);
});
