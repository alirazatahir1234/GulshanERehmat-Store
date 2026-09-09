/**
 * Collection banner slider (Kafoor / GER collection pages).
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initBanner(root) {
    if (!(root instanceof HTMLElement) || root.dataset.gerBannerReady === 'true') return;
    root.dataset.gerBannerReady = 'true';

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-ger-collection-banner-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ger-collection-banner-dot]'));
    var prev = root.querySelector('[data-ger-collection-banner-prev]');
    var next = root.querySelector('[data-ger-collection-banner-next]');
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var interval = parseInt(root.getAttribute('data-autoplay') || '5500', 10);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
      });
      dots.forEach(function (dot, n) {
        var active = n === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function start() {
      if (prefersReducedMotion() || interval <= 0) return;
      stop();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, interval);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        goTo(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        goTo(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        goTo(n);
        start();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    goTo(0);
    start();
  }

  function boot() {
    document.querySelectorAll('[data-ger-collection-banner]').forEach(initBanner);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
