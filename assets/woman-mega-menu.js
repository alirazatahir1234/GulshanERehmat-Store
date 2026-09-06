/**
 * Woman mega menu: category card filtering + fabric hover image swap.
 */
function initWomanMegaMenu(root) {
  if (!(root instanceof HTMLElement) || root.dataset.womanMegaReady === 'true') return;

  const cards = Array.from(root.querySelectorAll('[data-mega-category]'));
  const panels = Array.from(root.querySelectorAll('[data-mega-panel]'));
  const trigger = root.querySelector('[data-fabric-menu]');
  const fabricColumn = root.querySelector('[data-fabric-column]');
  const fabricLinks = root.querySelectorAll('[data-fabric-link]');
  const featureLink = root.querySelector('[data-feature-link]');
  const featureTitle = root.querySelector('[data-feature-heading]');
  const featureSubtitle = root.querySelector('[data-feature-subheading]');

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

    card.addEventListener('pointerenter', () => setCategory(category));
    card.addEventListener('focus', () => setCategory(category));

    card.addEventListener('click', (event) => {
      // First click selects the category panel; second click (when already active) navigates.
      if (category !== activeCategory) {
        event.preventDefault();
        setCategory(category);
      }
    });
  });

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

  const initial =
    root.querySelector('[data-mega-category].is-active')?.getAttribute('data-mega-category') || 'unstitched';
  setCategory(initial, { force: true });

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
