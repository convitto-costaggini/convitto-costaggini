/* ════════════════════════════════════════════════════════
   PULIZIA DELL'APP — il sito non è più installabile come app.
   Su chi aveva già la versione precedente: toglie il service worker,
   cancella le copie salvate e la preferenza dell'invito.
   Non mostra nulla e non salva nulla.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then(function (rs) {
        rs.forEach(function (r) { r.unregister(); });
      }).catch(function () {});
    }
    if (window.caches && caches.keys) {
      caches.keys().then(function (k) {
        k.forEach(function (n) { if (/^convitto-/.test(n)) caches.delete(n); });
      }).catch(function () {});
    }
    localStorage.removeItem('convitto-app-v1');
  } catch (e) {}
})();

/* ════════════════════════════════════════════════════════
   ANTISPAM INTERNO (lato sito)
   Ai moduli pubblici che inviano i dati al gestionale (indirizzo
   script.google.com) aggiunge il campo "tMs": i millisecondi trascorsi
   dall'apertura della pagina all'invio. Il gestionale lo usa per
   riconoscere gli invii istantanei dei bot (vedi AntispamInterno.gs).
   Non raccoglie nulla sul visitatore, non usa cookie né servizi esterni,
   non cambia il comportamento dei moduli. Se qualcosa va storto, l'invio
   parte comunque com'era.
   ════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  try {
    var t0 = Date.now();
    var fetchOriginale = window.fetch;
    if (typeof fetchOriginale !== 'function') return;
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : ((input && input.url) || '');
        if (url.indexOf('script.google.com/') !== -1 &&
            init && typeof init.body === 'string' && init.body.charAt(0) === '{') {
          var dati = JSON.parse(init.body);
          // Solo moduli pubblici: niente richieste dell'area admin (adminToken)
          // né del totem (token). Non dipende dal reCAPTCHA, così resta valido
          // anche quando il reCAPTCHA sarà tolto.
          if (dati && typeof dati === 'object' && !Array.isArray(dati) &&
              !dati.adminToken && !dati.token && dati.tMs === undefined) {
            dati.tMs = Date.now() - t0;
            init = Object.assign({}, init, { body: JSON.stringify(dati) });
          }
        }
      } catch (e) {}
      return fetchOriginale.call(this, input, init);
    };
  } catch (e) {}
})();
