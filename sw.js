/* ════════════════════════════════════════════════════════
   SERVICE WORKER DISATTIVATO — il sito non è più installabile come app.
   Questo file resta solo per spegnere la versione precedente sui
   dispositivi che l'avevano già: si attiva subito, cancella tutte le
   copie salvate e si disiscrive. Non intercetta nessuna richiesta,
   quindi le pagine arrivano sempre direttamente dal sito.
   Non cancellare questo file: senza di lui i dispositivi con la vecchia
   versione continuerebbero a usarla.
   ════════════════════════════════════════════════════════ */
self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (k) { return Promise.all(k.map(function (n) { return caches.delete(n); })); })
      .then(function () { return self.registration.unregister(); })
      .catch(function () {})
  );
});
