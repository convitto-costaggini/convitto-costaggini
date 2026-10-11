/* ════════════════════════════════════════════════════════
   LINGUE — script comune del minisito /lingue/
   - Le pagine usano <base href="/">: così il menu del sito madre
     (link relativi) funziona anche da qui. I link "#..." del menu
     vengono gestiti qui per restare nella pagina.
   - Barra di navigazione del minisito, voce del telefono (🔊),
     memoria locale delle preferenze.
   ════════════════════════════════════════════════════════ */
window.LINGUE_SITO = (function () {
  'use strict';
  var LINGUE = [
    { cod: 'en', nome: 'Inglese', nativo: 'English', voce: 'en-GB' },
    { cod: 'fr', nome: 'Francese', nativo: 'Français', voce: 'fr-FR' },
    { cod: 'es', nome: 'Spagnolo', nativo: 'Español', voce: 'es-ES' },
    { cod: 'de', nome: 'Tedesco', nativo: 'Deutsch', voce: 'de-DE' }
  ];
  var PAGINE = [
    ['index', '🏠', 'Lingue'],
    ['vocabolario', '📖', 'Vocabolario'],
    ['esercizi', '✏️', 'Esercizi'],
    ['dialoghi', '💬', 'Dialoghi'],
    ['risorse', '🌐', 'Risorse'],
    ['docenti', '👩‍🏫', 'Area docenti']
  ];

  /* link "#..." con <base href="/">: restano nella pagina */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(1), t = id && document.getElementById(id);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (t.tabIndex < 0) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }, true);

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function leggi(k, d) { try { var v = localStorage.getItem('convitto-lingue-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function salva(k, v) { try { localStorage.setItem('convitto-lingue-' + k, JSON.stringify(v)); } catch (e) {} }
  function lingua(cod) { return LINGUE.filter(function (l) { return l.cod === cod; })[0]; }
  function mescola(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* voce del telefono */
  var parla = 'speechSynthesis' in window;
  if (parla) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; }
  function voce(cod) {
    if (!parla) return null;
    var l = lingua(cod), v = speechSynthesis.getVoices().filter(function (x) { return x.lang && x.lang.replace('_', '-').toLowerCase().indexOf(cod) === 0; });
    return v.filter(function (x) { return x.lang.replace('_', '-') === l.voce; })[0] || v[0] || null;
  }
  function ascolta(testo, cod, opz) {
    opz = opz || {};
    if (!parla) return;
    if (!opz.coda) speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(testo).replace(/[¿¡…]/g, ' ').replace(/\s+/g, ' '));
    u.lang = cod === 'it' ? 'it-IT' : lingua(cod).voce; u.rate = opz.rate || .9; if (opz.pitch) u.pitch = opz.pitch;
    var v = cod === 'it' ? null : voce(cod); if (v) u.voice = v;
    var btn = opz.btn;
    document.querySelectorAll('.lg-play.va').forEach(function (b) { if (b !== btn) b.classList.remove('va'); });
    if (btn) btn.classList.add('va');
    u.onend = u.onerror = function () { if (btn) btn.classList.remove('va'); if (opz.fine) opz.fine(); };
    speechSynthesis.speak(u);
  }
  /* pulsanti 🔊 dichiarativi: <button class="lg-play" data-t="..." data-c="en"> */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lg-play[data-t]');
    if (b) { e.stopPropagation(); ascolta(b.dataset.t, b.dataset.c, { btn: b }); }
  });
  function play(testo, cod, etichetta) {
    return parla ? '<button type="button" class="lg-play" data-t="' + esc(testo) + '" data-c="' + cod + '" aria-label="' + esc(etichetta || 'Ascolta') + '">🔊</button>' : '';
  }

  /* barra del minisito */
  function nav() {
    var box = document.querySelector('[data-lingue-nav]'); if (!box) return;
    var qui = document.body.dataset.lingue;
    box.innerHTML = '<nav class="lg-nav" aria-label="Sezioni del minisito Lingue"><div class="lg-nav-in">' + PAGINE.map(function (p) {
      return '<a href="lingue/' + (p[0] === 'index' ? '' : p[0] + '.html') + '"' + (p[0] === qui ? ' aria-current="page"' : '') + '><span aria-hidden="true">' + p[1] + '</span>' + p[2] + '</a>';
    }).join('') + '</div></nav>';
    var att = box.querySelector('[aria-current]');
    if (att) { var c = att.parentNode; c.scrollLeft = att.offsetLeft - (c.clientWidth - att.offsetWidth) / 2; }
    /* la barra si ferma sotto l'intestazione del sito madre (anch'essa fissa) */
    var bar = box.querySelector('.lg-nav');
    function sotto() { var h = document.getElementById('hdr'); bar.style.top = (h ? h.offsetHeight : 0) + 'px'; }
    sotto(); window.addEventListener('resize', sotto); setTimeout(sotto, 800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', nav); else nav();

  return { LINGUE: LINGUE, esc: esc, leggi: leggi, salva: salva, lingua: lingua, mescola: mescola, parla: parla, ascolta: ascolta, play: play, voce: voce };
})();
