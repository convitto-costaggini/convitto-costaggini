/* ════════════════════════════════════════════════════════
   IL SITO COME APP — registrazione del service worker (sw.js)
   e invito discreto ad aggiungere il sito alla schermata Home.
   - Se il browser offre l'installazione diretta (Chrome, di solito dopo
     ~30 secondi e un tocco): pulsante "Installa".
   - Altrimenti, su qualsiasi telefono: istruzioni con i due tocchi giusti
     per quel browser (iPhone, Samsung Internet, Firefox, Chrome).
   L'invito compare dalla seconda pagina visitata. Chi lo chiude ("Non ora",
   "Ho capito") o rifiuta la finestra di installazione del browser non lo
   rivede più: resta solo il pulsante nelle pagine (es. Per i Genitori). Un qualsiasi elemento con l'attributo
   data-app-installa diventa un pulsante "installa" (es. Per i Genitori).
   Le preferenze restano solo nel browser (localStorage).
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }

  var CH = 'convitto-app-v1';
  function leggi() { try { return JSON.parse(localStorage.getItem(CH) || '{}') || {}; } catch (e) { return {}; } }
  function salva(st) { try { localStorage.setItem(CH, JSON.stringify(st)); } catch (e) {} }

  var installata = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ua = navigator.userAgent;
  var telefono = ios || /android|mobi/i.test(ua);
  var richiesta = null;
  var st = leggi();
  st.pagine = (st.pagine || 0) + 1; salva(st);
  /* per la pagina di controllo diagnostica-app.html */
  window.CONVITTO_APP = {
    versione: '4',
    info: function () { return { telefono: telefono, ios: ios, installata: installata, installazioneDiretta: !!richiesta, preferenze: leggi() }; },
    mostra: function () { mostra(true); }
  };
  if (installata) { document.documentElement.classList.add('app-installata'); return; }

  var CSS = '' +
    '.app-toast{position:fixed;left:16px;right:84px;bottom:16px;z-index:9000;max-width:380px;background:#2C3E2D;color:#F5F0E8;border:1px solid rgba(212,170,74,.45);border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.28);padding:.95rem 1rem .9rem;font-family:var(--fu,sans-serif);transform:translateY(140%);transition:transform .35s ease}' +
    '.app-toast.su{transform:none}' +
    '.app-toast-t{display:flex;gap:.7rem;align-items:flex-start}' +
    '.app-toast img{width:40px;height:40px;border-radius:9px;flex-shrink:0}' +
    '.app-toast b{display:block;font-size:.88rem;color:#EDD98A;margin-bottom:.15rem}' +
    '.app-toast p{margin:0;font-size:.78rem;line-height:1.5;color:rgba(245,240,232,.85)}' +
    '.app-toast-b{display:flex;justify-content:flex-end;gap:.5rem;margin-top:.7rem}' +
    '.app-toast button{font:800 .62rem var(--fu,sans-serif);letter-spacing:.1em;text-transform:uppercase;padding:.55rem .9rem;border-radius:8px;cursor:pointer;border:1px solid rgba(245,240,232,.35);background:transparent;color:#F5F0E8}' +
    '.app-toast button.si{background:#B8922A;border-color:#B8922A;color:#fff}' +
    '.app-ios-ico{display:inline-block;vertical-align:-3px;width:15px;height:15px}' +
    '@media (prefers-reduced-motion:reduce){.app-toast{transition:none}}' +
    '@media print{.app-toast{display:none}}';
  var ICO_CONDIVIDI = '<svg class="app-ios-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Condividi"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';

  function mostra(forzato) {
    if (document.querySelector('.app-toast')) return;
    if (!richiesta && !telefono) return;
    if (!forzato && (st.pagine < 2 || st.rifiutato || st.noFinoA)) return;
    if (!document.getElementById('app-toast-css')) { var s = document.createElement('style'); s.id = 'app-toast-css'; s.textContent = CSS; document.head.appendChild(s); }
    var t = document.createElement('div');
    t.className = 'app-toast'; t.setAttribute('role', 'dialog'); t.setAttribute('aria-label', 'Aggiungi il sito alla schermata Home');
    var diretta = !!richiesta;
    var testo = diretta ? 'Si apre come un\'app: valigia, giornata tipo e numeri utili anche senza connessione.'
      : ios ? 'Tocca ' + ICO_CONDIVIDI + ' <strong>Condividi</strong>, poi «<strong>Aggiungi alla schermata Home</strong>».'
      : /samsungbrowser/i.test(ua) ? 'Tocca il menu <strong>≡</strong> in basso, poi «<strong>Aggiungi pagina a</strong>» → «<strong>Schermata Home</strong>».'
      : /firefox|fxios/i.test(ua) ? 'Tocca il menu <strong>⋮</strong>, poi «<strong>Installa</strong>» (o «Aggiungi a schermata Home»).'
      : 'Tocca il menu <strong>⋮</strong> in alto a destra, poi «<strong>Aggiungi a schermata Home</strong>» (o «Installa app»).';
    t.innerHTML = '<div class="app-toast-t"><img src="icon-192.png" alt=""/><div><b>Il Convitto sul telefono</b><p>' + testo + '</p></div></div>' +
      '<div class="app-toast-b"><button type="button" data-a="no">' + (diretta ? 'Non ora' : 'Ho capito') + '</button>' + (diretta ? '<button type="button" class="si" data-a="si">📲 Installa</button>' : '') + '</div>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('su'); }); });
    t.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'si' && richiesta) {
        installa();
      } else {
        rifiuta();
      }
      t.classList.remove('su'); setTimeout(function () { t.remove(); }, 400);
    });
  }

  /* chi rifiuta non rivede più l'invito automatico */
  function rifiuta() { st.rifiutato = 1; salva(st); }
  function installa() {
    var r = richiesta; if (!r) return;
    r.prompt();
    r.userChoice.then(function (c) { if (c && c.outcome === 'dismissed') rifiuta(); }).catch(function () {}).then(function () { richiesta = null; });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); richiesta = e;
    document.querySelectorAll('[data-app-installa]').forEach(function (b) { b.hidden = false; });
    setTimeout(function () { mostra(false); }, 4000);
  });
  window.addEventListener('appinstalled', function () {
    richiesta = null;
    var t = document.querySelector('.app-toast'); if (t) t.remove();
    document.querySelectorAll('[data-app-installa]').forEach(function (b) { b.hidden = true; });
  });

  function avvia() {
    /* pulsanti "installa" nelle pagine: su ogni telefono; sul computer solo se il browser lo permette */
    document.querySelectorAll('[data-app-installa]').forEach(function (b) {
      b.hidden = !telefono && !richiesta;
      b.addEventListener('click', function () { if (richiesta) installa(); else mostra(true); });
    });
    if (telefono) setTimeout(function () { mostra(false); }, 4000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
