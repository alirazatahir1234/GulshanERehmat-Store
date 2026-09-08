/**
 * Refund & Exchange Policy — enhance Shopify .shopify-policy__* markup
 * (templates/policy.liquid is ignored by Online Store).
 */
(function () {
  const path = window.location.pathname || '';
  if (!/\/policies\/refund-policy\/?$/.test(path)) return;

  const CONTACT = {
    email: 'sales@gulshanerehmat.com',
    phone: '+92 333 8709009',
    wa: 'https://wa.me/923338709009?text=' + encodeURIComponent('Hello Gulshan E Rehmat, I need help with a return or exchange.'),
  };

  const FALLBACK_INTRO =
    '<p>At <strong>Gulshan E Rehmat</strong>, we strive to provide premium quality fabrics and clothing. Customer satisfaction is important to us, and we want you to shop with confidence.</p>' +
    '<p>Please read our Refund &amp; Exchange Policy carefully before placing an order.</p>';

  const FALLBACK_SECTIONS = [
    {
      title: 'Eligibility for Return or Exchange',
      icon: 'check',
      html:
        '<p>You may request a return or exchange if:</p><ul><li>You received a damaged or defective product.</li><li>You received an incorrect product.</li><li>The product delivered is different from the product you ordered.</li></ul><p>To request a return or exchange, please contact us within <strong class="ger-refund__highlight">7 days of receiving your order</strong>.</p>',
    },
    {
      title: 'Conditions for Return',
      icon: 'tag',
      html:
        '<p>To be eligible for a return or exchange:</p><ul><li>The product must be unused, unworn, and unwashed.</li><li>The product must be returned in its original condition.</li><li>Original tags, labels, packaging, and accessories must be included.</li><li>The product must not have been altered or damaged after delivery.</li><li>Proof of purchase or order number must be provided.</li></ul><p>We reserve the right to refuse returns that do not meet these conditions.</p>',
    },
    {
      title: 'Non-Returnable & Non-Refundable Items',
      icon: 'block',
      html:
        '<p>The following items may not be eligible for return or exchange:</p><ul><li>Sale or discounted items.</li><li>Items purchased during special promotions.</li><li>Customized or altered products.</li><li>Products that have been worn, washed, or used.</li><li>Products without original tags or packaging.</li><li>Unstitched fabric that has been cut, altered, or damaged after delivery.</li></ul>',
    },
    {
      title: 'Damaged or Incorrect Products',
      icon: 'alert',
      html:
        '<p>If you receive a damaged, defective, or incorrect product, please contact us within <strong class="ger-refund__highlight">48 hours of delivery</strong>.</p><p>Please provide:</p><ul><li>Your order number.</li><li>Clear photos or videos of the product.</li><li>A brief description of the issue.</li></ul><p>Once our team reviews and approves your request, we will arrange a replacement, exchange, or refund where applicable.</p>',
    },
    {
      title: 'Refund Process',
      icon: 'refund',
      html:
        '<p>Once your returned item is received and inspected, we will notify you regarding the approval or rejection of your refund.</p><p>If your refund is approved:</p><ul><li>Refunds will be processed using the original payment method where applicable.</li><li>For Cash on Delivery (COD) orders, approved refunds may be issued as a bank transfer or store credit.</li><li>Processing times may vary depending on your bank or payment provider.</li><li>Shipping charges are generally non-refundable unless the return is due to an error on our part.</li></ul>',
    },
    {
      title: 'Exchange Policy',
      icon: 'swap',
      html:
        '<p>Exchanges are subject to product availability.</p><p>If the requested product is unavailable, we may offer:</p><ul><li>A replacement product of equal value.</li><li>Store credit.</li><li>A refund, where applicable.</li></ul>',
    },
    {
      title: 'Return Shipping',
      icon: 'truck',
      html:
        '<p><strong>Our Error</strong> — incorrect, damaged, or defective product: Gulshan E Rehmat may cover the return shipping costs.</p><p><strong>Customer Preference</strong> — change of mind or incorrect selection: return shipping costs may be the responsibility of the customer.</p>',
    },
    {
      title: 'Order Cancellation',
      icon: 'cancel',
      html:
        '<p>Orders can only be cancelled before they have been processed or shipped.</p><p>Once an order has been dispatched, it cannot be cancelled and will be subject to our Return &amp; Exchange Policy.</p>',
    },
    {
      title: 'Need Help?',
      icon: 'support',
      html:
        '<p>For any refund, return, or exchange request, contact Gulshan E Rehmat with your order number. We are happy to help.</p>',
    },
  ];

  const ICONS = {
    check:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12.2l2.4 2.4L16.2 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tag:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 12.5V4.5H11.5L20.5 13.5l-8 8L3.5 12.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/></svg>',
    block:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 7.5l9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    alert:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4l9 16H3L12 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4M12 16.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    refund:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v4M8 6.5A7 7 0 1012 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 8H5V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    swap:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7h11l-2.5-2.5M17 17H6l2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    truck:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 7h12v9H1zM13 10h4l3 3v3h-7v-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="5.5" cy="17.5" r="1.5" stroke="currentColor" stroke-width="1.4"/><circle cx="16.5" cy="17.5" r="1.5" stroke="currentColor" stroke-width="1.4"/></svg>',
    cancel:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 10h6M9 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    support:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14v-3a7 7 0 0114 0v3" stroke="currentColor" stroke-width="1.6"/><path d="M5 14a2 2 0 002 2h1v-5H7a2 2 0 00-2 2zM19 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 19a3 3 0 003-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    diamond:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9l4-5h10l4 5-9 11L3 9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 9h18M8 4l2 5M16 4l-2 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    box:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8l9-4 9 4-9 4-9-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 8v8l9 4 9-4V8M12 12v8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pickIcon(title, index) {
    const t = (title || '').toLowerCase();
    if (t.includes('eligib')) return 'check';
    if (t.includes('condition')) return 'tag';
    if (t.includes('non-return') || t.includes('non-refund')) return 'block';
    if (t.includes('damaged') || t.includes('incorrect')) return 'alert';
    if (t.includes('refund process') || t.includes('refund')) return 'refund';
    if (t.includes('exchange')) return 'swap';
    if (t.includes('shipping')) return 'truck';
    if (t.includes('cancel')) return 'cancel';
    if (t.includes('contact') || t.includes('help') || t.includes('need')) return 'support';
    const order = ['check', 'tag', 'block', 'alert', 'refund', 'swap', 'truck', 'cancel', 'support'];
    return order[index % order.length];
  }

  function highlightTerms(html) {
    return (html || '')
      .replace(/\b7 days of receiving your order\b/gi, '<strong class="ger-refund__highlight">7 days of receiving your order</strong>')
      .replace(/\b48 hours of delivery\b/gi, '<strong class="ger-refund__highlight">48 hours of delivery</strong>');
  }

  function parseFromSource(source) {
    const nodes = Array.from(source.childNodes);
    const sections = [];
    let introHtml = '';
    let current = null;

    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toUpperCase() === 'H2') {
        if (current) sections.push(current);
        current = { title: (node.textContent || '').trim(), html: '' };
        return;
      }

      let html = '';
      if (node.nodeType === Node.ELEMENT_NODE) html = node.outerHTML;
      else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        html = `<p>${escapeHtml(node.textContent.trim())}</p>`;
      }
      if (!html) return;
      if (!current) introHtml += html;
      else current.html += html;
    });
    if (current) sections.push(current);

    const filtered = sections.filter(
      (s) => s.title && !/^last updated/i.test(s.title) && !/^contact us$/i.test(s.title)
    );
    return { introHtml, sections: filtered };
  }

  function buildPage(introHtml, sections) {
    const page = document.createElement('div');
    page.className = 'ger-refund';

    const cards = sections
      .map((s, i) => {
        const num = String(i + 1).padStart(2, '0');
        const icon = ICONS[s.icon || pickIcon(s.title, i)] || ICONS.check;
        const title = s.title.replace(/^\d+\.\s*/, '').replace(/^0?\d+\s*/, '');
        return `
          <article class="ger-refund__card">
            <div class="ger-refund__card-icon" aria-hidden="true">${icon}</div>
            <div class="ger-refund__card-body">
              <h2 class="ger-refund__card-title"><span class="ger-refund__card-num">${num}</span> ${escapeHtml(title)}</h2>
              <div class="ger-refund__card-content rte">${highlightTerms(s.html || '')}</div>
            </div>
          </article>
        `;
      })
      .join('');

    page.innerHTML = `
      <header class="ger-refund__hero">
        <div class="ger-refund__hero-bg" aria-hidden="true"></div>
        <div class="ger-refund__hero-inner">
          <div class="ger-refund__hero-copy">
            <h1 class="ger-refund__hero-title">Refund &amp; Exchange Policy</h1>
            <p class="ger-refund__hero-text">Your satisfaction is important to us. Shop with confidence at Gulshan E Rehmat.</p>
          </div>
          <ul class="ger-refund__hero-accents" aria-hidden="true">
            <li>Premium Fabrics</li>
            <li>Timeless Style</li>
            <li>Happy Customers</li>
          </ul>
        </div>
      </header>

      <nav class="ger-refund__breadcrumb" aria-label="Breadcrumb">
        <div class="ger-refund__container">
          <a href="/">Home</a>
          <span class="ger-refund__breadcrumb-sep" aria-hidden="true">›</span>
          <span class="ger-refund__breadcrumb-current">Refund &amp; Exchange Policy</span>
        </div>
      </nav>

      <div class="ger-refund__main">
        <div class="ger-refund__container">
          <div class="ger-refund__intro rte">${introHtml || FALLBACK_INTRO}</div>
          <div class="ger-refund__grid">${cards}</div>

          <aside class="ger-refund__contact">
            <div class="ger-refund__contact-icon" aria-hidden="true">${ICONS.support}</div>
            <div class="ger-refund__contact-copy">
              <h2 class="ger-refund__contact-title">Contact Us</h2>
              <p class="ger-refund__contact-text">Need help with a return or exchange? Reach us with your order number.</p>
            </div>
            <div class="ger-refund__contact-actions">
              <a class="ger-refund__wa" href="${CONTACT.wa}" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp ${escapeHtml(CONTACT.phone)}
                <span aria-hidden="true">→</span>
              </a>
              <a class="ger-refund__email" href="mailto:${CONTACT.email}">${escapeHtml(CONTACT.email)}</a>
            </div>
          </aside>
        </div>
      </div>

      <section class="ger-refund__trust" aria-label="Why shop with us">
        <div class="ger-refund__container ger-refund__trust-grid">
          <div class="ger-refund__trust-item">
            <span class="ger-refund__trust-icon" aria-hidden="true">${ICONS.diamond}</span>
            <h3>Premium Quality</h3>
          </div>
          <div class="ger-refund__trust-item">
            <span class="ger-refund__trust-icon" aria-hidden="true">${ICONS.lock}</span>
            <h3>Secure Shopping</h3>
          </div>
          <div class="ger-refund__trust-item">
            <span class="ger-refund__trust-icon" aria-hidden="true">${ICONS.box}</span>
            <h3>Hassle-Free Returns</h3>
          </div>
          <div class="ger-refund__trust-item">
            <span class="ger-refund__trust-icon" aria-hidden="true">${ICONS.support}</span>
            <h3>Dedicated Support</h3>
          </div>
        </div>
      </section>

      <p class="ger-refund__thanks">Thank you for being a part of our journey ♡</p>
    `;

    return page;
  }

  function enhance() {
    const container = document.querySelector('.shopify-policy__container');
    if (!container || container.dataset.gerEnhanced === 'true') return;

    const bodyRoot =
      container.querySelector('.shopify-policy__body .rte') ||
      container.querySelector('.shopify-policy__body') ||
      container.querySelector('.rte');

    let introHtml = FALLBACK_INTRO;
    let sections = FALLBACK_SECTIONS.map((s) => ({ ...s }));

    if (bodyRoot) {
      const source =
        bodyRoot.querySelector(':scope > div') && bodyRoot.querySelector(':scope > div').querySelector('h2, p')
          ? bodyRoot.querySelector(':scope > div')
          : bodyRoot;
      const parsed = parseFromSource(source);
      if (parsed.sections.length >= 4) {
        introHtml = parsed.introHtml.trim() || FALLBACK_INTRO;
        sections = parsed.sections.map((s, i) => ({
          title: s.title,
          html: s.html,
          icon: pickIcon(s.title, i),
        }));
      }
    }

    container.innerHTML = '';
    container.appendChild(buildPage(introHtml, sections));
    container.classList.add('ger-refund-host');
    container.dataset.gerEnhanced = 'true';
    document.body.classList.add('ger-refund-page');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }
})();
