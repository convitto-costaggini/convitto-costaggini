/* ══════════════════════════════════════════════════════════════
   GALLERIA FOTOGRAFICA DELLE NOTIZIE
   Se la foto di copertina di una notizia compare in "gallerie.json",
   cliccandola si apre uno slideshow con le altre foto dell'evento.
   Nessun pulsante: la foto stessa è l'invito (cursore a lente).
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GALLERIE = null;
  var lb, stage, imgA, imgB, cur, capt, counter, thumbs, btnPrev, btnNext;
  var slides = [], idx = 0, titolo = '', lastFocus = null, showing = 'a', touchX = null, touchY = null;
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

  function carica(img, src) {
    img.onerror = function () { this.onerror = null; this.src = src; };
    img.src = webp(src);
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
        '<button type="button" class="gal-x" aria-label="Chiudi la galleria">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '</div>' +
      '<div class="gal-stage">' +
        '<button type="button" class="gal-nav gal-prev" aria-label="Foto precedente">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg></button>' +
        '<figure class="gal-fig"><img class="gal-img on" alt=""/><img class="gal-img" alt=""/></figure>' +
        '<button type="button" class="gal-nav gal-next" aria-label="Foto successiva">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></button>' +
      '</div>' +
      '<p class="gal-capt"></p>' +
      '<div class="gal-thumbs" role="tablist" aria-label="Miniature"></div>';
    document.body.appendChild(lb);

    stage = lb.querySelector('.gal-stage');
    var imgs = lb.querySelectorAll('.gal-img');
    imgA = imgs[0]; imgB = imgs[1];
    capt = lb.querySelector('.gal-capt');
    counter = lb.querySelector('.gal-count');
    thumbs = lb.querySelector('.gal-thumbs');
    btnPrev = lb.querySelector('.gal-prev');
    btnNext = lb.querySelector('.gal-next');

    lb.querySelector('.gal-x').addEventListener('click', chiudi);
    btnPrev.addEventListener('click', function () { vai(idx - 1); });
    btnNext.addEventListener('click', function () { vai(idx + 1); });
    stage.addEventListener('click', function (e) { if (e.target === stage || e.target.classList.contains('gal-fig')) chiudi(); });
    thumbs.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b) vai(+b.dataset.i);
    });
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { touchX = null; return; }
      touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
      touchX = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) vai(idx + (dx < 0 ? 1 : -1));
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) chiudi();
    }, { passive: true });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); chiudi(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); vai(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); vai(idx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); vai(0); }
      else if (e.key === 'End') { e.preventDefault(); vai(slides.length - 1); }
      else if (e.key === 'Tab') {
        var f = [].slice.call(lb.querySelectorAll('button')).filter(function (b) { return b.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  function vai(n) {
    if (!slides.length) return;
    n = (n + slides.length) % slides.length;
    var primo = !imgA.src && !imgB.src;
    var s = slides[n];
    var next = showing === 'a' ? imgB : imgA, prev = showing === 'a' ? imgA : imgB;
    if (primo) { next = imgA; prev = imgB; }
    next.alt = s.alt || titolo;
    next.onload = null; prev.onload = null;
    var mostra = function () {
      prev.classList.remove('on');
      next.classList.add('on');
      showing = next === imgA ? 'a' : 'b';
    };
    carica(next, s.src);
    if (next.complete && next.naturalWidth) mostra(); else next.onload = mostra;
    idx = n;
    capt.textContent = s.didascalia || '';
    capt.hidden = !s.didascalia;
    counter.textContent = (n + 1) + ' / ' + slides.length;
    [].forEach.call(thumbs.children, function (b, i) {
      var on = i === n;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      if (on && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });
    [n + 1, n - 1].forEach(function (k) {
      var p = slides[(k + slides.length) % slides.length];
      if (p) { var im = new Image(); carica(im, p.src); }
    });
  }

  function apri(key, start) {
    var g = GALLERIE && GALLERIE[key];
    if (!g) return;
    costruisci();
    var foto = (g.foto || []).map(function (f) { return typeof f === 'string' ? { src: f } : f; });
    if (!foto.some(function (f) { return chiave(f.src) === key; })) foto.unshift({ src: key, alt: g.alt_copertina || '' });
    slides = foto;
    titolo = g.titolo || '';
    lb.querySelector('.gal-titolo').textContent = titolo;
    lb.setAttribute('aria-label', 'Galleria fotografica' + (titolo ? ': ' + titolo : ''));
    var multi = slides.length > 1;
    btnPrev.hidden = btnNext.hidden = !multi;
    thumbs.hidden = !multi;
    thumbs.innerHTML = slides.map(function (s, i) {
      return '<button type="button" role="tab" data-i="' + i + '" aria-label="Foto ' + (i + 1) + '"><img src="' + esc(webp(s.src)) + '" data-fb="' + esc(s.src) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fb"/></button>';
    }).join('');
    imgA.removeAttribute('src'); imgB.removeAttribute('src');
    imgA.classList.add('on'); imgB.classList.remove('on'); showing = 'a';
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.documentElement.classList.add('gal-open');
    requestAnimationFrame(function () { lb.classList.add('in'); });
    vai(start || 0);
    (multi ? btnNext : lb.querySelector('.gal-x')).focus({ preventScroll: true });
  }

  function chiudi() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('in');
    document.documentElement.classList.remove('gal-open');
    setTimeout(function () { lb.hidden = true; imgA.removeAttribute('src'); imgB.removeAttribute('src'); }, reduce ? 0 : 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function decora(root) {
    if (!GALLERIE) return;
    (root || document).querySelectorAll('.article-card > img').forEach(function (img) {
      if (img.dataset.gal) return;
      var key = chiave(img.dataset.fallback || img.getAttribute('src'));
      var g = GALLERIE[key];
      if (!g) return;
      var n = (g.foto || []).length + ((g.foto || []).some(function (f) { return chiave(f.src || f) === key; }) ? 0 : 1);
      img.dataset.gal = key;
      img.classList.add('ac-gal');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Apri la galleria fotografica (' + n + ' foto)');
    });
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('img[data-gal]');
    if (img) { e.preventDefault(); apri(img.dataset.gal, 0); }
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t && t.matches && t.matches('img[data-gal]')) { e.preventDefault(); apri(t.dataset.gal, 0); }
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
