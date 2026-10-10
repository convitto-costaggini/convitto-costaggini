/* ════════════════════════════════════════════════════════
   SERVICE WORKER — il sito come app sul telefono
   - Pagine, CSS e JS: prima la rete (si vede sempre la versione
     aggiornata), la copia salvata solo quando manca la connessione.
   - Immagini e caratteri: subito dalla copia salvata, aggiornata in
     background (e cancellata se sul sito l'immagine non c'è più).
   - Mai salvati: altri siti (Supabase, YouTube, mappe), le pagine
     riservate (admin, area riservata, totem, richieste di accesso)
     audio, video e PDF, e tutto ciò che non è una semplice lettura
     (moduli inviati).
   Per forzare un aggiornamento completo delle copie: cambiare VERSIONE.
   ════════════════════════════════════════════════════════ */
var VERSIONE = 'convitto-v1';
var ESSENZIALI = [
  'offline.html', 'index.html', 'giornata-tipo.html', 'genitori.html', 'accoglienza.html',
  'rieti-libera-uscita.html', 'contatti.html',
  'style.min.css', 'fonts.css', 'nav-header.min.js', 'nav.min.js', 'app.js',
  'valigia.js', 'calendario-scolastico.js', 'favicon.ico', 'icon-192.png'
];
var RISERVATE = /\/(admin|area-riservata|totem|richiesta-accesso|google[0-9a-f]+)\.html$/;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSIONE).then(function (c) {
    /* una pagina che non si scarica non deve bloccare l'installazione */
    return Promise.all(ESSENZIALI.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n !== VERSIONE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

function salva(req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    var copia = res.clone();
    caches.open(VERSIONE).then(function (c) { c.put(req, copia); });
  }
  return res;
}

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (RISERVATE.test(url.pathname) || url.pathname.indexOf('/gestionale/') === 0 || url.pathname.indexOf('/supabase/') === 0) return;
  /* audio, video e PDF: troppo pesanti da tenere sul telefono */
  if (/\.(mp4|webm|mov|mp3|m4a|ogg|wav|pdf)$/i.test(url.pathname)) return;

  var pagina = req.mode === 'navigate';
  var statico = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)$/i.test(url.pathname);

  if (statico) {
    /* subito la copia salvata, intanto si ricontrolla il sito: se l'immagine
       è stata cambiata si aggiorna, se è stata tolta (404) si cancella anche qui */
    var rete = fetch(req).then(function (r) {
      if (r.status === 404 || r.status === 410) caches.open(VERSIONE).then(function (c) { c.delete(req); });
      return salva(req, r);
    });
    e.waitUntil(rete.catch(function () {}));
    e.respondWith(caches.match(req).then(function (c) { return c || rete; }));
    return;
  }
  /* "no-cache": il browser chiede sempre al sito se il file è cambiato (risposta
     veloce se non lo è), così dopo ogni modifica la versione nuova arriva subito */
  var fresca = new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' });
  e.respondWith(fetch(fresca).then(function (r) { return salva(req, r); }).catch(function () {
    /* "?app=1" e simili: la copia salvata non dipende dai parametri */
    var chiave = url.pathname === '/' ? 'index.html' : req;
    return caches.match(chiave, { ignoreSearch: true }).then(function (c) {
      return c || (pagina ? caches.match('offline.html') : Response.error());
    });
  }));
});
