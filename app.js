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
