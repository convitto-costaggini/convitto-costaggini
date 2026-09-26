/* ══════════════════════════════════════════════════════════════
   GALLERIA FOTOGRAFICA DELLE NOTIZIE
   Se la foto di copertina di una notizia compare in "gallerie.json",
   cliccandola si apre uno slideshow con le altre foto dell'evento.
   Nessun pulsante: la foto stessa è l'invito (cursore a lente).
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DURATA = 6000; // ms per foto nello scorrimento automatico
  var GALLERIE = null;
  var lb, fig, slideA, slideB, capt, counter, thumbs, btnPrev, btnNext, btnPlay, prog, titoloEl;
  var slides = [], idx = -1, titolo = '', lastFocus = null, attiva = null, token = 0;
  var play = false, timer = null, kb = 0;
  var zs = 1, zx = 0, zy = 0, gesto = null, pizzicato = false, ultimoTap = null, suggerito = false; // ingrandimento
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function chiave(src) {
    if (!src) return '';
    try {
      var u = new URL(src, location.href);
      if (u.origin === location.origin) return decodeURI(u.pathname).replace(/^\/+/, '');
      return u.href;
    } catch (e) { return String(src).replace(/^\.?\/+/, ''); }
  }
  function webp(src) { return src.replace(/\.(jpe?g|png)$/i, '.webp'); }
  function esc(t) { return (t || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function normalizza(g, key) {
    var foto = (g.foto || []).map(function (f) { return typeof f === 'string' ? { src: f } : f; });
    if (g.includi_copertina !== false && !foto.some(function (f) { return chiave(f.src) === key; })) foto.unshift({ src: key, alt: g.alt_copertina || '' });
    return foto;
  }

  /* Carica una foto (prima la versione .webp, poi l'originale) e avvisa quando è pronta */
  function precarica(src, cb) {
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { cb && cb(im.src); };
    im.onerror = function () {
      im.onerror = function () { cb && cb(src); };
      im.src = src;
    };
    im.src = webp(src);
  }

  function costruisci() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'gal';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galleria fotografica');
    lb.hidden = true;
    lb.innerHTML =
      '<div class="gal-top">' +
        '<p class="gal-titolo"></p>' +
        '<span class="gal-count" aria-live="polite"></span>' +
        '<button type="button" class="gal-btn gal-play" aria-label="Metti in pausa lo scorrimento">' +
          '<svg class="i-pausa" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>' +
          '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg></button>' +
        '<button type="button" class="gal-btn gal-x" aria-label="Chiudi la galleria">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '</div>' +
      '<div class="gal-prog" aria-hidden="true"><i></i></div>' +
      '<div class="gal-stage">' +
        '<button type="button" class="gal-btn gal-nav gal-prev" aria-label="Foto precedente">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg></button>' +
        '<div class="gal-fig"><figure class="gal-slide"><div class="gal-zoom"><img alt=""/></div></figure><figure class="gal-slide"><div class="gal-zoom"><img alt=""/></div></figure></div>' +
        '<p class="gal-hint" aria-hidden="true"></p>' +
        '<button type="button" class="gal-btn gal-nav gal-next" aria-label="Foto successiva">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></button>' +
      '</div>' +
      '<p class="gal-capt"></p>' +
      '<div class="gal-thumbs" aria-label="Miniature"></div>';
    document.body.appendChild(lb);

    fig = lb.querySelector('.gal-fig');
    var s = lb.querySelectorAll('.gal-slide');
    slideA = s[0]; slideB = s[1];
    titoloEl = lb.querySelector('.gal-titolo');
    capt = lb.querySelector('.gal-capt');
    counter = lb.querySelector('.gal-count');
    thumbs = lb.querySelector('.gal-thumbs');
    btnPrev = lb.querySelector('.gal-prev');
    btnNext = lb.querySelector('.gal-next');
    btnPlay = lb.querySelector('.gal-play');
    prog = lb.querySelector('.gal-prog i');

    lb.querySelector('.gal-x').addEventListener('click', chiudi);
    btnPrev.addEventListener('click', function () { vai(idx - 1, -1); });
    btnNext.addEventListener('click', function () { vai(idx + 1, 1); });
    btnPlay.addEventListener('click', function () { imposta(!play); });
    lb.querySelector('.gal-stage').addEventListener('click', function (e) {
      if (e.target.classList.contains('gal-stage') || e.target.classList.contains('gal-fig')) chiudi();
    });
    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b) vai(+b.dataset.i, +b.dataset.i < idx ? -1 : 1);
    });
    /* ── Gesti touch: pizzico per ingrandire, trascinamento, doppio tocco, swipe ── */
    fig.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        var a = punto(e.touches[0]), b = punto(e.touches[1]);
        gesto = { tipo: 'pizzico', d0: dist(a, b), s0: zs, cx: (((a.x + b.x) / 2) - zx) / zs, cy: (((a.y + b.y) / 2) - zy) / zs };
        pizzicato = true;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        var p = punto(e.touches[0]);
        gesto = { tipo: zs > 1.01 ? 'sposta' : 'swipe', px: p.x, py: p.y, x0: zx, y0: zy, t: Date.now() };
        if (!pizzicato) gesto.pulito = true;
      }
    }, { passive: false });
    fig.addEventListener('touchmove', function (e) {
      if (!gesto) return;
      if (gesto.tipo === 'pizzico' && e.touches.length === 2) {
        e.preventDefault();
        var a = punto(e.touches[0]), b = punto(e.touches[1]);
        var ns = Math.min(4, Math.max(0.85, gesto.s0 * dist(a, b) / gesto.d0));
        zs = ns;
        zx = (a.x + b.x) / 2 - gesto.cx * zs;
        zy = (a.y + b.y) / 2 - gesto.cy * zs;
        applica(false, true);
      } else if (gesto.tipo === 'sposta' && e.touches.length === 1) {
        e.preventDefault();
        var p = punto(e.touches[0]);
        zx = gesto.x0 + p.x - gesto.px; zy = gesto.y0 + p.y - gesto.py;
        applica(false);
      } else if (gesto.tipo === 'swipe') {
        e.preventDefault();
      }
    }, { passive: false });
    fig.addEventListener('touchend', function (e) {
      if (!gesto) return;
      if (e.touches.length === 1) { // resta un dito dopo il pizzico: si continua spostando
        var p = punto(e.touches[0]);
        gesto = { tipo: 'sposta', px: p.x, py: p.y, x0: zx, y0: zy, t: Date.now() };
        return;
      }
      if (e.touches.length) return;
      var g = gesto; gesto = null;
      if (zs < 1.02) azzera(true); else applica(true);
      if (g.tipo === 'swipe' && g.pulito) {
        var q = punto(e.changedTouches[0]), dx = q.x - g.px, dy = q.y - g.py;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) vai(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) chiudi();
      }
      if ((g.tipo === 'swipe' || g.tipo === 'sposta') && !pizzicato) {
        var r = punto(e.changedTouches[0]);
        if (Date.now() - g.t < 280 && dist(r, { x: g.px, y: g.py }) < 12) { // tocco
          if (ultimoTap && Date.now() - ultimoTap.t < 320 && dist(r, ultimoTap) < 30) { alterna(r); ultimoTap = null; }
          else ultimoTap = { x: r.x, y: r.y, t: Date.now() };
        }
      }
      pizzicato = false;
    });
    lb.addEventListener('gesturestart', function (e) { e.preventDefault(); }); // Safari: niente zoom della pagina

    /* ── Mouse: doppio clic, rotellina, trascinamento ── */
    fig.addEventListener('dblclick', function (e) { e.preventDefault(); alterna(punto(e)); });
    fig.addEventListener('wheel', function (e) {
      e.preventDefault();
      ingrandisciIn(punto(e), zs * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022)));
    }, { passive: false });
    fig.addEventListener('mousedown', function (e) {
      if (zs <= 1.01 || e.button !== 0) return;
      e.preventDefault();
      var p0 = punto(e), x0 = zx, y0 = zy;
      fig.classList.add('trascina');
      function muovi(ev) { var p = punto(ev); zx = x0 + p.x - p0.x; zy = y0 + p.y - p0.y; applica(false); }
      function fine() { fig.classList.remove('trascina'); window.removeEventListener('mousemove', muovi); window.removeEventListener('mouseup', fine); }
      window.addEventListener('mousemove', muovi);
      window.addEventListener('mouseup', fine);
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); if (zs > 1.01) azzera(true); else chiudi(); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); ingrandisciIn(centro(), zs * 1.5, true); }
      else if (e.key === '-') { e.preventDefault(); ingrandisciIn(centro(), zs / 1.5, true); }
      else if (e.key === '0') { e.preventDefault(); azzera(true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); vai(idx + 1, 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); vai(idx - 1, -1); }
      else if (e.key === 'Home') { e.preventDefault(); vai(0, -1); }
      else if (e.key === 'End') { e.preventDefault(); vai(slides.length - 1, 1); }
      else if (e.key === 'Tab') {
        var f = [].slice.call(lb.querySelectorAll('button')).filter(function (b) { return b.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    document.addEventListener('visibilitychange', function () { if (!lb.hidden) programma(); });
  }

  /* ── Ingrandimento della foto ── */
  function punto(t) { var r = fig.getBoundingClientRect(); return { x: t.clientX - r.left, y: t.clientY - r.top }; }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function centro() { return { x: fig.clientWidth / 2, y: fig.clientHeight / 2 }; }
  function zoomEl() { return attiva && attiva.querySelector('.gal-zoom'); }
  /* Limiti: la foto ingrandita non può staccarsi dai bordi del riquadro */
  function limita() {
    var img = attiva && attiva.querySelector('img');
    var W = fig.clientWidth, H = fig.clientHeight;
    var iw = img && img.offsetWidth || W, ih = img && img.offsetHeight || H;
    var ox = (W - iw) / 2, oy = (H - ih) / 2; // bordi vuoti attorno alla foto (non ingrandita)
    function fascia(t, pieno, bordo, dim) {
      var vis = dim * zs; // lato della foto ingrandita
      if (vis <= pieno) return (pieno - vis) / 2 - bordo * zs; // più piccola del riquadro: centrata
      return Math.min(-bordo * zs, Math.max(pieno - bordo * zs - vis, t));
    }
    zx = fascia(zx, W, ox, iw);
    zy = fascia(zy, H, oy, ih);
  }
  function applica(anim, libero) {
    var el = zoomEl(); if (!el) return;
    if (!libero) limita();
    el.style.transition = anim && !reduce ? 'transform .32s cubic-bezier(.22,.61,.36,1)' : 'none';
    el.style.transform = zs === 1 && !zx && !zy ? '' : 'translate3d(' + zx + 'px,' + zy + 'px,0) scale(' + zs + ')';
    var z = zs > 1.01;
    if (z !== lb.classList.contains('zoomed')) {
      lb.classList.toggle('zoomed', z);
      if (z) { clearTimeout(timer); prog.style.transition = 'none'; prog.style.transform = 'scaleX(0)'; nascondiSuggerimento(); }
      else programma();
    }
  }
  function azzera(anim) { zs = 1; zx = 0; zy = 0; applica(anim, true); }
  function ingrandisciIn(p, ns, anim) {
    ns = Math.min(4, Math.max(1, ns));
    var cx = (p.x - zx) / zs, cy = (p.y - zy) / zs;
    zs = ns; zx = p.x - cx * zs; zy = p.y - cy * zs;
    if (zs <= 1.001) azzera(anim); else applica(anim);
  }
  function alterna(p) { if (zs > 1.01) azzera(true); else ingrandisciIn(p, 2.5, true); }
  function suggerisci() {
    if (suggerito || reduce) return;
    suggerito = true;
    var h = lb.querySelector('.gal-hint');
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    h.textContent = touch ? 'Pizzica o tocca due volte la foto per ingrandirla' : 'Doppio clic o rotellina per ingrandire la foto';
    setTimeout(function () { if (!lb.hidden && !lb.classList.contains('zoomed')) h.classList.add('on'); }, 900);
    setTimeout(nascondiSuggerimento, 4600);
  }
  function nascondiSuggerimento() { var h = lb && lb.querySelector('.gal-hint'); if (h) h.classList.remove('on'); }

  /* ── Scorrimento automatico ── */
  function programma() {
    clearTimeout(timer);
    prog.style.transition = 'none';
    prog.style.transform = 'scaleX(0)';
    if (!play || slides.length < 2 || document.hidden || lb.hidden || zs > 1.01) return;
    void prog.offsetWidth;
    prog.style.transition = 'transform ' + DURATA + 'ms linear';
    prog.style.transform = 'scaleX(1)';
    timer = setTimeout(function () { vai(idx + 1, 1); }, DURATA);
  }
  function imposta(on) {
    play = on && !reduce;
    lb.classList.toggle('in-pausa', !play);
    btnPlay.setAttribute('aria-label', play ? 'Metti in pausa lo scorrimento' : 'Avvia lo scorrimento automatico');
    programma();
  }

  /* ── Cambio foto con transizione ── */
  function vai(n, dir) {
    if (!slides.length) return;
    n = (n + slides.length) % slides.length;
    if (n === idx) return;
    dir = dir || 1;
    var mio = ++token;
    var s = slides[n];
    idx = n;

    capt.classList.remove('on');
    counter.textContent = (n + 1) + ' / ' + slides.length;
    [].forEach.call(thumbs.children, function (b, i) {
      var on = i === n;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });
    clearTimeout(timer);

    precarica(s.src, function (url) {
      if (mio !== token) return;
      var entra = attiva === slideA ? slideB : slideA, esce = attiva;
      zs = 1; zx = 0; zy = 0; lb.classList.remove('zoomed');
      var ze = entra.querySelector('.gal-zoom'); ze.style.transition = 'none'; ze.style.transform = '';
      if (esce) { var zo = esce.querySelector('.gal-zoom'); zo.style.transition = 'transform .6s cubic-bezier(.22,.61,.36,1)'; zo.style.transform = ''; }
      var img = entra.querySelector('img');
      img.src = url;
      img.alt = s.alt || titolo;
      entra.className = 'gal-slide ' + (dir > 0 ? 'da-dx' : 'da-sx') + ((kb++ % 2) ? ' kb2' : '');
      void entra.offsetWidth;
      entra.classList.remove('da-dx', 'da-sx');
      entra.classList.add('on');
      if (esce) esce.className = 'gal-slide ' + (dir > 0 ? 'va-sx' : 'va-dx');
      attiva = entra;
      capt.textContent = s.didascalia || '';
      if (s.didascalia) setTimeout(function () { if (mio === token) capt.classList.add('on'); }, reduce ? 0 : 260);
      programma();
      [n + 1, n - 1].forEach(function (k) { precarica(slides[(k + slides.length) % slides.length].src); });
    });
  }

  function apri(key) {
    var g = GALLERIE && GALLERIE[key];
    if (!g) return;
    costruisci();
    slides = normalizza(g, key);
    titolo = g.titolo || '';
    titoloEl.textContent = titolo;
    lb.setAttribute('aria-label', 'Galleria fotografica' + (titolo ? ': ' + titolo : ''));
    var multi = slides.length > 1;
    lb.classList.toggle('singola', !multi);
    thumbs.innerHTML = slides.map(function (s, i) {
      var mini = s.mini || webp(s.src);
      return '<button type="button" data-i="' + i + '" aria-label="Foto ' + (i + 1) + (s.alt ? ': ' + esc(s.alt) : '') + '"><img src="' + esc(mini) + '" data-fb="' + esc(s.src) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fb"/></button>';
    }).join('');
    slideA.className = slideB.className = 'gal-slide';
    attiva = null; idx = -1;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.documentElement.classList.add('gal-open');
    void lb.offsetWidth;
    lb.classList.add('in');
    imposta(multi);
    vai(0, 1);
    suggerisci();
    (multi ? btnNext : lb.querySelector('.gal-x')).focus({ preventScroll: true });
  }

  function chiudi() {
    if (!lb || lb.hidden) return;
    token++;
    clearTimeout(timer);
    lb.classList.remove('in');
    document.documentElement.classList.remove('gal-open');
    setTimeout(function () {
      if (lb.classList.contains('in')) return;
      lb.hidden = true;
      slideA.className = slideB.className = 'gal-slide';
      [slideA, slideB].forEach(function (sl) { sl.querySelector('.gal-zoom').style.transform = ''; });
      zs = 1; zx = 0; zy = 0; lb.classList.remove('zoomed'); nascondiSuggerimento();
      slideA.querySelector('img').removeAttribute('src');
      slideB.querySelector('img').removeAttribute('src');
    }, reduce ? 0 : 420);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function decora(root) {
    if (!GALLERIE) return;
    (root || document).querySelectorAll('.article-card > img').forEach(function (img) {
      if (img.dataset.gal) return;
      var key = chiave(img.dataset.fallback || img.getAttribute('src'));
      var g = GALLERIE[key];
      if (!g) return;
      img.dataset.gal = key;
      img.classList.add('ac-gal');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      var n = normalizza(g, key).length;
      img.setAttribute('aria-label', 'Apri la galleria fotografica (' + n + ' foto)');
      /* Invito sempre visibile sopra la foto (anche su smartphone, dove non c'è il passaggio del mouse) */
      var wrap = document.createElement('span');
      wrap.className = 'ac-gal-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      var cta = document.createElement('span');
      cta.className = 'ac-gal-cta';
      cta.setAttribute('aria-hidden', 'true');
      cta.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 8h3l1.6-2.2h6.8L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/></svg>' +
        '<span>Sfoglia la galleria</span><em>' + n + ' foto</em>';
      wrap.appendChild(cta);
    });
  }

  document.addEventListener('click', function (e) {
    var w = e.target.closest && e.target.closest('.ac-gal-wrap');
    var img = w && w.querySelector('img[data-gal]');
    if (img) { e.preventDefault(); apri(img.dataset.gal); }
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t && t.matches && t.matches('img[data-gal]')) { e.preventDefault(); apri(t.dataset.gal); }
  });

  window.Galleria = { decora: decora };

  fetch('gallerie.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (d) {
      GALLERIE = {};
      Object.keys(d || {}).forEach(function (k) { if (k.charAt(0) !== '_') GALLERIE[chiave(k)] = d[k]; });
      decora(document);
    })
    .catch(function () { GALLERIE = {}; });
})();
