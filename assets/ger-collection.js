(function () {
  'use strict';
  function getWishlistIds() {
    try {
      var saved = JSON.parse(localStorage.getItem('ger_wishlist_ids') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (e) { return []; }
  }
  function setWishlistIds(ids) {
    try { localStorage.setItem('ger_wishlist_ids', JSON.stringify(ids)); } catch (e) {}
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
      if (i === -1) saved.push(id); else saved.splice(i, 1);
      setWishlistIds(saved);
      applyWishlistState(document);
    });
  }
  function boot() {
    applyWishlistState(document);
    restoreListView();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('shopify:section:load', boot);
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.ger-collection-page .product-grid');
    if (grid) {
      new MutationObserver(function () { applyWishlistState(document); }).observe(grid, { childList: true, subtree: true });
    }
  });
})();
