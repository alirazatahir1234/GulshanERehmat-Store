/**
 * Enhance Shopify's built-in .shopify-policy__* Privacy Policy markup
 * (theme templates/policy.liquid is ignored by Online Store).
 */
(function () {
  const path = window.location.pathname || '';
  if (!/\/policies\/privacy-policy\/?$/.test(path)) return;

  const container = document.querySelector('.shopify-policy__container');
  if (!container || container.dataset.gerEnhanced === 'true') return;

  const bodyRoot =
    container.querySelector('.shopify-policy__body .rte') ||
    container.querySelector('.shopify-policy__body') ||
    container.querySelector('.rte');
  if (!bodyRoot) return;

  // Prefer the innermost content wrapper that holds the paragraphs/h2s
  const source =
    bodyRoot.querySelector(':scope > div') && bodyRoot.querySelector(':scope > div').querySelector('h2, p')
      ? bodyRoot.querySelector(':scope > div')
      : bodyRoot;

  let contact = {
    email: 'sales@gulshanerehmat.com',
    phone: '+92 333 8709009',
    address: 'Main Bazar Pasrur',
  };
  try {
    const cfg = document.getElementById('ger-privacy-contact');
    if (cfg) contact = { ...contact, ...JSON.parse(cfg.textContent || '{}') };
  } catch (e) {
    /* keep defaults */
  }

  const ICONS = {
    shield:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    document:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 3h6l4 4v14H8V3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v4h4M10 12h6M10 16h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    gear:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 16l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    share:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7" cy="12" r="2.2" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="7" r="2.2" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17" r="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M9 11.2l6-3.4M9 12.8l6 3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    lock:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    cookie:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="9" r="1" fill="currentColor"/><circle cx="11" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg>',
    link:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 14a4 4 0 005.7.3l2-2a4 4 0 00-5.7-5.7l-1.1 1.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M14 10a4 4 0 00-5.7-.3l-2 2a4 4 0 005.7 5.7l1.1-1.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    people:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="16" cy="9" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 18c.6-2.5 2.6-4 5-4s4.4 1.5 5 4M14 14.2c1.5.3 2.8 1.3 3.4 3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    checklist:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4h10a2 2 0 012 2v14H8a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.6"/><path d="M10 10h6M10 14h6M7 10l1 1 2-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    refresh:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12a8 8 0 11-2.3-5.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M20 4v5h-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.5 4.5h3l1 4-2 1.5a11 11 0 005 5l1.5-2 4 1v3a2 2 0 01-2.2 2A15 15 0 014.5 6.7a2 2 0 012-2.2h2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M4 8l8 5 8-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="11" r="2" stroke="currentColor" stroke-width="1.6"/></svg>',
    heart:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.2-4.35-9.6-8.4C.6 9.45 2.1 6 5.4 6c1.8 0 3.15 1.05 3.9 2.1C10.05 7.05 11.4 6 13.2 6c3.3 0 4.8 3.45 3 6.6C19.2 16.65 12 21 12 21z"/></svg>',
  };

  const ICON_ORDER = [
    'shield',
    'document',
    'gear',
    'share',
    'lock',
    'cookie',
    'link',
    'people',
    'checklist',
    'refresh',
    'phone',
    'document',
    'share',
    'lock',
  ];

  function pickIcon(title, index) {
    const t = (title || '').toLowerCase();
    if (t.includes('contact')) return 'phone';
    if (t.includes('child')) return 'people';
    if (t.includes('security') || t.includes('retention')) return 'lock';
    if (t.includes('cookie')) return 'cookie';
    if (t.includes('third') || t.includes('link')) return 'link';
    if (t.includes('right') || t.includes('choice')) return 'checklist';
    if (t.includes('change')) return 'refresh';
    if (t.includes('collect') || t.includes('source')) return 'document';
    if (t.includes('use')) return 'gear';
    if (t.includes('disclos') || t.includes('relationship')) return 'share';
    if (t.includes('intro')) return 'shield';
    return ICON_ORDER[index % ICON_ORDER.length];
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildContactCards() {
    const wrap = document.createElement('div');
    wrap.className = 'ger-privacy__contact-cards';
    const items = [
      { icon: 'mail', label: contact.email, href: contact.email ? `mailto:${contact.email}` : '' },
      {
        icon: 'phone',
        label: contact.phone,
        href: contact.phone ? `tel:${String(contact.phone).replace(/\s+/g, '')}` : '',
      },
      { icon: 'pin', label: contact.address, href: '' },
    ].filter((item) => item.label);

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'ger-privacy__contact-card';
      const value = item.href
        ? `<a href="${item.href}">${escapeHtml(item.label)}</a>`
        : `<span>${escapeHtml(item.label)}</span>`;
      card.innerHTML = `<span class="ger-privacy__contact-icon" aria-hidden="true">${ICONS[item.icon]}</span>${value}`;
      wrap.appendChild(card);
    });
    return wrap;
  }

  const nodes = Array.from(source.childNodes);
  const sections = [];
  let introHtml = '';
  let current = null;

  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && /^H[1-3]$/i.test(node.tagName)) {
      if (current) sections.push(current);
      current = { title: (node.textContent || '').trim(), html: '' };
      return;
    }

    let html = '';
    if (node.nodeType === Node.ELEMENT_NODE) {
      html = node.outerHTML;
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      html = `<p>${escapeHtml(node.textContent.trim())}</p>`;
    }
    if (!html) return;

    if (!current) introHtml += html;
    else current.html += html;
  });
  if (current) sections.push(current);

  const filtered = sections.filter((s) => s.title && !/^last updated/i.test(s.title));

  const page = document.createElement('div');
  page.className = 'ger-privacy';

  page.innerHTML = `
    <header class="ger-privacy__hero">
      <div class="ger-privacy__hero-bg" aria-hidden="true"></div>
      <div class="ger-privacy__hero-inner">
        <div class="ger-privacy__hero-copy">
          <h1 class="ger-privacy__hero-title">Privacy Policy</h1>
          <p class="ger-privacy__hero-text">
            Your privacy is important to us. This Privacy Policy explains how Gulshan-e-Rehmat
            collects, uses, and protects your personal information when you visit our website
            or make a purchase.
          </p>
        </div>
        <p class="ger-privacy__hero-script" aria-hidden="true">Elegance, Trust, Always</p>
      </div>
    </header>
    <nav class="ger-privacy__breadcrumb" aria-label="Breadcrumb">
      <div class="ger-privacy__container">
        <a href="/">Home</a>
        <span class="ger-privacy__breadcrumb-sep" aria-hidden="true">›</span>
        <span class="ger-privacy__breadcrumb-current">Privacy Policy</span>
      </div>
    </nav>
    <div class="ger-privacy__main">
      <div class="ger-privacy__container">
        <div class="ger-privacy__sections"></div>
      </div>
    </div>
    <aside class="ger-privacy__trust">
      <div class="ger-privacy__trust-inner">
        <span class="ger-privacy__trust-icon" aria-hidden="true">${ICONS.heart}</span>
        <h2 class="ger-privacy__trust-title">Your Trust Inspires Us</h2>
        <p class="ger-privacy__trust-text">
          At Gulshan-e-Rehmat, your privacy is not just a policy — it’s a promise.
        </p>
      </div>
    </aside>
  `;

  const sectionsEl = page.querySelector('.ger-privacy__sections');
  let number = 1;

  if (introHtml.trim()) {
    const article = document.createElement('article');
    article.className = 'ger-privacy__section';
    article.innerHTML = `
      <div class="ger-privacy__section-icon" aria-hidden="true">${ICONS.shield}</div>
      <div class="ger-privacy__section-body">
        <h2 class="ger-privacy__section-title">${number}. Introduction</h2>
        <div class="ger-privacy__section-content rte">${introHtml}</div>
      </div>
    `;
    sectionsEl.appendChild(article);
    number += 1;
  }

  function applyContactDetails(html) {
    let out = html || '';
    out = out.replace(/\+92\s*301\s*6169209/gi, contact.phone);
    out = out.replace(/ali\.raza\.tahir@hotmail\.com/gi, contact.email);
    out = out.replace(/Lahore,\s*Lahore\s*51480,\s*Pakistan/gi, contact.address);
    out = out.replace(/Lahore,\s*Pakistan/gi, contact.address);
    return out;
  }

  filtered.forEach((s, index) => {
    const iconKey = pickIcon(s.title, index + (introHtml.trim() ? 1 : 0));
    const isContact = /contact/i.test(s.title);
    const bodyHtml = isContact ? applyContactDetails(s.html || '<p></p>') : s.html || '<p></p>';
    const article = document.createElement('article');
    article.className = 'ger-privacy__section';
    article.innerHTML = `
      <div class="ger-privacy__section-icon" aria-hidden="true">${ICONS[iconKey] || ICONS.document}</div>
      <div class="ger-privacy__section-body">
        <h2 class="ger-privacy__section-title">${number}. ${escapeHtml(s.title)}</h2>
        <div class="ger-privacy__section-content rte">${bodyHtml}</div>
      </div>
    `;
    if (isContact) {
      article.querySelector('.ger-privacy__section-content')?.appendChild(buildContactCards());
    }
    sectionsEl.appendChild(article);
    number += 1;
  });

  container.innerHTML = '';
  container.appendChild(page);
  container.classList.add('ger-privacy-host');
  container.dataset.gerEnhanced = 'true';
  document.body.classList.add('ger-privacy-page');
})();
