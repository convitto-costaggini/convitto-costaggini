/* ════════════════════════════════════════════════════════════
   AULA · Supporti per la lettura
   Un pannello uguale per tutti: «Rendi la pagina comoda per te».
   Il docente può mandare un link che apre la pagina già impostata
   (#p=1, #p=2, #p=3 oppure #s=car.z2.sp): il link non dice per chi è.
   Le scelte restano nel dispositivo (localStorage), il sito non le raccoglie.
   window.AULA_SUPPORTI:
     ha(k)         vero se il supporto k è attivo
     velocita()    velocità della voce (0.78 lenta, 0.92 normale)
     ELENCO, TEMI, PROFILI, comporta(stato), leggiLista(lista)  (per il generatore dei docenti)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.AULA_SUPPORTI) return;
  if (!window.AULA_RISERVATO) return;
  var CHIAVE = 'aula-supporti', doc = document.documentElement;

  /* gli interruttori: sigla, titolo, spiegazione breve, gruppo */
  var ELENCO = [
    { k: 'car', g: 'Testo', t: 'Carattere ad alta leggibilità', d: 'Lettere ben distinte, più facili da riconoscere.' },
    { k: 'sp', g: 'Testo', t: 'Più spazio fra lettere e righe', d: 'Il testo respira: meno righe che si confondono.' },
    { k: 'ri', g: 'Lettura', t: 'Riga guida', d: 'Appena muovi il dito o il mouse, una fascia chiara ti segue e oscura il resto.' },
    { k: 'vl', g: 'Lettura', t: 'Voce più lenta', d: 'La lettura ad alta voce va un po\' più piano.' },
    { k: 'ca', g: 'Calma', t: 'Meno animazioni', d: 'Niente movimenti e coriandoli.' },
    { k: 'fo', g: 'Calma', t: 'Meno distrazioni', d: 'Nasconde punti, pulsanti flottanti e banner.' },
    { k: 'te', g: 'Calma', t: 'Più tempo nelle sfide con il cronometro', d: 'Il tempo a disposizione cresce della metà.' }
  ];
  var TEMI = { '': 'Standard', cr: 'Crema', az: 'Azzurro', me: 'Menta', ro: 'Rosa' };
  var COLORI = { '': '#ffffff', cr: '#ffefc2', az: '#d6e8ff', me: '#d9f2e1', ro: '#fbdfe6' };
  var ZETE = ['A', 'A+', 'A++', 'A+++'];
  /* tre livelli di supporto, dal più leggero al più completo */
  var PROFILI = {
    '1': ['car', 'z1', 'sp', 'cr'],
    '2': ['car', 'z2', 'sp', 'cr', 'ca', 'fo', 'te'],
    '3': ['car', 'z3', 'sp', 'cr', 'ca', 'fo', 'te', 'vl']
  };

  function vuoto() { return { car: 0, sp: 0, ri: 0, vl: 0, ca: 0, fo: 0, te: 0, z: 0, tema: '' }; }
  function leggiLista(lista) {
    var s = vuoto();
    (lista || []).forEach(function (x) {
      x = String(x).trim();
      if (/^z[0-3]$/.test(x)) s.z = +x.charAt(1);
      else if (TEMI.hasOwnProperty(x) && x) s.tema = x;
      else if (s.hasOwnProperty(x) && x !== 'z' && x !== 'tema') s[x] = 1;
    });
    return s;
  }
  function comporta(s) {
    var l = [];
    ELENCO.forEach(function (e) { if (s[e.k]) l.push(e.k); });
    if (s.z) l.push('z' + s.z);
    if (s.tema) l.push(s.tema);
    return l.join('.');
  }

  var stato = vuoto();
  try { var salvato = JSON.parse(localStorage.getItem(CHIAVE) || 'null'); if (salvato) stato = Object.assign(vuoto(), salvato); } catch (e) {}
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(stato)); } catch (e) {} }

  /* il link del docente: #p=1|2|3 (0 = ripristina) oppure #s=elenco, nel frammento dopo il #:
     il frammento non viene mai inviato al server. Poi sparisce dall'indirizzo. */
  (function () {
    var h = location.hash.replace(/^#/, ''); if (!h) return;
    var parti = h.split('&'), p = null, s = null, resto = [];
    parti.forEach(function (x) {
      if (/^p=/.test(x)) p = x.slice(2); else if (/^s=/.test(x)) s = x.slice(2); else if (x) resto.push(x);
    });
    if (p === null && s === null) return;
    var lista = p === '0' ? [] : PROFILI[p] ? PROFILI[p] : s ? s.split('.') : null;
    if (lista) { stato = leggiLista(lista); salva(); }
    try { history.replaceState(null, '', location.pathname + location.search + (resto.length ? '#' + resto.join('&') : '')); } catch (e) {}
  })();

  function applica() {
    ['car', 'sp', 'ri', 'vl', 'ca', 'fo', 'te'].forEach(function (k) { doc.classList.toggle('sup-' + k, !!stato[k]); });
    [1, 2, 3].forEach(function (n) { doc.classList.toggle('sup-z' + n, stato.z === n); });
    Object.keys(TEMI).forEach(function (t) { if (t) doc.classList.toggle('sup-' + t, stato.tema === t); });
    riga();
  }

  /* la riga guida segue il dito o il mouse */
  var fascia = null, ultimaY = null;
  function sposta(y, mostra) {
    if (!fascia) return;
    ultimaY = y; var h = fascia.offsetHeight;
    fascia.style.top = Math.max(0, Math.min(innerHeight - h, y - h / 2)) + 'px';
    if (mostra !== false) fascia.hidden = false; /* compare solo quando lo studente la muove */
  }
  function riga() {
    if (!document.body) return;
    if (stato.ri && !fascia) {
      fascia = document.createElement('div'); fascia.id = 'sup-riga'; fascia.hidden = true; fascia.setAttribute('aria-hidden', 'true'); document.body.appendChild(fascia);
      sposta(ultimaY == null ? innerHeight * 0.45 : ultimaY, false);
    } else if (!stato.ri && fascia) { fascia.remove(); fascia = null; }
  }
  addEventListener('pointermove', function (e) { if (fascia) sposta(e.clientY); }, { passive: true });
  addEventListener('touchmove', function (e) { if (fascia && e.touches[0]) sposta(e.touches[0].clientY); }, { passive: true });
  addEventListener('touchstart', function (e) { if (fascia && e.touches[0]) sposta(e.touches[0].clientY); }, { passive: true });

  applica();

  /* ───── il pannello ───── */
  var btn, pann, avviso, tAvviso;
  function dici(t) {
    if (!avviso) return;
    avviso.textContent = t; avviso.hidden = false; clearTimeout(tAvviso); tAvviso = setTimeout(function () { avviso.hidden = true; }, 2600);
  }
  function tuttoZitto() { if (window.speechSynthesis) speechSynthesis.cancel(); }
  function leggiSelezione() {
    var sel = window.getSelection ? String(window.getSelection()).trim() : '';
    if (!sel) return dici('Prima seleziona un testo: tienilo premuto e trascina.');
    if (!window.speechSynthesis) return dici('Questo dispositivo non sa leggere ad alta voce.');
    tuttoZitto();
    var nodo = window.getSelection().anchorNode, el = nodo && (nodo.nodeType === 1 ? nodo : nodo.parentElement), lang = (el && el.closest('[lang]') && el.closest('[lang]').getAttribute('lang')) || doc.lang || 'it';
    var u = new SpeechSynthesisUtterance(sel.slice(0, 3000)); u.lang = /^it$/i.test(lang) ? 'it-IT' : lang; u.rate = velocita();
    speechSynthesis.speak(u);
  }
  function velocita() { return stato.vl ? 0.78 : 0.92; }

  function riga2(e) {
    return '<div class="sup-riga"><span>' + e.t + '<small>' + e.d + '</small></span>' +
      '<button type="button" class="sup-tasto" data-k="' + e.k + '" aria-pressed="' + (stato[e.k] ? 'true' : 'false') + '" aria-label="' + e.t + '">' + (stato[e.k] ? 'Sì' : 'No') + '</button></div>';
  }
  function gruppo(nome) { return '<h3>' + nome + '</h3>' + ELENCO.filter(function (e) { return e.g === nome; }).map(riga2).join(''); }
  function disegnaPannello() {
    pann.innerHTML =
      '<div class="sup-testa"><h2 id="sup-tit">Rendi la pagina comoda per te</h2><button type="button" class="sup-x" data-chiudi aria-label="Chiudi">✕</button></div>' +
      gruppo('Testo') +
      '<h3>Grandezza del testo</h3><div class="sup-scelte" role="group" aria-label="Grandezza del testo">' +
        ZETE.map(function (t, i) { return '<button type="button" data-z="' + i + '" aria-pressed="' + (stato.z === i ? 'true' : 'false') + '" style="font-size:' + (14 + i * 2) + 'px" aria-label="Testo ' + (i ? 'più grande, livello ' + i : 'normale') + '">' + t + '</button>'; }).join('') + '</div>' +
      '<h3>Colore della pagina</h3><div class="sup-scelte" role="group" aria-label="Colore della pagina">' +
        Object.keys(TEMI).map(function (t) { return '<button type="button" data-tema="' + t + '" aria-pressed="' + (stato.tema === t ? 'true' : 'false') + '"><span class="sw" style="background:' + COLORI[t] + '"></span>' + TEMI[t] + '</button>'; }).join('') + '</div>' +
      gruppo('Lettura') +
      '<div class="sup-az"><button type="button" class="pieno" data-leggi>🔊 Leggi quello che ho selezionato</button><button type="button" data-zitto>🔇 Ferma la voce</button></div>' +
      gruppo('Calma') +
      '<div class="sup-az"><button type="button" data-ripristina>↺ Ripristina tutto</button></div>' +
      '<p class="sup-nota">Le tue scelte restano solo su questo dispositivo: nessuno le vede e il sito non le conserva.</p>';
  }
  function apri(v) {
    var aperto = v === undefined ? pann.hidden : v;
    pann.hidden = !aperto; btn.setAttribute('aria-expanded', aperto ? 'true' : 'false');
    if (aperto) { disegnaPannello(); var x = pann.querySelector('[data-chiudi]'); if (x) x.focus(); } else btn.focus();
  }
  function costruisci() {
    if (document.getElementById('sup-btn')) return;
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/aula/supporti.css'; document.head.appendChild(css);
    var tinta = document.createElement('div'); tinta.id = 'sup-tinta'; tinta.setAttribute('aria-hidden', 'true'); document.body.appendChild(tinta);
    btn = document.createElement('button'); btn.type = 'button'; btn.id = 'sup-btn'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'sup-pann');
    btn.setAttribute('aria-label', 'Rendi la pagina comoda per te: carattere, spazi, colori, voce'); btn.innerHTML = '<span aria-hidden="true">Aa</span><span class="sup-et">Leggi a modo tuo</span>';
    pann = document.createElement('div'); pann.id = 'sup-pann'; pann.hidden = true; pann.setAttribute('role', 'dialog'); pann.setAttribute('aria-labelledby', 'sup-tit');
    avviso = document.createElement('div'); avviso.id = 'sup-toast'; avviso.hidden = true; avviso.setAttribute('role', 'status');
    document.body.appendChild(btn); document.body.appendChild(pann); document.body.appendChild(avviso);
    btn.addEventListener('click', function () { apri(); });
    pann.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-chiudi')) return apri(false);
      if (t.hasAttribute('data-leggi')) return leggiSelezione();
      if (t.hasAttribute('data-zitto')) return tuttoZitto();
      if (t.hasAttribute('data-ripristina')) { stato = vuoto(); salva(); applica(); disegnaPannello(); dici('Tutto come prima'); return; }
      if (t.hasAttribute('data-k')) { var k = t.getAttribute('data-k'); stato[k] = stato[k] ? 0 : 1; }
      else if (t.hasAttribute('data-z')) stato.z = +t.getAttribute('data-z');
      else if (t.hasAttribute('data-tema')) stato.tema = t.getAttribute('data-tema');
      else return;
      salva(); applica();
      var f = t.getAttribute('data-k') ? '[data-k="' + t.getAttribute('data-k') + '"]' : t.hasAttribute('data-z') ? '[data-z="' + t.getAttribute('data-z') + '"]' : '[data-tema="' + t.getAttribute('data-tema') + '"]';
      var y = pann.scrollTop; disegnaPannello(); pann.scrollTop = y; var n = pann.querySelector(f); if (n) n.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pann.hidden) apri(false); });
    riga();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', costruisci); else costruisci();

  window.AULA_SUPPORTI = {
    ha: function (k) { return !!stato[k]; },
    velocita: velocita, ELENCO: ELENCO, TEMI: TEMI, PROFILI: PROFILI, ZETE: ZETE,
    comporta: comporta, leggiLista: leggiLista, apri: function () { if (pann) apri(true); }
  };
})();
