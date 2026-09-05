/**
 * Gulshan E Rehmat homepage interactions
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHero(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-ger-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ger-hero-dot]'));
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
        dot.classList.toggle('is-active', n === index);
        dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
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

  function initTestimonials(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-ger-testimonial]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-ger-testimonial-dot]'));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, n) {
        slide.classList.toggle('is-active', n === index);
      });
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
      });
    }

    function start() {
      if (prefersReducedMotion()) return;
      stop();
      timer = window.setInterval(function () {
        goTo(index + 1);
      }, 6000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        goTo(n);
        start();
      });
    });

    goTo(0);
    start();
  }

  function initFadeIns() {
    var nodes = document.querySelectorAll('.ger-fade-in');
    if (!nodes.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) {
        n.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function initCollections(root) {
    if (root.getAttribute('data-ger-col-ready') === 'true') return;
    root.setAttribute('data-ger-col-ready', 'true');

    var viewport = root.querySelector('[data-ger-col-viewport]');
    var track = root.querySelector('[data-ger-col-track]');
    if (!viewport || !track) return;

    var originalCards = Array.prototype.slice.call(track.querySelectorAll('[data-ger-col-card]'));
    if (originalCards.length < 2) return;

    var prevBtn = root.querySelector('[data-ger-col-prev]');
    var nextBtn = root.querySelector('[data-ger-col-next]');
    var dotsWrap = root.querySelector('[data-ger-col-dots]');
    var interval = parseInt(root.getAttribute('data-autoplay') || '0', 10);
    var index = 0;
    var timer = null;
    var isAnimating = false;
    var drag = {
      active: false,
      startX: 0,
      currentX: 0,
      moved: false,
      suppressClick: false
    };

    // Clone cards for seamless infinite loop
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.removeAttribute('data-ger-col-card');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a').forEach(function (a) {
        a.setAttribute('tabindex', '-1');
      });
      track.appendChild(clone);
    });

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      originalCards.forEach(function (_, n) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ger-collections__dot' + (n === 0 ? ' is-active' : '');
        btn.setAttribute('aria-label', 'Go to collection group ' + (n + 1));
        btn.addEventListener('click', function () {
          goTo(n, true);
          start();
        });
        dotsWrap.appendChild(btn);
        dots.push(btn);
      });
    }

    function gap() {
      var style = window.getComputedStyle(track);
      return parseFloat(style.columnGap || style.gap) || 0;
    }

    function step() {
      var card = track.querySelector('.ger-collection-card');
      if (!card) return 0;
      return card.getBoundingClientRect().width + gap();
    }

    function setTransform(px, instant) {
      if (instant) track.classList.add('is-instant');
      track.style.transform = 'translate3d(' + -px + 'px,0,0)';
      if (instant) {
        // force reflow then restore transition
        void track.offsetHeight;
        track.classList.remove('is-instant');
      }
    }

    function updateDots() {
      dots.forEach(function (dot, n) {
        dot.classList.toggle('is-active', n === index);
      });
    }

    function goTo(i, animate) {
      if (isAnimating && animate !== false) return;
      var s = step();
      if (!s) return;

      var total = originalCards.length;
      index = ((i % total) + total) % total;
      isAnimating = true;
      setTransform(index * s, animate === false);
      updateDots();

      window.setTimeout(
        function () {
          isAnimating = false;
        },
        animate === false ? 0 : 560
      );
    }

    function next() {
      var s = step();
      if (!s) return;
      var total = originalCards.length;
      isAnimating = true;
      index += 1;
      setTransform(index * s, false);

      window.setTimeout(function () {
        if (index >= total) {
          index = 0;
          setTransform(0, true);
        }
        updateDots();
        isAnimating = false;
      }, 560);
    }

    function prev() {
      var s = step();
      if (!s) return;
      var total = originalCards.length;

      if (index === 0) {
        // jump to clone end then animate back one
        index = total;
        setTransform(index * s, true);
        void track.offsetHeight;
      }

      isAnimating = true;
      index -= 1;
      setTransform(index * s, false);

      window.setTimeout(function () {
        if (index < 0) index = total - 1;
        updateDots();
        isAnimating = false;
      }, 560);
    }

    function start() {
      if (prefersReducedMotion() || interval <= 0) return;
      stop();
      timer = window.setInterval(next, interval);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag.active = true;
      drag.moved = false;
      drag.startX = e.clientX;
      drag.currentX = e.clientX;
      viewport.classList.add('is-dragging');
      stop();
      track.classList.add('is-instant');
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch (err) {}
    }

    function onPointerMove(e) {
      if (!drag.active) return;
      drag.currentX = e.clientX;
      var dx = drag.currentX - drag.startX;
      if (Math.abs(dx) > 6) drag.moved = true;
      var base = index * step();
      track.style.transform = 'translate3d(' + -(base - dx) + 'px,0,0)';
    }

    function onPointerUp(e) {
      if (!drag.active) return;
      drag.active = false;
      viewport.classList.remove('is-dragging');
      track.classList.remove('is-instant');
      var dx = drag.currentX - drag.startX;
      var threshold = Math.min(80, step() * 0.2);

      if (drag.moved) {
        drag.suppressClick = true;
        window.setTimeout(function () {
          drag.suppressClick = false;
        }, 250);
      }

      if (dx <= -threshold) next();
      else if (dx >= threshold) prev();
      else goTo(index, true);

      start();
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    track.addEventListener('click', function (e) {
      if (drag.suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });

    window.addEventListener('resize', function () {
      goTo(index, false);
    });

    goTo(0, false);
    start();
  }

  function initWishlist(root) {
    var keyStore = 'ger_wishlist_ids';
    var saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(keyStore) || '[]');
      if (!Array.isArray(saved)) saved = [];
    } catch (e) {
      saved = [];
    }

    function persist() {
      try {
        localStorage.setItem(keyStore, JSON.stringify(saved));
      } catch (e) {}
    }

    root.querySelectorAll('[data-ger-wishlist]').forEach(function (btn) {
      var id = String(btn.getAttribute('data-wishlist-key') || '');
      if (!id) return;

      function apply() {
        var active = saved.indexOf(id) !== -1;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        var label = active ? 'Remove from wishlist' : 'Add to wishlist';
        btn.setAttribute('aria-label', label);
      }

      apply();
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var i = saved.indexOf(id);
        if (i === -1) saved.push(id);
        else saved.splice(i, 1);
        persist();
        apply();
      });
    });
  }

  function boot() {
    document.querySelectorAll('[data-ger-hero]').forEach(initHero);
    document.querySelectorAll('[data-ger-testimonials]').forEach(initTestimonials);
    document.querySelectorAll('[data-ger-collections]').forEach(initCollections);
    document.querySelectorAll('[data-ger-featured]').forEach(initWishlist);
    initFadeIns();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
})();
