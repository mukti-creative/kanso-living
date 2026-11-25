/**
 * app.js — renders the landing page from CLIENT_CONFIG (see config.js).
 * No client data lives here. Sections:
 *   1. Helpers            5. Property cards + filters
 *   2. Theme              6. Property modal
 *   3. Static bindings    7. KPR calculator
 *   4. List renderers     8. Mobile menu + boot
 */
(function () {
  'use strict';

  var C = (typeof CLIENT_CONFIG !== 'undefined') ? CLIENT_CONFIG : null;
  if (!C) { console.error('CLIENT_CONFIG not found. Make sure config.js loads before app.js.'); return; }

  /* ======================================================================
   * 1. HELPERS
   * ==================================================================== */
  function get(path, root) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, root || C);
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /** Allow only safe URL schemes/paths from config (blocks javascript:, data: etc. in links). */
  function safeUrl(u) {
    var s = String(u == null ? '' : u).trim();
    return /^(https?:\/\/|mailto:|tel:|#|\.{0,2}\/|[\w-]+(\/|\.|$))/i.test(s) && !/^\s*(javascript|data|vbscript):/i.test(s) ? s : '#';
  }

  /* Image fallback: any failed <img> becomes a styled architectural placeholder (no broken icons). */
  var PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">' +
    '<rect width="800" height="600" fill="#EFF0FF"/><rect x="0" y="420" width="800" height="180" fill="#E2E8F0"/>' +
    '<rect x="180" y="190" width="260" height="230" fill="#1E5EFF"/><rect x="440" y="260" width="180" height="160" fill="#FF5A1F"/>' +
    '<rect x="215" y="225" width="70" height="90" fill="#FFFFFF" opacity=".85"/><rect x="315" y="225" width="90" height="90" fill="#FFC700"/>' +
    '<rect x="470" y="295" width="60" height="125" fill="#121417"/><path d="M160 190 H460" stroke="#121417" stroke-width="8"/></svg>');
  function applyFallback(img) {
    if (img.getAttribute('data-fallback')) return;
    img.setAttribute('data-fallback', '1');
    img.src = PLACEHOLDER;
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') applyFallback(e.target);
  }, true);
  function checkBrokenImages() {
    $$('img').forEach(function (img) { if (img.loading !== 'lazy' && img.complete && img.getAttribute('src') && img.naturalWidth === 0) applyFallback(img); });
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fill(sel, html) { $$(sel).forEach(function (el) { el.innerHTML = html; }); }

  var nf = new Intl.NumberFormat(C.locale || 'id-ID', { maximumFractionDigits: 0 });
  var prefix = (C.currency && C.currency.prefix) || 'Rp';
  /** 1250000000 → "Rp 1.250.000.000" */
  function money(n) { return prefix + '\u00A0' + nf.format(Math.round(n || 0)); }
  /** 2950000000 → "Rp 2,95 M" (compact, for cards) */
  function moneyShort(n) {
    if (n >= 1e9) return prefix + '\u00A0' + new Intl.NumberFormat(C.locale || 'id-ID', { maximumFractionDigits: 2 }).format(n / 1e9) + ' M';
    if (n >= 1e6) return prefix + '\u00A0' + new Intl.NumberFormat(C.locale || 'id-ID', { maximumFractionDigits: 1 }).format(n / 1e6) + ' Jt';
    return money(n);
  }

  /** Tone → Tailwind classes (full literal class names so Tailwind detects them). */
  var TONE = {
    primary:   { bg: 'bg-electric-blue', on: 'text-on-electric-blue', border: 'border-on-electric-blue', fg: 'text-electric-blue' },
    secondary: { bg: 'bg-tangerine',     on: 'text-on-tangerine',     border: 'border-on-tangerine',     fg: 'text-tangerine' },
    accent:    { bg: 'bg-sunlit-yellow', on: 'text-on-sunlit-yellow', border: 'border-on-sunlit-yellow', fg: 'text-sunlit-yellow' },
    dark:      { bg: 'bg-charcoal',      on: 'text-on-charcoal',      border: 'border-on-charcoal',      fg: 'text-charcoal' },
    surface:   { bg: 'bg-surface',       on: 'text-on-surface',       border: 'border-on-surface',       fg: 'text-on-surface' },
  };
  function tone(name) { return TONE[name] || TONE.surface; }

  /** Fill {placeholders} in a message template. */
  function template(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  /** Build a wa.me deep link from a config message key + variables. */
  function waLink(key, vars) {
    var msg = template(get('whatsapp.messages.' + key) || '', Object.assign({ brand: C.brand.name }, vars || {}));
    var phone = String(C.whatsapp.phone || '').replace(/\D/g, '');
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  /* ======================================================================
   * 2. THEME  (runs immediately → no color flash)
   * ==================================================================== */
  (function applyTheme() {
    var t = C.theme || {};
    var root = document.documentElement.style;
    var map = {
      '--color-primary': t.primary, '--color-secondary': t.secondary, '--color-accent': t.accent, '--color-dark': t.dark,
      '--color-surface': t.surface, '--color-surface-subtle': t.surfaceSubtle,
      '--color-on-surface': t.onSurface, '--color-on-surface-muted': t.onSurfaceMuted, '--color-outline': t.outline,
      '--color-on-primary': t.onPrimary, '--color-on-secondary': t.onSecondary, '--color-on-accent': t.onAccent, '--color-on-dark': t.onDark,
      '--color-dark-muted': t.darkMuted, '--color-dark-surface': t.darkSurface,
    };
    Object.keys(map).forEach(function (k) { if (map[k]) root.setProperty(k, map[k]); });
    // Light tints are derived automatically from the brand colors.
    ['primary', 'secondary', 'accent'].forEach(function (n) {
      root.setProperty('--color-' + n + '-tint', 'color-mix(in srgb, var(--color-' + n + ') 12%, #ffffff)');
    });
  })();

  /* ======================================================================
   * 3. STATIC BINDINGS  (data-text / data-img / data-alt / data-href / data-wa)
   * ==================================================================== */
  function bindStatic() {
    document.documentElement.lang = get('meta.lang') || 'id';
    document.title = get('meta.title') || C.brand.name;
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', get('meta.description') || '');

    $$('[data-text]').forEach(function (el) { var v = get(el.getAttribute('data-text')); if (v != null) el.textContent = v; });
    $$('[data-img]').forEach(function (el) { el.src = get(el.getAttribute('data-img')) || ''; });
    $$('[data-alt]').forEach(function (el) { el.alt = get(el.getAttribute('data-alt')) || ''; });
    $$('[data-href]').forEach(function (el) { el.href = safeUrl(get(el.getAttribute('data-href'))); });

    $$('[data-wa]').forEach(function (el) {
      var key = el.getAttribute('data-wa');
      if (key !== 'kpr') el.href = waLink(key);
    });

    // Hero photo treatment: 'natural' (original colors) or 'duotone' (blue tint)
    var duotone = get('hero.imageStyle') === 'duotone';
    var heroImg = $('#hero-img');
    if (heroImg) ['grayscale', 'contrast-125'].forEach(function (c) { heroImg.classList.toggle(c, duotone); });
    $$('[data-hero-tint]').forEach(function (el) { el.classList.toggle('hidden', !duotone); });
    $$('[data-hero-natural]').forEach(function (el) { el.classList.toggle('hidden', duotone); });

    var menuBtn = $('#menu-toggle'); if (menuBtn) menuBtn.setAttribute('aria-label', get('ui.openMenu'));
    var closeBtn = $('#modal-close'); if (closeBtn) closeBtn.setAttribute('aria-label', get('ui.close'));
    var filters = $('#property-filters'); if (filters) filters.setAttribute('aria-label', get('properties.filterAriaLabel'));
  }

  /* ======================================================================
   * 4. LIST RENDERERS
   * ==================================================================== */
  var FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-blue';

  function renderLists() {
    fill('[data-render="nav-desktop"]', C.nav.map(function (n) {
      return '<a href="' + esc(safeUrl(n.href)) + '" class="font-label text-label-lg text-on-surface-muted hover:text-on-surface transition-colors duration-state-change">' + esc(n.label) + '</a>';
    }).join(''));

    fill('[data-render="nav-mobile"]', C.nav.map(function (n) {
      return '<a href="' + esc(safeUrl(n.href)) + '" data-mobile-link class="flex items-center justify-between rounded-md px-md py-md font-label text-label-lg text-on-surface hover:bg-surface-subtle ' + FOCUS + '">' +
        esc(n.label) + '<span class="material-symbols-outlined text-on-surface-muted" aria-hidden="true">arrow_forward</span></a>';
    }).join(''));

    fill('[data-render="hero-metrics"]', C.hero.metrics.map(function (m) {
      return '<div class="flex flex-col gap-xs"><span class="font-headline text-headline-md text-on-surface tabular-nums">' + esc(m.value) +
        '</span><span class="font-label text-label-sm text-on-surface-muted">' + esc(m.label) + '</span></div>';
    }).join(''));

    function chip(c) {
      return '<span class="inline-flex items-center gap-xs rounded-full bg-surface text-on-surface px-md py-sm font-label text-label-sm whitespace-nowrap">' +
        '<span class="material-symbols-outlined ' + tone(c.tone).fg + ' text-label-lg" aria-hidden="true">' + esc(c.icon) + '</span>' + esc(c.label) + '</span>';
    }
    fill('[data-render="hero-badges"]', C.hero.badges.map(chip).join(''));
    fill('[data-render="hero-location"]', chip(C.hero.locationChip));

    fill('[data-render="pillars"]', C.pillars.items.map(function (p) {
      var t = tone(p.tone);
      return '<article class="h-full rounded-xl ' + t.bg + ' ' + t.on + ' p-xl flex flex-col justify-between gap-2xl transition-transform duration-card-hover ease-card-hover hover:-translate-y-1">' +
        '<span class="inline-flex items-center justify-center w-2xl h-2xl rounded-lg border ' + t.border + '"><span class="material-symbols-outlined text-headline-md" aria-hidden="true">' + esc(p.icon) + '</span></span>' +
        '<div class="flex flex-col gap-sm"><h3 class="font-title text-title-lg">' + esc(p.title) + '</h3><p class="font-body text-body-md">' + esc(p.text) + '</p></div></article>';
    }).join(''));

    fill('[data-render="facility-tags"]', C.facilities.tags.map(function (t) {
      return '<span class="inline-flex items-center gap-xs rounded-full bg-electric-blue text-on-electric-blue px-md py-sm font-label text-label-sm">' +
        '<span class="material-symbols-outlined text-label-lg" aria-hidden="true">' + esc(t.icon) + '</span>' + esc(t.label) + '</span>';
    }).join(''));

    fill('[data-render="facility-gallery"]', C.facilities.gallery.map(function (g) {
      return '<figure class="rounded-xl overflow-hidden bg-surface border border-outline flex flex-col">' +
        '<img src="' + esc(g.image) + '" alt="' + esc(g.alt) + '" loading="lazy" class="w-full h-72 sm:h-full object-cover flex-1">' +
        '<figcaption class="p-lg bg-surface flex items-center justify-between gap-sm"><div class="flex flex-col">' +
        '<span class="font-title text-title-md text-on-surface">' + esc(g.title) + '</span>' +
        '<span class="font-label text-label-sm text-on-surface-muted">' + esc(g.subtitle) + '</span></div>' +
        '<span class="material-symbols-outlined ' + tone(g.tone).fg + ' text-title-lg" aria-hidden="true">' + esc(g.icon) + '</span></figcaption></figure>';
    }).join(''));

    fill('[data-render="banks"]', C.kpr.banks.map(function (b) {
      return '<div class="rounded-md bg-surface border border-outline px-md py-sm flex items-center justify-center font-title text-title-md text-on-surface">' + esc(b) + '</div>';
    }).join('') + (C.kpr.bankBadge ? '<div class="rounded-md bg-electric-blue-tint border border-outline px-md py-sm flex items-center justify-center font-label text-label-sm text-electric-blue">' + esc(C.kpr.bankBadge) + '</div>' : ''));

    fill('[data-render="testimonials"]', C.testimonials.map(function (t) {
      var stars = '';
      for (var i = 0; i < (t.stars || 5); i++) stars += '<span class="material-symbols-outlined icon-fill text-title-md" aria-hidden="true">star</span>';
      return '<figure class="rounded-xl bg-surface border border-outline p-xl flex flex-col gap-md">' +
        '<div class="flex items-center gap-xs text-tangerine" role="img" aria-label="' + esc((t.stars || 5) + ' / 5') + '">' + stars + '</div>' +
        '<blockquote class="font-body text-body-md text-on-surface text-pretty">“' + esc(t.quote) + '”</blockquote>' +
        '<figcaption class="flex items-center justify-between pt-sm border-t border-outline gap-sm">' +
        '<span class="font-label text-label-lg text-on-surface">' + esc(t.name) + '</span>' +
        '<span class="font-label text-label-sm text-on-surface-muted whitespace-nowrap">' + esc(t.unit) + '</span></figcaption></figure>';
    }).join(''));

    fill('[data-render="footer-columns"]', C.footer.columns.map(function (col) {
      return '<div class="flex flex-col gap-sm"><span class="font-label text-label-sm text-charcoal-muted">' + esc(col.title) + '</span>' +
        col.links.map(function (l) { return '<a href="' + esc(safeUrl(l.href)) + '" class="font-body text-body-md text-on-charcoal hover:text-sunlit-yellow">' + esc(l.label) + '</a>'; }).join('') + '</div>';
    }).join(''));
  }

  /* ======================================================================
   * 5. PROPERTY CARDS + FILTERS
   * ==================================================================== */
  var items = C.properties.items;
  function findProperty(id) { return items.filter(function (p) { return p.id === id; })[0]; }

  var PILL_ON = 'bg-charcoal text-on-charcoal border border-charcoal';
  var PILL_OFF = 'bg-surface-subtle text-on-surface border border-outline hover:border-charcoal';

  function specRow(p) {
    var s = C.ui.specsShort;
    function spec(icon, label, val, unit) {
      return '<span class="inline-flex items-center gap-xs"><span class="material-symbols-outlined text-label-lg" aria-hidden="true">' + icon + '</span>' +
        '<span><span class="text-on-surface-muted">' + label + '</span> ' + esc(val) + (unit || '') + '</span></span>';
    }
    return spec('landscape', s.lt, p.lt, ' m²') + spec('square_foot', s.lb, p.lb, ' m²') + spec('bed', s.kt, p.kt) + spec('bathtub', s.km, p.km);
  }

  function cardHtml(p) {
    var t = tone(p.promo && p.promo.tone);
    return '<article data-property-id="' + esc(p.id) + '" data-category="' + esc(p.category) + '" class="property-card h-full rounded-xl bg-surface border border-outline overflow-hidden flex flex-col justify-between cursor-pointer transition-transform duration-card-hover ease-card-hover hover:-translate-y-1">' +
      '<div class="relative p-md pb-0"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" loading="lazy" class="w-full h-60 object-cover rounded-lg">' +
      (p.promo ? '<span class="absolute top-lg left-lg rounded-full ' + t.bg + ' ' + t.on + ' px-md py-xs font-label text-label-sm">' + esc(p.promo.label) + '</span>' : '') + '</div>' +
      '<div class="p-lg flex flex-col gap-md flex-1 justify-between">' +
      '<div class="flex flex-col gap-xs"><span class="font-label text-label-sm text-electric-blue">' + esc(p.typeLabel) + ' • ' + esc(p.location) + '</span>' +
      '<h3 class="font-title text-title-lg text-on-surface">' + esc(p.name) + '</h3>' +
      '<div class="flex flex-wrap items-center gap-x-md gap-y-xs pt-xs text-on-surface font-mono text-mono-md tabular-nums">' + specRow(p) + '</div></div>' +
      '<footer class="flex items-center justify-between pt-md border-t border-outline"><div class="flex flex-col">' +
      '<span class="font-label text-label-sm text-on-surface-muted">' + esc(C.ui.startingFrom) + '</span>' +
      '<span class="font-title text-title-lg text-on-surface tabular-nums">' + esc(moneyShort(p.price)) + '</span></div>' +
      '<button type="button" data-open-property="' + esc(p.id) + '" aria-haspopup="dialog" aria-label="' + esc(C.ui.inspect + ': ' + p.name) + '" class="inline-flex items-center justify-center w-2xl h-2xl rounded-full bg-charcoal text-on-charcoal transition-transform duration-state-change ease-state-change hover:scale-105 ' + FOCUS + '">' +
      '<span class="material-symbols-outlined text-title-md" aria-hidden="true">arrow_outward</span></button></footer></div></article>';
  }

  function renderProperties() {
    $('#property-grid').innerHTML = items.map(cardHtml).join('');

    $('#property-filters').innerHTML = C.properties.categories.map(function (c, i) {
      return '<button type="button" data-filter="' + esc(c.id) + '" aria-pressed="' + (i === 0) + '" class="filter-pill inline-flex items-center rounded-full px-lg py-sm font-label text-label-sm transition-colors duration-state-change ease-state-change ' + (i === 0 ? PILL_ON : PILL_OFF) + ' ' + FOCUS + '">' + esc(c.label) + '</button>';
    }).join('');

    $('#property-filters').addEventListener('click', function (e) {
      var pill = e.target.closest('.filter-pill'); if (!pill) return;
      var sel = pill.getAttribute('data-filter');
      $$('.filter-pill').forEach(function (b) {
        var on = b === pill;
        b.setAttribute('aria-pressed', on);
        b.className = b.className.replace(PILL_ON, '').replace(PILL_OFF, '').trim() + ' ' + (on ? PILL_ON : PILL_OFF);
      });
      $$('.property-card').forEach(function (card) {
        card.classList.toggle('hidden', !(sel === 'all' || card.getAttribute('data-category') === sel));
      });
    });

    $('#property-grid').addEventListener('click', function (e) {
      var card = e.target.closest('[data-property-id]'); if (!card) return;
      var btn = card.querySelector('[data-open-property]');
      openModal(card.getAttribute('data-property-id'), btn);
    });
  }

  /* ======================================================================
   * 6. PROPERTY MODAL  (a11y: role=dialog, focus trap, Esc, focus restore)
   * ==================================================================== */
  var modal, modalPanel, modalBody; // assigned in initModal() once the DOM exists
  var lastFocus = null;

  function specTile(toneName, icon, label, value) {
    var t = tone(toneName);
    return '<div class="rounded-lg ' + t.bg + ' ' + t.on + ' p-md flex flex-col gap-sm ' + (toneName === 'surface' ? 'border border-outline' : '') + '">' +
      '<span class="material-symbols-outlined text-title-md" aria-hidden="true">' + icon + '</span>' +
      '<div class="flex flex-col"><span class="font-label text-label-sm opacity-80">' + esc(label) + '</span>' +
      '<span class="font-mono text-mono-md tabular-nums">' + esc(value) + '</span></div></div>';
  }

  function modalHtml(p) {
    var s = C.ui.specs, t = tone(p.promo && p.promo.tone);
    var slides = p.images.map(function (src, i) { return { src: src, label: C.ui.gallery + ' ' + (i + 1), plan: false }; });
    if (p.floorplan) slides.push({ src: p.floorplan, label: C.ui.floorplanLabel, plan: true });

    var thumbs = slides.map(function (sl, i) {
      return '<button type="button" data-slide="' + i + '" aria-label="' + esc(sl.label) + '" aria-pressed="' + (i === 0) + '" class="relative shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 ' + (i === 0 ? 'border-electric-blue' : 'border-outline') + ' ' + FOCUS + '">' +
        '<img src="' + esc(sl.src) + '" alt="" loading="lazy" class="w-full h-full object-cover">' +
        (sl.plan ? '<span class="absolute inset-x-0 bottom-0 bg-charcoal text-on-charcoal font-label text-label-sm text-center">' + esc(sl.label) + '</span>' : '') + '</button>';
    }).join('');

    return '<div class="grid grid-cols-1 lg:grid-cols-12 gap-lg">' +
      '<div class="lg:col-span-7 flex flex-col gap-md">' +
      '<div class="relative rounded-xl overflow-hidden bg-surface-subtle border border-outline">' +
      '<img id="modal-main-img" src="' + esc(slides[0].src) + '" alt="' + esc(p.name) + '" class="w-full h-72 sm:h-96 object-cover">' +
      (p.promo ? '<span class="absolute top-md left-md rounded-full ' + t.bg + ' ' + t.on + ' px-md py-xs font-label text-label-sm">' + esc(p.promo.label) + '</span>' : '') + '</div>' +
      '<div class="flex gap-sm overflow-x-auto pb-xs" role="group" aria-label="' + esc(C.ui.gallery) + '">' + thumbs + '</div></div>' +
      '<div class="lg:col-span-5 flex flex-col gap-md">' +
      '<div class="flex flex-col gap-xs pr-3xl"><span class="font-label text-label-sm text-electric-blue">' + esc(p.typeLabel) + ' • ' + esc(p.location) + '</span>' +
      '<h2 id="modal-title" class="font-headline text-headline-md text-on-surface">' + esc(p.name) + '</h2>' +
      '<p class="font-title text-title-lg text-on-surface tabular-nums">' + esc(money(p.price)) + '</p></div>' +
      '<div class="grid grid-cols-2 gap-sm">' +
      specTile('accent', 'landscape', s.lt + ' (LT)', p.lt + ' m²') +
      specTile('primary', 'square_foot', s.lb + ' (LB)', p.lb + ' m²') +
      specTile('secondary', 'bed', s.kt + ' (KT)', p.kt) +
      specTile('dark', 'bathtub', s.km + ' (KM)', p.km) +
      specTile('surface', 'directions_car', s.carport, p.carport + ' ' + C.ui.carportUnit) +
      specTile('surface', 'verified_user', s.certificate, p.certificate) + '</div>' +
      '<p class="font-body text-body-md text-on-surface-muted text-pretty">' + esc(p.description) + '</p>' +
      '<div class="flex flex-col gap-sm pt-sm">' +
      '<a href="' + esc(waLink('property', { unit: p.name })) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-sm rounded-full bg-tangerine text-on-tangerine px-xl py-md font-label text-label-lg transition-transform duration-state-change ease-state-change hover:-translate-y-0.5 ' + FOCUS + '">' +
      '<span class="material-symbols-outlined text-title-md" aria-hidden="true">chat</span>' + esc(C.ui.modalWhatsApp) + '</a>' +
      '<button type="button" data-simulate="' + esc(p.id) + '" class="inline-flex items-center justify-center rounded-full bg-surface text-on-surface border border-outline px-xl py-md font-label text-label-lg transition-colors duration-state-change hover:bg-surface-subtle ' + FOCUS + '">' + esc(C.ui.modalSimulate) + '</button>' +
      '</div></div></div>';
  }

  function openModal(id, trigger) {
    var p = findProperty(id); if (!p) return;
    lastFocus = trigger || document.activeElement;
    modalBody.innerHTML = modalHtml(p);
    hardenLinks();
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');
    modalPanel.scrollTop = 0;
    setTimeout(function () { var c = $('#modal-close'); if (c) c.focus(); }, 30);
  }

  function closeModal() {
    if (modal.getAttribute('data-open') !== 'true') return;
    modal.setAttribute('data-open', 'false');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    modal = $('#property-modal'); modalPanel = $('#modal-panel'); modalBody = $('#modal-body');
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-modal]')) { closeModal(); return; }

      var thumb = e.target.closest('[data-slide]');
      if (thumb) {
        var idx = +thumb.getAttribute('data-slide');
        var img = $('#modal-main-img');
        img.src = $('img', thumb).src;
        $$('[data-slide]', modal).forEach(function (b) {
          var on = b === thumb;
          b.setAttribute('aria-pressed', on);
          b.classList.toggle('border-electric-blue', on);
          b.classList.toggle('border-outline', !on);
        });
        return idx;
      }

      var sim = e.target.closest('[data-simulate]');
      if (sim) {
        selectUnit(sim.getAttribute('data-simulate'));
        lastFocus = $('#kpr-unit');
        closeModal();
        $('#kpr-simulation').scrollIntoView({ behavior: 'smooth' });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (modal.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key !== 'Tab') return;
      // Focus trap
      var f = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modalPanel).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ======================================================================
   * 7. KPR CALCULATOR  (annuity formula, Rupiah formatting)
   * ==================================================================== */
  var K = C.kpr;
  var unitEl, priceEl, dpEl, tenureEl, rateEl, monthlyEl, dpOutEl, loanOutEl, applyEl;
  var state = { price: 0 };

  function digits(str) { return parseInt(String(str).replace(/\D/g, ''), 10) || 0; }

  function selectUnit(id) {
    var p = findProperty(id);
    unitEl.value = p ? p.id : 'custom';
    if (p) { state.price = p.price; priceEl.value = nf.format(p.price); }
    updateKpr();
  }

  function updateKpr() {
    var price = Math.max(0, state.price);
    var dpPct = parseFloat(dpEl.value) || 0;
    var years = Math.max(1, parseInt(tenureEl.value, 10) || K.defaultTenor);
    var rate = Math.max(0, parseFloat(rateEl.value) || 0);

    var dpAmount = price * dpPct / 100;
    var principal = price - dpAmount;
    var n = years * 12, r = rate / 100 / 12, monthly;
    if (!principal) monthly = 0;
    else if (r === 0) monthly = principal / n;
    else { var f = Math.pow(1 + r, n); monthly = principal * r * f / (f - 1); }

    monthlyEl.textContent = money(monthly) + ' ' + K.labels.perMonth;
    dpOutEl.textContent = money(dpAmount);
    loanOutEl.textContent = money(principal);

    var prop = findProperty(unitEl.value);
    applyEl.href = waLink('kpr', {
      unit: prop ? prop.name : K.labels.customUnit,
      price: money(price), dp: dpPct, dpAmount: money(dpAmount),
      tenor: years, rate: String(rate).replace('.', ','), monthly: money(monthly),
    });
  }

  function initKpr() {
    unitEl = $('#kpr-unit'); priceEl = $('#kpr-price'); dpEl = $('#kpr-dp'); tenureEl = $('#kpr-tenure'); rateEl = $('#kpr-rate');
    monthlyEl = $('#kpr-monthly-output'); dpOutEl = $('#kpr-dp-output'); loanOutEl = $('#kpr-loan-output'); applyEl = $('#kpr-apply');
    $('#kpr-currency').textContent = prefix;

    unitEl.innerHTML = items.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.name + ' — ' + moneyShort(p.price)) + '</option>'; }).join('') +
      '<option value="custom">' + esc(K.labels.customUnit) + '</option>';
    dpEl.innerHTML = K.dpOptions.map(function (o) { return '<option value="' + esc(o.value) + '"' + (o.value === K.defaultDp ? ' selected' : '') + '>' + esc(o.label) + '</option>'; }).join('');
    tenureEl.innerHTML = K.tenorOptions.map(function (y) { return '<option value="' + esc(y) + '"' + (y === K.defaultTenor ? ' selected' : '') + '>' + esc(y) + ' ' + esc(K.labels.years) + '</option>'; }).join('');
    rateEl.value = K.defaultRate;

    unitEl.addEventListener('change', function () {
      if (unitEl.value === 'custom') { priceEl.focus(); updateKpr(); } else selectUnit(unitEl.value);
    });
    priceEl.addEventListener('input', function () {
      state.price = digits(priceEl.value);
      priceEl.value = state.price ? nf.format(state.price) : '';
      var match = items.filter(function (p) { return p.price === state.price; })[0];
      unitEl.value = match ? match.id : 'custom';
      updateKpr();
    });
    [dpEl, tenureEl, rateEl].forEach(function (el) { el.addEventListener('input', updateKpr); el.addEventListener('change', updateKpr); });

    selectUnit(findProperty(K.defaultUnitId) ? K.defaultUnitId : (items[0] ? items[0].id : 'custom'));
  }

  /* ======================================================================
   * 8. MOBILE MENU + BOOT
   * ==================================================================== */
  function initMenu() {
    var btn = $('#menu-toggle'), menu = $('#mobile-menu'), icon = $('#menu-icon');
    function set(open) {
      menu.setAttribute('data-open', open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? C.ui.closeMenu : C.ui.openMenu);
      icon.textContent = open ? 'close' : 'menu';
    }
    set(false);
    btn.addEventListener('click', function () { set(menu.getAttribute('data-open') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') { set(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (e) { if (e.matches) set(false); });
  }

  /** Every external link opens safely in a new tab. */
  function hardenLinks() {
    $$('a[href^="http"], a[href^="https://wa.me"]').forEach(function (a) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function boot() {
    bindStatic();
    renderLists();
    renderProperties();
    initModal();
    initKpr();
    initMenu();
    hardenLinks();
    checkBrokenImages();
    window.addEventListener('load', checkBrokenImages);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
