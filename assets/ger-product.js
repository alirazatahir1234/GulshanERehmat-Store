/**
 * Gulshan E Rehmat — Premium Product Detail Page
 */
(function () {
  const moneyFormat =
    (window.Shopify && window.Shopify.money_format) ||
    (window.themeVariables && window.themeVariables.settings && window.themeVariables.settings.moneyFormat) ||
    'Rs. {{amount}}';

  function formatMoney(cents) {
    if (typeof cents !== 'number') return '';
    const amount = (cents / 100).toFixed(2).replace(/\.00$/, '');
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      try {
        return window.Shopify.formatMoney(cents, moneyFormat);
      } catch (e) {
        /* fall through */
      }
    }
    return 'Rs. ' + Number(amount).toLocaleString('en-PK');
  }

  function parseJson(el) {
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function initPdp(root) {
    const product = parseJson(root.querySelector('[data-ger-product-json]'));
    if (!product) return;

    const form = root.querySelector('[data-ger-product-form]');
    const variantInput = root.querySelector('[data-ger-variant-id]');
    const variants = product.variants || parseJson(root.querySelector('[data-ger-variants]')) || [];
    const media = product.media || [];
    let currentIndex = 0;
    let selectedOptions = {};

    /* ---- Gallery ---- */
    const thumbs = Array.from(root.querySelectorAll('[data-ger-thumb]'));
    const slides = Array.from(root.querySelectorAll('[data-ger-main-slide]'));
    const counter = root.querySelector('[data-ger-counter]');
    const lightbox = root.querySelector('[data-ger-lightbox]');
    const lightboxImg = root.querySelector('[data-ger-lightbox-img]');

    function showSlide(index) {
      if (!slides.length) return;
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === currentIndex;
        slide.classList.toggle('is-active', active);
        slide.hidden = !active;
      });
      thumbs.forEach((thumb, i) => {
        const active = i === currentIndex;
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (counter) counter.textContent = currentIndex + 1 + ' / ' + slides.length;
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => showSlide(Number(thumb.dataset.index || 0)));
    });

    root.querySelectorAll('[data-ger-nav]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(currentIndex + Number(btn.getAttribute('data-ger-nav')));
      });
    });

    function openLightbox(index) {
      if (!lightbox || !media.length) return;
      currentIndex = index;
      const item = media[currentIndex];
      if (!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || product.title;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    root.querySelectorAll('[data-ger-zoom-open], [data-ger-masonry-item]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(Number(el.dataset.index || currentIndex));
      });
    });

    root.querySelector('[data-ger-lightbox-close]')?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    root.querySelectorAll('[data-ger-lightbox-nav]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + Number(btn.getAttribute('data-ger-lightbox-nav')) + media.length) % media.length;
        const item = media[currentIndex];
        if (item) {
          lightboxImg.src = item.src;
          lightboxImg.alt = item.alt || product.title;
        }
        showSlide(currentIndex);
      });
    });

    /* Swipe on main media */
    const mainMedia = root.querySelector('[data-ger-main-media]');
    if (mainMedia && slides.length > 1) {
      let startX = 0;
      mainMedia.addEventListener(
        'touchstart',
        (e) => {
          startX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      mainMedia.addEventListener(
        'touchend',
        (e) => {
          const dx = e.changedTouches[0].screenX - startX;
          if (Math.abs(dx) < 40) return;
          showSlide(currentIndex + (dx < 0 ? 1 : -1));
        },
        { passive: true }
      );
    }

    /* ---- Variants ---- */
    function getSelectedOptions() {
      const options = {};
      root.querySelectorAll('[data-ger-option]').forEach((group) => {
        const selected = group.querySelector('.is-selected');
        if (!selected) return;
        const position = Number(selected.dataset.optionPosition || 1);
        options[position] = selected.dataset.value;
        const label = group.querySelector('[data-ger-option-label]');
        if (label) label.textContent = selected.dataset.value;
      });
      return options;
    }

    function findVariant(options) {
      return variants.find((v) => {
        return (
          (!options[1] || v.option1 === options[1]) &&
          (!options[2] || v.option2 === options[2]) &&
          (!options[3] || v.option3 === options[3])
        );
      });
    }

    function updatePrice(variant) {
      const priceEl = root.querySelector('[data-ger-current-price]');
      const compareEl = root.querySelector('[data-ger-compare]');
      const badgeEl = root.querySelector('[data-ger-save-badge]');
      const stickyPrice = root.querySelector('[data-ger-sticky-price]');
      const row = root.querySelector('[data-ger-price]');
      if (!variant || !priceEl) return;

      priceEl.textContent = formatMoney(variant.price);
      if (stickyPrice) stickyPrice.textContent = formatMoney(variant.price);

      const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
      if (compareEl) {
        compareEl.hidden = !onSale;
        if (onSale) compareEl.textContent = formatMoney(variant.compare_at_price);
      } else if (onSale && row) {
        let compare = row.querySelector('[data-ger-compare]');
        if (!compare) {
          compare = document.createElement('span');
          compare.className = 'ger-pdp__price-compare';
          compare.setAttribute('data-ger-compare', '');
          row.insertBefore(compare, priceEl);
        }
        compare.textContent = formatMoney(variant.compare_at_price);
      }

      if (badgeEl) {
        if (onSale) {
          const pct = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100);
          badgeEl.hidden = false;
          badgeEl.textContent = pct + '% OFF';
        } else {
          badgeEl.hidden = true;
        }
      }
    }

    function updateAvailability(variant) {
      const atc = root.querySelector('[data-ger-add-to-cart]');
      const buy = root.querySelector('[data-ger-buy-now]');
      const sticky = root.querySelector('[data-ger-sticky-atc]');
      const label = root.querySelector('[data-ger-atc-label]');
      const stock = root.querySelector('[data-ger-stock]');
      const available = !!(variant && variant.available);

      [atc, buy, sticky].forEach((btn) => {
        if (btn) btn.disabled = !available;
      });
      if (label) label.textContent = available ? 'ADD TO CART' : 'SOLD OUT';

      if (stock) {
        if (!available) {
          stock.hidden = false;
          stock.textContent = 'Sold Out';
          stock.style.color = '#b42318';
        } else if (
          variant.inventory_management &&
          typeof variant.inventory_quantity === 'number' &&
          variant.inventory_quantity > 0
        ) {
          stock.hidden = false;
          stock.textContent = 'In Stock (' + variant.inventory_quantity + ' pieces)';
          stock.style.color = '';
        } else {
          stock.hidden = false;
          stock.textContent = 'In Stock';
          stock.style.color = '';
        }
      }
    }

    function updateWhatsApp(variant) {
      const link = root.querySelector('[data-ger-whatsapp]');
      if (!link) return;
      const price = variant ? formatMoney(variant.price) : formatMoney(product.price);
      const message =
        'Hello Gulshan E Rehmat,\n\nI am interested in:\n\nProduct: ' +
        product.title +
        '\nPrice: ' +
        price +
        '\nProduct URL: ' +
        window.location.origin +
        product.url +
        '\n\nPlease provide more details.';
      link.href = 'https://wa.me/923338709009?text=' + encodeURIComponent(message);
    }

    function applyVariant() {
      selectedOptions = getSelectedOptions();
      const variant = findVariant(selectedOptions) || variants.find((v) => v.available) || variants[0];
      if (!variant) return;
      if (variantInput) variantInput.value = variant.id;
      updatePrice(variant);
      updateAvailability(variant);
      updateWhatsApp(variant);

      if (variant.featured_media || variant.featured_image) {
        const mediaId =
          (variant.featured_media && (variant.featured_media.id || variant.featured_media)) ||
          (variant.featured_image && (variant.featured_image.id || variant.featured_image));
        const idx = slides.findIndex((s) => String(s.dataset.mediaId) === String(mediaId));
        if (idx >= 0) showSlide(idx);
      }

      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
    }

    function onOptionClick(btn) {
      if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      const group = btn.closest('[data-ger-option]');
      if (!group) return;
      group.querySelectorAll('.is-selected').forEach((el) => el.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      applyVariant();
    }

    root.querySelectorAll('[data-ger-swatch], [data-ger-size]').forEach((btn) => {
      btn.addEventListener('click', () => onOptionClick(btn));
    });

    /* Seed selected options from URL or first available */
    const urlVariantId = new URL(window.location.href).searchParams.get('variant');
    if (urlVariantId) {
      const v = variants.find((x) => String(x.id) === String(urlVariantId));
      if (v) {
        [v.option1, v.option2, v.option3].forEach((val, i) => {
          if (!val) return;
          const btn = root.querySelector(
            '[data-option-position="' +
              (i + 1) +
              '"][data-value="' +
              String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"') +
              '"]'
          );
          if (btn) {
            const group = btn.closest('[data-ger-option]');
            group?.querySelectorAll('.is-selected').forEach((el) => el.classList.remove('is-selected'));
            btn.classList.add('is-selected');
          }
        });
      }
    }
    applyVariant();

    /* ---- Product info tabs ---- */
    const tabsRoot = root.querySelector('[data-ger-product-tabs]');
    if (tabsRoot) {
      const tabButtons = Array.from(tabsRoot.querySelectorAll('[data-ger-tab]'));
      const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-ger-tab-panel]'));

      function activateTab(id) {
        tabButtons.forEach((btn) => {
          const active = btn.getAttribute('data-ger-tab') === id;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        tabPanels.forEach((panel) => {
          const active = panel.getAttribute('data-ger-tab-panel') === id;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      }

      tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => activateTab(btn.getAttribute('data-ger-tab')));
      });
    }

    /* ---- Quantity ---- */
    const qtyInput = root.querySelector('[data-ger-qty-input]');
    root.querySelector('[data-ger-qty-minus]')?.addEventListener('click', () => {
      if (!qtyInput) return;
      qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1);
    });
    root.querySelector('[data-ger-qty-plus]')?.addEventListener('click', () => {
      if (!qtyInput) return;
      qtyInput.value = Math.max(1, Number(qtyInput.value || 1) + 1);
    });

    /* ---- Cart ---- */
    async function addToCart({ checkout } = {}) {
      if (!form || !variantInput) return;
      const atc = root.querySelector('[data-ger-add-to-cart]');
      atc?.classList.add('is-loading');
      const payload = {
        items: [
          {
            id: Number(variantInput.value),
            quantity: Math.max(1, Number(qtyInput?.value || 1)),
          },
        ],
      };
      try {
        const res = await fetch(window.Shopify?.routes?.root ? window.Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.description || 'Unable to add to bag');
        }
        if (checkout) {
          window.location.href = '/checkout';
          return;
        }
        document.dispatchEvent(new CustomEvent('cart:refresh'));
        document.dispatchEvent(new CustomEvent('cart:updated'));
        if (typeof window.refreshCart === 'function') window.refreshCart();
        // Soft feedback
        if (atc) {
          const label = root.querySelector('[data-ger-atc-label]');
          const prev = label?.textContent;
          if (label) label.textContent = 'ADDED';
          setTimeout(() => {
            if (label && prev) label.textContent = prev;
          }, 1400);
        }
      } catch (err) {
        alert(err.message || 'Could not add to bag');
      } finally {
        atc?.classList.remove('is-loading');
      }
    }

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      addToCart();
    });
    root.querySelector('[data-ger-buy-now]')?.addEventListener('click', () => addToCart({ checkout: true }));
    root.querySelector('[data-ger-sticky-atc]')?.addEventListener('click', () => addToCart());

    /* Share */
    root.querySelector('[data-ger-share]')?.addEventListener('click', async () => {
      const data = { title: product.title, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await navigator.clipboard.writeText(window.location.href);
          alert('Product link copied');
        }
      } catch (e) {
        /* ignore */
      }
    });

    /* Sticky bar visibility */
    const sticky = root.querySelector('[data-ger-sticky-bar]');
    const atcBtn = root.querySelector('[data-ger-add-to-cart]');
    if (sticky && atcBtn && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => {
          sticky.hidden = entry.isIntersecting;
        },
        { threshold: 0.15 }
      );
      io.observe(atcBtn);
    }

    /* Size guide deep-link */
    root.querySelector('[data-ger-size-guide-link]')?.addEventListener('click', (e) => {
      const target = document.getElementById('ger-size-guide');
      if (!target) return;
      e.preventDefault();
      target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* Recently viewed store */
    try {
      const key = 'ger_recently_viewed';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const entry = {
        handle: product.handle,
        title: product.title,
        url: product.url,
        image: product.featured_image,
        price: product.price,
        compare_at_price: product.compare_at_price,
      };
      const next = [entry, ...existing.filter((p) => p.handle !== product.handle)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      /* ignore */
    }
  }

  function initRecentlyViewed(section) {
    const track = section.querySelector('[data-ger-rv-track]');
    const empty = section.querySelector('[data-ger-rv-empty]');
    if (!track) return;
    const exclude = section.getAttribute('data-exclude-handle');
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem('ger_recently_viewed') || '[]');
    } catch (e) {
      items = [];
    }
    items = items.filter((p) => p.handle && p.handle !== exclude).slice(0, 8);
    if (!items.length) return;
    if (empty) empty.remove();
    track.innerHTML = items
      .map((p) => {
        const price = p.price ? formatMoney(p.price) : '';
        const img = p.image
          ? '<img src="' + p.image + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '" loading="lazy">'
          : '';
        return (
          '<a class="ger-rv__card" href="' +
          p.url +
          '">' +
          img +
          '<p class="ger-rv__card-title">' +
          (p.title || '') +
          '</p>' +
          (price ? '<p class="ger-rv__card-price">' + price + '</p>' : '') +
          '</a>'
        );
      })
      .join('');
  }

  function initQuickAddForms() {
    document.querySelectorAll('.ger-recs__quick-form').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = form.querySelector('[name="id"]')?.value;
        if (!id) return;
        try {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ items: [{ id: Number(id), quantity: 1 }] }),
          });
          document.dispatchEvent(new CustomEvent('cart:refresh'));
        } catch (err) {
          alert('Could not add to bag');
        }
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-ger-pdp]').forEach(initPdp);
    document.querySelectorAll('[data-ger-recently-viewed]').forEach(initRecentlyViewed);
    initQuickAddForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
