/* ════════════════════════════════════════════════════════
   LINGUE — script comune del minisito /lingue/
   - Le pagine usano <base href="/">: così il menu del sito madre
     (link relativi) funziona anche da qui. I link "#..." del menu
     vengono gestiti qui per restare nella pagina.
   - Barra del minisito a gruppi (con menu a tendina), lingua scelta una
     volta per tutto il minisito (L.linguaScelta, evento 'lingua'),
     voce del telefono (🔊), memoria locale delle preferenze.
   ════════════════════════════════════════════════════════ */
window.LINGUE_SITO = (function () {
  'use strict';
  var LINGUE = [
    { cod: 'en', nome: 'Inglese', nativo: 'English', voce: 'en-GB' },
    { cod: 'fr', nome: 'Francese', nativo: 'Français', voce: 'fr-FR' },
    { cod: 'es', nome: 'Spagnolo', nativo: 'Español', voce: 'es-ES' },
    { cod: 'de', nome: 'Tedesco', nativo: 'Deutsch', voce: 'de-DE' }
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

  /* barra del minisito: cinque voci, tre con menu a tendina, più la lingua */
  var GRUPPI = [
    { id: 'home', ic: '🏠', nome: 'Home', pagine: [['index', '🏠', 'Home del minisito', '']] },
    { id: 'impara', ic: '📖', nome: 'Impara', pagine: [['vocabolario', '📖', 'Vocabolario', 'Le frasi di sala, cucina, pasticceria, reception e bar'], ['dialoghi', '💬', 'Dialoghi', 'Una scena di lavoro per ambito, a due voci'], ['illustrato', '🖼️', 'Il ristorante illustrato', 'Tocca un oggetto e ascolta il suo nome']] },
    { id: 'allenati', ic: '🎯', nome: 'Allenati', pagine: [['esercizi', '✏️', 'Esercizi', 'Scelta multipla, abbinamento, riordina, ascolta e scrivi'], ['imprevisti', '🎭', 'Imprevisti', 'Storie a scelta: rispondi al cliente nel modo giusto']] },
    { id: 'risorse', ic: '🌐', nome: 'Risorse', pagine: [['risorse', '🌐', 'Risorse', '']] },
    { id: 'docenti', ic: '👩‍🏫', nome: 'Docenti', pagine: [['verifiche', '📝', 'Verifiche in un clic', 'Verifiche pronte da stampare, in più file'], ['docenti', '👩‍🏫', 'Area docenti', 'Cosa arriverà con l\'accesso dei docenti']] }
  ];
  function url(p) { return 'lingue/' + (p === 'index' ? '' : p + '.html'); }

  /* lingua scelta: una sola per tutto il minisito */
  function linguaScelta() { var c = leggi('lingua', 'en'); return lingua(c) ? c : 'en'; }
  function impostaLingua(c) {
    if (!lingua(c)) return;
    salva('lingua', c);
    var b = document.getElementById('lg-lin-btn'); if (b) b.innerHTML = '<span aria-hidden="true">🌍</span><b>' + c.toUpperCase() + '</b>';
    document.querySelectorAll('[data-lgl]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.lgl === c); });
    document.dispatchEvent(new CustomEvent('lingua', { detail: c }));
  }

  var CSS_NAV = '' +
    '.lg-nav{position:relative!important;top:auto!important}' +
    '.lg-nav-in{display:flex;justify-content:space-between;gap:.15rem;overflow:visible}' +
    '.lg-nav .lg-g{position:static}' +
    '.lg-nav .lg-gb{display:flex;flex-direction:column;align-items:center;gap:.1rem;font:700 .7rem var(--fu);color:var(--bosco);background:transparent;border:0;border-radius:12px;padding:.4rem .55rem;cursor:pointer;text-decoration:none;min-width:58px;white-space:nowrap}' +
    '.lg-nav .lg-gb>span{font-size:1.15rem;line-height:1}' +
    '.lg-nav .lg-gb small{font-size:.55rem;opacity:.6}' +
    '.lg-nav .lg-gb:hover{background:rgba(44,62,45,.06)}' +
    '.lg-nav .lg-gb[aria-current]{background:var(--bosco);color:#fff}' +
    '.lg-nav .lg-gb[aria-expanded=true]{background:rgba(212,170,74,.18)}' +
    '.lg-nav .lg-gb[aria-current][aria-expanded=true]{background:var(--bosco2)}' +
    '.lg-nav .lg-lin{flex-direction:row;gap:.3rem;border:1.5px solid var(--av3);background:#fff;align-self:center;padding:.45rem .65rem}' +
    '.lg-menu{position:absolute;left:0;right:0;top:100%;background:#fff;border-bottom:1px solid var(--av3);box-shadow:0 14px 30px rgba(44,62,45,.14);padding:.6rem 1rem .9rem;display:none;animation:lgGiu .18s ease}' +
    '.lg-menu.aperto{display:block}' +
    '@keyframes lgGiu{from{opacity:0;transform:translateY(-6px)}}' +
    '.lg-menu-in{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr));gap:.4rem}' +
    '.lg-menu a,.lg-menu button{display:flex;gap:.7rem;align-items:flex-start;text-align:left;padding:.7rem .8rem;border-radius:12px;text-decoration:none;color:var(--txt);border:1.5px solid transparent;background:var(--av);font-family:var(--fu);cursor:pointer}' +
    '.lg-menu a:hover,.lg-menu button:hover{border-color:var(--oro)}' +
    '.lg-menu a[aria-current],.lg-menu button[aria-pressed=true]{border-color:var(--bosco);background:#eef3ee}' +
    '.lg-menu .i{font-size:1.3rem;line-height:1.2}' +
    '.lg-menu a>span:last-child,.lg-menu button>span:last-child{min-width:0;flex:1;overflow-wrap:anywhere}' +
    '.lg-menu b{display:block;font-size:.88rem;color:var(--bosco)}' +
    '.lg-menu small{display:block;font-size:.74rem;color:var(--txt2);line-height:1.4;margin-top:.1rem}' +
    '.lg-menu-tit{max-width:900px;margin:0 auto .4rem;font:800 .6rem var(--fu);letter-spacing:.12em;text-transform:uppercase;color:var(--oro)}' +
    '@media (max-width:420px){.lg-nav .lg-gb{min-width:0;padding:.4rem .4rem;font-size:.64rem}.lg-nav-in{padding:.45rem .5rem}}' +
    /* sul telefono i pulsanti tondi fissi del sito stanno sul bordo destro: il testo dei menu non ci finisce sotto */
    '@media (max-width:760px){.lg-menu{padding-right:68px}}';

  function nav() {
    var box = document.querySelector('[data-lingue-nav]'); if (!box) return;
    var qui = document.body.dataset.lingue || 'index';
    var s = document.createElement('style'); s.textContent = CSS_NAV; document.head.appendChild(s);
    var lin = linguaScelta();
    var h = '<nav class="lg-nav" aria-label="Sezioni del minisito Lingue"><div class="lg-nav-in">';
    GRUPPI.forEach(function (g) {
      var mio = g.pagine.some(function (p) { return p[0] === qui; });
      if (g.pagine.length === 1) {
        h += '<a class="lg-gb" href="' + url(g.pagine[0][0]) + '"' + (mio ? ' aria-current="page"' : '') + '><span aria-hidden="true">' + g.ic + '</span>' + g.nome + '</a>';
      } else {
        h += '<button type="button" class="lg-gb" data-gruppo="' + g.id + '" aria-expanded="false" aria-controls="lg-m-' + g.id + '"' + (mio ? ' aria-current="true"' : '') + '><span aria-hidden="true">' + g.ic + '</span>' + g.nome + ' ▾</button>';
      }
    });
    h += '<button type="button" class="lg-gb lg-lin" id="lg-lin-btn" data-gruppo="lingua" aria-expanded="false" aria-controls="lg-m-lingua" aria-label="Lingua"><span aria-hidden="true">🌍</span><b>' + lin.toUpperCase() + '</b></button></div>';
    GRUPPI.forEach(function (g) {
      if (g.pagine.length < 2) return;
      h += '<div class="lg-menu" id="lg-m-' + g.id + '"><p class="lg-menu-tit">' + g.ic + ' ' + g.nome + '</p><div class="lg-menu-in">' + g.pagine.map(function (p) {
        return '<a href="' + url(p[0]) + '"' + (p[0] === qui ? ' aria-current="page"' : '') + '><span class="i" aria-hidden="true">' + p[1] + '</span><span><b>' + esc(p[2]) + '</b><small>' + esc(p[3]) + '</small></span></a>';
      }).join('') + '</div></div>';
    });
    h += '<div class="lg-menu" id="lg-m-lingua"><p class="lg-menu-tit">🌍 La lingua da studiare · vale per tutto il minisito</p><div class="lg-menu-in">' + LINGUE.map(function (l) {
      return '<button type="button" data-lgl="' + l.cod + '" aria-pressed="' + (l.cod === lin) + '"><span class="i" aria-hidden="true">' + l.cod.toUpperCase() + '</span><span><b>' + l.nome + '</b><small>' + l.nativo + '</small></span></button>';
    }).join('') + '</div></div></nav>';
    box.innerHTML = h;
    var bar = box.querySelector('.lg-nav');
    function chiudi() { bar.querySelectorAll('.lg-menu.aperto').forEach(function (m) { m.classList.remove('aperto'); }); bar.querySelectorAll('[data-gruppo]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-gruppo]');
      if (b) {
        var m = document.getElementById('lg-m-' + b.dataset.gruppo), era = m.classList.contains('aperto');
        chiudi(); if (!era) { m.classList.add('aperto'); b.setAttribute('aria-expanded', 'true'); }
        return;
      }
      var l = e.target.closest('[data-lgl]');
      if (l) { impostaLingua(l.dataset.lgl); setTimeout(chiudi, 150); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.lg-nav')) chiudi(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudi(); });
    /* la barra si ferma sotto l'intestazione del sito madre (anch'essa fissa) */
    /* resta visibile scorrendo: «sticky» va sul contenitore (figlio di <main>), non sulla barra,
       che altrimenti non avrebbe spazio per restare ferma */
    box.style.position = 'sticky'; box.style.zIndex = '40';
    function sotto() { var hd = document.getElementById('hdr'); box.style.top = (hd ? hd.offsetHeight : 0) + 'px'; }
    sotto(); window.addEventListener('resize', sotto); setTimeout(sotto, 800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', nav); else nav();

  /* le etichette delle lingue nell'intestazione diventano pulsanti di scelta */
  function bandiere() {
    document.querySelectorAll('.lg-bandiere span').forEach(function (sp) {
      var l = LINGUE.filter(function (x) { return x.nativo === sp.textContent.trim(); })[0]; if (!l) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'lg-ban'; b.dataset.ban = l.cod; b.textContent = l.nativo;
      b.setAttribute('aria-pressed', l.cod === linguaScelta()); b.title = 'Studia in ' + l.nome.toLowerCase();
      sp.replaceWith(b);
    });
    var st = document.createElement('style');
    st.textContent = '.lg-bandiere .lg-ban{font:800 .62rem var(--fu);letter-spacing:.1em;text-transform:uppercase;border:1px solid rgba(212,170,74,.45);color:var(--oro3);background:transparent;border-radius:999px;padding:.32rem .75rem;cursor:pointer}.lg-bandiere .lg-ban[aria-pressed=true]{background:var(--oro);border-color:var(--oro);color:#1a2e1b}';
    document.head.appendChild(st);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-ban]'); if (b) impostaLingua(b.dataset.ban); });
  document.addEventListener('lingua', function (e) { document.querySelectorAll('[data-ban]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ban === e.detail); }); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bandiere); else bandiere();

  /* Righe orizzontali che escono dallo schermo (barra del minisito, ambiti,
     sezioni, lingue): niente movimento continuo, che disorienta.
     - Sfumatura e freccia "›" sul bordo destro finché c'è altro da vedere,
       "‹" a sinistra quando si è già scorso: un clic sposta la riga.
     - Un solo accenno, la prima volta che la riga entra nello schermo: scivola
       un poco e torna, una riga alla volta (mai insieme). Poi resta ferma.
     - Con "riduci movimento" resta solo la sfumatura. */
  var RIGHE = '.lg-chips.scorre, #ps-ambiti, #ps-sezioni';
  var fermo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CSS_RIGHE = '.lg-altro{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 44px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 44px),transparent)}' +
    '.lg-prima{-webkit-mask-image:linear-gradient(90deg,transparent,#000 44px);mask-image:linear-gradient(90deg,transparent,#000 44px)}' +
    '.lg-altro.lg-prima{-webkit-mask-image:linear-gradient(90deg,transparent,#000 44px,#000 calc(100% - 44px),transparent);mask-image:linear-gradient(90deg,transparent,#000 44px,#000 calc(100% - 44px),transparent)}' +
    '.lg-freccia{position:absolute;top:50%;transform:translateY(-50%);width:32px;height:32px;padding:0;border:0;border-radius:50%;background:var(--bosco,#2C3E2D);color:#fff;font:800 18px/32px sans-serif;text-align:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:opacity .25s;z-index:2}' +
    '.lg-freccia.on{opacity:.92;pointer-events:auto}.lg-freccia:hover{opacity:1}.lg-riga-box{position:relative}';
  function freccia(el, verso) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lg-freccia';
    b.textContent = verso > 0 ? '›' : '‹'; b.setAttribute('aria-label', verso > 0 ? 'Mostra le voci successive' : 'Mostra le voci precedenti');
    b.addEventListener('click', function () {
      el._toccato = true;
      var da = el.scrollLeft, passo = verso * Math.max(120, el.clientWidth * .7);
      el.scrollBy({ left: passo, behavior: fermo ? 'auto' : 'smooth' });
      /* se l'animazione non parte (browser che la sospende), si sposta direttamente */
      setTimeout(function () { if (Math.abs(el.scrollLeft - da) < 2) el.scrollTo({ left: da + passo, behavior: 'auto' }); }, 500);   /* «auto» annulla l'animazione rimasta in sospeso */
    });
    return b;
  }
  var visti = new WeakSet(), coda = [], inCorso = false;
  function sistema(el) {
    if (!el.parentNode) return;
    var box = el.parentNode;
    if (!box.classList.contains('lg-riga-box') && getComputedStyle(box).position === 'static') box.classList.add('lg-riga-box');
    if (!el._fr) el._fr = [freccia(el, -1), freccia(el, 1)];
    var sx = el._fr[0], dx = el._fr[1], y = (el.offsetTop + el.offsetHeight / 2) + 'px';
    [sx, dx].forEach(function (f) { if (f.parentNode !== box) box.appendChild(f); f.style.top = y; });
    sx.style.left = (el.offsetLeft + 2) + 'px';
    dx.style.left = (el.offsetLeft + el.clientWidth - 34) + 'px';
    var altro = el.scrollWidth - el.clientWidth - el.scrollLeft > 6, prima = el.scrollLeft > 6;
    el.classList.toggle('lg-altro', altro); dx.classList.toggle('on', altro);
    el.classList.toggle('lg-prima', prima); sx.classList.toggle('on', prima);
  }
  function accenno() {
    if (inCorso || !coda.length) return;
    var el = coda.shift(); if (el._toccato || el.scrollWidth - el.clientWidth < 8) return accenno();
    inCorso = true;
    var da = el.scrollLeft, a = Math.min(da + 70, el.scrollWidth - el.clientWidth);
    el.scrollTo({ left: a, behavior: 'smooth' });
    setTimeout(function () { if (!el._toccato) el.scrollTo({ left: da, behavior: 'smooth' }); }, 650);   /* se l'utente è intervenuto, non lo si contraddice */
    setTimeout(function () { inCorso = false; accenno(); }, 1500);
  }
  function osserva() {
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting || visti.has(v.target)) return;
        visti.add(v.target);
        if (!fermo && v.target.scrollWidth - v.target.clientWidth > 8) { coda.push(v.target); setTimeout(accenno, 700); }
      });
    }, { threshold: .9 }) : null;
    function aggiorna() {
      document.querySelectorAll(RIGHE).forEach(function (el) {
        if (!el._legato) {
          el._legato = true; el.addEventListener('scroll', function () { sistema(el); }, { passive: true }); if (io) io.observe(el);
          ['pointerdown', 'touchstart', 'wheel'].forEach(function (t) { el.addEventListener(t, function () { el._toccato = true; }, { passive: true }); });
        }
        sistema(el);
      });
    }
    var s = document.createElement('style'); s.textContent = CSS_RIGHE; document.head.appendChild(s);
    aggiorna(); setInterval(aggiorna, 1200); window.addEventListener('resize', aggiorna);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', osserva); else osserva();

  return { LINGUE: LINGUE, esc: esc, leggi: leggi, salva: salva, lingua: lingua, mescola: mescola, parla: parla, ascolta: ascolta, play: play, voce: voce, linguaScelta: linguaScelta, impostaLingua: impostaLingua };
})();
