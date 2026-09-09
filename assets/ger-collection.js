(function () {
  'use strict';

  var DEBUG = false;
  function log() {
    if (!DEBUG) return;
    try {
      console.log.apply(console, ['[GER ATC]'].concat([].slice.call(arguments)));
    } catch (e) {}
  }

  function getWishlistIds() {
    try {
      var saved = JSON.parse(localStorage.getItem('ger_wishlist_ids') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  }

  function setWishlistIds(ids) {
    try {
      localStorage.setItem('ger_wishlist_ids', JSON.stringify(ids));
    } catch (e) {}
    syncHeaderBadge(ids);
    document.dispatchEvent(new CustomEvent('ger:wishlist:change', { detail: { ids: ids } }));
  }

  function syncHeaderBadge(ids) {
    var list = ids || getWishlistIds();
    document.querySelectorAll('[data-ger-wishlist-count-text]').forEach(function (el) {
      el.textContent = String(list.length);
    });
    document.querySelectorAll('[data-ger-wishlist-count]').forEach(function (el) {
      el.classList.toggle('is-empty', list.length === 0);
    });
  }

  function applyWishlistState(scope) {
    var saved = getWishlistIds();
    (scope || document).querySelectorAll('[data-ger-wishlist]').forEach(function (btn) {
      var id = String(btn.getAttribute('data-wishlist-key') || '');
      if (!id) return;
      var active = saved.indexOf(id) !== -1;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist');
    });
    syncHeaderBadge(saved);
  }

  function restoreListView() {
    try {
      var stored = sessionStorage.getItem('product-grid-view-desktop');
      if (stored === 'list') {
        var grid = document.querySelector('.ger-collection-page .product-grid');
        var input = document.querySelector('.ger-collection-page input[name="grid"][value="list"]');
        if (grid) grid.setAttribute('product-grid-view', 'list');
        if (input) input.checked = true;
        document.documentElement.classList.add('ger-collection-list-view');
      }
    } catch (e) {}
  }

  function enhanceFilters() {
    document.querySelectorAll('.ger-collection-page .facets-block-wrapper--vertical').forEach(function (wrap) {
      if (wrap.id === 'filters-drawer') return;
      var target =
        wrap.querySelector('.facets--vertical') ||
        wrap.querySelector('.facets') ||
        wrap.querySelector('form') ||
        wrap;

      if (!wrap.querySelector('.ger-filters-header')) {
        var header = document.createElement('div');
        header.className = 'ger-filters-header';
        var title = document.createElement('h2');
        title.className = 'ger-filters-header__title';
        title.textContent = 'Filters';
        header.appendChild(title);

        var clearBtn =
          wrap.querySelector('.facets__clear-all-link') ||
          wrap.querySelector('.facets__clear-all') ||
          wrap.querySelector('[ref="clearButton"]');
        if (clearBtn) {
          clearBtn.textContent = 'Clear All';
          header.appendChild(clearBtn);
        } else {
          var clear = document.createElement('button');
          clear.type = 'button';
          clear.className = 'facets__clear-all-link';
          clear.textContent = 'Clear All';
          clear.addEventListener('click', function () {
            var form = wrap.querySelector('form');
            if (!form) return;
            form.querySelectorAll('input[type="checkbox"]:checked').forEach(function (el) {
              el.checked = false;
            });
            if (typeof form.requestSubmit === 'function') form.requestSubmit();
            else form.submit();
          });
          header.appendChild(clear);
        }
        target.insertBefore(header, target.firstChild);
      }

      if (wrap.querySelector('.ger-apply-filters')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ger-apply-filters';
      btn.textContent = 'Apply Filters';
      btn.addEventListener('click', function () {
        var form = wrap.querySelector('form') || document.querySelector('.ger-collection-page form.facets');
        if (form) {
          if (typeof form.requestSubmit === 'function') form.requestSubmit();
          else form.submit();
          return;
        }
        var drawerClose = document.querySelector('.facets-drawer [ref="closeButton"], .facets-drawer .drawer__close');
        if (drawerClose) drawerClose.click();
        window.scrollTo({ top: wrap.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      });
      target.appendChild(btn);
    });
  }

  function getVariantId(form) {
    var input = form.querySelector('[name="id"]');
    return input ? input.value : null;
  }

  function getQuantity(form) {
    var input = form.querySelector('[name="quantity"], .quantity__input, quantity-selector input');
    var qty = input ? Number(input.value || 1) : 1;
    return Math.max(1, qty);
  }

  function setAtcState(button, state, message) {
    if (!button) return;
    button.classList.remove('is-ger-loading', 'is-ger-success', 'is-ger-error');
    // Do NOT disable here before Horizon submit — product-form aborts when the ATC button is disabled.
    if (state !== 'loading') {
      button.disabled = false;
    }
    button.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');

    var label = button.querySelector('[data-ger-atc-label]');
    if (!label) {
      label = button.querySelector('.ger-atc-label');
    }
    if (!label) return;

    if (state === 'loading') {
      button.classList.add('is-ger-loading');
      label.textContent = 'Adding...';
    } else if (state === 'success') {
      button.classList.add('is-ger-success');
      label.textContent = '✓ Added to cart';
      window.setTimeout(function () {
        button.classList.remove('is-ger-success');
        label.textContent = 'Add to Cart';
      }, 1600);
    } else if (state === 'error') {
      button.classList.add('is-ger-error');
      label.textContent = 'Add to Cart';
      showFormError(button, message || 'Could not add to cart');
    } else {
      label.textContent = 'Add to Cart';
    }
  }

  function showFormError(button, message) {
    var form = button.closest('form') || button.closest('product-form-component');
    if (!form) {
      alert(message);
      return;
    }
    var errorEl = form.querySelector('[ref="addToCartTextError"], .product-form-text__error');
    if (!errorEl) {
      alert(message);
      return;
    }
    errorEl.classList.remove('hidden');
    var textNode = null;
    errorEl.childNodes.forEach(function (node) {
      if (node.nodeType === 3 && node.textContent.trim()) textNode = node;
    });
    if (textNode) textNode.textContent = message;
    else errorEl.appendChild(document.createTextNode(message));
    window.setTimeout(function () {
      errorEl.classList.add('hidden');
    }, 6000);
  }

  async function addToCartAndCheckout(form) {
    var id = getVariantId(form);
    var quantity = getQuantity(form);
    log('Buy it now clicked', 'Variant ID:', id, 'Quantity:', quantity);
    if (!id) {
      alert('Missing product variant');
      return;
    }
    try {
      var res = await fetch(
        (window.Shopify && window.Shopify.routes && window.Shopify.routes.root ? window.Shopify.routes.root : '/') +
          'cart/add.js',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: [{ id: Number(id), quantity: quantity }] }),
        }
      );
      log('Buy it now response', res.status);
      if (!res.ok) {
        var errBody = null;
        try {
          errBody = await res.json();
        } catch (e) {}
        throw new Error((errBody && (errBody.description || errBody.message)) || 'Unable to add to bag');
      }
      window.location.href = '/checkout';
    } catch (err) {
      alert(err.message || 'Could not continue to checkout');
    }
  }

  function ensureAtcLabel(button) {
    if (!button || button.querySelector('[data-ger-atc-label], .ger-atc-label')) return;
    // Softly normalize visible text without destroying Horizon added-state markup
    var added = button.querySelector('.add-to-cart__added');
    var label = document.createElement('span');
    label.className = 'ger-atc-label';
    label.setAttribute('data-ger-atc-label', '');
    label.textContent = 'Add to Cart';

    // Remove loose text nodes that say "Add to cart"
    Array.prototype.slice.call(button.childNodes).forEach(function (node) {
      if (node.nodeType === 3 && /add to cart/i.test(node.textContent || '')) {
        node.textContent = '';
      }
    });
    if (added) button.insertBefore(label, added);
    else button.appendChild(label);
  }

  function enhanceBuyButtons(scope) {
    (scope || document).querySelectorAll('.ger-collection-page .buy-buttons-block').forEach(function (block) {
      var form =
        block.tagName === 'FORM'
          ? block
          : block.querySelector(
              'form[data-type="add-to-cart-form"], form.shopify-product-form, product-form-component form, form'
            );
      if (!form) return;

      var accelerated = block.querySelector(
        '.shopify-payment-button, .accelerated-checkout-block, shopify-accelerated-checkout'
      );
      if (accelerated) accelerated.style.display = 'none';

      var atc = block.querySelector('.add-to-cart-button, button[type="submit"][name="add"]');
      if (atc) ensureAtcLabel(atc);
    });
  }

  function bindAtcLoadingFeedback() {
    if (window.__gerAtcLoadingBound) return;
    window.__gerAtcLoadingBound = true;

    document.addEventListener(
      'click',
      function (event) {
        var btn = event.target && event.target.closest
          ? event.target.closest('.ger-collection-page .buy-buttons-block .add-to-cart-button')
          : null;
        if (!btn) return;
        var form = btn.closest('form');
        var variantId = form ? getVariantId(form) : null;
        var quantity = form ? getQuantity(form) : 1;
        log('Add to cart clicked');
        log('Variant ID:', variantId);
        log('Quantity:', quantity);
        ensureAtcLabel(btn);
        setAtcState(btn, 'loading');
        btn.dataset.gerPending = '1';
      },
      true
    );

    // Success path: Horizon cart update event
    document.addEventListener('cart:update', function () {
      document.querySelectorAll('.ger-collection-page .add-to-cart-button[data-ger-pending="1"]').forEach(function (btn) {
        btn.dataset.gerPending = '';
        setAtcState(btn, 'success');
      });
    });

    // Fallback: watch fetch to /cart/add.js
    if (!window.__gerAtcFetchPatched && window.fetch) {
      window.__gerAtcFetchPatched = true;
      var originalFetch = window.fetch.bind(window);
      window.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : input && input.url;
        var isAdd = url && String(url).indexOf('/cart/add') !== -1;
        return originalFetch(input, init).then(function (response) {
          if (!isAdd) return response;
          var pending = document.querySelectorAll('.ger-collection-page .add-to-cart-button[data-ger-pending="1"]');
          if (!pending.length) return response;
          if (response.ok) {
            pending.forEach(function (btn) {
              btn.dataset.gerPending = '';
              setAtcState(btn, 'success');
            });
          } else {
            response
              .clone()
              .json()
              .then(function (body) {
                pending.forEach(function (btn) {
                  btn.dataset.gerPending = '';
                  setAtcState(btn, 'error', (body && (body.description || body.message)) || 'Could not add to cart');
                });
              })
              .catch(function () {
                pending.forEach(function (btn) {
                  btn.dataset.gerPending = '';
                  setAtcState(btn, 'error');
                });
              });
          }
          return response;
        });
      };
    }
  }

  if (!window.__gerWishlistDelegated) {
    window.__gerWishlistDelegated = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-ger-wishlist]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var id = String(btn.getAttribute('data-wishlist-key') || '');
      if (!id) return;
      var saved = getWishlistIds();
      var i = saved.indexOf(id);
      if (i === -1) saved.push(id);
      else saved.splice(i, 1);
      setWishlistIds(saved);
      applyWishlistState(document);
    });
  }

  function updateVariantCardCount() {
    var grid = document.querySelector('.ger-collection-page .product-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.product-grid__item');
    if (!cards.length) return;
    var count = cards.length;
    var label = count === 1 ? '1 item' : count + ' items';
    document.querySelectorAll('.ger-collection-page .products-count-wrapper [role="status"]').forEach(function (el) {
      el.textContent = label;
    });
  }

  function initColorCards(scope) {
    (scope || document).querySelectorAll('[data-ger-color-card]').forEach(function (card) {
      if (card.dataset.gerColorReady === 'true') return;
      card.dataset.gerColorReady = 'true';

      var img = card.querySelector('[data-ger-color-card-image]');
      var links = card.querySelectorAll('[data-ger-color-card-link]');
      var variantInput = card.querySelector('[data-ger-color-card-variant]');
      var atc = card.querySelector('[data-ger-color-card-atc]');

      card.querySelectorAll('[data-ger-color-swatch]').forEach(function (swatch) {
        swatch.addEventListener('click', function () {
          card.querySelectorAll('[data-ger-color-swatch]').forEach(function (s) {
            s.classList.remove('is-selected');
          });
          swatch.classList.add('is-selected');

          var url = swatch.getAttribute('data-variant-url');
          var image = swatch.getAttribute('data-image');
          var id = swatch.getAttribute('data-variant-id');
          var unavailable = swatch.classList.contains('is-unavailable');

          if (image && img) img.src = image;
          if (url) {
            links.forEach(function (a) {
              a.setAttribute('href', url);
            });
          }
          if (id && variantInput) variantInput.value = id;
          if (atc) {
            atc.disabled = unavailable;
            atc.setAttribute('aria-disabled', unavailable ? 'true' : 'false');
            atc.textContent = unavailable ? 'Sold out' : 'Add to cart';
          }
        });
      });
    });
  }

  function boot() {
    applyWishlistState(document);
    restoreListView();
    enhanceFilters();
    enhanceBuyButtons(document);
    bindAtcLoadingFeedback();
    updateVariantCardCount();
    initColorCards(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  document.addEventListener('shopify:section:load', boot);
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.ger-collection-page .product-grid');
    if (grid) {
      new MutationObserver(function () {
        applyWishlistState(document);
        enhanceBuyButtons(document);
        updateVariantCardCount();
        initColorCards(document);
      }).observe(grid, { childList: true, subtree: true });
    }
  });
})();
